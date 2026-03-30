---
title: "01: Install and Explore"
description: "Install Claude Code, run your first interaction on a real codebase, and learn the survival shortcuts."
sidebar:
  label: "01: Install & Explore"
  order: 1
---

**20 minutes | You need: a real project, admin access, internet**

## Setup

Open a terminal in your project's root directory.

## Do This

### 1. Install Claude Code

```bash
# macOS
brew install claude-code

# Linux
curl -sSL install.claude.ai/linux | bash

# Windows
winget install Anthropic.ClaudeCode

# Verify
claude --version
```

If your corporate machine blocks these, try the npm fallback: `npm install -g @anthropic-ai/claude-code`

### 2. Launch and authenticate

```bash
cd your-project
claude
```

A browser window opens for one-time authentication. Credentials are stored locally in `~/.claude/`.

### 3. Explore your project

Ask Claude:

```text
What does this project do? Describe the architecture, main modules, and how data flows.
```

Review the output. Did it get the structure right? What did it miss?

### 4. Find and explain a function

```text
Find the function that handles [something specific in your project] and explain what it does.
```

### 5. Make your first edit

```text
Add a JSDoc comment to [that function] explaining its purpose and parameters.
```

Review the proposed change. Approve it. You just made your first AI-assisted edit.

### 6. Learn the survival shortcuts

Try each of these now:

| Shortcut | What it does |
|---|---|
| `Esc` | Stop Claude mid-generation (keeps context) |
| `Esc` `Esc` | Rewind to a previous checkpoint |
| `Shift+Tab` | Cycle: Normal → Plan Mode → Auto-Accept |
| `!command` | Run a shell command (e.g., `!git status`) |

:::note[Why this matters]{icon="rocket"}
Claude reads your codebase on-demand using filesystem tools (Glob, Grep, Read). It does not pre-index anything. The first exploratory question lets Claude build a map of your project that improves all subsequent answers.
:::

## Artifact

Claude Code installed, authenticated, and working on your real project. A verified first edit in your git history.

## Go Deeper

[Playbook M01 — How LLMs Work](/tier-1/m01-how-llms-work/) for the mental model of what's happening under the hood — why Claude hallucinates, how context windows work, and what "autoregressive generation" means for code quality.
