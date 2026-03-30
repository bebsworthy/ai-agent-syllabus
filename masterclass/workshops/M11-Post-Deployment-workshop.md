# M11 Workshop: Post-Deployment — Monitoring AI-Generated Systems

**Facilitated session | 60–75 min | Requires: M11 study guide read beforehand**

---

## Before You Start

**Prerequisites for participants**
- M11 study guide completed (theory + readings)
- Completed Tier 1 and Tier 2 modules
- Familiar with Claude Code, prompts, and MCP integrations
- Access to logs and monitoring tools for their own system, or willingness to work with simulated scenario
- Understanding of their team's current incident response workflow

**What this session does**
The theory explains the mechanism and why AI accelerates incident response. This workshop makes it tangible through hands-on incident investigation. Participants will map their current workflow, assess observability gaps, design AI-augmented investigation prompts, and run a simulated incident to see how Claude Code speeds up diagnosis. By the end, everyone has templates they can reuse and knows exactly where AI adds the most value in their incident pipeline.

**Facilitator preparation**
- Prepare a simulated incident scenario (or have access to real logs/metrics from a recent incident)
- Have mock data ready: Git commits, error logs with timestamps, metrics snapshot
- Pre-test the incident scenario with Claude Code to verify it works
- Have your own incident postmortem ready to share (real or anonymized)
- Prepare a rubric for "good investigation prompt" (specificity, tool usage, output format)

---

## Session Plan

| Segment | Activity | Time |
|---|---|---|
| 1 | Map current incident workflow | 10 min |
| 2 | Observability audit of your system | 15 min |
| 3 | Design AI investigation prompts | 15 min |
| 4 | Simulate an incident and investigate | 20 min |
| — | Debrief | 5 min |

---

## Segment 1 — Map Your Current Incident Workflow (10 min)

**Goal:** Understand what you're starting from, before AI enters the picture.

### Steps

1. **On a whiteboard or document, sketch your current incident response process:**
   - How do alerts reach you? (PagerDuty? Email? Slack?)
   - What tools do you open first? (Datadog? Grafana? CloudWatch?)
   - In what order do you investigate? (Metrics → Logs → Git? Or different?)
   - Where do you typically spend the most time?
   - Where do you most often get stuck? (Too many logs? Don't know which service failed?)
   - How long does a typical investigation take? (5 min? 30 min? Hours?)

2. **Identify bottlenecks.** Examples:
   - "I have three microservices and I don't know which one failed"
   - "The logs are huge and I don't know what to search for"
   - "I have to manually check Git history, deployment logs, and metrics separately"
   - "I often miss context (don't remember what was deployed 2 hours ago)"

3. **Share with the group.** Look for common patterns. Does everyone get stuck at the same point?

### Facilitator note

Write down the bottlenecks on a flip chart. These are your targets for AI automation. You want to measure whether Claude Code actually eliminates them.

---

## Segment 2 — Observability Audit (15 min)

**Goal:** Assess your current observability maturity. You can't automate investigation if you can't observe the system.

### For Your Team's Main Service, Answer These

- **Metrics:** Can you answer "Is the system healthy right now?" with one dashboard? (Yes = Strong, Sometimes = Partial, Rarely = Weak)
- **Logs:** Can you quickly find logs for a specific request or user? (Do you have request ID tracing? User ID indexing?)
- **Traces:** Can you see a request's path through all services? (Distributed tracing set up?)
- **Context:** If I see an error, can I understand why it happened? (Are there log messages with enough context, or just stack traces?)
- **Deployment visibility:** Can you see what was deployed and when?
- **Change tracking:** Can you correlate deployment timing with error spikes?

### Rating Scale

- **Strong:** Yes, easily. Takes < 1 minute to get the answer.
- **Partial:** Sometimes, with effort. Takes 5-10 minutes; may need multiple tools.
- **Weak:** Rarely. Takes 30+ minutes or requires significant manual investigation.

### Expected Output

```
Service: API Backend

Metrics:   [ Partial ] — Have CPU/memory/latency, but no SLO dashboards
Logs:      [ Strong ] — Splunk indexed by request ID
Traces:    [ Weak ] — No distributed tracing set up
Deployment Visibility: [ Partial ] — Can see deployments but no automated alerting
Change Tracking: [ Weak ] — Have to manually compare Git logs to deployment time
```

### Key Insight

Weak areas are opportunities for AI to add the most value—but also indicate places where you should invest in observability itself. You can't automate investigation if you can't observe the system. If "change tracking" is weak, implementing that gives more ROI than an AI prompt.

---

## Segment 3 — Design AI Investigation Prompts (15 min)

**Goal:** Design prompts that Claude Code can execute to investigate incidents.

### Scenario

Your API service suddenly has a 10x spike in error rate. It was 0.1% at 2:40 PM. At 2:45 PM, it jumped to 8%.

### What Do You Want to Know? (Prioritized)

1. **What changed in the last 2 hours?** (Check Git, CI/CD logs, deployment records)
2. **Which requests are failing?** (Check error patterns in logs)
3. **Did latency increase?** (Check metrics—maybe the error spike is a symptom, not the root cause)
4. **Is this affecting all users or a specific subset?** (Check logs by user ID, geographic patterns, client version)
5. **What's the relationship between the change and the error?** (Correlate timing)

### In Small Groups: Design One Investigation Prompt

Each group picks one of these five questions and designs a prompt for Claude Code that:

**Must include:**
- Which MCP tools to use (Datadog? Splunk? Git?)
- Specific output format (structured JSON? Timeline? Highlighted snippets?)
- What to do if a tool isn't available (fallback logic)
- How to handle large result sets (limit output? summarize?)

**Avoid:**
- Vague requests ("What's wrong?")
- Requests that Claude can't verify (opinion-based)
- Unbounded output (leading to 100K tokens of logs)

### Example Prompt (Question 1: What changed in the last 2 hours?)

```
I'm investigating an error spike at 2:45 PM.
Use these tools to find what changed:

1. Git: Show commits deployed to production in the last 2 hours.
   Format: [timestamp, commit hash, author, message]

2. CI/CD logs: Show deployment records for the last 2 hours.
   Format: [deploy time, service, version, status]

3. Config changes: Did any feature flags flip?
   Format: [flag name, old value, new value, time]

Highlight which change most likely correlates with the error spike.
```

### Share Designs

Each group presents their prompt. Discuss:
- Is it specific enough for Claude to act on?
- Does it ask for the right output format?
- Would this actually help diagnose the problem?

---

## Segment 4 — Simulate an Incident and Investigate with Claude Code (20 min)

This is the hands-on moment. You'll see Claude Code do the investigation.

### Scenario Setup

You deploy a new feature to your API. 15 minutes later, error rate spikes from 0.1% to 8%. Your monitoring system alerts you at 2:45 PM.

**What changed:**
- Commit: "Add caching layer to user service" (2:30 PM)
- Feature flag: `enableUserCache` flipped ON (2:31 PM)
- Error: "Connection refused: Redis at 127.0.0.1:6379"

### Mock Data (Facilitator Provides)

**Git log:**
```
2:30 PM | abc1234 | alice | "Add caching layer to user service"
        Files: src/services/user.ts, src/cache/redis.ts
        Summary: Cache user lookups in Redis for 5 min TTL

2:25 PM | def5678 | bob   | "Update dependencies"
        Files: package.json, package-lock.json
```

**Deployment log:**
```
2:31 PM | Deploy to prod | user-service:v1.2.3 | Success
2:32 PM | Feature flag toggle | enableUserCache | false → true
```

**Error logs (sample):**
```
2:45:12 PM | ERROR | src/services/user.ts:45 | Connection refused: Redis at 127.0.0.1:6379
2:45:13 PM | ERROR | src/services/user.ts:45 | Connection refused: Redis at 127.0.0.1:6379
[repeated 1000x times until 2:47 PM]
```

**Metrics:**
```
Error rate: 0.1% (before 2:44 PM) → 8% (2:45-2:47 PM)
Latency p95: 150ms (steady) → 2500ms (2:45 PM onward)
CPU: 45% → 95% (Redis retry storms)
```

### Steps

1. **Start Claude Code** in your preferred IDE or web interface.

2. **Give Claude this initial prompt:**

```
I just got an alert: error rate spiked from 0.1% to 8% at 2:45 PM.

Here's what I know:
- System: User service API
- Alert time: 2:45 PM
- Error rate: 0.1% → 8%
- Latency p95: 150ms → 2500ms

Please investigate using:
1. Git: Find commits deployed in the last 2 hours
2. Deployment logs: What changed at deploy time?
3. Error logs: What's the exact error pattern?
4. Metrics: Did latency or CPU spike? When?

Tell me: What changed? What's failing? What should I do?
```

3. **Claude will:**
   - Ask clarifying questions if needed (e.g., "Do you have access to Redis monitoring?")
   - Query Git history for recent commits
   - Parse error logs to find patterns
   - Correlate timing of changes with error spike
   - Propose a root cause ("The caching layer is trying to connect to Redis, but Redis is not running")
   - Suggest immediate remediation ("Disable enableUserCache flag" or "Restart Redis")

4. **You:**
   - Watch the investigation unfold
   - Note where Claude asks good questions vs. where you'd need to guide it
   - Provide information as Claude requests
   - Decide whether the diagnosis is correct
   - Plan your fix based on Claude's findings

5. **Time it:** How many minutes from alert to diagnosis?

### Expected Outcome

Claude should diagnose:
- **Root cause:** "Caching feature flag was enabled, but Redis is not running or not accessible."
- **Evidence:** "Error logs show connection refused; timing correlates with flag toggle."
- **Remediation:** "Option A: Disable flag. Option B: Ensure Redis is running. Option C: Add fallback to non-cached queries."

### Debrief (During Segment 5)

- How much faster was this than your typical investigation?
- What did Claude miss?
- What would you change about the prompts or tools?

---

## Debrief (5 min)

Ask the group these four to five questions:

1. **"What was the biggest time-saver in Claude's investigation vs. your manual process?"**
   - Look for: "It checked Git + metrics + logs in parallel," "It asked the right follow-up questions," "It correlated timing automatically"

2. **"Where did Claude struggle or need human guidance?"**
   - Look for: "Didn't understand our alerting tool," "Missed a subtle pattern in logs," "Couldn't access our internal dashboards"

3. **"If Claude had the right MCP tools connected, what else could it automate?"**
   - Look for: "Checking PagerDuty history," "Querying our database for correlated errors," "Checking feature flag history"

4. **"What would you need to trust Claude's diagnosis enough to act on it immediately?"**
   - Look for: "Confidence score," "Cross-check with second source," "Explanation of reasoning," "Human approval step"

5. **"How would this change your on-call experience?"**
   - Look for: "Less context-switching between tools," "Faster diagnosis," "Less reliance on tribal knowledge," "Easier for junior engineers"

Close with:

> *"You've now seen AI accelerate the investigation phase of incident response. AI won't replace your judgment—you still decide what to do. But it can compress 65 minutes of investigation into 10, if you give it the right tools and context. Your next step is to build the MCP connectors to your real monitoring tools and test this on a real incident."*

---

## Hands-on Exercise: Investigate a Real Incident (Async, 30-45 min)

### Challenge: Post-Mortem Analysis

**Pick a recent incident from your team's history** (within the last month). Ideally, one that took > 30 minutes to diagnose.

### Steps

1. **Gather the artifacts:**
   - Exact alert time and symptom
   - Git commits deployed around that time
   - Deployment logs
   - Error logs (or search query to pull them)
   - Metrics (latency, error rate, CPU, memory)
   - Feature flag changes
   - Postmortem notes (if available)

2. **Create a Claude Code session with this data:**

```
I'm analyzing a past incident to see if AI could have sped up diagnosis.

Incident: [Name]
Alert time: [exact time]
Symptom: [what users/monitoring saw]
Duration: [how long until diagnosed]

Here's the data:
- Git commits (last 2 hours before alert): [paste]
- Deployment log: [paste]
- Error logs: [paste]
- Metrics snapshot: [paste]

Please investigate as if this were happening now. Tell me:
1. What would you have diagnosed?
2. How long would it have taken?
3. How does it compare to the actual diagnosis your team made?
```

3. **Compare:**
   - Claude's diagnosis vs. your team's actual root cause
   - Time Claude took vs. time your team spent
   - What Claude missed vs. what it got right

### What to Submit

1. The incident name/date
2. Claude's investigation output (diagnosis + timeline)
3. Your team's actual diagnosis
4. Analysis: Did Claude get it right? Would this have saved time?
5. Gaps: What MCP tools or data would have made Claude's diagnosis more complete?

### Expected Finding

Most teams find:
- Claude can diagnose 70-80% of incidents correctly given the data
- Time to diagnosis drops from 30-60 min to 5-15 min with Claude
- Gaps are usually: "Claude didn't have access to our dashboard," "Couldn't query our log aggregation tool," "Didn't know about that one quirk of our system"

These gaps are exactly where MCP tools come in.

---

## Common Issues Section

**Claude can't access our monitoring tools**
- MCP tools aren't connected yet; this is expected in early stages
- Workaround: Copy-paste logs/metrics into the prompt manually
- Next step: Build MCP connectors to Datadog, Splunk, CloudWatch, etc.
- Alternative: Use Claude's reasoning to guide your manual investigation

**Claude's diagnosis is wrong**
- This usually means insufficient context (missing logs, metrics, or Git history)
- Try /effort high to give Claude more reasoning tokens
- Add more context to CLAUDE.md (known quirks, common issues, architecture)
- Have a human verification step before acting on diagnosis

**Claude gives vague remediation ("Restart the service")**
- This is expected without deep system knowledge
- Follow up: "How do I restart the service safely without downtime?"
- Add postmortem learnings to CLAUDE.md so future diagnosis is more specific

**Investigation takes too long (> 10 min)**
- Check if Claude is exploring unnecessary tangents
- Provide more specific prompts; narrow the scope
- Verify your logs are indexed and searchable (weak observability = slow investigation)

**Team is worried about trusting AI diagnosis**
- Completely valid; implement a verification step
- Use Claude to narrow search space; have human confirm root cause
- Over time, build confidence as Claude proves accurate
- Use incident postmortems to improve future prompts

---

## Takeaway: An Incident Response Workflow Using Claude Code + MCP

By the end of this module and workshop, you should have:

1. **A documented incident investigation prompt** that your team can reuse. Template:
   ```
   I'm investigating [service name] which [symptom].
   The alert fired at [time].
   Use [tool] to:
   - Find recent deployments and changes
   - Identify error patterns in logs
   - Correlate with metrics (latency, resource usage)
   - Propose root cause and next steps.
   Focus on [known pain points, e.g., retry logic, caching issues].
   ```

2. **A checklist of observability gaps** to address:
   ```
   [ ] Can query logs by request ID or user ID
   [ ] Have distributed traces set up (or plan to implement)
   [ ] Have key metrics dashboarded (latency, error rate, SLOs)
   [ ] Have alerts configured (not too noisy, not too quiet)
   [ ] Have a communication channel for incidents (Slack, PagerDuty, etc.)
   [ ] Team is trained on AI investigation prompt template
   [ ] Have MCP tools connected (Datadog, Splunk, Git, deployment logs, etc.)
   ```

3. **An on-call runbook updated** to include:
   ```
   If you're stuck on diagnosis:
   - Try asking Claude Code with this prompt: [template]
   - Give it access to [tools]
   - It should narrow the search space in < 10 minutes
   - Always verify diagnosis before acting
   ```

---

## References

### Books and Guides
- [Google SRE Book: Chapter 1 (Introduction)](https://sre.google/books/)
- [Observability Engineering (Book)](https://www.oreilly.com/library/view/observability-engineering/9781492076438/) by Majors, Fong-Jones, Miranda
- [Kubernetes Documentation: Troubleshooting](https://kubernetes.io/docs/tasks/debug-application-cluster/)

### Tools and Platforms (Sample)
- Sentry (error tracking): https://sentry.io
- Datadog (monitoring and observability): https://www.datadoghq.com
- Prometheus + Grafana (open-source metrics): https://prometheus.io
- ELK Stack (logs): https://www.elastic.co
- Jaeger (distributed tracing): https://www.jaegertracing.io

### Articles and Blogs
- Stripe: "Scaling Incident Response" (search their blog)
- Anthropic: Case studies on AI in operations (when available)
- Your company's incident postmortems (learn from real incidents)

### M11 Study Guide
[M11-Post-Deployment.md](../Tier 3 - Operations and Scale/M11-Post-Deployment.md)

---

## Incident Investigation Prompt Template

Use this as a starting point for your own incidents:

```
I'm investigating [service] which [symptom: error spike, latency, downtime, etc.].
Alert fired at [exact time]. Current status: [describe].

Use these sources to build a timeline:
1. Git: Commits deployed in the 2 hours before [alert time]
2. Deployment log: When was [service] deployed? What version?
3. Feature flags: Were any flags toggled around [alert time]?
4. Error logs: Show me errors in this time window. Format: timestamp, error type, affected endpoint
5. Metrics: Show latency p50, p99, error rate, CPU, memory for last 1 hour

Then:
- Correlate: What changed? When did errors start?
- Diagnose: What's the most likely root cause?
- Remediate: What's the quickest fix (revert? restart? config change?)?

Focus on [known pain points for your team: retry logic, caching, database connections, etc.]
If you need more info, ask.
```

Customize [bracketed parts] for your team and save it for reuse.
