---
layout: single
title: TMSH LLM Wiki Brain
permalink: /projects/ai/tmsh-wiki-brain/
---

<div class="resume-hero">
  <p class="resume-tagline">Structured Knowledge Base &nbsp;·&nbsp; Ground-Truth Reference &nbsp;·&nbsp; Hallucination Guard</p>
  <p class="resume-summary">A locally-hosted, compounding knowledge base for F5 BIG-IP's Traffic Management Shell. Stored as an Obsidian vault of interlinked Markdown files, it forces LLMs to consult vetted source material instead of guessing from training data. Based on Andrej Karpathy's "LLM Wiki" pattern (See: References) — feed a curated knowledge base into a session so answers are grounded in reality, not probability.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">The Problem It Solves</h2>
  <p>LLMs — including Claude — have unreliable and sometimes flat-out wrong knowledge of TMSH syntax. TMSH is purpose-built, highly structured, and full of nuances that general training data doesn't capture well:</p>
  <ul class="job-details">
    <li>Partition scoping changes behavior in ways that aren't obvious</li>
    <li><code class="language-plaintext highlighter-rouge">list</code> vs <code class="language-plaintext highlighter-rouge">show</code> have distinct semantic differences that matter</li>
    <li><code class="language-plaintext highlighter-rouge">modify</code> list replacement behavior can silently wipe configuration</li>
    <li>Flag combinations, module hierarchies, and object paths have exact syntax that training data often garbles</li>
  </ul>
  <p>Rather than accept hallucinated TMSH syntax, the wiki is the authoritative ground truth that agents are required to consult before answering any TMSH question.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Architecture</h2>
  <div class="skill-grid">

    <div class="skill-card">
      <h3>Vault Structure</h3>
      <ul>
        <li><strong>raw/</strong> — Immutable source documents, never modified by agents</li>
        <li><strong>wiki/</strong> — All generated content derived from sources</li>
        <li><strong>commands/</strong> — Pages for each TMSH verb (27 total)</li>
        <li><strong>modules/</strong> — Pages for TMSH modules (ltm, net, sys, auth, cli)</li>
        <li><strong>objects/</strong> — Pages for configuration object types</li>
        <li><strong>concepts/</strong> — Architectural and conceptual topics</li>
        <li><strong>patterns/</strong> — Recipes, workflows, and anti-patterns</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Page Schema</h3>
      <ul>
        <li>YAML frontmatter: title, category, tags, sources, updated date</li>
        <li>Obsidian wikilinks (<code>[[Page Name]]</code>) for cross-references</li>
        <li>Obsidian callouts for warnings, notes, and tips</li>
        <li>Code blocks tagged with <code>tmsh</code> language</li>
        <li>Every page ends with a "See Also" section</li>
        <li>Pages split when they exceed ~400 words</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Operations</h3>
      <ul>
        <li><strong>Ingest</strong> — Drop a source into <code>raw/</code>, agent reads it, creates source summary + relevant pages, updates index and log</li>
        <li><strong>Query</strong> — Agent reads index, reads up to 5 relevant pages, synthesizes answer with inline citations</li>
        <li><strong>Lint</strong> — Scans for contradictions, stale claims, orphan pages, missing cross-references, and out-of-date index entries</li>
      </ul>
    </div>

  </div>
</div>

<div class="resume-section">
  <h2 class="section-heading">Ingest Sources & Coverage</h2>
  <div class="highlights-grid">

    <div class="highlight-card">
      <div class="highlight-icon">📄</div>
      <div>
        <p><strong>F5 KB K13225 Cheatsheet</strong> — Established the <code>list</code> vs <code>show</code> semantic distinction as a foundational concept. First ingest, creating the initial command pages.</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">📕</div>
      <div>
        <p><strong>BIG-IP TMSH Reference Guide v17.0.0</strong> — 1,843-page authoritative F5 document. Full ingest created 47 pages: 27 commands, 5 modules, 9 objects, 4 concepts, 1 pattern, 2 source summaries, 1 overview, and 1 index.</p>
      </div>
    </div>

  </div>

  <div class="resume-section">
  <h2 class="section-heading">Current State</h2>
  <table class="job-table">
    <tbody>
      <tr>
        <td class="job-company">Total Pages</td>
        <td class="job-role-sm">48 across commands, modules, objects, concepts, patterns, sources, and overview</td>
      </tr>
      <tr>
        <td class="job-company">Sources Ingested</td>
        <td class="job-role-sm">2 — K13225 cheatsheet + full v17.0.0 TMSH reference PDF</td>
      </tr>
      <tr>
        <td class="job-company">TMSH Commands</td>
        <td class="job-role-sm">27 verbs (cd, create, delete, list, modify, show, run, save, etc.)</td>
      </tr>
      <tr>
        <td class="job-company">Modules</td>
        <td class="job-role-sm">5 (ltm, net, sys, auth, cli)</td>
      </tr>
      <tr>
        <td class="job-company">Objects</td>
        <td class="job-role-sm">9 (virtual, pool, node, persistence, vlan, self, route, route-domain, trunk)</td>
      </tr>
      <tr>
        <td class="job-company">Concepts</td>
        <td class="job-role-sm">4 (partitions, SCF, transactions, CLI scripting)</td>
      </tr>
      <tr>
        <td class="job-company">Outstanding Gaps</td>
        <td class="job-role-sm">cm, security, gtm/dns, apm, asm/waf, pem — awaiting additional source documents</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Access Rules</h2>
  <p>The wiki enforces strict reading discipline:</p>
  <ul class="job-details">
    <li><strong>Start at index.md</strong> — the navigation layer, always free (doesn't count toward page limits)</li>
    <li><strong>Read at most 5 content pages per question</strong> — if more are needed, the agent stops, reports which pages would help, and asks for permission</li>
    <li><strong>Never exceed 5 pages without explicit approval</strong> — even if the answer seems incomplete</li>
    <li><strong>Fallback is mandatory silence</strong> — if the wiki has no coverage, the agent states "The wiki does not currently cover [topic]" and suggests what source could fill the gap. It does <em>not</em> answer from training data as a substitute</li>
  </ul>
  <p>The entire point is to prevent training-data guessing. Falling back silently would defeat the purpose.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Toolchain Context</h2>
  <div class="skill-grid">

    <div class="skill-card">
      <h3>TMSH Wiki</h3>
      <ul>
        <li>Purpose: TMSH command/syntax ground truth</li>
        <li>Sterility: No constraint — no client data ever enters it</li>
        <li>Access: Direct file reads, triggered by usage rules</li>
        <li>No dedicated skill — the Local / Project CLAUDE.md is the enforcement boundary</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>TMSH Wiki Trigger</h3>
      <ul>
        <li>Purpose: Context Boundary</li>
        <li>Location:  Global CLAUDE.md</li>
        <li>Access: Query must qualify with a specific call for a TMSH Command or a query that would result in a TMSH Command</li>
      </ul>
    </div>

  </div>
</div>

<div class="resume-section">
  <h2 class="section-heading">Enhancement Opportunities</h2>
  <p>If this implementation seems limited, it is in its current state, but it does not have to stay that way.  Imagine adding in or "teaching" it scripts that would provide solutions to requests like "I want to export every Virtual Server to tmsh create commands that are executable for say a platform migration?"</p>
  <p>The possibilities of this type of resource for an F5 Administrator are endless and only limited by your imagination.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Details</h2>
  <table class="job-table">
    <tbody>
      <tr>
        <td class="job-company">Status</td>
        <td class="job-role-sm">Completed</td>
      </tr>
      <tr>
        <td class="job-company">Origin Date</td>
        <td class="job-role-sm">April 2026</td>
      </tr>
      <tr>
        <td class="job-company">Pattern</td>
        <td class="job-role-sm">Andrej Karpathy's "LLM Wiki" concept</td>
      </tr>
      <tr>
        <td class="job-company">Storage</td>
        <td class="job-role-sm">Obsidian vault (interlinked Markdown)</td>
      </tr>
      <tr>
        <td class="job-company">CLAUDE.md</td>
        <td class="job-role-sm">Gold-standard template for all other repo CLAUDE.md files</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Reference</h2>
  <p>Andrej Karpathy's GitHub Article: <a href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f">LLM Wiki</a></p>
</div>