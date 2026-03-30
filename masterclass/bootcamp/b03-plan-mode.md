---
title: "03: Plan Before You Build"
description: "Use Plan Mode to catch mistakes at the spec level (minutes to fix) instead of the code level (hours to fix)."
---

**30 minutes | You need: a real multi-file task from your backlog**

---

## Setup

Pick a real task — something that touches multiple files. Not a one-liner. Examples: add a feature, refactor a module, implement an API endpoint.

## Do This

### 1. See what vague gets you

Enter Plan Mode: press `Shift+Tab` (or type `/plan`).

Give Claude a vague one-liner:

> *"Users should be able to edit their profiles."*

Review the plan. Notice the assumptions, the ambiguity, the missing details.

### 2. Write a clear spec

Now write a proper spec for the same feature:

```
Add profile editing to the user settings page.

Requirements:
- PUT /api/users/:id endpoint with validation
- Only authenticated users can edit their own profile
- Editable fields: display name, bio, avatar URL
- Validate: name max 100 chars, bio max 500 chars, avatar must be valid URL
- Return 400 for validation errors, 403 for unauthorized access
- Update the existing UserSettings React component to include an edit form

Acceptance criteria:
- Existing tests still pass
- New endpoint has at least 3 test cases (happy path, validation error, auth error)
- Frontend form has client-side validation matching the API rules
```

Enter Plan Mode again with this spec. Compare the plan quality.

### 3. Refine

Challenge one assumption:

> *"What about race conditions if two tabs are open? How should we handle concurrent edits?"*

Use `Ctrl+G` to open the plan in your text editor for direct editing.

### 4. Execute

Once the plan looks solid, exit Plan Mode (`Shift+Tab`) and tell Claude to implement:

> *"This plan looks good. Execute it."*

Review the diff before approving.

### 5. Know when to skip it

Plan Mode is for multi-file features, unfamiliar codebases, and architectural changes. Skip it for single-file, well-scoped changes you can describe in one sentence.

> **Why this matters:** The most common failure mode with AI coding isn't bad code — it's solving the wrong problem. Plan Mode catches mistakes at the spec level (minutes to fix) instead of the code level (hours to fix). Clear spec → 1 round of review (~1 hour). Vague spec → 3 rounds of revision (~8 hours).

## Artifact

A completed Plan Mode workflow on a real task — planned, reviewed, implemented, and diffed.

## Go Deeper

[Playbook M03 — Specs Are Source Code](/tier-1/m03-specs-are-source-code/) for the spec-first paradigm, specification templates, and why communication is now the core technical skill.
