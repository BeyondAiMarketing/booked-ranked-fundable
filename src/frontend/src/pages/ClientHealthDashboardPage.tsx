import { Heart, RefreshCw } from "lucide-react";
import { useState } from "react";
import ClientHealthCard from "../components/ClientHealthCard";
import HealthScoreDetailPanel from "../components/HealthScoreDetailPanel";
import { Button } from "../components/ui/button";
import { useApp } from "../context/AppContext";
import type { ClientHealthScore } from "../types/healthScore";
import { getHealthStatus } from "../types/healthScore";

type SortOption = "score-desc" | "score-asc" | "name-asc" | "recent";
type FilterOption = "all" | "healthy" | "warning" | "at-risk";

export default function ClientHealthDashboardPage() {
  const { getAllClientHealthScores, refreshHealthScore, tenants } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>("score-desc");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [selectedScore, setSelectedScore] = useState<ClientHealthScore | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  const scores = getAllClientHealthScores();

  const healthy = scores.filter(
    (s) => getHealthStatus(s.overallScore) === "healthy",
  );
  const warning = scores.filter(
    (s) => getHealthStatus(s.overallScore) === "warning",
  );
  const atRisk = scores.filter(
    (s) => getHealthStatus(s.overallScore) === "at-risk",
  );

  const filtered = scores.filter((s) => {
    if (filterBy === "all") return true;
    if (filterBy === "healthy")
      return getHealthStatus(s.overallScore) === "healthy";
    if (filterBy === "warning")
      return getHealthStatus(s.overallScore) === "warning";
    if (filterBy === "at-risk")
      return getHealthStatus(s.overallScore) === "at-risk";
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "score-desc") return b.overallScore - a.overallScore;
    if (sortBy === "score-asc") return a.overallScore - b.overallScore;
    if (sortBy === "name-asc") {
      const nameA = tenants.find((t) => t.id === a.tenantId)?.name ?? "";
      const nameB = tenants.find((t) => t.id === b.tenantId)?.name ?? "";
      return nameA.localeCompare(nameB);
    }
    if (sortBy === "recent") return b.lastUpdated - a.lastUpdated;
    return 0;
  });

  const handleRefreshAll = () => {
    setRefreshing(true);
    for (const score of scores) {
      refreshHealthScore(score.tenantId);
    }
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="space-y-6" data-ocid="health-dashboard.page">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Heart size={22} className="text-rose-400" />
            Client Health Dashboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Composite performance scores across all managed clients
          </p>
        </div>
        <Button
          data-ocid="health-dashboard.refresh_all.button"
          variant="outline"
          size="sm"
          onClick={handleRefreshAll}
          disabled={refreshing}
          className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <RefreshCw
            size={14}
            className={`mr-1.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh All Scores
        </Button>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            Total Clients
          </p>
          <p className="text-3xl font-bold text-white mt-1">{scores.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">
            Healthy
          </p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">
            {healthy.length}
          </p>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full mt-1 inline-block">
            {scores.length > 0
              ? Math.round((healthy.length / scores.length) * 100)
              : 0}
            %
          </span>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-amber-400 font-medium uppercase tracking-wider">
            Needs Attention
          </p>
          <p className="text-3xl font-bold text-amber-400 mt-1">
            {warning.length}
          </p>
          <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full mt-1 inline-block">
            {scores.length > 0
              ? Math.round((warning.length / scores.length) * 100)
              : 0}
            %
          </span>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-xs text-red-400 font-medium uppercase tracking-wider">
            At Risk
          </p>
          <p className="text-3xl font-bold text-red-400 mt-1">
            {atRisk.length}
          </p>
          <span className="text-[11px] bg-red-500/20 text-red-300 border border-red-500/30 px-1.5 py-0.5 rounded-full mt-1 inline-block">
            {scores.length > 0
              ? Math.round((atRisk.length / scores.length) * 100)
              : 0}
            %
          </span>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Sort:</span>
          <select
            data-ocid="health-dashboard.sort.select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-gray-900 border border-white/10 text-gray-300 text-xs rounded-lg px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
          >
            <option value="score-desc">Health Score ↓</option>
            <option value="score-asc">Health Score ↑</option>
            <option value="name-asc">Name A–Z</option>
            <option value="recent">Recently Updated</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Filter:</span>
          <div className="flex gap-1">
            {(
              [
                { value: "all", label: "All" },
                { value: "healthy", label: "Healthy" },
                { value: "warning", label: "Warning" },
                { value: "at-risk", label: "At Risk" },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                data-ocid={`health-dashboard.filter.${value}`}
                onClick={() => setFilterBy(value)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterBy === value
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Client Grid */}
      {sorted.length === 0 ? (
        <div
          data-ocid="health-dashboard.empty_state"
          className="rounded-xl border border-white/10 bg-white/5 py-16 text-center"
        >
          <Heart size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No clients match this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((score, i) => {
            const tenant = tenants.find((t) => t.id === score.tenantId);
            if (!tenant) return null;
            return (
              <ClientHealthCard
                key={score.tenantId}
                score={score}
                tenant={tenant}
                index={i + 1}
                onViewDetails={() => setSelectedScore(score)}
              />
            );
          })}
        </div>
      )}

      {/* Detail Panel */}
      {selectedScore && (
        <HealthScoreDetailPanel
          score={selectedScore}
          tenant={tenants.find((t) => t.id === selectedScore.tenantId)!}
          onClose={() => setSelectedScore(null)}
        />
      )}
    </div>
  );
}
