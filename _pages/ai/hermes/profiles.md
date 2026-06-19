---
layout: single
title: Multi-Profile Architecture
permalink: /ai/hermes/profiles/
---

## Multi-Profile Architecture

Hermes supports isolated agent profiles, each with their own identity, memory, skills, config, and SOUL.md. This means "everyone has their own" — separate memory banks, separate namespaces, separate runtime behavior.

### Why Profiles Matter

Running everything through a single agent creates cross-contamination: a Playground task could bleed into research memory, a PMO dispatch could conflict with dev toolsets. Profiles solve this by giving each use case its own sandboxed environment.

### Our Profile Roster

| Profile | Purpose | Model | Key Toolsets |
|---|---|---|---|
| `default` | General CLI conversations, daily tasks | GLM-5.1 (Ollama Cloud) | Full set |
| `development` | Software engineering, git workflows, CI/CD | Kimi K2.6 (Ollama Cloud) | terminal, file, skills, github, messaging |
| `f5-admin` | F5 BIG-IP platform administration, system config, cross-module coordination | Kimi K2.6 (Ollama Cloud) | terminal, file, skills, github |
| `f5-asm` | F5 ASM — WAF, security policies, attack prevention, bot detection | Kimi K2.6 (Ollama Cloud) | terminal, file, skills, github |
| `f5-gtm` | F5 GTM/DNS — global load balancing, failover, geographic routing | Kimi K2.6 (Ollama Cloud) | terminal, file, skills, github |
| `f5-ltm` | F5 LTM — virtual servers, pools, iRules, SSL/TLS, traffic optimization | Kimi K2.6 (Ollama Cloud) | terminal, file, skills, github |
| `playground` | NGINX site content, Royal Scribe persona | Kimi K2.6 (Ollama Cloud) | terminal, file, web, skills |
| `pmo` | Kanban orchestrator, task dispatch | Qwen3-8B (LM Studio local) | kanban, delegation, terminal |
| `research` | Deep research, market analysis, competitive intelligence | MiniMax-M2.7 (Ollama Cloud) | terminal, file, web, skills |

### How It Works

Each profile lives under `~/.hermes/profiles/<name>/` and contains:

- **`config.yaml`** — Model selection, provider config, toolset restrictions, external skill directories
- **`SOUL.md`** — Persona definition and behavioral rules (e.g., the Playground's Royal Scribe persona)
- **`skills/`** — Profile-specific skills loaded via `skills.external_dirs` in config.yaml
- **`memories/`** — Isolated memory bank with its own `bank_id`
- **`cron/`** — Profile-scoped cron job artifacts (though the global scheduler is the source of truth)

### Profile Families

The four F5 profiles (`f5-admin`, `f5-ltm`, `f5-asm`, `f5-gtm`) share the same toolsets and the `f5-engineer-skills` skill directory, but diverge in their SOUL.md persona — each is a domain specialist with focused expertise. `f5-admin` acts as the cross-module coordinator, dispatching to the LTM/ASM/GTM specialists when a task falls within their domain.

### Key Decisions

- **Isolation over convenience.** Each profile has its own memory bank so context doesn't leak between roles.
- **`workdir` matters.** Cron jobs must set `workdir` to the profile directory (e.g., `/Users/hermes/.hermes/profiles/pmo`) so the correct SOUL.md and config.yaml load at runtime.
- **Profile skill directories** are only used when listed in `skills.external_dirs` in that profile's config.yaml — simply placing files in `~/.hermes/profiles/<name>/skills/` is not enough.

### CLI Commands

```bash
# Create a new profile
hermes profile create <name>

# List profiles
hermes profile list

# Switch active profile for a session
hermes -p <profile> chat

# Sync skills to a profile
sync-to-profile.sh <profile>
```
