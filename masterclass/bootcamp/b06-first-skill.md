---
title: "06: Build Your First Skill"
description: "Turn a task you repeat weekly into a reusable slash command the whole team can use."
sidebar:
  label: "06: First Skill"
  order: 6
---

**35 minutes | You need: a task you repeat at least weekly**

## Setup

Think of something you do repeatedly: scaffold a component, write a migration, review a PR, run a deploy checklist. You're going to turn it into a `/slash-command`.

## Do This

### 1. Create the skill

```bash
mkdir -p .claude/skills/[your-skill-name]
```

Create `.claude/skills/[your-skill-name]/SKILL.md`:

```yaml
---
name: your-skill-name
description: >
  [Write this like you'd naturally ask for the task.
  E.g., "Scaffold a new React component with tests and Storybook story.
  Use when user asks to create, scaffold, or add a component."]
---

# [What this skill does]

When running this skill:

1. [Step 1 — what Claude should do first]
2. [Step 2 — what comes next]
3. [Step 3 — etc.]

## Conventions
- [Key rules to follow from your CLAUDE.md]
- [File naming patterns]
- [Testing requirements]
```

### 2. Write a good description

The `description` field is the most important line — Claude uses it to decide whether to auto-invoke the skill.

```yaml
# Bad — too abstract
description: Audit software artefacts for quality compliance

# Good — matches natural requests
description: >
  Review code for bugs, security issues, and style violations.
  Use when user asks to "review", "check", or "audit" code.
```

### 3. Test it three ways

1. **Direct invocation:** Type `/your-skill-name` in Claude Code
2. **Discovery:** Ask *"What skills are available?"*
3. **Auto-invocation:** Give Claude a matching task without using the slash command — does it find the skill automatically?

### 4. Evolve if needed

**Pattern A** (what you just built): Pure markdown instructions. Good for most tasks.

**Pattern B**: Add a script for deterministic processing:
```yaml
---
name: validate-api
description: Validate API endpoint against OpenAPI spec
---

Run this validation script and report results:
```bash
npx @stoplight/spectral-cli lint openapi.yaml
```
```

**Pattern C**: Reference MCP tools or subagents for multi-service workflows.

Start with Pattern A. Evolve later only if you need deterministic processing or external tools.

### 5. Commit it

```bash
git add .claude/skills/
git commit -m "Add [skill-name] skill for team use"
```

Skills in `.claude/skills/` are available to anyone who clones the repo. Personal skills go in `~/.claude/skills/`.

:::note[Why this matters]{icon="bars"}
Skills follow progressive disclosure — Claude sees only the name and description (~100 tokens) until a skill is needed, then loads the full instructions. This keeps context lean. A team with 10 good skills eliminates hundreds of repeated prompt-writing sessions.
:::

## Artifact

A working custom skill committed to your project's `.claude/skills/` directory.

## Go Deeper

[Playbook M07 — Advanced Workflows](/tier-2/m07-advanced-workflows/) for the full workflow composition stack (skills, subagents, hooks, plugins, agent teams), the three skill patterns in depth, and writing effective subagents.
