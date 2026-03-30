---
title: "M14: What's Next — Evaluating the Evolving Landscape — Workshop Guide"
description: "Evaluate a new AI tool using the course frameworks and build your team's scoring scorecard."
---


**Self-directed | 45–60 min | Requires: M14 study guide read beforehand**

---

## Before You Start

**Prerequisites**
- M14 study guide read (theory + readings)
- Completion of Tier 1, Tier 2, M11-M13 (the entire course)
- Access to at least one AI coding tool (Claude Code, Cursor, Copilot, or other)
- A text editor for documenting evaluation results

**What this workshop does**
The theory covers evaluation frameworks and future directions. This workshop applies that learning directly. You will retrospect on the course, build a custom evaluation framework for your team, reflect on the future of AI in development, and evaluate a real tool using your new framework. By the end, you will have a transferable evaluation scorecard and a clear decision process for adopting new tools.

---

## What You'll Do

- Exercise 1: Course retrospective
- Exercise 2: Build your evaluation framework
- Exercise 3: Speculate on AI's future
- Hands-on: Evaluate a new tool

---

## Exercise 1: Retrospective on This Course

**Goal:** Synthesize what you've learned.

1. **Recall your "aha" moment.** Identify one insight from the course that genuinely shifted how you think. Examples:
   - "I didn't know context was so important"
   - "Now I understand why security matters"
   - "I'm going to use MCP tools more"

2. **Identify patterns in your own learning.** Look back across the modules:
   - Where did you grow most comfortable with AI?
   - What concerns remain, and are they healthy to carry forward?
   - Where do you most want to adopt this at work?

3. **Decide: what will you do differently on Monday?**
   - Use Claude Code differently?
   - Set up new workflows?
   - Change team processes?

4. **Document:** Write down your key insights. You'll reference them in Exercise 2.

:::note
The most common recurring insight from this course is the importance of context management. If that's yours too, you're in good company. Also worth noting: "AI is a tool, not magic" and concerns about responsibility and security are both healthy takeaways to hold onto.
:::

---

## Exercise 2: Build Your Evaluation Framework

**Goal:** Create a rubric for evaluating new tools.

You'll adapt the 6 criteria from the Pre-Work:

**Rank by importance for your team** (1–5):

1. Context Management: ___ (Does it see enough? Fast to use?)
2. Tool Integration: ___ (Can it work with your stack?)
3. Agent Architecture: ___ (How it thinks and acts?)
4. Security: ___ (Safe for your code?)
5. Cost: ___ (Affordable?)
6. Ecosystem: ___ (Can you share configs? Extend it?)

**Add custom criteria** relevant to your team:
- Availability/latency (does it run fast enough?)
- Localization (available in your region/language?)
- Compliance (GDPR, SOC2, etc.?)
- Support (can you get help when stuck?)
- Roadmap (where is the company going?)

**Create a scorecard template:**
```
Tool: [Name]
Date Evaluated: [Date]

Criterion | Weight | Score (1-5) | Notes
Context   | 1.0    |             |
Tools     | 1.0    |             |
...
Total Score: ___

Decision:
[ ] Adopt (pilot immediately)
[ ] Monitor (revisit in 6 months)
[ ] Reject (stick with current tool)

Reasoning:
[Your justification]
```

:::tip[Hint]
Your weighting reflects your team's values, not a universal standard. A startup might weight cost heavily; a bank might weight security most. Both frameworks are valid — the goal is to make your priorities explicit before you start scoring.
:::

---

## Exercise 3: Speculate on AI in 1–2 Years

**Goal:** Think about the future without crystal-balling.

Work through each question and write down your answers before moving on:

1. **What will change?**
   - Will LLMs be faster, cheaper, or smarter?
   - Will new tools emerge?
   - Will adoption be mainstream?

2. **What will stay the same?**
   - Developers will still need to think
   - Security will still matter
   - Specs will still need clarity
   - Code will still need review

3. **What are you uncertain about?**
   - Will this actually make development faster, or just different?
   - Will junior developers learn foundational skills?
   - Will AI replace some developers?
   - Will productivity gains compound or plateau?

4. **What should your team do now to be ready?**
   - Build evaluation skills (done — this module)
   - Establish principles (done — Tier 3)
   - Stay skeptical (ongoing)
   - Measure impact (ongoing)

:::note
The point of this exercise isn't prediction accuracy. It's to surface your assumptions and risks. "Will juniors learn the basics?" is a real concern worth planning for regardless of what the future holds.
:::

---

## Hands-on Exercise: Evaluate a New Tool (30–45 min)

### Part 1: Choose a Tool (5 min)

Pick a tool you haven't used extensively:
- Cursor (if you've been using VS Code)
- GitHub Copilot (if you haven't explored it)
- A new tool from a recent AI startup
- A tool in a different category (design AI, test generation AI, etc.)

### Part 2: Use It for 15 Minutes

Give it a real task:
- Write a small function
- Debug an issue
- Refactor some code
- Add a test suite

Take notes:
- What was easy?
- What was confusing?
- Did it understand your code?
- Did it make mistakes?
- How fast was it?
- Did it feel safe?

### Part 3: Fill Out Your Evaluation Framework (15 min)

Use the scorecard from Exercise 2. Here is a completed example to reference:

```
Tool: [Name]
Date: [Today]

Context Management (weight 1.0):
- Can see: [file, function, whole repo?]
- Speed: [instant, slow, variable?]
- Score: 3/5 (small context, sometimes helpful)

Tool Integration (weight 1.0):
- Works with: [your editor, Git, APIs, etc.]
- Feels like: [native, bolted-on, separate?]
- Score: 4/5 (integrates well, slight friction)

Agent Architecture (weight 1.0):
- Reactive/proactive: [how it thinks]
- Asks or guesses: [does it verify or just guess?]
- Score: 4/5 (reactive, sometimes asks)

Security (weight 1.5):
- Permissions: [what does it need access to?]
- Data handling: [logged, trained, cached?]
- Local or cloud: [where does code go?]
- Score: 3/5 (cloud-based, data retention unclear)

Cost (weight 0.8):
- Pricing model: [subscription, per-message, per-token?]
- Predictability: [can you estimate costs?]
- Score: 4/5 (fixed subscription, predictable)

Ecosystem (weight 0.5):
- Extensibility: [can you add your own tools?]
- Community: [active? Honest about limitations?]
- Score: 2/5 (limited plugins, emerging community)

Total Score:
(1.0×3) + (1.0×4) + (1.0×4) + (1.5×3) + (0.8×4) + (0.5×2) = 20.6 / 28 = 74%

Decision:
[ ] Adopt (this tool is better; switch)
[X] Pilot (promising; test on real projects for 4 weeks)
[ ] Monitor (interesting; check back later)
[ ] Reject (not a fit for us)

Reasoning:
This tool has better agent architecture and cost structure than Claude Code. But context management is weak, and data handling is unclear. Worth piloting on non-sensitive work to see if context limitations matter in practice. If they don't, this could replace Claude Code for some use cases.
```

### Part 4: Reflect on Your Findings (10 min)

Write down your answers to these questions:
- What tool did you test?
- What surprised you?
- Would you recommend it to your team?
- How does it compare to what you're currently using?

---

## Common Issues

**"I don't have a tool to evaluate right now"** — No problem. Evaluate a tool you've already used: Cursor, Copilot, ChatGPT, or even a past tool (Tabnine, etc.). Or evaluate Claude Code itself using your new framework. This practice is more valuable than the specific tool.

**"My evaluation scored the new tool lower than Claude Code, but my gut says it's better"** — That's important feedback. Either:
   1. Your weighting is wrong (you weighted something low that actually matters to you)
   2. Your scoring is off (you gave it 2/5 for integration, but it actually works great)
   3. The framework is incomplete (missing a criterion that matters)

   Go back and revisit. This iterative process is the point.

**"The tool I evaluated is in a different category (design AI, not code generation)"** — Excellent. The framework still applies. Context, integration, security, cost — these matter for any AI tool. The scorecard might look different, but the thinking is the same.

**"I'm worried evaluating tools means we're going to switch away from Claude Code constantly"** — That's a real concern. Set a policy: "We evaluate quarterly, but we only switch if the new tool is significantly better (25% score improvement or higher) AND we've piloted it for 4 weeks." This prevents churn while staying open to improvements.

**"Some criteria are hard to score without deep experience"** — True. That's why "pilot" is an option. Score what you know (context, cost), rate other criteria as "TBD," and decide whether a pilot is worth the effort.

---

## What to Complete Before Moving On

- [ ] A documented retrospective: one "aha" moment from the course + one action item
- [ ] A custom evaluation framework (ranked criteria + decision logic)
- [ ] A completed evaluation scorecard for at least one tool
- [ ] A decision record: will you adopt, pilot, monitor, or reject that tool?
- [ ] A set of principles your team believes in (from the course)
- [ ] A commitment to revisit this framework in 6 months
