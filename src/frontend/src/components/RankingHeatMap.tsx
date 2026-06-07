import type React from "react";

interface GridPoint {
  lat: number;
  lng: number;
  direction: string;
  competitorAtTop: string;
  rankPosition: bigint;
  searched: boolean;
}

interface RankingHeatMapProps {
  gridPoints: GridPoint[];
  showCompetitors: boolean;
}

const DIRECTION_ORDER = ["NW", "N", "NE", "W", "Center", "E", "SW", "S", "SE"];

function getRankColor(rankPosition: bigint, searched: boolean): string {
  if (!searched) return "bg-slate-700/50 border-slate-600/40 text-slate-400";
  if (rankPosition <= 3n)
    return "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
  if (rankPosition <= 10n)
    return "bg-amber-500/20 border-amber-500/50 text-amber-300";
  return "bg-red-500/20 border-red-500/50 text-red-300";
}

function getRankLabel(rankPosition: bigint, searched: boolean): string {
  if (!searched) return "\u2014";
  if (rankPosition === 0n) return "Not Found";
  return `#${rankPosition}`;
}

export const RankingHeatMap: React.FC<RankingHeatMapProps> = ({
  gridPoints,
  showCompetitors,
}) => {
  const pointMap = new Map(gridPoints.map((p) => [p.direction, p]));

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
      {DIRECTION_ORDER.map((dir) => {
        const point = pointMap.get(dir);
        const isCenter = dir === "Center";
        const colorClass = point
          ? getRankColor(point.rankPosition, point.searched)
          : "bg-slate-700/50 border-slate-600/40 text-slate-500";
        const rankLabel = point
          ? getRankLabel(point.rankPosition, point.searched)
          : "\u2014";
        const competitor = point?.competitorAtTop ?? "";
        const tooltipText = point?.searched
          ? `Rank ${rankLabel} here${competitor ? `. Top: ${competitor}` : ""}`
          : dir;

        return (
          <div
            key={dir}
            title={tooltipText}
            className={`${colorClass} border rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-default p-2 ${isCenter ? "min-h-[80px] ring-2 ring-blue-400/60 bg-blue-500/10" : "min-h-[62px]"}`}
          >
            <span className="text-xs text-slate-500 font-medium">{dir}</span>
            {isCenter && (
              <span className="text-base leading-none">\uD83C\uDFE0</span>
            )}
            <span
              className={`font-bold leading-none ${isCenter ? "text-sm" : "text-xs"}`}
            >
              {rankLabel}
            </span>
            {showCompetitors && competitor && (
              <span
                className="text-center leading-tight mt-0.5 text-slate-400 max-w-[60px] overflow-hidden text-ellipsis whitespace-nowrap"
                style={{ fontSize: 9 }}
              >
                {competitor}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RankingHeatMap;
