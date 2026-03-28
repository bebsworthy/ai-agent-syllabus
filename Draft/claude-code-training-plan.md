# Claude Code Training Plan — Dev/Tech Team

## Overview

This training plan introduces the development team to Claude Code, Anthropic's terminal-native AI coding assistant. It's structured as a half-day workshop (roughly 4–5 hours) with a mix of presentation, live demos, and hands-on exercises. Each module builds on the previous one, taking devs from first launch to advanced workflows.

---

## Module 1: What Is Claude Code & Why It Matters (20 min)

**Goal:** Build a shared mental model of what Claude Code is and how it differs from other AI coding tools.

### Key Points to Cover

- Claude Code is a terminal-native agentic assistant — it reads your entire codebase, edits files directly, and runs commands on your machine. It's not a chatbot you copy-paste to; it operates on your actual project.
- It understands project structure, traces dependencies across files, and can plan multi-step implementations before touching any code.
- Every file change and command execution requires your explicit approval (unless you opt into auto-accept mode).
- Available in the terminal CLI, VS Code/Cursor extension, desktop app, and browser.
- As of early 2026, Claude Code contributes to roughly 4% of all public GitHub commits (~135k/day), and 90% of Anthropic's own code is written with AI assistance.

### Key Differentiators vs Other Tools

| Aspect | Claude Code | Cursor/Copilot |
|---|---|---|
| Primary interface | Terminal / CLI | IDE-integrated |
| Context window | Up to 1M tokens (full codebase) | Varies, typically smaller |
| Autonomy | High — plans + executes multi-step tasks | Lower — mostly suggestions/completions |
| Best at | Long-running autonomous tasks, complex refactoring | Day-to-day inline editing, small completions |

### Suggested Material

- Official overview: [code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview)
- Builder.io beginner guide: [builder.io/blog/how-to-use-claude-code](https://www.builder.io/blog/how-to-use-claude-code)

---

## Module 2: Installation & First Session (30 min)

**Goal:** Everyone installs Claude Code and completes their first interaction.

### Setup Steps

1. **Prerequisites:** macOS 13+, Windows 10+ (1809), or Ubuntu 20.04+. Minimum 4GB RAM, stable internet, and Git installed.
2. **Install via native installer** (recommended over npm):
   - macOS/Linux: run the installer from `claude.ai/install.sh`
   - Windows: use the native installer or `winget install Anthropic.ClaudeCode`
   - Alternative: `npm install -g @anthropic-ai/claude-code` (legacy but still works)
3. **First launch:** `cd your-project && claude`
   - Browser opens for one-time authentication via claude.ai
   - Credentials stored locally in `~/.claude/`
4. **First prompt:** Start with an exploratory prompt like *"What does this project do?"* to let Claude analyze the codebase.

### Hands-On Exercise

Have each developer open a real project (or a shared sample repo) and:
- Run `claude` in the project root
- Ask Claude to explain the project structure
- Ask Claude to find a specific function and explain what it does
- Make a small edit (e.g., add a comment, rename a variable) and approve the change

### Key Shortcuts to Introduce Early

| Shortcut | Action |
|---|---|
| `Esc` | Stop Claude mid-action (keeps context) |
| `Esc + Esc` | Rewind to a previous checkpoint |
| `!command` | Run a shell command directly (e.g., `!git status`) |
| `Shift+Tab` | Cycle between Normal / Plan / Auto-Accept modes |
| `Ctrl+B` | Send a running agent to the background |

---

## Module 3: Model Selection & Cost Management (20 min)

**Goal:** Understand which model to use when, and how to avoid burning through credits unnecessarily.

### The Three Models

| Model | Best For | Cost Profile |
|---|---|---|
| **Sonnet 4.6** | 90% of daily work — feature building, tests, refactoring, docs | Fast, cost-effective (~$3/$15 per 1M tokens) |
| **Opus 4.6** | Complex architecture, multi-file debugging, deep reasoning, agent teams | 5x Sonnet cost, but justified for hard problems |
| **Haiku 4.5** | Quick questions, simple edits, formatting, sub-agent tasks | Cheapest and fastest |

### Practical Rule of Thumb

> **Use Sonnet for 80% of your work. Reserve Opus for the 20% that genuinely requires deeper reasoning.** Haiku handles the simple stuff.

### How to Switch

- During a session: `/model sonnet` or `/model opus`
- At startup: `claude --model opus`
- Permanent default: add `"model": "sonnet"` to `~/.claude/settings.json`
- **OpusPlan mode** (`claude --model opusplan`): uses Opus for planning, then automatically switches to Sonnet for execution — best of both worlds.

### Effort Levels

Use `/effort low`, `/effort medium`, `/effort high`, or `/effort max` (Opus only) to control how much thinking budget Claude gets. Lower effort = faster and cheaper for straightforward tasks.

---

## Module 4: The CLAUDE.md File — Your Most Important Tool (30 min)

**Goal:** Every developer creates a CLAUDE.md for their project.

### What It Is

CLAUDE.md is a special file that Claude reads automatically at the start of every session. It's your way of giving Claude persistent context about your project's conventions, tech stack, architecture, and preferences. Think of it as onboarding documentation for your AI pair programmer.

### How to Create It

Run `/init` in your project and Claude will analyze your codebase and generate a starter CLAUDE.md. Then refine it manually.

### What to Include

- **Tech stack and frameworks** (e.g., "This is a Next.js 14 app with TypeScript, Prisma, and PostgreSQL")
- **Coding conventions** (naming, file structure, import ordering)
- **Testing requirements** (e.g., "Always write tests using Vitest. Run `npm test` before committing")
- **Architecture decisions** (e.g., "We use the repository pattern for data access")
- **Things NOT to do** (e.g., "Never modify the database migration files directly")
- **Build/run commands** (e.g., `npm run dev`, `npm run lint`)

### CLAUDE.md Hierarchy

| Location | Scope |
|---|---|
| `~/.claude/CLAUDE.md` | Global — applies to all your projects |
| `project-root/CLAUDE.md` | Project-wide — shared with the team via git |
| `project-root/.claude/CLAUDE.md` | Project-specific, not committed |
| Any subdirectory `CLAUDE.md` | Active when Claude is working in that directory |

### Hands-On Exercise

Each developer runs `/init` on their project, reviews the generated CLAUDE.md, and adds at least 3 project-specific conventions or rules.

---

## Module 5: Plan Mode — Think Before You Code (30 min)

**Goal:** Establish the "plan first" workflow as standard practice.

### Why It Matters

The most common failure mode with AI coding is not bad code — it's solving the wrong problem, or solving the right problem in a brittle way. Plan Mode forces Claude to analyze, outline, and reason before writing a single line.

### The Four-Step Process

1. **Ask for a plan:** Describe the task and tell Claude to plan. Use phrases like *"think hard"* or *"think harder"* to give Claude more thinking budget.
2. **Tell it to pause:** Explicitly say *"Do not write any code yet. Just give me the plan."*
3. **Review and refine:** Challenge assumptions, correct direction, tweak the plan.
4. **Give the green light:** Once satisfied, tell Claude to execute.

### When to Use Plan Mode

- Multi-file features or refactoring
- Unfamiliar codebases
- Architectural changes
- Any task where you'd want a PR description *before* seeing the code

### When to Skip It

- Single-file, well-scoped changes you can describe in one sentence
- Quick fixes, typo corrections, small edits

### Activating Plan Mode

- Toggle with `Shift+Tab` to cycle through Normal → Plan → Auto-Accept
- Or type `/plan` followed by your request

### Hands-On Exercise

Give the team a moderately complex task (e.g., "Add JWT authentication to our Express API") and have them:
1. Enter Plan Mode
2. Get Claude's plan
3. Critique and refine the plan
4. Only then let Claude implement

---

## Module 6: Context Management — Your Most Precious Resource (30 min)

**Goal:** Understand how the context window works, why it degrades, and how to manage it proactively.

### Why This Matters

The context window is the total amount of information Claude can "see" at once — your conversation history, every file it reads, every command output, and the system prompt. As it fills up, performance degrades: Claude starts forgetting earlier instructions, making more mistakes, and losing focus. This is sometimes called "context rot." Managing context is arguably the single most important skill for getting consistently good results.

### How the Context Window Works

Run `/context` at any time to see exactly where your tokens are going:

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

Key things to notice: system prompts, tools, MCP servers, and memory files all consume tokens *before you type anything*. The "Messages" line is your conversation history — watch it grow. The autocompact buffer (~33k tokens) is reserved for the summarization process itself.

### The 1M Context Window

Opus 4.6 and Sonnet 4.6 now support a 1 million token context window (GA as of March 2026, no pricing premium). On Max, Team, and Enterprise plans, Opus is automatically upgraded to 1M. This dramatically reduces the need for micro-managing context — sessions can run for hours on complex tasks without hitting compaction. Select the `[1m]` model variant in the `/model` picker.

Even with 1M tokens, context management still matters. More tokens doesn't automatically mean better output — focus and relevance still affect quality.

### Context Management Commands

| Command | What It Does | When to Use |
|---|---|---|
| `/context` | Shows token breakdown by category | Start of every session; periodically during long sessions |
| `/clear` | Wipes conversation history completely | Between unrelated tasks — the old context is pure noise for the new task |
| `/compact` | Summarizes conversation to free space | At natural stopping points (feature complete, bug fixed) |
| `/compact <instructions>` | Summarizes with specific focus | e.g., `/compact Focus on the API changes and ignore the CSS discussion` |
| `/btw <question>` | Asks a quick question in a dismissible overlay — never enters conversation history | Quick syntax lookups, "how do I..." questions mid-task |
| `Esc + Esc` → "Summarize from here" | Surgical compaction from a specific checkpoint | After a long debugging session where only the solution matters |

### Three Signs Your Context Is Polluted

1. Claude **repeats information** it already gave you
2. Claude **mixes up files or modules** from different parts of the conversation
3. Claude **applies conventions from a previous task** that don't apply to the current one

When you see these, it's usually time for `/clear` and a fresh start rather than fighting the degradation.

### Auto-Compaction

When context approaches the limit (~83.5% of the window), Claude automatically compacts by summarizing the conversation. This is lossy — tool outputs get cleared first, then the full conversation gets condensed. You can tune when this triggers:

```bash
# Trigger compaction later (more context, less buffer)
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=90

# Trigger compaction earlier (more aggressive, keeps more working space)
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70
```

**Pro tip:** Don't wait for auto-compaction. Compact manually at logical breakpoints when the context is clean — the summary will be higher quality. You can also add instructions to your CLAUDE.md like *"When compacting, always preserve the full list of modified files and any test commands."*

### Subagents: The Context Isolation Superpower

When Claude researches a codebase, it reads dozens of files — all of which consume your context. Subagents run in their own separate context window and report back only a summary.

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

Invoke explicitly by asking:
> *"Use a subagent to investigate how our authentication system handles token refresh, and whether we have any existing OAuth utilities I should reuse."*

Best for: code reviews, codebase exploration, documentation research, test verification — any self-contained task that requires reading lots of files.

### Horizontal Scaling: Multiple Sessions

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

### Context Hygiene Checklist

- Run `/context` at the start of each session to see your baseline
- `/clear` between unrelated tasks — always
- `/compact` at natural stopping points (feature done, bug fixed)
- Delegate research and exploration to subagents
- Keep CLAUDE.md under ~200 lines / 2,000 tokens — it loads on every request
- Audit MCP servers periodically — each one consumes tokens just by existing
- Prefer skills over MCP servers when possible for better context efficiency
- Use `/btw` for quick questions that don't need to persist

### Hands-On Exercise

Have each developer:
1. Run `/context` on their current session and note the breakdown
2. Start a task (e.g., *"Explain the testing strategy in this project"*)
3. Run `/context` again — notice how much the Messages grew
4. Use `/compact Focus on the test patterns and commands` to reclaim space
5. Ask Claude to delegate a research task to a subagent and observe the token difference

---

## Module 7: Effective Prompting (20 min)

**Goal:** Learn how prompt quality directly impacts output quality.

### Prompting Principles

**Be specific about the outcome, not the steps.** Let Claude figure out *how* — you focus on *what* and *why*.

| Instead of this... | Try this... |
|---|---|
| "Make the code better" | "Refactor this component to improve maintainability: extract logic into custom hooks, add TypeScript types, write unit tests" |
| "Fix the bug" | "Users report the login form doesn't submit on mobile. I suspect a form validation issue. The form is in `src/components/Login.jsx`. Investigate and fix." |
| "First check the file, then look at line 42, then change the condition..." | "Users are experiencing slow load times on the dashboard. Investigate performance issues and propose optimizations." |

### Power Prompting Patterns

- **Give Claude a feedback loop:** Include test commands or expected outputs so Claude can self-verify. E.g., *"After making changes, run `npm test` and fix any failures."*
- **Use "think hard/harder/ultrathink":** These keywords allocate more reasoning budget for complex problems.
- **Provide context:** Paste error messages, link relevant files, describe the user-facing symptom.
- **Checkpoint with git:** Always work on a branch. Claude integrates with git and can create commits, but having a safety net matters.

---

## Module 8: Common Workflows (30 min)

**Goal:** Walk through the workflows devs will use every day.

### Exploring an Unfamiliar Codebase

> *"Explain the architecture of this project. What are the main modules, how do they connect, and where does data flow?"*

### Debugging

> *"I'm getting this error: [paste error]. Trace through the codebase, find the root cause, and fix it."*

### Writing Tests

> *"Write comprehensive tests for `src/services/auth.ts`. Cover happy paths, edge cases, and error handling. Use our existing test patterns."*

### Refactoring

> *"Refactor `src/utils/` to eliminate code duplication. Flag functions with >70% similarity and propose shared utilities."*

### Creating Pull Requests

Claude can stage changes, write commit messages, create branches, and open PRs:
> *"Commit these changes with a descriptive message, push to a new branch called `feature/jwt-auth`, and create a PR."*

### Code Review

> *"Review the changes in this branch for security vulnerabilities, performance issues, and adherence to our coding standards."*

### Session Management

- `/resume` — pick up a previous session
- `/rename` — give sessions descriptive names (e.g., "payment-integration")
- `claude --continue` — resume the most recent conversation in the current directory

---

## Module 9: Advanced Features (30 min)

**Goal:** Introduce the power features that take Claude Code from useful to transformative.

### Custom Skills (Slash Commands)

Skills are reusable prompt templates stored as Markdown files. Instead of pasting the same 200-word prompt every time, write a SKILL.md once and call `/review-component` forever.

- **Project skills:** `.claude/skills/<name>/SKILL.md`
- **Personal skills:** `~/.claude/skills/<name>/SKILL.md`
- Skills can auto-activate when their description matches the current task

Example: create a `/new-component` skill that scaffolds a React component, stylesheet, and test file following your project conventions.

### Subagents

Spin off parallel or isolated work to specialized agents. Useful for:
- Parallel research (web docs + codebase scan simultaneously)
- Preventing context pollution on long tasks
- Deep dives that shouldn't clutter the main conversation

### Hooks

Deterministic scripts that fire at specific lifecycle events — like Git hooks, but for Claude Code. Examples:
- Auto-lint every file Claude writes (`PostToolUse` on `Write`)
- Block dangerous commands before execution (`PreToolUse`)
- Send a Slack notification when Claude finishes a long task (`Notification`)

Configure via `/hooks` or directly in `settings.json`.

### MCP (Model Context Protocol)

Connect Claude to external tools and data sources:
- `@anthropic-ai/mcp-server-github` — interact with GitHub issues and PRs
- `@anthropic-ai/mcp-server-filesystem` — extended file operations
- Playwright for browser testing, Sentry for error logs, PostgreSQL for direct queries

### Plugins

Bundled packages of skills, agents, hooks, and MCP configs that install with one command. Great for team standardization:
```
/plugin install dev-workflows@claude-code-workflows
```

### Agent Teams (Opus 4.6)

Launch multiple autonomous agents working in parallel on different parts of a task. The lead agent orchestrates, and teammates work in isolated worktrees. Best for large-scale refactoring or multi-component features.

---

## Module 10: Team Best Practices & Safety (20 min)

**Goal:** Establish team conventions for working with Claude Code responsibly.

### Golden Rules

1. **Always work on a branch.** Git is your safety net. Claude can create commits, but you should always be able to roll back.
2. **Review diffs before approving.** Don't blindly accept. Read what Claude is changing and why.
3. **Use `/rewind` liberally.** If Claude goes down a wrong path, rewind to a checkpoint. It's cheap and fast.
4. **CLAUDE.md is a team asset.** Commit it to the repo. Iterate on it like you would any documentation.
5. **Plan before executing** for anything non-trivial. The few extra minutes upfront prevent hours of debugging.
6. **Don't share sensitive data.** Be mindful of API keys, secrets, and proprietary information in prompts.
7. **Cost awareness.** Default to Sonnet. Switch to Opus deliberately, not by default.

### Permission Modes

- **Normal (default):** Claude asks approval for every file change and command
- **Auto-Accept:** Claude executes without asking (use with caution, on branches only)
- **Plan Mode:** Claude plans but doesn't execute until you approve

### What Claude Code Should NOT Be Used For

- Running untrusted code or commands you don't understand
- Making production database changes directly
- Replacing code review — Claude is an assistant, not a replacement for human judgment
- Handling secrets or credentials (keep `.env` files in `.gitignore`)

---

## Recommended Resources

### Official Documentation
- **Claude Code Docs:** [code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview)
- **Common Workflows:** [code.claude.com/docs/en/common-workflows](https://code.claude.com/docs/en/common-workflows)
- **Model Configuration:** [code.claude.com/docs/en/model-config](https://code.claude.com/docs/en/model-config)

### Community Guides & Repos
- **Builder.io — 50 Claude Code Tips:** [builder.io/blog/claude-code-tips-best-practices](https://www.builder.io/blog/claude-code-tips-best-practices)
- **awesome-claude-code (curated skills, hooks, plugins):** [github.com/hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- **Claude Code Ultimate Guide (with quizzes):** [github.com/FlorianBruniaux/claude-code-ultimate-guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide)
- **claude-code-best-practice repo:** [github.com/shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)
- **CC for Everyone (free interactive course):** [ccforeveryone.com](https://ccforeveryone.com/)
- **Anthropic Plugins announcement:** [anthropic.com/news/claude-code-plugins](https://www.anthropic.com/news/claude-code-plugins)

### Tutorials
- **NxCode Beginner Tutorial:** [nxcode.io/resources/news/claude-code-tutorial-beginners-guide-2026](https://www.nxcode.io/resources/news/claude-code-tutorial-beginners-guide-2026)
- **Full-stack overview of all features:** [alexop.dev/posts/understanding-claude-code-full-stack](https://alexop.dev/posts/understanding-claude-code-full-stack/)
- **Extensions deep-dive (Skills, MCP, Hooks, Subagents, Plugins):** [muneebsa.medium.com](https://muneebsa.medium.com/claude-code-extensions-explained-skills-mcp-hooks-subagents-agent-teams-plugins-9294907e84ff)

---

## Phase 1 Schedule — Foundations (Half-day)

| Time | Module | Format |
|---|---|---|
| 0:00–0:20 | Module 1: What Is Claude Code | Presentation |
| 0:20–0:50 | Module 2: Installation & First Session | Live demo + hands-on |
| 0:50–1:10 | Module 3: Model Selection & Cost | Presentation + Q&A |
| 1:10–1:40 | Module 4: CLAUDE.md | Presentation + hands-on |
| 1:40–1:50 | *Break* | |
| 1:50–2:20 | Module 5: Plan Mode | Live demo + hands-on |
| 2:20–2:50 | Module 6: Context Management | Presentation + hands-on |
| 2:50–3:00 | *Break* | |
| 3:00–3:20 | Module 7: Effective Prompting | Presentation + examples |
| 3:20–3:50 | Module 8: Common Workflows | Live demo |
| 3:50–4:20 | Module 9: Advanced Features (overview) | Presentation + demo |
| 4:20–4:40 | Module 10: Team Best Practices | Discussion + Q&A |

---

# Phase 2: Advanced Claude Code — Skills, Agents & Workflow Orchestration

## Overview

Phase 2 is designed for developers who have completed Phase 1 and have spent at least 1–2 weeks using Claude Code in their daily workflow. It dives deep into building custom skills, designing multi-agent architectures, connecting external tools via MCP, and orchestrating complex end-to-end workflows. This is a full-day workshop (roughly 5–6 hours) with heavy emphasis on hands-on building.

**Prerequisites:** Completion of Phase 1. Each participant should have Claude Code installed, a working CLAUDE.md in their project, and experience with Plan Mode and basic prompting.

---

## Module 11: Building Custom Skills (60 min)

**Goal:** Every developer builds and deploys at least one custom skill for their project.

### What Skills Really Are

Skills are reusable instruction packages stored as Markdown files. They follow a progressive disclosure model — Claude sees only the name and description until a skill is needed, then loads the full instructions on demand. This keeps context lean.

The three stages of skill loading:
1. **Metadata** (name + description): Always in context (~100 tokens). Claude decides whether to load the skill based on this alone.
2. **SKILL.md body**: Loaded only when the skill is triggered.
3. **Supporting files** (templates, examples, scripts): Loaded only when referenced in the SKILL.md.

### Skill Anatomy

Every skill lives in a directory with at least a `SKILL.md` file:

```
.claude/skills/
└── code-review/
    ├── SKILL.md           # Main instructions (required)
    ├── checklist.md        # Reference checklist
    ├── examples/
    │   └── sample-review.md
    └── scripts/
        └── lint-check.sh   # Script Claude can execute
```

The SKILL.md has two parts — YAML frontmatter and markdown instructions:

```markdown
---
name: code-review
description: >
  Review code for security, performance, and style issues.
  Use when user asks for a "review", "audit", or "check my code".
---

When reviewing code, always:
1. **Security first**: Check for SQL injection, XSS, auth bypass, data exposure
2. **Performance**: Identify N+1 queries, unnecessary re-renders, missing indexes
3. **Style**: Verify adherence to project conventions in CLAUDE.md
4. **Tests**: Flag any changed logic that lacks test coverage

Output format:
- Severity (Critical / Warning / Info)
- File and line reference
- Issue description
- Suggested fix
```

### Three Skill Patterns

| Pattern | When to Use | Example |
|---|---|---|
| **A — Pure Markdown** | Claude's language ability is enough | Brand guidelines, commit message format, code review checklist |
| **B — Markdown + Scripts** | Need deterministic processing (validation, file conversion, calculations) | Invoice generator, data pipeline, test scaffolding |
| **C — Markdown + MCP/Subagents** | Workflows spanning external services | Create issue → create branch → fix code → open PR |

Start with Pattern A. Add scripts later if needed. Simplifying an over-complex skill is harder than evolving a simple one.

### Skill Locations & Scope

| Location | Scope | Shared? |
|---|---|---|
| `.claude/skills/<name>/` | Project — available to anyone who clones the repo | Yes, via git |
| `~/.claude/skills/<name>/` | Personal — available across all your projects | No |
| Via `--add-dir` | External directories loaded at startup | Depends on setup |

### Key Frontmatter Options

| Field | Purpose |
|---|---|
| `name` | Becomes the `/slash-command` (max 64 chars) |
| `description` | Tells Claude when to auto-invoke the skill (max 200 chars) — **write this like a natural-language request** |
| `disable-model-invocation: true` | Prevents automatic invocation; user must type `/name` explicitly |
| `user-invocable: false` | Hides from the `/` menu; background knowledge only |
| `allowed-tools` | Restricts which tools the skill can use without permission prompts |
| `argument-hint` | Autocomplete hint, e.g., `[component-name]` |

### Writing Good Descriptions

The description is the most important line in your skill. Claude uses it to decide whether to load the skill, so it must sound like how you would naturally ask for the task.

```
# Bad — too abstract
description: Audit software artefacts for quality compliance

# Good — matches natural requests
description: >
  Review code for bugs, security issues, and style violations.
  Use when user asks to "review", "check", or "audit" code.
```

### Hands-On Exercise: Build Three Skills

Have each developer build:

1. **A team-standard skill** (Pattern A): e.g., `/new-component` that scaffolds a React component, test file, and Storybook entry following the team's conventions.
2. **A scripted skill** (Pattern B): e.g., `/validate-api` that runs a validation script against an OpenAPI spec and reports results.
3. **An auto-invoking skill**: Write a skill with a good enough description that Claude uses it without being asked (test by giving Claude a matching task without using the slash command).

Test each by asking: *"What skills are available?"* and invoking directly with `/skill-name`.

---

## Module 12: Grounding with Research — External & Codebase (45 min)

**Goal:** Master the "research before coding" discipline — both exploring your own codebase and pulling in external knowledge — so Claude works from facts, not guesses.

### Why Grounding Matters

The most expensive failure mode in AI-assisted development isn't bad code — it's code that solves the wrong problem or ignores existing patterns. Grounding means ensuring Claude has accurate, relevant information before it starts writing. This comes from two sources: your own codebase (internal) and the web/documentation (external).

Anthropic's official best practices are explicit about this: separate research and planning from implementation. Letting Claude jump straight to coding produces solutions that miss existing utilities, duplicate logic, or contradict architectural decisions already in place.

### Claude Code's Research Toolkit

Claude Code does **not** pre-index your codebase or use vector embeddings. Instead, it uses a set of filesystem tools to explore code on-demand — what Anthropic calls "agentic search":

| Tool | What It Does | Token Cost |
|---|---|---|
| **Glob** | Pattern-match file paths (e.g., `**/*.ts`) — returns paths only, not content | Very low |
| **Grep** | Search file contents by regex — returns matching lines with context | Low |
| **LS** | List directory contents | Very low |
| **Read** | Load full file content into context | Medium–High |
| **WebSearch** | Search the web — returns page titles and URLs | Low |
| **WebFetch** | Fetch a specific URL and answer a question about its content | Medium |

The key insight: **Glob and Grep are cheap; Read is expensive.** Claude should narrow the search space with Glob/Grep before reading full files.

### The Explore Agent — Read-Only Codebase Research

Claude Code has a built-in **Explore** subagent type optimized for codebase research. It has access to Glob, Grep, LS, Read, WebFetch, and WebSearch — but **no** Write, Edit, or Bash. This makes it fast, safe, and context-isolated.

Claude uses the Explore agent automatically when you ask open-ended questions about your codebase, or you can invoke it explicitly:

```
"Use the Explore agent to find all API endpoints and their handlers"

"Have an Explore agent map how the authentication flow works, 
from login to session management"

"Use a subagent to investigate how our payment module handles 
refunds and whether there's existing retry logic I should reuse"
```

The Explore agent runs in its own context window — it might read 50 files internally, but your main session only receives a concise summary. This is the single most important pattern for codebase research without burning your context.

### The Research-First Workflow

Anthropic's recommended four-phase workflow puts research first:

**Phase 1 — Explore (Plan Mode)**
Enter Plan Mode so Claude can only read, not write. Ask it to study the relevant parts of the codebase:

> *"Read `src/auth/` and understand how we handle sessions and login. Also look at how we manage environment variables for secrets."*

**Phase 2 — Research External Docs**
Have Claude search for current best practices, API documentation, or framework guides:

> *"Search for the latest best practices for implementing Google OAuth in Next.js 14. Also fetch the official Google OAuth2 documentation."*

**Phase 3 — Plan**
With both internal and external context loaded, ask Claude to create an implementation plan:

> *"I want to add Google OAuth. What files need to change? What's the session flow? Create a plan."*

Use `Ctrl+G` to open the plan in your text editor for direct editing before Claude proceeds.

**Phase 4 — Implement**
Switch to Normal Mode and let Claude code, verifying against its plan.

### External Research: WebSearch + WebFetch

Claude Code uses two web tools that work as a pair:

- **WebSearch** accepts a search query → returns a list of relevant URLs and titles (lightweight)
- **WebFetch** accepts a URL + a question → returns the answer extracted from that page (heavier)

This two-step design keeps things lean: search first, fetch only what you need. Example flow:

> *"Search for how Stripe handles webhook signature verification in Node.js, then fetch the official Stripe docs page and summarize the recommended approach."*

You can also point Claude directly at documentation:

> *"Fetch https://docs.stripe.com/webhooks/signatures and explain the verification steps I need to implement."*

### Grounding with Documentation in CLAUDE.md

For libraries and frameworks your team uses regularly, encode documentation habits directly in CLAUDE.md:

```markdown
## Research Rules
- Before implementing any Stripe integration, fetch the latest Stripe API docs
- Before writing database migrations, read the existing schema in prisma/schema.prisma
- Before modifying authentication, use a subagent to map the full auth flow first
- Always check for existing utilities in src/lib/utils/ before writing new helper functions
```

This ensures Claude researches before coding on every session, not just when you remember to ask.

### Parallel Research with Subagents

For complex features, spawn multiple research agents in parallel:

> *"Before we start implementing the notification system, use three subagents in parallel:*
> *1. One to research how our existing event bus works*
> *2. One to find all places in the codebase that currently send emails*
> *3. One to search the web for best practices on notification queuing with Redis and Bull"*

Each agent works in its own context, reads dozens of files or web pages, and reports back a summary. Your main session stays clean for the actual implementation.

### Building a Research Skill

Encode your research workflow as a reusable skill:

```markdown
---
name: research
description: >
  Research a problem using web search, documentation, and codebase
  exploration. Use when asked to "research", "investigate", or
  "look into" something before implementing.
allowed-tools: Agent, WebSearch, WebFetch, Grep, Glob, Read
---

# Research: $ARGUMENTS

Launch parallel subagents to gather information from different sources:

1. **Web Documentation Agent**: Search official docs for the topic.
   Find best practices and recommended patterns.
2. **Codebase Exploration Agent**: Search the codebase for existing
   implementations, patterns, and utilities related to the topic.
3. **Prior Art Agent**: Search for GitHub issues, blog posts, and
   community solutions.

After all agents report back, synthesize findings into:
- **What exists in our codebase** (files, patterns, utilities to reuse)
- **Best practices from docs** (recommended approach, pitfalls)
- **Gaps and decisions needed** (what we need to build vs reuse)
```

### Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Skipping research and jumping to code | Claude builds from assumptions, not facts | Always explore in Plan Mode first |
| Asking Claude to "investigate" without scoping | Claude reads hundreds of files, fills the context | Scope narrowly or delegate to a subagent |
| Not checking for existing utilities | Claude duplicates logic already in the codebase | Add "check for existing patterns first" to CLAUDE.md |
| Trusting Claude's knowledge of external APIs | Claude's training data may be outdated | Always fetch current documentation with WebFetch |
| Doing all research in the main session | Exploration consumes context needed for implementation | Delegate heavy research to subagents |

### Hands-On Exercise

Working on a real project feature:
1. **Enter Plan Mode** and ask Claude to explore the relevant area of the codebase — note how many files it reads and what it reports
2. **Ask Claude to research externally** — e.g., latest docs for a library you use — and observe the WebSearch → WebFetch flow
3. **Spawn a parallel research subagent** and compare context usage vs doing it in the main session (check with `/context` before and after)
4. **Build a `/research` skill** from the template above, test it on a real problem, and refine the description

---

## Module 13: Designing Custom Subagents (45 min)

**Goal:** Understand when and how to design subagents, and build a reusable one.

### Subagents vs Skills — When to Use Which

| Feature | Skills | Subagents |
|---|---|---|
| Runs in | Main context | Separate context window |
| Best for | Reusable instructions, templates, standards | Research, exploration, isolated heavy work |
| Context impact | Adds to main context | Returns only summary to main context |
| Invocation | `/name` or auto-invoked | Explicit request or defined in `.claude/agents/` |

**Rule of thumb:** If the task produces a lot of intermediate output that the main session doesn't need (file reads, search results, exploration), use a subagent. If it's instructions Claude should follow while working in the main context, use a skill.

### Defining Custom Subagents

Subagents live in `.claude/agents/` as Markdown files with YAML frontmatter:

```markdown
---
name: security-reviewer
description: Reviews code changes for security vulnerabilities
model: sonnet
tools: Read, Grep, Glob, Agent
allowed-tools: Read, Grep, Glob
---

You are a senior security engineer. Review the code changes for:

1. SQL injection, XSS, CSRF vulnerabilities
2. Authentication and authorization bypasses
3. Sensitive data exposure (API keys, PII in logs)
4. Insecure dependencies

Report findings as:
- **Critical**: Must fix before merge
- **Warning**: Should fix soon
- **Info**: Consider improving

Be specific: include file paths, line numbers, and remediation steps.
```

### Key Frontmatter for Agents

| Field | Purpose |
|---|---|
| `model` | Override the session model (e.g., use `haiku` for cheaper agents) |
| `tools` | Allowlist of tools the agent can use |
| `disallowedTools` | Tools to deny |
| `background: true` | Always runs as a background task |
| `effort` | Override effort level: `low`, `medium`, `high`, `max` |
| `isolation: worktree` | Runs in a temporary git worktree (safe for file modifications) |

### Design Principles

- **Be specific about what to return.** Vague prompts like "Look at the codebase" cause subagents to read hundreds of files and return bloated summaries. Ask for structured output.
- **Scope narrowly.** A subagent that does one thing well beats one that does five things poorly.
- **Choose the right model.** Use `haiku` for simple lookups, `sonnet` for standard work, `opus` only when deep reasoning is needed.
- **Remember: subagents can't spawn other subagents via bash.** Use the `Agent` tool for nesting.

### Hands-On Exercise

Build a **Writer/Reviewer pair**: one subagent writes code, another reviews it independently. The reviewer has a fresh context — no bias from having written the code. This is one of the highest-value patterns for code quality.

---

## Module 14: MCP — Connecting External Tools (60 min)

**Goal:** Connect Claude Code to at least two external services via MCP and build a custom MCP workflow.

### What MCP Is

MCP (Model Context Protocol) is an open standard that lets Claude Code call external tools during a session. Each MCP server exposes a set of tools (callable functions) and optionally resources (readable data). Claude Code acts as the MCP client.

Without MCP, Claude Code can read files, run shell commands, and call the Anthropic API — nothing else. Every time you need context from GitHub, a database, Slack, or Figma, you're copy-pasting manually. MCP eliminates that.

### Transport Types

| Transport | How It Works | Best For |
|---|---|---|
| **stdio** | Runs a local process on your machine | Tools needing direct system access (filesystem, local DB) |
| **HTTP** | Connects to a remote server | Cloud services, shared team infrastructure |
| **SSE** | Server-Sent Events stream | Real-time data, monitoring feeds |

### Installing MCP Servers

```bash
# GitHub — PR reviews, issue management, code search
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# PostgreSQL — natural language database queries
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres

# Playwright — browser automation and testing
claude mcp add playwright -- npx -y @anthropic-ai/mcp-server-playwright

# Notion — documentation and knowledge base
claude mcp add notion -e NOTION_API_TOKEN=your-token -- npx -y @makenotion/notion-mcp-server
```

After adding, verify with `/mcp` in a session. You'll see tool names grouped by server.

### Configuration Scopes

| Scope | File | Shared? |
|---|---|---|
| **Global** | `~/.claude.json` | No — only your machine |
| **Project (shared)** | `.mcp.json` in project root | Yes — commit to git |
| **Project (local)** | `.claude/settings.local.json` | No — gitignored |

Project servers take precedence on name conflicts. Use `.mcp.json` for shared team setups and `settings.local.json` for personal credentials.

### Tool Search — Managing Context Cost

Each MCP server's tools consume context tokens. With Tool Search (automatic on Sonnet 4+ and Opus 4+), Claude lazily loads MCP tools only when needed, reducing context usage by up to 95%. This means you can connect many servers without worrying about bloating your context window.

### The Must-Have MCP Servers for Dev Teams

| Category | Server | What It Enables |
|---|---|---|
| **Code & repos** | GitHub MCP | PR reviews, issue creation, repo management from terminal |
| **Browser** | Playwright MCP | E2E tests, web scraping, UI verification |
| **Database** | PostgreSQL / Supabase MCP | Natural language queries, schema exploration |
| **Monitoring** | Sentry MCP | Production error analysis, stack traces, regression tracking |
| **Design** | Figma MCP | Design-to-code workflows, token extraction |
| **Docs** | Notion MCP | Knowledge base access, meeting notes, project docs |
| **Communication** | Slack MCP | Read channels, post messages, search threads |

### Building a Custom MCP Server

For internal tools that don't have public MCP servers, you can build your own. A minimal MCP server in TypeScript:

```typescript
// my-server.ts — exposes a "get_deployments" tool
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "internal-deploys", version: "1.0.0" });

server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_deployments",
    description: "List recent deployments for a service",
    inputSchema: {
      type: "object",
      properties: { service: { type: "string" } },
      required: ["service"]
    }
  }]
}));

server.setRequestHandler("tools/call", async (request) => {
  // Call your internal API here
  const deployments = await fetchFromInternalAPI(request.params.arguments.service);
  return { content: [{ type: "text", text: JSON.stringify(deployments) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Hands-On Exercise

1. **Connect GitHub MCP** and ask Claude to review a real PR from your project.
2. **Connect a database MCP** and ask Claude to explore the schema and answer a business question.
3. **Combine MCP with a skill**: create a `/deploy-check` skill that uses the GitHub MCP to check CI status and the Sentry MCP to check for new errors after the last deployment.

---

## Module 15: Agent Teams & the Orchestrator Pattern (60 min)

**Goal:** Understand multi-agent architectures and run a real Agent Team on a codebase task.

### The Progression of Parallelism

| Pattern | Communication | Best For |
|---|---|---|
| **Single session** | N/A | Most daily tasks |
| **Subagents** | Report back to parent only | Research, isolated work |
| **Manual parallel sessions** | None (you manage coordination) | Independent tasks on separate files |
| **Agent Teams** | Teammates message each other + shared task list | Interdependent work requiring coordination |

### When Agent Teams Make Sense (and When They Don't)

**Good use cases:**
- Large refactors spanning frontend, backend, and tests — each owned by a different teammate
- Parallel code reviews where reviewers cross-reference findings
- Multi-module features where a frontend dev needs to know what API the backend dev is building
- Cross-repo migrations

**Don't use Agent Teams for:**
- Sequential tasks with tight dependencies
- Same-file edits (merge conflicts)
- Simple tasks where a single session is sufficient
- When cost is a primary concern — Agent Teams use roughly 7x the tokens of a single session in plan mode

### Architecture

Agent Teams consist of four components:

1. **Team Lead**: Your main Claude Code session. Analyzes tasks, creates teams, spawns teammates, orchestrates.
2. **Teammates**: Independent sessions, each with their own context window. Work autonomously.
3. **Shared Task List**: Dependency-aware task tracking visible to all agents. Teammates claim tasks and mark completion.
4. **Mailbox**: Direct messaging between teammates — not just through the lead. This is the key difference from subagents.

### Setting Up Agent Teams

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Requires Claude Code v2.1.32+. Use `Shift+Down` to cycle through teammates in the terminal.

### Running a Team

Describe the work in natural language:

> *"Create an agent team with 3 teammates to refactor our authentication module: one for the backend API routes, one for the frontend auth components, and one for integration tests."*

Claude will:
1. Create a team and spawn teammates
2. Build a shared task list with dependencies
3. Each teammate works in its own context window
4. Teammates communicate findings via the mailbox
5. The lead synthesizes results and resolves conflicts

### Team Sizing Guidelines

- **Start with 3–5 teammates** for most workflows
- **5–6 tasks per teammate** keeps everyone productive without excessive context switching
- Three focused teammates often outperform five scattered ones
- Beyond 5 teammates, coordination overhead increases and diminishing returns set in

### The Orchestrator Pattern

The Orchestrator Pattern is the fundamental architecture behind Agent Teams:

```
                    ┌─────────────────┐
                    │   Orchestrator   │
                    │   (Team Lead)    │
                    │                  │
                    │  Plans tasks     │
                    │  Assigns work    │
                    │  Synthesizes     │
                    └──────┬──────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴──────┐ ┌───┴──────┐
        │ Teammate A │ │Teammate B│ │Teammate C│
        │ (Backend)  │ │(Frontend)│ │ (Tests)  │
        │            │ │          │ │          │
        │ Own context│ │Own contxt│ │Own contxt│
        │ Own tools  │ │Own tools │ │Own tools │
        └─────┬──────┘ └────┬─────┘ └────┬─────┘
              │              │             │
              └──────────────┴─────────────┘
                     Shared Task List
                        + Mailbox
```

The orchestrator **does not write code directly**. It plans, assigns, tracks progress, and integrates results. Implementation, testing, and review happen in the teammates — each with their own isolated context.

### Alternative Orchestrators

Beyond Claude's built-in Agent Teams, the community has built external orchestrators:

- **Multiclaude**: Supports team review workflows, good for long prompts then walk away
- **Gas Town**: More complex setup, better for solo devs running many agents in parallel
- **OpenClaw/OpenCode**: Supports mixed-model teams (GPT + Gemini + Claude in the same team)

### Hands-On Exercise

Run an Agent Team on a real task:
1. Enable Agent Teams in settings
2. Identify a multi-component task in your codebase (e.g., add a new API endpoint with frontend UI and tests)
3. Spawn a 3-teammate team and observe the task list, messaging, and coordination
4. Compare the result with how you'd approach it as a single session

---

## Module 16: Composing Complex Workflows (60 min)

**Goal:** Combine skills, agents, hooks, and MCP into end-to-end automated development workflows.

### The Workflow Stack

Each building block has a distinct role. The power comes from combining them:

| Layer | What It Does | Analogy |
|---|---|---|
| **CLAUDE.md** | Persistent project context and conventions | The employee handbook |
| **Skills** | Reusable instructions that activate on-demand | The SOP library |
| **Subagents** | Isolated workers for research and heavy tasks | Contractors on specific errands |
| **Hooks** | Deterministic scripts at lifecycle events | Git hooks, CI triggers |
| **MCP** | External tool connections | The kitchen (tools, ingredients) |
| **Plugins** | Bundled packages of all the above | The franchise kit |
| **Agent Teams** | Coordinated multi-agent work | The project crew |

### Recipe: Feature Development Workflow

Combine building blocks into an end-to-end feature workflow:

1. **CLAUDE.md** contains implementation standards ("write tests first", "don't commit until approved")
2. **`/feature-spec` skill** creates user story, acceptance criteria, technical approach, and test strategy
3. **Subagent** researches the codebase for existing patterns and dependencies (separate context)
4. **Plan Mode** produces the implementation plan with the spec and research as input
5. **Hooks**: `PostToolUse` on `Write` → auto-runs linter; `PreToolUse` on `Bash(git commit)` → validates tests pass
6. **GitHub MCP** creates a branch, commits, and opens a PR
7. **A second subagent** reviews the PR from a fresh context (Writer/Reviewer pattern)

### Recipe: Automated PR Pipeline

```
Trigger: Developer says "implement and ship JIRA-1234"
    │
    ├─ Skill: /jira-fetch reads the ticket via MCP → Jira
    ├─ Subagent: researches codebase for affected files
    ├─ Plan Mode: proposes implementation plan
    ├─ After approval: Claude implements across files
    ├─ Hook (PostToolUse:Write): auto-lint on every file write
    ├─ Claude runs tests, fixes failures
    ├─ MCP → GitHub: creates branch + PR
    ├─ Subagent: independent code review from fresh context
    ├─ MCP → Slack: notifies team channel with PR link
    └─ Done
```

### Building Hooks for Workflow Automation

Hooks are deterministic code that runs at lifecycle events. Configure via `/hooks` or `settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{ "type": "command", "command": "npm run lint --fix" }]
    }],
    "PreToolUse": [{
      "matcher": "Bash(git commit*)",
      "hooks": [{ "type": "command", "command": "npm test" }]
    }],
    "Stop": [{
      "hooks": [{ "type": "command", "command": "osascript -e 'display notification \"Claude is done\" with title \"Claude Code\"'" }]
    }]
  }
}
```

Available hook events: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Notification`, `Stop`, `SessionStart`, `SessionEnd`, `PreCompact`, `SubagentStart`, `SubagentStop`, `TeammateIdle`, `TaskCompleted`, `PermissionRequest`, `ConfigChange`, `Setup`.

### Packaging It All as a Plugin

Once your workflow is stable, bundle it as a plugin so the whole team gets the same setup:

```
my-plugin/
├── manifest.json
├── skills/
│   ├── feature-spec/SKILL.md
│   └── deploy-check/SKILL.md
├── agents/
│   ├── security-reviewer.md
│   └── test-writer.md
├── hooks.json
└── mcp.json
```

Install with `/plugin install` and all components activate automatically. Skills get namespaced (`/my-plugin:feature-spec`) to avoid collisions.

### Hands-On Exercise: Build an End-to-End Workflow

Working in pairs, each team:
1. **Identifies a repetitive workflow** from their daily development (e.g., bug triage, feature development, dependency updates)
2. **Designs the workflow** on paper: which building blocks go where?
3. **Builds it**: create the skills, agents, and hooks; connect any MCP servers needed
4. **Tests it** on a real task
5. **Presents it** to the group (5-minute demo each)

---

## Module 17: CI/CD Integration & Headless Workflows (30 min)

**Goal:** Run Claude Code in automated pipelines for code review, issue triage, and batch operations.

### Claude Code in CI

Claude Code can run headless in CI/CD pipelines using the `-p` flag (non-interactive mode):

```bash
# Run a single prompt and exit
claude -p "Review the changes in this PR for security issues" --allowedTools Read,Grep,Glob

# Pipe input
echo "Fix all TypeScript type errors in src/" | claude -p --model sonnet
```

### GitHub Actions Integration

```yaml
name: AI Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code
      - name: Review PR
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Review this PR for bugs, security issues, and style violations. \
            Focus on changed files only." --allowedTools Read,Grep,Glob
```

### Batch Operations

For large-scale migrations or analyses, distribute work across many parallel invocations:

```bash
# List all files that need migrating
claude -p "List all Python files that use the old logging format" > files.txt

# Process each in parallel
cat files.txt | xargs -P 4 -I {} claude -p "Migrate {} to the new structured logging format" --allowedTools Read,Write
```

### The `/batch` Command

For parallel refactoring within a session, `/batch` handles worktree isolation automatically — simpler than Agent Teams when tasks are independent and don't need communication.

---

## Phase 2 Schedule — Advanced (Full day)

| Time | Module | Format |
|---|---|---|
| 0:00–0:15 | Recap Phase 1 + Q&A from field experience | Discussion |
| 0:15–1:15 | Module 11: Building Custom Skills | Presentation + hands-on |
| 1:15–2:00 | Module 12: Grounding with Research | Live demo + hands-on |
| 2:00–2:15 | *Break* | |
| 2:15–3:00 | Module 13: Designing Custom Subagents | Presentation + hands-on |
| 3:00–4:00 | Module 14: MCP — Connecting External Tools | Live demo + hands-on |
| 4:00–4:15 | *Break* | |
| 4:15–5:15 | Module 15: Agent Teams & Orchestrator Pattern | Presentation + hands-on |
| 5:15–6:15 | Module 16: Composing Complex Workflows | Pair exercise + demos |
| 6:15–6:45 | Module 17: CI/CD Integration | Demo + Q&A |

---

## Additional Phase 2 Resources

### Official Documentation
- **Skills:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Agent Teams:** [code.claude.com/docs/en/agent-teams](https://code.claude.com/docs/en/agent-teams)
- **MCP Integration:** [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)
- **Hooks:** [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks)
- **Best Practices:** [code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices)

### Guides & Tutorials
- **Complete Guide to Building Skills for Claude** (Anthropic): [resources.anthropic.com](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
- **How to Build a Production-Ready Skill** (Towards Data Science): [towardsdatascience.com](https://towardsdatascience.com/how-to-build-a-production-ready-claude-code-skill/)
- **Hugging Face MCP Course — Unit 3**: [huggingface.co/learn/mcp-course](https://huggingface.co/learn/mcp-course/en/unit3/introduction)
- **Claude Code Extensions Explained** (Medium): [muneebsa.medium.com](https://muneebsa.medium.com/claude-code-extensions-explained-skills-mcp-hooks-subagents-agent-teams-plugins-9294907e84ff)
- **Builder.io MCP Servers Guide**: [builder.io/blog/claude-code-mcp-servers](https://www.builder.io/blog/claude-code-mcp-servers)
- **Agent Teams Practical Guide** (LaoZhang): [blog.laozhang.ai](https://blog.laozhang.ai/en/posts/claude-code-agent-teams)

### Community Repos
- **Anthropic Skills Repository** (87k+ stars): [github.com/anthropics/skills](https://github.com/anthropics/skills)
- **awesome-claude-code-plugins**: [github.com/ccplugins/awesome-claude-code-plugins](https://github.com/ccplugins/awesome-claude-code-plugins)
- **claude-code-workflows** (production-ready plugins): [github.com/shinpr/claude-code-workflows](https://github.com/shinpr/claude-code-workflows)
- **Agents repo** (112 agents, 146 skills, 16 orchestrators): [github.com/wshobson/agents](https://github.com/wshobson/agents)

---

*Last updated: March 2026. Based on Claude Code docs, community best practices, and current model lineup (Opus 4.6, Sonnet 4.6, Haiku 4.5).*
