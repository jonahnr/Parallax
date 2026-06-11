const industries = {
  "Manufacturing & Automotive": {
    audience: "VP, Manufacturing Operations",
    scope: "Assembly, quality, maintenance, supplier flow",
    summary: "Builds an operational view across plant throughput, quality escapes, maintenance readiness, supplier disruption, and workforce constraints.",
    riskTypes: ["Throughput", "Quality", "Maintenance", "Supplier Flow", "Labor Coverage", "Launch Readiness"],
    mapTitle: "Manufacturing Regional Risk",
    mapSubtitle: "Regional pressure across plants, suppliers, and launch operations.",
    items: [
      "Final assembly takt miss", "Supplier sequencing volatility", "Warranty claim signal spike", "Paint booth maintenance backlog",
      "Quality hold aging", "Layered process audit evidence gap", "Battery module scrap increase", "Line-side congestion",
      "Tooling changeover delay", "Critical station labor shortage", "Launch part readiness gap", "Inbound premium freight surge",
      "Rework loop concentration", "Engineering disposition backlog", "Supplier containment drift", "End-of-line test failures",
      "Material kitting accuracy drop", "Maintenance overtime exposure", "Calibration evidence slippage", "Production schedule compression",
      "Body shop downtime risk", "Customer campaign readiness", "Shift handoff variance", "Parts shortage escalation"
    ]
  },
  "Construction & Infrastructure": {
    audience: "VP, Program Delivery",
    scope: "Capital projects, field execution, contractors",
    summary: "Tracks schedule pressure, contractor coordination, inspection readiness, permit friction, and change-order exposure across active projects.",
    riskTypes: ["Schedule", "Contractors", "Permits", "Inspections", "Change Orders", "Utility Coordination"],
    mapTitle: "Construction Regional Risk",
    mapSubtitle: "Regional pressure across projects, crews, permits, and inspections.",
    items: [
      "Critical path float erosion", "Permit dependency slippage", "Contractor change-order pressure", "Inspection readiness gap",
      "Specialty crew coverage constraint", "Field rework narrative cluster", "Utility tie-in delay", "Procurement submittal aging",
      "Concrete pour window compression", "Right-of-way access conflict", "Design response backlog", "Rail possession constraint",
      "Traffic control approval delay", "Punch list growth", "Drainage package resequencing", "Commissioning evidence gap",
      "Survey control discrepancy", "Material staging conflict", "Night work productivity drag", "Environmental hold point risk",
      "Owner decision latency", "Temporary works review delay", "Subcontractor mobilization miss", "Schedule recovery plan drift"
    ]
  },
  "Energy & Utilities": {
    audience: "VP, Operations & Reliability",
    scope: "Grid, field service, generation, compliance",
    summary: "Prioritizes outage response, asset reliability, work-order aging, regulatory readiness, and customer-impact risk by operating area.",
    riskTypes: ["Outage Response", "Asset Reliability", "Field Dispatch", "Regulatory", "Customer Impact", "Switching"],
    mapTitle: "Energy Regional Risk",
    mapSubtitle: "Regional pressure across grid assets, dispatch, customers, and compliance.",
    items: [
      "Outage response escalation surge", "Substation maintenance deferral", "Regulatory evidence gap", "Dispatch queue recovery",
      "Customer impact narrative increase", "Switching workflow drift", "Transformer inspection backlog", "Vegetation work-order aging",
      "Mutual-aid crew constraint", "Feeder reliability deterioration", "Critical spares exposure", "Relay testing schedule slip",
      "Medical priority account miss", "Restoration estimate variance", "Generation derate pressure", "Storm staging readiness gap",
      "Call center repeat contact rise", "Crew travel time expansion", "NERC evidence aging", "Underground fault queue",
      "Meter exchange backlog", "Voltage complaint cluster", "Protection setting review delay", "Planned outage compression"
    ]
  },
  "Aerospace & Shipbuilding": {
    audience: "VP, Complex Programs",
    scope: "Program delivery, yards, suppliers, certification",
    summary: "Surfaces program slippage, nonconformance pressure, certification evidence gaps, and yard readiness across long-cycle builds.",
    riskTypes: ["Program Milestones", "Nonconformance", "Certification", "Supplier Readiness", "Rework", "Yard Access"],
    mapTitle: "Aerospace & Shipbuilding Regional Risk",
    mapSubtitle: "Regional pressure across programs, yards, suppliers, and certification gates.",
    items: [
      "Certification package aging", "Nonconformance rework stack", "Build bay constraint", "Supplier readiness recovery",
      "Engineering disposition queue", "Yard access conflict", "Dry dock sequencing delay", "Composite layup defect cluster",
      "Weld inspection backlog", "Avionics integration slip", "Hull outfitting compression", "Flight test readiness gap",
      "MRB decision latency", "Long-lead material shortage", "Customer acceptance evidence gap", "Critical drawing release delay",
      "Trade stacking congestion", "Configuration control drift", "Sea trial issue queue", "Tool calibration slippage",
      "Program milestone recovery risk", "Supplier first article miss", "Quality escape containment", "Certification lab capacity"
    ]
  },
  "Logistics & Heavy Haul": {
    audience: "VP, Logistics Operations",
    scope: "Lane reliability, terminals, permits, fleet readiness",
    summary: "Tracks lane disruption, heavy-haul permit readiness, terminal dwell, driver coverage, and high-value shipment exposure.",
    riskTypes: ["Lane Reliability", "Terminal Dwell", "Fleet Readiness", "Permits", "Driver Coverage", "Chain of Custody"],
    mapTitle: "Logistics Regional Risk",
    mapSubtitle: "Regional pressure across terminals, lanes, permits, fleet, and driver coverage.",
    items: [
      "Oversize permit delay", "Terminal dwell escalation", "Fleet readiness backlog", "Driver coverage recovery",
      "Chain-of-custody evidence gap", "Route exception language spike", "Escort availability constraint", "Bridge restriction reroute",
      "Port appointment miss", "Rail interchange congestion", "High-value shipment hold", "Trailer maintenance aging",
      "Fuel stop disruption", "Customs documentation drift", "Weather route exposure", "Crane unload window compression",
      "Cross-dock labor gap", "Returnable asset shortage", "Expedite cost spike", "Dispatch handoff variance",
      "Heavy-haul route survey delay", "Customer delivery promise risk", "Carrier compliance evidence gap", "Yard departure queue"
    ]
  },
  "Forestry & Logging": {
    audience: "VP, Resource Operations",
    scope: "Harvest blocks, mills, access roads, contractors",
    summary: "Combines harvest readiness, mill intake, road access, weather exposure, contractor coverage, and environmental compliance.",
    riskTypes: ["Harvest Readiness", "Weather Access", "Equipment", "Mill Intake", "Contractor Coverage", "Environmental"],
    mapTitle: "Forestry Regional Risk",
    mapSubtitle: "Regional pressure across harvest blocks, roads, mills, contractors, and permits.",
    items: [
      "Weather access disruption", "Equipment availability drag", "Mill intake imbalance", "Contractor coverage recovery",
      "Environmental permit evidence gap", "Field notes road concern", "Haul road soft spot cluster", "Remote block release delay",
      "Harvester repair backlog", "Skidder utilization drop", "Stream buffer documentation gap", "Log deck overflow",
      "Road matting shortage", "Fuel delivery constraint", "Crew travel exposure", "Fire condition monitoring gap",
      "Mill species mix mismatch", "Contractor invoice aging", "Bridge load rating concern", "Reforestation handoff delay",
      "Wet weather productivity drag", "Scaling ticket variance", "Access gate coordination miss", "Active stand closeout risk"
    ]
  }
};

export const scenarios = industries;
export const signals = industries["Manufacturing & Automotive"].riskTypes;

export const filters = {
  regions: ["All Regions", "West Region", "South Region", "Central Region", "North Region"],
  divisions: Object.keys(industries),
  timeRanges: ["Previous Week", "Previous Month", "Previous Quarter", "Previous Year"],
  impacts: ["All Impact", "High", "Medium", "Low"],
  reviewStates: ["All Review States", "Needs Review", "In Progress", "Assigned"]
};

const regions = ["West Region", "South Region", "Central Region", "North Region"];
const reviews = ["Needs Review", "Assigned", "In Progress", "Needs Review"];
const impacts = ["High", "High", "Medium", "Medium", "Low"];
const trendShapes = {
  up: [42, 47, 51, 56, 61, 66, 72, 76, 81, 86],
  recovery: [46, 49, 54, 58, 62, 67, 71, 75, 78, 82],
  mixed: [55, 58, 54, 62, 59, 66, 63, 70, 68, 74]
};

function whyFor(industry, item, riskType, region, direction) {
  const pressure = direction === "recovery" ? "is improving but still needs ownership" : "is moving outside the expected operating band";
  return `${item} in ${region} ${pressure}, with ${riskType.toLowerCase()} signals now above the industry baseline.`;
}

export const patterns = Object.entries(industries).flatMap(([division, config], industryIndex) =>
  config.items.map((item, index) => {
    const direction = index % 9 === 3 || index % 11 === 7 ? "recovery" : index % 5 === 2 ? "mixed" : "up";
    const riskType = config.riskTypes[index % config.riskTypes.length];
    const region = regions[(index + industryIndex) % regions.length];
    const scoreBase = direction === "recovery" ? 42 : 72 + ((index * 5 + industryIndex * 3) % 23);
    return {
      id: industryIndex * 100 + index + 1,
      pattern: item,
      region,
      division,
      signal: riskType,
      why: whyFor(division, item, riskType, region, direction),
      impact: impacts[(index + industryIndex) % impacts.length],
      review: reviews[(index + industryIndex) % reviews.length],
      score: scoreBase,
      trend: trendShapes[direction].map((value, point) => value + ((index + industryIndex + point) % 5) - 2),
      direction,
      color: direction === "recovery" ? "#16A34A" : index % 3 === 0 ? "#EF4444" : index % 3 === 1 ? "#F97316" : "#F5B544"
    };
  })
);
