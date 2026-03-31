---
title: "03: Plan Mode & Thinking Controls"
description: "Use Plan Mode to catch mistakes at the spec level, and thinking controls to dial up reasoning when you need it."
sidebar:
  label: "03: Plan Mode & Thinking"
  order: 3
---

**25 minutes | You need: a real multi-file task from your backlog**

## How Planning Works

Most AI coding failures aren't bad code — they're solving the wrong problem. Plan Mode forces Claude into read-only: it can explore your codebase and reason about approach, but it **cannot write files or run shell commands**. This means you review the strategy before any code is written.

The workflow: **Plan → Review → Execute**. Mistakes caught at the spec level cost minutes. Mistakes caught in code cost hours.

## Do This

### 1. See what vague gets you

Enter Plan Mode: press `Shift+Tab` until you see "Plan Mode" (or type `/plan`).

Give Claude a vague one-liner:

```text
Users should be able to edit their profiles.
```

Review the plan. Count the assumptions. What did Claude decide for you that it shouldn't have?

### 2. Write a real spec

Now give Claude something it can't misinterpret:

```text
Add profile editing to the user settings page.

Requirements:
- PUT /api/users/:id endpoint with zod validation
- Only authenticated users can edit their own profile
- Editable fields: display name, bio, avatar URL
- Validate: name max 100 chars, bio max 500 chars, avatar must be valid URL
- Return 400 for validation errors, 403 for unauthorized
- Update the existing UserSettings component to include an edit form

Done when:
- Existing tests still pass
- New endpoint has tests for happy path, validation error, and auth error
- Frontend form has client-side validation matching API rules
```

Compare the two plans. The second one leaves almost nothing to interpretation.

### 3. Challenge the plan

Pick something the plan assumes:

```text
What about race conditions if two tabs are open? How should we handle concurrent edits?
```

Use `Ctrl+G` to open the plan in your editor for direct editing if you want to restructure it.

### 4. Execute

Once satisfied, exit Plan Mode (`Shift+Tab`) and:

```text
This plan looks good. Execute it.
```

Or switch to Auto-Accept Edits mode (`Shift+Tab` again) if you trust the plan fully. The pipeline: **Plan Mode → Normal → Auto-Accept Edits** — increasing autonomy as your confidence grows.

### 5. Thinking controls

Claude has adjustable reasoning depth — use it:

| Control | What it does | When to use |
|---------|-------------|-------------|
| `Alt+T` | Toggle extended thinking on/off (run `/terminal-setup` first) | Complex debugging, architecture decisions |
| `/effort low` | Less reasoning, faster responses | Simple edits, formatting, quick questions |
| `/effort high` | More reasoning per turn | Hard problems, subtle bugs |
| "think hard" or "ultrathink" in prompt | Max reasoning for one turn | Genuinely hard problems |

**Default effort is normal.** Only dial up for problems where Claude's first attempt isn't good enough. Thinking costs tokens and time.

### 6. Know when to skip Plan Mode

Plan Mode is for:
- Multi-file features
- Unfamiliar codebases
- Architectural changes
- Anything where "doing it wrong" costs more than 10 minutes to undo

Skip it for single-file, well-scoped changes you can describe in one sentence.

:::note[Why this matters]{icon="approve-check-circle"}
Clear spec → 1 round of review. Vague spec → 3 rounds of back-and-forth. Plan Mode is not overhead — it's the fastest path to correct code. And thinking controls let you match Claude's reasoning depth to the problem's actual difficulty, instead of paying max cost for simple tasks.
:::

## Artifact

A completed Plan Mode workflow on a real task — planned, reviewed, executed, and diffed. Familiarity with thinking controls.

## Go Deeper

[Playbook M03 — Specs Are Source Code](/tier-1/m03-specs-are-source-code/) for the spec-first paradigm, specification templates, and why communication is now the core technical skill.
