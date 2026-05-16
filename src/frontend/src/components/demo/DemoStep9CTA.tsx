/**
 * DemoStep9CTA — Act 3: 7-Day Trial Activation.
 *
 * Personalized confirmation screen using already-captured intake data.
 * Only collects email + phone (never re-asks for name / business / city / niche).
 * Uses real activateTrial() backend call with full prospect data.
 */

import { useDemoFlow } from "@/hooks/useDemoFlow";
import { CheckCircle, Loader2, Pencil, Shield, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Countdown hook — HH:MM:SS from 23:59:59 ──────────────────────────────────────────────

function useCountdown() {
  const INITIAL = 23 * 3600 + 59 * 60 + 59;
  const [seconds, setSeconds] = useState(INITIAL);

  useEffect(() => {
    const t = setInterval(() => setSeconds((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return {
    display: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
    expired: seconds === 0,
  };
}

// ─── Validation ────────────────────────────────────────────────────────────────────────────

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// Phone formatter: formats as ###-###-####
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ─── Benefit bullets ────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    Icon: Zap,
    text: "Full access to your AI Front Desk for 7 days",
    color: "oklch(0.78 0.2 290)",
  },
  {
    Icon: Star,
    text: "7 days of social media content, ready to post",
    color: "oklch(0.78 0.18 55)",
  },
  {
    Icon: Shield,
    text: "Your CRM pre-loaded with your business info",
    color: "oklch(0.72 0.18 155)",
  },
] as const;

// ─── Niche display formatter ────────────────────────────────────────────────────────────

const NICHE_DISPLAY: Record<string, string> = {
  plumber: "Plumbing",
  "med-spa": "Med Spa",
  hvac: "HVAC",
  restoration: "Restoration",
  "carpet-cleaning": "Carpet Cleaning",
  roofing: "Roofing",
  "real-estate": "Real Estate",
  mortgage: "Mortgage",
  chiropractor: "Chiropractic",
  dental: "Dental",
};

function nicheLabel(n: string): string {
  return NICHE_DISPLAY[n] ?? n.charAt(0).toUpperCase() + n.slice(1);
}

// ─── Shared input style helpers ─────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  background: "oklch(0.14 0.018 285)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: "0.75rem",
  padding: "14px 16px",
  color: "white",
  fontSize: "1rem",
  width: "100%",
  outline: "none",
  transition: "border-color 0.15s",
};

const inputFocus: React.CSSProperties = {
  border: "1px solid oklch(0.58 0.22 290 / 60%)",
};

const inputError: React.CSSProperties = {
  border: "1px solid oklch(0.65 0.22 25 / 70%)",
};

// ─── Component ───────────────────────────────────────────────────────────────────────────────

export default function DemoStep9CTA() {
  const {
    activateTrial,
    completeStep,
    businessName,
    city,
    niche,
    demoProspect,
    goBack,
  } = useDemoFlow();

  const firstName = demoProspect?.firstName ?? "";

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const hasCalledComplete = useRef(false);
  const { display: timerDisplay, expired } = useCountdown();

  // Mark step complete on mount (non-blocking)
  useEffect(() => {
    if (!hasCalledComplete.current) {
      hasCalledComplete.current = true;
      completeStep();
    }
  }, [completeStep]);

  // Auto-redirect on success
  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [status]);

  const emailInvalid = emailTouched && !isValidEmail(email);

  const handleActivate = async () => {
    setEmailTouched(true);
    setErrorMsg("");

    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (status === "loading") return;

    setStatus("loading");
    try {
      const ok = await activateTrial(email, phone || undefined);
      if (ok) {
        setStatus("success");
      } else {
        // activateTrial returns false for backend errors AND for missing actor/sessionId
        setStatus("idle");
        setErrorMsg(
          "We couldn\u2019t activate your trial right now \u2014 please try again in a moment.",
        );
      }
    } catch (err) {
      console.error("[DemoStep9CTA] activateTrial threw:", err);
      setStatus("idle");
      setErrorMsg(
        "Something went wrong \u2014 please check your connection and try again.",
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void handleActivate();
  };

  // ──── Success screen ─────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10"
        data-ocid="demo.step9.success_state"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 40%, oklch(0.55 0.22 155 / 12%) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 18, stiffness: 260 }}
          className="relative z-10 flex flex-col items-center gap-5 text-center max-w-sm"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "oklch(0.18 0.06 155 / 30%)",
              border: "2px solid oklch(0.62 0.18 155 / 50%)",
              boxShadow: "0 0 40px oklch(0.62 0.18 155 / 25%)",
            }}
          >
            <CheckCircle
              className="w-10 h-10"
              style={{ color: "oklch(0.72 0.18 155)" }}
            />
          </div>

          <h2
            className="font-black text-white"
            style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)" }}
          >
            Trial Activated!
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "oklch(0.62 0.02 280)" }}
          >
            Your 7-day trial for{" "}
            <span className="font-bold text-white">{businessName}</span> is
            live. Check your email for your login link.
          </p>

          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "oklch(0.55 0.02 280)" }}
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Taking you to your dashboard…
          </div>

          <a
            href="/dashboard"
            data-ocid="demo.step9.open_dashboard.link"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            style={{
              background: "oklch(0.62 0.18 155 / 20%)",
              border: "1px solid oklch(0.62 0.18 155 / 40%)",
              color: "oklch(0.78 0.16 155)",
              textDecoration: "none",
            }}
          >
            Open Your Dashboard →
          </a>
        </motion.div>
      </div>
    );
  }

  // ──── Main activation screen ─────────────────────────────────────────────────
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10 overflow-hidden"
      data-ocid="demo.step9.section"
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.55 0.22 290 / 12%) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md gap-5 text-center">
        {/* Act 3 label */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-bold uppercase tracking-[0.18em]"
          style={{ color: "oklch(0.62 0.18 290)" }}
          data-ocid="demo.step9.act_label"
        >
          Act 3 — Your Trial
        </motion.p>

        {/* Personalized headline */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="font-black leading-tight"
          style={{
            fontSize: "clamp(1.65rem, 5vw, 2.5rem)",
            background:
              "linear-gradient(135deg, #fff 30%, oklch(0.75 0.18 290) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {businessName
            ? `Your 7-Day Trial for ${businessName} is Ready`
            : "Your 7-Day Free Trial is Ready"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm"
          style={{ color: "oklch(0.6 0.02 280)" }}
        >
          No credit card.&nbsp; No contracts.&nbsp; Cancel anytime.
        </motion.p>

        {/* "Your Info on File" summary card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="w-full rounded-2xl px-5 py-4 text-left"
          style={{
            background: "oklch(0.12 0.016 285 / 90%)",
            border: "1px solid oklch(0.58 0.22 290 / 18%)",
          }}
          data-ocid="demo.step9.info_card"
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.55 0.02 280)" }}
          >
            Your Info on File
          </p>
          <div className="space-y-2">
            {(
              [
                { label: "Business", value: businessName },
                { label: "Owner", value: firstName },
                { label: "Location", value: city },
                { label: "Niche", value: niche ? nicheLabel(niche) : "" },
              ] as { label: string; value: string }[]
            ).map(({ label, value }) =>
              value ? (
                <div key={label} className="flex items-baseline gap-2">
                  <span
                    className="text-xs w-16 shrink-0"
                    style={{ color: "oklch(0.5 0.02 280)" }}
                  >
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-white truncate">
                    {value}
                  </span>
                </div>
              ) : null,
            )}
          </div>
          <button
            type="button"
            onClick={goBack}
            data-ocid="demo.step9.start_over.button"
            className="mt-3 flex items-center gap-1 text-xs transition-opacity hover:opacity-80"
            style={{ color: "oklch(0.62 0.14 290)" }}
          >
            <Pencil size={10} />
            Not you? Start over
          </button>
        </motion.div>

        {/* Email + Phone fields */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="w-full flex flex-col gap-3 text-left"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="trial-email"
              className="block text-xs font-semibold"
              style={{ color: "oklch(0.6 0.02 280)" }}
            >
              Best email to send your login link:
              <span className="ml-1" style={{ color: "oklch(0.65 0.22 25)" }}>
                *
              </span>
            </label>
            <input
              id="trial-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => {
                setEmailFocused(false);
                setEmailTouched(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="you@yourbusiness.com"
              aria-label="Business email address"
              aria-invalid={emailInvalid}
              data-ocid="demo.step9.email.input"
              disabled={status === "loading"}
              style={{
                ...inputBase,
                ...(emailFocused ? inputFocus : {}),
                ...(emailInvalid ? inputError : {}),
              }}
            />
            {emailInvalid && (
              <p
                className="text-xs"
                style={{ color: "oklch(0.65 0.22 25)" }}
                data-ocid="demo.step9.email.field_error"
              >
                Please enter a valid email address.
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="trial-phone"
              className="block text-xs font-semibold"
              style={{ color: "oklch(0.6 0.02 280)" }}
            >
              Your mobile number
              <span
                className="ml-1 font-normal"
                style={{ color: "oklch(0.45 0.02 280)" }}
              >
                (we\u2019ll send a welcome text)
              </span>
            </label>
            <input
              id="trial-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="555-867-5309"
              aria-label="Mobile phone number"
              data-ocid="demo.step9.phone.input"
              disabled={status === "loading"}
              style={{
                ...inputBase,
                ...(phoneFocused ? inputFocus : {}),
              }}
            />
          </div>
        </motion.div>

        {/* Benefit bullets */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 text-left sm:text-center"
          data-ocid="demo.step9.benefits"
        >
          {BENEFITS.map(({ Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2 text-xs flex-1">
              <Icon
                size={14}
                style={{ color, flexShrink: 0 }}
                aria-hidden="true"
              />
              <span style={{ color: "oklch(0.64 0.02 280)" }}>{text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="w-full flex flex-col gap-3"
        >
          <button
            type="button"
            onClick={() => void handleActivate()}
            disabled={status === "loading"}
            data-ocid="demo.step9.activate_trial.primary_button"
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black text-base text-white transition-all duration-200"
            style={{
              background:
                status === "loading"
                  ? "oklch(0.38 0.06 155 / 60%)"
                  : "linear-gradient(135deg, oklch(0.52 0.2 290), oklch(0.52 0.2 155))",
              boxShadow:
                status !== "loading"
                  ? "0 8px 32px oklch(0.52 0.2 290 / 35%), 0 0 0 1px oklch(0.52 0.2 290 / 20%)"
                  : "none",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              fontSize: "1rem",
            }}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Activating your trial…
              </>
            ) : (
              "Activate My Free Trial \u2014 No Credit Card Required"
            )}
          </button>

          {errorMsg && (
            <div
              className="flex flex-col items-center gap-2.5"
              data-ocid="demo.step9.error_state"
            >
              <p
                className="text-xs text-center px-3 py-2 rounded-xl w-full"
                style={{
                  color: "oklch(0.78 0.16 25)",
                  background: "oklch(0.52 0.18 25 / 12%)",
                  border: "1px solid oklch(0.52 0.18 25 / 28%)",
                }}
              >
                {errorMsg}
              </p>
              <button
                type="button"
                onClick={() => void handleActivate()}
                disabled={status === "loading"}
                data-ocid="demo.step9.retry.button"
                className="text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "oklch(0.68 0.14 290)" }}
              >
                Try again
              </button>
            </div>
          )}
        </motion.div>

        {/* Countdown + fine print */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="w-full flex flex-col items-center gap-2"
          data-ocid="demo.step9.countdown"
        >
          <div
            className="w-full rounded-xl px-5 py-3 flex flex-col items-center gap-1.5"
            style={{
              background: expired
                ? "oklch(0.22 0.08 25 / 30%)"
                : "oklch(0.12 0.016 285 / 80%)",
              border: `1px solid ${
                expired
                  ? "oklch(0.62 0.2 25 / 35%)"
                  : "oklch(0.55 0.22 290 / 18%)"
              }`,
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                color: expired ? "oklch(0.72 0.18 25)" : "oklch(0.55 0.02 280)",
              }}
            >
              {expired ? "Offer Expired" : "Offer expires in:"}
            </p>
            <p
              className="font-black tabular-nums"
              style={{
                fontSize: "clamp(1.6rem, 6vw, 2.6rem)",
                letterSpacing: "0.04em",
                color: expired ? "oklch(0.72 0.2 25)" : "white",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {expired ? "00:00:00" : timerDisplay}
            </p>
          </div>

          <p className="text-xs" style={{ color: "oklch(0.42 0.02 280)" }}>
            7-day trial &middot; No commitment &middot; Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}
