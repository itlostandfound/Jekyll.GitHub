---
layout: single
title: GitHub Fork
permalink: /github/fork/
---

Stick a fork in it, my first GitHub Fork.

This is the full story of how I went from running someone else's Docker images to maintaining my own. What started as a "quick test" of the Graphiti knowledge graph turned into a two day after-hours deep dive through six confirmed upstream bugs, two custom Docker builds, and my first real GitHub fork.

## Why Fork?

Graphiti is an open-source temporal knowledge graph framework from Zep. It looked perfect for what I needed: entity extraction, relationship mapping, and episode-based provenance for my home lab AI agents. The GitHub version was v0.29.2, but the Docker Hub image was v0.22.0, last updated over 9 months ago. Over 2,900 forks on GitHub, and mine became one of them.

The problem was simple: the published Docker images did not work as documented. Environment variables were ignored, endpoints were hardcoded to OpenAI, and several components had no config-driven workaround. I tried the "responsible" approach first: bind-mounting corrected Python files over the stock images at container start. Four bugs in, I stopped patching at runtime and forked instead.

A fork is nothing magical (still feels like Wizardy your first time though). It is a full copy of a repository's commit history, pushed to a new repository you own. GitHub's "Fork" button automates this and adds a "forked from" link, but the identical result is achievable by hand (which is exactly what I insisted on doing since I'd never done it before):

```bash
git clone https://github.com/getzep/graphiti.git
cd graphiti
git remote add myfork <url of your new empty repo>
git push myfork --all
git push myfork --tags
```

The key insight: there is exactly one local folder connected to two remotes. `origin` points at the upstream (read-only in practice), `myfork` points at your copy. Editing files in that one folder never touches the upstream repo. Only `git push myfork <branch>` affects the fork.

## The Six Bugs We Fixed

Every bug below was confirmed, diagnosed, and fixed at the source. No workarounds, no bind-mounts, no runtime patches.

| # | Component | Symptom | Fix |
|---|---|---|---|
| 1 | graphiti-mcp | Reranker hardcoded to OpenAI, no override point | Local BGERerankerClient/lexical fallback |
| 2 | graphiti-mcp | 421 Invalid Host header behind any reverse proxy | DNS rebinding protection disabled |
| 3 | graphiti-mcp | LLM requests silently went to real OpenAI regardless of api_url; wrong API shape (/v1/responses) | base_url passthrough + OpenAIGenericClient |
| 4 | graphiti-api | Embedder model name hardcoded to text-embedding-3-small, never configurable | embedding_model_name actually applied |
| 5 | graphiti-mcp (Dockerfile) | Default GRAPHITI_CORE_VERSION=0.28.1 violates the package's own declared minimum >=0.28.2; missing code-fence-stripping fix | Build with GRAPHITI_CORE_VERSION=0.29.2 |
| 6 | graphiti-mcp | OpenAIGenericClient defaults to json_schema mode (not enforced by Ollama Cloud) and silently overrides config.max_tokens | structured_output_mode='json_object' + explicit max_tokens passthrough |

Bug 2 was reported upstream as [getzep/graphiti#1205](https://github.com/getzep/graphiti/issues/1205). The rest are still open.

## The Fork: Two Branches, Two Images

Graphiti is a monorepo with two independently versioned components: the MCP server (`mcp_server/`) and the REST API (`server/`). Different git tags apply to each, so two branches were needed.

### Branch mcp-fixed (based on tag mcp-v1.0.2)

```bash
git checkout mcp-v1.0.2 -b mcp-fixed
```

Files changed: `mcp_server/src/graphiti_mcp_server.py`, `mcp_server/src/services/factories.py`.

Bug 1 (the reranker) was the most insidious. `graphiti_mcp_server.py` constructs `Graphiti(...)` twice and never passes `cross_encoder=` either time, so `graphiti_core` silently defaults to `OpenAIRerankerClient()` with a hardcoded model `gpt-4.1-nano` and a `logit_bias` keyed to specific OpenAI-tokenizer token IDs. No Ollama Cloud or LM Studio substitute could ever work here, even in principle. It would silently score relevance wrong, not just fail to connect. The fix passes an explicit `cross_encoder=` using graphiti_core's own `BGERerankerClient` (BAAI/bge-reranker-v2-m3 via sentence-transformers), falling back to a dependency-free lexical-overlap reranker if that import fails.

Bug 2 (DNS rebinding) meant every request through Traefik got a `421 Invalid Host header`. FastMCP is constructed at module level with no `host=` argument, defaulting to `127.0.0.1`, which auto-enables DNS rebinding protection with a Host-header allowlist locked to `localhost`/`127.0.0.1`/`::1`. Config's `server.host: "0.0.0.0"` is applied after construction and does not retroactively fix the allowlist. The fix explicitly passes `transport_security=TransportSecuritySettings(enable_dns_rebinding_protection=False)`.

Bug 3 (the LLM client) had two separate defects in one `if/else` block. The `'openai'` case in `factories.py` never read `config.providers.openai.api_url` at all. Every LLM request silently hit `api.openai.com` regardless of `OLLAMA_BASE_URL`, failing with `401 Incorrect API key provided`, which gives zero hint that the request went to the wrong host entirely. Even with `base_url` fixed, it always instantiated `OpenAIClient`, which calls `/v1/responses` (OpenAI's Responses API), which only OpenAI itself implements. The fix passes `base_url` through and picks `OpenAIGenericClient` (which targets `/v1/chat/completions`) when `api_url` points at anything other than `api.openai.com`.

Bug 5 and Bug 6 were discovered during post-deployment debugging rounds (see below).

### Branch api-fixed (based on tag v0.22.0)

```bash
git checkout v0.22.0 -b api-fixed
```

Files changed: `server/graph_service/config.py`, `server/graph_service/zep_graphiti.py`.

Bug 4 was straightforward: `config.py` defines an `embedding_model_name` field, but `zep_graphiti.py`'s `get_graphiti()` applies the LLM's `model_name` to the LLM client and never applies `embedding_model_name` to the embedder. Left on `graphiti_core`'s bare `OpenAIEmbedder()` default with hardcoded model `text-embedding-3-small`. The fix adds `embedder_api_url` and `embedder_api_key` fields to `config.py` and applies all three (model name, URL, key) to `client.embedder.config` in `get_graphiti()`.

## Building and Publishing

### Local Docker environment

The Mac I code on has no Docker Desktop (I should probably install it). But does have colima (lightweight Docker Desktop alternative via Homebrew):

```bash
colima status   # -> "colima is not running"
colima start    # brought up a VM with driver "vz", ~15s to ready
docker info     # confirmed daemon reachable
```

BuildKit was needed for the MCP Dockerfile's `RUN --mount=type=cache` directive, but `docker buildx` returned "unknown command":

```bash
brew install docker-buildx
# Then added the plugin directory to ~/.docker/config.json
```

### Local builds: 

Rebuilt with explicit platform pinning:

```bash
# MCP server (with the correct graphiti-core version)
git checkout mcp-fixed
docker buildx build --network=host --platform linux/amd64 --load \
  --build-arg GRAPHITI_CORE_VERSION=0.29.2 \
  -f mcp_server/docker/Dockerfile.standalone -t itlostandfound/graphiti-mcp:1.0.2-fixed mcp_server/

# REST API
git checkout api-fixed
docker buildx build --network=host --platform linux/amd64 --load \
  -f Dockerfile -t itlostandfound/graphiti-api:0.22.0-fixed .
```

The `--network=host` flag on the API build was necessary because QEMU-emulated amd64 containers under colima/lima could not resolve DNS for `files.pythonhosted.org` during `pip install`. Host networking bypasses BuildKit's internal DNS namespace.

Verified architecture before handing off:

```bash
docker inspect itlostandfound/graphiti-mcp:1.0.2-fixed --format '{{.Architecture}}/{{.Os}}'
docker inspect itlostandfound/graphiti-api:0.22.0-fixed --format '{{.Architecture}}/{{.Os}}'
# -> amd64/linux (both)
```

## Post-Deployment Debugging

### Round 1: JSON parsing failure

Once deployed, a new error appeared. The LLM request reached the right endpoint and got `200 OK`, but the response body could not be parsed as JSON at all:

```
Expecting value: line 1 column 1 (char 0)
```

This is Python's `json.loads` error for either a completely empty string or a string wrapped in a ```json markdown fence. Traced the git history and found that upstream commit `c537ed49` (2026-06-06, PR #1537) added a `_strip_code_fences()` method and `EmptyResponseError` to `OpenAIGenericClient`. Neither existed in the `graphiti-core` version baked into the image.

Worse: `mcp_server/pyproject.toml` declares `graphiti-core>=0.28.2` as a minimum, but the Dockerfile's default `GRAPHITI_CORE_VERSION=0.28.1` is below that minimum. The Dockerfile's `sed`-based version substitution blindly rewrites the `>=` constraint to `==${GRAPHITI_CORE_VERSION}` with no check that the target satisfies the original minimum. A real, confirmed bug independent of the code-fence issue.

Fix: rebuild with the correct version pinned explicitly:

```bash
docker buildx build --network=host --platform linux/amd64 --load \
  --build-arg GRAPHITI_CORE_VERSION=0.29.2 \
  -f mcp_server/docker/Dockerfile.standalone -t itlostandfound/graphiti-mcp:1.0.2-fixed mcp_server/
```

### Round 2: structured output shape

JSON parsing succeeded, but a new error appeared:

```
ExtractedEntities() argument after ** must be a mapping, not list
```

The model was returning a bare JSON array where `graphiti_core` expected a JSON object. Root cause: `OpenAIGenericClient` defaults `structured_output_mode` to `'json_schema'`, which relies on the provider actually constraining output server-side. Ollama Cloud (at least for `glm-5.1`) accepts the `response_format` parameter but does not enforce it.

Adjacent bug found: `OpenAIGenericClient.__init__` has its own `max_tokens` parameter (default `16384`) that unconditionally overrides `config.max_tokens` rather than inheriting it. The config.yaml bump from Round 1 only "worked" because it was coincidentally set to the same value.

Fix (both in the same edit to `factories.py`):

```python
return OpenAIGenericClient(
    config=llm_config,
    max_tokens=llm_config.max_tokens,
    structured_output_mode='json_object',
)
```

`json_object` mode embeds the schema into the prompt text instead of relying on API-side enforcement.

### The embedder connectivity saga

The final problem was not a Graphiti bug at all. Embedding requests to LM Studio timed out with a 134-second hang before failing. Not "connection refused" (near-instant) and not slow-but-successful. That specific signature (long silent hang, then give up) meant something was dropping the connection attempt rather than actively rejecting it.

Root cause: LM Studio's server was bound to localhost-only. Enabling "Serve on Local Network" resolved it completely. Not a Graphiti bug. The first case in the entire effort where the root cause was outside `getzep/graphiti`.

## Quick Reference

| What | Value |
|---|---|
| Upstream repo | `https://github.com/getzep/graphiti` |
| Our fork | `https://github.com/itlostandfound/graphiti-fixed` |
| Branch: MCP server fixes | `mcp-fixed`, based on tag `mcp-v1.0.2` |
| Branch: REST API fix | `api-fixed`, based on tag `v0.22.0` |
| Fixed tags on our fork | `mcp-v1.0.2-fixed`, `v0.22.0-fixed` |
| Docker Hub: MCP server image | `itlostandfound/graphiti-mcp:1.0.2-fixed` |
| Docker Hub: REST API image | `itlostandfound/graphiti-api:0.22.0-fixed` |
| Local Docker build environment | `colima` (Homebrew), Docker Engine 29.6.1 client |

## Reproducing This From Scratch

```bash
# 1. Fork
git clone https://github.com/getzep/graphiti.git
cd graphiti
git remote add myfork https://github.com/itlostandfound/graphiti-fixed.git
git push myfork --all && git push myfork --tags

# 2. MCP server fixes
git checkout mcp-v1.0.2 -b mcp-fixed
# ... apply the fixes to graphiti_mcp_server.py and services/factories.py ...
git add -A && git commit -m "..." && git tag mcp-v1.0.2-fixed
git push myfork mcp-fixed mcp-v1.0.2-fixed

# 3. Server/ fix
git checkout v0.22.0 -b api-fixed
# ... apply the embedder fix to config.py and zep_graphiti.py ...
git add -A && git commit -m "..." && git tag v0.22.0-fixed
git push myfork api-fixed v0.22.0-fixed

# 4. Build (requires colima or another local Docker daemon + docker-buildx)
git checkout mcp-fixed
docker buildx build --network=host --platform linux/amd64 --load \
  --build-arg GRAPHITI_CORE_VERSION=0.29.2 \
  -f mcp_server/docker/Dockerfile.standalone -t itlostandfound/graphiti-mcp:1.0.2-fixed mcp_server/

git checkout api-fixed
docker buildx build --network=host --platform linux/amd64 --load \
  -f Dockerfile -t itlostandfound/graphiti-api:0.22.0-fixed .

# 5. Push
docker login
docker push itlostandfound/graphiti-mcp:1.0.2-fixed
docker push itlostandfound/graphiti-api:0.22.0-fixed

# 6. Deploy
docker compose pull
docker compose up -d --force-recreate
```

## Why This Matters

I am not a "Professional" Developer by trade. I am an infrastructure engineer who needed a tool to work. When the tool did not work as documented, I did not write a blog post complaining about it. I fixed it as a learning exercise and got valuable experience out of it on both GitHub and DockerHub.

The upstream project is free, maintained by volunteers, and genuinely impressive when it works. Mad respect to everyone contributing to it. But "open source" does not mean "works out of the box." Sometimes you have to get your hands dirty. This was me getting my hands dirty.

Six bugs. Two branches. Two Docker images. One fork. First one. I would love go get involved and contribute to other Open Source Projects, I just don't think this is "the one" due to the state that it is in or I would have tried that first.