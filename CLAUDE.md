# aaronjones003.github.io — Claude Code Rules

> Per-project rules for Claude Code. The root `.claude/CLAUDE.md` rules also apply.

## Project Context

- **Type**: Submodule (added 2026-02-15) — Modern personal website
- **Purpose**: Portfolio and personal website with AD&D tools
- **Remote**: https://github.com/aaronjones003/aaronjones003.github.io
- **Tech Stack**: Preact, Tailwind CSS, Vite, JavaScript/JSX

## Project-Specific Rules

- This is a modern SPA built with Preact (lightweight React alternative)
- Main entry point: `src/main.jsx`
- Styling uses Tailwind CSS with custom design system (see `tailwind.config.js`)
- Development server: `npm run dev` (http://localhost:3000)
- Build process: `npm run build`
- Deploy to GitHub Pages: `npm run deploy`
- The site includes legacy AD&D character sheets in `/adnd2e/` and `/cleric/`
- When adding new pages, update routing in `src/App.jsx`
- Use semantic HTML5 elements for accessibility
- Maintain mobile-first responsive design
- Use the established component patterns in `src/components/`

## File Organization

- `src/pages/` — Page components (Home, Projects, ADnD)
- `src/components/` — Reusable UI components (Header, Footer, etc.)
- `src/styles/` — CSS and Tailwind configuration
- `public/` — Static assets and favicon
- `adnd2e/`, `cleric/` — Legacy AD&D character sheets (preserved for compatibility)

## Design System

- Use Tailwind utility classes with the custom color palette
- Primary color: blue-600 (primary-600)
- Components use the `.card`, `.btn`, `.input` utility classes
- Maintain consistent spacing with section-padding and container classes
