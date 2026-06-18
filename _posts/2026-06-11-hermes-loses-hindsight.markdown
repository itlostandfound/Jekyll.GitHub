---
layout: post
title: "Hermes Loses Hindsight"
date: 2026-06-11 20:30:00 -0500
categories: [hermes, ai, self-hosted, obsidian]
---

We killed Hindsight today. Pulled it out by the roots — 353 MB of PostgreSQL, 9 per-profile config directories, and two API calls per turn that mostly extracted nothing.  

To be fair here, some of the data below including the failures of good writes and reads from Hindsight were due to the now "Infamous" Ollama Relay (which was Ollam being installed directly on the host and Hermes "Relaying" through it (which was due to the age of my instance before Ollama.com was added in directly as an LLM Provider)).  Either way I hated the fact that it required an LLM to burn even more Tokens for its usage and I didn't like or want that so I chose to get rid of it.

And it was the right call.

## The Diagnosis

It started with a simple question: "Analyze our memory setup. Are we doing this the best way?" The answer was no.

The investigation revealed several problems:

**Hindsight was mostly dormant.** The recall command failed with "LLM API key is required (see post "Ollama Relay Your Doing It Wrong" for more details on why this was happening)." The per-profile configs existed but the embedded PostgreSQL instance at `~/.pg0/instances/hindsight-embed-hermes` wasn't being queried effectively. Two LLM calls per turn — one recall, one retain — and the best case was a 14% extraction success rate at the chunk level.

**Memory files were bursting.** `MEMORY.md` was at 84% capacity (1,869/2,200 chars). `USER.md` was at 94% (1,305/1,375 chars). Most of that content was infrastructure facts — IP addresses, port numbers, model names — that should live in a knowledge base, not in a per-turn injected sticky note.

**The architecture was self-contradictory.** We had Hindsight auto-extracting facts (at 14% success) while also manually writing things to MEMORY.md. We had a structured Obsidian vault (set up 4 days earlier) that could hold all this knowledge without the per-turn tax. But we were still paying the Hindsight overhead on every single conversation turn.

The numbers told the story:

| Metric | Hindsight | Built-in Only |
|--------|-----------|---------------|
| API calls per turn | 2 (recall + retain) | 0 |
| Input tokens per turn | ~500-1000 | 0 |
| Recall latency | 0.5-180 seconds | 0 |
| Fact extraction success | ~14% | N/A |
| Disk overhead | 353 MB PostgreSQL | 0 |
| MEMORY.md usage | 84% (1,869/2,200) | N/A |
| USER.md usage | 94% (1,305/1,375) | N/A |

## The Decision

The vault was already there, already working, already being written to by agents through SOUL.md protocols. Hindsight was just... sitting on top, costing tokens and adding latency for an 86% failure rate.

So we removed it. All of it.

## The Execution

The removal was surgical and complete:

1. **Disabled Hindsight in all configs** — Set `memory.provider: ''` (empty string) in the main `~/.hermes/config.yaml` and all 8 profile configs under `~/.hermes/profiles/*/config.yaml`

2. **Deleted the data** — Removed `~/.hindsight/` (16 MB), `~/.pg0/` (337 MB PostgreSQL instance), and `~/.hermes/hindsight/` (main config directory). That's 353 MB of disk reclaimed.

3. **Deleted 8 per-profile config directories** — Each profile had its own `hindsight/config.json` with bank IDs and model settings. All gone.

4. **Consolidated MEMORY.md** — Moved infrastructure facts out (they were already in vault wiki pages) and added a vault pointer: "Long-term knowledge base: Obsidian ai-vault... BEFORE research, config, or domain-specific tasks: search the vault wiki/"

5. **Bumped memory limits** — With Hindsight gone, we had headroom. `memory_char_limit` went from 2,200 to 3,000. `user_char_limit` went from 1,375 to 2,000. After consolidation: MEMORY.md at 61% (1,819/3,000), USER.md at 59% (1,180/2,000).

6. **Verified everything** — Ran end-to-end tests confirming Hindsight was gone:
   - `~/.hindsight/` — empty
   - `~/.pg0/` — gone (was 337 MB)
   - Zero `provider: hindsight` references in any config
   - Zero Hindsight processes running
   - `hermes memory status` shows: `Provider: (none — built-in only)`

7. **Verified the vault still works** — Created a test page, read it back, searched for it, then cleaned it up. MCP filesystem tools all functional. 11 wiki pages accessible. 3 cron maintenance jobs intact (daily-health, wiki-curator, weekly-digest).

## The Write Triggers

The biggest concern was: without Hindsight auto-extracting facts, will agents actually write to the vault? We verified that all 5 vault-enabled profiles have **SOUL.md Vault Knowledge Protocol** sections with explicit write triggers:

- **default**: "After discovering durable information, create or update a wiki page"
- **development**: "After completing research, synthesize key insights into a wiki page"
- **playground**: "Inscribing new Chronicles, Forging new Creations"
- **PMO**: "Project decisions: log by appending to log.md"
- **research**: "After completing research — PRIMARY vault obligation"

These are personality-level directives, not optional suggestions. They're baked into each agent's SOUL.md, which means they're injected into every conversation the same way MEMORY.md is. The vault writes happen because the agent's identity includes the obligation to write.

## The New Architecture

```
Built-in Memory (MEMORY.md + USER.md)
  → WHO + operational state + vault pointer
  → Injected every turn, zero cost, 100% reliable

Obsidian Vault (ai-vault via MCP)
  → Durable structured knowledge (11 wiki pages, 3 raw sources)
  → On-demand search (not auto-injected)
  → Compounding via cron maintenance

Session Search (FTS5)
  → Conversation history, on-demand
```

Three systems, zero overlap, zero wasted tokens. The vault is the brain. Built-in memory is the working state. Session search is the history.

## What We Lost

Honest assessment: we lost automatic extraction. If an agent has a conversation that contains a fact worth remembering, and the agent doesn't explicitly write it to the vault, that fact exists only in session history. It won't surface automatically in a future conversation.

That's a trade we're willing to make. The alternative was 2 API calls per turn for an 86% failure rate. We'd rather have 100% accuracy on the 14% of facts that are worth extracting, written deliberately by agents that know what they're writing and why, than 14% accuracy on everything in a system that costs tokens just to fail.

The vault cron jobs — daily health checks, weekly curations, weekly digests — handle the maintenance side. The SOUL.md protocols handle the write side. Between deliberate writes and session search fallback, we're not losing knowledge. We're just not pretending to gain it automatically.

---

*Hindsight was removed on June 11, 2026, after 26 days of operation. The Obsidian AI Vault that replaced it was set up on June 7, 2026 — see "Hermes Gets a Brain" for that story.*