---
title: "M06: Tool Design — Workshop Guide"
description: "Build a custom TypeScript MCP server your team will actually use — from sketch to working deployment."
---

# M06: Tool Design — Workshop Guide

**Facilitated session | 60–75 min hands-on | Requires: M06 study guide read beforehand**

---

## Before You Start

**Facilitator note**
This workshop builds on the three design principles and methodology from the study guide. Participants will move from theory to implementation: they'll build a real MCP server together, test it with Claude Code, and learn to iterate based on agent behavior. Allocate 60-75 minutes for hands-on coding and testing.

**Prerequisites for participants**
- M06 study guide and pre-work theory completed
- Node.js 18+ installed and verified (`node --version`)
- TypeScript familiarity (async/await, interfaces, basic classes)
- A code editor (VS Code recommended)
- Ability to run CLI commands (bash or zsh)

**Session timing**

| Segment | Activity | Time |
|---|---|---|
| 1 | Project setup and server structure | 5 min |
| 2 | Tool definitions (3 tools) | 15 min |
| 3 | Tool implementation and logic | 25 min |
| 4 | Testing with Claude Code | 10 min |
| 5 | Iteration and refinement | 5 min |
| — | Debrief and Q&A | 10 min |

---

## Step 1: Project Setup (5 minutes)

### Context: What We're Building

You're building an MCP server for your team's internal deployment system. Instead of exposing raw deploy API endpoints, you'll design three tools:
1. `list_deployments` — query deployment history with filtering, returns CSV
2. `get_deployment_details` — get full status of one deployment, returns JSON
3. `trigger_deployment` — start a deployment with validation

These tools consolidate a larger API and return formats optimized for agent reasoning.

### Commands

```bash
mkdir mcp-deploy-server
cd mcp-deploy-server
npm init -y
npm install @modelcontextprotocol/sdk axios
npm install --save-dev typescript ts-node @types/node
npx tsc --init
```

**Facilitator tip:** While npm install runs, have participants share: "What tool in your own work could benefit from agent-friendly consolidation?" This preps them for the exercise portion.

---

## Step 2: Stub the Server Structure (10 minutes)

Create `src/index.ts`:

```typescript
import {
  Server,
  StdioServerTransport,
  Tool,
  ToolUseBlock,
  MessageParam,
} from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "deploy-server",
  version: "1.0.0",
});

// Placeholder tools array
const tools: Tool[] = [];

// Register tool definitions
server.setRequestHandler(ListToolsRequest, async () => {
  return { tools };
});

// Register tool execution
server.setRequestHandler(CallToolRequest, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "list_deployments") {
    // TODO: implement
  } else if (name === "get_deployment_details") {
    // TODO: implement
  } else if (name === "trigger_deployment") {
    // TODO: implement
  }

  return {
    content: [{ type: "text", text: "Not implemented" }],
  };
});

// Connect to stdio transport
const transport = new StdioServerTransport();
server.connect(transport);
```

This structure is the foundation. Each of the three branches will be filled in during Steps 3 and 4.

---

## Step 3: Implement Tool Definitions (15 minutes)

Add to `src/index.ts`:

```typescript
const tools: Tool[] = [
  {
    name: "list_deployments",
    description:
      "Query deployment history with optional filtering. Returns CSV format for easy scanning. Use this to find past deployments, check status history, or find a specific deployment ID.",
    inputSchema: {
      type: "object",
      properties: {
        environment: {
          type: "string",
          enum: ["prod", "staging", "dev"],
          description: "Deployment environment",
        },
        status: {
          type: "string",
          enum: ["success", "failed", "in_progress", "cancelled"],
          description: "Filter by deployment status (optional)",
        },
        limit: {
          type: "number",
          description: "Max results to return (default: 10, max: 100)",
        },
        offset: {
          type: "number",
          description: "Pagination offset (default: 0)",
        },
      },
      required: ["environment"],
    },
  },
  {
    name: "get_deployment_details",
    description:
      "Retrieve full details of a specific deployment: status, logs, timing, errors. Returns JSON. Use this when you need to understand why a deployment failed or see complete logs.",
    inputSchema: {
      type: "object",
      properties: {
        deployment_id: {
          type: "string",
          description: "The deployment ID (e.g., 'deploy-2024-03-28-001')",
        },
      },
      required: ["deployment_id"],
    },
  },
  {
    name: "trigger_deployment",
    description:
      "Start a new deployment in the specified environment. Returns deployment ID and status. Requires approval from deploy-admins group.",
    inputSchema: {
      type: "object",
      properties: {
        environment: {
          type: "string",
          enum: ["staging", "prod"],
          description: "Target environment (no dev deployments via this tool)",
        },
        version: {
          type: "string",
          description: "Git tag or commit SHA to deploy",
        },
        dry_run: {
          type: "boolean",
          description: "If true, validate but don't execute (default: false)",
        },
      },
      required: ["environment", "version"],
    },
  },
];
```

**Teaching moment:** Point out the description field in each tool. Ask: "Why is the description important? What would happen if we just said 'list deployments' vs. the full explanation with examples?" The answer: agents reason about when to use tools based on these descriptions.

---

## Step 4: Implement Tool Logic (25 minutes)

Replace the CallToolRequest handler:

```typescript
server.setRequestHandler(CallToolRequest, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "list_deployments") {
    const { environment, status, limit = 10, offset = 0 } = args;

    // Mock: in production, call your actual API
    const deployments = [
      {
        id: "deploy-2024-03-28-001",
        environment: "prod",
        status: "success",
        version: "v1.2.3",
        createdAt: "2024-03-28T10:15:00Z",
        duration: "2m 34s",
      },
      {
        id: "deploy-2024-03-28-000",
        environment: "staging",
        status: "failed",
        version: "v1.2.2",
        createdAt: "2024-03-28T09:00:00Z",
        duration: "1m 12s",
      },
      // ... more rows
    ].filter((d) => d.environment === environment && (!status || d.status === status));

    // Format as CSV for agent efficiency
    const csv = [
      "id,environment,status,version,createdAt,duration",
      ...deployments.map(
        (d) => `${d.id},${d.environment},${d.status},${d.version},${d.createdAt},${d.duration}`
      ),
    ].join("\n");

    return {
      content: [{ type: "text", text: csv }],
    };
  } else if (name === "get_deployment_details") {
    const { deployment_id } = args;

    // Mock: in production, fetch from API
    const details = {
      id: deployment_id,
      environment: "prod",
      status: "success",
      version: "v1.2.3",
      createdAt: "2024-03-28T10:15:00Z",
      completedAt: "2024-03-28T10:17:34Z",
      duration: "2m 34s",
      triggeredBy: "alice@example.com",
      logs: "✓ Health checks passed\n✓ Database migrations completed\n✓ Services restarted",
      errors: null,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(details, null, 2) }],
    };
  } else if (name === "trigger_deployment") {
    const { environment, version, dry_run = false } = args;

    // Mock: validate and create deployment
    const deploymentId = `deploy-${new Date().toISOString().split("T")[0]}-${Math.random().toString(36).substr(2, 9)}`;

    if (dry_run) {
      return {
        content: [
          {
            type: "text",
            text: `DRY RUN: Would deploy ${version} to ${environment}. No changes made.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              deployment_id: deploymentId,
              status: "in_progress",
              environment,
              version,
              createdAt: new Date().toISOString(),
            },
            null,
            2
          ),
        },
      ],
    };
  }

  return {
    content: [{ type: "text", text: `Tool ${name} not found` }],
  };
});
```

**Implementation notes:**
- `list_deployments` returns CSV (efficient, scannable format)
- `get_deployment_details` returns JSON (rich, detailed object)
- `trigger_deployment` includes a dry_run mode for safety
- Mock data is used here; in production, these would call real APIs

---

## Step 5: Test with Claude Code (10 minutes)

Compile and start the server:

```bash
npx tsc
node dist/index.js
```

In a separate terminal, in your Claude Code workspace:

```bash
# Configure MCP transport (stdio)
# Modify .claude/settings.json or create .claude/mcp.json:
{
  "mcpServers": {
    "deploy": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "disabled": false
    }
  }
}
```

Then, in Claude Code, ask:
> "List the recent deployments to prod and tell me the status of deploy-2024-03-28-001."

**Observe:**
- Does Claude use your tools correctly?
- Are the CSV and JSON outputs readable?
- Did the agent understand what each tool does?

**Facilitator guidance:** Have participants share observations. If Claude struggled to call the tools, it's likely a description clarity issue (covered in Step 6).

---

## Step 6: Iterate and Refine (5 minutes)

If the agent misunderstood a tool:
1. Rewrite its description (be more specific about when to use it)
2. Adjust output format (too verbose? switch to CSV; too terse? add more details)
3. Retest

**Common refinements:**
- Add more specific language to descriptions: "Use this when you need to..." vs "This gets..."
- If output feels too verbose, remove non-essential fields from JSON or switch to CSV
- If the agent never called a tool, it might not understand its purpose; add an example to the description

---

## Hands-on Exercise: Build Your Own Tool (Async, 30-45 minutes)

Choose one of these scenarios:

### Option A: Ticket System
Design and implement three tools for your internal ticket system:
- `search_tickets(query, project?, assignee?, status?)`
- `get_ticket_details(ticket_id)`
- `create_ticket(title, description, project, priority)`

Return search results as CSV; details as JSON.

### Option B: Database Query Tool
Design and implement:
- `query_database(sql, limit?, explain_plan?)` — returns CSV or markdown table
- `get_schema(table_name)` — returns JSON schema definition
- `list_tables(pattern?)` — returns simple text list

### Option C: AWS Resource Tool
Design and implement:
- `list_resources(resource_type, region?)` — returns CSV
- `get_resource_details(resource_id)` — returns JSON
- `apply_tag(resource_id, tag_key, tag_value)` — returns confirmation

**What to Submit:**
1. Your `src/index.ts` implementation
2. A 1-page design doc explaining:
   - How you consolidated related API functions
   - Why you chose CSV vs JSON for each tool
   - One example of an agent using your tools effectively

---

## Debrief Questions

1. **"When you were designing your tool descriptions, what changed your thinking about how agents use tools?"** Look for: clarity of purpose, when to consolidate, output format decisions.
2. **"Which of your three tools did Claude call most effectively, and why?"** Look for: connection between description quality and agent behavior.
3. **"If you were to expose these tools on your team, what would the biggest risk be?"** Look for: security (dry_run pattern), verbosity, misuse.
4. **"How would you handle a tool that's almost always called incorrectly?"** Look for: iterative refinement, description rewriting, testing with real tasks.

---

## Troubleshooting

**Agent doesn't call my tool:**
- Rewrite the description. Be specific: "Use this to..." not "This does..."
- Add an example in the description: "E.g., trigger a deployment to prod for version v1.2.3"

**Tool output is too large/verbose:**
- Switch to CSV/TSV for lists
- For JSON, include only essential fields
- Add a `summary` parameter to return brief vs detailed results

**Tools conflict with each other:**
- Rename for clarity: `list_active_deployments` not `list_deployments` (if multiple list tools exist)
- Document in the description which tool to use when

**Node/TypeScript build errors:**
- Ensure `tsconfig.json` targets ES2020+
- Ensure `@types/node` is installed
- Use `npx tsc --listFiles` to debug import issues

---

## What to Commit Before Leaving

Each participant should have:

- [ ] A working `src/index.ts` that compiles with `npx tsc`
- [ ] Server running and responding to tool calls
- [ ] Tested at least one tool call from Claude Code
- [ ] Documented any design decisions or refinements made during iteration

---

## References

- **Anthropic MCP Documentation:** https://modelcontextprotocol.io/
- **MCP TypeScript SDK:** https://github.com/modelcontextprotocol/typescript-sdk
- **Tool Design Checklist:** (From M06 study guide pre-work)
- **Context Window Budgeting:** https://docs.anthropic.com/guides/tokens/faq
- **Tool Naming Conventions:** https://developers.anthropic.com/guides/tools
