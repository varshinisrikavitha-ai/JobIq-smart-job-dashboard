# Smart Job Search Dashboard

A modern job search dashboard built with React, TypeScript, and Tailwind CSS. Features include:
- Job listings, search, and filtering
- Persistent saved jobs
- Signal scoring and analytics
- Responsive, theme-aware UI (light/dark)

## Features
- Dashboard with job cards, stats, and insights
- Job details with quick actions and signal scoring
- Sign in / Sign up with role selection
- Fully responsive and accessible
- Custom theming with Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
```bash
npm install
# or
yarn install
```

### Development
```bash
npm run dev
# or
yarn dev
```

App will be available at `http://localhost:5173` by default.

### Build for Production
```bash
npm run build
# or
yarn build
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Project Structure
- `src/` — Main source code
  - `components/` — Reusable UI and dashboard components
  - `pages/` — Top-level pages (Dashboard, Login, Signup, etc.)
  - `context/` — App context providers
  - `hooks/` — Custom React hooks
  - `services/` — API and data services
  - `types/` — TypeScript types
  - `utils/` — Utility functions
- `index.html` — Main HTML entry
- `tailwind.config.js` — Tailwind CSS configuration
- `vite.config.ts` — Vite build config

## Theming
- Light and dark themes supported
- Custom gradients and color schemes for auth pages
- Easily adjustable via Tailwind and CSS variables

## License
MIT
"# JobIq-smart-job-dashboard" 
