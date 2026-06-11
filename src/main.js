import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { filters, scenarios } from "./data/digestData.js";
import logoImage from "../assets/social-preview.png";
import "./styles.css";
import {
  activePatterns,
  baselineLabel,
  clamp,
  complianceScore,
  comparedToLabel,
  comparisonLabel,
  contextPatterns,
  defaultSlicers,
  followUpTitle,
  followUpValue,
  heatLevel,
  heatValue,
  leadershipItems,
  overallSignal,
  scoredPatterns,
  signalDirectionMetric,
  signalState,
  topThings
} from "./lib/intelligence.js";

const h = React.createElement;

const panelClass =
  "relative overflow-hidden rounded-lg border border-white/15 bg-gradient-to-br from-parallax-navy/80 to-[#09163f]/60 p-3 shadow-glow before:pointer-events-none before:absolute before:inset-0 before:shadow-[inset_0_0_44px_rgba(31,106,229,.08)] md:p-4";
const softCardClass = "rounded-lg border border-white/10 bg-white/[.045] p-4";

function Icon({ name, className = "h-5 w-5" }) {
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
    bot: "M12 5V3m-6 8a6 6 0 0 1 12 0v6H6v-6Zm3 2h.01M15 13h.01M9 21h6",
    action: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
  };
  return h(
    "svg",
    {
      className,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true
    },
    h("path", { d: paths[name] || paths.trend })
  );
}

function Sparkline({ values, color, token }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = 6 + (index / (values.length - 1)) * 108;
      const y = 30 - ((value - min) / spread) * 22;
      return `${x},${y}`;
    })
    .join(" ");
  const firstY = 30 - ((values[0] - min) / spread) * 22;
  const lastY = 30 - ((values[values.length - 1] - min) / spread) * 22;
  return h(
    "svg",
    { key: token, className: "block h-10 w-full min-w-[88px]", viewBox: "0 0 120 40", preserveAspectRatio: "none" },
    h("line", { x1: 6, x2: 114, y1: 30, y2: 30, stroke: "rgba(255,255,255,.16)", strokeWidth: "1", strokeDasharray: "3 4" }),
    h("polyline", {
      points,
      fill: "none",
      stroke: color,
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeDasharray: 360,
      className: "animate-chartDraw"
    }),
    values.map((value, index) => {
      const x = 6 + (index / (values.length - 1)) * 108;
      const y = 30 - ((value - min) / spread) * 22;
      return h("circle", {
        key: `${index}-${value}`,
        cx: x,
        cy: y,
        r: index === 0 || index === values.length - 1 ? 3.2 : 2.1,
        fill: index === values.length - 1 ? color : "#071033",
        stroke: color,
        strokeWidth: 2
      });
    }),
    h("circle", {
      cx: 6,
      cy: firstY,
      r: 5,
      fill: color,
      opacity: ".12"
    }),
    h("circle", {
      cx: 114,
      cy: lastY,
      r: 5.5,
      fill: color,
      opacity: ".22"
    })
  );
}

function MicroTrend({ values, color, token }) {
  return h(
    "div",
    { className: "min-w-0 overflow-hidden rounded-md border border-white/10 bg-[#071033]/35 px-2 py-1" },
    h(Sparkline, { values, color, token })
  );
}

function App() {
  const [slicers, setSlicers] = useState(defaultSlicers);
  const [hoverCell, setHoverCell] = useState(null);
  const [leadershipView, setLeadershipView] = useState("top5");
  const [heatmapMode, setHeatmapMode] = useState("map");
  const filterToken = Object.values(slicers).join("|");
  const exactRows = useMemo(() => activePatterns(slicers), [slicers]);
  const allLeadershipRows = useMemo(() => leadershipItems(slicers, exactRows, 999), [slicers, exactRows]);
  const leadershipRows = leadershipView === "all" ? allLeadershipRows : allLeadershipRows.slice(0, 5);
  const industryRows = useMemo(() => contextPatterns({ ...slicers, region: "All Regions", selectedSignal: "All Risk Types", impact: "All Impact", review: "All Review States" }), [slicers.division, slicers.timeRange]);
  const contextRows = useMemo(
    () => contextPatterns(slicers, { ignoreSignal: true, ignoreImpact: true, ignoreReview: true }),
    [slicers]
  );

  const updateSmartSlicer = (key, value) => {
    setHoverCell(null);
    setSlicers((current) => {
      if (key === "division") return { ...current, division: value, selectedSignal: "All Risk Types" };
      return { ...current, [key]: value };
    });
  };
  const focusSignal = (signal) => {
    setHoverCell(null);
    setSlicers((current) => ({ ...current, selectedSignal: signal }));
  };
  const resetPresenterView = () => {
    setHoverCell(null);
    setLeadershipView("top5");
    setHeatmapMode("map");
    setSlicers(defaultSlicers);
  };

  return h(
    "div",
    { className: "mx-auto w-[min(1760px,calc(100%_-_20px))] py-4 text-white sm:w-[min(1760px,calc(100%_-_36px))] sm:py-6" },
    h(Header, { slicers }),
    h(SlicerBar, { slicers, updateSlicer: updateSmartSlicer, resetPresenterView }),
    h(
      "section",
      { className: "mb-3 grid gap-3 xl:grid-cols-[minmax(230px,.42fr)_minmax(0,1.58fr)]" },
      h(ExecutiveTakeaway, { slicers, leadershipRows, contextRows }),
      h(GuidedDemoPath, { slicers, executiveRows: exactRows, leadershipRows, contextRows, focusSignal })
    ),
    h(
      "section",
      { className: "grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.48fr)_minmax(360px,.72fr)]" },
      h(
        "div",
        { className: "grid min-w-0 gap-4" },
        h(ExecutiveSummaryPolished, { slicers, rows: exactRows, focusSignal }),
        h(LeadershipTable, {
          rows: leadershipRows,
          totalCount: industryRows.length,
          exactCount: exactRows.length,
          filterToken,
          leadershipView,
          setLeadershipView
        })
      ),
      h(
        "aside",
        { className: "grid min-w-0 content-start gap-4", style: { position: "relative", top: "auto" } },
        h("div", { className: "order-1 min-w-0 xl:order-2" }, h(DecisionMatrix, { rows: contextRows, slicers, focusSignal })),
        h("div", { className: "order-2 min-w-0 xl:order-1" }, h(Heatmap, { slicers, hoverCell, setHoverCell, heatmapMode, setHeatmapMode }))
      )
    ),
    h(AppFooter, { slicers })
  );
}

function Header({ slicers }) {
  const reporting = reportingPeriodLabel(slicers.timeRange);
  return h(
    "header",
    { className: "mb-5 grid items-center gap-5 lg:grid-cols-[260px_1fr] xl:grid-cols-[300px_minmax(340px,1fr)_320px] xl:gap-7" },
    h(
      "div",
      { className: "flex min-h-[112px] items-center rounded-lg border border-white/20 bg-transparent p-0 shadow-2xl" },
      h(ParallaxLogo)
    ),
    h(
      "div",
      null,
      h("p", { className: "mb-2 text-xs font-extrabold uppercase text-parallax-teal" }, "Live Intelligence Digest Experience"),
      h("h1", { className: "text-4xl font-black leading-none tracking-normal md:text-6xl" }, "Weekly Operational Intelligence Digest"),
      h("p", { className: "mt-3 text-lg text-parallax-muted" }, "What deserves leadership attention this week, and why.")
    ),
    h(
      "aside",
      { className: `${panelClass} grid gap-2 lg:col-span-2 xl:col-span-1` },
      h("span", { className: "text-sm text-parallax-muted" }, "Reporting Period"),
      h("strong", { className: "text-lg" }, reporting.primary),
      h("em", { className: "not-italic text-sm text-parallax-muted" }, `Generated: ${reporting.generated}`),
      h("span", { className: "text-xs font-extrabold uppercase text-parallax-gold" }, reporting.secondary),
      h(
        "b",
        { className: "inline-flex items-center gap-2 text-sm text-parallax-muted" },
        h("i", { className: "h-2 w-2 animate-softPulse rounded-full bg-parallax-teal shadow-[0_0_18px_#16B5A3]" }),
        "AI Intelligence Active"
      )
    )
  );
}

function currentReportingWindow() {
  const today = new Date();
  const currentDay = today.getDay();
  const daysSinceMonday = (currentDay + 6) % 7;
  const currentWeekMonday = addDays(today, -daysSinceMonday);
  const start = addDays(currentWeekMonday, -7);
  const end = addDays(currentWeekMonday, -1);
  const generated = today;
  return { start, end, generated };
}

function reportingPeriodLabel(timeRange) {
  const { start, end, generated } = currentReportingWindow();
  return {
    primary: `${formatDigestDate(start)} - ${formatDigestDate(end)}`,
    secondary: "Current Reporting Period",
    generated: `${formatDigestDate(generated)} ${generated.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
  };
}

function addDays(date, days) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDigestDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function scenarioDetail(slicers) {
  return (
    scenarios[slicers.division] || {
      audience: "VP, Operations",
      scope: "Enterprise operational portfolio",
      summary: "Compares operational pressure, leadership priorities, and follow-up actions.",
      mapTitle: "Operational Portfolio Map",
      mapSubtitle: "Scenario pressure by operating area",
      mapNodes: [
        { region: "West Region", label: "West Operating Area", x: 105, y: 154 },
        { region: "South Region", label: "South Operating Area", x: 324, y: 247 },
        { region: "Central Region", label: "Central Operating Area", x: 244, y: 152 },
        { region: "North Region", label: "North Operating Area", x: 390, y: 121 }
      ],
      links: [
        ["bars", "Enterprise Operations Dashboard"],
        ["alert", "Executive Risk Briefing"],
        ["action", "Action Portfolio Report"],
        ["scope", "Workflow Reliability View"],
        ["group", "Capacity & Ownership Report"],
        ["map", "Network Risk Map"]
      ]
    }
  );
}

function riskTypesForIndustry(industry) {
  return scenarios[industry]?.riskTypes || [];
}

function riskItemLabel(value) {
  return value === "All Risk Types" ? "All Risk Types" : value;
}

function riskItemScopeLabel(value) {
  return String(value).replace(/All Risk Types/g, "All Risk Types");
}

function ParallaxLogo() {
  return h(
    "img",
    { className: "block h-full max-h-[128px] w-full rounded-[7px] object-cover", src: logoImage, alt: "Parallax Data Lab" }
  );
}

function SlicerBar({ slicers, updateSlicer, resetPresenterView }) {
  const riskTypes = riskTypesForIndustry(slicers.division);
  const fields = [
    ["Region", "region", filters.regions],
    ["Industry", "division", filters.divisions],
    ["Risk Item Type", "selectedSignal", ["All Risk Types", ...riskTypes]],
    ["Time Range", "timeRange", filters.timeRanges],
    ["Impact", "impact", filters.impacts],
    ["Review State", "review", filters.reviewStates]
  ];

  return h(
    "section",
    { className: `${panelClass} mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(6,minmax(0,1fr))_auto]` },
    fields.map(([label, key, options]) =>
      h(
        "label",
        { key, className: "grid gap-1.5" },
        h("span", { className: "text-[.7rem] font-extrabold uppercase text-parallax-muted" }, label),
        h(
          "select",
          {
            className: "min-h-10 rounded-md border border-white/15 bg-[#102461] px-3 text-white outline-none focus:border-parallax-teal focus:ring-2 focus:ring-parallax-teal/20",
            value: slicers[key],
            onChange: (event) => updateSlicer(key, event.target.value)
          },
          options.map((option) => h("option", { key: option, value: option }, riskItemLabel(option)))
        )
      )
    ),
    h(
      "div",
      { className: "grid content-end" },
      h("button", { className: "min-h-10 rounded-md border border-parallax-teal/45 bg-parallax-teal/10 px-3 text-xs font-black uppercase text-parallax-teal transition hover:bg-parallax-teal/20", onClick: resetPresenterView }, "Presenter reset")
    )
  );
}

function MetaStrip({ slicers }) {
  const comparedTo = comparedToLabel(slicers.timeRange);
  const reporting = reportingPeriodLabel(slicers.timeRange);
  const scenario = scenarioDetail(slicers);
  const items = [
    ["user", "Prepared for", scenario.audience, slicers.division],
    ["scope", "Scope", scenario.scope, slicers.region],
    ["refresh", "Data Refresh", reporting.generated, "Live browser date"],
    ["bars", "Compared To", comparedTo[0], comparedTo[1]],
    ["trend", "Baseline", baselineLabel(slicers.timeRange), comparisonLabel(slicers.timeRange)]
  ];

  return h(
    "section",
    { className: `${panelClass} mb-2 grid overflow-hidden p-0 md:grid-cols-3 xl:grid-cols-5` },
    items.map(([icon, label, primary, secondary]) =>
      h(
        "article",
        { key: label, className: "grid grid-cols-[30px_1fr] items-center gap-x-2 gap-y-0.5 border-white/10 p-2.5 md:border-b xl:border-b-0 xl:border-r last:border-r-0" },
        h(Icon, { name: icon, className: "row-span-3 h-6 w-6 text-parallax-gold" }),
        h("span", { className: "text-xs text-parallax-muted" }, label),
        h("strong", { className: "text-sm" }, primary),
        h("em", { className: "text-xs not-italic text-parallax-muted" }, secondary)
      )
    )
  );
}

function ExecutiveTakeaway({ slicers, leadershipRows, contextRows }) {
  const riskTypes = riskTypesForIndustry(slicers.division);
  const regionValues = filters.regions
    .slice(1)
    .map((region) => ({
      region,
      value: Math.round(riskTypes.reduce((sum, signal) => sum + heatValue(slicers, region, signal), 0) / Math.max(riskTypes.length, 1))
    }))
    .sort((a, b) => b.value - a.value);
  const topRisk = leadershipRows[0] || contextRows[0];
  const topRegion = regionValues[0];
  const recommendation = topRisk ? actionLabelFor(topRisk).toLowerCase() : "focus leadership response";
  const sentence = topRisk && topRegion
    ? `${topRisk.pattern} is the leadership story this period, concentrated in ${topRegion.region.replace(" Region", "")}, with Copilot recommending teams ${recommendation}.`
    : "Start with the highest-ranked leadership item, then use the heatmap and Copilot briefing to explain where action should land.";

  return h(
    "section",
    { className: "rounded-lg border border-parallax-gold/25 bg-parallax-gold/10 p-2.5 shadow-[0_0_28px_rgba(245,181,68,.10)]" },
    h("span", { className: "mb-1 block text-[.68rem] font-black uppercase text-parallax-gold" }, "Why this matters"),
    h("strong", { className: "block text-sm leading-snug text-white md:text-base" }, sentence)
  );
}

function GuidedDemoPath({ slicers, executiveRows, leadershipRows, contextRows, focusSignal }) {
  const riskTypes = riskTypesForIndustry(slicers.division);
  const heatmapSignals = slicers.selectedSignal === "All Risk Types" ? riskTypes : [slicers.selectedSignal];
  const regionValues = filters.regions
    .slice(1)
    .map((region) => ({
      region,
      value: Math.round(heatmapSignals.reduce((sum, signal) => sum + heatValue(slicers, region, signal), 0) / Math.max(heatmapSignals.length, 1))
    }))
    .sort((a, b) => b.value - a.value || a.region.localeCompare(b.region));
  const topLeader = leadershipRows[0] || executiveRows[0];
  const topBriefing = contextRows.find((item) => item.direction !== "recovery") || contextRows[0] || topLeader;
  const topRegion = regionValues[0] || { region: slicers.region === "All Regions" ? "West Region" : slicers.region, value: 0 };
  const lens = guideLensForIndustry(slicers.division);
  const steps = [
    {
      icon: "trend",
      label: "Start",
      title: "Executive Summary",
      detail: `${lens.opening} Frame the score and the fastest movement before drilling into rows.`
    },
    {
      icon: "alert",
      label: "Then",
      title: topLeader ? topLeader.pattern : "Top leadership item",
      detail: topLeader ? `Use rank 1 to explain why ${topLeader.signal.toLowerCase()} needs leadership attention.` : "Use the first ranked item to make the operational issue concrete."
    },
    {
      icon: "map",
      label: "Show",
      title: `${topRegion.region.replace(" Region", "")} heatmap`,
      detail: `${topRegion.value} risk score. Point to where the issue concentrates before discussing the response.`
    },
    {
      icon: "bot",
      label: "Close",
      title: "AI Decision Briefing",
      detail: topBriefing ? `Close with the Copilot summary around ${topBriefing.pattern.toLowerCase()} and the recommended intervention.` : "Close with the Copilot summary and recommended intervention."
    }
  ];

  return h(
    "section",
    { className: panelClass },
    h(
      "div",
      { className: "mb-2 flex flex-wrap items-center justify-between gap-2" },
      h("span", null, h("h2", { className: "text-sm font-black uppercase" }, "Guided Demo Path"), h("em", { className: "text-xs not-italic text-parallax-muted" }, lens.positioning)),
      h("span", { className: "rounded-full border border-parallax-gold/30 bg-parallax-gold/10 px-3 py-1 text-[.68rem] font-black uppercase text-parallax-gold" }, slicers.division)
    ),
    h(
      "div",
      { className: "grid gap-2 md:grid-cols-2 xl:grid-cols-4" },
      steps.map((step, index) =>
        h(
          "article",
          {
            key: step.label,
            className: "grid min-h-20 content-start gap-1 rounded-lg border border-white/10 bg-white/[.04] p-2 text-left"
          },
          h("span", { className: "flex items-center justify-between gap-2" }, h("b", { className: "text-[.68rem] font-black uppercase text-parallax-gold" }, `${index + 1}. ${step.label}`), h(Icon, { name: step.icon, className: "h-4 w-4 text-parallax-teal" })),
          h("strong", { className: "text-sm leading-tight text-white" }, step.title),
          h("em", { className: "text-xs leading-snug not-italic text-parallax-muted" }, step.detail)
        )
      )
    )
  );
}

function guideLensForIndustry(industry) {
  return (
    {
      "Manufacturing & Automotive": {
        opening: "Open with production continuity, launch readiness, and supplier flow.",
        positioning: "Presenter path for plants, programs, and supply recovery."
      },
      "Construction & Infrastructure": {
        opening: "Open with schedule protection, inspections, contractor readiness, and permitting.",
        positioning: "Presenter path for project controls and field execution."
      },
      "Energy & Utilities": {
        opening: "Open with reliability, outage response, dispatch, and regulatory exposure.",
        positioning: "Presenter path for operations, grid, and field leadership."
      },
      "Aerospace & Shipbuilding": {
        opening: "Open with certification, nonconformance, rework, and program milestone pressure.",
        positioning: "Presenter path for program, yard, and certification leadership."
      },
      "Logistics & Heavy Haul": {
        opening: "Open with lane reliability, permit readiness, terminal dwell, and custody risk.",
        positioning: "Presenter path for network, fleet, and shipment exposure."
      },
      "Forestry & Logging": {
        opening: "Open with harvest access, weather constraints, equipment readiness, and mill intake.",
        positioning: "Presenter path for harvest, contractor, and mill coordination."
      }
    }[industry] || {
      opening: "Open with the executive signal, then move into the highest-ranked operational item.",
      positioning: "Presenter path for the selected industry."
    }
  );
}

function ExecutiveSummaryPolished({ slicers, rows, focusSignal }) {
  const [flippedKpi, setFlippedKpi] = useState(null);
  const score = overallSignal(rows);
  const [label, level] = signalState(score);
  const things = topThings(slicers, rows);
  const signalColor = level === "low" ? "text-parallax-teal" : level === "medium" ? "text-parallax-gold" : level === "high" ? "text-orange-400" : "text-red-400";
  const metrics = executiveMetrics(slicers, rows);
  const scoreDelta = score - metrics.previousScore;
  const comparison = comparisonLabel(slicers.timeRange);
  const explanationChips = executiveExplanationChips(rows, scoreDelta, slicers);
  const kpis = [
    { icon: "alert", label: "Critical Risks", value: metrics.criticalRisks.current, delta: metrics.criticalRisks.delta, tone: "text-red-400" },
    { icon: "alert", label: "High Impact Risks", value: metrics.highImpactRisks.current, delta: metrics.highImpactRisks.delta, tone: "text-red-400" },
    { icon: "trend", label: "Accelerating Risks", value: metrics.acceleratingRisks.current, delta: metrics.acceleratingRisks.delta, tone: "text-parallax-gold" },
    { icon: "map", label: "Regions Requiring Review", value: metrics.reviewRegions.current, delta: metrics.reviewRegions.delta, tone: "text-parallax-teal" }
  ];
  const changeItems = buildChangeItems(slicers, things, rows);

  return h(
    "section",
    { className: panelClass },
    h("h2", { className: "mb-4 text-sm font-black uppercase" }, "Executive Summary"),
    h(
      "div",
      { className: "grid overflow-hidden rounded-lg border border-white/10 bg-white/[.035] md:grid-cols-2 xl:grid-cols-[1.7fr_repeat(4,minmax(0,1fr))]" },
      h(
        "article",
        { className: "group relative grid min-h-44 place-items-center border-white/10 bg-white/[.035] p-5 text-center md:border-r" },
        h("span", { className: "text-xs font-extrabold uppercase text-parallax-muted" }, "Risk Score (/100)"),
        h(
          "div",
          { className: "my-3 flex items-end justify-center gap-2" },
          h(RiskDonut, { score, level }),
          h("b", { className: "pb-3 text-xl text-parallax-muted" }, "/100")
        ),
        h("strong", { className: `text-sm uppercase ${signalColor}` }, label),
        h("em", { className: `block text-xs not-italic ${scoreDelta > 0 ? "text-red-400" : scoreDelta < 0 ? "text-parallax-teal" : "text-parallax-muted"}` }, deltaLabel(scoreDelta, "pts", comparison)),
        h("span", { className: "mt-3 flex max-w-[300px] flex-wrap justify-center gap-1" }, explanationChips.map((chip) => h("em", { key: chip, className: "rounded-full bg-white/10 px-2 py-0.5 text-[.62rem] not-italic text-parallax-muted" }, chip))),
        h(MetricTooltip, { text: metricDefinition("Risk Score (/100)") })
      ),
      kpis.map((item) =>
        h(KpiFlipCard, {
          key: item.label,
          item,
          comparison,
          flipped: flippedKpi === item.label,
          onFlip: () => setFlippedKpi(flippedKpi === item.label ? null : item.label),
          rows: kpiRiskRows(item.label, rows),
          focusSignal,
          definition: metricDefinition(item.label),
          confidence: confidenceForRows(kpiRiskRows(item.label, rows))
        })
      )
    ),
    h(
      "article",
      { className: "mt-4 rounded-lg border border-white/10 bg-white/[.04] p-4" },
      h(
        "div",
        { className: "mb-3 flex flex-wrap items-center justify-between gap-3" },
        h("span", { className: "text-sm font-extrabold" }, "What changed this reporting period"),
        h("em", { className: "text-xs not-italic text-parallax-muted" }, "Quick scan")
      ),
      h(
        "div",
        { className: "grid gap-2 sm:grid-cols-2 xl:grid-cols-5" },
        changeItems.map((item) =>
          h(
            "article",
            { key: item.label, className: "grid min-h-36 content-start gap-2 rounded-lg border border-white/10 bg-white/[.035] p-3 text-left" },
            h("strong", { className: "text-sm leading-tight text-white" }, item.label),
            h("span", { className: "flex items-center justify-between gap-2" }, h("b", { className: item.delta > 0 ? "text-2xl text-red-400" : item.delta < 0 ? "text-2xl text-parallax-teal" : "text-2xl text-parallax-muted" }, `${item.delta > 0 ? "+" : ""}${item.delta}%`), h(DirectionArrow, { direction: item.direction })),
            h("em", { className: "text-xs not-italic text-parallax-muted" }, `${riskItemLabel(item.signal)} / ${comparison}`),
          h(
            "span",
            { className: "grid gap-1" },
            h(
              "span",
              { className: "grid grid-cols-[1fr_auto] items-center gap-2" },
              h("span", { className: "h-1.5 overflow-hidden rounded-full bg-white/10" }, h("i", { className: `block h-full rounded-full ${changeSeverity(item.delta)}`, style: { width: `${clamp((Math.abs(item.delta) / 20) * 100, 4, 100)}%` } })),
              h("b", { className: "text-[.62rem] text-parallax-muted" }, "20%")
            )
          ),
            h("span", { className: "text-xs leading-snug text-parallax-muted" }, changeNarrative(item))
          )
        )
      )
    )
  );
}

function KpiFlipCard({ item, comparison, flipped, onFlip, rows, focusSignal, definition, confidence }) {
  const visibleRows = rows.filter((risk) => !String(risk.id).startsWith("empty-"));
  return h(
    "article",
    { className: "group relative min-h-44 border-white/10 p-0 text-center md:border-r" },
    !flipped
      ? h(
          "button",
          {
            className: "grid min-h-44 w-full place-items-center p-4",
            onClick: onFlip,
            title: `Show risk details for ${item.label}`
          },
          h(Icon, { name: item.icon, className: `h-9 w-9 ${item.tone}` }),
          h("span", { className: "text-xs font-extrabold text-parallax-muted" }, item.label),
          h("b", { className: "text-4xl font-black text-white" }, item.value),
          h("span", { className: `rounded-full border px-2 py-0.5 text-[.62rem] font-black uppercase ${confidenceClass(confidence)}` }, `${confidence} confidence`),
          h("em", { className: `text-xs not-italic ${item.delta > 0 ? "text-red-400" : item.delta < 0 ? "text-parallax-teal" : "text-parallax-muted"}` }, deltaLabel(item.delta, "", comparison)),
          h(MetricTooltip, { text: definition })
        )
      : h(
          "div",
          { className: "grid h-44 content-start gap-2 overflow-y-auto bg-[#071033]/90 p-3 text-left" },
          h(
            "button",
            { className: `flex items-center justify-between gap-2 rounded-md border border-white/10 bg-white/[.06] px-2 py-1.5 ${item.tone}`, onClick: onFlip, title: "Return to metric" },
            h("strong", { className: "text-xs text-white" }, `${item.label} details`),
            h(Icon, { name: item.icon, className: "h-4 w-4" })
          ),
          visibleRows.length
            ? visibleRows.map((risk) =>
                h(
                  "button",
                  { key: risk.id, className: "grid gap-1 rounded-md border border-white/10 bg-white/[.05] p-2 text-left text-[.7rem] leading-snug text-parallax-muted hover:border-parallax-teal/50", onClick: () => focusSignal(risk.signal) },
                  h("span", { className: "grid gap-1" }, h("b", { className: "whitespace-normal text-sm leading-tight text-white" }, risk.pattern), h("strong", { className: "text-xl text-parallax-gold" }, risk.score)),
                  h("span", { className: "text-[.62rem] font-black uppercase text-parallax-teal" }, risk.signal),
                  h("em", { className: "not-italic" }, `${risk.region} / ${risk.impact} / ${risk.review}`),
                  h("span", { className: "text-[.68rem] leading-snug" }, risk.why.split(",")[0])
                )
              )
            : h("p", { className: "rounded-md border border-white/10 bg-white/[.04] p-2 text-xs text-parallax-muted" }, "No matching risk details for the current filters.")
        )
  );
}

function MetricTooltip({ text }) {
  return h(
    "span",
    {
      className:
        "pointer-events-none absolute left-3 right-3 top-3 z-20 rounded-md border border-parallax-teal/30 bg-[#071033]/95 p-3 text-left text-xs leading-snug text-parallax-muted opacity-0 shadow-[0_16px_50px_rgba(0,0,0,.34)] backdrop-blur transition group-hover:opacity-100 group-focus-within:opacity-100"
    },
    text
  );
}

function metricDefinition(label) {
  return (
    {
      "Risk Score (/100)": "Predictive risk pressure score for the current filter set. Higher values indicate more severe, recurring, unresolved, or accelerating operational risk items.",
      "Critical Risks": "Risk items with very high current pressure scores. These are the items most likely to require leadership attention.",
      "High Impact Risks": "Risk items tagged as high operational impact based on potential consequence, scope, or exposure.",
      "Accelerating Risks": "Risk items worsening faster than the comparison period. This is trend pressure, not total severity.",
      "Regions Requiring Review": "Regions containing unresolved or assigned risk items that need follow-up ownership."
    }[label] || "Executive summary metric."
  );
}

function confidenceForRows(rows) {
  const realRows = rows.filter((item) => !String(item.id).startsWith("empty-"));
  if (realRows.length >= 3) return "High";
  if (realRows.length >= 1) return "Medium";
  return "Low";
}

function executiveExplanationChips(rows, scoreDelta, slicers) {
  const realRows = rows.filter((item) => !String(item.id).startsWith("empty-"));
  const accelerating = realRows.filter((item) => item.delta > 10 && item.direction !== "recovery").length;
  const unresolved = realRows.filter((item) => item.review === "Needs Review" || item.review === "Assigned").length;
  const regions = new Set(realRows.map((item) => item.region)).size;
  return [
    accelerating ? `Driven by ${accelerating} accelerating items` : "Driven by stable trend pressure",
    `${regions} regions affected`,
    `${unresolved} unresolved items`,
    `prior period ${scoreDelta > 0 ? "+" : ""}${scoreDelta} pts`
  ];
}

function confidenceForItem(item) {
  if (item.score >= 84 && item.impact === "High" && item.review === "Needs Review") return "High";
  if (item.score >= 70 || item.impact === "High" || item.review === "Assigned") return "Medium";
  return "Low";
}

function confidenceClass(confidence) {
  return (
    {
      High: "border-parallax-teal/35 bg-parallax-teal/10 text-parallax-teal",
      Medium: "border-parallax-gold/35 bg-parallax-gold/10 text-parallax-gold",
      Low: "border-white/15 bg-white/[.05] text-parallax-muted"
    }[confidence] || "border-white/15 bg-white/[.05] text-parallax-muted"
  );
}

function executiveMetrics(slicers, rows) {
  const previousRows = previousComparableRows(slicers, rows);
  const measure = (source) => ({
    score: overallSignal(source),
    criticalRisks: source.filter((item) => item.score >= 84).length,
    highImpactRisks: source.filter((item) => item.impact === "High").length,
    acceleratingRisks: source.filter((item) => item.delta > 10 && item.direction !== "recovery").length,
    reviewRegions: new Set(source.filter((item) => item.review === "Needs Review" || item.review === "Assigned").map((item) => item.region)).size
  });
  const current = measure(rows);
  const previous = measure(previousRows);
  return {
    previousScore: previous.score,
    criticalRisks: metricDelta(current.criticalRisks, previous.criticalRisks),
    highImpactRisks: metricDelta(current.highImpactRisks, previous.highImpactRisks),
    acceleratingRisks: metricDelta(current.acceleratingRisks, previous.acceleratingRisks),
    reviewRegions: metricDelta(current.reviewRegions, previous.reviewRegions)
  };
}

function previousComparableRows(slicers, rows) {
  const adjustment =
    {
      "Previous Week": -5,
      "Previous Month": -7,
      "Previous Quarter": -9,
      "Previous Year": -12
    }[slicers.timeRange] || -5;
  return rows.map((item, index) => ({
    ...item,
    score: clamp(item.score + adjustment + (index % 3) - 1, 28, 98),
    delta: item.delta - 3
  }));
}

function metricDelta(current, previous) {
  return { current, delta: current - previous };
}

function deltaLabel(delta, unit = "", comparison = "") {
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const suffix = unit ? ` ${unit}` : "";
  return `${direction} ${Math.abs(delta)}${suffix} ${comparison}`.trim();
}

function changeSeverity(delta) {
  const absolute = Math.abs(delta);
  if (delta < 0) return "bg-parallax-teal shadow-[0_0_12px_rgba(22,181,163,.36)]";
  if (absolute >= 14) return "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,.36)]";
  if (absolute >= 8) return "bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,.32)]";
  if (absolute >= 3) return "bg-parallax-gold shadow-[0_0_12px_rgba(245,181,68,.30)]";
  return "bg-white/35";
}

function kpiRiskRows(label, rows) {
  const filtered =
    {
      "Critical Risks": rows.filter((item) => item.score >= 84),
      "High Impact Risks": rows.filter((item) => item.impact === "High"),
      "Accelerating Risks": rows.filter((item) => item.delta > 10 && item.direction !== "recovery"),
      "Regions Requiring Review": rows.filter((item) => item.review === "Needs Review" || item.review === "Assigned")
    }[label] || rows;
  const selected = [...filtered].sort((a, b) => b.score - a.score || Math.abs(b.delta) - Math.abs(a.delta));
  return selected.length
    ? selected
    : [
        {
          id: `empty-${label}`,
          pattern: "No matching risks under current filters",
          region: "Current filter set",
          score: "--",
          signal: "All Risk Types"
        }
      ];
}

function RiskDonut({ score, level }) {
  const color = level === "low" ? "#16B5A3" : level === "medium" ? "#F5B544" : level === "high" ? "#F97316" : "#EF4444";
  return h(
    "span",
    {
      className: "grid h-24 w-24 place-items-center rounded-full p-2 shadow-gold",
      style: { background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,.10) 0deg)` }
    },
    h("span", { className: "grid h-full w-full place-items-center rounded-full bg-[#0B1745]" }, h("b", { className: "text-4xl font-black text-white" }, score))
  );
}

function buildChangeItems(slicers, things, rows) {
  const scoped = scoredPatterns(slicers);
  const sourceRows = rows.length ? rows : scoped;
  const priority = ensureThreeThings(things).map((item, index) => {
    const metric = changeMetricForSignal(slicers, item.signal, sourceRows, index);
    return {
      label: item.pattern,
      signal: item.signal,
      delta: metric.delta,
      direction: metric.direction,
      summary: metric.level,
      mover: metric.mover
    };
  });
  const directional = riskTypesForIndustry(slicers.division)
    .map((signal, index) => ({ signal, ...changeMetricForSignal(slicers, signal, scoped, index + 2) }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .map((item) => ({
      label: item.signal,
      signal: item.signal,
      delta: item.delta,
      direction: item.direction,
      summary: item.level,
      mover: item.mover
    }));

  const seen = new Set();
  return [...priority, ...directional].filter((item) => {
    if (seen.has(item.label)) return false;
    seen.add(item.label);
    return true;
  }).slice(0, 5);
}

function changeMetricForSignal(slicers, signal, rows, index = 0) {
  const signalRows = rows.filter((item) => signal === "All Risk Types" || item.signal === signal);
  const candidates = signalRows.length ? signalRows : scoredPatterns({ ...slicers, selectedSignal: "All Risk Types" }).filter((item) => item.signal === signal);
  const timeScale =
    {
      "Previous Week": 3.2,
      "Previous Month": 4.8,
      "Previous Quarter": 6.4,
      "Previous Year": 8.2
    }[slicers.timeRange] || 3.2;
  const ranked = candidates
    .map((item, rowIndex) => {
      const raw = Math.round((item.trend[item.trend.length - 1] - item.trend[0]) / timeScale);
      const directional = item.direction === "recovery" ? -Math.abs(raw || item.delta || 4) : item.direction === "down" ? -Math.abs(raw || 3) : raw || item.delta || 0;
      const rowVariance = ((item.score + item.pattern.length + item.region.length + index * 7 + rowIndex * 3) % 11) - 5;
      const signalVariance = ((signal.length * 3 + slicers.division.length + slicers.timeRange.length) % 7) - 3;
      const shaped = clamp(directional + rowVariance + signalVariance, -18, 22);
      return { item, delta: shaped };
    })
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const fallback = signalDirectionMetric(slicers, signal);
  const top = ranked[0];
  const delta = top ? top.delta : fallback.delta;
  const direction = delta >= 4 ? "up" : delta <= -4 ? "down" : "flat";
  const level = Math.abs(delta) >= 12 ? "Severe" : Math.abs(delta) >= 7 ? "Elevated" : Math.abs(delta) >= 3 ? "Watch" : "Stable";
  return {
    delta,
    direction,
    level,
    mover: top ? { pattern: top.item.pattern, region: top.item.region, division: top.item.division, delta: top.delta } : null
  };
}

function changeNarrative(item) {
  const mover = item.mover;
  const movement = item.delta > 0 ? "pressure rose" : item.delta < 0 ? "pressure improved" : "pressure stayed steady";
  const leader = mover ? `${mover.pattern} in ${mover.region}` : item.signal;
  return `${movement}: ${leader}.`;
}

function DirectionArrow({ direction }) {
  const classes =
    direction === "up"
      ? "rotate-[-45deg] text-red-400"
      : direction === "down"
        ? "rotate-45 text-parallax-teal"
        : "text-parallax-muted";
  return h(
    "svg",
    { className: `h-5 w-5 ${classes}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.3", strokeLinecap: "round", strokeLinejoin: "round" },
    h("path", { d: "M5 12h14" }),
    h("path", { d: "m13 6 6 6-6 6" })
  );
}

function comparisonLabelFromToken(filterToken) {
  return comparisonLabel(filterToken.split("|")[3]);
}

function ensureThreeThings(things) {
  const fallback = [
    {
      id: "fallback-escalation",
      pattern: "Escalation Response Breakdown",
      why: "Escalation volume is rising while closure speed is slowing, requiring leadership review this week.",
      kind: "risk"
    },
    {
      id: "fallback-open-text",
      pattern: "Open Text Fatigue Concern",
      why: "Narrative observations show fatigue, overtime compression, and missed rest-window signals above baseline.",
      kind: "open-text"
    },
    {
      id: "fallback-recovery",
      pattern: "Operational Recovery Opportunity",
      why: "Several regions show recoverable follow-up queues where supervisor cadence can reduce aging risk.",
      kind: "recovery"
    }
  ];
  const ids = new Set(things.map((item) => item.id));
  const padded = [...things];
  fallback.forEach((item) => {
    if (padded.length < 3 && !ids.has(item.id)) padded.push(item);
  });
  return padded.slice(0, 3);
}

function signalTheme(signal) {
  return (
    {
      Escalations: "border-red-400/30 bg-red-500/15 text-red-300 shadow-[0_0_20px_rgba(239,68,68,.14)]",
      "Actions / CA": "border-orange-300/35 bg-orange-400/15 text-orange-200 shadow-[0_0_20px_rgba(249,115,22,.14)]",
      Assignments: "border-violet-300/35 bg-violet-500/15 text-violet-200 shadow-[0_0_20px_rgba(124,58,237,.14)]",
      Workflows: "border-parallax-blue/40 bg-parallax-blue/15 text-blue-200 shadow-[0_0_20px_rgba(31,106,229,.14)]",
      Compliance: "border-parallax-gold/40 bg-parallax-gold/15 text-parallax-gold shadow-[0_0_20px_rgba(245,181,68,.14)]",
      "Open Text": "border-parallax-teal/40 bg-parallax-teal/15 text-parallax-teal shadow-[0_0_20px_rgba(22,181,163,.14)]"
    }[signal] || "border-white/10 bg-white/5 text-parallax-muted"
  );
}

function PatternIcon({ signal, compact = false }) {
  const icon = { Escalations: "alert", "Actions / CA": "clock", Assignments: "group", Workflows: "refresh", Compliance: "bars", "Open Text": "bot" }[signal] || "trend";
  return h(
    "span",
    {
      className: `grid ${compact ? "h-9 w-9" : "h-10 w-10"} place-items-center rounded-lg border ${signalTheme(signal)}`
    },
    h(Icon, { name: icon, className: compact ? "h-4.5 w-4.5" : "h-5 w-5" })
  );
}

function criticalityDrivers(item) {
  const drivers = [];
  drivers.push(`Score ${item.score}`);
  drivers.push(item.direction === "recovery" ? `Improving ${item.delta} pts` : `Trend +${item.delta} pts`);
  if (item.review === "Needs Review" || item.review === "Assigned") drivers.push(item.review);
  else drivers.push(item.region.replace(" Region", ""));
  return drivers.slice(0, 3);
}

function LeadershipTable({ rows, totalCount, exactCount, filterToken, leadershipView, setLeadershipView }) {
  const headers = [
    ["id", "Rank"],
    ["pattern", "Pattern"],
    ["why", "Why It Matters"],
    ["impact", "Impact"],
    ["score", "Risk"],
    ["delta", "Trend vs Prior Period Comparison"],
    ["region", "Affected Scope"],
    ["action", "Recommended Action"]
  ];
  const rankColors = ["#EF4444", "#F97316", "#F5B544", "#7C3AED", "#16A34A"];
  const priorityRank = new Map([...rows].sort((a, b) => b.score - a.score || a.pattern.localeCompare(b.pattern)).map((item, index) => [item.id, index + 1]));

  return h(
    "section",
    { className: `${panelClass} min-w-0` },
    h(
      "div",
      { className: "mb-4 flex flex-wrap items-center justify-between gap-4" },
      h("h2", { className: "text-sm font-black uppercase" }, "Top Leadership Attention Items"),
      h(
        "div",
        { className: "flex items-center gap-3" },
        h("span", { className: "text-xs font-extrabold text-parallax-gold" }, `${rows.length} shown / ${totalCount} total patterns / ${exactCount} exact matches`),
        h(
          "select",
          {
            className: "rounded-md border border-white/15 bg-[#102461] px-3 py-2 text-xs font-extrabold text-white outline-none focus:border-parallax-teal",
            value: leadershipView,
            onChange: (event) => setLeadershipView(event.target.value)
          },
          h("option", { value: "top5" }, "Top 5"),
          h("option", { value: "all" }, "View all patterns")
        )
      )
    ),
    h(
      "div",
      { className: "grid gap-2 md:hidden" },
      rows.slice(0, 5).map((item) =>
        h(
          "article",
          { key: `mobile-${item.id}`, className: "grid gap-2 rounded-lg border border-white/10 bg-white/[.04] p-3 text-sm text-parallax-muted" },
          h("span", { className: "flex items-start justify-between gap-3" }, h("strong", { className: "text-white" }, item.pattern), h("b", { className: "text-xl text-parallax-gold" }, item.score)),
          h("span", { className: "text-xs leading-snug" }, item.why),
          h("span", { className: "flex flex-wrap gap-1" }, criticalityDrivers(item).map((driver) => h("em", { key: driver, className: "rounded-full bg-white/10 px-2 py-0.5 text-[.62rem] not-italic" }, driver))),
          h("span", { className: "text-[.68rem] font-black uppercase text-parallax-teal" }, `${item.region} / ${item.signal}`)
        )
      )
    ),
    h(
      "div",
      { className: "hidden max-w-full max-h-[70vh] overflow-auto pr-2 md:block md:h-[640px] md:max-h-none" },
      h(
        "table",
        { className: "w-full min-w-[1080px] border-collapse text-sm" },
        h(
          "thead",
          { className: "sticky top-0 z-10 bg-[#0B1745]/95 backdrop-blur" },
          h("tr", null, headers.map(([key, label]) => h("th", { key, className: "border-b border-white/10 p-3 text-left font-extrabold text-parallax-muted" }, label)))
        ),
        h(
          "tbody",
          null,
          rows.map((item, index) =>
            h(
              "tr",
              { key: item.id, className: "transition hover:bg-parallax-blue/10" },
              h("td", { className: "border-b border-white/10 p-3" }, h("span", { className: "grid h-10 w-10 place-items-center rounded-full font-black text-white", style: { background: rankColors[(priorityRank.get(item.id) - 1) % rankColors.length] } }, priorityRank.get(item.id))),
              h(
                "td",
                { className: "border-b border-white/10 p-3" },
                h(
                  "div",
                  { className: "grid grid-cols-[40px_1fr] items-center gap-3" },
                  h(PatternIcon, { signal: item.signal }),
                  h(
                    "span",
                    null,
                    h("strong", { className: "block" }, item.pattern),
                    h("em", { className: `mt-1 inline-flex rounded-full border px-2 py-0.5 text-[.62rem] not-italic uppercase ${confidenceClass(confidenceForItem(item))}` }, `${confidenceForItem(item)} confidence`),
                    item.related && h("em", { className: "ml-1 text-[.7rem] not-italic font-extrabold uppercase text-parallax-gold" }, "Related priority")
                  )
                )
              ),
              h("td", { className: "border-b border-white/10 p-3 text-parallax-muted" }, item.why),
              h("td", { className: "border-b border-white/10 p-3" }, h("mark", { className: `rounded-md px-3 py-2 text-white ${item.impact === "High" ? "bg-red-500/30" : item.impact === "Medium" ? "bg-parallax-gold text-[#171100]" : "bg-parallax-teal text-[#062519]"}` }, item.impact)),
              h(
                "td",
                { className: "border-b border-white/10 p-3" },
                h(
                  "span",
                  { className: "grid min-w-20 gap-1" },
                  h("b", { className: "text-xl text-white" }, item.score),
                  h(
                    "i",
                    { className: "h-1.5 overflow-hidden rounded-full bg-white/10 not-italic" },
                    h("span", { className: "block h-full rounded-full", style: { width: `${clamp(item.score, 20, 98)}%`, background: rankColors[index % rankColors.length] } })
                  ),
                  h(
                    "span",
                    { className: "mt-1 flex max-w-[220px] flex-wrap gap-1" },
                    criticalityDrivers(item).map((driver) => h("em", { key: driver, className: "rounded-full bg-white/10 px-2 py-0.5 text-[.62rem] not-italic text-parallax-muted" }, driver))
                  )
                )
              ),
              h(
                "td",
                { className: "border-b border-white/10 p-3" },
                h(MicroTrend, { values: item.trend.map((value) => clamp(value + item.delta / 4, 10, 92)), color: rankColors[index % rankColors.length], token: `${filterToken}-${item.id}` }),
                h("span", { className: "mt-1 block text-xs text-parallax-muted" }, `${item.delta > 0 ? "+" : ""}${item.delta} pts ${comparisonLabelFromToken(filterToken)}`)
              ),
              h("td", { className: "border-b border-white/10 p-3" }, h("strong", { className: "block" }, item.region), h("span", { className: "text-parallax-muted" }, item.division)),
              h(
                "td",
                { className: "border-b border-white/10 p-3" },
                h(
                  "button",
                  { className: "max-w-[260px] rounded-md border border-parallax-gold/45 bg-parallax-gold/10 px-3 py-2 text-left text-xs text-parallax-gold transition hover:bg-parallax-gold/20" },
                  h("strong", { className: "block text-white" }, actionLabelFor(item)),
                  h("em", { className: "mt-1 block not-italic text-parallax-muted" }, interventionFor(item))
                )
              )
            )
          )
        )
      )
    )
  );
}
function LowerDigest({ slicers, exactRows, contextRows, focusSignal, filterToken }) {
  const cardLimit = 3;
  const comparison = comparisonLabel(slicers.timeRange);
  const relevantRows = exactRows.length ? exactRows : contextRows;
  const followUps = fillRows(relevantRows.filter((item) => item.direction !== "recovery"), contextRows).slice(0, cardLimit);
  const openTextRows = fillRows(
    relevantRows.filter((item) => item.signal === "Open Text"),
    contextRows.filter((item) => item.signal === "Open Text")
  );
  const openText = openTextRows.slice(0, cardLimit);
  const openTextCount = openTextRows.length;
  const recovery = fillRows(
    relevantRows.filter((item) => item.direction === "recovery"),
    contextRows.filter((item) => item.direction === "recovery")
  ).slice(0, cardLimit);
  const complianceRows = fillRows(
    relevantRows.filter((item) => item.signal === "Compliance"),
    contextRows.filter((item) => item.signal === "Compliance")
  ).slice(0, cardLimit);
  const scope = `${slicers.region} / ${slicers.division} / ${slicers.selectedSignal}`;

  return h(
    "section",
    { className: "mt-4 grid gap-4 lg:grid-cols-2 2xl:grid-cols-4" },
    h(
      MiniCard,
      { title: "Risk Item Watchlist", summary: "Cross-item pressure by risk family", meta: riskItemScopeLabel(scope) },
      h(SignalPressureSummary, { rows: relevantRows, comparison, focusSignal })
    ),
    h(
      MiniCard,
      { title: "Operational Follow-Up Risks", summary: `${followUps.length} queues under review`, meta: comparison },
      h(MiniMetricStrip, { rows: followUps, label: "follow-up pressure" }),
      followUps.map((item) =>
        h(
          "button",
          {
            key: item.id,
            className:
              "grid grid-cols-[38px_minmax(0,1fr)_minmax(82px,108px)] items-center gap-3 rounded-lg border border-white/10 bg-white/[.04] p-3 text-left text-sm text-parallax-muted transition hover:-translate-y-0.5 hover:border-parallax-teal/50 hover:bg-parallax-blue/15",
            onClick: () => focusSignal(item.signal)
          },
          h(PatternIcon, { signal: item.signal, compact: true }),
          h(
            "span",
            null,
            h("strong", { className: "block text-white" }, followUpTitle(item.signal)),
            h("b", { className: "mt-1 block text-2xl text-white" }, followUpValue(item)),
            h("em", { className: "not-italic" }, `${item.delta > 0 ? "+" : ""}${item.delta}% ${comparison}`),
            h("span", { className: "mt-1 block text-xs text-parallax-gold" }, `${item.region} / ${item.review}`)
          ),
          h(MicroTrend, { values: item.trend, color: item.color, token: `${filterToken}-follow-${item.id}` })
        )
      )
    ),
    h(
      MiniCard,
      { title: "5. Compliance Performance", summary: "Measured separately from predictive risk pressure", meta: comparison },
      h(CompliancePerformance, { rows: complianceRows, sourceRows: relevantRows, focusSignal })
    ),
    h(
      MiniCard,
      { title: "6. Narrative & Recovery Context", summary: `${openTextCount} open-text clusters / ${recovery.length} recovery risk items`, meta: `${slicers.region} / ${slicers.division}` },
      h(
        "div",
        { className: "grid gap-2" },
        openText.slice(0, 2).map((item) => h(MiniSignalRow, { key: item.id, item, onClick: () => focusSignal("Open Text"), openText: true, comparison })),
        recovery.slice(0, 2).map((item) =>
          h(
            "button",
            {
              key: item.id,
              className:
                "grid grid-cols-[38px_1fr] gap-3 rounded-lg border border-parallax-teal/30 bg-parallax-teal/10 p-3 text-left text-sm text-parallax-muted transition hover:-translate-y-0.5 hover:border-parallax-teal/60",
              onClick: () => focusSignal(item.signal)
            },
            h(
              "span",
              {
                className:
                  "grid h-9 w-9 place-items-center rounded-lg border border-parallax-teal/40 bg-parallax-teal/15 text-parallax-teal shadow-[0_0_20px_rgba(22,181,163,.14)]"
              },
              h(Icon, { name: "check", className: "h-5 w-5" })
            ),
            h(
              "span",
              null,
              h("strong", { className: "block text-white" }, item.pattern),
              h("em", { className: "not-italic" }, item.why),
              h("span", { className: "mt-2 block text-xs font-extrabold text-parallax-teal" }, `${Math.abs(item.delta)} pt improvement confidence / ${item.region}`)
            )
          )
        )
      )
    )
  );
}

function fillRows(primary, fallback) {
  const seen = new Set();
  return [...primary, ...fallback].filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function MiniCard({ title, summary, meta, children }) {
  return h(
    "article",
    { className: `${panelClass} grid max-h-[460px] content-start gap-3 overflow-y-auto pr-2` },
    h("div", { className: "grid gap-1" }, h("h2", { className: "text-sm font-black uppercase" }, title), summary && h("p", { className: "text-xs font-extrabold text-parallax-gold" }, summary), meta && h("p", { className: "text-xs text-parallax-muted" }, meta)),
    children
  );
}

function SignalPressureSummary({ rows, comparison, focusSignal }) {
  const rowSignals = [...new Set(rows.map((item) => item.signal))];
  const summaries = rowSignals
    .map((signal) => {
      const signalRows = rows.filter((item) => item.signal === signal);
      const source = signalRows.length ? signalRows : [];
      const avg = source.length ? Math.round(source.reduce((sum, item) => sum + item.score, 0) / source.length) : 0;
      const delta = source.length ? Math.round(source.reduce((sum, item) => sum + item.delta, 0) / source.length) : 0;
      const count = source.length;
      return { signal, avg, delta, count, top: [...source].sort((a, b) => b.score - a.score)[0] };
    })
    .filter((item) => item.count)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  return h(
    "div",
    { className: "grid gap-2" },
    summaries.map((item) =>
      h(
        "button",
        {
          key: item.signal,
          className: "grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[.04] p-3 text-left text-sm text-parallax-muted transition hover:-translate-y-0.5 hover:border-parallax-teal/50 hover:bg-parallax-blue/15",
          onClick: () => focusSignal(item.signal)
        },
        h(PatternIcon, { signal: item.signal, compact: true }),
        h(
          "span",
          { className: "min-w-0" },
          h("strong", { className: "block truncate text-white" }, riskItemLabel(item.signal)),
          h("em", { className: "block truncate not-italic" }, item.top ? `${item.top.region} / ${item.top.pattern}` : comparison),
          h(
            "span",
            { className: "mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10" },
            h("i", { className: `block h-full rounded-full ${changeSeverity(item.delta)}`, style: { width: `${clamp(item.avg, 12, 100)}%` } })
          )
        ),
        h(
          "span",
          { className: "text-right" },
          h("b", { className: "block text-xl text-white" }, item.avg),
          h("em", { className: `not-italic ${item.delta > 0 ? "text-red-400" : item.delta < 0 ? "text-parallax-teal" : "text-parallax-muted"}` }, `${item.delta > 0 ? "+" : ""}${item.delta}`)
        )
      )
    ),
    !summaries.length && h("p", { className: "rounded-lg border border-white/10 bg-white/[.04] p-3 text-sm text-parallax-muted" }, "No active risk item pressure under the current filters.")
  );
}

function CompliancePerformance({ rows, sourceRows, focusSignal }) {
  const score = complianceScore(sourceRows);
  const confidence = confidenceForRows(rows);
  const source = rows.length ? rows : sourceRows.filter((item) => item.signal === "Compliance").slice(0, 3);
  return h(
    "div",
    { className: "grid gap-3" },
    h(
      "div",
      { className: "grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[.04] p-3" },
      h(
        "span",
        null,
        h("strong", { className: "block text-white" }, "Compliance Performance Score"),
        h("em", { className: "not-italic text-parallax-muted" }, "Higher is better; measured separately from predictive risk pressure."),
        h("span", { className: `mt-2 inline-block rounded-full border px-2 py-0.5 text-[.62rem] font-black uppercase ${confidenceClass(confidence)}` }, `${confidence} confidence`)
      ),
      h("b", { className: score >= 82 ? "text-3xl text-parallax-teal" : score >= 72 ? "text-3xl text-parallax-gold" : "text-3xl text-red-400" }, score)
    ),
    source.slice(0, 3).map((item) =>
      h(
        "button",
        {
          key: item.id,
          className: "grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[.04] p-3 text-left text-sm text-parallax-muted transition hover:-translate-y-0.5 hover:border-parallax-teal/50",
          onClick: () => focusSignal("Compliance")
        },
        h("span", null, h("strong", { className: "block text-white" }, item.pattern), h("em", { className: "not-italic" }, `${item.region} / ${item.division}`)),
        h("b", { className: item.direction === "recovery" ? "text-parallax-teal" : "text-parallax-gold" }, item.direction === "recovery" ? "Improving" : "Watch")
      )
    )
  );
}

function MiniMetricStrip({ rows, label }) {
  const avg = rows.length ? Math.round(rows.reduce((sum, item) => sum + item.score, 0) / rows.length) : 0;
  const high = rows.filter((item) => item.impact === "High").length;
  return h(
    "div",
    { className: "grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-white/[.035] p-3 text-center" },
    h("span", null, h("b", { className: "block text-lg text-white" }, rows.length), h("em", { className: "text-[.65rem] not-italic text-parallax-muted" }, "risk items")),
    h("span", null, h("b", { className: "block text-lg text-white" }, avg), h("em", { className: "text-[.65rem] not-italic text-parallax-muted" }, "avg score")),
    h("span", null, h("b", { className: "block text-lg text-red-400" }, high), h("em", { className: "text-[.65rem] not-italic text-parallax-muted" }, label))
  );
}

function MiniSignalRow({ item, onClick, openText = false, comparison = "vs. comparison" }) {
  return h(
    "button",
    { className: "grid grid-cols-[38px_1fr] gap-3 rounded-lg border border-white/10 bg-white/[.04] p-3 text-left text-sm text-parallax-muted transition hover:-translate-y-0.5 hover:border-parallax-teal/50 hover:bg-parallax-blue/15", onClick },
    h(PatternIcon, { signal: openText ? "Open Text" : item.signal, compact: true }),
    h(
      "span",
      null,
      h("strong", { className: "block text-white" }, item.pattern),
      h("em", { className: "not-italic" }, openText ? item.why : `${item.region} / ${item.delta > 0 ? "+" : ""}${item.delta}% ${comparison}`),
      h(
        "span",
        { className: "mt-2 flex flex-wrap gap-2 text-[.65rem] font-extrabold uppercase" },
        h("i", { className: "rounded-full bg-white/10 px-2 py-1 not-italic text-parallax-muted" }, item.division),
        h("i", { className: "rounded-full bg-white/10 px-2 py-1 not-italic text-parallax-muted" }, item.review),
        h("i", { className: "rounded-full bg-parallax-blue/20 px-2 py-1 not-italic text-parallax-teal" }, `Score ${item.score}`)
      )
    )
  );
}

function Heatmap({ slicers, hoverCell, setHoverCell, heatmapMode, setHeatmapMode }) {
  const baseRegions = slicers.region === "All Regions" ? filters.regions.slice(1) : [slicers.region];
  const baseRiskTypes = riskTypesForIndustry(slicers.division);
  const activeSignals = slicers.selectedSignal === "All Risk Types" ? baseRiskTypes : [slicers.selectedSignal];
  const heatmapSignals = slicers.selectedSignal === "All Risk Types" ? baseRiskTypes : [slicers.selectedSignal];
  const regionRisk = (region) => Math.round(heatmapSignals.reduce((sum, signal) => sum + heatValue(slicers, region, signal), 0) / Math.max(heatmapSignals.length, 1));
  const regions = baseRegions
    .map((region) => ({ region, value: regionRisk(region) }))
    .sort((a, b) => b.value - a.value || a.region.localeCompare(b.region))
    .map((item) => item.region);
  const riskTypes = slicers.selectedSignal === "All Risk Types"
    ? baseRiskTypes
        .map((signal) => ({
          signal,
          value: Math.round(baseRegions.reduce((sum, region) => sum + heatValue(slicers, region, signal), 0) / Math.max(baseRegions.length, 1))
        }))
        .sort((a, b) => b.value - a.value || a.signal.localeCompare(b.signal))
        .map((item) => item.signal)
    : [slicers.selectedSignal];
  const detail = hoverCell || {
    region: regions[0] || (slicers.region === "All Regions" ? "West Region" : slicers.region),
    signal: slicers.selectedSignal === "All Risk Types" ? riskTypes[0] : slicers.selectedSignal
  };
  const detailValue = heatmapMode === "total" || heatmapMode === "map" ? regionRisk(detail.region) : heatValue(slicers, detail.region, detail.signal);
  const regionValues = regions.map((region) => ({ region, value: regionRisk(region) }));
  const regionsAboveThreshold = regionValues.filter((item) => item.value >= 70).length;
  const highestSignal = heatmapSignals
    .map((signal) => ({ signal, value: heatValue(slicers, detail.region, signal) }))
    .sort((a, b) => b.value - a.value)[0];

  return h(
    "section",
    { className: `${panelClass} min-w-0 overflow-hidden`, style: { position: "relative", top: "auto", alignSelf: "start" } },
    h(
      "div",
      { className: "mb-4 flex flex-wrap items-center justify-between gap-3" },
      h("h2", { className: "text-sm font-black uppercase" }, "Operational Risk Item Heatmap"),
      h(
        "div",
        { className: "flex items-center gap-2" },
        h(
          "button",
          {
            className: `rounded-md border px-3 py-1.5 text-[.68rem] font-black uppercase ${heatmapMode === "signals" ? "border-parallax-teal bg-parallax-teal/15 text-parallax-teal" : "border-white/10 bg-white/[.04] text-parallax-muted"}`,
            onClick: () => setHeatmapMode("signals")
          },
          "Risk item breakout"
        ),
        h(
          "button",
          {
            className: `rounded-md border px-3 py-1.5 text-[.68rem] font-black uppercase ${heatmapMode === "total" ? "border-parallax-gold bg-parallax-gold/15 text-parallax-gold" : "border-white/10 bg-white/[.04] text-parallax-muted"}`,
            onClick: () => setHeatmapMode("total")
          },
          "Total risk"
        ),
        h(
          "button",
          {
            className: `inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-[.68rem] font-black uppercase ${heatmapMode === "map" ? "border-parallax-blue bg-parallax-blue/15 text-blue-200" : "border-white/10 bg-white/[.04] text-parallax-muted"}`,
            onClick: () => setHeatmapMode("map")
          },
          h(Icon, { name: "map", className: "h-3.5 w-3.5" }),
          "Scenario map"
        )
      )
    ),
    heatmapMode === "signals"
      ? h(
          "div",
          {
            className: "grid w-full gap-2",
            style: { gridTemplateColumns: `minmax(128px,1.15fr) repeat(${regions.length}, minmax(0,1fr))` }
          },
          h("span"),
          regions.map((region) => h("strong", { key: region, className: "grid min-h-10 place-items-center text-center text-[.65rem] leading-tight text-parallax-muted" }, region.replace(" Region", ""))),
          riskTypes.flatMap((signal) => [
            h("b", { key: `${signal}-label`, className: "grid min-h-14 items-center justify-start text-sm leading-tight" }, riskItemLabel(signal)),
            ...regions.map((region) => {
              const value = heatValue(slicers, region, signal);
              const isFocusedSignal = slicers.selectedSignal !== "All Risk Types" && activeSignals.includes(signal);
              return h(
                "button",
                {
                  key: `${region}-${signal}`,
                  className: `grid min-h-14 place-items-center rounded-lg border border-white/10 font-black transition hover:-translate-y-0.5 hover:border-parallax-teal/50 ${heatLevel(value)} ${isFocusedSignal ? "outline outline-2 outline-parallax-teal shadow-[0_0_22px_rgba(22,181,163,.22)]" : ""}`,
                  onMouseEnter: () => setHoverCell({ region, signal }),
                  onFocus: () => setHoverCell({ region, signal })
                },
                value
              );
            })
          ])
        )
      : heatmapMode === "total"
      ? h(
          "div",
          { className: "grid gap-3" },
          regions.map((region) => {
            const value = regionRisk(region);
            return h(
              "button",
              {
                key: region,
                className: `grid grid-cols-[90px_1fr_54px] items-center gap-3 rounded-lg border border-white/10 p-3 text-left transition hover:-translate-y-0.5 hover:border-parallax-teal/50 ${heatLevel(value)}`,
                onMouseEnter: () => setHoverCell({ region, signal: "Total Risk" }),
                onFocus: () => setHoverCell({ region, signal: "Total Risk" })
              },
              h("strong", null, region.replace(" Region", "")),
              h("span", { className: "h-3 overflow-hidden rounded-full bg-white/10" }, h("i", { className: "block h-full rounded-full bg-parallax-gold", style: { width: `${value}%` } })),
              h("b", { className: "text-xl text-white" }, value)
            );
          })
        )
      : h(ScenarioRiskMap, { regions: regionValues, slicers, setHoverCell }),
    heatmapMode === "total" && h(HeatLegend),
    h(
      "div",
      { className: "mt-4 rounded-lg border border-white/10 bg-white/[.045] p-4" },
      h("strong", null, `${detail.region} / ${heatmapMode === "total" || heatmapMode === "map" ? "Total Risk Score" : detail.signal}`),
      heatmapMode === "total" || heatmapMode === "map"
        ? h(
            "dl",
            { className: "mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 text-sm text-parallax-muted" },
            h("dt", null, "Aggregate risk score"),
            h("dd", { className: "font-extrabold text-white" }, detailValue),
            h("dt", null, "Highest contributing risk item"),
            h("dd", { className: "font-extrabold text-white" }, `${highestSignal.signal} (${highestSignal.value})`),
            h("dt", null, "Regions above threshold"),
            h("dd", { className: "font-extrabold text-white" }, `${regionsAboveThreshold} of ${regions.length}`),
            h("dt", null, "Recommended review"),
            h("dd", { className: "font-extrabold text-white" }, detailValue >= 75 ? "Leadership" : "Regional")
          )
        : h(
            "dl",
            { className: "mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 text-sm text-parallax-muted" },
            h("dt", null, "Risk item score"),
            h("dd", { className: "font-extrabold text-white" }, detailValue),
            h("dt", null, "Escalation rate"),
            h("dd", { className: "font-extrabold text-white" }, `${clamp(detailValue - 39, 6, 58)}%`),
            h("dt", null, "Corrective action aging"),
            h("dd", { className: "font-extrabold text-white" }, `${clamp(detailValue - 44, 8, 49)} days`),
            h("dt", null, "Recommended review"),
            h("dd", { className: "font-extrabold text-white" }, detailValue >= 75 ? "Leadership" : "Regional")
          )
    )
  );
}

function HeatLegend() {
  const labels = [
    ["Low", "0-54", 40],
    ["Moderate", "55-69", 62],
    ["High", "70-83", 76],
    ["Critical", "84+", 90]
  ];
  return h(
    "div",
    { className: "mt-3 flex flex-wrap gap-3 text-[.68rem] font-black uppercase text-parallax-muted" },
    labels.map(([label, range, sample]) =>
      h("span", { key: label, className: "inline-flex items-center gap-1.5" }, h("i", { className: `h-4 w-7 rounded border border-white/10 ${heatLevel(sample)}` }), `${label} ${range}`)
    )
  );
}

function ScenarioRiskMap({ regions, slicers, setHoverCell }) {
  const scenario = scenarioDetail(slicers);
  const values = Object.fromEntries(regions.map((item) => [item.region, item.value]));
  const displayRegions = slicers.region === "All Regions" ? regions.map((item) => item.region) : [slicers.region];
  const regionCards = displayRegions.map((region) => {
    const top = scoredPatterns({ ...slicers, region })
      .filter((item) => item.division === slicers.division && item.region === region && (slicers.selectedSignal === "All Risk Types" || item.signal === slicers.selectedSignal))
      .sort((a, b) => b.score - a.score)[0];
    return { region, value: values[region] || 50, top };
  });
  return h(
    "div",
    { className: "min-w-0 rounded-lg border border-white/10 bg-[#071033]/45 p-4 shadow-[inset_0_0_42px_rgba(31,106,229,.08)] sm:min-w-[430px]" },
    h("div", { className: "mb-3 flex items-start justify-between gap-3" }, h("span", null, h("strong", { className: "block text-white" }, scenario.mapTitle), h("em", { className: "block max-w-[34rem] text-xs not-italic text-parallax-muted" }, scenario.mapSubtitle)), h("span", { className: "rounded-full border border-white/10 bg-white/[.05] px-2 py-1 text-[.65rem] font-black uppercase text-parallax-muted" }, slicers.division)),
    h(
      "div",
      { className: `grid gap-3 ${regionCards.length > 1 ? "sm:grid-cols-2" : ""}` },
      regionCards.map(({ region, value, top }) =>
        h(
          "button",
          {
            key: region,
            className: `grid min-h-32 gap-2 rounded-lg border border-white/10 p-3 text-left transition hover:-translate-y-0.5 hover:border-parallax-teal/50 ${heatLevel(value)}`,
            onMouseEnter: () => setHoverCell({ region, signal: "Total Risk" }),
            onFocus: () => setHoverCell({ region, signal: "Total Risk" })
          },
          h("span", { className: "flex items-center justify-between gap-3" }, h("strong", { className: "text-lg text-white" }, region.replace(" Region", "")), h("b", { className: "text-3xl text-white" }, value)),
          h("span", { className: "h-2 overflow-hidden rounded-full bg-white/15" }, h("i", { className: "block h-full rounded-full bg-parallax-gold", style: { width: `${value}%` } })),
          h("em", { className: "text-xs not-italic text-white/80" }, top ? top.pattern : `No active ${slicers.selectedSignal === "All Risk Types" ? "leadership" : slicers.selectedSignal} item`),
          h("span", { className: "text-[.65rem] font-black uppercase text-parallax-muted" }, top ? top.signal : slicers.selectedSignal)
        )
      )
    ),
    h(HeatLegend)
  );
}

function DecisionMatrix({ rows, slicers, focusSignal }) {
  const candidates = rows.filter((item) => item.direction !== "recovery").slice(0, 5);
  const top = candidates[0] || rows[0];
  const second = candidates[1];
  const recovery = rows.find((item) => item.direction === "recovery");
  const scope = `${slicers.region} / ${slicers.division}`;

  return h(
    "section",
    { className: `${panelClass} grid gap-4` },
    h(
      "div",
      { className: "flex items-center justify-between gap-3" },
      h("h2", { className: "text-sm font-black uppercase" }, "AI Decision Briefing"),
      h("span", { className: "rounded-full border border-parallax-teal/30 bg-parallax-teal/10 px-3 py-1 text-[.68rem] font-black uppercase text-parallax-teal" }, slicers.timeRange)
    ),
    top &&
      h(
        "article",
        { className: "rounded-lg border border-parallax-blue/30 bg-parallax-blue/10 p-4 text-sm text-parallax-muted shadow-[0_0_30px_rgba(31,106,229,.10)]" },
        h("span", { className: "mb-3 flex items-center gap-2" }, h(Icon, { name: "bot", className: "h-6 w-6 text-parallax-teal" }), h("strong", { className: "text-white" }, "Copilot Weekly Summary")),
        h(
          "p",
          { className: "leading-relaxed" },
          `This reporting period is being driven by ${top.pattern.toLowerCase()} across ${top.region}. `,
          second ? `${second.pattern} is the next strongest contributor, creating a combined leadership review queue for ${scope}. ` : "",
          recovery ? `${recovery.pattern.toLowerCase()} is the clearest recovery risk item and can be used as the response model.` : "No strong recovery risk item is currently offsetting the elevated risk pattern."
        ),
        h(
          "div",
          { className: "mt-4 grid gap-2 md:grid-cols-2" },
          h("span", { className: "rounded-md border border-white/10 bg-white/[.05] p-2" }, h("strong", { className: "block text-white" }, "Suggested intervention"), h("em", { className: "not-italic" }, interventionFor(top))),
          h("span", { className: "rounded-md border border-white/10 bg-white/[.05] p-2" }, h("strong", { className: "block text-white" }, "What changed"), h("em", { className: "not-italic" }, `${riskItemLabel(top.signal)} moved ${top.delta > 0 ? "+" : ""}${top.delta} pts ${comparisonLabel(slicers.timeRange)}.`))
        ),
        h("button", { className: "mt-4 rounded-md border border-parallax-teal/50 bg-parallax-teal/10 px-3 py-2 text-xs font-black uppercase text-parallax-teal", onClick: () => focusSignal(top.signal) }, "Focus summary risk item")
      ),
    h(
      "section",
      { className: "rounded-md border border-parallax-blue/25 bg-parallax-blue/10 p-3 text-sm text-parallax-muted" },
      h("strong", { className: "block text-xs font-black uppercase text-blue-200" }, "Data source and methodology"),
      h("em", { className: "mt-1 block not-italic leading-snug" }, "Signals synthesized from work orders, inspections, observations, exceptions, schedule variance, and leadership review status.")
    )
  );
}

function interventionFor(itemOrSignal) {
  const item = typeof itemOrSignal === "string" ? { signal: itemOrSignal, pattern: "highest-priority risk item", region: "the affected scope", review: "Needs Review" } : itemOrSignal;
  if (!item) return "Review the highest-confidence operational risk item with regional leadership.";
  const ownerStep = item.review === "Assigned" ? "confirm owner, due date, and escalation path" : item.review === "In Progress" ? "validate recovery progress and remove blockers" : "assign an accountable owner and next checkpoint";
  const trendStep = item.delta > 0 ? "because pressure is rising" : item.delta < 0 ? "while the recovery trend is still visible" : "before the trend turns";
  return `${ownerStep} for ${item.pattern.toLowerCase()} in ${item.region} ${trendStep}.`;
}

function actionLabelFor(itemOrSignal) {
  const item = typeof itemOrSignal === "string" ? { signal: itemOrSignal } : itemOrSignal;
  if (!item) return "Focus leadership response";
  if (item.direction === "recovery") return `Lock in ${item.signal} recovery`;
  if (item.impact === "High") return `Escalate ${item.signal} response`;
  if (item.review === "Assigned") return `Confirm ${item.signal} ownership`;
  return `Review ${item.signal} pressure`;
}

function AppFooter({ slicers }) {
  const reporting = reportingPeriodLabel(slicers.timeRange);
  return h(
    "footer",
    { className: "mt-6 grid gap-4 rounded-lg border border-white/10 bg-white/[.035] p-5 text-sm text-parallax-muted" },
    h(
      "div",
      { className: "grid gap-4 md:grid-cols-[1fr_auto]" },
      h(
        "span",
        null,
        h("strong", { className: "block text-white" }, "Parallax Data Lab Operational Intelligence"),
        h("em", { className: "not-italic" }, `${slicers.division} / ${slicers.timeRange} / Generated ${reporting.generated}`)
      ),
      h(
        "span",
        { className: "flex flex-wrap items-center gap-3 text-xs font-black uppercase" },
        h("b", { className: "rounded-full border border-parallax-teal/30 bg-parallax-teal/10 px-3 py-1 text-parallax-teal" }, "Executive demo"),
        h("b", { className: "rounded-full border border-parallax-gold/30 bg-parallax-gold/10 px-3 py-1 text-parallax-gold" }, "Confidential preview")
      )
    )
  );
}

createRoot(document.getElementById("root")).render(h(App));

