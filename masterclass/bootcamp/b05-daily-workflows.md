---
title: "05: Daily Workflows That Actually Work"
description: "Seven real scenarios on your own codebase — debug, test, refactor, ship, worktrees, explore, and review — with Claude-specific techniques."
sidebar:
  label: "05: Daily Workflows"
  order: 5
---

**30 minutes | You need: your codebase open, ~5 minutes per scenario**

## Setup

Pick real tasks from your codebase for each scenario. The learning is in seeing Claude work with your actual code, not hypotheticals.

## Do This

### Scenario 1: Debug (5 min)

Paste a real error from your logs or a failing test:

```text
I'm getting this error: [paste error]. Trace through the codebase, find the root cause, and fix it.
```

**Claude-specific techniques:**
- Start in Plan Mode (`/plan`) for non-obvious bugs. Claude will investigate and reason before touching code — you review the diagnosis before any edit happens.
- If the fix is wrong, press `Esc Esc` to rewind to the checkpoint before the edit. Try a different approach without losing your conversation.
- For subtle bugs, add **ultrathink** to your prompt — it allocates more reasoning depth for that turn.
- If Claude is going in circles, try `/effort high` to bump reasoning for subsequent turns.

:::tip[When all else fail /clear]
Long debugging session will pollute the context. Instead of running in circle ask claude to summarize the issue, what was done and what failed and to save it to tmp/DEBUG.md, then `/clear` the session and restart fresh with `@tmp/DEBUG.md`
:::

### Scenario 2: Write tests (5 min)

Pick an untested module:

```text
Write comprehensive tests for src/services/auth.ts. Cover happy paths, edge cases, and error handling. Use our existing test patterns. Run the tests and fix any failures.
```

**The key phrase is "Run the tests and fix any failures"** — this creates a feedback loop. Claude writes tests, runs them, sees failures, fixes them. Without this, you get tests that look right but don't pass.

**For TDD-style iteration:** Use `/loop` (a bundled skill) to watch tests continuously:
```text
/loop 30s Run the tests for auth.ts and fix any failures
```

### Scenario 3: Refactor (5 min)

Use Plan Mode (`Shift+Tab`) for this one:

```text
Refactor src/utils/ to eliminate code duplication. Flag functions with >70% similarity and propose shared utilities. Don't change any public APIs.
```

Review the plan before execution. For large refactors across many files, use `/batch` (a bundled skill):

```text
/batch Rename all instances of userId to accountId across the codebase, updating types, tests, and imports.
```

`/batch` creates parallel git worktrees — multiple Claude instances working on different files simultaneously, then merging the results.

### Scenario 4: Create a PR (5 min)

After any of the above:

```text
Commit these changes with a descriptive message, push to a new branch, and create a PR with a summary of what changed and why.
```

Claude handles staging, committing, branching, and PR creation in one go. If you have GitHub MCP connected (Module 9), it uses that. If not, it falls back to the `gh` CLI — both work.

### Scenario 5: Parallel work with worktrees (5 min)

Git worktrees let you run multiple Claude sessions on isolated copies of your repo — each on its own branch, without interfering with each other or your working directory.

```bash
# Start Claude in an isolated worktree for a feature
claude --worktree auth-refactor
```

This creates a separate checkout. You can have your main session working on one thing while the worktree session works on another. Changes stay isolated until you're ready to merge.

**When to use worktrees:**
- Working on two features simultaneously
- Trying an experimental approach without risking your current branch
- Running a long task in the background while you continue other work

**`/batch` uses worktrees under the hood** — it creates one worktree per file group, runs parallel Claude instances, and merges the results. You used this in Scenario 3 for large refactors.

:::tip[Worktrees + subagents = different things]
Subagents (Module 4) are about **context isolation** — keeping research out of your main window. Worktrees are about **code isolation** — keeping changes on separate branches. Use subagents for reading, worktrees for writing.
:::

### Scenario 6: Explore unfamiliar code (5 min)

Pick a module you've never touched. **Delegate this to a subagent** to keep your main context clean:

```text
Use a subagent to explore src/payments/ and explain: the main components, how they connect, data flow for a typical transaction, and any existing retry/error handling I should know about.
```

The subagent reads dozens of files in its own context window. You get the summary. Your context barely grows.

### Scenario 7: Code review (5 min)

Use the built-in review skill:

```text
/simplify
```

This reviews all changed files by launching 3 parallel agents — one checking for existing utilities you should reuse instead of rewriting, one flagging code quality issues (redundant state, copy-paste, leaky abstractions), and one catching efficiency problems (N+1 queries, missed concurrency, hot-path bloat). It then **fixes** everything it finds. Or do a targeted review:

```text
Review the changes in the last 3 commits. Look for: missing error handling, potential race conditions, and anything that breaks our existing patterns.
```

## Prompting patterns worth remembering

| Pattern | Example | Why it works |
|---------|---------|-------------|
| **Feedback loop** | "Run tests and fix failures" | Claude self-corrects instead of guessing |
| **Constraint** | "Don't change any public APIs" | Prevents scope creep |
| **Delegation** | "Use a subagent to research X" | Saves your context for the actual work |
| **Escalation** | "ultrathink about this" | More reasoning depth for one turn |
| **Checkpoint** | `Esc Esc` after a bad edit | Undo without losing conversation |

## Session management

| Command | What it does |
|---------|-------------|
| `claude -c` | Resume most recent session |
| `claude --resume` | Pick from previous sessions |
| `/rename my-feature` | Label current session for easy resume |
| `/voice` | Voice input mode — dictate prompts hands-free (supports 20 languages) |
| `/remote-control` | Continue this session from your phone via claude.ai/code |

:::note[Why this matters]{icon="star"}
These seven workflows cover 90%+ of daily Claude Code usage. The difference between a beginner and a power user isn't the prompts — it's knowing when to delegate, when to rewind, when to escalate reasoning, and when to use parallel execution.
:::

## Artifact

At least 3 completed workflow runs on your real codebase. A sense of which patterns work best for your specific project.

## Go Deeper

[Playbook M02 — Prompt Engineering](/tier-1/m02-prompt-engineering/) for named techniques (zero-shot, few-shot, chain-of-thought) and the research behind them. [Playbook M09 — Code Review](/tier-2/m09-code-review/) for the Writer/Reviewer pattern.

*Modules 6-8 add power-user capabilities — skills, MCP connections, and hooks. Modules 9-12 cover research patterns, verification, multi-agent orchestration, and adversarial review — essential for production use.*
