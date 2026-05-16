// ─── Fundability Data: Niche-specific vendor credit, action plans, and funding tiers ───

export type NicheKey =
  | "plumbing"
  | "medspa"
  | "hvac"
  | "restoration"
  | "carpet"
  | "roofing"
  | "realestate"
  | "mortgage"
  | "chiro"
  | "dental"
  | "default";

export interface VendorCredit {
  name: string;
  type: string;
  terms: string;
  limit: string;
  url: string;
}

export interface NicheFundingOpportunity {
  name: string;
  amount: string;
  type: string;
}

export const NICHE_VENDOR_CREDITS: Record<NicheKey, VendorCredit[]> = {
  plumbing: [
    {
      name: "Ferguson Enterprises",
      type: "Trade Supplies",
      terms: "Net-30",
      limit: "Up to $50,000",
      url: "https://www.ferguson.com",
    },
    {
      name: "Winsupply",
      type: "Plumbing Supplies",
      terms: "Net-30",
      limit: "Up to $25,000",
      url: "https://www.winsupply.com",
    },
    {
      name: "HD Supply",
      type: "MRO Supplies",
      terms: "Net-30",
      limit: "Up to $20,000",
      url: "https://www.hdsupply.com",
    },
    {
      name: "Grainger",
      type: "Tools & Equipment",
      terms: "Net-30",
      limit: "Up to $10,000",
      url: "https://www.grainger.com",
    },
  ],
  medspa: [
    {
      name: "Allergan Capital",
      type: "Treatment Equipment",
      terms: "Net-30",
      limit: "Up to $100,000",
      url: "https://www.allergan.com",
    },
    {
      name: "Merz Aesthetics",
      type: "Aesthetic Devices",
      terms: "Net-60",
      limit: "Up to $75,000",
      url: "https://www.merzaesthetics.com",
    },
    {
      name: "PatientNow",
      type: "Practice Software",
      terms: "Net-30",
      limit: "Up to $10,000",
      url: "https://www.patientnow.com",
    },
    {
      name: "Galderma",
      type: "Injectables Supply",
      terms: "Net-30",
      limit: "Up to $50,000",
      url: "https://www.galderma.com",
    },
  ],
  hvac: [
    {
      name: "Johnstone Supply",
      type: "HVAC Parts",
      terms: "Net-30",
      limit: "Up to $30,000",
      url: "https://www.johnstonesupply.com",
    },
    {
      name: "Wesco International",
      type: "Electrical/HVAC",
      terms: "Net-30",
      limit: "Up to $40,000",
      url: "https://www.wesco.com",
    },
    {
      name: "Carrier Enterprise",
      type: "Equipment",
      terms: "Net-60",
      limit: "Up to $100,000",
      url: "https://www.carrierenterprise.com",
    },
    {
      name: "Grainger",
      type: "Tools & Equipment",
      terms: "Net-30",
      limit: "Up to $15,000",
      url: "https://www.grainger.com",
    },
  ],
  restoration: [
    {
      name: "ServiceMaster Capital",
      type: "Equipment Lease",
      terms: "Net-30",
      limit: "Up to $100,000",
      url: "https://www.servicemaster.com",
    },
    {
      name: "BMS CAT",
      type: "Restoration Equipment",
      terms: "Net-45",
      limit: "Up to $75,000",
      url: "https://www.bmscat.com",
    },
    {
      name: "Belfor Supply Chain",
      type: "Restoration Supplies",
      terms: "Net-30",
      limit: "Up to $50,000",
      url: "https://www.belfor.com",
    },
    {
      name: "Dri-Eaz",
      type: "Drying Equipment",
      terms: "Net-30",
      limit: "Up to $25,000",
      url: "https://www.dri-eaz.com",
    },
  ],
  carpet: [
    {
      name: "Prochem Equipment",
      type: "Cleaning Equipment",
      terms: "Net-30",
      limit: "Up to $30,000",
      url: "https://www.prochem.com",
    },
    {
      name: "Jon-Don",
      type: "Cleaning Supplies",
      terms: "Net-30",
      limit: "Up to $20,000",
      url: "https://www.jondon.com",
    },
    {
      name: "Sapphire Scientific",
      type: "Truck Mounts",
      terms: "Equipment Financing",
      limit: "Up to $50,000",
      url: "https://www.sapphirescientific.com",
    },
    {
      name: "Bridgepoint Systems",
      type: "Chemistry & Equipment",
      terms: "Net-30",
      limit: "Up to $15,000",
      url: "https://www.bridgepoint.com",
    },
  ],
  roofing: [
    {
      name: "ABC Supply Co.",
      type: "Roofing Materials",
      terms: "Net-30",
      limit: "Nationwide Credit",
      url: "https://www.abcsupply.com",
    },
    {
      name: "Beacon Roofing Supply",
      type: "Roofing/Siding",
      terms: "Net-30",
      limit: "Up to $250,000",
      url: "https://www.becn.com",
    },
    {
      name: "SRS Distribution",
      type: "Roofing Wholesale",
      terms: "Net-30",
      limit: "Up to $100,000",
      url: "https://www.srsdistribution.com",
    },
    {
      name: "GAF Materials",
      type: "Shingles/Accessories",
      terms: "Net-30",
      limit: "Up to $50,000",
      url: "https://www.gaf.com",
    },
  ],
  realestate: [
    {
      name: "CoStar Group",
      type: "Market Data",
      terms: "Net-30",
      limit: "Up to $25,000",
      url: "https://www.costar.com",
    },
    {
      name: "BoomTown CRM",
      type: "Lead Gen Software",
      terms: "Net-30",
      limit: "Up to $15,000",
      url: "https://www.boomtownroi.com",
    },
    {
      name: "Docusign Teams",
      type: "eSignature",
      terms: "Net-30",
      limit: "Up to $10,000",
      url: "https://www.docusign.com",
    },
    {
      name: "Keller Williams Capital",
      type: "Marketing Credit",
      terms: "Net-30",
      limit: "Up to $25,000",
      url: "https://www.kw.com",
    },
  ],
  mortgage: [
    {
      name: "ICE Mortgage Technology",
      type: "LOS Software",
      terms: "Net-30",
      limit: "Up to $50,000",
      url: "https://www.icemortgagetechnology.com",
    },
    {
      name: "HomeLight",
      type: "Referral Credit",
      terms: "Net-30",
      limit: "Up to $20,000",
      url: "https://www.homelight.com",
    },
    {
      name: "Total Expert",
      type: "Marketing Software",
      terms: "Net-30",
      limit: "Up to $15,000",
      url: "https://www.totalexpert.com",
    },
    {
      name: "Mortgage Coach",
      type: "Presentation Tools",
      terms: "Net-30",
      limit: "Up to $10,000",
      url: "https://www.mortgagecoach.com",
    },
  ],
  chiro: [
    {
      name: "Patterson Dental/Chiro",
      type: "Chiro Equipment",
      terms: "Net-30/Financing",
      limit: "Up to $100,000",
      url: "https://www.pattersoncompanies.com",
    },
    {
      name: "Oakworks",
      type: "Table Leasing",
      terms: "Equipment Lease",
      limit: "Up to $50,000",
      url: "https://www.oakworks.com",
    },
    {
      name: "Perfect Patients",
      type: "Practice Software",
      terms: "Net-30",
      limit: "Up to $10,000",
      url: "https://www.perfectpatients.com",
    },
    {
      name: "ChiroTouch",
      type: "EHR Software",
      terms: "Net-30",
      limit: "Up to $15,000",
      url: "https://www.chirotouch.com",
    },
  ],
  dental: [
    {
      name: "Patterson Dental",
      type: "Dental Equipment",
      terms: "Net-90/Financing",
      limit: "Up to $500,000",
      url: "https://www.pattersondental.com",
    },
    {
      name: "Henry Schein",
      type: "Dental Supplies",
      terms: "Net-30/Financing",
      limit: "Up to $500,000",
      url: "https://www.henryschein.com",
    },
    {
      name: "Benco Dental",
      type: "Equipment & Supplies",
      terms: "Net-30/6-12 mo",
      limit: "Up to $250,000",
      url: "https://www.benco.com",
    },
    {
      name: "Carestream Dental",
      type: "Imaging Equipment",
      terms: "Equipment Financing",
      limit: "Up to $200,000",
      url: "https://www.carestreamdental.com",
    },
  ],
  default: [
    {
      name: "Uline",
      type: "Office/Packaging Supplies",
      terms: "Net-30",
      limit: "Up to $10,000",
      url: "https://www.uline.com",
    },
    {
      name: "Quill",
      type: "Office Supplies",
      terms: "Net-30",
      limit: "Up to $5,000",
      url: "https://www.quill.com",
    },
    {
      name: "Grainger",
      type: "Tools & Equipment",
      terms: "Net-30",
      limit: "Up to $10,000",
      url: "https://www.grainger.com",
    },
    {
      name: "Amazon Business",
      type: "Business Supplies",
      terms: "Net-30",
      limit: "Up to $5,000",
      url: "https://business.amazon.com",
    },
  ],
};

export const NICHE_FUNDING_OPPORTUNITIES: Record<
  NicheKey,
  NicheFundingOpportunity[]
> = {
  plumbing: [
    {
      name: "Ferguson Enterprises Equipment Line",
      amount: "Up to $50,000",
      type: "Trade Credit",
    },
    {
      name: "SBA 7(a) Loan — Vehicle/Equipment",
      amount: "Up to $500,000",
      type: "SBA Loan",
    },
    {
      name: "Ford Pro Commercial Credit",
      amount: "Up to $100,000",
      type: "Vehicle Financing",
    },
  ],
  medspa: [
    {
      name: "Allergan Capital Treatment Equipment",
      amount: "Up to $100,000",
      type: "Equipment Financing",
    },
    {
      name: "CareCredit Merchant Financing",
      amount: "Up to $50,000",
      type: "Patient Financing Line",
    },
    {
      name: "SBA 7(a) — Practice Expansion",
      amount: "Up to $350,000",
      type: "SBA Loan",
    },
  ],
  hvac: [
    {
      name: "Carrier Capital Equipment Financing",
      amount: "Up to $200,000",
      type: "Equipment Financing",
    },
    {
      name: "Johnstone Supply Trade Line",
      amount: "Up to $30,000",
      type: "Trade Credit",
    },
    {
      name: "SBA 7(a) — Fleet/Equipment",
      amount: "Up to $500,000",
      type: "SBA Loan",
    },
  ],
  restoration: [
    {
      name: "ServiceMaster Capital",
      amount: "Up to $100,000",
      type: "Equipment Credit",
    },
    {
      name: "Belfor Equipment Credit Line",
      amount: "Up to $75,000",
      type: "Trade Credit",
    },
    {
      name: "SBA 7(a) — Disaster Recovery Equipment",
      amount: "Up to $500,000",
      type: "SBA Loan",
    },
  ],
  carpet: [
    {
      name: "Sapphire Scientific Equipment Financing",
      amount: "Up to $50,000",
      type: "Equipment Financing",
    },
    {
      name: "Jon-Don Trade Credit Line",
      amount: "Up to $20,000",
      type: "Trade Credit",
    },
    {
      name: "SBA Microloan — Van Fleet",
      amount: "Up to $50,000",
      type: "SBA Microloan",
    },
  ],
  roofing: [
    {
      name: "ABC Supply Net-30 Credit Line",
      amount: "Nationwide — no stated cap",
      type: "Trade Credit",
    },
    {
      name: "Beacon Capital Equipment Line",
      amount: "Up to $250,000",
      type: "Equipment Financing",
    },
    {
      name: "SBA 7(a) — Crew Expansion",
      amount: "Up to $500,000",
      type: "SBA Loan",
    },
  ],
  realestate: [
    {
      name: "Keller Williams Capital Marketing Line",
      amount: "Up to $25,000",
      type: "Marketing Credit",
    },
    {
      name: "CoStar Data Credit Line",
      amount: "Up to $25,000",
      type: "Trade Credit",
    },
    {
      name: "HELOC / Business LOC for Lead Gen",
      amount: "Up to $100,000",
      type: "Line of Credit",
    },
  ],
  mortgage: [
    {
      name: "ICE Mortgage Capital Line",
      amount: "Up to $50,000",
      type: "Technology Credit",
    },
    {
      name: "HomeLight Referral Credit",
      amount: "Up to $20,000",
      type: "Lead Gen Credit",
    },
    {
      name: "SBA Microloan — Office / Team",
      amount: "Up to $50,000",
      type: "SBA Microloan",
    },
  ],
  chiro: [
    {
      name: "Patterson Healthcare Capital",
      amount: "Up to $100,000",
      type: "Equipment Financing",
    },
    {
      name: "Oakworks Leasing Program",
      amount: "Up to $50,000",
      type: "Equipment Lease",
    },
    {
      name: "SBA 7(a) — Buildout / Expansion",
      amount: "Up to $350,000",
      type: "SBA Loan",
    },
  ],
  dental: [
    {
      name: "Henry Schein Financial Services",
      amount: "Up to $500,000",
      type: "Equipment Financing",
    },
    {
      name: "Patterson Capital Practice Financing",
      amount: "Up to $500,000",
      type: "Practice Financing",
    },
    {
      name: "SBA 7(a) — Practice Buildout",
      amount: "Up to $2,000,000",
      type: "SBA Loan",
    },
  ],
  default: [
    {
      name: "SBA Microloan Program",
      amount: "Up to $50,000",
      type: "SBA Microloan",
    },
    {
      name: "Business Credit Card Lines",
      amount: "Up to $25,000",
      type: "Revolving Credit",
    },
    {
      name: "CDFI Community Loan",
      amount: "Up to $100,000",
      type: "Community Loan",
    },
  ],
};

export function getNicheKey(niche: string): NicheKey {
  const n = niche.toLowerCase().replace(/[^a-z]/g, "");
  if (n.includes("plumb")) return "plumbing";
  if (n.includes("medspa") || n.includes("spa") || n.includes("aesthetic"))
    return "medspa";
  if (
    n.includes("hvac") ||
    n.includes("heat") ||
    n.includes("cool") ||
    n.includes("air")
  )
    return "hvac";
  if (n.includes("restor") || n.includes("water") || n.includes("fire"))
    return "restoration";
  if (n.includes("carpet") || n.includes("clean")) return "carpet";
  if (n.includes("roof")) return "roofing";
  if (
    n.includes("real") ||
    n.includes("estate") ||
    n.includes("agent") ||
    n.includes("broker")
  )
    return "realestate";
  if (n.includes("mortg") || n.includes("loan")) return "mortgage";
  if (n.includes("chiro")) return "chiro";
  if (n.includes("dent")) return "dental";
  return "default";
}

export interface ScoreInputs {
  entityType: "llc" | "scorp" | "ccorp" | "soleprop" | "";
  hasEin: boolean;
  yearsInBusiness: "lt1" | "1to2" | "gt2" | "";
  hasBankAccount: boolean;
  hasCommercialAddress: boolean;
  hasBusinessPhone: boolean;
  businessCreditCards: "0" | "1" | "2plus";
  hasGbpVerified: boolean;
  hasActiveWebsite: boolean;
  hasExistingLoc: boolean;
}

export function calculateFundabilityScore(inputs: ScoreInputs): number {
  let score = 0;
  if (
    inputs.entityType === "llc" ||
    inputs.entityType === "scorp" ||
    inputs.entityType === "ccorp"
  )
    score += 10;
  if (inputs.hasEin) score += 10;
  if (inputs.yearsInBusiness === "gt2") score += 10;
  else if (inputs.yearsInBusiness === "1to2") score += 5;
  if (inputs.hasBankAccount) score += 15;
  if (inputs.hasCommercialAddress) score += 10;
  if (inputs.hasBusinessPhone) score += 5;
  if (inputs.businessCreditCards === "2plus") score += 15;
  else if (inputs.businessCreditCards === "1") score += 10;
  if (inputs.hasGbpVerified) score += 10;
  if (inputs.hasActiveWebsite) score += 5;
  if (inputs.hasExistingLoc) score += 5;
  return Math.min(score, 100);
}

export type ScoreTier =
  | "pre-fundable"
  | "building"
  | "creditworthy"
  | "fundable";

export function getScoreTier(score: number): ScoreTier {
  if (score <= 30) return "pre-fundable";
  if (score <= 60) return "building";
  if (score <= 80) return "creditworthy";
  return "fundable";
}

export const SCORE_TIER_CONFIG: Record<
  ScoreTier,
  {
    label: string;
    color: string;
    ringColor: string;
    badgeClass: string;
    copy: string;
    fundingRange: string;
  }
> = {
  "pre-fundable": {
    label: "Pre-Fundable",
    color: "#ef4444",
    ringColor: "ring-red-500/40",
    badgeClass: "bg-red-500/15 text-red-300 border-red-500/30",
    copy: "Right now, lenders can't see your business. You're invisible to capital. That changes in 30 days.",
    fundingRange: "Up to $5,000 in secured cards",
  },
  building: {
    label: "Building",
    color: "#f59e0b",
    ringColor: "ring-amber-500/40",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    copy: "You've started. Lenders are starting to notice. Keep going — the first $25,000 credit line is close.",
    fundingRange: "Up to $25,000 unsecured credit; SBA microloans",
  },
  creditworthy: {
    label: "Creditworthy",
    color: "#6366f1",
    ringColor: "ring-indigo-500/40",
    badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    copy: "You have real business credit now. The $100k line of credit is within reach. This is where businesses start to scale.",
    fundingRange: "Up to $100,000 in lines of credit; equipment financing",
  },
  fundable: {
    label: "Fundable",
    color: "#10b981",
    ringColor: "ring-emerald-500/40",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    copy: "You've built what most business owners never will. Capital is available to you on terms — not just from personal risk.",
    fundingRange: "Up to $500,000 commercial credit; SBA 7(a) loans",
  },
};

export interface ActionItem {
  id: string;
  month: 1 | 2 | 3;
  label: string;
  detail: string;
  url?: string;
  scoreBoost: number;
  requiredWhen?: keyof ScoreInputs | "always";
  invertRequired?: boolean; // show when the field is FALSE
}

export const ACTION_PLAN_ITEMS: ActionItem[] = [
  // Month 1 — Foundation
  {
    id: "m1-llc",
    month: 1,
    label: "Form an LLC or S-Corp",
    detail:
      "Sole proprietorships are invisible to lenders. An LLC costs $50–$150 and unlocks every tier of business credit.",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc",
    scoreBoost: 10,
    requiredWhen: "entityType",
    invertRequired: false,
  },
  {
    id: "m1-ein",
    month: 1,
    label: "Get your EIN from IRS.gov — it's free",
    detail:
      "Your business's Social Security Number. Required for every credit application, bank account, and trade line.",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
    scoreBoost: 10,
    requiredWhen: "hasEin",
    invertRequired: true,
  },
  {
    id: "m1-bank",
    month: 1,
    label: "Open a dedicated business checking account",
    detail:
      "Mixing personal and business finances disqualifies you from most lenders automatically. Takes 30 minutes at any major bank.",
    url: "https://www.chase.com/business/banking/checking",
    scoreBoost: 15,
    requiredWhen: "hasBankAccount",
    invertRequired: true,
  },
  {
    id: "m1-duns",
    month: 1,
    label: "Register your DUNS number — free from D&B",
    detail:
      "Dun & Bradstreet is the #1 business credit bureau. Your DUNS number is your business credit identity. Takes 2–5 days.",
    url: "https://www.dnb.com/duns-number.html",
    scoreBoost: 8,
    requiredWhen: "always",
  },
  {
    id: "m1-phone",
    month: 1,
    label: "Get a dedicated business phone number",
    detail:
      "Lenders verify your business phone against 411 directories. Google Voice or RingCentral works — your personal cell does not.",
    url: "https://voice.google.com",
    scoreBoost: 5,
    requiredWhen: "hasBusinessPhone",
    invertRequired: true,
  },
  {
    id: "m1-address",
    month: 1,
    label: "Establish a commercial business address",
    detail:
      "A home address flags your application as high risk. Use a registered agent service ($49/year) or a commercial mailbox.",
    url: "https://www.upcounsel.com/registered-agent",
    scoreBoost: 10,
    requiredWhen: "hasCommercialAddress",
    invertRequired: true,
  },
  // Month 2 — Trade Lines
  {
    id: "m2-uline",
    month: 2,
    label: "Apply for a Uline net-30 account",
    detail:
      "Uline reports to Dun & Bradstreet. Approval is easy. Order $50 of packing supplies. Pay on time. First trade reference established.",
    url: "https://www.uline.com/BL_8900/Uline-Credit-Application",
    scoreBoost: 6,
    requiredWhen: "always",
  },
  {
    id: "m2-quill",
    month: 2,
    label: "Apply for a Quill net-30 account",
    detail:
      "Quill reports to multiple business credit bureaus. Stacking multiple trade lines builds your Paydex score faster.",
    url: "https://www.quill.com/cart/checkout/accountCredit",
    scoreBoost: 6,
    requiredWhen: "always",
  },
  {
    id: "m2-grainger",
    month: 2,
    label: "Apply for a Grainger net-30 account",
    detail:
      "Grainger is critical for trades. Equipment and tool purchases on net-30 report immediately to business credit bureaus.",
    url: "https://www.grainger.com/content/credit-application",
    scoreBoost: 6,
    requiredWhen: "always",
  },
  {
    id: "m2-card1",
    month: 2,
    label: "Open a business credit card (Chase Ink or Capital One Spark)",
    detail:
      "Use it for one recurring monthly expense. Pay in full. Chase Ink and Capital One Spark both report to D&B and Experian Business.",
    url: "https://creditcards.chase.com/business-credit-cards",
    scoreBoost: 10,
    requiredWhen: "businessCreditCards",
    invertRequired: false,
  },
  {
    id: "m2-use",
    month: 2,
    label: "Make one purchase on each trade line and pay on time",
    detail:
      "A dormant account doesn't build credit. Make a small purchase on each net-30 account and pay within 30 days. That's one trade reference per account.",
    scoreBoost: 5,
    requiredWhen: "always",
  },
  // Month 3 — Building History
  {
    id: "m3-card2",
    month: 3,
    label: "Apply for a second business credit card from a different issuer",
    detail:
      "Diversifying issuers builds a more credible credit profile. American Express Blue Business Plus is ideal as a second card.",
    url: "https://www.americanexpress.com/us/credit-cards/business/",
    scoreBoost: 5,
    requiredWhen: "always",
  },
  {
    id: "m3-google-ads",
    month: 3,
    label: "Apply for a Google Ads credit line",
    detail:
      "Google offers a revolving business credit line to Google Ads accounts. Easy approval. Reports to business bureaus. Doubles as marketing budget.",
    url: "https://support.google.com/google-ads/answer/2375431",
    scoreBoost: 4,
    requiredWhen: "always",
  },
  {
    id: "m3-increase",
    month: 3,
    label: "Request a credit limit increase on existing cards",
    detail:
      "After 6 months of on-time payments, call your card issuer and request a limit increase. Higher limits = better utilization ratio = higher score.",
    scoreBoost: 4,
    requiredWhen: "always",
  },
  {
    id: "m3-sba",
    month: 3,
    label: "Apply for an SBA microloan or CDFI loan",
    detail:
      "Your first bank loan. SBA microloans go up to $50,000 and have flexible requirements for newer businesses. CDFIs are even more accessible.",
    url: "https://www.sba.gov/funding-programs/loans/microloans",
    scoreBoost: 5,
    requiredWhen: "always",
  },
  {
    id: "m3-paydex",
    month: 3,
    label: "Check your D&B Paydex score — target 80+",
    detail:
      "Paydex measures your payment history with trade lines. 80+ means you pay on time. 100 means you pay early. Lenders require 75+ for most credit.",
    url: "https://www.dnb.com/business-credit/business-credit-scores-paydex.html",
    scoreBoost: 3,
    requiredWhen: "always",
  },
  {
    id: "m3-gbp",
    month: 3,
    label: "Verify your Google Business Profile",
    detail:
      "Lenders search for your business online. A verified GBP signals legitimacy. It also drives reviews and local SEO — double win.",
    url: "https://business.google.com",
    scoreBoost: 10,
    requiredWhen: "hasGbpVerified",
    invertRequired: true,
  },
];
