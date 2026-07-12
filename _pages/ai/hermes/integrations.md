---
layout: single
title: Integrations
permalink: /ai/hermes/integrations/
---

## Integrations

Hermes connects to multiple services through gateways, API bridges, and direct tool access. Here's what we've wired up and the gotchas we've hit.

### Discord

Hermes communicates via a Discord bot through the messaging gateway. The gateway must be running for Discord messages to flow in or out.

**Setup:**
- `DISCORD_BOT_TOKEN` in `~/.hermes/.env`
- Gateway process runs the Discord bridge alongside the API server
- Messages from Discord channels trigger agent sessions; agent responses are delivered back to the originating channel

**Key pitfall — Dev profile messaging:** The `dev` profile was initially created without the `messaging` toolset, meaning it couldn't use `send_message` to reach Discord. Fix: add `messaging` to the profile's `enabled_toolsets` in config.yaml. Direct access is cleaner than relaying through another agent — eliminates one hop.

**Delivery targets:**
- `discord` — Delivers to the home channel
- `discord:#channel-name` — Delivers to a specific channel
- `discord:chat_id:thread_id` — Delivers to a specific thread/topic

### Firecrawl (Self-Hosted)

A self-hosted Firecrawl instance runs on a different server for web scraping, crawling, and content extraction.

**Core features** (Scrape, Crawl, Map, Search) works without any LLM — they handle HTTP fetching, HTML parsing, and content extraction deterministically.

**Extract endpoint** (`/v1/extract`) requires an LLM for structured data extraction using JSON schema. It reads `OPENAI_API_KEY` and `OPENAI_BASE_URL` environment variables. We wired LM Studio as the LLM backend:
- Set `OPENAI_BASE_URL` to LM Studio's OpenAI-compatible endpoint (`http://host:port/v1`)
- Set `OPENAI_API_KEY` to any value (LM Studio ignores it)
- This enables structured extraction without a paid cloud API key

For the full Firecrawl breakdown (self-hosting, MCP server configuration, tool reference, and use cases), see [Unified / Firecrawl](/ai/unified/firecrawl/).

### Forgejo (Self-Hosted Git)

Internal Git server used for:

- **Hermes config backups** — Cron job pushes configs, profiles, skills, and cron state to Forgejo weekly
- **AI wiki repository** — Knowledge base repo in the Agents organization
- **Self-hosted alternative** to GitHub for internal/sensitive repos

### Email (Himalaya)

Terminal-based IMAP/SMTP email via the `himalaya` CLI. We built a skill covering:

- Outlook.com/Hotmail.com authentication (3 methods: OAuth2, App Password, Basic Auth)
- Server settings and token refresh patterns
- Step-by-step setup guide in `references/outlook-config.md`

### Hermes API Server

Hermes exposes an OpenAI-compatible API server on port 8642 (configurable). This allows:

- Other agents (like Claude Code) to use Hermes as an LLM backend
- Programmatic access to Hermes capabilities
- API key authentication via `API_SERVER_KEY` in `.env`

### NGINX Proxy (Playground)

The Playground profile manages a Hermes created site served via NGINX on an LXC container. The `nginx-site-admin` skill is the governing umbrella for all site operations, cron jobs, and backup workflows.
