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
| `playground` | NGINX site management, Royal Scribe persona | GLM-5.1 | terminal, file, web |
| `pmo` | Kanban orchestrator, task dispatch | GLM-5.1 | kanban, terminal, delegation |
| `research` | Deep research, market analysis | GLM-5.1 | web, browser, terminal |
| `dev` | Code engineering, git workflows | GLM-5.1 | terminal, file, github, messaging |

### How It Works

Each profile lives under `~/.hermes/profiles/<name>/` and contains:

- **`config.yaml`** — Model selection, provider config, toolset restrictions, external skill directories
- **`SOUL.md`** — Persona definition and behavioral rules (e.g., the Playground's Royal Scribe persona)
- **`skills/`** — Profile-specific skills loaded via `skills.external_dirs` in config.yaml
- **`memories/`** — Isolated memory bank with its own `bank_id`
- **`cron/`** — Profile-scoped cron job artifacts (though the global scheduler is the source of truth)

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
