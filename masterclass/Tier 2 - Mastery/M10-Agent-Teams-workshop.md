# M10 Workshop: Agent Teams and Parallel Orchestration

**Facilitated session | 60–75 min | Requires: M10 study guide read beforehand**

---

## Before You Start

**Prerequisites for participants**
- M10 study guide completed (theory + readings)
- Claude Code v2.1.32+ installed
- A real multi-component project, or willingness to work with a provided example
- Understanding of subagents and single-session workflows (M09 completion recommended)
- Ability to enable experimental features in Claude Code

**What this session does**
The theory explains the mechanism and cost-benefit analysis. This workshop makes it tangible. Participants will design a multi-component task, enable Agent Teams, run a real coordinated workflow, and analyze whether parallelism actually saves time given the 7x token multiplier. By the end, everyone has made an informed decision about when to use teams vs. /batch vs. single session.

**Facilitator preparation**
- Have a multi-component project ready to demo (or use the provided User Profile Management example)
- Pre-enable Agent Teams on your machine to verify settings syntax
- Have a cost calculator ready (or the token calculator from the study guide)
- Prepare a "deliberately bad task breakdown" to show when teams fail (sequential dependencies)

---

## Session Plan

| Segment | Activity | Time |
|---|---|---|
| 1 | Enable Agent Teams feature | 5 min |
| 2 | Design a multi-component task | 10 min |
| 3 | Create a team orchestration skill | 15 min |
| 4 | Run a real Agent Teams task | 15 min |
| 5 | Cost analysis and comparison | 10 min |
| — | Debrief | 5 min |

---

## Segment 1 — Enable Agent Teams Feature (5 min)

Agent Teams is experimental in v2.1.32+. Enable it in Claude Code settings.

### Steps

**Edit `.claude/settings.json`:**

```bash
# macOS/Linux
nano ~/.claude/settings.json

# Or use your editor of choice
```

**Add this block (or update if exists):**

```json
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

**Verify:**

```bash
claude --version
# Output should be >= 2.1.32
```

### Facilitator note

While participants edit settings, don't rush. Use the time: *"In the next 60 minutes, you'll see why Agent Teams are a tool, not a default. They cost 7x more tokens. We use them only when parallelism actually saves significant time. Let's find out when that's true."*

If someone's settings syntax fails, continue with your demo. They can troubleshoot during the break.

---

## Segment 2 — Design a Multi-Component Task (10 min)

We'll build a "User Management Feature" with 4 parallel components. This is the critical thinking part: *which* tasks can truly run in parallel?

### Feature Spec

**Add user profile management to an Express.js app:**
- API endpoint: `/api/users/:id/profile` (GET, POST, PATCH)
- Frontend: `<UserProfile />` React component
- Tests: Unit + integration tests
- Docs: API documentation

### Task Breakdown (Independent, No File Conflicts)

```yaml
Tasks:
  - id: "types"
    description: "Define TypeScript types (User, Profile, UpdateProfileDTO)"
    files: ["src/types/user.ts"]
    dependencies: []
    teammate: "types-dev"
    estimated_time: "20 min"

  - id: "api"
    description: "Implement /api/users/:id/profile endpoints with validation"
    files: ["src/routes/profile.ts", "src/middleware/auth.ts"]
    dependencies: ["types"]
    teammate: "api-dev"
    estimated_time: "45 min"

  - id: "frontend"
    description: "Build UserProfile React component with form"
    files: ["src/components/UserProfile.tsx", "src/components/ProfileForm.tsx"]
    dependencies: ["types", "api"]
    teammate: "frontend-dev"
    estimated_time: "60 min"

  - id: "tests"
    description: "Write unit + integration tests"
    files: ["src/routes/profile.test.ts", "src/components/UserProfile.test.tsx"]
    dependencies: ["api", "frontend"]
    teammate: "qa-dev"
    estimated_time: "45 min"

  - id: "docs"
    description: "Write API docs (OpenAPI/Swagger)"
    files: ["docs/api.md", "openapi.yaml"]
    dependencies: ["api"]
    teammate: "docs-dev"
    estimated_time: "20 min"
```

### Key Questions to Ask the Group

1. **Are these truly independent?** (Answer: types, api, and frontend have dependencies. But docs and qa can start as soon as their dependencies finish.)
2. **What if teammates both edit `src/types/user.ts`?** (Answer: They can't. This is why clear file ownership matters.)
3. **Could we parallelize more?** (Answer: Yes—if types and api had zero dependencies, all 5 could start simultaneously. But that's unrealistic; api depends on types.)

---

## Segment 3 — Create a Team Orchestration Skill (15 min)

This skill is the contract between you and Claude. It defines how to structure a multi-component feature for teams.

### Create the Skill File

```bash
mkdir -p ~/.claude/skills
nano ~/.claude/skills/team-feature.md
```

### Paste This Content

`````yaml
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
`````

### Facilitator note

While participants create the skill, ask: *"Why would we write this as a skill instead of just typing a prompt every time?"* (Answer: Reusability, consistency, and Claude can reference the structure immediately.)

---

## Segment 4 — Run a Real Agent Teams Task (15 min)

Now the moment of truth: does Agent Teams actually work as promised?

### Create a Simplified Team Task

In Claude Code, invoke the skill:

```
/team-feature

Feature: Add user authentication endpoints
Tasks:
  1. Define Auth types (User, Token, Credentials) — no dependencies
  2. Implement POST /auth/login endpoint — depends on types
  3. Implement POST /auth/logout endpoint — depends on types
  4. Write integration tests — depends on login and logout

Ready?
```

### What Claude Will Do

1. Ask clarifying questions (e.g., "Should logout invalidate all sessions?")
2. Create a shared task list
3. Spin up 4 teammate sessions
4. Assign tasks based on dependencies
5. Coordinate work (teammates message lead with progress)
6. Report completion

### What to Observe (Facilitator Notes)

- **Does the lead coordinate effectively?** (Watch for proactive messaging vs. waiting for reports)
- **Do teammates message each other or only the lead?** (They should go through lead)
- **What happens if a task dependency isn't met?** (Teammate should wait; lead should escalate if blocker occurs)
- **How long does it take vs. your estimate?** (Usually 10-20% longer due to coordination overhead)
- **What token count does it report?** (Write it down—you'll compare to single session in Segment 5)

### Follow-Up Questions for Participants

1. *"Did Claude understand the task dependencies? Did it model them correctly?"*
2. *"What took the longest: the actual work or the coordination overhead?"*
3. *"If you had 10 tasks instead of 4, would teams still be worth it?"*

---

## Segment 5 — Cost Analysis and Comparison (10 min)

This is where teams either prove their value or fail the ROI test.

### After the Team Completes, Ask Claude

```
Show me:
1. Total tokens used by all teammates + lead
2. Estimated tokens for the same feature in a single session
3. Time taken (wall-clock)
4. Time estimate for single session
5. ROI: Is the 7x token cost justified?
```

### Expected Output (Example)

```
Token usage:
- types-dev:     ~8,000 tokens
- api-dev:       ~12,000 tokens (waits for types, then builds)
- logout-dev:    ~10,000 tokens (waits for types, then builds)
- test-dev:      ~9,000 tokens
- Lead (coord):  ~3,000 tokens
- Overlap:       ~4,000 tokens (shared context sent to all)
Total:           ~46,000 tokens

Single session equivalent: ~8,000 tokens
Cost multiplier: 5.75x

Wall-clock time:
- Agent Teams: 28 minutes
  - types: 0-8 min (parallel start)
  - api + logout: 8-20 min (parallel, after types)
  - tests: 20-28 min (after both)
- Single session: 45 minutes (sequential)
Time saved: 17 minutes

ROI analysis:
- 1 person waiting: Negative (token cost > time savings)
- 3 people waiting: Slightly positive (17 min × 3 people = 51 person-minutes saved)
- 5 people waiting: Clearly positive (17 min × 5 people = 85 person-minutes saved)
```

### Comparison Table (Facilitator Projects)

| Approach | Time | Tokens | Cost | Best For |
|---|---|---|---|---|
| Single Session | 45 min | 8,000 | 1x | Solo work, simple tasks |
| Agent Teams | 28 min | 46,000 | 5.75x | Large teams, complex features |
| /batch | 20 min | 15,000 | 1.9x | Independent changes (same pattern) |

### Key Insight to Emphasize

*"Agent Teams are not about absolute speed. They're about whether parallelism saves enough time for many people to justify the token cost. For one person: use single session. For a team of 5 waiting on one person: teams win."*

---

## Debrief (5 min)

Ask the group these four questions:

1. **"When would you choose Agent Teams over /batch or single session?"**
   - Look for: "When truly independent, no same-file edits, and parallelism saves 3+ hours"
   - Wrong answers: "Always," "for speed," "because it's cool"

2. **"What was the biggest coordination cost you observed?"**
   - Look for: "Waiting for dependencies," "messaging overhead," "merging results"

3. **"If your team was working on 10 parallel features instead of 1, would teams change the calculus?"**
   - Look for: "Yes, because 10 people waiting is more cost-saving"

4. **"What would make you NOT use Agent Teams even for a large team?"**
   - Look for: "Same-file edits," "high interdependence," "tight budget on tokens"

Close with:

> *"You now know why Agent Teams exist and exactly when they pay off. Default to single session. Use /batch for independent changes across files. Use teams only when you've done the math and parallelism actually saves time for multiple people. This judgment is what makes you effective at scale."*

---

## Hands-on Exercise: Parallel Refactoring Task (Async, 30-45 minutes)

### Challenge: Rename Function Across Codebase

**Scenario:** Your API changed `getUserById()` → `fetchUserById()`. Update all 50 callers in parallel.

### Option A: Use /batch Command (Simplest)

```bash
# Apply same change across multiple files in parallel
/batch --pattern "src/**/*.ts" --replace-all "getUserById" "fetchUserById"

# Claude handles parallelism automatically, no teams overhead
```

### Option B: Use Agent Teams (Full Control)

1. Create 5 teammates, each responsible for ~10 files
2. All changes are independent (same pattern, different files)
3. No file conflicts
4. Run in parallel

### What to Submit

1. Task breakdown (if using teams)
2. Before/after code samples
3. Token cost comparison (teams vs single session vs /batch)
4. Time comparison (wall-clock, actual measured)
5. ROI analysis: "Was using teams worth it? Why or why not?"

### Example Finding (Expected Output)

```
Refactoring: Rename getUserById → fetchUserById (50 files)

Single session approach:
  Time: 30 minutes
  Tokens: ~15,000
  Cost: 1x

Agent Teams approach (5 teams × 10 files):
  Time: 8 minutes
  Tokens: ~105,000
  Cost: 7x

/batch approach:
  Time: 5 minutes
  Tokens: ~25,000
  Cost: 1.67x

Verdict: Use /batch, not teams. Simpler, cheaper, faster.
ROI: Only use teams if you have 7+ people waiting on one person's work.
```

---

## Troubleshooting

**Team doesn't parallelize (runs sequentially anyway):**
- Check task dependencies; are they truly independent?
- Verify teammates aren't messaging each other unnecessarily (should go through lead)
- Look for implicit dependencies (both reading same file)
- Solution: Redesign tasks, or use single session

**Teammates conflict on same file:**
- Don't use teams for same-file edits; this creates merge hell
- Break task into file-disjoint pieces
- Solution: Assign clear ownership; verify no file overlap

**Token cost seems way too high:**
- Measure actual vs expected
- Consider /batch or single session instead
- Teams justified only if time saved × team size > token multiplier cost
- Solution: Do the ROI math before using teams

**Teammate gets stuck waiting:**
- Check task dependencies; maybe a blocker task is delayed
- Lead should proactively check and unblock
- Consider redesigning tasks to reduce dependencies
- Solution: Dependency visualization (draw the DAG before starting)

**Hard to merge outputs:**
- Define clear ownership (who owns which files)
- Use consistent naming, style across teammates
- Have a "merge" task after parallel work completes
- Solution: Establish merge protocol before starting

---

## Common Issues Section

**Installation or authentication fails**
If Claude Code won't start or authenticate, troubleshoot:
- Verify API key: `echo $ANTHROPIC_API_KEY`
- Check ~/.claude/config.json exists
- Try `claude --version` to verify binary is installed
- For corporate machines, you may need to run via `npm install -g @anthropic-ai/claude-code`

**Agent Teams feature not recognized**
- Verify v2.1.32+: `claude --version`
- Verify settings JSON syntax: `cat ~/.claude/settings.json`
- Restart Claude Code after changing settings
- If still missing, the feature may not be available in your tier

**Teammate sessions won't start**
- Check maxTeammates setting; default is 5
- Verify you have enough free context tokens (teammates need ~50K each)
- Try reducing task count or complexity
- Check for syntax errors in task list (YAML must be valid)

**Cost tracking is inconsistent**
- Use `/context` before and after to measure actual token usage
- Note that duplication of shared context is counted per teammate
- Large task lists themselves consume tokens (sent to all teammates)
- Solution: Keep task descriptions concise; share only necessary context

---

## References

- **Claude Code Agent Teams Documentation:** https://claude.com/docs/agent-teams
- **Parallel Task Orchestration Concepts:** https://en.wikipedia.org/wiki/Job_scheduling
- **DAG Tools for Reference:**
  - Airflow: https://airflow.apache.org/
  - Dask: https://www.dask.org/
- **Cost-Benefit Analysis Framework:** https://en.wikipedia.org/wiki/Cost%E2%80%93benefit_analysis
- **The /batch Command:** Claude Code documentation
- **M10 Study Guide:** [M10-Agent-Teams.md](M10-Agent-Teams.md)

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
