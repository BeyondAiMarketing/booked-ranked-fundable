import type {
  AuditReport,
  DemoMode,
  DemoNicheIdLegacy,
  DemoProspect,
  GreenOverlayData,
  NicheScript,
  NicheScriptLine,
} from "@/types/demo";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useActor } from "../hooks/useActor";
import {
  initAudioContext,
  isAudioPreloaded,
  loadCachedNicheAudio,
  preloadNicheScripts,
  setBackendActor,
} from "../services/audioService";

// ─── Intake data shape ────────────────────────────────────────────────────────

export interface IntakeData {
  businessName: string;
  niche: DemoNicheIdLegacy;
  city: string;
  phone: string;
  firstName?: string;
  email?: string;
  elevenLabsKey?: string;
  openaiKey?: string;
}

// ─── Audio state ──────────────────────────────────────────────────────────────

export type AudioState = "idle" | "loading" | "playing" | "done";

/** Detailed audio readiness — used to gate the Answer button */
export type AudioReadiness = "idle" | "loading" | "ready" | "fallback-ready";

// ─── Context shape ────────────────────────────────────────────────────────────

export interface DemoFlowState {
  /** 0 = intake form, 1–9 = demo steps */
  step: number;
  totalSteps: number;
  businessName: string;
  niche: DemoNicheIdLegacy | "";
  city: string;
  phone: string;
  /** Current step is complete — Next button unlocks */
  isStepComplete: boolean;
  /** Can go back (true when step > 0) */
  canGoBack: boolean;
  /** After all 9 steps are done — replay panel available */
  isReplaying: boolean;
  hasCompletedDemo: boolean;

  /** Backend session ID — null until createSession succeeds */
  sessionId: string | null;

  /** Audio playback state for the voice step */
  audioState: AudioState;

  /**
   * audioReadiness — tracks whether premium audio is cached and decoded.
   *  - "idle"           — no niche selected yet
   *  - "loading"        — fetching from backend cache / ElevenLabs in background
   *  - "ready"          — pre-decoded AudioBuffers exist, Answer button may show
   *  - "fallback-ready" — no premium audio; transcript-only mode will be shown
   */
  audioReadiness: AudioReadiness;

  /** Niche script loaded from backend (null until loadNicheScript resolves) */
  nicheScript: NicheScript | null;

  /** Transcript lines built up during voice playback */
  transcriptLines: Array<{ speaker: "agent" | "customer"; text: string }>;

  /** Full-screen green overlay — null when hidden */
  greenOverlay: GreenOverlayData | null;

  // Legacy compat — points to same data
  currentStep: number;
  demoProspect: DemoProspect | null;
  demoMode: DemoMode;
  auditReport: AuditReport | null;

  // ── Primary actions ──────────────────────────────────────────────────────────

  /** Transition from intake form (step 0) to step 1; creates backend session */
  startDemo: (intake: IntakeData) => void;
  /** Mark the current step as complete, enabling the Next button */
  completeStep: () => void;
  /** Advance to the next step. Only allowed if isStepComplete. */
  goNext: () => void;
  /** Go back one step. Cannot go before step 0. */
  goBack: () => void;
  /** Jump directly to a step (replay / admin only). */
  replayStep: (n: number) => void;

  /** Create backend session and store sessionId */
  createSession: (businessName: string, niche: string) => Promise<void>;
  /** Update step in backend */
  advanceStep: () => Promise<void>;
  /** Show full-screen green overlay, auto-dismiss after 3200ms */
  showGreenOverlay: (data: GreenOverlayData, onDismiss?: () => void) => void;
  hideGreenOverlay: () => void;
  /** Load niche script from backend into state */
  loadNicheScript: () => Promise<void>;
  /** Activate 7-day trial — pass email + optional phone; reads remaining intake from state */
  activateTrial: (email: string, phone?: string) => Promise<boolean>;
  /** Set audio state */
  setAudioState: (s: AudioState) => void;
  /** Append transcript line */
  addTranscriptLine: (speaker: "agent" | "customer", text: string) => void;
  /** Clear transcript */
  clearTranscript: () => void;

  // Legacy compat actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setStepComplete: (complete: boolean) => void;
  setProspect: (prospect: DemoProspect) => void;
  setAuditReport: (report: AuditReport) => void;
  isAdminPreview: () => boolean;
}

const DemoFlowContext = createContext<DemoFlowState | null>(null);

export function useDemoFlow(): DemoFlowState {
  const ctx = useContext(DemoFlowContext);
  if (!ctx) throw new Error("useDemoFlow must be used inside DemoFlowProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

// ─── sessionStorage key ─────────────────────────────────────────────────────

const SESSION_KEY = "brf_demo_session";

function readSession(): Partial<IntakeData> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as Partial<IntakeData>;
  } catch {
    // ignore
  }
  return {};
}

function writeSession(data: IntakeData): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

const TOTAL_STEPS = 9;

export function DemoFlowProvider({ children }: { children: React.ReactNode }) {
  const { actor } = useActor();

  // ── Core state — initialise from sessionStorage if available ─────────────────
  const [step, setStep] = useState(0);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [hasCompletedDemo, setHasCompletedDemo] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [intake, setIntake] = useState<IntakeData>(() => {
    const saved = readSession();
    return {
      businessName: saved.businessName ?? "",
      niche: (saved.niche ?? "") as DemoNicheIdLegacy,
      city: saved.city ?? "",
      phone: saved.phone ?? "",
      firstName: saved.firstName,
      email: saved.email,
    };
  });
  const [auditReportState, setAuditReportState] = useState<AuditReport | null>(
    null,
  );

  // ── New state fields ─────────────────────────────────────────────────────────
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [audioReadiness, setAudioReadiness] = useState<AudioReadiness>("idle");
  const [nicheScript, setNicheScript] = useState<NicheScript | null>(null);
  const [transcriptLines, setTranscriptLines] = useState<
    Array<{ speaker: "agent" | "customer"; text: string }>
  >([]);
  const [greenOverlay, setGreenOverlay] = useState<GreenOverlayData | null>(
    null,
  );
  const greenDismissRef = useRef<(() => void) | undefined>(undefined);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Admin mode — stable ref so no re-renders
  const adminModeRef = useRef<boolean | null>(null);
  const getAdminMode = useCallback((): boolean => {
    if (adminModeRef.current === null) {
      const params = new URLSearchParams(window.location.search);
      adminModeRef.current = params.get("admin") === "true";
    }
    return adminModeRef.current;
  }, []);

  const demoMode: DemoMode = getAdminMode() ? "admin-preview" : "prospect";

  // ── Wire backend actor into audioService ─────────────────────────────────────
  useEffect(() => {
    if (actor) {
      setBackendActor({
        getCachedAudio: (key: string) =>
          actor
            .getCachedAudio(key)
            .then((r) => (r === null ? null : String(r))),
        setCachedAudio: (key: string, base64Audio: string) =>
          actor.setCachedAudio(key, base64Audio),
      });
    }
  }, [actor]);

  // ── Audio pre-loading on niche selection ─────────────────────────────────────

  /**
   * preloadAudioForNiche — called when niche is selected in the intake form.
   *
   * Flow:
   *   1. Try loading from backend cache (getCachedAudio for each line)
   *   2. If all lines loaded: audioReadiness = "ready"
   *   3. If some missing: trigger ElevenLabs/OpenAI background fetch
   *   4. When fetch complete: audioReadiness = "ready"
   *   5. If no API keys: audioReadiness = "fallback-ready" (browser TTS will fire)
   */
  const preloadAudioForNiche = useCallback(
    async (
      nicheId: string,
      businessName: string,
      elevenLabsKey?: string,
      openaiKey?: string,
    ) => {
      if (!nicheId) return;

      // Already preloaded for this niche
      if (isAudioPreloaded(nicheId)) {
        setAudioReadiness("ready");
        return;
      }

      setAudioReadiness("loading");

      try {
        // Step 1: Try loading all lines from the backend canister cache
        if (actor) {
          const allLoaded = await loadCachedNicheAudio(nicheId);
          if (allLoaded) {
            setAudioReadiness("ready");
            return;
          }
        }

        // Step 2: Generate in background via ElevenLabs / OpenAI
        if (elevenLabsKey || openaiKey) {
          await preloadNicheScripts(
            nicheId,
            businessName,
            elevenLabsKey,
            openaiKey,
          );
          setAudioReadiness("ready");
        } else {
          // No premium audio available — browser TTS will be used synchronously
          setAudioReadiness("fallback-ready");
        }
      } catch {
        // If anything fails, fall back to browser TTS — never block the demo
        setAudioReadiness("fallback-ready");
      }
    },
    [actor],
  );

  // ── Backend integration ──────────────────────────────────────────────────────

  const createSession = useCallback(
    async (businessName: string, niche: string) => {
      if (!actor) return;
      try {
        const id = await actor.createDemoSession(businessName, niche);
        setSessionId(id);
      } catch {
        // best-effort
      }
    },
    [actor],
  );

  const advanceStep = useCallback(async () => {
    if (!actor || !sessionId) return;
    try {
      await actor.updateDemoStep(sessionId, BigInt(step + 1));
    } catch {
      // best-effort
    }
  }, [actor, sessionId, step]);

  const loadNicheScript = useCallback(async () => {
    if (!actor || !intake.niche) return;
    try {
      const result = await actor.getNicheScript(intake.niche);
      if (result && "__kind__" in result && result.__kind__ === "Some") {
        const s = (result as { __kind__: "Some"; value: typeof result }).value;
        const mapped: NicheScript = {
          nicheId: (s as { nicheId: string }).nicheId,
          voiceName: (s as { voiceName: string }).voiceName,
          elevenLabsVoiceId: (s as { elevenLabsVoiceId: string })
            .elevenLabsVoiceId,
          lines: (
            (
              s as {
                lines: Array<{
                  speaker: string;
                  text: string;
                  pauseAfterMs: bigint;
                }>;
              }
            ).lines ?? []
          ).map(
            (l) =>
              ({
                speaker: l.speaker as "agent" | "customer",
                text: l.text,
                pauseAfterMs: Number(l.pauseAfterMs),
              }) as NicheScriptLine,
          ),
        };
        setNicheScript(mapped);
      }
    } catch {
      // best-effort
    }
  }, [actor, intake.niche]);

  const activateTrial = useCallback(
    async (email: string, phone?: string): Promise<boolean> => {
      if (!actor || !sessionId) {
        console.error(
          "[activateTrial] actor or sessionId not ready — cannot activate trial",
          { hasActor: !!actor, sessionId },
        );
        return false;
      }
      try {
        const result = await actor.activateTrial(
          sessionId,
          email,
          intake.firstName ? [intake.firstName] : [],
          intake.city ? [intake.city] : [],
          intake.niche ? [intake.niche] : [],
          phone ? [phone] : [],
        );
        const ok = result.__kind__ === "ok";
        if (ok) {
          // Persist trial activation so a refresh shows success, not the form
          try {
            const stored = sessionStorage.getItem(SESSION_KEY);
            const parsed = stored
              ? (JSON.parse(stored) as Partial<IntakeData>)
              : {};
            sessionStorage.setItem(
              SESSION_KEY,
              JSON.stringify({
                ...parsed,
                email,
                phone: phone ?? parsed.phone ?? "",
              }),
            );
            sessionStorage.setItem("brf_trial_activated", "1");
          } catch {
            // ignore storage errors
          }
        } else {
          const errMsg =
            (result as { __kind__: "err"; value: string }).value ??
            "Trial activation failed";
          console.error("[activateTrial] backend error:", errMsg);
        }
        return ok;
      } catch (err) {
        console.error("[activateTrial] unexpected error:", err);
        return false;
      }
    },
    [actor, sessionId, intake],
  );

  // ── Overlay helpers ──────────────────────────────────────────────────────────

  const showGreenOverlay = useCallback(
    (data: GreenOverlayData, onDismiss?: () => void) => {
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
      greenDismissRef.current = onDismiss;
      setGreenOverlay(data);
      overlayTimerRef.current = setTimeout(() => {
        setGreenOverlay(null);
        greenDismissRef.current?.();
      }, 4200);
    },
    [],
  );

  const hideGreenOverlay = useCallback(() => {
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    setGreenOverlay(null);
    greenDismissRef.current?.();
  }, []);

  // ── Transcript helpers ───────────────────────────────────────────────────────

  const addTranscriptLine = useCallback(
    (speaker: "agent" | "customer", text: string) => {
      setTranscriptLines((prev) => [...prev, { speaker, text }]);
    },
    [],
  );

  const clearTranscript = useCallback(() => {
    setTranscriptLines([]);
  }, []);

  // ── Primary flow actions ─────────────────────────────────────────────────────

  const startDemo = useCallback(
    (data: IntakeData) => {
      setIntake(data);
      // Persist to sessionStorage so page refresh doesn't lose intake data
      writeSession(data);
      setStep(1);
      setIsStepComplete(false);
      setIsReplaying(false);
      setHasCompletedDemo(false);
      setSessionId(null);
      setAudioState("idle");
      setAudioReadiness("loading");
      setNicheScript(null);
      setTranscriptLines([]);

      // Unlock iOS AudioContext SYNCHRONOUSLY in this user gesture context
      void initAudioContext();

      // Create backend session (fire-and-forget)
      void createSession(data.businessName, data.niche);

      // Start pre-loading audio in background
      // This runs while the user watches Step 1 (website reveal)
      void preloadAudioForNiche(
        data.niche,
        data.businessName,
        data.elevenLabsKey,
        data.openaiKey,
      );
    },
    [createSession, preloadAudioForNiche],
  );

  const completeStep = useCallback(() => {
    setIsStepComplete(true);
  }, []);

  const goNext = useCallback(() => {
    setStep((prev) => {
      if (prev < TOTAL_STEPS) {
        const next = prev + 1;
        setIsStepComplete(false);
        if (next === TOTAL_STEPS) setHasCompletedDemo(true);
        return next;
      }
      setIsReplaying(true);
      return prev;
    });
  }, []);

  const goBack = useCallback(() => {
    setStep((prev) => {
      if (prev > 0) {
        setIsStepComplete(true);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const replayStep = useCallback(
    (n: number) => {
      if (!hasCompletedDemo && !getAdminMode()) return;
      if (n >= 1 && n <= TOTAL_STEPS) {
        setStep(n);
        setIsStepComplete(false);
        setIsReplaying(true);
      }
    },
    [hasCompletedDemo, getAdminMode],
  );

  // ── Legacy compat shims ──────────────────────────────────────────────────────

  const canGoBack = step > 0;

  const demoProspect: DemoProspect | null =
    intake.businessName && intake.niche
      ? {
          firstName: intake.firstName ?? "",
          businessName: intake.businessName,
          niche: intake.niche as DemoNicheIdLegacy,
          city: intake.city,
          phone: intake.phone,
          email: intake.email,
        }
      : null;

  const nextStep = useCallback(() => {
    setStep((prev) => {
      if (prev < TOTAL_STEPS) {
        setIsStepComplete(false);
        if (prev + 1 === TOTAL_STEPS) setHasCompletedDemo(true);
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => {
      if (prev > 0) {
        setIsStepComplete(true);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const goToStep = useCallback((n: number) => {
    if (n >= 0 && n <= TOTAL_STEPS) {
      setStep(n);
      setIsStepComplete(n > 0);
    }
  }, []);

  const setStepCompleteFn = useCallback((complete: boolean) => {
    setIsStepComplete(complete);
  }, []);

  const setProspect = useCallback((prospect: DemoProspect) => {
    const newIntake: IntakeData = {
      businessName: prospect.businessName,
      niche: prospect.niche as DemoNicheIdLegacy,
      city: prospect.city,
      phone: prospect.phone,
      firstName: prospect.firstName,
      email: prospect.email,
    };
    setIntake(newIntake);
    writeSession(newIntake);
  }, []);

  const setAuditReport = useCallback((report: AuditReport) => {
    setAuditReportState(report);
  }, []);

  const isAdminPreview = useCallback(() => getAdminMode(), [getAdminMode]);

  // ── Context value ────────────────────────────────────────────────────────────

  const value = useMemo<DemoFlowState>(
    () => ({
      step,
      totalSteps: TOTAL_STEPS,
      businessName: intake.businessName,
      niche: intake.niche ?? "",
      city: intake.city,
      phone: intake.phone,
      isStepComplete,
      canGoBack,
      isReplaying,
      hasCompletedDemo,
      sessionId,
      audioState,
      audioReadiness,
      nicheScript,
      transcriptLines,
      greenOverlay,
      // Legacy compat
      currentStep: step === 0 ? 1 : step + 1,
      demoProspect,
      demoMode,
      auditReport: auditReportState,
      // Primary actions
      startDemo,
      completeStep,
      goNext,
      goBack,
      replayStep,
      createSession,
      advanceStep,
      showGreenOverlay,
      hideGreenOverlay,
      loadNicheScript,
      activateTrial,
      setAudioState,
      addTranscriptLine,
      clearTranscript,
      // Legacy compat actions
      nextStep,
      prevStep,
      goToStep,
      setStepComplete: setStepCompleteFn,
      setProspect,
      setAuditReport,
      isAdminPreview,
    }),
    [
      step,
      intake,
      isStepComplete,
      canGoBack,
      isReplaying,
      hasCompletedDemo,
      sessionId,
      audioState,
      audioReadiness,
      nicheScript,
      transcriptLines,
      greenOverlay,
      demoProspect,
      demoMode,
      auditReportState,
      startDemo,
      completeStep,
      goNext,
      goBack,
      replayStep,
      createSession,
      advanceStep,
      showGreenOverlay,
      hideGreenOverlay,
      loadNicheScript,
      activateTrial,
      addTranscriptLine,
      clearTranscript,
      nextStep,
      prevStep,
      goToStep,
      setStepCompleteFn,
      setProspect,
      setAuditReport,
      isAdminPreview,
    ],
  );

  return (
    <DemoFlowContext.Provider value={value}>
      {children}
    </DemoFlowContext.Provider>
  );
}

// ─── Convenience helper: build a default DemoProspect from niche + name ───────

export function buildDefaultProspect(niche: DemoNicheIdLegacy): DemoProspect {
  const defaults: Record<
    DemoNicheIdLegacy,
    { firstName: string; businessName: string; city: string }
  > = {
    plumber: {
      firstName: "Mike",
      businessName: "Metro Plumbing Pros",
      city: "Dallas",
    },
    "med-spa": {
      firstName: "Ashley",
      businessName: "Revive Med Spa",
      city: "Miami",
    },
    hvac: {
      firstName: "Carlos",
      businessName: "Comfort Zone HVAC",
      city: "Phoenix",
    },
    restoration: {
      firstName: "Jennifer",
      businessName: "Oceanside Restore",
      city: "Tampa",
    },
    "carpet-cleaning": {
      firstName: "Sandra",
      businessName: "Fresh Step Carpet Care",
      city: "Denver",
    },
    roofing: {
      firstName: "Robert",
      businessName: "Summit Roofing Solutions",
      city: "Austin",
    },
    "real-estate": {
      firstName: "Marcus",
      businessName: "Premier Realty Group",
      city: "Atlanta",
    },
    mortgage: {
      firstName: "Denise",
      businessName: "Coastal Lending Partners",
      city: "Charlotte",
    },
    chiropractor: {
      firstName: "Kristin",
      businessName: "Align Chiropractic",
      city: "Nashville",
    },
    dental: {
      firstName: "Tanya",
      businessName: "Bright Smile Dental",
      city: "Orlando",
    },
  };
  const d = defaults[niche];
  return { ...d, niche, phone: "(555) 000-0000" };
}
