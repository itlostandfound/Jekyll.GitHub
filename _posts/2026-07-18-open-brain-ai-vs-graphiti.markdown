---
layout: post
title: "Open Brain AI vs. Graphiti"
date: 2026-07-17 17:00:00 -0500
categories: [ai, graphiti, self-hosted, docker, github]
image: /assets/images/posts/Brain.vs.Brain.png
excerpt: "Two open-source projects that want to be your AI's memory. Open Brain gives every AI a shared persistent database with vector search. Graphiti builds temporal knowledge graphs that track how facts change over time. They sound like competitors. They solve different problems."
---

Two open-source projects that want to be your AI's memory. Open Brain gives every AI a shared persistent database with vector search. Graphiti builds temporal knowledge graphs that track how facts change over time. They sound like competitors. They solve different problems.

I really wanted to give Open Brain (OB1) a shot, but it doesn't solve anything but shared memory problems (which I've solved for now).  Perhaps in the future when I need full context memory sharing.

Here's a comparison if your solving for a different problem and want a fair assessment.

## What Open Brain Does

[Open Brain (OB1)](https://github.com/NateBJones-Projects/OB1) is Nate B. Jones's project: "The infrastructure layer for your thinking. One database, one AI gateway, one chat channel. Any AI plugs in."

The architecture is straightforward: Supabase (PostgreSQL + pgvector) stores your thoughts as rows with text content, vector embeddings, and JSON metadata. An MCP server reads and writes to that database. OpenRouter serves as the AI gateway, generating embeddings and handling LLM calls. You can swap models by editing a string and redeploying. Slack capture pipes messages from a channel straight into the database. No local servers. No SaaS subscriptions beyond the Supabase free tier and ~$5 in OpenRouter credits.

The core data model is a `thoughts` table: each row has content, a 1536-dimensional embedding vector, metadata, and timestamps. Semantic search via `match_thoughts()` returns results ranked by vector cosine similarity with an optional metadata filter. Deduplication is handled by a content fingerprint (SHA-256 of the normalized text). Same thought captured twice? Merged metadata, not a duplicate row.

It is designed for one thing: give any AI tool you use access to the same persistent memory of you. Claude, ChatGPT, Cursor, Claude Code, whatever ships next month. One brain. All of them.

## What Graphiti Does

[Graphiti](https://github.com/getzep/graphiti) is an open-source framework for building temporal knowledge graphs. Entities, relationships, and episodes with validity windows. When information changes, old facts are **invalidated**, not deleted. You can query what is true now or what was true at any point in the past. Every entity and relationship traces back to its source episode for provenance.

The data model is a graph, not a table. Nodes (entities), edges (relationships between entities), and episodes (the raw data that produced them). Retrieval is hybrid: semantic embeddings, BM25 keyword search, and graph traversal, typically sub-second latency. It uses FalkorDB (Redis-based) or Neo4j as the graph database.

Graphiti is built for a different problem: tracking how facts evolve over time in a way that a flat vector search cannot. "What VIPs did we configure on bigip-01 last month?" is a temporal knowledge graph question, not a semantic search question.

## The Comparison

| Aspect | Open Brain (OB1) | Graphiti |
|---|---|---|
| **Data model** | Flat table with vector embeddings and JSON metadata | Temporal knowledge graph (entities, edges, episodes) |
| **Database** | Supabase (PostgreSQL + pgvector) | FalkorDB (Redis-based) or Neo4j |
| **Retrieval** | Vector cosine similarity + metadata filtering | Hybrid: semantic + BM25 keyword + graph traversal |
| **Temporal awareness** | None. Thoughts have created_at and updated_at, but no validity windows or fact invalidation | Bi-temporal. Facts have validity windows. Old facts are invalidated, not deleted. Query any point in time |
| **Provenance** | Content fingerprint for deduplication. No source tracking beyond metadata | Every entity and fact traces to the episode (raw input) that produced it |
| **Extraction** | None. You write thoughts explicitly. The AI captures what you tell it | Automatic. The LLM extracts entities and relationships from episodes you feed it |
| **AI integration** | MCP server for read/write. OpenRouter as AI gateway. Any AI tool can plug in | MCP server for tool calls. LLM handles entity extraction and relationship mapping |
| **Self-hosting** | Supabase cloud (free tier) + OpenRouter cloud. No local servers required | Docker Compose on your own infrastructure. FalkorDB or Neo4j alongside the server |
| **Setup complexity** | ~30 minutes. Copy-paste SQL, deploy an Edge Function, configure MCP | Significant. Two Docker images, two graph databases, Traefik for TLS, environment variables, and at stock configuration it does not work without OpenAI |
| **Language** | TypeScript + SQL | Python (core library) + TypeScript (MCP server) |
| **License** | FSL-1.1-MIT | Apache-2.0 |
| **Stars** | 4.2k | 28.9k |

## Where Open Brain Wins (with Caveats)

**Simplicity.** Open Brain is 30 minutes to a working personal memory layer. You create a Supabase project, run some SQL, deploy an Edge Function, configure MCP, and you are done. No Docker. No local servers. No graph databases. The whole thing runs on two free-tier services and ~$5 of OpenRouter credits that last months (according to what they claim).

**Universal access.** Because every AI tool talks to the same Supabase database through the same MCP server, Claude remembers what ChatGPT learned. Cursor knows what you told the Claude Code agent. There is one brain and any AI can use it. That is the core promise, and it delivers on it.

**No extraction dependency.** Open Brain does not try to extract knowledge from your conversations. You write thoughts explicitly, or something else captures them verbatim. There is no LLM in the loop deciding what entities to pull out or how to structure relationships. The content is what you said, stored exactly as you said it, and searchable by meaning.

**Why it didn't win.** Privacy, data sovereignty, setup, and a highly target problem solution.  Yeah you could self host [Supabase](https://supabase.com/docs/guides/self-hosting/docker) and even self-host your own LLM, but their instructions are for Cloud Based and you'd have to create your own setup yourself.  I'll admit, that I very well may circle back to this when I need 1-to-1 information storage (which is the highly targeted problem it solves for), but that's not what I'm looking for right now.

## Where Graphiti Wins

**Temporal knowledge.** This is the killer feature that Open Brain does not have. When facts change, Graphiti does not overwrite. It invalidates the old fact and creates a new one, preserving the history. "What was the status of this VIP last month?" is a question only a temporal knowledge graph can answer accurately. Open Brain's `thoughts` table has timestamps but no concept of fact invalidation or validity windows.

**Automatic extraction.** Feed Graphiti an episode (a conversation, a document, a log), and it extracts entities and relationships automatically. You do not have to write structured thoughts. The LLM does the extraction. For environments where the raw input is messy and unstructured (infrastructure logs, troubleshooting sessions, incident postmortems), automatic extraction beats manual capture every time.

**Provenance.** Every entity and relationship in Graphiti traces back to the episode that produced it. If an agent makes a wrong inference, you can trace it to the source. Open Brain's metadata field can store source information, but it is optional and unstructured. There is no built-in mechanism for tracing where a thought came from.

**Self-hosted and offline.** Graphiti runs on your hardware. FalkorDB, the MCP server, the API server, all in Docker Compose behind Traefik. No cloud dependencies. No third-party services. No API keys that expire or rate limits that cut you off. Open Brain depends on Supabase and OpenRouter by design.

## The Six Bugs I Had to Fix (Or: Why Graphiti Is Harder Than It Looks)

This is where the comparison gets personal. I wanted Graphiti running in my home lab. The Docker Hub images were 9 months out of date. The published v0.22.0 images did not work as documented. Environment variables were ignored. Endpoints were hardcoded to OpenAI. The reranker, the LLM client, the embedder, the DNS protection, the Dockerfile itself, all had bugs that had no config-driven workaround.

I forked it. Six confirmed bugs, two custom branches, two Docker images rebuilt from source for the correct architecture, and my own Docker Hub namespace later, it works. The full story is on the [GitHub Fork](/github/fork/) page and the [Project Details](/projects/open-source/graphiti/) with example compose.yml, .env, and my personal project README.md (stored in my Forgejo IaC Git Repository because I have a fork and not the actual Repo) were provided for your reference.

## Which One Should You Use

Use **Open Brain** if you want a personal memory layer that any AI tool can read from and write to, and you do not want to run your own infrastructure. It is the fastest path from zero to a working brain that all your AI tools share. The 30-minute setup is real. The Supabase free tier covers personal use. OpenRouter gives you model flexibility. If your use case is "I want Claude to remember what I told ChatGPT," Open Brain does exactly that.

Use **Graphiti** if you need temporal knowledge tracking, automatic entity extraction, and provenance on every fact. If your data changes over time and you need to know what was true when, Graphiti is the only option between the two. If you want it self-hosted with no cloud dependencies, Graphiti runs entirely on your hardware. Just be prepared to fix upstream bugs if you are not using OpenAI as your LLM provider.

Use **both** if your use case spans both problems. Open Brain for "what do I know?" Graphiti for "how did what I know change over time?" They fill different gaps. The flat vector search in Open Brain answers "find me things related to X." The temporal graph in Graphiti answers "what changed about X since last week, and what evidence do I have?"

That is not a competition. That is a toolkit.

---

The Graphiti project page is at [projects/open-source/graphiti](/projects/open-source/graphiti/).<br />
Open Brain is at [github.com/NateBJones-Projects/OB1](https://github.com/NateBJones-Projects/OB1).

---

The following is a duplication of the TMSH LLM Wiki Brain.  There are far more associations created gy Graphiti's FalkorDB than by Obsidian.

![Graphiti Mind Map](/assets/images/posts/Graphiti.Mind.Map.png)