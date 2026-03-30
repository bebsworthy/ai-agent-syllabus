---
title: "M05: Agents and MCP — Workshop Guide"
description: "Connect 2-3 MCP servers relevant to your team and observe how agents discover and select tools."
---

# M05: Agents and MCP — Workshop Guide

**Facilitated session | 45–60 min | Requires: M05 study guide read beforehand**

---

## Before You Start

**Facilitator note**

This is where Claude Code goes from a coding assistant to a team tool. MCP connections mean Claude can actually access your real systems—GitHub, databases, team tools—instead of guessing. Tool selection is the critical skill. This session brings that alive. Participants will see agents succeed when tools are well-designed and fail when semantics are ambiguous. By the end, they'll have 2–3 working tools and an understanding of when more tools help vs. hurt.

**Prerequisites for participants**

- M05 study guide read (theory + readings)
- Claude Code installed and authenticated
- Access to at least one external system you want to integrate:
  - GitHub repository (most common)
  - PostgreSQL database (or other primary data store)
  - Team tool (Slack, Linear, Jira, Notion)
- OAuth credentials or API tokens ready (will be stored securely locally)
- MCP registry access (https://registry.mcp.ai)

**Session overview**

| Segment | Activity | Format | Duration |
|---|---|---|---|
| 1 | MCP Architecture Overview | Whiteboard visualization + discussion | 10 min |
| 2 | Connect Your First MCP Server | Hands-on installation + testing | 15 min |
| 3 | Observe Tool Selection and Failure | Live demo of good/ambiguous/poor choices | 15 min |
| 4 | Design a Custom MCP Tool | Group discussion on task-focused design | 10 min |
| — | Hands-on Exercise | End-to-end agent task with real tools | 50 min |
| — | Debrief | Group reflection | 5 min |

---

## Segment 1 — MCP Architecture Overview (10 min)

**Objective**: Understand how agents and tools interact.

**Facilitation**:

1. **Agent Loop Visualization** (3 min)
   - Draw the loop on a whiteboard:
     - Agent observes state (conversation + available tools)
     - Agent plans next action
     - Agent selects a tool
     - Tool executes (API call, database query)
     - Results come back
     - Repeat
   - Discuss: "This is what's happening when you ask Claude to do something complex."

2. **JSON-RPC Protocol Overview** (4 min)
   - Show an example MCP request/response (from the module)
   - Explain: "It's just JSON back-and-forth. Claude Code is the client, tools are servers."
   - No deep technical knowledge required; just understand the concept

3. **Tool Discovery** (3 min)
   - Show the MCP Registry
   - Discuss: "These are the tools available. Quality varies. Some are wrappers around APIs; others are native semantic tools."

---

## Segment 2 — Connect Your First MCP Server (15 min)

**Objective**: Hands-on experience with MCP setup.

**Setup**:

Choose 1–2 tools from the registry that are relevant to the team. Examples:
- **GitHub MCP**: For version control access
- **PostgreSQL MCP**: For database access (if you have a Postgres DB)
- **Linear MCP**: For project management (if your team uses Linear)
- **Slack MCP**: For team communication (if your team uses Slack)

**Facilitation**:

1. **Choose the First Tool** (2 min)
   - Group decides: "What's the most useful tool for our team?"
   - Likely: GitHub (almost everyone has it)

2. **Install and Connect** (8 min)
   - Follow the tool's MCP setup instructions (usually via CLI)
   - Example for GitHub MCP:
     ```bash
     npm install -g @modelcontextprotocol/server-github
     # Configure with GitHub credentials
     claude /mcp connect github
     ```
   - If auth is required, complete OAuth flow
   - Verify: `/mcp` shows the tool in the list

3. **Test the Tool** (5 min)
   - Open Claude Code
   - Ask: "List my GitHub repositories."
   - Claude uses the GitHub MCP to fetch real data
   - Observe: Claude now has access to actual information, not guesses
   - Lesson: "Agents stop hallucinating when they can access real data."

---

## Segment 3 — Observe Tool Selection and Failure (15 min)

**Objective**: Understand when agents make good vs. bad tool choices.

**Facilitation**:

1. **Good Tool Choice** (5 min)
   - Connect 2–3 tools (GitHub + your database + Slack, e.g.)
   - Ask Claude a task that requires one specific tool:
     - "Show me the top 5 most recent commits in our main repository."
     - Claude picks GitHub MCP, fetches data, answers correctly
   - Discuss: "The task was clear, the tool was obvious. Claude got it right."

2. **Ambiguous Task** (5 min)
   - Ask a task that *could* use multiple tools:
     - "What's the status of our deployment pipeline? Show me recent commits and recent errors."
     - Claude might:
       - Pick GitHub (see commits)
       - Or pick monitoring tool (see errors)
       - Or try both
   - Observe: Claude's tool selection depends on how well it understands the semantics of each tool
   - Discussion: "If the tools had clearer names or better descriptions, Claude would choose more reliably."

3. **Too Many Tools** (5 min)
   - Disconnect some tools, leaving only the most relevant ones
   - Repeat the earlier task
   - Discuss: "With fewer tools, Claude was faster. With more tools, it was slower and less confident."
   - Lesson: **Curated tools > lots of tools**

---

## Segment 4 — Design a Custom MCP Tool (10 min)

**Objective**: Think about how to create tools that agents use well.

**Facilitation**:

1. **Identify a Team Need** (3 min)
   - Group discusses: "What's a recurring task Claude should be able to do?"
   - Examples:
     - Deploy a service to staging
     - Get the status of all open support tickets
     - Trigger a data export

2. **Design the Tool** (4 min)
   - Discuss: How should this tool work?
   - Good design:
     - Name: `deploy_to_staging(service_name)`
     - Inputs: Just what's needed (service name, version, environment)
     - Output: Clear success/failure, with status
     - Semantic meaning: The agent understands what it does
   - Bad design:
     - Raw REST API endpoint: `POST /api/v1/system/orchestration/resources/deployment`
     - Vague inputs and outputs
     - Requires the agent to reverse-engineer semantics

3. **Lesson** (3 min)
   - "Custom MCP tools are most useful when they're task-focused, not API-focused. The tool names and descriptions should be immediately understandable to an AI agent (and a human reviewing the agent's work)."

---

## Hands-on Exercise: End-to-End Agent Task

**Objective**: Experience agent tool selection and iteration on a realistic task.

**Setup** (5 min):

Pick a realistic task that requires tool access. Examples:
- "Find all open issues in our GitHub repo tagged 'bug', summarize them, and create a tracking document."
- "Check the status of the last 5 database deployments and alert me if any failed."
- "Get the last week's worth of error logs and identify the top 5 most common errors."

**Steps** (50 min):

1. **Connect Relevant Tools** (10 min)
   - Identify which tools the agent will need (GitHub, databases, monitoring, etc.)
   - Connect them: `/mcp connect [tool]`
   - Verify: `/mcp` shows all connected tools

2. **Craft the Task Request** (10 min)
   - Be specific about what you want: "Find all issues tagged 'bug' that were opened in the last 7 days. For each, extract: title, description, assigned person. Format as a markdown table."
   - This specificity helps the agent choose the right tool
   - Enter Plan Mode (Shift+Tab) if the task is complex
   - Claude should show you its plan before executing

3. **Observe Tool Selection** (15 min)
   - Run the task
   - Watch Claude's tool calls (each tool call is logged)
   - Discuss: "Did Claude pick the right tools? Did it make the right sequence of calls?"
   - If Claude made a mistake: "What went wrong? Did the tool fail, or did Claude misunderstand the task?"

4. **Iterate and Refine** (10 min)
   - If the first attempt didn't work, refine the request
   - Provide more context: "We're looking for bugs that impact customers, so filter for issues with more than 10 comments."
   - Claude's second attempt is usually better (it learned from the first)

5. **Verify and Complete** (5 min)
   - Once Claude's output is correct, discuss what happened
   - Tool selection, error handling, iteration
   - Outcome: A real task, completed via agent tool access

---

## Debrief Questions

1. **"Did Claude pick the right tool on the first try, or did it need refinement? What made the difference?"** — Look for: understanding that clear, specific requests lead to better tool selection

2. **"When did you feel tempted to add more tools, and when did adding tools actually slow Claude down?"** — Look for: awareness of the tradeoff between capability and tool confusion

3. **"Which tool's output was most useful, and which tool felt redundant?"** — Look for: thinking about which integrations actually drive value vs. nice-to-haves

4. **"If we wanted to add a custom MCP tool for our team's workflow, what would it do, and how would you design it to avoid ambiguity?"** — Look for: understanding of task-focused vs. API-focused tool design

5. **"How does agent tool access change what you expect Claude to be able to do that it couldn't before?"** — Look for: recognition that agents with real tool access stop hallucinating

---

## Common Issues

**Participant OAuth flow fails or credentials rejected**

This is common with API keys and OAuth tokens. Troubleshoot:
1. Verify the credentials are correct (not expired, not revoked)
2. Check that the token has the right scopes (e.g., GitHub token needs `repo` and `read:org` scopes)
3. Try disconnecting and reconnecting: `/mcp disconnect [tool]` then `/mcp connect [tool]`
4. If all else fails, use a different tool temporarily (e.g., try PostgreSQL instead of GitHub)

**Participant's tool is installed but `/mcp` doesn't show it**

The tool was installed globally, but Claude Code might need a restart. Ask the participant to:
1. Close Claude Code completely
2. Reopen it
3. Run `/mcp` again

If it still doesn't show, the tool's install path might not be in PATH. Have them verify with `which [tool-name]` in the terminal.

**Agent makes a tool call but gets an error back**

This is realistic and useful for learning. Discuss:
- What error did the tool return? (permission denied, not found, invalid input?)
- Did Claude handle it gracefully, or get confused?
- What could we do to prevent this error next time? (better permissions, clearer input validation)

**Participant asks: "Can we expose our entire REST API as an MCP tool?"**

Short answer: Yes, but you shouldn't. The whole point of MCP is to wrap low-level APIs in high-level semantic tools. Expose a few key operations (the ones Claude needs to understand), not all 50 endpoints. This is "APIs Don't Make Good MCP Tools" in action.

**"We don't have any external tools set up yet — is this workshop useless for us?"**

No. Walk through the design exercise (Segment 4) in depth. Discuss: What *should* you integrate? What would Claude be most useful for if it had access to your systems? Plan the first MCP tool they'll build or set up in the next 2 weeks. By the end, they've designed it even if they haven't implemented it yet.

**Participant gets permission errors on their database**

Common if the MCP tool doesn't have the right role. Discuss:
- Does the database user have SELECT (at minimum) on the tables Claude needs?
- Does the user have the right role in the database?
- Should we create a read-only MCP user instead of using the main app's credentials?

This is actually a good security teaching moment.

---

## What to Commit Before Leaving

Each participant should have:

- [ ] At least 2–3 MCP tools connected and verified working
  - [ ] GitHub (or equivalent version control)
  - [ ] One data source (database, API, or knowledge base)
  - [ ] One team tool (optional: Slack, Linear, or similar)
- [ ] Experience running a task that required tool access
- [ ] Understanding of the tradeoff between more tools and tool confusion
- [ ] A design sketch (on paper or in discussion) for a custom MCP tool their team could build
- [ ] Awareness of which `/mcp` commands to use for managing tools:
  - [ ] `/mcp` (list all)
  - [ ] `/mcp connect [tool]`
  - [ ] `/mcp disconnect [tool]`
