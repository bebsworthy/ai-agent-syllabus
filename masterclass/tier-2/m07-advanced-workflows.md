---
title: "M07: Advanced Workflows — Skills, Subagents, and Hooks"
description: "Skills, subagents, and hooks — the workflow composition stack for team-wide automation."
---


## Overview

You've built basic prompts. Now scale to reusable, team-wide workflows. Claude Code supports a composition stack: CLAUDE.md (persistent context) → Skills (reusable instructions) → Subagents (isolated workers with independent state) → Hooks (deterministic lifecycle scripts) → MCP (external tools) → Plugins (bundled packages) → Agent Teams (coordinated parallelism).

This module teaches you to design skills that your whole team uses, create specialized subagents for security review or code quality checks, and wire hooks into your development lifecycle. By the end, you'll have at least one team skill live in production and one hook auto-running on every pull request.

**Duration:** 90 minutes (15-20 min pre-work + 60-75 min workshop + exercises)
**Hands-on:** Custom skill + subagent + hook in a real repository
**Takeaway:** At least one team skill and one hook deployed to your project


---

## Prerequisites

- M06 completion (tool design principles)
- 1-2 weeks Claude Code usage
- Familiarity with YAML frontmatter
- Access to a team Git repository
- Basic shell scripting knowledge
- Understanding of subagent scope and isolation

---

## Pre-work: Theory (15-20 minutes)

### The Workflow Composition Stack

When should you use each layer?

| Layer | What It Is | When to Use | Scope |
|-------|-----------|-----------|-------|
| **CLAUDE.md** | Persistent, repo-wide context | Project conventions, architecture docs, team standards | Whole session |
| **Skills** | Reusable instruction templates | Commands you run repeatedly (scaffold component, review PR) | Single session; triggered by `/` |
| **Subagents** | Independent sessions with their own tools/context | Parallel work, role-based isolation (security reviewer, code quality) | Independent context window |
| **Hooks** | Deterministic scripts that run before/after tool use | Auto-formatting, pre-commit validation, notifications | Triggered by lifecycle events |
| **MCP** | External integrations (databases, APIs, internal tools) | Access to systems outside Claude Code | Tool-level |
| **Plugins** | Bundled skills + MCPs + custom commands | Packaged workflows for distribution across teams | Whole environment |
| **Agent Teams** | Coordinated parallel sessions *(experimental — disabled by default)* | Large refactors, multi-component features, parallel reviews | Team-level orchestration |

> **Agent Teams — Experimental:** Agent Teams are disabled by default. To enable them, set the following environment variable before starting your session:
> ```bash
> export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
> ```
> Known limitations: no session resumption with in-process teammates, task status may lag, slow shutdown with 5+ agents, one team per session, no nested team-in-team architectures. Report issues at [github.com/anthropics/claude-code/issues](https://github.com/anthropics/claude-code/issues).

### Three Skill Patterns

Skills are instructions + optional scripts. There are three patterns:

**Pattern A: Pure Markdown**
Just text. No scripts, no tool calls.

```yaml
---
name: New Component
description: Scaffold a new React component following team conventions
disable-model-invocation: false
allowed-tools: []
---

# New Component

Create a React component with the following structure:

1. Named export function
2. PropTypes validation
3. Storybook story
4. Unit test file

Follow: components/Button.tsx as template.
```

When to use: Simple, instructional tasks that don't need external validation.

**Pattern B: Markdown + Scripts (Shell)**
Text + optional shell script that validates or post-processes.

````yaml
---
name: New API Endpoint
description: Create a new Express.js API endpoint with docs
disable-model-invocation: false
allowed-tools: []
---

# New API Endpoint

Create endpoints in src/routes/ following:

```bash
#!/bin/bash
# Validate the new endpoint
npx eslint src/routes/$1.ts
npx jest src/routes/$1.test.ts
```
````

When to use: Tasks that need validation or post-processing (linting, testing, doc generation).

**Pattern C: Markdown + MCP/Subagents**
Text + optional subagent for specialized work.

```yaml
---
name: Security Review
description: Review code for security issues using specialized subagent
disable-model-invocation: false
allowed-tools: []
---

Call the security-reviewer subagent to check for:
- SQL injection vulnerabilities
- Cross-site scripting (XSS)
- Insecure authentication patterns
```

When to use: Specialized knowledge work (security, architecture review, performance analysis).

### Skill Anatomy: YAML Frontmatter

Every skill has:

```yaml
---
name: Skill Name                    # Human-readable name
description: One-line purpose      # Shown in /skill list
disable-model-invocation: false    # false = Claude can refine skill, true = use as-is
allowed-tools: [tool1, tool2]      # Restrict which tools this skill can call
disabled: false                    # Optional: disable the skill
user-invocable: true               # false = hides from / menu; background knowledge only
argument-hint: "[component-name]"  # Autocomplete hint shown after /name
---

# Your markdown content here
Instructions, templates, examples
```

#### Progressive Disclosure

Skills follow a three-stage loading model that keeps context lean:

1. **Metadata** (name + description): Always in context (~100 tokens). Claude decides whether to load the skill based on this alone.
2. **SKILL.md body**: Loaded only when the skill is triggered.
3. **Supporting files** (templates, examples, scripts): Loaded only when referenced in the SKILL.md.

#### Writing Good Descriptions

The `description` field is the most important line in your skill — Claude uses it to decide whether to auto-invoke the skill. Write it like a natural-language request:

```yaml
# Bad — too abstract
description: Audit software artefacts for quality compliance

# Good — matches natural requests
description: >
  Review code for bugs, security issues, and style violations.
  Use when user asks to "review", "check", or "audit" code.
```

### Choosing the Right Abstraction

| Question | Use |
|----------|-----|
| Is this a reusable instruction set you run repeatedly? | **Skill** (Pattern A or B) |
| Does it need isolated reasoning or specialized domain knowledge without influencing your main context? | **Subagent** |
| Do multiple agents need to work in parallel, with coordinated output? | **Agent Team** *(experimental)* |

Quick cost note: subagents each open an independent context window; agent teams multiply that cost by the number of agents (roughly 4–15× token usage vs. a single session). Use parallelism when the tasks are genuinely independent and the speed or quality gain justifies it.

### Skill Locations and Scope

| Location | Scope | Who Sees It |
|----------|-------|-----------|
| `.claude/skills/` | Repository-local | Only this repo's Claude Code sessions |
| `~/.claude/skills/` | User-local | All your Claude Code sessions |
| `~/.claude/plugins/` | Distributed as plugin | Your whole org |

For team skills: keep them in `.claude/skills/` and commit to the repo.

### Custom Subagents in `.claude/agents/`

A subagent is a separate session with its own configuration. Define in `.claude/agents/security-reviewer.md`:

```yaml
---
name: security-reviewer
description: Security-focused code reviewer
model: claude-opus-4-1  # Or your preferred model
instructions: |
  You are a security specialist. Review code for vulnerabilities.
  Check for SQL injection, XSS, CSRF, auth bypass, data exposure.
  Return structured findings with severity levels.
tools:
  - analyze_ast
  - query_codebase
  - list_dependencies
---

# Security Reviewer

Review the provided code for security issues:

1. **SQL Injection:** Check all database queries for parameterized statements
2. **XSS:** Validate that HTML/script output is sanitized
3. **CSRF:** Verify token validation on state-changing operations
4. **Auth Bypass:** Check role-based access control enforcement
5. **Data Exposure:** Look for hardcoded secrets, PII logging

Return a structured report:
- Severity (Critical, High, Medium, Low)
- Issue type
- Location (file, line)
- Recommended fix
```

Summon a subagent in Claude Code with `@security-reviewer review this PR`.

#### Subagent Frontmatter Reference

| Field | Purpose |
|-------|---------|
| `model` | Override the session model (e.g., use `haiku` for cheap agents, `opus` for deep reasoning) |
| `tools` | Allowlist of tools the agent can use |
| `disallowedTools` | Tools to explicitly deny |
| `background: true` | Always runs as a background task (returns result asynchronously) |
| `effort` | Override effort level: `low`, `medium`, `high`, `max` |
| `isolation: worktree` | Runs in a temporary git worktree (safe for file modifications without conflicts) |

**Design principle:** Subagents cannot spawn other subagents via bash. Use the `Agent` tool for nesting.

### Hooks: Deterministic Lifecycle Scripts

Hooks run at specific lifecycle points. The four most commonly used events (out of 22+ documented) are:

| Hook | When It Fires | Use Case |
|------|---------------|----------|
| **PreToolUse** | Before any tool executes | Validate tool calls, log usage |
| **PostToolUse** | After tool completes | Auto-format output, lint results, notify team |
| **Notification** | Before displaying result to user | Custom notifications |
| **Stop** | When session ends | Cleanup, metrics, final checks |

PreToolUse and PostToolUse cover the majority of practical automation needs. The full list of available hook events:

| Event | When It Fires |
|-------|---------------|
| `PreToolUse` | Before any tool executes |
| `PostToolUse` | After a tool completes |
| `UserPromptSubmit` | When the user sends a prompt |
| `Notification` | Before displaying a result to the user |
| `Stop` | When a session ends |
| `SessionStart` | When a new session begins |
| `SessionEnd` | When a session is closed |
| `PreCompact` | Before context compaction runs |
| `SubagentStart` | When a subagent is spawned |
| `SubagentStop` | When a subagent completes |
| `TeammateIdle` | When a teammate in an Agent Team finishes its task |
| `TaskCompleted` | When a shared task list item is marked done |
| `PermissionRequest` | When Claude requests permission for an action |
| `ConfigChange` | When settings are modified |
| `Setup` | During initial project setup |

See the [Claude Code Hooks documentation](https://code.claude.com/docs/en/hooks-guide) for payload details and examples.

#### Alternative: Inline Hook Configuration via settings.json

Instead of shell scripts, you can configure hooks directly in `settings.json` (or via `/hooks`). This is simpler for straightforward automation:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{ "type": "command", "command": "npm run lint --fix" }]
    }],
    "PreToolUse": [{
      "matcher": "Bash(git commit*)",
      "hooks": [{ "type": "command", "command": "npm test" }]
    }],
    "Stop": [{
      "hooks": [{ "type": "command", "command": "osascript -e 'display notification \"Claude is done\" with title \"Claude Code\"'" }]
    }]
  }
}
```

The `matcher` field supports glob patterns to target specific tool calls. Use shell scripts (`.claude/hooks/`) for complex logic; use `settings.json` for simple one-liners.

Hooks live in `.claude/hooks/` as shell scripts. They receive a JSON payload on **stdin** (not environment variables) and signal outcomes via exit codes:

```bash
# .claude/hooks/post_tool_use.sh
#!/bin/bash

# Read JSON payload from stdin
TOOL_INFO=$(cat)
TOOL_NAME=$(echo "$TOOL_INFO" | jq -r '.tool_name')
TOOL_INPUT=$(echo "$TOOL_INFO" | jq -r '.tool_input')
TOOL_OUTPUT=$(echo "$TOOL_INFO" | jq -r '.tool_output // empty')

# Auto-lint any TypeScript written to src/
if [[ "$TOOL_NAME" == "write_file" ]] && echo "$TOOL_INPUT" | jq -r '.path' | grep -q "^src/"; then
  FILE_PATH=$(echo "$TOOL_INPUT" | jq -r '.path')
  npx eslint --fix "$FILE_PATH"
  echo "✓ Auto-linted $FILE_PATH"
fi

# Notify Slack if a deployment was triggered
if [[ "$TOOL_NAME" == "trigger_deployment" ]]; then
  curl -X POST "$SLACK_WEBHOOK" \
    -d "{\"text\": \"Deployment triggered\"}"
fi
```

Hooks receive a JSON object on stdin. Common fields:
- `tool_name` — which tool ran
- `tool_input` — the arguments passed to the tool (object)
- `tool_output` — the tool's result (PostToolUse only)
- `session_id` — the current session identifier

Exit code `0` = success; non-zero = signal an error condition to Claude.

---

## Workshop

The hands-on session for this module: [**M07: Advanced Workflows — Workshop Guide**](/workshops/m07-workshop/)

## Takeaway

You now own:
- ✓ At least one team skill (live in `.claude/skills/`)
- ✓ One custom subagent (in `.claude/agents/`)
- ✓ One hook automatically running on your workflow
- ✓ A documented pattern for reusable instructions

**Apply immediately:**
- Commit skills/hooks to your repo
- Document in your team wiki
- Have the team use the skill for 1-2 real features
- Collect feedback and iterate

---

## Key Concepts

**Skill:**
A reusable instruction template triggered by `/skill-name`. Can be pure markdown or include scripts/subagents.

**Subagent:**
An independent session with its own configuration, tools, and context window. Useful for specialized work (security review, code quality, architecture) without biasing the main agent.

**Hook:**
A deterministic script running at lifecycle points (PreToolUse, PostToolUse, Notification, Stop). Enables automation: auto-linting, validation, notifications.

**Composition Stack:**
CLAUDE.md → Skills → Subagents → Hooks → MCP → Plugins → Agent Teams. Each layer has a specific purpose; use the right layer for the job. Agent Teams are experimental and require `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` to enable.

**Pattern A/B/C:**
- A: Pure markdown (instructional)
- B: Markdown + scripts (validation)
- C: Markdown + subagents (specialized knowledge)

---

## References

- **Claude Code Skills Documentation:** https://code.claude.com/docs/en/skills
- **Subagents Guide:** https://code.claude.com/docs/en/sub-agents
- **Hooks Documentation:** https://code.claude.com/docs/en/hooks-guide
- **Agent Teams Documentation:** https://code.claude.com/docs/en/agent-teams
- **Building Effective AI Agents (Anthropic Research):** https://www.anthropic.com/research/building-effective-agents
- **YAML Syntax:** https://yaml.org/
- **Team Workflow Best Practices:** (Anthropic internal; shared in workshop)
