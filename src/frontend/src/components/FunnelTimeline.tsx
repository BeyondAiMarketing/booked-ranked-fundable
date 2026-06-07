import { useCallback, useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";

interface FunnelTimelineProps {
  leadId: string;
}

interface FunnelEvent {
  step: string;
  timestamp: bigint;
  metadata: [] | [string];
}

const STEPS: { key: string; label: string }[] = [
  { key: "EmailSent", label: "Email Sent" },
  { key: "EmailOpened", label: "Email Opened" },
  { key: "EmailClicked", label: "Link Clicked" },
  { key: "DemoStarted", label: "Demo Started" },
  { key: "DemoStep1", label: "Demo Step 1" },
  { key: "DemoStep2", label: "Demo Step 2" },
  { key: "DemoStep3", label: "Demo Step 3" },
  { key: "DemoStep4", label: "Demo Step 4" },
  { key: "DemoCompleted", label: "Demo Completed" },
  { key: "TrialActivated", label: "Trial Activated" },
];

export default function FunnelTimeline({ leadId }: FunnelTimelineProps) {
  const { actor } = useActor();
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [stats, setStats] = useState<{
    sent: bigint;
    opened: bigint;
    clicked: bigint;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!actor || !leadId) return;
    setLoading(true);
    try {
      const [tlRes, stRes] = await Promise.all([
        actor.getFunnelTimeline(leadId) as Promise<
          { ok: { events: FunnelEvent[] } } | { err: string }
        >,
        actor.getEmailStats(leadId) as Promise<
          | { ok: { sent: bigint; opened: bigint; clicked: bigint } }
          | { err: string }
        >,
      ]);
      if ("ok" in tlRes) setEvents(tlRes.ok.events ?? []);
      if ("ok" in stRes) setStats(stRes.ok);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [actor, leadId]);

  useEffect(() => {
    load();
  }, [load]);

  const done = new Map<string, FunnelEvent>(events.map((e) => [e.step, e]));

  if (loading)
    return (
      <div className="bg-gray-900/60 border border-white/10 rounded-xl p-5 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-32 mb-2" />
        <div className="h-3 bg-white/10 rounded w-48" />
      </div>
    );

  return (
    <div className="bg-gray-900/60 border border-white/10 rounded-xl p-5">
      <h3 className="text-base font-semibold text-white mb-1">Lead Journey</h3>
      {stats && (
        <p className="text-xs text-slate-400 mb-4">
          {Number(stats.sent)} sent&nbsp;&middot;&nbsp;
          {Number(stats.opened)} opened&nbsp;&middot;&nbsp;
          {Number(stats.clicked)} clicked
        </p>
      )}
      <div className="relative pl-5">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
        <div className="space-y-4">
          {STEPS.map((s) => {
            const ev = done.get(s.key);
            return (
              <div key={s.key} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-3 h-3 rounded-full flex-shrink-0 ${ev ? "bg-yellow-400" : "bg-gray-600"}`}
                />
                <div>
                  <p
                    className={`text-sm font-medium ${ev ? "text-white" : "text-gray-500"}`}
                  >
                    {s.label}
                  </p>
                  {ev && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(
                        Number(ev.timestamp) / 1_000_000,
                      ).toLocaleString()}
                      {ev.metadata.length > 0 && (
                        <span className="ml-1">— {ev.metadata[0]}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
