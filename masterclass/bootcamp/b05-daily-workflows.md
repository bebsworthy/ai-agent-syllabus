---
title: "05: Daily Workflows That Actually Work"
description: "Five real scenarios on your own codebase — debug, test, refactor, ship, and explore."
sidebar:
  label: "05: Daily Workflows"
  order: 5
---

**30 minutes | You need: your codebase open, ~5 minutes per scenario**

## Setup

Pick real tasks from your codebase for each scenario below. Don't use hypotheticals — the learning is in seeing Claude work with your actual code.

## Do This

### Scenario 1: Debug something (5 min)

Find a real error message from your logs or a failing test. Paste it:

```text
I'm getting this error: [paste error]. Trace through the codebase, find the root cause, and fix it.
```

If you don't have a current error, break something on purpose and let Claude fix it.

### Scenario 2: Write tests (5 min)

Pick an untested module:

```text
Write comprehensive tests for `src/services/auth.ts`. Cover happy paths, edge cases, and error handling. Use our existing test patterns. Run the tests and fix any failures.
```

The key phrase is **"Run the tests and fix any failures"** — this gives Claude a feedback loop.

### Scenario 3: Refactor (5 min)

Pick a messy area. Use Plan Mode for this one:

```text
Refactor `src/utils/` to eliminate code duplication. Flag functions with >70% similarity and propose shared utilities.
```

Review the plan before letting Claude execute.

### Scenario 4: Create a PR (5 min)

After any of the above:

```text
Commit these changes with a descriptive message, push to a new branch called `feature/[name]`, and create a PR.
```

Claude handles staging, committing, branching, and PR creation in one go.

### Scenario 5: Explore unfamiliar code (5 min)

Pick a module you've never touched:

```text
Explain the architecture of `src/payments/`. What are the main components, how do they connect, and where does data flow?
```

Use a subagent for this to keep your main context clean:

```text
Use a subagent to map how the payment module handles refunds and whether there's existing retry logic I should reuse.
```

### Prompting tips to keep handy

- **Be specific about the outcome, not the steps.** Let Claude figure out how.
- **Give feedback loops:** Include test commands or expected outputs so Claude can self-verify.
- **Use "think hard"** for complex problems — it allocates more reasoning budget.
- **Session management:** `/resume` to pick up previous work, `/rename` to label sessions, `claude --continue` to resume the most recent session.

:::note[Why this matters]{icon="star"}
These five workflows cover 90% of what you'll do daily with Claude Code. The prompts above are templates — adapt them to your codebase and save the ones that work best.
:::

## Artifact

At least 3 completed workflow runs on your real codebase. A personal prompt cheat sheet of what worked.

## Go Deeper

[Playbook M02 — Prompt Engineering](/tier-1/m02-prompt-engineering/) for named techniques (zero-shot, few-shot, chain-of-thought) and the research behind them. [Playbook M09 — Code Review](/tier-2/m09-code-review/) for the Writer/Reviewer pattern.

*You're productive now. Modules 6-8 add power-user capabilities — skills, MCP connections, and hooks. Do them when you're ready to level up.*
