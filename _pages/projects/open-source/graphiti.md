---
layout: single
title: Graphiti
permalink: /projects/open-source/graphiti/
---

<div class="resume-hero">
  <p class="resume-tagline">Temporal Knowledge Graphs &nbsp;·&nbsp; MCP Protocol &nbsp;·&nbsp; Provenance-First</p>
  <p class="resume-summary">Zep's open-source framework for building temporal context graphs — knowledge graphs where facts have validity windows, entities evolve over time, and everything traces back to provenance. Deployed as an MCP server on home lab infrastructure, integrated with both Hermes and Claude Code agents as the primary long-term memory for F5 BIG-IP administration.</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">What Graphiti Does Differently (If you can get it to work)</h2>
  <p>Static wikis and RAG pipelines give you point-in-time snapshots. When information changes, you either overwrite the old fact (losing history) or you have conflicting facts with no way to know which one is current. Graphiti solves this with <strong>bi-temporal fact management</strong>: every fact has a validity window, and when information changes, old facts are <em>invalidated</em> (not deleted), so you can query what's true now or what was true at any point in the past.</p>
  <p>Every entity and relationship traces back to its source <strong>episode</strong> — the raw data that produced it. This is provenance you can audit, not just citations you hope are accurate. And retrieval is hybrid: semantic embeddings + keyword (BM25) + graph traversal, typically sub-second latency.</p>
  <br />
  <p>The state of this project as of this writing (07/17/2026) is not good.  The GitHub Version is v0.29.2, the DockerHub Version is v0.22.0 (last updated 9 months ago) and there are over 2,900 Forks (and mine is one of them).  It took quite some time of modifying code and bind mounting them into the Docker Compose to override all kinds of this just to get it to work (and I mean work I mean making the application honor the seeings in the .env file).</p>
  <br />
  <p>Once you DO get it working, its well worth the effort.  If they don't start maintaining it better then I'll turn my Fork into my own project and support it myself...and I'm not saying this to slight anyone.  Whoever is involved is supporting this for FREE and in their own time.  So MAD Respect and hats off to you!  Thank you!</p>
</div>

<div class="resume-section">
  <h2 class="section-heading">Architecture</h2>
  <div class="skill-grid">

    <div class="skill-card">
      <h3>Graph Engine</h3>
      <ul>
        <li>FalkorDB (Redis-based) — default, lightweight, bundled in Docker</li>
        <li>Neo4j — supported for production deployments</li>
        <li>Entities, relationships, and episodes with temporal validity</li>
        <li>Bi-temporal fact management — invalidate, don't overwrite</li>
        <li>Provenance: every fact traces to its source episode</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>Retrieval</h3>
      <ul>
        <li><strong>Hybrid search</strong> — semantic embeddings + BM25 keyword + graph traversal</li>
        <li><strong>search_memory_facts</strong> — find facts and relationships</li>
        <li><strong>search_nodes</strong> — find entity summaries and information</li>
        <li><strong>get_episodes</strong> — pull recent raw episodes for provenance</li>
        <li>Typical query latency: sub-second</li>
      </ul>
    </div>

    <div class="skill-card">
      <h3>LLM Providers</h3>
      <ul>
        <li>OpenAI (Currently HARD CODED)</li>
        <li>Ollama.com (Because I Fixed It)</li>
        <li>Local Models (Because I Fixed It)</li>
        <li>Anthropic, Google Gemini, Groq (I highly doubt it)</li>
        <li>OpenRouter / DeepSeek / Together (I highly doubt it)</li>
        <li>Embeddings: OpenAI, sentence-transformers (local), Voyage, Gemini</li>
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
        <td class="job-company">add_episode</td>
        <td class="job-role-sm">Store episodes (text, messages, or JSON) in the knowledge graph. Automatic entity/relationship extraction.</td>
      </tr>
      <tr>
        <td class="job-company">search_memory_facts</td>
        <td class="job-role-sm">Find relevant facts and relationships using hybrid search (semantic + keyword + graph traversal).</td>
      </tr>
      <tr>
        <td class="job-company">search_nodes</td>
        <td class="job-role-sm">Search for entity summaries and information. Use before asking the user to repeat context.</td>
      </tr>
      <tr>
        <td class="job-company">get_episodes</td>
        <td class="job-role-sm">Retrieve recent raw episodes for provenance context.</td>
      </tr>
      <tr>
        <td class="job-company">add_triplet</td>
        <td class="job-role-sm">Add a specific source → relationship → target fact. Skips extraction when you know the exact structure.</td>
      </tr>
      <tr>
        <td class="job-company">delete_episode</td>
        <td class="job-role-sm">Remove an episode and cascade-delete facts it solely produced.</td>
      </tr>
      <tr>
        <td class="job-company">get_entity_edge</td>
        <td class="job-role-sm">Fetch a specific fact by UUID for detailed inspection.</td>
      </tr>
      <tr>
        <td class="job-company">get_episode_entities</td>
        <td class="job-role-sm">Trace which entities and facts came from a specific episode.</td>
      </tr>
      <tr>
        <td class="job-company">summarize_saga</td>
        <td class="job-role-sm">Refresh the running summary for a tracked multi-episode thread.</td>
      </tr>
      <tr>
        <td class="job-company">build_communities</td>
        <td class="job-role-sm">Detect entity clusters across the graph. Occasional maintenance operation.</td>
      </tr>
      <tr>
        <td class="job-company">clear_graph</td>
        <td class="job-role-sm">Wipe all data for a group. Destructive — only on explicit user request.</td>
      </tr>
      <tr>
        <td class="job-company">get_status</td>
        <td class="job-role-sm">Check the server/database connection health.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Home Lab Deployment</h2>
  <p>Graphiti is deployed on home lab infrastructure behind Traefik with TLS termination, co-located with the BIG-IP Administrator LLM Wiki MCP server (but Graphiti is replacing the LLM Wiki and it will be retired).</p>

  <table class="job-table">
    <tbody>
      <tr>
        <td class="job-company">Endpoint</td>
        <td class="job-role-sm"><code>https://traefik.fronted.internal.dns.url/mcp/</code> — Streamable HTTP with no auth (internal network)</td>
      </tr>
      <tr>
        <td class="job-company">Database</td>
        <td class="job-role-sm">FalkorDB (Redis-based) — bundled with MCP server in Docker Compose</td>
      </tr>
      <tr>
        <td class="job-company">Group ID</td>
        <td class="job-role-sm"><code>f5-admin</code> — isolates F5 knowledge from other agents' graphs</td>
      </tr>
      <tr>
        <td class="job-company">LLM</td>
        <td class="job-role-sm">Ollama Cloud (GLM-5.x) for entity extraction; local sentence-transformers for embeddings</td>
      </tr>
      <tr>
        <td class="job-company">Reverse Proxy</td>
        <td class="job-role-sm">Traefik with TLS termination — same pattern as all MCP servers on the infrastructure</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Graphiti vs. LLM Wiki: Complementary, Not Competing</h2>
  <p>Both the LLM Wiki (via <a href="{{ '/projects/ai/generic-llm-wiki-mcp/' | relative_url }}">Generic LLM Wiki MCP</a>) and Graphiti serve knowledge to agents, but they solve different problems:</p>

  <table class="job-table">
    <thead>
      <tr>
        <th>Aspect</th>
        <th>LLM Wiki (MCP)</th>
        <th>Graphiti</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="job-company">Data model</td>
        <td class="job-role-sm">Curated Markdown pages with frontmatter</td>
        <td class="job-role-sm">Temporal knowledge graph with entities, edges, and episodes</td>
      </tr>
      <tr>
        <td class="job-company">Knowledge type</td>
        <td class="job-role-sm">Authoritative reference — configuration syntax, best practices, troubleshooting guides</td>
        <td class="job-role-sm">Environment-specific facts — device inventories, VIP configs, past decisions, troubleshooting history</td>
      </tr>
      <tr>
        <td class="job-company">Temporal awareness</td>
        <td class="job-role-sm">None — pages are point-in-time snapshots</td>
        <td class="job-role-sm">Bi-temporal — facts have validity windows, old facts are invalidated not deleted</td>
      </tr>
      <tr>
        <td class="job-company">Provenance</td>
        <td class="job-role-sm">File-based — <code>sources:</code> frontmatter links to raw documents</td>
        <td class="job-role-sm">Episode-based — every entity and fact traces to the raw data that produced it</td>
      </tr>
      <tr>
        <td class="job-company">Contradiction handling</td>
        <td class="job-role-sm">Manual — agent flags contradictions for human review</td>
        <td class="job-role-sm">Automatic — old facts invalidated, history preserved</td>
      </tr>
      <tr>
        <td class="job-company">Retrieval</td>
        <td class="job-role-sm">Full-text search across titles, tags, and bodies</td>
        <td class="job-role-sm">Hybrid — semantic + BM25 keyword + graph traversal</td>
      </tr>
      <tr>
        <td class="job-company">Curation model</td>
        <td class="job-role-sm">Human curates sources, agent writes and maintains pages</td>
        <td class="job-role-sm">Agent ingests episodes, extracts entities and relationships automatically</td>
      </tr>
      <tr>
        <td class="job-company">Best for</td>
        <td class="job-role-sm">"What is the correct TMSH syntax for creating a pool?"</td>
        <td class="job-role-sm">"What VIPs did we configure on bigip-01 last month and why?"</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Lessons Learned</h2>
  <ul class="job-details">
    <li><strong>Small models struggle with structured extraction.</strong> Graphiti depends on structured JSON output for entity/edge extraction and deduplication. Models under ~7B parameters frequently emit non-conforming JSON, causing ingestion failures. Use the largest model you can run, and switch <code>structured_output_mode</code> from <code>json_schema</code> to <code>json_object</code> if you see extraction failures.</li>
    <li><strong>Ollama requires OpenAIGenericClient, not OpenAIClient.</strong> Ollama doesn't support the <code>/v1/responses</code> endpoint. Using the wrong client causes cryptic errors. Always use <code>OpenAIGenericClient</code> for Ollama and other OpenAI-compatible providers.</li>
    <li><strong>FalkorDB has no password by default.</strong> The combined Docker container ships with no authentication on the Redis port. Set a password for any deployment beyond local testing.</li>
    <li><strong>Trailing slash on the MCP URL matters.</strong> The Graphiti MCP URL must include the trailing slash (<code>/mcp/</code>, not <code>/mcp</code>). Some servers redirect; others 404 without it.</li>
    <li><strong>The MCP server is labeled "experimental."</strong> The API may change between releases. Pin your Docker image version if stability matters.</li>
    <li><strong>Episode processing is async.</strong> The MCP server processes episodes with configurable concurrency (<code>SEMAPHORE_LIMIT</code>, default 10). Tune based on your LLM provider's rate limits.</li>
    <li><strong>Graphiti and the LLM Wiki are complementary, not redundant.</strong> Trying to use one for the other's job leads to frustration. Use the wiki for curated reference material; use the graph for evolving environment-specific facts.</li>
  </ul>
</div>

<div class="resume-section">
  <h2 class="section-heading">Details</h2>
  <table class="job-table">
    <tbody>
      <tr>
        <td class="job-company">Status</td>
        <td class="job-role-sm">Deployed · Active — serving as primary long-term memory for F5 Administrator agents</td>
      </tr>
      <tr>
        <td class="job-company">GitHub Project</td>
        <td class="job-role-sm"><a href="https://github.com/getzep/graphiti">getzep/graphiti</a> — Apache-2.0, 28k+ GitHub stars</td>
      </tr>
       <tr>
        <td class="job-company">DockerHub Project</td>
        <td class="job-role-sm"><a href="https://hub.docker.com/r/zepai/graphiti">getzep/graphiti</a> — Last updated 9+ Months ago</td>
      </tr>
      <tr>
        <td class="job-company">Language</td>
        <td class="job-role-sm">Python (core library) · TypeScript (MCP server)</td>
      </tr>
      <tr>
        <td class="job-company">Database</td>
        <td class="job-role-sm">FalkorDB (Redis-based, default) · Neo4j (production alternative)</td>
      </tr>
      <tr>
        <td class="job-company">Protocol</td>
        <td class="job-role-sm">MCP (Model Context Protocol) · Streamable HTTP · Stateless</td>
      </tr>
      <tr>
        <td class="job-company">Deployment</td>
        <td class="job-role-sm">Docker Compose on home lab infrastructure · Traefik reverse proxy with TLS</td>
      </tr>
      <tr>
        <td class="job-company">LLM Provider</td>
        <td class="job-role-sm">Ollama Cloud (GLM-5.x) for extraction · sentence-transformers (local) for embeddings</td>
      </tr>
      <tr>
        <td class="job-company">Integrations</td>
        <td class="job-role-sm"><a href="{{ '/projects/ai/generic-llm-wiki-mcp/' | relative_url }}">Generic LLM Wiki (MCP)</a> (complementary knowledge) · <a href="{{ '/projects/ai/tmsh-wiki-brain/' | relative_url }}">TMSH LLM Wiki Brain</a> (syntax cross-reference)</td>
      </tr>
      <tr>
        <td class="job-company">Hermes Skill</td>
        <td class="job-role-sm"><code>f5-graphiti</code> — search-first protocol, entity types, tool reference, pitfalls</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="resume-section">
  <h2 class="section-heading">Example compose.yml, .env, and README.md for a Working Instance</h2>
  <p>Below is a known-working Docker Compose and environment configuration for running the full Graphiti stack (MCP server + REST API, each with its own graph database). The compose file combines both halves of the upstream project into one stack. The env file documents every variable with inline comments explaining what each one does and why certain values are set the way they are.</p>
  <p>This is a LOT, but since I have a Fork of the Project I think this is the best place for me to put this information for others to reference.</p>

  <h3>compose.yml</h3>
</div>

{% highlight yaml %}---
# Full Graphiti stack: both upstream consumer interfaces (MCP server + REST
# API), each with its own graph database, mirroring what you get by running
# getzep/graphiti's two docker-compose.yml files (root + mcp_server/docker/)
# together. See README.md for why these are two separate graphs rather than
# one shared one.
services:
  # ---- Graph DB #1: FalkorDB, backs graphiti-mcp ----
  falkordb:
    image: falkordb/falkordb:v4.20.1
    container_name: graphiti-falkordb
    environment:
      - BROWSER=${BROWSER:-1} # FalkorDB web UI on :3000
      # REDIS_ARGS (not FALKORDB_PASSWORD -- that var isn't read by this
      # image at all) is how the falkordb/falkordb image actually enables
      # Redis auth: https://docs.falkordb.com/operations/docker.html
      - REDIS_ARGS=--requirepass ${FALKORDB_PASSWORD}
    env_file: .env
    volumes:
      - ./falkordb_data:/data
    ports:
      - "6379:6379" # Redis / FalkorDB
      - "3000:3000" # FalkorDB Web UI
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${FALKORDB_PASSWORD}", "-p", "6379", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped
    networks:
      - graphiti

  # ---- MCP server (first-party, for MCP clients: Hermes, Cursor, Claude, etc.) ----
  graphiti-mcp:
    # Our own build from github.com/itlostandfound/graphiti-fixed (branch
    # mcp-fixed, tag mcp-v1.0.2-fixed) -- the getzep/graphiti mcp-v1.0.2
    # source with the reranker, DNS rebinding, and LLM base_url fixes baked
    # in directly, instead of bind-mounting patches over the stock image.
    # See README.md's "Our own fixed images" section.
    image: itlostandfound/graphiti-mcp:1.0.2-fixed
    container_name: graphiti-mcp
    env_file: .env
    depends_on:
      falkordb:
        condition: service_healthy
    volumes:
      - ./config/config.yaml:/app/mcp/config/config.yaml:ro
      - ./mcp_logs:/var/log/graphiti
      - ./hf_cache:/root/.cache/huggingface # persist the ~2GB reranker model download across restarts
    ports:
      - "8000:8000" # http://localhost:8000/mcp/  (health: /health)
    restart: unless-stopped
    networks:
      - graphiti

  # ---- Graph DB #2: Neo4j, backs graphiti-api ----
  neo4j:
    image: neo4j:5.26.2
    container_name: graphiti-neo4j
    environment:
      - NEO4J_AUTH=${NEO4J_USER:-neo4j}/${NEO4J_PASSWORD:-password}
    volumes:
      - ./neo4j_data:/data
      - ./neo4j_logs:/logs
    ports:
      - "7474:7474" # Neo4j Browser (HTTP)
      - "7687:7687" # Bolt
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:7474 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s
    restart: unless-stopped
    networks:
      - graphiti

  # ---- REST/FastAPI server (general-purpose API: /messages, /search, /docs, ...) ----
  graphiti-api:
    # Our own build from github.com/itlostandfound/graphiti-fixed (branch
    # api-fixed, tag v0.22.0-fixed) -- the getzep/graphiti v0.22.0 source
    # with the embedder-model-name fix baked in directly. See README.md's
    # "Our own fixed images" section.
    image: itlostandfound/graphiti-api:0.22.0-fixed
    container_name: graphiti-api
    env_file: .env
    environment:
      - NEO4J_URI=bolt://neo4j:7687
      - NEO4J_USER=${NEO4J_USER:-neo4j}
      - NEO4J_PASSWORD=${NEO4J_PASSWORD:-password}
      - db_backend=neo4j
      - PORT=8000
      # graph_service/config.py hardcodes these exact var names -- can't
      # rename OLLAMA_API_KEY/OLLAMA_BASE_URL for it, so map them here instead.
      - OPENAI_API_KEY=${OLLAMA_API_KEY}
      - OPENAI_BASE_URL=${OLLAMA_BASE_URL:-https://ollama.com/v1}
    depends_on:
      neo4j:
        condition: service_healthy
    ports:
      - "8001:8000" # http://localhost:8001/docs (Swagger), /redoc, /healthcheck
    healthcheck:
      test:
        [
          "CMD",
          "python",
          "-c",
          "import urllib.request; urllib.request.urlopen('http://localhost:8000/healthcheck')",
        ]
      interval: 10s
      timeout: 5s
      retries: 3
    restart: unless-stopped
    networks:
      - graphiti

  # ---- Optional: build graphiti-api with FalkorDB support instead of Neo4j ----
  # The published zepai/graphiti:latest image is built WITHOUT the falkordb
  # extra (see getzep/graphiti's root Dockerfile: INSTALL_FALKORDB defaults to
  # false), so it can't talk to FalkorDB out of the box -- that's why
  # graphiti-api uses Neo4j above. If you'd rather have graphiti-api and
  # graphiti-mcp share the SAME FalkorDB graph, build locally instead:
  # comment out the "graphiti-api" and "neo4j" services above, then uncomment
  # this block (requires internet access + BuildKit git-context support on
  # the Docker host).
  #
  # graphiti-api-falkordb:
  #   container_name: graphiti-api
  #   build:
  #     context: https://github.com/getzep/graphiti.git#v0.29.2
  #     args:
  #       INSTALL_FALKORDB: "true"
  #   env_file: .env
  #   environment:
  #     - FALKORDB_HOST=falkordb
  #     - FALKORDB_PORT=6379
  #     - FALKORDB_DATABASE=${FALKORDB_DATABASE:-default_db}
  #     - db_backend=falkordb
  #     - PORT=8000
  #     - OPENAI_API_KEY=${OLLAMA_API_KEY}
  #     - OPENAI_BASE_URL=${OLLAMA_BASE_URL:-https://ollama.com/v1}
  #   depends_on:
  #     falkordb:
  #       condition: service_healthy
  #   ports:
  #     - "8001:8000"
  #   restart: unless-stopped
  #   networks:
  #     - graphiti

networks:
  graphiti:
    driver: bridge{% endhighlight %}

<div class="resume-section">
  <h3>env.example</h3>
</div>

{% highlight bash %}# ============================================================
# graphiti — Environment Configuration Reference
# ============================================================
# Copy this file to .env and fill in the values for your environment.
# This stack combines BOTH halves of the upstream project:
#   - mcp_server/  -> graphiti-mcp  (zepai/knowledge-graph-mcp:standalone) + FalkorDB
#   - server/      -> graphiti-api  (zepai/graphiti:latest, the REST/FastAPI service) + Neo4j
# They are two independent graph databases (see README.md for why) -- each
# app's env vars are prefixed/named per its own upstream schema, so some
# values (Ollama endpoint, model name) are intentionally duplicated under
# different var names.
# ============================================================

# ---- LLM (chat/extraction) -- Ollama Cloud ----
# ollamarelay (local container) has been decommissioned; LLM calls now go to
# Ollama Cloud's OpenAI-compatible endpoint. Get a key from https://ollama.com
#
# Left genuinely blank on purpose -- unlike the passwords below, this is a
# real account credential tied to your Ollama Cloud billing. There's no
# value that could be generated here that would actually authenticate;
# filling it with anything else would just fail differently. This is the
# one thing in this file that has to come from you.
MODEL_NAME=glm-5.1:cloud
OLLAMA_API_KEY=
OLLAMA_BASE_URL=https://ollama.com/v1

# Consumed directly by graphiti-api (server/graph_service/config.py reads the
# literal names OPENAI_API_KEY / OPENAI_BASE_URL -- can't be renamed upstream)
# so they're just mapped from the Ollama Cloud values above in compose.yml /
# compose.traefik.yml's "environment:" block for that service. Nothing to
# fill in here for graphiti-api specifically.

# ---- Reranker (graphiti-mcp) -- fully local, no API key ----
# graphiti_mcp_server.py upstream never passes a cross_encoder= to Graphiti(),
# so it silently falls back to graphiti_core's bare OpenAIRerankerClient()
# default, which requires a real OpenAI key and hardcodes model "gpt-4.1-nano"
# plus a logit_bias keyed to OpenAI-tokenizer-specific token IDs (meaningless
# against any other model, so no Ollama Cloud/LM Studio substitute works
# either). Fixed at the source in our own image (itlostandfound/graphiti-mcp)
# instead of paying for that or bind-mounting a patch -- passes graphiti_core's
# local BGERerankerClient (BAAI/bge-reranker-v2-m3 via sentence-transformers)
# instead, falling back to a dependency-free lexical reranker if that's ever
# unavailable. Fully local, free, no key needed here at all -- the model
# downloads once (~2GB) from HuggingFace Hub on first startup and is cached
# in the ./hf_cache volume after that. See README.md's "Our own fixed images".

# ---- Embedder -- LOCAL (LM Studio), NOT Ollama Cloud ----
# Ollama Cloud's catalog is large chat/completion models; embeddings are kept
# local (do NOT reuse a general chat model like qwen3-8b here -- see
# README.md's "Embedder: local, not cloud" section for why).
#
# graphiti-api's embedder model name used to be hardcoded upstream to
# "text-embedding-3-small" with no override -- fixed at the source in our own
# image (itlostandfound/graphiti-api) now, so EMBEDDER_MODEL below is a REAL
# model name, not an alias. No more loading anything under a fake identifier
# to satisfy a hardcoded string -- both graphiti-mcp and graphiti-api read
# this the same way graphiti-mcp always could.
#
# Because it's a real name now, normal LM Studio JIT load/unload is safe to
# use again: leave it unloaded, let the first request load it, let it idle
# out after the TTL, no need to keep it pinned in memory or use the CLI
# --identifier workaround from before. (That workaround was specifically
# needed because custom/aliased identifiers have documented JIT bugs in LM
# Studio's tracker -- a real catalog model name doesn't hit that path.)
# `lms ls` will show you the exact key if this doesn't match your setup.
#
# localhost is correct FROM the LM Studio host itself, but graphiti-mcp and
# graphiti-api reach this from inside their own containers -- localhost
# there means the container, not your LM Studio machine. Swap this to
# host.docker.internal:1234 (Docker Desktop, same machine as the Docker host)
# or your LM Studio machine's LAN IP (separate machine, e.g. deploy server is
# a VM and LM Studio runs on your workstation) before deploying; left as
# localhost here deliberately so it's obvious this needs to be corrected
# per-environment rather than silently wrong.
#
# Getting the IP right isn't enough on its own: LM Studio's server defaults
# to binding localhost-only. A correct LAN IP will just hang/time out (not
# fail fast) until you also enable "Serve on Local Network" (or equivalent
# bind-to-all-interfaces setting) in LM Studio's Developer/server settings --
# cost about an hour to track down once, don't repeat that.
EMBEDDER_API_URL=http://localhost:1234/v1

# LM Studio doesn't check this, but the OpenAI client library used
# upstream still requires a non-empty string to be present -- any value works.
EMBEDDER_API_KEY=lm-studio-no-key-required
EMBEDDER_MODEL=text-embedding-nomic-embed-text-v1.5@q8_0

# nomic-embed-text-v1.5's native output is 768-dim.
EMBEDDER_DIMENSIONS=768

# ---- FalkorDB (graph DB for graphiti-mcp) ----
# Auth is ON by default here (not upstream's default -- FalkorDB ships with
# no password unless told otherwise). This one value does double duty: the
# falkordb service's REDIS_ARGS=--requirepass ${FALKORDB_PASSWORD} (see
# compose.yml/compose.traefik.yml) makes the server actually enforce it, and
# graphiti-mcp reads this same var as the client-side password. Both sides
# read the exact same var, so they can never drift out of sync with each
# other. Randomly generated -- change it, don't remove it (an empty value
# here is NOT the same as no auth; see below).
FALKORDB_PASSWORD=NEEDS.PASSWORD
FALKORDB_DATABASE=default_db

# Enable/disable the FalkorDB web UI on port 3000 (1 = enabled, 0 = disabled)
BROWSER=1

# ---- Neo4j (graph DB for graphiti-api) ----
# Randomly generated, replacing upstream's own throwaway "password" default.
NEO4J_USER=neo4j
NEO4J_PASSWORD=NEEDS.PASSWORD

# ---- Graphiti application settings ----
GRAPHITI_GROUP_ID=main
# Episode processing concurrency. Local/Ollama models: keep this low (3-5).
SEMAPHORE_LIMIT=5
# Telemetry is opt-out (PostHog, system info only -- not your data)
GRAPHITI_TELEMETRY_ENABLED=false

# ---- Traefik routing (compose.traefik.yml only) ----
# Public hostnames (bare hostname, no scheme, no path)
MCP_DOMAIN=graphiti-mcp.whateveryouwant.com
API_DOMAIN=graphiti-api.whateveryouwant.com
FALKORDB_UI_DOMAIN=graphiti-falkordb.whateveryouwant.com
NEO4J_UI_DOMAIN=graphiti-neo4j.whateveryouwant.com{% endhighlight %}

<div class="resume-section">
  <h3 class="section-heading">README.md</h3>

  <div class="resume-section">
    <p>Full <a href="https://github.com/getzep/graphiti">Graphiti</a> stack — both halves of the upstream project, each running against its own graph database. <strong>Both application images are our own build</strong>, not upstream's — see "Our own fixed images" below for why and what's different.</p>

    <table class="job-table">
      <thead>
        <tr>
          <th>Component</th>
          <th>Upstream location</th>
          <th>Image</th>
          <th>Graph DB</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="job-company">MCP server (for MCP clients: Hermes, Cursor, Claude, ...)</td>
          <td class="job-role-sm"><code>mcp_server/docker/</code></td>
          <td class="job-role-sm"><code>itlostandfound/graphiti-mcp:1.0.2-fixed</code></td>
          <td class="job-role-sm">FalkorDB</td>
        </tr>
        <tr>
          <td class="job-company">REST/FastAPI server (<code>/messages</code>, <code>/search</code>, <code>/docs</code>, ...)</td>
          <td class="job-role-sm"><code>server/</code> (root <code>docker-compose.yml</code>)</td>
          <td class="job-role-sm"><code>itlostandfound/graphiti-api:0.22.0-fixed</code></td>
          <td class="job-role-sm">Neo4j</td>
        </tr>
      </tbody>
    </table>

    <p>All images are pinned to specific tags rather than <code>:latest</code>-style moving targets, so a <code>docker compose pull</code> won't silently change what's running: <code>falkordb/falkordb:v4.20.1</code>, <code>itlostandfound/graphiti-mcp:1.0.2-fixed</code>, <code>neo4j:5.26.2</code>, <code>itlostandfound/graphiti-api:0.22.0-fixed</code>. The version numbers in our tags match the exact upstream <code>getzep/graphiti</code> tags our fork's fixes are built on (<code>mcp-v1.0.2</code> and <code>v0.22.0</code> respectively) — chosen because those are what the last officially-published <code>zepai/*</code> images on Docker Hub actually were, confirmed by checking the registry directly rather than inferring from the publish workflow's logic (which turned out not to be reliable — see git history / commit messages on our fork for how that was discovered).</p>

    <p>See <code>Graphiti-Investigation-Report.md</code> for the original background research. Two things in that report don't match the current upstream source (verified against <code>getzep/graphiti</code> directly): <code>sentence_transformers</code> isn't an embedder option the MCP server's <code>EmbedderFactory</code> actually supports, and the config key is <code>providers.openai.api_url</code>, not <code>api_base</code>. Both are handled correctly in <code>config/config.yaml</code> here.</p>
  </div>

  <div class="resume-section">
    <h2 class="section-heading">Why two separate graph databases</h2>
    <p>The <code>v0.22.0</code> source our <code>graphiti-api</code> build is based on has no FalkorDB support at all — not just "extra not installed": at that version (Oct 2025), <code>server/graph_service/config.py</code> doesn't even have a <code>db_backend</code>/<code>falkordb_*</code> field yet, and <code>zep_graphiti.py</code> constructs <code>ZepGraphiti(uri=..., user=..., password=...)</code> directly with no branching. FalkorDB support for the REST API was added later in <code>getzep/graphiti</code>'s history (visible at git tag <code>v0.29.2</code>), but we built our fix on <code>v0.22.0</code> specifically because that's what the last officially-published <code>zepai/graphiti</code> Docker Hub tag actually was — keeping our fork's baseline aligned with a known, previously-working reference point rather than jumping to newer upstream code we haven't run. Nothing stops you from rebasing the <code>api-fixed</code> branch on <code>v0.29.2</code> later and adding real FalkorDB support to <code>graphiti-api</code> — it's your fork now — just hasn't been done here.</p>

    <p>If you want them sharing a single FalkorDB graph, <code>compose.yml</code> has a commented-out <code>graphiti-api-falkordb</code> service that builds the REST API from a git context with <code>INSTALL_FALKORDB=true</code> — currently still pointed at upstream <code>getzep/graphiti#v0.29.2</code>, you'd want to repoint it at your own fork if you go this route.</p>
  </div>

  <div class="resume-section">
    <h2 class="section-heading">Setup</h2>
    <ol class="job-details">
      <li>Copy <code>env.example.txt</code> to <code>.env</code>. LLM/extraction calls go to <strong>Ollama Cloud</strong> (<code>OLLAMA_BASE_URL=https://ollama.com/v1</code>, needs a real <code>OLLAMA_API_KEY</code> from <a href="https://ollama.com">ollama.com</a> — there's no local relay to fall back on anymore). Embeddings are kept <strong>local</strong> (LM Studio or similar) — fill in <code>EMBEDDER_API_URL</code> / <code>EMBEDDER_MODEL</code> once you've got a dedicated embedding model loaded and reachable from the Docker host. See "Embedder: local, not cloud" below for why and what to load.</li>
      <li>Deploy behind Traefik:<br />
        <code>docker network create graphitinet</code> <em># one-time, since compose.traefik.yml expects it external</em><br />
        <code>docker compose -f compose.traefik.yml up -d</code>
      </li>
      <li>Point your MCP clients at it — see "Connecting MCP clients" below.</li>
    </ol>
  </div>

  <div class="resume-section">
    <h2 class="section-heading">Local testing (no Traefik)</h2>
    <p><code>docker compose up -d</code></p>
  </div>

  <div class="resume-section">
    <h2 class="section-heading">Connecting MCP clients</h2>
    <p>Only <code>graphiti-mcp</code> is relevant here — <code>graphiti-api</code> is a plain REST API, not an MCP server. The MCP endpoint is <code>https://${MCP_DOMAIN}/mcp/</code> behind Traefik, or <code>http://localhost:8000/mcp/</code> for local testing via <code>compose.yml</code>. All three clients below support HTTP-transport MCP servers, just configured differently.</p>

    <p><strong>Hermes</strong> — add under <code>mcp_servers</code> in the profile's <code>config.yaml</code>:</p>
{% highlight yaml %}
mcp_servers:
  graphiti:
    url: "https://graphiti-mcp.whateveryouwant.com/mcp/"
{% endhighlight %}

    <p><strong>Claude Code</strong> — either <code>claude mcp add --transport http graphiti https://graphiti-mcp.whateveryouwant.com/mcp/</code>, or add directly to <code>.mcp.json</code> in a project:</p>
{% highlight json %}
{
  "mcpServers": {
    "graphiti": {
      "type": "http",
      "url": "https://graphiti-mcp.whateveryouwant.com/mcp/"
    }
  }
}
{% endhighlight %}

    <p><strong>Claude Desktop</strong> — check Settings for a "Custom Connector" / remote MCP server option first (recent versions support adding a URL directly, no bridge needed). If your version only supports local stdio servers, bridge through <a href="https://www.npmjs.com/package/mcp-remote"><code>mcp-remote</code></a> in <code>claude_desktop_config.json</code> instead:</p>
{% highlight json %}
{
  "mcpServers": {
    "graphiti": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://graphiti-mcp.whateveryouwant.com/mcp/"]
    }
  }
}
{% endhighlight %}

    <p>After connecting, verify with a round trip: call <code>add_memory</code> with some test text, then <code>search_memory_facts</code> or <code>search_nodes</code> and confirm it returns something — that exercises the full path (LLM extraction via Ollama Cloud → embedding via LM Studio → FalkorDB storage → retrieval) in one shot.</p>
  </div>

  <div class="resume-section">
    <h2 class="section-heading">Endpoints exposed</h2>
    <table class="job-table">
      <thead>
        <tr>
          <th>Endpoint</th>
          <th>Local (<code>compose.yml</code>)</th>
          <th>Traefik (<code>compose.traefik.yml</code>)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="job-company">MCP server (<code>/mcp/</code>, <code>/health</code>)</td>
          <td class="job-role-sm"><code>localhost:8000</code></td>
          <td class="job-role-sm"><code>https://${MCP_DOMAIN}/</code></td>
        </tr>
        <tr>
          <td class="job-company">REST API (<code>/docs</code>, <code>/redoc</code>, <code>/messages</code>, <code>/search</code>, <code>/entity-node</code>, <code>/entity-edge/{uuid}</code>, <code>/group/{group_id}</code>, <code>/episode/{uuid}</code>, <code>/clear</code>, <code>/episodes/{group_id}</code>, <code>/get-memory</code>, <code>/healthcheck</code>)</td>
          <td class="job-role-sm"><code>localhost:8001</code></td>
          <td class="job-role-sm"><code>https://${API_DOMAIN}/</code></td>
        </tr>
        <tr>
          <td class="job-company">FalkorDB Web UI</td>
          <td class="job-role-sm"><code>localhost:3000</code></td>
          <td class="job-role-sm"><code>https://${FALKORDB_UI_DOMAIN}/</code></td>
        </tr>
        <tr>
          <td class="job-company">Neo4j Browser</td>
          <td class="job-role-sm"><code>localhost:7474</code></td>
          <td class="job-role-sm"><code>https://${NEO4J_UI_DOMAIN}/</code></td>
        </tr>
        <tr>
          <td class="job-company">FalkorDB / Redis (raw wire protocol)</td>
          <td class="job-role-sm"><code>localhost:6379</code></td>
          <td class="job-role-sm"><code>localhost:6379</code> (direct-published)</td>
        </tr>
        <tr>
          <td class="job-company">Neo4j Bolt (raw wire protocol)</td>
          <td class="job-role-sm"><code>localhost:7687</code></td>
          <td class="job-role-sm"><code>localhost:7687</code> (direct-published)</td>
        </tr>
      </tbody>
    </table>
    <p>Redis and Bolt aren't HTTP, so Traefik can't <code>Host()</code>-route them the way it does the four web UIs above — they're published directly on both compose files. Each has a commented-out Traefik TCP router block showing how to front it properly if you add a dedicated static entryPoint to <code>../1.traefik/data/traefik.yml</code> (out of scope here since that's shared infra).</p>
  </div>

  <div class="resume-section">
    <h2 class="section-heading">Embedder: local, not cloud</h2>
    <p>The LLM (chat/extraction) and embedder are configured as two <em>separate</em> OpenAI-compatible endpoints on purpose — <code>llm</code> points at Ollama Cloud, <code>embedder</code> points at a local server. Ollama Cloud's catalog is large chat/completion models (gpt-oss:120b, qwen3:235b, etc.); it's not really the place to host a small dedicated embedding model, and there's no cost/latency reason to send embedding calls over the network anyway.</p>

    <p>Load a <strong>dedicated embedding model</strong> for <code>EMBEDDER_MODEL</code> — not a general chat model. A chat LLM (e.g. qwen3-8b) isn't trained for embeddings the way <code>nomic-embed-text-v1.5</code> / <code>bge-small-en-v1.5</code> / <code>gte-small</code> are (contrastive objective vs. next-token prediction) — even if a server like LM Studio can pool its hidden states into a vector on request, retrieval quality is typically <em>worse</em> than a purpose-built ~100-400M-param embedding model, despite being far heavier to run. Reserve a general chat model for the <code>llm</code> role if you ever want a local fallback to Ollama Cloud, not for <code>embedder</code>.</p>

    <p>This deployment uses <code>nomic-embed-text-v1.5</code> in LM Studio, under its <strong>real</strong> model identifier (<code>EMBEDDER_MODEL=text-embedding-nomic-embed-text-v1.5@q8_0</code> by default — run <code>lms ls</code> if yours differs). No fake alias needed — see "Our own fixed images" below for why that used to be necessary and isn't anymore. Because it's a real catalog name now, ordinary LM Studio JIT load/unload is safe: leave it unloaded, let the first request load it, let it idle out after the TTL. You don't need to keep it pinned in memory or use <code>lms load --identifier</code> — that workaround was specifically needed because LM Studio's JIT loader has documented bugs around custom/aliased identifiers; a real catalog name doesn't hit that code path.</p>
  </div>

  <div class="resume-section">
    <h2 class="section-heading">Our own fixed images</h2>
    <p>Four separate upstream bugs across three files in <code>getzep/graphiti</code> — none of them had any config-driven workaround, all of them were found by actually running this stack, not by reading the source in advance. Originally worked around by bind-mounting corrected copies of the affected files over the stock <code>zepai/*</code> images at container start; now fixed at the source instead, in a real fork: <strong><a href="https://github.com/itlostandfound/graphiti-fixed">github.com/itlostandfound/graphiti-fixed</a></strong>, two branches (<code>mcp-fixed</code> off tag <code>mcp-v1.0.2</code>, <code>api-fixed</code> off tag <code>v0.22.0</code> — matching the exact upstream versions the last officially-published Docker Hub images were built from), built into <code>itlostandfound/graphiti-mcp:1.0.2-fixed</code> and <code>itlostandfound/graphiti-api:0.22.0-fixed</code> and pushed to Docker Hub. Deploy server pulls pre-built images same as before — no code, no build step, no <code>patches/</code> directory on it. If <code>getzep/graphiti</code> ever fixes these upstream, our fork's commits show exactly what to diff against to confirm, and the compose files can just point back at <code>zepai/*</code>.</p>

    <p><strong>1. MCP reranker → local, no API key.</strong> <code>mcp_server/src/graphiti_mcp_server.py</code> constructs <code>Graphiti(...)</code> twice (FalkorDB branch, Neo4j branch) and never passes <code>cross_encoder=</code> either time, so <code>graphiti_core</code> silently defaults to <code>OpenAIRerankerClient()</code> — hardcoded model <code>gpt-4.1-nano</code>, plus a <code>logit_bias</code> keyed to specific OpenAI-tokenizer token IDs that are meaningless against any other model's vocabulary (so unlike the embedder issue below, no Ollama Cloud/LM Studio substitute could ever work here even in principle — it would silently score relevance wrong, not just fail to connect).</p>

    <p><strong>Fix</strong> (fork commit on <code>mcp-fixed</code>): passes a local <code>cross_encoder=</code> to both <code>Graphiti(...)</code> calls instead of letting it default to OpenAI's. It tries <code>graphiti_core</code>'s own <code>BGERerankerClient</code> (<code>BAAI/bge-reranker-v2-m3</code> via <code>sentence-transformers</code>) first, since that's a real cross-encoder model, not a heuristic — the <code>mcp_server</code> Dockerfile's <code>providers</code> extra <em>lists</em> <code>sentence-transformers</code> as a dependency, so this should be available. It wasn't, in the actual published <code>1.0.2-standalone</code> image (confirmed by the import failing at runtime — what a Dockerfile says it installs and what's actually in a published tag turned out not to be reliably the same thing twice in this project). So the fix falls back to a small dependency-free lexical-overlap reranker instead of crash-looping when that import fails — weaker than a real cross-encoder, but retrieval already went through semantic + BM25 + graph traversal before reranking runs, so this is a refinement pass, not the primary relevance signal. If <code>sentence-transformers</code> is ever actually present, <code>BGERerankerClient</code> is used automatically with no changes needed — the <code>./hf_cache</code> volume is still mounted for that case.</p>

    <p><strong>2. DNS rebinding → disabled for proxied deployments.</strong> Confirmed as an actual upstream bug: <a href="https://github.com/getzep/graphiti/issues/1205">getzep/graphiti#1205</a>. <code>FastMCP()</code> is constructed at module level with no <code>host=</code> argument, so it defaults to <code>"127.0.0.1"</code> — and the SDK auto-enables DNS rebinding protection (Host header allowlist locked to <code>127.0.0.1</code>/<code>localhost</code>/<code>::1</code>) whenever <code>host</code> is one of those at construction time. <code>config.yaml</code>'s <code>server.host: "0.0.0.0"</code> is only applied <em>after</em> construction (<code>mcp.settings.host = ...</code>, further down the file), which doesn't retroactively fix the allowlist. Result: every request that arrives with a real <code>Host</code> header — i.e. anything routed through Traefik — gets rejected with <code>421 Invalid Host header</code>, no matter what <code>config.yaml</code> says.</p>

    <p><strong>Fix</strong> (same fork commit as the reranker fix above, <code>mcp-fixed</code> branch): explicitly passes <code>transport_security=TransportSecuritySettings(enable_dns_rebinding_protection=False)</code> to the <code>FastMCP(...)</code> constructor. DNS rebinding protection defends a <em>localhost-bound</em> service against malicious-webpage-via-browser attacks — not the threat model for a server intentionally exposed through Traefik behind TLS, so disabling it outright is correct here rather than fighting the config-ordering bug.</p>

    <p><strong>3. LLM client → uses OLLAMA_BASE_URL, right API shape.</strong> <code>mcp_server/src/services/factories.py</code>'s <code>LLMClientFactory.create()</code> has two separate bugs in its <code>'openai'</code> case:</p>
    <ol>
      <li><strong><code>base_url</code> is never read at all.</strong> <code>EmbedderFactory.create()</code> a few dozen lines below correctly does <code>base_url=config.providers.openai.api_url</code> — the LLM path is just missing the equivalent line entirely. Every LLM request silently went to real <code>api.openai.com</code> regardless of what <code>OLLAMA_BASE_URL</code>/<code>config.yaml</code>'s <code>api_url</code> were set to, so it failed with <code>401 Incorrect API key provided</code> — an Ollama Cloud key obviously isn't a valid OpenAI one, but you wouldn't know that from the error alone without checking <em>which host</em> the request actually went to.</li>
      <li><strong>Always uses <code>OpenAIClient</code>, which only works against real OpenAI.</strong> That class calls <code>self.client.responses.parse(...)</code> — OpenAI's newer Responses API (<code>POST /v1/responses</code>), which only OpenAI itself implements. <code>OpenAIGenericClient</code> is the class actually meant for this ("targets any OpenAI-compatible <code>/chat/completions</code> endpoint" per its own docstring) — even with <code>base_url</code> fixed, <code>OpenAIClient</code> would still fail against Ollama Cloud once the request reached the right host, just with a different error.</li>
    </ol>
    <p><strong>Fix</strong> (fork commit on <code>mcp-fixed</code>, <code>mcp_server/src/services/factories.py</code>): passes <code>base_url</code> through, and picks <code>OpenAIClient</code> only when <code>api_url</code> is unset or actually points at <code>api.openai.com</code> (preserving the reasoning/verbosity parameter support that class has for the <code>gpt-5</code>/<code>o1</code>/<code>o3</code> family) — <code>OpenAIGenericClient</code> otherwise.</p>

    <p><strong>4. API embedder → wired up to real model name.</strong> <code>server/graph_service/config.py</code> defines an <code>embedding_model_name</code> field and <code>server/graph_service/zep_graphiti.py</code>'s <code>get_graphiti()</code> applies the equivalent <code>model_name</code> field to the LLM client — but never applies <code>embedding_model_name</code> to the embedder at all. It's left on <code>graphiti_core</code>'s bare <code>OpenAIEmbedder()</code> default: hardcoded model <code>"text-embedding-3-small"</code>, connection falling through to the openai-python SDK's own <code>OPENAI_API_KEY</code>/<code>OPENAI_BASE_URL</code> env var fallback (which is <em>why</em> it happened to share the LLM's Ollama Cloud connection by accident before this was fixed, rather than reaching LM Studio at all).</p>

    <p><strong>Fix</strong> (fork commit on <code>api-fixed</code>, built on tag <code>v0.22.0</code> specifically — this file's structure differs meaningfully from <code>main</code>/<code>v0.29.2</code>, no <code>_create_graphiti_client()</code> helper or FalkorDB branch exists yet at this version), two files:</p>
    <ul>
      <li><code>server/graph_service/config.py</code> — adds <code>embedder_api_url</code> / <code>embedder_api_key</code> fields (separate from the LLM's <code>openai_base_url</code>/<code>openai_api_key</code>), and gives <code>embedding_model_name</code> a <code>validation_alias='EMBEDDER_MODEL'</code> so it reads the same env var <code>graphiti-mcp</code> already uses, instead of needing a second differently-named var for the same value.</li>
      <li><code>server/graph_service/zep_graphiti.py</code> — applies those three fields to <code>client.embedder.config</code> in <code>get_graphiti()</code>, mirroring exactly what upstream already does for <code>client.llm_client.config</code> three lines above it.</li>
    </ul>
    <p>No new env vars needed beyond what was already in <code>.env</code> for <code>graphiti-mcp</code> — both services now read <code>EMBEDDER_API_URL</code>/<code>EMBEDDER_API_KEY</code>/<code>EMBEDDER_MODEL</code> the same way, via the same shared <code>.env</code>.</p>
  </div>

  <div class="resume-section">
    <h2 class="section-heading">Switching provider or backend</h2>
    <p><code>config/config.yaml</code> (mounted over the MCP server's default) keeps the full upstream provider matrix — switch <code>llm.provider</code> / <code>embedder.provider</code> and set the matching env vars in <code>.env</code> to move off Ollama Cloud / your local embedder. The REST API's provider is controlled entirely through <code>.env</code> (<code>OPENAI_API_KEY</code>/<code>OPENAI_BASE_URL</code>/<code>MODEL_NAME</code>, mapped from the <code>OLLAMA_*</code> vars in the compose files' <code>environment:</code> blocks) since it has no mounted config file.</p>
  </div>

  <div class="resume-section">
    <h2 class="section-heading">MCP server tools</h2>
    <p><code>add_memory</code>, <code>add_triplet</code>, <code>search_nodes</code>, <code>search_memory_facts</code>, <code>summarize_saga</code>, <code>build_communities</code>, <code>get_episode_entities</code>, <code>delete_entity_edge</code>, <code>delete_episode</code>, <code>get_entity_edge</code>, <code>get_episodes</code>, <code>clear_graph</code>, <code>get_status</code></p>
  </div>

  <div class="resume-section">
    <h2 class="section-heading">Warnings</h2>
    <ul class="job-details">
      <li><strong>Small/local LLMs frequently emit non-conforming JSON</strong> for entity/edge extraction — use the largest model your Ollama Cloud plan gives you access to.</li>
      <li><strong>The REST API's embedder model name is hardcoded upstream</strong> to <code>text-embedding-3-small</code> with no override — fixed at the source in our fork rather than worked around, so <code>EMBEDDER_MODEL</code> is a real model name for both services now. See "Our own fixed images" above.</li>
      <li><strong><code>FALKORDB_PASSWORD</code> and <code>NEO4J_PASSWORD</code> ship with real, randomly-generated values</strong> in <code>env.example.txt</code> (auth is ON by default here, unlike upstream's own no-password default) — rotate them if this ever moves beyond a closed LAN, but don't blank <code>FALKORDB_PASSWORD</code> out without understanding the two-sided wiring: <code>falkordb</code>'s <code>REDIS_ARGS=--requirepass ${FALKORDB_PASSWORD}</code> (in both compose files) is what makes the <em>server</em> enforce it, and <code>graphiti-mcp</code> reads the exact same var as the <em>client</em> password — same env var, both sides, by design, so they can't drift out of sync. A <strong>present-but-empty</strong> value (as opposed to the var being genuinely absent) is a real footgun either way: <code>graphiti_mcp_server.py</code> reads <code>FALKORDB_PASSWORD</code> via a raw <code>os.environ.get(...)</code> with no empty-string normalization (unlike <code>config.yaml</code>'s <code>${FALKORDB_PASSWORD:}</code> expansion, which does normalize), so an empty-but-present value makes the client send an empty-password <code>AUTH</code> — if the server isn't also configured to require one, that gets rejected outright and graphiti-mcp crash-loops with <code>AUTH &lt;password&gt; called without any password configured for the default user</code>.</li>
      <li><strong><code>GRAPHITI_TELEMETRY_ENABLED=false</code></strong> is set by default in <code>env.example.txt</code> (opt-out PostHog telemetry on the MCP server, no data collection beyond system info). The REST API image doesn't expose an equivalent toggle.</li>
      <li><strong><code>graphiti-mcp</code>'s search-result reranker is unconditionally OpenAI's upstream</strong>, with no config override point at all — fixed at the source in our fork to use <code>graphiti_core</code>'s local <code>BGERerankerClient</code>. See "Our own fixed images" above. First startup downloads the ~2GB reranker model from HuggingFace Hub — expect a delay before the server reports ready the first time.</li>
      <li><strong>Data does not migrate between FalkorDB and Neo4j</strong> — each is its own independent graph here, not a replica of the other.</li>
    </ul>
  </div>