# M07 Cross-Check: Masterclass vs CS146S

## Summary

M07: Advanced Workflows focuses on the Claude Code composition stack (skills, subagents, hooks, plugins, agent teams) and practical patterns for building reusable team workflows. CS146S Week 4 (Coding Agent Patterns) provides the broader orchestration theory and context quality principles, while Week 2 (Anatomy of Coding Agents) covers MCP architecture and tool design, and Week 5 (The Modern Terminal) explores agentic development environments and incremental development practices.

**Overall Assessment:** M07 is well-supported by CS146S in its core claims about context, orchestration, and multi-agent coordination. However, M07 emphasizes the _implementation mechanics_ (YAML syntax, file locations, hook lifecycle) while CS146S emphasizes the _design principles_ and _orchestration strategy_. CS146S provides deeper treatment of context quality, ensemble methods, and cross-tool integration that would strengthen M07.

**Key Finding:** M07 and CS146S are complementary rather than redundant. M07 teaches the "how to build" (tactical), while CS146S teaches the "why and when" (strategic).

---

## Supported Claims

### 1. The Composition Stack / Layered Architecture
**M07 Claim:** "Claude Code supports a composition stack: CLAUDE.md → Skills → Subagents → Hooks → MCP → Plugins → Agent Teams"

**CS146S Support:**
- **Week 4 COURSE.md** explicitly discusses "multi-layered engineering for reliability" and identifies context front-loading, system-reminder distribution, and sub-agent architecture as core Claude Code patterns.
- **Week 4 Claude Best Practices** confirms the composition: "Customize with Instructions, Skills, and Hooks" and mentions CLAUDE.md, MCP integration, agent teams, and the Agent SDK.
- **Week 4 "Peeking Under the Hood"** validates the sub-agent architecture approach: "Complex tasks spawn specialized agents with narrower instructions."

**Status:** SUPPORTED ✓

---

### 2. CLAUDE.md as Persistent Context
**M07 Claim:** CLAUDE.md is a persistent, repo-wide context file containing project conventions, architecture docs, and team standards. It's read at the start of every session.

**CS146S Support:**
- **Week 4 COURSE.md** recommends: "Create a CLAUDE.md File... Include coding standards, architectural decisions, preferred libraries, review checklists, common debugging patterns, deployment procedures."
- **Week 4 Claude Best Practices** states: "CLAUDE.md is a markdown file you add to your project root that Claude Code reads at the start of every session."
- **Week 4 "Good Context Good Code"** frames this as part of the broader principle: "documentation is treated as a first-class artifact" in the monorepo-as-shared-workspace.

**Status:** SUPPORTED ✓

---

### 3. Skills as Reusable Instruction Templates
**M07 Claim:** Skills are reusable instruction templates triggered by `/skill-name`, with three patterns: Pure Markdown (A), Markdown + Scripts (B), and Markdown + Subagents (C).

**CS146S Support:**
- **Week 4 Claude Best Practices** confirms custom command patterns: "Create custom commands to package repeatable workflows your team can share, like `/review-pr` or `/deploy-staging`."
- **Week 4 COURSE.md** discusses "Skills and custom commands extend... institutional knowledge and makes it actionable."
- While CS146S doesn't explicitly detail the three Pattern A/B/C classifications, it aligns with the broader principle of "instruction packages" for repeated workflows.

**Status:** SUPPORTED (pattern names A/B/C are M07-specific nomenclature; the underlying concept is supported) ✓

---

### 4. Subagents for Specialized, Isolated Work
**M07 Claim:** Subagents are independent sessions with their own tools/context and configuration, useful for role-based isolation (security reviewer, code quality) and parallel work.

**CS146S Support:**
- **Week 4 COURSE.md** dedicates an entire section to "Sub-agent Architecture": "Complex tasks spawn specialized agents with narrower instructions rather than expecting one agent to handle everything."
- **Week 4 COURSE.md** Practical Takeaway #7: "Invest in Sub-Agent Decomposition... Assign each to a sub-agent with focused instructions. A lead agent coordinates."
- **Week 4 "Peeking Under the Hood"** confirms: "Complex tasks spawn specialized agents with narrower instructions. These delegated agents receive conditional context based on task complexity."
- **Week 4 "Good Context Good Code"** notes: "Teams use AI for nearly every task... all while maintaining human supervision." This aligns with subagent specialization patterns.

**Status:** STRONGLY SUPPORTED ✓✓

---

### 5. Hooks for Deterministic Lifecycle Automation
**M07 Claim:** Hooks run at specific lifecycle points (PreToolUse, PostToolUse, Notification, Stop) and are shell scripts in `.claude/hooks/`.

**CS146S Support:**
- **Week 4 Claude Best Practices** states: "Hooks let you run shell commands before or after Claude Code actions, like auto-formatting after every file edit or running lint before a commit."
- **Week 4 COURSE.md** mentions "System-reminder tags appear throughout the pipeline... embedded within user messages and tool results" and emphasizes distributed reinforcement of objectives throughout execution paths.
- M07's specific lifecycle hook names (PreToolUse, PostToolUse, etc.) and shell environment variables ($TOOL_NAME, $TOOL_OUTPUT) are _not explicitly detailed_ in CS146S materials reviewed, suggesting they are implementation specifics M07 documents.

**Status:** SUPPORTED (with implementation details unique to M07) ✓

---

### 6. MCP for External Tool Integration
**M07 Claim:** MCP provides access to external integrations (databases, APIs, internal tools) at the tool-level.

**CS146S Support:**
- **Week 2 COURSE.md** devotes extensive material to MCP as "the standardized framework that solves... how do we give language models consistent, reliable access to external tools and data?"
- **Week 4 COURSE.md** notes: "The MCP Multiplier Effect... Rather than agents working in isolation with only the codebase visible, MCP connects agents to external data sources: design docs in Google Drive, tickets in Jira, deployment information in AWS, schema definitions."
- **Week 4 Claude Best Practices** directly states: "Connect Your Tools with MCP... The Model Context Protocol (MCP) is an open standard for connecting AI tools to external data sources."

**Status:** STRONGLY SUPPORTED ✓✓

---

### 7. Plugins as Bundled Packages
**M07 Claim:** Plugins are bundled skills + MCPs + custom commands for distribution across teams.

**CS146S Support:**
- **Week 4 Claude Best Practices** mentions: "Customize with Instructions, Skills, and Hooks" and references agent team coordination.
- M07's specific definition of "plugins" as _bundled_ packages for distribution is not explicitly detailed in CS146S materials reviewed. CS146S focuses on individual skills and MCP servers; the _packaging and distribution_ aspect is treated differently in M07.

**Status:** PARTIALLY SUPPORTED (concept exists; packaging terminology is M07-specific) ⚠

---

### 8. Agent Teams for Parallel, Coordinated Work
**M07 Claim:** Agent Teams enable coordinated parallel sessions with lead agents coordinating subtasks.

**CS146S Support:**
- **Week 4 COURSE.md** states: "Agent Teams... The platform can spawn multiple agents working on different parts of a task simultaneously, with a lead agent coordinating work, assigning subtasks, and merging results."
- **Week 4 COURSE.md** Practical Takeaway #7: "For complex tasks, don't ask one agent to do everything. Decompose into subtasks... A lead agent coordinates."
- **Week 4 Claude Best Practices** confirms: "Spawn multiple Claude Code agents that work on different parts of a task simultaneously. A lead agent coordinates the work, assigns subtasks, and merges results."

**Status:** STRONGLY SUPPORTED ✓✓

---

### 9. Context Quality as Foundation for Code Quality
**M07 Claim** (implicit in the composition stack design): Good context enables better code and greater autonomy.

**CS146S Support:**
- **Week 4 "Good Context Good Code"** is foundational: "Good code is a side effect of good context."
- **Week 4 COURSE.md** section on "The Context-Quality Connection" explains: "Rather than focusing solely on prompt engineering or agent autonomy, we should focus on context engineering."
- **Week 4 COURSE.md** Practical Takeaway #6: "Design for Progressive Autonomy... As confidence builds and documentation improves, expand autonomy. This isn't about trust (or not just). It's about learning what works in your specific context."

**Status:** STRONGLY SUPPORTED (underlying principle is explicit in CS146S) ✓✓

---

## Missing from CS146S (Masterclass-only content)

### 1. Detailed YAML Frontmatter Syntax
**M07 Provides:** Explicit YAML structure for skills, subagents, and their configuration options:
```yaml
name: Skill Name
description: One-line purpose
disable-model-invocation: false
allowed-tools: [tool1, tool2]
disabled: false
```

**CS146S Gap:** Week 4 and Week 2 materials do not detail the YAML syntax or frontmatter configuration structure. This is a purely tactical detail M07 provides.

**Recommendation:** Document in M07 course as expected.

---

### 2. Skill File Locations and Scope Hierarchy
**M07 Provides:** Clear documentation of where skills live and their visibility scope:
- `.claude/skills/` → Repository-local, team-accessible
- `~/.claude/skills/` → User-local
- `~/.claude/plugins/` → Distributed as plugin

**CS146S Gap:** While CS146S discusses CLAUDE.md location and plugin distribution, it does not detail the hierarchical directory structure for skills and their visibility scope.

**Recommendation:** M07's directory structure guidance is appropriate and not contradicted by CS146S.

---

### 3. Hook Lifecycle Environment Variables
**M07 Provides:** Specific environment variables available to hooks:
- `$TOOL_NAME` — which tool ran
- `$TOOL_OUTPUT` — the tool's result
- `$TOOL_INPUT` — what was passed to the tool

**CS146S Gap:** Week 4 mentions hooks exist but does not detail the environment variables passed to them.

**Recommendation:** This is implementation-level documentation appropriate to M07.

---

### 4. Three Skill Pattern Nomenclature (A/B/C)
**M07 Provides:** Explicit naming and comparison of skill patterns:
- Pattern A: Pure Markdown
- Pattern B: Markdown + Scripts
- Pattern C: Markdown + Subagents

**CS146S Gap:** Discusses the concepts (custom commands, hooks, subagents) but does not frame them as "three patterns" or give them names.

**Recommendation:** M07's pattern taxonomy is a useful pedagogical addition not found in CS146S.

---

### 5. Specific Hook Lifecycle Points
**M07 Provides:** Explicit hooks available:
- PreToolUse
- PostToolUse
- Notification
- Stop

**CS146S Gap:** While "Peeking Under the Hood" mentions "system-reminder tags... distributed throughout the pipeline," it does not enumerate the specific hook lifecycle points.

**Recommendation:** This is detailed implementation documentation; appropriate to M07.

---

### 6. Team Workflow Best Practices Reference
**M07 References:** "(Anthropic internal; shared in workshop)" for team workflow best practices.

**CS146S Gap:** The course materials reference "How Anthropic Teams Use Claude Code" (PDF) in Week 4 README, but this is not reproduced in the materials provided to students.

**Recommendation:** M07 appropriately notes this is covered in the workshop.

---

## Conflicts / Discrepancies

### No Direct Conflicts Identified

After thorough cross-reference, **no substantive conflicts** exist between M07 and CS146S materials reviewed.

**Minor Terminology Notes:**
- M07 uses "consolidation stack" and "composition stack" interchangeably; CS146S uses "layered engineering" or "multi-agent architecture."
- M07 defines "plugins" as bundled packages for distribution; CS146S focuses on the underlying MCP and skill mechanisms without explicitly bundling them as "plugins."
- These are framing differences, not contradictions.

---

## CS146S Topics Not in Masterclass M07

### 1. MCP Registry and Ecosystem Standards
**CS146S Topic:** Week 2 dedicates significant content to the MCP Registry (https://registry.modelcontextprotocol.io) as a centralized discovery mechanism, ecosystem design, and community moderation.

**M07 Coverage:** M07 mentions MCP as external integrations but does not discuss the registry, discovery, or ecosystem aspects.

**Strength Added to M07:** Understanding the registry would enable teams to discover pre-built MCP servers rather than building custom ones, accelerating integration setup.

**Recommendation:** Add brief section: "MCP Servers and Registry Discovery" explaining how to find and use existing MCP servers before building custom ones.

---

### 2. MCP Authentication and Security Patterns
**CS146S Topic:** Week 2 "MCP Server Authentication" details OAuth 2.0 integration, Cloudflare Access, and enterprise identity provider patterns.

**M07 Coverage:** M07 assumes MCP servers exist; does not discuss securing them.

**Strength Added to M07:** For teams deploying custom MCP servers, authentication is a critical design concern. CS146S covers this thoroughly.

**Recommendation:** If M07 includes custom MCP server building, add section on OAuth 2.0 and authentication patterns.

---

### 3. Tool Design Principles for Agents
**CS146S Topic:** Week 2 "APIs Don't Make Good MCP Tools" explains why purpose-built tools outperform mechanically converted APIs, covering tool consolidation, context window efficiency, and response format optimization.

**M07 Coverage:** M07 assumes MCP tools exist; does not guide custom tool design.

**Strength Added to M07:** A section on "Designing MCP Tools for Agent Efficiency" would prevent teams from building overly granular or inefficient tools.

**Recommendation:** Add guidance on consolidating related functions into coherent interfaces, using agent-efficient formats (CSV/TSV vs JSON), and combining response types (structured data + guidance).

---

### 4. Ensemble Methods for Critical Code Review
**CS146S Topic:** Week 4 "Good Context Good Code" demonstrates ensemble methods: using multiple AI models (different strengths) to review work before human approval, with the example that "Gemini excels at security."

**M07 Coverage:** M07 does not mention ensemble methods or multi-model review patterns.

**Strength Added to M07:** For security-critical or high-risk changes, teams could deploy multiple subagents (with different models or instructions) to improve code quality. This is a natural extension of M07's subagent patterns.

**Recommendation:** Add "Pattern D: Ensemble Review Subagents" showing how to use multiple specialized subagents (security, performance, code quality) in parallel before human approval.

---

### 5. Trust Calibration and Progressive Autonomy Framework
**CS146S Topic:** Week 4 "Designing for Agent Autonomy" and "Practical Takeaways #6" outline a 4-week progression from supervised to autonomous work, with the principle that autonomy should be task-specific and context-dependent.

**M07 Coverage:** M07 assumes subagents and hooks are deployed; does not discuss the gradual rollout strategy.

**Strength Added to M07:** Teams deploying hooks and skills for the first time would benefit from a staged approach: start with low-risk automation, measure reliability, expand autonomy gradually.

**Recommendation:** Add section on "Phased Deployment: From Supervised to Autonomous Workflows" with a 4-week progression model similar to CS146S Week 4.

---

### 6. Dogfooding and Developer Feedback Loops
**CS146S Topic:** Week 5 emphasizes dogfooding: teams building agentic tools should use them extensively themselves, generating empirical data for improvement.

**M07 Coverage:** M07 assumes skills and hooks are ready; does not discuss iterative refinement or feedback collection.

**Strength Added to M07:** Teams deploying their first skills and hooks would benefit from a feedback collection and iteration strategy.

**Recommendation:** Add section: "Iterating on Skills and Hooks: Collecting Team Feedback" with guidance on capturing failed prompts, pain points, and opportunities.

---

### 7. Documentation First, Code Second
**CS146S Topic:** Week 4 COURSE.md Practical Takeaway #1: "Before asking agents to write code, invest time in documentation. Write design documents... This isn't busywork. Well-written documentation is force-multiplied by agents."

**M07 Coverage:** M07 mentions CLAUDE.md but does not emphasize the broader documentation-first philosophy.

**Strength Added to M07:** Teams would understand that the skills and hooks they build are more effective when the codebase itself is well-documented (design docs, implementation plans, API guides).

**Recommendation:** Add pre-work section: "Documentation Prerequisites: Preparing Your Codebase for Effective Agent Orchestration" detailing what documentation should exist before designing skills and hooks.

---

### 8. Incremental Development and Staged Prompting
**CS146S Topic:** Week 5 "The Art and Science of Prompting" emphasizes breaking large tasks into smaller components, iterating with agents at each stage, and verifying direction before proceeding.

**M07 Coverage:** M07 discusses skill patterns but not the interaction pattern of iterative, incremental development.

**Strength Added to M07:** Teams designing subagents or hooks could benefit from prompting patterns that favor incremental refinement.

**Recommendation:** Add to M07 workshop: "Designing Incremental Subagent Workflows" with examples of breaking complex tasks into staged subtasks.

---

### 9. Responsibility and Code Quality Standards
**CS146S Topic:** Week 5 emphasizes: "The developer is responsible for all code they submit, regardless of whether an AI generated it." Code must meet professional standards even when AI-generated.

**M07 Coverage:** M07 assumes responsible use but does not explicitly state this principle.

**Strength Added to M07:** Teams need to understand that automating code generation (via hooks, skills, subagents) does not reduce human responsibility or quality requirements.

**Recommendation:** Add section: "Responsibility and Governance" stating that teams remain responsible for all code generated by skills and hooks, with guidance on review practices.

---

### 10. Privacy, Model Selection, and Infrastructure Choices
**CS146S Topic:** Week 5 "Privacy, Model Selection, and Infrastructure Choices" discusses SOC 2 compliance, zero-retention policies, and selecting different models for different tasks.

**M07 Coverage:** M07 does not discuss infrastructure, privacy, or model selection considerations for custom skills and hooks.

**Strength Added to M07:** Teams deploying skills and hooks need to understand data handling, privacy implications, and model selection for subagents.

**Recommendation:** Add section: "Infrastructure and Privacy Considerations" covering where code runs (local vs. cloud), data retention, and compliance requirements.

---

## Prioritized Recommendations for Improvement

### Tier 1: High Impact (Strengthen M07 Significantly)

#### 1. Add "Ensemble Review Pattern" (Pattern D)
**Why:** Directly extends M07's subagent patterns with a CS146S concept (ensemble methods) that significantly improves code quality for critical tasks.

**What to Add:**
- Pattern D: Multiple Specialized Subagents
- Example: Security reviewer + performance reviewer + code quality reviewer running in parallel
- Show how to aggregate their findings and present to humans for final approval
- Reference: "Good Context Good Code" ensemble methods

**Effort:** Medium (1-2 hours)

---

#### 2. Prepend "Trust Calibration and Progressive Autonomy" Framework
**Why:** Many teams will deploy these features without understanding the phased rollout strategy. This prevents over-automation and builds confidence gradually.

**What to Add:**
- 4-week progression model (from Week 4 COURSE.md)
- Week 1: Skills/hooks execute with human review before merge
- Week 2: Add more tasks; human reviews high-risk changes
- Week 3: Expand to parallel work
- Week 4: Enable selective autonomous tasks
- Measurement criteria at each stage

**Effort:** Medium (1-2 hours to adapt from CS146S Week 4)

---

#### 3. Add "Documentation Prerequisites" Pre-Work Section
**Why:** M07 assumes good documentation exists. Making this explicit prevents teams from deploying skills into poorly documented codebases.

**What to Add:**
- Pre-flight checklist: Does your project have design docs, implementation plans, API guides, README files?
- Why each matters for agent effectiveness (with CS146S "Good Context Good Code" references)
- Workshopping template: "Before you build your first skill, document these 5 things..."

**Effort:** Low (30 minutes to synthesize from CS146S Week 4)

---

### Tier 2: Medium Impact (Enhance Completeness)

#### 4. Add "Tool Design Principles for MCP"
**Why:** Teams may build custom MCP servers; this prevents inefficient tool design.

**What to Add:**
- Consolidate related functions into coherent tools
- Return data in agent-efficient formats (CSV/TSV preferred over JSON)
- Combine structured data with guidance/recommendations
- Example: Poor tool = 20 separate API endpoints; good tool = 1 consolidated "research" tool returning results + follow-up suggestions
- Reference: CS146S Week 2 "APIs Don't Make Good MCP Tools"

**Effort:** Low-Medium (45 minutes)

---

#### 5. Add "Phased Deployment and Feedback Loops"
**Why:** Teams need an iteration strategy for refining skills and hooks based on real usage.

**What to Add:**
- Week 1: Deploy 1 skill; collect feedback on prompt clarity, edge cases
- Week 2: Refine based on feedback; add another skill
- Feedback template: prompt, failure mode, context, suggested fix
- Team review cadence (weekly huddle to discuss skill improvements)
- Reference: CS146S Week 5 "Dogfooding" section

**Effort:** Medium (1 hour)

---

#### 6. Add "Responsibility and Code Quality Standards"
**Why:** Automation can create complacency; needs explicit guardrails.

**What to Add:**
- Statement: "Your team remains responsible for all code generated by skills, hooks, and subagents."
- Review practices: How to audit auto-generated code at scale
- Quality gates: When to require human review vs. allow autonomous execution
- Reference: CS146S Week 5 responsibility principle

**Effort:** Low (30 minutes)

---

### Tier 3: Lower Priority (Nice to Have)

#### 7. Add "MCP Registry Discovery"
**Why:** Teams should know they can find pre-built MCP servers before building custom ones.

**What to Add:**
- Link to MCP Registry: https://registry.modelcontextprotocol.io
- How to evaluate published servers (maintenance, security, compatibility)
- When to use registry servers vs. custom servers
- Reference: CS146S Week 2

**Effort:** Low (20 minutes)

---

#### 8. Add "Infrastructure and Privacy Considerations"
**Why:** Teams need to understand where code runs, data retention, and compliance.

**What to Add:**
- Where hooks run: locally on developer machine vs. cloud
- Data retention: How long are tool outputs stored?
- Privacy implications of MCP integrations
- SOC 2 / compliance considerations for enterprise teams
- Reference: CS146S Week 5 privacy section

**Effort:** Low (30 minutes)

---

#### 9. Expand "Orchestration with the Agent SDK"
**Why:** M07 mentions "Agent SDK" briefly; deeper treatment of custom orchestration would be valuable.

**What to Add:**
- When to use built-in agent teams vs. custom SDK
- Example: Building a custom orchestrator for your specific workflow
- Reference materials / links to Agent SDK documentation

**Effort:** Medium (1-2 hours, depending on SDK docs available)

---

#### 10. Add "Incremental Skill Development Workflow"
**Why:** Pairs well with CS146S Week 5's emphasis on incremental prompting.

**What to Add:**
- Start with a single, narrow skill
- Test it with the team on real tasks
- Gather feedback
- Iterate the prompt (skills can be versioned)
- Expand to more complex skills once the simple one is stable
- Example walkthrough: Scaffold Component skill, refined over 2-3 weeks

**Effort:** Low-Medium (1 hour)

---

## Recommendations Summary Table

| # | Recommendation | Tier | CS146S Source | Effort | Impact |
|---|---|---|---|---|---|
| 1 | Add Ensemble Review Pattern (D) | 1 | W4: Good Context | 1-2h | High |
| 2 | Trust Calibration Framework | 1 | W4: COURSE | 1-2h | High |
| 3 | Documentation Prerequisites | 1 | W4: COURSE | 30m | High |
| 4 | MCP Tool Design Principles | 2 | W2: APIs & Tools | 45m | Medium |
| 5 | Phased Deployment & Feedback | 2 | W5: Dogfooding | 1h | Medium |
| 6 | Responsibility & QA Standards | 2 | W5: Responsibility | 30m | Medium |
| 7 | MCP Registry Discovery | 3 | W2: MCP Registry | 20m | Low |
| 8 | Infrastructure & Privacy | 3 | W5: Privacy | 30m | Low |
| 9 | Agent SDK Orchestration | 3 | W4: Claude Practices | 1-2h | Low |
| 10 | Incremental Skill Development | 3 | W5: Prompting | 1h | Low |

---

## Key Takeaways for M07 Authors

1. **M07 and CS146S are complementary, not redundant.** M07 provides the tactical "how" (YAML syntax, file structure, patterns), while CS146S provides the strategic "why and when" (orchestration philosophy, context quality, progressive autonomy). They work together.

2. **Strongest Alignment:** Both materials emphasize:
   - Context quality as the foundation for agent effectiveness
   - Subagents for specialized work and parallel execution
   - Persistent instructions (CLAUDE.md) for team-wide consistency
   - MCP for external tool integration
   - Progressive, staged deployment strategies

3. **M07's Unique Value:** Detailed, actionable implementation patterns (YAML frontmatter, directory structure, hook lifecycle, three skill patterns) that CS146S does not cover. This is appropriate and needed.

4. **Recommended Priority Additions:** If updating M07, focus on Tier 1 recommendations (ensemble methods, trust calibration framework, documentation prerequisites) as they directly strengthen the workshop outcomes and align with CS146S Week 4 principles.

5. **Workshop Reinforcement:** The M07 workshop should explicitly reference and reinforce the "context quality" principle from CS146S Week 4's "Good Context Good Code" case study, as this is the deeper theory underlying all the M07 tactics.

---

## References

**M07 Source:** `/sessions/nifty-upbeat-galileo/mnt/Ai Agent Syllabus/masterclass/Tier 2 - Mastery/M07-Advanced-Workflows.md`

**CS146S Sources Reviewed:**
- Course Overview
- Week 2: Anatomy of Coding Agents (COURSE.md)
- Week 4: Coding Agent Patterns (COURSE.md, README.md, Claude Best Practices.md, Good Context Good Code.md, Peeking Under the Hood of Claude Code.md)
- Week 5: The Modern Terminal (COURSE.md)

**Cross-Check Completed:** 2026-03-28
**Audit Status:** Complete | Research Only (No Modifications to M07)
