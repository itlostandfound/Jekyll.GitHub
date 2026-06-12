---
layout: single
title: Kanban & Multi-Agent
permalink: /ai/hermes/kanban/
---

## Kanban & Multi-Agent

We built a PMO (Project Management Office) system on top of Hermes's Kanban board, creating a multi-agent orchestration layer that decomposes tasks and routes them to specialist profiles.

### Architecture

The system has three layers:

1. **PMO Orchestrator** — Routes tasks, never executes. Decomposes goals into task graphs and assigns them to specialists.
2. **Kanban Dispatcher** — A cron job (every 15 min) that scans the board for unassigned tasks and triggers the right specialist.
3. **Specialist Workers** — Individual profiles that execute tasks in their domain.

### The Specialist Fleet

| Profile | Domain | Matches Tasks About |
|---|---|---|
| `f5-ltm` | Load balancing, virtuals, pools | LTM, load balancer, VIP |
| `f5-asm` | WAF, security policies | ASM, WAF, security, signatures |
| `f5-gtm` | DNS, GSLB, traffic management | GTM, DNS, wide IP, topology |
| `f5-admin` | General F5 infrastructure | BIG-IP, upgrade, HA, config |
| `development` | Code, software engineering | Python, code, repo, git |
| `playground` | Web, site management | NGINX, Jekyll, site, HTML |
| `research` | Information gathering | Market, analysis, search, data |

### How It Works

1. A task enters the board in `triage` status
2. The PMO-Kanban-Dispatcher cron scans every 15 minutes
3. The dispatcher reads the task title and body, matches domain keywords to a specialist
4. If a match is found, the task is assigned and promoted to `ready`
5. If no specialist matches, the task is blocked with a reason comment
6. The assigned specialist claims the task, executes, and marks it `done`

### Task Dependencies

Tasks support parent-child relationships via `kanban_link()`. A child task stays in `todo` until all its parents reach `done`, then auto-promotes to `ready`. This enables:

- **Fan-out + fan-in** — Multiple researchers in parallel, one analyst synthesizing
- **Pipeline with gates** — PM writes spec, engineer implements, reviewer approves
- **Same-profile queues** — Tasks serialized through a single specialist

### Anti-Temptation Rules

The orchestrator follows strict rules to prevent it from doing the work itself:

- **Do not execute the work yourself.** If you find yourself "just fixing this quickly" — stop and create a task.
- **For any concrete task, create a Kanban task and assign it.** Every single time.
- **If no specialist fits, ask the user which profile to create.**
- **Decompose, route, and summarize — that's the whole job.**

### Pitfalls We've Hit

**Cron dispatcher CLI errors:** The dispatcher initially tried to shell out to `hermes kanban list` instead of using the built-in kanban tools. Wrong subcommand syntax caused every 15-minute cycle to produce only usage errors. Fix: use tool calls (`kanban_ls`, `kanban_assign`) directly, not CLI commands.

**Hallucination in output:** The Playground Daily Backup job produced doubled text where the model re-summarized itself. This is a general LLM quality issue in long-running cron jobs — adding output guardrails and `[SILENT]` rules helps.

**Gateway dependency:** If the gateway process dies, the entire cron scheduler stops. No jobs fire, no tasks get assigned. Always check the gateway first when troubleshooting silent cron jobs.

**Recovery:** When a worker crashes or hallucinates, use `hermes kanban reclaim <task_id>` to reset the task, or `hermes kanban reassign <task_id> <new-profile> --reclaim` to give it to a different specialist.
