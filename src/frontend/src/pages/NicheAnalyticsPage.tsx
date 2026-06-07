/**
 * NicheAnalyticsPage — Niche Performance Analytics dashboard.
 * Shows conversion funnels, top performer, and lead quality by source.
 */

import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NicheConversionData {
  niche: string;
  demos_started: bigint;
  trials_activated: bigint;
  paid_customers: bigint;
}

interface SourceQualityData {
  source: string;
  total_leads: bigint;
  trials_converted: bigint;
  paid_converted: bigint;
  avg_quality_score: number;
}

function clampPct(num: number, denom: number): number {
  if (denom === 0) return 0;
  return Math.min(100, (num / denom) * 100);
}

function ScoreBadge({ score }: { score: number }) {
  if (score > 70)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-900/50 text-green-400">
        {score.toFixed(1)}
      </span>
    );
  if (score >= 40)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-900/50 text-yellow-400">
        {score.toFixed(1)}
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-900/50 text-red-400">
      {score.toFixed(1)}
    </span>
  );
}

function FunnelBar({
  label,
  value,
  max,
  color,
  ratioLabel,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  ratioLabel?: string;
}) {
  const pct = clampPct(value, max);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <div className="flex items-center gap-2">
          {ratioLabel && (
            <span className="text-gray-500 text-xs">{ratioLabel}</span>
          )}
          <span className="text-white font-medium">
            {value.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NicheAnalyticsPage() {
  const { actor, isFetching } = useActor();
  const [funnels, setFunnels] = useState<NicheConversionData[]>([]);
  const [topNiche, setTopNiche] = useState<NicheConversionData | null>(null);
  const [leadQuality, setLeadQuality] = useState<SourceQualityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || isFetching) return;
    let cancelled = false;
    async function load() {
      try {
        const [rawFunnels, rawTop, rawQuality] = await Promise.all([
          (actor as any).getNicheConversionFunnels() as Promise<
            NicheConversionData[]
          >,
          (actor as any).getTopPerformingNiche() as Promise<
            NicheConversionData[]
          >,
          (actor as any).getLeadQualityBySource() as Promise<
            SourceQualityData[]
          >,
        ]);
        if (cancelled) return;
        setFunnels(rawFunnels ?? []);
        setTopNiche(rawTop?.[0] ?? null);
        setLeadQuality(rawQuality ?? []);
      } catch {
        // noop — show empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  return (
    <div
      className="min-h-screen p-6 bg-gray-950"
      data-ocid="niche-analytics.page"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
          Niche Performance Analytics
        </h1>
        <p className="text-gray-400 text-sm">
          Conversion funnels, lead quality scores, and top-performing niches
          across your pipeline.
        </p>
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center min-h-[40vh]"
          data-ocid="niche-analytics.loading_state"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            <span className="text-gray-400 text-sm">Loading analytics...</span>
          </div>
        </div>
      ) : (
        <>
          {/* ── Section 1: Top Performer ─────────────────────────────── */}
          <section className="mb-8" data-ocid="niche-analytics.top_performer">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Top Performer
            </h2>
            {topNiche ? (
              <div
                className="relative rounded-2xl p-6 border border-amber-500/40 bg-gray-900/60"
                style={{
                  boxShadow: "0 0 40px oklch(0.72 0.18 80 / 10%)",
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                        Top Performer
                      </span>
                    </div>
                    <p className="text-3xl font-black text-amber-400 capitalize mb-1">
                      {topNiche.niche}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Best conversion rate across all active niches
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {Number(topNiche.trials_activated).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                        Trials
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">
                        {Number(topNiche.paid_customers).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                        Paid
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400">
                        {Number(topNiche.trials_activated) > 0
                          ? `${(
                              (Number(topNiche.paid_customers) /
                                Number(topNiche.trials_activated)) *
                                100
                            ).toFixed(1)}%`
                          : "—"}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                        Close Rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl p-6 border border-gray-800 bg-gray-900/30 text-center"
                data-ocid="niche-analytics.top_performer.empty_state"
              >
                <p className="text-gray-600 text-sm">
                  No data yet — start sending demos to see your top niche.
                </p>
              </div>
            )}
          </section>

          {/* ── Section 2: Funnel Cards ───────────────────────────────── */}
          <section className="mb-8" data-ocid="niche-analytics.funnel_grid">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Conversion Funnels by Niche
            </h2>
            {funnels.length === 0 ? (
              <div
                className="rounded-2xl p-8 border border-gray-800 bg-gray-900/30 text-center"
                data-ocid="niche-analytics.funnel_grid.empty_state"
              >
                <p className="text-gray-600 text-sm">
                  No funnel data yet. Data appears as demos are started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {funnels.map((item, idx) => {
                  const demosN = Number(item.demos_started);
                  const trialsN = Number(item.trials_activated);
                  const paidN = Number(item.paid_customers);
                  const trialRate =
                    demosN > 0 ? ((trialsN / demosN) * 100).toFixed(1) : "0.0";
                  const closeRate =
                    trialsN > 0 ? ((paidN / trialsN) * 100).toFixed(1) : "0.0";
                  return (
                    <div
                      key={item.niche}
                      className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-700 transition-colors"
                      data-ocid={`niche-analytics.funnel.item.${idx + 1}`}
                    >
                      <p className="text-white font-semibold capitalize text-sm tracking-wide">
                        {item.niche}
                      </p>
                      <div className="flex flex-col gap-2.5">
                        <FunnelBar
                          label="Demos Started"
                          value={demosN}
                          max={demosN}
                          color="bg-blue-500"
                        />
                        <FunnelBar
                          label="Trials Activated"
                          value={trialsN}
                          max={demosN}
                          color="bg-purple-500"
                          ratioLabel={`Trial Rate: ${trialRate}%`}
                        />
                        <FunnelBar
                          label="Paid Customers"
                          value={paidN}
                          max={demosN}
                          color="bg-green-500"
                          ratioLabel={`Close Rate: ${closeRate}%`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Section 3: Lead Quality Table ────────────────────────── */}
          <section data-ocid="niche-analytics.quality_table">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Lead Quality by Source
            </h2>
            {leadQuality.length === 0 ? (
              <div
                className="rounded-2xl p-8 border border-gray-800 bg-gray-900/30 text-center"
                data-ocid="niche-analytics.quality_table.empty_state"
              >
                <p className="text-gray-600 text-sm">
                  No source quality data yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900/80 border-b border-gray-800">
                      <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                        Source
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                        Total
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                        Trials
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                        Paid
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                        Avg Score
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                        Conv Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadQuality.map((row, idx) => {
                      const totalN = Number(row.total_leads);
                      const paidN = Number(row.paid_converted);
                      const convRate =
                        totalN > 0
                          ? `${((paidN / totalN) * 100).toFixed(1)}%`
                          : "0.0%";
                      return (
                        <tr
                          key={row.source}
                          className="border-b border-gray-800/60 bg-gray-950 hover:bg-gray-900/50 transition-colors"
                          data-ocid={`niche-analytics.quality_table.item.${idx + 1}`}
                        >
                          <td className="px-4 py-3 text-white font-medium">
                            {row.source}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-300">
                            {totalN.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-300">
                            {Number(row.trials_converted).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-green-400 font-medium">
                            {paidN.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <ScoreBadge score={row.avg_quality_score} />
                          </td>
                          <td className="px-4 py-3 text-right text-gray-300 font-medium">
                            {convRate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
