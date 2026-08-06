import { useApp } from "@/context/AppContext";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarCheck2,
  CheckCircle,
  CircleDashed,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SmsState = "idle" | "sending" | "sent" | "preview" | "error";

type StoredAudit = {
  mode?: "live" | "unreachable" | "no_website";
  result?: unknown;
  error?: string;
};

const ACTIVATION_STEPS = [
  { label: "Website audit completed", icon: Sparkles },
  { label: "Lead captured in CRM", icon: Users },
  { label: "Estimate booked", icon: CalendarCheck2 },
  { label: "Owner alert prepared", icon: MessageSquareText },
  { label: "AI receptionist online", icon: Bot },
];

function getClientSessionId(): string {
  const existing = sessionStorage.getItem("brfClientSessionId");
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem("brfClientSessionId", created);
  return created;
}

function readAudit(): StoredAudit | null {
  try {
    const raw = sessionStorage.getItem("demoWebsiteAudit");
    return raw ? (JSON.parse(raw) as StoredAudit) : null;
  } catch {
    return null;
  }
}

export default function DemoStep8Launch() {
  const navigate = useNavigate();
  const { sessionData } = useDemoFlow();
  const { loginDemo } = useApp();
  const [isOpening, setIsOpening] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [smsState, setSmsState] = useState<SmsState>("idle");
  const [smsConsent, setSmsConsent] = useState(false);
  const [smsError, setSmsError] = useState("");
  const [smsProvider, setSmsProvider] = useState<string | null>(null);
  const [smsMessageId, setSmsMessageId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState(0);

  const demoInfo = useMemo(
    () => ({
      firstName: sessionData.firstName || "there",
      businessName: sessionData.businessName || "Your Business",
      niche: sessionData.niche || "Local Business",
      city: sessionData.city || "Your Market",
    }),
    [
      sessionData.firstName,
      sessionData.businessName,
      sessionData.niche,
      sessionData.city,
    ],
  );

  const appointment = useMemo(
    () => ({
      customerName: "Jennifer Lopez",
      appointmentTime: "Tomorrow at 10:30 AM",
      service: `Free ${demoInfo.niche} estimate`,
      summary:
        "Jennifer requested a free estimate and confirmed she will be available tomorrow morning.",
    }),
    [demoInfo.niche],
  );

  const smsMessage = `Booked Ranked Fundable Demo\nHi ${demoInfo.firstName} — your AI front desk just booked a free estimate for ${demoInfo.businessName}.\n\nCustomer: ${appointment.customerName}\nAppointment: ${appointment.appointmentTime}\nRequest: ${appointment.service}\n\nConversation summary: ${appointment.summary}`;

  useEffect(() => {
    const richerDemoInfo = {
      ...demoInfo,
      appointment,
      website: sessionData.website || "",
    };
    sessionStorage.setItem("brfDemo", JSON.stringify(richerDemoInfo));
    sessionStorage.setItem(
      "brfTrialSession",
      JSON.stringify({ ...richerDemoInfo, isDemoTrial: true }),
    );
    loginDemo(demoInfo);
  }, [appointment, demoInfo, loginDemo, sessionData.website]);

  useEffect(() => {
    if (completedSteps >= ACTIVATION_STEPS.length) return;
    const timer = window.setTimeout(
      () => setCompletedSteps((current) => current + 1),
      completedSteps === 0 ? 350 : 520,
    );
    return () => window.clearTimeout(timer);
  }, [completedSteps]);

  const sendDemoText = async () => {
    if (!smsConsent || !sessionData.phone) return;
    setSmsState("sending");
    setSmsError("");

    try {
      const response = await fetch("/api/send-owner-alert", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          phone: sessionData.phone,
          message: smsMessage,
          consent: smsConsent,
          businessName: demoInfo.businessName,
          source: "brf-demo",
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        status?: "sent" | "preview";
        provider?: string;
        messageId?: string;
        error?: string;
      };
      if (!response.ok || result.ok === false) {
        throw new Error(result.error || "The owner alert could not be sent.");
      }
      setSmsProvider(result.provider || null);
      setSmsMessageId(result.messageId || null);
      setSmsState(result.status === "sent" ? "sent" : "preview");
    } catch (error) {
      setSmsError(
        error instanceof Error
          ? error.message
          : "The text could not be delivered.",
      );
      setSmsState("error");
    }
  };

  const saveDemoSession = async () => {
    const audit = readAudit();
    const response = await fetch("/api/save-demo-session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        clientSessionId: getClientSessionId(),
        firstName: sessionData.firstName,
        businessName: demoInfo.businessName,
        niche: demoInfo.niche,
        city: sessionData.city,
        phone: sessionData.phone,
        email: sessionData.email,
        website: sessionData.website,
        auditStatus: audit?.mode || "sample",
        auditResult: audit?.result || { error: audit?.error || null },
        appointment,
        smsStatus:
          smsState === "sent" || smsState === "preview" || smsState === "error"
            ? smsState === "error"
              ? "failed"
              : smsState
            : "not_requested",
        smsProvider,
        smsMessageId,
        source: "brf-demo",
        metadata: {
          demoVersion: "90-second-live-audit",
          smsConsent,
        },
        completedAt: new Date().toISOString(),
      }),
    });
    const result = (await response.json()) as {
      ok?: boolean;
      id?: string;
      error?: string;
    };
    if (!response.ok || result.ok === false) {
      throw new Error(result.error || "The demo record could not be saved.");
    }
    if (result.id) sessionStorage.setItem("brfDemoSessionRecordId", result.id);
  };

  const enterBackOffice = async () => {
    setIsOpening(true);
    setSaveError("");
    loginDemo(demoInfo);
    try {
      await saveDemoSession();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "The demo record could not be saved.",
      );
    } finally {
      navigate({ to: "/dashboard" });
    }
  };

  const activationComplete = completedSteps === ACTIVATION_STEPS.length;

  return (
    <div className="flex min-h-[calc(100vh-4.75rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 shadow-lg shadow-emerald-950/30">
            {activationComplete ? (
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            ) : (
              <CircleDashed className="h-10 w-10 animate-spin text-cyan-300" />
            )}
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
            {activationComplete
              ? "Your business is live"
              : "Bringing your system online"}
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {demoInfo.businessName}'s back office is ready
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-400 sm:text-base">
            BRF has prepared your audit, appointment, owner alert, and
            personalized workspace.
          </p>
        </div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                System activation
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Live demo workspace for {demoInfo.businessName}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-300">
              {Math.round((completedSteps / ACTIVATION_STEPS.length) * 100)}%
            </span>
          </div>
          <div className="space-y-3">
            {ACTIVATION_STEPS.map((step, index) => {
              const done = index < completedSteps;
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition-all duration-500 ${done ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/5 bg-black/10 opacity-55"}`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${done ? "bg-emerald-500/20" : "bg-white/5"}`}
                  >
                    {done ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Icon className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${done ? "font-medium text-gray-100" : "text-gray-500"}`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-xl bg-blue-500/20 p-2.5">
              <MessageSquareText className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <h2 className="font-semibold text-white">See the owner alert</h2>
              <p className="mt-1 text-sm leading-5 text-gray-400">
                Send one demonstration text to{" "}
                {sessionData.phone || "your phone"}.
              </p>
            </div>
          </div>
          <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
            <input
              type="checkbox"
              checked={smsConsent}
              onChange={(event) => setSmsConsent(event.target.checked)}
              className="mt-1 h-4 w-4 accent-blue-500"
              data-ocid="demo.sms_consent.checkbox"
            />
            <span className="text-xs leading-5 text-gray-300">
              I agree to receive one BRF demonstration text. Standard messaging
              rates may apply.
            </span>
          </label>
          <button
            type="button"
            onClick={sendDemoText}
            disabled={
              !smsConsent || !sessionData.phone || smsState === "sending"
            }
            className="w-full rounded-xl border border-blue-400/40 bg-blue-500/20 px-4 py-3 font-semibold text-blue-100 transition hover:bg-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            data-ocid="demo.send_text.button"
          >
            {smsState === "sending"
              ? "Sending your demo text..."
              : smsState === "sent"
                ? "Text sent — check your phone"
                : smsState === "preview"
                  ? "Text preview ready"
                  : "Send My Demo Text"}
          </button>
          {(smsState === "sent" || smsState === "preview") && (
            <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-gray-200">
              <p className="mb-2 font-semibold text-emerald-300">
                {smsState === "sent"
                  ? "Delivered to your phone"
                  : "SMS delivery preview"}
              </p>
              <p className="whitespace-pre-line leading-5">{smsMessage}</p>
            </div>
          )}
          {smsState === "error" && (
            <p className="mt-3 text-center text-xs text-red-300">{smsError}</p>
          )}
        </div>

        <button
          type="button"
          onClick={enterBackOffice}
          disabled={isOpening || !activationComplete}
          data-ocid="demo.enter_back_office.button"
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-wait disabled:opacity-50"
        >
          <LayoutDashboard className="h-5 w-5" />
          {isOpening
            ? "Saving and opening your back office..."
            : activationComplete
              ? "Enter My Live Back Office"
              : "Finishing setup..."}
          {!isOpening && activationComplete && (
            <ArrowRight className="h-5 w-5" />
          )}
        </button>

        {saveError && (
          <p className="mt-3 text-center text-xs text-amber-300">
            Your dashboard opened, but persistence needs attention: {saveError}
          </p>
        )}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Demo activity is
          saved securely to your BRF back office
        </div>
      </div>
    </div>
  );
}
