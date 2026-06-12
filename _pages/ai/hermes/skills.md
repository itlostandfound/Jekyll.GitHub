---
layout: single
title: Skills & Knowledge
permalink: /ai/hermes/skills/
---

## Skills & Knowledge

Hermes skills are reusable procedural memories — markdown files (`SKILL.md`) that encode workflows, commands, pitfalls, and reference material. They load automatically when relevant to a task.

### Skill Architecture

Skills live under `~/.hermes/skills/` and are organized into categories:

```
~/.hermes/skills/
  devops/
    nginx-site-admin/
    kanban-orchestrator/
    kanban-worker/
    webhook-subscriptions/
  software-development/
    hermes-agent-skill-authoring/
    requesting-code-review/
    systematic-debugging/
  mlops/
    ... (training, inference, evaluation subdirs)
  creative/
    ... (design, ASCII art, video)
  research/
    ... (arxiv, snoopy, firecrawl)
```

### Skill Structure

Each skill has a `SKILL.md` with YAML frontmatter and markdown body, plus optional support files:

- **`references/`** — Detailed reference docs linked from SKILL.md
- **`templates/`** — Reusable templates (e.g., cron-safe backup prompts)
- **`scripts/`** — Helper scripts that the skill invokes
- **`assets/`** — Images, diagrams, other static files

### Skill Authoring Convention

We follow a strict preference order when updating skills:

1. **Patch the currently-loaded skill** if it covers the new learning territory
2. **Update an existing umbrella skill** via skills_list + skill_view
3. **Add a support file** under an existing umbrella (references/, templates/, scripts/)
4. **Create a new class-level umbrella** only when nothing existing covers it

This prevents skill sprawl — we want deep, rich skills with support files, not a flat list of narrow one-session skills.

### Key Skills We've Built

| Skill | Category | Purpose |
|---|---|---|
| `nginx-site-admin` | devops | Governing umbrella for Playground site, cron jobs, and backups |
| `kanban-orchestrator` | devops | Decomposition playbook for PMO task routing |
| `kanban-worker` | devops | Pitfalls and patterns for kanban task execution |
| `himalaya` | email | IMAP/SMTP email from terminal, with Outlook.com guide |
| `hermes-agent` | autonomous-ai-agents | Configure, extend, and troubleshoot Hermes itself |
| `batch-job-verification` | batch-job-verification | Audit automated job outputs for quality |
| `systematic-debugging` | software-development | 4-phase root cause debugging methodology |
| `requesting-code-review` | software-development | Pre-commit review with security scan |

### Cron + Skills Interaction

The cron scheduler resolves skills from the **global** `~/.hermes/skills/` directory, not from profile skill directories even when `workdir` points to a profile path. To use profile-specific skills in cron jobs, add the profile's skill directory to `skills.external_dirs` in the profile's config.yaml.

### Syncing Skills to Profiles

After editing a global skill that's also used by a profile (like nginx-site-admin for the Playground), run:

```bash
sync-to-profile.sh playground
```

This copies updated skill files to the profile directory so the next cron run picks up changes.
