# Deploy Without Installing Node.js Locally

You do not need Node.js on your computer to deploy this prototype.

GitHub Actions can install Node, build the Vite app, and deploy the generated `dist/` folder for you.

## Required GitHub Setting

In your GitHub repo:

1. Open `Settings`.
2. Open `Pages`.
3. Under `Build and deployment`, set `Source` to:

```text
GitHub Actions
```

4. Commit and push the repo to `main` or `master`.
5. Open the `Actions` tab.
6. Wait for `Deploy Vite app to GitHub Pages` to complete.
7. Open the Pages URL shown by the workflow.

## What The Workflow Does

The included workflow at `.github/workflows/deploy.yml` runs this on GitHub's servers:

```text
npm install
npm run build
deploy dist/
```

## Why The Fallback Message Appears

If you see the message saying the React prototype is loading from Vite source files, GitHub Pages is serving the raw repo instead of the built `dist/` folder.

That usually means Pages is still set to:

```text
Deploy from a branch
```

Change it to:

```text
GitHub Actions
```
