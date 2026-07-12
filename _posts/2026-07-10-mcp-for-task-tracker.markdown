---
layout: post
title: "MCP for Task-Tracker"
date: 2026-07-10 18:00:00 -0500
categories: [hermes, ai, mcp, self-hosted, docker]
image: /assets/images/posts/mcp-for-task-tracker.jpg
excerpt: "I built an MCP Server for Task Tracker. It worked. Really well, actually. There was just one problem — I installed it on the Agent instead of running it somewhere the Agent could connect to it."
---

I built an MCP Server for Task Tracker. It worked. Really well, actually. Hermes could create trackers, add tasks, manage checklists, and update project steps, all through natural language. The integration was clean, the tools showed up, and everything functioned as designed.

There was just one problem. I installed it on the Agent.

## What I Built

The MCP Server for Task Tracker exposes the full Task-Tracker REST API as MCP tools. Any MCP-compatible AI agent can manage trackers, tasks, notes, checklists, and projects conversationally. Same capabilities as the web dashboard, driven by natural language instead of clicks.

It covers the full API surface. Trackers and tasks. Rich text notes. Dynamic checklists with templates. Multi-step projects with references. Everything the Task-Tracker API can do, the MCP server can do too. No shortcuts, no partial implementations. 1:1 coverage.

The server itself is TypeScript, built with the standard MCP SDK. You clone it, configure your environment variables, wire it into your MCP client config, and you're off. No npm publish step, no global installs. Standalone companion, not a package.

## The Mistake

Here's the thing about MCP servers. They're supposed to be services that an agent *connects to*, not software that gets *installed on* the agent. The Model Context Protocol is a client-server architecture. The agent is the client. The MCP server is a separate process that exposes tools over a transport layer (stdio, SSE, whatever). The agent calls the server, the server calls the API, the results flow back.

What I did was install the MCP server directly on Hermes. It worked because Hermes supports MCP server configuration in its `config.yaml`. You add the server config, Hermes starts it as a child process via stdio, and the tools appear. The integration was seamless.

But "seamless" masked a fundamental architecture error. I had built a tool that could only be used by one specific agent on one specific machine. The server wasn't accessible to anything else. No other agent, no other machine, no other client could reach it.

## Where It Fell Apart

The mistake became obvious when I wanted to enable Claude at work to use the same Task Tracker MCP server. Claude is on my work machine. The work machine is a thin client. I don't install anything on my work machine. That's a hard rule, not a preference.

So Claude needed to connect to an MCP server running somewhere else. Somewhere network-accessible. Somewhere that wasn't installed on a single agent's local config.

The MCP server I built couldn't do that. It was designed for local stdio transport. Hermes launches it, talks to it over stdin/stdout, and that's the whole relationship. No HTTP endpoint. No SSE transport. No way for any external client to reach it.

I had essentially built a library that only worked when bolted directly onto one specific application. It was like building a web API that can only be called from localhost and then only if the caller is compiled into the same binary.

## The Fix: Containerize and Decouple

The solution was to re-architect the entire deployment model. Instead of "install this on your agent," the MCP server needs to be "run this somewhere and point any agent at it."

That means:

- **Docker container** — The MCP server runs in its own container, not as a child process of an agent. It has its own lifecycle, its own network presence, its own failure isolation.

- **SSE transport** — Server-Sent Events over HTTP, not stdio. Any agent on any machine can connect to an HTTP endpoint. That's the whole point of MCP being a protocol instead of a library.

- **Standalone deployment** — The container runs on my home lab infrastructure (Proxmox, Docker, whatever). It's a service on the network, not a plugin in someone's config file.

- **Multi-agent access** — Hermes at home connects to it. Claude at work connects to it. Any future agent connects to it. Same endpoint, same tools, same Task Tracker instance. The server doesn't care who's calling it.

## What This Revealed About MCP Architecture

The mistake was instructive. MCP is explicitly designed as a client-server protocol. The server is supposed to be independent. When you configure an MCP server in an agent's config file using stdio transport, you're using a convenience feature for local development and testing. It's not the production deployment model.

The production model is:

1. Run the MCP server as its own service (Docker, systemd, cloud function, whatever)
2. Expose it over a network transport (SSE over HTTP is the standard approach)
3. Configure agents to connect to that endpoint
4. Let any number of agents use the same server instance

My initial approach skipped directly from "it works on my machine" to "ship it" without stopping at "how is this actually supposed to be deployed?"

## Where Things Stand Now

The MCP server code itself was solid. The tools, the API coverage, the error handling, all of that carried over. What changed is the deployment model. The server is being re-architected to run in a Docker container with SSE transport, deployed on my home lab infrastructure, and accessible to any agent that can reach the network.

The lesson is simple enough. Just because you *can* install something directly on the tool that uses it doesn't mean you *should*. MCP servers are services, not plugins. Build them to be independent, deploy them to be shared, and let the agents come to the tools instead of embedding the tools inside the agents.

---

*The MCP Server for Task Tracker project page is at [projects/mcp-server-tasktracker](/projects/mcp-server-tasktracker/). The rebuild to Docker + SSE is in progress.*