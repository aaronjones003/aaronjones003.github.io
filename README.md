# aaronjones003.github.io

> Modern personal website and portfolio built with Preact and Tailwind CSS.

## Overview

This is my personal website featuring:
- Portfolio of projects with links to live demos
- AD&D 2E character sheets and tools
- Modern, responsive design with smooth animations
- Built for performance and extensibility

## Tech Stack

- **Frontend**: Preact (lightweight React alternative)
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for fast development and building
- **Deployment**: GitHub Pages
- **Icons**: Lucide React

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the site locally.

## Build & Deploy

```bash
npm run build
npm run deploy
```

The `deploy` script builds the site and publishes it to GitHub Pages.

## Features

- **Responsive Design**: Mobile-first approach with breakpoints
- **Component Architecture**: Reusable components for maintainability
- **Routing**: Client-side routing for SPA experience
- **Extensible**: Easy to add new pages and projects
- **SEO Ready**: Proper meta tags and semantic HTML
- **Performance**: Lazy loading and code splitting

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── styles/        # CSS and Tailwind configuration
└── utils/         # Helper functions
```

## Adding New Content

1. **New Pages**: Add to `src/pages/` and update routing in `App.jsx`
2. **New Projects**: Update the projects data in `src/pages/Home.jsx` and `src/pages/Projects.jsx`
3. **New Components**: Add to `src/components/` and import where needed