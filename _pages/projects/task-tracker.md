---
layout: single
title: Task Tracker
permalink: /projects/task-tracker/
---

<div class="resume-hero">
  <p class="resume-tagline">Full-Stack Task Management &nbsp;·&nbsp; Royal Aesthetic &nbsp;·&nbsp; Production-Ready</p>
  <p class="resume-summary">A self-hosted task tracking dashboard and organizer built for people who manage multiple projects, efforts, or initiatives at once. Dark-themed with a royal aesthetic — because if you're running the realm, your tools should look the part. Full-stack from the database to the drag handle, no framework-of-the-week shortcuts.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">What It Does</h2>
  <ul class="job-details">
    <li><strong>Multiple Trackers</strong> — Organize tasks by project, client, or effort. Each tracker is its own workspace with a name and type label.</li>
    <li><strong>Severity at a Glance</strong> — 1–10 severity scale with green-to-red color coding. No guessing which task is on fire.</li>
    <li><strong>Completion Tracking</strong> — Toggle tasks done with a single click. Progress you can see without a burndown chart.</li>
    <li><strong>Drag-and-Drop Reordering</strong> — Prioritize by dragging. No up-arrow button mashing required.</li>
    <li><strong>Rich Text Notes</strong> — Every task gets a full notes panel with a TipTap rich text editor. Title, date, and formatted content stay with the work.</li>
    <li><strong>Dynamic Checklists</strong> — Build reusable checklist templates, then clone them across devices or items. Steps can be plain text or shell commands with copy-to-clipboard, optional display labels, and hide/show toggling. Completion timestamps give you an audit trail.</li>
    <li><strong>Projects with Steps</strong> — Multi-step project plans with a TipTap rich-text editor per step, code blocks with syntax highlighting, per-step reference links, drag-reorder, completion toggling that auto-advances to the next step, progress bars, and search filtering.</li>
    <li><strong>Bearer Token Auth</strong> — All <code>/api/v1/*</code> endpoints require an <code>Authorization: Bearer</code> token. No secrets in the Docker image — the frontend picks up its token at runtime via <code>/config.js</code>. MCP-ready design lets any API consumer hit the same endpoints.</li>
    <li><strong>Real-Time Updates</strong> — TanStack Query handles caching and revalidation. Changes reflect without a full page reload.</li>
  </ul>
</div>

<div class="resume-section">
  <h2 class="section-heading">Architecture</h2>
  <div class="skill-grid">

    <div class="skill-card">
      <h3>Backend</h3>
      <ul>
        <li>FastAPI — async-first Python web framework</li>
        <li>SQLAlchemy 2.0 ORM + Alembic migrations</li>
        <li>asyncpg — async PostgreSQL driver</li>
        <li>Pydantic v2 validation schemas</li>
        <li>Uvicorn ASGI server</li>
        <li>PostgreSQL 16 (prod) / SQLite (dev)</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Frontend</h3>
      <ul>
        <li>React 18 + TypeScript</li>
        <li>Vite build tooling</li>
        <li>Tailwind CSS</li>
        <li>TipTap rich-text editor</li>
        <li>@dnd-kit drag-and-drop</li>
        <li>React Router v6</li>
        <li>TanStack Query (server state)</li>
        <li>Zustand (client state)</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Operations</h3>
      <ul>
        <li>Docker + docker-compose for production</li>
        <li>Optional Traefik reverse proxy (HTTPS)</li>
        <li>DockerHub image: <code>itlostandfound/task-tracker</code></li>
        <li>Full REST API with bearer token auth</li>
        <li>Swagger/ReDoc at <code>/docs</code> (debug mode only)</li>
        <li>Health check endpoint <code>/api/v1/health</code></li>
        <li>MIT License — open source</li>
      </ul>
    </div>

  </div>
</div>

<div class="resume-section">
  <h2 class="section-heading">Why I Built It</h2>
  <p>I needed it. Every task tracker assumes you have one project. Real infrastructure work means juggling multiple efforts across multiple environments, each with its own priority stack and its own fire drill. I needed something that treats trackers as first-class citizens, not tags on a flat list.</p>
  <p>But needing it was only the first win. Publishing it gave me the opportunity to see if others would find it useful, and more importantly, it gave me a real project to learn public GitHub integrations and CI/CD pipelines end to end (I have a Forgejo Internal Git Repository). The plan is to push a DockerHub image so anyone can pull it and run it without touching the build stack. That's the full cycle that I need to know in and out. Build what I need, share what I built, and learn what it takes to ship it properly.</p>
  <p>Win. Win. Win.</p>
  <p>The royal aesthetic is intentional. It's your realm. Manage it like you rule it.</p>
  <p>My Co-Workers Feedback:  It's nice, but the royal theme isn't my thing.  How about a Pirate or Egyptian Theme?  My response was:  "Sounds like an RFE to me..."</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Version History</h2>
  <ul class="job-details">
    <li><strong>v1 — Task Tracking Foundation</strong> — Multiple trackers, severity-coded tasks, drag-and-drop reordering, completion tracking, rich text notes.</li>
    <li><strong>v2 — Checklist System</strong> — Reusable checklist templates, clone-to-device deployment, text and command step types, copy-to-clipboard for commands, hide/show toggling, completion timestamps and audit reports.</li>
    <li><strong>v3 — Projects &amp; API Security</strong> — Multi-step projects with TipTap rich-text content per step, code blocks with syntax highlighting, per-step references, drag-reorder steps, auto-advance on completion, progress bars, incomplete-only filter, full-text search. Bearer token authentication on all API endpoints, runtime token injection via <code>/config.js</code>, MCP-ready CRUD endpoints.</li>
  </ul>
</div>

<div class="resume-section">
  <h2 class="section-heading">API Endpoints</h2>
  <table class="job-table">
    <tbody>
      <tr>
        <td class="job-company">Trackers</td>
        <td class="job-role-sm">CRUD — <code>GET/POST /api/v1/trackers</code>, <code>GET/PATCH/DELETE /api/v1/trackers/{id}</code></td>
      </tr>
      <tr>
        <td class="job-company">Tasks</td>
        <td class="job-role-sm"><code>GET/POST</code> under tracker, <code>PATCH/DELETE</code> by task ID, drag-and-drop reorder</td>
      </tr>
      <tr>
        <td class="job-company">Notes</td>
        <td class="job-role-sm"><code>GET/POST</code> under task, <code>GET/PATCH/DELETE</code> by note ID</td>
      </tr>
      <tr>
        <td class="job-company">Checklists</td>
        <td class="job-role-sm">CRUD — <code>GET/POST /api/v1/checklists</code>, <code>GET/PUT/DELETE /api/v1/checklists/{id}</code>, template clone <code>POST /api/v1/checklists/{id}/clone</code>, undo delete <code>POST /api/v1/checklists/undo</code></td>
      </tr>
      <tr>
        <td class="job-company">Projects</td>
        <td class="job-role-sm">CRUD — <code>GET/POST /api/v1/projects</code>, <code>GET/PATCH/DELETE /api/v1/projects/{id}</code>, step CRUD and reorder, per-step references</td>
      </tr>
      <tr>
        <td class="job-company">Auth</td>
        <td class="job-role-sm">Bearer token on all <code>/api/v1/*</code> endpoints; <code>/config.js</code> bootstraps the frontend</td>
      </tr>
      <tr>
        <td class="job-company">Health</td>
        <td class="job-role-sm"><code>GET /api/v1/health</code> — no token required</td>
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
        <td class="job-role-sm">v3.0.3 · In Production</td>
      </tr>
      <tr>
        <td class="job-company">Stack</td>
        <td class="job-role-sm">Python · TypeScript · React · FastAPI · SQLAlchemy · Tailwind CSS · PostgreSQL</td>
      </tr>
      <tr>
        <td class="job-company">License</td>
        <td class="job-role-sm">MIT</td>
      </tr>
      <tr>
        <td class="job-company">Source</td>
        <td class="job-role-sm"><a href="https://github.com/itlostandfound/Task-Tracker">GitHub — itlostandfound/Task-Tracker</a></td>
      </tr>
      <tr>
        <td class="job-company">Docker</td>
        <td class="job-role-sm"><code>docker pull itlostandfound/task-tracker:latest</code></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section" style="text-align:center;">
  <img src="{{ '/assets/images/Task-Tracker.v3.png' | relative_url }}" alt="Task Tracker v3 screenshot showing Projects, Checklists, and Trackers" style="max-width:100%;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
</div>
