# GitHub Pages Setup

This is a Vite app. GitHub Pages must deploy the built `dist/` output, not the raw source files.

## Recommended Setup

1. Push this repo to GitHub.
2. Go to `Settings -> Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to `main`.
5. Wait for the `Deploy Vite app to GitHub Pages` workflow to finish.

The workflow will:

```text
npm install
npm run build
deploy dist/
```

## Why A White Page Happens

If GitHub Pages is set to deploy from the branch root, it serves the Vite source `index.html` directly. That source file expects Vite to resolve React, CSS, and module imports. Without the Vite build step, the browser cannot load the app.

Use the GitHub Actions workflow or manually deploy `dist/`.
