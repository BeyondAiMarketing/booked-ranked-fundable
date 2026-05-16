import { useNavigate } from "@tanstack/react-router";
import {
  Bot,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Mic,
  Phone,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

const TOTAL_STEPS = 7;

function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
        Step {step} of {TOTAL_STEPS}
      </p>
      <h2 className="text-2xl font-bold text-white leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-slate-200 text-sm mt-2 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function WizardNav({
  step,
  onBack,
  onNext,
  onSkip,
  nextLabel = "Continue",
  showSkip = false,
}: {
  step: number;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  showSkip?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={step === 1}
        className="text-slate-200 hover:text-white hover:bg-slate-800 gap-1.5"
        data-ocid="onboarding.agency.back.button"
      >
        <ChevronLeft size={16} /> Back
      </Button>
      <div className="flex items-center gap-3">
        {showSkip && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-slate-200 hover:text-slate-200 text-sm transition-colors"
            data-ocid="onboarding.agency.skip.button"
          >
            Skip for now
          </button>
        )}
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-semibold gap-1.5 shadow-lg shadow-amber-900/30"
          data-ocid="onboarding.agency.next.button"
        >
          {nextLabel} <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// Step 1: Welcome
function Step1({ contactName }: { contactName: string }) {
  const [agencyName, setAgencyName] = useState("My Agency");

  return (
    <div className="space-y-5">
      <StepHeader
        step={1}
        title="Welcome to the Agency Command Center"
        subtitle="You're about to set up your white-label reseller platform. Let's get your agency configured so you can start onboarding clients."
      />
      <div className="bg-slate-800/60 rounded-xl p-5 space-y-4">
        <div>
          <Label className="text-xs text-slate-200 mb-1 block">
            Agency Name
          </Label>
          <Input
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            placeholder="Your Agency Name"
            className="bg-slate-700/60 border-slate-600 text-white"
            data-ocid="onboarding.agency.name.input"
          />
        </div>
        <div>
          <Label className="text-xs text-slate-200 mb-1 block">
            Primary Contact Name
          </Label>
          <Input
            defaultValue={contactName}
            placeholder="Your full name"
            className="bg-slate-700/60 border-slate-600 text-white"
            data-ocid="onboarding.agency.contact.input"
          />
        </div>
      </div>
      <div className="bg-amber-950/30 border border-amber-700/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-200/80 text-xs leading-relaxed">
            As a white-label agency, your clients will see your brand — not
            ours. You'll set your own pricing, manage your own client roster,
            and run the full platform under your agency's name.
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 2: Brand Setup
function Step2() {
  const colors = [
    { name: "Indigo", class: "bg-indigo-600", ring: "ring-indigo-500" },
    { name: "Purple", class: "bg-purple-600", ring: "ring-purple-500" },
    { name: "Teal", class: "bg-teal-600", ring: "ring-teal-500" },
  ];
  const [selectedColor, setSelectedColor] = useState(0);
  const [agencyName, setAgencyName] = useState("");
  const [tagline, setTagline] = useState("");

  return (
    <div className="space-y-5">
      <StepHeader
        step={2}
        title="Brand Your Agency"
        subtitle="Customize how your platform looks to your clients. All of this can be updated in Settings anytime."
      />
      <div className="space-y-4">
        <div>
          <Label className="text-xs text-slate-200 mb-1 block">
            Agency Name
          </Label>
          <Input
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            placeholder="Growth Partners Agency"
            className="bg-slate-700/60 border-slate-600 text-white"
            data-ocid="onboarding.agency.brand.name.input"
          />
        </div>
        <div>
          <Label className="text-xs text-slate-200 mb-1 block">
            Tagline <span className="text-slate-600">(optional)</span>
          </Label>
          <Input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Helping local businesses grow faster"
            className="bg-slate-700/60 border-slate-600 text-white"
            data-ocid="onboarding.agency.tagline.input"
          />
        </div>
        <div>
          <Label className="text-xs text-slate-200 mb-2 block">
            Primary Color
          </Label>
          <div className="flex gap-3">
            {colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(i)}
                className={`w-10 h-10 rounded-xl ${c.class} transition-all ${
                  selectedColor === i
                    ? `ring-2 ${c.ring} ring-offset-2 ring-offset-slate-900 scale-110`
                    : ""
                }`}
                title={c.name}
                data-ocid={`onboarding.agency.color.${c.name.toLowerCase()}.button`}
              />
            ))}
          </div>
          <p className="text-slate-200 text-xs mt-2">
            Selected:{" "}
            <span className="text-slate-200">{colors[selectedColor].name}</span>
          </p>
        </div>
        <div>
          <Label className="text-xs text-slate-200 mb-2 block">
            Agency Logo
          </Label>
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-5 text-center hover:border-amber-500/60 transition-colors cursor-pointer">
            <UploadCloud size={22} className="mx-auto text-slate-200 mb-2" />
            <p className="text-slate-200 text-xs">
              Upload your logo (PNG or SVG)
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 border-slate-600 text-slate-200 hover:text-white text-xs"
              data-ocid="onboarding.agency.logo.upload_button"
            >
              Upload Logo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3: Integrations
function IntegrationCard({
  icon,
  title,
  desc,
  placeholder,
  ocid,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  placeholder: string;
  ocid: string;
}) {
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "fail">(
    "idle",
  );

  const handleTest = () => {
    if (!key.trim()) {
      toast.error("Enter an API key first");
      return;
    }
    setStatus("testing");
    setTimeout(() => {
      setStatus(key.length > 6 ? "ok" : "fail");
    }, 1500);
  };

  return (
    <div className="border border-slate-700 rounded-xl p-4 bg-slate-800/40">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{title}</p>
          <p className="text-slate-200 text-xs mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={placeholder}
          className="bg-slate-700/60 border-slate-600 text-white text-xs flex-1"
          data-ocid={ocid}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleTest}
          disabled={status === "testing"}
          className="border-slate-600 text-slate-200 hover:text-white text-xs shrink-0"
          data-ocid={`${ocid}.test.button`}
        >
          {status === "testing" ? (
            <Loader2 size={13} className="animate-spin" />
          ) : status === "ok" ? (
            <CheckCircle size={13} className="text-emerald-400" />
          ) : (
            "Test"
          )}
        </Button>
      </div>
      {status === "ok" && (
        <p
          className="text-emerald-400 text-xs mt-2 flex items-center gap-1"
          data-ocid={`${ocid}.success_state`}
        >
          <CheckCircle size={11} /> Connected successfully
        </p>
      )}
      {status === "fail" && (
        <p
          className="text-red-400 text-xs mt-2"
          data-ocid={`${ocid}.error_state`}
        >
          Connection failed — check your key
        </p>
      )}
    </div>
  );
}

function Step3() {
  return (
    <div className="space-y-5">
      <StepHeader
        step={3}
        title="Connect Your Core Services"
        subtitle="Enter your API credentials once. All client accounts automatically use them — no per-client setup needed."
      />
      <div className="space-y-3">
        <IntegrationCard
          icon={<Phone size={18} />}
          title="Twilio"
          desc="SMS review requests, voice calls, and automated messaging"
          placeholder="Account SID or Auth Token"
          ocid="onboarding.agency.twilio.input"
        />
        <IntegrationCard
          icon={<Mic size={18} />}
          title="Vapi.ai"
          desc="AI-powered inbound voice agents and call routing"
          placeholder="vapi_..."
          ocid="onboarding.agency.vapi.input"
        />
        <IntegrationCard
          icon={<Mail size={18} />}
          title="SendGrid"
          desc="Email campaign delivery and transactional emails"
          placeholder="SG.xxxxx"
          ocid="onboarding.agency.sendgrid.input"
        />
        <IntegrationCard
          icon={<Bot size={18} />}
          title="OpenAI"
          desc="Powers AI chat widget intelligence and Business Manager"
          placeholder="sk-..."
          ocid="onboarding.agency.openai.input"
        />
      </div>
    </div>
  );
}

// Step 4: Pricing
function Step4() {
  const [tiers, setTiers] = useState([
    { name: "Booked", desc: "AI booking + voice agent", price: "497" },
    {
      name: "Booked & Ranked",
      desc: "+ Reputation management & SEO",
      price: "997",
    },
    {
      name: "Booked, Ranked & Fundable",
      desc: "+ Business credit & fundability",
      price: "1997",
    },
  ]);

  return (
    <div className="space-y-5">
      <StepHeader
        step={4}
        title="Define Your Client Pricing"
        subtitle="Set the monthly rates you'll charge your clients. These are your prices — not ours. Update anytime in Settings."
      />
      <div className="space-y-3">
        {tiers.map((tier, i) => (
          <div
            key={tier.name}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-700 bg-slate-800/40"
            data-ocid={`onboarding.agency.pricing.item.${i + 1}`}
          >
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{tier.name}</p>
              <p className="text-slate-200 text-xs mt-0.5">{tier.desc}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-slate-200 text-sm">$</span>
              <Input
                value={tier.price}
                onChange={(e) =>
                  setTiers((prev) =>
                    prev.map((t, j) =>
                      j === i ? { ...t, price: e.target.value } : t,
                    ),
                  )
                }
                className="w-20 bg-slate-700/60 border-slate-600 text-white text-sm text-right"
                data-ocid={`onboarding.agency.price.${i + 1}.input`}
              />
              <span className="text-slate-200 text-sm">/mo</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
        <p className="text-slate-200 text-xs leading-relaxed">
          <span className="text-slate-200 font-medium">How it works:</span> You
          set the price, you bill the client, and you pay the platform fee. Your
          margin is the difference. Most agency owners charge 2–3x the platform
          cost.
        </p>
      </div>
    </div>
  );
}

// Step 5: Create First Client
function Step5() {
  const [form, setForm] = useState({
    bizName: "",
    ownerName: "",
    email: "",
    niche: "Plumbing",
    city: "",
  });
  const [created, setCreated] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    if (!form.bizName || !form.email) {
      toast.error("Business name and email are required");
      return;
    }
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      setCreated(true);
      toast.success(`${form.bizName} account created!`);
    }, 1800);
  };

  if (created) {
    return (
      <div className="space-y-5">
        <StepHeader step={5} title="Onboard Your First Client" />
        <div
          className="bg-emerald-950/40 border border-emerald-700/40 rounded-2xl p-6 text-center"
          data-ocid="onboarding.agency.client.success_state"
        >
          <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-white font-semibold text-lg mb-1">
            {form.bizName} is live!
          </p>
          <p className="text-slate-200 text-sm">
            Login credentials have been sent to{" "}
            <span className="text-indigo-300">{form.email}</span>. Their
            niche-matched campaigns are pre-activated and ready to go.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <StepHeader
        step={5}
        title="Onboard Your First Client"
        subtitle="Add your first client account. Their niche-matched campaign pack will be pre-activated automatically."
      />
      <div className="bg-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-slate-200 mb-1 block">
              Business Name
            </Label>
            <Input
              value={form.bizName}
              onChange={(e) =>
                setForm((f) => ({ ...f, bizName: e.target.value }))
              }
              placeholder="North County Plumbing Pros"
              className="bg-slate-700/60 border-slate-600 text-white"
              data-ocid="onboarding.agency.client.bizname.input"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-200 mb-1 block">
              Owner Name
            </Label>
            <Input
              value={form.ownerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, ownerName: e.target.value }))
              }
              placeholder="John Smith"
              className="bg-slate-700/60 border-slate-600 text-white"
              data-ocid="onboarding.agency.client.owner.input"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs text-slate-200 mb-1 block">
              Email Address
            </Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="john@ncplumbing.com"
              className="bg-slate-700/60 border-slate-600 text-white"
              data-ocid="onboarding.agency.client.email.input"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-200 mb-1 block">Niche</Label>
            <select
              value={form.niche}
              onChange={(e) =>
                setForm((f) => ({ ...f, niche: e.target.value }))
              }
              className="w-full bg-slate-700/60 border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-amber-500"
              data-ocid="onboarding.agency.client.niche.select"
            >
              <option>Plumbing</option>
              <option>Med Spa</option>
              <option>HVAC</option>
              <option>Restoration</option>
              <option>Roofing</option>
              <option>Carpet Cleaning</option>
            </select>
          </div>
          <div>
            <Label className="text-xs text-slate-200 mb-1 block">City</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="San Diego, CA"
              className="bg-slate-700/60 border-slate-600 text-white"
              data-ocid="onboarding.agency.client.city.input"
            />
          </div>
        </div>
        <Button
          onClick={handleCreate}
          disabled={creating}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-semibold"
          data-ocid="onboarding.agency.client.create.primary_button"
        >
          {creating ? (
            <Loader2 size={16} className="animate-spin mr-2" />
          ) : null}
          {creating ? "Creating Account..." : "Create Client Account"}
        </Button>
      </div>
    </div>
  );
}

// Step 6: Outreach Campaigns
function Step6() {
  const campaigns = [
    {
      name: "Plumbing Outreach Sequence",
      seq: "5 emails + 1 SMS",
      desc: "Targets plumbing business owners with missed call pain, reputation angle, and fundability hook. Stops automatically when a prospect replies or books.",
      rate: "31%",
    },
    {
      name: "Med Spa Outreach Sequence",
      seq: "5 emails + 1 SMS",
      desc: "Targets med spa operators with consultation conversion, reputation management, and growth capital positioning.",
      rate: "28%",
    },
  ];

  return (
    <div className="space-y-5">
      <StepHeader
        step={6}
        title="Your Prospect Outreach Campaigns Are Ready"
        subtitle="Use these sequences to convert plumbers and med spas into paying platform clients. Add prospects from the Campaigns section."
      />
      <div className="space-y-3">
        {campaigns.map((c, i) => (
          <div
            key={c.name}
            className="p-5 rounded-xl border border-slate-700 bg-slate-800/40"
            data-ocid={`onboarding.agency.campaign.item.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-white font-semibold text-sm">{c.name}</p>
              <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
                {c.seq}
              </span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed mb-3">
              {c.desc}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-200">
                Est. open rate:{" "}
                <span className="text-emerald-400 font-semibold">{c.rate}</span>
              </span>
              <button
                type="button"
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                data-ocid={`onboarding.agency.campaign.preview.${i + 1}.button`}
              >
                Preview Sequence →
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
        <p className="text-slate-200 text-xs leading-relaxed">
          <span className="text-slate-200 font-medium">Note:</span> Add
          prospects to these campaigns from{" "}
          <span className="text-amber-400">
            Admin → Campaigns → Prospect Outreach
          </span>
          . Import via CSV or add one at a time.
        </p>
      </div>
    </div>
  );
}

// Step 7: Ready to Scale
function Step7({ completedSteps }: { completedSteps: Set<number> }) {
  const checklist = [
    { label: "Agency branding configured", step: 2 },
    { label: "Integrations set up", step: 3 },
    { label: "Pricing tiers defined", step: 4 },
    { label: "First client created", step: 5 },
    { label: "Outreach campaigns ready", step: 6 },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
          Step 7 of 7
        </p>
        <div className="text-4xl mb-4">🚀</div>
        <h2 className="text-3xl font-bold text-white">
          Your Agency Platform Is Live
        </h2>
        <p className="text-slate-200 text-sm mt-2">
          Everything is configured. You're ready to onboard clients and grow.
        </p>
      </div>

      <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-5 space-y-2.5">
        {checklist.map((item) => {
          const done = completedSteps.has(item.step) || item.step >= 3;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  done ? "bg-emerald-500/20" : "bg-slate-700"
                }`}
              >
                {done ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                )}
              </div>
              <span
                className={`text-sm ${done ? "text-slate-200" : "text-slate-200"}`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-amber-950/40 to-orange-950/40 border border-amber-700/30 rounded-xl p-5 text-center">
        <p className="text-white font-semibold leading-relaxed">
          You now have everything you need to sign clients, run campaigns, and
          grow a scalable local marketing agency.
        </p>
      </div>
    </div>
  );
}

export default function AgencyOnboardingWizard() {
  const { currentUser, markAgencyOnboardingComplete } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [visitedSteps] = useState<Set<number>>(new Set([1]));

  const contactName = currentUser?.name ?? "Admin";
  const progress = (step / TOTAL_STEPS) * 100;

  const handleNext = () => {
    visitedSteps.add(step);
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };
  const handleSkip = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };
  const handleFinish = () => {
    markAgencyOnboardingComplete();
    navigate({ to: "/dashboard" });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 contactName={contactName} />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      case 6:
        return <Step6 />;
      case 7:
        return <Step7 completedSteps={visitedSteps} />;
      default:
        return null;
    }
  };

  const getNextLabel = () => {
    if (step === 1) return "Start Setup";
    if (step === 2) return "Save Branding & Continue";
    if (step === 4) return "Confirm Pricing & Continue";
    if (step === 6) return "Got It, Continue";
    return "Continue";
  };

  const showSkip = [3, 5].includes(step);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto"
      data-ocid="onboarding.agency.modal"
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Progress value={progress} className="h-1 rounded-none bg-slate-800" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 pt-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-slate-900 font-bold text-xs">
                BRF
              </div>
              <span className="text-slate-200 text-sm">
                Agency Setup Wizard
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i).map(
                (stepIdx) => (
                  <div
                    key={`step-dot-${stepIdx}`}
                    className={`h-1.5 rounded-full transition-all ${
                      stepIdx + 1 < step
                        ? "bg-amber-500 w-4"
                        : stepIdx + 1 === step
                          ? "bg-amber-400 w-6"
                          : "bg-slate-700 w-3"
                    }`}
                  />
                ),
              )}
            </div>
          </div>

          {/* Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            {renderStep()}

            {step < TOTAL_STEPS ? (
              <WizardNav
                step={step}
                onBack={handleBack}
                onNext={handleNext}
                onSkip={handleSkip}
                nextLabel={getNextLabel()}
                showSkip={showSkip}
              />
            ) : (
              <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <Button
                  onClick={handleFinish}
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold px-10 shadow-xl shadow-amber-900/30"
                  data-ocid="onboarding.agency.dashboard.primary_button"
                >
                  Go to Admin Dashboard →
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
