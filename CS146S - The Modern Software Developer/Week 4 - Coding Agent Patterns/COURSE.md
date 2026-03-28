# Week 4: Coding Agent Patterns — Course Notes

## Overview

Week 4 explores how to orchestrate AI coding agents effectively in real-world development environments. The focus is not on what Claude Code can do in isolation, but on the patterns, practices, and architectural decisions that transform it from a powerful tool into a reliable, production-quality component of your development workflow. This week bridges theory and practice: understanding agent autonomy levels, designing human-agent collaboration patterns, and implementing the engineering discipline that turns agentic coding into something your team can depend on.

The readings span three critical dimensions: (1) how to architect AI-native engineering cultures around AI agents, (2) the detailed best practices and capabilities of Claude Code as a platform, and (3) the underlying engineering patterns that make agents reliable at scale.

---

## Key Concepts & Learnings

### The Context-Quality Connection

One of the most profound insights across this week's materials is that **code quality is a function of context**. StockApp's engineering culture study demonstrates that "good code is a side effect of good context"—this isn't metaphorical. When agents (and developers) have rich, well-organized context about design decisions, implementation goals, testing requirements, and architectural constraints, they produce superior output. *(Source: "Good Context Good Code")*

This reframes how we think about agent orchestration. Rather than focusing solely on prompt engineering or agent autonomy, we should focus on context engineering. The monorepo becomes a shared workspace where documentation—design docs, implementation plans, API guides, and README files—are first-class artifacts treated with the same care as code itself. This creates an information environment where agents can make better decisions autonomously because they're not working blind; they're working informed.

The StockApp case study provides concrete validation: teams achieved 2.5x productivity gains using AI-native practices compared to manual development, and 2x improvements over traditional AI-assisted approaches. They delivered approximately 10.6 pull requests per developer weekly, versus the industry standard of 1 PR per developer weekly. This wasn't magical—it was the result of systematically reducing information asymmetry between humans and machines.

### Multi-Layered Engineering for Reliability

Claude Code's success isn't explained by a fundamentally superior model; it's explained by careful, layered engineering. *(Source: "Peeking Under the Hood of Claude Code")* The system doesn't rely on single points of resilience. Instead, it distributes critical patterns throughout the entire pipeline:

**Context front-loading** begins every session by establishing what the agent already knows. Rather than jumping directly into work, the system summarizes prior context and checks whether new messages indicate fresh topics. This deliberate setup phase mirrors how experienced developers approach new tasks: orient before executing.

**System-reminder tags** appear throughout the pipeline—not just in the system prompt, but embedded within user messages and tool results. This is the key insight: "tiny reminders, at the right time, change agent behavior." Instead of relying on the agent to remember instructions from the beginning of a conversation (which becomes increasingly difficult as context lengthens), the system reinforces critical objectives at decision points. When the agent is about to run a bash command, a reminder about safety appears. When the agent is making architectural decisions, context about project standards appears. This isn't nagging; it's strategic reinforcement.

**Safety validation** isn't bolt-on security; it's embedded into execution paths. Before commands run, specialized prompts extract and validate them, detecting injection attempts before they can execute. Testing verification is built into workflows rather than added afterward.

**Sub-agent architecture** delegates complex tasks to specialized agents with narrower instructions rather than expecting one agent to handle everything. Complex tasks spawn focused agents that receive conditional context based on task specifics, adapting dynamically rather than following static patterns.

This layered approach has profound implications for deployment patterns. It suggests that agent reliability doesn't come from finding the perfect prompt; it comes from building architecture that reinforces good behavior at every step.

### Designing for Agent Autonomy

The challenge of orchestrating agents is fundamentally about **managing autonomy levels**. The README identifies this as the core tension: when should you give agents full autonomy, and when should you stay in the loop? *(Source: README.md)*

Claude Code Best Practices reveals that the tool is designed to operate across an autonomy spectrum. At one extreme, agents handle fully autonomous tasks: writing tests for untested code, fixing lint errors across a project, or analyzing logs to identify anomalies. At the other, humans remain in the loop: reviewing code before merge, validating architectural decisions, or approving deployments.

The key insight is that autonomy level should be task-specific, not binary. StockApp demonstrates this in practice: agents run nearly every subtask (sounding boards, commit messages, documentation, testing, debugging), but humans maintain supervision at critical junctures. The monorepo structure and documentation-first approach actually enables *more* autonomy in low-risk tasks because the context makes those tasks lower-risk. When the codebase is well-documented and patterns are clear, agents can safely write tests or fix style issues without human review. When the context is murky, even routine tasks need oversight.

This suggests a practical framework: **invest in context quality to expand safe autonomy**. The better documented your architecture, standards, and domain logic, the more tasks can safely run unattended. Conversely, if you want maximum autonomy with minimal oversight, you must invest heavily in documentation and context.

### The MCP Multiplier Effect

Model Context Protocol (MCP) servers are presented as a force multiplier for agent effectiveness. *(Source: "Claude Best Practices")* Rather than agents working in isolation with only the codebase visible, MCP connects agents to external data sources: design docs in Google Drive, tickets in Jira, deployment information in AWS, schema definitions, and custom tooling. *(Source: "Good Context Good Code" for the specific integration examples)*

The impact is multiplicative because agents can now make decisions based on real-time information rather than stale codebase snapshots. A task to "implement the payment system" becomes infinitely more tractable if the agent can read the relevant design doc, pull the current schema, check Jira for dependencies, and access AWS to understand deployment patterns—all within a single conversation.

This also creates new workflow possibilities. Ensemble methods—multiple AI models reviewing work before human approval—become practical when models have synchronized access to shared contexts. *(Source: "Good Context Good Code")* StockApp notes that different models exhibit distinct strengths (Gemini excels at security, for instance), and diversity improves overall results. This only works if all agents share the same context.

### From Individual Tasks to Team Coordination

Claude Code supports both individual agents and multi-agent teams. The platform can spawn multiple agents working on different parts of a task simultaneously, with a lead agent coordinating work, assigning subtasks, and merging results. *(Source: "Claude Best Practices")*

This capability inverts traditional team scaling. Rather than hiring more developers, teams can decompose complex projects into task graphs, let agents work on subtasks in parallel, and focus humans on high-level coordination and decision-making. This doesn't eliminate the need for careful planning; if anything, it increases it. Decomposing work into independent subtasks is harder than writing sequential steps. But it enables teams to tackle larger problems faster.

The Agent SDK takes this further, allowing custom orchestration logic. Rather than using built-in agent patterns, teams can encode their own workflow logic: how agents request approval, how subtasks are prioritized, how results are merged, how failures are handled.

### Persistence and Continuous Learning

Claude Code doesn't start from scratch each session. The platform includes mechanisms for persistent learning: CLAUDE.md files store project-specific instructions, and auto-memory captures learnings like build commands and debugging insights. This creates institutional memory that improves over time. *(Source: "Claude Best Practices")*

This is subtle but important. Early in a project, agents need significant direction: architecture decisions, preferred libraries, testing standards, deployment procedures. As the project matures and agents (and humans) work together, the CLAUDE.md file evolves to capture these patterns. On subsequent runs, agents remember these patterns and apply them consistently. The system becomes more efficient and more reliable as it learns.

Skills and custom commands extend this further. Teams can package repeatable workflows—code review checklists, deployment procedures, debugging techniques—into commands that agents (and humans) can invoke. This formalizes institutional knowledge and makes it actionable.

### From Mono to Polyglot Surfaces

Claude Code operates across multiple surfaces—terminal, IDE, desktop app, web, mobile—but these aren't isolated implementations. They're all connected to the same underlying engine. Sessions aren't tied to a single surface; you can start work in the terminal, hand off to the desktop app for visual review, continue on mobile, or schedule recurring tasks to run overnight. *(Source: "Claude Best Practices")*

This has practical implications for team workflows. You can run long-running tasks asynchronously from the web, then pull them into your terminal for review. You can message a Slack dispatcher with a task, and it creates a desktop session. You can continue work from a phone if you need to step away from your computer. This flexibility is only possible because the system was architected with portability in mind from the beginning.

It also suggests a testing strategy: workflows should be designed to run on any surface. If a task only works in the terminal, it's not truly portable. If a task requires constant human oversight, it can't be asynchronously scheduled. This architectural constraint actually drives better workflow design.

---

## Lecture Topics

### Monday: How to Be an Agent Manager

The Monday lecture introduces the conceptual framework for orchestrating agents. Key topics include:

- **Autonomy spectrum**: Understanding when agents can work independently and when human oversight is necessary
- **Trust calibration**: Building confidence in agent output through progressive automation—starting with low-risk tasks, expanding autonomy as reliability is demonstrated
- **Review cycles**: Designing human-in-the-loop workflows that catch errors without bottlenecking progress
- **Handoff strategies**: Planning how work transitions between humans and agents, and between agent teams

The lecture positions the manager's role as **context architect** and **decision engineer**. You're not micromanaging agents; you're designing the information environments and decision frameworks they work within.

### Friday: Boris Cherney, Creator of Claude Code

Boris Cherney is the architect of Claude Code at Anthropic. His presentation shares insider perspective on:

- **Design philosophy**: Why Claude Code was built the way it was—the tradeoffs between capability, reliability, and usability
- **Real-world deployment patterns**: How Anthropic itself uses Claude Code internally
- **The roadmap**: Where agentic coding is headed and what problems remain unsolved
- **Lessons learned**: What worked, what didn't, and how thinking about agents has evolved

This session is valuable precisely because it provides the creator's intent. When you understand why Claude Code was designed with persistent instructions (CLAUDE.md), why system-reminder tags are distributed throughout the pipeline, and why multi-agent coordination is built-in, you can apply these patterns to your own agent orchestration.

---

## Practical Takeaways

### 1. Document First, Code Second

Before asking agents to write code, invest time in documentation. Write design documents that explain the "why" and "what." Write implementation plans that outline the "how." Write API guides, schema definitions, and README files for critical components.

This isn't busywork. Well-written documentation is force-multiplied by agents because they can read and reason about it efficiently. StockApp's productivity gains came directly from treating documentation as a first-class artifact. The specific files that helped most: design docs, implementation plans, API guides, and localized README files organized by feature or module.

**Practical task**: Before opening Claude Code, write a design document for the feature you're building. Make it specific: include constraints, dependencies, testing requirements, and success criteria. Then ask Claude Code to implement it. You'll see the quality difference immediately.

### 2. Create a CLAUDE.md File

This is your shared instruction set with agents. Put it in your project root. Include:

- Coding standards and style guides your team follows
- Architectural decisions and why they were made
- Preferred libraries and frameworks
- Review checklists and testing requirements
- Common debugging patterns or gotchas
- Deployment procedures and constraints

Start with what's most critical. The file evolves as you and agents work together. As you discover patterns that work, add them. As you hit bugs related to misunderstanding, add clarifications.

**Practical task**: Spend an hour creating an initial CLAUDE.md. Don't make it perfect; make it useful. Cover the top 5-10 things you find yourself explaining to new team members.

### 3. Connect Your Tools with MCP

Don't isolate agents from your development environment. Connect them to:

- Design docs (Google Drive, Notion)
- Issue tracking (Jira, Linear, GitHub Issues)
- Deployment info (AWS, Kubernetes dashboards)
- Data sources (APIs, databases with read access)
- Custom tools (internal CLIs, company-specific systems)

Each connection multiplies agent effectiveness. When an agent can read the design doc and the current tickets simultaneously, it makes better decisions faster.

**Practical task**: Identify 3 tools your team uses daily that agents should have access to. Set up MCP servers to connect them. Start with read-only access; expand as needed.

### 4. Use Ensemble Methods for Critical Code

For high-risk changes—security patches, payment systems, critical infrastructure—don't rely on a single agent's review. Run the code through multiple models, each with the same context. Different models catch different issues.

This is different from running multiple passes with the same model. It's using diversity in model strengths to improve overall quality.

**Practical task**: For your next security-critical feature, have Claude Code implement it, then ask another model (or another Claude Opus agent if available) to review with the same context. Note which issues each caught.

### 5. Build Context Front-Loading Into Your Workflows

When starting agent work on a project, don't assume the agent remembers the context from your last session. Front-load context deliberately:

- Summarize the state of the work
- Reference relevant design documents
- Explain what succeeded and what failed in previous sessions
- Point out gotchas or constraints

This mirrors how experienced developers onboard themselves: read the README, look at recent commits, check issue tracking, understand the current architecture. Don't expect agents to skip these steps.

**Practical task**: Start your next Claude Code session with a message that summarizes context: "Here's what we built last time, here are the 3 issues that came up, here's the current architecture and constraints."

### 6. Design for Progressive Autonomy

Don't start with fully autonomous agents. Start with supervised workflows:

1. **Week 1**: Agent writes code, human reviews before merge
2. **Week 2**: Agent writes code and tests, human reviews before merge
3. **Week 3**: Agent writes code, tests, and lint fixes; human reviews before merge
4. **Week 4**: Agent handles low-risk tasks independently; human reviews high-risk changes

As confidence builds and documentation improves, expand autonomy. This isn't about trust (or not just). It's about learning what works in your specific context.

**Practical task**: Plan a 4-week progression for a task you want to automate. What's the minimum viable supervised version? How will you measure success?

### 7. Invest in Sub-Agent Decomposition

For complex tasks, don't ask one agent to do everything. Decompose into subtasks:

- Task: "Build user authentication system"
- Subtasks: "Design schema and migrations" → "Implement API endpoints" → "Add rate limiting" → "Write tests" → "Document API"

Assign each to a sub-agent with focused instructions. A lead agent coordinates. This is harder to plan but faster to execute.

**Practical task**: Take a feature you're building and decompose it into 5-7 subtasks that could run in parallel. What's the dependency graph? How would a lead agent orchestrate?

---

## Key Terms & Definitions

**Agent Autonomy**: The degree to which an agent can make decisions and execute actions without human intervention. Ranges from "fully supervised" (human reviews every action) to "fully autonomous" (agent runs to completion with no human input).

**Context Front-Loading**: The practice of establishing and summarizing relevant context before starting substantial work. Reduces agent errors by ensuring it knows what it already knows.

**MCP (Model Context Protocol)**: An open standard for connecting AI tools to external data sources. Enables agents to read and interact with tools beyond the codebase.

**CLAUDE.md**: A markdown file in your project root that stores persistent instructions for Claude Code. Read at the start of every session and serves as the shared rulebook for agent behavior.

**Ensemble Methods**: Using multiple AI models to review the same work, leveraging different models' strengths to catch different categories of issues.

**Sub-Agent Architecture**: Decomposing complex tasks into subtasks handled by focused agents with narrower instructions, coordinated by a lead agent.

**System-Reminder Tags**: Critical instructions embedded throughout the agent pipeline (in system prompts, user messages, and tool results) that reinforce key behaviors at decision points.

**Review Cycle**: A human-in-the-loop workflow where agents perform work and humans approve or request changes before the work is finalized.

**Handoff Strategy**: The process and patterns for transitioning work between agents, between agents and humans, or between human and agent teams.

**Trust Calibration**: The progressive process of expanding agent autonomy based on demonstrated reliability and increasing confidence in output quality.

**Institutional Memory**: Learnings and patterns captured in persistent formats (CLAUDE.md, auto-memory, custom commands) that improve agent performance over time.

**Orchestration**: The coordination of multiple agents, tools, and decision points to accomplish complex goals beyond what a single agent could do alone.

---

## References

### Primary Course Materials

- **How Anthropic Teams Use Claude Code** (PDF). Anthropic internal case study on production use patterns. Referenced in Week 4 README.

- **Claude Code Best Practices**. https://www.anthropic.com/engineering/claude-code-best-practices. Comprehensive guide to Claude Code capabilities, architecture, and recommended patterns. Covers automation, features, tool integration, customization, agent teams, and multi-surface workflows.

- **Good Context Leads to Good Code**. https://blog.stockapp.com/good-context-good-code/. StockApp's engineering culture case study demonstrating 2.5x productivity gains through AI-native practices. Details the monorepo-as-shared-workspace approach, hierarchical development processes, and ensemble methods.

- **Peeking Under the Hood of Claude Code**. https://medium.com/@outsightai/peeking-under-the-hood-of-claude-code-70f5a94a9a62. Technical analysis of Claude Code's engineering patterns. Explains context front-loading, system-reminder distribution, safety validation, and sub-agent architecture.

### Supplementary Resources (Referenced in Week 4)

- **Awesome Claude Agents**. https://github.com/vijaythecoder/awesome-claude-agents. Community-curated repository of Claude agent examples and patterns.

- **SuperClaude Framework**. https://github.com/SuperClaude-Org/SuperClaude_Framework. Open-source framework for building custom Claude agents.

### Lecture Materials

- **Monday Lecture**: "How to Be an Agent Manager" — Foundational framework for orchestrating agent autonomy, trust calibration, review cycles, and handoff strategies.

- **Friday Lecture**: Boris Cherney, Creator of Claude Code — Insider perspective on Claude Code design philosophy, deployment patterns, roadmap, and lessons learned.

### Assignment

- **Coding with Claude Code**. https://github.com/mihail911/modern-software-dev-assignments/blob/master/week4/assignment.md. Practical exercise in using Claude Code to build features, demonstrating patterns from Week 4.

---

## Study Guide Notes

**Connecting the Readings**: This week's three main articles form a progression. "Good Context Good Code" establishes the foundational principle (context → quality). "Claude Best Practices" shows how Claude Code is built to work within that principle. "Peeking Under the Hood" explains the engineering discipline required to make that principle work reliably.

**Key Question to Explore**: How does investing time in documentation and context actually enable more autonomy? This seems counterintuitive—shouldn't writing documentation slow you down? The answer is that it shifts the bottleneck from "can the agent make good decisions?" to "how fast can the agent read and reason about context?" The latter is much faster.

**Practical Reflection**: As you read, ask yourself: What context gaps exist in your current projects? Where do you find yourself repeatedly explaining things to new developers or AI assistants? Those are places where documentation investment would pay dividends.

**Assignment Preparation**: The Friday assignment asks you to build features with Claude Code. Before starting, use patterns from "Good Context Good Code" as a template: write a design doc, create an implementation plan, set up a CLAUDE.md file, and connect relevant MCP tools. Notice how this preparation phase affects agent effectiveness.
