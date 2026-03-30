# M08: Security in the Age of AI-Generated Code — Workshop Guide

**Facilitated session | 60–75 min | Requires: M08 study guide read beforehand**

---

## Before You Start

**Prerequisites for participants**
- M08 study guide read (theory + pre-work)
- M07 completion (subagents and hooks)
- Understanding of common web vulnerabilities (SQL injection, XSS, CSRF)
- Familiarity with pre-commit hook setup
- Access to a Git repository with pre-commit hooks enabled
- Admin access to install/modify hook scripts

**What this session does**
The theory explains the threat model. This session makes it operational. Participants will build a security-reviewer subagent, integrate it into pre-commit hooks, and deliberately introduce vulnerabilities to test their safeguards. By the end, everyone has a working security review workflow and has experienced how degraded context leads to vulnerable code.

**Facilitator preparation**
- Have a test repository with `.claude/` directory structure ready to demo
- Test the bash scripts on your machine ahead of time
- Prepare intentional vulnerabilities to review (or use the provided examples)
- Have SonarQube or Semgrep installed for the SAST demo

---

## Session Plan

| Segment | Activity | Time |
|---|---|---|
| 1 | Security threat model overview | 5 min |
| 2 | Build security-reviewer subagent | 10 min |
| 3 | Create pre-commit and post-tool hooks | 15 min |
| 4 | Hands-on: Introduce + catch vulnerabilities | 20 min |
| 5 | Debrief | 5 min |

---

## Segment 1 — Security Threat Model Overview (5 min)

### Context

The module pre-work covered three specific threats:
1. **Prompt injection** — Attacker corrupts context, making Claude generate insecure code
2. **Context rot** — As session progresses, security guidance evicted from context window
3. **OWASP Top Ten for LLM Applications** — Insecure output handling, supply chain vulnerabilities, sensitive data disclosure

### Key Insight

*"Vulnerabilities in AI-generated code aren't about the model being bad. They're about context: does Claude have the right security principles in mind when generating? And are those principles available throughout the session?"*

---

## Segment 2 — Build Security-Reviewer Subagent (10 min)

### Step 1: Create the subagent file

Create `.claude/agents/security-reviewer.md`:

```yaml
---
name: security-reviewer
description: Security-focused code reviewer specializing in common vulnerabilities
model: claude-opus-4-1
instructions: |
  You are a security specialist. Your job is to review code and identify vulnerabilities
  before they reach production.

  Focus on these vulnerability categories:
  1. SQL Injection - Check all database queries for parameterized statements
  2. Cross-Site Scripting (XSS) - Validate HTML/script output is sanitized
  3. Cross-Site Request Forgery (CSRF) - Verify state-changing operations have token validation
  4. Authentication/Authorization Bypass - Check role-based access control enforcement
  5. Sensitive Data Exposure - Look for hardcoded secrets, PII logging, missing encryption
  6. Insecure Deserialization - Detect unsafe pickle/JSON parsing
  7. Using Components with Known Vulnerabilities - Flag outdated dependencies
  8. Insufficient Logging/Monitoring - Security-relevant events logged?
  9. Weak Cryptography - Check for use of deprecated algorithms (MD5, SHA1 without salt)
  10. API Security - No auth on sensitive endpoints? Excessive permissions?

  When reviewing:
  - Examine context: Is this internal tool or public API?
  - Check error messages: Do they leak implementation details?
  - Look at dependencies: Are they pinned? Any known CVEs?
  - Review authentication: Is it present? Is it properly validated?

  Return findings in structured format:

  **Severity: [Critical|High|Medium|Low]**
  **Category: [SQL Injection|XSS|CSRF|Auth|Data Exposure|etc]**
  **Location: [File:Line]**
  **Issue: [Description]**
  **Fix: [Recommended remediation]**

tools:
  - read_file
  - grep_codebase
---
```

### Facilitator note

Walk through this with participants:
- The `instructions` field is what makes this a specialist
- The `tools` list restricts what the subagent can do (read and search only, no writing)
- The structured format ensures reviews are machine-parseable

---

## Segment 3 — Create Pre-commit and Post-tool Hooks (15 min)

### Step 1: Pre-tool Hook (SAST)

Create `.claude/hooks/pre_tool_use.sh`:

```bash
#!/bin/bash
set -e

# Pre-commit hook: Run security checks before code is written

if [[ "$TOOL_NAME" == "write_file" || "$TOOL_NAME" == "edit_file" ]]; then
  # Extract file path from tool input
  FILE_PATH="${TOOL_INPUT}"

  # Only check source code files
  if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|java|sql)$ ]]; then
    exit 0
  fi

  echo "🔒 Pre-flight security check for $FILE_PATH..."

  # Check for hardcoded secrets
  if grep -qE "(password|secret|key|token).*=.*['\"]" "$FILE_PATH" 2>/dev/null; then
    echo "⚠️  WARNING: Possible hardcoded credential detected"
    echo "  → Move to environment variables (.env, secrets manager)"
  fi

  # Check for SQL without parameterization (JavaScript/TypeScript)
  if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
    if grep -qE "SELECT.*FROM.*\$|INSERT INTO.*VALUES.*\$|WHERE.*=.*\$" "$FILE_PATH" 2>/dev/null; then
      echo "⚠️  WARNING: Possible SQL injection pattern detected"
      echo "  → Use parameterized queries (? placeholders, prepared statements)"
    fi
  fi

  # Check for console.log() calls (might expose data)
  if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
    if grep -qE "console\.(log|warn|error)\(" "$FILE_PATH" 2>/dev/null; then
      echo "⚠️  WARNING: console.log() detected"
      echo "  → Remove before production; use proper logging framework"
    fi
  fi

  echo "✓ Pre-flight checks complete"
fi
```

Make it executable:
```bash
chmod +x .claude/hooks/pre_tool_use.sh
```

### Step 2: Post-tool Hook (Trigger Security Review)

Create `.claude/hooks/post_tool_use.sh`:

```bash
#!/bin/bash
set -e

# Auto-trigger security review for new source files
if [[ "$TOOL_NAME" == "write_file" || "$TOOL_NAME" == "edit_file" ]]; then
  FILE_PATH="$TOOL_OUTPUT"

  # Only review source code, not tests or docs
  if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|java)$ ]]; then
    exit 0
  fi

  if [[ "$FILE_PATH" =~ (\.test\.|\.spec\.|test_|\.md|\.json)$ ]]; then
    exit 0
  fi

  # Trigger security review
  echo "🔍 Running security review via subagent..."

  # Note: This is a simplified example. In practice, you'd trigger the subagent
  # via an API call or custom handler.
  # For now, just log what would be reviewed.
  echo "Would send to @security-reviewer: $FILE_PATH"

  # In a real implementation, this might call:
  # curl -X POST http://localhost:8000/subagent/security-reviewer \
  #   --data "{\"file\": \"$FILE_PATH\"}"
fi
```

Make it executable:
```bash
chmod +x .claude/hooks/post_tool_use.sh
```

### Step 3: Dependency Scanning Hook

Create `.claude/hooks/check_dependencies.sh`:

```bash
#!/bin/bash

# Run dependency vulnerability scanning
echo "📦 Scanning dependencies for known vulnerabilities..."

if [ -f "package.json" ]; then
  echo "Checking npm dependencies..."
  npm audit --audit-level=moderate 2>/dev/null || {
    echo "⚠️  Vulnerabilities found in npm packages"
    echo "  → Run: npm audit fix"
  }
fi

if [ -f "requirements.txt" ]; then
  echo "Checking Python dependencies..."
  pip-audit 2>/dev/null || {
    echo "⚠️  Vulnerabilities found in Python packages"
    echo "  → Run: pip install --upgrade [packages]"
  }
fi

if [ -f "go.mod" ]; then
  echo "Checking Go dependencies..."
  go list -json -m all | nancy sleuth 2>/dev/null || {
    echo "⚠️  Vulnerabilities found in Go packages"
    echo "  → Run: go get -u [packages]"
  }
fi

echo "✓ Dependency scan complete"
```

Make it executable:
```bash
chmod +x .claude/hooks/check_dependencies.sh
```

### Facilitator note

*"These three hooks form your defense layers: SAST (pre_tool_use), AI-based review (post_tool_use), and supply chain (check_dependencies). No single layer catches everything, but together they're hard to bypass."*

---

## Segment 4 — Hands-on: Introduce + Catch Vulnerabilities (20 min)

### Step 1: Create Vulnerable Code (5 min)

Create `src/vulnerable.js` with intentional vulnerabilities:

```javascript
// INTENTIONAL VULNERABILITIES FOR TESTING
const express = require('express');
const mysql = require('mysql');

const app = express();
const password = 'super_secret_123'; // Hardcoded secret
const dbPassword = 'db_pass_456';    // Another secret

// VULNERABILITY 1: SQL Injection
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`; // NO parameterization
  db.query(query, (err, results) => {
    res.json(results);
  });
});

// VULNERABILITY 2: Missing CSRF token
app.post('/transfer-money', (req, res) => {
  const { amount, recipient } = req.body;
  // No CSRF token validation
  updateBalance(recipient, amount);
  res.json({ success: true });
});

// VULNERABILITY 3: Exposed PII
app.get('/user/:id/info', (req, res) => {
  const user = getUser(req.params.id);
  console.log(`User accessed: ${user.email}, SSN: ${user.ssn}, Phone: ${user.phone}`); // Logs PII
  res.json(user);
});

// VULNERABILITY 4: Weak password hashing
const crypto = require('crypto');
app.post('/register', (req, res) => {
  const { password } = req.body;
  const hash = crypto.createHash('md5').update(password).digest('hex'); // MD5 is weak
  saveUser({ password_hash: hash });
  res.json({ success: true });
});
```

### Step 2: Trigger Security Review (5 min)

In Claude Code:

```
@security-reviewer review src/vulnerable.js
```

**Expected output:**
```
**Severity: Critical**
**Category: SQL Injection**
**Location: src/vulnerable.js:11**
**Issue: SQL query concatenates user input directly without parameterization. An attacker can inject arbitrary SQL.**
**Fix: Use parameterized queries: const query = 'SELECT * FROM users WHERE id = ?'; db.query(query, [userId], ...)**

**Severity: Critical**
**Category: Sensitive Data Exposure**
**Location: src/vulnerable.js:5-6**
**Issue: Hardcoded database credentials. Credentials should never be in source code.**
**Fix: Move to environment variables: process.env.DB_PASSWORD**

**Severity: High**
**Category: Sensitive Data Exposure**
**Location: src/vulnerable.js:26**
**Issue: PII logged directly. Logs may be exposed or retained longer than needed.**
**Fix: Log only user ID, not email/SSN/phone. Store PII separately if needed for audit.**

**Severity: High**
**Category: Weak Cryptography**
**Location: src/vulnerable.js:32**
**Issue: MD5 is cryptographically broken. Use bcrypt, scrypt, or Argon2 for password hashing.**
**Fix: Use bcrypt: const hash = await bcrypt.hash(password, 10);**

**Severity: Medium**
**Category: CSRF**
**Location: src/vulnerable.js:17-21**
**Issue: State-changing operation (transfer-money) lacks CSRF token validation.**
**Fix: Add CSRF middleware: app.use(csrf()); Check req.csrfToken() in handler.**
```

### Step 3: Fix the Code (10 min)

Participants (or facilitator) fix the vulnerabilities. Example fixes:

```javascript
import express from 'express';
import mysql from 'mysql/promise';
import bcrypt from 'bcrypt';
import csrf from 'csurf';

const app = express();
const dbPassword = process.env.DB_PASSWORD; // Move to env var

// Add CSRF middleware
app.use(express.urlencoded({ extended: false }));
app.use(csrf());

// FIXED: Parameterized query
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  // Validate input
  if (!Number.isInteger(parseInt(userId))) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const query = 'SELECT * FROM users WHERE id = ?';
  try {
    const results = await db.query(query, [userId]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// FIXED: CSRF token validation
app.post('/transfer-money', (req, res) => {
  const { amount, recipient } = req.body;
  // CSRF token is automatically validated by middleware
  updateBalance(recipient, amount);
  // Log safely (no PII)
  console.log(`Transfer processed for user ${req.user.id}`);
  res.json({ success: true });
});

// FIXED: Don't log PII
app.get('/user/:id/info', async (req, res) => {
  const user = await getUser(req.params.id);
  // Only log user ID, not sensitive data
  console.log(`User info accessed: user_id=${user.id}`);
  res.json(user);
});

// FIXED: Use bcrypt
app.post('/register', async (req, res) => {
  const { password } = req.body;
  // Validate password strength
  if (password.length < 12) {
    return res.status(400).json({ error: 'Password too weak' });
  }
  const hash = await bcrypt.hash(password, 10); // Use bcrypt
  await saveUser({ password_hash: hash });
  res.json({ success: true });
});
```

### Step 4: Re-review

```
@security-reviewer review src/vulnerable-fixed.js
```

**Expected output:**
```
**All critical and high-severity issues resolved.**
**Status: APPROVED for security review**
```

---

## Segment 5 — Debrief (5 min)

Ask participants:

1. **"What did the security-reviewer catch that the SAST hook missed?"** — Look for: design issues, semantic vulnerabilities, context-dependent problems
2. **"What would have happened if this code shipped without review?"** — Walk through the blast radius of each vulnerability
3. **"How does this workflow change when you're working in a long session and context degrades?"** — The pre-commit hooks keep firing, but Claude might not have the security guidance in context anymore
4. **"What one thing would you add to your team's security process based on what you just saw?"**

Close with:

> *"Everything we just did — the static checks, the AI-based review, the human verification — is defense in depth. Security isn't one tool. It's layers. And now you own all three."*

---

## Troubleshooting

**Security reviewer misses obvious vulnerabilities:**
- Rewrite the subagent instructions with more specific examples
- Provide context (what tech stack? what are we protecting?)
- Test with `@security-reviewer review [file]` directly

**Pre-commit hooks fire too often (noise):**
- Narrow the checks: only flag hardcoded secrets, not all password assignments
- Add allowlists: `PASSWORD_HASH`, `PASSWORD_RESET` are okay; `PASSWORD`, `SECRET` are not

**Dependency scanner finds false positives:**
- Check if the CVE applies to your usage (e.g., you don't use the vulnerable function)
- Update the dependency, or suppress the alert with documentation

**Team ignores security findings:**
- Make security review a blocker for PR merge
- Add security findings to PR checklist (M09)
- Regular training: "Security isn't someone else's job"

---

## What to Commit Before Leaving

Each participant should have:

- [ ] `.claude/agents/security-reviewer.md` committed to repo
- [ ] `.claude/hooks/pre_tool_use.sh`, `post_tool_use.sh`, `check_dependencies.sh` committed and executable
- [ ] Tested the workflow on at least one vulnerable file
- [ ] Verified fixes pass the security reviewer
- [ ] Understand the three defense layers (SAST, AI review, human review)

---

## References

- **Copilot RCE Vulnerability:** https://arxiv.org/abs/2312.14897 (GitHub Copilot Prompt Injection)
- **OWASP Top Ten for LLM Applications:** https://owasp.org/www-project-top-10-for-large-language-model-applications/
- **SAST Tools:**
  - Semgrep: https://semgrep.dev
  - SonarQube: https://www.sonarqube.org/
  - Snyk: https://snyk.io/
- **Dependency Scanning:**
  - npm audit: https://docs.npmjs.com/cli/v8/commands/npm-audit
  - pip-audit: https://github.com/pypa/pip-audit
  - Nancy (Go): https://github.com/sonatype-nexus-community/nancy
- **Context Rot & LLM Security:** "Challenges in Deploying Large Language Models: A Stanford HAI Report" (2023)
- **AI Code Generation & Security:** "Copilot Eval: Evaluating LLM-Guided Software Development" (Anthropic research)

---

*Next: [M09 — AI-Assisted Code Review](M09-Code-Review.md)*
