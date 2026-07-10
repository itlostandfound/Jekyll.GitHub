---
layout: post
title: "Hermes Gets Tools and Turbocharged"
date: 2026-05-15 11:30:00 -0500
categories: [hermes, ai, self-hosted, infrastructure]
image: /assets/images/posts/hermes-gets-tools-and-turbocharged.jpg
excerpt: "Hermes got a new home today. We moved the entire agent stack off the Zimaboard2 and onto a Mac Mini M4 — and the difference isn't incremental."
---

Hermes got a new home today. We moved the entire agent stack off the Zimaboard2 and onto a Mac Mini M4 — and the difference isn't incremental. It's the kind of upgrade that changes what you can even attempt.

Here's why we did it and what changed.

## The Zimaboard2: A Good Start

The [Zimaboard2 1664](https://shop.zimaspace.com/products/zimaboard2-single-board-server?variant=50683134312740#specification) is a fanless x86 single-board server with an Intel N150 processor, 16 GB of RAM, dual 2.5GbE, and a PCIe 3.0 x4 slot. At $399, it's an attractive little machine for homelab work — quiet, compact, low power. It runs ZimaOS, CasaOS, Proxmox, TrueNAS, you name it.

It was where Hermes was born. We installed the agent, configured the gateway, set up Ollama, got the Discord bot connected. Hermes worked on the Zimaboard2. That's the honest truth.

But "worked" and "worked well" are different things.

## The Problem

The Intel N150 is a capable chip for what it is — a low-power x86 processor designed for NAS duty, media streaming, and light container orchestration. It is not designed for running local LLM inference alongside a multi-agent orchestration platform.

Hermes isn't a single process. It's a stack:

- The CLI agent itself (Python, always-on)
- The Discord gateway (async, message-driven)
- Ollama for local LLM inference (GPU-dependent, memory-hungry)
- The API server (HTTP endpoint for external integrations)
- Cron jobs firing on schedules
- Hindsight memory extraction (at the time, 2 LLM calls per turn)
- Dashboard web UI

On 4 cores and 16 GB of shared RAM, that stack competes with itself. Ollama loading a 4B or 8B model? The system crawls. A cron job kicks off while a Discord conversation is active? Latency spikes. Two agents talking at once? Forget it.

And then there was the N150's instruction set. No AVX2, no AMX — just basic x86-64 with AES-NI. Modern LLM inference frameworks increasingly expect AVX2 as a baseline. Some operations would flat-out fail or fall back to painfully slow scalar paths.

The Zimaboard2 was like putting a commuter car on a race track. It'll lap the circuit, but you won't be setting any records, and the driver is going to be frustrated the whole time.

## The Mac Mini M4

The upgrade wasn't subtle:

| Spec | Zimaboard2 1664 | Mac Mini M4 Pro |
|------|-----------------|-----------------|
| CPU | Intel N150 (4 cores, no AVX2) | Apple M4 Pro (20 cores, 12 GPU) |
| RAM | 16 GB DDR5 (shared) | 64 GB unified memory |
| GPU | None | 16-core Metal GPU |
| Storage | 2× SATA III | 1.7 TB NVMe |
| Networking | Dual 2.5GbE | 10GbE + Wi-Fi 6E |
| Cooling | Passive (aluminum chassis) | Active fan (near-silent) |
| Price | $399 | ~$1,599 |

That's a 5× CPU core count increase, 4× the RAM, and a GPU that doesn't exist on the Zimaboard2. The M4 Pro's unified memory architecture means the CPU and GPU share the same 64 GB pool — Ollama can load a 32B parameter model and still have room for everything else.

## What Changed Immediately

The first thing I did after the migration was confirm it was real. The very first message sent to Hermes on the new machine was:

> "Say hello and confirm you're running on the Mac Mini M4"

It answered. And it answered fast.

**Ollama went from painful to usable.** Models that took 30+ seconds to first token on the N150 responded in 2-3 seconds on the M4 Pro. We went from running one small model at a time with degraded responsiveness to loading 16 models simultaneously with headroom to spare.

**The full agent stack runs concurrently.** Discord gateway, API server, cron jobs, multiple agent profiles — all running at the same time without stepping on each other's CPU or memory. The 20-core M4 Pro parallelizes workloads that the 4-core N150 had to time-slice.

**Metal GPU acceleration for inference.** Ollama on macOS uses Apple's Metal framework for GPU offload. The `-ngl 99` flag that would crash or stall on the Zimaboard2 (no GPU!) now actually means something. We offload the entire model to the GPU and get 40-50 tokens per second on 8B-class models.

**Storage I/O stopped being a bottleneck.** NVMe versus SATA III — model loading, log writes, state database queries, all of it got faster. The `state.db` that Hermes hits on every conversation turn now reads from NVMe instead of a spinning disk or slow SATA SSD.

## The Migration Itself

The filesystem tells the story. Using `stat` on the key directories:

| Event | Timestamp |
|-------|-----------|
| `/Users/hermes/` home directory created | May 14, 2026 ~5:46 PM CT |
| `~/.hermes/` directory created (install began) | May 15, 2026 ~11:01 AM CT |
| hermes-agent git repo cloned | May 15, 2026 ~11:16 AM CT |
| First conversation message | May 15, 2026 ~11:36 AM CT |

From home directory creation to first conversation: roughly 18 hours. Most of that was macOS setup, Homebrew, Python, and configuring the environment. The actual Hermes install and configuration took about 35 minutes.

The hostname is `MacMiniM4LLM` — chosen deliberately. This machine's job is to run LLMs. Everything else it does (Discord gateway, cron scheduling, dashboard, Firecrawl) is in service of that primary purpose.

## What We Left Behind

The Zimaboard2 isn't retired. A 4-core x86 board with 16 GB of RAM and dual 2.5GbE still has plenty of uses in a homelab. It just isn't where Hermes lives anymore. It's been reassigned to lighter duties — the kind of workloads it was actually designed for.

And that's the right place for it. The Zimaboard2 taught us what we needed in a host. It ran Hermes when we were learning what Hermes even was. But once the agent stack grew — multiple profiles, local inference, cron jobs, memory extraction, API endpoints — we needed a machine that could keep up with all of it at once.

The Mac Mini M4 doesn't just keep up. It has headroom. And that headroom is what makes the difference between an agent that works and an agent that works without you noticing it's working.

---

*Hermes was installed on the Mac Mini M4 on May 15, 2026. The Zimaboard2 that preceded it still serves in the homelab — just not as an LLM host. See "Hermes Gets a Brain" for the next chapter in the agent stack evolution.*