---
title: "M01: How LLMs Actually Work (and Why It Matters for Your Prompts)"
description: "Transformer architecture, autoregression, hallucinations, and context windows — the mental model behind effective Claude Code use."
---

# M01: How LLMs Actually Work (and Why It Matters for Your Prompts)

**Tier 1 — Foundations | Audience: Everyone**

---

## Why This Module Matters

Before you can use Claude Code effectively, you need a working mental model of what's actually happening when Claude processes your request. Large Language Models aren't magic — they're sophisticated statistical pattern matchers trained on massive amounts of text. Understanding the mechanics explains both their extraordinary strengths (pattern recognition at scale, rapid implementation, codebase navigation) and their real weaknesses (hallucinations, no learning during inference, bounded memory).

This mental model will inform every interaction you have with Claude Code:

- When Claude suggests a function name that doesn't exist, you'll know why.
- When its suggestions deteriorate halfway through a long session, you'll recognise the warning sign.
- When you're deciding whether to trust an output, you'll know what questions to ask.

**Read this before the workshop.** The session builds on these concepts hands-on.

---

## Theory

### Transformer Architecture and Attention

Large Language Models are built on the transformer architecture. At its core, the transformer processes text by creating multiple "attention heads" — parallel pathways that learn which parts of the input are relevant to each other. When Claude reads your prompt, it doesn't store it as a perfect memory. Instead, it builds a rich web of relationships between tokens, learned from seeing billions of examples during training.

The critical insight: **attention is learned from training data, not programmed**. Claude doesn't "understand" your code the way a human does. It recognises patterns — variable naming conventions, common library usages, architectural structures — that it has seen millions of times. When those patterns match your code, Claude looks brilliant. When they don't, it confabulates confidently.

### Autoregressive Generation — One Token at a Time

Claude generates text one token at a time. A token is roughly 4 characters, so a 1,000-word response is about 1,500 tokens. At each step, the model predicts the most likely next token given everything that came before.

This mechanism has three important consequences:

**Hallucinations are structural, not bugs.** Claude's prediction at step N might follow a path that doesn't exist in your codebase — a function name, a library version, a file path. Claude isn't lying. In its training data, a certain code pattern might lead to that function name 50,000 times. The fact that it doesn't exist in your project is invisible to the model. Context is the cure: the more of your actual codebase Claude can see, the less it has to rely on generic patterns.

**Longer generations compound error.** By token 500, the model has made 500 sequential predictions. Small deviations early can send it down a wrong path. This is why working incrementally — asking for small, verifiable steps — consistently outperforms asking for large one-shot implementations.

**"Thinking harder" actually works.** When you ask Claude to reason step-by-step, or use `/effort high`, you're allocating more reasoning tokens before the final output. More reasoning tokens = more opportunity for the pattern matcher to find the right path before committing.

### Pretraining, Fine-tuning, and Inference

Understanding these three phases clarifies what Claude can and cannot do:

**Pretraining** is where all learning happens. Claude was trained on a large corpus of publicly available text — code, documentation, research papers, forums — up to a knowledge cutoff. The model learned the statistical structure of language and code during this phase.

**Fine-tuning** is Anthropic's refinement layer — additional training on curated examples to make Claude safer, more helpful, and better at following instructions.

**Inference** is where you are when you use Claude Code. During inference, Claude's weights are frozen. It processes your input and generates output, but **it does not learn from your prompts, your corrections, or your codebase**. Every new conversation starts fresh. The context window is the only memory Claude has.

This is the single most important thing to internalise: **Claude does not improve from using it.** The thousands of other developers who have used Claude Code today taught the model nothing about your project. Only the context you explicitly provide matters.

### Why Hallucinations Happen (and What to Do About It)

Hallucinations aren't a flaw to be patched — they're the natural consequence of statistical prediction. If your codebase uses a pattern that resembles something common in training data, Claude will predict the training-data version, not your version.

The practical response is two-fold:

1. **Provide context proactively.** CLAUDE.md, file references, and explicit instruction about your project's structure give Claude real patterns to match against instead of generic ones.
2. **Verify before executing.** Never blindly apply Claude's output. Ask it to show you its reasoning, check callers, or read the actual file before making changes.

### Context Window Limitations

Sonnet 4.6 and Opus 4.6 both support a 1 million token context window. Haiku 4.5 supports 128K tokens. These numbers sound enormous, but:

- A modest codebase of 50K lines is roughly 200K tokens
- Conversation history accumulates across a session
- Large file pastes and tool outputs consume context quickly

More importantly, **context quality matters more than context size.** A focused 500-token CLAUDE.md describing the three most important conventions in your project is more useful than pasting 200K tokens of boilerplate that Claude has to sift through. This is why context engineering — deciding what to include, what to exclude, and how to structure it — becomes a core skill from Module 4 onwards.

---

## Pre-work Readings

Complete these before the workshop session. Total reading time: ~20 minutes.

**Essential**

1. [Prompt Engineering Overview](https://platform.openai.com/docs/guides/prompt-engineering) — OpenAI. Practical grounding on prompting principles; relevant context for M02. (~10 min)

2. [Claude Code Documentation — Quick Start](https://claude.com/claude-code) — Focus on system requirements and the installation flow. (~5 min)

3. [How OpenAI Uses Codex](../../../CS146S%20-%20The%20Modern%20Software%20Developer/Week%201%20-%20LLM/how-openai-uses-codex.pdf) — Real-world usage patterns from a team that deployed Codex at scale. (~5 min)

**Optional Deep Dives**

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — The original transformer paper. Skim the architecture diagram and abstract only.
- [A Recipe for Training Neural Networks](https://karpathy.github.io/2019/04/25/recipe/) — Andrej Karpathy on how neural networks fail. Illuminates why debugging LLM behaviour requires a different mindset than debugging deterministic code.

---

## Key Concepts

**Transformer Architecture** — The neural network design underlying modern LLMs. Uses attention to learn relationships between tokens in parallel, making it far more effective than earlier sequential approaches (RNNs, LSTMs).

**Attention Mechanism** — How the transformer learns which parts of the input are relevant to predicting each output token. Multiple attention heads specialise in different relationship types.

**Token** — The basic unit of text a language model processes. Approximately 4 characters in English. A 1,000-word prompt is roughly 750 tokens.

**Autoregressive Generation** — Generating text one token at a time, where each new token is conditioned on all previous tokens. This is how Claude produces responses.

**Hallucination** — A statistically plausible but factually incorrect output. Caused by pattern matching against training data when insufficient real context is available. Not a bug — a structural property of the approach.

**Context Window** — The maximum amount of text (prompt + history + tool outputs) Claude can process in a single session. Sonnet/Opus: 1M tokens. Haiku: 128K tokens.

**Pretraining** — The large-scale training process on internet-scale text corpora. Where all of Claude's knowledge is acquired. Completed before release; you cannot influence it.

**Inference** — The phase you are in when using Claude Code. Weights are frozen; Claude generates responses but does not learn. All session memory lives in the context window.

**Fine-tuning** — Post-pretraining training on curated examples to shape behaviour (safety, helpfulness, instruction-following). Done by Anthropic. Not available to users in Claude Code.

---

## Takeaway

After completing the pre-work and the workshop session, you will have:

1. **Claude Code installed and running** on a real project
2. **A durable mental model** of how LLMs work — pattern matching, token-by-token generation, the role of context — that will inform every future interaction
3. **An understanding of when to trust Claude and when to verify** — the categories where it's reliable, and the failure modes to watch for
4. **Muscle memory** for the essential shortcuts and commands
5. **The habit** of reviewing Claude's output before executing and asking it to verify against real code

---

## References

- Vaswani, A., et al. (2017). *Attention Is All You Need.* NeurIPS. https://arxiv.org/abs/1706.03762
- OpenAI. *Language Models are Unsupervised Multitask Learners.* https://openai.com/research/language-models-are-unsupervised-multitask-learners
- Anthropic. *Constitutional AI: Harmlessness from AI Feedback.* https://www.anthropic.com/research/constitutional-ai-harmless-helpful-honest
- OpenAI. *Prompt Engineering Guide.* https://platform.openai.com/docs/guides/prompt-engineering
- Karpathy, A. (2019). *A Recipe for Training Neural Networks.* https://karpathy.github.io/2019/04/25/recipe/
- Claude Code Documentation. https://claude.com/claude-code

---

*Next: [M02 — Prompt Engineering: From Vague Requests to Precise Instructions](M02-Prompt-Engineering.md)*
