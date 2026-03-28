# AI Agents Are Here. So Are the Threats.

**Source:** https://unit42.paloaltonetworks.com/agentic-ai-threats/

**Published:** May 1, 2025
**Authors:** Jay Chen, Royce Lu
**Category:** Malware, Threat Research

## Executive Summary

AI agents—software designed to autonomously collect data and take actions toward specific objectives—are increasingly prevalent in real-world applications. Researchers tested nine attack scenarios using CrewAI and AutoGen frameworks to demonstrate how threat actors can compromise these systems, resulting in information leakage, credential theft, tool exploitation, and remote code execution.

The analysis reveals that "most vulnerabilities and attack vectors are largely framework-agnostic, arising from insecure design patterns, misconfigurations and unsafe tool integrations, rather than flaws in the frameworks themselves."

## Key Findings

The research identifies six primary vulnerability categories:

**Prompt Injection Attacks:** Attackers can inject hidden instructions to manipulate agent behavior, extract sensitive information, or abuse integrated tools.

**Insecure Tool Integration:** Poorly scoped or unsecured prompts enable exploitation without explicit injections. Misconfigured tools significantly expand attack surface.

**Code Interpreter Risks:** Unsecured code executors expose agents to arbitrary code execution and unauthorized access to host resources and networks.

**Credential Leakage:** Exposed service tokens or secrets can lead to impersonation, privilege escalation, or infrastructure compromise.

**Defense Necessity:** "No single mitigation is sufficient. A layered, defense-in-depth strategy is necessary to effectively reduce risk in agentic applications."

## Nine Attack Scenarios

The research demonstrates practical attacks including:

1. **Identifying participant agents** through prompt manipulation
2. **Extracting agent instructions and tool schemas**
3. **Accessing internal networks** via SSRF-like attacks
4. **Exfiltrating sensitive data** from mounted volumes
5. **Stealing cloud service tokens** via metadata service exploitation
6. **SQL injection attacks** against database tools
7. **BOLA exploitation** to access unauthorized user data
8. **Indirect prompt injection** via compromised webpages

## Mitigation Strategies

Recommended defenses include:

- **Prompt hardening:** Explicitly prohibit instruction disclosure and restrict agent scope
- **Content filtering:** Detect and block injection attempts at runtime
- **Tool input sanitization:** Validate all tool inputs before execution
- **Tool security scanning:** Conduct SAST, DAST, and SCA assessments
- **Code executor sandboxing:** Restrict networking, mounted volumes, and system capabilities

The researchers emphasize that "securing AI agents requires more than ad hoc fixes. It demands a defense-in-depth strategy."
