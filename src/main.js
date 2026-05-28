import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { filters, signals } from "./data/digestData.js";
import "./styles.css";
import {
  activePatterns,
  clamp,
  complianceScore,
  contextPatterns,
  defaultSlicers,
  followUpTitle,
  followUpValue,
  heatLevel,
  heatValue,
  leadershipItems,
  overallSignal,
  signalState,
  topThings
} from "./lib/intelligence.js";

const h = React.createElement;

const panelClass =
  "relative overflow-hidden rounded-lg border border-white/15 bg-gradient-to-br from-parallax-navy/80 to-[#09163f]/60 p-4 shadow-glow before:pointer-events-none before:absolute before:inset-0 before:shadow-[inset_0_0_44px_rgba(31,106,229,.08)]";
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
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - value}`).join(" ");
  return h(
    "svg",
    { key: token, className: "h-12 w-full min-w-0", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    h("polyline", {
      points,
      fill: "none",
      stroke: color,
      strokeWidth: "4",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeDasharray: 360,
      className: "animate-chartDraw"
    }),
    values.map((value, index) =>
      h("circle", {
        key: `${index}-${value}`,
        cx: (index / (values.length - 1)) * 100,
        cy: 100 - value,
        r: 1.8,
        fill: color
      })
    )
  );
}

function App() {
  const [slicers, setSlicers] = useState(defaultSlicers);
  const [sort, setSort] = useState({ key: "score", dir: -1 });
  const [hoverCell, setHoverCell] = useState(null);
  const filterToken = Object.values(slicers).join("|");
  const exactRows = useMemo(() => activePatterns(slicers, sort), [slicers, sort]);
  const leadershipRows = useMemo(() => leadershipItems(slicers, exactRows), [slicers, exactRows]);
  const contextRows = useMemo(
    () => contextPatterns(slicers, { ignoreSignal: true, ignoreImpact: true, ignoreReview: true }),
    [slicers]
  );

  const updateSlicer = (key, value) => setSlicers((current) => ({ ...current, [key]: value }));
  const focusSignal = (signal) => setSlicers((current) => ({ ...current, selectedSignal: signal }));

  return h(
    "div",
    { className: "mx-auto w-[min(1760px,calc(100%_-_36px))] py-6 text-white" },
    h(Header),
    h(SlicerBar, { slicers, updateSlicer }),
    h(MetaStrip, { slicers }),
    h(
      "section",
      { className: "grid items-start gap-4 lg:grid-cols-[minmax(0,1.48fr)_minmax(360px,.72fr)]" },
      h(
        "div",
        { className: "grid gap-4" },
        h(ExecutiveSummary, { slicers, rows: exactRows, focusSignal }),
        h(LeadershipTable, { rows: leadershipRows, exactCount: exactRows.length, sort, setSort, filterToken }),
        h(LowerDigest, { slicers, contextRows, focusSignal, filterToken })
      ),
      h(
        "aside",
        { className: "sticky top-4 grid max-h-[calc(100vh-32px)] gap-4 overflow-auto max-lg:relative max-lg:top-auto max-lg:max-h-none max-lg:overflow-visible" },
        h(Heatmap, { slicers, hoverCell, setHoverCell }),
        h(ArchitectureFlow)
      )
    ),
    h(ReviewLinks)
  );
}

function Header() {
  return h(
    "header",
    { className: "mb-5 grid items-center gap-7 xl:grid-cols-[270px_minmax(340px,1fr)_320px] lg:grid-cols-[250px_1fr]" },
    h("img", {
      className: "w-[min(300px,100%)] rounded-lg border border-white/15 bg-white/95 p-3 shadow-2xl",
      src: "./assets/parallax-logo.svg",
      alt: "Parallax Data Lab"
    }),
    h(
      "div",
      null,
      h("p", { className: "mb-2 text-xs font-extrabold uppercase text-parallax-teal" }, "Live Intelligence Digest Experience"),
      h("h1", { className: "text-4xl font-black leading-none tracking-normal md:text-6xl" }, "Weekly Safety Intelligence Digest"),
      h("p", { className: "mt-3 text-lg text-parallax-muted" }, "What deserves leadership attention this week, and why.")
    ),
    h(
      "aside",
      { className: `${panelClass} grid gap-2 lg:col-span-2 xl:col-span-1` },
      h("span", { className: "text-sm text-parallax-muted" }, "Reporting Period"),
      h("strong", { className: "text-lg" }, "May 5 - May 11, 2025"),
      h("em", { className: "not-italic text-sm text-parallax-muted" }, "Generated: May 12, 2025 12:00 AM"),
      h(
        "b",
        { className: "inline-flex items-center gap-2 text-sm text-parallax-muted" },
        h("i", { className: "h-2 w-2 animate-softPulse rounded-full bg-parallax-teal shadow-[0_0_18px_#16B5A3]" }),
        "AI Intelligence Active"
      )
    )
  );
}

function SlicerBar({ slicers, updateSlicer }) {
  const fields = [
    ["Region", "region", filters.regions],
    ["Business Unit", "division", filters.divisions],
    ["Workflow Type", "selectedSignal", ["All Signals", ...signals]],
    ["Time Range", "timeRange", filters.timeRanges],
    ["Impact", "impact", filters.impacts],
    ["Review State", "review", filters.reviewStates]
  ];

  return h(
    "section",
    { className: `${panelClass} mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6` },
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
          options.map((option) => h("option", { key: option, value: option }, option))
        )
      )
    )
  );
}

function MetaStrip({ slicers }) {
  const items = [
    ["user", "Prepared for", "VP, Safety Operations", slicers.division],
    ["scope", "Scope", slicers.division, slicers.region],
    ["refresh", "Data Refresh", "May 11, 2025 11:45 PM", "Live simulation"],
    ["bars", "Compared To", "Apr 28 - May 4, 2025", "Prior 7 Days"],
    ["trend", "Baseline", "4-Week Rolling", "+ Prior 30 Days"]
  ];

  return h(
    "section",
    { className: `${panelClass} mb-4 grid overflow-hidden p-0 md:grid-cols-3 xl:grid-cols-5` },
    items.map(([icon, label, primary, secondary]) =>
      h(
        "article",
        { key: label, className: "grid grid-cols-[42px_1fr] items-center gap-x-3 gap-y-2 border-white/10 p-4 md:border-b xl:border-b-0 xl:border-r last:border-r-0" },
        h(Icon, { name: icon, className: "row-span-3 h-9 w-9 text-parallax-gold" }),
        h("span", { className: "text-xs text-parallax-muted" }, label),
        h("strong", { className: "text-sm" }, primary),
        h("em", { className: "text-xs not-italic text-parallax-muted" }, secondary)
      )
    )
  );
}

function ExecutiveSummary({ slicers, rows, focusSignal }) {
  const score = overallSignal(rows);
  const [label, level] = signalState(score);
  const things = topThings(slicers, rows);
  const signalColor = level === "low" ? "text-parallax-teal" : level === "medium" ? "text-parallax-gold" : level === "high" ? "text-orange-400" : "text-red-400";

  return h(
    "section",
    { className: panelClass },
    h("h2", { className: "mb-4 text-sm font-black uppercase" }, "1. Executive Summary"),
    h(
      "div",
      { className: "grid gap-4 xl:grid-cols-[minmax(210px,.72fr)_minmax(360px,1.65fr)_minmax(220px,.72fr)]" },
      h(
        "article",
        { className: `${softCardClass} grid min-h-52 place-items-center text-center` },
        h("span", { className: "text-sm font-extrabold" }, "Overall Safety Signal"),
        h(
          "div",
          { className: "my-4 flex items-center justify-center gap-4" },
          h("b", { className: "grid h-14 w-14 place-items-center rounded-full bg-orange-500 text-3xl shadow-gold" }, "!"),
          h("strong", { className: `text-xl ${signalColor}` }, label)
        ),
        h("em", { className: "not-italic text-parallax-muted" }, "vs. prior week"),
        h("p", { className: "mt-3 max-w-48 leading-snug" }, level === "low" ? "Improving across key signal areas" : `Worsening across ${clamp(Math.round(score / 12), 3, 9)} of 9 key signal areas`)
      ),
      h(
        "article",
        { className: softCardClass },
        h("span", { className: "text-sm font-extrabold" }, "Top 3 Things to Know"),
        things.map((item, index) =>
          h(
            "div",
            { key: item.id, className: "mt-5 grid grid-cols-[32px_1fr] gap-3" },
            h("b", { className: `grid h-8 w-8 place-items-center rounded-full font-black ${item.kind === "recovery" ? "bg-emerald-600" : item.kind === "open-text" ? "bg-parallax-gold text-[#171100]" : "bg-red-500"}` }, index + 1),
            h("p", { className: "text-sm text-parallax-muted" }, h("strong", { className: "mb-1 block text-white" }, item.pattern), item.why)
          )
        )
      ),
      h(
        "article",
        { className: `${softCardClass} grid gap-2` },
        h("span", { className: "text-sm font-extrabold" }, "Key Signal Direction"),
        signals.map((signal) => {
          const value = heatValue(slicers, slicers.region === "All Regions" ? "West Region" : slicers.region, signal);
          return h(
            "button",
            {
              key: signal,
              className: "flex items-center justify-between border-b border-white/10 py-2 text-left text-sm transition hover:text-parallax-teal",
              onClick: () => focusSignal(signal)
            },
            h("strong", null, signal),
            h("b", { className: value >= 68 ? "text-red-400" : "text-parallax-teal" }, value >= 68 ? "^" : "v")
          );
        })
      )
    )
  );
}

function PatternIcon({ signal }) {
  const icon = { Escalations: "alert", "Actions / CA": "clock", Assignments: "group", Workflows: "refresh", Compliance: "bars", "Open Text": "bot" }[signal] || "trend";
  return h("span", { className: "grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-parallax-muted" }, h(Icon, { name: icon, className: "h-5 w-5" }));
}

function LeadershipTable({ rows, exactCount, sort, setSort, filterToken }) {
  const headers = [
    ["id", "Rank"],
    ["pattern", "Pattern"],
    ["why", "Why It Matters"],
    ["impact", "Impact"],
    ["delta", "Trend vs Prior Week"],
    ["region", "Affected Scope"],
    ["review", "Review"]
  ];

  const updateSort = (key) => setSort((current) => ({ key, dir: current.key === key ? current.dir * -1 : -1 }));

  return h(
    "section",
    { className: `${panelClass} overflow-x-auto` },
    h("div", { className: "mb-4 flex items-center justify-between gap-4" }, h("h2", { className: "text-sm font-black uppercase" }, "2. Top Leadership Attention Items"), h("span", { className: "text-xs font-extrabold text-parallax-gold" }, `5 prioritized items / ${exactCount} exact matches`)),
    h(
      "table",
      { className: "w-full min-w-[980px] border-collapse text-sm" },
      h(
        "thead",
        null,
        h("tr", null, headers.map(([key, label]) => h("th", { key, className: "border-b border-white/10 p-3 text-left" }, h("button", { className: "font-extrabold text-parallax-muted hover:text-white", onClick: () => updateSort(key) }, label))))
      ),
      h(
        "tbody",
        null,
        rows.map((item, index) =>
          h(
            "tr",
            { key: item.id, className: "transition hover:bg-parallax-blue/10" },
            h("td", { className: "border-b border-white/10 p-3" }, h("span", { className: "grid h-10 w-10 place-items-center rounded-full font-black text-white", style: { background: item.color } }, index + 1)),
            h("td", { className: "border-b border-white/10 p-3" }, h("div", { className: "grid grid-cols-[40px_1fr] items-center gap-3" }, h(PatternIcon, { signal: item.signal }), h("span", null, h("strong", { className: "block" }, item.pattern), item.related && h("em", { className: "text-[.7rem] not-italic font-extrabold uppercase text-parallax-gold" }, "Related priority")))),
            h("td", { className: "border-b border-white/10 p-3 text-parallax-muted" }, item.why),
            h("td", { className: "border-b border-white/10 p-3" }, h("mark", { className: `rounded-md px-3 py-2 text-white ${item.impact === "High" ? "bg-red-500/30" : item.impact === "Medium" ? "bg-parallax-gold text-[#171100]" : "bg-parallax-teal text-[#062519]"}` }, item.impact)),
            h("td", { className: "border-b border-white/10 p-3" }, h(Sparkline, { values: item.trend.map((value) => clamp(value + item.delta / 4, 10, 92)), color: item.color, token: `${filterToken}-${item.id}` })),
            h("td", { className: "border-b border-white/10 p-3" }, h("strong", { className: "block" }, item.region), h("span", { className: "text-parallax-muted" }, item.division)),
            h("td", { className: "border-b border-white/10 p-3" }, h("button", { className: "rounded-md border border-parallax-gold/50 bg-parallax-gold/10 px-3 py-2 text-parallax-gold hover:bg-parallax-gold/20" }, "Review ->"))
          )
        )
      )
    )
  );
}

function LowerDigest({ slicers, contextRows, focusSignal, filterToken }) {
  const emerging = contextRows.filter((item) => item.direction !== "recovery").slice(0, 4);
  const followUps = contextRows.filter((item) => item.direction !== "recovery").slice(0, 4);
  const openText = contextRows.filter((item) => item.signal === "Open Text").slice(0, 4);
  const recovery = contextRows.filter((item) => item.direction === "recovery").slice(0, 4);

  return h(
    "section",
    { className: "grid gap-4 md:grid-cols-2 2xl:grid-cols-4" },
    h(MiniCard, { title: "3. Emerging Risk Patterns" }, emerging.map((item) => h(MiniSignalRow, { key: item.id, item, onClick: () => focusSignal(item.signal) }))),
    h(
      MiniCard,
      { title: "4. Operational Follow-Up Risks" },
      followUps.map((item) =>
        h(
          "div",
          { key: item.id, className: "grid grid-cols-[minmax(0,1fr)_minmax(82px,108px)] items-center gap-3 rounded-lg border border-white/10 bg-white/[.04] p-3 text-sm text-parallax-muted" },
          h("span", null, h("strong", { className: "block text-white" }, followUpTitle(item.signal)), h("b", { className: "mt-1 block text-2xl text-white" }, followUpValue(item)), h("em", { className: "not-italic" }, `+${item.delta}% attention pressure`)),
          h(Sparkline, { values: item.trend, color: item.color, token: `${filterToken}-follow-${item.id}` })
        )
      ),
      h("div", { className: "grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[.04] p-3" }, h("span", { className: "text-sm" }, h("strong", { className: "block text-white" }, "Average Compliance Score"), h("em", { className: "not-italic text-red-400" }, `${complianceScore(contextRows) >= 78 ? "^ 3 pts" : "v " + clamp(80 - complianceScore(contextRows), 2, 10) + " pts"} vs. prior week`)), h("b", { className: "text-3xl" }, complianceScore(contextRows)))
    ),
    h(MiniCard, { title: "5. Open Text Concern Signals" }, openText.map((item) => h(MiniSignalRow, { key: item.id, item, onClick: () => focusSignal("Open Text"), openText: true }))),
    h(
      MiniCard,
      { title: "6. Operational Recovery Items" },
      recovery.map((item) =>
        h("div", { key: item.id, className: "grid grid-cols-[38px_1fr] gap-3 rounded-lg border border-white/10 bg-white/[.04] p-3 text-sm text-parallax-muted" }, h(Icon, { name: "check", className: "h-8 w-8 text-parallax-teal" }), h("span", null, h("strong", { className: "block text-white" }, item.pattern), h("em", { className: "not-italic" }, item.why)))
      )
    )
  );
}

function MiniCard({ title, children }) {
  return h("article", { className: `${panelClass} grid content-start gap-3` }, h("h2", { className: "text-sm font-black uppercase" }, title), children);
}

function MiniSignalRow({ item, onClick, openText = false }) {
  return h(
    "button",
    { className: "grid grid-cols-[38px_1fr] gap-3 rounded-lg border border-white/10 bg-white/[.04] p-3 text-left text-sm text-parallax-muted transition hover:-translate-y-0.5 hover:border-parallax-teal/50 hover:bg-parallax-blue/15", onClick },
    h(PatternIcon, { signal: openText ? "Open Text" : item.signal }),
    h("span", null, h("strong", { className: "block text-white" }, item.pattern), h("em", { className: "not-italic" }, openText ? item.why : `${item.region} / ${item.delta > 0 ? "+" : ""}${item.delta}% vs. prior week`))
  );
}

function Heatmap({ slicers, hoverCell, setHoverCell }) {
  const regions = filters.regions.slice(1);
  const activeSignals = slicers.selectedSignal === "All Signals" ? signals : [slicers.selectedSignal];
  const detail = hoverCell || {
    region: slicers.region === "All Regions" ? "West Region" : slicers.region,
    signal: slicers.selectedSignal === "All Signals" ? "Escalations" : slicers.selectedSignal
  };
  const detailValue = heatValue(slicers, detail.region, detail.signal);

  return h(
    "section",
    { className: `${panelClass} sticky top-3 z-10 overflow-x-auto` },
    h("div", { className: "mb-4 flex items-center justify-between gap-4" }, h("h2", { className: "text-sm font-black uppercase" }, "Operational Signal Heatmap"), h("span", { className: "text-xs font-extrabold text-parallax-gold" }, slicers.timeRange)),
    h(
      "div",
      { className: "grid min-w-[430px] grid-cols-[88px_repeat(6,minmax(46px,1fr))] gap-2" },
      h("span"),
      signals.map((signal) => h("strong", { key: signal, className: "text-center text-[.7rem] text-parallax-muted" }, signal)),
      regions.flatMap((region) => [
        h("b", { key: `${region}-label`, className: "grid items-center justify-start text-sm" }, region.replace(" Region", "")),
        ...signals.map((signal) => {
          const value = heatValue(slicers, region, signal);
          return h(
            "button",
            {
              key: `${region}-${signal}`,
              className: `grid min-h-14 place-items-center rounded-lg border border-white/10 font-black transition hover:-translate-y-0.5 hover:border-parallax-teal/50 ${heatLevel(value)} ${activeSignals.includes(signal) ? "outline outline-2 outline-parallax-teal shadow-[0_0_22px_rgba(22,181,163,.22)]" : ""}`,
              onMouseEnter: () => setHoverCell({ region, signal }),
              onFocus: () => setHoverCell({ region, signal })
            },
            value
          );
        })
      ])
    ),
    h(
      "div",
      { className: "mt-4 rounded-lg border border-white/10 bg-white/[.045] p-4" },
      h("strong", null, `${detail.region} / ${detail.signal}`),
      h(
        "dl",
        { className: "mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 text-sm text-parallax-muted" },
        h("dt", null, "Signal score"),
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

function ArchitectureFlow() {
  const stages = [
    ["Operational Data Sources", "Safety workflows, assignments, observations, open text, and site context."],
    ["Governed Analytics Layer", "Controlled metrics, refresh rules, lineage, and trusted definitions."],
    ["Intelligence Detection Engine", "Detects escalation patterns, drift, backlog aging, and compliance deviation."],
    ["Predictive Risk Modeling", "Scores likelihood, impact, trend acceleration, and action confidence."],
    ["Executive Prioritization Digest", "Converts dashboards into leadership attention items."],
    ["Leadership Action", "Routes reviews, interventions, and follow-up accountability."]
  ];

  return h(
    "section",
    { className: `${panelClass} grid gap-3` },
    h("h2", { className: "text-sm font-black uppercase" }, "Intelligence Architecture Flow"),
    stages.map(([title, body], index) =>
      h(
        "button",
        { key: title, className: "grid min-h-20 grid-cols-[34px_1fr] items-center gap-x-3 rounded-lg border border-white/10 bg-white/[.045] p-3 text-left transition hover:-translate-y-0.5 hover:border-parallax-teal/50 hover:bg-parallax-blue/15" },
        h("span", { className: "row-span-2 grid h-9 w-9 place-items-center rounded-lg border border-parallax-teal/25 bg-parallax-teal/10 font-black text-parallax-teal" }, index + 1),
        h("strong", null, title),
        h("em", { className: "text-sm not-italic leading-snug text-parallax-muted" }, body)
      )
    )
  );
}

function ReviewLinks() {
  const links = [
    ["alert", "Escalations Dashboard"],
    ["action", "Actions Report"],
    ["check", "Corrective Actions Report"],
    ["scope", "Workflows Dashboard"],
    ["group", "Assignments Report"],
    ["map", "Compliance & Scores Dashboard"]
  ];

  return h(
    "section",
    { className: `${panelClass} mt-4` },
    h("h2", { className: "mb-4 text-sm font-black uppercase" }, "7. Review Links"),
    h(
      "div",
      { className: "grid gap-3 md:grid-cols-2 xl:grid-cols-6" },
      links.map(([icon, label]) =>
        h(
          "button",
          { key: label, className: "grid min-h-20 grid-cols-[34px_1fr] items-center gap-3 rounded-lg border border-white/10 bg-white/[.045] p-3 text-left transition hover:-translate-y-0.5 hover:border-parallax-teal/50 hover:bg-parallax-blue/15" },
          h(Icon, { name: icon, className: "h-8 w-8 text-parallax-gold" }),
          h("span", null, h("strong", { className: "block" }, label), h("em", { className: "mt-1 block not-italic text-parallax-muted" }, "Open ->"))
        )
      )
    ),
    h(
      "footer",
      { className: "mt-4 grid items-center gap-4 rounded-lg border border-white/10 bg-white/[.04] p-4 md:grid-cols-[34px_1fr_1fr]" },
      h(Icon, { name: "bot", className: "h-8 w-8 text-parallax-muted" }),
      h("p", { className: "text-sm leading-snug text-parallax-muted" }, h("strong", { className: "mb-1 block text-white" }, "About this digest"), "This digest is generated weekly to focus leaders on what matters most. It analyzes changes, trends, and patterns across key safety signals so you can act where it counts."),
      h("p", { className: "text-sm leading-snug text-parallax-muted" }, h("strong", { className: "mb-1 block text-white" }, "Questions or feedback?"), "Reply to this email or contact the Safety Intelligence team.")
    ),
    h("blockquote", { className: "mt-4 border-l-4 border-parallax-gold p-4 text-2xl font-black leading-tight md:text-4xl" }, '"Dashboards create visibility. Intelligence creates prioritization."')
  );
}

createRoot(document.getElementById("root")).render(h(App));
