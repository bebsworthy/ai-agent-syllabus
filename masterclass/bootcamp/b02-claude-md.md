---
title: "02: Your CLAUDE.md — Onboarding Your AI"
description: "Create the single file that makes Claude understand your project's conventions, patterns, and constraints."
sidebar:
  label: "02: CLAUDE.md"
  order: 2
---

**30 minutes | You need: Claude Code running in your project**

## Setup

Open Claude Code in your project root. Have your project's conventions in mind (or open a recent PR to remind yourself).

## Do This

### 1. Generate a starter

```text
/init
```

Claude analyzes your codebase — file structure, languages, frameworks, patterns — and generates a starter CLAUDE.md. It won't be perfect, but it's a baseline.

### 2. Review and refine

Open the generated `CLAUDE.md`. Add at least 5 items from this checklist:

- [ ] Tech stack and frameworks (exact versions if they matter)
- [ ] Coding conventions (naming, file structure, import ordering)
- [ ] Testing requirements (framework, run command, coverage expectations)
- [ ] Architecture decisions (e.g., "repository pattern for data access")
- [ ] Things NOT to do (e.g., "never modify migration files directly")
- [ ] Build/run/lint commands
- [ ] Error handling pattern (pick one, be explicit)
- [ ] Recent changes (last 2-3 weeks)

### 3. Test it

Ask Claude a question where the CLAUDE.md should influence the answer:

> *"Write a new test for [module]. Follow our testing conventions."*

Does it use the right framework? The right patterns? If not, refine the CLAUDE.md and try again.

### 4. Understand the hierarchy

Claude reads CLAUDE.md files from multiple locations, merged in order:

| Location | Scope | Shared? |
|----------|-------|---------|
| `~/.claude/CLAUDE.md` | Global — all your projects | No |
| `project-root/CLAUDE.md` | Project-wide — team conventions | Yes, commit to git |
| `project-root/.claude/CLAUDE.md` | Project-specific, personal | No (gitignored) |
| Any subdirectory `CLAUDE.md` | Active when working in that directory | Yes |

### 5. Commit it

```bash
git add CLAUDE.md
git commit -m "Add CLAUDE.md with project conventions"
```

Your CLAUDE.md is now a shared team asset.

:::note[Why this matters]{icon="information"}
Without CLAUDE.md, Claude sees your codebase but has no authoritative guidance on conventions. If your project has two error handling patterns (old and new), Claude will mix them. CLAUDE.md resolves the ambiguity. Keep it under ~200 lines / 2,000 tokens — it loads on every request.
:::

## Artifact

A committed `CLAUDE.md` in your project repo that the whole team benefits from.

## Go Deeper

[Playbook M04 — Context Engineering](/tier-1/m04-context-engineering/) for the four failure modes of large contexts (poisoning, distraction, confusion, clash) and why CLAUDE.md is the antidote to each.
