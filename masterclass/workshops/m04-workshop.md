---
title: "M04: Context Engineering — Workshop Guide"
description: "Build and commit your project CLAUDE.md, practice context hygiene commands, and establish the three-phase workflow."
---


**Self-directed | 45–60 min | Requires: M04 study guide read beforehand**

---

## Before You Start

:::note
Context discipline is what separates developers who get 2x productivity from Claude from those who get 10x. The difference isn't intelligence — it's habit. This workshop makes context management concrete and builds muscle memory. You'll see firsthand how conflicting context breaks Claude's reasoning, how CLAUDE.md fixes it, and how to audit your own projects. By the end, you'll commit a CLAUDE.md that becomes a living document for your team.
:::

**Prerequisites**

- M04 study guide read (theory + readings)
- Claude Code installed and authenticated
- A real project codebase with actual conventions (not a tutorial project)
- Git access to the project (able to commit CLAUDE.md)
- A text editor (VS Code, IDE, or simple editor)

**What you'll do**

- [ ] Context poisoning demo — observe how conflicting context degrades performance
- [ ] CLAUDE.md deep dive — audit your conventions and draft your file
- [ ] Context monitoring exercise — hands-on with `/context` and `/compact`
- [ ] Three-phase workflow demo — research → plan → implement
- [ ] Research grounding exercise — toolkit comparison, WebSearch/WebFetch, /research skill
- [ ] End-to-end hands-on exercise on a real task

---

## Part 1 — Context Poisoning Demo

**Objective**: Observe how conflicting context degrades performance.

Use a real (or realistic) scenario: your codebase has two different error handling patterns (old and new), and CLAUDE.md mentions neither.

**Step 1 — High-Context, Low-Signal**

1. Open Claude Code in your project without a CLAUDE.md
2. Ask Claude: "What's the error handling pattern?"
3. Claude sees both patterns and is uncertain: "It looks like you use both `{ error: "..." }` and `throw new Error()`..."
4. Ask Claude to implement an error handler — notice it may mix patterns
5. Outcome: confusion

**Step 2 — Curated Context**

1. Create a minimal CLAUDE.md with one rule: `"Error handling: Always return { success: false, error: "message", code: "CODE" }. Never throw."`
2. Ask Claude the same questions
3. Claude responds confidently and consistently
4. Ask Claude to implement the same handler — it follows the spec
5. Outcome: reliability

:::note
The lesson here is direct: smaller, curated context beats larger, noisy context. CLAUDE.md is the antidote to confusion.
:::

---

## Part 2 — CLAUDE.md Deep Dive

**Objective**: Create and refine a CLAUDE.md for your real project.

**Step 1 — Audit Your Conventions** (5 min)

Think through the actual conventions in your codebase. Capture answers to:

- What is the error handling pattern?
- Async/await vs. callbacks vs. promises — which do you use?
- Where does validation happen?
- Naming conventions (camelCase, snake_case, etc.)?
- Where does new code go?
- Security rules (SQL parameterization, auth checks)?
- Testing requirements?

:::tip[Hint]
If your conventions feel inconsistent or undocumented, that's normal — and exactly what CLAUDE.md is for. Write it as it *should* be, not as it currently is. It becomes a North Star. As you refactor, you align with CLAUDE.md instead of the old mess.
:::

**Step 2 — Draft Your CLAUDE.md** (5 min)

Structure your conventions into CLAUDE.md format with these sections:

- Overview + tech stack
- Key files and their purpose
- Conventions (5–10 key ones)
- Recent changes (last 2–3 weeks)
- Common mistakes to avoid
- Testing requirements
- Deployment info

Review what you've written: Is it accurate? Is it complete?

**Step 3 — Commit to Repo** (5 min)

```bash
git add CLAUDE.md && git commit -m "Add CLAUDE.md with project conventions"
```

Your CLAUDE.md is now a living document that both Claude and your team can reference.

---

## Part 3 — Context Monitoring Exercise

**Objective**: Hands-on practice with context commands.

**Step 1 — Load your project**

Open Claude Code in your project and run `/init` to create or update CLAUDE.md.

**Step 2 — Check context**

Run `/context` and review the breakdown:

- How many tokens are in CLAUDE.md?
- How many are in conversation history?
- How many are in loaded files?

**Step 3 — Simulate a long conversation**

Ask Claude 5–10 questions about the codebase (without loading large files), then run `/context` again. Notice how history grew.

:::tip[Hint]
If the context breakdown surprises you — particularly how fast conversation history grows — that's the point. Each exchange accumulates. This is why you manage context actively rather than letting it drift.
:::

**Step 4 — Compact and compare**

1. Run `/compact`
2. Run `/context` again
3. Ask Claude the same questions — does it still understand?

Compaction preserves knowledge while freeing tokens. It is not the same as clearing context.

:::caution
If `/compact` throws an error, try `/clear` instead (more direct, same effect). Some Claude Code versions use different command names — run `/help` to confirm what's available in your version.
:::

---

## Part 4 — Three-Phase Workflow Demo

**Objective**: Structure work for clean context.

**Phase 1 — Research**

1. Start a new conversation (or run `/clear`)
2. Ask: "Walk me through the authentication flow. Show me the relevant files."
3. Let Claude explore and respond
4. Do not execute any changes yet
5. At the end, run `/clear` to reset context — discard the research artifacts

**Phase 2 — Plan**

1. Start fresh (new session or `/clear`)
2. Load CLAUDE.md
3. Ask: "Plan a new feature: Add rate limiting to the login endpoint. Include approach, file changes, error handling."
4. Claude generates a plan in Plan Mode
5. Review and refine until it's solid

**Phase 3 — Implementation**

1. Execute the plan
2. Context is clean; the plan is locked in
3. Implementation proceeds without context pollution from the research phase

:::note
The key insight: research produces dead ends, stale questions, and exploratory noise. Carrying that into your planning phase pollutes Claude's reasoning. A clean slate before planning produces better plans and faster implementation.
:::

---

## Part 5 — Research Grounding Exercise

**Objective**: Practice the research toolkit and subagent delegation before coding.

**Step 1 — Research Toolkit Comparison** (10 min)

Pick a question about your codebase (e.g., "How does our authentication handle token refresh?"). Try answering it three ways:

1. Ask Claude directly in your main session — run `/context` before and after to see the token cost
2. Ask Claude to use an **Explore agent** for the same question — compare the token impact on your main context
3. Ask Claude to use **Glob + Grep** to find relevant files first, then **Read** only the key ones

Which approach consumed the least tokens in your main session? (Hint: subagents win.)

**Step 2 — WebSearch + WebFetch** (5 min)

Pick a library or API your project uses. Ask Claude:

> *"Search for the latest best practices for [library] in [framework]. Then fetch the official docs page and summarize what's changed since [version]."*

Observe the two-step flow: WebSearch returns URLs, WebFetch extracts specific answers.

**Step 3 — Build a /research Skill** (5 min)

Create `.claude/skills/research/SKILL.md` with this template and customize for your project:

```yaml
---
name: research
description: >
  Research a problem using web search, documentation, and codebase
  exploration before implementing.
allowed-tools: Agent, WebSearch, WebFetch, Grep, Glob, Read
---

Launch parallel subagents to gather information:
1. **Codebase Agent**: Search for existing implementations and patterns
2. **Docs Agent**: Search official docs for the topic
3. **Prior Art Agent**: Search for community solutions

Synthesize into: what exists, best practices, and gaps to fill.
```

Test it by running `/research [your topic]`.

---

## Hands-on Exercise: End-to-End Context Engineering

**Objective**: Build context discipline on a real task.

**Setup** (5 min)

Pick a real feature or task from your project. Target: moderately complex (2–4 hours of work). Example: "Add email verification to the signup flow."

:::tip[Hint]
Choose something real. The goal is to build a habit, not to complete a hypothetical. If you don't have a new feature ready, pick a refactoring task or a bug you've been avoiding.
:::

---

**Phase 1: Research** (15 min)

1. New session or `/clear`
2. Ask Claude: "Walk me through our current signup flow. Show me the relevant files. What's the authentication model?"
3. Let Claude explore the codebase
4. Take notes on key findings in a separate document
5. At the end: run `/clear` (discard research artifacts before moving on)

---

**Phase 2: Plan** (20 min)

1. New session or `/clear` — context is empty
2. Ask Claude to load CLAUDE.md and refresh from it
3. Ask Claude: "Plan the addition of email verification. Include: architecture, database changes, new endpoints, error handling, security considerations, and validation rules."
4. Claude generates a plan in Plan Mode
5. Review and refine: Does this fit with existing auth? Is the email validated correctly? What about edge cases (user changes email before verifying, verification link expires)?
6. Continue until the plan is solid before moving on

:::tip[Hint]
The plan phase is where most of the thinking happens. Don't rush it. A vague plan produces vague implementation. Push Claude on edge cases explicitly — ask "What could go wrong?" and "What did we miss?"
:::

---

**Phase 3: Implementation** (10 min)

1. Execute the plan
2. Claude implements based on the clean context and locked-in plan
3. Implementation is fast and accurate because the spec was precise

---

**Phase 4: Verification** (5 min)

1. Ask Claude: "Did we implement all the requirements from the plan? Are there edge cases we missed?"
2. Claude reviews its own work against the plan
3. Outcome: features that match the spec because the spec was precise and context was clean

---

## Reflection Questions

Work through these independently when you finish the exercise. They reinforce the concepts from the session:

1. Before this workshop, did you think context *size* mattered more than context *quality*? What changed your mind?

2. CLAUDE.md is now committed to Git. Who should update it when conventions change, and how will your team know to do so?

3. What did the `/context` breakdown show you that surprised you? What was consuming more tokens than you expected?

4. In the three-phase workflow, why did `/clear` between phases matter so much? What would have happened if you carried research artifacts into planning?

5. If you commit CLAUDE.md today and it's outdated six months from now, what's your process for keeping it current?

---

## Troubleshooting

**"My project is too messy to write a CLAUDE.md — conventions aren't consistent yet"**

Write CLAUDE.md as it *should* be, not as it currently is. It becomes a North Star. As you refactor, align with CLAUDE.md instead of the old mess.

**Claude's context fills up immediately after loading your project**

This is expected with large codebases. Don't load the entire project. Scope it in CLAUDE.md: add a line like `"Focus on /src/models and /src/routes"` to keep future interactions focused. In M05, you'll use lazy loading and agent-based research to manage this more precisely.

**`/context` shows huge history bloat after just a few questions**

This is context poisoning in action. Walk through it deliberately: `/context` → ask a question → `/context` → see it grew → `/clear` → see it drop to near-zero. Use `/clear` between major phases to prevent history from becoming noise.

**`/compact` throws an error**

Try `/clear` instead — same effect, more direct. Verify available commands with `/help` if unsure.

**"We don't have a Git repo yet / we're not ready to commit this"**

Still draft CLAUDE.md and review it. The value is in the drafting and discussion, not the Git history. Commit when ready.

---

## What to Have When You're Done

- [ ] A CLAUDE.md file at the project root with:
  - [ ] Overview + tech stack
  - [ ] Key files and their purpose
  - [ ] 5–10 key conventions (error handling, async patterns, validation, naming, etc.)
  - [ ] Recent changes (last 2–3 weeks)
  - [ ] Common mistakes to avoid
  - [ ] Testing requirements
  - [ ] Deployment info (if applicable)
- [ ] CLAUDE.md committed to Git (or at minimum drafted and reviewed)
- [ ] Experience running `/context` and understanding the breakdown
- [ ] Understanding of when to use `/clear` between work phases
- [ ] A clear owner (you or your team) for keeping CLAUDE.md up to date
