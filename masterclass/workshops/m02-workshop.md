---
title: "M02: Prompt Engineering — Workshop"
description: "Side-by-side prompt comparison, model selection practice, and building your personal prompting cheat sheet."
---


**Self-directed | 45–60 min | Requires: M02 study guide read beforehand**

---

## Before You Start

This workshop makes the six prompting techniques, Devin's four principles, model selection, and effort levels tangible by showing their direct impact on output quality. By the end, you'll have a personal prompting cheat sheet and firsthand experience with the 80/20 principle in practice.

**What you'll do**

- [ ] Run a side-by-side prompt comparison (bad vs. good) to see the quality difference directly
- [ ] Work through model and effort selection scenarios
- [ ] Build and refine a prompt through iterative rounds
- [ ] Create a reusable prompt template for a recurring task in your codebase

**Prerequisites**

- M02 study guide completed (theory + readings)
- Claude Code open with a real codebase (1K–50K lines, any language)
- A moderately-complex task in mind from your codebase (e.g., adding a feature, refactoring a module)
- Access to `/effort` command and model selection in Claude Code
- A willingness to experiment and compare outputs side-by-side

---

## Part 1: Side-by-Side Prompt Comparison

**Objective**: See the direct impact of prompt quality on output.

Choose a real, moderately-complex task from your codebase. Examples:
- "Add rate limiting to the API"
- "Refactor the authentication module"
- "Find and fix memory leaks in the data pipeline"
- "Add comprehensive error handling to the payment processing"

**Step 1 — Bad Prompt**

Run this in Claude Code (substituting your own task):

```
"Improve the authentication code."
```

Observe the output: vague suggestions, possible hallucinations, unclear scope.

**Step 2 — Good Prompt**

Now run a version with full context and specific requirements:

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

Observe the output: specific, actionable suggestions; Claude understands the scope.

**Step 3 — Compare**

Reflect on what made the good prompt better: specificity, examples, clear requirements, a defined starting point. The same task, with 10 seconds of extra framing, produces vastly better results.

:::tip[Hint]
If your outputs look similar between the two prompts, try making the "bad" prompt even more vague and the "good" prompt even more specific — the contrast tends to be more dramatic on tasks that have multiple plausible interpretations.
:::

---

## Part 2: Model and Effort Selection

For each scenario below, decide for yourself which model and effort level you would use, then check the answer.

**Scenario 1: Quick Code Search**
- "Find all places where we call the deprecated `getUser()` function."
- Answer: Haiku + medium effort (fast, cheap, simple task)

**Scenario 2: Feature Implementation**
- "Add a new API endpoint for exporting user data as CSV. Here's the database schema, here's our error handling pattern, here's an example endpoint. Go."
- Answer: Sonnet + medium effort (80% of the work, good reasoning, reasonable cost)

**Scenario 3: Debug a Subtle Memory Leak**
- "Our API is leaking ~50MB per hour. The leak is in one of these three components [describe]. Trace the issue and propose a fix."
- Answer: Opus + high effort (complex reasoning, worth 5x cost)

**Cost awareness**

- Sonnet: ~$0.0001 per line of code generated (very cheap)
- Opus: ~$0.0005 per line (5x more, still under a penny per realistic line)
- A full day of Opus usage (even 2M tokens) = ~$30 in compute
- Conclusion: Use the right tool for the job. Opus on a hard problem is cheaper than Sonnet struggling for hours.

:::note
The goal here is not to memorize a lookup table but to internalize the pattern: match model power to task complexity. When in doubt, start with Sonnet + medium effort.
:::

**Scenario 4: OpusPlan Mode**

Try launching a session with `claude --model opusplan` and give it a moderately complex task. Observe: does Claude use Opus during the planning phase and then switch to Sonnet for implementation? This hybrid mode gives you deep reasoning where it matters without paying Opus prices for routine code generation.

---

## Part 3: Iterative Prompt Refinement

**Objective**: Build and refine a prompt through several passes on a real task.

Pick a real, moderately-complex task from your codebase. Then work through the following rounds.

**Round 1 — Write a Zero-Shot Prompt**

Write a simple, one-sentence version of your task and run it. Observe: is the output generic? Does it miss requirements or ignore your code style?

**Round 2 — Apply Devin's Principles**

Rewrite the prompt applying the four principles:

- Specify the approach, not just the outcome: "Don't just 'improve error handling' — implement try-catch blocks, validate inputs, log to the audit system."
- Indicate a starting point: "Start by modifying the `handleRequest()` function."
- Use defensive prompting: "Check that all numeric inputs are positive. If validation fails, return a specific error message, not a generic 500."

Rerun. Is it better?

**Round 3 — Add Context (RAG)**

- Paste the actual code into the prompt
- Paste example error messages or patterns from your codebase
- Rerun. Even better?

**Round 4 — Adjust Effort**

- If the output is already good, try `/effort low` to see if you can get similar quality faster
- If the output is mediocre, try `/effort high` to see the difference
- Note the time and quality trade-off

**Round 5 — Feedback Loop**

Review what Claude produced. Ask yourself: does this match requirements? Are there edge cases? Is it consistent with your code style? Feed a correction back:

```
"This is good but could be safer. Add validation for null input."
```

Let Claude refine. This is the normal working rhythm.

:::tip[Hint]
It is normal to need 3–5 rounds before a prompt reliably produces what you want. Each round costs very little — the time investment in prompt refinement nearly always beats reworking bad output.
:::

---

## Hands-on Exercise: Build a Reusable Prompt Template

**Objective**: Build a reusable prompt for a recurring task in your codebase.

Pick a realistic task you do repeatedly. Examples:
- "Add a new API endpoint"
- "Create a new React component"
- "Write a database migration"
- "Add comprehensive tests"

**Round 1: Zero-Shot** (5 min)

Write a one-sentence prompt: "Add a new API endpoint for user profiles."

Let Claude produce output. Observe: Generic? Missing requirements? Not following your code style?

**Round 2: Add Context and Specificity** (10 min)

Rewrite with Devin's four principles:

```
"Add a new API endpoint for `GET /users/:id/profile`.
- Returns user name, email, role, and creation date (query from the `users` table).
- Add it to the `users.routes.ts` file.
- Follow our error handling pattern: return 400 for invalid IDs, 404 if user not found, 200 with JSON if success.
- Copy the payload format from the existing `GET /users/:id` endpoint.
- Use our standard rate limiting middleware."
```

Let Claude produce output again. Review: better aligned with your requirements?

**Round 3: Feedback Loop** (10 min)

Review Claude's code. Ask clarifying questions: "Did you include validation? Does this handle concurrent requests? Is this consistent with our logging?"

Feed Claude's answers into the next prompt and refine once more. The outcome should be a prompt that produces exactly what you need.

**Round 4: Build the Template** (10 min)

Document the final prompt as a reusable template you can reach for next time. Example structure:

```
"Add a new API endpoint for [ENDPOINT].
- Route: [METHOD /path/:params]
- Returns: [describe response payload]
- Error cases: [describe 400, 404, 500 scenarios]
- Validation: [describe input validation]
- Reference implementation: [existing similar endpoint]
- Middleware: [rate limiting, auth, etc.]"
```

:::tip[Hint]
Save this template somewhere you'll actually use it — a team wiki, a notes file, or a snippets library in your editor. The value of a template compounds every time you reach for it instead of starting from scratch.
:::

**Reflect**

You just created a prompting template that will save hours of work. Every future request of this type can follow this pattern. The effort upfront — being specific, providing context — multiplies across every future use. This is prompt engineering in practice: turning vague requests into precise instructions that Claude can reliably execute.

---

## Reflection Questions

Work through these before moving on. Honest answers here will shape how you apply these skills next week.

1. **Which was more impactful: the prompting technique (being specific, providing context) or the effort level?** Look for the trade-off between prompt quality and compute. Both matter, but prompt quality is the foundation.

2. **What was the most surprising difference you saw between the bad prompt and the good one?** Note the specific moment where specificity changed the output.

3. **If you had to focus on one of Devin's principles for the next week, which would it be and why?** Connect this to your immediate work.

4. **How will you use the template you just built?** Be concrete: which task will you use it on first?

5. **What's one prompt anti-pattern you've been using that you now realize was holding you back?** Name the habit so you can break it.

---

## Common Issues

**"My prompt is already pretty specific, but Claude still hallucinates"**
— This usually means missing context (the actual code, existing patterns). Paste the relevant file or example and try again. RAG (Retrieval-Augmented Generation) is the cure. If that doesn't help, try `/effort high` to allocate more reasoning tokens.

**"The model keeps ignoring the starting point I specified"**
— The starting point needs to be concrete, not abstract. Instead of "Start by refactoring," say "Start by extracting the `PaymentProcessor` class into `src/services/payment.ts`." Defensive prompting prevents this.

**"Opus is too expensive for daily work, but Sonnet sometimes struggles"**
— This is the right tension. Rule of thumb: start with Sonnet + `/effort medium`. If it fails, try Sonnet + `/effort high` (still cheaper than Opus). Only jump to Opus for genuinely hard problems (complex reasoning, tricky debugging).

**"I don't know if my prompt template is good until Claude tries to use it"**
— True. Use Plan Mode: give the spec to Claude, let it plan, review the plan. If the plan matches your intent, the template is good. If not, refine and try again. This is the M03 workflow.

---

## What to Have Before Moving On

- [ ] A reusable prompt template (documented or saved in your notes)
- [ ] Confidence in model selection (Haiku vs. Sonnet vs. Opus)
- [ ] Muscle memory for the `/effort` command and when to use it
- [ ] One concrete task template ready to use tomorrow (e.g., "Add new API endpoint," "Refactor module," etc.)

---
