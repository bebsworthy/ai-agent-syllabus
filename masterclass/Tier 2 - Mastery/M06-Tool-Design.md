# M06: Tool Design — Building What Agents Can Actually Use

## Overview

Mechanical API-to-tool conversion fails. You can expose every endpoint as a separate tool, but agents struggle with large tool counts—VS Code enforces a 128-tool limit for a reason. Each tool output consumes context (JSON can be verbose; CSV/TSV is agent-efficient). Purpose-built tools combine multiple response types and consolidate related API functions into coherent interfaces.

This module teaches you *how* agents actually use tools, then walks you through designing and building a custom MCP server that respects those constraints. You'll learn when to combine functions, how to return agent-efficient formats, and how to structure tool descriptions for clear reasoning. By the end, you'll have a working MCP server your team can use for months.

**Duration:** 90 minutes (15-20 min pre-work + 60-75 min workshop + exercises)
**Hands-on:** Custom TypeScript MCP server using the Anthropic SDK
**Takeaway:** A working MCP server + design principles applied to all future tools

---

## Prerequisites

- Tier 1 completion (basic MCP understanding)
- 1-2 weeks Claude Code usage
- TypeScript fundamentals (async/await, interfaces, classes)
- Node.js 18+ installed locally
- Basic familiarity with REST APIs or internal tools

---

## Pre-work: Theory (15-20 minutes)

### Why APIs Don't Make Good MCP Tools

**The Problem:**
Naively converting an API to MCP produces many small, context-heavy tools. For example, a CRM API with 50 endpoints becomes 50 tools. Each tool call generates verbose JSON output. The agent sees this noise and makes worse decisions.

**Context Window Arithmetic:**
- One API endpoint as an MCP tool: ~200-500 tokens of context overhead (tool definition + response)
- 50 tools: 10,000+ tokens just to describe them to the agent
- Plus: JSON responses are verbose. An object with 20 fields takes 100-200 tokens per response
- Agent decision quality degrades under cognitive load

**The vs Code 128-Tool Limit:**
Not arbitrary. Beyond ~100 tools, agent latency increases exponentially and reasoning degrades. The limit is a proxy for "you're doing something wrong."

**What Agents Actually Need:**
1. **Fewer, smarter tools** (10-20 per domain, not 50)
2. **Consolidated operations** (one "search_contacts" tool that can filter, sort, paginate—not separate tools for each)
3. **Agent-efficient output formats** (CSV/TSV for lists, structured JSON only when necessary)
4. **Clear naming and descriptions** (agents read docs and decide whether to call your tool)

### Three Principles of Agent-Friendly Tools

**1. Consolidate Related Functions**
Bad: `get_user()`, `list_users()`, `search_users()`, `filter_users_by_role()` (4 tools)
Good: One `query_users()` tool with parameters: `user_id?`, `search?`, `role_filter?`, `limit`, `offset`

**2. Return Agent-Efficient Formats**
- **For lists:** CSV/TSV (compact, scannable, tool can say "returns 3 CSV rows")
- **For single objects:** Minimal JSON (only essential fields)
- **For complex structures:** Markdown tables or key-value pairs
- **Avoid:** Nested objects, verbose metadata, large arrays

**3. Combine Response Types**
A single tool can return different formats depending on context:
- `get_deployment_status()` → returns CSV for list mode, JSON for detailed mode
- Describe both modes clearly in the tool description
- Agents learn to use the right mode based on their task

### The Three-Phase Methodology

1. **Prototype:** Sketch the tool interface on paper. Ask: "What will an agent actually need?" Not "what does the API expose?"
2. **Evaluate:** Test with a real agent on real tasks. Does it reduce token consumption? Does the agent call it effectively?
3. **Refine:** Iterate based on agent behavior. If the agent misunderstands the tool, rewrite the description. If output is too verbose, switch formats.

### Tool Design Checklist

- [ ] **Naming:** Clear, verb-first (`list_`, `create_`, `update_`, `query_`, `deploy_`)
- [ ] **Consolidation:** Related API functions merged into one tool with parameters
- [ ] **Description:** 1-2 sentences explaining what it does + one example of when to use it
- [ ] **Parameters:** Minimal set; optional params clearly marked
- [ ] **Output format:** CSV/TSV for lists; minimal JSON for objects; markdown for documentation
- [ ] **Token efficiency:** Estimate context cost; aim for <100 tokens per typical response
- [ ] **Error handling:** Clear, actionable error messages
- [ ] **Pagination:** For large datasets, support `limit` and `offset`

---

## Workshop: Build Your First Custom MCP Server (60-75 minutes)

### Context: What We're Building

You're building an MCP server for your team's internal deployment system. Instead of exposing raw deploy API endpoints, you'll design three tools:
1. `list_deployments` — query deployment history with filtering, returns CSV
2. `get_deployment_details` — get full status of one deployment, returns JSON
3. `trigger_deployment` — start a deployment with validation

These tools consolidate a larger API and return formats optimized for agent reasoning.

### Step 1: Project Setup (5 minutes)

```bash
mkdir mcp-deploy-server
cd mcp-deploy-server
npm init -y
npm install @modelcontextprotocol/sdk axios
npm install --save-dev typescript ts-node @types/node
npx tsc --init
```

### Step 2: Stub the Server Structure (10 minutes)

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

### Step 3: Implement Tool Definitions (15 minutes)

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

### Step 4: Implement Tool Logic (25 minutes)

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

### Step 5: Test with Claude Code (10 minutes)

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

Observe:
- Does Claude use your tools correctly?
- Are the CSV and JSON outputs readable?
- Did the agent understand what each tool does?

### Step 6: Iterate and Refine (5 minutes)

If the agent misunderstood a tool:
1. Rewrite its description (be more specific about when to use it)
2. Adjust output format (too verbose? switch to CSV; too terse? add more details)
3. Retest

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

## Takeaway

You now own:
- ✓ A working custom MCP server (deploy, ticket, database, or AWS tool)
- ✓ Design principles: consolidation, agent-efficient formats, clear descriptions
- ✓ A reusable template for building tools your team will use

**Apply this immediately:**
- Deploy this server to your team's infrastructure
- Document the tools in your team wiki
- Use it for 1-2 weeks and gather feedback

---

## Key Concepts

**API vs MCP Tool:**
An API endpoint is a low-level interface. An MCP tool is a high-level abstraction designed for agent reasoning. They're not the same.

**Tool Consolidation:**
Merge related API operations into one tool with optional parameters. Reduces cognitive load on the agent.

**Agent-Efficient Format:**
CSV/TSV for lists (scannable, compact). Minimal JSON for objects. Markdown tables for documentation. Avoid nested structures.

**Context Window Budget:**
Every tool definition + every tool response consumes tokens. Design conservatively. A well-designed tool pays for itself in agent reasoning quality.

**Transport Types:**
- **stdio:** Best for local development and single-machine deployment
- **HTTP/SSE:** For distributed systems or Claude Code instances across a network
- **sse:** Real-time streaming; more complex but enables async workflows

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

## References

- **Anthropic MCP Documentation:** https://modelcontextprotocol.io/
- **MCP TypeScript SDK:** https://github.com/modelcontextprotocol/typescript-sdk
- **AI Agent Tool Design Best Practices:** (Anthropic internal, shared in workshop)
- **Context Window Budgeting:** https://docs.anthropic.com/guides/tokens/faq
- **Tool Naming Conventions:** https://developers.anthropic.com/guides/tools
