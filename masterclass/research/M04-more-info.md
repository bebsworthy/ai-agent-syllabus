# M04 More Info: Recent Developments & Updates

**Research Date:** March 28, 2026
**Focus Areas:** Context engineering, context window management, long-context best practices, context compression, context poisoning, RAG, and agent memory patterns

---

## Summary

Since mid-2024, the field of context engineering has crystallized around a set of well-defined strategies for managing finite context windows effectively. The research confirms Drew Breunig's four failure modes remain central, while new developments emphasize *just-in-time data loading*, *structured agent memory*, *context compression techniques*, and *multimodal long-context challenges*. Importantly, 2024-2025 research has quantified the "context rot" phenomenon—the loss of performance in long contexts independent of distraction—validating the need for disciplined context curation. Anthropic has published official best practices that expand M04's framework with concrete strategies for system prompts, tools, examples, and runtime retrieval.

---

## New Developments Relevant to M04

### 1. Anthropic's Official "Effective Context Engineering for AI Agents" (2025-2026)

**Date/Period:** Released 2025-2026
**Source:** [https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

**What it is:**
Anthropic published an official engineering blog post formalizing context engineering as a discipline beyond prompt engineering. The post provides concrete strategies for system prompts, tools, examples, message history, and runtime context retrieval. Key insight: context is a finite resource; keep it "informative, yet tight."

**Relevance to M04:**
This is the authoritative voice on Anthropic's approach to context engineering. It validates the central thesis of M04 (context *quality* > quantity) and adds practical layers that the module currently omits.

**Current module coverage:**
M04 emphasizes CLAUDE.md, the three-phase workflow, and the four failure modes. It does not address:
- Designing system prompts at the "right altitude" (specific enough to guide, flexible enough to avoid brittleness)
- Tool design principles (non-overlapping, token-efficient, easily distinguishable)
- **Just-in-time runtime retrieval** as a core strategy (loading data dynamically via tools rather than pre-loading)
- Examples as "pictures worth a thousand words" for LLMs

**Recommended addition:**
Add a section titled **"Anthropic's Five Context Layers"** with subsections:
- **System Prompts**: Design for clarity without over-specification. Use XML tags or Markdown to organize sections.
- **Tools**: Build non-overlapping tool sets. If a human can't decide which tool to use, neither can Claude. Return token-efficient data.
- **Examples**: Use diverse, canonical examples (not exhaustive edge cases). Examples guide better than verbose rules.
- **Runtime Retrieval**: Use "just-in-time" loading. Agents should fetch data via tools as needed, not pre-load everything.
- **Message History**: Curate and compact frequently. For long-horizon tasks, use summarization, structured note-taking, or multi-agent delegation.

---

### 2. "Context Rot"—A Quantified Failure Mode (2024-2025)

**Date/Period:** Multiple papers published 2024-2025
**Source(s):**
- [https://arxiv.org/abs/2510.05381](https://arxiv.org/abs/2510.05381) – "Context Length Alone Hurts LLM Performance Despite Perfect Retrieval"
- [https://www.understandingai.org/p/context-rot-the-emerging-challenge](https://www.understandingai.org/p/context-rot-the-emerging-challenge)
- [https://research.trychroma.com/context-rot](https://research.trychroma.com/context-rot) – Databricks study

**What it is:**
Recent research (2024-2025) has identified and quantified "context rot"—a phenomenon where model performance degrades simply because the context is *longer*, independent of distraction or irrelevance. A Databricks study found that model correctness began falling around 32K tokens for Llama 3.1 405B, well before hitting max context limits. One arxiv paper showed that context length alone (even with perfect, relevant retrieval) hurts performance.

**Relevance to M04:**
This extends Breunig's four failure modes with a fifth implicit mode: *context overload*. It's not just poisoning, distraction, confusion, or clash—it's that more context, by itself, degrades reasoning. This validates M04's core thesis even more strongly.

**Current module coverage:**
M04 discusses distraction (larger contexts cause copying behavior) but frames it as a behavioral issue. The research reveals it's a *capacity* issue: long contexts mechanically reduce performance, possibly due to attention dilution or positional encoding degradation.

**Recommended addition:**
Add a new subsection under "The Four Failure Modes" called **"Context Rot: The Length Penalty"**:
> Recent research (Trychroma 2024, ArXiv 2025) shows that context length *alone* degrades performance, independent of irrelevance or distraction. Models begin losing accuracy around 30K–50K tokens, well before reaching max window sizes. This is not just about "noisy" context; it's about capacity. Keep context size minimized, not just curated.

---

### 3. Simon Willison's Crystallized Definition of Context Engineering (2025)

**Date/Period:** June 2025
**Source:** [https://simonwillison.net/2025/jun/27/context-engineering/](https://simonwillison.net/2025/jun/27/context-engineering/)

**What it is:**
Simon Willison, a leading voice in LLM practices, published a definitive post on context engineering. He frames it as "filling the context window with just the right information for the next step." The components: task descriptions, few-shot examples, RAG, multimodal data, tools, state, and history—all compacted effectively.

**Relevance to M04:**
Willison's definition provides an independent, high-reliability validation of M04's framing. It also elevates context engineering from a technique to a *named discipline*, signaling its importance.

**Current module coverage:**
M04 implicitly covers this, but doesn't use Willison's terminology or reference his work. Adding it strengthens credibility and reaches practitioners who follow Willison's writing.

**Recommended addition:**
Add a reference section or footnote citing Willison's June 2025 post as an independent, authoritative definition of context engineering. Reference it when introducing CLAUDE.md and the three-phase workflow.

---

### 4. A-MEM: Agentic Memory for Persistent State (February 2025)

**Date/Period:** February 2025
**Source:** [https://arxiv.org/abs/2502.12110](https://arxiv.org/abs/2502.12110)

**What it is:**
A-MEM is a novel system for persistent agent memory using Zettelkasten-style (networked note-taking) principles. Instead of flat history, agents dynamically organize memories in interconnected graphs, allowing agents to build knowledge networks that persist across sessions and improve with reflection.

**Relevance to M04:**
M04 mentions "structured note-taking" as a technique for long-horizon tasks but doesn't provide a concrete framework. A-MEM offers one. This is directly applicable to agent memory patterns in M05 and extends M04's three-phase workflow.

**Current module coverage:**
M04 briefly touches on "structured note-taking, or agentic memory" as a way to preserve knowledge outside the context window. It doesn't discuss *how* to organize or retrieve these notes effectively.

**Recommended addition:**
Add a new subsection under "Research-Plan-Implement Three-Phase Workflow" called **"Persistent Memory for Long-Horizon Tasks"**:
> For tasks spanning multiple sessions, use structured note-taking systems inspired by Zettelkasten or A-MEM. Agents write reflective notes to persistent storage (e.g., markdown files in version control or a dedicated memory database), linking related concepts and decisions. On each new session, load only high-value notes back into context, keeping working memory focused while preserving institutional knowledge.

---

### 5. Corrective RAG (CRAG) and Long RAG (2024-2025)

**Date/Period:** Multiple frameworks emerged 2024-2025
**Source(s):**
- [https://www.edenai.co/post/the-2025-guide-to-retrieval-augmented-generation-rag](https://www.edenai.co/post/the-2025-guide-to-retrieval-augmented-generation-rag)
- [https://research.google/blog/deeper-insights-into-retrieval-augmented-generation-the-role-of-sufficient-context/](https://research.google/blog/deeper-insights-into-retrieval-augmented-generation-the-role-of-sufficient-context/)
- [https://arxiv.org/abs/2501.07391](https://arxiv.org/abs/2501.07391) – "Enhancing Retrieval-Augmented Generation: A Study of Best Practices"

**What it is:**
Two major advances in RAG:
1. **Corrective RAG (CRAG)**: Adds a lightweight retrieval evaluator that assesses document quality in real-time. If retrieved docs are poor, the system refines the query or does web search instead. Enables adaptive RAG behavior.
2. **Long RAG**: Processes longer retrieval units (full sections/documents) instead of short chunks, preserving context and reducing computational costs.

**Relevance to M04:**
M04 implicitly assumes RAG as a technique but doesn't discuss quality control or long-document retrieval. CRAG and Long RAG are relevant because they address **context poisoning** (CRAG validates retrieval quality) and **context distraction** (Long RAG preserves coherent narratives).

**Current module coverage:**
M04 doesn't mention RAG explicitly or discuss retrieval quality assurance. It focuses on internal context management (CLAUDE.md, conversation history, loaded files), not external knowledge sources.

**Recommended addition:**
Add a subsection titled **"RAG and Retrieved Context Quality"** under the section on context management:
> When using RAG to populate context, apply **quality gates**: evaluate retrieved documents for relevance and accuracy before including them in the context window. Frameworks like Corrective RAG use lightweight evaluators to reject poor retrievals and trigger alternative queries (e.g., web search) dynamically. For documents with long, coherent narratives (manuals, academic papers, logs), retrieve entire sections rather than short chunks to preserve context and reduce token waste.

---

### 6. Context Poisoning Attacks: The New Reality (2024-2025)

**Date/Period:** Multiple papers 2024-2025
**Source(s):**
- [https://arxiv.org/pdf/2510.07192](https://arxiv.org/pdf/2510.07192) – "Poisoning Attacks on LLMs Require a Near-Constant Number of Poison Samples"
- [https://genai.owasp.org/llmrisk/llm01-prompt-injection/](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [https://www.emergentmind.com/topics/poisoning-attacks-on-llms](https://www.emergentmind.com/topics/poisoning-attacks-on-llms)

**What it is:**
Recent research (2024-2025) has shown that **context poisoning is highly effective and hard to detect**. As few as 250 malicious documents can backdoor models (600M to 13B parameters). Replacing 0.001% of training tokens with misinformation creates harmful models that pass safety benchmarks. Notably, standard defenses (adversarial training, supervised fine-tuning) often fail or even hide malicious behavior better.

**Relevance to M04:**
M04 discusses context poisoning as a failure mode where contradictory information in context leads to errors. The new research shows that poisoning can be **intentional and adversarial**, not just accidental inconsistency. This is critical for practitioners using RAG, tool outputs, and external data.

**Current module coverage:**
M04 frames context poisoning as "errors and inconsistencies compound" and proposes CLAUDE.md as the antidote. This is sound for internal consistency but doesn't address **adversarial external sources** (malicious API outputs, compromised documentation, injected web content).

**Recommended addition:**
Add a new section titled **"Adversarial Context Poisoning: Mitigations"** after discussing the four failure modes:
> Beyond unintentional inconsistencies, adversarial actors can inject malicious content into external sources (APIs, documentation, web pages, retrieved documents). Recent research shows that few poisoned examples are needed to corrupt model behavior. **Mitigations:**
> - **Source verification**: Validate external data sources (API origins, document hashes, author identity).
> - **Output sandboxing**: Run potentially-poisoned tool outputs through a verification step (e.g., a separate model or heuristic check) before trusting them.
> - **Retrieval quality gates**: Use CRAG-style evaluators to reject suspicious retrieved documents.
> - **Internal CLAUDE.md as override**: Keep authoritative rules in CLAUDE.md, marked as non-negotiable, so poisoned context doesn't override ground truth.

---

### 7. Context Compression Techniques Reaching Practical Maturity (2024-2025)

**Date/Period:** Multiple papers, with LongLLMLingua (2024) and newer systems (2025)
**Source(s):**
- [https://aclanthology.org/2024.acl-long.91/](https://aclanthology.org/2024.acl-long.91/) – LongLLMLingua
- [https://arxiv.org/html/2510.00615v2](https://arxiv.org/html/2510.00615v2) – Acon
- [https://www.llmlingua.com/](https://www.llmlingua.com/)

**What it is:**
Prompt compression techniques have matured. LongLLMLingua achieves 4x token reduction with +21.4% performance gains (NaturalQuestions), or 94% cost reduction (LooGLE). Acon (Optimizing Context Compression for Agents) specifically targets agent workflows, achieving up to 32x compression. These methods use learned compressors or reranking to preserve signal while discarding noise.

**Relevance to M04:**
M04 mentions `/compact` and auto-compaction of history but doesn't discuss *selective* compression—identifying which tokens matter most and dropping noise. Modern compression techniques can do this algorithmically, extending the practical lifetime of a context window.

**Current module coverage:**
M04 covers auto-compaction at 85% window capacity but presents it as a binary choice (compact or not). It doesn't discuss token-level compression, prioritization, or keeping high-signal summaries while dropping low-signal details.

**Recommended addition:**
Add a subsection under "Context Window and Token Management" called **"Advanced Compaction: Selective Compression"**:
> Modern compression techniques (LongLLMLingua, Acon) can selectively preserve high-signal information while dropping noise, achieving 4x–32x reductions with minimal performance loss. When manually compacting context (via `/compact` or between phases), prioritize: architectural decisions, recent code changes, unresolved bugs, and validated patterns. Drop: old exploration threads, duplicate explanations, completed tasks, and redundant examples. Consider using a compression tool in high-token-usage workflows to optimize cost and latency.

---

### 8. Andrej Karpathy's 2025 Framing: Claude Code as the Agent Template (2025)

**Date/Period:** January 2025
**Source:** [https://karpathy.bearblog.dev/year-in-review-2025/](https://karpathy.bearblog.dev/year-in-review-2025/)

**What it is:**
Andrej Karpathy identified Claude Code as the first convincing demonstration of what a practical LLM agent looks like. Key insight: Claude Code gains **contextual awareness** of the developer's local environment (repositories, dependencies, environment variables, private data) and reasons within those constraints. This is a validation of context engineering in practice.

**Relevance to M04:**
Karpathy's endorsement signals that the context-engineering-as-discipline approach (M04's core) is central to practical AI agents. It also highlights that agents must be *context-aware*—understanding what data they have access to and reasoning accordingly.

**Current module coverage:**
M04 doesn't reference Claude Code as a case study or validation. It would strengthen the module to show a real-world, widely-praised example of context discipline.

**Recommended addition:**
Add a short case study section at the end of the module called **"Case Study: Claude Code and Context Awareness"**:
> Claude Code (released 2024–2025) demonstrates context engineering in practice. Unlike stateless chatbots, Claude Code gains contextual awareness of the developer's local environment: repository structure, dependencies, environment variables, and private data. It reasons within these constraints, adjusting its recommendations based on what's available. This illustrates M04's central principle: discipline in context curation leads to dramatically improved outcomes.

---

### 9. Multimodal Needle in a Haystack: Long Context in Vision (2025)

**Date/Period:** Accepted to NAACL 2025 (June 2024 original)
**Source:** [https://aclanthology.org/2025.naacl-long.166.pdf](https://aclanthology.org/2025.naacl-long.166.pdf)

**What it is:**
Multimodal Needle in a Haystack (MMNeedle) is a benchmark for evaluating long-context capabilities of multimodal models. It tests the ability to retrieve a specific sub-image (needle) from a large collection (haystack) based on textual instructions. Key finding: GPT-4o excels but suffers from hallucinations; open-source models lag significantly.

**Relevance to M04:**
While M04 focuses on text-based context, multimodal systems introduce new complexities. Images, videos, and structured data add context dimensionally. M04's principles (quality > quantity, CLAUDE.md, three-phase workflow) apply, but the bench shows multimodal long-context is harder than text.

**Current module coverage:**
M04 is text-centric and doesn't address multimodal context engineering. This is a gap as AI systems increasingly handle images, PDFs, videos, and mixed-media documents.

**Recommended addition:**
Add a note in the "Takeaway" or "Next Steps" section acknowledging multimodal context:
> **Note on Multimodal Context:** As AI systems integrate vision, audio, and structured data, context engineering principles remain relevant but become more complex. When working with images, videos, or PDFs, apply the same discipline: curate high-signal examples, avoid duplicate content, maintain a multimodal CLAUDE.md documenting which formats to prioritize, and use lazy loading (reference images by path rather than embedding all at once).

---

### 10. Context Awareness in Modern LLMs (2025-2026)

**Date/Period:** 2025-2026
**Source:** [https://platform.claude.com/docs/en/build-with-claude/context-windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) and related documentation

**What it is:**
Recent Claude models (Sonnet 4.6, Haiku 4.5) feature built-in context awareness: the model tracks its remaining context window throughout a conversation and adjusts behavior accordingly. This is a game-changer for agent workflows—Claude can now say "I'm running low on context, let me summarize" without explicit instruction.

**Relevance to M04:**
This shifts the burden of context management partly to the model. Previously, context discipline was entirely the developer's responsibility. Now, Claude *knows* its constraints and can adapt. M04 should acknowledge this, though disciplined curation remains essential.

**Current module coverage:**
M04 doesn't mention context awareness in the model itself. It assumes the developer is entirely responsible for context hygiene.

**Recommended addition:**
Add a note in the "Commands for Context Hygiene" section:
> **Model Context Awareness (2025+):** Newer Claude models are context-aware and track remaining window size. They may proactively suggest summarization or clearing history. Trust these suggestions—they reflect the model's actual constraints. However, developer-driven discipline (using CLAUDE.md, three-phase workflow, `/context` checks) remains essential for predictable, high-quality outcomes.

---

## Emerging Best Practices to Consider Adding

1. **Just-in-Time Runtime Retrieval as Standard**: Move beyond pre-loading all files. Design workflows where agents fetch data via tools as needed, keeping working context minimal and focused.

2. **Tool Design as Context Engineering**: Treat tool design with the same discipline as system prompts. Non-overlapping tools, efficient returns, clear naming conventions—these reduce context confusion.

3. **Structured, Persistent Agent Memory**: For long-horizon or multi-session tasks, implement Zettelkasten-style memory systems (e.g., A-MEM) outside the context window. Link memories, curate them, and load selectively.

4. **Retrieval Quality Gates**: When using RAG or external data, validate retrieved content (relevance, accuracy, source) before adding to context. Use frameworks like Corrective RAG.

5. **Adversarial Context Hygiene**: In addition to avoiding accidental inconsistencies, defend against intentional context poisoning. Verify external data sources, isolate tool outputs, use CLAUDE.md as immutable ground truth.

6. **Compression-Aware Workflows**: In high-token-usage scenarios, use selective compression techniques to preserve signal while dropping noise. Prioritize architectural decisions, recent changes, and unresolved issues.

7. **Multimodal Context Discipline**: As systems handle images, videos, and documents, apply context curation principles to multimodal data. Avoid embedding all images; reference by path or metadata.

8. **Context Window Monitoring as Habit**: Use `/context` regularly (not just when running low). Track token usage patterns to spot inefficiencies and opportunities for optimization.

---

## Sources Consulted

**Anthropic:**
- [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Claude API Documentation - Context Windows](https://platform.claude.com/docs/en/build-with-claude/context-windows)

**Research Papers (ArXiv, ACL, etc.):**
- [Context Length Alone Hurts LLM Performance Despite Perfect Retrieval](https://arxiv.org/abs/2510.05381)
- [A-MEM: Agentic Memory for LLM Agents](https://arxiv.org/abs/2502.12110)
- [LongLLMLingua: Accelerating LLMs via Prompt Compression](https://aclanthology.org/2024.acl-long.91/)
- [Acon: Optimizing Context Compression for Long-Horizon LLM Agents](https://arxiv.org/html/2510.00615v2)
- [Multimodal Needle in a Haystack (MMNeedle)](https://aclanthology.org/2025.naacl-long.166.pdf)
- [Enhancing Retrieval-Augmented Generation: A Study of Best Practices](https://arxiv.org/abs/2501.07391)
- [Poisoning Attacks on LLMs Require a Near-Constant Number of Poison Samples](https://arxiv.org/pdf/2510.07192)

**Expert Analysis & Blogs:**
- [Simon Willison - Context Engineering (June 2025)](https://simonwillison.net/2025/jun/27/context-engineering/)
- [Andrej Karpathy - 2025 LLM Year in Review](https://karpathy.bearblog.dev/year-in-review-2025/)
- [Understanding AI - Context Rot: The Emerging Challenge](https://www.understandingai.org/p/context-rot-the-emerging-challenge)
- [Trychroma Research - Context Rot Study](https://research.trychroma.com/context-rot)
- [EdenAI - The 2025 Guide to RAG](https://www.edenai.co/post/the-2025-guide-to-retrieval-augmented-generation-rag)
- [Google Research - Sufficient Context in RAG](https://research.google/blog/deeper-insights-into-retrieval-augmented-generation-the-role-of-sufficient-context/)

**Security & Safety:**
- [OWASP Gen AI - Prompt Injection (LLM01:2025)](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP Gen AI - Data and Model Poisoning (LLM04:2025)](https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/)

---

## Recommendations for M04 Revision

**Priority 1 (High Impact, Low Effort):**
- Add Anthropic's "Five Context Layers" subsection with system prompts, tools, examples, runtime retrieval, and message history guidance.
- Clarify context rot as a quantified phenomenon independent of distraction.
- Add case study of Claude Code as a validation of context discipline.

**Priority 2 (High Impact, Medium Effort):**
- Add subsection on persistent agent memory (A-MEM, Zettelkasten patterns).
- Add subsection on RAG quality gates and corrective retrieval (CRAG).
- Add subsection on adversarial context poisoning and mitigations.

**Priority 3 (Medium Impact, Medium Effort):**
- Expand context compression discussion with LongLLMLingua and selective compression strategies.
- Add multimodal context curation note.
- Add model context awareness callout for Claude 4.5+.

**Priority 4 (Lower Priority, Can Wait for Future Revision):**
- Reference Simon Willison's June 2025 post as independent validation.
- Deep-dive into specific compression algorithms (academic interest, not essential for practitioners).
