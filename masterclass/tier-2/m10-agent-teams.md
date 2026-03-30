---
title: "M10: Agent Teams and Parallel Orchestration"
description: "When Agent Teams add value versus simpler patterns, and token cost analysis for parallel orchestration."
---

# M10: Agent Teams and Parallel Orchestration

**Tier 2 — Mastery | Duration: 90 min (pre-work + workshop)**

---

## Overview

You've mastered single-session workflows and subagents. Now scale to coordinated teams. Agent Teams let multiple Claude sessions work in parallel on related tasks—the Team Lead (orchestrator) manages a shared task list, Teammates execute in isolation, and they message each other to coordinate.

But parallelism has a cost: 7x token consumption vs. a single session. Teams make sense for large refactors, parallel reviews, multi-component features, and cross-repo migrations. They don't make sense for sequential dependencies, same-file edits, simple tasks, or cost-sensitive work.

This module teaches you when Agent Teams add value and when simpler patterns work better. You'll study the theory, and the workshop (M10-Agent-Teams-workshop.md) will have you enable the experimental feature (v2.1.32+), run a real multi-component task, and develop judgment about orchestration.

**Takeaway:** Judgment about when Agent Teams pay off vs when single-session/subagent is better

> **Workshop:** [M10-Agent-Teams-workshop.md](../workshops/M10-Agent-Teams-workshop.md)

---

## Prerequisites

- M09 completion (code review patterns)
- 1-2 weeks Claude Code usage
- Understanding of subagents and parallel execution
- Familiarity with task scheduling and dependencies
- Access to Claude Code v2.1.32+ (experimental Agent Teams feature)

---

## Pre-work: Theory (15-20 minutes)

### The Parallelism Stack

There's a progression from sequential to parallel execution:

| Layer | Parallelism | Cost | Best For | Worst For |
|-------|------------|------|----------|-----------|
| **Single Session** | None (sequential) | 1x | Simple tasks, quick scripts | Large, independent tasks |
| **Subagents** | Limited (serial calls within main session) | 1.3x | Role-based work (reviewer, security checker) | Truly parallel tasks |
| **Manual Parallel Sessions** | Full (you open 2 Claude Code instances) | 2x | Work that takes days (one person handles security, another does UI) | Tasks with shared state, high coordination cost |
| **Agent Teams** | Full with orchestration | 7x | Large refactors, parallel reviews, multi-component feature, cross-repo migration | Sequential dependencies, same-file edits, cost-sensitive work |
| **Alternative Orchestrators** | Full with custom logic | Varies | Specialized workflows (Multiclaude, Gas Town, OpenClaw) | Vendor lock-in risk |
| **/batch Command** | Full, independent tasks only | 2-3x | Parallel refactoring (rename function across 20 files) | Tasks with dependencies |

### Agent Teams Architecture

**Team Lead (Orchestrator):**
- Central coordinator
- Manages shared task list
- Distributes work to teammates
- Receives progress updates
- Handles inter-agent messaging

**Teammates (Workers):**
- Independent sessions (separate context windows)
- Each has its own tools, skills, hooks
- Can work on different files in parallel
- Report status back to lead
- Can message each other

**Shared Task List (Dependency-Aware):**
```yaml
Tasks:
  - id: "api_endpoint"
    description: "Create new /users endpoint with validation"
    dependencies: ["types_definition"]
    assigned_to: "api-developer"
    status: "in_progress"

  - id: "types_definition"
    description: "Define User and UserInput TypeScript types"
    dependencies: []
    assigned_to: "types-developer"
    status: "completed"

  - id: "frontend_ui"
    description: "Build UserProfile component"
    dependencies: ["api_endpoint"]
    assigned_to: "frontend-developer"
    status: "pending"

  - id: "integration_tests"
    description: "Test API → Frontend integration"
    dependencies: ["api_endpoint", "frontend_ui"]
    assigned_to: "qa-agent"
    status: "pending"
```

**Mailbox (Inter-Agent Messaging):**
Teammates message the lead:
```
api-developer → lead: "API endpoint complete. Types used: User, UserInput (v1.2)"
frontend-developer → lead: "Ready to start UI. Need: API types definition"
lead → frontend-developer: "See message from types-developer at 14:32"
```

### When Agent Teams Make Sense

**YES, use teams:**
- Large refactors (rename pattern across 500+ files)
- Parallel independent reviews (5 PRs reviewed simultaneously)
- Multi-component feature (API + UI + tests + docs, no file overlap)
- Cross-repo migration (update 10 repos in parallel)
- Complex dependency resolution (DAG of 20+ tasks)

**NO, don't use teams:**
- Sequential dependencies (B waits for A, C waits for B)
- Same-file edits (conflicts, merge pain)
- Simple tasks (<30 min of work per task)
- Cost-sensitive work (7x token cost is not justified)
- Highly interdependent logic

### Token Cost Analysis

**Single session:** ~10,000 tokens for a feature (context + reasoning + code)
**Agent Teams:** ~70,000 tokens for the same feature
- Each teammate: ~10,000 (own context window)
- Lead: ~5,000 (task list, coordination)
- Duplication: ~5,000 (shared context sent to all teammates)

**ROI threshold:** Teams pay off when parallelism saves more time than the token cost.

Example:
- Feature with 4 independent components
- Single session: 4 hours to complete sequentially
- Agent Teams: 1 hour (4 parallel) + coordination overhead
- Cost increase: 7x tokens
- Time saved: 3 hours = ~36 developer-hours saved (if 12 people waiting)
- ROI: Positive for large teams, negative for 1-2 people

---

## Takeaway

You now own:
- ✓ Understanding of when Agent Teams add value vs when they're overkill
- ✓ Ability to design tasks with parallel independence
- ✓ Experience running a real coordinated team
- ✓ Judgment: teams for large refactors, /batch for independent changes, single session for sequential work
- ✓ Cost-awareness: token multiplier vs time saved

**Apply immediately:**
- Don't default to teams; start with single session or /batch
- Use teams only when time saved > 7x token cost
- Practice designing tasks with genuine parallelism (no same-file conflicts)
- Build team habits: "Is parallelism justified here?"

---

## Key Concepts

**Agent Teams:**
Multiple Claude sessions (Teammates) coordinated by a Lead (Orchestrator). Each teammate has its own context window and can work in parallel on independent tasks.

**Task Dependency Graph (DAG):**
Visual or YAML representation of which tasks must complete before others can start. Agent Teams respect these dependencies.

**Teammate Isolation:**
Each teammate is a separate session with its own tools, context, and state. They communicate via messaging, not shared memory.

**Mailbox (Inter-Agent Messaging):**
Asynchronous messaging between teammates and the lead. Allows coordination without blocking.

**/batch Command:**
Simpler alternative for truly independent tasks (no coordination needed). Lower token cost, faster execution.

**Orchestrator vs Worker:**
- Orchestrator (Lead): Manages task list, resolves blockers, facilitates messaging
- Worker (Teammate): Executes assigned tasks, reports status, messages lead

**ROI Threshold:**
Teams are justified when: (Time saved in hours) × (cost per hour) > (Token multiplier × token cost)

---

---

## References

- **Claude Code Agent Teams Documentation:** https://claude.com/docs/agent-teams
- **LaoZhang Blog: Agent Teams Practical Guide:** https://laozhang.blog/agent-teams (hypothetical)
- **Parallel Task Orchestration:** https://en.wikipedia.org/wiki/Job_scheduling
- **DAG (Directed Acyclic Graph) Tools:**
  - Airflow: https://airflow.apache.org/
  - Dask: https://www.dask.org/
- **Alternative Orchestrators (LLM):**
  - Multiclaude: (early stage)
  - Gas Town: (early stage)
  - OpenClaw: (early stage)
- **Cost-Benefit Analysis:** https://en.wikipedia.org/wiki/Cost%E2%80%93benefit_analysis
- **The /batch Command:** Claude Code documentation

---

*Next: [M11 — Post-Deployment: Monitoring AI-Generated Systems](../Tier 3 - Operations and Scale/M11-Post-Deployment.md)*
