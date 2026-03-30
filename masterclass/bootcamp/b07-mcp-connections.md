---
title: "07: Connect Your Tools with MCP"
description: "Give Claude access to GitHub, databases, and other tools — so it works with your real systems, not just files."
sidebar:
  label: "07: MCP Connections"
  order: 7
---

**35 minutes | You need: GitHub access (or another external tool)**

## Setup

Without MCP, Claude can read files and run shell commands — nothing else. Every time you need context from GitHub, a database, or Slack, you're copy-pasting manually. MCP eliminates that.

## Do This

### 1. Connect GitHub MCP

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

Verify it's connected:
```text
/mcp
```

You should see GitHub tools in the list.

### 2. Use it

Ask Claude to do something that requires GitHub access:

> *"List the open PRs on this repo and summarize what each one changes."*

or

> *"Review PR #[number] for security issues and potential bugs."*

### 3. Connect one more tool

Choose the one most relevant to your stack:

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

Verify with `/mcp` again.

### 4. Combine MCP with a real task

Use your MCP connections together:

> *"Check if there are any open issues related to authentication, then look at the relevant code and draft a fix for the most recent one."*

### 5. Understand where configs live

| Scope | File | When to use |
|-------|------|-------------|
| Global | `~/.claude.json` | Personal tools across all projects |
| Project (shared) | `.mcp.json` in project root | Team tools — commit to git |
| Project (local) | `.claude/settings.local.json` | Personal credentials — gitignored |

For team setups, put shared connections in `.mcp.json` and commit it. Keep tokens in `.claude/settings.local.json`.

:::note[Why this matters]{icon="right-arrow"}
Tool Search (automatic on Sonnet 4+ and Opus 4+) lazy-loads MCP tools only when needed, so you can connect many servers without bloating your context. Start with 2-3 that match your immediate workflow. Don't install everything at once.
:::

## Artifact

Two working MCP connections configured and verified with a real task.

## Go Deeper

[Playbook M05 — Agents and MCP](/tier-1/m05-agents-and-mcp/) for agent architecture and protocol details. [Playbook M06 — Tool Design](/tier-2/m06-tool-design/) for building custom MCP servers for your internal tools.
