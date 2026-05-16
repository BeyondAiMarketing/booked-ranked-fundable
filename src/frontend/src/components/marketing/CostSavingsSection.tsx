import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe,
  Mail,
  Megaphone,
  Phone,
  Search,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

type NicheKey =
  | "plumbing"
  | "hvac"
  | "med-spa"
  | "carpet-cleaning"
  | "restoration"
  | "roofing"
  | "real-estate"
  | "mortgage"
  | "chiropractor"
  | "dental";

interface CostRow {
  icon: React.ElementType;
  role: string;
  costLow: number;
  costHigh: number;
  costRange: string;
  contexts: Record<NicheKey | "generic", string>;
}

const COST_ROWS: CostRow[] = [
  {
    icon: Phone,
    role: "Receptionist / Secretary",
    costLow: 2500,
    costHigh: 3500,
    costRange: "$2,500–$3,500/mo",
    contexts: {
      generic:
        "Answers phones, books appointments, and responds to messages 24/7",
      plumbing:
        "Your plumbing company's receptionist answering calls and booking jobs 24/7",
      hvac: "Your HVAC company's receptionist answering service calls and scheduling 24/7",
      "med-spa":
        "Your med spa's front desk receptionist handling consultations and booking",
      "carpet-cleaning":
        "Your carpet cleaning company's dispatcher booking jobs and answering calls",
      restoration:
        "Your restoration company's emergency intake coordinator — available 24/7",
      roofing:
        "Your roofing company's office coordinator booking estimates and answering calls",
      "real-estate": "Books showings and answers buyer/seller inquiries 24/7",
      mortgage: "Captures loan inquiries and books consultations 24/7",
      chiropractor: "Books appointments and sends reminders 24/7",
      dental: "Books appointments, handles confirmations and reminders 24/7",
    },
  },
  {
    icon: Megaphone,
    role: "Social Media Manager",
    costLow: 1500,
    costHigh: 3000,
    costRange: "$1,500–$3,000/mo",
    contexts: {
      generic:
        "Creates posts, engages followers, responds to comments, and manages ads",
      plumbing:
        "Your plumbing social media manager creating posts, before/afters, and local engagement",
      hvac: "Your HVAC social media manager creating seasonal content and driving local awareness",
      "med-spa":
        "Your med spa social media manager creating content, before/afters, and promotions",
      "carpet-cleaning":
        "Your carpet cleaning social media manager creating proof posts and local engagement",
      restoration:
        "Your restoration social media manager creating proof content and community trust",
      roofing:
        "Your roofing social media manager creating storm posts, before/afters, and local outreach",
      "real-estate":
        "Your real estate social media manager creating listing posts, market updates, and local trust content",
      mortgage:
        "Your mortgage social media manager creating rate updates, buyer tips, and referral content",
      chiropractor:
        "Your chiropractic social media manager creating wellness content, patient stories, and local outreach",
      dental:
        "Your dental social media manager creating patient education posts, promotions, and local engagement",
    },
  },
  {
    icon: Globe,
    role: "Website Manager",
    costLow: 500,
    costHigh: 1500,
    costRange: "$500–$1,500/mo",
    contexts: {
      generic:
        "Updates, maintains, and keeps your website current — images, copy, and pages",
      plumbing:
        "Keeping your plumbing website updated with services, pricing, and seasonal pages",
      hvac: "Keeping your HVAC website updated with seasonal offers, service pages, and content",
      "med-spa":
        "Keeping your med spa website current with service menus, pricing, and promotions",
      "carpet-cleaning":
        "Keeping your carpet cleaning website updated with services and local pages",
      restoration:
        "Keeping your restoration website updated with services, certifications, and content",
      roofing:
        "Keeping your roofing website updated with galleries, services, and storm damage pages",
      "real-estate":
        "Keeping your real estate website updated with listings, market reports, and agent bios",
      mortgage:
        "Keeping your mortgage website updated with rates, loan programs, and calculators",
      chiropractor:
        "Keeping your chiropractic website updated with services, team bios, and patient resources",
      dental:
        "Keeping your dental website updated with services, pricing, insurance info, and patient forms",
    },
  },
  {
    icon: Star,
    role: "Reputation Management Company",
    costLow: 300,
    costHigh: 800,
    costRange: "$300–$800/mo",
    contexts: {
      generic:
        "Monitors reviews, sends requests, manages responses across all platforms",
      plumbing:
        "Managing Google and Yelp reviews for your plumbing business — requests and responses",
      hvac: "Managing Google and Yelp reviews for your HVAC business — monitoring and responses",
      "med-spa":
        "Managing Google and RealSelf reviews for your med spa — requests and professional responses",
      "carpet-cleaning":
        "Managing Google reviews for your carpet cleaning business — automated requests and monitoring",
      restoration:
        "Managing Google and insurance-referral reviews for your restoration business",
      roofing:
        "Managing Google and Angi reviews for your roofing business — requests and responses",
      "real-estate":
        "Managing Zillow, Google, and Realtor.com reviews for your real estate practice",
      mortgage:
        "Managing Google and Zillow reviews for your mortgage practice — requests and responses",
      chiropractor:
        "Managing Google and Healthgrades reviews for your chiropractic practice",
      dental:
        "Managing Google and Zocdoc reviews for your dental practice — automated requests and monitoring",
    },
  },
  {
    icon: CreditCard,
    role: "Corporate Credit Builder",
    costLow: 200,
    costHigh: 500,
    costRange: "$200–$500/mo",
    contexts: {
      generic:
        "Builds your business credit profile, fundability score, and loan-readiness on autopilot",
      plumbing:
        "Building business credit and fundability for your plumbing LLC or corporation",
      hvac: "Building business credit and fundability for your HVAC business entity",
      "med-spa":
        "Building business credit and fundability for your med spa business entity",
      "carpet-cleaning":
        "Building business credit and fundability for your carpet cleaning entity",
      restoration:
        "Building business credit and fundability for your restoration company",
      roofing:
        "Building business credit and fundability for your roofing LLC or corporation",
      "real-estate":
        "Building business credit and fundability for your real estate brokerage or agency",
      mortgage:
        "Building business credit and fundability for your mortgage brokerage entity",
      chiropractor:
        "Building business credit and fundability for your chiropractic practice entity",
      dental:
        "Building business credit and fundability for your dental practice entity",
    },
  },
  {
    icon: Search,
    role: "SEO / Local Search Company",
    costLow: 500,
    costHigh: 2000,
    costRange: "$500–$2,000/mo",
    contexts: {
      generic:
        "Local rankings, SEO audit, citation optimization, and Google Maps visibility",
      plumbing:
        "Local SEO for '[City] plumber' and '[City] plumbing' searches — rankings and visibility",
      hvac: "Local SEO for '[City] HVAC' and '[City] AC repair' searches — rankings and citations",
      "med-spa":
        "Local SEO for '[City] med spa' and '[City] Botox' searches — Google Maps and rankings",
      "carpet-cleaning":
        "Local SEO for '[City] carpet cleaning' searches — rankings and Google Maps",
      restoration:
        "Local SEO for '[City] water damage' and '[City] fire restoration' searches",
      roofing:
        "Local SEO for '[City] roofer' and '[City] roof replacement' searches",
      "real-estate":
        "Local SEO for '[City] real estate agent' and '[City] homes for sale' searches",
      mortgage:
        "Local SEO for '[City] mortgage broker' and '[City] home loans' searches",
      chiropractor:
        "Local SEO for '[City] chiropractor' and '[City] back pain relief' searches",
      dental:
        "Local SEO for '[City] dentist' and '[City] dental clinic' searches — Google Maps and rankings",
    },
  },
  {
    icon: Building2,
    role: "CRM Software",
    costLow: 100,
    costHigh: 300,
    costRange: "$100–$300/mo",
    contexts: {
      generic: "Lead tracking, pipeline management, and follow-up automation",
      plumbing:
        "Tracking plumbing leads, scheduling jobs, and automating follow-up",
      hvac: "Tracking HVAC service leads and automating appointment follow-up sequences",
      "med-spa":
        "Tracking med spa consultations and automating booking follow-up",
      "carpet-cleaning":
        "Tracking carpet cleaning quotes and automating recurring-customer follow-up",
      restoration:
        "Tracking restoration leads, insurance contacts, and estimate follow-up",
      roofing:
        "Tracking roofing estimates and automating storm follow-up sequences",
      "real-estate":
        "Tracking buyer and seller leads through the pipeline and automating follow-up",
      mortgage:
        "Tracking loan inquiries, pre-qual applications, and automated follow-up sequences",
      chiropractor:
        "Tracking new patient leads and automating appointment follow-up and re-activation",
      dental:
        "Tracking new patient inquiries and automating recall and re-booking follow-up",
    },
  },
  {
    icon: Mail,
    role: "Email Marketing Platform",
    costLow: 100,
    costHigh: 300,
    costRange: "$100–$300/mo",
    contexts: {
      generic: "Automated email sequences, nurture flows, and campaign tools",
      plumbing:
        "Email sequences for plumbing estimates, follow-ups, and maintenance reminders",
      hvac: "Email sequences for HVAC estimates, seasonal campaigns, and maintenance plan upsells",
      "med-spa":
        "Email sequences for med spa consultations, re-booking campaigns, and promotions",
      "carpet-cleaning":
        "Email sequences for carpet cleaning quotes and recurring-customer campaigns",
      restoration:
        "Email sequences for restoration estimates, insurance follow-ups, and re-engagement",
      roofing:
        "Email sequences for roofing estimates, storm follow-ups, and seasonal campaigns",
      "real-estate":
        "Email sequences for buyer/seller nurture, listing alerts, and referral campaigns",
      mortgage:
        "Email sequences for pre-qual follow-ups, rate alerts, and referral partner campaigns",
      chiropractor:
        "Email sequences for new patient onboarding, care plan reminders, and re-activation",
      dental:
        "Email sequences for appointment reminders, recall campaigns, and new patient nurture",
    },
  },
];

// Supplementary KPI cards shown above the table
const KPI_CARDS = [
  { label: "Roles Replaced", value: "8" },
  { label: "Max Monthly Savings", value: "$11,400+" },
  { label: "BRF Starting Price", value: "$497/mo" },
  { label: "Everything Included", value: "Yes" },
];

const NICHE_HEADLINES: Record<NicheKey | "generic", string> = {
  generic: "One App Replaces Your Entire Back-Office Team",
  plumbing: "What BRF Replaces for Your Plumbing Business",
  hvac: "What BRF Replaces for Your HVAC Business",
  "med-spa": "What BRF Replaces for Your Med Spa",
  "carpet-cleaning": "What BRF Replaces for Your Carpet Cleaning Business",
  restoration: "What BRF Replaces for Your Restoration Company",
  roofing: "What BRF Replaces for Your Roofing Business",
  "real-estate": "What BRF Replaces for Your Real Estate Business",
  mortgage: "What BRF Replaces for Your Mortgage Business",
  chiropractor: "What BRF Replaces for Your Chiropractic Practice",
  dental: "What BRF Replaces for Your Dental Practice",
};

const NICHE_SUBHEADLINES: Record<NicheKey | "generic", string> = {
  generic:
    "Hiring each of these roles separately costs local businesses $5,700–$11,900 every single month. BRF replaces all eight in one platform — starting at $497/mo.",
  plumbing:
    "Most plumbing companies pay $5,700–$11,900 every month across disconnected services. BRF replaces all of them for your plumbing business — starting at $497/mo.",
  hvac: "Most HVAC companies pay $5,700–$11,900 every month across disconnected services. BRF replaces all of them for your HVAC business — starting at $497/mo.",
  "med-spa":
    "Most med spas pay $5,700–$11,900 every month across disconnected services. BRF replaces all of them for your med spa — starting at $497/mo.",
  "carpet-cleaning":
    "Most carpet cleaning companies pay $5,700–$11,900 every month across disconnected services. BRF replaces all of them — starting at $497/mo.",
  restoration:
    "Most restoration companies pay $5,700–$11,900 every month across disconnected services. BRF replaces all of them — starting at $497/mo.",
  roofing:
    "Most roofing companies pay $5,700–$11,900 every month across disconnected services. BRF replaces all of them for your roofing business — starting at $497/mo.",
  "real-estate":
    "Most real estate teams pay $5,700–$11,900/mo for these roles separately. BRF replaces all of them for your real estate business — starting at $497/mo.",
  mortgage:
    "Most mortgage brokerages pay $5,700–$11,900/mo for these roles separately. BRF replaces all of them for your mortgage business — starting at $497/mo.",
  chiropractor:
    "Most chiropractic practices pay $5,700–$11,900/mo for these roles separately. BRF replaces all of them for your practice — starting at $497/mo.",
  dental:
    "Most dental practices pay $5,700–$11,900/mo for these roles separately. BRF replaces all of them for your practice — starting at $497/mo.",
};

const isValidNicheKey = (key?: string): key is NicheKey =>
  !!key &&
  [
    "plumbing",
    "hvac",
    "med-spa",
    "carpet-cleaning",
    "restoration",
    "roofing",
    "real-estate",
    "mortgage",
    "chiropractor",
    "dental",
  ].includes(key);

interface CostSavingsSectionProps {
  niche?: string;
}

export default function CostSavingsSection({ niche }: CostSavingsSectionProps) {
  const nicheKey: NicheKey | "generic" = isValidNicheKey(niche)
    ? niche
    : "generic";

  const headline = NICHE_HEADLINES[nicheKey];
  const subheadline = NICHE_SUBHEADLINES[nicheKey];

  return (
    <section
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #020617 0%, #0a0118 50%, #020617 100%)",
      }}
    >
      {/* Top purple glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 65%)",
        }}
      />
      {/* Bottom ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 35% at 50% 100%, rgba(99,102,241,0.10) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Real Cost Comparison
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
            {nicheKey === "generic" ? (
              <>
                One App.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
                  Eight Specialists
                </span>{" "}
                Replaced.
              </>
            ) : (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
                  {headline}
                </span>
              </>
            )}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {subheadline}
          </p>
        </motion.div>

        {/* ── KPI stat bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
        >
          {KPI_CARDS.map((kpi, i) => (
            <div
              key={kpi.label}
              className={`rounded-xl border px-4 py-4 text-center ${
                i === 1
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : i === 2
                    ? "bg-indigo-500/10 border-indigo-500/30"
                    : "bg-white/4 border-white/8"
              }`}
            >
              <p
                className={`text-xl md:text-2xl font-bold mb-1 ${
                  i === 1
                    ? "text-emerald-400"
                    : i === 2
                      ? "text-indigo-400"
                      : "text-white"
                }`}
              >
                {kpi.value}
              </p>
              <p className="text-xs text-slate-400 font-medium">{kpi.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Cost rows table ── */}
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            border: "1px solid rgba(139,92,246,0.18)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset",
          }}
        >
          {COST_ROWS.map((row, i) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={row.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.055 }}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 border-b last:border-b-0 ${
                  i % 2 === 0 ? "bg-slate-900/80" : "bg-slate-900/40"
                }`}
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
                data-ocid={`cost-savings.item.${i + 1}`}
              >
                {/* Icon + role + description */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/12 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={16} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-snug">
                      {row.role}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {row.contexts[nicheKey]}
                    </p>
                  </div>
                </div>

                {/* Cost + badge */}
                <div className="flex items-center gap-3 flex-shrink-0 sm:ml-auto">
                  {/* Strikethrough cost */}
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium mb-0.5 uppercase tracking-wide">
                      If hired
                    </p>
                    <span className="text-sm font-bold text-rose-400/80 tabular-nums whitespace-nowrap line-through decoration-rose-500/50">
                      {row.costRange}
                    </span>
                  </div>

                  {/* Included badge */}
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold px-2.5 py-1.5 rounded-full whitespace-nowrap">
                    <CheckCircle2 size={11} className="flex-shrink-0" />
                    Included
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* ── Total vs BRF row ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.5 }}
            className="px-5 py-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(15,10,40,0.95) 0%, rgba(20,15,50,0.95) 100%)",
              borderTop: "2px solid rgba(139,92,246,0.35)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              {/* Left: If hired separately */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                  Total if hired separately
                </p>
                <p className="text-3xl font-extrabold text-rose-400 line-through decoration-rose-500/50 decoration-2">
                  $5,700–$11,900
                  <span className="text-lg font-bold ml-1 text-rose-400/70">
                    /mo
                  </span>
                </p>
              </div>

              {/* Divider arrow on desktop */}
              <div className="hidden sm:flex items-center text-slate-600 text-2xl font-bold">
                →
              </div>

              {/* Right: With BRF */}
              <div className="sm:text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                  With BRF — everything included
                </p>
                <p className="text-3xl font-extrabold">
                  <span className="text-slate-400 text-lg font-semibold mr-1">
                    Starting at
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    $497
                  </span>
                  <span className="text-indigo-300 text-lg font-bold ml-1">
                    /mo
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Savings callout ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.6 }}
          className="mb-8"
        >
          <div
            className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.20) 0%, rgba(139,92,246,0.25) 50%, rgba(99,102,241,0.20) 100%)",
              border: "1px solid rgba(139,92,246,0.35)",
              boxShadow: "0 0 60px rgba(139,92,246,0.15)",
            }}
          >
            {/* Glow blob */}
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-3">
                Your Monthly Savings
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap mb-3">
                <span className="text-4xl md:text-5xl font-extrabold text-white">
                  Save up to
                </span>
                <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  $11,400+
                </span>
              </div>
              <p className="text-slate-300 text-base md:text-lg font-semibold">
                every single month — compared to hiring separately
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {[
                  "AI Receptionist",
                  "Social Media Manager",
                  "Website Manager",
                  "Reputation Management",
                  "Credit Builder",
                  "SEO Engine",
                  "CRM",
                  "Email Marketing",
                ].map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1.5 bg-white/8 border border-white/12 text-white/80 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    <TrendingUp size={10} className="text-emerald-400" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Demo CTA Bar — added between savings callout and audit link ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.65 }}
          className="mb-8 rounded-2xl overflow-hidden"
          data-ocid="cost-savings.demo_cta_bar"
        >
          <div
            className="relative px-6 py-7 md:px-10 flex flex-col md:flex-row items-center justify-between gap-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(88,28,135,0.40) 0%, rgba(67,56,202,0.40) 100%)",
              border: "1px solid rgba(139,92,246,0.30)",
            }}
          >
            <div className="text-center md:text-left">
              <p className="text-white font-bold text-lg md:text-xl leading-snug">
                You&apos;ve seen the savings.{" "}
                <span className="text-purple-300">Now see it working.</span>
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Watch all 8 of these roles running on autopilot — live demo, no
                signup.
              </p>
            </div>
            <Link
              to="/demo"
              data-ocid="cost-savings.demo_cta_bar.button"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-purple-900/50 transition-all duration-200 text-sm whitespace-nowrap"
            >
              <Zap size={15} />
              See The Live Demo Now
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.68 }}
          className="text-center"
          data-ocid="cost-savings.cta_link"
        >
          <Link
            to="/free-audit"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors duration-200 group"
          >
            See exactly what&apos;s included in every plan
            <ArrowRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
