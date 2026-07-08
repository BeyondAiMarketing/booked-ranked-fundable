// ARCHIVED — replaced by new DemoPage.tsx (Version 113). Preserved for rollback.
import DemoHeader from "@/components/demo/DemoHeader";
import DemoNicheSelector from "@/components/demo/DemoNicheSelector";
import DemoScene1Voice from "@/components/demo/DemoScene1Voice";
import DemoScene2TextBack from "@/components/demo/DemoScene2TextBack";
import DemoScene3ChatWidget from "@/components/demo/DemoScene3ChatWidget";
import DemoScene4Social from "@/components/demo/DemoScene4Social";
import DemoScene5CreditBuilder from "@/components/demo/DemoScene5CreditBuilder";
import DemoTrack2 from "@/components/demo/DemoTrack2";
import DemoTransition from "@/components/demo/DemoTransition";
import { useSearch } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// Track 1 scene metadata
const TRACK1_SCENES = [
  {
    title: "Your AI Voice Agent",
    subtitle: "Hear your AI receptionist answer a live call right now",
    statement:
      "Your AI answers every call, 24/7 — qualifies the lead and books the appointment while you focus on the work.",
    recap:
      "Your AI just answered a call, qualified the lead, and booked the job — without you touching your phone.",
  },
  {
    title: "Call Text-Back",
    subtitle: "Every missed call gets a text back in 8 seconds — automatically",
    statement:
      "Every missed call gets a text back in 8 seconds. Leads never go cold — even at midnight.",
    recap:
      "Your AI recovered a lead at 11:47pm that would have been lost. That happens every night, automatically.",
  },
  {
    title: "Website Chat Widget",
    subtitle: "Your website closes leads 24/7 — no staff required",
    statement: "Your website closes leads at 2am — without you saying a word.",
    recap:
      "Your website chat just captured a lead who asked about price and would have left otherwise.",
  },
  {
    title: "Social Media Chat",
    subtitle: "Every DM on every platform answered instantly by your AI",
    statement:
      "Every DM on every platform gets an instant AI response. No lead slips through the cracks.",
    recap:
      "Your AI captured 2 leads across Facebook and Instagram while you were off the clock.",
  },
  {
    title: "Business Credit Builder",
    subtitle:
      "Watch your business build $250K–$500K in fundable credit over 90 days",
    statement:
      "97% of service businesses never build fundable credit. Yours builds it automatically in the background.",
    recap:
      "In 90 days, your business goes from no credit to $50K–$500K in available funding — without you managing it.",
  },
];

// Track 2 step labels
const TRACK2_STEPS = [
  "Command Center",
  "CRM & Pipeline",
  "Reputation Center",
  "Campaign Engine",
  "Website Studio",
  "Savings Summary",
];

const TRACK2_SUBTITLES = [
  "Your real-time business dashboard — everything happening at a glance",
  "Every lead, every conversation, every pipeline stage — all in one place",
  "Your reviews, responses, and reputation — managed on autopilot",
  "Email sequences, social posts, and outreach running without you",
  "Your pre-built website — live, editable, and converting visitors to leads",
  "See exactly how much BRF saves you every single month",
];

const COUNTDOWN_SECS = 22;
const RECAP_STORAGE_KEY = "brf_demo_recap_shown";
const COACH_STORAGE_KEY = "brf_demo_coach_shown";

type DemoState =
  | { phase: "select" }
  | { phase: "track1"; scene: number }
  | { phase: "transition" }
  | { phase: "track2"; step: number }
  | { phase: "complete" };

// Canonical niche keys (must match DemoNicheSelector NICHES[].key).
// Keeping this list local avoids importing the selector's private constant.
const VALID_NICHES = [
  "plumbing",
  "med-spa",
  "hvac",
  "restoration",
  "carpet-cleaning",
  "roofing",
  "real-estate",
  "mortgage",
  "chiropractor",
  "dental",
] as const;

// Neutral placeholder used ONLY when the URL niche is genuinely missing or
// invalid. Previously this defaulted to "plumbing", which caused the Real
// Estate flow (/demo?niche=real-estate) to render "Your Plumbing Business App"
// whenever the query param was absent or mismatched. With the isValidNiche guard
// below, an invalid/missing niche sends the user to the selector phase, so this
// placeholder never reaches the niche content maps. It is intentionally NOT
// "plumbing" so no code path can silently impersonate the plumbing niche.
const NEUTRAL_NICHE = "";

function isValidNiche(niche: string | null | undefined): niche is string {
  return !!niche && (VALID_NICHES as readonly string[]).includes(niche);
}

export default function ServicesDemoPage() {
  // Read URL params for niche and name pre-selection
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const urlNicheRaw = (search.niche as string | undefined) ?? null;
  // Only accept the URL niche if it is a known, valid niche key. This is the
  // v213 regression fix: an invalid/missing niche no longer falls back to
  // "plumbing" — it is treated as "no niche" so the user lands on the selector.
  const urlNiche = isValidNiche(urlNicheRaw) ? urlNicheRaw : null;
  const urlName = (search.name as string | undefined) ?? null;

  const [demoState, setDemoState] = useState<DemoState>(() => {
    if (urlNiche) return { phase: "track1", scene: 0 };
    return { phase: "select" };
  });

  // selectedNiche only seeds from a VALID url niche. When no valid niche is
  // present we keep a neutral placeholder; the user must pick a niche from the
  // selector before any scene renders, so this value never reaches the niche
  // content maps in that case.
  const [selectedNiche, setSelectedNiche] = useState<string>(
    urlNiche ?? NEUTRAL_NICHE,
  );
  const [businessName, setBusinessName] = useState<string>(() => {
    if (urlName) return urlName;
    const stored = sessionStorage.getItem("brf_demo_biz_name");
    return stored ?? "[Your Business Name]";
  });

  // Countdown + auto-advance
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Coach bubble (first scene only, once per session)
  const [showCoach, setShowCoach] = useState(() => {
    return !sessionStorage.getItem(COACH_STORAGE_KEY);
  });

  // Recap overlay (shown after each scene)
  const [showRecap, setShowRecap] = useState(false);
  const recapShownRef = useRef(false);

  const dismissCoach = useCallback(() => {
    sessionStorage.setItem(COACH_STORAGE_KEY, "1");
    setShowCoach(false);
  }, []);

  const resetCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(COUNTDOWN_SECS);
  }, []);

  const handleNicheSelect = useCallback(
    (niche: string) => {
      const storedName = sessionStorage.getItem("brf_demo_biz_name");
      if (storedName) setBusinessName(storedName);
      setSelectedNiche(niche);
      setDemoState({ phase: "track1", scene: 0 });
      resetCountdown();
      recapShownRef.current = false;
    },
    [resetCountdown],
  );

  const advanceScene = useCallback(() => {
    setShowRecap(false);
    setDemoState((prev) => {
      if (prev.phase === "track1") {
        const nextScene = prev.scene + 1;
        if (nextScene >= TRACK1_SCENES.length) {
          return { phase: "transition" };
        }
        return { phase: "track1", scene: nextScene };
      }
      if (prev.phase === "track2") {
        const nextStep = prev.step + 1;
        if (nextStep > TRACK2_STEPS.length) {
          return { phase: "complete" };
        }
        return { phase: "track2", step: nextStep };
      }
      return prev;
    });
    setCountdown(COUNTDOWN_SECS);
    recapShownRef.current = false;
  }, []);

  // Back navigation — no recap, just navigate directly
  const handleBack = useCallback(() => {
    setShowRecap(false);
    if (showCoach) dismissCoach();
    setDemoState((prev) => {
      if (prev.phase === "track1") {
        if (prev.scene === 0) return { phase: "select" };
        return { phase: "track1", scene: prev.scene - 1 };
      }
      if (prev.phase === "transition") {
        return { phase: "track1", scene: TRACK1_SCENES.length - 1 };
      }
      if (prev.phase === "track2") {
        if (prev.step === 1) return { phase: "transition" };
        return { phase: "track2", step: prev.step - 1 };
      }
      return prev;
    });
    resetCountdown();
    recapShownRef.current = false;
  }, [showCoach, dismissCoach, resetCountdown]);

  const handleNext = useCallback(() => {
    if (showCoach) dismissCoach();
    const recapsShown = sessionStorage.getItem(RECAP_STORAGE_KEY);
    if (
      !recapsShown &&
      !recapShownRef.current &&
      demoState.phase === "track1"
    ) {
      recapShownRef.current = true;
      setShowRecap(true);
      setCountdown(COUNTDOWN_SECS);
      return;
    }
    advanceScene();
  }, [showCoach, dismissCoach, demoState.phase, advanceScene]);

  // Auto-advance countdown
  useEffect(() => {
    if (demoState.phase !== "track1" && demoState.phase !== "track2") return;
    if (showRecap) return;

    setCountdown(COUNTDOWN_SECS);
    if (countdownRef.current) clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          handleNext();
          return COUNTDOWN_SECS;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [demoState, showRecap, handleNext]);

  // Compute header info
  const isTrack1 = demoState.phase === "track1";
  const isTrack2 = demoState.phase === "track2";
  const headerTrack: 1 | 2 = isTrack2 ? 2 : 1;
  const headerScene = isTrack1
    ? (demoState as { scene: number }).scene + 1
    : isTrack2
      ? (demoState as { step: number }).step
      : 1;
  const headerTotal = isTrack2 ? TRACK2_STEPS.length : TRACK1_SCENES.length;
  const headerLabel = isTrack1
    ? (TRACK1_SCENES[(demoState as { scene: number }).scene]?.title ?? "")
    : isTrack2
      ? (TRACK2_STEPS[(demoState as { step: number }).step - 1] ?? "")
      : "";

  const showHeader = demoState.phase !== "select";

  // Current scene data
  const currentSceneData =
    demoState.phase === "track1"
      ? TRACK1_SCENES[(demoState as { scene: number }).scene]
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Demo header (fixed top) */}
      {showHeader && (
        <DemoHeader
          track={headerTrack}
          scene={headerScene}
          totalScenes={headerTotal}
          sceneLabel={headerLabel}
          businessName={businessName}
        />
      )}

      {/* Main content */}
      <div className={showHeader ? "pt-14" : ""}>
        <AnimatePresence mode="wait">
          {/* === NICHE SELECTOR === */}
          {demoState.phase === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DemoNicheSelector onSelect={handleNicheSelect} />
            </motion.div>
          )}

          {/* === TRACK 1: SCENE === */}
          {demoState.phase === "track1" && currentSceneData && (
            <motion.div
              key={`track1-${(demoState as { scene: number }).scene}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.55 }}
              className="min-h-screen flex flex-col"
            >
              {/* ── BIG SCENE LABEL ── */}
              <div className="pt-10 pb-4 px-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
                >
                  Scene {(demoState as { scene: number }).scene + 1} of{" "}
                  {TRACK1_SCENES.length} — Track 1: What We Do For You
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight"
                >
                  {currentSceneData.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
                >
                  {currentSceneData.subtitle}
                </motion.p>
              </div>

              {/* Scene content */}
              <div className="flex-1 flex items-start justify-center px-4 pb-8 overflow-y-auto">
                <div className="w-full max-w-2xl">
                  {(demoState as { scene: number }).scene === 0 && (
                    <DemoScene1Voice
                      businessName={businessName}
                      niche={selectedNiche}
                    />
                  )}
                  {(demoState as { scene: number }).scene === 1 && (
                    <DemoScene2TextBack
                      businessName={businessName}
                      niche={selectedNiche}
                    />
                  )}
                  {(demoState as { scene: number }).scene === 2 && (
                    <DemoScene3ChatWidget
                      businessName={businessName}
                      niche={selectedNiche}
                    />
                  )}
                  {(demoState as { scene: number }).scene === 3 && (
                    <DemoScene4Social
                      businessName={businessName}
                      niche={selectedNiche}
                    />
                  )}
                  {(demoState as { scene: number }).scene === 4 && (
                    <DemoScene5CreditBuilder />
                  )}
                </div>
              </div>

              {/* Bold statement */}
              <div className="px-4 pb-6 text-center max-w-xl mx-auto">
                <p className="text-sm md:text-base font-semibold text-slate-300 leading-relaxed">
                  {currentSceneData.statement}
                </p>
              </div>

              {/* Bottom bar: Back + Next buttons + countdown ring */}
              <div className="sticky bottom-0 border-t border-white/8 bg-slate-950/90 backdrop-blur px-6 py-4 flex items-center justify-between gap-3">
                {/* Back button */}
                <button
                  type="button"
                  data-ocid={`services_demo.scene_back_button.${(demoState as { scene: number }).scene + 1}`}
                  onClick={handleBack}
                  className="flex items-center gap-1.5 border border-white/20 hover:border-white/40 text-slate-300 hover:text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors duration-200"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>

                {/* Scene dots (centered) */}
                <div className="flex items-center gap-1.5 flex-1 justify-center">
                  {TRACK1_SCENES.map((_, i) => (
                    <div
                      key={TRACK1_SCENES[i]?.title ?? i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === (demoState as { scene: number }).scene
                          ? "bg-indigo-400 w-4"
                          : i < (demoState as { scene: number }).scene
                            ? "bg-indigo-600/50 w-1.5"
                            : "bg-white/20 w-1.5"
                      }`}
                    />
                  ))}
                </div>

                {/* Next button with countdown ring */}
                <div className="relative">
                  {/* Coach bubble */}
                  {showCoach &&
                    (demoState as { scene: number }).scene === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-14 right-0 bg-indigo-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap"
                      >
                        Click here or wait — it moves automatically
                        <div className="absolute bottom-[-5px] right-4 w-2.5 h-2.5 bg-indigo-700 rotate-45" />
                      </motion.div>
                    )}

                  <button
                    type="button"
                    data-ocid={`services_demo.scene_next_button.${(demoState as { scene: number }).scene + 1}`}
                    onClick={handleNext}
                    className="relative flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors duration-200 shadow-lg shadow-indigo-900/40"
                  >
                    {/* Countdown ring */}
                    <svg
                      className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                      viewBox="0 0 100 100"
                      style={{ borderRadius: "0.75rem" }}
                      aria-hidden="true"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="96"
                        height="96"
                        rx="10"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="2"
                        strokeDasharray={`${(countdown / COUNTDOWN_SECS) * 376} 376`}
                      />
                    </svg>
                    Next
                    <ChevronRight size={16} />
                    <span className="text-[10px] text-indigo-300 font-normal">
                      {countdown}s
                    </span>
                  </button>
                </div>
              </div>

              {/* Recap overlay */}
              <AnimatePresence>
                {showRecap && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
                    onClick={() => {
                      sessionStorage.setItem(RECAP_STORAGE_KEY, "1");
                      advanceScene();
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 24, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">✓</span>
                      </div>
                      <p className="text-sm text-slate-300 text-center leading-relaxed mb-5">
                        {currentSceneData.recap}
                      </p>
                      <button
                        type="button"
                        data-ocid="services_demo.recap_got_it_button"
                        onClick={() => {
                          sessionStorage.setItem(RECAP_STORAGE_KEY, "1");
                          advanceScene();
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors duration-200"
                      >
                        Got it →
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* === TRANSITION === */}
          {demoState.phase === "transition" && (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DemoTransition
                onContinue={() => {
                  setDemoState({ phase: "track2", step: 1 });
                  setCountdown(COUNTDOWN_SECS);
                }}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {/* === TRACK 2: BACK OFFICE === */}
          {demoState.phase === "track2" && (
            <motion.div
              key={`track2-${(demoState as { step: number }).step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.55 }}
              className="min-h-screen flex flex-col"
            >
              {/* ── BIG STEP LABEL ── */}
              <div className="pt-10 pb-4 px-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block bg-purple-500/15 border border-purple-400/20 text-purple-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
                >
                  Step {(demoState as { step: number }).step} of{" "}
                  {TRACK2_STEPS.length} — Track 2: Your Back Office
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight"
                >
                  Your {TRACK2_STEPS[(demoState as { step: number }).step - 1]}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
                >
                  {TRACK2_SUBTITLES[(demoState as { step: number }).step - 1] ??
                    ""}
                </motion.p>
              </div>

              {/* Step content */}
              <div className="flex-1 overflow-y-auto px-4 pb-8">
                <DemoTrack2
                  currentStep={(demoState as { step: number }).step}
                  businessName={businessName}
                  niche={selectedNiche}
                />
              </div>

              {/* Bottom bar */}
              {(demoState as { step: number }).step < TRACK2_STEPS.length && (
                <div className="sticky bottom-0 border-t border-white/8 bg-slate-950/90 backdrop-blur px-6 py-4 flex items-center justify-between gap-3">
                  {/* Back button */}
                  <button
                    type="button"
                    data-ocid={`services_demo.step_back_button.${(demoState as { step: number }).step}`}
                    onClick={handleBack}
                    className="flex items-center gap-1.5 border border-white/20 hover:border-white/40 text-slate-300 hover:text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors duration-200"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>

                  {/* Step dots (centered) */}
                  <div className="flex items-center gap-1.5 flex-1 justify-center">
                    {TRACK2_STEPS.map((label, i) => (
                      <div
                        key={label}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i + 1 === (demoState as { step: number }).step
                            ? "bg-purple-400 w-4"
                            : i + 1 < (demoState as { step: number }).step
                              ? "bg-purple-600/50 w-1.5"
                              : "bg-white/20 w-1.5"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Next button */}
                  <button
                    type="button"
                    data-ocid={`services_demo.step_next_button.${(demoState as { step: number }).step}`}
                    onClick={advanceScene}
                    className="relative flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors duration-200 shadow-lg shadow-purple-900/40"
                  >
                    Next Step
                    <ChevronRight size={16} />
                    <span className="text-[10px] text-purple-300 font-normal">
                      {countdown}s
                    </span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* === COMPLETE === */}
          {demoState.phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex items-center justify-center px-6"
            >
              <div className="text-center max-w-md">
                <div className="text-5xl mb-6">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  You&apos;ve seen everything BRF does for{" "}
                  <span className="text-indigo-300">{businessName}</span>
                </h2>
                <p className="text-slate-400 mb-8">
                  Now activate your 7-day free trial and see it running live for
                  your real business.
                </p>
                <a
                  href="/brand-kit"
                  data-ocid="services_demo.final_cta_button"
                  className="block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base py-4 px-8 rounded-2xl shadow-xl shadow-indigo-900/40 transition-all duration-200 text-center mb-4"
                >
                  Activate Your 7-Day Free Trial — No Credit Card Required
                </a>
                <button
                  type="button"
                  onClick={() => setDemoState({ phase: "select" })}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  ← Start over with a different niche
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
