import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe,
  Lightbulb,
  MessageSquare,
  Phone,
  Search,
  Star,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

const NICHES = [
  { id: "plumbing", label: "Plumbing", emoji: "🔧" },
  { id: "hvac", label: "HVAC", emoji: "❄️" },
  { id: "restoration", label: "Restoration", emoji: "🏠" },
  { id: "roofing", label: "Roofing", emoji: "🏗️" },
  { id: "carpet-cleaning", label: "Carpet Cleaning", emoji: "✨" },
  { id: "med-spa", label: "Med Spa", emoji: "💆" },
];

const GOALS = [
  "Get more booked jobs",
  "Rank higher on Google",
  "Build business credit",
  "Automate reviews",
  "Run better ads",
  "All of the above",
];

const BENEFITS = [
  {
    icon: Phone,
    title: "AI Front Desk",
    desc: "Never miss a lead. Your AI answers calls, qualifies prospects, and books jobs automatically.",
  },
  {
    icon: Search,
    title: "Rank Higher",
    desc: "Dominate local search results. SEO, Google Business Profile, and AI visibility — all managed for you.",
  },
  {
    icon: Star,
    title: "Review Engine",
    desc: "Automated review requests after every completed job. More 5-star reviews, more trust, more calls.",
  },
  {
    icon: TrendingUp,
    title: "Fundability Builder",
    desc: "Build your business credit profile so you qualify for financing when it's time to grow.",
  },
  {
    icon: BarChart3,
    title: "Growth Analytics",
    desc: "See exactly where your leads come from, what's converting, and what to focus on next.",
  },
  {
    icon: Globe,
    title: "SEO & GEO Agent",
    desc: "Managed AI-powered SEO and generative search visibility across Google and AI discovery surfaces.",
  },
];

const WHAT_HAPPENS_NEXT = [
  "We'll review your business details and set up your personalized dashboard.",
  "Your AI front desk will be configured for your specific niche and service area.",
  "We'll run your first SEO audit and fundability scan at no cost.",
  "A growth specialist will reach out within 1 business day to walk you through your results.",
];

interface FormData {
  firstName: string;
  lastName: string;
  businessName: string;
  city: string;
  niche: string;
  phone: string;
  email: string;
  goal: string;
}

const EMPTY_FORM: FormData = {
  firstName: "",
  lastName: "",
  businessName: "",
  city: "",
  niche: "",
  phone: "",
  email: "",
  goal: "",
};

type Errors = Partial<Record<keyof FormData, string>>;

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
    : "124, 58, 237";
}

export default function AgencyOnboardingPage() {
  const { whiteLabelSettings: settings } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const primaryColor = settings.primaryColor || "#7c3aed";
  const secondaryColor = settings.secondaryColor || "#4f46e5";
  const agencyName = settings.agencyName || "Your Agency";

  const initials = agencyName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const prevStep = useRef(0);
  useEffect(() => {
    if (prevStep.current !== step) {
      prevStep.current = step;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  const patch = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateStep1 = (): boolean => {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.businessName.trim()) e.businessName = "Business name is required";
    if (!form.city.trim()) e.city = "City / service area is required";
    if (!form.niche) e.niche = "Please select your industry";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Errors = {};
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email";
    }
    if (!form.goal) e.goal = "Please select your primary goal";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const selectedNiche = NICHES.find((n) => n.id === form.niche);

  if (submitted) {
    return (
      <SuccessState
        form={form}
        settings={{
          agencyName,
          primaryColor,
          secondaryColor,
          logoDataUrl: settings.logoDataUrl,
        }}
      />
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0a0a14 0%, #110d2e 100%)",
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
        }}
      />

      {/* Header */}
      <header className="px-6 py-5 flex items-center gap-4 border-b border-white/5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-lg"
          style={{
            background: settings.logoDataUrl
              ? "transparent"
              : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
        >
          {settings.logoDataUrl ? (
            <img
              src={settings.logoDataUrl}
              alt={agencyName}
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-none">
            {agencyName}
          </p>
          {settings.tagline && (
            <p className="text-slate-400 text-xs mt-0.5">{settings.tagline}</p>
          )}
        </div>
        <div className="ml-auto">
          <Badge
            className="text-xs border"
            style={{
              background: `rgba(${hexToRgb(primaryColor)}, 0.15)`,
              color: primaryColor,
              borderColor: `rgba(${hexToRgb(primaryColor)}, 0.3)`,
            }}
          >
            Powered by AI
          </Badge>
        </div>
      </header>

      {/* Hero headline */}
      <div className="px-6 py-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          {settings.heroHeadline ||
            "The Platform That Books, Ranks & Funds Your Business"}
        </h1>
        <p className="mt-3 text-slate-400 text-base">
          Set up your personalized growth platform in minutes.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left — Benefits */}
        <div className="space-y-4 order-2 lg:order-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            What you get
          </p>
          <div className="grid grid-cols-1 gap-3">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: `rgba(${hexToRgb(primaryColor)}, 0.15)`,
                  }}
                >
                  <Icon size={15} style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 mt-2">
            <div className="flex gap-0.5 mb-3">
              {(["s1", "s2", "s3", "s4", "s5"] as const).map((k) => (
                <Star
                  key={k}
                  size={13}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "Our inbound calls increased significantly in the first 60 days.
              The AI front desk books jobs while we sleep — it's changed how we
              run our business."
            </p>
            <p className="text-slate-500 text-xs mt-3 font-medium">
              — Marcus T., Plumbing Company Owner
            </p>
          </div>
        </div>

        {/* Right — Wizard */}
        <div className="order-1 lg:order-2">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className="flex-1 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background:
                      s <= step
                        ? `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
                        : "rgba(255,255,255,0.08)",
                  }}
                />
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0"
                  style={{
                    background:
                      s < step
                        ? primaryColor
                        : s === step
                          ? `rgba(${hexToRgb(primaryColor)}, 0.25)`
                          : "rgba(255,255,255,0.06)",
                    color: s <= step ? "white" : "#64748b",
                    border: s === step ? `1.5px solid ${primaryColor}` : "none",
                  }}
                >
                  {s < step ? <CheckCircle2 size={13} /> : s}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 space-y-5">
            {/* Step 1 */}
            {step === 1 && (
              <Step1
                form={form}
                errors={errors}
                patch={patch}
                primaryColor={primaryColor}
                onNext={handleNext}
              />
            )}

            {/* Step 2 */}
            {step === 2 && (
              <Step2
                form={form}
                errors={errors}
                patch={patch}
                primaryColor={primaryColor}
                onBack={() => setStep(1)}
                onNext={handleNext}
              />
            )}

            {/* Step 3 */}
            {step === 3 && (
              <Step3
                form={form}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                agencyName={agencyName}
                selectedNiche={selectedNiche}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Step 1 — Your Business
// ──────────────────────────────────────────────
function Step1({
  form,
  errors,
  patch,
  primaryColor,
  onNext,
}: {
  form: FormData;
  errors: Errors;
  patch: (k: keyof FormData, v: string) => void;
  primaryColor: string;
  onNext: () => void;
}) {
  return (
    <div className="space-y-5" data-ocid="onboarding.step1.panel">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          Step 1 of 3
        </p>
        <h2 className="text-xl font-bold text-white mt-1">
          Tell us about your business
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">First Name *</Label>
          <Input
            value={form.firstName}
            onChange={(e) => patch("firstName", e.target.value)}
            placeholder="Carlos"
            className="bg-slate-800/80 border-slate-600 text-white placeholder-slate-500"
            data-ocid="onboarding.firstname.input"
          />
          {errors.firstName && (
            <p
              className="text-red-400 text-xs"
              data-ocid="onboarding.firstname.error_state"
            >
              {errors.firstName}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">Last Name</Label>
          <Input
            value={form.lastName}
            onChange={(e) => patch("lastName", e.target.value)}
            placeholder="Martinez"
            className="bg-slate-800/80 border-slate-600 text-white placeholder-slate-500"
            data-ocid="onboarding.lastname.input"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-slate-300 text-xs">Business Name *</Label>
        <Input
          value={form.businessName}
          onChange={(e) => patch("businessName", e.target.value)}
          placeholder="Martinez HVAC & Plumbing"
          className="bg-slate-800/80 border-slate-600 text-white placeholder-slate-500"
          data-ocid="onboarding.businessname.input"
        />
        {errors.businessName && (
          <p
            className="text-red-400 text-xs"
            data-ocid="onboarding.businessname.error_state"
          >
            {errors.businessName}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-slate-300 text-xs">City / Service Area *</Label>
        <Input
          value={form.city}
          onChange={(e) => patch("city", e.target.value)}
          placeholder="San Diego, CA"
          className="bg-slate-800/80 border-slate-600 text-white placeholder-slate-500"
          data-ocid="onboarding.city.input"
        />
        {errors.city && (
          <p
            className="text-red-400 text-xs"
            data-ocid="onboarding.city.error_state"
          >
            {errors.city}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300 text-xs">Your Industry *</Label>
        <div className="grid grid-cols-3 gap-2">
          {NICHES.map((niche) => (
            <button
              key={niche.id}
              type="button"
              onClick={() => patch("niche", niche.id)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all text-xs font-medium"
              style={{
                background:
                  form.niche === niche.id
                    ? `rgba(${niche.id === form.niche ? "124, 58, 237" : "255,255,255"}, 0.12)`
                    : "rgba(255,255,255,0.03)",
                borderColor:
                  form.niche === niche.id
                    ? primaryColor
                    : "rgba(255,255,255,0.08)",
                color: form.niche === niche.id ? "white" : "#94a3b8",
              }}
              data-ocid={`onboarding.niche.${niche.id}.toggle`}
            >
              <span className="text-xl">{niche.emoji}</span>
              <span>{niche.label}</span>
            </button>
          ))}
        </div>
        {errors.niche && (
          <p
            className="text-red-400 text-xs"
            data-ocid="onboarding.niche.error_state"
          >
            {errors.niche}
          </p>
        )}
      </div>

      <Button
        onClick={onNext}
        className="w-full gap-2 text-white font-semibold"
        style={{
          background: `linear-gradient(90deg, ${primaryColor}, #4f46e5)`,
        }}
        data-ocid="onboarding.step1.primary_button"
      >
        Continue <ChevronRight size={16} />
      </Button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Step 2 — Contact & Goals
// ──────────────────────────────────────────────
function Step2({
  form,
  errors,
  patch,
  primaryColor,
  onBack,
  onNext,
}: {
  form: FormData;
  errors: Errors;
  patch: (k: keyof FormData, v: string) => void;
  primaryColor: string;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-5" data-ocid="onboarding.step2.panel">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          Step 2 of 3
        </p>
        <h2 className="text-xl font-bold text-white mt-1">
          Contact info & your goal
        </h2>
      </div>

      <div className="space-y-1.5">
        <Label className="text-slate-300 text-xs">Phone Number *</Label>
        <Input
          value={form.phone}
          onChange={(e) => patch("phone", e.target.value)}
          placeholder="(619) 555-0123"
          type="tel"
          className="bg-slate-800/80 border-slate-600 text-white placeholder-slate-500"
          data-ocid="onboarding.phone.input"
        />
        {errors.phone && (
          <p
            className="text-red-400 text-xs"
            data-ocid="onboarding.phone.error_state"
          >
            {errors.phone}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-slate-300 text-xs">Email Address *</Label>
        <Input
          value={form.email}
          onChange={(e) => patch("email", e.target.value)}
          placeholder="carlos@martinezhvac.com"
          type="email"
          className="bg-slate-800/80 border-slate-600 text-white placeholder-slate-500"
          data-ocid="onboarding.email.input"
        />
        {errors.email && (
          <p
            className="text-red-400 text-xs"
            data-ocid="onboarding.email.error_state"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300 text-xs">Your Primary Goal *</Label>
        <div className="grid grid-cols-1 gap-2">
          {GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => patch("goal", goal)}
              className="flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all"
              style={{
                background:
                  form.goal === goal
                    ? "rgba(124, 58, 237, 0.12)"
                    : "rgba(255,255,255,0.03)",
                borderColor:
                  form.goal === goal ? primaryColor : "rgba(255,255,255,0.08)",
                color: form.goal === goal ? "white" : "#94a3b8",
              }}
              data-ocid={"onboarding.goal.toggle"}
            >
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: form.goal === goal ? primaryColor : "#475569",
                  background: form.goal === goal ? primaryColor : "transparent",
                }}
              >
                {form.goal === goal && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </div>
              {goal}
            </button>
          ))}
        </div>
        {errors.goal && (
          <p
            className="text-red-400 text-xs"
            data-ocid="onboarding.goal.error_state"
          >
            {errors.goal}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          data-ocid="onboarding.step2.cancel_button"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 gap-2 text-white font-semibold"
          style={{
            background: `linear-gradient(90deg, ${primaryColor}, #4f46e5)`,
          }}
          data-ocid="onboarding.step2.primary_button"
        >
          Review <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Step 3 — Confirm
// ──────────────────────────────────────────────
function Step3({
  form,
  primaryColor,
  secondaryColor,
  agencyName,
  selectedNiche,
  onBack,
  onSubmit,
}: {
  form: FormData;
  primaryColor: string;
  secondaryColor: string;
  agencyName: string;
  selectedNiche: (typeof NICHES)[0] | undefined;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-5" data-ocid="onboarding.step3.panel">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          Step 3 of 3
        </p>
        <h2 className="text-xl font-bold text-white mt-1">
          Confirm your details
        </h2>
      </div>

      {/* Summary */}
      <div className="bg-slate-800/60 rounded-xl border border-white/[0.08] p-4 space-y-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <p className="text-slate-500 text-xs">Name</p>
            <p className="text-white font-medium">
              {form.firstName} {form.lastName}
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Business</p>
            <p className="text-white font-medium">{form.businessName}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Location</p>
            <p className="text-white font-medium">{form.city}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Industry</p>
            <p className="text-white font-medium">
              {selectedNiche
                ? `${selectedNiche.emoji} ${selectedNiche.label}`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Phone</p>
            <p className="text-white font-medium">{form.phone}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Email</p>
            <p className="text-white font-medium truncate">{form.email}</p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-500 text-xs">Primary Goal</p>
            <p className="text-white font-medium">{form.goal}</p>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          What happens next
        </p>
        {WHAT_HAPPENS_NEXT.map((item, i) => (
          <div key={item.slice(0, 25)} className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              {i + 1}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-xs">
        By submitting, you agree to be contacted by {agencyName} regarding your
        growth platform setup.
      </p>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          data-ocid="onboarding.step3.cancel_button"
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          className="flex-1 gap-2 text-white font-semibold"
          style={{
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
          }}
          data-ocid="onboarding.step3.submit_button"
        >
          <Zap size={15} />
          Activate My Platform
        </Button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Success State
// ──────────────────────────────────────────────
function SuccessState({
  form,
  settings,
}: {
  form: FormData;
  settings: {
    agencyName: string;
    primaryColor: string;
    secondaryColor: string;
    logoDataUrl: string;
  };
}) {
  const { primaryColor, secondaryColor, agencyName } = settings;

  const selectedNiche = NICHES.find((n) => n.id === form.niche);

  const STATS = [
    { label: "New Leads", value: "7", icon: TrendingUp, note: "this week" },
    { label: "Review Requests", value: "3", icon: Star, note: "sent" },
    { label: "SEO Score", value: "71", icon: Search, note: "of 100" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0a0a14 0%, #110d2e 100%)",
      }}
    >
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
        }}
      />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          className="max-w-lg w-full text-center space-y-8"
          data-ocid="onboarding.success_state"
        >
          {/* Check icon */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "2px solid rgba(16, 185, 129, 0.4)",
              }}
            >
              <CheckCircle2 size={36} className="text-emerald-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              You're all set, {form.firstName}!
            </h1>
            <p className="text-slate-400 text-base">
              Your {form.businessName} dashboard is being configured.
            </p>
          </div>

          {/* AI greeting */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                <Bot size={18} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  AI Business Manager
                </p>
                <p className="text-slate-500 text-xs">Personalized briefing</p>
              </div>
              <Badge className="ml-auto bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">
                Live
              </Badge>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4">
              <p className="text-slate-200 text-sm leading-relaxed">
                Good {getTimeOfDay()}, {form.firstName}. Here's a snapshot of
                what{" "}
                <span className="text-white font-semibold">
                  {form.businessName}
                </span>
                's dashboard would look like in {form.city} with the platform
                fully active.
                {selectedNiche
                  ? ` As a ${selectedNiche.label.toLowerCase()} business, your AI front desk, review engine, and local SEO tools are pre-configured to your niche.`
                  : ""}{" "}
                Your goal is to{" "}
                <span className="text-white font-semibold">
                  {form.goal.toLowerCase()}
                </span>{" "}
                — and here's where we'd start.
              </p>
            </div>

            {/* Simulated stat cards */}
            <div className="grid grid-cols-3 gap-3">
              {STATS.map(({ label, value, icon: Icon, note }) => (
                <div
                  key={label}
                  className="bg-slate-800/70 rounded-xl p-3 border border-white/[0.06] text-center"
                >
                  <Icon
                    size={14}
                    className="mx-auto mb-1"
                    style={{ color: primaryColor }}
                  />
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{label}</p>
                  <p className="text-slate-600 text-xs">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <a href="/login">
              <Button
                className="w-full gap-2 text-white font-semibold py-3"
                style={{
                  background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                }}
                data-ocid="onboarding.access_dashboard.primary_button"
              >
                <Lightbulb size={16} />
                Access My Dashboard
              </Button>
            </a>
            <p className="text-slate-600 text-xs">
              A member of the {agencyName} team will reach out within 1 business
              day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
