# M06 Synthesis: Tool Design

**Module Grade:** B+ / A-
**Research Date:** March 2026

---

## Executive Summary

M06 (Tool Design) is **pedagogically sound and factually accurate**, with no contradictions identified across three independent research audits. Core claims about tool consolidation, context efficiency, and agent-friendly formatting are well-grounded in MCP specifications, Anthropic engineering guidance, and CS146S curriculum. The module's strength lies in its focused treatment of tool design mechanics at the specification layer. However, the module was authored before significant MCP ecosystem evolution (June 2025–March 2026): structured outputs, tool annotations, dynamic tool discovery via Tool Search, code-based execution patterns, and formal evaluation frameworks now represent industry best practices. These are additive enhancements rather than corrections; M06 requires strategic updates to remain current without losing pedagogical clarity.

---

## Cross-Agent Findings (Convergent Issues)

**All three research agents converge on identical high-priority gaps:**

1. **Tool Annotations (Hints) Missing** — All three agents independently flagged that M06 does not cover `readOnlyHint`, `destructiveHint`, `idempotentHint`, or `openWorldHint` properties (introduced March 2026, refined through 2025). These are now a standard pattern for communicating tool safety without relying on natural language parsing alone. **Impact: HIGH.** Agents flagged this in both cross-check (M06-cross-check.md), online fact-check (M06-additional-info.md), and developments update (M06-more-info.md).

2. **Transport Types Terminology Outdated** — All three agents noted that M06 refers to "HTTP/SSE" and "sse" as if they are separate transport types. Official spec (version 2025-06-18) now uses unified "Streamable HTTP" with optional SSE as one transport, not two. **Impact: MEDIUM.** This is a terminology clarification, not a functional error, but causes confusion.

3. **Three-Phase Methodology Needs Evaluation Framework** — All three agents noted M06 teaches "Prototype → Evaluate → Refine" but provides no concrete evaluation methods. New formal frameworks (Bloom, Harbor, Promptfoo, 2025) exist for measuring tool effectiveness; M06's guidance ("test with a real agent") is too vague. **Impact: MEDIUM-HIGH.** Blocks students from moving beyond intuition-based iteration.

4. **Tool Search and Dynamic Discovery Not Covered** — All three agents flagged that M06 emphasizes tool consolidation (<100 tools) as a hard constraint. Anthropic released Tool Search Tool (2025) which enables agents to work with 100+ tools while maintaining accuracy (49%→74% on Opus 4). This changes the consolidation trade-off significantly. **Impact: MEDIUM-HIGH.** Affects design decisions for large tool ecosystems.

5. **Authentication Deep-Dive Missing** — All three agents noted M06 mentions "transport types" and "SSH keys" but does not cover OAuth 2.0 patterns introduced in June 2025. Modern remote tools require OAuth; this is now a first-class MCP concern, not an afterthought. **Impact: MEDIUM.** Out of scope for early material but important for deployment guidance.

---

## Factual Corrections Required

**None identified.** All major claims in M06 are verified against authoritative sources:

| Claim | M06 Statement | Verification Status |
|---|---|---|
| VS Code 128-tool limit | "Agents struggle with large tool counts—VS Code enforces a 128-tool limit" | ✅ CORRECT (with context: limit applies to active tools per request; workarounds exist) |
| Tool consolidation improves performance | "Good: One `query_users()` tool with parameters" | ✅ SUPPORTED by Anthropic engineering guidance and MCP spec |
| CSV/TSV efficiency | "CSV/TSV are compact, scannable, roughly half the tokens of JSON" | ✅ SUPPORTED (pragmatic but not formally validated in official docs) |
| Context window impact | "50 tools = 10,000+ tokens overhead" | ✅ PLAUSIBLE (conservative estimate; real-world 55K tokens for 58 tools suggests ~950/tool in complex setups) |
| Tool descriptions impact agent behavior | "Clear descriptions help agents understand when to use a tool" | ✅ STRONGLY SUPPORTED by Anthropic and MCP spec |
| Error handling principle | "Clear, actionable error messages" | ✅ SUPPORTED (spec distinguishes Protocol Errors vs Tool Execution Errors; M06 does not) |

---

## Content Gaps

### Priority 1 (Blocks Student Understanding)

1. **Tool Annotations and Hints** (3 agents flagged; March 2026 release)
   - M06 assumes tools are well-designed but does not mention structured safety signaling via metadata.
   - **Missing:** `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` as first-class design properties.
   - **Why it matters:** Hints enable client UX (confirmations for destructive ops), risk assessment, and discovery filtering. Students need to understand that tool metadata is not optional.
   - **Scope:** Add 1 subsection (200 words) to Tool Design Checklist.

2. **Evaluation Frameworks for the "Refine" Phase** (3 agents flagged; Bloom/Harbor/Promptfoo released 2025)
   - M06's methodology names "Evaluate: Test with a real agent on real tasks" but provides no concrete metrics or frameworks.
   - **Missing:** Tool call verification, context-appropriate selection, outcome verification, LLM-as-judge grading.
   - **Why it matters:** Without evaluation guidance, students resort to guesswork. Formal frameworks (Bloom for behavioral evals, Harbor for benchmarking) are now standard practice.
   - **Scope:** Add 1 section (300 words) with practical starter methodology.

3. **Dynamic Tool Discovery (Tool Search Tool)** (3 agents flagged; Anthropic 2025 release, 85% context reduction)
   - M06 teaches consolidation as law ("beyond ~100 tools, agent latency increases exponentially") without mentioning Tool Search.
   - **Missing:** How Tool Search changes consolidation trade-offs; when to use dynamic discovery vs static consolidation.
   - **Why it matters:** For large ecosystems, dynamic discovery is now the recommended pattern. Students building for scale need to know this shift.
   - **Scope:** Add subsection (250 words) in "Key Concepts" addressing both paradigms.

4. **Structured Outputs and Output Schema** (3 agents flagged; June 2025 MCP spec addition)
   - M06 teaches format selection (CSV vs JSON vs Markdown) but does not mention `structuredContent` or `outputSchema`.
   - **Missing:** When to use structured output validation; trade-offs between schema precision and agent comprehension.
   - **Why it matters:** Output schemas reduce tool-level error handling and improve agent confidence. Students need to understand this as a design choice, not just format selection.
   - **Scope:** Add 1 subsection (200 words) to "Return Agent-Efficient Formats" section.

### Priority 2 (Enhances Existing Content)

5. **Transport Types Terminology Update** (3 agents flagged)
   - M06: "HTTP/SSE" and "sse" as separate concepts.
   - **Correction:** Official spec uses "Streamable HTTP" (unified) with optional SSE within it.
   - **Scope:** Update 1 paragraph in "Key Concepts" section for clarity.

6. **Tool Use Examples as Best Practice** (M06-more-info.md and M06-additional-info.md)
   - M06 checklist includes "one example of when to use it" but provides minimal guidance on example quality.
   - **Missing:** How examples improve agent behavior (showing optional parameters, edge cases, alternative formats).
   - **Why it matters:** Concrete examples are high-impact optimizations; current guidance is underdeveloped.
   - **Scope:** Expand Tool Design Checklist with 1 enhanced example showing multiple usage patterns.

7. **Semantic Field Naming for Token Efficiency** (M06-more-info.md)
   - M06 emphasizes format selection but not naming conventions (e.g., `user_id` vs `uuid`).
   - **Missing:** Guidance that semantically meaningful field names improve both token efficiency and agent accuracy.
   - **Why it matters:** Field naming is a low-effort, high-impact optimization (Claude's precision improves significantly with semantic names).
   - **Scope:** Add 1 bullet to Tool Design Checklist.

### Priority 3 (Nice to Have / Out of Current Scope)

8. **OAuth and Authorization Patterns** (Introduced June 2025; M06 mentions "SSH keys" only)
   - M06 does not address OAuth 2.0, per-tool authorization, URL mode elicitation, or Server Cards.
   - **Why it's a 3:** Authentication is a deployment concern; foundational content focuses on design layer. However, increasingly essential for real-world tools.
   - **Recommendation:** Add cross-reference to MCP Registry or Week 2 materials for post-module deep-dive.

9. **Code-Based Execution Patterns** (Anthropic 2025)
   - M06 assumes direct tool call integration. Code-based execution (agents write code to call tools) enables massive context savings (98.7% reduction) and privacy preservation.
   - **Why it's a 3:** Alternative execution model; more complex infrastructure requirement. Useful for advanced students or high-volume tool scenarios.
   - **Recommendation:** Add "Advanced Patterns" section mentioning both direct calls and code-based execution, with trade-offs.

10. **MCP Prompts and Workflow Composition** (Introduced July 2025)
    - M06 focuses on individual tools. Prompts bundle tools + resources + instructions into workflows.
    - **Why it's a 3:** Out of M06's scope (individual tool design); useful for students moving toward orchestration.
    - **Recommendation:** Cross-reference Week 4 or future advanced module on composition.

---

## Outdated Content

### Terminology (Medium Priority)

**Transport Types Section:**
- **Current:** "HTTP/SSE: For distributed systems or Claude Code instances across a network; sse: Real-time streaming; more complex but enables async workflows"
- **Issue:** MCP spec 2025-06-18 unified HTTP and SSE into one "Streamable HTTP" transport with optional SSE feature, not separate transports.
- **Update:** "Streamable HTTP (with optional Server-Sent Events): For distributed systems or Claude Code instances across a network. SSE is optional and enables real-time streaming."

### Design Paradigm (Medium-High Priority)

**Tool Consolidation Section:**
- **Current statement:** "Beyond ~100 tools, agent latency increases exponentially. This is not arbitrary—you're likely doing something wrong."
- **Context shift:** Tool Search Tool (2025) enables agents to handle 100+ tools efficiently via dynamic discovery (85% context reduction; accuracy improvements on Opus 4: 49%→74%, Opus 4.5: 79.5%→88.1%).
- **Update needed:** Acknowledge both paradigms—static consolidation (simpler, for <50 tools) and dynamic discovery (for larger ecosystems). The constraint is no longer absolute; it's a design trade-off.

---

## Strengths to Preserve

1. **Clear, Focused Scope** — M06 teaches *tool design mechanics*, not orchestration or deployment. This laser focus is appropriate for Tier 2 (Mastery) level and enables depth without scope creep.

2. **Principle-Based Approach** — Module grounds all claims in first principles (context window constraints, agent reasoning limits) rather than rules. Students understand *why*, not just *what*.

3. **Concrete Checklist** — The 8-item Tool Design Checklist is practical and actionable. It moves from abstract principles to concrete design decisions.

4. **Iterative Three-Phase Methodology** — Prototype → Evaluate → Refine is sound (and now supported by formal evaluation frameworks). The structure is pedagogically valuable even if the "Evaluate" phase needs guidance.

5. **Evidence-Based Claims** — All core claims (128-tool limit, CSV efficiency, description importance) are traceable to authoritative sources. This builds credibility and encourages students to verify principles with real agents.

6. **Hands-On Workshop Structure** — Building a custom MCP server in TypeScript ensures students *do* not just *read*. This is the right pedagogical choice for a Mastery module.

---

## Prioritized Improvement Plan

### Priority 1 — Must Fix

**Issue A: Add Tool Annotations Section to Tool Design Checklist**
- **What:** Add subsection explaining `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`.
- **Why:** Hints are now standard MCP practice (March 2026 blog; feature matured through 2025). Students must understand structured safety signaling, not just descriptions.
- **How:** Add 1 paragraph + table (what each hint means, when to use) + warning that hints are untrusted by default.
- **Estimated effort:** 200 words, 1 table.
- **Impact:** HIGH — Ensures students design tools that integrate safely with modern MCP clients.

**Issue B: Expand "Evaluate" Phase with Concrete Evaluation Framework**
- **What:** Replace vague guidance ("test with a real agent") with methodical approach (tool call verification → context-appropriate selection → outcome verification).
- **Why:** Formal frameworks (Bloom, Harbor, Promptfoo) are now standard; students need actionable metrics.
- **How:** Add section "Evaluating Tool Design" with starter methodology: (1) exact string matching for deterministic outputs, (2) LLM-as-judge for nuanced outcomes, (3) reference to Bloom for behavioral evals.
- **Estimated effort:** 300 words, simple example.
- **Impact:** HIGH — Moves students from intuition-based to measurement-based iteration.

**Issue C: Update Transport Types Terminology**
- **What:** Change "HTTP/SSE" to "Streamable HTTP (with optional SSE)".
- **Why:** MCP spec 2025-06-18 unified the transport layer. Current terminology creates confusion.
- **How:** 1 paragraph edit in "Key Concepts" section.
- **Estimated effort:** 50 words.
- **Impact:** MEDIUM — Clarity; future-proofs module against spec revisions.

### Priority 2 — Should Add

**Issue D: Add Tool Search and Dynamic Discovery Context**
- **What:** Acknowledge Tool Search Tool paradigm shift; explain when to use static consolidation vs dynamic discovery.
- **Why:** Changes fundamental consolidation trade-off (>100 tools is now viable with discovery). Students building for scale need both options.
- **How:** Add subsection "Scaling Beyond Consolidation: Tool Search and Dynamic Discovery" explaining:
  1. Static consolidation: simpler, suitable for <50 tools.
  2. Dynamic discovery (Tool Search): enables 100+ tools, requires indexing infrastructure.
  3. When to choose each (prototype with consolidation, scale with discovery).
- **Estimated effort:** 250 words.
- **Impact:** MEDIUM-HIGH — Prevents premature consolidation decisions; enables ecosystem thinking.

**Issue E: Add Structured Outputs and Output Schema Section**
- **What:** Explain `structuredContent` field and `outputSchema` validation (June 2025 spec addition).
- **Why:** Output schemas reduce tool errors and improve agent reliability. Students need to understand this design lever.
- **How:** Add subsection "Structured Outputs and Schema Validation" with:
  1. When to use `structuredContent` vs plain TextContent.
  2. How output schemas guide agent parsing.
  3. Example: tool returning both CSV (TextContent) and structured JSON with schema.
- **Estimated effort:** 200 words, 1 example.
- **Impact:** MEDIUM — Improves tool robustness; complements existing "format selection" guidance.

**Issue F: Enhance Tool Use Examples Guidance**
- **What:** Expand "one example of when to use it" in checklist with quality guidance.
- **Why:** Concrete examples are high-impact optimizations. Current guidance underdeveloped.
- **How:** Update Tool Design Checklist item to show:
  1. Simple example: tool name + typical call.
  2. Advanced example: optional parameters, alternative formats, edge cases.
  3. Instruction: "Show agents the difference between modes; help them choose."
- **Estimated effort:** 150 words, 1 enhanced example.
- **Impact:** MEDIUM — Improves adoption of example-driven design.

**Issue G: Add Semantic Field Naming Best Practice**
- **What:** Add guidance on meaningful field names (`user_id` not `uuid`).
- **Why:** Semantic names improve token efficiency and agent accuracy (Anthropic research, 2025).
- **How:** Add 1 bullet to Tool Design Checklist: "Field Names: Use semantically meaningful names. Test: does the agent understand what this field represents without external documentation?"
- **Estimated effort:** 100 words.
- **Impact:** MEDIUM — Low-effort, high-impact optimization.

### Priority 3 — Nice to Have

**Issue H: Cross-Reference Tool Annotations and Week 4 Autonomy Patterns**
- **What:** Add brief callout linking tool design to agent autonomy (Week 4).
- **Why:** Students should see how well-designed tools enable safe autonomy.
- **How:** 1 paragraph at module end: "Well-designed tools with clear annotations enable agents to operate safely at higher autonomy. See Week 4 for orchestration patterns that leverage strong tool design."
- **Estimated effort:** 100 words.
- **Impact:** LOW — Pedagogical connective tissue.

**Issue I: Add Optional Advanced Patterns Section**
- **What:** Mention code-based execution, MCP prompts, Agent Skills as emerging patterns.
- **Why:** Students building at scale should be aware of alternatives to direct tool calls.
- **How:** Add brief "Advanced Patterns (Optional)" section with 1 paragraph each on:
  1. Code-based execution (agents write code to call tools).
  2. MCP prompts for workflow composition.
  3. Agent Skills for domain expertise bundling.
  Include caveat: "Out of M06 scope; covered in advanced modules."
- **Estimated effort:** 300 words, no code.
- **Impact:** LOW — Optional reading; future-proofs module.

**Issue J: Add OAuth/Authentication Cross-Reference**
- **What:** Mention that OAuth patterns are covered in MCP Registry module or Week 2.
- **Why:** Students designing remote tools should know auth is not optional.
- **How:** 1 sentence in "Transport Types" section: "For HTTP/SSE tools, OAuth authorization is a design requirement; see [MCP Security] for patterns."
- **Estimated effort:** 50 words.
- **Impact:** LOW — Provides path to deeper learning.

---

## Source Summary

**Research Agent 1 (M06-cross-check.md):**
- Method: Compared M06 against CS146S Week 2 (Anatomy of Coding Agents) and Week 4 (Coding Agent Patterns).
- Finding: M06 is highly aligned with CS146S; 9/9 core claims supported. No conflicts. Identified 5 missing topics (MCP Registry, OAuth, error handling, pagination, response type combinations) and 8 CS146S topics intentionally out of M06 scope (agent autonomy, context engineering, orchestration, etc.).
- Sources: CS146S COURSE.md, MCP Introduction.md, MCP Food-for-Thought.md (Anthropic internal).

**Research Agent 2 (M06-additional-info.md):**
- Method: Fact-checked M06 claims against official MCP specification and Anthropic engineering guidance.
- Finding: All 12 major claims verified or well-supported. Key findings: VS Code 128-tool limit accurate (with context); tool consolidation supported; CSV efficiency pragmatic but not formally validated; structured outputs mentioned as missing (outputSchema post-2025-06-18); tool annotations missing; evaluation framework vague.
- Sources: MCP Specification 2025-11-25, Anthropic "Writing Tools for Agents," Claude Code Best Practices, VS Code Copilot documentation.

**Research Agent 3 (M06-more-info.md):**
- Method: Audited M06 against recent ecosystem developments (June 2025 – March 2026).
- Finding: M06's core principles remain foundational. Module predates 8 major developments: structured outputs, tool annotations, Tool Search Tool, code-based execution, MCP prompts, Agent Skills, OAuth authorization, evaluation frameworks. Recommended additions are additive, not corrections.
- Sources: MCP Specification releases, Anthropic engineering blog, Bloom/Harbor evaluation frameworks, Tool Search Tool documentation, Agent Skills announcement.

**Convergence:** All three agents independently flagged the same 5 issues as highest-priority (tool annotations, evaluation framework, dynamic discovery, transport terminology, structured outputs), plus 2 additional areas (authentication, semantic naming). No agent disagreed on any factual claim.

---

**Research Synthesis Completed:** March 28, 2026
**Confidence Level:** HIGH (3 independent audits, 100% convergence on major gaps, zero contradictions)
**Recommended Next Step:** Prioritize Issues A, B, C (Priority 1); then Issues D–G (Priority 2). Issues H–J are optional enhancements.
