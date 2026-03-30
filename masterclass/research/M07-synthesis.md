# M07 Synthesis: Advanced Workflows

**Module Grade:** B+ / B–
**Research Date:** March 2026

---

## Executive Summary

M07 provides **solid foundational coverage** of Claude Code's composition stack (CLAUDE.md → Skills → Subagents → Hooks → MCP → Plugins → Agent Teams) and aligns well with CS146S Week 4 pedagogical goals. All major claims about skills, subagents, hooks, and persistent context are verified against official Claude Code documentation and aligned with Anthropic's principles from CS146S. However, **two critical factual errors** require correction (hooks communication mechanism, Agent Teams experimental status), and **significant gaps exist** in coverage of 2024-2025 developments (MCP ecosystem evolution, parallel execution patterns, reliability frameworks, flow engineering). The module is appropriate for intermediate learners but lacks production-readiness guidance and emerging best practices.

---

## Cross-Agent Findings (Convergent Issues)

**Issues flagged by 2+ agents — highest priority:**

### 1. Hook Communication Mechanism Error (2+ agents)
- **Finding:** Both M07-additional-info and M07-more-info identify the same factual error
- **Issue:** Module claims hooks receive environment variables (`$TOOL_NAME`, `$TOOL_OUTPUT`, `$TOOL_INPUT`)
- **Reality:** Hooks communicate via **stdin (JSON)** and exit codes, not environment variables
- **Impact:** HIGH — This is a blocking implementation detail that will cause teams to fail when implementing hooks
- **Source:** Official [Automate workflows with hooks](https://code.claude.com/docs/en/hooks-guide) documentation

### 2. Agent Teams Experimental Status (2+ agents)
- **Finding:** Both M07-additional-info and M07-more-info flag this omission
- **Issue:** Module lists "Agent Teams" as a composition layer without noting they are **experimental and disabled by default**
- **Reality:** Requires explicit `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable to enable
- **Impact:** MEDIUM — Students will expect this to work out-of-the-box; needs caveat
- **Source:** Official [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams) documentation

### 3. Incomplete Hook Lifecycle Coverage (2+ agents)
- **Finding:** Both M07-additional-info and M07-more-info note the module presents a simplified view
- **Issue:** Module lists 4 hook events (PreToolUse, PostToolUse, Notification, Stop)
- **Reality:** 22+ documented hook events exist (SessionStart, SubagentStart, ConfigChange, etc.)
- **Impact:** MEDIUM — Appropriate for introductory purposes, but should note "common" vs. "complete"
- **Source:** Official [Automate workflows with hooks](https://code.claude.com/docs/en/hooks-guide) documentation

---

## Factual Corrections Required

### Correction 1: Hook Communication Mechanism

**What module says:**
> "Hooks receive environment variables: $TOOL_NAME, $TOOL_OUTPUT, $TOOL_INPUT"

**Correct information:**
Hooks communicate via stdin/stdout/stderr with JSON payloads:
```bash
# Correct hook pattern
cat << 'EOF'  # reads JSON from stdin
{"session_id": "...", "tool_name": "Bash", "tool_input": {"command": "..."}}
EOF

# Parse with jq
TOOL_NAME=$(cat | jq -r '.tool_name')
TOOL_INPUT=$(cat | jq -r '.tool_input')
```

**Source:** [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide)

**Action:** Rewrite hooks section with correct stdin/JSON pattern and provide corrected examples.

---

### Correction 2: Agent Teams Experimental Status

**What module says:**
> "Agent Teams... Coordinated parallel sessions" (without experimental caveat)

**Correct information:**
Agent Teams are **experimental and disabled by default**. Require:
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Known limitations: no session resumption with in-process teammates, task status lag, slow shutdown, one team per session, no nested teams.

**Source:** [Claude Code Agent Teams Docs](https://code.claude.com/docs/en/agent-teams)

**Action:** Add caveat box in Agent Teams section noting experimental status and limitations.

---

## Content Gaps

### High Priority (Core to M07)

1. **Parallel Execution Patterns & Trade-offs** (M07-more-info)
   - Module mentions Agent Teams but provides no guidance on when to parallelize vs. serialize
   - Missing: Fan-out/fan-in, scatter-gather, parallel redundancy patterns
   - Missing: Token cost trade-offs (4–15× for multi-agent work)
   - Impact: Teams lack decision criteria for parallelism

2. **MCP Server Ecosystem** (M07-more-info, M07-cross-check)
   - Module lists MCP in stack but omits:
     - MCP Registry (https://modelcontextprotocol.io/specification/2025-11-25)
     - Pre-built servers (Google Drive, Slack, GitHub, Postgres, Puppeteer)
     - When to use pre-built vs. custom MCP servers
   - Impact: Teams reinvent integrations instead of discovering existing ones

3. **Flow Engineering & Orchestration Patterns** (M07-more-info)
   - Module teaches components (Skills, Subagents, Hooks) as reusable pieces
   - Missing: How these components flow together (Reflection, Routing, Guardrails, Communication, Memory)
   - Missing: Connection to Anthropic's published "Building Effective Agents" patterns
   - Impact: Teams lack architectural thinking beyond component stacking

4. **Reliability & Error Recovery** (M07-more-info)
   - Hooks section shows auto-linting; missing:
     - Semantic validation patterns (SHIELDA, Sherlock frameworks)
     - Structured error recovery (retry logic, escalation policies)
     - Observability and debugging hooks
   - Impact: Production workflows lack reliability guarantees

### Medium Priority (Important Enhancements)

5. **Skill vs. Subagent vs. Agent Teams Decision Criteria** (M07-more-info)
   - Module provides patterns but no explicit decision tree
   - Missing: When to stop using Skills and start using Subagents
   - Impact: Teams have trial-and-error implementation

6. **State Management in Multi-Subagent Workflows** (M07-more-info)
   - Module treats subagents as stateless workers
   - Missing: Context reuse across subagents, long-running workflows, token efficiency
   - Missing: Microsoft Foundry patterns (long-term memory, observation masking)
   - Impact: Multi-subagent systems inefficient; context windows explode

7. **Skill Discovery in Monorepos** (M07-additional-info)
   - Module doesn't mention automatic skill discovery in nested `.claude/skills/` directories
   - Impact: Monorepo teams miss important scoping feature

8. **Progressive Autonomy & Trust Calibration** (M07-cross-check)
   - Module assumes hooks and skills are ready for deployment
   - Missing: 4-week rollout strategy from CS146S Week 4
   - Impact: Over-automation risks without staged validation

### Low Priority (Contextual References)

9. **Comparison with Emerging Frameworks** (M07-more-info)
   - Module doesn't mention LangGraph, CrewAI, Microsoft Agent Framework
   - Useful for context but not blocking for Claude Code learners

10. **Anthropic's Multi-Agent Research System** (M07-more-info)
    - Case study showing lead-specialist pattern (90% improvement vs. single-agent)
    - Reference implementation for M07's Agent Teams

---

## Outdated Content

**No content identified as actively superseded.** However, several topics have evolved significantly since the module was written:

1. **MCP has matured dramatically:** From experimental (2024) to industry standard (2025). Module predates this.
2. **Agent Teams capabilities expanded:** Now support parallel execution; module treats as sequential.
3. **Reliability frameworks emerged:** SHIELDA, Sherlock (2024-2025); not yet in M07.
4. **Flow engineering as discipline:** 2025-2026 shift from prompt engineering to flow design; module still component-focused.

None of this makes existing content wrong, just incomplete.

---

## Strengths to Preserve

1. **Tactical Implementation Guidance:** M07's YAML syntax, directory structure, hook lifecycle, and three-pattern framework (A/B/C) are clear and actionable. This is unique value vs. CS146S.

2. **Strategic Alignment with CS146S:** Strong complementarity with Week 4's "Good Context Good Code" principle. M07 operationalizes the context quality idea.

3. **Composition Stack Metaphor:** Clear mental model for layering CLAUDE.md → Skills → Subagents → Hooks → MCP → Plugins → Agent Teams.

4. **Subagent Isolation Pattern:** Well-explained concept of independent sessions for specialized work (security reviewer, code quality checker). Practical and immediately useful.

5. **CLAUDE.md Persistence:** Clear explanation of how repo-wide context survives and reinforces team standards.

6. **Skill Patterns (A/B/C):** Pedagogically useful categorization of pure markdown, markdown+scripts, and markdown+subagents approaches.

---

## Prioritized Improvement Plan

### Priority 1 — Must Fix

#### 1.1 Fix Hook Communication Mechanism (HIGH IMPACT)
**Why:** Blocking implementation error. Teams will fail when implementing hooks.
**Effort:** 30 minutes
**What to do:**
- Rewrite hooks section with correct stdin/JSON pattern
- Provide corrected code examples
- Include jq parsing snippet
- Reference official documentation

**Implementation:**
```bash
# Correct pattern
#!/bin/bash
# Hooks receive JSON on stdin, not environment variables
TOOL_INFO=$(cat)
TOOL_NAME=$(echo "$TOOL_INFO" | jq -r '.tool_name')
TOOL_INPUT=$(echo "$TOOL_INFO" | jq -r '.tool_input')

# Example: Validate code after generation
if [[ "$TOOL_NAME" == "generate_code" ]]; then
  node --check <(echo "$TOOL_INPUT" | jq -r '.code') || {
    echo "Syntax error; requesting retry with constraints"
    exit 1
  }
fi
```

---

#### 1.2 Add Agent Teams Experimental Status Caveat (MEDIUM IMPACT)
**Why:** Students expect this to work out-of-the-box; needs explicit warning.
**Effort:** 15 minutes
**What to do:**
- Add warning box to Agent Teams section
- Document required environment variable
- List known limitations
- Provide issue tracking link

**Implementation:**
```markdown
## ⚠️ EXPERIMENTAL FEATURE
Agent Teams are currently **experimental and disabled by default**. To use them:

1. Enable via environment variable:
   ```bash
   export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
   ```

2. Known limitations:
   - No session resumption with in-process teammates
   - Task status may lag
   - Slow shutdown observed with 5+ agents
   - One team per session
   - No nested team-in-team architectures

3. Report issues: [Claude Code GitHub Issues](https://github.com/anthropics/claude-code/issues)
```
```

---

#### 1.3 Clarify Hook Lifecycle Coverage (MEDIUM IMPACT)
**Why:** Module presents simplified view without context.
**Effort:** 20 minutes
**What to do:**
- Add note: "These are the most common hook types; 22+ total events exist"
- Provide table of all events with brief descriptions
- Link to official documentation
- Emphasize that PreToolUse/PostToolUse cover 80% of use cases

---

### Priority 2 — Should Add

#### 2.1 Parallel Execution Patterns & Trade-offs (HIGH VALUE)
**Why:** Agent Teams enable parallelism; module provides no guidance on when to use it.
**Effort:** 1.5 hours
**What to add:**
- When to parallelize vs. serialize (decision matrix)
- Token cost trade-offs (4–15× multiplier)
- Common patterns: Fan-out/fan-in, scatter-gather, domain-based routing
- Example: Parallel security + quality review workflow

**Implementation:**
```markdown
## When to Use Parallel Execution (Agent Teams)

### Parallelize if:
- Work is **independent** (security review and code quality check don't depend on each other)
- **High-value tasks** (ROI justifies 4–15× token cost)
- **Latency matters** (customer-facing, time-sensitive)

### Serialize if:
- Work has **sequential dependencies** (output of task A feeds task B)
- **Cost-sensitive** (token budget is tight)
- **Simple tasks** (parallelism overhead not worth it)

### Example: Parallel Review Pattern
```yaml
# .claude/agents/parallel-reviewer.md
---
name: parallel-reviewer
---

Security review: Check for SQL injection, XSS, auth bypass
Quality review: Check for complexity, duplication, test coverage

Findings merged and presented to human reviewer.
```
```

---

#### 2.2 MCP Ecosystem & Pre-built Servers (HIGH VALUE)
**Why:** Teams should know to search registry before building custom servers.
**Effort:** 1 hour
**What to add:**
- MCP Registry link and overview
- Pre-built servers available (Google Drive, Slack, GitHub, Git, Postgres, Puppeteer)
- Decision: when to use pre-built vs. custom
- Example integration workflow

**Implementation:**
```markdown
## MCP in Your Composition Stack

### Discover Pre-Built Servers
Before building a custom MCP server, check the [MCP Registry](https://registry.modelcontextprotocol.io/).

Common pre-built servers:
- **Google Drive**: Docs, Sheets, Drive access
- **Slack**: Channel messages, user info, posting
- **GitHub**: Issues, PRs, repo content
- **Git**: Clone, browse, diff repositories
- **Postgres**: Query databases directly
- **Puppeteer**: Browser automation, screenshots

### Decision: Pre-Built vs. Custom
- **Use pre-built if:** Your tool is available and maintained
- **Use custom if:** Your tool is proprietary, internal, or specialized

### Example: Integrating Slack MCP
```yaml
mcp:
  slack:
    type: slack
    config:
      bot_token: ${SLACK_BOT_TOKEN}
```
```

---

#### 2.3 Flow Engineering & Orchestration Patterns (HIGH VALUE)
**Why:** Industry shift from component-focused to flow-focused; M07 is outdated.
**Effort:** 2 hours
**What to add:**
- Reframe composition stack as **flow patterns**, not just layers
- Five key patterns: Reflection, Routing, Communication, Guardrails, Memory
- Examples of each pattern in M07's context
- Link to Anthropic's "Building Effective Agents" research

**Implementation:**
```markdown
## Flow Engineering: Beyond Component Stacking

The composition stack (Skills, Subagents, Hooks, MCP) are building blocks. **Flow** is how they connect.

### Five Key Flow Patterns

1. **Reflection**: Generate → Critique → Refine
   - Use: PostToolUse hook + specialist subagent for review
   - Example: Code generated → Security reviewer critiques → Retried with constraints

2. **Routing**: Route based on intent or domain
   - Use: Skills with conditional logic, or subagent dispatcher
   - Example: User request → Route to frontend OR backend specialist → Solve

3. **Communication**: Explicit messaging between agents
   - Use: Agent Teams for peer-to-peer coordination
   - Example: Security agent finds vulnerability → Quality agent incorporates fix

4. **Guardrails**: Validate outputs before returning
   - Use: PostToolUse hook for semantic validation
   - Example: Generated code → Syntax check → Type check → Return to user

5. **Memory**: Maintain state across sessions
   - Use: Context store tool (custom MCP) for shared findings
   - Example: Research findings from subagent A → Stored → Subagent B retrieves

### Example: Code Review Flow
```
Input code
  ↓
Reflection: Generate review → Specialist critiques → Refine
  ↓
Routing: Route critical issues to security specialist
  ↓
Guardrails: Validate all suggestions are syntactically correct
  ↓
Communication: Aggregate findings across agents
  ↓
Output: Unified review for human approval
```
```

---

#### 2.4 Reliability Patterns for Production (MEDIUM VALUE)
**Why:** Hooks can do more than auto-linting; modules need reliability guidance.
**Effort:** 1 hour
**What to add:**
- Semantic validation in PostToolUse hooks
- Intelligent retry patterns (exponential backoff)
- Structured error recovery
- Observability hooks (logging, metrics)

**Implementation:**
```markdown
## Hooks for Reliability

### Pattern: Semantic Validation
```bash
#!/bin/bash
# .claude/hooks/post_tool_use.sh

TOOL_INFO=$(cat)
TOOL_NAME=$(echo "$TOOL_INFO" | jq -r '.tool_name')

# Example: Validate generated code syntax
if [[ "$TOOL_NAME" == "generate_code" ]]; then
  CODE=$(echo "$TOOL_INFO" | jq -r '.tool_output.code')
  if ! node --check <(echo "$CODE") 2>/dev/null; then
    echo "Syntax error in generated code; requesting retry"
    exit 1
  fi
fi
```

### Pattern: Intelligent Retry
```bash
# Detect temporary failures, retry with backoff
if grep -q "timeout\|connection refused\|ECONNREFUSED" <<< "$TOOL_OUTPUT"; then
  BACKOFF=$((RANDOM % 5 + 1))
  sleep $BACKOFF
  exit 2  # Signal retry to orchestrator
fi
```

### Pattern: Observability
```bash
# Log tool invocations for debugging
echo "{\"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"tool\": \"$TOOL_NAME\", \"status\": \"$?\"}" >> ~/.claude/hooks.log
```
```

---

#### 2.5 Skill vs. Subagent vs. Agent Teams Decision Criteria (MEDIUM VALUE)
**Why:** Module shows patterns but no explicit when-to-use guidance.
**Effort:** 45 minutes
**What to add:**
- Decision tree for choosing the right abstraction
- Comparison table with use cases
- Token cost and isolation trade-offs

**Implementation:**
```markdown
## Decision: Skill vs. Subagent vs. Agent Teams

| Aspect | Skill | Subagent | Agent Team |
|--------|-------|----------|-----------|
| **Isolation** | None (shared context) | Full (independent session) | Full (independent sessions) |
| **Communication** | Inline | Report back to parent | Peer-to-peer |
| **Token Cost** | Baseline | +1× (new context) | +N× (N agents) |
| **When to use** | Reusable instructions | Specialized reasoning, domain knowledge | Parallel, coordinated work |

### Decision Tree
- **Is this a reusable instruction set?** → Skill (Pattern A/B)
- **Does it need isolated reasoning or specialized domain knowledge?** → Subagent
- **Do multiple agents need to work in parallel with peer communication?** → Agent Team
```

---

### Priority 3 — Nice to Have

#### 3.1 State Management in Multi-Subagent Workflows
**Why:** Long-running or multi-step orchestrations need context reuse strategies.
**Effort:** 1 hour
**Impact:** Enables production-scale workflows

---

#### 3.2 Reference Anthropic's Multi-Agent Research System
**Why:** Provides case study showing 90% improvement with lead-specialist pattern.
**Effort:** 30 minutes
**Impact:** Grounds M07 in Anthropic's own practices

---

#### 3.3 Mention A2A Protocol for Distributed Networks
**Why:** Beyond Claude Code; for teams needing cross-platform coordination.
**Effort:** 30 minutes
**Impact:** Contextualizes M07 within broader agent ecosystem

---

## Source Summary

### Primary Sources (Convergent Findings)

**M07-cross-check.md:**
- Validates core claims against CS146S Week 2, 4, 5
- Identifies 10 Tier 1/2 recommendations (Ensemble Review, Trust Calibration, Documentation Prerequisites)
- Confirms strong alignment between M07 and CS146S strategy

**M07-additional-info.md:**
- Verifies YAML frontmatter, skill patterns, skill locations against official Claude Code docs
- Identifies two factual errors: hook communication mechanism, Agent Teams experimental status
- Notes hook lifecycle incomplete (4 of 22+ events)
- References [Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents)

**M07-more-info.md:**
- Catalogs 10 major developments (2024-2025) relevant to M07
- Maps emerging frameworks (LangGraph, CrewAI) and protocols (A2A, MCP 2025 updates)
- Identifies flow engineering shift as industry trend
- Recommends 8 major additions for production readiness

### Documentation Sources
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents)
- [Automate workflows with hooks](https://code.claude.com/docs/en/hooks-guide)
- [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams)
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [Building Effective AI Agents (Anthropic Research)](https://www.anthropic.com/research/building-effective-agents)

---

## Assessment & Grading Rationale

**Module Grade: B+ / B–** (Depends on correction of Priority 1 issues)

**Rationale:**

- **Strengths (+)**: Solid tactical guidance, clear composition stack metaphor, well-aligned with CS146S, appropriate patterns for intermediate learners
- **Weaknesses (-)**: Two blocking factual errors (hooks, Agent Teams), significant gaps in production practices (parallelism, reliability, flow engineering), predates 2024-2025 developments
- **If Priority 1 fixed**: B+ (solid, with recommended enhancements)
- **If Priority 1 not fixed**: C+ (blocking errors prevent implementation)

**Improvement Path:** With Priority 1 corrections + Priority 2 enhancements, M07 becomes an A/A– masterclass covering both Claude Code fundamentals and emerging best practices.

---

**End of Synthesis Report**
**Research completed:** March 28, 2026
**Status:** RESEARCH ONLY — No modifications to M07 made
