---
title: "M05: Agents and MCP — Workshop Guide"
description: "Connect 2-3 MCP servers relevant to your team and observe how agents discover and select tools."
---


**Self-directed | 45–60 min | Requires: M05 study guide read beforehand**

---

## Before You Start

**Prerequisites**

- M05 study guide read (theory + readings)
- Claude Code installed and authenticated
- Access to at least one external system you want to integrate:
  - GitHub repository (most common)
  - PostgreSQL database (or other primary data store)
  - Team tool (Slack, Linear, Jira, Notion)
- OAuth credentials or API tokens ready (will be stored securely locally)
- MCP registry access (https://registry.mcp.ai)

:::note
This is where Claude Code goes from a coding assistant to a team tool. MCP connections mean Claude can actually access your real systems—GitHub, databases, team tools—instead of guessing. Tool selection is the critical skill. You will see agents succeed when tools are well-designed and fail when semantics are ambiguous. By the end, you'll have 2–3 working tools and an understanding of when more tools help vs. hurt.
:::

**What you'll do**

- [ ] Review how the agent loop and MCP protocol work
- [ ] Connect your first MCP server and verify it in Claude Code
- [ ] Observe how Claude selects (and misselects) tools across different task types
- [ ] Design a custom MCP tool for a recurring task in your workflow
- [ ] Run an end-to-end agent task using real tool access

---

## Part 1 — MCP Architecture Overview

**Objective**: Understand how agents and tools interact.

### Agent Loop

When you ask Claude to do something complex, it runs a loop:

1. Observes state (conversation + available tools)
2. Plans the next action
3. Selects a tool
4. Tool executes (API call, database query)
5. Results come back
6. Repeats until complete

### JSON-RPC Protocol

MCP communication is JSON back-and-forth. Claude Code is the client; MCP servers are the tools. You don't need deep protocol knowledge — just understand that each tool call is a structured request and the result is structured data Claude reads and acts on.

### Tool Discovery

Browse the MCP Registry at https://registry.mcp.ai to see what's available. Quality varies: some servers are thin wrappers around REST APIs; others are purpose-built semantic tools. Prefer the latter.

---

## Part 2 — Connect Your First MCP Server

**Objective**: Hands-on experience with MCP setup.

Choose 1–2 tools from the registry that are relevant to your work:

- **GitHub MCP** — version control access
- **PostgreSQL MCP** — database access (if you have a Postgres DB)
- **Linear MCP** — project management (if your team uses Linear)
- **Slack MCP** — team communication (if your team uses Slack)

**Steps**

1. **Choose your first tool** — GitHub is the most universally applicable starting point.

2. **Install and connect** — follow the tool's MCP setup instructions (usually via CLI). Example for GitHub MCP:
   ```bash
   npm install -g @modelcontextprotocol/server-github
   # Configure with GitHub credentials
   claude /mcp connect github
   ```
   If auth is required, complete the OAuth flow before continuing.

3. **Verify** — run `/mcp` in Claude Code and confirm the tool appears in the list.

4. **Test the connection** — open Claude Code and ask:
   > "List my GitHub repositories."

   Claude should use the GitHub MCP to fetch real data. If it does, the connection is working. Notice: Claude no longer has to guess — it has access to actual information.

:::tip[Hint]
If OAuth fails, check that your token has the right scopes. For GitHub, you need at minimum `repo` and `read:org`. Revoke and regenerate the token if it's expired.
:::

:::caution
If `/mcp` doesn't show your installed tool, close Claude Code completely, reopen it, and run `/mcp` again. If it still doesn't appear, the tool's install path may not be in your `PATH`. Verify with `which [tool-name]` in your terminal.
:::

---

## Part 3 — Observe Tool Selection and Failure

**Objective**: Understand when agents make good vs. bad tool choices.

Work through these three scenarios in order. After each one, note what happened and why.

### Scenario A — Good Tool Choice

Connect 2–3 tools (e.g., GitHub + your database + Slack), then ask a task that clearly maps to one tool:

> "Show me the top 5 most recent commits in our main repository."

Claude should pick the GitHub MCP and return the correct result. When the task is clear and a single tool is the obvious match, Claude gets it right.

### Scenario B — Ambiguous Task

Ask a task that could legitimately use multiple tools:

> "What's the status of our deployment pipeline? Show me recent commits and recent errors."

Observe which tool Claude picks first and whether it tries both. Tool selection depends on how well Claude understands the *semantics* of each tool — its name, description, and the shape of its outputs. Ambiguous tool descriptions lead to inconsistent choices.

:::note
If Claude picks the wrong tool here, that's expected and useful. Ask yourself: would a clearer tool name or description have helped it decide?
:::

### Scenario C — Too Many Tools

Disconnect some tools, leaving only the most relevant ones. Repeat the task from Scenario A.

You should find Claude responds faster and with more confidence. This is the core tradeoff: **curated tools outperform a large collection of loosely relevant ones.**

---

## Part 4 — Design a Custom MCP Tool

**Objective**: Think about how to create tools that agents use well.

Identify a recurring task that Claude should be able to handle — something your team does regularly. Examples:

- Deploy a service to staging
- Get the status of all open support tickets
- Trigger a data export

**Design the tool** with these principles:

| | Good design | Bad design |
|---|---|---|
| **Name** | `deploy_to_staging(service_name)` | `POST /api/v1/system/orchestration/resources/deployment` |
| **Inputs** | Only what's needed (service name, version, environment) | Vague or overloaded parameters |
| **Output** | Clear success/failure with status | Raw API response that requires further parsing |
| **Semantic clarity** | Agent immediately understands what it does | Agent must reverse-engineer intent from structure |

:::note
Custom MCP tools are most useful when they're task-focused, not API-focused. The tool name and description should be immediately understandable to an AI agent — and to a human reviewing the agent's work. If you wouldn't know what the tool does from the name alone, neither will Claude.
:::

:::tip[Hint]
If you don't have any external tools set up yet, spend more time here. Sketch out: what *should* you integrate? What would Claude be most useful for if it had real access to your systems? Designing the tool now means you're ready to build or configure it when the infrastructure is in place.
:::

---

## Hands-on Exercise: End-to-End Agent Task

**Objective**: Experience agent tool selection and iteration on a realistic task.

### Setup

Pick a realistic task that requires tool access. Examples:

- "Find all open issues in our GitHub repo tagged 'bug', summarize them, and create a tracking document."
- "Check the status of the last 5 database deployments and alert me if any failed."
- "Get the last week's worth of error logs and identify the top 5 most common errors."

### Steps

1. **Connect relevant tools** — identify which tools the agent will need (GitHub, databases, monitoring, etc.) and connect them:
   ```
   /mcp connect [tool]
   ```
   Run `/mcp` to confirm all connected tools appear.

2. **Craft the task request** — be specific about what you want. Example:
   > "Find all issues tagged 'bug' that were opened in the last 7 days. For each, extract: title, description, assigned person. Format as a markdown table."

   Specificity helps the agent choose the right tool. For complex tasks, enter Plan Mode (Shift+Tab) so Claude shows you its plan before executing.

3. **Observe tool selection** — run the task and watch Claude's tool calls (each call is logged). Ask yourself:
   - Did Claude pick the right tools?
   - Did it make the right sequence of calls?
   - If it made a mistake, did the tool fail, or did Claude misunderstand the task?

4. **Iterate and refine** — if the first attempt didn't produce the right output, refine your request with more context:
   > "We're looking for bugs that impact customers, so filter for issues with more than 10 comments."

   Claude's second attempt is usually better because it can incorporate what it learned from the first.

5. **Verify and complete** — once the output is correct, review what happened end-to-end: tool selection, error handling, iteration. You've completed a real task via agent tool access.

:::tip[Hint]
If an agent tool call returns an error, don't abandon the task. Read the error carefully — is it a permissions issue, a missing scope, or invalid input? Each of these has a different fix. Claude will often handle errors gracefully on its own if you let it try again.
:::

---

## Reflection Questions

Work through these on your own after the exercise:

1. Did Claude pick the right tool on the first try, or did it need refinement? What made the difference?

2. When were you tempted to add more tools — and when did adding tools actually slow Claude down?

3. Which tool's output was most useful, and which felt redundant?

4. If you were to build a custom MCP tool for your team's workflow, what would it do, and how would you design it to avoid ambiguity?

5. How does agent tool access change what you expect Claude to be able to do compared to before?

---

## Troubleshooting

**OAuth flow fails or credentials rejected**

1. Verify the credentials are correct (not expired, not revoked)
2. Check that the token has the right scopes (e.g., GitHub token needs `repo` and `read:org` scopes)
3. Try disconnecting and reconnecting: `/mcp disconnect [tool]` then `/mcp connect [tool]`
4. If all else fails, switch to a different tool temporarily (e.g., try PostgreSQL instead of GitHub)

**Tool is installed but `/mcp` doesn't show it**

1. Close Claude Code completely
2. Reopen it
3. Run `/mcp` again

If it still doesn't appear, the tool's install path may not be in `PATH`. Verify with `which [tool-name]` in your terminal.

**Agent makes a tool call but gets an error back**

This is realistic and worth learning from. Consider:
- What error did the tool return? (permission denied, not found, invalid input?)
- Did Claude handle it gracefully, or get confused?
- What would prevent this error next time? (better permissions, clearer input validation)

**Database permission errors**

If the MCP tool lacks the right database role:
- Confirm the database user has at minimum `SELECT` on the tables Claude needs
- Confirm the user has the correct role
- Consider creating a dedicated read-only MCP user rather than using the main app's credentials — this is a good security practice regardless

**"Can we expose our entire REST API as an MCP tool?"**

You can, but you shouldn't. The point of MCP is to wrap low-level APIs in high-level semantic tools. Expose the key operations Claude needs to understand — not all 50 endpoints. See "APIs Don't Make Good MCP Tools" in the M05 study guide.

---

## Checklist: Before You Move On

- [ ] At least 2–3 MCP tools connected and verified working
  - [ ] GitHub (or equivalent version control)
  - [ ] One data source (database, API, or knowledge base)
  - [ ] One team tool (optional: Slack, Linear, or similar)
- [ ] Completed a task that required tool access
- [ ] Observed the tradeoff between more tools and tool confusion
- [ ] Sketched a design for a custom MCP tool your team could build
- [ ] Familiar with the key `/mcp` commands:
  - [ ] `/mcp` — list all connected tools
  - [ ] `/mcp connect [tool]` — add a tool
  - [ ] `/mcp disconnect [tool]` — remove a tool
