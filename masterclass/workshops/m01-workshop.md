---
title: "M01 Workshop: How LLMs Actually Work"
description: "Hands-on: install Claude Code, explore a real codebase, and build the habit of reviewing before executing."
---


**Self-directed | 45–60 min | Requires: M01 study guide read beforehand**

---

## Before You Start

**Prerequisites**
- M01 study guide read (theory + readings)
- Claude Code installed (or allocate 10 min at the start)
- A real project codebase open and ready (ideally 1K–10K lines, in any language — not a toy project)
- Admin access to install software on your machine
- A Claude account (free tier works; paid unlocks larger context windows)

**What this workshop does**
The theory explains the mechanism. This workshop makes it tangible. You will see hallucinations happen on your own code, understand why, and learn the habits that prevent them from becoming a problem. By the end, you will have Claude Code working on a real project and have experienced the context-accuracy relationship firsthand.

---

## What You'll Do

- Install and authenticate Claude Code
- Run your first interaction with a real codebase
- Practice essential shortcuts and commands
- Complete a hands-on exercise: find, explain, and improve a function

---

## What Is Claude Code?

Claude Code is a terminal-native agentic assistant — it reads your entire codebase, edits files directly, and runs commands on your machine. It's not a chatbot you copy-paste to; it operates on your actual project.

As of early 2026, Claude Code contributes to roughly 4% of all public GitHub commits (~135k/day), and 90% of Anthropic's own code is written with AI assistance.

| Aspect | Claude Code | Cursor/Copilot |
|---|---|---|
| Primary interface | Terminal / CLI | IDE-integrated |
| Context window | Up to 1M tokens (full codebase) | Varies, typically smaller |
| Autonomy | High — plans + executes multi-step tasks | Lower — mostly suggestions/completions |
| Best at | Long-running autonomous tasks, complex refactoring | Day-to-day inline editing, small completions |

Available as: terminal CLI, VS Code/Cursor extension, desktop app (Mac/Windows), and browser (claude.ai/code).

---

## Part 1 — Installation and First Launch

**Prerequisites:** macOS 13+, Windows 10+ (1809), or Ubuntu 20.04+. Minimum 4GB RAM, stable internet, and Git installed.

```bash
# macOS
brew install claude-code

# Linux
curl -sSL install.claude.ai/linux | bash

# Windows (via winget)
winget install Anthropic.ClaudeCode
# Or download installer from claude.ai, run as administrator

# Verify
claude --version
```

Authenticate when prompted — a browser window will open for Claude account login. Credentials are stored locally in `~/.claude/`.

:::tip[Hint]
If the installer stalls or fails on a corporate machine, try the npm fallback: `npm install -g @anthropic-ai/claude-code`. If that is also blocked by IT policy, check the Common Issues section at the bottom of this page.
:::

:::note
You are about to run a pattern-matching system that has never seen your codebase before. It will make confident-sounding suggestions that are sometimes wrong. Understanding why means you will know exactly when to trust it and when to check.
:::

---

## Part 2 — First Interaction with a Real Codebase

Work in your own project for this section. 1K–10K lines is ideal — real, but not overwhelming.

### Step 1 — Initialise

```bash
cd your-project
claude /init
```

This creates a `CLAUDE.md` at the project root. Don't edit it yet.

### Step 2 — Architecture question

Ask Claude:
> *"Explain the overall architecture of this project in 2–3 sentences."*

Review the output. Consider: did it get it right? What clues did it use? What did it miss?

### Step 3 — Deliberate hallucination trigger

Ask Claude:
> *"Find the main entry point and show me the first 50 lines."*

:::note
**If Claude hallucinates a file that doesn't exist** — this is the key insight: Claude predicted the most likely entry point based on naming conventions in its training data. It is not lying — it genuinely does not know your project. The fix is to give it real context (Step 4).

**If Claude gets it right** — it guessed correctly based on a common naming pattern. Step 4 will show how to make it less reliant on guessing.
:::

### Step 4 — Add context, repeat

Edit `CLAUDE.md` to add 2–3 lines of real project facts:
```
Main entry point: src/main.ts
Architecture: Express backend + React frontend
Key folders: /api (routes), /components (UI), /lib (shared utilities)
```

Ask the same question again. Observe the difference in specificity and accuracy.

**Key learning:** Claude's reliability depends entirely on the context it has. This is why `CLAUDE.md` exists — you will build it properly in M04, but the principle starts here.

---

## Part 3 — Essential Shortcuts and Commands

Try each of these in your session as you read through them.

### Keyboard shortcuts

| Shortcut | What it does |
|---|---|
| `Esc` | Stop Claude mid-generation (keeps context) |
| `Esc` `Esc` | Rewind to a checkpoint |
| `Shift+Tab` | Cycle: Normal → Plan Mode → Auto-Accept |
| `!command` | Run a shell command directly (e.g., `!git status`) |
| `Ctrl+B` / `Cmd+B` | Open file browser / send agent to background |
| `Ctrl+L` / `Cmd+L` | Focus the input field |

### Slash commands

| Command | What it does |
|---|---|
| `/init` | Generate a starter CLAUDE.md from the codebase |
| `/effort low\|medium\|high\|max` | Control reasoning budget (more effort = slower, more accurate) |
| `/model sonnet\|opus\|haiku` | Switch models mid-session |
| `/clear` | Wipe conversation history |
| `/context` | Show token usage breakdown |

Run `/context` now and review the breakdown: system prompt, tools, conversation history, free space. This is what is consuming your context window before you have done anything significant. You will manage this actively in M04.

---

## Part 4 — Hands-on Exercise: Find, Explain, Improve

### Setup (3 min)

Find a function in your project that:
- Is real and in active use (not dead code)
- Is 20–60 lines
- Has at least one obvious improvement: missing error handling, an inefficiency, a naming issue, or an undocumented edge case

Add the function's file path to `CLAUDE.md`:
```
## Key function to explore today
File: src/services/auth.ts — validateToken() function
```

### Part A — Hallucination test (5 min)

Ask Claude:
> *"List all parameters of `[your function]` and what each one does."*

Observe: does it get the parameter names right? If it hallucinates:
- Add the actual function signature to `CLAUDE.md`
- Ask again and compare the quality of the answer

### Part B — Deep understanding (7 min)

Ask Claude:
> *"Explain the logic of `[your function]` step by step. What would happen if `[a realistic edge case]` occurred?"*

If Claude gives a generic answer, try:
> *"Use `/effort high` and try again."*

Notice the difference in reasoning depth.

:::tip[Hint]
Choosing a good edge case makes this exercise much more revealing. Think about: what happens if the input is null or empty, if a network call fails, or if the function is called concurrently?
:::

### Part C — Improvement proposal (5 min)

Ask Claude:
> *"This function doesn't handle `[the edge case you identified]`. Show me what a fix would look like."*

**Do not execute the change yet.** Review it:
- Is the logic correct?
- Does it understand how this function connects to the rest of the codebase?

Then ask:
> *"Show me all the callers of `[your function]`. Would this change break any of them?"*

Observe whether Claude searches the codebase or guesses.

---

## Reflection

Before finishing, take a moment to consider:

1. **Where did Claude get it right, and what enabled that?** — Look for: good context, well-named code, common patterns.
2. **Where did it hallucinate or struggle, and why?** — Look for: missing context, unusual naming, code that doesn't match common patterns.
3. **What one thing would you add to `CLAUDE.md` right now to improve your next session?**

Everything you observed — the hallucinations, the improvement when context was added, the deeper reasoning with higher effort — all follows from the same mechanism: statistical pattern matching against training data. You now have the mental model that explains Claude's behaviour. Every module from here builds on this.

---

## Checklist Before Moving On

- [ ] Claude Code installed and authenticated
- [ ] A `CLAUDE.md` at the project root with at least 3 real project facts
- [ ] Run `/context` at least once and noted the token breakdown
- [ ] Experienced at least one hallucination and one recovery via added context

---

## Common Issues

**Installation fails on corporate machine** — IT policies may block npm or the installer. Try `npm install -g @anthropic-ai/claude-code` as a fallback.

**Claude keeps getting the architecture right even without context** — Use a less-common file structure, or ask about something highly specific to the project (internal utility names, unusual patterns). The hallucination behaviour will arise naturally in the exercise.

**Your codebase is too large** — Direct Claude to a specific subdirectory: `cd src/services && claude`. Or update `CLAUDE.md` to explicitly scope the session: *"Focus only on the /auth module for today."*

**"My code is proprietary — I'm not comfortable with this"** — Claude Code runs locally and reads files directly without uploading them to a server. For teams with strict data policies, the enterprise plan offers zero-retention guarantees.
