# Week 9: Agents Post-Deployment — Course Notes

## Overview

Week 9 shifts focus from building and deploying agents to the critical operational challenge: what happens after your agent ships to production. This week explores the infrastructure, monitoring, and incident response practices that keep AI-powered systems reliable at scale. The focus is on Site Reliability Engineering (SRE) principles, observability frameworks, and how autonomous agents themselves can transform operational work. Through readings on Google's SRE methodology, distributed tracing, Kubernetes troubleshooting, and Resolve AI's production engineering platform, you'll learn how modern teams maintain system reliability while reducing the manual burden of on-call work through agent-powered incident response.

---

## Key Concepts & Learnings

### The Evolution from Sysadmin to Software-Defined Operations

The traditional systems administration model faced fundamental problems as systems scaled. Operations teams maintained infrastructure manually while development teams pushed for rapid feature releases, creating structural conflict that hindered both velocity and stability. *(Source: "Introduction to SRE")* Google revolutionized this approach by reframing operations as an engineering discipline. Rather than hiring traditional sysadmins, Google built SRE teams composed of software engineers who applied development practices to operational challenges. This shift proved transformative: SRE teams are typically composed of 50–60% standard software engineers and 40–50% engineers with specialized operational expertise like Unix internals or networking. The result was not just more automation, but more intelligent automation that reduced operational burden over time.

The cornerstone of this philosophy is the **50% Rule**. SREs spend at most 50% of their time on reactive operational work—handling tickets, on-call duties, and manual incident response. The remaining 50% must focus on development work that reduces future operational load. This enforced split creates a virtuous cycle where systems become progressively more self-managing. Without this discipline, teams drift toward pure operations, losing the engineering rigor needed to build scalable systems.

### Understanding Observability Through Distributed Tracing

As systems grew distributed—with requests flowing through multiple services, databases, and external dependencies—traditional logging and metrics became insufficient for understanding system behavior. Observability emerged as a discipline addressing this challenge through three complementary signal types: metrics (numerical measurements aggregated over time), logs (discrete events with contextual data), and traces (complete request journeys through distributed systems).

Traces and spans form the backbone of modern observability. *(Source: "Observability Basics")* A trace represents a request's complete journey through a distributed system, while spans represent individual units of work within that journey. When a user request arrives at an API gateway, that creates a span. The gateway calls an authentication service (another span), which queries a user database (yet another span). These spans nest hierarchically, and a unique trace ID travels with the request across service boundaries, typically embedded in HTTP headers. This context propagation allows different services running independently to contribute their timing data and metadata to a unified view of that single request's journey.

The practical benefit is precision in debugging and performance optimization. When systems experience latency, observability tools can pinpoint exactly which service is the bottleneck. When errors occur, engineers can trace the exact execution path and identify which dependency failed. This capability becomes even more critical in Kubernetes environments where pods restart constantly. Context propagation ensures that even when infrastructure is ephemeral, the logical flow of work remains traceable.

However, comprehensive tracing generates enormous data volumes. Every request through every service creates spans that must be collected, stored, and indexed. This has spawned sophisticated sampling strategies: head-based sampling makes retention decisions when spans originate, tail-based sampling decides after a trace completes, and priority sampling weights decisions by business importance. OpenTelemetry has emerged as the vendor-neutral standard for implementing traces, providing automatic instrumentation for popular frameworks and establishing consistent APIs across languages and platforms. *(Source: "Observability Basics")*

### Error Budgets as a Framework for Decision-Making

SRE practitioners recognize that perfect availability is neither achievable nor necessary. Users cannot distinguish between 99.99% uptime and 99.999% uptime in practical terms. Instead of pursuing theoretical perfection, SRE teams define realistic availability targets aligned with business requirements. The inevitable gap between perfect availability and the target becomes the "error budget"—the permitted amount of downtime that can be spent on innovation and experimentation without violating the availability target. *(Source: "Introduction to SRE")*

This framework fundamentally changes team dynamics. Rather than operations teams blocking changes to protect stability, teams negotiate how to spend their error budget. A team targeting 99.95% availability gets approximately 22 minutes of permitted downtime per year. If a risky new feature deployment might cause 15 minutes of outage, teams can decide whether that risk is worth the business value and error budget available. This shifts the conversation from "can we ship this?" to "should we spend our error budget on this?" The framework surfaces tradeoffs explicitly.

Error budgets also create natural feedback loops for on-call sustainability. When incidents deplete the budget, the team automatically shifts resources from feature development to reliability work, rebuilding the buffer. This prevents the unsustainable pattern of understaffed on-call engineers constantly fighting production fires while development accelerates unchecked.

### Managing Change and Production Incidents

Approximately 70% of production outages stem directly from changes—deployments, configuration modifications, scaling operations, or dependency upgrades. This observation drives SRE's emphasis on change management. Rather than lengthy approval processes that slow velocity, SRE teams automate safe change practices. Progressive rollouts deploy changes incrementally to small percentages of traffic, with rapid problem detection systems watching for errors or performance degradation. If problems appear, automated rollback stops the deployment and reverts to the previous version. *(Source: "Introduction to SRE")*

When incidents do occur, SRE focuses on mean time to recovery (MTTR) rather than mean time between failures. A system that fails once per month but recovers in 30 minutes is more reliable from the user's perspective than a system that fails once per year but requires 12 hours to diagnose and fix. This drives investment in incident response infrastructure: detailed runbooks that reduce investigation and triage time, on-call rotation practices that maintain engineer quality, and blameless post-incident reviews that extract lessons without creating fear that discourages honest incident analysis.

Prepared playbooks consistently achieve approximately 3x improvements in MTTR compared to ad-hoc response approaches. This effect multiplies at scale: in a distributed system with thousands of components, the difference between having a systematic playbook and improvising on the spot becomes the difference between recovering in minutes and hours.

### Agentic AI as a Transformation of On-Call Work

The newest evolution in operations combines SRE principles with agent-based AI systems. Rather than implementing agents purely for development workflows, companies like Resolve AI are deploying autonomous agents specifically designed for production incident response. These systems represent a category shift in how on-call work itself is performed.

The traditional on-call engineer typically works through a manual process: an alert fires, the engineer reads the alert message, logs into monitoring dashboards to check metrics, searches logs across multiple services, checks recent deployments, reviews code changes, correlates the data mentally, forms hypotheses, and attempts fixes. This entire process relies on human pattern recognition and institutional knowledge. *(Source: "Benefits of Agentic AI in On-call Engineering" and "Your New Autonomous Teammate")* Agentic AI automates this investigation pipeline. When an alert fires, the system immediately investigates by examining metrics, dashboards, code changes, deployments, and logs in parallel. Within minutes it identifies probable root causes and recommends resolution steps. Critically, it does this continuously without fatigue, maintaining investigation quality around the clock.

One particular strength of agent-based incident response is alert fatigue reduction. In complex systems—especially Kubernetes environments where the control plane constantly adjusts workloads—alerts often resolve themselves. A pod restart triggers an alert that may resolve itself quickly, creating noise that masks genuine issues. *(Source: "Benefits of Agentic AI in On-call Engineering")* Agentic systems investigate every alert immediately and intelligently, determining whether human attention is truly needed or whether the system has already self-healed. This dramatically increases signal-to-noise ratio.

Another critical advantage is knowledge preservation. *(Source: "Benefits of Agentic AI in On-call Engineering")* When experienced team members depart, their institutional knowledge typically leaves with them. Agentic AI systems capture patterns from each incident and build on them over time, maintaining evolving expertise. The system maintains evolving expertise rather than static runbooks that become obsolete. This becomes increasingly valuable in organizations with high engineer mobility or in teams facing complex, evolving infrastructure.

### Multi-Agent Systems and Production Debugging

A key insight from Resolve AI's research is that production systems exhibit "irreducible interdependence"—understanding complex incidents requires specialized domain knowledge across multiple areas simultaneously. No single AI model can effectively maintain expertise across database internals, Kubernetes resource scheduling, network protocols, and application frameworks simultaneously. *(Source: "Role of Multi Agent Systems")*

This drives the evolution from single-agent systems to coordinated multi-agent architectures. In a multi-agent incident response system, different agents specialize in different aspects: one agent focuses on system logs and infrastructure state, another analyzes application metrics and traces, a third examines deployment history and code changes. Rather than investigating sequentially, these agents generate competing hypotheses in parallel and refine findings through cross-system analysis. A hypothesis about a database connection pool exhaustion gets validated against connection count metrics, recent deployments to the database service, and application request latencies.

The engineering complexity of building production-grade multi-agent systems is often underestimated. *(Source: "Role of Multi Agent Systems")* It requires both deep domain knowledge (understanding how production infrastructure actually behaves) and sophisticated AI architecture skills (managing agent coordination, preventing race conditions, ensuring consistent state). The progression of approaches reveals the limitations: pure LLMs lack persistent state for complex investigations; LLM + Tools combinations cannot maintain investigation context across interactions; single agents become sequential bottlenecks; only multi-agent systems enable the parallel hypothesis testing necessary for rapid root cause analysis in complex systems.

### Practical Observability in Kubernetes

Kubernetes environments present unique observability challenges. Pods are ephemeral—when they crash, troubleshooting information disappears with them, making it impossible to attach debuggers or preserve crash state before Kubernetes resets the resource. Observability data fragments across multiple nodes and containers, scattered across different logging systems. *(Source: "Kubernetes Troubleshooting with AI")* The Kubernetes control plane constantly adjusts workloads—scaling pods, rescheduling them across nodes, performing resource management—triggering alerts that resolve themselves before engineers can respond, creating alert fatigue.

Resolve AI's approach to this challenge centers on three capabilities. **24/7 Autonomous Monitoring** continuously investigates alerts without waiting for engineer intervention, surfacing actionable insights before the human on-call engineer even sees the alert notification. **Knowledge Graphs** dynamically map the relationships between pods, nodes, services, and API endpoints, revealing systemic patterns rather than isolated symptoms. A pod might be restarting repeatedly, which appears as a local incident, but the knowledge graph might reveal that it's consistently failing when node CPU utilization exceeds 80%, pointing to a resource contention issue rather than pod-specific problem. **Intelligent Data Filtering** analyzes observability data from Prometheus, Datadog, and Kubernetes events to prioritize relevant signals while eliminating noise.

The automation achieves four key steps automatically: reconstructing event timelines to understand when issues started, correlating cluster-wide anomalies to identify systemic causes rather than isolated symptoms, testing hypotheses through automated runbooks without manual kubectl commands, and suggesting remediation workflows. *(Source: "Kubernetes Troubleshooting with AI")* This transforms Kubernetes troubleshooting from a frustrating manual process to an intelligent, automated system.

### Building Toward AI-Native Engineering

The progression from AI-assisted to AI-native engineering marks a subtle but profound shift. In AI-assisted workflows, AI helps engineers but humans remain responsible for tool coordination and decision-making. In AI-native workflows, AI becomes the primary interface for production work. *(Source: "Role of Multi Agent Systems")* An engineer might ask their AI teammate to investigate an incident and provide recommendations, then authorize specific actions like a rollback. The agent takes responsibility for investigation rigor while the engineer maintains decision authority.

This shift doesn't eliminate human engineers—it transforms their role. Instead of spending 50% of time on repetitive incident triage and investigation, engineers focus on deeper problem-solving, architectural improvements, and innovation. The agent handles the mechanical parts of incident response while humans provide judgment about complex tradeoffs and novel situations.

---

## Lecture Topics

### Monday, November 17: Incident Response and DevOps

The Monday session covers the fundamentals of SRE, observability architecture, and incident response practices. Topics include the traditional sysadmin model and its limitations, Google's SRE approach and team composition, the 50% Rule and its enforcement, core SRE tenets (error budgets, monitoring strategies, change management, emergency response planning, and capacity planning), distributed tracing concepts (traces and spans), context propagation across services, sampling strategies for managing observability data volume, and real-world observability implementation patterns. This session establishes the foundational knowledge for understanding production systems at scale.

### Friday, November 21: Mayank Agarwal (CTO, Resolve) and Milind Ganjoo (Technical Staff, Resolve)

The Friday guest lecture features leaders from Resolve AI discussing how agentic AI is transforming production engineering. The speakers cover their company's approach to autonomous incident response, the architecture behind multi-agent systems for production debugging, practical experiences deploying AI agents in on-call workflows at companies like Salesforce and Coinbase, and how these systems reduce mean time to resolution while improving engineer satisfaction. This session grounds the theoretical concepts from Monday in concrete product architecture and real-world deployment experiences.

---

## Practical Takeaways

**Design for Observability from the Start.** When building systems, instrument them with tracing from the beginning. Use OpenTelemetry standards so you can later switch observability vendors without refactoring. Context propagation through trace IDs should be automatic and built into your communication patterns.

**Treat Operations as an Engineering Discipline.** Staff on-call rotations with engineers, not sysadmins. Enforce the 50% Rule rigorously—if your on-call engineers spend more than 50% of time fighting production fires, your system design is broken, not your incident response.

**Define and Respect Error Budgets.** Compute realistic availability targets, calculate error budgets, and make deployment decisions within that framework. Use error budget depletion as a signal to shift resources toward reliability.

**Automate Everything in the Incident Response Path.** Build runbooks that agents can execute without human intervention. The goal isn't to eliminate human judgment but to automate the mechanical investigation and initial diagnosis steps so humans can focus on complex problem-solving.

**Plan for Alert Fatigue.** In complex systems, alert volume will exceed human capacity. Implement intelligent alert filtering and correlation. Consider agentic systems that investigate every alert immediately and surface only high-confidence, actionable alerts to humans.

**Build Multi-Agent Systems for Complex Debugging.** As systems grow in complexity, single-agent incident response becomes a bottleneck. Design systems where specialized agents focus on different problem domains and coordinate their findings to reach conclusions faster than sequential investigation.

**Document Incident Learnings Systematically.** Every incident is an opportunity to improve system behavior. Use agent-generated incident summaries and post-incident reviews to build institutional knowledge that persists even when team members depart.

---

## Key Terms & Definitions

**Site Reliability Engineering (SRE).** An engineering discipline that treats operations as software engineering, emphasizing automation, monitoring, and systematic problem-solving to achieve system reliability at scale.

**Trace.** The complete journey of a request through a distributed system, composed of multiple spans that represent individual units of work.

**Span.** An individual unit of work within a trace, typically representing one operation or service call, including timing data and metadata.

**Context Propagation.** The practice of carrying unique identifiers (trace IDs) across service boundaries, typically via HTTP headers, to link spans from different services to the same logical request.

**Error Budget.** The permitted amount of downtime or failed transactions before an availability target is violated, calculated as the difference between 100% availability and the agreed-upon availability target.

**Mean Time to Recovery (MTTR).** The average time required to detect, diagnose, and fix a production incident, measured from initial detection to system restoration.

**OpenTelemetry.** A vendor-neutral API and SDK standard for implementing distributed tracing, metrics collection, and log correlation across systems and programming languages.

**Alert Fatigue.** The condition where engineers receive so many alerts that they become desensitized or unable to respond effectively, typically when true issues are drowned out by false positives.

**Knowledge Graph.** A dynamic representation of relationships between system components (pods, nodes, services, databases), enabling discovery of systemic patterns rather than isolated symptoms.

**Multi-Agent System.** A coordinated group of specialized AI agents that work together to solve complex problems, each focusing on different aspects or domains.

**AI-Native Engineering.** An operational model where AI systems are the primary interface for production work, with humans providing judgment and authorization for significant actions.

**50% Rule.** Google SRE's principle that on-call engineers should spend at most 50% of their time on reactive operational work, with the remaining 50% dedicated to engineering work that reduces future operational burden.

**Runbook.** A documented or automated procedure describing the steps to diagnose and resolve a specific type of incident.

---

## References

- Google Site Reliability Engineering. "Introduction to Site Reliability Engineering." https://sre.google/sre-book/introduction/

- Last9. "Traces & Spans: Observability Basics You Should Know." https://last9.io/blog/traces-spans-observability-basics/

- Resolve AI. "Kubernetes Troubleshooting in Resolve AI." https://resolve.ai/blog/kubernetes-troubleshooting-in-resolve-ai

- Resolve AI. "Your New Autonomous Teammate (AI Production Engineer)." https://resolve.ai/blog/product-deep-dive

- Resolve AI. "The Role of Multi-Agent Systems in Making Software Engineers AI-Native." https://resolve.ai/blog/role-of-multi-agent-systems-AI-native-engineering

- Resolve AI. "The Top 5 Benefits of Agentic AI in On-call Engineering." https://resolve.ai/blog/Top-5-Benefits

- CS146S Week 9 README. "Week 9: Agents Post-Deployment."
