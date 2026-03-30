# M07 Additional Info: Online Fact-Check

**Module:** M07 — Advanced Workflows
**Date Checked:** March 28, 2026
**Status:** All major claims verified against high-reliability sources

---

## Summary

The M07 module accurately represents Claude Code's skills, subagents, hooks, and composition stack. Key claims about YAML frontmatter, hook lifecycle events, and three skill patterns are supported by official Claude Code documentation. One important caveat: "Agent Teams" (mentioned as a composition layer) is **experimental and disabled by default**, which the module does not note. The module's treatment of hooks lifecycle events requires clarification: the documented events include more than the four listed (PreToolUse, PostToolUse, Notification, Stop).

---

## Claim-by-Claim Analysis

### Claim 1: Skills as Reusable Templates with YAML Frontmatter

**Module states:**
Skills are instruction templates with YAML frontmatter containing `name`, `description`, `disable-model-invocation`, and `allowed-tools` fields.

**Status:** Well-Supported

**Evidence:**
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) confirms YAML frontmatter structure with exactly these fields.
- The `disable-model-invocation` field is documented as preventing Claude from automatically loading a skill (default: `false`).
- The `allowed-tools` field restricts which tools Claude can use when the skill is active.
- Frontmatter reference confirms fields: `name`, `description`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `model`, `effort`, `context`, `agent`, `hooks`, `paths`, `shell`.

**Notes:**
The module lists four key frontmatter fields; official docs include eight total with optional fields for model selection, effort level, context mode (fork for subagent), and hook configuration. The subset used in module examples is appropriate for introductory purposes.

---

### Claim 2: Three Skill Patterns (A: Pure Markdown, B: Markdown+Scripts, C: Markdown+Subagents)

**Module states:**
Three canonical patterns for skills: pure markdown, markdown with shell scripts, and markdown with subagent delegation.

**Status:** Partially Supported

**Evidence:**
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) discusses skill types: reference content (guidelines, knowledge) vs. task content (step-by-step actions).
- The module's Pattern B (Markdown + Scripts) aligns with skills that "add supporting files" including scripts in subdirectories that Claude can execute.
- Pattern C (Markdown + Subagents) is supported: skills can use the `context: fork` field to run in isolated subagent context, and the `agent` field specifies which subagent type (`Explore`, `Plan`, `general-purpose`, or custom).
- Dynamic context injection via `` !`<command>` `` syntax (for running shell commands before skill content is rendered) is documented.

**Notes:**
The three-pattern framing is pragmatic and supported by the documentation, though not explicitly named as "Pattern A/B/C" in official sources. The framework is sound: pure markdown for instructions, scripts for validation/post-processing, and subagents for specialized isolated work.

---

### Claim 3: Hooks Lifecycle Events (PreToolUse, PostToolUse, Notification, Stop)

**Module states:**
Four hook lifecycle events: PreToolUse, PostToolUse, Notification, and Stop.

**Status:** Partially Supported / Oversimplified

**Evidence:**
- [Automate workflows with hooks](https://code.claude.com/docs/en/hooks-guide) official documentation lists **22+ hook events**, not four.
- **Complete lifecycle table includes:**
  - SessionStart, UserPromptSubmit, PreToolUse, PermissionRequest
  - PostToolUse, PostToolUseFailure, Notification, SubagentStart
  - SubagentStop, TaskCreated, TaskCompleted, Stop
  - StopFailure, TeammateIdle, InstructionsLoaded, ConfigChange
  - CwdChanged, FileChanged, WorktreeCreate, WorktreeRemove
  - PreCompact, PostCompact, Elicitation, ElicitationResult, SessionEnd
- The four events listed in the module are real and well-documented, but representing them as "the" hook lifecycle is incomplete.

**Notes:**
The module presents the four most common hook types suitable for introductory use (tool-related and basic lifecycle). Advanced users should be aware of additional events like SessionStart, SubagentStart/Stop, ConfigChange, and others. For pedagogical purposes, the simplified set is acceptable, but should note "Key hook types" or "Common examples" rather than implying completeness.

---

### Claim 4: Skill Locations and Scope

**Module states:**
Skills stored in `.claude/skills/` (repo-local), `~/.claude/skills/` (user-local), or `~/.claude/plugins/` (distributed as plugin).

**Status:** Well-Supported

**Evidence:**
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) confirms three scopes:
  - **Project:** `.claude/skills/<skill-name>/SKILL.md` — applies to this project only, shareable via version control
  - **Personal:** `~/.claude/skills/<skill-name>/SKILL.md` — all your projects
  - **Enterprise:** managed settings (organization-wide)
  - **Plugin:** packaged in a plugin directory, scoped to where plugin is enabled
- Priority order confirmed: enterprise > personal > project

**Notes:**
The module correctly captures the scope model. Additional detail: Claude Code automatically discovers skills from nested `.claude/skills/` directories in subdirectories (supporting monorepos).

---

### Claim 5: Subagents as Isolated Sessions with Independent State

**Module states:**
Subagents are independent sessions with their own configuration, tools, and context window. Useful for specialized work (security review, code quality) without biasing the main agent.

**Status:** Well-Supported

**Evidence:**
- [Create custom subagents - Claude Code Docs](https://code.claude.com/docs/en/sub-agents) confirms: each subagent runs in its own context window with custom system prompt, specific tool access, and independent permissions.
- Subagents are defined in `.claude/agents/<name>.md` with YAML frontmatter: `name`, `description`, `model`, `instructions`, `tools`.
- Subagents are summoned with `@subagent-name` syntax (module states `@security-reviewer review this PR`, which is accurate).
- Subagent isolation prevents main conversation context pollution and enables role-based specialization.

**Notes:**
The module's security-reviewer example aligns perfectly with documentation. One nuance: subagents report results back to the main agent and do not communicate with each other directly. (This contrasts with Agent Teams, which do enable inter-agent communication.)

---

### Claim 6: CLAUDE.md as Persistent, Repo-Wide Context

**Module states:**
CLAUDE.md provides persistent context loaded into every session, containing project conventions, architecture docs, and team standards.

**Status:** Well-Supported

**Evidence:**
- [How Claude remembers your project - Claude Code Docs](https://code.claude.com/docs/en/memory) confirms CLAUDE.md is loaded into context at session start.
- CLAUDE.md is consumed as tokens alongside conversation (shown in context window visualization).
- Survives compaction: after `/compact`, CLAUDE.md is re-read from disk and re-injected fresh.
- Best practice: keep under 200 lines per file for optimal adherence.

**Notes:**
The module accurately describes CLAUDE.md scope and persistence. Official guidance recommends ~200-line limit and organized markdown structure (headers, bullets) for clarity.

---

### Claim 7: "Agent Teams" as a Composition Layer

**Module states:**
Agent Teams listed as the highest-level composition layer: "Coordinated parallel sessions" for "large refactors, multi-component features, parallel reviews."

**Status:** Well-Supported but Incomplete / Experimental Caveat Missing

**Evidence:**
- [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams) confirms Agent Teams coordinate multiple Claude Code instances working in parallel.
- Use cases align: research and review, new modules/features, debugging with competing hypotheses, cross-layer coordination.
- **Critical caveat:** Agent Teams are **experimental and disabled by default**. Must be explicitly enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable.
- Known limitations include: no session resumption with in-process teammates, task status lag, slow shutdown, one team per session, no nested teams.

**Notes:**
The module mentions Agent Teams without noting their experimental status or requiring explicit enablement. This is a pedagogical gap: students implementing this would need to know they must explicitly enable the feature and understand its limitations. For an advanced masterclass, this caveat should be included.

---

### Claim 8: Multi-Agent Orchestration Patterns (Implicit)

**Module states:**
Composition stack implies orchestration: CLAUDE.md → Skills → Subagents → Hooks → MCP → Plugins → Agent Teams.

**Status:** Well-Supported (Aligned with Anthropic's "Building Effective Agents")

**Evidence:**
- [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents) identifies core agentic patterns:
  - **Prompt Chaining:** sequential steps with programmatic checkpoints
  - **Routing:** classify and direct to specialized tasks
  - **Parallelization:** sectioning (independent parallel subtasks) or voting
  - **Orchestrator-Workers:** central coordinator breaks down tasks, delegates, synthesizes
  - **Evaluator-Optimizer:** iterative generation and evaluation loop
- The module's composition stack represents a **practical hierarchy** rather than named patterns, but aligns with these principles:
  - Skills = routing (different instructions for different tasks)
  - Subagents = specialized workers
  - Agent Teams = orchestrator-workers with inter-agent communication
  - Hooks = deterministic orchestration layer

**Notes:**
The module doesn't explicitly reference Anthropic's patterns, but the composition stack implicitly enacts them. This is appropriate for a practical guide. Advanced readers should be aware of Anthropic's formal pattern taxonomy for deeper architectural thinking.

---

### Claim 9: Hooks Receive Environment Variables ($TOOL_NAME, $TOOL_OUTPUT, $TOOL_INPUT)

**Module states:**
Hooks receive `$TOOL_NAME`, `$TOOL_OUTPUT`, `$TOOL_INPUT` environment variables.

**Status:** Partially Supported / Imprecise

**Evidence:**
- [Automate workflows with hooks](https://code.claude.com/docs/en/hooks-guide) shows hooks communicate via **stdin (JSON input)** and **stdout/stderr/exit codes**, not environment variables.
- Example hook receives JSON on stdin: `{"session_id": "...", "tool_name": "Bash", "tool_input": {"command": "..."}}`
- Hooks parse JSON with tools like `jq` to extract fields.
- **No `$TOOL_NAME`, `$TOOL_OUTPUT`, `$TOOL_INPUT` environment variables are documented.**
- The module example uses these as if they were environment variables, which is inaccurate.

**Notes:**
This is a factual error in the module. The correct pattern is to read JSON from stdin and parse it, not access environment variables. The practical effect (hooks can access tool name, input, output) is true, but the mechanism is wrong. This should be corrected.

---

## Key Missing Information

1. **Agent Teams Experimental Status:** Module should note that Agent Teams are disabled by default and require explicit enablement. Known limitations should be mentioned for a production-ready guide.

2. **Complete Hook Lifecycle:** Module lists four common hook events; should acknowledge 22+ documented events and note that PreToolUse/PostToolUse are most common for tool-level automation.

3. **Hook Communication Mechanism:** Module incorrectly suggests hooks receive environment variables; actual mechanism is stdin (JSON) and exit codes. This is a significant implementation detail.

4. **Skill Discovery in Monorepos:** Module doesn't mention that Claude Code automatically discovers skills in nested `.claude/skills/` directories, which is valuable for monorepo setups.

5. **Anthropic's Agent Patterns:** Module's composition stack aligns with Anthropic's published patterns (Routing, Parallelization, Orchestrator-Workers, etc.) but doesn't reference them. Link to [Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents) for deeper architectural guidance.

6. **Subagent vs Agent Teams:** Module doesn't contrast subagents (report results back to main agent, no inter-agent communication) with Agent Teams (teammates communicate directly with each other). This distinction is important for choosing the right tool.

---

## Sources Consulted

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) — YAML frontmatter, skill patterns, locations, scoping
- [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents) — subagent isolation, configuration, invocation
- [Automate workflows with hooks - Claude Code Docs](https://code.claude.com/docs/en/hooks-guide) — hook lifecycle, environment, communication mechanism
- [How Claude remembers your project - Claude Code Docs](https://code.claude.com/docs/en/memory) — CLAUDE.md persistence and scope
- [Orchestrate teams of Claude Code sessions - Claude Code Docs](https://code.claude.com/docs/en/agent-teams) — Agent Teams architecture, experimental status, use cases
- [Building Effective AI Agents (Anthropic Research)](https://www.anthropic.com/research/building-effective-agents) — multi-agent patterns, orchestration principles

---

## Recommendations for Module Revision

**High Priority (Accuracy):**
1. Fix hook communication mechanism: clarify stdin/JSON/exit-code model, not environment variables.
2. Add caveat to Agent Teams: experimental, disabled by default, requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`.

**Medium Priority (Clarity):**
3. Expand hook lifecycle section to note 22+ documented events; explain that the four listed are the most common.
4. Add comparison table: Subagents vs Agent Teams (communication, coordination, use cases).
5. Add note on monorepo skill discovery for nested `.claude/skills/` directories.

**Low Priority (Enrichment):**
6. Link to [Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents) for advanced pattern reference.
7. Add example of skill with dynamic context injection (`` !`<command>` `` syntax).

