/**
 * HomeServiceNicheConfig — shared configuration for the three launch niches:
 * Roofing, HVAC, and Plumbing.
 *
 * Each niche entry contains:
 *  - services, emergencies, and seasonal campaigns
 *  - intake question sets for the lead capture form
 *  - lead source labels and scoring weights
 *  - financing needs and recommended capital goals
 *  - ranked (local SEO) scoring categories
 *  - top recommended actions per niche
 */

export type NicheKey = "roofing" | "hvac" | "plumbing";

export interface NicheIntakeOption {
  label: string;
  value: string;
}

export interface NicheIntakeQuestion {
  id: string;
  label: string;
  type: "select" | "radio" | "toggle";
  options: NicheIntakeOption[];
  required?: boolean;
}

export interface HomeServiceNicheConfig {
  key: NicheKey;
  name: string;
  /** Short descriptor shown in UI breadcrumbs and labels */
  label: string;
  /** Tagline for the intake form CTA button */
  ctaLabel: string;
  services: string[];
  emergencies: string[];
  seasonalCampaigns: string[];
  leadSources: string[];
  intakeQuestions: NicheIntakeQuestion[];
  /** Biggest-problem options shown in the intake form */
  biggestProblems: string[];
  /** Crew/team size options */
  teamSizeOptions: string[];
  financingNeeds: string[];
  capitalGoals: string[];
  /** Scoring weight multipliers for each Ranked category (0-1) */
  rankedScoringWeights: {
    gbpHealth: number;
    reviewVelocity: number;
    localCitations: number;
    seoScore: number;
    contentFreshness: number;
    competitorGap: number;
  };
  /** Up to 5 recommended actions for new clients */
  topRecommendedActions: { title: string; description: string }[];
  /** 30/60/90-day funding readiness action plan */
  fundingActionPlan: {
    day30: string[];
    day60: string[];
    day90: string[];
  };
}

export const HOME_SERVICE_NICHE_CONFIGS: Record<
  NicheKey,
  HomeServiceNicheConfig
> = {
  roofing: {
    key: "roofing",
    name: "Roofing",
    label: "Roofing",
    ctaLabel: "Build My Live Roofing Demo",
    services: [
      "Roof Inspection",
      "Storm/Hail Damage Repair",
      "Full Replacement",
      "Shingle Repair",
      "Flat Roof / Commercial",
      "Gutter Installation",
      "Insurance Claims Assistance",
    ],
    emergencies: [
      "Active Leak / Water Intrusion",
      "Storm / Hail Damage",
      "Wind Damage",
      "Missing Shingles",
      "Structural Damage",
    ],
    seasonalCampaigns: [
      "Spring Inspection Special",
      "Summer Storm Preparedness",
      "Fall Maintenance Check",
      "Winter Emergency Response",
      "Insurance Claim Season (Spring/Summer)",
    ],
    leadSources: [
      "Google Search",
      "Google Maps (GBP)",
      "Referral",
      "Facebook / Instagram Ads",
      "Door Knocking",
      "Storm Canvassing",
      "Insurance Agent Referral",
      "Angi / HomeAdvisor",
    ],
    intakeQuestions: [
      {
        id: "roofType",
        label: "Roof Type",
        type: "select",
        options: [
          { label: "Asphalt Shingles", value: "asphalt" },
          { label: "Metal / Standing Seam", value: "metal" },
          { label: "Tile / Concrete", value: "tile" },
          { label: "Flat / TPO / EPDM", value: "flat" },
          { label: "Not Sure", value: "unknown" },
        ],
      },
      {
        id: "roofAge",
        label: "Approximate Roof Age",
        type: "select",
        options: [
          { label: "Under 5 Years", value: "0-5" },
          { label: "5–10 Years", value: "5-10" },
          { label: "10–15 Years", value: "10-15" },
          { label: "15–20 Years", value: "15-20" },
          { label: "Over 20 Years", value: "20+" },
        ],
      },
      {
        id: "claimStatus",
        label: "Insurance Claim Status",
        type: "radio",
        options: [
          { label: "No Claim", value: "none" },
          { label: "Claim In Progress", value: "in_progress" },
          { label: "Claim Paid / Settled", value: "settled" },
          { label: "Denied — Need Help", value: "denied" },
        ],
      },
      {
        id: "jobType",
        label: "Primary Job Type",
        type: "radio",
        options: [
          { label: "Inspection / Assessment", value: "inspection" },
          { label: "Repair", value: "repair" },
          { label: "Full Replacement", value: "replacement" },
          { label: "Storm / Emergency", value: "emergency" },
        ],
      },
      {
        id: "financingInterest",
        label: "Financing Interest",
        type: "radio",
        options: [
          { label: "Yes — for job financing", value: "job_financing" },
          { label: "Yes — for business growth", value: "business_growth" },
          { label: "Not Right Now", value: "none" },
        ],
      },
    ],
    biggestProblems: [
      "Need More Booked Inspections",
      "Weak Follow-up on Estimates",
      "Poor Reviews / Low Trust",
      "Weak Local Ranking on Google",
      "Need Business Funding",
      "Too Many Disconnected Tools",
    ],
    teamSizeOptions: [
      "Solo Operator",
      "1–2 Crews",
      "3–5 Crews",
      "6–10 Crews",
      "10+ Crews",
    ],
    financingNeeds: [
      "Equipment (trucks, trailers, lifts)",
      "Working Capital / Cash Flow",
      "Marketing Campaign Funding",
      "Crew Expansion / Hiring",
      "Insurance Premium Financing",
      "Inventory / Materials",
    ],
    capitalGoals: [
      "Purchase additional work trucks",
      "Buy roofing equipment & trailers",
      "Hire and train new crews",
      "Fund a storm-season marketing push",
      "Improve cash flow between large jobs",
      "Build business credit profile",
    ],
    rankedScoringWeights: {
      gbpHealth: 0.25,
      reviewVelocity: 0.25,
      localCitations: 0.15,
      seoScore: 0.15,
      contentFreshness: 0.1,
      competitorGap: 0.1,
    },
    topRecommendedActions: [
      {
        title: "Activate Missed-Call Text-Back",
        description:
          "An immediate SMS reply on missed calls captures storm leads before they call a competitor.",
      },
      {
        title: "Generate 10 New Google Reviews",
        description:
          "Roofing is trust-driven. Customers compare reviews before calling — 10+ recent reviews dramatically increases call rates.",
      },
      {
        title: "Optimize Google Business Profile",
        description:
          "Upload recent job photos, add roofing services, and post weekly to improve Map Pack ranking.",
      },
      {
        title: "Launch Estimate Follow-Up Sequence",
        description:
          "Most estimates close on follow-up #2 or #3. Automate this sequence so revenue doesn't leak.",
      },
      {
        title: "Set Up Business Credit Tradelines",
        description:
          "Opening net-30 accounts with vendor suppliers is the fastest way to build a fundable business credit profile.",
      },
    ],
    fundingActionPlan: {
      day30: [
        "Obtain EIN and verify business entity type",
        "Open a dedicated business checking account",
        "Apply for a DUNS number (free via Dun & Bradstreet)",
        "Register with Experian Business and Equifax Business",
      ],
      day60: [
        "Open 2–3 net-30 vendor accounts (e.g., Uline, Quill, Grainger)",
        "Collect 3 months of business bank statements",
        "Document monthly revenue and compile a basic P&L",
        "Ensure business address is consistent across all profiles",
      ],
      day90: [
        "Apply for a business credit card with a low limit to build history",
        "Request a business line of credit from a local bank or CDFI",
        "Prepare equipment financing application for trucks / trailers",
        "Review and clean up any inconsistencies in credit bureau profiles",
      ],
    },
  },

  hvac: {
    key: "hvac",
    name: "HVAC",
    label: "HVAC",
    ctaLabel: "Build My Live HVAC Demo",
    services: [
      "AC / Heating Repair",
      "System Replacement",
      "Maintenance Plan",
      "Duct Cleaning / Sealing",
      "Indoor Air Quality",
      "Commercial HVAC",
      "New Construction Install",
    ],
    emergencies: [
      "No Cooling in Summer Heat",
      "No Heat in Winter",
      "System Completely Down",
      "Carbon Monoxide Concern",
      "Refrigerant Leak",
    ],
    seasonalCampaigns: [
      "Spring AC Tune-Up",
      "Summer Emergency Response",
      "Fall Heating Check",
      "Winter No-Heat Dispatch",
      "Annual Maintenance Plan Renewal",
    ],
    leadSources: [
      "Google Search",
      "Google Maps (GBP)",
      "Referral",
      "Facebook / Instagram Ads",
      "Maintenance Plan Renewal",
      "Manufacturer Referral",
      "Home Warranty Company",
      "Angi / HomeAdvisor",
    ],
    intakeQuestions: [
      {
        id: "issueType",
        label: "Current Issue",
        type: "radio",
        options: [
          { label: "No Cooling (AC is down)", value: "no_cooling" },
          { label: "No Heating (Furnace / Heat Pump)", value: "no_heat" },
          { label: "System Running But Inefficient", value: "inefficient" },
          { label: "Routine Maintenance", value: "maintenance" },
          { label: "New Installation", value: "new_install" },
        ],
        required: true,
      },
      {
        id: "equipmentType",
        label: "Equipment Type",
        type: "select",
        options: [
          { label: "Central AC + Gas Furnace", value: "central_split" },
          { label: "Heat Pump", value: "heat_pump" },
          { label: "Mini-Split / Ductless", value: "mini_split" },
          { label: "Boiler", value: "boiler" },
          { label: "Commercial Rooftop Unit", value: "rtu" },
          { label: "Not Sure", value: "unknown" },
        ],
      },
      {
        id: "equipmentAge",
        label: "Equipment Age",
        type: "select",
        options: [
          { label: "Under 5 Years", value: "0-5" },
          { label: "5–10 Years", value: "5-10" },
          { label: "10–15 Years", value: "10-15" },
          { label: "Over 15 Years", value: "15+" },
          { label: "Not Sure", value: "unknown" },
        ],
      },
      {
        id: "repairVsReplace",
        label: "Repair or Replace?",
        type: "radio",
        options: [
          { label: "Repair if Possible", value: "repair" },
          { label: "Open to Replacement", value: "replacement" },
          { label: "Definitely Replacing", value: "new" },
          { label: "Not Sure — Need Assessment", value: "assessment" },
        ],
      },
      {
        id: "financingInterest",
        label: "Financing Interest",
        type: "radio",
        options: [
          {
            label: "Yes — customer financing for installs",
            value: "customer_financing",
          },
          { label: "Yes — business growth capital", value: "business_growth" },
          { label: "Not Right Now", value: "none" },
        ],
      },
    ],
    biggestProblems: [
      "Missing Emergency Calls After Hours",
      "Not Enough Maintenance Plan Signups",
      "Weak Follow-up on Quotes",
      "Poor Google Maps Visibility",
      "Need Business Funding",
      "Too Many Disconnected Tools",
    ],
    teamSizeOptions: [
      "Solo Technician",
      "2–3 Techs",
      "4–6 Techs",
      "7–12 Techs",
      "12+ Techs",
    ],
    financingNeeds: [
      "Service Vehicles / Vans",
      "Diagnostic Equipment",
      "HVAC Inventory (coils, parts)",
      "Working Capital / Cash Flow",
      "Marketing Campaign Funding",
      "Hiring & Training",
    ],
    capitalGoals: [
      "Purchase service vans / vehicles",
      "Stock HVAC parts and coil inventory",
      "Hire and certify new technicians",
      "Fund a seasonal marketing campaign",
      "Offer customer financing for installs",
      "Build business credit profile",
    ],
    rankedScoringWeights: {
      gbpHealth: 0.3,
      reviewVelocity: 0.25,
      localCitations: 0.15,
      seoScore: 0.15,
      contentFreshness: 0.1,
      competitorGap: 0.05,
    },
    topRecommendedActions: [
      {
        title: "Enable 24/7 Emergency Call Capture",
        description:
          "HVAC is seasonal and emergency-driven. An AI front desk captures no-cooling / no-heat calls around the clock.",
      },
      {
        title: "Launch a Maintenance Plan Sign-Up Campaign",
        description:
          "Recurring maintenance plans stabilize revenue in shoulder seasons and generate free replacement leads.",
      },
      {
        title: "Collect 15+ Recent Google Reviews",
        description:
          "HVAC customers heavily compare reviews before booking. Recent reviews from the past 90 days carry the most weight.",
      },
      {
        title: "Post Seasonal Content on Google Business Profile",
        description:
          "Weekly GBP posts about tune-ups, emergencies, and energy savings improve local Map Pack placement.",
      },
      {
        title: "Offer Customer Financing for Replacements",
        description:
          "Systems over 10 years old often qualify customers for replacement financing — removing the #1 objection to closing a new install.",
      },
    ],
    fundingActionPlan: {
      day30: [
        "Verify EIN and business entity (LLC or S-Corp)",
        "Open dedicated business checking account",
        "Apply for DUNS number",
        "Document current fleet (vehicles + equipment) for asset-based lending",
      ],
      day60: [
        "Collect 3 months of business bank statements",
        "Open 2–3 net-30 vendor accounts with HVAC distributors",
        "Apply for Experian Business and Equifax Business profiles",
        "Compile a list of capital needs (vehicles, inventory, hiring)",
      ],
      day90: [
        "Apply for equipment financing for additional service vans",
        "Research HVAC distributor financing programs",
        "Apply for a business line of credit",
        "Consult a CDFI or SBA lender for working capital options",
      ],
    },
  },

  plumbing: {
    key: "plumbing",
    name: "Plumbing",
    label: "Plumbing",
    ctaLabel: "Build My Live Plumbing Demo",
    services: [
      "Emergency Leak / Burst Pipe",
      "Drain Cleaning / Sewer",
      "Water Heater Repair / Replacement",
      "Toilet / Fixture Repair",
      "Sewer Line Inspection",
      "Hydro-Jetting",
      "Water Softener / Filtration",
      "Commercial Plumbing",
    ],
    emergencies: [
      "Burst Pipe / Active Leak",
      "Sewer Backup",
      "No Hot Water",
      "Gas Line Issue",
      "Flooding / Water Damage",
    ],
    seasonalCampaigns: [
      "Winter Freeze / Pipe Winterization",
      "Spring Sewer Line Inspection",
      "Summer Outdoor Plumbing Check",
      "Fall Water Heater Tune-Up",
      "Year-Round Drain Maintenance Plan",
    ],
    leadSources: [
      "Google Search",
      "Google Maps (GBP)",
      "Referral",
      "Facebook / Instagram Ads",
      "Property Manager Relationships",
      "Home Warranty Company",
      "Angi / HomeAdvisor",
      "Door Hanger / Local Mailer",
    ],
    intakeQuestions: [
      {
        id: "issueType",
        label: "Service Type",
        type: "radio",
        options: [
          { label: "Emergency — Burst Pipe / Active Leak", value: "emergency" },
          { label: "Drain / Sewer Issue", value: "drain_sewer" },
          {
            label: "Water Heater Repair or Replacement",
            value: "water_heater",
          },
          { label: "Toilet / Fixture Repair", value: "fixture" },
          { label: "Routine Maintenance", value: "maintenance" },
        ],
        required: true,
      },
      {
        id: "waterHeaterType",
        label: "Water Heater Type (if applicable)",
        type: "select",
        options: [
          { label: "Tank — Gas", value: "tank_gas" },
          { label: "Tank — Electric", value: "tank_electric" },
          { label: "Tankless — Gas", value: "tankless_gas" },
          { label: "Tankless — Electric", value: "tankless_electric" },
          { label: "N/A", value: "na" },
        ],
      },
      {
        id: "emergencyPriority",
        label: "Emergency Dispatch Priority",
        type: "radio",
        options: [
          { label: "Right Now — Active Emergency", value: "immediate" },
          { label: "Today", value: "today" },
          { label: "This Week", value: "this_week" },
          { label: "Flexible / Scheduled", value: "flexible" },
        ],
      },
      {
        id: "propertyType",
        label: "Property Type",
        type: "radio",
        options: [
          { label: "Residential — Single Family", value: "residential_sf" },
          { label: "Residential — Multi-Unit", value: "residential_multi" },
          { label: "Commercial", value: "commercial" },
          { label: "Industrial / Specialty", value: "industrial" },
        ],
      },
      {
        id: "financingInterest",
        label: "Financing Interest",
        type: "radio",
        options: [
          {
            label: "Yes — project or equipment financing",
            value: "project_financing",
          },
          { label: "Yes — business growth capital", value: "business_growth" },
          { label: "Not Right Now", value: "none" },
        ],
      },
    ],
    biggestProblems: [
      "Missing After-Hours Emergency Calls",
      "Slow Speed-to-Lead (Losing Jobs to Faster Plumbers)",
      "Not Enough Google Reviews",
      "Weak Google Maps Visibility",
      "Need Business Funding",
      "Too Many Disconnected Tools",
    ],
    teamSizeOptions: [
      "Solo Plumber",
      "2–3 Plumbers",
      "4–6 Plumbers",
      "7–12 Plumbers",
      "12+ Plumbers",
    ],
    financingNeeds: [
      "Service Vans / Vehicles",
      "Hydro-Jetting / Camera Equipment",
      "Working Capital / Cash Flow",
      "Marketing Campaign Funding",
      "Hiring & Licensing",
      "Inventory / Parts Stocking",
    ],
    capitalGoals: [
      "Purchase additional service vans",
      "Buy hydro-jetting or sewer camera equipment",
      "Hire and license new plumbers",
      "Fund a seasonal or emergency marketing campaign",
      "Improve cash flow for large commercial projects",
      "Build business credit profile",
    ],
    rankedScoringWeights: {
      gbpHealth: 0.25,
      reviewVelocity: 0.3,
      localCitations: 0.15,
      seoScore: 0.15,
      contentFreshness: 0.1,
      competitorGap: 0.05,
    },
    topRecommendedActions: [
      {
        title: "Enable Instant After-Hours Text Response",
        description:
          "Plumbing emergencies don't wait until 9 AM. An AI front desk that texts back immediately wins the job.",
      },
      {
        title: "Build 20+ Google Reviews",
        description:
          "Plumbing is hyper-local and trust-driven. Customers compare star ratings before ever calling — more reviews = more calls.",
      },
      {
        title: "Speed Up Response Time to Under 5 Minutes",
        description:
          "The first plumber to respond almost always gets the job. Automate lead response so no inquiry goes more than 5 minutes unanswered.",
      },
      {
        title: "Launch a Maintenance / Drain Club Plan",
        description:
          "Recurring drain maintenance plans generate predictable recurring revenue and free upsell opportunities.",
      },
      {
        title: "Start Building Business Credit Now",
        description:
          "Opening net-30 vendor accounts is the first step toward qualifying for equipment and vehicle financing.",
      },
    ],
    fundingActionPlan: {
      day30: [
        "Verify EIN and business entity (LLC or S-Corp)",
        "Open a dedicated business checking account",
        "Apply for DUNS number",
        "Document current equipment inventory (vans, tools, cameras)",
      ],
      day60: [
        "Collect 3 months of business bank statements",
        "Open 2–3 net-30 vendor accounts with plumbing suppliers",
        "Register with Experian Business and Equifax Business",
        "Document project types and average ticket size",
      ],
      day90: [
        "Apply for equipment financing (hydro-jet, camera, vans)",
        "Research SBA microloans or CDFI options for working capital",
        "Apply for a business credit card with a low limit",
        "Consult a local bank about a business line of credit",
      ],
    },
  },
};

/** Convenience getter — returns null for unsupported niches */
export function getHomeServiceNicheConfig(
  key: string,
): HomeServiceNicheConfig | null {
  return HOME_SERVICE_NICHE_CONFIGS[key as NicheKey] ?? null;
}

/** The three launch-facing niches */
export const LAUNCH_NICHES: NicheKey[] = ["roofing", "hvac", "plumbing"];

/** Display names for the niche picker / selectors */
export const LAUNCH_NICHE_LABELS: Record<NicheKey, string> = {
  roofing: "Roofing",
  hvac: "HVAC",
  plumbing: "Plumbing",
};
