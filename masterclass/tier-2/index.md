---
title: "Tier 2 - Mastery: AI-Augmented Development"
---

# Tier 2 - Mastery: AI-Augmented Development

## Overview

Tier 2 deepens your Claude Code fluency from foundational usage to professional practices. You've spent 1-2 weeks shipping real code with Claude. Now learn how to design tools agents actually use, orchestrate complex workflows, secure AI-generated code, review PRs effectively, and scale work across agent teams.

This tier is structured for professional developers and DevOps engineers who completed Tier 1. Product owners can optionally join **M06 (Tool Design)** and **M08 (Security)**.

**Duration:** ~7 hours total (5 modules × 90 minutes each)
**Format:** Pre-work reading → Self-directed workshop → Concrete takeaway
**Prerequisites:** Tier 1 completion + 1-2 weeks active Claude Code usage

---

## Module Breakdown

### M06: Tool Design — Building What Agents Can Actually Use
**90 minutes | Intermediate**

Learn why mechanical API-to-tool conversion fails and how to design purpose-built MCP tools for agent cognition. Build a custom TypeScript MCP server, consolidate related functions into coherent interfaces, and return agent-efficient formats. Walk away with a working MCP server and reusable design principles.

**Audience:** Developers, DevOps, optionally Product Owners
**Hands-on:** Custom MCP server in TypeScript

---

### M07: Advanced Workflows — Skills, Subagents, and Hooks
**90 minutes | Intermediate**

Master the workflow composition stack: skills (reusable instructions), subagents (isolated workers), and hooks (deterministic lifecycle scripts). Learn three skill patterns and when to use each. Design a custom security-reviewing subagent. Wire everything into a Feature Development Workflow.

**Audience:** Developers, DevOps
**Hands-on:** Team skill + custom subagent + hook

---

### M08: Security in the Age of AI-Generated Code
**90 minutes | Intermediate**

AI accelerates both development and vulnerability creation. Study prompt injection attacks, OWASP Top Ten for LLM Applications, and context rot as a security vector. Build a security-reviewer subagent with concrete checks and integrate it into pre-commit hooks.

**Audience:** Developers, DevOps, optionally Product Owners
**Hands-on:** Security review workflow + pre-commit integration

---

### M09: AI-Assisted Code Review
**90 minutes | Intermediate**

Code review matters *more* with AI-generated code, not less. Learn why style is automatable but design judgment is human. Build a `/review` skill enforcing your team's checklist. Practice the Writer/Reviewer pattern: one subagent writes, another reviews from fresh context.

**Audience:** Developers, DevOps
**Hands-on:** /review skill + Writer/Reviewer pattern

---

### M10: Agent Teams and Parallel Orchestration
**90 minutes | Advanced**

Scale from subagents to coordinated Agent Teams. Understand when teams add value (large refactors, parallel reviews) vs when simpler patterns work better. Enable experimental Agent Teams, run a real multi-component task, observe coordination and messaging.

**Audience:** Developers, DevOps
**Hands-on:** Agent Teams on multi-component task + cost analysis

---

## How to Use This Tier

1. **Sequential learning:** Modules build on each other. Complete M06 before M07, etc.
2. **Pre-work first:** Spend 15-20 minutes on reading before each workshop.
3. **Hands-on is required:** The takeaway artifacts (skills, hooks, security workflows) become your team's infrastructure.
4. **Iterate:** After the workshop, refine your implementations in real PRs over the following week.

## What You'll Build

By the end of Tier 2, you'll own:
- A custom MCP server for your team's internal tools
- A team skill following established conventions
- A security-reviewer subagent
- A code review workflow
- Judgment about when Agent Teams pay off

---

## Tier 2 at a Glance

| Module | Title | Duration | Audience |
|--------|-------|----------|----------|
| M06 | Tool Design | 90 min | Dev, DevOps, PO* |
| M07 | Advanced Workflows | 90 min | Dev, DevOps |
| M08 | Security | 90 min | Dev, DevOps, PO* |
| M09 | Code Review | 90 min | Dev, DevOps |
| M10 | Agent Teams | 90 min | Dev, DevOps |

*PO = Product Owner (optional)

---

## Prerequisites

- ✓ Tier 1 completion (Claude Code basics, MCP fundamentals, hands-on tool creation)
- ✓ 1-2 weeks of active Claude Code usage in real projects
- ✓ Familiarity with TypeScript (for M06)
- ✓ Comfort with bash/shell scripting (for M07, M08, M09)
- ✓ Access to a team Git repository for workshop exercises

---

## Support

Each module includes:
- Curated reading list with external links
- Step-by-step workshop guide
- Runnable code examples
- Troubleshooting section

If you get stuck, revisit the "Key Concepts" section or review the References.
