// Landing Page Builder — data models and niche templates

export type SectionType =
  | "hero"
  | "features"
  | "testimonials"
  | "form"
  | "cta"
  | "pricing"
  | "faq";

export type FieldType =
  | "name"
  | "phone"
  | "email"
  | "service"
  | "address"
  | "message";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  enabled: boolean;
}

export interface HeroSectionData {
  headline: string;
  subtext: string;
  ctaText: string;
  bgGradient: string;
  imageUrl?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesSectionData {
  headline: string;
  items: Feature[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface TestimonialsSectionData {
  headline: string;
  items: Testimonial[];
}

export interface FormSectionData {
  headline: string;
  subtext: string;
  ctaText: string;
  fields: FormField[];
}

export interface CtaSectionData {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaSecondaryText?: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
}

export interface PricingSectionData {
  headline: string;
  tiers: PricingTier[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionData {
  headline: string;
  items: FaqItem[];
}

export type SectionData =
  | { type: "hero"; data: HeroSectionData }
  | { type: "features"; data: FeaturesSectionData }
  | { type: "testimonials"; data: TestimonialsSectionData }
  | { type: "form"; data: FormSectionData }
  | { type: "cta"; data: CtaSectionData }
  | { type: "pricing"; data: PricingSectionData }
  | { type: "faq"; data: FaqSectionData };

export interface LandingPageSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  data: SectionData["data"];
}

export type PageVariant = "A" | "B";

export interface LandingPage {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  niche: string;
  status: "draft" | "published";
  variantOf?: string; // parent page ID if this is a variant B
  variant: PageVariant;
  sections: LandingPageSection[];
  analytics: PageAnalytics;
  createdAt: number;
  updatedAt: number;
}

export interface PageAnalytics {
  views: number;
  submissions: number;
  conversionRate: number;
  variantAViews?: number;
  variantBViews?: number;
  variantASubmissions?: number;
  variantBSubmissions?: number;
}

// ── DEFAULT FORM FIELDS ───────────────────────────────────────────────────────

const defaultFormFields = (serviceOptions: string[]): FormField[] => [
  {
    id: "f-name",
    type: "name",
    label: "Full Name",
    placeholder: "Your full name",
    required: true,
    enabled: true,
  },
  {
    id: "f-phone",
    type: "phone",
    label: "Phone Number",
    placeholder: "(555) 000-0000",
    required: true,
    enabled: true,
  },
  {
    id: "f-email",
    type: "email",
    label: "Email Address",
    placeholder: "you@example.com",
    required: false,
    enabled: true,
  },
  {
    id: "f-service",
    type: "service",
    label: "Service Needed",
    placeholder: serviceOptions.join(", "),
    required: true,
    enabled: true,
  },
  {
    id: "f-address",
    type: "address",
    label: "Service Address",
    placeholder: "Your address or zip code",
    required: false,
    enabled: false,
  },
  {
    id: "f-message",
    type: "message",
    label: "Message",
    placeholder: "Tell us more about what you need...",
    required: false,
    enabled: false,
  },
];

// ── NICHE TEMPLATE DEFINITIONS ────────────────────────────────────────────────

export interface NicheTemplate {
  id: string;
  niche: string;
  label: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  emoji: string;
  sections: LandingPageSection[];
}

const mkId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

function buildTemplate(
  id: string,
  niche: string,
  label: string,
  description: string,
  colorFrom: string,
  colorTo: string,
  emoji: string,
  hero: HeroSectionData,
  features: FeaturesSectionData,
  testimonials: TestimonialsSectionData,
  formHeadline: string,
  formSubtext: string,
  cta: CtaSectionData,
  pricing: PricingSectionData,
  faq: FaqSectionData,
  serviceOptions: string[],
): NicheTemplate {
  return {
    id,
    niche,
    label,
    description,
    colorFrom,
    colorTo,
    emoji,
    sections: [
      { id: mkId("hero"), type: "hero", enabled: true, data: hero },
      { id: mkId("feat"), type: "features", enabled: true, data: features },
      {
        id: mkId("test"),
        type: "testimonials",
        enabled: true,
        data: testimonials,
      },
      {
        id: mkId("form"),
        type: "form",
        enabled: true,
        data: {
          headline: formHeadline,
          subtext: formSubtext,
          ctaText: "Get My Free Quote",
          fields: defaultFormFields(serviceOptions),
        } as FormSectionData,
      },
      { id: mkId("cta"), type: "cta", enabled: true, data: cta },
      { id: mkId("price"), type: "pricing", enabled: false, data: pricing },
      { id: mkId("faq"), type: "faq", enabled: true, data: faq },
    ],
  };
}

export const NICHE_TEMPLATES: NicheTemplate[] = [
  // ── PLUMBER ──────────────────────────────────────────────────────────────────
  buildTemplate(
    "tpl-plumber",
    "plumbing",
    "Plumber",
    "Emergency & residential plumbing services",
    "#1e40af",
    "#3b82f6",
    "🔧",
    {
      headline: "Fast, Reliable Plumbing — Available 24/7",
      subtext:
        "Burst pipe? Clogged drain? Water heater down? Our licensed plumbers arrive fast and fix it right the first time.",
      ctaText: "Get a Free Estimate",
      bgGradient: "from-blue-950 to-blue-800",
    },
    {
      headline: "Why Homeowners Trust Us",
      items: [
        {
          icon: "⚡",
          title: "Same-Day Service",
          description:
            "We dispatch within the hour for emergency calls — 365 days a year.",
        },
        {
          icon: "🏅",
          title: "Licensed & Insured",
          description:
            "Fully licensed master plumbers with $2M liability coverage.",
        },
        {
          icon: "💰",
          title: "Upfront Pricing",
          description:
            "No surprise charges. You approve every line item before we begin.",
        },
        {
          icon: "🔒",
          title: "Workmanship Guarantee",
          description:
            "All labor guaranteed for 12 months. Parts covered by manufacturer.",
        },
      ],
    },
    {
      headline: "What Our Customers Say",
      items: [
        {
          name: "Sandra M.",
          role: "Homeowner, Austin TX",
          quote:
            "They showed up within 45 minutes and had my burst pipe fixed before noon. Absolute lifesavers.",
          rating: 5,
        },
        {
          name: "Robert C.",
          role: "Property Manager",
          quote:
            "Been using them for 3 years across 12 units. Always professional, always on time.",
          rating: 5,
        },
        {
          name: "Tanya W.",
          role: "First-time Homeowner",
          quote:
            "Explained everything clearly and didn't try to upsell me. Honest and fair pricing.",
          rating: 5,
        },
      ],
    },
    "Get Your Free Plumbing Estimate",
    "Fill out the form and we'll call you within 15 minutes to confirm your appointment.",
    {
      headline: "Stop Living With a Broken Plumbing System",
      subtext:
        "Every day you wait, the damage gets worse. Call now — first-time customers get $25 off.",
      ctaText: "Book My Appointment",
      ctaSecondaryText: "Or call (555) 882-4400",
    },
    {
      headline: "Simple, Transparent Pricing",
      tiers: [
        {
          name: "Diagnostic",
          price: "$49",
          period: "visit",
          features: [
            "Full system inspection",
            "Written estimate",
            "Applied to repair cost",
          ],
          highlighted: false,
        },
        {
          name: "Standard Repair",
          price: "$149",
          period: "starting at",
          features: [
            "All standard repairs",
            "12-month labor warranty",
            "Upfront pricing",
          ],
          highlighted: true,
        },
        {
          name: "Emergency",
          price: "$249",
          period: "starting at",
          features: [
            "24/7 dispatch",
            "Arrival within 1 hour",
            "Priority queue",
          ],
          highlighted: false,
        },
      ],
    },
    {
      headline: "Common Questions",
      items: [
        {
          question: "Do you offer same-day appointments?",
          answer:
            "Yes — for emergency calls we dispatch within the hour. Standard appointments are usually same-day or next morning.",
        },
        {
          question: "What areas do you serve?",
          answer:
            "We serve the greater metro area including surrounding suburbs. Call us to confirm we cover your zip code.",
        },
        {
          question: "Are your plumbers licensed?",
          answer:
            "All our technicians are licensed master plumbers and carry full liability insurance.",
        },
      ],
    },
    [
      "Pipe Repair",
      "Drain Cleaning",
      "Water Heater",
      "Leak Detection",
      "Fixture Install",
    ],
  ),

  // ── HVAC ─────────────────────────────────────────────────────────────────────
  buildTemplate(
    "tpl-hvac",
    "hvac",
    "HVAC",
    "Heating & cooling installation and repair",
    "#065f46",
    "#10b981",
    "❄️",
    {
      headline: "Heating & Cooling You Can Count On",
      subtext:
        "From emergency repairs to full system replacements — certified HVAC technicians serving residential and commercial customers.",
      ctaText: "Schedule Service",
      bgGradient: "from-emerald-950 to-emerald-800",
    },
    {
      headline: "Our Service Promise",
      items: [
        {
          icon: "🌡️",
          title: "All Makes & Models",
          description:
            "We service every major brand — Carrier, Lennox, Trane, Goodman, and more.",
        },
        {
          icon: "⚙️",
          title: "NATE Certified Techs",
          description:
            "Our technicians hold NATE certification — the gold standard in HVAC.",
        },
        {
          icon: "📋",
          title: "Free System Quote",
          description:
            "New system installations always include a free in-home estimate.",
        },
        {
          icon: "🛡️",
          title: "10-Year Labor Warranty",
          description:
            "Industry-leading warranty on all new system installations.",
        },
      ],
    },
    {
      headline: "Trusted by Thousands of Homeowners",
      items: [
        {
          name: "James R.",
          role: "Homeowner, Phoenix AZ",
          quote:
            "AC went out on a Friday afternoon in July. They had a tech at my door by 6pm and it was fixed by 8. Incredible.",
          rating: 5,
        },
        {
          name: "Maria L.",
          role: "Office Manager",
          quote:
            "Installed our new commercial unit perfectly. Clean work, minimal disruption, and on budget.",
          rating: 5,
        },
        {
          name: "Derek T.",
          role: "Landlord, 4 Properties",
          quote:
            "Responsive, honest, and their maintenance plans save me money every year.",
          rating: 5,
        },
      ],
    },
    "Request a Free HVAC Estimate",
    "Tell us about your system and we'll schedule a no-obligation visit.",
    {
      headline: "Don't Sweat It — We've Got You Covered",
      subtext:
        "AC out in summer? Furnace down in winter? 24/7 emergency service available. First service call includes a free system efficiency report.",
      ctaText: "Get Emergency Help",
      ctaSecondaryText: "Call (555) 743-0022",
    },
    {
      headline: "Maintenance Plans",
      tiers: [
        {
          name: "Basic",
          price: "$99",
          period: "/year",
          features: [
            "Annual tune-up",
            "Filter replacement",
            "Priority scheduling",
          ],
          highlighted: false,
        },
        {
          name: "Comfort",
          price: "$199",
          period: "/year",
          features: [
            "2 tune-ups per year",
            "Parts discount 15%",
            "Emergency priority",
            "Free filter changes",
          ],
          highlighted: true,
        },
        {
          name: "Premium",
          price: "$349",
          period: "/year",
          features: [
            "Quarterly visits",
            "Parts discount 25%",
            "Same-day emergency",
            "Indoor air quality check",
          ],
          highlighted: false,
        },
      ],
    },
    {
      headline: "Frequently Asked Questions",
      items: [
        {
          question: "How often should I service my HVAC system?",
          answer:
            "We recommend a tune-up twice a year — once before summer and once before winter — to maintain efficiency and catch issues early.",
        },
        {
          question: "My system is 10 years old. Should I repair or replace?",
          answer:
            "If the repair cost exceeds 50% of replacement cost, or your system is over 10–12 years old, a new system often pays for itself in energy savings.",
        },
        {
          question: "What brands do you install?",
          answer:
            "We install Carrier, Trane, Lennox, Goodman, and Daikin. We'll recommend the best fit for your home and budget.",
        },
      ],
    },
    [
      "AC Repair",
      "Heating Repair",
      "New Installation",
      "Maintenance Plan",
      "Duct Cleaning",
    ],
  ),

  // ── MED SPA ───────────────────────────────────────────────────────────────────
  buildTemplate(
    "tpl-medspa",
    "med-spa",
    "Med Spa",
    "Aesthetic & wellness treatments",
    "#701a75",
    "#a855f7",
    "✨",
    {
      headline: "Look Your Best. Feel Confident. Start Today.",
      subtext:
        "Expert aesthetic treatments in a luxury, medically supervised environment. Botox, fillers, laser, and more.",
      ctaText: "Book a Consultation",
      bgGradient: "from-purple-950 to-fuchsia-900",
    },
    {
      headline: "Why Patients Choose Us",
      items: [
        {
          icon: "👩‍⚕️",
          title: "Board-Certified Providers",
          description:
            "All injectors and laser technicians are board-certified and continuously trained.",
        },
        {
          icon: "🏥",
          title: "Medical-Grade Treatments",
          description:
            "We use only FDA-approved injectables and laser platforms.",
        },
        {
          icon: "💆",
          title: "Personalized Plans",
          description:
            "Every treatment plan is custom — no cookie-cutter approaches.",
        },
        {
          icon: "🌿",
          title: "Natural-Looking Results",
          description:
            "We specialize in subtle, natural enhancements you'll love.",
        },
      ],
    },
    {
      headline: "Real Results. Real Patients.",
      items: [
        {
          name: "Ashley K.",
          role: "Patient — Botox & Lip Filler",
          quote:
            "I've been to 3 med spas and this is the only one where I left looking exactly how I envisioned. They really listen.",
          rating: 5,
        },
        {
          name: "Priya N.",
          role: "Patient — Laser Resurfacing",
          quote:
            "My skin hasn't looked this good since my 20s. The team made me feel completely comfortable the whole time.",
          rating: 5,
        },
        {
          name: "Caitlin H.",
          role: "Patient — Hydrafacial",
          quote:
            "Professional, clean, and relaxing. My go-to for a monthly reset.",
          rating: 5,
        },
      ],
    },
    "Book Your Free Consultation",
    "Schedule a no-obligation 30-minute consultation with one of our providers.",
    {
      headline: "Your Best Self is One Appointment Away",
      subtext:
        "New patients receive a complimentary skin analysis and $50 off their first treatment.",
      ctaText: "Claim My Offer",
      ctaSecondaryText: "Text us at (555) 920-1188",
    },
    {
      headline: "Popular Treatment Packages",
      tiers: [
        {
          name: "Refresh",
          price: "$299",
          period: "per session",
          features: ["Hydrafacial", "LED light therapy", "Take-home kit"],
          highlighted: false,
        },
        {
          name: "Glow",
          price: "$599",
          period: "per session",
          features: [
            "Botox (20 units)",
            "Hydrafacial",
            "Priority booking",
            "Free touch-up",
          ],
          highlighted: true,
        },
        {
          name: "Transform",
          price: "$1,299",
          period: "per session",
          features: [
            "Full face filler",
            "Botox",
            "Laser treatment",
            "VIP access",
          ],
          highlighted: false,
        },
      ],
    },
    {
      headline: "Your Questions Answered",
      items: [
        {
          question: "Do injectables hurt?",
          answer:
            "Most patients describe a mild pinch. We use topical numbing cream and the finest needles available to minimize discomfort.",
        },
        {
          question: "How long do results last?",
          answer:
            "Botox typically lasts 3–4 months. Dermal fillers can last 6–18 months depending on the product and area treated.",
        },
        {
          question: "Is there downtime after treatment?",
          answer:
            "Most treatments have minimal to no downtime. Injectables may cause slight redness or swelling for 24–48 hours.",
        },
      ],
    },
    ["Botox", "Lip Filler", "Laser", "Hydrafacial", "Skin Tightening"],
  ),

  // ── RESTORATION ──────────────────────────────────────────────────────────────
  buildTemplate(
    "tpl-restoration",
    "restoration",
    "Restoration",
    "Water, fire & mold damage restoration",
    "#7c2d12",
    "#f97316",
    "🏗️",
    {
      headline: "Disaster Hits Fast. We Respond Faster.",
      subtext:
        "24/7 water, fire, and mold damage restoration. IICRC-certified crews on-site within 60 minutes.",
      ctaText: "Call Our Emergency Line",
      bgGradient: "from-orange-950 to-red-900",
    },
    {
      headline: "When Seconds Count",
      items: [
        {
          icon: "🚨",
          title: "60-Minute Response",
          description:
            "Our crews are strategically positioned for fast dispatch anywhere in the metro.",
        },
        {
          icon: "📋",
          title: "Full Insurance Billing",
          description:
            "We work directly with your insurance company and handle all documentation.",
        },
        {
          icon: "🎓",
          title: "IICRC Certified",
          description:
            "Every technician is IICRC-certified in water, fire, and mold remediation.",
        },
        {
          icon: "🏠",
          title: "Full Reconstruction",
          description:
            "We don't just dry out — we rebuild. One contractor, start to finish.",
        },
      ],
    },
    {
      headline: "Families We've Helped",
      items: [
        {
          name: "Greg & Sarah T.",
          role: "Water Damage — Burst Pipe",
          quote:
            "They arrived within an hour and had fans running that night. Saved our hardwood floors and handled the insurance perfectly.",
          rating: 5,
        },
        {
          name: "Donna R.",
          role: "Fire Damage",
          quote:
            "After the fire, I didn't know where to start. This team guided us through every step and rebuilt our kitchen beautifully.",
          rating: 5,
        },
        {
          name: "Marcus J.",
          role: "Mold Remediation",
          quote:
            "Found mold behind our walls after a slow leak. They remediated it completely and provided clearance documentation.",
          rating: 5,
        },
      ],
    },
    "Report Your Damage Now",
    "Our coordinators are standing by 24/7. Fast response prevents further loss.",
    {
      headline: "Don't Wait — Damage Gets Worse Every Hour",
      subtext:
        "Mold can start growing within 24–48 hours. Call now for immediate response and free damage assessment.",
      ctaText: "Get Immediate Help",
      ctaSecondaryText: "24/7 Emergency: (555) 611-9900",
    },
    {
      headline: "Our Service Scope",
      tiers: [
        {
          name: "Emergency Response",
          price: "Free",
          period: "assessment",
          features: [
            "Damage documentation",
            "Moisture readings",
            "Insurance report",
          ],
          highlighted: false,
        },
        {
          name: "Mitigation",
          price: "Insurance Covered",
          period: "typically",
          features: [
            "Water extraction",
            "Structural drying",
            "Mold prevention",
            "Air quality testing",
          ],
          highlighted: true,
        },
        {
          name: "Full Rebuild",
          price: "Insurance Covered",
          period: "typically",
          features: [
            "Demo & haul-away",
            "Reconstruction",
            "Finish work",
            "Final inspection",
          ],
          highlighted: false,
        },
      ],
    },
    {
      headline: "Common Questions After a Disaster",
      items: [
        {
          question: "Will my insurance cover restoration?",
          answer:
            "Most homeowner policies cover sudden and accidental water, fire, and storm damage. We work with all major carriers and can help you file the claim.",
        },
        {
          question: "How quickly can you arrive?",
          answer:
            "Our emergency crews are on-call 24/7 and typically arrive within 60 minutes in the metro area.",
        },
        {
          question: "How long does water damage restoration take?",
          answer:
            "Structural drying typically takes 3–5 days. Full reconstruction depends on the scope but we'll give you a clear timeline upfront.",
        },
      ],
    },
    [
      "Water Damage",
      "Fire Damage",
      "Mold Remediation",
      "Storm Damage",
      "Smoke Odor",
    ],
  ),

  // ── CARPET CLEANING ───────────────────────────────────────────────────────────
  buildTemplate(
    "tpl-carpet",
    "carpet-cleaning",
    "Carpet Cleaning",
    "Professional residential & commercial cleaning",
    "#1e3a5f",
    "#0ea5e9",
    "🧹",
    {
      headline: "Fresher, Cleaner Carpets — Guaranteed",
      subtext:
        "Professional truck-mounted steam cleaning that removes allergens, pet odors, and deep-set stains.",
      ctaText: "Get a Free Quote",
      bgGradient: "from-sky-950 to-blue-900",
    },
    {
      headline: "The Professional Difference",
      items: [
        {
          icon: "🚛",
          title: "Truck-Mounted Power",
          description:
            "Our truck-mounted equipment extracts more dirt and dries faster than portable units.",
        },
        {
          icon: "🌱",
          title: "Pet & Kid Safe",
          description:
            "All cleaning solutions are non-toxic and eco-friendly — safe for your whole family.",
        },
        {
          icon: "⏱️",
          title: "Fast Dry Times",
          description:
            "Most carpet areas dry in 2–4 hours with our high-powered extraction.",
        },
        {
          icon: "🐾",
          title: "Pet Odor Elimination",
          description:
            "Enzyme-based treatment neutralizes odors at the source — not just masks them.",
        },
      ],
    },
    {
      headline: "Spotless Reviews",
      items: [
        {
          name: "Beth & Tom K.",
          role: "Homeowners",
          quote:
            "Our carpets looked brand new after years of use and two dogs. Incredible transformation.",
          rating: 5,
        },
        {
          name: "Lisa P.",
          role: "Property Manager",
          quote:
            "They turned over 4 apartments in one day. Every carpet passed move-in inspection.",
          rating: 5,
        },
        {
          name: "Chris M.",
          role: "Office Manager",
          quote:
            "Did our entire office over a weekend — quiet, efficient, and spotless Monday morning.",
          rating: 5,
        },
      ],
    },
    "Get Your Free Carpet Cleaning Quote",
    "Tell us about your space and we'll get you a firm price — no surprises.",
    {
      headline: "Your Cleanest Carpets Start Here",
      subtext:
        "Book 3+ rooms and get a free hallway cleaning included. Satisfaction guaranteed or we'll reclean for free.",
      ctaText: "Book My Cleaning",
      ctaSecondaryText: "Call (555) 374-8820",
    },
    {
      headline: "Room Pricing",
      tiers: [
        {
          name: "1–2 Rooms",
          price: "$89",
          period: "flat rate",
          features: ["Steam clean", "Pre-treatment", "Deodorizer included"],
          highlighted: false,
        },
        {
          name: "3–5 Rooms",
          price: "$149",
          period: "flat rate",
          features: [
            "Steam clean",
            "Pre-treatment",
            "Deodorizer + protector",
            "Free hallway",
          ],
          highlighted: true,
        },
        {
          name: "Whole Home",
          price: "$229",
          period: "up to 6 rooms",
          features: [
            "Everything included",
            "Stairs free",
            "Pet treatment",
            "Priority scheduling",
          ],
          highlighted: false,
        },
      ],
    },
    {
      headline: "FAQ",
      items: [
        {
          question: "How long does carpet cleaning take?",
          answer:
            "Most homes take 1–2 hours. We'll give you a time estimate when you book based on your square footage.",
        },
        {
          question: "When can I walk on my carpet after cleaning?",
          answer:
            "Carpets typically dry in 2–4 hours. We recommend light foot traffic during that time.",
        },
        {
          question: "Do you move furniture?",
          answer:
            "We move small furniture at no charge. Heavy pieces like sofas and beds we clean around.",
        },
      ],
    },
    [
      "Carpet Steam Clean",
      "Upholstery",
      "Tile & Grout",
      "Area Rug",
      "Pet Odor",
    ],
  ),

  // ── ROOFING ───────────────────────────────────────────────────────────────────
  buildTemplate(
    "tpl-roofing",
    "roofing",
    "Roofing",
    "Roof repair, replacement & inspection",
    "#422006",
    "#b45309",
    "🏠",
    {
      headline: "Protect Your Home From the Top Down",
      subtext:
        "Expert roofing contractors for repairs, full replacements, and storm damage claims. Licensed, insured, and local.",
      ctaText: "Get a Free Roof Inspection",
      bgGradient: "from-amber-950 to-stone-900",
    },
    {
      headline: "Built on Trust",
      items: [
        {
          icon: "🔍",
          title: "Free Drone Inspection",
          description:
            "We use drone technology to safely inspect your roof and document every issue.",
        },
        {
          icon: "📋",
          title: "Insurance Claim Experts",
          description:
            "We've helped hundreds of homeowners maximize their storm damage claims.",
        },
        {
          icon: "🛡️",
          title: "Manufacturer Certified",
          description:
            "Certified installer for GAF, Owens Corning, and CertainTeed — unlocking extended warranties.",
        },
        {
          icon: "⭐",
          title: "5-Star Rated",
          description:
            "Over 400+ 5-star reviews on Google from satisfied homeowners.",
        },
      ],
    },
    {
      headline: "Homeowners Trust Our Work",
      items: [
        {
          name: "Bill & Nancy R.",
          role: "Full Replacement",
          quote:
            "Got 3 quotes. These guys were professional from day one, hit their timeline, and the roof looks incredible.",
          rating: 5,
        },
        {
          name: "Thomas G.",
          role: "Storm Damage Repair",
          quote:
            "Hail storm destroyed my roof. They worked with my insurance and I paid almost nothing out-of-pocket.",
          rating: 5,
        },
        {
          name: "Carol D.",
          role: "Leak Repair",
          quote:
            "Fast, honest, and didn't try to upsell me on a full replacement when I only needed a repair.",
          rating: 5,
        },
      ],
    },
    "Schedule Your Free Roof Inspection",
    "No obligation. We'll document every issue with photos and give you a written estimate.",
    {
      headline: "Every Day You Wait, Your Roof Gets Worse",
      subtext:
        "A small leak becomes a big repair fast. Get a free inspection this week — most insurance claims are approved.",
      ctaText: "Book My Free Inspection",
      ctaSecondaryText: "Call (555) 509-7741",
    },
    {
      headline: "What's Included",
      tiers: [
        {
          name: "Inspection",
          price: "Free",
          period: "with estimate",
          features: [
            "Drone inspection",
            "Photo documentation",
            "Written report",
          ],
          highlighted: false,
        },
        {
          name: "Repair",
          price: "$350",
          period: "starting at",
          features: [
            "Targeted repair",
            "Material matched",
            "5-year labor warranty",
          ],
          highlighted: false,
        },
        {
          name: "Full Replacement",
          price: "$7,500",
          period: "starting at",
          features: [
            "Full tear-off",
            "Premium shingles",
            "Lifetime warranty",
            "Insurance assistance",
          ],
          highlighted: true,
        },
      ],
    },
    {
      headline: "Common Roofing Questions",
      items: [
        {
          question: "How do I know if I need a repair or full replacement?",
          answer:
            "Our free inspection will tell you exactly. Generally, roofs under 10 years old with localized damage are repairable. Older roofs often benefit more from a full replacement.",
        },
        {
          question: "Does insurance cover roof damage?",
          answer:
            "Most homeowner policies cover storm and hail damage. We'll document the damage for your adjuster and advocate on your behalf.",
        },
        {
          question: "How long does a roof replacement take?",
          answer:
            "Most residential replacements are completed in 1–2 days. We handle permits and cleanup as part of the project.",
        },
      ],
    },
    [
      "Roof Repair",
      "Full Replacement",
      "Storm Damage",
      "Gutters",
      "Inspection",
    ],
  ),
];

// ── DEMO PAGES ────────────────────────────────────────────────────────────────

export const DEMO_LANDING_PAGES: LandingPage[] = [
  {
    id: "page-001",
    tenantId: "tenant-oceanside",
    title: "Oceanside Plumbing — Summer Leak Special",
    slug: "oceanside-summer-special",
    niche: "plumbing",
    status: "published",
    variant: "A",
    sections: NICHE_TEMPLATES[0].sections.map((s) => ({
      ...s,
      id: `p001-${s.type}`,
    })),
    analytics: {
      views: 1247,
      submissions: 89,
      conversionRate: 7.1,
      variantAViews: 1247,
      variantBViews: 0,
      variantASubmissions: 89,
      variantBSubmissions: 0,
    },
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "page-002",
    tenantId: "tenant-oceanside",
    title: "Oceanside Plumbing — Emergency Services",
    slug: "oceanside-emergency",
    niche: "plumbing",
    status: "draft",
    variant: "A",
    sections: NICHE_TEMPLATES[0].sections.map((s) => ({
      ...s,
      id: `p002-${s.type}`,
    })),
    analytics: {
      views: 0,
      submissions: 0,
      conversionRate: 0,
    },
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
];
