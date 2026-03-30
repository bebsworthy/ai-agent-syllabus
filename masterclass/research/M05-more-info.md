# M05 More Info: Recent Developments & Updates

**Research Date:** March 28, 2026
**Module Audited:** M05 - Agents and MCP
**Focus Areas:** MCP evolution, agent architectures, tool use patterns, new official MCP servers, authentication, remote MCP, agentic loops

---

## Summary

Since the module's creation (mid-2024), the MCP ecosystem has matured significantly:
- The MCP specification has evolved with two major releases (June 2025 and November 2025)
- **Tasks abstraction** now enables tracking long-running operations and async workflows
- **Remote MCP** is now fully supported in Claude Code, enabling cloud-hosted tool servers
- **Transport scalability** improvements are underway for enterprise production deployments
- **Tool use best practices** have crystallized around simplicity and composability patterns
- **Structured tool outputs** and OAuth-based authorization are now standardized
- A formal **Agentic AI Foundation** has been established to govern MCP's future

The module's core insights remain valid, but several emerging practices and tooling capabilities should be highlighted.

---

## New Developments Relevant to M05

### 1. MCP Tasks Abstraction (November 2025)

**Date/Period:** November 2025 specification release
**Source:** [One Year of MCP: November 2025 Spec Release](https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/) | [2026 MCP Roadmap](http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)

**What it is:**
Tasks are a new first-class abstraction in MCP that allow MCP servers to track ongoing work. Unlike simple synchronous tool calls, tasks support:
- Multiple states: `working`, `input_required`, `completed`, `failed`, `cancelled`
- Long-running operations (the server defines how long results are retained)
- Status queries from the client to check progress
- Retry semantics and failure handling (Q2 2026)

**Relevance to M05:**
This extends the agent loop pattern beyond simple request-response to stateful, long-running workflows. Agents can now issue a task, check its status, and retrieve results asynchronously—critical for production agent systems handling complex operations (data pipelines, batch processing, asynchronous computations).

**Current module coverage:**
The module describes the observation → planning → tool selection → execution → learning loop, but treats it as synchronous. Tasks enable agents to *queue* work and *monitor* progress, making the loop more realistic for enterprise workflows.

**Recommended addition:**
Section on "Advanced Agent Patterns: Tasks and Long-Running Operations"—explain that agents can now handle asynchronous tool calls, reducing latency and enabling better error recovery. Example: an agent submits a bulk data import task, polls for status, and branches logic based on task progress.

---

### 2. Remote MCP Support in Claude Code (June 2025)

**Date/Period:** June 2025
**Source:** [Remote MCP support in Claude Code](https://www.anthropic.com/news/claude-code-remote-mcp) | [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/mcp)

**What it is:**
Claude Code now natively supports remote MCP servers (HTTP-based, not just local stdio). This allows:
- Deploying MCP servers to cloud infrastructure (AWS, GCP, Heroku, etc.)
- Using central tool servers shared across teams
- Integrating third-party SaaS MCP servers without local setup
- Native authentication flow UI for OAuth tokens

**Relevance to M05:**
The module emphasizes "Configuration Scopes: Global, Project, Local" but assumes local stdio-based servers. Remote MCP is now the recommended pattern for production teams, enabling:
- Team-level tool governance (one canonical PostgreSQL server, one GitHub MCP instance)
- Separation of agent clients from tool servers
- Enterprise audit and compliance (centralized logging, access control)

**Current module coverage:**
Mentions configuration scopes but does not distinguish between local and remote transports. The `~/.claude/mcp.json` approach still works but is increasingly paired with remote server URLs.

**Recommended addition:**
Update "Configuration Scopes" section: distinguish **Local Transports** (stdio, simple development) vs. **Remote Transports** (HTTP, production). Add guidance: "For team deployments, prefer remote HTTP-based MCP servers; for local development and iteration, use stdio-based servers."

---

### 3. Code Execution with MCP (November 2025)

**Date/Period:** November 2025
**Source:** [Code execution with MCP: building more efficient AI agents](https://www.anthropic.com/engineering/code-execution-with-mcp)

**What it is:**
Instead of loading all tool definitions into context upfront (consuming ~55K–134K tokens), agents can now:
- Dynamically discover and load tools on-demand via code execution
- Filter data before sending to the LLM (reducing context bloat)
- Execute complex tool orchestration in a single, efficient step

Reduces token consumption from 150,000 to 2,000 tokens (98.7% savings) in real examples.

**Relevance to M05:**
The module teaches the agent loop including "Tool Discovery," but emphasizes static discovery (all tools listed upfront via `/mcp`). Dynamic tool loading is now the efficiency best practice, especially critical when agents connect to 5+ servers.

**Current module coverage:**
"Tool dispatch is the tricky part. The agent must know what tools are available." Current guidance assumes agents load a bounded, curated tool list. The module doesn't address token efficiency of tool definitions.

**Recommended addition:**
Add a "Token Efficiency" subsection under "Tool Dispatch":
"When an agent connects to many MCP servers (5+), tool definitions can consume 100K+ tokens. Consider two strategies:
1. **Static discovery** (current module approach): Load a curated list upfront. Best for teams with <5 tools.
2. **Dynamic discovery**: Have the agent write code to query available tools on-demand. Best for large tool ecosystems. See: Code Execution with MCP (Anthropic, 2025)."

---

### 4. Anthropic's "Building Effective Agents" Framework (2025)

**Date/Period:** January–March 2025
**Source:** [Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents) | [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)

**What it is:**
Anthropic released a comprehensive framework on agentic system design:
- **Core principle**: Build the simplest solution first. Not all problems need agentic loops.
- **Three tiers of augmentation**:
  1. Simple LLM + retrieval (often sufficient)
  2. LLM + tools (agentic for real-world integration)
  3. LLM + tools + memory (for multi-turn reasoning)
- **Common patterns**: Single agent with tools, plan-then-execute, manager (orchestrator) pattern
- **Context engineering**: Curating optimal token usage for long-running agents
- Renamed **Claude Code → Claude Agent SDK** to reflect broader use cases beyond coding

**Relevance to M05:**
This framework operationalizes what M05 teaches but formalizes decision trees for *when* to build agents vs. simpler systems. It also introduces explicit orchestration patterns (manager pattern, plan-then-execute) that go beyond M05's single-agent model.

**Current module coverage:**
M05 assumes agents are always the right solution and teaches core agent loop. It doesn't address the "when not to build agents" question or advanced multi-agent patterns.

**Recommended addition:**
**New section: "When to Build Agents (and When Not To)"**
Summarize Anthropic's decision framework:
- Use simple LLM if: static knowledge, Q&A, classification
- Add tools (agents) if: need real-world action, API integration, dynamic context
- Add memory if: long multi-turn reasoning, learning from failures
- Add orchestration if: multiple specialized agents

Also clarify that M05 focuses on single-agent tool use, which handles 80% of use cases. Multi-agent orchestration is Tier 2 content.

---

### 5. MCP Specification Evolution: Structured Outputs & OAuth (June 2025)

**Date/Period:** June 2025 specification
**Source:** [Specification - Model Context Protocol](https://modelcontextprotocol.io/specification/2025-11-25)

**What it is:**
Two major spec additions in June 2025:
1. **Structured tool outputs**: Tools can now return typed data (JSON schemas) instead of unstructured text, enabling agents to parse and validate results reliably
2. **OAuth-based authorization**: Standardized OAuth 2.0 flows for MCP servers, replacing ad-hoc authentication approaches

**Relevance to M05:**
Module mentions "OAuth 2.0 Authentication" but treats it lightly ("The flow is browser-based. You approve, the token is stored..."). Structured outputs directly support the module's insight: "APIs don't make good MCP tools."—structured outputs make tools more semantic and agent-friendly.

**Current module coverage:**
OAuth is mentioned but not detailed. Structured outputs are not discussed (predates module creation).

**Recommended addition:**
Expand "OAuth 2.0 Authentication" subsection:
"MCP now standardizes OAuth 2.0 via URL-mode elicitation: users are sent to a browser for secure authentication, tokens are stored server-side, and the client never sees credentials. This replaces custom auth schemes and improves security for remote MCP servers."

Add brief section on **Structured Tool Outputs**:
"Tools should return data with explicit schemas (JSON Schema) rather than freeform text. This helps agents reliably parse results and reduces hallucinations. Example: instead of returning 'Database query found 5 users', return `{"type": "query_result", "count": 5, "users": [...]}`."

---

### 6. Remote MCP Security & Best Practices (2025)

**Date/Period:** 2025
**Source:** [Understanding Authorization in MCP](https://modelcontextprotocol.io/docs/tutorials/security/authorization) | [Best Practices for remote MCP bearer token Authentication](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/1247) | [SlowMist MCP Security Checklist](https://github.com/slowmist/MCP-Security-Checklist)

**What it is:**
Remote MCP deployments have surfaced security concerns:
- Man-in-the-Middle (MITM) attacks on HTTP connections
- OAuth token reuse and exposure
- Malicious MCP servers injecting commands during OAuth flows (Cursor CLI vulnerability)
- Need for TLS 1.2+, certificate validation, and secret management best practices

**Relevance to M05:**
The module assumes tools are trustworthy and focuses on discovery/dispatch. In production, especially with remote MCP, agents are vulnerable to supply-chain attacks. An untrusted MCP server can craft responses that inject commands into the agent loop.

**Current module coverage:**
No security considerations. Module presents MCP as a trusted protocol.

**Recommended addition:**
**New section: "MCP Security Considerations for Production"**
- Only connect to MCP servers from trusted sources
- For remote MCP: enforce TLS 1.2+, validate certificates
- Store OAuth tokens in secure vaults, never in source control
- Audit logs: log all tool calls for compliance
- If possible, run remote MCP servers on private networks or VPCs
- See: [SlowMist MCP Security Checklist](https://github.com/slowmist/MCP-Security-Checklist)

---

### 7. Official MCP Registry Maturity & Official Servers (2025–2026)

**Date/Period:** Ongoing
**Source:** [Official MCP Registry](https://registry.modelcontextprotocol.io/) | [GitHub MCP Servers Repo](https://github.com/modelcontextprotocol/servers) | [GitHub's Official MCP Server](https://github.com/github/github-mcp-server)

**What it is:**
The MCP Registry has grown to hundreds of published servers. **Official servers** maintained by Anthropic and partners include:
- **GitHub MCP** (by GitHub Inc.)—read/write issues, PRs, discussions
- **PostgreSQL MCP** (reference implementation)
- **Slack MCP**, **Notion MCP**, **Linear MCP**, **Stripe MCP**, **Shopify MCP**
- **Azure MCP** (Microsoft), **Playwright MCP** (web automation)
- Over 200+ community servers

**Relevance to M05:**
Module references registry and lists examples, but the ecosystem has grown significantly. Official servers provide quality guarantees (maintenance, security patches, semantic design).

**Current module coverage:**
"The MCP Registry (https://registry.mcp.ai) is a curated list..." — URL may be outdated (now registry.modelcontextprotocol.io). List of examples is illustrative but incomplete.

**Recommended addition:**
Update registry URL to [https://registry.modelcontextprotocol.io/](https://registry.modelcontextprotocol.io/) and note: "Look for servers marked 'Official' or 'Maintained by [company]' for production use. Community servers are valuable but may have less stability."

---

### 8. Agentic Loop Improvements & Self-Learning (2025–2026)

**Date/Period:** November 2025 – February 2026
**Source:** [Agentic Auto-Scheduling: An Experimental Study](https://arxiv.org/html/2511.00592v1) | [TOWARDS AGENTIC SELF-LEARNING LLMS (ICLR 2026)](https://www.arxiv.org/pdf/2510.14253v1) | [A-Mem: Agentic Memory for LLM Agents](https://arxiv.org/pdf/2502.12110)

**What it is:**
Recent research advances the agent loop beyond simple observation-plan-execute:
1. **Self-learning loops**: Agents can optimize their own prompts and evaluation criteria in a closed loop (Agentic Self-Learning, ICLR 2026)
2. **Evaluator-optimizer workflows**: One agent generates responses, another evaluates and refines in a loop
3. **Agentic memory systems**: Agents maintain semantic memory repositories that evolve as new information is processed
4. **Multi-agent feedback loops**: Specialized agents (Executor, Evaluator, Modifier) collaborate via feedback

**Relevance to M05:**
The module teaches a basic agent loop. These advances show agents can use loops not just to accomplish tasks but to improve themselves. Relevant for Tier 2 content on scaling and self-improvement.

**Current module coverage:**
Basic loop is accurately described. No mention of self-improvement or multi-agent coordination.

**Recommended addition:**
Add a **"Next Steps: Advanced Agent Patterns"** callout:
"This module covers the core observation-plan-execute-learn loop. Advanced patterns include:
- **Self-learning agents**: Agents can optimize their own tool selection and prompts over time
- **Multi-agent workflows**: Specialized agents collaborate via structured feedback loops
- **Agentic memory**: Agents maintain evolving semantic memories across sessions

See Tier 2: Advanced Agents for depth."

---

### 9. 2026 MCP Roadmap: Transport Scalability & Enterprise Readiness

**Date/Period:** Published January 2026 for Q1–Q3 2026
**Source:** [2026 MCP Roadmap](http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)

**What it is:**
Anthropic and the newly-formed **Agentic AI Foundation** (governing MCP's future) have published roadmap priorities:
1. **Streamable HTTP transport**: Enable stateless, load-balanced remote MCP servers
2. **Task lifecycle management**: Retry semantics, expiry policies for long-running tasks
3. **Enterprise features**: SSO authentication, audit trails, configuration portability, gateway behavior
4. **Registry standardization**: Allow registries to discover server capabilities without connecting

**Relevance to M05:**
Signals that MCP is moving from developer-friendly to enterprise-ready. The roadmap validates M05's focus (configuration, governance, tool curation) while preparing for larger-scale deployments.

**Current module coverage:**
Assumes small team configurations. Doesn't address enterprise scale.

**Recommended addition:**
Brief mention in "Next Steps" or "Further Reading":
"MCP is rapidly evolving toward enterprise deployments. Upcoming priorities include SSO authentication, audit logging, and stateless remote servers for large organizations. Monitor the MCP roadmap for best practices as your team scales."

---

### 10. Tool Use Optimization: Learning to Rewrite Descriptions (2025)

**Date/Period:** 2025
**Source:** [Learning to Rewrite Tool Descriptions for Reliable LLM-Agent Tool Use](https://arxiv.org/html/2602.20426v1)

**What it is:**
New research shows that agent tool selection accuracy improves dramatically (10–30%) by iteratively refining tool descriptions with LLM feedback. Instead of static descriptions, tools should be described in agent-friendly language emphasizing *semantics* (what the tool does logically) over *mechanics* (how the tool works).

**Relevance to M05:**
The module emphasizes "Semantic meaning" over APIs. This research formalizes the optimization: agents perform better when tool descriptions are semantically clear and human-tested.

**Current module coverage:**
"Create MCP wrappers that are task-focused, not API-focused" is good guidance. The module doesn't explain *how* to validate tool descriptions or optimize them.

**Recommended addition:**
Under "Tool Design Best Practices," add:
"Test tool descriptions with agents. If agents struggle to select or use a tool, rewrite the description emphasizing what the tool does (semantics) not how it works (mechanics). Example: instead of 'POST /api/v1/user', write 'Create a new user account with name, email, and tier level. Returns the new user ID.'"

---

## Emerging Best Practices to Consider Adding

### 1. **Simplicity First**
Start with the simplest solution (LLM + retrieval). Only add agentic loops if needed. This aligns with Anthropic's "Building Effective Agents" framework and prevents over-engineering.

### 2. **Dynamic vs. Static Tool Discovery**
For large tool ecosystems (5+ servers), prefer dynamic tool discovery via code execution over upfront tool definitions. Massive token savings (98%+) reported in production.

### 3. **Structured Tool Outputs**
Tools should return data with explicit JSON schemas, not freeform text. This reduces hallucinations and makes tool results agent-friendly.

### 4. **Role-Based Tool Curation**
The module already does this well. Reinforce: "Fewer curated tools > many tools. Assign each role a 2–4 tool stack; add tools only when a real gap emerges."

### 5. **Remote-First for Teams**
For team deployments, default to remote (HTTP-based) MCP servers. Easier governance, audit trails, and shared state compared to local stdio servers.

### 6. **Security by Default**
When connecting to remote MCP servers:
- Use TLS 1.2+
- Validate certificates
- Store secrets in vaults, not git
- Log all tool calls
- Prefer official/maintained servers

### 7. **Iterative Tool Optimization**
Test tool descriptions with agents. Refine based on how well agents use them. "Learn to Rewrite Tool Descriptions" research shows 10–30% accuracy gains.

### 8. **Async Workflows with Tasks**
Use the new Tasks abstraction for long-running operations. Agents can submit a task, check progress, and handle failures gracefully. Reduces latency and improves UX.

---

## Sources Consulted

### MCP Specification & Architecture
- [Model Context Protocol Official Spec](https://modelcontextprotocol.io/)
- [One Year of MCP: November 2025 Spec Release](https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/)
- [2026 MCP Roadmap](http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
- [Specification - Model Context Protocol (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25)
- [Update on the Next MCP Protocol Release](http://blog.modelcontextprotocol.io/posts/2025-09-26-mcp-next-version-update/)
- [Exploring the Future of MCP Transports](https://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/)

### Anthropic Guidance on Agents
- [Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents)
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Code execution with MCP: building more efficient AI agents](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)

### Claude Code / Remote MCP
- [Remote MCP support in Claude Code](https://www.anthropic.com/news/claude-code-remote-mcp)
- [Claude Code MCP Documentation](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)

### MCP Security & Best Practices
- [Understanding Authorization in MCP](https://modelcontextprotocol.io/docs/tutorials/security/authorization)
- [Best Practices for remote MCP bearer token Authentication](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/1247)
- [SlowMist MCP Security Checklist](https://github.com/slowmist/MCP-Security-Checklist)
- [Awesome MCP Security](https://github.com/Puliczek/awesome-mcp-security)

### MCP Servers & Registry
- [Official MCP Registry](https://registry.modelcontextprotocol.io/)
- [GitHub - modelcontextprotocol/servers: Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [GitHub's Official MCP Server](https://github.com/github/github-mcp-server)

### Agentic Loops & Agent Architecture Research
- [Agentic Auto-Scheduling: An Experimental Study of LLM-Guided Loop Optimization](https://arxiv.org/html/2511.00592v1)
- [TOWARDS AGENTIC SELF-LEARNING LLMS (ICLR 2026)](https://www.arxiv.org/pdf/2510.14253v1)
- [A-Mem: Agentic Memory for LLM Agents](https://arxiv.org/pdf/2502.12110)
- [A Multi-AI Agent System for Autonomous Optimization](https://arxiv.org/abs/2412.17149)
- [A Survey of Agentic AI and Cybersecurity](https://arxiv.org/html/2601.05293v1)

### Tool Use Patterns & Best Practices
- [A practical guide to building agents (OpenAI)](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)
- [Design Patterns for Securing LLM Agents against Prompt Injections](https://arxiv.org/html/2506.08837v2)
- [Utility-Guided Agent Orchestration for Efficient LLM Tool Use](https://arxiv.org/html/2603.19896)
- [Architecting Resilient LLM Agents](https://arxiv.org/pdf/2509.08646)
- [Learning to Rewrite Tool Descriptions for Reliable LLM-Agent Tool Use](https://arxiv.org/html/2602.20426v1)
- [Designing LLM-based Multi-Agent Systems for Software Engineering Tasks](https://arxiv.org/html/2511.08475v2)

### MCP Framework & Workflow Implementations
- [mcp-agent: Lightweight MCP Agent Framework](https://github.com/lastmile-ai/mcp-agent)
- [Asynchronous MCP Agent Mail](https://github.com/Dicklesworthstone/mcp_agent_mail)
- [TaskQueue MCP](https://github.com/chriscarrollsmith/taskqueue-mcp)

### Foundation Governance
- [Donating the Model Context Protocol and establishing the Agentic AI Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)

---

## Recommendations for Module Updates

**Priority 1 (Add immediately):**
1. Update MCP Registry URL to registry.modelcontextprotocol.io
2. Add section on Remote MCP for team deployments
3. Clarify static vs. dynamic tool discovery for token efficiency
4. Add "MCP Security Considerations for Production" subsection

**Priority 2 (Enhance understanding):**
1. Expand OAuth section with URL-mode elicitation details
2. Add brief section on Tasks abstraction for long-running operations
3. Include "When to Build Agents" decision framework from Anthropic
4. Provide tool description optimization guidance

**Priority 3 (Forward-looking):**
1. Add callout to 2026 MCP roadmap (enterprise features coming)
2. Reference advanced patterns (self-learning, multi-agent) for Tier 2
3. Include emerging best practices on structured outputs

These updates will keep M05 current while maintaining focus on foundational concepts.
