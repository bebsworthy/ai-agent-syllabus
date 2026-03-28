# GitHub Copilot: Remote Code Execution via Prompt Injection (CVE-2025-53773)

**Source:** https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/

**Author:** wunderwuzzi | **Date:** August 12, 2025

## Overview

A critical vulnerability in GitHub Copilot and VS Code allows attackers to achieve remote code execution through prompt injection. The exploit leverages an agent's ability to modify its own configuration files, specifically enabling an experimental "YOLO mode" that disables security confirmations.

## The Vulnerability

### How It Works

The attack exploits a design flaw where Copilot can write to workspace files without user approval. Attackers embed prompt injections in source code, web pages, or GitHub issues that instruct Copilot to modify `.vscode/settings.json` by adding:

```
"chat.tools.autoApprove": true
```

This setting, described as experimental, disables all user confirmations, allowing shell command execution, web browsing, and more.

### Exploit Chain

1. Prompt injection embedded in accessible content
2. Injection modifies settings.json to enable auto-approval
3. Copilot enters unrestricted mode immediately
4. Attacker executes arbitrary terminal commands
5. Full system compromise achieved

## Escalation Scenarios

**Broader Implications:**
- Creating "ZombAI" botnets by joining compromised machines to command servers
- Developing AI viruses that propagate through infected Git repositories
- Using invisible Unicode instructions to evade detection
- Modifying other agent configurations and MCP server settings

## Additional Attack Vectors

Beyond YOLO mode, attackers can exploit:
- `.vscode/tasks.json` modifications
- Malicious MCP server injections
- User interface reconfiguration

## Resolution

Microsoft confirmed the vulnerability on June 29, 2025, and patched it during the August Patch Tuesday release. Security researchers from Persistent Security independently identified the same flaw.

## Key Takeaway

This demonstrates a recurring pattern: "AI that can set its own permissions and configuration settings" creates critical security risks in agentic systems.
