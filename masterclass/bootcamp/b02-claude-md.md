---
title: "02: CLAUDE.md — Teaching Claude Your Codebase"
description: "Write the single highest-leverage file in your project — the one Claude reads on every single request."
sidebar:
  label: "02: CLAUDE.md"
  order: 2
---

**25 minutes | You need: Claude Code running in your project**

## How CLAUDE.md Works

CLAUDE.md is injected into Claude's context on **every single request**. It's not optional reading — it's always there, always consuming tokens, always influencing behavior. This makes it:

- **The highest-leverage file you'll write** — a good CLAUDE.md transforms every interaction
- **An always-on cost** — every line consumes context on every turn. Keep it under ~200 lines / 2,000 tokens
- **Compaction-proof** — when Claude compresses conversation history to reclaim space, CLAUDE.md survives intact

If your project has two error handling patterns (old and new), Claude will mix them. If your team uses a specific test framework but there's a stale config for another one, Claude will guess. CLAUDE.md resolves ambiguity with authority.

:::caution[Context, not code]
CLAUDE.md is additional context injected into a probabilistic system — not deterministic configuration. As your conversation grows and context fills up, instructions in CLAUDE.md can be forgotten, diluted, or overridden by stronger signals elsewhere in the conversation. You are steering a probabilistic machine, not programming a deterministic one. If Claude starts drifting from your conventions, remind it — or start a fresh session where CLAUDE.md is at full strength.
:::

## Do This

### 1. Generate a starter

```text
/init
```

Claude analyzes your codebase and generates a first draft. It won't be perfect.

### 2. Refine with purpose

Open the generated `CLAUDE.md`. The goal isn't a comprehensive wiki — it's **the minimum instructions that produce maximum behavior change**. Focus on:

**What Claude gets wrong without guidance:**
- Which test framework and how to run tests (`npm test`, `pytest`, etc.)
- Build commands and how to verify things work
- Naming conventions (camelCase vs snake_case, file naming patterns)
- The architectural pattern you actually use (not the one in the old docs)
- Things that will break if Claude does them (e.g., "never modify migration files directly")

**Before/after example:**

Without CLAUDE.md, you ask Claude to write a test:
> Claude generates a Jest test with `describe/it` blocks, `expect()` assertions, and creates `__tests__/` directory.

With this in CLAUDE.md:
```text
## Testing
- Framework: Vitest (NOT Jest)
- Tests live next to source files: `foo.ts` → `foo.test.ts`
- Use `test()` not `it()`, `assert` from vitest not `expect`
- Run: `pnpm test`
```

Now Claude gets it right the first time, every time (mostly).

### 3. Test it

Ask Claude something where CLAUDE.md should change the answer:

```text
Write a new test for [module]. Follow our testing conventions.
```

Does it use the right framework? Right patterns? Right location? If not, refine and retry.

### 4. Understand the hierarchy

Claude merges CLAUDE.md files from multiple locations:

| Location | Scope | Shared? |
|----------|-------|---------|
| `~/.claude/CLAUDE.md` | Global — all your projects | No (personal) |
| `project-root/CLAUDE.md` | Project-wide — team conventions | Yes, commit to git |
| `project-root/.claude/CLAUDE.md` | Project-specific — team conventions | Yes, commit to git |
| Any subdirectory `CLAUDE.md` | Active when working in that directory | Yes |
| `project-root/.claude/settings.local.json` | Local settings and hooks | No (add to .gitignore) |

### 5. Path-specific rules

For conventions that only apply to certain files, use `.claude/rules/` with glob patterns:

```text
# .claude/rules/api-routes.md
---
paths:
  - "src/api/**/*.{ts,py}"
---
All API routes must validate input with zod schemas.
Return standardized error responses: { error: string, code: number }.
Never throw raw exceptions — always catch and wrap.
```

This only loads when Claude is working on files matching the path pattern — zero context cost otherwise.

### 6. Commit it

```bash
git add CLAUDE.md
git commit -m "Add CLAUDE.md with project conventions"
```

Your CLAUDE.md is now a shared team asset. Every team member's Claude sessions benefit.

:::note[Why this matters]{icon="information"}
CLAUDE.md is the only file guaranteed to be in every request's context. A well-written 150-line CLAUDE.md eliminates more repeat corrections than any other single action. But every unnecessary line costs you context space on every turn — treat it like production code, not documentation.
:::

## Artifact

A committed `CLAUDE.md` in your project repo. Optionally, path-specific rules in `.claude/rules/`.

## Go Deeper

[Playbook M04 — Context Engineering](/tier-1/m04-context-engineering/) for the four failure modes of large contexts (poisoning, distraction, confusion, clash) and why CLAUDE.md is the antidote to each.
