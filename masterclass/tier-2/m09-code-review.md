---
title: "M09: AI-Assisted Code Review"
description: "Why code review matters more with AI, the Writer/Reviewer pattern, and the design judgment vs. style distinction."
---


**Tier 2 — Mastery | Audience: Development teams reviewing AI-generated code**

---

## Overview

Code review matters *more* with AI-generated code, not less. When a human writes code, they internalize the design intent. When Claude generates code, it's correct but the reasoning is opaque. A human reviewer becomes the *reason check*: does this design make sense for our system?

This module teaches you that style is automatable (linters do that), but design judgment is human. The pre-work covers the Google AutoCommenter research—what automated review catches and what it irredeemably misses. The workshop builds a `/review` skill that enforces your team's checklist with structured output and practices the Writer/Reviewer pattern (one subagent writes, a fresh subagent reviews with no bias). Core principle: *you are responsible for all code you submit, regardless of whether AI generated it*.

**Duration:** 90 minutes (15-20 min pre-work + 60-75 min workshop + exercises)
**Hands-on:** /review skill + Writer/Reviewer pattern + live PR review exercise
**Takeaway:** A /review skill and the Writer/Reviewer pattern as standard practice

> **Workshop:** [M09-Code-Review-workshop.md](../workshops/M09-Code-Review-workshop.md)

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
- AI-generated code passes basic tests but frequently contains subtle defects in error handling, performance, security, and business logic—even when those tests pass. Research shows AI-generated PRs contain 1.7× more issues overall than human-written code, with particular vulnerability to security issues (2.74× more XSS vulnerabilities). "Passing tests" does not mean "passing code review."
- Security issues can be hidden in clean-looking code—and AI-generated code is statistically more likely to contain them.

**The principle:** You are responsible for all code you submit, regardless of whether AI generated it. If Claude's code has a bug and you didn't catch it in review, that's your responsibility.

### The Google AutoCommenter Study

Google published research on automated code review (arXiv 2405.13565, "AI-Assisted Assessment of Coding Practices in Modern Code Review," May 2024). Key findings:

| What AutoCommenter Did Well | What It Missed |
|---------------------------|-----------------|
| Style: naming conventions, formatting | Design: architectural fit, performance implications |
| Obvious bugs: unused variables, typos | Subtle logic: off-by-one errors, state management |
| Security patterns: hardcoded secrets, weak crypto | Context-dependent security: where this data comes from, trust boundaries, injection vectors |
| Trivial refactors: DRY violations, obvious optimizations | Non-trivial refactors: is this abstraction necessary? |

> **Note on AI tool accuracy:** Top AI-assisted review tools achieve only 51–66% recall (they miss 34–49% of real issues) and 47–62% precision (38–53% of flagged items are false positives). Automated review is a filter, not a guarantee.

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

### Security Review and AI-Generated Code

Security review is not a subset of design review—it requires its own dedicated pass. This is especially true for AI-generated code, which empirical research shows contains 2.74× more XSS vulnerabilities than human-written code.

**Why AI code is a higher security risk:**
- AI models generate syntactically correct code that passes linters and basic tests while still containing subtle injection vulnerabilities, insecure cryptographic patterns, or improper trust-boundary assumptions.
- AI code is optimized for function, not threat modeling. The model doesn't know your deployment context, data sensitivity, or attacker surface.

**Security review checklist for AI-generated code:**

| Category | What to Check |
|----------|---------------|
| Injection | SQL, shell, HTML injection; prompt injection if AI is in the call path |
| Authentication | Token handling, session expiry, privilege escalation paths |
| Secrets | Hardcoded credentials, keys in logs, overly broad permissions |
| Cryptography | Weak algorithms, insecure key storage, improper random number use |
| Trust boundaries | Does code trust input from an untrusted source? Is user-controlled data validated? |
| Error handling | Do error messages leak internal paths, stack traces, or data? |

**The 70/30 rule for security:**
Automated tools (linters, SAST scanners like CodeQL) catch roughly 70% of low-hanging security smells. Human review must catch the remaining 30%—the context-dependent vulnerabilities that require understanding your architecture, data flows, and threat model.

**Integration with M08:** Security review for AI-generated code builds on the patterns introduced in M08 (security review patterns). Apply the same defense-in-depth mindset: treat AI-generated code as untrusted input until verified. For deeper coverage of SAST/DAST fundamentals and agentic threat models, see CS146S Week 6.

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

**Important limitations:**
The Writer/Reviewer pattern prevents *writer bias*, but introduces its own risks. Human reviewers evaluating AI suggestions tend toward one of two failure modes: over-trusting high-confidence AI feedback without scrutiny, or dismissing it reflexively. Additionally, if a supervising agent aggregates reviewer findings, it may filter or downweight negative findings.

Mitigations:
1. Use truly independent reviewer agents—no shared context, no hierarchical filtering between writer and reviewer.
2. Anchor review to a checklist tied to design principles; this reduces reviewer bias toward AI-generated content.
3. Have a human verify all high-severity findings before acting on them, whether the finding came from an AI reviewer or a human one.

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

**Why Code Review Works:**
Code review detects roughly 60% of defects—significantly higher than testing alone (25–45%). Real-world deployments of structured review programs report 80% error reduction and 14% productivity gains. These gains depend on review being rigorous, not perfunctory.

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

- **Google AutoCommenter Research:** https://arxiv.org/abs/2405.13565 ("AI-Assisted Assessment of Coding Practices in Modern Code Review," May 2024)
- **Google Code Review Best Practices:** https://google.github.io/eng-practices/review/
- **Trunk Engineering Playbook:** https://www.trunkbaseddevelopment.com/code-review/
- **Code Review Culture:** https://engineering.squarespace.com/blog/2020/code-review-best-practices
- **Security Review Patterns:** https://owasp.org/www-project-secure-coding-practices/
