import {
  type HomeServiceNicheConfig,
  getHomeServiceNicheConfig,
} from "@/data/homeServiceNicheConfig";
import {
  type NicheLeadFormData,
  useNicheLeadSubmit,
} from "@/hooks/useNicheLeadSubmit";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Droplets,
  Globe,
  PhoneOff,
  Settings,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

const NICHE_CONFIG = getHomeServiceNicheConfig(
  "plumbing",
) as HomeServiceNicheConfig;

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const LOADING_ITEMS = [
  "Plumbing Workflow",
  "AI Front Desk",
  "Review Engine",
  "Ranking Dashboard",
  "Funding-readiness Roadmap",
];

interface FormState {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  state: string;
  monthlyRevenue: string;
  biggestProblem: string;
  teamSize: string;
  issueType: string;
  waterHeaterType: string;
  emergencyPriority: string;
  propertyType: string;
  financingInterest: string;
}

const inputCls =
  "w-full rounded-xl px-4 py-2.5 text-sm bg-[oklch(1_0_0_/_6%)] border border-[oklch(1_0_0_/_12%)] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[oklch(0.55_0.18_200_/_60%)] transition-colors";

function GoldButton({
  children,
  onClick,
  className = "",
  "data-ocid": ocid,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  "data-ocid"?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      className={`px-7 py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 ${className}`}
    >
      {children}
    </button>
  );
}

function PlumbingIntakeForm({
  onDemoStart,
}: {
  onDemoStart: (form: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    website: "",
    city: "",
    state: "",
    monthlyRevenue: "",
    biggestProblem: "",
    teamSize: "",
    issueType: "",
    waterHeaterType: "",
    emergencyPriority: "",
    propertyType: "",
    financingInterest: "",
  });
  const [error, setError] = useState("");

  const set = (k: keyof FormState, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const isValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.businessName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.city.trim() &&
    form.state &&
    form.monthlyRevenue &&
    form.biggestProblem &&
    form.teamSize;

  const handleSubmit = () => {
    if (!isValid) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    onDemoStart(form);
  };

  return (
    <div className="space-y-5">
      {error && (
        <p
          data-ocid="plumbing.form.error_state"
          className="text-red-400 text-sm text-center"
        >
          {error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="plumbing-firstName"
            className="block text-xs text-foreground/50 mb-1 font-medium"
          >
            First Name *
          </label>
          <input
            id="plumbing-firstName"
            data-ocid="plumbing.form.first_name.input"
            type="text"
            placeholder="Carlos"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor="plumbing-lastName"
            className="block text-xs text-foreground/50 mb-1 font-medium"
          >
            Last Name *
          </label>
          <input
            id="plumbing-lastName"
            data-ocid="plumbing.form.last_name.input"
            type="text"
            placeholder="Rivera"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="plumbing-businessName"
          className="block text-xs text-foreground/50 mb-1 font-medium"
        >
          Business Name *
        </label>
        <input
          id="plumbing-businessName"
          data-ocid="plumbing.form.business_name.input"
          type="text"
          placeholder="Rivera Plumbing Co."
          value={form.businessName}
          onChange={(e) => set("businessName", e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="plumbing-email"
            className="block text-xs text-foreground/50 mb-1 font-medium"
          >
            Email *
          </label>
          <input
            id="plumbing-email"
            data-ocid="plumbing.form.email.input"
            type="email"
            placeholder="carlos@riveraplumbing.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor="plumbing-phone"
            className="block text-xs text-foreground/50 mb-1 font-medium"
          >
            Phone *
          </label>
          <input
            id="plumbing-phone"
            data-ocid="plumbing.form.phone.input"
            type="tel"
            placeholder="(555) 123-4567"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="plumbing-website"
          className="block text-xs text-foreground/50 mb-1 font-medium"
        >
          Website *
        </label>
        <input
          id="plumbing-website"
          data-ocid="plumbing.form.website.input"
          type="text"
          placeholder="riveraplumbing.com"
          value={form.website}
          onChange={(e) => set("website", e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="plumbing-city"
            className="block text-xs text-foreground/50 mb-1 font-medium"
          >
            City *
          </label>
          <input
            id="plumbing-city"
            data-ocid="plumbing.form.city.input"
            type="text"
            placeholder="San Diego"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor="plumbing-state"
            className="block text-xs text-foreground/50 mb-1 font-medium"
          >
            State *
          </label>
          <select
            id="plumbing-state"
            data-ocid="plumbing.form.state.select"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            className={inputCls}
          >
            <option value="">Select...</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label
          htmlFor="plumbing-revenue"
          className="block text-xs text-foreground/50 mb-1 font-medium"
        >
          Monthly Revenue Range *
        </label>
        <select
          id="plumbing-revenue"
          data-ocid="plumbing.form.revenue.select"
          value={form.monthlyRevenue}
          onChange={(e) => set("monthlyRevenue", e.target.value)}
          className={inputCls}
        >
          <option value="">Select range...</option>
          {[
            "Under $10K/mo",
            "$10K–$25K/mo",
            "$25K–$50K/mo",
            "$50K–$100K/mo",
            "$100K+/mo",
          ].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Primary service type */}
      <div>
        <p className="block text-xs text-foreground/50 mb-2 font-medium">
          Primary Service Type *
        </p>
        <div className="space-y-2">
          {NICHE_CONFIG.intakeQuestions
            .find((q) => q.id === "issueType")
            ?.options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="plumbing-issueType"
                  value={opt.value}
                  checked={form.issueType === opt.value}
                  onChange={() => set("issueType", opt.value)}
                  className="accent-cyan-400"
                  data-ocid="plumbing.form.issue_type.radio"
                />
                <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
        </div>
      </div>

      {/* Emergency dispatch priority */}
      <div>
        <p className="block text-xs text-foreground/50 mb-2 font-medium">
          Dispatch Priority
        </p>
        <div className="flex flex-wrap gap-2">
          {NICHE_CONFIG.intakeQuestions
            .find((q) => q.id === "emergencyPriority")
            ?.options.map((opt) => (
              <button
                type="button"
                key={opt.value}
                data-ocid="plumbing.form.priority.toggle"
                onClick={() => set("emergencyPriority", opt.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                  form.emergencyPriority === opt.value
                    ? "bg-cyan-600/20 border-cyan-500/60 text-cyan-300"
                    : "bg-[oklch(1_0_0_/_4%)] border-[oklch(1_0_0_/_12%)] text-foreground/60 hover:border-[oklch(1_0_0_/_25%)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
        </div>
      </div>

      {/* Biggest Problem */}
      <div>
        <p className="block text-xs text-foreground/50 mb-2 font-medium">
          Biggest Current Problem *
        </p>
        <div className="space-y-2">
          {NICHE_CONFIG.biggestProblems.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="biggestProblem"
                value={opt}
                checked={form.biggestProblem === opt}
                onChange={() => set("biggestProblem", opt)}
                className="accent-cyan-400"
                data-ocid="plumbing.form.problem.radio"
              />
              <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                {opt}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Team Size */}
      <div>
        <p className="block text-xs text-foreground/50 mb-2 font-medium">
          Team Size *
        </p>
        <div className="flex flex-wrap gap-2">
          {NICHE_CONFIG.teamSizeOptions.map((opt) => (
            <button
              type="button"
              key={opt}
              data-ocid="plumbing.form.team_size.toggle"
              onClick={() => set("teamSize", opt)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                form.teamSize === opt
                  ? "bg-cyan-600/20 border-cyan-500/60 text-cyan-300"
                  : "bg-[oklch(1_0_0_/_4%)] border-[oklch(1_0_0_/_12%)] text-foreground/60 hover:border-[oklch(1_0_0_/_25%)]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <GoldButton
        onClick={handleSubmit}
        className={`w-full text-center ${!isValid ? "opacity-50 cursor-not-allowed" : ""}`}
        data-ocid="plumbing.form.submit_button"
      >
        {NICHE_CONFIG.ctaLabel}
      </GoldButton>
      <p className="text-xs text-center text-foreground/30">
        No credit card required. Plumbing-specific demo only.
      </p>
    </div>
  );
}

export default function PlumbingPage() {
  const [loading, setLoading] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const demoFormRef = useRef<HTMLDivElement>(null);

  const { submit, error: submitError } = useNicheLeadSubmit({
    nicheKey: "plumbing",
    nicheName: "Plumbing",
    source: "plumbing_landing_page",
    loadingItems: LOADING_ITEMS,
    onLoadingStep: setCheckedCount,
  });

  const scrollToForm = useCallback(() => {
    demoFormRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleDemoStart = useCallback(
    async (form: FormState) => {
      setLoading(true);
      const leadData: NicheLeadFormData = {
        firstName: form.firstName,
        lastName: form.lastName,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
        website: form.website,
        city: form.city,
        state: form.state,
        monthlyRevenue: form.monthlyRevenue,
        biggestProblem: form.biggestProblem,
        teamSize: form.teamSize,
        nicheFields: {
          issueType: form.issueType,
          waterHeaterType: form.waterHeaterType,
          emergencyPriority: form.emergencyPriority,
          propertyType: form.propertyType,
          financingInterest: form.financingInterest,
        },
      };
      try {
        await submit(leadData);
      } finally {
        setLoading(false);
      }
    },
    [submit],
  );

  const painPoints = [
    {
      icon: PhoneOff,
      title: "📵 Missed Emergency Calls",
      body: "Burst pipes and sewer backups happen at midnight. If nobody answers, they call the next plumber.",
    },
    {
      icon: Zap,
      title: "⚡ Slow Speed-to-Lead",
      body: "The first plumber to respond almost always wins the job. If your follow-up is slow, you're handing work to faster competitors.",
    },
    {
      icon: Star,
      title: "⭐ Weak Reviews",
      body: "Customers compare reviews before calling. A thin review profile loses jobs before you even pick up the phone.",
    },
    {
      icon: Globe,
      title: "📍 Poor Google Maps Presence",
      body: "If you're not in the top 3 on the Map Pack, you're invisible to homeowners who need a plumber right now.",
    },
    {
      icon: Wrench,
      title: "🔧 Scattered Tools",
      body: "Your CRM, calls, calendar, reviews, SEO, and follow-up are all disconnected.",
    },
    {
      icon: CreditCard,
      title: "💰 No Funding Plan",
      body: "Vans, equipment, hiring, and marketing require capital. Without a fundable profile, growth stalls.",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.11 0.02 220)" }}
    >
      {/* Nav placeholder */}
      <div className="h-16" />

      {/* Hero */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            Plumbing Business Growth System
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Stop Losing Emergency Calls to Competitors Who Show Up First on
            Google
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            More booked calls, stronger local rankings, and a business built for
            funding — one system for plumbers who want to grow.
          </p>
          <GoldButton
            onClick={scrollToForm}
            data-ocid="plumbing.hero.cta_button"
          >
            Build My Live Plumbing Demo →
          </GoldButton>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Sound Familiar?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {painPoints.map((p, i) => (
              <div
                key={p.title}
                data-ocid={`plumbing.pain.card.${i + 1}`}
                className="rounded-2xl p-6 flex flex-col gap-3"
                style={{
                  background: "oklch(1 0 0 / 5%)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/15 border border-cyan-500/30">
                  <p.icon size={20} className="text-cyan-400" />
                </div>
                <h3 className="font-bold text-base text-white">{p.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Engines */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Three Engines. One System. Built for Plumbing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Droplets,
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/25",
                label: "Booked",
                headline: "Capture Every Emergency Call — Even at 2 AM",
                body: "AI front desk captures every inquiry 24/7, responds instantly, and routes jobs into your pipeline — so you never lose a lead to voicemail.",
              },
              {
                icon: Globe,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/25",
                label: "Ranked",
                headline: "Own the Google Map Pack in Your Service Area",
                body: "We optimize your GBP, build citations, generate reviews, and post seasonal content to keep you visible when homeowners need a plumber most.",
              },
              {
                icon: Settings,
                color: "text-yellow-400",
                bg: "bg-yellow-500/10",
                border: "border-yellow-500/25",
                label: "Funded",
                headline: "Build a Business Ready for Growth Capital",
                body: "From equipment financing to business credit, we help plumbing companies build the financial profile lenders want to see before writing a check.",
              },
            ].map((engine) => (
              <div
                key={engine.label}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: "oklch(1 0 0 / 5%)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                }}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${engine.bg} border ${engine.border}`}
                >
                  <engine.icon size={20} className={engine.color} />
                </div>
                <div>
                  <div
                    className={`text-xs font-bold uppercase tracking-widest mb-1 ${engine.color}`}
                  >
                    {engine.label}
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    {engine.headline}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {engine.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intake Form */}
      <section ref={demoFormRef} id="plumbing-demo-form" className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              Build Your Live Plumbing Demo
            </h2>
            <p className="text-white/60">
              We'll configure a personalized demo based on your plumbing
              business in under 2 minutes.
            </p>
          </div>
          <div
            className="rounded-2xl p-8"
            style={{
              background: "oklch(1 0 0 / 5%)",
              border: "1px solid oklch(1 0 0 / 10%)",
            }}
          >
            {loading ? (
              <div className="space-y-4 py-4">
                <p className="text-center text-white/70 text-sm mb-6">
                  Building your plumbing demo…
                </p>
                {LOADING_ITEMS.map((item, i) => (
                  <div key={item} className="flex items-center gap-3">
                    {i < checkedCount ? (
                      <CheckCircle
                        size={16}
                        className="text-emerald-400 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0 animate-pulse" />
                    )}
                    <span
                      className={`text-sm transition-colors ${i < checkedCount ? "text-white" : "text-white/30"}`}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {submitError && (
                  <div className="flex items-start gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 mb-5">
                    <AlertCircle
                      size={16}
                      className="text-rose-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-rose-300 text-sm">{submitError}</p>
                  </div>
                )}
                <PlumbingIntakeForm onDemoStart={handleDemoStart} />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
