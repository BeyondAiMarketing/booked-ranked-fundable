/**
 * PersonalizedCTASection — Brunson epiphany bridge + personalized intake modal.
 * Supports isNeutral=true: no niche pre-selected in modal or copy.
 * Headline reveals the big "what if" moment. CTA slides in an intake form.
 * On submit: navigates to /demo with businessName + niche as URL params.
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HomepageNicheData } from "@/data/homepageNicheData";
import { HOMEPAGE_NICHE_LIST } from "@/data/homepageNicheData";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  nicheData: HomepageNicheData;
  /** When true, use universal copy and no pre-selected niche in modal */
  isNeutral?: boolean;
}

// ─── Intake Modal ─────────────────────────────────────────────────────────────

interface IntakeModalProps {
  defaultNicheId: string | null;
  onClose: () => void;
}

function IntakeModal({ defaultNicheId, onClose }: IntakeModalProps) {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  // null = not yet selected — user must pick before submitting
  const [selectedNiche, setSelectedNiche] = useState<string>(
    defaultNicheId ?? "",
  );
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = businessName.trim() && email.trim() && selectedNiche;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      void navigate({
        to: "/demo",
        search: {
          businessName: businessName.trim(),
          niche: selectedNiche,
        } as Record<string, string>,
      });
    }, 400);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 70%)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="homepage.intake_modal"
    >
      <motion.div
        className="w-full max-w-md rounded-2xl border border-border p-6 flex flex-col gap-5"
        style={{ background: "oklch(0.14 0.015 280)" }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-foreground leading-tight">
              See Your Business Inside BRF
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Personalized in 30 seconds. No credit card. No commitment.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close"
            data-ocid="homepage.intake_modal.close_button"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="biz-name"
              className="text-sm font-semibold text-foreground"
            >
              Business Name
            </Label>
            <Input
              id="biz-name"
              type="text"
              placeholder="e.g. Johnson's Heating & Cooling"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              data-ocid="homepage.intake_modal.business_name_input"
              autoComplete="organization"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-foreground"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@yourbusiness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              data-ocid="homepage.intake_modal.email_input"
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="niche-select"
              className="text-sm font-semibold text-foreground"
            >
              Your Business Type{" "}
              <span className="text-red-400 text-xs font-normal">
                (required)
              </span>
            </Label>
            <select
              id="niche-select"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              required
              className="w-full h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              data-ocid="homepage.intake_modal.niche_select"
            >
              {/* Blank placeholder — forces user to pick */}
              <option value="" disabled>
                — Select your industry —
              </option>
              {HOMEPAGE_NICHE_LIST.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.icon} {n.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={submitting || !canSubmit}
            className="h-12 font-bold text-base gap-2 w-full"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.2 270))",
              color: "#fff",
            }}
            data-ocid="homepage.intake_modal.submit_button"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  ✦
                </motion.span>
                Building your demo…
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Show Me My Dashboard
                <ArrowRight className="w-4 h-4 ml-auto" />
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground leading-snug">
          We'll personalize every feature to your exact business. Takes 30
          seconds, zero commitment.
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PersonalizedCTASection({
  nicheData,
  isNeutral = false,
}: Props) {
  const [showModal, setShowModal] = useState(false);

  // Button and copy adapt to neutral or niche-specific state
  const ctaButtonLabel = isNeutral
    ? "See Your Business Inside BRF — Enter Your Name & Pick Your Industry"
    : `See Your ${nicheData.label} Business Inside BRF`;

  const descriptionText = isNeutral
    ? "Enter your business name and industry, and see exactly what your business looks like inside BRF — with your name, your niche, your numbers."
    : `Enter your business name and see exactly what your ${nicheData.label.toLowerCase()} business looks like inside BRF — with your name, your niche, your numbers.`;

  const painStatDisplay = isNeutral
    ? "40% of local service businesses miss inbound calls — and the first competitor to respond wins the job"
    : `${nicheData.painPointStat} — ${nicheData.painPointLabel}`;

  return (
    <>
      <section
        className="w-full py-20 px-4 relative overflow-hidden"
        style={{ background: "oklch(0.11 0.02 285)" }}
        data-ocid="homepage.personalized_cta_section"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.58 0.22 290 / 8%) 0%, transparent 70%)",
          }}
        />

        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest border"
            style={{
              background: "oklch(0.58 0.22 290 / 12%)",
              borderColor: "oklch(0.58 0.22 290 / 30%)",
              color: "var(--purple-light)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Personalized Demo — No Signup Required
          </div>

          {/* Brunson epiphany bridge headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight">
            What If Your Phone Was Answered{" "}
            <span style={{ color: "var(--purple-light)" }}>24/7</span>, Your
            Credit Was{" "}
            <span style={{ color: "var(--purple-light)" }}>
              Building Automatically
            </span>
            , and Your Reviews Were{" "}
            <span style={{ color: "var(--purple-light)" }}>
              Getting You Ranked
            </span>{" "}
            — Starting Tonight?
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            {descriptionText}
          </p>

          {/* Pain point stat callback */}
          <div
            className="rounded-xl px-5 py-3 border text-sm font-semibold text-foreground"
            style={{
              background: "oklch(0.16 0.02 280)",
              borderColor: "oklch(1 0 0 / 10%)",
            }}
          >
            <span style={{ color: "var(--rose-accent)" }}>⚠</span>{" "}
            {painStatDisplay}
          </div>

          {/* Primary CTA */}
          <motion.button
            className="relative inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-black text-lg text-white shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.2 270))",
              boxShadow:
                "0 0 40px oklch(0.58 0.22 290 / 40%), 0 8px 32px oklch(0 0 0 / 40%)",
            }}
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 0 60px oklch(0.58 0.22 290 / 55%), 0 10px 36px oklch(0 0 0 / 50%)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            data-ocid="homepage.personalized_cta_button"
            aria-label={ctaButtonLabel}
          >
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            {ctaButtonLabel}
            <ArrowRight className="w-5 h-5 flex-shrink-0 ml-1" />
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
              aria-hidden="true"
            >
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, white, transparent)",
                  transform: "translateX(-100%)",
                }}
                animate={{
                  transform: ["translateX(-100%)", "translateX(200%)"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  repeatDelay: 2,
                }}
              />
            </motion.div>
          </motion.button>

          <p className="text-xs text-muted-foreground">
            Takes 30 seconds · No credit card · No commitment · 7-day free trial
            after
          </p>
        </motion.div>
      </section>

      <AnimatePresence>
        {showModal && (
          <IntakeModal
            defaultNicheId={isNeutral ? null : nicheData.id}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
