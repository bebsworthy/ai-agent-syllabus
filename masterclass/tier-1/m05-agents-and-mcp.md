---
title: "M05: Agents and MCP — What They Are, How They Reason, Why They Fail"
description: "Agent architecture, MCP protocol, tool discovery, and why APIs don't make good MCP tools."
---


## Overview

An agent is an AI system that plans, reasons about which tools to use, executes them, and iterates based on results. Unlike a simple prompt-response system, agents have memory and decision-making loops. MCP (Model Context Protocol) is the universal protocol that lets agents discover and use tools—databases, version control, APIs, team systems—without needing custom integrations for each one.

This module covers agent architecture (planning loops, memory systems, tool dispatch), MCP as a protocol (JSON-RPC 2.0, client-server, why it exists), and the critical insight: **APIs don't make good MCP tools**. Just because you *can* expose a database or API through MCP doesn't mean you should. Too many tools overwhelm agents; agents with poor tool discovery make bad choices; auto-converted APIs fail because they lack semantic meaning.

You'll connect 2–3 relevant MCP servers (GitHub, a database, a team tool), observe how agents discover and use tools, and learn the curated tool lists by role (full-stack, frontend, backend, DevOps, lead). By the end, you'll have working integrations your team will use daily, plus an understanding of why agent tool selection matters as much as agent reasoning.

> **Workshop:** [M05-Agents-and-MCP-workshop.md](../workshops/M05-Agents-and-MCP-workshop.md)

---

## Pre-work: Theory (15–20 min)

### Agent Architecture: Planning, Memory, and Tool Dispatch

An agent is not a single function call. It's a loop:

1. **Observation**: Agent reads the current state (conversation history, context, available tools)
2. **Planning**: Agent reasons about what to do next
3. **Tool Selection**: Agent picks one or more tools to call
4. **Execution**: Tools are called (API to GitHub, database query, etc.)
5. **Learning**: Results come back; agent incorporates new information
6. **Repeat**: Loop continues until agent decides it's done

**Memory systems** vary:
- **Short-term memory**: The current conversation/session (tokens in context)
- **Long-term memory**: Files, CLAUDE.md, previous session notes (external storage)
- **Tool-based memory**: State in external systems (database, Git history, Slack)

**Context quality determines agent decision quality.** An agent is only as good as the information it reasons within. When an agent has a rich context — clear CLAUDE.md instructions, up-to-date architecture notes, relevant file contents — it makes better tool choices and produces more accurate results. When context is thin or ambiguous, agents fill the gap with guesses. This is why investing time in design documents, CLAUDE.md setup, and session context (covered in M04) directly improves agent performance. It's not optional housekeeping; it's the difference between an agent that makes correct decisions and one that confidently makes wrong ones.

**Tool dispatch** is the tricky part. The agent must:
- Know what tools are available (tool discovery)
- Understand what each tool does (semantic meaning)
- Decide which tool to use for the current task
- Handle failures gracefully (tool returns an error)

This is where agents fail most. If you give an agent 30 tools, it might:
- Get confused about which one to use
- Pick a plausible but wrong tool
- Oscillate between tools without making progress

---

### What is MCP? JSON-RPC 2.0, Client-Server

MCP is a protocol for AI systems to discover and use external tools. It's built on:

- **JSON-RPC 2.0**: A lightweight RPC protocol. Requests and responses are JSON.
- **Client-Server**: Claude Code is the client. Your tools (database, GitHub, etc.) are the server.
- **Transport**: Official standards are stdio (for command-line tools) and Streamable HTTP (for remote servers). WebSocket support is under active discussion as a proposed future standard.

**Example MCP interaction**:

```json
// Client (Claude Code) requests a list of available tools
{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}

// Server responds
{"jsonrpc": "2.0", "id": 1, "result": {
  "tools": [
    {"name": "list_repos", "description": "List all repositories for the user"},
    {"name": "create_issue", "description": "Create a new GitHub issue"}
  ]
}}

// Client calls a tool
{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {
  "tool": "create_issue",
  "arguments": {"repo": "my-org/my-repo", "title": "Fix bug"}
}}

// Server responds with results
{"jsonrpc": "2.0", "id": 2, "result": {
  "issue_id": 123,
  "url": "https://github.com/my-org/my-repo/issues/123"
}}
```

**Why MCP exists**:

- **Eliminates fragmented integrations**: Instead of building a GitHub plugin, a Slack plugin, a database plugin, you build once to the MCP spec
- **Enables rapid tool integration**: New MCP tools are discoverable by all AI systems
- **Reduces friction**: Standardized interface means tools work consistently
- **Two-way context**: Tools can send data back to Claude, and Claude can act on it
- **Reduces hallucinations**: When Claude can *actually call* the database to verify something, instead of guessing, it gets it right

---

### MCP Registry and Tool Discovery

The MCP Registry (https://registry.modelcontextprotocol.io) is a curated catalog of available MCP tools, maintained by the MCP project with 200+ community and officially maintained servers. For production use, prefer servers marked as official or actively maintained. Categories include:

- **Developer Tools**: GitHub, GitLab, Jira, Linear
- **Data**: PostgreSQL, MongoDB, Stripe, Shopify
- **Team Communication**: Slack, Microsoft Teams
- **Documentation**: Notion, Confluence
- **Monitoring**: DataDog, New Relic

**Tool discovery in Claude Code**: `/mcp` shows connected servers and available tools.

> **Token efficiency note:** Claude Code performs tool discovery upfront when you connect servers. With fewer than 5 tools this is efficient. For larger tool ecosystems, some MCP servers support dynamic (on-demand) discovery, which can reduce context token usage substantially. Keep connected tool counts low during development.

---

### OAuth 2.0 Authentication

Many MCP servers require authentication. The standard is OAuth 2.0.

**Why OAuth, not passwords**: OAuth never shares your password with Claude Code. Instead, you grant Claude Code a scoped access token — a credential that is limited to specific permissions (for example: read repositories, but not delete them). If you revoke the token, Claude Code loses access immediately. This is fundamentally more secure than sharing API keys or passwords directly.

**The flow**:

1. **Authorization**: Claude Code opens a browser window. You log in and approve the requested permissions.
2. **Token**: An access token is issued and stored securely in Claude Code (not in your project files or source control).
3. **Scopes**: The token is limited to the permissions you approved. A GitHub token for "read repos" cannot create or delete repos.
4. **Usage**: When Claude Code calls the tool, it attaches the token automatically.
5. **Revocation**: You can revoke tokens at any time from the provider's settings (GitHub → Settings → Applications). Do this if you rotate machines or suspect misuse.

**Production note**: Never commit OAuth tokens to source control. If your team uses `.mcp.json` config files, treat any embedded credentials as secrets and use environment variable references instead. Token management in team settings belongs in a secrets vault, not a dotfile.

---

### The Critical Insight: APIs Don't Make Good MCP Tools

This is the most important lesson of this module.

**Problem**: Just because you *can* expose a REST API through MCP doesn't mean you should.

**Why**: APIs are designed for human-facing requests. They're often:
- Too low-level (you need 10 calls to accomplish 1 logical task)
- Ambiguous (the endpoint name doesn't convey semantic meaning)
- Brittle (agents struggle to handle edge cases and error codes)

**Example**: A PostgreSQL database exposed via MCP is useful because:
- It's a **semantic interface** (the database schema is self-documenting)
- It's **task-oriented** ("find all users with this email" is a clear query)
- It's **idempotent** (running the same query twice gives the same result)

By contrast, a generic REST API exposed as an MCP tool might:
- Require 3–5 sequential calls to accomplish 1 task
- Use vague endpoint names ("POST /api/v1/process")
- Have inconsistent error codes
- Force the agent to infer semantics from documentation

**Best practice**: Create MCP wrappers that are **task-focused**, not API-focused. Instead of exposing all 50 REST endpoints, expose high-level operations:
- `create_customer_profile(name, email, tier)`
- `get_customer_usage_summary(customer_id, date_range)`
- `apply_discount(customer_id, discount_code)`

These are operations Claude understands intuitively. An agent can reason about them.

**Design tool outputs, not just tool inputs.** The same principle applies to what tools return. Tools that return freeform text force the agent to parse and interpret the response — introducing error and wasting tokens. Tools that return structured data (typed JSON with consistent schemas) let the agent extract values reliably and proceed without guessing. If you're building or wrapping an MCP tool, define both sides: what goes in and what comes back.

---

### When to Use Agents vs. Simpler Solutions

Not every problem needs an agent. Agents add complexity — planning loops, tool calls, potential failure points. Before connecting MCP tools, ask whether a simpler solution would work.

**Use a plain LLM (no tools)** when:
- The task is self-contained within the conversation (Q&A, summarization, classification, drafting)
- No external data is needed beyond what you provide in context
- Actions don't need to be taken in external systems

**Add tools (agent pattern)** when:
- The task requires reading from or writing to external systems (database, GitHub, APIs)
- The agent needs current data it can't have in context (live query results, recent file state)
- The task involves sequential decisions that depend on real-world feedback

**Add memory (long-term context)** when:
- Reasoning spans multiple sessions and continuity matters
- The agent needs to remember decisions, preferences, or state from prior interactions

**Add orchestration (multi-agent)** when:
- Different subtasks need specialized models or context windows
- Tasks can run in parallel and be coordinated
- This is Tier 2 content; don't default to it in Tier 1

**The practical rule**: Start with the simplest approach that could work. Each layer of complexity (tools → memory → orchestration) adds capability and adds failure modes. Add a layer only when you've confirmed the simpler approach is insufficient.

---

### Configuration Scopes: Global, Project, Local

MCP connections can be configured at three levels:

1. **User/Global** (user-level config, applies to all Claude Code projects)
   - Available across all your projects on this machine
   - Use for tools you personally need everywhere (GitHub, your primary database)
   - Managed via Claude Code settings; exact file path varies by installation (check `claude mcp list` output or Claude Code docs for your version)

2. **Project** (`.mcp.json` in project root, committed to Git)
   - Available to all team members working on this project
   - Use for project-specific tools the whole team needs
   - Treat embedded credentials as secrets — use environment variable references, not literal tokens

3. **Local** (`.mcp.json` or local override, git-ignored)
   - Available only to you, on this machine
   - Use for personal tools or temporary connections

> **Note on file paths**: Exact configuration file names and locations have evolved across Claude Code versions. When in doubt, use the `/mcp` command within Claude Code to manage connections, or refer to the current [Claude Code MCP documentation](https://docs.anthropic.com/en/docs/claude-code/mcp) for your installed version.

**Management**: Use `/mcp connect` and `/mcp disconnect` to manage.

---

### Local vs. Remote MCP: Choosing Transport for Your Team

Not all MCP servers run locally on your machine. Understanding the distinction matters when you move from individual development to team deployments.

**Local (stdio) MCP servers**:
- Run as a process on your machine, communicating over stdin/stdout
- Best for: development and iteration, personal tools, tools that need local file access
- Limitation: only you can use them; each team member configures independently

**Remote (Streamable HTTP) MCP servers**:
- Run as network services, accessed over HTTP
- Best for: team-shared tools, production integrations, tools requiring central governance
- Benefits: single configuration point, centralized audit logging, shared authentication management, no per-machine setup
- Consideration: requires TLS (HTTPS) for any non-localhost connection; never connect to remote MCP servers over plain HTTP in production

**Practical guidance for teams**:
- Start with local stdio servers while you're learning and iterating
- Move stable, team-wide tools to remote HTTP servers once you know what the team actually uses daily
- Remote MCP is the emerging standard for production deployments; file-based local config is primarily a development pattern

---

### The Curated MCP Reference List by Role

Too many tools = agent confusion. Here's a curated list by role:

#### Full-Stack Developer
- **Version Control**: GitHub MCP
- **Database**: PostgreSQL MCP (or your primary database)
- **Monitoring**: Logs/metrics (Datadog or similar)
- Total: 3 tools

#### Frontend Developer
- **Version Control**: GitHub MCP
- **Package Manager**: npm/yarn (optional, via CLI)
- **Design**: Figma MCP (if available, for referencing designs)
- Total: 2–3 tools

#### Backend/DevOps
- **Version Control**: GitHub MCP
- **Database**: PostgreSQL MCP + Redis MCP (or primary databases)
- **Infrastructure**: AWS/GCP (if available as MCP)
- **Monitoring**: CloudWatch or Datadog MCP
- Total: 3–4 tools

#### Product Lead
- **Version Control**: GitHub MCP (for reading code, not writing)
- **Project Management**: Linear or Jira MCP
- **Collaboration**: Slack MCP (for team communication)
- Total: 3 tools

---

## Pre-work: Readings

### Essential Readings

1. **"MCP: The Universal Protocol for AI Tool Integration" (Anthropic)**
   - Official overview of MCP architecture and philosophy.
   - Link: https://modelcontextprotocol.io/

2. **"MCP Introduction" by Stytch**
   - Practical walkthrough of setting up and using MCP.
   - Link: https://stytch.com/blog/mcp/ (or search "Stytch MCP intro")

3. **"APIs Don't Make Good MCP Tools" by Reilly Wood**
   - The critical insight on tool design. Required reading.
   - Link: https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/
   - *Note: This is a third-party perspective aligned with Anthropic's MCP design philosophy, not official Anthropic documentation.*

4. **MCP Registry**
   - Browse the available tools. Get a sense of what's available.
   - Link: https://registry.modelcontextprotocol.io

5. **OpenAI Prompt Engineering Guide**
   - Covers structured prompting techniques relevant to agent reasoning and tool use.
   - Link: https://platform.openai.com/docs/guides/prompt-engineering


## Takeaway

By the end of this module, you will have:

1. **Working MCP Connections** (2–3 tools)
   - Configured and verified
   - Relevant to your team's daily work
   - Examples: GitHub, database, team communication tool

2. **Understanding of Agent Architecture**
   - Planning loops: observation → plan → tool selection → execution → learning
   - Memory systems: short-term (context) and long-term (external)
   - Tool dispatch: how agents choose tools

3. **Mastery of `/mcp` Commands**
   - `/mcp` (list all connected tools)
   - `/mcp connect [tool]` (add a new tool)
   - `/mcp disconnect [tool]` (remove a tool)
   - `/mcp config` (manage settings)

4. **The Critical Insight**: APIs Don't Make Good MCP Tools
   - Task-focused tools > API-focused tools
   - Semantic clarity > raw endpoints
   - Fewer curated tools > lots of tools

5. **A Curated Tool List** for your role (from the reference lists in this module)

6. **Awareness of Tool Limitations**
   - Agents struggle with ambiguous tool semantics
   - Too many tools cause confusion and worse performance
   - Tool design matters as much as agent reasoning

---

## Key Concepts

- **Agent**: An AI system with planning loops, memory, and tool dispatch
- **MCP (Model Context Protocol)**: A universal protocol for agents to discover and use tools
- **JSON-RPC 2.0**: The underlying request-response protocol for MCP
- **Client-Server**: Claude Code is the client; tools are servers
- **Tool Discovery**: The agent's ability to see what tools are available and understand what they do
- **OAuth 2.0**: Standard authentication for MCP tools
- **Semantic Meaning**: Clear, task-focused tool operations (not raw APIs)
- **Tool Dispatch**: The agent's decision about which tool to use and when
- **MCP Registry**: The curated list of available tools
- **Configuration Scopes**: Global, project, and local MCP configuration

---

## References

- Anthropic. "Model Context Protocol (MCP)."
  - https://modelcontextprotocol.io/

- Stytch. "MCP: A Protocol for AI Tool Integration."
  - https://stytch.com/blog/mcp/ (or search)

- Wood, R. "APIs Don't Make Good MCP Tools." (Third-party perspective aligned with Anthropic's MCP design philosophy.)
  - https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/

- Anthropic. "MCP Registry."
  - https://registry.modelcontextprotocol.io

- OpenAI. "Prompt Engineering Guide."
  - https://platform.openai.com/docs/guides/prompt-engineering

- Wei, J., et al. (2023). "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models."
  - https://arxiv.org/abs/2201.11903 (foundational for agent reasoning)

---

## Next Steps

You've completed Tier 1: Foundations. You understand:
- How LLMs work (M01)
- How to write effective prompts (M02)
- How to write clear specifications (M03)
- How to manage context for reliability (M04)
- How to connect agents and tools (M05)

Tier 2 builds on these foundations: you'll learn advanced use cases, scaling patterns, custom agent development, and organizational integration. But Tier 1 alone gets you to 80% productivity.
