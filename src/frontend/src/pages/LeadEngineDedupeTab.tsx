/**
 * Lead Engine — Dedupe review tab.
 *
 * Renders one card per DedupeGroup. Each card fetches its candidate leads via
 * `leadEngine_getLead` and offers four resolution actions: Merge (with a
 * survivor picker), Ignore, Keep Separate, and Link.
 *
 * Self-contained: imported and rendered by LeadEnginePage inside its Dedupe
 * tab. Does not own any backend state — resolution is delegated to the parent
 * via `onResolve`.
 */

import { Eye, GitBranch, Link2, Loader2, Split, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { ActorCompat } from "../hooks/useActor";
import { leadEngine_getLead } from "../integrations/lead-engine/client";
import {
  type DedupeGroup,
  DedupeMatchField,
  type DedupeResolution,
  type LeadEngineLead,
} from "../integrations/lead-engine/types";

export interface LeadEngineDedupeTabProps {
  groups: DedupeGroup[];
  actor: ActorCompat;
  tenantId: string;
  onResolve: (groupId: string, resolution: DedupeResolution) => Promise<void>;
  onShowLead: (lead: LeadEngineLead) => void;
  resolving: boolean;
}

const MATCH_FIELD_LABELS: Record<DedupeMatchField, string> = {
  [DedupeMatchField.domain]: "Domain",
  [DedupeMatchField.businessName]: "Business Name",
  [DedupeMatchField.email]: "Email",
  [DedupeMatchField.website]: "Website",
  [DedupeMatchField.address]: "Address",
  [DedupeMatchField.phone]: "Phone",
};

function resolutionLabel(resolution: DedupeResolution): string {
  switch (resolution.__kind__) {
    case "Merged":
      return "Merged";
    case "Ignored":
      return "Ignored";
    case "KeptSeparate":
      return "Kept Separate";
    case "Linked":
      return "Linked";
  }
}

function LeadFieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="truncate text-sm text-gray-200" title={value}>
        {value || "—"}
      </div>
    </div>
  );
}

function LeadCard({
  lead,
  onShowLead,
}: {
  lead: LeadEngineLead;
  onShowLead: (lead: LeadEngineLead) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-gray-900/40 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-gray-100">
          {lead.businessName || "Untitled"}
        </span>
        <button
          type="button"
          onClick={() => onShowLead(lead)}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-gray-200"
          aria-label={`View lead ${lead.businessName}`}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <LeadFieldRow label="Phone" value={lead.phone} />
        <LeadFieldRow label="Email" value={lead.email} />
        <LeadFieldRow label="Niche" value={lead.niche} />
        <LeadFieldRow label="Source" value={lead.source} />
      </div>
    </div>
  );
}

function GroupCard({
  group,
  actor,
  tenantId,
  onResolve,
  onShowLead,
  resolving,
}: {
  group: DedupeGroup;
  actor: ActorCompat;
  tenantId: string;
  onResolve: (groupId: string, resolution: DedupeResolution) => Promise<void>;
  onShowLead: (lead: LeadEngineLead) => void;
  resolving: boolean;
}) {
  const [leads, setLeads] = useState<LeadEngineLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [mergeMode, setMergeMode] = useState(false);
  const [survivorId, setSurvivorId] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(
      group.leadIds.map((id) =>
        leadEngine_getLead(actor, tenantId, id).catch(() => null),
      ),
    )
      .then((results) => {
        if (cancelled) return;
        const fetched = results.filter((r): r is LeadEngineLead => r !== null);
        setLeads(fetched);
        if (fetched.length > 0) setSurvivorId(fetched[0].id);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [actor, tenantId, group.leadIds]);

  const isResolved = !!group.resolution;

  const handleMerge = () => {
    if (!survivorId) return;
    const away = leads.find((l) => l.id !== survivorId);
    if (!away) return;
    onResolve(group.id, {
      __kind__: "Merged",
      Merged: { mergedIntoLeadId: survivorId, mergedAwayLeadId: away.id },
    });
    setMergeMode(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-white/10 bg-gray-800/60 p-4"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-gray-400">
          Group {group.id.slice(0, 8)}
        </span>
        {group.matchedFields.map((field) => (
          <span
            key={field}
            className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-300"
          >
            {MATCH_FIELD_LABELS[field] ?? field}
          </span>
        ))}
        {isResolved && group.resolution && (
          <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
            {resolutionLabel(group.resolution)}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading candidate leads…
        </div>
      ) : leads.length === 0 ? (
        <div className="py-6 text-sm text-gray-500">
          No leads found for this group.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onShowLead={onShowLead} />
          ))}
        </div>
      )}

      {!isResolved && !loading && leads.length >= 2 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          {mergeMode ? (
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-gray-400">
                Keep lead:
                <select
                  value={survivorId}
                  onChange={(e) => setSurvivorId(e.target.value)}
                  className="ml-2 rounded-lg border border-white/10 bg-gray-900/60 px-2 py-1.5 text-sm text-gray-200 focus:border-indigo-400 focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.businessName || l.id.slice(0, 8)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={handleMerge}
                disabled={resolving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
              >
                {resolving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <GitBranch className="h-4 w-4" />
                )}
                Confirm Merge
              </button>
              <button
                type="button"
                onClick={() => setMergeMode(false)}
                disabled={resolving}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMergeMode(true)}
                disabled={resolving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
              >
                <GitBranch className="h-4 w-4" />
                Merge
              </button>
              <button
                type="button"
                onClick={() =>
                  onResolve(group.id, { __kind__: "Ignored", Ignored: null })
                }
                disabled={resolving}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                {resolving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                Ignore
              </button>
              <button
                type="button"
                onClick={() =>
                  onResolve(group.id, {
                    __kind__: "KeptSeparate",
                    KeptSeparate: null,
                  })
                }
                disabled={resolving}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                <Split className="h-4 w-4" />
                Keep Separate
              </button>
              <button
                type="button"
                onClick={() =>
                  onResolve(group.id, { __kind__: "Linked", Linked: null })
                }
                disabled={resolving}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                <Link2 className="h-4 w-4" />
                Link
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function LeadEngineDedupeTab({
  groups,
  actor,
  tenantId,
  onResolve,
  onShowLead,
  resolving,
}: LeadEngineDedupeTabProps) {
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-gray-800/30 py-16 text-center">
        <Users className="mb-3 h-10 w-10 text-gray-500" />
        <p className="text-sm text-gray-400">No duplicate groups found</p>
        <p className="mt-1 text-xs text-gray-500">
          Imported leads that match existing records on shared fields will
          appear here for review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          actor={actor}
          tenantId={tenantId}
          onResolve={onResolve}
          onShowLead={onShowLead}
          resolving={resolving}
        />
      ))}
    </div>
  );
}
