// ── Types ──────────────────────────────────────────────────────────────────────

export type NicheId =
  | "plumbing"
  | "hvac"
  | "med-spa"
  | "restoration"
  | "carpet-cleaning"
  | "roofing"
  | "real-estate"
  | "mortgage"
  | "chiropractor"
  | "dental";

export type NicheWebsiteId = string;

export type SectionType =
  | "hero"
  | "services"
  | "stats"
  | "testimonials"
  | "trust"
  | "about"
  | "process"
  | "faq"
  | "contact"
  | "cta_banner"
  | "before_after"
  | "certifications";

export interface NicheWebsiteTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  headingFont: "bold" | "dramatic" | "elegant" | "clean";
  style: "emergency" | "luxury" | "clinical" | "professional" | "warm";
}

export interface NicheWebsiteSection {
  id: string;
  type: SectionType;
  visible: boolean;
  content: Record<string, string | string[] | Record<string, string>[]>;
}

export interface NicheWebsitePage {
  id: string;
  label: string;
  slug: string;
  sections: NicheWebsiteSection[];
}

export interface NicheWebsite {
  id: NicheWebsiteId;
  nicheId: NicheId;
  name: string;
  tagline: string;
  description: string;
  theme: NicheWebsiteTheme;
  colorSwatches: string[];
  /** Legacy single-page: array of sections directly */
  sections: NicheWebsiteSection[];
  /** Multi-page: pages array (takes precedence over sections when present) */
  pages?: NicheWebsitePage[];
}

export interface ClientWebsiteConfig {
  tenantId: string;
  websiteId: NicheWebsiteId;
  isPublished: boolean;
  editingLocked: boolean;
  publishedUrl?: string;
  customizations: {
    businessName?: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    sectionOverrides: Record<string, Record<string, string>>;
    hiddenSections: string[];
  };
  lastUpdated: string;
}

// ── Preview Link Types ─────────────────────────────────────────────────────────

export interface PreviewLink {
  id: string;
  nicheWebsiteId: NicheWebsiteId;
  niche: NicheId;
  styleName: string;
  createdAt: string;
  isActive: boolean;
  label?: string;
}

// ── Website Data ───────────────────────────────────────────────────────────────

export const NICHE_WEBSITES: NicheWebsite[] = [
  // ── PLUMBING ──────────────────────────────────────────────────────────────
  {
    id: "plumbing-emergency",
    nicheId: "plumbing",
    name: "Emergency Response",
    tagline: "Bold, urgent, 24/7 focused",
    description:
      "High-urgency design built for emergency plumbing calls. Red and blue palette with bold CTAs and trust signals front and center.",
    theme: {
      primaryColor: "#1e40af",
      secondaryColor: "#dc2626",
      accentColor: "#facc15",
      bgColor: "#0f172a",
      textColor: "#f1f5f9",
      headingFont: "dramatic",
      style: "emergency",
    },
    colorSwatches: ["#1e40af", "#dc2626", "#facc15"],
    // Legacy flat sections kept for backward compat
    sections: [],
    pages: [
      {
        id: "home",
        label: "Home",
        slug: "/",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "24/7 Emergency Plumber — We're On The Way",
              subheadline:
                "Pipe burst? Drain clogged? Gas leak? Call now. A licensed plumber arrives in 60 minutes or less — guaranteed.",
              cta1: "Call Now — We're On The Way",
              cta2: "Get a Free Estimate",
              badge1: "⚡ 60-Min Response Guarantee",
              badge2: "✅ Licensed & Insured",
              badge3: "🏆 500+ 5-Star Reviews",
              phone: "[Phone]",
            },
          },
          {
            id: "stats",
            type: "stats",
            visible: true,
            content: {
              stats: JSON.stringify([
                { value: "60 Min", label: "Response Time" },
                { value: "500+", label: "Jobs Completed" },
                { value: "4.9★", label: "Google Rating" },
                { value: "24/7", label: "Always Available" },
              ]),
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Emergency Plumbing Services",
              subheading: "Fast fixes for your most urgent plumbing problems",
              services: JSON.stringify([
                {
                  icon: "💧",
                  title: "Burst Pipe Repair",
                  desc: "Immediate response to stop flooding and prevent water damage",
                },
                {
                  icon: "🚿",
                  title: "Drain Cleaning",
                  desc: "High-pressure hydro-jetting clears the toughest clogs fast",
                },
                {
                  icon: "🔧",
                  title: "Water Heater Repair",
                  desc: "Same-day hot water restoration — all brands serviced",
                },
                {
                  icon: "🔥",
                  title: "Gas Leak Response",
                  desc: "Immediate gas line inspection, shutoff, and certified repair",
                },
                {
                  icon: "🏚️",
                  title: "Sewer Backup",
                  desc: "Emergency sewer cleaning and camera inspection",
                },
                {
                  icon: "🔩",
                  title: "Leak Detection",
                  desc: "Advanced camera technology finds hidden leaks behind walls",
                },
              ]),
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "Why [City] Trusts [Business Name]",
              badges: JSON.stringify([
                "Licensed Master Plumber",
                "Google Guaranteed",
                "Same-Day Service",
                "100% Satisfaction Guarantee",
                "No Surprise Fees",
                "BBB Accredited A+",
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "What Our Customers Say",
              testimonials: JSON.stringify([
                {
                  text: "Pipe burst at 2am — they were here in 45 minutes. Saved my hardwood floors from serious damage. These guys are the real deal.",
                  name: "Mike T.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Called three plumbers on a Sunday. [Business Name] was the only one who actually picked up and showed up. Fixed in 2 hours.",
                  name: "Sarah K.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Fair pricing, zero upsells, incredibly professional. Will never call anyone else for as long as I live in [City].",
                  name: "James R.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Pipe Burst? Call Us Right Now.",
              subheading:
                "Every minute matters when a pipe bursts. We answer 24/7, 365 days — no answering machines.",
              cta: "Call [Phone] — We Answer Now",
            },
          },
        ],
      },
      {
        id: "services",
        label: "Services",
        slug: "/services",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Complete Plumbing Services in [City]",
              subheadline:
                "From emergency calls to full system upgrades — licensed plumbers ready for every job.",
              cta1: "Book a Service",
              cta2: "Get a Free Quote",
              badge1: "⚡ Same-Day Available",
              badge2: "✅ Licensed & Insured",
              badge3: "💯 Flat-Rate Pricing",
              phone: "[Phone]",
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Everything We Fix",
              subheading:
                "All residential and light commercial plumbing services",
              services: JSON.stringify([
                {
                  icon: "💧",
                  title: "Burst Pipe Repair",
                  desc: "Emergency stop, repair, and full water damage assessment — from $149",
                },
                {
                  icon: "🚿",
                  title: "Drain Cleaning",
                  desc: "Hydro-jetting and snake service for kitchen, bath, and main line — from $89",
                },
                {
                  icon: "🔧",
                  title: "Water Heater",
                  desc: "Tank and tankless install, repair, and maintenance — free estimate",
                },
                {
                  icon: "🚽",
                  title: "Toilet Repair & Replace",
                  desc: "Running, clogged, leaking, or full replacement — from $95",
                },
                {
                  icon: "🔥",
                  title: "Gas Lines",
                  desc: "Gas leak detection, repair, and new line installation by certified techs",
                },
                {
                  icon: "🏚️",
                  title: "Sewer Service",
                  desc: "Camera inspection, cleaning, and trenchless repair options",
                },
                {
                  icon: "🔩",
                  title: "Leak Detection",
                  desc: "Electronic and acoustic leak detection — find leaks before they worsen",
                },
                {
                  icon: "🏠",
                  title: "Whole-Home Repiping",
                  desc: "Full copper or PEX repipe with minimal disruption — financed options",
                },
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "How It Works",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Call or Text",
                  desc: "Reach us anytime — we answer 24/7, 365 days a year",
                },
                {
                  num: "2",
                  title: "Fast Dispatch",
                  desc: "A licensed plumber heads to you — average 60-min arrival",
                },
                {
                  num: "3",
                  title: "Upfront Quote",
                  desc: "Clear flat-rate price before we touch anything — no surprises",
                },
                {
                  num: "4",
                  title: "Problem Solved",
                  desc: "Fixed right the first time — backed by our 1-year labor warranty",
                },
              ]),
            },
          },
          {
            id: "faq",
            type: "faq",
            visible: true,
            content: {
              heading: "Frequently Asked Questions",
              faqs: JSON.stringify([
                {
                  q: "Do you charge extra for emergency/after-hours calls?",
                  a: "We use transparent flat-rate pricing. You'll always know the full cost before we start work — no surprise add-ons.",
                },
                {
                  q: "Are you licensed and insured in [City]?",
                  a: "Yes — we are fully licensed, bonded, and insured in [City] and surrounding areas. License numbers available on request.",
                },
                {
                  q: "How quickly can you arrive?",
                  a: "Our average response time for emergency calls is under 60 minutes in [City]. Non-emergency same-day slots are also available.",
                },
                {
                  q: "Do you offer a warranty on your work?",
                  a: "Yes — all labor is backed by a 12-month workmanship warranty. Parts carry the manufacturer's warranty.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, check, cash, and offer financing options on larger jobs.",
                },
                {
                  q: "Can you work on older homes with galvanized or cast iron pipes?",
                  a: "Absolutely — our techs are experienced with all pipe materials including galvanized, cast iron, copper, CPVC, and PEX.",
                },
                {
                  q: "Do you provide free estimates?",
                  a: "Yes — we provide written, no-obligation estimates before any work begins.",
                },
                {
                  q: "Do you handle commercial properties?",
                  a: "Yes — we service residential and light commercial properties. Call to discuss your specific needs.",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Ready to Book a Service?",
              subheading:
                "Same-day and emergency slots available. Call now or request a free estimate online.",
              cta: "Book a Service Today",
            },
          },
        ],
      },
      {
        id: "about",
        label: "About",
        slug: "/about",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Family-Owned, Community-Trusted for 15+ Years",
              subheadline:
                "We built [Business Name] on one principle: treat every homeowner's emergency like it's our own. [City] has been our community since day one.",
              cta1: "Call Us Now",
              cta2: "Read Our Reviews",
              badge1: "🏘️ Locally Owned",
              badge2: "✅ Licensed Master Plumber",
              badge3: "💯 15+ Years Serving [City]",
              phone: "[Phone]",
            },
          },
          {
            id: "about",
            type: "about",
            visible: true,
            content: {
              heading: "Our Story",
              body: "[Business Name] was founded in [City] with a simple mission: give homeowners access to an honest, fast, and truly skilled plumber — one who actually picks up the phone at midnight when your basement is flooding. For over 15 years, we've been that plumber for thousands of [City] families. We're licensed master plumbers, Google Guaranteed, and proud members of our local community. Every technician on our team is background-checked, drug-tested, and trained to treat your home with respect. We don't upsell. We don't surprise you with hidden fees. We fix the problem and stand behind our work.",
              founderName: "The [Business Name] Team",
            },
          },
          {
            id: "certifications",
            type: "certifications",
            visible: true,
            content: {
              heading: "Our Licenses & Credentials",
              certs: JSON.stringify([
                "Licensed Master Plumber — State of [City]",
                "Google Guaranteed",
                "BBB Accredited — A+ Rating",
                "Fully Bonded & Insured — $2M Liability",
                "EPA Lead-Safe Certified",
                "Backflow Prevention Certified",
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "Why Homeowners Keep Coming Back",
              testimonials: JSON.stringify([
                {
                  text: "I've called [Business Name] three times over the past few years. Every single visit — on time, professional, fair price. They're simply the best plumbers in [City].",
                  name: "Linda & Tom H.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "They told me I didn't even need the full repair I thought I needed — and saved me $400. You don't find that kind of honesty anywhere anymore.",
                  name: "Carlos M.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Experience the Difference",
              subheading:
                "See why thousands of [City] homeowners trust [Business Name] with their most urgent plumbing needs.",
              cta: "Call [Phone] — Available 24/7",
            },
          },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        slug: "/contact",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Contact Us — We're Ready to Help",
              subheadline:
                "Emergency or scheduled service — we answer every call, every time. Reach us any way that's convenient.",
              cta1: "Call [Phone] Now",
              cta2: "Send a Message",
              badge1: "📞 Live Answers 24/7",
              badge2: "⚡ 60-Min Emergency Response",
              badge3: "✅ Licensed & Insured",
              phone: "[Phone]",
            },
          },
          {
            id: "contact",
            type: "contact",
            visible: true,
            content: {
              heading: "Get in Touch",
              phone: "[Phone]",
              address: "[Address]",
              hours: "24/7 — We Never Close",
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "We Earn Your Trust on Every Job",
              badges: JSON.stringify([
                "Licensed Master Plumber",
                "Google Guaranteed",
                "No-Surprise Pricing",
                "1-Year Labor Warranty",
                "100% Satisfaction Guarantee",
                "Same-Day Service Available",
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "24/7 Emergency Plumbing Line",
              subheading:
                "Don't wait on hold with an answering service. We pick up — day, night, holidays.",
              cta: "Call [Phone] — Real Person, Right Now",
            },
          },
        ],
      },
    ],
  },
  {
    id: "plumbing-local-trust",
    nicheId: "plumbing",
    name: "Local Trust",
    tagline: "Warm, community-focused, reviews-forward",
    description:
      "Community-first design that builds trust through social proof, local identity, and a friendly approachable tone.",
    theme: {
      primaryColor: "#0369a1",
      secondaryColor: "#0891b2",
      accentColor: "#f97316",
      bgColor: "#f8fafc",
      textColor: "#0f172a",
      headingFont: "clean",
      style: "warm",
    },
    colorSwatches: ["#0369a1", "#0891b2", "#f97316"],
    sections: [],
    pages: [
      {
        id: "home",
        label: "Home",
        slug: "/",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline:
                "[City]'s Most Trusted Plumber — Serving Families Since 2008",
              subheadline:
                "Honest pricing. Guaranteed work. Your neighbors' favorite plumber. Get a free estimate today.",
              cta1: "Get a Free Estimate",
              cta2: "Read Our Reviews",
              badge1: "🏘️ Locally Owned & Operated",
              badge2: "💯 Satisfaction Guarantee",
              badge3: "📞 Same-Day Appointments",
              phone: "[Phone]",
            },
          },
          {
            id: "stats",
            type: "stats",
            visible: true,
            content: {
              stats: JSON.stringify([
                { value: "15+", label: "Years in Business" },
                { value: "3,500+", label: "Happy Families" },
                { value: "4.9★", label: "Google Rating" },
                { value: "100%", label: "Satisfaction Rate" },
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "What [City] Homeowners Say",
              testimonials: JSON.stringify([
                {
                  text: "We've used [Business Name] for 8 years. They're the only plumbers we call and the only ones we recommend to every friend and neighbor.",
                  name: "Linda & Tom H.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Super clean, professional, and completely honest. They told me I didn't need a full repair — saved me $300. Rare to find that.",
                  name: "Carlos M.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "These are our neighborhood plumbers. Honestly wouldn't trust anyone else with our home. Showed up on time, fixed it perfectly.",
                  name: "Angela D.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Everything Plumbing, Done Right",
              subheading: "From small repairs to full system upgrades",
              services: JSON.stringify([
                {
                  icon: "🔧",
                  title: "Leak Repairs",
                  desc: "Fast, clean leak fixes with no mess left behind",
                },
                {
                  icon: "🚿",
                  title: "Shower & Tub",
                  desc: "Clog clearing, valve replacement, full remodels",
                },
                {
                  icon: "💧",
                  title: "Water Heater",
                  desc: "Tank and tankless installation, repair, and maintenance",
                },
                {
                  icon: "🚽",
                  title: "Toilets & Sinks",
                  desc: "All makes and models — installed or repaired",
                },
                {
                  icon: "🏠",
                  title: "Whole-Home Plumbing",
                  desc: "Inspections, winterization, and complete replumbing",
                },
                {
                  icon: "🌿",
                  title: "Green Upgrades",
                  desc: "Water-saving fixtures to cut your utility bills",
                },
              ]),
            },
          },
          {
            id: "about",
            type: "about",
            visible: true,
            content: {
              heading: "About [Business Name]",
              body: "We're a family-owned plumbing company that has proudly served [City] and surrounding communities since 2008. We believe homeowners deserve honest plumbers who actually show up on time, do the job right, and never add surprise charges. That belief drives everything we do — and it's why our customers keep coming back.",
              founderName: "The [Business Name] Family",
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Schedule Today — We Make It Easy",
              subheading:
                "Same-day and next-day appointments available in [City] and surrounding areas.",
              cta: "Book Your Appointment",
            },
          },
        ],
      },
      {
        id: "services",
        label: "Services",
        slug: "/services",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "All the Plumbing Services Your Home Needs",
              subheadline:
                "From emergency repairs to planned upgrades — we handle everything with the same care and honesty.",
              cta1: "Schedule Service",
              cta2: "Get a Free Estimate",
              badge1: "🏘️ Locally Owned",
              badge2: "✅ Licensed & Insured",
              badge3: "💯 Free Written Estimates",
              phone: "[Phone]",
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Our Full Service Menu",
              subheading: "Every service comes with our satisfaction guarantee",
              services: JSON.stringify([
                {
                  icon: "🔧",
                  title: "Leak Repairs",
                  desc: "Pipe, fitting, and fixture leaks fixed right — with a written warranty",
                },
                {
                  icon: "🚿",
                  title: "Shower & Tub Service",
                  desc: "Clogs, valve replacement, full shower and tub remodels",
                },
                {
                  icon: "💧",
                  title: "Water Heater",
                  desc: "Tank and tankless installation, same-day repair, and annual tune-ups",
                },
                {
                  icon: "🚽",
                  title: "Toilets & Sinks",
                  desc: "All makes installed or repaired — running, leaking, or not flushing",
                },
                {
                  icon: "🏠",
                  title: "Whole-Home Plumbing",
                  desc: "Inspections, winterization, PRV replacement, and full replumbing",
                },
                {
                  icon: "🌿",
                  title: "Green Plumbing",
                  desc: "Low-flow fixtures and efficiency upgrades to cut your water bills",
                },
                {
                  icon: "🚰",
                  title: "Water Filtration",
                  desc: "Whole-home and under-sink water filtration and softener systems",
                },
                {
                  icon: "🏚️",
                  title: "Sewer & Drain",
                  desc: "Camera inspection, hydro-jetting, and trenchless sewer repairs",
                },
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "Our Simple, Honest Process",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Call or Book Online",
                  desc: "Reach us by phone or our easy online booking — we respond fast",
                },
                {
                  num: "2",
                  title: "Free Estimate",
                  desc: "We assess the job and give you a written estimate before any work",
                },
                {
                  num: "3",
                  title: "You Approve",
                  desc: "No work begins until you review and approve the price — no surprises",
                },
                {
                  num: "4",
                  title: "Done Right",
                  desc: "We fix it, clean up completely, and back it with our guarantee",
                },
                {
                  num: "5",
                  title: "We Follow Up",
                  desc: "We check in after the job to make sure you're fully satisfied",
                },
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "Service Stories from [City] Families",
              testimonials: JSON.stringify([
                {
                  text: "They replaced my water heater in under 3 hours. Price was fair, crew was clean, and they even swept out the garage after. Outstanding.",
                  name: "Robert P.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "I had three different plumbers try to fix my drain over two years. [Business Name] found the real issue in 20 minutes and fixed it permanently.",
                  name: "Maria S.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "faq",
            type: "faq",
            visible: true,
            content: {
              heading: "Common Questions",
              faqs: JSON.stringify([
                {
                  q: "Do you offer free estimates?",
                  a: "Yes — we provide upfront, written estimates at no charge before any work begins.",
                },
                {
                  q: "Do you work on weekends?",
                  a: "We offer Saturday appointments and emergency services on Sundays for urgent situations.",
                },
                {
                  q: "Is your work guaranteed?",
                  a: "Yes — all labor is backed by a 12-month guarantee. If something isn't right, we come back and fix it at no charge.",
                },
                {
                  q: "How long have you served [City]?",
                  a: "We've been proudly serving [City] and surrounding communities since 2008 — over 15 years.",
                },
                {
                  q: "Do you handle emergencies?",
                  a: "Yes — we offer 24/7 emergency service for urgent situations like burst pipes, gas leaks, and sewer backups.",
                },
                {
                  q: "What areas do you serve?",
                  a: "We serve [City] and all surrounding towns within a 30-mile radius. Call to confirm your area.",
                },
                {
                  q: "Do you offer financing?",
                  a: "Yes — we offer financing options on larger jobs like water heater replacement and whole-home repiping.",
                },
                {
                  q: "Can I see your license?",
                  a: "Absolutely — we're fully licensed, bonded, and insured. License numbers are on every invoice and available on request.",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Get Your Free Estimate Today",
              subheading:
                "No pressure, no obligation — just an honest assessment and a fair price.",
              cta: "Book a Free Estimate",
            },
          },
        ],
      },
      {
        id: "about",
        label: "About",
        slug: "/about",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Meet the Team Behind [Business Name]",
              subheadline:
                "We've been [City]'s trusted neighborhood plumbers since 2008. Locally owned, family operated, community driven.",
              cta1: "Meet Our Team",
              cta2: "Read Our Story",
              badge1: "🏘️ Locally Owned",
              badge2: "15+ Years",
              badge3: "3,500+ Families Served",
              phone: "[Phone]",
            },
          },
          {
            id: "about",
            type: "about",
            visible: true,
            content: {
              heading: "Our Story",
              body: "We started [Business Name] because we believed [City] deserved a plumbing company that genuinely cared. Not one that upsells, not one that disappears after the job, not one that sends unlicensed subcontractors — a real local company with real people who stand behind their work. For over 15 years, we've built our reputation one satisfied homeowner at a time. Our team lives in this community, sends their kids to these schools, and shops at these same stores. We're not just your plumbers — we're your neighbors.",
              founderName: "— [Business Name] Family",
            },
          },
          {
            id: "certifications",
            type: "certifications",
            visible: true,
            content: {
              heading: "Licensed, Insured & Accredited",
              certs: JSON.stringify([
                "Licensed Master Plumber",
                "BBB Accredited — A+ Rating",
                "Fully Bonded & Insured",
                "Google Guaranteed",
                "Background-Checked Technicians",
                "EPA Lead-Safe Certified",
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "What Our Neighbors Say",
              testimonials: JSON.stringify([
                {
                  text: "I've lived in [City] for 22 years and tried every plumber. None come close to [Business Name]. Professional, honest, and they actually care about you.",
                  name: "Barbara W.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "My water heater failed the week before Thanksgiving. They had it replaced the same day. The crew was respectful, efficient, and genuinely kind.",
                  name: "Tom & Irene L.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Three generations of my family use [Business Name]. My parents, me, and now my kids. That tells you everything.",
                  name: "David K.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Become Part of the Family",
              subheading:
                "Join thousands of [City] homeowners who trust [Business Name] with their most important investment.",
              cta: "Schedule Your First Appointment",
            },
          },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        slug: "/contact",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "We'd Love to Hear From You",
              subheadline:
                "Questions, estimates, or scheduling — our friendly team is ready to help. No automated menus, no runaround.",
              cta1: "Call Us Today",
              cta2: "Send a Message",
              badge1: "📞 Real People Answer",
              badge2: "Same-Day Scheduling Available",
              badge3: "Free Written Estimates",
              phone: "[Phone]",
            },
          },
          {
            id: "contact",
            type: "contact",
            visible: true,
            content: {
              heading: "Contact [Business Name]",
              phone: "[Phone]",
              address: "[Address]",
              hours: "Mon–Sat 7am–7pm | Emergency: 24/7",
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "Why Families Choose Us",
              badges: JSON.stringify([
                "Licensed Master Plumber",
                "Free Written Estimates",
                "No-Surprise Pricing",
                "12-Month Labor Warranty",
                "100% Satisfaction Guarantee",
                "Locally Owned Since 2008",
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Ready to Schedule?",
              subheading: "Same-day and next-day appointments available.",
              cta: "Book Your Appointment Now",
            },
          },
        ],
      },
    ],
  },

  // ── HVAC ──────────────────────────────────────────────────────────────────
  {
    id: "hvac-seasonal-comfort",
    nicheId: "hvac",
    name: "Seasonal Comfort",
    tagline: "Comfort-focused, seasonal imagery",
    description:
      "A warm and lifestyle-oriented HVAC website built around home comfort, seasonal messaging, and energy savings.",
    theme: {
      primaryColor: "#0ea5e9",
      secondaryColor: "#f97316",
      accentColor: "#22d3ee",
      bgColor: "#f0f9ff",
      textColor: "#0c4a6e",
      headingFont: "clean",
      style: "warm",
    },
    colorSwatches: ["#0ea5e9", "#f97316", "#22d3ee"],
    sections: [
      {
        id: "hero",
        type: "hero",
        visible: true,
        content: {
          headline: "Year-Round Comfort for Your [City] Home — Guaranteed",
          subheadline:
            "Expert heating, cooling, and air quality solutions. Always comfortable, always efficient.",
          cta1: "Schedule a Tune-Up",
          cta2: "Get a Free Quote",
          badge1: "❄️ AC Specialists",
          badge2: "🔥 Heating Experts",
          badge3: "⭐ 800+ Reviews",
          phone: "[Phone]",
        },
      },
      {
        id: "stats",
        type: "stats",
        visible: true,
        content: {
          stats: JSON.stringify([
            { value: "20+", label: "Years Experience" },
            { value: "800+", label: "5-Star Reviews" },
            { value: "4hr", label: "Avg Response" },
            { value: "All", label: "Major Brands" },
          ]),
        },
      },
      {
        id: "services",
        type: "services",
        visible: true,
        content: {
          heading: "HVAC Services for Every Season",
          subheading: "Keep your home comfortable all year long",
          services: JSON.stringify([
            {
              icon: "❄️",
              title: "AC Installation",
              desc: "Energy-efficient systems matched to your home's needs",
            },
            {
              icon: "🔧",
              title: "AC Repair",
              desc: "Same-day diagnosis and repair for all major brands",
            },
            {
              icon: "🔥",
              title: "Heating Installation",
              desc: "Furnaces, heat pumps, and boilers installed right",
            },
            {
              icon: "🛠️",
              title: "Heating Repair",
              desc: "Fast heat restoration when you need it most",
            },
            {
              icon: "🌬️",
              title: "Air Quality",
              desc: "Filtration, humidifiers, and UV purification systems",
            },
            {
              icon: "📋",
              title: "Maintenance Plans",
              desc: "Annual tune-ups to extend system life and reduce costs",
            },
          ]),
        },
      },
      {
        id: "testimonials",
        type: "testimonials",
        visible: true,
        content: {
          heading: "Happy Customers Across [City]",
          testimonials: JSON.stringify([
            {
              text: "AC went out in 98-degree heat. [Business Name] had it fixed in under 3 hours. Absolutely incredible service.",
              name: "Rebecca L.",
              city: "[City]",
              stars: "5",
            },
            {
              text: "Signed up for their maintenance plan and my energy bill dropped 22% this year. Worth every penny.",
              name: "David K.",
              city: "[City]",
              stars: "5",
            },
            {
              text: "Professional, clean, and honest. They told me my old unit could be repaired instead of replaced. Trustworthy team.",
              name: "Maria S.",
              city: "[City]",
              stars: "5",
            },
          ]),
        },
      },
      {
        id: "process",
        type: "process",
        visible: true,
        content: {
          heading: "Our Simple 4-Step Process",
          steps: JSON.stringify([
            {
              num: "1",
              title: "Call or Book Online",
              desc: "Tell us your issue — we'll schedule you quickly",
            },
            {
              num: "2",
              title: "Free Diagnosis",
              desc: "Our tech identifies the issue and explains your options",
            },
            {
              num: "3",
              title: "Clear Pricing",
              desc: "Upfront quote before any work — no surprises",
            },
            {
              num: "4",
              title: "Comfort Restored",
              desc: "Job done right — backed by our satisfaction guarantee",
            },
          ]),
        },
      },
      {
        id: "cta_banner",
        type: "cta_banner",
        visible: true,
        content: {
          heading: "Beat the Heat — Book Your AC Tune-Up Today",
          subheading:
            "Limited slots available. Don't wait until your system breaks down.",
          cta: "Schedule Now — Limited Availability",
        },
      },
      {
        id: "contact",
        type: "contact",
        visible: true,
        content: {
          heading: "Contact [Business Name]",
          phone: "[Phone]",
          address: "[Address]",
          hours: "Mon–Fri 7am–6pm | Emergency After-Hours Available",
        },
      },
    ],
  },
  {
    id: "hvac-technical-authority",
    nicheId: "hvac",
    name: "Technical Authority",
    tagline: "Certifications-forward, clean, professional",
    description:
      "A precision-focused HVAC brand emphasizing certifications, expertise, and technical excellence.",
    theme: {
      primaryColor: "#1d4ed8",
      secondaryColor: "#0f172a",
      accentColor: "#06b6d4",
      bgColor: "#f8fafc",
      textColor: "#1e293b",
      headingFont: "bold",
      style: "professional",
    },
    colorSwatches: ["#1d4ed8", "#0f172a", "#06b6d4"],
    sections: [
      {
        id: "hero",
        type: "hero",
        visible: true,
        content: {
          headline: "NATE-Certified HVAC Technicians Serving [City]",
          subheadline:
            "Precision installations, expert diagnostics, and manufacturer-backed warranties on every job.",
          cta1: "Request Service",
          cta2: "View Certifications",
          badge1: "🏅 NATE Certified",
          badge2: "✅ Factory Trained",
          badge3: "🔐 Fully Licensed",
          phone: "[Phone]",
        },
      },
      {
        id: "stats",
        type: "stats",
        visible: true,
        content: {
          stats: JSON.stringify([
            { value: "NATE", label: "Certified Techs" },
            { value: "25+", label: "Brands Serviced" },
            { value: "98%", label: "First-Visit Fix" },
            { value: "10yr", label: "Avg System Life" },
          ]),
        },
      },
      {
        id: "certifications",
        type: "certifications",
        visible: true,
        content: {
          heading: "Our Certifications & Credentials",
          certs: JSON.stringify([
            "NATE Certified",
            "EPA 608 Certified",
            "Carrier Factory Authorized",
            "Trane Comfort Specialist",
            "ACCA Member",
            "State Licensed & Bonded",
          ]),
        },
      },
      {
        id: "services",
        type: "services",
        visible: true,
        content: {
          heading: "Commercial & Residential HVAC",
          subheading: "Precision work on all makes and models",
          services: JSON.stringify([
            {
              icon: "❄️",
              title: "System Design",
              desc: "Manual J load calculations for optimal system sizing",
            },
            {
              icon: "🔧",
              title: "Precision Repairs",
              desc: "Diagnostic-first approach — no guesswork, no upsells",
            },
            {
              icon: "📊",
              title: "Energy Audits",
              desc: "Identify inefficiencies and reduce operating costs",
            },
            {
              icon: "🌬️",
              title: "Duct Analysis",
              desc: "Pressure testing and duct sealing for peak performance",
            },
            {
              icon: "🏢",
              title: "Commercial HVAC",
              desc: "Rooftop units, chillers, and building automation",
            },
            {
              icon: "📋",
              title: "Preventive Maintenance",
              desc: "Scheduled service agreements for zero surprises",
            },
          ]),
        },
      },
      {
        id: "testimonials",
        type: "testimonials",
        visible: true,
        content: {
          heading: "Trusted by [City] Homeowners & Businesses",
          testimonials: JSON.stringify([
            {
              text: "I've worked with a lot of HVAC companies. [Business Name] is in a different league — certified, thorough, and technically excellent.",
              name: "Thomas B.",
              city: "[City]",
              stars: "5",
            },
            {
              text: "They designed and installed our commercial system from scratch. On time, on budget, and it performs perfectly.",
              name: "Karen W.",
              city: "[City]",
              stars: "5",
            },
          ]),
        },
      },
      {
        id: "cta_banner",
        type: "cta_banner",
        visible: true,
        content: {
          heading: "Schedule a Diagnostic With a Certified Technician",
          subheading: "No guesswork. No upsells. Just expert HVAC service.",
          cta: "Book a Service Call",
        },
      },
      {
        id: "contact",
        type: "contact",
        visible: true,
        content: {
          heading: "Contact Our Team",
          phone: "[Phone]",
          address: "[Address]",
          hours: "Mon–Fri 8am–5pm | Emergency 24/7",
        },
      },
    ],
  },

  // ── MED SPA ───────────────────────────────────────────────────────────────
  {
    id: "med-spa-luxury-results",
    nicheId: "med-spa",
    name: "Luxury & Results",
    tagline: "Dark, elegant, before/after focused",
    description:
      "A premium dark-themed med spa site that communicates luxury, transformation, and clinical expertise.",
    theme: {
      primaryColor: "#c9a96e",
      secondaryColor: "#1e1b2e",
      accentColor: "#9b59b6",
      bgColor: "#0a0a0f",
      textColor: "#f5f3ff",
      headingFont: "elegant",
      style: "luxury",
    },
    colorSwatches: ["#c9a96e", "#9b59b6", "#1e1b2e"],
    sections: [],
    pages: [
      {
        id: "home",
        label: "Home",
        slug: "/",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Your Most Confident Self Starts Here",
              subheadline:
                "Medical-grade aesthetic treatments in a luxury setting. Transformative results. Exceptional care. Book your complimentary consultation.",
              cta1: "Book a Consultation",
              cta2: "Explore Treatments",
              badge1: "⭐ Award-Winning Med Spa",
              badge2: "🏥 Medical Director on Staff",
              badge3: "✨ 500+ Transformations",
              phone: "[Phone]",
            },
          },
          {
            id: "before_after",
            type: "before_after",
            visible: true,
            content: {
              heading: "Real Results, Real Clients",
              subheading:
                "Every transformation is as unique as the person. Here are a few of our favorites.",
              disclaimer:
                "Individual results may vary. Photos with client permission.",
              treatments: JSON.stringify([
                { label: "Botox — Forehead Lines & Crow's Feet" },
                { label: "Lip Fillers — Natural Volume Enhancement" },
                { label: "Laser Resurfacing — Skin Tone & Texture" },
              ]),
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Signature Treatments",
              subheading: "Medical-grade results. Luxurious experience.",
              services: JSON.stringify([
                {
                  icon: "💉",
                  title: "Botox & Dysport",
                  desc: "Smooth fine lines and wrinkles with precision injections from certified injectors",
                },
                {
                  icon: "✨",
                  title: "Dermal Fillers",
                  desc: "Restore volume, define contours, and rejuvenate with natural-looking results",
                },
                {
                  icon: "🌟",
                  title: "Laser Skin Resurfacing",
                  desc: "Advanced laser treatments for tone, texture, pigmentation, and clarity",
                },
                {
                  icon: "💫",
                  title: "Body Contouring",
                  desc: "Non-surgical fat reduction and skin tightening with CoolSculpting and RF",
                },
                {
                  icon: "🧴",
                  title: "Microneedling",
                  desc: "Collagen induction therapy for smoother, firmer, more radiant skin",
                },
                {
                  icon: "💎",
                  title: "Chemical Peels",
                  desc: "Medical-grade peels for luminous, refined skin with zero downtime options",
                },
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "Client Love",
              testimonials: JSON.stringify([
                {
                  text: "I've tried many med spas. [Business Name] is on another level entirely. The staff is brilliant, the atmosphere is stunning, and my results have been life-changing.",
                  name: "Ashley M.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "I was nervous about fillers for years. One consultation here and I felt completely at ease. The results are so natural — I look refreshed, not 'done.'",
                  name: "Jennifer C.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Best investment I have ever made in myself. The team genuinely cares about your results, not just the sale. I refer everyone I know.",
                  name: "Rachel T.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "The [Business Name] Standard",
              badges: JSON.stringify([
                "Board Certified Medical Director",
                "FDA Approved Treatments Only",
                "HIPAA Compliant Facility",
                "5-Star Client Experience",
                "Complimentary Consultations",
                "AmSpa Member",
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Book Your Consultation Today",
              subheading:
                "New client consultations available this week. Complimentary. Confidential. No obligation.",
              cta: "Reserve Your Consultation",
            },
          },
        ],
      },
      {
        id: "services",
        label: "Services",
        slug: "/services",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Our Treatment Menu",
              subheadline:
                "Curated, evidence-based treatments delivered with the artistry and care you deserve.",
              cta1: "Book a Treatment",
              cta2: "View Pricing",
              badge1: "✨ FDA-Approved Treatments",
              badge2: "🏥 Medical Director Supervised",
              badge3: "💯 Natural Results",
              phone: "[Phone]",
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "All Treatments",
              subheading:
                "Every treatment is personalized to your goals and anatomy",
              services: JSON.stringify([
                {
                  icon: "💉",
                  title: "Botox & Dysport",
                  desc: "Forehead lines, crow's feet, brow lift, lip flip, neck bands — from $12/unit",
                },
                {
                  icon: "✨",
                  title: "Dermal Fillers",
                  desc: "Lips, cheeks, jawline, under-eye, nose — Juvederm, Restylane, Sculptra",
                },
                {
                  icon: "🌟",
                  title: "Laser Skin Resurfacing",
                  desc: "Fractional CO2, IPL, and BBL for pigmentation, redness, and texture",
                },
                {
                  icon: "💫",
                  title: "Body Contouring",
                  desc: "CoolSculpting, truSculpt, Emsculpt, and radiofrequency tightening",
                },
                {
                  icon: "🧴",
                  title: "Microneedling",
                  desc: "Standard and RF microneedling — with optional PRP for enhanced results",
                },
                {
                  icon: "💎",
                  title: "Chemical Peels",
                  desc: "Superficial, medium, and deep peels customized to your skin type",
                },
                {
                  icon: "🔬",
                  title: "Skin Analysis & Planning",
                  desc: "Advanced imaging and AI-assisted treatment planning for optimal results",
                },
                {
                  icon: "💊",
                  title: "IV Wellness Therapy",
                  desc: "Vitamin infusions for radiance, immunity, energy, and recovery",
                },
                {
                  icon: "🌸",
                  title: "Medical-Grade Facials",
                  desc: "HydraFacial, oxygen infusion, and custom pharmaceutical-grade protocols",
                },
                {
                  icon: "⚡",
                  title: "Hair Restoration",
                  desc: "PRP and Exosome therapy for hair thinning and loss — natural and effective",
                },
              ]),
            },
          },
          {
            id: "before_after",
            type: "before_after",
            visible: true,
            content: {
              heading: "Treatment Results",
              subheading: "Real outcomes for real clients — no filters.",
              disclaimer:
                "Individual results may vary. With client permission.",
              treatments: JSON.stringify([
                { label: "Botox — Forehead Lines" },
                { label: "Dermal Fillers — Lips & Cheeks" },
                { label: "Laser Resurfacing — Skin Tone" },
                { label: "Body Contouring — Abdomen" },
              ]),
            },
          },
          {
            id: "faq",
            type: "faq",
            visible: true,
            content: {
              heading: "Treatment Questions",
              faqs: JSON.stringify([
                {
                  q: "Is the consultation really free?",
                  a: "Yes — all new client consultations are complimentary. We'll discuss your goals, review your options, and create a personalized plan with zero pressure.",
                },
                {
                  q: "How long do results last?",
                  a: "It depends on the treatment. Botox typically lasts 3–4 months. Fillers last 6–24 months. Laser and skin resurfacing results are long-lasting with proper maintenance.",
                },
                {
                  q: "Are your treatments safe?",
                  a: "All treatments are FDA-approved or FDA-cleared and performed under the supervision of our board-certified medical director.",
                },
                {
                  q: "What is the downtime?",
                  a: "Many treatments have minimal to no downtime. We'll review expected downtime during your consultation so you can plan accordingly.",
                },
                {
                  q: "Do you offer financing?",
                  a: "Yes — we offer CareCredit and Affirm financing options to make treatments accessible. Ask our team for details.",
                },
                {
                  q: "How do I know which treatment is right for me?",
                  a: "That's exactly what your complimentary consultation is for. We assess your skin, discuss your goals, and recommend the best personalized plan.",
                },
                {
                  q: "Do you use brand-name products?",
                  a: "Yes — we use exclusively FDA-approved, brand-name injectables and clinical-grade devices. We never use off-label or unverified products.",
                },
                {
                  q: "Will I look natural?",
                  a: "Natural results are our philosophy. Our goal is always to enhance your features, not change them. Refreshed, not 'done.'",
                },
                {
                  q: "Do you offer packages?",
                  a: "Yes — we offer curated treatment packages and loyalty programs. Ask during your consultation.",
                },
                {
                  q: "Is there a medical director on staff?",
                  a: "Yes — a board-certified medical director oversees all treatments and is available for complex consultations.",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Book Your Treatment",
              subheading:
                "Limited appointments available this week. Reserve your spot today.",
              cta: "Book a Treatment Now",
            },
          },
        ],
      },
      {
        id: "about",
        label: "About",
        slug: "/about",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Our Story",
              subheadline:
                "We founded [Business Name] because we believed every person deserves to look and feel their absolute best — with treatments that are safe, effective, and beautiful.",
              cta1: "Meet Our Team",
              cta2: "Book a Consultation",
              badge1: "Board Certified Medical Director",
              badge2: "10+ Years in Aesthetic Medicine",
              badge3: "500+ Transformations",
              phone: "[Phone]",
            },
          },
          {
            id: "about",
            type: "about",
            visible: true,
            content: {
              heading: "The [Business Name] Philosophy",
              body: "[Business Name] was born from a simple but powerful belief: aesthetic medicine should be artful, evidence-based, and deeply personal. Our founding medical director has spent over a decade perfecting the intersection of science and beauty — building a practice where every client receives a bespoke treatment plan, premium products, and the kind of attentive care that makes the experience as transformative as the results. We don't upsell. We don't rush consultations. We treat every face as a unique canvas and every client as a long-term relationship.",
              founderName: "— The [Business Name] Medical Team",
            },
          },
          {
            id: "certifications",
            type: "certifications",
            visible: true,
            content: {
              heading: "Credentials, Memberships & Standards",
              certs: JSON.stringify([
                "Board Certified Medical Director",
                "American Med Spa Association Member",
                "OSHA Compliant Facility",
                "HIPAA Compliant",
                "FDA-Approved Treatments Only",
                "Licensed Aesthetic Nurses on Staff",
                "Annual Advanced Training — All Injectors",
                "CoolSculpting Certified Providers",
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "What Our Clients Say",
              testimonials: JSON.stringify([
                {
                  text: "The consultation alone was worth it. No pressure, no hard sell — just genuine guidance about what would look best for my face. I've been a client for three years.",
                  name: "Diana L.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "I've been to 4 med spas in [City]. [Business Name] is the only one where I felt like the provider truly understood what I wanted. My results are exactly what I envisioned.",
                  name: "Victoria H.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Incredible team, beautiful space, and results that consistently exceed expectations. This is the standard every med spa should be held to.",
                  name: "Claire S.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Come Meet Us",
              subheading:
                "Your complimentary consultation is the beginning of your best self.",
              cta: "Reserve Your Consultation",
            },
          },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        slug: "/contact",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Book a Consultation",
              subheadline:
                "All new client consultations are complimentary. Our team is ready to create your personalized plan.",
              cta1: "Book a Consultation",
              cta2: "Call Us",
              badge1: "✨ Complimentary Consultation",
              badge2: "Private & Confidential",
              badge3: "📞 Same-Week Availability",
              phone: "[Phone]",
            },
          },
          {
            id: "contact",
            type: "contact",
            visible: true,
            content: {
              heading: "Reach Us",
              phone: "[Phone]",
              address: "[Address]",
              hours: "Mon–Fri 9am–6pm | Sat 10am–4pm",
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "Our Commitment to You",
              badges: JSON.stringify([
                "Board Certified Medical Director",
                "HIPAA Compliant",
                "FDA-Approved Treatments",
                "Complimentary Consultations",
                "No-Pressure Environment",
                "5-Star Client Experience",
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Ready to Begin Your Transformation?",
              subheading:
                "Reserve your consultation this week — complimentary, private, and personalized.",
              cta: "Book Your Consultation",
            },
          },
        ],
      },
    ],
  },
  {
    id: "med-spa-clean-clinical",
    nicheId: "med-spa",
    name: "Clean & Clinical",
    tagline: "White, modern, science-backed",
    description:
      "A clean, bright, medically authoritative design emphasizing safety, expertise, and evidence-based treatments.",
    theme: {
      primaryColor: "#0284c7",
      secondaryColor: "#f0f9ff",
      accentColor: "#7c3aed",
      bgColor: "#ffffff",
      textColor: "#0f172a",
      headingFont: "clean",
      style: "clinical",
    },
    colorSwatches: ["#0284c7", "#f0f9ff", "#7c3aed"],
    sections: [],
    pages: [
      {
        id: "home",
        label: "Home",
        slug: "/",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Evidence-Based Aesthetics. Real Results.",
              subheadline:
                "Physician-supervised aesthetic medicine with proven protocols and measurable outcomes. Schedule your clinical consultation today.",
              cta1: "Schedule a Consultation",
              cta2: "View Our Treatments",
              badge1: "🏥 Medical Director Led",
              badge2: "📋 Evidence-Based Protocols",
              badge3: "🔬 Clinical-Grade Results",
              phone: "[Phone]",
            },
          },
          {
            id: "stats",
            type: "stats",
            visible: true,
            content: {
              stats: JSON.stringify([
                { value: "2,500+", label: "Treatments Performed" },
                { value: "12yr", label: "Clinical Experience" },
                { value: "98%", label: "Satisfaction Rate" },
                { value: "MD", label: "Supervised Care" },
              ]),
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Evidence-Based Treatments",
              subheading:
                "Every treatment we offer is clinically proven, FDA-approved, and medically supervised",
              services: JSON.stringify([
                {
                  icon: "💉",
                  title: "Injectable Treatments",
                  desc: "FDA-approved neurotoxins and hyaluronic acid fillers with precision technique",
                },
                {
                  icon: "🌟",
                  title: "Energy-Based Devices",
                  desc: "Laser, radiofrequency, and ultrasound for tightening and rejuvenation",
                },
                {
                  icon: "🧴",
                  title: "Physician Facials",
                  desc: "Medical-grade chemical peels and evidence-based skin protocols",
                },
                {
                  icon: "💫",
                  title: "Body Aesthetics",
                  desc: "Non-surgical body contouring with documented fat reduction outcomes",
                },
                {
                  icon: "💊",
                  title: "Hormone Wellness",
                  desc: "Lab-tested, physician-managed hormone optimization programs",
                },
                {
                  icon: "🔬",
                  title: "Skin Analysis",
                  desc: "Advanced imaging and biomarker testing to baseline and track your skin health",
                },
              ]),
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "Clinical Standards You Can Trust",
              badges: JSON.stringify([
                "Medical Director Led",
                "Clinical Grade Products",
                "Evidence-Based Protocols",
                "HIPAA Compliant",
                "FDA-Approved Treatments",
                "Annual Provider Recertification",
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "Patient Experiences",
              testimonials: JSON.stringify([
                {
                  text: "As a physician myself, I was skeptical about med spas. [Business Name] exceeded every expectation — evidence-based, professionally delivered, and genuinely effective.",
                  name: "Dr. Patricia L.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "No pressure, no overselling. Just a clear clinical consultation and a treatment plan that actually worked. Rare in this industry.",
                  name: "Megan R.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "I tracked my skin metrics before and after — genuinely measurable improvement. This isn't a spa, it's a medical practice that happens to also be beautiful.",
                  name: "Susan T.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Ready to Start? Book a Clinical Consultation",
              subheading:
                "Evidence-based, physician-supervised, and personalized to your skin health goals.",
              cta: "Schedule a Consultation",
            },
          },
        ],
      },
      {
        id: "services",
        label: "Services",
        slug: "/services",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Our Clinical Treatment Menu",
              subheadline:
                "Every treatment is selected for its clinical evidence, safety profile, and proven outcomes.",
              cta1: "Book a Consultation",
              cta2: "View Protocols",
              badge1: "FDA-Approved",
              badge2: "Physician Supervised",
              badge3: "Evidence-Based",
              phone: "[Phone]",
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Clinical Treatments",
              subheading: "Protocols grounded in peer-reviewed research",
              services: JSON.stringify([
                {
                  icon: "💉",
                  title: "Neurotoxin Injections",
                  desc: "Botox, Dysport, Xeomin — administered by certified injectors with physician oversight",
                },
                {
                  icon: "✨",
                  title: "Hyaluronic Acid Fillers",
                  desc: "Juvederm and Restylane collections for volumization and contouring",
                },
                {
                  icon: "🌟",
                  title: "Laser Resurfacing",
                  desc: "Fractional ablative and non-ablative laser with documented outcome tracking",
                },
                {
                  icon: "💫",
                  title: "Body Contouring",
                  desc: "CoolSculpting with 3D imaging for pre/post measurement of fat reduction",
                },
                {
                  icon: "🔬",
                  title: "Microneedling + PRP",
                  desc: "Collagen induction therapy with platelet-rich plasma for accelerated repair",
                },
                {
                  icon: "🧴",
                  title: "Medical Peels",
                  desc: "TCA, Jessner, and glycolic peels matched precisely to your Fitzpatrick type",
                },
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "The Clinical Process",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Clinical Consultation",
                  desc: "Medical history review, skin analysis, and goal-setting with your provider",
                },
                {
                  num: "2",
                  title: "Treatment Plan",
                  desc: "Evidence-based protocol designed for your specific skin type and goals",
                },
                {
                  num: "3",
                  title: "Treatment",
                  desc: "Procedure performed by certified provider under physician supervision",
                },
                {
                  num: "4",
                  title: "Follow-Up & Tracking",
                  desc: "Outcome measurements, follow-up appointments, and plan adjustments",
                },
              ]),
            },
          },
          {
            id: "faq",
            type: "faq",
            visible: true,
            content: {
              heading: "Clinical Questions",
              faqs: JSON.stringify([
                {
                  q: "What does 'evidence-based' mean for aesthetics?",
                  a: "It means every treatment we offer has been clinically studied, FDA-approved or cleared, and has documented safety and efficacy data. We don't offer trendy treatments without clinical backing.",
                },
                {
                  q: "Is there a physician on site?",
                  a: "A board-certified medical director oversees all treatment protocols and is available for complex consultations and treatment planning.",
                },
                {
                  q: "How do you measure results?",
                  a: "We use advanced imaging tools to baseline your skin before treatment and track measurable improvements across multiple metrics over time.",
                },
                {
                  q: "Do you use brand-name injectables?",
                  a: "Yes — we use exclusively FDA-approved, brand-name products sourced directly from licensed distributors. We never use compounded or gray-market products.",
                },
                {
                  q: "What is the consultation process?",
                  a: "Your consultation includes a medical history review, skin analysis imaging, and a personalized treatment plan with full informed consent documentation.",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Book Your Clinical Consultation",
              subheading:
                "Start with a comprehensive skin assessment and evidence-based treatment plan.",
              cta: "Schedule Now",
            },
          },
        ],
      },
      {
        id: "about",
        label: "About",
        slug: "/about",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Our Clinical Team",
              subheadline:
                "Board-certified physicians, licensed aesthetic nurses, and certified technicians — all committed to evidence-based outcomes.",
              cta1: "Meet Our Team",
              cta2: "Book a Consultation",
              badge1: "MD Supervised",
              badge2: "12+ Years Experience",
              badge3: "2,500+ Treatments",
              phone: "[Phone]",
            },
          },
          {
            id: "about",
            type: "about",
            visible: true,
            content: {
              heading: "Our Philosophy",
              body: "At [Business Name], we believe aesthetic medicine should be held to the same rigorous standards as any other branch of medicine. Our founding medical director built this practice on evidence — not trends, not marketing, not social media aesthetics. Every protocol we use has been validated by clinical research. Every product meets FDA approval standards. Every provider is certified, trained, and mentored continuously. We measure outcomes, track results, and hold ourselves accountable. Because you deserve more than a good sales pitch. You deserve a treatment plan that actually works.",
              founderName: "— The [Business Name] Clinical Team",
            },
          },
          {
            id: "certifications",
            type: "certifications",
            visible: true,
            content: {
              heading: "Credentials & Clinical Standards",
              certs: JSON.stringify([
                "Board Certified Medical Director",
                "American Med Spa Association Member",
                "OSHA Compliant Clinical Facility",
                "HIPAA Compliant",
                "FDA-Approved Treatments Only",
                "Licensed RN Injectors",
                "CoolSculpting University Certified",
                "Annual Advanced Injection Training",
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "Patient Stories",
              testimonials: JSON.stringify([
                {
                  text: "I specifically chose [Business Name] because of their clinical approach. No fluff, no upsell — just a thorough consultation, a science-backed plan, and results that I can actually see in photos.",
                  name: "Katherine W.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "I trust these providers completely. They've turned down treatments that weren't right for me twice. That kind of integrity is everything.",
                  name: "James P.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Meet the Team Behind Your Results",
              subheading:
                "Start with a complimentary clinical consultation — evidence-based, no pressure.",
              cta: "Schedule a Consultation",
            },
          },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        slug: "/contact",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Schedule a Clinical Consultation",
              subheadline:
                "Our clinical coordinator will guide you through scheduling and pre-consultation intake.",
              cta1: "Book Now",
              cta2: "Call Us",
              badge1: "📋 New Patient Intake Available",
              badge2: "Private & Confidential",
              badge3: "Same-Week Availability",
              phone: "[Phone]",
            },
          },
          {
            id: "contact",
            type: "contact",
            visible: true,
            content: {
              heading: "Contact [Business Name]",
              phone: "[Phone]",
              address: "[Address]",
              hours: "Mon–Fri 8am–5pm | Sat by Appointment",
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "Clinical Commitment",
              badges: JSON.stringify([
                "Board Certified Medical Director",
                "HIPAA Compliant",
                "FDA-Approved Treatments",
                "Evidence-Based Protocols",
                "No-Pressure Consultations",
                "Outcome Tracking Included",
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Ready to Start Your Clinical Aesthetic Journey?",
              subheading:
                "Evidence-based, physician-supervised, and personalized to your goals.",
              cta: "Schedule a Consultation",
            },
          },
        ],
      },
    ],
  },

  // ── RESTORATION ───────────────────────────────────────────────────────────
  {
    id: "restoration-crisis-response",
    nicheId: "restoration",
    name: "Crisis Response",
    tagline: "Urgent, insurance-focused, fast response",
    description:
      "High-urgency restoration site built around immediate disaster response and insurance claim support.",
    theme: {
      primaryColor: "#ea580c",
      secondaryColor: "#1e293b",
      accentColor: "#facc15",
      bgColor: "#0f1b2e",
      textColor: "#f1f5f9",
      headingFont: "dramatic",
      style: "emergency",
    },
    colorSwatches: ["#ea580c", "#1e293b", "#facc15"],
    sections: [
      {
        id: "hero",
        type: "hero",
        visible: true,
        content: {
          headline:
            "Water, Fire & Mold Damage? We Respond in 60 Minutes — 24/7",
          subheadline:
            "IICRC-certified restoration crews ready now. We handle insurance claims from start to finish.",
          cta1: "Call Now — 24/7 Emergency",
          cta2: "File an Insurance Claim",
          badge1: "⚡ 60-Min Response",
          badge2: "🏛️ IICRC Certified",
          badge3: "📋 Insurance Direct Billing",
          phone: "[Phone]",
        },
      },
      {
        id: "stats",
        type: "stats",
        visible: true,
        content: {
          stats: JSON.stringify([
            { value: "24/7", label: "Emergency Response" },
            { value: "60min", label: "Avg On-Site" },
            { value: "2,000+", label: "Claims Filed" },
            { value: "IICRC", label: "Certified" },
          ]),
        },
      },
      {
        id: "services",
        type: "services",
        visible: true,
        content: {
          heading: "Restoration Services",
          subheading:
            "From emergency mitigation to full structural restoration",
          services: JSON.stringify([
            {
              icon: "💧",
              title: "Water Damage",
              desc: "Emergency extraction, drying, and structural restoration",
            },
            {
              icon: "🔥",
              title: "Fire & Smoke",
              desc: "Full fire damage cleanup, odor removal, and rebuild",
            },
            {
              icon: "🦠",
              title: "Mold Remediation",
              desc: "Safe, certified mold removal with clearance testing",
            },
            {
              icon: "🌪️",
              title: "Storm Damage",
              desc: "Board-up, tarping, and full storm damage repair",
            },
            {
              icon: "🏗️",
              title: "Reconstruction",
              desc: "Full structural rebuild from the ground up",
            },
            {
              icon: "📋",
              title: "Insurance Claims",
              desc: "We bill insurance directly and advocate for you",
            },
          ]),
        },
      },
      {
        id: "trust",
        type: "trust",
        visible: true,
        content: {
          heading: "Why Property Owners Trust [Business Name]",
          badges: JSON.stringify([
            "IICRC Certified",
            "Insurance Direct Billing",
            "EPA Lead-Safe Certified",
            "Licensed General Contractor",
            "24/7 Emergency Response",
            "Satisfaction Guaranteed",
          ]),
        },
      },
      {
        id: "testimonials",
        type: "testimonials",
        visible: true,
        content: {
          heading: "From Our Clients",
          testimonials: JSON.stringify([
            {
              text: "Our basement flooded at midnight. [Business Name] was there in 50 minutes, extracted everything, and handled our entire insurance claim. We didn't have to do a thing.",
              name: "The Johnson Family",
              city: "[City]",
              stars: "5",
            },
            {
              text: "After the fire, we didn't know where to start. These guys guided us through every step. The rebuild was incredible — our home looks better than before.",
              name: "Paul & Linda R.",
              city: "[City]",
              stars: "5",
            },
          ]),
        },
      },
      {
        id: "cta_banner",
        type: "cta_banner",
        visible: true,
        content: {
          heading: "Disaster Doesn't Wait. Neither Do We.",
          subheading:
            "Available 24/7 in [City] and surrounding areas. Insurance billing handled.",
          cta: "Call [Phone] — We Answer 24/7",
        },
      },
      {
        id: "contact",
        type: "contact",
        visible: true,
        content: {
          heading: "Emergency Contact",
          phone: "[Phone]",
          address: "[Address]",
          hours: "24/7 — 365 Days a Year",
        },
      },
    ],
  },
  {
    id: "restoration-recovery-care",
    nicheId: "restoration",
    name: "Recovery & Care",
    tagline: "Empathetic, process-focused, reassuring",
    description:
      "A compassionate restoration brand that focuses on guiding homeowners through the recovery process with empathy and expertise.",
    theme: {
      primaryColor: "#0369a1",
      secondaryColor: "#e0f2fe",
      accentColor: "#7c3aed",
      bgColor: "#f8fafc",
      textColor: "#1e293b",
      headingFont: "clean",
      style: "professional",
    },
    colorSwatches: ["#0369a1", "#e0f2fe", "#7c3aed"],
    sections: [
      {
        id: "hero",
        type: "hero",
        visible: true,
        content: {
          headline: "We'll Help You Rebuild — Every Step of the Way",
          subheadline:
            "Expert restoration, compassionate service, and full insurance claim support for [City] homeowners.",
          cta1: "Get Help Now",
          cta2: "See Our Process",
          badge1: "🤝 Caring Team",
          badge2: "🏛️ IICRC Certified",
          badge3: "📋 Full Insurance Support",
          phone: "[Phone]",
        },
      },
      {
        id: "process",
        type: "process",
        visible: true,
        content: {
          heading: "Our Restoration Process",
          steps: JSON.stringify([
            {
              num: "1",
              title: "Emergency Contact",
              desc: "Call us anytime — a real person answers and dispatches help immediately",
            },
            {
              num: "2",
              title: "Assessment & Plan",
              desc: "We evaluate the damage and create a comprehensive restoration plan",
            },
            {
              num: "3",
              title: "Mitigation & Cleanup",
              desc: "Immediate action to stop further damage and begin cleanup",
            },
            {
              num: "4",
              title: "Full Restoration",
              desc: "Complete reconstruction — your home restored to pre-loss condition",
            },
          ]),
        },
      },
      {
        id: "services",
        type: "services",
        visible: true,
        content: {
          heading: "How We Can Help",
          subheading:
            "Comprehensive restoration for every type of property damage",
          services: JSON.stringify([
            {
              icon: "💧",
              title: "Water Damage",
              desc: "Extraction, drying, and moisture control to prevent mold",
            },
            {
              icon: "🔥",
              title: "Fire Damage",
              desc: "Smoke removal, structural repair, and contents restoration",
            },
            {
              icon: "🦠",
              title: "Mold Remediation",
              desc: "Safe removal with air quality testing and clearance documentation",
            },
            {
              icon: "📋",
              title: "Insurance Navigation",
              desc: "We work directly with adjusters to maximize your claim",
            },
            {
              icon: "🏗️",
              title: "Full Rebuild",
              desc: "End-to-end reconstruction with licensed contractors",
            },
            {
              icon: "🌪️",
              title: "Storm Recovery",
              desc: "Immediate stabilization and comprehensive storm repair",
            },
          ]),
        },
      },
      {
        id: "testimonials",
        type: "testimonials",
        visible: true,
        content: {
          heading: "Stories of Recovery",
          testimonials: JSON.stringify([
            {
              text: "What could have been a nightmare became manageable because of [Business Name]. They handled everything — contractors, insurance, inspections. I can't say enough.",
              name: "Karen M.",
              city: "[City]",
              stars: "5",
            },
            {
              text: "They treated our home like it was their own. Every person on the crew was respectful and professional. Our home is completely restored.",
              name: "David & Susan T.",
              city: "[City]",
              stars: "5",
            },
          ]),
        },
      },
      {
        id: "cta_banner",
        type: "cta_banner",
        visible: true,
        content: {
          heading: "You Don't Have to Face This Alone",
          subheading:
            "Call us now — we'll guide you through every step of the recovery.",
          cta: "Get Help Today",
        },
      },
      {
        id: "contact",
        type: "contact",
        visible: true,
        content: {
          heading: "We're Here for You",
          phone: "[Phone]",
          address: "[Address]",
          hours: "24/7 Emergency | Office Mon–Fri 8am–6pm",
        },
      },
    ],
  },

  // ── CARPET CLEANING ───────────────────────────────────────────────────────
  {
    id: "carpet-fresh-home",
    nicheId: "carpet-cleaning",
    name: "Fresh Home",
    tagline: "Lifestyle, bright, family-focused",
    description:
      "A bright, friendly carpet cleaning site built for families — emphasizing clean, healthy, safe-for-kids results.",
    theme: {
      primaryColor: "#059669",
      secondaryColor: "#d1fae5",
      accentColor: "#f59e0b",
      bgColor: "#f0fdf4",
      textColor: "#0f172a",
      headingFont: "clean",
      style: "warm",
    },
    colorSwatches: ["#059669", "#d1fae5", "#f59e0b"],
    sections: [
      {
        id: "hero",
        type: "hero",
        visible: true,
        content: {
          headline: "The Cleanest Carpets in [City] — Guaranteed Fresh or Free",
          subheadline:
            "Safe for kids, pets, and the whole family. Professional results that last.",
          cta1: "Book a Cleaning",
          cta2: "See Before & After",
          badge1: "🌿 Pet & Kid Safe",
          badge2: "💯 Freshness Guarantee",
          badge3: "⭐ 600+ Reviews",
          phone: "[Phone]",
        },
      },
      {
        id: "stats",
        type: "stats",
        visible: true,
        content: {
          stats: JSON.stringify([
            { value: "48hr", label: "Booking Window" },
            { value: "600+", label: "Happy Homes" },
            { value: "4.9★", label: "Google Rating" },
            { value: "2hr", label: "Avg Job Time" },
          ]),
        },
      },
      {
        id: "services",
        type: "services",
        visible: true,
        content: {
          heading: "Cleaning Services for Your Whole Home",
          subheading: "From carpets to upholstery — we make it fresh",
          services: JSON.stringify([
            {
              icon: "🏠",
              title: "Carpet Cleaning",
              desc: "Deep steam cleaning removes allergens, bacteria, and odors",
            },
            {
              icon: "🛋️",
              title: "Upholstery Cleaning",
              desc: "Sofas, chairs, and sectionals cleaned and refreshed",
            },
            {
              icon: "🐾",
              title: "Pet Stain & Odor",
              desc: "Enzyme treatment eliminates pet odors permanently",
            },
            {
              icon: "🏢",
              title: "Area Rugs",
              desc: "Hand-cleaned and dried for all rug types",
            },
            {
              icon: "🛡️",
              title: "Carpet Protection",
              desc: "Scotchgard application to resist future stains",
            },
            {
              icon: "🌊",
              title: "Tile & Grout",
              desc: "High-pressure cleaning for tile and grout lines",
            },
          ]),
        },
      },
      {
        id: "before_after",
        type: "before_after",
        visible: true,
        content: {
          heading: "See the [Business Name] Difference",
          subheading: "Real homes, real results — no filters, no tricks.",
          disclaimer: "Results from actual client jobs in [City].",
          treatments: JSON.stringify([
            { label: "Living Room Carpet — Pet Stains" },
            { label: "Master Bedroom — 10yr Old Stains" },
            { label: "Sectional Sofa — Full Deep Clean" },
          ]),
        },
      },
      {
        id: "testimonials",
        type: "testimonials",
        visible: true,
        content: {
          heading: "Families Love [Business Name]",
          testimonials: JSON.stringify([
            {
              text: "I thought my carpet was done for — pet stains, kid spills, years of wear. It looks brand new. I literally cried when I saw it.",
              name: "Amanda K.",
              city: "[City]",
              stars: "5",
            },
            {
              text: "On time, professional, and the results are incredible. Our house smells amazing. Will absolutely book again.",
              name: "Chris & Beth M.",
              city: "[City]",
              stars: "5",
            },
            {
              text: "Safe products, efficient crew, and half the price of the big chains. This is our carpet cleaner for life.",
              name: "Tanya R.",
              city: "[City]",
              stars: "5",
            },
          ]),
        },
      },
      {
        id: "cta_banner",
        type: "cta_banner",
        visible: true,
        content: {
          heading: "Book Your Cleaning — Appointments Fill Fast",
          subheading:
            "48-hour booking window. Saturday appointments available.",
          cta: "Book Online Now",
        },
      },
      {
        id: "contact",
        type: "contact",
        visible: true,
        content: {
          heading: "Schedule a Cleaning",
          phone: "[Phone]",
          address: "[Address]",
          hours: "Mon–Sat 7am–6pm",
        },
      },
    ],
  },
  {
    id: "carpet-commercial-authority",
    nicheId: "carpet-cleaning",
    name: "Commercial Authority",
    tagline: "B2B, before/after, scale-focused",
    description:
      "A commercial-focused carpet cleaning brand targeting offices, hotels, and property managers.",
    theme: {
      primaryColor: "#1e40af",
      secondaryColor: "#eff6ff",
      accentColor: "#0ea5e9",
      bgColor: "#f8fafc",
      textColor: "#1e293b",
      headingFont: "bold",
      style: "professional",
    },
    colorSwatches: ["#1e40af", "#eff6ff", "#0ea5e9"],
    sections: [
      {
        id: "hero",
        type: "hero",
        visible: true,
        content: {
          headline: "Commercial Carpet Cleaning for [City] Businesses",
          subheadline:
            "Minimal disruption. Maximum results. Trusted by hotels, offices, and property managers.",
          cta1: "Get a Commercial Quote",
          cta2: "See Our Portfolio",
          badge1: "🏢 Commercial Specialists",
          badge2: "⚡ After-Hours Available",
          badge3: "📋 Service Contracts",
          phone: "[Phone]",
        },
      },
      {
        id: "stats",
        type: "stats",
        visible: true,
        content: {
          stats: JSON.stringify([
            { value: "200+", label: "Commercial Clients" },
            { value: "24hr", label: "Turnaround" },
            { value: "50k+", label: "Sq Ft / Month" },
            { value: "4.9★", label: "Rating" },
          ]),
        },
      },
      {
        id: "services",
        type: "services",
        visible: true,
        content: {
          heading: "Commercial Cleaning Services",
          subheading: "For offices, hotels, retail, and property management",
          services: JSON.stringify([
            {
              icon: "🏢",
              title: "Office Buildings",
              desc: "After-hours cleaning with no disruption to your business",
            },
            {
              icon: "🏨",
              title: "Hotels & Hospitality",
              desc: "Fast turnaround to keep rooms in top condition",
            },
            {
              icon: "🏪",
              title: "Retail Spaces",
              desc: "High-traffic floor care that looks professional",
            },
            {
              icon: "🏘️",
              title: "Property Management",
              desc: "Move-in/move-out and tenant turnover cleaning",
            },
            {
              icon: "📋",
              title: "Service Contracts",
              desc: "Scheduled maintenance programs with locked-in pricing",
            },
            {
              icon: "🌊",
              title: "Hard Floor Care",
              desc: "Stripping, waxing, and buffing for hard floor surfaces",
            },
          ]),
        },
      },
      {
        id: "testimonials",
        type: "testimonials",
        visible: true,
        content: {
          heading: "Trusted by [City] Businesses",
          testimonials: JSON.stringify([
            {
              text: "We manage 12 commercial properties in [City]. [Business Name] handles all of them. Reliable, professional, and the quality is always consistent.",
              name: "Robert H., Property Manager",
              city: "[City]",
              stars: "5",
            },
            {
              text: "Our hotel required a same-day carpet refresh after a conference. [Business Name] made it happen. Outstanding.",
              name: "Susan L., Hotel GM",
              city: "[City]",
              stars: "5",
            },
          ]),
        },
      },
      {
        id: "cta_banner",
        type: "cta_banner",
        visible: true,
        content: {
          heading: "Get a Commercial Service Quote Today",
          subheading:
            "Volume pricing and service contracts available for businesses of all sizes.",
          cta: "Request a Commercial Quote",
        },
      },
      {
        id: "contact",
        type: "contact",
        visible: true,
        content: {
          heading: "Commercial Inquiries",
          phone: "[Phone]",
          address: "[Address]",
          hours: "Mon–Fri 8am–5pm | After-Hours Available",
        },
      },
    ],
  },

  // ── ROOFING ───────────────────────────────────────────────────────────────
  {
    id: "roofing-storm-protection",
    nicheId: "roofing",
    name: "Storm Protection",
    tagline: "Urgent, damage-focused, insurance-ready",
    description:
      "High-urgency roofing site built for storm damage response with insurance claim support.",
    theme: {
      primaryColor: "#b91c1c",
      secondaryColor: "#1c1917",
      accentColor: "#f59e0b",
      bgColor: "#0c0a09",
      textColor: "#fafaf9",
      headingFont: "dramatic",
      style: "emergency",
    },
    colorSwatches: ["#b91c1c", "#1c1917", "#f59e0b"],
    sections: [
      {
        id: "hero",
        type: "hero",
        visible: true,
        content: {
          headline:
            "Storm Damage? Free Inspection & Insurance Claim Assistance",
          subheadline:
            "Emergency roof repair in [City]. NRCA-certified crews. We work directly with your insurance company.",
          cta1: "Schedule Free Inspection",
          cta2: "Emergency Repair",
          badge1: "⚡ 24hr Emergency Board-Up",
          badge2: "📋 Insurance Specialists",
          badge3: "🏅 NRCA Certified",
          phone: "[Phone]",
        },
      },
      {
        id: "stats",
        type: "stats",
        visible: true,
        content: {
          stats: JSON.stringify([
            { value: "24hr", label: "Emergency Response" },
            { value: "1,500+", label: "Roofs Repaired" },
            { value: "98%", label: "Claim Approval" },
            { value: "50yr", label: "Manufacturer Warranties" },
          ]),
        },
      },
      {
        id: "services",
        type: "services",
        visible: true,
        content: {
          heading: "Roofing Services",
          subheading: "From emergency repairs to complete roof replacement",
          services: JSON.stringify([
            {
              icon: "🌩️",
              title: "Storm Damage Repair",
              desc: "Emergency response — board-up, tarp, and full repair",
            },
            {
              icon: "🏠",
              title: "Roof Replacement",
              desc: "Complete reroof with premium materials and manufacturer warranty",
            },
            {
              icon: "🔍",
              title: "Free Inspection",
              desc: "Comprehensive roof assessment with documented findings",
            },
            {
              icon: "📋",
              title: "Insurance Claims",
              desc: "We document damage and work directly with your adjuster",
            },
            {
              icon: "🔧",
              title: "Leak Repair",
              desc: "Identify and fix leaks before they cause structural damage",
            },
            {
              icon: "🌿",
              title: "Gutters & Drainage",
              desc: "Gutter installation, cleaning, and storm drainage solutions",
            },
          ]),
        },
      },
      {
        id: "trust",
        type: "trust",
        visible: true,
        content: {
          heading: "Credentials That Protect You",
          badges: JSON.stringify([
            "NRCA Member",
            "GAF Master Elite Contractor",
            "Owens Corning Preferred",
            "Licensed & Bonded",
            "$5M Liability Insurance",
            "50-Year Manufacturer Warranty Available",
          ]),
        },
      },
      {
        id: "testimonials",
        type: "testimonials",
        visible: true,
        content: {
          heading: "Homeowners Across [City] Trust Us",
          testimonials: JSON.stringify([
            {
              text: "Hail tore up our roof. [Business Name] came out same day, documented everything for insurance, and had a new roof on in 2 days. Insurance covered everything.",
              name: "Mark & Diane H.",
              city: "[City]",
              stars: "5",
            },
            {
              text: "From inspection to installation, this team was professional every step. New roof looks incredible. Warranty gives me complete peace of mind.",
              name: "William T.",
              city: "[City]",
              stars: "5",
            },
          ]),
        },
      },
      {
        id: "cta_banner",
        type: "cta_banner",
        visible: true,
        content: {
          heading: "Storm Damage? Get Your Free Inspection Today",
          subheading:
            "Limited inspection slots available. Most homeowners qualify for insurance coverage.",
          cta: "Schedule Free Inspection",
        },
      },
      {
        id: "contact",
        type: "contact",
        visible: true,
        content: {
          heading: "Contact [Business Name]",
          phone: "[Phone]",
          address: "[Address]",
          hours: "Mon–Sat 7am–7pm | Emergency 24/7",
        },
      },
    ],
  },
  {
    id: "roofing-premium-install",
    nicheId: "roofing",
    name: "Premium Install",
    tagline: "Quality, warranty, curb appeal focused",
    description:
      "A premium roofing brand for homeowners investing in quality — curb appeal, long-term value, and manufacturer-backed warranties.",
    theme: {
      primaryColor: "#374151",
      secondaryColor: "#f9fafb",
      accentColor: "#d97706",
      bgColor: "#ffffff",
      textColor: "#111827",
      headingFont: "bold",
      style: "professional",
    },
    colorSwatches: ["#374151", "#f9fafb", "#d97706"],
    sections: [
      {
        id: "hero",
        type: "hero",
        visible: true,
        content: {
          headline: "Invest in Your Home. Install a Roof That Lasts 50 Years.",
          subheadline:
            "Premium roofing materials, master installation, and unmatched warranties for [City] homeowners.",
          cta1: "Get a Free Quote",
          cta2: "Browse Materials",
          badge1: "🏅 GAF Master Elite",
          badge2: "💎 Premium Materials",
          badge3: "50yr Warranty",
          phone: "[Phone]",
        },
      },
      {
        id: "stats",
        type: "stats",
        visible: true,
        content: {
          stats: JSON.stringify([
            { value: "25+", label: "Years Experience" },
            { value: "GAF", label: "Master Elite" },
            { value: "50yr", label: "Warranty Available" },
            { value: "2,000+", label: "Roofs Installed" },
          ]),
        },
      },
      {
        id: "services",
        type: "services",
        visible: true,
        content: {
          heading: "Premium Roofing Solutions",
          subheading: "Quality materials. Expert installation. Lasting value.",
          services: JSON.stringify([
            {
              icon: "🏠",
              title: "Architectural Shingles",
              desc: "Premium dimensional shingles with 50-year manufacturer warranty",
            },
            {
              icon: "🔲",
              title: "Metal Roofing",
              desc: "Standing seam metal for maximum durability and curb appeal",
            },
            {
              icon: "🏛️",
              title: "Slate & Tile",
              desc: "Natural and synthetic options for luxury homes",
            },
            {
              icon: "🔧",
              title: "Roof Restoration",
              desc: "Extend roof life with professional restoration systems",
            },
            {
              icon: "🌿",
              title: "Green Roofing",
              desc: "Energy-efficient cool roof systems and solar-ready installs",
            },
            {
              icon: "🛡️",
              title: "Roof Certification",
              desc: "Certified inspection and documentation for home sales",
            },
          ]),
        },
      },
      {
        id: "before_after",
        type: "before_after",
        visible: true,
        content: {
          heading: "Transformations That Add Curb Appeal",
          subheading:
            "See the visual and structural impact of a quality roof replacement.",
          disclaimer: "Before and after photos from [City] homeowners.",
          treatments: JSON.stringify([
            { label: "3-Tab to Architectural Shingle" },
            { label: "Full Dimensional Shingle Replacement" },
            { label: "Metal Roof Installation" },
          ]),
        },
      },
      {
        id: "certifications",
        type: "certifications",
        visible: true,
        content: {
          heading: "Certifications & Partnerships",
          certs: JSON.stringify([
            "GAF Master Elite Contractor",
            "Owens Corning Preferred Contractor",
            "CertainTeed SELECT ShingleMaster",
            "NRCA Member",
            "State Licensed & Bonded",
            "A+ BBB Accredited",
          ]),
        },
      },
      {
        id: "testimonials",
        type: "testimonials",
        visible: true,
        content: {
          heading: "From Our Clients",
          testimonials: JSON.stringify([
            {
              text: "We got 5 quotes. [Business Name] wasn't the cheapest but they were clearly the best. Two years later, the roof looks just as beautiful as day one.",
              name: "Patricia L.",
              city: "[City]",
              stars: "5",
            },
            {
              text: "The crew was immaculate — cleaned up every nail, protected our landscaping, and finished a full day early. Premium experience start to finish.",
              name: "George & Ann T.",
              city: "[City]",
              stars: "5",
            },
          ]),
        },
      },
      {
        id: "cta_banner",
        type: "cta_banner",
        visible: true,
        content: {
          heading: "Ready to Invest in a Roof That Lasts?",
          subheading:
            "Free estimate includes material recommendations and warranty comparison.",
          cta: "Get Your Free Quote",
        },
      },
      {
        id: "contact",
        type: "contact",
        visible: true,
        content: {
          heading: "Get in Touch",
          phone: "[Phone]",
          address: "[Address]",
          hours: "Mon–Fri 7am–6pm | Sat 8am–2pm",
        },
      },
    ],
  },

  // ── REAL ESTATE ───────────────────────────────────────────────────────────
  {
    id: "real-estate-premier-agent",
    nicheId: "real-estate",
    name: "Premier Agent",
    tagline: "Dark slate, gold, results-driven",
    description:
      "A premium real estate agent website built around results, market expertise, and the 78% first-responder advantage. Dark slate and gold palette conveys confidence and authority.",
    theme: {
      primaryColor: "#1E2D3D",
      secondaryColor: "#C9A96E",
      accentColor: "#D4AF37",
      bgColor: "#0F1922",
      textColor: "#F5F0E8",
      headingFont: "bold",
      style: "professional",
    },
    colorSwatches: ["#1E2D3D", "#C9A96E", "#D4AF37"],
    sections: [],
    pages: [
      {
        id: "home",
        label: "Home",
        slug: "/",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline:
                "[Business Name] | Your Trusted Real Estate Partner in [City] — Buying or Selling, We Deliver Results",
              subheadline:
                "Whether you're buying your first home or selling for top dollar, our agents know [City]'s market inside and out. 78% of buyers go with the first agent who calls back — we call back in minutes.",
              cta1: "Schedule a Free Consultation",
              cta2: "Search [City] Listings",
              badge1: "🏡 500+ Homes Sold",
              badge2: "⭐ 4.9 Star Rating",
              badge3: "📞 We Respond in Minutes",
              phone: "[Phone]",
            },
          },
          {
            id: "stats",
            type: "stats",
            visible: true,
            content: {
              stats: JSON.stringify([
                { value: "500+", label: "Homes Sold" },
                { value: "4.9★", label: "Client Rating" },
                { value: "$2.1B", label: "In Transactions" },
                { value: "14 Days", label: "Avg Days to Offer" },
              ]),
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Full-Service Real Estate in [City]",
              subheading:
                "From first-time buyers to seasoned investors — we handle every transaction with the same level of expert care",
              services: JSON.stringify([
                {
                  icon: "🏠",
                  title: "Buyer Representation",
                  desc: "Expert guidance from search to closing — we negotiate the best price and terms for you",
                },
                {
                  icon: "📋",
                  title: "Seller Representation",
                  desc: "Strategic pricing, professional staging advice, and maximum market exposure to sell fast and for top dollar",
                },
                {
                  icon: "💼",
                  title: "Investment Properties",
                  desc: "Identify high-ROI opportunities in [City]'s rental and flip markets with our in-depth analysis",
                },
                {
                  icon: "🔑",
                  title: "First-Time Homebuyers",
                  desc: "We walk you through every step — pre-approval, offers, inspections, and closing — with zero confusion",
                },
                {
                  icon: "💎",
                  title: "Luxury Properties",
                  desc: "Specialized representation for [City]'s premium market with discretion and white-glove service",
                },
                {
                  icon: "📊",
                  title: "Market Analysis & CMA",
                  desc: "Accurate, data-backed Comparative Market Analysis so you always know the true value of any property",
                },
              ]),
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading:
                "500+ Homes Sold | 4.9 Stars | Licensed & Certified | [City] Market Experts",
              badges: JSON.stringify([
                "Licensed REALTOR®",
                "500+ Transactions Closed",
                "Top 1% in [City] Market",
                "Certified Negotiation Expert",
                "Google Guaranteed",
                "NAR Member",
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "How We Get You Results",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Schedule a Free Consultation",
                  desc: "Tell us your goals — buying, selling, or investing. We listen first.",
                },
                {
                  num: "2",
                  title: "We Build Your Strategy",
                  desc: "A personalized buying or selling strategy based on your goals and current [City] market data.",
                },
                {
                  num: "3",
                  title: "Close with Confidence",
                  desc: "We negotiate hard on your behalf and guide you to closing on time, on budget, with zero surprises.",
                },
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "What Our Clients Say",
              testimonials: JSON.stringify([
                {
                  text: "We listed with [Business Name] after two failed listings with other agents. They had us under contract in 9 days — $22,000 over asking. Absolutely remarkable.",
                  name: "David & Carol M.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "As first-time buyers in a competitive market, we were terrified. Our agent held our hand through every step, won us a bidding war, and we closed without a single issue.",
                  name: "Jasmine T.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "We've bought and sold four properties with [Business Name] over the years. The market knowledge and negotiating skills are unmatched in [City].",
                  name: "Robert & Lynn H.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Ready to Buy or Sell in [City]?",
              subheading:
                "The market moves fast. Our agents respond in minutes — not hours. Start with a free, no-obligation consultation.",
              cta: "Schedule Your Free Consultation",
            },
          },
        ],
      },
      {
        id: "services",
        label: "Services",
        slug: "/services",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Expert Real Estate Services in [City]",
              subheadline:
                "Buyers, sellers, investors, and first-timers — we have the expertise, local knowledge, and track record to get you results.",
              cta1: "Schedule a Consultation",
              cta2: "Get a Free Home Valuation",
              badge1: "🏡 Licensed REALTOR®",
              badge2: "⭐ Top 1% in [City]",
              badge3: "📊 Free Market Analysis",
              phone: "[Phone]",
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Everything You Need to Buy or Sell",
              subheading: "Full-service representation from search to closing",
              services: JSON.stringify([
                {
                  icon: "🏠",
                  title: "Buyer Representation",
                  desc: "Property search, offer strategy, inspection management, and negotiation — we handle every detail",
                },
                {
                  icon: "📋",
                  title: "Seller Representation",
                  desc: "Professional photos, MLS listing, open houses, and expert negotiation to maximize your sale price",
                },
                {
                  icon: "💼",
                  title: "Investment Properties",
                  desc: "Cap rate analysis, neighborhood trends, rental income projections — invest with confidence",
                },
                {
                  icon: "🔑",
                  title: "First-Time Buyer Program",
                  desc: "Step-by-step guidance, educational walkthroughs, and down payment assistance resources",
                },
                {
                  icon: "💎",
                  title: "Luxury Market",
                  desc: "Discretionary marketing, exclusive buyer network, and white-glove service for premium properties",
                },
                {
                  icon: "📊",
                  title: "Free Home Valuation",
                  desc: "Accurate, data-driven CMA using recent sales, active listings, and current market conditions in [City]",
                },
                {
                  icon: "🤝",
                  title: "Relocation Services",
                  desc: "Moving to [City]? We help you find the right neighborhood, school district, and community fit",
                },
                {
                  icon: "🏘️",
                  title: "New Construction",
                  desc: "Representing buyers in new construction — we negotiate builder upgrades and protect your interests",
                },
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "The [Business Name] Process",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Free Consultation",
                  desc: "We learn your goals, timeline, and budget — no obligation",
                },
                {
                  num: "2",
                  title: "Strategy Session",
                  desc: "Custom buying or selling plan with current [City] market data",
                },
                {
                  num: "3",
                  title: "Execution",
                  desc: "We handle showings, offers, inspections, and negotiations",
                },
                {
                  num: "4",
                  title: "Close",
                  desc: "Smooth, on-time closing with zero surprises — and ongoing support after",
                },
              ]),
            },
          },
          {
            id: "faq",
            type: "faq",
            visible: true,
            content: {
              heading: "Frequently Asked Questions",
              faqs: JSON.stringify([
                {
                  q: "How much does it cost to use a buyer's agent?",
                  a: "In most transactions, the seller pays the buyer's agent commission — meaning you get expert representation at no direct cost to you.",
                },
                {
                  q: "How long does it take to buy a home in [City]?",
                  a: "From accepted offer to closing typically takes 30–45 days. Finding the right home varies — some clients find it in days, others take a few months. We move at your pace.",
                },
                {
                  q: "How do you price a home for sale?",
                  a: "We conduct a thorough Comparative Market Analysis (CMA) using recent sold homes, current competition, and market trends to set a price that attracts buyers and maximizes your return.",
                },
                {
                  q: "Do I need to be pre-approved before searching?",
                  a: "We strongly recommend it. Pre-approval lets you move fast when you find the right property — in [City]'s market, hesitation can mean losing your dream home.",
                },
                {
                  q: "What is your commission?",
                  a: "Commission structures are discussed during your free consultation. We are fully transparent about fees and always work to maximize your net proceeds or purchasing power.",
                },
                {
                  q: "Can you help with investment properties?",
                  a: "Absolutely. We specialize in identifying high-ROI opportunities and provide detailed analysis on rental income potential, appreciation trends, and neighborhood fundamentals.",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Let's Talk About Your Real Estate Goals",
              subheading:
                "Free consultation, no obligation. We'll tell you exactly what your home is worth and what you can afford in [City] right now.",
              cta: "Get Your Free Home Valuation",
            },
          },
        ],
      },
      {
        id: "about",
        label: "About",
        slug: "/about",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "The [City] Real Estate Team That Puts Clients First",
              subheadline:
                "We've built our reputation in [City] on one belief: your goals come before our commission. Every agent on our team lives by that standard.",
              cta1: "Meet Our Team",
              cta2: "See Our Results",
              badge1: "🏡 Locally Based",
              badge2: "500+ Transactions",
              badge3: "Top 1% [City] Agents",
              phone: "[Phone]",
            },
          },
          {
            id: "about",
            type: "about",
            visible: true,
            content: {
              heading: "Our Story",
              body: "[Business Name] was built on a simple principle: [City] home buyers and sellers deserve an agent who is genuinely in their corner — not just motivated by a commission check. Our team has deep roots in this community. We know every neighborhood, every school district, every micro-market trend. We've helped over 500 families find their dream homes and sell their properties for maximum value. We don't just list homes — we market them aggressively. We don't just show properties — we negotiate fiercely on your behalf. And we don't disappear after closing — we stay in your corner for every future real estate decision.",
              founderName: "— The [Business Name] Team",
            },
          },
          {
            id: "certifications",
            type: "certifications",
            visible: true,
            content: {
              heading: "Our Licenses & Designations",
              certs: JSON.stringify([
                "Licensed REALTOR® — State of [City]",
                "National Association of REALTORS® Member",
                "Certified Negotiation Expert (CNE)",
                "Accredited Buyer's Representative (ABR)",
                "Seller Representative Specialist (SRS)",
                "Top 1% Producer — [City] MLS",
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "Why Clients Keep Coming Back",
              testimonials: JSON.stringify([
                {
                  text: "I've worked with four different agents over the years. Nobody comes close to [Business Name]. They're the real deal — deeply knowledgeable, always available, and completely trustworthy.",
                  name: "Michael & Sandra P.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Sold my home in 6 days for $18,000 over asking. That speaks for itself. Phenomenal team.",
                  name: "Karen W.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Meet the Team — Let's Talk Real Estate",
              subheading:
                "A free consultation costs you nothing and tells you exactly where the [City] market stands right now.",
              cta: "Schedule a Free Consultation",
            },
          },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        slug: "/contact",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Let's Talk — We Respond in Minutes",
              subheadline:
                "78% of buyers and sellers go with the first agent who responds. Don't let another agent beat you to it — call or text us now.",
              cta1: "Call [Phone] Now",
              cta2: "Send a Message",
              badge1: "📞 Agents Available Now",
              badge2: "⚡ Responds in Minutes",
              badge3: "🏡 [City] Market Experts",
              phone: "[Phone]",
            },
          },
          {
            id: "contact",
            type: "contact",
            visible: true,
            content: {
              heading: "Contact [Business Name]",
              phone: "[Phone]",
              address: "[Address]",
              hours: "Mon–Sat 8am–8pm | Sun by Appointment",
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "Why [City] Trusts [Business Name]",
              badges: JSON.stringify([
                "Licensed REALTOR®",
                "500+ Homes Sold",
                "Top 1% [City] Agents",
                "Free Home Valuation",
                "CNE Certified Negotiator",
                "100% Client Satisfaction Goal",
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Your Next Move Starts Here",
              subheading:
                "Call, text, or email — we're ready when you are. Free consultation, no pressure, no obligation.",
              cta: "Get Your Free Home Valuation Today",
            },
          },
        ],
      },
    ],
  },

  // ── MORTGAGE ──────────────────────────────────────────────────────────────
  {
    id: "mortgage-fast-approval",
    nicheId: "mortgage",
    name: "Fast Approval",
    tagline: "Navy, green, speed-and-trust focused",
    description:
      "A conversion-driven mortgage broker website emphasizing speed, 50+ lender access, and pre-qualification in hours — not days.",
    theme: {
      primaryColor: "#0D2137",
      secondaryColor: "#2E7D32",
      accentColor: "#43A047",
      bgColor: "#07131F",
      textColor: "#EFF6F0",
      headingFont: "bold",
      style: "professional",
    },
    colorSwatches: ["#0D2137", "#2E7D32", "#43A047"],
    sections: [],
    pages: [
      {
        id: "home",
        label: "Home",
        slug: "/",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline:
                "[Business Name] | Get Home Loan Ready in 24 Hours — [City]'s Most Responsive Mortgage Brokers",
              subheadline:
                "Pre-qualification in hours, not days. We shop 50+ lenders to find your best rate — so you don't have to call around.",
              cta1: "Get Pre-Qualified in 5 Minutes",
              cta2: "Compare Your Rates",
              badge1: "✅ 1,200+ Loans Closed",
              badge2: "🏦 50+ Lender Network",
              badge3: "⚡ 24-Hour Pre-Approval",
              phone: "[Phone]",
            },
          },
          {
            id: "stats",
            type: "stats",
            visible: true,
            content: {
              stats: JSON.stringify([
                { value: "1,200+", label: "Loans Closed" },
                { value: "50+", label: "Lenders Shopped" },
                { value: "4.9★", label: "Client Rating" },
                { value: "24 Hrs", label: "Pre-Approval Time" },
              ]),
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Home Loan Solutions for Every Situation",
              subheading:
                "Whether you're buying, refinancing, or need a specialized program — we find the best loan for your unique situation",
              services: JSON.stringify([
                {
                  icon: "🏠",
                  title: "Purchase Loans",
                  desc: "Conventional, FHA, VA, USDA — we match you to the best program and lowest rate available",
                },
                {
                  icon: "🔄",
                  title: "Refinancing",
                  desc: "Lower your rate, reduce your term, or tap equity — we run the numbers and show you when it makes sense",
                },
                {
                  icon: "🏛️",
                  title: "FHA Loans",
                  desc: "3.5% down with flexible credit requirements — perfect for first-time buyers and moderate-income borrowers",
                },
                {
                  icon: "🎖️",
                  title: "VA Loans",
                  desc: "Zero down, no PMI, and competitive rates for veterans and active-duty service members",
                },
                {
                  icon: "💎",
                  title: "Jumbo Loans",
                  desc: "Financing above conventional limits for high-value properties — competitive rates across multiple investors",
                },
                {
                  icon: "🔑",
                  title: "First-Time Buyer Programs",
                  desc: "Down payment assistance, closing cost grants, and educational support for first-time homebuyers",
                },
              ]),
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading:
                "1,200+ Loans Closed | 4.9 Stars | Licensed Brokers | 50+ Lender Network",
              badges: JSON.stringify([
                "Licensed Mortgage Broker — NMLS",
                "50+ Lender Network",
                "1,200+ Loans Closed",
                "4.9-Star Google Rating",
                "Zero Junk Fees",
                "Pre-Approval in 24 Hours",
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "Your Path to Pre-Approval",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Submit a Quick Pre-Qualification Form",
                  desc: "Takes 5 minutes — no hard credit pull until you're ready to proceed",
                },
                {
                  num: "2",
                  title: "We Shop 50+ Lenders for Your Best Rate",
                  desc: "We compare rates, terms, and fees across our entire lender network — you get the best deal without the legwork",
                },
                {
                  num: "3",
                  title: "Close on Your New Home — Fast",
                  desc: "We coordinate everything from appraisal to title to closing — on time, every time",
                },
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "What Our Clients Say",
              testimonials: JSON.stringify([
                {
                  text: "Got pre-approved in less than a day — other brokers told us it would take a week. [Business Name] made the entire process fast, simple, and stress-free.",
                  name: "Kevin & Michelle R.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "They found us a rate 0.4% lower than what our bank offered. On a 30-year loan, that's tens of thousands of dollars. Incredible value.",
                  name: "Patricia N.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Used [Business Name] to refinance. Cut $380 off my monthly payment and got cash out for renovations. Effortless process, knowledgeable team.",
                  name: "Thomas G.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Get Pre-Qualified Today — Takes 5 Minutes",
              subheading:
                "No hard credit pull. No obligation. Just a clear picture of what you can borrow and what you'll pay.",
              cta: "Start My Pre-Qualification",
            },
          },
        ],
      },
      {
        id: "services",
        label: "Services",
        slug: "/services",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Every Type of Home Loan. One Trusted Broker.",
              subheadline:
                "We search 50+ lenders to find the right loan product and lowest rate for your specific situation — purchase, refi, or specialty financing.",
              cta1: "Get Pre-Qualified",
              cta2: "Compare Rates Now",
              badge1: "🏦 50+ Lender Network",
              badge2: "✅ Licensed NMLS Broker",
              badge3: "⚡ 24-Hour Pre-Approval",
              phone: "[Phone]",
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Full Mortgage Service Menu",
              subheading:
                "Every loan type, every situation — we have a solution",
              services: JSON.stringify([
                {
                  icon: "🏠",
                  title: "Conventional Loans",
                  desc: "Standard purchase financing with competitive rates — available with as little as 3% down",
                },
                {
                  icon: "🏛️",
                  title: "FHA Loans",
                  desc: "Government-backed loans with low down payment requirements and flexible credit standards",
                },
                {
                  icon: "🎖️",
                  title: "VA Loans",
                  desc: "100% financing for eligible veterans — no down payment, no PMI, and some of the lowest rates available",
                },
                {
                  icon: "🌾",
                  title: "USDA Loans",
                  desc: "Zero-down financing for qualifying rural and suburban properties — often overlooked but highly valuable",
                },
                {
                  icon: "💎",
                  title: "Jumbo Loans",
                  desc: "Financing above conforming limits ($766,550+) — available with favorable terms through our investor network",
                },
                {
                  icon: "🔄",
                  title: "Rate/Term Refinance",
                  desc: "Lower your interest rate or shorten your loan term — we model the break-even so you know if it's worth it",
                },
                {
                  icon: "💵",
                  title: "Cash-Out Refinance",
                  desc: "Access your home equity for renovations, debt consolidation, or investment — at mortgage rates",
                },
                {
                  icon: "🔑",
                  title: "Down Payment Assistance",
                  desc: "State and local DPA programs that can cover 3–5% of your purchase price — we identify every program you qualify for",
                },
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "The Loan Process Made Simple",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Pre-Qualification (5 min)",
                  desc: "Quick online form — no hard credit pull, no commitment",
                },
                {
                  num: "2",
                  title: "Rate Shopping (24 hrs)",
                  desc: "We search 50+ lenders simultaneously and present your best 3 options with full cost comparison",
                },
                {
                  num: "3",
                  title: "Application & Processing",
                  desc: "We gather documents, order appraisal, and coordinate with title — you just sign what we send",
                },
                {
                  num: "4",
                  title: "Underwriting & Approval",
                  desc: "Our team proactively manages conditions and keeps your loan on track for on-time closing",
                },
                {
                  num: "5",
                  title: "Closing Day",
                  desc: "We walk you through the final numbers before you sign — no surprises at the closing table",
                },
              ]),
            },
          },
          {
            id: "faq",
            type: "faq",
            visible: true,
            content: {
              heading: "Mortgage Questions Answered",
              faqs: JSON.stringify([
                {
                  q: "What credit score do I need to buy a home?",
                  a: "Conventional loans typically require 620+. FHA loans are available with scores as low as 580. VA and USDA have flexible standards. We'll tell you exactly where you stand in your free consultation.",
                },
                {
                  q: "How much down payment do I need?",
                  a: "As little as 0% (VA/USDA), 3.5% (FHA), or 3% (conventional with MI). We help you identify down payment assistance programs you may qualify for.",
                },
                {
                  q: "What is the difference between a mortgage broker and a bank?",
                  a: "A bank can only offer their own products. We shop 50+ lenders simultaneously — giving you access to more programs and almost always better rates than going directly to a bank.",
                },
                {
                  q: "How long does pre-approval take?",
                  a: "With [Business Name], you can have a full pre-approval letter within 24 hours of submitting your documents. We move fast so you can compete in any market.",
                },
                {
                  q: "Are your rates competitive?",
                  a: "Because we shop 50+ lenders, our clients consistently get lower rates than they'd find at a single bank. We can compare your current offer to our network anytime — free of charge.",
                },
                {
                  q: "Do you charge lender fees?",
                  a: "We are fully transparent about all fees. In many cases we are paid by the lender — meaning no broker fee out of your pocket. We disclose everything upfront.",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Ready to See Your Best Rate?",
              subheading:
                "5-minute pre-qualification. 50+ lenders shopped. Your best rate, delivered in 24 hours.",
              cta: "Get My Free Rate Comparison",
            },
          },
        ],
      },
      {
        id: "about",
        label: "About",
        slug: "/about",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline:
                "The [City] Mortgage Brokers Who Work for You — Not the Bank",
              subheadline:
                "We built [Business Name] on one principle: our clients deserve access to the best loan in the market — not just whatever a single bank offers that day.",
              cta1: "Meet Our Team",
              cta2: "Start Your Pre-Qualification",
              badge1: "🏦 Independent Brokers",
              badge2: "1,200+ Loans Closed",
              badge3: "NMLS Licensed",
              phone: "[Phone]",
            },
          },
          {
            id: "about",
            type: "about",
            visible: true,
            content: {
              heading: "Our Story",
              body: "[Business Name] was founded with one goal: give [City] borrowers the same access to competitive financing that institutional investors take for granted. As independent mortgage brokers, we have no loyalty to any single lender — only to you. We've closed over 1,200 loans and helped hundreds of [City] families into their first homes, lower their payments through smart refinancing, and access equity for the renovations, investments, and life events that matter most. Our team is licensed, transparent, and relentlessly focused on finding you the best loan available — faster than you'd believe possible.",
              founderName: "— The [Business Name] Team",
            },
          },
          {
            id: "certifications",
            type: "certifications",
            visible: true,
            content: {
              heading: "Our Licenses & Credentials",
              certs: JSON.stringify([
                "Licensed Mortgage Broker — NMLS #[License]",
                "State Licensed Mortgage Broker — [City]",
                "Mortgage Bankers Association Member",
                "Equal Housing Lender",
                "FHA/VA/USDA Approved Originator",
                "Annual CFPB Compliance Training",
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "Client Stories",
              testimonials: JSON.stringify([
                {
                  text: "We were turned down by our bank. [Business Name] found us a lender in 3 hours and closed our loan in 27 days. We would never have gotten our home without them.",
                  name: "James & Tanya W.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Refinanced twice with [Business Name] in five years — saved $290/mo the first time and $340/mo the second. They always tell me when the numbers make sense.",
                  name: "Linda A.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Work With Brokers Who Put You First",
              subheading:
                "Start with a free consultation and rate comparison — no hard pull, no obligation.",
              cta: "Get My Free Rate Comparison",
            },
          },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        slug: "/contact",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Talk to a Licensed Mortgage Broker Today",
              subheadline:
                "Questions about buying, refinancing, or your options? Call or text us — no bots, no automated menus, just expert answers.",
              cta1: "Call [Phone] Now",
              cta2: "Start Pre-Qualification Online",
              badge1: "📞 Licensed Brokers Available",
              badge2: "⚡ 24-Hour Pre-Approval",
              badge3: "🏦 50+ Lender Access",
              phone: "[Phone]",
            },
          },
          {
            id: "contact",
            type: "contact",
            visible: true,
            content: {
              heading: "Contact [Business Name]",
              phone: "[Phone]",
              address: "[Address]",
              hours: "Mon–Fri 8am–7pm | Sat 9am–2pm",
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "Why [City] Borrowers Choose [Business Name]",
              badges: JSON.stringify([
                "NMLS Licensed Brokers",
                "50+ Lender Network",
                "Zero Junk Fees",
                "Pre-Approval in 24 Hours",
                "1,200+ Loans Closed",
                "Equal Housing Lender",
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Your Home Loan Starts Here",
              subheading:
                "5-minute pre-qualification. No hard credit pull. 50+ lenders shopped for you.",
              cta: "Start My Pre-Qualification Now",
            },
          },
        ],
      },
    ],
  },

  // ── CHIROPRACTOR ──────────────────────────────────────────────────────────
  {
    id: "chiropractor-pain-free",
    nicheId: "chiropractor",
    name: "Pain-Free Living",
    tagline: "Teal, clean, wellness-focused",
    description:
      "A welcoming chiropractic practice website built around pain relief, new patient acquisition, and 24/7 AI appointment booking.",
    theme: {
      primaryColor: "#006B6B",
      secondaryColor: "#FFFFFF",
      accentColor: "#00897B",
      bgColor: "#003D3D",
      textColor: "#F0FAFA",
      headingFont: "clean",
      style: "clinical",
    },
    colorSwatches: ["#006B6B", "#00897B", "#FFFFFF"],
    sections: [],
    pages: [
      {
        id: "home",
        label: "Home",
        slug: "/",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline:
                "[Business Name] | Pain-Free Living Starts Here — [City]'s Premier Chiropractic Care",
              subheadline:
                "Back pain, neck pain, headaches, and sports injuries — gentle, effective adjustments that deliver lasting relief. New patients welcome. Same-week appointments available.",
              cta1: "Book Your First Appointment",
              cta2: "Learn About Our Care",
              badge1: "✅ 10,000+ Adjustments",
              badge2: "⭐ 4.9 Star Rating",
              badge3: "🙌 New Patients Welcome",
              phone: "[Phone]",
            },
          },
          {
            id: "stats",
            type: "stats",
            visible: true,
            content: {
              stats: JSON.stringify([
                { value: "10,000+", label: "Adjustments" },
                { value: "4.9★", label: "Patient Rating" },
                { value: "3 Visits", label: "Avg to Feel Relief" },
                { value: "Same Week", label: "New Patient Appts" },
              ]),
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Comprehensive Chiropractic Care in [City]",
              subheading:
                "Gentle, effective, and personalized care for every patient — from acute pain to ongoing wellness",
              services: JSON.stringify([
                {
                  icon: "🦴",
                  title: "Spinal Adjustments",
                  desc: "Precision spinal manipulation to restore alignment, reduce pain, and improve mobility",
                },
                {
                  icon: "🏃",
                  title: "Sports Injury Rehab",
                  desc: "Get back in the game faster — treatment plans designed for athletes and active patients",
                },
                {
                  icon: "😣",
                  title: "Neck & Back Pain",
                  desc: "The most common reason patients come to us — and one of the most treatable with chiropractic care",
                },
                {
                  icon: "🤕",
                  title: "Headache Relief",
                  desc: "Cervicogenic and tension headaches often respond dramatically to spinal adjustment — without medication",
                },
                {
                  icon: "🧍",
                  title: "Posture Correction",
                  desc: "Structural correction and strengthening for tech-neck, forward head posture, and desk-related issues",
                },
                {
                  icon: "💚",
                  title: "Wellness Care",
                  desc: "Ongoing maintenance adjustments to prevent pain, maintain alignment, and support whole-body health",
                },
              ]),
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading:
                "10,000+ Adjustments | 4.9 Stars | Licensed Chiropractor | New Patients Welcome",
              badges: JSON.stringify([
                "Licensed Doctor of Chiropractic",
                "10,000+ Adjustments Performed",
                "4.9-Star Google Rating",
                "Insurance Accepted",
                "New Patients Welcome",
                "Same-Week Appointments",
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "Your Path to Pain-Free Living",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Book Your Free Consultation & Exam",
                  desc: "We assess your spine, review your history, and explain exactly what we find — no obligation",
                },
                {
                  num: "2",
                  title: "Receive Your Personalized Treatment Plan",
                  desc: "A custom care plan based on your condition, goals, and lifestyle — not a one-size-fits-all protocol",
                },
                {
                  num: "3",
                  title: "Experience Lasting Pain Relief",
                  desc: "Most patients notice significant improvement within 3 visits. Ongoing wellness care keeps you feeling great.",
                },
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "Patient Success Stories",
              testimonials: JSON.stringify([
                {
                  text: "I had debilitating lower back pain for 3 years. After 4 visits with [Business Name], I was back to hiking and living my life. I genuinely wish I'd come sooner.",
                  name: "Sandra K.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "I was skeptical about chiropractic care. One visit changed my mind. My neck pain of 18 months was gone in two weeks. The team is exceptional.",
                  name: "Marcus T.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "As a runner, I get adjusted monthly. It keeps me injury-free and performing at my best. [Business Name] is a critical part of my training routine.",
                  name: "Rachel B.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Stop Living with Pain — Relief Is One Appointment Away",
              subheading:
                "Same-week new patient appointments available in [City]. Free consultation included with your first exam.",
              cta: "Book My Free Consultation",
            },
          },
        ],
      },
      {
        id: "services",
        label: "Services",
        slug: "/services",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Chiropractic Services Designed for Your Life",
              subheadline:
                "Whether you're dealing with acute pain, recovering from an injury, or maintaining your wellness — we have a care plan that fits.",
              cta1: "Book an Appointment",
              cta2: "Get a Free Consultation",
              badge1: "🦴 Licensed DC",
              badge2: "✅ Insurance Accepted",
              badge3: "🙌 New Patients Welcome",
              phone: "[Phone]",
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Complete Chiropractic Care Menu",
              subheading:
                "Every service is covered by most major insurance plans",
              services: JSON.stringify([
                {
                  icon: "🦴",
                  title: "Spinal Adjustments",
                  desc: "High-velocity, low-amplitude adjustments or gentle instrument-based technique for sensitive patients",
                },
                {
                  icon: "🏃",
                  title: "Sports Injury Rehab",
                  desc: "ACL support, rotator cuff care, IT band syndrome, plantar fasciitis — sport-specific protocols",
                },
                {
                  icon: "😣",
                  title: "Neck & Back Pain",
                  desc: "Disc herniations, pinched nerves, muscle spasm, and postural dysfunction — comprehensive assessment",
                },
                {
                  icon: "🤕",
                  title: "Headache & Migraine Care",
                  desc: "Cervicogenic headaches respond exceptionally well to chiropractic — often resolving without medication",
                },
                {
                  icon: "🧍",
                  title: "Posture Correction",
                  desc: "Structural assessment and corrective care for technology-related and occupational posture problems",
                },
                {
                  icon: "💚",
                  title: "Wellness & Maintenance",
                  desc: "Regular maintenance adjustments — weekly, bi-weekly, or monthly — to sustain health and prevent flare-ups",
                },
                {
                  icon: "🤰",
                  title: "Prenatal Chiropractic",
                  desc: "Webster Technique-certified care to support healthy pregnancy and reduce back and pelvic pain",
                },
                {
                  icon: "👶",
                  title: "Pediatric Chiropractic",
                  desc: "Gentle, safe care for children and infants — supporting healthy development and addressing common issues",
                },
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "What to Expect at Your First Visit",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Comprehensive Intake & History",
                  desc: "We review your health history, symptoms, and goals — taking time to understand the full picture",
                },
                {
                  num: "2",
                  title: "Physical & Chiropractic Exam",
                  desc: "Postural assessment, range of motion, orthopedic tests, and neurological screening as needed",
                },
                {
                  num: "3",
                  title: "Report of Findings",
                  desc: "Your doctor explains what they found in plain language — no medical jargon, no confusion",
                },
                {
                  num: "4",
                  title: "First Adjustment (if appropriate)",
                  desc: "Most patients receive their first adjustment on visit one — and feel a difference immediately",
                },
              ]),
            },
          },
          {
            id: "faq",
            type: "faq",
            visible: true,
            content: {
              heading: "Common Questions from New Patients",
              faqs: JSON.stringify([
                {
                  q: "Does chiropractic adjustment hurt?",
                  a: "Most patients are surprised by how comfortable adjustments feel. There may be mild soreness after the first visit (similar to starting a new workout) but most patients feel relief immediately.",
                },
                {
                  q: "How many visits will I need?",
                  a: "It depends on your condition and goals. Many acute pain patients see dramatic improvement in 3–6 visits. Chronic conditions and wellness care are ongoing. Your doctor will give you a clear treatment plan at your first visit.",
                },
                {
                  q: "Do you accept insurance?",
                  a: "We accept most major insurance plans including Blue Cross Blue Shield, Aetna, Cigna, and Medicare. We verify your benefits before your first appointment so there are no surprises.",
                },
                {
                  q: "Is chiropractic care safe?",
                  a: "Chiropractic is one of the safest drug-free healthcare approaches available. Serious complications are extremely rare — far rarer than the risks associated with pain medication or surgery for the same conditions.",
                },
                {
                  q: "Can I come in without a referral?",
                  a: "Yes — chiropractic care is accessible without a physician referral in all 50 states. Just call or book online and we'll get you in quickly.",
                },
                {
                  q: "Do you treat children?",
                  a: "Yes — we provide gentle, safe chiropractic care for patients of all ages, including infants and children. Pediatric adjustments use very light pressure appropriate for small bodies.",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Same-Week Appointments Available",
              subheading:
                "Don't wait weeks to start feeling better. We have new patient openings this week in [City].",
              cta: "Book My Appointment Now",
            },
          },
        ],
      },
      {
        id: "about",
        label: "About",
        slug: "/about",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline:
                "Dedicated to Your Long-Term Health — Not Just Symptom Relief",
              subheadline:
                "We founded [Business Name] because [City] deserved a chiropractic practice that treats the root cause — not just the symptoms.",
              cta1: "Meet Our Team",
              cta2: "Book a Consultation",
              badge1: "DC Licensed",
              badge2: "10,000+ Adjustments",
              badge3: "New Patients Welcome",
              phone: "[Phone]",
            },
          },
          {
            id: "about",
            type: "about",
            visible: true,
            content: {
              heading: "Our Philosophy of Care",
              body: "At [Business Name], we believe the body has a remarkable ability to heal itself — and chiropractic care is one of the most powerful tools to support that process. We don't just crack backs. We conduct thorough assessments, build individualized care plans, and educate every patient about their condition so they are empowered participants in their own health. Our doctor of chiropractic brings years of training and thousands of successful treatments to every patient encounter. We use evidence-based protocols, gentle techniques suitable for all ages and health levels, and a genuine commitment to your long-term wellbeing — not just getting you in and out the door.",
              founderName: "— [Business Name] Chiropractic Team",
            },
          },
          {
            id: "certifications",
            type: "certifications",
            visible: true,
            content: {
              heading: "Our Credentials & Training",
              certs: JSON.stringify([
                "Doctor of Chiropractic — State Licensed",
                "National Board of Chiropractic Examiners Certified",
                "Webster Technique Certified (Prenatal Care)",
                "Sports Chiropractic Certified",
                "Activator Methods Certified",
                "CPR/AED Certified",
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "Why Patients Stay with Us for Years",
              testimonials: JSON.stringify([
                {
                  text: "I've been a patient at [Business Name] for 4 years. They fixed my herniated disc when surgery was being recommended, and I've been pain-free ever since. I will never go anywhere else.",
                  name: "William A.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "My entire family comes here — my husband, me, and our three kids. The care is thorough, gentle, and effective for everyone. They're truly exceptional.",
                  name: "Jennifer M.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Experience the Difference",
              subheading:
                "Comprehensive care, real results, and a team that genuinely cares about your health — not just your next visit.",
              cta: "Book My First Appointment",
            },
          },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        slug: "/contact",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Book Your Appointment — We'd Love to Help",
              subheadline:
                "Same-week appointments available for new patients. Call, text, or book online — we make getting started easy.",
              cta1: "Call [Phone] to Schedule",
              cta2: "Book Online",
              badge1: "📅 Same-Week Availability",
              badge2: "✅ Insurance Accepted",
              badge3: "🙌 New Patients Welcome",
              phone: "[Phone]",
            },
          },
          {
            id: "contact",
            type: "contact",
            visible: true,
            content: {
              heading: "Contact [Business Name] Chiropractic",
              phone: "[Phone]",
              address: "[Address]",
              hours: "Mon–Thu 8am–6pm | Fri 8am–4pm | Sat by Appointment",
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "Why [City] Patients Choose Us",
              badges: JSON.stringify([
                "Licensed Doctor of Chiropractic",
                "Insurance Accepted",
                "New Patients Welcome",
                "Free First Consultation",
                "All Ages Treated",
                "Evidence-Based Care",
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Ready to Start Feeling Better?",
              subheading:
                "Book online or call now — same-week appointments available. We can't wait to help you.",
              cta: "Book My Free Consultation Today",
            },
          },
        ],
      },
    ],
  },

  // ── DENTAL ────────────────────────────────────────────────────────────────
  {
    id: "dental-smile-bright",
    nicheId: "dental",
    name: "Smile Bright",
    tagline: "White, bright blue, welcoming and modern",
    description:
      "A bright, welcoming dental practice website designed to fill new patient appointments, reduce no-shows, and build trust through transparency and convenience.",
    theme: {
      primaryColor: "#1565C0",
      secondaryColor: "#FFFFFF",
      accentColor: "#1976D2",
      bgColor: "#F0F7FF",
      textColor: "#0D2137",
      headingFont: "clean",
      style: "clinical",
    },
    colorSwatches: ["#1565C0", "#1976D2", "#E3F2FD"],
    sections: [],
    pages: [
      {
        id: "home",
        label: "Home",
        slug: "/",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline:
                "[Business Name] | Smile Brighter — [City]'s Most Welcoming Dental Practice",
              subheadline:
                "Routine cleanings, cosmetic dentistry, and emergency care — all in a comfortable, judgment-free environment. Same-day appointments available for new patients.",
              cta1: "Book a New Patient Appointment",
              cta2: "View Our Services",
              badge1: "😊 5,000+ Happy Patients",
              badge2: "⭐ 4.9 Star Rating",
              badge3: "📅 Same-Day Appointments",
              phone: "[Phone]",
            },
          },
          {
            id: "stats",
            type: "stats",
            visible: true,
            content: {
              stats: JSON.stringify([
                { value: "5,000+", label: "Happy Patients" },
                { value: "4.9★", label: "Google Rating" },
                { value: "Same Day", label: "Emergency Slots" },
                { value: "Insurance", label: "Accepted" },
              ]),
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Complete Dental Care for the Whole Family",
              subheading:
                "From routine cleanings to smile transformations — we offer everything your family needs under one roof",
              services: JSON.stringify([
                {
                  icon: "🦷",
                  title: "Routine Cleanings",
                  desc: "Professional cleanings, comprehensive exams, and digital X-rays — the foundation of lifelong oral health",
                },
                {
                  icon: "✨",
                  title: "Teeth Whitening",
                  desc: "In-office whitening delivers results up to 8 shades brighter in a single 60-minute appointment",
                },
                {
                  icon: "😁",
                  title: "Invisalign & Braces",
                  desc: "Straighten your smile discreetly with clear aligners or traditional braces — all ages treated",
                },
                {
                  icon: "🔧",
                  title: "Dental Implants",
                  desc: "The most natural-looking, permanent solution for missing teeth — we place and restore in-house",
                },
                {
                  icon: "🚨",
                  title: "Emergency Dentistry",
                  desc: "Toothache, broken tooth, lost filling? We have same-day emergency slots — call us now",
                },
                {
                  icon: "💎",
                  title: "Cosmetic Dentistry",
                  desc: "Veneers, bonding, and full smile makeovers — custom designed for your face and goals",
                },
              ]),
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading:
                "5,000+ Happy Patients | 4.9 Stars | Insurance Accepted | Same-Day Appointments",
              badges: JSON.stringify([
                "Licensed Dentist & Specialists",
                "5,000+ Patients Served",
                "Digital X-Rays — Lower Radiation",
                "Most Insurance Plans Accepted",
                "Same-Day Emergency Care",
                "Sedation Options Available",
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "Getting Started Is Easy",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Call or Book Online — Same-Day Slots Available",
                  desc: "New patient appointments available this week. We confirm within minutes.",
                },
                {
                  num: "2",
                  title: "Comprehensive Exam + Personalized Treatment Plan",
                  desc: "Digital X-rays, full exam, and a clear explanation of everything we find — in plain language, no pressure.",
                },
                {
                  num: "3",
                  title: "Leave with the Smile You've Always Wanted",
                  desc: "Whether it's a routine cleaning or a full smile transformation, we get you there comfortably and affordably.",
                },
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "What Our Patients Say",
              testimonials: JSON.stringify([
                {
                  text: "I had severe dental anxiety and hadn't been to a dentist in 7 years. The team at [Business Name] was so patient and gentle that I now go every 6 months — and actually look forward to it.",
                  name: "Amanda L.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Got Invisalign here and the transformation is incredible. The whole process was well-explained, affordable, and the results exceeded my expectations completely.",
                  name: "Tyler M.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "Tooth cracked on a Saturday afternoon. Called [Business Name] and they had me in within 2 hours. Fixed same day, no upsell, and the price was completely fair.",
                  name: "Denise R.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading:
                "New Patients Welcome — Same-Week Appointments Available",
              subheading:
                "We accept most insurance plans, offer flexible payment options, and make getting started completely stress-free.",
              cta: "Book My New Patient Appointment",
            },
          },
        ],
      },
      {
        id: "services",
        label: "Services",
        slug: "/services",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "Everything Your Smile Needs — All in One Place",
              subheadline:
                "General dentistry, cosmetic treatments, orthodontics, implants, and emergency care — comprehensive dental services for the whole family in [City].",
              cta1: "Book an Appointment",
              cta2: "View Our Pricing",
              badge1: "🦷 Family Dentistry",
              badge2: "💎 Cosmetic Specialists",
              badge3: "🚨 Emergency Care Available",
              phone: "[Phone]",
            },
          },
          {
            id: "services",
            type: "services",
            visible: true,
            content: {
              heading: "Our Full Dental Service Menu",
              subheading: "All services available for patients of all ages",
              services: JSON.stringify([
                {
                  icon: "🦷",
                  title: "Preventive Dentistry",
                  desc: "Cleanings, exams, X-rays, fluoride, sealants — the foundation of a healthy smile for life",
                },
                {
                  icon: "✨",
                  title: "Professional Teeth Whitening",
                  desc: "Zoom in-office whitening or custom take-home trays — results that last 1–2 years",
                },
                {
                  icon: "😁",
                  title: "Invisalign Clear Aligners",
                  desc: "Virtually invisible orthodontic treatment with predictable results — we are a certified Invisalign provider",
                },
                {
                  icon: "🔧",
                  title: "Dental Implants",
                  desc: "Single tooth, multiple teeth, or full-arch restoration — the permanent solution for missing teeth",
                },
                {
                  icon: "💎",
                  title: "Porcelain Veneers",
                  desc: "Ultra-thin, custom-crafted veneers that transform the color, shape, and symmetry of your smile",
                },
                {
                  icon: "🩹",
                  title: "Tooth-Colored Fillings",
                  desc: "Composite resin restorations that blend perfectly with your natural tooth color",
                },
                {
                  icon: "👑",
                  title: "Crowns & Bridges",
                  desc: "Ceramic and zirconia crowns with same-day options available in our digital dentistry suite",
                },
                {
                  icon: "🚨",
                  title: "Emergency Dental Care",
                  desc: "Toothache, trauma, broken tooth, or lost restoration — same-day emergency appointments reserved daily",
                },
                {
                  icon: "😴",
                  title: "Sedation Dentistry",
                  desc: "Nitrous oxide, oral conscious sedation, and IV sedation for anxious patients and complex procedures",
                },
                {
                  icon: "🦺",
                  title: "Root Canals & Extractions",
                  desc: "Gentle, efficient endodontic care using modern techniques that minimize discomfort and recovery time",
                },
              ]),
            },
          },
          {
            id: "process",
            type: "process",
            visible: true,
            content: {
              heading: "Your First Appointment — What to Expect",
              steps: JSON.stringify([
                {
                  num: "1",
                  title: "Easy Online Check-In",
                  desc: "Complete new patient forms online before you arrive — no clipboard, no wait",
                },
                {
                  num: "2",
                  title: "Digital X-Rays & Comprehensive Exam",
                  desc: "Low-radiation digital X-rays and a thorough exam with photos so you can see exactly what we see",
                },
                {
                  num: "3",
                  title: "Clear Treatment Plan with Pricing",
                  desc: "Your dentist explains everything found and presents a prioritized treatment plan with transparent pricing before any work begins",
                },
                {
                  num: "4",
                  title: "Treatment or Cleaning (if time allows)",
                  desc: "Many patients receive their cleaning and/or simple treatment on the first visit — leaving in better shape than they came in",
                },
              ]),
            },
          },
          {
            id: "faq",
            type: "faq",
            visible: true,
            content: {
              heading: "Questions from New Patients",
              faqs: JSON.stringify([
                {
                  q: "Do you accept my insurance?",
                  a: "We accept most major PPO dental insurance plans including Delta Dental, Aetna, Cigna, MetLife, and Guardian. We verify your benefits before your appointment. We also work with patients who have no insurance through our in-house membership plan.",
                },
                {
                  q: "I have dental anxiety — is that okay?",
                  a: "Absolutely, and you're not alone. We see anxious patients every day and our team is specially trained to make every visit calm and comfortable. We offer nitrous oxide and oral sedation for additional support.",
                },
                {
                  q: "How often should I come for a cleaning?",
                  a: "Most patients benefit from cleanings every 6 months. Patients with gum disease or high cavity risk may need visits every 3–4 months. Your dentist will recommend the right interval for you.",
                },
                {
                  q: "Do you offer payment plans?",
                  a: "Yes — we offer CareCredit and Sunbit financing with 0% interest options, plus our own in-house membership plan for patients without insurance that includes two cleanings per year and discounts on all services.",
                },
                {
                  q: "Can I bring my whole family?",
                  a: "We love treating families. We see patients from age 3 and up. Having everyone at the same practice makes scheduling easier and gives us a complete picture of your family's dental health over time.",
                },
                {
                  q: "What if I have a dental emergency?",
                  a: "Call our office at [Phone] — we reserve same-day emergency slots every day. If you call after hours, our voicemail provides an emergency callback number for urgent situations.",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Same-Week Appointments Available for New Patients",
              subheading:
                "Most insurance accepted. Flexible financing. Judgment-free care for every member of the family.",
              cta: "Book My Appointment Today",
            },
          },
        ],
      },
      {
        id: "about",
        label: "About",
        slug: "/about",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "A Dental Practice That Actually Cares",
              subheadline:
                "We built [Business Name] for every patient who has ever avoided the dentist because of anxiety, confusing bills, or feeling rushed. That ends here.",
              cta1: "Meet Our Team",
              cta2: "Book a New Patient Appointment",
              badge1: "😊 Judgment-Free",
              badge2: "5,000+ Patients",
              badge3: "Family Practice",
              phone: "[Phone]",
            },
          },
          {
            id: "about",
            type: "about",
            visible: true,
            content: {
              heading: "Our Story",
              body: "[Business Name] was founded with a simple but powerful conviction: dental care should feel like a partnership, not a transaction. We got into dentistry because we believe oral health is deeply connected to whole-body health and quality of life — and we want every patient in [City] to have access to excellent, honest, and comfortable dental care. Our practice is built on transparency. We show you X-rays on a screen and explain them in plain language. We give you a treatment plan with real pricing before we touch anything. We never push unnecessary procedures. We treat patients of all ages, all anxiety levels, and all stages of dental health without judgment. Whether you haven't been to a dentist in 10 years or you come every 6 months, you'll be treated with the same respect and care.",
              founderName: "— The [Business Name] Dental Team",
            },
          },
          {
            id: "certifications",
            type: "certifications",
            visible: true,
            content: {
              heading: "Our Credentials & Affiliations",
              certs: JSON.stringify([
                "Doctor of Dental Surgery (DDS) / Doctor of Medicine in Dentistry (DMD)",
                "American Dental Association Member",
                "State Dental Board Licensed",
                "Invisalign Certified Provider",
                "Implant Placement Certified",
                "OSHA Compliant & Infection Control Certified",
                "Nitrous Oxide & Oral Sedation Certified",
                "CPR/AED Certified — Entire Staff",
              ]),
            },
          },
          {
            id: "testimonials",
            type: "testimonials",
            visible: true,
            content: {
              heading: "Why [City] Patients Stay with Us for Years",
              testimonials: JSON.stringify([
                {
                  text: "I've been going to [Business Name] for 8 years and brought my entire family. They have never once pushed an unnecessary procedure, never given me a bill with surprise charges, and never made me feel rushed. That kind of integrity is everything.",
                  name: "Christopher J.",
                  city: "[City]",
                  stars: "5",
                },
                {
                  text: "I moved to [City] two years ago and found [Business Name] online. Best decision I made — the team is incredible, the office is beautiful, and my teeth have never been healthier.",
                  name: "Priya S.",
                  city: "[City]",
                  stars: "5",
                },
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Join Our [City] Dental Family",
              subheading:
                "New patient appointments available this week. We'd love to meet you.",
              cta: "Book Your First Appointment",
            },
          },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        slug: "/contact",
        sections: [
          {
            id: "hero",
            type: "hero",
            visible: true,
            content: {
              headline: "We're Ready to See You — Book Today",
              subheadline:
                "Same-week new patient appointments in [City]. Call, text, or book online — we make it easy.",
              cta1: "Call [Phone] Now",
              cta2: "Book Online",
              badge1: "📅 Same-Week Availability",
              badge2: "✅ Insurance Accepted",
              badge3: "😊 New Patients Welcome",
              phone: "[Phone]",
            },
          },
          {
            id: "contact",
            type: "contact",
            visible: true,
            content: {
              heading: "Contact [Business Name] Dental",
              phone: "[Phone]",
              address: "[Address]",
              hours: "Mon–Thu 8am–5pm | Fri 8am–2pm | Sat by Appointment",
            },
          },
          {
            id: "trust",
            type: "trust",
            visible: true,
            content: {
              heading: "Why Families in [City] Choose [Business Name]",
              badges: JSON.stringify([
                "Licensed DDS / DMD",
                "Most Insurance Accepted",
                "Same-Day Emergency Appointments",
                "Flexible Payment Plans",
                "All Ages Welcome",
                "5,000+ Happy Patients",
              ]),
            },
          },
          {
            id: "cta_banner",
            type: "cta_banner",
            visible: true,
            content: {
              heading: "Ready for a Healthier, Brighter Smile?",
              subheading:
                "Same-week appointments available. Most insurance accepted. We can't wait to meet you.",
              cta: "Book My New Patient Appointment",
            },
          },
        ],
      },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getWebsiteById(id: NicheWebsiteId): NicheWebsite | undefined {
  return NICHE_WEBSITES.find((w) => w.id === id);
}

export function getWebsitesByNiche(nicheId: NicheId): NicheWebsite[] {
  return NICHE_WEBSITES.filter((w) => w.nicheId === nicheId);
}

/** Returns the first (default) website variant for a given niche. */
export function getFirstWebsiteForNiche(
  nicheId: NicheId,
): NicheWebsite | undefined {
  return NICHE_WEBSITES.find((w) => w.nicheId === nicheId);
}

/** Maps user-facing display strings to normalized NicheId values. */
const NICHE_DISPLAY_TO_ID: Record<string, NicheId> = {
  plumbing: "plumbing",
  plumber: "plumbing",
  "med spa": "med-spa",
  medspa: "med-spa",
  "med-spa": "med-spa",
  hvac: "hvac",
  "heating and cooling": "hvac",
  restoration: "restoration",
  "water damage": "restoration",
  "carpet cleaning": "carpet-cleaning",
  "carpet-cleaning": "carpet-cleaning",
  carpet: "carpet-cleaning",
  roofing: "roofing",
  roofer: "roofing",
  "real estate": "real-estate",
  "real-estate": "real-estate",
  realtor: "real-estate",
  "real estate agents": "real-estate",
  "real estate agents/brokers": "real-estate",
  "real estate broker": "real-estate",
  mortgage: "mortgage",
  "mortgage broker": "mortgage",
  "mortgage brokers": "mortgage",
  chiropractor: "chiropractor",
  chiropractic: "chiropractor",
  dental: "dental",
  dentist: "dental",
  "dental practice": "dental",
};

/**
 * Normalizes a niche display string (e.g. "Med Spa", "Plumbing") to a NicheId.
 * Handles both display format and enum format. Falls back to "plumbing".
 */
export function normalizeNicheId(raw: string): NicheId {
  const key = raw.trim().toLowerCase();
  return NICHE_DISPLAY_TO_ID[key] ?? "plumbing";
}

export function getNicheOptions(): { id: NicheId; label: string }[] {
  return [
    { id: "plumbing", label: "Plumbing" },
    { id: "hvac", label: "HVAC" },
    { id: "med-spa", label: "Med Spa" },
    { id: "restoration", label: "Restoration" },
    { id: "carpet-cleaning", label: "Carpet Cleaning" },
    { id: "roofing", label: "Roofing" },
    { id: "real-estate", label: "Real Estate Agents/Brokers" },
    { id: "mortgage", label: "Mortgage Brokers" },
    { id: "chiropractor", label: "Chiropractor" },
    { id: "dental", label: "Dental Practices" },
  ];
}

/** Returns all sections for a website (multi-page: from all pages combined; legacy: from sections). */
export function getAllSections(website: NicheWebsite): NicheWebsiteSection[] {
  if (website.pages && website.pages.length > 0) {
    return website.pages.flatMap((p) => p.sections);
  }
  return website.sections;
}

/** Returns sections for a specific page (multi-page), or all sections (legacy). */
export function getSectionsForPage(
  website: NicheWebsite,
  pageId: string,
): NicheWebsiteSection[] {
  if (website.pages && website.pages.length > 0) {
    const page = website.pages.find((p) => p.id === pageId);
    return page?.sections ?? website.pages[0]?.sections ?? [];
  }
  return website.sections;
}

export function applyClientCustomizations(
  website: NicheWebsite,
  config: ClientWebsiteConfig,
  tenantData?: { name?: string; phone?: string; address?: string },
): NicheWebsite {
  const cust = config.customizations;
  const biz = cust.businessName ?? tenantData?.name ?? "[Business Name]";
  const phone = cust.phone ?? tenantData?.phone ?? "[Phone]";
  const address = cust.address ?? tenantData?.address ?? "[Address]";

  const replaceTokens = (str: string) =>
    str
      .replace(/\[Business Name\]/g, biz)
      .replace(/\[Phone\]/g, phone)
      .replace(/\[Address\]/g, address);

  const processContent = (
    content: Record<string, string | string[] | Record<string, string>[]>,
  ): Record<string, string | string[] | Record<string, string>[]> => {
    const out: Record<string, string | string[] | Record<string, string>[]> =
      {};
    for (const [k, v] of Object.entries(content)) {
      if (typeof v === "string") {
        out[k] = replaceTokens(v);
      } else {
        out[k] = v;
      }
    }
    return out;
  };

  const processSections = (
    sections: NicheWebsiteSection[],
  ): NicheWebsiteSection[] =>
    sections.map((section) => {
      const override = cust.sectionOverrides[section.id];
      const mergedContent = override
        ? { ...section.content, ...override }
        : section.content;
      const isHidden = cust.hiddenSections.includes(section.id);
      return {
        ...section,
        visible: !isHidden,
        content: processContent(
          mergedContent as Record<
            string,
            string | string[] | Record<string, string>[]
          >,
        ),
      };
    });

  const theme: NicheWebsiteTheme = {
    ...website.theme,
    primaryColor: cust.primaryColor ?? website.theme.primaryColor,
    secondaryColor: cust.secondaryColor ?? website.theme.secondaryColor,
    accentColor: cust.accentColor ?? website.theme.accentColor,
  };

  if (website.pages) {
    const customizedPages = website.pages.map((page) => ({
      ...page,
      sections: processSections(page.sections),
    }));
    return { ...website, pages: customizedPages, theme };
  }

  const customizedSections = processSections(website.sections);
  return { ...website, sections: customizedSections, theme };
}

// ── Default Demo Configs ──────────────────────────────────────────────────────
// Pre-seeded so clients always see a real website on first load (before admin assigns one)

const DEFAULT_DEMO_CONFIGS: Record<string, ClientWebsiteConfig> = {
  "tenant-oceanside": {
    tenantId: "tenant-oceanside",
    websiteId: "hvac-seasonal-comfort",
    isPublished: true,
    editingLocked: false,
    publishedUrl: "https://tenantoceanside.mybrf.site",
    customizations: {
      businessName: "Oceanside HVAC",
      phone: "(555) 201-4400",
      address: "742 Ocean Ave, Oceanside, CA",
      sectionOverrides: {},
      hiddenSections: [],
    },
    lastUpdated: new Date().toISOString(),
  },
  "tenant-plumbing": {
    tenantId: "tenant-plumbing",
    websiteId: "plumbing-emergency",
    isPublished: true,
    editingLocked: false,
    publishedUrl: "https://tenantplumbing.mybrf.site",
    customizations: {
      businessName: "Metro Plumbing Pro",
      phone: "(555) 388-7200",
      address: "1201 Main St, Dallas, TX",
      sectionOverrides: {},
      hiddenSections: [],
    },
    lastUpdated: new Date().toISOString(),
  },
  "tenant-medspa": {
    tenantId: "tenant-medspa",
    websiteId: "med-spa-luxury-results",
    isPublished: true,
    editingLocked: false,
    publishedUrl: "https://tenantmedspa.mybrf.site",
    customizations: {
      businessName: "Luxe Aesthetics & Med Spa",
      phone: "(555) 940-3300",
      address: "8800 Biscayne Blvd, Miami, FL",
      sectionOverrides: {},
      hiddenSections: [],
    },
    lastUpdated: new Date().toISOString(),
  },
  "tenant-demo": {
    tenantId: "tenant-demo",
    websiteId: "plumbing-local-trust",
    isPublished: false,
    editingLocked: false,
    publishedUrl: "https://tenantdemo.mybrf.site",
    customizations: {
      sectionOverrides: {},
      hiddenSections: [],
    },
    lastUpdated: new Date().toISOString(),
  },
};

// ── Default Preview Links ─────────────────────────────────────────────────────
// Pre-seeded so /preview/:previewId routes work on first load

const DEFAULT_PREVIEW_LINKS: PreviewLink[] = [
  {
    id: "prev_demo_plumber_emergency",
    nicheWebsiteId: "plumbing-emergency",
    niche: "plumbing",
    styleName: "Emergency Response",
    createdAt: new Date().toISOString(),
    isActive: true,
    label: "Plumber — Emergency Style",
  },
  {
    id: "prev_demo_plumber_local",
    nicheWebsiteId: "plumbing-local-trust",
    niche: "plumbing",
    styleName: "Local Trust",
    createdAt: new Date().toISOString(),
    isActive: true,
    label: "Plumber — Local Trust Style",
  },
  {
    id: "prev_demo_medspa_luxury",
    nicheWebsiteId: "med-spa-luxury-results",
    niche: "med-spa",
    styleName: "Luxury & Results",
    createdAt: new Date().toISOString(),
    isActive: true,
    label: "Med Spa — Luxury Style",
  },
  {
    id: "prev_demo_medspa_clinical",
    nicheWebsiteId: "med-spa-clean-clinical",
    niche: "med-spa",
    styleName: "Clean & Clinical",
    createdAt: new Date().toISOString(),
    isActive: true,
    label: "Med Spa — Clinical Style",
  },
];

// ── localStorage Helpers ───────────────────────────────────────────────────────

const STORAGE_KEY = "brf_client_website_configs";
const PREVIEW_LINKS_KEY = "brf_preview_links";

export function getClientWebsiteConfig(
  tenantId: string,
): ClientWebsiteConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const all = JSON.parse(raw) as Record<string, ClientWebsiteConfig>;
      // Return stored config if present
      if (all[tenantId]) return all[tenantId];
    }
    // Fall back to pre-seeded demo config
    return DEFAULT_DEMO_CONFIGS[tenantId] ?? null;
  } catch {
    return DEFAULT_DEMO_CONFIGS[tenantId] ?? null;
  }
}

export function saveClientWebsiteConfig(config: ClientWebsiteConfig): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw
      ? (JSON.parse(raw) as Record<string, ClientWebsiteConfig>)
      : {};
    all[config.tenantId] = config;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function getAllClientWebsiteConfigs(): Record<
  string,
  ClientWebsiteConfig
> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ClientWebsiteConfig>;
  } catch {
    return {};
  }
}

// ── Preview Link Helpers ───────────────────────────────────────────────────────

function generatePreviewId(): string {
  return `prev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createPreviewLink(
  websiteId: NicheWebsiteId,
  label?: string,
): PreviewLink {
  const website = getWebsiteById(websiteId);
  const link: PreviewLink = {
    id: generatePreviewId(),
    nicheWebsiteId: websiteId,
    niche: (website?.nicheId ?? "plumbing") as NicheId,
    styleName: website?.name ?? websiteId,
    createdAt: new Date().toISOString(),
    isActive: true,
    label,
  };
  const all = getAllPreviewLinks();
  all.push(link);
  localStorage.setItem(PREVIEW_LINKS_KEY, JSON.stringify(all));
  return link;
}

export function getAllPreviewLinks(): PreviewLink[] {
  try {
    const raw = localStorage.getItem(PREVIEW_LINKS_KEY);
    if (!raw) return [...DEFAULT_PREVIEW_LINKS];
    const stored = JSON.parse(raw) as PreviewLink[];
    // Merge stored with defaults, avoiding duplicates by id
    const storedIds = new Set(stored.map((l) => l.id));
    const merged = [
      ...stored,
      ...DEFAULT_PREVIEW_LINKS.filter((l) => !storedIds.has(l.id)),
    ];
    return merged;
  } catch {
    return [...DEFAULT_PREVIEW_LINKS];
  }
}

export function getPreviewLink(id: string): PreviewLink | undefined {
  return getAllPreviewLinks().find((l) => l.id === id);
}

export function revokePreviewLink(id: string): void {
  const all = getAllPreviewLinks().map((l) =>
    l.id === id ? { ...l, isActive: false } : l,
  );
  localStorage.setItem(PREVIEW_LINKS_KEY, JSON.stringify(all));
}

// ── Niche-Aware AI Suggestions, Section Recommendations & Content Library ──────

export interface NicheAISuggestion {
  id: string;
  suggestion: string;
  impact: "critical" | "high" | "medium" | "low";
  applyAction: string;
}

export interface NicheSectionRecommendation {
  id: string;
  sectionType: string;
  label: string;
  impact: "critical" | "high" | "medium";
  conversionNote: string;
}

export interface NicheContentLibraryData {
  headlines: string[];
  ctas: string[];
  trustBadges: string[];
  testimonials: string[];
}

const NICHE_AI_SUGGESTIONS: Record<NicheId, NicheAISuggestion[]> = {
  plumbing: [
    {
      id: "plumbing-emergency-badge",
      suggestion:
        "Add an emergency callout badge to your hero (increases conversions 34% for plumbers)",
      impact: "high",
      applyAction:
        "Add a bold '⚡ Emergency Service 24/7 — Call Now' badge directly under your hero headline with a red or yellow background.",
    },
    {
      id: "plumbing-drain-cleaning",
      suggestion:
        "Your Services page is missing drain cleaning — it's the #1 searched service in your area",
      impact: "high",
      applyAction:
        "Add a 'Drain Cleaning' service card to your Services section with hydro-jetting as a featured offering.",
    },
    {
      id: "plumbing-trust-badge",
      suggestion:
        "Add a 'Licensed & Insured' trust badge near your phone number",
      impact: "medium",
      applyAction:
        "Place 'Licensed & Insured | Google Guaranteed | BBB A+' badge row directly below your main phone number CTA.",
    },
  ],
  "med-spa": [
    {
      id: "medspa-hero-transformation",
      suggestion:
        "Your hero headline can be stronger — try leading with a transformation result, not a service name",
      impact: "high",
      applyAction:
        "Change your hero headline to focus on outcome: 'Look 10 Years Younger — Without Surgery' or 'Your Most Confident Skin Starts Here'.",
    },
    {
      id: "medspa-before-after",
      suggestion:
        "Add a before/after gallery section — it's the highest-converting section for med spas",
      impact: "high",
      applyAction:
        "Insert a before/after slider section on your home page below the hero, featuring your 3 most dramatic results.",
    },
    {
      id: "medspa-fda-badge",
      suggestion:
        "Add an 'FDA-Approved Treatments' trust badge to your services section",
      impact: "medium",
      applyAction:
        "Add trust badges: 'FDA-Approved Treatments Only | Board-Certified Providers | HIPAA Compliant' below your services heading.",
    },
  ],
  hvac: [
    {
      id: "hvac-emergency-badge",
      suggestion:
        "Add an emergency 24/7 badge — HVAC emergencies drive the most high-value calls",
      impact: "critical",
      applyAction:
        "Add a '🚨 24/7 Emergency HVAC Service' badge in your hero and a floating call button with emergency styling.",
    },
    {
      id: "hvac-ac-repair-lead",
      suggestion:
        "Your Services page should lead with AC repair in summer months",
      impact: "high",
      applyAction:
        "Reorder your services so AC Repair appears first with a seasonal badge like '❄️ AC Season — Limited Slots Available'.",
    },
    {
      id: "hvac-financing",
      suggestion:
        "Add a financing options badge — HVAC jobs are high-ticket and financing increases close rates",
      impact: "high",
      applyAction:
        "Add 'Financing Available — 0% Interest Options' badge near your pricing and in your hero CTA area.",
    },
  ],
  restoration: [
    {
      id: "restoration-emergency-hero",
      suggestion:
        "Lead with '24/7 Emergency Response' in your hero — restoration clients are in crisis mode",
      impact: "critical",
      applyAction:
        "Make '24/7 Emergency Response — We Arrive in 60 Minutes' the dominant headline with a red urgency border and emergency phone CTA.",
    },
    {
      id: "restoration-insurance-logos",
      suggestion: "Add insurance company logos to your trust section",
      impact: "high",
      applyAction:
        "Add a 'We Work With All Major Insurance Companies' section with State Farm, Allstate, Farmers, USAA, and Liberty Mutual logos.",
    },
    {
      id: "restoration-insurance-form",
      suggestion:
        "Your contact form should ask about insurance coverage to qualify leads faster",
      impact: "medium",
      applyAction:
        "Add 'Do you have homeowner's insurance?' as a required field with Yes/No/Not Sure options to your contact form.",
    },
  ],
  "carpet-cleaning": [
    {
      id: "carpet-before-after",
      suggestion:
        "Add before/after photos in a horizontal slider on your homepage — carpet cleaning is highly visual",
      impact: "high",
      applyAction:
        "Insert a horizontal before/after photo slider section below your hero showing dramatic cleaning transformations.",
    },
    {
      id: "carpet-free-room",
      suggestion:
        "Offer a free room deal prominently — it's the #1 carpet cleaning lead magnet",
      impact: "high",
      applyAction:
        "Add a 'Book 3 Rooms, Get 1 FREE' banner in your hero and as a sticky CTA at the bottom of the page.",
    },
    {
      id: "carpet-same-day",
      suggestion: "Add a 'Same Day Service' badge if applicable",
      impact: "medium",
      applyAction:
        "Add '⚡ Same-Day Available' badge to your hero and services section with a booking urgency note.",
    },
  ],
  roofing: [
    {
      id: "roofing-storm-cta",
      suggestion:
        "Add a storm damage inspection CTA to your hero — it's the highest-converting offer for roofers",
      impact: "critical",
      applyAction:
        "Add a 'Free Storm Damage Inspection' CTA button in your hero with '⛈️ Recent Storm? Get a Free Inspection Today' copy.",
    },
    {
      id: "roofing-financing",
      suggestion: "Add financing badge — roofing is high-ticket",
      impact: "high",
      applyAction:
        "Add 'Financing Available — $0 Down Options' badge near pricing and in hero. Most roof jobs are $7k+ so financing is critical.",
    },
    {
      id: "roofing-license",
      suggestion:
        "Add your contractor license number visibly — it builds massive trust in roofing",
      impact: "high",
      applyAction:
        "Add 'License #[Your Number] | Fully Bonded & Insured | GAF Certified' to your footer and near your main CTAs.",
    },
  ],
  "real-estate": [
    {
      id: "realestate-response-speed",
      suggestion:
        "Add a '78% of buyers go with the first agent who responds' stat to your hero — it's the most powerful urgency signal in real estate",
      impact: "critical",
      applyAction:
        "Add a badge under your hero headline: '78% of buyers choose the first agent who calls back — we respond in minutes.'",
    },
    {
      id: "realestate-free-valuation",
      suggestion:
        "Add a free home valuation CTA — it's the #1 lead magnet for real estate sellers",
      impact: "high",
      applyAction:
        "Add a 'Get Your Free Home Valuation' CTA button in your hero and as a sticky bottom bar on mobile. Free valuations convert sellers at 3x the rate of generic CTAs.",
    },
    {
      id: "realestate-testimonials",
      suggestion:
        "Add specific result testimonials — 'sold in X days for $Y over asking' converts dramatically better than general praise",
      impact: "high",
      applyAction:
        "Update your testimonials to include specific numbers: days on market, sale price vs asking, and buyer wins. Specific = credible.",
    },
  ],
  mortgage: [
    {
      id: "mortgage-preapproval-speed",
      suggestion:
        "Lead with '24-Hour Pre-Approval' in your hero — response speed is the #1 decision factor for mortgage borrowers",
      impact: "critical",
      applyAction:
        "Make '24-Hour Pre-Approval Letter' the primary CTA and headline element. Add '⚡ Pre-Approval in Hours, Not Days' badge to your hero.",
    },
    {
      id: "mortgage-lender-count",
      suggestion:
        "Prominently display your lender network count — '50+ lenders shopped' builds immediate credibility over any single bank",
      impact: "high",
      applyAction:
        "Add '50+ Lenders Shopped For You' as a prominent trust badge in your hero and services sections.",
    },
    {
      id: "mortgage-rate-comparison",
      suggestion:
        "Add a 'Compare Your Rate' CTA — it's the most effective way to start a conversation with rate-shopping borrowers",
      impact: "high",
      applyAction:
        "Add a 'Get Your Rate Comparison' button as a secondary CTA in your hero alongside your pre-qualification CTA.",
    },
  ],
  chiropractor: [
    {
      id: "chiro-new-patient-offer",
      suggestion:
        "Add a 'New Patient Special' offer — a discounted or free first exam reduces the barrier to booking for first-time chiropractic patients",
      impact: "critical",
      applyAction:
        "Add 'Free New Patient Consultation & Exam ($95 Value)' as a hero badge and CTA. New patient offers increase first-time bookings by 40%+.",
    },
    {
      id: "chiro-insurance",
      suggestion:
        "Add insurance acceptance badges prominently — most patients assume chiropractic is out of pocket",
      impact: "high",
      applyAction:
        "Add 'Most Insurance Plans Accepted | Blue Cross | Aetna | Cigna | Medicare' to your hero and contact page. This single change increases inquiry volume significantly.",
    },
    {
      id: "chiro-3-visit-claim",
      suggestion:
        "Add a '3-visit relief guarantee' or similar outcome claim — chiropractic patients want to know how quickly they'll feel better",
      impact: "high",
      applyAction:
        "Add 'Most patients notice significant relief within 3 visits' as a callout near your services. Specific outcome claims dramatically reduce new patient hesitation.",
    },
  ],
  dental: [
    {
      id: "dental-anxiety-messaging",
      suggestion:
        "Add 'We see anxious patients every day' messaging — 60% of Americans have dental anxiety, and targeting it directly converts the highest-hesitancy prospects",
      impact: "critical",
      applyAction:
        "Add a 'Dental Anxiety? We've Got You' section or badge to your hero or services page. Explicitly welcoming anxious patients captures a huge underserved segment.",
    },
    {
      id: "dental-same-day",
      suggestion:
        "Add 'Same-Day Emergency Appointments' prominently — emergency dental is the highest-urgency and highest-converting search in dentistry",
      impact: "high",
      applyAction:
        "Add '🚨 Same-Day Emergency Slots Available — Call Now' as a badge in your hero and as a dedicated section on your services page.",
    },
    {
      id: "dental-insurance",
      suggestion:
        "List specific insurance plans accepted — vague 'insurance accepted' language leaves patients unsure. Naming plans converts 2x better.",
      impact: "high",
      applyAction:
        "Update your trust badges to name specific plans: 'Delta Dental, Aetna, Cigna, MetLife, Guardian — accepted here.'",
    },
  ],
};

const NICHE_SECTION_RECOMMENDATIONS: Record<
  NicheId,
  NicheSectionRecommendation[]
> = {
  plumbing: [
    {
      id: "plumbing-rec-emergency-banner",
      sectionType: "cta_banner",
      label: "Emergency 24/7 Banner",
      impact: "critical",
      conversionNote: "⚡ Critical for plumbers — drives 40%+ of inbound calls",
    },
    {
      id: "plumbing-rec-trust",
      sectionType: "trust",
      label: "Trust Badges Section",
      impact: "high",
      conversionNote: "+22% conversion lift for Plumbing",
    },
    {
      id: "plumbing-rec-reviews",
      sectionType: "testimonials",
      label: "Review Carousel",
      impact: "high",
      conversionNote: "+28% conversion for local service businesses",
    },
    {
      id: "plumbing-rec-process",
      sectionType: "process",
      label: "How It Works Section",
      impact: "medium",
      conversionNote: "Reduces 'how long will it take?' calls by 35%",
    },
    {
      id: "plumbing-rec-faq",
      sectionType: "faq",
      label: "FAQ Section",
      impact: "medium",
      conversionNote: "Reduces bounce rate — answers common objections",
    },
  ],
  "med-spa": [
    {
      id: "medspa-rec-before-after",
      sectionType: "before_after",
      label: "Before/After Gallery",
      impact: "critical",
      conversionNote: "⚡ #1 converting section for med spas",
    },
    {
      id: "medspa-rec-trust",
      sectionType: "trust",
      label: "Trust & Credentials",
      impact: "high",
      conversionNote:
        "+31% conversion — FDA/Board Cert badges build confidence",
    },
    {
      id: "medspa-rec-testimonials",
      sectionType: "testimonials",
      label: "Client Testimonials",
      impact: "high",
      conversionNote: "+28% conversion for aesthetic services",
    },
    {
      id: "medspa-rec-certifications",
      sectionType: "certifications",
      label: "Certifications Section",
      impact: "medium",
      conversionNote:
        "Compliance + credibility — reduces consultation no-shows",
    },
    {
      id: "medspa-rec-faq",
      sectionType: "faq",
      label: "FAQ Section",
      impact: "medium",
      conversionNote: "Addresses injection fears and downtime questions",
    },
  ],
  hvac: [
    {
      id: "hvac-rec-emergency",
      sectionType: "cta_banner",
      label: "Emergency/24-7 Banner",
      impact: "critical",
      conversionNote: "⚡ HVAC emergencies are your highest-margin calls",
    },
    {
      id: "hvac-rec-trust",
      sectionType: "trust",
      label: "Trust & Certifications",
      impact: "high",
      conversionNote: "NATE certification = +19% close rate vs uncertified",
    },
    {
      id: "hvac-rec-testimonials",
      sectionType: "testimonials",
      label: "Review Carousel",
      impact: "high",
      conversionNote:
        "+28% conversion — social proof for high-ticket decisions",
    },
    {
      id: "hvac-rec-process",
      sectionType: "process",
      label: "How It Works",
      impact: "medium",
      conversionNote: "Sets expectations — reduces 'what will it cost?' calls",
    },
    {
      id: "hvac-rec-faq",
      sectionType: "faq",
      label: "FAQ Section",
      impact: "medium",
      conversionNote: "Repair vs. replace FAQ reduces buyer hesitation by 24%",
    },
  ],
  restoration: [
    {
      id: "restoration-rec-emergency",
      sectionType: "cta_banner",
      label: "Emergency Response Banner",
      impact: "critical",
      conversionNote: "⚡ Crisis mode prospects need immediate reassurance",
    },
    {
      id: "restoration-rec-trust",
      sectionType: "trust",
      label: "Insurance Partner Logos",
      impact: "high",
      conversionNote: "+38% — insurance co. logos convert restoration leads",
    },
    {
      id: "restoration-rec-testimonials",
      sectionType: "testimonials",
      label: "Customer Stories",
      impact: "high",
      conversionNote: "Emotional stories drive action in crisis situations",
    },
    {
      id: "restoration-rec-certifications",
      sectionType: "certifications",
      label: "IICRC Certifications",
      impact: "medium",
      conversionNote: "IICRC badge = industry standard credibility signal",
    },
    {
      id: "restoration-rec-process",
      sectionType: "process",
      label: "Our Process Section",
      impact: "medium",
      conversionNote: "Reduces anxiety — shows the path from chaos to fixed",
    },
  ],
  "carpet-cleaning": [
    {
      id: "carpet-rec-before-after",
      sectionType: "before_after",
      label: "Before/After Photo Slider",
      impact: "critical",
      conversionNote: "⚡ Visual proof = #1 carpet cleaning conversion driver",
    },
    {
      id: "carpet-rec-trust",
      sectionType: "trust",
      label: "Trust Badges",
      impact: "high",
      conversionNote: "Pet-safe + eco-friendly = +24% for family households",
    },
    {
      id: "carpet-rec-testimonials",
      sectionType: "testimonials",
      label: "Review Carousel",
      impact: "high",
      conversionNote:
        "+28% conversion — before/after plus reviews = winning combo",
    },
    {
      id: "carpet-rec-process",
      sectionType: "process",
      label: "How We Clean Section",
      impact: "medium",
      conversionNote:
        "Explains truck-mount vs portable — educates for conversion",
    },
    {
      id: "carpet-rec-faq",
      sectionType: "faq",
      label: "FAQ Section",
      impact: "medium",
      conversionNote: "Drying time FAQ reduces booking hesitation by 18%",
    },
  ],
  roofing: [
    {
      id: "roofing-rec-storm-cta",
      sectionType: "cta_banner",
      label: "Storm Damage Inspection CTA",
      impact: "critical",
      conversionNote: "⚡ Highest-converting roofing offer — free inspection",
    },
    {
      id: "roofing-rec-certifications",
      sectionType: "certifications",
      label: "Manufacturer Certifications",
      impact: "high",
      conversionNote: "GAF Certified = extended warranty = higher close rate",
    },
    {
      id: "roofing-rec-testimonials",
      sectionType: "testimonials",
      label: "Review Carousel",
      impact: "high",
      conversionNote: "+28% — high-ticket buyers need extra social proof",
    },
    {
      id: "roofing-rec-trust",
      sectionType: "trust",
      label: "Trust & License Badges",
      impact: "high",
      conversionNote: "License # visible = +29% trust for roofing searches",
    },
    {
      id: "roofing-rec-process",
      sectionType: "process",
      label: "Our Process Section",
      impact: "medium",
      conversionNote: "Drone inspection process = strong differentiator",
    },
  ],
  "real-estate": [
    {
      id: "realestate-rec-response-cta",
      sectionType: "cta_banner",
      label: "Fast Response CTA Banner",
      impact: "critical",
      conversionNote: "⚡ 78% rule — first agent to respond wins the client",
    },
    {
      id: "realestate-rec-testimonials",
      sectionType: "testimonials",
      label: "Results Testimonials",
      impact: "high",
      conversionNote:
        "+34% — specific results ('sold in 9 days, $22K over asking') convert sellers",
    },
    {
      id: "realestate-rec-process",
      sectionType: "process",
      label: "Buyer/Seller Process",
      impact: "high",
      conversionNote:
        "Clear 3-step process reduces decision anxiety for first-timers",
    },
    {
      id: "realestate-rec-trust",
      sectionType: "trust",
      label: "NAR/License Trust Badges",
      impact: "high",
      conversionNote: "REALTOR® badge and license # = professional credibility",
    },
    {
      id: "realestate-rec-faq",
      sectionType: "faq",
      label: "FAQ Section",
      impact: "medium",
      conversionNote:
        "Commission FAQ reduces the #1 hesitation for first-time sellers",
    },
  ],
  mortgage: [
    {
      id: "mortgage-rec-preapproval",
      sectionType: "cta_banner",
      label: "Pre-Qualification CTA",
      impact: "critical",
      conversionNote:
        "⚡ 24-hr pre-approval offer drives highest conversion in mortgage",
    },
    {
      id: "mortgage-rec-trust",
      sectionType: "trust",
      label: "NMLS License & Lender Network Badges",
      impact: "high",
      conversionNote:
        "License # + '50+ lenders' = instant trust vs. single bank",
    },
    {
      id: "mortgage-rec-process",
      sectionType: "process",
      label: "Loan Process Steps",
      impact: "high",
      conversionNote:
        "Step-by-step process removes 'what happens next?' anxiety",
    },
    {
      id: "mortgage-rec-testimonials",
      sectionType: "testimonials",
      label: "Rate/Speed Testimonials",
      impact: "high",
      conversionNote:
        "+31% — 'saved $380/mo' testimonials trigger action immediately",
    },
    {
      id: "mortgage-rec-faq",
      sectionType: "faq",
      label: "FAQ Section",
      impact: "medium",
      conversionNote:
        "Down payment FAQ is #1 barrier — addressing it doubles inquiries",
    },
  ],
  chiropractor: [
    {
      id: "chiro-rec-new-patient",
      sectionType: "cta_banner",
      label: "New Patient Offer Banner",
      impact: "critical",
      conversionNote:
        "⚡ Free first exam offer — reduces hesitation for first-time patients by 40%",
    },
    {
      id: "chiro-rec-testimonials",
      sectionType: "testimonials",
      label: "Patient Success Stories",
      impact: "high",
      conversionNote:
        "+36% conversion — outcome stories ('4 visits fixed 3-year back pain') convert skeptics",
    },
    {
      id: "chiro-rec-trust",
      sectionType: "trust",
      label: "Insurance & License Badges",
      impact: "high",
      conversionNote:
        "Insurance accepted badge = removes #1 barrier to booking",
    },
    {
      id: "chiro-rec-process",
      sectionType: "process",
      label: "What to Expect Section",
      impact: "high",
      conversionNote:
        "Fear of the unknown is the #1 reason people don't book — process section eliminates it",
    },
    {
      id: "chiro-rec-faq",
      sectionType: "faq",
      label: "FAQ Section",
      impact: "medium",
      conversionNote:
        "'Does it hurt?' FAQ directly addresses the #1 new patient fear",
    },
  ],
  dental: [
    {
      id: "dental-rec-emergency",
      sectionType: "cta_banner",
      label: "Emergency Same-Day Banner",
      impact: "critical",
      conversionNote:
        "⚡ Emergency dental = highest urgency search — same-day CTA converts immediately",
    },
    {
      id: "dental-rec-testimonials",
      sectionType: "testimonials",
      label: "Patient Testimonials",
      impact: "high",
      conversionNote:
        "+29% conversion — anxiety patients need proof others had a good experience",
    },
    {
      id: "dental-rec-trust",
      sectionType: "trust",
      label: "Insurance & Sedation Trust Badges",
      impact: "high",
      conversionNote:
        "Naming specific insurance plans converts 2x vs 'insurance accepted'",
    },
    {
      id: "dental-rec-process",
      sectionType: "process",
      label: "First Visit Walkthrough",
      impact: "high",
      conversionNote:
        "Anxious patients book more when they know exactly what to expect step-by-step",
    },
    {
      id: "dental-rec-faq",
      sectionType: "faq",
      label: "FAQ Section",
      impact: "medium",
      conversionNote:
        "Dental anxiety FAQ is highest-traffic content — converts fence-sitters",
    },
  ],
};

const NICHE_CONTENT_LIBRARY: Record<NicheId, NicheContentLibraryData> = {
  plumbing: {
    headlines: [
      "Fast, Reliable Plumbing — Available 24/7",
      "Pipe Burst? Drain Clogged? We're On The Way",
      "[City]'s Most Trusted Plumber — Serving Families Since 2008",
      "Licensed Plumbers. Honest Prices. Same-Day Service.",
      "We Fix It Right The First Time — Guaranteed",
      "Your [City] Emergency Plumber — 60-Minute Response",
      "No Surprise Fees. No Upsells. Just Great Plumbing.",
      "Family-Owned Plumbing That [City] Trusts",
    ],
    ctas: [
      "Call Now — We Answer 24/7",
      "Get a Free Estimate",
      "Book Same-Day Service",
      "Call [Phone] — Emergency Line",
      "Schedule My Appointment",
      "Get My Free Quote",
      "Request Emergency Service",
      "Book a Licensed Plumber Today",
    ],
    trustBadges: [
      "Licensed Master Plumber",
      "Google Guaranteed",
      "60-Min Emergency Response",
      "BBB Accredited A+",
      "Same-Day Service Available",
      "100% Satisfaction Guarantee",
      "No-Surprise Pricing",
      "Licensed & Insured — $2M Coverage",
      "1-Year Labor Warranty",
    ],
    testimonials: [
      "Pipe burst at 2am — they arrived in 45 minutes and saved my floors. Life savers.",
      "Fair pricing, zero upsells. Will never call anyone else for plumbing in [City].",
      "They fixed an issue three other plumbers couldn't find. Truly skilled technicians.",
      "Professional, clean, and completely honest. My go-to for everything plumbing.",
      "Same-day service and flat-rate pricing. Exactly what you want in an emergency.",
    ],
  },
  "med-spa": {
    headlines: [
      "Your Most Confident Self Starts Here",
      "Look Your Best. Feel Confident. Start Today.",
      "Medical-Grade Results. Luxury Experience.",
      "Transform Your Skin. Transform Your Confidence.",
      "Where Science Meets Beauty — [City]'s Premier Med Spa",
      "Natural Results. Exceptional Care. Zero Pressure.",
      "Botox, Fillers, Laser — Customized For You",
      "Award-Winning Aesthetic Care in [City]",
    ],
    ctas: [
      "Book a Complimentary Consultation",
      "Claim My $50 New Patient Offer",
      "Reserve Your Consultation",
      "Book My Treatment",
      "See Our Results",
      "Start My Transformation",
      "Schedule a Free Consultation",
      "View Treatment Menu",
    ],
    trustBadges: [
      "Board-Certified Medical Director",
      "FDA-Approved Treatments Only",
      "HIPAA Compliant Facility",
      "AmSpa Member",
      "5-Star Client Experience",
      "CoolSculpting Certified Providers",
      "Licensed Aesthetic Nurses on Staff",
      "10+ Years in Aesthetic Medicine",
    ],
    testimonials: [
      "I've tried 3 med spas. This is the only place where I left looking exactly how I envisioned.",
      "Natural results, no 'overdone' look. They genuinely care about enhancing your natural beauty.",
      "Best investment I've ever made in myself. The team is brilliant and the facility is stunning.",
      "I was nervous about fillers for years. One consultation and I felt completely at ease.",
      "My skin hasn't looked this good since my 20s. Life-changing results from a world-class team.",
    ],
  },
  hvac: {
    headlines: [
      "Year-Round Comfort for Your [City] Home",
      "Heating & Cooling You Can Count On — 24/7",
      "NATE-Certified HVAC Technicians in [City]",
      "AC Out? Furnace Down? We're On The Way",
      "Expert HVAC Service — All Brands, All Makes",
      "Stay Cool. Stay Warm. Stay Comfortable.",
      "Same-Day HVAC Service Available in [City]",
      "Trusted by 800+ [City] Homeowners",
    ],
    ctas: [
      "Schedule a Free Tune-Up",
      "Get a Free System Quote",
      "Book Emergency Service",
      "Request a Free Estimate",
      "Schedule Service Now",
      "Get an Energy Efficiency Report",
      "Book My AC Service",
      "Call for Emergency HVAC Help",
    ],
    trustBadges: [
      "NATE Certified Technicians",
      "EPA 608 Certified",
      "Carrier Factory Authorized",
      "All Major Brands Serviced",
      "24/7 Emergency Service",
      "Same-Day Appointments",
      "Financing Available",
      "10-Year Labor Warranty on New Systems",
    ],
    testimonials: [
      "AC went out in 98-degree heat. Fixed in under 3 hours. Absolutely incredible service.",
      "Signed up for their maintenance plan and my energy bill dropped 22%. Worth every penny.",
      "Professional, clean, and honest. Told me I could repair instead of replace. Trustworthy team.",
      "New system runs perfectly — installed on time, on budget, and cleaned up perfectly after.",
      "Best HVAC company in [City]. Quick response, fair pricing, and they actually explain everything.",
    ],
  },
  restoration: {
    headlines: [
      "Disaster Hits Fast. We Respond Faster.",
      "24/7 Emergency Water, Fire & Mold Restoration",
      "IICRC-Certified Crews On-Site Within 60 Minutes",
      "We Restore Your Home and Handle Your Insurance",
      "Water Damage? Fire Damage? Call Us Now.",
      "From Crisis to Clean — Full-Service Restoration",
      "One Call. Total Restoration. No Insurance Headaches.",
      "Emergency Restoration — [City]'s Most Trusted Crew",
    ],
    ctas: [
      "Call Our Emergency Line Now",
      "Get Immediate Help",
      "Report Damage — We Answer 24/7",
      "Schedule Free Assessment",
      "Start My Claim Process",
      "Call [Phone] — Emergency Response",
      "Get Immediate Dispatch",
      "Free Damage Assessment",
    ],
    trustBadges: [
      "IICRC Certified",
      "60-Minute Emergency Response",
      "We Handle Insurance Billing",
      "Licensed & Insured",
      "Works With All Major Carriers",
      "State Farm Preferred Contractor",
      "Full Reconstruction Capability",
      "Free Damage Assessment",
    ],
    testimonials: [
      "Arrived within an hour and had fans running that night. Saved our floors and handled insurance perfectly.",
      "After the fire, I had no idea where to start. This team guided us through every single step.",
      "Complete water damage remediation in 4 days. Insurance approved. Zero out of pocket.",
      "Mold found behind walls. Fully remediated with clearance documentation. Professional throughout.",
      "They handled everything — assessment, extraction, drying, reconstruction. One call, total solution.",
    ],
  },
  "carpet-cleaning": {
    headlines: [
      "Fresher, Cleaner Carpets — Guaranteed",
      "Professional Steam Cleaning — Same-Day Available",
      "Your Carpets Cleaned Like New — Truck-Mounted Power",
      "Pet Odors Gone. Stains Removed. Carpets Transformed.",
      "[City]'s Highest-Rated Carpet Cleaning Service",
      "Deep Clean. Fast Dry. 100% Satisfaction Guaranteed.",
      "Residential & Commercial Carpet Cleaning in [City]",
      "Book 3 Rooms — Get 1 FREE",
    ],
    ctas: [
      "Get a Free Quote",
      "Book My Cleaning",
      "Claim My Free Room Offer",
      "Schedule Same-Day Cleaning",
      "Book Online — Easy Scheduling",
      "Get My Instant Price",
      "Reserve My Slot",
      "Call for Same-Day Availability",
    ],
    trustBadges: [
      "Truck-Mounted Equipment",
      "Pet & Kid Safe Solutions",
      "2–4 Hour Dry Time",
      "Satisfaction Guaranteed",
      "Licensed & Insured",
      "Eco-Friendly Cleaning",
      "Same-Day Available",
      "100% Non-Toxic Products",
    ],
    testimonials: [
      "Our carpets looked brand new after years of use and two dogs. Incredible transformation.",
      "They turned over 4 apartments in one day. Every carpet passed move-in inspection perfectly.",
      "Did our entire office over a weekend — efficient, quiet, and spotless by Monday morning.",
      "Old pet stains we thought were permanent — completely gone. The before/after was shocking.",
      "Fastest drying carpets I've ever had cleaned. Walking on them within 2 hours. Impressive.",
    ],
  },
  roofing: {
    headlines: [
      "Protect Your Home From the Top Down",
      "Free Storm Damage Inspection — Book Today",
      "Expert Roofing — Licensed, Certified, Trusted",
      "Roof Repair & Replacement — [City]'s Best Roofers",
      "GAF Certified Contractor — Lifetime Warranty Available",
      "Storm Damage Specialists — We Handle Insurance Claims",
      "Free Drone Inspection — No Obligation",
      "400+ 5-Star Reviews in [City]",
    ],
    ctas: [
      "Get a Free Roof Inspection",
      "Book My Free Drone Inspection",
      "Get a Free Estimate",
      "Schedule Storm Damage Assessment",
      "Claim My Free Inspection",
      "Start My Insurance Claim",
      "Book My Free Roof Check",
      "Call [Phone] for Immediate Help",
    ],
    trustBadges: [
      "GAF Certified Contractor",
      "Owens Corning Preferred",
      "Free Drone Inspection",
      "Insurance Claim Experts",
      "Lifetime Warranty Available",
      "Licensed & Bonded",
      "5-Star Google Rated",
      "Manufacturer Certified",
    ],
    testimonials: [
      "Got 3 quotes. These guys were professional from day one, hit their timeline perfectly.",
      "Hail storm destroyed my roof. They worked with insurance — I paid almost nothing out-of-pocket.",
      "Fast, honest, and didn't upsell a full replacement when I only needed a repair. Rare integrity.",
      "Drone inspection found damage I couldn't see. Insurance approved the claim same week. Seamless.",
      "Complete roof replacement in 2 days. Crew was clean, professional, and respectful of our property.",
    ],
  },
  "real-estate": {
    headlines: [
      "Your Trusted [City] Real Estate Partner — Buying or Selling",
      "78% of Buyers Go With the First Agent Who Responds. Be First.",
      "[City]'s Top-Rated Real Estate Agents — 500+ Homes Sold",
      "Sell Faster, Buy Smarter — [City] Market Experts",
      "From Offer to Closing — Expert Real Estate Representation",
      "First-Time Buyer? We Walk You Through Every Step.",
      "Free Home Valuation — Know What Your [City] Home Is Worth",
      "Top 1% Agents in [City] — Results That Speak for Themselves",
    ],
    ctas: [
      "Schedule a Free Consultation",
      "Get Your Free Home Valuation",
      "Search [City] Listings",
      "Get Pre-Approved Today",
      "See What Your Home Is Worth",
      "Talk to an Agent Now",
      "Book a Buyer Consultation",
      "List My Home for Top Dollar",
    ],
    trustBadges: [
      "Licensed REALTOR®",
      "Top 1% [City] Agents",
      "500+ Homes Sold",
      "Certified Negotiation Expert",
      "4.9-Star Google Rating",
      "NAR Member",
      "Free Home Valuations",
      "Seller's Representative Specialist",
    ],
    testimonials: [
      "Sold in 9 days, $22,000 over asking. After two failed listings with other agents, these guys delivered.",
      "As first-time buyers in a competitive market, our agent held our hand through every step. We won the bid.",
      "They found the right investment property in 3 weeks and the cap rate analysis was spot-on. Outstanding.",
      "Relocated from out of state — they managed the whole transaction remotely. Smooth, professional, excellent.",
      "Four properties bought and sold with [Business Name] over 10 years. They never disappoint.",
    ],
  },
  mortgage: {
    headlines: [
      "Get Home Loan Ready in 24 Hours — [City]'s Best Mortgage Brokers",
      "We Shop 50+ Lenders So You Get the Best Rate",
      "Pre-Approval in Hours, Not Days — [City] Mortgage Brokers",
      "Lower Your Rate. Reduce Your Payment. We Show You How.",
      "1,200+ Loans Closed — [City]'s Most Trusted Mortgage Team",
      "VA Loans, FHA, Conventional, Jumbo — We Do It All",
      "Stop Rate Shopping. We Do It For You — 50+ Lenders.",
      "Zero Junk Fees. Transparent Pricing. Best Rate Guaranteed.",
    ],
    ctas: [
      "Get Pre-Qualified in 5 Minutes",
      "Compare Your Rate — Free",
      "Start My Pre-Approval",
      "Get My Rate Comparison",
      "Find My Best Rate",
      "Talk to a Licensed Broker",
      "Start My Refinance Analysis",
      "See If I Qualify",
    ],
    trustBadges: [
      "NMLS Licensed Brokers",
      "50+ Lender Network",
      "1,200+ Loans Closed",
      "24-Hour Pre-Approval",
      "4.9-Star Google Rating",
      "Zero Junk Fees",
      "Equal Housing Lender",
      "FHA/VA/USDA Approved",
    ],
    testimonials: [
      "Got pre-approved in less than 24 hours. Other brokers told us it would take a week.",
      "Found a rate 0.4% lower than our bank offered. On 30 years, that's tens of thousands saved.",
      "Refinanced and cut $380 off my monthly payment. The process was effortless.",
      "Turned down by our bank — [Business Name] found a lender in 3 hours. We have our home.",
      "I always thought going direct to a bank was smartest. I was wrong by a significant margin.",
    ],
  },
  chiropractor: {
    headlines: [
      "Pain-Free Living Starts Here — [City]'s Premier Chiropractic",
      "Back Pain? Neck Pain? We Fix It — Without Drugs or Surgery",
      "New Patients Welcome — Same-Week Appointments in [City]",
      "10,000+ Adjustments | Most Insurance Accepted | Feel Better Fast",
      "[City]'s Most Trusted Chiropractor — Lasting Relief Guaranteed",
      "Sports Injury? Desk Pain? Headaches? Chiropractic Can Help.",
      "Free New Patient Consultation — See What's Really Causing Your Pain",
      "Most Patients Notice Relief Within 3 Visits — Schedule Today",
    ],
    ctas: [
      "Book My Free Consultation",
      "Schedule My First Appointment",
      "Claim My New Patient Exam",
      "Book Same-Week Appointment",
      "Get My Personalized Treatment Plan",
      "Talk to a Chiropractor Today",
      "See If Chiropractic Can Help",
      "Start My Path to Pain Relief",
    ],
    trustBadges: [
      "Licensed Doctor of Chiropractic",
      "10,000+ Adjustments",
      "Insurance Accepted",
      "New Patients Welcome",
      "Same-Week Appointments",
      "All Ages Treated",
      "Free New Patient Exam",
      "Evidence-Based Care",
    ],
    testimonials: [
      "3-year back pain gone after 4 visits. I genuinely wish I'd come to [Business Name] sooner.",
      "I was skeptical. One visit changed my mind — 18 months of neck pain resolved in two weeks.",
      "As a runner, monthly adjustments keep me injury-free and performing at my best.",
      "I avoided chiropractors for years out of fear. The team made it completely comfortable. Life-changing.",
      "My whole family comes here — husband, kids, me. The care is gentle and remarkably effective.",
    ],
  },
  dental: {
    headlines: [
      "Smile Brighter — [City]'s Most Welcoming Dental Practice",
      "New Patients Welcome | Same-Day Emergency Appointments Available",
      "Family Dentistry, Cosmetic Care & Implants — All Under One Roof",
      "We See Anxious Patients Every Day — You're Safe Here",
      "5,000+ Happy Patients | Most Insurance Accepted | [City] Dentist",
      "Teeth Whitening, Invisalign & Implants — [City]'s Complete Dentist",
      "Emergency Toothache? We Have Same-Day Slots — Call Now",
      "Judgment-Free Dental Care for the Whole Family in [City]",
    ],
    ctas: [
      "Book My New Patient Appointment",
      "Schedule My Cleaning Today",
      "Book an Emergency Appointment",
      "Get Started with Invisalign",
      "See Our Smile Makeover Options",
      "Book My Same-Day Appointment",
      "Call for Emergency Dental Care",
      "Check If We Accept My Insurance",
    ],
    trustBadges: [
      "Licensed DDS / DMD",
      "5,000+ Happy Patients",
      "Most Insurance Accepted",
      "Same-Day Emergency Care",
      "Sedation Available",
      "New Patients Welcome",
      "Invisalign Certified Provider",
      "Digital X-Rays — Lower Radiation",
    ],
    testimonials: [
      "7 years without seeing a dentist due to anxiety. The team at [Business Name] changed that permanently.",
      "Got Invisalign here — the transformation exceeded every expectation. Worth every penny.",
      "Cracked tooth on a Saturday. In the chair within 2 hours, fixed same day. Remarkable service.",
      "Brought my whole family — ages 6 to 72. They're incredible with everyone at every stage.",
      "Never felt judged or rushed. They show you everything on a screen and explain it plainly. Best dentist ever.",
    ],
  },
};

/** Returns niche-specific AI agent suggestions for the website editor. */
export function getNicheAISuggestions(nicheId: NicheId): NicheAISuggestion[] {
  return NICHE_AI_SUGGESTIONS[nicheId] ?? NICHE_AI_SUGGESTIONS.plumbing;
}

/** Returns niche-specific smart section recommendations. */
export function getNicheSectionRecommendations(
  nicheId: NicheId,
): NicheSectionRecommendation[] {
  return (
    NICHE_SECTION_RECOMMENDATIONS[nicheId] ??
    NICHE_SECTION_RECOMMENDATIONS.plumbing
  );
}

/** Returns niche-specific content library (headlines, CTAs, trust badges, testimonials). */
export function getNicheContentLibrary(
  nicheId: NicheId,
): NicheContentLibraryData {
  return NICHE_CONTENT_LIBRARY[nicheId] ?? NICHE_CONTENT_LIBRARY.plumbing;
}

/** Returns the NicheTemplate list filtered to a single niche (for landing page builder). */
export function getTemplatesByNiche(
  nicheId: NicheId,
  allTemplates: { niche: string; id: string }[],
): { niche: string; id: string }[] {
  return allTemplates.filter((t) => t.niche === nicheId);
}
