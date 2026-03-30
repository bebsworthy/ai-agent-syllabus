---
title: "10: Don't Trust, Verify"
description: "Claude is confident, articulate, and wrong more often than you'd like. Learn the verification patterns that catch mistakes before they ship."
sidebar:
  label: "10: Don't Trust & Verify"
  order: 10
---

**30 minutes | You need: a codebase with tests, modules 1-9 completed**

## The Problem

Claude sounds right even when it's wrong. It will confidently reference a function that was renamed three months ago. It will write code that passes its own logic check but fails against the actual database schema. It will claim a library supports a feature that doesn't exist.

This isn't a flaw you can prompt around — it's a fundamental property of language models. The same mechanism that makes Claude articulate and helpful also makes it convincingly wrong. Your job is to build verification into your workflow so mistakes are caught by process, not by luck.

:::caution[The confidence trap]
The more fluent and detailed Claude's response, the more tempting it is to trust it. But fluency and correctness are independent. A three-paragraph explanation with code examples can be entirely wrong. Verify output by its relationship to reality, not by how good it sounds.
:::

## The Verification Patterns

### 1. Let the machine check the machine

The most reliable verification is one that doesn't depend on you reading the output. Give Claude feedback loops — commands that produce objective pass/fail signals:

```text
Write tests for the auth module. Run them and fix any failures.
```

The "run them and fix any failures" part is the verification. Without it, Claude writes tests that *look* correct. With it, Claude writes tests that *are* correct — because it gets feedback from the test runner, not from its own judgment.

**Feedback loops you should always include:**

| Task | Verification command |
|------|---------------------|
| Writing code | "Run the tests" |
| Writing tests | "Run the tests and fix failures" |
| Refactoring | "Run the full test suite to confirm nothing broke" |
| Build changes | "Build the project and fix any errors" |
| Type changes | "Run the type checker" |
| Linting | "Run the linter" (or use a hook — Module 8) |

:::tip[The golden rule]
If there's a command that can verify the output, include it in your prompt. Every time. Claude's self-assessment of its own code is unreliable. `npm test` is not.
:::

### 2. Read the diff, not the description

When Claude finishes a task, it summarizes what it did. That summary is Claude's understanding of what it did — which may differ from what it actually did. Always read the actual changes:

```text
Show me the diff of everything you changed.
```

Or better — review in your editor where you have syntax highlighting, blame context, and the ability to spot patterns Claude can't describe.

**What to look for in diffs:**
- Files changed that shouldn't have been (scope creep)
- Removed code that was load-bearing (Claude thought it was dead)
- Hardcoded values where variables should be
- Imports from packages that don't exist (hallucinated dependencies)
- Test assertions that test the implementation, not the behavior

### 3. Challenge hallucinated knowledge

Claude will state facts about your codebase, libraries, and APIs. Some will be hallucinated. The more specific the claim, the more important it is to verify:

```text
You mentioned that `UserService.refreshToken()` accepts an optional `scope` parameter.
Show me where in the code that parameter is defined.
```

:::note[Hallucination hot spots]
Claude is most likely to hallucinate about:
- **Function signatures** it hasn't read in this session (relying on training data)
- **Library APIs** that changed after the knowledge cutoff (Module 9)
- **Configuration options** that sound plausible but don't exist
- **Database schemas** it inferred from code patterns but didn't verify against the actual schema
- **Environment variables** it assumes exist based on naming conventions

When Claude claims something exists, "show me" is your verification primitive.
:::

### 4. Test the tests

Claude-written tests have a specific failure mode: they test what the implementation does, not what it should do. This means they pass — but they're verifying the bug, not the spec.

```text
I want you to check these tests for quality. For each test:
1. Is it testing behavior (what should happen) or implementation (what does happen)?
2. Would this test catch a regression if someone changed the implementation?
3. Is there a meaningful assertion, or is it just checking that "no error was thrown"?
```

**Red flags in Claude-written tests:**
- Tests that mock everything (nothing real is being tested)
- Tests that assert on exact output strings (brittle, breaks on formatting changes)
- Tests that pass by coincidence (right answer for the wrong reason)
- Tests with no negative cases (only tests the happy path)
- Snapshot tests that were auto-generated (they lock in current behavior, bugs included)

:::tip[Mutation testing as verification]
If you have a mutation testing tool (Stryker, mutmut, etc.), run it on Claude-written tests. It intentionally introduces bugs in the source code and checks if the tests catch them. A test suite that survives mutations isn't actually testing anything.
:::

### 5. Multi-agent cross-checking

Use separate agents to check each other's work. The key: the checking agent should have **independent context** — it reads the original requirements and the output, not the conversation that produced the output.

```text
Launch a subagent with this task:

Read the requirements in docs/auth-spec.md.
Read the implementation in src/services/auth.ts and src/services/auth.test.ts.
Do NOT read any conversation history or intermediate reasoning.

Check:
1. Does every requirement in the spec have corresponding implementation?
2. Does every requirement have at least one test?
3. Are there implemented behaviors that aren't in the spec? (scope creep)
4. Are there test cases that don't map to any requirement? (noise)

Write a coverage matrix to docs/auth-verification.md.
```

:::note[Why independent context matters]
If the checking agent sees the same conversation that produced the code, it inherits the same assumptions and blind spots. A fresh agent with only the spec and the code provides genuinely independent verification — it's the difference between proofreading your own writing and having someone else read it.
:::

### 6. Incremental verification

Don't wait until the end to check. Verify at each milestone:

```text
Step 1: Write the database migration. Run it against the test database. Confirm the schema matches what we designed.

Step 2: Write the API endpoint. Run the type checker. Write one happy-path test and run it.

Step 3: Write the remaining tests. Run the full suite. Fix failures.

Step 4: Show me the full diff before we commit.
```

Each step produces a verifiable checkpoint. If step 2 reveals a schema mismatch, you fix it before writing 20 tests against the wrong schema.

### 7. The "prove it" prompt

When Claude makes a claim about your codebase, don't let it slide — make it show its work:

| Claude says | You say |
|------------|---------|
| "This function is unused" | "Grep for all references to it first" |
| "This is safe to remove" | "What tests cover this code path?" |
| "This API returns X" | "Show me the actual response type definition" |
| "This config option does Y" | "Show me where it's read and what it defaults to" |
| "No other code depends on this" | "Search for all imports of this module" |

This isn't about distrust — it's about using Claude's tools to verify Claude's claims. Claude has Grep, Glob, and Read. Make it use them before making assertions.

## Building Verification Into Your Workflow

The patterns above aren't one-off techniques — they should be baked into your daily practice:

1. **CLAUDE.md** — add verification commands for common tasks (test command, build command, type checker)
2. **Hooks** (Module 8) — auto-run linter on every write, tests before every commit
3. **Skills** — build review skills that cross-check with `context: fork` for independent context
4. **Prompts** — always include "run the tests" / "show me the diff" in multi-step tasks

```text
## Verification (add to your CLAUDE.md)
- After writing code: run `pnpm test` before considering the task done
- After refactoring: run the full test suite, not just affected tests
- After changing types: run `pnpm typecheck`
- Before committing: show the full diff for review
```

:::note[Why this matters]{icon="magnifier"}
The developers who get the most value from Claude aren't the ones who trust it the most — they're the ones who verify the fastest. Every pattern in this module is about making verification cheap, automatic, and systematic. Trust the process, not the output.
:::

## Artifact

A verification habit: feedback loops in every prompt, diffs before commits, "prove it" for codebase claims, independent agents for cross-checking. Updated CLAUDE.md with verification commands.

## Go Deeper

[Playbook M09 — Code Review](/tier-2/m09-code-review/) for the Writer/Reviewer pattern and structured code review workflows. [Playbook M08 — Security](/tier-2/m08-security/) for verification patterns specific to security-sensitive code.
