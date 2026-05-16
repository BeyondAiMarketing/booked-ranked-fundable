import { useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useBrandKit } from "../hooks/useBrandKit";
import {
  type BrandKitProspect,
  NICHE_COLORS,
  NICHE_LABELS,
  NICHE_PAIN_POINTS,
  NICHE_SAMPLE_POSTS,
  NICHE_SOLUTIONS,
  NICHE_TAGLINES,
  computeNicheAuditScore,
  getTrialDaysRemaining,
  getTrialProgress,
} from "../types/brandKit";

// ─── Constants ────────────────────────────────────────────────────────────────

const FEATURE_META: Array<{ key: string; label: string }> = [
  { key: "voice_agent_tested", label: "Tested Your Voice Agent" },
  { key: "website_viewed", label: "Previewed Your Website" },
  { key: "social_calendar", label: "Viewed Social Calendar" },
  { key: "audit_run", label: "Ran Your Audit" },
  { key: "crm_record_opened", label: "Explored CRM & Back Office" },
  { key: "campaign_viewed", label: "Viewed Campaigns" },
  { key: "social_media_connected", label: "Connected Social Media" },
];

const DAY_LABELS = ["Day 1", "Day 3", "Day 5", "Day 7"];
const DAY_VALUES = [1, 3, 5, 7];

const PLATFORM_ICONS: Record<string, string> = {
  fb: "f",
  ig: "◈",
  g: "G",
  li: "in",
};

const NICHE_HERO_GRADIENT: Record<string, string> = {
  plumber: "from-blue-950 via-blue-900/60 to-slate-950",
  "med-spa": "from-purple-950 via-pink-900/40 to-slate-950",
  hvac: "from-orange-950 via-orange-900/50 to-slate-950",
  restoration: "from-emerald-950 via-teal-900/50 to-slate-950",
  "carpet-cleaning": "from-teal-950 via-indigo-900/40 to-slate-950",
  roofing: "from-red-950 via-orange-900/40 to-slate-950",
  "real-estate": "from-amber-950 via-yellow-900/40 to-slate-950",
  mortgage: "from-emerald-950 via-green-900/40 to-slate-950",
  chiropractor: "from-cyan-950 via-sky-900/40 to-slate-950",
  dental: "from-indigo-950 via-violet-900/40 to-slate-950",
};

// Framework badges reference
const _FRAMEWORK_BADGES = ["Brunson", "Deiss", "Hormozi"];

// Niche-specific auto-generated campaign preview posts
const NICHE_CAMPAIGN_POSTS: Record<
  string,
  Array<{ hook: string; body: string; frameworks: string[] }>
> = {
  plumber: [
    {
      hook: "Is your water bill secretly draining your wallet?",
      body: "Most homeowners lose $200+/month to hidden leaks. We scan, fix, and guarantee — same day.",
      frameworks: ["Brunson", "Hormozi"],
    },
    {
      hook: "Before: 4 missed calls. After: Zero missed appointments.",
      body: "Your AI front desk answers every call, qualifies leads, and books jobs automatically.",
      frameworks: ["Deiss"],
    },
    {
      hook: "What if you never missed another service call?",
      body: "67% of callers choose the first business to respond. We make sure that's you.",
      frameworks: ["Brunson", "Deiss"],
    },
    {
      hook: "3 plumbing red flags most homeowners ignore",
      body: "Slow drain? Rusty water? Low pressure? Book a free inspection — limited slots this week.",
      frameworks: ["Hormozi"],
    },
    {
      hook: "Your neighbors rated us ⭐⭐⭐⭐⭐",
      body: "See what 200+ Dallas homeowners say about same-day service with upfront pricing.",
      frameworks: ["Deiss"],
    },
    {
      hook: "Same-day service. No surprise fees. Guaranteed.",
      body: "We show up when we say we will. If we're late, your service is on us.",
      frameworks: ["Hormozi"],
    },
    {
      hook: "Free leak audit — valued at $199 — yours this week",
      body: "Enter your address and we'll scan your system remotely before we arrive.",
      frameworks: ["Brunson", "Hormozi"],
    },
  ],
  "med-spa": [
    {
      hook: "What would you look like 10 years younger — starting today?",
      body: "Our board-certified practitioners create results in one session that last 3-4 months.",
      frameworks: ["Brunson"],
    },
    {
      hook: "Before: tired. After: glowing. Same person, 60 minutes.",
      body: "See real before/afters from clients just like you. No filters, no edits.",
      frameworks: ["Deiss"],
    },
    {
      hook: "3 consultation slots left this week — don't miss yours",
      body: "Our most popular treatments are booking out fast. Secure your transformation now.",
      frameworks: ["Hormozi"],
    },
    {
      hook: "The treatment our clients ask for by name every 4 months",
      body: "Natural-looking results that friends notice but can't quite place. Come find out why.",
      frameworks: ["Brunson"],
    },
    {
      hook: "Why 200+ clients choose us over every spa in the city",
      body: "Clinical precision, luxurious experience, and results that speak for themselves.",
      frameworks: ["Deiss", "Hormozi"],
    },
    {
      hook: "Starting at $12/unit — your refresh starts here",
      body: "Premium aesthetics shouldn't cost a premium. See our full treatment menu and pricing.",
      frameworks: ["Hormozi"],
    },
    {
      hook: "Your skin in 30 days — a promise we stand behind",
      body: "Book your free consultation today. If you don't love it, we'll make it right.",
      frameworks: ["Brunson", "Deiss"],
    },
  ],
  default: [
    {
      hook: "The #1 reason local businesses lose 40% of their leads",
      body: "Nobody answers the phone. Your AI agent fixes that — 24/7, zero missed calls.",
      frameworks: ["Brunson"],
    },
    {
      hook: "Before: chaotic. After: every lead captured and followed up.",
      body: "CRM, voice agent, reviews, and social — all automated and working while you sleep.",
      frameworks: ["Deiss"],
    },
    {
      hook: "What would 50 more booked jobs per month mean to you?",
      body: "That's what BRF clients average in month 3. Start your 7-day trial to see how.",
      frameworks: ["Hormozi"],
    },
    {
      hook: "Your competitors are answering calls in under 10 seconds",
      body: "AI front desk, missed call SMS, and automatic follow-up — yours in 60 seconds.",
      frameworks: ["Brunson", "Deiss"],
    },
    {
      hook: "5 stars, every time — automated",
      body: "Review requests fire after every job. Bad reviews get flagged before they go live.",
      frameworks: ["Hormozi"],
    },
    {
      hook: "Free audit: we scanned your Google presence",
      body: "Here's what's holding your rankings back — and what we can fix in 7 days.",
      frameworks: ["Deiss"],
    },
    {
      hook: "This week only: 7-day trial, everything included, no card",
      body: "Your website, voice agent, CRM, and social calendar — all live in 60 seconds.",
      frameworks: ["Brunson", "Hormozi"],
    },
  ],
};

// ─── Score gauge ───────────────────────────────────────────────────────────────

function ScoreGauge({ label, value }: { label: string; value: number }) {
  const color =
    value >= 70
      ? "oklch(0.62 0.18 155)"
      : value >= 50
        ? "oklch(0.72 0.18 75)"
        : "oklch(0.62 0.2 25)";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color }}>
          {value}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "oklch(1 0 0 / 8%)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Voice Agent Modal ────────────────────────────────────────────────────────

const TRANSCRIPT_LINES = [
  {
    role: "agent",
    key: "l0",
    text: "Hello, thank you for calling! I'm your AI front desk assistant. How can I help you today?",
  },
  {
    role: "caller",
    key: "l1",
    text: "Hi, I need someone to come out and help me as soon as possible.",
  },
  {
    role: "agent",
    key: "l2",
    text: "Absolutely, we can get that taken care of for you. Are you looking for same-day service, or would you prefer to schedule for later this week?",
  },
  { role: "caller", key: "l3", text: "Same-day if possible." },
  {
    role: "agent",
    key: "l4",
    text: "Perfect. We have a slot this afternoon. Let me confirm your name and address to lock it in. What's the best name for this appointment?",
  },
];

function VoiceAgentModal({
  businessName,
  niche,
  onClose,
}: { businessName: string; niche: string; onClose: () => void }) {
  const [phase, setPhase] = useState<"ringing" | "connected" | "transcript">(
    "ringing",
  );
  const nicheLabel = NICHE_LABELS[niche as keyof typeof NICHE_LABELS] ?? niche;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("connected"), 1800);
    const t2 = setTimeout(() => setPhase("transcript"), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "oklch(0 0 0 / 75%)" }}
      data-ocid="voice_agent_modal.dialog"
    >
      <div
        className="card-dark rounded-2xl w-full max-w-md overflow-hidden animate-fade-in-up"
        style={{ border: "1px solid oklch(0.58 0.22 290 / 30%)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.014 280), oklch(0.18 0.02 285))",
            borderBottom: "1px solid oklch(1 0 0 / 8%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: "oklch(0.58 0.22 290 / 20%)" }}
            >
              📞
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {businessName}
              </p>
              <p className="text-xs text-muted-foreground">
                AI {nicheLabel} Agent
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
            data-ocid="voice_agent_modal.close_button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4">
          {phase === "ringing" && (
            <div className="flex flex-col items-center gap-4 py-6 animate-fade-in">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl animate-pulse-glow"
                style={{ backgroundColor: "oklch(0.58 0.22 290 / 20%)" }}
              >
                📲
              </div>
              <p className="text-foreground font-medium">Calling agent…</p>
              <div className="flex gap-1.5">
                {["d0", "d1", "d2"].map((k, i) => (
                  <span
                    key={k}
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          {phase === "connected" && (
            <div className="flex flex-col items-center gap-3 py-4 animate-fade-in">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: "oklch(0.62 0.18 155 / 20%)" }}
              >
                🎙️
              </div>
              <p className="font-semibold text-foreground">Connected</p>
              <p className="text-sm text-muted-foreground">
                Your AI agent is answering…
              </p>
            </div>
          )}
          {phase === "transcript" && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {TRANSCRIPT_LINES.map((line, i) => (
                <div
                  key={line.key}
                  className="flex gap-2.5 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs mt-0.5 ${line.role === "agent" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {line.role === "agent" ? "🤖" : "👤"}
                  </div>
                  <div
                    className={`rounded-xl px-3 py-2 text-sm flex-1 ${line.role === "agent" ? "card-dark text-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {line.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className="px-5 py-4"
          style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <p className="text-xs text-muted-foreground text-center">
            This is your AI agent — already configured for {nicheLabel}{" "}
            businesses.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Social Connect Modal ─────────────────────────────────────────────────────

type SocialPlatform = "facebook" | "instagram" | "linkedin";

interface SocialConnectModalProps {
  platform: SocialPlatform;
  businessName: string;
  onConfirm: () => void;
  onClose: () => void;
}

function SocialConnectModal({
  platform,
  businessName,
  onConfirm,
  onClose,
}: SocialConnectModalProps) {
  const meta: Record<
    SocialPlatform,
    { label: string; icon: string; color: string; bgColor: string }
  > = {
    facebook: {
      label: "Facebook",
      icon: "f",
      color: "oklch(0.62 0.18 240)",
      bgColor: "oklch(0.62 0.18 240 / 15%)",
    },
    instagram: {
      label: "Instagram",
      icon: "◈",
      color: "oklch(0.72 0.18 50)",
      bgColor: "oklch(0.72 0.18 50 / 15%)",
    },
    linkedin: {
      label: "LinkedIn",
      icon: "in",
      color: "oklch(0.62 0.18 220)",
      bgColor: "oklch(0.62 0.18 220 / 15%)",
    },
  };
  const m = meta[platform];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "oklch(0 0 0 / 75%)" }}
      data-ocid="social_connect_modal.dialog"
    >
      <div
        className="card-dark rounded-2xl w-full max-w-sm overflow-hidden animate-fade-in-up"
        style={{ border: "1px solid oklch(0.58 0.22 290 / 30%)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.014 280), oklch(0.18 0.02 285))",
            borderBottom: "1px solid oklch(1 0 0 / 8%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: m.bgColor, color: m.color }}
            >
              {m.icon}
            </div>
            <p className="text-sm font-semibold text-foreground">
              Connect {m.label}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
            data-ocid="social_connect_modal.close_button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            Connecting{" "}
            <span className="font-semibold" style={{ color: m.color }}>
              {m.label}
            </span>{" "}
            for{" "}
            <span className="font-semibold text-foreground">
              {businessName}
            </span>
            's 7-day trial — your first week of campaigns will be auto-generated
            and published automatically.
          </p>
          <div
            className="rounded-xl p-3 space-y-1.5"
            style={{
              backgroundColor: "oklch(0.62 0.18 155 / 8%)",
              border: "1px solid oklch(0.62 0.18 155 / 20%)",
            }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "oklch(0.78 0.14 155)" }}
            >
              What gets auto-created:
            </p>
            <ul className="space-y-1">
              {[
                "7 niche-specific posts scheduled for the week",
                "Platform-optimized formats applied automatically",
                "Framework-driven copy (Brunson / Deiss / Hormozi)",
                "CTA links embedded in every post",
              ].map((item) => (
                <li
                  key={item}
                  className="text-xs text-muted-foreground flex items-start gap-1.5"
                >
                  <span style={{ color: "oklch(0.78 0.14 155)" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="px-5 py-4 flex gap-3"
          style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            data-ocid="social_connect_modal.cancel_button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 font-semibold"
            onClick={onConfirm}
            style={{ backgroundColor: m.color, color: "oklch(0.08 0.01 280)" }}
            data-ocid="social_connect_modal.confirm_button"
          >
            Connect {m.label} →
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Social Connect Section ───────────────────────────────────────────────────

function SocialConnectSection({
  prospect,
  connectedPlatforms,
  onPlatformConnect,
  trialExpired,
}: {
  prospect: BrandKitProspect;
  connectedPlatforms: Record<SocialPlatform, "idle" | "loading" | "connected">;
  onPlatformConnect: (platform: SocialPlatform) => void;
  trialExpired: boolean;
}) {
  const platforms: Array<{
    key: SocialPlatform;
    label: string;
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }> = [
    {
      key: "facebook",
      label: "Facebook",
      icon: "f",
      color: "oklch(0.62 0.18 240)",
      bgColor: "oklch(0.62 0.18 240 / 12%)",
      borderColor: "oklch(0.62 0.18 240 / 30%)",
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: "◈",
      color: "oklch(0.72 0.18 50)",
      bgColor: "oklch(0.72 0.18 50 / 12%)",
      borderColor: "oklch(0.72 0.18 50 / 30%)",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: "in",
      color: "oklch(0.62 0.18 220)",
      bgColor: "oklch(0.62 0.18 220 / 12%)",
      borderColor: "oklch(0.62 0.18 220 / 30%)",
    },
  ];

  const niche = prospect.niche as keyof typeof NICHE_CAMPAIGN_POSTS;

  const anyConnected = Object.values(connectedPlatforms).some(
    (s) => s === "connected",
  );

  return (
    <div
      className="card-dark rounded-2xl overflow-hidden animate-fade-in-up"
      data-ocid="trial.social_connect.card"
    >
      <div
        className="px-5 py-4 flex items-center gap-2.5"
        style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}
      >
        <span className="text-base">📱</span>
        <div className="flex-1">
          <h2 className="font-semibold text-foreground text-sm">
            Connect Your Social Media
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Auto-generate and schedule your first week of content
          </p>
        </div>
        {trialExpired && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{
              backgroundColor: "oklch(0.62 0.2 25 / 15%)",
              color: "oklch(0.82 0.14 25)",
              border: "1px solid oklch(0.62 0.2 25 / 30%)",
            }}
          >
            🔒 Locked
          </span>
        )}
      </div>
      <div className="p-5 space-y-4">
        {/* Platform buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {platforms.map((p) => {
            const state = connectedPlatforms[p.key];
            return (
              <button
                key={p.key}
                type="button"
                disabled={
                  state === "loading" || state === "connected" || trialExpired
                }
                onClick={() => onPlatformConnect(p.key)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
                style={{
                  backgroundColor:
                    state === "connected"
                      ? "oklch(0.62 0.18 155 / 15%)"
                      : p.bgColor,
                  border: `1px solid ${state === "connected" ? "oklch(0.62 0.18 155 / 30%)" : p.borderColor}`,
                  color:
                    state === "connected" ? "oklch(0.78 0.14 155)" : p.color,
                }}
                data-ocid={`trial.social_connect.${p.key}_button`}
              >
                {state === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <span>Connecting…</span>
                  </>
                ) : state === "connected" ? (
                  <>
                    <span className="text-base flex-shrink-0">✓</span>
                    <span>{p.label} Connected</span>
                  </>
                ) : (
                  <>
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: p.bgColor }}
                    >
                      {p.icon}
                    </span>
                    <span>Connect {p.label}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading state */}
        {Object.values(connectedPlatforms).some((s) => s === "loading") && (
          <div
            className="rounded-xl p-3 flex items-center gap-3 animate-fade-in"
            style={{
              backgroundColor: "oklch(0.58 0.22 290 / 8%)",
              border: "1px solid oklch(0.58 0.22 290 / 20%)",
            }}
            data-ocid="trial.social_connect.loading_state"
          >
            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Generating your campaigns and scheduling posts…
            </p>
          </div>
        )}

        {/* Success state + campaign preview */}
        {anyConnected && (
          <div
            className="space-y-3 animate-fade-in"
            data-ocid="trial.social_connect.success_state"
          >
            {platforms
              .filter((p) => connectedPlatforms[p.key] === "connected")
              .map((p) => (
                <div
                  key={p.key}
                  className="rounded-xl p-3 flex items-center gap-3"
                  style={{
                    backgroundColor: "oklch(0.62 0.18 155 / 10%)",
                    border: "1px solid oklch(0.62 0.18 155 / 25%)",
                  }}
                >
                  <span className="text-lg">🎉</span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "oklch(0.78 0.14 155)" }}
                    >
                      7 posts scheduled for {p.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your first week is live!
                    </p>
                  </div>
                </div>
              ))}

            {/* Auto-generated campaign preview */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Auto-Generated Campaign Preview
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {(
                  NICHE_CAMPAIGN_POSTS[niche] ?? NICHE_CAMPAIGN_POSTS.default
                ).map((post, i) => (
                  <div
                    key={post.hook.slice(0, 24)}
                    className="flex-shrink-0 w-52 rounded-xl p-3 space-y-2"
                    style={{
                      backgroundColor: "oklch(1 0 0 / 3%)",
                      border: "1px solid oklch(1 0 0 / 8%)",
                    }}
                    data-ocid={`trial.social_connect.post_preview.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                        Day {i + 1}
                      </span>
                      <div className="flex gap-1">
                        {platforms
                          .filter(
                            (p) => connectedPlatforms[p.key] === "connected",
                          )
                          .slice(0, 2)
                          .map((p) => (
                            <span
                              key={p.key}
                              className="w-4 h-4 rounded text-xs font-bold flex items-center justify-center"
                              style={{
                                backgroundColor: p.bgColor,
                                color: p.color,
                              }}
                            >
                              {p.icon}
                            </span>
                          ))}
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                      {post.hook}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {post.body}
                    </p>
                    <div className="flex gap-1 flex-wrap">
                      {post.frameworks.map((fw) => (
                        <span
                          key={fw}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "oklch(0.58 0.22 290 / 15%)",
                            color: "oklch(0.78 0.16 290)",
                          }}
                        >
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://bookedrankedfunded.org/social-media"
              data-ocid="trial.social_connect.view_schedule_button"
            >
              <Button variant="outline" size="sm" className="w-full gap-2">
                📅 View Full Schedule →
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Content Lock Overlay ─────────────────────────────────────────────────────

function ContentLockOverlay({ upgradeUrl }: { upgradeUrl: string }) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center rounded-2xl"
      style={{
        backgroundColor: "oklch(0.08 0.012 280 / 88%)",
        backdropFilter: "blur(4px)",
      }}
      data-ocid="trial.social_content_lock.overlay"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3"
        style={{
          backgroundColor: "oklch(0.58 0.22 25 / 15%)",
          border: "1px solid oklch(0.58 0.22 25 / 30%)",
        }}
      >
        🔒
      </div>
      <p className="font-bold text-foreground text-base mb-1">
        Your 7-day content creation trial has ended
      </p>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs leading-relaxed">
        Your published content stays live — upgrade to continue creating
      </p>
      <a href={upgradeUrl} data-ocid="trial.social_content_lock.upgrade_button">
        <Button
          className="font-bold px-6 gap-2"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.18 290))",
            boxShadow: "0 0 20px oklch(0.58 0.22 290 / 30%)",
          }}
        >
          🚀 Upgrade to Keep Creating
        </Button>
      </a>
    </div>
  );
}

// ─── Trial Social Status Badge ────────────────────────────────────────────────

function TrialSocialBadge({ daysRemaining }: { daysRemaining: number }) {
  if (daysRemaining <= 0) return null;
  if (daysRemaining === 1) {
    return (
      <span
        className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
        style={{
          backgroundColor: "oklch(0.72 0.18 75 / 15%)",
          color: "oklch(0.87 0.14 75)",
          border: "1px solid oklch(0.72 0.18 75 / 30%)",
        }}
        data-ocid="trial.social_badge.last_day"
      >
        ⚠️ Last Day! Content creation locks tonight
      </span>
    );
  }
  return (
    <span
      className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
      style={{
        backgroundColor: "oklch(0.62 0.18 155 / 15%)",
        color: "oklch(0.78 0.14 155)",
        border: "1px solid oklch(0.62 0.18 155 / 30%)",
      }}
      data-ocid="trial.social_badge.active"
    >
      🟢 7-Day Social Content Trial — Active ({daysRemaining} days remaining)
    </span>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

function ConfettiCelebration() {
  const dots = Array.from({ length: 18 }, (_, i) => i);
  const colors = [
    "oklch(0.58 0.22 290)",
    "oklch(0.62 0.18 155)",
    "oklch(0.72 0.18 75)",
    "oklch(0.62 0.18 240)",
    "oklch(0.72 0.18 50)",
    "oklch(0.62 0.2 25)",
  ];
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {dots.map((i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-bounce"
          style={{
            left: `${(i * 5.5 + 5) % 95}%`,
            top: `${(i * 11 + 5) % 80}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${(i * 0.07).toFixed(2)}s`,
            animationDuration: `${0.6 + (i % 4) * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Tab: Your Website ────────────────────────────────────────────────────────

function WebsiteTab({
  prospect,
  onCustomize,
}: { prospect: BrandKitProspect; onCustomize: () => void }) {
  const nicheLabel =
    NICHE_LABELS[prospect.niche as keyof typeof NICHE_LABELS] ?? prospect.niche;
  const gradient =
    NICHE_HERO_GRADIENT[prospect.niche] ?? "from-primary/20 to-muted";
  const tagline = NICHE_TAGLINES[prospect.niche] ?? "";
  const color = NICHE_COLORS[prospect.niche]?.primary ?? "#7c3aed";

  return (
    <div className="space-y-4" data-ocid="trial.website_tab.panel">
      {/* Hero mock */}
      <div
        className={`rounded-xl overflow-hidden bg-gradient-to-br ${gradient} relative`}
        style={{ border: "1px solid oklch(1 0 0 / 8%)" }}
      >
        {/* Fake nav */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{
            backgroundColor: "oklch(0 0 0 / 30%)",
            borderBottom: "1px solid oklch(1 0 0 / 10%)",
          }}
        >
          <span className="text-xs font-bold text-foreground truncate">
            {prospect.businessName}
          </span>
          <div className="flex gap-3 text-xs text-muted-foreground">
            {["Home", "Services", "About", "Contact"].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
        {/* Hero section */}
        <div className="px-6 py-10 text-center flex flex-col items-center gap-3">
          <span
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {nicheLabel}
          </span>
          <h2 className="text-2xl font-bold text-foreground leading-tight max-w-sm">
            {tagline}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Serving {prospect.city} with 24/7 AI-powered service, booking, and
            support.
          </p>
          <div className="flex gap-3 mt-2">
            <div
              className="px-4 py-2 rounded-lg text-xs font-bold text-foreground"
              style={{ backgroundColor: color }}
            >
              Book Now
            </div>
            <div className="px-4 py-2 rounded-lg text-xs font-medium text-muted-foreground bg-muted">
              Learn More
            </div>
          </div>
        </div>
        {/* Feature strips */}
        <div
          className="grid grid-cols-3 gap-px"
          style={{ backgroundColor: "oklch(1 0 0 / 6%)" }}
        >
          {["24/7 AI Receptionist", "Instant Booking", "5-Star Reviews"].map(
            (feat) => (
              <div
                key={feat}
                className="text-center py-2.5 px-2 text-xs text-muted-foreground"
                style={{ backgroundColor: "oklch(0 0 0 / 20%)" }}
              >
                {feat}
              </div>
            ),
          )}
        </div>
      </div>

      {/* Pain → Solution list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(NICHE_PAIN_POINTS[prospect.niche] ?? []).map((pain, i) => (
          <div
            key={pain}
            className="rounded-xl p-3 space-y-1.5"
            style={{
              backgroundColor: "oklch(0.62 0.2 25 / 8%)",
              border: "1px solid oklch(0.62 0.2 25 / 20%)",
            }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "oklch(0.82 0.14 25)" }}
            >
              ⚠ {pain}
            </p>
            <p className="text-xs text-muted-foreground">
              {NICHE_SOLUTIONS[prospect.niche]?.[i]}
            </p>
          </div>
        ))}
      </div>

      <Button
        className="w-full gap-2"
        onClick={onCustomize}
        data-ocid="trial.website_tab.customize_button"
      >
        🎨 Customize Your Website →
      </Button>
    </div>
  );
}

// ─── Tab: Back Office ─────────────────────────────────────────────────────────

const SIMULATED_LEADS = [
  {
    name: "James Thornton",
    phone: "214-555-0122",
    status: "Hot Lead",
    statusColor: "oklch(0.62 0.18 155)",
  },
  {
    name: "Patricia Nguyen",
    phone: "713-555-0287",
    status: "Needs Follow-up",
    statusColor: "oklch(0.72 0.18 75)",
  },
  {
    name: "Robert Chen",
    phone: "602-555-0341",
    status: "New Inquiry",
    statusColor: "oklch(0.6 0.18 240)",
  },
];

const RECENT_ACTIVITY = [
  { icon: "📞", text: "Inbound call captured and routed", time: "2m ago" },
  { icon: "⭐", text: "New 5-star Google review posted", time: "18m ago" },
  { icon: "📩", text: "Follow-up SMS sent to James T.", time: "45m ago" },
  { icon: "📅", text: "Appointment booked — Thu 2pm", time: "1h ago" },
];

function BackOfficeTab({ prospect }: { prospect: BrandKitProspect }) {
  const auditScore = computeNicheAuditScore(prospect.niche, prospect.city);

  return (
    <div className="space-y-4" data-ocid="trial.back_office_tab.panel">
      {/* Health Score */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{
          backgroundColor: "oklch(0.58 0.22 290 / 8%)",
          border: "1px solid oklch(0.58 0.22 290 / 20%)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Business Health Score
          </span>
          <span
            className="text-2xl font-bold tabular-nums"
            style={{ color: "oklch(0.78 0.16 290)" }}
          >
            {auditScore.overall}
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "oklch(1 0 0 / 8%)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${auditScore.overall}%`,
              background:
                "linear-gradient(90deg, oklch(0.58 0.22 290), oklch(0.62 0.18 155))",
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ScoreGauge label="SEO" value={auditScore.seo} />
          <ScoreGauge label="Conversion" value={auditScore.conversion} />
          <ScoreGauge label="Reputation" value={auditScore.reputation} />
          <ScoreGauge label="Content" value={auditScore.content} />
        </div>
      </div>

      {/* Simulated CRM leads */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Recent Leads
        </p>
        {SIMULATED_LEADS.map((lead, i) => (
          <div
            key={lead.name}
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30"
            data-ocid={`trial.back_office_tab.item.${i + 1}`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {lead.name}
              </p>
              <p className="text-xs text-muted-foreground">{lead.phone}</p>
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                color: lead.statusColor,
                backgroundColor: `${lead.statusColor}18`,
                border: `1px solid ${lead.statusColor}30`,
              }}
            >
              {lead.status}
            </span>
          </div>
        ))}
      </div>

      {/* Recent activity feed */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Live Activity Feed
        </p>
        {RECENT_ACTIVITY.map((item) => (
          <div
            key={item.text}
            className="flex items-start gap-2.5 py-2 px-3 rounded-lg bg-muted/20"
          >
            <span className="text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
            <p className="text-xs text-muted-foreground flex-1">{item.text}</p>
            <span className="text-xs text-muted-foreground/60 flex-shrink-0">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Social Calendar ─────────────────────────────────────────────────────

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const POST_DAY_MAP: Record<number, number> = { 0: 0, 2: 1, 4: 2 };
const PLATFORMS = ["fb", "ig", "g"] as const;

function SocialCalendarTab({
  prospect,
  onSchedule,
}: { prospect: BrandKitProspect; onSchedule: () => void }) {
  const posts = NICHE_SAMPLE_POSTS[prospect.niche] ?? [];
  const color = NICHE_COLORS[prospect.niche]?.primary ?? "#7c3aed";

  return (
    <div className="space-y-4" data-ocid="trial.social_calendar_tab.panel">
      {/* Week grid */}
      <div className="grid grid-cols-7 gap-1">
        {WEEK_DAYS.map((day, idx) => {
          const postIdx = POST_DAY_MAP[idx];
          const hasPost = postIdx !== undefined;
          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{day}</span>
              <div
                className="w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-smooth"
                style={{
                  backgroundColor: hasPost ? `${color}22` : "oklch(1 0 0 / 4%)",
                  border: hasPost
                    ? `1px solid ${color}44`
                    : "1px solid oklch(1 0 0 / 6%)",
                  color: hasPost ? color : "transparent",
                }}
              >
                {hasPost ? "P" : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* Post previews */}
      <div className="space-y-2">
        {posts.slice(0, 3).map((post, i) => (
          <div
            key={post.slice(0, 20)}
            className="flex items-start gap-3 p-3 rounded-xl bg-muted/30"
            data-ocid={`trial.social_calendar_tab.item.${i + 1}`}
          >
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${color}22`, color }}
            >
              {PLATFORM_ICONS[PLATFORMS[i]] ?? "P"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                {["Monday", "Wednesday", "Friday"][i]} ·{" "}
                {["Facebook", "Instagram", "Google Business"][i]}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {post.replace("{businessName}", prospect.businessName)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        3 posts ready to publish • Connect accounts after activating your plan
      </p>
      <Button
        className="w-full gap-2"
        onClick={onSchedule}
        data-ocid="trial.social_calendar_tab.schedule_button"
      >
        🚀 Connect & Schedule All Posts →
      </Button>
    </div>
  );
}

// ─── Tab: Voice Agent ─────────────────────────────────────────────────────────

function VoiceAgentTab({
  prospect,
  onTest,
}: { prospect: BrandKitProspect; onTest: () => void }) {
  const nicheLabel =
    NICHE_LABELS[prospect.niche as keyof typeof NICHE_LABELS] ?? prospect.niche;

  return (
    <div className="space-y-4" data-ocid="trial.voice_agent_tab.panel">
      <div
        className="rounded-xl p-4 space-y-3"
        style={{
          backgroundColor: "oklch(0.58 0.22 290 / 8%)",
          border: "1px solid oklch(0.58 0.22 290 / 20%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: "oklch(0.58 0.22 290 / 20%)" }}
          >
            🤖
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {prospect.businessName}
            </p>
            <p className="text-xs text-muted-foreground">
              {nicheLabel} Inbound Script · 24/7 Active
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Answers in 1 ring", "Qualifies leads", "Books appointments"].map(
            (feat) => (
              <div
                key={feat}
                className="text-center py-2 rounded-lg text-xs text-muted-foreground"
                style={{ backgroundColor: "oklch(1 0 0 / 5%)" }}
              >
                {feat}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          What Your Agent Says
        </p>
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm text-foreground italic">
            "Hello, thank you for calling {prospect.businessName}! I'm the AI
            front desk assistant. Are you calling to schedule a service, get a
            quote, or do you have an urgent issue I can help with today?"
          </p>
        </div>
      </div>

      <Button
        className="w-full font-semibold gap-2 animate-pulse-glow"
        onClick={onTest}
        data-ocid="trial.voice_agent_tab.test_button"
      >
        📞 Test Your AI Voice Agent
      </Button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Connect your Twilio number in Go Live to take this agent fully live.
        Zero setup needed on the agent itself — it's already configured.
      </p>
    </div>
  );
}

// ─── Tab: Campaigns ───────────────────────────────────────────────────────────

const CAMPAIGN_SEQUENCES: Record<
  string,
  Array<{ day: number; subject: string; preview: string }>
> = {
  plumber: [
    {
      day: 1,
      subject: "Is your water bill higher than it should be?",
      preview:
        "Most homeowners are losing 200+ gallons/day to small leaks. Here's the 5-minute check...",
    },
    {
      day: 3,
      subject: "We just fixed 14 of these this week",
      preview:
        "Dripping faucets, running toilets, slow drains — all preventable. See what our clients said...",
    },
    {
      day: 5,
      subject: "Same-day service, no surprise fees",
      preview:
        "Dallas homeowners trust us because we show up when we say we will. Check our availability...",
    },
  ],
  "med-spa": [
    {
      day: 1,
      subject: "Your skin tells a story — let's make it a good one",
      preview:
        "3 clients walked in stressed, walked out glowing — all before noon. Here's what we do...",
    },
    {
      day: 3,
      subject: "Results that last 3-4 months, starting at $12/unit",
      preview:
        "We've helped 200+ clients look refreshed without looking 'done'. See the before/afters...",
    },
    {
      day: 5,
      subject: "One consultation changed everything for her",
      preview:
        "Sarah was hesitant. Now she's back every 4 months. Read her story and book your consult...",
    },
  ],
  hvac: [
    {
      day: 1,
      subject: "It's about to get hot — is your system ready?",
      preview:
        "Pre-season tune-up: $79 full system check before it gets hot. We've prevented 47 breakdowns...",
    },
    {
      day: 3,
      subject: "Same-day emergency slots open RIGHT NOW",
      preview:
        "It's 98° outside and your AC just quit. Don't sweat it out — call before slots fill up...",
    },
    {
      day: 5,
      subject: "'Fair price, didn't try to upsell me' — Mike T.",
      preview:
        "That's the only way we operate. Read the full review and see our availability...",
    },
  ],
  default: [
    {
      day: 1,
      subject: "See what's holding your business back — free audit",
      preview:
        "We ran a quick scan on businesses like yours in your area. The #1 issue surprised us...",
    },
    {
      day: 3,
      subject: "Your competitors are responding in seconds. You?",
      preview:
        "78% of customers choose the first business to respond. Here's how to win that race every time...",
    },
    {
      day: 5,
      subject: "30-day trial, zero commitment, everything included",
      preview:
        "Your website, voice agent, CRM, and social calendar — all ready in 60 seconds. See it now...",
    },
  ],
};

function CampaignsTab({ prospect }: { prospect: BrandKitProspect }) {
  const sequence =
    CAMPAIGN_SEQUENCES[prospect.niche] ?? CAMPAIGN_SEQUENCES.default;

  return (
    <div className="space-y-4" data-ocid="trial.campaigns_tab.panel">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          Your Cold Email Sequence
        </p>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
          5 emails · pre-loaded
        </span>
      </div>

      <div className="space-y-2">
        {sequence.map((email) => (
          <div
            key={`d${email.day}-${email.subject.slice(0, 15)}`}
            className="rounded-xl p-3 space-y-1.5"
            style={{
              backgroundColor: "oklch(1 0 0 / 3%)",
              border: "1px solid oklch(1 0 0 / 8%)",
            }}
            data-ocid={`trial.campaigns_tab.item.${email.day}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                  Day {email.day}
                </span>
                <span className="text-xs font-medium text-foreground">
                  {email.subject}
                </span>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                📧
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-10">
              {email.preview}
            </p>
          </div>
        ))}
        <div
          className="rounded-xl p-3 text-center"
          style={{
            backgroundColor: "oklch(1 0 0 / 2%)",
            border: "1px dashed oklch(1 0 0 / 12%)",
          }}
        >
          <p className="text-xs text-muted-foreground">
            + 2 more emails unlock after activating your plan
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        All sequences are pre-loaded with{" "}
        <span className="text-foreground font-medium">
          {NICHE_LABELS[prospect.niche]}
        </span>
        -specific copy using proven direct response frameworks. Activate to
        connect to your sending domain.
      </p>
    </div>
  );
}

// ─── Day 6 Bottom Banner ──────────────────────────────────────────────────────

function Day6Banner({
  upgradeUrl,
  onDismiss,
}: { upgradeUrl: string; onDismiss: () => void }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in-up"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.12 65), oklch(0.18 0.1 55))",
        borderTop: "2px solid oklch(0.72 0.18 75 / 50%)",
      }}
      data-ocid="trial.day6_banner"
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className="font-bold text-base"
            style={{ color: "oklch(0.92 0.16 75)" }}
          >
            ⚡ Your 7-day trial ends tomorrow — lock in your results now.
          </p>
          <p className="text-xs mt-0.5" style={{ color: "oklch(0.72 0.1 65)" }}>
            Everything you've built is ready to go live. One click to keep it
            all.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a href={upgradeUrl}>
            <Button
              size="sm"
              className="font-bold px-5"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.18 75), oklch(0.62 0.2 60))",
                color: "oklch(0.08 0.01 280)",
                boxShadow: "0 0 20px oklch(0.72 0.18 75 / 40%)",
              }}
              data-ocid="trial.day6_banner.confirm_button"
            >
              Upgrade Now →
            </Button>
          </a>
          <button
            type="button"
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-muted/30"
            aria-label="Dismiss banner"
            data-ocid="trial.day6_banner.close_button"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard content ───────────────────────────────────────────────────

type DemoTab = "website" | "back-office" | "social" | "voice" | "campaigns";

function TrialDashboardContent({
  prospect,
  slug,
}: { prospect: BrandKitProspect; slug: string }) {
  const { activateTrial, recordActivity } = useBrandKit();
  const [activeTab, setActiveTab] = useState<DemoTab>("website");
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const initialized = useRef(false);

  // Social connect state
  const [socialConnectPlatform, setSocialConnectPlatform] =
    useState<SocialPlatform | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<
    Record<SocialPlatform, "idle" | "loading" | "connected">
  >({
    facebook: "idle",
    instagram: "idle",
    linkedin: "idle",
  });
  const [socialMediaConnected, setSocialMediaConnected] = useState(false);

  const bannerKey = `brf_trial_banner_dismissed_${slug}`;

  // On mount: check banner dismissal, record activity
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const stored = sessionStorage.getItem(bannerKey);
    if (stored === "1") setBannerDismissed(true);
    recordActivity(slug, "trial_dashboard");
  }, [bannerKey, recordActivity, slug]);

  const nicheLabel =
    NICHE_LABELS[prospect.niche as keyof typeof NICHE_LABELS] ?? prospect.niche;
  const daysRemaining = getTrialDaysRemaining(prospect);
  const trialProgress = getTrialProgress(prospect);
  const upgradeUrl = `https://bookedrankedfunded.org/setup?utm_source=trial&utm_medium=dashboard&utm_campaign=day${prospect.trialDay}-cta`;
  const isDay6Plus = prospect.trialStatus === "Active" && daysRemaining <= 1;
  const trialExpired = prospect.trialStatus === "Expired" || daysRemaining <= 0;

  // Day 6 banner logic: show if Active + Day6+ AND not permanently hidden
  const showDay6Banner =
    isDay6Plus &&
    !bannerDismissed &&
    prospect.trialStatus !== "Converted" &&
    prospect.trialStatus !== "Expired";

  const handleDismissBanner = useCallback(() => {
    setBannerDismissed(true);
    sessionStorage.setItem(bannerKey, "1");
  }, [bannerKey]);

  // On next mount, always re-check and show if still active trial Day 6
  useEffect(() => {
    if (
      prospect.trialStatus === "Converted" ||
      prospect.trialStatus === "Expired"
    ) {
      sessionStorage.removeItem(bannerKey);
    } else if (isDay6Plus) {
      const stored = sessionStorage.getItem(bannerKey);
      if (stored === "1") {
        setBannerDismissed(true);
      } else {
        setBannerDismissed(false);
      }
    }
  }, [isDay6Plus, prospect.trialStatus, bannerKey]);

  const handleTabChange = useCallback(
    (tab: DemoTab) => {
      setActiveTab(tab);
      const activityMap: Partial<Record<DemoTab, string>> = {
        website: "website_viewed",
        "back-office": "crm_record_opened",
        social: "social_calendar",
        voice: "voice_agent_tested",
        campaigns: "campaign_viewed",
      };
      const activity = activityMap[tab];
      if (activity) recordActivity(slug, activity);
    },
    [recordActivity, slug],
  );

  const handleVoiceTest = useCallback(() => {
    recordActivity(slug, "voice_agent_tested");
    setVoiceModalOpen(true);
    if (prospect.trialStatus === "NotStarted")
      activateTrial(slug, "voice_agent_tested");
  }, [recordActivity, slug, prospect.trialStatus, activateTrial]);

  const handleWebsiteCustomize = useCallback(() => {
    recordActivity(slug, "website_viewed");
  }, [recordActivity, slug]);

  const handleSchedulePosts = useCallback(() => {
    recordActivity(slug, "social_calendar");
  }, [recordActivity, slug]);

  // Social connect handlers
  const handlePlatformConnectClick = useCallback((platform: SocialPlatform) => {
    setSocialConnectPlatform(platform);
  }, []);

  const handlePlatformConnectConfirm = useCallback(() => {
    if (!socialConnectPlatform) return;
    const platform = socialConnectPlatform;
    setSocialConnectPlatform(null);
    setConnectedPlatforms((prev) => ({ ...prev, [platform]: "loading" }));
    setTimeout(() => {
      setConnectedPlatforms((prev) => ({ ...prev, [platform]: "connected" }));
      setSocialMediaConnected(true);
      recordActivity(slug, "social_media_connected");
    }, 2000);
  }, [socialConnectPlatform, recordActivity, slug]);

  const tabs: Array<{ id: DemoTab; label: string; icon: string }> = [
    { id: "website", label: "Your Website", icon: "🌐" },
    { id: "back-office", label: "Back Office", icon: "📊" },
    { id: "social", label: "Social Calendar", icon: "📅" },
    { id: "voice", label: "Voice Agent", icon: "🎙️" },
    { id: "campaigns", label: "Campaigns", icon: "📧" },
  ];

  // Include social_media_connected in feature tracker
  const allFeaturesUsed = [
    ...prospect.featuresUsed,
    ...(socialMediaConnected ? ["social_media_connected"] : []),
  ];
  const exploredCount = FEATURE_META.filter((f) =>
    allFeaturesUsed.includes(f.key),
  ).length;
  const allFeaturesComplete = exploredCount === FEATURE_META.length;

  return (
    <div
      className="min-h-screen bg-background"
      style={{ paddingBottom: showDay6Banner ? "80px" : undefined }}
    >
      {/* Smart trial banner */}
      {prospect.trialStatus === "NotStarted" && (
        <div
          className="w-full px-4 py-3 flex items-center justify-center gap-3 text-sm font-medium animate-fade-in-down"
          style={{
            backgroundColor: "oklch(0.62 0.18 155 / 15%)",
            borderBottom: "1px solid oklch(0.62 0.18 155 / 30%)",
            color: "oklch(0.78 0.14 155)",
          }}
          data-ocid="trial.banner"
        >
          <span>🟢</span>
          <span>
            Your trial hasn't started yet — explore any tab below to start your
            7-day clock.
          </span>
        </div>
      )}

      {prospect.trialStatus === "Active" && !isDay6Plus && (
        <div
          className="w-full px-4 py-2 animate-fade-in-down"
          style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}
          data-ocid="trial.banner"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Day {prospect.trialDay} of 7
              </span>
              <span>·</span>
              <span>{daysRemaining} days remaining</span>
            </div>
            <div className="flex-1 max-w-48 hidden sm:block">
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "oklch(1 0 0 / 8%)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${trialProgress}%`,
                    backgroundColor: "oklch(0.58 0.22 290)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {prospect.trialStatus === "Expired" && (
        <div
          className="w-full px-4 py-3 flex items-center justify-center gap-3 text-sm font-medium animate-fade-in-down"
          style={{
            backgroundColor: "oklch(0.58 0.22 25 / 15%)",
            borderBottom: "1px solid oklch(0.58 0.22 25 / 30%)",
            color: "oklch(0.82 0.14 25)",
          }}
          data-ocid="trial.expired_banner"
        >
          <span>⏱️</span>
          <span>Your trial has ended.</span>
          <a
            href={upgradeUrl}
            className="underline font-semibold hover:opacity-80 transition-opacity"
            data-ocid="trial.expired_banner.link"
          >
            Upgrade to unlock full access →
          </a>
        </div>
      )}

      {/* Header */}
      <header
        className="header-dark sticky top-0 z-40"
        data-ocid="trial.header"
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: "oklch(0.58 0.22 290 / 20%)" }}
            >
              {prospect.businessName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-foreground truncate text-sm sm:text-base">
                {prospect.businessName}
              </h1>
              <p className="text-xs text-muted-foreground">
                {nicheLabel} · {prospect.city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {prospect.trialDay > 0 && (
              <Badge className="badge-purple text-xs">
                Day {prospect.trialDay} of 7
              </Badge>
            )}
            <a href={upgradeUrl}>
              <Button
                size="sm"
                className="text-xs hidden sm:flex"
                data-ocid="trial.header.upgrade_button"
              >
                Upgrade
              </Button>
            </a>
          </div>
        </div>
        {prospect.trialStatus === "NotStarted" && (
          <div
            className="max-w-5xl mx-auto px-4 pb-2"
            style={{ borderTop: "1px solid oklch(1 0 0 / 5%)" }}
          >
            <p className="text-xs text-muted-foreground">
              {prospect.firstName}, your app is ready — click any tab below to
              explore and start your free trial
            </p>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Col 1: Tabs + Social Connect ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tab nav */}
            <div
              className="flex items-center gap-1 overflow-x-auto scrollbar-none p-1 rounded-xl bg-muted/30"
              data-ocid="trial.tabs"
            >
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`trial.tab.${tab.id}`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {allFeaturesUsed.includes(
                    tab.id === "website"
                      ? "website_viewed"
                      : tab.id === "back-office"
                        ? "crm_record_opened"
                        : tab.id === "social"
                          ? "social_calendar"
                          : tab.id === "voice"
                            ? "voice_agent_tested"
                            : "campaign_viewed",
                  ) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div
              className="card-dark rounded-2xl overflow-hidden animate-fade-in-up"
              data-ocid="trial.tab_content.panel"
            >
              <div className="p-5">
                {activeTab === "website" && (
                  <WebsiteTab
                    prospect={prospect}
                    onCustomize={handleWebsiteCustomize}
                  />
                )}
                {activeTab === "back-office" && (
                  <BackOfficeTab prospect={prospect} />
                )}
                {activeTab === "social" && (
                  <SocialCalendarTab
                    prospect={prospect}
                    onSchedule={handleSchedulePosts}
                  />
                )}
                {activeTab === "voice" && (
                  <VoiceAgentTab prospect={prospect} onTest={handleVoiceTest} />
                )}
                {activeTab === "campaigns" && (
                  <CampaignsTab prospect={prospect} />
                )}
              </div>
            </div>

            {/* Social Connect Section — always visible on trial */}
            <div className="relative">
              {trialExpired && <ContentLockOverlay upgradeUrl={upgradeUrl} />}
              <SocialConnectSection
                prospect={prospect}
                connectedPlatforms={connectedPlatforms}
                onPlatformConnect={handlePlatformConnectClick}
                trialExpired={trialExpired}
              />
            </div>

            {/* Trial Social Status Badge */}
            {prospect.trialStatus === "Active" && daysRemaining > 0 && (
              <div className="flex justify-center">
                <TrialSocialBadge daysRemaining={daysRemaining} />
              </div>
            )}

            {/* Activate CTA (prominent for NotStarted) */}
            {prospect.trialStatus === "NotStarted" && (
              <div
                className="rounded-2xl p-5 text-center space-y-3 animate-fade-in-up"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 290 / 12%), oklch(0.48 0.16 290 / 8%))",
                  border: "1px solid oklch(0.58 0.22 290 / 25%)",
                }}
                data-ocid="trial.activate.card"
              >
                <p className="font-bold text-foreground">
                  Activate Your 7-Day Free Trial
                </p>
                <p className="text-sm text-muted-foreground">
                  Your clock only starts when you take a real action. Explore
                  freely — activate when you're ready.
                </p>
                <a href={upgradeUrl}>
                  <Button
                    size="lg"
                    className="font-bold px-8 animate-pulse-glow"
                    data-ocid="trial.activate.primary_button"
                  >
                    Activate Free Trial →
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* ── Col 2: Sidebar ── */}
          <div className="space-y-4">
            {/* Exploration progress */}
            <div
              className="card-dark rounded-2xl overflow-hidden animate-fade-in-up"
              data-ocid="trial.features_explored.card"
            >
              <div
                className="px-5 py-4 flex items-center gap-2.5"
                style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}
              >
                <span className="text-base">✅</span>
                <h2 className="font-semibold text-foreground text-sm">
                  What You've Explored
                </h2>
                {allFeaturesComplete && (
                  <span
                    className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full animate-pulse-glow"
                    style={{
                      backgroundColor: "oklch(0.62 0.18 155 / 20%)",
                      color: "oklch(0.78 0.14 155)",
                      border: "1px solid oklch(0.62 0.18 155 / 30%)",
                    }}
                  >
                    🎉 Complete!
                  </span>
                )}
              </div>
              <div className="p-5 space-y-3">
                {/* Confetti on complete */}
                {allFeaturesComplete && (
                  <div className="relative h-8">
                    <ConfettiCelebration />
                    <p
                      className="text-xs text-center font-semibold"
                      style={{ color: "oklch(0.78 0.14 155)" }}
                    >
                      Trial Complete! You've explored everything.
                    </p>
                  </div>
                )}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {exploredCount} of {FEATURE_META.length}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: "oklch(1 0 0 / 8%)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(exploredCount / FEATURE_META.length) * 100}%`,
                        backgroundColor: allFeaturesComplete
                          ? "oklch(0.62 0.18 155)"
                          : "oklch(0.58 0.22 290)",
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {FEATURE_META.map((f, i) => {
                    const done = allFeaturesUsed.includes(f.key);
                    return (
                      <div
                        key={f.key}
                        className="flex items-center gap-2.5 py-1"
                        data-ocid={`trial.features_explored.item.${i + 1}`}
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                          style={{
                            backgroundColor: done
                              ? "oklch(0.62 0.18 155 / 20%)"
                              : "oklch(1 0 0 / 5%)",
                            color: done
                              ? "oklch(0.78 0.14 155)"
                              : "oklch(0.4 0.01 280)",
                          }}
                        >
                          {done ? "✓" : "·"}
                        </div>
                        <span
                          className={`text-xs ${done ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {f.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Trial status */}
            <div
              className="card-dark rounded-2xl overflow-hidden animate-fade-in-up"
              data-ocid="trial.status.card"
            >
              <div
                className="px-5 py-4 flex items-center gap-2.5"
                style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}
              >
                <span className="text-base">⏱️</span>
                <h2 className="font-semibold text-foreground text-sm">
                  Trial Status
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between relative">
                  <div
                    className="absolute left-4 right-4 top-3 h-px"
                    style={{ backgroundColor: "oklch(1 0 0 / 10%)" }}
                  />
                  {DAY_LABELS.map((label, i) => {
                    const dayVal = DAY_VALUES[i];
                    const isActive =
                      prospect.trialDay >= dayVal &&
                      (i === DAY_VALUES.length - 1 ||
                        prospect.trialDay < DAY_VALUES[i + 1]);
                    const isPast =
                      i < DAY_VALUES.length - 1 && prospect.trialDay > dayVal;
                    return (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1 relative z-10"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: isActive
                              ? "oklch(0.58 0.22 290)"
                              : isPast
                                ? "oklch(0.62 0.18 155 / 40%)"
                                : "oklch(1 0 0 / 8%)",
                            color: isActive
                              ? "oklch(0.98 0.005 280)"
                              : isPast
                                ? "oklch(0.78 0.14 155)"
                                : "oklch(0.4 0.01 280)",
                            boxShadow: isActive
                              ? "0 0 10px oklch(0.58 0.22 290 / 50%)"
                              : "none",
                          }}
                        >
                          {dayVal}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm text-foreground font-medium">
                    Days remaining:{" "}
                    <span className="tabular-nums">
                      {prospect.trialStatus === "Active"
                        ? daysRemaining
                        : prospect.trialStatus === "NotStarted"
                          ? "7 (not started)"
                          : "0"}
                    </span>
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "oklch(0.65 0.04 290)" }}
                  >
                    ✨ Smart trial: your clock only runs on days you use BRF
                  </p>
                </div>
                <a href={upgradeUrl} className="block">
                  <Button
                    className="w-full text-sm"
                    data-ocid="trial.status.upgrade_button"
                  >
                    Upgrade to Full Access →
                  </Button>
                </a>
              </div>
            </div>

            {/* Nudge emails info */}
            <div
              className="card-dark rounded-2xl overflow-hidden animate-fade-in-up"
              data-ocid="trial.nudge_emails.card"
            >
              <div
                className="px-5 py-4 flex items-center gap-2.5"
                style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}
              >
                <span className="text-base">📧</span>
                <h2 className="font-semibold text-foreground text-sm">
                  Trial Emails
                </h2>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You'll receive 3 automated emails to help you get the most
                  from your trial.
                </p>
                <div className="space-y-2">
                  {[
                    { day: 1, label: "Getting started guide" },
                    { day: 4, label: "What you haven't explored yet" },
                    { day: 6, label: "Lock in your progress" },
                  ].map((email) => {
                    const sent = prospect.trialDay >= email.day;
                    return (
                      <div
                        key={email.day}
                        className="flex items-center gap-2.5"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                          style={{
                            backgroundColor: sent
                              ? "oklch(0.62 0.18 155 / 20%)"
                              : "oklch(1 0 0 / 5%)",
                            color: sent
                              ? "oklch(0.78 0.14 155)"
                              : "oklch(0.4 0.01 280)",
                          }}
                        >
                          {sent ? "✓" : "·"}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Day {email.day}: {email.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="sticky bottom-0 z-30"
        style={{
          backgroundColor: "oklch(0.085 0.012 280)",
          borderTop: "1px solid oklch(1 0 0 / 8%)",
        }}
        data-ocid="trial.bottom_bar"
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs text-muted-foreground">
              📞 Connect Twilio after activating
            </span>
            <span className="text-xs text-muted-foreground">
              📱 Connect social media above
            </span>
          </div>
          <a
            href="mailto:support@bookedrankedfunded.org"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="trial.bottom_bar.help_link"
          >
            Get Help →
          </a>
        </div>
      </footer>

      {/* Modals */}
      {voiceModalOpen && (
        <VoiceAgentModal
          businessName={prospect.businessName}
          niche={prospect.niche}
          onClose={() => setVoiceModalOpen(false)}
        />
      )}

      {socialConnectPlatform && (
        <SocialConnectModal
          platform={socialConnectPlatform}
          businessName={prospect.businessName}
          onConfirm={handlePlatformConnectConfirm}
          onClose={() => setSocialConnectPlatform(null)}
        />
      )}

      {/* Day 6 fixed bottom banner */}
      {showDay6Banner && (
        <Day6Banner upgradeUrl={upgradeUrl} onDismiss={handleDismissBanner} />
      )}
    </div>
  );
}

// ─── Entry ────────────────────────────────────────────────────────────────────

export default function BrandKitTrialDashboardPage() {
  const { slug } = useParams({ from: "/brand-kit/$slug/trial" });
  const { getProspectBySlug, seedDemoProspects } = useBrandKit();

  useEffect(() => {
    seedDemoProspects();
  }, [seedDemoProspects]);

  const prospect = getProspectBySlug(slug);

  if (!prospect) {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6"
        data-ocid="trial.not_found"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: "oklch(0.58 0.22 25 / 15%)" }}
        >
          🔍
        </div>
        <h1 className="text-xl font-bold text-foreground text-center">
          Trial not found
        </h1>
        <p className="text-muted-foreground text-sm text-center max-w-xs">
          This demo link may have expired or the slug is incorrect. Start a new
          trial from our intake page.
        </p>
        <a href="https://bookedrankedfunded.org/brand-kit">
          <Button data-ocid="trial.not_found.cta_button">
            Create Your Brand Kit →
          </Button>
        </a>
      </div>
    );
  }

  return <TrialDashboardContent prospect={prospect} slug={slug} />;
}
