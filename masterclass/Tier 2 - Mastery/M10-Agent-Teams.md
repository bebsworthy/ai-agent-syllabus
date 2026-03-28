# M10: Agent Teams and Parallel Orchestration

## Overview

You've mastered single-session workflows and subagents. Now scale to coordinated teams. Agent Teams let multiple Claude sessions work in parallel on related tasks—the Team Lead (orchestrator) manages a shared task list, Teammates execute in isolation, and they message each other to coordinate.

But parallelism has a cost: 7x token consumption vs. a single session. Teams make sense for large refactors, parallel reviews, multi-component features, and cross-repo migrations. They don't make sense for sequential dependencies, same-file edits, simple tasks, or cost-sensitive work.

This module teaches you when Agent Teams add value and when simpler patterns work better. You'll enable the experimental feature (v2.1.32+), run a real multi-component task, and develop judgment about orchestration.

**Duration:** 90 minutes (15-20 min pre-work + 60-75 min workshop + exercises)
**Hands-on:** Real Agent Teams task + cost analysis + pattern comparison
**Takeaway:** Judgment about when Agent Teams pay off vs when single-session/subagent is better

---

## Prerequisites

- M09 completion (code review patterns)
- 1-2 weeks Claude Code usage
- Understanding of subagents and parallel execution
- Familiarity with task scheduling and dependencies
- Access to Claude Code v2.1.32+ (experimental Agent Teams feature)

---

## Pre-work: Theory (15-20 minutes)

### The Parallelism Stack

There's a progression from sequential to parallel execution:

| Layer | Parallelism | Cost | Best For | Worst For |
|-------|------------|------|----------|-----------|
| **Single Session** | None (sequential) | 1x | Simple tasks, quick scripts | Large, independent tasks |
| **Subagents** | Limited (serial calls within main session) | 1.3x | Role-based work (reviewer, security checker) | Truly parallel tasks |
| **Manual Parallel Sessions** | Full (you open 2 Claude Code instances) | 2x | Work that takes days (one person handles security, another does UI) | Tasks with shared state, high coordination cost |
| **Agent Teams** | Full with orchestration | 7x | Large refactors, parallel reviews, multi-component feature, cross-repo migration | Sequential dependencies, same-file edits, cost-sensitive work |
| **Alternative Orchestrators** | Full with custom logic | Varies | Specialized workflows (Multiclaude, Gas Town, OpenClaw) | Vendor lock-in risk |
| **/batch Command** | Full, independent tasks only | 2-3x | Parallel refactoring (rename function across 20 files) | Tasks with dependencies |

### Agent Teams Architecture

**Team Lead (Orchestrator):**
- Central coordinator
- Manages shared task list
- Distributes work to teammates
- Receives progress updates
- Handles inter-agent messaging

**Teammates (Workers):**
- Independent sessions (separate context windows)
- Each has its own tools, skills, hooks
- Can work on different files in parallel
- Report status back to lead
- Can message each other

**Shared Task List (Dependency-Aware):**
```yaml
Tasks:
  - id: "api_endpoint"
    description: "Create new /users endpoint with validation"
    dependencies: ["types_definition"]
    assigned_to: "api-developer"
    status: "in_progress"

  - id: "types_definition"
    description: "Define User and UserInput TypeScript types"
    dependencies: []
    assigned_to: "types-developer"
    status: "completed"

  - id: "frontend_ui"
    description: "Build UserProfile component"
    dependencies: ["api_endpoint"]
    assigned_to: "frontend-developer"
    status: "pending"

  - id: "integration_tests"
    description: "Test API → Frontend integration"
    dependencies: ["api_endpoint", "frontend_ui"]
    assigned_to: "qa-agent"
    status: "pending"
```

**Mailbox (Inter-Agent Messaging):**
Teammates message the lead:
```
api-developer → lead: "API endpoint complete. Types used: User, UserInput (v1.2)"
frontend-developer → lead: "Ready to start UI. Need: API types definition"
lead → frontend-developer: "See message from types-developer at 14:32"
```

### When Agent Teams Make Sense

**YES, use teams:**
- Large refactors (rename pattern across 500+ files)
- Parallel independent reviews (5 PRs reviewed simultaneously)
- Multi-component feature (API + UI + tests + docs, no file overlap)
- Cross-repo migration (update 10 repos in parallel)
- Complex dependency resolution (DAG of 20+ tasks)

**NO, don't use teams:**
- Sequential dependencies (B waits for A, C waits for B)
- Same-file edits (conflicts, merge pain)
- Simple tasks (<30 min of work per task)
- Cost-sensitive work (7x token cost is not justified)
- Highly interdependent logic

### Token Cost Analysis

**Single session:** ~10,000 tokens for a feature (context + reasoning + code)
**Agent Teams:** ~70,000 tokens for the same feature
- Each teammate: ~10,000 (own context window)
- Lead: ~5,000 (task list, coordination)
- Duplication: ~5,000 (shared context sent to all teammates)

**ROI threshold:** Teams pay off when parallelism saves more time than the token cost.

Example:
- Feature with 4 independent components
- Single session: 4 hours to complete sequentially
- Agent Teams: 1 hour (4 parallel) + coordination overhead
- Cost increase: 7x tokens
- Time saved: 3 hours = ~36 developer-hours saved (if 12 people waiting)
- ROI: Positive for large teams, negative for 1-2 people

---

## Workshop: Enable and Use Agent Teams (60-75 minutes)

### Step 1: Enable Experimental Feature (5 minutes)

Agent Teams is experimental in v2.1.32+. Enable it in Claude Code settings:

```bash
# .claude/settings.json
{
  "experimentalFeatures": {
    "agentTeams": {
      "enabled": true,
      "maxTeammates": 5,
      "taskListSize": 20
    }
  }
}
```

Verify:
```bash
claude --version
# Output should be >= 2.1.32
```

### Step 2: Design a Multi-Component Task (10 minutes)

We'll build a "User Management Feature" with 4 parallel components.

**Feature:** Add user profile management to an Express.js app
- API endpoint: `/api/users/:id/profile` (GET, POST, PATCH)
- Frontend: `<UserProfile />` React component
- Tests: Unit + integration tests
- Docs: API documentation

**Task breakdown (independent, no file conflicts):**

```yaml
Tasks:
  - id: "types"
    description: "Define TypeScript types (User, Profile, UpdateProfileDTO)"
    files: ["src/types/user.ts"]
    dependencies: []
    teammate: "types-dev"

  - id: "api"
    description: "Implement /api/users/:id/profile endpoints with validation"
    files: ["src/routes/profile.ts", "src/middleware/auth.ts"]
    dependencies: ["types"]
    teammate: "api-dev"

  - id: "frontend"
    description: "Build UserProfile React component with form"
    files: ["src/components/UserProfile.tsx", "src/components/ProfileForm.tsx"]
    dependencies: ["types", "api"]
    teammate: "frontend-dev"

  - id: "tests"
    description: "Write unit + integration tests"
    files: ["src/routes/profile.test.ts", "src/components/UserProfile.test.tsx"]
    dependencies: ["api", "frontend"]
    teammate: "qa-dev"

  - id: "docs"
    description: "Write API docs (OpenAPI/Swagger)"
    files: ["docs/api.md", "openapi.yaml"]
    dependencies: ["api"]
    teammate: "docs-dev"
```

### Step 3: Create a Team Orchestration Skill (15 minutes)

Create `.claude/skills/team-feature.md`:

```yaml
---
name: Team Feature
description: Orchestrate multi-component feature using Agent Teams
disable-model-invocation: false
allowed-tools: [create_task, list_tasks, assign_task, send_message_to_agent]
---

# Multi-Component Feature with Agent Teams

This skill coordinates parallel work using Agent Teams.

## Setup

1. **Enable Agent Teams** in Claude Code settings (v2.1.32+)
2. **Define your task list** (see example below)
3. **Assign teammates** to each task
4. **Start the team**

## Task Definition Format

```yaml
feature_name: "User Profile Management"
description: "Add profile management to user service"
deadline: "3 hours"

tasks:
  - id: "types"
    description: "Define User/Profile TypeScript types"
    dependencies: []
    estimated_duration: "20 min"
    assigned_to: "@types-developer"

  - id: "api"
    description: "Implement REST endpoints for profile CRUD"
    dependencies: ["types"]
    estimated_duration: "45 min"
    assigned_to: "@api-developer"

  - id: "frontend"
    description: "Build UserProfile React component"
    dependencies: ["types", "api"]
    estimated_duration: "60 min"
    assigned_to: "@frontend-developer"

  - id: "tests"
    description: "Unit + integration tests for all components"
    dependencies: ["api", "frontend"]
    estimated_duration: "45 min"
    assigned_to: "@qa-developer"
```

## Subagent Definitions

Each teammate should be a specialized subagent:

**@types-developer:** TypeScript expert
**@api-developer:** Backend/REST API specialist
**@frontend-developer:** React/UI specialist
**@qa-developer:** Testing specialist

## Workflow

1. **Define tasks** with clear dependencies
2. **Start team:** Claude orchestrates task assignment
3. **Monitor progress:** Task list shows status
4. **Handle blockers:** Lead resolves coordination issues
5. **Merge results:** Combine all outputs

## Example Session

```
Lead: "Start a team to build the user profile feature"
      "Here's the task list: [YAML above]"

[Claude creates 4 teammate sessions]

types-developer: [Creates src/types/user.ts]
api-developer:   [Waits for types, then creates API endpoints]
frontend-dev:    [Waits for types and API, then builds UI]
qa-developer:    [Waits for API and frontend, then writes tests]

Lead: [Monitors task list, facilitates messaging, unblocks as needed]

After ~2.5 hours, all tasks complete and are ready to merge.
```

## Monitoring

Use Shift+Down to cycle through teammates and see their progress in real-time.

## Cost Consideration

This feature costs ~7x tokens compared to a single session. It's justified when:
- Tasks are truly independent (no same-file edits)
- Parallelism saves 3+ hours of wall-clock time
- Team is large (multiple people waiting on one person's work)
```

### Step 4: Compare Single-Session vs Teams Approach (15 minutes)

**Single-session approach:**
```
Session: Implement user profile feature (start at 12:00 PM)
12:00-12:20: Define types (20 min)
12:20-13:05: Build API (45 min)
13:05-14:05: Build frontend (60 min)
14:05-14:50: Write tests (45 min)
Done: 2:50 PM (2 hours 50 minutes)
Tokens: ~10,000
Cost: 1x
```

**Agent Teams approach:**
```
Team start: 12:00 PM
12:00-12:20: types-dev working (20 min) ✓ api-dev waiting
12:20-13:05: api-dev working (45 min) ✓ frontend-dev waiting
            types-dev done, watching api-dev
13:05-14:05: frontend-dev working (60 min) ✓ qa-dev waiting
            api-dev done, watching frontend-dev
14:05-14:50: qa-dev working (45 min)
            frontend-dev done, watching qa-dev
Done: 2:50 PM (same!)
Tokens: ~70,000
Cost: 7x
Problem: Linear dependencies mean no parallelism gained
```

**Better task breakdown for teams (truly parallel):**
```
Team with no dependencies:
- Task 1: Refactor authentication across 5 files (1 hour) → teammate A
- Task 2: Update database schema + migrations (1 hour) → teammate B
- Task 3: Update API contracts (1 hour) → teammate C
- Task 4: Update frontend consumers (1 hour) → teammate D

Single-session: 4 hours sequential
Agent Teams: 1 hour parallel
Tokens: ~70,000
Time saved: 3 hours = Justified!
```

### Step 5: Run a Real Agent Teams Task (15 minutes)

Create a simplified team task. In Claude Code, ask:

```
/team-feature

Feature: Add user authentication endpoints
Tasks:
  1. Define Auth types (User, Token, Credentials)
  2. Implement POST /auth/login endpoint
  3. Implement POST /auth/logout endpoint
  4. Write integration tests for auth flow

Ready?
```

Claude will:
1. Ask clarifying questions
2. Create a shared task list
3. Spin up 4 teammate sessions
4. Assign tasks
5. Coordinate work
6. Report completion

**Observe:**
- How does the lead coordinate?
- Do teammates message each other or only the lead?
- What happens if a task dependency isn't met?
- How long does it take vs. single session?

### Step 6: Cost Analysis (5 minutes)

After the team completes:

```
Token usage:
- types-dev:    ~12,000 tokens
- api-dev:      ~15,000 tokens (waits, then builds)
- test-dev:     ~10,000 tokens
- Lead (coord): ~5,000 tokens
- Overlap:      ~8,000 tokens (shared context)
Total:          ~50,000 tokens

Single session equivalent: ~8,000 tokens
Cost multiplier: 6.25x

Wall-clock time:
- Agent Teams: 2 hours (parallel)
- Single session: 4 hours (sequential)
Time saved: 2 hours

ROI: Negative if one person waiting
     Positive if 4+ people waiting on one person
```

---

## Hands-on Exercise: Parallel Refactoring Task (Async, 30-45 minutes)

### Challenge: Rename Function Across Codebase Using Teams

**Scenario:** Your API changed `getUserById()` → `fetchUserById()`. Update all 50 callers in parallel.

**Option A: Use /batch Command (Simpler, Cost-Effective)**
The `/batch` command is simpler than Agent Teams for independent tasks:

```bash
# Apply same change across multiple files in parallel
/batch --pattern "src/**/*.ts" --replace-all "getUserById" "fetchUserById"

# Claude handles parallelism automatically, no teams overhead
```

**Option B: Use Agent Teams (Full Control)**
1. Create 5 teammates, each responsible for ~10 files
2. All changes are independent (same pattern, different files)
3. No file conflicts
4. Run in parallel

**What to submit:**
1. Task breakdown (if using teams)
2. Before/after code samples
3. Token cost comparison (teams vs single session vs /batch)
4. Time comparison (how long did it actually take?)
5. ROI analysis: "Was using teams worth it?"

**Example finding:**
```
Refactoring: Rename getUserById → fetchUserById (50 files)

Single session approach:
  Time: 30 minutes
  Tokens: ~15,000
  Cost: 1x

Agent Teams approach:
  Time: 8 minutes (4 teams × 12.5 files each)
  Tokens: ~105,000
  Cost: 7x

/batch approach:
  Time: 5 minutes
  Tokens: ~25,000
  Cost: 1.67x

Verdict: Use /batch, not teams. Simpler, cheaper, faster.
```

---

## Takeaway

You now own:
- ✓ Understanding of when Agent Teams add value vs when they're overkill
- ✓ Ability to design tasks with parallel independence
- ✓ Experience running a real coordinated team
- ✓ Judgment: teams for large refactors, /batch for independent changes, single session for sequential work
- ✓ Cost-awareness: token multiplier vs time saved

**Apply immediately:**
- Don't default to teams; start with single session or /batch
- Use teams only when time saved > 7x token cost
- Practice designing tasks with genuine parallelism (no same-file conflicts)
- Build team habits: "Is parallelism justified here?"

---

## Key Concepts

**Agent Teams:**
Multiple Claude sessions (Teammates) coordinated by a Lead (Orchestrator). Each teammate has its own context window and can work in parallel on independent tasks.

**Task Dependency Graph (DAG):**
Visual or YAML representation of which tasks must complete before others can start. Agent Teams respect these dependencies.

**Teammate Isolation:**
Each teammate is a separate session with its own tools, context, and state. They communicate via messaging, not shared memory.

**Mailbox (Inter-Agent Messaging):**
Asynchronous messaging between teammates and the lead. Allows coordination without blocking.

**/batch Command:**
Simpler alternative for truly independent tasks (no coordination needed). Lower token cost, faster execution.

**Orchestrator vs Worker:**
- Orchestrator (Lead): Manages task list, resolves blockers, facilitates messaging
- Worker (Teammate): Executes assigned tasks, reports status, messages lead

**ROI Threshold:**
Teams are justified when: (Time saved in hours) × (cost per hour) > (Token multiplier × token cost)

---

## Troubleshooting

**Team doesn't parallelize (runs sequentially anyway):**
- Check task dependencies; are they truly independent?
- Verify teammates aren't messaging each other (should go through lead)
- Look for implicit dependencies (both reading same file)

**Teammates conflict on same file:**
- Don't use teams for same-file edits; use single session
- Break task into file-disjoint pieces

**Token cost seems too high:**
- Measure actual vs expected
- Consider /batch or single session instead
- Teams justified only if time saved > 7x cost

**Teammate gets stuck waiting:**
- Check task dependencies; maybe a blocker task is delayed
- Lead should proactively check and unblock
- Consider redesigning tasks to reduce dependencies

**Hard to merge outputs:**
- Define clear ownership (who owns which files)
- Use consistent naming, style across teammates
- Have a "merge" task after parallel work completes

---

## References

- **Claude Code Agent Teams Documentation:** https://claude.com/docs/agent-teams
- **LaoZhang Blog: Agent Teams Practical Guide:** https://laozhang.blog/agent-teams (hypothetical)
- **Parallel Task Orchestration:** https://en.wikipedia.org/wiki/Job_scheduling
- **DAG (Directed Acyclic Graph) Tools:**
  - Airflow: https://airflow.apache.org/
  - Dask: https://www.dask.org/
- **Alternative Orchestrators (LLM):**
  - Multiclaude: (early stage)
  - Gas Town: (early stage)
  - OpenClaw: (early stage)
- **Cost-Benefit Analysis:** https://en.wikipedia.org/wiki/Cost%E2%80%93benefit_analysis
- **The /batch Command:** Claude Code documentation

---

## Appendix: Orchestrator Checklist

Use this when deciding whether to use Agent Teams:

```
☐ Task 1: Is it truly independent? (no same-file edits)
☐ Task 2: Is it independent? (same check)
☐ Task 3: Is it independent? (same check)
...
☐ All tasks independent? YES → Parallelism possible
☐ NO → Use single session or /batch

☐ Time to complete sequentially: ___ hours
☐ Number of tasks: ___
☐ Estimated parallel time: ___ hours
☐ Time saved: ___ hours
☐ Team size waiting: ___ people
☐ Cost to team (hours × rate): $___

☐ Token multiplier (7x): Accepted?
☐ ROI positive? (time saved > token cost): YES/NO

Decision:
☐ Use Agent Teams
☐ Use /batch
☐ Use single session
```
