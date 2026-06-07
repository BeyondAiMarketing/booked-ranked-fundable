import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, RefreshCw, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import RankingHeatMap from "../components/RankingHeatMap";
import { useActor } from "../hooks/useActor";

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function countCells(
  gridPoints: Array<{ rankPosition: bigint; searched: boolean }>,
): { green: number; yellow: number; red: number } {
  let green = 0;
  let yellow = 0;
  let red = 0;
  for (const p of gridPoints) {
    if (!p.searched) continue;
    if (p.rankPosition <= 3n) green++;
    else if (p.rankPosition <= 10n) yellow++;
    else red++;
  }
  return { green, yellow, red };
}

export default function LocalRankingIntelligence() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [leadEmail] = useState("demo@roofinglead.com");

  const auditQuery = useQuery({
    queryKey: ["gridAudit", leadEmail],
    queryFn: () => actor!.getGridAudit(leadEmail),
    enabled: !!actor,
  });

  const historyQuery = useQuery({
    queryKey: ["gridHistory", leadEmail],
    queryFn: () => actor!.getGridHistory(leadEmail),
    enabled: !!actor,
  });

  const rescanMutation = useMutation({
    mutationFn: () => actor!.triggerGridAudit(leadEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gridAudit", leadEmail] });
      queryClient.invalidateQueries({ queryKey: ["gridHistory", leadEmail] });
    },
  });

  const auditResult = (auditQuery.data ?? null) as {
    gridPoints: Array<{
      lat: number;
      lng: number;
      direction: string;
      competitorAtTop: string;
      rankPosition: bigint;
      searched: boolean;
    }>;
    coverageZoneSummary: string;
    scannedAt: bigint;
    city: string;
    leadEmail: string;
    businessName: string;
    state: string;
  } | null;
  const historyList = (historyQuery.data ?? []) as Array<{
    result: {
      gridPoints: Array<{ rankPosition: bigint; searched: boolean }>;
      coverageZoneSummary: string;
      scannedAt: bigint;
      city: string;
    };
    snapshotAt: bigint;
  }>;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Local Ranking Intelligence
        </h1>
        <p className="text-slate-400 mt-1">
          See exactly where you rank on Google Maps — not just at your front
          door.
        </p>
      </div>

      {/* Loading state */}
      {auditQuery.isLoading && (
        <div
          data-ocid="ranking.loading_state"
          className="bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-700 rounded w-48 mx-auto" />
            <div className="h-4 bg-slate-700 rounded w-32 mx-auto" />
          </div>
        </div>
      )}

      {/* No audit yet */}
      {!auditQuery.isLoading && !auditResult && (
        <div
          data-ocid="ranking.empty_state"
          className="bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-10 flex flex-col items-center gap-4"
        >
          <MapPin className="w-10 h-10 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">
            Run your first ranking audit
          </h2>
          <p className="text-slate-400 text-center max-w-sm">
            Find out exactly where customers can find you on Google Maps — and
            where you're invisible.
          </p>
          <button
            data-ocid="ranking.run_audit_button"
            type="button"
            onClick={() => rescanMutation.mutate()}
            disabled={rescanMutation.isPending}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {rescanMutation.isPending ? "Running Audit..." : "Run Audit"}
          </button>
        </div>
      )}

      {/* Audit data present */}
      {auditResult && (
        <>
          {/* Coverage summary */}
          <div className="bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm rounded-xl p-5 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-300 mb-0.5">
                Your Coverage Zone
              </p>
              <p className="text-white font-medium">
                {auditResult.coverageZoneSummary}
              </p>
            </div>
          </div>

          {/* Scan info + rescan */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-slate-400 text-sm">
              Last scanned:{" "}
              <span className="text-slate-200">
                {formatDate(auditResult.scannedAt)}
              </span>
            </span>
            <button
              data-ocid="ranking.rescan_button"
              type="button"
              onClick={() => rescanMutation.mutate()}
              disabled={rescanMutation.isPending}
              title="Uses 9 SerpApi credits"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-sm text-slate-200 rounded-lg transition-colors disabled:opacity-60"
            >
              <RefreshCw
                className={`w-4 h-4 ${rescanMutation.isPending ? "animate-spin" : ""}`}
              />
              {rescanMutation.isPending ? "Scanning..." : "Rescan Now"}
            </button>
          </div>

          {/* Heat map */}
          <div className="bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">
                Ranking Grid — {auditResult.city}
              </h2>
              <label
                htmlFor="competitors-toggle"
                className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer"
              >
                <span>Show Competitors</span>
                <button
                  id="competitors-toggle"
                  data-ocid="ranking.competitors_toggle"
                  type="button"
                  aria-label={
                    showCompetitors ? "Hide competitors" : "Show competitors"
                  }
                  aria-pressed={showCompetitors}
                  className={`relative w-9 h-5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${showCompetitors ? "bg-blue-600" : "bg-slate-600"}`}
                  onClick={() => setShowCompetitors((v) => !v)}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${showCompetitors ? "translate-x-4" : "translate-x-0.5"}`}
                  />
                </button>
              </label>
            </div>
            <RankingHeatMap
              gridPoints={auditResult.gridPoints}
              showCompetitors={showCompetitors}
            />
            <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500/40 inline-block" />{" "}
                Top 3
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-500/40 inline-block" />{" "}
                4\u201310
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-500/40 inline-block" />{" "}
                Not visible
              </span>
            </div>
          </div>

          {/* Snapshot history */}
          {historyList.length > 0 && (
            <div className="bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-5">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Ranking History
              </h2>
              <div className="space-y-3">
                {historyList.slice(0, 4).map((snap) => {
                  const counts = countCells(snap.result.gridPoints);
                  return (
                    <div
                      key={String(snap.snapshotAt)}
                      className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3"
                    >
                      <span className="text-slate-300 text-sm">
                        {formatDate(snap.snapshotAt)}
                      </span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-emerald-400">
                          {counts.green} top 3
                        </span>
                        <span className="text-amber-400">
                          {counts.yellow} mid
                        </span>
                        <span className="text-red-400">
                          {counts.red} invisible
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-1">
              Want to dominate all 9 zones?
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Get a free strategy call and we'll show you exactly how to expand
              your coverage area.
            </p>
            <a
              data-ocid="ranking.strategy_call_link"
              href="/demo"
              className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Book a Free Strategy Call
            </a>
          </div>
        </>
      )}
    </div>
  );
}
