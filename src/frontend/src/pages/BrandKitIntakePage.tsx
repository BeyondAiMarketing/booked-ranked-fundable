import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useBrandKit } from "../hooks/useBrandKit";
import type { BrandKitIntakeForm, BrandKitNiche } from "../types/brandKit";
import { NICHE_LABELS } from "../types/brandKit";

// ── Constants ─────────────────────────────────────────────────────────────────

const VALID_NICHES: BrandKitNiche[] = [
  "plumber",
  "med-spa",
  "hvac",
  "restoration",
  "carpet-cleaning",
  "roofing",
  "real-estate",
  "mortgage",
  "chiropractor",
  "dental",
];

function getPrefilledNiche(): BrandKitNiche | "" {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("niche") ?? "";
  return (VALID_NICHES as string[]).includes(raw) ? (raw as BrandKitNiche) : "";
}

const NICHE_ICONS: Record<BrandKitNiche, string> = {
  plumber: "🔧",
  "med-spa": "✨",
  hvac: "❄️",
  restoration: "💧",
  "carpet-cleaning": "🧹",
  roofing: "🏠",
  "real-estate": "🏡",
  mortgage: "🏦",
  chiropractor: "⚕️",
  dental: "🦷",
};

const PREVIEW_CARDS = [
  { icon: "📱", label: "App + Website" },
  { icon: "🤖", label: "AI Voice Agent" },
  { icon: "📊", label: "Free Audit" },
  { icon: "📅", label: "Social Calendar" },
  { icon: "🏆", label: "Business Scorecard" },
];

const ACTIVITY_FEED: Array<{
  niche: BrandKitNiche;
  city: string;
  mins: number;
}> = [
  { niche: "roofing", city: "Denver", mins: 4 },
  { niche: "plumber", city: "Dallas", mins: 7 },
  { niche: "med-spa", city: "Miami", mins: 11 },
  { niche: "hvac", city: "Phoenix", mins: 14 },
  { niche: "carpet-cleaning", city: "Atlanta", mins: 19 },
  { niche: "dental", city: "Chicago", mins: 23 },
  { niche: "real-estate", city: "Austin", mins: 31 },
  { niche: "restoration", city: "Houston", mins: 38 },
  { niche: "mortgage", city: "Las Vegas", mins: 43 },
  { niche: "chiropractor", city: "Seattle", mins: 52 },
  { niche: "roofing", city: "Nashville", mins: 58 },
  { niche: "plumber", city: "San Diego", mins: 63 },
];

interface GenStep {
  icon: string;
  label: string;
  subLabel: (name: string, city: string) => string;
  startSec: number;
}

const GEN_STEPS: GenStep[] = [
  {
    icon: "🔍",
    label: "Analyzing your niche and market...",
    subLabel: (_, city) =>
      `Scanning local competition in ${city || "your city"}`,
    startSec: 0,
  },
  {
    icon: "🌐",
    label: "Building your custom website...",
    subLabel: (name) =>
      `Populating niche content for ${name || "your business"}`,
    startSec: 18,
  },
  {
    icon: "📞",
    label: "Configuring your AI Voice Agent...",
    subLabel: (name) =>
      `Recording greeting: "Hello, you've reached ${name || "your business"}..."`,
    startSec: 36,
  },
  {
    icon: "📅",
    label: "Generating your social media calendar...",
    subLabel: (_, city) => `Pulling niche content for ${city || "your market"}`,
    startSec: 54,
  },
  {
    icon: "📈",
    label: "Creating your business scorecard...",
    subLabel: () => "Finalizing audit scores and recommendations",
    startSec: 72,
  },
];

// ── Validation ────────────────────────────────────────────────────────────────

function validateField(name: keyof BrandKitIntakeForm, value: string): string {
  switch (name) {
    case "businessName":
      return value.trim().length < 2 ? "Enter your business name" : "";
    case "niche":
      return !value ? "Select your industry" : "";
    case "city":
      return value.trim().length < 2 ? "Enter your city" : "";
    case "phone":
      return value.replace(/\D/g, "").length < 10
        ? "Enter a valid phone number"
        : "";
    default:
      return "";
  }
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StyledInput({
  hasError,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:opacity-40"
      style={{
        background: "oklch(0.13 0.015 282)",
        border: `1px solid ${hasError ? "oklch(0.62 0.22 25)" : focused ? "oklch(0.58 0.22 290 / 80%)" : "oklch(1 0 0 / 12%)"}`,
        color: "oklch(0.93 0.008 280)",
        boxShadow: focused
          ? hasError
            ? "0 0 0 3px oklch(0.62 0.22 25 / 18%)"
            : "0 0 0 3px oklch(0.58 0.22 290 / 18%)"
          : "none",
      }}
    />
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p
      className="text-xs mt-1 animate-fade-in"
      style={{ color: "oklch(0.68 0.2 25)" }}
      role="alert"
      data-ocid="brand-kit-intake.field_error"
    >
      {msg}
    </p>
  );
}

// ── Generation Overlay ────────────────────────────────────────────────────────

function GenerationOverlay({
  businessName,
  city,
  progressPct,
  activeStepIdx,
}: {
  businessName: string;
  city: string;
  progressPct: number;
  activeStepIdx: number;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.28 0.12 290 / 45%) 0%, transparent 65%), oklch(0.055 0.01 282)",
      }}
      data-ocid="brand-kit-intake.generation_overlay"
    >
      {/* Brand mark */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 text-2xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.6 0.22 290), oklch(0.5 0.2 268))",
          boxShadow: "0 0 40px oklch(0.58 0.22 290 / 50%)",
        }}
      >
        ✨
      </div>

      <p
        className="text-sm font-semibold mb-1"
        style={{ color: "oklch(0.68 0.16 290)" }}
      >
        Building{" "}
        <span style={{ color: "oklch(0.92 0.008 280)" }}>
          {businessName || "Your Business"}
        </span>
        's personalized app...
      </p>
      <p className="text-xs mb-8" style={{ color: "oklch(0.46 0.01 280)" }}>
        This takes about 60 seconds — hang tight
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "oklch(1 0 0 / 8%)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              background:
                "linear-gradient(90deg, oklch(0.6 0.22 290), oklch(0.72 0.18 260))",
              boxShadow: "0 0 12px oklch(0.6 0.22 290 / 60%)",
            }}
          />
        </div>
        <div
          className="flex justify-between mt-2 text-xs"
          style={{ color: "oklch(0.46 0.01 280)" }}
        >
          <span>Setting up your app</span>
          <span className="font-bold" style={{ color: "oklch(0.78 0.16 290)" }}>
            {progressPct}%
          </span>
        </div>
      </div>

      {/* Steps */}
      <div
        className="w-full max-w-md space-y-2"
        data-ocid="brand-kit-intake.loading_state"
      >
        {GEN_STEPS.map((step, i) => {
          const done = i < activeStepIdx;
          const active = i === activeStepIdx;
          return (
            <div
              key={step.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
              style={{
                background: active
                  ? "oklch(0.58 0.22 290 / 12%)"
                  : done
                    ? "oklch(0.62 0.18 155 / 8%)"
                    : "transparent",
                border: active
                  ? "1px solid oklch(0.58 0.22 290 / 30%)"
                  : "1px solid transparent",
                opacity: i > activeStepIdx ? 0.3 : 1,
              }}
            >
              {/* Icon / status */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                style={{
                  background: done
                    ? "oklch(0.62 0.18 155 / 20%)"
                    : active
                      ? "oklch(0.58 0.22 290 / 20%)"
                      : "oklch(1 0 0 / 5%)",
                }}
              >
                {done ? (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="oklch(0.72 0.18 155)"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : active ? (
                  <span className="animate-pulse">{step.icon}</span>
                ) : (
                  <span style={{ opacity: 0.4 }}>{step.icon}</span>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium"
                  style={{
                    color: done
                      ? "oklch(0.72 0.18 155)"
                      : active
                        ? "oklch(0.94 0.008 280)"
                        : "oklch(0.46 0.01 280)",
                  }}
                >
                  {step.label}
                </p>
                {active && (
                  <p
                    className="text-xs mt-0.5 animate-fade-in truncate"
                    style={{ color: "oklch(0.58 0.01 280)" }}
                  >
                    {step.subLabel(businessName, city)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Activity Ticker ───────────────────────────────────────────────────────────

function ActivityTicker() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % ACTIVITY_FEED.length),
      9000,
    );
    return () => clearInterval(t);
  }, []);

  const item = ACTIVITY_FEED[idx];
  return (
    <div
      className="flex items-center justify-center gap-2 py-2"
      aria-live="polite"
      aria-atomic="true"
      data-ocid="brand-kit-intake.activity_ticker"
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
        style={{ background: "oklch(0.72 0.18 155)" }}
      />
      <span className="text-xs" style={{ color: "oklch(0.6 0.012 280)" }}>
        <span style={{ color: "oklch(0.72 0.18 155)" }}>
          A {NICHE_LABELS[item.niche]} business in {item.city}
        </span>{" "}
        just activated their trial{" "}
        <span style={{ color: "oklch(0.52 0.01 280)" }}>
          {item.mins} min ago
        </span>
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function BrandKitIntakePage() {
  const navigate = useNavigate();
  const { createProspect, triggerOutreachSequence } = useBrandKit();

  const [form, setForm] = useState<BrandKitIntakeForm>(() => ({
    firstName: "",
    businessName: "",
    niche: getPrefilledNiche(),
    city: "",
    phone: "",
    website: "",
  }));
  const [errors, setErrors] = useState<
    Partial<Record<keyof BrandKitIntakeForm, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof BrandKitIntakeForm, boolean>>
  >({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
    },
    [],
  );

  const selectedNicheLabel = form.niche ? NICHE_LABELS[form.niche] : "";
  const headingNiche = selectedNicheLabel || "Business";

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    const processed = name === "phone" ? formatPhone(value) : value;
    setForm((prev) => ({ ...prev, [name]: processed }));
    if (touched[name as keyof BrandKitIntakeForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof BrandKitIntakeForm, processed),
      }));
    }
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof BrandKitIntakeForm, value),
    }));
  }

  function selectNiche(niche: BrandKitNiche) {
    setForm((prev) => ({ ...prev, niche }));
    if (touched.niche) {
      setErrors((prev) => ({ ...prev, niche: "" }));
    }
  }

  function validateAll(): boolean {
    const fields: (keyof BrandKitIntakeForm)[] = [
      "businessName",
      "niche",
      "city",
      "phone",
    ];
    const newErrors: Partial<Record<keyof BrandKitIntakeForm, string>> = {};
    const newTouched: Partial<Record<keyof BrandKitIntakeForm, boolean>> = {};
    let valid = true;
    for (const field of fields) {
      const err = validateField(field, form[field]);
      newErrors[field] = err;
      newTouched[field] = true;
      if (err) valid = false;
    }
    setErrors(newErrors);
    setTouched(newTouched);
    return valid;
  }

  function startGeneration(slug: string) {
    setIsGenerating(true);
    setProgressPct(0);
    setActiveStepIdx(0);

    // Animate progress 0→100 over 90s (update every 200ms)
    let elapsed = 0;
    const TOTAL_MS = 90_000;
    const INTERVAL_MS = 200;
    const ticker = setInterval(() => {
      elapsed += INTERVAL_MS;
      const pct = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setProgressPct(pct);
      // advance step
      const stepIdx = GEN_STEPS.findIndex(
        (s, i) =>
          elapsed / 1000 >= s.startSec &&
          (GEN_STEPS[i + 1] === undefined ||
            elapsed / 1000 < GEN_STEPS[i + 1].startSec),
      );
      if (stepIdx >= 0) setActiveStepIdx(stepIdx);
      if (elapsed >= TOTAL_MS) {
        clearInterval(ticker);
        void navigate({ to: "/brand-kit/$slug", params: { slug } });
      }
    }, INTERVAL_MS);

    timersRef.current.push(ticker as unknown as ReturnType<typeof setTimeout>);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAll()) return;
    const prospect = createProspect(form);
    triggerOutreachSequence(prospect.kitPageSlug);
    startGeneration(prospect.kitPageSlug);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (isGenerating) {
    return (
      <GenerationOverlay
        businessName={form.businessName}
        city={form.city}
        progressPct={progressPct}
        activeStepIdx={activeStepIdx}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse 100% 55% at 50% -5%, oklch(0.3 0.12 290 / 40%) 0%, transparent 60%), oklch(0.065 0.01 282)",
      }}
      data-ocid="brand-kit-intake.page"
    >
      {/* ── Nav ── */}
      <header
        className="flex items-center justify-between px-5 py-4 md:px-10 flex-shrink-0"
        style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)" }}
      >
        <a href="/" className="flex items-center gap-2.5" aria-label="BRF Home">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.6 0.22 290), oklch(0.5 0.2 268))",
            }}
          >
            B
          </div>
          <span
            className="font-bold text-sm"
            style={{ color: "oklch(0.94 0.008 280)" }}
          >
            BRF
          </span>
        </a>
        <a
          href="/login"
          className="text-xs transition-colors duration-150"
          style={{ color: "oklch(0.55 0.012 280)" }}
          data-ocid="brand-kit-intake.login-link"
        >
          Already have an account?{" "}
          <span
            className="font-semibold"
            style={{ color: "oklch(0.72 0.18 290)" }}
          >
            Log In
          </span>
        </a>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col items-center px-4 py-10 md:py-14">
        {/* Hero heading — updates live */}
        <div className="text-center mb-8 max-w-2xl">
          <h1
            className="text-3xl md:text-4xl lg:text-[2.6rem] font-black leading-[1.1] tracking-tight mb-3"
            style={{ color: "oklch(0.96 0.008 280)" }}
          >
            Get Your Own{" "}
            <span
              className="transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.2 290), oklch(0.62 0.18 260))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {headingNiche}
            </span>{" "}
            Business App
          </h1>
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "oklch(0.66 0.012 280)" }}
          >
            Built specifically for your business in 60 seconds —{" "}
            <span style={{ color: "oklch(0.82 0.01 280)" }}>
              use your existing website or the one we already built for you
            </span>
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {[
              { icon: "🔒", text: "No credit card required" },
              { icon: "✅", text: "Cancel anytime" },
              { icon: "🛠️", text: "We set it up for you" },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "oklch(0.58 0.22 290 / 10%)",
                  border: "1px solid oklch(0.58 0.22 290 / 25%)",
                  color: "oklch(0.78 0.14 290)",
                }}
              >
                <span>{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Card ── */}
        <div
          className="w-full max-w-3xl rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.105 0.013 282 / 94%)",
            backdropFilter: "blur(20px)",
            border: "1px solid oklch(1 0 0 / 10%)",
            boxShadow:
              "0 0 0 1px oklch(0.58 0.22 290 / 8%), 0 24px 64px oklch(0 0 0 / 55%)",
          }}
          data-ocid="brand-kit-intake.form-card"
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col lg:flex-row">
              {/* LEFT: Niche grid */}
              <div
                className="lg:w-64 xl:w-72 flex-shrink-0 p-5 lg:p-6"
                style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "oklch(0.55 0.012 280)" }}
                >
                  Select your industry
                </p>

                {/* Desktop grid */}
                <div
                  className="hidden lg:grid grid-cols-2 gap-2"
                  data-ocid="brand-kit-intake.niche-grid"
                >
                  {VALID_NICHES.map((niche) => {
                    const isActive = form.niche === niche;
                    return (
                      <label
                        key={niche}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
                        style={{
                          background: isActive
                            ? "oklch(0.58 0.22 290 / 18%)"
                            : "oklch(1 0 0 / 4%)",
                          border: `1px solid ${isActive ? "oklch(0.58 0.22 290 / 55%)" : "oklch(1 0 0 / 8%)"}`,
                          boxShadow: isActive
                            ? "0 0 12px oklch(0.58 0.22 290 / 20%)"
                            : "none",
                        }}
                        data-ocid={`brand-kit-intake.niche-${niche}.toggle`}
                      >
                        <input
                          type="radio"
                          name="niche-grid"
                          value={niche}
                          checked={isActive}
                          onChange={() => selectNiche(niche)}
                          className="sr-only"
                          aria-label={NICHE_LABELS[niche]}
                        />
                        <span className="text-base leading-none flex-shrink-0">
                          {NICHE_ICONS[niche]}
                        </span>
                        <span
                          className="text-xs font-medium leading-tight"
                          style={{
                            color: isActive
                              ? "oklch(0.88 0.01 280)"
                              : "oklch(0.62 0.01 280)",
                          }}
                        >
                          {NICHE_LABELS[niche]}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Mobile dropdown */}
                <div className="lg:hidden relative">
                  <select
                    name="niche"
                    value={form.niche}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-label="Select your industry"
                    data-ocid="brand-kit-intake.niche.select"
                    className="w-full appearance-none px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200"
                    style={{
                      background: "oklch(0.13 0.015 282)",
                      border: `1px solid ${!!touched.niche && errors.niche ? "oklch(0.6 0.22 25)" : "oklch(1 0 0 / 12%)"}`,
                      color: form.niche
                        ? "oklch(0.92 0.008 280)"
                        : "oklch(0.46 0.01 280)",
                    }}
                  >
                    <option
                      value=""
                      disabled
                      style={{ color: "oklch(0.46 0.01 280)" }}
                    >
                      Select your industry
                    </option>
                    {VALID_NICHES.map((niche) => (
                      <option
                        key={niche}
                        value={niche}
                        style={{
                          background: "oklch(0.155 0.015 280)",
                          color: "oklch(0.92 0.008 280)",
                        }}
                      >
                        {NICHE_ICONS[niche]} {NICHE_LABELS[niche]}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: "oklch(0.5 0.01 280)" }}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Niche error */}
                {touched.niche && errors.niche && (
                  <FieldError msg={errors.niche} />
                )}
              </div>

              {/* RIGHT: Fields */}
              <div
                className="flex-1 p-5 lg:p-6 lg:border-l"
                style={{ borderColor: "oklch(1 0 0 / 8%)" }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: "oklch(0.55 0.012 280)" }}
                >
                  Your details
                </p>

                <div className="space-y-4">
                  {/* Business Name */}
                  <div>
                    <label
                      htmlFor="intake-businessName"
                      className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
                      style={{ color: "oklch(0.62 0.012 280)" }}
                    >
                      Business Name
                    </label>
                    <StyledInput
                      id="intake-businessName"
                      name="businessName"
                      placeholder="e.g. Marcus Plumbing Co"
                      value={form.businessName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="organization"
                      hasError={!!touched.businessName && !!errors.businessName}
                      data-ocid="brand-kit-intake.business-name.input"
                    />
                    {touched.businessName && (
                      <FieldError msg={errors.businessName} />
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label
                      htmlFor="intake-city"
                      className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
                      style={{ color: "oklch(0.62 0.012 280)" }}
                    >
                      City
                    </label>
                    <StyledInput
                      id="intake-city"
                      name="city"
                      placeholder="e.g. Dallas, TX"
                      value={form.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="address-level2"
                      hasError={!!touched.city && !!errors.city}
                      data-ocid="brand-kit-intake.city.input"
                    />
                    {touched.city && <FieldError msg={errors.city} />}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="intake-phone"
                      className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
                      style={{ color: "oklch(0.62 0.012 280)" }}
                    >
                      Phone Number
                    </label>
                    <StyledInput
                      id="intake-phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 555-5555"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="tel"
                      inputMode="tel"
                      hasError={!!touched.phone && !!errors.phone}
                      data-ocid="brand-kit-intake.phone.input"
                    />
                    {touched.phone && <FieldError msg={errors.phone} />}
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    data-ocid="brand-kit-intake.submit_button"
                    className="relative w-full py-4 px-6 rounded-xl font-bold text-base overflow-hidden group transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 mt-2"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.6 0.22 290) 0%, oklch(0.52 0.2 268) 100%)",
                      color: "oklch(0.98 0.005 280)",
                      boxShadow:
                        "0 4px 24px oklch(0.58 0.22 290 / 42%), 0 1px 0 oklch(0.72 0.18 290 / 30%) inset",
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Build My Free {selectedNicheLabel || "Business"} App
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    </span>
                    {/* Shimmer */}
                    <span
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, oklch(1 0 0 / 14%), transparent)",
                      }}
                      aria-hidden="true"
                    />
                  </button>

                  <p
                    className="text-xs text-center"
                    style={{ color: "oklch(0.44 0.01 280)" }}
                  >
                    🔒 7-day trial starts only when you actually use it — not
                    when you sign up
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ── Preview cards ── */}
        <div className="w-full max-w-3xl mt-6">
          <p
            className="text-xs text-center font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.46 0.01 280)" }}
          >
            Everything included — free
          </p>
          <div className="grid grid-cols-5 gap-2">
            {PREVIEW_CARDS.map((card) => (
              <div
                key={card.label}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-center"
                style={{
                  background: "oklch(0.105 0.013 282 / 90%)",
                  border: "1px solid oklch(1 0 0 / 8%)",
                }}
              >
                <span className="text-xl">{card.icon}</span>
                <span
                  className="text-[10px] font-semibold leading-tight"
                  style={{ color: "oklch(0.62 0.01 280)" }}
                >
                  {card.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Activity ticker ── */}
        <div className="w-full max-w-3xl mt-3">
          <div
            className="rounded-xl"
            style={{
              background: "oklch(0.105 0.013 282 / 80%)",
              border: "1px solid oklch(1 0 0 / 7%)",
            }}
          >
            <ActivityTicker />
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="px-6 py-4 text-center flex-shrink-0"
        style={{ borderTop: "1px solid oklch(1 0 0 / 6%)" }}
      >
        <p className="text-xs" style={{ color: "oklch(0.4 0.01 280)" }}>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:opacity-80"
            style={{ color: "oklch(0.58 0.22 290)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
