# Claude Code Best Practices

**Source:** https://code.claude.com/docs

## Overview

Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. Available in your terminal, IDE, desktop app, and browser.

## What You Can Do

### Automate the Work You Keep Putting Off

Claude Code handles tedious tasks: writing tests for untested code, fixing lint errors across a project, resolving merge conflicts, updating dependencies, and writing release notes.

```bash
claude "write tests for the auth module, run them, and fix any failures"
```

### Build Features and Fix Bugs

Describe what you want in plain language. Claude Code plans the approach, writes the code across multiple files, and verifies it works. For bugs, paste an error message or describe the symptom—Claude Code traces the issue through your codebase, identifies the root cause, and implements a fix.

### Create Commits and Pull Requests

Claude Code works directly with git. It stages changes, writes commit messages, creates branches, and opens pull requests.

```bash
claude "commit my changes with a descriptive message"
```

In CI, you can automate code review and issue triage with GitHub Actions or GitLab CI/CD.

### Connect Your Tools with MCP

The Model Context Protocol (MCP) is an open standard for connecting AI tools to external data sources. With MCP, Claude Code can read your design docs in Google Drive, update tickets in Jira, pull data from Slack, or use your own custom tooling.

### Customize with Instructions, Skills, and Hooks

`CLAUDE.md` is a markdown file you add to your project root that Claude Code reads at the start of every session. Use it to set coding standards, architecture decisions, preferred libraries, and review checklists. Claude also builds auto memory as it works, saving learnings like build commands and debugging insights across sessions.

Create custom commands to package repeatable workflows your team can share, like `/review-pr` or `/deploy-staging`.

Hooks let you run shell commands before or after Claude Code actions, like auto-formatting after every file edit or running lint before a commit.

### Run Agent Teams and Build Custom Agents

Spawn multiple Claude Code agents that work on different parts of a task simultaneously. A lead agent coordinates the work, assigns subtasks, and merges results.

For fully custom workflows, the Agent SDK lets you build your own agents powered by Claude Code's tools and capabilities, with full control over orchestration, tool access, and permissions.

### Pipe, Script, and Automate with the CLI

Claude Code is composable and follows the Unix philosophy. Pipe logs into it, run it in CI, or chain it with other tools:

```bash
# Analyze recent log output
tail -200 app.log | claude -p "Slack me if you see any anomalies"

# Automate translations in CI
claude -p "translate new strings into French and raise a PR for review"

# Bulk operations across files
git diff main --name-only | claude -p "review these changed files for security issues"
```

### Schedule Recurring Tasks

Run Claude on a schedule to automate work that repeats: morning PR reviews, overnight CI failure analysis, weekly dependency audits, or syncing docs after PRs merge.

- Cloud scheduled tasks run on Anthropic-managed infrastructure
- Desktop scheduled tasks run on your machine with direct access to local files and tools
- `/loop` repeats a prompt within a CLI session for quick polling

### Work From Anywhere

Sessions aren't tied to a single surface. Move work between environments as your context changes:

- Step away and keep working from your phone or browser with Remote Control
- Message Dispatch a task and open the Desktop session it creates
- Kick off long-running tasks on the web or iOS app, then pull them into your terminal
- Hand off a terminal session to the Desktop app for visual diff review
- Route tasks from team chat via Slack

## Use Claude Code Everywhere

Each surface connects to the same underlying Claude Code engine, so your CLAUDE.md files, settings, and MCP servers work across all of them.

Integration options include:

- **Remote Control:** Continue sessions on different devices
- **Channels:** Push events from Telegram, Discord, iMessage, or webhooks
- **Web/iOS:** Start tasks locally, continue on mobile
- **Scheduled tasks:** Run on recurring schedules
- **CI/CD:** GitHub Actions, GitLab CI/CD automation
- **Code Review:** Automatic PR reviews
- **Slack:** Route bug reports to pull requests
- **Chrome:** Debug live web applications
- **Agent SDK:** Build custom agents for your workflows

## Key Capabilities

- Read and understand entire codebases
- Edit files with inline diffs
- Run commands and verify results
- Integrate with external tools via MCP
- Store persistent instructions with CLAUDE.md
- Create custom commands and skills
- Set up pre/post-action hooks
- Coordinate multi-agent teams
- Schedule recurring tasks
- Work across terminal, IDE, desktop, web, and mobile
