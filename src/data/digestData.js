const industries = {
  "Manufacturing & Automotive": {
    audience: "VP, Manufacturing Operations",
    scope: "Assembly, quality, maintenance, supplier flow",
    summary: "Builds an operational view across plant throughput, quality escapes, maintenance readiness, supplier disruption, and workforce constraints.",
    riskTypes: ["Throughput", "Quality", "Maintenance", "Supplier Flow", "Labor Coverage", "Launch Readiness"],
    mapTitle: "Manufacturing Regional Risk",
    mapSubtitle: "Regional pressure across plants, suppliers, and launch operations.",
    itemGroups: {
      Throughput: ["Final assembly takt miss", "Bottleneck station cycle-time drift", "Constraint line downtime carryover", "Production schedule compression", "End-of-line test queue buildup"],
      Quality: ["Quality hold aging", "Layered process audit evidence gap", "Warranty claim signal spike", "Supplier containment drift", "Engineering disposition backlog"],
      Maintenance: ["Paint booth maintenance backlog", "Critical asset PM deferral", "Tooling changeover delay", "Calibration evidence slippage", "Body shop downtime risk"],
      "Supplier Flow": ["Supplier sequencing volatility", "Inbound premium freight surge", "Parts shortage escalation", "Line-side material kitting miss", "Supplier ASN accuracy drop"],
      "Labor Coverage": ["Critical station labor shortage", "Shift handoff variance", "Maintenance overtime exposure", "Absenteeism coverage gap", "Supervisor span-of-control pressure"],
      "Launch Readiness": ["Launch part readiness gap", "Customer campaign readiness", "Pilot build defect recurrence", "Process validation evidence gap", "New model ramp containment risk"]
    }
  },
  "Construction & Infrastructure": {
    audience: "VP, Program Delivery",
    scope: "Capital projects, field execution, contractors",
    summary: "Tracks schedule pressure, contractor coordination, inspection readiness, permit friction, and change-order exposure across active projects.",
    riskTypes: ["Schedule", "Contractors", "Permits", "Inspections", "Change Orders", "Utility Coordination"],
    mapTitle: "Construction Regional Risk",
    mapSubtitle: "Regional pressure across projects, crews, permits, and inspections.",
    itemGroups: {
      Schedule: ["Critical path float erosion", "Schedule recovery plan drift", "Concrete pour window compression", "Commissioning sequence compression", "Long-lead procurement slip"],
      Contractors: ["Specialty crew coverage constraint", "Subcontractor mobilization miss", "Night work productivity drag", "Temporary works review delay", "Site supervision coverage gap"],
      Permits: ["Permit dependency slippage", "Right-of-way access conflict", "Traffic control approval delay", "Environmental hold point risk", "Lane closure permit aging"],
      Inspections: ["Inspection readiness gap", "Punch list growth", "Survey control discrepancy", "Commissioning evidence gap", "Quality witness point miss"],
      "Change Orders": ["Contractor change-order pressure", "Design response backlog", "Owner decision latency", "Field rework narrative cluster", "Scope clarification backlog"],
      "Utility Coordination": ["Utility tie-in delay", "Rail possession constraint", "Drainage package resequencing", "Material staging conflict", "Third-party outage window miss"]
    }
  },
  "Energy & Utilities": {
    audience: "VP, Operations & Reliability",
    scope: "Grid, field service, generation, compliance",
    summary: "Prioritizes outage response, asset reliability, work-order aging, regulatory readiness, and customer-impact risk by operating area.",
    riskTypes: ["Outage Response", "Asset Reliability", "Field Dispatch", "Regulatory", "Customer Impact", "Switching"],
    mapTitle: "Energy Regional Risk",
    mapSubtitle: "Regional pressure across grid assets, dispatch, customers, and compliance.",
    itemGroups: {
      "Outage Response": ["Outage response escalation surge", "Storm staging readiness gap", "Restoration estimate variance", "Mutual-aid crew constraint", "Critical restoration handoff miss"],
      "Asset Reliability": ["Substation maintenance deferral", "Transformer inspection backlog", "Feeder reliability deterioration", "Critical spares exposure", "Underground fault queue"],
      "Field Dispatch": ["Dispatch queue recovery", "Crew travel time expansion", "Vegetation work-order aging", "Meter exchange backlog", "Field appointment backlog"],
      Regulatory: ["Regulatory evidence gap", "NERC evidence aging", "Relay testing schedule slip", "Protection setting review delay", "Compliance exception closure aging"],
      "Customer Impact": ["Customer impact narrative increase", "Medical priority account miss", "Call center repeat contact rise", "Voltage complaint cluster", "Estimated bill complaint cluster"],
      Switching: ["Switching workflow drift", "Planned outage compression", "Clearance tagging variance", "Switching order approval delay", "Control room procedure miss"]
    }
  },
  "Aerospace & Shipbuilding": {
    audience: "VP, Complex Programs",
    scope: "Program delivery, yards, suppliers, certification",
    summary: "Surfaces program slippage, nonconformance pressure, certification evidence gaps, and yard readiness across long-cycle builds.",
    riskTypes: ["Program Milestones", "Nonconformance", "Certification", "Supplier Readiness", "Rework", "Yard Access"],
    mapTitle: "Aerospace & Shipbuilding Regional Risk",
    mapSubtitle: "Regional pressure across programs, yards, suppliers, and certification gates.",
    itemGroups: {
      "Program Milestones": ["Program milestone recovery risk", "Critical drawing release delay", "Build bay constraint", "Flight test readiness gap", "Sea trial readiness slip"],
      Nonconformance: ["Nonconformance rework stack", "Engineering disposition queue", "MRB decision latency", "Quality escape containment", "Weld inspection backlog"],
      Certification: ["Certification package aging", "Customer acceptance evidence gap", "Certification lab capacity", "Conformity inspection delay", "Test article documentation gap"],
      "Supplier Readiness": ["Supplier readiness recovery", "Supplier first article miss", "Long-lead material shortage", "Avionics integration slip", "Vendor qualification evidence gap"],
      Rework: ["Trade stacking congestion", "Composite layup defect cluster", "Hull outfitting compression", "Rework labor queue saturation", "Out-of-station work transfer risk"],
      "Yard Access": ["Yard access conflict", "Dry dock sequencing delay", "Tool calibration slippage", "Dockside equipment availability gap", "Restricted area escort coverage"]
    }
  },
  "Logistics & Heavy Haul": {
    audience: "VP, Logistics Operations",
    scope: "Lane reliability, terminals, permits, fleet readiness",
    summary: "Highlights what deserves leadership attention across lanes, terminals, permits, fleet readiness, driver coverage, and shipment control.",
    riskTypes: ["Lane Reliability", "Terminal Dwell", "Fleet Readiness", "Permits", "Driver Coverage", "Chain of Custody"],
    mapTitle: "Logistics Regional Risk",
    mapSubtitle: "Regional pressure across terminals, lanes, permits, fleet, and driver coverage.",
    itemGroups: {
      "Lane Reliability": ["Bridge restriction reroute", "Weather route exposure", "Customer delivery promise risk", "Route exception language spike", "Border crossing delay cluster"],
      "Terminal Dwell": ["Terminal dwell escalation", "Port appointment miss", "Rail interchange congestion", "Yard departure queue", "Cross-dock labor gap"],
      "Fleet Readiness": ["Fleet readiness backlog", "Trailer maintenance aging", "Returnable asset shortage", "Crane unload window compression", "Specialized trailer availability gap"],
      Permits: ["Oversize permit delay", "Escort availability constraint", "Heavy-haul route survey delay", "Jurisdiction permit packet aging", "Pilot car schedule conflict"],
      "Driver Coverage": ["Driver coverage recovery", "Dispatch handoff variance", "Fuel stop disruption", "Hours-of-service reset exposure", "Qualified operator coverage gap"],
      "Chain of Custody": ["Chain-of-custody evidence gap", "High-value shipment hold", "Customs documentation drift", "Carrier compliance evidence gap", "Seal exception documentation miss"]
    }
  },
  "Forestry & Logging": {
    audience: "VP, Resource Operations",
    scope: "Harvest blocks, mills, access roads, contractors",
    summary: "Combines harvest readiness, mill intake, road access, weather exposure, contractor coverage, and environmental compliance.",
    riskTypes: ["Harvest Readiness", "Weather Access", "Equipment", "Mill Intake", "Contractor Coverage", "Environmental"],
    mapTitle: "Forestry Regional Risk",
    mapSubtitle: "Regional pressure across harvest blocks, roads, mills, contractors, and permits.",
    itemGroups: {
      "Harvest Readiness": ["Remote block release delay", "Active stand closeout risk", "Crew travel exposure", "Harvest plan variance", "Cut block sequencing miss"],
      "Weather Access": ["Weather access disruption", "Haul road soft spot cluster", "Road matting shortage", "Wet weather productivity drag", "Bridge load rating concern"],
      Equipment: ["Equipment availability drag", "Harvester repair backlog", "Skidder utilization drop", "Fuel delivery constraint", "Loader uptime deterioration"],
      "Mill Intake": ["Mill intake imbalance", "Log deck overflow", "Mill species mix mismatch", "Scaling ticket variance", "Chip truck queue expansion"],
      "Contractor Coverage": ["Contractor coverage recovery", "Contractor invoice aging", "Access gate coordination miss", "Haul contractor capacity gap", "Crew onboarding evidence gap"],
      Environmental: ["Environmental permit evidence gap", "Stream buffer documentation gap", "Fire condition monitoring gap", "Reforestation handoff delay", "Erosion control inspection miss"]
    }
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

function itemEntries(config) {
  return config.riskTypes.flatMap((riskType) => config.itemGroups[riskType].map((item) => ({ item, riskType })));
}

export const patterns = Object.entries(industries).flatMap(([division, config], industryIndex) =>
  itemEntries(config).map(({ item, riskType }, index) => {
    const direction = index % 9 === 3 || index % 11 === 7 ? "recovery" : index % 5 === 2 ? "mixed" : "up";
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
