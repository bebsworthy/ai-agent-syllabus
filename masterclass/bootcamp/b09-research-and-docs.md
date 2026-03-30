---
title: "09: Beating the Knowledge Cutoff"
description: "Build local documentation from live sources, architect codebases with diamond research, and access sites that block AI agents."
sidebar:
  label: "09: Research & Docs"
  order: 9
---

**35 minutes | You need: a library or API you work with that has changed recently**

## The Problem

Claude's training data has a cutoff date — and it knows nothing about your internal libraries, private APIs, or proprietary frameworks. If a public library released a breaking change last month, Claude doesn't know. If your company has an internal SDK, Claude has never seen it. If a framework renamed a method, Claude will confidently use the old name.

You can't fix the cutoff. But you can **bring the knowledge to Claude** — by building local documentation that lives in your project and loads into context when needed. This applies equally to public libraries that changed after the cutoff and to internal tools that were never in the training data to begin with.

## Do This

### 1. Use llms.txt for instant documentation

Many libraries now publish an `llms.txt` file — a condensed, LLM-friendly version of their docs at a known URL. Before doing any research, check if one exists:

```text
Fetch https://[library-docs-site]/llms.txt and save it to docs/references/[library].md
```

For example:
- `https://code.claude.com/docs/llms.txt` — Claude Code docs
- `https://docs.astro.build/llms.txt` — Astro framework
- `https://ui.shadcn.com/llms.txt` — shadcn/ui

:::tip[Check for llms.txt first]
An `llms.txt` file is purpose-built for LLM consumption — concise, structured, and maintained by the library authors. It's almost always better than scraping docs yourself. Check `[docs-url]/llms.txt` or `[docs-url]/llms-full.txt` before doing any manual research.
:::

If no `llms.txt` exists, you build the documentation yourself — or let an MCP server do the lookup for you.

### 2. Use Context7 for on-demand library docs

[Context7](https://github.com/upstash/context7) is an MCP server that acts as a live documentation lookup service. It indexes thousands of libraries and serves version-specific, LLM-optimized documentation snippets on demand — think of it as a searchable `llms.txt` for the entire ecosystem.

Instead of manually fetching and saving docs, you ask Claude a question and Context7 automatically pulls the relevant documentation into context:

```text
How do I set up server actions in Next.js 15?
```

Claude queries Context7, gets the current docs for that specific feature and version, and answers with up-to-date information — no manual research step.

**To install:**
```bash
claude mcp add context7 -- npx -y @anthropic-ai/context7-mcp@latest
```

:::tip[Context7 vs local docs — when to use which]
**Context7** is best for quick, on-demand lookups of public libraries — you ask a question, it fetches the relevant snippet. Great for day-to-day work where you need a current API signature or migration detail.

**Local docs** (saved reference files you `@`-reference) are better for internal APIs, heavily-used libraries where you want zero lookup cost per session, and when you need to curate exactly what Claude sees. The two approaches complement each other.
:::

### 3. Build a local reference from web research

Pick a library or API your project depends on where Claude's knowledge is stale or incomplete. Tell Claude to research and write a local doc:

```text
Research the current documentation for [library] v[version] at [docs-url].
Focus on: API changes since v[old-version], migration guide, and the patterns
we use (list them).

Write a reference doc to docs/references/[library]-v[version].md that I can
@-reference in future sessions.
```

Claude will fetch the documentation, extract the relevant parts, and write a structured reference file. In future sessions:

```text
@docs/references/[library]-v[version].md Update our auth module to use the new API.
```

:::note[This is a form of context engineering]
Instead of Claude researching the same docs every session (expensive, fills context), you research once and save the result. Every future session gets the knowledge for the cost of reading one file. This is the "save and restart" pattern from Module 4 applied to external knowledge.
:::

### 4. Access sites that block AI agents

Some documentation sites block automated requests — they return CAPTCHAs, require JavaScript rendering, or check user agents. Claude's WebFetch tool can't get through.

The **Chrome extension** solves this. It gives Claude access to a real browser that renders JavaScript, handles cookies, and looks like a normal user:

```text
Use the Chrome browser to go to [docs-url/specific-page], read the content
about [topic], and save a summary to docs/references/[topic].md
```

:::caution[When to use Chrome vs WebFetch]
Use WebFetch (default) for public docs, APIs, and sites that serve plain HTML. Use Chrome only when WebFetch fails — it's slower and heavier. Signs you need Chrome: 403 errors, empty responses, "enable JavaScript" messages, or login-gated content you can authenticate to in the browser.
:::

### 5. Generate an architecture document

For your own codebase, Claude can generate documentation that helps future sessions (and new team members) understand the system:

```text
Analyze the entire codebase and write docs/ARCHITECTURE.md covering:
- System overview and purpose
- Major components and their responsibilities
- Data flow for the 3 most important user journeys
- Key architectural decisions and their rationale
- External dependencies and integration points
- Directory structure with brief descriptions

This will be @-referenced in future sessions, so optimize for what Claude
needs to understand before making changes.
```

:::tip[Architecture docs pay for themselves]
An architecture doc costs one session to generate. Every future session where Claude `@`-references it instead of exploring the codebase from scratch saves thousands of tokens of file reads and search results. Update it when the architecture changes.
:::

### 6. Diamond research pattern

For complex research where a single agent would hit its limits — or where you want breadth across multiple sources — use the diamond pattern: **fan out to N research agents, each writing to their own file, then fan in with one agent that synthesizes the results.**

```text
I need comprehensive research on [topic]. Launch 3 research agents in parallel:

Agent 1: Research [angle 1] and write findings to docs/research/[topic]-[angle1].md
Agent 2: Research [angle 2] and write findings to docs/research/[topic]-[angle2].md
Agent 3: Research [angle 3] and write findings to docs/research/[topic]-[angle3].md

When all three are done, launch a fourth agent to read all three files and
produce a unified docs/research/[topic]-summary.md that:
- Deduplicates overlapping findings
- Resolves contradictions (flag any it can't resolve)
- Organizes by theme, not by source agent
- Highlights actionable recommendations
```

**Real example — evaluating a framework migration:**

```text
Launch 3 research agents in parallel:

Agent 1: Research Next.js App Router migration from Pages Router.
  Focus on breaking changes and gotchas. Write to docs/research/nextjs-breaking.md

Agent 2: Research Next.js App Router performance patterns — caching, streaming,
  parallel routes. Write to docs/research/nextjs-performance.md

Agent 3: Research our current codebase (use subagent to explore src/pages/)
  and catalog every pattern that will need to change. Write to docs/research/nextjs-our-patterns.md

When done, synthesize all three into docs/research/nextjs-migration-plan.md
```

:::note[Why the diamond pattern works]
Each research agent has its own fresh context window — no competition for space. Writing to files means nothing is lost to compaction. The synthesis agent reads clean, structured inputs instead of raw conversation noise. And you can re-run any single agent if its output isn't good enough without redoing the others.
:::

**Variations:**
- **2 agents** for simpler research (e.g., "current state" + "best practices")
- **5+ agents** for large-scale audits (one per module/service)
- **Iterative diamond** — run a second round of agents that build on the first synthesis

## Putting it together

The pattern across all these techniques is the same: **externalize knowledge into files, reference files instead of re-researching.**

| Technique | When to use | Output |
|-----------|-------------|--------|
| `llms.txt` | Library has one published | Direct download, minimal effort |
| Context7 MCP | Quick lookups of public library docs | On-demand, no saved file needed |
| Web research → local doc | Stale knowledge, internal APIs, heavy reuse | `docs/references/[lib].md` |
| Chrome browser | Blocked sites, JS-rendered docs | Same, via real browser |
| Architecture doc | Onboarding Claude to your codebase | `docs/ARCHITECTURE.md` |
| Diamond research | Complex topics needing breadth | N research files + synthesis |

:::note[Why this matters]{icon="magnifier"}
The knowledge cutoff is the single biggest source of confident-but-wrong Claude output. Every time Claude uses a deprecated API or an old pattern, it's because it doesn't have current docs. Building local references turns a recurring problem into a one-time cost — and the files you create benefit every team member's Claude sessions, not just yours.
:::

## Artifact

At least one local reference document created from live sources. Understanding of the diamond research pattern for complex investigations.

## Go Deeper

[Playbook M04 — Context Engineering](/tier-1/m04-context-engineering/) for advanced context management strategies. [Playbook M10 — Agent Teams](/tier-2/m10-agent-teams/) for coordinating multi-agent research at scale.
