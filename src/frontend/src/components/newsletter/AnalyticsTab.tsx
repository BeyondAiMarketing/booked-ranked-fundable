import { useNewsletterAnalytics } from "@/hooks/useNewsletter";
import { useCampaigns, useSubscribers } from "@/hooks/useNewsletter";
import type { NewsletterCampaign } from "@/types/newsletter";
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

interface Props {
  tenantId: string;
}

type SortKey =
  | "name"
  | "sentAt"
  | "sentCount"
  | "openRate"
  | "clickRate"
  | "bounceCount"
  | "unsubscribeCount";
type SortDir = "asc" | "desc";

function openRate(c: NewsletterCampaign) {
  if (!c.stats.sentCount) return 0;
  return (c.stats.openCount / c.stats.sentCount) * 100;
}

function clickRate(c: NewsletterCampaign) {
  if (!c.stats.sentCount) return 0;
  return (c.stats.clickCount / c.stats.sentCount) * 100;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="campaign-stat-card bg-card border border-border rounded-lg p-4 flex items-start gap-3">
      <div
        className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground leading-tight mt-0.5">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsTab({ tenantId }: Props) {
  const { data: analytics, isLoading: analyticsLoading } =
    useNewsletterAnalytics(tenantId);
  const { data: subscribers = [] } = useSubscribers(tenantId);
  const { data: campaigns = [] } = useCampaigns(tenantId);

  const [sortKey, setSortKey] = useState<SortKey>("sentAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sentCampaigns = campaigns.filter(
    (c) => c.status === "sent" || c.status === "sending",
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sortedCampaigns = [...sentCampaigns].sort((a, b) => {
    let av: number | string = 0;
    let bv: number | string = 0;
    switch (sortKey) {
      case "name":
        av = a.name;
        bv = b.name;
        break;
      case "sentAt":
        av = a.sentAt ?? "";
        bv = b.sentAt ?? "";
        break;
      case "sentCount":
        av = a.stats.sentCount;
        bv = b.stats.sentCount;
        break;
      case "openRate":
        av = openRate(a);
        bv = openRate(b);
        break;
      case "clickRate":
        av = clickRate(a);
        bv = clickRate(b);
        break;
      case "bounceCount":
        av = a.stats.bounceCount;
        bv = b.stats.bounceCount;
        break;
      case "unsubscribeCount":
        av = a.stats.unsubscribeCount;
        bv = b.stats.unsubscribeCount;
        break;
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Subscriber breakdown
  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const unsubCount = subscribers.filter(
    (s) => s.status === "unsubscribed",
  ).length;
  const bouncedCount = subscribers.filter((s) => s.status === "bounced").length;
  const complainedCount = subscribers.filter(
    (s) => s.status === "complained",
  ).length;
  const total = subscribers.length || 1;

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronUp className="h-3 w-3 opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 text-primary" />
    ) : (
      <ChevronDown className="h-3 w-3 text-primary" />
    );
  }

  if (analyticsLoading) {
    return (
      <div className="py-16 text-center text-muted-foreground text-sm">
        Loading analytics…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-ocid="analytics.section">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Users className="h-5 w-5 text-primary" />}
          label="Total Subscribers"
          value={(analytics?.totalSubscribers ?? 0).toLocaleString()}
          sub={`${analytics?.activeSubscribers ?? 0} active`}
          accent="bg-primary/15"
        />
        <StatCard
          icon={<Send className="h-5 w-5 text-emerald-400" />}
          label="Campaigns Sent"
          value={(analytics?.totalCampaigns ?? 0).toString()}
          sub={`${(analytics?.totalSent ?? 0).toLocaleString()} emails out`}
          accent="bg-emerald-500/15"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
          label="Avg Open Rate"
          value={`${(analytics?.avgOpenRate ?? 0).toFixed(1)}%`}
          sub="Across all campaigns"
          accent="bg-blue-500/15"
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5 text-rose-400" />}
          label="Avg Bounce Rate"
          value={`${(analytics?.avgBounceRate ?? 0).toFixed(1)}%`}
          sub="Hard + soft bounces"
          accent="bg-rose-500/15"
        />
      </div>

      {/* Campaign performance table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            Campaign Performance
          </h3>
        </div>

        {sortedCampaigns.length === 0 ? (
          <div
            data-ocid="analytics.campaigns.empty_state"
            className="py-10 text-center text-muted-foreground text-sm"
          >
            No sent campaigns to analyze yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  {(
                    [
                      { key: "name" as SortKey, label: "Campaign" },
                      { key: "sentAt" as SortKey, label: "Sent Date" },
                      { key: "sentCount" as SortKey, label: "Sent" },
                      { key: "openRate" as SortKey, label: "Open Rate" },
                      { key: "clickRate" as SortKey, label: "Click Rate" },
                      { key: "bounceCount" as SortKey, label: "Bounces" },
                      { key: "unsubscribeCount" as SortKey, label: "Unsubs" },
                    ] as Array<{ key: SortKey; label: string }>
                  ).map(({ key, label }) => (
                    <th
                      key={key}
                      data-ocid={`analytics.sort.${key}`}
                      className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide py-2.5 px-4 cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => toggleSort(key)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") toggleSort(key);
                      }}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        <SortIcon k={key} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedCampaigns.map((c, idx) => (
                  <tr
                    key={c.id}
                    data-ocid={`analytics.campaigns.item.${idx + 1}`}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-medium text-foreground max-w-[200px]">
                      <span className="truncate block">{c.name}</span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(c.sentAt)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground">
                      {c.stats.sentCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs font-semibold text-emerald-400">
                        {openRate(c).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {clickRate(c).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={`font-mono text-xs font-semibold ${c.stats.bounceCount > 10 ? "text-rose-400" : "text-muted-foreground"}`}
                      >
                        {c.stats.bounceCount}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs text-muted-foreground">
                        {c.stats.unsubscribeCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subscriber growth / breakdown */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Subscriber Breakdown
        </h3>
        <div className="flex flex-col gap-3">
          {[
            {
              label: "Active",
              count: activeCount,
              color: "bg-emerald-500",
              textColor: "text-emerald-400",
            },
            {
              label: "Unsubscribed",
              count: unsubCount,
              color: "bg-muted-foreground/40",
              textColor: "text-muted-foreground",
            },
            {
              label: "Bounced",
              count: bouncedCount,
              color: "bg-rose-500",
              textColor: "text-rose-400",
            },
            {
              label: "Complained",
              count: complainedCount,
              color: "bg-amber-500",
              textColor: "text-amber-400",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-24 flex-shrink-0">
                {item.label}
              </span>
              <div className="flex-1 bg-muted/40 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-500`}
                  style={{
                    width: `${Math.max((item.count / total) * 100, 1)}%`,
                  }}
                />
              </div>
              <span
                className={`text-xs font-bold font-mono w-12 text-right ${item.textColor}`}
              >
                {item.count}
              </span>
              <span className="text-[10px] text-muted-foreground/60 w-10 text-right">
                {((item.count / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
