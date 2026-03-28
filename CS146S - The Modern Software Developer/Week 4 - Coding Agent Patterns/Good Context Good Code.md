# Good Context Leads to Good Code

**Source:** https://blog.stockapp.com/good-context-good-code/

## Overview

StockApp built an engineering culture from scratch designed around AI-native development. Their approach achieved approximately 2.5x productivity gains compared to manual methods and 2x efficiency improvements over traditional AI-enhanced development.

## Core Insight

"Good code is a side effect of good context." The methodology focuses on humans and AI progressively building and sharing context together, allowing superior software to emerge naturally.

## Five Key Principles

### 1. The Repository as Shared Workspace

The monorepo serves both humans and machines. Documentation is treated as a first-class artifact alongside code, organized into:

- Design docs (the "why" and "what")
- Implementation plans (the "how")
- API guides and localized README files
- Canonical schema files

### 2. Hierarchical Development Process

Work progresses through: design → planning → implementation → testing → review → documentation updates, allowing progressive context building at each level.

### 3. Agent-First Approach

Teams use AI for nearly every task: sounding boards, writing commit messages, updating documentation, test creation, debugging, and code improvement identification—all while maintaining human supervision.

### 4. MCP Servers and Command Integration

Model Context Protocol servers connect to Notion, Linear, AWS, databases, and GitHub, enabling agents to access real-time information for better decision-making and outcomes.

### 5. Ensemble Methods

Multiple AI models review work before human approval. Different models exhibit distinct strengths (e.g., Gemini excels at security issue detection), and diversity improves overall results.

## Notable Metrics

The team delivered 1,098 pull requests in 13 weeks—approximately 10.6 PRs per developer weekly, versus the industry standard of 1 PR per developer weekly.

## Key Takeaways

- Rich, organized documentation enables AI systems to work more effectively
- Progressive context building through hierarchical workflows improves outcomes
- AI agents handle diverse development tasks while humans maintain oversight
- Integrating multiple tools and models through MCP creates powerful decision-making
- Multiple AI models bring complementary strengths to code review and quality
- Productivity gains of 2.5x are achievable with proper context and AI-native practices
