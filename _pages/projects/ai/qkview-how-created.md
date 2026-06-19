---
layout: single
title: "QKView Runbook · How I Was Created"
permalink: /projects/ai/qkview-runbook/How.I.Was.Created/
---

<div class="resume-hero">
  <p class="resume-tagline">Design Conversation Transcript &nbsp;·&nbsp; Why Every Rule Exists &nbsp;·&nbsp; Decision Record</p>
  <p class="resume-summary">A faithful transcript of the design conversation between Michael Yates and Claude Opus 4.7 (1M context) on 2026-05-27 that produced the CLAUDE.md schema and the skill draft. Read this before second-guessing any of the rules — every constraint (sterility, Execute/Refine split, deviation queue, generalize step) was a deliberate response to a specific failure mode discussed here.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Context</h2>
  <p>This is the most important document in the design record. The <a href="/projects/ai/qkview-runbook/Claude.Wiki.Concept.Analysis/">Concept Analysis</a> identified tensions; this conversation resolved them. The five decisions baked into the CLAUDE.md came directly from this exchange:</p>
  <ol>
    <li>Dual deviation/lessons surface (raw notes + consolidated check pages)</li>
    <li><strong>Refine</strong> as a distinct operation with a mandatory generalize step</li>
    <li>Execute boundary — read wiki freely, write findings only to external workspace, never modify wiki inline during a run</li>
    <li>Sterility enforcement split — CLAUDE.md states the rules, the skill enforces the I/O contract</li>
    <li>New log entry types for refine and deviation-filed (Execute operations never log to the wiki)</li>
  </ol>
</div>

<div class="resume-section">
  <h2 class="section-heading">Full Transcript</h2>
  <p>The complete text of this document is preserved below as-is from the original design session.</p>
</div>

---

# How I Was Created

A faithful transcript of the design conversation that produced `CLAUDE.md` and `Draft.qkview-analysis-skill.md` for this repository. Captured at the moment those files were written, so the reasoning behind the rules is not lost as the wiki evolves.

Participants: **Michael Yates** (user) and **Claude Opus 4.7 (1M context)** (assistant), 2026-05-27.

---

## Turn 1 — Initial review request

### User

> I would like you to review the QKView.Wiki.Plan.md file in this folder. Take no action yet because this is going to be somewhat different. I had you do an analysis of what I want to do with this wiki in this file Claude.Wiki.Concept.Analysis.md, so review it too.

### Assistant

Both read. (Also peeked at the existing TMSH LLM Wiki since the analysis says this wiki should mirror its shape — wanted grounded feedback, not abstract feedback.)

The plan file is the generic LLM-Wiki pattern (verbatim from the public essay). The analysis file is where the real thinking is. Feedback below is mostly aimed at the analysis, with the plan as backdrop.

**What's strong in the analysis:**

- **The client-agnostic principle is the load-bearing decision** and it's stated cleanly.
- **The declarative / procedural framing.** Calling out that this wiki is half knowledge base, half decision tree is sharp.
- **Frontmatter `on_ok` / `on_warn` / `on_crit` as wiki-links.** Turning the drilldown graph into machine-walkable frontmatter is a nice mechanic.
- **The `data_source:` field** is precise and reusable.

**Tensions worth resolving before scaffolding:**

1. The generic pattern's "source → ingest → wiki gets richer" loop doesn't fit cleanly — QKViews are transient client data, not sources. The real sources are K-articles, vendor docs, SME notes. Worth being explicit that QKViews are inputs to a procedure, not sources.
2. The sketch drops `sources/` that TMSH has. K-articles and vendor docs absolutely belong there.
3. `engagements/` in the example tree is a foot-gun even with the NOTE. Delete it.
4. `raw/` is doing two jobs: source clippings and extraction helpers. Split: `raw/` for sources, `tools/` for scripts.
5. Threshold evaluation isn't specified. Is the LLM eyeballing values, or is there a deterministic extractor?
6. Version drift. BIG-IP 13 vs 17 differ on XML schema, thresholds, which subsystems exist. Checks need `version_applies:`.
7. No output template. The format of findings should be defined inside the wiki (a client-agnostic template).
8. Sanitized sample QKView is a non-trivial sub-project, not a footnote.

---

## Turn 2 — The reframe

### User

> The idea is for you to "use" this "LLM Wiki" as a repeatable action plan when analyzing a QKView. So the actions taken will enrich the LLM Wiki / action plan. They will NOT be included. Instead they will be somewhere else and the use of this will be triggered by a skill that I will create later...something like "use qkview-analysis-skill" on the file in this directory. You would then follow the plan and as you discover the need to deviate, note and update the LLM Wiki with what you saw, why you deviated, how you did it, and why it is worth doing. Does this make more sense in what I'm after?

### Assistant

Yes — that reframes it cleanly. The model restated:

- This repo is a **self-improving operational runbook**, not a knowledge accumulator.
- The primary loop has three modes:
  1. **Execute** — a future skill points the agent at a QKView in some other directory. Walk the playbook, write findings *into the engagement workspace*, never this repo.
  2. **Refine** — during or after execution, when the agent deviates from the playbook, propose wiki updates capturing *what was seen, why deviation was needed, how it was done, and why the lesson is worth keeping*.
  3. **Ingest** (secondary) — still exists, for filing K-articles / vendor docs / SME notes that justify thresholds.
- The wiki is the procedure. Engagements are runs. Lessons are commits to the procedure.

**Newly surfaced design decisions:**

1. A "deviation / lessons" surface is missing. Options: standalone `lessons/` directory, `## Lessons Learned` sections in check pages, or both (raw lessons → consolidated into check pages during periodic passes).
2. Refine needs to be a distinct operation in CLAUDE.md, not folded into Ingest.
3. The execute/refine boundary needs a rule: **queue proposed edits, don't write inline during engagement**.
4. The skill is the right place to enforce sterility, not CLAUDE.md.
5. `log.md` gets a new entry type: `refine` (or `deviation-filed`).
6. Threshold evaluation, version drift, output template, sanitized fixture — all still relevant and more important under the reframing.

**Push on:** The "deviate, then file the lesson" cycle is the heart of this design. But lessons filed under time pressure tend to be engagement-shaped and useless to future runs unless de-engagement-ified. Suggest Refine explicitly require a **"generalize" step** between raw deviation note and filed lesson.

---

## Turn 3 — The directive

### User

> bake all five into the CLAUDE.md draft, Output this ENTIRE conversation into a file in this directory named "How.I.Was.Created.md" and create another file "Draft.qkview-analysis-skill.md" to help me build the skill after we get done.

### Assistant action

Three files written:

1. **`CLAUDE.md`** — the schema and operating rules, with all five items baked in.
2. **`Draft.qkview-analysis-skill.md`** — a working draft of the skill.
3. **`How.I.Was.Created.md`** — this file.

---

## Meta-note

This transcript exists because the design decisions behind CLAUDE.md and the skill have a "why" that is hard to recover later from the artifacts alone. The sterility rule, the Execute/Refine split, the deviation queue, the generalize step — each one is a response to a specific failure mode discussed above. When future Claude (or future Michael) wonders "why is it set up this way?", read this file before second-guessing the rules.

---

<div class="resume-section">
  <h2 class="section-heading">Navigation</h2>
  <ul class="job-details">
    <li><a href="/projects/ai/qkview-runbook/">← Back to QKView LLM Wiki Runbook</a></li>
    <li><a href="/projects/ai/qkview-runbook/QKView.Wiki.Plan/">← QKView Wiki Plan</a></li>
    <li><a href="/projects/ai/qkview-runbook/Claude.Wiki.Concept.Analysis/">← Concept Analysis</a></li>
    <li><a href="/projects/ai/qkview-runbook/Draft.qkview-analysis-skill/">Next: Skill Draft →</a></li>
  </ul>
</div>