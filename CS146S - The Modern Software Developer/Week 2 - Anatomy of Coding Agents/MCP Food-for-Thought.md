# APIs Don't Make Good MCP Tools

<!-- Source: https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/ -->

**By Reilly Wood | August 5, 2025 | 4 minute read**

## Introduction

The Model Context Protocol (MCP) has become the standard for giving language models access to external tools, enabling agent capabilities. However, automatically converting existing APIs into MCP tools is increasingly common but often ineffective. This article explores why purpose-built MCP tools are superior to simple API conversions.

## Challenge 1: Agents Struggle with Large Tool Counts

Models have difficulty with accurate tool calling when presented with many options. VS Code enforces a 128-tool limit, and many models struggle with accurate tool calling well before that number. Each tool description consumes valuable context window space.

Web APIs weren't designed with these constraints—what works fine as separate API endpoints becomes problematic when mapped to individual MCP tools. Purpose-built MCP tools prove significantly more flexible, often consolidating multiple API functions into coherent, agent-friendly interfaces.

## Challenge 2: Context Window Consumption

APIs returning 100+ wide records rapidly deplete context. Record sizes vary dramatically; one might consume 100,000 tokens while another uses just 10. Additionally, JSON formatting is token-inefficient compared to alternatives.

CSV uses roughly half the tokens per record. CSV, TSV, or YAML are preferable for structured data delivery to agents, as they provide more efficient token usage while maintaining data integrity.

## Challenge 3: Limited Agent Capabilities

Auto-converted APIs miss opportunities for sophisticated tool design. Agents can process freeform instructions alongside structured data—combining search results with suggestions for subsequent tool calls, or performing RAG queries returning plain text guidance.

This flexibility in output format and integration of multiple response types is lost when APIs are mechanically converted to MCP tools without considering agent-specific design patterns.

## Alternative: Direct API Access

Modern agents like Claude Code excel at writing and executing code, including direct API calls. As agent sandboxing improves, the overhead of MCP conversion may become unnecessary for certain use cases.

This approach leverages the agent's ability to write, test, and execute code dynamically, bypassing the need for pre-built tool wrappers.

## Conclusion

Agents require tools designed for their unique capabilities and limitations, not generic API conversions. The key to effective MCP implementation is thoughtful tool design that accounts for context constraints, model limitations, and the sophisticated reasoning abilities of modern language models.