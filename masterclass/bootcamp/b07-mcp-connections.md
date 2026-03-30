---
title: "07: MCP & External Tools"
description: "Connect Claude to GitHub, databases, and other systems — with full awareness of the context cost tradeoff."
sidebar:
  label: "07: MCP & Tools"
  order: 7
---

**35 minutes | You need: GitHub access (or another external tool)**

## How MCP Works

Without MCP, Claude can read files and run shell commands — that's it. MCP (Model Context Protocol) adds structured access to external systems: GitHub, databases, browsers, monitoring tools.

But MCP has a cost. Every MCP server exposes tools, and each tool has a description that consumes context tokens. Before you connect anything, understand the tradeoff.

### MCP vs Skill+CLI: the decision framework

If the tool has a good CLI, **prefer a skill that wraps the CLI**:

| Approach | Idle context cost | Good for |
|----------|------------------|----------|
| Skill wrapping CLI | ~100 tokens (name + description) | `gh`, `aws`, `docker`, `kubectl`, `terraform`, `gcloud` |
| MCP server | Hundreds-thousands of tokens | No CLI exists, persistent connections (databases), structured I/O |

Use MCP when:
- **No CLI exists** for the tool
- **Persistent connection needed** (database queries, websockets)
- **Structured input/output** that CLI doesn't handle well (complex API interactions)

Don't install an MCP server for something `gh` or `aws cli` already does well. A skill that wraps the CLI loads only when invoked and costs nothing at idle.

## Do This

### 1. Connect GitHub MCP

GitHub is the most common first connection:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

Verify:
```text
/mcp
```

You should see GitHub tools in the list.

### 2. Do real work with it

Don't just list PRs — do something useful:

```text
Review PR #[number]. Check for: security issues, missing error handling, breaking changes to public APIs. Summarize findings with severity levels.
```

Or combine GitHub context with codebase work:

```text
Check the 3 most recent open issues. For the one most related to authentication, look at the relevant code and draft a fix.
```

### 3. Connect one more tool

Choose based on your stack:

```bash
# PostgreSQL — natural language database queries
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres

# Playwright — browser automation and E2E testing
claude mcp add playwright -- npx -y @anthropic-ai/mcp-server-playwright

# Sentry — production error analysis
claude mcp add sentry -e SENTRY_AUTH_TOKEN=your-token -- npx -y @sentry/mcp-server

# Notion — documentation and knowledge base
claude mcp add notion -e NOTION_API_TOKEN=your-token -- npx -y @makenotion/notion-mcp-server
```

Verify with `/mcp` again. Run `/context` to see the token impact of the new tools.

### 4. Understand Tool Search

On Sonnet 4+ and Opus 4+, Claude doesn't load all tool descriptions into context upfront. Instead, **Tool Search** lazy-loads descriptions only when they seem relevant to the current task.

This reduces context bloat but isn't free — each search query costs tokens. The practical impact:
- You **can** connect many MCP servers without immediate context explosion
- You **still** pay a token cost when Claude searches for relevant tools
- Fewer servers = less noise in tool search results = better tool selection

**Start with 2-3 MCP servers that match your immediate workflow.** Add more only when you have a concrete need.

### 5. Scope and security

MCP configs live in three places:

| Scope | File | When to use |
|-------|------|-------------|
| Global | `~/.claude.json` | Personal tools across all projects |
| Project (shared) | `.mcp.json` in project root | Team tools — commit to git |
| Project (local) | `.claude/settings.local.json` | Personal credentials — gitignored |

**For team setups:** Put shared server configs (without tokens) in `.mcp.json`. Keep tokens and personal credentials in `.claude/settings.local.json` which is gitignored.

**Credentials:** Use the `-e` flag to pass environment variables to MCP servers:
```bash
claude mcp add sentry -e SENTRY_AUTH_TOKEN=your-token -- npx -y @sentry/mcp-server
```

Never put tokens directly in `.mcp.json` if it's committed to git.

### 6. Combine MCP with skills

The most powerful pattern is an MCP server providing data access, wrapped in a skill that provides workflow instructions:

````md
---
name: triage-issues
description: Triage open GitHub issues by priority and suggest which to work on next
context: fork
---

Use the GitHub MCP tools to:
1. List open issues labeled "bug" or "feature"
2. For each, check: how old, how many comments, is it blocking anything
3. Cross-reference with the codebase — which issues touch areas with recent churn
4. Rank by: severity × recency × code-area-risk
5. Present top 3 recommendations with reasoning
````

The skill runs in a subagent (`context: fork`), uses MCP tools for GitHub access, and doesn't pollute your main context.

:::note[Why this matters]{icon="right-arrow"}
MCP extends Claude's reach beyond your filesystem — but every extension has a context cost. The power users are selective: 2-3 MCP servers for things that truly need persistent connections, skills wrapping CLIs for everything else. Check `/context` after adding an MCP server to see the actual impact.
:::

## Artifact

Two working MCP connections configured and tested with real tasks. Understanding of the MCP vs skill+CLI tradeoff.

## Go Deeper

[Playbook M05 — Agents and MCP](/tier-1/m05-agents-and-mcp/) for agent architecture and protocol details. [Playbook M06 — Tool Design](/tier-2/m06-tool-design/) for building custom MCP servers for your internal tools.
