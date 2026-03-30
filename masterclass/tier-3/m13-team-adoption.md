---
title: "M13: Team Adoption — Standards, Safety, and Scaling"
description: "Team adoption patterns, permission modes, cost management, team dynamics, and the 'developer owns all code' principle."
---

# M13: Team Adoption — Standards, Safety, and Scaling

## Module Overview

One developer using Claude Code is powerful. A team of developers using it without guidelines is chaos. This module addresses the hardest part of scaling AI: not the tools, but the organization.

You'll establish team conventions—what goes in global `.mcp.json` files versus project-local ones. You'll configure permission modes (Normal, Auto-Accept, Plan Mode) that balance safety with developer velocity. You'll set cost budgets so your monthly bills don't explode. Most importantly, you'll establish the principle that governs everything: **the developer is responsible for all code, whether generated or not.** AI is a tool; accountability doesn't transfer.

You'll also learn what NOT to do with Claude Code—untrusted code, production database changes, secrets handling, replacing code review—and how to structure your team's relationship with AI so it's a sustainable part of your workflow, not a source of risk or burnout.

Finally, you'll build an onboarding experience for new developers joining an AI-augmented team, and establish shared documentation so knowledge isn't trapped in individuals.

> **Workshop:** [M13-Team-Adoption-workshop.md](../workshops/M13-Team-Adoption-workshop.md)

## Prerequisites

- Completed Tier 1, Tier 2, and M11-M12
- Leadership buy-in (or at least willingness to establish standards)
- Access to your team's tooling: Git, CI/CD, cost monitoring, permission management
- Understanding of your team's existing code review and approval processes

## Pre-Work: Theory and Readings (15-20 min)

### Permission Modes and Their Trade-offs

Claude Code has several permission levels:

**1. Normal Mode (Default)**
- Prompts for approval before executing actions
- Developer sees what Claude proposes, approves or rejects
- Safe but slow; interrupts flow repeatedly
- Best for: unsure tasks, high-risk changes, learning

**2. Auto-Accept Mode**
- Approves safe actions automatically (e.g., file creation, read-only queries)
- Still prompts for risky actions (file deletion, external API calls)
- Fast but requires trust in Claude's judgment
- Best for: experienced teams, trusted workflows, time-critical tasks

**3. Plan Mode (`-p`)**
- Analyze only; never executes. Safe by design.
- Useful in CI/CD and for generating reports
- Best for: automated pipelines, review gates, non-interactive workflows

**Trade-off:** Speed vs. control. Normal is safest but slowest. Auto-Accept is faster but requires discipline. Plan mode is safe but read-only.

**Recommendation:** Start with Normal. Migrate to Auto-Accept once your team is comfortable. Use Plan mode for CI/CD.

### Cost Management at Team Scale

One developer using Claude Code might cost $50/month. A team of 20 developers could cost $10,000+/month if uncontrolled.

**Cost drivers:**
- Model selection: GPT-4 is expensive; Haiku is cheap. Different tasks need different models.
- Context size: Larger contexts cost more. Prune unnecessary files.
- Frequency: How often is Claude Code invoked per day per developer?
- Tool use: Repeated MCP calls (especially external APIs) add up.

**Cost control strategies:**
- Set monthly budgets per developer or team
- Define model selection policies: "Use Haiku for debugging, GPT-4 for architecture"
- Monitor usage: track API calls, token consumption, cost per project
- Encourage efficiency: share prompts, reuse solutions, batch operations
- Review quarterly: is Claude Code ROI positive for this team?

**Cost monitoring tools:**
- Anthropic usage dashboard (if using Claude directly)
- Your IDE's Claude Code plugin settings (usage metrics)
- Your company's cloud cost monitoring (if Claude Code is on shared account)

### The Principle: Developer Owns All Code

This is the bedrock. AI generates code faster, but:
- You are responsible for correctness
- You are responsible for security
- You are responsible for maintainability
- You are responsible for testing
- You are responsible for explaining it to others

If code is broken or insecure, you broke it or made it insecure—Claude just typed it. This principle prevents two traps:

1. **"Claude wrote this, so it's not my problem"** — No. You asked Claude to write it.
2. **"Claude is magic and always right"** — No. Claude is a tool. You must verify.

This principle shapes code review (you still review AI-generated code), testing (you still test), and culture (AI is an accelerant, not a replacement for judgment).

### What NOT to Use Claude Code For

**❌ Untrusted Code**
- Don't ask Claude to analyze/run code from untrusted sources (GitHub repos you don't own, user-submitted code)
- Malicious code could exploit Claude's tool access
- Instead: Use static analysis tools; run in isolated sandboxes; manual review first

**❌ Production Database Changes**
- Don't ask Claude to modify production databases directly
- Too risky; one wrong query damages real data
- Instead: Claude generates the SQL; a human reviews, tests on staging, approves

**❌ Secrets and Credentials**
- Don't share API keys, tokens, passwords with Claude
- They could be logged, exposed, or leaked
- Instead: Use environment variables; manage secrets separately; never paste them in prompts

**❌ Replacing Code Review**
- Don't use Claude as your only code review
- AI reviews are good at finding patterns and obvious issues, but miss context
- Instead: AI review finds candidates; humans review for architecture, correctness, maintainability

**❌ High-Pressure Situations (Initial Training)**
- Don't rely on Claude for critical deployments when your team is new to it
- You need human expertise and confidence built up first
- Instead: Practice on non-critical features first; build experience; then expand

### Team Dynamics: What Changes When You Adopt AI

**For individual developers:**
- Faster iteration: write less boilerplate, focus on hard problems
- Pressure to keep up: "Why aren't you using Claude Code?" (manage this)
- Skill atrophy: risk of over-relying on AI; ensure developers still learn fundamentals
- Responsibility clarity: your code, your bugs, your fixes

**For team leads:**
- Onboarding is faster: new devs can be productive sooner
- Code quality consistency: AI enforces standards (good and bad)
- Review time changes: review focus shifts from "is this syntactically correct" to "is this correct?"
- Cost management: must monitor and set budgets
- Knowledge preservation: workflows are documented in prompts, not just people's heads

**For teams overall:**
- Velocity goes up (good)
- Risk of groupthink goes up (bad); humans must push back on AI suggestions
- Remote teams benefit more (less synchronous back-and-forth needed)
- Trust matters: team must believe AI is helpful, not taking jobs

### The Dogfooding Principle (From Warp)

Warp is a terminal that uses AI. The Warp team uses Warp extensively to build Warp. Why? Because they catch bugs that users catch. They understand user pain. They stay honest about what the tool is and isn't.

For your team: **If you're adopting Claude Code, your team should be using it.** Tech leads, managers, everyone. Not as a crutch, but to stay honest about what it enables and what it doesn't.

### Recommended Readings

1. **"How Warp Uses Warp to Build Warp"** — Warp blog post
   - ~15 min. Focus on sections about team culture, feedback loops, and iterative improvement.
   - Link: https://www.warp.dev/blog/how-warp-uses-warp-to-build-warp

2. **"Claude Code Best Practices"** — Anthropic documentation
   - ~10 min. Guidelines on permissions, safety, team adoption.

3. **"Code Review Culture in Growing Teams"** — Your company's engineering blog or O'Reilly
   - ~10 min. How code review scales; where AI helps and where it doesn't.

4. **"Managing Technical Debt"** — Martin Fowler or equivalent
   - ~15 min. AI can create debt if misused; how to prevent it.

5. **Your Company's Security and Compliance Policies**
   - ~15 min. What does your org allow/require? Secrets? External APIs? Database access?


## Takeaway: A Team Adoption Playbook

By the end of this module, you should have:

1. **A team CLAUDE.md document** committed to your repository. Covers:
   - When to use Claude Code (and when not to)
   - Permission modes and how they're decided
   - Cost budgets and monitoring
   - Code review expectations
   - Escalation and red flags
   - Links to shared resources

2. **A new-hire onboarding checklist** that includes Claude Code. Shows:
   - Reading materials
   - Hands-on practice
   - Pairing opportunity
   - First review experience
   - Team sync schedule

3. **A monthly review process** for costs and patterns. Template:
   ```
   [ ] Pull usage data
   [ ] Check budgets
   [ ] Spot-check top users
   [ ] Identify trends
   [ ] Update team
   [ ] Revise policies
   ```

4. **A shared repository or document** for best prompts, discovered patterns, and lessons learned. Example:
   ```
   # Shared Prompts

   ## "Upgrade React Imports" (reusable)
   Prompt: [...]
   Use case: Used by 8 devs, saves 5 min per file
   Cost: $0.02 per file

   ## "Explain this Error" (interactive)
   Prompt: [...]
   Best for: debugging unfamiliar code
   ```

5. **Red flags and escalation policy**:
   ```
   If [X happens], then [Y escalation]
   - Cost spike: notify tech lead, pause usage
   - Security concern: escalate to security team
   - Repeated review failures: 1:1 with developer
   - Policy violations: update CLAUDE.md, re-train team
   ```

## Key Concepts

| Concept | Definition |
|---------|-----------|
| **Normal Mode** | Default permission level; prompts before executing actions. Safe but slow. |
| **Auto-Accept Mode** | Approves safe actions automatically; prompts for risky ones. Faster but requires trust. |
| **Plan Mode** | Analyze-only mode; never executes. Safe by design, good for automation. |
| **Developer Ownership** | Principle that developers are responsible for all code, whether generated or written manually. Accountability doesn't transfer to the AI. |
| **Cost Budget** | Monthly spending limit per developer or team. Prevents runaway costs. |
| **CLAUDE.md** | Team documentation of policies, conventions, and expectations for Claude Code usage. |
| **Dogfooding** | Using your own tools extensively. Keeps you honest about what works and what doesn't. |
| **Escalation Path** | Clear process for raising concerns or violations. Prevents problems from festering. |

## References

### Guides and Documentation
- [Claude Code Documentation](https://claude.ai/docs)
- [Warp Blog: "How Warp Uses Warp to Build Warp"](https://www.warp.dev/blog/how-warp-uses-warp-to-build-warp)
- Your company's security policies and code review standards

### Tools for Cost Monitoring
- Anthropic API Dashboard: https://console.anthropic.com
- IDE plugin usage metrics (check your IDE settings)
- Cloud cost monitoring: AWS Cost Explorer, GCP Cost Management, Azure Cost Analysis

### Books and Articles
- "Building Secure Software" (Viega & McGraw) — Context for why security matters in code generation
- "Accelerate" (Forsgren, Humble, Kim) — Metrics for software delivery; useful for measuring Claude Code impact

