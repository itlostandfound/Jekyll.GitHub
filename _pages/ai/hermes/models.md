---
layout: single
title: Model Configuration
permalink: /ai/hermes/models/
---

## Model Configuration

Hermes needs a model with at least 64K context length. We've run through several iterations of local and cloud providers to find what works reliably.

### Primary and Fallback System

Hermes supports a primary model and an ordered fallback chain. When the primary fails with HTTP 429 (rate limit), 529 (overloaded), 503 (unavailable), or connection errors, the fallback activates automatically per-turn.

**Configuration in `~/.hermes/config.yaml`:**

```yaml
model:
  default: glm-5.1
  provider: ollama-cloud

fallback_model:
  - model: minimax-m2.7
    provider: ollama-cloud
```

**Key behaviors:**
- Fallback is turn-scoped, not session-scoped — it tries primary again next turn
- Ordered chain: if the first fallback also fails, it tries the next
- Init-time fallback: if the primary provider's API key is missing at startup, fallback activates immediately
- De-duplication: if primary and fallback resolve to the same endpoint, it's skipped

### Custom Providers

For local LLMs (Ollama, LM Studio, llama.cpp) or third-party APIs, use `custom_providers` in config.yaml:

```yaml
custom_providers:
  - name: Local_Llama
    base_url: http://localhost:8081/v1
    api_key: "lm-studio"    # Required for discovery, even if server ignores it
    model: qwen3-8b
```

**Critical pitfall:** The `api_key` field is required for the dashboard's `fetch_api_models()` discovery code to run. Without it, models won't show up even though the endpoint is reachable. Use `key_env: OLLAMA_API_KEY` for Ollama Cloud — a bare string like `api_key: ollama` causes HTTP 401 on cloud endpoints.

### Our Model History

| Period | Primary | Provider | Notes |
|---|---|---|---|
| May 2026 | Qwen3-8B | Local llama.cpp :8081 | Self-hosted on Mac Mini M4 |
| May 2026 | qwen3-8b | LM Studio :1234 | Migrated from llama.cpp for GUI convenience |
| Jun 2026 | GLM-5.1 | Ollama Cloud | Cloud provider, reliable and fast |
| Jun 2026 | MiniMax-M2.7 | Ollama Cloud | Fallback when GLM-5.1 is rate-limited |

### Adding Cloud Models

To add OpenRouter, Anthropic, Google, or xAI models:

1. Get an API key from the provider
2. Add it to `~/.hermes/.env` (e.g., `OPENROUTER_API_KEY=sk-...`)
3. Restart the Hermes dashboard/gateway (config is cached at startup)
4. Use `hermes model` to switch, or edit `config.yaml` directly

Available cloud-only models include DeepSeek V3.2, Gemini 3 Flash, MiniMax M2.1, Qwen 3 Next, and others.

### Dashboard Model Discovery

The Hermes dashboard groups custom providers by `(base_url, api_key)`. If multiple entries share the same base_url and have empty/missing api_key fields, they merge into one row and only the first entry's model is displayed. Always set a unique `api_key` (even a dummy string for local servers) to prevent this merging.

### Token Cost Awareness

Across ~2,400 sessions since May 2026, we've consumed 271M input tokens and 2.1M output tokens. 78 "heavy" sessions (30+ messages) account for 71.6% of all input tokens. Cloud spend awareness matters — monitor usage and consider local models for bulk work.
