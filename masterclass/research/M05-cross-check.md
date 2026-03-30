# M05 Cross-Check: Masterclass vs CS146S

## Summary

**M05 ("Agents and MCP") demonstrates strong alignment with CS146S Week 2 (Anatomy of Coding Agents) on core MCP concepts**, including the client-server architecture, JSON-RPC 2.0 protocol, tool discovery, and the critical insight that "APIs don't make good MCP tools." However, **M05 is notably broader in scope**, covering agent architecture (planning loops, memory systems, tool dispatch) and configuration management, while CS146S Week 2 focuses more narrowly on MCP as a protocol. CS146S Week 4 (Coding Agent Patterns) introduces operational orchestration concepts that complement but are distinct from M05's foundational coverage.

**Key finding**: M05 provides a solid self-contained introduction to agents and MCP suitable for Tier 1 (Foundations). Recommended enhancements include (1) expanding on OAuth 2.0 authentication flows beyond the brief mention, (2) clarifying the relationship between agent autonomy design and tool curation, and (3) referencing context-quality principles from CS146S Week 4.

---

## Supported Claims

### Core MCP Concepts: Protocol, Architecture, JSON-RPC 2.0

**M05 Claim:**
> "MCP is a protocol for AI systems to discover and use external tools. It's built on... JSON-RPC 2.0... Client-Server: Claude Code is the client. Your tools (database, GitHub, etc.) are the server."

**CS146S Support:**
- **Week 2 COURSE.md**: "Think of MCP as the API contract for agent-tool interactions. Just as USB-C simplifies connectivity across diverse devices, MCP provides a uniform method for AI models to invoke external functions, retrieve data, or use predefined prompts."
- **MCP Introduction.md**: "MCP uses a client-server architecture. The AI-powered application... acts as the host and runs an MCP client component, while each external integration runs as an MCP server."
- **MCP Introduction.md**: JSON-RPC request/response examples match M05's examples exactly.

**Status**: FULLY SUPPORTED. CS146S Week 2 materials validate M05's protocol-level descriptions with examples and deeper context.

---

### Why MCP Exists: Standardization and Reduced Fragmentation

**M05 Claim:**
> "Why MCP exists:
> - Eliminates fragmented integrations: Instead of building a GitHub plugin, a Slack plugin, a database plugin, you build once to the MCP spec
> - Enables rapid tool integration: New MCP tools are discoverable by all AI systems"

**CS146S Support:**
- **Week 2 COURSE.md**: "Rather than baking integrations directly into the model or having every client implement its own tool-calling mechanisms, MCP provides a common language that both client applications and tool providers speak fluently."
- **MCP Introduction.md**: "MCP centralizes and standardizes these interactions: the AI agent just needs to handle the MCP protocol, and any MCP server will work in a plug-and-play way."

**Status**: FULLY SUPPORTED. CS146S emphasizes the same fragmentation problem and standardization value.

---

### Two-Way Context and Tool Results

**M05 Claim:**
> "Two-way context: Tools can send data back to Claude, and Claude can act on it."

**CS146S Support:**
- **MCP Introduction.md**: "Two-Way Context: Unlike simple API calls, MCP supports maintaining context and ongoing dialogue between the model and the tool. An MCP server can provide Prompts (predefined prompt templates for certain tasks) and Resources (data context like documents) in addition to tools."

**Status**: FULLY SUPPORTED. CS146S expands on this with additional capabilities (Prompts, Resources).

---

### OAuth 2.0 Authentication

**M05 Claim:**
> "Many MCP servers require authentication. The standard is OAuth 2.0:
> 1. Authorization: You approve Claude Code to use the tool on your behalf
> 2. Token: An access token is stored securely in Claude Code
> 3. Usage: When Claude Code calls the tool, it includes the token"

**CS146S Support:**
- **Week 2 COURSE.md**: "For secured servers, the most flexible approach leverages OAuth 2.0 providers... Organizations can choose from a broad array of identity providers: GitHub, Google, Slack, Stytch, Auth0, and WorkOS."
- **MCP Server Authentication.md**: Documents OAuth flow with GitHub example showing callback URL, token management, and development vs. production setup.

**Status**: SUPPORTED WITH ELABORATION. M05 captures the core concept; CS146S provides implementation details and specific provider examples.

---

### MCP Registry as Curated List

**M05 Claim:**
> "The MCP Registry (https://registry.mcp.ai) is a curated list of available MCP tools. Categories include: Developer Tools, Data, Team Communication, Documentation, Monitoring."

**CS146S Support:**
- **MCP Registry.md**: "Anthropic and collaborators have launched the Model Context Protocol (MCP) Registry in preview—an open catalog... providing a centralized platform for the growing MCP ecosystem."
- **Week 2 COURSE.md**: "The registry, launched in preview at https://registry.modelcontextprotocol.io, functions as a 'single source of truth' for publicly available MCP servers."

**Status**: SUPPORTED. CS146S adds important ecosystem context: sub-registries (public and private), community-driven moderation, and the grassroots collaboration that built it.

---

### APIs Don't Make Good MCP Tools

**M05 Claim:**
> "This is the most important lesson of this module... APIs are designed for human-facing requests. They're often:
> - Too low-level (you need 10 calls to accomplish 1 logical task)
> - Ambiguous (the endpoint name doesn't convey semantic meaning)
> - Brittle (agents struggle to handle edge cases and error codes)"

**CS146S Support:**
- **Week 2 MCP Food-for-Thought.md**: "Agents Struggle with Large Tool Counts... Web APIs weren't designed with these constraints—what works fine as separate API endpoints becomes problematic when mapped to individual MCP tools."
- **Week 2 COURSE.md**: "Purpose-built MCP tools consolidate related API functions into coherent interfaces, return data in agent-efficient formats, and combine multiple response types to guide agent reasoning. They're designed for agent capabilities, not copied from existing APIs."

**Status**: FULLY SUPPORTED. CS146S Week 2 dedicates substantial space to this insight with specific examples: context window consumption, token efficiency (CSV vs. JSON), and sophisticated tool design patterns.

---

### Tool Curation and Role-Based Lists

**M05 Claim:**
> "Too many tools = agent confusion. Here's a curated list by role... [Full-Stack: 3 tools, Frontend: 2-3, Backend/DevOps: 3-4, Product Lead: 3]"

**CS146S Support:**
- **Week 2 COURSE.md**: "Agents struggle with large tool counts... VS Code enforces a 128-tool limit precisely because models lose precision with too many options... Purpose-built MCP tools prove significantly more flexible, often consolidating multiple API functions into coherent, agent-friendly interfaces."
- **Week 4 COURSE.md**: "Invest in context quality to expand safe autonomy... when the context is murky, even routine tasks need oversight."

**Status**: SUPPORTED. M05's specific role-based lists are not replicated in CS146S, but the principle (fewer, curated tools) is strongly endorsed. Week 4 adds the insight that context quality enables expanded autonomy.

---

### Agent Architecture: Planning, Memory, Tool Dispatch Loop

**M05 Claim:**
> "An agent is not a single function call. It's a loop:
> 1. Observation: Agent reads the current state
> 2. Planning: Agent reasons about what to do next
> 3. Tool Selection: Agent picks one or more tools to call
> 4. Execution: Tools are called
> 5. Learning: Results come back
> 6. Repeat: Loop continues until agent decides it's done"

**CS146S Support:**
- **Week 2 COURSE.md**: "Planning loops: observation → plan → tool selection → execution → learning... A planning loop is the agent's decision-making engine. Given a user request, the agent reasons about what it needs to do, what tools might help, and in what sequence. This isn't a simple branching decision tree—it's iterative."
- **Week 2 COURSE.md**: "Tool dispatch is the mechanism connecting planning decisions to actual execution... MCP provides a standardized protocol for this dispatch mechanism, removing the need for custom wiring in each agent framework."

**Status**: FULLY SUPPORTED. CS146S Week 2 COURSE.md validates the loop structure with additional depth on each component.

---

### Memory Systems: Short-term, Long-term, Tool-based

**M05 Claim:**
> "Memory systems vary:
> - Short-term memory: The current conversation/session (tokens in context)
> - Long-term memory: Files, CLAUDE.md, previous session notes (external storage)
> - Tool-based memory: State in external systems (database, Git history, Slack)"

**CS146S Support:**
- **Week 4 COURSE.md**: "Persistence and Continuous Learning... Claude Code doesn't start from scratch each session. The platform includes mechanisms for persistent learning: CLAUDE.md files store project-specific instructions, and auto-memory captures learnings like build commands and debugging insights."
- **Week 4 COURSE.md**: "On subsequent runs, agents remember these patterns and apply them consistently. The system becomes more efficient and more reliable as it learns."

**Status**: SUPPORTED WITH EXTENSION. M05 describes memory types; CS146S Week 4 explains the mechanisms (CLAUDE.md, auto-memory) and strategic implications (institutional memory improves over time).

---

### Configuration Scopes: Global, Project, Local

**M05 Claim:**
> "MCP connections can be configured at three levels:
> 1. Global (~/.claude/mcp.json) — Available to all Claude Code projects
> 2. Project (.mcp.json in project root, committed to Git) — Available to the team
> 3. Local (.mcp.json in project root, git-ignored) — Available only to you, on this machine"

**CS146S Support:**
- CS146S materials do not explicitly mention configuration scopes (Global/Project/Local).

**Status**: MASTERCLASS-ONLY. This is specific operational guidance not covered in CS146S. It's practical, useful, and complements M05's strategic focus.

---

## Missing from CS146S (Masterclass-Only Content)

### Configuration Scopes and `/mcp` Command Management

**M05 Coverage:**
- Three-level configuration hierarchy (Global, Project, Local)
- Specific file paths (~/.claude/mcp.json, .mcp.json)
- Use cases for each scope (global tools for everyone, project tools for team, local for personal/temporary)
- `/mcp` command syntax: `connect`, `disconnect`, `config`

**CS146S Coverage:**
- No explicit coverage of configuration file structure or command syntax
- Week 2 mentions "MCP Inspector" as a debugging tool but not `/mcp` commands

**Recommendation for M05:**
This is a strength of M05. The operational detail is valuable for hands-on learning and team coordination. Consider preserving this in the workshop section.

---

### Tool Selection by Specific Role

**M05 Coverage:**
- Full-Stack Developer: GitHub, PostgreSQL, Datadog/Logs (3 tools)
- Frontend Developer: GitHub, npm/yarn, Figma (2-3 tools)
- Backend/DevOps: GitHub, PostgreSQL + Redis, AWS/GCP, CloudWatch/Datadog (3-4 tools)
- Product Lead: GitHub (read-only), Linear/Jira, Slack (3 tools)

**CS146S Coverage:**
- Week 2 emphasizes principle (fewer tools, purpose-built) but provides no role-specific recommendations
- Week 4 discusses "Document First, Code Second" and MCP tool connection broadly but not by role

**Recommendation for M05:**
The role-based tool lists are practical and not contradicted by CS146S. They represent institutional wisdom about tool curation. Strengthen by referencing the "APIs Don't Make Good MCP Tools" principle: each tool should be semantic, task-focused, and agent-friendly, not merely available.

---

### Planning Loop Detailed Steps

**M05 Coverage:**
- Six-step loop: Observation → Planning → Tool Selection → Execution → Learning → Repeat
- Explicit naming of each phase

**CS146S Coverage:**
- Week 2 mentions the loop structure but with slightly different emphasis
- Week 4 focuses on higher-level orchestration (autonomy, context, handoffs) rather than loop mechanics

**Recommendation for M05:**
M05's naming and structure are pedagogically sound. CS146S doesn't contradict this; it operates at a different level of abstraction.

---

## Conflicts / Discrepancies

**No direct conflicts found.** M05 and CS146S are complementary:

- **M05**: Foundational layer (what agents are, how MCP works, why tool design matters)
- **CS146S Week 2**: Practical layer (how to implement agents, how to build MCP servers, how to debug)
- **CS146S Week 4**: Operational layer (how to orchestrate agents at scale, how to manage autonomy, how to use context as a force multiplier)

Minor terminology differences exist but are not contradictory:

| M05 | CS146S | Impact |
|---|---|---|
| "MCP Registry" URL: registry.mcp.ai | "MCP Registry" URL: registry.modelcontextprotocol.io | M05 uses shortened URL; CS146S uses full domain. Both correct. |
| "Tool dispatch is the tricky part" | "Tool dispatch is the mechanism connecting planning decisions to actual execution" | M05 emphasizes difficulty; CS146S emphasizes mechanism. Both perspectives valid. |

---

## CS146S Topics Not in Masterclass M05

### 1. **MCP Authentication Depth: OAuth 2.0 Features and Flow**

**CS146S Week 2 Coverage:**
- OAuth 2.0 as the standard for MCP server authentication
- Dynamic Client Registration (DCR) for automatic client setup
- Automatic endpoint discovery using standardized metadata
- Secure token management for multi-user environments
- Implementation example: GitHub OAuth with Cloudflare deployment
- Development vs. production setup (local callbacks vs. live domains)

**M05 Coverage:**
- Brief mention: "The flow is browser-based. You approve, the token is stored, and tools work automatically afterward."

**Impact on M05:**
- M05's brevity is appropriate for Tier 1 (Foundations). OAuth details fit better in a security module or advanced workshop.
- Recommend: If a dedicated M07 or M08 covers security, reference CS146S Week 2 materials there.

---

### 2. **MCP Server Building and Implementation**

**CS146S Week 2 Coverage:**
- Friday lecture: "Building a Custom MCP Server"
- MCP specification implementation details
- Server design patterns (exposing tools via JSON-RPC)
- Authentication and authorization on the server side
- Cloudflare deployment and testing with MCP Inspector
- TypeScript SDK examples

**M05 Coverage:**
- Zero coverage of server implementation (reading tools only)

**Impact on M05:**
- M05 is correctly scoped as a "user" perspective (connecting to tools, not building them).
- CS146S Week 2 Friday complements M05 by covering the "builder" perspective.
- Recommend: If a future module covers custom integrations or MCP server development, reference CS146S Week 2 Friday materials.

---

### 3. **MCP Ecosystem Maturity: Sub-Registries, Community Moderation**

**CS146S Week 2 Coverage:**
- MCP Registry structure: central registry + public/private sub-registries
- Public registries: client providers (Anthropic) augment central registry with curated data
- Private registries: enterprises build custom registries with internal governance
- Community-driven moderation: flag servers for spam, malware, impersonation
- Collaborative origins: nine companies contributed to registry design (GitHub, Block, Anthropic, Microsoft, etc.)

**M05 Coverage:**
- "The MCP Registry (https://registry.mcp.ai) is a curated list of available MCP tools."
- Basic category listing (Developer Tools, Data, Team Communication, etc.)

**Impact on M05:**
- M05 captures the essentials; CS146S adds ecosystem context (maturity, governance, industry collaboration).
- Recommend: M05 could strengthen the "Readings" section by mentioning the registry preview phase and sub-registry capability.

---

### 4. **Context-Quality Relationship and Institutional Memory**

**CS146S Week 4 Coverage:**
- "Code quality is a function of context"
- CLAUDE.md as persistent instructions for agents
- Auto-memory capturing learnings (build commands, debugging patterns)
- Institutional memory improving over time
- Context front-loading: summarizing prior state before starting work
- StockApp case study: 2.5x productivity gains through context investment

**M05 Coverage:**
- Brief mention: "Long-term memory: Files, CLAUDE.md, previous session notes (external storage)"
- No discussion of context's impact on agent decision-making or code quality

**Impact on M05:**
- M05 treats memory as a component; CS146S treats context as a strategic multiplier.
- Recommend: Reference CS146S Week 4 principle in M05's "Pre-work: Theory" section. Add to takeaways: "Invest in clear, current context (design docs, CLAUDE.md, architecture notes) to improve agent decisions."

---

### 5. **System-Reminder Tags and Layered Engineering for Reliability**

**CS146S Week 4 Coverage:**
- "Tiny reminders, at the right time, change agent behavior"
- System-reminder tags embedded throughout the pipeline (system prompt, user messages, tool results)
- Context front-loading to orient before execution
- Safety validation at execution points
- Sub-agent architecture for complex tasks

**M05 Coverage:**
- No coverage of these architectural patterns

**Impact on M05:**
- These are advanced patterns (Tier 2 territory, not Tier 1).
- Recommend: If M05 expands to discuss agent reliability or resilience, reference these patterns.

---

### 6. **Agent Autonomy Spectrum and Trust Calibration**

**CS146S Week 4 Coverage:**
- Autonomy is task-specific, not binary
- Progressive automation: start supervised, expand autonomy over time
- Trust calibration: measure reliability on low-risk tasks, then tackle high-risk
- Review cycles and handoff strategies
- Ensemble methods for critical code

**M05 Coverage:**
- Brief mention: "Too many tools = agent confusion; agents with poor tool discovery make bad choices"
- No discussion of autonomy design, trust building, or progressive rollout

**Impact on M05:**
- M05 focuses on *what* agents are; CS146S Week 4 focuses on *how to operate* them.
- Recommend: Add a section to M05 (or the workshop) titled "Agent Autonomy and Tool Selection" linking the principle: better tool curation → safer autonomy → fewer errors.

---

### 7. **Multi-Agent Coordination and Task Decomposition**

**CS146S Week 4 Coverage:**
- Sub-agent architecture: decompose complex tasks into focused subtasks
- Lead agent coordination: assigns work, merges results
- Parallel execution possibilities
- Agent SDK for custom orchestration logic

**M05 Coverage:**
- Single-agent focus throughout
- No discussion of multi-agent teams or task decomposition

**Impact on M05:**
- Single-agent modeling is appropriate for Tier 1 (Foundations). Multi-agent patterns belong in Tier 2.
- Recommend: Reference as a "Next Steps" topic pointing to CS146S Week 4 or a future advanced module.

---

## Prioritized Recommendations for Improvement

### Priority 1 (High): Strengthen Context-Quality Connection

**Current State:**
M05 treats "memory systems" as a list of storage locations (short-term, long-term, tool-based). This is correct but incomplete.

**Recommendation:**
Add a new subsection to "Pre-work: Theory" titled **"Context Quality and Agent Reasoning"** (2-3 paragraphs):

```markdown
### Context Quality and Agent Reasoning

Why does context matter? Agents don't make isolated decisions; they reason within whatever information environment you provide.

**Poor context** = agent confusion. An agent given 30 tools with vague descriptions will:
- Pick tools at random
- Oscillate between similar tools without progress
- Spend tokens describing its uncertainty

**Rich context** = agent clarity. The same agent, given 5 focused tools with clear descriptions, alongside design documents explaining the domain, will:
- Pick tools decisively
- Reason about tool sequencing correctly
- Complete tasks faster and more reliably

This isn't about the agent model itself—it's about the *information environment* the agent works in. Invest in context as much as tool selection: write design documents, maintain CLAUDE.md files, keep architecture notes current. The agent's decision-making quality is a direct function of context quality.

**Practical implication:** Before connecting an agent to 5 tools, spend an hour writing a design document explaining your domain. The agent will use that document to decide which tools to invoke, and the quality of that decision depends on the clarity of your context.
```

**Source:** CS146S Week 4: "Good Context Leads to Good Code" and "Peeking Under the Hood of Claude Code"

**Impact:** Elevates M05 from tool-centric to systems-thinking, connecting agent architecture to operational discipline.

---

### Priority 2 (High): Expand OAuth 2.0 Authentication Section

**Current State:**
> "Many MCP servers require authentication. The standard is OAuth 2.0:
> 1. Authorization: You approve Claude Code to use the tool on your behalf
> 2. Token: An access token is stored securely in Claude Code
> 3. Usage: When Claude Code calls the tool, it includes the token
> The flow is browser-based. You approve, the token is stored, and tools work automatically afterward."

**Recommendation:**
Replace with expanded section (4-5 paragraphs):

```markdown
### OAuth 2.0 Authentication

Many MCP servers require authentication, especially those accessing sensitive data (GitHub repos, databases, internal tools). The industry standard is OAuth 2.0, a protocol that lets you grant Claude Code access without sharing passwords.

**How it works:**
1. **Authorization**: You click "Connect" in Claude Code and are directed to your MCP server's login page
2. **User approval**: You log in with your credentials (GitHub, Google, etc.) and approve Claude Code's access request
3. **Token exchange**: The server generates a secure access token and stores it in Claude Code
4. **Automatic use**: On subsequent tool calls, Claude Code includes that token—no re-authentication needed

**Why OAuth 2.0?**
- **Security**: You never share passwords with Claude Code. Your credentials stay with your identity provider.
- **Scope control**: You can grant Claude Code access to specific data (e.g., "read repos" but not "delete repos")
- **Revocation**: You can revoke Claude Code's access instantly from your provider's settings
- **Multi-user**: Different team members can authenticate independently; each sees only their authorized data

**Common providers:**
- GitHub (for repo access)
- Google (for Docs, Drive, Sheets)
- Slack (for team communication)
- Jira/Linear (for issue tracking)
- Custom OAuth providers for internal tools

**Implementation note:** MCP servers support two authentication models:
- **Public access**: No authentication required (suitable for public data like weather APIs)
- **Secured access**: OAuth required (suitable for private data and sensitive operations)

Choose based on your tool's sensitivity. Start with read-only access; expand permissions as needed.
```

**Source:** CS146S Week 2: "MCP Server Authentication" and "MCP Introduction"

**Impact:** Moves authentication from "briefly mentioned" to "clearly understood," matching the importance of this security pattern.

---

### Priority 3 (Medium): Add Tool Design Principles from CS146S

**Current State:**
M05 explains the "APIs Don't Make Good MCP Tools" principle well but focuses on problems (too low-level, ambiguous, brittle). It could strengthen with design principles.

**Recommendation:**
Expand the section to include **positive design guidance** (subsection "Designing Good MCP Tools"):

```markdown
### Designing Good MCP Tools: Positive Principles

Beyond avoiding bad API conversions, good MCP tools follow these principles:

1. **Task-Oriented, Not Endpoint-Oriented**
   - Bad: Expose 20 REST endpoints as 20 separate tools
   - Good: Group related endpoints into one cohesive tool (e.g., `manage_customer_profile` handles creation, updates, and retrieval)

2. **Agent-Efficient Output Formats**
   - Bad: Return large JSON responses with 100+ fields per record
   - Good: Return CSV or TSV for structured data; uses ~50% fewer tokens and leaves more context for reasoning
   - Note: CSV uses ~half the tokens per record compared to JSON for the same data

3. **Combined Response Types**
   - Good tools can return structured data + freeform guidance together
   - Example: `search_documentation` returns search results (CSV) + plain-text summary + suggestions for follow-up actions
   - Agents process combined outputs better than rigid APIs

4. **Clear, Predictable Semantics**
   - Tool names and descriptions should be obvious (not "POST /api/v1/process")
   - Input schemas should match user intent (not requiring 3-5 sequential calls for 1 logical task)
   - Error responses should be predictable and agent-friendly (not 10+ possible HTTP status codes)

5. **Semantic Clarity Over Completeness**
   - A database schema exposed as MCP is more useful than a generic HTTP API
   - Because the schema itself documents what's available and what makes sense
   - Agents can reason about database operations intuitively
```

**Source:** CS146S Week 2: "APIs Don't Make Good MCP Tools" and "COURSE.md" sections on tool design

**Impact:** Transforms M05 from "what to avoid" into "what to build," giving teams concrete design guidance.

---

### Priority 4 (Medium): Reference Multi-Agent Patterns as "Next Steps"

**Current State:**
M05 focuses entirely on single-agent interaction with tools. No mention of scaling to teams or multiple agents.

**Recommendation:**
Add one paragraph to the "Next Steps" section:

```markdown
**Advanced topic: Multi-Agent Orchestration** (Tier 2)

As your use of agents scales, you'll encounter tasks too large for one agent to handle:
- Decompose into subtasks (e.g., "build payment system" → "design schema" + "implement API" + "add tests")
- Assign each subtask to a focused sub-agent with narrowed instructions
- Use a lead agent to coordinate work and merge results

This pattern enables parallel work and specialization. CS146S Week 4 covers multi-agent coordination in detail. For now, focus on getting one agent + 3-5 well-curated tools working reliably.
```

**Source:** CS146S Week 4: "Sub-Agent Architecture" and "From Individual Tasks to Team Coordination"

**Impact:** Provides visibility to advanced patterns without overloading Tier 1.

---

### Priority 5 (Low): Clarify Registry URL and Status

**Current State:**
M05 references "https://registry.mcp.ai" but CS146S Week 2 references "https://registry.modelcontextprotocol.io"

**Recommendation:**
Update to the official URL and add status note:

```markdown
### MCP Registry and Tool Discovery

The MCP Registry (https://registry.modelcontextprotocol.io, launched September 2025) is a curated, open-source catalog of available MCP servers. It's designed as a "single source of truth" for tool discovery, enabling both public and private sub-registries.

Categories include:
- Developer Tools: GitHub, GitLab, Jira, Linear
- Data: PostgreSQL, MongoDB, Stripe, Shopify
- Team Communication: Slack, Microsoft Teams
- Documentation: Notion, Confluence
- Monitoring: DataDog, New Relic

**Tool discovery in Claude Code**: `/mcp` shows connected servers and available tools.

The registry is maintained by a collaborative community (GitHub, Block, Anthropic, Microsoft, and others) with community-driven moderation to maintain quality and security.
```

**Source:** CS146S Week 2: "MCP Registry.md" and "COURSE.md"

**Impact:** Improves accuracy and adds context about ecosystem governance (small but valuable).

---

### Priority 6 (Low): Cross-Reference MCP Inspector for Debugging

**Current State:**
M05 mentions `/mcp` commands but not the MCP Inspector tool for testing and debugging.

**Recommendation:**
Add one line to the "Readings" or "References" section:

```markdown
**Supplementary**: The MCP Inspector is a debugging tool for testing MCP servers locally. When building custom integrations or troubleshooting tool behavior, the Inspector helps verify OAuth flows and tool availability before production deployment. See CS146S Week 2 materials for hands-on MCP server examples.
```

**Source:** CS146S Week 2: "COURSE.md" and "MCP Server Authentication"

**Impact:** Minimal—just awareness of a useful tool.

---

## Summary of Alignment

| Topic | M05 | CS146S Week 2 | CS146S Week 4 | Recommendation |
|---|---|---|---|---|
| MCP protocol (JSON-RPC, client-server) | Excellent | Excellent | — | Aligned. No changes needed. |
| OAuth 2.0 authentication | Brief | Detailed | — | Expand M05 to match CS146S depth. (Priority 2) |
| "APIs Don't Make Good MCP Tools" | Excellent | Excellent | — | Add positive design principles. (Priority 3) |
| Tool curation and role-based lists | Excellent | Supported (principle) | — | Preserve. Not contradicted. |
| Agent loop (planning, memory, dispatch) | Clear | Detailed | — | Aligned. M05 pedagogy is sound. |
| Configuration scopes and `/mcp` commands | Excellent | Absent | — | Preserve as M05-unique. Practical value. |
| Context-quality relationship | Minimal | — | Detailed | Add connection. (Priority 1) |
| Multi-agent orchestration | Absent | — | Detailed | Reference as Tier 2. (Priority 4) |
| System-reminder tags and reliability patterns | Absent | — | Detailed | Reference as advanced. (Priority 5) |
| MCP Registry status and governance | Basic | Detailed | — | Clarify URL and add governance context. (Priority 5) |

---

## Conclusion

**M05 is well-positioned as a Tier 1 (Foundations) module.** It covers essential concepts (what agents are, how MCP works, why tool design matters) with clarity and appropriate scope. CS146S materials validate and extend M05 in predictable ways:

- **CS146S Week 2**: Operationalizes M05 concepts (how to build servers, how to authenticate, specific ecosystem details)
- **CS146S Week 4**: Scales M05 concepts (how to manage autonomy, how to orchestrate teams, how context drives quality)

**Recommended next steps:**
1. Implement Priority 1-3 changes (context-quality connection, OAuth depth, tool design principles)
2. Cross-reference CS146S Week 4 materials in future Tier 2 modules (agent orchestration, autonomy management)
3. Reference CS146S Week 2 "Building a Custom MCP Server" when expanding to custom integrations or advanced workshops

**No contradictions detected.** M05 and CS146S are complementary resources at different levels of depth and operational maturity.
