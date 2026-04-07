## Project

AI-Augmented Development Playbook — a curriculum teaching developers how to use Claude Code effectively. Published at https://agents.mnbv.dev. Source: https://github.com/bebsworthy/ai-agent-syllabus

## Commands

```bash
just install    # npm install in starlight/
just dev        # start Astro dev server (localhost:4321)
just build      # production build
just preview    # preview production build
```

All commands run inside `starlight/`.

## Architecture

**Content lives in `masterclass/`**, organized as:
- `bootcamp/` — 12 modules (b01–b12), the "Claude Code in a Day" track
- `tier-1/` through `tier-3/` — 14 deep-dive modules (M01–M14)
- `workshops/` — hands-on exercises for each module

**Site is built with Starlight (Astro)**. The `starlight/src/content/docs/` directories are **symlinks** pointing back to `masterclass/`. Edit content in `masterclass/`, never in `starlight/src/content/docs/`.

**Sidebar and site structure** are defined entirely in `starlight/astro.config.mjs` — not derived from the filesystem. Adding a new page requires updating that config.

**Styling**: Custom indigo color scheme in `starlight/src/styles/custom.css`. Uses standard Starlight components (`Card`, `CardGrid`, `LinkCard`) — no custom React/Astro components.

**Deployment**: GitHub Actions (`deploy-starlight.yml`) builds and deploys to GitHub Pages on push to `main`.

## Content conventions

- Modules use Starlight markdown with `:::note`, `:::tip`, `:::caution` directives
- Frontmatter requires `title`, `description`, and `sidebar` with `order` and `label`
- When referencing Claude Code slash commands, verify they exist — the bootcamp is used as a teaching reference and accuracy matters
- MkDocs config (`mkdocs.yml`, `Makefile`, `scripts/`) is legacy — ignore it
