# Worker Safety Intelligence Digest

Premium live mockup for Parallax Data Lab showing an executive worker-safety intelligence digest. The experience is designed to feel like an operational intelligence product rather than a static dashboard or marketing graphic.

## What It Includes

- Branded Parallax Data Lab header and reporting period
- Dynamic slicers for region, business unit, workflow type, time range, impact, and review state
- Executive summary with adaptive "Top 3 Things to Know"
- Always-filled Top Leadership Attention Items table with related-priority backfill
- Sticky Operational Signal Heatmap with region-by-signal scoring
- Emerging risk patterns, open-text concern signals, operational recovery items, and follow-up risk metrics
- Review links and strategic executive callout

## Interaction Model

The mock data is deterministic and only changes in response to user interaction. There are no automatic timer-based data updates.

Supported interactions:

- Change slicers to update summary, table, lower digest cards, and highlighted heatmap context
- Select Workflow Type to focus leadership items without mutating unrelated heatmap values
- Hover heatmap cells to inspect signal detail
- Sort leadership table columns
- Click signal rows or lower-card rows to focus a workflow type

## File Structure

```text
.
├── README.md
├── index.html
├── package.json
├── server.mjs
├── styles.css
├── assets/
│   └── parallax-logo.svg
└── src/
    └── main.js
```

## Run Locally

Use the included static Node server:

```bash
npm start
```

Then open:

```text
http://localhost:4173
```

If the system `node` command is unavailable, run with the bundled Codex Node runtime:

```powershell
C:\Users\700001256\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe server.mjs
```

## Key Files

- `index.html`: App shell and stylesheet/script entry points
- `src/main.js`: Simulated intelligence data, filtering logic, heatmap behavior, rendering functions, and interaction handlers
- `styles.css`: Full visual system, layout, responsive behavior, sticky heatmap rail, and enterprise UI styling
- `assets/parallax-logo.svg`: Parallax Data Lab logo asset
- `server.mjs`: Small static file server for local preview
- `package.json`: Project metadata and start script

## Design Notes

The visual system uses the requested Parallax-inspired enterprise palette:

- Deep navy: `#0B1745`
- Insight blue: `#1F6AE5`
- Signal teal: `#16B5A3`
- Premium gold: `#F5B544`
- White typography with thin glass borders

The layout is intentionally closer to an executive weekly intelligence digest, with live operational controls and command-center behavior layered into the experience.
