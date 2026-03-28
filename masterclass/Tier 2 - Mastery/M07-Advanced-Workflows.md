# M07: Advanced Workflows — Skills, Subagents, and Hooks

## Overview

You've built basic prompts. Now scale to reusable, team-wide workflows. Claude Code supports a composition stack: CLAUDE.md (persistent context) → Skills (reusable instructions) → Subagents (isolated workers with independent state) → Hooks (deterministic lifecycle scripts) → MCP (external tools) → Plugins (bundled packages) → Agent Teams (coordinated parallelism).

This module teaches you to design skills that your whole team uses, create specialized subagents for security review or code quality checks, and wire hooks into your development lifecycle. By the end, you'll have at least one team skill live in production and one hook auto-running on every pull request.

**Duration:** 90 minutes (15-20 min pre-work + 60-75 min workshop + exercises)
**Hands-on:** Custom skill + subagent + hook in a real repository
**Takeaway:** At least one team skill and one hook deployed to your project

---

## Prerequisites

- M06 completion (tool design principles)
- 1-2 weeks Claude Code usage
- Familiarity with YAML frontmatter
- Access to a team Git repository
- Basic shell scripting knowledge
- Understanding of subagent scope and isolation

---

## Pre-work: Theory (15-20 minutes)

### The Workflow Composition Stack

When should you use each layer?

| Layer | What It Is | When to Use | Scope |
|-------|-----------|-----------|-------|
| **CLAUDE.md** | Persistent, repo-wide context | Project conventions, architecture docs, team standards | Whole session |
| **Skills** | Reusable instruction templates | Commands you run repeatedly (scaffold component, review PR) | Single session; triggered by `/` |
| **Subagents** | Independent sessions with their own tools/context | Parallel work, role-based isolation (security reviewer, code quality) | Independent context window |
| **Hooks** | Deterministic scripts that run before/after tool use | Auto-formatting, pre-commit validation, notifications | Triggered by lifecycle events |
| **MCP** | External integrations (databases, APIs, internal tools) | Access to systems outside Claude Code | Tool-level |
| **Plugins** | Bundled skills + MCPs + custom commands | Packaged workflows for distribution across teams | Whole environment |
| **Agent Teams** | Coordinated parallel sessions | Large refactors, multi-component features, parallel reviews | Team-level orchestration |

### Three Skill Patterns

Skills are instructions + optional scripts. There are three patterns:

**Pattern A: Pure Markdown**
Just text. No scripts, no tool calls.

```yaml
---
name: New Component
description: Scaffold a new React component following team conventions
disable-model-invocation: false
allowed-tools: []
---

# New Component

Create a React component with the following structure:

1. Named export function
2. PropTypes validation
3. Storybook story
4. Unit test file

Follow: components/Button.tsx as template.
```

When to use: Simple, instructional tasks that don't need external validation.

**Pattern B: Markdown + Scripts (Shell)**
Text + optional shell script that validates or post-processes.

```yaml
---
name: New API Endpoint
description: Create a new Express.js API endpoint with docs
disable-model-invocation: false
allowed-tools: []
---

# New API Endpoint

Create endpoints in src/routes/ following:

```bash
#!/bin/bash
# Validate the new endpoint
npx eslint src/routes/$1.ts
npx jest src/routes/$1.test.ts
```

When to use: Tasks that need validation or post-processing (linting, testing, doc generation).

**Pattern C: Markdown + MCP/Subagents**
Text + optional subagent for specialized work.

```yaml
---
name: Security Review
description: Review code for security issues using specialized subagent
disable-model-invocation: false
allowed-tools: []
---

Call the security-reviewer subagent to check for:
- SQL injection vulnerabilities
- Cross-site scripting (XSS)
- Insecure authentication patterns
```

When to use: Specialized knowledge work (security, architecture review, performance analysis).

### Skill Anatomy: YAML Frontmatter

Every skill has:

```yaml
---
name: Skill Name                    # Human-readable name
description: One-line purpose      # Shown in /skill list
disable-model-invocation: false    # false = Claude can refine skill, true = use as-is
allowed-tools: [tool1, tool2]      # Restrict which tools this skill can call
disabled: false                    # Optional: disable the skill
---

# Your markdown content here
Instructions, templates, examples
```

### Skill Locations and Scope

| Location | Scope | Who Sees It |
|----------|-------|-----------|
| `.claude/skills/` | Repository-local | Only this repo's Claude Code sessions |
| `~/.claude/skills/` | User-local | All your Claude Code sessions |
| `~/.claude/plugins/` | Distributed as plugin | Your whole org |

For team skills: keep them in `.claude/skills/` and commit to the repo.

### Custom Subagents in `.claude/agents/`

A subagent is a separate session with its own configuration. Define in `.claude/agents/security-reviewer.md`:

```yaml
---
name: security-reviewer
description: Security-focused code reviewer
model: claude-opus-4-1  # Or your preferred model
instructions: |
  You are a security specialist. Review code for vulnerabilities.
  Check for SQL injection, XSS, CSRF, auth bypass, data exposure.
  Return structured findings with severity levels.
tools:
  - analyze_ast
  - query_codebase
  - list_dependencies
---

# Security Reviewer

Review the provided code for security issues:

1. **SQL Injection:** Check all database queries for parameterized statements
2. **XSS:** Validate that HTML/script output is sanitized
3. **CSRF:** Verify token validation on state-changing operations
4. **Auth Bypass:** Check role-based access control enforcement
5. **Data Exposure:** Look for hardcoded secrets, PII logging

Return a structured report:
- Severity (Critical, High, Medium, Low)
- Issue type
- Location (file, line)
- Recommended fix
```

Summon a subagent in Claude Code with `@security-reviewer review this PR`.

### Hooks: Deterministic Lifecycle Scripts

Hooks run at specific points:

| Hook | When It Fires | Use Case |
|------|---------------|----------|
| **PreToolUse** | Before any tool executes | Validate tool calls, log usage |
| **PostToolUse** | After tool completes | Auto-format output, lint results, notify team |
| **Notification** | Before displaying result to user | Custom notifications |
| **Stop** | When session ends | Cleanup, metrics, final checks |

Hooks live in `.claude/hooks/` as shell scripts:

```bash
# .claude/hooks/post_tool_use.sh
#!/bin/bash

# Auto-lint any code written to src/
if [[ "$TOOL_OUTPUT" =~ "src/" ]]; then
  npx eslint --fix "$TOOL_OUTPUT"
  echo "✓ Auto-linted"
fi

# Notify Slack if a deployment was triggered
if [[ "$TOOL_NAME" == "trigger_deployment" ]]; then
  curl -X POST $SLACK_WEBHOOK \
    -d '{"text": "Deployment triggered: '$TOOL_OUTPUT'"}'
fi
```

Hooks receive environment variables:
- `$TOOL_NAME` — which tool ran
- `$TOOL_OUTPUT` — the tool's result
- `$TOOL_INPUT` — what was passed to the tool

---

## Workshop: Build a Feature Development Workflow (60-75 minutes)

### Context

Your team needs a repeatable workflow: developers write code, subagents review it, hooks auto-lint, everything feeds into CI/CD. You'll build:

1. **Team skill:** `/feature` — scaffolds a new feature with skeleton code
2. **Subagent:** Security reviewer specialized in your codebase
3. **Hook:** Auto-lints code on every file write

### Step 1: Create Your First Skill — Pure Markdown (10 minutes)

Create `.claude/skills/new-component.md` in your repository:

```yaml
---
name: New Component
description: Scaffold a new React component following team conventions
disable-model-invocation: false
allowed-tools: []
---

# New Component Scaffold

Create a new React component that follows our team conventions:

## Structure
- Component file in `components/{ComponentName}.tsx`
- PropTypes validation
- Storybook story file
- Unit test file
- Export from `components/index.ts`

## Template: components/Button.tsx

```typescript
import React from 'react';
import PropTypes from 'prop-types';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  disabled: PropTypes.bool,
};
```

## Checklist
- [ ] Component exports named function
- [ ] PropTypes defined
- [ ] JSDoc comments on props
- [ ] Story file created (Storybook integration)
- [ ] Test file created with at least one snapshot test
- [ ] Component exported from `components/index.ts`

## Test Pattern

```typescript
import { render } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    const { getByText } = render(
      <Button label="Click me" onClick={() => {}} />
    );
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <Button label="Click me" onClick={() => {}} />
    );
    expect(container).toMatchSnapshot();
  });
});
```
```

Now run: `/new-component` in Claude Code. It will generate boilerplate.

### Step 2: Create a Subagent for Code Quality (15 minutes)

Create `.claude/agents/code-quality.md`:

```yaml
---
name: code-quality
description: Code quality and architecture reviewer
model: claude-opus-4-1
instructions: |
  You are a senior code reviewer focused on quality and maintainability.
  Evaluate code for: readability, testability, performance, architectural fit.
  Provide constructive feedback aligned with team standards.
tools:
  - read_file
  - grep_codebase
  - analyze_imports
---

# Code Quality Reviewer

Review the provided code for quality issues:

## Readability
- Variable names clear and descriptive?
- Functions focused (single responsibility)?
- Comments explain "why", not "what"?

## Testability
- Code can be unit tested (minimal side effects)?
- Dependencies injectable?
- Mock-friendly?

## Performance
- N+1 queries? Database inefficiencies?
- Unnecessary re-renders (React)?
- Unbounded loops or arrays?

## Architectural Fit
- Follows team patterns (styling, routing, state management)?
- Proper separation of concerns?
- Reusable or tightly coupled to one use case?

Return structured feedback:
- Category (Readability, Testability, Performance, Architecture)
- Severity (Must Fix, Should Fix, Nice to Have)
- Specific location
- Suggested improvement
```

Test it by calling `@code-quality` in a Claude Code session:
> "@code-quality review src/components/Button.tsx"

### Step 3: Create a PostToolUse Hook (15 minutes)

Create `.claude/hooks/post_tool_use.sh`:

```bash
#!/bin/bash
set -e

# Auto-lint JavaScript/TypeScript files after writes
if [[ "$TOOL_NAME" == "write_file" || "$TOOL_NAME" == "edit_file" ]]; then
  if [[ "$TOOL_OUTPUT" =~ \.(ts|tsx|js|jsx)$ ]]; then
    if command -v npx &> /dev/null; then
      echo "🔧 Auto-linting $TOOL_OUTPUT..."
      npx eslint --fix "$TOOL_OUTPUT" 2>/dev/null || true
      echo "✓ Linting complete"
    fi
  fi
fi

# Run tests if test file was modified
if [[ "$TOOL_OUTPUT" =~ \.test\.(ts|tsx|js|jsx)$ ]]; then
  echo "🧪 Running tests for $TOOL_OUTPUT..."
  npx jest "$TOOL_OUTPUT" --passWithNoTests 2>/dev/null || true
fi

# Validate TypeScript on any .ts/.tsx write
if [[ "$TOOL_OUTPUT" =~ \.(ts|tsx)$ ]]; then
  echo "✓ TypeScript valid"
fi
```

Make it executable:
```bash
chmod +x .claude/hooks/post_tool_use.sh
```

Now whenever Claude Code writes a TypeScript file, it auto-lints.

### Step 4: Create a Feature Development Skill (10 minutes)

Create `.claude/skills/new-feature.md`:

```yaml
---
name: New Feature
description: Start a new feature following team workflow
disable-model-invocation: false
allowed-tools: [write_file, read_file, execute_bash]
---

# New Feature Workflow

When creating a new feature:

1. **Read the requirements** — Understand what you're building
2. **Design the interface** — Component props, API contract, types
3. **Implement** — Write code, follow component scaffold pattern
4. **Test** — Unit tests, integration tests
5. **Self-review** — Run `/code-quality @code-quality` to review your own work
6. **Security check** — Request `@security-reviewer` to validate

## Typical Feature Checklist

- [ ] Types defined (`interface` or `type`)
- [ ] Unit tests (>80% coverage)
- [ ] Integration test (happy path)
- [ ] Storybook story (if UI component)
- [ ] Code quality review passed
- [ ] Security review passed
- [ ] Documentation/comments added
- [ ] Committed and pushed to feature branch

## Example: Add User Profile Page

```
/new-feature
→ Claude creates: pages/Profile.tsx, pages/Profile.test.tsx, components/ProfileCard.tsx
→ Human writes requirements in the files
→ @code-quality reviews implementation
→ @security-reviewer checks for auth bypass, data exposure
→ Hooks auto-lint, run tests
→ Ready for PR
```
```

### Step 5: Test Integration (5 minutes)

In Claude Code, try the full workflow:

```
/new-feature

[Claude scaffolds a component]

@code-quality review the implementation

[Code quality subagent provides feedback]

[Your PostToolUse hook auto-lints]

Feature ready for PR
```

### Step 6: Commit to Repository (5 minutes)

```bash
cd /path/to/repo
git add .claude/skills/ .claude/agents/ .claude/hooks/
git commit -m "feat: add feature workflow (skill + subagent + hook)"
git push origin main
```

Now every team member cloning the repo gets these skills and hooks automatically.

---

## Hands-on Exercise: Custom Skill + Hook (Async, 30-45 minutes)

### Choose One Scenario

**Option A: Database Migration Skill**
Create a `/migrate` skill that:
1. Scaffolds a migration file (src/migrations/TIMESTAMP_description.sql)
2. Provides migration template (up, down, safety checks)
3. Includes a hook that validates SQL syntax before commit

**Option B: PR Checklist Skill**
Create a `/review-checklist` skill that:
1. Asks questions about the PR (scope, tests, docs)
2. Generates a structured checklist
3. Includes a PostToolUse hook that validates checklist completion

**Option C: API Endpoint Skill**
Create a `/new-endpoint` skill that:
1. Scaffolds a new Express.js endpoint
2. Creates route, validation, tests
3. Includes a hook that validates OpenAPI/Swagger compliance

### What to Submit

1. **Skills:** All `.yml` files in `.claude/skills/`
2. **Subagents:** All `.md` files in `.claude/agents/`
3. **Hooks:** All `.sh` files in `.claude/hooks/`
4. **Documentation:** A 1-page README explaining:
   - What each skill does and when to use it
   - What the subagent specializes in
   - How the hook improves the workflow
   - Team adoption plan (e.g., "Commit to repo, document in wiki")

---

## Takeaway

You now own:
- ✓ At least one team skill (live in `.claude/skills/`)
- ✓ One custom subagent (in `.claude/agents/`)
- ✓ One hook automatically running on your workflow
- ✓ A documented pattern for reusable instructions

**Apply immediately:**
- Commit skills/hooks to your repo
- Document in your team wiki
- Have the team use the skill for 1-2 real features
- Collect feedback and iterate

---

## Key Concepts

**Skill:**
A reusable instruction template triggered by `/skill-name`. Can be pure markdown or include scripts/subagents.

**Subagent:**
An independent session with its own configuration, tools, and context window. Useful for specialized work (security review, code quality, architecture) without biasing the main agent.

**Hook:**
A deterministic script running at lifecycle points (PreToolUse, PostToolUse, Notification, Stop). Enables automation: auto-linting, validation, notifications.

**Consolidation Stack:**
CLAUDE.md → Skills → Subagents → Hooks → MCP → Plugins → Agent Teams. Each layer has a specific purpose; use the right layer for the job.

**Pattern A/B/C:**
- A: Pure markdown (instructional)
- B: Markdown + scripts (validation)
- C: Markdown + subagents (specialized knowledge)

---

## Troubleshooting

**Skill doesn't appear in `/` menu:**
- Check YAML syntax (use a YAML validator)
- Ensure file is in `.claude/skills/` or `~/.claude/skills/`
- Reload Claude Code

**Subagent not responding:**
- Verify `.claude/agents/agent-name.md` exists
- Check instructions aren't contradictory
- Test with `@agent-name test message`

**Hook not running:**
- Check file is in `.claude/hooks/` and executable (`chmod +x`)
- Verify hook name matches lifecycle event (post_tool_use.sh, etc.)
- Add logging: `echo "Hook executed"` to see if it runs

**Skill calls restricted tool:**
- Check `allowed-tools` in frontmatter
- If empty, skill can't call tools; add tool names explicitly
- If `disable-model-invocation: true`, Claude won't improve the skill

---

## References

- **Claude Code Skills Documentation:** https://claude.com/docs/skills
- **Subagents Guide:** https://claude.com/docs/subagents
- **Hooks Documentation:** https://claude.com/docs/hooks
- **YAML Syntax:** https://yaml.org/
- **Team Workflow Best Practices:** (Anthropic internal; shared in workshop)
