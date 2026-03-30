---
title: "08: Hooks and Putting It All Together"
description: "Add automatic quality gates and run an end-to-end workflow combining everything you've built."
sidebar:
  label: "08: Hooks & Integration"
  order: 8
---

**30 minutes | You need: everything from modules 1-7**

## Setup

Open Claude Code in your project. You should have: a CLAUDE.md (Module 2), Plan Mode experience (Module 3), at least one skill (Module 6), and at least one MCP connection (Module 7).

## Do This

### 1. Build an auto-lint hook

Hooks are deterministic scripts that fire at lifecycle events. Unlike skills (instructions for Claude), hooks always run — they're not AI-decided.

Configure via `/hooks` or add directly to your settings:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{ "type": "command", "command": "npm run lint --fix" }]
    }]
  }
}
```

Now make an edit and watch the linter run automatically after every file write.

### 2. Build a safety hook

Run tests before any git commit:

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash(git commit*)",
      "hooks": [{ "type": "command", "command": "npm test" }]
    }]
  }
}
```

Try committing — the tests run first. If they fail, the commit is blocked.

### 3. End-to-end workflow (15 min)

Combine everything into a single real task from your backlog:

1. **Spec it** — Enter Plan Mode with a clear spec (Module 3)
2. **Research first** — Ask Claude to use a subagent to explore the relevant codebase area (Module 4)
3. **Implement** — Let Claude code with your CLAUDE.md guiding conventions (Module 2)
4. **Watch the hooks fire** — Lint hook auto-runs on every file write, test hook runs before commits
5. **Use your skill** — If the task matches your custom skill, invoke it (Module 6)
6. **Ship it** — Create a PR via GitHub MCP (Module 7)
7. **Review the diff** — Before approving, read what changed and why

This is the workflow stack in action:

```text
CLAUDE.md          → persistent context (your conventions)
Skills             → reusable instructions (your team's playbook)
Subagents          → isolated workers (research without polluting context)
Hooks              → deterministic automation (lint, test, format)
MCP                → external tools (GitHub, databases, monitoring)
```

### 4. Know the hook events

The most useful events:

| Event | When it fires | Use case |
|-------|--------------|----------|
| `PreToolUse` | Before a tool executes | Block dangerous commands, validate inputs |
| `PostToolUse` | After a tool completes | Auto-lint, auto-format, notify |
| `Stop` | When session ends | Cleanup, send notification |
| `SessionStart` | When session begins | Load project-specific setup |

:::note[Why this matters]{icon="approve-check"}
Hooks guarantee quality gates that don't depend on remembering to run them. A team with lint + test hooks catches issues automatically, every time, without human discipline. Combined with skills and MCP, you have a complete workflow automation stack.
:::

## Artifact

Two working hooks (auto-lint + pre-commit tests). A completed end-to-end workflow on a real task using all five layers of the stack.

## Go Deeper

[Playbook M07 — Advanced Workflows](/tier-2/m07-advanced-workflows/) for the full hook lifecycle (15+ events), plugins for packaging and distribution, and agent teams for coordinated multi-agent work. [Playbook M08 — Security](/tier-2/m08-security/) for security-reviewer subagents. [Playbook M12 — CI/CD](/tier-3/m12-cicd-integration/) for headless mode and pipeline integration.

*You've completed Claude Code in a Day. You have: a CLAUDE.md, Plan Mode fluency, context management habits, daily workflow templates, a custom skill, MCP connections, and automated quality hooks. For the full picture — theory, security, team adoption, CI/CD — see the [AI-Augmented Development Playbook](/tier-1/).*
