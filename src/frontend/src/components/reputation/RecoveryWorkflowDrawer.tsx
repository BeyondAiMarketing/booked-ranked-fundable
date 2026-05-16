import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Flag,
  Gavel,
  Handshake,
  Info,
  Loader2,
  MessageCircle,
  ShieldAlert,
  Star,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ReviewSyncRecord } from "../../types/reputationSync";

// ── Types ──────────────────────────────────────────────────────────────────────

type ReviewClassification =
  | "legitimate"
  | "possible_fake"
  | "competitor_attack";
type RecoveryStep = 1 | 2 | 3 | 4 | 5 | 6;

// ── Niche-specific recovery scripts ───────────────────────────────────────────

const NICHE_RESPONSES: Record<
  string,
  { formal: string; friendly: string; brief: string }
> = {
  plumbing: {
    formal:
      "We're truly sorry to hear this wasn't the experience you deserved. Our team's standard is a same-day callback on every inquiry — we'd like to make this right immediately. Please call us directly and ask for the owner. We will personally ensure this is resolved.",
    friendly:
      "Hey — I'm really sorry about this. That's not the experience we want anyone to have with our team. Call us directly and ask for me — I'll make sure we fix this for you right away. We take every call seriously.",
    brief:
      "We're sorry — this isn't our standard. Please call and ask for the owner so we can make it right today.",
  },
  "med-spa": {
    formal:
      "We take all feedback seriously and want every client to feel heard and valued. We'd appreciate the opportunity to speak with you privately to better understand your experience. Please contact our client care team at your earliest convenience.",
    friendly:
      "Thank you for sharing this — it matters to us. We'd really like the chance to speak with you directly and make things right. Please reach out to our care team and mention this review.",
    brief:
      "Thank you for your feedback. Please contact our care team privately so we can address your concerns directly.",
  },
  hvac: {
    formal:
      "We sincerely apologize your experience didn't meet the standard our clients deserve. We'd like to review your service record and make this right. Please contact our office manager and reference this review so we can prioritize your case.",
    friendly:
      "We're really sorry to hear this. Whether it was pricing, timing, or communication — we want to address it. Give us a call and we'll personally review your service and make it right.",
    brief:
      "We're sorry about this. Please call our office and mention this review — we'll make it right.",
  },
  restoration: {
    formal:
      "We understand how stressful property restoration can be, and we sincerely regret that your experience fell short. We are committed to completing every job to a documented standard. Please contact our project manager directly to review the scope and timeline of your project.",
    friendly:
      "We're really sorry this happened. Restoration jobs can be complex and we want to make sure every step was done right for you. Please reach out to our project manager — they have your full file and will address this personally.",
    brief:
      "We're sorry. Please contact our project manager directly — we'll review your job and make it right.",
  },
  roofing: {
    formal:
      "We value every client relationship and are troubled to hear about your experience. We'd like to schedule a walkthrough and address any concerns directly. Please contact our project coordinator with your job details.",
    friendly:
      "That's not the experience we want for anyone. Let us come take another look — contact our office and reference this review and we'll prioritize a follow-up inspection.",
    brief:
      "We're sorry to hear this. Contact us directly and we'll schedule a follow-up inspection right away.",
  },
  "carpet-cleaning": {
    formal:
      "We're sorry your experience didn't meet our standard of quality. A re-clean or refund should not be a question — it's our guarantee. Please contact us directly and we will schedule a complimentary follow-up service.",
    friendly:
      "We're really sorry about this — we guarantee our work and want to make it right. Contact us and we'll come back out at no charge. That's a promise.",
    brief:
      "We're sorry. Contact us and we'll come back out — guaranteed, no charge.",
  },
  "real-estate": {
    formal:
      "We take every client relationship seriously and regret that your experience didn't reflect our commitment to exceptional service. We'd welcome the opportunity to connect and address your specific concerns privately.",
    friendly:
      "Thank you for this — your experience matters deeply to us. I'd personally like to speak with you and understand what we could have done better. Please reach out directly.",
    brief:
      "We're sorry this was your experience. Please reach out directly — I'd like to speak with you personally.",
  },
  mortgage: {
    formal:
      "We understand how critical timing and communication are during the loan process. We're truly sorry your experience fell short. Please contact our loan officer directly to review your case and understand how we can resolve this.",
    friendly:
      "That's not the experience you deserved, especially during such an important process. Please reach out directly to your loan officer — they'll prioritize your case immediately.",
    brief:
      "We're sorry about this. Please contact your loan officer directly — we want to make this right.",
  },
  chiropractic: {
    formal:
      "We sincerely regret that your experience didn't reflect the standard of care we hold ourselves to. Patient satisfaction and outcomes are our highest priority. Please contact our office manager to discuss your case privately and explore how we can address your concerns.",
    friendly:
      "We're truly sorry to hear this — your wellbeing matters to us beyond just your appointment. Please reach out to our office manager who can speak with you privately about your experience.",
    brief:
      "We're sorry about your experience. Please contact our office manager — we want to speak with you privately.",
  },
  dental: {
    formal:
      "We're deeply sorry your experience didn't meet your expectations. Patient satisfaction is our highest priority and we would like to make this right. Please contact our office manager directly so we can review your case and ensure you receive the care you deserve.",
    friendly:
      "We're really sorry to hear this — you deserved a better experience and we want to fix that. Please reach out to our office manager directly who will personally make sure this is addressed.",
    brief:
      "We're sorry about this. Please contact our office manager — we want to make it right for you.",
  },
};

const FAKE_REVIEW_RESPONSE = {
  formal:
    "We've carefully reviewed our service records and are unable to identify a service experience matching this review. We are committed to authentic, verified customer feedback and have reported this review to the platform for investigation. We welcome all genuine feedback from our clients.",
  friendly:
    "We looked through our records and can't find a match for this experience. We take fake reviews seriously and have flagged this with Google for review. If you are a real client, please contact us directly — we'd love the chance to make things right.",
  brief:
    "We cannot verify this service experience in our records. We've reported this review to the platform for investigation.",
};

const HIPAA_NOTICE =
  "HIPAA Notice: Do NOT acknowledge that this person was a patient, confirm any treatment, or reference any health details in your public response. Reply professionally without confirming or denying a patient relationship.";

const MEDICAL_NICHES = ["med-spa", "chiropractic", "dental"];

function getNiche(tenantId: string): string {
  const map: Record<string, string> = {
    "tenant-oceanside": "plumbing",
    "tenant-glow": "med-spa",
    "tenant-arctic": "hvac",
    "tenant-demo": "roofing",
  };
  return map[tenantId] ?? "roofing";
}

// ── Step components ────────────────────────────────────────────────────────────

const STEPS: { id: RecoveryStep; icon: React.ReactNode; label: string }[] = [
  { id: 1, icon: <Gavel size={12} />, label: "Classify" },
  { id: 2, icon: <MessageCircle size={12} />, label: "Respond" },
  { id: 3, icon: <Handshake size={12} />, label: "Resolve Privately" },
  { id: 4, icon: <ClipboardList size={12} />, label: "Document" },
  { id: 5, icon: <Star size={12} />, label: "Counterbalance" },
  { id: 6, icon: <Calendar size={12} />, label: "Monitor" },
];

// ── Main component ─────────────────────────────────────────────────────────────

export default function RecoveryWorkflowDrawer({
  review,
  tenantId,
  onClose,
}: {
  review: ReviewSyncRecord | null;
  tenantId: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<RecoveryStep>(1);
  const [classification, setClassification] =
    useState<ReviewClassification>("legitimate");
  const [selectedVariant, setSelectedVariant] = useState<
    "formal" | "friendly" | "brief"
  >("formal");
  const [responsePublishing, setResponsePublishing] = useState(false);
  const [responseApproved, setResponseApproved] = useState(false);
  const [outreachSent, setOutreachSent] = useState(false);
  const [documented, setDocumented] = useState(false);
  const [counterLaunched, setCounterLaunched] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<RecoveryStep>>(
    new Set(),
  );

  const niche = getNiche(tenantId);
  const isMedical = MEDICAL_NICHES.includes(niche);
  const scripts =
    classification === "possible_fake" || classification === "competitor_attack"
      ? FAKE_REVIEW_RESPONSE
      : (NICHE_RESPONSES[niche] ?? NICHE_RESPONSES.roofing);

  // Response timer
  const [elapsedMins, setElapsedMins] = useState(47);
  useEffect(() => {
    const t = setInterval(() => setElapsedMins((m) => m + 1), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function completeStep(s: RecoveryStep) {
    setCompletedSteps((prev) => new Set(prev).add(s));
    if (s < 6) setStep((s + 1) as RecoveryStep);
  }

  function approveResponse() {
    setResponsePublishing(true);
    setTimeout(() => {
      setResponsePublishing(false);
      setResponseApproved(true);
      toast.success("Response approved and queued for publishing!", {
        description: "It will be live on the platform within minutes.",
      });
      completeStep(2);
    }, 1200);
  }

  function sendPrivateOutreach() {
    setOutreachSent(true);
    toast.success("Private outreach message sent!", {
      description: "A personalized message has been sent via email and SMS.",
    });
    setTimeout(() => completeStep(3), 400);
  }

  function documentIncident() {
    setDocumented(true);
    toast.success("Incident documented", {
      description:
        niche === "restoration"
          ? "Saved with job timestamps for insurance dispute protection."
          : "Logged in your reputation history.",
    });
    setTimeout(() => completeStep(4), 400);
  }

  function launchCounterbalance() {
    setCounterLaunched(true);
    toast.success("Review request campaign launched!", {
      description: "Sending to your last 10 satisfied clients now.",
    });
    setTimeout(() => completeStep(5), 400);
  }

  const isOpen = review !== null;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-40 animate-fade-in"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-hidden="true"
      />
      <dialog
        open
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl flex flex-col overflow-hidden p-0 m-0"
        style={{
          background: "oklch(0.13 0.016 280)",
          borderLeft: "1px solid oklch(1 0 0 / 10%)",
        }}
        data-ocid="recovery.drawer"
        aria-label="Recovery Workflow"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert size={16} className="text-rose-400" />
            <div>
              <p className="text-sm font-bold text-white">Recovery Workflow</p>
              <p className="text-xs text-muted-foreground">
                {review.reviewerName} • {review.rating}★ • {elapsedMins}min ago
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {elapsedMins < 120 ? (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium animate-pulse"
                style={{
                  background: "oklch(0.62 0.18 155 / 15%)",
                  color: "oklch(0.78 0.14 155)",
                }}
              >
                ⏱ {elapsedMins}min — within 2hr window
              </span>
            ) : (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: "oklch(0.62 0.2 15 / 15%)",
                  color: "oklch(0.78 0.16 15)",
                }}
              >
                ⚠ {Math.floor(elapsedMins / 60)}h elapsed
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              data-ocid="recovery.close_button"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Progress steps */}
        <div
          className="flex items-center px-5 py-3 gap-0 shrink-0"
          style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)" }}
        >
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => setStep(s.id)}
                data-ocid={`recovery.step.${s.id}`}
                className="flex flex-col items-center gap-1 flex-1 py-1 rounded-lg transition-colors"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    completedSteps.has(s.id)
                      ? "bg-emerald-500 text-white"
                      : step === s.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                  }`}
                  style={
                    !completedSteps.has(s.id) && step !== s.id
                      ? {
                          background: "oklch(0.18 0.016 280)",
                          border: "1px solid oklch(1 0 0 / 10%)",
                        }
                      : {}
                  }
                >
                  {completedSteps.has(s.id) ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    s.icon
                  )}
                </div>
                <span
                  className={`text-[9px] font-medium text-center leading-none ${step === s.id ? "text-white" : "text-muted-foreground"}`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className="w-full h-px mx-1 max-w-4"
                  style={{
                    background: completedSteps.has(s.id)
                      ? "oklch(0.62 0.18 155 / 40%)"
                      : "oklch(1 0 0 / 8%)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {/* STEP 1: Classify */}
          {step === 1 && (
            <div
              className="space-y-4 animate-fade-in"
              data-ocid="recovery.step_1"
            >
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Step 1: Classify This Review
                </p>
                <p className="text-xs text-muted-foreground">
                  The right response depends on the source. Misclassifying a
                  fake review as legitimate — or vice versa — can make things
                  worse.
                </p>
              </div>
              {[
                {
                  value: "legitimate" as const,
                  label: "Legitimate Complaint",
                  desc: "A real customer with a genuine issue. Respond with empathy and resolution.",
                },
                {
                  value: "possible_fake" as const,
                  label: "Possible Fake Review",
                  desc: "New account, no prior activity, vague complaint, possibly competitor-driven.",
                },
                {
                  value: "competitor_attack" as const,
                  label: "Competitor Attack",
                  desc: "Pattern of similar 1-star reviews from new accounts in a short window.",
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setClassification(opt.value)}
                  data-ocid={`recovery.classify.${opt.value}`}
                  className="w-full rounded-xl p-3.5 text-left transition-colors"
                  style={
                    classification === opt.value
                      ? {
                          background: "oklch(0.58 0.22 290 / 15%)",
                          border: "1px solid oklch(0.58 0.22 290 / 40%)",
                        }
                      : {
                          background: "oklch(0.16 0.014 280)",
                          border: "1px solid oklch(1 0 0 / 8%)",
                        }
                  }
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 mt-0.5 shrink-0 transition-colors ${
                        classification === opt.value
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {opt.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              <button
                type="button"
                onClick={() => completeStep(1)}
                data-ocid="recovery.classify_confirm"
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                style={{
                  background: "oklch(0.58 0.22 290 / 20%)",
                  color: "oklch(0.78 0.16 290)",
                  border: "1px solid oklch(0.58 0.22 290 / 30%)",
                }}
              >
                Confirm Classification <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* STEP 2: Respond */}
          {step === 2 && (
            <div
              className="space-y-4 animate-fade-in"
              data-ocid="recovery.step_2"
            >
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Step 2: Choose & Approve Your Response
                </p>
                <p className="text-xs text-muted-foreground">
                  Best practice: respond within 2 hours of a negative review.{" "}
                  <span
                    className={
                      elapsedMins < 120 ? "text-emerald-400" : "text-amber-400"
                    }
                  >
                    Clock started: {elapsedMins} min ago.
                  </span>
                </p>
              </div>

              {isMedical && (
                <div
                  className="rounded-xl p-3 flex items-start gap-2.5"
                  style={{
                    background: "oklch(0.72 0.18 55 / 10%)",
                    border: "1px solid oklch(0.72 0.18 55 / 30%)",
                  }}
                >
                  <AlertTriangle
                    size={14}
                    className="text-amber-400 mt-0.5 shrink-0"
                  />
                  <p className="text-xs text-amber-300 leading-relaxed">
                    {HIPAA_NOTICE}
                  </p>
                </div>
              )}

              <div
                className="rounded-xl p-3"
                style={{
                  background: "oklch(0.62 0.2 15 / 8%)",
                  border: "1px solid oklch(0.62 0.2 15 / 20%)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Info size={12} className="text-rose-400" />
                  <p className="text-xs font-semibold text-rose-300">
                    This response will be seen by everyone who reads your
                    reviews. Take 30 seconds.
                  </p>
                </div>
              </div>

              {/* 3 variants */}
              {(["formal", "friendly", "brief"] as const).map((variant) => {
                const labels = {
                  formal: "Formal",
                  friendly: "Friendly",
                  brief: "Brief",
                };
                const frameworks = {
                  formal: "Kennedy Direct Response",
                  friendly: "Hormozi Value Empathy",
                  brief: "Ogilvy Clarity",
                };
                return (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    data-ocid={`recovery.response_variant.${variant}`}
                    className="w-full rounded-xl p-3.5 text-left cursor-pointer transition-colors"
                    style={
                      selectedVariant === variant
                        ? {
                            background: "oklch(0.58 0.22 290 / 12%)",
                            border: "1px solid oklch(0.58 0.22 290 / 40%)",
                          }
                        : {
                            background: "oklch(0.16 0.014 280)",
                            border: "1px solid oklch(1 0 0 / 8%)",
                          }
                    }
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                          selectedVariant === variant
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}
                      />
                      <span className="text-xs font-bold text-white">
                        {labels[variant]} Tone
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto"
                        style={{
                          background: "oklch(0.58 0.22 290 / 10%)",
                          color: "oklch(0.76 0.14 290)",
                        }}
                      >
                        {frameworks[variant]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {scripts[variant]}
                    </p>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={approveResponse}
                data-ocid="recovery.approve_response_button"
                disabled={responsePublishing || responseApproved}
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                style={{
                  background: "oklch(0.62 0.18 155 / 20%)",
                  color: "oklch(0.78 0.14 155)",
                  border: "1px solid oklch(0.62 0.18 155 / 30%)",
                }}
              >
                {responsePublishing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : responseApproved ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Zap size={14} />
                )}
                {responsePublishing
                  ? "Approving…"
                  : responseApproved
                    ? "Response Approved ✓"
                    : "Approve & Post Response"}
              </button>
              {responseApproved && (
                <button
                  type="button"
                  onClick={() => completeStep(2)}
                  data-ocid="recovery.next_step_2"
                  className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  style={{
                    background: "oklch(0.58 0.22 290 / 15%)",
                    color: "oklch(0.78 0.16 290)",
                    border: "1px solid oklch(0.58 0.22 290 / 25%)",
                  }}
                >
                  Next: Resolve Privately <ChevronRight size={12} />
                </button>
              )}
            </div>
          )}

          {/* STEP 3: Resolve Privately */}
          {step === 3 && (
            <div
              className="space-y-4 animate-fade-in"
              data-ocid="recovery.step_3"
            >
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Step 3: Resolve Privately
                </p>
                <p className="text-xs text-muted-foreground">
                  A private outreach message to the reviewer is your best chance
                  to turn a 1-star into a 4-star. 63% of negative reviewers will
                  update after a sincere, personal follow-up.
                </p>
              </div>
              <div
                className="rounded-xl p-4 space-y-2"
                style={{
                  background: "oklch(0.16 0.014 280)",
                  border: "1px solid oklch(1 0 0 / 8%)",
                }}
              >
                <p className="text-xs font-semibold text-white">
                  Auto-Generated Private Message
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  "Hi {review.reviewerName}, my name is [Owner Name] and I
                  personally oversee all client experiences at [Business Name].
                  I saw your review and wanted to reach out directly — the
                  experience you described isn't our standard and I'd like to
                  make it right for you personally. Please call or text me at
                  [number] at your convenience. Thank you for giving us the
                  chance to correct this."
                </p>
              </div>
              {isMedical && (
                <p className="text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  For medical practices: respond offline only. Do not confirm
                  patient status in any message.
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={sendPrivateOutreach}
                  data-ocid="recovery.send_outreach_button"
                  disabled={outreachSent}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  style={{
                    background: "oklch(0.58 0.22 290 / 20%)",
                    color: "oklch(0.78 0.16 290)",
                    border: "1px solid oklch(0.58 0.22 290 / 30%)",
                  }}
                >
                  {outreachSent ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Handshake size={14} />
                  )}
                  {outreachSent ? "Outreach Sent ✓" : "Send Private Outreach"}
                </button>
                <button
                  type="button"
                  onClick={() => completeStep(3)}
                  data-ocid="recovery.skip_step_3"
                  className="px-4 py-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors"
                  style={{ border: "1px solid oklch(1 0 0 / 8%)" }}
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Document */}
          {step === 4 && (
            <div
              className="space-y-4 animate-fade-in"
              data-ocid="recovery.step_4"
            >
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Step 4: Document the Incident
                </p>
                <p className="text-xs text-muted-foreground">
                  {niche === "restoration"
                    ? "Restoration jobs with documented timelines are protected in insurance disputes. Log this review with your job file to create a paper trail."
                    : niche === "roofing"
                      ? "Storm-season fake reviews can be contested with documentation. Log this incident — our system will generate a Google My Business flag report."
                      : "Internal documentation protects you if this escalates. A logged record of the incident, your response, and resolution attempts strengthens your position."}
                </p>
              </div>
              <div
                className="rounded-xl p-4 space-y-3"
                style={{
                  background: "oklch(0.16 0.014 280)",
                  border: "1px solid oklch(1 0 0 / 8%)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={13} className="text-purple-400" />
                  <span className="text-xs font-semibold text-white">
                    Incident Log — Auto-Generated
                  </span>
                </div>
                {[
                  {
                    label: "Review Date",
                    value: new Date(review.createdAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    ),
                  },
                  { label: "Reviewer", value: review.reviewerName },
                  {
                    label: "Platform",
                    value:
                      review.platform.charAt(0).toUpperCase() +
                      review.platform.slice(1),
                  },
                  { label: "Rating", value: `${review.rating} / 5 stars` },
                  {
                    label: "Classification",
                    value:
                      classification === "legitimate"
                        ? "Legitimate complaint"
                        : classification === "possible_fake"
                          ? "Possible fake review"
                          : "Suspected competitor attack",
                  },
                  {
                    label: "Response Sent",
                    value: responseApproved ? "Yes — approved" : "Pending",
                  },
                  {
                    label: "Private Outreach",
                    value: outreachSent ? "Yes — sent" : "Not yet",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
              {niche === "roofing" && classification !== "legitimate" && (
                <div
                  className="rounded-xl p-3 flex items-start gap-2.5"
                  style={{
                    background: "oklch(0.62 0.2 15 / 8%)",
                    border: "1px solid oklch(0.62 0.2 15 / 20%)",
                  }}
                >
                  <Flag size={13} className="text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-rose-300 mb-1">
                      Google My Business Flag Report Ready
                    </p>
                    <p className="text-xs text-muted-foreground">
                      A pre-filled complaint with the review text, timestamps,
                      and your documentation has been generated for platform
                      reporting.
                    </p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={documentIncident}
                data-ocid="recovery.document_button"
                disabled={documented}
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                style={{
                  background: "oklch(0.58 0.22 290 / 20%)",
                  color: "oklch(0.78 0.16 290)",
                  border: "1px solid oklch(0.58 0.22 290 / 30%)",
                }}
              >
                {documented ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <ClipboardList size={14} />
                )}
                {documented ? "Documented ✓" : "Save Incident Log"}
              </button>
            </div>
          )}

          {/* STEP 5: Counterbalance */}
          {step === 5 && (
            <div
              className="space-y-4 animate-fade-in"
              data-ocid="recovery.step_5"
            >
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Step 5: Counterbalance the Rating Impact
                </p>
                <p className="text-xs text-muted-foreground">
                  One 1-star review at your current volume drops your average by
                  ~0.08 stars. To fully offset this review's impact, you need{" "}
                  <span className="text-white font-semibold">
                    4 new 5-star reviews
                  </span>
                  . Launch a review request to your last 10 satisfied clients —
                  now.
                </p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{
                  background: "oklch(0.62 0.18 155 / 8%)",
                  border: "1px solid oklch(0.62 0.18 155 / 20%)",
                }}
              >
                <p className="text-xs font-semibold text-white mb-2">
                  Review Request — Last 10 Satisfied Clients
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  BRF will send a personalized review request via SMS and email
                  to the 10 most recent clients with a CRM status of "Completed"
                  or "Satisfied." Message: "Hi [Name], we just wrapped up your
                  [service] — if we did a great job, would you mind sharing a
                  quick review? It means the world to us."
                </p>
              </div>
              <button
                type="button"
                onClick={launchCounterbalance}
                data-ocid="recovery.launch_counterbalance_button"
                disabled={counterLaunched}
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                style={{
                  background: "oklch(0.62 0.18 155 / 20%)",
                  color: "oklch(0.78 0.14 155)",
                  border: "1px solid oklch(0.62 0.18 155 / 30%)",
                }}
              >
                {counterLaunched ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Star size={14} />
                )}
                {counterLaunched
                  ? "Review Request Campaign Launched ✓"
                  : "Launch Review Request to 10 Clients"}
              </button>
              {counterLaunched && (
                <button
                  type="button"
                  onClick={() => completeStep(5)}
                  data-ocid="recovery.next_step_5"
                  className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  style={{
                    background: "oklch(0.58 0.22 290 / 15%)",
                    color: "oklch(0.78 0.16 290)",
                    border: "1px solid oklch(0.58 0.22 290 / 25%)",
                  }}
                >
                  Next: Monitor <ChevronRight size={12} />
                </button>
              )}
            </div>
          )}

          {/* STEP 6: Monitor */}
          {step === 6 && (
            <div
              className="space-y-4 animate-fade-in"
              data-ocid="recovery.step_6"
            >
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Step 6: Monitor the Impact
                </p>
                <p className="text-xs text-muted-foreground">
                  Check back in 48 hours to see if the rating impact has
                  stabilized. If the reviewer updates or removes their review
                  after your private outreach, your score will recover
                  automatically.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: <Calendar size={13} />,
                    label: "48-Hour Check-in",
                    desc: "Scheduled reminder set — we'll alert you if the rating changes.",
                    color: "oklch(0.78 0.16 290)",
                  },
                  {
                    icon: <Star size={13} />,
                    label: "Review Request Status",
                    desc: counterLaunched
                      ? "Review request sent to 10 clients — responses expected in 3–5 days."
                      : "No review request sent yet.",
                    color: "oklch(0.78 0.14 155)",
                  },
                  {
                    icon: <AlertTriangle size={13} />,
                    label: "Velocity Monitor",
                    desc: "If 2+ more negative reviews arrive in 7 days, you'll receive an automatic alert.",
                    color: "oklch(0.82 0.14 55)",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl p-3.5 flex items-start gap-3"
                    style={{
                      background: "oklch(0.16 0.014 280)",
                      border: "1px solid oklch(1 0 0 / 8%)",
                    }}
                  >
                    <span style={{ color: item.color }}>{item.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="rounded-xl p-4"
                style={{
                  background: "oklch(0.62 0.18 155 / 10%)",
                  border: "1px solid oklch(0.62 0.18 155 / 25%)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <p className="text-xs font-bold text-white">
                    Recovery Workflow Complete
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  You responded, resolved privately, documented the incident,
                  and launched a counterbalance campaign. That's the move 95% of
                  local businesses never make — and it's why you'll win
                  long-term.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-ocid="recovery.finish_button"
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{
                  background: "oklch(0.62 0.18 155 / 20%)",
                  color: "oklch(0.78 0.14 155)",
                  border: "1px solid oklch(0.62 0.18 155 / 30%)",
                }}
              >
                <CheckCircle2 size={14} />
                Done — Close Recovery Workflow
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
