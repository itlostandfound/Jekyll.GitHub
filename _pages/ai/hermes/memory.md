---
layout: single
title: Memory
permalink: /ai/hermes/memory/
---

## Memory

Hermes agents don't start from zero every session. They carry context forward through multiple memory systems, each with a different scope, persistence, and purpose. This page covers how memory works by default and how our instance extends it with an Obsidian-based wiki brain.

### Default Memory Systems

Out of the box, Hermes ships with three memory layers:

#### 1. Session Context

Every conversation starts with system instructions, loaded skills, and the current MEMORY.md and SOUL.md files. This is the ephemeral layer: it exists for the duration of a session and disappears when the session ends. The agent's working context window holds the conversation history, tool results, and any facts recalled during the session.

#### 2. MEMORY.md (Profile-Scoped Notes)

Each profile has a `memories/MEMORY.md` file that injects into every turn. This is the agent's scratchpad for durable facts: user preferences, environment details, project conventions, and operational reminders. It has a hard size limit (roughly 2,200 characters), so it forces the agent to be selective about what to keep.

The key behaviors:

- **Injected automatically** into every message, so the agent always sees it
- **Add/replace/remove operations** via the memory tool, not manual editing
- **Compact by design** -- only facts that reduce future user steering belong here
- **Profile-isolated** -- each profile has its own MEMORY.md, so context doesn't leak between roles

Good MEMORY.md entries are declarative facts ("User prefers medium detail," "Jekyll site uses Minimal Mistakes dark theme"). Bad entries are procedural instructions or stale task state.

#### 3. Skills (Procedural Memory)

Skills are reusable markdown files (`SKILL.md`) that encode workflows, commands, pitfalls, and reference material. They load automatically when relevant to a task. Skills are the "how to do things" layer, while MEMORY.md is the "what is true" layer.

Skills can include:

- **References** -- detailed docs linked from the main SKILL.md
- **Templates** -- reusable patterns (cron-safe prompts, config templates)
- **Scripts** -- helper scripts the skill invokes
- **Assets** -- images, diagrams, static files

Skills live under `~/.hermes/skills/` globally and can also be profile-specific via `skills.external_dirs` in config.yaml.

### Our Setup: Obsidian Wiki Brain

The default memory systems work well for single-session facts and reusable procedures. But they have gaps: no structured knowledge graph, no cross-referencing between facts, no compounding over time. That's why we replaced the built-in Hindsight vector memory with an Obsidian vault acting as a persistent wiki brain.

#### Why Not Hindsight?

Hindsight was the original vector-based long-term memory provider. It stored semantic embeddings and recalled them via similarity search. We removed it because:

- **Flat structure** -- every memory was an isolated fact with no relationships
- **No organization** -- no domains, no categories, no link graph
- **No compounding** -- facts didn't build on each other or connect into understanding
- **Opaque recall** -- you couldn't browse or audit what the agent "knew"
- **No governance** -- no confidence levels, no source tracking, no staleness checks

The vault replaces all of this with a transparent, structured, linkable knowledge system.

#### Architecture: Three Layers

The vault uses a strict three-layer architecture:

| Layer | Directory | Purpose | Rule |
|-------|-----------|---------|------|
| **Raw** | `raw/` | Immutable source material | Append-only. Never edit or delete after ingestion |
| **Wiki** | `wiki/` | Structured agent-compiled knowledge | Synthesized from raw sources. Always improving |
| **Output** | `output/` | Generated deliverables | Derived from wiki, never treated as source truth |

Most AI systems fail because they dump raw inputs, summaries, and outputs into one flat folder. This architecture prevents that by enforcing strict separation: raw sources are preserved as-is, wiki pages synthesize knowledge from those sources, and outputs are generated from wiki (never from raw directly).

#### Wiki Domains

Knowledge in the wiki layer is organized into five domains:

| Domain | Path | Scope |
|--------|------|-------|
| `technical` | `wiki/technical/` | Protocols, standards, configuration guides, deep-dives |
| `infrastructure` | `wiki/infrastructure/` | Home lab, Docker, Kubernetes, networking, DevOps |
| `security` | `wiki/security/` | F5/ADC, WAF, ASM, GTM/DNS, SecOps |
| `projects` | `wiki/projects/` | Active project documentation and decisions |
| `research` | `wiki/research/` | R&D, emerging tech, AI/ML, funding |

Each wiki page has YAML frontmatter with title, type (entity/concept/guide/reference/how-to/decision), domain, tags, source references, creation date, update date, and a confidence level (high/medium/low).

#### How We Access It

The vault is connected via an MCP (Model Context Protocol) filesystem server. This gives us 14 native tools that operate directly on vault files:

- **Reading**: `read_file`, `read_text_file`, `read_multiple_files` -- read vault content
- **Writing**: `write_file`, `edit_file` -- create and modify vault pages
- **Navigation**: `list_directory`, `directory_tree` -- browse vault structure
- **Search**: `search_files` -- find content by filename or regex across the vault
- **Management**: `create_directory`, `move_file`, `get_file_info` -- organize and inspect files

These tools are always available when the vault MCP server is running. No API keys, no network calls, just direct filesystem access to a local Obsidian vault.

#### How We Use It

**Before tasks**: When a task involves research, configuration, or a domain we've worked in before, we search the wiki first. This avoids re-learning things we already know.

**During tasks**: When we discover durable knowledge (a config detail, a design decision, a troubleshooting finding), we write it to the wiki, not just to chat or MEMORY.md.

**After tasks**: When a session produces new knowledge worth keeping, we create a wiki page with proper frontmatter, wikilinks to at least two related pages, and log the action in `log.md`.

**Via cron**: Three automated jobs maintain the vault:
- **Daily health check** (6:00 AM) -- fixes broken wikilinks, missing frontmatter, orphan pages
- **Weekly wiki curator** (Wednesday 7:00 AM) -- synthesizes uncompiled raw sources into wiki pages
- **Weekly digest** (Monday 8:00 AM) -- activity summary, flags stale content and duplicates

#### How We Add to It

New knowledge enters the vault through a structured ingestion workflow:

1. **Save to raw/** -- Source material goes into the appropriate raw subdirectory (articles, papers, competitors, repos, tweets, misc) with standardized frontmatter
2. **Log the ingestion** -- An entry is appended to `log.md` with timestamp and source title
3. **Search wiki** -- Check for existing pages related to the source's topics
4. **Update or create** -- If related pages exist, update them. If a concept appears in 2+ sources or is central to 1 major source, create a new wiki page
5. **Add wikilinks** -- Every new or updated page links to at least 2 related pages using `[[page-name]]` syntax
6. **Update the index** -- New pages are added to `wiki/_index/index.md`
7. **Log the compile** -- An entry is appended to `log.md` noting the synthesis

This ensures knowledge compounds over time rather than rotting in flat files.

#### What Lives in the Vault Today

Our vault currently contains 14 wiki pages across all five domains, plus raw sources and templates. Key pages include:

- **hermes-agent-setup** -- Profiles, providers, configs, pitfalls
- **home-lab-overview** -- Full network map, services, agent profiles
- **vault-setup** -- Vault architecture and configuration details
- **jekyll-site** -- Site architecture, design decisions, launch checklist
- **f5-adc-expertise** -- F5 domain knowledge and strategic positioning
- **ai-secops-platform** -- Primary product vision for the career pivot

Each page cross-references related pages via wikilinks, creating a navigable knowledge graph rather than isolated notes.

### Memory Decision Framework

When deciding where to store information:

| Type | Location | Scope | Persistence |
|------|----------|-------|-------------|
| Ephemeral task context | Session chat | Single session | Gone when session ends |
| User preferences, env facts | MEMORY.md | Every turn | Survives sessions, 2KB limit |
| How-to procedures, workflows | Skills | Auto-loaded when relevant | Survives sessions, editable |
| Structured knowledge, research | Obsidian wiki | On-demand via search | Permanent, compoundable |
| Raw source material | Obsidian raw/ | On-demand via search | Permanent, immutable |
| Deliverables, reports | Obsidian output/ | On-demand | Derived, not source truth |

The rule of thumb: if a fact needs more than ~100 characters to express, it belongs in the vault. MEMORY.md holds pointers and preferences, not technical details.