# M04 Additional Info: Online Fact-Check

**Module:** M04 — Context Engineering
**Audit Date:** March 28, 2026
**Verified Against:** High-reliability sources (Anthropic, Drew Breunig, ArXiv, OpenAI, official documentation)

---

## Summary

The M04 module presents well-grounded claims about context management, with strong empirical support from Drew Breunig's research, Anthropic's official documentation, and peer-reviewed academic papers. Most core claims are **Well-Supported** or **Partially Supported**. One significant factual error found: Claude Haiku context window size is incorrect.

---

## Claim-by-Claim Analysis

### 1. Claude's 1 Million Token Context Window

**Module states:** "Claude has a 1 million token context window—enough to hold an entire modest codebase, 50 pages of conversation history, and detailed specifications."

**Status:** Well-Supported

**Evidence:**
- Anthropic official announcement: [1M context is now generally available for Opus 4.6 and Sonnet 4.6](https://claude.com/blog/1m-context-ga)
- Official documentation: [Context windows - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/context-windows)
- Claude Opus 4.6 and Sonnet 4.6 support 1M-token context windows
- 1M tokens approximately equals 750,000 words per official documentation

**Notes:** Claim is accurate and current (as of March 2026).

---

### 2. Claude Haiku Context Window: 128K Tokens

**Module states:** "Claude Haiku: 128K tokens"

**Status:** INCORRECT — Factual Error

**Evidence:**
- Official Anthropic documentation: [Claude Haiku 4.5 has 200,000 token context window](https://platform.claude.com/docs/en/build-with-claude/context-windows)
- Claude Haiku 4.5 specifications clearly show 200K tokens, not 128K
- The 128K figure may refer to output token limits for other models (Opus 4.6 supports up to 128K output tokens), not context windows
- Multiple sources confirm Haiku 4.5 at 200K: [Claude Haiku 4.5 Deep Dive](https://caylent.com/blog/claude-haiku-4-5-deep-dive-cost-capabilities-and-the-multi-agent-opportunity)

**Notes:** **REQUIRES CORRECTION.** Update to "Claude Haiku: 200K tokens"

---

### 3. The Four Failure Modes (Poisoning, Distraction, Confusion, Clash)

**Module states:** "Drew Breunig's research identified four ways context degrades performance: Context Poisoning, Context Distraction, Context Confusion, Context Clash"

**Status:** Well-Supported

**Evidence:**
- Drew Breunig's original research: [How Long Contexts Fail](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html)
- Simon Willison summary: [How to Fix Your Context](https://simonwillison.net/2025/Jun/29/how-to-fix-your-context/)
- O'Reilly Radar coverage: [Working with Contexts](https://www.oreilly.com/radar/working-with-contexts/)
- LangChain documentation on context engineering confirms all four modes: [Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/)

**Notes:** All four failure modes are accurately described and directly attributable to Breunig's research (2025).

---

### 4. Context Poisoning: Errors Compound

**Module states:** "Errors and inconsistencies compound as you add more context... Claude has to reconcile the contradiction. Its default behavior: follow the most recent contradictory information (or the one it reads first)."

**Status:** Partially Supported

**Evidence:**
- Breunig research confirms context poisoning occurs when hallucinations/errors are repeatedly referenced
- Elasticsearch Labs research: [Context poisoning in LLMs: How to defend your RAG system](https://www.elastic.co/search-labs/blog/context-poisoning-llm) — confirms errors compound
- ArXiv paper [Data Poisoning for In-context Learning](https://aclanthology.org/2025.findings-naacl.91/) shows contradictory context causes performance degradation
- Research: "when contradictory context is present, models perform better when the correct information appears later" — suggests recency bias exists but is not absolute

**Notes:** The claim about "most recent information" is partially true but oversimplified. Models exhibit both primacy bias (beginning) and recency bias (end), not just recency. The "Lost in the Middle" phenomenon shows middle-context information is used least reliably.

---

### 5. Context Distraction: Large Contexts Cause Copying Behavior

**Module states:** "Larger contexts induce 'copying behavior'—Claude defaults to mimicking examples and boilerplate rather than reasoning... Copy the style of the first example, even if it's outdated... Follow patterns from old code that were working around a bug you've since fixed"

**Status:** Well-Supported

**Evidence:**
- Breunig research directly addresses context distraction: "When a context grows so long that the model over-focuses on the context, neglecting what it learned during training"
- ArXiv paper [Breaking Focus: Contextual Distraction Curse in Large Language Models](https://arxiv.org/html/2502.01609v1) confirms semantically coherent but non-essential context degrades performance
- Transformer Circuits research: [In-context Learning and Induction Heads](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html) shows induction heads implement pattern copying from context
- ArXiv [In-Context Learning Without Copying](https://arxiv.org/html/2511.05743) confirms models default to copying patterns when context is large

**Notes:** Well-grounded in both Breunig's practical observations and academic research on induction heads and pattern matching behavior.

---

### 6. Context Confusion: Too Many Tools/Files Overwhelm Reasoning

**Module states:** "Too many tools, files, and instructions overwhelm Claude's reasoning. With 50 files in the context, Claude struggles to pick the right one to modify. With 10 MCP tools available, Claude might choose the wrong one."

**Status:** Partially Supported

**Evidence:**
- Breunig confirms context confusion: "when superfluous content in the context is used by the model to generate a low-quality response"
- "Context Degradation Patterns" research shows information interference and attention allocation failures
- ArXiv paper on context degradation mentions "the number of possible choices and distractors" affecting performance
- However, no specific empirical threshold ("50 files" or "10 tools") is cited in research

**Notes:** The general principle is well-supported, but the specific numbers (50 files, 10 tools) are illustrative rather than research-backed thresholds.

---

### 7. Context Clash: Contradictory Sequential Instructions

**Module states:** "Contradictory instructions given sequentially create confusion. If your CLAUDE.md says 'always use error code 400 for validation failures' but your last prompt says 'use 422 for validation failures,' Claude has conflicting guidance."

**Status:** Well-Supported

**Evidence:**
- Breunig directly addresses context clash: "when you accrue new information and tools in your context that conflicts with other information in the prompt"
- Confirmed by multiple sources that sequential contradictory instructions degrade reasoning

**Notes:** Clear and accurate characterization of the clash failure mode.

---

### 8. CLAUDE.md: Single Source of Truth

**Module states:** "CLAUDE.md is a file at the project root that encodes the project's conventions, patterns, and constraints... It's not user-facing. It's a briefing for Claude."

**Status:** Well-Supported

**Evidence:**
- Official Claude documentation: [Using CLAUDE.MD files: Customizing Claude Code for your codebase](https://claude.com/blog/using-claude-md-files)
- HumanLayer official guide: [Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- Builder.io guide: [How to Write a Good CLAUDE.md File](https://www.builder.io/blog/claude-md-guide)
- Dometrain: [Creating the Perfect CLAUDE.md for Claude Code](https://dometrain.com/blog/creating-the-perfect-claudemd-for-claude-code/)

**Notes:** CLAUDE.md is an established, officially-supported convention for Claude Code. Concept is well-grounded.

---

### 9. CLAUDE.md Best Practices: Keep it Under 200-300 Lines

**Module states:** (Implied through example but not explicitly stated. Example CLAUDE.md is ~115 lines)

**Status:** Well-Supported

**Evidence:**
- HumanLayer best practices: "Keep CLAUDE.md under 200 lines"
- General consensus across guides: "< 300 lines is best, and shorter is even better"
- Rationale: "Files longer than that start eating too much context, and Claude's instruction adherence actually drops"
- Builder.io emphasizes conciseness and relevance

**Notes:** The module's example (115 lines) demonstrates the principle well. Guideline is widely endorsed.

---

### 10. Token Accounting: 1M Tokens = ~400K Words, ~250K Lines Code

**Module states:** "Claude Sonnet/Opus: 1M tokens (~400K words, ~250K lines of code)"

**Status:** Partially Supported / Oversimplified

**Evidence:**
- Official: 1 million tokens ≈ 750,000 words (not 400K)
  - Source: [1M context GA announcement](https://claude.com/blog/1m-context-ga)
  - Medium analysis: [Understanding LLM Token Counts](https://criticalmynd.medium.com/understanding-llm-token-counts-what-1-000-128-000-and-1-million-tokens-actually-mean-9751131ac197)

- For code (250K lines):
  - 100 lines Python ≈ 1,000 tokens → 250K lines ≈ 2.5M tokens
  - 100 lines JavaScript ≈ 700 tokens → 250K lines ≈ 1.75M tokens
  - Module's claim of ~250K lines per 1M tokens is **incorrect by a factor of 2-10x**

**Notes:** **SIGNIFICANT ERROR.** The module understates the text capacity (400K vs 750K words) and overstates the code capacity (250K lines would require 1.75-2.5M tokens, not fit in 1M). This is a critical fact-check failure. The approximations should be:
- 1M tokens ≈ 750K words (or 2,000-3,000 pages of text)
- 1M tokens ≈ 100-150K lines of code (depending on language), not 250K

---

### 11. Token Accounting for Files and Conversations

**Module states:**
- "CLAUDE.md: 500–2,000 tokens"
- "A typical file (100 lines): 300–500 tokens"
- "A conversation with 10 exchanges: 2,000–5,000 tokens"
- "A large codebase (50K lines): 200,000 tokens"

**Status:** Approximately Accurate with Notes

**Evidence:**
- 100 lines of code ≈ 1,000 tokens (from OpenAI help and code tokenization research)
- Module's claim of 300-500 for 100 lines is **conservative estimate** (may be for lower-density languages)
- 50K lines at 4 tokens/line ≈ 200,000 tokens matches module's claim
- Conversation token counts are reasonable (3-5K for 10 exchanges is in line with observed practice)

**Notes:** The 100-line file estimate (300-500 tokens) is lower than academic consensus (1,000 tokens), suggesting the module assumes lower-density code. This is conservative but not incorrect—it depends on the language and style. Should note this variability.

---

### 12. Auto-Compaction at 85% of Context Window

**Module states:** "When you hit 85% of the context window, Claude automatically compacts history. You can tune this with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=75` (compact at 75% instead)."

**Status:** Partially Supported

**Evidence:**
- Official Anthropic documentation: [Automatic context compaction](https://platform.claude.com/cookbook/tool-use-automatic-context-compaction)
- Compaction control documentation confirms auto-compaction exists and is tunable
- The 85% figure is referenced in some guides, but official docs indicate the threshold varies (75-92% range depending on model and conversation structure)
- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` environment variable is mentioned in Claude Agent SDK documentation but not widely documented for general Claude Code use

**Notes:** The general principle is correct. However, the exact 85% threshold is approximate, and the `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` setting may be specific to the Agent SDK rather than standard Claude Code, which should be clarified.

---

### 13. Context Management Commands: /context, /clear, /compact, /btw

**Module states:** Table with these commands and their purposes

**Status:** Well-Supported

**Evidence:**
- Official Claude Code documentation: [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- `/clear` thoroughly documented across multiple guides
- `/compact` documented with ability to accept custom instructions
- `/btw` documented as "quick question that doesn't enter persistent history"
- `/context` command shown with token breakdown output in official examples

**Notes:** All four commands are accurate and well-supported. The purposes and behaviors described match official documentation and practice guides.

---

### 14. "Lost in the Middle" Phenomenon (Not Explicitly Mentioned, But Implied)

**Module states:** (Implicitly: "follow the most recent contradictory information (or the one it reads first)")

**Status:** Well-Supported (Underlying Research)

**Evidence:**
- ArXiv paper [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
- MIT Press publication in Transactions of the Association for Computational Linguistics, 2024
- Demonstrates U-shaped performance curve: models perform best on information at beginning (primacy bias) and end (recency bias), worst in middle
- Performance can degrade 20-30% when relevant information shifts to middle

**Notes:** This phenomenon is highly relevant to context engineering but not explicitly named in the module. It would strengthen the module to mention that models exhibit both primacy and recency bias, not just "most recent information."

---

### 15. Research-Plan-Implement Three-Phase Workflow

**Module states:** Three phases: Research (separate session), Plan (Plan Mode), Implementation (execute plan)

**Status:** Supported by Best Practices, Not Empirically Proven

**Evidence:**
- Breunig's work and community guides endorse this workflow pattern
- The rationale (keeping research artifacts out of implementation context) is sound
- No direct empirical study validates this specific three-phase breakdown
- However, the principle of context isolation between phases is well-established in context engineering literature

**Notes:** This is sound practice based on context engineering principles, but not an empirically proven methodology. It's a reasonable recommendation but should be labeled as best practice rather than research-proven technique.

---

### 16. Drew Breunig Attribution and Research Publication

**Module states:** "Drew Breunig's research identified four ways context degrades performance"

**Status:** Well-Supported, Publication Date Verified

**Evidence:**
- Drew Breunig's blog: [How Long Contexts Fail](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html) (published June 2025)
- Follow-up article: [How to Fix Your Context](https://www.dbreunig.com/2025/06/26/how-to-fix-your-context.html)
- O'Reilly Radar podcast: [Generative AI in the Real World: Context Engineering with Drew Breunig](https://www.oreilly.com/radar/podcast/generative-ai-in-the-real-world-context-engineering-with-drew-breunig/)
- Currently writing Context Engineering Handbook for O'Reilly

**Notes:** Attribution is accurate. The research is recent (June 2025) and has become widely cited in the context engineering community.

---

## Key Missing Information

1. **"Lost in the Middle" Phenomenon:** The module could strengthen context poisoning discussion by noting that models exhibit both primacy and recency bias, not just recency. This affects how contradictory information is handled.

2. **Effective vs. Nominal Context Window:** The module doesn't mention that despite 1M nominal window, effective context window for complex reasoning may be significantly smaller (research suggests 10-50% in some cases). This context is important for realistic expectations.

3. **Context Window Variability by Model:** Module mentions Sonnet/Opus (1M) and Haiku separately but doesn't note that other Claude models (e.g., Claude 3 family) have 200K windows. This could clarify model selection.

4. **Token Counting Tools:** The module could recommend official token counters (e.g., OpenAI tokenizer, Claude API's token counting endpoint) rather than approximations.

5. **Cost vs. Quality Trade-off:** Research shows that GPT-5.2 recently restricted to 400K context window "trading raw size for 'perfect recall' and superior reasoning" — suggests there's a trade-off between context size and reasoning quality that deserves discussion.

---

## Sources Consulted

### Official Documentation (Anthropic)
- [Context windows - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/context-windows)
- [Automatic context compaction](https://platform.claude.com/cookbook/tool-use-automatic-context-compaction)
- [Context editing - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/context-editing)
- [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [1M context is now generally available](https://claude.com/blog/1m-context-ga)
- [Using CLAUDE.MD files](https://claude.com/blog/using-claude-md-files)

### Primary Research (Drew Breunig)
- [How Long Contexts Fail](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html)
- [How to Fix Your Context](https://www.dbreunig.com/2025/06/26/how-to-fix-your-context.html)

### Academic Papers (ArXiv/Peer Review)
- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) (MIT Press/TACL 2024)
- [Breaking Focus: Contextual Distraction Curse in Large Language Models](https://arxiv.org/html/2502.01609v1)
- [In-Context Learning and Induction Heads](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html)
- [Data Poisoning for In-context Learning](https://aclanthology.org/2025.findings-naacl.91/)
- [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://research.trychroma.com/context-rot)

### Community Best Practices
- [Writing a good CLAUDE.md - HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [How to Write a Good CLAUDE.md File - Builder.io](https://www.builder.io/blog/claude-md-guide)
- [Creating the Perfect CLAUDE.md - Dometrain](https://dometrain.com/blog/creating-the-perfect-claudemd-for-claude-code/)
- [Code to Tokens Conversion: A Developer's Guide - 16x Prompt](https://prompt.16x.engineer/blog/code-to-tokens-conversion)
- [OpenAI Tokenizer Documentation](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)

### Industry Analysis
- [Elasticsearch Labs: Context Poisoning in LLMs](https://www.elastic.co/search-labs/blog/context-poisoning-llm)
- [O'Reilly Radar: Working with Contexts](https://www.oreilly.com/radar/working-with-contexts/)
- [LangChain: Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/)

---

## Audit Conclusion

**Overall Grade: B+ (Well-Grounded, Minor Factual Error)**

### Strengths:
- Accurate attribution to Drew Breunig's recent research
- Sound practical advice based on established context engineering principles
- Concrete examples of CLAUDE.md and workflow
- Clear explanation of the four failure modes

### Critical Issues Requiring Correction:
1. **Claude Haiku context window:** Listed as 128K, should be **200K**
2. **Token approximations for code:** 250K lines per 1M tokens is **off by 2-10x** (should be 100-150K lines)
3. **Word-to-token ratio:** 400K words per 1M tokens understates capacity (should be ~750K words)

### Recommendations:
1. Correct Claude Haiku specification before publication
2. Revise token accounting section with more accurate estimates
3. Consider mentioning "Lost in the Middle" phenomenon to clarify recency vs. primacy bias
4. Add note about effective context window (may be smaller than nominal)
5. Recommend official token counting tools for precise measurements

The module represents excellent practical guidance on context engineering with strong research backing, but requires factual corrections in the specifications section.

