import { patterns } from "../data/digestData.js";

export const defaultSlicers = {
  region: "All Regions",
  division: "Manufacturing & Automotive",
  selectedSignal: "All Risk Types",
  timeRange: "Previous Week",
  impact: "All Impact",
  review: "All Review States"
};

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function rangeBoost(timeRange) {
  return {
    "Previous Week": 0,
    "Previous Month": 4,
    "Previous Quarter": 7,
    "Previous Year": 10
  }[timeRange] || 0;
}

export function comparisonLabel(timeRange) {
  return (
    {
      "Previous Week": "vs. prior period comparison",
      "Previous Month": "vs. prior month comparison",
      "Previous Quarter": "vs. prior quarter comparison",
      "Previous Year": "vs. prior year comparison"
    }[timeRange] || "vs. comparison period"
  );
}

export function comparedToLabel(timeRange) {
  const today = new Date();
  const currentDay = today.getDay();
  const daysSinceMonday = (currentDay + 6) % 7;
  const currentWeekMonday = addDays(today, -daysSinceMonday);
  const recentCompleteStart = addDays(currentWeekMonday, -7);
  const reportingStart = addDays(currentWeekMonday, -14);
  const reportingEnd = addDays(currentWeekMonday, -8);
  const formatRange = (start, end) => `${formatShortDate(start)} - ${formatShortDate(end)}`;
  return (
    {
      "Previous Week": [formatRange(recentCompleteStart, addDays(currentWeekMonday, -1)), "Previous Week"],
      "Previous Month": [formatRange(addDays(reportingEnd, -30), reportingEnd), "Previous Month Trend"],
      "Previous Quarter": [formatRange(addDays(reportingEnd, -90), reportingEnd), "Previous Quarter Trend"],
      "Previous Year": [formatRange(addDays(reportingEnd, -365), reportingEnd), "Previous Year Trend"]
    }[timeRange] || ["Configured comparison", "Baseline"]
  );
}

function addDays(date, days) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfQuarter(date) {
  return new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
}

function formatShortDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function baselineLabel(timeRange) {
  return (
    {
      "Previous Week": "Prior Period Operating Baseline",
      "Previous Month": "Prior Month Operating Baseline",
      "Previous Quarter": "Prior Quarter Operating Baseline",
      "Previous Year": "Prior Year Operating Baseline"
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
  if (!ignoreDivision) {
    rows = rows.filter((item) => item.division === slicers.division);
  }
  if (!ignoreImpact && slicers.impact !== "All Impact") {
    rows = rows.filter((item) => item.impact === slicers.impact);
  }
  if (!ignoreReview && slicers.review !== "All Review States") {
    rows = rows.filter((item) => item.review === slicers.review);
  }
  if (!ignoreSignal && slicers.selectedSignal !== "All Risk Types") {
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
    const aValue = sortValue(a, sort.key);
    const bValue = sortValue(b, sort.key);
    if (aValue === bValue) return b.score - a.score || a.pattern.localeCompare(b.pattern);
    if (typeof aValue === "number" && typeof bValue === "number") return (aValue - bValue) * sort.dir;
    return String(aValue).localeCompare(String(bValue)) * sort.dir;
  });
}

function sortValue(item, key) {
  if (key === "id") return item.score;
  if (key === "action") return item.signal;
  return item[key];
}

export function leadershipItems(slicers, exactRows, limit = 5) {
  const hasFocusedFilters =
    slicers.region !== "All Regions" ||
    slicers.selectedSignal !== "All Risk Types" ||
    slicers.impact !== "All Impact" ||
    slicers.review !== "All Review States";
  if (hasFocusedFilters) return exactRows.slice(0, limit);

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
    scoredPatterns(slicers).filter((item) => item.division === slicers.division).sort((a, b) => b.score - a.score)
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
        kind: item.direction === "recovery" ? "recovery" : "risk"
      });
    });
    return items;
  };
  const recovery = contextPatterns(slicers, {
    ignoreSignal: true,
    ignoreImpact: true,
    ignoreReview: true
  }).filter((item) => item.direction === "recovery");
  const openText = [];
  const riskRows = exactRows.filter((item) => item.direction !== "recovery");
  const pool =
    slicers.impact === "Low"
      ? [...exactRows, ...recovery, ...openText]
      : [...riskRows, ...openText, ...recovery];

  return [
    pool,
    contextPatterns(slicers, { ignoreSignal: true, ignoreImpact: true, ignoreReview: true }),
    scoredPatterns({ ...slicers, region: "All Regions", selectedSignal: "All Risk Types" }).filter((item) => item.division === slicers.division).sort(
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
  const rows = scoredPatterns({ ...slicers, selectedSignal: "All Risk Types" }).filter(
    (item) =>
      item.division === slicers.division &&
      (region === "All Regions" || item.region === region || item.region === "All Regions") &&
      (slicers.selectedSignal === "All Risk Types" || item.signal === slicers.selectedSignal || item.signal === signal) &&
      item.signal === signal
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
      "Previous Week": -4,
      "Previous Month": -7,
      "Previous Quarter": -10,
      "Previous Year": -13
    }[slicers.timeRange] || -4;
  const matchingRows = scoredPatterns(slicers).filter(
    (item) => item.division === slicers.division && (region === "All Regions" || item.region === region || item.region === "All Regions") && item.signal === signal
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
