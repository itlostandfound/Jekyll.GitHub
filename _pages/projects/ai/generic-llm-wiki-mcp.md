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
        <td class="job-company">Status</td>
        <td class="job-role-sm">v0.1.1 · Active Development</td>
      </tr>
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
  <h2 class="section-heading">Project Status</h2>
  <p>The server is built but untested in production. The code compiles, the tests pass, and the Docker image builds cleanly. Now it needs to prove itself in the real world through a staged rollout.</p>
  <ul class="job-details">
    <li><strong>Stage 1 — Build</strong> — Designed and built based on numerous existing LLM Wikis — Completed July 11, 2026</li>
    <li><strong>Stage 2 — Install and Test</strong> — Deploy the Docker container, verify the installation is bug-free, confirm the MCP endpoint responds, and validate that an agent can connect and call tools without errors. No wiki content yet, just a clean bill of health for the infrastructure.</li>
    <li><strong>Stage 3 — Initialize and Populate</strong> — Run <code>init_wiki</code> to bootstrap a fresh instance with a test schema, then fill it with test data using the full tool surface. Validate optimistic concurrency, raw immutability, and schema enforcement against real content.</li>
    <li><strong>Stage 4 — Migration</strong> — Migrate an existing on-system LLM Wiki from local filesystem access into the MCP server. This is the moment of truth: the server replaces direct vault file access, and every agent that previously read from the local Obsidian vault now goes through MCP instead. Same knowledge, different path.</li>
    <li><strong>Stage 5 — Multi-Agent Usage</strong> — Configure and test read/write access across multiple agents connecting to the same MCP server instance simultaneously.</li>
    <li><strong>Stage 6 — Local LLM Integration</strong> — Deploy the Asus Ascent GX10 with multiple "Think Model" LLMs and reconfigure the agent fleet to use it. Token burn no longer has any teeth when you own the hardware.</li>
    <li><strong>Stage 7 — Curator Deployment</strong> — LLM Wikis need to be curated, so a dedicated agent will be deployed to maintain them.</li>
  </ul>
  <p>I'm excited about this project and idea, because if it works the way that I've planned it out I will be able to go from thought to populated knowledge base in a matter of hours on virtually any topic that I can think of.</p>
</div>