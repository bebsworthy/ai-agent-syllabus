import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://agents.mnbv.dev',

  integrations: [
    starlight({
      title: 'AI-Augmented Development Masterclass',
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
            {
              label: 'M01 — How LLMs Work',
              items: [
                { label: 'Study Guide', slug: 'tier-1/m01-how-llms-work' },
                { label: 'Workshop', slug: 'workshops/m01-workshop' },
              ],
            },
            {
              label: 'M02 — Prompt Engineering',
              items: [
                { label: 'Study Guide', slug: 'tier-1/m02-prompt-engineering' },
                { label: 'Workshop', slug: 'workshops/m02-workshop' },
              ],
            },
            {
              label: 'M03 — Specs Are Source Code',
              items: [
                { label: 'Study Guide', slug: 'tier-1/m03-specs-are-source-code' },
                { label: 'Workshop', slug: 'workshops/m03-workshop' },
              ],
            },
            {
              label: 'M04 — Context Engineering',
              items: [
                { label: 'Study Guide', slug: 'tier-1/m04-context-engineering' },
                { label: 'Workshop', slug: 'workshops/m04-workshop' },
              ],
            },
            {
              label: 'M05 — Agents and MCP',
              items: [
                { label: 'Study Guide', slug: 'tier-1/m05-agents-and-mcp' },
                { label: 'Workshop', slug: 'workshops/m05-workshop' },
              ],
            },
          ],
        },
        {
          label: 'Tier 2: Mastery',
          items: [
            { label: 'Overview', slug: 'tier-2' },
            {
              label: 'M06 — Tool Design',
              items: [
                { label: 'Study Guide', slug: 'tier-2/m06-tool-design' },
                { label: 'Workshop', slug: 'workshops/m06-workshop' },
              ],
            },
            {
              label: 'M07 — Advanced Workflows',
              items: [
                { label: 'Study Guide', slug: 'tier-2/m07-advanced-workflows' },
                { label: 'Workshop', slug: 'workshops/m07-workshop' },
              ],
            },
            {
              label: 'M08 — Security',
              items: [
                { label: 'Study Guide', slug: 'tier-2/m08-security' },
                { label: 'Workshop', slug: 'workshops/m08-workshop' },
              ],
            },
            {
              label: 'M09 — Code Review',
              items: [
                { label: 'Study Guide', slug: 'tier-2/m09-code-review' },
                { label: 'Workshop', slug: 'workshops/m09-workshop' },
              ],
            },
            {
              label: 'M10 — Agent Teams',
              items: [
                { label: 'Study Guide', slug: 'tier-2/m10-agent-teams' },
                { label: 'Workshop', slug: 'workshops/m10-workshop' },
              ],
            },
          ],
        },
        {
          label: 'Tier 3: Operations',
          items: [
            { label: 'Overview', slug: 'tier-3' },
            {
              label: 'M11 — Post-Deployment',
              items: [
                { label: 'Study Guide', slug: 'tier-3/m11-post-deployment' },
                { label: 'Workshop', slug: 'workshops/m11-workshop' },
              ],
            },
            {
              label: 'M12 — CI/CD Integration',
              items: [
                { label: 'Study Guide', slug: 'tier-3/m12-cicd-integration' },
                { label: 'Workshop', slug: 'workshops/m12-workshop' },
              ],
            },
            {
              label: 'M13 — Team Adoption',
              items: [
                { label: 'Study Guide', slug: 'tier-3/m13-team-adoption' },
                { label: 'Workshop', slug: 'workshops/m13-workshop' },
              ],
            },
            {
              label: "M14 — What's Next",
              items: [
                { label: 'Study Guide', slug: 'tier-3/m14-whats-next' },
                { label: 'Workshop', slug: 'workshops/m14-workshop' },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
