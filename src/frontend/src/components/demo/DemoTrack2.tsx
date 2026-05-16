import { Link } from "@tanstack/react-router";
import {
  BarChart2,
  Bot,
  CheckCircle2,
  Globe,
  Layers,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

// Niche-specific priorities for the command center
const NICHE_PRIORITIES: Record<string, string[]> = {
  plumbing: [
    "Follow up with John D. re: pipe repair estimate",
    "Review request pending for completed job",
    "Social post scheduled for 2pm",
  ],
  roofing: [
    "Call back storm lead from last night",
    "Review request pending for 3 completed jobs",
    "Google ranking improved — +2 positions",
  ],
  hvac: [
    "Maintenance plan offer pending for 5 completed jobs",
    "Peak-season campaign starts tomorrow",
    "Review request pending",
  ],
  "med-spa": [
    "Follow up with consultation from Tuesday",
    "New treatment post scheduled for Instagram at noon",
    "Client reactivation sequence running — 8 prospects",
  ],
  "carpet-cleaning": [
    "Saturday job confirmed — 4 rooms, pet stains noted",
    "Review request pending for Friday's job",
    "Yelp listing optimization running",
  ],
  restoration: [
    "Urgent: 2 storm leads uncontacted — follow up now",
    "Insurance claim documentation pending for 1 job",
    "Emergency campaign live — 3 active prospects",
  ],
  "real-estate": [
    "New buyer lead from Zillow — call back within 5 min",
    "Showing booked: 123 Elm St, Thursday 3pm",
    "Review request pending for recent closing",
  ],
  mortgage: [
    "Pre-qual call scheduled for 2pm today",
    "Realtor follow-up sequence running — 4 partners",
    "New inquiry from after-hours — pre-qual started",
  ],
  chiropractor: [
    "3 patients due for reactivation outreach today",
    "No-show reminder sent for tomorrow's schedule",
    "Review request pending — 2 visits completed",
  ],
  dental: [
    "6 patients overdue for recall — sequence running",
    "Confirm tomorrow's 8am cleaning",
    "Review request pending for today's cleanings",
  ],
};

// Niche-specific CRM lead types
const NICHE_LEADS: Record<
  string,
  { name: string; job: string; source: string }[]
> = {
  plumbing: [
    { name: "Sarah M.", job: "Burst pipe repair", source: "AI Receptionist" },
    { name: "Tom K.", job: "Water heater replacement", source: "Chat Widget" },
    { name: "Lisa R.", job: "Drain cleaning", source: "Facebook DM" },
    { name: "Mark J.", job: "Leak detection", source: "AI Receptionist" },
    { name: "Anna B.", job: "Emergency repair", source: "Chat Widget" },
    { name: "Chris P.", job: "Full inspection", source: "Chat Widget" },
  ],
  roofing: [
    {
      name: "Dave W.",
      job: "Storm damage inspection",
      source: "AI Receptionist",
    },
    { name: "Karen H.", job: "Full roof replacement", source: "Chat Widget" },
    { name: "Mike S.", job: "Emergency tarping", source: "Facebook DM" },
    { name: "Janet L.", job: "Shingle repair", source: "AI Receptionist" },
    { name: "Bob T.", job: "Insurance claim help", source: "Chat Widget" },
    { name: "Sue A.", job: "Commercial estimate", source: "Chat Widget" },
  ],
  hvac: [
    { name: "Ryan M.", job: "AC not cooling", source: "AI Receptionist" },
    { name: "Pam K.", job: "Furnace replacement", source: "Chat Widget" },
    { name: "Gary S.", job: "Maintenance plan", source: "Facebook DM" },
    { name: "Lisa V.", job: "Emergency repair", source: "AI Receptionist" },
    { name: "Tom G.", job: "New installation", source: "Chat Widget" },
    { name: "Dana B.", job: "Duct cleaning", source: "Chat Widget" },
  ],
  "med-spa": [
    { name: "Emma L.", job: "Botox consultation", source: "AI Receptionist" },
    { name: "Claire W.", job: "Filler inquiry", source: "Chat Widget" },
    { name: "Jessica P.", job: "Laser consult", source: "Instagram DM" },
    { name: "Ashley M.", job: "Skin treatment", source: "AI Receptionist" },
    { name: "Nicole H.", job: "Package inquiry", source: "Chat Widget" },
    { name: "Rachel T.", job: "Free consult", source: "Chat Widget" },
  ],
  "carpet-cleaning": [
    { name: "John B.", job: "4-room cleaning", source: "AI Receptionist" },
    { name: "Tina G.", job: "Pet stain removal", source: "Chat Widget" },
    { name: "Greg M.", job: "Commercial office", source: "Facebook DM" },
    { name: "Sandy F.", job: "Move-out cleaning", source: "AI Receptionist" },
    { name: "Phil A.", job: "Upholstery cleaning", source: "Chat Widget" },
    { name: "Donna C.", job: "Area rug cleaning", source: "Chat Widget" },
  ],
  restoration: [
    {
      name: "Paul T.",
      job: "Water damage assessment",
      source: "AI Receptionist",
    },
    { name: "Marie S.", job: "Mold remediation", source: "Chat Widget" },
    { name: "Steve K.", job: "Fire damage cleanup", source: "Facebook DM" },
    { name: "Amy H.", job: "Basement flooding", source: "AI Receptionist" },
    { name: "Ned V.", job: "Sewage backup", source: "Chat Widget" },
    { name: "Carol B.", job: "Storm damage", source: "Chat Widget" },
  ],
  "real-estate": [
    {
      name: "James H.",
      job: "Listing consultation",
      source: "AI Receptionist",
    },
    { name: "Patricia L.", job: "Buyer pre-qual", source: "Chat Widget" },
    { name: "Robert S.", job: "Home valuation", source: "Facebook DM" },
    { name: "Linda K.", job: "Relocation buyer", source: "AI Receptionist" },
    { name: "Michael R.", job: "Investment purchase", source: "Chat Widget" },
    { name: "Susan T.", job: "First-time buyer", source: "Chat Widget" },
  ],
  mortgage: [
    {
      name: "Carlos M.",
      job: "New purchase pre-qual",
      source: "AI Receptionist",
    },
    { name: "Diana K.", job: "Refinance inquiry", source: "Chat Widget" },
    { name: "Frank P.", job: "FHA loan info", source: "Facebook DM" },
    { name: "Jennifer S.", job: "VA loan inquiry", source: "AI Receptionist" },
    { name: "Andrew B.", job: "Investment property", source: "Chat Widget" },
    { name: "Cheryl V.", job: "Pre-approval needed", source: "Chat Widget" },
  ],
  chiropractor: [
    {
      name: "Olivia B.",
      job: "Back pain — new patient",
      source: "AI Receptionist",
    },
    { name: "William T.", job: "Neck adjustment", source: "Chat Widget" },
    { name: "Sophia G.", job: "Sports injury", source: "Facebook DM" },
    { name: "Daniel M.", job: "Reactivation", source: "AI Receptionist" },
    { name: "Ava P.", job: "Migraine treatment", source: "Chat Widget" },
    { name: "Noah S.", job: "Sciatica relief", source: "Chat Widget" },
  ],
  dental: [
    {
      name: "Emily C.",
      job: "New patient cleaning",
      source: "AI Receptionist",
    },
    { name: "Jake R.", job: "Emergency — toothache", source: "Chat Widget" },
    { name: "Hannah L.", job: "Whitening consult", source: "Facebook DM" },
    {
      name: "Ethan M.",
      job: "Recall visit overdue",
      source: "AI Receptionist",
    },
    { name: "Isabella W.", job: "Invisalign inquiry", source: "Chat Widget" },
    { name: "Mason T.", job: "Crown consultation", source: "Chat Widget" },
  ],
};

const STEPS_META = [
  { label: "Command Center", Icon: BarChart2 },
  { label: "CRM & Pipeline", Icon: Users },
  { label: "Reputation Center", Icon: Star },
  { label: "Campaign Engine", Icon: Bot },
  { label: "Website Studio", Icon: Globe },
  { label: "Savings Summary", Icon: Layers },
];

const PRICING_TIERS = [
  { name: "Starter", price: "$497/mo", highlight: false },
  { name: "Growth", price: "$997/mo", highlight: true },
  { name: "Scale", price: "$1,997/mo", highlight: false },
];

const SAVINGS_ROWS = [
  {
    label: "AI Receptionist (replaces full-time receptionist)",
    rate: "$2,500–$3,500/mo",
  },
  { label: "Social Media Manager", rate: "$1,500–$3,000/mo" },
  { label: "Website Manager", rate: "$500–$1,500/mo" },
  { label: "Reputation Management Company", rate: "$300–$800/mo" },
  { label: "Corporate Credit Builder", rate: "$200–$500/mo" },
  { label: "SEO & Local Search Company", rate: "$500–$2,000/mo" },
  { label: "CRM Software", rate: "$100–$300/mo" },
  { label: "Email Marketing Platform", rate: "$100–$300/mo" },
];

interface DemoTrack2Props {
  currentStep: number;
  businessName: string;
  niche: string;
}

export default function DemoTrack2({
  currentStep,
  businessName,
  niche,
}: DemoTrack2Props) {
  const priorities = NICHE_PRIORITIES[niche] ?? NICHE_PRIORITIES.plumbing;
  const leads = NICHE_LEADS[niche] ?? NICHE_LEADS.plumbing;

  const stepMeta = STEPS_META[currentStep - 1];

  if (!stepMeta) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {currentStep === 1 && (
        <Step1CommandCenter
          businessName={businessName}
          priorities={priorities}
        />
      )}
      {currentStep === 2 && (
        <Step2CRM businessName={businessName} leads={leads} />
      )}
      {currentStep === 3 && (
        <Step3Reputation businessName={businessName} niche={niche} />
      )}
      {currentStep === 4 && (
        <Step4Campaigns businessName={businessName} niche={niche} />
      )}
      {currentStep === 5 && (
        <Step5Website businessName={businessName} niche={niche} />
      )}
      {currentStep === 6 && <Step6Savings businessName={businessName} />}
    </div>
  );
}

function Step1CommandCenter({
  businessName,
  priorities,
}: { businessName: string; priorities: string[] }) {
  const metrics = [
    { label: "New Leads Today", value: "3", color: "text-indigo-300" },
    { label: "Health Score", value: "87/100", color: "text-emerald-300" },
    { label: "Reviews This Week", value: "5", color: "text-yellow-300" },
    { label: "Credit Build Day", value: "Day 12", color: "text-purple-300" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-slate-800/60 border border-white/8 rounded-2xl p-4">
        <p className="text-xs text-slate-400 mb-3">
          Good morning! Here&apos;s your{" "}
          <span className="text-white font-medium">{businessName}</span>{" "}
          overview for today.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-slate-900/60 border border-white/5 rounded-xl p-3 text-center"
            >
              <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Mini bar chart */}
        <div className="mb-4">
          <div className="text-[10px] text-slate-500 mb-2 font-medium uppercase tracking-wider">
            Lead Volume — Last 30 Days
          </div>
          <div className="flex items-end gap-1 h-12">
            {[
              3, 5, 4, 7, 6, 8, 5, 9, 7, 10, 8, 11, 9, 12, 10, 8, 13, 11, 9, 14,
              12, 10, 15, 11, 13, 16, 14, 12, 17, 15,
            ].map((h, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static visual-only chart bars
                key={i}
                className="flex-1 rounded-sm bg-indigo-500/40 hover:bg-indigo-500/70 transition-colors"
                style={{ height: `${(h / 17) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-500 mb-2 font-medium uppercase tracking-wider">
            Today&apos;s Priorities
          </div>
          <ul className="space-y-1.5">
            {priorities.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2 text-xs text-slate-300"
              >
                <CheckCircle2
                  size={12}
                  className="text-indigo-400 mt-0.5 shrink-0"
                />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function Step2CRM({
  businessName,
  leads,
}: {
  businessName: string;
  leads: { name: string; job: string; source: string }[];
}) {
  const columns = [
    { label: "New", color: "border-indigo-500/30", items: leads.slice(0, 2) },
    {
      label: "Contacted",
      color: "border-yellow-500/30",
      items: leads.slice(2, 4),
    },
    {
      label: "Booked",
      color: "border-emerald-500/30",
      items: leads.slice(4, 5),
    },
    {
      label: "Completed",
      color: "border-slate-500/30",
      items: leads.slice(5, 6),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="text-xs text-slate-400 text-center mb-1">
        CRM Pipeline — <span className="text-white">{businessName}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {columns.map((col) => (
          <div
            key={col.label}
            className={`bg-slate-900/60 border ${col.color} rounded-xl p-3`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              {col.label}
              <span className="bg-white/8 rounded-full px-1.5 py-0.5">
                {col.items.length}
              </span>
            </div>
            <div className="space-y-2">
              {col.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-slate-800/80 border border-white/5 rounded-lg p-2"
                >
                  <div className="text-xs font-semibold text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {item.job}
                  </div>
                  <div className="mt-1 text-[9px] bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded-full inline-block">
                    {item.source}
                  </div>
                  {col.label === "Booked" && (
                    <div className="mt-0.5 text-[9px] bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded-full inline-block ml-1">
                      ✓ Confirmed
                    </div>
                  )}
                  {col.label === "Completed" && (
                    <div className="mt-0.5 text-[9px] bg-yellow-500/15 text-yellow-300 px-1.5 py-0.5 rounded-full inline-block ml-1">
                      Review Requested ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Step3Reputation({
  businessName,
}: { businessName: string; niche: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-900 border border-white/8 rounded-xl p-1">
        {[
          { label: "Google", count: 12 },
          { label: "Facebook", count: 5 },
          { label: "Yelp", count: 3 },
        ].map((t, i) => (
          <button
            key={t.label}
            type="button"
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              i === 0
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { v: "4.8", l: "Avg Rating" },
          { v: "47", l: "Reviews This Month" },
          { v: "23", l: "Requests Sent" },
        ].map((s) => (
          <div
            key={s.l}
            className="bg-slate-900/60 border border-white/8 rounded-xl p-3 text-center"
          >
            <div className="text-lg font-bold text-white">{s.v}</div>
            <div className="text-[10px] text-slate-500">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Review cards */}
      <div className="space-y-2">
        <div className="bg-slate-800/60 border border-white/8 rounded-xl p-3">
          <div className="flex items-start justify-between mb-1.5">
            <div>
              <div className="flex items-center gap-1">
                <Star size={11} className="fill-yellow-400 text-yellow-400" />
                <Star size={11} className="fill-yellow-400 text-yellow-400" />
                <Star size={11} className="fill-yellow-400 text-yellow-400" />
                <Star size={11} className="fill-yellow-400 text-yellow-400" />
                <Star size={11} className="fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-xs font-semibold text-white mt-0.5">
                Jennifer S. — 2 days ago
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
              AI Response Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            &ldquo;Amazing service! {businessName} was quick, professional, and
            very thorough. Will definitely use again!&rdquo;
          </p>
          <div className="mt-2 bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-2">
            <div className="text-[9px] text-indigo-400 font-semibold uppercase tracking-wider mb-1">
              AI Draft Response
            </div>
            <p className="text-[10px] text-slate-300 italic">
              &ldquo;Thank you so much, Jennifer! We&apos;re thrilled you had a
              great experience. Looking forward to helping you again!&rdquo;
            </p>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-white/8 rounded-xl p-3">
          <div className="flex items-center gap-1 mb-1">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <Star size={11} className="text-slate-600" />
          </div>
          <div className="text-xs font-semibold text-white mb-0.5">
            Marcus T. — 5 days ago
          </div>
          <p className="text-[11px] text-slate-400">
            &ldquo;Good work overall. Arrived on time and did a clean
            job.&rdquo;
          </p>
        </div>

        <div className="bg-slate-800/40 border border-yellow-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
          <div>
            <div className="text-xs font-semibold text-yellow-300">
              Review Request Pending
            </div>
            <div className="text-[10px] text-slate-500">
              Sent 2 hours ago to Alex M. after job completion
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Step4Campaigns({
  businessName,
  niche,
}: { businessName: string; niche: string }) {
  const nicheName = niche
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="text-center">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">
          Active Campaigns — {businessName}
        </span>
      </div>

      {/* Cold email campaign */}
      <div className="bg-slate-800/60 border border-white/8 rounded-2xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-sm font-bold text-white">
              5-Touch {nicheName} Sequence
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Cold email outreach — running on autopilot
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 px-2 py-1 rounded-full font-bold">
            Running on autopilot ✓
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "Sent", v: "47", c: "text-white" },
            { l: "Opens", v: "31", c: "text-indigo-300" },
            { l: "Replies", v: "8", c: "text-emerald-300" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-slate-900/50 rounded-lg p-2 text-center"
            >
              <div className={`text-base font-bold ${s.c}`}>{s.v}</div>
              <div className="text-[9px] text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social posts */}
      <div className="bg-slate-800/60 border border-white/8 rounded-2xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-sm font-bold text-white">
              30-Day {nicheName} Social Calendar
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Pre-built niche posts — Google, Facebook, Instagram
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 px-2 py-1 rounded-full font-bold">
            Auto-scheduled ✓
          </span>
        </div>
        <div className="space-y-2">
          {[
            {
              time: "Today 2:00 PM",
              text: `Tip: How to know when you need ${niche === "hvac" ? "an HVAC service call" : niche === "dental" ? "a dental checkup" : "a professional"}`,
            },
            {
              time: "Tomorrow 10:00 AM",
              text: `Why our clients choose ${businessName} over and over`,
            },
            {
              time: "Thu 3:00 PM",
              text: `Before & After spotlight — real results from ${businessName}`,
            },
          ].map((p) => (
            <div
              key={p.time}
              className="flex items-start gap-3 bg-slate-900/40 border border-white/5 rounded-lg p-2.5"
            >
              <div className="text-[9px] text-slate-500 shrink-0 mt-0.5 w-24">
                {p.time}
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                {p.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Step5Website({
  businessName,
  niche,
}: { businessName: string; niche: string }) {
  const nicheName = niche
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Device toggle */}
      <div className="flex justify-center gap-2">
        {["📱", "📲", "🖥️"].map((icon, i) => (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: static device toggle order
            key={i}
            type="button"
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              i === 2
                ? "bg-indigo-600/30 border-indigo-500/40 text-white"
                : "border-white/10 text-slate-500 hover:text-white"
            }`}
          >
            {icon}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {/* Website preview */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-slate-800 border-b border-white/8 px-3 py-1.5 flex items-center gap-1.5">
            {["bg-red-500/60", "bg-yellow-500/60", "bg-green-500/60"].map(
              (c, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static browser dots
                <div key={i} className={`w-2 h-2 rounded-full ${c}`} />
              ),
            )}
          </div>
          <div className="p-4 bg-gradient-to-b from-indigo-950/50 to-slate-900">
            <div className="text-xs font-bold text-white mb-1">
              {businessName}
            </div>
            <div className="text-[10px] text-slate-400 mb-2">
              The #1 {nicheName} service in your area
            </div>
            <div className="h-1.5 bg-indigo-600 rounded-full w-3/4 mb-1" />
            <div className="h-1 bg-white/10 rounded-full w-1/2 mb-3" />
            <div className="bg-indigo-600/40 rounded-lg h-6 w-24 flex items-center justify-center">
              <span className="text-[9px] text-white">Get Free Quote</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-[9px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 px-1.5 py-0.5 rounded-full font-semibold">
                Section Score: 87/100
              </span>
            </div>
          </div>
        </div>

        {/* AI chat panel */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-indigo-900/40 border-b border-indigo-500/20 px-3 py-2 flex items-center gap-2">
            <Bot size={12} className="text-indigo-300" />
            <span className="text-[11px] text-indigo-200 font-semibold">
              AI Website Agent
            </span>
          </div>
          <div className="p-3 space-y-2">
            <div className="bg-slate-800 rounded-lg p-2">
              <div className="text-[9px] text-slate-500 mb-1">You asked:</div>
              <div className="text-[11px] text-slate-300">
                &ldquo;Make the headline more urgent&rdquo;
              </div>
            </div>
            <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-2">
              <div className="text-[9px] text-indigo-400 mb-1">AI Agent:</div>
              <div className="text-[11px] text-slate-300">
                Updated! Your new headline is live: &ldquo;Don&apos;t Wait — Get{" "}
                {nicheName} Help Before the Problem Gets Worse.&rdquo;
              </div>
            </div>
            <div className="text-[10px] text-slate-600 mt-1">
              Ask me to change anything about your site...
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Step6Savings({ businessName }: { businessName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-1">
          Here&apos;s What{" "}
          <span className="text-indigo-300">{businessName}</span> Just Replaced
        </h3>
        <p className="text-xs text-slate-500">
          Everything below is included in your BRF subscription
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-white/8 rounded-2xl">
        <div className="grid grid-cols-[1fr_auto_auto] bg-slate-800/80">
          <div className="py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Role / Service
          </div>
          <div className="py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
            Market Rate
          </div>
          <div className="py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
            Status
          </div>
        </div>
        {SAVINGS_ROWS.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className={`grid grid-cols-[1fr_auto_auto] border-t border-white/5 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/20"}`}
          >
            <div className="py-2 px-3 text-xs text-slate-300 leading-snug">
              {row.label}
            </div>
            <div className="py-2 px-3 text-xs text-slate-400 text-right whitespace-nowrap">
              {row.rate}
            </div>
            <div className="py-2 px-3 text-center">
              <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                ✅ Included
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Totals */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">If hired separately:</span>
          <span className="text-base font-bold text-slate-500 line-through">
            $5,700–$11,900/mo
          </span>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 text-center">
          <div className="text-xs text-emerald-400 mb-1 font-semibold uppercase tracking-wider">
            You Save
          </div>
          <div className="text-2xl font-bold text-emerald-300">
            $5,200–$11,400+ every month
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-2">
          {PRICING_TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl p-3 text-center border ${
                t.highlight
                  ? "bg-indigo-600/25 border-indigo-500/50"
                  : "bg-slate-800/50 border-white/8"
              }`}
            >
              {t.highlight && (
                <div className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider mb-1">
                  Most Popular
                </div>
              )}
              <div className="text-[10px] text-slate-400 mb-0.5">{t.name}</div>
              <div
                className={`text-sm font-bold ${t.highlight ? "text-white" : "text-slate-300"}`}
              >
                {t.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-3">
        <Link
          to="/brand-kit"
          data-ocid="services_demo.trial_cta_button"
          className="block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base py-4 px-8 rounded-2xl shadow-xl shadow-indigo-900/40 transition-all duration-200 text-center"
        >
          Activate Your 7-Day Free Trial — No Credit Card Required
        </Link>
        <div className="flex items-center justify-center gap-4 flex-wrap text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={11} className="text-emerald-400" /> Cancel
            anytime
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={11} className="text-emerald-400" /> We set
            everything up for you
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={11} className="text-emerald-400" /> Trial starts
            on your first real action
          </span>
        </div>
        <Link
          to="/brand-kit"
          data-ocid="services_demo.talk_to_agent_link"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Have questions? Talk to our AI agent →
        </Link>
      </div>
    </motion.div>
  );
}
