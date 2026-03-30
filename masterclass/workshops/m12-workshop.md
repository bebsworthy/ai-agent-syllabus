---
title: "M12: CI/CD Integration and Headless Workflows — Workshop Guide"
description: "Wire a GitHub Actions AI review step into your pipeline and package it as a reusable plugin."
---

# M12: CI/CD Integration and Headless Workflows — Workshop Guide

**Facilitated session | 45–60 min | Requires: M12 study guide read beforehand**

---

## Before You Start

**Prerequisites for participants**
- M12 study guide read (theory + readings)
- Claude Code installed and working
- Access to a Git repository (real project or test repo)
- Basic CI/CD experience (GitHub Actions, GitLab CI, or similar)
- Familiarity with bash and `xargs` (or willingness to learn)

**What this session does**
The theory covers headless modes, batch operations, and CI/CD integration patterns. This workshop makes them tangible. Participants will design a real PR review automation, write GitHub Actions YAML, use xargs for parallel processing, and test everything on sample code. By the end, everyone has executed Claude Code in plan mode and understands how parallelization scales.

**Facilitator preparation**
- Have a GitHub Actions workflow YAML file ready to walk through
- Test `xargs` command on your own machine beforehand
- Prepare 3-5 sample files with realistic security/complexity issues
- Have your own CI/CD repository to demo if someone's setup takes time

---

## Session Plan

| Segment | Activity | Time |
|---|---|---|
| 1 | Exercise 1: Design PR review automation | 15 min |
| 2 | Exercise 2: Write GitHub Actions YAML | 20 min |
| 3 | Exercise 3: Batch operations with xargs | 15 min |
| — | Hands-on: Build and test CI/CD pipeline | 30–45 min |
| — | Debrief | 5 min |

---

## Exercise 1: Design Your First PR Review Automation (15 min)

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

**Facilitator note:** Push participants to be specific. Generic prompts like "find bugs" are too vague. "Find SQL injection in Python database queries" is actionable.

---

## Exercise 2: Set Up a GitHub Actions Workflow (20 min)

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

**Facilitator note:** Highlight the `-p` flag in the "Run AI Review" step. This is **plan mode**—Claude analyzes but doesn't modify. Safe for CI/CD by design.

---

## Exercise 3: Batch Operations with xargs (15 min)

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

**Facilitator note:** Walk through the xargs flags:
- `find . -name "*.py"`: Find all .py files
- `|`: Pipe output to the next command
- `xargs -P 4 -I {}`: Take input, run 4 tasks in parallel, substitute filename as `{}`
- `claude code -p ...`: Run Claude in plan mode for each file

---

## Hands-on Exercise: Build and Test a CI/CD Pipeline (30–45 min)

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

---

## Debrief Questions

Ask the group:

1. **"When you designed your PR review automation in Exercise 1, what category felt most realistic to automate? Why that one?"** — Look for: teams recognizing the difference between mechanical checks (deprecation, security patterns) vs. judgment calls (architecture, design).

2. **"In the GitHub Actions YAML, what would break if someone deleted a file mentioned in `changed_files.txt` before Claude Code ran?"** — Look for: understanding that CI/CD is fragile; edge cases matter.

3. **"You ran 8 parallel tasks with xargs. What would happen if you ran 100 tasks in parallel instead?"** — Look for: recognizing resource limits, rate limiting, cost management.

4. **"Which of your team's review comments from the last 20 PRs should NOT be automated by Claude Code?"** — Look for: discernment about when AI adds value vs. noise.

5. **"If Claude's output is wrong in a PR review, who's responsible?"** — Look for: clarity that automation is a tool; humans are still accountable.

---

## Common Issues

**"Claude Code installation fails in CI/CD"** — Most common: missing CLAUDE_API_KEY secret in GitHub. Solution: go to repo Settings > Secrets and add the key. Or use a different installation method (e.g., pre-built Docker image).

**"The xargs command finds files but Claude Code times out"** — xargs is parallelizing too aggressively and hitting rate limits. Solution: reduce `-P` from 8 to 4 or 2. Or add `sleep` between batches: `xargs -P 4 -I {} sh -c 'claude code -p "..." && sleep 1'`.

**"GitHub Actions YAML has indentation errors"** — YAML is whitespace-sensitive. Solution: use an online YAML validator (yamllint.com) before committing. Or use a GitHub Actions editor in the web UI, which validates as you type.

**"The AI review output is too noisy—many false positives"** — The prompt is too generic. Solution: make it more specific. Instead of "check for security issues" (yields 50 false positives), try "check for SQL injection in database queries only" (yields 2-3 real issues).

**"Plan mode (-p) doesn't work; Claude still tries to modify files"** — User may be confusing `-p` with something else, or using an older version. Solution: verify `claude --version` is recent. Confirm the `-p` flag is actually in the command. Use `claude code -p "[prompt]"`, not `claude -p code "[prompt]"`.

---

## What to Commit Before Leaving

Each participant should have:

- [ ] At least one GitHub Actions YAML file (even if not pushed)
- [ ] A working example of `xargs` with Claude Code on their machine
- [ ] Plan mode output (JSON or report) from a real or test file
- [ ] A documented list of 3-5 review categories they'd automate
- [ ] Understanding of when to use `/batch` vs. `xargs` vs. a webhook
