# Finding Vulnerabilities in Modern Web Apps Using Claude Code and OpenAI Codex

**Source:** https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/

## Executive Summary

Semgrep's security research team evaluated how effectively AI coding agents detect vulnerabilities in real-world applications. Testing Anthropic's Claude Code and OpenAI Codex against 11 large Python web applications revealed that while these tools identify genuine security issues, they produce substantial false positives and demonstrate concerning non-determinism.

**Key Statistics:**
- Claude Code: 46 real vulnerabilities found (14% true positive rate, 86% false positive rate)
- Codex: 21 real vulnerabilities found (18% true positive rate, 82% false positive rate)
- Approximately 20 high-severity issues discovered across both tools

## Vulnerability Detection by Category

### Claude Code Performance
- **IDOR:** 22% TPR (13 correct/59 reported) — strongest category
- **SQL Injection:** 5% TPR (2/38) — poorest performance
- **XSS:** 16% TPR (12/74)
- **Path Traversal:** 13% TPR (5/36)
- **Auth Bypass:** 10% TPR (6/58)
- **SSRF:** 12% TPR (8/65)

### OpenAI Codex Performance
- **Path Traversal:** 47% TPR (8/17) — strongest category
- **SSRF:** 34% TPR (8/23)
- **IDOR:** 0% TPR (0/5)
- **SQL Injection:** 0% TPR (0/5)
- **XSS:** 0% TPR (0/28)

## Primary Weaknesses Identified

**Context Limitations:** Both tools struggle with tracing data flows across multiple files and functions—critical for detecting injection vulnerabilities. Models fail to recognize server-side sanitization and cannot effectively track user input between a source and a sink.

**Non-Determinism Crisis:** Identical prompts on the same codebase produced wildly different results across multiple runs. One application yielded 3, 6, and 11 distinct findings across successive scans. This unpredictability stems from context compaction and what researchers term "context rot."

**Framework Confusion:** The tools frequently struggle with modern web framework patterns, particularly distinguishing between statically-defined data and user-supplied input that requires protection.

## Benchmark Problems with Traditional Testing

The research highlights why existing vulnerability benchmarks mislead:

1. **Training Data Contamination:** Popular benchmark applications (WebGoat, OWASP Juice Shop) likely appear in LLM training data
2. **Unrealistic Code:** Benchmark applications often include comments and variable names that hint at vulnerability locations
3. **Scale Mismatch:** Benchmark test cases average under 98 lines across 3 Python files, versus real applications containing 800k+ lines of code
4. **Isolation Issues:** Traditional benchmarks extract vulnerabilities from broader application context

## Evaluation Framework

The study analyzed 11 actively-maintained, real-world Python web applications using Django, Flask, and FastAPI frameworks:

- Combined codebase: 800+ thousand lines of code across 7,000+ files
- Application stars ranging from 100 to 25,000 on GitHub
- Production-grade complexity including dependencies and business logic

Manual review validated approximately 445 total findings, with dynamic testing for confirmation where applicable.

## Claude Code's `/security-review` Command

Anthropic's specialized security command showed limited effectiveness on full codebases. When tested against three applications, it identified only one XSS vulnerability—substantially fewer than targeted searches for specific vulnerability classes produced.

## Non-Determinism Deep Dive

### Observed Patterns

**PY-APP-002:** Findings escalated from 3 to 6 to 11 across successive runs, with minimal overlap between results.

**PY-APP-006:** First run identified user API vulnerabilities; subsequent runs focused on event abstracts and notes modules—completely different attack surfaces.

**PY-APP-007:** Each run surfaced unique vulnerabilities absent from other iterations.

### Root Causes

Lossy compression mechanisms mean some finer reasoning details like function names and paths can get lost in the summarization process. This mirrors attempting to summarize a complex novel while retaining crucial subtleties.

## Implications for Security Practice

**Cost Considerations:** Claude Code analysis of the complete dataset cost $114 total, but scaling to multiple runs for comprehensive coverage multiplies expenses substantially. Token costs create fundamentally different economics than traditional deterministic tooling.

**Reliability Concerns:** The inability to reproduce results undermines trust in findings. A single scan may provide false security; subsequent scans might identify previously-missed critical vulnerabilities.

**Coverage Questions:** Incomplete detection in individual runs means teams cannot confidently assert vulnerability absence from a single analysis pass.

## What Works Well

- **IDOR Detection:** Claude Code shows comparative strength here, discovering legitimate access control issues and suggesting credible remediation patterns
- **Real Vulnerabilities:** Both tools identify genuine security flaws in production applications—not merely synthetic issues
- **Code Hardening:** Many false positives, while technically incorrect vulnerability claims, do suggest legitimate defensive improvements (though recommendations require validation)

## Conclusion and Future Directions

The research positions AI coding agents as useful but imperfect security tools requiring careful integration into comprehensive systems. Success requires understanding their strengths (contextual reasoning) and weaknesses (deep semantics of the code), and by building sophisticated agentic systems around them using advanced static analysis engines.

The study represents the first in a planned series exploring AI vulnerability detection, with responsible disclosure still pending for identified real-world issues before full dataset release.
