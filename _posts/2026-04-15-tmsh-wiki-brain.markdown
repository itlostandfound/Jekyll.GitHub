---
layout: post
title: "TMSH LLM Wiki Brain"
date: 2026-04-15 10:00:00 -0500
categories: [ai, f5, self-hosted, obsidian, wiki-brain]
---

LLMs are confident. That's the problem.

Ask any LLM for TMSH syntax and you'll get an answer. It will sound authoritative. It will be wrong. TMSH is purpose-built, highly structured, and full of nuances that general training data doesn't capture well. Partition scoping changes behavior in ways that aren't obvious. `list` vs `show` have distinct semantic differences that matter. `modify` list replacement behavior can silently wipe configuration. Flag combinations, module hierarchies, and object paths have exact syntax that training data garbles.

Rather than accept hallucinated TMSH syntax, I built a knowledge base that forces the LLM to consult vetted source material before answering.

## The Concept

The TMSH LLM Wiki Brain is a locally-hosted, compounding knowledge base for F5 BIG-IP's Traffic Management Shell. It's stored as an Obsidian vault of interlinked Markdown files, and it's based on Andrej Karpathy's "LLM Wiki" pattern — feed a curated knowledge base into a session so answers are grounded in reality, not probability.

The wiki enforces strict reading discipline:

- **Start at index.md** — the navigation layer, always free
- **Read at most 5 content pages per question** — if more are needed, the agent stops and asks for permission
- **Fallback is mandatory silence** — if the wiki has no coverage, the agent states "The wiki does not currently cover [topic]" and suggests what source could fill the gap. It does **not** answer from training data as a substitute

The entire point is to prevent training-data guessing. Falling back silently would defeat the purpose.

## What's In It

The initial ingest came from two authoritative sources:

- **F5 KB K13225 Cheatsheet** — established the `list` vs `show` semantic distinction as a foundational concept
- **BIG-IP TMSH Reference Guide v17.0.0** — the 1,843-page authoritative F5 document. Full ingest created 47 pages: 27 commands, 5 modules, 9 objects, 4 concepts, 1 pattern, 2 source summaries, 1 overview, and 1 index

The vault structure separates concerns cleanly: `raw/` for immutable source documents, `wiki/` for all generated content (commands, modules, objects, concepts, patterns), with every page following a consistent schema of YAML frontmatter, Obsidian wikilinks, callouts, and code blocks tagged with `tmsh` language.

## Why It Matters

This was the proof of concept. The pattern worked so well for a static reference that it directly led to the QKView LLM Wiki Brain — which evolved the concept from "look up syntax" to "walk a procedure against live data and get smarter after every engagement."

The TMSH Wiki now serves as the gold-standard CLAUDE.md template for every other wiki brain in the system.

## See the Full Project

This post is an introduction. The complete project page has the full architecture, ingest sources, current state, access rules, and enhancement opportunities:

**[TMSH LLM Wiki Brain →]({{ site.baseurl }}/projects/ai/tmsh-wiki-brain/)**

---

*Reference: [Andrej Karpathy's LLM Wiki concept](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)*