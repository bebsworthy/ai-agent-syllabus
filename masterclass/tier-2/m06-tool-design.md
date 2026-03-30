---
title: "M06: Tool Design — Building What Agents Can Actually Use"
description: "How to design purpose-built MCP tools: consolidation, agent-efficient formats, and clear descriptions."
---


## Overview

Mechanical API-to-tool conversion fails. You can expose every endpoint as a separate tool, but agents struggle with large tool counts—VS Code enforces a 128-tool limit for a reason. Each tool output consumes context (JSON can be verbose; CSV/TSV is agent-efficient). Purpose-built tools combine multiple response types and consolidate related API functions into coherent interfaces.

This module teaches you *how* agents actually use tools, then walks you through designing and building a custom MCP server that respects those constraints. You'll learn when to combine functions, how to return agent-efficient formats, and how to structure tool descriptions for clear reasoning. By the end, you'll have a working MCP server your team can use for months.

**Duration:** 90 minutes (15-20 min pre-work + 60-75 min workshop + exercises)
**Hands-on:** Custom TypeScript MCP server using the Anthropic SDK
**Takeaway:** A working MCP server + design principles applied to all future tools

> **Workshop:** [M06-Tool-Design-workshop.md](../workshops/M06-Tool-Design-workshop.md)

---

## Prerequisites

- Tier 1 completion (basic MCP understanding)
- 1-2 weeks Claude Code usage
- TypeScript fundamentals (async/await, interfaces, classes)
- Node.js 18+ installed locally
- Basic familiarity with REST APIs or internal tools

---

## Pre-work: Theory (15-20 minutes)

### Why APIs Don't Make Good MCP Tools

**The Problem:**
Naively converting an API to MCP produces many small, context-heavy tools. For example, a CRM API with 50 endpoints becomes 50 tools. Each tool call generates verbose JSON output. The agent sees this noise and makes worse decisions.

**Context Window Arithmetic:**
- One API endpoint as an MCP tool: ~200-500 tokens of context overhead (tool definition + response)
- 50 tools: 10,000+ tokens just to describe them to the agent
- Plus: JSON responses are verbose. An object with 20 fields takes 100-200 tokens per response
- Agent decision quality degrades under cognitive load

**The vs Code 128-Tool Limit:**
Not arbitrary. Beyond ~100 tools, agent latency increases exponentially and reasoning degrades. The limit is a proxy for "you're doing something wrong."

**What Agents Actually Need:**
1. **Fewer, smarter tools** (10-20 per domain, not 50)
2. **Consolidated operations** (one "search_contacts" tool that can filter, sort, paginate—not separate tools for each)
3. **Agent-efficient output formats** (CSV/TSV for lists, structured JSON only when necessary)
4. **Clear naming and descriptions** (agents read docs and decide whether to call your tool)

### Three Principles of Agent-Friendly Tools

**1. Consolidate Related Functions**
Bad: `get_user()`, `list_users()`, `search_users()`, `filter_users_by_role()` (4 tools)
Good: One `query_users()` tool with parameters: `user_id?`, `search?`, `role_filter?`, `limit`, `offset`

**2. Return Agent-Efficient Formats**
- **For lists:** CSV/TSV (compact, scannable, tool can say "returns 3 CSV rows")
- **For single objects:** Minimal JSON (only essential fields)
- **For complex structures:** Markdown tables or key-value pairs
- **Avoid:** Nested objects, verbose metadata, large arrays

**3. Combine Response Types**
A single tool can return different formats depending on context:
- `get_deployment_status()` → returns CSV for list mode, JSON for detailed mode
- Describe both modes clearly in the tool description
- Agents learn to use the right mode based on their task

### The Three-Phase Methodology

1. **Prototype:** Sketch the tool interface on paper. Ask: "What will an agent actually need?" Not "what does the API expose?"
2. **Evaluate:** Test with a real agent on real tasks. Does it reduce token consumption? Does the agent call it effectively?
3. **Refine:** Iterate based on agent behavior. If the agent misunderstands the tool, rewrite the description. If output is too verbose, switch formats.

### Tool Design Checklist

- [ ] **Naming:** Clear, verb-first (`list_`, `create_`, `update_`, `query_`, `deploy_`)
- [ ] **Consolidation:** Related API functions merged into one tool with parameters
- [ ] **Description:** 1-2 sentences explaining what it does + one example of when to use it
- [ ] **Parameters:** Minimal set; optional params clearly marked
- [ ] **Output format:** CSV/TSV for lists; minimal JSON for objects; markdown for documentation
- [ ] **Token efficiency:** Estimate context cost; aim for <100 tokens per typical response
- [ ] **Error handling:** Clear, actionable error messages
- [ ] **Pagination:** For large datasets, support `limit` and `offset`

---

## Takeaway

You now own:
- ✓ A working custom MCP server (deploy, ticket, database, or AWS tool)
- ✓ Design principles: consolidation, agent-efficient formats, clear descriptions
- ✓ A reusable template for building tools your team will use

**Apply this immediately:**
- Deploy this server to your team's infrastructure
- Document the tools in your team wiki
- Use it for 1-2 weeks and gather feedback

---

## Key Concepts

**API vs MCP Tool:**
An API endpoint is a low-level interface. An MCP tool is a high-level abstraction designed for agent reasoning. They're not the same.

**Tool Consolidation:**
Merge related API operations into one tool with optional parameters. Reduces cognitive load on the agent.

**Agent-Efficient Format:**
CSV/TSV for lists (scannable, compact). Minimal JSON for objects. Markdown tables for documentation. Avoid nested structures.

**Context Window Budget:**
Every tool definition + every tool response consumes tokens. Design conservatively. A well-designed tool pays for itself in agent reasoning quality.

**Transport Types:**
- **stdio:** Best for local development and single-machine deployment
- **HTTP/SSE:** For distributed systems or Claude Code instances across a network
- **sse:** Real-time streaming; more complex but enables async workflows

---

## References

- **Anthropic MCP Documentation:** https://modelcontextprotocol.io/
- **MCP TypeScript SDK:** https://github.com/modelcontextprotocol/typescript-sdk
- **AI Agent Tool Design Best Practices:** (Anthropic internal, shared in workshop)
- **Context Window Budgeting:** https://docs.anthropic.com/guides/tokens/faq
- **Tool Naming Conventions:** https://developers.anthropic.com/guides/tools
