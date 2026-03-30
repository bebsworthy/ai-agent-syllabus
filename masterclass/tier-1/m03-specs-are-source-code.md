---
title: "M03: Specifications Are the New Source Code"
description: "Plan Mode, specification templates, and the paradigm shift from code-first to spec-first development."
---


## Overview

Here's the paradigm shift: As AI accelerates implementation, the bottleneck is no longer "how fast can we write code?" but "how clear is our intent?" In a world where Claude can implement a feature in 30 minutes once the requirements are specified, the critical path moves from development to clarity. Andrew Ng frames this as the shift in PM-to-engineer ratios: as AI augments developers, we need better product managers, not more engineers. Sean Grove crystallizes it: historically, developers "shred the source code and version-controlled the binary"—in the AI era, well-written specifications are the durable artifact.

This module teaches you the workflow inversion: **idea → rapid prototype → feedback → crystal-clear spec → AI implementation**. You'll learn Plan Mode, the tool that embodies this principle. Plan Mode lets you have Claude think through the entire approach (architecture, edge cases, validation, error handling) *before* executing a single line of code. You'll see bugs and oversights caught in the plan, not in production. You'll have product owners, engineers, and stakeholders aligned on approach before implementation begins. The concrete takeaway: a specification template and a Plan Mode habit that eliminates backtracking.

This module is especially critical for product owners. By the end, you'll understand how to write a specification that developers (and Claude) can execute without ambiguity.


---

## Pre-work: Theory (15–20 min)

### The Paradigm Shift: Why Specs Matter More Than Before

#### Andrew Ng's PM-to-Engineer Ratio

Andrew Ng (co-founder of Coursera, expert in AI and product) has observed that as AI automates engineering work, the constraint shifts to the product side. With Claude, a single engineer can implement 3-5x the features they could before. But this only works if the features are *clearly defined*. Ambiguous specs become chaotic implementation—Claude will confidently build something, it won't match the intent, and you'll spend more time revising than you would have writing the code yourself.

**The math**:
- Unclear spec → Engineer writes something → 3 rounds of revision → 8 hours
- Clear spec → Claude implements → 1 round of review → 1 hour
- The difference: **product clarity**.

These numbers depend on three prerequisites: (1) the specification is clear and unambiguous, (2) relevant code context is available to Claude during implementation, and (3) teams conduct collaborative review cycles rather than treating the plan as a one-shot handoff. Vague specs or missing context increase revision cycles rather than reducing them.

#### Sean Grove's Insight: Specs as the Durable Artifact

Historically, source code was the artifact that lived in version control. But code is implementation—it's how you solved the problem *on that day with that technology*. In two years, you'll refactor it. Specifications, by contrast, encode intent. Why did we validate the email? Why does the API return a 400 vs. 404? Why does this endpoint exist?

In the AI era, specs become the source of truth:
- Specs are human-readable and durable across technology changes
- Specs can be version-controlled alongside code
- Specs are the baseline for code review (did the implementation match the spec?)
- Specs are the instruction manual for AI implementation (now and in the future)

#### Communication as the Core Technical Skill

The hardest part of building software has never been "type fast." It's been "align on what we're building." With AI, this is even more true. You can ask Claude to "make it better," and it will confidently do something—probably wrong. You can ask Claude to "add validation," and it will add *some* validation—maybe not what you meant.

Clarity of intent is the core skill. And that means learning to write specifications that are precise, unambiguous, and complete.

---

### The Specification Template

A good specification answers these questions:

1. **What** (Goal and Scope)
   - One sentence: What is this feature or change?
   - Scope: What's in scope? What's explicitly NOT in scope?

2. **Why** (Motivation)
   - Why does this feature exist? What problem does it solve?
   - Who is the user? What's their pain point?

3. **How** (Requirements and Behavior)
   - **Functional requirements**: What does it do? Describe the happy path.
   - **Edge cases and error handling**: What goes wrong? How do we handle it?
   - **Constraints**: Performance, security, consistency, compatibility?
   - **Acceptance criteria**: How do we know it's done?

4. **Where** (Integration Points)
   - What systems does it touch?
   - What data does it read/write?
   - What's the API or interface?

5. **When** (Dependencies and Sequence)
   - Does this depend on other work?
   - Is there a deployment sequence?

6. **References**
   - Link to relevant docs, prior art, similar features
   - Link to prototype or spike work

Many teams now operationalize this template using ready-made tooling. GitHub Spec-Kit (open-source, released September 2025) provides CLI support, ready-to-use Markdown templates, and Claude Code integration. AWS Kiro and similar tools follow the same workflow. These are not required—a Markdown file in your repo works—but they reduce setup friction and enforce structure automatically. GitHub Spec-Kit follows a Constitution → Specification → Design → Tasks hierarchy, where a Constitution captures immutable team principles (e.g., "All APIs return standardized error codes") that individual specs reference for consistency.

---

### The Spec as a Living Document: Using CLAUDE.md

A spec written before implementation is a starting point, not a finished artifact. During implementation, Claude will resolve ambiguities, discover edge cases, and validate assumptions. If those discoveries exist only in a chat window, they are lost.

CLAUDE.md is a persistent memory file in Claude Code (available from Claude Sonnet 4.5 onward). It lives in your repository at `.claude/CLAUDE.md` and is read by Claude at the start of every session. This makes it the natural home for your working specification.

**Workflow:**
1. Write the initial spec and store it in `.claude/CLAUDE.md`
2. Claude reads it at session start; no need to re-paste context
3. As Claude implements, it updates CLAUDE.md with resolved questions, discovered edge cases, and validated assumptions
4. A human reviews and approves those updates before Claude continues
5. The final CLAUDE.md reflects what was actually built, not just what was planned

This is especially valuable for multi-day or multi-turn projects where spec details accumulate across sessions. The spec committed to your team's Wiki is the human-readable reference; CLAUDE.md is the agent's working copy that evolves alongside the code.

> **Note:** Treat CLAUDE.md updates as you would any code change—review them in your pull request. The spec should reflect decisions, not just intentions.

---

### Plan Mode: The Tool for Specs

Plan Mode is a Claude Code feature that stages implementation without executing:

1. **Toggle Plan Mode**: Shift+Tab or `/plan`
2. **Ask for a Plan**: "Design a JWT authentication system for our Express API. Include the architecture, endpoints, error handling, and security considerations."
3. **Claude Responds**: Here's the full plan—architecture, file structure, edge cases, error codes, everything
4. **You Review**: Ask questions, catch assumptions, refine requirements
5. **Green Light**: "This plan looks good, execute it." Claude implements with confidence because the spec is locked in.

The magic: By the time Claude starts typing code, you've already caught most of the problems and ambiguities—provided the spec is clear and you've asked the right clarifying questions during review. The implementation itself is straightforward.

**Claude Code v2.0 (January 2026)** introduced a dedicated planning subagent that operates in read-only mode during Plan Mode. This means Claude explores your codebase and reasons about architecture without being able to accidentally modify files. It also includes enhanced dependency mapping and breaking-change detection. You may notice Claude asking more clarifying questions during planning—this is intentional; the planning subagent is focused on understanding your architecture before committing to an approach.

---

### Four-Step Plan Mode Workflow

1. **Ask for the Plan**
   - Shift+Tab to enter Plan Mode
   - Ask Claude to plan the approach: "Plan the implementation of JWT authentication. Include architecture, data models, API endpoints, validation rules, error cases, and security."

2. **Tell It to Pause**
   - As Claude generates the plan, review it
   - Interrupt if you see gaps: "Wait, what about token expiration? What about refresh tokens?"
   - Claude pauses. You discuss.

3. **Review and Refine**
   - Once the plan is complete, challenge assumptions
   - "Does this handle race conditions?" "What if the database is down?" "Is this consistent with our error handling pattern?"
   - Request clarifications: "For the 401 Unauthorized case, what exactly goes in the response body?"

4. **Green Light: Execute**
   - Say "Let's execute this plan" or Shift+Tab again to exit Plan Mode
   - Claude implements the plan you've both agreed on
   - Implementation almost always aligns with the spec because the spec was precise

---

### Turning Your Spec Into a Prompt: Four Principles

A well-written spec is necessary but not sufficient. You still have to give it to Claude effectively. These four principles translate specification clarity into prompting discipline:

1. **Specify the approach, not just the outcome.**
   Vague: "Add email validation."
   Clear: "Validate email format on submit; if invalid, surface an inline error below the field without clearing the field value; do not proceed to the API call."
   Claude can confidently build the second. The first leaves critical behavior undefined.

2. **Indicate starting points.**
   Reference the relevant files, architecture docs, or CLAUDE.md directly. "The validation logic should follow the pattern in `src/forms/validatePhone.ts`. The error component is in `src/components/FieldError.tsx`." This gives Claude the right code context rather than requiring it to search or guess.

3. **Practice defensive prompting.**
   Anticipate the confusion points in your spec and address them proactively. "What if the email service is unavailable? Fail silently and queue for retry—do not show an error to the user." Confusion points not addressed in the prompt become assumptions in the implementation.

4. **Provide feedback mechanisms.**
   Point Claude to tests, linters, CI output, or error logs. "Run `npm test src/forms` after implementing. If any existing tests fail, stop and flag them before continuing." This gives Claude a way to self-validate rather than waiting for you to catch problems in review.

Plan Mode guides you through these principles interactively—it's not just a planning tool, it's a prompting discipline enforced by structure.

---

### Context Engineering During Planning

A clear spec is necessary but not sufficient when implementing complex features in a large codebase. Claude has a finite context window, and simply pasting an entire spec alongside an entire codebase will degrade output quality.

**The core principle:** Keep implementation prompts to 40–60% of the context window, leaving room for code, error messages, and Claude's reasoning.

**Practical guidance during Plan Mode:**
- Surface what information Claude needs early in the planning conversation. If the spec references an existing module, paste the relevant file or a summary—don't assume Claude will find it.
- Proactively offer file references and documentation paths: "The authentication flow is in `src/auth/`. Refer to `docs/api-contracts.md` for the response format spec."
- Avoid front-loading everything. Just-in-time retrieval—providing information when Claude needs it, not all at once—is more effective than a large upfront dump.
- Use CLAUDE.md for persistent context (architecture decisions, team conventions, spec summaries) rather than re-pasting it every session.

**In complex or legacy codebases,** spec clarity alone may not be enough. Context engineering—knowing what to give Claude, when, and how much—becomes the execution-side counterpart to specification clarity.

> This topic is covered in depth in **M04 (Context Management)**. Here we focus on the planning-phase implications: the moment you write your spec, also identify what context Claude will need to execute it.

---

## Pre-work: Readings

### Essential Readings

1. **"Specs Are the New Source Code" by Ravi Mehta**
   - The founding document for this module. Read it.
   - Link: https://raviravi.medium.com/specs-are-the-new-source-code-92cb31f65e2f

2. **Andrew Ng on AI and Product Strategy**
   - Search for "Andrew Ng PM-to-engineer ratio" or "AI augments not replaces"
   - Link: https://www.deeplearning.ai/ (search for product strategy)

3. **Claude Code Plan Mode Documentation**
   - Official guide to using Plan Mode
   - Link: https://claude.com/claude-code (search "Plan Mode")

4. **"Requirements Gathering for Software" (Pragmatic Programmer)**
   - Slightly dated but fundamentally sound. Skim chapters on specification writing.
   - Link: https://pragprog.com/ (or your team's library)

---

## Workshop

The hands-on session for this module: [**M03: Specifications Are the New Source Code — Workshop Guide**](../workshops/m03-workshop.md)

## Takeaway

By the end of this module, you will have:

1. **A Specification Template** (committed to the team's repo or Wiki)
   - What / Why / How / Where / When / References format
   - Reusable for all non-trivial work
   - Saves 30 seconds to structure thinking, saves 2+ hours in rework

2. **Fluency with Plan Mode**
   - Muscle memory: Shift+Tab, ask for plan, review, refine, execute
   - Confidence: Plans catch 80% of issues before implementation starts

3. **A Habit: Spec-First, Not Code-First**
   - Default workflow: idea → spec → plan → implement
   - Not: idea → implement → revise
   - Practitioner reports indicate 50–70% time savings for complex features when specs are clear, relevant code context is available, and teams conduct collaborative review cycles

4. **Alignment Across Roles**
   - Product owner: Writes the spec (now you understand how)
   - Engineers: Review and execute the plan (less ambiguity, faster iteration)
   - Stakeholders: See the plan before implementation (alignment, fewer surprises)

5. **A Concrete Example**: The spec and plan from this workshop

> **Working in a large or legacy codebase?** A clear spec is necessary but not sufficient. Complex codebases require context engineering—knowing what code context to provide Claude, when, and in what form. Spec clarity drives what gets built; context engineering determines whether Claude can navigate the existing system to build it correctly. See **M04 (Context Management)** for techniques to make Claude effective in complex environments.

---

## Key Concepts

- **Specification**: A precise description of what should be built, why, and how it should behave. The source of truth for implementation.
- **Plan Mode**: A Claude Code feature that stages implementation without executing, letting you lock in requirements before code generation.
- **Functional Requirement**: A description of what the system should do (happy path and edge cases).
- **Non-Functional Requirement**: Constraints like performance, security, consistency, or compatibility.
- **Acceptance Criteria**: How you know the implementation is done (testable, measurable).
- **Integration Points**: Where this feature touches other systems.
- **Paradigm Shift**: From "developers write code" to "product owners write specs and AI writes code"—the bottleneck moves to clarity.
- **CLAUDE.md**: A persistent memory file in Claude Code (`.claude/CLAUDE.md`) that stores specification details, architectural decisions, and team conventions across sessions. The agent reads it at session start and can update it during implementation; humans review updates before work continues.
- **Context Engineering**: The practice of managing what information Claude has access to during implementation—what to include, when to include it, and how much. The execution-side counterpart to specification clarity.

---

## References

- Mehta, R. "Specs Are the New Source Code."
  - https://raviravi.medium.com/specs-are-the-new-source-code-92cb31f65e2f

- Ng, A. "Opportunities in AI."
  - https://www.deeplearning.ai/ (search "Andrew Ng AI strategy")

- Martin, R. C. "Clean Code: A Handbook of Agile Software Craftsmanship."
  - Chapter on specifications (foundational concepts)

- McConnell, S. "Code Complete: A Practical Handbook of Software Construction."
  - Chapter on requirements and specifications

- Anthropic. "Claude Code Plan Mode Guide."
  - https://claude.com/claude-code

- Anthropic. "Claude Memory (CLAUDE.md) Documentation."
  - https://docs.anthropic.com/claude-code (search "CLAUDE.md")

- Anthropic. "Context Engineering Guide." (September 2025)
  - https://www.anthropic.com/engineering (search "context engineering")

- GitHub. "Spec-Kit: Specification Templates and CLI for AI-Accelerated Development." (September 2025)
  - https://github.com/github/spec-kit

- Osmani, A. "Spec-Driven Development for AI Agents."
  - https://addyosmani.com (search "spec-driven AI agents")

- Willison, S. "Agentic Engineering Patterns."
  - https://simonwillison.net (search "agentic engineering")

---

## Next Steps

You've learned to write clear specs and use Plan Mode to lock in requirements. Module M04 shifts focus: given that you're running tasks in Claude Code, how do you manage context to ensure Claude has the information it needs without overwhelming it with noise?
