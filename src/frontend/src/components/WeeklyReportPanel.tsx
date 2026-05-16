import { useApp } from "@/context/AppContext";
import { AGENT_PRODUCTS } from "@/data/agentData";
import {
  AlertCircle,
  ArrowUp,
  BarChart2,
  Bell,
  Calendar,
  CheckCircle2,
  Minus,
  TrendingUp,
  X,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent } from "./ui/sheet";

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

function KPICard({
  label,
  value,
  delta,
  up,
}: {
  label: string;
  value: string;
  delta?: string;
  up?: boolean;
}) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3.5">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
      {delta && (
        <div
          className={`flex items-center gap-1 mt-1 text-xs font-medium ${
            up === true
              ? "text-emerald-400"
              : up === false
                ? "text-red-400"
                : "text-gray-400"
          }`}
        >
          {up === true ? (
            <ArrowUp size={11} />
          ) : up === false ? (
            <ArrowUp size={11} className="rotate-180" />
          ) : (
            <Minus size={11} />
          )}
          {delta}
        </div>
      )}
    </div>
  );
}

function ActionCard({
  num,
  text,
  priority,
}: {
  num: number;
  text: string;
  priority: "high" | "medium" | "low";
}) {
  const colors = {
    high: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    low: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };
  return (
    <div className="flex gap-3 p-3.5 bg-gray-800/40 rounded-xl border border-gray-700">
      <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
        {num}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-200 leading-snug">{text}</p>
      </div>
      <Badge
        className={`text-[10px] h-5 px-1.5 capitalize border ${colors[priority]}`}
      >
        {priority}
      </Badge>
    </div>
  );
}

export default function WeeklyReportPanel() {
  const {
    weeklyReportOpen,
    setWeeklyReportOpen,
    isAdminUser,
    agentSubscriptions,
    currentTenantId,
    tenants,
    demoInfo,
  } = useApp();

  const activeAgentSubs = agentSubscriptions.filter(
    (s) => s.tenantId === currentTenantId && s.status === "active",
  );

  const currentTenant = tenants.find((t) => t.id === currentTenantId);
  const isPlumbing =
    currentTenant?.type === "Plumbing" ||
    demoInfo?.niche === "Plumbing" ||
    currentTenantId === "tenant-plumbing";
  const isMedSpa =
    currentTenant?.type === "Med Spa" ||
    demoInfo?.niche === "Med Spa" ||
    currentTenantId === "tenant-medspa";

  return (
    <Sheet open={weeklyReportOpen} onOpenChange={setWeeklyReportOpen}>
      <SheetContent
        side="right"
        className="w-full sm:w-[560px] p-0 bg-gray-900 border-l border-gray-800 flex flex-col"
        data-ocid="weekly_report.panel"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <BarChart2 size={18} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Weekly Performance Report
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Week of {getWeekRange()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWeeklyReportOpen(false)}
            data-ocid="weekly_report.close_button"
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-6">
            {isAdminUser ? (
              // ─── ADMIN / PORTFOLIO VIEW ───────────────────────────────────
              <>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Portfolio Summary
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <KPICard
                      label="Total Active Clients"
                      value="6"
                      delta="+1 this month"
                      up
                    />
                    <KPICard
                      label="New Leads This Week"
                      value="14"
                      delta="+3 vs last week"
                      up
                    />
                    <KPICard
                      label="Avg Review Rating"
                      value="4.6 ★"
                      delta="stable"
                      up={undefined}
                    />
                    <KPICard
                      label="Reviews Received"
                      value="8"
                      delta="+2 vs last week"
                      up
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    SEO Overview
                  </p>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span className="text-sm text-gray-200">
                        4 of 6 clients above 70/100 SEO score
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-indigo-400" />
                      <span className="text-sm text-gray-200">
                        Top performer: North County Plumbing{" "}
                        <span className="text-emerald-400 font-medium">
                          (78/100)
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={14} className="text-amber-400" />
                      <span className="text-sm text-gray-200">
                        Needs attention: Oceanside Clean & Restore{" "}
                        <span className="text-amber-400 font-medium">
                          (62/100)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Fundability Status
                  </p>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-1.5 text-sm text-gray-300">
                    <p>
                      <span className="text-emerald-400 font-semibold">2</span>{" "}
                      clients at Growth Ready (75+)
                    </p>
                    <p>
                      <span className="text-indigo-300 font-semibold">3</span>{" "}
                      clients in progress (50–74)
                    </p>
                    <p>
                      <span className="text-amber-400 font-semibold">1</span>{" "}
                      client needs foundation work (below 50)
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Agent Services
                  </p>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-1.5 text-sm text-gray-300">
                    <p>
                      <span className="text-indigo-300 font-semibold">3</span>{" "}
                      active SEO Agent subscriptions
                    </p>
                    <p>
                      <span className="text-purple-300 font-semibold">1</span>{" "}
                      Paid Ads Agent active
                    </p>
                    <p>
                      <span className="text-emerald-400 font-semibold">4</span>{" "}
                      tasks completed this week
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Recommended Actions
                  </p>
                  <div className="space-y-2">
                    <ActionCard
                      num={1}
                      text="Trigger review request campaign for North County Plumbing — 14 days with no new reviews."
                      priority="high"
                    />
                    <ActionCard
                      num={2}
                      text="Run a fresh SEO audit for Oceanside Clean & Restore — mobile score is dragging overall rank."
                      priority="high"
                    />
                    <ActionCard
                      num={3}
                      text="Push the 3 fundability 'In Progress' clients toward 75+ with a targeted check-in this week."
                      priority="medium"
                    />
                  </div>
                </div>
              </>
            ) : (
              // ─── CLIENT / DEMO VIEW ───────────────────────────────────────
              <>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Your Performance This Week
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <KPICard
                      label="SEO Score"
                      value={isPlumbing ? "72" : isMedSpa ? "74" : "64"}
                      delta={`+${isPlumbing ? "4" : isMedSpa ? "3" : "2"} vs last week`}
                      up
                    />
                    <KPICard
                      label="New Leads"
                      value={isPlumbing ? "7" : isMedSpa ? "9" : "5"}
                      delta={`+${isPlumbing ? "2" : isMedSpa ? "3" : "1"} vs last week`}
                      up
                    />
                    <KPICard
                      label="Review Rating"
                      value={
                        isPlumbing ? "4.5 ★" : isMedSpa ? "4.9 ★" : "4.7 ★"
                      }
                      delta="+0.1 vs last month"
                      up
                    />
                    <KPICard
                      label="Fundability"
                      value={isPlumbing ? "71" : isMedSpa ? "63" : "48"}
                      delta="stable"
                      up={undefined}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    What Happened This Week
                  </p>
                  <ul className="space-y-2">
                    {(isPlumbing
                      ? [
                          "3 new Google reviews came in — your rating improved to 4.5★",
                          "SEO audit score climbed 4 points after GBP update",
                          "Review request sent to 6 recent customers via SMS",
                          "Emergency plumbing keywords now ranking in top 3 positions",
                        ]
                      : isMedSpa
                        ? [
                            "9 new consultation inquiries from organic and paid traffic",
                            "Spring Botox campaign launched — 28 bookings so far",
                            "2 new 5-star reviews on Google from recent clients",
                            "SEO score improved 3 points after service page updates",
                          ]
                        : [
                            "5 new leads captured from organic and referral sources",
                            "SEO audit score improved 2 points this week",
                            "2 citation inconsistencies corrected across directories",
                            "Review request cadence sent to 4 recent customers",
                          ]
                    ).map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-gray-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {activeAgentSubs.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      Active Agent Updates
                    </p>
                    <div className="space-y-3">
                      {activeAgentSubs.slice(0, 3).map((sub) => {
                        const product = AGENT_PRODUCTS.find(
                          (p) => p.id === sub.productId,
                        );
                        if (!product) return null;
                        return (
                          <div
                            key={sub.id}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-semibold text-white">
                                {product.name}
                              </p>
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] border">
                                Active
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400">
                              Currently:{" "}
                              <span className="text-gray-300">
                                {sub.currentWork}
                              </span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Next:{" "}
                              <span className="text-indigo-300">
                                {sub.nextDeliverable}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Recommended for Next Week
                  </p>
                  <div className="space-y-2">
                    {(isPlumbing
                      ? [
                          {
                            text: "Respond to the 3 unanswered Google reviews from this week.",
                            priority: "high" as const,
                          },
                          {
                            text: "Enable the Missed Call Rescue campaign — you missed 4 calls this week.",
                            priority: "high" as const,
                          },
                          {
                            text: "Add your DUNS number to jump 12 points on your fundability score.",
                            priority: "medium" as const,
                          },
                        ]
                      : isMedSpa
                        ? [
                            {
                              text: "Approve the Mother's Day gift card campaign creative before Friday.",
                              priority: "high" as const,
                            },
                            {
                              text: "Respond to the 2 new consultation inquiries who haven't heard back.",
                              priority: "high" as const,
                            },
                            {
                              text: "Open a business credit card to push fundability past 75/100.",
                              priority: "medium" as const,
                            },
                          ]
                        : [
                            {
                              text: "Complete your Google Business Profile — missing service descriptions.",
                              priority: "high" as const,
                            },
                            {
                              text: "Activate your niche campaign pack — leads are sitting unreached.",
                              priority: "high" as const,
                            },
                            {
                              text: "Register your DUNS number to start building business credit.",
                              priority: "medium" as const,
                            },
                          ]
                    ).map((item, i) => (
                      <ActionCard
                        key={item.text}
                        num={i + 1}
                        text={item.text}
                        priority={item.priority}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Footer note */}
            <div className="pt-2 pb-4 border-t border-gray-800 flex items-center justify-between">
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Calendar size={11} /> Next report in 7 days
              </p>
              <button
                type="button"
                data-ocid="weekly_report.reminder.button"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                onClick={() => {}}
              >
                <Bell size={11} /> Set Reminder
              </button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
