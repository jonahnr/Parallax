import { patterns } from "../data/digestData.js";

export const defaultSlicers = {
  region: "All Regions",
  division: "All Divisions",
  selectedSignal: "All Signals",
  timeRange: "Current Week",
  impact: "All Impact",
  review: "All Review States"
};

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function rangeBoost(timeRange) {
  return {
    "Current Week": 0,
    "Prior 7 Days": -3,
    "4-Week Rolling": 4,
    "Quarter to Date": 7
  }[timeRange] || 0;
}

export function comparisonLabel(timeRange) {
  return (
    {
      "Current Week": "vs. prior week",
      "Prior 7 Days": "vs. previous 7 days",
      "4-Week Rolling": "vs. rolling baseline",
      "Quarter to Date": "vs. quarter baseline"
    }[timeRange] || "vs. comparison period"
  );
}

export function comparedToLabel(timeRange) {
  return (
    {
      "Current Week": ["Apr 28 - May 4, 2025", "Prior 7 Days"],
      "Prior 7 Days": ["Apr 21 - Apr 27, 2025", "Previous 7 Days"],
      "4-Week Rolling": ["Apr 14 - May 11, 2025", "Rolling Baseline"],
      "Quarter to Date": ["Jan 1 - May 11, 2025", "QTD Baseline"]
    }[timeRange] || ["Configured comparison", "Baseline"]
  );
}

export function baselineLabel(timeRange) {
  return (
    {
      "Current Week": "4-Week Rolling + Prior 30 Days",
      "Prior 7 Days": "Previous 7-Day Rolling Average",
      "4-Week Rolling": "Prior 4-Week Rolling Average",
      "Quarter to Date": "Prior Quarter + 12-Week Trend"
    }[timeRange] || "Operational Baseline"
  );
}

export function motionSeed(slicers, index = 0) {
  const key = Object.values(slicers).join("|");
  const hash = key.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Math.round(Math.sin((hash + index * 11) / 17) * 4);
}

export function scoredPatterns(slicers) {
  return patterns.map((item, index) => ({
    ...item,
    score: clamp(item.score + rangeBoost(slicers.timeRange) + motionSeed(slicers, index), 28, 98),
    delta:
      item.direction === "recovery"
        ? -clamp(6 + motionSeed(slicers, index), 3, 14)
        : clamp(8 + motionSeed(slicers, index), 2, 34)
  }));
}

export function scopedRows(slicers, options = {}) {
  const { ignoreSignal = false, ignoreImpact = false, ignoreReview = false, ignoreDivision = false } = options;
  let rows = scoredPatterns(slicers);

  if (slicers.region !== "All Regions") {
    rows = rows.filter((item) => item.region === slicers.region || item.region === "All Regions");
  }
  if (!ignoreDivision && slicers.division !== "All Divisions") {
    rows = rows.filter((item) => item.division === slicers.division);
  }
  if (!ignoreImpact && slicers.impact !== "All Impact") {
    rows = rows.filter((item) => item.impact === slicers.impact);
  }
  if (!ignoreReview && slicers.review !== "All Review States") {
    rows = rows.filter((item) => item.review === slicers.review);
  }
  if (!ignoreSignal && slicers.selectedSignal !== "All Signals") {
    rows = rows.filter((item) => item.signal === slicers.selectedSignal);
  }

  return rows.sort((a, b) => b.score - a.score);
}

export function contextPatterns(slicers, options = {}) {
  return scopedRows(slicers, options);
}

export function activePatterns(slicers, sort) {
  const rows = contextPatterns(slicers);
  return [...rows].sort((a, b) => {
    if (a[sort.key] === b[sort.key]) return 0;
    return (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir;
  });
}

export function leadershipItems(slicers, exactRows, limit = 5) {
  const seen = new Set();
  const items = [];
  const add = (item, related = false) => {
    if (!item || seen.has(item.id) || items.length >= limit) return;
    seen.add(item.id);
    items.push({ ...item, related });
  };

  exactRows.forEach((item) => add(item));
  [
    contextPatterns(slicers, { ignoreSignal: true }),
    contextPatterns(slicers, { ignoreImpact: true }),
    contextPatterns(slicers, { ignoreReview: true }),
    contextPatterns(slicers, { ignoreSignal: true, ignoreImpact: true, ignoreReview: true }),
    scoredPatterns(slicers).sort((a, b) => b.score - a.score)
  ]
    .flat()
    .forEach((item) => add(item, true));

  return items;
}

export function topThings(slicers, exactRows) {
  const selectedIds = new Set();
  const addItems = (items, pool) => {
    pool.forEach((item) => {
      if (!item || selectedIds.has(item.id) || items.length >= 3) return;
      selectedIds.add(item.id);
      items.push({
        ...item,
        kind: item.direction === "recovery" ? "recovery" : item.signal === "Open Text" ? "open-text" : "risk"
      });
    });
    return items;
  };
  const recovery = contextPatterns(slicers, {
    ignoreSignal: true,
    ignoreImpact: true,
    ignoreReview: true
  }).filter((item) => item.direction === "recovery");
  const openText = contextPatterns(slicers, {
    ignoreSignal: true,
    ignoreImpact: true
  }).filter((item) => item.signal === "Open Text");
  const riskRows = exactRows.filter((item) => item.direction !== "recovery");
  const pool =
    slicers.impact === "Low"
      ? [...exactRows, ...recovery, ...openText]
      : slicers.selectedSignal === "Open Text"
        ? [...exactRows, ...openText, ...recovery]
        : [...riskRows, ...openText, ...recovery];

  return [
    pool,
    contextPatterns(slicers, { ignoreSignal: true, ignoreImpact: true, ignoreReview: true }),
    scoredPatterns({ ...slicers, region: "All Regions", division: "All Divisions", selectedSignal: "All Signals" }).sort(
      (a, b) => b.score - a.score
    )
  ].reduce(addItems, []);
}

export function overallSignal(rows) {
  const average = rows.length ? rows.reduce((sum, item) => sum + item.score, 0) / rows.length : 68;
  return Math.round(clamp(average, 35, 96));
}

export function signalState(score) {
  if (score >= 84) return ["Deteriorating", "critical"];
  if (score >= 70) return ["Elevated", "high"];
  if (score >= 55) return ["Mixed", "medium"];
  return ["Recovering", "low"];
}

export function heatValue(slicers, region, signal) {
  const rows = scoredPatterns({ ...slicers, selectedSignal: "All Signals" }).filter(
    (item) => (region === "All Regions" || item.region === region || item.region === "All Regions") && item.signal === signal
  );
  const fallback = 46 + ((region.length * 7 + signal.length * 5 + slicers.timeRange.length) % 28);
  return clamp(
    rows.length ? Math.round(rows.reduce((sum, item) => sum + item.score, 0) / rows.length) : fallback,
    30,
    98
  );
}

export function signalDirectionMetric(slicers, signal) {
  const region = slicers.region === "All Regions" ? "West Region" : slicers.region;
  const current = heatValue(slicers, region, signal);
  const previousBoost =
    {
      "Current Week": -4,
      "Prior 7 Days": -2,
      "4-Week Rolling": -7,
      "Quarter to Date": -10
    }[slicers.timeRange] || -4;
  const matchingRows = scoredPatterns(slicers).filter(
    (item) => (region === "All Regions" || item.region === region || item.region === "All Regions") && item.signal === signal
  );
  const trendDelta = matchingRows.length
    ? Math.round(matchingRows.reduce((sum, item) => sum + (item.trend[item.trend.length - 1] - item.trend[0]), 0) / matchingRows.length / 3)
    : Math.round((signal.length + region.length) % 9) - 3;
  const delta = clamp(current - (current + previousBoost - trendDelta), -18, 24);
  const direction = delta >= 4 ? "up" : delta <= -4 ? "down" : "flat";
  const level = Math.abs(delta) >= 12 ? "Severe" : Math.abs(delta) >= 7 ? "Elevated" : Math.abs(delta) >= 3 ? "Watch" : "Stable";

  return { current, delta, direction, level };
}

export function heatLevel(value) {
  if (value >= 84) return "bg-red-500/40 shadow-[0_0_24px_rgba(239,68,68,.2)]";
  if (value >= 70) return "bg-orange-500/35";
  if (value >= 55) return "bg-parallax-gold/25";
  return "bg-emerald-600/20";
}

export function complianceScore(rows) {
  const complianceRows = rows.filter((item) => item.signal === "Compliance");
  const source = complianceRows.length ? complianceRows : rows;
  const average = source.length ? source.reduce((sum, item) => sum + item.score, 0) / source.length : 72;
  return clamp(Math.round(100 - average / 4), 62, 91);
}

export function followUpTitle(signal) {
  return (
    {
      Escalations: "Escalations Aging (>7 Days)",
      "Actions / CA": "Overdue Corrective Actions",
      Assignments: "Assignments Aging (>7 Days)",
      Workflows: "Workflow Participation Drift",
      Compliance: "Compliance Review Queue",
      "Open Text": "Narrative Signal Review"
    }[signal] || "Operational Follow-Up"
  );
}

export function followUpValue(item) {
  const base =
    {
      Escalations: 276,
      "Actions / CA": 342,
      Assignments: 2047,
      Workflows: 1128,
      Compliance: 78,
      "Open Text": 64
    }[item.signal] || 100;
  return String(Math.round(base + item.score * (item.signal === "Assignments" ? 8 : 2))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
