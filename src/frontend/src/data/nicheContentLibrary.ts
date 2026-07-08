// ── Niche Content Library ────────────────────────────────────────────────────
// Pre-built, niche-specific content items for the drag-in content library.
// 4 tabs: Images, Headlines, Testimonials, Trust Badges
// 5–8 items per category per niche.

export type NicheKey =
  | "plumbing"
  | "hvac"
  | "med_spa"
  | "restoration"
  | "carpet_cleaning"
  | "roofing"
  | "real_estate"
  | "mortgage";

export type ContentTab =
  | "images"
  | "headlines"
  | "testimonials"
  | "trust_badges";

// ── Image item ────────────────────────────────────────────────────────────────
export interface NicheImage {
  id: string;
  label: string;
  description: string;
  /** Unsplash-style keyword for display */
  keywords: string;
  /** Target section type this image best suits */
  targetSection: string;
  /** Alt text suggestion */
  alt: string;
  /** Placeholder gradient for preview */
  gradient: string;
}

// ── Headline item ─────────────────────────────────────────────────────────────
export interface NicheHeadline {
  id: string;
  headline: string;
  subheadline?: string;
  targetSection: string;
  framework: string;
  frameworkLabel: string;
  conversionScore: number;
}

// ── Testimonial item ──────────────────────────────────────────────────────────
export interface NicheTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  city: string;
  stars: number;
  highlight?: string;
}

// ── Trust Badge item ──────────────────────────────────────────────────────────
export interface NicheTrustBadge {
  id: string;
  label: string;
  icon: string;
  category: "license" | "certification" | "guarantee" | "insurance" | "award";
  description: string;
}

// ── Library structure ─────────────────────────────────────────────────────────
export interface NicheContentLibraryData {
  images: NicheImage[];
  headlines: NicheHeadline[];
  testimonials: NicheTestimonial[];
  trustBadges: NicheTrustBadge[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLUMBING
// ═══════════════════════════════════════════════════════════════════════════════

const plumbingImages: NicheImage[] = [
  {
    id: "plumb-img-1",
    label: "Emergency Response Arrival",
    description: "Uniformed plumber arriving at front door with branded van",
    keywords: "plumber uniform truck arrival",
    targetSection: "hero",
    alt: "Licensed plumber arriving for emergency service",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)",
  },
  {
    id: "plumb-img-2",
    label: "Pipe Repair Close-Up",
    description:
      "Hands fixing burst pipe with professional tools — before/after implied",
    keywords: "pipe repair tools plumbing",
    targetSection: "services",
    alt: "Professional pipe repair in progress",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  {
    id: "plumb-img-3",
    label: "Water Heater Installation",
    description: "Modern tankless water heater being installed in utility room",
    keywords: "water heater installation modern",
    targetSection: "services",
    alt: "Tankless water heater installation",
    gradient: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
  },
  {
    id: "plumb-img-4",
    label: "Happy Customer — Front Door",
    description: "Homeowner smiling at front door after successful repair",
    keywords: "happy customer homeowner satisfied",
    targetSection: "testimonials",
    alt: "Satisfied homeowner after plumbing service",
    gradient: "linear-gradient(135deg, #0369a1 0%, #0891b2 100%)",
  },
  {
    id: "plumb-img-5",
    label: "Drain Cleaning Action",
    description: "High-pressure hydro-jetting in action on main sewer line",
    keywords: "drain cleaning hydro jetting",
    targetSection: "before_after",
    alt: "Hydro-jetting drain cleaning service",
    gradient: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
  },
  {
    id: "plumb-img-6",
    label: "Team Photo",
    description:
      "Full plumbing crew in matching uniforms — professional team portrait",
    keywords: "plumbing team crew professional",
    targetSection: "about",
    alt: "Professional plumbing team",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)",
  },
  {
    id: "plumb-img-7",
    label: "Before/After Pipe Burst",
    description: "Split image: damaged burst pipe vs. clean new copper repair",
    keywords: "before after pipe repair",
    targetSection: "before_after",
    alt: "Before and after burst pipe repair",
    gradient: "linear-gradient(135deg, #dc2626 0%, #1e40af 100%)",
  },
];

const plumbingHeadlines: NicheHeadline[] = [
  {
    id: "plumb-hl-1",
    headline:
      "[City]'s Most Trusted Plumber — Licensed, Honest, Available 24/7",
    subheadline: "Upfront pricing. Guaranteed work. We pick up every call.",
    targetSection: "hero",
    framework: "Abraham",
    frameworkLabel: "Strategy of Preeminence",
    conversionScore: 91,
  },
  {
    id: "plumb-hl-2",
    headline: "Pipe Burst? We're On The Way — 60-Minute Response Guaranteed",
    subheadline:
      "Licensed master plumbers available right now. No answering machines.",
    targetSection: "hero",
    framework: "Kennedy",
    frameworkLabel: "Direct Response — Urgency First",
    conversionScore: 94,
  },
  {
    id: "plumb-hl-3",
    headline: "Finally — A Plumber in [City] You Can Actually Trust",
    subheadline:
      "No upsells. No surprise fees. Just honest work and a written guarantee.",
    targetSection: "hero",
    framework: "Halbert",
    frameworkLabel: "Problem-Agitate-Solve",
    conversionScore: 88,
  },
  {
    id: "plumb-hl-4",
    headline:
      "Complete Plumbing Services — From Emergency Repairs to Full Remodels",
    subheadline: "One call handles everything. Licensed techs for every job.",
    targetSection: "services",
    framework: "Ogilvy",
    frameworkLabel: "Research-First Clarity",
    conversionScore: 82,
  },
  {
    id: "plumb-hl-5",
    headline: "Why 3,500+ [City] Families Choose [Business Name]",
    subheadline:
      "Real reviews. Real results. A plumbing company that earns repeat business.",
    targetSection: "testimonials",
    framework: "Hopkins",
    frameworkLabel: "Specificity & Proof",
    conversionScore: 86,
  },
  {
    id: "plumb-hl-6",
    headline: "Don't Wait — Plumbing Problems Only Get Worse",
    subheadline:
      "Small leaks become big damage. Call today and get ahead of it.",
    targetSection: "cta_banner",
    framework: "Suby",
    frameworkLabel: "PASTOR — Amplify the Problem",
    conversionScore: 89,
  },
];

const plumbingTestimonials: NicheTestimonial[] = [
  {
    id: "plumb-t-1",
    quote:
      "Pipe burst at 2am — they were here in 45 minutes. Saved my hardwood floors from serious damage. These guys are the real deal.",
    name: "Mike T.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "45-minute 2am response",
  },
  {
    id: "plumb-t-2",
    quote:
      "Called three plumbers on a Sunday. [Business Name] was the only one who actually picked up and showed up. Fixed in 2 hours, fair price.",
    name: "Sarah K.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Only plumber who showed up on Sunday",
  },
  {
    id: "plumb-t-3",
    quote:
      "They told me I didn't even need the full repair I thought I needed — saved me $400. You don't find that kind of honesty anymore.",
    name: "Carlos M.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Saved $400 with honest advice",
  },
  {
    id: "plumb-t-4",
    quote:
      "I've used [Business Name] for 8 years. Every single visit — on time, professional, fair price. They're my plumbers for life.",
    name: "Linda H.",
    role: "Repeat Customer",
    city: "[City]",
    stars: 5,
    highlight: "8-year loyal customer",
  },
  {
    id: "plumb-t-5",
    quote:
      "Three generations of my family use [Business Name]. My parents, me, and now my kids. That tells you everything.",
    name: "David K.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Three generations of trust",
  },
  {
    id: "plumb-t-6",
    quote:
      "My water heater failed the week before Thanksgiving. They replaced it same day. The crew was respectful, efficient, and genuinely kind.",
    name: "Tom L.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Same-day water heater replacement",
  },
];

const plumbingTrustBadges: NicheTrustBadge[] = [
  {
    id: "plumb-tb-1",
    label: "Licensed Master Plumber",
    icon: "🏅",
    category: "license",
    description: "Certified master plumber license — state-verified",
  },
  {
    id: "plumb-tb-2",
    label: "Google Guaranteed",
    icon: "🔐",
    category: "certification",
    description: "Background-checked and verified by Google",
  },
  {
    id: "plumb-tb-3",
    label: "100% Satisfaction Guarantee",
    icon: "💯",
    category: "guarantee",
    description: "We make it right or you don't pay",
  },
  {
    id: "plumb-tb-4",
    label: "Fully Bonded & Insured",
    icon: "🛡️",
    category: "insurance",
    description: "$2M liability coverage on every job",
  },
  {
    id: "plumb-tb-5",
    label: "BBB Accredited — A+",
    icon: "⭐",
    category: "award",
    description: "Better Business Bureau A+ rated",
  },
  {
    id: "plumb-tb-6",
    label: "60-Min Response Guarantee",
    icon: "⚡",
    category: "guarantee",
    description: "Emergency calls answered and dispatched in 60 minutes",
  },
  {
    id: "plumb-tb-7",
    label: "1-Year Labor Warranty",
    icon: "🔧",
    category: "guarantee",
    description: "All workmanship backed by 12-month written warranty",
  },
  {
    id: "plumb-tb-8",
    label: "Background-Checked Techs",
    icon: "✅",
    category: "certification",
    description: "Every technician is background-checked and drug-tested",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HVAC
// ═══════════════════════════════════════════════════════════════════════════════

const hvacImages: NicheImage[] = [
  {
    id: "hvac-img-1",
    label: "Technician on AC Unit",
    description:
      "NATE-certified tech servicing rooftop AC unit in summer — branded uniform",
    keywords: "hvac technician air conditioner summer",
    targetSection: "hero",
    alt: "HVAC technician servicing air conditioning unit",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
  },
  {
    id: "hvac-img-2",
    label: "Family Comfort at Home",
    description:
      "Family relaxing comfortably in cool home — lifestyle, summer heat outside",
    keywords: "family home comfort air conditioning",
    targetSection: "hero",
    alt: "Family enjoying comfortable home climate",
    gradient: "linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)",
  },
  {
    id: "hvac-img-3",
    label: "Smart Thermostat Install",
    description:
      "Modern smart thermostat being installed — technology and efficiency focus",
    keywords: "smart thermostat modern technology",
    targetSection: "services",
    alt: "Smart thermostat installation",
    gradient: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
  },
  {
    id: "hvac-img-4",
    label: "Before/After Ductwork",
    description:
      "Dramatic split: dirty clogged ductwork vs. clean professionally serviced ducts",
    keywords: "ductwork cleaning before after",
    targetSection: "before_after",
    alt: "Before and after ductwork cleaning",
    gradient: "linear-gradient(135deg, #78350f 0%, #0ea5e9 100%)",
  },
  {
    id: "hvac-img-5",
    label: "NATE Certification Display",
    description:
      "NATE certification badge prominently displayed with technician portrait",
    keywords: "NATE certified HVAC credentials",
    targetSection: "certifications",
    alt: "NATE certified HVAC technician credentials",
    gradient: "linear-gradient(135deg, #1d4ed8 0%, #06b6d4 100%)",
  },
  {
    id: "hvac-img-6",
    label: "Precision Diagnostic",
    description:
      "Technician using digital diagnostic tool on HVAC system — precision, authority",
    keywords: "hvac diagnostic precision tool",
    targetSection: "services",
    alt: "HVAC technician performing precision diagnostic",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
  },
];

const hvacHeadlines: NicheHeadline[] = [
  {
    id: "hvac-hl-1",
    headline: "Keep Your [City] Home Perfectly Comfortable — Summer & Winter",
    subheadline:
      "Expert HVAC service by NATE-certified technicians. Book your tune-up today.",
    targetSection: "hero",
    framework: "Deiss",
    frameworkLabel: "Before/After/Bridge — Comfort Outcome",
    conversionScore: 87,
  },
  {
    id: "hvac-hl-2",
    headline: "AC Down in [City] Heat? We're There in Under 4 Hours",
    subheadline:
      "Same-day AC repair. All major brands. Upfront pricing, no surprise fees.",
    targetSection: "hero",
    framework: "Kennedy",
    frameworkLabel: "Direct Response — Urgency + Specificity",
    conversionScore: 93,
  },
  {
    id: "hvac-hl-3",
    headline:
      "NATE-Certified HVAC — The Standard That Protects Your Investment",
    subheadline:
      "Factory-trained technicians. Manufacturer-backed warranties. Precision every time.",
    targetSection: "hero",
    framework: "Hopkins",
    frameworkLabel: "Specificity — Credentials as Proof",
    conversionScore: 85,
  },
  {
    id: "hvac-hl-4",
    headline: "Cut Your Energy Bills 20–30% With a Professional Tune-Up",
    subheadline:
      "A $99 maintenance visit pays for itself in the first 2 months. Limited slots available.",
    targetSection: "cta_banner",
    framework: "Hormozi",
    frameworkLabel: "Value Stack — ROI-Led Offer",
    conversionScore: 91,
  },
  {
    id: "hvac-hl-5",
    headline: "Every HVAC System We Service Comes With a Written Warranty",
    subheadline:
      "We stand behind our work — 12 months, in writing, no exceptions.",
    targetSection: "trust",
    framework: "Abraham",
    frameworkLabel: "Preeminence — Risk Reversal",
    conversionScore: 83,
  },
];

const hvacTestimonials: NicheTestimonial[] = [
  {
    id: "hvac-t-1",
    quote:
      "AC went out in 98-degree heat. [Business Name] had it fixed in under 3 hours. Absolutely incredible service.",
    name: "Rebecca L.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Fixed in 3 hours during heatwave",
  },
  {
    id: "hvac-t-2",
    quote:
      "Signed up for their maintenance plan and my energy bill dropped 22% this year. Worth every single penny.",
    name: "David K.",
    role: "Annual Member",
    city: "[City]",
    stars: 5,
    highlight: "22% energy bill reduction",
  },
  {
    id: "hvac-t-3",
    quote:
      "They diagnosed my system correctly in 20 minutes and told me I needed a repair, not a full replacement. Saved me $4,000.",
    name: "Thomas B.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Saved $4,000 with honest diagnosis",
  },
  {
    id: "hvac-t-4",
    quote:
      "NATE-certified technicians make a visible difference. Our new system runs quieter, cleaner, and more efficiently.",
    name: "Karen W.",
    role: "Business Owner",
    city: "[City]",
    stars: 5,
    highlight: "NATE certification impact",
  },
  {
    id: "hvac-t-5",
    quote:
      "Five years, same technician every visit. That kind of consistency and reliability is rare to find.",
    name: "Maria S.",
    role: "Maintenance Member",
    city: "[City]",
    stars: 5,
    highlight: "5-year loyal relationship",
  },
];

const hvacTrustBadges: NicheTrustBadge[] = [
  {
    id: "hvac-tb-1",
    label: "NATE Certified",
    icon: "🏅",
    category: "certification",
    description: "North American Technician Excellence — highest HVAC standard",
  },
  {
    id: "hvac-tb-2",
    label: "EPA 608 Certified",
    icon: "♻️",
    category: "certification",
    description:
      "EPA-certified refrigerant handling and environmental compliance",
  },
  {
    id: "hvac-tb-3",
    label: "Carrier Factory Authorized",
    icon: "❄️",
    category: "certification",
    description: "Authorized Carrier dealer with factory training",
  },
  {
    id: "hvac-tb-4",
    label: "State Licensed & Bonded",
    icon: "🔐",
    category: "license",
    description: "Fully licensed and bonded in your state",
  },
  {
    id: "hvac-tb-5",
    label: "Satisfaction Guaranteed",
    icon: "💯",
    category: "guarantee",
    description: "100% satisfaction or we make it right",
  },
  {
    id: "hvac-tb-6",
    label: "10-Year Parts Warranty",
    icon: "🛡️",
    category: "guarantee",
    description: "Extended parts warranty on qualifying installations",
  },
  {
    id: "hvac-tb-7",
    label: "Energy Star Partner",
    icon: "⭐",
    category: "award",
    description: "EPA Energy Star certified contractor",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MED SPA
// ═══════════════════════════════════════════════════════════════════════════════

const medSpaImages: NicheImage[] = [
  {
    id: "medspa-img-1",
    label: "Confident Post-Treatment Client",
    description:
      "Glowing, confident woman post-treatment — natural look, not clinical",
    keywords: "confident woman glow beauty treatment",
    targetSection: "hero",
    alt: "Client glowing after med spa treatment",
    gradient: "linear-gradient(135deg, #1e1b2e 0%, #9b59b6 100%)",
  },
  {
    id: "medspa-img-2",
    label: "Precision Injection — Clinical Authority",
    description:
      "Certified injector administering precision treatment — focus on expertise",
    keywords: "injection botox medical precision",
    targetSection: "services",
    alt: "Medical professional administering aesthetic treatment",
    gradient: "linear-gradient(135deg, #0d0b1a 0%, #c9a96e 100%)",
  },
  {
    id: "medspa-img-3",
    label: "Luxury Treatment Room",
    description:
      "Luxury spa room with clean lines, mood lighting, premium feel",
    keywords: "luxury spa room aesthetic premium",
    targetSection: "hero",
    alt: "Premium med spa treatment room",
    gradient: "linear-gradient(135deg, #1e1b2e 0%, #2d1b69 100%)",
  },
  {
    id: "medspa-img-4",
    label: "Before/After Laser Treatment",
    description:
      "Side-by-side results of skin resurfacing — authentic, with permission",
    keywords: "before after laser skin treatment results",
    targetSection: "before_after",
    alt: "Laser skin resurfacing before and after results",
    gradient: "linear-gradient(135deg, #2d1b69 0%, #c9a96e 100%)",
  },
  {
    id: "medspa-img-5",
    label: "Medical Director Portrait",
    description:
      "Medical director in white coat — authority, trust, medical oversight",
    keywords: "doctor medical director spa authority",
    targetSection: "about",
    alt: "Med spa medical director",
    gradient: "linear-gradient(135deg, #0d0b1a 0%, #7c3aed 100%)",
  },
  {
    id: "medspa-img-6",
    label: "Consultation Scene",
    description:
      "One-on-one consultation: provider and client in warm, private setting",
    keywords: "consultation private one on one care",
    targetSection: "process",
    alt: "Med spa consultation in progress",
    gradient: "linear-gradient(135deg, #1e1b2e 0%, #be185d 100%)",
  },
  {
    id: "medspa-img-7",
    label: "Treatment Menu Display",
    description: "Elegant treatment menu displayed on tablet in luxury setting",
    keywords: "treatment menu services luxury",
    targetSection: "services",
    alt: "Med spa treatment menu",
    gradient: "linear-gradient(135deg, #0d0b1a 0%, #9b59b6 100%)",
  },
];

const medSpaHeadlines: NicheHeadline[] = [
  {
    id: "medspa-hl-1",
    headline: "Your Most Confident Self Starts Here",
    subheadline:
      "Medical-grade treatments in a luxury setting. Complimentary consultations available.",
    targetSection: "hero",
    framework: "Hormozi",
    frameworkLabel: "Value Stack — Transformation First",
    conversionScore: 92,
  },
  {
    id: "medspa-hl-2",
    headline: "Award-Winning Med Spa — Physician-Supervised Results in [City]",
    subheadline:
      "500+ transformations. Medical director on staff. Book your consultation today.",
    targetSection: "hero",
    framework: "Hopkins",
    frameworkLabel: "Specificity — Credentials + Social Proof",
    conversionScore: 89,
  },
  {
    id: "medspa-hl-3",
    headline: "The Results You've Been Looking For — Finally Within Reach",
    subheadline:
      "Personalized treatment plans designed by our medical team. No two clients are the same.",
    targetSection: "hero",
    framework: "Deiss",
    frameworkLabel: "Before/After/Bridge — Desire to Reality",
    conversionScore: 88,
  },
  {
    id: "medspa-hl-4",
    headline: "Real Results. Real Clients. No Filters.",
    subheadline:
      "Every before/after is a genuine transformation from our [City] clients.",
    targetSection: "before_after",
    framework: "Hopkins",
    frameworkLabel: "Specificity — Authentic Proof",
    conversionScore: 87,
  },
  {
    id: "medspa-hl-5",
    headline: "Pre-Summer Consultations Are Filling Fast",
    subheadline:
      "Book 6–8 weeks before your target date. Limited appointments available.",
    targetSection: "cta_banner",
    framework: "Kennedy",
    frameworkLabel: "Direct Response — Scarcity + Urgency",
    conversionScore: 91,
  },
  {
    id: "medspa-hl-6",
    headline:
      "Science-Backed Treatments. Luxury Experience. Lasting Confidence.",
    subheadline:
      "Every treatment is medically supervised and personalized to your goals.",
    targetSection: "trust",
    framework: "Schwartz",
    frameworkLabel: "Awareness Spectrum — Credibility for Cold Traffic",
    conversionScore: 84,
  },
];

const medSpaTestimonials: NicheTestimonial[] = [
  {
    id: "medspa-t-1",
    quote:
      "I've been to three different med spas in [City]. [Business Name] is on a different level — the consultation alone was worth it. They actually listened.",
    name: "Jennifer R.",
    role: "Client",
    city: "[City]",
    stars: 5,
    highlight: "Best consultation experience in [City]",
  },
  {
    id: "medspa-t-2",
    quote:
      "My Botox results have lasted 4 months and look completely natural. My friends keep asking what I'm doing differently — not a single person guessed.",
    name: "Amanda S.",
    role: "Regular Client",
    city: "[City]",
    stars: 5,
    highlight: "Natural-looking results that last",
  },
  {
    id: "medspa-t-3",
    quote:
      "The medical director reviewed my treatment plan personally. That level of care and oversight is why I won't go anywhere else.",
    name: "Dr. Patricia M.",
    role: "Patient",
    city: "[City]",
    stars: 5,
    highlight: "Medical director personal oversight",
  },
  {
    id: "medspa-t-4",
    quote:
      "I was nervous for my first filler appointment. The team made me feel completely at ease and walked me through every step. The results exceeded my expectations.",
    name: "Michelle K.",
    role: "First-Time Client",
    city: "[City]",
    stars: 5,
    highlight: "Perfect first-time experience",
  },
  {
    id: "medspa-t-5",
    quote:
      "Six treatments in, and my skin looks better than it did in my 30s. I'm 47. The laser resurfacing program is genuinely transformative.",
    name: "Diane W.",
    role: "Loyalty Member",
    city: "[City]",
    stars: 5,
    highlight: "Skin looks better than at 30",
  },
  {
    id: "medspa-t-6",
    quote:
      "Luxury experience without the pretentious attitude. They make you feel welcome and valued every single visit.",
    name: "Lisa T.",
    role: "Monthly Member",
    city: "[City]",
    stars: 5,
    highlight: "Luxury without pretension",
  },
];

const medSpaTrustBadges: NicheTrustBadge[] = [
  {
    id: "medspa-tb-1",
    label: "Medical Director on Staff",
    icon: "🏥",
    category: "certification",
    description: "All treatments overseen by licensed medical director",
  },
  {
    id: "medspa-tb-2",
    label: "Board-Certified Injectors",
    icon: "💉",
    category: "certification",
    description: "All injectors board-certified and credentialed",
  },
  {
    id: "medspa-tb-3",
    label: "Complimentary Consultations",
    icon: "🎁",
    category: "guarantee",
    description: "No-obligation consultations before every treatment",
  },
  {
    id: "medspa-tb-4",
    label: "Fully Licensed Med Spa",
    icon: "🔐",
    category: "license",
    description: "State-licensed medical spa with current permits",
  },
  {
    id: "medspa-tb-5",
    label: "HIPAA Compliant",
    icon: "🛡️",
    category: "certification",
    description: "Full client privacy and HIPAA compliance",
  },
  {
    id: "medspa-tb-6",
    label: "Award-Winning Practice",
    icon: "🏆",
    category: "award",
    description: "Recognized by local and national industry organizations",
  },
  {
    id: "medspa-tb-7",
    label: "Results Guarantee",
    icon: "💯",
    category: "guarantee",
    description: "We stand behind every treatment outcome",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// RESTORATION
// ═══════════════════════════════════════════════════════════════════════════════

const restorationImages: NicheImage[] = [
  {
    id: "resto-img-1",
    label: "Crew Ready at Property",
    description:
      "Restoration crew in branded work gear arriving at damaged property — urgency + professionalism",
    keywords: "restoration crew property damage emergency",
    targetSection: "hero",
    alt: "Restoration crew arriving at property",
    gradient: "linear-gradient(135deg, #ea580c 0%, #1e293b 100%)",
  },
  {
    id: "resto-img-2",
    label: "Before/After Water Damage",
    description:
      "Flooded basement → completely dry, restored, clean — most powerful visual",
    keywords: "water damage before after restoration",
    targetSection: "before_after",
    alt: "Water damage restoration before and after",
    gradient: "linear-gradient(135deg, #0f1b2e 0%, #0369a1 100%)",
  },
  {
    id: "resto-img-3",
    label: "Industrial Drying Equipment",
    description:
      "High-powered air movers and dehumidifiers set up in affected area",
    keywords: "restoration equipment drying dehumidifiers",
    targetSection: "services",
    alt: "Professional restoration drying equipment",
    gradient: "linear-gradient(135deg, #1e293b 0%, #ea580c 100%)",
  },
  {
    id: "resto-img-4",
    label: "Mold Remediation",
    description:
      "Certified technician in protective gear performing mold remediation",
    keywords: "mold remediation protective gear certified",
    targetSection: "services",
    alt: "Certified mold remediation in progress",
    gradient: "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)",
  },
  {
    id: "resto-img-5",
    label: "Insurance Documentation",
    description:
      "Technician with tablet documenting damage for insurance claim",
    keywords: "insurance documentation restoration claim",
    targetSection: "process",
    alt: "Restoration insurance documentation",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)",
  },
  {
    id: "resto-img-6",
    label: "Fully Restored Room",
    description:
      "Beautifully restored room — looks new again, impossible to tell there was damage",
    keywords: "restored room renovation complete results",
    targetSection: "before_after",
    alt: "Fully restored property after damage",
    gradient: "linear-gradient(135deg, #0369a1 0%, #0d9488 100%)",
  },
];

const restorationHeadlines: NicheHeadline[] = [
  {
    id: "resto-hl-1",
    headline: "Water, Fire, or Storm Damage? We Respond in 60 Minutes — 24/7",
    subheadline:
      "IICRC-certified crews. Insurance claim expertise. Property restored to pre-loss condition.",
    targetSection: "hero",
    framework: "Kennedy",
    frameworkLabel: "Direct Response — Emergency Urgency",
    conversionScore: 95,
  },
  {
    id: "resto-hl-2",
    headline: "Don't Let Water Damage Sit — Every Hour Makes It Worse",
    subheadline:
      "Secondary damage multiplies your costs and claim complexity. Call now for immediate assessment.",
    targetSection: "hero",
    framework: "Halbert",
    frameworkLabel: "PAS — Problem-Agitate-Solve",
    conversionScore: 92,
  },
  {
    id: "resto-hl-3",
    headline: "IICRC-Certified Restoration — Your Insurance Claim Made Simple",
    subheadline:
      "We work directly with all major insurance companies. You focus on your family.",
    targetSection: "hero",
    framework: "Abraham",
    frameworkLabel: "Preeminence — Trusted Advisor",
    conversionScore: 89,
  },
  {
    id: "resto-hl-4",
    headline: "See the Before and After — Real Jobs, Real Results",
    subheadline:
      "Every restoration is documented with professional photography.",
    targetSection: "before_after",
    framework: "Hopkins",
    frameworkLabel: "Specificity — Authentic Visual Proof",
    conversionScore: 88,
  },
];

const restorationTestimonials: NicheTestimonial[] = [
  {
    id: "resto-t-1",
    quote:
      "Basement flooded on a Saturday night. [Business Name] had a crew here by 11pm. Saved thousands in secondary damage. I can't recommend them enough.",
    name: "Frank D.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "11pm Saturday emergency response",
  },
  {
    id: "resto-t-2",
    quote:
      "They handled everything — insurance, paperwork, the works. I was in shock after the fire. [Business Name] took the weight off completely.",
    name: "Susan M.",
    role: "Fire Damage Client",
    city: "[City]",
    stars: 5,
    highlight: "Full insurance handling",
  },
  {
    id: "resto-t-3",
    quote:
      "Our adjuster was impressed with their documentation. The claim was processed fast because of how thorough [Business Name] was.",
    name: "Robert T.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Insurance adjuster praised their documentation",
  },
  {
    id: "resto-t-4",
    quote:
      "You can't tell there was ever damage. They restored our home better than it looked before the storm. Truly exceptional work.",
    name: "Carol & Jim B.",
    role: "Storm Damage Clients",
    city: "[City]",
    stars: 5,
    highlight: "Looks better than before",
  },
  {
    id: "resto-t-5",
    quote:
      "IICRC certification matters — our home was dried correctly the first time. No mold, no callbacks, no problems.",
    name: "Kevin L.",
    role: "Water Damage Client",
    city: "[City]",
    stars: 5,
    highlight: "IICRC standard — no mold issues",
  },
];

const restorationTrustBadges: NicheTrustBadge[] = [
  {
    id: "resto-tb-1",
    label: "IICRC Certified",
    icon: "🏅",
    category: "certification",
    description:
      "Institute of Inspection Cleaning and Restoration Certification",
  },
  {
    id: "resto-tb-2",
    label: "24/7 Emergency Response",
    icon: "⚡",
    category: "guarantee",
    description: "60-minute emergency dispatch guaranteed",
  },
  {
    id: "resto-tb-3",
    label: "Works With All Insurers",
    icon: "📋",
    category: "certification",
    description:
      "Direct billing and coordination with all major insurance companies",
  },
  {
    id: "resto-tb-4",
    label: "Licensed Contractor",
    icon: "🔐",
    category: "license",
    description: "State-licensed general contractor for restoration work",
  },
  {
    id: "resto-tb-5",
    label: "Fully Insured — $5M",
    icon: "🛡️",
    category: "insurance",
    description: "$5M liability coverage on all restoration projects",
  },
  {
    id: "resto-tb-6",
    label: "Mold Remediation Certified",
    icon: "🌿",
    category: "certification",
    description: "Certified mold assessment and remediation professionals",
  },
  {
    id: "resto-tb-7",
    label: "Satisfaction Guaranteed",
    icon: "💯",
    category: "guarantee",
    description: "100% satisfaction — we restore to pre-loss condition",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CARPET CLEANING
// ═══════════════════════════════════════════════════════════════════════════════

const carpetImages: NicheImage[] = [
  {
    id: "carpet-img-1",
    label: "Half-Cleaned Carpet Split",
    description:
      "Dramatic before/after from single pass — dirty left half vs. pristine right half",
    keywords: "carpet cleaning before after dramatic",
    targetSection: "hero",
    alt: "Dramatic carpet cleaning before and after",
    gradient: "linear-gradient(135deg, #78350f 0%, #059669 100%)",
  },
  {
    id: "carpet-img-2",
    label: "Family on Clean Carpet",
    description:
      "Happy family (with kids and pet) on freshly cleaned carpet — lifestyle, safe home",
    keywords: "family clean carpet pet safe kids",
    targetSection: "hero",
    alt: "Happy family enjoying clean carpet",
    gradient: "linear-gradient(135deg, #d1fae5 0%, #059669 100%)",
  },
  {
    id: "carpet-img-3",
    label: "Steam Cleaning Action",
    description:
      "Close-up of hot water extraction wand on carpet — process made visible",
    keywords: "steam cleaning hot water extraction",
    targetSection: "services",
    alt: "Professional steam carpet cleaning",
    gradient: "linear-gradient(135deg, #0f172a 0%, #059669 100%)",
  },
  {
    id: "carpet-img-4",
    label: "Stain Removal Sequence",
    description: "3-step stain: before → treatment → completely gone",
    keywords: "stain removal before after carpet",
    targetSection: "before_after",
    alt: "Pet stain removal before and after",
    gradient: "linear-gradient(135deg, #92400e 0%, #d97706 100%)",
  },
  {
    id: "carpet-img-5",
    label: "Commercial Floor Cleaning",
    description:
      "Large commercial space carpet being cleaned — scale and professionalism",
    keywords: "commercial carpet cleaning office",
    targetSection: "services",
    alt: "Commercial carpet cleaning service",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)",
  },
  {
    id: "carpet-img-6",
    label: "Truck Mount Equipment",
    description:
      "Truck-mounted carpet cleaning system — professional grade equipment",
    keywords: "truck mount professional carpet equipment",
    targetSection: "trust",
    alt: "Professional truck-mounted carpet cleaning equipment",
    gradient: "linear-gradient(135deg, #1e293b 0%, #059669 100%)",
  },
];

const carpetHeadlines: NicheHeadline[] = [
  {
    id: "carpet-hl-1",
    headline: "Carpets So Clean, Your Family Can Actually Feel the Difference",
    subheadline:
      "Hot water extraction removes 98% of allergens, bacteria, and pet dander. Kid and pet safe.",
    targetSection: "hero",
    framework: "Hormozi",
    frameworkLabel: "Value Stack — Health Outcome",
    conversionScore: 88,
  },
  {
    id: "carpet-hl-2",
    headline: "Most [City] Families Notice a Difference in 2 Rooms or Less",
    subheadline:
      "Truck-mounted steam cleaning. Dry in under 4 hours. No residue, no resoiling.",
    targetSection: "hero",
    framework: "Hopkins",
    frameworkLabel: "Specificity — Measurable Results",
    conversionScore: 86,
  },
  {
    id: "carpet-hl-3",
    headline: "See the Difference Before You Commit — We Spot-Clean for Free",
    subheadline:
      "No obligation spot treatment on your first appointment. See results before paying.",
    targetSection: "cta_banner",
    framework: "Sugarman",
    frameworkLabel: "Slippery Slope — Risk-Free Entry",
    conversionScore: 90,
  },
  {
    id: "carpet-hl-4",
    headline: "Pet Accidents, Wine Spills, Mystery Stains — We Remove Them All",
    subheadline:
      "Advanced enzyme treatments and hot water extraction handle the toughest stains.",
    targetSection: "services",
    framework: "Halbert",
    frameworkLabel: "PAS — Name the Specific Problem",
    conversionScore: 87,
  },
];

const carpetTestimonials: NicheTestimonial[] = [
  {
    id: "carpet-t-1",
    quote:
      "I thought I needed to replace my carpets. [Business Name] made them look brand new. Saved me $3,000 and couldn't be happier.",
    name: "Patricia R.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Saved $3,000 vs. replacement",
  },
  {
    id: "carpet-t-2",
    quote:
      "Dog had an accident in the master bedroom two years ago. I'd tried everything. One visit from [Business Name] and the smell is completely gone.",
    name: "Jason H.",
    role: "Pet Owner",
    city: "[City]",
    stars: 5,
    highlight: "2-year pet odor eliminated",
  },
  {
    id: "carpet-t-3",
    quote:
      "They were in and out in 2 hours, everything dry by evening. My apartment smelled amazing. Best $150 I've spent in years.",
    name: "Megan T.",
    role: "Renter",
    city: "[City]",
    stars: 5,
    highlight: "In and out in 2 hours",
  },
  {
    id: "carpet-t-4",
    quote:
      "We use [Business Name] quarterly for our office. Professional, reliable, and our clients always comment on how clean everything looks.",
    name: "Sandra L.",
    role: "Office Manager",
    city: "[City]",
    stars: 5,
    highlight: "Quarterly commercial client",
  },
  {
    id: "carpet-t-5",
    quote:
      "My daughter has asthma. Since we started getting our carpets cleaned twice a year, her symptoms have significantly improved. Can't recommend enough.",
    name: "Veronica K.",
    role: "Parent",
    city: "[City]",
    stars: 5,
    highlight: "Reduced asthma symptoms",
  },
];

const carpetTrustBadges: NicheTrustBadge[] = [
  {
    id: "carpet-tb-1",
    label: "IICRC Certified Cleaner",
    icon: "🏅",
    category: "certification",
    description: "Institute of Inspection Cleaning and Restoration Certified",
  },
  {
    id: "carpet-tb-2",
    label: "Truck-Mount Equipment",
    icon: "🚛",
    category: "certification",
    description: "Professional-grade truck-mounted hot water extraction",
  },
  {
    id: "carpet-tb-3",
    label: "Pet & Kid Safe Solutions",
    icon: "🐾",
    category: "guarantee",
    description: "Non-toxic, eco-friendly cleaning products",
  },
  {
    id: "carpet-tb-4",
    label: "Stain-Free Guarantee",
    icon: "💯",
    category: "guarantee",
    description: "We remove the stain or we come back free",
  },
  {
    id: "carpet-tb-5",
    label: "Fully Insured",
    icon: "🛡️",
    category: "insurance",
    description: "Fully insured for residential and commercial work",
  },
  {
    id: "carpet-tb-6",
    label: "Same-Day Drying",
    icon: "⚡",
    category: "guarantee",
    description: "Most carpets dry in under 4 hours",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ROOFING
// ═══════════════════════════════════════════════════════════════════════════════

const roofingImages: NicheImage[] = [
  {
    id: "roof-img-1",
    label: "Premium Roof Install — Curb Appeal",
    description:
      "Finished premium shingle roof — beautiful home, curb appeal story",
    keywords: "roofing finished premium installation curb appeal",
    targetSection: "hero",
    alt: "Premium roofing installation completed",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #64748b 100%)",
  },
  {
    id: "roof-img-2",
    label: "Storm Damage Close-Up",
    description:
      "Hail-damaged roof close-up next to finished repair — urgency + solution",
    keywords: "storm damage hail roof repair",
    targetSection: "before_after",
    alt: "Storm damage roof repair before and after",
    gradient: "linear-gradient(135deg, #1e293b 0%, #f59e0b 100%)",
  },
  {
    id: "roof-img-3",
    label: "Roofing Crew at Work",
    description:
      "Large crew on roof with safety equipment — scale, professionalism, safety",
    keywords: "roofing crew work safety professional",
    targetSection: "about",
    alt: "Professional roofing crew at work",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
  },
  {
    id: "roof-img-4",
    label: "Aerial Before/After",
    description:
      "Drone shot: damaged roof vs. completed new roof — dramatic transformation",
    keywords: "aerial drone before after roof transformation",
    targetSection: "before_after",
    alt: "Aerial view of roof replacement before and after",
    gradient: "linear-gradient(135deg, #92400e 0%, #1e3a5f 100%)",
  },
  {
    id: "roof-img-5",
    label: "Insurance Estimate",
    description:
      "Roofing contractor and homeowner reviewing insurance claim paperwork",
    keywords: "insurance estimate roofing claim paperwork",
    targetSection: "process",
    alt: "Roofing insurance estimate process",
    gradient: "linear-gradient(135deg, #1d4ed8 0%, #1e3a5f 100%)",
  },
  {
    id: "roof-img-6",
    label: "Shingle Samples Display",
    description:
      "High-quality shingle samples in multiple colors — investment, choice, premium",
    keywords: "shingle samples colors materials premium",
    targetSection: "services",
    alt: "Premium roofing shingle material samples",
    gradient: "linear-gradient(135deg, #3f3f46 0%, #f59e0b 100%)",
  },
];

const roofingHeadlines: NicheHeadline[] = [
  {
    id: "roof-hl-1",
    headline: "Storm Damage? Don't Wait — Homeowners Act Within 48 Hours",
    subheadline:
      "Free hail and storm damage inspection. We work directly with your insurance company.",
    targetSection: "hero",
    framework: "Kennedy",
    frameworkLabel: "Direct Response — Urgency + Insurance Angle",
    conversionScore: 94,
  },
  {
    id: "roof-hl-2",
    headline:
      "[City]'s Trusted Roofing Company — Licensed, Insured, and Warranty-Backed",
    subheadline:
      "Expert installations. Storm repairs. Insurance claims made simple. Free estimates.",
    targetSection: "hero",
    framework: "Abraham",
    frameworkLabel: "Strategy of Preeminence — Authority",
    conversionScore: 88,
  },
  {
    id: "roof-hl-3",
    headline:
      "A New Roof Is Your Home's Biggest Protection and Best Investment",
    subheadline:
      "We use only manufacturer-certified materials backed by 25-year warranties.",
    targetSection: "hero",
    framework: "Schwartz",
    frameworkLabel: "Awareness Spectrum — Investment Frame",
    conversionScore: 85,
  },
  {
    id: "roof-hl-4",
    headline:
      "See Every Roof We've Done in [City] — Real Projects, Real Results",
    subheadline:
      "Photos from actual jobs in your neighborhood. No stock images.",
    targetSection: "before_after",
    framework: "Hopkins",
    frameworkLabel: "Specificity — Local Proof",
    conversionScore: 87,
  },
  {
    id: "roof-hl-5",
    headline: "Hailstorm Hit [City] Last Week — Is Your Roof Damaged?",
    subheadline:
      "We're offering free inspections this week for affected homeowners. Slots filling fast.",
    targetSection: "cta_banner",
    framework: "Suby",
    frameworkLabel: "PASTOR — Problem Amplification",
    conversionScore: 96,
  },
];

const roofingTestimonials: NicheTestimonial[] = [
  {
    id: "roof-t-1",
    quote:
      "Insurance denied my claim initially. [Business Name] fought for me and got it fully approved. They handled everything. Roof looks incredible.",
    name: "Bill P.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Turned denied claim into full approval",
  },
  {
    id: "roof-t-2",
    quote:
      "After the hailstorm, 4 companies gave me estimates. [Business Name] was the only one that found the full extent of the damage — and the insurance agreed.",
    name: "Nancy W.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Most thorough storm damage inspection",
  },
  {
    id: "roof-t-3",
    quote:
      "Entire roof replaced in one day. Crew arrived at 7am and was done before sunset. Yard was spotless — not a single nail left behind.",
    name: "George T.",
    role: "Homeowner",
    city: "[City]",
    stars: 5,
    highlight: "Full replacement in one day",
  },
  {
    id: "roof-t-4",
    quote:
      "We got 4 bids. [Business Name] wasn't the cheapest but they were clearly the most professional. Best decision we made on this house.",
    name: "Karen & Ed L.",
    role: "Homeowners",
    city: "[City]",
    stars: 5,
    highlight: "Worth the investment over cheaper bids",
  },
  {
    id: "roof-t-5",
    quote:
      "25-year warranty in writing. That's what made the decision easy. Plus their portfolio in our neighborhood was impressive.",
    name: "Mark V.",
    role: "New Client",
    city: "[City]",
    stars: 5,
    highlight: "25-year written warranty",
  },
];

const roofingTrustBadges: NicheTrustBadge[] = [
  {
    id: "roof-tb-1",
    label: "State Licensed Contractor",
    icon: "🔐",
    category: "license",
    description: "State-licensed general contractor — roofing specialty",
  },
  {
    id: "roof-tb-2",
    label: "Works With All Insurers",
    icon: "📋",
    category: "certification",
    description: "Direct insurance billing and claims coordination",
  },
  {
    id: "roof-tb-3",
    label: "25-Year Warranty Available",
    icon: "🛡️",
    category: "guarantee",
    description: "Manufacturer-backed 25-year material warranty",
  },
  {
    id: "roof-tb-4",
    label: "GAF Certified Installer",
    icon: "🏅",
    category: "certification",
    description: "Certified GAF Master Elite installer",
  },
  {
    id: "roof-tb-5",
    label: "Free Storm Inspections",
    icon: "⚡",
    category: "guarantee",
    description: "Complimentary storm damage assessment",
  },
  {
    id: "roof-tb-6",
    label: "Fully Insured — $5M",
    icon: "💼",
    category: "insurance",
    description: "$5M general liability coverage",
  },
  {
    id: "roof-tb-7",
    label: "BBB Accredited",
    icon: "⭐",
    category: "award",
    description: "Better Business Bureau accredited contractor",
  },
  {
    id: "roof-tb-8",
    label: "Zero Deposit Required",
    icon: "💰",
    category: "guarantee",
    description: "Work starts before you pay — we earn your trust first",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// REAL ESTATE
// ═══════════════════════════════════════════════════════════════════════════════

const realEstateImages: NicheImage[] = [
  {
    id: "re-img-1",
    label: "Agent With Sold Sign",
    description:
      "Confident real estate agent holding a SOLD sign in front of a beautiful listing — success and trust",
    keywords: "real estate agent sold sign listing success",
    targetSection: "hero",
    alt: "Real estate agent celebrating a sold listing",
    gradient: "linear-gradient(135deg, #0e7490 0%, #047857 100%)",
  },
  {
    id: "re-img-2",
    label: "Luxury Home Exterior",
    description:
      "Stunning luxury home exterior at golden hour — curb appeal and premium positioning",
    keywords: "luxury home exterior curb appeal premium",
    targetSection: "hero",
    alt: "Luxury home exterior showcasing premium real estate",
    gradient: "linear-gradient(135deg, #064e3b 0%, #0e7490 100%)",
  },
  {
    id: "re-img-3",
    label: "Open House Welcome",
    description:
      "Warm, inviting open house setup with refreshments and signage — community and accessibility",
    keywords: "open house real estate welcome community",
    targetSection: "services",
    alt: "Open house welcome setup for prospective buyers",
    gradient: "linear-gradient(135deg, #0e7490 0%, #0891b2 100%)",
  },
  {
    id: "re-img-4",
    label: "Before/After Staging",
    description:
      "Empty room transformed by professional staging — before and after split visual",
    keywords: "home staging before after transformation",
    targetSection: "before_after",
    alt: "Before and after home staging transformation",
    gradient: "linear-gradient(135deg, #78350f 0%, #047857 100%)",
  },
  {
    id: "re-img-5",
    label: "Agent Consultation",
    description:
      "Agent reviewing listing paperwork with sellers at kitchen table — trust and guidance",
    keywords: "real estate consultation sellers paperwork",
    targetSection: "process",
    alt: "Real estate agent consulting with home sellers",
    gradient: "linear-gradient(135deg, #0f172a 0%, #0e7490 100%)",
  },
  {
    id: "re-img-6",
    label: "Modern Interior Tour",
    description:
      "Bright modern living room interior — the kind of space buyers fall in love with",
    keywords: "modern living room interior bright",
    targetSection: "services",
    alt: "Modern living room interior for property tour",
    gradient: "linear-gradient(135deg, #047857 0%, #0e7490 100%)",
  },
];

const realEstateHeadlines: NicheHeadline[] = [
  {
    id: "re-hl-1",
    headline: "The First Agent to Respond Wins — Be That Agent in [City]",
    subheadline:
      "AI-powered lead capture responds in seconds, 24/7. Never lose another deal to a faster competitor.",
    targetSection: "hero",
    framework: "Kennedy",
    frameworkLabel: "Direct Response — Speed + Urgency",
    conversionScore: 95,
  },
  {
    id: "re-hl-2",
    headline:
      "[City]'s Most Trusted Real Estate Agent — 5-Star Reviews, Proven Results",
    subheadline:
      "Hundreds of families helped. A reputation built on responsiveness, honesty, and results.",
    targetSection: "hero",
    framework: "Abraham",
    frameworkLabel: "Strategy of Preeminence — Authority",
    conversionScore: 89,
  },
  {
    id: "re-hl-3",
    headline:
      "Selling Your Home Is a Big Decision — Work With an Agent Who Makes It Simple",
    subheadline:
      "Clear pricing. Honest guidance. A system that keeps your listing top-of-mind with every buyer.",
    targetSection: "hero",
    framework: "Schwartz",
    frameworkLabel: "Awareness Spectrum — Trust for Cold Traffic",
    conversionScore: 86,
  },
  {
    id: "re-hl-4",
    headline:
      "See the Homes We've Sold in [City] — Real Closings, Real Families",
    subheadline:
      "A portfolio of successful closings. Proof that our system works for sellers and buyers alike.",
    targetSection: "before_after",
    framework: "Hopkins",
    frameworkLabel: "Specificity — Local Proof",
    conversionScore: 88,
  },
  {
    id: "re-hl-5",
    headline:
      "78% of Buyers Choose the First Agent Who Responds — Will That Be You?",
    subheadline:
      "Our AI lead system ensures you're always first. Book a free strategy session today.",
    targetSection: "cta_banner",
    framework: "Suby",
    frameworkLabel: "PASTOR — Problem Amplification",
    conversionScore: 93,
  },
];

const realEstateTestimonials: NicheTestimonial[] = [
  {
    id: "re-t-1",
    quote:
      "I inquired about a listing at 10pm and had a showing scheduled by 10:05pm. Found our dream home in 3 weeks. The most responsive agent I've ever worked with.",
    name: "Lisa T.",
    role: "Homebuyer",
    city: "[City]",
    stars: 5,
    highlight: "Showing scheduled in 5 minutes at 10pm",
  },
  {
    id: "re-t-2",
    quote:
      "Our agent sold our home in 11 days for above asking. The follow-up system kept our listing in front of every serious buyer. Absolutely exceptional.",
    name: "Michael B.",
    role: "Home Seller",
    city: "[City]",
    stars: 5,
    highlight: "Sold in 11 days above asking",
  },
  {
    id: "re-t-3",
    quote:
      "I've worked with three agents over the years. This is the first one who actually responded every single time, day or night. That responsiveness won us the deal.",
    name: "Jennifer R.",
    role: "Investor",
    city: "[City]",
    stars: 5,
    highlight: "Always responsive — won the deal",
  },
  {
    id: "re-t-4",
    quote:
      "As a broker with 14 agents, I needed a system that captured every lead. BRF made our whole office faster and more professional. Closings are up 30%.",
    name: "David K.",
    role: "Broker",
    city: "[City]",
    stars: 5,
    highlight: "Office closings up 30%",
  },
  {
    id: "re-t-5",
    quote:
      "My Google reviews went from 14 to 61 in 4 months. The review automation is incredible — every closed client gets asked, and most of them leave 5 stars.",
    name: "Priya S.",
    role: "Solo Agent",
    city: "[City]",
    stars: 5,
    highlight: "Reviews 14 → 61 in 4 months",
  },
];

const realEstateTrustBadges: NicheTrustBadge[] = [
  {
    id: "re-tb-1",
    label: "Licensed Real Estate Professional",
    icon: "🏅",
    category: "license",
    description: "State-licensed real estate agent or broker",
  },
  {
    id: "re-tb-2",
    label: "24/7 Lead Response Guarantee",
    icon: "⚡",
    category: "guarantee",
    description: "Every inquiry answered within seconds — day or night",
  },
  {
    id: "re-tb-3",
    label: "5-Star Google Rated",
    icon: "⭐",
    category: "award",
    description: "Consistently top-rated by buyers and sellers",
  },
  {
    id: "re-tb-4",
    label: "AI-Powered Follow-Up System",
    icon: "🤖",
    category: "certification",
    description: "Automated lead nurturing that never lets a lead go cold",
  },
  {
    id: "re-tb-5",
    label: "Local Market Expert",
    icon: "📍",
    category: "certification",
    description: "Deep expertise in [City] neighborhoods and pricing",
  },
  {
    id: "re-tb-6",
    label: "Satisfaction Guarantee",
    icon: "💯",
    category: "guarantee",
    description: "We earn your trust before, during, and after every closing",
  },
  {
    id: "re-tb-7",
    label: "E&O Insured",
    icon: "🛡️",
    category: "insurance",
    description: "Errors and omissions insurance coverage in place",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MORTGAGE
// ═══════════════════════════════════════════════════════════════════════════════

const mortgageImages: NicheImage[] = [
  {
    id: "mort-img-1",
    label: "Loan Officer Handshake",
    description:
      "Professional loan officer shaking hands with happy client after approval — trust and outcome",
    keywords: "mortgage loan officer handshake approval",
    targetSection: "hero",
    alt: "Mortgage loan officer with approved client",
    gradient: "linear-gradient(135deg, #312e81 0%, #1e40af 100%)",
  },
  {
    id: "mort-img-2",
    label: "New Home Keys Handoff",
    description:
      "Smiling family receiving keys to their new home — the emotional payoff of a closed loan",
    keywords: "new home keys family mortgage closing",
    targetSection: "hero",
    alt: "Family receiving keys to their new home",
    gradient: "linear-gradient(135deg, #1e40af 0%, #0e7490 100%)",
  },
  {
    id: "mort-img-3",
    label: "Rate Analysis Consultation",
    description:
      "Loan officer reviewing rate options on a tablet with a borrower — clarity and expertise",
    keywords: "mortgage rate analysis consultation borrower",
    targetSection: "services",
    alt: "Mortgage rate analysis consultation",
    gradient: "linear-gradient(135deg, #0f172a 0%, #312e81 100%)",
  },
  {
    id: "mort-img-4",
    label: "Pre-Approval Letter",
    description:
      "Close-up of a mortgage pre-approval letter being handed to a buyer — competitive advantage",
    keywords: "mortgage pre approval letter buyer",
    targetSection: "services",
    alt: "Mortgage pre-approval letter for homebuyer",
    gradient: "linear-gradient(135deg, #312e81 0%, #4338ca 100%)",
  },
  {
    id: "mort-img-5",
    label: "Realtor Partnership Meeting",
    description:
      "Mortgage broker meeting with realtor partners — referral pipeline and professional network",
    keywords: "mortgage broker realtor partnership referral",
    targetSection: "about",
    alt: "Mortgage broker and realtor partnership meeting",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
  },
  {
    id: "mort-img-6",
    label: "Closing Day Celebration",
    description:
      "Borrower signing final loan documents with a smile — the finish line of the mortgage process",
    keywords: "mortgage closing day signing documents",
    targetSection: "before_after",
    alt: "Mortgage closing day document signing",
    gradient: "linear-gradient(135deg, #312e81 0%, #0e7490 100%)",
  },
];

const mortgageHeadlines: NicheHeadline[] = [
  {
    id: "mort-hl-1",
    headline:
      "The Broker Who Answers First Wins the Loan — Be That Broker in [City]",
    subheadline:
      "AI captures every after-hours inquiry and pre-qualifies borrowers 24/7. Stop losing loans to slower competitors.",
    targetSection: "hero",
    framework: "Kennedy",
    frameworkLabel: "Direct Response — Speed + Urgency",
    conversionScore: 95,
  },
  {
    id: "mort-hl-2",
    headline:
      "[City]'s Most Responsive Mortgage Broker — Pre-Approvals in 24 Hours",
    subheadline:
      "Fast, clear, and honest. A mortgage process that closes 22 days faster than the market average.",
    targetSection: "hero",
    framework: "Abraham",
    frameworkLabel: "Strategy of Preeminence — Authority",
    conversionScore: 90,
  },
  {
    id: "mort-hl-3",
    headline:
      "67% of Borrowers Call After 5pm — Most Brokers Miss Them. We Don't.",
    subheadline:
      "Our AI front desk captures every inquiry the moment it comes in — evenings, weekends, holidays.",
    targetSection: "hero",
    framework: "Suby",
    frameworkLabel: "PASTOR — Problem Amplification",
    conversionScore: 92,
  },
  {
    id: "mort-hl-4",
    headline:
      "See How Much Faster Our Borrowers Close — Real Loans, Real Families",
    subheadline:
      "A track record of speed and clarity that realtors and borrowers trust.",
    targetSection: "before_after",
    framework: "Hopkins",
    frameworkLabel: "Specificity — Proof",
    conversionScore: 87,
  },
  {
    id: "mort-hl-5",
    headline:
      "Realtors: Partner With the Broker Who Actually Picks Up the Phone",
    subheadline:
      "Your referrals deserve a broker who responds in seconds, not hours. Let's talk.",
    targetSection: "cta_banner",
    framework: "Halbert",
    frameworkLabel: "PAS — Problem-Agitate-Solve",
    conversionScore: 89,
  },
];

const mortgageTestimonials: NicheTestimonial[] = [
  {
    id: "mort-t-1",
    quote:
      "Pre-approved in 24 hours and closed 18 days faster than any competing offer. The most responsive broker I've ever worked with.",
    name: "Tom B.",
    role: "Homebuyer",
    city: "[City]",
    stars: 5,
    highlight: "Closed 18 days faster than market",
  },
  {
    id: "mort-t-2",
    quote:
      "I sent my inquiry at 9pm and had a loan advisor on the phone by 9:05pm. That kind of responsiveness won my business for life.",
    name: "Sarah K.",
    role: "First-Time Buyer",
    city: "[City]",
    stars: 5,
    highlight: "5-minute response at 9pm",
  },
  {
    id: "mort-t-3",
    quote:
      "As a realtor, I send every client to this broker. They respond faster than anyone in town and my buyers always close on time.",
    name: "James W.",
    role: "Realtor Partner",
    city: "[City]",
    stars: 5,
    highlight: "Top referral partner for realtors",
  },
  {
    id: "mort-t-4",
    quote:
      "After-hours inquiries used to disappear. Now every call is captured and pre-qualified automatically. My pipeline has never been stronger.",
    name: "Linda M.",
    role: "Loan Officer",
    city: "[City]",
    stars: 5,
    highlight: "Pipeline never stronger",
  },
  {
    id: "mort-t-5",
    quote:
      "The rate lock timing advice saved us $14,000 in interest. This broker actually understands the market and protects the borrower.",
    name: "Robert H.",
    role: "Homebuyer",
    city: "[City]",
    stars: 5,
    highlight: "Saved $14,000 with rate lock timing",
  },
];

const mortgageTrustBadges: NicheTrustBadge[] = [
  {
    id: "mort-tb-1",
    label: "Licensed Mortgage Broker",
    icon: "🏅",
    category: "license",
    description: "State-licensed mortgage broker or loan officer",
  },
  {
    id: "mort-tb-2",
    label: "24/7 Inquiry Response",
    icon: "⚡",
    category: "guarantee",
    description:
      "Every borrower inquiry answered within seconds — day or night",
  },
  {
    id: "mort-tb-3",
    label: "NMLS Registered",
    icon: "🔐",
    category: "certification",
    description: "Nationwide Multistate Licensing System registered",
  },
  {
    id: "mort-tb-4",
    label: "24-Hour Pre-Approval",
    icon: "⏱️",
    category: "guarantee",
    description: "Pre-approval letters ready within 24 hours of application",
  },
  {
    id: "mort-tb-5",
    label: "AI Pre-Qualification",
    icon: "🤖",
    category: "certification",
    description:
      "Smart borrower pre-qualification before your first conversation",
  },
  {
    id: "mort-tb-6",
    label: "Realtor Partner Program",
    icon: "🤝",
    category: "award",
    description: "Trusted referral partner for top-producing realtors",
  },
  {
    id: "mort-tb-7",
    label: "Satisfaction Guarantee",
    icon: "💯",
    category: "guarantee",
    description:
      "Clear communication and honest guidance from inquiry to closing",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Unified export
// ═══════════════════════════════════════════════════════════════════════════════

export const NICHE_CONTENT_LIBRARY: Record<NicheKey, NicheContentLibraryData> =
  {
    plumbing: {
      images: plumbingImages,
      headlines: plumbingHeadlines,
      testimonials: plumbingTestimonials,
      trustBadges: plumbingTrustBadges,
    },
    hvac: {
      images: hvacImages,
      headlines: hvacHeadlines,
      testimonials: hvacTestimonials,
      trustBadges: hvacTrustBadges,
    },
    med_spa: {
      images: medSpaImages,
      headlines: medSpaHeadlines,
      testimonials: medSpaTestimonials,
      trustBadges: medSpaTrustBadges,
    },
    restoration: {
      images: restorationImages,
      headlines: restorationHeadlines,
      testimonials: restorationTestimonials,
      trustBadges: restorationTrustBadges,
    },
    carpet_cleaning: {
      images: carpetImages,
      headlines: carpetHeadlines,
      testimonials: carpetTestimonials,
      trustBadges: carpetTrustBadges,
    },
    roofing: {
      images: roofingImages,
      headlines: roofingHeadlines,
      testimonials: roofingTestimonials,
      trustBadges: roofingTrustBadges,
    },
    real_estate: {
      images: realEstateImages,
      headlines: realEstateHeadlines,
      testimonials: realEstateTestimonials,
      trustBadges: realEstateTrustBadges,
    },
    mortgage: {
      images: mortgageImages,
      headlines: mortgageHeadlines,
      testimonials: mortgageTestimonials,
      trustBadges: mortgageTrustBadges,
    },
  };

/** Normalize niche string to library key */
export function normalizeNicheKey(niche: string): NicheKey {
  const n = niche.toLowerCase().replace(/[-\s]/g, "_");
  const map: Record<string, NicheKey> = {
    plumbing: "plumbing",
    hvac: "hvac",
    med_spa: "med_spa",
    "med-spa": "med_spa",
    medspa: "med_spa",
    restoration: "restoration",
    carpet_cleaning: "carpet_cleaning",
    "carpet-cleaning": "carpet_cleaning",
    carpetcleaning: "carpet_cleaning",
    roofing: "roofing",
    real_estate: "real_estate",
    "real-estate": "real_estate",
    realestate: "real_estate",
    "real estate": "real_estate",
    mortgage: "mortgage",
  };
  return map[n] ?? "plumbing";
}

export function getNicheLibrary(niche: string): NicheContentLibraryData {
  return NICHE_CONTENT_LIBRARY[normalizeNicheKey(niche)];
}
