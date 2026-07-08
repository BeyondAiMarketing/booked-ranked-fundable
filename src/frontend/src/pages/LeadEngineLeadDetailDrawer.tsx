/**
 * Lead Engine — Lead detail slide-over drawer.
 *
 * Renders a fixed right-side panel with the full lead record: core fields,
 * provenance, dedupe status, linked leads, and enrichment result. Self-
 * contained: imported and rendered by LeadEnginePage with a `lead` prop
 * (null when closed).
 */

import { X } from "lucide-react";
import { motion } from "motion/react";
import type {
  DedupeResolution,
  EnrichmentField,
  EnrichmentResult,
  LeadEngineLead,
} from "../integrations/lead-engine/types";

export interface LeadEngineLeadDetailDrawerProps {
  lead: LeadEngineLead | null;
  actor: unknown;
  tenantId: string;
  onClose: () => void;
}

function resolutionLabel(resolution: DedupeResolution): string {
  switch (resolution.__kind__) {
    case "Merged":
      return `Merged into ${resolution.Merged.mergedIntoLeadId.slice(0, 8)}`;
    case "Ignored":
      return "Ignored";
    case "KeptSeparate":
      return "Kept Separate";
    case "Linked":
      return "Linked";
  }
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-white/10 py-4 last:border-b-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="break-words text-sm text-gray-200" title={value}>
        {value || "—"}
      </div>
    </div>
  );
}

function EnrichmentSection({ result }: { result: EnrichmentResult }) {
  if (!result.success) {
    return (
      <div className="space-y-1 text-sm text-red-300">
        <div className="flex items-center gap-1.5">
          <span>
            Enrichment failed
            {result.failingProvider ? ` via ${result.failingProvider}` : ""}
          </span>
        </div>
        {result.errorMessage && (
          <div className="text-xs text-red-400">{result.errorMessage}</div>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-400">
        Provider: <span className="text-gray-200">{result.provider}</span>
      </div>
      <div className="space-y-2">
        {result.fields.map((field, idx) => (
          <div
            key={`${field.__kind__}-${idx}`}
            className="rounded-lg border border-white/10 bg-gray-900/40 p-2.5"
          >
            <div className="text-xs uppercase tracking-wide text-gray-500">
              {fieldLabel(field)}
            </div>
            <div className="mt-0.5 break-words text-sm text-gray-200">
              {fieldValue(field)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeadEngineLeadDetailDrawer({
  lead,
  onClose,
}: LeadEngineLeadDetailDrawerProps) {
  if (!lead) return null;

  const importDate = lead.provenance?.importDate
    ? new Date(Number(lead.provenance.importDate)).toLocaleDateString()
    : "—";

  return (
    <motion.div
      initial={{ x: 384 }}
      animate={{ x: 0 }}
      exit={{ x: 384 }}
      transition={{ type: "tween", duration: 0.2 }}
      className="fixed inset-y-0 right-0 z-50 w-96 overflow-y-auto border-l border-white/10 bg-gray-800/60 p-6"
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-gray-100">
            {lead.businessName || "Untitled Lead"}
          </h2>
          <p className="font-mono text-xs text-gray-500">{lead.id}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:bg-white/5 hover:text-gray-200"
          aria-label="Close lead detail"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Section title="Core Fields">
        <div className="grid grid-cols-1 gap-3">
          <Field label="Business Name" value={lead.businessName} />
          <Field label="Phone" value={lead.phone} />
          <Field label="Email" value={lead.email} />
          <Field label="Niche" value={lead.niche} />
          <Field label="Source" value={lead.source} />
          <Field
            label="Location Tags"
            value={lead.locationTags?.join(", ") ?? ""}
          />
        </div>
      </Section>

      <Section title="Provenance">
        <div className="grid grid-cols-1 gap-3">
          <Field
            label="Source Tool"
            value={lead.provenance?.sourceTool ?? ""}
          />
          <Field label="Import Date" value={importDate} />
          <Field
            label="Importer Name"
            value={lead.provenance?.importerName ?? ""}
          />
          <Field
            label="Original Format"
            value={lead.provenance?.originalFormat ?? ""}
          />
        </div>
      </Section>

      <Section title="Dedupe Status">
        {lead.dedupeFlags.length > 0 ? (
          <div className="space-y-2">
            {lead.dedupeFlags.map((flag, idx) => (
              <div
                key={`${flag.matchedLeadId}-${idx}`}
                className="rounded-lg border border-white/10 bg-gray-900/40 p-2.5"
              >
                <div className="text-xs text-gray-400">
                  Matched lead:{" "}
                  <span className="font-mono text-gray-200">
                    {flag.matchedLeadId.slice(0, 8)}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {flag.matchedFields.map((mf) => (
                    <span
                      key={mf}
                      className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-300"
                    >
                      {mf}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No dedupe flags.</p>
        )}
        {lead.dedupeResolution && (
          <div className="mt-3">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Resolution
            </div>
            <div className="mt-0.5 inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-sm text-emerald-300">
              {resolutionLabel(lead.dedupeResolution)}
            </div>
          </div>
        )}
      </Section>

      <Section title="Linked Leads">
        {lead.linkedLeadIds.length > 0 ? (
          <ul className="space-y-1">
            {lead.linkedLeadIds.map((id) => (
              <li key={id} className="font-mono text-sm text-gray-300">
                {id}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No linked leads.</p>
        )}
      </Section>

      <Section title="Enrichment">
        {lead.enrichmentResult ? (
          <EnrichmentSection result={lead.enrichmentResult} />
        ) : (
          <p className="text-sm text-gray-500">Not enriched yet.</p>
        )}
      </Section>
    </motion.div>
  );
}
