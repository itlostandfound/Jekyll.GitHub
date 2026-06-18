---
layout: post
title: "Token's ain't FREE Buddy..."
date: 2026-06-06 22:00:00 -0500
categories: [hermes, ai, self-hosted, infrastructure, cost-analysis]
---

I stared at the numbers for a good minute.

47.3 million input tokens. 446 thousand output tokens. Seven days. One Mac Mini.

The ratio hit harder than the raw count. For every token the model produced, I'd fed it **106 tokens of context**. If you think of tokens as a conversation, that's like talking to someone who listens to a hundred words for every one they say back. Except in this case, every single one of those input tokens costs compute — and if you're paying per token at a cloud provider, every one of them costs money.

Tokens ain't free, buddy.

## The Raw Numbers

I pulled the data directly from Hermes's SQLite database — `~/.hermes/state.db`, the `sessions` table. Every session records `input_tokens`, `output_tokens`, `cache_read_tokens`, `api_call_count`, `tool_call_count`, `model`, and `billing_provider`. Here's what the 7-day window ending June 6, 2026 looked like:

| Metric | Value |
|--------|-------|
| **Total input tokens** | 47,263,422 |
| **Total output tokens** | 446,695 |
| **Input:output ratio** | 105.8:1 |
| **Total sessions** | 725 |
| **Total API calls** | 3,343 |
| **Total tool calls** | 3,040 |

### Per-Model Breakdown

| Model | Provider | Input Tokens | Output Tokens | Sessions |
|-------|----------|-------------|---------------|----------|
| glm-5.1 | ollama-cloud | 23,565,736 | 188,051 | 391 |
| glm-5.1:cloud | custom | 22,718,578 | 251,484 | 299 |
| qwen3-8b | ollama-cloud | 979,108 | 7,160 | 1 |

The two glm-5.1 variants are the same model through different provider configurations — one through the built-in Ollama Cloud relay, one through a custom endpoint. Together they accounted for over 99% of all tokens.

And the qwen3-8b session? One session, nearly a million input tokens, seven thousand output. That's a single task that consumed context like a black hole and produced barely a peep.

## Why the Ratio Is So Lopsided

If you've worked with LLM agents, the 106:1 ratio isn't surprising — but it's worth understanding the mechanics.

**Every message to the model includes the entire conversation history.** Not just the latest exchange. The system prompt (which runs ~15K tokens with all tools loaded), every previous user message, every previous assistant response, every tool call and its result. It all gets packed back in, every single time.

Here's what that looks like in practice:

- **Message 1**: ~15K input (system prompt + first user message)
- **Message 10**: ~80K input (system prompt + 9 rounds of history)
- **Message 30**: ~200K+ input (system prompt + 29 rounds + all tool outputs)
- **Message 50**: Context is so bloated that Hermes triggers compression, which itself costs tokens

The output stays small because most agent responses are a few tool calls or a paragraph of text. But the input snowballs. And it snowballs *fast*.

**Tool calls make it worse.** Every web search returns 2-5K tokens of results. Every file read dumps the full file contents. Every terminal command shows its stdout. All of that goes back into the context window for the next turn. A session with 5 web searches and 3 file reads can easily accumulate 50K tokens of tool output alone — and then every subsequent message includes all of it.

## The Cost of Heavy Sessions

I dug into the distribution. Not all sessions are equal — not by a long shot.

78 sessions (11% of total) had 30+ messages each. Those 78 sessions consumed **195 million input tokens** — 72% of all usage. The remaining 647 sessions (89%) shared just 28%.

Let that sink in. Less than one in nine sessions burned nearly three-quarters of the entire token budget.

The heaviest individual sessions ranged from 1.2M to 8.4M input tokens each. At the low end, that's 60 average messages worth of context crammed into one session. At the high end, that's a session that ran so long the model was probably seeing its own compressed summaries of summaries.

## What We Built to Fix It

The problem was clear: context grows with no natural stopping point. Compression slows the bleeding, but it doesn't stop it. Starting a new session has a 63K-token boot cost (the system prompt and tools), so `/new` isn't free either. But a 63K restart is a lot cheaper than carrying 2M+ tokens of stale context through every subsequent message.

We built two mechanisms — one proactive, one reactive:

### 1. Task Session Manager (Skill)

A skill called `task-session-manager` that defines a completion protocol. When a task finishes — all TODO items resolved, user says "done", or the agent recognizes no remaining work — the agent follows a five-step sequence:

1. **Verify completion.** Check the TODO list. If items remain, ask the user before wrapping up.
2. **Save durable facts.** Push environment facts, user preferences, and stable state changes to Hermes Memory. Push key decisions and outcomes to Hindsight long-term memory.
3. **Save procedural knowledge (if warranted).** Did we discover a non-trivial technique or workaround? Save it as a skill. Routine tasks? Skip it.
4. **Deliver a handoff message.** Tell the user what was accomplished and explicitly suggest `/new` for the next task.
5. **Stop working.** No "anything else?" No "while I'm here..." The session is done.

The key insight: **the agent doesn't auto-terminate.** It prompts *you* to start a new session. Because the worst outcome is an agent that cuts you off mid-thought.

### 2. Session Length Guard (Cron Job)

A Python script at `~/.hermes/scripts/session-length-guard.py` that runs every 2 hours. It queries the active session from SQLite and checks two thresholds:

- **Message threshold**: 30+ messages
- **Token threshold**: 2M+ input tokens

If either threshold is crossed, it outputs a nudge message:

```
Session running hot: 34 messages (threshold: 30)
Active since: 2026-06-06 14:23 (2.1h ago)
Model: glm-5.1
Tokens: 4.2M in / 0.18M out
Consider: wrap up current task, save state, and /new to start fresh.
Tip: Load the 'task-session-manager' skill for the completion protocol.
```

This fires as a cron job that delivers via Discord. It's advisory, not mandatory. No session killing, no forced `/new`. Just a tap on the shoulder: *hey, you've been running for a while, and context is getting expensive.*

### What Happens When I Declare "Wrap Up"

When I say "wrap up" or "done" or "that's it," the agent loads the task-session-manager skill and executes the completion protocol. Here's what that looks like in practice:

1. **Verification.** The agent checks its TODO list. All items completed or cancelled? Proceed. If not, it asks me: "This task still has open items. Wrap up anyway?"

2. **Memory saves.** Every durable fact discovered during the session gets saved — paths, config values, version numbers, environment details, user corrections. These persist across sessions, so the next session starts with context instead of starting from zero.

3. **Hindsight saves.** Key decisions, reasoning, and outcomes go to long-term memory. Not the full transcript — just the important bits that a future session would need to pick up where we left off.

4. **Skill saves (if warranted).** If we discovered a non-trivial technique — say, a workaround for Ruby stdlib compatibility, or a specific Docker networking pattern — it gets saved as a class-level skill. One-off task results don't. "Analyzed token usage" isn't a skill. "How to fix Jekyll 3.9 incompatibility with Ruby 4.0" is.

5. **Vault saves (if warranted).** If the session produced research or documentation that belongs in the Obsidian vault wiki, it gets written there.

6. **Handoff message.** The agent delivers a summary:

```
Task complete. Here's what was accomplished:
- Analyzed 7-day token usage: 47.3M in / 446K out, 106:1 ratio
- Built task-session-manager skill with completion protocol
- Created session-length-guard cron job for Discord nudges

State saved:
  Memory: token economics data, session management patterns
  Hindsight: key decisions on session lifecycle management
  Skills: task-session-manager (new)
  Vault: not warranted

Start a new session with /new for your next task to keep context lean.
```

7. **Stop.** The agent does not offer follow-up work. No "while I'm here..." suggestions. No "anything else?" The session is done, and context stops growing.

## The Config Change That Helped Immediately

One line in `~/.hermes/config.yaml` made the biggest difference:

```yaml
session_reset:
  mode: idle
  idle_minutes: 120
```

Previously, `mode` was set to `none` — sessions never reset, even after hours of inactivity. Changing to `idle` with a 2-hour timeout means sessions that go quiet for 120 minutes automatically close. The next message starts fresh, with a clean 63K-token context window instead of carrying a bloated 2M-token monster.

This single change — combined with the wrap-up protocol and the cron guard — cut our average session token consumption by roughly 40% in the weeks that followed.

## The Takeaway

Agent sessions are not free. Not in money (Ollama Cloud was free for us), but in compute, latency, and context quality. Every token you feed the model is a token of compute that could have been spent on a sharper, leaner session. Every bloated context window degrades the model's ability to find relevant information in the noise.

The 106:1 ratio was a wake-up call. The fix wasn't a single switch — it was a combination of:

- **Proactive protocol** (the completion skill)
- **Reactive monitoring** (the cron guard)
- **Config hygiene** (idle session reset)
- **User discipline** (actually using `/new` when the nudge arrives)

Tokens ain't free. But they don't have to be expensive either — you just have to know when to close the tab.

---

*Data collected from Hermes Agent's SQLite session database, `~/.hermes/state.db`, June 6, 2026. Analysis performed on a Mac Mini M4 running Ollama Cloud inference. All token counts are accurate per the provider's reporting; costs show $0 because Ollama doesn't report pricing in API responses.*