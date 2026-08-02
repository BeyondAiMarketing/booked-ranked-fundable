import { useApp } from "@/context/AppContext";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SmsState = "idle" | "sending" | "sent" | "preview" | "error";

export default function DemoStep8Launch() {
  const navigate = useNavigate();
  const { sessionData } = useDemoFlow();
  const { loginDemo } = useApp();
  const [isOpening, setIsOpening] = useState(false);
  const [smsState, setSmsState] = useState<SmsState>("idle");
  const [smsConsent, setSmsConsent] = useState(false);

  const demoInfo = {
    firstName: sessionData.firstName || "there",
    businessName: sessionData.businessName || "Your Business",
    niche: sessionData.niche || "Local Business",
    city: sessionData.city || "Your Market",
  };

  const appointment = useMemo(
    () => ({
      customerName: "Jennifer Lopez",
      appointmentTime: "Tomorrow at 10:30 AM",
      service: `Free ${demoInfo.niche} estimate`,
      summary:
        "Jennifer reported storm-related damage and requested a free estimate. She confirmed she will be available tomorrow morning.",
    }),
    [demoInfo.niche],
  );

  const smsMessage = `Booked Ranked Fundable Demo\nHi ${demoInfo.firstName} — your AI front desk just booked a free estimate for ${demoInfo.businessName}.\n\nCustomer: ${appointment.customerName}\nAppointment: ${appointment.appointmentTime}\nRequest: ${appointment.service}\n\nConversation summary: ${appointment.summary}`;

  useEffect(() => {
    sessionStorage.setItem("brfDemo", JSON.stringify(demoInfo));
    loginDemo(demoInfo);
  }, [demoInfo.businessName, demoInfo.city, demoInfo.firstName, demoInfo.niche, loginDemo]);

  const sendDemoText = async () => {
    if (!smsConsent || !sessionData.phone) return;
    setSmsState("sending");

    const webhookUrl = import.meta.env.VITE_DEMO_SMS_WEBHOOK_URL as
      | string
      | undefined;

    if (!webhookUrl) {
      window.setTimeout(() => setSmsState("preview"), 650);
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: sessionData.phone,
          message: smsMessage,
          businessName: demoInfo.businessName,
          firstName: demoInfo.firstName,
          appointment,
          source: "brf-demo",
        }),
      });

      if (!response.ok) throw new Error("SMS webhook request failed");
      setSmsState("sent");
    } catch {
      setSmsState("error");
    }
  };

  const enterBackOffice = () => {
    setIsOpening(true);
    sessionStorage.setItem("brfDemo", JSON.stringify(demoInfo));
    loginDemo(demoInfo);
    window.setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 150);
  };

  return (
    <div className="flex min-h-[calc(100vh-4.75rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
            Demo complete
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {demoInfo.businessName}'s back office is ready
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-400 sm:text-base">
            Your personalized demo workspace has been loaded with leads, reviews,
            social content, analytics, and funding-readiness tools.
          </p>
        </div>

        <div className="mb-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-xl bg-blue-500/20 p-2.5">
              <MessageSquareText className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <h2 className="font-semibold text-white">See the owner alert</h2>
              <p className="mt-1 text-sm leading-5 text-gray-400">
                Send one demonstration text to {sessionData.phone || "your phone"}
                showing the booked estimate and conversation summary.
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
              I agree to receive one BRF demonstration text at the phone number I
              provided. Standard messaging rates may apply.
            </span>
          </label>

          <button
            type="button"
            onClick={sendDemoText}
            disabled={!smsConsent || !sessionData.phone || smsState === "sending"}
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
            <p className="mt-3 text-center text-xs text-red-300">
              The text could not be delivered. Your back office is still ready.
            </p>
          )}
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Lead and CRM pipeline",
              "AI front desk activity",
              "Social content calendar",
              "Reviews and reputation",
              "Growth analytics",
              "Business credit tools",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={enterBackOffice}
          disabled={isOpening}
          data-ocid="demo.enter_back_office.button"
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-wait disabled:opacity-70"
        >
          <LayoutDashboard className="h-5 w-5" />
          {isOpening ? "Opening your back office..." : "Enter My Back Office"}
          {!isOpening && <ArrowRight className="h-5 w-5" />}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Demo access is ready now — no additional setup screen
        </div>
      </div>
    </div>
  );
}
