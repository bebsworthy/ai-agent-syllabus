---
title: "04: Context Engineering"
description: "The most important module in this course. Understand, manage, and optimize the finite resource that determines Claude's quality."
sidebar:
  label: "04: Context Engineering"
  order: 4
---

**30 minutes | You need: Claude Code running with some conversation history**

## How Context Works

Everything Claude knows during a session lives in one place: the **context window**. It's a fixed-size buffer (up to 1M tokens on paid plans) that holds everything:

```text
┌─────────────────────────────────────────────┐
│ System prompt           (~2K tokens, fixed)  │
│ CLAUDE.md               (always loaded)      │
│ Tool descriptions       (MCP + built-in)     │
│ Memory files            (~/.claude/memory/)   │
│ ─────────────────────────────────────────── │
│ Conversation history    (grows with usage)    │
│ Tool outputs            (file reads, search   │
│                          results, command      │
│                          output — this is the  │
│                          big one)              │
│ ─────────────────────────────────────────── │
│ Free space              (what's left for      │
│                          reasoning)            │
└─────────────────────────────────────────────┘
```

:::caution[The single most important thing to understand]
As free space shrinks, quality degrades. Claude starts forgetting instructions, mixing up files, repeating itself. Everything in this module exists to keep free space high.
:::

The symptoms:
1. Claude **repeats information** it already gave you
2. Claude **mixes up files** from different parts of the conversation
3. Claude **applies conventions from a previous task** that don't apply now

:::caution[Test output is the worst offender]
A single test suite run can dump hundreds of lines into your context — passing test names, progress bars, coverage tables, stack traces for unrelated failures. Most of it is noise. Configure a test reporter that only outputs failures, or pipe through a filter: `npm test 2>&1 | grep -A 5 FAIL`. Claude will often try to do this itself, but baking it into your CLAUDE.md test command guarantees it:

```text
## Testing
- Run: `pnpm test -- --reporter=dot 2>&1 | grep -A 10 FAIL`
```

This one line in your CLAUDE.md can save thousands of tokens per test cycle.
:::

Context engineering is the art of the tradeoff: Claude needs enough context to do the job right (relevant code, conventions, tool access) but every token you add leaves less room for reasoning. Too little context and Claude guesses wrong. Too much and Claude drowns in noise, forgets instructions, and loses coherence. The goal is **the minimum context that produces the maximum quality output**.

## Do This

### 1. See where your tokens go

```text
/context
```

Study the breakdown. Notice how much is consumed before you've typed anything — system prompt, CLAUDE.md, tool descriptions.

:::note[Baseline cost]
The tokens consumed before you've typed anything is your **baseline cost**. Every MCP server, every memory file, every CLAUDE.md line adds to this. If your baseline is already 30% of the window, you only have 70% left for actual work.
:::

### 2. Understand the context tax of tools

Every MCP server you connect adds tool descriptions to your context. A typical MCP server adds 10-50 tools, each with a description. Ten MCP servers can consume **thousands of tokens** of your window before you've asked a single question.

**Tool Search** (automatic on Sonnet 4+ and Opus 4+) helps by lazy-loading tool descriptions only when they seem relevant. But each search query still costs tokens — it's not free, just deferred.

:::tip[Key insight]
A skill that wraps a CLI tool is almost always better than an MCP server for the same job. A skill's full instructions only load when invoked (~0 idle context cost). An MCP server's tool descriptions either sit in context permanently or cost tokens on every Tool Search query.
:::

| Approach | Idle context cost | When to use |
|----------|------------------|-------------|
| Skill wrapping CLI (`gh`, `aws`, `docker`) | ~100 tokens (name + description only) | Tool has a good CLI |
| MCP server | Hundreds to thousands of tokens | No CLI exists, needs persistent connection, or needs structured I/O |

You'll build skills in Module 6. For now, remember: fewer MCP servers = more room for actual work.

### 3. Compact with intent

After a research-heavy conversation:

```text
/compact Focus on the auth implementation decisions and test patterns
```

Run `/context` before and after. Compaction compresses conversation history while preserving what you tell it to focus on.

:::note[Manual compaction > auto-compaction]
Auto-compact triggers at ~95% capacity, but by then quality has already degraded. Compacting manually with a focus statement (`/compact Focus on X`) tells Claude what to preserve. Auto-compaction doesn't know what matters — it just summarizes generically. Always compact with intent before you hit the wall.
:::

Key facts:
- **CLAUDE.md survives compaction** — it's always re-injected
- **Conversation history does not** — it gets summarized
- `/clear` is a nuclear option — use it when switching to a completely unrelated task

### 4. Save knowledge, start fresh

After a long investigation or design discussion, your context is full of exploration noise — file reads, dead ends, back-and-forth. The useful output is a fraction of the tokens consumed. Instead of compacting (which lossy-summarizes everything), **externalize the knowledge and start clean**:

```text
Summarize everything we've decided about the auth refactor — architecture, API contracts, migration plan, open questions — into docs/auth-refactor-decisions.md
```

Then `/clear` and start a new session:

```text
@docs/auth-refactor-decisions.md Implement the auth refactor based on these decisions.
```

You now have a fresh context window with 100% free space, loaded with exactly the knowledge that matters — no investigation noise, no dead ends, no stale tool outputs.

:::tip[When to use this pattern]
Use "save and restart" after any session where you spent significant tokens on exploration: architecture discussions, debugging investigations, research deep-dives, spec refinement. The saved file becomes a reusable artifact — you (or a teammate) can `@`-reference it in any future session.
:::

### 5. Delegate to save context

:::tip[The most important pattern in this module]
Subagents run in their own context window. Their research, file reads, and tool outputs never enter yours — only the summary comes back. This is how you do heavy investigation without paying the context cost.
:::

```text
Use a subagent to investigate how our authentication system handles token refresh, map all the files involved, and summarize what I need to know to add a new token type.
```

Run `/context` before and after. Your context barely grew, but you have a complete analysis.

:::note[When to delegate vs. do it yourself]
**Delegate** when the investigation is heavy but the answer is short: exploring unfamiliar code, research questions ("how does X work?"), mapping dependencies.

**Don't delegate** when the task needs your current conversation context, or it's a quick lookup you can do in one question.
:::

Different subagent types exist:
- **Explore agents** — fast, read-only, use Haiku model (cheap). Good for "find X" tasks
- **General agents** — full tool access, same model as you. Good for complex research
- **Plan agents** — read-only research for planning

### 6. Model selection as strategy

Models are a cost/quality/speed tradeoff:

| Command | Cost | When to use |
|---------|------|-------------|
| `/model sonnet` | ~$3/1M tokens | 80% of daily work — fast, good enough |
| `/model opus` | ~$15/1M tokens | Complex debugging, architecture, subtle bugs |
| `/effort low` | Less reasoning | Simple edits, formatting, quick answers |
| `/effort high` | More reasoning | Hard problems, multi-step logic |

:::tip[Start with Sonnet, escalate to Opus]
Sonnet handles most tasks. Switch to Opus when Claude's first attempt isn't good enough — don't start there. You can also mix: use Sonnet for implementation and Opus for review.
:::

### Power moves

| Command | What it does |
|---------|-------------|
| `/btw [question]` | Ask a side question with **no context cost** — doesn't pollute your session |
| `/cost` | See real-time token spend for this session |
| `--max-budget-usd 5` | Set a cost cap for the session (CLI flag) |
| `/fork` | Branch the conversation — try two approaches without losing either |

:::note[Why this matters]{icon="magnifier"}
Context is the single biggest lever on output quality. A Claude with 50% free context is dramatically better than one at 95% capacity. Every MCP server, every long conversation, every uncompacted session degrades performance. The best Claude Code users are context-aware on every interaction: delegate research, compact regularly, pick the right model, and keep their tool footprint lean.
:::

## Artifact

A context management practice: check `/context` regularly, compact with focus at breakpoints, delegate research to subagents, and match model to task difficulty.

## Go Deeper

[Playbook M04 — Context Engineering](/tier-1/m04-context-engineering/) for the four failure modes of large contexts, the research-plan-implement workflow, and advanced compaction strategies.
