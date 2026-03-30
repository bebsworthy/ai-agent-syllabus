---
title: "M02: Prompt Engineering — From Vague Requests to Precise Instructions"
description: "Zero-shot, few-shot, chain-of-thought, meta prompting, and RAG — plus model selection and effort levels."
---

# M02: Prompt Engineering — From Vague Requests to Precise Instructions

## Overview

The difference between a vague request that produces mediocre code and a precise prompt that generates exactly what you need is not luck—it's technique. This module teaches you the proven prompting strategies with research backing: zero-shot (raw question), few-shot (examples), chain-of-thought (step-by-step reasoning), meta prompting (talking about how to think), and RAG (providing context). You'll also learn Devin's four prompting principles and why the mental model "Claude does ~80% of the work; you provide direction" is accurate and useful. By the end, you'll have a personal prompting cheat sheet that you'll return to constantly.

You'll also learn model and effort level selection: Sonnet 4.6 for daily work (90% of tasks), Opus 4.6 for complex reasoning (5x cost, but worth it), Haiku 4.5 for quick questions. Effort levels (`/effort low|medium|high|max`) directly trade computation for quality—you'll learn when each is worth the cost.

> **Workshop:** [M02-Prompt-Engineering-workshop.md](../workshops/M02-Prompt-Engineering-workshop.md)

---

## Pre-work: Theory (15–20 min)

### Named Prompting Techniques

#### Zero-Shot Prompting

Ask Claude a question directly without examples:

```
"Find all calls to the deprecated function `old_api()` in the codebase and show me how to replace them."
```

**When it works**: Simple, well-defined tasks; tasks Claude has clear training examples for.
**When it fails**: Novel problems, tasks requiring domain-specific reasoning, or cases where the request is ambiguous.
**Cost**: Cheapest in tokens.

#### Few-Shot Prompting

Provide 1–3 examples before asking the question:

```
"Here's how we format error messages:
- Pattern: `[ERROR] {Component}: {description}`
- Example: `[ERROR] DatabasePool: Connection timeout after 5s`

Now, write an error message for this scenario: The authentication token has expired."
```

**When it works**: When you want Claude to learn a specific style, format, or convention from your codebase.
**When it fails**: If examples are misleading or inconsistent.
**Cost**: More tokens (the examples add context), but often produces better output.

#### Chain-of-Thought Prompting

Ask Claude to reason step-by-step before answering:

```
"Let's debug this issue step-by-step.
1. What are the possible entry points for this data?
2. Where could it be transformed incorrectly?
3. How would we detect which point is the problem?
4. Now, what's the most likely culprit?"
```

**When it works**: Complex logic, debugging, optimization, any task where the reasoning matters as much as the answer.
**When it fails**: Simple lookups or tasks that don't benefit from intermediate steps.
**Cost**: More tokens (more reasoning), but dramatically better accuracy on complex tasks.

#### Meta-Prompting

Tell Claude how to think about the problem:

```
"You are a code reviewer with 10 years of experience. Review this code for:
1. Security vulnerabilities
2. Performance issues
3. Maintainability concerns
Before answering, list the top 3 risks you'd check for."
```

**When it works**: When you want Claude to adopt a specific persona or framework.
**When it fails**: If the persona contradicts Claude's training (e.g., "act like a dishonest system").
**Cost**: Varies; depends on the persona and reasoning required.

#### RAG: Retrieval-Augmented Generation

Provide the exact context Claude needs to answer accurately:

````
"Here's the relevant part of our database schema:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  last_login TIMESTAMP,
  role VARCHAR(50)
);
```

Write a query to find all admin users who haven't logged in for 30 days."
````

**When it works**: Nearly always. When you have the right context, Claude's accuracy skyrockets.
**When it fails**: If you provide the wrong context, Claude will use it anyway, leading to confidently incorrect answers.
**Cost**: More tokens, but the accuracy gain is worth it.

#### Self-Consistency

Ask Claude the same question multiple times or in multiple ways, then check which answers align:

```
"Method 1: List all the places where we validate user input in the API.
Method 2: Show me every occurrence of the word 'validate' in the backend.
Compare the two lists. What did each method find that the other didn't?"
```

**When it works**: Finding edge cases, verifying Claude's understanding, checking for bugs.
**When it fails**: When the two approaches are genuinely different (and that's actually the point).
**Cost**: Higher token cost (multiple requests), but gives you confidence.

---

### Devin's Four Prompting Principles

Devin (an AI coding agent) uses four principles that apply directly to Claude Code:

1. **Specify the Approach, Not the Outcome**
   - Bad: "Make this code faster."
   - Good: "Optimize this function by caching the results of `expensiveQuery()` and using memoization."
   - Why: Claude understands concrete steps better than abstract goals.

2. **Indicate Starting Points**
   - Bad: "Refactor this module."
   - Good: "Refactor this module. Start by extracting the `PaymentProcessor` class into its own file."
   - Why: A concrete starting point prevents Claude from going in unproductive directions.

3. **Defensive Prompting**
   - Bad: "Add validation to this function."
   - Good: "Add validation to this function. Check that `user_id` is a positive integer and `email` matches a valid email regex. If either fails, return a 400 error with a clear message."
   - Why: Defensive prompting prevents hallucinations by being specific about edge cases.

4. **Feedback Mechanisms**
   - Bad: Ask once and use the result.
   - Good: Ask Claude to solve it, review, ask clarifying questions, iterate.
   - Why: Claude improves when you provide feedback within a session.

---

### The 80/20 Rule: Realistic Expectations

The research consensus (and the actual experience of thousands of developers) is:

- Claude handles ~80% of a task through straightforward pattern matching
- You provide 20% through direction, context, and verification
- This translates to roughly 50–80% time savings on routine work (not 100%)

This is not a weakness—it's a feature. You keep control. Claude handles the heavy lifting on tasks you've clearly defined. This is dramatically better than the "write all the code" fantasy that doesn't deliver.

**Example**:
- Task: "Add JWT authentication to our Express API"
- 80% work: Implementation of routes, middleware, token generation/validation
- 20% work: Your specs (where to add it, which routes, error handling strategy), your review and testing
- Time savings: 6 hours of work → 1.5 hours (you write the plan, Claude implements, you test)

---

### Model Selection: Cost vs. Reasoning

| Model | Cost | Speed | Reasoning | Context | Best For |
|-------|------|-------|-----------|---------|----------|
| **Haiku 4.5** | $0.80/1M | Very fast | Basic | 128K | Quick questions, code search, simple edits |
| **Sonnet 4.6** | $3/1M | Fast | Good | 1M | Daily work, 90% of production use |
| **Opus 4.6** | $15/1M | Slower | Excellent | 1M | Complex reasoning, architecture decisions, debugging hard problems |

**Decision rule**:
- Default to Sonnet. It's fast and costs $3 per million tokens (~$0.0001 per line of code).
- Use Opus for genuinely complex tasks (you'll know when).
- Use Haiku only for fast questions where quality doesn't matter (search, counting, quick edits).

---

### Effort Levels: Computation Trade-offs

Claude Code supports `/effort low|medium|high|max`. Each level increases the number of reasoning tokens Claude uses before generating the final answer.

- `/effort low`: Quick answer, lower cost, suitable for simple tasks
- `/effort medium` (default): Balanced reasoning and cost
- `/effort high`: Deep reasoning, higher cost, for complex debugging or architecture
- `/effort max`: Maximum reasoning tokens, highest cost, for very hard problems

**Rule of thumb**: Use the minimum effort level that produces the result you need. If medium produces hallucinations, try high. If high is overkill, step back to medium.

---

### Keywords That Trigger Better Reasoning

- "Let me think through this step-by-step..."
- "Let's reason about this carefully..."
- "Before answering, here's what I need to consider..."
- "I'm going to think harder about this..."

These don't magically add reasoning; they signal to Claude that you expect careful work. Combined with `/effort high`, they're powerful.

---

## Pre-work: Readings

### Essential Readings

1. **"Prompt Engineering Guide" (OpenAI)**
   - Comprehensive overview of zero-shot, few-shot, and chain-of-thought. Directly applicable.
   - Link: https://platform.openai.com/docs/guides/prompt-engineering

2. **"Prompt Engineering Overview" (OpenAI)**
   - Focus on examples and common patterns. 15 min read.
   - Link: https://platform.openai.com/docs/guides/prompt-engineering

3. **"Tree of Thoughts: Deliberate Problem Solving with LLMs" (Wei et al.)**
   - Advanced technique where you ask Claude to explore multiple reasoning paths. Optional but powerful.
   - Link: https://arxiv.org/abs/2305.10601

4. **"Devin Coding Agents 101" (Cognition AI)**
   - Focus on the "Four Prompting Principles" section. Directly applicable to Claude Code.
   - Link: (search for "Devin prompting principles" on Cognition AI docs)

5. **Claude Code Documentation: Model Selection and Effort Levels**
   - Official guidance on when to use Sonnet vs. Opus vs. Haiku.
   - Link: https://claude.com/claude-code (or internal docs)

---

## Takeaway

By the end of this module, you will have:

1. **A personal prompting cheat sheet** listing:
   - The six named techniques (zero-shot, few-shot, chain-of-thought, meta, RAG, self-consistency)
   - Devin's four principles
   - Keywords that trigger better reasoning
   - Model selection decision tree
   - Effort level decision rules

2. **Habit #1: Specific Before Vague**
   - Default to detailed prompts
   - Always specify the approach, not just the goal
   - Provide starting points

3. **Habit #2: Context First**
   - Paste the actual code
   - Reference your patterns and conventions
   - Use RAG whenever possible

4. **Habit #3: Model and Effort Discipline**
   - Sonnet for daily work
   - Opus for hard problems
   - Effort medium by default, high for complex tasks

5. **Habit #4: Iterate and Feedback**
   - First answer is rarely perfect
   - Review, ask questions, refine
   - Use feedback within a session to improve results

6. **A reusable prompt template** for a recurring task in your codebase

---

## Key Concepts

- **Zero-Shot Prompting**: Asking a question directly, without examples
- **Few-Shot Prompting**: Providing 1–3 examples before asking the main question
- **Chain-of-Thought**: Asking Claude to reason step-by-step before answering
- **Meta-Prompting**: Instructing Claude to adopt a persona or frame of mind
- **RAG (Retrieval-Augmented Generation)**: Providing exact context Claude needs to answer accurately
- **Self-Consistency**: Asking the same question multiple ways to verify the answer
- **Effort Levels**: `/effort low|medium|high|max`—computation tokens traded for reasoning quality
- **Model Selection**: Choosing Haiku (fast/cheap), Sonnet (daily work), or Opus (complex reasoning)

---

## References

- OpenAI. "Prompt Engineering Guide."
  - https://platform.openai.com/docs/guides/prompt-engineering

- Wei, J., et al. (2023). "Tree of Thoughts: Deliberate Problem Solving with Large Language Models."
  - https://arxiv.org/abs/2305.10601

- Cobbe, K., et al. (2021). "Training Verifiers to Solve Math Word Problems."
  - https://arxiv.org/abs/2110.14168 (self-consistency and chain-of-thought foundations)

- Cognition AI. "Devin: An Autonomous AI Software Engineer."
  - https://www.cognition-ai.org/devin (see "prompting principles" section)

- Anthropic. "Prompting Basics."
  - https://docs.anthropic.com/prompting (official Claude documentation)

---

## Next Steps

You now understand how to construct effective prompts. Module M03 extends this: instead of prompting reactively, you'll plan comprehensively using Plan Mode, turning specifications into the source of truth for implementation.
