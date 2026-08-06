import { useActor } from "@/hooks/useActor";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  CreditCard,
  FileText,
  Globe,
  Phone,
  PhoneOff,
  Play,
  Star,
  Wrench,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

const ROOFING_DEMO_STATE = {
  niche: "roofing",
  industry: "roofing company",
  demoType: "roofing_live_demo",
  source: "roofing_landing_page",
  skipNichePicker: true,
};

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
  "Roofing Workflow",
  "AI Front Desk",
  "Review Engine",
  "Ranking Dashboard",
  "Funding-readiness Roadmap",
];

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
      className={`roofing-cta-primary px-7 py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

function DashboardMockup() {
  const items = [
    { label: "Booked Inspections", value: "12", color: "text-emerald-400" },
    { label: "Estimate Follow-up", value: "8", color: "text-blue-400" },
    { label: "Missed-call Recovery", value: "5", color: "text-amber-400" },
    { label: "Review Growth", value: "+23", color: "text-emerald-400" },
    { label: "Local Ranking Score", value: "87", color: "text-blue-400" },
    { label: "Funding-readiness", value: "74%", color: "text-yellow-300" },
    { label: "AI Front Desk", value: "ACTIVE", color: "text-emerald-300" },
  ];
  return (
    <div
      className="roofing-glass-card rounded-2xl p-6 w-full max-w-md mx-auto"
      style={{ boxShadow: "0 0 60px oklch(0.58 0.22 290 / 0.18)" }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-foreground/70 tracking-widest uppercase">
          Illustrative BRF Command Center
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl p-3"
            style={{
              background: "oklch(1 0 0 / 5%)",
              border: "1px solid oklch(1 0 0 / 10%)",
            }}
          >
            <div className={`text-xl font-bold font-display ${item.color}`}>
              {item.value}
            </div>
            <div className="text-xs text-foreground/50 mt-0.5 leading-tight">
              {item.label}
            </div>
          </div>
        ))}
        <div
          className="rounded-xl p-3"
          style={{
            background: "oklch(0.75 0.16 75 / 12%)",
            border: "1px solid oklch(0.75 0.16 75 / 30%)",
          }}
        >
          <div className="text-xl font-bold font-display text-yellow-300">
            1
          </div>
          <div className="text-xs text-foreground/50 mt-0.5 leading-tight">
            System
          </div>
        </div>
      </div>
    </div>
  );
}

function PainCard({
  icon: Icon,
  title,
  body,
  index,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
  index: number;
}) {
  return (
    <div
      data-ocid={`roofing.pain.card.${index + 1}`}
      className="roofing-glass-card rounded-2xl p-6 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-200"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: "oklch(0.58 0.22 290 / 15%)",
          border: "1px solid oklch(0.58 0.22 290 / 30%)",
        }}
      >
        <Icon size={20} className="text-blue-400" />
      </div>
      <h3 className="font-bold text-base font-display text-foreground">
        {title}
      </h3>
      <p className="text-sm text-foreground/60 leading-relaxed">{body}</p>
    </div>
  );
}

function PillarCard({
  title,
  color,
  tagline,
  features,
  index,
}: {
  title: string;
  color: string;
  tagline: string;
  features: string[];
  index: number;
}) {
  const colorMap: Record<
    string,
    { glow: string; badge: string; icon: string }
  > = {
    blue: {
      glow: "oklch(0.58 0.22 290 / 0.25)",
      badge: "oklch(0.58 0.22 290 / 18%)",
      icon: "text-blue-400",
    },
    green: {
      glow: "oklch(0.62 0.18 155 / 0.25)",
      badge: "oklch(0.62 0.18 155 / 18%)",
      icon: "text-emerald-400",
    },
    gold: {
      glow: "oklch(0.75 0.16 75 / 0.25)",
      badge: "oklch(0.75 0.16 75 / 18%)",
      icon: "text-yellow-300",
    },
  };
  const c = colorMap[color];
  return (
    <div
      data-ocid={`roofing.pillar.card.${index + 1}`}
      className="roofing-glass-card rounded-2xl p-7 flex flex-col gap-5"
      style={{ boxShadow: `0 0 40px ${c.glow}` }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: c.badge }}
        >
          <span className={`text-2xl font-black font-display ${c.icon}`}>
            {title[0]}
          </span>
        </div>
        <span
          className={`text-3xl font-black font-display tracking-tight ${c.icon}`}
        >
          {title}
        </span>
      </div>
      <p className="text-sm text-foreground/70 leading-relaxed">{tagline}</p>
      <ul className="space-y-2">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-sm text-foreground/80"
          >
            <CheckCircle size={14} className={c.icon} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HowStep({
  step,
  title,
  index,
}: {
  step: number;
  title: string;
  index: number;
}) {
  return (
    <div
      data-ocid={`roofing.how.step.${index + 1}`}
      className="flex flex-col items-center text-center gap-3"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black font-display roofing-highlight-gold"
        style={{
          background: "oklch(0.75 0.16 75 / 18%)",
          border: "2px solid oklch(0.75 0.16 75 / 40%)",
        }}
      >
        {step}
      </div>
      <p className="text-sm font-semibold text-foreground/80 max-w-[160px]">
        {title}
      </p>
    </div>
  );
}

function LoadingOverlay({
  items,
  checked,
}: {
  items: string[];
  checked: number;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0.06 0.01 280 / 0.97)" }}
    >
      <div className="text-center space-y-8 px-6">
        <div className="w-16 h-16 rounded-full border-4 border-yellow-300/30 border-t-yellow-300 animate-spin mx-auto" />
        <div>
          <h2 className="text-2xl font-black font-display roofing-highlight-gold mb-2">
            Building your roofing demo now...
          </h2>
          <p className="text-foreground/60 text-sm">
            Personalizing everything for your roofing company
          </p>
        </div>
        <div className="space-y-3 max-w-xs mx-auto text-left">
          {items.map((item, i) => (
            <div key={item} className="flex items-center gap-3">
              {i < checked ? (
                <CheckCircle size={18} className="text-emerald-400 shrink-0" />
              ) : i === checked ? (
                <div className="w-4 h-4 rounded-full border-2 border-yellow-300/50 border-t-yellow-300 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-foreground/20 shrink-0" />
              )}
              <span
                className={`text-sm ${
                  i < checked
                    ? "text-foreground/70"
                    : i === checked
                      ? "text-foreground"
                      : "text-foreground/40"
                }`}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  crewCount: string;
}

function DemoForm({ onDemoStart }: { onDemoStart: (data: FormState) => void }) {
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
    crewCount: "",
  });
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");
  const set = (field: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const isValid =
    form.firstName.trim() !== "" &&
    form.businessName.trim() !== "" &&
    form.email.includes("@") &&
    form.website.trim() !== "";

  const inputCls =
    "w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 transition-all duration-150 " +
    "bg-[oklch(1_0_0_/_5%)] border border-[oklch(1_0_0_/_12%)] focus:ring-[oklch(0.75_0.16_75_/_50%)] focus:border-[oklch(0.75_0.16_75_/_50%)]";

  const handleSubmit = () => {
    if (!isValid) {
      setError(
        "Enter your first name, roofing company, work email, and website.",
      );
      return;
    }
    setError("");
    onDemoStart({
      ...form,
      monthlyRevenue: form.monthlyRevenue || "Not provided",
      biggestProblem: form.biggestProblem || "Not provided",
      crewCount: form.crewCount || "Not provided",
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-sky-400/20 bg-sky-400/5 p-4 text-sm leading-6 text-foreground/70">
        Start with four details. Additional qualification is optional and only
        helps personalize the demo.
      </div>
      {error && (
        <p
          data-ocid="roofing.form.error_state"
          className="text-red-400 text-sm text-center"
        >
          {error}
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="roofing-firstName"
            className="block text-xs text-foreground/50 mb-1 font-medium"
          >
            First Name *
          </label>
          <input
            id="roofing-firstName"
            data-ocid="roofing.form.first_name.input"
            type="text"
            placeholder="Jordan"
            value={form.firstName}
            onChange={(event) => set("firstName", event.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor="roofing-businessName"
            className="block text-xs text-foreground/50 mb-1 font-medium"
          >
            Roofing Company *
          </label>
          <input
            id="roofing-businessName"
            data-ocid="roofing.form.business_name.input"
            type="text"
            placeholder="Summit Roofing"
            value={form.businessName}
            onChange={(event) => set("businessName", event.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="roofing-email"
          className="block text-xs text-foreground/50 mb-1 font-medium"
        >
          Work Email *
        </label>
        <input
          id="roofing-email"
          data-ocid="roofing.form.email.input"
          type="email"
          placeholder="jordan@summitroofing.com"
          value={form.email}
          onChange={(event) => set("email", event.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label
          htmlFor="roofing-website"
          className="block text-xs text-foreground/50 mb-1 font-medium"
        >
          Website *
        </label>
        <input
          id="roofing-website"
          data-ocid="roofing.form.website.input"
          type="text"
          placeholder="summitroofing.com"
          value={form.website}
          onChange={(event) => set("website", event.target.value)}
          className={inputCls}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowDetails((open) => !open)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-foreground/70 transition hover:border-white/20 hover:text-foreground"
      >
        {showDetails
          ? "Hide optional personalization"
          : "Add optional personalization"}
      </button>

      {showDetails && (
        <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="roofing-phone"
                className="block text-xs text-foreground/50 mb-1 font-medium"
              >
                Phone
              </label>
              <input
                id="roofing-phone"
                data-ocid="roofing.form.phone.input"
                type="tel"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(event) => set("phone", event.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label
                htmlFor="roofing-city"
                className="block text-xs text-foreground/50 mb-1 font-medium"
              >
                Primary City
              </label>
              <input
                id="roofing-city"
                data-ocid="roofing.form.city.input"
                type="text"
                placeholder="Dallas"
                value={form.city}
                onChange={(event) => set("city", event.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="roofing-state"
                className="block text-xs text-foreground/50 mb-1 font-medium"
              >
                State
              </label>
              <select
                id="roofing-state"
                data-ocid="roofing.form.state.select"
                value={form.state}
                onChange={(event) => set("state", event.target.value)}
                className={inputCls}
              >
                <option value="">Select state...</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="roofing-problem"
                className="block text-xs text-foreground/50 mb-1 font-medium"
              >
                Biggest Challenge
              </label>
              <select
                id="roofing-problem"
                value={form.biggestProblem}
                onChange={(event) => set("biggestProblem", event.target.value)}
                className={inputCls}
              >
                <option value="">Select challenge...</option>
                <option>Missed Calls</option>
                <option>Estimate Follow-up</option>
                <option>Google Maps Visibility</option>
                <option>Review Growth</option>
                <option>Disconnected Tools</option>
                <option>Growth Funding Readiness</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <GoldButton
        onClick={handleSubmit}
        className={`w-full text-center ${!isValid ? "opacity-60" : ""}`}
        data-ocid="roofing.form.submit_button"
      >
        See It Work for My Roofing Company
      </GoldButton>
      <p className="text-xs text-center text-foreground/35">
        No credit card. The preview is illustrative and does not guarantee
        leads, rankings, funding, or revenue.
      </p>
    </div>
  );
}

export default function RoofingPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [loading, setLoading] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const demoFormRef = useRef<HTMLDivElement>(null);

  const goDemoNow = useCallback(() => {
    navigate({
      to: "/demo",
      search: { niche: "roofing", source: "roofing_landing_page" } as never,
      state: ROOFING_DEMO_STATE as never,
    });
  }, [navigate]);

  const scrollToForm = useCallback(() => {
    demoFormRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleDemoStart = useCallback(
    async (form: FormState) => {
      setLoading(true);
      setCheckedCount(0);
      for (let i = 0; i < LOADING_ITEMS.length; i++) {
        await new Promise((r) => setTimeout(r, 400));
        setCheckedCount(i + 1);
      }
      let sessionId: string | null = null;
      try {
        if (actor)
          sessionId = await actor.createDemoSessionWithCity(
            form.businessName,
            "Roofing",
            form.city || "Your market",
          );
      } catch {
        // Demo session creation failed silently
      }
      try {
        if (actor && sessionId) {
          await actor.activateTrial(
            sessionId,
            form.firstName,
            form.businessName,
            form.city,
            "roofing",
            form.phone,
            form.email,
            form.website || "",
          );
        }
      } catch {
        // activateTrial failed silently
      }
      try {
        if (actor) {
          await actor.createLead({
            id: "",
            tenantId: "roofing_landing",
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            phone: form.phone,
            niche: "roofing",
            status: "new_lead",
            source: "roofing_landing_page",
            notes: JSON.stringify({
              lastName: form.lastName,
              website: form.website,
              state: form.state,
              monthlyRevenue: form.monthlyRevenue,
              biggestProblem: form.biggestProblem,
              crewCount: form.crewCount,
              demoType: "roofing_live_demo",
            }),
            agentSubscriptions: [],
            createdAt: BigInt(Date.now()) * BigInt(1_000_000),
          });
        }
      } catch {
        // createLead failed silently
      }
      await new Promise((r) => setTimeout(r, 500));
      setLoading(false);
      navigate({
        to: "/demo",
        search: { niche: "roofing", source: "roofing_landing_page" } as never,
        state: {
          ...ROOFING_DEMO_STATE,
          sessionId,
          firstName: form.firstName,
          lastName: form.lastName,
          businessName: form.businessName,
          city: form.city,
          phone: form.phone,
          email: form.email,
          website: form.website,
        } as never,
      });
    },
    [actor, navigate],
  );

  const painPoints = [
    {
      icon: PhoneOff,
      title: "📵 Missed Calls",
      body: "Homeowners call after storms, leaks, and damage. If nobody responds fast, they call the next roofer.",
    },
    {
      icon: FileText,
      title: "📋 Lost Estimates",
      body: "Estimates get sent, but follow-up is inconsistent. Money leaks out of the pipeline.",
    },
    {
      icon: Star,
      title: "⭐ Weak Reviews",
      body: "Happy customers do not always leave reviews unless the system asks at the right time.",
    },
    {
      icon: Globe,
      title: "📍 Poor Local Visibility",
      body: "If homeowners cannot find you or trust you online, your marketing becomes more expensive.",
    },
    {
      icon: Wrench,
      title: "🔧 Scattered Tools",
      body: "Your CRM, calls, calendar, reviews, SEO, and follow-up are disconnected.",
    },
    {
      icon: CreditCard,
      title: "💰 No Funding Plan",
      body: "Growth requires trucks, crews, equipment, marketing, and a stronger financial foundation.",
    },
  ];

  const pillars = [
    {
      title: "BOOKED",
      color: "blue",
      tagline:
        "Capture more opportunities, schedule more inspections, follow up on estimates, and keep the roofing pipeline moving.",
      features: [
        "AI Front Desk",
        "Missed-call Recovery",
        "Calendar Booking",
        "Estimate Follow-up",
        "CRM Pipeline",
        "Appointment Reminders",
      ],
    },
    {
      title: "RANKED",
      color: "green",
      tagline:
        "Strengthen your online presence so more homeowners can find you, trust you, and choose you.",
      features: [
        "Review Requests",
        "AI Review Responses",
        "Google Business Optimization",
        "Local SEO Audit",
        "Website Conversion Insights",
        "Reputation Dashboard",
      ],
    },
    {
      title: "FUNDABLE",
      color: "gold",
      tagline:
        "Organize the financial foundation behind your roofing company so you can prepare for growth opportunities.",
      features: [
        "Business Profile Checklist",
        "Funding-readiness Score",
        "Business Credit Roadmap",
        "Vendor Account Tracker",
        "Document Vault",
        "Growth Capital Preparation",
      ],
    },
  ];

  const howSteps = [
    "Enter Your Roofing Business Info",
    "BRF Builds Around Your Roofing Company",
    "See Your AI Front Desk, CRM, Reviews, Rankings, And Funding-Readiness Dashboard",
    "Activate Your Roofing Growth Operating System",
  ];

  const toolsLeft = [
    "Separate CRM",
    "Separate Call Answering",
    "Separate Review Tool",
    "Separate Calendar",
    "Separate SEO Dashboard",
    "Separate Social Scheduler",
    "Separate Funding Checklist",
    "Manual Follow-up",
  ];
  const toolsRight = [
    "One Connected CRM",
    "AI Front Desk",
    "Built-in Reputation Engine",
    "Booking and Reminders",
    "Local Ranking Dashboard",
    "Content Automation",
    "Funding-readiness Roadmap",
    "Automated Follow-up Workflows",
  ];

  return (
    <div
      className="min-h-screen pb-24 md:pb-0"
      style={{ background: "var(--surface-navy-dark)" }}
    >
      {loading && (
        <LoadingOverlay items={LOADING_ITEMS} checked={checkedCount} />
      )}

      {/* HERO */}
      <section
        data-ocid="roofing.hero.section"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(rgba(0,0,0,0.65),rgba(0,0,0,0.72))",
            zIndex: 0,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <div
            className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.58 0.22 290 / 0.12) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.75 0.16 75 / 0.08) 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: "oklch(0.75 0.16 75 / 12%)",
                border: "1px solid oklch(0.75 0.16 75 / 30%)",
              }}
            >
              <Zap size={12} className="text-yellow-300" />
              <span className="roofing-highlight-gold">
                AI-Powered Roofing Growth OS
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display leading-[1.05] text-foreground">
              Turn Missed Calls and Unsold Estimates Into{" "}
              <span className="roofing-highlight-gold">
                Booked Roof Inspections.
              </span>
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-xl">
              BRF helps roofing companies respond faster, organize every
              opportunity, follow up on estimates, request reviews, and
              understand where booked inspections are coming from — in one
              connected operating system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <GoldButton
                onClick={goDemoNow}
                data-ocid="roofing.hero.primary_button"
                className="text-lg px-8 py-5"
              >
                See It Work for My Roofing Company
              </GoldButton>
              <button
                type="button"
                data-ocid="roofing.hero.secondary_button"
                onClick={scrollToForm}
                className="px-8 py-5 rounded-xl font-bold text-base border text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-all duration-200"
                style={{ borderColor: "oklch(1 0 0 / 20%)" }}
              >
                Personalize My Demo
              </button>
            </div>
            <p className="text-sm text-foreground/40 italic">
              Built for roofing owners who want a clearer path from the first
              homeowner inquiry to the booked inspection and completed
              follow-up.
            </p>
          </div>
          <div className="hidden lg:flex justify-center">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* VSL VIDEO */}
      <section
        data-ocid="roofing.vsl.section"
        className="py-20 px-4"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.68)",
            zIndex: 0,
          }}
        />
        <div
          className="max-w-4xl mx-auto text-center space-y-6"
          style={{ position: "relative", zIndex: 1 }}
        >
          <h2 className="text-3xl sm:text-4xl font-black font-display text-foreground">
            Watch This First:{" "}
            <span className="roofing-highlight-gold">
              Where Roofing Revenue Leaks After the Lead Arrives
            </span>
          </h2>
          <p className="text-foreground/60 text-lg">
            See the path from homeowner inquiry to booked inspection, estimate
            follow-up, review request, and measurable pipeline activity.
          </p>
          <button
            type="button"
            data-ocid="roofing.vsl.card"
            className="roofing-glass-card rounded-2xl overflow-hidden relative cursor-pointer group mx-auto max-w-3xl text-left border-0 p-0"
            style={{ aspectRatio: "16/9" }}
            onClick={goDemoNow}
          >
            <img
              src="/assets/generated/roofing-hero-dashboard.dim_1200x800.jpg"
              alt="Roofing demo video thumbnail"
              className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-300"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.06 0.01 280 / 0.5) 0%, oklch(0.06 0.01 280 / 0.8) 100%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <button
                type="button"
                data-ocid="roofing.vsl.play_button"
                onClick={goDemoNow}
                className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110 cursor-pointer border-0 p-0"
                style={{
                  background: "oklch(0.75 0.16 75 / 90%)",
                  boxShadow: "0 0 40px oklch(0.75 0.16 75 / 0.5)",
                }}
              >
                <Play
                  size={28}
                  fill="currentColor"
                  className="ml-1"
                  style={{ color: "oklch(0.06 0.01 280)" }}
                />
              </button>
              <p className="text-xl sm:text-2xl font-black font-display text-foreground px-4">
                Launch the Interactive Roofing Workflow
              </p>
            </div>
          </button>
          <GoldButton
            onClick={goDemoNow}
            data-ocid="roofing.vsl.primary_button"
            className="mt-4"
          >
            Launch the Interactive Roofing Demo
          </GoldButton>
        </div>
      </section>

      {/* PAIN */}
      <section
        data-ocid="roofing.pain.section"
        className="py-20 px-4"
        style={{ background: "oklch(0.07 0.008 280)" }}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black font-display text-foreground">
              Your Marketing May Be Working.{" "}
              <span className="roofing-highlight-gold">
                The Follow-Up System Is Where Revenue Leaks.
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {painPoints.map((p, i) => (
              <PainCard key={p.title} {...p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section
        data-ocid="roofing.solution.section"
        className="py-20 px-4"
        style={{ background: "oklch(0.09 0.01 280)" }}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black font-display text-foreground">
              Now Imagine This...
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              One AI-powered operating system built around how roofing companies
              actually grow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <PillarCard key={p.title} {...p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* PROOF WITHOUT UNSUPPORTED CLAIMS */}
      <section
        data-ocid="roofing.proof.section"
        className="py-20 px-4"
        style={{ background: "#0a0f1e" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.18em] font-black text-blue-300">
              What the system demonstrates
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black font-display text-foreground">
              Follow one roofing opportunity from first contact to measurable
              follow-up.
            </h2>
            <p className="mt-4 text-foreground/60 text-lg leading-relaxed">
              Instead of relying on unverified result claims, the demo shows the
              operating workflow and the data BRF is designed to track.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-4 gap-5">
            {[
              [
                "01",
                "Lead captured",
                "A homeowner inquiry is answered and organized with source and contact context.",
              ],
              [
                "02",
                "Inspection booked",
                "The opportunity moves into a clear appointment and CRM workflow.",
              ],
              [
                "03",
                "Estimate followed up",
                "The system keeps the next action visible and supports consistent follow-up.",
              ],
              [
                "04",
                "Outcome measured",
                "The team can see activity across calls, inspections, reviews, and pipeline stages.",
              ],
            ].map(([number, title, body]) => (
              <div key={number} className="roofing-glass-card rounded-2xl p-6">
                <div className="text-xs font-black tracking-[0.16em] text-yellow-300">
                  {number}
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-foreground/55">
                  {body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-foreground/35">
            Illustrative product workflow. Actual outcomes vary by market,
            offer, execution, and operating conditions.
          </p>
        </div>
      </section>

      {/* DEMO FORM */}
      <section
        id="demo-form"
        ref={demoFormRef as React.RefObject<HTMLDivElement>}
        data-ocid="roofing.demo_form.section"
        className="py-20 px-4"
        style={{ background: "oklch(0.07 0.008 280)" }}
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black font-display text-foreground">
              See BRF Built Around{" "}
              <span className="roofing-highlight-gold">
                Your Roofing Company
              </span>
            </h2>
            <p className="text-foreground/60 text-base max-w-xl mx-auto">
              Start with your company website and contact details. Optional
              context can make the roofing workflow more relevant without
              blocking the preview.
            </p>
          </div>
          <div className="flex justify-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{
                background: "oklch(0.62 0.18 155 / 12%)",
                border: "1px solid oklch(0.62 0.18 155 / 30%)",
              }}
            >
              <CheckCircle size={14} className="text-emerald-400" />
              <span className="text-emerald-300">
                Niche: Roofing Company (Pre-selected)
              </span>
            </div>
          </div>
          <div className="roofing-glass-card rounded-2xl p-8">
            <DemoForm onDemoStart={handleDemoStart} />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        data-ocid="roofing.how.section"
        className="py-20 px-4"
        style={{ background: "oklch(0.09 0.01 280)" }}
      >
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black font-display text-foreground">
              How The{" "}
              <span className="roofing-highlight-gold">Roofing Demo</span> Works
            </h2>
          </div>
          <div className="hidden md:flex items-start justify-between gap-4 relative">
            <div
              className="absolute top-7 left-[10%] right-[10%] h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.75 0.16 75 / 40%), oklch(0.75 0.16 75 / 10%))",
              }}
            />
            {howSteps.map((title, i) => (
              <HowStep key={title} step={i + 1} title={title} index={i} />
            ))}
          </div>
          <div className="md:hidden space-y-6">
            {howSteps.map((title, i) => (
              <div key={title} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base font-black font-display roofing-highlight-gold shrink-0"
                  style={{
                    background: "oklch(0.75 0.16 75 / 18%)",
                    border: "2px solid oklch(0.75 0.16 75 / 40%)",
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-sm font-semibold text-foreground/80 pt-2">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section
        data-ocid="roofing.comparison.section"
        className="py-20 px-4"
        style={{ background: "oklch(0.07 0.008 280)" }}
      >
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black font-display text-foreground">
              Stop Paying For Tools That{" "}
              <span className="roofing-highlight-gold">
                Do Not Talk To Each Other
              </span>
            </h2>
          </div>
          <div className="roofing-glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div
                className="px-6 py-4 border-b border-r"
                style={{ borderColor: "oklch(1 0 0 / 8%)" }}
              >
                <span className="text-sm font-bold text-red-400 uppercase tracking-wide">
                  Disconnected Tools
                </span>
              </div>
              <div
                className="px-6 py-4 border-b"
                style={{
                  borderColor: "oklch(1 0 0 / 8%)",
                  background: "oklch(0.75 0.16 75 / 6%)",
                }}
              >
                <span className="text-sm font-bold roofing-highlight-gold uppercase tracking-wide">
                  Booked Ranked Fundable
                </span>
              </div>
            </div>
            {toolsLeft.map((left, i) => (
              <div
                key={left}
                data-ocid={`roofing.comparison.row.${i + 1}`}
                className="grid grid-cols-2"
                style={{
                  borderBottom:
                    i < toolsLeft.length - 1
                      ? "1px solid oklch(1 0 0 / 6%)"
                      : "none",
                }}
              >
                <div
                  className="px-6 py-4 flex items-center gap-3 border-r"
                  style={{ borderColor: "oklch(1 0 0 / 6%)" }}
                >
                  <XCircle size={16} className="text-red-400 shrink-0" />
                  <span className="text-sm text-foreground/60">{left}</span>
                </div>
                <div
                  className="px-6 py-4 flex items-center gap-3"
                  style={{ background: "oklch(0.75 0.16 75 / 3%)" }}
                >
                  <CheckCircle
                    size={16}
                    className="text-emerald-400 shrink-0"
                  />
                  <span className="text-sm text-foreground/80">
                    {toolsRight[i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        data-ocid="roofing.final_cta.section"
        className="py-24 px-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.08 0.012 280) 0%, oklch(0.12 0.02 290) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <div
            className="w-16 h-1 mx-auto rounded"
            style={{ background: "var(--gold-accent)" }}
          />
          <h2 className="text-4xl sm:text-5xl font-black font-display text-foreground leading-tight">
            Your Marketing Sucks.{" "}
            <span className="roofing-highlight-gold">
              Your System Shouldn't.
            </span>
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            See how Booked Ranked Fundable helps roofing companies get booked,
            ranked, and fundable from one AI-powered operating system.
          </p>
          <GoldButton
            onClick={goDemoNow}
            data-ocid="roofing.final_cta.primary_button"
            className="text-lg px-10 py-5"
          >
            See It Work for My Roofing Company
          </GoldButton>
        </div>
      </section>

      {/* FOOTER COMPLIANCE */}
      <footer
        data-ocid="roofing.footer.section"
        className="py-8 px-4 text-center"
        style={{
          background: "oklch(0.06 0.008 280)",
          borderTop: "1px solid oklch(1 0 0 / 6%)",
        }}
      >
        <p className="text-xs text-foreground/30 max-w-3xl mx-auto leading-relaxed">
          BRF provides software, automation, marketing support, and
          funding-readiness guidance. BRF does not guarantee funding approval,
          credit approval, search ranking results, or revenue outcomes.
        </p>
        <p className="text-xs text-foreground/20 mt-3">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground/40 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div
        data-ocid="roofing.sticky_cta.panel"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden px-4 pb-4 pt-3"
        style={{
          background: "oklch(0.08 0.01 280 / 0.97)",
          borderTop: "1px solid oklch(0.75 0.16 75 / 30%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex gap-2 max-w-md mx-auto">
          <button
            type="button"
            data-ocid="roofing.sticky_cta.watch_demo_button"
            onClick={goDemoNow}
            className="roofing-cta-primary flex-1 py-3 rounded-xl font-bold text-sm"
          >
            Watch Demo
          </button>
          <a
            href="tel:+18000000000"
            data-ocid="roofing.sticky_cta.call_button"
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-bold text-sm border text-foreground/80 hover:text-foreground transition-colors"
            style={{
              borderColor: "oklch(1 0 0 / 20%)",
              background: "oklch(1 0 0 / 5%)",
            }}
          >
            <Phone size={14} />
            Call
          </a>
          <button
            type="button"
            data-ocid="roofing.sticky_cta.request_demo_button"
            onClick={scrollToForm}
            className="flex-1 py-3 rounded-xl font-bold text-sm border text-foreground/80 hover:text-foreground transition-colors"
            style={{
              borderColor: "oklch(1 0 0 / 20%)",
              background: "oklch(1 0 0 / 5%)",
            }}
          >
            Request Demo
          </button>
        </div>
      </div>
    </div>
  );
}
