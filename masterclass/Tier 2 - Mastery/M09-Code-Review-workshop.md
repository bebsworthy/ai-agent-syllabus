# M09: AI-Assisted Code Review — Workshop Guide

**Facilitated session | 60–75 min | Requires: M09 study guide read beforehand**

---

## Before You Start

**Prerequisites for participants**
- M09 study guide read (theory + AutoCommenter research)
- M08 completion (security review patterns)
- 1-2 weeks Claude Code usage
- Experience reviewing code in your team's workflow
- Familiarity with your team's code style guide
- A Git repository where you can commit `.claude/` files

**What this session does**
The theory explains what automated review catches and misses. This session makes it operational. Participants will build a `/review` skill with structured checklist, a code-reviewer subagent, and practice the Writer/Reviewer pattern. By the end, everyone has a team-aligned code review workflow and has experienced how fresh perspective catches things the writer missed.

**Facilitator preparation**
- Have a code example ready to review (use the provided payment-processor.ts or bring your team's code)
- Test the skill format in your Claude Code instance
- Prepare feedback on what the `@code-reviewer` subagent should focus on for your team
- Have a team code style guide or ARCHITECTURE.md available as reference

---

## Session Plan

| Segment | Activity | Time |
|---|---|---|
| 1 | Review philosophy overview | 5 min |
| 2 | Build /review skill and code-reviewer subagent | 15 min |
| 3 | Implement Writer/Reviewer pattern | 10 min |
| 4 | Hands-on: Review real code, fix, re-review | 20 min |
| 5 | Debrief | 5 min |

---

## Segment 1 — Review Philosophy Overview (5 min)

### Context

The pre-work covered two critical insights:
1. **Style is automatable** — linters handle naming, formatting, obvious bugs
2. **Design judgment is human** — architecture fit, tradeoffs, context

The Google AutoCommenter study proved this: automated systems catch style issues perfectly but miss subtle design problems.

### Key Insight

*"When Claude generates code, you can't see its reasoning. The reviewer's job is to verify that the design makes sense for your system, not just that the code works. This is why code review matters more with AI, not less."*

---

## Segment 2 — Build /review Skill and Code-Reviewer Subagent (15 min)

### Step 1: Create /review Skill with Checklist

Create `.claude/skills/review.md`:

````yaml
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
````

### Step 2: Create Code-Reviewer Subagent

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

### Facilitator note

*"Notice that the code-reviewer subagent has no write_file permissions. Reviewers should only read, understand, and judge. They don't write the fix—that's the developer's job. This keeps bias out of the review."*

---

## Segment 3 — Implement Writer/Reviewer Pattern (10 min)

### Create Feature-with-Review Skill

Create `.claude/skills/feature-with-review.md`:

````yaml
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
````

### Facilitator note

*"This skill documents the workflow. Print it, post it on your wall, or pin it in Slack. It's your team's process now."*

---

## Segment 4 — Hands-on: Review Real Code, Fix, Re-review (20 min)

### Step 1: Review Poorly-Written Feature (7 min)

Create `src/payment-processor.ts` with intentional issues:

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

Run the review:

```
@code-reviewer review src/payment-processor.ts using /review checklist
```

**Expected findings:**

```
### Design & Architecture
[WARN] Coupling - Direct Stripe API calls; consider dependency injection
  → Create StripeClient interface, inject it; makes testing easier

### Security & Data Protection
[FAIL] Secrets - Hardcoded API key in src/payment-processor.ts:3
  → Move to environment variable (process.env.STRIPE_SECRET_KEY)
[FAIL] Data Protection - Sensitive payment data logged
  → Remove console.log or log only transaction ID, not full response

### Correctness & Logic
[FAIL] Edge cases - What if amount is 0 or negative?
  → Add validation: if (amount <= 0) throw new Error('...')
[WARN] Error handling - response.json() could fail; not caught
  → Wrap in try-catch: try { const data = await response.json(); } catch (e) { ... }

### Testability & Testing
[FAIL] Tests - No tests present; this is a critical payment feature
  → Add unit tests covering: success path, error cases, edge cases

### Code Style & Maintainability
[WARN] Documentation - No function doc; parameters lack types
  → Add JSDoc: @param {number} amount, @param {string} cardToken, etc.

## Summary
- Blockers: 2 (hardcoded secret, no edge case validation)
- Warnings: 3 (no tests, missing error handling, poor documentation)
- Nice-to-haves: 0
- Approval: NO - Fix blockers and consider warnings before merge
```

### Step 2: Fix the Code (8 min)

Participants fix the issues:

```typescript
import { validatePaymentInput } from './validation';
import { StripeClient } from './stripe-client'; // External API injected

/**
 * Processes payments using Stripe.
 * @param {number} amount - Payment amount in cents (must be > 0)
 * @param {string} cardToken - Stripe card token
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<PaymentResult>} Transaction result with ID
 */
export class PaymentProcessor {
  constructor(private stripe: StripeClient) {}

  async processPayment(
    amount: number,
    cardToken: string,
    userId: string,
  ): Promise<PaymentResult> {
    // Validate input
    validatePaymentInput({ amount, cardToken, userId });

    // Edge case: amount must be positive
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (amount > 999999) {
      throw new Error('Amount exceeds maximum');
    }

    try {
      // Use injected client, not hardcoded credentials
      const result = await this.stripe.createCharge({
        amount,
        source: cardToken,
        customer: userId,
      });

      // Log safely (no sensitive data)
      console.log(`Payment processed: transaction_id=${result.id}, user_id=${userId}`);

      return {
        success: true,
        transactionId: result.id,
      };
    } catch (error) {
      // Informative error, doesn't leak API details
      console.error('Payment processing failed:', error.message);
      throw new Error('Payment failed. Please try again.');
    }
  }
}

// Test coverage
describe('PaymentProcessor', () => {
  let processor: PaymentProcessor;
  let stripeMock: jest.Mocked<StripeClient>;

  beforeEach(() => {
    stripeMock = createMockStripeClient();
    processor = new PaymentProcessor(stripeMock);
  });

  describe('Input validation', () => {
    it('rejects zero amount', async () => {
      await expect(processor.processPayment(0, 'tok_123', 'user_1'))
        .rejects
        .toThrow('Amount must be positive');
    });

    it('rejects negative amount', async () => {
      await expect(processor.processPayment(-100, 'tok_123', 'user_1'))
        .rejects
        .toThrow('Amount must be positive');
    });

    it('rejects amount exceeding limit', async () => {
      await expect(processor.processPayment(1000000, 'tok_123', 'user_1'))
        .rejects
        .toThrow('Amount exceeds maximum');
    });
  });

  describe('Happy path', () => {
    it('processes valid payment and returns transaction ID', async () => {
      stripeMock.createCharge.mockResolvedValueOnce({ id: 'ch_123' });

      const result = await processor.processPayment(1000, 'tok_123', 'user_1');

      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('ch_123');
    });
  });

  describe('Error handling', () => {
    it('handles Stripe API errors gracefully', async () => {
      stripeMock.createCharge.mockRejectedValueOnce(
        new Error('Card declined'),
      );

      await expect(processor.processPayment(1000, 'tok_123', 'user_1'))
        .rejects
        .toThrow('Payment failed');
    });
  });
});
```

### Step 3: Re-review (5 min)

```
@code-reviewer re-review src/payment-processor.ts
```

**Expected output:**

```
### Design & Architecture
[PASS] Architecture - Dependency injection makes this testable
[PASS] Coupling - Stripe client is abstracted behind interface

### Security & Data Protection
[PASS] Secrets - API key from environment variable
[PASS] Data Protection - Sensitive data not logged

### Correctness & Logic
[PASS] Edge cases - All validated (zero, negative, max amount)
[PASS] Error handling - Try-catch wraps API call; safe error message

### Testability & Testing
[PASS] Tests - Comprehensive coverage of happy path, edge cases, errors
[PASS] Mocking - Stripe client properly mocked

### Code Style & Maintainability
[PASS] Documentation - JSDoc covers parameters and return
[PASS] Functions focused - Single responsibility

## Summary
- Blockers: 0
- Warnings: 0
- Nice-to-haves: 0
- Approval: YES - Ready to merge
```

---

## Segment 5 — Debrief (5 min)

Ask participants:

1. **"What did the reviewer catch that you might have missed as the writer?"** — Look for: design coupling, edge cases, error handling assumptions
2. **"Why was the second review faster than the first?"** — The fixes were surgical; no design changes; reviewer confirmed alignment
3. **"How does this process scale to your team?"** — Code review becomes a checklist. Blockers have to be fixed. Fresh perspective is built in.
4. **"What's one thing you'd add to the /review checklist for your team's codebase?"**

Close with:

> *"You've just experienced what the Google AutoCommenter research proved: style is automatable (linters handle that), but design judgment is human. This workflow—write, review with fresh eyes, iterate—is how you ship AI-generated code you're confident in. The subagent can't replace you. But it can replace your bias."*

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

## What to Commit Before Leaving

Each participant should have:

- [ ] `.claude/skills/review.md` committed to repo
- [ ] `.claude/agents/code-reviewer.md` committed to repo
- [ ] `.claude/skills/feature-with-review.md` committed to repo
- [ ] Tested the workflow on at least one feature
- [ ] Verified fixes pass the code-reviewer subagent
- [ ] Understand the difference between automated style and human design judgment
- [ ] Committed to using Writer/Reviewer pattern for next 2-3 features

---

## References

- **Google AutoCommenter Research:** https://arxiv.org/abs/2210.02968 ("AutoCommenter: A Large Language Model for Programming Comments")
- **Google Code Review Best Practices:** https://google.github.io/eng-practices/review/
- **Trunk Engineering Playbook:** https://www.trunkbaseddevelopment.com/code-review/
- **Code Review Culture:** https://engineering.squarespace.com/blog/2020/code-review-best-practices
- **Security Review Patterns:** https://owasp.org/www-project-secure-coding-practices/

---

*End of workshop. Review checklist: blockers = 0, warnings resolved, code approved. Ready to ship.*
