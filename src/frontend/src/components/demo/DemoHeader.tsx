import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

interface DemoHeaderProps {
  track: 1 | 2;
  scene: number;
  totalScenes: number;
  sceneLabel: string;
  businessName: string;
}

export default function DemoHeader({
  track,
  scene,
  totalScenes,
  sceneLabel,
  businessName,
}: DemoHeaderProps) {
  const overallTotal = 5 + 6; // Track 1: 5 scenes, Track 2: 6 steps
  const overallCurrent = track === 1 ? scene : 5 + scene;
  const pct = Math.round((overallCurrent / overallTotal) * 100);

  const trackLabel =
    track === 1 ? "Track 1: See What We Do" : "Track 2: See What You Control";
  const stepWord = track === 1 ? "Scene" : "Step";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{ background: "rgba(2,6,23,0.92)", backdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center gap-4 px-4 md:px-6 h-14">
        {/* Logo */}
        <div className="shrink-0">
          <span className="text-sm font-bold text-white tracking-wide">
            <span className="text-indigo-400">BRF</span>{" "}
            <span className="text-slate-400 font-normal text-xs hidden sm:inline">
              Demo
            </span>
          </span>
        </div>

        {/* Center: progress info */}
        <div className="flex-1 min-w-0 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline text-indigo-300 font-medium">
              {trackLabel}
            </span>
            <span className="hidden sm:inline text-slate-600">—</span>
            <span className="font-semibold text-white">
              {stepWord} {scene} of {totalScenes}
            </span>
            <span className="text-slate-500 truncate hidden md:inline max-w-[200px]">
              — {sceneLabel}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full max-w-xs md:max-w-sm h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Business name (desktop) */}
        <div className="hidden lg:block shrink-0 text-xs text-slate-500 max-w-[160px] truncate">
          {businessName}
        </div>

        {/* Exit */}
        <Link
          to="/"
          data-ocid="services_demo.exit_button"
          className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg transition-colors duration-200"
        >
          <X size={13} />
          <span className="hidden sm:inline">Exit Demo</span>
        </Link>
      </div>
    </header>
  );
}
