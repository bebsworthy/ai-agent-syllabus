# M06 More Info: Recent Developments & Updates

## Summary

Since mid-2024, the MCP ecosystem and agent tool design landscape has evolved significantly. The June 2025 and November 2025 MCP specification releases introduced structured outputs, OAuth-based authorization, tool annotations/hints, and the prompts primitive for workflow automation. Concurrently, Anthropic released advanced tool use features (Tool Search, Programmatic Tool Calling, Tool Use Examples) and Agent Skills, while the community developed new evaluation frameworks. The overarching trend moves from manual tool definition toward dynamic tool discovery, code-based execution patterns, and compositional approaches. M06's core principles remain sound, but the module would benefit from coverage of these emerging patterns, especially structured outputs, tool annotations, code-execution patterns, and evaluation frameworks.

---

## New Developments Relevant to M06

### Structured Tool Outputs (June 2025 MCP Spec)
**Date/Period:** June 18, 2025 release (MCP Specification 2025-06-18)
**Source:** [Tools - Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
**What it is:** MCP formalized structured output support for tool responses. Tools can now return a `structuredContent` field containing JSON objects validated against an optional output schema, with backwards compatibility through parallel TextContent blocks. This standardizes how tools communicate complex, machine-readable results.
**Relevance to M06:** M06 emphasizes agent-efficient formats (CSV/TSV for lists, minimal JSON for objects) but predates the formalization of MCP structured outputs. Structured outputs offer a standardized, validated alternative to ad-hoc format choices.
**Current module coverage:** M06 teaches format selection (CSV vs JSON vs Markdown) but does not mention output schema validation or the MCP `structuredContent` field. It focuses on token efficiency and readability without addressing how schema validation improves reliability.
**Recommended addition:** Add section on structured outputs best practices: when to use `structuredContent` vs TextContent, how output schemas reduce errors, and how to balance schema complexity against agent comprehension. Include example of a tool returning both CSV and structured JSON with schema validation for complex queries.

---

### Tool Annotations and Hints (March 2026)
**Date/Period:** March 16, 2026 blog post; feature introduced ~2024, refined through 2025
**Source:** [Tool Annotations as Risk Vocabulary: What Hints Can and Can't Do](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/)
**What it is:** Servers can attach metadata hints to tools describing behavior: `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`. These are explicitly untrusted by default; clients decide how much weight to give them based on server provenance. They help clients show confirmations, assess risk, and improve tool discovery UX.
**Relevance to M06:** M06 addresses tool naming, descriptions, and consolidation but does not cover tool metadata or risk signaling. Hints are now a standard pattern for communicating tool safety properties without relying on natural language parsing.
**Current module coverage:** M06 teaches clear descriptions (1-2 sentences + example) but relies entirely on textual description. Does not mention hints as a structured way to signal destructiveness, read-only status, or idempotency.
**Recommended addition:** Add subsection on hint best practices in the Tool Design Checklist. Include guidance: "Set `destructiveHint` for tools that modify state; set `readOnlyHint` for query tools; set `idempotentHint` if safe to call repeatedly; set `openWorldHint` only for tools that reach external systems." Warn that hints cannot prevent prompt injection and must be paired with trust model decisions by clients.

---

### Advanced Tool Use Features (Anthropic, 2025)
**Date/Period:** 2025 beta releases
**Source:** [Introducing advanced tool use on the Claude Developer Hub](https://www.anthropic.com/engineering/advanced-tool-use)
**What it is:** Three beta features that transform tool use at scale:
  1. **Tool Search Tool** – Dynamic tool discovery via search, reducing upfront context from 72K to ~8.7K tokens while maintaining access to full tool libraries (85% reduction). Improves accuracy on tool-heavy tasks (Opus 4: 49%→74%, Opus 4.5: 79.5%→88.1%).
  2. **Programmatic Tool Calling** – Claude orchestrates 20+ tool calls in a single code block, eliminating multiple inference passes and saving ~37% of tokens (43,588→27,297 avg).
  3. **Tool Use Examples** – Concrete usage patterns in tool definitions showing when and how to use optional parameters.

**Relevance to M06:** M06 emphasizes reducing tool count to <100 and conserving context. These features directly address the core constraint: they enable agents to work with hundreds of tools while maintaining accuracy and efficiency. They shift the design paradigm from "fewer, smarter tools" to "many tools with smart discovery."
**Current module coverage:** M06 explicitly teaches tool consolidation as a requirement because "beyond ~100 tools, agent latency increases exponentially." It does not mention dynamic tool discovery, code-based orchestration, or tool use examples.
**Recommended addition:** Add section titled "Scaling Beyond Tool Consolidation" that covers: (1) How Tool Search Tool and dynamic discovery change consolidation trade-offs; (2) Code-based tool orchestration patterns (agents write code to call tools rather than using direct tool calls); (3) Tool Use Examples as a new best practice for clarity. Include caveat that the 128-tool VS Code limit still applies to direct tool calls, but Tool Search enables discovery of much larger tool libraries.

---

### Code Execution with MCP (Anthropic, 2025)
**Date/Period:** 2025
**Source:** [Code execution with MCP: building more efficient AI agents](https://www.anthropic.com/engineering/code-execution-with-mcp)
**What it is:** Agents interact with MCP servers as code APIs rather than direct tool calls. Servers expose tools as filesystem tree of code files (e.g., `servers/salesforce/updateRecord.ts`). Agents navigate the filesystem to discover and load tool definitions on-demand. Large datasets are processed in the execution environment before returning summaries to context.
**Relevance to M06:** M06 focuses on tool design for direct invocation (tool calls with JSON parameters). Code-based execution represents a fundamentally different pattern: agents write code to orchestrate tools, enabling massive context savings (98.7% reduction: 150K→2K tokens) and privacy preservation (PII stays in execution environment).
**Current module coverage:** M06 does not mention code execution patterns or the filesystem-as-tool-discovery approach. It assumes direct tool call integration.
**Recommended addition:** Add section on alternative execution models: (1) Direct tool calls (MCP standard); (2) Code-based execution (agents write code to call tools). Compare trade-offs: direct calls are simpler to implement, code execution saves massive context and enables stateful workflows. Include practical guidance: code execution requires secure sandboxing infrastructure and is best for high-volume tool scenarios (100+ tools) or privacy-sensitive workloads.

---

### MCP Prompts and Workflow Automation (July 2025)
**Date/Period:** July 29, 2025 blog; November 2025 spec refinement
**Source:** [MCP Prompts: Building Workflow Automation](https://blog.modelcontextprotocol.io/posts/2025-07-29-prompts-for-automation/)
**What it is:** MCP prompts are reusable instruction templates that bundle prompt text with embedded resources (data, code, context). They enable workflow automation by composing tools and resources into entry points. Includes resource templates (dynamic URIs like `file://recipes/{cuisine}`), completions for parameter guidance, and modular server composition.
**Relevance to M06:** M06 teaches tool consolidation and composition at the individual tool level. Prompts extend composition to the workflow level: multiple tools + resources + instructions combined into higher-order abstractions. This is a new pattern for building agent-friendly automation.
**Current module coverage:** M06 does not mention prompts. It focuses on designing individual tools and MCP servers.
**Recommended addition:** Add section on composition beyond individual tools: "Tool Composition via Prompts." Explain: prompts bundle instructions, tools, and resources into workflows. Example: a "meal planning" prompt might compose recipe resources + a shopping list tool + a recipe search tool. Include guidance that prompts are best used when agents need to follow a specific workflow, while individual tools are best for flexible, ad-hoc use.

---

### Agent Skills (Anthropic, 2025)
**Date/Period:** 2025 release
**Source:** [Equipping agents for the real world with Agent Skills](https://claude.com/blog/equipping-agents-for-the-real-world-with-agent-skills)
**What it is:** Agent Skills are organized folders containing instructions, scripts, and resources that extend agent capabilities. Defined by a SKILL.md file with YAML metadata (name, description). Agents discover and load capabilities dynamically using progressive disclosure: metadata at startup, full content on-demand, supplementary files only when needed. Can bundle executable code (Python, Bash) that agents invoke directly.
**Relevance to M06:** M06 teaches tool design for individual MCP servers. Agent Skills represent a parallel abstraction for composable agent specialization: rather than building separate custom agents, Skills allow general agents to become domain-specific. Skills can bundle tools, code, and instructions together.
**Current module coverage:** M06 does not mention Agent Skills. It assumes monolithic MCP servers.
**Recommended addition:** Add section distinguishing tools vs. skills: Tools expose specific operations (query_users, deploy_system). Skills package expertise (domain knowledge, workflows, scripts) into composable modules. Include guidance: use tools for low-level operations, skills for high-level workflows and domain expertise. Note future integration potential between Skills and MCP servers.

---

### OAuth-Based Authorization and Security (June & November 2025)
**Date/Period:** June 18, 2025 release; November 25, 2025 refinement (SEP-1024, SEP-835)
**Source:** [Understanding Authorization in MCP - Model Context Protocol](https://modelcontextprotocol.io/docs/tutorials/security/authorization); [One Year of MCP: November 2025 Spec Release](https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/)
**What it is:** MCP now formalizes OAuth 2.1-based authorization with two patterns:
  1. Per-server authorization (token required for all requests)
  2. Per-tool authorization (token required only for protected tools)
Additionally, URL mode elicitation enables secure browser-based OAuth flows, and MCP Server Cards (/.well-known/mcp.json) expose metadata including auth requirements for pre-connection discovery.

**Relevance to M06:** M06 does not address security, authorization, or enterprise deployment. These are now first-class MCP concerns.
**Current module coverage:** M06 focuses entirely on tool design mechanics (consolidation, formats, descriptions) with no coverage of security, auth, or enterprise patterns.
**Recommended addition:** Add section on "Security and Authorization in Tool Design": (1) When to use per-server vs. per-tool authorization; (2) URL mode elicitation for browser-based OAuth; (3) Server Cards for metadata discovery. Include practical guidance: use per-server auth for sensitive domains (payment, HR), per-tool for public APIs with some protected endpoints. Emphasize that authorization design should be part of initial tool design, not bolted on later.

---

### Tool Evaluation Frameworks (Bloom, Harbor, Promptfoo, 2025)
**Date/Period:** 2025 releases
**Source:** [Bloom: an open source tool for automated behavioral evaluations](https://www.anthropic.com/research/bloom); [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
**What it is:** New evaluation frameworks for tool use:
  - **Bloom** (Anthropic): Agentic framework for behavioral evaluations. Quantifies frequency and severity of specific agent behaviors across automatically generated scenarios.
  - **Harbor**: Containerized agent execution with standardized task/grader format and benchmarks like Terminal-Bench 2.0.
  - **Promptfoo**: Declarative YAML configuration for prompt/tool testing with assertions from string matching to LLM-as-judge.

**Relevance to M06:** M06 teaches the Three-Phase Methodology (Prototype → Evaluate → Refine) but provides no concrete evaluation methods. Formal frameworks now exist for measuring tool effectiveness.
**Current module coverage:** M06 recommends: "Test with a real agent on real tasks. Does it reduce token consumption? Does the agent call it effectively?" but does not provide evaluation frameworks or metrics.
**Recommended addition:** Add section on "Evaluating Tool Design": (1) Tool call verification (check tools used, parameters passed); (2) Context-appropriate tool selection (does agent pick right tool for context?); (3) Outcome verification (did tool achieve intent?). Recommend starting simple (exact string matching for deterministic outputs) and advancing to model-based grading (LLM-as-judge for nuanced outcomes). Reference Bloom for behavioral evals and Harbor for benchmarking at scale.

---

### Tool Use Examples and Clear Descriptions (Anthropic, 2025)
**Date/Period:** 2025 beta feature
**Source:** [Introducing advanced tool use on the Claude Developer Hub](https://www.anthropic.com/engineering/advanced-tool-use); [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
**What it is:** Tool descriptions are enhanced with concrete usage examples (not just JSON schemas). Agents learn from examples when and how to use optional parameters, alternative response formats, and query syntax. Example: instead of "supports optional `format` parameter," show "format: 'csv' returns compact list, format: 'detailed' returns full object details."
**Relevance to M06:** M06 teaches clear, concise descriptions (1-2 sentences + one example) but does not elaborate on what constitutes a good example or how examples improve agent behavior.
**Current module coverage:** M06 includes "one example of when to use it" in the Tool Design Checklist but provides limited guidance on example quality.
**Recommended addition:** Expand Tool Design Checklist with: "Examples: Include 1-2 concrete usage examples showing optional parameters, edge cases, and alternative formats. Example: 'query_users(search: "alice", format: "csv") returns 3 CSV rows; query_users(user_id: "123", format: "detailed") returns full object.' Show agents the difference between formats and help them choose correctly."

---

### Semantic Field Naming and Token Efficiency (Anthropic, 2025)
**Date/Period:** 2025 research
**Source:** [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
**What it is:** Tool output quality is significantly improved by using semantically meaningful field names. Instead of `uuid`, use `user_id`. Instead of `mime_type`, use `file_type`. Research shows "resolving arbitrary alphanumeric UUIDs to more semantically meaningful and interpretable language significantly improves Claude's precision in retrieval tasks."
**Relevance to M06:** M06 emphasizes token efficiency and agent-readable formats but does not address semantic clarity in field naming.
**Current module coverage:** M06 teaches format selection (CSV vs JSON) and mentions "minimal JSON" but does not address naming conventions.
**Recommended addition:** Add best practice to Tool Design Checklist: "Field Names: Use semantically meaningful names (user_id not uuid, file_type not mime_type). Avoid cryptic identifiers. Test: does the agent understand what this field represents without external documentation?" Include explanation that semantic names improve both token efficiency (agents spend less context asking "what is this field?") and accuracy (agents correctly interpret field semantics).

---

### Server Composition and MCP 2026 Roadmap
**Date/Period:** 2026 roadmap; ongoing
**Source:** [2026 MCP Roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
**What it is:** The 2026 MCP roadmap emphasizes server composition patterns (mixing capabilities from multiple servers), transport scalability (HTTP/SSE for remote servers), and enterprise readiness (audit trails, SSO, gateway behavior). The roadmap explicitly notes that "separate servers is where the beauty of the system comes in—you can mix and match different capabilities."
**Relevance to M06:** M06 teaches building a single MCP server. The roadmap signals growing importance of composing multiple servers.
**Current module coverage:** M06 focuses on a single, cohesive MCP server. Does not address when to build multiple servers or composition patterns.
**Recommended addition:** Add section on "Multi-Server Architecture": When to split tools across multiple MCP servers (domain separation, independent scaling, different deployment contexts). Include composition patterns: multiple servers → unified agent context → coherent workflows. Mention that modular servers are easier to maintain and test than monoliths.

---

## Emerging Best Practices to Consider Adding

### 1. **Dynamic Tool Discovery Over Static Tool Consolidation**
The shift from "fewer, smarter tools" (M06's model) to "many discoverable tools with smart search" (Tool Search paradigm) is substantial. Modules should acknowledge both approaches and their trade-offs. Static consolidation is simpler to implement and reason about; dynamic discovery enables richer tool ecosystems but requires infrastructure (search indexing, progressive loading).

### 2. **Progressive Information Disclosure in Tool Design**
Similar to Agent Skills' three-level hierarchy, tool descriptions can follow progressive disclosure: brief 1-liner for discovery, full description on selection, examples and edge cases on-demand. This keeps agent context lean while maintaining depth.

### 3. **Schema-Driven Tool Output Design**
Moving beyond "CSV or JSON" format selection, tools should include output schemas validated at the specification level. This reduces tool-level error handling and improves agent confidence in result interpretation.

### 4. **Tool Metadata and Risk Signaling**
Hints (readOnly, destructive, idempotent, openWorld) are now a standard pattern. Tool design should include metadata decisions, not just API design.

### 5. **Evaluation-Driven Iteration**
Formal evaluation frameworks (Bloom, Harbor) make the "Refine" phase of M06's Three-Phase Methodology more systematic. Tool designers should build evals early and iterate based on measured agent behavior, not guesswork.

### 6. **Authorization as Core Design Concern**
Authorization (OAuth, per-tool scopes, browser-based flows) is no longer optional or enterprise-only. Design tools with auth in mind from day one.

### 7. **Documentation and Discoverability**
Server Cards (/.well-known/mcp.json) and tool description quality have become critical for agent effectiveness. Invest in clear, example-driven documentation.

---

## Sources Consulted

**Core MCP Resources:**
- [Model Context Protocol (MCP) Specification – Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [Model Context Protocol (MCP) – Prompts](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts)
- [MCP Authorization Tutorial](https://modelcontextprotocol.io/docs/tutorials/security/authorization)
- [MCP 2026 Roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
- [One Year of MCP: November 2025 Spec Release](https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/)

**Anthropic Engineering & Research:**
- [Writing Tools for Agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Introducing Advanced Tool Use on the Claude Developer Hub](https://www.anthropic.com/engineering/advanced-tool-use)
- [Code Execution with MCP: Building More Efficient AI Agents](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Equipping Agents for the Real World with Agent Skills](https://claude.com/blog/equipping-agents-for-the-real-world-with-agent-skills)

**Tool Design & Evaluation Blog Posts:**
- [Tool Annotations as Risk Vocabulary: What Hints Can and Can't Do](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/)
- [MCP Prompts: Building Workflow Automation](https://blog.modelcontextprotocol.io/posts/2025-07-29-prompts-for-automation/)
- [Exploring the Future of MCP Transports](https://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/)
- [Introducing the MCP Registry](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/)
- [Bloom: An Open Source Tool for Automated Behavioral Evaluations](https://alignment.anthropic.com/2025/bloom-auto-evals/)

**Agent Design & Orchestration:**
- [A Practical Guide to Building Agents (OpenAI)](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)
- [How We Built Our Multi-Agent Research System (Anthropic)](https://www.anthropic.com/engineering/multi-agent-research-system)

---

**Audit Notes:**
- Audit completed: March 28, 2026
- Module file: `/sessions/nifty-upbeat-galileo/mnt/Ai Agent Syllabus/masterclass/Tier 2 - Mastery/M06-Tool-Design.md`
- Key finding: M06's core principles (consolidation, agent-efficient formats, clear descriptions) remain foundational, but the module predates significant specification updates (structured outputs, OAuth, hints), new capabilities (Tool Search, Programmatic Tool Calling), and emerging patterns (code-based execution, Skills, prompts, formal evals). Recommended additions are mostly additive—new sections that complement rather than replace existing content.
