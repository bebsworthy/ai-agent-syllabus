# Writing Effective Tools for Agents — With Agents

**Source:** https://www.anthropic.com/engineering/writing-tools-for-agents

## Overview

This Anthropic engineering article explores how to develop high-quality tools for AI agents, emphasizing an iterative, evaluation-driven approach where agents themselves help optimize the tools.

## What is a Tool?

Tools represent a novel contract between deterministic systems and non-deterministic agents. Unlike traditional software functions that produce identical outputs given identical inputs, agents may call tools unpredictably or fail to use them correctly. This requires fundamentally rethinking software design principles.

## How to Write Tools

The article outlines a three-phase process:

### Phase 1: Building Prototypes

Start with quick tool implementations using Claude Code, leveraging LLM-friendly documentation. Test locally through MCP servers or Desktop extensions before wider deployment.

### Phase 2: Running Evaluations

Create realistic evaluation tasks reflecting actual workflows. Examples include:

- **Strong**: "Schedule a meeting with Jane next week to discuss our latest Acme Corp project"
- **Weak**: "Schedule a meeting with jane@acme.corp next week"

### Phase 3: Collaborating with Agents

Feed evaluation transcripts back into Claude Code to identify pain points and automatically refactor tool implementations.

## Core Principles

### Choosing Right Tools

"More tools don't always lead to better outcomes." Consolidate functionality—implement `schedule_event` rather than separate `list_users`, `list_events`, and `create_event` tools.

### Namespacing

Group related tools with prefixes like `asana_search` versus `jira_search` to reduce agent confusion.

### Meaningful Responses

Return high-signal information using semantic names rather than technical identifiers like UUIDs. Offer `response_format` parameters for flexibility between concise and detailed outputs.

### Token Efficiency

Implement pagination, filtering, and helpful error messages to guide agents toward efficient strategies.

### Prompt Engineering

Craft clear, unambiguous tool descriptions. This single improvement significantly boosted Claude's performance on benchmarks.

## Conclusion

The methodology demonstrates that agents perform best with thoughtfully designed tools developed through systematic evaluation and iterative refinement—a process where agents themselves become optimization partners.
