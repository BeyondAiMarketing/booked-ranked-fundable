// ARCHIVED — replaced by new DemoPage.tsx (Version 113). Preserved for rollback.
import { BookDemoTrigger } from "@/components/BookDemoModal";
import PublicFooter from "@/components/PublicFooter";
import PublicNav from "@/components/PublicNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bath,
  Brain,
  Building2,
  ChevronRight,
  Droplets,
  LayoutDashboard,
  Leaf,
  Thermometer,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// ─── Types ───────────────────────────────────
type DemoNiche =
  | "Plumbing"
  | "Med Spa"
  | "HVAC"
  | "Restoration"
  | "Carpet Cleaning"
  | "Roofing";

type DemoStep = "landing" | "intake" | "capabilities" | "backoffice";

const NICHES: {
  value: DemoNiche;
  label: string;
  icon: React.ElementType;
  color: string;
  nicheId: string;
}[] = [
  {
    value: "Plumbing",
    label: "Plumbing",
    icon: Wrench,
    color: "text-blue-400",
    nicheId: "plumbing",
  },
  {
    value: "Med Spa",
    label: "Med Spa",
    icon: Bath,
    color: "text-pink-400",
    nicheId: "med-spa",
  },
  {
    value: "HVAC",
    label: "HVAC",
    icon: Thermometer,
    color: "text-orange-400",
    nicheId: "hvac",
  },
  {
    value: "Restoration",
    label: "Restoration",
    icon: Droplets,
    color: "text-cyan-400",
    nicheId: "restoration",
  },
  {
    value: "Carpet Cleaning",
    label: "Carpet Cleaning",
    icon: Leaf,
    color: "text-emerald-400",
    nicheId: "carpet-cleaning",
  },
  {
    value: "Roofing",
    label: "Roofing",
    icon: Wind,
    color: "text-slate-300",
    nicheId: "roofing",
  },
];

// ─── Step Progress Bar ────────────────────────
function StepIndicator({ step }: { step: DemoStep }) {
  const steps: { id: DemoStep; label: string }[] = [
    { id: "intake", label: "Your Info" },
    { id: "capabilities", label: "AI Demo" },
    { id: "backoffice", label: "Your Dashboard" },
  ];
  if (step === "landing") return null;

  const activeIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              i === activeIndex
                ? "bg-indigo-600 text-white"
                : i < activeIndex
                  ? "bg-indigo-600/30 text-indigo-300"
                  : "bg-slate-800 text-slate-500"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                i < activeIndex
                  ? "bg-indigo-400 text-indigo-950"
                  : i === activeIndex
                    ? "bg-white text-indigo-700"
                    : "bg-slate-700 text-slate-400"
              }`}
            >
              {i < activeIndex ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight size={14} className="text-slate-600" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Demo Label Badge ─────────────────────────
function DemoLabel({ step }: { step: DemoStep }) {
  if (step === "landing" || step === "intake") return null;
  const isCapabilities = step === "capabilities";
  return (
    <div className="flex justify-center mb-4">
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
          isCapabilities
            ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
            : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
        }`}
      >
        {isCapabilities ? (
          <>
            <Brain size={11} /> Step 1 of 2: AI Capabilities Demo
          </>
        ) : (
          <>
            <LayoutDashboard size={11} /> Step 2 of 2: Your Dashboard Demo
          </>
        )}
      </span>
    </div>
  );
}

// ─── Landing Step ─────────────────────────────
function LandingStep({
  onTour,
  onCapabilities,
  onBackOffice,
}: {
  onTour: () => void;
  onCapabilities: () => void;
  onBackOffice: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col">
      <PublicNav />
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-12">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-5 text-xs font-semibold tracking-wide px-4 py-1.5">
              LIVE INTERACTIVE DEMOS
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
              See BRF{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                In Action
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Two demos. One reveals the AI your customers experience — the
              other shows what you manage every day.
            </p>
          </motion.div>

          {/* Full Tour CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center mb-10"
          >
            <button
              type="button"
              data-ocid="unified_demo.full_tour.button"
              onClick={onTour}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg shadow-2xl shadow-indigo-900/50 transition-all"
            >
              <Zap size={20} />
              See Both Demos — Take the Full Tour
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>

          {/* Two cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-7 hover:border-purple-500/50 transition-all cursor-pointer group"
              onClick={onCapabilities}
              data-ocid="unified_demo.capabilities.card"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mb-5 shadow-lg">
                <Brain size={22} className="text-white" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
                Demo 1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                See the AI in Action
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                Experience the AI voice agent handling a live call, the chat
                widget qualifying leads in real-time, and the inbound AI agent —
                exactly how your customers interact.
              </p>
              <ul className="space-y-1.5 mb-6">
                {[
                  "Live AI voice agent call simulation",
                  "Chat widget qualifying leads",
                  "Call text-back automation",
                  "Fundability snapshot tool",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold group-hover:gap-3 transition-all">
                Start AI Demo <ArrowRight size={14} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-7 hover:border-emerald-500/50 transition-all cursor-pointer group"
              onClick={onBackOffice}
              data-ocid="unified_demo.backoffice.card"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center mb-5 shadow-lg">
                <LayoutDashboard size={22} className="text-white" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                Demo 2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                See Your Dashboard
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                Get a personalized look at the back-office dashboard — CRM,
                campaigns, reputation management, analytics, and all your growth
                tools — customized to your business.
              </p>
              <ul className="space-y-1.5 mb-6">
                {[
                  "Lead pipeline & CRM view",
                  "Reputation & review management",
                  "Campaign analytics",
                  "Fundability roadmap",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold group-hover:gap-3 transition-all">
                Start Dashboard Demo <ArrowRight size={14} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}

// ─── Intake Step ──────────────────────────────
function IntakeStep({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: {
    firstName: string;
    businessName: string;
    city: string;
    niche: DemoNiche;
  }) => void;
  onBack: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [niche, setNiche] = useState<DemoNiche | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "Required";
    if (!businessName.trim()) errs.businessName = "Required";
    if (!city.trim()) errs.city = "Required";
    if (!niche) errs.niche = "Please select your business type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ firstName, businessName, city, niche: niche as DemoNiche });
  };

  const selectedNiche = NICHES.find((n) => n.value === niche);
  const NicheIcon = selectedNiche?.icon ?? Building2;

  return (
    <motion.div
      key="intake"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto w-full"
    >
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
          <NicheIcon
            size={24}
            className={selectedNiche?.color ?? "text-white"}
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Let's personalize your demo
        </h2>
        <p className="text-slate-400 text-sm">
          We'll customize both demos to your business in seconds.
        </p>
      </div>

      <div
        className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl"
        data-ocid="unified_demo.intake.form"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-slate-300 mb-1.5 block">
              First Name
            </Label>
            <Input
              data-ocid="unified_demo.intake.first_name.input"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setErrors((p) => ({ ...p, firstName: "" }));
              }}
              placeholder="Your first name"
              className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 h-9 text-sm"
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-medium text-slate-300 mb-1.5 block">
              City / Area
            </Label>
            <Input
              data-ocid="unified_demo.intake.city.input"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setErrors((p) => ({ ...p, city: "" }));
              }}
              placeholder="e.g. San Diego"
              className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 h-9 text-sm"
            />
            {errors.city && (
              <p className="text-red-400 text-xs mt-1">{errors.city}</p>
            )}
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium text-slate-300 mb-1.5 block">
            Business Name
          </Label>
          <Input
            data-ocid="unified_demo.intake.business_name.input"
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value);
              setErrors((p) => ({ ...p, businessName: "" }));
            }}
            placeholder="e.g. Pacific Coast Plumbing"
            className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 h-9 text-sm"
          />
          {errors.businessName && (
            <p className="text-red-400 text-xs mt-1">{errors.businessName}</p>
          )}
        </div>

        <div>
          <Label className="text-xs font-medium text-slate-300 mb-2 block">
            Business Type
          </Label>
          <div
            className="grid grid-cols-2 gap-2"
            data-ocid="unified_demo.intake.niche.select"
          >
            {NICHES.map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setNiche(value);
                  setErrors((p) => ({ ...p, niche: "" }));
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm border transition-colors ${
                  niche === value
                    ? "bg-purple-600/30 border-purple-500 text-white font-medium"
                    : "bg-slate-700/40 border-slate-600 text-slate-300 hover:border-purple-400"
                }`}
              >
                <Icon
                  size={14}
                  className={niche === value ? "text-purple-300" : color}
                />
                {label}
              </button>
            ))}
          </div>
          {errors.niche && (
            <p className="text-red-400 text-xs mt-1">{errors.niche}</p>
          )}
        </div>

        <Button
          data-ocid="unified_demo.intake.submit_button"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-2.5 shadow-lg shadow-purple-700/20"
        >
          Continue to AI Demo →
        </Button>

        <p className="text-center text-xs text-slate-500">
          Simulated environment. No real data will be sent.
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-5 text-slate-400 text-xs hover:text-slate-300 block mx-auto transition-colors"
        data-ocid="unified_demo.intake.back.button"
      >
        ← Choose a specific demo instead
      </button>
    </motion.div>
  );
}

// ─── Capabilities Step ────────────────────────
// Lazy import DemoPage internals inline via iframe-equivalent: render as embedded section
function CapabilitiesStep({
  niche,
  firstName,
  onNext,
}: {
  niche: DemoNiche;
  firstName: string;
  onNext: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "voice" | "chat" | "fundability" | "seo"
  >("voice");

  const tabs = [
    { id: "voice" as const, label: "Voice Agent & Call Text Back", icon: "📞" },
    { id: "chat" as const, label: "Chat Widget", icon: "💬" },
    { id: "fundability" as const, label: "Fundability Snapshot", icon: "📊" },
    { id: "seo" as const, label: "SEO & GEO Snapshot", icon: "🔍" },
  ];

  return (
    <motion.div
      key="capabilities"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="text-center mb-6">
        <p className="text-slate-400 text-sm">
          Welcome, <span className="text-white font-medium">{firstName}</span>!
          Here's how AI handles your{" "}
          <span className="text-indigo-400 font-medium">{niche}</span>{" "}
          customers.
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex flex-wrap justify-center gap-1 mb-8">
        <div className="flex flex-wrap gap-1 bg-slate-900 border border-white/10 rounded-2xl p-1.5">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              data-ocid={`unified_demo.capabilities.${id}.tab`}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900 border border-white/8 rounded-3xl p-6 md:p-10 shadow-2xl mb-8"
        >
          <EmbeddedDemoTab tab={activeTab} niche={niche} />
        </motion.div>
      </AnimatePresence>

      {/* Next step CTA */}
      <div className="flex justify-center">
        <button
          type="button"
          data-ocid="unified_demo.capabilities.next.button"
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-xl shadow-emerald-900/30 transition-all"
        >
          <LayoutDashboard size={18} />
          Next: See Your Personalized Dashboard →
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Embedded Demo Tab (subset of DemoPage content) ───
function EmbeddedDemoTab({
  tab,
  niche,
}: {
  tab: "voice" | "chat" | "fundability" | "seo";
  niche: DemoNiche;
}) {
  if (tab === "voice") {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            AI Voice Agent & Call Text Back
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Your {niche} business gets an AI that answers every call and
            automatically texts back every missed one.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 text-left">
          {[
            {
              title: "AI Inbound Voice Agent",
              icon: "📞",
              color: "border-indigo-500/30 bg-indigo-500/5",
              desc: `Answers calls 24/7 — greets callers, qualifies leads, captures contact info, and books appointments. Fully niche-specific for ${niche}.`,
            },
            {
              title: "Call Text Back",
              icon: "💬",
              color: "border-purple-500/30 bg-purple-500/5",
              desc: "When a call is missed, an automated SMS is sent within 30 seconds. Every missed call becomes a CRM lead automatically.",
            },
          ].map(({ title, icon, color, desc }) => (
            <div
              key={title}
              className={`rounded-2xl border ${color} p-6 space-y-3`}
            >
              <div className="text-3xl">{icon}</div>
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              stat: "78%",
              label: "of callers go to a competitor who answers first",
              color: "text-rose-400",
            },
            {
              stat: "< 30s",
              label: "SMS auto-reply on missed call",
              color: "text-amber-400",
            },
            {
              stat: "24/7",
              label: "AI answers even when you're busy",
              color: "text-indigo-400",
            },
          ].map(({ stat, label, color }) => (
            <div
              key={stat}
              className="bg-slate-800/60 border border-white/5 rounded-xl p-4 text-center"
            >
              <p className={`text-3xl font-bold mb-1 ${color}`}>{stat}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "chat") {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">AI Chat Widget</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Your website gets a smart AI widget that qualifies visitors and
            books appointments — specific to {niche}.
          </p>
        </div>
        <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-xs">
                {niche === "Plumbing"
                  ? "North County Plumbing Pros"
                  : niche === "Med Spa"
                    ? "Revive Med Spa"
                    : niche === "HVAC"
                      ? "Comfort Zone HVAC"
                      : niche === "Restoration"
                        ? "Oceanside Clean & Restore"
                        : niche === "Carpet Cleaning"
                          ? "Fresh Step Carpet Care"
                          : "Summit Roofing Solutions"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-indigo-200 text-xs">
                  Online — AI Assistant
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3 min-h-[180px]">
            {[
              {
                role: "bot",
                text: `Hi! Welcome to ${niche === "Plumbing" ? "North County Plumbing Pros" : niche === "Med Spa" ? "Revive Med Spa" : `${niche} Service`}. How can I help you today?`,
              },
              {
                role: "user",
                text:
                  niche === "Med Spa"
                    ? "I'm interested in Botox treatments"
                    : niche === "HVAC"
                      ? "My AC stopped working"
                      : "I need help with a plumbing issue",
              },
              {
                role: "bot",
                text:
                  niche === "Med Spa"
                    ? "Of course! Let me get you booked for a free consultation. What's your name?"
                    : "I can help with that right away. What's your name and address?",
              },
            ].map((msg) => (
              <div
                key={msg.text.slice(0, 20)}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 border border-slate-200 text-slate-700"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-slate-500 text-xs">
          Full interactive demo available on the{" "}
          <a href="/demo" className="text-indigo-400 hover:text-indigo-300">
            standalone demo page →
          </a>
        </p>
      </div>
    );
  }

  if (tab === "fundability") {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Fundability Snapshot
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Instant fundability score with a gap analysis and roadmap — so your
            business is ready for the capital it needs to grow.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
          {[
            {
              label: "Business Credit Profile",
              score: 72,
              color: "text-amber-400",
            },
            {
              label: "Banking & Cash Flow",
              score: 85,
              color: "text-green-400",
            },
            { label: "Legal & Compliance", score: 60, color: "text-amber-400" },
            { label: "Revenue Stability", score: 78, color: "text-green-400" },
          ].map(({ label, score, color }) => (
            <div
              key={label}
              className="bg-slate-800/60 border border-white/5 rounded-xl p-4"
            >
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <div className={`text-2xl font-bold ${color} mb-2`}>{score}</div>
              <div className="h-1.5 bg-slate-700 rounded-full">
                <div
                  className={`h-full rounded-full ${color === "text-green-400" ? "bg-green-400" : "bg-amber-400"}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <a
          href="/demo#fundability"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
        >
          Try the full interactive tool →
        </a>
      </div>
    );
  }

  // SEO tab
  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          SEO & GEO Agent Snapshot
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Real-time visibility scores, open issues, and AI-powered
          recommendations for {niche} businesses.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "SEO Score", score: 71, color: "text-amber-400" },
          { label: "GEO Score", score: 58, color: "text-rose-400" },
          { label: "Local Visibility", score: 74, color: "text-emerald-400" },
          { label: "Conversion Ready", score: 62, color: "text-blue-400" },
        ].map(({ label, score, color }) => (
          <div
            key={label}
            className="bg-slate-800/80 border border-slate-700 rounded-xl p-4"
          >
            <p className="text-slate-400 text-xs mb-2">{label}</p>
            <div className={`text-3xl font-bold ${color} mb-2`}>{score}</div>
            <div className="h-1.5 bg-slate-700 rounded-full">
              <div
                className={`h-full rounded-full bg-current ${color}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Back Office Step ─────────────────────────
function BackOfficeStep({
  niche,
  firstName,
  businessName,
  city,
}: {
  niche: DemoNiche;
  firstName: string;
  businessName: string;
  city: string;
}) {
  const navigate = useNavigate();
  const { loginDemo } = useApp();

  const nicheEntry = NICHES.find((n) => n.value === niche);
  const nicheId = nicheEntry?.nicheId ?? "plumbing";

  const handleLaunch = () => {
    loginDemo({ firstName, businessName, niche: nicheId, city });
    navigate({ to: "/dashboard" });
  };

  return (
    <motion.div
      key="backoffice"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Your {niche} Dashboard Is Ready
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          We've built a personalized back-office demo for{" "}
          <span className="text-white font-semibold">{businessName}</span> in{" "}
          <span className="text-white font-semibold">{city}</span>. See exactly
          what you'd manage every day.
        </p>
      </div>

      {/* Dashboard preview cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "New Leads This Week",
            value: "12",
            change: "+3",
            color: "text-indigo-400",
          },
          {
            label: "Review Rating",
            value: "4.8★",
            change: "+0.2",
            color: "text-yellow-400",
          },
          {
            label: "Fundability Score",
            value: "72",
            change: "+5",
            color: "text-emerald-400",
          },
        ].map(({ label, value, change, color }) => (
          <div
            key={label}
            className="bg-slate-800 border border-white/5 rounded-xl p-5 text-center"
          >
            <p className="text-slate-400 text-xs mb-2">{label}</p>
            <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
            <p className="text-emerald-400 text-xs font-medium">
              {change} this month
            </p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            title: "Recent Leads",
            items: [
              "Mike T. — Drain Clearing",
              "Sarah K. — Estimate Request",
              "James R. — Emergency Repair",
            ],
            color: "border-indigo-500/20",
          },
          {
            title: "Recent Reviews",
            items: [
              "★★★★★ 'Fast and professional!'",
              "★★★★★ 'Best in San Diego'",
              "★★★★☆ 'Great service, on time'",
            ],
            color: "border-yellow-500/20",
          },
        ].map(({ title, items, color }) => (
          <div
            key={title}
            className={`bg-slate-900 border ${color} rounded-xl p-5`}
          >
            <h4 className="text-white font-semibold text-sm mb-3">{title}</h4>
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item}
                  className="text-slate-400 text-xs py-1.5 border-b border-white/5 last:border-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Launch + CTA */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-7 text-center space-y-5">
        <div>
          <h3 className="text-white font-bold text-xl mb-2">
            Ready to explore the full dashboard?
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Launch your personalized demo to see the complete CRM, reputation
            tools, campaigns, and more — customized to {businessName}.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            data-ocid="unified_demo.backoffice.launch.button"
            onClick={handleLaunch}
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-900/40 transition-all"
          >
            <LayoutDashboard size={16} />
            Launch My Dashboard →
          </button>
          <BookDemoTrigger
            label="Book a Live Demo Call"
            variant="outline"
            className="bg-transparent border-white/30 text-white hover:bg-white/10 font-semibold"
            data-ocid="unified_demo.backoffice.book_demo.button"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────
export default function UnifiedDemoPage() {
  const [step, setStep] = useState<DemoStep>("landing");
  const [intakeData, setIntakeData] = useState<{
    firstName: string;
    businessName: string;
    city: string;
    niche: DemoNiche;
  } | null>(null);

  // Check URL params for ?mode=capabilities|backoffice and ?niche=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const nicheParam = params.get("niche");

    const NICHE_PARAM_MAP: Record<string, DemoNiche> = {
      plumbing: "Plumbing",
      plumber: "Plumbing",
      "med-spa": "Med Spa",
      medspa: "Med Spa",
      hvac: "HVAC",
      restoration: "Restoration",
      "carpet-cleaning": "Carpet Cleaning",
      carpetcleaning: "Carpet Cleaning",
      roofing: "Roofing",
      "real-estate": "Roofing",
      realestate: "Roofing",
      mortgage: "Plumbing",
      chiropractor: "Plumbing",
      dental: "Plumbing",
    };

    const resolvedNiche: DemoNiche =
      (nicheParam ? NICHE_PARAM_MAP[nicheParam.toLowerCase()] : undefined) ??
      "Plumbing";

    if (mode === "capabilities") {
      setIntakeData({
        firstName: "Guest",
        businessName: "Your Business",
        city: "Your City",
        niche: resolvedNiche,
      });
      setStep("capabilities");
    } else if (mode === "backoffice") {
      setIntakeData({
        firstName: "Guest",
        businessName: "Your Business",
        city: "Your City",
        niche: resolvedNiche,
      });
      setStep("backoffice");
    } else if (nicheParam) {
      // niche pre-selected but no mode — go straight to intake (pre-niche will be shown on LandingStep)
      setIntakeData(null);
      setStep("intake");
    }
  }, []);

  const handleIntakeSubmit = (data: typeof intakeData) => {
    setIntakeData(data);
    setStep("capabilities");
  };

  // Landing step renders its own full-screen layout with nav + footer
  if (step === "landing") {
    return (
      <LandingStep
        onTour={() => setStep("intake")}
        onCapabilities={() => {
          setIntakeData({
            firstName: "Guest",
            businessName: "Your Business",
            city: "Your City",
            niche: "Plumbing",
          });
          setStep("capabilities");
        }}
        onBackOffice={() => {
          setIntakeData({
            firstName: "Guest",
            businessName: "Your Business",
            city: "Your City",
            niche: "Plumbing",
          });
          setStep("backoffice");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNav />

      <main className="flex-1 pt-20 pb-12 px-4">
        {/* Step indicator + demo label */}
        <div className="max-w-5xl mx-auto">
          <StepIndicator step={step} />
          <DemoLabel step={step} />
        </div>

        <div className="max-w-5xl mx-auto mt-6">
          <AnimatePresence mode="wait">
            {step === "intake" && (
              <IntakeStep
                onSubmit={handleIntakeSubmit}
                onBack={() => setStep("landing")}
              />
            )}
            {step === "capabilities" && intakeData && (
              <CapabilitiesStep
                niche={intakeData.niche}
                firstName={intakeData.firstName}
                onNext={() => setStep("backoffice")}
              />
            )}
            {step === "backoffice" && intakeData && (
              <BackOfficeStep
                niche={intakeData.niche}
                firstName={intakeData.firstName}
                businessName={intakeData.businessName}
                city={intakeData.city}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
