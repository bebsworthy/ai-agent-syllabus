# M02 Synthesis: Prompt Engineering

**Module Grade:** B+ (solid foundation with critical gaps in emerging techniques and factual corrections needed)

**Research Date:** March 2026

---

## Executive Summary

The M02 Prompt Engineering module provides strong, actionable coverage of core prompting techniques (zero-shot, few-shot, chain-of-thought, meta-prompting, RAG, self-consistency) with valuable practical frameworks (Devin's four principles, model selection guidance). The module is well-grounded in published research and Anthropic's early best practices, making it an excellent tactical execution guide for prompting. However, the module has become significantly outdated relative to the September 2025–March 2026 landscape. Three critical issues require immediate attention: (1) pricing data for Claude models is incorrect (Opus 4.6 and Haiku both need correction), (2) extended thinking—a fundamental paradigm shift released May 2025—is entirely absent, and (3) Claude 4.x's new literal instruction-following behavior changes how prompts must be written. Additionally, the module underemphasizes context engineering, hallucination risks, and production security patterns. Despite these gaps, the core techniques remain valid; targeted additions rather than a wholesale rewrite are needed.

---

## Cross-Agent Findings (Convergent Issues)

Issues flagged by 2+ research agents (highest priority):

### 1. Extended Thinking is Missing (Agents 2 & 3)
- **Agent 2 (Additional-Info)**: Mentions effort levels hint at computational trade-offs but doesn't explain "reasoning tokens."
- **Agent 3 (More-Info)**: Flags extended thinking as "paradigm shift" from prompt-based reasoning to architectural feature; released May 2025 for Opus/Sonnet 4, September 2025 for Sonnet 4.5 (now a small-model capability).
- **Convergence**: Both agents identify extended thinking as a major recent development that fundamentally changes how prompting strategy works. This is not a refinement—it's a breaking change in the reasoning approach.
- **Impact**: HIGH. Developers using Claude Code are likely using Sonnet 4.5+, which has native extended thinking. The module doesn't explain when to use it or why it matters.

### 2. Model Pricing is Incorrect (Agents 1 & 2)
- **Agent 2 (Additional-Info)**: Current pricing (March 2026) is Haiku $1/1M (module says $0.80) and Opus 4.6 is $5/1M (module says $15/1M).
- **Agent 1 (Cross-Check)**: Notes that Sonnet pricing ($3/1M) is correct and provides cost/speed table.
- **Convergence**: Both agents confirm pricing errors. Agent 2 has the exact current figures.
- **Impact**: CRITICAL for decision-making. The $15 Opus figure makes it look 3x more expensive than it actually is (Sonnet is now only 3x cheaper, not 5x).

### 3. Hallucination Handling is Underdeveloped (Agents 1 & 2)
- **Agent 1 (Cross-Check)**: Notes module mentions hallucination only under RAG failure modes; CS146S treats it as systematic risk requiring verification.
- **Agent 2 (Additional-Info)**: Flags RAG context quality limitation ("confidently incorrect answers") and notes Contextual Retrieval can mitigate this.
- **Convergence**: Both agents see hallucination as under-addressed. The module treats it as a context problem; research shows it's also a model-limitation problem requiring systemic verification.
- **Impact**: HIGH. Developers need explicit guidance on detection (code doesn't run, functions don't exist) and verification strategies.

### 4. Chain-of-Thought is Domain-Specific, Not Universal (Agents 1 & 2)
- **Agent 1 (Cross-Check)**: Notes CoT is mentioned but CS146S doesn't emphasize its limits.
- **Agent 2 (Additional-Info)**: Provides research showing CoT excels at math/logic but smaller gains on language understanding, classification, and clinical tasks. Can actually hurt performance in some domains.
- **Convergence**: Both agents identify CoT as beneficial in the module but research shows it's task-dependent. The module presents it as universally helpful for "complex logic, debugging, optimization."
- **Impact**: MEDIUM-HIGH. Developers might waste effort on CoT for tasks where it doesn't help.

### 5. Meta-Prompting (Personas) Has Mixed Research Support (Agents 1 & 2)
- **Agent 1 (Cross-Check)**: Notes meta-prompting is presented as uniformly beneficial.
- **Agent 2 (Additional-Info)**: Research shows personas in system prompts do NOT improve performance; expert personas may reduce factual accuracy.
- **Convergence**: Both agents flag the module as overstating meta-prompting effectiveness without caveats.
- **Impact**: MEDIUM. Personas might not help in many cases and could harm accuracy.

### 6. The 80/20 Rule Lacks Empirical Support (Agent 2 only, but confirmed by cross-research)
- **Agent 2 (Additional-Info)**: Module claims "50–80% time savings"; empirical research documents 10–20% productivity gains (RCT on 300 translators, systematic literature review).
- **Impact**: MEDIUM-HIGH. The claim is significantly overstated. Actual gains are more modest.

### 7. Context Engineering is Underemphasized (Agents 1 & 3)
- **Agent 1 (Cross-Check)**: Notes missing content on CLAUDE.md, system-reminder patterns, context front-loading.
- **Agent 3 (More-Info)**: Mentions static-first, dynamic-last for prompt caching; layered prompting hierarchy.
- **Convergence**: Both agents recognize that context infrastructure (not just prompt technique) is foundational.
- **Impact**: HIGH. The module focuses on prompt structure but underplays context engineering discipline.

---

## Factual Corrections Required

### 1. Model Pricing (URGENT)
| Item | Module States | Correct (March 2026) | Error |
|------|---------------|----------------------|-------|
| Haiku 4.5 input cost | $0.80/1M | $1/1M | 25% increase (outdated) |
| Sonnet 4.6 input cost | $3/1M | $3/1M | ✓ Correct |
| Opus 4.6 input cost | $15/1M | $5/1M | Wrong model conflated—this is old Opus 4 pricing |

**Correction**: Update pricing table immediately. Opus 4.6 includes 1M context at standard pricing, a major cost reduction.

### 2. Chain-of-Thought Effectiveness
**Module states**: "When it works: Complex logic, debugging, optimization, any task where the reasoning matters."

**Correct**: CoT is most effective for math and symbolic reasoning. Benefits are much smaller (or negative) on language understanding, clinical text, and other domains. Research: Wei et al. 2023 (foundational), "To CoT or not to CoT?" 2024.

**Correction**: Add caveat: "CoT excels at math and symbolic reasoning. On language understanding, classification, and domain-specific tasks, test whether CoT helps before relying on it."

### 3. Meta-Prompting (Personas)
**Module states**: "When it works: When you want Claude to adopt a specific persona or framework." (presented as broadly applicable)

**Correct**: Research shows personas in system prompts do NOT universally improve accuracy. Expert personas may reduce factual accuracy while improving perceived alignment.

**Correction**: "Persona-based prompting can help with some tasks (theory-of-mind, role-playing) but doesn't universally improve accuracy. Test whether your use case benefits before relying on personas."

### 4. The 80/20 Rule / Productivity Gains
**Module states**: "Claude handles ~80% of a task... This translates to roughly 50–80% time savings on routine work."

**Correct**: Empirical research (RCT, systematic literature review) documents 10–20% productivity improvements, not 50–80%.

**Correction**: "Research shows LLM assistance typically delivers 10–20% productivity improvements on coding and professional tasks. This means a 6-hour task becomes roughly 5 hours, not 1.5 hours. Gains are task-dependent."

### 5. Few-Shot Recommendations (Outdated, not wrong)
**Module states**: "Provide 1–3 examples."

**Note**: This is conservative and safe, but outdated for 1M-token context windows. Modern systems benefit from many-shot learning (hundreds of examples) with diminishing returns.

**Correction**: Add: "With modern 1M-token context windows, you can use dozens or hundreds of examples (many-shot learning) for better performance, but watch for over-prompting where too many examples degrade results."

---

## Content Gaps

Ranked by priority:

### Priority 1 — Missing Critical Topics

1. **Extended Thinking (Reasoning Tokens)**
   - What: Native reasoning feature released May 2025 (Opus 4/Sonnet 4), expanded September 2025 (Sonnet 4.5).
   - Why: Paradigm shift from prompt-based "let me think" to architectural feature with explicit reasoning token budgets.
   - Where: Belongs in core section, explaining how it relates to effort levels and chain-of-thought.
   - Impact: Developers using Sonnet 4.5+ are already using this; not understanding it means suboptimal usage.

2. **Claude 4.x Literal Instruction-Following Behavior**
   - What: September 2025 behavior change—Claude no longer infers intent or expands vague requests; takes instructions literally.
   - Why: Improves predictability and reduces hallucinations in agent contexts.
   - Where: Add callout or principle highlighting that Devin's "Specify Approach, Not Outcome" is now a hard requirement, not best practice.
   - Impact: Vague prompts that worked on earlier models now produce underwhelming results.

3. **Hallucination Detection and Verification**
   - What: Systematic strategies for detecting hallucinations (code doesn't run, functions don't exist, facts are unverifiable).
   - Why: Hallucinations are a core limitation (pattern matching without fact-checking), not an edge case.
   - Where: New subsection under "Realistic Expectations" or integrated into RAG section.
   - Impact: Developers need practical detection checklists and verification workflows.

4. **Context Engineering: CLAUDE.md and Persistent Context**
   - What: Creating shared rulebooks (CLAUDE.md) for coding standards, architectural decisions, review checklists.
   - Why: CS146S Week 4 emphasizes context engineering as foundational; context quality is THE primary driver of output quality.
   - Where: New section on "Persistent Prompting Context" with template examples.
   - Impact: Without this, prompts remain tactical; with it, they become strategic.

5. **Prompt Injection Security and Untrusted Content**
   - What: How to handle malicious input embedded in documents, code, or external sources (OWASP LLM01:2025).
   - Why: Critical for production Claude Code and agent usage; developers must understand threat model.
   - Where: New security subsection or callout box.
   - Impact: HIGH for responsible AI usage; missing entirely from current module.

### Priority 2 — Important New Techniques

6. **Structured Outputs and JSON Schema**
   - What: API-level feature that constrains output to schema-compliant JSON, eliminating parsing errors.
   - Why: Production technique for tasks where output must be machine-readable and validated.
   - Where: Subsection under output techniques.
   - Impact: Reduces hallucinations related to format compliance.

7. **Prompt Caching (Static-First, Dynamic-Last)**
   - What: Reuse identical prompt prefixes to reduce cost by 50–60% (10% cost for cached tokens on reuse).
   - Why: Major cost/latency optimization for RAG and repeated prompts with large static context.
   - Where: Subsection under model selection or effort levels.
   - Impact: Changes cost/quality trade-off calculations.

8. **XML Thinking Tags and Structured Reasoning**
   - What: Using `<thinking>`, `<answer>`, `<analysis>`, `<implementation>` tags to structure reasoning.
   - Why: Now part of Anthropic's official best practices hierarchy; improves clarity and reduces errors.
   - Where: New technique or integration into chain-of-thought.
   - Impact: MEDIUM; part of Anthropic's 5-level hierarchy.

9. **Anthropic's Prompting Best Practices Hierarchy**
   - What: Official 5-level priority (Clarity → Examples → CoT → XML Tags → Roles).
   - Why: Provides structured guidance on which techniques to use and in what order.
   - Where: Reorganize "Named Techniques" section to follow this hierarchy.
   - Impact: Gives readers a decision framework instead of a flat list.

### Priority 3 — Emerging/Advanced Topics

10. **Agent Prompting and Tool Use (ReAct Pattern)**
    - What: Modern agents use API-native tool calling; the text-based ReAct pattern is now abstracted.
    - Why: As Claude Code and agents become standard, understanding this shift is important.
    - Where: Intro or "Next Steps" section; full coverage likely belongs in M03/M04.
    - Impact: LOW for direct prompting; HIGH for understanding agent architecture.

11. **Vision/Multimodal Prompting**
    - What: Claude supports images (up to 600); best practice is to place images before text.
    - Why: Opens code review, diagram analysis, UI feedback use cases.
    - Where: Brief mention in "Next Steps"; full coverage in M03/M04.
    - Impact: Increasingly relevant but beyond scope of "prompt engineering fundamentals."

12. **Many-Shot Learning Refinements**
    - What: With 1M context windows, hundreds/thousands of examples are now feasible.
    - Why: Recent research shows many-shot can outperform few-shot; also demonstrates over-prompting risk.
    - Where: Update few-shot section with "many-shot" caveat.
    - Impact: LOW; nice-to-have refinement.

13. **Conversational Few-Shot Formatting**
    - What: Present examples as multi-turn dialogue (User → Assistant) rather than block format.
    - Why: Some research suggests this works better for chat-based models on formatting/convention tasks.
    - Where: Subsection of few-shot; note it as emerging best practice.
    - Impact: LOW; task-dependent.

---

## Outdated Content

1. **Pricing Table** — Haiku and Opus costs are wrong. Update immediately.

2. **Few-Shot Guidance** — "1–3 examples" is conservative for modern 1M-context models. Add many-shot note.

3. **Effort Levels Explanation** — Doesn't explain that `/effort high|max` may internally use extended thinking or reasoning tokens. Update to clarify relationship.

4. **No Mention of Literal Instruction-Following** — Claude 4.x behavior is fundamentally different; module doesn't reflect this breaking change.

5. **No Mention of Extended Thinking as First-Class Feature** — Module treats reasoning as prompt-based only; extended thinking is now architectural.

---

## Strengths to Preserve

1. **Clear Coverage of Core Techniques** — Zero-shot, few-shot, chain-of-thought, RAG, self-consistency are well-explained with when/why/cost guidance.

2. **Devin's Four Prompting Principles** — Valuable production framework (Specify approach, indicate starting points, defensive prompting, feedback mechanisms). Even more relevant post-September 2025 as literal instruction-following is enforced.

3. **Decision Frameworks** — Model selection table (even with price corrections), effort levels guidance, and 80/10/5% allocation heuristic are practical and actionable.

4. **Clear Takeaway Structure** — Habits, checklists, templates make the module immediately usable.

5. **Balanced Tone** — Module acknowledges trade-offs and limitations without overselling; this is a strength that should be maintained.

6. **Practical Examples** — Real-world use cases for each technique ground abstract concepts.

---

## Prioritized Improvement Plan

### Priority 1 — Must Fix (Errors / High-Impact Gaps)

1. **Correct Model Pricing** (2 hours)
   - Update: Haiku $0.80 → $1/1M, Opus $15 → $5/1M
   - Clarify: Opus 4.6 now includes 1M context at standard pricing
   - Update cost comparison table and 90/5/5% rule context

2. **Add Extended Thinking Section** (3–4 hours)
   - Explain what extended thinking is (explicit reasoning tokens, May 2025 release)
   - Differentiate from chain-of-thought prompting (architectural feature vs. prompt technique)
   - When to use: complex debugging, architecture decisions, hard math/logic problems
   - Cost/speed trade-off: slower, higher token usage, but much better accuracy on reasoning tasks
   - How it relates to effort levels (`/effort high|max` may use extended thinking internally)
   - Example showing same task without/with extended thinking
   - Note: Sonnet 4.5 now offers this at affordable cost (not just Opus)

3. **Add Claude 4.x Literal Instruction-Following Callout** (1–2 hours)
   - Highlight behavior change (September 2025): Claude no longer infers intent
   - Note that vague prompts now produce underwhelming results
   - Emphasize: Devin's "Specify Approach, Not Outcome" is now mandatory, not optional
   - Example contrast: "Refactor this" (fails) vs. "Refactor by extracting PaymentProcessor class" (works)

4. **Create "Hallucination Detection and Verification" Subsection** (2–3 hours)
   - Explain what hallucinations are (pattern matching without fact-checking)
   - Detection strategies: code doesn't run? function name doesn't exist? fact unverifiable? likely hallucination
   - Verification checklist: test code, cross-check with docs, search codebase
   - Integration with RAG and context quality

5. **Add "Prompt Security: Handling Untrusted Content"** (1–2 hours)
   - Brief overview of prompt injection (OWASP LLM01:2025)
   - Mark external sources: "This code is from an untrusted source"
   - RAG security: only retrieve from trusted sources
   - Principle of least privilege for Claude Code file/API access
   - Real example of injection attack and defense

6. **Revise CoT Claim with Domain-Specificity Note** (1 hour)
   - Add: "CoT excels at math and symbolic reasoning but smaller gains on language understanding, classification, clinical text. Test whether CoT helps your task."
   - Cite research: "To CoT or not to CoT?" 2024

7. **Revise Meta-Prompting (Personas) with Research Caveats** (1 hour)
   - Add: "Personas don't universally improve accuracy; expert personas may reduce factual correctness. Test whether your use case benefits."
   - Cite research: "When A Helpful Assistant Is Not Really Helpful" 2023

8. **Revise 80/20 Rule and Productivity Claims** (1–2 hours)
   - Change "50–80% time savings" to "typical 10–20% productivity improvements"
   - Clarify: 6-hour task becomes 5 hours, not 1.5 hours
   - Acknowledge gains are task-dependent (larger for less skilled workers, smaller for complex reasoning)

### Priority 2 — Should Add (Significant Improvements)

9. **Add Section: Persistent Prompting Context (CLAUDE.md)** (3–4 hours)
   - Explain CLAUDE.md as shared rulebook with Claude
   - Template: coding standards, architectural decisions, review checklists, known gotchas
   - Example CLAUDE.md for Express API project or React app
   - Link to CS146S Week 4 context engineering

10. **Add Section: Structured Outputs and JSON Schema** (2–3 hours)
    - What it is: API-level output constraint using JSON schema
    - When to use: any task where output must be machine-readable and validated
    - Example: extract function signatures with guaranteed JSON compliance
    - Note: pairs well with few-shot examples in schema definition

11. **Add Subsection: Prompt Caching for Cost Reduction** (2–3 hours)
    - Explain: cache static prefix, pay 10% for cached tokens on reuse
    - When: RAG with large static context (schema, docs, codebase)
    - Best practice: static-first, dynamic-last prompt structure
    - Cost example: 50KB schema cached reduces subsequent request costs by 50–60%

12. **Add Section: XML Thinking Tags and Structured Reasoning** (2–3 hours)
    - Use `<thinking>`, `<analysis>`, `<implementation>` tags to structure outputs
    - Why: Anthropic's official best practice; improves clarity, reduces errors
    - Example: use tags to separate phases of code refactoring
    - Note: part of Anthropic's 5-level prompting hierarchy

13. **Reorganize Around Anthropic's Prompting Hierarchy** (2–3 hours)
    - Reorder sections: Clarity → Examples → CoT → XML Tags → Roles
    - Note: this is official Anthropic priority order
    - Clarify: don't skip levels; start with clarity, then add complexity

14. **Expand RAG Section with Contextual Retrieval** (1–2 hours)
    - Add: modern best practice is contextual embeddings (Anthropic's technique)
    - Reduce retrieval failures by 67% by including surrounding context in chunks
    - Explain: document chunking without context causes 49% retrieval failures

15. **Add Two-Stage Prompting for Complex Features** (2–3 hours)
    - Show: Ask Mode (write plan first) then Code Mode (implement plan)
    - Example: "Build user authentication" → design → implement → rate limit → test
    - Why: reduces scope creep and hallucinations on large tasks

### Priority 3 — Nice to Have (Minor Enhancements)

16. **Add Note on Many-Shot Learning** (1 hour)
    - Modern 1M-context enables hundreds/thousands of examples
    - Reference: many-shot outperforms few-shot on some tasks; watch for over-prompting

17. **Add Conversational Few-Shot Formatting Note** (1 hour)
    - Emerging best practice: present examples as multi-turn dialogue
    - User → Assistant → User → Assistant format may work better for chat-based models

18. **Brief Intro to Agent Prompting (ReAct)** (1 hour)
    - Modern agents use API-native tool calling, not text-based patterns
    - Note: full coverage in M03/M04

19. **Note on Vision/Multimodal Prompting** (30 min)
    - Claude supports images; place before text
    - Use case: screenshot → analysis, architecture diagrams
    - Full coverage in M03/M04

20. **Expand "Self-Consistency for Edge Cases" with Concrete Example** (1 hour)
    - Current description is abstract
    - Provide: "Method 1: Find all validation. Method 2: Search for 'validate'. Compare."

21. **Add "When Not to Use Each Technique" Guidance** (2 hours)
    - Zero-shot: fails on domain-specific tasks; use few-shot instead
    - CoT: not beneficial on language understanding; test first
    - Meta-prompting: doesn't universally improve accuracy

---

## Source Summary

**Most Credible Sources Cited Across All Three Reports:**

### Research & Theory
- Wei et al. 2023: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (foundational)
- Brown et al. 2020: "Language Models are Few-Shot Learners" (foundational)
- Wang et al. 2022: "Self-Consistency Improves Chain of Thought Reasoning" (foundational)
- Kojima et al. 2022: "Large Language Models are Zero-Shot Reasoners"
- "To CoT or not to CoT?" 2024: Domain-specificity of CoT
- "When A Helpful Assistant Is Not Really Helpful" 2023: Meta-prompting skepticism
- "Retrieval-Augmented Generation for Large Language Models: A Survey" 2023

### Official Anthropic Documentation
- Anthropic: Prompting Best Practices (5-level hierarchy)
- Anthropic: Extended Thinking Documentation (May 2025+)
- Anthropic: Structured Outputs Docs
- Anthropic: Vision Documentation
- Anthropic: Contextual Retrieval Announcement
- Anthropic: Pricing (current March 2026)

### Empirical Studies
- "Scaling Laws for Economic Productivity" (RCT, 300 translators): 16% productivity gains
- "The Impact of LLM-Assistants on Software Developer Productivity: A Systematic Literature Review": 10–20% gains
- "The Few-shot Dilemma: Over-prompting Large Language Models" 2024: Over-prompting phenomenon

### Security & Best Practices
- OWASP: LLM Prompt Injection Prevention Cheat Sheet
- Google Security Blog: Mitigating Prompt Injection (June 2025)
- Microsoft: Defending Against Indirect Prompt Injection (July 2025)
- OWASP Gen AI Security: LLM01:2025 Prompt Injection

### Product & Technical Sources
- AWS Bedrock: Extended Thinking & Prompt Caching Docs
- Anthropic: Claude Sonnet 4.5 Release Notes (September 2025)
- DreamHost: Tested 25 Claude Prompt Techniques
- IntuitionLabs: Claude Sonnet 4.5 Code 2.0 Features

---

## Integration Notes

**Relationship to CS146S:**
- M02 is strongest as a *tactical execution guide* (how to prompt).
- CS146S Week 1 provides *theoretical foundation* (why techniques work; LLM mechanics).
- CS146S Week 4 provides *architectural patterns* (context engineering, CLAUDE.md, verification).
- Module should explicitly signal: "M02 teaches prompting techniques; CS146S teaches why they work and how to sustain them at scale."

**Integration with Masterclass Curriculum:**
- M02 assumes direct interaction with Claude via prompts.
- M03 likely covers agents, tool use, and agentic patterns (brief intro recommended in M02 under "Next Steps").
- M04 likely covers advanced reasoning, planning, and multi-step workflows.

---

## Immediate Action Items

For whoever owns M02 updates:

1. **Urgent (Do first)**: Correct pricing (2 hours). This is factually wrong and affects all cost/benefit analysis.

2. **High Priority (Do next week)**: Add extended thinking section (4 hours). This is now core to understanding Claude 4.5+, and missing it means readers don't know how to use half the capability.

3. **High Priority (Concurrent)**: Add literal instruction-following callout (2 hours). Fundamental behavior change that users must know about.

4. **Medium Priority (Within 2 weeks)**: Revise CoT, meta-prompting, 80/20 claims with research caveats (3 hours total). Prevents bad decisions.

5. **Medium Priority (Within 2 weeks)**: Add hallucination, security, and context engineering sections (6–8 hours). Rounds out module to production-readiness.

**Total estimated effort**: ~25–30 hours to address all priorities. Manageable in 1–2 sprints if done incrementally.

---

**Synthesis completed:** March 28, 2026
**Synthesizer:** Multi-Agent Research Consolidation
**Confidence Level:** High (convergent findings across 3 independent agents + primary sources)
