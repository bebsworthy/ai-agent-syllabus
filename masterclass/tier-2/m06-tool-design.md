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

**The VS Code 128-Tool Limit:**
Not arbitrary. Beyond ~100 tools loaded into context at once, agent latency increases and reasoning quality degrades. The limit applies to active tools per request; it is a design guardrail, not a ceiling for your entire tool ecosystem. If you need more than 128 tools, dynamic discovery (not more consolidation) is the right answer—see *Three Principles* below and *Key Concepts: Scaling Beyond Consolidation*.

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

**Structured Outputs and Output Schema:**
The MCP spec (2025-06-18) introduced `structuredContent` and `outputSchema` validation as first-class design options. Rather than relying solely on format conventions (CSV vs JSON), you can define an output schema that the server validates against before returning data to the agent. Use `structuredContent` when your tool returns predictable, machine-readable data—agent frameworks can parse it reliably without guesswork. Use plain `TextContent` (CSV/Markdown) when the output is primarily for agent reading or display. The trade-off: schema validation reduces tool-level errors and improves agent confidence, but adds schema maintenance overhead. A well-designed tool can return both—`TextContent` for the readable summary and `structuredContent` for the parseable payload—letting the agent choose what to consume.

**3. Combine Response Types**
A single tool can return different formats depending on context:
- `get_deployment_status()` → returns CSV for list mode, JSON for detailed mode
- Describe both modes clearly in the tool description
- Agents learn to use the right mode based on their task

### The Three-Phase Methodology

1. **Prototype:** Sketch the tool interface on paper. Ask: "What will an agent actually need?" Not "what does the API expose?"
2. **Evaluate:** Test with a real agent on real tasks using a methodical approach—not just intuition. See the evaluation framework below.
3. **Refine:** Iterate based on evidence. If the agent misunderstands the tool, rewrite the description. If output is too verbose, switch formats. Re-evaluate after each change.

### Evaluating Tool Design

Vague evaluation ("it seemed to work") produces fragile tools. Use a structured approach at each iteration:

1. **Tool call verification (deterministic outputs):** For tools that retrieve fixed data, use exact string matching. Does the agent call the right tool with the right parameters? Does the response contain the expected fields? Automate this with test cases in Promptfoo or a simple script.

2. **Context-appropriate selection:** Present the agent with ambiguous tasks that could use multiple tools. Does it choose the intended tool, or does it reach for a less appropriate one? Poor tool descriptions or naming are the usual cause.

3. **Outcome verification (nuanced outputs):** For non-deterministic results (summaries, analyses), use an LLM-as-judge approach: a second model evaluates whether the tool's output correctly served the agent's goal. Bloom (behavioral evaluation framework, 2025) provides structured rubrics for this.

4. **Token measurement:** Count tokens consumed per typical task with and without your tool. A well-designed tool should reduce total task token usage, not add to it. If a tool adds overhead without improving outcomes, revisit its output format or scope.

**Reference frameworks:** Bloom (behavioral evals), Harbor (tool benchmarking), and Promptfoo (LLM testing) are the current standard tools for this. Start with Promptfoo for basic verification; add Bloom when you need behavioral metrics.

### Tool Design Checklist

- [ ] **Naming:** Clear, verb-first (`list_`, `create_`, `update_`, `query_`, `deploy_`)
- [ ] **Consolidation:** Related API functions merged into one tool with parameters
- [ ] **Description:** 1-2 sentences explaining what it does + one example of when to use it. Show at least two usage patterns: a simple call and one with optional parameters or an alternative output mode. Example: *"Use `query_users(search='alice')` to find users by name. Use `query_users(role_filter='admin', limit=5)` to list the first 5 admins."* Help the agent see the difference between modes so it can choose correctly.
- [ ] **Parameters:** Minimal set; optional params clearly marked
- [ ] **Field names:** Use semantically meaningful names (`user_id`, `created_at`, not `id`, `ts`). The agent should understand what a field represents without reading external documentation.
- [ ] **Output format:** CSV/TSV for lists; minimal JSON for objects; markdown for documentation. Consider `structuredContent` with an `outputSchema` for machine-readable outputs.
- [ ] **Token efficiency:** Estimate context cost; aim for <100 tokens per typical response
- [ ] **Error handling:** Clear, actionable error messages
- [ ] **Pagination:** For large datasets, support `limit` and `offset`

### Tool Annotations (Hints)

Tool annotations are structured metadata properties that communicate tool safety and behavior to MCP clients—without relying on natural language parsing alone. They are now a standard part of MCP tool design (introduced 2025, refined March 2026).

The four core hint properties:

| Hint | Type | Meaning |
|---|---|---|
| `readOnlyHint` | boolean | Tool does not modify any external state. Safe to call freely. |
| `destructiveHint` | boolean | Tool may delete or permanently alter data. Client may require confirmation. |
| `idempotentHint` | boolean | Calling the tool multiple times with the same input produces the same result. Safe to retry. |
| `openWorldHint` | boolean | Tool may interact with external systems (web, third-party APIs) beyond the defined scope. |

**Why annotations matter:** Clients use hints to build confirmation dialogs for destructive operations, filter tools by safety level, and assess risk before autonomous execution. A tool without annotations leaves the client guessing.

**Important:** Hints are advisory, not enforced. A client treats them as trusted signals from the tool author, but they are not cryptographically verified. Do not use hints as a security boundary—use them as a communication contract.

Add annotations to your tool definition alongside the `name`, `description`, and `inputSchema` fields.

---

## Workshop

The hands-on session for this module: [**M06: Tool Design — Workshop Guide**](/workshops/m06-workshop/)

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
Merge related API operations into one tool with optional parameters. Reduces cognitive load on the agent. Consolidation is the right default for most tool sets (under ~50 tools). For larger ecosystems, see *Scaling Beyond Consolidation* below.

**Scaling Beyond Consolidation: Tool Search and Dynamic Discovery:**
The 128-tool limit and the ~100-tool exponential-degradation threshold reflect the cost of loading all tool definitions into context at once. Anthropic's Tool Search Tool (2025) changes this trade-off: rather than injecting every tool definition upfront, the agent queries an index to discover relevant tools on demand, reducing context overhead by approximately 85%. On Claude Opus 4, this improved task accuracy from 49% to 74% on large tool sets (79.5% to 88.1% on Opus 4.5).

The two paradigms are complementary, not competing:

- **Static consolidation** (recommended default): Consolidate related functions, keep total tools under ~50, inject all definitions at startup. Simpler infrastructure, works well for bounded domains.
- **Dynamic discovery** (for scale): Use a Tool Search index for large ecosystems (100+ tools). The agent searches for the right tool before calling it. Requires indexing infrastructure but removes the per-request context ceiling.

When designing: start with consolidation. If your consolidated tool set exceeds ~50 tools and you observe context degradation, introduce dynamic discovery rather than forcing further consolidation that sacrifices tool clarity.

**Agent-Efficient Format:**
CSV/TSV for lists (scannable, compact). Minimal JSON for objects. Markdown tables for documentation. Avoid nested structures.

**Context Window Budget:**
Every tool definition + every tool response consumes tokens. Design conservatively. A well-designed tool pays for itself in agent reasoning quality.

**Transport Types:**
- **stdio:** Best for local development and single-machine deployment
- **Streamable HTTP (with optional Server-Sent Events):** For distributed systems or Claude Code instances across a network. SSE is an optional feature within this transport—not a separate transport—and enables real-time streaming when needed.

Note: MCP spec 2025-06-18 unified what was previously called "HTTP/SSE" and "sse" into a single "Streamable HTTP" transport. If you encounter older documentation referring to them as separate transports, treat them as the same thing.

---

## References

- **Anthropic MCP Documentation:** https://modelcontextprotocol.io/
- **MCP TypeScript SDK:** https://github.com/modelcontextprotocol/typescript-sdk
- **AI Agent Tool Design Best Practices:** (Anthropic internal, shared in workshop)
- **Context Window Budgeting:** https://docs.anthropic.com/guides/tokens/faq
- **Tool Naming Conventions:** https://developers.anthropic.com/guides/tools
