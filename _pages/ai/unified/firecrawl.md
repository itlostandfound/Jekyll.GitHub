---
layout: single
title: Firecrawl
permalink: /ai/unified/firecrawl/
---

## Firecrawl

Firecrawl is a web context API that turns any website into clean, structured data for AI agents and applications. Given a URL, it handles JavaScript rendering, anti-bot handling, and content extraction, returning Markdown or JSON. Given a search query, it finds relevant pages and pulls their content. It is the tool you reach for when an LLM or agent needs real-time access to the web.

Firecrawl is a **paid SaaS product** at [firecrawl.dev](https://firecrawl.dev), but the core engine is also **free and open-source** under the AGPL-3.0 license, available for self-hosting.

**GitHub (open source):** [github.com/firecrawl/firecrawl](https://github.com/firecrawl/firecrawl)

### What Firecrawl Does

Firecrawl exposes a single API family that covers the entire web-to-LLM pipeline:

| Tool | What it does |
|------|--------------|
| **Scrape** | Fetch a single URL and return clean Markdown, HTML, or structured JSON. Handles JS rendering via an integrated Playwright service. |
| **Crawl** | Walk a site section (or entire site) and extract content from every page it discovers, following links up to a configurable depth. |
| **Map** | Discover and list all indexed URLs on a domain without downloading the content. Good for site structure reconnaissance. |
| **Search** | Search the web and optionally extract content from the results. Replaces a search engine plus a scraper in one call. |
| **Extract** | Pass a URL (or multiple URLs) and a JSON schema, and Firecrawl uses an LLM to extract structured data matching that schema. |
| **Interact** | Browser automation: click, type, navigate, and operate on live pages. Useful for login flows, dynamic content, and forms. |
| **Agent** | Autonomous deep research. Give it a query and it searches, scrapes, and synthesizes across multiple sources. |
| **Monitor** | Recurring page checks with diff detection and webhook notifications when content changes meaningfully. |

Core features (Scrape, Crawl, Map, Search) work without any LLM. They handle HTTP fetching, HTML parsing, and content extraction deterministically. The Extract and Agent endpoints require an LLM provider (OpenAI, Ollama, or any OpenAI-compatible API).

### Self-Hosting

The open-source edition lives at [github.com/firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) and ships with a Docker Compose stack. Self-hosting gives you full control over data, no per-request billing, and the ability to run everything behind your own firewall.

**Minimum setup:**

1. Clone the repo and copy `apps/api/.env.example` to `.env`
2. Set `USE_DB_AUTHENTICATION=false` for a no-auth local instance
3. `docker compose build && docker compose up`
4. The API becomes available at `http://localhost:3002`

**Key environment variables for self-hosted:**

- `PORT` and `HOST` (default `3002` / `0.0.0.0`)
- `USE_DB_AUTHENTICATION` (set `false` to skip auth for local use)
- `OPENAI_API_KEY` or `OPENAI_BASE_URL` (required for Extract/Agent endpoints; can point to any OpenAI-compatible LLM, including local ones like LM Studio or Ollama)
- `OLLAMA_BASE_URL` (experimental, for running Extract against a local Ollama model)
- `SEARXNG_ENDPOINT` (optional, for self-hosted Search instead of Google)
- `PLAYWRIGHT_MICROSERVICE_URL` (auto-configured by Docker Compose)

**Cloud vs Self-Hosted differences:**

| Capability | Cloud | Self-Hosted |
|-----------|-------|-------------|
| All API endpoints | Yes | Not always; `/agent` and `/browser` are not supported |
| Screenshots | Yes | Yes (with Playwright service) |
| Local LLMs (Ollama) | Not supported | Supported via `OLLAMA_BASE_URL` |
| Fire-engine (advanced anti-bot) | Yes | Not available |
| Data sovereignty | On Firecrawl's servers | Your infrastructure |

**Important:** The `/agent` and `/browser` endpoints are cloud-only and do not work in self-hosted instances. Self-hosted instances also lack Fire-engine, which handles IP blocks and advanced bot detection. If you need those capabilities, you need the cloud service.

### MCP Server

Firecrawl ships an official MCP (Model Context Protocol) server that exposes all of its tools to AI agents like Claude Desktop, Cursor, Hermes, and any other MCP-compatible client.

**GitHub:** [github.com/firecrawl/firecrawl-mcp-server](https://github.com/firecrawl/firecrawl-mcp-server)

**Installation (npx):**

```bash
env FIRECRAWL_API_KEY=fc-YOUR_KEY npx -y firecrawl-mcp
```

**Self-hosted configuration:**

The MCP server fully supports pointing at a self-hosted Firecrawl instance. Set the `FIRECRAWL_API_URL` environment variable to your instance's base URL:

```bash
# Point the MCP server at your self-hosted instance
env FIRECRAWL_API_URL=https://firecrawl.your-domain.com npx -y firecrawl-mcp
```

For Hermes, add this to your MCP config (`~/.hermes/config.yaml`):

```yaml
mcp_servers:
  firecrawl:
    command: npx
    args: ["-y", "firecrawl-mcp"]
    env:
      FIRECRAWL_API_URL: "http://localhost:3002"
      # FIRECRAWL_API_KEY: "your-key"  # only if USE_DB_AUTHENTICATION=true
```

If your self-hosted instance runs without authentication (`USE_DB_AUTHENTICATION=false`), you can omit `FIRECRAWL_API_KEY` entirely. The MCP server will send requests to your local instance without an API key header.

**Available MCP tools:** `firecrawl_scrape`, `firecrawl_crawl`, `firecrawl_map`, `firecrawl_search`, `firecrawl_extract`, `firecrawl_interact`, `firecrawl_agent`, `firecrawl_monitor_create`, and related monitor management tools.

**Hosted MCP option:** If you prefer not to run the MCP server locally, Firecrawl offers a keyless hosted endpoint at `https://mcp.firecrawl.dev/v2/mcp`. The free tier supports scrape, search, and interact without an API key (rate-limited). Other tools (crawl, map, agent, extract) require a key.

### Use Cases

- **Agent web access:** Give an LLM real-time web data without stale training knowledge
- **Documentation ingestion:** Crawl docs sites and feed clean Markdown into RAG pipelines
- **Monitoring:** Set up recurring page watches with change detection and webhook alerts
- **Structured extraction:** Pull specific fields from any page using JSON schemas (prices, contact info, product specs)
- **Browser automation:** Interact with JavaScript-heavy pages that static scrapers can't handle