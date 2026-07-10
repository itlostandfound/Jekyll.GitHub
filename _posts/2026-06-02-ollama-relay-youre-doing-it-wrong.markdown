---
layout: post
title: "Ollama Relay — You're Doing It WRONG!"
date: 2026-06-02 12:00:00 -0500
categories: [hermes, ai, self-hosted, ollama, infrastructure]
image: /assets/images/posts/ollama-relay-youre-doing-it-wrong.jpg
excerpt: "It started with 429s. Then it didn't stop. Here's what was really going on with Ollama Relay and how to fix it."
---

It started with 429s. Then it didn't stop.

## The Problem

Every single Hermes agent profile — research, playground, development, f5-ltm, f5-gtm, f5-asm, f5-admin, and even the PMO's fallback — was routing through a local Ollama relay at `http://localhost:11434/v1`. That relay forwarded requests to `https://ollama.com/v1`, Ollama's cloud inference service.

On paper, this looked fine. Local relay, cloud inference, what could go wrong?

Everything.

The relay was an intermediary that added latency, obscured errors, and — most critically — **masked the real authentication headers**. When Ollama Cloud throttled or rejected a request, the relay couldn't tell the difference between a legitimate rate limit (429) and a session that had expired. The agent saw `429 Too Many Requests` and tried to fall back. But the fallback was... the same relay. Same endpoint. Same broken path. Round and round it went, hammering a service that was already rejecting it, unable to recover because every recovery attempt went through the same broken pipe.

The frustration was real. The agent would hit a 429, fall back to itself, hit another 429, and the user would watch the terminal fill with error after error after error. No escape. No alternative path. Just an infinite loop of "try again" against a wall that wasn't letting anything through.

And the worst part? The default profile had a **circular fallback** — `glm-5.1:cloud` on Ollama Cloud, falling back to `glm-5.1:cloud` on the exact same Ollama Cloud endpoint. When the primary failed, the "fallback" was literally the same service that just told you to go away.

## The Diagnosis

The configuration audit revealed the full scope of the damage:

| Profile | Primary | Endpoint | Fallback | Fallback Endpoint |
|---------|---------|----------|----------|-------------------|
| **default** | glm-5.1:cloud | localhost:11434 (relay) | glm-5.1:cloud | localhost:11434 (relay) — **circular!** |
| **research** | minimax-m2.7:cloud | localhost:11434 (relay) | qwen3-8b | localhost:1234 (LM Studio) |
| **pmo** | qwen3-8b | localhost:1234 (LM Studio) | glm-5.1:cloud | localhost:11434 (relay) |
| **playground** | kimi-k2.6:cloud | localhost:11434 (relay) | **none** | — |
| **development** | kimi-k2.6:cloud | localhost:11434 (relay) | **none** | — |
| **f5-ltm** | kimi-k2.6:cloud | localhost:11434 (relay) | **none** | — |
| **f5-gtm** | kimi-k2.6:cloud | localhost:11434 (relay) | **none** | — |
| **f5-asm** | kimi-k2.6:cloud | localhost:11434 (relay) | **none** | — |
| **f5-admin** | kimi-k2.6:cloud | localhost:11434 (relay) | **none** | — |

Five profiles had **no fallback at all**. The default profile had a fallback that was literally itself. The PMO profile was the only one with a remotely sane configuration — its primary was local (LM Studio), so it could at least function when cloud was down.

The `custom_providers` entry in the main config compounded the confusion. It defined an "Ollama Cloud" provider pointing at `http://localhost:11434/v1` — the local relay, not the actual cloud service. The name said "Cloud" but the URL said "Local." The default profile's `model.base_url` overrode it to `https://ollama.com/v1`, so it *looked* like it was connecting directly... but all the profile configs used `provider: custom` with inline `base_url: http://localhost:11434/v1`, routing everything through the relay.

A misnamed provider. An invisible intermediary. A circular fallback. A recipe for an outage that would refuse to heal itself.

## The Fix

Two sessions on June 2, 2026. First session: add real fallbacks so that when cloud goes down, agents can at least function locally. Second session: rip out the relay entirely and connect every agent directly to `https://ollama.com/v1` with a valid API key.

### Session 1: Fallback Infrastructure (12:16 PM)

The immediate priority was survival — if cloud was down, agents needed a local lifeline. LM Studio on port 1234 was running qwen3-8b and available.

1. **Added LM Studio as a custom provider** in the main config alongside the existing Ollama entry
2. **Fixed the circular fallback** — replaced `fallback_providers: [custom localhost:11434 / glm-5.1:cloud]` with `fallback_model: [custom:lm-studio / qwen3-8b]`
3. **Added fallback to all 6 profiles** that had none: playground, development, f5-ltm, f5-gtm, f5-asm, f5-admin — all falling back to LM Studio's qwen3-8b
4. **Left PMO and research alone** — PMO already had a cloud fallback, research already had LM Studio

Now every agent had at least one alternative path when Ollama Cloud was down.

### Session 2: Direct Connection (6:19 PM)

But fallbacks are a bandage. The real fix was eliminating the relay. The user asked: "Check the other agents and update them so they use the same direct ollama-cloud connection."

The default profile was already using `https://ollama.com/v1` directly (via the inline `model.base_url` override). Every other profile was still routing through `localhost:11434`. Time to make them all consistent.

Changed 8 profile configs from `http://localhost:11434/v1` to `https://ollama.com/v1`:

| Profile | Changed | What Moved |
|---------|---------|------------|
| **research** | primary | `minimax-m2.7:cloud` → direct Ollama Cloud |
| **playground** | primary | `kimi-k2.6:cloud` → direct Ollama Cloud |
| **development** | primary | `kimi-k2.6:cloud` → direct Ollama Cloud |
| **f5-ltm** | primary | `kimi-k2.6:cloud` → direct Ollama Cloud |
| **f5-gtm** | primary | `kimi-k2.6:cloud` → direct Ollama Cloud |
| **f5-asm** | primary | `kimi-k2.6:cloud` → direct Ollama Cloud |
| **f5-admin** | primary | `kimi-k2.6:cloud` → direct Ollama Cloud |
| **pmo** | fallback | `glm-5.1:cloud` → direct Ollama Cloud |

LM Studio connections (`localhost:1234`) stayed local — they're genuinely local hardware, not a proxy to a cloud service.

The main config's `custom_providers` "Ollama Cloud" entry also got updated from `http://localhost:11434/v1` to `https://ollama.com/v1` to match reality. No more name/URL mismatch.

## The Lesson

A relay is not a free abstraction layer. It's a point of failure that:

- **Adds latency** to every request
- **Obscures authentication errors** — the relay can't distinguish 401 (bad key) from 429 (rate limit) from 503 (service down) with the right recovery semantics
- **Creates circular dependencies** — falling back to the same broken pipe
- **Masks the real endpoint** — the config says "Ollama Cloud" but the URL says "Local Relay" and the behavior is neither
- **Prevents direct API key validation** — you can't test your credentials against the real service when they go through an intermediary that may or may not forward them correctly

If you're using Ollama Cloud models, connect directly to `https://ollama.com/v1` with a valid API key. If you're using local models, connect directly to `http://localhost:11434/v1`. Don't mix the two. Don't relay cloud requests through a local instance. Don't name a local endpoint "Cloud."

And for the love of all that's operational — if your fallback is the same service you're already failing on, you don't have a fallback. You have a loop.

---

*The relay was removed on June 2, 2026, across two sessions. The Ollama Cloud direct connection has been stable since. See "Hermes Loses Hindsight" (June 11) for the next chapter in the infrastructure cleanup.*