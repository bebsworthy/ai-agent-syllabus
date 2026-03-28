# Week 6: AI Testing and Security — Course Notes

## Overview

Week 6 explores the intersection of artificial intelligence and software security—a critical concern as AI-powered development tools become ubiquitous. This week examines how Large Language Models like GitHub Copilot, Claude, and specialized security tools introduce both powerful capabilities and serious vulnerabilities into the software development lifecycle. The course addresses the fundamental tension: AI agents can dramatically accelerate code generation and vulnerability detection, yet their inherent non-determinism, context limitations, and susceptibility to prompt injection attacks create new security risks that traditional tools never posed. Through practical case studies, threat modeling, and industry perspectives, students learn to write secure code in an age where both the developer and potential attacker leverage AI capabilities.

---

## Key Concepts & Learnings

### The Evolution of Vulnerability Detection: From Static to AI-Powered Analysis

The landscape of application security testing has undergone a fundamental transformation over the past two decades. Traditional security analysis relied on two foundational approaches—Static Application Security Testing (SAST) and Dynamic Application Security Testing (DAST)—each with complementary strengths and limitations. *(Source: "SAST vs DAST")*

SAST represents white-box testing that analyzes application code without execution. This approach excels at identifying common vulnerabilities such as cross-site scripting, insecure deserialization, and buffer overflows during the development phase, when fixes are least expensive. Because SAST integrates seamlessly into continuous integration/continuous deployment (CI/CD) pipelines, teams can catch defects early and often. The method scales dramatically through automation, allowing organizations to scan codebases repeatedly without manual overhead. However, SAST faces inherent limitations: it cannot detect vulnerabilities that only manifest at runtime, such as authentication flaws arising from system misconfiguration. Additionally, SAST tools historically produce substantial false positive rates, requiring developers to manually verify findings and potentially becoming a source of alert fatigue.

DAST, by contrast, employs black-box testing against running applications. This approach simulates actual attacks without access to source code, revealing runtime-specific vulnerabilities—including misconfigurations and resource exhaustion issues—that SAST inherently misses. DAST remains language-independent, a crucial advantage in polyglot environments. Yet DAST applies later in the development cycle, after code has been committed and deployed to staging or production environments, making vulnerability remediation substantially more expensive. The method also tends to miss deeper code-level vulnerabilities that only manifest through careful static inspection.

The traditional recommendation combines both approaches strategically. Early-stage SAST catches code-level issues when fixes are cheap; pre-production DAST identifies runtime problems before users encounter them. A third approach, Runtime Application Self-Protection (RASP), embeds security directly into application runtime environments, offering real-time threat detection and prevention. Integrating SAST, DAST, and RASP into modern CI/CD pipelines creates comprehensive coverage—and now, AI and machine learning enhancement of these tools promises to reduce false positives while improving detection accuracy.

### Prompt Injection: A Novel Attack Vector for AI-Assisted Development

The emergence of sophisticated AI agents in development workflows has introduced a previously unknown vulnerability class: prompt injection attacks. Unlike traditional software vulnerabilities that exploit code logic flaws, prompt injection attacks manipulate the instructions and context fed to language models, causing them to behave contrary to their intended purpose.

GitHub Copilot provides a particularly instructive case study of this threat. *(Source: "Copilot RCE via Prompt Injection")* Researchers discovered that Copilot could be tricked through injected prompts embedded in source code, web pages, or GitHub issues to modify its own configuration files. The attack chain exploits a fundamental design flaw: Copilot possesses the ability to write to workspace files, including `.vscode/settings.json`, without requiring explicit user approval for each modification. An attacker can embed carefully crafted prompt injections that instruct Copilot to enable "YOLO mode" by adding `"chat.tools.autoApprove": true` to the settings. This experimental feature disables all user confirmations, allowing the agent to execute arbitrary shell commands, browse the web, and take unrestricted actions on the developer's machine. Once enabled, the attacker can execute a full remote code execution exploit, achieving complete system compromise.

The vulnerability demonstrates a recursive security problem: an AI system designed to enhance developer productivity can become a vector for compromising the very machine it operates on. The implications extend beyond a single user's machine. Threat actors could create "ZombAI" botnets by injecting commands that join compromised machines to attacker-controlled servers, develop AI viruses that propagate through infected Git repositories, or use invisible Unicode characters to evade human detection of malicious instructions embedded in visible code.

This vulnerability class highlights a critical insight: AI systems that can modify their own configuration and permissions create exponential security risks in agentic systems. *(Source: "Copilot RCE via Prompt Injection")*

### Agentic AI Threat Models: A Defense-in-Depth Imperative

As organizations deploy increasingly autonomous AI agents—systems designed to independently collect data and take actions toward specific objectives—new threat models emerge that transcend traditional application security concerns. Palo Alto Networks researchers tested nine attack scenarios against popular agentic AI frameworks (CrewAI and AutoGen) to characterize the vulnerability landscape. *(Source: "AI Agents Are Here So Are the Threats")*

The research identified six primary vulnerability categories, most arising from insecure design patterns and misconfigurations rather than inherent framework flaws. Prompt injection attacks represent the most obvious threat, allowing attackers to inject hidden instructions that manipulate agent behavior, extract sensitive information, or abuse integrated tools. Beyond direct prompt injection, insecure tool integration creates broad attack surfaces: poorly scoped or unsecured prompts enable exploitation even without explicit injection attacks, and misconfigured tools dramatically expand the potential damage.

Code interpreter risks emerge when agents possess unsecured code executors, exposing them to arbitrary code execution and unauthorized access to host resources and networks. Credential leakage—where exposed service tokens or secrets become accessible to agents—can enable impersonation, privilege escalation, or complete infrastructure compromise. The research demonstrated practical attacks including identifying participant agents through prompt manipulation, extracting agent instructions and tool schemas, accessing internal networks via SSRF-like attacks, exfiltrating sensitive data from mounted volumes, stealing cloud service tokens via metadata service exploitation, and conducting SQL injection or Broken Object Level Access (BOLA) attacks against integrated tools.

Crucially, researchers emphasized that "no single mitigation is sufficient. A layered, defense-in-depth strategy is necessary to effectively reduce risk in agentic applications." *(Source: "AI Agents Are Here So Are the Threats")* Recommended defenses include prompt hardening (explicitly prohibiting instruction disclosure and restricting agent scope), runtime content filtering to detect and block injection attempts, tool input sanitization to validate all inputs before execution, security scanning of tool dependencies, and sandboxing of code executors to restrict networking, mounted volumes, and system capabilities.

### The Paradox of AI Vulnerability Detection: Power and Unreliability

AI language models, particularly advanced reasoning models, have demonstrated remarkable capabilities for discovering previously unknown security vulnerabilities—yet they exhibit troubling non-determinism that undermines their reliability as security tools. This paradox defines the current state of AI-assisted vulnerability detection.

Semgrep's comprehensive evaluation of Claude Code and OpenAI Codex against eleven large Python web applications revealed the tension starkly. *(Source: "Finding Vulnerabilities in Modern Web Apps")* Claude Code identified 46 real vulnerabilities but at a 14% true positive rate—meaning 86% of reported findings were false positives. Codex performed marginally better with an 18% true positive rate, though absolute discovery numbers were lower at 21 real vulnerabilities. Both tools identified approximately 20 high-severity issues, suggesting genuine capability despite high false positive rates.

Performance varied dramatically across vulnerability categories, hinting at underlying model strengths and weaknesses. Claude Code excelled at Insecure Direct Object Reference (IDOR) detection with a 22% true positive rate but catastrophically failed at SQL injection detection (5% TPR). Context limitations emerged as a root cause: both tools struggled with tracing data flows across multiple files and functions—a capability fundamental to detecting injection vulnerabilities. Models frequently failed to recognize server-side sanitization and could not effectively track user input from its source to its dangerous sink.

Non-determinism proved to be a crisis. Identical prompts on the same codebase produced wildly different results across successive runs. One application yielded 3, 6, and 11 distinct findings across three consecutive scans. Researchers attributed this unpredictability to context compaction—a phenomenon related to "context rot," where performance degrades as LLMs process increasingly long input sequences. *(Source: "Finding Vulnerabilities in Modern Web Apps")*

Context rot, studied in depth by Chroma Research, reveals that large language models do not process context uniformly as input length increases. *(Source: "Context Rot")* Despite performing well on standard benchmarks like "Needle in a Haystack" (finding relevant information buried in long contexts), models demonstrate significant performance degradation on realistic tasks as context grows. When tested on conversational question-answering, models achieved substantially higher performance with focused prompts containing only relevant context compared to scenarios where irrelevant information forced simultaneous retrieval and reasoning. This finding has profound implications: context engineering—the careful construction of how information appears in prompts—matters as much as whether relevant information is present.

Despite these limitations, AI models have achieved genuine breakthroughs in vulnerability research. Security researcher Sean Heelan used OpenAI's o3 model to discover CVE-2025-37899, a use-after-free vulnerability in the Linux kernel's SMB implementation. *(Source: "How I Used o3 to Find CVE-2025-37899")* The vulnerability occurred in the SMB logoff command handler, where one worker thread could free memory while another thread still accessed it. While o3 generated substantial false positives, it discovered this novel critical issue while being tested on a larger codebase (~12,000 lines). Heelan notes that "LLMs have made a leap forward in their ability to reason about code" for vulnerability research, though they remain imperfect tools requiring human expert judgment.

### OWASP Top Ten: Foundational Security Principles in the AI Era

The OWASP Top 10 serves as foundational security awareness documentation for developers and organizations, representing broad consensus about the most critical security risks to web applications. *(Source: "OWASP Top Ten")* While the OWASP Top 10 was developed before the recent explosion of AI-assisted development, its core principles remain relevant—indeed, critical—as developers increasingly rely on AI tools.

The 2025 edition of OWASP Top 10, currently in development, reflects the industry's ongoing effort to identify and prioritize emerging threats. The project continues accepting vulnerability data from multiple sources through July 31, 2025, to ensure the 2025 rankings reflect current threat landscapes. *(Source: "OWASP Top Ten")* Understanding these foundational risks becomes more, not less, important when developers leverage AI code generation, because AI models trained on diverse, sometimes vulnerable code can inadvertently reproduce the very patterns OWASP seeks to eliminate.

### Integration and Synthesis: Building Secure AI-Powered Development Practices

The themes of this week converge around a central insight: AI has fundamentally changed the security landscape of software development, simultaneously democratizing security testing capabilities and introducing novel attack vectors. Traditional vulnerability detection tools (SAST, DAST, RASP) provide deterministic, though often incomplete, coverage of known vulnerability classes. AI-powered security analysis offers contextual reasoning capabilities and can discover novel vulnerabilities but suffers from non-determinism, high false positive rates, and context limitations that become more severe as codebases grow.

Organizations must adopt a hybrid approach. AI tools supplement—but do not replace—traditional security practices. Developers using AI code generation tools must maintain vigilance about prompt injection attacks and understand that AI-suggested code requires human security review. Security teams deploying AI-powered vulnerability detection must expect to run multiple passes with different prompts and configurations, manually validate findings, and maintain traditional tooling as verification layers.

The rise of agentic AI systems introduces threat models unknown to traditional application security. Defense-in-depth strategies must account for prompt injection, insecure tool integration, credential leakage, and code executor sandboxing. Context rot research reveals that security review quality degrades as context length increases—a concern for both AI tools analyzing large codebases and human reviewers processing verbose AI-generated findings.

Yet despite limitations, the trajectory is clear: AI models are demonstrating genuine capability to enhance human vulnerability researchers' effectiveness, discover novel vulnerabilities, and accelerate security analysis. Success requires understanding these tools as powerful but imperfect instruments requiring careful integration into comprehensive security systems.

---

## Lecture Topics

**Monday, October 27: AI QA, SAST, DAST, and Beyond**

This lecture covers the evolution of vulnerability detection from static and dynamic testing approaches to AI-powered security analysis. Topics include the strengths and limitations of SAST and DAST in traditional development workflows, integration of these approaches into CI/CD pipelines, and how AI and machine learning enhance detection accuracy while reducing false positives. The session explores practical implications of RASP technologies and considerations for building comprehensive security coverage in modern applications.

**Friday, October 31: Isaac Evans, CEO of Semgrep**

Guest speaker Isaac Evans, CEO of Semgrep, brings industry perspective on vulnerability detection at scale. Semgrep is a leading provider of static analysis and vulnerability detection tools, and Evans' insights will focus on how organizations can effectively integrate AI capabilities into security testing workflows while maintaining deterministic, reproducible results. The session examines best practices for threat modeling, tool selection, and building security teams in the age of AI-assisted development.

---

## Practical Takeaways

1. **Adopt a defense-in-depth approach to security testing.** No single tool—traditional or AI-powered—provides complete coverage. SAST catches code-level issues early; DAST verifies runtime behavior; AI tools offer contextual reasoning; human expert review validates conclusions.

2. **Be skeptical of AI-generated code security.** GitHub Copilot, Claude Code, and similar tools can introduce vulnerabilities through innocent suggestions and become attack vectors themselves if misconfigured. All AI-generated code requires security review before deployment.

3. **Understand prompt injection as a primary threat in agentic systems.** Any AI agent that can modify configuration files, execute commands, or access tools creates exponential security risks. Implement explicit prompt hardening, content filtering, and tool sandboxing.

4. **Account for context rot in security analysis.** When using AI tools for vulnerability detection, run multiple passes with different prompts and contexts. Understand that a single scan may provide false security; subsequent scans may identify critical issues missed in earlier passes.

5. **Use AI tools to enhance human expertise, not replace it.** Language models excel at contextual reasoning and can surface novel vulnerabilities, but they hallucinate and produce false positives at concerning rates. Expert human judgment remains essential for validating AI findings and making security decisions.

6. **Maintain reproducibility expectations for security tooling.** Unlike AI tools with inherent non-determinism, traditional SAST/DAST tools provide deterministic results. Consider layering AI analysis on top of traditional tools rather than replacing them entirely.

7. **Design agentic systems with sandboxing and minimal permissions.** Code executors should run in restricted environments with limited network access and mounted volumes. Tool integrations should be explicitly scoped and validated before execution.

8. **Remember that training data contamination affects AI detection capabilities.** Popular benchmark applications (WebGoat, OWASP Juice Shop) likely appear in model training data, potentially inflating reported accuracy. Evaluate tools on realistic, production-scale codebases.

---

## Key Terms & Definitions

**SAST (Static Application Security Testing):** White-box testing that analyzes application code without execution to detect vulnerabilities like cross-site scripting and buffer overflows during development.

**DAST (Dynamic Application Security Testing):** Black-box testing that evaluates running applications to identify runtime vulnerabilities and misconfigurations without requiring source code access.

**RASP (Runtime Application Self-Protection):** Security mechanisms embedded directly in application runtime environments that monitor behavior during execution and actively block malicious activities in real-time.

**Prompt Injection:** An attack technique where adversaries embed hidden instructions in data (source code, web pages, user input) to manipulate AI systems into performing unintended actions.

**Context Rot:** The phenomenon where language model performance degrades as input length increases, despite performing well on isolated benchmarks. Models do not process context uniformly across different lengths.

**Agentic AI System:** Software designed to autonomously collect data and take actions toward specific objectives, often with integration to external tools, APIs, and execution capabilities.

**False Positive:** A security finding reported by a tool that does not represent an actual vulnerability, requiring manual review to dismiss.

**True Positive Rate (TPR):** The percentage of reported findings that represent genuine vulnerabilities, calculated as correctly identified vulnerabilities divided by total reported findings.

**IDOR (Insecure Direct Object Reference):** A vulnerability where applications fail to properly verify user authorization, allowing attackers to access unauthorized resources by manipulating object identifiers.

**CVE (Common Vulnerabilities and Exposures):** A standardized identifier system for publicly disclosed cybersecurity vulnerabilities, enabling tracking and discussion across organizations.

**OWASP Top 10:** A consensus document ranking the most critical security risks to web applications, updated periodically to reflect emerging threats.

**Use-After-Free:** A memory corruption vulnerability where software accesses memory after it has been freed, potentially leading to information disclosure or code execution.

**Defense-in-Depth:** A security strategy employing multiple layers of defense mechanisms so that failure of any single layer does not compromise overall security.

---

## References

- Splunk. "SAST vs. DAST vs. RASP: Comparing Application Security Testing Methods." https://www.splunk.com/en_us/blog/learn/sast-vs-dast.html

- wunderwuzzi. "GitHub Copilot: Remote Code Execution via Prompt Injection (CVE-2025-53773)." EmbraceTheRed, August 12, 2025. https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/

- Chen, Jay, and Royce Lu. "AI Agents Are Here. So Are the Threats." Palo Alto Networks Unit 42, May 1, 2025. https://unit42.paloaltonetworks.com/agentic-ai-threats/

- Chroma. "Context Rot: How Increasing Input Tokens Impacts LLM Performance." https://www.trychroma.com/research/context-rot

- Semgrep Security Research Team. "Finding Vulnerabilities in Modern Web Apps Using Claude Code and OpenAI Codex." Semgrep Blog, 2025. https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/

- Heelan, Sean. "How I Used o3 to Find CVE-2025-37899: A Remote ZeroDay Vulnerability in the Linux Kernel's SMB Implementation." May 22, 2025. https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/

- OWASP. "OWASP Top Ten." https://owasp.org/www-project-top-ten/

- CS146S Course Assignment. "Writing Secure AI Code." GitHub. https://github.com/mihail911/modern-software-dev-assignments/blob/master/week6/assignment.md
