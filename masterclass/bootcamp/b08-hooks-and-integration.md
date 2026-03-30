---
title: "08: Hooks, Automation & What's Next"
description: "Add automatic quality gates, run an end-to-end workflow, and see the features waiting beyond this bootcamp."
sidebar:
  label: "08: Hooks & Beyond"
  order: 8
---

**35 minutes | You need: everything from modules 1-7**

## How Hooks Work

Hooks are deterministic scripts that fire at lifecycle events. Unlike skills (AI-decided instructions), hooks **always run** when their trigger condition is met. They're your quality gates — the things that must happen regardless of what Claude decides.

## Do This

### 1. Build an auto-lint hook

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

Make an edit and watch the linter fire automatically after every file write. Claude sees the linter output and adjusts if there are issues.

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

Try committing — tests run first. If they fail, the commit is blocked and Claude sees why.

### 3. Beyond shell commands

Hooks aren't limited to shell scripts:

**HTTP hooks** — call a webhook when something happens:
```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{ "type": "http", "url": "https://your-slack-webhook.com/...", "method": "POST" }]
    }]
  }
}
```

**MCP tool hooks** — trigger an MCP tool as a hook action.

**The full event lifecycle:**

| Event | When | Best for |
|-------|------|----------|
| `PreToolUse` | Before a tool executes | Block dangerous ops, validate inputs, run tests before commits |
| `PostToolUse` | After a tool completes | Auto-lint, auto-format, post-edit validation |
| `Stop` | Session ends | Cleanup, notifications, summary logging |
| `SessionStart` | Session begins | Load project setup, check environment |

### 4. End-to-end: everything together (15 min)

Pick a real task from your backlog and run the full workflow. This time you're not learning — you're working:

**1. Spec it** — `Shift+Tab` into Plan Mode. Write a clear spec with requirements and acceptance criteria (Module 3).

**2. Research** — Ask Claude to delegate the investigation:
```text
Use a subagent to explore how [relevant module] currently works, what patterns it uses, and what I need to be careful about when making changes.
```
Your context stays clean (Module 4).

**3. Execute** — Exit Plan Mode. Let Claude implement with your CLAUDE.md guiding conventions (Module 2). Hooks auto-lint on every write.

**4. Review with a skill** — Run `/simplify` or your custom review skill (Module 6). It runs in a subagent — your context stays clean.

**5. Ship** — Claude creates the PR via GitHub MCP or `gh` CLI (Module 7). Tests run before commit (your safety hook).

**6. Read the diff** — Before merging, review what changed and why.

Notice what just happened: you specified the *what*, Claude handled the *how*, hooks enforced quality, skills provided reusable workflows, subagents kept your context lean, and MCP connected to your external tools. This is the stack:

```text
CLAUDE.md      → persistent conventions (loaded every request)
Skills         → reusable workflows (loaded on demand)
Subagents      → isolated workers (separate context windows)
Hooks          → deterministic gates (always fire)
MCP            → external tools (GitHub, databases, monitoring)
```

## What's Next

This bootcamp covered the core workflow. Here's what's waiting when you need it:

### Agent teams
Orchestrate multiple Claude instances working on the same codebase — one on frontend, one on backend, one on tests, coordinating through shared tasks and inter-agent messaging.

### Scheduled tasks & `/loop`
Run prompts on a recurring schedule. `/loop 5m "check the deploy status"` polls every 5 minutes. `/schedule` creates cloud-based cron jobs that run without your terminal open.

### Headless mode & CI/CD
Run Claude in your CI pipeline: `claude --headless --print "Review this PR for security issues"`. No interactive terminal needed. Works in GitHub Actions, GitLab CI, and any pipeline that can run a command.

### Channels
Push events into a running Claude session from external systems — CI results, monitoring alerts, chat messages. Claude reacts while you're away.

### Computer use & Chrome
Claude can control your screen (macOS), open apps, click buttons, fill forms. The Chrome integration lets Claude test web apps, debug UI issues, and extract data from web pages.

### Remote control
Start a session in your terminal, continue it from your phone via claude.ai/code. Or dispatch new sessions from mobile to your machine.

### Plugins
Package skills, agents, hooks, and MCP servers into distributable plugins. Create and share plugin marketplaces within your organization.

:::note[Why this matters]{icon="approve-check"}
Hooks guarantee quality gates that don't depend on human discipline. Combined with skills, subagents, and MCP, you have a complete automation stack. The difference between "using Claude Code" and "being productive with Claude Code" is building these layers so they work together without friction.
:::

## Artifact

Two working hooks (auto-lint + pre-commit tests). A completed end-to-end workflow on a real task using the full stack.

## Go Deeper

[Playbook M07 — Advanced Workflows](/tier-2/m07-advanced-workflows/) for the full hook lifecycle, plugins, and agent teams. [Playbook M08 — Security](/tier-2/m08-security/) for security-reviewer subagents and prompt injection defense. [Playbook M12 — CI/CD](/tier-3/m12-cicd-integration/) for headless mode and pipeline integration.

*You've completed the bootcamp. You have: a CLAUDE.md, Plan Mode + thinking controls, context management habits, daily workflow patterns, a custom skill, MCP connections, and automated quality hooks. For the full picture — theory, security, team adoption, CI/CD — see the [AI-Augmented Development Playbook](/tier-1/).*
