---
layout: single
title: "QKView Runbook · Concept Analysis"
permalink: /projects/ai/qkview-runbook/Claude.Wiki.Concept.Analysis/
---

<div class="resume-hero">
  <p class="resume-tagline">Design Analysis &nbsp;·&nbsp; Client-Agnostic Principle &nbsp;·&nbsp; Declarative + Procedural Hybrid</p>
  <p class="resume-summary">The design analysis that adapted the generic LLM Wiki pattern for QKView analysis specifically. This is where the key architectural decisions were first articulated: the sterility constraint, the check/drilldown decision-tree mechanic, the separation of sources from tools, and why this wiki would be fundamentally different from the TMSH reference wiki.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Context</h2>
  <p>This document was produced after reviewing both the <a href="/projects/ai/qkview-runbook/QKView.Wiki.Plan/">QKView Wiki Plan</a> (the generic Karpathy concept) and the existing TMSH LLM Wiki. It represents the moment where the project diverged from a simple "make another wiki" into a self-improving operational runbook. Read this before <a href="/projects/ai/qkview-runbook/How.I.Was.Created/">How I Was Created</a> — the analysis identifies the tensions, and the conversation resolves them.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Full Transcript</h2>
  <p>The complete text of this document is preserved below as-is from the original design session.</p>
</div>

---

# QKView LLM Wiki — Concept Analysis

This document captures the initial design analysis for a hierarchical, decision-tree-driven QKView analysis wiki, modeled on the existing TMSH LLM Wiki.

---

## Core principle: Client-Agnostic

**This wiki must remain client-agnostic.** No client name, hostname, device serial, registration key, IP address, internal certificate, configuration excerpt, or any other client-identifying artifact may be created, stored, or referenced inside this wiki.

What lives here:

- General F5 BIG-IP knowledge (TMSH commands, log signatures, log error codes, module behaviors)
- Threshold definitions and the rationale behind them (citations to F5 K-articles, vendor docs)
- Check pages with the "what to look for / when to drill" logic
- Drilldown pages with the "if you see X, investigate Y" logic
- Playbooks (multi-check sequences for full analyses, post-incident triage, etc.)
- Concept pages explaining F5 internals (TMM vs Other memory pool, BIG-IQ pool licensing semantics, Engineering Hotfix vs GA, etc.)
- Sample / sanitized QKView data **only** if every field has been scrubbed

What does **not** live here:

- Per-engagement findings, analysis output, or reports
- Anything pulled directly from a real client QKView
- Any client name in any frontmatter, body text, log entry, file path, or commit message

The Brain stays sterile so it can be safely versioned, shared, and reused across every client engagement.

---

## Conceptual sketch (the rest of the analysis)

This mirrors the TMSH wiki shape — same `raw/` / `wiki/` split, same YAML frontmatter, same `index.md` + `log.md`. The conditional drill-down lives naturally inside the frontmatter of each check page, so the analyzer is just walking a graph: check → evaluate threshold → either stop or follow the named drill-down links.

The frontmatter on each `check-*.md` carries the decision logic:

```yaml
---
title: "Filesystem capacity"
category: check
data_source: "proc_module.xml :: cmd /bin/df -h"
thresholds:
  /usr:    { ok: <80, warn: 80-89, crit: >=90 }
  /var:    { ok: <70, warn: 70-89, crit: >=90 }
  /shared: { ok: <80, warn: 80-94, crit: >=95 }
on_ok: []
on_warn: [[drill-usr-near-full]]
on_crit: [[drill-usr-near-full], [drill-disk-cleanup]]
---
```

The agent's loop becomes: read `playbook-full-analysis.md`, walk each check in order, evaluate, recurse into the drilldowns only when a threshold trips, write the per-engagement output to a **separate workspace** (not into this repo), append to `log.md`.

**Main tradeoff:** the TMSH wiki is a pure declarative knowledge base (facts about commands). A QKView Brain is half declarative (thresholds, citations to F5 K-articles, what "good" looks like) and half procedural (the walk order, the drilldown graph). Both fit in the same repo shape, but you'll feel the procedural side wanting to behave like code more than documentation — versioned, tested against sample QKViews, etc.

---

<div class="resume-section">
  <h2 class="section-heading">Navigation</h2>
  <ul class="job-details">
    <li><a href="/projects/ai/qkview-runbook/">← Back to QKView LLM Wiki Runbook</a></li>
    <li><a href="/projects/ai/qkview-runbook/QKView.Wiki.Plan/">← QKView Wiki Plan</a></li>
    <li><a href="/projects/ai/qkview-runbook/How.I.Was.Created/">Next: Design Conversation Transcript →</a></li>
    <li><a href="/projects/ai/qkview-runbook/Draft.qkview-analysis-skill/">Skill Draft →</a></li>
  </ul>
</div>