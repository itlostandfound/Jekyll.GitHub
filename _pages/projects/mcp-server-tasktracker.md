---
layout: single
title: MCP Server — Task Tracker
permalink: /projects/mcp-server-tasktracker/
---

<div class="resume-hero">
  <p class="resume-tagline">MCP Integration Layer &nbsp;·&nbsp; Conversational Task Management &nbsp;·&nbsp; TypeScript</p>
  <p class="resume-summary">An MCP (Model Context Protocol) server that exposes the full Task-Tracker REST API as MCP tools, enabling any MCP-compatible AI agent to manage trackers, tasks, notes, checklists, and projects conversationally. Same capabilities as the web dashboard, driven by natural language.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">What It Does</h2>
  <ul class="job-details">
    <li><strong>Full API Coverage</strong> — Every Task-Tracker REST endpoint is exposed as an MCP tool, 1:1. No invented aggregates, no client-side validation duplicating what the API already does.</li>
    <li><strong>Trackers &amp; Tasks</strong> — Create, list, update, and delete trackers and tasks. Set severity, toggle completion, reorder by drag-ID lists.</li>
    <li><strong>Rich Text Notes</strong> — Create, read, update, and delete TipTap rich-text notes attached to any task.</li>
    <li><strong>Dynamic Checklists</strong> — Full checklist CRUD, template cloning across devices, undo-delete, text and command step types with completion timestamps.</li>
    <li><strong>Projects with Steps &amp; References</strong> — Multi-step project plans with rich-text content per step, reference links, drag-reorder, and completion toggling.</li>
    <li><strong>Fail-Fast Startup</strong> — Missing environment variables produce clear error messages at launch, not silent misconfiguration.</li>
    <li><strong>Standalone Companion</strong> — Not published to any package registry. Clone, configure, and wire into your MCP client. No global installs, no npm publish step.</li>
  </ul>
</div>

<div class="resume-section">
  <h2 class="section-heading">Architecture</h2>
  <div class="skill-grid">

    <div class="skill-card">
      <h3>Language &amp; Build</h3>
      <ul>
        <li>TypeScript 97.1% / JavaScript 2.9%</li>
        <li>Node.js 18+ runtime</li>
        <li>Compiled output at <code>dist/index.js</code></li>
        <li><code>npm run build</code> — single compile step</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>MCP Protocol</h3>
      <ul>
        <li>Model Context Protocol SDK</li>
        <li>Stdio transport (spawned by MCP client)</li>
        <li>Tool-based API surface (no resources, no prompts)</li>
        <li>Environment variable configuration</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Configuration</h3>
      <ul>
        <li><code>TASKTRACKER_API_URL</code> — Base URL of Task-Tracker instance</li>
        <li><code>TASKTRACKER_API_TOKEN</code> — API secret token</li>
        <li><code>DEBUG</code> — Optional request/response logging to stderr</li>
        <li>Env vars set in MCP client config, not committed files</li>
      </ul>
    </div>

  </div>
</div>

<div class="resume-section">
  <h2 class="section-heading">Why I Built It</h2>
  <p>Task-Tracker already had a full REST API with bearer token auth, designed from v3 to be MCP-ready. But an API is only useful if something can talk to it. The MCP server closes that gap — any MCP-compatible agent (Claude Desktop, Claude Code, Hermes, or others) can now manage my Task-Tracker instance conversationally, with the same capabilities as the web dashboard.</p>
  <p>The 1:1 tool-to-endpoint mapping was deliberate. No aggregate endpoints that hide complexity, no client-side validation that drifts from the API. The MCP layer is a thin, honest bridge. If the API gains a new endpoint, the server gains a new tool. Simple mapping, simple maintenance.</p>
  <p>TypeScript was the natural choice — the MCP SDK ships first-class TypeScript types, and the compiled output runs in any Node.js environment without a runtime dependency chain. Clone, build, configure, connect. That's the whole workflow.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">MCP Tools</h2>
  <table class="job-table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Tools</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="job-company">Trackers</td>
        <td class="job-role-sm">list_trackers, create_tracker, get_tracker, update_tracker, delete_tracker</td>
      </tr>
      <tr>
        <td class="job-company">Tasks</td>
        <td class="job-role-sm">list_tasks, create_task, get_task, update_task, delete_task</td>
      </tr>
      <tr>
        <td class="job-company">Notes</td>
        <td class="job-role-sm">list_notes, create_note, get_note, update_note, delete_note</td>
      </tr>
      <tr>
        <td class="job-company">Checklists</td>
        <td class="job-role-sm">list_checklists, create_checklist, get_checklist, update_checklist, delete_checklist, clone_checklist, undo_checklist_delete</td>
      </tr>
      <tr>
        <td class="job-company">Projects</td>
        <td class="job-role-sm">list_projects, create_project, get_project, update_project, delete_project, list_project_steps, add_project_step, reorder_project_steps, update_project_step, toggle_project_step_complete, delete_project_step</td>
      </tr>
      <tr>
        <td class="job-company">References</td>
        <td class="job-role-sm">list_step_references, add_step_reference, update_step_reference, delete_step_reference</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Client Setup</h2>
  <table class="job-table">
    <thead>
      <tr>
        <th>Client</th>
        <th>Config Location</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="job-company">Claude Desktop</td>
        <td class="job-role-sm"><code>claude_desktop_config.json</code> — spawn <code>node dist/index.js</code> with env vars</td>
      </tr>
      <tr>
        <td class="job-company">Claude Code</td>
        <td class="job-role-sm"><code>.mcp.json</code> or <code>claude mcp add</code> — same JSON structure</td>
      </tr>
      <tr>
        <td class="job-company">Hermes Agent</td>
        <td class="job-role-sm"><code>config.yaml</code> native MCP client — stdio transport</td>
      </tr>
      <tr>
        <td class="job-company">Any MCP Client</td>
        <td class="job-role-sm">Spawn <code>node dist/index.js</code> with <code>TASKTRACKER_API_URL</code> and <code>TASKTRACKER_API_TOKEN</code></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Details</h2>
  <table class="job-table">
    <tbody>
      <tr>
        <td class="job-company">Status</td>
        <td class="job-role-sm">v1.0.0 · In Production</td>
      </tr>
      <tr>
        <td class="job-company">Language</td>
        <td class="job-role-sm">TypeScript 97.1% · JavaScript 2.9%</td>
      </tr>
      <tr>
        <td class="job-company">Runtime</td>
        <td class="job-role-sm">Node.js 18+</td>
      </tr>
      <tr>
        <td class="job-company">License</td>
        <td class="job-role-sm">MIT</td>
      </tr>
      <tr>
        <td class="job-company">Source</td>
        <td class="job-role-sm"><a href="https://github.com/itlostandfound/mcp-server-tasktracker">GitHub — itlostandfound/mcp-server-tasktracker</a></td>
      </tr>
      <tr>
        <td class="job-company">Requires</td>
        <td class="job-role-sm"><a href="https://github.com/itlostandfound/Task-Tracker">Task-Tracker</a> v3.0.x instance with API access</td>
      </tr>
    </tbody>
  </table>
</div>