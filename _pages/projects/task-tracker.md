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
    <li><strong>Multiple Trackers</strong> — Organize tasks by project, client, or effort. Each tracker is its own workspace.</li>
    <li><strong>Severity at a Glance</strong> — 1–10 severity scale with green-to-red color coding. No guessing which task is on fire.</li>
    <li><strong>Completion Tracking</strong> — Toggle tasks done with a single click. Progress you can see without a burndown chart.</li>
    <li><strong>Drag-and-Drop Reordering</strong> — Prioritize by dragging. No up-arrow button mashing required.</li>
    <li><strong>Rich Text Notes</strong> — Every task gets a full notes panel with a rich text editor. Context stays with the work.</li>
    <li><strong>Real-Time Updates</strong> — React Query handles caching and revalidation. Changes reflect without a full page reload.</li>
  </ul>
</div>

<div class="resume-section">
  <h2 class="section-heading">Architecture</h2>
  <div class="skill-grid">

    <div class="skill-card">
      <h3>Backend</h3>
      <ul>
        <li>FastAPI — async-first Python web framework</li>
        <li>SQLAlchemy ORM + Alembic migrations</li>
        <li>Pydantic validation schemas</li>
        <li>Uvicorn ASGI server</li>
        <li>SQLite (dev) / PostgreSQL (prod)</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Frontend</h3>
      <ul>
        <li>React 19 + TypeScript</li>
        <li>Vite build tooling</li>
        <li>Tailwind CSS</li>
        <li>React Router v6</li>
        <li>TanStack Query (server state)</li>
        <li>Zustand (client state)</li>
        <li>React Hot Toast (notifications)</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Operations</h3>
      <ul>
        <li>Docker + docker-compose for production</li>
        <li>Full REST API (trackers, tasks, notes)</li>
        <li>Swagger docs at <code>/docs</code></li>
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
        <td class="job-company">Docs</td>
        <td class="job-role-sm">Swagger UI at <code>/docs</code> — auto-generated from Pydantic schemas</td>
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
        <td class="job-role-sm">v1 Complete · v2 In Testing</td>
      </tr>
      <tr>
        <td class="job-company">Stack</td>
        <td class="job-role-sm">Python · TypeScript · React · FastAPI · SQLAlchemy · Tailwind CSS</td>
      </tr>
      <tr>
        <td class="job-company">License</td>
        <td class="job-role-sm">MIT</td>
      </tr>
      <tr>
        <td class="job-company">Source</td>
        <td class="job-role-sm"><a href="https://github.com/itlostandfound/Task-Tracker">GitHub — itlostandfound/Task-Tracker</a></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section" style="text-align:center;">
  <img src="{{ '/assets/images/Task-Tracker.v1.png' | relative_url }}" alt="Task Tracker v1 screenshot" style="max-width:100%;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
</div>