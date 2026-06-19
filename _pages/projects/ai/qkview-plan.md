---
layout: single
title: "QKView Runbook · QKView Wiki Plan"
permalink: /projects/ai/qkview-runbook/QKView.Wiki.Plan/
redirect_from: /projects/ai/qkview-runbook/QKView.Wiki.Plan.md
---

<div class="resume-hero">
  <p class="resume-tagline">Original Concept Essay &nbsp;·&nbsp; Pattern Definition &nbsp;·&nbsp; Design Seed</p>
  <p class="resume-summary">The original Karpathy LLM Wiki concept essay that seeded the QKView project. Describes the generic "feed sources → wiki gets richer" pattern and the three-layer architecture (raw sources, wiki, schema). This is the starting point — read this first, then the <a href="/projects/ai/qkview-runbook/Claude.Wiki.Concept.Analysis/">Concept Analysis</a> to see how it was adapted for QKView analysis.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Context</h2>
  <p>This document was placed in the vault root before any code or wiki pages existed. It is intentionally abstract — it describes the idea, not a specific implementation. The exact directory structure, the schema conventions, the page formats, the tooling — all of that was worked out in the subsequent design conversation captured in <a href="/projects/ai/qkview-runbook/How.I.Was.Created/">How I Was Created</a>.</p>
  <p>The key insight this document introduces that carried through to the final design: <strong>the wiki is a persistent, compounding artifact</strong>. The cross-references are already there. The contradictions have already been flagged. The synthesis already reflects everything you've read. The wiki keeps getting richer with every source you add and every question you ask.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Full Transcript</h2>
  <p>The complete text of this document is preserved below as-is from the original design session.</p>
</div>

---

LLM Wiki

A pattern for building personal knowledge bases using LLMs.

This is an idea file, it is designed to be copy pasted to your own LLM Agent (e.g. OpenAI Codex, Claude Code, OpenCode / Pi, or etc.). Its goal is to communicate the high level idea, but your agent will build out the specifics in collaboration with you.

## The core idea

Most people's experience with LLMs and documents looks like RAG: you upload a collection of files, the LLM retrieves relevant chunks at query time, and generates an answer. This works, but the LLM is rediscovering knowledge from scratch on every question. There's no accumulation. Ask a subtle question that requires synthesizing five documents, and the LLM has to find and piece together the relevant fragments every time. Nothing is built up. NotebookLM, ChatGPT file uploads, and most RAG systems work this way.

The idea here is different. Instead of just retrieving from raw documents at query time, the LLM incrementally builds and maintains a persistent wiki — a structured, interlinked collection of markdown files that sits between you and the raw sources. When you add a new source, the LLM doesn't just index it for later retrieval. It reads it, extracts the key information, and integrates it into the existing wiki — updating entity pages, revising topic summaries, noting where new data contradicts old claims, strengthening or challenging the evolving synthesis. The knowledge is compiled once and then kept current, not re-derived on every query.

This is the key difference: the wiki is a persistent, compounding artifact. The cross-references are already there. The contradictions have already been flagged. The synthesis already reflects everything you've read. The wiki keeps getting richer with every source you add and every question you ask.

You never (or rarely) write the wiki yourself — the LLM writes and maintains all of it. You're in charge of sourcing, exploration, and asking the right questions. The LLM does all the grunt work — the summarizing, cross-referencing, filing, and bookkeeping that makes a knowledge base actually useful over time. In practice, I have the LLM agent open on one side and Obsidian open on the other. The LLM makes edits based on our conversation, and I browse the results in real time — following links, checking the graph view, reading the updated pages. Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase.

This can apply to a lot of different contexts. A few examples:

- Personal: tracking your own goals, health, psychology, self-improvement — filing journal entries, articles, podcast notes, and building up a structured picture of yourself over time.
- Research: going deep on a topic over weeks or months — reading papers, articles, reports, and incrementally building a comprehensive wiki with an evolving thesis.
- Reading a book: filing each chapter as you go, building out pages for characters, themes, plot threads, and how they connect. By the end you have a rich companion wiki.
- Business/team: an internal wiki maintained by LLMs, fed by Slack threads, meeting transcripts, project documents, customer calls.
- Competitive analysis, due diligence, trip planning, course notes, hobby deep-dives.

## Architecture

There are three layers:

**Raw sources** — your curated collection of source documents. Articles, papers, images, data files. These are immutable — the LLM reads from them but never modifies them. This is your source of truth.

**The wiki** — a directory of LLM-generated markdown files. Summaries, entity pages, concept pages, comparisons, an overview, a synthesis. The LLM owns this layer entirely. It creates pages, updates them when new sources arrive, maintains cross-references, and keeps everything consistent. You read it; the LLM writes it.

**The schema** — a document (e.g. CLAUDE.md for Claude Code or AGENTS.md for Codex) that tells the LLM how the wiki is structured, what the conventions are, and what workflows to follow when ingesting sources, answering questions, or maintaining the wiki. This is the key configuration file — it's what makes the LLM a disciplined wiki maintainer rather than a generic chatbot. You and the LLM co-evolve this over time as you figure out what works for your domain.

## Operations

**Ingest.** You drop a new source into the raw collection and tell the LLM to process it. An example flow: the LLM reads the source, discusses key takeaways with you, writes a summary page in the wiki, updates the index, updates relevant entity and concept pages across the wiki, and appends an entry to the log. A single source might touch 10-15 wiki pages.

**Query.** You ask questions against the wiki. The LLM searches for relevant pages, reads them, and synthesizes an answer with citations. Answers can take different forms depending on the question — a markdown page, a comparison table, a slide deck (Marp), a chart (matplotlib), a canvas. The important insight: good answers can be filed back into the wiki as new pages.

**Lint.** Periodically, ask the LLM to health-check the wiki. Look for: contradictions between pages, stale claims that newer sources have superseded, orphan pages with no inbound links, important concepts mentioned but lacking their own page, missing cross-references, data gaps that could be filled with a web search.

## Indexing and logging

Two special files help the LLM (and you) navigate the wiki as it grows:

**index.md** is content-oriented. It's a catalog of everything in the wiki — each page listed with a link, a one-line summary, and optionally metadata like date or source count. Organized by category. The LLM updates it on every ingest.

**log.md** is chronological. It's an append-only record of what happened and when — ingests, queries, lint passes. The log gives you a timeline of the wiki's evolution.

## Why this works

The tedious part of maintaining a knowledge base is not the reading or the thinking — it's the bookkeeping. Updating cross-references, keeping summaries current, noting when new data contradicts old claims, maintaining consistency across dozens of pages. Humans abandon wikis because the maintenance burden grows faster than the value. LLMs don't get bored, don't forget to update a cross-reference, and can touch 15 files in one pass. The wiki stays maintained because the cost of maintenance is near zero.

The human's job is to curate sources, direct the analysis, ask good questions, and think about what it all means. The LLM's job is everything else.

The idea is related in spirit to Vannevar Bush's Memex (1945) — a personal, curated knowledge store with associative trails between documents.

## Note

This document is intentionally abstract. It describes the idea, not a specific implementation. The right way to use this is to share it with your LLM agent and work together to instantiate a version that fits your needs. The document's only job is to communicate the pattern. Your LLM can figure out the rest.

---

<div class="resume-section">
  <h2 class="section-heading">Navigation</h2>
  <ul class="job-details">
    <li><a href="/projects/ai/qkview-runbook/">← Back to QKView LLM Wiki Runbook</a></li>
    <li><a href="/projects/ai/qkview-runbook/Claude.Wiki.Concept.Analysis/">Next: Concept Analysis →</a></li>
    <li><a href="/projects/ai/qkview-runbook/How.I.Was.Created/">Design Conversation Transcript →</a></li>
    <li><a href="/projects/ai/qkview-runbook/Draft.qkview-analysis-skill/">Skill Draft →</a></li>
  </ul>
</div>