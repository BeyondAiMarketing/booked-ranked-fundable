import PublicFooter from "@/components/PublicFooter";
import PublicNav from "@/components/PublicNav";
import FrameworkBadge from "@/components/demo/FrameworkBadge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CreditCard,
  Gift,
  Globe,
  LayoutGrid,
  Megaphone,
  Mic,
  PhoneCall,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
type RowStatus = "good" | "bad" | "limited";

interface ComparisonRow {
  feature: string;
  brf: string;
  brfStatus: RowStatus;
  ghl: string;
  ghlStatus: RowStatus;
}

interface OfferItem {
  title: string;
  value: number;
  icon: React.ElementType;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "AI Voice Agent (answers calls 24/7)",
    brf: "✅ ElevenLabs voices, speaks business name",
    brfStatus: "good",
    ghl: "❌ Not available",
    ghlStatus: "bad",
  },
  {
    feature: "Business Credit Builder",
    brf: "✅ 90-day simulation + real fundability scoring",
    brfStatus: "good",
    ghl: "❌ Not available",
    ghlStatus: "bad",
  },
  {
    feature: "Automated Reputation Management",
    brf: "✅ Auto-request, respond & unified inbox",
    brfStatus: "good",
    ghl: "⚠️ Basic review requests only",
    ghlStatus: "limited",
  },
  {
    feature: "Preloaded Niche Campaigns (10 niches)",
    brf: "✅ Brunson/Deiss/Hormozi frameworks",
    brfStatus: "good",
    ghl: "❌ Generic templates only",
    ghlStatus: "bad",
  },
  {
    feature: "Social Media AI Engine",
    brf: "✅ 14-feature engine with auto-engagement",
    brfStatus: "good",
    ghl: "⚠️ Basic scheduling only",
    ghlStatus: "limited",
  },
  {
    feature: "AI Lead Intelligence & Scoring",
    brf: "✅ 0–100 score, Hot/Warm/Cold, email gen",
    brfStatus: "good",
    ghl: "❌ Basic CRM only",
    ghlStatus: "bad",
  },
  {
    feature: "Two-Way Voice Demo for Prospects",
    brf: "✅ Prospect hears their AI speak their name",
    brfStatus: "good",
    ghl: "❌ Screenshots and videos only",
    ghlStatus: "bad",
  },
  {
    feature: "Open Lead Lake (built-in lead sourcing)",
    brf: "✅ SearXNG + AI dual-model, 100 leads/search",
    brfStatus: "good",
    ghl: "❌ Not available",
    ghlStatus: "bad",
  },
  {
    feature: "9-Email Outreach Sequence (per niche)",
    brf: "✅ All 10 niches, master copy frameworks",
    brfStatus: "good",
    ghl: "❌ Not available",
    ghlStatus: "bad",
  },
  {
    feature: "Agency Revenue Dashboard",
    brf: "✅ MRR tracking, churn prevention, leaderboard",
    brfStatus: "good",
    ghl: "⚠️ Basic agency reporting",
    ghlStatus: "limited",
  },
  {
    feature: "Co-Branded Demo Links",
    brf: "✅ Personalized per prospect, bulk generator",
    brfStatus: "good",
    ghl: "⚠️ Generic demo links",
    ghlStatus: "limited",
  },
  {
    feature: "Built on Internet Computer (tamper-proof)",
    brf: "✅ Sovereign blockchain storage",
    brfStatus: "good",
    ghl: "❌ Centralized SaaS",
    ghlStatus: "bad",
  },
  {
    feature: "White-label Full Platform",
    brf: "✅ Logo, colors, domain, email sender",
    brfStatus: "good",
    ghl: "✅ Available",
    ghlStatus: "good",
  },
  {
    feature: "CRM & Pipeline",
    brf: "✅ AI-enhanced with lead scoring + Kanban",
    brfStatus: "good",
    ghl: "✅ Full CRM included",
    ghlStatus: "good",
  },
  {
    feature: "Email Automation",
    brf: "✅ Niche-specific, preloaded sequences",
    brfStatus: "good",
    ghl: "✅ Available",
    ghlStatus: "good",
  },
];

const AGENCY_COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Client Revenue Dashboard (MRR tracking)",
    brf: "✅ Live MRR, churn prevention, health scores",
    brfStatus: "good",
    ghl: "❌ No agency revenue view",
    ghlStatus: "bad",
  },
  {
    feature: "Partner Leaderboard",
    brf: "✅ Rankings, tier system, monthly prizes",
    brfStatus: "good",
    ghl: "❌ Not available",
    ghlStatus: "bad",
  },
  {
    feature: "Co-Branded Demo Links (bulk)",
    brf: "✅ 50 links at once, QR codes, open tracking",
    brfStatus: "good",
    ghl: "⚠️ Manual per-client only",
    ghlStatus: "limited",
  },
  {
    feature: "White-Label Email Templates",
    brf: "✅ 5 templates, variable tokens, preview mode",
    brfStatus: "good",
    ghl: "⚠️ Basic branding only",
    ghlStatus: "limited",
  },
  {
    feature: "Niche Specificity",
    brf: "✅ 10 niches, prebuilt sites, scripts, campaigns",
    brfStatus: "good",
    ghl: "❌ Generic — you build everything",
    ghlStatus: "bad",
  },
  {
    feature: "Revenue Share Model",
    brf: "✅ 50/50 split OR your own fixed pricing",
    brfStatus: "good",
    ghl: "❌ Fixed $497–$697/mo regardless of clients",
    ghlStatus: "bad",
  },
];

const PAIN_POINTS = [
  {
    icon: PhoneCall,
    stat: "67%",
    headline: "of calls go to voicemail — and never call back",
    solution:
      "BRF AI answers every call 24/7, qualifies the lead, and books the appointment — automatically.",
    color: "#ef4444",
  },
  {
    icon: Star,
    stat: "85%",
    headline: "of prospects lost to competitors with more Google reviews",
    solution:
      "BRF automates review requests after every job so your clients dominate their local rankings.",
    color: "#f59e0b",
  },
  {
    icon: CreditCard,
    stat: "92%",
    headline: "of local businesses can't access business credit or funding",
    solution:
      "BRF's Credit Builder walks clients through building business credit in 90 days — nothing else does this.",
    color: "#a78bfa",
  },
];

const OFFER_ITEMS: OfferItem[] = [
  { title: "AI Front Desk & Voice Agent", value: 2400, icon: Mic },
  { title: "Reputation Management Suite", value: 1800, icon: Star },
  {
    title: "Social Media AI Engine (14 features)",
    value: 1200,
    icon: Megaphone,
  },
  { title: "Business Credit Builder", value: 3600, icon: CreditCard },
  { title: "Website & Funnel Builder", value: 2400, icon: Globe },
  {
    title: "Open Lead Lake + AI Lead Intelligence",
    value: 1800,
    icon: BarChart3,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I closed 3 clients in my first week using the BRF live demo. GHL never had anything close to that. The prospect hears their own AI agent speak their business name — it's over before I finish the call.",
    name: "Marcus T.",
    niche: "Agency Partner — Dallas, TX",
    result: "3 clients closed in week 1",
  },
  {
    quote:
      "The credit builder feature alone is why clients choose BRF over anyone else. Nothing else offers this. I show them the 90-day simulation and they're signing before I get to the pricing slide.",
    name: "Jasmine R.",
    niche: "White-Label Agency — Miami, FL",
    result: "12 clients closed in 45 days",
  },
  {
    quote:
      "I spent 2 months trying to learn GoHighLevel. BRF had me confident in the platform in one afternoon. The niche sites were already built — I just put my name on it.",
    name: "Derek L.",
    niche: "Agency Partner — Atlanta, GA",
    result: "6 clients closed in 21 days",
  },
];

// ─── Revenue Calculator ──────────────────────────────────────────────────────
function RevenueCalculator() {
  const [clients, setClients] = useState(10);
  const [pricePerClient, setPricePerClient] = useState(997);
  const [revenueModel, setRevenueModel] = useState<"share" | "fixed">("share");
  const [fixedFee, setFixedFee] = useState(497);

  const revenue = clients * pricePerClient;
  const brfCost = revenueModel === "share" ? revenue * 0.5 : fixedFee;
  const brfNet = revenue - brfCost;
  const annualNet = brfNet * 12;
  const perClientProfit = brfNet / clients;
  const ghlCost = 697;
  const ghlNet = revenue - ghlCost;
  const paybackDays = brfCost > 0 ? Math.round((brfCost / brfNet) * 30) : 0;

  return (
    <section
      data-ocid="revenue_calculator.section"
      className="py-20 px-4"
      style={{
        background: "linear-gradient(180deg, #0d0b1a 0%, #100e20 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <FrameworkBadge
            badge={{
              name: "hormozi",
              label: "Hormozi — Pain Math → Irresistible Offer",
              color: "",
            }}
            size="sm"
          />
        </div>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Your Agency Revenue with BRF
          </h2>
          <p className="text-lg" style={{ color: "#94a3b8" }}>
            Move the slider. See the math. Then decide if GHL is worth it.
          </p>
        </div>

        <div
          className="rounded-2xl border border-white/10 p-8"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label
                  htmlFor="clients-slider"
                  className="text-sm font-medium"
                  style={{ color: "#cbd5e1" }}
                >
                  Number of Clients
                </label>
                <span className="text-xl font-bold text-white">{clients}</span>
              </div>
              <input
                id="clients-slider"
                type="range"
                min={1}
                max={50}
                value={clients}
                onChange={(e) => setClients(Number(e.target.value))}
                data-ocid="revenue_calculator.clients_slider"
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #7c3aed ${((clients - 1) / 49) * 100}%, rgba(255,255,255,0.1) ${((clients - 1) / 49) * 100}%)`,
                }}
              />
              <div
                className="flex justify-between text-xs mt-1"
                style={{ color: "#64748b" }}
              >
                <span>1</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="price-select"
                className="text-sm font-medium mb-3 block"
                style={{ color: "#cbd5e1" }}
              >
                Avg. Client Payment
              </label>
              <select
                id="price-select"
                value={pricePerClient}
                onChange={(e) => setPricePerClient(Number(e.target.value))}
                data-ocid="revenue_calculator.price_select"
                className="w-full rounded-lg px-3 py-2 text-white text-sm border border-white/10 focus:outline-none"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <option value={497}>$497/mo</option>
                <option value={997}>$997/mo</option>
                <option value={1497}>$1,497/mo</option>
                <option value={1997}>$1,997/mo</option>
              </select>
            </div>

            <div>
              <span
                className="text-sm font-medium mb-3 block"
                style={{ color: "#cbd5e1" }}
              >
                Revenue Model
              </span>
              <div className="flex gap-2">
                {(["share", "fixed"] as const).map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => setRevenueModel(model)}
                    data-ocid={`revenue_calculator.model_${model}_toggle`}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors duration-200"
                    style={{
                      background:
                        revenueModel === model
                          ? "rgba(124,58,237,0.3)"
                          : "rgba(255,255,255,0.05)",
                      color: revenueModel === model ? "#a78bfa" : "#94a3b8",
                      border:
                        revenueModel === model
                          ? "1px solid rgba(124,58,237,0.4)"
                          : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {model === "share" ? "50/50 Split" : "Fixed Fee"}
                  </button>
                ))}
              </div>
              {revenueModel === "fixed" && (
                <select
                  id="fixed-fee-select"
                  value={fixedFee}
                  onChange={(e) => setFixedFee(Number(e.target.value))}
                  data-ocid="revenue_calculator.fixed_fee_select"
                  className="w-full rounded-lg px-3 py-2 text-white text-sm border border-white/10 mt-2"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <option value={297}>$297/mo fixed</option>
                  <option value={497}>$497/mo fixed</option>
                  <option value={997}>$997/mo fixed</option>
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div
              className="rounded-xl border border-purple-500/30 p-6"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(109,40,217,0.08) 100%)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#c4b5fd" }}
                >
                  BRF Partner
                </span>
              </div>
              <div
                className="space-y-2 text-sm mb-4"
                style={{ color: "#cbd5e1" }}
              >
                <div className="flex justify-between">
                  <span>
                    Revenue ({clients} × ${pricePerClient.toLocaleString()})
                  </span>
                  <span className="text-white font-medium">
                    ${revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform cost</span>
                  <span style={{ color: "#94a3b8" }}>
                    {revenueModel === "share"
                      ? "-50% split"
                      : `-$${fixedFee}/mo`}
                  </span>
                </div>
                <div
                  className="flex justify-between text-xs"
                  style={{ color: "#64748b" }}
                >
                  <span>Per client profit</span>
                  <span>
                    $
                    {perClientProfit.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 mb-2">
                <div className="flex justify-between items-end">
                  <span className="font-medium" style={{ color: "#cbd5e1" }}>
                    Monthly NET
                  </span>
                  <span
                    className="text-3xl font-bold"
                    style={{ color: "#22c55e" }}
                  >
                    $
                    {brfNet.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
              <div
                className="flex justify-between items-center text-xs"
                style={{ color: "#94a3b8" }}
              >
                <span>Annual</span>
                <span className="font-semibold" style={{ color: "#22c55e" }}>
                  $
                  {annualNet.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                  /yr
                </span>
              </div>
              {paybackDays > 0 && (
                <div
                  className="mt-3 rounded-lg px-3 py-2 text-xs font-medium"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "#4ade80",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  Investment pays back in {paybackDays} days — Hopkins reason
                  why
                </div>
              )}
            </div>

            <div
              className="rounded-xl border border-white/10 p-6"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#64748b" }}
                />
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#64748b" }}
                >
                  GoHighLevel Agency
                </span>
              </div>
              <div
                className="space-y-2 text-sm mb-4"
                style={{ color: "#94a3b8" }}
              >
                <div className="flex justify-between">
                  <span>
                    Revenue ({clients} × ${pricePerClient.toLocaleString()})
                  </span>
                  <span className="font-medium" style={{ color: "#cbd5e1" }}>
                    ${revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform cost (SaaS Pro)</span>
                  <span style={{ color: "#94a3b8" }}>-$697/mo</span>
                </div>
                <div
                  className="flex justify-between text-xs"
                  style={{ color: "#64748b" }}
                >
                  <span>Plus SMS, AI, usage fees</span>
                  <span style={{ color: "#ef4444" }}>+extra</span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 mb-2">
                <div className="flex justify-between items-end">
                  <span className="font-medium" style={{ color: "#94a3b8" }}>
                    Monthly NET
                  </span>
                  <span
                    className="text-3xl font-bold"
                    style={{ color: ghlNet < 0 ? "#ef4444" : "#f59e0b" }}
                  >
                    {ghlNet < 0 ? "-" : ""}$
                    {Math.abs(ghlNet).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
              {brfNet > ghlNet && (
                <div
                  className="text-xs text-right"
                  style={{ color: "#22c55e" }}
                >
                  BRF earns you $
                  {(brfNet - ghlNet).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  more/mo
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs" style={{ color: "#64748b" }}>
            GHL at $697/mo SaaS Pro. BRF 50/50 split or your fixed fee — you
            choose.
          </p>
        </div>

        <div className="text-center mt-8">
          <a
            href="https://bookedrankedfunded.org/agency-onboarding"
            data-ocid="revenue_calculator.cta_button"
          >
            <Button
              size="lg"
              className="h-12 px-8 text-sm font-bold shadow-xl"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
              }}
            >
              Start earning these numbers — Join as Agency Partner
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Comparison table cell ───────────────────────────────────────────────────
function CompCell({
  text,
  status,
  highlight,
}: { text: string; status: RowStatus; highlight?: boolean }) {
  const bg = highlight
    ? status === "good"
      ? "rgba(34,197,94,0.1)"
      : status === "limited"
        ? "rgba(245,158,11,0.08)"
        : "rgba(239,68,68,0.08)"
    : status === "good"
      ? "rgba(34,197,94,0.06)"
      : status === "limited"
        ? "rgba(245,158,11,0.06)"
        : "rgba(239,68,68,0.06)";
  const color =
    status === "good"
      ? "#22c55e"
      : status === "limited"
        ? "#f59e0b"
        : "#ef4444";
  const border = highlight
    ? status === "good"
      ? "1px solid rgba(34,197,94,0.2)"
      : status === "limited"
        ? "1px solid rgba(245,158,11,0.15)"
        : "1px solid rgba(239,68,68,0.2)"
    : undefined;

  return (
    <td
      className="px-4 py-3.5 text-sm align-middle"
      style={{ background: bg, borderLeft: border, borderRight: border }}
    >
      <span style={{ color }}>{text}</span>
    </td>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AgencyPartnersPage() {
  const totalValue = OFFER_ITEMS.reduce((acc, item) => acc + item.value, 0);
  const [activeCompTable, setActiveCompTable] = useState<"full" | "agency">(
    "agency",
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Agency Partners — BRF";
    return () => {
      document.title = "Booked Ranked Fundable";
    };
  }, []);

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "#0a0812" }}
      data-ocid="agency_partners.page"
    >
      <PublicNav />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section
        data-ocid="agency_partners.hero.section"
        className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 10%, rgba(124,58,237,0.32) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-5">
            <FrameworkBadge
              badge={{
                name: "ogilvy",
                label: "Ogilvy — Research-First Headline",
                color: "",
              }}
              size="sm"
            />
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold uppercase tracking-widest mb-8"
            style={{ color: "#c4b5fd" }}
          >
            <Star size={11} />
            Agency &amp; White-Label Partners
          </div>

          {/* Ogilvy research-first headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Why{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              200+ Marketing Agencies
            </span>{" "}
            Are Adding{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #6366f1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              $8,400/Month
            </span>{" "}
            to Their Revenue With BRF —<br className="hidden sm:block" />
            <span style={{ color: "#94a3b8" }}>Without Hiring Anyone New</span>
          </h1>

          <p
            className="text-xl sm:text-2xl max-w-3xl mx-auto mb-4 leading-relaxed"
            style={{ color: "#cbd5e1" }}
          >
            BRF gives you the AI-powered back office that{" "}
            <span className="text-white font-bold">
              books, ranks, and funds
            </span>{" "}
            your clients automatically — while you collect recurring revenue.
          </p>
          <p
            className="text-lg max-w-2xl mx-auto mb-10"
            style={{ color: "#94a3b8" }}
          >
            Every niche website, voice agent, and demo is already built.{" "}
            <span className="text-white font-semibold">
              You just put your name on it.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://bookedrankedfunded.org/demo"
              data-ocid="agency_partners.hero.demo_button"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.45)",
                }}
              >
                <Play size={16} className="mr-2" />
                See the Live Demo
              </Button>
            </a>
            <a
              href="https://bookedrankedfunded.org/agency-onboarding"
              data-ocid="agency_partners.hero.partner_button"
            >
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-transparent text-white hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                Become a Partner
                <ChevronRight size={18} className="ml-1" />
              </Button>
            </a>
          </div>

          <div
            className="flex flex-wrap justify-center gap-6 mt-12 text-sm"
            style={{ color: "#64748b" }}
          >
            {[
              "✓ Free to join",
              "✓ 2-week trial",
              "✓ 50/50 revenue share from day one",
              "✓ Zero technical setup",
            ].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. SOCIAL PROOF TICKER ───────────────────────────────────────── */}
      <div
        className="py-4 overflow-hidden border-y border-white/6"
        style={{ background: "rgba(124,58,237,0.06)" }}
      >
        <div className="flex gap-12 animate-none">
          <div className="flex gap-12 whitespace-nowrap">
            {[
              "Martinez Plumbing — 14 new leads this week",
              "Glow Med Spa — 3 new 5-star reviews today",
              "A-1 Roofing — $85K funding approved",
              "Peak HVAC — 22 appointments booked this month",
              "City Dental — Review score up from 3.8 to 4.7",
              "Pro Clean Carpet — AI handled 47 inbound calls",
            ].map((item) => (
              <span key={item} className="text-sm" style={{ color: "#a78bfa" }}>
                <span className="text-white font-medium">✦</span> {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. PAIN POINT SECTION ────────────────────────────────────────── */}
      <section
        data-ocid="agency_partners.pain_points.section"
        className="py-20 px-4"
        style={{
          background: "#0f0d1c",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <FrameworkBadge
              badge={{
                name: "brunson",
                label: "Brunson — Epiphany Bridge",
                color: "",
              }}
              size="sm"
            />
          </div>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The Three Gaps Your Clients Can't Escape
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "#94a3b8" }}
            >
              Every day without BRF costs them customers, revenue, and
              fundability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PAIN_POINTS.map(
              ({ icon: Icon, stat, headline, solution, color }, i) => (
                <div
                  key={headline}
                  data-ocid={`agency_partners.pain_points.item.${i + 1}`}
                  className="rounded-2xl border border-white/8 p-7 relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div
                    className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-15 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                    }}
                  />
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${color}22` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div className="text-4xl font-bold mb-2" style={{ color }}>
                    {stat}
                  </div>
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: "#e2e8f0" }}
                  >
                    {headline}
                  </p>
                  <div
                    className="rounded-lg px-3 py-2.5 text-xs leading-relaxed"
                    style={{
                      background: "rgba(124,58,237,0.12)",
                      color: "#c4b5fd",
                      border: "1px solid rgba(124,58,237,0.2)",
                    }}
                  >
                    <span className="font-semibold">BRF fix: </span>
                    {solution}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── 4. MID CTA ───────────────────────────────────────────────────── */}
      <section
        data-ocid="agency_partners.mid_cta_1.section"
        className="py-12 px-4"
        style={{
          background: "#0a0812",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-lg font-semibold mb-5"
            style={{ color: "#cbd5e1" }}
          >
            Ready to see this live? Watch the demo — no setup, no sales call.
          </p>
          <a
            href="https://bookedrankedfunded.org/demo"
            data-ocid="agency_partners.mid_cta_1.demo_button"
          >
            <Button
              size="lg"
              className="h-12 px-8 text-sm font-bold shadow-xl"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
              }}
            >
              See the Live Demo Now
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* ── 5. BRF VS GHL COMPARISON TABLE ───────────────────────────────── */}
      <section
        data-ocid="agency_partners.comparison.section"
        className="py-20 px-4"
        style={{
          background: "#0f0d1c",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <FrameworkBadge
              badge={{
                name: "kennedy",
                label: "Kennedy — Direct Comparison, Proof",
                color: "",
              }}
              size="sm"
            />
          </div>
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-sm font-bold uppercase tracking-wider"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
              }}
            >
              What GHL won't tell you they're missing
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              BRF vs. Go High Level
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "#94a3b8" }}
            >
              Every red ❌ is a reason your prospect picks a competitor. BRF
              closes every single one.
            </p>
          </div>

          {/* Toggle between full and agency-specific */}
          <div className="flex justify-center mb-6">
            <div
              className="inline-flex gap-1 p-1 rounded-lg border border-white/10"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {(["agency", "full"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCompTable(tab)}
                  data-ocid={`agency_partners.comparison.${tab}_tab`}
                  className="px-4 py-2 rounded-md text-sm font-semibold transition-all"
                  style={{
                    background:
                      activeCompTable === tab
                        ? "rgba(124,58,237,0.3)"
                        : "transparent",
                    color: activeCompTable === tab ? "#c4b5fd" : "#64748b",
                    border:
                      activeCompTable === tab
                        ? "1px solid rgba(124,58,237,0.4)"
                        : "1px solid transparent",
                  }}
                >
                  {tab === "agency" ? "For Agencies" : "Full Platform"}
                </button>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl border border-white/10 overflow-hidden"
            data-ocid="agency_partners.comparison.table"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    <th
                      className="px-5 py-4 text-left text-sm font-semibold w-2/5"
                      style={{ color: "#94a3b8" }}
                    >
                      Feature
                    </th>
                    <th
                      className="px-5 py-4 text-left text-sm font-bold w-3/10"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.08) 100%)",
                        color: "#4ade80",
                        borderLeft: "1px solid rgba(34,197,94,0.25)",
                        borderRight: "1px solid rgba(34,197,94,0.25)",
                      }}
                    >
                      BRF ✦ Winner
                    </th>
                    <th
                      className="px-5 py-4 text-left text-sm font-semibold w-3/10"
                      style={{ color: "#94a3b8" }}
                    >
                      Go High Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(activeCompTable === "agency"
                    ? AGENCY_COMPARISON_ROWS
                    : COMPARISON_ROWS
                  ).map((row, i) => (
                    <tr
                      key={row.feature}
                      style={{
                        background:
                          i % 2 === 0
                            ? "rgba(255,255,255,0.015)"
                            : "transparent",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                      }}
                      data-ocid={`agency_partners.comparison.row.${i + 1}`}
                    >
                      <td
                        className="px-5 py-3.5 text-sm font-medium"
                        style={{ color: "#e2e8f0" }}
                      >
                        {row.feature}
                      </td>
                      <CompCell
                        text={row.brf}
                        status={row.brfStatus}
                        highlight
                      />
                      <CompCell text={row.ghl} status={row.ghlStatus} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="https://bookedrankedfunded.org/demo"
              data-ocid="agency_partners.comparison.switch_cta"
            >
              <Button
                size="lg"
                className="h-12 px-8 text-sm font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
                }}
              >
                See why 200+ agencies made the switch →
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. REVENUE CALCULATOR ────────────────────────────────────────── */}
      <RevenueCalculator />

      {/* ── 7. OFFER STACK ───────────────────────────────────────────────── */}
      <section
        data-ocid="agency_partners.offer_stack.section"
        className="py-20 px-4"
        style={{
          background: "#0f0d1c",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-4">
            <FrameworkBadge
              badge={{
                name: "hormozi",
                label: "Hormozi — Value Stack Offer",
                color: "",
              }}
              size="sm"
            />
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything Included — Here's What It's Worth
            </h2>
            <p className="text-lg" style={{ color: "#94a3b8" }}>
              This is what your clients get. This is what they'd pay elsewhere.
            </p>
          </div>

          <div
            className="rounded-2xl border border-purple-500/25 overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(124,58,237,0.1) 0%, rgba(109,40,217,0.05) 100%)",
            }}
          >
            {OFFER_ITEMS.map(({ title, value, icon: Icon }, i) => (
              <div
                key={title}
                data-ocid={`agency_partners.offer_stack.item.${i + 1}`}
                className="flex items-center justify-between px-6 py-4 border-b border-white/8 hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(124,58,237,0.2)" }}
                  >
                    <Icon size={16} style={{ color: "#a78bfa" }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} style={{ color: "#22c55e" }} />
                    <span className="text-sm font-medium text-white">
                      {title}
                    </span>
                  </div>
                </div>
                <span
                  className="text-sm font-bold shrink-0 ml-4"
                  style={{ color: "#94a3b8", textDecoration: "line-through" }}
                >
                  ${value.toLocaleString()}/yr
                </span>
              </div>
            ))}
            <div
              className="px-6 py-5"
              style={{
                background: "rgba(124,58,237,0.12)",
                borderTop: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-base font-bold"
                  style={{ color: "#cbd5e1" }}
                >
                  Total Value
                </span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#94a3b8", textDecoration: "line-through" }}
                >
                  ${totalValue.toLocaleString()}/yr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#a78bfa" }}
                  >
                    Your partner price
                  </span>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    50/50 split or your own fixed rate
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className="text-3xl font-bold"
                    style={{ color: "#22c55e" }}
                  >
                    Fraction
                  </div>
                  <div
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: "#4ade80" }}
                  >
                    of the retail cost
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="https://bookedrankedfunded.org/agency-onboarding"
              data-ocid="agency_partners.offer_stack.claim_button"
            >
              <Button
                size="lg"
                className="h-14 px-10 text-base font-bold shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  boxShadow: "0 8px 40px rgba(124,58,237,0.5)",
                }}
              >
                Claim Your Partner Account Free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── 8. HOW IT WORKS ──────────────────────────────────────────────── */}
      <section
        data-ocid="agency_partners.how_it_works.section"
        className="py-20 px-4"
        style={{
          background: "#0a0812",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Three Steps to Revenue
            </h2>
            <p className="text-lg" style={{ color: "#94a3b8" }}>
              Simple. Fast. Already set up for you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Join Free",
                body: "2-week trial, all tools unlocked instantly. No credit card. No commitment. Full access from day one.",
                icon: Gift,
              },
              {
                num: "02",
                title: "Clone Your Niche",
                body: "Pick your industry. Your brand kit auto-applies. Your client's personalized demo is ready in 60 seconds.",
                icon: LayoutGrid,
              },
              {
                num: "03",
                title: "Close and Earn",
                body: "50/50 revenue share or set your own fixed pricing. We only win when you win.",
                icon: TrendingUp,
              },
            ].map(({ num, title, body, icon: Icon }, i) => (
              <div
                key={num}
                data-ocid={`agency_partners.how_it_works.step.${i + 1}`}
                className="relative text-center rounded-2xl border border-white/8 p-8"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 font-bold text-white text-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                  }}
                >
                  {num}
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(124,58,237,0.15)" }}
                >
                  <Icon size={16} style={{ color: "#a78bfa" }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#94a3b8" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. TESTIMONIALS ──────────────────────────────────────────────── */}
      <section
        data-ocid="agency_partners.testimonials.section"
        className="py-20 px-4"
        style={{
          background: "#0f0d1c",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <FrameworkBadge
              badge={{
                name: "kennedy",
                label: "Kennedy — Belief-Backed Testimonials",
                color: "",
              }}
              size="sm"
            />
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              What BRF Agency Partners Are Saying
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, name, niche, result }, i) => (
              <div
                key={name}
                data-ocid={`agency_partners.testimonials.item.${i + 1}`}
                className="rounded-2xl border border-purple-500/20 p-7 relative"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="absolute top-5 left-6 text-6xl font-serif leading-none"
                  style={{ color: "rgba(124,58,237,0.4)" }}
                >
                  "
                </div>
                <p
                  className="text-sm leading-relaxed mt-6 mb-6 italic"
                  style={{ color: "#cbd5e1" }}
                >
                  {quote}
                </p>
                <div className="border-t border-white/10 pt-4">
                  <div className="font-semibold text-white text-sm">{name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    {niche}
                  </div>
                  <div
                    className="text-xs font-semibold mt-2"
                    style={{ color: "#22c55e" }}
                  >
                    {result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ────────────────────────────────────────────────── */}
      <section
        data-ocid="agency_partners.final_cta.section"
        className="py-24 px-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f0b1e 0%, #14103a 50%, #0f0b1e 100%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(124,58,237,0.22) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <FrameworkBadge
              badge={{ name: "brunson", label: "Brunson — Offer", color: "" }}
              size="sm"
            />
            <FrameworkBadge
              badge={{ name: "kennedy", label: "Kennedy — Urgency", color: "" }}
              size="sm"
            />
            <FrameworkBadge
              badge={{
                name: "hormozi",
                label: "Hormozi — Value Stack",
                color: "",
              }}
              size="sm"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            Join as a Partner —{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Free for 14 Days.
            </span>{" "}
            No credit card required. Cancel anytime. Set your own pricing from
            day one.
          </h2>
          <p className="text-xl mb-3" style={{ color: "#cbd5e1" }}>
            We're accepting{" "}
            <span className="text-white font-bold">
              47 more agency partners
            </span>{" "}
            this month.
          </p>
          <p className="text-lg mb-12" style={{ color: "#64748b" }}>
            After that, the 50/50 split locks. Join free now before the window
            closes. — Kennedy urgency
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://bookedrankedfunded.org/agency-onboarding"
              data-ocid="agency_partners.final_cta.primary_button"
            >
              <Button
                size="lg"
                className="h-16 px-12 text-lg font-bold shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  boxShadow: "0 8px 40px rgba(124,58,237,0.5)",
                }}
              >
                Claim Your Partner Account Free
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </a>
            <a
              href="https://bookedrankedfunded.org/demo"
              data-ocid="agency_partners.final_cta.demo_button"
            >
              <Button
                variant="outline"
                size="lg"
                className="h-16 px-8 text-base font-semibold bg-transparent text-white hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <Play size={16} className="mr-2" />
                Watch the Demo First
              </Button>
            </a>
          </div>

          <p className="text-sm mt-5" style={{ color: "#64748b" }}>
            No credit card required · 14-day trial · Cancel anytime
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
