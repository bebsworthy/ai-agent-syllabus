---
title: Changelog
description: "What's new and updated in the AI-Augmented Development Playbook."
---

All notable changes to the playbook curriculum are documented here.

---

## 2026-03-30 — Syllabus Coverage Review

Reviewed the draft Claude Code training plan (17 modules across 2 phases) against all 14 playbook modules. Closed 14 structural gaps and 8 enrichment items to ensure comprehensive coverage of practical Claude Code usage.

### New Content

**M04 — Context Engineering**
- **Research Grounding section** — Claude Code's research toolkit (Glob, Grep, Read, WebSearch, WebFetch) with token cost profiles, the Explore Agent for read-only codebase research, WebSearch + WebFetch two-step pattern, encoding research rules in CLAUDE.md, parallel research with subagents, and a 5-item anti-patterns table
- **CLAUDE.md hierarchy** — four-level scoping system (global, project-wide, project-specific, directory-scoped) with a decision table
- **1M context window details** — GA availability, `[1m]` model variant, detailed `/context` output example showing all token categories
- **Subagent context isolation** — before/after ASCII diagrams showing token impact
- **Three signs of polluted context** — repeats info, mixes up files, applies wrong conventions
- **Horizontal scaling** — running multiple parallel sessions for effective 600k+ tokens
- **`/rewind` command** added to context management commands table
- **`/init` command** added to M04 workshop as Step 1 of CLAUDE.md creation

**M02 — Prompt Engineering**
- **OpusPlan mode** — `claude --model opusplan` for Opus planning + Sonnet execution
- **Model configuration methods** — mid-session `/model`, startup `--model`, persistent `settings.json`
- **Common Workflows quick reference** — ready-to-use prompt templates for exploring codebases, debugging, writing tests, refactoring, creating PRs, and code review
- **Session management commands** — `/resume`, `/rename`, `claude --continue`

**M07 — Advanced Workflows**
- **Skill frontmatter** — `user-invocable` and `argument-hint` fields
- **Progressive disclosure** — three-stage skill loading model (metadata, SKILL.md body, supporting files)
- **Writing good descriptions** — guidance with bad/good examples for auto-invocation
- **Subagent configuration** — full frontmatter reference (`disallowedTools`, `background`, `effort`, `isolation: worktree`)
- **Complete hook lifecycle events** — all 15 events listed (previously only 4 were shown)
- **Hook config via settings.json** — inline JSON configuration method alongside shell scripts
- **End-to-end workflow recipe** — capstone exercise chaining all building blocks

**M05 — Agents and MCP**
- **Tool Search** — lazy-loading mechanism reducing MCP context usage by up to 95%
- **Quick-start install commands** — `claude mcp add` for GitHub, PostgreSQL, Playwright, Sentry, Notion
- **MCP config scope table** — file paths for global (`~/.claude.json`), project (`.mcp.json`), and local (`.claude/settings.local.json`) scopes

**M10 — Agent Teams**
- **Team sizing guidelines** — 3-5 teammates, 5-6 tasks per teammate
- **`Shift+Down` shortcut** — cycle through teammates in the terminal
- **Community orchestrators** — Multiclaude, Gas Town, OpenClaw/OpenCode added to alternatives table

**M12 — CI/CD Integration**
- **`/batch` command** — parallel refactoring with automatic worktree isolation
- **Plugin packaging** — enhanced directory structure with `manifest.json` and skill namespacing

**M01 — Workshop**
- **"What Is Claude Code"** positioning section with differentiator table vs Cursor/Copilot
- **OS prerequisites** — macOS 13+, Windows 10+, Ubuntu 20.04+, 4GB RAM
- **`winget install`** for Windows, `!command` shortcut
- **Adoption stats** — 4% of GitHub commits, 90% of Anthropic code with AI (as of early 2026)

**M03 — Specs Are Source Code**
- **`Ctrl+G` shortcut** — open plan in text editor for direct editing during Plan Mode

**M13 — Team Adoption**
- **Golden rules checklist** — 7-item quick reference for team Claude Code usage
