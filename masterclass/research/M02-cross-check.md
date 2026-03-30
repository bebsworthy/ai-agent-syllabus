# M02 Cross-Check: Masterclass vs CS146S

## Summary

The M02 Prompt Engineering masterclass demonstrates strong alignment with CS146S Week 1 foundational content, with excellent coverage of core prompting techniques (zero-shot, few-shot, chain-of-thought, meta-prompting, RAG, and self-consistency). The module effectively complements CS146S by adding practical decision frameworks (model selection, effort levels) and Devin's four principles, which go beyond what CS146S covers directly. However, the masterclass would benefit from deeper grounding in the theoretical foundations that CS146S establishes—particularly LLM architecture, training/inference dynamics, and hallucination risks. Additionally, CS146S Week 4 introduces critical context-engineering concepts (CLAUDE.md, context front-loading, system-reminder patterns) that are absent from M02 but represent essential prompting discipline for production work. The masterclass is well-positioned as a tactical execution guide but could strengthen its foundation by integrating theoretical context from CS146S Week 1 and practical patterns from CS146S Week 4.

---

## Supported Claims

- **Zero-shot prompting (definition, when it works, when it fails)**: Fully supported by CS146S COURSE.md and Prompt Engineering Guide.md. CS146S confirms zero-shot works for straightforward tasks within model training but notes the limitation when tasks require domain-specific reasoning.

- **Few-shot prompting (1-3 examples improve pattern learning)**: Directly supported by CS146S COURSE.md, which states "The model learns the task from the examples rather than relying solely on its pretraining. This technique works even better when examples are similar to the task at hand." Masterclass example aligns with CS146S approach.

- **Chain-of-thought prompting (step-by-step reasoning improves complex tasks)**: Fully supported across CS146S. Quote: "Explicitly requesting step-by-step reasoning improves performance on complex reasoning tasks because it forces the model to decompose problems." Masterclass correctly identifies cost/benefit tradeoff.

- **Meta-prompting (persona/framing shapes reasoning)**: Supported by CS146S COURSE.md. CS146S frames it as "asking the model to first write an implementation plan in a comment, then ask it to implement based on that plan" and notes this "two-step approach often produces better results."

- **RAG (Retrieval-Augmented Generation)**: Supported by CS146S with emphasis on necessity due to LLM limitations. CS146S states "With RAG, you retrieve relevant documents or code snippets from a database before prompting the model. This provides crucial context" and "When you have the right context, Claude's accuracy skyrockets."

- **Self-consistency (multiple responses improve reliability)**: Directly supported by CS146S COURSE.md: "Self-consistency involves generating multiple responses to the same prompt and using some mechanism (majority voting, aggregation, or manual selection) to pick the best one."

- **Model selection (Haiku for speed, Sonnet for daily work, Opus for complex reasoning)**: Partially supported by CS146S. CS146S discusses model architecture differences and reasoning capability tiers but does not provide explicit cost/speed tables or the 90%/5%/5% allocation rule from the masterclass. Masterclass adds practical decision rules absent from CS146S.

- **Effort levels trade computation for quality**: Supported in concept by CS146S Week 4, which discusses multi-layered engineering and reasoning depth but does not directly address `/effort low|medium|high|max` syntax (Claude Code specific).

- **80/20 rule (Claude handles 80%, you provide 20% direction)**: Conceptually supported by CS146S Week 4 ("Good Context Good Code"), which emphasizes human-agent collaboration and context-driven quality but does not use the 80/20 framing. The principle aligns with CS146S emphasis on human judgment for architecture decisions while AI handles pattern matching.

- **Keywords that trigger better reasoning** ("Let me think through this step-by-step..."): Not explicitly addressed in CS146S but aligns with chain-of-thought principle. CS146S does not test or validate specific trigger phrases.

---

## Missing from CS146S (Masterclass-only content)

- **Devin's Four Prompting Principles** (Specify approach not outcome; Indicate starting points; Defensive prompting; Feedback mechanisms): Novel framework not found in CS146S materials. This is a valuable addition—particularly the emphasis on defensive prompting (specifying edge cases and error handling) which goes beyond standard prompting technique literature. **Status**: Strong addition; reflects production practices from AI coding agents.

- **Named cost/speed comparison table**: The table comparing Haiku ($0.80/1M), Sonnet ($3/1M), Opus ($15/1M) with context windows and use cases is masterclass-specific. CS146S discusses model differences conceptually but not with price/speed quantification. **Status**: Practical value added.

- **The 90/10/5% model allocation rule**: Masterclass states "Default to Sonnet. It's fast and costs $3 per million tokens (~$0.0001 per line of code). Use Opus for genuinely complex tasks (you'll know when). Use Haiku only for fast questions where quality doesn't matter." CS146S does not provide this allocation heuristic. **Status**: Useful production guidance.

- **Self-Consistency as a technique specifically for finding edge cases**: Masterclass frames it as "Finding edge cases, verifying Claude's understanding, checking for bugs." CS146S presents self-consistency but emphasizes "majority voting" and "aggregation" rather than edge-case discovery. **Status**: Practical refinement.

- **Keywords for triggering reasoning** ("Let me think through this step-by-step...", "Let's reason about this carefully..."): Masterclass includes explicit prompting phrases. CS146S does not test specific keywords. **Status**: Nice-to-have; limited research backing in provided materials.

- **Effort levels as a tuning mechanism**: `/effort low|medium|high|max` and the guidance to "use minimum effort level that produces the result you need" is Claude Code specific and not in CS146S. **Status**: Claude Code platform feature, valid addition but not transferable to other LLMs.

---

## Conflicts / Discrepancies

**No direct contradictions found.** However, there are important emphasis differences:

1. **Context comprehensiveness**:
   - **Masterclass framing**: RAG as one of six equal techniques ("nearly always" works when context is correct).
   - **CS146S framing**: Context/RAG presented as foundational to everything. CS146S Week 4's "Good Context Good Code" argues context quality is THE primary driver of output quality, not just one technique among many.
   - **Implication**: Masterclass could underemphasize how much prompting success depends on context engineering (CLAUDE.md, documentation quality, MCP integration). M02 focuses on *prompt structure* but downplays *context infrastructure*.

2. **Hallucination treatment**:
   - **Masterclass**: "If you provide the wrong context, Claude will use it anyway, leading to confidently incorrect answers" (brief mention under RAG failure modes).
   - **CS146S COURSE.md**: Dedicates a full section to hallucination as a core limitation: "They can generate plausible-sounding but false information... Always verify LLM-generated code; don't blindly trust it." More explicit emphasis on verification burden.
   - **Implication**: Masterclass treats hallucination as context problem; CS146S treats it as model limitation requiring systemic verification.

3. **Task scope framing**:
   - **Masterclass**: "Claude handles ~80% of a task through straightforward pattern matching. You provide 20% through direction, context, and verification."
   - **CS146S COURSE.md**: "They work best on tasks lasting a few hours or producing a few hundred lines of code... they struggle with multi-day projects requiring sustained reasoning and state management."
   - **Implication**: Masterclass emphasizes role clarity (you direct, Claude executes); CS146S emphasizes temporal/scope limits. Both correct but different emphasis.

---

## CS146S Topics Not in Masterclass M02

**Critical gaps** that would strengthen M02:

1. **Transformer architecture and attention mechanism**: CS146S Week 1 COURSE.md explains "The fundamental mechanism behind modern LLMs is the transformer architecture, which uses something called attention." Understanding attention explains *why* certain prompting techniques work. Masterclass teaches *how* to prompt but not the underlying mechanics. **Recommendation**: Add 1-2 paragraphs on why attention makes few-shot and chain-of-thought effective.

2. **Pretraining, fine-tuning, and inference phases**: CS146S COURSE.md distinguishes these phases and explains why fine-tuning (e.g., Codex from GPT-3) creates specialized models. Masterclass assumes model capabilities but doesn't explain their origin. **Recommendation**: 1 paragraph on how Claude's RLHF fine-tuning for instruction-following explains why it responds well to detailed prompts.

3. **Hallucination as core limitation, not edge case**: CS146S dedicates substantial space to hallucination risks and verification strategies. Masterclass mentions it only in RAG context. **Recommendation**: Explicit section: "Why hallucinations happen (pattern matching, no fact-checking), how to detect them (code doesn't run, function names don't exist), verification strategies (test code, cross-check facts)."

4. **Context window limitations and token budgets**: CS146S emphasizes "LLMs have a context window limitation—they can only 'see' a certain amount of text." Masterclass mentions this in RAG but not as a core constraint on prompting strategy. **Recommendation**: Add guidance on token budgets: "If your context + request exceeds the context window, RAG becomes mandatory."

5. **Codex-specific practices and "Ask Mode" / "Code Mode"**: CS146S COURSE.md details "Start with Ask Mode for large changes. When making significant changes, first ask the model to write an implementation plan in comments. Then, in a follow-up prompt, ask it to implement based on that plan." This is a validated two-step pattern. Masterclass doesn't mention it. **Recommendation**: Add as a principle or example: "For complex features, use two-stage prompting: ask for the plan first, then implement the plan."

6. **CLAUDE.md file and persistent context**: CS146S Week 4 extensively covers CLAUDE.md as foundational (coding standards, architectural decisions, review checklists). Masterclass doesn't mention it. **Recommendation**: Add section: "Creating a CLAUDE.md file for persistent prompting context—your shared rulebook with Claude."

7. **System-reminder tags and context reinforcement**: CS146S Week 4 reveals "tiny reminders, at the right time, change agent behavior" and explains how critical instructions are embedded throughout the pipeline. Masterclass doesn't address this. **Recommendation**: Mention that best prompts include "reminders at decision points" to reinforce constraints.

8. **Tree of Thoughts**: Masterclass references it as optional reading but doesn't explain the technique (exploring multiple reasoning paths simultaneously). CS146S Prompt Engineering Guide.md lists it as an advanced technique. **Recommendation**: 1 paragraph on when to use Tree of Thoughts (very hard problems, multiple solution paths).

9. **Verification and testing as prompting outcomes**: CS146S emphasizes "Always verify LLM-generated code; don't blindly trust it" and discusses "Test Generation and Coverage Improvement." Masterclass includes self-consistency for verification but not explicit test-generation prompting. **Recommendation**: Add example: "Prompt structure for test generation: 'Given this function [spec], generate 5 unit tests covering: happy path, boundary conditions, error cases, null inputs.'"

10. **Best practices from "How OpenAI Uses Codex"**: CS146S COURSE.md cites several production patterns from this paper. Masterclass doesn't reference Codex-specific practices like:
    - Using AGENTS.md file for persistent context
    - Structuring prompts like GitHub issues (file paths, diffs, intent)
    - Iteratively improving the development environment
    - Using task queues as lightweight backlogs
    **Recommendation**: Add section: "GitHub Issue-Style Prompts" with examples showing file paths, before/after, and clear intent.

---

## Prioritized Recommendations for Improvement

1. **Add "Prompting Fundamentals: Why It Works" section** (High Priority)
   - Explain transformer architecture at high level (2 paragraphs): attention mechanism, why it makes few-shot/chain-of-thought effective.
   - Explain inference vs. pretraining: why Claude can't learn from your conversation but responds well to detailed direction.
   - Outcome: Readers understand the "why" behind techniques, not just the "how."

2. **Create "Hallucination Detection and Verification" subsection under "Realistic Expectations"** (High Priority)
   - Explain what hallucinations are and why they happen (pattern matching without fact-checking).
   - Provide concrete detection strategies: "Code doesn't run? Function name doesn't exist? Fact unverifiable? Likely hallucination."
   - Add verification checklist: test code, cross-check with documentation, search codebase for cited functions.
   - Outcome: Readers know hallucinations are systematic risk, not random failure.

3. **Add "CLAUDE.md: Persistent Prompting Context" section** (High Priority)
   - Explain CLAUDE.md as your shared rulebook with Claude.
   - Template: what to include (coding standards, architectural decisions, review checklists, known gotchas).
   - Example CLAUDE.md for a real project type (e.g., Express API, React app).
   - Outcome: Readers understand that context engineering is as important as prompt engineering.

4. **Add "Two-Stage Prompting for Complex Features" example** (Medium Priority)
   - Show Ask Mode (write plan first) then Code Mode (implement the plan).
   - Demonstrate why this reduces scope creep and hallucinations on large tasks.
   - Example: "Build user authentication" broken into "Design schema & auth flow" → "Implement endpoints" → "Add rate limiting" → "Write tests."
   - Outcome: Readers have a battle-tested pattern for complex features.

5. **Expand "RAG: Retrieval-Augmented Generation" with context window budgeting** (Medium Priority)
   - Add practical guidance: "If your codebase is >100K tokens, RAG is mandatory, not optional."
   - Show how to calculate token budget: context window - request tokens - response buffer.
   - Provide decision tree: "Context fits? Use it. Context doesn't fit? Retrieve relevant snippets with RAG."
   - Outcome: Readers understand RAG as constraint-driven, not optional technique.

6. **Create "Production Prompting Checklist" before Workshop** (Medium Priority)
   - Integrate Devin's principles + Masterclass techniques + CS146S verification patterns.
   - Checklist: Specific approach? Starting point? Defensive edge cases? Context attached? Verification plan?
   - Use in workshop to validate prompts before using them.
   - Outcome: Workshop participants can assess prompt quality systematically.

7. **Add subsection on "Prompt Structure for Code Changes: GitHub-Issue Style"** (Medium Priority)
   - Reference "How OpenAI Uses Codex" pattern: file paths, component names, before/after diffs, clear intent.
   - Show side-by-side: weak prompt vs. structured prompt with same underlying request.
   - Example: Poor: "Refactor this module." Good: "In `/src/auth.js`, the `validateToken()` function doesn't check expiration. Add validation using the `isExpired()` helper from `/utils/time.js`. Current: [code]. Desired: [spec]."
   - Outcome: Readers understand specificity isn't just better, it's how Codex was trained to expect prompts.

8. **Clarify "Self-Consistency for Edge Cases" with concrete example** (Low Priority)
   - Current description is abstract. Provide concrete example:
   - "Run Method 1: 'Find all input validation in the API.' Method 2: 'Search for the word validate in the code.' Compare: what did each find? What was missed?"
   - Outcome: Readers understand self-consistency as practical debugging technique, not just abstract principle.

9. **Add "When Not to Use Each Technique" guidance** (Low Priority)
   - Expand the "When it fails" section for each technique with more reasoning.
   - Example for zero-shot: "If the task involves domain-specific conventions, zero-shot will fail. Use few-shot instead."
   - Outcome: Readers develop judgment about which technique to choose upfront.

10. **Integrate "Tree of Thoughts" as named technique with example** (Low Priority)
    - Currently referenced as optional. Make it a core technique with clear use case.
    - Example: "When a problem has multiple valid solutions (e.g., architecture decision), use Tree of Thoughts: ask Claude to explore 3-4 approaches in parallel, then compare."
    - Outcome: Readers can use ToT for design decisions, not just know it exists.

---

## Key Findings Summary

**Strengths of M02:**
- Excellent coverage of core techniques with clear when/why/cost guidance
- Devin's four principles add valuable production discipline
- Decision frameworks (model selection, effort levels) are practical and actionable
- Clear takeaway structure (habits, checklists, templates)

**Key Weaknesses:**
- Lacks theoretical grounding in LLM architecture/mechanics
- Underemphasizes hallucination risks and verification strategies
- Missing context-engineering patterns (CLAUDE.md, context front-loading)
- Doesn't reference validated Codex/production patterns from CS146S
- Limited on temporal/scope constraints for effective prompting

**Integration with CS146S:**
M02 is strongest as a *tactical execution guide* (how to prompt) but would greatly benefit from *theoretical foundation* (Week 1 LLM mechanics) and *architectural patterns* (Week 4 context engineering). The masterclass should explicitly signal its relationship to CS146S: "M02 teaches prompting techniques; CS146S Week 1 teaches why they work; CS146S Week 4 teaches how to sustain them at scale."
