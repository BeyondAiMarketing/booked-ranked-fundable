import type { BrandKitNiche } from "@/types/brandKit";
import { NICHE_LABELS } from "@/types/brandKit";

const NICHE_ICONS: Record<BrandKitNiche, string> = {
  plumber: "🔧",
  "med-spa": "🌿",
  hvac: "❄️",
  restoration: "💧",
  "carpet-cleaning": "🧹",
  roofing: "🏠",
  "real-estate": "🏡",
  mortgage: "🏦",
  chiropractor: "⚕️",
  dental: "🦷",
};

const NICHES = Object.keys(NICHE_LABELS) as BrandKitNiche[];

interface NicheSelectorProps {
  selectedNiche: BrandKitNiche;
  onNicheSelect: (niche: BrandKitNiche) => void;
  className?: string;
}

export default function NicheSelector({
  selectedNiche,
  onNicheSelect,
  className = "",
}: NicheSelectorProps) {
  return (
    <fieldset
      className={`flex flex-wrap justify-center gap-2.5 border-0 p-0 m-0 ${className}`}
    >
      {NICHES.map((niche) => {
        const isSelected = niche === selectedNiche;
        return (
          <button
            key={niche}
            type="button"
            data-ocid={`home.niche_selector.${niche}`}
            onClick={() => onNicheSelect(niche)}
            aria-pressed={isSelected}
            className={[
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold",
              "border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
              isSelected
                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/60"
                : "bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:border-white/30 hover:text-white",
            ].join(" ")}
          >
            <span aria-hidden="true">{NICHE_ICONS[niche]}</span>
            <span>{NICHE_LABELS[niche]}</span>
          </button>
        );
      })}
    </fieldset>
  );
}
