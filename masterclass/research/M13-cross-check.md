# M13 Cross-Check: Masterclass vs CS146S

**Audit Date:** March 28, 2026
**Module:** M13 — Team Adoption: Standards, Safety, and Scaling
**Auditor:** Curriculum Research Agent
**Status:** Research-only; no modifications made

---

## Summary

M13 addresses organizational and team-level adoption of Claude Code—permission modes, cost management, developer responsibility, and policy frameworks. CS146S Week 7 focuses on code review quality (both human and AI-assisted). Week 9 addresses post-deployment operations, multi-agent systems, and incident management. Week 10 surveys emerging trends in AI software engineering.

**Key Finding:** M13 and CS146S are complementary but address different adoption layers. M13 focuses on *team culture, governance, and local implementation*. CS146S (Weeks 7–10) focuses on *technical practices and production systems*. There are no direct conflicts. M13 is largely absent from CS146S because it's a *masterclass-specific operational concern*. However, CS146S contains significant material on team dynamics, code review as a cultural practice, and incident management that could strengthen M13's sections on responsibility, review discipline, and operational readiness.

---

## Supported Claims

### Core Principles (Supported in CS146S)

| M13 Claim | CS146S Support | Evidence |
|-----------|----------------|----------|
| **Code review is non-negotiable** | SUPPORTED | Week 7 "Code Reviews: Just Do It" emphasizes code review as "one of the most powerful software quality tools available" with research showing 60% effectiveness vs. 25% for unit testing. M13 states reviews prevent AI from replacing human judgment. |
| **AI doesn't replace developer responsibility** | SUPPORTED | Week 7 "How to Review Code Effectively" emphasizes that human reviewers must validate suggestions and catch context-specific issues AI misses. Week 9 multi-agent systems still require human authorization for critical actions. |
| **Consistency matters at team scale** | SUPPORTED | Week 7 "Code Review Essentials" emphasizes team alignment as the foundation of code review. M13's focus on CLAUDE.md aligns with need for documented standards. |
| **Monitoring and observability enable safe deployments** | SUPPORTED | Week 9 covers SRE principles, traces/spans, and autonomous incident response. M13's emphasis on monthly cost/usage review parallels monitoring discipline. |
| **Testing remains critical** | SUPPORTED | Week 7 "AI Code Review Best Practices" emphasizes that tests provide objective verification; humans can't rely solely on AI suggestions. M13 doesn't elaborate on testing but assumes it's part of "developer owns code." |

---

## Missing from CS146S (Masterclass-only content)

M13 introduces several team-adoption concepts that CS146S does not cover. These are complementary, not conflicting:

| M13 Topic | Why Absent from CS146S | Relevance |
|-----------|------------------------|-----------|
| **Permission Modes (Normal, Auto-Accept, Plan)** | CS146S assumes tool-agnostic practices; doesn't dive into Claude Code configuration | M13's three-mode taxonomy is Claude Code–specific. This is operational governance, not CS146S scope. |
| **Cost Budgets & Monitoring** | CS146S focuses on development practices, not organizational cost management | M13 is pragmatic: "One dev = $50/month; 20 devs = $10,000+/month." Essential for teams but beyond CS146S scope (which is educational). |
| **CLAUDE.md as Team Artifact** | CS146S covers code review, testing, and SRE practices but not team policy documentation | M13's CLAUDE.md is a *governance artifact*—analogous to CONTRIBUTING.md but for AI usage. No CS146S equivalent. |
| **Dogfooding Principle (Warp example)** | CS146S discusses team practices but doesn't reference using your own tools to understand user pain | M13 borrows this from Warp: "If you adopt Claude Code, your team should use it." Cultural best practice, not covered in CS146S. |
| **Red Flags & Escalation Policy** | CS146S covers incident response but not escalation paths for policy violations | M13's escalation template (cost spike → pause usage; security concern → security team) is team-specific governance. |
| **Skill Atrophy Risk & Mitigation** | CS146S doesn't explicitly address risk of over-reliance on AI | M13 notes "risk of over-relying on AI; ensure developers still learn fundamentals." Important team dynamic but not in CS146S curriculum. |
| **What NOT to Use Claude Code For** | CS146S covers secure practices broadly but doesn't catalog specific don'ts | M13 explicitly lists: untrusted code, production DB changes, secrets, replacing code review, high-pressure initial training. Actionable team guardrails. |

---

## Conflicts / Discrepancies

**None identified.**

All claims in M13 align with or complement CS146S materials. Where M13 and CS146S overlap (code review, testing, responsibility), they reinforce each other. No contradictions found.

---

## CS146S Topics Not in Masterclass M13

These CS146S topics are relevant to team adoption but not directly addressed in M13. They could strengthen the module:

### Week 7 — Code Review (Not in M13)

| Topic | CS146S Content | Potential M13 Application |
|-------|-----------------|---------------------------|
| **Code review taxonomy** | "Good reviews are specific, actionable, reference existing patterns. Bad reviews are vague or lack clarity." (GitHub staff engineer) | M13 could add guidance on AI-code review expectations: *"AI code review catches style/obvious bugs; human review validates architecture and correctness."* This mirrors M13's "AI review finds candidates; humans review for architecture." |
| **Affirmation in reviews** | Week 7 emphasizes praising good code alongside criticism | M13 could note team culture risk: developers may resent AI-generated code; positive framing matters. |
| **Review velocity trade-offs** | Week 7 discusses reducing PR size, using feature flags, and draft PRs to speed review | M13 could recommend: *"Smaller AI-generated commits are easier to review. Consider Auto-Accept mode for low-risk changes (file creation, simple refactors); Normal mode for architecture changes."* |
| **Preventing approval bias** | Week 7: *"Everyone makes mistakes; tests remove bias."* | M13 could strengthen testing emphasis: *"AI code requires the same rigor as hand-written code. Bias toward 'AI wrote it, so it's probably safe' is dangerous."* |

### Week 9 — Operations & Incident Response (Partially in M13)

| Topic | CS146S Content | Potential M13 Application |
|-------|-----------------|---------------------------|
| **Error budgets** | SRE principle: define realistic availability targets, not 100% uptime | M13 could frame cost budgets as analogous to error budgets: *"Set monthly cost limits as a 'development budget.' Overspending signals process breakdown, like an error budget breach."* |
| **Monitoring for incident response** | Week 9 emphasizes traces, spans, dashboards, and autonomous agents detecting issues | M13 only mentions "cost monitoring tools." Could expand: *"Monitor Claude Code usage patterns (not just cost): e.g., one developer spiking to 10x normal usage may indicate misuse or a stalled project. Use patterns as early warning signals."* |
| **Multi-agent systems in production** | Week 9 discusses how agents collaborate to debug complex systems (Resolve AI example) | M13 doesn't address AI-assisted debugging/SRE. Could note: *"Just as multi-agent systems improve production troubleshooting, your team needs diverse perspectives: new devs pair with experienced ones, AI suggestions are reviewed by humans."* |
| **Institutional knowledge preservation** | Week 9: *"When experts leave, static runbooks become obsolete; learning agents preserve knowledge."* | M13 touches on this: *"Knowledge preservation: workflows documented in prompts, not just people's heads."* Could expand with Week 9's emphasis: *"Use Claude Code as a knowledge-transfer tool: pair new devs with experienced ones to build shared prompts."* |
| **Change management discipline** | SRE: ~70% of outages stem from changes; automated progressive rollouts minimize impact | M13 emphasizes: "Don't ask Claude to do production DB changes directly." Could strengthen: *"Progressive rollouts reduce risk. Use Plan mode in CI/CD to analyze Claude's suggestions before applying; use staging for testing AI-generated SQL."* |

### Week 10 — Future Trends (Not in M13)

| Topic | CS146S Content | Potential M13 Application |
|-------|-----------------|---------------------------|
| **Future of human roles** | Week 10 asks: "What will engineers do in 10 years?" | M13 could future-proof guidance: *"Claude Code will improve. Your team's role shifts from coding boilerplate to architectural decisions, security review, and integration. Build skills accordingly."* |

---

## Prioritized Recommendations for Improvement

### Priority 1: High Impact, Feasible (Add to M13)

#### 1.1 **Code Review Intensity for AI-Generated Code**
**Current M13 state:** "AI review finds candidates; humans review for architecture, correctness, maintainability."
**Recommendation:** Add specificity from CS146S Week 7.

**Add to M13 "What NOT to Use Claude Code For" section:**
```
❌ Skipping Code Review
- Don't assume AI-generated code is safer than hand-written code
- Don't use "looks fine" as code review
- Instead: Apply rigorous review. Use tests as objective verification, not reviewer credibility.
  CS146S research shows code review catches 60% of defects; your team review discipline doesn't
  change when AI is involved.
```

#### 1.2 **Usage Patterns as Leading Indicators**
**Current M13 state:** "Monitor usage: track API calls, token consumption, cost per project."
**Recommendation:** Add anomaly detection from CS146S SRE principles.

**Add to Cost Management section:**
```
### Monitor Usage Patterns, Not Just Spending

Cost budgets are your "error budget" for development velocity. But also watch for usage anomalies
that signal problems:
- One developer's cost spiking 10x: burnout risk, or misusing Claude for non-coding tasks?
- Consistent underuse by new hire: onboarding gaps, or not trained?
- Tool use spiking on Friday night: deadline panic, or healthy async work?
- Patterns shifting team-wide: culture change worth investigating.

**Monthly review process update:**
  [ ] Pull usage data
  [ ] Check budgets
  [ ] **Spot anomalies: unusual user spikes, off-hours patterns, high-cost-per-task shifts**
  [ ] Check for correlation with deployments, releases, or team changes
  [ ] Identify trends
  [ ] Update team
  [ ] Revise policies
```

#### 1.3 **Knowledge Preservation via Shared Prompts**
**Current M13 state:** "A shared repository or document for best prompts, discovered patterns, and lessons learned."
**Recommendation:** Strengthen connection to Week 9 institutional knowledge principle.

**Expand the "Shared Prompts" section:**
```
# Shared Prompts & Patterns

Your prompt library is institutional knowledge. When an experienced developer discovers
a pattern (e.g., "upgrade React imports," "debug N+1 queries"), document it:

## Template

- **Name:** [Human-friendly name]
- **Prompt:** [Exact wording that works well]
- **Use case:** [When to use]
- **Cost:** [$0.02 per file, or 5 min saved per invocation]
- **Author:** [Developer name]
- **Last validated:** [Date]
- **Lessons learned:** [Gotchas, edge cases]

When a team member leaves or rotates to a new project, their expertise doesn't vanish—
it lives in these prompts. New devs can replicate senior patterns immediately.
```

#### 1.4 **Risk-Proportionate Permission Modes**
**Current M13 state:** Describes three modes (Normal, Auto-Accept, Plan) but doesn't give decision framework.
**Recommendation:** Add context-driven guidance from CS146S code review principles.

**Add to "Permission Modes and Their Trade-offs" section:**
```
### Choosing the Right Mode: A Decision Framework

**Use Normal Mode (Safe but Slow) for:**
- Production changes or anything that touches customer data
- Architectural decisions or significant refactors
- New developer onboarding (builds judgment before speed)
- Unfamiliar codebases

**Use Auto-Accept Mode (Faster, Requires Discipline) for:**
- Well-tested, routine tasks (boilerplate generation, config updates)
- Teams with strong code review culture and test suites
- Non-critical projects (prototypes, docs, internal tools)
- Developers who've earned trust through consistent outputs

**Use Plan Mode (Safe, Non-interactive) for:**
- CI/CD analysis gates (flag risky patterns before merge)
- Security scanning (detect secrets, vulnerable patterns)
- Code review prep (generate suggestions for human review)
- Automated reporting

**Principle:** Risk should match automation. Higher risk = more human approval gates.
```

---

### Priority 2: Valuable But Requires Expansion (Add contextual references)

#### 2.1 **Testing Rigor for AI-Generated Code**
**Current M13 state:** Assumes testing but doesn't emphasize it.
**Recommendation:** Add explicit connection to CS146S evidence.

**In "The Principle: Developer Owns All Code" section, add:**
```
### Testing: Your Primary Verification Tool

You are responsible for testing AI-generated code. CS146S research shows:
- Unit testing catches 25% of defects
- Code review catches 60%
- **Combined (review + testing) catch >80%**

Don't rely on code review alone to validate AI suggestions. Tests are your objective evidence.
Use AI to generate tests too, but ensure coverage matches your team's standards.
```

#### 2.2 **Progressive Rollout Discipline**
**Current M13 state:** Not mentioned.
**Recommendation:** Add SRE principle from CS146S Week 9.

**In "Production Database Changes" section, expand to:**
```
**❌ Production Database Changes**
- Don't ask Claude to modify production databases directly
- Too risky; one wrong query damages real data
- Instead:
  1. Claude generates the SQL
  2. Human reviews AND tests on staging (automated blue-green preferred)
  3. Progressive rollout (canary or feature flag, not all-at-once)
  4. Monitor for 30 min before full rollout
  5. Rollback plan ready
```

#### 2.3 **Observability for Debugging**
**Current M13 state:** Not mentioned.
**Recommendation:** Optional extension for mature teams (CS146S Week 9).

**New subsection: "Debugging at Scale: AI-Assisted SRE" (optional advanced module)**
```
As your team scales, you'll use Claude Code not just for development but for production
troubleshooting. Week 9 of CS146S covers agentic AI in incident response. Key principles:
- Traces and spans document requests across services
- Autonomous agents can generate and test hypotheses in parallel
- Your team's on-call discipline should evolve: from manual log hunting to
  AI-assisted root cause analysis with human authorization gates
```

---

### Priority 3: Forward-Looking (Consider for M13 evolution)

#### 3.1 **Team Dynamics: Pressure & Burnout**
**Current M13 state:** Mentions "Pressure to keep up: 'Why aren't you using Claude Code?'"
**Recommendation:** Deepen this from CS146S's emphasis on sustainable practices.

**Future section:** "Team Culture Antipatterns"
```
Avoid these team dynamics patterns:
- **Speed culture:** Overvaluing velocity gained from Claude Code without emphasizing quality
- **Competence anxiety:** Junior devs feeling inadequate when seniors use AI effectively
- **Copy-paste adoption:** Teams adopting Claude Code but not investing in training/review discipline
- **False autonomy:** Developers using Auto-Accept mode on unfamiliar code

CS146S Week 7 emphasizes that code review is about *team alignment*, not just catching bugs.
When adopting Claude Code, reinforce: we're using AI to get better at hard problems, not to
avoid thinking.
```

#### 3.2 **AI Safety Beyond Secrets**
**Current M13 state:** Addresses secrets management.
**Recommendation:** Consider expanding (if M13 evolves to include more security).

**Future deepening:** "Security & Reliability Audit Checklist"
```
When Claude Code deploys to production, conduct a lightweight security audit:
- [ ] Are secrets referenced as env vars, never pasted?
- [ ] Does the code follow your team's SQL parameterization standard?
- [ ] Are untrusted inputs validated?
- [ ] Does the change require a security review? (Ask security team)
- [ ] Is a rollback plan documented?

This isn't replacing your security process; it's ensuring AI-generated code meets the same
standards as hand-written code.
```

---

## CS146S Specific Content Gaps Relative to M13

**One-way gaps** (M13 has content absent from CS146S; expected given different scopes):

1. **Cost management at team scale** — M13 is unique in calculating per-developer costs and setting budgets. CS146S assumes free/shared institutional access.

2. **Permission modes as organizational policy** — Claude Code–specific governance not covered in CS146S.

3. **Dogfooding principle applied to teams** — M13 borrows from Warp; CS146S doesn't reference this cultural practice.

4. **Escalation paths for policy violations** — M13 defines governance escalation; CS146S covers incident escalation but not adoption governance.

5. **New-hire onboarding for AI teams** — M13 includes a checklist; CS146S assumes learners are already training themselves.

**These gaps are appropriate:** M13 is operational/governance-focused; CS146S is technical/pedagogical. No synthesis required.

---

## Table of Alignment Matrix

| Dimension | M13 Focus | CS146S Support | Conflict? | Recommendation |
|-----------|-----------|----------------|-----------|-----------------|
| Code Review Culture | Reviews prevent AI from replacing judgment | Week 7 strong support | No | ✓ Add specificity: AI-code review requires full rigor |
| Developer Ownership | Developers own all code | Week 7 reinforces | No | ✓ Strengthen testing emphasis |
| Testing Discipline | Assumed but not detailed | Week 7 empirical data | No | ✓ Add evidence: review + testing catch >80% defects |
| Team Dynamics | Velocity, pressure, skill atrophy | Week 7, 9 implicit | No | ✓ Consider future section on antipatterns |
| Cost Governance | M13-specific (no CS146S parallel) | N/A | No | — M13 is unique here |
| Permission Modes | M13-specific (no CS146S parallel) | N/A | No | ✓ Add risk-proportionate decision framework |
| SRE / Observability | M13 mentions monitoring only | Week 9 deep coverage | No | ✓ Consider advanced optional section |
| Post-Deployment | Not addressed in M13 | Week 9 central | No | Consider future "M13.5" on production readiness |
| Change Management | Implicit in "no prod DB changes" | Week 9 detailed (70% outages from changes) | No | ✓ Add progressive rollout discipline |

---

## Conclusion

**M13 is pedagogically sound and aligns with CS146S.** The module focuses on a critical gap: how teams adopt AI tools *organizationally*, which CS146S doesn't address. M13's emphasis on governance (CLAUDE.md, budgets, escalation, permission modes) is complementary to CS146S's technical practices (code review, testing, incident response).

**Four high-confidence recommendations for strengthening M13:**
1. Emphasize code review rigor for AI-generated code (Week 7 evidence)
2. Add usage pattern anomaly detection to cost monitoring (SRE principles)
3. Deepen knowledge preservation via shared prompts (institutional memory)
4. Provide risk-proportionate decision framework for permission modes

**One optional future direction:**
- Consider a "M13 Advanced" module on production readiness and AI-assisted SRE, drawing from CS146S Week 9.

**No conflicts detected.** M13 and CS146S are complementary.

---

## References

### CS146S Materials Reviewed
- Week 7: Code Reviews Just Do It (Coding Horror)
- Week 7: How to Review Code Effectively (GitHub Staff Engineer)
- Week 7: AI Code Review Best Practices (Graphite)
- Week 7: Code Review Essentials (Blake Smith)
- Week 9: Introduction to Site Reliability Engineering (Google SRE)
- Week 9: Your New Autonomous Teammate (Resolve AI)
- Week 9: Role of Multi-Agent Systems (Resolve AI)
- Week 9: Benefits of Agentic AI in On-call Engineering (Resolve AI)
- Week 9: Observability Basics (Last9)
- Week 9: Kubernetes Troubleshooting with AI (Resolve AI)
- Week 10: What's Next for AI Software Engineering (Overview)

### M13 Module
- M13-Team-Adoption.md (Full Module)

