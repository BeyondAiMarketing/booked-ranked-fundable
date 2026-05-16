import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface AuditFormSectionProps {
  headline: string;
  subcopy: string;
  nicheKey: string;
  nicheName?: string;
}

export default function AuditFormSection({
  headline,
  subcopy,
  nicheKey,
  nicheName,
}: AuditFormSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    website: "",
    email: "",
    phone: "",
    serviceArea: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate brief processing
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
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
          {submitted ? (
            <div
              data-ocid="audit_form.success_state"
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                You're on the list!
              </h3>
              <p className="text-slate-200 max-w-sm mx-auto">
                We'll review your business and send your personalized growth
                audit report within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              data-ocid="audit_form.modal"
              className="space-y-5"
            >
              {/* Hidden niche field */}
              <input type="hidden" name="niche" value={nicheKey} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="audit-business"
                    className="text-slate-200 text-sm"
                  >
                    Business Name *
                  </Label>
                  <Input
                    id="audit-business"
                    data-ocid="audit_form.input"
                    placeholder="Your Business Name"
                    value={form.businessName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, businessName: e.target.value }))
                    }
                    required
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="audit-website"
                    className="text-slate-200 text-sm"
                  >
                    Website URL *
                  </Label>
                  <Input
                    id="audit-website"
                    data-ocid="audit_form.input"
                    type="url"
                    placeholder="https://yourbusiness.com"
                    value={form.website}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, website: e.target.value }))
                    }
                    required
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-200"
                  />
                </div>
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
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="audit-phone"
                    className="text-slate-200 text-sm"
                  >
                    Phone (optional)
                  </Label>
                  <Input
                    id="audit-phone"
                    data-ocid="audit_form.input"
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="audit-area"
                    className="text-slate-200 text-sm"
                  >
                    Service Area (optional)
                  </Label>
                  <Input
                    id="audit-area"
                    data-ocid="audit_form.input"
                    placeholder="City, State"
                    value={form.serviceArea}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, serviceArea: e.target.value }))
                    }
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-200"
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
                  "Preparing your audit..."
                ) : (
                  <>
                    {buttonLabel} <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-slate-200 text-center">
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
