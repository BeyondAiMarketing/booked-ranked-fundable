import { BookDemoTrigger } from "@/components/BookDemoModal";
import PublicFooter from "@/components/PublicFooter";
import PublicNav from "@/components/PublicNav";
import BeforeAfterDivider from "@/components/homepage/BeforeAfterDivider";
import CallTextBackSection from "@/components/homepage/CallTextBackSection";
import CrmBackOfficeSection from "@/components/homepage/CrmBackOfficeSection";
import FloatingVoiceButton from "@/components/homepage/FloatingVoiceButton";
import { HomepageHeroSection } from "@/components/homepage/HomepageHeroSection";
import { HomepageNicheSelector } from "@/components/homepage/HomepageNicheSelector";
import { HomepageSocialProofTicker } from "@/components/homepage/HomepageSocialProofTicker";
import PersonalizedCTASection from "@/components/homepage/PersonalizedCTASection";
import Stage1DashboardSection from "@/components/homepage/Stage1DashboardSection";
import Stage2CreditSection from "@/components/homepage/Stage2CreditSection";
import Stage3ReputationSection from "@/components/homepage/Stage3ReputationSection";
import CostSavingsSection from "@/components/marketing/CostSavingsSection";
import ImagineSection from "@/components/marketing/ImagineSection";
import IndustryCardGrid from "@/components/marketing/IndustryCardGrid";
import NoOneElseSection from "@/components/marketing/NoOneElseSection";
import PricingSection from "@/components/marketing/PricingSection";
import StatCallout from "@/components/marketing/StatCallout";
import TrustInfrastructureSection from "@/components/marketing/TrustInfrastructureSection";
import WhatsIncludedSection from "@/components/marketing/WhatsIncludedSection";
import { Button } from "@/components/ui/button";
import { HOMEPAGE_NICHE_DATA, getNicheData } from "@/data/homepageNicheData";
// HOMEPAGE_NICHE_DATA[0] is used only as a shape-safe fallback for non-null typed props.
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, X, XCircle, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── URL-backed niche state helper ────────────────────────────────────────────
// Returns null when no niche is selected (neutral state)
function useNicheParam(): [string | null, (n: string) => void] {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, string>;
  // null = no niche selected (neutral state on load)
  const nicheParam = search?.niche ?? null;

  const setNiche = (niche: string) => {
    void navigate({
      search: ((prev: Record<string, string>) => ({ ...prev, niche })) as never,
      replace: true,
    });
  };

  return [nicheParam, setNiche];
}

// ── Comparison data ──────────────────────────────────────────────────────────
const COMPARISON = [
  {
    aspect: "Tool fragmentation",
    others:
      "5 separate subscriptions for CRM, SEO, reviews, booking, and credit",
    brf: "One platform — one login, one dashboard, one growth system",
  },
  {
    aspect: "Data integrity",
    others: "Generic data on shared cloud servers — vulnerable to tampering",
    brf: "Tamper-resistant infrastructure powered by blockchain architecture",
  },
  {
    aspect: "Onboarding",
    others: "DIY setup with no guidance or automation",
    brf: "Done-with-you onboarding plus AI automation from day one",
  },
  {
    aspect: "Funding access",
    others: "Zero support for business credit or funding readiness",
    brf: "Full fundability roadmap with credit builder and loan-readiness",
  },
];

// ── Exit intent banner ───────────────────────────────────────────────────────
function ExitIntentBanner() {
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("exit-intent-shown");
    if (alreadyShown) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !triggered.current) {
        triggered.current = true;
        sessionStorage.setItem("exit-intent-shown", "1");
        setVisible(true);
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    if (mq.matches) document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed top-0 left-0 right-0 z-[60] hidden md:block"
          data-ocid="exit_intent.banner"
        >
          <div
            className="flex items-center justify-between gap-4 px-6 py-3.5"
            style={{
              background:
                "linear-gradient(90deg, rgba(88,28,135,0.97) 0%, rgba(67,56,202,0.97) 100%)",
              borderBottom: "1px solid rgba(139,92,246,0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Zap size={16} className="text-yellow-300 flex-shrink-0" />
              <span className="text-white text-sm font-semibold truncate">
                Before you go — your live demo is ready. It takes 5 minutes.
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/demo"
                data-ocid="exit_intent.demo_button"
                onClick={() => setVisible(false)}
                className="inline-flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm px-4 py-1.5 rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                See The Live Demo Now
                <ArrowRight size={13} />
              </Link>
              <button
                type="button"
                data-ocid="exit_intent.close_button"
                onClick={() => setVisible(false)}
                aria-label="Close banner"
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Mobile sticky demo bar ───────────────────────────────────────────────────
function MobileStickyDemoBar({ pastFinalCta }: { pastFinalCta: boolean }) {
  return (
    <AnimatePresence>
      {!pastFinalCta && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          data-ocid="mobile_sticky.demo_bar"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div
            className="px-4 py-3"
            style={{
              background: "rgba(2, 6, 23, 0.97)",
              backdropFilter: "blur(12px)",
              borderTop: "1px solid rgba(139,92,246,0.25)",
            }}
          >
            <Link to="/demo">
              <button
                type="button"
                data-ocid="mobile_sticky.demo_button"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-4 py-3.5 rounded-xl text-sm shadow-lg shadow-purple-900/50 transition-all duration-200"
              >
                <Zap size={15} />
                See The Live Demo Now
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Generic neutral niche data for use when no niche is selected ─────────────
const NEUTRAL_NICHE_DATA = HOMEPAGE_NICHE_DATA[0]; // used as shape reference only

// ── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [activeNiche, setActiveNiche] = useNicheParam();
  const [pastFinalCta, setPastFinalCta] = useState(false);
  const finalCtaRef = useRef<HTMLElement>(null);

  // nicheData is undefined when no niche selected — components must handle null
  const nicheData = getNicheData(activeNiche);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastFinalCta(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );
    const el = finalCtaRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const handleHeroCta = () => {
    void navigate({
      to: "/demo",
      search: (activeNiche ? { niche: activeNiche } : {}) as Record<
        string,
        string
      >,
    });
  };

  // Final CTA label — generic when no niche selected
  const finalCtaLabel = nicheData
    ? `See Your ${nicheData.label} Business Inside BRF`
    : "See Your Business Inside BRF";

  // Final CTA niche phrase — generic when no niche selected
  const finalCtaNichePhrase = nicheData
    ? nicheData.label.toLowerCase()
    : "local service";

  // Eyebrow in final CTA — only shown when niche selected
  const finalCtaEyebrow = nicheData
    ? `${nicheData.icon} Built for ${nicheData.label}s`
    : "Built for Local Service Businesses";

  return (
    <div className="min-h-screen" style={{ background: "#020617" }}>
      <ExitIntentBanner />
      <PublicNav />

      {/* ── Niche selector (sticky) ── */}
      <HomepageNicheSelector
        activeNiche={activeNiche}
        onNicheChange={setActiveNiche}
      />

      {/* ── Hero ── */}
      <HomepageHeroSection
        activeNiche={activeNiche}
        onCtaClick={handleHeroCta}
      />

      {/* ── Social proof ticker ── */}
      <HomepageSocialProofTicker activeNiche={activeNiche} />

      {/* ── Stage 1 — Live Dashboard Preview ── */}
      <Stage1DashboardSection
        nicheData={nicheData ?? NEUTRAL_NICHE_DATA}
        businessName="Your Business"
        isNeutral={!nicheData}
      />

      {/* ── Stage 2 — Business Credit Builder ── */}
      <Stage2CreditSection nicheLabel={nicheData?.nicheLabel} />

      {/* ── Stage 3 — Reputation & Social ── */}
      <Stage3ReputationSection
        nicheData={nicheData ?? NEUTRAL_NICHE_DATA}
        isNeutral={!nicheData}
      />

      {/* ── Stage 4 — CRM & Back Office ── */}
      <CrmBackOfficeSection
        nicheData={nicheData ?? NEUTRAL_NICHE_DATA}
        isNeutral={!nicheData}
      />

      {/* ── Stage 5 — Call/Text Back (safety net, NOT hero) ── */}
      <CallTextBackSection />

      {/* ── Before / After Divider ── */}
      <BeforeAfterDivider
        nicheData={nicheData ?? NEUTRAL_NICHE_DATA}
        isNeutral={!nicheData}
      />

      {/* ── Personalized CTA ── */}
      <PersonalizedCTASection
        nicheData={nicheData ?? NEUTRAL_NICHE_DATA}
        isNeutral={!nicheData}
      />

      {/* ── Imagine Section ── */}
      <ImagineSection />

      {/* ── What's Included ── */}
      <WhatsIncludedSection showHeader />

      {/* ── Industry Cards ── */}
      <IndustryCardGrid />

      {/* ── No One Else ── */}
      <NoOneElseSection />

      {/* ── Comparison table ── */}
      <section
        className="py-20 px-6"
        style={{ background: "rgba(12,10,30,0.8)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Local Businesses Choose BRF
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Most platforms solve one problem. We built the only system that
              solves all three — bookings, rankings, and fundability.
            </p>
          </motion.div>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b border-white/10"
                  style={{ background: "rgba(30,27,75,0.5)" }}
                >
                  <th className="text-left py-4 pr-6 pl-5 text-sm font-semibold text-slate-300 w-1/3">
                    Challenge
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-slate-400">
                    Typical Tools
                  </th>
                  <th className="text-center py-4 pl-4 pr-5 text-sm font-semibold text-indigo-300">
                    Booked Ranked Fundable
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={row.aspect}
                    className="border-b border-white/5"
                    style={{
                      background:
                        i % 2 === 0 ? "rgba(30,27,75,0.2)" : "transparent",
                    }}
                  >
                    <td className="py-4 pr-6 pl-5 text-sm font-medium text-slate-300">
                      {row.aspect}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-400 text-center">
                      <div className="flex items-start gap-2 justify-center">
                        <XCircle
                          size={14}
                          className="text-red-500 mt-0.5 flex-shrink-0"
                        />
                        <span>{row.others}</span>
                      </div>
                    </td>
                    <td className="py-4 pl-4 pr-5 text-sm text-slate-300 text-center">
                      <div className="flex items-start gap-2 justify-center">
                        <CheckCircle2
                          size={14}
                          className="text-indigo-400 mt-0.5 flex-shrink-0"
                        />
                        <span>{row.brf}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <TrustInfrastructureSection />
      <StatCallout />
      <CostSavingsSection />
      <PricingSection />

      {/* ── Final CTA ── */}
      <section
        ref={finalCtaRef}
        data-ocid="homepage.final_cta.section"
        className="py-24 px-6 text-white text-center relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%), linear-gradient(180deg, #020617 0%, #0c0a1e 50%, #020617 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">
              {finalCtaEyebrow}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #a78bfa 100%)",
                }}
              >
                Stop Losing Jobs to Competitors
              </span>
            </h2>
            <p className="text-slate-300 mb-10 text-lg max-w-xl mx-auto">
              Start your free 7-day trial. See your{" "}
              <span className="text-white font-semibold">
                {finalCtaNichePhrase}
              </span>{" "}
              AI receptionist, website, and CRM live — no credit card.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                type="button"
                data-ocid="homepage.cta.primary_button"
                onClick={handleHeroCta}
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-xl shadow-purple-900/60 transition-all hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                }}
              >
                {finalCtaLabel}
                <ArrowRight size={16} />
              </button>
              <BookDemoTrigger
                label="Book a Live Demo"
                variant="outline"
                size="lg"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />

      <MobileStickyDemoBar pastFinalCta={pastFinalCta} />

      {/* ── Floating voice button — always visible ── */}
      <FloatingVoiceButton
        nicheData={nicheData ?? NEUTRAL_NICHE_DATA}
        isNeutral={!nicheData}
      />
    </div>
  );
}
