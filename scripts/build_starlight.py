#!/usr/bin/env python3
"""Generate starlight/src/content/docs/tier-*/ from masterclass/ source files.

Run this before `npm run dev` or `npm run build` inside starlight/.
The starlight/src/content/docs/index.mdx is manually maintained; everything else is generated.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
MASTERCLASS = ROOT / "masterclass"
STARLIGHT_DOCS = ROOT / "starlight" / "src" / "content" / "docs"
WORKSHOPS_SRC = MASTERCLASS / "workshops"
WORKSHOPS_DEST = STARLIGHT_DOCS / "workshops"

TIER_DIRS = {
    "Tier 1 - Foundations": "tier-1",
    "Tier 2 - Mastery": "tier-2",
    "Tier 3 - Operations and Scale": "tier-3",
}

MODULE_DESC = {
    "m01-how-llms-work.md": "Transformer architecture, autoregression, hallucinations, and context windows — the mental model behind effective Claude Code use.",
    "m01-workshop.md": "Hands-on: install Claude Code, explore a real codebase, and build the habit of reviewing before executing.",
    "m02-prompt-engineering.md": "Zero-shot, few-shot, chain-of-thought, meta prompting, and RAG — plus model selection and effort levels.",
    "m02-workshop.md": "Side-by-side prompt comparison, model selection practice, and building your personal prompting cheat sheet.",
    "m03-specs-are-source-code.md": "Plan Mode, specification templates, and the paradigm shift from code-first to spec-first development.",
    "m03-workshop.md": "Write a real spec, run it through Plan Mode, and lock in requirements before a single line of code is written.",
    "m04-context-engineering.md": "The four failure modes of large contexts and how to prevent them with CLAUDE.md and the research-plan-implement workflow.",
    "m04-workshop.md": "Build and commit your project CLAUDE.md, practice context hygiene commands, and establish the three-phase workflow.",
    "m05-agents-and-mcp.md": "Agent architecture, MCP protocol, tool discovery, and why APIs don't make good MCP tools.",
    "m05-workshop.md": "Connect 2-3 MCP servers relevant to your team and observe how agents discover and select tools.",
    "m06-tool-design.md": "How to design purpose-built MCP tools: consolidation, agent-efficient formats, and clear descriptions.",
    "m06-workshop.md": "Build a custom TypeScript MCP server your team will actually use — from sketch to working deployment.",
    "m07-advanced-workflows.md": "Skills, subagents, and hooks — the workflow composition stack for team-wide automation.",
    "m07-workshop.md": "Build a team skill, a custom subagent, and a hook that auto-runs on every pull request.",
    "m08-security.md": "Prompt injection, OWASP Top Ten for LLM apps, context rot, and the three defense layers.",
    "m08-workshop.md": "Build a security-reviewer subagent and integrate pre-commit hooks that catch vulnerabilities before merge.",
    "m09-code-review.md": "Why code review matters more with AI, the Writer/Reviewer pattern, and the design judgment vs. style distinction.",
    "m09-workshop.md": "Build a /review skill with a structured checklist and practice the Writer/Reviewer pattern on a real PR.",
    "m10-agent-teams.md": "When Agent Teams add value versus simpler patterns, and token cost analysis for parallel orchestration.",
    "m10-workshop.md": "Enable experimental Agent Teams, run a real multi-component task, and develop your judgment on when to use them.",
    "m11-post-deployment.md": "SRE fundamentals, AI-augmented incident response, and multi-agent monitoring patterns.",
    "m11-workshop.md": "Connect Sentry MCP, build an incident investigation workflow, and practice AI-augmented root cause analysis.",
    "m12-cicd-integration.md": "Headless mode, pipeline patterns, batch operations, and plugin packaging for team distribution.",
    "m12-workshop.md": "Wire a GitHub Actions AI review step into your pipeline and package it as a reusable plugin.",
    "m13-team-adoption.md": "Permission modes, cost management, team dynamics, and the 'developer owns all code' principle.",
    "m13-workshop.md": "Create a shared CLAUDE.md, configure .mcp.json, set up cost monitoring, and draft your team's adoption playbook.",
    "m14-whats-next.md": "A transferable evaluation framework for AI tools and the evolving landscape of software development roles.",
    "m14-workshop.md": "Evaluate a new AI tool using the course frameworks and build your team's scoring scorecard.",
}


def source_to_dest(filename: str) -> str:
    """Convert a source filename to its docs destination filename."""
    if filename == "README.md":
        return "index.md"
    m = re.match(r"(M\d\d)-.*-workshop\.md$", filename, re.IGNORECASE)
    if m:
        return f"{m.group(1).lower()}-workshop.md"
    return filename.lower()


def fix_tier_prefixes(content: str) -> str:
    """Replace source tier directory names with Starlight docs directory names."""
    for tier_src, tier_dest in TIER_DIRS.items():
        content = content.replace(f"../{tier_src}/", f"../{tier_dest}/")
    return content


def fix_links(content: str) -> str:
    """Rewrite internal .md links to use the new docs filenames."""
    def replace_link(m):
        text, url = m.group(1), m.group(2)
        if url.startswith("http") or url.startswith("#"):
            return m.group(0)
        path = Path(url)

        # Handle subdirectory README links: ./M11-Post-Deployment/README.md
        if path.name == "README.md" and re.match(r"M\d\d-", path.parent.name, re.IGNORECASE):
            new_name = path.parent.name.lower() + ".md"
            grandparent = path.parent.parent
            gp_str = str(grandparent)
            new_url = new_name if gp_str in (".", "") else f"{gp_str}/{new_name}"
            new_url = new_url.lstrip("./").replace("\\", "/")
            return f"[{text}]({new_url})"

        new_name = source_to_dest(path.name)
        parent = path.parent
        new_url = str(parent / new_name) if str(parent) != "." else new_name
        new_url = new_url.replace("\\", "/")
        if text == path.name:
            text = new_name
        return f"[{text}]({new_url})"

    return re.sub(r'\[([^\]]*)\]\(([^)]+\.md[^)]*)\)', replace_link, content)


def remove_manual_nav(content: str) -> str:
    """Remove *Next: ...* footer lines (Starlight handles prev/next automatically)."""
    content = re.sub(r'^\*Next:.*\*\s*$\n?', '', content, flags=re.MULTILINE)
    return content


def fix_broken_links(content: str) -> str:
    """Replace unresolvable local links (PDFs) with plain text."""
    content = re.sub(r'\[([^\]]+)\]\([^)]*\.pdf\)', r'\1', content)
    return content


def convert_why_section(content: str) -> str:
    """Convert ## Why This Module Matters into a Starlight-compatible aside callout."""
    def replace_section(m: re.Match) -> str:
        body = m.group(1).rstrip()
        indented = "\n".join(
            "    " + line if line.strip() else ""
            for line in body.splitlines()
        )
        return f':::note[Why This Module Matters]\n\n{indented}\n\n:::\n\n'

    return re.sub(
        r'^## Why This Module Matters\s*\n\n(.*?)(?=\n^## |\n^---)',
        replace_section,
        content,
        flags=re.MULTILINE | re.DOTALL,
    )


def extract_title(content: str, fallback: str) -> str:
    m = re.search(r'^# (.+)$', content, re.MULTILINE)
    return m.group(1).strip() if m else fallback


def add_frontmatter(content: str, title: str, description: str) -> str:
    title_safe = title.replace('"', '\\"')
    desc_safe = description.replace('"', '\\"')
    fm = f'---\ntitle: "{title_safe}"\n'
    if description:
        fm += f'description: "{desc_safe}"\n'
    fm += '---\n\n'
    return fm + content


def process_file(src: Path, dest: Path) -> None:
    content = src.read_text(encoding="utf-8")

    content = fix_broken_links(content)
    content = fix_tier_prefixes(content)
    content = fix_links(content)
    content = remove_manual_nav(content)
    content = convert_why_section(content)

    title = extract_title(content, dest.stem)
    description = MODULE_DESC.get(dest.name, "")
    content = add_frontmatter(content, title, description)

    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(content, encoding="utf-8")
    print(f"  {src.name:50s} -> starlight/.../{dest.parent.name}/{dest.name}")


def main() -> None:
    print("Building starlight/src/content/docs/ from masterclass/ ...\n")
    errors = []

    for tier_src_name, tier_dest_name in TIER_DIRS.items():
        tier_src = MASTERCLASS / tier_src_name
        tier_dest = STARLIGHT_DOCS / tier_dest_name

        if not tier_src.exists():
            print(f"WARNING: source directory not found: {tier_src}", file=sys.stderr)
            continue

        print(f"{tier_src_name}  ->  starlight/.../docs/{tier_dest_name}/")

        for src_file in sorted(tier_src.glob("*.md")):
            dest_name = source_to_dest(src_file.name)
            dest_file = tier_dest / dest_name
            try:
                process_file(src_file, dest_file)
            except Exception as exc:
                errors.append(f"{src_file}: {exc}")

    # Workshops — flat directory
    print(f"\nworkshops/  ->  starlight/.../docs/workshops/")
    if WORKSHOPS_SRC.exists():
        for src_file in sorted(WORKSHOPS_SRC.glob("*.md")):
            dest_name = source_to_dest(src_file.name)
            dest_file = WORKSHOPS_DEST / dest_name
            try:
                process_file(src_file, dest_file)
            except Exception as exc:
                errors.append(f"{src_file}: {exc}")
    else:
        print(f"WARNING: workshops source not found: {WORKSHOPS_SRC}", file=sys.stderr)

    if errors:
        print("\nErrors:", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        sys.exit(1)

    print(f"\nDone. Run `cd starlight && npm run dev` to preview.")


if __name__ == "__main__":
    main()
