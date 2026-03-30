# M07: Advanced Workflows — Skills, Subagents, and Hooks

## Overview

You've built basic prompts. Now scale to reusable, team-wide workflows. Claude Code supports a composition stack: CLAUDE.md (persistent context) → Skills (reusable instructions) → Subagents (isolated workers with independent state) → Hooks (deterministic lifecycle scripts) → MCP (external tools) → Plugins (bundled packages) → Agent Teams (coordinated parallelism).

This module teaches you to design skills that your whole team uses, create specialized subagents for security review or code quality checks, and wire hooks into your development lifecycle. By the end, you'll have at least one team skill live in production and one hook auto-running on every pull request.

**Duration:** 90 minutes (15-20 min pre-work + 60-75 min workshop + exercises)
**Hands-on:** Custom skill + subagent + hook in a real repository
**Takeaway:** At least one team skill and one hook deployed to your project

> **Workshop:** [M07-Advanced-Workflows-workshop.md](M07-Advanced-Workflows-workshop.md)

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
| **Agent Teams** | Coordinated parallel sessions | Large refactors, multi-component features, parallel reviews | Team-level orchestration |

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
---

# Your markdown content here
Instructions, templates, examples
```

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

### Hooks: Deterministic Lifecycle Scripts

Hooks run at specific points:

| Hook | When It Fires | Use Case |
|------|---------------|----------|
| **PreToolUse** | Before any tool executes | Validate tool calls, log usage |
| **PostToolUse** | After tool completes | Auto-format output, lint results, notify team |
| **Notification** | Before displaying result to user | Custom notifications |
| **Stop** | When session ends | Cleanup, metrics, final checks |

Hooks live in `.claude/hooks/` as shell scripts:

```bash
# .claude/hooks/post_tool_use.sh
#!/bin/bash

# Auto-lint any code written to src/
if [[ "$TOOL_OUTPUT" =~ "src/" ]]; then
  npx eslint --fix "$TOOL_OUTPUT"
  echo "✓ Auto-linted"
fi

# Notify Slack if a deployment was triggered
if [[ "$TOOL_NAME" == "trigger_deployment" ]]; then
  curl -X POST $SLACK_WEBHOOK \
    -d '{"text": "Deployment triggered: '$TOOL_OUTPUT'"}'
fi
```

Hooks receive environment variables:
- `$TOOL_NAME` — which tool ran
- `$TOOL_OUTPUT` — the tool's result
- `$TOOL_INPUT` — what was passed to the tool

---

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

**Consolidation Stack:**
CLAUDE.md → Skills → Subagents → Hooks → MCP → Plugins → Agent Teams. Each layer has a specific purpose; use the right layer for the job.

**Pattern A/B/C:**
- A: Pure markdown (instructional)
- B: Markdown + scripts (validation)
- C: Markdown + subagents (specialized knowledge)

---

## References

- **Claude Code Skills Documentation:** https://claude.com/docs/skills
- **Subagents Guide:** https://claude.com/docs/subagents
- **Hooks Documentation:** https://claude.com/docs/hooks
- **YAML Syntax:** https://yaml.org/
- **Team Workflow Best Practices:** (Anthropic internal; shared in workshop)
