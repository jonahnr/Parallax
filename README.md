# Worker Safety Intelligence Digest

React + Vite prototype for a Parallax Data Lab worker-safety intelligence product. The app presents a weekly executive intelligence digest with dynamic slicers, leadership priorities, open-text concern detection, recovery signals, operational follow-up risks, and a sticky operational signal heatmap.

## Stack

- React 18
- Vite
- Tailwind CSS
- Simulated JSON-style operational intelligence data
- Pure JavaScript scoring/filtering utilities

## File Structure

```text
.
|-- README.md
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- vite.config.js
|-- assets/
|   `-- parallax-logo.svg
`-- src/
    |-- main.js
    |-- styles.css
    |-- data/
    |   `-- digestData.js
    `-- lib/
        `-- intelligence.js
```

## Source Of Truth

`src/` is the source of truth.

- `src/main.js`: React components and app state
- `src/data/digestData.js`: simulated operational safety intelligence data
- `src/lib/intelligence.js`: scoring, filtering, ranking, heatmap, and derived metric helpers
- `src/styles.css`: Tailwind entry and global base styles

`index.html` is now only the Vite app shell.

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Open:

```text
http://localhost:4173
```

## Production Build

```bash
npm run build
```

Preview the built app:

```bash
npm run preview
```

## GitHub Pages

Do not deploy the raw repository files from the branch root. A Vite app must be built first. If GitHub Pages serves the source `index.html` directly, the page will show the fallback loading message because the browser cannot resolve Vite-only imports.

You do not need Node.js installed locally if you use GitHub Actions. See `NO_NODE_DEPLOY.md`.

The Vite config uses:

```js
base: "./"
```

That makes the built `dist/` output work from a GitHub Pages project subpath.

Typical deployment flow:

```bash
npm install
npm run build
```

Then deploy the generated `dist/` folder to GitHub Pages.

This repo also includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. If GitHub Pages is configured to deploy from Actions, pushing to `main` will install dependencies, build the Vite app, upload `dist/`, and deploy it.

Recommended GitHub Pages settings:

```text
Settings -> Pages -> Build and deployment -> Source: GitHub Actions
```

Then push to `main` and wait for the `Deploy Vite app to GitHub Pages` action to complete.

## Interaction Model

The prototype data is deterministic. Values change only in response to:

- slicer changes
- signal clicks
- table sorting
- heatmap hover/focus detail

There are no timer-driven data changes.

## Current Intelligence Coverage

The simulated data includes:

- escalation response breakdowns
- corrective action backlog risk
- compliance deterioration and recovery
- assignment bottlenecks
- workflow participation drift
- open-text fatigue and frustration concerns
- near-miss narrative clusters
- contractor participation risk
- permit review backlog
- regional recovery signals

This is intended as a scalable product prototype, not a static dashboard screenshot.
