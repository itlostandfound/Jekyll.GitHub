---
layout: single
title: Auto-Mode & Hybrid Auto-Mode
permalink: /ai/claude/auto-mode/
---

## Auto-Mode & Hybrid Auto-Mode

Claude Code's permission system sits on a spectrum: manual approval at one end, full bypass at the other. **Auto-Mode** is Anthropic's built-in middle path. **Hybrid Auto-Mode** is what I call the configuration that layers explicit allow and deny lists on top of Auto-Mode — fast iteration without giving up the seatbelt.

---

## What Auto-Mode Is

Auto-Mode is a **research-preview permission mode** for Claude Code, launched March 24, 2026. Instead of prompting you for every file write and bash command, a **safety classifier** reviews each action before it runs and decides whether to allow it, block it, or escalate it back to you.

Available on **Team, Enterprise, PRO (YES! I live here.), and API plans**. Activated with `claude --enable-auto-mode` then cycling via Shift+Tab, or toggled on in Settings → Claude Code on Desktop/VS Code.

### Why It Exists

Claude Code users approve **93% of permission prompts**. That is not diligence — it is approval fatigue. When you click "Allow" on the hundredth `git status`, you stop reading what you are approving. Auto-Mode automates the obvious decisions so your attention stays on the ones that matter.

### The Spectrum It Occupures

| Mode | What happens | Risk |
|------|-------------|------|
| **Default** | Prompts for everything not explicitly allowed | Safe but slow — hundreds of clicks per session |
| **Auto-Mode** | Classifier approves low-risk actions, blocks risky ones, prompts when uncertain | Research preview — heuristic, not contractual |
| **`--dangerously-skip-permissions`** | Runs everything without asking | Zero friction, zero protection — isolated environments only |

---

## How Auto-Mode Works — Two Layers

### Layer 1: Input Probe (Server-Side)

Before tool output enters the agent's context, a prompt-injection scanner checks it. If content looks like an injection attempt, the system injects a warning telling the agent to treat the content as suspect and anchor on user intent.

### Layer 2: Transcript Classifier (Sonnet 4.6)

Every action the agent wants to take is evaluated by a two-stage classifier before execution:

1.  **Stage 1 — Fast filter:** Single-token decision (block/allow). Tuned to **err toward blocking**. Most routine actions clear this stage immediately.
2.  **Stage 2 — Chain-of-thought reasoning:** Only runs if Stage 1 flags the action. Evaluates real-world blast radius, not surface text.

**Critical design choice:** The classifier sees only user messages and tool calls. Assistant reasoning text and tool results are stripped — it is reasoning-blind by design, so it cannot be talked into approving something dangerous.

---

## Permission Decision Tiers

When Auto-Mode is active, actions fall into three tiers:

### Tier 1 — Built-in Safe-Tool Allowlist + User Settings

Non-state-modifying tools (file reads, text search, code navigation) are pre-approved. On entering Auto-Mode, **permission rules granting arbitrary code execution are dropped**, including blanket shell access and wildcarded script interpreters. Narrow rules (e.g., "allow running code formatters") carry over.

### Tier 2 — In-Project File Operations

File writes and edits **inside the project directory** are allowed without a classifier call. Reviewable via version control later.

### Tier 3 — Transcript Classifier

Everything else: shell commands, web fetches, filesystem operations outside the project directory, subagent spawns. The classifier decides allow, block, or escalate.

---

## What the Classifier Catches

Anthropic documents four threat categories the classifier is designed to address:

| # | Threat | Example |
|---|--------|---------|
| 1 | **Overeager behavior** | "Clean up old branches" → agent deletes remote branches irreversibly |
| 2 | **Honest mistakes** | Agent thinks a resource is test-scoped when it is shared production |
| 3 | **Prompt injection** | Instructions in a file or webpage hijack the agent |
| 4 | **Misaligned model** | Agent pursues its own goal (not currently observed) |

### Blocked Action Examples (from Anthropic)

-   **Scope escalation:** Deleting remote git branches from a vague instruction
-   **Credential exploration:** Grepping env vars and config files for alternative tokens after an auth error
-   **Agent-inferred parameters:** Picking the closest job by name similarity — could be someone else's
-   **Sharing via external service:** Creating a GitHub Gist with potentially confidential data
-   **Safety-check bypass:** Retrying a deploy with `--skip-verification` after a pre-check failure

---

## Caveats

-   The classifier **may still allow risky actions** if user intent is ambiguous or environment context is missing
-   It **may occasionally block benign actions** (false positives)
-   There is a **small impact on token consumption, cost, and latency** per tool call
-   Anthropic continues to recommend Auto-Mode **in isolated environments** — it reduces risk compared to bypass but does not eliminate it

---

## Hybrid Auto-Mode — My Configuration

Anthropic's Auto-Mode uses heuristics. Heuristics are not contractual — they can be reclassified in a future release. **Hybrid Auto-Mode** pairs Auto-Mode's classifier with **explicit allow and deny lists** that are contractual. The result: routine work flows like bypass mode, anything unusual still prompts, and catastrophic operations are hard-denied regardless of what the classifier thinks.

### The Formula

```
Hybrid Auto-Mode = defaultMode "auto" + curated ALLOW list + hard DENY list
```

Split across two files:

-   **User-level** (`~/.claude/settings.json`) — applies everywhere on this machine
-   **Project-level** (`<project>/.claude/settings.local.json`) — applies only inside that project

### User-Level Baseline (`~/.claude/settings.json`)

This file holds things you trust in every project: read paths, basic bash commands, and domain-pinned web fetches.

```json
{
  "permissions": {
    "allow": [
      "Read(/Volumes/SSDStorage/**)",
      "Read(/tmp/**)",

      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git push:*)",
      "Bash(python3:*)",
      "Bash(grep:*)",
      "Bash(sort:*)",

      "WebFetch(domain:techdocs.f5.com)",
      "WebFetch(domain:my.f5.com)",
      "WebFetch(domain:support.f5.com)",
      "WebFetch(domain:docs.splunk.com)",
      "WebFetch(domain:github.com)"
    ]
  },
  "effortLevel": "medium"
}
```

### Project-Level Overlay (`<project>/.claude/settings.local.json`)

This file holds project-specific allows and — critically — the **deny list** and the **defaultMode**.

```json
{
  "permissions": {
    "defaultMode": "auto",

    "allow": [
      "Bash(python3 -m venv:*)",
      "Bash(.venv/bin/pip install:*)",
      "Bash(.venv/bin/python:*)"
    ],

    "deny": [
      "Bash(rm -rf /)",
      "Bash(rm -rf /*)",
      "Bash(rm -rf ~)",
      "Bash(rm -rf $HOME)",
      "Bash(sudo:*)",
      "Bash(curl * | sh)",
      "Bash(curl * | bash)",
      "Bash(diskutil:*)",
      "Bash(dd:*)",
      "Bash(chown:*)"
    ]
  }
}
```

---

## Why Each Layer Exists

### Why `auto` Instead of `bypassPermissions`

`bypassPermissions` runs everything, including things you forgot to deny. `auto` runs what is not denied **and** what the classifier considers low-risk — anything risky still prompts. With a deny list on top of `auto`, you get speed without surrendering the seatbelt. With `bypassPermissions`, there is no seatbelt.

### Why Domain-Pinned WebFetch

If WebFetch is allowed globally, a poisoned search result could direct the agent at an attacker-controlled URL and it would pull it down without asking. Pinning the domain list to vendor doc sites means any off-list fetch still prompts.

### Why `rm -rf /` and `sudo` Are in the Deny List Even Though Auto Would Block Them

Belt and suspenders. Auto-Mode's risk heuristics are heuristics, not guarantees. An explicit deny is contractual. If a future release reclassifies something, the deny still holds.

### Why Read Paths Are Narrow, Not Broad

`Read(/Users/michael/**)` would sweep up `~/.ssh`, `~/.aws/credentials`, and every other sensitive file. Only specific subdirectories are allowlisted. The worst case of an auto-read is "the model saw a file" — and that is still a problem when the file contains credentials.

### Why Venv Entries Are Project-Scoped

The project rule is: Python work goes in a venv, never base OS pip. The allow entries make that the path of least resistance. Different projects have different rules — that is why those entries are not in the user-level file.

---

## Pattern Syntax Reference

| Pattern | Meaning |
|---------|---------|
| `Bash(git add:*)` | Prefix match — `git add` with any arguments |
| `Bash(git status:*)` | Prefix match — `git status` with any arguments |
| `Bash(log show *)` | Wildcard in the middle — literal string match |
| `Read(/path/**)` | Recursive glob — matches all files under that path |
| `WebFetch(domain:example.com)` | Domain pin — matches if the URL host equals the domain |
| `Skill(report:*)` | Allows invoking a specific Skill without prompt |

---

## How to Set This Up

1.  **Create user-level settings:**

    ```bash
    mkdir -p ~/.claude
    touch ~/.claude/settings.json
    ```

2.  **Add your baseline allow list** — read paths, git commands, domain-pinned fetches. Start minimal.

3.  **Decide global vs. project-by-project:**

    -   **Global:** Add `"defaultMode": "auto"` inside `permissions` in the user settings file.
    -   **Project-by-project (recommended):** Leave user-level alone. Inside each project:

        ```bash
        mkdir -p <project>/.claude
        ```

        Then create `<project>/.claude/settings.local.json` with `"defaultMode": "auto"`, project-specific allows, and the deny list.

4.  **Grow the allow list organically, not speculatively.** When you click "Allow" for the third time on the same kind of command, add the pattern. When you click "Deny" for something you never want, add it to deny. Do not pre-populate every possible command — you will get it wrong.

5.  **Verify:** Inside Claude Code, run `/config` to confirm settings are loaded. Or point it at a path that should auto-read and confirm there is no permission prompt.

---

## Troubleshooting

| Symptom | Likely Cause |
|---------|-------------|
| Claude still asks for everything | `defaultMode` not set, or set in the wrong file. Confirm it is inside the `permissions` object, not at root. |
| A specific command keeps prompting | Allow pattern does not match the exact command shape. Look at the prompt text — the command is shown verbatim. Use that as the pattern. |
| Claude refuses something it should allow | Check the deny list. Deny always wins. |
| Settings not loading | JSON syntax error. Validate with `python3 -m json.tool < settings.json` |
| Want to temporarily disable | Rename: `mv settings.local.json _disabled`, or remove `defaultMode` and restart. |

---

## One-Line Summary

**Hybrid Auto-Mode = defaultMode "auto" + curated allow + hard deny**, split across a user-level baseline (works everywhere) and a project-level overlay (works only here). It trades a small amount of safety theater for a large amount of clicks-per-hour. Grow the allow list from real usage, keep the deny list short and absolute, and never blanket-allow your home directory.

---

### Sources

-   Anthropic Engineering Blog: [How we built Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) (Mar 25, 2026)
-   Claude Blog: [Auto mode for Claude Code](https://claude.com/blog/auto-mode) (Mar 24, 2026)
-   Claude Code Docs: [Permission Modes](https://code.claude.com/docs/en/permission-modes#eliminate-prompts-with-auto-mode)