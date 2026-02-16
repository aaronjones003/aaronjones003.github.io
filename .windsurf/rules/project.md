---
description: Project-specific rules for aaronjones003.github.io
---

# aaronjones003.github.io — Project Rules

> Per-project rules for Windsurf. The root `.windsurf/rules/` also apply.

## Project Context

- **Type**: Static website (GitHub Pages)
- **Created**: 2026-02-15 (as submodule)
- **Purpose**: Personal site with AD&D 2E character sheets
- **Deployment**: Automatic on push to main branch

## Project-Specific Rules

- This is a static HTML/CSS/JS site — no build process required
- Main entry point: `index.html`
- Character sheet logic is in `adnd2e/sheet.js`
- Styling is primarily in `adnd2e/sheet.css`
- When making changes, test locally by opening files in browser
- Preserve the GitHub Pages deployment structure
- The `CNAME` file must remain unchanged (points to custom domain if configured)

## File Organization

- Root level: Landing page and navigation
- `adnd2e/`: Core character sheet assets
- `cleric/`: Class-specific implementations
- All assets should be relative paths for GitHub Pages compatibility
