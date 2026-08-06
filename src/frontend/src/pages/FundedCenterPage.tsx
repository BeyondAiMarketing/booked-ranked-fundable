import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { getHomeServiceNicheConfig } from "@/data/homeServiceNicheConfig";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle,
  CheckSquare,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Handshake,
  Landmark,
  Printer,
  Scale,
  Shield,
  Store,
  TrendingUp,
  Upload,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const READINESS_ITEMS = [
  { label: "Legal Business Name", status: "complete", category: "identity" },
  { label: "EIN on File", status: "complete", category: "identity" },
  { label: "Business Entity Type", status: "complete", category: "identity" },
  { label: "Years in Business", status: "complete", category: "identity" },
  {
    label: "Monthly Revenue Verified",
    status: "pending",
    category: "financial",
  },
  { label: "Bank Statements (3 mo)", status: "missing", category: "financial" },
  { label: "Credit Score Range", status: "pending", category: "financial" },
  { label: "Business Bank Account", status: "complete", category: "financial" },
  { label: "Business Address", status: "complete", category: "presence" },
  { label: "Website Live", status: "complete", category: "presence" },
  {
    label: "Professional Email Domain",
    status: "pending",
    category: "presence",
  },
  { label: "DUNS Number", status: "missing", category: "credit" },
  { label: "Experian Business", status: "missing", category: "credit" },
  { label: "Equifax Business", status: "missing", category: "credit" },
  { label: "Trade Lines Established", status: "pending", category: "credit" },
  { label: "Tax Returns Available", status: "missing", category: "documents" },
  {
    label: "Equipment Needs Documented",
    status: "pending",
    category: "planning",
  },
  { label: "Marketing Capital Plan", status: "pending", category: "planning" },
];

const CATEGORIES = [
  { key: "identity", label: "Business Identity", icon: Building2 },
  { key: "financial", label: "Financial Health", icon: Wallet },
  { key: "presence", label: "Online Presence", icon: Shield },
  { key: "credit", label: "Business Credit", icon: CreditCard },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "planning", label: "Capital Planning", icon: Landmark },
];

export default function FundedCenterPage() {
  const { demoInfo } = useApp();
  const nicheKey = demoInfo?.niche ?? "roofing";
  const nicheConfig = getHomeServiceNicheConfig(nicheKey);
  const nicheName = nicheConfig?.name ?? "Business";

  const completeCount = READINESS_ITEMS.filter(
    (i) => i.status === "complete",
  ).length;
  const totalCount = READINESS_ITEMS.length;
  const readinessPct = Math.round((completeCount / totalCount) * 100);

  const getStatusColor = (status: string) => {
    if (status === "complete")
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (status === "pending")
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    return "bg-rose-500/20 text-rose-300 border-rose-500/30";
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Funded Center</h1>
          <p className="text-sm text-white/70">
            {nicheName} — funding readiness, business credit, and capital
            planning
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          data-ocid="funded.report.button"
          className="rounded-xl border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 hover:scale-105 transition-all duration-200"
        >
          <FileText size={14} className="mr-1.5" />
          Generate Report
        </Button>
      </div>

      {/* Overall Readiness */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-lg shadow-black/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#FFD700]/40 flex items-center justify-center bg-[#FFD700]/10">
              <span className="text-2xl font-bold text-white">
                {readinessPct}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold text-white/90">
                Funding Readiness Score
              </h3>
              <Progress value={readinessPct} className="h-3" />
              <p className="text-sm text-white/70">
                {readinessPct >= 80
                  ? "Strong readiness. Lenders will view you favorably."
                  : readinessPct >= 50
                    ? "Moderate readiness. Complete pending items to improve access."
                    : "Needs work. Focus on business credit and document collection."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const items = READINESS_ITEMS.filter((i) => i.category === cat.key);
          const catComplete = items.filter(
            (i) => i.status === "complete",
          ).length;
          const catPct = Math.round((catComplete / items.length) * 100);
          return (
            <Card
              key={cat.key}
              className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 rounded-2xl transition-all duration-200"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <cat.icon size={16} className="text-[#FFD700]" />
                  <span className="text-sm font-medium text-white/90">
                    {cat.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={catPct} className="flex-1 h-2" />
                  <span className="text-sm font-bold text-white w-8 text-right">
                    {catPct}%
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  {catComplete} of {items.length} items complete
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Checklist */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white/90">
            Readiness Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {READINESS_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              data-ocid={`funded.checklist.${item.label.toLowerCase().replace(/\s+/g, "_")}.item`}
            >
              <div className="flex items-center gap-2">
                {item.status === "complete" ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-white/20" />
                )}
                <span
                  className={`text-sm ${item.status === "complete" ? "text-white/50 line-through" : "text-white/90"}`}
                >
                  {item.label}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] rounded-full px-3 py-1 font-medium ${getStatusColor(item.status)}`}
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 1: Live Fundability Dashboard */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[#00d4ff]" />
            <CardTitle className="text-lg font-semibold text-white/90">
              Live Fundability Dashboard
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Credit Score Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                bureau: "Experian Business",
                score: 72,
                status: "Fair",
                color: "#FFD700",
              },
              {
                bureau: "Equifax Business",
                score: 68,
                status: "Fair",
                color: "#FFD700",
              },
              {
                bureau: "D&B Paydex",
                score: 0,
                status: "Not Established",
                color: "#00d4ff",
              },
            ].map((b) => (
              <div
                key={b.bureau}
                className="bg-white/5 rounded-xl p-4 border border-white/10 text-center space-y-2"
              >
                <p className="text-xs text-white/60 uppercase tracking-wider">
                  {b.bureau}
                </p>
                <div className="text-3xl font-bold" style={{ color: b.color }}>
                  {b.score > 0 ? b.score : "—"}
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] rounded-full px-3 py-1 font-medium bg-white/5 text-white/80 border-white/10"
                >
                  {b.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Category Progress Bars */}
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const items = READINESS_ITEMS.filter(
                (i) => i.category === cat.key,
              );
              const catComplete = items.filter(
                (i) => i.status === "complete",
              ).length;
              const catPct = Math.round((catComplete / items.length) * 100);
              return (
                <div key={cat.key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80 flex items-center gap-2">
                      <cat.icon size={14} className="text-[#FFD700]" />
                      {cat.label}
                    </span>
                    <span className="text-white/60 text-xs">{catPct}%</span>
                  </div>
                  <Progress value={catPct} className="h-2" />
                </div>
              );
            })}
          </div>

          {/* Days to Funding Ready */}
          <div className="flex items-center gap-4 bg-[#FFD700]/5 rounded-xl p-4 border border-[#FFD700]/20">
            <Clock size={24} className="text-[#FFD700]" />
            <div>
              <p className="text-sm font-medium text-white/90">
                Days to Funding Ready
              </p>
              <p className="text-2xl font-bold text-[#FFD700]">45 days</p>
              <p className="text-xs text-white/50">
                Complete pending items to accelerate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Vendor Credit Marketplace */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Store size={18} className="text-[#00d4ff]" />
            <CardTitle className="text-lg font-semibold text-white/90">
              Vendor Credit Marketplace
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Uline",
                category: "Office Supplies",
                reportsTo: "D&B",
                limit: "$1,000",
                applied: false,
              },
              {
                name: "Quill",
                category: "Office Supplies",
                reportsTo: "D&B",
                limit: "$1,000",
                applied: false,
              },
              {
                name: "Grainger",
                category: "Industrial",
                reportsTo: "D&B",
                limit: "$2,500",
                applied: false,
              },
              {
                name: "Summa Office Supplies",
                category: "Office Supplies",
                reportsTo: "Experian",
                limit: "$2,000",
                applied: true,
              },
            ].map((vendor) => (
              <div
                key={vendor.name}
                className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white/90">
                    {vendor.name}
                  </h4>
                  {vendor.applied && (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                      Applied
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-white/50">{vendor.category}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Reports to</span>
                    <span className="text-white/80">{vendor.reportsTo}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Typical Limit</span>
                    <span className="text-[#FFD700] font-medium">
                      {vendor.limit}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 text-xs"
                  disabled={vendor.applied}
                  data-ocid={`funded.vendor.${vendor.name.toLowerCase().replace(/\s+/g, "_")}.apply_button`}
                >
                  {vendor.applied ? "Applied" : "Apply Now"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Lender Matching Engine */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Handshake size={18} className="text-[#00d4ff]" />
            <CardTitle className="text-lg font-semibold text-white/90">
              Lender Matching Engine
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Match Display */}
          <div className="bg-gradient-to-r from-[#00d4ff]/10 to-transparent rounded-xl p-4 border border-[#00d4ff]/20">
            <div className="flex items-center gap-3 mb-3">
              <Zap size={18} className="text-[#00d4ff]" />
              <span className="text-sm font-medium text-white/90">
                AI-Powered Match
              </span>
            </div>
            <p className="text-xs text-white/60 mb-3">
              Based on your business profile, revenue, and credit history, our
              AI matches you with lenders most likely to approve your
              application.
            </p>
          </div>

          {/* Lender Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "OnDeck",
                type: "Term Loan",
                matchScore: 85,
                minRevenue: "$100K/yr",
                maxAmount: "$250K",
                preQual: true,
              },
              {
                name: "BlueVine",
                type: "Line of Credit",
                matchScore: 72,
                minRevenue: "$120K/yr",
                maxAmount: "$250K",
                preQual: false,
              },
              {
                name: "Fundbox",
                type: "Invoice Financing",
                matchScore: 68,
                minRevenue: "$50K/yr",
                maxAmount: "$150K",
                preQual: false,
              },
            ].map((lender) => (
              <div
                key={lender.name}
                className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white/90">
                    {lender.name}
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-[10px] rounded-full px-2 py-0.5 font-medium bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30"
                  >
                    {lender.matchScore}% Match
                  </Badge>
                </div>
                <p className="text-xs text-white/50">{lender.type}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Min Revenue</span>
                    <span className="text-white/80">{lender.minRevenue}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Max Amount</span>
                    <span className="text-[#FFD700] font-medium">
                      {lender.maxAmount}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10 text-xs"
                  data-ocid={`funded.lender.${lender.name.toLowerCase()}.prequal_button`}
                >
                  {lender.preQual ? "Pre-Qualified" : "Check Pre-Qualification"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Document Vault */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <FolderOpen size={18} className="text-[#00d4ff]" />
            <CardTitle className="text-lg font-semibold text-white/90">
              Document Vault
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center space-y-2 hover:border-[#FFD700]/40 transition-colors cursor-pointer">
            <Upload size={24} className="mx-auto text-white/40" />
            <p className="text-sm text-white/70">Drag & drop documents here</p>
            <p className="text-xs text-white/40">
              Bank statements, tax returns, licenses, contracts
            </p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-white/20 text-white/70 hover:bg-white/10 text-xs"
              data-ocid="funded.document.upload_button"
            >
              Browse Files
            </Button>
          </div>

          {/* Document List */}
          <div className="space-y-2">
            {[
              {
                name: "Business Plan Template",
                type: "Auto-Generated",
                status: "ready",
                date: "Generated today",
              },
              {
                name: "Financial Projections Q1",
                type: "Auto-Generated",
                status: "ready",
                date: "Generated today",
              },
              {
                name: "P&L Statement Template",
                type: "Auto-Generated",
                status: "ready",
                date: "Generated today",
              },
              {
                name: "Bank Statements (3 mo)",
                type: "Upload Required",
                status: "missing",
                date: "—",
              },
              {
                name: "Tax Returns (2 yr)",
                type: "Upload Required",
                status: "missing",
                date: "—",
              },
            ].map((doc) => (
              <div
                key={doc.name}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <FileText
                    size={14}
                    className={
                      doc.status === "ready"
                        ? "text-[#00d4ff]"
                        : "text-white/30"
                    }
                  />
                  <div>
                    <p className="text-sm text-white/90">{doc.name}</p>
                    <p className="text-xs text-white/40">{doc.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">{doc.date}</span>
                  {doc.status === "ready" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-lg text-white/50 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10"
                      data-ocid={`funded.document.${doc.name.toLowerCase().replace(/[()\s]+/g, "_")}.download_button`}
                    >
                      <Download size={14} />
                    </Button>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] rounded-full px-2 py-0.5 font-medium bg-rose-500/10 text-rose-300 border-rose-500/20"
                    >
                      Missing
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Auto-Generate Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10 text-xs"
            data-ocid="funded.document.auto_generate_button"
          >
            <Zap size={14} className="mr-1.5" />
            Auto-Generate Missing Documents
          </Button>
        </CardContent>
      </Card>

      {/* Section 5: Compliance-First Messaging */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-[#00d4ff]" />
            <CardTitle className="text-lg font-semibold text-white/90">
              Compliance-First Messaging
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Disclaimer Banner */}
          <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 flex items-start gap-3">
            <AlertTriangle
              size={18}
              className="text-amber-400 mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm font-medium text-amber-200">
                Educational Purpose Only
              </p>
              <p className="text-xs text-amber-200/70 mt-1">
                All funding readiness scores, lender matches, and credit
                recommendations are for educational purposes only. This is not
                financial advice. Always consult with a qualified financial
                advisor before making funding decisions.
              </p>
            </div>
          </div>

          {/* Approval Queue Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white/80">
                Pending Approval Queue
              </h4>
              <Badge
                variant="outline"
                className="text-[10px] rounded-full px-2 py-0.5 font-medium bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30"
              >
                3 Pending
              </Badge>
            </div>
            {[
              {
                action: "Share funding report with lender",
                risk: "medium",
                date: "Today",
              },
              {
                action: "Submit pre-qualification application",
                risk: "low",
                date: "Today",
              },
              {
                action: "Auto-generate business plan",
                risk: "low",
                date: "Yesterday",
              },
            ].map((item) => (
              <div
                key={item.action.replace(/\s+/g, "_").toLowerCase()}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <CheckSquare size={14} className="text-white/30" />
                  <span className="text-sm text-white/80">{item.action}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-[10px] rounded-full px-2 py-0.5 font-medium ${
                      item.risk === "high"
                        ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                        : item.risk === "medium"
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                    }`}
                  >
                    {item.risk}
                  </Badge>
                  <span className="text-xs text-white/40">{item.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Audit Trail Note */}
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Shield size={12} />
            <span>
              All actions are logged to WorkflowLog for compliance audit trail
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Agency Revenue Layer */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-[#00d4ff]" />
            <CardTitle className="text-lg font-semibold text-white/90">
              Agency Revenue Layer
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* White-Label Toggle */}
          <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Award size={18} className="text-[#FFD700]" />
              <div>
                <p className="text-sm font-medium text-white/90">
                  White-Label Mode
                </p>
                <p className="text-xs text-white/50">
                  Generate branded reports for client businesses
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 text-xs"
              data-ocid="funded.agency.white_label_toggle"
            >
              <Eye size={14} className="mr-1.5" />
              Preview Report
            </Button>
          </div>

          {/* Client Selector */}
          <div className="space-y-2">
            <label
              htmlFor="client-selector"
              className="text-xs text-white/60 uppercase tracking-wider"
            >
              Select Client
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: "Acme Roofing", vertical: "Roofing", readiness: 72 },
                { name: "Smile Dental", vertical: "Dental", readiness: 85 },
                { name: "Elite Med Spa", vertical: "Med Spa", readiness: 60 },
              ].map((client) => (
                <div
                  key={client.name}
                  className="bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Users size={14} className="text-white/40" />
                    <Badge
                      variant="outline"
                      className="text-[10px] rounded-full px-2 py-0.5 font-medium bg-white/5 text-white/60 border-white/10"
                    >
                      {client.vertical}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-white/90">
                    {client.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress
                      value={client.readiness}
                      className="flex-1 h-1.5"
                    />
                    <span className="text-xs text-white/60">
                      {client.readiness}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Tracker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-[#FFD700]" />
                <h4 className="text-sm font-medium text-white/90">
                  Commission Tracker
                </h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Funded Deals (YTD)</span>
                  <span className="text-white/80 font-medium">12</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Avg Commission</span>
                  <span className="text-[#FFD700] font-medium">$1,250</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Total Earned</span>
                  <span className="text-[#FFD700] font-medium text-sm">
                    $15,000
                  </span>
                </div>
              </div>
            </div>

            {/* MRR Calculator */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#00d4ff]" />
                <h4 className="text-sm font-medium text-white/90">
                  MRR Calculator
                </h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Clients on Funding Plan</span>
                  <span className="text-white/80 font-medium">8</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Plan Price</span>
                  <span className="text-white/80 font-medium">$297/mo</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Monthly Revenue</span>
                  <span className="text-[#00d4ff] font-medium text-sm">
                    $2,376
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Generate White-Label Report */}
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 text-xs"
            data-ocid="funded.agency.generate_report_button"
          >
            <Printer size={14} className="mr-1.5" />
            Generate White-Label Funding Readiness Report
          </Button>
        </CardContent>
      </Card>

      {/* Niche-Specific Capital Goals */}
      {nicheConfig && (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Landmark size={18} className="text-[#FFD700]" />
              <CardTitle className="text-lg font-semibold text-white/90">
                {nicheName} Capital Goals
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-white/50 mb-3">
              Common capital goals for {nicheName} businesses at your growth
              stage.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {nicheConfig.capitalGoals.map((goal) => (
                <div
                  key={goal}
                  className="flex items-center gap-2 bg-[#FFD700]/5 border border-[#FFD700]/15 rounded-xl px-3 py-2"
                  data-ocid="funded.capital_goal.item"
                >
                  <CheckCircle
                    size={13}
                    className="text-[#FFD700] flex-shrink-0"
                  />
                  <span className="text-xs text-white/80">{goal}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 30/60/90-Day Action Plan */}
      {nicheConfig && (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              <CardTitle className="text-lg font-semibold text-white/90">
                30 / 60 / 90-Day Funding Readiness Plan
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-xs text-white/50">
              A step-by-step roadmap to make your {nicheName} business fundable.
            </p>
            {(
              [
                {
                  label: "First 30 Days",
                  days: nicheConfig.fundingActionPlan.day30,
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                  border: "border-emerald-500/25",
                },
                {
                  label: "Days 31–60",
                  days: nicheConfig.fundingActionPlan.day60,
                  color: "text-[#00BFFF]",
                  bg: "bg-[#00BFFF]/10",
                  border: "border-[#00BFFF]/25",
                },
                {
                  label: "Days 61–90",
                  days: nicheConfig.fundingActionPlan.day90,
                  color: "text-[#FFD700]",
                  bg: "bg-[#FFD700]/10",
                  border: "border-[#FFD700]/25",
                },
              ] as const
            ).map((phase) => (
              <div
                key={phase.label}
                className={`rounded-xl p-4 ${phase.bg} border ${phase.border}`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-widest mb-3 ${phase.color}`}
                >
                  {phase.label}
                </p>
                <ul className="space-y-2">
                  {phase.days.map((step) => (
                    <li key={step} className="flex items-start gap-2">
                      <CheckSquare
                        size={13}
                        className="text-white/30 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-xs text-white/80">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
