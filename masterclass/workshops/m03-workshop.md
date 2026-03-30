---
title: "M03: Specifications Are the New Source Code — Workshop Guide"
description: "Write a real spec, run it through Plan Mode, and lock in requirements before a single line of code is written."
---

# M03: Specifications Are the New Source Code — Workshop Guide

**Facilitated session | 45–60 min | Requires: M03 study guide read beforehand**

---

## Before You Start

**Facilitator note**

Participants should have completed the M03 study guide, which covers the paradigm shift (specs as durable artifacts), the specification template, and Plan Mode mechanics. This workshop makes the workflow tangible by showing the difference between a vague spec and a clear spec, and by letting participants experience Plan Mode's four-step workflow firsthand. By the end, everyone has written a specification, generated a plan, refined it, and seen implementation follow the spec exactly. For product owners, this workshop is where clarity becomes a concrete practice.

**Session Overview**

| Segment | Activity | Format | Duration |
|---------|----------|--------|----------|
| 1 | Vague spec vs. clear spec (side-by-side comparison) | Live demo + discussion | 10 min |
| 2 | Plan Mode deep dive (four-step workflow) | Hands-on practice | 15 min |
| 3 | Spec writing exercise (template walkthrough) | Group activity | 20 min |
| 4 | End-to-end Plan Mode workflow (realistic task) | Hands-on implementation | 50 min |
| — | Debrief | Group reflection | 5 min |

**Prerequisites for participants**

- M03 study guide completed (theory + readings)
- Claude Code open with access to a real codebase or demo project
- Familiarity with the specification template (What/Why/How/Where/When/References)
- At least one real feature request or task from your team's backlog
- Access to Plan Mode (Shift+Tab or `/plan` command)
- Comfort asking clarifying questions and iterating on feedback

---

## Segment 1: Vague Spec vs. Clear Spec (10 min)

**Objective**: Show the difference between implementation chaos and smooth execution.

**Setup**:

Choose a real feature request from the backlog. If none is available, use this example: "Add user profile editing."

**Activity**:

1. **Vague Spec** (2 min)
   - "Users should be able to edit their profiles."
   - Ask Claude to implement this in Plan Mode
   - Review the plan: Is it ambiguous? Does Claude make assumptions about what fields are editable? Error handling? Validation?
   - Lesson: Vague specs produce vague plans

2. **Clear Spec** (5 min)
   - Rewrite the same feature with precision:
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
   - Ask Claude to plan this
   - Review: Is the plan detailed and confident? Does it match your intent?
   - Lesson: Specific specs produce specific, reliable plans

3. **Comparison** (3 min)
   - "The second spec took 30 seconds longer to write but will save 2 hours of revision and rework. This is the ROI of specification clarity."

---

## Segment 2: Plan Mode Deep Dive (15 min)

**Objective**: Hands-on comfort with the four-step workflow.

**Setup**: Pick a moderately-complex task from your team's backlog.

**Facilitation**:

1. **Enter Plan Mode** (2 min)
   - Shift+Tab or `/plan`
   - Ask Claude: "[Task description]—please show me your plan before implementing."

2. **Claude Generates Plan** (3 min)
   - Claude outlines approach, architecture, data models, edge cases, error codes
   - Participants review silently

3. **Pause and Question** (5 min)
   - Interrupt: "I notice you didn't mention [security concern / edge case]. How would you handle that?"
   - Claude responds
   - Continue: "What about [another edge case]?"
   - Outcome: Plan becomes more complete

4. **Request Refinement** (3 min)
   - "Let's adjust the error response format. Instead of a generic message, include which validation rule failed."
   - Claude updates the plan
   - "Does this break backward compatibility?" (If relevant)
   - Iterate until plan is solid

5. **Green Light** (2 min)
   - "This plan looks good. Let's execute it."
   - Shift+Tab again to exit Plan Mode
   - Claude implements following the spec exactly

**Key insight**: By the time Claude implements, all ambiguity has been removed. Implementation is straightforward.

---

## Segment 3: Spec Writing Exercise (20 min)

**Objective**: Write a specification that Claude can execute reliably.

**Setup**: Identify a real feature from the backlog. Target: "moderately complex" (not trivial, not a week of work).

**Facilitation**:

1. **Brainstorm Requirements** (5 min)
   - Group discusses: "What should this feature do?"
   - Facilitator captures on whiteboard/doc: user stories, requirements, edge cases, constraints
   - Outcome: A raw list of thoughts

2. **Structure into a Spec** (10 min)
   - Facilitator reorganizes into the template:
     - What: Goal and scope
     - Why: Motivation
     - How: Functional requirements, edge cases, constraints, acceptance criteria
     - Where: Integration points
     - When: Dependencies
     - References: Links to relevant docs
   - Group reviews: "Does this cover everything? Are there ambiguities?"
   - Refine: "If we gave this to Claude, would it implement correctly?"

3. **Test with Plan Mode** (5 min)
   - Give the spec to Claude in Plan Mode
   - Review the plan: Does it match your intent?
   - If not, refine the spec
   - Outcome: A spec that produces a reliable plan

---

## Hands-on Exercise: End-to-End Plan Mode Workflow

**Objective**: Experience the full workflow on a realistic task.

**Setup** (5 min):

Identify a real feature, bug fix, or refactoring task the team needs. Target: 2–4 hours of traditional engineering work. Examples:
- "Add OAuth2 login to the dashboard"
- "Implement API rate limiting"
- "Refactor the payment module to support subscriptions"
- "Add comprehensive logging to the critical path"

**Steps** (50 min):

1. **Write Initial Spec** (10 min)
   - Facilitator and group collaboratively write a specification using the template:
     - What: One sentence + scope
     - Why: Motivation and user benefit
     - How: Functional requirements, edge cases, validation, error handling, constraints
     - Where: Integration points, data flows
     - When: Dependencies
     - References: Links to relevant docs or prior art
   - Type it into Claude Code

2. **Request Plan** (5 min)
   - Enter Plan Mode: Shift+Tab
   - Prompt: "Here's the specification for [feature]. Please plan the implementation. Include architecture, file structure, data models, API endpoints, validation rules, error codes, and security considerations."
   - Claude generates the plan

3. **Review Plan** (10 min)
   - Group reads through Claude's plan
   - Discuss: "Does this match the spec? Did Claude make good assumptions? Are there gaps?"
   - Write down questions and concerns

4. **Refine Plan** (15 min)
   - Ask clarifying questions: "How do you handle [edge case]?" "Is this consistent with [existing pattern]?" "What about [security concern]?"
   - Request adjustments: "Can you adjust the error response format to include..." "I notice you didn't mention [constraint], can you address it?"
   - Claude updates the plan with each question
   - Continue until the plan is solid and matches the spec

5. **Green Light and Implement** (10 min)
   - Say: "This plan looks good. Let's execute it." (or Shift+Tab to exit Plan Mode)
   - Claude implements the plan
   - Watch as the implementation follows the spec—almost no surprises
   - Outcome: The feature, built to spec, in <15 min of actual implementation time

6. **Debrief** (5 min)
   - "Notice how long implementation took once the plan was solid? That's the ROI of specification clarity. The upfront investment in a clear spec pays off by eliminating revision cycles."

---

## Debrief Questions

Ask the group these reflection questions before closing:

1. **"How much of the total time did we spend on the plan vs. the implementation?"** — Most teams spend 70% on planning and only 30% on code. This is the shift from code-first to spec-first thinking.

2. **"What ambiguities did we catch in the plan that would have caused rework if we'd jumped straight to coding?"** — Look for edge cases, error handling, integration gotchas that became obvious only in the planning phase.

3. **"If we had skipped the plan and just asked Claude to 'implement the feature,' what would have gone wrong?"** — This makes the case for Plan Mode concretely. Usually: missing validation, wrong error codes, no logging, inconsistent with existing patterns.

4. **"How would you explain the specification template to a product owner who's never seen it before?"** — Tests whether they've internalized the Why (clarity, durability, alignment).

5. **"What's one thing you'd change about the plan if you could go back?"** — Encourages critical thinking about the planning process itself.

---

## Common Issues

**"The plan looks good, but the implementation doesn't match it"**
— Exit Plan Mode (Shift+Tab) and review the code. Usually Claude drifted or made assumptions. Provide feedback: "The plan said X, but you implemented Y. Can you fix it?" Claude will correct it.

**"I don't know what edge cases to ask about"**
— Ask questions about the things that usually break: authentication, validation, error handling, null values, empty lists, concurrent requests, what if the database is down? These are the eight most common edge cases.

**"My spec is too vague and Claude's plan reflects that"**
— This is the teaching moment. Refine the spec together. Claude's vague plan is feedback that your spec isn't clear enough. Iterate. The spec should be clear enough that Claude's plan is specific.

**"Plan Mode is taking too long"**
— It shouldn't. If the plan is taking >5 min, you're either asking for too much or Claude is generating a book instead of a concise plan. Ask Claude to be more concise: "Please provide a shorter plan: just the key files, endpoints, and error cases."

**"We finished the plan but now I'm not sure we should implement it"**
— Perfect. That's the point. The plan is a forcing function that reveals whether the idea is actually good. If the plan looks problematic, don't implement it yet. Refine the spec and the plan again.

---

## What to Commit Before Leaving

Each participant should have:

- [ ] A completed specification template (in team docs or wiki)
- [ ] A Plan Mode plan that was refined with at least 3 feedback rounds
- [ ] An implementation that follows the plan
- [ ] Muscle memory for the Shift+Tab command and the four-step workflow
- [ ] Confidence that specs are worth the upfront effort

---
