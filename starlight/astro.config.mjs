import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://agents.mnbv.dev',

  integrations: [
    starlight({
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
