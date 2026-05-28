const RUNTIME_CSS = String.raw`:root {
  color-scheme: dark;
  --navy: #0b1745;
  --navy-deep: #071033;
  --panel: rgba(13, 31, 83, 0.72);
  --panel-soft: rgba(255, 255, 255, 0.055);
  --blue: #1f6ae5;
  --teal: #16b5a3;
  --gold: #f5b544;
  --red: #ef4444;
  --orange: #f97316;
  --green: #16a34a;
  --ink: #ffffff;
  --muted: #aebce0;
  --line: rgba(255, 255, 255, 0.13);
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  margin: 0;
  color: var(--ink);
  background:
    radial-gradient(circle at 18% 4%, rgba(31, 106, 229, 0.22), transparent 34rem),
    radial-gradient(circle at 84% 0%, rgba(22, 181, 163, 0.12), transparent 26rem),
    linear-gradient(145deg, var(--navy-deep), var(--navy) 54%, #081239);
  overflow-x: hidden;
}

button,
select {
  font: inherit;
}

button {
  color: inherit;
}

svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.shell {
  width: min(1760px, calc(100% - 36px));
  margin: 0 auto;
  padding: 26px 0 42px;
}

.digest-header {
  display: grid;
  grid-template-columns: 270px minmax(340px, 1fr) 320px;
  gap: 30px;
  align-items: center;
  margin-bottom: 18px;
}

.brand-logo {
  width: 270px;
  height: auto;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 54px rgba(0, 0, 0, 0.22);
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--teal);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  font-size: clamp(2.2rem, 4vw, 4.6rem);
  line-height: 1.02;
  letter-spacing: 0;
}

h2 {
  color: var(--ink);
  font-size: 0.98rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.title-block p:last-child {
  margin-top: 10px;
  color: var(--muted);
  font-size: 1.1rem;
}

.period-card,
.section-card,
.meta-strip,
.slicer-bar {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: linear-gradient(145deg, var(--panel), rgba(9, 22, 63, 0.58));
  box-shadow: var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.period-card {
  display: grid;
  gap: 8px;
  padding: 18px;
}

.period-card span,
.period-card em,
.period-card b {
  color: var(--muted);
  font-size: 0.82rem;
  font-style: normal;
}

.period-card strong {
  font-size: 1.15rem;
}

.period-card b {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.period-card i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--teal);
  box-shadow: 0 0 18px var(--teal);
  animation: pulse 2.6s infinite;
}

.slicer-bar {
  display: grid;
  grid-template-columns: repeat(6, minmax(130px, 1fr));
  gap: 10px;
  margin-bottom: 14px;
  padding: 14px;
}

.slicer {
  display: grid;
  gap: 6px;
}

.slicer span {
  color: var(--muted);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

select {
  width: 100%;
  min-height: 40px;
  color: var(--ink);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 7px;
  background: #102461;
  padding: 0 10px;
  outline: none;
}

select:focus {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(22, 181, 163, 0.14);
}

.meta-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 14px;
  overflow: hidden;
}

.meta-strip article {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 9px 12px;
  align-items: center;
  padding: 16px;
  border-right: 1px solid var(--line);
}

.meta-strip article:last-child {
  border-right: 0;
}

.meta-strip svg {
  grid-row: span 3;
  width: 34px;
  height: 34px;
  color: var(--gold);
}

.meta-strip span,
.meta-strip em {
  color: var(--muted);
  font-size: 0.78rem;
  font-style: normal;
}

.meta-strip strong {
  font-size: 0.9rem;
}

.digest-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.48fr) minmax(360px, 0.72fr);
  gap: 14px;
  align-items: start;
}

.main-column {
  display: grid;
  gap: 14px;
}

.side-column {
  display: grid;
  gap: 14px;
  position: sticky;
  top: 16px;
  max-height: calc(100vh - 32px);
  overflow: auto;
  align-self: start;
  scrollbar-width: thin;
}

.section-card {
  position: relative;
  padding: 18px;
  overflow: hidden;
}

.attention {
  overflow-x: auto;
}

.section-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 44px rgba(31, 106, 229, 0.08);
}

.section-title {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  margin-bottom: 13px;
}

.section-title span {
  color: var(--gold);
  font-size: 0.78rem;
  font-weight: 800;
}

.executive h2,
.attention h2,
.mini-card h2,
.heatmap-card h2,
.architecture h2,
.review-links h2 {
  margin-bottom: 14px;
}

.executive-grid {
  display: grid;
  grid-template-columns: minmax(210px, 0.72fr) minmax(360px, 1.65fr) minmax(220px, 0.72fr);
  gap: 14px;
}

.safety-signal,
.things-card,
.direction-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
  padding: 16px;
}

.safety-signal {
  display: grid;
  place-items: center;
  text-align: center;
  min-height: 210px;
}

.safety-signal span,
.things-card > span,
.direction-card > span {
  color: var(--ink);
  font-size: 0.86rem;
  font-weight: 800;
}

.signal-row {
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: center;
  margin: 16px 0 8px;
}

.signal-row b {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--red);
  box-shadow: 0 0 34px rgba(239, 68, 68, 0.34);
  font-size: 2rem;
}

.safety-signal.high .signal-row b {
  background: var(--orange);
}

.safety-signal.medium .signal-row b {
  background: var(--gold);
  color: #171100;
}

.safety-signal.low .signal-row b {
  background: var(--green);
}

.signal-row strong {
  color: var(--red);
  font-size: 1.25rem;
}

.safety-signal.high .signal-row strong {
  color: var(--orange);
}

.safety-signal.medium .signal-row strong {
  color: var(--gold);
}

.safety-signal.low .signal-row strong {
  color: var(--teal);
}

.safety-signal em,
.things-card p,
.direction-card button,
.region-score,
.positive-row,
.mini-row,
.metric-row {
  color: var(--muted);
  font-style: normal;
  font-size: 0.86rem;
}

.safety-signal p {
  max-width: 190px;
  margin-top: 10px;
  line-height: 1.35;
}

.thing {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 12px;
  align-items: start;
  margin-top: 18px;
}

.thing b,
.rank {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #fff;
  background: var(--red);
  font-weight: 800;
}

.thing.recovery b {
  background: var(--green);
}

.thing.open-text b {
  background: var(--gold);
  color: #171100;
}

.thing p strong {
  display: block;
  color: var(--ink);
  margin-bottom: 3px;
}

.direction-card {
  display: grid;
  gap: 10px;
}

.direction-card button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
  padding: 8px 0;
  cursor: pointer;
}

.direction-card strong {
  color: var(--ink);
}

.direction-card b {
  color: var(--red);
  font-size: 1.3rem;
}

.direction-card b.down {
  color: var(--teal);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  padding: 13px 10px;
  text-align: left;
  vertical-align: middle;
  font-size: 0.84rem;
}

th button {
  width: 100%;
  color: var(--muted);
  border: 0;
  background: transparent;
  text-align: left;
  font-weight: 800;
  cursor: pointer;
}

tbody tr {
  transition: background 180ms ease, transform 180ms ease;
}

tbody tr:hover {
  background: rgba(31, 106, 229, 0.11);
}

.rank {
  width: 38px;
  height: 38px;
  background: var(--rank-color);
}

.pattern-cell {
  display: grid;
  grid-template-columns: 38px minmax(120px, 1fr);
  gap: 10px;
  align-items: center;
}

.pattern-cell em {
  grid-column: 2;
  color: var(--gold);
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
}

.pattern-cell strong,
.region-score strong,
.positive-row strong,
.mini-row strong,
.metric-row strong,
.score-block span {
  color: var(--ink);
}

.attention td > span {
  display: block;
  margin-top: 4px;
  color: var(--muted);
}

.empty-row {
  padding: 28px 10px;
  color: var(--muted);
  text-align: center;
}

.pattern-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: var(--muted);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.pattern-icon svg {
  width: 22px;
  height: 22px;
}

mark {
  display: inline-block;
  min-width: 72px;
  padding: 8px 10px;
  color: #fff;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.08);
  text-align: center;
}

mark.high {
  color: #fff;
  background: rgba(239, 68, 68, 0.28);
}

mark.medium {
  color: #1b1400;
  background: rgba(245, 181, 68, 0.88);
}

mark.low {
  color: #062519;
  background: rgba(22, 181, 163, 0.85);
}

.sparkline {
  display: block;
  width: 130px;
  height: 46px;
}

.review-button {
  min-width: 86px;
  border: 1px solid rgba(245, 181, 68, 0.5);
  border-radius: 7px;
  background: rgba(245, 181, 68, 0.08);
  color: var(--gold);
  padding: 8px 10px;
  cursor: pointer;
}

.lower-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.mini-card {
  display: grid;
  align-content: start;
  gap: 10px;
}

.mini-row,
.metric-row,
.positive-row,
.region-score {
  display: grid;
  gap: 10px;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  padding: 12px;
}

.mini-row {
  grid-template-columns: 38px 1fr;
  text-align: left;
  cursor: pointer;
}

.mini-row,
.direction-card button,
.heat-cell,
.review-grid button,
.flow-stage {
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
}

.mini-row:hover,
.direction-card button:hover,
.heat-cell:hover,
.review-grid button:hover,
.flow-stage:hover,
.review-button:hover {
  transform: translateY(-2px);
  border-color: rgba(22, 181, 163, 0.5);
  background: rgba(31, 106, 229, 0.15);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.2);
}

.mini-row em,
.metric-row em,
.positive-row em,
.region-score em {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-style: normal;
}

.open-text-row .pattern-icon {
  color: var(--gold);
  border-color: rgba(245, 181, 68, 0.35);
  background: rgba(245, 181, 68, 0.1);
}

.metric-row {
  grid-template-columns: minmax(0, 1fr) minmax(82px, 108px);
}

.metric-row .sparkline {
  width: 100%;
  min-width: 0;
}

.metric-row b,
.score-block strong {
  display: block;
  margin-top: 4px;
  color: var(--ink);
  font-size: 1.55rem;
}

.score-block {
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
}

.compact-score {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 12px;
  align-items: center;
}

.compact-score strong {
  grid-row: span 2;
}

.score-block em {
  color: var(--red);
  font-style: normal;
}

.region-score {
  grid-template-columns: 1fr auto auto;
}

.positive-row {
  grid-template-columns: 38px 1fr;
}

.positive-row svg {
  width: 32px;
  height: 32px;
  color: var(--teal);
}

.heatmap-card {
  position: sticky;
  top: 16px;
  z-index: 4;
  width: 100%;
  overflow-x: auto;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: 88px repeat(6, minmax(46px, 1fr));
  gap: 7px;
  align-items: stretch;
}

.heatmap-grid > strong,
.heatmap-grid > b {
  color: var(--muted);
  font-size: 0.72rem;
  text-align: center;
}

.heatmap-grid > b {
  display: grid;
  align-items: center;
  justify-content: start;
  color: var(--ink);
  text-align: left;
}

.heat-cell {
  display: grid;
  place-items: center;
  min-height: 54px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  cursor: pointer;
}

.heat-cell span {
  font-weight: 900;
}

.heat-cell.low {
  background: rgba(22, 163, 74, 0.2);
}

.heat-cell.medium {
  background: rgba(245, 181, 68, 0.25);
}

.heat-cell.high {
  background: rgba(249, 115, 22, 0.34);
}

.heat-cell.critical {
  background: rgba(239, 68, 68, 0.42);
  box-shadow: 0 0 24px rgba(239, 68, 68, 0.2);
}

.heat-cell.active {
  outline: 2px solid var(--teal);
  box-shadow: 0 0 22px rgba(22, 181, 163, 0.22);
}

.heat-detail {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
}

dl {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 12px;
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 0.82rem;
}

dd {
  margin: 0;
  color: var(--ink);
  font-weight: 800;
}

.architecture {
  display: grid;
  gap: 10px;
}

.flow-stage {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 7px 12px;
  align-items: center;
  min-height: 86px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
  padding: 12px;
  text-align: left;
  cursor: pointer;
}

.flow-stage span {
  grid-row: span 2;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: var(--teal);
  border: 1px solid rgba(22, 181, 163, 0.24);
  border-radius: 8px;
  background: rgba(22, 181, 163, 0.08);
  font-weight: 900;
}

.flow-stage em {
  color: var(--muted);
  font-style: normal;
  font-size: 0.8rem;
  line-height: 1.4;
}

.review-links {
  margin-top: 14px;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(130px, 1fr));
  gap: 10px;
}

.review-grid button {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  align-items: center;
  min-height: 82px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
  padding: 12px;
  text-align: left;
  cursor: pointer;
}

.review-grid svg {
  width: 30px;
  height: 30px;
  color: var(--gold);
}

.review-grid strong,
.review-grid span {
  display: block;
}

.review-grid em {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-style: normal;
}

.review-links footer {
  display: grid;
  grid-template-columns: 34px 1fr 1fr;
  gap: 14px;
  align-items: center;
  margin-top: 12px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
}

.review-links footer svg {
  width: 30px;
  height: 30px;
  color: var(--muted);
}

.review-links footer p {
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.4;
}

.review-links footer strong {
  display: block;
  color: var(--ink);
  margin-bottom: 3px;
}

blockquote {
  margin: 16px 0 0;
  padding: 18px;
  border-left: 3px solid var(--gold);
  color: var(--ink);
  font-size: clamp(1.35rem, 2vw, 2.3rem);
  font-weight: 900;
  line-height: 1.12;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.65;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.12);
  }
}

@media (max-width: 1400px) {
  .digest-header {
    grid-template-columns: 250px 1fr;
  }

  .period-card {
    grid-column: 1 / -1;
    grid-template-columns: repeat(4, auto);
    align-items: center;
  }

  .slicer-bar,
  .meta-strip {
    grid-template-columns: repeat(3, 1fr);
  }

  .meta-strip article {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

}

@media (max-width: 900px) {
  .digest-layout {
    grid-template-columns: 1fr;
  }

  .heatmap-card {
    position: sticky;
    top: 12px;
  }

  .side-column {
    grid-template-columns: minmax(0, 1fr) minmax(340px, 0.8fr);
    position: relative;
    top: auto;
    max-height: none;
    overflow: visible;
  }
}

@media (max-width: 1000px) {
  .digest-header,
  .executive-grid,
  .lower-grid,
  .review-links footer {
    grid-template-columns: 1fr;
  }

  .brand-logo {
    width: min(300px, 100%);
  }

  .lower-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .review-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  table {
    min-width: 980px;
  }
}

@media (max-width: 720px) {
  .shell {
    width: min(100% - 22px, 620px);
    padding-top: 16px;
  }

  .period-card,
  .slicer-bar,
  .meta-strip,
  .lower-grid,
  .review-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2.45rem;
  }

  .heatmap-grid {
    grid-template-columns: 74px repeat(6, minmax(42px, 1fr));
    gap: 5px;
    min-width: 390px;
  }

  .heat-cell {
    min-height: 46px;
  }
}
`;
function ensureRuntimeStyles() {
  if (document.querySelector('style[data-runtime-source="styles.css"]')) return;
  const style = document.createElement('style');
  style.dataset.runtimeSource = 'styles.css';
  style.textContent = RUNTIME_CSS;
  document.head.appendChild(style);
}
ensureRuntimeStyles();
const SIGNALS = ["Escalations", "Actions / CA", "Assignments", "Workflows", "Compliance", "Open Text"];
const REGIONS = ["All Regions", "West Region", "South Region", "Central Region", "North Region"];
const DIVISIONS = ["All Divisions", "Manufacturing", "Logistics", "Maintenance", "Field Ops"];
const TIME_RANGES = ["Current Week", "Prior 7 Days", "4-Week Rolling", "Quarter to Date"];
const IMPACTS = ["All Impact", "High", "Medium", "Low"];
const REVIEW_STATES = ["All Review States", "Needs Review", "In Progress", "Assigned"];

const DATA = {
  patterns: [
    {
      id: 1,
      pattern: "Escalation Response Breakdown",
      region: "West Region",
      division: "Manufacturing",
      signal: "Escalations",
      why: "Escalation volume is rising while closure rate is declining. Aging escalations over 7 days increased 31%.",
      impact: "High",
      review: "Needs Review",
      score: 94,
      trend: [42, 48, 46, 57, 63, 75, 68, 59, 71, 77],
      direction: "up",
      color: "#EF4444"
    },
    {
      id: 2,
      pattern: "Corrective Action Backlog Risk",
      region: "South Region",
      division: "Maintenance",
      signal: "Actions / CA",
      why: "Corrective action backlog grew 23%. Overdue actions older than 30 days increased 27%.",
      impact: "High",
      review: "Needs Review",
      score: 88,
      trend: [36, 43, 41, 51, 64, 72, 66, 55, 62, 70],
      direction: "up",
      color: "#F97316"
    },
    {
      id: 3,
      pattern: "Compliance Instability",
      region: "Central Region",
      division: "Logistics",
      signal: "Compliance",
      why: "Compliance scores declined 6 points. High-risk workflow activity increased 14%.",
      impact: "Medium",
      review: "In Progress",
      score: 77,
      trend: [51, 55, 57, 61, 66, 60, 68, 56, 64, 78],
      direction: "down",
      color: "#F5B544"
    },
    {
      id: 4,
      pattern: "Assignment Bottleneck",
      region: "All Regions",
      division: "Field Ops",
      signal: "Assignments",
      why: "Assignments aging over 7 days increased 19%. Three users have more than 75 open assignments.",
      impact: "Medium",
      review: "Assigned",
      score: 73,
      trend: [46, 49, 53, 55, 58, 62, 57, 52, 61, 74],
      direction: "up",
      color: "#7C3AED"
    },
    {
      id: 5,
      pattern: "Operational Recovery",
      region: "North Region",
      division: "Manufacturing",
      signal: "Actions / CA",
      why: "Corrective actions closed increased 16%. Escalation closure rate improved 9%.",
      impact: "Low",
      review: "In Progress",
      score: 42,
      trend: [34, 38, 41, 39, 46, 54, 47, 52, 61, 67],
      direction: "recovery",
      color: "#16A34A"
    },
    {
      id: 6,
      pattern: "Workflow Engagement Drop",
      region: "Central Region",
      division: "Logistics",
      signal: "Workflows",
      why: "Permit and observation workflow participation dropped below threshold at 6 monitored sites.",
      impact: "High",
      review: "Needs Review",
      score: 86,
      trend: [64, 59, 57, 51, 48, 44, 39, 42, 36, 34],
      direction: "down",
      color: "#1F6AE5"
    },
    {
      id: 7,
      pattern: "Open Text Fatigue Concern",
      region: "West Region",
      division: "Manufacturing",
      signal: "Open Text",
      why: "Free-text observations mention fatigue, overtime compression, and missed rest windows 24% more often than baseline.",
      impact: "High",
      review: "Needs Review",
      score: 91,
      trend: [38, 45, 52, 58, 61, 69, 73, 79, 82, 88],
      direction: "up",
      color: "#EF4444"
    },
    {
      id: 8,
      pattern: "Supervisor Review Cadence Recovery",
      region: "South Region",
      division: "Maintenance",
      signal: "Workflows",
      why: "Supervisor review participation improved 18% after targeted huddles, reducing late intervention queue growth.",
      impact: "Low",
      review: "In Progress",
      score: 39,
      trend: [42, 45, 49, 52, 57, 61, 66, 70, 73, 78],
      direction: "recovery",
      color: "#16A34A"
    },
    {
      id: 9,
      pattern: "Lockout Verification Language Spike",
      region: "Central Region",
      division: "Maintenance",
      signal: "Open Text",
      why: "Narratives show repeated uncertainty around lockout verification language in maintenance work orders.",
      impact: "High",
      review: "Needs Review",
      score: 89,
      trend: [41, 46, 54, 51, 63, 69, 75, 72, 83, 87],
      direction: "up",
      color: "#EF4444"
    },
    {
      id: 10,
      pattern: "Training Completion Drift",
      region: "North Region",
      division: "Field Ops",
      signal: "Assignments",
      why: "Critical safety training assignments are aging past expected completion windows in two field teams.",
      impact: "Medium",
      review: "Assigned",
      score: 74,
      trend: [46, 50, 49, 55, 58, 63, 59, 67, 70, 74],
      direction: "up",
      color: "#7C3AED"
    },
    {
      id: 11,
      pattern: "Permit Participation Recovery",
      region: "West Region",
      division: "Logistics",
      signal: "Compliance",
      why: "Permit participation moved back above threshold at three logistics sites after targeted manager review.",
      impact: "Low",
      review: "In Progress",
      score: 44,
      trend: [31, 34, 39, 42, 48, 53, 58, 64, 70, 76],
      direction: "recovery",
      color: "#16A34A"
    },
    {
      id: 12,
      pattern: "Repeat Hazard Narrative Cluster",
      region: "South Region",
      division: "Manufacturing",
      signal: "Open Text",
      why: "Operator comments repeatedly reference recurring pinch-point hazards around staging and material handoff.",
      impact: "Medium",
      review: "Needs Review",
      score: 78,
      trend: [44, 48, 52, 56, 53, 61, 66, 64, 70, 73],
      direction: "up",
      color: "#F5B544"
    },
    {
      id: 13,
      pattern: "Incident Review Closure Drag",
      region: "Central Region",
      division: "Field Ops",
      signal: "Escalations",
      why: "Incident review escalations are moving slower than baseline, with closure cycle time up 21%.",
      impact: "High",
      review: "Assigned",
      score: 84,
      trend: [50, 54, 58, 61, 67, 64, 72, 76, 74, 82],
      direction: "up",
      color: "#EF4444"
    },
    {
      id: 14,
      pattern: "Corrective Action Quality Recovery",
      region: "North Region",
      division: "Maintenance",
      signal: "Actions / CA",
      why: "Reopened corrective actions decreased 13%, indicating stronger closure quality in maintenance follow-ups.",
      impact: "Low",
      review: "In Progress",
      score: 36,
      trend: [36, 39, 43, 48, 52, 57, 62, 68, 73, 80],
      direction: "recovery",
      color: "#16A34A"
    },
    {
      id: 15,
      pattern: "Behavioral Frustration Signal",
      region: "West Region",
      division: "Field Ops",
      signal: "Open Text",
      why: "Open comments show rising frustration language tied to delayed approvals and repeated rework loops.",
      impact: "Medium",
      review: "Needs Review",
      score: 81,
      trend: [39, 44, 47, 55, 60, 58, 66, 71, 75, 82],
      direction: "up",
      color: "#F5B544"
    },
    {
      id: 16,
      pattern: "Observation Quality Improvement",
      region: "Central Region",
      division: "Logistics",
      signal: "Workflows",
      why: "Observation narratives became more specific, increasing actionable findings while reducing duplicate reviews.",
      impact: "Low",
      review: "In Progress",
      score: 41,
      trend: [33, 37, 42, 45, 51, 55, 60, 65, 69, 74],
      direction: "recovery",
      color: "#16A34A"
    }
  ],
  emerging: [
    ["High severity escalations increasing in Manufacturing", "Up 22% vs. prior week", "Escalations"],
    ["Repeat hazards related to equipment access", "Up 17% vs. prior week", "Actions / CA"],
    ["Workflow engagement declining in 3 regions", "Up 12% vs. prior week", "Workflows"],
    ["New escalation volume spike in Central Region", "Up 15% vs. prior week", "Escalations"]
  ],
  followUp: [
    ["Overdue Corrective Actions", "342", "+23%", [34, 40, 42, 39, 45, 41, 55, 48, 53]],
    ["Actions Overdue (>7 Days)", "1,128", "+18%", [41, 45, 49, 48, 55, 52, 62, 58, 66]],
    ["Assignments Aging (>7 Days)", "2,047", "+19%", [35, 39, 46, 44, 51, 53, 61, 55, 59]],
    ["Escalations Aging (>7 Days)", "276", "+31%", [48, 51, 55, 50, 58, 52, 67, 59, 63]]
  ],
  positive: [
    ["Corrective actions closed increased", "Up 16% vs. prior week"],
    ["Escalation closure rate improved", "Up 9% vs. prior week"],
    ["Overdue actions decreased in North Region", "Down 14% vs. prior week"]
  ]
};

const state = {
  region: "All Regions",
  division: "All Divisions",
  timeRange: "Current Week",
  impact: "All Impact",
  review: "All Review States",
  selectedSignal: "All Signals",
  sortKey: "score",
  sortDir: -1,
  tick: 0,
  hoverCell: null
};

const app = document.querySelector("#app");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function motion(index = 0) {
  return Math.round(Math.sin((state.tick + index) / 2.1) * 4);
}

function activePatterns() {
  let rows = scoredPatterns();

  if (state.region !== "All Regions") {
    rows = rows.filter((item) => item.region === state.region || item.region === "All Regions");
  }
  if (state.division !== "All Divisions") {
    rows = rows.filter((item) => item.division === state.division);
  }
  if (state.impact !== "All Impact") {
    rows = rows.filter((item) => item.impact === state.impact);
  }
  if (state.review !== "All Review States") {
    rows = rows.filter((item) => item.review === state.review);
  }
  if (state.selectedSignal !== "All Signals") {
    rows = rows.filter((item) => item.signal === state.selectedSignal);
  }

  return rows.sort((a, b) => compare(a[state.sortKey], b[state.sortKey]) * state.sortDir);
}

function scoredPatterns() {
  const rangeBoost = {
    "Current Week": 0,
    "Prior 7 Days": -3,
    "4-Week Rolling": 4,
    "Quarter to Date": 7
  }[state.timeRange] || 0;

  return DATA.patterns.map((item, index) => ({
    ...item,
    score: clamp(item.score + rangeBoost + motion(index), 28, 98),
    delta: item.direction === "recovery" ? -clamp(6 + motion(index), 3, 14) : clamp(8 + motion(index), 2, 34)
  }));
}

function contextPatterns({ ignoreSignal = false, ignoreImpact = false, ignoreReview = false } = {}) {
  let rows = scoredPatterns();
  if (state.region !== "All Regions") {
    rows = rows.filter((item) => item.region === state.region || item.region === "All Regions");
  }
  if (state.division !== "All Divisions") {
    rows = rows.filter((item) => item.division === state.division);
  }
  if (!ignoreImpact && state.impact !== "All Impact") {
    rows = rows.filter((item) => item.impact === state.impact);
  }
  if (!ignoreReview && state.review !== "All Review States") {
    rows = rows.filter((item) => item.review === state.review);
  }
  if (!ignoreSignal && state.selectedSignal !== "All Signals") {
    rows = rows.filter((item) => item.signal === state.selectedSignal);
  }

  return rows.sort((a, b) => b.score - a.score);
}

function compare(a, b) {
  if (a === b) return 0;
  return a > b ? 1 : -1;
}

function overallSignal() {
  const rows = activePatterns();
  const average = rows.length ? rows.reduce((sum, item) => sum + item.score, 0) / rows.length : 68;
  return Math.round(clamp(average + motion(3), 35, 96));
}

function signalState(score) {
  if (score >= 84) return ["Deteriorating", "critical"];
  if (score >= 70) return ["Elevated", "high"];
  if (score >= 55) return ["Mixed", "medium"];
  return ["Recovering", "low"];
}

function filterOptions(label, key, options) {
  return `<label class="slicer">
    <span>${label}</span>
    <select data-filter="${key}">
      ${options.map((option) => `<option value="${option}" ${state[key] === option ? "selected" : ""}>${option}</option>`).join("")}
    </select>
  </label>`;
}

function icon(name) {
  const paths = {
    user: "M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    scope: "M4 21V7m0 0h7v14m-7-14 7-4v18m4 0V9h5v12M2 21h20",
    refresh: "M20 12a8 8 0 0 1-14 5m-2-5a8 8 0 0 1 14-5M7 17H3v4m14-14h4V3",
    bars: "M5 20V9m7 11V4m7 16v-7",
    trend: "M4 17 9 12l4 4 7-9m0 0h-5m5 0v5",
    alert: "M12 3 2 21h20L12 3Zm0 7v5m0 3h.01",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2",
    group: "M16 21v-2a4 4 0 0 0-8 0v2m4-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6 10v-2a3 3 0 0 0-2-2.8m2-8.4a3 3 0 0 1 0 5.6",
    check: "M20 6 9 17l-5-5",
    map: "M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6Zm5-2v14m6-12v14",
    mail: "M4 6h16v12H4V6Zm0 0 8 7 8-7",
    bot: "M12 5V3m-6 8a6 6 0 0 1 12 0v6H6v-6Zm3 2h.01M15 13h.01M9 21h6",
    portal: "M4 5h16v14H4V5Zm4 4h8M8 13h5",
    report: "M6 3h9l3 3v15H6V3Zm8 0v4h4M9 12h6M9 16h6",
    action: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]}"/></svg>`;
}

function sparkline(values, color) {
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - value}`).join(" ");
  return `<svg class="sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    ${values.map((value, index) => `<circle cx="${(index / (values.length - 1)) * 100}" cy="${100 - value}" r="1.8" fill="${color}"/>`).join("")}
  </svg>`;
}

function heatValue(region, signal) {
  const rows = DATA.patterns.filter((item) => (region === "All Regions" || item.region === region || item.region === "All Regions") && item.signal === signal);
  const rangeBoost = {
    "Current Week": 0,
    "Prior 7 Days": -3,
    "4-Week Rolling": 4,
    "Quarter to Date": 7
  }[state.timeRange] || 0;
  const fallback = 46 + ((region.length * 7 + signal.length * 5 + state.timeRange.length) % 28);
  return clamp(rows.length ? Math.round(rows.reduce((sum, item) => sum + item.score, 0) / rows.length + rangeBoost) : fallback, 30, 98);
}

function render() {
  const score = overallSignal();
  const [label, level] = signalState(score);
  const rows = activePatterns();

  app.innerHTML = `
    <section class="shell">
      <header class="digest-header">
        <img class="brand-logo" src="./assets/parallax-logo.svg" alt="Parallax Data Lab" style="width:min(300px,100%);height:auto;" />
        <div class="title-block">
          <p class="eyebrow">Live Intelligence Digest Experience</p>
          <h1>Weekly Safety Intelligence Digest</h1>
          <p>What deserves leadership attention this week, and why.</p>
        </div>
        <aside class="period-card">
          <span>Reporting Period</span>
          <strong>May 5 - May 11, 2025</strong>
          <em>Generated: May 12, 2025 12:00 AM</em>
          <b><i></i> AI Intelligence Active</b>
        </aside>
      </header>

      ${renderSlicers()}
      ${renderMetaStrip()}

      <section class="digest-layout">
        <div class="main-column">
          ${renderExecutiveSummary(score, label, level, rows)}
          ${renderAttentionTable(rows)}
          ${renderLowerDigest(rows)}
        </div>
        <aside class="side-column">
          ${renderHeatmap()}
          ${renderArchitecture()}
        </aside>
      </section>

      ${renderDeliveryLayer()}
    </section>`;

  bindEvents();
}

function renderSlicers() {
  return `<section class="slicer-bar">
    ${filterOptions("Region", "region", REGIONS)}
    ${filterOptions("Business Unit", "division", DIVISIONS)}
    ${filterOptions("Workflow Type", "selectedSignal", ["All Signals", ...SIGNALS])}
    ${filterOptions("Time Range", "timeRange", TIME_RANGES)}
    ${filterOptions("Impact", "impact", IMPACTS)}
    ${filterOptions("Review State", "review", REVIEW_STATES)}
  </section>`;
}

function renderMetaStrip() {
  const items = [
    ["user", "Prepared for", "VP, Safety Operations", state.division],
    ["scope", "Scope", state.division, state.region],
    ["refresh", "Data Refresh", "May 11, 2025 11:45 PM", "Live simulation"],
    ["bars", "Compared To", "Apr 28 - May 4, 2025", "Prior 7 Days"],
    ["trend", "Baseline", "4-Week Rolling", "+ Prior 30 Days"]
  ];

  return `<section class="meta-strip">
    ${items.map(([name, label, primary, secondary]) => `<article>
      ${icon(name)}
      <span>${label}</span>
      <strong>${primary}</strong>
      <em>${secondary}</em>
    </article>`).join("")}
  </section>`;
}

function renderExecutiveSummary(score, label, level, rows) {
  const top = topThings(rows);
  const topMarkup = top.length
    ? top.map((item, index) => `<div class="thing ${item.kind || ""}">
          <b>${index + 1}</b>
          <p><strong>${item.pattern}</strong>${item.why}</p>
        </div>`).join("")
    : `<div class="thing">
          <b>0</b>
          <p><strong>No matching critical patterns</strong>Adjust filters or review the heatmap for broader signal movement.</p>
        </div>`;
  const directions = SIGNALS.map((signal) => {
    const value = heatValue(state.region, signal);
    return [signal, value >= 68 ? "up" : "down"];
  });

  return `<section class="section-card executive">
    <h2>1. Executive Summary</h2>
    <div class="executive-grid">
      <article class="safety-signal ${level}">
        <span>Overall Safety Signal</span>
        <div class="signal-row"><b>!</b><strong>${label}</strong></div>
        <em>vs. prior week</em>
        <p>${level === "low" ? "Improving across key signal areas" : `Worsening across ${clamp(Math.round(score / 12), 3, 9)} of 9 key signal areas`}</p>
      </article>
      <article class="things-card">
        <span>Top 3 Things to Know</span>
        ${topMarkup}
      </article>
      <article class="direction-card">
        <span>Key Signal Direction</span>
        ${directions.map(([signal, direction]) => `<button data-signal="${signal}">
          <strong>${signal}</strong><b class="${direction}">${direction === "up" ? "^" : "v"}</b>
        </button>`).join("")}
      </article>
    </div>
  </section>`;
}

function topThings(rows) {
  const selectedIds = new Set();
  const recovery = contextPatterns({ ignoreSignal: true, ignoreImpact: true, ignoreReview: true }).filter((item) => item.direction === "recovery");
  const openText = contextPatterns({ ignoreSignal: true, ignoreImpact: true }).filter((item) => item.signal === "Open Text");
  const riskRows = rows.filter((item) => item.direction !== "recovery");
  const pool = state.impact === "Low"
    ? [...rows, ...recovery, ...openText]
    : state.selectedSignal === "Open Text"
      ? [...rows, ...openText, ...recovery]
      : [...riskRows, ...openText, ...recovery];

  const priorities = [];
  for (const item of pool) {
    if (selectedIds.has(item.id)) continue;
    selectedIds.add(item.id);
    priorities.push({
      ...item,
      kind: item.direction === "recovery" ? "recovery" : item.signal === "Open Text" ? "open-text" : "risk"
    });
    if (priorities.length === 3) break;
  }

  return priorities;
}

function renderAttentionTable(rows) {
  const displayRows = leadershipItems(rows);
  return `<section class="section-card attention">
    <div class="section-title">
      <h2>2. Top Leadership Attention Items</h2>
      <span>5 prioritized items / ${rows.length} exact matches</span>
    </div>
    <table>
      <thead>
        <tr>
          ${[
            ["id", "Rank"],
            ["pattern", "Pattern"],
            ["why", "Why It Matters"],
            ["impact", "Impact"],
            ["delta", "Trend vs Prior Week"],
            ["region", "Affected Scope"],
            ["review", "Review"]
          ].map(([key, label]) => `<th><button data-sort="${key}">${label}</button></th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${displayRows.map((item, index) => `<tr data-row="${item.id}">
          <td><span class="rank" style="--rank-color:${item.color}">${index + 1}</span></td>
          <td><div class="pattern-cell">${patternIcon(item.signal)}<strong>${item.pattern}</strong>${item.related ? "<em>Related priority</em>" : ""}</div></td>
          <td>${item.why}</td>
          <td><mark class="${item.impact.toLowerCase()}">${item.impact}</mark></td>
          <td>${sparkline(item.trend.map((value) => clamp(value + motion(item.id), 10, 92)), item.color)}</td>
          <td><strong>${item.region}</strong><span>${item.division}</span></td>
          <td><button class="review-button">Review -></button></td>
        </tr>`).join("")}
      </tbody>
    </table>
  </section>`;
}

function leadershipItems(exactRows) {
  const seen = new Set();
  const items = [];
  const add = (item, related = false) => {
    if (!item || seen.has(item.id) || items.length >= 5) return;
    seen.add(item.id);
    items.push({ ...item, related });
  };

  exactRows.forEach((item) => add(item));
  [
    contextPatterns({ ignoreSignal: true }),
    contextPatterns({ ignoreImpact: true }),
    contextPatterns({ ignoreReview: true }),
    contextPatterns({ ignoreSignal: true, ignoreImpact: true, ignoreReview: true }),
    scoredPatterns().sort((a, b) => b.score - a.score)
  ].flat().forEach((item) => add(item, true));

  return items;
}

function patternIcon(signal) {
  const map = {
    Escalations: "alert",
    "Actions / CA": "clock",
    Assignments: "group",
    Workflows: "refresh",
    Compliance: "bars",
    "Open Text": "bot"
  };
  return `<span class="pattern-icon">${icon(map[signal] || "trend")}</span>`;
}

function renderLowerDigest(rows) {
  const context = contextPatterns({ ignoreSignal: true, ignoreImpact: true, ignoreReview: true });
  const emerging = context.filter((item) => item.direction !== "recovery").slice(0, 4);
  const openText = context.filter((item) => item.signal === "Open Text").slice(0, 4);
  const recovery = context.filter((item) => item.direction === "recovery").slice(0, 4);
  const followUps = context.filter((item) => item.direction !== "recovery").slice(0, 4);

  return `<section class="lower-grid">
    <article class="section-card mini-card">
      <h2>3. Emerging Risk Patterns</h2>
      ${emerging.map((item) => `<button data-signal="${item.signal}" class="mini-row">
        ${patternIcon(item.signal)}
        <span><strong>${item.pattern}</strong><em>${item.region} / ${item.delta > 0 ? "+" : ""}${item.delta}% vs. prior week</em></span>
      </button>`).join("")}
    </article>
    <article class="section-card mini-card">
      <h2>4. Operational Follow-Up Risks</h2>
      ${followUps.map((item) => `<div class="metric-row">
        <span><strong>${followUpTitle(item)}</strong><b>${followUpValue(item)}</b><em>+${item.delta}% attention pressure</em></span>
        ${sparkline(item.trend.map((point) => point + motion(item.id)), item.color)}
      </div>`).join("")}
      <div class="score-block compact-score"><span>Average Compliance Score</span><strong>${complianceScore(context)}</strong><em>${scoreDirection(context)} vs. prior week</em></div>
    </article>
    <article class="section-card mini-card">
      <h2>5. Open Text Concern Signals</h2>
      ${openText.map((item) => `<button data-signal="Open Text" class="mini-row open-text-row">
        ${patternIcon("Open Text")}
        <span><strong>${item.pattern}</strong><em>${item.why}</em></span>
      </button>`).join("") || `<div class="positive-row">${icon("check")}<span><strong>No open text concerns in scope</strong><em>Current slicers show no narrative concern clusters.</em></span></div>`}
    </article>
    <article class="section-card mini-card">
      <h2>6. Operational Recovery Items</h2>
      ${recovery.map((item) => `<div class="positive-row">${icon("check")}<span><strong>${item.pattern}</strong><em>${item.why}</em></span></div>`).join("") || `<div class="positive-row">${icon("check")}<span><strong>No recovery movement in scope</strong><em>Broaden filters to compare positive operational movement.</em></span></div>`}
    </article>
  </section>`;
}

function followUpTitle(item) {
  const titles = {
    Escalations: "Escalations Aging (>7 Days)",
    "Actions / CA": "Overdue Corrective Actions",
    Assignments: "Assignments Aging (>7 Days)",
    Workflows: "Workflow Participation Drift",
    Compliance: "Compliance Review Queue",
    "Open Text": "Narrative Signal Review"
  };
  return titles[item.signal] || item.pattern;
}

function followUpValue(item) {
  const base = {
    Escalations: 276,
    "Actions / CA": 342,
    Assignments: 2047,
    Workflows: 1128,
    Compliance: 78,
    "Open Text": 64
  }[item.signal] || 100;
  return String(Math.round(base + item.score * (item.signal === "Assignments" ? 8 : 2))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function complianceScore(rows) {
  const complianceRows = rows.filter((item) => item.signal === "Compliance");
  const source = complianceRows.length ? complianceRows : rows;
  const average = source.length ? source.reduce((sum, item) => sum + item.score, 0) / source.length : 72;
  return clamp(Math.round(100 - average / 4), 62, 91);
}

function scoreDirection(rows) {
  const score = complianceScore(rows);
  return score >= 78 ? "^ 3 pts" : "v " + clamp(80 - score, 2, 10) + " pts";
}

function renderHeatmap() {
  const regions = REGIONS.slice(1);
  const activeSignal = state.selectedSignal === "All Signals" ? SIGNALS : [state.selectedSignal];
  return `<section class="section-card heatmap-card">
    <div class="section-title">
      <h2>Operational Signal Heatmap</h2>
      <span>${state.timeRange}</span>
    </div>
    <div class="heatmap-grid" style="--cols:${SIGNALS.length + 1}">
      <span></span>
      ${SIGNALS.map((signal) => `<strong>${signal}</strong>`).join("")}
      ${regions.map((region) => `${`<b>${region.replace(" Region", "")}</b>`}${SIGNALS.map((signal) => {
        const value = heatValue(region, signal);
        const active = activeSignal.includes(signal);
        return `<button class="heat-cell ${active ? "active" : ""} ${heatLevel(value)}" data-cell="${region}|${signal}" title="${region} ${signal}: ${value}">
          <span>${value}</span>
        </button>`;
      }).join("")}`).join("")}
    </div>
    <div class="heat-detail">
      ${renderHeatDetail()}
    </div>
  </section>`;
}

function heatLevel(value) {
  if (value >= 84) return "critical";
  if (value >= 70) return "high";
  if (value >= 55) return "medium";
  return "low";
}

function renderHeatDetail() {
  const [region, signal] = state.hoverCell ? state.hoverCell.split("|") : [state.region === "All Regions" ? "West Region" : state.region, state.selectedSignal === "All Signals" ? "Escalations" : state.selectedSignal];
  const value = heatValue(region, signal);
  return `<strong>${region} / ${signal}</strong>
    <dl>
      <dt>Signal score</dt><dd>${value}</dd>
      <dt>Escalation rate</dt><dd>${clamp(value - 39, 6, 58)}%</dd>
      <dt>Corrective action aging</dt><dd>${clamp(value - 44, 8, 49)} days</dd>
      <dt>Recommended review</dt><dd>${value >= 75 ? "Leadership" : "Regional"}</dd>
    </dl>`;
}

function renderArchitecture() {
  const stages = [
    ["Operational Data Sources", "Safety workflows, assignments, observations, open text, and site context."],
    ["Governed Analytics Layer", "Controlled metrics, refresh rules, lineage, and trusted definitions."],
    ["Intelligence Detection Engine", "Detects escalation patterns, drift, backlog aging, and compliance deviation."],
    ["Predictive Risk Modeling", "Scores likelihood, impact, trend acceleration, and action confidence."],
    ["Executive Prioritization Digest", "Converts dashboards into leadership attention items."],
    ["Leadership Action", "Routes reviews, interventions, and follow-up accountability."]
  ];
  return `<section class="section-card architecture">
    <h2>Intelligence Architecture Flow</h2>
    ${stages.map(([title, body], index) => `<button class="flow-stage">
      <span>${index + 1}</span>
      <strong>${title}</strong>
      <em>${body}</em>
    </button>`).join("")}
  </section>`;
}

function renderDeliveryLayer() {
  const links = [
    ["alert", "Escalations Dashboard"],
    ["action", "Actions Report"],
    ["check", "Corrective Actions Report"],
    ["scope", "Workflows Dashboard"],
    ["group", "Assignments Report"],
    ["map", "Compliance & Scores Dashboard"]
  ];
  return `<section class="section-card review-links">
    <h2>7. Review Links</h2>
    <div class="review-grid">${links.map(([name, label]) => `<button>${icon(name)}<span>${label}<em>Open -></em></span></button>`).join("")}</div>
    <footer>
      <span>${icon("bot")}</span>
      <p><strong>About this digest</strong>This digest is generated weekly to focus leaders on what matters most. It analyzes changes, trends, and patterns across key safety signals so you can act where it counts.</p>
      <p><strong>Questions or feedback?</strong>Reply to this email or contact the Safety Intelligence team.</p>
    </footer>
    <blockquote>"Dashboards create visibility. Intelligence creates prioritization."</blockquote>
  </section>`;
}

function bindEvents() {
  document.querySelectorAll("[data-filter]").forEach((select) => {
    select.addEventListener("change", (event) => {
      state[event.target.dataset.filter] = event.target.value;
      state.tick += 1;
      render();
    });
  });
  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sort;
      state.sortDir = state.sortKey === key ? state.sortDir * -1 : -1;
      state.sortKey = key;
      render();
    });
  });
  document.querySelectorAll("[data-signal]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedSignal = button.dataset.signal;
      state.tick += 1;
      render();
    });
  });
  document.querySelectorAll("[data-cell]").forEach((cell) => {
    cell.addEventListener("mouseenter", () => {
      state.hoverCell = cell.dataset.cell;
      render();
    });
    cell.addEventListener("focus", () => {
      state.hoverCell = cell.dataset.cell;
      render();
    });
  });
}

render();
