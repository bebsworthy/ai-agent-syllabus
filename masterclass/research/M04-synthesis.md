# M04 Synthesis: Context Engineering

**Module Grade:** B+ (well-grounded with critical spec errors requiring fixes)
**Research Date:** March 2026
**Agents:** M04-cross-check, M04-additional-info, M04-more-info

---

## Executive Summary

M04 Context Engineering demonstrates strong alignment with current research (Drew Breunig, Anthropic, ArXiv) and provides valuable practical scaffolding (CLAUDE.md template, token accounting, failure-mode antidotes) not found in other curricula. The core framework—four failure modes and the Research-Plan-Implement workflow—is well-supported by peer-reviewed research and best practices. However, **three convergent factual errors require immediate correction**: Claude Haiku context window (128K→200K), token-to-code approximations (250K lines understated by 2–10x), and word-to-token ratio (400K→750K words). Beyond corrections, the module would strengthen significantly by addressing recent developments: just-in-time runtime retrieval, context rot quantification, adversarial poisoning mitigations, selective compression, and sub-agent context isolation.

---

## Cross-Agent Findings (Convergent Issues)

### Tier 1: Critical Factual Errors (All agents flag)

| Issue | M04 States | Correct | Source | Impact |
|-------|-----------|---------|--------|--------|
| **Claude Haiku Context** | 128K tokens | 200K tokens | M04-additional-info, official Anthropic docs | Model selection will be suboptimal; developers choose wrong model |
| **Code Capacity** | ~250K lines per 1M tokens | ~100–150K lines per 1M tokens | M04-additional-info (ArXiv on token-to-lines ratio) | Developers over-load contexts; plans will fail in practice |
| **Word Capacity** | ~400K words per 1M tokens | ~750K words per 1M tokens | M04-additional-info (official Anthropic, M.Medium analysis) | Context budget planning is off by nearly 2x |
| **Auto-Compaction Threshold** | 85% (specific claim) | 75–92% range (variable) | M04-additional-info | Threshold is approximate; may not trigger consistently |

**Convergence Strength:** All three agents confirm these errors. M04-additional-info provides detailed evidence; M04-more-info references related token management; cross-check acknowledges token management principles but doesn't flag the specific errors.

---

### Tier 2: Critical Content Gaps (Flagged by 2+ agents)

| Gap | Agents Flagging | Priority | Why It Matters |
|-----|-----------------|----------|---------------|
| **Sub-Agent Context Isolation** | cross-check, more-info | HIGH | M04 mentions subagents for research but doesn't explain context boundaries. Critical for preventing poisoning across agent teams. |
| **MCP & Tool Context Management** | cross-check, more-info | HIGH | CS146S emphasizes MCP; M04 doesn't address how MCP tool descriptions and outputs affect the four failure modes. Tool overload mirrors context confusion. |
| **Context Recovery Strategies** | cross-check, more-info | HIGH | M04 explains failure modes but not *how to recover*. When to `/clear` vs. `/compact` vs. restart? When is context unsalvageable? |
| **Adversarial Poisoning** | more-info (primary) | HIGH | Recent research (2024–2025) shows poisoning can be intentional. M04 addresses accidental inconsistency but not external malicious sources. |
| **Just-in-Time Runtime Retrieval** | more-info (Anthropic official guidance) | MEDIUM | Anthropic's official framework emphasizes dynamic data loading via tools, not pre-loading everything. M04 assumes pre-loaded context. |
| **Context Rot (Length Penalty)** | more-info (quantified research) | MEDIUM | Recent research shows performance degrades *by length alone*, independent of distraction. Validates M04 thesis but adds nuance. |
| **Structured Agent Memory (A-MEM, Zettelkasten)** | more-info | MEDIUM | M04 mentions "structured note-taking" but provides no framework. A-MEM offers concrete pattern for multi-session tasks. |
| **RAG Quality Gates (CRAG)** | more-info | MEDIUM | When using external data, validate retrieved content before adding to context. Defends against context poisoning. |
| **Selective Compression** | more-info (LongLLMLingua, Acon) | MEDIUM | Modern compression achieves 4x–32x reductions. M04's `/compact` is binary; selective compression is more sophisticated. |
| **Defensive Prompting** | cross-check | MEDIUM | "Specify approach, not outcomes" is a form of context engineering. Reduces agent confusion and ambiguity. |
| **Lost in the Middle Phenomenon** | M04-additional-info | LOW | Models exhibit both primacy AND recency bias, not just recency. Important for contradictory context handling. |
| **Effective vs. Nominal Context Window** | M04-additional-info | LOW | Effective working context may be 10–50% of nominal window for complex reasoning. Set realistic expectations. |

---

## Factual Corrections Required

### 1. Claude Haiku Context Window

**Current (Incorrect):** "Claude Haiku: 128K tokens"

**Correct:** Claude Haiku 4.5: 200K tokens

**Source:** Official Anthropic documentation ([Context Windows - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/context-windows)), confirmed by multiple sources (Caylent, official spec sheets).

**Why:** The 128K figure may conflate with Opus 4.6's 128K output token limit. Haiku 4.5 has a 200K *context* window.

**Fix Required:** Update all references to Claude Haiku context size.

---

### 2. Code Capacity per 1M Tokens

**Current (Incorrect):** "~250K lines of code" per 1M tokens

**Correct:** ~100–150K lines of code per 1M tokens (language-dependent)

**Evidence:**
- 100 lines Python ≈ 1,000 tokens → 1M tokens ≈ 100K lines
- 100 lines JavaScript ≈ 700 tokens → 1M tokens ≈ 143K lines
- Module's claim would require 4–10 tokens per line; actual is 7–10 tokens per line

**Fix Required:** Revise token accounting table. Example correction:
- Before: "A large codebase (50K lines): 200,000 tokens"
- After: "A large codebase (50K lines): 350,000–500,000 tokens (language-dependent)"

---

### 3. Word Capacity per 1M Tokens

**Current (Incorrect):** "~400K words" per 1M tokens

**Correct:** ~750K words per 1M tokens

**Source:** Official Anthropic announcement ([1M context GA](https://claude.com/blog/1m-context-ga)), Medium analysis.

**Fix Required:** Update approximate word counts in context budget examples.

---

### 4. Auto-Compaction Threshold Precision

**Current:** "When you hit 85% of the context window, Claude automatically compacts history."

**More Accurate:** "Auto-compaction typically triggers between 75–92% of context window (exact threshold varies by model and conversation structure)."

**Why:** The 85% figure is approximate guidance, not a hard rule. Official docs indicate variability.

**Fix Required:** Soften language. Add note: "This is an approximate threshold; monitor `/context` output for actual behavior."

---

## Content Gaps

### Priority 1 — Must Add (High-Impact Enhancements)

#### 1.1 Sub-Agent Context Isolation
**Description:** When delegating research to sub-agents, how do you prevent poisoned context from contaminating the main agent's context?

**Suggested subsection:** "Managing Context Across Sub-Agents"
- Guideline: Pass minimal, clean context to subagents.
- Merge results without poisoning: clear subagent history before returning results to main agent.
- Example: Research subagent runs `/clear` after compiling findings; outputs summary to main context.

**Source:** Cross-check (Peeking Under the Hood Week 4), M04-more-info (A-MEM patterns)

---

#### 1.2 MCP & Tool Context Management
**Description:** How do MCP tool descriptions and outputs affect the four failure modes?

**Suggested subsection:** "Curating MCP Tool Context"
- Tool description length impacts context confusion.
- Too many MCP servers = tool overload (parallels the failure mode research).
- Lazy-load tools by task type.
- Example: Jira + Notion + AWS + GitHub in same context = potential confusion. Load one or two at a time.

**Source:** Cross-check (Claude Best Practices Week 4), M04-more-info (Anthropic official guidance)

---

#### 1.3 Context Recovery and Failure Detection
**Description:** When context becomes corrupted, how do you diagnose and recover?

**Suggested subsection:** "Recovering from Poisoned Context"
- **Signs of poisoning:** Inconsistent outputs, contradictions in implementation, model ignoring CLAUDE.md.
- **Recovery strategies:**
  - If output contradicts spec once: check latest prompt for conflicts.
  - If contradictions persist (2–3x): try `/compact` with explicit instruction to prioritize spec.
  - If still failing: `/clear` and restart with fresh context (faster than iterative correction per research).
- **Prevention:** Regular CLAUDE.md updates, human review triggers.

**Source:** Cross-check (How Long Contexts Fail Week 3), M04-more-info (practical guidance)

---

#### 1.4 Adversarial Context Poisoning (NEW SECURITY CONCERN)
**Description:** External sources (APIs, docs, web pages) can be intentionally poisoned.

**Suggested section:** "Defending Against Adversarial Context Poisoning"
- **New reality (2024–2025):** As few as 250 malicious documents can backdoor models.
- **Mitigations:**
  - Verify external data sources (API origins, document hashes, author identity).
  - Sandbox tool outputs: verify before trusting.
  - Use CLAUDE.md as immutable ground truth; poisoned context cannot override it.
  - Apply retrieval quality gates (CRAG-style validation).

**Source:** M04-more-info (ArXiv 2024–2025 on poisoning attacks)

---

### Priority 2 — Should Add (Medium-Impact Enhancements)

#### 2.1 Just-in-Time Runtime Retrieval as Strategy
**Description:** Anthropic's official framework emphasizes dynamic data loading, not pre-loading everything.

**Suggested subsection:** "Just-in-Time Data Loading"
- Design workflows where agents fetch data via tools *as needed*.
- Keep working context minimal and focused.
- Benefits: reduced token waste, sharper reasoning, better composability.
- Example: Instead of loading all 50 test files, agent queries test runner for relevant tests when needed.

**Source:** M04-more-info (Anthropic's official "Effective Context Engineering for AI Agents")

---

#### 2.2 Context Rot: The Length Penalty (Independent of Content Quality)
**Description:** Performance degrades by context length *alone*, not just by noise.

**Suggested subsection:** "Context Rot: Why Smaller Contexts Reason Better"
- Recent research (Trychroma 2024, ArXiv 2025) quantifies this.
- Models begin losing accuracy around 30K–50K tokens, *before* reaching max window.
- Not just about irrelevant context; it's a *capacity* issue.
- **Implication:** Keep context *minimized*, not just curated.

**Source:** M04-more-info (Context Rot research)

---

#### 2.3 Persistent Agent Memory Framework
**Description:** For multi-session tasks, how do you preserve institutional knowledge outside context?

**Suggested subsection:** "Structured Memory for Long-Horizon Tasks"
- Use Zettelkasten-style note-taking or A-MEM patterns.
- Store in version-controlled markdown or dedicated memory database.
- Link related concepts and decisions.
- Load selectively into context each session (only high-value notes).

**Source:** M04-more-info (A-MEM paper, Feb 2025)

---

#### 2.4 RAG Quality Gates (CRAG, Long RAG)
**Description:** When using RAG to populate context, validate before including.

**Suggested subsection:** "Managing Retrieved Context Quality"
- Apply quality gates: Evaluate retrieved documents for relevance and accuracy.
- Frameworks like Corrective RAG reject poor retrievals and trigger alternatives (e.g., web search).
- For coherent narratives (manuals, papers), retrieve entire sections rather than short chunks.

**Source:** M04-more-info (Corrective RAG, Long RAG frameworks)

---

#### 2.5 Defensive Prompting Patterns
**Description:** Specify approach, not just outcomes, to reduce ambiguity.

**Suggested subsection:** "Defensive Prompting as Context Discipline"
- Instead of: "Add unit tests"
- Better: "Add tests for auth module covering: success, invalid token, expired token. Use Jest. Mock DB via tests/mocks/db.ts pattern."
- Reduces agent confusion and avoids context distraction (model won't default to wrong pattern).

**Source:** Cross-check (Coding Agents 101 Week 3)

---

### Priority 3 — Nice to Have (Polish & Completeness)

#### 3.1 Selective Compression Techniques
**Description:** Modern methods (LongLLMLingua, Acon) achieve 4x–32x compression with minimal performance loss.

**Suggested note under "Context Hygiene Commands":**
> When manually compacting (via `/compact` or between phases), prioritize: architectural decisions, recent code changes, unresolved bugs, and validated patterns. Drop: exploration threads, duplicate explanations, completed tasks, redundant examples. Advanced: consider compression tools (LongLLMLingua, Acon) for high-token-usage workflows.

**Source:** M04-more-info

---

#### 3.2 Multimodal Context Curation
**Description:** Images, videos, PDFs add complexity; same principles apply but differently.

**Suggested callout in "Takeaway":**
> **Multimodal Note:** Apply context curation principles to images and videos. Avoid embedding all media at once; reference by path instead. Maintain a multimodal CLAUDE.md documenting priority formats.

**Source:** M04-more-info (Multimodal Needle in Haystack research)

---

#### 3.3 Model Context Awareness (Claude 4.5+)
**Description:** Newer Claude models track remaining context and suggest summarization proactively.

**Suggested note under "Context Hygiene Commands":**
> **Model Context Awareness (2025+):** Newer Claude models track remaining window and may proactively suggest history compaction. Trust these signals. However, developer discipline (CLAUDE.md, `/context` checks, three-phase workflow) remains essential for consistent outcomes.

**Source:** M04-more-info (Claude platform updates 2025–2026)

---

#### 3.4 "Lost in the Middle" Phenomenon
**Description:** Models exhibit both primacy *and* recency bias; information in the middle is used least reliably.

**Suggested clarification under "Context Poisoning":**
> Models don't just favor recency. Research on "Lost in the Middle" (ArXiv 2307.03172) shows a U-shaped performance curve: models use beginning (primacy bias) and end (recency bias) most reliably, with middle information degrading up to 20–30%. When context conflicts, place authoritative information (CLAUDE.md, most recent instruction) at the end of context, and deduplicate or consolidate middle sections.

**Source:** M04-additional-info

---

#### 3.5 Practical Limitations Callout
**Description:** Context engineering is powerful but not magic.

**Suggested addition to "Key Concepts" or conclusion:**
> **Realistic Expectations:** Context engineering dramatically improves outcomes but cannot solve everything. Complex dependency chains, missing domain expertise, or fundamental architectural misunderstandings cannot be overcome by cleaner context alone. If an agent is consistently looping or contradicting despite clean context, the problem likely lies in the task specification or codebase structure, not context.

**Source:** Cross-check (Getting AI to Work in Complex Codebases Week 3)

---

## Outdated Content

**None identified.** All major claims in M04 align with current research (as of March 2026). The four failure modes framework remains central to the field; CLAUDE.md is standard; token accounting principles are sound (though specific numbers need correction).

However, **M04 predates the context rot quantification (2024–2025) and recent security findings on adversarial poisoning (2024–2025).** These are additions, not corrections.

---

## Strengths to Preserve

1. **Detailed CLAUDE.md template with real-world example** — CS146S doesn't provide this. M04's Express.js example is practical and concrete.
2. **Failure-mode-specific antidotes** — Directly pairing problems with solutions (poisoning→CLAUDE.md, distraction→curation, etc.) is more actionable than abstract guidance.
3. **Token accounting reference table** — Developers need approximations to budget context. M04 provides this; CS146S does not.
4. **Three-phase Research-Plan-Implement workflow** — Well-structured, easy to teach, backed by multiple sources.
5. **Keyboard shortcuts and `/btw` pattern** — Minor UX details that practitioners find valuable.
6. **Clear, concrete examples** — M04 illustrates concepts with real code patterns; this makes the material stick.

---

## Prioritized Improvement Plan

### Priority 1 — Must Fix (Publication-Blocking)

#### 1.1 Correct Claude Haiku Context Window
- **Action:** Change "128K tokens" to "200K tokens"
- **Effort:** 5 minutes
- **Impact:** Prevents student selection of wrong model; affects all context budgeting discussions
- **Evidence:** Unanimous from M04-additional-info + official docs

#### 1.2 Revise Token Accounting for Code
- **Action:** Update token-to-code estimates:
  - 250K lines → 100–150K lines per 1M tokens
  - 50K lines → 350–500K tokens (not 200K)
  - Add language-dependency note
- **Effort:** 15 minutes
- **Impact:** Students will actually fit their code in context; plans will be realistic
- **Evidence:** M04-additional-info + empirical research

#### 1.3 Correct Word-to-Token Ratio
- **Action:** Change "~400K words" to "~750K words" per 1M tokens
- **Effort:** 5 minutes
- **Impact:** Context budgeting will be accurate
- **Evidence:** Official Anthropic announcement + M04-additional-info

#### 1.4 Soften Auto-Compaction Threshold Claim
- **Action:** Change "85% triggers compaction" to "typically 75–92%, varies by model"
- **Effort:** 5 minutes
- **Impact:** Prevents over-reliance on specific threshold; encourages monitoring
- **Evidence:** M04-additional-info (official Anthropic docs)

---

### Priority 2 — Should Add (High-Value Additions)

#### 2.1 Sub-Agent Context Isolation (New Subsection)
- **Section:** After "Research-Plan-Implement Workflow"
- **Content:** How to prevent poisoning across agent teams; when/how to clear subagent context
- **Effort:** 30 minutes (write + examples)
- **Impact:** Unlocks practical multi-agent patterns; addresses convergent gap
- **Evidence:** Cross-check + M04-more-info

#### 2.2 MCP & Tool Context Management (New Subsection)
- **Section:** Under "Context Confusion" failure mode
- **Content:** Tool description length, lazy-loading strategy, examples (Jira + Notion overload)
- **Effort:** 20 minutes
- **Impact:** Directly relevant as MCP becomes standard; bridges M04 and M05
- **Evidence:** Cross-check + M04-more-info (Anthropic official guidance)

#### 2.3 Context Recovery Strategies (New Subsection)
- **Section:** After "The Four Failure Modes"
- **Content:** Diagnosis (signs of poisoning), recovery strategies (compact vs. clear vs. restart), prevention
- **Effort:** 30 minutes
- **Impact:** Teaches failure recovery, not just prevention; practical for real projects
- **Evidence:** Cross-check + M04-more-info

#### 2.4 Adversarial Poisoning Mitigation (New Section)
- **Section:** New section between "Failure Modes" and "CLAUDE.md"
- **Content:** Defend against external poisoning; source verification, sandboxing, CLAUDE.md as ground truth
- **Effort:** 25 minutes
- **Impact:** Critical security concern; recent research validates need
- **Evidence:** M04-more-info (2024–2025 poisoning research)

#### 2.5 Context Rot: Length Penalty (New Subsection or Expansion)
- **Section:** Expand "Context Distraction" or new subsection
- **Content:** Quantified finding: performance degrades by length, not just noise; keep context minimized
- **Effort:** 15 minutes
- **Impact:** Validates M04's core thesis; sets realistic expectations
- **Evidence:** M04-more-info (Trychroma, ArXiv 2024–2025)

#### 2.6 Just-in-Time Runtime Retrieval (New Subsection)
- **Section:** Under "CLAUDE.md and Curation"
- **Content:** Load data dynamically via tools, not pre-load everything; benefits and patterns
- **Effort:** 20 minutes
- **Impact:** Aligns with Anthropic's official guidance; modern best practice
- **Evidence:** M04-more-info (Anthropic official framework)

---

### Priority 3 — Nice to Have (Polish Additions)

#### 3.1 Defensive Prompting Patterns (New Subsection)
- **Section:** Under "Context Confusion"
- **Content:** Specify approach, not outcomes; example (unit tests)
- **Effort:** 15 minutes
- **Impact:** Bridges context engineering and prompt discipline
- **Evidence:** Cross-check (CS146S Coding Agents 101)

#### 3.2 Structured Memory for Long-Horizon Tasks (New Subsection)
- **Section:** Under "Research-Plan-Implement Workflow"
- **Content:** Zettelkasten/A-MEM patterns for multi-session projects
- **Effort:** 20 minutes
- **Impact:** Extends workflow to long-term projects
- **Evidence:** M04-more-info (A-MEM paper)

#### 3.3 RAG Quality Gates (New Subsection)
- **Section:** Under "Context Curation"
- **Content:** CRAG validation, Long RAG patterns
- **Effort:** 15 minutes
- **Impact:** Relevant for projects using external data/RAG
- **Evidence:** M04-more-info (CRAG, Long RAG research)

#### 3.4 Selective Compression (Enhancement to `/compact` Section)
- **Section:** Under "Context Hygiene Commands"
- **Content:** Prioritize signal (decisions, recent changes, bugs) over noise (exploration, duplicates)
- **Effort:** 10 minutes
- **Impact:** Makes compaction more deliberate and effective
- **Evidence:** M04-more-info (LongLLMLingua, Acon)

#### 3.5 Multimodal Context Note (Callout)
- **Section:** "Takeaway" or appendix
- **Content:** Principles apply to images/video; reference by path, not embed all
- **Effort:** 5 minutes
- **Impact:** Future-proofs module as multimodal systems proliferate
- **Evidence:** M04-more-info (MMNeedle research)

#### 3.6 Lost in the Middle Clarification (Enhancement)
- **Section:** Under "Context Poisoning"
- **Content:** Models exhibit primacy *and* recency bias; U-shaped curve; place authoritative info at end
- **Effort:** 10 minutes
- **Impact:** More nuanced understanding of contradictory context handling
- **Evidence:** M04-additional-info

#### 3.7 Model Context Awareness Note (Callout)
- **Section:** Under "Commands for Context Hygiene"
- **Content:** Newer Claude models proactively suggest compaction; trust these signals
- **Effort:** 5 minutes
- **Impact:** Sets expectations for Claude 4.5+ behavior
- **Evidence:** M04-more-info (platform updates)

---

## Source Summary

| Source | Agent | Key Contributions |
|--------|-------|-------------------|
| **CS146S (Week 3–4)** | Cross-check | Four failure modes validation, three-phase workflow, sub-agent context, defensive prompting, practical limitations |
| **Drew Breunig's Research** | All three | Four failure modes framework (seminal) |
| **Anthropic Official Docs** | M04-additional-info | Context window specs, CLAUDE.md, compaction behavior |
| **ArXiv / Peer Review (2024–2025)** | M04-additional-info, M04-more-info | Context rot, poisoning attacks, compression techniques, A-MEM, multimodal challenges, Lost in the Middle |
| **Community Guides** | M04-additional-info | CLAUDE.md best practices (HumanLayer, Builder.io) |
| **Anthropic Engineering Blog** | M04-more-info | Official "Effective Context Engineering for AI Agents" (five layers framework) |
| **Simon Willison** | M04-more-info | Independent validation of context engineering as discipline |
| **Andrej Karpathy** | M04-more-info | Claude Code as validation of context discipline in practice |

---

## Revision Roadmap

### Week 1: Critical Fixes (Publication-Ready)
- [ ] Correct Claude Haiku (128K → 200K)
- [ ] Revise token accounting (250K lines → 100–150K; 400K words → 750K)
- [ ] Soften auto-compaction threshold claim
- [ ] **Estimated effort:** 30 minutes

### Week 2: High-Value Additions (Strengthen Core)
- [ ] Add sub-agent context isolation section
- [ ] Add MCP & tool management section
- [ ] Add context recovery strategies section
- [ ] Add adversarial poisoning mitigation section
- [ ] Expand/reframe context distraction with "context rot" quantification
- [ ] **Estimated effort:** 2.5 hours

### Week 3: Medium-Value Additions (Polish)
- [ ] Add just-in-time runtime retrieval pattern
- [ ] Add persistent memory (A-MEM) guidance
- [ ] Add RAG quality gates section
- [ ] Add defensive prompting patterns
- [ ] **Estimated effort:** 1.5 hours

### Week 4: Polish & Review (Final)
- [ ] Add selective compression note
- [ ] Add multimodal context callout
- [ ] Add Lost in the Middle clarification
- [ ] Add model context awareness note
- [ ] **Estimated effort:** 30 minutes

---

## Quality Assessment

| Criterion | Grade | Notes |
|-----------|-------|-------|
| **Factual Accuracy** | B | Four critical errors identified (specs). All major claims well-supported. Fixes required before publication. |
| **Completeness** | B+ | Core material (four modes, CLAUDE.md, workflow) is solid. Gaps in sub-agent isolation, recovery, and recent developments (context rot, poisoning, RAG). |
| **Practical Utility** | A- | CLAUDE.md template and token accounting are valuable. Examples are concrete. Could be stronger with recovery/failure guidance. |
| **Currency** | B | Well-aligned with 2024–2025 research, but predates context rot quantification and adversarial poisoning findings. |
| **Alignment with CS146S** | A | Strongly aligned. No contradictions. Complementary strengths (detailed templates, token tables). |

**Overall Grade: B+ (publication-ready after critical fixes + recommended additions)**

---

## Key Takeaway for Curriculum Owner

M04 is a solid, well-grounded module with excellent practical scaffolding. The four failure modes framework is research-backed; CLAUDE.md template is concrete and reusable. However:

1. **Fix specs now:** Haiku context, token accounting, auto-compaction threshold. These are publication-blocking.
2. **Add high-priority sections in next revision:** Sub-agent isolation, MCP management, recovery strategies, adversarial poisoning. These unlock real-world patterns.
3. **Polish opportunistically:** Compression, multimodal, Lost in the Middle, model context awareness. These strengthen completeness but aren't blocking.

The module will be significantly more valuable with these additions, positioning it as the definitive practical guide to context engineering, complementing CS146S's research foundation.
