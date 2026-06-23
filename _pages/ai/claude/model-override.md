---
layout: single
title: Model Override
permalink: /ai/claude/model-override/
---

## Model Override

Claude Code hardcodes Anthropic's models as Opus, Sonnet, and Haiku. The **env override** replaces every one of those model slots with whatever you want: a different Anthropic model, a third-party provider, or a local LLM. You pick the backend, you pick the model, and Claude Code talks to it using the same Anthropic message format.

The config lives in `.claude/settings.local.json` (project-scoped) or `~/.claude/settings.json` (global). The relevant keys all sit under the `"env"` block.

---

## Z.ai Example

Drop this into `.claude/settings.local.json` and swap in your own Z.ai key:

NOTE:  This is a full example with specific permissions applied.  Don't be alarmed if yours is different.

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "***",
    "ANTHROPIC_API_KEY": "",
    "API_TIMEOUT_MS": "3000000",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5.2",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5.2",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-5.2",
    "ANTHROPIC_SMALL_FAST_MODEL": "glm-5.2",
    "CLAUDE_CODE_SUBAGENT_MODEL": "glm-5.2"
  },
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(ls:*)",
      "Read(*)"
    ]
  }
}
```

---

## Ollama Cloud Example

Same structure, different provider. Swap in your own Ollama API key:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ollama.com/v1",
    "ANTHROPIC_AUTH_TOKEN": "***",
    "ANTHROPIC_API_KEY": "",
    "API_TIMEOUT_MS": "3000000",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5.1:cloud",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5.1:cloud",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "minimax-m2.7:cloud",
    "ANTHROPIC_SMALL_FAST_MODEL": "minimax-m2.7:cloud",
    "CLAUDE_CODE_SUBAGENT_MODEL": "glm-5.1:cloud"
  }
}
```

---

## Local Ollama (Self-Hosted)

Running Ollama on your own hardware instead of Ollama Cloud changes three things: the base URL, the auth token, and the model names.  Some experimentation may be required.

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:11434",
    "ANTHROPIC_AUTH_TOKEN": "ollama",
    "ANTHROPIC_API_KEY": "",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "qwen3-coder",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "qwen3-coder",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.7-flash",
    "ANTHROPIC_SMALL_FAST_MODEL": "glm-4.7-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "qwen3-coder"
  }
}
```

---

## Where to Put This: Project-Level vs. Global

The config above goes in **`.claude/settings.local.json`** — that's the **project-level** override. It only applies when you're inside that specific project directory.

| Scope | File Location | Affects | Shared? | Use For |
|-------|--------------|---------|---------|---------|
| **Managed** | System dirs (e.g. `/Library/Application Support/ClaudeCode/`) | All users on machine | Yes (IT-deployed) | Security policies, compliance |
| **User (Global)** | `~/.claude/settings.json` | You, across ALL projects | No | Personal defaults, API keys |
| **Project** | `.claude/settings.json` | All collaborators | Yes | Team-shared settings, MCP servers |
| **Local** | `.claude/settings.local.json` | You | No | Personal project overrides |

**Precedence (highest to lowest):** Managed > Command line > Local > Project > User

### Project-Level (what the examples above use)

File: `.claude/settings.local.json` (in your project root)

This is the right choice when you want different providers per project. Your React project might use Ollama, while your Python project uses Z.ai. The `.local.json` file is gitignored by default so your API key stays local.

### Global-Level (affects everything)

File: `~/.claude/settings.json`

This applies to **every** Claude Code session on your machine, regardless of which directory you're in. Same JSON structure, same env keys, but now it's universal.

**Key difference:** If you set this globally, every `claude` command everywhere uses Ollama. If a project has its own `.claude/settings.local.json`, that project's settings **win** over the global file because Local has higher precedence than User.

---

## Provider Comparison

| Setting | Z.ai | Ollama Cloud | Ollama Local |
|---------|------|--------------|--------------|
| `ANTHROPIC_BASE_URL` | `https://api.z.ai/api/anthropic` | `https://ollama.com/v1` | `http://localhost:11434` |
| `ANTHROPIC_AUTH_TOKEN` | your-z-ai-key | your-ollama-key | `ollama` |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | `glm-5.2` | `glm-5.1:cloud` | `qwen3-coder` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | `glm-5.2` | `glm-5.1:cloud` | `qwen3-coder` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | `glm-5.2` | `minimax-m2.7:cloud` | `glm-4.7-flash` |
| `ANTHROPIC_SMALL_FAST_MODEL` | `glm-5.2` | `minimax-m2.7:cloud` | `glm-4.7-flash` |
| `CLAUDE_CODE_SUBAGENT_MODEL` | `glm-5.2` | `glm-5.1:cloud` | `qwen3-coder` |
| Scope | project | project or global | project or global |

---

## Key Differences: Cloud vs. Local

- **Base URL**: `http://localhost:11434` (local) vs `https://ollama.com/v1` (cloud)
- **Auth token**: `ollama` (local, Ollama ignores it) vs your real API key (cloud)
- **Model names**: No `:cloud` suffix (local models are pulled to your machine) vs `:cloud` suffix (routed through Ollama's cloud)
- **Model choices**: Local models like `qwen3-coder` need enough VRAM to run. Cloud models like `glm-5.1:cloud` run on Ollama's infrastructure.