---
title: "01: Install & First Contact"
description: "Install Claude Code, understand the agentic loop, and do real work on your codebase in 20 minutes."
sidebar:
  label: "01: Install & First Contact"
  order: 1
---

**20 minutes | You need: a real project, admin access, internet**

## How Claude Thinks

Before you type anything, understand the engine. Claude Code is an **agentic loop**: you give a prompt, Claude decides which tools to use (read files, search code, run commands, edit files), executes them, reads the results, and decides next steps. It repeats until the task is done or it needs your input.

There is no pre-indexing, no background embedding, no project database. Claude reads your codebase on-demand using filesystem tools (Glob for finding files, Grep for searching content, Read for reading them). This means:
- First prompt in a new session is slower (Claude is mapping your project)
- Claude only knows what it has read — it can miss things in files it hasn't opened
- Your first exploratory question builds a mental map that improves everything after

This matters because **context is finite**. Every file Claude reads, every tool output, every message — it all consumes tokens from a shared window. You'll learn to manage this in Module 4. For now, just know: Claude is not omniscient, it's an agent that reads and acts.

## Install

| Platform | Command |
|----------|---------|
| macOS | `brew install claude-code` |
| Linux | `curl -sSL install.claude.ai/linux \| bash` |
| Windows | `winget install Anthropic.ClaudeCode` |
| npm fallback | `npm install -g @anthropic-ai/claude-code` |
| **VS Code** | Install the **Claude Code** extension from the marketplace — same capabilities, GUI interface |

Verify: `claude --version`

## Launch

```bash
cd your-project
claude
```

Browser opens for one-time auth. Credentials stored in `~/.claude/`.

## Do This

### 1. Explore your project

```text
What does this project do? Describe the architecture, main entry points, and how data flows through it.
```

Review the output. Notice how Claude uses tools — it's reading files, searching for patterns, building understanding. Did it get the structure right?

### 2. Find and fix something real

Don't add a comment. Do real work:

```text
Find a potential bug, code smell, or missing error handler in [specific module]. Explain the issue and fix it.
```

If you don't have a known issue, try:

```text
Run the tests and fix any failures. If all tests pass, find an untested edge case and add a test for it.
```

Watch the agentic loop in action: Claude reads code, reasons about it, makes changes, runs tests, reads results, iterates.

### 3. Learn the controls

Try each of these now:

| Shortcut | What it does |
|---|---|
| `Esc` | Stop Claude mid-generation (keeps context) |
| `Esc` `Esc` | Rewind to a previous checkpoint (undo changes) |
| `Shift+Tab` | Cycle permission modes: Normal → Plan Mode → Auto-Accept |
| `!command` | Run a shell command inline (e.g., `!git status`) |
| `/context` | See how your context window is being used |

### Permission modes matter

`Shift+Tab` cycles through three modes that control how much autonomy Claude has:

- **Normal** — Claude asks permission for edits and commands (start here)
- **Plan Mode** — Claude can only read and plan, not edit (Module 3)
- **Auto-Accept** — Claude executes without asking (use once you trust the plan)

### Power moves

- `claude --continue` or `claude -c` — resume your most recent session
- `claude --resume` — pick from a list of previous sessions
- `Esc Esc` — checkpoint rewind. Claude creates restore points before edits. Double-escape lets you undo back to any checkpoint. This is your safety net.

:::note[Why this matters]{icon="rocket"}
Unlike tools that work from embeddings or indexes, Claude reads your actual code each time. The tradeoff: no stale cache, but you pay for it in context tokens. Understanding this loop — prompt → tool use → result → reasoning → next action — is the foundation everything else builds on.
:::

## Artifact

Claude Code installed, authenticated, and working on your real project. A real fix or improvement (not a comment) in your git history.

## Go Deeper

[Playbook M01 — How LLMs Work](/tier-1/m01-how-llms-work/) for the mental model of what's happening under the hood — why Claude hallucinates, how context windows work, and what "autoregressive generation" means for code quality.
