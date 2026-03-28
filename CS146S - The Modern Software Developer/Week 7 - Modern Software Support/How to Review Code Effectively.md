# How to Review Code Effectively: A GitHub Staff Engineer's Philosophy

**Source:** https://github.blog/developer-skills/github/how-to-review-code-effectively-a-github-staff-engineers-philosophy/

**By Sarah Vessels, GitHub Staff Engineer**

---

## What is Code Review?

Code review through pull requests enables collaborators to comment on proposed changes, approve them, or request modifications before merging. Pull requests serve as the beginning of a conversation, where the author proposes improvements and reviewers act as a second set of eyes to shape implementation quality.

## Why Code Review Matters for Your Career

Code reviews provide impact and visibility. They demonstrate knowledge, communication skills, and helpfulness—all valuable for career advancement. Reviews create "linkable artifacts" that peers and managers can reference when evaluating your contributions.

## Finding and Managing Pull Requests for Review

**Discovery methods:**
- Monitor your GitHub notifications inbox regularly
- Use team Slack channels for ready-for-review announcements
- Leverage the GitHub Slack integration to subscribe to relevant pull requests
- Use advanced search queries with filters like `team-review-requested:` to find outstanding reviews

**Managing notification load:**
Keep code owner teams focused and well-defined. Overly broad teams create diffusion of responsibility, causing pull requests to languish or merge prematurely. Consider implementing first-responder rotation schedules.

## What Makes Code Review Good or Bad?

**Good reviews:**
- Provide clarity about which comments are preferences versus blockers
- Include specific, actionable examples
- Reference existing code patterns or relevant issues
- Make clear whether suggestions must precede approval

**Poor reviews lack clarity:**
- Blanket approvals without comments
- Vague feedback like "I don't like this" without explanation
- Unclear implementation timelines
- Missing context on why suggestions matter

### Example of Effective Feedback

> "I see your new method matches the existing style, taking [X] parameters. Having that many parameters hurts readability and implies the function is doing too much. What do you think about refactoring this method and the existing ones in a later pull request to reduce how many parameters they take?"

This comment succeeds by being specific, referencing concrete code, suggesting solutions, and providing reasoning.

## How to Give a Good Code Review

**Ask questions** to understand the author's assumptions about data shape, edge cases, and performance implications. Trust the author's domain knowledge while validating their thinking through inquiry.

**Offer affirmations** alongside suggestions. Comment on what you agree with—consistent patterns, good test coverage, improved readability. This acknowledges your thorough reading and provides positive reinforcement.

**Beware biases and assumptions.** Everyone makes mistakes regardless of seniority. Tests remove bias by providing objective verification rather than relying on author credibility.

**Withhold approval conscientiously.** Distinguish between personal preferences and genuine blockers. Use feature flags and keep pull requests small to reduce deployment risk, making approval easier. Reserve the "Request changes" option for serious concerns like security issues.

## Getting the Most From Code Reviews

**Review your own code first.** Self-review catches non-obvious changes and identifies oversized pull requests that should be split up.

**Welcome post-merge reviews.** Even after merging, reviews provide documentation for future readers tracking down historical decisions.

**Use draft pull requests strategically.** Mark work-in-progress changes as drafts to signal you're not ready for reviews. Return to draft when resolving conflicts or addressing feedback, then move back to "ready for review" to re-notify reviewers.

**Be gracious in responses.** React to comments with emojis, respond to disagreements respectfully, and follow through on promised improvements in subsequent pull requests. This builds trust and encourages thorough future reviews.

## Key Takeaway

Code review deserves significant time investment. As the philosophy states: "It's faster and less painful for developers to review pull requests thoroughly now than to deal with a problem later that's already shipped to production." This principle becomes even more critical in the age of AI-assisted coding.
