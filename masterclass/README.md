# AI-Augmented Development Masterclass

## Operationalizing Claude Code for Professional Teams

A blended training curriculum that combines theoretical foundations with hands-on Claude Code mastery. Designed for professional developers, DevOps engineers, and product owners who want to understand *why* AI-assisted development works — and use that understanding to get dramatically better results from the tools.

---

## Philosophy

Every module follows the same pattern:

1. **Pre-work** (15-20 min) — Self-paced theory reading that builds a mental model
2. **Workshop** (45-60 min) — Facilitated hands-on session applying the theory with Claude Code
3. **Takeaway** — A concrete artifact, habit, or workflow the learner uses from that day forward

The theory isn't academic padding. It's the "why" that makes the "how" stick. A developer who understands context failure modes manages context proactively. A developer who only knows the `/compact` command uses it reactively, after things break.

---

## Audience & Tiers

The curriculum is organized into three tiers that serve three audiences:

| Tier | Modules | Audience | Time Investment |
|---|---|---|---|
| **Tier 1 — Foundations** | M01–M05 | Everyone (developers, DevOps, product owners) | ~7 hours |
| **Tier 2 — Mastery** | M06–M10 | Developers and DevOps | ~7 hours |
| **Tier 3 — Operations & Scale** | M11–M14 | DevOps, tech leads, senior developers | ~5 hours |

Product owners complete Tier 1 and optionally attend M06 (Tool Design) and M08 (Security) from Tier 2. Developers complete Tiers 1 and 2. DevOps and tech leads complete all three tiers.

**Pacing:** Allow at least one week between modules. Each module changes how someone works, and they need time to build the muscle memory before the next one layers on. Tier 2 requires at least 1-2 weeks of daily Claude Code usage after completing Tier 1.

---

## Curriculum Overview

### Tier 1: Foundations — Everyone

| Module | Title | Theory Source | Practical Focus | Takeaway |
|---|---|---|---|---|
| M01 | How LLMs Actually Work | Transformer architecture, attention, autoregression, hallucinations | Install Claude Code, first session, codebase exploration | Mental model of what's happening under the hood |
| M02 | Prompt Engineering | Zero-shot, few-shot, chain-of-thought, meta prompting, RAG | Side-by-side prompt comparison, model selection, effort levels | Personal prompting cheat sheet + model-switching habit |
| M03 | Specs Are the New Source Code | Specification-first paradigm, communication as technical skill | Plan Mode workflow, spec writing, critique and refinement | Team spec template + Plan Mode fluency |
| M04 | Context Engineering | Four failure modes, research-plan-implement workflow | CLAUDE.md, `/context`, `/compact`, `/btw`, subagent delegation | Project CLAUDE.md + context hygiene checklist |
| M05 | Agents and MCP | Agent architecture, MCP protocol, JSON-RPC 2.0, tool discovery | Connect MCP servers, observe agent tool selection | Working MCP connections + understanding of agent reasoning |

### Tier 2: Mastery — Developers & DevOps

| Module | Title | Theory Source | Practical Focus | Takeaway |
|---|---|---|---|---|
| M06 | Tool Design for Agents | API-to-tool conversion failures, consolidation principle | Build a custom MCP server for an internal tool | Working custom MCP server + design principles |
| M07 | Advanced Workflows | Workflow composition stack, skill patterns, hook lifecycle | Build a skill, a subagent, a hook, wire into a workflow | Team skill + hook deployed to the project |
| M08 | Security in AI-Generated Code | Prompt injection, OWASP LLM Top Ten, SAST/DAST, context rot | Security-reviewer subagent, pre-commit security hook | Security review workflow in the dev process |
| M09 | AI-Assisted Code Review | AutoCommenter research, reviewing AI-generated code | `/review` skill, Writer/Reviewer pattern | Review skill + Writer/Reviewer as standard practice |
| M10 | Agent Teams | Orchestrator pattern, coordination overhead, parallelism | Run an Agent Team on a real task, compare with alternatives | Judgment on when to use teams vs simpler patterns |

### Tier 3: Operations & Scale — DevOps, Tech Leads, Senior Developers

| Module | Title | Theory Source | Practical Focus | Takeaway |
|---|---|---|---|---|
| M11 | Post-Deployment Monitoring | SRE fundamentals, observability, AI incident response | Sentry MCP, incident investigation workflow | Incident response workflow with Claude Code |
| M12 | CI/CD Integration | Headless mode, pipeline patterns, batch operations | GitHub Actions AI review, plugin packaging | CI/CD integration running in team pipeline |
| M13 | Team Adoption | Permission modes, cost management, team dynamics | Shared CLAUDE.md, `.mcp.json`, cost monitoring, onboarding | Team adoption playbook |
| M14 | What's Next | Future of dev roles, tool evaluation frameworks | Evaluate a new AI tool using course frameworks | Transferable evaluation framework |

---

## Source Material

This curriculum synthesizes content from two primary sources, supplemented with additional references:

**CS146S: The Modern Software Developer** (Stanford, Fall 2025) — Provides the theoretical foundations, reading lists, and broad coverage of the AI-assisted development landscape. Taught by Mihail Eric with guest speakers from Cognition, Warp, Vercel, Semgrep, Graphite, Resolve, and a16z.

**Claude Code Training Plan** (Internal draft) — Provides the hands-on Claude Code depth, operational patterns, cost awareness, and team adoption material. Structured as a two-phase corporate workshop.

Each module's README specifies which readings, articles, and documentation support that module's pre-work and reference material.

---

## Folder Structure

```
masterclass/
├── README.md                                ← You are here
├── Tier 1 - Foundations/
│   ├── README.md                            ← Tier overview
│   ├── M01-How-LLMs-Work.md
│   ├── M02-Prompt-Engineering.md
│   ├── M03-Specs-Are-Source-Code.md
│   ├── M04-Context-Engineering.md
│   └── M05-Agents-and-MCP.md
├── Tier 2 - Mastery/
│   ├── README.md                            ← Tier overview
│   ├── M06-Tool-Design.md
│   ├── M07-Advanced-Workflows.md
│   ├── M08-Security.md
│   ├── M09-Code-Review.md
│   └── M10-Agent-Teams.md
└── Tier 3 - Operations and Scale/
    ├── README.md                            ← Tier overview
    ├── M11-Post-Deployment.md
    ├── M12-CICD-Integration.md
    ├── M13-Team-Adoption.md
    └── M14-Whats-Next.md
```

Supplementary files for a module use the same prefix: e.g., `M04-context-hygiene-checklist.md` or `M08-security-reviewer-subagent.md`.

---

## Prerequisites

- Professional software development experience (any language/stack)
- A computer with Claude Code installed (or ready to install in M01)
- Access to a real project codebase (not a toy project — the exercises work best on production code)
- For Tier 2+: completion of Tier 1 and at least 1-2 weeks of daily Claude Code usage
- For Tier 3: completion of Tiers 1 and 2, plus team lead or DevOps responsibilities

---

*Curriculum version 1.0 — March 2026*
*Synthesized from CS146S (Stanford) and internal Claude Code training materials.*
