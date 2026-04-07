---
title: "08: Skills & the Marketplace"
description: "Discover existing skills, understand skill anatomy, and build your own — with full awareness of context cost and security."
sidebar:
  label: "08: Skills & Marketplace"
  order: 8
---

**35 minutes | You need: a task you repeat at least weekly**

## How Skills Work

Skills are markdown instruction files that Claude loads on demand. When idle, Claude sees only the skill's name and description (~100 tokens). When invoked — either by slash command or auto-detection — Claude loads the full instructions. This progressive disclosure is what makes skills context-efficient: 10 skills cost ~1,000 tokens idle; 10 MCP servers can cost 10x that.

Skills are **instructions that Claude follows**. This is powerful but also a security surface. A malicious skill can instruct Claude to exfiltrate data, run destructive commands, or inject prompts into your session. **Only install skills from trusted sources, and always review a skill's SKILL.md before enabling it.**

## Do This

### 1. Discover before you build

Before writing anything, see what already exists:

```text
What skills are available?
```

Check if your project already has skills in `.claude/skills/`. Check if there are community plugins that do what you need:

```text
/skill-creator
```

The skill-creator can help you find, scaffold, and build skills. It knows the full skill API.

Browse plugin marketplaces if your organization has one configured. The best skill is one you don't have to write — but **always review third-party skills before installing them**. Read the SKILL.md. Understand what it tells Claude to do.

### 2. Anatomy of a skill

Every skill lives in a directory with a `SKILL.md` file:

```text
.claude/skills/my-skill/
  SKILL.md
  (optional scripts, templates, etc.)
```

The frontmatter controls everything:

```md
---
name: scaffold-component
description: >
  Scaffold a new React component with tests and Storybook story.
  Use when user asks to create, scaffold, or add a component.
allowed-tools:
  - Write
  - Bash(npm test*)
model: sonnet
effort: low
---

# Scaffold Component

When running this skill with $ARGUMENTS:

1. Create component file at src/components/$ARGUMENTS/$ARGUMENTS.tsx
2. Create test file at src/components/$ARGUMENTS/$ARGUMENTS.test.tsx
3. Create story file at src/components/$ARGUMENTS/$ARGUMENTS.stories.tsx
4. Follow patterns from existing components in src/components/
5. Run tests to verify

## Conventions
- Use our Button component as reference for structure
- CSS modules for styling (not styled-components)
- Export from src/components/index.ts barrel file
```

**Frontmatter fields explained:**

| Field | What it does | Why it matters |
|-------|-------------|----------------|
| `description` | Trigger matching for auto-invocation | **Most important line.** Write it like you'd naturally ask for the task. |
| `allowed-tools` | Skip permission prompts for listed tools | No more clicking "allow" for every file write |
| `model` | Override model (haiku, sonnet, opus) | Use haiku for simple scaffolding, opus for complex analysis |
| `effort` | Override reasoning effort | Low for templates, high for review skills |
| `context: fork` | Run in a subagent | **Critical for context management** — heavy skills don't bloat your main window |
| `$ARGUMENTS` | Placeholder for user input | `/scaffold-component Button` → $ARGUMENTS = "Button" |
| `${CLAUDE_SKILL_DIR}` | Path to the skill's own directory | Reference templates or scripts alongside the skill |

### 3. Dynamic context injection

The most powerful skill feature: inject live data into the instructions with `` !`command` ``:

````md
---
name: review-pr
description: Review the current PR for issues
context: fork
---

# PR Review

Current diff:
!`git diff main...HEAD`

Review this diff for:
1. Security issues (injection, auth bypass, data exposure)
2. Missing error handling
3. Performance regressions
4. Breaking changes to public APIs
````

The `` !`git diff main...HEAD` `` runs at invocation time and its output becomes part of the skill's instructions. This turns skills into dynamic, context-aware workflows.

### 4. Build your skill

Think of something you do weekly: scaffold a component, write a migration, run a deploy checklist, review a PR.

```text
/skill-creator Create a skill that [describe what you do weekly]
```

Or create it manually:

```bash
mkdir -p .claude/skills/[your-skill-name]
```

Write the SKILL.md with the frontmatter fields above. Start simple (Pattern A — pure markdown). You can always add complexity later.

### 5. Test it three ways

1. **Direct invocation:** `/your-skill-name`
2. **Discovery:** Ask *"What skills are available?"*
3. **Auto-invocation:** Give Claude a matching task without using the slash command — does it find the skill automatically?

If auto-invocation doesn't trigger, your `description` isn't matching natural language. Rewrite it.

### 6. Three patterns of increasing power

**Pattern A** — Pure markdown instructions. Good for 80% of skills.

**Pattern B** — Add a script for deterministic processing:
````md
---
name: validate-api
description: Validate API endpoint against OpenAPI spec
---

Run this validation script and report results:
```bash
npx @stoplight/spectral-cli lint openapi.yaml
```
````

**Pattern C** — Fork to subagent with dynamic context:
````md
---
name: deep-review
description: Deep security and quality review of current changes
context: fork
model: opus
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(npm test*)
---

Current changes:
!`git diff --cached`

Perform a thorough review...
````

Pattern C is where skills become seriously powerful — an isolated agent with full tool access, running on opus, with live diff data injected. And it doesn't pollute your main context at all.

### 7. Share it

```bash
git add .claude/skills/
git commit -m "Add [skill-name] skill"
```

| Location | Who can use it |
|----------|----------------|
| `.claude/skills/` (project) | Anyone who clones the repo |
| `~/.claude/skills/` (personal) | Only you, across all projects |

:::note[Why this matters]{icon="bars"}
A team with 10 good skills eliminates hundreds of repeated prompt-writing sessions. Skills are context-efficient (loaded on demand), composable (can call other tools), and shareable (committed to git). But they're also trust boundaries — a skill can do anything Claude can do. Review before you install, especially from third parties.
:::

## Artifact

A working custom skill committed to your project. Understanding of the full frontmatter API and when to use each pattern.

## Go Deeper

[Playbook M07 — Advanced Workflows](/tier-2/m07-advanced-workflows/) for the full workflow composition stack (skills, subagents, hooks, plugins, agent teams), composing skills that call other skills, and building plugin marketplaces.
