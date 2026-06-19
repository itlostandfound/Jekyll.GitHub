---
layout: post
title: "QKView LLM Wiki Brain"
date: 2026-05-27 10:00:00 -0500
categories: [ai, f5, self-hosted, obsidian, wiki-brain]
---

The TMSH Wiki proved the pattern. The QKView Wiki weaponized it.

F5 BIG-IP QKView diagnostic archives are the primary artifact for remote support cases and proactive health assessments. But analyzing them is slow, inconsistent, and heavily reliant on individual engineer experience. A QKView contains dozens of XML files, configuration dumps, log excerpts, certificate inventories, and hardware telemetry — and no two engineers will examine the same data the same way.

I built a wiki that doesn't just store knowledge. It **runs** the analysis.

## From Reference to Runbook

The TMSH Wiki is a static reference — you look up syntax, it gives you ground truth. The QKView Wiki evolved the pattern into something procedural: a self-improving runbook that walks over 20+ deterministic Python scripts against a QKView diagnostic archive, follows a check analysis playbook, and gets smarter after every engagement through the re-ingestion of a deviation file created during the process.

The key innovation is the **Execute / Refine cycle**:

1. **Execute** — The skill points the agent at a QKView file (outside the wiki repo), sets up an engagement workspace (also outside the wiki repo), and walks the playbook through 21 checks in order. Each check runs a Python extractor script, reads the pre-computed result, and if the result is `warn` or `crit`, reads the check page and drilldown. Findings are written to an external workspace. Deviations are queued — never modifying the wiki during Execute.

2. **Refine** — After Execute completes, a separate session processes the deviation queue. The **generalize step is mandatory and comes first** — stripping every client-identifying detail (names, hostnames, IPs, serial numbers, exact percentages) before anything enters the wiki. Fixes are routed to the correct surface: wiki page, extractor script, or both.

The wiki compounds. Every engagement that deviates from the playbook produces a lesson that gets generalized and filed back, making the next run more accurate.

## The Extractor Layer

After a second engagement revealed that Claude was sometimes skipping analytical work by not fully parsing raw XML — and a Haiku-class model test showed fabricated all-clears — I added 20+ Python scripts that deterministically parse QKView XML artifacts and emit structured Markdown with:

- A leading `result: ok|warn|crit|n/a` line — the threshold judgment, already made
- Captured data tables with the raw evidence
- Drill-route signals for branching
- Verify sections posing the wiki's named possible causes as numbered questions

The extractors make hallucinated all-clears **structurally hard**: a model walking the playbook reads pre-computed `result: crit` lines rather than trying to interpret raw XML.

## Sterility

The QKView Wiki has a sterility constraint that the TMSH Wiki doesn't. The TMSH Wiki is purely F5 vendor knowledge — no client data to protect. The QKView Wiki runs against real client device data on every engagement. The constraint is absolute:

**No client-identifying data ever enters the wiki repo.** Not in frontmatter, not in log entries, not in lesson files, not in commit messages, not in filenames. The generalize step during Refine is mandatory. A deviation note saying "client's /var was at 88%" becomes "For `/var`, fill rate dominates absolute %. The 80-89 warn band should escalate to crit when fill rate exceeds ~N%/day."

## The Numbers

- **72 wiki pages** — 21 checks, 18 drilldowns, 2 playbooks, 11 concepts, 9 lessons, 1 source, 1 template, 1 overview
- **20+ Python extractor scripts** covering platform, filesystem, memory, CPU, process, HA, services, network, pool/VS, certs, iRules, config hygiene, tmctl statistics, log analysis, and correlation
- **10+ engagements completed** — the wiki compounds with every run
- **2 playbooks** — `playbook-full-analysis` for normal operations and `playbook-cold-start` as a bootstrap mode

## See the Full Project

This post is an introduction. The complete project page has the full architecture, the Extractor layer breakdown, the Execute/Refine cycle, sterility rules, access rules, the creation timeline, and enhancement opportunities:

**[QKView LLM Wiki Brain →](/projects/ai/qkview-runbook/)**

---

*Reference: [Andrej Karpathy's LLM Wiki concept](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) · See also: [TMSH LLM Wiki Brain](/projects/ai/tmsh-wiki-brain/) — the static reference companion that shares the same vault architecture*