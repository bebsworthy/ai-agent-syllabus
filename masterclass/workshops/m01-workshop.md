---
title: "M01 Workshop: How LLMs Actually Work"
description: "Hands-on: install Claude Code, explore a real codebase, and build the habit of reviewing before executing."
---


**Facilitated session | 45–60 min | Requires: M01 study guide read beforehand**

---

## Before You Start

**Prerequisites for participants**
- M01 study guide read (theory + readings)
- Claude Code installed (or allocate 10 min at the start)
- A real project codebase open and ready (ideally 1K–10K lines, in any language — not a toy project)
- Admin access to install software on your machine
- A Claude account (free tier works; paid unlocks larger context windows)

**What this session does**
The theory explains the mechanism. This session makes it tangible. Participants will see hallucinations happen on their own code, understand why, and learn the habits that prevent them from becoming a problem. By the end, everyone has Claude Code working on a real project and has experienced the context-accuracy relationship firsthand.

**Facilitator preparation**
- Have your own project ready to demo when someone's installation takes longer
- Prepare a "deliberately bad" demo prompt to illustrate hallucination on demand
- Test installation on the target OS ahead of time

---

## Session Plan

| Segment | Activity | Time |
|---|---|---|
| 1 | Installation and first launch | 10 min |
| 2 | First interaction with a real codebase | 15 min |
| 3 | Essential shortcuts and commands | 10 min |
| 4 | Hands-on exercise | 20 min |
| — | Debrief | 5 min |

---

## Segment 1 — Installation and First Launch (10 min)

### Steps

```bash
# macOS
brew install claude-code

# Linux
curl -sSL install.claude.ai/linux | bash

# Windows
# Download installer from claude.ai, run as administrator

# Verify
claude --version
```

Authenticate when prompted — a browser window will open for Claude account login. Credentials are stored locally in `~/.claude/`.

### Facilitator note

While installations run, don't fill the silence with slides. Use it: *"You're about to run a pattern-matching system that has never seen your codebase before. It will make confident-sounding suggestions that are sometimes wrong. Understanding why means you'll know exactly when to trust it and when to check."*

If someone's installation stalls, continue with your own machine projected. They can catch up in Segment 2.

---

## Segment 2 — First Interaction with a Real Codebase (15 min)

Use one volunteer's project (ideally projected). 1K–10K lines is ideal — real, but not overwhelming.

### Step 1 — Initialise

```bash
cd your-project
claude /init
```

This creates a `CLAUDE.md` at the project root. Don't edit it yet.

### Step 2 — Architecture question

Ask Claude:
> *"Explain the overall architecture of this project in 2–3 sentences."*

**Watch the output together.** Ask the group: *"Did it get it right? What clues did it use? What did it miss?"*

### Step 3 — Deliberate hallucination trigger

Ask Claude:
> *"Find the main entry point and show me the first 50 lines."*

**If Claude hallucinates a file that doesn't exist** — perfect. This is the teaching moment:
> *"This is pattern matching. Claude predicted the most likely entry point based on naming conventions in its training data. It's not lying — it genuinely doesn't know your project. Let's give it real context."*

**If Claude gets it right** — still useful:
> *"It guessed correctly this time, based on a common naming pattern. Let's see if we can make it less reliant on guessing."*

### Step 4 — Add context, repeat

Edit `CLAUDE.md` to add 2–3 lines of real project facts:
```
Main entry point: src/main.ts
Architecture: Express backend + React frontend
Key folders: /api (routes), /components (UI), /lib (shared utilities)
```

Ask the same question again. Observe the difference in specificity and accuracy.

**Key learning:** *Claude's reliability depends entirely on the context it has. This is why CLAUDE.md exists — we'll build it properly in M04, but the principle starts here.*

---

## Segment 3 — Essential Shortcuts and Commands (10 min)

Walk through these live, not as a lecture. Ask participants to try each one.

### Keyboard shortcuts

| Shortcut | What it does |
|---|---|
| `Esc` | Stop Claude mid-generation (keeps context) |
| `Esc` `Esc` | Rewind to a checkpoint |
| `Shift+Tab` | Cycle: Normal → Plan Mode → Auto-Accept |
| `Ctrl+B` / `Cmd+B` | Open file browser |
| `Ctrl+L` / `Cmd+L` | Focus the input field |

### Slash commands to demonstrate now

| Command | What it does |
|---|---|
| `/init` | Generate a starter CLAUDE.md from the codebase |
| `/effort low\|medium\|high\|max` | Control reasoning budget (more effort = slower, more accurate) |
| `/model sonnet\|opus\|haiku` | Switch models mid-session |
| `/clear` | Wipe conversation history |
| `/context` | Show token usage breakdown — run this now |

**Run `/context` together.** Show the breakdown: system prompt, tools, conversation history, free space. *"This is what's consuming your context window right now, before you've done anything. We'll manage this actively in M04."*

---

## Segment 4 — Hands-on Exercise: Find, Explain, Improve (20 min)

Each participant works on their own project. Facilitator circulates and prompts.

### Setup (3 min)

Find a function that:
- Is real and in active use (not dead code)
- Is 20–60 lines
- Has at least one obvious improvement: missing error handling, an inefficiency, a naming issue, or an undocumented edge case

Add the function's file path to `CLAUDE.md`:
```
## Key function to explore today
File: src/services/auth.ts — validateToken() function
```

### Part A — Hallucination test (5 min)

Ask Claude:
> *"List all parameters of `[your function]` and what each one does."*

Observe: does it get the parameter names right? If it hallucinates:
- Add the actual function signature to CLAUDE.md
- Ask again — compare the quality of the answer

### Part B — Deep understanding (7 min)

Ask Claude:
> *"Explain the logic of `[your function]` step by step. What would happen if `[a realistic edge case]` occurred?"*

If Claude struggles or gives a generic answer, try:
> *"Use `/effort high` and try again."*

Notice the difference in reasoning depth.

### Part C — Improvement proposal (5 min)

Ask Claude:
> *"This function doesn't handle `[the edge case you identified]`. Show me what a fix would look like."*

**Do not execute the change yet.** Review it:
- Is the logic correct?
- Does it understand how this function connects to the rest of the codebase?

Ask one more question:
> *"Show me all the callers of `[your function]`. Would this change break any of them?"*

Observe whether Claude searches the codebase or guesses.

---

## Debrief (5 min)

Ask the group:

1. **"Where did Claude get it right, and what enabled that?"** — Look for: good context, well-named code, common patterns
2. **"Where did it hallucinate or struggle, and why?"** — Look for: missing context, unusual naming, code that doesn't match common patterns
3. **"What one thing would you add to CLAUDE.md right now to improve the next session?"**

Close with:
> *"Everything we just saw — the hallucinations, the improvement when context was added, the deeper reasoning with higher effort — all of it follows from the same mechanism: statistical pattern matching against training data. You now have the mental model that explains Claude's behaviour. Every module from here builds on this."*

---

## What to Commit Before Leaving

Each participant should have:

- [ ] Claude Code installed and authenticated
- [ ] A `CLAUDE.md` at their project root with at least 3 real project facts
- [ ] Run `/context` at least once and noted the token breakdown
- [ ] Experienced at least one hallucination and one recovery via added context

---

## Common Issues

**Installation fails on corporate machine** — IT policies may block npm or the installer. Have the participant try `npm install -g @anthropic-ai/claude-code` as a fallback, or continue observing on a neighbour's machine.

**Claude keeps getting the architecture right even without context** — Use a less-common file structure, or ask about something highly specific to the project (internal utility names, unusual patterns). The point about hallucination will arise naturally in the exercise.

**Participant's codebase is too large** — Direct Claude to a specific subdirectory: `cd src/services && claude`. Or update CLAUDE.md to explicitly scope the session: *"Focus only on the /auth module for today."*

**"My code is proprietary — I'm not comfortable pasting it"** — Remind participants that Claude Code runs locally and reads files directly without uploading them to a server. For teams with strict data policies, the enterprise plan offers zero-retention guarantees.
