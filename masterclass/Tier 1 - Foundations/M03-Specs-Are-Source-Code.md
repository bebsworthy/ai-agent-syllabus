# M03: Specifications Are the New Source Code

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

---

### Plan Mode: The Tool for Specs

Plan Mode is a Claude Code feature that stages implementation without executing:

1. **Toggle Plan Mode**: Shift+Tab or `/plan`
2. **Ask for a Plan**: "Design a JWT authentication system for our Express API. Include the architecture, endpoints, error handling, and security considerations."
3. **Claude Responds**: Here's the full plan—architecture, file structure, edge cases, error codes, everything
4. **You Review**: Ask questions, catch assumptions, refine requirements
5. **Green Light**: "This plan looks good, execute it." Claude implements with confidence because the spec is locked in.

The magic: By the time Claude starts typing code, you've already caught 80% of the problems and ambiguities. The implementation itself is straightforward.

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

## Workshop: Facilitated Hands-on (45–60 min)

### Segment 1: Vague Spec vs. Clear Spec (10 min)

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

### Segment 2: Plan Mode Deep Dive (15 min)

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

### Segment 3: Spec Writing Exercise (20 min)

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
   - Time savings: 50–70% for complex features

4. **Alignment Across Roles**
   - Product owner: Writes the spec (now you understand how)
   - Engineers: Review and execute the plan (less ambiguity, faster iteration)
   - Stakeholders: See the plan before implementation (alignment, fewer surprises)

5. **A Concrete Example**: The spec and plan from this workshop

---

## Key Concepts

- **Specification**: A precise description of what should be built, why, and how it should behave. The source of truth for implementation.
- **Plan Mode**: A Claude Code feature that stages implementation without executing, letting you lock in requirements before code generation.
- **Functional Requirement**: A description of what the system should do (happy path and edge cases).
- **Non-Functional Requirement**: Constraints like performance, security, consistency, or compatibility.
- **Acceptance Criteria**: How you know the implementation is done (testable, measurable).
- **Integration Points**: Where this feature touches other systems.
- **Paradigm Shift**: From "developers write code" to "product owners write specs and AI writes code"—the bottleneck moves to clarity.

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

---

## Next Steps

You've learned to write clear specs and use Plan Mode to lock in requirements. Module M04 shifts focus: given that you're running tasks in Claude Code, how do you manage context to ensure Claude has the information it needs without overwhelming it with noise?
