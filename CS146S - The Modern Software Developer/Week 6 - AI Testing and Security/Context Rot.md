# Context Rot: How Increasing Input Tokens Impacts LLM Performance

**Source:** https://www.trychroma.com/research/context-rot

## Overview

This technical report from Chroma examines a critical finding: Large Language Models do not process context uniformly as input length increases. Despite performing well on standard benchmarks like Needle in a Haystack, models show significant performance degradation on more realistic tasks as context grows.

**Key Discovery:** Models do not use their context uniformly; instead, their performance grows increasingly unreliable as input length grows.

## Research Scope

The study evaluated 18 major LLMs including:
- Claude family (Opus 4, Sonnet 4, Haiku 3.5)
- OpenAI models (GPT-4.1, GPT-4o, o3)
- Google Gemini (2.5 Pro/Flash, 2.0 Flash)
- Alibaba Qwen (3 variants)

## Main Findings

### 1. Needle-Question Similarity
Performance degrades faster with lower semantic similarity between questions and answers. Models succeed at high-similarity pairs across all lengths but fail increasingly on ambiguous matching as context grows.

### 2. Distractor Impact
Even single distractors reduce performance compared to baselines. The impact amplifies with longer inputs. Notably, Claude models show lower hallucination rates when encountering distractors, while GPT models generate confident but incorrect responses.

### 3. Haystack Structure Effects
Counterintuitively, shuffled haystacks improved performance across all 18 models. Structured, coherent text paradoxically made tasks harder—suggesting attention mechanisms are affected by logical flow patterns in ways not yet fully understood.

### 4. LongMemEval Results
When tested on realistic conversational question-answering:
- Focused prompts (relevant context only) achieved significantly higher performance
- Adding irrelevant context forced simultaneous retrieval and reasoning, causing degradation
- Claude models exhibited conservative behavior, abstaining when uncertain

### 5. Repeated Words Task
Even trivial text replication tasks showed reliability issues as context length increased. Models generated random words, showed position accuracy favoring early occurrences, and sometimes refused tasks entirely.

## Implications

The research highlights that context engineering—careful construction of how information appears in prompts—matters as much as whether relevant information is present. Standard long-context benchmarks may underestimate real-world performance challenges.

## Research Availability

Complete methodology, datasets, and code are available on GitHub, enabling reproduction of findings across the tested models.
