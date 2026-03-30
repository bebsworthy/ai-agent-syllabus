---
title: "12: Fun with Adversarial Agents"
description: "Install a GAN-style adversarial code review skill and learn why pitting agents against each other produces better results than asking one agent to be thorough."
sidebar:
  label: "12: Adversarial Agents"
  order: 12
---

**30 minutes | You need: modules 1-6 completed, a file worth reviewing**

If you've ever watched HBO's Silicon Valley, you know Dinesh and Gilfoyle. Gilfoyle finds everything wrong with Dinesh's code. Dinesh defends it — sometimes poorly, sometimes brilliantly. The audience laughs, but the code actually gets better.

That dynamic is the foundation of a real multi-agent pattern: **adversarial review**. Two agents with opposing objectives debate until they converge. The friction between them surfaces issues that a single reviewer would miss — and filters out false positives that a single critic would overreport.

In this module you'll install a skill that implements this pattern, run it on your own code, and then dissect *why* it works.

## Install the /dg Skill

From your project root:

```bash
mkdir -p .claude/skills/dg
curl -sL https://raw.githubusercontent.com/v1r3n/dinesh-gilfoyle/main/dg/SKILL.md -o .claude/skills/dg/SKILL.md
curl -sL https://raw.githubusercontent.com/v1r3n/dinesh-gilfoyle/main/dg/gilfoyle-agent.md -o .claude/skills/dg/gilfoyle-agent.md
curl -sL https://raw.githubusercontent.com/v1r3n/dinesh-gilfoyle/main/dg/dinesh-agent.md -o .claude/skills/dg/dinesh-agent.md
```

Start a **new Claude Code session** (the skill loader runs at startup), then verify:

```text
/dg src/some-file.ts
```

You should see Gilfoyle attack the file, Dinesh defend it, and a structured verdict at the end.

## Do This

### 1. Run a review

Pick a file you wrote recently — something with real logic, not a config file:

```text
/dg path/to/your/file
```

Watch the debate unfold. Pay attention to:
- Which of Gilfoyle's findings does Dinesh concede? Those are your real issues.
- Which does Dinesh successfully defend? Those validate your code.
- Which does Dinesh dismiss as nitpicks? The synthesis will tell you if that dismissal held.

### 2. Read the agent prompts

Open the three files you just downloaded:

```text
@.claude/skills/dg/SKILL.md
@.claude/skills/dg/gilfoyle-agent.md
@.claude/skills/dg/dinesh-agent.md
```

Notice the structure:
- **SKILL.md** is the orchestrator — it gathers code, dispatches agents, detects convergence, and synthesizes the final review
- **gilfoyle-agent.md** defines the attacker's persona, technical domains, and output format
- **dinesh-agent.md** defines the defender's persona, response strategies, and honesty constraints

### 3. Trace the architecture

Ask Claude to explain the orchestration:

```text
How does the /dg skill orchestrate the debate between agents? Walk me through the flow.
```

## How It Works: Adversarial Agents as a GAN

The `/dg` skill implements a pattern borrowed from machine learning: **Generative Adversarial Networks (GANs)**. In a GAN, two neural networks compete — a generator creates content, a discriminator tries to reject it. Neither is useful alone. Together, they push each other toward quality.

The `/dg` skill maps this to code review:

| GAN Concept | /dg Implementation |
|---|---|
| Generator | Dinesh (the code author/defender) |
| Discriminator | Gilfoyle (the critic/attacker) |
| Training loop | Multi-round debate with convergence detection |
| Loss function | Structured findings with severity ratings |
| Convergence | Gilfoyle repeats findings or Dinesh concedes all points |

### Why two agents beat one

A single agent asked to "review this code thoroughly" faces a fundamental tension: it has to be both critic and advocate in the same context window. It hedges. It qualifies. It finds three issues and says "overall the code is solid."

Splitting the roles eliminates that tension:

**Gilfoyle (the attacker)** has one job: find everything wrong. His prompt tells him to be devastating, to scale contempt to the severity of the issue, and to never let Dinesh feel like he won. This asymmetric pressure means he doesn't stop at the obvious bugs — he digs into security, dependency vulnerabilities, distributed systems anti-patterns, and architectural rot.

**Dinesh (the defender)** has a different job: separate real issues from noise. His prompt requires him to classify each finding as `[concede]`, `[defend]`, or `[dismiss]` — and critically, to be *honest in findings even when the banter is defensive*. This constraint means his concessions are high-signal: if Dinesh can't mount a defense, the issue is real.

### The convergence loop

The orchestrator runs rounds until one of two things happens:

1. **Gilfoyle repeats himself** — he's found everything worth finding
2. **Dinesh concedes everything** — the code needs work

This is not a fixed number of passes. The debate self-terminates when it stops producing new information. That's the same principle behind GAN training: you stop when the discriminator can no longer distinguish real from generated — or in this case, when the critic can no longer find new issues the defender hasn't already addressed.

### The structured output trick

Both agents produce two sections: **BANTER** (the entertainment) and **FINDINGS** (the data). The banter keeps the review engaging and gives each agent a character voice that reinforces their adversarial role. The findings give the orchestrator machine-readable data to classify issues by severity and track concessions across rounds.

This dual output is a pattern you can reuse: let agents be expressive in one section (which helps them reason better — personas improve output quality) while producing structured data in another (which lets the system act on results programmatically).

### Why the personas matter technically

This isn't just comedy. Character personas serve three engineering purposes:

1. **Role commitment** — A prompt that says "find bugs" gets a generic review. A prompt that says "you are Gilfoyle, and bad code is a moral failing" gets an agent that refuses to let anything slide. The persona creates pressure to be thorough.

2. **Asymmetric objectives** — Gilfoyle is rewarded (in-character) for finding issues. Dinesh is rewarded for defending valid code. This creates genuine tension that surfaces edge cases neither role would find alone.

3. **Calibrated concessions** — Dinesh's character is "defensive but competent." He doesn't concede easily, which means when he does concede, it carries weight. A less defined character might concede everything to seem agreeable, destroying the signal.

## The Pattern Beyond Code Review

Adversarial agents work anywhere you need robust evaluation:

| Use Case | Attacker | Defender |
|---|---|---|
| Code review | Critic (finds bugs) | Author (defends decisions) |
| Proposal review | Skeptic (finds gaps) | Proposer (justifies choices) |
| Security audit | Red team (finds exploits) | Blue team (validates controls) |
| Documentation | Confused user (finds gaps) | Writer (defends clarity) |
| Architecture review | Pessimist (finds failure modes) | Architect (defends tradeoffs) |

The core recipe is always the same:
1. Define two agents with opposing objectives
2. Give each a structured output format
3. Loop until convergence
4. Synthesize the debate into a verdict

:::tip[Build your own]
You now have a working template. Fork the `/dg` skill and replace the personas — keep the BANTER/FINDINGS dual output, the convergence loop, and the synthesis step. The characters change; the architecture doesn't.
:::

## Artifact

A completed `/dg` review of your own code. Understanding of why adversarial multi-agent patterns produce better results than single-agent review.

## Go Deeper

[Module 11 — Everything Everywhere](/masterclass/bootcamp/b11-everything-everywhere/) for the full taxonomy of multi-agent orchestration patterns, including fan-out, consensus councils, and structured instruction design.
