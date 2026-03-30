# M12: CI/CD Integration and Headless Workflows

## Module Overview

Claude Code is designed for interactive development—you at the keyboard, Claude assisting, rapid back-and-forth. But production systems run 24/7 without human presence. This module teaches you how to integrate Claude Code into your CI/CD pipelines: non-interactive workflows that run automatically, analyze pull requests, perform batch migrations, and enforce quality gates.

You'll learn the `-p` (plan mode) and headless flags that make Claude Code suitable for pipelines. You'll see when AI review adds value (security analysis, complexity detection) versus when it adds noise (false positives, over-eager refactoring). You'll master batch operations for large-scale migrations—processing hundreds of files in parallel using `xargs` and `/batch`. And you'll package workflows as plugins so your team reuses them without constantly rewriting prompts.

The key insight: there are two distinct patterns. **Parallel independent tasks** (refactor file A, B, C simultaneously with no dependencies) use `/batch`. **Coordinated interdependent tasks** (Agent Team orchestrates services) are separate from batch. This module focuses on the former; you'll see why the distinction matters.

> **Workshop:** [M12-CICD-Integration-workshop.md](../workshops/M12-CICD-Integration-workshop.md)

## Prerequisites

- Completed Tier 1 and Tier 2
- Comfortable with Claude Code and prompt engineering
- Basic CI/CD experience (GitHub Actions, GitLab CI, or similar)
- Access to your team's Git repository and CI/CD system (or a test repo you control)
- Familiarity with the command line and `xargs` (or willingness to learn)

## Pre-Work: Theory and Readings (15-20 min)

### Claude Code as Infrastructure

Unlike traditional tools, Claude Code is a reasoning engine. In interactive mode, you provide context and get back suggestions. In headless mode (the `-p` flag and similar), Claude Code becomes a service: you give it a task, it produces output, no human in the loop.

This shift enables new workflows:
- **PR review automation:** Every pull request is analyzed by Claude before merge
- **Batch migrations:** 200 files refactored in parallel
- **Quality gates:** Deployments blocked if security checks fail
- **Scheduled tasks:** Nightly runs to detect deprecations, unused code, etc.

### When AI Review Adds Value vs. Noise

**AI review adds value for:**
- Security analysis: "Does this code handle untrusted input safely?"
- Complexity detection: "This function is 300 lines; suggest refactoring?"
- API misuse: "Is this library being used correctly?"
- Consistency checks: "Does this follow our naming conventions?"
- Testing gaps: "What test cases are missing?"

**AI review often adds noise for:**
- Style issues (use a linter instead)
- Obvious refactoring suggestions (use automatic formatting)
- Personal preference (review should be human if it's opinion)
- Code that works fine as-is (don't suggest changes just for change's sake)

The golden rule: use AI for analysis and reasoning, not for style enforcement. Linters already do style.

### Batch Operations: `/batch` vs. xargs vs. Agent Teams

Three patterns for processing multiple items:

1. **`/batch` command:** Claude Code can process multiple independent files in parallel. Syntax:
   ```
   /batch
   Process file1.js, file2.js, file3.js to [task]
   ```
   Good for: independent refactorings, security scans, formatting
   Limit: each file processed in isolation; no context between files

2. **`xargs` + headless:** Shell pattern for parallel tasks:
   ```
   find . -name "*.py" | xargs -P 4 claude code -p "Analyze for security issues"
   ```
   Good for: simple, stateless tasks
   Limit: no shared context; each task starts fresh

3. **Agent Teams:** Multiple agents that coordinate. Not in this module; requires Tier 4.
   Good for: complex workflows with dependencies
   Example: Agent A finds issues, Agent B drafts fixes, Agent C runs tests

**Key distinction:** Batch and xargs are **parallelizable but independent**. Agent Teams are **coordinated and interdependent**. This module focuses on batch and xargs.

### Pipeline Integration Patterns

**Pattern 1: PR Comment Review**
- Trigger: Pull request opened
- Action: Claude Code analyzes diff
- Output: Comment on PR with findings
- Decision: Human approves or requests changes

**Pattern 2: Pre-merge Gate**
- Trigger: PR ready for merge
- Action: Claude Code runs security/complexity checks
- Output: Pass/fail status
- Decision: Block merge if fails

**Pattern 3: Scheduled Batch Migration**
- Trigger: Weekly cron job
- Action: Find files matching criteria, batch process
- Output: PRs with proposed changes
- Decision: Human reviews and merges

**Pattern 4: Deployment Validation**
- Trigger: Pre-deployment
- Action: Analyze code against production safety checklist
- Output: Report of risks
- Decision: Proceed or rollback

### Plugin Packaging for Team Distribution

Instead of copying and pasting prompts, package them as plugins. A plugin is:
```
my-security-review/
├── SKILL.md           # metadata
├── skills/            # reusable prompts
│   └── security-check.md
├── agents/            # agent definitions (if any)
├── hooks.json         # CI/CD triggers
├── mcp.json          # MCP tool definitions
└── manifest.json     # plugin manifest
```

Teams install once: `claude code --plugin my-security-review`. Then any developer uses it without setup.

### Recommended Readings

1. **"Claude Code Headless and Batch Modes"** — Official documentation
   - ~10 min. Learn `-p`, `-batch`, and integration patterns.

2. **"GitHub Actions Guide"** — GitHub official docs, workflows section
   - ~15 min. How to write `.github/workflows/` YAML files.

3. **"CI/CD Best Practices"** — DevOps handbook or equivalent
   - ~15 min. When to automate, when to manual-review, cost-benefit analysis.

4. **"Scaling Code Review"** — Stripe or Uber engineering blogs (search "scale code review")
   - ~15 min. How large teams handle code review without drowning. (Spoiler: selective AI review helps.)

5. **"xargs and Parallel Processing"** — Linux man page or tutorial
   - ~10 min. Practical guide to parallelizing shell tasks.


## Takeaway: At Least One CI/CD Integration Running in Your Pipeline

By the end of this module, you should have:

1. **A documented AI review workflow** for your team. Template:
   ```yaml
   # Place in .github/workflows/ai-code-review.yml
   name: AI Code Review
   on: [pull_request]
   jobs:
     review:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Run AI Review
           run: claude code -p "[your security/complexity checks here]"
         - name: Comment on PR
           # post results to GitHub
   ```

2. **A reusable prompt** for your most common check. Example:
   ```
   Check this code for:
   - Secrets/credentials in strings
   - Unsafe input handling
   - Missing error handling
   - Deprecated APIs
   Output as JSON: [{"file": "...", "issues": [...]}]
   ```

3. **A decision log:** Which review checks are automated, which remain manual, and why.
   ```
   Automated:
   - [ ] Security: eval, SQL injection, secrets (too risky to miss)
   - [ ] Deprecation: outdated libraries (easy to detect, low false-positive)

   Manual:
   - [ ] Code style (linters handle this)
   - [ ] Architecture decisions (requires context)
   - [ ] Test coverage philosophy (culture-specific)
   ```

4. **A batch operation script** (if your team does large migrations):
   ```bash
   # Example: refactor all uses of `var` to `const`
   find . -name "*.js" | xargs -P 4 -I {} \
     claude code -p "In {}, replace var with const where safe. Output: diff."
   ```

## Key Concepts

| Concept | Definition |
|---------|-----------|
| **Headless Mode** | Running Claude Code without interactive terminal. Useful for CI/CD and automation. (`-p` flag) |
| **Plan Mode (`-p`)** | Analyze only; don't modify files. Safe for automation because no side effects. |
| **Batch Processing** | Process multiple files in parallel. `/batch` command or `xargs`. |
| **GitHub Actions** | Workflow automation for GitHub repos. Runs on events (PR opened, commit pushed, etc.). |
| **CI/CD Gate** | Automated check that must pass before code is merged or deployed. |
| **xargs** | Unix utility to convert stdin into command-line arguments. Used for parallelization. |
| **Plugin** | Packaged set of prompts, tools, and configurations. Distributed to teams via version control. |
| **Parallel Execution** | Running multiple tasks simultaneously. Faster than serial, but no shared context between tasks. |

## References

### Official Documentation
- [Claude Code Official Docs](https://claude.ai/docs) — Look for headless and batch mode sections
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [xargs Manual](https://man7.org/linux/man-pages/man1/xargs.1.html)

### Tools
- GitHub Actions: https://github.com/features/actions
- GitLab CI/CD: https://docs.gitlab.com/ee/ci/
- Jenkins: https://www.jenkins.io/

### Articles and Guides
- "Scaling Code Review" (Uber or Stripe blog)
- "Automating Security Reviews" (security-focused blogs)
- Your company's incident postmortems (see what review catches missing)

