# M09: AI-Assisted Code Review

**Tier 2 — Mastery | Audience: Development teams reviewing AI-generated code**

---

## Overview

Code review matters *more* with AI-generated code, not less. When a human writes code, they internalize the design intent. When Claude generates code, it's correct but the reasoning is opaque. A human reviewer becomes the *reason check*: does this design make sense for our system?

This module teaches you that style is automatable (linters do that), but design judgment is human. The pre-work covers the Google AutoCommenter research—what automated review catches and what it irredeemably misses. The workshop builds a `/review` skill that enforces your team's checklist with structured output and practices the Writer/Reviewer pattern (one subagent writes, a fresh subagent reviews with no bias). Core principle: *you are responsible for all code you submit, regardless of whether AI generated it*.

**Duration:** 90 minutes (15-20 min pre-work + 60-75 min workshop + exercises)
**Hands-on:** /review skill + Writer/Reviewer pattern + live PR review exercise
**Takeaway:** A /review skill and the Writer/Reviewer pattern as standard practice

> **Workshop:** [M09-Code-Review-workshop.md](M09-Code-Review-workshop.md)

---

## Prerequisites

- M08 completion (security review patterns)
- 1-2 weeks Claude Code usage
- Experience reviewing code in your team's workflow
- Familiarity with your team's code style guide
- Understanding of code review best practices

---

## Pre-work: Theory (15-20 minutes)

### Why Code Review Matters *More* with AI

**Traditional code review:**
- Human wrote it → reviewer understands intent → can judge design
- Bugs are human error → reviewers look for common patterns
- Security issues are usually obvious in context

**AI-generated code review:**
- Claude wrote it → intent is opaque → reviewer *must verify logic*
- Code is correct by default → reviewers look for subtle logic errors, insecure patterns, architectural fit
- Security issues can be hidden in clean-looking code (SQL injection in a parameterized query? No. But hardcoded secret in env setup? Yes.)

**The principle:** You are responsible for all code you submit, regardless of whether AI generated it. If Claude's code has a bug and you didn't catch it in review, that's your responsibility.

### The Google AutoCommenter Study

Google published research on automated code review (arxiv paper, "AutoCommenter: A Large Language Model for Programming Comments"). Key findings:

| What AutoCommenter Did Well | What It Missed |
|---------------------------|-----------------|
| Style: naming conventions, formatting | Design: architectural fit, performance implications |
| Obvious bugs: unused variables, typos | Subtle logic: off-by-one errors, state management |
| Security patterns: hardcoded secrets, weak crypto | Context-dependent security: where this data comes from, trust boundaries |
| Trivial refactors: DRY violations, obvious optimizations | Non-trivial refactors: is this abstraction necessary? |

**Insight:** Automated review is good for checkboxes (style, obvious bugs). Human review is essential for judgment (design, context, tradeoffs).

### The Distinction: Style vs Design Judgment

**Style (automatable):**
- Naming conventions
- Indentation and formatting
- Line length limits
- Unused imports
- Function complexity (cyclomatic complexity)
- Missing comments/docstrings

**Tools:** ESLint, Prettier, SonarQube, Pylint

**Design Judgment (human):**
- Does this abstraction make sense for our architecture?
- Is this the right data structure? (linked list vs array, cache invalidation strategy)
- Performance implications for this scale?
- API design: does this parameter make sense? Should it be required or optional?
- Testability: can this be tested? Is it coupled to external systems?
- Fit with team patterns: does this follow our conventions?

**Tools:** Code reviewers (you)

### The Writer/Reviewer Pattern

**Problem:** If the person who wrote the code also reviews it, bias is unavoidable. "I wrote this, so it must be good."

**Solution:** Use subagents. One writes, a different one reviews from fresh context.

**How it works:**
1. **Writer subagent:** Generate feature code
2. **Reviewer subagent:** Fresh session, no context from writer. Reads the code cold and evaluates

**Example:**
```
Session 1 (Writer): @feature-builder implement user authentication
→ Writes auth.ts, auth.test.ts, middleware.ts

Session 2 (Reviewer): @code-reviewer review src/auth.ts
→ Fresh context; evaluates against architecture principles
→ No bias from having written the code
→ Catches things writer missed because writer was "in the flow"
```


## Takeaway

After completing the pre-work and the workshop session, you will have:

1. **Understanding of where automated review fails** — Google AutoCommenter research shows linters catch style, not design judgment
2. **Clarity on the design judgment vs. style distinction** — Automatable (naming, formatting) vs. human (architecture, tradeoffs)
3. **A `/review` skill with structured checklist** — Enforces consistent review criteria
4. **A code-reviewer subagent** — Specialized for design, correctness, and security judgment
5. **The Writer/Reviewer pattern** — Separate subagents, no bias, fresh perspective
6. **Personal responsibility** — You are accountable for all code you submit, AI-generated or not

---

## Key Concepts

**Automated vs. Human Review:**
Automated tools (linters, SAST) check style and obvious bugs. Humans check design and judgment.

**Writer Bias:**
If you write code and review it, you're biased toward thinking it's good. Using a separate reviewer prevents this.

**Writer/Reviewer Pattern:**
Separate subagents (or humans) for writing and reviewing. Writer doesn't influence reviewer's judgment.

**Design Judgment:**
Not automatable. Requires understanding of architecture, team conventions, and tradeoffs. Humans are better at this.

**Responsibility:**
You are responsible for all code you submit, AI-generated or not. If it has a bug, you should have caught it in review.

---

## References

- **Google AutoCommenter Research:** https://arxiv.org/abs/2210.02968 ("AutoCommenter: A Large Language Model for Programming Comments")
- **Google Code Review Best Practices:** https://google.github.io/eng-practices/review/
- **Trunk Engineering Playbook:** https://www.trunkbaseddevelopment.com/code-review/
- **Code Review Culture:** https://engineering.squarespace.com/blog/2020/code-review-best-practices
- **Security Review Patterns:** https://owasp.org/www-project-secure-coding-practices/
