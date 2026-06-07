import {
  Activity,
  Building2,
  DollarSign,
  Droplets,
  Home,
  Smile,
  Sparkles,
  Star,
  Thermometer,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useId, useState } from "react";

interface NicheCard {
  key: string;
  label: string;
  tagline: string;
  Icon: React.ElementType;
}

const NICHES: NicheCard[] = [
  {
    key: "plumbing",
    label: "Plumbing",
    tagline: "Stop losing emergency calls",
    Icon: Wrench,
  },
  {
    key: "med-spa",
    label: "Med Spa",
    tagline: "Convert more consultations",
    Icon: Sparkles,
  },
  {
    key: "hvac",
    label: "HVAC",
    tagline: "Win every peak-season call",
    Icon: Thermometer,
  },
  {
    key: "restoration",
    label: "Restoration",
    tagline: "Capture high-ticket jobs first",
    Icon: Droplets,
  },
  {
    key: "carpet-cleaning",
    label: "Carpet Cleaning",
    tagline: "Book more local appointments",
    Icon: Star,
  },
  {
    key: "roofing",
    label: "Roofing",
    tagline: "Win storm leads before anyone",
    Icon: Home,
  },
  {
    key: "real-estate",
    label: "Real Estate Agents/Brokers",
    tagline: "Respond first, win the deal",
    Icon: Building2,
  },
  {
    key: "mortgage",
    label: "Mortgage Brokers",
    tagline: "Pre-qualify every inquiry",
    Icon: DollarSign,
  },
  {
    key: "chiropractor",
    label: "Chiropractic",
    tagline: "Fill your schedule 24/7",
    Icon: Activity,
  },
  {
    key: "dental",
    label: "Dental",
    tagline: "Never miss a patient again",
    Icon: Smile,
  },
];

interface DemoNicheSelectorProps {
  onSelect: (niche: string) => void;
}

export default function DemoNicheSelector({
  onSelect,
}: DemoNicheSelectorProps) {
  const [inputName, setInputName] = useState("");
  const inputId = useId();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16 z-[50] relative">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            Interactive Demo
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            Which best describes your business?
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            We&apos;ll tailor everything you&apos;re about to see to your
            industry — voice scripts, leads, social posts, and savings.
          </p>
        </div>

        {/* Optional business name */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-sm">
            <label
              htmlFor={inputId}
              className="text-xs text-slate-500 uppercase tracking-widest mb-2 block text-center"
            >
              Enter your business name (optional)
            </label>
            <input
              id={inputId}
              type="text"
              data-ocid="services_demo.business_name_input"
              placeholder="e.g., Mike's Plumbing"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Niche grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {NICHES.map((niche, i) => {
            const Icon = niche.Icon;
            return (
              <motion.button
                key={niche.key}
                type="button"
                data-ocid={`services_demo.niche_card.${i + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (inputName.trim()) {
                    sessionStorage.setItem(
                      "brf_demo_biz_name",
                      inputName.trim(),
                    );
                  }
                  onSelect(niche.key);
                }}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-white/10 bg-white/3 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-200 text-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 group-hover:bg-indigo-500/25 border border-indigo-500/20 flex items-center justify-center transition-colors duration-200">
                  <Icon size={20} className="text-indigo-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white leading-tight mb-0.5">
                    {niche.label}
                  </div>
                  <div className="text-xs text-slate-500 group-hover:text-slate-400 leading-tight transition-colors">
                    {niche.tagline}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          No sign-up required · 5-minute guided experience · See real-time AI in
          action
        </p>
      </motion.div>
    </div>
  );
}
