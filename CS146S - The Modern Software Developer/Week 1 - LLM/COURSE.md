# Week 1: Introduction to Coding LLMs and AI Development — Course Notes

## Overview

This week introduces you to the transformative technology that will underpin all future work in this course: Large Language Models (LLMs) and how to effectively interact with them through prompting. Large Language Models represent a fundamental shift in how software developers approach their work. Rather than writing every line of code from scratch, modern developers collaborate with AI systems that can understand context, generate solutions, and accelerate nearly every phase of development—from initial design to debugging, testing, and optimization.

The theoretical foundation we build this week is crucial: you'll learn what LLMs actually are at an architectural level, how they're trained, and how they generate responses. More importantly, you'll discover that LLM output quality isn't random—it's directly shaped by the prompts you provide. Prompt engineering is thus not a peripheral skill; it's central to becoming effective with AI-augmented development. By week's end, you should understand both the capabilities and limitations of these tools, and possess practical techniques to get high-quality results from them.

---

## Key Concepts & Learnings

### What Are Large Language Models?

Large Language Models are sophisticated neural networks trained on vast amounts of text data from the internet, books, code repositories, and other sources. They are "large" because they contain hundreds of billions or trillions of parameters—mathematical weights that the model has learned during training. These parameters enable the model to recognize patterns, understand relationships between concepts, and generate coherent text that continues from a given prompt.

At their core, LLMs are statistical prediction machines. Given a sequence of tokens (small units of text, typically a few characters or a word), the model predicts what token should come next based on patterns it learned during training. This prediction happens sequentially: generate token 1, then use tokens 1-2 to predict token 3, and so on. This process, called autoregressive generation, is why LLMs can generate lengthy responses—they build up text one prediction at a time.

The fundamental mechanism behind modern LLMs is the transformer architecture, which uses something called attention. Attention allows the model to recognize which parts of the input are most relevant when making each prediction. For instance, when asked "What is the capital of France?", the attention mechanism focuses on the word "France" rather than treating all words equally. This is why transformers are so much more effective than earlier approaches like recurrent neural networks.

One critical insight: LLMs don't truly "understand" in the human sense. They're performing sophisticated pattern matching based on statistical associations in their training data. This is why they can sometimes seem brilliant and sometimes produce plausible-sounding but incorrect answers. They have no persistent memory, no ability to verify facts against a database, and no awareness of whether their output is true.

### Training, Fine-tuning, and Inference

The journey of an LLM from concept to usable tool involves three main phases. First comes **pretraining**, where the model learns from enormous text corpora. This phase is computationally expensive and happens only once. During pretraining, the model learns general language patterns, factual knowledge, and reasoning patterns. The model is trained with a simple objective: predict the next token given all previous tokens.

After pretraining, models are often subjected to **fine-tuning**, where they're trained on smaller, curated datasets designed to improve specific capabilities. Fine-tuning can steer a model toward particular behaviors, reduce harmful outputs, or specialize it for particular domains. Fine-tuning requires far less compute than pretraining and can be done by smaller teams. This is why we see so many specialized models: a base model is fine-tuned for instruction-following, safety, coding, conversational ability, or domain-specific tasks.

The final phase is **inference**, where the trained model generates responses to user prompts. During inference, the model isn't learning anything new—the parameters are fixed. What varies is the input prompt and any configuration parameters like temperature (which controls randomness) or max tokens (which limits response length). Understanding that inference doesn't involve learning helps explain why identical prompts don't always produce identical outputs—randomness is built into the generation process.

Codex, OpenAI's code-specialized model mentioned throughout course materials, represents a fine-tuning of GPT-3 on large code repositories. Rather than being trained from scratch, Codex inherited the general language understanding of GPT-3 and then specialized for code through fine-tuning. This approach is more efficient than starting from zero and produces models that can handle both natural language instructions and code generation tasks.

### Prompt Engineering: The Art of Asking the Right Questions

Prompt engineering is the practice of designing inputs to LLMs to elicit high-quality, relevant, and useful outputs. It's an art because there's no single formula—what works depends on the model, the task, and the specific context. However, research has uncovered systematic patterns and techniques that reliably improve results.

**Zero-shot prompting** is the simplest form: you ask the model to perform a task without providing examples. For instance: "Translate this Python function to JavaScript." Zero-shot works well for straightforward tasks and for capabilities the model has internalized during training. The advantage is simplicity; the disadvantage is that the model must rely entirely on what it learned during pretraining, which might not align perfectly with your use case.

**Few-shot prompting** provides a small number of examples before asking the model to perform the same task on new inputs. For instance:

```
Example 1:
Input: [bad code with redundant DB calls]
Output: [optimized version with caching]

Example 2:
Input: [another unoptimized pattern]
Output: [optimized version]

Now optimize this code:
Input: [your code]
Output:
```

Few-shot prompting is remarkably powerful because it gives the model concrete examples of the pattern you want it to follow. The model learns the task from the examples rather than relying solely on its pretraining. This technique works even better when examples are similar to the task at hand.

**Chain-of-Thought prompting** involves asking the model to explain its reasoning step-by-step before providing a final answer. Instead of asking "What's the best way to fix this bug?", you ask "Let's think through this step by step. First, what is the bug's symptom? Then, where in the code could this originate? What assumptions might be wrong?" Explicitly requesting step-by-step reasoning improves performance on complex reasoning tasks because it forces the model to decompose problems, making it less likely to jump to incorrect conclusions.

**Meta prompting** means writing prompts that instruct the model on how to prompt itself or others. For example, you might ask Codex to first write an implementation plan in a comment, then ask it to implement based on that plan. This two-step approach often produces better results than jumping straight to code, because the planning phase constrains and grounds the subsequent implementation.

**Retrieval Augmented Generation (RAG)** addresses one of the most important limitations of LLMs: they don't have access to information beyond their training data cutoff and can't look things up. With RAG, you retrieve relevant documents or code snippets from a database before prompting the model. This provides crucial context. For example, when asking Codex to modify a codebase, you might first retrieve the relevant module definitions and pass them as context, so Codex understands the actual interfaces and patterns used in your specific code.

**Self-consistency** involves generating multiple responses to the same prompt and using some mechanism (majority voting, aggregation, or manual selection) to pick the best one. Because LLM generation is partially random, running the same prompt multiple times often yields different (and sometimes better) results. This technique trades compute for reliability.

The effectiveness of all these techniques depends on one fundamental principle: **structure and context**. Models respond better when prompts mirror how you'd describe the change in a GitHub issue—with file paths, component names, specific diffs, and clear intent. This isn't arbitrary; it reflects how the models were trained on code and documentation.

### Practical Applications of Code LLMs

Code-specialized LLMs like Codex have demonstrated remarkable effectiveness across multiple dimensions of software development. These aren't hypothetical applications—they come from real usage at OpenAI, where teams across areas including Applied AI Engineering, Research, Platform, Security, and others have deployed Codex in production workflows. *(Source: "How OpenAI Uses Codex")*

**Code Understanding and Navigation** is perhaps the most directly useful application. *(Source: "How OpenAI Uses Codex")* When engineers onboard to unfamiliar codebases, debug complex systems, or investigate incidents, they often need to understand which modules interact, where specific logic lives, and how data flows through the system. Codex can rapidly surface this information by analyzing code and answering questions like "Where is the authentication logic implemented?" or "How do requests flow from the API endpoint to the database?" This accelerates onboarding and incident response significantly.

**Refactoring and Large-Scale Migrations** present an acute problem: changing code patterns across dozens or hundreds of files consistently while respecting each file's unique context. LLMs handle this well because they can understand the change pattern and apply it with awareness of local code style and structure. A manual find-and-replace fails; an LLM succeeds because it reasons about the structural changes needed, not just text substitution.

**Accelerating Development Velocity** is achieved through several mechanisms. During feature development, engineers can use Codex to scaffold boilerplate—generating folder structures, API stubs, and basic implementations quickly. Later, as deadlines approach, Codex handles the tedious work: filling in missing test cases, implementing error handling, generating documentation, and fixing small bugs. This allows humans to focus on the hard architectural and algorithmic problems where human judgment matters most.

**Test Generation and Coverage Improvement** is valuable because engineers often deprioritize test writing. Codex can generate unit tests based on function signatures, covering edge cases like boundary conditions, null inputs, and error states that manual test writing might miss. This is particularly effective for test expansion—given an existing test, Codex can generate variations that test different paths.

**Staying Productive During Interruptions** is an underrated benefit. *(Source: "How OpenAI Uses Codex")* Developers frequently context-switch due to meetings, calls, or urgent issues. Codex can help capture unfinished work, turn rough notes into working code, and summarize files so engineers can resume work the next day without losing context. This maintains velocity despite fragmented schedules.

**Exploration and Design Validation** uses LLMs for open-ended work. *(Source: "How OpenAI Uses Codex")* Given a feature spec or user feedback, engineers can ask Codex to explore alternative solutions, pressure-test assumptions, or identify similar patterns elsewhere in the codebase. This surfaces design tradeoffs and catches potential bugs before implementation begins.

### The Limitations and Failure Modes of LLMs

Understanding what LLMs can't do is as important as knowing what they can. These tools are powerful but not magic.

LLMs have a **context window limitation**—they can only "see" a certain amount of text (typically 2,000 to 100,000 tokens depending on the model). They can't be asked to analyze an entire large codebase or remember information from earlier in a very long conversation. This is why RAG (retrieving relevant code snippets) is important—you must feed the model the specific context it needs.

LLMs **hallucinate** with confidence. They can generate plausible-sounding but false information, from incorrect API documentation to non-existent library functions. This is especially dangerous in coding contexts where a hallucinated function name looks correct but causes runtime errors. Always verify LLM-generated code; don't blindly trust it.

LLMs **don't learn from interaction** within a single session. If you correct an LLM's mistake midway through a conversation, it understands the correction in that moment, but it doesn't update its underlying model. In a long session, it may repeat similar mistakes because it's not actually learning.

LLMs **struggle with very long-horizon tasks**. They work well for tasks that would take a human hours to complete, but they struggle with multi-day projects requiring sustained reasoning and state management. This is why the best workflows use LLMs to accelerate clearly-scoped subtasks, not to replace planning and high-level architecture decisions.

### Best Practices for Effective LLM Usage

The OpenAI Codex documentation and research have identified patterns that reliably improve results. *(Source: "How OpenAI Uses Codex")* These aren't magical incantations; they work because they align with how these models were trained.

**Start with Ask Mode for large changes.** When making significant changes, first ask the model to write an implementation plan in comments. Then, in a follow-up prompt, ask it to implement based on that plan. This two-step process, called "Ask Mode" then "Code Mode," keeps Codex grounded and helps avoid scope creep in the generated output. The model works best with well-scoped tasks—roughly an hour of human work or a few hundred lines of code.

**Structure your prompts like GitHub issues.** Include file paths, component names, before/after diffs, and clear intent. For example: "In `/src/auth.js`, the `validateToken()` function doesn't check expiration. Add expiration validation using the `isExpired()` helper from `/utils/time.js`. Here's the current implementation: [code]. Here's what it should do: [spec]." This specificity dramatically improves output quality.

**Iteratively improve the model's environment.** Set up startup scripts, environment variables, and dependencies so the model runs code successfully from the start. Each successful execution reduces error rates in future tasks. This is tedious setup work, but it has outsized returns.

**Use an AGENTS.md file for persistent context.** Maintain a file documenting naming conventions, business logic, known quirks, and dependencies that the model can't infer from code alone. This prevents the model from generating code that violates your conventions or duplicates logic it doesn't know about.

**Leverage "Best of N" generation.** Generate multiple responses and pick the best one, or combine the best parts of several responses. Because generation is stochastic, this is often faster than iterating on a single response.

**Use the Codex task queue as a lightweight backlog.** Fire off tasks for refactoring, edge cases, or small bugs without pressure to create perfect PRs immediately. Codex can stage these for later human review, maintaining velocity while you focus on higher-priority work.

---

## Lecture Topics

### Monday: Introduction to LLMs and How They're Made

The Monday lecture establishes the theoretical foundation for the entire course. It covers:

- The transformer architecture and attention mechanism—what makes modern LLMs work
- The three phases of LLM development: pretraining on massive text corpora, fine-tuning on curated data, and inference where the model generates responses
- How models like GPT-3 and Codex are built and trained
- The relationship between training data and model capabilities
- Key parameters and configuration options that affect model behavior

The lecture emphasizes that LLMs aren't magic—they're statistical models learning patterns from data. Understanding their mechanics helps set realistic expectations and explains both their strengths (pattern recognition at scale) and weaknesses (hallucinations, limited reasoning, no true understanding).

### Friday: Power Prompting for LLMs

The Friday lecture shifts from theory to practice, diving into how to extract maximum value from LLMs through thoughtful prompting. Key topics include:

- Prompt engineering techniques: zero-shot, few-shot, chain-of-thought, and meta prompting
- How to structure prompts for code generation tasks specifically
- Common failure modes and how to debug prompts
- Strategies for handling hallucinations and verification
- Real-world workflows: using LLMs as a collaborative partner, not a replacement for judgment
- Case studies from production usage at companies deploying these tools

The Friday lecture uses concrete examples throughout, showing side-by-side comparisons of poor prompts and excellent prompts, and their respective outputs. The emphasis is practical: by the end of this session, you should be able to write prompts that reliably produce useful code.

---

## Practical Takeaways

1. **LLMs are pattern-matchers, not reasoners or truth-seekers.** They excel at generating plausible continuations of text patterns. Don't expect them to verify facts, remember context, or update their knowledge. Always verify their output, especially for code.

2. **Prompt quality directly determines output quality.** Vague prompts produce mediocre outputs. Specific, well-structured prompts with concrete examples produce excellent outputs. Treat prompting as a skill to develop, not an afterthought.

3. **Provide context and examples.** Few-shot prompting with 2-3 relevant examples significantly outperforms zero-shot. When asking for code changes, include the current code, the desired behavior, and examples of similar patterns in your codebase.

4. **Use LLMs for well-scoped tasks.** They work best on tasks lasting a few hours or producing a few hundred lines of code. For larger projects, break them into smaller, well-defined subtasks and prompt for each piece.

5. **Iteratively improve your development environment.** The better your codebase is set up (dependencies clear, naming conventions consistent, examples available), the better Codex performs. This investment pays dividends across many tasks.

6. **Combine multiple techniques for complex tasks.** Use chain-of-thought for planning, then code generation for implementation. Use RAG to provide specific context. Generate multiple responses and pick the best. No single technique is universal.

7. **Treat LLMs as collaborators, not replacements.** They accelerate your work on routine and tedious tasks, but you remain responsible for architecture, verification, and high-level decisions. Review generated code carefully; understand what it does before committing it.

8. **Think in terms of task queues, not immediate perfection.** Fire off Codex tasks for small refactorings, edge cases, or bug fixes without waiting for them to be perfect before starting the next task. Use Codex as a lightweight backlog, knowing human review will refine the output.

---

## Key Terms & Definitions

**Attention Mechanism:** A component of transformer networks that allows the model to focus on relevant parts of the input when making predictions. Enables the model to understand which words or concepts are most important for generating the next token.

**Autoregressive Generation:** The process of generating text sequentially, one token at a time, where each new token is predicted based on all previous tokens. This is how LLMs work.

**Chain-of-Thought Prompting:** A prompting technique where you ask the model to explain its reasoning step-by-step before providing a final answer. Improves performance on complex reasoning tasks.

**Codex:** OpenAI's code-specialized LLM, fine-tuned from GPT-3 on code repositories. Designed for code understanding, generation, and completion tasks.

**Context Window:** The maximum amount of text (measured in tokens) that an LLM can "see" at once. Typical context windows are 2,000-100,000 tokens.

**Few-Shot Prompting:** Providing a small number of examples (typically 2-5) before asking the model to perform a similar task on new inputs. The model learns the pattern from examples rather than relying solely on pretraining.

**Fine-tuning:** The process of training a pretrained model on a smaller, curated dataset to improve specific capabilities or steer behavior. Requires far less compute than pretraining.

**Hallucination:** When an LLM generates plausible-sounding but false information, including non-existent functions, incorrect facts, or made-up citations.

**Inference:** The process where a trained LLM generates responses to user prompts. The model's parameters are fixed; only the input and configuration change.

**Meta Prompting:** Writing prompts that instruct the model on how to prompt itself or solve problems in stages. Example: asking the model to write a plan first, then implement it.

**Prompt Engineering:** The practice of designing prompts to elicit high-quality, relevant responses from LLMs. Involves technique selection, context provision, and iterative refinement.

**Retrieval Augmented Generation (RAG):** A technique where relevant documents or code snippets are retrieved from a database and provided to the model as context before prompting. Extends the model's knowledge beyond its training data.

**Transformer:** The neural network architecture underlying modern LLMs. Uses attention mechanisms to process text efficiently and understand long-range dependencies.

**Token:** A small unit of text, typically a few characters or a complete word. Models process and generate text at the token level. The relationship between tokens and text length varies; roughly 1 token per 4 characters in English.

**Zero-Shot Prompting:** Asking the model to perform a task without providing examples. The model relies entirely on patterns from its pretraining.

---

## References

| Resource | Type | Location |
|---|---|---|
| Introduction to Coding LLMs (Monday Lecture) | Slides (PPTX) | `Week1-Mon-Introduction-LLM.pptx` |
| Power Prompting for LLMs (Friday Lecture) | Slides (PPTX) | `Week1-Fri-Power-Prompting.pptx` |
| How OpenAI Uses Codex | PDF | `how-openai-uses-codex.pdf` |
| Prompt Engineering Guide | Article | `Prompt Engineering Guide.md` |
| Prompt Engineering Overview | Article | `Prompt Engineering Overview.md` |
| Deep Dive into LLMs | Video | https://www.youtube.com/watch?v=7xTGNNLPyMI |
| AI Prompt Engineering: A Deep Dive | Video | https://www.youtube.com/watch?v=T9aRN5JkmL8 |
| LLM Prompting Playground (Assignment) | Code Repository | https://github.com/mihail911/modern-software-dev-assignments/tree/master/week1 |

---

**Last Updated:** Week 1, CS146S: The Modern Software Developer Course
