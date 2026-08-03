import { useActor } from "@/hooks/useActor";
import { type SessionData, useDemoFlow } from "@/hooks/useDemoFlow";
import { useEffect, useState } from "react";

const NICHES = [
  "Plumbing",
  "HVAC",
  "Roofing",
  "Medical/Dental",
  "Med Spa",
  "Real Estate",
  "Mortgage",
  "Restoration",
  "Landscaping",
  "General Contractor",
];

interface Props {
  onNext: () => void;
}

type AuditMode = "live" | "unreachable" | "no_website";

interface StoredAudit {
  mode: AuditMode;
  website?: string;
  auditedAt: string;
  result?: unknown;
  error?: string;
}

export default function DemoStep0Intake({ onNext }: Props) {
  const { setSessionData } = useDemoFlow();
  const { actor } = useActor();
  const [isLoading, setIsLoading] = useState(false);
  const [noWebsite, setNoWebsite] = useState(false);
  const [statusText, setStatusText] = useState("Setting up your demo...");

  const urlNiche =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("niche") ?? "")
      : "";
  const routerState = (() => {
    try {
      return (window.history?.state?.usr ?? {}) as Record<
        string,
        string | boolean
      >;
    } catch {
      return {} as Record<string, string | boolean>;
    }
  })();
  const skipNichePicker =
    !!routerState.skipNichePicker ||
    urlNiche.toLowerCase() === "roofing" ||
    String(routerState.niche ?? "").toLowerCase() === "roofing";
  const prefilledNiche = skipNichePicker
    ? "Roofing"
    : urlNiche || String(routerState.niche ?? "") || "";

  const [form, setForm] = useState({
    firstName: String(routerState.firstName ?? ""),
    businessName: String(routerState.businessName ?? ""),
    city: String(routerState.city ?? ""),
    niche: prefilledNiche,
    phone: String(routerState.phone ?? ""),
    email: String(routerState.email ?? ""),
    website: String(routerState.website ?? ""),
  });

  const set = (field: string, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const canSubmit =
    form.firstName.trim() !== "" &&
    form.businessName.trim() !== "" &&
    form.city.trim() !== "" &&
    (skipNichePicker || form.niche !== "") &&
    form.phone.trim() !== "" &&
    form.email.includes("@") &&
    (noWebsite || form.website.trim() !== "");

  const runWebsiteAudit = async (): Promise<void> => {
    if (noWebsite) {
      const stored: StoredAudit = {
        mode: "no_website",
        auditedAt: new Date().toISOString(),
      };
      sessionStorage.setItem("demoWebsiteAudit", JSON.stringify(stored));
      return;
    }

    setStatusText("Running a live website audit...");
    try {
      const response = await fetch("/api/nemotron-audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          website: form.website,
          businessName: form.businessName,
          niche: form.niche || "Roofing",
          city: form.city,
        }),
      });
      const result = (await response.json()) as Record<string, unknown>;
      if (!response.ok || result.ok === false) {
        throw new Error(String(result.error || "The website could not be audited."));
      }
      const stored: StoredAudit = {
        mode: "live",
        website: form.website,
        auditedAt: new Date().toISOString(),
        result,
      };
      sessionStorage.setItem("demoWebsiteAudit", JSON.stringify(stored));
    } catch (error) {
      const stored: StoredAudit = {
        mode: "unreachable",
        website: form.website,
        auditedAt: new Date().toISOString(),
        error:
          error instanceof Error
            ? error.message
            : "The website could not be audited.",
      };
      sessionStorage.setItem("demoWebsiteAudit", JSON.stringify(stored));
    }
  };

  const submitForm = async () => {
    setIsLoading(true);
    setStatusText("Setting up your demo...");
    let sessionId: string | null = null;

    try {
      if (actor) {
        sessionId = await actor.createDemoSessionWithCity(
          form.businessName,
          form.niche || "Roofing",
          form.city,
        );
      }
    } catch {}

    try {
      if (actor && sessionId) {
        await actor.activateTrial(
          sessionId,
          form.firstName,
          form.businessName,
          form.city,
          form.niche || "Roofing",
          form.phone,
          form.email,
          noWebsite ? "" : form.website,
        );
      }
    } catch {}

    await runWebsiteAudit();

    const data: SessionData = {
      ...form,
      website: noWebsite ? "" : form.website,
      niche: form.niche || "Roofing",
      sessionId,
    };
    setSessionData(data);
    setIsLoading(false);
    onNext();
  };

  useEffect(() => {
    if (
      skipNichePicker &&
      form.firstName.trim() !== "" &&
      form.businessName.trim() !== "" &&
      form.city.trim() !== "" &&
      form.phone.trim() !== "" &&
      form.email.includes("@") &&
      (form.website.trim() !== "" || noWebsite)
    ) {
      void submitForm();
    }
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await submitForm();
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/40 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-4">
            90-Second Business Demo
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            See BRF Work for Your Business
          </h1>
          <p className="text-gray-400 text-sm">
            Enter your details and we’ll run a real website check when possible.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="demo-firstName" className="block text-xs text-gray-400 mb-1 font-medium">First Name</label>
              <input id="demo-firstName" data-ocid="demo.first_name.input" type="text" placeholder="John" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
            <div>
              <label htmlFor="demo-businessName" className="block text-xs text-gray-400 mb-1 font-medium">Business Name</label>
              <input id="demo-businessName" data-ocid="demo.business_name.input" type="text" placeholder="Smith Plumbing" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="demo-city" className="block text-xs text-gray-400 mb-1 font-medium">City</label>
              <input id="demo-city" data-ocid="demo.city.input" type="text" placeholder="Los Angeles" value={form.city} onChange={(e) => set("city", e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
            {skipNichePicker ? (
              <div>
                <p className="block text-xs text-gray-400 mb-1 font-medium">Business Type</p>
                <div data-ocid="demo.niche.locked_badge" className="w-full bg-gray-900 border border-emerald-700/50 rounded-xl px-4 py-3 text-emerald-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" /> Roofing Company
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="demo-niche" className="block text-xs text-gray-400 mb-1 font-medium">Business Type</label>
                <select id="demo-niche" data-ocid="demo.niche.select" value={form.niche} onChange={(e) => set("niche", e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors">
                  <option value="" className="bg-gray-900">Select type...</option>
                  {NICHES.map((niche) => <option key={niche} value={niche} className="bg-gray-900">{niche}</option>)}
                </select>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="demo-phone" className="block text-xs text-gray-400 mb-1 font-medium">Phone Number</label>
            <input id="demo-phone" data-ocid="demo.phone.input" type="tel" placeholder="(555) 123-4567" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors" />
          </div>

          <div>
            <label htmlFor="demo-email" className="block text-xs text-gray-400 mb-1 font-medium">Email Address</label>
            <input id="demo-email" data-ocid="demo.email.input" type="email" placeholder="john@smithplumbing.com" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors" />
          </div>

          <div>
            <label htmlFor="demo-website" className="block text-xs text-gray-400 mb-1 font-medium">Business Website</label>
            <input id="demo-website" data-ocid="demo.website.input" type="text" disabled={noWebsite} placeholder="smithplumbing.com" value={form.website} onChange={(e) => set("website", e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-40" />
            <label className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <input type="checkbox" checked={noWebsite} onChange={(event) => setNoWebsite(event.target.checked)} className="accent-purple-500" data-ocid="demo.no_website.checkbox" />
              I don’t have a website yet
            </label>
          </div>

          <div className="rounded-xl border border-blue-800/40 bg-blue-950/30 px-4 py-3 text-xs leading-5 text-blue-200">
            A working website gets a live, evidence-based homepage audit. If it cannot be reached, we’ll say so instead of inventing a score.
          </div>

          <button data-ocid="demo.start_demo.submit_button" type="button" onClick={handleSubmit} disabled={!canSubmit || isLoading} className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/25 mt-2">
            {isLoading ? statusText : "Start My 90-Second Demo →"}
          </button>

          <p className="text-center text-xs text-gray-500">No credit card. No commitment.</p>
        </div>
      </div>
    </div>
  );
}
