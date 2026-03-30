# M11: Post-Deployment — Monitoring AI-Generated Systems

**Tier 3 — Operations and Scale | Duration: 90 min (pre-work + workshop)**

---

## Module Overview

Shipping code is only half the battle. The real complexity emerges at 3 AM when your system is failing and your on-call engineer has 10 minutes to diagnose a production incident. This module teaches you how AI fundamentally changes incident response and system observability.

In traditional incident workflows, an engineer sees an alert, opens dashboards, digs through logs, correlates events, forms hypotheses about root causes, and deploys fixes—all manually. It's slow and error-prone, especially on unfamiliar systems. AI changes this. With Claude Code and MCP tools, you can automate the investigation itself: ask an agent to "find what changed in the last hour," "correlate this error with recent deployments," or "trace this request through all services." The agent pulls from monitoring systems, version control, logs, and traces—simultaneously—and narrows the search space to actionable causes in minutes instead of hours.

This module also covers the dual-agent model: local agents for interactive debugging (when you need human judgment) and cloud agents for automated monitoring and alerting (when you need scalability and speed). You'll learn how to preserve organizational knowledge as experienced engineers leave, and how to structure observability so that both humans and AI can reason about what went wrong.

**Takeaway:** Incident investigation prompt templates, observability audit checklist, and judgment about when AI accelerates vs. replacing human diagnosis.

> **Workshop:** [M11-Post-Deployment-workshop.md](M11-Post-Deployment-workshop.md)

---

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

---

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

---

*Next: [M12: CI/CD Integration and Headless Workflows](../M12-CICD-Integration/README.md)*
