# M01 More Info: Recent Developments & Updates

## Summary

The field of Large Language Models has undergone substantial shifts since this module was likely written (pre-2024). The theoretical foundations remain sound—transformers, attention mechanisms, autoregressive generation, and the core insight about hallucinations as structural properties are still accurate—but significant new developments have emerged that deepen our understanding of how LLMs work and dramatically expand what they can do.

Most notably:
1. **Context windows have exploded**: Models now support 1-10 million tokens (vs. the 128K-1M described), requiring new architectural innovations to manage the computational burden
2. **Mechanistic interpretability has matured from theoretical to practical**: Anthropic's circuit tracing tools now allow direct observation of how models reason step-by-step
3. **Extended reasoning has become a first-class design pattern**: Models like OpenAI's o1 and Gemini 2.0 have fundamentally changed inference by trading test-time compute for accuracy
4. **Attention mechanisms have evolved significantly**: New variants (Multi-Latent Attention, Gated DeltaNet, Dynamic Attention Scaling) offer dramatic efficiency gains

The module's core message—that understanding these mechanics is essential to using LLMs effectively—is more true than ever. However, the module should be updated to reflect how much practitioners can now observe and optimize within these systems, not just understand them in abstract terms.

**Update Priority: MEDIUM-HIGH** — The fundamentals remain correct, but readers will encounter newer architectural patterns and research findings in practice that the module doesn't yet address.

---

## New Developments Relevant to M01

### Extended Context Windows (1M–10M Tokens)

**Date/Period:** March 2026 and ongoing since mid-2024

**Source:**
- [Claude API Docs – Models Overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Best LLMs for Extended Context Windows in 2026](https://aimultiple.com/ai-context-window)
- [LLMs with largest context windows](https://codingscape.com/blog/llms-with-largest-context-windows)

**What it is:**
Claude Opus 4.6 and Sonnet 4.6 now support 1 million token context windows at standard pricing (no long-context surcharge). Meta's Llama 4 Maverick supports 10 million tokens. Competing models like Gemini 3.1 Pro also offer 1M tokens. This represents a 50–100x increase from the 128K and 200K context windows typical in 2023–2024.

Achieving this required new attention mechanisms:
- **Infini-Attention**: Stores historical context in a fixed-size Memory Matrix instead of a linearly growing KV cache, achieving 114x fewer parameters into GPU VRAM
- **YaRN**: A compute-efficient context extension method requiring 10x fewer tokens and 2.5x fewer training steps than prior methods
- **Dynamic Attention Scaling** (Llama 4): Dynamically adjusts query magnitude based on position, helping with ultra-long sequences

**Relevance to M01:**
The module states: "A modest codebase of 50K lines is roughly 200K tokens." This is now outdated. With 1M–10M token windows, the constraint has shifted. However, the module's deeper insight—that context **quality** matters more than quantity—is now even more important. The challenge has evolved: practitioners can include full codebases, but must still decide what to include to avoid noise.

The module also doesn't address how extended context affects attention computation. At 1M tokens, the quadratic cost of full attention becomes prohibitive. Models are now using efficient attention variants that practitioners should understand.

**Current module coverage:**
The module mentions Sonnet 4.6 supporting 1M tokens (line 64–65), which is correct. However, it doesn't discuss:
- Why 1M tokens is possible now (new attention mechanisms)
- The distinction between architectural limits and practical utility
- How to use expanded context effectively (beyond "don't pad with boilerplate")
- The trade-offs of using 10M-token models (Llama 4)

**Recommended addition:**
Add a section on "Modern Context Windows" after the existing context window section, explaining:
1. How efficient attention variants (Infini-Attention, YaRN, Dynamic Attention Scaling) enable long contexts
2. A note that expanded context is most useful for code when strategically designed—dumping entire codebases doesn't guarantee better results
3. A mention of test-time context: with 1M+ tokens available, structured RAG (retrieval-augmented generation) is now a primary pattern for grounding LLMs in up-to-date information

---

### Circuit Tracing: Direct Observation of Model Reasoning

**Date/Period:** March 2025 to present

**Source:**
- [Anthropic Open-Source Circuit Tracing](https://www.anthropic.com/research/open-source-circuit-tracing)
- [Circuits Updates – April 2025](https://transformer-circuits.pub/2025/april-update/index.html)
- [The Utility of Interpretability — Emmanuel Amiesen, Anthropic](https://www.latent.space/p/circuit-tracing)
- [On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html)
- [Circuit Tracing for the Rest of Us](https://subhadipmitra.com/blog/2026/circuit-tracing-production/)

**What it is:**
Anthropic has released open-source tools that allow researchers and practitioners to trace the computational pathways a language model uses when reasoning about a specific problem. By generating "attribution graphs," these tools reveal which internal features (learned building blocks) activate and in what sequence as a model produces an output. The technique combines feature identification (what is the model thinking about?) with circuit analysis (how do those features interact?).

Key capability: you can now modify feature values and observe how outputs change, enabling hypothesis testing about model behavior.

**Relevance to M01:**
The module teaches that "attention is learned from training data, not programmed" and that hallucinations arise from pattern matching against training data. This is correct but abstract. Circuit tracing makes it concrete: you can now see *which specific patterns* activate during hallucination, how multi-step reasoning unfolds token-by-token, and even how safety mechanisms (jailbreak resistance) work internally.

This is a paradigm shift for the module's target audience (Claude Code users). Instead of trusting the module's explanation of "Claude confabulates confidently," users can now observe the mechanism directly—and potentially debug or improve Claude's behavior in their own contexts.

**Current module coverage:**
The module does not mention mechanistic interpretability, circuit analysis, or any tools for observing model internals. This is a significant gap, given that Anthropic has now made these tools open-source and MIT Technology Review recognized mechanistic interpretability as a 2026 Breakthrough Technology.

**Recommended addition:**
Add a section titled "Understanding Model Internals: Circuit Tracing" in the Theory section, explaining:
1. What circuit tracing is and why it matters (makes abstract ideas concrete)
2. How to think about features and circuits (optional deeper dive, with link to Anthropic's tutorials)
3. A note that practitioners can now inspect *why* Claude hallucinates in specific contexts, enabling better context design
4. A reference to Anthropic's open-source tools and Neuronpedia for exploring circuits on public models

---

### Reasoning Tokens and Test-Time Compute Scaling

**Date/Period:** 2025 to present

**Source:**
- [Rethinking Thinking Tokens: LLMs as Improvement Operators](https://arxiv.org/abs/2510.01123)
- [Demystifying Reasoning Dynamics with Mutual Information](https://openreview.net/forum?id=E1FrjgaG1J)
- [The Breakthrough in LLM Reinforcement Learning Scaling Laws](https://medium.com/ai-simplified-in-plain-english/the-breakthrough-in-llm-reinforcement-learning-scaling-laws-12efb1bc613e)
- [Technical Report: The Decreasing Value of Chain of Thought in Prompting](https://gail.wharton.upenn.edu/research-and-insights/tech-report-chain-of-thought/)

**What it is:**
Recent research has revealed that during LLM reasoning, certain "thinking tokens" (like "Hmm," "Wait," "Therefore") act as information peaks where the model reorganizes its reasoning. Mechanistically, these correspond to points where mutual information between input and internal hidden states peaks. Models like OpenAI's o1, o3, and Gemini 2.0 have formalized this into a design pattern: allocate additional tokens at inference time for "reasoning" before generating the final answer.

This flips traditional scaling: instead of scaling training compute, scale test-time (inference) compute by trading budget for reasoning depth.

**Relevance to M01:**
The module states: "'Thinking harder' actually works. When you ask Claude to reason step-by-step, or use `/effort high`, you're allocating more reasoning tokens before the final output."

This statement is now grounded in rigorous research. The module correctly identifies the mechanism (more tokens = more opportunity for pattern-matching to find the right path), but now we know:
1. Which tokens matter most (thinking tokens at reasoning transitions)
2. The theoretical basis (mutual information peaks)
3. The trade-offs (better reasoning vs. latency and cost)
4. That major models have now baked this into their design

**Current module coverage:**
The module mentions `/effort high` and reasoning tokens but treats them as a best practice. It doesn't explain the underlying theory (now known) or the distinction between reasoning tokens and other tokens.

**Recommended addition:**
Expand the "Thinking Harder Actually Works" section to include:
1. A note that models like o1 and Gemini 2.0 now use this at the architecture level (different from Claude's current implementation)
2. A mention of "thinking tokens" as internal markers of reasoning transitions
3. A practical note: reasoning tokens are most effective for complex logic/math/reasoning tasks, less so for simple retrieval tasks
4. A quantitative insight: research shows reasoning model benefits plateau or reverse beyond training distribution, so don't expect unlimited returns from adding more reasoning

---

### In-Context Learning: Brittle Pattern Matching, Not Deep Learning

**Date/Period:** 2025 research wave

**Source:**
- [Is LLM in-context learning real learning? A Microsoft study](https://bdtechtalks.com/2025/09/25/llm-in-context-learning-study-microsoft/)
- [Long-Context ICL Challenges](https://openreview.net/forum?id=Cw2xlg0e46)
- [Factors affecting the in-context learning abilities of LLMs](https://www.isca-archive.org/interspeech_2025/hegde25_interspeech.pdf)
- [Study could lead to LLMs that are better at complex reasoning](https://news.mit.edu/2025/study-could-lead-llms-better-complex-reasoning-0708)

**What it is:**
A major 2025 Microsoft and University of York study reveals that in-context learning (ICL)—the ability to learn new tasks from examples in the prompt—is real but **brittle and superficial**. Key finding: "Word Salad" prompts (nonsense text with the right statistical structure) eventually performed nearly as well as coherent instructions, showing that LLMs rely heavily on statistical cues, not semantic understanding.

Additionally, long-context LLMs (with 1M+ token windows) paradoxically *struggle* more with complex in-context learning tasks than shorter-context models, suggesting the added flexibility introduces noise.

**Relevance to M01:**
The module doesn't explicitly discuss in-context learning, but it implicitly relies on the idea that providing context (code snippets, CLAUDE.md) teaches the model about your project. This is now shown to be more statistical than deep: the model is pattern-matching against the structure and statistical properties of your context, not learning the task semantics.

This has profound implications for the module's advice on context engineering (Module 4). It's not enough to provide context—it must be *structured* in ways that provide strong statistical signals.

**Current module coverage:**
The module doesn't address in-context learning directly, though it references context as the primary mechanism for improving Claude's performance (line 35, 59–60).

**Recommended addition:**
Add a subsection under "Why Hallucinations Happen" (or as a new section) titled "What Context Actually Does: Statistical Pattern Matching":
1. Explain that context improves performance not by "teaching" but by providing strong statistical patterns to match against
2. Note the Microsoft finding: structure and format matter more than semantic clarity
3. Practical implication: CLAUDE.md and code examples should be highly consistent and exemplary (not average)
4. A warning: including too many examples (which long-context enables) can introduce noise; quality over quantity remains true even at 1M tokens

---

### Hallucination Mitigation: New Techniques and Remaining Challenges

**Date/Period:** 2025 research surge

**Source:**
- [Survey and analysis of hallucinations in large language models](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1622292/full)
- [A hallucination detection and mitigation framework](https://www.nature.com/articles/s41598-025-31075-1)
- [Mitigating Hallucination in Large Language Models (LLMs): An Application-Oriented Survey on RAG, Reasoning, and Agentic Systems](https://arxiv.org/html/2510.24476v1)
- [Multi-Layered Framework for LLM Hallucination Mitigation](https://www.mdpi.com/2073-431X/14/8/332)

**What it is:**
2025 research has moved hallucination mitigation beyond "provide context" to multi-layered frameworks:
1. **RAG Enhancements**: Retrieval-augmented generation now uses verifiable evidence sources, improving knowledge retrieval and utilization
2. **Reasoning-based mitigation**: Deeper chains of thought and reflective process control reduce logical hallucinations
3. **Decoding strategy innovations**: FarSight, a plug-and-play decoding strategy, reduces "attention interference" from outlier tokens by optimizing the causal mask
4. **Detection frameworks**: New methods (Q-S-E: Question-Answer Generation, Sorting, Evaluation) enable quantitative detection of hallucinations in outputs
5. **Domain-specific fine-tuning**: Aligned with domain truth constraints, mitigating hallucinations in high-stakes fields like medicine

**Relevance to M01:**
The module correctly identifies hallucinations as structural (not bugs) and proposes two responses: provide context and verify before executing. This advice is still sound but now incomplete. 2025 research shows that:
- Context alone is insufficient for high-stakes tasks
- Reasoning and verification are complementary (not redundant)
- Decoding strategies can actively reduce hallucination without fine-tuning
- For critical applications, multi-layered defenses are now expected practice

**Current module coverage:**
The module addresses hallucinations in lines 53–60 with good intuition. It doesn't mention RAG, detection frameworks, or modern decoding strategies.

**Recommended addition:**
Expand the "Why Hallucinations Happen (and What to Do About It)" section to include:
1. A note that raw context provision is necessary but not sufficient
2. A practical insight: RAG (retrieving up-to-date information) is now a primary pattern for mitigating hallucinations on knowledge-sensitive tasks
3. A mention of verification strategies beyond "read the actual file": asking Claude to flag confidence levels, using decoding strategies that reduce outlier-token interference
4. A reference to 2025 detection frameworks for high-stakes applications
5. A note that hallucination mitigation has become a multi-layered field; Claude Code users should expect that critical tasks require multi-step verification

---

### Attention Mechanism Evolution: Efficiency Variants and New Architectures

**Date/Period:** 2024–2026

**Source:**
- [Inside Llama 4: How Meta's New Open-Source AI Crushes GPT-4o and Gemini](https://machine-learning-made-simple.medium.com/inside-llama-4-how-metas-new-open-source-ai-crushes-gpt-4o-and-gemini-e3265f914599)
- [Grouped Query Attention (GQA) vs. Multi Head Attention (MHA)](https://friendli.ai/blog/gqa-vs-mha)
- [Beyond Standard LLMs - by Sebastian Raschka, PhD](https://magazine.sebastianraschka.com/p/beyond-standard-llms)
- [LLMOrbit: A Circular Taxonomy of Large Language Models](https://arxiv.org/html/2601.14053v1)

**What it is:**
While the transformer architecture's core attention mechanism hasn't fundamentally changed, practical variants have proliferated:

1. **Grouped Query Attention (GQA)** (Llama 3, now standard): Instead of one key-value cache per head, share across grouped heads. Reduces memory bandwidth bottleneck while maintaining quality.

2. **Multi-Latent Attention** (DeepSeek-V3): Extends attention to operate over latent feature spaces rather than token embeddings directly.

3. **Gated DeltaNet** (Kimi Linear, October 2025): Uses gated mechanisms to improve attention efficiency, reducing memory usage and improving generation speed.

4. **Dynamic Attention Scaling** (Llama 4): Dynamically adjusts Query magnitude based on sequence position using a logarithmic function. Queries looking further back in ultra-long contexts are scaled slightly higher, improving retrieval in very long sequences.

5. **Efficient baselines** (FlashAttention-2, Mamba state space models, RetNet, Linear Attention): Alternative or supplementary approaches to reduce quadratic complexity.

**Relevance to M01:**
The module introduces attention as a learned mechanism for determining relevance (lines 23–27). This is still correct but abstract. Modern models have evolved from "pure" multi-head attention to composite systems with efficiency innovations baked in.

For Claude Code users, this matters because:
- Understanding GQA and similar tricks explains why modern models can have massive context windows (no quadratic blowup)
- Awareness of attention variants helps practitioners understand model trade-offs and when to use different models
- The core insight (attention learns relationships) is unchanged, but the implementations now include tricks for efficiency

**Current module coverage:**
The module doesn't discuss attention variants or efficiency improvements. The "Transformer Architecture and Attention" section treats attention as if it hasn't evolved significantly since the 2017 paper.

**Recommended addition:**
Add a section titled "Modern Attention Variants: From Theory to Efficiency" after the attention explanation:
1. A note that while the core mechanism (learning relationships) hasn't changed, modern implementations include efficiency variants
2. List major variants (GQA, Gated DeltaNet, Dynamic Attention Scaling) with brief explanations of why they matter
3. A practical note: these variants are mostly transparent to users but enable the extended context windows now common
4. A reference to FlashAttention and other low-level optimizations as enabling technology for modern models

---

### Scaling Laws Refinement: Test-Time Compute and Density Laws

**Date/Period:** 2025 research

**Source:**
- [A brief history of LLM Scaling Laws and what to expect in 2025](https://www.jonvet.com/blog/llm-scaling-in-2025)
- [How to build AI scaling laws for efficient LLM training](https://news.mit.edu/2025/how-build-ai-scaling-laws-efficient-llm-training-budget-maximization-0916)
- [Scaling Laws Meet Model Architecture](https://www.arxiv.org/pdf/2510.18245)
- [The Breakthrough in LLM Reinforcement Learning Scaling Laws](https://medium.com/ai-simplified-in-plain-english/the-breakthrough-in-llm-reinforcement-learning-scaling-laws-12efb1bc613e)
- [Densing law of LLMs](https://www.nature.com/articles/s42256-025-01137-0)

**What it is:**
2025 has seen a shift in how scaling laws are understood:

1. **Test-Time Compute Scaling**: Models like o1, Gemini 2.0 Flash, and o3 trade training budget for inference budget. Allocating more compute at test time (longer reasoning chains) yields better results for reasoning-intensive tasks—a new frontier beyond pre-training and post-training scaling.

2. **The "Densing Law"**: Empirical evidence shows capability density doubles every ~3.5 months. The same performance can now be achieved with exponentially fewer parameters. This has led to interest in sparse (MoE) and efficient architectures.

3. **Reinforcement Learning Scaling**: The first rigorous scaling law for RL (backed by 400,000+ GPU hours of experimentation) shows how RL can be scaled predictably, enabling new post-training approaches.

4. **Data Quality > Quantity**: High-quality pretraining data is becoming the bottleneck. Synthetic data for post-training (especially in math and coding) is proving highly effective.

**Relevance to M01:**
The module doesn't explicitly address scaling laws, but it implicitly assumes a fixed compute model: Claude is trained, fine-tuned, and deployed. The model's capabilities are frozen at inference time.

This assumption is now partially outdated. The rise of test-time compute means:
- Models can allocate different amounts of reasoning compute based on task difficulty
- "Thinking harder" is now a first-class design pattern, not a hack
- The trade-off between cost and accuracy is now explicit and tunable at inference time

**Current module coverage:**
Not directly addressed.

**Recommended addition:**
Add a subsection to "Pretraining, Fine-tuning, and Inference" titled "Test-Time Compute: A New Scaling Frontier":
1. Explain that models like o1 and Gemini 2.0 now allocate compute during inference (reasoning tokens), changing the cost-accuracy trade-off
2. Note that this makes "longer reasoning" a genuine design parameter, not just a user habit
3. A practical insight: for complex reasoning tasks, allocating more reasoning tokens is now built into the model, not optional
4. A mention that data quality (especially synthetic data for specialized tasks) has become as important as data quantity

---

### Knowledge Cutoff and Retrieval-Augmented Generation Integration

**Date/Period:** 2025 and ongoing

**Source:**
- [The 2025 Guide to Retrieval-Augmented Generation (RAG)](https://www.edenai.co/post/the-2025-guide-to-retrieval-augmented-generation-rag)
- [RAG in 2026: Bridging Knowledge and Generative AI](https://squirro.com/squirro-blog/state-of-rag-genai)
- [The State of Retrieval-Augmented Generation (RAG) in 2025 and Beyond](https://www.ayadata.ai/the-state-of-retrieval-augmented-generation-rag-in-2025-and-beyond/)
- [Enhancing Retrieval-Augmented Generation: A Study of Best Practices](https://aclanthology.org/2025.coling-main.449/)

**What it is:**
Retrieval-Augmented Generation (RAG) has matured from an experimental technique to a standard practice for grounding LLMs in current information. RAG works by retrieving relevant documents *before* generation, allowing models to generate responses supported by those documents.

For knowledge-sensitive tasks (code documentation, domain-specific Q&A, news), RAG mitigates both knowledge cutoff limitations and hallucinations by providing real evidence.

**Relevance to M01:**
The module states: "Claude was trained on a large corpus of publicly available text — code, documentation, research papers, forums — up to a knowledge cutoff."

This is still true but incomplete. In practice, users now integrate Claude with RAG systems to work around knowledge cutoff. For Claude Code users specifically:
- Code documentation retrieval (your actual docs, not Claude's training data)
- API reference lookups
- Project-specific pattern libraries

These are now standard patterns when Claude is deployed in production.

**Current module coverage:**
The module mentions knowledge cutoff (line 45) but treats it as a constraint, not a problem with well-established mitigations.

**Recommended addition:**
Expand the "Pretraining, Fine-tuning, and Inference" section with a note on "Beyond the Knowledge Cutoff: RAG and Context Retrieval":
1. Acknowledge that knowledge cutoff is a hard boundary (Claude can't learn during inference)
2. Explain RAG as the standard mitigation: retrieve current information and include it in context
3. For Claude Code users specifically: mention that retrieving your actual codebase (via tools, file search, or structured retrieval) is a form of RAG
4. A practical note: RAG is increasingly how large systems integrate LLMs, not as a one-off feature but as an architectural pattern

---

## Emerging Concepts to Consider Adding

### 1. **Feature Visualization and Mechanistic Interpretability as User-Facing Tools**

Mechanistic interpretability was once a research frontier. With Anthropic's open-source circuit tracing tools and community projects like Neuronpedia, practitioners can now inspect *why* Claude makes specific decisions. This is relevant to Module 1 because it moves from "understanding how LLMs work in theory" to "observing how they work in your context."

Future modules (especially context engineering and prompt optimization) could benefit from teaching practitioners to:
- Identify which features activate on their specific codebase
- Hypothesize about hallucinations by examining circuits
- Potentially improve prompt design based on circuit observations

### 2. **Multimodal Reasoning and Vision**

The module focuses exclusively on text. Claude 3.5 Sonnet and newer models have strong vision capabilities, and understanding how vision information flows through attention mechanisms (distinct from text tokens) is increasingly relevant. For Claude Code users, this matters for:
- Reading error messages from screenshots
- Analyzing UI for automation
- Understanding how image context affects reasoning

### 3. **In-Context Learning as Brittle Statistical Matching**

The 2025 Microsoft research on ICL as superficial pattern matching should influence Module 4's ("Context Engineering") teaching. The finding that "Word Salad" prompts work nearly as well as coherent ones suggests that:
- Statistical structure > semantic clarity (sometimes)
- More examples ≠ better learning (especially in long-context models)
- Context design is an empirical, not intuitive, skill

### 4. **Agentic Reasoning and Tool Use**

While not directly about "how LLMs work," the rise of agentic systems (Claude as a planning agent, not a responder) represents a shift in how practitioners use LLMs. This interacts with context window management: agents maintain persistent context and iteratively refine plans, which is qualitatively different from single-shot generation.

### 5. **Synthetic Data and Post-Training Customization**

The 2025 finding that synthetic data is highly effective for post-training (especially in math and coding) suggests a future where organizations fine-tune LLMs on their own data. This is a significant shift from the current module's assumption that LLMs are monolithic, unchangeable products.

---

## Sources Consulted

- [Claude API Docs – Models Overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Claude API Docs – Release Notes](https://platform.claude.com/docs/en/release-notes/overview)
- [Anthropic Research – Interpretability Team](https://www.anthropic.com/research/team/interpretability)
- [Anthropic – Open Source Circuit Tracing](https://www.anthropic.com/research/open-source-circuit-tracing)
- [Circuits Updates – April 2025](https://transformer-circuits.pub/2025/april-update/index.html)
- [On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html)
- [The Utility of Interpretability — Emmanuel Amiesen, Anthropic](https://www.latent.space/p/circuit-tracing)
- [Best LLMs for Extended Context Windows in 2026](https://aimultiple.com/ai-context-window)
- [LLMs with largest context windows](https://codingscape.com/blog/llms-with-largest-context-windows)
- [How LLMs Handle Infinite Context With Finite Memory](https://towardsdatascience.com/llms-can-now-process-infinite-context-windows/)
- [Rethinking Thinking Tokens: LLMs as Improvement Operators](https://arxiv.org/abs/2510.01123)
- [Demystifying Reasoning Dynamics with Mutual Information](https://openreview.net/forum?id=E1FrjgaG1J)
- [Is LLM in-context learning real learning? A Microsoft study](https://bdtechtalks.com/2025/09/25/llm-in-context-learning-study-microsoft/)
- [Long-Context ICL Challenges](https://openreview.net/forum?id=Cw2xlg0e46)
- [Survey and analysis of hallucinations in large language models](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1622292/full)
- [A hallucination detection and mitigation framework](https://www.nature.com/articles/s41598-025-31075-1)
- [Mitigating Hallucination in Large Language Models (LLMs): An Application-Oriented Survey on RAG, Reasoning, and Agentic Systems](https://arxiv.org/html/2510.24476v1)
- [Inside Llama 4: How Meta's New Open-Source AI Crushes GPT-4o and Gemini](https://machine-learning-made-simple.medium.com/inside-llama-4-how-metas-new-open-source-ai-crushes-gpt-4o-and-gemini-e3265f914599)
- [Grouped Query Attention (GQA) vs. Multi Head Attention (MHA)](https://friendli.ai/blog/gqa-vs-mha)
- [Beyond Standard LLMs - by Sebastian Raschka, PhD](https://magazine.sebastianraschka.com/p/beyond-standard-llms)
- [A brief history of LLM Scaling Laws and what to expect in 2025](https://www.jonvet.com/blog/llm-scaling-in-2025)
- [How to build AI scaling laws for efficient LLM training](https://news.mit.edu/2025/how-build-ai-scaling-laws-efficient-llm-training-budget-maximization-0916)
- [The Breakthrough in LLM Reinforcement Learning Scaling Laws](https://medium.com/ai-simplified-in-plain-english/the-breakthrough-in-llm-reinforcement-learning-scaling-laws-12efb1bc613e)
- [Densing law of LLMs](https://www.nature.com/articles/s42256-025-01137-0)
- [The 2025 Guide to Retrieval-Augmented Generation (RAG)](https://www.edenai.co/post/the-2025-guide-to-retrieval-augmented-generation-rag)
- [RAG in 2026: Bridging Knowledge and Generative AI](https://squirro.com/squirro-blog/state-of-rag-genai)
- [The State of Retrieval-Augmented Generation (RAG) in 2025 and Beyond](https://www.ayadata.ai/the-state-of-retrieval-augmented-generation-rag-in-2025-and-beyond/)
- [Enhancing Retrieval-Augmented Generation: A Study of Best Practices](https://aclanthology.org/2025.coling-main.449/)
- [Circuit Tracing for the Rest of Us](https://subhadipmitra.com/blog/2026/circuit-tracing-production/)
- [Technical Report: The Decreasing Value of Chain of Thought in Prompting](https://gail.wharton.upenn.edu/research-and-insights/tech-report-chain-of-thought/)
- [Study could lead to LLMs that are better at complex reasoning](https://news.mit.edu/2025/study-could-lead-llms-better-complex-reasoning-0708)
- [LLMOrbit: A Circular Taxonomy of Large Language Models](https://arxiv.org/html/2601.14053v1)

---

## Key Takeaway for Module Maintainers

The field has moved faster than the module. The **theoretical foundations remain sound** — transformers, attention, autoregressive generation, and the insight about hallucinations are all correct. However, readers will encounter practitioners using techniques the module doesn't mention:

- Reasoning tokens and test-time compute allocation (o1, Gemini 2.0)
- Circuit tracing for inspecting model behavior
- RAG for working around knowledge cutoff
- Efficient attention variants enabling 1M–10M token windows
- In-context learning as brittle statistical matching, not deep learning

The module should be updated incrementally to incorporate these findings without abandoning its core narrative. The pedagogical goal — giving practitioners a working mental model of how LLMs work — is more important than exhaustive coverage of every new variant.
