---
title: "M03: Specifications Are the New Source Code — Workshop"
description: "Write a real spec, run it through Plan Mode, and lock in requirements before a single line of code is written."
---


**Self-directed | 45–60 min | Requires: M03 study guide read beforehand**

---

## Before You Start

This workshop makes the spec-first workflow tangible. You will see the difference between a vague spec and a clear spec, experience Plan Mode's four-step workflow firsthand, and finish with a specification you have written, planned, refined, and implemented. By the end, you will have muscle memory for writing specifications that Claude can execute reliably.

**What you'll do**

- [ ] Compare a vague spec vs. a clear spec in Plan Mode
- [ ] Practice the four-step Plan Mode workflow on a real task
- [ ] Write a specification using the template
- [ ] Run an end-to-end Plan Mode workflow on a realistic feature

**Prerequisites**

- M03 study guide completed (theory + readings)
- Claude Code open with access to a real codebase or demo project
- Familiarity with the specification template (What/Why/How/Where/When/References)
- At least one real feature request or task from your team's backlog
- Access to Plan Mode (Shift+Tab or `/plan` command)
- Comfort asking clarifying questions and iterating on feedback

---

## Part 1: Vague Spec vs. Clear Spec

**Objective**: See the difference between implementation chaos and smooth execution.

Choose a real feature request from your backlog. If none is available, use this example: "Add user profile editing."

### Step 1 — Vague Spec

Enter Plan Mode and ask Claude to plan this:

> "Users should be able to edit their profiles."

Review the plan. Is it ambiguous? Does Claude make assumptions about which fields are editable, how error handling works, what validation is required?

**Lesson**: Vague specs produce vague plans.

### Step 2 — Clear Spec

Rewrite the same feature with precision and ask Claude to plan it again:

```
"Users can edit their profile fields: name, bio, profile picture URL, and notifications preferences.

Requirements:
- Endpoint: PUT /users/:id/profile
- Auth: User can only edit their own profile (token-based)
- Validation:
  - Name: 1–100 characters, required
  - Bio: 0–500 characters, optional
  - Profile picture: Valid HTTPS URL or null
  - Notification prefs: boolean flags (email_weekly, sms_alerts, marketing)
- Response: Updated user object + 200 OK
- Error cases:
  - 400 if validation fails (include which field and why)
  - 401 if not authenticated
  - 403 if user tries to edit someone else's profile
  - 404 if user doesn't exist
- Idempotency: Calling the same request twice must produce the same result
- Audit logging: Log all edits to the audit_log table"
```

Review the plan. Is it detailed and confident? Does it match your intent?

**Lesson**: Specific specs produce specific, reliable plans.

### Step 3 — Compare

The second spec took about 30 seconds longer to write but will save 2 hours of revision and rework. This is the ROI of specification clarity.

---

## Part 2: Plan Mode Deep Dive

**Objective**: Build hands-on comfort with the four-step workflow.

Pick a moderately-complex task from your backlog.

1. **Enter Plan Mode**
   - Press Shift+Tab or type `/plan`
   - Prompt Claude: "[Task description] — please show me your plan before implementing."

2. **Review Claude's Plan**
   - Claude will outline its approach, architecture, data models, edge cases, and error codes
   - Read through it carefully before proceeding

3. **Pause and Question**
   - Interrupt with specific concerns: "I notice you didn't mention [security concern / edge case]. How would you handle that?"
   - Continue with follow-ups: "What about [another edge case]?"
   - Each question makes the plan more complete

4. **Request Refinement**
   - Ask Claude to adjust: "Let's change the error response format. Instead of a generic message, include which validation rule failed."
   - If relevant: "Does this break backward compatibility?"
   - Iterate until the plan is solid

5. **Green Light**
   - When satisfied, say: "This plan looks good. Let's execute it."
   - Press Shift+Tab again to exit Plan Mode
   - Claude implements following the spec exactly

:::tip[Hint]
Aim for at least three rounds of questions before greenlighting. If you can't think of edge cases to probe, ask about: authentication, validation, null values, empty lists, concurrent requests, and what happens if the database is unavailable.
:::

**Key insight**: By the time Claude implements, all ambiguity has been removed. Implementation is straightforward.

---

## Part 3: Spec Writing Exercise

**Objective**: Write a specification that Claude can execute reliably.

Identify a real feature from your backlog. Target something "moderately complex" — not trivial, but not a week of work.

1. **Brainstorm Requirements**
   - Write down: what should this feature do? Include user stories, requirements, edge cases, and constraints. Start with a raw list.

2. **Structure into a Spec**
   - Reorganize your notes into the template:
     - **What**: Goal and scope
     - **Why**: Motivation
     - **How**: Functional requirements, edge cases, constraints, acceptance criteria
     - **Where**: Integration points
     - **When**: Dependencies
     - **References**: Links to relevant docs
   - Review: "Does this cover everything? Are there ambiguities?"
   - Refine until you can answer yes to: "If I gave this to Claude, would it implement correctly?"

3. **Test with Plan Mode**
   - Give the spec to Claude in Plan Mode
   - Review the plan: does it match your intent?
   - If not, identify what was unclear in the spec and refine it
   - Outcome: a spec that produces a reliable plan

:::note
The spec is the forcing function. If Claude's plan is vague or makes unexpected assumptions, that is feedback that your spec needs more precision — not that Claude is wrong. Iterate on the spec first.
:::

---

## Part 4: End-to-End Plan Mode Workflow

**Objective**: Experience the full workflow on a realistic task.

Identify a real feature, bug fix, or refactoring task you need to complete. Target something that would represent 2–4 hours of traditional engineering work. Examples:

- "Add OAuth2 login to the dashboard"
- "Implement API rate limiting"
- "Refactor the payment module to support subscriptions"
- "Add comprehensive logging to the critical path"

### Steps

1. **Write Initial Spec** — Type a specification into Claude Code using the template:
   - **What**: One sentence + scope
   - **Why**: Motivation and user benefit
   - **How**: Functional requirements, edge cases, validation, error handling, constraints
   - **Where**: Integration points, data flows
   - **When**: Dependencies
   - **References**: Links to relevant docs or prior art

2. **Request Plan** — Enter Plan Mode (Shift+Tab), then prompt:
   > "Here's the specification for [feature]. Please plan the implementation. Include architecture, file structure, data models, API endpoints, validation rules, error codes, and security considerations."

3. **Review Plan** — Read through Claude's plan carefully. Ask yourself: does this match the spec? Did Claude make reasonable assumptions? Are there gaps?

4. **Refine Plan** — Ask clarifying questions and request adjustments until the plan is solid:
   - "How do you handle [edge case]?"
   - "Is this consistent with [existing pattern]?"
   - "What about [security concern]?"
   - "Can you adjust the error response format to include...?"
   - "I notice you didn't mention [constraint] — can you address it?"

5. **Green Light and Implement** — Say: "This plan looks good. Let's execute it." (or press Shift+Tab to exit Plan Mode). Watch as Claude implements to spec with almost no surprises.

6. **Reflect** — Notice how fast implementation was once the plan was solid. The upfront investment in a clear spec eliminates revision cycles.

:::tip[Hint]
If Claude's implementation drifts from the plan, exit Plan Mode (Shift+Tab) and give direct feedback: "The plan said X, but you implemented Y. Can you fix it?" Claude will correct it.
:::

---

## Reflection Questions

Work through these after completing the exercise:

1. **How much of your total time went to planning vs. implementation?** — Most people spend roughly 70% planning and 30% writing code. This is the spec-first shift in practice.

2. **What ambiguities did you catch in the plan that would have caused rework if you had jumped straight to coding?** — Look for edge cases, error handling, and integration issues that only became visible in the planning phase.

3. **If you had skipped the plan and asked Claude to "implement the feature" directly, what would have gone wrong?** — Common answers: missing validation, wrong error codes, no logging, inconsistency with existing patterns.

4. **How would you explain the specification template to a product owner who has never seen it?** — This tests whether you have internalized the why: clarity, durability, alignment.

5. **What is one thing you would change about your plan if you could go back?** — Use this to sharpen your spec-writing instincts for next time.

---

## Common Issues

**"The plan looks good, but the implementation doesn't match it"**
— Exit Plan Mode (Shift+Tab) and review the code. Claude may have drifted or made assumptions. Provide feedback: "The plan said X, but you implemented Y. Can you fix it?" Claude will correct it.

**"I don't know what edge cases to ask about"**
— Ask about the things that usually break: authentication, validation, error handling, null values, empty lists, concurrent requests, and what happens if the database is down. These cover the most common failure modes.

**"My spec is too vague and Claude's plan reflects that"**
— Refine the spec. Claude's vague plan is direct feedback that your spec isn't clear enough. Iterate. The spec should be specific enough that Claude's plan is also specific.

**"Plan Mode is taking too long"**
— If the plan is taking more than 5 minutes, you may be asking for too much at once, or Claude is generating an overly long response. Ask Claude to be more concise: "Please provide a shorter plan: just the key files, endpoints, and error cases."

**"I finished the plan but now I'm not sure I should implement it"**
— That is the point. The plan is a forcing function that reveals whether the idea is actually sound. If the plan looks problematic, don't implement it yet. Refine the spec and re-plan.

---

## Checklist: What to Have When You Finish

- [ ] A completed specification template (saved in your team docs or wiki)
- [ ] A Plan Mode plan that was refined with at least 3 feedback rounds
- [ ] An implementation that follows the plan
- [ ] Muscle memory for the Shift+Tab command and the four-step workflow
- [ ] Confidence that the upfront effort of writing a clear spec is worth it
