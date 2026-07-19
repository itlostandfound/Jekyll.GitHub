---
layout: single
title: Generic LLM Wiki (MCP)
permalink: /projects/ai/generic-llm-wiki-mcp/
---

<div class="resume-hero">
  <p class="resume-tagline">Vault-Powered Grounding &nbsp;·&nbsp; MCP Protocol &nbsp;·&nbsp; Docker-Deployed</p>
  <p class="resume-summary">A generic, agent-agnostic MCP server that turns a directory of Markdown wiki pages into a network-reachable knowledge base — queryable and updatable by any MCP-compatible client (Claude, Hermes, or otherwise), not just a local session with filesystem access. One process per wiki instance, any number of agents connecting concurrently over HTTP.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">The Problem It Solves</h2>
  <p>LLMs are confident liars. Ask about niche, structured domains (F5 TMSH, network configs, internal tooling) and you get answers that look right but are subtly wrong in ways that matter. The LLM Wiki pattern solves this by injecting curated, interlinked knowledge into the session so the agent consults the vault before answering instead of guessing from training data.</p>
  <p>The problem with previous wiki brain implementations was deployment. Each one was built as a local script running directly on the agent. That works for one agent on one machine. The moment you want another agent on another machine to use the same knowledge base, you're reinstalling, reconfiguring, and hoping both copies stay in sync.</p>
  <p>Generic LLM Wiki (MCP) will attempt to fix this by making the wiki brain a standalone service. Any MCP-compatible agent on any machine connects to it over the network. One vault, one server, many agents.  It's built.  It's ready to test!, but there are only so many hours in the day.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Architecture</h2>
  <div class="skill-grid">

    <div class="skill-card">
      <h3>Knowledge Layer</h3>
      <ul>
        <li>Directory of Markdown wiki pages with frontmatter</li>
        <li><strong>raw/</strong> — Immutable source documents, never overwritten</li>
        <li><strong>wiki/</strong> — All generated content derived from sources</li>
        <li>Per-instance <code>wiki.schema.yaml</code> defines category taxonomy, naming conventions, and guidance</li>
        <li>Append-only operation log tracks all writes</li>
        <li>Optimistic concurrency — writes require version stamps, stale writes are rejected</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>MCP Protocol</h3>
      <ul>
        <li>Model Context Protocol SDK</li>
        <li>Streamable HTTP transport — <code>POST /mcp</code></li>
        <li>Stateless, no server-side sessions</li>
        <li>Bearer token auth checked directly by the instance</li>
        <li>One process per wiki instance</li>
        <li>Any number of MCP clients connect concurrently</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Deployment</h3>
      <ul>
        <li>Docker Compose (recommended) or from source</li>
        <li>DockerHub image: <code>itlostandfound/mcp-server-llm-wiki</code></li>
        <li>Optional Traefik reverse proxy for TLS</li>
        <li>Three env vars: <code>WIKI_ROOT</code>, <code>WIKI_MCP_TOKEN</code>, <code>PORT</code></li>
        <li>Fails fast on missing config — no silent misconfiguration</li>
        <li>CI/CD: tag push auto-builds and publishes to DockerHub</li>
      </ul>
    </div>

  </div>
</div>

<div class="resume-section">
  <h2 class="section-heading">MCP Tools</h2>
  <table class="job-table">
    <thead>
      <tr>
        <th>Tool</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="job-company">init_wiki</td>
        <td class="job-role-sm">Bootstrap a wiki instance's name, description, category taxonomy, and guidance. Fails if already initialized.</td>
      </tr>
      <tr>
        <td class="job-company">get_schema</td>
        <td class="job-role-sm">Read the current instance's schema — call this first in any new session.</td>
      </tr>
      <tr>
        <td class="job-company">get_recent_log</td>
        <td class="job-role-sm">Read the most recent entries from the append-only operation log.</td>
      </tr>
      <tr>
        <td class="job-company">list_pages</td>
        <td class="job-role-sm">List all pages, optionally filtered to one category.</td>
      </tr>
      <tr>
        <td class="job-company">read_page</td>
        <td class="job-role-sm">Read a page's frontmatter, content, and version stamp.</td>
      </tr>
      <tr>
        <td class="job-company">write_page</td>
        <td class="job-role-sm">Create or update a page. Updates require <code>expectedVersion</code> from a prior <code>read_page</code>; stale values are rejected with a conflict.</td>
      </tr>
      <tr>
        <td class="job-company">append_log</td>
        <td class="job-role-sm">Append an entry to the log after an ingest/query/lint/edit. Never modifies past entries.</td>
      </tr>
      <tr>
        <td class="job-company">add_raw_source</td>
        <td class="job-role-sm">Add UTF-8 text content into <code>raw/</code>. Create-only — <code>raw/</code> is immutable. Binary files stay out-of-band.</td>
      </tr>
      <tr>
        <td class="job-company">search</td>
        <td class="job-role-sm">Full-text search across page titles, tags, and bodies.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Why MCP, Not Local</h2>
  <p>The first version of the Task Tracker MCP server was installed directly on Hermes. It worked. Hermes could call every tool, create tasks, manage projects, all through natural language. The integration was seamless.</p>
  <p>It worked. It was also wrong. It was a stepping stone and I learn from my mistakes.</p>
  <p>MCP is a client-server protocol. The agent is the client. The MCP server is a separate process that exposes tools over a transport layer. When you configure an MCP server in an agent's config file using stdio transport, you're using a convenience feature for local development. It's not the production deployment model.</p>
  <p>The mistake became obvious when I wanted Claude at work to use the same Task Tracker MCP server. Claude is on a thin client. I don't install anything on my work machine. Claude needed to connect to a server running somewhere else, and the server I built couldn't do that.</p>
  <p>Generic LLM Wiki (MCP) is built differently from the start. It runs as a Docker container on my home lab infrastructure. Agents connect to it over the network via Streamable HTTP transport. Hermes at home, Claude at work, any future agent, all pointing at the same endpoint, all getting the same grounded knowledge.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Client Setup</h2>
  <table class="job-table">
    <thead>
      <tr>
        <th>Client</th>
        <th>Configuration</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="job-company">Claude Code</td>
        <td class="job-role-sm"><code>claude mcp add --transport http my-wiki https://host:3000/mcp --header "Authorization: Bearer &lt;TOKEN&gt;"</code></td>
      </tr>
      <tr>
        <td class="job-company">Hermes Agent</td>
        <td class="job-role-sm"><code>config.yaml</code> native MCP client — Streamable HTTP transport</td>
      </tr>
      <tr>
        <td class="job-company">Any MCP Client</td>
        <td class="job-role-sm">Point at <code>https://host:3000/mcp</code> with <code>Authorization: Bearer &lt;TOKEN&gt;</code> header</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Lessons from the Task Tracker MCP Server</h2>
  <ul class="job-details">
    <li><strong>MCP servers are services, not plugins.</strong> Install them where agents can reach them, not inside the agent itself.</li>
    <li><strong>Stdio transport is for development.</strong> Production MCP servers should use Streamable HTTP so any client on any machine can connect.</li>
    <li><strong>One server, many agents.</strong> The whole point of a protocol is decoupling. Don't re-couple it by embedding the server in one agent's config.</li>
    <li><strong>Containerize early.</strong> Docker means the server runs on infrastructure you control, not on whatever machine the agent happens to be on.</li>
    <li><strong>"It works on my machine" is not deployment.</strong> If only one agent on one machine can use it, you haven't deployed it. You've hidden it.</li>
  </ul>
</div>

<div class="resume-section">
  <h2 class="section-heading">Details</h2>
  <table class="job-table">
    <tbody>
      <tr>
        <td class="job-company">Language</td>
        <td class="job-role-sm">TypeScript 91.7% · JavaScript 7.6% · Dockerfile 0.7%</td>
      </tr>
      <tr>
        <td class="job-company">Runtime</td>
        <td class="job-role-sm">Node.js 18+ · Docker Compose recommended</td>
      </tr>
      <tr>
        <td class="job-company">Protocol</td>
        <td class="job-role-sm">MCP (Model Context Protocol) · Streamable HTTP · Stateless</td>
      </tr>
      <tr>
        <td class="job-company">Auth</td>
        <td class="job-role-sm">Bearer token per instance — checked directly, not proxied</td>
      </tr>
      <tr>
        <td class="job-company">License</td>
        <td class="job-role-sm">MIT</td>
      </tr>
      <tr>
        <td class="job-company">Source</td>
        <td class="job-role-sm"><a href="https://github.com/itlostandfound/mcp-server-llm-wiki">GitHub — itlostandfound/mcp-server-llm-wiki</a></td>
      </tr>
      <tr>
        <td class="job-company">Docker</td>
        <td class="job-role-sm"><code>docker pull itlostandfound/mcp-server-llm-wiki:latest</code></td>
      </tr>
      <tr>
        <td class="job-company">Predecessors</td>
        <td class="job-role-sm"><a href="{{ '/projects/ai/tmsh-wiki-brain/' | relative_url }}">TMSH LLM Wiki Brain</a> · <a href="{{ '/projects/ai/qkview-runbook/' | relative_url }}">QKView LLM Wiki Brain</a></td>
      </tr>
      <tr>
        <td class="job-company">Related</td>
        <td class="job-role-sm"><a href="{{ '/projects/mcp-server-tasktracker/' | relative_url }}">MCP Server for Task Tracker</a> (the project that revealed the architecture mistake)</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Control Mechanism</h2>
  <p>A local LLM Wiki (accessed via direct filesystem reads on the agent's own machine) embeds its operating instructions in a project-level file (like a <code>CLAUDE.md</code> file) that sits alongside the wiki content in the repository root. When Claude Code opens a session in that directory, it reads the file automatically and follows its rules. The instructions travel with the content: same folder, same access, same lifecycle. But this means the instructions only activate when the agent is in that specific project directory — ask a question from anywhere else and the wiki is invisible.</p>
  <p>This generic MCP server is different. It has no local filesystem and no project directory. It doesn't — and shouldn't — carry domain-specific instructions inside its codebase. Instead, the operating rules that tell an agent <em>how to use a given wiki instance properly</em> must be delivered through the agent platform's own configuration system:</p>
  <ul class="job-details">
    <li><strong>Hermes Agent</strong> — instructions go into a <strong>Skill</strong> (a <code>SKILL.md</code> file under <code>~/.hermes/skills/</code>), loaded by name in the profile's skill list or on demand via <code>skill_view</code>. Skills are global to the profile — they're available in every session, not tied to a project directory. The skill file contains the domain rules, session protocol, page conventions, routing logic, and hard prohibitions that would otherwise live in a <code>CLAUDE.md</code>.</li>
    <li><strong>Claude Code (project-scoped)</strong> — instructions go into a <strong><code>.claude/CLAUDE.md</code></strong> at the project root. When Claude opens that directory, it reads the instructions automatically. This is the same pattern as a local filesystem wiki — instructions travel with the project.</li>
    <li><strong>Claude Code (global)</strong> — instructions go into <strong><code>~/.claude/CLAUDE.md</code></strong>, which Claude reads in <em>every</em> session regardless of directory. This is the direct equivalent of a Hermes Skill: always available, routing triggers activate the wiki when the topic matches. This is the preferred pattern for domain wikis you want available everywhere, not just in one project folder.</li>
  </ul>
  <p>In all cases, the <code>guidance</code> field stored inside the wiki's own <code>wiki.schema.yaml</code> (set during <code>init_wiki</code>) provides a compact summary of the domain rules that the server itself knows — but this is a <em>summary</em>, not the full operating manual. The full manual (what pages to read at session start, how to route between sibling wikis, what never to do, de-identification rules, etc.) belongs in the Skill or <code>CLAUDE.md</code>, where the agent actually consumes it. The schema guidance and the external skill reinforce each other: the schema tells any connecting agent the domain vocabulary, and the skill tells the <em>configured</em> agent the operational playbook.</p>

  <h3 class="section-heading" style="font-size:1.1em; margin-top:1.5em;">Worked Example: F5 BIG-IP Administrator Skill</h3>
  <p>The BIG-IP Administrator LLM Wiki was the first real deployment of this server. Here is the exact process used to create the control mechanism for agents connecting to it.</p>

  <h4 style="margin-top:1em;">1. Define the wiki instance</h4>
  <p>Deploy the server with a dedicated <code>WIKI_ROOT</code>, bearer token, and domain name. Configure the MCP server in the agent platform so the wiki tools appear with a recognizable prefix. In Hermes, this means adding the server to the profile's <code>config.yaml</code>:</p>
  <pre><code class="language-yaml">mcp_servers:
  bigipadmin:
    url: "https://mcp-bigipadmin.work.itlostandfound.xyz/mcp"
    headers:
      Authorization: "Bearer &lt;TOKEN&gt;"</code></pre>
  <p>In Claude Code:</p>
  <pre><code class="language-bash">claude mcp add --transport http bigipadmin https://mcp-bigipadmin.work.itlostandfound.xyz/mcp \
  --header "Authorization: Bearer &lt;TOKEN&gt;"</code></pre>

  <h4 style="margin-top:1em;">2. Bootstrap the wiki schema</h4>
  <p>Connect an agent and call <code>init_wiki</code> with the domain taxonomy, naming patterns, and guidance text. The guidance field in the schema is a <em>compact</em> version of the operating rules — enough for an unconfigured agent to avoid the worst mistakes, but not a substitute for the full skill.</p>

  <h4 style="margin-top:1em;">3. Write the Skill (or CLAUDE.md)</h4>
  <p>The skill contains everything the agent needs to operate correctly: identity, routing rules, page conventions, hard prohibitions, session start protocol, and the MCP tool reference with pitfalls. This is where the <code>CLAUDE.md</code> content <em>goes</em> when there is no project directory.</p>

  <h3 class="section-heading" style="font-size:1.1em; margin-top:1.5em;">Hermes Agent: Skill-Based Control</h3>
  <p>For Hermes, the control mechanism is a <strong>Skill</strong> — a <code>SKILL.md</code> file in the skill directory, loaded by the agent when the topic matches. The F5 BIG-IP Administrator Wiki skill (<code>f5-bigip-wiki</code>) was created with the following approach:</p>
  <ol>
    <li><strong>Identify what the CLAUDE.md did</strong> — read the existing TMSH <code>CLAUDE.md</code> and extract every operational rule: identity, repository layout, routing, page conventions, domain rules, logging format, session start protocol, and prohibitions.</li>
    <li><strong>Adapt for MCP access</strong> — replace filesystem references (<code>read_file</code>, <code>search_files</code>) with MCP tool calls (<code>mcp_bigipadmin_get_schema</code>, <code>mcp_bigipadmin_list_pages</code>, <code>mcp_bigipadmin_search</code>, <code>mcp_bigipadmin_read_page</code>). The agent never touches files directly — everything goes through the server's tools.</li>
    <li><strong>Add the tool reference and pitfalls</strong> — document all 9 MCP tools with their constraints (e.g., <code>write_page</code> requires <code>expectedVersion</code>, <code>init_wiki</code> is one-shot, <code>append_log</code> replaces manual log editing).</li>
    <li><strong>Add routing and de-identification rules</strong> — this wiki cross-links to the TMSH wiki and must never reference the QKView wiki. Client-identifying data (hostnames, IPs, case IDs) must be de-identified on ingest.</li>
  </ol>
  <p>The resulting skill is loaded with <code>skill_view(name='f5-bigip-wiki')</code> and contains the full operating manual for any Hermes agent connecting to this wiki instance.</p>
  <p><strong>Example prompt that activates the skill:</strong></p>
  <pre><code>Load the f5-bigip-wiki skill, then connect to the BIG-IP Administrator wiki.
Run the session start protocol: call get_schema, list_pages, and get_recent_log.
Report current page count, date of last update, and one-line status.</code></pre>
  <p>When this prompt arrives, Hermes loads the skill, calls the MCP tools to orient itself, and reports back — and from that point on, every query, ingest, or edit follows the skill's rules for routing, page conventions, de-identification, and logging. No explicit "use the wiki" instruction needed; the skill system activates it on topic match.</p>

  <h3 class="section-heading" style="font-size:1.1em; margin-top:1.5em;">Claude Code: Global Routing vs. Project Scoping</h3>
  <p>Claude Code has two levels where instructions can live, and they serve different purposes:</p>
  <ul class="job-details">
    <li><strong>Global <code>~/.claude/CLAUDE.md</code></strong> — read by Claude in <em>every</em> session, regardless of directory. This is the direct equivalent of a Hermes Skill: always available, always loaded. This is where wiki routing triggers and domain-awareness rules belong.</li>
    <li><strong>Project <code>.claude/CLAUDE.md</code></strong> — read only when Claude opens a session in that specific directory. This is the local-filesystem pattern the TMSH wiki uses.</li>
  </ul>
  <p>For an MCP-served wiki, the project-scoped approach requires you to <code>cd</code> into a specific directory every time you want wiki access. That works, but it limits the wiki to sessions that happen to start in that folder. The more powerful pattern is <strong>global scope</strong> — putting the routing logic in <code>~/.claude/CLAUDE.md</code> so that Claude knows the wiki exists no matter what project you're working in.</p>

  <h4 style="margin-top:1em;">Building the Skill: Global Routing + Full Operating Rules</h4>
  <p>The process mirrors the Hermes skill creation, but the output goes into Claude's global instruction file instead of a Hermes skill directory. Steps 1–4 are identical to the Hermes process (extract rules, adapt for MCP, add tool reference, add routing/de-identification). Step 5 is unique to Claude Code:</p>
  <ol start="5">
    <li><strong>Add routing triggers at the global level</strong> — in <code>~/.claude/CLAUDE.md</code>, add a directive that tells Claude <em>when</em> to activate this knowledge:</li>
  </ol>
  <pre><code class="language-markdown">## Wiki Routing

When the user asks about F5 BIG-IP administration, LTM, GTM/DNS, APM, ASM/AWAF, AFM,
or BIG-IP troubleshooting, connect to the BIG-IP Administrator wiki (MCP server: bigipadmin).
Run the session start protocol: get_schema, list_pages, get_recent_log. Then follow the
BIG-IP Administrator Wiki operating rules below for all subsequent queries and edits.

When the user asks about TMSH syntax or shell commands, connect to the TMSH wiki
(MCP server: tmsh). Follow the TMSH Wiki operating rules for syntax queries only —
never copy TMSH syntax into Administrator wiki pages.</code></pre>
  <p>This global routing trigger means Claude doesn't need to be told "use the wiki" — it recognizes the domain from the question and activates the right wiki automatically, exactly like a Hermes Skill that's loaded on topic match.</p>

  <h4 style="margin-top:1em;">Two scoping strategies compared</h4>
  <table class="job-table">
    <thead>
      <tr>
        <th>Strategy</th>
        <th>File</th>
        <th>Scope</th>
        <th>When it loads</th>
        <th>Best for</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="job-company">Project-scoped</td>
        <td class="job-role-sm"><code>.claude/CLAUDE.md</code> in project root</td>
        <td class="job-role-sm">That project only</td>
        <td class="job-role-sm">When Claude opens that directory</td>
        <td class="job-role-sm">Wikis tied to a specific codebase</td>
      </tr>
      <tr>
        <td class="job-company">Global</td>
        <td class="job-role-sm"><code>~/.claude/CLAUDE.md</code></td>
        <td class="job-role-sm">All sessions</td>
        <td class="job-role-sm">Every session, always</td>
        <td class="job-role-sm">Domain wikis you want available everywhere</td>
      </tr>
    </tbody>
  </table>
  <p>For a knowledge base like BIG-IP Administrator, global scoping is almost always the right choice. You want Claude to know the wiki exists whether you're in <code>/projects/networking/</code>, <code>/tmp/</code>, or your home directory. The routing trigger ensures it only activates when the topic is relevant — it doesn't pollute unrelated conversations.</p>
  <p><strong>Example prompt with global routing (no project scoping needed):</strong></p>
  <pre><code>What's the difference between an LTM virtual server's source-address-translation
and SNAT pool?</code></pre>
  <p>Claude sees the domain trigger in its global <code>CLAUDE.md</code>, recognizes this as a BIG-IP question, connects to the <code>bigipadmin</code> MCP server, runs the session start protocol, searches for relevant pages, and answers with citations from the wiki. No explicit "use the wiki" instruction needed.</p>

  <h3 class="section-heading" style="font-size:1.1em; margin-top:1.5em;">Summary: Where the Instructions Live</h3>
  <table class="job-table">
    <thead>
      <tr>
        <th>Agent Platform</th>
        <th>Instruction File</th>
        <th>Location</th>
        <th>Scope</th>
        <th>Delivery</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="job-company">Local filesystem wiki</td>
        <td class="job-role-sm"><code>CLAUDE.md</code></td>
        <td class="job-role-sm">Project repo root</td>
        <td class="job-role-sm">That project only</td>
        <td class="job-role-sm">Read automatically by Claude Code at session start</td>
      </tr>
      <tr>
        <td class="job-company">Hermes Agent (remote MCP)</td>
        <td class="job-role-sm"><code>SKILL.md</code></td>
        <td class="job-role-sm"><code>~/.hermes/skills/&lt;category&gt;/&lt;name&gt;/SKILL.md</code></td>
        <td class="job-role-sm">Global (all sessions for that profile)</td>
        <td class="job-role-sm">Loaded by name via skill system, on demand or in profile config</td>
      </tr>
      <tr>
        <td class="job-company">Claude Code (project-scoped)</td>
        <td class="job-role-sm"><code>.claude/CLAUDE.md</code></td>
        <td class="job-role-sm">Project directory root</td>
        <td class="job-role-sm">That project only</td>
        <td class="job-role-sm">Read automatically at session start</td>
      </tr>
      <tr>
        <td class="job-company">Claude Code (global)</td>
        <td class="job-role-sm"><code>~/.claude/CLAUDE.md</code></td>
        <td class="job-role-sm">User's home Claude config</td>
        <td class="job-role-sm">All sessions, always</td>
        <td class="job-role-sm">Read automatically in every session; routing triggers activate the wiki on topic match</td>
      </tr>
    </tbody>
  </table>
  <p>The generic MCP server provides the <em>transport and enforcement</em> (tools, auth, optimistic concurrency, structural validation). The Skill or <code>CLAUDE.md</code> provides the <em>domain operating rules</em> (what to write, how to route, what never to do). The <code>guidance</code> field in <code>wiki.schema.yaml</code> provides a <em>compact summary</em> that any connecting agent can read — but it is not a replacement for the full control mechanism. Together, these three layers ensure that every agent connecting to a wiki instance operates correctly, regardless of which agent platform it runs on.</p>
  <p><strong>The key insight:</strong> both Hermes and Claude Code need essentially the same content — domain identity, routing rules, page conventions, prohibitions, session protocol, tool reference, and pitfalls. The delivery mechanism differs (Skill vs. CLAUDE.md, on-demand loading vs. global routing trigger), but the <em>knowledge</em> is portable. A Hermes skill can be translated to a Claude <code>CLAUDE.md</code> section and vice versa with minimal adaptation (mainly MCP tool name prefixes and the routing trigger format).</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Project Status</h2>
  <p>Production-ready for single-instance deployments and is released on Docker Hub.</p>
</div>