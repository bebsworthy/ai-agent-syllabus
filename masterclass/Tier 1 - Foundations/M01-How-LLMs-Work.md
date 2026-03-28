# M01: How LLMs Actually Work (and Why It Matters for Your Prompts)

## Overview

Before you can use Claude Code effectively, you need to understand what's actually happening when Claude processes your request. Large Language Models aren't magic—they're sophisticated statistical pattern matchers trained on massive amounts of text. Understanding the mechanics—transformer architecture, attention, token-by-token generation, hallucinations, and context windows—explains both their extraordinary strengths (pattern recognition at scale, rapid implementation) and their real weaknesses (confabulation, no learning during inference, bounded memory). This mental model will inform every interaction you have with Claude Code. When Claude suggests a function name that doesn't exist, you'll know why. When it makes logical leaps that seem brilliant until you test them, you'll understand the mechanism. When its suggestions deteriorate halfway through a long context, you'll recognize the warning signs.

This module gets you hands-on: you'll install Claude Code, run your first interaction with a real codebase, learn the essential shortcuts, and ground the theory in practical experience.

---

## Pre-work: Theory (15–20 min)

### What You Need to Know

#### Transformer Architecture and Attention

Large Language Models are built on the transformer architecture, which processes text by creating multiple "attention heads"—parallel pathways that learn which parts of the input are relevant to predicting the next piece of output. Think of it as a sophisticated weighting system: when Claude reads your prompt, it doesn't store a perfect memory; instead, it learns patterns about which words, phrases, and concepts relate to each other.

The key insight: **attention is learned from training data**, not explicitly programmed. Claude doesn't "understand" the semantic meaning of your code the way a human does. It recognizes patterns (variable naming conventions, common library usages, indentation, structure) that it has seen millions of times in training.

#### Autoregressive Generation (Token-by-Token)

Claude generates text one token at a time. A token is roughly 4 characters, so a 1K word response is about 1,500 tokens. At each step, Claude predicts the most likely next token given everything that came before. This is why:

- **Hallucinations happen**: Claude's prediction at step N might lead to a path that doesn't actually exist (a function name, a library, a fact). But it's not "lying"—it's predicting based on patterns. In training data, a certain structure might have led to that function 10,000 times; the fact that it doesn't exist in your codebase is invisible to the model.
- **Longer generations are less reliable**: Each prediction compounds error. By token 500, the model has made 500 sequential predictions, and small deviations early on can send it down a wrong path.
- **"Thinking harder" helps**: When you ask Claude to think step-by-step or to be more deliberate, you're increasing the number of reasoning tokens before the final answer. More tokens to think with = more opportunity for the pattern matcher to find the right path.

#### Pretraining vs. Fine-tuning vs. Inference

- **Pretraining**: Claude was trained on publicly available text (code, docs, research papers, forums) up to a knowledge cutoff. This is where all learning happens.
- **Fine-tuning**: Anthropic has further trained Claude on high-quality examples to make it safer and more helpful. You cannot fine-tune Claude in Claude Code.
- **Inference**: When you run Claude Code, you're in the inference phase. Claude cannot learn from your feedback or your code. Every conversation starts fresh (though the context window lets you build up state within a session).

This is critical: **Claude does not improve from using it.** The 1.5 million times other developers have used Claude Code teach the model nothing about your codebase. Only the context you provide matters.

#### Why Hallucinations Happen

Hallucinations aren't bugs; they're the natural consequence of statistical pattern matching. If your codebase uses a pattern that appears in 10,000 training examples, but the specific library or function name appears in 50,000 examples with a slightly different structure, Claude might confidently suggest the more common pattern—even though it's wrong for your code.

The cure: **context and verification**. Provide your actual codebase as context (through CLAUDE.md, file references, or Agent tools). Ask Claude to verify against the real code before executing. Use `/effort high` when you need deeper reasoning.

#### Context Window Limitations

Claude 3.5 Sonnet has a 1 million token context window. Opus 4.6 also has 1M tokens. Haiku 4.5 has 128K tokens. This sounds huge, but:

- A modest codebase (50K lines of code) is ~200K tokens
- Your conversation history adds tokens
- Large file pastes accumulate quickly

The context window is not infinite, and **context quality matters more than context size**. A 500-token CLAUDE.md with the three most important conventions is better than pasting 200K tokens of boilerplate.

---

## Pre-work: Readings

### Essential Readings

1. **"Attention Is All You Need" (Vaswani et al.)**
   - The foundational transformer paper. You don't need to read it in full, but skim the architecture diagram and the explanation of attention. 10 minutes.
   - Link: https://arxiv.org/abs/1706.03762

2. **OpenAI's "How GPT Models Work"**
   - Accessible explanation of tokenization, attention, and autoregressive generation.
   - Link: https://openai.com/research/language-models-are-unsupervised-multitask-learners

3. **Anthropic's "Constitutional AI" Overview**
   - Why Claude is helpful, harmless, and honest by design (and what that means for your prompts).
   - Link: https://www.anthropic.com/research/constitutional-ai-harmless-helpful-honest

4. **"Prompt Engineering Overview" by OpenAI**
   - Practical context on zero-shot vs. few-shot prompting, which we'll dive deeper into in M02.
   - Link: https://platform.openai.com/docs/guides/prompt-engineering

5. **Claude Code Official Documentation**
   - Focus on "System Requirements," "Installation," and "Quick Start."
   - Link: https://claude.com/claude-code (or your internal installation docs)

---

## Workshop: Facilitated Hands-on (45–60 min)

### Segment 1: Install Claude Code (10 min)

**Facilitate these steps**:

1. **System Requirements Check**
   - macOS 11+, Windows 10+, or Ubuntu 20.04+
   - 4GB RAM minimum (8GB recommended for large codebases)
   - Terminal/command prompt access

2. **Installation**
   - Mac: `brew install claude-code` (or direct download)
   - Windows: Download from Claude website, run installer
   - Linux: `curl -sSL install.claude.ai/linux | bash`

3. **First Launch**
   - Open Claude Code
   - Authenticate (Claude account required)
   - Verify installation by running `claude --version`

**Time check**: Installation should take 5–10 minutes. While tools are installing, discuss the mental model: "You're about to run a pattern-matching system that has never seen your codebase before. It will make confident-sounding suggestions that sometimes won't exist. Understanding why means you'll know exactly when to trust it and when to verify."

---

### Segment 2: First Interaction with a Real Codebase (15 min)

**Find a volunteer's project** (ideally a real, moderately-sized codebase; 1K–10K lines is ideal).

**Facilitation**:

1. **Open the project in Claude Code**
   ```
   claude /init
   ```
   This initializes a CLAUDE.md in the project root.

2. **First Question**: "Explain the overall architecture of this project in 2–3 sentences."
   - Watch Claude's output
   - Discuss: Did it get the architecture right? What clues did it use?

3. **Second Question**: "Find the main entry point and show me the first 50 lines."
   - Claude may hallucinate a file that doesn't exist, or find the right one
   - If it hallucinates: "This is the pattern matching at work. Claude predicted based on naming conventions, but got it wrong. Let's help it with context."

4. **Add Context**
   - Edit the CLAUDE.md to specify: "Main entry point is `src/main.ts`. Architecture: Express backend + React frontend. Key folders: `/backend`, `/frontend`, `/tests`."
   - Ask Claude the same question again
   - Observe: Does it now give a more accurate answer?

**Key learning**: Claude's accuracy depends entirely on context. Garbage in = garbage out. Good context = reliable responses.

---

### Segment 3: Essential Shortcuts and Commands (10 min)

**Teach these keyboard shortcuts and commands**:

| Shortcut | Function |
|----------|----------|
| `Esc` | Close the current panel (Claude's response area) |
| `Esc` `Esc` (double-press) | Clear history and start a fresh conversation thread |
| `Shift+Tab` | Toggle Plan Mode (shows Claude's plan before execution) |
| `Ctrl+B` (or `Cmd+B` on Mac) | Open file browser / sidebar |
| `/command` | Special Claude Code commands (e.g., `/init`, `/plan`, `/clear`) |
| `Ctrl+L` (or `Cmd+L`) | Focus the input field |

**Commands** to mention:

- `/init`: Initialize CLAUDE.md in the current project
- `/plan`: Enter Plan Mode explicitly (same as Shift+Tab)
- `/effort low|medium|high|max`: Adjust reasoning effort
- `/model sonnet|opus|haiku`: Switch models
- `/clear`: Clear conversation history
- `/context`: Show token usage and context breakdown

---

### Segment 4: Hands-on Exercise (20 min)

**Exercise**: "Ask Claude to find and explain a specific function, then make a small change"

Steps:

1. Pick a moderately-complex function in the codebase (ideally 20–40 lines, has dependencies).
2. Ask Claude: "Show me the `[function_name]` function and explain what it does, line by line."
   - Claude will find the function
   - Observe: Does it explain it correctly? Does it understand the dependencies?

3. Follow-up: "This function has a bug: [describe a realistic bug or limitation]. Write a fix."
   - Claude will propose a change
   - **Don't execute yet**. Review the proposal. Is it correct? Does it understand the context?

4. If the proposal looks good, execute it in a non-critical branch:
   ```
   git checkout -b claude-test-fix
   # Let Claude apply the change
   git diff  # Review
   ```

5. **Debrief**: "Claude found a real bug in real code. That's only possible because: (a) we provided context, (b) Claude understood the patterns in your codebase, (c) we reviewed before executing. This is the workflow."

---

## Hands-on Exercise: Step-by-Step

### Exercise: "Understand a Complex Function and Propose Improvement"

**Objective**: Ground the theory (hallucinations, context, pattern matching) in a real, tangible scenario.

**Setup** (5 min):

1. Participant opens their project in Claude Code
2. Identify a function that: is real, is moderately complex (30–80 lines), and has a potential improvement (missing error handling, inefficiency, unclear naming)
3. Add the file path and function name to CLAUDE.md under a `## Key Functions` section
4. Run `/init` to refresh context

**Steps** (15 min):

1. **Hallucination Test**
   - Ask Claude: "List all the parameters of `[function_name]` and what each one does."
   - Expected: Claude either gets it right (good context) or hallucinates (bad context)
   - If it hallucinates: "That's pattern matching. The parameter names led Claude to predict incorrectly. Let's add more context."
   - Add to CLAUDE.md: Copy the actual function signature

2. **Deep Dive**
   - Ask: "Explain the logic of `[function_name]`. What would happen if [edge case] occurred?"
   - Watch Claude's answer. Does it understand the control flow?
   - If it gets stuck: Use `/effort high` to make Claude think harder

3. **Improvement Proposal**
   - Ask: "This function would be more robust if it [your improvement idea]. Show me what that would look like."
   - Claude proposes a change
   - Review: Is it correct? Does it break anything? Does it depend on assumptions?

4. **Verification**
   - Don't execute. Instead, ask: "Show me all the callers of `[function_name]`. Would this change break any of them?"
   - Claude searches the codebase (using Agent tools if available)
   - Outcome: Claude's answer reveals whether it truly understands the impact of the change

**Debrief** (5 min):

- "Claude's accuracy here depended on three things: (1) explicit context in CLAUDE.md, (2) enough tokens to reason through the logic, (3) access to the codebase via Agent tools. If any of these were missing, hallucinations would increase."
- "This is why the mental model matters. Claude isn't 'thinking'—it's pattern-matching. The more patterns it can see (more context), and the more carefully you ask it to reason (higher effort), the better the result."

---

## Takeaway

By the end of this module, you will have:

1. **Claude Code installed and working** on a real project
2. **A practical mental model** of how LLMs work:
   - Pattern matching trained on vast datasets
   - Autoregressive (token-by-token) generation
   - Hallucinations as a natural consequence of statistical prediction
   - Context and verification as the antidotes
3. **Muscle memory** for essential shortcuts: Esc, Shift+Tab, `/effort`, `/clear`
4. **Understanding of when Claude is reliable and when to double-check**:
   - Reliable: Explaining existing code, finding existing functions, suggesting improvements when context is good
   - Unreliable without verification: Inventing function names, making guarantees about untested paths, working in very large codebases without focused context
5. **A habit**: Always review Claude's output before executing. Always ask Claude to verify against the actual code.

---

## Key Concepts

- **Transformer Architecture**: The neural network design that powers Claude. Uses "attention heads" to learn relationships between tokens.
- **Attention Mechanism**: How the model learns which parts of the input are relevant to predicting the next output.
- **Token**: ~4 characters of text. A 1K-word response is ~1,500 tokens.
- **Autoregressive Generation**: Predicting one token at a time, left-to-right. Each prediction depends on all previous tokens.
- **Hallucination**: A confident-sounding but factually incorrect output. Happens because Claude is predicting the most likely next token, not consulting a knowledge base.
- **Context Window**: The maximum amount of text Claude can "see" in a single conversation. Claude Sonnet/Opus: 1M tokens. Haiku: 128K tokens.
- **Pretraining**: The large-scale learning process before Claude Code release. Claude cannot learn from your use; only the training data matters.
- **Inference**: The phase you're in when using Claude Code. Claude processes your input and generates output, but does not update its weights.

---

## References

- Vaswani, A., et al. (2017). "Attention Is All You Need." _Advances in Neural Information Processing Systems._
  - https://arxiv.org/abs/1706.03762

- OpenAI. "Language Models are Unsupervised Multitask Learners."
  - https://openai.com/research/language-models-are-unsupervised-multitask-learners

- Anthropic. "Constitutional AI: Harmlessness from AI Feedback."
  - https://www.anthropic.com/research/constitutional-ai-harmless-helpful-honest

- OpenAI. "Prompt Engineering Guide."
  - https://platform.openai.com/docs/guides/prompt-engineering

- Claude Code Official Documentation.
  - https://claude.com/claude-code (or internal documentation)

- Andrej Karpathy. "A Recipe for Training Neural Networks."
  - https://karpathy.github.io/2019/04/25/recipe/ (optional, deep dive)

---

## Next Steps

Once you've completed M01, you're ready for M02: Prompt Engineering. You now understand the mechanics; next, you'll learn the techniques that turn those mechanics into reliable productivity.
