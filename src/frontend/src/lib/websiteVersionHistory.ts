// ── Website Version History ──────────────────────────────────────────────────
// Manages snapshots of ClientWebsiteConfig state for version rollback.
// Uses localStorage for persistence across sessions. Capped at 20 versions.

import type { ClientWebsiteConfig } from "../data/nicheWebsiteData";

export interface WebsiteSnapshot {
  id: string;
  timestamp: number;
  label: string;
  config: ClientWebsiteConfig;
}

const MAX_VERSIONS = 20;

function getStorageKey(tenantId: string): string {
  return `brf_website_versions_${tenantId}`;
}

/** Create a snapshot of the current config and persist it. Returns the new snapshot. */
export function createSnapshot(
  tenantId: string,
  config: ClientWebsiteConfig,
  label?: string,
): WebsiteSnapshot {
  const snapshot: WebsiteSnapshot = {
    id: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    label:
      label ??
      `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    config: JSON.parse(JSON.stringify(config)) as ClientWebsiteConfig,
  };

  const key = getStorageKey(tenantId);
  const existing = listVersions(tenantId);
  // Prepend newest, keep cap
  const updated = [snapshot, ...existing].slice(0, MAX_VERSIONS);

  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // localStorage might be full — silently continue
  }

  return snapshot;
}

/** List all snapshots for a tenant, newest first. */
export function listVersions(tenantId: string): WebsiteSnapshot[] {
  const key = getStorageKey(tenantId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as WebsiteSnapshot[];
  } catch {
    return [];
  }
}

/** Restore a specific snapshot by ID. Returns the config or null if not found. */
export function restoreVersion(
  tenantId: string,
  snapshotId: string,
): ClientWebsiteConfig | null {
  const versions = listVersions(tenantId);
  const snap = versions.find((v) => v.id === snapshotId);
  return snap
    ? (JSON.parse(JSON.stringify(snap.config)) as ClientWebsiteConfig)
    : null;
}

/** Delete a single snapshot by ID. */
export function deleteVersion(tenantId: string, snapshotId: string): void {
  const key = getStorageKey(tenantId);
  const versions = listVersions(tenantId).filter((v) => v.id !== snapshotId);
  try {
    localStorage.setItem(key, JSON.stringify(versions));
  } catch {
    /* empty */
  }
}

/** Clear all versions for a tenant. */
export function clearVersionHistory(tenantId: string): void {
  try {
    localStorage.removeItem(getStorageKey(tenantId));
  } catch {
    /* empty */
  }
}

/** Human-readable relative time label for a snapshot timestamp */
export function relativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

/** Compute a human-readable diff summary between two configs */
export function diffConfigs(
  from: ClientWebsiteConfig,
  to: ClientWebsiteConfig,
): string[] {
  const changes: string[] = [];

  if (from.customizations.primaryColor !== to.customizations.primaryColor) {
    const fromColor = from.customizations.primaryColor ?? "default";
    const toColor = to.customizations.primaryColor ?? "default";
    const colorChange = `Primary color: ${fromColor} → ${toColor}`;
    changes.push(colorChange);
  }
  if (from.customizations.secondaryColor !== to.customizations.secondaryColor) {
    changes.push("Secondary color changed");
  }
  if (from.customizations.accentColor !== to.customizations.accentColor) {
    changes.push("Accent color changed");
  }
  if (from.customizations.logoUrl !== to.customizations.logoUrl) {
    changes.push(to.customizations.logoUrl ? "Logo updated" : "Logo removed");
  }

  const fromHidden = from.customizations.hiddenSections ?? [];
  const toHidden = to.customizations.hiddenSections ?? [];
  const nowHidden = toHidden.filter((s) => !fromHidden.includes(s));
  const nowVisible = fromHidden.filter((s) => !toHidden.includes(s));
  if (nowHidden.length > 0)
    changes.push(`Sections hidden: ${nowHidden.join(", ")}`);
  if (nowVisible.length > 0)
    changes.push(`Sections shown: ${nowVisible.join(", ")}`);

  const fromOverrides = from.customizations.sectionOverrides ?? {};
  const toOverrides = to.customizations.sectionOverrides ?? {};
  const editedSections = new Set([
    ...Object.keys(fromOverrides),
    ...Object.keys(toOverrides),
  ]);
  for (const sid of editedSections) {
    const f = JSON.stringify(fromOverrides[sid] ?? {});
    const t = JSON.stringify(toOverrides[sid] ?? {});
    if (f !== t) changes.push(`Section "${sid}" content edited`);
  }

  // Check brand kit
  const fromKit = (from as { brandKit?: { name?: string } }).brandKit;
  const toKit = (to as { brandKit?: { name?: string } }).brandKit;
  if (JSON.stringify(fromKit) !== JSON.stringify(toKit)) {
    changes.push("Brand kit updated");
  }

  if (changes.length === 0) changes.push("No content changes detected");
  return changes;
}
