---
layout: post
title: "Hermes Gets a Brain"
date: 2026-06-07 14:15:00 -0500
categories: [hermes, ai, self-hosted, obsidian]
image: /assets/images/posts/hermes-gets-a-brain.svg
excerpt: "The Obsidian vault is live. Hermes now has a persistent knowledge base that compounds over time — not just a notepad, but a structured wiki."
---

The Obsidian vault is live. Hermes now has a persistent knowledge base that compounds over time — not just a notepad, but a structured wiki with schema enforcement, MCP filesystem integration, and automated maintenance.

Here's how we got there.

## The Problem

Hermes had two memory systems up to this point:

1. **Built-in memory** — `MEMORY.md` and `USER.md`, injected into every conversation turn. Reliable, but limited to ~2,200 characters of working state. No relationships. No compounding knowledge. Just a sticky note that gets overwritten.

2. **Hindsight** — a knowledge graph plugin that auto-extracted entities and facts from every conversation. Powerful in concept, but it cost 2 LLM API calls per turn (recall + retain) with latency ranging from 0.5 to 180 seconds.

Neither system gave us what we really needed: a **durable, searchable, structured knowledge base** that agents could write to deliberately and read from on demand, without paying a per-turn tax for automatic extraction.

## The Design

We built the AI Vault on top of an existing Obsidian vault. The directory structure follows a clear separation of concerns:

```
ai-vault/
  SCHEMA.md          — Rules: what goes where, naming conventions, tags
  log.md             — Append-only activity log
  raw/               — Source material (append-only, never edit)
    articles/
    papers/
    competitors/
    repos/
  wiki/              — Agent-synthesized knowledge from raw sources
    _index/index.md  — Link graph of all wiki pages
  output/            — Deliverables generated from wiki
    reports/
    slides/
  templates/         — Reusable templates for agents
```

Key rules:
- **`raw/` is append-only** — source material is never modified once stored
- **`wiki/` is where agents synthesize knowledge** from raw sources into structured pages
- **`output/` is derived from wiki** — never treated as source truth
- **Every wiki page has YAML frontmatter** with title, type, domain, tags, created/updated dates, and sources
- **Every wiki page links to at least 2 related pages** using Obsidian `[[wikilink]]` syntax

## The MCP Connection

The critical piece was connecting the vault to Hermes via the Model Context Protocol (MCP). We configured an MCP filesystem server pointing at the vault directory, giving agents 14 additional tools:

- `mcp_filesystem_read_file`, `mcp_filesystem_read_text_file`, `mcp_filesystem_read_multiple_files` — read vault files
- `mcp_filesystem_write_file`, `mcp_filesystem_edit_file` — create/edit vault files
- `mcp_filesystem_create_directory`, `mcp_filesystem_list_directory`, `mcp_filesystem_directory_tree` — browse vault structure
- `mcp_filesystem_search_files`, `mcp_filesystem_get_file_info` — search and inspect vault files
- `mcp_filesystem_move_file` — move/rename vault files
- `mcp_filesystem_list_allowed_directories` — verify access boundaries

These MCP tools operate **only within the vault directory** — a safety boundary that prevents agents from accidentally writing to system files. The built-in `read_file`, `write_file`, and `patch` tools still work on any path, but the MCP tools are vault-scoped.

The configuration went into each profile's `config.yaml`:

```yaml
mcp_servers:
  filesystem:
    command: npx
    args:
      - "@modelcontextprotocol/server-filesystem"
      - "/Obsidian/ai-vault"
```

Important lesson: the config key is `mcp_servers` (snake_case), not `mcpServers` (camelCase). We learned this the hard way — the gateway didn't pick up the MCP server until we corrected the key name. One gateway restart later, 14 new tools appeared.

## Who Gets Access

Not every agent needs vault access at this time so, we enabled it for the profiles that do knowledge work:

| Agent | Profile | MCP Access | Env Var |
|-------|---------|------------|---------|
| Hermes (default) | `~/.hermes/` | YES | YES |
| Development | `profiles/development/` | YES | YES |
| Playground | `profiles/playground/` | YES | YES |
| PMO | `profiles/pmo/` | YES | YES |
| Research | `profiles/research/` | YES | YES |

The four F5 specialist agents (admin, asm, gtm, ltm) were excluded for the time being as I have not had the time to further configure them and give them a mission in life (only so many hours in the day).

We also set the `OBSIDIAN_VAULT_PATH` environment variable in each enabled profile's `.env` file, so agents always know where the vault lives regardless of which tool they're using.

## The First Page

After setup, we created the first wiki page — `wiki/vault-setup.md` — documenting the configuration itself. Then we updated `wiki/_index/index.md` to link it, and appended an entry to `log.md`.

The vault was now self-documenting. Every wiki page gets indexed. The knowledge graph grows organically from actual work rather than from automatic extraction with an 86% failure rate.

## Why This Matters

The vault replaces the "hope and pray" model of automatic memory extraction with a deliberate, agent-controlled knowledge base:

- **Zero per-turn cost** — no API calls, no latency, no failed extractions
- **100% write accuracy** — agents write exactly what they intend, not what an LLM guesses
- **On-demand reads** — vault searches happen only when relevant, not every turn
- **Compounding knowledge** — wiki pages link to each other, building a graph that gets richer over time
- **Append-only raw sources** — source material is preserved exactly as captured

The vault is the brain. Built-in memory is the working state. Session search is the conversation history. Three systems, each doing what it's best at, with no overlap and no wasted tokens.

## Reference Plug for Credit Due:
Part 1:  The idea<br />
[I Wired Claude Code Into Hermes Agent (And Hermes Into Claude Code): The Full Tool Gateway Reference](https://wowhow.cloud/blogs/hermes-agent-tool-gateway-claude-code-mcp-12-patterns-2026)<br />
<br />
Part 2:  Implementation Part 1<br />
[How to Build an AI Agent Operating System That Compounds Over Time](https://maxmitcham.substack.com/p/how-to-build-an-ai-agent-operating)<br />
<br />
Part 3:  Implementation Part 2 is to configure Claude Code on the Mac Mini M4 with Hermes, and now that Anthropic has enabled Auto-Mode for Pro Subscriptions I'll use my Hybrid Auto-Mode Configuration to allow Hermes and Claude to work together.<br />
<br />
---

*The AI Vault was created on June 7, 2026. It was later integrated with Hindsight's replacement on June 11, 2026 — see "Hermes Loses Hindsight" for that story.*