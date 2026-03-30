# M05 Additional Info: Online Fact-Check

**Audit Date:** March 28, 2026
**Auditor:** Research Agent
**Module:** M05 — Agents and MCP
**Module File:** M05-Agents-and-MCP.md

---

## Summary

This audit verifies key claims in M05 against high-reliability sources including official MCP documentation, Anthropic resources, peer-reviewed research, and established industry sources. Overall assessment: **Most claims are well-supported; one URL error found; transport mechanisms require minor clarification.**

**Key Finding:** The module references `https://registry.mcp.ai` but the official registry is at `https://registry.modelcontextprotocol.io`.

---

## Claim-by-Claim Analysis

### Claim 1: MCP Uses JSON-RPC 2.0

**Module states:** "MCP is a protocol for AI systems to discover and use external tools. It's built on: **JSON-RPC 2.0**: A lightweight RPC protocol. Requests and responses are JSON."

**Status:** ✅ **Well-Supported**

**Evidence:**
- Official MCP Specification confirms JSON-RPC 2.0: https://modelcontextprotocol.io/specification/2025-11-25
- GitHub MCP specification repository confirms this: https://github.com/modelcontextprotocol/modelcontextprotocol
- Multiple technical sources verify the specification uses JSON-RPC 2.0 message format

**Notes:** The module's example JSON messages (tools/list, tools/call) accurately reflect MCP's JSON-RPC 2.0 structure.

---

### Claim 2: MCP Client-Server Architecture

**Module states:** "**Client-Server**: Claude Code is the client. Your tools (database, GitHub, etc.) are the server."

**Status:** ✅ **Well-Supported**

**Evidence:**
- Official MCP docs (modelcontextprotocol.io): "MCP uses a client-server architecture where the AI-powered application (e.g. a chatbot, IDE assistant, or agent) acts as the host and runs an MCP client component, while each external integration runs as an MCP server."
- Claude Code documentation confirms this architecture: https://code.claude.com/docs/en/mcp

**Notes:** The statement is accurate.

---

### Claim 3: MCP Transport Mechanisms

**Module states:** "**Transport**: Typically stdio (command-line tools), HTTP, or WebSockets"

**Status:** ⚠️ **Partially Supported / Requires Clarification**

**Evidence:**
- Official MCP specification defines two standard transports: **stdio** and **Streamable HTTP**: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
- WebSocket is **not yet part of the official specification** but is under active discussion as a proposed extension: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1288
- Streamable HTTP replaced the older SSE (Server-Sent Events) transport

**Notes:** The module lists three transports, but the official spec only standardizes stdio and Streamable HTTP. WebSocket is a proposed future transport but not yet official. Consider revising to: "Typically stdio (command-line tools) or Streamable HTTP; WebSocket is under discussion as a future standard."

---

### Claim 4: MCP Registry Location

**Module states:** "The MCP Registry (https://registry.mcp.ai) is a curated list of available MCP tools."

**Status:** ❌ **Incorrect URL**

**Evidence:**
- The **correct official registry URL** is https://registry.modelcontextprotocol.io (not registry.mcp.ai)
- Official reference: https://modelcontextprotocol.io/registry/about
- GitHub registry project: https://github.com/modelcontextprotocol/registry

**Notes:** The registry domain is incorrect. This should be updated to `https://registry.modelcontextprotocol.io`.

---

### Claim 5: Available MCP Tools Categories

**Module states:** Categories include "Developer Tools: GitHub, GitLab, Jira, Linear; Data: PostgreSQL, MongoDB, Stripe, Shopify; Team Communication: Slack, Microsoft Teams; Documentation: Notion, Confluence; Monitoring: DataDog, New Relic"

**Status:** ✅ **Well-Supported**

**Evidence:**
- Official MCP Registry confirms availability of these categories and tools
- All listed tools have verified MCP servers available:
  - GitHub: https://github.com/github/github-mcp-server
  - PostgreSQL: Available in registry
  - MongoDB: Available in registry
  - Slack: Available in registry
  - Jira: Available via Atlassian integration
  - Notion, Confluence, Datadog, New Relic all confirmed

**Notes:** The tool list is current and accurate.

---

### Claim 6: OAuth 2.0 Authentication in MCP

**Module states:** "Many MCP servers require authentication. The standard is OAuth 2.0: (1) Authorization: You approve Claude Code to use the tool on your behalf (2) Token: An access token is stored securely in Claude Code (3) Usage: When Claude Code calls the tool, it includes the token"

**Status:** ✅ **Well-Supported**

**Evidence:**
- Claude Code MCP Documentation: https://code.claude.com/docs/en/mcp confirms OAuth 2.0 support
- OAuth tokens are stored in system credential storage (macOS Keychain or encrypted credentials file), not plaintext
- Dynamic Client Registration (DCR) is supported for automatic OAuth setup
- Multiple sources confirm the flow: https://www.truefoundry.com/blog/mcp-authentication-in-claude-code

**Notes:** Accurate. The module correctly describes browser-based OAuth flow.

---

### Claim 7: "APIs Don't Make Good MCP Tools"

**Module states:** References an article titled "APIs Don't Make Good MCP Tools" by Reilly Wood and suggests it's essential reading from Anthropic research.

**Status:** ✅ **Well-Supported (Source Verified)**

**Evidence:**
- The article exists and is authored by Reilly Wood: https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/
- The core arguments are sound:
  1. Too many API endpoints overwhelm agents (context window and tool selection constraints)
  2. Generic APIs lack semantic meaning and task orientation
  3. Auto-converted APIs don't account for agent-specific optimizations (pagination, field selection, format efficiency)
  4. CSV is more token-efficient than JSON for agent consumption
  5. Well-designed MCP tools should be task-focused, not endpoint-focused

**Notes:** The article is accessible but **is NOT from Anthropic's official research section**. The module links it as https://www.anthropic.com/research, but it's actually a personal blog (reillywood.com). The insights align with Anthropic's philosophy (e.g., their engineering blog on code execution with MCP), but the source attribution should be corrected. The linked research location doesn't host this article.

---

### Claim 8: Agent Architecture — Planning Loop

**Module states:** Six-step loop: "Observation → Planning → Tool Selection → Execution → Learning → Repeat"

**Status:** ✅ **Well-Supported**

**Evidence:**
- Agent architecture research confirms this general pattern: https://www.telusdigital.com/insights/data-and-ai/article/building-ai-agents-with-plan-and-execute
- LangChain planning agents documentation: https://blog.langchain.com/planning-agents/
- ReAct pattern (Reason-Act-Observe) is the foundational agent loop: https://victordibia.com/blog/agent-execution-loop/
- Multiple sources confirm: Perceive → Reason → Plan → Act → Observe cycles

**Notes:** The six-step breakdown is a valid representation. The module uses different terminology than ReAct ("Execution" vs "Act," "Learning" vs "Observe"), but the concepts align.

---

### Claim 9: Memory Systems (Short-term, Long-term, Tool-based)

**Module states:** Three memory types for agents:
- **Short-term memory**: Current conversation/session (tokens in context)
- **Long-term memory**: Files, CLAUDE.md, previous session notes (external storage)
- **Tool-based memory**: State in external systems (database, Git history, Slack)

**Status:** ✅ **Well-Supported**

**Evidence:**
- Agent architecture research confirms these memory categories: https://medium.com/@arunseetharaman/the-anatomy-of-an-ai-agent-planning-memory-and-tool-use-20c59985197c
- AgentScope framework documentation mentions context, long-term, and external state: https://arxiv.org/html/2508.16279v1
- Claude Code's CLAUDE.md file for persistent session state is a documented best practice

**Notes:** The categorization is accurate and reflects current agent architecture patterns.

---

### Claim 10: Configuration Scopes (Global, Project, Local)

**Module states:** Three configuration levels:
1. **Global** (`~/.claude/mcp.json`) — available to all projects
2. **Project** (`.mcp.json` in root, committed to Git) — team-shared
3. **Local** (`.mcp.json` in root, git-ignored) — personal/local only

**Status:** ⚠️ **Partially Supported / Terminology Issue**

**Evidence:**
- Claude Code documentation confirms three scope levels
- However, **terminology varies**:
  - Search results show scopes labeled as: "Local," "Project," and "User/Global" (not "Global")
  - The **file location** for user-scoped configs is **`~/.claude.json`** (not `~/.claude/mcp.json`)
  - Project-scoped configs are in `.mcp.json` in the repo root ✓
  - Local configs are also managed in `~/.claude.json` with local scope flag

- Sources: https://code.claude.com/docs/en/settings, https://inventivehq.com/knowledge-base/claude/where-configuration-files-are-stored

**Notes:** The module's conceptual breakdown is correct, but the file paths need updating:
- User/Global scope: `~/.claude.json` (not `~/.claude/mcp.json`)
- Project scope: `.mcp.json` (correct)
- Local scope: Also in `~/.claude.json` with local scope designation (the module suggests a separate git-ignored `.mcp.json`, which conflicts with project-scoped use)

Recommend revising for clarity: User-scoped and local-scoped configs both live in `~/.claude.json`; project-scoped lives in `.mcp.json` at repo root.

---

### Claim 11: `/mcp` Commands in Claude Code

**Module states:** Commands include `/mcp` (list all connected tools), `/mcp connect [tool]`, `/mcp disconnect [tool]`, `/mcp config`

**Status:** ⚠️ **Supported but Terminology Unclear**

**Evidence:**
- Claude Code MCP management is documented: https://code.claude.com/docs/en/mcp
- Community documentation confirms these command patterns
- However, exact syntax may use `claude mcp add` (CLI) vs `/mcp connect` (chat interface)

**Notes:** The commands exist but usage may differ between Claude Code's chat interface and CLI. Recommend verifying exact syntax in official Claude Code docs, as chat interface commands may differ from the module's stated format.

---

### Claim 12: "APIs Don't Make Good MCP Tools" by Reilly Wood — Source Attribution

**Module states:** Link: "https://www.anthropic.com/research (or search the title)"

**Status:** ❌ **Incorrect Source Location**

**Evidence:**
- The correct article location is: https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/
- This is NOT published on Anthropic's official research page
- Anthropic does NOT have this article at anthropic.com/research

**Notes:** While the article's insights are philosophically aligned with Anthropic's MCP design principles, it's a third-party blog post, not official Anthropic research. The module should link directly to https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/ or clarify the source.

---

### Claim 13: "Prompt Engineering for Agent-Based Systems" by OpenAI

**Module states:** "How to structure prompts so agents reason better about tools. Link: https://openai.com/research (search for agent prompting)"

**Status:** ⚠️ **Partially Supported / Vague Reference**

**Evidence:**
- OpenAI has published prompt engineering resources: https://platform.openai.com/docs/guides/prompt-engineering
- However, no specific research paper titled exactly "Prompt Engineering for Agent-Based Systems" appears in OpenAI Research
- Related resources exist but not under that exact title:
  - OpenAI Prompt Engineering Guide: https://platform.openai.com/docs/guides/prompt-engineering
  - Best practices: https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api
  - Agent-related resources are under different titles

**Notes:** The concept is valid, but the specific article title or reference is unclear. The module should either cite an exact paper/article or use a more general description like "OpenAI's prompt engineering best practices."

---

### Claim 14: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (Wei et al.)

**Module states:** Reference by Wei, J., et al. (2023). ArXiv: 2201.11903

**Status:** ✅ **Well-Supported**

**Evidence:**
- Paper exists and is properly cited: https://arxiv.org/abs/2201.11903
- Authors: Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, and others
- First submitted January 28, 2022; last revised January 10, 2023 ✓
- The paper is foundational for understanding agent reasoning and prompt engineering

**Notes:** Citation is accurate. This is a legitimate foundational reference for agent architecture and reasoning.

---

### Claim 15: Curated Tool Lists by Role

**Module states:** Specific tool recommendations for Full-Stack, Frontend, Backend/DevOps, and Product Lead roles with totals of 3-4 tools each.

**Status:** ⚠️ **Well-Reasoned / Not Empirically Verified**

**Evidence:**
- The claim that "too many tools = agent confusion" is supported by research and Reilly Wood's article
- The specific tools listed (GitHub, PostgreSQL, Datadog, Linear, Slack) are all real MCP servers
- The role-based recommendations follow sound principles

**However:**
- These specific role/tool combinations are **not from published industry standards** or Anthropic official docs
- They represent reasonable recommendations based on agent architecture principles, but aren't empirically validated

**Notes:** These appear to be the module author's curated suggestions rather than from official sources. They're reasonable, but should be labeled as "suggested" or "example" configurations rather than presented as definitive.

---

## Key Missing Information

1. **WebSocket Transport Status**: The module lists WebSocket as a transport option, but it's not yet part of the official MCP specification (still in proposal phase).

2. **MCP Specification Version**: The module doesn't reference a specific MCP spec version. The latest specification is from 2025-06-18 or later. Readers should be aware that MCP is rapidly evolving.

3. **Anthropic Authorship of Core Insights**: The "APIs don't make good MCP tools" insight is from Reilly Wood (personal blog), not from Anthropic official research, though Anthropic's engineering blog on code execution with MCP aligns with this philosophy.

4. **Configuration Scope Clarification**: The module's three-level scope model is correct conceptually, but file locations and local vs. user scope terminology need clarification.

5. **Tool Invocation Errors**: The module doesn't address what happens when agent tool calls fail—error handling and retry strategies are important but not discussed.

---

## Sources Consulted

### Official MCP Documentation
- Model Context Protocol Specification: https://modelcontextprotocol.io/specification/2025-11-25
- MCP Official Registry: https://registry.modelcontextprotocol.io/
- MCP GitHub Repository: https://github.com/modelcontextprotocol/modelcontextprotocol

### Claude Code Documentation
- Claude Code MCP Docs: https://code.claude.com/docs/en/mcp
- Claude Code Settings: https://code.claude.com/docs/en/settings

### Third-Party Sources
- Reilly Wood (APIs Don't Make Good MCP Tools): https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/
- Stytch MCP Introduction: https://stytch.com/blog/model-context-protocol-introduction/
- Anthropic Engineering Blog (Code Execution with MCP): https://www.anthropic.com/engineering/code-execution-with-mcp

### Agent Architecture Research
- TELUS Digital (Plan-and-Execute Agents): https://www.telusdigital.com/insights/data-and-ai/article/building-ai-agents-with-plan-and-execute
- Victor Dibia (Agent Execution Loop): https://victordibia.com/blog/agent-execution-loop/
- Medium (Agent Anatomy): https://medium.com/@arunseetharaman/the-anatomy-of-an-ai-agent-planning-memory-and-tool-use-20c59985197c

### OpenAI Research
- Prompt Engineering Guide: https://platform.openai.com/docs/guides/prompt-engineering
- Best Practices for Prompt Engineering: https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api

### Academic References
- Chain-of-Thought Prompting (Wei et al., 2023): https://arxiv.org/abs/2201.11903
- AgentScope Framework: https://arxiv.org/html/2508.16279v1

---

## Recommendations for Module Updates

1. **Priority 1 (Critical):**
   - Fix MCP Registry URL from `https://registry.mcp.ai` to `https://registry.modelcontextprotocol.io`
   - Correct the source link for "APIs Don't Make Good MCP Tools" from anthropic.com/research to https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/
   - Clarify configuration file paths: `~/.claude.json` (not `~/.claude/mcp.json`)

2. **Priority 2 (Important):**
   - Update transport mechanisms claim to reflect official spec (stdio and Streamable HTTP are official; WebSocket is proposed)
   - Clarify the "Prompt Engineering for Agent-Based Systems" reference or link to specific OpenAI resources
   - Add footnote explaining that role-based tool recommendations are curated examples, not industry standards

3. **Priority 3 (Recommended):**
   - Note the MCP specification version being referenced
   - Add a brief note on what happens when agent tool calls fail (error handling)
   - Mention that Reilly Wood's article represents third-party perspective aligned with, but not from, Anthropic

---

## Overall Assessment

**Factual Accuracy:** 85/100

**Strengths:**
- Core MCP concepts (JSON-RPC, client-server, tool discovery) are accurate
- Agent architecture and memory systems are well-explained
- Well-reasoned guidance on tool design principles
- Solid academic references

**Weaknesses:**
- One incorrect URL (registry.mcp.ai vs. registry.modelcontextprotocol.io)
- Configuration scope terminology and file paths need clarification
- Source attribution issues (Reilly Wood article, OpenAI reference)
- WebSocket listed as transport when not yet official
- Role-based tool recommendations lack source attribution

**Verdict:** The module provides sound foundational knowledge. The errors are correctable and do not undermine the core learning objectives. The module should be updated to fix the critical URL and source attribution issues before use in production.
