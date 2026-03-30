---
title: "M02: Prompt Engineering — Workshop Guide"
description: "Side-by-side prompt comparison, model selection practice, and building your personal prompting cheat sheet."
---

# M02: Prompt Engineering — Workshop Guide

**Facilitated session | 45–60 min | Requires: M02 study guide read beforehand**

---

## Before You Start

**Facilitator note**

Participants should have completed the M02 study guide before this session. They'll need to understand the six named prompting techniques, Devin's four principles, model selection, and effort levels. This workshop makes those concepts tangible by showing their direct impact on output quality. By the end, everyone has a personal prompting cheat sheet and has experienced the 80/20 principle firsthand.

**Session Overview**

| Segment | Activity | Format | Duration |
|---------|----------|--------|----------|
| 1 | Side-by-side prompt comparison (bad vs. good) | Live demo + discussion | 15 min |
| 2 | Model and effort selection scenarios | Group problem-solving | 10 min |
| 3 | Live prompting exercise (iterative refinement) | Hands-on coding | 20 min |
| 4 | Hands-on: Build a reusable prompt template | Individual/pair work | 50 min |
| — | Debrief | Group discussion | 5 min |

**Prerequisites for participants**

- M02 study guide completed (theory + readings)
- Claude Code open with a real codebase (1K–50K lines, any language)
- Familiarity with a moderately-complex task from your codebase (e.g., adding a feature, refactoring a module)
- Access to `/effort` command and model selection in Claude Code
- A willingness to experiment and compare outputs side-by-side

---

## Segment 1: Side-by-Side Prompt Comparison (15 min)

**Objective**: Show the direct impact of prompt quality on output.

**Setup**:

Choose a real, moderately-complex task from the codebase. Examples:
- "Add rate limiting to the API"
- "Refactor the authentication module"
- "Find and fix memory leaks in the data pipeline"
- "Add comprehensive error handling to the payment processing"

**Activity**:

1. **Bad Prompt** (5 min)
   ```
   "Improve the authentication code."
   ```
   - Run this in Claude Code
   - Observe: Vague suggestions, possible hallucinations, unclear scope

2. **Good Prompt** (5 min)
   ```
   "Improve the authentication code by implementing rate limiting.

   Here's the current implementation:
   [paste the actual code]

   Specific improvements:
   1. Limit login attempts to 5 per IP per minute
   2. Return a 429 status with a clear error message
   3. Log all failed attempts to the audit log
   4. Start with modifying the `POST /auth/login` endpoint

   Show me the updated code and explain what changed."
   ```
   - Run this in Claude Code
   - Observe: Specific, actionable suggestions; Claude understands the scope

3. **Comparison** (5 min)
   - Discuss: What made the good prompt better? (Specificity, examples, clear requirements, starting point)
   - Lesson: The same task, with 10 seconds of extra framing, produces vastly better results

---

## Segment 2: Model and Effort Selection (10 min)

**Facilitate decision-making**:

Present three realistic scenarios. For each, ask the group: "Which model? Which effort?"

**Scenario 1: Quick Code Search**
- "Find all places where we call the deprecated `getUser()` function."
- Answer: Haiku + medium effort (fast, cheap, simple task)

**Scenario 2: Feature Implementation**
- "Add a new API endpoint for exporting user data as CSV. Here's the database schema, here's our error handling pattern, here's an example endpoint. Go."
- Answer: Sonnet + medium effort (80% of the work, good reasoning, reasonable cost)

**Scenario 3: Debug a Subtle Memory Leak**
- "Our API is leaking ~50MB per hour. The leak is in one of these three components [describe]. Trace the issue and propose a fix."
- Answer: Opus + high effort (complex reasoning, worth 5x cost)

**Cost awareness** (2 min):

- Sonnet: ~$0.0001 per line of code generated (very cheap)
- Opus: ~$0.0005 per line (5x more, still under a penny per realistic line)
- A full day of Opus usage (even 2M tokens) = ~$30 in compute
- Conclusion: Use the right tool for the job. Opus on a hard problem is cheaper than Sonnet struggling for hours.

---

## Segment 3: Live Prompting Exercise (20 min)

**Objective**: Build and refine a prompt in real-time.

**Setup**: Pick a real, moderately-complex task from the team's codebase.

**Facilitation**:

1. **Write a Zero-Shot Prompt** (3 min)
   - Group contributes ideas: "What's the task we want?"
   - Facilitator writes a simple version in Claude Code
   - Run it. Observe the output. Discuss: Did it work? What's missing?

2. **Refine with Devin's Principles** (5 min)
   - Apply principle 1: Specify the approach (not the outcome)
     - "Don't just 'improve error handling'—implement try-catch blocks, validate inputs, log to the audit system."
   - Apply principle 2: Indicate starting points
     - "Start by modifying the `handleRequest()` function."
   - Apply principle 3: Defensive prompting
     - "Check that all numeric inputs are positive. If validation fails, return a specific error message, not a generic 500."
   - Rerun the prompt. Better?

3. **Add Context (RAG)** (5 min)
   - Copy the actual code into the prompt
   - Copy example error messages or patterns from the codebase
   - Rerun. Even better?

4. **Adjust Effort** (2 min)
   - If the output is good, try `/effort low` (see if it's faster)
   - If it's mediocre, try `/effort high` (see the difference)
   - Note the time and cost trade-off

5. **Review and Feedback** (5 min)
   - Claude produces the initial implementation
   - Group reviews: "Does this match our requirements? Are there edge cases? Is it consistent with our code style?"
   - Feed back: "This is good but could be safer. Add validation for null input."
   - Claude refines.

---

## Hands-on Exercise: Build a Reusable Prompt Template

**Objective**: Build a reusable prompt for a recurring task.

**Setup** (5 min):

Pick a realistic task that the team does repeatedly. Examples:
- "Add a new API endpoint"
- "Create a new React component"
- "Write a database migration"
- "Add comprehensive tests"

**Steps** (50 min):

1. **Round 1: Zero-Shot** (5 min)
   - Write a one-sentence prompt: "Add a new API endpoint for user profiles."
   - Let Claude produce output
   - Observe: Generic? Missing requirements? Not following your code style?

2. **Round 2: Add Context and Specificity** (10 min)
   - Rewrite with Devin's four principles:
     - "Add a new API endpoint for `GET /users/:id/profile`.
     - Returns user name, email, role, and creation date (query from the `users` table).
     - Add it to the `users.routes.ts` file.
     - Follow our error handling pattern: return 400 for invalid IDs, 404 if user not found, 200 with JSON if success.
     - Copy the payload format from the existing `GET /users/:id` endpoint.
     - Use our standard rate limiting middleware."
   - Let Claude produce output again
   - Review: Better aligned with your requirements?

3. **Round 3: Feedback Loop** (10 min)
   - Review Claude's code
   - Ask clarifying questions: "Did you include validation? Does this handle concurrent requests? Is this consistent with our logging?"
   - Feed back Claude's answers into the next prompt
   - Refine once more
   - Outcome: A prompt that produces exactly what you need

4. **Round 4: Build a Template** (10 min)
   - Document the final prompt as a reusable template in your team's documentation
   - Example template:
     ```
     "Add a new API endpoint for [ENDPOINT].
     - Route: [METHOD /path/:params]
     - Returns: [describe response payload]
     - Error cases: [describe 400, 404, 500 scenarios]
     - Validation: [describe input validation]
     - Reference implementation: [existing similar endpoint]
     - Middleware: [rate limiting, auth, etc.]"
     ```
   - Use this template for future tasks

5. **Debrief** (5 min)
   - "You just created a prompting template that will save hours of work. Every future endpoint request can follow this pattern."
   - "The effort upfront (being specific, providing context) multiplies across uses."
   - "This is prompt engineering: turning vague requests into precise instructions that Claude can reliably execute."

---

## Debrief Questions

Ask the group these reflection questions before closing:

1. **"Which was more impactful: the prompting technique (being specific, providing context) or the effort level?"** — Look for insights about the trade-off between prompt quality and compute. Both matter, but prompt quality is the foundation.

2. **"What was the most surprising difference you saw between a bad prompt and a good one?"** — Capture the moment of realization about how much specificity matters.

3. **"If you had to pick one 'Devin principle' to focus on for the next week, which would it be and why?"** — Connect the workshop to their immediate work.

4. **"How will you use the template you just built?"** — Make it real: where will they apply this template first?

5. **"What's one prompt anti-pattern you've used in the past that you now realize was holding you back?"** — Encourage self-reflection on bad habits they can break.

---

## Common Issues

**"My prompt is already pretty specific, but Claude still hallucinates"**
— This usually means missing context (the actual code, existing patterns). Paste the relevant file or example and try again. RAG (Retrieval-Augmented Generation) is the cure. If that doesn't help, try `/effort high` to allocate more reasoning tokens.

**"The model keeps ignoring the starting point I specified"**
— The starting point needs to be concrete, not abstract. Instead of "Start by refactoring," say "Start by extracting the `PaymentProcessor` class into `src/services/payment.ts`." Defensive prompting prevents this.

**"Opus is too expensive for daily work, but Sonnet sometimes struggles"**
— This is the right tension. Rule of thumb: start with Sonnet + `/effort medium`. If it fails, try Sonnet + `/effort high` (still cheaper than Opus). Only jump to Opus for genuinely hard problems (complex reasoning, tricky debugging).

**"My team keeps writing vague prompts even after seeing the good vs. bad comparison"**
— Put the template on the team wiki. Make specificity the default. When someone writes a vague prompt, reply: "Can you specify [concrete details]?" It becomes a habit.

**"I don't know if my prompt template is good until Claude tries to use it"**
— True. Use Plan Mode: give the spec to Claude, let it plan, review the plan. If the plan matches your intent, the template is good. If not, refine and try again. This is the M03 workflow.

---

## What to Commit Before Leaving

Each participant should have:

- [ ] A reusable prompt template (documented or in team notes)
- [ ] Confidence in model selection (Haiku vs. Sonnet vs. Opus)
- [ ] Muscle memory for the `/effort` command and when to use it
- [ ] One concrete task template ready to use tomorrow (e.g., "Add new API endpoint," "Refactor module," etc.)

---
