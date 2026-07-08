---
layout: post
title: "Token Maxing — Hold Your Horses..."
date: 2026-07-07 12:30:00 -0500
categories: [hermes, ai, ollama, automation, self-hosted]
---

We hit a wall. Hard. And it wasn't the kind you see coming — there's no API, no dashboard, no programmable way to check how much Ollama Cloud quota you have left. You just get a 429 error and everything stops.

Here's the full story of what happened, what we discovered, and how we built a watchdog to make sure it never happens again.

## What We Were Doing

We had two Kanban dispatcher cron jobs running on Hermes Agent, powered by Ollama Cloud on the Pro plan ($20/mo):

- **PMO-Kanban-Dispatcher** — every 15 minutes, scanning the project board for tasks
- **BB-PM-Kanban-Dispatcher** — every 10 minutes, running the Boogie Board project manager

Each dispatcher call sends the full conversation context — system prompt, all prior messages, tool results — to the LLM. That's roughly 42,000 tokens per API call. With two dispatchers hitting the API every 10-15 minutes, the token burn adds up fast.

We were also doing interactive work — conversations, research, writing — all on the same Ollama Cloud account.

## What Happened

At 11:50 AM CT on July 7, the BB-PM dispatcher hit this:

```
HTTP 429: {"error":"you (My.Ollama.Account.Name) have reached your session usage limit,
upgrade for higher limits: https://ollama.com/upgrade or add extra usage:
https://ollama.com/settings (ref: Reference.ID)"}
```

The dispatcher retried 3 times with exponential backoff. All failed. Meanwhile, the PMO dispatcher was still burning tokens on the same account, making things worse.

**The root cause**: Two automated dispatchers sending ~42K tokens per call, every 10-15 minutes, accumulated enough GPU time to exhaust the 5-hour session limit within hours. And there was no way to see it coming.

## What We Discovered

### Ollama Cloud has no usage API

This was the biggest surprise. There is no `/api/account/usage` endpoint. You can't programmatically check your usage. GitHub issues [#12532](https://github.com/ollama/ollama/issues/12532) and [#15132](https://github.com/ollama/ollama/issues/15132) are open requests for this, but for now the only way to check is to log into [ollama.com/settings](https://ollama.com/settings) and look at percentages manually.

Ollama sends an email at 90% of your plan limit, but by then you're already almost out.

### Two limits, not one

Ollama Cloud enforces **two** independent limits:

| Window | Resets | Consequence of Exceeding |
|--------|--------|--------------------------|
| Session | Every 5 hours | Immediate 429 errors, wait up to 5 hours |
| Weekly | Every 7 days | Multi-day outage |

The session limit is the binding constraint. It resets every 5 hours, but you can blow through it fast with automated agents.

### Usage is GPU time, not tokens

This is subtle but critical. Ollama measures usage in GPU time, not token count. Heavier models (Level 4, like deepseek-v4-pro) consume ~4x more GPU time per token than lighter models (Level 1, like gpt-oss:20b). So token count is a **proxy**, not a direct measure. Our token-based estimates overestimate for light models and underestimate for heavy ones.

### The actual numbers

We parsed `~/.hermes/logs/agent.log` for lines matching `in=N out=N total=N` and measured:

| Metric | Value |
|--------|-------|
| API calls in 2 hours | 205 |
| Input tokens | 8,685,159 |
| Output tokens | 62,398 |
| **Total tokens** | **8,747,557** |
| Average per call | ~42,671 |

Input tokens dominated at 8.6M vs only 62K output. That's because every API call re-sends the full conversation context.

### Calibrating against real data

From the Ollama settings page, we read:
- **Session (5hr)**: 24.1%
- **Weekly (7d)**: 6.4%

Our logs showed:
- Session (5hr window): 13,574,960 tokens
- Weekly (7d window): 54,473,658 tokens

Working backwards from the real percentages, we derived the effective token ceilings:

```
Session ceiling: 13,574,960 / 0.241 = ~56M tokens per 5 hours
Weekly ceiling:  54,473,658 / 0.064 = ~849M tokens per week
```

The community estimate for the Max plan was ~1.25B tokens/week, but our calibrated measurement came in at ~849M. The difference is likely because community measurements used lighter models that consume less GPU time per token.

**Our initial estimate was wrong.** We first calculated ~36M tokens per session ceiling from "8.7M tokens in 2 hours = 24.1%", but that overcounted because the 5-hour session window includes lower-usage periods. The calibrated ceiling of ~56M is more accurate.

### Session is the danger zone

| Window | Current % | Resets In | Risk |
|--------|-----------|-----------|------|
| Session (5hr) | 24.1% | ~4 hours | **HIGH** — this is where 429s happen |
| Weekly (7d) | 6.4% | 5 days | Low — plenty of headroom |

Weekly burn rate with dispatchers: ~3.2%/day. Without dispatchers: ~1-2%/day. The session limit is where you get caught off guard because it resets frequently and automated agents can spike it rapidly.

## How We're Monitoring It Now

Since there's no API, we built a **hybrid watchdog** — automated tracking with manual calibration.

### The Ollama Usage Watchdog

A Python script at `~/.hermes/scripts/ollama-usage-watchdog.py` that:

1. Parses `agent.log` every 30 minutes (via cron, `no_agent=true` — zero token cost)
2. Counts tokens consumed in the last 5 hours (session) and 7 days (weekly)
3. Divides by calibrated token ceilings to estimate percentages
4. Compares against threshold levels
5. Delivers alerts to Discord when thresholds are crossed
6. Auto-pauses/resumes Kanban dispatcher cron jobs via `hermes cron pause/resume`

### Thresholds

We set different thresholds for each window. Session thresholds are higher because it resets every 5 hours (fast recovery). Weekly thresholds are lower because hitting the ceiling means waiting days.

| Level | Session (5hr) | Weekly (7d) | Action |
|-------|---------------|-------------|--------|
| OK | <60% | <40% | None |
| Soft Alert | 60% | 40% | Discord notification |
| Hard Alert | 75% | 55% | Attention needed |
| Auto-Pause | 85% | 70% | Kill Kanban dispatchers |
| Auto-Resume | <40% | — | Restart dispatchers after reset |

### Three modes

```bash
# Watchdog mode (runs via cron, silent unless threshold crossed)
python3 ollama-usage-watchdog.py

# Status mode (check current readings anytime)
python3 ollama-usage-watchdog.py status

# Calibrate mode (feed real % from ollama.com/settings)
python3 ollama-usage-watchdog.py calibrate 24.1 6.4
```

### How calibration works

Token-based estimates drift over time because token count ≠ GPU time. So once or twice a day, we check ollama.com/settings and feed the real percentages back:

```bash
python3 ollama-usage-watchdog.py calibrate <session_pct> <weekly_pct>
```

This recalculates the token ceilings: `ceiling = current_tokens / (real_percentage / 100)`

Current calibrated ceilings:
- Session: **55,984,946 tokens** (≈56M)
- Weekly: **848,565,640 tokens** (≈849M)

### Current readings (as of writing)

| Window | Estimated % | Tokens | API Calls | Status |
|--------|-------------|--------|-----------|--------|
| Session (5hr) | 25.2% | 14,082,401 | 321 | OK |
| Weekly (7d) | 6.5% | 54,898,230 | 1,454 | OK |

Both dispatchers are currently paused (manually, not by the watchdog).

## Lessons Learned

1. **Token count is a proxy, not a direct measure.** Build in margin. Our 50% safety margin in thresholds accounts for the token-to-GPU-time conversion.

2. **The session limit is the binding constraint**, not the weekly limit. It resets every 5 hours and automated agents can spike it fast.

3. **Agent workloads burn tokens much faster than interactive use.** Every call re-sends the full context. 42K tokens per call × 6 calls/hour = 252K tokens/hour just for one dispatcher.

4. **No usage API means build your own observability.** A hybrid approach — automated tracking plus manual calibration — is the pragmatic solution until Ollama adds an API.

5. **Calibrate with real data.** Our initial estimate of ~36M tokens/session was 36% low compared to the calibrated ~56M. Real percentages from the settings page ground the estimates in reality.

---

*The watchdog script runs every 30 minutes via cron with zero token cost. Alerts go to Discord. The dispatchers auto-pause at 85% session / 70% weekly and resume when the session resets below 40%. We went from surprise 429 errors to proactive quota management.*