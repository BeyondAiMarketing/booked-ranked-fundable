/**
 * DemoStep0Intake — FULL REWRITE
 *
 * Full-screen intake form — Act 0.
 * - Dark gradient bg (slate-950 → purple-950 → slate-950)
 * - BRF logo/wordmark at top
 * - Business Name + Your Name (required)
 * - 10 niche visual cards (icon + label)
 * - No email field — captured at trial CTA
 * - "Start My Demo" CTA — disabled until name + niche filled
 * - On submit: createSession + startDemo, advances to step 1
 * - 3 trust badges below
 * - Audio preload fires on submit (step 1 mount also preloads per spec,
 *   but we also kick it off here for extra lead time)
 */

import { useCredentials } from "@/context/CredentialsContext";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import {
  NICHE_VOICE_SCRIPTS,
  buildScriptLines,
  preloadAllAudio,
  preloadNicheScripts,
  unlockAudioContext,
} from "@/services/audioService";
import type { DemoNicheId } from "@/types/demo";
import { useSearch } from "@tanstack/react-router";
import { ChevronRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

// ─── Niche options ────────────────────────────────────────────────────────────

const NICHE_OPTIONS: {
  value: DemoNicheId;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    value: "plumber",
    label: "Plumbing",
    icon: "🔧",
    color: "oklch(0.55 0.16 240)",
  },
  {
    value: "med-spa",
    label: "Med Spa",
    icon: "✨",
    color: "oklch(0.62 0.2 340)",
  },
  { value: "hvac", label: "HVAC", icon: "❄️", color: "oklch(0.58 0.18 210)" },
  {
    value: "restoration",
    label: "Restoration",
    icon: "💧",
    color: "oklch(0.55 0.18 220)",
  },
  {
    value: "carpet-cleaning",
    label: "Carpet Cleaning",
    icon: "🧹",
    color: "oklch(0.6 0.16 80)",
  },
  {
    value: "roofing",
    label: "Roofing",
    icon: "🏠",
    color: "oklch(0.58 0.14 60)",
  },
  {
    value: "real-estate",
    label: "Real Estate",
    icon: "🏡",
    color: "oklch(0.6 0.18 150)",
  },
  {
    value: "mortgage",
    label: "Mortgage",
    icon: "🏦",
    color: "oklch(0.58 0.2 290)",
  },
  {
    value: "chiropractor",
    label: "Chiropractic",
    icon: "⚕️",
    color: "oklch(0.6 0.18 180)",
  },
  { value: "dental", label: "Dental", icon: "🦷", color: "oklch(0.62 0.2 15)" },
];

// ─── Trust badges ─────────────────────────────────────────────────────────────

const TRUST_BADGES = [
  { icon: "🏆", label: "10,000+ Local Businesses" },
  { icon: "🤖", label: "AI-Powered Platform" },
  { icon: "🔒", label: "No Credit Card Required" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const SESSION_KEY = "brf_demo_session";

function readSession(): {
  businessName?: string;
  yourName?: string;
  niche?: DemoNicheId;
  city?: string;
} {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {};
}

export default function DemoStep0Intake() {
  const { startDemo, createSession } = useDemoFlow();
  const { creds } = useCredentials();
  const search = useSearch({ from: "/demo" }) as { niche?: string };

  // Pre-fill from session or URL param
  const saved = readSession();
  const urlNiche = search.niche as DemoNicheId | undefined;

  const [businessName, setBusinessName] = useState(saved.businessName ?? "");
  const [yourName, setYourName] = useState(saved.yourName ?? "");
  const [niche, setNiche] = useState<DemoNicheId | "">(
    saved.niche ?? urlNiche ?? "",
  );
  const [city, setCity] = useState(saved.city ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    businessName?: string;
    city?: string;
    niche?: string;
  }>({});

  // If session already has all required data, skip intake and go directly to step 1
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect
  useEffect(() => {
    if (
      saved.businessName &&
      saved.niche &&
      saved.city &&
      // Only skip if URL niche param is absent OR matches saved session niche
      (!search.niche || search.niche === saved.niche)
    ) {
      // Restore session into demo flow context and advance
      unlockAudioContext();
      void preloadNicheScripts(
        saved.niche,
        saved.businessName,
        creds?.elevenLabsKey ?? "",
        creds?.openaiKey ?? "",
      );
      void createSession(saved.businessName, saved.niche);
      startDemo({
        businessName: saved.businessName,
        niche: saved.niche,
        city: saved.city ?? "",
        phone: "",
        firstName: saved.yourName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSubmit =
    businessName.trim().length > 0 &&
    yourName.trim().length > 0 &&
    city.trim().length > 0 &&
    niche !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { businessName?: string; city?: string; niche?: string } =
      {};
    if (!businessName.trim())
      newErrors.businessName = "Business name is required";
    if (!city.trim())
      newErrors.city = "City is required — we personalize your demo with it";
    if (!niche) newErrors.niche = "Please select your industry";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    const biz = businessName.trim();
    const selectedNiche = niche as DemoNicheId;
    const selectedCity = city.trim();

    // CRITICAL: unlockAudioContext() SYNCHRONOUSLY on user gesture
    unlockAudioContext();

    // Persist to sessionStorage so refresh doesn't lose intake
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          businessName: biz,
          yourName: yourName.trim(),
          niche: selectedNiche,
          city: selectedCity,
        }),
      );
    } catch {
      /* ignore */
    }

    // Fire-and-forget audio preload
    void preloadNicheScripts(
      selectedNiche,
      biz,
      creds?.elevenLabsKey ?? "",
      creds?.openaiKey ?? "",
    );

    // Legacy blob preload (secondary fallback path)
    const nicheScript =
      NICHE_VOICE_SCRIPTS[selectedNiche] ?? NICHE_VOICE_SCRIPTS.plumber;
    const lines = buildScriptLines(nicheScript, biz);
    void preloadAllAudio(lines, nicheScript.voiceId, {
      elevenLabsKey: creds?.elevenLabsKey ?? "",
      openaiKey: creds?.openaiKey ?? "",
    });

    // Create session + start demo
    void createSession(biz, selectedNiche);

    setTimeout(() => {
      setSubmitting(false);
      startDemo({
        businessName: biz,
        niche: selectedNiche,
        city: selectedCity,
        phone: "",
        firstName: yourName.trim(),
      });
    }, 600);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start px-4 py-8 relative overflow-y-auto"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.06 0.012 280) 0%, oklch(0.09 0.018 292) 45%, oklch(0.06 0.01 268) 100%)",
      }}
      data-ocid="demo.intake.section"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 45% at 50% -5%, oklch(0.42 0.18 290 / 22%) 0%, transparent 65%)",
        }}
      />

      {/* BRF Logo / Wordmark */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center gap-3 mb-8 mt-2"
        data-ocid="demo.intake.logo"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.50 0.24 300))",
            boxShadow: "0 0 20px oklch(0.58 0.22 290 / 40%)",
          }}
        >
          BRF
        </div>
        <span
          className="text-sm font-bold tracking-wide"
          style={{ color: "oklch(0.72 0.1 290)" }}
        >
          BOOKED · RANKED · FUNDABLE
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="relative z-10 text-center mb-8 max-w-lg"
      >
        <h1
          className="font-black leading-tight mb-3"
          style={{ fontSize: "clamp(1.75rem, 5vw, 2.8rem)" }}
        >
          <span className="text-white">See What AI Does</span>
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 290) 0%, oklch(0.72 0.18 175) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            For Your Business
          </span>
        </h1>
        <p
          className="text-sm sm:text-base leading-relaxed max-w-sm mx-auto"
          style={{ color: "oklch(0.62 0.02 280)" }}
        >
          Enter your business below — everything in this demo will be
          personalized for you
        </p>
      </motion.div>

      {/* Form card */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl p-6 sm:p-8 space-y-5"
        style={{
          background: "oklch(0.11 0.014 282)",
          border: "1px solid oklch(1 0 0 / 9%)",
          boxShadow: "0 24px 80px oklch(0 0 0 / 50%)",
        }}
        data-ocid="demo.intake.form"
        noValidate
      >
        {/* Business Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="demo-biz"
            className="block text-xs font-bold uppercase tracking-widest"
            style={{ color: "oklch(0.62 0.02 280)" }}
          >
            Business Name{" "}
            <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
          </label>
          <input
            id="demo-biz"
            data-ocid="demo.intake.business_name.input"
            type="text"
            required
            autoComplete="organization"
            placeholder="e.g. Metro Plumbing Pros"
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value);
              if (errors.businessName)
                setErrors((p) => ({ ...p, businessName: undefined }));
            }}
            className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all"
            style={{
              background: "oklch(1 0 0 / 5%)",
              border: errors.businessName
                ? "1px solid oklch(0.58 0.22 25 / 70%)"
                : "1px solid oklch(1 0 0 / 12%)",
            }}
          />
          {errors.businessName && (
            <p
              className="text-xs"
              style={{ color: "oklch(0.65 0.22 25)" }}
              data-ocid="demo.intake.business_name.field_error"
            >
              {errors.businessName}
            </p>
          )}
        </div>

        {/* Your Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="demo-name"
            className="block text-xs font-bold uppercase tracking-widest"
            style={{ color: "oklch(0.62 0.02 280)" }}
          >
            Your Name <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
          </label>
          <input
            id="demo-name"
            data-ocid="demo.intake.your_name.input"
            type="text"
            required
            autoComplete="given-name"
            placeholder="e.g. Mike"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all"
            style={{
              background: "oklch(1 0 0 / 5%)",
              border: "1px solid oklch(1 0 0 / 12%)",
            }}
          />
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label
            htmlFor="demo-city"
            className="block text-xs font-bold uppercase tracking-widest"
            style={{ color: "oklch(0.62 0.02 280)" }}
          >
            City / Market{" "}
            <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
          </label>
          <input
            id="demo-city"
            data-ocid="demo.intake.city.input"
            type="text"
            required
            autoComplete="address-level2"
            placeholder="e.g. Dallas, TX"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (errors.city) setErrors((p) => ({ ...p, city: undefined }));
            }}
            className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all"
            style={{
              background: "oklch(1 0 0 / 5%)",
              border: errors.city
                ? "1px solid oklch(0.58 0.22 25 / 70%)"
                : "1px solid oklch(1 0 0 / 12%)",
            }}
          />
          {errors.city && (
            <p
              className="text-xs"
              style={{ color: "oklch(0.65 0.22 25)" }}
              data-ocid="demo.intake.city.field_error"
            >
              {errors.city}
            </p>
          )}
        </div>

        {/* Niche selector */}
        <fieldset className="space-y-2">
          <legend
            className="block text-xs font-bold uppercase tracking-widest"
            style={{ color: "oklch(0.62 0.02 280)" }}
          >
            Your Industry{" "}
            <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
          </legend>
          <div
            className="grid grid-cols-2 gap-2"
            data-ocid="demo.intake.niche.select"
          >
            {NICHE_OPTIONS.map((opt) => {
              const selected = niche === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={selected}
                  data-ocid={`demo.intake.niche.${opt.value}`}
                  onClick={() => {
                    setNiche(opt.value);
                    if (errors.niche)
                      setErrors((p) => ({ ...p, niche: undefined }));
                  }}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold border transition-all text-left active:scale-95"
                  style={
                    selected
                      ? {
                          background: "oklch(0.58 0.22 290 / 18%)",
                          borderColor: "oklch(0.58 0.22 290 / 55%)",
                          color: "oklch(0.86 0.16 290)",
                          boxShadow: "0 0 12px oklch(0.58 0.22 290 / 15%)",
                        }
                      : {
                          background: "oklch(1 0 0 / 4%)",
                          borderColor: "oklch(1 0 0 / 9%)",
                          color: "oklch(0.62 0.02 280)",
                        }
                  }
                >
                  <span className="text-base leading-none shrink-0">
                    {opt.icon}
                  </span>
                  <span className="truncate leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>
          {errors.niche && (
            <p
              className="text-xs"
              style={{ color: "oklch(0.65 0.22 25)" }}
              data-ocid="demo.intake.niche.field_error"
            >
              {errors.niche}
            </p>
          )}
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          data-ocid="demo.intake.submit_button"
          disabled={submitting || !canSubmit}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98]"
          style={{
            background: canSubmit
              ? "linear-gradient(135deg, oklch(0.62 0.18 155), oklch(0.52 0.16 160))"
              : "oklch(1 0 0 / 10%)",
            boxShadow: canSubmit
              ? "0 8px 28px oklch(0.62 0.18 155 / 38%)"
              : "none",
            color: canSubmit ? "white" : "oklch(0.45 0.02 280)",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
          aria-disabled={!canSubmit}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Building your demo…
            </>
          ) : (
            <>
              Start My Demo
              <ChevronRight size={16} />
            </>
          )}
        </button>

        <p
          className="text-center text-xs"
          style={{ color: "oklch(0.42 0.02 280)" }}
        >
          Personalized in seconds · No credit card
        </p>
      </motion.form>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-6 flex flex-wrap justify-center gap-3"
        aria-label="Trust indicators"
      >
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
            style={{
              background: "oklch(0.14 0.014 280)",
              border: "1px solid oklch(1 0 0 / 8%)",
              color: "oklch(0.68 0.04 280)",
            }}
          >
            <span>{badge.icon}</span>
            {badge.label}
          </div>
        ))}
      </motion.div>

      {/* Live activity ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-5 flex flex-wrap justify-center gap-2"
      >
        {[
          "Plumbing · Dallas",
          "Med Spa · Miami",
          "HVAC · Phoenix",
          "Dental · Austin",
        ].map((t) => (
          <div
            key={t}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px]"
            style={{
              background: "oklch(0.12 0.012 280)",
              border: "1px solid oklch(1 0 0 / 6%)",
              color: "oklch(0.55 0.02 280)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "oklch(0.62 0.18 155)" }}
            />
            {t} just activated
          </div>
        ))}
      </motion.div>
    </div>
  );
}
