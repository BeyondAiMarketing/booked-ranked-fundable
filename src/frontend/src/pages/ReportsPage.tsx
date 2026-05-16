import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { useApp } from "../context/AppContext";
import {
  AUDIT_SCORES,
  FUNDABILITY_SCORES,
  LEADS,
  MONTHLY_DATA,
  REVIEWS,
} from "../data/demoData";

export default function ReportsPage() {
  const { currentTenantId } = useApp();
  const leads = LEADS[currentTenantId] ?? [];
  const reviews = REVIEWS[currentTenantId] ?? [];
  const auditScore = AUDIT_SCORES[currentTenantId]?.total ?? 0;
  const fundScore = FUNDABILITY_SCORES[currentTenantId] ?? 0;

  const summaryCards = [
    {
      label: "Leads This Month",
      value: leads.length,
      change: "+4 vs last month",
      color: "border-blue-500",
    },
    {
      label: "Reviews This Month",
      value: reviews.length,
      change: "+2 vs last month",
      color: "border-amber-400",
    },
    {
      label: "SEO Audit Score",
      value: `${auditScore}/100`,
      change: "+3 pts this month",
      color: "border-emerald-500",
    },
    {
      label: "Fundability Score",
      value: `${fundScore}/100`,
      change: "+5 pts this month",
      color: "border-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
          Jan 2026 – Mar 2026
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info("Export functionality coming soon!")}
        >
          <Download size={14} className="mr-1" /> Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, change, color }) => (
          <div
            key={label}
            className={`bg-white rounded-xl border border-gray-200 border-t-4 ${color} shadow-sm p-4`}
          >
            <p className="text-xs text-gray-200 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-emerald-600 mt-1">{change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Leads by Month
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip />
              <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Reviews by Month
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip />
              <Bar dataKey="reviews" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
