# M04: Context Engineering — Workshop Guide

**Facilitated session | 45–60 min | Requires: M04 study guide read beforehand**

---

## Before You Start

**Facilitator note**

Context discipline is what separates developers who get 2x productivity from Claude from those who get 10x. The difference isn't intelligence—it's habit. This session makes context management concrete and muscle-memory. Participants will see live how conflicting context breaks Claude's reasoning, how CLAUDE.md fixes it, and how to audit their own projects. By the end, they'll commit a CLAUDE.md that will become a living document for their team.

**Prerequisites for participants**

- M04 study guide read (theory + readings)
- Claude Code installed and authenticated
- A real project codebase with actual conventions (not a tutorial project)
- Git access to the project (can commit CLAUDE.md)
- A text editor (VS Code, IDE, or simple editor)

**Session overview**

| Segment | Activity | Format | Duration |
|---|---|---|---|
| 1 | Context Poisoning Demo | Live demo + group observation | 10 min |
| 2 | CLAUDE.md Deep Dive | Group discussion + drafting | 15 min |
| 3 | Context Monitoring Exercise | Hands-on with `/context` and `/compact` | 10 min |
| 4 | Three-Phase Workflow Demo | Live demo of research → plan → implement | 10 min |
| — | Hands-on Exercise | End-to-end on a real task | 50 min |
| — | Debrief | Group discussion | 5 min |

---

## Segment 1 — Context Poisoning Demo (10 min)

**Objective**: Show how conflicting context degrades performance.

**Setup**:

Use a real (or realistic) scenario: The codebase has two different error handling patterns (old and new), and CLAUDE.md mentions neither.

**Activity**:

1. **High-Context, Low-Signal** (3 min)
   - Load the project without a CLAUDE.md
   - Ask Claude: "What's the error handling pattern?"
   - Claude sees both patterns, is uncertain: "It looks like you use both { error: "..." } and throw new Error()..."
   - Ask Claude to implement an error handler: It might mix patterns
   - Outcome: Confusion

2. **Curated Context** (3 min)
   - Create a minimal CLAUDE.md: "Error handling: Always return { success: false, error: "message", code: "CODE" }. Never throw."
   - Ask Claude the same questions
   - Claude is confident and consistent
   - Ask Claude to implement: It follows the spec
   - Outcome: Reliability

3. **Lesson** (4 min)
   - "Smaller, curated context > larger, noisy context"
   - "CLAUDE.md is the antidote to confusion"

---

## Segment 2 — CLAUDE.md Deep Dive (15 min)

**Objective**: Create and refine a CLAUDE.md for a real project.

**Facilitation**:

1. **Audit Current Conventions** (5 min)
   - Group discusses: "What are the actual conventions in this codebase?"
   - Facilitator captures:
     - Error handling pattern
     - Async/await vs. callbacks vs. promises
     - Where validation happens
     - Naming conventions (camelCase, snake_case)
     - Where to put new code
     - Security rules (SQL parameterization, auth checks)
     - Testing requirements

2. **Draft CLAUDE.md** (5 min)
   - Facilitator structures the conventions into CLAUDE.md format:
     - Overview + tech stack
     - Key files and purpose
     - Conventions (5–10 key ones)
     - Recent changes
     - Common mistakes
     - Testing requirements
     - Deployment info
   - Group reviews: "Are these accurate? Are they complete?"

3. **Commit to Repo** (5 min)
   - Save CLAUDE.md to the project root
   - Commit to Git: `git add CLAUDE.md && git commit -m "Add CLAUDE.md with project conventions"`
   - Outcome: A living document that Claude and humans both reference

---

## Segment 3 — Context Monitoring Exercise (10 min)

**Objective**: Hands-on with context commands.

**Facilitation**:

1. **Load a Real Codebase** (2 min)
   - Open Claude Code in the project
   - `/init` to create/update CLAUDE.md

2. **Check Context** (2 min)
   - Run `/context`
   - Review the breakdown:
     - How many tokens in CLAUDE.md?
     - How many in history?
     - How many in loaded files?

3. **Simulate a Long Conversation** (3 min)
   - Have Claude answer 5–10 questions about the codebase (without loading large files)
   - Run `/context` again
   - Discuss: How did history grow? How did quality of responses change?

4. **Compact and Compare** (3 min)
   - Run `/compact`
   - Run `/context` again
   - Ask Claude the same questions again: Does it still understand?
   - Lesson: Compaction preserves knowledge while freeing tokens

---

## Segment 4 — Three-Phase Workflow Demo (10 min)

**Objective**: Show how to structure work for clean context.

**Facilitation**:

1. **Research Phase** (3 min)
   - Start a new conversation (or `/clear`)
   - Ask: "Walk me through the authentication flow. Show me the relevant files."
   - Claude explores, responds
   - Don't execute anything
   - At the end: `/clear` to reset context

2. **Plan Phase** (3 min)
   - Start fresh (new session or `/clear`)
   - Load CLAUDE.md
   - Ask: "Plan a new feature: Add rate limiting to the login endpoint. Include approach, changes, error handling."
   - Claude generates plan in Plan Mode
   - Review and refine

3. **Implementation Phase** (4 min)
   - Execute the plan
   - Context is clean, plan is locked in
   - Implementation is straightforward
   - Lesson: By separating phases, you avoid context pollution and rework

---

## Hands-on Exercise: End-to-End Context Engineering

**Objective**: Build context discipline on a real task.

**Setup** (5 min):

Pick a real feature or task. Target: Moderately complex (2–4 hours of work). Example: "Add email verification to the signup flow."

**Steps** (50 min):

1. **Phase 1: Research** (15 min)
   - New session or `/clear`
   - Ask Claude: "Walk me through our current signup flow. Show me the relevant files. What's the authentication model?"
   - Claude explores the codebase
   - Take notes on key findings
   - At the end: Run `/clear` (discard research artifacts)

2. **Phase 2: Plan** (20 min)
   - New session or `/clear` (context is empty)
   - Load CLAUDE.md: Ask Claude to refresh from the file
   - Ask Claude: "Plan the addition of email verification. Include: architecture, database changes, new endpoints, error handling, security considerations, and validation rules."
   - Claude generates a plan in Plan Mode
   - Group reviews and refines: "How does this fit with existing auth? Are we validating the email correctly? What about edge cases (user changes email, verification link expires)?"
   - Continue until the plan is solid

3. **Phase 3: Implementation** (10 min)
   - Execute the plan
   - Claude implements
   - Context is focused, plan is locked in
   - Implementation is fast and accurate

4. **Phase 4: Verification** (5 min)
   - Ask Claude: "Did we implement all the requirements from the plan? Are there edge cases we missed?"
   - Claude reviews its own work against the plan
   - Outcome: Features that match the spec because the spec was precise and context was clean

---

## Debrief Questions

1. **"Before the workshop, did you think context size mattered more than context quality? What changed your mind?"** — Look for: participants realizing curated < large contexts

2. **"CLAUDE.md is now committed to Git. Who should update it when conventions change?"** — Look for: understanding that it's a team responsibility, not just one person's job

3. **"How did the `/context` breakdown surprise you? What was taking up more tokens than you expected?"** — Look for: awareness that conversation history grows fast, or that loaded files consume significant tokens

4. **"In the three-phase workflow, why did `/clear` between phases matter so much?"** — Look for: understanding that research artifacts (dead ends, questions) pollute planning context, so a clean slate is better

5. **"If you commit CLAUDE.md next week and six months later it's outdated, what do you do?"** — Look for: recognition that CLAUDE.md is a living document that must be actively maintained by the team

---

## Common Issues

**Participant says: "My project is too messy to write a CLAUDE.md — conventions aren't consistent yet"**

This is the most common concern. Reframe it: "Write CLAUDE.md as it *should* be, not as it currently is. It becomes a North Star. As the team refactors, they can align with CLAUDE.md instead of the old mess."

**Participant loads their project and Claude's context immediately fills up**

This is expected with large codebases. Use it as a teaching moment: "This is why we don't load entire projects. In the next module (M05), we'll use lazy loading and agent-based research to keep context focused." For now, add to CLAUDE.md: "Focus on /src/models and /src/routes" to scope future interactions.

**Participant's `/context` shows huge history bloat after a few questions**

Demonstration of the problem context poisoning creates. Walk through: `/context` → see history → ask a question → `/context` → see it grew. Then: `/clear` → see it drop to near-zero. Lesson: "Use `/clear` between major phases to prevent history from becoming noise."

**Participant gets an error running `/compact`**

If `/compact` fails, try `/clear` instead (same effect, but more direct). Note: some Claude Code versions use different names for these commands. Verify with `/help` if unsure.

**"We don't have a Git repo yet / we're not ready to commit this"**

Fine. Still draft CLAUDE.md and discuss it as a team. The value is in the discussion, not the Git history. They can commit later when ready.

---

## What to Commit Before Leaving

Each participant (or the team if working together) should have:

- [ ] A CLAUDE.md file at the project root with:
  - [ ] Overview + tech stack
  - [ ] Key files and their purpose
  - [ ] 5–10 key conventions (error handling, async patterns, validation, naming, etc.)
  - [ ] Recent changes (last 2–3 weeks)
  - [ ] Common mistakes to avoid
  - [ ] Testing requirements
  - [ ] Deployment info (if applicable)
- [ ] CLAUDE.md committed to Git (or at least drafted and discussed)
- [ ] Experience running `/context` and understanding the breakdown
- [ ] Understanding of when to use `/clear` between work phases
- [ ] Agreement on who owns updating CLAUDE.md going forward
