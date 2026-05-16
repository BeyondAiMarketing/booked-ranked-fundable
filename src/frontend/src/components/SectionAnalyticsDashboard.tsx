// ── SectionAnalyticsDashboard ─────────────────────────────────────────────────
// Sidebar panel showing per-section analytics with inline SVG bar charts,
// a highest-priority fix button, and stat cards.

import { BarChart2, Bot, TrendingDown, TrendingUp, Zap } from "lucide-react";
import type {
  SectionAnalytics,
  SiteAnalyticsSummary,
} from "../lib/websiteAnalyticsEngine";
import {
  formatSeconds,
  getLowestScoringSection,
  scoreColor,
  trendColor,
  trendIcon,
} from "../lib/websiteAnalyticsEngine";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// ── Inline SVG bar ────────────────────────────────────────────────────────────

function InlineBar({
  value,
  max,
  color,
}: { value: number; max: number; color: string }) {
  const pct = Math.max(2, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[10px] tabular-nums text-muted-foreground w-8 text-right">
        {value}
      </span>
    </div>
  );
}

// ── Score ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const color = scoreColor(score);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      aria-label={`Section score: ${score}`}
      role="img"
    >
      <title>{`Section score: ${score}`}</title>
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="4"
      />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      <text
        x="22"
        y="26"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill={color}
        aria-label={`Score ${score}`}
      >
        {score}
      </text>
    </svg>
  );
}

// ── Summary stat card ─────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  sub,
}: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/4 p-3">
      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-lg font-black text-foreground">{value}</p>
      {sub && <p className="text-[9px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ── Section row ───────────────────────────────────────────────────────────────

function SectionRow({
  section,
  maxViews,
  isWeakest,
  onFixRequest,
}: {
  section: SectionAnalytics;
  maxViews: number;
  isWeakest: boolean;
  onFixRequest: (section: SectionAnalytics) => void;
}) {
  const color = scoreColor(section.conversionScore);
  const tc = trendColor(section.trend);
  const ti = trendIcon(section.trend);

  return (
    <div
      className={`rounded-xl border p-3 space-y-2 transition-all ${
        isWeakest
          ? "border-red-500/30 bg-red-500/5"
          : "border-white/8 bg-white/3"
      }`}
      data-ocid={`analytics.section_row.${section.sectionId}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <ScoreRing score={section.conversionScore} />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground/90 truncate">
              {section.label}
            </p>
            <span className="text-[9px] font-semibold" style={{ color: tc }}>
              {ti} {section.trend}
            </span>
          </div>
        </div>
        {isWeakest && (
          <Badge className="text-[9px] bg-red-500/20 text-red-300 border-red-500/30 flex-shrink-0">
            Lowest
          </Badge>
        )}
      </div>

      {/* Metrics */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-muted-foreground w-14 flex-shrink-0">
            Views
          </span>
          <InlineBar value={section.views} max={maxViews} color={color} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-muted-foreground w-14 flex-shrink-0">
            Scroll %
          </span>
          <InlineBar value={section.scrollDepth} max={100} color={color} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-muted-foreground w-14 flex-shrink-0">
            Avg Time
          </span>
          <span className="text-[10px] text-foreground/70">
            {formatSeconds(section.avgTimeOnSection)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-muted-foreground w-14 flex-shrink-0">
            CTA Clicks
          </span>
          <span className="text-[10px] text-foreground/70">
            {section.ctaClicks}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      {section.recommendation && (
        <div className="p-2 rounded-lg bg-white/4 border border-white/8">
          <p className="text-[9px] text-muted-foreground leading-relaxed line-clamp-3">
            {section.recommendation}
          </p>
        </div>
      )}

      {/* Fix button for weakest */}
      {isWeakest && (
        <Button
          size="sm"
          className="w-full text-xs bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
          variant="outline"
          onClick={() => onFixRequest(section)}
          data-ocid="analytics.fix_priority_button"
        >
          <Zap size={11} className="mr-1.5" /> Fix This First — Highest Priority
        </Button>
      )}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface SectionAnalyticsDashboardProps {
  analytics: SiteAnalyticsSummary;
  onOpenAgentForSection: (sectionId: string, sectionLabel: string) => void;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SectionAnalyticsDashboard({
  analytics,
  onOpenAgentForSection,
}: SectionAnalyticsDashboardProps) {
  const weakest = getLowestScoringSection(analytics);
  const maxViews = Math.max(...analytics.sections.map((s) => s.views), 1);

  const handleFixRequest = (section: SectionAnalytics) => {
    onOpenAgentForSection(section.sectionId, section.label);
  };

  return (
    <div className="space-y-4" data-ocid="analytics.panel">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart2 size={14} className="text-violet-400" />
        <div>
          <p className="text-xs font-bold text-foreground">
            Conversion Analytics
          </p>
          <p className="text-[10px] text-muted-foreground">
            {analytics.periodLabel ?? "Last 30 days"}
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-2">
        <SummaryCard
          label="Page Views"
          value={analytics.totalPageViews.toLocaleString()}
          sub="last 30 days"
        />
        <SummaryCard
          label="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          sub="form + CTA submissions"
        />
        <SummaryCard
          label="Avg Session"
          value={formatSeconds(analytics.avgSessionDuration)}
          sub="time on site"
        />
        <SummaryCard
          label="Bounce Rate"
          value={`${analytics.bounceRate}%`}
          sub={
            analytics.bounceRate < 45 ? "below average ✓" : "needs attention"
          }
        />
      </div>

      {/* Top / weakest callouts */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-2.5">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp size={10} className="text-green-400" />
            <p className="text-[9px] text-green-400 font-semibold uppercase tracking-widest">
              Top Section
            </p>
          </div>
          <p className="text-xs font-bold text-foreground">
            {analytics.topPerformingSection}
          </p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-2.5">
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown size={10} className="text-red-400" />
            <p className="text-[9px] text-red-400 font-semibold uppercase tracking-widest">
              Needs Work
            </p>
          </div>
          <p className="text-xs font-bold text-foreground">
            {analytics.lowestPerformingSection}
          </p>
        </div>
      </div>

      {/* AI fix priority alert */}
      {weakest && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-3">
          <div className="flex items-start gap-2">
            <Bot size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-300 mb-0.5">
                Highest ROI Fix Available
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3">
                <strong className="text-foreground/70">{weakest.label}</strong>{" "}
                scores {weakest.conversionScore}/100. {weakest.recommendation}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 text-[10px] h-6 px-2 border-amber-500/30 text-amber-300 hover:bg-amber-500/15"
                onClick={() => handleFixRequest(weakest)}
                data-ocid="analytics.open_agent_button"
              >
                <Zap size={10} className="mr-1" /> Fix with AI Agent
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Per-section rows */}
      <div className="space-y-2.5">
        <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
          Per Section Breakdown
        </p>
        {analytics.sections.map((section) => (
          <SectionRow
            key={section.sectionId}
            section={section}
            maxViews={maxViews}
            isWeakest={weakest?.sectionId === section.sectionId}
            onFixRequest={handleFixRequest}
          />
        ))}
      </div>
    </div>
  );
}
