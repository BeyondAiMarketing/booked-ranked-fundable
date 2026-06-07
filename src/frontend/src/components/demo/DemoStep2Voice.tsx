import { getDemoContent } from "@/data/demoContentByNiche";
import { getNichePhone } from "@/data/nichePhoneConfig";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import type { SessionData } from "@/hooks/useDemoFlow";
import { useEffect, useState } from "react";

interface Props {
  onNext: () => void;
  onPrev: () => void;
  sessionData: SessionData;
}

export default function DemoStep2Voice({ onNext, sessionData }: Props) {
  const { sessionData: flowData } = useDemoFlow();
  const niche = flowData.niche || sessionData.niche || "";
  const nicheContent = getDemoContent(niche);
  const transcript = nicheContent.voiceScript;
  const coachTip = nicheContent.coachTips.voice;

  const phoneConfig = getNichePhone(niche);

  const [visibleLines, setVisibleLines] = useState(1);
  // ALWAYS enabled — never conditional on audio
  const ready = true;

  const businessName =
    sessionData.businessName || flowData.businessName || "Your Business";

  useEffect(() => {
    if (visibleLines >= transcript.length) return;
    const t = setTimeout(() => setVisibleLines((n) => n + 1), 700);
    return () => clearTimeout(t);
  }, [visibleLines, transcript.length]);

  const isAiSpeaker = (speaker: string) =>
    speaker.toLowerCase().includes("ai") ||
    speaker.toLowerCase().includes("receptionist");

  const formatText = (text: string) => text.replace("{business}", businessName);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/40 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-4">
          AI Receptionist
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Test Your New Voice AI Agent
        </h2>
        <p className="text-gray-300 mt-2 text-sm">
          Books appointments while you sleep, work a roof, or after hours —
          24/7, never misses a call.
        </p>

        {/* Call Now button — gated by niche phone config */}
        <div className="mt-5">
          {phoneConfig ? (
            <>
              {/* Mobile: direct tel link */}
              <a
                href={`tel:${phoneConfig.e164}`}
                data-ocid="demo.step2.call_now_button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base text-white bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/30 transition-all duration-200 md:hidden"
                style={{
                  animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                }}
              >
                <span>📞</span>
                <span>Call Now — {phoneConfig.display}</span>
              </a>
              {/* Desktop: button with tel intent */}
              <div className="hidden md:inline-flex flex-col items-center gap-1">
                <button
                  type="button"
                  data-ocid="demo.step2.call_now_button"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base text-white bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/30 transition-all duration-200"
                  style={{
                    animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                  }}
                  onClick={() => window.open(`tel:${phoneConfig.e164}`)}
                >
                  <span>📞</span>
                  <span>Call Now — {phoneConfig.display}</span>
                </button>
                <p className="text-gray-400 text-xs mt-1">
                  Call from your mobile to experience the live AI agent
                </p>
              </div>
              <p className="text-gray-500 text-xs mt-3 max-w-xs mx-auto">
                You'll experience exactly what your customers hear when they
                call your business after hours.
              </p>
            </>
          ) : (
            <div
              data-ocid="demo.step2.coming_soon"
              className="inline-flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl border border-gray-700/60 bg-gray-900/50"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-base">🔒</span>
                <span className="text-sm font-medium">
                  Live call demo for {niche || "this niche"} coming soon
                </span>
              </div>
              <p className="text-gray-600 text-xs">
                Check back shortly — we're configuring your niche number
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-xs">
        <div className="bg-gray-900 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl">
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <div>
                <p className="text-white text-xs font-semibold">
                  {businessName}
                </p>
                <p className="text-green-400 text-xs">● Live Call</p>
              </div>
            </div>
            <span className="text-gray-400 text-xs">Now</span>
          </div>

          <div className="p-4 space-y-3 min-h-64 max-h-80 overflow-y-auto">
            {transcript.slice(0, visibleLines).map((line, i) => (
              <div
                key={`transcript-${i}-${line.speaker}`}
                className={`flex ${
                  isAiSpeaker(line.speaker) ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    isAiSpeaker(line.speaker)
                      ? "bg-purple-900/60 text-purple-100 rounded-tl-sm"
                      : "bg-gray-700 text-gray-100 rounded-tr-sm"
                  }`}
                >
                  {formatText(line.text)}
                </div>
              </div>
            ))}
            {visibleLines < transcript.length && (
              <div className="flex justify-start">
                <div className="bg-purple-900/40 rounded-2xl px-4 py-2">
                  <span className="text-purple-400 text-sm">•••</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {visibleLines >= transcript.length && (
        <div className="mt-6 mx-auto max-w-xs bg-green-900/30 border border-green-700/40 rounded-2xl p-4 text-center animate-fade-in">
          <div className="text-green-400 text-2xl mb-1">✓</div>
          <p className="text-green-300 font-semibold text-sm">
            Appointment Booked Automatically!
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {businessName} — Confirmed on your calendar
          </p>
        </div>
      )}

      {/* Post-call info callout — only shown when niche has a phone number */}
      {phoneConfig && (
        <div className="mt-6 mx-auto max-w-xs">
          <div
            className="bg-gray-900/70 border border-green-700/40 rounded-2xl p-4"
            style={{ boxShadow: "0 0 18px 2px rgba(34,197,94,0.10)" }}
          >
            <p className="text-white font-semibold text-sm mb-3">
              What happens after your call:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-base leading-none mt-0.5">📱</span>
                <span>
                  You receive a text confirmation — exactly as your customers
                  will
                </span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-base leading-none mt-0.5">📧</span>
                <span>
                  You receive a calendar invite — branded, professional,
                  automatic
                </span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-base leading-none mt-0.5">🚀</span>
                <span>
                  Your AI does this for every customer, every call, 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Coach tip — slide-up bottom banner, never covers content */}
      <div className="mt-4 mx-auto max-w-xs">
        <div className="bg-indigo-950/60 border border-indigo-700/40 rounded-xl px-4 py-3 flex items-start gap-2">
          <span className="text-indigo-400 text-sm mt-0.5">💡</span>
          <p className="text-indigo-200 text-xs leading-relaxed">{coachTip}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {[
          { icon: "📞", label: "24/7 Calls" },
          { icon: "💬", label: "Website Chat" },
          { icon: "📲", label: "Social DMs" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-center"
          >
            <div className="text-lg mb-1">{item.icon}</div>
            <p className="text-gray-300 text-xs">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          data-ocid="demo.step2.next_button"
          type="button"
          disabled={!ready}
          onClick={onNext}
          className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
        >
          Next: Social Media Autopilot →
        </button>
      </div>
    </div>
  );
}
