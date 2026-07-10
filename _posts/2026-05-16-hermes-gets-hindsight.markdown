---
layout: post
title: "Hermes gets Hindsight"
date: 2026-05-16 19:45:00 -0500
categories: [hermes, ai, self-hosted]
image: /assets/images/posts/hermes-gets-hindsight.svg
excerpt: "We gave Hermes a memory. A real one. Not just sticky notes on a whiteboard — a knowledge graph that builds relationships and recalls what matters."
---

We gave Hermes a memory. A real one. Not just sticky notes on a whiteboard — a knowledge graph that builds relationships between entities, remembers what matters, and recalls it when it's relevant.

Here's how it happened.

**NOTE**:  You'll see me reference the "Ollama Relay".  Hermes runs on a Mac Mini M4 and I have Ollama installed on the host machine, so that is why you see the reference and the strange keys.  This instance Hermes Instance was created prior to Ollama.com being a built-in provider option.

## The Problem

Hermes has had built-in memory since day one — `MEMORY.md` and `USER.md` files that get injected into every conversation. It works. It's reliable. But it's limited. Those files are flat text, capped at a few thousand characters, and they only contain what you explicitly write into them. They don't learn on their own. They don't connect dots. They don't say "hey, the IP address you mentioned three conversations ago is the same server we're troubleshooting now."

We needed something that could:

- **Auto-retain**: Extract facts, entities, and context from every conversation turn without manual intervention
- **Auto-recall**: Search past memories for relevant information and inject it before each response
- **Build a knowledge graph**: Connect entities — people, projects, machines, IP addresses — into relationships, not just text blobs

That's what [Hindsight](https://hermes-agent.nousresearch.com/docs) promised.

## The Setup

The installation was surprisingly straightforward for something this powerful. Three packages via `uv pip install`:

- `hindsight-client` — the API client
- `hindsight-all` — the full package
- `hindsight-embed` — the embedded database engine (no external Postgres server needed)

Then a config file at `~/.hermes/hindsight/config.json`:

```json
{
  "mode": "local_embedded",
  "bank_id": "hermes",
  "llm_provider": "ollama",
  "llm_model": "kimi-k2.6:cloud",
  "auto_recall": true,
  "auto_retain": true,
  "memory_mode": "hybrid"
}
```

The key decisions we made:

- **`mode: local_embedded`** — runs entirely on the Mac Mini. No cloud API calls for memory operations. It bundles its own PostgreSQL instance with pgvector for vector similarity search. Zero external dependencies.
- **`llm_provider: ollama` with `llm_model: kimi-k2.6:cloud`** — uses our "Ollama Relay" instance to power the extraction and recall LLM calls. This was important — we didn't want memory adding per-turn API costs to a cloud provider.
- **`auto_recall: true` and `auto_retain: true`** — fully automatic. Every turn saves context, every new turn searches for relevant history.
- **`memory_mode: hybrid`** — the best of both worlds. Memories get injected into the system prompt context AND explicit `hindsight_recall` / `hindsight_retain` tools become available for targeted queries.
- **`bank_id: hermes`** — a single shared memory bank for the default profile. Other profiles (playground, research, etc.) would later get their own isolated banks.

One line in `~/.hermes/config.yaml` flipped it on:

```yaml
memory:
  provider: hindsight
```

And that was it. `hermes memory status` showed:

```
Built-in:   always active
Provider:   hindsight
Plugin:     installed ✓
Status:     available ✓
```

## The Rollout

Getting it working on the default profile was step one. But we had eight other agent profiles — PMO, research, playground, development, and four F5 specialists — all needing their own isolated memory banks.

We created `hindsight/config.json` files under each profile directory, each with its own `bank_id`:

| Profile | Bank ID | LLM Model |
|---------|---------|-----------|
| default (hermes) | `hermes` | kimi-k2.6:cloud |
| playground | `playground` | kimi-k2.6:cloud |
| research | `research` | minimax-m2.7:cloud |

And added the memory section to each profile's `config.yaml`:

```yaml
memory:
  memory_enabled: true
  user_profile_enabled: true
  memory_char_limit: 2200
  user_char_limit: 1375
  provider: hindsight
  nudge_interval: 10
  flush_min_turns: 6
```

We tested isolation by retaining "Playground test message is ALPHA" under the playground bank and "Research test message is BETA" under the research bank, then recalling from each — playground got ALPHA, research got BETA, default got neither. Clean isolation. Exactly what we wanted.

## The LLM Tax

Hindsight isn't free in compute terms. Every conversation turn triggered two LLM calls:

1. **Recall** — before the response, search the memory bank for relevant context and inject it
2. **Retain** — after the response, extract entities and facts and store them

On our Ollama Relay instance with `kimi-k2.6:cloud`, recall latency ranged from 0.5 to 180 seconds depending on the query complexity. That's a significant per-turn tax. But the tradeoff was worth it: the agent could now remember across sessions, build institutional knowledge, and connect dots that flat text files never could.

The research profile got `minimax-m2.7:cloud` (again through our Ollama Relay) as its Hindsight LLM to avoid competing with `kimi-k2.6:cloud` and to test it out for functionality.

## What Changed

Before Hindsight, if Hermes asked "What's the IP of the Firecrawl server?" in a new session, the agent had no idea. The answer was buried in some `MEMORY.md` file or a past conversation that required manual session search.

After Hindsight, the agent could recall the IP Address of the Firecrawl endpoint because it had retained that fact from a previous conversation and built a relationship between "Firecrawl" and "home lab server."

The knowledge graph was the real differentiator. It didn't just store "Firecrawl is at xxx.xxx.xxx.xxx:3002." It connected that to "home lab," "research agent," "self-hosted," "no auth required," and every other entity that appeared alongside it. When any of those concepts came up again, the full context surfaced.