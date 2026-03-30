---
title: "04: Context is Everything"
description: "Manage your context window, pick the right model, and delegate research to subagents."
sidebar:
  label: "04: Context & Models"
  order: 4
---

**30 minutes | You need: Claude Code running with some conversation history**

## Setup

Open Claude Code in your project. If you've been working through modules 1-3, you already have conversation history — perfect.

## Do This

### 1. See where your tokens go

```text
/context
```

Review the breakdown: system prompt, tools, memory files, messages, free space. Notice how much is consumed before you've even asked anything.

### 2. Watch context grow

Start a research-heavy task:

```text
Explain the testing strategy in this project. What frameworks do we use, where are the test files, and what patterns do they follow?
```

Run `/context` again. Notice how Messages grew.

### 3. Compact with intent

```text
/compact Focus on the test patterns and commands
```

Run `/context` again — space reclaimed, but the useful information is preserved.

### 4. Clean slate

```text
/clear
```

Ask a completely unrelated question. Notice how much better Claude performs without old context polluting the new task.

**Three signs your context is polluted:**
1. Claude **repeats information** it already gave you
2. Claude **mixes up files** from different parts of the conversation
3. Claude **applies conventions from a previous task** that don't apply now

When you see these → `/clear` and start fresh.

### 5. Delegate to a subagent

Ask Claude to research something in a separate context:

```text
Use a subagent to investigate how our authentication system handles token refresh, and whether we have any existing OAuth utilities I should reuse.
```

Run `/context` before and after. The subagent's work stays in its own context window — only the summary enters yours.

### 6. Switch models

Try each model on a real task:

| Command | When to use |
|---------|-------------|
| `/model sonnet` | 80% of daily work — fast, cost-effective |
| `/model opus` | Complex debugging, architecture decisions |
| `/effort low` | Simple formatting, quick questions |
| `/effort high` | Hard problems where you want deeper reasoning |

:::note[Why this matters]{icon="magnifier"}
The context window is finite. As it fills, Claude starts forgetting instructions and making mistakes. Subagents are the most important pattern — they do heavy reading in their own window and report back a summary. Model selection is a cost/quality trade-off: Sonnet at ~$3/1M tokens handles most tasks; Opus at ~$15/1M is worth it for genuinely hard problems.
:::

## Artifact

A context management habit: check `/context`, compact at breakpoints, clear between tasks, delegate research to subagents. Model selection muscle memory.

## Go Deeper

[Playbook M04 — Context Engineering](/tier-1/m04-context-engineering/) for the four failure modes of large contexts, the research-plan-implement workflow, and auto-compaction tuning with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`.
