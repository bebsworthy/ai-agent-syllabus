# M12: CI/CD Integration and Headless Workflows

## Module Overview

Claude Code is designed for interactive development—you at the keyboard, Claude assisting, rapid back-and-forth. But production systems run 24/7 without human presence. This module teaches you how to integrate Claude Code into your CI/CD pipelines: non-interactive workflows that run automatically, analyze pull requests, perform batch migrations, and enforce quality gates.

You'll learn the `-p` (plan mode) and headless flags that make Claude Code suitable for pipelines. You'll see when AI review adds value (security analysis, complexity detection) versus when it adds noise (false positives, over-eager refactoring). You'll master batch operations for large-scale migrations—processing hundreds of files in parallel using `xargs` and `/batch`. And you'll package workflows as plugins so your team reuses them without constantly rewriting prompts.

The key insight: there are two distinct patterns. **Parallel independent tasks** (refactor file A, B, C simultaneously with no dependencies) use `/batch`. **Coordinated interdependent tasks** (Agent Team orchestrates services) are separate from batch. This module focuses on the former; you'll see why the distinction matters.

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
├── agents/            # agent definitions (if any)├── hooks.json        # CI/CD triggers
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

## Workshop: Facilitated Exercises (45-60 min)

### Exercise 1: Design Your First PR Review Automation (15 min)

**Goal:** Map what review checks make sense to automate.

1. Look at your last 20 PRs. For each, list review comments. Group by category:
   - Security: "This could be SQL injection"
   - Complexity: "This function is too long"
   - Testing: "What about the edge case where...?"
   - Style: "Use const instead of var" (already a linter check?)
   - Logic: "Does this handle null correctly?"
   - Deprecation: "This library is deprecated"

2. Which categories **don't require human judgment**? Those are candidates for AI automation.
   - Security analysis: usually yes (good candidate)
   - Complexity warnings: maybe (depends on your culture)
   - Testing gaps: usually yes
   - Style: no (use linter)
   - Logic issues: maybe (depends on complexity)
   - Deprecation: usually yes

3. Pick one category. Draft a prompt Claude Code could use to check for it:
   ```
   Review this code for [category].
   Look for: [specific patterns, risk types].
   Output: structured list of findings, each with severity and suggested fix.
   ```

4. Share with the group. Refine together.

### Exercise 2: Set Up a GitHub Actions Workflow (20 min)

**Goal:** Write a real YAML file that runs Claude Code in CI/CD.

You don't need to commit this yet; just write it and understand each piece.

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # full history, needed for diff

      - name: Get changed files
        id: files
        run: |
          git diff --name-only origin/main...HEAD > /tmp/changed_files.txt
          cat /tmp/changed_files.txt

      - name: Install Claude Code
        run: npm install -g @anthropic/claude-code

      - name: Run AI Review
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
        run: |
          claude code -p "Review these files for security issues: $(cat /tmp/changed_files.txt). Output: structured list of findings."

      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'AI Review: [output from claude code goes here]'
            })
```

Walk through each step:
- **checkout:** Download the code
- **Get changed files:** Find what's new/modified
- **Install Claude Code:** Make the tool available
- **Run AI Review:** Execute Claude with a prompt
- **Comment on PR:** Post results back to GitHub

Discuss: Where would you adjust the prompt for your team? What else would you add?

### Exercise 3: Batch Operations with xargs (15 min)

**Goal:** See parallelization in action.

Scenario: Your team has 200 JavaScript files. You want to check them for a security vulnerability (e.g., unsafe use of `eval`).

```bash
# Serial (slow):
for file in *.js; do
  claude code -p "Check for unsafe eval in $file"
done

# Parallel with xargs (fast):
find . -name "*.js" | xargs -P 8 -I {} \
  claude code -p "Check {} for unsafe eval. Output: JSON with findings."
```

The `-P 8` means "run 8 tasks in parallel." The `-I {}` means "substitute the filename as `{}`."

**Your turn:** Write a parallel command for your use case:
- Task: "Scan for deprecated library usage"
- File type: "Python (.py)"
- Parallelism: "4 tasks at a time"

Answer:
```bash
find . -name "*.py" | xargs -P 4 -I {} \
  claude code -p "Scan {} for deprecated library usage. Output: JSON."
```

## Hands-on Exercise: Build and Test a CI/CD Pipeline (30-45 min)

### Part 1: Create a Test Repository (10 min)

You'll create a minimal repo with sample code to practice CI/CD automation.

1. Create a directory:
   ```bash
   mkdir test-ci-demo && cd test-ci-demo
   git init
   ```

2. Create a few sample files (or use your real repo):
   ```
   main.js (some JavaScript code, intentionally with an issue)
   util.py (some Python code)
   config.json (config file)
   ```

   Example `main.js` with a security issue:
   ```javascript
   const express = require('express');
   const app = express();

   app.get('/eval', (req, res) => {
     const code = req.query.code;
     eval(code);  // SECURITY ISSUE: arbitrary code execution
     res.send('OK');
   });
   ```

3. Commit:
   ```bash
   git add .
   git commit -m "Initial commit"
   ```

### Part 2: Run Claude Code in Plan Mode (15 min)

**In plan mode (`-p`), Claude Code doesn't modify files; it just analyzes and reports.**

1. Open Claude Code and run:
   ```
   claude code -p "Review main.js for security vulnerabilities. Focus on: eval usage, input validation, SQL injection potential. Output: JSON with findings."
   ```

2. Claude will:
   - Analyze the file
   - Find the `eval(code)` issue
   - Report severity, risk, and suggested fix
   - Output as JSON (structured, parseable by scripts)

3. Examine the output. This is what you'd see in a CI/CD log or GitHub comment.

### Part 3: Simulate Batch Processing (15 min)

1. Create 3-5 files with different issues (SQL injection risk, missing validation, etc.)

2. Run Claude Code in batch mode (or simulate with xargs):
   ```bash
   # If using /batch command:
   claude code /batch "Analyze main.js, util.py, config.json for security issues. Output: JSON for each file."

   # Or using xargs:
   ls *.js *.py | xargs -I {} echo "Analyzing {}..." && \
   find . -name "*.js" -o -name "*.py" | xargs -I {} \
     claude code -p "Security review of {}. Output: JSON."
   ```

3. Collect results. Notice how each file is processed independently. This parallelization scales to hundreds of files.

### Part 4: Set Up a Webhook or GitHub Actions (Optional, if you have repo access)

If you have access to GitHub:

1. Create `.github/workflows/ai-review.yml` with the YAML from Exercise 2
2. Push to GitHub
3. Open a PR with a new file
4. Watch the workflow run in GitHub Actions
5. See Claude Code results commented on the PR

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

### Next Module
[M13: Team Adoption — Standards, Safety, and Scaling](../M13-Team-Adoption/README.md)
