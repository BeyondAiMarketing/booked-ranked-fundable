import {
  Activity,
  BarChart2,
  Code,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { useApp } from "../context/AppContext";
import { AUDIT_SCORES } from "../data/demoData";

const trafficData = [
  { week: "Feb 3", sessions: 142, pageViews: 398 },
  { week: "Feb 10", sessions: 168, pageViews: 441 },
  { week: "Feb 17", sessions: 155, pageViews: 412 },
  { week: "Feb 24", sessions: 189, pageViews: 503 },
  { week: "Mar 3", sessions: 201, pageViews: 534 },
  { week: "Mar 10", sessions: 224, pageViews: 587 },
  { week: "Mar 17", sessions: 198, pageViews: 521 },
  { week: "Mar 24", sessions: 237, pageViews: 621 },
];

const leadSourceData = [
  { name: "Organic Search", value: 38 },
  { name: "Free Audit", value: 24 },
  { name: "Referral", value: 21 },
  { name: "Direct", value: 11 },
  { name: "Social", value: 6 },
];

const LEAD_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#ec4899"];

const auditHistoryData = [
  { week: "Week 1", score: 62 },
  { week: "Week 2", score: 65 },
  { week: "Week 3", score: 64 },
  { week: "Week 4", score: 68 },
  { week: "Week 5", score: 70 },
  { week: "Week 6", score: 72 },
  { week: "Week 7", score: 71 },
  { week: "Week 8", score: 74 },
];

const reviewVelocityData = [
  { month: "Jan", reviews: 3 },
  { month: "Feb", reviews: 5 },
  { month: "Mar", reviews: 4 },
  { month: "Apr", reviews: 7 },
  { month: "May", reviews: 6 },
  { month: "Jun", reviews: 9 },
];

export default function AnalyticsPage() {
  const { currentTenantId, auditOverrides } = useApp();
  const [trackingEnabled, setTrackingEnabled] = useState(false);

  const baseData = AUDIT_SCORES[currentTenantId];
  const auditScore = auditOverrides[currentTenantId] ?? baseData?.total ?? 68;

  const stats = [
    {
      label: "Page Views (Month)",
      value: "4,231",
      delta: "+12%",
      up: true,
      icon: Activity,
    },
    { label: "Sessions", value: "1,724", delta: "+8%", up: true, icon: Users },
    {
      label: "Leads This Month",
      value: "24",
      delta: "+5 vs last",
      up: true,
      icon: TrendingUp,
    },
    {
      label: "Conversion Rate",
      value: "1.4%",
      delta: "+0.2%",
      up: true,
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <p className="text-gray-400 text-sm">
          Site performance, traffic, and conversion data at a glance.
        </p>
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 text-xs text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <Shield size={12} />
          Online · 99.7% uptime
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 text-xs text-emerald-400">
          <Shield size={12} />
          SSL valid · 90 days remaining
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5 text-xs text-indigo-400">
          <BarChart2 size={12} />
          SEO Score: {auditScore}/100
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, delta, up, icon: Icon }) => (
          <Card key={label} className="bg-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">{label}</p>
                <Icon size={14} className="text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p
                className={`text-xs mt-1 ${up ? "text-emerald-400" : "text-red-400"}`}
              >
                {up ? "↑" : "↓"} {delta}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Traffic Chart */}
      <Card className="bg-card border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white">
            Traffic Overview (Last 8 Weeks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={trafficData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="Sessions"
              />
              <Line
                type="monotone"
                dataKey="pageViews"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Page Views"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Source Breakdown */}
        <Card className="bg-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">
              Lead Source Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {leadSourceData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={LEAD_COLORS[i % LEAD_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Review Velocity */}
        <Card className="bg-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white">
              Review Velocity Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={reviewVelocityData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="reviews"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  name="Reviews"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* SEO Audit History Trend */}
      <Card className="bg-card border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white">
            SEO Score History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart
              data={auditHistoryData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <YAxis
                domain={[50, 100]}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ fill: "#a855f7", r: 3 }}
                name="SEO Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tracking Script */}
      <Card className="bg-card border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Code size={15} className="text-indigo-400" /> Analytics Tracking
            Script
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Enable Real-Time Tracking</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Add the tracking snippet to your website to capture real visitor
                data.
              </p>
            </div>
            <Switch
              checked={trackingEnabled}
              onCheckedChange={setTrackingEnabled}
              data-ocid="analytics.tracking.toggle"
            />
          </div>
          {trackingEnabled && (
            <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
              <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider">
                Add to your &lt;head&gt; tag
              </p>
              <code className="text-xs text-emerald-400 font-mono break-all">
                {`<script src="https://track.bookedrankedfundable.com/pixel.js?id=YOUR_ID" async></script>`}
              </code>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
