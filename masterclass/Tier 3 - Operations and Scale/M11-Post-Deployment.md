# M11: Post-Deployment — Monitoring AI-Generated Systems

## Module Overview

Shipping code is only half the battle. The real complexity emerges at 3 AM when your system is failing and your on-call engineer has 10 minutes to diagnose a production incident. This module teaches you how AI fundamentally changes incident response and system observability.

In traditional incident workflows, an engineer sees an alert, opens dashboards, digs through logs, correlates events, forms hypotheses about root causes, and deploys fixes—all manually. It's slow and error-prone, especially on unfamiliar systems. AI changes this. With Claude Code and MCP tools, you can automate the investigation itself: ask an agent to "find what changed in the last hour," "correlate this error with recent deployments," or "trace this request through all services." The agent pulls from monitoring systems, version control, logs, and traces—simultaneously—and narrows the search space to actionable causes in minutes instead of hours.

This module also covers the dual-agent model: local agents for interactive debugging (when you need human judgment) and cloud agents for automated monitoring and alerting (when you need scalability and speed). You'll learn how to preserve organizational knowledge as experienced engineers leave, and how to structure observability so that both humans and AI can reason about what went wrong.

## Prerequisites

- Completed Tier 1 and Tier 2
- Familiar with Claude Code, prompts, and MCP integrations
- Basic understanding of monitoring, logging, or observability tools (or willingness to learn)
- Access to a production system with logs and metrics (or willingness to use a simulated scenario)

## Pre-Work: Theory and Readings (15-20 min)

### SRE Fundamentals

Site Reliability Engineering (SRE) is a discipline that applies software engineering principles to operational problems. Core tenets:

- **Reliability is a feature, not a bug.** It competes with velocity; trade-offs are intentional.
- **Observability > Monitoring.** You can't just track "CPU is high." You need to ask arbitrary questions: "Why did this request take 5 seconds?" Observability is the ability to answer questions you didn't anticipate.
- **Blameless postmortems.** Incidents are learning opportunities, not staff problems.
- **Automation saves humans.** Toil (manual, repetitive work) is the enemy. Automate it.

### Observability Basics: Metrics, Logs, Traces

**Metrics:** Numbers over time. CPU usage, request latency, error rate. Questions: "Is the system healthy right now?"

**Logs:** Textual records of events. "User login failed," "database connection timeout." Questions: "What happened during that time window?"

**Traces:** End-to-end request flows across services. "Request entered API → hit database → returned to client." Questions: "Why was that specific request slow?"

Together, they form the **Three Pillars of Observability**. No single pillar is enough.

### How AI Changes Incident Response

**Traditional workflow:**
```
Alert fires → Engineer wakes up
→ Opens dashboard (5 min)
→ Scans logs for errors (10 min)
→ Checks recent deployments (5 min)
→ Forms hypothesis (10 min)
→ Tests hypothesis with more logs (15 min)
→ Deploys fix or escalates (20 min)
Total: ~65 minutes
```

**AI-augmented workflow:**
```
Alert fires → Engineer wakes up
→ Runs AI investigation: "What changed in the last hour?"
  (agent queries metrics, logs, Git history, deployment logs in parallel)
→ Claude returns: "Deployment X modified retry logic; this request pattern wasn't tested"
→ Engineer validates hypothesis (5 min)
→ Deploys fix (5 min)
Total: ~10 minutes
```

The AI doesn't replace the engineer's judgment. It compresses the investigation phase and surfaces the most likely causes. The engineer still decides what to do.

### Multi-Agent Systems for Production Monitoring

Two patterns:

1. **Local Agent (Interactive Debugging):** You run `claude code` on your laptop, ask questions about your system, and iterate. Useful for "I don't know what to check next" scenarios. Full context, human judgment, but not automated.

2. **Cloud Agent (Automated Monitoring):** A background process runs continuously, monitors your systems, and escalates anomalies or incidents. Useful for "detect this pattern and alert me" scenarios. Less context, but doesn't require human presence.

Both can coexist: automated agents catch issues; local agents investigate when humans are needed.

### Knowledge Preservation and Scaling

When your best on-call engineer leaves, what walks out the door? All the unwritten knowledge: "When Service A acts up, always check Service B's cache first." "That log message is confusing, but it's actually fine." "The retry logic has a bug in edge case X, so watch for Y."

AI provides a solution: encode this knowledge as agents and monitoring rules. A playbook for incident investigation becomes a set of MCP tools and prompts. A decade of debugging wisdom becomes part of the baseline for every on-call engineer, new or veteran.

### Alert Fatigue and Noise Filtering

Every alert you ignore teaches you to ignore alerts. Alert fatigue kills incident response. The traditional solution is manual tuning of thresholds. The AI solution: use agents to filter noise. "Alert me if error rate exceeds 5% **and** latency is above 2s **and** this error is new (not seen in the last week)." Multi-condition logic, adaptive thresholds, learned baselines.

### Recommended Readings

1. **"Introduction to SRE"** — Google SRE Book, Chapter 1. (Free online: https://sre.google/books/)
   - ~15 min. Defines SRE, sets context for why this matters.

2. **"Observability Basics"** — Observe ability (Chapter 3 of "Observability Engineering" by Majors, Fong-Jones, Miranda). (Free summary online or book purchase)
   - ~15 min. The three pillars, why they matter, how to use them.

3. **"Kubernetes Troubleshooting with AI"** — Kubernetes documentation on debugging + practical examples.
   - ~20 min. Concrete examples of using logs and traces to diagnose issues. Read even if you don't use Kubernetes; the patterns transfer.

4. **"Benefits of Agentic AI in On-call Engineering"** — Internal research or blog posts (e.g., from Anthropic, Stripe, or your own company).
   - ~15 min. Case studies of how organizations are using AI to speed incident response.

5. **"Your New Autonomous Teammate"** — Internal or community documentation on using Claude Code in production contexts.
   - ~10 min. Practical advice on trust, safety, and integration.

## Workshop: Facilitated Exercises (45-60 min)

### Exercise 1: Map Your Current Incident Workflow (10 min)

**Goal:** Understand what you're starting from.

1. On a whiteboard or document, sketch your current incident response process:
   - How do alerts reach you?
   - What tools do you open? In what order?
   - Where do you typically spend the most time?
   - Where do you most often get stuck?

2. Identify bottlenecks. Usually: "I have three services and don't know which one failed" or "The logs are huge and I don't know what to search for."

3. Share with the group. Look for common patterns.

### Exercise 2: Observability Audit (15 min)

**Goal:** Assess your current observability maturity.

For your team's main service, ask:

- **Metrics:** Can you answer "Is the system healthy right now?" with one dashboard?
- **Logs:** Can you quickly find logs for a specific request or user?
- **Traces:** Can you see a request's path through all services?
- **Context:** If I see an error, can I understand why it happened?

Rate each on a scale: "Strong" (yes, easily), "Partial" (sometimes, with effort), "Weak" (rarely, or need to dig hard).

Weak areas are opportunities for AI to add the most value. You can't automate investigation if you can't observe the system.

### Exercise 3: Build an AI Investigation Workflow (30 min)

**Goal:** Design a prompt that pulls from multiple sources to investigate an incident.

Scenario: Your API service suddenly has a 10x spike in error rate. What do you want to know?

**Possible prompts to an agent:**
1. "What changed in the last 2 hours?" (check Git, CI/CD logs, deployment records)
2. "Which requests are failing?" (check logs, errors, trace patterns)
3. "Did latency increase?" (check metrics, SLOs, percentiles)
4. "Is this affecting all users or a specific subset?" (check logs, user IDs, geographic patterns)
5. "What's the relationship between the change and the error?" (correlate)

Divide into small groups. Each group picks one of these questions and designs a prompt for Claude Code that:
- Specifies which MCP tools to use (or would use, if available)
- Asks for specific output format (structured JSON, highlighted snippets, timeline)
- Includes fallback logic if a tool isn't available

Share designs. Discuss what would make each more effective.

## Hands-on Exercise: Simulate an Incident and Use Claude Code to Investigate (30-45 min)

### Scenario

You deploy a new feature to your API. 15 minutes later, error rate spikes from 0.1% to 8%. Your monitoring system alerts you. What happened?

### Setup

You'll use Claude Code with a simulated set of tools (or real ones if you have access):

- Git repository with recent commits
- A mock log file (provided) with error logs, request traces, and timestamps
- A metrics snapshot (JSON or CSV) with latency, error rate over time
- A recent deployment manifest or changelog

### Steps

1. **Start Claude Code in your preferred IDE or use the web interface.**

2. **Initial prompt:** "I just got an alert: error rate spiked from 0.1% to 8% at 2:45 PM. Please investigate. Use Git to find recent changes, check the logs, and find the most likely root cause. Tell me: what changed, what's failing, and what I should do."

3. **Claude will:**
   - Ask clarifying questions if needed
   - Query Git history for recent commits
   - Parse logs to find error patterns
   - Correlate timing of changes with error spike
   - Propose a root cause and remediation

4. **You:**
   - Watch the investigation unfold
   - Note where Claude asks good questions vs. where you'd need to guide it
   - Provide information as Claude requests (e.g., "Here are the logs, here's the deployment manifest")
   - Decide whether the diagnosis is correct
   - Plan your fix based on Claude's findings

5. **Debrief:**
   - How much faster was this than your typical investigation?
   - What did Claude miss?
   - What would you change about the prompts or tools?

### Real-World Variant (If You Have Production Access)

If your team has a staging or production system:
- Use real logs and metrics
- Point Claude to real dashboards and tools via MCP
- Investigate an actual recent incident (post-mortem)
- Compare Claude's diagnosis to the actual root cause discovered by your team

## Takeaway: An Incident Response Workflow Using Claude Code + MCP

By the end of this module, you should have:

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

2. **A checklist of observability gaps** to address. Example:
   ```
   [ ] Can query logs by request ID or user ID
   [ ] Have distributed traces set up
   [ ] Have key metrics dashboarded (latency, error rate, SLOs)
   [ ] Have alerts configured (not too noisy, not too quiet)
   [ ] Have a communication channel for incidents (Slack, PagerDuty)
   [ ] Team knows how to ask Claude for help (trained on prompt template)
   ```

3. **An on-call runbook updated** to include: "If you're stuck, try asking Claude Code with this prompt."

## Key Concepts

| Concept | Definition |
|---------|-----------|
| **SRE** | Site Reliability Engineering: applying software engineering to operational problems. Focus: reliability, automation, reducing toil. |
| **Observability** | Ability to understand system behavior by observing outputs (metrics, logs, traces). More powerful than traditional monitoring. |
| **Metrics** | Time-series data: CPU, memory, request latency, error rate. Answer: "How is the system performing right now?" |
| **Logs** | Structured or unstructured text records of events. Answer: "What happened during this time window?" |
| **Traces** | End-to-end request flows across services. Answer: "Why was this specific request slow or failing?" |
| **Incident** | An unplanned interruption or reduction in quality of service. |
| **Root Cause** | The underlying reason an incident occurred. Often multiple layers deep (not just "the code has a bug"). |
| **Blameless Postmortem** | A learning meeting after an incident focused on systems, not people. What failed? Why? How do we prevent it? |
| **Alert Fatigue** | Condition where too many alerts cause responders to ignore them. Kills incident response. |
| **Toil** | Manual, repetitive, operational work. SRE goal: eliminate it through automation. |

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

### Next Module
[M12: CI/CD Integration and Headless Workflows](../M12-CICD-Integration/README.md)
