const COLORS = ["#d92727", "#e76f14", "#f2b916", "#2e8f37", "#0f58d6"];
const CLASS_BY_COLOR = ["danger", "orange", "yellow", "amber", "green"];
const trendTabs = ["Apr 13", "Apr 20", "Apr 27", "May 4", "May 11"];

const scopeProfiles = {
  All: {
    label: "All",
    completion: 1,
    escalations: 1,
    engagement: 1,
    strength: 1,
    assignments: 1,
    concern: "mixed operating concerns"
  },
  Manufacturing: {
    label: "Manufacturing",
    completion: 0.96,
    escalations: 1.18,
    engagement: 1.05,
    strength: 0.97,
    assignments: 0.94,
    concern: "handoff and maintenance concerns"
  },
  Distribution: {
    label: "Distribution",
    completion: 1.04,
    escalations: 0.88,
    engagement: 0.92,
    strength: 1.02,
    assignments: 1.03,
    concern: "assignment throughput concerns"
  },
  "Field Ops": {
    label: "Field Ops",
    completion: 0.91,
    escalations: 1.28,
    engagement: 0.86,
    strength: 0.95,
    assignments: 0.89,
    concern: "field execution risk"
  }
};

const rows = [
  {
    region: "South",
    workflows: 362,
    completion: 82,
    escalation: 28,
    engaged: 118,
    strength: 74,
    anvl: 70,
    onTime: 86,
    assignment: 79,
    sites: ["Dallas", "Austin", "Baton Rouge"],
    pressureMix: { workflow: 68, site: 82, owner: 74 },
    concerns: ["maintenance", "staffing", "handoff"]
  },
  {
    region: "West",
    workflows: 298,
    completion: 78,
    escalation: 22,
    engaged: 97,
    strength: 71,
    anvl: 65,
    onTime: 84,
    assignment: 77,
    sites: ["Phoenix", "Fresno", "Reno"],
    pressureMix: { workflow: 72, site: 69, owner: 78 },
    concerns: ["staffing", "training", "handoff"]
  },
  {
    region: "North",
    workflows: 286,
    completion: 89,
    escalation: 12,
    engaged: 89,
    strength: 81,
    anvl: 75,
    onTime: 91,
    assignment: 85,
    sites: ["Cleveland", "Detroit", "Milwaukee"],
    pressureMix: { workflow: 58, site: 58, owner: 55 },
    concerns: ["training", "compliance", "handoff"]
  },
  {
    region: "East",
    workflows: 202,
    completion: 88,
    escalation: 6,
    engaged: 73,
    strength: 82,
    anvl: 76,
    onTime: 90,
    assignment: 87,
    sites: ["Raleigh", "Richmond", "Albany"],
    pressureMix: { workflow: 44, site: 42, owner: 39 },
    concerns: ["documentation", "staffing", "training"]
  },
  {
    region: "Central",
    workflows: 100,
    completion: 90,
    escalation: 4,
    engaged: 35,
    strength: 79,
    anvl: 72,
    onTime: 88,
    assignment: 81,
    sites: ["Denver", "Omaha", "Tulsa"],
    pressureMix: { workflow: 31, site: 26, owner: 33 },
    concerns: ["assignments", "documentation", "equipment"]
  }
];

const baseTrends = {
  escalation: [34, 35, 36, 42, 58],
  completion: [80, 77, 81, 78, 85],
  anvl: [56, 59, 63, 66, 70],
  onTime: [82, 88, 94, 89, 96]
};

const priorityTemplates = [
  {
    key: "escalation",
    title: "Escalation Risk Rising",
    driver: "Escalation Aging",
    description: (top) => `Escalation count and aging are increasing in the ${top.region} Region.`,
    severity: "High",
    symbol: "^",
    value: (row) => 48 + row.escalation * 1.35 + (90 - row.completion) * 0.6
  },
  {
    key: "completion",
    title: "Workflow Completion Deteriorating",
    driver: "Completion Decline",
    description: (top) => `Completion percentage is below plan in ${top.region} and adjacent workflows.`,
    severity: "High",
    symbol: "\\",
    value: (row) => 112 - row.completion + row.escalation * 0.6
  },
  {
    key: "compliance",
    title: "Compliance Instability",
    driver: "Score to Goal Decline",
    description: (top) => `Compliance percentage to goal is declining in the ${top.region} Region.`,
    severity: "Medium",
    symbol: "!",
    value: (row) => 112 - row.anvl + row.escalation * 0.45
  },
  {
    key: "assignment",
    title: "Assignment Bottleneck Detected",
    driver: "Overdue Assignments",
    description: (top) => `Assignment aging is concentrated around ${top.region} owner groups.`,
    severity: "Medium",
    symbol: "..",
    value: (row) => 105 - row.assignment + (100 - row.onTime) * 0.7
  },
  {
    key: "strength",
    title: "Strength Score Declining",
    driver: "Score Decline",
    description: (top) => `Strength score needs attention in ${top.region} and similar teams.`,
    severity: "Watch",
    symbol: "*",
    value: (row) => 101 - row.strength + (85 - row.completion) * 0.35
  }
];

const concernCopy = {
  staffing: "Increasing mentions of staffing shortages",
  maintenance: "Equipment maintenance issues tied to escalation growth",
  handoff: "Communication / handoff problems increasing",
  training: "Training / competency gaps mentioned more often",
  compliance: "Compliance interpretation uncertainty",
  documentation: "Documentation quality or timeliness issues",
  assignments: "Overdue assignments creating follow-up drag",
  equipment: "Equipment readiness issues slowing field work"
};

const metricDefs = [
  ["workflows", "Workflows Completed", "blue", "[]", false],
  ["completion", "Workflow Completion %", "blue ring", "", true],
  ["escalation", "Escalation Count", "red", "!", false],
  ["engaged", "Engaged User Count", "purple", "o", false],
  ["strength", "Strength Score", "green", "v", false],
  ["anvl", "ANVL Score (% to Goal)", "green", "O", true],
  ["onTime", "On-Time Assignments %", "blue", "cal", true]
];

const barChart = document.querySelector("#barChart");
const tabs = document.querySelectorAll(".tab");
const filterButton = document.querySelector("#filterButton");
const scopeSelect = document.querySelector("#scopeSelect");
const regionSelect = document.querySelector("#regionSelect");
const priorityGrid = document.querySelector(".priority-grid");
const metricGrid = document.querySelector(".metric-grid");
const concernList = document.querySelector(".concern-list");
const tableBody = document.querySelector("tbody");
const trendChart = document.querySelector(".trend-chart");
const filterSummary = document.querySelector("#filterSummary");

let activeContribution = "region";
let state = {
  scope: scopeSelect.value,
  region: regionSelect.value
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Math.round(value);
}

function scopedRow(row, scopeName) {
  const profile = scopeProfiles[scopeName];
  const completion = clamp(row.completion * profile.completion, 55, 99);
  const escalation = clamp(row.escalation * profile.escalations, 0, 99);
  const engaged = row.engaged * profile.engagement;
  const strength = clamp(row.strength * profile.strength, 40, 99);
  const assignment = clamp(row.assignment * profile.assignments, 45, 99);
  const onTime = clamp(row.onTime * profile.assignments, 45, 99);
  const anvl = clamp(row.anvl * ((profile.completion + profile.strength) / 2), 40, 99);

  return {
    ...row,
    completion,
    escalation,
    engaged,
    strength,
    assignment,
    onTime,
    anvl,
    escalationRate: escalation / Math.max(1, row.workflows) * 100
  };
}

function getFilteredRows() {
  return rows
    .filter((row) => state.region === "All" || row.region === state.region)
    .map((row) => scopedRow(row, state.scope));
}

function aggregate(filteredRows) {
  const totalWorkflows = filteredRows.reduce((sum, row) => sum + row.workflows, 0);
  const weighted = (key) => filteredRows.reduce((sum, row) => sum + row[key] * row.workflows, 0) / Math.max(1, totalWorkflows);
  const sum = (key) => filteredRows.reduce((total, row) => total + row[key], 0);

  return {
    workflows: totalWorkflows,
    completion: weighted("completion"),
    escalation: sum("escalation"),
    engaged: sum("engaged"),
    strength: weighted("strength"),
    anvl: weighted("anvl"),
    onTime: weighted("onTime"),
    assignment: weighted("assignment")
  };
}

function formatMetric(key, value) {
  if (["completion", "anvl", "onTime"].includes(key)) return `${round(value)}%`;
  return round(value).toLocaleString();
}

function deltaFor(key, value) {
  const baselines = {
    workflows: 1148,
    completion: 88,
    escalation: 62,
    engaged: 385,
    strength: 75,
    anvl: 69,
    onTime: 84
  };
  const baseline = state.region === "All" ? baselines[key] : baselines[key] / 5;
  const delta = key === "escalation"
    ? ((value - baseline) / Math.max(1, baseline)) * 100
    : value - baseline;
  const isGood = key === "escalation" ? delta <= 0 : delta >= 0;
  const unit = ["completion", "anvl", "onTime", "escalation"].includes(key) ? "%" : "";
  return {
    text: `${delta >= 0 ? "+" : ""}${round(delta)}${unit}`,
    className: isGood ? "good" : "bad"
  };
}

function miniSpark(seed, invert = false) {
  const points = Array.from({ length: 11 }, (_, index) => {
    const wave = Math.sin((index + 1) * 1.7 + seed) * 6;
    const drift = invert ? index * 0.8 : -index * 0.35;
    const y = clamp(16 + wave + drift, 5, 25);
    return `${index * 13},${round(y)}`;
  });
  return points.join(" ");
}

function renderMetrics(summary) {
  metricGrid.innerHTML = metricDefs.map(([key, label, colorClass, icon, isPercent], index) => {
    const delta = deltaFor(key, summary[key]);
    const lineClass = colorClass.includes("red") ? "red-line" : colorClass.includes("purple") ? "purple-line" : colorClass.includes("green") ? "green-line" : "";
    return `
      <article class="metric">
        <span class="metric-icon ${colorClass}">${icon}</span>
        <h3>${label}</h3>
        <strong>${isPercent ? `${round(summary[key])}%` : formatMetric(key, summary[key])}</strong>
        <em class="${delta.className}">${delta.text}</em>
        <svg class="${lineClass}" viewBox="0 0 130 30"><polyline points="${miniSpark(index, key === "escalation")}"/></svg>
      </article>
    `;
  }).join("");
}

function priorityScore(template, row) {
  const score = template.value(row);
  const scopePressure = scopeProfiles[state.scope].escalations > 1 ? 4 : 0;
  return clamp(round(score + scopePressure), 28, 97);
}

function renderPriorities(filteredRows) {
  const cards = priorityTemplates.map((template, index) => {
    const top = [...filteredRows].sort((a, b) => template.value(b) - template.value(a))[0];
    const score = priorityScore(template, top);
    const colorClass = CLASS_BY_COLOR[index];
    const severityClass = template.severity === "High" ? "" : template.severity === "Medium" ? "medium" : "low";
    return { template, top, score, colorClass, severityClass };
  }).sort((a, b) => b.score - a.score);

  priorityGrid.innerHTML = cards.map((card, index) => `
    <article class="priority-card ${card.colorClass}">
      <div class="priority-top">
        <span class="rank">${index + 1}</span>
        <span class="trend-symbol">${card.template.symbol}</span>
      </div>
      <h3>${card.template.title}</h3>
      <span class="severity ${card.severityClass}">${card.template.severity}</span>
      <p>${card.template.description(card.top)}</p>
      <dl>
        <div><dt>Primary Driver</dt><dd>${card.template.driver}</dd></div>
        <div><dt>Scope</dt><dd>${card.top.region} Region</dd></div>
        <div><dt>Pressure Score</dt><dd><strong>${card.score}</strong> /100 <span class="up">+${Math.max(2, round(card.score / 7))}</span></dd></div>
      </dl>
      <a href="#">View details</a>
    </article>
  `).join("");
}

function renderConcerns(filteredRows) {
  const concernScores = {};
  filteredRows.forEach((row) => {
    row.concerns.forEach((concern, index) => {
      concernScores[concern] = (concernScores[concern] || 0) + row.escalation * (3 - index) + (100 - row.completion) * 0.8;
    });
  });
  const ordered = Object.entries(concernScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  concernList.innerHTML = ordered.map(([concern, value], index) => {
    const classes = ["red", "orange", "yellow", "blue", "gray"];
    const change = index < 3 ? `+${round(value / 9)}%` : `-${round(value / 16)}%`;
    const directionClass = index < 3 ? "bad" : "good";
    const regionText = state.region === "All" ? "across selected operations" : `in ${state.region} Region`;
    return `
      <li>
        <span class="dot ${classes[index]}">${index < 3 ? "!" : index === 3 ? "i" : ""}</span>
        <strong>${concernCopy[concern]} ${regionText}</strong>
        <b>${round(value)}</b>
        <em class="${directionClass}">${change}</em>
      </li>
    `;
  }).join("");
}

function contributionRows(filteredRows) {
  if (activeContribution === "region") {
    return filteredRows.map((row) => [row.region, priorityScore(priorityTemplates[0], row)]);
  }

  if (activeContribution === "workflow") {
    return [
      ["Job Safety", average(filteredRows, "pressureMix", "workflow") + 12],
      ["Inspections", average(filteredRows, "pressureMix", "workflow") + 3],
      ["Corrective Actions", average(filteredRows, "pressureMix", "workflow") - 5],
      ["Training", average(filteredRows, "completion", null, true)],
      ["Audits", average(filteredRows, "anvl", null, true)]
    ];
  }

  if (activeContribution === "site") {
    return filteredRows.flatMap((row) => row.sites.map((site, index) => [site, clamp(row.pressureMix.site - index * 9, 10, 95)]));
  }

  return [
    ["Operations", average(filteredRows, "pressureMix", "owner") + 8],
    ["Maintenance", average(filteredRows, "escalation") + 45],
    ["EHS", average(filteredRows, "anvl", null, true)],
    ["HR", average(filteredRows, "engaged") / 2],
    ["Quality", average(filteredRows, "strength", null, true)]
  ];
}

function average(items, key, nestedKey, invert = false) {
  const raw = items.reduce((sum, item) => {
    const value = nestedKey ? item[key][nestedKey] : item[key];
    return sum + value;
  }, 0) / Math.max(1, items.length);
  return clamp(round(invert ? 100 - raw : raw), 0, 100);
}

function renderBars(filteredRows) {
  const data = contributionRows(filteredRows)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  barChart.innerHTML = data.map(([label, value], index) => `
    <div class="bar-row">
      <strong>${label}</strong>
      <span class="bar-track"><span class="bar-fill" style="width:${clamp(value, 5, 100)}%;background:${COLORS[index]}"></span></span>
      <b style="color:${COLORS[index]}">${round(value)}</b>
    </div>
  `).join("");
}

function trendPoints(values, yMin, yMax) {
  return values.map((value, index) => {
    const x = 60 + index * 150;
    const y = 225 - ((value - yMin) / Math.max(1, yMax - yMin)) * 190;
    return `${x},${clamp(round(y), 25, 225)}`;
  }).join(" ");
}

function renderTrends(summary) {
  const escalationFactor = summary.escalation / (state.region === "All" ? 72 : 18);
  const scoreFactor = summary.anvl / 72;
  const completionFactor = summary.completion / 86;
  const onTimeFactor = summary.onTime / 88;

  const series = {
    escalation: baseTrends.escalation.map((value) => clamp(value * escalationFactor, 5, 100)),
    completion: baseTrends.completion.map((value) => clamp(value * completionFactor, 5, 100)),
    anvl: baseTrends.anvl.map((value) => clamp(value * scoreFactor, 5, 100)),
    onTime: baseTrends.onTime.map((value) => clamp(value * onTimeFactor, 5, 100))
  };

  trendChart.innerHTML = `
    <g class="grid-lines"><path d="M50 25H660M50 75H660M50 125H660M50 175H660M50 225H660"/></g>
    <g class="axis-labels">
      <text x="10" y="29">100%</text><text x="18" y="79">75%</text><text x="18" y="129">50%</text><text x="18" y="179">25%</text><text x="24" y="229">0%</text>
      ${trendTabs.map((label, index) => `<text x="${70 + index * 150}" y="250">${label}</text>`).join("")}
    </g>
    <polyline class="line red-stroke" points="${trendPoints(series.escalation, 0, 100)}"/>
    <polyline class="line blue-stroke" points="${trendPoints(series.completion, 0, 100)}"/>
    <polyline class="line green-stroke" points="${trendPoints(series.anvl, 0, 100)}"/>
    <polyline class="line purple-stroke" points="${trendPoints(series.onTime, 0, 100)}"/>
  `;
}

function trendClass(key, value) {
  if (key === "escalation" || key === "rate") return value > 0 ? "bad" : "good";
  return value >= 0 ? "good" : "bad";
}

function renderTable(filteredRows) {
  tableBody.innerHTML = filteredRows.map((row) => {
    const completionDelta = row.completion - 86;
    const escalationDelta = row.escalation - 14;
    const rateDelta = row.escalationRate - 4.8;
    const anvlDelta = row.anvl - 72;
    return `
      <tr>
        <td>${row.region}</td>
        <td>${row.workflows}</td>
        <td>${round(row.completion)}% <span class="${trendClass("completion", completionDelta)}">${completionDelta >= 0 ? "+" : ""}${round(completionDelta)}</span></td>
        <td>${round(row.escalation)} <span class="${trendClass("escalation", escalationDelta)}">${escalationDelta >= 0 ? "+" : ""}${round(escalationDelta)}</span></td>
        <td>${row.escalationRate.toFixed(1)} <span class="${trendClass("rate", rateDelta)}">${rateDelta >= 0 ? "+" : ""}${rateDelta.toFixed(1)}</span></td>
        <td>${round(row.engaged)}</td>
        <td>${round(row.strength)}</td>
        <td>${round(row.anvl)}% <span class="${trendClass("anvl", anvlDelta)}">${anvlDelta >= 0 ? "+" : ""}${round(anvlDelta)}</span></td>
        <td>${round(row.onTime)}%</td>
        <td>${round(row.assignment)}%</td>
      </tr>
    `;
  }).join("");
}

function renderSummary(summary) {
  const filterText = `${state.scope} scope / ${state.region} region`;
  const riskText = summary.escalation > (state.region === "All" ? 70 : 18)
    ? "Escalation pressure is elevated."
    : "Escalation pressure is controlled.";
  filterSummary.innerHTML = `
    <span class="scope-pill">Filtered: ${filterText}</span>
    <span>${riskText} Completion is ${round(summary.completion)}%, ANVL score is ${round(summary.anvl)}%.</span>
    <button type="button" id="clearFilters">Clear filters</button>
  `;
  document.querySelector("#clearFilters").addEventListener("click", () => {
    scopeSelect.value = "All";
    regionSelect.value = "All";
    updateState();
  });
}

function updateState() {
  state = {
    scope: scopeSelect.value,
    region: regionSelect.value
  };
  const filteredRows = getFilteredRows();
  const summary = aggregate(filteredRows);

  filterButton.setAttribute("aria-pressed", String(state.scope !== "All" || state.region !== "All"));
  renderSummary(summary);
  renderPriorities(filteredRows);
  renderMetrics(summary);
  renderConcerns(filteredRows);
  renderBars(filteredRows);
  renderTrends(summary);
  renderTable(filteredRows);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    activeContribution = tab.dataset.tab;
    renderBars(getFilteredRows());
  });
});

filterButton.addEventListener("click", () => {
  const nextRegion = regionSelect.value === "All" ? "South" : "All";
  regionSelect.value = nextRegion;
  updateState();
});

[scopeSelect, regionSelect].forEach((select) => {
  select.addEventListener("change", updateState);
});

updateState();
