import {
  ArrowDown,
  ArrowUp,
  BarChart2,
  Calculator,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CompetitorEntry {
  id: string;
  name: string;
  totalReviews: number;
  avgRating: number;
  reviewsThisMonth: number;
  trend: "up" | "down" | "flat";
  praises: string[];
  criticisms: string[];
}

// ── Niche competitor data ──────────────────────────────────────────────────────

const NICHE_COMPETITORS: Record<string, CompetitorEntry[]> = {
  "tenant-oceanside": [
    {
      id: "c-001",
      name: "City Best Plumbing",
      totalReviews: 127,
      avgRating: 4.8,
      reviewsThisMonth: 8,
      trend: "up",
      praises: ["Fast response", "Clean workmanship", "Fair pricing"],
      criticisms: ["Hard to reach by phone", "Dispatch delays"],
    },
    {
      id: "c-002",
      name: "ProFlow Services",
      totalReviews: 89,
      avgRating: 4.5,
      reviewsThisMonth: 3,
      trend: "flat",
      praises: ["24/7 availability", "Professional technicians"],
      criticisms: ["Expensive", "Slow for non-emergency"],
    },
  ],
  "tenant-glow": [
    {
      id: "c-003",
      name: "Luxe Aesthetics Studio",
      totalReviews: 214,
      avgRating: 4.9,
      reviewsThisMonth: 12,
      trend: "up",
      praises: ["Incredible results", "Warm staff", "Clean facility"],
      criticisms: ["High price point", "Long booking wait"],
    },
    {
      id: "c-004",
      name: "CityGlow Med Spa",
      totalReviews: 98,
      avgRating: 4.6,
      reviewsThisMonth: 5,
      trend: "flat",
      praises: ["Great botox results", "Professional", "Clean rooms"],
      criticisms: ["Inconsistent technicians", "Hard to park"],
    },
  ],
  "tenant-demo": [
    {
      id: "c-005",
      name: "TopRoofing LLC",
      totalReviews: 167,
      avgRating: 4.7,
      reviewsThisMonth: 15,
      trend: "up",
      praises: ["Fast storm response", "Insurance help", "Quality materials"],
      criticisms: ["Busy during storm season", "Communication gaps"],
    },
    {
      id: "c-006",
      name: "StormShield Roofing",
      totalReviews: 72,
      avgRating: 4.4,
      reviewsThisMonth: 4,
      trend: "down",
      praises: ["Competitive pricing", "Local company"],
      criticisms: ["Crew quality varies", "Slow on paperwork"],
    },
  ],
};

const MY_STATS: Record<
  string,
  {
    totalReviews: number;
    avgRating: number;
    reviewsThisMonth: number;
    niche: string;
  }
> = {
  "tenant-oceanside": {
    totalReviews: 43,
    avgRating: 4.6,
    reviewsThisMonth: 3,
    niche: "Plumbing",
  },
  "tenant-glow": {
    totalReviews: 31,
    avgRating: 4.8,
    reviewsThisMonth: 2,
    niche: "Med Spa",
  },
  "tenant-demo": {
    totalReviews: 58,
    avgRating: 4.5,
    reviewsThisMonth: 6,
    niche: "Roofing",
  },
};

const NICHE_BENCHMARK_COPY: Record<string, string> = {
  "tenant-oceanside":
    "In your area, the top-ranked plumber has 234 reviews at 4.8 stars. That's the benchmark to beat — above 100 reviews triggers the Google 'local authority' boost in map pack rankings.",
  "tenant-glow":
    "The #1 med spa in your zip code has 489 reviews. Trust studies show patients are 4x more likely to book a new provider with 100+ reviews vs. fewer than 50.",
  "tenant-demo":
    "The #1-ranked roofing contractor after the last major storm had 340 reviews. Storm-season lead conversion is dominated by whoever has the most social proof. Reviews are your storm insurance.",
};

const DEFAULT_BENCHMARK =
  "The top-ranked business in your niche has 2–4x your review count. Reviews are now a direct ranking factor — close the gap to capture organic search leads without ad spend.";

// ── Trend icon ─────────────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <ArrowUp size={12} className="text-rose-400" />;
  if (trend === "down")
    return <ArrowDown size={12} className="text-emerald-400" />;
  return <Minus size={12} className="text-muted-foreground" />;
}

// ── Gap Calculator ─────────────────────────────────────────────────────────────

function GapCalculator({
  myTotal,
  topCompetitorTotal,
  weeklyVelocity,
  competitorName,
}: {
  myTotal: number;
  topCompetitorTotal: number;
  weeklyVelocity: number;
  competitorName: string;
}) {
  const [ratePerWeek, setRatePerWeek] = useState(weeklyVelocity);
  const gap = topCompetitorTotal - myTotal;
  const weeksToClose = ratePerWeek > 0 ? Math.ceil(gap / ratePerWeek) : null;

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: "oklch(0.58 0.22 290 / 8%)",
        border: "1px solid oklch(0.58 0.22 290 / 20%)",
      }}
      data-ocid="competitor.gap_calculator"
    >
      <div className="flex items-center gap-2">
        <Calculator size={14} className="text-purple-400" />
        <span className="text-xs font-semibold text-white">
          Review Gap Calculator
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        You have <span className="text-white font-semibold">{myTotal}</span>{" "}
        reviews.{" "}
        <span className="text-white font-semibold">{competitorName}</span> has{" "}
        <span className="text-rose-300 font-semibold">
          {topCompetitorTotal}
        </span>
        . Gap: <span className="text-amber-300 font-bold">{gap} reviews</span>.
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">If you request</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setRatePerWeek((v) => Math.max(1, v - 1))}
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            style={{
              background: "oklch(0.18 0.016 280)",
              border: "1px solid oklch(1 0 0 / 10%)",
            }}
          >
            <Minus size={10} />
          </button>
          <span className="text-sm font-bold text-white w-6 text-center">
            {ratePerWeek}
          </span>
          <button
            type="button"
            onClick={() => setRatePerWeek((v) => v + 1)}
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            style={{
              background: "oklch(0.18 0.016 280)",
              border: "1px solid oklch(1 0 0 / 10%)",
            }}
          >
            <Plus size={10} />
          </button>
        </div>
        <span className="text-xs text-muted-foreground">reviews/week</span>
      </div>
      {weeksToClose !== null ? (
        <p
          className="text-xs font-semibold"
          style={{ color: "oklch(0.78 0.14 155)" }}
        >
          You'll surpass {competitorName} in{" "}
          <span className="text-white">
            {weeksToClose < 52
              ? `${weeksToClose} weeks`
              : `${Math.ceil(weeksToClose / 52)} year${weeksToClose > 104 ? "s" : ""}`}
          </span>
          .
          {ratePerWeek < 3 && " Increase to 3/week to close the gap 2x faster."}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Set a weekly rate above 0 to see your timeline.
        </p>
      )}
    </div>
  );
}

// ── Add Competitor Row ─────────────────────────────────────────────────────────

function AddCompetitorForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [val, setVal] = useState("");
  function submit() {
    if (!val.trim()) return;
    onAdd(val.trim());
    setVal("");
  }
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Competitor name or Google Maps URL"
        data-ocid="competitor.add_input"
        className="flex-1 text-xs px-3 py-2 rounded-lg"
        style={{
          background: "oklch(0.16 0.014 280)",
          border: "1px solid oklch(1 0 0 / 12%)",
          color: "oklch(0.9 0.01 280)",
        }}
      />
      <button
        type="button"
        onClick={submit}
        data-ocid="competitor.add_button"
        className="text-xs px-3 py-2 rounded-lg font-medium transition-colors"
        style={{
          background: "oklch(0.58 0.22 290 / 15%)",
          color: "oklch(0.78 0.16 290)",
          border: "1px solid oklch(0.58 0.22 290 / 30%)",
        }}
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function CompetitorReviewPanel({
  tenantId,
}: { tenantId: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showHighlights, setShowHighlights] = useState<string | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorEntry[]>(
    () => NICHE_COMPETITORS[tenantId] ?? NICHE_COMPETITORS["tenant-demo"],
  );

  const myStats = MY_STATS[tenantId] ?? {
    totalReviews: 43,
    avgRating: 4.6,
    reviewsThisMonth: 3,
    niche: "Your Business",
  };
  const benchmarkCopy = NICHE_BENCHMARK_COPY[tenantId] ?? DEFAULT_BENCHMARK;
  const topCompetitor = competitors.sort(
    (a, b) => b.totalReviews - a.totalReviews,
  )[0];

  function addCompetitor(name: string) {
    if (competitors.length >= 5) {
      toast.error("Maximum 5 competitors tracked.");
      return;
    }
    const newEntry: CompetitorEntry = {
      id: `c-custom-${Date.now()}`,
      name,
      totalReviews: 0,
      avgRating: 0,
      reviewsThisMonth: 0,
      trend: "flat",
      praises: ["Scanning…"],
      criticisms: ["Scanning…"],
    };
    setCompetitors((prev) => [...prev, newEntry]);
    toast.success(`${name} added to competitor tracker`, {
      description: "Scanning their reviews in the background.",
    });
  }

  function removeCompetitor(id: string) {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
  }

  const avgRatingLocal = 4.2;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "oklch(0.13 0.016 280)",
        border: "1px solid oklch(1 0 0 / 10%)",
      }}
      data-ocid="competitor.panel"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
        aria-expanded={!collapsed}
        data-ocid="competitor.toggle"
      >
        <div className="flex items-center gap-3">
          <Target size={15} className="text-purple-400" />
          <span className="text-sm font-semibold text-white">
            Competitor Review Monitor
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "oklch(0.58 0.22 290 / 12%)",
              color: "oklch(0.78 0.16 290)",
            }}
          >
            {competitors.length} tracked
          </span>
        </div>
        {collapsed ? (
          <ChevronDown size={15} className="text-muted-foreground" />
        ) : (
          <ChevronUp size={15} className="text-muted-foreground" />
        )}
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-4">
          {/* Benchmark insight */}
          <div
            className="rounded-xl p-3 text-xs text-muted-foreground leading-relaxed"
            style={{
              background: "oklch(0.72 0.18 55 / 8%)",
              border: "1px solid oklch(0.72 0.18 55 / 20%)",
            }}
          >
            <span className="text-amber-300 font-semibold">
              Industry Benchmark:{" "}
            </span>
            {benchmarkCopy}
          </div>

          {/* Rating comparison */}
          <div className="grid grid-cols-3 gap-2">
            <div
              className="rounded-xl p-3 text-center"
              style={{
                background: "oklch(0.62 0.18 155 / 10%)",
                border: "1px solid oklch(0.62 0.18 155 / 20%)",
              }}
            >
              <p className="text-[10px] text-muted-foreground mb-1">
                Your Rating
              </p>
              <p className="text-xl font-bold text-white">
                {myStats.avgRating.toFixed(1)}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
                +{(myStats.avgRating - avgRatingLocal).toFixed(1)} vs avg
              </p>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{
                background: "oklch(0.12 0.012 280)",
                border: "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              <p className="text-[10px] text-muted-foreground mb-1">
                Local Average
              </p>
              <p className="text-xl font-bold text-muted-foreground">
                {avgRatingLocal.toFixed(1)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Keep above 4.5
              </p>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={
                topCompetitor && topCompetitor.avgRating > myStats.avgRating
                  ? {
                      background: "oklch(0.62 0.2 15 / 8%)",
                      border: "1px solid oklch(0.62 0.2 15 / 20%)",
                    }
                  : {
                      background: "oklch(0.62 0.18 155 / 8%)",
                      border: "1px solid oklch(0.62 0.18 155 / 20%)",
                    }
              }
            >
              <p className="text-[10px] text-muted-foreground mb-1">
                Top Competitor
              </p>
              <p className="text-xl font-bold text-white">
                {topCompetitor?.avgRating.toFixed(1) ?? "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                {topCompetitor?.name ?? "—"}
              </p>
            </div>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto" data-ocid="competitor.table">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}>
                  {["Business", "Reviews", "Rating", "This Month", "Trend"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-2 pr-3 text-muted-foreground font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {/* My row */}
                <tr style={{ borderBottom: "1px solid oklch(1 0 0 / 5%)" }}>
                  <td className="py-2.5 pr-3">
                    <span className="font-semibold text-white">You</span>
                    <span
                      className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{
                        background: "oklch(0.62 0.18 155 / 15%)",
                        color: "oklch(0.78 0.14 155)",
                      }}
                    >
                      {myStats.niche}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 font-semibold text-white">
                    {myStats.totalReviews}
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="font-semibold text-white">
                      {myStats.avgRating.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-white">
                    +{myStats.reviewsThisMonth}
                  </td>
                  <td className="py-2.5 pr-3">
                    <TrendingUp size={12} className="text-emerald-400" />
                  </td>
                  <td className="py-2.5" />
                </tr>
                {/* Competitor rows */}
                {competitors.map((comp) => {
                  const isAhead = comp.totalReviews > myStats.totalReviews;
                  return (
                    <tr
                      key={comp.id}
                      style={{ borderBottom: "1px solid oklch(1 0 0 / 5%)" }}
                    >
                      <td className="py-2.5 pr-3">
                        <button
                          type="button"
                          onClick={() =>
                            setShowHighlights(
                              showHighlights === comp.id ? null : comp.id,
                            )
                          }
                          data-ocid={`competitor.row.${comp.id}`}
                          className="text-left hover:text-white text-muted-foreground transition-colors"
                        >
                          <span className="font-medium">{comp.name}</span>
                          <BarChart2
                            size={10}
                            className="inline ml-1 opacity-50"
                          />
                        </button>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span
                          className={`font-semibold ${isAhead ? "text-rose-300" : "text-emerald-300"}`}
                        >
                          {comp.totalReviews}
                        </span>
                        {isAhead && (
                          <ArrowUp
                            size={10}
                            className="inline ml-0.5 text-rose-400"
                          />
                        )}
                        {!isAhead && (
                          <ArrowDown
                            size={10}
                            className="inline ml-0.5 text-emerald-400"
                          />
                        )}
                      </td>
                      <td className="py-2.5 pr-3 font-semibold text-white">
                        {comp.avgRating.toFixed(1)}
                      </td>
                      <td className="py-2.5 pr-3 text-muted-foreground">
                        +{comp.reviewsThisMonth}
                      </td>
                      <td className="py-2.5 pr-3">
                        <TrendIcon trend={comp.trend} />
                      </td>
                      <td className="py-2.5">
                        <button
                          type="button"
                          onClick={() => removeCompetitor(comp.id)}
                          data-ocid={`competitor.remove.${comp.id}`}
                          aria-label="Remove competitor"
                          className="p-1 rounded text-muted-foreground hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Competitor review highlights */}
          {showHighlights &&
            (() => {
              const comp = competitors.find((c) => c.id === showHighlights);
              if (!comp) return null;
              return (
                <div
                  className="rounded-xl p-3.5 animate-fade-in"
                  style={{
                    background: "oklch(0.12 0.012 280)",
                    border: "1px solid oklch(1 0 0 / 8%)",
                  }}
                  data-ocid="competitor.highlights"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">
                      {comp.name} — Customer Insights
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowHighlights(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-emerald-400 mb-1.5 font-semibold">
                        What customers praise
                      </p>
                      <ul className="space-y-1">
                        {comp.praises.map((p) => (
                          <li
                            key={p}
                            className="text-xs text-muted-foreground flex items-center gap-1.5"
                          >
                            <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-rose-400 mb-1.5 font-semibold">
                        Gaps you can exploit
                      </p>
                      <ul className="space-y-1">
                        {comp.criticisms.map((c) => (
                          <li
                            key={c}
                            className="text-xs text-muted-foreground flex items-center gap-1.5"
                          >
                            <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* Gap calculator */}
          {topCompetitor && (
            <GapCalculator
              myTotal={myStats.totalReviews}
              topCompetitorTotal={topCompetitor.totalReviews}
              weeklyVelocity={
                myStats.reviewsThisMonth <= 4
                  ? 3
                  : Math.round(myStats.reviewsThisMonth / 4)
              }
              competitorName={topCompetitor.name}
            />
          )}

          {/* Add competitor */}
          {competitors.length < 5 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Track up to 5 competitors ({5 - competitors.length} remaining)
              </p>
              <AddCompetitorForm onAdd={addCompetitor} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
