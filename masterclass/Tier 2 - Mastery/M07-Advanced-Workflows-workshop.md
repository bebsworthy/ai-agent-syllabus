# M07: Advanced Workflows — Workshop Guide

**Facilitated session | 60–75 min hands-on | Requires: M07 study guide read beforehand**

---

## Before You Start

**Facilitator note**
This workshop builds on the composition stack and skill patterns from the study guide. Participants will move from understanding the layers (CLAUDE.md, Skills, Subagents, Hooks) to implementing a complete feature development workflow. They'll create reusable skills that persist in the repo, test subagents in isolation, and wire hooks into their development cycle. Allocate 60-75 minutes for hands-on work and iteration.

**Prerequisites for participants**
- M07 study guide and pre-work theory completed
- Access to a team Git repository (or a test repo they control)
- Familiarity with YAML frontmatter
- Basic shell scripting knowledge (bash)
- Git basics (add, commit, push)

**Session timing**

| Segment | Activity | Time |
|---|---|---|
| 1 | Create first skill (Pure Markdown) | 10 min |
| 2 | Create subagent (Code Quality) | 15 min |
| 3 | Create PostToolUse hook | 15 min |
| 4 | Create feature workflow skill | 10 min |
| 5 | Test integration | 5 min |
| 6 | Commit to repository | 5 min |
| — | Debrief and Q&A | 10 min |

---

## Context

Your team needs a repeatable workflow: developers write code, subagents review it, hooks auto-lint, everything feeds into CI/CD. You'll build:

1. **Team skill:** `/new-component` — scaffolds a new React component with skeleton code
2. **Subagent:** Code quality reviewer specialized in your codebase
3. **Hook:** Auto-lints code on every file write

---

## Step 1: Create Your First Skill — Pure Markdown (10 minutes)

Create `.claude/skills/new-component.md` in your repository:

````yaml
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
````

Now run: `/new-component` in Claude Code. It will generate boilerplate.

**Facilitator tip:** Ask participants: "Where did this skill definition come from? Is it in your repo or somewhere else?" The answer: it's in `.claude/skills/`, so it's repo-local and committed. Every team member gets it when they clone.

---

## Step 2: Create a Subagent for Code Quality (15 minutes)

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

**Key learning:** A subagent is an independent session with its own tools and instructions. It doesn't inherit your main session's context—it's specialized. This isolation makes it useful for consistent, role-focused work.

---

## Step 3: Create a PostToolUse Hook (15 minutes)

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

**Teaching moment:** Hooks are deterministic and run automatically at lifecycle points. This one runs after tool execution (`PostToolUse`). It validates and auto-formats output without requiring human intervention. This is how you enforce team standards without friction.

---

## Step 4: Create a Feature Development Skill (10 minutes)

Create `.claude/skills/new-feature.md`:

````yaml
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
````

---

## Step 5: Test Integration (5 minutes)

In Claude Code, try the full workflow:

```
/new-feature

[Claude scaffolds a component]

@code-quality review the implementation

[Code quality subagent provides feedback]

[Your PostToolUse hook auto-lints]

Feature ready for PR
```

**What to observe:**
- Does the `/new-feature` skill guide you through a checklist?
- When you call `@code-quality`, does it run in isolation with its own context?
- Does the hook auto-lint files you write?

---

## Step 6: Commit to Repository (5 minutes)

```bash
cd /path/to/repo
git add .claude/skills/ .claude/agents/ .claude/hooks/
git commit -m "feat: add feature workflow (skill + subagent + hook)"
git push origin main
```

Now every team member cloning the repo gets these skills and hooks automatically.

**Facilitator note:** This is the key moment. By committing these to the repo, you've encoded team practices into tooling. New hires get the same workflow. Knowledge doesn't stay in one person's head—it's in the CLAUDE ecosystem.

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

## Debrief Questions

1. **"When you created the skill definition, what was the hardest part?"** Look for: clarity of instructions, knowing what checklist to include, when to call subagents.
2. **"How would you describe the difference between a skill and a subagent?"** Look for: skills are instructions + templates; subagents are independent sessions with specialized roles.
3. **"If the hook didn't run, how would you debug it?"** Look for: checking `.chmod +x`, verifying hook location, understanding hook lifecycle events.
4. **"What's the biggest risk if you commit a buggy skill to the repo?"** Look for: awareness that everyone gets it; need to test before committing; easy to rollback.

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

## What to Commit Before Leaving

Each participant should have:

- [ ] At least one skill defined in `.claude/skills/` (YAML frontmatter + markdown content)
- [ ] At least one subagent defined in `.claude/agents/`
- [ ] At least one hook in `.claude/hooks/` and executable
- [ ] Tested the skill by running `/skill-name` in Claude Code
- [ ] Committed all files to the repository
- [ ] Documented the workflow in a README or wiki

---

## References

- **Claude Code Skills Documentation:** https://claude.com/docs/skills
- **Subagents Guide:** https://claude.com/docs/subagents
- **Hooks Documentation:** https://claude.com/docs/hooks
- **YAML Syntax:** https://yaml.org/
- **Composition Stack Reference:** (From M07 study guide pre-work)
