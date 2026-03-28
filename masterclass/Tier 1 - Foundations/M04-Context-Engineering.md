# M04: Context Engineering — The Only Lever That Matters

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

#### 2. Context Distraction

Larger contexts induce "copying behavior"—Claude defaults to mimicking examples and boilerplate rather than reasoning. If your context includes 50 files, Claude might:
- Copy the style of the first example, even if it's outdated
- Follow patterns from old code that were working around a bug you've since fixed
- Implement something that "looks like the codebase" without understanding why

**Antidote**: Curated context. Include the *most recent, highest-quality* examples. Avoid including multiple versions or contradictory patterns.

#### 3. Context Confusion

Too many tools, files, and instructions overwhelm Claude's reasoning. With 50 files in the context, Claude struggles to pick the right one to modify. With 10 MCP tools available, Claude might choose the wrong one.

**Antidote**: Lazy loading and curation. Load only the files relevant to the current task. Use a curated, small set of tools in each Agent configuration.

#### 4. Context Clash

Contradictory instructions given sequentially create confusion. If your CLAUDE.md says "always use error code 400 for validation failures" but your last prompt says "use 422 for validation failures," Claude has conflicting guidance.

**Antidote**: Consistency. Keep CLAUDE.md updated. When rules change, update the source of truth.

---

### CLAUDE.md: The Single Source of Truth

CLAUDE.md is a file at the project root that encodes the project's conventions, patterns, and constraints. It's not README—it's not user-facing. It's a briefing for Claude.

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

### Context Window and Token Management

Claude Sonnet/Opus: 1M tokens (~400K words, ~250K lines of code)
Claude Haiku: 128K tokens

**Token accounting** (approximate):
- CLAUDE.md: 500–2,000 tokens (depending on detail)
- A typical file (100 lines): 300–500 tokens
- A conversation with 10 exchanges: 2,000–5,000 tokens
- A large codebase (50K lines): 200,000 tokens

**Context monitoring**: `/context` shows a breakdown:
```
Context Usage:
- CLAUDE.md: 1,200 tokens
- Conversation history: 3,500 tokens
- Loaded files: 45,000 tokens
- Total: 49,700 / 1,000,000 tokens
```

**Auto-compaction**: When you hit 85% of the context window, Claude automatically compacts history. You can tune this with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=75` (compact at 75% instead).

---

### Commands for Context Hygiene

| Command | Purpose |
|---------|---------|
| `/context` | Show token usage breakdown |
| `/clear` | Clear all history. Start fresh. (Use between tasks) |
| `/compact` | Manually compact history at any point |
| `/btw [question]` | Quick question that doesn't enter persistent history |
| `Esc Esc` | Same as `/clear` (keyboard shortcut) |

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

---

## Workshop: Facilitated Hands-on (45–60 min)

### Segment 1: Context Poisoning Demo (10 min)

**Objective**: Show how conflicting context degrades performance.

**Setup**:

Use a real (or realistic) scenario: The codebase has two different error handling patterns (old and new), and CLAUDE.md mentions neither.

**Activity**:

1. **High-Context, Low-Signal** (3 min)
   - Load the project without a CLAUDE.md
   - Ask Claude: "What's the error handling pattern?"
   - Claude sees both patterns, is uncertain: "It looks like you use both { error: "..." } and throw new Error()..."
   - Ask Claude to implement an error handler: It might mix patterns
   - Outcome: Confusion

2. **Curated Context** (3 min)
   - Create a minimal CLAUDE.md: "Error handling: Always return { success: false, error: "message", code: "CODE" }. Never throw."
   - Ask Claude the same questions
   - Claude is confident and consistent
   - Ask Claude to implement: It follows the spec
   - Outcome: Reliability

3. **Lesson** (4 min)
   - "Smaller, curated context > larger, noisy context"
   - "CLAUDE.md is the antidote to confusion"

---

### Segment 2: CLAUDE.md Deep Dive (15 min)

**Objective**: Create and refine a CLAUDE.md for a real project.

**Facilitation**:

1. **Audit Current Conventions** (5 min)
   - Group discusses: "What are the actual conventions in this codebase?"
   - Facilitator captures:
     - Error handling pattern
     - Async/await vs. callbacks vs. promises
     - Where validation happens
     - Naming conventions (camelCase, snake_case)
     - Where to put new code
     - Security rules (SQL parameterization, auth checks)
     - Testing requirements

2. **Draft CLAUDE.md** (5 min)
   - Facilitator structures the conventions into CLAUDE.md format:
     - Overview + tech stack
     - Key files and purpose
     - Conventions (5–10 key ones)
     - Recent changes
     - Common mistakes
     - Testing requirements
     - Deployment info
   - Group reviews: "Are these accurate? Are they complete?"

3. **Commit to Repo** (5 min)
   - Save CLAUDE.md to the project root
   - Commit to Git: `git add CLAUDE.md && git commit -m "Add CLAUDE.md with project conventions"`
   - Outcome: A living document that Claude and humans both reference

---

### Segment 3: Context Monitoring Exercise (10 min)

**Objective**: Hands-on with context commands.

**Facilitation**:

1. **Load a Real Codebase** (2 min)
   - Open Claude Code in the project
   - `/init` to create/update CLAUDE.md

2. **Check Context** (2 min)
   - Run `/context`
   - Review the breakdown:
     - How many tokens in CLAUDE.md?
     - How many in history?
     - How many in loaded files?

3. **Simulate a Long Conversation** (3 min)
   - Have Claude answer 5–10 questions about the codebase (without loading large files)
   - Run `/context` again
   - Discuss: How did history grow? How did quality of responses change?

4. **Compact and Compare** (3 min)
   - Run `/compact`
   - Run `/context` again
   - Ask Claude the same questions again: Does it still understand?
   - Lesson: Compaction preserves knowledge while freeing tokens

---

### Segment 4: Three-Phase Workflow Demo (10 min)

**Objective**: Show how to structure work for clean context.

**Facilitation**:

1. **Research Phase** (3 min)
   - Start a new conversation (or `/clear`)
   - Ask: "Walk me through the authentication flow. Show me the relevant files."
   - Claude explores, responds
   - Don't execute anything
   - At the end: `/clear` to reset context

2. **Plan Phase** (3 min)
   - Start fresh (new session or `/clear`)
   - Load CLAUDE.md
   - Ask: "Plan a new feature: Add rate limiting to the login endpoint. Include approach, changes, error handling."
   - Claude generates plan in Plan Mode
   - Review and refine

3. **Implementation Phase** (4 min)
   - Execute the plan
   - Context is clean, plan is locked in
   - Implementation is straightforward
   - Lesson: By separating phases, you avoid context pollution and rework

---

## Hands-on Exercise: End-to-End Context Engineering

**Objective**: Build context discipline on a real task.

**Setup** (5 min):

Pick a real feature or task. Target: Moderately complex (2–4 hours of work). Example: "Add email verification to the signup flow."

**Steps** (50 min):

1. **Phase 1: Research** (15 min)
   - New session or `/clear`
   - Ask Claude: "Walk me through our current signup flow. Show me the relevant files. What's the authentication model?"
   - Claude explores the codebase
   - Take notes on key findings
   - At the end: Run `/clear` (discard research artifacts)

2. **Phase 2: Plan** (20 min)
   - New session or `/clear` (context is empty)
   - Load CLAUDE.md: Ask Claude to refresh from the file
   - Ask Claude: "Plan the addition of email verification. Include: architecture, database changes, new endpoints, error handling, security considerations, and validation rules."
   - Claude generates a plan in Plan Mode
   - Group reviews and refines: "How does this fit with existing auth? Are we validating the email correctly? What about edge cases (user changes email, verification link expires)?"
   - Continue until the plan is solid

3. **Phase 3: Implementation** (10 min)
   - Execute the plan
   - Claude implements
   - Context is focused, plan is locked in
   - Implementation is fast and accurate

4. **Phase 4: Verification** (5 min)
   - Ask Claude: "Did we implement all the requirements from the plan? Are there edge cases we missed?"
   - Claude reviews its own work against the plan
   - Outcome: Features that match the spec because the spec was precise and context was clean

---

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
- **CLAUDE.md**: A project-level file encoding conventions, patterns, and constraints for Claude
- **Token Accounting**: Understanding what's in your context window and how much space you have left
- **Auto-Compaction**: Automatic summarization of history when context approaches the limit
- **Research-Plan-Implement**: Three-phase workflow that keeps context clean

---

## References

- Breunig, D. "How Long Contexts Fail."
  - https://www.drewbreunig.com/essays/long-contexts (or search for Drew Breunig)

- OpenAI. "Improving Language Models by Segmenting, Attending, and Predicting with Structured State."
  - https://arxiv.org/abs/1805.06358 (on context and memory)

- Anthropic. "Working with the 1M Token Context Window."
  - https://docs.anthropic.com/context (official documentation)

- HumanLayer. "Getting AI to Work in Complex Codebases."
  - https://humanlayer.ai/ (practical guide)

---

## Next Steps

You've learned to manage context within a session. Module M05 extends this: how do you integrate external tools (databases, APIs, version control) via MCP (Model Context Protocol), and how do you manage context when multiple AI agents are working together?
