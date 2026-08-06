import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { capturePublicLead } from "@/lib/publicConversionApi";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface AuditFormSectionProps {
  headline: string;
  subcopy: string;
  nicheKey: string;
  nicheName?: string;
}

type SubmissionOutcome = "created" | "duplicate";

export default function AuditFormSection({
  headline,
  subcopy,
  nicheKey,
  nicheName,
}: AuditFormSectionProps) {
  const { actor } = useActor();
  const [submissionOutcome, setSubmissionOutcome] =
    useState<SubmissionOutcome | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    contactName: "",
    businessName: "",
    website: "",
    email: "",
    phone: "",
    serviceArea: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await capturePublicLead({
        contactName: form.contactName,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
        website: form.website,
        serviceArea: form.serviceArea,
        niche: nicheKey,
        source: "audit_form",
        status: "new_lead",
        notes: { formType: "free_audit" },
      });

      if (
        !result.ok ||
        !result.leadId ||
        (result.outcome !== "created" && result.outcome !== "duplicate")
      ) {
        throw new Error(
          result.error ||
            "We found conflicting contact details. Please contact us directly so we can fix the record.",
        );
      }

      setSubmissionOutcome(result.outcome);

      // Supabase is the canonical public conversion record. Mirror newly
      // created leads to the existing canister-backed admin UI when available.
      if (result.outcome === "created" && actor) {
        try {
          await actor.createLead({
            id: "",
            tenantId: `${nicheKey}_audit`,
            name: form.contactName || form.businessName,
            email: form.email,
            phone: form.phone || "",
            niche: nicheKey,
            status: "new_lead",
            source: "audit_form",
            notes: JSON.stringify({
              publicLeadId: result.leadId,
              businessName: form.businessName,
              website: form.website,
              serviceArea: form.serviceArea,
              formType: "free_audit",
            }),
            agentSubscriptions: [],
            createdAt: BigInt(Date.now()) * BigInt(1_000_000),
          });
        } catch (syncError) {
          console.warn("Canonical audit lead saved; canister mirror failed", {
            publicLeadId: result.leadId,
            syncError,
          });
        }
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong saving your request. Please try again or email us directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  const buttonLabel = nicheName
    ? `Get My Free ${nicheName} Growth Audit`
    : "Get My Free Growth Audit";

  return (
    <section id="audit-form" className="py-20 px-6 bg-slate-950">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            Free — No Credit Card Required
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {headline}
          </h2>
          <p className="text-slate-200">{subcopy}</p>
        </div>

        <div className="bg-slate-900 border border-white/8 rounded-2xl p-8">
          {submissionOutcome ? (
            <div
              data-ocid="audit_form.success_state"
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {submissionOutcome === "created"
                  ? "You're on the list!"
                  : "We found your request!"}
              </h3>
              <p className="text-slate-200 max-w-sm mx-auto">
                {submissionOutcome === "created"
                  ? "We'll review your business and send your personalized growth audit report within 24 hours."
                  : "We refreshed your existing request instead of creating a duplicate. Your audit is still in the queue."}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              data-ocid="audit_form.modal"
              className="space-y-5"
            >
              <input type="hidden" name="niche" value={nicheKey} />

              {error && (
                <div
                  data-ocid="audit_form.error_state"
                  className="flex items-start gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3"
                >
                  <AlertCircle
                    size={16}
                    className="text-rose-400 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-rose-300 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="audit-contact" className="text-slate-200 text-sm">
                    Your Name *
                  </Label>
                  <Input
                    id="audit-contact"
                    data-ocid="audit_form.input"
                    placeholder="First Last"
                    value={form.contactName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setForm((previous) => ({
                        ...previous,
                        contactName: event.target.value,
                      }))
                    }
                    required
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="audit-business" className="text-slate-200 text-sm">
                    Business Name *
                  </Label>
                  <Input
                    id="audit-business"
                    data-ocid="audit_form.input"
                    placeholder="Your Business Name"
                    value={form.businessName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setForm((previous) => ({
                        ...previous,
                        businessName: event.target.value,
                      }))
                    }
                    required
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="audit-website" className="text-slate-200 text-sm">
                  Website URL *
                </Label>
                <Input
                  id="audit-website"
                  data-ocid="audit_form.input"
                  type="url"
                  placeholder="https://yourbusiness.com"
                  value={form.website}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((previous) => ({
                      ...previous,
                      website: event.target.value,
                    }))
                  }
                  required
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="audit-email" className="text-slate-200 text-sm">
                  Email Address *
                </Label>
                <Input
                  id="audit-email"
                  data-ocid="audit_form.input"
                  type="email"
                  placeholder="you@yourbusiness.com"
                  value={form.email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  required
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="audit-phone" className="text-slate-200 text-sm">
                    Phone (optional)
                  </Label>
                  <Input
                    id="audit-phone"
                    data-ocid="audit_form.input"
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setForm((previous) => ({
                        ...previous,
                        phone: event.target.value,
                      }))
                    }
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="audit-area" className="text-slate-200 text-sm">
                    Service Area (optional)
                  </Label>
                  <Input
                    id="audit-area"
                    data-ocid="audit_form.input"
                    placeholder="City, State"
                    value={form.serviceArea}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setForm((previous) => ({
                        ...previous,
                        serviceArea: event.target.value,
                      }))
                    }
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <Button
                type="submit"
                data-ocid="audit_form.submit_button"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 text-base font-semibold"
              >
                {loading ? (
                  "Saving your request..."
                ) : (
                  <>
                    {buttonLabel} <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-slate-300 text-center">
                We'll analyze your business and send a personalized report
                within 24 hours. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
