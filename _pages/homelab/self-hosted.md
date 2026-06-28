---
layout: single
title: Self Hosted
permalink: /homelab/self-hosted/
---

<div class="resume-hero">
  <p class="resume-tagline">If solves a problem, makes me more efficient, and can run locally, it runs in my lab.</p>
  <p class="resume-summary">Self-hosted services aren't just for privacy, they are a learning experience of a different type.  I'm in the constant search for or creating tools that make me more efficient.  Saving time gives me time to learn and try new things, a pursuit I enjoy.</p>
</div>

<h2 class="section-title">Open Source Resources</h2>

<div class="resume-section">
  <table class="job-table">
    <colgroup>
      <col style="min-width:190px;">
      <col style="width:140px;">
      <col style="width:100px;">
      <col>
    </colgroup>
    <thead>
      <tr>
        <th>Application</th>
        <th>Status</th>
        <th>Source</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/adguard-home.png" alt="AdGuard Home" width="24" height="24" style="vertical-align:middle; margin-right:6px;">AdGuard Home</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/adguard/adguardhome">Docker Hub</a></td>
        <td>Network-wide ad and tracker blocking DNS server. Drops ads at the DNS layer before they load. Supports DHCP, encrypted DNS (DoH/DoT/DoQ), per-client filtering rules, and real-time query logs.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/bytestash.png" alt="ByteStash" width="24" height="24" style="vertical-align:middle; margin-right:6px;">ByteStash</td>
        <td><span style="background-color:#dc2626;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Decom</span></td>
        <td><a href="https://github.com/jordan-dalby/ByteStash">GHCR</a></td>
        <td>Self-hosted code snippet manager. React + Node.js, SQLite storage. Has an MCP endpoint so AI assistants can search and manage snippets. Supports OIDC SSO.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/coder.png" alt="Code Server" width="24" height="24" style="vertical-align:middle; margin-right:6px; background-color:white; border-radius:4px; padding:2px;">Code Server</td>
        <td><span style="background-color:#dc2626;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Decom</span></td>
        <td><a href="https://hub.docker.com/r/codercom/code-server">Docker Hub</a></td>
        <td>VS Code in the browser. Full VS Code experience accessible from any device. Supports extensions, terminals, and all desktop features. Ideal for remote development on a headless server.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/dumbpad.png" alt="DumbPad" width="24" height="24" style="vertical-align:middle; margin-right:6px;">DumbPad</td>
        <td><span style="background-color:#dc2626;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Decom</span></td>
        <td><a href="https://hub.docker.com/r/dumbwareio/dumbpad">Docker Hub</a></td>
        <td>Minimal collaborative notepad with fuzzy search and Markdown preview. Very lightweight scratch pad for quick shared notes.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/file-browser.png" alt="FileBrowser" width="24" height="24" style="vertical-align:middle; margin-right:6px;">FileBrowser</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/filebrowser/filebrowser">Docker Hub</a></td>
        <td>Web-based file manager. Upload, delete, preview, rename, and edit files through a browser. Multiple users with per-user directory permissions. Single binary, no database.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/flaresolverr.png" alt="Flaresolverr" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Flaresolverr</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/flaresolverr/flaresolverr">Docker Hub</a></td>
        <td>Proxy server to bypass Cloudflare and DDoS-GUARD protection. Solves Cloudflare challenges automatically and returns cookies/clearance for use in Prowlarr, Jackett, Sonarr, and similar tools.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/forgejo.png" alt="Forgejo" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Forgejo</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://codeberg.org/forgejo/forgejo">Codeberg</a></td>
        <td>Lightweight, community-driven Git forge forked from Gitea. Code hosting, pull requests, issue tracking, CI/CD via Forgejo Actions, and package registry. Fully open source, no vendor lock-in.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/gluetun.png" alt="Gluetun" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Gluetun</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/qmcgaw/gluetun">Docker Hub</a></td>
        <td>VPN client in a container. Connects to 40+ VPN providers and routes other containers through the tunnel. Built-in kill switch, DNS over HTTPS, and health checks.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/gotify.png" alt="Gotify" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Gotify</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/gotify/server">Docker Hub</a></td>
        <td>Simple self-hosted notification server. Send push messages via REST API, receive in real time over WebSockets. Android app, web UI, and CLI. Integrates with anything that can HTTP POST.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/grafana.png" alt="Grafana" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Grafana</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/grafana/grafana">Docker Hub</a></td>
        <td>Leading open-source data visualization and dashboarding platform. Connects to Prometheus, InfluxDB, Loki, and dozens of other data sources. 1B+ pulls.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/homer.png" alt="Homer" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Homer</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/b4bz/homer">Docker Hub</a></td>
        <td>Dead simple static homepage/dashboard. Pure HTML/JS, single YAML config. No backend, no Docker API integration. Lightweight but less feature-rich than Homepage.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/homepage.png" alt="Homepage" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Homepage</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/gethomepage/homepage">Docker Hub</a></td>
        <td>Fast, static application dashboard with Docker auto-discovery and 100+ service API integrations. Configured via YAML. Successor to the original benphelps/homepage.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/immich.png" alt="Immich" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Immich</td>
        <td><span style="background-color:#d97706;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Rebuild</span></td>
        <td><a href="https://github.com/immich-app/immich">GHCR</a></td>
        <td>Self-hosted Google Photos alternative. High-performance photo and video backup with facial recognition, map view, shared albums, and mobile apps. Still in active development but very usable.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/influxdb.png" alt="InfluxDB 2" width="24" height="24" style="vertical-align:middle; margin-right:6px;">InfluxDB 2</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/_/influxdb">Docker Hub</a></td>
        <td>Purpose-built time-series database. Stores metrics and events with high compression, queries via Flux or InfluxQL. Built-in UI. Pin version tags as latest shifts to v3.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/it-tools.png" alt="IT-Tools" width="24" height="24" style="vertical-align:middle; margin-right:6px;">IT-Tools</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/corentinth/it-tools">Docker Hub</a></td>
        <td>Collection of handy developer tools in one web UI. Crypto token generators, Base64 encode/decode, UUID generators, color converters, regex testers, JWT decoders, and dozens more. All client-side.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/jekyll.png" alt="Jekyll" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Jekyll</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/jekyll/jekyll">Docker Hub</a></td>
        <td>Static site generator that transforms Markdown into websites and blogs. Ruby-based, blog-aware, and the engine behind GitHub Pages. Supports themes, plugins, and Liquid templating.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/jotty.png" alt="Jotty" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Jotty</td>
        <td><span style="background-color:#dc2626;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Decom</span></td>
        <td><a href="https://github.com/fccview/jotty">GHCR</a></td>
        <td>Lightweight self-hosted notes and checklists app. File-based storage (Markdown/JSON, no database), PGP encryption, PWA installable, 14 themes, sharing, REST API.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/kanboard.png" alt="Kanboard" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Kanboard</td>
        <td><span style="background-color:#dc2626;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Decom</span></td>
        <td><a href="https://hub.docker.com/r/kanboard/kanboard">Docker Hub</a></td>
        <td>Minimalist Kanban project management tool. PHP-based, supports SQLite, MySQL/MariaDB, PostgreSQL. Lightweight. Supports amd64 and ARM. Good for personal or small-team task tracking.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/kasm-workspaces.png" alt="KASM Workspaces" width="24" height="24" style="vertical-align:middle; margin-right:6px; background-color:white; border-radius:4px; padding:2px;">KASM Workspaces</td>
        <td><span style="background-color:#d97706;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Rebuild</span></td>
        <td><a href="https://hub.docker.com/r/kasmweb/workspaces">Docker Hub</a></td>
        <td>Browser-based container streaming platform. Launch isolated browser sessions, remote desktops, and applications in Docker containers. Used for secure browsing, development environments, and remote access.</td>
      </tr>
      <tr>
        <td>Mailrise</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/yoryan/mailrise">Docker Hub</a></td>
        <td>SMTP gateway that converts incoming emails into Apprise notifications. Routes email-only device alerts through 60+ services (Discord, Telegram, Slack, etc.). Essential home lab glue.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/mariadb.png" alt="MariaDB" width="24" height="24" style="vertical-align:middle; margin-right:6px;">MariaDB</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/_/mariadb">Docker Hub</a></td>
        <td>Open-source relational database forked from MySQL. Drop-in compatible. Commonly paired with Wiki.js, MediaWiki, and Kanboard as a database backend.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/mediawiki.png" alt="MediaWiki" width="24" height="24" style="vertical-align:middle; margin-right:6px;">MediaWiki</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/_/mediawiki">Docker Hub</a></td>
        <td>The wiki engine that powers Wikipedia. PHP-based, mature, battle-tested. Heavyweight compared to Wiki.js but unmatched for large-scale collaborative editing with extensions and templates.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/netdata.png" alt="Netdata" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Netdata</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/netdata/netdata">Docker Hub</a></td>
        <td>High-fidelity real-time system monitoring. Per-second metrics collection with zero configuration. ML-powered anomaly detection, hundreds of integrations, and stunning dashboards out of the box.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/nginx.png" alt="Nginx" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Nginx</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/_/nginx">Docker Hub</a></td>
        <td>Ubiquitous reverse proxy, load balancer, and web server. Used for static file serving, TLS termination, and proxying. Alpine and Debian variants.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/nextcloud.png" alt="NextCloud" width="24" height="24" style="vertical-align:middle; margin-right:6px;">NextCloud</td>
        <td><span style="background-color:#d97706;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Rebuild</span></td>
        <td><a href="https://hub.docker.com/_/nextcloud">Docker Hub</a></td>
        <td>Self-hosted productivity platform and file sync/share solution. Drop-in replacement for Google Drive and Dropbox. Supports calendar, contacts, mail, office suite, and 300+ community apps.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/olivetin.png" alt="OliveTin" width="24" height="24" style="vertical-align:middle; margin-right:6px;">OliveTin</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/olivetin/olivetin">Docker Hub</a></td>
        <td>Safe, simple web interface for predefined shell commands. YAML config exposes commands as buttons with optional dropdown arguments. Written in Go, very lightweight. No telemetry.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/paperless-ngx.png" alt="Paperless-NGX" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Paperless-NGX</td>
        <td><span style="background-color:#d97706;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Rebuild</span></td>
        <td><a href="https://github.com/paperless-ngx/paperless-ngx">GHCR</a></td>
        <td>Document management system that scans, OCRs, indexes, and tags your physical documents. Full-text search, automatic classification by machine learning, and audit trail. Successor to Paperless-ng.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/plex.png" alt="Plex" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Plex</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/plexinc/pms-docker">Docker Hub</a></td>
        <td>Media server that organizes movies, TV shows, music, and photos into a beautiful streaming interface. Transcodes on the fly for any device. Rich metadata, subtitles, and remote access.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/postgresql.png" alt="PostgreSQL" width="24" height="24" style="vertical-align:middle; margin-right:6px;">PostgreSQL</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/_/postgres">Docker Hub</a></td>
        <td>Powerful, standards-compliant object-relational database. Known for reliability, extensibility (JSONB, arrays, full-text search). Go-to backend for Wiki.js and many other services.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/prometheus.png" alt="Prometheus" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Prometheus</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/prom/prometheus">Docker Hub</a></td>
        <td>CNCF-graduated monitoring and alerting system. Pulls metrics from targets, evaluates alert rules, powers Grafana dashboards. PromQL queries. Standard metrics backbone for home labs.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/reactive-resume.png" alt="Reactive Resume" width="24" height="24" style="vertical-align:middle; margin-right:6px; background-color:white; border-radius:4px; padding:2px;">Reactive Resume</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/amruthpillai/reactive-resume">Docker Hub</a></td>
        <td>Free, open-source resume builder. Drag-and-drop editor, multiple versions, PDF export. Custom fonts, themes, and layouts. Built with React, uses PostgreSQL backend. V4 is current.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/readeck.png" alt="Readeck" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Readeck</td>
        <td><span style="background-color:#dc2626;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Decom</span></td>
        <td><a href="https://readeck.org/en/docs/compose">Codeberg</a></td>
        <td>Self-hosted bookmark manager and read-it-later app. Saves articles, images, and videos from the web, stores content locally for offline reading. Written in Go, SQLite or PostgreSQL.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/traefik.png" alt="Traefik" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Traefik</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/_/traefik">Docker Hub</a></td>
        <td>Modern HTTP reverse proxy and ingress controller. Auto-discovers container routes via Docker labels. Supports Let's Encrypt, middlewares, and real-time config without restarts.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/uptime-kuma.png" alt="Uptime Kuma" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Uptime Kuma</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/louislam/uptime-kuma">Docker Hub</a></td>
        <td>Self-hosted monitoring tool with a polished UI. 90+ monitor types (HTTP, TCP, ping, DNS, push). Alerts via Telegram, Discord, Slack, email, and more. Use tag 2.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/vaultwarden.png" alt="Vaultwarden" width="24" height="24" style="vertical-align:middle; margin-right:6px; background-color:white; border-radius:4px; padding:2px;">Vaultwarden</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/vaultwarden/server">Docker Hub</a></td>
        <td>Lightweight Rust-based Bitwarden server alternative. Fully compatible with official Bitwarden clients (browser, mobile, CLI). Supports orgs, U2F, YubiKey, Duo. Requires HTTPS.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/watchyourlan.png" alt="WatchYourLAN" width="24" height="24" style="vertical-align:middle; margin-right:6px;">WatchYourLAN</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/aceberg/watchyourlan">Docker Hub</a></td>
        <td>Lightweight network IP scanner with web GUI. Tracks host online/offline history, sends notifications on new devices. Can export to InfluxDB2 or Prometheus for Grafana dashboards. Written in Go.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/wud.png" alt="What's Up Docker" width="24" height="24" style="vertical-align:middle; margin-right:6px;">What's Up Docker</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/getwud/wud">Docker Hub</a></td>
        <td>Monitors running Docker containers and notifies when new image versions are available. Supports Discord, Slack, email, Telegram, Pushover. Essential for keeping images current.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/wiki-js.png" alt="Wiki.js" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Wiki.js</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/requarks/wiki">Docker Hub</a></td>
        <td>Modern wiki engine built on Node.js. Supports Markdown, WYSIWYG, and raw HTML. Backs to PostgreSQL, MySQL, or SQLite. Has git integration for versioning. Pin major version tag.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 class="section-title">AI Related</h2>

<div class="resume-section">
  <table class="job-table">
    <colgroup>
      <col style="min-width:190px;">
      <col style="width:140px;">
      <col style="width:100px;">
      <col>
    </colgroup>
    <thead>
      <tr>
        <th>Application</th>
        <th>Status</th>
        <th>Source</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/agent-zero.png" alt="Agent Zero" width="24" height="24" style="vertical-align:middle; margin-right:6px; background-color:white; border-radius:4px; padding:2px;">Agent Zero</td>
        <td><span style="background-color:#2563eb;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Testing</span></td>
        <td><a href="https://github.com/frdel/agent-zero">GitHub</a></td>
        <td>Autonomous AI agent framework designed for genuine problem-solving. Uses tool-calling, web search, and code execution in a self-correcting loop. Runs locally with Docker sandboxing for safe code execution.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/hermes-agent.png" alt="Hermes Agent" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Hermes Agent</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://github.com/nousresearch/hermes-agent">GitHub</a></td>
        <td>Open-source autonomous AI agent by Nous Research. Runs locally on macOS, Windows, and Linux. Supports multi-model providers, MCP integrations, cron scheduling, persistent memory, and extensible skills.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.simpleicons.org/lmstudio" alt="LM Studio" width="24" height="24" style="vertical-align:middle; margin-right:6px; background-color:white; border-radius:4px; padding:2px;">LM Studio</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://lmstudio.ai/">Official</a></td>
        <td>Local LLM inference app for macOS and Windows. Download and run GGUF models with a GUI. Supports OpenAI-compatible API server for connecting agents and apps to local models on Apple Silicon and NVIDIA GPUs.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/ollama.png" alt="Ollama" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Ollama</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/ollama/ollama">Docker Hub</a></td>
        <td>Lightweight local LLM runtime. Pull and run models with a single command. OpenAI-compatible API for drop-in integration with agents and tools. Supports GGUF quantization and multimodal models.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 class="section-title">Security & Monitoring</h2>

<div class="resume-section">
  <table class="job-table">
    <colgroup>
      <col style="min-width:190px;">
      <col style="width:140px;">
      <col style="width:100px;">
      <col>
    </colgroup>
    <thead>
      <tr>
        <th>Application</th>
        <th>Status</th>
        <th>Source</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/clamav.png" alt="ClamAV" width="24" height="24" style="vertical-align:middle; margin-right:6px;">ClamAV</td>
        <td><span style="background-color:#ca8a04;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending</span></td>
        <td><a href="https://hub.docker.com/r/clamav/clamav">Docker Hub</a></td>
        <td>Open-source antivirus engine for detecting trojans, viruses, and malware. Command-line scanner, daemon for on-access scanning, and freshclam signature updater. Designed for email gateway and file server integration.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/graylog.png" alt="Graylog" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Graylog</td>
        <td><span style="background-color:#ca8a04;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending</span></td>
        <td><a href="https://hub.docker.com/r/graylog/graylog">Docker Hub</a></td>
        <td>Centralized log management and SIEM. Collects, indexes, and searches logs from any source at scale. Real-time alerting, dashboards, and stream processing. Elasticsearch/MongoDB backend.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/netalertx.png" alt="NetAlertX" width="24" height="24" style="vertical-align:middle; margin-right:6px;">NetAlertX</td>
        <td><span style="background-color:#16a34a;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Active</span></td>
        <td><a href="https://hub.docker.com/r/jokobsk/netalertx">Docker Hub</a></td>
        <td>Network device monitor and asset discovery. Scans your LAN, tracks devices online/offline, alerts on new devices. Supports Sync Nodes for multi-VLAN monitoring. Integrates with InfluxDB2 and Grafana.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/wazuh.png" alt="Wazuh" width="24" height="24" style="vertical-align:middle; margin-right:6px; background-color:white; border-radius:4px; padding:2px;">Wazuh</td>
        <td><span style="background-color:#ca8a04;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending</span></td>
        <td><a href="https://hub.docker.com/r/wazuh/wazuh">Docker Hub</a></td>
        <td>Open-source security platform combining XDR and SIEM. File integrity monitoring, vulnerability detection, configuration assessment, incident response, and regulatory compliance. Agent-based with central dashboard.</td>
      </tr>
      <tr>
        <td><img src="https://cdn.jsdelivr.net/gh/selfhst/icons/png/zabbix.png" alt="Zabbix" width="24" height="24" style="vertical-align:middle; margin-right:6px;">Zabbix</td>
        <td><span style="background-color:#d97706;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Pending Rebuild</span></td>
        <td><a href="https://hub.docker.com/r/zabbix/zabbix-server-pgsql">Docker Hub</a></td>
        <td>Enterprise-class open-source monitoring for networks, servers, VMs, and cloud. Agent and agentless monitoring, auto-discovery, distributed architecture, and advanced alerting. Web UI with graphs and dashboards.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 class="section-title">Personal Projects</h2>

<div class="resume-section">
  <table class="job-table">
    <colgroup>
      <col style="min-width:190px;">
      <col style="width:140px;">
      <col style="width:100px;">
      <col>
    </colgroup>
    <thead>
      <tr>
        <th>Application</th>
        <th>Status</th>
        <th>Source</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Star Search</td>
        <td><span style="background-color:#7c3aed;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">In-Development</span></td>
        <td>GitHub</td>
        <td>An agentic application that utilizes a locally hosted Firecrawl instance (as a requirement) to find available jobs on a user defined list of sites.  This then queues the jobs for an agentic analysis of the job posting and scores them based on the user defined skills.  This is functional and operational, but requires additional development prior to release consideration.</td>
      </tr>
      <tr>
        <td>Task Tracker</td>
        <td><span style="background-color:#0d9488;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;white-space:nowrap">Released / In-Development</span></td>
        <td><a href="https://github.com/itlostandfound/Task-Tracker">GitHub</a></td>
        <td>Full-stack task tracking dashboard with a dark-themed royal aesthetic UI. Manage projects, efforts, and initiatives with severity levels, checklists, notes, and drag-and-drop reordering. FastAPI backend, React frontend.</td>
      </tr>
    </tbody>
  </table>
</div>