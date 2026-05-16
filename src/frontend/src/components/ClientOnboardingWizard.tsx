import { useNavigate } from "@tanstack/react-router";
import {
  Bot,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Globe,
  MessageSquare,
  Mic,
  Phone,
  Sparkles,
  UploadCloud,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

const TOTAL_STEPS = 8;

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
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
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
        data-ocid="onboarding.client.back.button"
      >
        <ChevronLeft size={16} /> Back
      </Button>
      <div className="flex items-center gap-3">
        {showSkip && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-slate-200 hover:text-slate-200 text-sm transition-colors"
            data-ocid="onboarding.client.skip.button"
          >
            Skip for now
          </button>
        )}
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold gap-1.5 shadow-lg shadow-indigo-900/40"
          data-ocid="onboarding.client.next.button"
        >
          {nextLabel} <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// Step 1: Welcome
function Step1({
  businessName,
  niche,
  city,
}: {
  businessName: string;
  niche: string;
  city: string;
}) {
  return (
    <div className="space-y-5">
      <StepHeader
        step={1}
        title="Welcome to Booked, Ranked & Fundable!"
        subtitle="Let's get your platform set up in the next few minutes. You can skip any step and come back later."
      />
      <div className="bg-slate-800/60 rounded-xl p-5 space-y-4">
        <p className="text-indigo-300 text-sm font-medium">
          Your Business Profile
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-slate-200 mb-1 block">
              Business Name
            </Label>
            <Input
              defaultValue={businessName}
              className="bg-slate-700/60 border-slate-600 text-white"
              data-ocid="onboarding.client.bizname.input"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-200 mb-1 block">
              Business Niche
            </Label>
            <Input
              defaultValue={niche}
              className="bg-slate-700/60 border-slate-600 text-white"
              data-ocid="onboarding.client.niche.input"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs text-slate-200 mb-1 block">
              City / Service Area
            </Label>
            <Input
              defaultValue={city}
              className="bg-slate-700/60 border-slate-600 text-white"
              data-ocid="onboarding.client.city.input"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs text-slate-200 mb-2 block">
            Business Logo
          </Label>
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-indigo-500/60 transition-colors cursor-pointer">
            <UploadCloud size={24} className="mx-auto text-slate-200 mb-2" />
            <p className="text-slate-200 text-xs">
              Drag & drop your logo or click to browse
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 border-slate-600 text-slate-200 hover:text-white text-xs"
              data-ocid="onboarding.client.logo.upload_button"
            >
              Upload Logo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Phone Setup
function Step2() {
  const [selected, setSelected] = useState<"new" | "port" | "forward">("new");
  const options = [
    {
      id: "new" as const,
      icon: <Phone size={18} />,
      title: "Provision New Local Number",
      desc: "We'll assign a dedicated local number matching your area code. Your existing number stays unchanged.",
      input: (
        <Input
          placeholder="Area code (e.g. 619)"
          className="bg-slate-700/60 border-slate-600 text-white text-sm mt-3"
          data-ocid="onboarding.client.areacode.input"
        />
      ),
    },
    {
      id: "port" as const,
      icon: <Zap size={18} />,
      title: "Port My Existing Number",
      desc: "Transfer your current business number to the platform. Takes 2–5 days. All calls & texts route through our system.",
      input: (
        <Input
          placeholder="Your current phone number"
          className="bg-slate-700/60 border-slate-600 text-white text-sm mt-3"
          data-ocid="onboarding.client.portnumber.input"
        />
      ),
    },
    {
      id: "forward" as const,
      icon: <Globe size={18} />,
      title: "Use Call Forwarding",
      desc: "Your real number stays. Calls forward to our AI system. Set up in minutes — no porting needed.",
      input: (
        <Input
          placeholder="Number to forward from"
          className="bg-slate-700/60 border-slate-600 text-white text-sm mt-3"
          data-ocid="onboarding.client.forward.input"
        />
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <StepHeader
        step={2}
        title="Set Up Your Business Phone"
        subtitle="Choose how you want your phone number connected to the platform."
      />
      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selected === opt.id
                ? "border-indigo-500 bg-indigo-950/40"
                : "border-slate-700 bg-slate-800/40 hover:border-slate-600"
            }`}
            data-ocid={`onboarding.client.phone.${opt.id}.button`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  selected === opt.id
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-slate-700 text-slate-200"
                }`}
              >
                {opt.icon}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{opt.title}</p>
                <p className="text-slate-200 text-xs mt-0.5 leading-relaxed">
                  {opt.desc}
                </p>
                {selected === opt.id && opt.input}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 3: Campaigns
function Step3({ niche }: { niche: string }) {
  const isPlumbing = niche.toLowerCase().includes("plumb");
  const isMedSpa =
    niche.toLowerCase().includes("spa") || niche.toLowerCase().includes("med");

  const plumbingCampaigns = [
    {
      name: "Missed Call Rescue",
      desc: "Immediately recovers missed leads with a rapid SMS + email sequence. Fires within minutes of a missed call.",
    },
    {
      name: "Estimate Recovery",
      desc: "Automatically follows up with leads who received an estimate but haven't booked. 5-touch sequence over 7 days.",
    },
    {
      name: "Completed Job Review + Referral",
      desc: "Requests a Google review after every completed job and invites satisfied customers to refer a friend.",
    },
  ];

  const medSpaCampaigns = [
    {
      name: "Consultation Booking Nurture",
      desc: "Turns new inquiries into booked consultations with a 6-step email sequence over 6 days.",
    },
    {
      name: "No-Show Recovery",
      desc: "Recovers missed consultations with a 4-touch rescheduling sequence that stops when they rebook.",
    },
    {
      name: "Post-Visit Rebook + Membership Upsell",
      desc: "Drives repeat bookings and membership upgrades after every completed appointment.",
    },
  ];

  const campaigns = isPlumbing
    ? plumbingCampaigns
    : isMedSpa
      ? medSpaCampaigns
      : plumbingCampaigns;

  return (
    <div className="space-y-5">
      <StepHeader
        step={3}
        title="Your Marketing Campaigns Are Ready"
        subtitle="These campaigns are pre-activated and run automatically based on your CRM activity — no manual work needed."
      />
      <div className="space-y-3">
        {campaigns.map((c, i) => (
          <div
            key={c.name}
            className="flex items-start gap-4 p-4 rounded-xl border border-slate-700 bg-slate-800/40"
            data-ocid={`onboarding.client.campaign.item.${i + 1}`}
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-medium text-sm">{c.name}</p>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-2 py-0.5">
                  Active
                </Badge>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-4">
        <p className="text-indigo-300 text-xs leading-relaxed">
          <span className="font-semibold">Automated triggers:</span> Campaigns
          fire automatically when a contact moves through your CRM pipeline. You
          stay in full control with per-campaign toggle switches.
        </p>
      </div>
    </div>
  );
}

// Step 4: Chat Widget
function Step4({ businessName }: { businessName: string }) {
  const [copied, setCopied] = useState(false);
  const embedCode = `<script src="https://brf-widget.cdn.io/embed.js" data-business="${businessName.toLowerCase().replace(/\s+/g, "-")}" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      toast.success("Embed code copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <StepHeader
        step={4}
        title="Your AI Chat Widget Is Ready to Embed"
        subtitle="Paste the code below on your website to start capturing leads automatically — 24/7, even when you're unavailable."
      />
      {/* Widget preview */}
      <div className="relative bg-slate-800/60 rounded-xl p-4 border border-slate-700">
        <p className="text-xs text-slate-200 mb-3 uppercase tracking-wide font-medium">
          Live Preview
        </p>
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl max-w-xs">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center gap-2">
            <MessageSquare size={14} className="text-white" />
            <span className="text-white text-xs font-semibold">
              {businessName}
            </span>
            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="p-3 space-y-2">
            <div className="bg-slate-700/50 rounded-lg p-2.5 text-xs text-slate-200 max-w-[80%]">
              Hi! I'm the virtual assistant for {businessName}. How can I help
              you today?
            </div>
            <div className="bg-indigo-600/30 rounded-lg p-2.5 text-xs text-indigo-200 max-w-[80%] ml-auto">
              I need a quote for my project
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2.5 text-xs text-slate-200 max-w-[90%]">
              Happy to help! Can I get your name and contact info so we can
              follow up?
            </div>
          </div>
        </div>
      </div>
      {/* Embed code */}
      <div>
        <Label className="text-xs text-slate-200 mb-2 block">
          Your Embed Code
        </Label>
        <div className="relative bg-slate-900 rounded-xl border border-slate-700 p-4 font-mono text-xs text-indigo-300 break-all">
          {embedCode}
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors"
            data-ocid="onboarding.client.embedcode.button"
          >
            {copied ? (
              <CheckCircle size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
        <p className="text-slate-200 text-xs mt-2">
          Paste this just before the{" "}
          <code className="text-slate-200">&lt;/body&gt;</code> tag on your
          website.
        </p>
      </div>
    </div>
  );
}

// Step 5: Voice Agent
function Step5({ businessName }: { businessName: string }) {
  const [greeting, setGreeting] = useState(
    `Thank you for calling ${businessName}! We're here to help.`,
  );
  const [afterHours, setAfterHours] = useState(
    `You've reached ${businessName} after hours. Leave your name and number and we'll call you back first thing in the morning.`,
  );
  const [emergencyRouting, setEmergencyRouting] = useState(true);

  return (
    <div className="space-y-5">
      <StepHeader
        step={5}
        title="Configure Your AI Voice Agent"
        subtitle="Customize how your AI agent answers calls. These settings can be updated anytime."
      />
      <div className="space-y-4">
        <div>
          <Label className="text-xs text-slate-200 mb-1 block">
            Business Greeting
          </Label>
          <textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            rows={3}
            className="w-full bg-slate-800/60 border border-slate-600 rounded-xl p-3 text-white text-sm resize-none focus:outline-none focus:border-indigo-500 placeholder:text-slate-200"
            data-ocid="onboarding.client.greeting.textarea"
          />
        </div>
        <div>
          <Label className="text-xs text-slate-200 mb-1 block">
            After-Hours Message
          </Label>
          <textarea
            value={afterHours}
            onChange={(e) => setAfterHours(e.target.value)}
            rows={3}
            className="w-full bg-slate-800/60 border border-slate-600 rounded-xl p-3 text-white text-sm resize-none focus:outline-none focus:border-indigo-500 placeholder:text-slate-200"
            data-ocid="onboarding.client.afterhours.textarea"
          />
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-700 bg-slate-800/40">
          <div>
            <p className="text-white text-sm font-medium">
              Emergency Call Routing
            </p>
            <p className="text-slate-200 text-xs mt-0.5">
              Route urgent calls directly to your phone, bypassing the AI queue
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEmergencyRouting((v) => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              emergencyRouting ? "bg-indigo-600" : "bg-slate-600"
            }`}
            data-ocid="onboarding.client.emergency.toggle"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                emergencyRouting ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 6: Google Business Profile
function Step6() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      toast.success("Google Business Profile connected!");
    }, 1800);
  };

  return (
    <div className="space-y-5">
      <StepHeader
        step={6}
        title="Connect Your Google Business Profile"
        subtitle="Connecting Google lets us monitor your reviews, track ranking changes, and flag listing issues automatically."
      />
      <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <Globe size={26} className="text-blue-400" />
        </div>
        {connected ? (
          <div data-ocid="onboarding.client.google.success_state">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle size={20} className="text-emerald-400" />
              <p className="text-emerald-400 font-semibold">
                Google Profile Connected!
              </p>
            </div>
            <p className="text-slate-200 text-sm">
              We'll start monitoring your reviews, rankings, and listing health
              automatically.
            </p>
          </div>
        ) : (
          <>
            <p className="text-white font-medium mb-1">Connect with Google</p>
            <p className="text-slate-200 text-sm mb-5">
              Authorize read-only access to your Google Business Profile data.
            </p>
            <Button
              onClick={handleConnect}
              disabled={connecting}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold gap-2"
              data-ocid="onboarding.client.google.button"
            >
              {connecting ? (
                <span className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-blue-500 rounded-full" />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Google logo"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Connect with Google
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// Step 7: Fundability Score
function Step7() {
  const pillars = [
    { name: "Business Credit Profile", score: 45, color: "bg-amber-500" },
    { name: "Banking & Cash Flow", score: 72, color: "bg-blue-500" },
    { name: "Legal & Compliance", score: 80, color: "bg-emerald-500" },
    { name: "Revenue Stability", score: 65, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-5">
      <StepHeader
        step={7}
        title="Your Fundability Snapshot"
        subtitle="Based on your business profile, here's where you stand today and what to improve first."
      />
      {/* Score circle */}
      <div className="flex items-center gap-6 p-5 rounded-xl border border-slate-700 bg-slate-800/40">
        <div className="relative w-24 h-24 shrink-0">
          <svg
            viewBox="0 0 36 36"
            className="w-24 h-24 -rotate-90"
            role="img"
            aria-label="Fundability score chart"
          >
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#1e293b"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeDasharray="67, 100"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">67</span>
            <span className="text-slate-200 text-[10px]">/100</span>
          </div>
        </div>
        <div>
          <p className="text-white font-semibold mb-1">Fundability Score</p>
          <p className="text-slate-200 text-xs leading-relaxed">
            Your business is in the top 33% of local businesses — but there are
            2 key gaps holding you back from premium financing.
          </p>
        </div>
      </div>
      {/* Pillars */}
      <div className="space-y-3">
        {pillars.map((p, i) => (
          <div
            key={p.name}
            data-ocid={`onboarding.client.fundability.item.${i + 1}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-200 text-xs">{p.name}</span>
              <span className="text-white text-xs font-semibold">
                {p.score}%
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${p.color}`}
                style={{ width: `${p.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Action item */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
        <Zap size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-300 text-sm font-medium">
            Top Priority Action
          </p>
          <p className="text-slate-200 text-xs mt-1">
            Open a dedicated business checking account to increase your
            fundability score by +12 points and unlock access to $50K–$250K in
            business financing.
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 8: All Set
function Step8({
  firstName,
  businessName,
}: {
  firstName: string;
  businessName: string;
}) {
  return (
    <div className="space-y-5 text-center">
      <div className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
          Step 8 of 8
        </p>
        {/* Confetti burst */}
        <div className="text-4xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-white">
          You're Live, {firstName}!
        </h2>
        <p className="text-slate-200 text-sm mt-2">
          Your platform is fully configured and running. Here's your AI Business
          Manager briefing.
        </p>
      </div>
      {/* AI greeting card */}
      <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-700/40 rounded-2xl p-5 text-left">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wide">
                AI Business Manager
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-white text-sm leading-relaxed">
              Good morning,{" "}
              <span className="text-indigo-300 font-semibold">{firstName}</span>
              . <span className="font-semibold">{businessName}</span> is now
              fully set up on the platform. You have{" "}
              <span className="text-emerald-400 font-semibold">
                3 active campaigns
              </span>{" "}
              running, your SEO audit is{" "}
              <span className="text-indigo-300 font-semibold">
                scheduled for tonight
              </span>
              , and your fundability score has{" "}
              <span className="text-amber-400 font-semibold">
                2 action items
              </span>{" "}
              ready for you. Let's make today count.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-2">
        {[
          {
            icon: <Zap size={16} />,
            label: "3 Campaigns Active",
            color: "text-emerald-400",
          },
          {
            icon: <Bot size={16} />,
            label: "AI Agent Ready",
            color: "text-indigo-400",
          },
          {
            icon: <CheckCircle size={16} />,
            label: "Platform Live",
            color: "text-purple-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/60 rounded-xl p-3 text-center"
          >
            <div className={`${stat.color} flex justify-center mb-1`}>
              {stat.icon}
            </div>
            <p className="text-slate-200 text-[11px] font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientOnboardingWizard() {
  const {
    currentUser,
    currentTenantId,
    tenants,
    demoInfo,
    markOnboardingComplete,
  } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const tenant = tenants.find((t) => t.id === currentTenantId);
  const businessName =
    demoInfo?.businessName ?? tenant?.name ?? "Your Business";
  const niche = demoInfo?.niche ?? tenant?.type ?? "Plumbing";
  const city = demoInfo?.city ?? tenant?.address ?? "Your City";
  const firstName = currentUser?.name ?? "there";

  const progress = (step / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };
  const handleSkip = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };
  const handleFinish = () => {
    markOnboardingComplete(currentTenantId);
    navigate({ to: "/dashboard" });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 businessName={businessName} niche={niche} city={city} />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 niche={niche} />;
      case 4:
        return <Step4 businessName={businessName} />;
      case 5:
        return <Step5 businessName={businessName} />;
      case 6:
        return <Step6 />;
      case 7:
        return <Step7 />;
      case 8:
        return <Step8 firstName={firstName} businessName={businessName} />;
      default:
        return null;
    }
  };

  const getNextLabel = () => {
    if (step === 1) return "Looks Good, Let's Go";
    if (step === 5) return "Save & Continue";
    if (step === 7) return "Got It, Let's Finish";
    return "Continue";
  };

  const showSkip = [2, 4, 6].includes(step);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto"
      data-ocid="onboarding.client.modal"
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                BRF
              </div>
              <span className="text-slate-200 text-sm">Setup Wizard</span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i).map(
                (stepIdx) => (
                  <div
                    key={`step-dot-${stepIdx}`}
                    className={`h-1.5 rounded-full transition-all ${
                      stepIdx + 1 < step
                        ? "bg-indigo-500 w-4"
                        : stepIdx + 1 === step
                          ? "bg-indigo-400 w-6"
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
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-10 shadow-xl shadow-indigo-900/40"
                  data-ocid="onboarding.client.dashboard.primary_button"
                >
                  Go to My Dashboard →
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
