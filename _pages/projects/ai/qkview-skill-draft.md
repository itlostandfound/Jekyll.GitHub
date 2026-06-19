---
layout: single
title: "QKView Runbook · Analysis Skill Draft"
permalink: /projects/ai/qkview-runbook/Draft.qkview-analysis-skill/
---

<div class="resume-hero">
  <p class="resume-tagline">Skill Boundary Definition &nbsp;·&nbsp; Enforcement Contract &nbsp;·&nbsp; I/O Specification</p>
  <p class="resume-summary">The working draft of the <code>qkview-analysis-skill</code> that gates Execute mode against the QKView LLM Wiki. This document defines the complete I/O contract: trigger phrases, inputs, preconditions, engagement workspace layout, deviation-queue format, sterility enforcement responsibilities, permissions, open questions, and implementation order. It is the enforcement boundary that keeps the wiki sterile.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Context</h2>
  <p>This skill draft was produced as part of the same design session captured in <a href="/projects/ai/qkview-runbook/How.I.Was.Created/">How I Was Created</a>. It was written to be built after the CLAUDE.md was finalized. The skill is the <strong>only entry point for Execute mode</strong> — the wiki cannot be walked as a procedure outside this skill's context. This separation is deliberate: the skill enforces sterility by ensuring all client data flows to an external engagement workspace, never back into the wiki repo.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Full Transcript</h2>
  <p>The complete text of this document is preserved below as-is from the original design session.</p>
</div>

---

# Draft: `qkview-analysis-skill`

A working draft of the Claude Code skill that will trigger Execute mode against the QKView LLM Wiki. Build this after CLAUDE.md is finalized.

---

## Purpose

Walk the QKView LLM Wiki as a procedure against an external QKView file, produce client-specific findings in an external engagement workspace, and queue any deviations encountered for a later Refine pass into the wiki.

The skill is the **enforcement boundary** that keeps the wiki sterile. CLAUDE.md states the rules; the skill encodes the I/O contract.

---

## Trigger phrases

The skill should activate on phrasings like:

- `use qkview-analysis-skill on <path-to-qkview>`
- `analyze this qkview: <path>`
- `run a QKView analysis on <path>`
- `qkview-analysis <path>`

Reject (or ask to clarify) bare invocations without a target path.

---

## Inputs (what the user must provide)

| Input                  | Required? | Description                                                                 |
|------------------------|-----------|-----------------------------------------------------------------------------|
| `qkview_path`          | yes       | Absolute path to the target QKView (`.qkview` tarball or extracted dir).   |
| `engagement_workspace` | yes       | Absolute path **outside** the wiki repo, where findings will be written.   |
| `playbook`             | no        | Slug of a playbook to pin (e.g. `playbook-full-analysis`). Defaults to overview-driven walk. |
| `bigip_version`        | no        | Override; otherwise inferred from the qkview.                              |
| `output_format`        | no        | One of `markdown`, `email-html`, `review-html`. Defaults to `markdown`.    |

If `engagement_workspace` is missing the skill MUST prompt for it before doing anything else.

---

## Hard preconditions (skill must verify before executing)

1. `qkview_path` exists and is readable.
2. `engagement_workspace` is **not** inside the wiki repo. If it is, abort.
3. `engagement_workspace` exists (or can be created) and is writable.
4. The wiki repo's git status is clean OR the user has acknowledged in-progress wiki edits will be ignored during this Execute pass.
5. CLAUDE.md is loaded and Execute mode rules are in scope.

---

## Execution contract

While the skill is active:

- The agent operates in **Execute mode** as defined in `CLAUDE.md` § Operations § 3.
- READ access to the wiki: unrestricted.
- WRITE access to the wiki: **forbidden** during Execute. All proposed wiki changes go to the deviation queue instead.
- WRITE access to the engagement workspace: unrestricted.

### File layout the skill creates in the engagement workspace

```
<engagement_workspace>/
├── findings.md              ← Populated from wiki/templates/template-findings
├── extracted/               ← Raw extracted artifacts from the QKView (XMLs, configs, logs)
├── deviations.md            ← The deviation queue (see below)
└── run.log                  ← Timestamped log of every check executed and its result
```

### The deviation queue (`deviations.md`)

Append-only during the run. Each entry:

```markdown
## [HH:MM:SS] <check-slug or "novel"> | <one-line summary>

**Triggered by:** <what the agent saw — values, paths, log signatures>
**Wiki said:** <the threshold / drilldown / rule that applied>
**Why deviated:** <reason for departing from the wiki's prescription>
**What I did instead:** <concrete action taken in this engagement>
**Worth keeping?:** yes | maybe | no
**Generalization hint:** <rough sketch of how this could become a domain rule>
```

The `Generalization hint` field is the bridge to the Refine operation. It is NOT the final lesson — it is a note-to-future-self that the Refine pass will rewrite.

### Handoff at the end of the run

The skill MUST close with:

1. A summary block: `<N> checks executed, <W> warn, <C> crit, <D> deviations queued`.
2. The absolute path to `deviations.md`.
3. An explicit reminder: *"Run Refine against this deviation queue from the wiki repo when ready."*

The skill does **not** automatically transition into Refine mode — that is a separate, explicit user action.

---

## Sterility enforcement (skill responsibilities)

The skill is the last line of defense before the wiki gets dirtied. Even though Execute mode forbids wiki writes, the skill should also:

- Refuse to write any file (anywhere) with a path containing the wiki repo root.
- Strip or warn on any artifact filename in `<engagement_workspace>` that contains the literal hostname/serial of the target device.
- At handoff, scan `deviations.md` for tokens that look like hostnames, serial numbers, RFC1918 IPs, ticket IDs, or known client name patterns. Flag any hits before declaring the run complete.

---

## Permissions & safety

- Tool permissions kept tight: `Read`, `Bash` (for extraction utilities under the wiki's `tools/`), `Write`, `Edit`. No web access, no MCP write tools, no destructive bash.
- Bash usage scoped to: untarring the qkview, running scripts under `<wiki>/tools/`, and standard read commands. The skill should not run arbitrary remote operations on the BIG-IP itself — this is an *offline* QKView analysis skill.
- Recommended denylist patterns: `rm -rf`, `git push`, `gh pr create`, anything writing into the wiki repo root.

---

## Interaction with the wiki's Refine operation

The skill produces `deviations.md`. Refine consumes it. Refine lives in the wiki and is invoked separately (`refine <path-to-deviations.md>`).

Why split? Because the **generalize step** that turns a raw engagement-shaped deviation into a sterile, filable lesson is the highest-risk step for leaking client detail. It deserves a deliberate, separate session — not a tail of the engagement run.

---

## Open questions to settle before building

1. **Extractor inventory.** What `tools/extract-*.py` scripts need to exist on day one to support the seed checks?
2. **QKView shape.** Tarball vs already-extracted directory. The skill should handle both, or pick one and document the requirement.
3. **Version detection.** Where in a QKView is the BIG-IP version most reliably read?
4. **Output formats.** Markdown findings is the baseline. Email-HTML and review-HTML can call into the `emailable-report` skill — or be templates inside the wiki.
5. **Multi-device QKViews / HA pairs.** Does the skill expect one QKView per invocation, or can it correlate two (active/standby) in a single run?
6. **Confidential-information scanner.** What's the minimum-viable sterility scan at handoff?
7. **Re-runs.** If the user runs the skill twice on the same QKView, do findings overwrite, version, or fail?

---

## Implementation order (suggested)

1. Lock down CLAUDE.md (Execute boundary rules).
2. Author 3-5 seed `wiki/checks/` pages with `data_source` / `extractor` / `thresholds` / `on_*` fully populated.
3. Write the matching `tools/extract-*.py` scripts.
4. Build `wiki/templates/template-findings.md` and `wiki/templates/template-deviations.md`.
5. Build the skill itself — start with the precondition checks and the engagement-workspace bootstrap, then the loop, then the handoff.
6. Author one sanitized sample QKView in `samples/` and run the skill against it end-to-end as the smoke test.
7. Author `playbook-full-analysis.md` once the seed checks have proved out.
8. Iterate from real engagements: every run produces a deviation queue, every Refine pass strengthens the wiki.

---

<div class="resume-section">
  <h2 class="section-heading">Navigation</h2>
  <ul class="job-details">
    <li><a href="/projects/ai/qkview-runbook/">← Back to QKView LLM Wiki Runbook</a></li>
    <li><a href="/projects/ai/qkview-runbook/QKView.Wiki.Plan/">← QKView Wiki Plan</a></li>
    <li><a href="/projects/ai/qkview-runbook/Claude.Wiki.Concept.Analysis/">← Concept Analysis</a></li>
    <li><a href="/projects/ai/qkview-runbook/How.I.Was.Created/">← How I Was Created</a></li>
  </ul>
</div>