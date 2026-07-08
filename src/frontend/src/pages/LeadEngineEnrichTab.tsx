/**
 * Lead Engine — Enrichment tab.
 *
 * Renders a table of leads with per-row Enrich buttons, batch selection, and
 * expandable rows that render the EnrichmentField variants produced by the
 * LLM fallback chain.
 *
 * Self-contained: imported and rendered by LeadEnginePage inside its Enrich
 * tab. Enrichment is delegated to the parent via `onEnrichOne` /
 * `onEnrichBatch`.
 */

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type {
  EnrichmentField,
  EnrichmentResult,
  LeadEngineLead,
} from "../integrations/lead-engine/types";

export interface LeadEngineEnrichTabProps {
  leads: LeadEngineLead[];
  onEnrichOne: (leadId: string) => Promise<void>;
  onEnrichBatch: (leadIds: string[]) => Promise<void>;
  onShowLead: (lead: LeadEngineLead) => void;
  enriching: boolean;
}

function fieldLabel(field: EnrichmentField): string {
  switch (field.__kind__) {
    case "inferredNiche":
      return "Inferred Niche";
    case "companySize":
      return "Company Size";
    case "websiteSummary":
      return "Website Summary";
    case "suggestedOutreachAngle":
      return "Outreach Angle";
  }
}

function fieldValue(field: EnrichmentField): string {
  switch (field.__kind__) {
    case "inferredNiche":
      return field.inferredNiche;
    case "companySize":
      return field.companySize;
    case "websiteSummary":
      return field.websiteSummary;
    case "suggestedOutreachAngle":
      return field.suggestedOutreachAngle;
  }
}

function EnrichmentFields({ result }: { result: EnrichmentResult }) {
  if (!result.success) {
    return (
      <div className="space-y-1 text-sm text-red-300">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" />
          <span>
            Enrichment failed
            {result.failingProvider ? ` via ${result.failingProvider}` : ""}
          </span>
        </div>
        {result.errorMessage && (
          <div className="pl-6 text-xs text-red-400">{result.errorMessage}</div>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span>Provider:</span>
        <span className="text-gray-200">{result.provider}</span>
      </div>
      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {result.fields.map((field, idx) => (
          <div
            key={`${field.__kind__}-${idx}`}
            className="rounded-lg border border-white/10 bg-gray-900/40 p-2.5"
          >
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              {fieldLabel(field)}
            </dt>
            <dd className="mt-0.5 text-sm text-gray-200">
              {fieldValue(field)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function LeadRow({
  lead,
  selected,
  onToggle,
  onEnrichOne,
  onShowLead,
  enriching,
}: {
  lead: LeadEngineLead;
  selected: boolean;
  onToggle: () => void;
  onEnrichOne: (leadId: string) => Promise<void>;
  onShowLead: (lead: LeadEngineLead) => void;
  enriching: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const enriched = !!lead.enrichmentResult?.success;

  return (
    <>
      <tr className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
        <td className="px-3 py-2.5">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="h-4 w-4 rounded border-white/20 bg-gray-900/60 accent-indigo-500"
            aria-label={`Select ${lead.businessName}`}
          />
        </td>
        <td className="px-3 py-2.5">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex h-5 w-5 items-center justify-center text-gray-400 hover:text-gray-200"
            aria-label={expanded ? "Collapse row" : "Expand row"}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </td>
        <td className="px-3 py-2.5 text-sm text-gray-200">
          <button
            type="button"
            onClick={() => onShowLead(lead)}
            className="truncate text-left hover:text-indigo-300"
            title={lead.businessName}
          >
            {lead.businessName || "—"}
          </button>
        </td>
        <td className="px-3 py-2.5 text-sm text-gray-300">
          {lead.phone || "—"}
        </td>
        <td className="px-3 py-2.5 text-sm text-gray-300">
          <span className="truncate" title={lead.email}>
            {lead.email || "—"}
          </span>
        </td>
        <td className="px-3 py-2.5 text-sm text-gray-300">
          {lead.niche || "—"}
        </td>
        <td className="px-3 py-2.5">
          {enriched ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-3 w-3" />
              Enriched
            </span>
          ) : lead.enrichmentResult ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-300">
              <AlertCircle className="h-3 w-3" />
              Failed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/15 px-2 py-0.5 text-xs text-gray-400">
              Not Enriched
            </span>
          )}
        </td>
        <td className="px-3 py-2.5 text-right">
          <button
            type="button"
            onClick={() => onEnrichOne(lead.id)}
            disabled={enriching}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            {enriching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Enrich
          </button>
        </td>
      </tr>
      {expanded && lead.enrichmentResult && (
        <tr className="border-b border-white/5 bg-gray-900/30">
          <td colSpan={8} className="px-6 py-3">
            <EnrichmentFields result={lead.enrichmentResult} />
          </td>
        </tr>
      )}
    </>
  );
}

export function LeadEngineEnrichTab({
  leads,
  onEnrichOne,
  onEnrichBatch,
  onShowLead,
  enriching,
}: LeadEngineEnrichTabProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => {
      if (prev.size === leads.length) return new Set();
      return new Set(leads.map((l) => l.id));
    });
  };

  const allSelected = leads.length > 0 && selected.size === leads.length;

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-gray-800/30 py-16 text-center">
        <Sparkles className="mb-3 h-10 w-10 text-gray-500" />
        <p className="text-sm text-gray-400">No leads found</p>
        <p className="mt-1 text-xs text-gray-500">
          Import leads to enrich them with inferred niche, company size, website
          summary, and outreach angles.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-white/10 bg-gray-800/60"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 p-3">
        <div className="text-sm text-gray-400">
          {selected.size > 0
            ? `${selected.size} selected`
            : `${leads.length} leads`}
        </div>
        <button
          type="button"
          onClick={() => onEnrichBatch(Array.from(selected))}
          disabled={enriching || selected.size === 0}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {enriching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Batch Enrich
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-gray-800/80 text-xs uppercase tracking-wide text-gray-500 backdrop-blur">
            <tr className="border-b border-white/10">
              <th className="px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-white/20 bg-gray-900/60 accent-indigo-500"
                  aria-label="Select all leads"
                />
              </th>
              <th className="px-3 py-2.5" />
              <th className="px-3 py-2.5">Business</th>
              <th className="px-3 py-2.5">Phone</th>
              <th className="px-3 py-2.5">Email</th>
              <th className="px-3 py-2.5">Niche</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                selected={selected.has(lead.id)}
                onToggle={() => toggle(lead.id)}
                onEnrichOne={onEnrichOne}
                onShowLead={onShowLead}
                enriching={enriching}
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
