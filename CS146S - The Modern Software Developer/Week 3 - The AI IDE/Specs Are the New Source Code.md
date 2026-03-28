# Specs Are the New Source Code

**Source:** https://blog.ravi-mehta.com/p/specs-are-the-new-source-code

## Main Thesis

Specifications are becoming the foundational artifact of product development in an AI-accelerated world. As engineering delivery speeds increase dramatically, the bottleneck shifts from implementation to clarity of requirements.

## Why PMs Become the Constraint

Andrew Ng observed that some organizations now propose having twice as many product managers as engineers. This reflects a fundamental shift: "as engineers deliver many times faster with AI, companies need more PMs to support those productive engineers, not fewer."

## Specs as Source Code

Sean Grove from OpenAI argues that well-written specifications function as the true source material. Developers currently "shred the source and then very carefully version control the binary" by discarding prompts after using them to generate code. In contrast, specifications capture complete intent and can generate multiple outputs—code, documentation, tutorials.

Grove contends that "the person who communicates most effectively is the most valuable programmer."

## The Workflow Transformation

The traditional approach required specs *before* building. The new model inverts this:

- **Old**: idea → wireframes → designs → MVP → feedback → revise → rebuild
- **New**: idea → rapid prototype → feedback → crystal-clear spec → AI implementation

Tools like v0 and Lovable enable prototype creation without engineering resources, allowing teams to validate assumptions before writing detailed specifications.

## Practical Implementation

Danny Martinez at Decimals demonstrated non-technical product managers can implement features using Claude via GitHub Copilot by:

1. Creating detailed Linear tickets
2. Prompting Claude to analyze code requirements
3. Implementing changes through AI assistance
4. Requesting engineer review

Success requires: precise specifications, selective use for simpler tasks, and engineer gatekeeping.
