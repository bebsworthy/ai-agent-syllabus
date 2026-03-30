---
title: "M14: What's Next — Evaluating the Evolving Landscape — Workshop Guide"
description: "Evaluate a new AI tool using the course frameworks and build your team's scoring scorecard."
---

# M14: What's Next — Evaluating the Evolving Landscape — Workshop Guide

**Facilitated session | 45–60 min | Requires: M14 study guide read beforehand**

---

## Before You Start

**Prerequisites for participants**
- M14 study guide read (theory + readings)
- Completion of Tier 1, Tier 2, M11-M13 (the entire course)
- Access to at least one AI coding tool (Claude Code, Cursor, Copilot, or other)
- Willingness to evaluate tools critically and share findings
- A text editor for documenting evaluation results

**What this session does**
The theory covers evaluation frameworks and future directions. This workshop applies that learning directly. Participants will retrospect on the course, build a custom evaluation framework for their team, reflect on the future of AI in development, and evaluate a real tool using their new framework. By the end, every participant has a transferable evaluation scorecard and a clear decision process for adopting new tools.

**Facilitator preparation**
- Have completed the course materials yourself
- Prepare a sample evaluation scorecard (filled out for a hypothetical tool)
- Be ready to discuss: "What surprised you most in this course?"
- Keep the tone open-ended; this is about principles, not predictions

---

## Session Plan

| Segment | Activity | Time |
|---|---|---|
| 1 | Exercise 1: Course retrospective | 15 min |
| 2 | Exercise 2: Build evaluation framework | 20 min |
| 3 | Exercise 3: Speculate on AI's future | 15 min |
| — | Hands-on: Evaluate a new tool | 30–45 min |
| — | Debrief | 5 min |

---

## Exercise 1: Retrospective on This Course (15 min)

**Goal:** Synthesize what you've learned.

In groups of 3-4:

1. **Go around:** Each person shares one "aha" moment from the course.
   - "I didn't know context was so important"
   - "Now I understand why security matters"
   - "I'm going to use MCP tools more"

2. **Identify patterns:** Are there themes across the ahas?
   - "Everyone got more comfortable with AI" (good)
   - "Everyone worries about security" (healthy)
   - "Everyone wants to use this at work" (adoption signal)

3. **Ask:** What will you do differently on Monday?
   - Use Claude Code differently?
   - Set up new workflows?
   - Change team processes?

4. **Document:** Write down the group's key insights. Share with larger group.

**Facilitator note:** Listen for:
- Themes around context management (this is the recurring insight)
- Recognition that "AI is a tool, not magic"
- Concerns about responsibility and security
- Desire to share knowledge with teams

---

## Exercise 2: Build Your Evaluation Framework (20 min)

**Goal:** Create a rubric for evaluating new tools.

You'll adapt the 6 criteria from Pre-Work:

**Rank by importance for your team** (1-5):

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

**Facilitator note:** Emphasize that weighting reflects your team's values. A startup might weight cost heavily; a bank might weight security most. Both frameworks are valid.

---

## Exercise 3: Speculate on AI in 1-2 Years (15 min)

**Goal:** Think about the future without crystal-balling.

Facilitator poses questions:

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
   - Build evaluation skills (done, this module)
   - Establish principles (done, Tier 3)
   - Stay skeptical (ongoing)
   - Measure impact (ongoing)

**Facilitator note:** The point isn't prediction accuracy. It's to surface assumptions and risks. "Will juniors learn basics?" is a real concern worth planning for.

---

## Hands-on Exercise: Evaluate a New Tool (30–45 min)

### Part 1: Choose a Tool (5 min)

Pick a tool your team hasn't used extensively:
- Cursor (if you've been using VS Code)
- GitHub Copilot (if you haven't explored it)
- A new tool from the latest AI startup
- Even a tool in a different category (design AI, test generation AI, etc.)

### Part 2: Use It for 15 Minutes (15 min)

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

Use the scorecard from Exercise 2:

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

### Part 4: Share Findings (10 min, if in a group)

Present your evaluation:
- What tool did you test?
- What surprised you?
- Would you recommend it to your team?
- How does it compare to what you're using?

---

## Debrief Questions

Ask the group:

1. **"In Exercise 1, what was the most common 'aha' moment? What does that tell us about what matters most?"** — Look for: themes around context, security, or practical adoption. This reflects what resonated most.

2. **"You ranked the 6 evaluation criteria. Which criterion did your team weight highest, and why?"** — Look for: risk tolerance (security-conscious teams weight security high), budget constraints (startups weight cost high), infrastructure complexity (enterprise teams weight integration high).

3. **"When you evaluated the tool hands-on, what surprised you most?"** — Look for: mismatch between marketing and reality; pleasant surprises; deal-breakers.

4. **"Did your hands-on evaluation match what you expected from reading about the tool?"** — Look for: importance of empirical testing over reviews. "Reviews said it was slow; using it, I found it was context-dependent." That's a valuable insight.

5. **"What principles from this course will you apply the most in your work?"** — Look for: patterns. If many people say "context management," that's the lesson that stuck. If many say "security," different lesson.

---

## Common Issues

**"I don't have a tool to evaluate right now"** — No problem. Evaluate a tool you've already used: Cursor, Copilot, ChatGPT, or even a past tool (Tabnine, etc.). Or evaluate Claude Code itself using your new framework. This practice is more valuable than the specific tool.

**"My evaluation scored the new tool lower than Claude Code, but my gut says it's better"** — That's important feedback. Either:
   1. Your weighting is wrong (you weighted something low that matters to you)
   2. Your scoring is off (you gave it 2/5 for integration, but it actually works great)
   3. The framework is incomplete (missing a criterion that matters)

   Go back and revisit. This iterative process is the point.

**"The tool I evaluated is in a different category (design AI, not code generation)"** — Excellent. The framework still applies. Context, integration, security, cost—these matter for any AI tool. The scorecard might look different, but the thinking is the same.

**"I'm worried evaluating tools means we're going to switch away from Claude Code constantly"** — That's a real concern. Set a policy: "We evaluate quarterly, but we only switch if the new tool is significantly better (25% score improvement or higher) AND we've piloted it for 4 weeks." This prevents churn while staying open to improvements.

**"Some criteria are hard to score without deep experience"** — True. That's why "pilot" is an option. Score what you know (context, cost), rate other criteria as "TBD," and decide whether a pilot is worth the effort.

---

## What to Commit Before Leaving

Each participant should have:

- [ ] A documented retrospective: one "aha" moment from the course + one action item
- [ ] A custom evaluation framework (ranked criteria + decision logic)
- [ ] A completed evaluation scorecard for at least one tool
- [ ] A decision record: will you adopt, pilot, monitor, or reject that tool?
- [ ] A set of principles your team believes in (from the course)
- [ ] A commitment to revisit this framework in 6 months
