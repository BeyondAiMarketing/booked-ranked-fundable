import { HOMEPAGE_NICHE_LIST } from "@/data/homepageNicheData";

interface HomepageNicheSelectorProps {
  activeNiche: string | null;
  onNicheChange: (niche: string) => void;
}

export function HomepageNicheSelector({
  activeNiche,
  onNicheChange,
}: HomepageNicheSelectorProps) {
  return (
    <div
      className="sticky top-0 z-40 w-full"
      style={{
        background: "rgba(2, 6, 23, 0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(139,92,246,0.2)",
      }}
      data-ocid="homepage.niche_selector"
    >
      {/* Prompt — shown when no niche selected */}
      {!activeNiche && (
        <div className="text-center pt-2 pb-0">
          <span className="text-xs font-semibold text-purple-400 tracking-wide">
            Select your industry to see your personalized demo →
          </span>
        </div>
      )}

      {/* Scrollable pill container */}
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 px-4 py-2.5 min-w-max mx-auto md:justify-center">
          {HOMEPAGE_NICHE_LIST.map((niche) => {
            const isActive = niche.id === activeNiche;
            return (
              <button
                key={niche.id}
                type="button"
                data-ocid={`homepage.niche.${niche.id}`}
                onClick={() => onNicheChange(niche.id)}
                aria-pressed={isActive}
                className={[
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap",
                  "border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950",
                  isActive
                    ? "bg-purple-600/90 border-purple-500 text-white shadow-md shadow-purple-900/50"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/25 hover:text-white",
                ].join(" ")}
              >
                <span aria-hidden="true" className="text-base leading-none">
                  {niche.icon}
                </span>
                <span>{niche.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
