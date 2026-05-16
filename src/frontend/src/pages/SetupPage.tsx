import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBrandKit } from "../hooks/useBrandKit";
import type { BrandKitNiche } from "../types/brandKit";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SetupForm {
  firstName: string;
  businessName: string;
  niche: BrandKitNiche | "";
  city: string;
  phone: string;
}

interface FormErrors {
  firstName?: string;
  businessName?: string;
  niche?: string;
  city?: string;
  phone?: string;
}

const NICHE_OPTIONS: Array<{ value: BrandKitNiche; label: string }> = [
  { value: "plumber", label: "Plumbing" },
  { value: "med-spa", label: "Med Spa" },
  { value: "hvac", label: "HVAC" },
  { value: "roofing", label: "Roofing" },
  { value: "carpet-cleaning", label: "Carpet Cleaning" },
  { value: "restoration", label: "Restoration" },
  { value: "real-estate", label: "Real Estate" },
  { value: "mortgage", label: "Mortgage" },
  { value: "chiropractor", label: "Chiropractic" },
  { value: "dental", label: "Dental" },
];

const GEN_STEPS = [
  "Scanning your niche market...",
  "Building your personalized website...",
  "Configuring your AI receptionist...",
  "Loading your CRM with local leads...",
  "Generating your brand kit...",
];

function getPrefilledNiche(): BrandKitNiche | "" {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("niche") ?? "";
    const valid = NICHE_OPTIONS.map((o) => o.value) as string[];
    return valid.includes(raw) ? (raw as BrandKitNiche) : "";
  } catch {
    return "";
  }
}

// ── Generation Animation ───────────────────────────────────────────────────────

function GenerationAnimation({ onDone }: { onDone: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stepDuration = 2000;
    const totalSteps = GEN_STEPS.length;

    timerRef.current = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= totalSteps) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeout(onDone, 600);
          return prev;
        }
        return next;
      });
    }, stepDuration);

    const progressInterval = setInterval(
      () => {
        setProgress((p) => {
          const newP = p + 1;
          if (newP >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newP;
        });
      },
      (stepDuration * totalSteps) / 100,
    );

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearInterval(progressInterval);
    };
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 px-6 text-center">
      {/* Pulsing logo orb */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-purple-900/50">
          <Sparkles size={32} className="text-white animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        Building your free demo...
      </h2>
      <p className="text-slate-400 text-sm mb-8">
        This takes about 10 seconds.
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-sm mb-8">
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-violet-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs text-slate-500 mt-1">{progress}%</p>
      </div>

      {/* Step list */}
      <div className="space-y-3 w-full max-w-sm text-left">
        {GEN_STEPS.map((step, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-slate-600"
                }`}
              >
                {done ? (
                  "✓"
                ) : active ? (
                  <span className="animate-pulse">•</span>
                ) : (
                  "○"
                )}
              </div>
              <p
                className={`text-sm transition-colors ${
                  done
                    ? "text-slate-500 line-through"
                    : active
                      ? "text-white font-medium"
                      : "text-slate-600"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SetupPage() {
  const navigate = useNavigate();
  const { createProspect, triggerOutreachSequence } = useBrandKit();

  const [form, setForm] = useState<SetupForm>({
    firstName: "",
    businessName: "",
    niche: getPrefilledNiche(),
    city: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchBiz, setSearchBiz] = useState("");

  const set = (key: keyof SetupForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.businessName.trim()) errs.businessName = "Required";
    if (!form.niche) errs.niche = "Required";
    if (!form.city.trim()) errs.city = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsGenerating(true);
  };

  const handleGenerationDone = () => {
    const prospect = createProspect({
      firstName: form.firstName,
      businessName: form.businessName,
      niche: form.niche as BrandKitNiche,
      city: form.city,
      phone: form.phone,
      website: "",
    });
    triggerOutreachSequence(prospect.kitPageSlug);
    void navigate({ to: `/brand-kit/${prospect.kitPageSlug}` });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchBiz.trim()) return;
    const slug = searchBiz
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    void navigate({ to: `/brand-kit/${slug}` });
  };

  if (isGenerating) {
    return <GenerationAnimation onDone={handleGenerationDone} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.15em] text-white group-hover:text-purple-300 transition-colors">
            Booked Ranked Fundable
          </span>
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Headline */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-purple-900/30 border border-purple-500/30 rounded-full px-3 py-1 text-xs text-purple-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Free · No credit card · 7-day trial
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
              Set up your personalized demo
              <br />
              <span className="text-purple-400">in 60 seconds.</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Enter your info — we'll build your AI receptionist, website, CRM,
              and brand kit live.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-ocid="setup.form"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="setup-firstname"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Your First Name
                </label>
                <input
                  id="setup-firstname"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="Your first name"
                  data-ocid="setup.firstname_input"
                  className={`w-full bg-gray-900 border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all ${errors.firstName ? "border-red-500/60" : "border-white/10"}`}
                />
                {errors.firstName && (
                  <p
                    className="text-xs text-red-400 mt-1"
                    data-ocid="setup.firstname_input.field_error"
                  >
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="setup-city"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  City
                </label>
                <input
                  id="setup-city"
                  type="text"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Your city"
                  data-ocid="setup.city_input"
                  className={`w-full bg-gray-900 border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all ${errors.city ? "border-red-500/60" : "border-white/10"}`}
                />
                {errors.city && (
                  <p
                    className="text-xs text-red-400 mt-1"
                    data-ocid="setup.city_input.field_error"
                  >
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="setup-biz"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Business Name
              </label>
              <input
                id="setup-biz"
                type="text"
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                placeholder="Your business name"
                data-ocid="setup.business_name_input"
                className={`w-full bg-gray-900 border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all ${errors.businessName ? "border-red-500/60" : "border-white/10"}`}
              />
              {errors.businessName && (
                <p
                  className="text-xs text-red-400 mt-1"
                  data-ocid="setup.business_name_input.field_error"
                >
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="setup-niche"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Your Niche / Industry
              </label>
              <select
                id="setup-niche"
                value={form.niche}
                onChange={(e) => set("niche", e.target.value)}
                data-ocid="setup.niche_select"
                className={`w-full bg-gray-900 border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer ${errors.niche ? "border-red-500/60" : "border-white/10"} ${!form.niche ? "text-slate-600" : ""}`}
              >
                <option value="" disabled>
                  Select your industry
                </option>
                {NICHE_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-gray-900 text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.niche && (
                <p
                  className="text-xs text-red-400 mt-1"
                  data-ocid="setup.niche_select.field_error"
                >
                  {errors.niche}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="setup-phone"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Phone Number
              </label>
              <input
                id="setup-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="Your phone number"
                data-ocid="setup.phone_input"
                className={`w-full bg-gray-900 border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all ${errors.phone ? "border-red-500/60" : "border-white/10"}`}
              />
              {errors.phone && (
                <p
                  className="text-xs text-red-400 mt-1"
                  data-ocid="setup.phone_input.field_error"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            <button
              type="submit"
              data-ocid="setup.submit_button"
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold rounded-lg py-3.5 text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/30 active:scale-[0.99]"
            >
              Build My Free Demo
              <ArrowRight size={16} />
            </button>

            <p className="text-center text-xs text-slate-600">
              By continuing you agree to our terms. No credit card required.
            </p>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-950 px-3 text-xs text-slate-600">
                Already have a demo?
              </span>
            </div>
          </div>

          {/* Find existing demo */}
          <form
            onSubmit={handleSearch}
            className="flex gap-2"
            data-ocid="setup.find_demo_form"
          >
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchBiz}
                onChange={(e) => setSearchBiz(e.target.value)}
                placeholder="Enter your business name to find it"
                data-ocid="setup.find_demo_input"
                className="w-full bg-gray-900 border border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
              />
            </div>
            <button
              type="submit"
              data-ocid="setup.find_demo_button"
              className="bg-gray-800 hover:bg-gray-700 border border-white/10 text-white text-sm px-4 rounded-lg transition-colors"
            >
              Find
            </button>
          </form>
        </div>
      </main>

      {/* Social proof footer */}
      <footer className="border-t border-white/5 py-6 px-6">
        <div className="max-w-md mx-auto flex items-center justify-center gap-6 text-xs text-slate-600">
          <span>✓ AI receptionist built-in</span>
          <span>✓ 7-day free trial</span>
          <span>✓ No setup fees</span>
        </div>
      </footer>
    </div>
  );
}
