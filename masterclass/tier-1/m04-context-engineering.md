---
title: "M04: Context Engineering — The Only Lever That Matters"
description: "The four failure modes of large contexts and how to prevent them with CLAUDE.md and the research-plan-implement workflow."
---


## Overview

Claude has a 1 million token context window—enough to hold an entire modest codebase, 50 pages of conversation history, and detailed specifications. But size is not the constraint; *signal* is. A massive context full of boilerplate, irrelevant files, and conflicting information makes Claude *less* accurate, not more. This is the paradox of large contexts: they can hurt as much as they help.

This module covers the four failure modes from Drew Breunig's research: context poisoning (errors compound), context distraction (large contexts cause regression to copying), context confusion (too many tools overwhelm), and context clash (contradictory sequential information). You'll learn the research-backed three-phase workflow (research → plan → implement) that keeps context clean. You'll master CLAUDE.md, the single file that encodes your project's conventions, eliminating ambiguity. You'll use the context monitoring tools (`/context` shows token breakdown) to track what's actually in Claude's view. You'll learn the `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` setting to fine-tune automatic compaction. By the end, you'll have a committed CLAUDE.md in your repo and a context hygiene checklist that becomes daily habit.

This is the module where developers who seem to "get 80% time savings" differ from those who don't. It's not about intelligence; it's about context discipline.


---

## Pre-work: Theory (15–20 min)

### The Four Failure Modes of Large Contexts

Drew Breunig's research identified four ways context degrades performance:

#### 1. Context Poisoning

Errors and inconsistencies compound as you add more context. If your context includes:
- File A with version 1 of the API spec
- File B with version 2 of the API spec
- File C with code that implements version 0.5

Claude has to reconcile the contradiction. Its default behavior: follow the most recent contradictory information (or the one it reads first). This leads to implementation that doesn't match any version.

**Antidote**: Maintain a single source of truth (CLAUDE.md) that's authoritative and regularly updated.

> **Note — "Lost in the Middle":** Claude doesn't simply favor the most recent information. Research (ArXiv 2307.03172) shows a U-shaped performance curve: models use context from the beginning (primacy bias) and the end (recency bias) most reliably. Information in the middle degrades by 20–30%. When you have conflicting context, place your authoritative instructions (CLAUDE.md summary, latest spec) at the end of the context, and deduplicate or consolidate middle sections.

#### 2. Context Distraction

Larger contexts induce "copying behavior"—Claude defaults to mimicking examples and boilerplate rather than reasoning. If your context includes 50 files, Claude might:
- Copy the style of the first example, even if it's outdated
- Follow patterns from old code that were working around a bug you've since fixed
- Implement something that "looks like the codebase" without understanding why

**Antidote**: Curated context. Include the *most recent, highest-quality* examples. Avoid including multiple versions or contradictory patterns.

> **Context Rot:** Research (2024–2025) shows that performance degrades with context length *independent of content quality*. Models begin losing accuracy around 30K–50K tokens—well before reaching the nominal context limit. This means the goal isn't just to remove bad context; it's to *minimize* context overall. Keep it focused even when it's clean.

#### 3. Context Confusion

Too many tools, files, and instructions overwhelm Claude's reasoning. With 50 files in the context, Claude struggles to pick the right one to modify. With 10 MCP tools available, Claude might choose the wrong one.

**Antidote**: Lazy loading and curation. Load only the files relevant to the current task. Use a curated, small set of tools in each Agent configuration.

> **MCP Tool Overload:** This failure mode applies directly to MCP servers. Each tool description consumes tokens, and having many MCP servers active simultaneously (Jira + Notion + AWS + GitHub at once) mirrors the too-many-files problem. Lazy-load MCP tools by task: load only the servers relevant to the current phase. When configuring an agent, keep the active tool count small and intentional.

#### 4. Context Clash

Contradictory instructions given sequentially create confusion. If your CLAUDE.md says "always use error code 400 for validation failures" but your last prompt says "use 422 for validation failures," Claude has conflicting guidance.

**Antidote**: Consistency. Keep CLAUDE.md updated. When rules change, update the source of truth.

---

### Recovering from Poisoned Context

Knowing the failure modes is only half the job. When context becomes corrupted in practice, you need to diagnose and recover quickly.

**Signs that your context has been poisoned:**
- Claude's output contradicts the spec or CLAUDE.md
- Inconsistent implementations across similar functions
- Claude appears to ignore instructions it was following a few turns ago

**Recovery decision tree:**

1. **One contradictory output:** Check the most recent prompt for an accidental override. Restate the authoritative instruction explicitly.
2. **Contradiction persists (2–3 consecutive outputs):** Run `/compact` with an explicit instruction: "When compacting, treat CLAUDE.md as the authoritative source; discard any prior discussion that contradicts it."
3. **Still failing after compact:** Run `/clear` and restart with a clean context. Research shows that iterative correction within a poisoned context is slower and less reliable than starting fresh.

**Prevention cadence:**
- Check `/context` at the start of each task.
- Run `/clear` between unrelated tasks, not just at the end of the day.
- Update CLAUDE.md within 24 hours whenever a convention changes.

---

### Defending Against Adversarial Context Poisoning

The four failure modes assume accidental degradation. As of 2024–2025, intentional poisoning is an active concern.

**The threat:** External data sources—API responses, retrieved documents, web pages, third-party libraries—can contain text crafted to override your instructions. Research has shown that as few as 250 malicious documents can influence model behavior in retrieval-augmented workflows.

**Mitigations:**
- **Verify external sources.** Before pulling external content into context (API docs, web pages, user-provided files), check origin and plausibility.
- **Sandbox tool outputs.** Treat tool output as untrusted until verified—inspect it before allowing Claude to act on it.
- **CLAUDE.md as immutable ground truth.** Explicitly instruct Claude that CLAUDE.md overrides any conflicting instruction from retrieved content.
- **Validate retrieved content (CRAG pattern).** When using RAG, apply quality gates: evaluate relevance and consistency before adding retrieved chunks to context. Reject or re-retrieve low-quality chunks rather than including them blindly.

---

### CLAUDE.md: The Single Source of Truth

CLAUDE.md is a file that encodes the project's conventions, patterns, and constraints. It's not README — it's not user-facing. It's a briefing for Claude.

#### CLAUDE.md Hierarchy

Claude reads CLAUDE.md files from multiple locations, merged in order of specificity:

| Location | Scope | Shared via Git? |
|----------|-------|----------------|
| `~/.claude/CLAUDE.md` | Global — applies to all your projects | No |
| `project-root/CLAUDE.md` | Project-wide — shared with the team | Yes |
| `project-root/.claude/CLAUDE.md` | Project-specific, not committed | No (gitignored) |
| Any subdirectory `CLAUDE.md` | Active when Claude is working in that directory | Yes |

More specific files take precedence. Use the project root file for shared team conventions and `~/.claude/CLAUDE.md` for personal preferences (editor style, preferred languages, etc.).

A typical CLAUDE.md includes:

```markdown
# Project Brief for Claude Code

## Overview
This is an Express.js backend for a social media platform.
- Entry point: src/index.ts
- Database: PostgreSQL (local: postgres://localhost/app_dev)
- Architecture: REST API with JWT auth, no external dependencies except Express and pg

## Technology Stack
- Node.js 18+, Express.js 4.x, PostgreSQL 14+
- No databases beyond Postgres, no external APIs except Stripe (payments)
- Testing: Jest (unit), Supertest (integration)

## Key Files and Their Purpose
- src/routes/: Route handlers (organized by resource: users.ts, posts.ts, etc.)
- src/middleware/: Auth, logging, error handling
- src/models/: Database queries and TypeScript types
- tests/: Test files, mirror the src/ structure

## Conventions
- **Error Handling**: All errors return JSON: { error: "message", code: "ERROR_CODE", statusCode: 400 }
  - Validation failures: 400 Bad Request (code: VALIDATION_ERROR)
  - Auth failures: 401 Unauthorized (code: UNAUTHORIZED)
  - Forbidden: 403 Forbidden (code: FORBIDDEN)
  - Not found: 404 Not Found (code: NOT_FOUND)
- **Validation**: Use the validate() function in src/utils/validation.ts. Validate on entry to routes, not in middleware.
- **Database Queries**: Use parameterized queries ALWAYS. Never concatenate strings into SQL.
- **Async/Await**: All handlers must be async. Use try/catch. Never use .then().
- **API Response Format**: { success: true, data: {...} } or { success: false, error: "..." }
- **Environment Variables**: Stored in .env (local dev). Production secrets in AWS Secrets Manager.

## Recent Changes
- 2025-03-15: Migrated from callback-based queries to async/await (all queries now in models/)
- 2025-03-10: Introduced validation utility (src/utils/validation.ts). All new endpoints must use it.

## Common Mistakes to Avoid
- Don't use .then() in new code (use async/await)
- Don't validate in middleware; validate in route handlers
- Don't forget parameterized queries (??, $1, etc.)
- Don't return raw database errors to clients; wrap in { error: "...", code: "..." }

## Incomplete Work / Known Issues
- [Auth: JWT refresh tokens not yet implemented - due 2025-03-20]
- [Database: Missing indexes on posts.created_at and users.email]

## Testing Requirements
- All routes must have at least one happy-path test in tests/routes/
- Use Supertest for integration tests
- Mock database in unit tests

## Deployment
- Staging: Deploys automatically from staging branch (GitHub Actions)
- Production: Manual approval required (see CI/CD docs)
```

**Key principles**:
- **Specific**: Not "follow the code style"; instead "use async/await, not .then()"
- **Authoritative**: This is the source of truth, overriding any conflicting examples
- **Updated**: When the team adopts a new convention, update CLAUDE.md within a day
- **Committed to Git**: Everyone can see it, contributes to it, trusts it

---

### The Research-Plan-Implement Three-Phase Workflow

To keep context clean, structure work in three phases:

1. **Research Phase** (separate session or context block)
   - Ask questions about the codebase
   - Explore architecture, find examples, understand patterns
   - Use subagents (see M05 on Agents) to delegate research and keep main context clean
   - Don't execute anything; only gather information
   - At the end: Clear history with `/clear` or start a new session

2. **Plan Phase** (new session or `/clear`, fresh context)
   - Use Plan Mode (Shift+Tab)
   - Ask Claude to design the implementation
   - Reference CLAUDE.md for conventions
   - Review and refine the plan
   - Once locked in, proceed to implementation

3. **Implementation Phase** (execute the plan)
   - Claude implements following the locked-in spec
   - Fewer surprises, faster iteration
   - Context stays focused on the current task

**Why it works**: Each phase has a clear boundary. You're not mixing research artifacts (partial thoughts, explored dead ends) with implementation. Claude's context is clean.

---

### Managing Context Across Sub-Agents

When you use subagents for the Research Phase (see M05), context boundaries become a multi-agent concern.

**The risk:** A research subagent that explores dead ends, outdated files, or conflicting API versions will accumulate poisoned context. If that context is merged back into the main agent unfiltered, you've imported the problem.

**Rules for clean sub-agent handoff:**
- **Pass minimal context to subagents.** Give them only what they need to complete their specific task—not the full conversation history.
- **Subagent output is a summary, not a transcript.** The subagent should return a concise, structured report (findings, patterns, open questions). It should not return its entire working context.
- **Clear subagent history before handoff.** The subagent runs `/clear` after compiling findings, ensuring only the synthesized output enters the main context.
- **Verify before merging.** Treat subagent output the same as external data: check it for consistency with CLAUDE.md before loading it into your main context.

This pattern prevents one agent's exploration from poisoning another's implementation.

---

### Just-in-Time Runtime Retrieval

A common mistake is pre-loading everything you *might* need into context before starting work. Anthropic's official guidance emphasizes the opposite: load data dynamically via tools *as it is needed*.

**The principle:** Design your workflows so that agents fetch files, documentation, and data at the moment of use—not in bulk at session start.

**Benefits:**
- Context stays minimal and focused throughout the session
- Token budget is used on active work, not speculative loading
- Reasoning quality is higher (see Context Rot above)

**Example:** Instead of loading all 50 test files at session start, configure Claude to query the test runner or file system for the specific tests relevant to the current task. Load one module at a time.

This is the context-management equivalent of lazy loading in software design.

---

### Research Grounding — Facts Before Code

The most expensive failure mode in AI-assisted development isn't bad code — it's code that solves the wrong problem or ignores existing patterns. Grounding means ensuring Claude has accurate, relevant information before it starts writing. Anthropic's official best practices are explicit: separate research and planning from implementation.

#### Claude Code's Research Toolkit

Claude Code does **not** pre-index your codebase or use vector embeddings. Instead, it uses filesystem tools to explore code on-demand — "agentic search":

| Tool | What It Does | Token Cost |
|------|-------------|-----------|
| **Glob** | Pattern-match file paths (e.g., `**/*.ts`) — returns paths only | Very low |
| **Grep** | Search file contents by regex — returns matching lines with context | Low |
| **LS** | List directory contents | Very low |
| **Read** | Load full file content into context | Medium–High |
| **WebSearch** | Search the web — returns page titles and URLs | Low |
| **WebFetch** | Fetch a specific URL and answer a question about its content | Medium |

The key insight: **Glob and Grep are cheap; Read is expensive.** Claude should narrow the search space with Glob/Grep before reading full files.

#### The Explore Agent

Claude Code has a built-in **Explore** subagent type optimized for codebase research. It has access to Glob, Grep, LS, Read, WebFetch, and WebSearch — but **no** Write, Edit, or Bash. This makes it fast, safe, and context-isolated.

Claude uses the Explore agent automatically for open-ended codebase questions, or you can invoke it explicitly:

```
"Use the Explore agent to find all API endpoints and their handlers"

"Have an Explore agent map how the authentication flow works,
from login to session management"
```

The Explore agent runs in its own context window — it might read 50 files internally, but your main session only receives a concise summary.

#### External Research: WebSearch + WebFetch

Claude Code uses two web tools that work as a pair:

- **WebSearch** accepts a search query → returns relevant URLs and titles (lightweight)
- **WebFetch** accepts a URL + a question → returns the answer extracted from that page (heavier)

This two-step design keeps things lean: search first, fetch only what you need:

> *"Search for how Stripe handles webhook signature verification in Node.js, then fetch the official Stripe docs page and summarize the recommended approach."*

#### Encoding Research Rules in CLAUDE.md

For libraries and frameworks your team uses regularly, encode research habits directly in CLAUDE.md:

```markdown
## Research Rules
- Before implementing any Stripe integration, fetch the latest Stripe API docs
- Before writing database migrations, read the existing schema in prisma/schema.prisma
- Before modifying authentication, use a subagent to map the full auth flow first
- Always check for existing utilities in src/lib/utils/ before writing new helpers
```

This ensures Claude researches before coding on every session, not just when you remember to ask.

#### Parallel Research with Subagents

For complex features, spawn multiple research agents in parallel:

> *"Before implementing the notification system, use three subagents in parallel:*
> *1. One to research how our existing event bus works*
> *2. One to find all places in the codebase that currently send emails*
> *3. One to search the web for best practices on notification queuing with Redis and Bull"*

Each agent works in its own context, reads dozens of files or web pages, and reports back a summary. Your main session stays clean for the actual implementation.

#### Research Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Skipping research, jumping to code | Claude builds from assumptions, not facts | Always explore in Plan Mode first |
| Asking Claude to "investigate" without scoping | Claude reads hundreds of files, fills the context | Scope narrowly or delegate to a subagent |
| Not checking for existing utilities | Claude duplicates logic already in the codebase | Add "check for existing patterns first" to CLAUDE.md |
| Trusting Claude's knowledge of external APIs | Claude's training data may be outdated | Always fetch current documentation with WebFetch |
| Doing all research in the main session | Exploration consumes context needed for implementation | Delegate heavy research to subagents |

---

### Context Window and Token Management

#### The 1M Context Window

Opus 4.6 and Sonnet 4.6 support a 1 million token context window (GA as of March 2026, no pricing premium). On Max, Team, and Enterprise plans, Opus is automatically upgraded to 1M. Select the `[1m]` model variant in the `/model` picker. Haiku 4.5 has a 200K token window.

Even with 1M tokens, context management still matters. More tokens doesn't automatically mean better output — focus and relevance still affect quality (see Context Rot above).

**Token accounting** (approximate):
- CLAUDE.md: 500–2,000 tokens (depending on detail)
- A typical file (100 lines): 300–500 tokens
- A conversation with 10 exchanges: 2,000–5,000 tokens
- A large codebase (50K lines): 350,000–500,000 tokens (language-dependent)

**Context monitoring**: `/context` shows a detailed breakdown of where your tokens are going:

```
claude-opus-4-6
76k/200k tokens (38%)
  System prompt:       2.7k tokens (1.3%)
  System tools:       16.8k tokens (8.4%)
  Custom agents:       1.3k tokens (0.7%)
  Memory files:        7.4k tokens (3.7%)
  Skills:              1.0k tokens (0.5%)
  Messages:            9.6k tokens (4.8%)
  Free space:        118.0k (58.9%)
  Autocompact buffer: 33.0k tokens (16.5%)
```

Notice that system prompts, tools, MCP servers, agents, and memory files all consume tokens *before you type anything*. The "Messages" line is your conversation history — watch it grow. The autocompact buffer is reserved for the summarization process itself.

#### Auto-Compaction

When context approaches the limit (~83.5% of the window), Claude automatically compacts by summarizing the conversation. This is lossy — tool outputs get cleared first, then the full conversation gets condensed. You can tune when this triggers:

```bash
# Trigger compaction later (more context, less buffer)
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=90

# Trigger compaction earlier (more aggressive, keeps more working space)
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70
```

Don't wait for auto-compaction. Compact manually at logical breakpoints when the context is clean — the summary will be higher quality.

#### Subagent Context Isolation

When Claude researches a codebase, it reads dozens of files — all of which consume your context. Subagents run in their own separate context window and report back only a summary:

**Without subagents:**
```
Parent context: [user prompt] + [50 file reads] + [actual work]
└── context window nearly exhausted ──┘
```

**With subagents:**
```
Parent context: [user prompt] + [agent result: 200 words] + [actual work]
└── context window mostly available ──┘

Child context: [task prompt] + [50 file reads] + [summary]
└── separate context, discarded after ──┘
```

Best for: code reviews, codebase exploration, documentation research, test verification — any self-contained task requiring lots of file reads.

#### Three Signs Your Context Is Polluted

1. Claude **repeats information** it already gave you
2. Claude **mixes up files or modules** from different parts of the conversation
3. Claude **applies conventions from a previous task** that don't apply to the current one

When you see these signs, it's usually time for `/clear` and a fresh start rather than fighting the degradation.

#### Horizontal Scaling: Multiple Sessions

For complex work, run multiple Claude Code sessions in parallel, each with its own context budget:

```bash
# Terminal 1: refactoring auth
claude "Refactor src/auth/ to use JWT tokens"

# Terminal 2: writing tests
claude "Write unit tests for src/api/users.ts"

# Terminal 3: documentation
claude "Generate JSDoc documentation for src/lib/"
```

Three parallel sessions give you an effective 600k+ tokens of total context without any single session degrading.

---

### Commands for Context Hygiene

| Command | Purpose |
|---------|---------|
| `/context` | Show token usage breakdown |
| `/clear` | Clear all history. Start fresh. (Use between tasks) |
| `/compact` | Manually compact history at any point |
| `/btw [question]` | Quick question that doesn't enter persistent history |
| `/rewind` | Rewind to a previous checkpoint. Use liberally when Claude goes down a wrong path |
| `Esc Esc` | Same as `/clear` (keyboard shortcut) |

**Getting more out of `/compact`:** Compaction is not binary. When you run `/compact` manually (or between workflow phases), guide what gets preserved. Prioritize: architectural decisions, recent code changes, unresolved bugs, and validated patterns. Drop: exploration threads, duplicate explanations, completed tasks, and redundant examples. Pass this explicitly: "Compact history, prioritizing current task spec and CLAUDE.md conventions. Discard resolved exploratory threads."

> **Model Context Awareness (Claude 4.5+):** Newer Claude models can track remaining context and may proactively suggest history compaction. Trust these signals. That said, developer discipline—CLAUDE.md, regular `/context` checks, the three-phase workflow—remains essential for consistent outcomes. Model suggestions are a safety net, not a substitute for hygiene.

---

## Pre-work: Readings

### Essential Readings

1. **"How Long Contexts Fail" by Drew Breunig**
   - The research behind the four failure modes. Essential.
   - Link: https://www.drewbreunig.com/essays/long-contexts (or search)

2. **"Context Windows and Coding" (OpenAI)**
   - Best practices for using large context windows effectively.
   - Link: https://openai.com/research/context-length-in-language-models

3. **"Getting AI to Work in Complex Codebases" by HumanLayer**
   - Practical tips on context engineering for real projects.
   - Link: https://humanlayer.ai/ (search "context engineering")

4. **Claude Code Documentation: CLAUDE.md and Context Management**
   - Official guide to CLAUDE.md format and context commands
   - Link: https://claude.com/claude-code


## Workshop

The hands-on session for this module: [**M04: Context Engineering — Workshop Guide**](/workshops/m04-workshop/)

## Takeaway

By the end of this module, you will have:

1. **A Project CLAUDE.md** (committed to Git)
   - Encodes key conventions, avoiding ambiguity
   - Reusable across sessions
   - Updatable as the project evolves
   - Becomes the go-to reference for both humans and Claude

2. **Mastery of Context Commands**
   - `/context`: Token accounting
   - `/clear`: Clean slate between phases
   - `/compact`: Reclaim tokens while preserving knowledge
   - `/btw`: Quick questions that don't pollute history

3. **Three-Phase Workflow Habit**
   - Research (in isolation) → Plan (locked spec) → Implement (execute plan)
   - Each phase has clear boundaries
   - Context stays focused
   - Rework is minimized

4. **Context Hygiene Checklist** (daily habit)
   - Before starting a task: `/context` to see what's loaded
   - Between tasks: `/clear` to reset
   - After planning: Verify the plan is solid before executing
   - During implementation: Use `/btw` for quick questions, not full history entries
   - Regularly: Review and update CLAUDE.md (at least weekly)

5. **Understanding of the Four Failure Modes** and how to prevent each one
   - Poisoning → CLAUDE.md as single source of truth
   - Distraction → Curated, minimal context
   - Confusion → Lazy loading, focused tools
   - Clash → Consistency in instructions

---

## Key Concepts

- **Context Poisoning**: Errors and inconsistencies in context compound and lead to incorrect implementation
- **Context Distraction**: Larger contexts cause Claude to copy patterns rather than reason
- **Context Confusion**: Too many files and tools overwhelm reasoning
- **Context Clash**: Contradictory instructions given sequentially
- **Context Rot**: Performance degrades with context length independent of content quality; begins around 30K–50K tokens
- **Adversarial Poisoning**: Intentional injection of malicious instructions via external data sources
- **CLAUDE.md**: A project-level file encoding conventions, patterns, and constraints for Claude
- **Token Accounting**: Understanding what's in your context window and how much space you have left
- **Auto-Compaction**: Automatic summarization of history when context approaches the limit (typically 75–92%)
- **Research-Plan-Implement**: Three-phase workflow that keeps context clean
- **Just-in-Time Retrieval**: Loading data via tools at the moment of need, rather than pre-loading speculatively
- **Sub-Agent Context Isolation**: Preventing poisoned subagent context from contaminating the main agent

---

## References

- Breunig, D. "How Long Contexts Fail."
  - https://www.drewbreunig.com/essays/long-contexts (or search for Drew Breunig)

- Liu, N. F. et al. "Lost in the Middle: How Language Models Use Long Contexts." ArXiv 2307.03172.
  - https://arxiv.org/abs/2307.03172 (primacy/recency bias; U-shaped performance curve)

- Anthropic. "Working with the 1M Token Context Window."
  - https://docs.anthropic.com/context (official documentation)

- HumanLayer. "Getting AI to Work in Complex Codebases."
  - https://humanlayer.ai/ (practical guide)

---

## Next Steps

You've learned to manage context within a session. Module M05 extends this: how do you integrate external tools (databases, APIs, version control) via MCP (Model Context Protocol), and how do you manage context when multiple AI agents are working together?
