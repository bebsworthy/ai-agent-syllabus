import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';

export default defineConfig({
  site: 'https://agents.mnbv.dev',

  integrations: [
    starlight({
      plugins: [starlightClientMermaid()],
      title: 'AI-Augmented Development Playbook',
      description: 'Operationalizing Claude Code for professional teams — 14 modules across three tiers.',
      tagline: 'Operationalizing Claude Code for Professional Teams',

      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/bebsworthy/ai-agent-syllabus' },
      ],

      editLink: {
        baseUrl: 'https://github.com/bebsworthy/ai-agent-syllabus/tree/main/masterclass/',
      },

      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },

      customCss: ['./src/styles/custom.css'],

      sidebar: [
        {
          label: 'Claude Code in a Day',
          items: [
            { label: 'Overview', slug: 'bootcamp' },
            { label: '01 — Install and Explore', slug: 'bootcamp/b01-install-explore' },
            { label: '02 — Your CLAUDE.md', slug: 'bootcamp/b02-claude-md' },
            { label: '03 — Plan Before You Build', slug: 'bootcamp/b03-plan-mode' },
            { label: '04 — Context is Everything', slug: 'bootcamp/b04-context-and-models' },
            { label: '05 — Daily Workflows', slug: 'bootcamp/b05-daily-workflows' },
            { label: '06 — Research and Docs', slug: 'bootcamp/b06-research-and-docs' },
            { label: '07 — Don\'t Trust, Verify', slug: 'bootcamp/b07-dont-trust-verify' },
            { label: '08 — Build Your First Skill', slug: 'bootcamp/b08-first-skill' },
            { label: '09 — Connect Your Tools', slug: 'bootcamp/b09-mcp-connections' },
            { label: '10 — Hooks and Integration', slug: 'bootcamp/b10-hooks-and-integration' },
            { label: '11 — Everything Everywhere', slug: 'bootcamp/b11-everything-everywhere' },
            { label: '12 — Adversarial Agents', slug: 'bootcamp/b12-adversarial-agents' },
          ],
        },
        {
          label: 'Tier 1: Foundations',
          items: [
            { label: 'Overview', slug: 'tier-1' },
            { label: 'M01 — How LLMs Work', slug: 'tier-1/m01-how-llms-work' },
            { label: 'M02 — Prompt Engineering', slug: 'tier-1/m02-prompt-engineering' },
            { label: 'M03 — Specs Are Source Code', slug: 'tier-1/m03-specs-are-source-code' },
            { label: 'M04 — Context Engineering', slug: 'tier-1/m04-context-engineering' },
            { label: 'M05 — Agents and MCP', slug: 'tier-1/m05-agents-and-mcp' },
          ],
        },
        {
          label: 'Tier 2: Mastery',
          items: [
            { label: 'Overview', slug: 'tier-2' },
            { label: 'M06 — Tool Design', slug: 'tier-2/m06-tool-design' },
            { label: 'M07 — Advanced Workflows', slug: 'tier-2/m07-advanced-workflows' },
            { label: 'M08 — Security', slug: 'tier-2/m08-security' },
            { label: 'M09 — Code Review', slug: 'tier-2/m09-code-review' },
            { label: 'M10 — Agent Teams', slug: 'tier-2/m10-agent-teams' },
          ],
        },
        {
          label: 'Tier 3: Operations',
          items: [
            { label: 'Overview', slug: 'tier-3' },
            { label: 'M11 — Post-Deployment', slug: 'tier-3/m11-post-deployment' },
            { label: 'M12 — CI/CD Integration', slug: 'tier-3/m12-cicd-integration' },
            { label: 'M13 — Team Adoption', slug: 'tier-3/m13-team-adoption' },
            { label: "M14 — What's Next", slug: 'tier-3/m14-whats-next' },
          ],
        },
        { label: 'Changelog', slug: 'changelog' },
      ],
    }),
  ],
});
