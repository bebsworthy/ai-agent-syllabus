# M05: Agents and MCP — What They Are, How They Reason, Why They Fail

## Overview

An agent is an AI system that plans, reasons about which tools to use, executes them, and iterates based on results. Unlike a simple prompt-response system, agents have memory and decision-making loops. MCP (Model Context Protocol) is the universal protocol that lets agents discover and use tools—databases, version control, APIs, team systems—without needing custom integrations for each one.

This module covers agent architecture (planning loops, memory systems, tool dispatch), MCP as a protocol (JSON-RPC 2.0, client-server, why it exists), and the critical insight: **APIs don't make good MCP tools**. Just because you *can* expose a database or API through MCP doesn't mean you should. Too many tools overwhelm agents; agents with poor tool discovery make bad choices; auto-converted APIs fail because they lack semantic meaning.

You'll connect 2–3 relevant MCP servers (GitHub, a database, a team tool), observe how agents discover and use tools, and learn the curated tool lists by role (full-stack, frontend, backend, DevOps, lead). By the end, you'll have working integrations your team will use daily, plus an understanding of why agent tool selection matters as much as agent reasoning.

---

## Pre-work: Theory (15–20 min)

### Agent Architecture: Planning, Memory, and Tool Dispatch

An agent is not a single function call. It's a loop:

1. **Observation**: Agent reads the current state (conversation history, context, available tools)
2. **Planning**: Agent reasons about what to do next
3. **Tool Selection**: Agent picks one or more tools to call
4. **Execution**: Tools are called (API to GitHub, database query, etc.)
5. **Learning**: Results come back; agent incorporates new information
6. **Repeat**: Loop continues until agent decides it's done

**Memory systems** vary:
- **Short-term memory**: The current conversation/session (tokens in context)
- **Long-term memory**: Files, CLAUDE.md, previous session notes (external storage)
- **Tool-based memory**: State in external systems (database, Git history, Slack)

**Tool dispatch** is the tricky part. The agent must:
- Know what tools are available (tool discovery)
- Understand what each tool does (semantic meaning)
- Decide which tool to use for the current task
- Handle failures gracefully (tool returns an error)

This is where agents fail most. If you give an agent 30 tools, it might:
- Get confused about which one to use
- Pick a plausible but wrong tool
- Oscillate between tools without making progress

---

### What is MCP? JSON-RPC 2.0, Client-Server

MCP is a protocol for AI systems to discover and use external tools. It's built on:

- **JSON-RPC 2.0**: A lightweight RPC protocol. Requests and responses are JSON.
- **Client-Server**: Claude Code is the client. Your tools (database, GitHub, etc.) are the server.
- **Transport**: Typically stdio (command-line tools), HTTP, or WebSockets

**Example MCP interaction**:

```json
// Client (Claude Code) requests a list of available tools
{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}

// Server responds
{"jsonrpc": "2.0", "id": 1, "result": {
  "tools": [
    {"name": "list_repos", "description": "List all repositories for the user"},
    {"name": "create_issue", "description": "Create a new GitHub issue"}
  ]
}}

// Client calls a tool
{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {
  "tool": "create_issue",
  "arguments": {"repo": "my-org/my-repo", "title": "Fix bug"}
}}

// Server responds with results
{"jsonrpc": "2.0", "id": 2, "result": {
  "issue_id": 123,
  "url": "https://github.com/my-org/my-repo/issues/123"
}}
```

**Why MCP exists**:

- **Eliminates fragmented integrations**: Instead of building a GitHub plugin, a Slack plugin, a database plugin, you build once to the MCP spec
- **Enables rapid tool integration**: New MCP tools are discoverable by all AI systems
- **Reduces friction**: Standardized interface means tools work consistently
- **Two-way context**: Tools can send data back to Claude, and Claude can act on it
- **Reduces hallucinations**: When Claude can *actually call* the database to verify something, instead of guessing, it gets it right

---

### MCP Registry and Tool Discovery

The MCP Registry (https://registry.mcp.ai) is a curated list of available MCP tools. Categories include:

- **Developer Tools**: GitHub, GitLab, Jira, Linear
- **Data**: PostgreSQL, MongoDB, Stripe, Shopify
- **Team Communication**: Slack, Microsoft Teams
- **Documentation**: Notion, Confluence
- **Monitoring**: DataDog, New Relic

**Tool discovery in Claude Code**: `/mcp` shows connected servers and available tools.

---

### OAuth 2.0 Authentication

Many MCP servers require authentication. The standard is OAuth 2.0:

1. **Authorization**: You approve Claude Code to use the tool on your behalf
2. **Token**: An access token is stored securely in Claude Code
3. **Usage**: When Claude Code calls the tool, it includes the token

The flow is browser-based. You approve, the token is stored, and tools work automatically afterward.

---

### The Critical Insight: APIs Don't Make Good MCP Tools

This is the most important lesson of this module.

**Problem**: Just because you *can* expose a REST API through MCP doesn't mean you should.

**Why**: APIs are designed for human-facing requests. They're often:
- Too low-level (you need 10 calls to accomplish 1 logical task)
- Ambiguous (the endpoint name doesn't convey semantic meaning)
- Brittle (agents struggle to handle edge cases and error codes)

**Example**: A PostgreSQL database exposed via MCP is useful because:
- It's a **semantic interface** (the database schema is self-documenting)
- It's **task-oriented** ("find all users with this email" is a clear query)
- It's **idempotent** (running the same query twice gives the same result)

By contrast, a generic REST API exposed as an MCP tool might:
- Require 3–5 sequential calls to accomplish 1 task
- Use vague endpoint names ("POST /api/v1/process")
- Have inconsistent error codes
- Force the agent to infer semantics from documentation

**Best practice**: Create MCP wrappers that are **task-focused**, not API-focused. Instead of exposing all 50 REST endpoints, expose high-level operations:
- `create_customer_profile(name, email, tier)`
- `get_customer_usage_summary(customer_id, date_range)`
- `apply_discount(customer_id, discount_code)`

These are operations Claude understands intuitively. An agent can reason about them.

---

### Configuration Scopes: Global, Project, Local

MCP connections can be configured at three levels:

1. **Global** (`~/.claude/mcp.json`)
   - Available to all Claude Code projects
   - Use for tools everyone needs (GitHub, databases)

2. **Project** (`.mcp.json` in project root, committed to Git)
   - Available to the team working on this project
   - Use for project-specific tools

3. **Local** (`.mcp.json` in project root, git-ignored)
   - Available only to you, on this machine
   - Use for personal tools or temporary connections

**Management**: Use `/mcp connect` and `/mcp disconnect` to manage.

---

### The Curated MCP Reference List by Role

Too many tools = agent confusion. Here's a curated list by role:

#### Full-Stack Developer
- **Version Control**: GitHub MCP
- **Database**: PostgreSQL MCP (or your primary database)
- **Monitoring**: Logs/metrics (Datadog or similar)
- Total: 3 tools

#### Frontend Developer
- **Version Control**: GitHub MCP
- **Package Manager**: npm/yarn (optional, via CLI)
- **Design**: Figma MCP (if available, for referencing designs)
- Total: 2–3 tools

#### Backend/DevOps
- **Version Control**: GitHub MCP
- **Database**: PostgreSQL MCP + Redis MCP (or primary databases)
- **Infrastructure**: AWS/GCP (if available as MCP)
- **Monitoring**: CloudWatch or Datadog MCP
- Total: 3–4 tools

#### Product Lead
- **Version Control**: GitHub MCP (for reading code, not writing)
- **Project Management**: Linear or Jira MCP
- **Collaboration**: Slack MCP (for team communication)
- Total: 3 tools

---

## Pre-work: Readings

### Essential Readings

1. **"MCP: The Universal Protocol for AI Tool Integration" (Anthropic)**
   - Official overview of MCP architecture and philosophy.
   - Link: https://modelcontextprotocol.io/

2. **"MCP Introduction" by Stytch**
   - Practical walkthrough of setting up and using MCP.
   - Link: https://stytch.com/blog/mcp/ (or search "Stytch MCP intro")

3. **"APIs Don't Make Good MCP Tools" by Reilly Wood**
   - The critical insight on tool design. Required reading.
   - Link: https://www.anthropic.com/research (or search the title)

4. **MCP Registry**
   - Browse the available tools. Get a sense of what's available.
   - Link: https://registry.mcp.ai

5. **"Prompt Engineering for Agent-Based Systems" (OpenAI)**
   - How to structure prompts so agents reason better about tools.
   - Link: https://openai.com/research (search for agent prompting)

---

## Workshop: Facilitated Hands-on (45–60 min)

### Segment 1: MCP Architecture Overview (10 min)

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

### Segment 2: Connect Your First MCP Server (15 min)

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

### Segment 3: Observe Tool Selection and Failure (15 min)

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

### Segment 4: Design a Custom MCP Tool (10 min)

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

## Takeaway

By the end of this module, you will have:

1. **Working MCP Connections** (2–3 tools)
   - Configured and verified
   - Relevant to your team's daily work
   - Examples: GitHub, database, team communication tool

2. **Understanding of Agent Architecture**
   - Planning loops: observation → plan → tool selection → execution → learning
   - Memory systems: short-term (context) and long-term (external)
   - Tool dispatch: how agents choose tools

3. **Mastery of `/mcp` Commands**
   - `/mcp` (list all connected tools)
   - `/mcp connect [tool]` (add a new tool)
   - `/mcp disconnect [tool]` (remove a tool)
   - `/mcp config` (manage settings)

4. **The Critical Insight**: APIs Don't Make Good MCP Tools
   - Task-focused tools > API-focused tools
   - Semantic clarity > raw endpoints
   - Fewer curated tools > lots of tools

5. **A Curated Tool List** for your role (from the reference lists in this module)

6. **Awareness of Tool Limitations**
   - Agents struggle with ambiguous tool semantics
   - Too many tools cause confusion and worse performance
   - Tool design matters as much as agent reasoning

---

## Key Concepts

- **Agent**: An AI system with planning loops, memory, and tool dispatch
- **MCP (Model Context Protocol)**: A universal protocol for agents to discover and use tools
- **JSON-RPC 2.0**: The underlying request-response protocol for MCP
- **Client-Server**: Claude Code is the client; tools are servers
- **Tool Discovery**: The agent's ability to see what tools are available and understand what they do
- **OAuth 2.0**: Standard authentication for MCP tools
- **Semantic Meaning**: Clear, task-focused tool operations (not raw APIs)
- **Tool Dispatch**: The agent's decision about which tool to use and when
- **MCP Registry**: The curated list of available tools
- **Configuration Scopes**: Global, project, and local MCP configuration

---

## References

- Anthropic. "Model Context Protocol (MCP)."
  - https://modelcontextprotocol.io/

- Stytch. "MCP: A Protocol for AI Tool Integration."
  - https://stytch.com/blog/mcp/ (or search)

- Wood, R. "APIs Don't Make Good MCP Tools."
  - https://www.anthropic.com/research (or search the title)

- Anthropic. "MCP Registry."
  - https://registry.mcp.ai

- OpenAI. "Prompt Engineering for Agents and Tools."
  - https://openai.com/research (search for agent prompting)

- Wei, J., et al. (2023). "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models."
  - https://arxiv.org/abs/2201.11903 (foundational for agent reasoning)

---

## Next Steps

You've completed Tier 1: Foundations. You understand:
- How LLMs work (M01)
- How to write effective prompts (M02)
- How to write clear specifications (M03)
- How to manage context for reliability (M04)
- How to connect agents and tools (M05)

Tier 2 builds on these foundations: you'll learn advanced use cases, scaling patterns, custom agent development, and organizational integration. But Tier 1 alone gets you to 80% productivity.
