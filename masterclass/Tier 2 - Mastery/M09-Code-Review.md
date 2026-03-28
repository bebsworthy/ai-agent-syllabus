# M09: AI-Assisted Code Review

## Overview

Code review matters *more* with AI-generated code, not less. When a human writes code, they internalize the design intent. When Claude generates code, it's correct but the reasoning is opaque. A human reviewer becomes the *reason check*: does this design make sense for our system?

This module teaches you that style is automatable (linters do that), but design judgment is human. You'll learn the Google AutoCommenter research—what automated review catches and what it irredeemably misses. Then you'll build a `/review` skill that enforces your team's checklist with structured output, practice the Writer/Reviewer pattern (one subagent writes, a fresh subagent reviews with no bias), and understand that *you are responsible for all code you submit, regardless of whether AI generated it*.

**Duration:** 90 minutes (15-20 min pre-work + 60-75 min workshop + exercises)
**Hands-on:** /review skill + Writer/Reviewer pattern + live PR review exercise
**Takeaway:** A /review skill and the Writer/Reviewer pattern as standard practice

---

## Prerequisites

- M08 completion (security review patterns)
- 1-2 weeks Claude Code usage
- Experience reviewing code in your team's workflow
- Familiarity with your team's code style guide
- Understanding of code review best practices

---

## Pre-work: Theory (15-20 minutes)

### Why Code Review Matters *More* with AI

**Traditional code review:**
- Human wrote it → reviewer understands intent → can judge design
- Bugs are human error → reviewers look for common patterns
- Security issues are usually obvious in context

**AI-generated code review:**
- Claude wrote it → intent is opaque → reviewer *must verify logic*
- Code is correct by default → reviewers look for subtle logic errors, insecure patterns, architectural fit
- Security issues can be hidden in clean-looking code (SQL injection in a parameterized query? No. But hardcoded secret in env setup? Yes.)

**The principle:** You are responsible for all code you submit, regardless of whether AI generated it. If Claude's code has a bug and you didn't catch it in review, that's your responsibility.

### The Google AutoCommenter Study

Google published research on automated code review (arxiv paper, "AutoCommenter: A Large Language Model for Programming Comments"). Key findings:

| What AutoCommenter Did Well | What It Missed |
|---------------------------|-----------------|
| Style: naming conventions, formatting | Design: architectural fit, performance implications |
| Obvious bugs: unused variables, typos | Subtle logic: off-by-one errors, state management |
| Security patterns: hardcoded secrets, weak crypto | Context-dependent security: where this data comes from, trust boundaries |
| Trivial refactors: DRY violations, obvious optimizations | Non-trivial refactors: is this abstraction necessary? |

**Insight:** Automated review is good for checkboxes (style, obvious bugs). Human review is essential for judgment (design, context, tradeoffs).

### The Distinction: Style vs Design Judgment

**Style (automatable):**
- Naming conventions
- Indentation and formatting
- Line length limits
- Unused imports
- Function complexity (cyclomatic complexity)
- Missing comments/docstrings

**Tools:** ESLint, Prettier, SonarQube, Pylint

**Design Judgment (human):**
- Does this abstraction make sense for our architecture?
- Is this the right data structure? (linked list vs array, cache invalidation strategy)
- Performance implications for this scale?
- API design: does this parameter make sense? Should it be required or optional?
- Testability: can this be tested? Is it coupled to external systems?
- Fit with team patterns: does this follow our conventions?

**Tools:** Code reviewers (you)

### The Writer/Reviewer Pattern

**Problem:** If the person who wrote the code also reviews it, bias is unavoidable. "I wrote this, so it must be good."

**Solution:** Use subagents. One writes, a different one reviews from fresh context.

**How it works:**
1. **Writer subagent:** Generate feature code
2. **Reviewer subagent:** Fresh session, no context from writer. Reads the code cold and evaluates

**Example:**
```
Session 1 (Writer): @feature-builder implement user authentication
→ Writes auth.ts, auth.test.ts, middleware.ts

Session 2 (Reviewer): @code-reviewer review src/auth.ts
→ Fresh context; evaluates against architecture principles
→ No bias from having written the code
→ Catches things writer missed because writer was "in the flow"
```

---

## Workshop: Build a /review Skill + Reviewer Subagent (60-75 minutes)

### Step 1: Create /review Skill with Checklist (15 minutes)

Create `.claude/skills/review.md`:

```yaml
---
name: Review
description: Structured code review using team checklist
disable-model-invocation: false
allowed-tools: [read_file, grep_codebase]
---

# Code Review Checklist

Review the provided code against these criteria. Return structured feedback.

## Format

For each item below, respond:
- **[PASS|WARN|FAIL]** Category - Specific finding or "No issues"

## Checklist

### Design & Architecture (Critical)
- [ ] Code follows team architecture patterns (see ARCHITECTURE.md)
- [ ] No unnecessary coupling to external systems
- [ ] Abstractions are justified (is this complexity needed?)
- [ ] Data structures chosen appropriately
- [ ] APIs are intuitive and well-scoped

### Security & Data Protection
- [ ] No hardcoded secrets or credentials
- [ ] User input validated/sanitized
- [ ] PII not exposed in logs or errors
- [ ] Authentication/authorization checks present (if needed)
- [ ] Dependencies scanned for vulnerabilities

### Correctness & Logic
- [ ] Happy path works correctly
- [ ] Edge cases handled (null, empty, overflow, negative)
- [ ] Error handling present and informative
- [ ] State management correct (no race conditions, stale state)
- [ ] Performance acceptable (no N+1 queries, unbounded loops)

### Testability & Testing
- [ ] Code is testable (low coupling, dependencies injectable)
- [ ] Unit tests cover main logic and edge cases
- [ ] Test names are descriptive ("testValidateEmail" > "test1")
- [ ] Integration tests cover happy path
- [ ] Mocking/stubbing appropriate (not testing dependencies)

### Code Style & Maintainability
- [ ] Names are clear and descriptive
- [ ] Functions focused (single responsibility principle)
- [ ] No excessive nesting (max 3-4 levels)
- [ ] Comments explain "why", not "what" (code is the what)
- [ ] Follows team conventions (see STYLE_GUIDE.md)

### Documentation
- [ ] Function signatures have JSDoc/docstrings
- [ ] Complex logic explained in comments
- [ ] Breaking changes documented
- [ ] README updated (if public API)

## Summary

At the end, summarize:
- [ ] **Blockers:** Must fix before merge (Critical findings)
- [ ] **Warnings:** Should address before merge (Medium findings)
- [ ] **Nice-to-haves:** Consider for next iteration (Low findings)
- [ ] **Approval:** Ready to merge? (Yes/No)

## Example Review Output

```
### Design & Architecture
[PASS] Architecture - Code follows team patterns for service layer

### Security & Data Protection
[FAIL] Secrets - Hardcoded API key found in src/api.js:15
  → Move to environment variable (process.env.API_KEY)

### Correctness & Logic
[WARN] Edge cases - What happens if response.data is undefined?
  → Add null check: if (!response?.data) { ... }

### Testability & Testing
[PASS] Tests - Comprehensive test coverage, good mocking

...

## Summary
- Blockers: 1 (hardcoded secret)
- Warnings: 2 (missing edge case checks)
- Nice-to-haves: 0
- Approval: NO - Fix secret exposure before merge
```
```

### Step 2: Create a Reviewer Subagent (15 minutes)

Create `.claude/agents/code-reviewer.md`:

```yaml
---
name: code-reviewer
description: Thorough code reviewer focused on design, correctness, and security
model: claude-opus-4-1
instructions: |
  You are a senior code reviewer. Your job is to evaluate code for design,
  correctness, security, and maintainability. You review code *others* have written,
  not code you wrote (no bias).

  When reviewing:
  1. Read the code with fresh eyes. Don't assume intent.
  2. Ask: "Would I write this the same way? If not, why?"
  3. Check edge cases: What breaks this? Null inputs? Huge scale?
  4. Verify security: Any secrets? Input validation? Data exposure?
  5. Judge design: Is this abstraction justified? Testable? Team-aligned?

  Use the `/review` checklist as your framework. Be specific:
  - Don't say "complexity is high" — say "three nested loops with unclear purpose"
  - Don't say "missing tests" — say "error case where response is null is untested"
  - Don't say "bad naming" — say "variable 'x' should be 'maxRetries'"

  Be constructive. Every finding should suggest a fix.

  Return findings in the structured format from `/review`.

tools:
  - read_file
  - grep_codebase
---
```

### Step 3: Implement the Writer/Reviewer Pattern Workflow (15 minutes)

Create `.claude/skills/feature-with-review.md`:

```yaml
---
name: Feature with Review
description: Complete feature workflow - write, review, iterate
disable-model-invocation: false
allowed-tools: []
---

# Feature Development with Code Review

This skill orchestrates the Writer/Reviewer pattern.

## Steps

### 1. Clarify Requirements
- What are we building?
- Success criteria?
- Constraints (performance, security, dependencies)?

### 2. Write Code (Writer Mode)
Ask Claude:
> "Implement [feature] following [style guide]. Create [files] with tests."

Claude generates feature code.

### 3. Review Code (Reviewer Mode)
Ask @code-reviewer:
> "@code-reviewer review src/[feature].ts using the /review checklist"

Reviewer subagent evaluates against checklist.

### 4. Address Findings
If blockers:
- Fix hardcoded secrets
- Add missing error handling
- Implement security checks

If warnings:
- Consider refactoring
- Add edge case tests
- Document complex logic

If nice-to-haves:
- Can defer to next iteration

### 5. Re-review (If Major Changes)
If you made significant changes:
> "@code-reviewer re-review src/[feature].ts"

Continue until: Blockers = 0, Warnings acceptable, Approval = YES

### 6. Merge
Once approved, commit and merge to main.

## Example Session

```
User: "I need to add a discount calculation feature. Let's follow the team style guide and ensure it's well-tested."

Claude (Writer): Creates src/discount.ts, src/discount.test.ts

User: "@code-reviewer review src/discount.ts using /review checklist"

Reviewer: Returns structured findings:
  - [FAIL] Missing edge case: discount > 100% should be capped
  - [WARN] Test for negative price missing
  - [PASS] Architecture follows team patterns

User: Fixes the two issues (adds edge case handling, adds test)

User: "@code-reviewer re-review src/discount.ts"

Reviewer: [PASS] All issues resolved. Ready to merge.

User: Commits and merges.
```

## Key Principle

**The writer and reviewer are different actors.** This prevents bias and ensures fresh perspective.
```

### Step 4: Test with a Real Review Exercise (15 minutes)

**Create a poorly-written feature:** `src/payment-processor.ts`

```typescript
// Intentional issues for review practice
export class PaymentProcessor {
  private api = 'https://api.stripe.com';
  private key = 'sk_test_1234567890'; // HARDCODED SECRET

  async processPayment(amount, cardToken, userId) {
    // Missing input validation
    if (amount > 999999) {
      throw new Error('Amount too large');
      // What about amount < 0?
      // What about amount = 0?
    }

    // Over-coupling: directly calls external API
    const response = await fetch(this.api + '/charges', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        source: cardToken,
        customer: userId,
      }),
      headers: {
        Authorization: `Bearer ${this.key}`,
      },
    });

    // Insufficient error handling
    const data = await response.json();

    // Logs sensitive data
    console.log(`Payment processed: ${JSON.stringify(data)}`);

    return data;
  }

  // Missing tests
  // Missing documentation
}
```

Now, run the review:

```
@code-reviewer review src/payment-processor.ts using /review checklist
```

**Expected findings:**
```
### Security & Data Protection
[FAIL] Secrets - Hardcoded API key in src/payment-processor.ts:3
  → Move to environment variable (process.env.STRIPE_SECRET_KEY)

### Correctness & Logic
[FAIL] Edge cases - What if amount is 0 or negative?
  → Add validation: if (amount <= 0) throw new Error('...')
[WARN] Error handling - response.json() could fail; not caught

### Testability & Testing
[FAIL] Tests - No tests present; this is a critical payment feature

...

Approval: NO - Critical issues must be fixed
```

### Step 5: Fix and Re-review (5 minutes)

Fix the issues:
```typescript
import { validatePaymentInput } from './validation';
import { stripeClient } from './stripe-client'; // External API injected

export class PaymentProcessor {
  constructor(private stripe: StripeClient) {}

  async processPayment(
    amount: number,
    cardToken: string,
    userId: string,
  ): Promise<PaymentResult> {
    // Validate input
    validatePaymentInput({ amount, cardToken, userId });

    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (amount > 999999) {
      throw new Error('Amount exceeds maximum');
    }

    try {
      const result = await this.stripe.createCharge({
        amount,
        source: cardToken,
        customer: userId,
      });

      // Log safely (no sensitive data)
      console.log(`Payment processed for user ${userId}`);

      return {
        success: true,
        transactionId: result.id,
      };
    } catch (error) {
      console.error('Payment processing failed:', error.message);
      throw new Error('Payment failed. Please try again.');
    }
  }
}

// Tests
describe('PaymentProcessor', () => {
  it('validates input', () => {
    expect(() => processor.processPayment(0, 'tok_123', 'user_1')).toThrow();
    expect(() => processor.processPayment(-100, 'tok_123', 'user_1')).toThrow();
  });

  it('processes valid payment', async () => {
    const result = await processor.processPayment(1000, 'tok_123', 'user_1');
    expect(result.success).toBe(true);
  });

  it('handles API errors gracefully', async () => {
    stripeClientMock.createCharge.mockRejectedValueOnce(new Error('API down'));
    expect(() => processor.processPayment(1000, 'tok_123', 'user_1')).rejects.toThrow(
      'Payment failed',
    );
  });
});
```

Re-review:
```
@code-reviewer re-review src/payment-processor.ts
```

---

## Hands-on Exercise: Full PR Review (Async, 30-45 minutes)

### Challenge: Review a Real (or Mock) PR

**Option A: Review a Team PR**
If your team has active development:
1. Pick a PR (not one you wrote)
2. Run the `/review` skill on all changed files
3. Use `@code-reviewer` for detailed design review
4. Leave structured comments on the PR with findings

**Option B: Review Provided Code**
Review this feature (authentication module) using the `/review` skill and `@code-reviewer`:

```typescript
// src/auth.ts - User authentication module

export async function loginUser(email: string, password: string) {
  const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);

  if (!user) {
    return { success: false, message: 'User not found' };
  }

  const match = bcrypt.compareSync(password, user.passwordHash);

  if (!match) {
    return { success: false, message: 'Invalid password' };
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  return { success: true, token };
}

export function authenticateRequest(req: Request): boolean {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return true;
  } catch (error) {
    return false;
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}
```

**What to submit:**
1. Structured review using `/review` checklist
2. Detailed findings from `@code-reviewer`
3. Before/after if you fixed issues
4. Summary: blockers, warnings, approval status

---

## Takeaway

You now own:
- ✓ A `/review` skill with structured checklist
- ✓ A code-reviewer subagent for design/correctness/security judgment
- ✓ The Writer/Reviewer pattern (separate sessions, no bias)
- ✓ Understanding that style is automatable; design judgment is human
- ✓ Responsibility: you're accountable for all code you submit

**Apply immediately:**
- Commit `.claude/skills/review.md` and `.claude/agents/code-reviewer.md` to your repo
- Make code review mandatory before PR merge (use the `@code-reviewer` subagent)
- Practice the Writer/Reviewer pattern for at least 2-3 features
- Build team habits: "Always ask @code-reviewer before merge"

---

## Key Concepts

**Automated vs. Human Review:**
Automated tools (linters, SAST) check style and obvious bugs. Humans check design and judgment.

**Writer Bias:**
If you write code and review it, you're biased toward thinking it's good. Using a separate reviewer prevents this.

**Writer/Reviewer Pattern:**
Separate subagents (or humans) for writing and reviewing. Writer doesn't influence reviewer's judgment.

**Design Judgment:**
Not automatable. Requires understanding of architecture, team conventions, and tradeoffs. Humans are better at this.

**Responsibility:**
You are responsible for all code you submit, AI-generated or not. If it has a bug, you should have caught it in review.

---

## Troubleshooting

**Reviewer subagent is too critical/lenient:**
- Adjust instructions in `.claude/agents/code-reviewer.md`
- Add examples of what "good design" looks like for your team
- Reference your ARCHITECTURE.md file

**Review takes too long:**
- Use linters for style (ESLint, Prettier) before review
- Focus review on design, correctness, security (not formatting)
- Create `/review` mini version for quick pass, full version for deep dive

**Team ignores review findings:**
- Make review a blocker for PR merge (CI/CD integration)
- Discuss findings in PR comments (why this matters)
- Regular training: "Why code review prevents production incidents"

**Reviewer misses obvious issues:**
- Re-check: is the issue truly obvious, or domain-specific?
- Add to reviewer subagent instructions: "Check for [specific issue type]"
- Pair with SAST tools to catch patterns reviewer misses

---

## References

- **Google AutoCommenter Research:** https://arxiv.org/abs/2210.02968 ("AutoCommenter: A Large Language Model for Programming Comments")
- **Google Code Review Best Practices:** https://google.github.io/eng-practices/review/
- **Trunk Engineering Playbook:** https://www.trunkbaseddevelopment.com/code-review/
- **Code Review Culture:** https://engineering.squarespace.com/blog/2020/code-review-best-practices
- **Security Review Patterns:** https://owasp.org/www-project-secure-coding-practices/
