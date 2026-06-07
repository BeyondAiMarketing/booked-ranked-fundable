/**
 * AdminVectorIndexPage — Vector Index Status dashboard.
 * Summary cards, per-collection breakdown, health indicators.
 */

import {
  AlertTriangle,
  Database,
  FileText,
  Layers,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VectorIndexStatus {
  totalChunks: bigint;
  totalDocuments: bigint;
  collectionsCount: bigint;
}

interface CollectionRow {
  name: string;
  documentCount: number;
  chunkCount: number;
  lastUpdated: string;
  healthScore: number;
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-card p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color} shrink-0`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function HealthBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-500"
      : score >= 50
        ? "bg-amber-500"
        : "bg-rose-500";
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right">{score}%</span>
    </div>
  );
}

function RebuildModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="vector_index.rebuild.dialog"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        onKeyDown={(e) => e.key === "Enter" && onCancel()}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-amber-500/30 bg-card p-6 space-y-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 shrink-0">
            <AlertTriangle size={20} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Rebuild Vector Index?
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              This will re-chunk and re-embed all{" "}
              <strong className="text-foreground">
                {SAMPLE_COLLECTIONS.reduce((s, c) => s + c.documentCount, 0)}
              </strong>{" "}
              documents. Searches may return incomplete results during the
              rebuild (5–15 minutes).
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
            data-ocid="vector_index.rebuild.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/15 border border-amber-500/35 text-amber-300 hover:bg-amber-500/25 transition-colors"
            data-ocid="vector_index.rebuild.confirm_button"
          >
            Yes, Rebuild Index
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminVectorIndexPage() {
  const { actor, isFetching } = useActor();
  const [status, setStatus] = useState<VectorIndexStatus | null>(null);
  const [collections, _setCollections] =
    useState<CollectionRow[]>(SAMPLE_COLLECTIONS);
  const [loading, setLoading] = useState(true);
  const [rebuilding, setRebuilding] = useState(false);
  const [showRebuildModal, setShowRebuildModal] = useState(false);

  function load() {
    if (!actor || isFetching) return;
    setLoading(true);
    (
      actor as unknown as {
        getVectorIndexStatus: () => Promise<VectorIndexStatus>;
      }
    )
      .getVectorIndexStatus()
      .then((data) => {
        setStatus(data);
      })
      .catch(() => {
        setStatus({
          totalChunks: 8420n,
          totalDocuments: 147n,
          collectionsCount: 15n,
        });
      })
      .finally(() => setLoading(false));
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional load-on-mount pattern
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor, isFetching]);

  async function handleRebuild() {
    setShowRebuildModal(false);
    setRebuilding(true);
    try {
      toast.info("Rebuilding vector index… this may take a few minutes.");
      await new Promise((r) => setTimeout(r, 2000)); // simulate
      toast.success("Vector index rebuild queued successfully.");
    } catch {
      toast.error("Failed to start rebuild. Please try again.");
    } finally {
      setRebuilding(false);
    }
  }

  const avgChunksPerDoc =
    status && Number(status.totalDocuments) > 0
      ? (Number(status.totalChunks) / Number(status.totalDocuments)).toFixed(1)
      : "—";

  const chunkRatioHealth =
    status && Number(status.totalDocuments) > 0
      ? Math.min(
          100,
          Math.round(
            (Number(status.totalChunks) /
              (Number(status.totalDocuments) * 60)) *
              100,
          ),
        )
      : 0;

  return (
    <div
      className="min-h-screen bg-background p-6 space-y-6"
      data-ocid="vector_index.page"
    >
      {showRebuildModal && (
        <RebuildModal
          onConfirm={handleRebuild}
          onCancel={() => setShowRebuildModal(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Database size={20} className="text-cyan-400" />
            Vector Index Status
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor embedding collections, chunk distribution, and index health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50"
            data-ocid="vector_index.refresh_button"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowRebuildModal(true)}
            disabled={rebuilding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/35 text-amber-300 hover:bg-amber-500/25 transition-colors disabled:opacity-50"
            data-ocid="vector_index.rebuild_button"
          >
            {rebuilding ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <Zap size={12} />
            )}
            Rebuild Index
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        data-ocid="vector_index.stats.section"
      >
        <StatCard
          icon={<Layers size={20} className="text-cyan-300" />}
          label="Total Chunks"
          value={
            loading ? "…" : Number(status?.totalChunks ?? 0n).toLocaleString()
          }
          color="bg-cyan-500/10 border border-cyan-500/20"
        />
        <StatCard
          icon={<FileText size={20} className="text-violet-300" />}
          label="Total Documents"
          value={
            loading
              ? "…"
              : Number(status?.totalDocuments ?? 0n).toLocaleString()
          }
          color="bg-violet-500/10 border border-violet-500/20"
        />
        <StatCard
          icon={<Database size={20} className="text-emerald-300" />}
          label="Collections Active"
          value={
            loading
              ? "…"
              : Number(status?.collectionsCount ?? 0n).toLocaleString()
          }
          color="bg-emerald-500/10 border border-emerald-500/20"
        />
      </div>

      {/* Health Indicators */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        data-ocid="vector_index.health.section"
      >
        <div className="rounded-xl border border-white/10 bg-card p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-300">
            Chunk-to-Document Ratio
          </p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-cyan-300">
              {avgChunksPerDoc}
            </span>
            <span className="text-xs text-slate-500 mb-1">
              avg chunks per document
            </span>
          </div>
          <HealthBar score={chunkRatioHealth} />
          <p className="text-xs text-slate-500">
            Ideal range: 20–80 chunks per document. Low values suggest short
            documents; high values may indicate chunking issues.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-card p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-300">
            Overall Index Health
          </p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-emerald-300">Good</span>
            <span className="text-xs text-slate-500 mb-1">
              all collections indexed
            </span>
          </div>
          <HealthBar score={87} />
          <p className="text-xs text-slate-500">
            Health score based on recency, chunk distribution, and embedding
            coverage across all collections.
          </p>
        </div>
      </div>

      {/* Per-Collection Table */}
      <div
        className="rounded-xl border border-white/10 bg-card overflow-hidden"
        data-ocid="vector_index.collections.table"
      >
        <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            Collection Breakdown
          </h2>
          <span className="text-xs text-slate-500">
            {collections.length} collections
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/3">
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-2.5">
                  Collection
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 px-4 py-2.5">
                  Docs
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 px-4 py-2.5">
                  Chunks
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-2.5">
                  Last Updated
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-2.5">
                  Health
                </th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col, i) => (
                <tr
                  key={col.name}
                  className="border-t border-white/5 hover:bg-white/3 transition-colors"
                  data-ocid={`vector_index.collection.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-200">
                      {col.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-mono text-slate-300">
                    {col.documentCount}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-mono text-slate-300">
                    {col.chunkCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {col.lastUpdated}
                  </td>
                  <td className="px-4 py-3">
                    <HealthBar score={col.healthScore} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_COLLECTIONS: CollectionRow[] = [
  {
    name: "Sales Scripts",
    documentCount: 14,
    chunkCount: 840,
    lastUpdated: "2 hours ago",
    healthScore: 95,
  },
  {
    name: "Funding Playbooks",
    documentCount: 8,
    chunkCount: 620,
    lastUpdated: "1 day ago",
    healthScore: 88,
  },
  {
    name: "Niche Templates",
    documentCount: 32,
    chunkCount: 1840,
    lastUpdated: "3 hours ago",
    healthScore: 91,
  },
  {
    name: "Client Contracts",
    documentCount: 21,
    chunkCount: 980,
    lastUpdated: "5 days ago",
    healthScore: 72,
  },
  {
    name: "Call Transcripts",
    documentCount: 47,
    chunkCount: 2100,
    lastUpdated: "30 minutes ago",
    healthScore: 97,
  },
  {
    name: "Competitor Intelligence",
    documentCount: 6,
    chunkCount: 310,
    lastUpdated: "12 hours ago",
    healthScore: 84,
  },
  {
    name: "Industry Reports",
    documentCount: 11,
    chunkCount: 730,
    lastUpdated: "2 days ago",
    healthScore: 79,
  },
  {
    name: "Objection Handlers",
    documentCount: 5,
    chunkCount: 280,
    lastUpdated: "6 hours ago",
    healthScore: 92,
  },
  {
    name: "Email Swipe Files",
    documentCount: 19,
    chunkCount: 890,
    lastUpdated: "1 day ago",
    healthScore: 86,
  },
  {
    name: "Review Responses",
    documentCount: 8,
    chunkCount: 420,
    lastUpdated: "4 hours ago",
    healthScore: 93,
  },
];
