# M07 More Info: Recent Developments & Updates

**Last Updated:** March 28, 2026
**Module Audited:** M07 — Advanced Workflows (Skills, Subagents, and Hooks)

---

## Summary

M07 covers Claude Code's composition stack (CLAUDE.md → Skills → Subagents → Hooks → MCP → Plugins → Agent Teams). Since mid-2024, the agent orchestration landscape has evolved dramatically with major developments in:

1. **Multi-agent orchestration frameworks** achieving production readiness (LangGraph Platform GA, Microsoft Agent Framework, CrewAI enterprise adoption)
2. **Interoperability protocols** becoming industry standards (MCP adoption across OpenAI/Google/Microsoft, A2A protocol introduction)
3. **Workflow reliability** emerging as a distinct research area (SHIELDA, Sherlock, structured error recovery)
4. **Parallel agent execution** becoming a first-class pattern across major platforms
5. **Flow engineering** overtaking prompt engineering as the highest-leverage discipline
6. **Claude Code's multi-agent capabilities** expanding with parallel subagent support and Agent Teams

The module provides solid foundational concepts but omits several critical 2024-2025 developments relevant to production workflows.

---

## New Developments Relevant to M07

### 1. Model Context Protocol (MCP) as Industry Standard

**Date/Period:** November 2024 (launch) → November 2025 (major updates)

**Source:**
- [Anthropic: Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [The New Stack: Why the Model Context Protocol Won](https://thenewstack.io/why-the-model-context-protocol-won/)
- [Model Context Protocol Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)

**What it is:**
MCP is an open, vendor-neutral standard for connecting AI assistants to data systems, tools, and APIs through a single unified interface. Anthropic released it as a solution to the "N×M data integration problem"—requiring custom integrations between every LLM and every data source. MCP acts as "USB-C for AI applications."

**Why it matters for M07:**
The module mentions MCP as one layer in the composition stack but does not discuss:
- MCP as the **primary mechanism** for integrating external tools beyond Claude Code's built-in MCP support
- Cross-platform standardization implications (OpenAI adopted MCP in March 2025, Google DeepMind in April 2025)
- Pre-built MCP servers (Google Drive, Slack, GitHub, Git, Postgres, Puppeteer) that teams can reuse
- MCP's evolution with async operations, server identity, and community registry (November 2025)

**Current module coverage:**
M07 lists MCP in the composition stack (lines 40-41) but provides no implementation guidance or best practices for when/how to use MCP vs. direct tool integration.

**Recommended addition:**
Add a subsection: *"MCP in Your Composition Stack"*
- When to use pre-built vs. custom MCP servers
- How MCP servers differ from Skills and Subagents in terms of scope and reusability
- Example: "If your team uses Google Drive, Slack, and GitHub, MCP servers let you standardize tool access across all Claude Code sessions without writing custom integrations."
- Link to https://modelcontextprotocol.io/specification/2025-11-25 for server configuration

---

### 2. Claude Code Agent Teams & Parallel Subagent Execution

**Date/Period:** 2025–2026 (ongoing feature expansion)

**Source:**
- [Claude Code Docs: Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Sub-Agents: Parallel vs Sequential Patterns](https://claudefa.st/blog/guide/agents/sub-agent-best-practices)
- [Claude Code Agent Teams: The Complete Guide 2026](https://claudefa.st/blog/guide/agents/agent-teams)
- [VS Code Blog: Your Home for Multi-Agent Development](https://code.visualstudio.com/blogs/2026/02/05/multi-agent-development)

**What it is:**
Claude Code now supports:
- **Subagents as parallel executors**: Multiple specialized Claude instances can run in parallel, each with its own context window, tackling different aspects of a task simultaneously.
- **Agent Teams**: A new abstraction layer above subagents where agents can share findings, challenge each other, and coordinate autonomously without the parent agent as intermediary.
- **Context isolation**: Each subagent runs in its own fresh session; only final messages return to the parent.

**Why it matters for M07:**
The module teaches subagents as sequential, isolated workers reporting back (Pattern C, lines 98–115). The 2025–2026 evolution introduces:
- **Parallel execution patterns**: Fan-out/fan-in, scatter-gather, map-reduce architectures now first-class
- **Persistent agent definitions**: Subagents defined in `.claude/agents/` YAML are automatically discoverable by the orchestrator
- **Agent Teams vs. Subagents distinction**: Agent Teams enable peer-to-peer communication, fundamentally different from the sequential subagent pattern shown in M07

**Current module coverage:**
M07 covers subagent basics and Pattern C (markdown + subagents) but:
- Does not mention parallel execution
- Treats subagents as sequential report-back workers
- Does not distinguish between Subagents and Agent Teams
- Shows no examples of persistent agent definitions in `.claude/agents/`

**Recommended addition:**
Expand the Subagents section (lines 143–180) with:
1. **Parallel vs. Sequential Trade-offs:**
   - Sequential: Full control, lower token cost, predictable latency
   - Parallel: Faster for independent work, higher token cost, use when domains don't overlap
2. **New Pattern D: Persistent Agents (`.claude/agents/`)**
   ```yaml
   ---
   name: qa-specialist
   description: Quality assurance reviewer
   model: claude-opus-4-1
   tools: [analyze_ast, run_tests]
   ---
   You are a QA specialist...
   ```
3. **When to use Agent Teams** (peer coordination) vs. Subagents (report-back pattern)

---

### 3. Agent-to-Agent (A2A) Protocol & Multi-Agent Interoperability

**Date/Period:** 2024–2025 (emerging standard)

**Source:**
- [Google Developers Blog: Announcing the Agent2Agent Protocol](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [AWS Open Source: Inter-Agent Communication on A2A](https://aws.amazon.com/blogs/opensource/open-protocols-for-agent-interoperability-part-4-inter-agent-communication-on-a2a/)
- [arXiv: A Survey of Agent Interoperability Protocols](https://arxiv.org/html/2505.02279v1)
- [IBM: What Is Agent2Agent (A2A) Protocol?](https://www.ibm.com/think/topics/agent2agent-protocol)

**What it is:**
A2A is a vendor-neutral, standardized protocol for agents to:
- Discover each other via "Agent Cards" detailing capabilities
- Delegate tasks securely to peer agents
- Coordinate complex workflows with structured, secure communication
- Use JSON-RPC 2.0 over HTTP(S) with support for sync/async/streaming interactions

**Why it matters for M07:**
M07 focuses on orchestration *within* Claude Code (CLAUDE.md, Skills, Subagents, Hooks). A2A represents the next frontier:
- **Cross-agent communication**: Agents built in different frameworks (Claude, OpenAI, Microsoft) can now communicate
- **Protocol stacking**: MCP + A2A together create a complete agentic OS (MCP for tools/data, A2A for agent-to-agent)
- **Enterprise coordination**: Enables multi-organization, multi-team agent collaboration

**Current module coverage:**
M07 does not mention A2A or agent-to-agent communication protocols. The Agent Teams concept (peer-to-peer) is a *local* version; A2A is the *distributed* version.

**Recommended addition:**
Add a new section: *"Beyond Claude Code: A2A and Distributed Agent Networks"*
- Clarify that M07's composition stack is **Claude Code-centric**
- Note that A2A enables **cross-platform agent coordination**
- Provide a decision matrix: "When do you stay within Claude Code vs. adopt A2A?"
  - Same team, same org → Agent Teams (Claude Code)
  - Different teams, different orgs → A2A (distributed)

---

### 4. LangGraph Platform GA & Multi-Agent Orchestration Frameworks

**Date/Period:** 2025 (LangGraph Platform GA)

**Source:**
- [LangChain: LangGraph Agent Orchestration Framework](https://www.langchain.com/langgraph)
- [Latenode: LangGraph Multi-Agent Orchestration 2025](https://latenode.com/blog/ai-frameworks-technical-infrastructure/langgraph-multi-agent-orchestration/langgraph-multi-agent-orchestration-complete-framework-guide-architecture-analysis-2025)
- [Towards AI: Mastering AI Agent Systems with LangGraph in 2025](https://pub.towardsai.net/from-single-brains-to-team-intelligence-mastering-ai-agent-systems-with-langgraph-in-2025-3520af4fc758)
- [LangChain Blog: How and when to build multi-agent systems](https://blog.langchain.com/how-and-when-to-build-multi-agent-systems/)

**What it is:**
LangGraph is a **graph-based orchestration runtime** for agents that models workflows as directed acyclic graphs (DAGs). In 2025:
- LangGraph Platform became Generally Available as a deployment & management platform
- LangGraph Pre-Builts were introduced (Swarm, Supervisor, tool-calling agent templates)
- LangGraph Studio v2 ships locally with visualization, debugging, and prompt editing in UI

**Why it matters for M07:**
M07 uses a **linear composition stack** metaphor (CLAUDE.md → Skills → Subagents → Hooks → MCP → Plugins → Agent Teams). LangGraph introduced:
- **Graph-first thinking**: Conditional branching, loops, and dynamic graph mutation
- **Explicit state management**: Shared state across all nodes, not just sequential report-back
- **Low-level control**: No hidden prompts, no enforced "cognitive architectures"

**Current module coverage:**
M07 does not mention LangGraph or comparable graph-based frameworks. The composition stack is **linear/hierarchical**, while LangGraph is **graph-based**.

**Recommended addition:**
Add a decision framework: *"Claude Code Composition Stack vs. LangGraph Orchestration"*
| Aspect | Claude Code | LangGraph |
|--------|-----------|-----------|
| Abstraction Level | High (Hooks, Skills, Agents) | Low (Nodes, Edges, State) |
| Workflow Model | Linear composition | Graph (DAG) with conditionals |
| Deployment | Built-in (Claude Code) | Separate platform (LangGraph Platform) |
| Best For | Team workflows, repeatable patterns | Complex logic, custom routing, research |

Example: "Use Claude Code's composition stack for your team's repeatable skill library. Use LangGraph if you need conditional branching or complex agent reasoning flow."

---

### 5. CrewAI Enterprise Adoption & Role-Based Orchestration

**Date/Period:** 2024–2025 (enterprise traction)

**Source:**
- [CrewAI: The Leading Multi-Agent Platform](https://crewai.com/)
- [CrewAI GitHub](https://github.com/crewAIInc/crewAI)
- [Best AI Agent Frameworks 2025](https://www.getmaxim.ai/articles/top-5-ai-agent-frameworks-in-2025-a-practical-guide-for-ai-builders/)
- [The 2026 AI Agent Framework Decision Guide](https://dev.to/linou518/the-2026-ai-agent-framework-decision-guide-langgraph-vs-crewai-vs-pydantic-ai-b2h)

**What it is:**
CrewAI is a high-level framework emphasizing **role-based agent orchestration**:
- Agents defined with explicit roles (researcher, writer, reviewer)
- Tasks assigned to agents with output constraints
- Flows provide event-driven, granular control (12M+ executions/day as of 2025)
- Series A funding ($18M), 150+ enterprise customers, 60% Fortune 500 adoption

**Why it matters for M07:**
M07's Pattern C (subagents with specialized roles) is conceptually similar to CrewAI's crew model. However:
- **CrewAI prioritizes role definitions**: Agents have explicit Role, Expertise, Goals
- **Task-centric model**: Work is decomposed as Tasks assigned to Crews, not Skills
- **Faster shipping**: Teams report 2-week production agents in CrewAI vs. 2-month with LangGraph

**Current module coverage:**
M07 does not mention CrewAI. The module's subagent model is less formalized than CrewAI's role/task abstraction.

**Recommended addition:**
Add a comparative section: *"Pattern C Deep Dive: Subagent Specialization Models"*
- Show how Claude Code's Pattern C (specialized subagent) maps to CrewAI's Crew/Role model
- Discuss role-based prompting: explicit expertise, goals, constraints
- Note: CrewAI is a **separate framework** but M07 readers may encounter it in real teams

---

### 6. Workflow Reliability & Error Recovery Frameworks (SHIELDA, Sherlock)

**Date/Period:** 2024–2025 (emerging research/production tooling)

**Source:**
- [arXiv: SHIELDA: Structured Handling of Exceptions in LLM-Driven Agentic Workflows](https://arxiv.org/pdf/2508.07935)
- [arXiv: Sherlock: Reliable and Efficient Agentic Workflow Execution](https://arxiv.org/pdf/2511.00330)
- [GoCodeo: Error Recovery and Fallback Strategies in AI Agent Development](https://www.gocodeo.com/post/error-recovery-and-fallback-strategies-in-ai-agent-development)
- [Accel Data: How Agentic Data Systems Automate Pipeline Reliability](https://www.acceldata.io/blog/automating-pipeline-reliability-with-agentic-data-systems)

**What it is:**
Two frameworks addressing agent reliability:
1. **SHIELDA**: Structured exception handling for LLM workflows covering schema validation, semantic misalignment, invalid reasoning
2. **Sherlock**: Cost-efficient, reliable workflow execution via selective verification and speculative execution

**Why it matters for M07:**
M07's hooks (lines 182–217) provide deterministic lifecycle scripts (PreToolUse, PostToolUse, Notification, Stop) but do not address:
- **Structured error recovery**: Which tool failures warrant retry vs. escalation?
- **Semantic validation**: Checking agent output for consistency, not just syntactic validity
- **Cost optimization**: How to verify agent work without running every step twice
- **Policy-based recovery**: Autonomous decisions about fallback paths (e.g., quarantine bad data vs. retry)

**Current module coverage:**
M07 shows hooks for "auto-linting" and "notifications" (lines 195–209) but provides no patterns for error handling, retry logic, or semantic validation.

**Recommended addition:**
Add a new section: *"Hooks for Reliability: Error Recovery and Validation"*
```bash
# .claude/hooks/post_tool_use.sh
#!/bin/bash

# Example: Semantic validation hook
if [[ "$TOOL_NAME" == "generate_code" ]]; then
  # Validate syntax
  node --check "$TOOL_OUTPUT" || {
    echo "Syntax error in generated code; retrying with constraints"
    # Trigger retry with additional guardrails
    exit 1
  }
fi

# Example: Intelligent retry logic
if [[ "$TOOL_NAME" == "deploy_service" ]]; then
  if grep -q "timeout\|connection refused" <<< "$TOOL_OUTPUT"; then
    echo "Temporary failure; retrying with exponential backoff"
    sleep $((RANDOM % 5 + 1))
    exit 2  # Signal retry
  fi
fi
```
**Best practices:**
- Use PostToolUse hooks to validate **semantic correctness** (not just syntax)
- Implement **capped exponential backoff** for dependency failures
- Log retry counts and failure reasons for observability
- Use policies for **autonomous recovery decisions** (quarantine vs. retry)

---

### 7. Parallel Agent Execution Patterns & Orchestration Strategies

**Date/Period:** 2025 (major focus in OpenAI Agents SDK, Microsoft Agent Framework)

**Source:**
- [Microsoft Learn: AI Agent Orchestration Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [Kore.ai: Choosing the right orchestration pattern for multi-agent systems](https://www.kore.ai/blog/choosing-the-right-orchestration-pattern-for-multi-agent-systems)
- [NexAI Tech: AI Agent Architecture Patterns in 2025](https://nexaitech.com/multi-ai-agent-architecutre-patterns-for-scale/)
- [DEV Community: Multi-Agent Orchestration Running 10+ Claude Instances in Parallel](https://dev.to/bredmond1019/multi-agent-orchestration-running-10-claude-instances-in-parallel-part-3-29da)

**What it is:**
Parallel orchestration patterns enable multiple agents to work on independent or complementary tasks simultaneously:
- **Fan-out/Fan-in (Scatter-Gather)**: Dispatch to multiple agents, collect and synthesize results
- **Parallel Redundancy**: Run same task on multiple agents, pick best result (e.g., Cursor 2.0's 8-agent approach)
- **Domain-based Routing**: Spawn parallel agents for frontend/backend/database work independently

**Why it matters for M07:**
M07's composition stack is implicit about **concurrency**. The module mentions:
- Subagents (lines 38, 143–180) as "isolated workers"
- Agent Teams (line 42) as "coordinated parallel sessions"

But does not provide:
- **When to parallelize** vs. when to serialize
- **Trade-offs**: Latency (good) vs. token cost (4–15× higher for multi-agent)
- **Practical patterns**: Which workflow shapes benefit most from parallelism?

**Current module coverage:**
M07 lists Agent Teams as "coordinated parallel sessions" (line 42) but provides no guidance on patterns, trade-offs, or when to use them.

**Recommended addition:**
Add a section: *"Parallelism Trade-offs in Your Composition Stack"*

**When to parallelize:**
- Independent domains (security review + code quality check simultaneously)
- High-value tasks (justify 4–15× token cost)
- Time-sensitive work (latency matters more than cost)

**When to serialize:**
- Sequential dependencies (output of task A feeds task B)
- Cost-sensitive work (token budget is tight)
- Simple tasks (parallelism overhead not worth it)

**Example pattern:**
```yaml
# .claude/agents/parallel-reviewer.md
---
name: parallel-reviewer
description: Orchestrate parallel security + quality reviews
---

# Parallel Reviewer Workflow
@security-reviewer: Review this code for vulnerabilities (SQL injection, XSS, auth bypass)
@quality-reviewer: Review this code for maintainability (complexity, duplication, tests)

Synthesize findings: Critical issues first, then recommendations.
```

---

### 8. Agentic Design Patterns: From Prompt Engineering to Flow Engineering

**Date/Period:** 2025–2026 (paradigm shift)

**Source:**
- [VentureBeat: Agentic design patterns: The missing link between AI demos and enterprise value](https://venturebeat.com/infrastructure/agentic-design-patterns-the-missing-link-between-ai-demos-and-enterprise/)
- [Towards AI: Agentic Design Patterns You Must Know in 2025](https://towardsai.net/p/machine-learning/agentic-design-patterns-you-must-know-in-2025)
- [Analytics Vidhya: How to Pick the PERFECT Agentic Design Pattern for Your Task](https://www.analyticsvidhya.com/blog/2025/06/agentic-design-pattern-for-your-task/)
- [Medium: Agentic AI Design Patterns (2022–2025)](https://medium.com/@balarampanda.ai/agentic-ai-design-patterns-choosing-the-right-multimodal-multi-agent-architecture-2022-2025-046a37eb6dbe)

**What it is:**
A fundamental shift in how teams approach agent development:
- **Prompt Engineering (2023–2024)**: Tuning instruction text for better outputs
- **Flow Engineering (2025–2026)**: Designing control flow, state transitions, decision boundaries around LLM calls
- Key patterns: Reflection, Routing, Communication, Guardrails, Memory

**Why it matters for M07:**
M07 teaches the **composition stack** (Skills, Subagents, Hooks, etc.) but frames each layer as a reusable **component**, not as part of a **workflow architecture pattern**. The industry shift means:
- Teams are moving from "write a good skill" → "design a reliable workflow"
- Flow (how components connect) now matters more than individual components
- M07's three skill patterns (A/B/C) are useful but insufficient for production systems

**Current module coverage:**
M07 provides patterns for building skills and subagents but does not frame the composition stack in terms of **flow engineering**. The closest is the "Consolidation Stack" concept (line 246), but it's treated as a layering taxonomy, not as a design patterns taxonomy.

**Recommended addition:**
Reframe M07 with a new section: *"Beyond Components: Flow Engineering Your Workflows"*

**Key insight:**
- Components (Skills, Subagents): WHAT gets built
- Flow patterns (Reflection, Routing, Guardrails): HOW components work together

**Five high-impact flow patterns:**
1. **Reflection**: Generate output → Critique → Refine (use hook + subagent)
2. **Routing**: Route requests to specialized agents based on intent
3. **Communication**: Explicit message passing between agents (Agent Teams)
4. **Guardrails**: Validate outputs before returning to user
5. **Memory**: Maintain state across sessions (long-term context)

Example: A "Code Review Flow" might chain:
```
Input → Route to domain agent → Generate review → Reflection subagent critiques → Guardrail validates → Return to user
```

This is beyond M07's current model.

---

### 9. State Management & Context Engineering in Long-Running Agents

**Date/Period:** 2024–2025 (Microsoft Foundry Agent Service, context engineering emerging as discipline)

**Source:**
- [Microsoft Learn: State Management in Agent Framework](https://learn.microsoft.com/en-us/agent-framework/workflows/state)
- [InfoQ: Microsoft Foundry Agent Service with Long-Term Memory Preview](https://www.infoq.com/news/2025/12/foundry-agent-memory-preview/)
- [Vellum: How to Build Multi Agent AI Systems With Context Engineering](https://vellum.ai/blog/multi-agent-systems-building-with-context-engineering)
- [JetBrains Research: Smarter Context Management for LLM-Powered Agents](https://blog.jetbrains.com/research/2025/12/efficient-context-management/)

**What it is:**
Strategies for maintaining agent state and managing context windows in long-running systems:
- **Stateless by default**: Agents receive only what they need for the current turn
- **Context strategies**: Write (save outside context), Select (RAG), Compress (summarize), Isolate (separate windows)
- **Long-term memory**: Microsoft Foundry auto-extracts, consolidates, and retrieves user context
- **Observation masking**: Outperforms LLM summarization, cuts memory costs 50%+

**Why it matters for M07:**
M07 mentions subagents as "isolated workers with independent state" (line 38) but does not address:
- **Context reuse across subagents**: If subagent A discovers important context, how does subagent B access it?
- **Long-running workflows**: M07 assumes single-session workflows; what about multi-day orchestrations?
- **Token efficiency**: How to manage context in Hooks without exploding token count?

**Current module coverage:**
M07 does not address state management or context engineering. Subagents are treated as **stateless** workers.

**Recommended addition:**
Add a section: *"State and Context in Multi-Subagent Workflows"*

**Best practice:**
```yaml
# .claude/agents/coordinator.md
---
name: coordinator
description: Orchestrate subagents while managing shared state
tools: [context_store, context_retrieve]
---

# Multi-Subagent Coordinator with State Management

## Workflow:
1. [Write context] Store research findings in shared context
2. [Isolate] Assign each subagent a focused window + pointers to shared context
3. [Retrieve] Fetch only relevant prior findings (RAG)

## Example:
User asks: "Compare API designs of FastAPI and Flask"
- @framework_researcher: Research FastAPI (stores findings in context_store)
- @framework_researcher: Research Flask (retrieves FastAPI findings, compares)
```

---

### 10. Anthropic's Multi-Agent Research System Architecture

**Date/Period:** June 2025 (published)

**Source:**
- [Anthropic: How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Simon Willison: Anthropic's Multi-Agent System](https://simonwillison.net/2025/Jun/14/multi-agent-research-system/)
- [ZenML: Building a Multi-Agent Research System for Complex Information Tasks](https://www.zenml.io/llmops-database/building-a-multi-agent-research-system-for-complex-information-tasks)

**What it is:**
Anthropic published its internal multi-agent architecture used for research:
- **Lead + specialist model**: Lead agent (Claude Opus 4) orchestrates; specialists (Claude Sonnet 4) work in parallel
- **Performance**: 90.2% improvement on internal research evaluations vs. single-agent Opus
- **Trade-off**: 15× token cost of single-agent chat; requires high-value tasks to justify

**Why it matters for M07:**
This is Anthropic's **own multi-agent pattern**, providing a reference implementation. M07 teaches generic composition patterns; this shows how Anthropic applies them:
- Lead/specialist is a **specialization of Agent Teams**
- Parallel execution of specialists is **the fan-out/fan-in pattern**
- Works best for research, analysis, complex reasoning (not transactional workflows)

**Current module coverage:**
M07 does not reference Anthropic's own multi-agent architecture. No case study or reference implementation.

**Recommended addition:**
Add a case study section: *"Anthropic's Lead-Specialist Pattern: A Reference Implementation"*

**Architecture:**
```
Lead Agent (Orchestrator)
├── Breaks down query into sub-questions
├── Plans investigation paths
└── Delegates to specialists in parallel

Specialist Agents (Independent Sessions)
├── Search + reason independently
├── Cite sources
└── Return findings to lead

Lead Agent (Synthesis)
├── Reconcile findings
├── Answer original query
└── Provide unified citations
```

**When to use:**
- Research, analysis, reasoning-heavy tasks
- High-value work (justifies 15× token cost)
- Complex questions requiring multiple perspectives

**Token cost vs. quality trade-off:**
- Single Opus: Baseline cost, moderate quality
- Multi-agent (Opus + Sonnet): 15× cost, 90% better quality
- Use when value > 15× base cost

---

## Emerging Best Practices to Consider Adding

### 1. **Flow-First Thinking Over Component-First Thinking**
M07 emphasizes components (Skills, Subagents, Hooks). Modern practice emphasizes **how these components flow together** (Reflection, Routing, Guardrails). Reframing M07 around flow patterns would help teams design more reliable, maintainable workflows.

### 2. **Explicit Reliability Layers in Hooks**
Current examples (lines 195–209) show auto-linting and notifications. Add **semantic validation** and **intelligent retry patterns** as first-class hook use cases. Error recovery is no longer optional in production agents.

### 3. **Context Engineering as a Design Discipline**
Teams building long-running or high-throughput agents need guidance on managing context windows (RAG retrieval, observation masking, state isolation). This is absent from M07 but critical for production.

### 4. **Parallel Execution Trade-off Analysis**
Agent Teams (line 42) enable parallelism, but M07 provides no guidance on when to parallelize vs. serialize. A simple decision matrix would be valuable:
- Parallelize if: Independent work, high-value, latency matters
- Serialize if: Sequential deps, cost-sensitive, simple tasks

### 5. **MCP Server Configuration and Reuse**
M07 lists MCP in the stack but does not explain how to leverage pre-built MCP servers (Google Drive, Slack, GitHub) to avoid custom integration work. This is a high-ROI addition.

### 6. **Agent Persona Specification for Subagents**
CrewAI and Microsoft's frameworks emphasize role/expertise/goals specifications for agents. M07's subagent examples are minimal. More explicit role definition would improve clarity and reduce trial-and-error in practice.

### 7. **Observability and Debugging Hooks**
Modern agents need visibility into:
- Which subagent made which decision
- Token usage per subagent
- Tool call sequences and failures
- State transitions in multi-agent workflows

M07 does not address observability; a section on hooks for logging/metrics would be valuable.

### 8. **Skill vs. Subagent Decision Criteria**
M07 shows Patterns A/B/C but does not clearly explain *when to stop using Skills and start using Subagents*. A decision tree would help:
- Use Skill if: Reusable instructions, simple validation
- Use Subagent if: Specialized reasoning, domain knowledge, isolation needed

---

## Sources Consulted

### Frameworks & Platforms
- [LangChain: LangGraph Agent Orchestration Framework](https://www.langchain.com/langgraph)
- [Latenode: LangGraph Multi-Agent Orchestration 2025](https://latenode.com/blog/ai-frameworks-technical-infrastructure/langgraph-multi-agent-orchestration/langgraph-multi-agent-orchestration-complete-framework-guide-architecture-analysis-2025)
- [CrewAI: The Leading Multi-Agent Platform](https://crewai.com/)
- [Microsoft Learn: Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/)
- [Microsoft Learn: AI Agent Orchestration Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)

### Anthropic & Claude Code
- [Anthropic: How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Claude Code Docs: Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Sub-Agents: Parallel vs Sequential Patterns](https://claudefa.st/blog/guide/agents/sub-agent-best-practices)
- [Claude Code Agent Teams: The Complete Guide 2026](https://claudefa.st/blog/guide/agents/agent-teams)
- [VS Code Blog: Your Home for Multi-Agent Development](https://code.visualstudio.com/blogs/2026/02/05/multi-agent-development)

### Protocols & Interoperability
- [Anthropic: Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [Model Context Protocol Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- [The New Stack: Why the Model Context Protocol Won](https://thenewstack.io/why-the-model-context-protocol-won/)
- [Google Developers Blog: Announcing the Agent2Agent Protocol](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [AWS Open Source: Inter-Agent Communication on A2A](https://aws.amazon.com/blogs/opensource/open-protocols-for-agent-interoperability-part-4-inter-agent-communication-on-a2a/)
- [arXiv: A Survey of Agent Interoperability Protocols](https://arxiv.org/html/2505.02279v1)

### Reliability & Error Recovery
- [arXiv: SHIELDA: Structured Handling of Exceptions in LLM-Driven Agentic Workflows](https://arxiv.org/pdf/2508.07935)
- [arXiv: Sherlock: Reliable and Efficient Agentic Workflow Execution](https://arxiv.org/pdf/2511.00330)
- [GoCodeo: Error Recovery and Fallback Strategies in AI Agent Development](https://www.gocodeo.com/post/error-recovery-and-fallback-strategies-in-ai-agent-development)
- [Accel Data: How Agentic Data Systems Automate Pipeline Reliability](https://www.acceldata.io/blog/automating-pipeline-reliability-with-agentic-data-systems)

### Design Patterns & Flow Engineering
- [VentureBeat: Agentic design patterns: The missing link between AI demos and enterprise value](https://venturebeat.com/infrastructure/agentic-design-patterns-the-missing-link-between-ai-demos-and-enterprise/)
- [Towards AI: Agentic Design Patterns You Must Know in 2025](https://towardsai.net/p/machine-learning/agentic-design-patterns-you-must-know-in-2025)
- [Analytics Vidhya: How to Pick the PERFECT Agentic Design Pattern for Your Task](https://www.analyticsvidhya.com/blog/2025/06/agentic-design-pattern-for-your-task/)
- [Medium: Agentic AI Design Patterns (2022–2025)](https://medium.com/@balarampanda.ai/agentic-ai-design-patterns-choosing-the-right-multimodal-multi-agent-architecture-2022-2025-046a37eb6dbe)

### State & Context Management
- [Microsoft Learn: State Management in Agent Framework](https://learn.microsoft.com/en-us/agent-framework/workflows/state)
- [InfoQ: Microsoft Foundry Agent Service with Long-Term Memory Preview](https://www.infoq.com/news/2025/12/foundry-agent-memory-preview/)
- [Vellum: How to Build Multi Agent AI Systems With Context Engineering](https://vellum.ai/blog/multi-agent-systems-building-with-context-engineering)
- [JetBrains Research: Smarter Context Management for LLM-Powered Agents](https://blog.jetbrains.com/research/2025/12/efficient-context-management/)

### Related Research & Analysis
- [Simon Willison: Anthropic's Multi-Agent System](https://simonwillison.net/2025/Jun/14/multi-agent-research-system/)
- [DEV Community: Multi-Agent Orchestration Running 10+ Claude Instances in Parallel](https://dev.to/bredmond1019/multi-agent-orchestration-running-10-claude-instances-in-parallel-part-3-29da)
- [Kore.ai: Choosing the right orchestration pattern for multi-agent systems](https://www.kore.ai/blog/choosing-the-right-orchestration-pattern-for-multi-agent-systems)
- [NexAI Tech: AI Agent Architecture Patterns in 2025](https://nexaitech.com/multi-ai-agent-architecutre-patterns-for-scale/)
- [The 2026 AI Agent Framework Decision Guide](https://dev.to/linou518/the-2026-ai-agent-framework-decision-guide-langgraph-vs-crewai-vs-pydantic-ai-b2h)

---

## Recommendations for Module Updates

### Priority 1 (High Impact, Core to M07)
1. **Expand Agent Teams coverage** with parallel execution patterns and trade-off analysis
2. **Add MCP best practices** for when/how to use pre-built servers
3. **Introduce flow engineering** as the organizing principle (beyond component stacking)

### Priority 2 (Important, Emerging)
4. **Add reliability patterns to Hooks** (semantic validation, intelligent retry, structured error recovery)
5. **Include state management guidance** for multi-subagent workflows
6. **Provide decision criteria** for Skill vs. Subagent vs. Agent Teams

### Priority 3 (Context, Nice-to-Have)
7. **Reference Anthropic's multi-agent research system** as a case study
8. **Mention A2A protocol** for distributed agent networks beyond Claude Code
9. **Add observability and debugging** patterns for production agents

---

**End of Research Report**
