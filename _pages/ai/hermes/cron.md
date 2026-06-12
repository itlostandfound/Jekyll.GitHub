---
layout: single
title: Cron & Automation
permalink: /ai/hermes/cron/
---

## Cron & Automation

Hermes runs scheduled jobs via a cron scheduler built into the gateway process. Jobs can run LLM-driven prompts or script-only watchdogs, delivering results to Discord, CLI, or other channels.

### Active Cron Jobs

| Job | Schedule | Type | Deliver To |
|---|---|---|---|
| PMO-Kanban-Dispatcher | Every 15 min | LLM agent | local |
| Hermes Service Watchdog | Hourly | Script-only | local |
| Hermes Playground Daily Backup | 8:00 AM daily | LLM agent | Discord |
| Claude Skills Daily Report | 8:30 AM weekdays | LLM agent | local |
| Monthly Ollama Model Review | 9:00 AM 1st/15th | LLM agent | local |
| Hermes Config Backup to Forgejo | 3:00 AM Sundays | LLM agent | local |
| Snoopy Research Cleanup | 3:00 AM daily | Script call | local |
| Session Length Guard | Every 120 min | Script-only | origin |
| Vault Daily Health | 6:00 AM daily | LLM agent | origin |
| Vault Weekly Digest | 8:00 AM Mondays | LLM agent | origin |
| Vault Wiki Curator | 7:00 AM Wednesdays | LLM agent | origin |

### Gateway Dependency

The cron scheduler runs **inside the Hermes gateway process**. If the gateway isn't running, no cron jobs fire — not even manual `cronjob action='run'` triggers. Always verify the gateway is running:

```bash
hermes gateway status
lsof -i :8642   # gateway API port
```

On macOS 26+ where `launchctl` is unreliable, the gateway must be started as a detached daemon (see `macos-detached-daemon` skill).

### Script-Only Jobs

Script-only jobs (`no_agent: true`) skip the LLM entirely — the scheduler just runs the script and delivers stdout. This means zero token cost for watchdogs and health checks. Empty stdout = silent (no delivery). Non-zero exit = error alert.

**Script path pitfall:** The `script` field resolves relative to `~/.hermes/scripts/`. Setting `script: "scripts/my-script.py"` results in the double path `~/.hermes/scripts/scripts/my-script.py`. Use just the filename: `script: "my-script.py"`.

### Cron Job Quality Pitfalls

LLM-driven cron jobs can produce low-quality output:

- **Hallucinated data** — The model invents status or metrics instead of actually checking
- **Doubled text** — The model re-summarizes itself when output gets long
- **Misapplied `[SILENT]`** — Using `[SILENT]` when there IS something to report, or combining it with content
- **`deliver: local` black hole** — Jobs delivered to `local` produce no visible notification; they just log silently

### Cron Prompt Security

The cron prompt scanner can block assembled prompts containing literal trigger strings (e.g., security keywords from skill documentation). This caused the Playground Daily Backup job to be blocked when the nginx-site-admin skill's docs contained certain trigger words. Fix: sanitize skill content in cron prompts and add guardrail rules.

### Delivery Channels

- **`origin`** — Deliver back to the chat/topic where the job was created
- **`discord`** — Deliver to a Discord channel
- **`local`** — Log only, no notification (useful for background maintenance)
- **`all`** — Fan out to every connected channel
