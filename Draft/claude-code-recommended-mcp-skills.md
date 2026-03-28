# Top Recommended MCP Servers & Skills for Claude Code (2026)

A curated list of the most recommended MCP servers, plugins, and skills across the Claude Code community — sourced from r/ClaudeCode, developer blogs, the Anthropic plugin marketplace, awesome-claude-code, and community guides. Organized by category with install commands, descriptions, and practical use cases.

> **Tip:** Don't install everything at once. Start with 2–3 that match your immediate workflow, then expand. MCP Tool Search (automatic on Sonnet 4+ and Opus 4+) lazy-loads tools on demand, so you can install many servers without bloating your context — but each still adds startup time.

---

## Documentation & Knowledge Grounding

### 1. Context7
**What it does:** Fetches live, version-specific library documentation and code examples directly from source repositories into Claude's context. Covers thousands of libraries (React, Next.js, Prisma, Tailwind, Stripe, etc.). Eliminates hallucinated APIs and deprecated methods.
**Use case:** *"Implement Supabase row-level security for multi-tenant access — use context7"* → Claude fetches the actual current Supabase docs before writing code.
**Install:** `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest`
**Link:** [github.com/upstash/context7](https://github.com/upstash/context7)

### 2. Context Hub
**What it does:** Provides curated, versioned API specifications for external services (68+ APIs). Includes an agent annotation system: when Claude discovers undocumented behavior, it saves notes back for future sessions.
**Use case:** Building a Stripe integration — Claude pulls the exact current API spec instead of relying on training data.
**Install:** See [contexthub.dev](https://contexthub.dev) for setup instructions.
**Link:** [contexthub.dev](https://contexthub.dev)

### 3. Fetch MCP
**What it does:** Raw web fetching — retrieves HTML or Markdown from any URL so Claude can parse page content directly. Good for documentation pages, changelogs, or blog posts.
**Use case:** *"Fetch the migration guide at this URL and summarize the breaking changes for our version."*
**Install:** `claude mcp add fetch -- npx -y @anthropic-ai/mcp-fetch`
**Link:** [github.com/anthropics/mcp-fetch](https://github.com/anthropics/mcp-fetch)

### 4. Firecrawl MCP
**What it does:** Turns URLs into clean Markdown by stripping boilerplate, ads, and navigation. Better than raw fetch for extracting article content. Also supports site-wide crawling and mapping.
**Use case:** Crawl a competitor's docs site and extract all API reference pages into structured Markdown for analysis.
**Install:** `claude mcp add firecrawl -e FIRECRAWL_API_KEY=your-key -- npx -y firecrawl-mcp`
**Link:** [github.com/mendableai/firecrawl-mcp](https://github.com/mendableai/firecrawl-mcp)

### 5. Tavily MCP
**What it does:** Enhanced web search specifically optimized for AI agents. Returns clean, structured results with relevance scoring. Better for research tasks than Claude's built-in WebSearch.
**Use case:** *"Research how other projects implement rate limiting with Redis — use Tavily to find real implementations, not just blog posts."*
**Install:** Add `TAVILY_API_KEY` to `~/.claude/settings.json` env, then install the skill per [Tavily docs](https://tavily.com).
**Link:** [tavily.com](https://tavily.com)

---

## Code & Repository Management

### 6. GitHub MCP (Official)
**What it does:** Direct interaction with GitHub repos, PRs, issues, code search, and CI/CD workflows. Claude can review PRs, create issues, manage branches, trigger Actions, and search code across repositories — all from the terminal.
**Use case:** *"Review PR #456 for security issues and leave comments on anything flagged."*
**Install:** `claude mcp add --transport http github https://api.githubcopilot.com/mcp/`
**Link:** [github.com/github/github-mcp-server](https://github.com/github/github-mcp-server)

### 7. Linear MCP
**What it does:** Connects Claude to your Linear workspace for issue tracking. Create tickets from code discussions, search issues, update statuses, and add implementation notes — without leaving the terminal.
**Use case:** *"Create a bug ticket for the auth session timeout issue we just found and assign it to me."*
**Install:** `claude mcp add -s user --transport http linear-server https://mcp.linear.app/mcp`
**Link:** [linear.app](https://linear.app)

### 8. GitLab MCP
**What it does:** Same concept as GitHub MCP but for GitLab-hosted repos. Manage merge requests, issues, pipelines, and project wikis.
**Use case:** Teams on GitLab who need the same PR review and issue management workflow as GitHub MCP.
**Install:** See [gitlab.com/gitlab-mcp](https://gitlab.com/gitlab-mcp) for setup.

---

## Database & Data

### 9. PostgreSQL MCP
**What it does:** Natural language database queries. Claude can explore schemas, understand table relationships, run SELECT queries, and help debug data issues — all through conversation.
**Use case:** *"Show me the 10 most recent users who signed up but never completed onboarding, and explain the schema relationships."*
**Install:** `claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres`
**Link:** [github.com/modelcontextprotocol/servers/tree/main/src/postgres](https://github.com/modelcontextprotocol/servers)

### 10. Supabase MCP
**What it does:** Goes beyond raw PostgreSQL — includes Supabase-specific features like auth management, storage operations, and row-level security. Claude can create tables, configure auth, and manage file uploads.
**Use case:** *"Set up a new `invoices` table with RLS policies that restrict access to the owning organization."*
**Install:** See [supabase.com/docs/guides/getting-started/mcp](https://supabase.com/docs/guides/getting-started/mcp)
**Link:** [github.com/supabase-community/supabase-mcp](https://github.com/supabase-community/supabase-mcp)

### 11. SQLite MCP
**What it does:** Lightweight local database access. Good for prototyping, local-first apps, and working with embedded databases.
**Use case:** Exploring and querying a local SQLite database without switching to a DB client.
**Install:** `claude mcp add sqlite -- npx -y @modelcontextprotocol/server-sqlite`

---

## Browser Automation & Testing

### 12. Playwright MCP
**What it does:** Browser automation using structured accessibility trees (not screenshots). Supports Chromium, Firefox, and WebKit. Claude can navigate pages, fill forms, click buttons, run E2E tests, and extract data.
**Use case:** *"Test the complete checkout flow on our staging site and screenshot any errors."*
**Install:** `claude mcp add playwright -- npx -y @anthropic-ai/mcp-server-playwright`
**Link:** [github.com/anthropics/mcp-server-playwright](https://github.com/anthropics/mcp-server-playwright)

### 13. Puppeteer MCP
**What it does:** Chrome-specific browser automation. Navigate URLs, take screenshots, generate PDFs, fill forms, execute JavaScript. Lighter than Playwright if you only need Chrome.
**Use case:** *"Generate a PDF of our pricing page as it currently renders on mobile viewport."*
**Install:** `claude mcp add puppeteer -- npx -y @modelcontextprotocol/server-puppeteer`
**Link:** [github.com/modelcontextprotocol/servers/tree/main/src/puppeteer](https://github.com/modelcontextprotocol/servers)

---

## Monitoring & Observability

### 14. Sentry MCP
**What it does:** Connects Claude to your Sentry error monitoring. Query production errors, view full stack traces and breadcrumbs, monitor crash-free rates, and use Sentry's AI (Seer) to diagnose crashes.
**Use case:** *"Analyze the errors from the last 24 hours, group similar ones, and propose fixes for the top 3."*
**Install:** Remote OAuth server at `https://mcp.sentry.dev/mcp`
**Link:** [sentry.io](https://sentry.io)

### 15. Datadog MCP
**What it does:** Connects Claude to Datadog for querying logs, metrics, APM traces, and monitors. Useful for debugging performance issues with production data.
**Use case:** *"Pull the P99 latency for the /api/checkout endpoint over the last week and identify any spikes."*
**Link:** Check Datadog's MCP documentation for latest setup.

---

## Design & Frontend

### 16. Figma MCP
**What it does:** Bridges design and development. Claude can read Figma files, extract design tokens (colors, typography, spacing), and translate designs into code.
**Use case:** *"Extract the color palette and typography scale from our Figma design system and generate Tailwind config."*
**Link:** [github.com/nichochar/figma-mcp](https://github.com/nichochar/figma-mcp)

---

## Productivity & Communication

### 17. Notion MCP (Official)
**What it does:** Read and write to Notion workspaces. Claude can search pages, create documentation, update project notes, and maintain knowledge bases. Optimized for minimal token usage.
**Use case:** *"Create a new page in the Engineering wiki documenting the auth refactor we just completed."*
**Install:** `claude mcp add notion -e NOTION_API_TOKEN=your-token -- npx -y @makenotion/notion-mcp-server`
**Link:** [github.com/makenotion/notion-mcp-server](https://github.com/makenotion/notion-mcp-server)

### 18. Slack MCP
**What it does:** Read channels, post messages, search threads, and react to conversations. Claude can monitor discussions and integrate Slack communication into development workflows.
**Use case:** *"Search the #incidents channel for any discussion about the payment gateway outage last week."*
**Link:** [github.com/modelcontextprotocol/servers/tree/main/src/slack](https://github.com/modelcontextprotocol/servers)

---

## Infrastructure & DevOps

### 19. Docker MCP
**What it does:** Manage Docker containers from Claude. View logs, diagnose startup failures, inspect running containers, and propose fixes.
**Use case:** *"Check why the Nginx container won't start — view logs, diagnose, and propose a fix."*
**Install:** `claude mcp add docker -- npx -y @ckreiling/mcp-server-docker`
**Link:** [github.com/ckreiling/mcp-server-docker](https://github.com/ckreiling/mcp-server-docker)

### 20. AWS MCP
**What it does:** Interact with AWS services — S3, Lambda, CloudFormation, IAM. Claude can create resources, check configurations, and debug deployments.
**Use case:** *"Create an S3 bucket configured for static website hosting with the right CORS policy."*
**Link:** See [aws-mcp](https://github.com/topics/aws-mcp) for available implementations.

### 21. Vercel MCP
**What it does:** Manage Vercel deployments, check build logs, configure environment variables, and monitor deployment status directly from Claude.
**Use case:** *"Check the latest deployment status and show me the build logs if it failed."*
**Link:** [vercel.com](https://vercel.com) — OAuth-based, setup through `/mcp` in Claude Code.

---

## Filesystem & Local Tools

### 22. Filesystem MCP
**What it does:** Gives Claude controlled read/write access to specified local directories. You define which paths are accessible, maintaining security while enabling powerful file management.
**Use case:** Organizing project files, bulk renaming, searching through logs, or managing config files across projects.
**Install:** `claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects ~/Documents`
**Link:** [github.com/modelcontextprotocol/servers/tree/main/src/filesystem](https://github.com/modelcontextprotocol/servers)

### 23. Memory MCP
**What it does:** Knowledge-graph-based persistent memory. Claude can store and retrieve information across sessions — useful for maintaining context about your project, decisions, and preferences beyond a single conversation.
**Use case:** *"Remember that we decided to use Redis for session storage instead of JWT — store this decision."*
**Install:** `claude mcp add memory -- npx -y @modelcontextprotocol/server-memory`
**Link:** [github.com/modelcontextprotocol/servers/tree/main/src/memory](https://github.com/modelcontextprotocol/servers)

---

## Reasoning & Problem-Solving

### 24. Sequential Thinking MCP
**What it does:** Introduces structured, reflective reasoning. Claude works through problems step-by-step, can revise its approach mid-chain, and maintains context across extended reasoning. Especially useful for architecture decisions and complex debugging.
**Use case:** *"Think through the tradeoffs of microservices vs monolith for our scaling requirements."*
**Install:** `claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking`
**Link:** [github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking](https://github.com/modelcontextprotocol/servers)

---

## Recommended Plugins & Skills (from Anthropic Marketplace)

### 25. feature-dev (Plugin)
**What it does:** The most popular Claude Code plugin (89k+ installs). Turns a feature brief into working code via a 7-phase workflow: requirements → codebase exploration → architecture → implementation → testing → review → documentation.
**Use case:** *"/feature-dev Add a notification preferences page with email/SMS/push toggles"* → runs the full pipeline.
**Install:** `/plugin install feature-dev@claude-plugins-official`
**Link:** [claude.com/plugins/feature-dev](https://claude.com/plugins/feature-dev)

### 26. frontend-design (Skill)
**What it does:** Guides Claude through deliberate design thinking before writing UI code — purpose, tone, constraints, and differentiation. Pushes for distinctive fonts, layouts, and visual depth instead of generic AI aesthetics.
**Use case:** Any user-facing UI work where you want code that doesn't look like every other AI-generated page.
**Install:** `/plugin install frontend-design@claude-plugins-official`
**Link:** [github.com/anthropics/claude-code/tree/main/plugins/frontend-design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)

### 27. code-review (Plugin)
**What it does:** Runs four independent review agents in parallel — CLAUDE.md compliance, bug detection, git history context, and code comments. Each finding gets a confidence score (0–100); only issues above 80% threshold make the report.
**Use case:** *"/code-review"* before any PR merge — catches security issues, performance regressions, and standards violations.
**Install:** `/plugin install code-review@claude-plugins-official`

### 28. /simplify (Skill)
**What it does:** Post-implementation cleanup. Analyzes code Claude just wrote and refactors for simplicity — removes unnecessary abstractions, flattens indirection, tightens naming. The quality gate after every implementation.
**Use case:** Run after every feature implementation to catch over-engineering before it ships.
**Install:** Part of the Superpowers plugin: `/plugin install superpowers@superpowers-marketplace`
**Link:** [github.com/jessed/superpowers](https://github.com/jessed/superpowers)

### 29. Superpowers (Plugin)
**What it does:** A bundle of engineering best practices covering planning, reviewing, testing, debugging, and more. Enforces TDD workflows and structured development discipline. 42k+ GitHub stars.
**Use case:** Teams that want structured development workflows enforced automatically — not just suggested.
**Install:** `/plugin marketplace add obra/superpowers-marketplace` then `/plugin install superpowers@superpowers-marketplace`
**Link:** [github.com/jessed/superpowers](https://github.com/jessed/superpowers)

### 30. Security Guidance (Plugin)
**What it does:** Scans Claude's file edits before they happen for security vulnerabilities — command injection, XSS, unsafe input handling. Blocks risky changes and shows warnings with explanations and fix suggestions.
**Use case:** Automatic security gate on every file Claude writes, catching vulnerabilities in real-time.
**Install:** `/plugin install security-guidance@claude-plugins-official`

### 31. Ralph Loop (Skill)
**What it does:** Autonomous iteration. Give Claude a task, a completion condition, and a max iteration count — then walk away. Claude runs, tests, fixes, reruns until the condition is met or the limit is reached.
**Use case:** *"Migrate all 200 test files from Jest to Vitest — stop when all tests pass."*
**Link:** See [mindwiredai.com](https://mindwiredai.com/2026/03/12/claude-code-essential-skills-plugins-or-stop-using-claude-browser-5-skills/) for setup details.

### 32. /batch (Built-in)
**What it does:** Built into Claude Code — parallel refactoring across many files using isolated worktrees. Each unit runs independently with no context bleed.
**Use case:** *"/batch replace all lodash imports with native equivalents"* across an entire codebase.
**Invoke:** `/batch <task description>` — no installation needed.

---

## Starter Configurations by Role

| Role | Recommended Stack |
|---|---|
| **Full-stack web dev** | Context7 + GitHub MCP + Playwright + PostgreSQL + feature-dev |
| **Frontend specialist** | Context7 + Figma MCP + Playwright + frontend-design + /simplify |
| **Backend / API dev** | Context7 + GitHub MCP + PostgreSQL + Sentry + Docker MCP |
| **DevOps / Platform** | GitHub MCP + Docker MCP + AWS MCP + Vercel MCP + Linear |
| **Team lead / Reviewer** | code-review + GitHub MCP + Sentry + Linear + Superpowers |

---

*Compiled March 2026. Sources: r/ClaudeCode, awesome-claude-code, Anthropic plugin marketplace, Builder.io, TurboDocx, Firecrawl, MCPcat, ClaudeFast, and community guides.*
