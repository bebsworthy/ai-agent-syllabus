# Week 2: The Anatomy of Coding Agents — Course Notes

## Overview

This week, we move beyond understanding what coding agents are and dive deep into *how they work*. We explore the foundational architecture that brings agents to life: the planning loops that guide their reasoning, the tools that extend their capabilities, and most importantly, the **Model Context Protocol (MCP)** — the emerging standard that connects language models to external systems and tools.

The week is structured around two hands-on lectures: on Monday, we build a coding agent from scratch, understanding the mechanics of agent loops and tool dispatch. On Friday, we implement a custom MCP server, learning how to design and expose tools effectively. These concepts culminate in a comprehensive picture of modern agent architecture that prioritizes clean interfaces, thoughtful tool design, and robust connections to external systems.

Why does this matter? The ability to architect and extend agents directly impacts their effectiveness. A poorly designed agent with too many unrelated tools will falter; an agent with well-engineered tool integrations using MCP can accomplish sophisticated tasks. This week teaches you to think critically about agent design from first principles.

---

## Key Concepts & Learnings

### Understanding the Model Context Protocol (MCP)

The Model Context Protocol is a standardized framework that solves a central problem in agent development: how do we give language models consistent, reliable access to external tools and data? *(Source: "MCP Introduction")* Rather than baking integrations directly into the model or having every client implement its own tool-calling mechanisms, MCP provides a common language that both client applications and tool providers speak fluently.

Think of MCP as the API contract for agent-tool interactions. Just as USB-C simplifies connectivity across diverse devices, MCP provides a uniform method for AI models to invoke external functions, retrieve data, or use predefined prompts. *(Source: "MCP Introduction")* This matters because it eliminates fragmentation. Before MCP, every agent framework had its own way of exposing tools, making it difficult to reuse integrations across platforms. MCP changed the game by establishing a standardized interface that any client—whether it's Claude Code, VS Code, or a custom application—can use to discover and invoke tools.

The power of MCP lies in its abstraction layer. The protocol doesn't care whether a tool is a simple function call, an API request, a database query, or access to a proprietary system. As long as the tool provider implements the MCP specification, the client can work with it transparently. This enables an ecosystem where tool builders can focus on excellent tool design without worrying about client-specific implementation details.

### The Growing MCP Ecosystem and the Registry

As adoption of MCP accelerates, the community faced a new challenge: discovery and standardization. How do developers find available MCP servers? How do organizations ensure they're using vetted, maintained implementations? The MCP Registry emerged as the answer. *(Source: "Introducing the MCP Registry")*

The registry, launched in preview at https://registry.modelcontextprotocol.io, functions as a "single source of truth" for publicly available MCP servers. This centralized catalog enables tool maintainers to publish their implementations and allows clients to discover available tools. The registry uses an open-source architecture with a published OpenAPI specification, meaning organizations can build custom sub-registries atop the central one—whether public registries that augment the main catalog with curated data, or private enterprise registries that enforce internal governance and security controls.

What makes the registry particularly elegant is its ecosystem design. Rather than forcing all tools into a single interface, it accommodates both standardization and specialization. A large enterprise can maintain a private registry with tools vetted for internal use. A client provider like Anthropic can enhance the central registry data with curated recommendations for their users. Tool maintainers can publish once and have their work discoverable across all these registries. This flexibility scales MCP from individual developer use to enterprise deployment.

The registry also incorporates community-driven moderation. Developers can flag servers that violate guidelines—whether for spam, malicious code, or impersonation—creating a collaborative approach to maintaining ecosystem quality without heavy-handed centralized control. This combination of open standards and community oversight reflects the ethos of the broader AI development community.

### Securing Remote MCP Servers: Authentication and Authorization

Building an MCP server is one challenge; securing it so that only authorized users can access it is another. *(Source: "MCP Server Authentication")* The security model for remote MCP servers must balance ease of use with robust protection, particularly when servers expose sensitive tools or data.

The authentication landscape offers two primary approaches. First, public access: a server that anyone can connect to without authentication. This is suitable for tools that expose no sensitive operations—perhaps a weather API or a public data service. Second, secured access: where users authenticate before accessing tools, and permissions determine which tools they can invoke.

For secured servers, the most flexible approach leverages OAuth 2.0 providers. Organizations can choose from a broad array of identity providers: GitHub, Google, Slack, Stytch, Auth0, and WorkOS all support the OAuth 2.0 specification. Alternatively, enterprises with existing identity infrastructure can use Cloudflare Access as their identity provider, verifying credentials through established systems and enforcing access policies to determine who gains entry.

The implementation flow demonstrates practical security engineering. When deploying a server, developers create local OAuth applications for testing (pointing to `http://localhost:8788/callback`), use the MCP Inspector to verify tool access works correctly, then create production OAuth applications for live deployment domains. Session data and credentials are managed through infrastructure tools like Wrangler CLI and KV storage, ensuring secrets never appear in source code.

This authentication approach enables fine-grained control: different users can see different tool sets based on their permissions, and organizations can enforce access policies centrally rather than reimplementing security logic in every tool.

### Designing Effective MCP Tools: Form Over Function

One of the most subtle yet important insights in agent development is that not every API makes a good MCP tool. *(Source: "APIs Don't Make Good MCP Tools")* This recognition emerged from practical experience: developers were taking existing REST APIs and mechanically converting them to MCP tools, only to find the agents couldn't use them effectively.

The root problem lies in the mismatch between API design and agent design. APIs were engineered for humans writing explicit code—they value granularity, flexibility, and completeness. If an API exposes twenty separate endpoints, that's fine; a developer can call exactly the ones they need. But agents face different constraints. **Agents struggle with large tool counts.** When an agent must choose from many tools, accuracy plummets. VS Code enforces a 128-tool limit precisely because models lose precision with too many options. Each tool description consumes valuable context window space. What works as a set of separate API endpoints becomes problematic when mapped to individual MCP tools.

There's a secondary efficiency problem: **context window consumption.** APIs returning large result sets rapidly deplete an agent's working memory. A single API response containing 100+ wide records might consume thousands of tokens. JSON, while human-readable, is particularly inefficient for this use case. The same data in CSV or TSV format uses roughly half the tokens, leaving more context for the agent's reasoning.

But the deepest insight concerns capability design. **Auto-converted APIs miss opportunities for sophisticated tool design.** Purpose-built MCP tools can combine multiple response types—structured data alongside freeform guidance, search results with suggestions for follow-up tool calls, or retrieval-augmented generation (RAG) returning plain text recommendations alongside raw data. Agents can process this combined output more effectively than a string of rigid API responses.

The design lesson is clear: good MCP tools consolidate related API functions into coherent interfaces, return data in agent-efficient formats, and combine multiple response types to guide agent reasoning. They're designed for agent capabilities, not copied from existing APIs.

### Agent Architecture Foundations: Planning, Memory, and Tool Dispatch

At a deeper level, agents themselves have a characteristic architecture. *(Source: "README")* The core components include planning loops that determine what actions to take next, memory systems that maintain context across multiple steps, and tool dispatch mechanisms that route agent requests to the right integrations.

A planning loop is the agent's decision-making engine. Given a user request, the agent reasons about what it needs to do, what tools might help, and in what sequence. This isn't a simple branching decision tree—it's iterative. The agent makes a decision, observes the outcome, updates its understanding, and decides what to try next. This loop continues until the agent determines it has completed the task.

Memory is what makes this possible. Agents need to remember earlier steps and intermediate results. Short-term memory might track the current task, recent tool outputs, and the conversation so far. Long-term memory might include learned patterns, previous solutions to similar problems, or domain knowledge. The interplay between memory and planning determines whether an agent can tackle complex multi-step problems or only simple single-action requests.

Tool dispatch is the mechanism connecting planning decisions to actual execution. When an agent decides to call a tool, the dispatch system must route that request to the correct implementation, handle the response, and feed it back into the agent's memory and planning loop. MCP provides a standardized protocol for this dispatch mechanism, removing the need for custom wiring in each agent framework.

These three components—planning, memory, and tool dispatch—work in concert. A robust agent architecture gets all three right: planning algorithms that make good decisions, memory systems that preserve relevant context, and tool dispatch mechanisms that are fast, reliable, and secure.

---

## Lecture Topics

### Monday, September 29: Building a Coding Agent from Scratch

Monday's lecture walks through the mechanics of agent construction. Starting from first principles, we implement an agent loop that illustrates how planning, memory, and tool invocation work together. Through a hands-on exercise, students will:

- Implement an agent loop that accepts a user request, plans actions, invokes tools, and iterates until task completion
- Understand how tool descriptions inform the agent's decision-making
- See how tool results feed back into the agent's context for subsequent decisions
- Work with tool calling as a structured interface that bridges natural language planning and deterministic execution

The completed exercise demonstrates these concepts in working code, providing a reference implementation for how agents fundamentally operate.

### Friday, October 3: Building a Custom MCP Server

Friday's lecture applies this foundational knowledge to server implementation. Having understood how agents use tools, students now build the other side of the equation: creating tools that agents can reliably use. Through building a custom MCP server, students will:

- Implement the MCP specification to expose tools via a standardized protocol
- Design tool interfaces that agents can discover and invoke accurately
- Understand authentication and access control in the context of MCP servers
- Apply lessons from the "APIs Don't Make Good MCP Tools" article to design focused, agent-friendly tools rather than mechanical API conversions

The completed exercise creates a working MCP server that could be registered in the MCP Registry and used by any MCP-compatible client.

---

## Practical Takeaways

1. **Design Tools for Agent Cognition, Not API Completeness**: When building an MCP tool, resist the urge to expose every API endpoint as a separate tool. Consolidate related functions, return data in agent-efficient formats (CSV/TSV over JSON), and combine multiple response types when it aids agent reasoning. Good tools are purpose-built, not mechanically converted from existing APIs.

2. **Prioritize Your Tool Count**: An agent with five focused, well-designed tools will outperform an agent with fifty granular tools. Choose your tool set strategically; every tool competes for the agent's attention and context window.

3. **Leverage the MCP Registry**: When searching for existing tools, start with the MCP Registry. Its standardized discovery mechanism saves integration work. As you build tools, consider publishing them to the registry so others can benefit from your work.

4. **Secure Early, Secure Always**: Don't treat authentication as an afterthought. Use established OAuth 2.0 providers for production MCP servers. Leverage Cloudflare Access or similar solutions for enterprise identity integration. Test security locally with the MCP Inspector before deployment.

5. **Test Tool Descriptions Carefully**: The descriptions you write for your tools directly impact agent performance. Clear, concise descriptions help agents understand when to use a tool. Test with actual agents to see whether descriptions are effective, and iterate based on observed behavior.

6. **Consider Direct API Access for Simple Tasks**: Modern agents can write and execute code, including direct API calls. For simple integrations or rapid prototyping, exposing raw API access through the agent's execution environment may be more efficient than building an MCP tool. Reserve MCP tools for complex integrations that benefit from standardization.

---

## Key Terms & Definitions

**Agent Loop**: The iterative decision-making cycle where an agent receives context, plans actions, invokes tools, observes results, and repeats until task completion.

**Model Context Protocol (MCP)**: A standardized framework that establishes how language models and client applications discover, authenticate with, and invoke external tools and services.

**MCP Client**: Any application that consumes MCP servers—Claude Code, VS Code, or custom applications.

**MCP Server**: A service that implements the MCP specification and exposes tools to clients through a standardized interface.

**MCP Registry**: The centralized catalog at https://registry.modelcontextprotocol.io where MCP server maintainers publish and maintain server information, and clients discover available tools.

**Sub-Registry**: A custom registry built atop the central MCP Registry to support public marketplaces (with curated enhancements) or private enterprise governance.

**Tool Dispatch**: The mechanism routing agent requests to appropriate tool implementations and feeding responses back into the agent's planning loop.

**OAuth 2.0**: An industry-standard authentication protocol enabling secure delegation of access without sharing passwords directly.

**Context Window Consumption**: The rate at which tool output (especially large datasets) consumes the language model's limited context memory, impacting subsequent reasoning.

**Purpose-Built Tools**: MCP tools designed specifically for agent use cases, consolidating related API functions and optimizing output formats, rather than mechanical conversions of existing APIs.

---

## References

| Resource | Type | Source |
|---|---|---|
| README | Course Overview | Course materials |
| MCP Introduction | Article | [Stytch Blog](https://stytch.com/blog/model-context-protocol-introduction/) |
| Sample MCP Server Implementations | GitHub Repository | [Model Context Protocol Servers](https://github.com/modelcontextprotocol/servers) |
| MCP Server Authentication | Article | [Cloudflare Developers](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#add-authentication) |
| MCP Server SDK | GitHub Repository | [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk/tree/main?tab=readme-ov-file#server) |
| Introducing the MCP Registry | Article | [MCP Blog](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/) |
| APIs Don't Make Good MCP Tools | Article | [Reilly Wood Blog](https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/) |
| Building a coding agent from scratch | Lecture Slides & Exercise | Course materials (Mon 9/29) |
| Building a custom MCP server | Lecture Slides & Exercise | Course materials (Fri 10/3) |
| First Steps in the AI IDE | Assignment | [GitHub](https://github.com/mihail911/modern-software-dev-assignments/tree/master/week2) |
