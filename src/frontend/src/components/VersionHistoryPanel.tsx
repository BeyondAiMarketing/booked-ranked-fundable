// ── VersionHistoryPanel ───────────────────────────────────────────────────────
// Slide-in drawer that lists saved website snapshots with relative timestamps.
// Clicking Restore shows a diff preview, then confirms to roll back the config.

import { Clock, History, RotateCcw, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ClientWebsiteConfig } from "../data/nicheWebsiteData";
import {
  type WebsiteSnapshot,
  deleteVersion,
  diffConfigs,
  listVersions,
  relativeTime,
  restoreVersion,
} from "../lib/websiteVersionHistory";
import { Button } from "./ui/button";

interface VersionHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  currentConfig: ClientWebsiteConfig;
  onRestore: (config: ClientWebsiteConfig) => void;
}

export default function VersionHistoryPanel({
  isOpen,
  onClose,
  tenantId,
  currentConfig,
  onRestore,
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<WebsiteSnapshot[]>([]);
  const [diffTarget, setDiffTarget] = useState<WebsiteSnapshot | null>(null);
  const [diffLines, setDiffLines] = useState<string[]>([]);
  const [ticker, setTicker] = useState(0);

  // Refresh list whenever panel opens
  useEffect(() => {
    if (isOpen) setVersions(listVersions(tenantId));
  }, [isOpen, tenantId]);

  // Update relative timestamps every 30s
  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(() => setTicker((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, [isOpen]);
  void ticker;

  const handleShowDiff = (snap: WebsiteSnapshot) => {
    setDiffTarget(snap);
    setDiffLines(diffConfigs(snap.config, currentConfig));
  };

  const handleConfirmRestore = () => {
    if (!diffTarget) return;
    const config = restoreVersion(tenantId, diffTarget.id);
    if (config) {
      onRestore(config);
      setDiffTarget(null);
      onClose();
    }
  };

  const handleDelete = (snapId: string) => {
    deleteVersion(tenantId, snapId);
    setVersions(listVersions(tenantId));
    if (diffTarget?.id === snapId) setDiffTarget(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 bottom-0 z-50 w-80 flex flex-col bg-card border-l border-white/8 shadow-2xl"
        data-ocid="version_history.panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <History size={14} className="text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Version History
              </p>
              <p className="text-[10px] text-muted-foreground">
                {versions.length} save{versions.length !== 1 ? "s" : ""} · max
                20
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/8 text-muted-foreground transition-colors"
            data-ocid="version_history.close_button"
          >
            <X size={15} />
          </button>
        </div>

        {/* Diff confirmation */}
        {diffTarget && (
          <div className="mx-3 mt-3 rounded-xl border border-violet-500/30 bg-violet-500/10 p-3 space-y-2">
            <p className="text-xs font-bold text-violet-300">
              Restore "{diffTarget.label}"?
            </p>
            <p className="text-[10px] text-muted-foreground">
              Changes that will be reverted:
            </p>
            <ul className="space-y-0.5">
              {diffLines.map((line) => (
                <li
                  key={line}
                  className="text-[10px] text-foreground/80 flex gap-1.5"
                >
                  <span className="text-amber-400 flex-shrink-0">↩</span>
                  {line}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                className="flex-1 text-xs h-7"
                onClick={handleConfirmRestore}
                data-ocid="version_history.confirm_button"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "#fff",
                }}
              >
                <RotateCcw size={11} className="mr-1" />
                Confirm Restore
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2.5"
                onClick={() => setDiffTarget(null)}
                data-ocid="version_history.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Version list */}
        <div className="flex-1 overflow-y-auto py-2">
          {versions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 px-6 text-center"
              data-ocid="version_history.empty_state"
            >
              <Clock size={28} className="text-muted-foreground/40 mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">
                No saved versions yet
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Save your website to create a restore point
              </p>
            </div>
          ) : (
            <ul className="space-y-1 px-2">
              {versions.map((snap, idx) => {
                const isSelected = diffTarget?.id === snap.id;
                return (
                  <li
                    key={snap.id}
                    className={`rounded-xl border px-3 py-2.5 transition-all ${
                      isSelected
                        ? "border-violet-500/40 bg-violet-500/10"
                        : "border-white/8 bg-white/3 hover:border-white/15"
                    }`}
                    data-ocid={`version_history.item.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {snap.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {relativeTime(snap.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            isSelected
                              ? setDiffTarget(null)
                              : handleShowDiff(snap)
                          }
                          className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors px-1.5 py-1 rounded-md hover:bg-violet-500/10"
                          data-ocid={`version_history.restore_button.${idx + 1}`}
                        >
                          <RotateCcw size={9} />
                          {isSelected ? "Cancel" : "Restore"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(snap.id)}
                          className="p-1 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          aria-label="Delete version"
                          data-ocid={`version_history.delete_button.${idx + 1}`}
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-white/8">
          <p className="text-[10px] text-muted-foreground text-center">
            Versions are saved locally · max 20 · oldest auto-removed
          </p>
        </div>
      </aside>
    </>
  );
}
