# How Long Contexts Fail

**Source:** https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html

**Author:** Drew Breunig

## Main Thesis

Despite excitement around million-token context windows, larger contexts don't necessarily improve agent performance. Overloaded contexts create surprising failure modes that undermine agent reliability.

## Four Key Failure Modes

### Context Poisoning

When hallucinations or errors enter the context and get repeatedly referenced, they compound over time. The Gemini 2.5 Pokémon example showed agents pursuing impossible goals after their context became "poisoned with misinformation."

### Context Distraction

As context grows beyond certain thresholds (around 100k tokens for some models), LLMs tend to "favor repeating actions from vast history rather than synthesizing novel plans." Models regress to copying past behavior instead of applying training knowledge.

### Context Confusion

Excessive tool descriptions or irrelevant information force models to consider everything presented. Berkeley's Function-Calling Leaderboard demonstrates that models perform worse with multiple tools, and a Llama 3.1 8B model failed with 46 tools but succeeded with 19.

### Context Clash

When information gathered sequentially contradicts earlier statements, models "get lost and do not recover." A Microsoft/Salesforce study found 39% performance drops when prompts were distributed across multiple turns rather than presented whole.

## Why Agents Are Vulnerable

Agents suffer most because they inherently accumulate diverse context: document retrieval, tool outputs, subproblem results, and multi-turn histories—all potential conflict sources.
