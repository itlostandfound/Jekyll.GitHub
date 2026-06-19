---
layout: single
title: QKView LLM Wiki Runbook
permalink: /projects/ai/qkview-runbook/
---

<div class="resume-hero">
  <p class="resume-tagline">Self-Improving Runbook &nbsp;·&nbsp; Decision-Tree Walks &nbsp;·&nbsp; Sterile by Design</p>
  <p class="resume-summary">A locally-hosted, compounding operational runbook for F5 BIG-IP QKView analysis. Stored as an Obsidian vault of interlinked Markdown files, it doesn't just store knowledge — it <em>runs</em> the output of over 20+ scripts against a check analysis playbook against a QKView diagnostic archive, gets smarter after every engagement through the re-ingestion of a deviation file created during the process, and never touches client data. Based on Andrej Karpathy's "LLM Wiki" pattern (See: References) — but evolved from static reference into a living procedure that refines itself.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading" style="color: #e0312d;">⚠ Disclaimer</h2>
  <p><strong>This documentation describes a tool built for internal use only.</strong> An F5 BIG-IP QKView file is an extraordinarily sensitive artifact — it contains running configurations, SSL certificate details, device serial numbers, registration keys, HA failover state, internal IP addressing, log entries that may include client traffic patterns, and in some cases plaintext credentials. Feeding a QKView into <em>any</em> cloud-hosted LLM service (free tier, consumer product, or shared API) means transmitting all of that data to a third party. <strong>Do not do this.</strong></p>
  <p>If you follow this pattern and build your own QKView analysis wiki, you should <strong>only</strong> run it against a <strong>Privately Hosted Local LLM</strong> (self-hosted, on-premises, no data leaves your network) or an <strong>Enterprise-Grade subscription</strong> with a vendor that contractually guarantees zero data retention, zero training on inputs, and zero human review of prompts (e.g., Azure OpenAI with a Data Processing Agreement, AWS Bedrock with appropriate safeguards, or equivalent). Read the terms of service carefully — most consumer LLM products explicitly reserve the right to train on your inputs. That is incompatible with QKView data. The author assumes no responsibility for data exposure resulting from misuse of this design pattern.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Important Note on Availability</h2>
  <p>This tool was built at work, for work. The actual QKView LLM Wiki repository — including all 20+ Python extractor scripts, the 72 wiki pages (and rising), the CLAUDE.md schema, and operational specifics that I will never be able to release. What I <em>can</em> provide is the complete design, architecture, operating model, and every lesson learned from building and running it — enough that someone following the same pattern against their own QKViews will arrive at the same result. The files referenced in the <strong>Source Documents</strong> section below are the full design record: the original concept essay, the analysis that adapted it, the complete design conversation transcript, and the working skill draft. Together they are a blueprint for replicating the entire system.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">The Problem It Solves</h2>
  <p>F5 BIG-IP QKView diagnostic archives are the primary artifact for remote support cases and proactive health assessments. But analyzing them is slow, inconsistent, and heavily reliant on individual engineer experience. A QKView contains dozens of XML files, configuration dumps, log excerpts, certificate inventories, and hardware telemetry — and no two engineers will examine the same data the same way.</p>
  <p>This wiki operationalizes a repeatable, documented analysis methodology:</p>
  <ul class="job-details">
    <li><strong>Consistency</strong> — every QKView gets the same check walkthrough, regardless of who (or what) is running it (I literally told Claude that the goal is to have the "Stupidest" Model available provide a detailed and actionable report)</li>
    <li><strong>Completeness</strong> — checks cover filesystem, memory, CPU, HA, services, network, pools, certificates, logs, iRules, config hygiene, and tmctl statistics — nothing gets skipped</li>
    <li><strong>Repeatability</strong> — deterministic Python extractors pre-parse XML so the AI reads structured, pre-judged results instead of raw data</li>
    <li><strong>Improvement</strong> — every engagement that deviates from the playbook produces a lesson that gets generalized and filed back, making the next run more accurate</li>
    <li><strong>Sterility</strong> — client data <em>never</em> enters the wiki. Engagement output lives in an external workspace. The wiki stays clean enough to share, version, and reuse across every engagement</li>
  </ul>
</div>

<div class="resume-section">
  <h2 class="section-heading">How It Differs from the TMSH Wiki</h2>
  <div class="skill-grid">

    <div class="skill-card">
      <h3>TMSH Wiki</h3>
      <ul>
        <li><strong>Purpose:</strong> Static reference — look up TMSH syntax</li>
        <li><strong>Grows via:</strong> Adding source documents (K-articles, PDFs)</li>
        <li><strong>Operations:</strong> Ingest, Query, Lint</li>
        <li><strong>Access:</strong> Direct file reads, triggered by TMSH questions</li>
        <li><strong>Tools layer:</strong> None — pure knowledge base</li>
        <li><strong>Sterility:</strong> No constraint — no client data ever enters it</li>
        <li><strong>CLAUDE.md role:</strong> Gold-standard template for all other repos</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>QKView Wiki</h3>
      <ul>
        <li><strong>Purpose:</strong> Self-improving runbook — walk a procedure against live data</li>
        <li><strong>Grows via:</strong> Engagement Refine passes (deviations → lessons)</li>
        <li><strong>Operations:</strong> Ingest, Query, Execute, Refine, Lint</li>
        <li><strong>Access:</strong> Mediated by <code>qkview-analysis-skill</code> for Execute</li>
        <li><strong>Tools layer:</strong> 20+ Python extractor scripts (deterministic pre-parsing)</li>
        <li><strong>Sterility:</strong> Prime Directive — no client data <em>ever</em> enters the repo</li>
        <li><strong>CLAUDE.md role:</strong> Instantiates the template with QKView-specific operations</li>
      </ul>
    </div>

  </div>
</div>

<div class="resume-section">
  <h2 class="section-heading">Architecture</h2>
  <div class="skill-grid">

    <div class="skill-card">
      <h3>Vault Structure</h3>
      <ul>
        <li><strong>raw/</strong> — Immutable source documents (K-articles, SME notes)</li>
        <li><strong>samples/</strong> — Sanitized QKView fixtures for testing</li>
        <li><strong>tools/</strong> — 20+ Python extractor scripts + helpers</li>
        <li><strong>wiki/checks/</strong> — 21 atomic check pages with decision graphs</li>
        <li><strong>wiki/drilldowns/</strong> — 18 drilldown pages (triggered when checks trip thresholds)</li>
        <li><strong>wiki/playbooks/</strong> — 2 playbooks (full-analysis + cold-start)</li>
        <li><strong>wiki/concepts/</strong> — 11 F5 reference concept pages</li>
        <li><strong>wiki/lessons/</strong> — 9 generalized lessons from past engagements</li>
        <li><strong>wiki/sources/</strong> — 1 source summary per ingested K-article/doc</li>
        <li><strong>wiki/templates/</strong> — Engagement output format template</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Page Schema</h3>
      <ul>
        <li>YAML frontmatter: title, category, tags, sources, lessons, updated date</li>
        <li>Check pages add: <code>data_source</code>, <code>extractor</code>, <code>version_applies</code>, <code>thresholds</code>, <code>on_ok/on_warn/on_crit</code> arrays</li>
        <li>The <code>on_ok</code>/<code>on_warn</code>/<code>on_crit</code> arrays make the decision graph machine-walkable</li>
        <li>The <code>extractor</code> field points to the Python script that pre-evaluates the threshold</li>
        <li>Obsidian wikilinks for cross-references between checks, drilldowns, and concepts</li>
        <li>Obsidian callouts for warnings, notes, and tips</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Five Operations</h3>
      <ul>
        <li><strong>Ingest</strong> — Drop a source into <code>raw/</code>, agent reads it, creates source summary + updates all relevant pages, updates index and log</li>
        <li><strong>Query</strong> — Standard question-answering against the wiki, with cited synthesis</li>
        <li><strong>Execute</strong> — Gated by <code>qkview-analysis-skill</code>. Walk the playbook against a live QKView. Write findings to external workspace. Queue deviations — never modify wiki inline during Execute</li>
        <li><strong>Refine</strong> — After Execute, generalize deviations (strip all client-identifying detail), route fixes to wiki vs. tools vs. both, apply on approval. The improvement engine</li>
        <li><strong>Lint</strong> — Health check: sterility violations (highest priority), contradictions, stale claims, orphan pages, threshold values without sources, missing version fields</li>
      </ul>
    </div>

  </div>
</div>

<div class="resume-section">
  <h2 class="section-heading">The Extractor Layer</h2>
  <p>The 20+ Python scripts in <code>tools/</code> are the deterministic parsing layer that separates fact-derivation from interpretation. Each extractor runs against a specific QKView XML artifact and emits structured Markdown with:</p>
  <ul class="job-details">
    <li>A leading <code>result: ok|warn|crit|n/a</code> line — the threshold judgment, already made</li>
    <li>Captured data tables with the raw evidence</li>
    <li>Drill-route signals (e.g., <code>_usr_lv_branch: only_current_family</code>)</li>
    <li>Verify sections posing the wiki's named possible causes as numbered questions</li>
  </ul>
  <p>This design was added after a second engagement revealed that Claude was sometimes skipping analytical work by not fully parsing raw XML — and a Haiku-class model test showed fabricated all-clears. The extractors make hallucinated all-clears <em>structurally hard</em>: a model walking the playbook reads pre-computed <code>result: crit</code> lines rather than trying to interpret raw XML.</p>

  <div class="highlights-grid" style="margin-top: 1.5rem;">

    <div class="highlight-card">
      <div class="highlight-icon">🖥️</div>
      <div>
        <p><strong>Platform &amp; System</strong> — extract-platform, extract-filesystem, extract-memory, extract-cpu-load, extract-process-health, extract-license</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">🌐</div>
      <div>
        <p><strong>Network &amp; HA</strong> — extract-ha-sync-state, extract-services, extract-network-interface-health</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">⚖️</div>
      <div>
        <p><strong>Application &amp; Security</strong> — extract-pool-vs-availability, extract-certs, extract-irule-health, extract-config-hygiene</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">📊</div>
      <div>
        <p><strong>tmctl Deep-Dive</strong> — extract-tmctl-virtual-servers, extract-tmctl-pools, extract-tmctl-irules, extract-tmctl-monitors, extract-tmctl-connections, extract-tmctl-ssl</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">🔍</div>
      <div>
        <p><strong>Log Analysis</strong> — extract-log-stats</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">🔗</div>
      <div>
        <p><strong>Correlation &amp; Helpers</strong> — correlate (cross-section synthesis), extract_cmd (generic helper), find_down (pool/VS down detection)</p>
      </div>
    </div>

  </div>
</div>

<div class="resume-section">
  <h2 class="section-heading">Sterility — The Prime Directive</h2>
  <p>The QKView Wiki has a sterility constraint that the TMSH Wiki does not. The TMSH Wiki has no client data to protect — it is purely F5 vendor knowledge. The QKView Wiki is used against real client device data on every engagement. The constraint is absolute:</p>

  <p><strong>Forbidden anywhere in the wiki repo, including frontmatter, log entries, lesson files, commit messages, and filenames:</strong></p>
  <ul class="job-details">
    <li>Client names, organization names, project codenames</li>
    <li>Hostnames, device names, FQDNs</li>
    <li>Device serial numbers, registration keys, license keys</li>
    <li>IP addresses from any real environment (RFC 5737 docs ranges only in examples)</li>
    <li>Certificate content, key material, fingerprints</li>
    <li>Verbatim configuration excerpts from a real QKView</li>
    <li>Engagement dates tied to a specific client</li>
    <li>Support case IDs, ticket numbers</li>
  </ul>

  <p>During Refine, the <strong>generalize step is mandatory</strong> and comes first. A deviation note from an engagement might say "client's /var was at 88% with rapid fill rate." That cannot enter the wiki. It becomes: "For <code>/var</code>, fill rate dominates absolute %. The 80-89 warn band should escalate to crit when fill rate exceeds ~N%/day." If generalization without losing the lesson is impossible, the lesson is flagged and skipped until it can be reworded.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">How It Was Created</h2>

  <div class="highlights-grid">

    <div class="highlight-card">
      <div class="highlight-icon">📐</div>
      <div>
        <p><strong>Phase 1 — Concept &amp; Design (2026-05-27)</strong> — Rather than feeding the generic LLM Wiki pattern prompt directly to Claude, a deliberate design process was followed first. The Karpathy Wiki LLM concept essay was placed in the vault root. Claude analyzed how the generic pattern should be adapted for QKView analysis specifically — treating it differently than the TMSH wiki because QKView analysis is procedural rather than reference-oriented. The analysis identified five key design decisions that became the foundation of the CLAUDE.md schema.</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">🧱</div>
      <div>
        <p><strong>Phase 2 — Scaffold (2026-05-27)</strong> — Initial wiki created with just three pages: <code>index.md</code>, <code>log.md</code>, and <code>overview.md</code>. A <code>playbook-cold-start</code> was immediately added — a bootstrap-mode checklist that lets the agent walk a QKView by analyst judgment when the wiki has no coverage yet. The full analysis playbook didn't exist yet, but an engagement could still be run.</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">🚀</div>
      <div>
        <p><strong>Phase 3 — First Engagement &amp; Cold-Start Refine (2026-05-27)</strong> — The wiki went immediately into use on a real QKView engagement before the playbook existed. Cold-start mode generated a 23-entry deviation queue. The subsequent Refine pass generalized all 23 deviations into <strong>38 new wiki pages</strong> — 15 check pages, 13 drilldown pages, 8 concept pages, 2 lessons, 1 playbook, 1 template, and 2 tools. This single Refine pass created the full <code>playbook-full-analysis</code> and most of the core wiki content.</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">🛡️</div>
      <div>
        <p><strong>Phase 4 — Extractor Layer Added (2026-05-28)</strong> — After a second engagement revealed that Claude was sometimes skipping analytical work by not fully parsing raw XML (and a Haiku-class model test showed fabricated all-clears), seven Python scripts were written to deterministically parse QKView XML artifacts. The extractors emit structured Markdown with pre-computed threshold judgments, making hallucinated all-clears structurally hard.</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">📈</div>
      <div>
        <p><strong>Phase 5 — TMCTL Deep-Dive Layer (2026-06-04)</strong> — A second extraction suite targeting <code>stat_module.xml</code> — the tmctl statistics tables exposing VS connection counts, pool pick rejections, iRule execution cycles, monitor instance states, connection table utilization, and SSL handshake performance. Six new Python scripts, six new check pages, three new drilldowns, and enriched operational context fields.</p>
      </div>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">🔄</div>
      <div>
        <p><strong>Phase 6 — Ongoing Refinement (2026-06-05, 2026-06-09, 2026-06-18)</strong> — Multiple Refine passes continuously improved both wiki and tools: output caps removed from extractor tables, EHF detection corrected, license service check staleness corrected (devices 371 days stale while processing traffic, proved by K000151595), ClientSSL vs ServerSSL impact differentiation in cert extractor, HA multicast interface false positive eliminated, <code>/usr</code> partition guidance expanded with APM and iRulesLX branches.</p>
      </div>
    </div>

  </div>
</div>

<div class="resume-section">
  <h2 class="section-heading">The Execute / Refine Cycle</h2>
  <p>The core innovation of this wiki over the TMSH reference model. This is where the "self-improving runbook" actually improves itself:</p>

  <div class="skill-grid">

    <div class="skill-card">
      <h3>Execute (via qkview-analysis-skill)</h3>
      <ul>
        <li>The skill points the agent at a QKView file (outside the wiki repo)</li>
        <li>Sets up an engagement workspace (also outside the wiki repo)</li>
        <li>Walks <code>playbook-full-analysis</code> — 20+ checks in order</li>
        <li>For each check: run the extractor script, read the <code>result:</code> line, if <code>warn</code>/<code>crit</code> read the check page + drilldown, verify against QKView artifacts</li>
        <li>Write findings per <code>template-findings.md</code> with Diagnosed, Recommendation, K-articles fields</li>
        <li>If anything doesn't fit: <strong>append a deviation note</strong> — don't modify wiki pages during Execute</li>
        <li>Chains into <code>humanizer</code> and <code>emailable-report</code> for final deliverables</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Refine (after Execute completes)</h3>
      <ul>
        <li>Triggered by a deviation queue path — a separate, deliberate session</li>
        <li><strong>Generalize step is mandatory and comes first</strong> — strip every engagement-shaped detail (client names, hostnames, IPs, percentages tied to a specific device)</li>
        <li>Route the fix to the correct surface: wiki page, extractor script, or both</li>
        <li>Propose changes per item, apply on approval</li>
        <li>Update <code>index.md</code> and <code>log.md</code></li>
        <li>Execute operations <em>never</em> appear in <code>log.md</code> — only wiki-internal events (ingest, refine, deviation-filed, lint, edit)</li>
      </ul>
    </div>

  </div>

  <p>The bi-directional nature of Refine — fixes route to either the wiki or the tools depending on whether the gap was interpretive or detection-based — is the project's central improvement mechanism.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Access Rules</h2>
  <p>Unlike the TMSH Wiki, the QKView Wiki does not have a simple trigger list. Its access is mediated entirely by the <code>qkview-analysis-skill</code>:</p>
  <ul class="job-details">
    <li><strong>During an Execute pass (via the skill):</strong> the skill walks the playbook, and each check page and drilldown page is read as part of the execution loop. No page limit enforced during Execute — the playbook walks all relevant pages systematically</li>
    <li><strong>During Ingest, Refine, or Lint:</strong> wiki maintenance operations triggered manually against the wiki repo. Claude reads whatever pages are needed to correctly route and file deviations</li>
    <li><strong>The skill is the enforcement boundary</strong> that keeps engagement data out of the wiki. The wiki is sterile because the skill always writes output to an external path — there is no mechanism within the skill for findings to flow back into the repo</li>
  </ul>
</div>

<div class="resume-section">
  <h2 class="section-heading">Current State</h2>
  <table class="job-table">
    <tbody>
      <tr>
        <td class="job-company">Total Pages</td>
        <td class="job-role-sm">72 — 21 checks, 18 drilldowns, 2 playbooks, 11 concepts, 9 lessons, 1 source, 1 template, 1 overview</td>
      </tr>
      <tr>
        <td class="job-company">Extractor Scripts</td>
        <td class="job-role-sm">20+ Python scripts in tools/ (platform, filesystem, memory, CPU, process, HA, services, network, pool/VS, certs, log stats, license, iRules, config hygiene, 6× tmctl, correlation, 2 helpers)</td>
      </tr>
      <tr>
        <td class="job-company">Engagements Completed</td>
        <td class="job-role-sm">10+</td>
      </tr>
      <tr>
        <td class="job-company">Active Playbook</td>
        <td class="job-role-sm">playbook-full-analysis — 15 standard checks + 6 TMCTL deep-dive checks (21 total)</td>
      </tr>
      <tr>
        <td class="job-company">Cold-Start Fallback</td>
        <td class="job-role-sm">playbook-cold-start — bootstrap mode for novel platforms or empty-wiki scenarios</td>
      </tr>
      <tr>
        <td class="job-company">Last Wiki Change</td>
        <td class="job-role-sm">2026-06-18 — ingest of /usr partition research doc expanding APM and iRulesLX guidance</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Enhancement Opportunities</h2>
  <p>The extractor layer opens a design space the TMSH Wiki doesn't have. Because every check is backed by a deterministic Python script that emits structured Markdown, the system can be extended in ways a pure-knowledge-base cannot:</p>
  <ul class="job-details">
    <li><strong>Automated regression testing</strong> — run every extractor against the sanitized sample QKViews and diff the output. Drift in the check logic becomes visible immediately.</li>
    <li><strong>CI pipeline integration</strong> — every Refine pass that modifies an extractor or a check page could trigger an automated test suite against the fixtures.</li>
    <li><strong>Threshold calibration</strong> — the extractors emit the raw numbers alongside the judgment. Over time, the distribution of real-world results can be used to tune the warn/crit bands with evidence rather than intuition.</li>
    <li><strong>Multi-device correlation</strong> — running the skill against both members of an HA pair and cross-referencing the deviation queues could surface asymmetric configuration drift.</li>
    <li><strong>MCP conversion</strong> — the extractor scripts could be wrapped as MCP tool calls, making the QKView analysis capability available to any agent, not just Claude Code sessions pointed at the wiki repo.</li>
  </ul>
</div>

<div class="resume-section">
  <h2 class="section-heading">Details</h2>
  <table class="job-table">
    <tbody>
      <tr>
        <td class="job-company">Status</td>
        <td class="job-role-sm">Active — engagements ongoing, wiki compounding with every run</td>
      </tr>
      <tr>
        <td class="job-company">Origin Date</td>
        <td class="job-role-sm">May 2026</td>
      </tr>
      <tr>
        <td class="job-company">Pattern</td>
        <td class="job-role-sm">Adapted from Andrej Karpathy's "LLM Wiki" concept — evolved from static reference to self-improving runbook</td>
      </tr>
      <tr>
        <td class="job-company">Storage</td>
        <td class="job-role-sm">Obsidian vault (interlinked Markdown + Python extractors)</td>
      </tr>
      <tr>
        <td class="job-company">Operations</td>
        <td class="job-role-sm">Ingest, Query, Execute, Refine, Lint (three more than the TMSH Wiki)</td>
      </tr>
      <tr>
        <td class="job-company">Sterility</td>
        <td class="job-role-sm">Prime Directive — no client-identifying data ever enters the repo</td>
      </tr>
      <tr>
        <td class="job-company">Skill Integration</td>
        <td class="job-role-sm">qkview-analysis-skill — the only entry point for Execute mode</td>
      </tr>
      <tr>
        <td class="job-company">Availability</td>
        <td class="job-role-sm">Built at work for work — the repository cannot be released. Full design record is provided so others can follow the pattern.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Reference</h2>
  <p>Andrej Karpathy's GitHub Article: <a href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f">LLM Wiki</a></p>
  <p>Related Project: <a href="/projects/ai/tmsh-wiki-brain/">TMSH LLM Wiki Brain</a> — the static reference companion that shares the same vault architecture</p>
  <p>Related Project: <a href="/projects/ai/icontrol-wiki-brain/">iControl LLM Wiki Brain</a> — the REST API companion (in progress)</p>
</div>