# M03 More Info: Recent Developments & Updates

## Summary

Since mid-2024, spec-driven development with AI agents has evolved from an emerging concept to an industry-standard practice with formalized tooling, architectural patterns, and methodologies. Anthropic's September 2025 publications on context engineering and Claude Sonnet 4.5's memory system (CLAUDE.md) have deepened the connection between specification clarity and agent execution reliability. GitHub's September 2025 release of Spec-Kit and the broader adoption of spec-first workflows across tools (Kiro, Tessl, OpenSpec) represent a paradigm crystallization—organizations now treat specifications as executable contracts rather than documentation artifacts. Additionally, structured outputs via JSON schema grammar and Anthropic's formal definition of context engineering patterns provide new technical machinery to enforce spec compliance. The module's core thesis remains sound and increasingly validated, but requires three significant additions: (1) integration of formal context engineering principles beyond Plan Mode, (2) the CLAUDE.md memory pattern as a scalable spec storage mechanism, and (3) acknowledgment of structured outputs as a specification-enforcement tool at the API layer.

---

## New Developments Relevant to M03

### Spec-Driven Development as Industry Practice (2025 Crystallization)
**Date/Period:** July–September 2025
**Source:** [Thoughtworks – Spec-driven development unpacking 2025's key engineering practices](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices), [The New Stack – Spec-Driven Development: The Key to Scalable AI Agents](https://thenewstack.io/spec-driven-development-the-key-to-scalable-ai-agents/), [Martin Fowler – Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)

**What it is:**
Spec-driven development is now recognized as a formal practice: specifications precede code, serve as contracts for AI agents and human engineers, and form the durable source of truth. Major tooling emerged in Q3 2025: GitHub Spec-Kit (September), AWS Kiro (July), Tessl, and OpenSpec all operationalize the same workflow: Constitution → Specification → Design → Tasks.

**Relevance to M03:**
M03 introduces specs as source code and Plan Mode as the interactive tool, but the research shows this is now embedded in broader ecosystem practices and formalized in production tools. The module's core claim—that specs, not code, are the durable artifact—is now validated at scale.

**Current module coverage:**
The module teaches the reasoning and Plan Mode workflow but does not mention the emerging toolkit ecosystem (Spec-Kit, Kiro) or the formal "Constitution" (high-level immutable principles) that GitHub and others now use as the foundation for specs.

**Recommended addition:**
Add a section under "Plan Mode: The Tool for Specs" noting that Spec-Kit and similar tools operationalize the same spec-first philosophy. Brief mention that orgs now often define a Constitution (team principles, non-negotiable constraints) before specs to ensure alignment. Cite the GitHub Spec-Kit blog and Thoughtworks article to show this is industry practice now, not just emerging.

---

### Anthropic's Formal Context Engineering Framework (September 2025)
**Date/Period:** September 29, 2025
**Source:** [Anthropic Engineering – Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [Anthropic Engineering – Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

**What it is:**
Anthropic published a comprehensive engineering guide defining context engineering as the progression beyond prompt engineering. Context engineering encompasses strategies for curating and maintaining the optimal set of tokens across all components: system prompts, tools, examples, message history, and external references. Key patterns include just-in-time retrieval (load data at runtime rather than preloading), structured note-taking (agents write persisted notes outside context), and context editing (automatically clear stale tool results as token limits approach).

**Relevance to M03:**
The module focuses on specification clarity for Plan Mode but does not address how to manage context *at scale*—when agents need more data than fits in a context window. Context engineering is the complement to spec clarity: a clear spec is useless if the agent lacks the information to execute it. This directly impacts the spec template and the conversation between human and agent during Plan Mode.

**Current module coverage:**
The module assumes context is abundant (Plan Mode conversation, full spec review). It does not mention context constraints or strategies for managing information as agents execute complex specs over long horizons.

**Recommended addition:**
Add a subsection under the Four-Step Plan Mode Workflow titled "Context Engineering During Planning" that advises:
- Keep the spec itself lean and reference external docs (don't bloat the context with unnecessary detail in the plan conversation).
- Use Plan Mode to surface what information Claude needs; proactively offer references or file paths.
- When executing complex specs, leverage structured note-taking (agents should write intermediate results to files) to extend their effective working memory.

Reference the Anthropic blog to establish authority and show this is foundation-level guidance.

---

### CLAUDE.md Memory Pattern: Persistent Spec Storage (September 2025)
**Date/Period:** September 2025 (Sonnet 4.5 launch)
**Source:** [Claude Memory: A Deep Dive – Skywork AI](https://skywork.ai/blog/claude-memory-a-deep-dive-into-anthropics-persistent-context-solution/), [Anthropic Docs – Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool), [Manage Claude's memory](https://docs.anthropic.com/en/docs/claude-code/memory)

**What it is:**
Anthropic introduced Claude Memory in beta, which stores and retrieves information outside the context window via a file-based system. Memory is persisted in Markdown files named CLAUDE.md, organized hierarchically and updated by the agent as it works. This allows agents to store project details, user preferences, decisions, and—critically—evolving specifications without consuming context tokens.

**Relevance to M03:**
The module treats specs as static artifacts created during the plan conversation. However, real agents need to update specs as they discover edge cases, validate assumptions, or coordinate with humans. CLAUDE.md provides the mechanism: the spec can live in memory, be updated by the agent, and referenced as the agent executes. This transforms specs from pre-implementation documents to living specifications that guide and evolve with implementation.

**Current module coverage:**
The module does not mention persistent memory or living specs. It presents specs as complete and fixed before implementation.

**Recommended addition:**
Add a new subsection under "Specification Template" titled "The Spec as Living Document: Using CLAUDE.md" that explains:
- Specs can be stored in the agent's CLAUDE.md for reference across long executions.
- As the agent executes the plan, it updates CLAUDE.md with resolved questions, discovered edge cases, or validated assumptions.
- The human can review and approve updates to the spec in CLAUDE.md before the agent continues.
- This pattern is especially valuable for multi-day or multi-turn projects where the spec needs to be consulted repeatedly.

Cite the Anthropic memory documentation and include a brief example: "Spec stored in agent CLAUDE.md, agent updates it as it implements, human reviews updates."

---

### Addy Osmani's "Good Spec for AI Agents" Framework (2025)
**Date/Period:** 2025
**Source:** [AddyOsmani.com – How to write a good spec for AI agents](https://addyosmani.com/blog/good-spec/), [Substack – How to write a good spec for AI agents](https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents)

**What it is:**
Addy Osmani (Chrome/Web Platform architect, now focused on AI tooling) published detailed guidance on spec writing specifically for AI agents. Key insights: specs drive implementation, tests, and task breakdowns; the spec should be a "living document" updated as decisions are made; a functional spec with an agent prevents the agent from wandering into irrelevant complexity; specs should include high-level plans, interface definitions, and test cases upfront.

**Relevance to M03:**
Osmani's framework reinforces M03's thesis (specs are the constraint) and adds a practical dimension: specs control not just what the agent builds, but how it thinks about the problem. His emphasis on "keeping a team on track" resonates with the module's claim that clarity is the bottleneck, not coding speed.

**Current module coverage:**
The module's specification template (What/Why/How/Where/When/References) aligns well with Osmani's approach. However, the module does not emphasize specs as a control mechanism for agent behavior or mention the importance of embedding test cases and acceptance criteria as guardrails.

**Recommended addition:**
In the specification template section, add a note that good specs for AI agents should include:
- Explicit acceptance criteria and test cases (the agent uses these to validate its own work).
- Clear boundaries on scope (what the agent should NOT attempt).
- Examples of correct vs. incorrect behavior (helps the agent stay on track).

Cite Osmani's blog as a recommended reading and note that it specifically addresses AI agent workflows.

---

### Simon Willison's Agentic Engineering Patterns (2025)
**Date/Period:** 2025
**Source:** [Simon Willison – How coding agents work: Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/how-coding-agents-work/), [Substack – Agentic Engineering Patterns](https://simonw.substack.com/p/agentic-engineering-patterns), [2025: The year in LLMs](https://simonwillison.net/2025/Dec/31/the-year-in-llms/)

**What it is:**
Simon Willison formalized a body of patterns for Agentic Engineering—building software with AI agents that can both generate and execute code, test it, and iterate. His definition: an LLM agent runs tools in a loop to achieve a goal. Key patterns include structured task decomposition, clear tool definitions, error recovery, and the principle that if a human can't say which tool to use, an agent can't either.

**Relevance to M03:**
M03 focuses on the specification and plan phases. Willison's patterns address the execution phase: how agents use specs to run tools reliably. His insight on ambiguous tools and decision points mirrors M03's emphasis on clarity. Combined, they form a complete spec→plan→agentic execution story.

**Current module coverage:**
The module does not address post-implementation agent patterns or error recovery. It assumes Plan Mode produces a spec that Claude executes cleanly.

**Recommended addition:**
In the "Four-Step Plan Mode Workflow" section, add a note under "Green Light: Execute" that acknowledges agents may encounter edge cases or errors not anticipated during planning. Recommend: (1) agent should pause and escalate to human for plan revisions, (2) each tool used by the agent should have clear, non-ambiguous input/output specs, (3) error cases should be designed into the spec so the agent knows how to recover. Reference Willison's Agentic Engineering Patterns to show this is foundational practice.

---

### GitHub Spec-Kit Toolkit: Operationalizing Specs (September 2025)
**Date/Period:** September 2025
**Source:** [GitHub – Spec-Kit repository](https://github.com/github/spec-kit), [GitHub Blog – Spec-driven development with AI: Get started with a new open source toolkit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/), [LogRocket – Exploring spec-driven development with the new GitHub Spec Kit](https://blog.logrocket.com/github-spec-kit/)

**What it is:**
GitHub released Spec-Kit, an open-source toolkit that packages templates, a CLI, and prompts to operationalize spec-driven development. The workflow is Constitution → Specification → Design (technical plan) → Tasks. Spec-Kit integrates with Claude Code, GitHub Copilot, and other agents. It provides ready-to-use spec templates and CLI commands to guide users through the workflow.

**Relevance to M03:**
M03 teaches the conceptual foundation and Plan Mode usage. Spec-Kit is the production implementation: templates, tooling, and integrations that encode M03's principles into artifacts teams can adopt immediately.

**Current module coverage:**
The module does not mention existing tooling or provide a concrete spec template teams can commit to their repo. It says "committed to the team's repo or Wiki" in the takeaway but provides only the conceptual framework.

**Recommended addition:**
In the "Specification Template" section, provide a concrete, ready-to-use template (or reference the Spec-Kit template) that teams can copy into their repo. Add a note: "Many teams now use tools like GitHub Spec-Kit, which operationalizes this workflow with CLI support and integrations with Claude Code." Include the GitHub Spec-Kit link so instructors and students can adopt proven tooling.

Alternatively, provide a simple Markdown template in the workshop materials matching Spec-Kit's approach.

---

### Anthropic Structured Outputs: Specs as Grammar (2025)
**Date/Period:** September 2025
**Source:** [Anthropic Docs – Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), [Towards Data Science – A Hands-On Guide to Anthropic's New Structured Output Capabilities](https://towardsdatascience.com/hands-on-with-anthropics-new-structured-output-capabilities/), [Tribe AI – A Gentle Introduction to Structured Generation with Anthropic API](https://www.tribe.ai/applied-ai/a-gentle-introduction-to-structured-generation-with-anthropic-api)

**What it is:**
Anthropic introduced Structured Outputs, a feature that compiles JSON schema into a token-level grammar, forcing Claude's responses to strictly conform to the schema. Unlike prompting for "valid JSON," the model literally cannot generate tokens that violate the schema. Developers can use Zod (TypeScript) or Pydantic (Python) to define schemas, ensuring type-safe responses.

**Relevance to M03:**
Structured outputs provide a technical mechanism to enforce specification compliance at the API layer. If a spec requires certain fields, data types, or constraints, structured outputs guarantee the agent's response conforms. This is spec enforcement via grammar rather than trust or review.

**Current module coverage:**
The module focuses on human-AI alignment through clarity but does not mention technical enforcement mechanisms. It assumes Plan Mode and human review are sufficient.

**Recommended addition:**
Add a subsection under "Plan Mode: The Tool for Specs" titled "Enforcing Specs with Structured Outputs" that explains:
- For API-based workflows (agents calling external services), specs can be enforced via JSON schema.
- If the spec requires an API endpoint to return { status: "success" | "error", code: number }, structured outputs guarantee compliance.
- This pattern is especially valuable for multi-agent systems or when agent outputs feed into downstream systems.
- Cite Anthropic's structured outputs documentation and note this is an optional but valuable enforcement layer.

---

### Claude Code v2.0: Plan Mode Enhancements (December 2025 – January 2026)
**Date/Period:** December 2025 – January 2026
**Source:** [GetAIPerks – Claude Code Plan Mode: Complete Guide (2026)](https://www.getaiperks.com/en/articles/claude-code-plan-mode), [DataCamp – Claude Code Plan Mode: Design Review-First Refactoring Loops](https://www.datacamp.com/tutorial/claude-code-plan-mode), [Armin Ronacher's Thoughts – What Actually Is Claude Code's Plan Mode?](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/)

**What it is:**
Claude Code v2.0 (December 2025 – January 2026) transitioned Plan Mode from experimental to production. Enhancements include: read-only mode (Plan Mode cannot modify files, only analyze), enhanced subagents (dedicated planning subagent), native extensibility (integration with VS Code and other IDEs), and improved dependency mapping (Plan Mode visualizes cascading impacts of changes). The planning subagent explores code structure, identifies affected files, maps dependencies, and highlights breaking changes before execution.

**Relevance to M03:**
M03 teaches Plan Mode as a feature, but the recent v2.0 production release and architectural improvements validate and enhance the concept. The introduction of a dedicated planning subagent and read-only constraint strengthens the Plan Mode philosophy: separate planning from execution, lock in the spec before any code changes.

**Current module coverage:**
The module describes Plan Mode (Shift+Tab, ask for plan, review, refine, execute) but does not mention recent v2.0 enhancements or the dedicated subagent architecture.

**Recommended addition:**
Update the "Plan Mode: The Tool for Specs" section to note that modern Claude Code (v2.0+, as of January 2026) includes a dedicated planning subagent that operates in read-only mode. This ensures Plan Mode cannot accidentally modify your codebase while exploring—enforcing the spec-first discipline. Update the workflow description to mention that Claude may ask clarifying questions during planning (because it's a specialized agent focused on understanding your architecture).

---

## Emerging Best Practices to Consider Adding

### 1. Constitution-First Spec Hierarchy
Building on Spec-Kit's pattern, teams now define a Constitution (high-level, immutable principles) before specs. Example: "All data queries must use prepared statements," "APIs return 400/401/403 for client errors, 500 for server errors." The Constitution constrains all specs, ensuring consistency. Add to M03: A brief note that specs should reference team Constitution to ensure alignment.

### 2. Spec-as-Executable-Test-Case
Modern specs increasingly embed acceptance criteria and test case sketches that agents can validate against. Example: spec includes "when user provides invalid email, endpoint returns 400 with error_code: 'INVALID_EMAIL'" and agent implements test to verify. Add to M03: Emphasize that acceptance criteria should be precise and testable, not vague.

### 3. Spec Review Checkpoints
Real-world practice shows multiple review phases: (1) stakeholder review of spec before planning, (2) technical review of plan before execution, (3) agent escalation to human during execution if spec is ambiguous. Add to M03: Note that Plan Mode is *one* checkpoint; teams may insert additional human gates before code execution.

### 4. Leveraging Agent Memory for Spec Evolution
With CLAUDE.md, specs can be "living documents" that agents update as they work. Add to M03: Workflow note that agents should document assumptions they're making, edge cases they're handling, and update the spec in memory when they discover clarifications.

### 5. Multi-Agent Spec Contracts
As agent ecosystems grow, specs become the contract between agents. Agent A's output must match Agent B's expected input. Add to M03: Brief note that structured outputs (JSON schema) are particularly valuable when multiple agents coordinate, since schema enforcement ensures compatibility.

---

## Sources Consulted

### Spec-Driven Development & Industry Practice
- [Thoughtworks – Spec-driven development unpacking 2025's key engineering practices](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices)
- [The New Stack – Spec-Driven Development: The Key to Scalable AI Agents](https://thenewstack.io/spec-driven-development-the-key-to-scalable-ai-agents/)
- [Martin Fowler – Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [GitHub Spec-Kit Repository](https://github.com/github/spec-kit)
- [GitHub Blog – Spec-driven development with AI: Get started with a new open source toolkit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [LogRocket – Exploring spec-driven development with the new GitHub Spec Kit](https://blog.logrocket.com/github-spec-kit/)

### Anthropic Context Engineering & Memory
- [Anthropic Engineering – Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic Engineering – Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Skywork AI – Claude Memory: A Deep Dive into Anthropic's Persistent Context Solution](https://skywork.ai/blog/claude-memory-a-deep-dive-into-anthropics-persistent-context-solution/)
- [Anthropic Docs – Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
- [Anthropic Docs – Manage Claude's memory](https://docs.anthropic.com/en/docs/claude-code/memory)

### Structured Outputs & API Specs
- [Anthropic Docs – Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Towards Data Science – A Hands-On Guide to Anthropic's New Structured Output Capabilities](https://towardsdatascience.com/hands-on-with-anthropics-new-structured-output-capabilities/)
- [Tribe AI – A Gentle Introduction to Structured Generation with Anthropic API](https://www.tribe.ai/applied-ai/a-gentle-introduction-to-structured-generation-with-anthropic-api)

### Plan Mode & Claude Code
- [GetAIPerks – Claude Code Plan Mode: Complete Guide (2026)](https://www.getaiperks.com/en/articles/claude-code-plan-mode)
- [DataCamp – Claude Code Plan Mode: Design Review-First Refactoring Loops](https://www.datacamp.com/tutorial/claude-code-plan-mode)
- [Armin Ronacher – What Actually Is Claude Code's Plan Mode?](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/)
- [Steve Kinney – Claude Code Plan Mode (course)](https://stevekinney.com/courses/ai-development/claude-code-plan-mode)
- [ClaudeLog – Plan Mode Guide](https://claudelog.com/mechanics/plan-mode/)

### Expert Guidance & Patterns
- [Addy Osmani – How to write a good spec for AI agents](https://addyosmani.com/blog/good-spec/)
- [Addy Osmani – Substack: How to write a good spec for AI agents](https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents)
- [Simon Willison – Agentic Engineering Patterns: How coding agents work](https://simonwillison.net/guides/agentic-engineering-patterns/how-coding-agents-work/)
- [Simon Willison – Agentic Engineering Patterns (Substack)](https://simonw.substack.com/p/agentic-engineering-patterns)
- [Simon Willison – 2025: The year in LLMs](https://simonwillison.net/2025/Dec/31/the-year-in-llms/)

---

## Summary of Recommended Updates to M03

| Area | Recommended Addition | Priority |
|------|----------------------|----------|
| Spec-Driven Practice | Mention GitHub Spec-Kit, AWS Kiro, Tessl as production implementations; add note on Constitution pattern | Medium |
| Context Engineering | Add subsection on context constraints and just-in-time retrieval during Plan Mode | High |
| Living Specs (CLAUDE.md) | Add pattern for storing and evolving specs in agent memory across long executions | High |
| Spec Template | Provide ready-to-use Markdown template (reference Spec-Kit or create one); emphasize test cases | Medium |
| Acceptance Criteria | Strengthen guidance on embedding testable acceptance criteria in specs | Medium |
| Structured Outputs | Add optional subsection on enforcing specs via JSON schema for API workflows | Low |
| Agentic Patterns | Brief note on error recovery and tool clarity during execution phase | Medium |
| Plan Mode Enhancements | Update Plan Mode description to reflect v2.0 architecture (dedicated subagent, read-only mode) | Low |

