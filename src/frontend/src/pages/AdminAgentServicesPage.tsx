import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Edit2,
  FileText,
  Globe,
  Layers,
  Layout,
  Megaphone,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import {
  AGENT_PRODUCTS,
  type AgentProduct,
  DEMO_AGENT_DELIVERABLES,
  DEMO_AGENT_PERFORMANCE,
} from "../data/agentData";

const TASK_TYPE_LABELS: Record<string, string> = {
  "seo-fix": "SEO Fix",
  "content-update": "Content Update",
  "landing-page": "Landing Page",
  "ads-update": "Ads Update",
  "website-edit": "Website Edit",
  "gbp-task": "GBP Task",
  report: "Report",
  review: "Review",
  other: "Other",
};

const ACCENT_CLASSES: Record<
  string,
  { border: string; text: string; bg: string }
> = {
  emerald: {
    border: "border-l-emerald-500",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  purple: {
    border: "border-l-purple-500",
    text: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  blue: {
    border: "border-l-blue-500",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  amber: {
    border: "border-l-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  rose: {
    border: "border-l-rose-500",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
  },
};

function getProductIcon(iconName: string) {
  const icons: Record<string, React.ReactNode> = {
    Search: <Search size={18} />,
    Megaphone: <Megaphone size={18} />,
    Globe: <Globe size={18} />,
    Package: <Package size={18} />,
    Users: <Users size={18} />,
    Bot: <Bot size={18} />,
  };
  return icons[iconName] ?? <Activity size={18} />;
}

function getDeliverableIcon(type: string) {
  const icons: Record<string, React.ReactNode> = {
    content: <Pencil size={14} />,
    report: <FileText size={14} />,
    optimization: <Zap size={14} />,
    campaign: <Megaphone size={14} />,
    page: <Layout size={14} />,
    audit: <Search size={14} />,
  };
  return icons[type] ?? <FileText size={14} />;
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    paused: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
    pending: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    pending_task: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    waiting: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    complete: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  const labels: Record<string, string> = {
    active: "Active",
    paused: "Paused",
    cancelled: "Cancelled",
    pending: "Pending",
    pending_task: "Pending",
    in_progress: "In Progress",
    waiting: "Blocked",
    complete: "Complete",
  };
  const key = status === "pending" ? "pending_task" : status;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        variants[key] ?? "bg-slate-700 text-slate-300 border-slate-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, string> = {
    high: "bg-red-500/15 text-red-400 border-red-500/20",
    medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    low: "bg-slate-700 text-slate-400 border-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${
        variants[priority] ?? "bg-slate-700 text-slate-300 border-slate-600"
      }`}
    >
      {priority}
    </span>
  );
}

export default function AdminAgentServicesPage() {
  const {
    tenants,
    agentSubscriptions,
    agentTasks,
    agentPricingOverrides,
    activateAgent,
    deactivateAgent,
    pauseAgent,
    resumeAgent,
    updateAgentTaskStatus,
    setAgentPriceOverride,
    addAgentSubscriptionNote,
  } = useApp();

  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [taskFilterAgent, setTaskFilterAgent] = useState("all");
  const [taskFilterClient, setTaskFilterClient] = useState("all");
  const [taskFilterStatus, setTaskFilterStatus] = useState("all");
  const [taskFilterPriority, setTaskFilterPriority] = useState("all");
  const [taskFilterType, setTaskFilterType] = useState("all");
  const [subFilterClient, setSubFilterClient] = useState("all");
  const [subFilterAgent, setSubFilterAgent] = useState("all");
  const [subFilterStatus, setSubFilterStatus] = useState("all");
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [addAgentTenantId, setAddAgentTenantId] = useState("");
  const [addAgentProductId, setAddAgentProductId] = useState("");
  const [perfClientId, setPerfClientId] = useState("tenant-medspa");
  const [delivMonthFilter, setDelivMonthFilter] = useState("all");
  const [settingsPrices, setSettingsPrices] = useState<Record<string, string>>(
    {},
  );
  const [oversightDefaultPrice, setOversightDefaultPrice] = useState("299");

  const activeSubscriptions = agentSubscriptions.filter(
    (s) => s.status === "active",
  );
  const pendingTasks = agentTasks.filter(
    (t) => t.status === "pending" || t.status === "in_progress",
  );
  const tenantsWithAgents = new Set(activeSubscriptions.map((s) => s.tenantId));
  const tenantsWithoutAgents = tenants.filter(
    (t) => !tenantsWithAgents.has(t.id) && t.id !== "tenant-demo",
  );

  const mrr = activeSubscriptions.reduce((sum, sub) => {
    const product = AGENT_PRODUCTS.find((p) => p.id === sub.productId);
    const price =
      agentPricingOverrides[sub.productId] ?? product?.defaultPrice ?? 0;
    return (
      sum +
      price +
      (sub.hasOversight ? (agentPricingOverrides["agent-oversight"] ?? 299) : 0)
    );
  }, 0);

  const today = new Date().toISOString().split("T")[0];
  const overdueTasks = agentTasks.filter(
    (t) => t.dueDate < today && t.status !== "complete",
  );

  const getTenantName = (id: string) =>
    tenants.find((t) => t.id === id)?.name ?? id;
  const getProductName = (id: string) =>
    AGENT_PRODUCTS.find((p) => p.id === id)?.name ?? id;

  const getEffectivePrice = (product: AgentProduct) =>
    agentPricingOverrides[product.id] ?? product.defaultPrice;

  const filteredTasks = agentTasks.filter((t) => {
    if (taskFilterAgent !== "all" && t.productId !== taskFilterAgent)
      return false;
    if (taskFilterClient !== "all" && t.tenantId !== taskFilterClient)
      return false;
    if (taskFilterStatus !== "all" && t.status !== taskFilterStatus)
      return false;
    if (taskFilterPriority !== "all" && t.priority !== taskFilterPriority)
      return false;
    if (taskFilterType !== "all" && t.type !== taskFilterType) return false;
    return true;
  });

  const filteredSubs = agentSubscriptions.filter((s) => {
    if (subFilterClient !== "all" && s.tenantId !== subFilterClient)
      return false;
    if (subFilterAgent !== "all" && s.productId !== subFilterAgent)
      return false;
    if (subFilterStatus !== "all" && s.status !== subFilterStatus) return false;
    return true;
  });

  const handleSavePrice = (productId: string) => {
    const val = Number(priceInputs[productId]);
    if (!val || val < 0) {
      toast.error("Enter a valid price");
      return;
    }
    setAgentPriceOverride(productId, val);
    setEditingPrice(null);
    toast.success("Price updated");
  };

  const handleAddAgent = () => {
    if (!addAgentTenantId || !addAgentProductId) {
      toast.error("Select a client and agent");
      return;
    }
    activateAgent(addAgentTenantId, addAgentProductId);
    setAddAgentTenantId("");
    setAddAgentProductId("");
    toast.success("Agent activated for client");
  };

  const handleSaveNote = (subId: string) => {
    const note = noteInputs[subId] ?? "";
    addAgentSubscriptionNote(subId, note);
    toast.success("Note saved");
  };

  const handleSaveSettings = () => {
    for (const [id, priceStr] of Object.entries(settingsPrices)) {
      const val = Number(priceStr);
      if (val > 0) setAgentPriceOverride(id, val);
    }
    toast.success("Settings saved");
  };

  const perfSnapshots = DEMO_AGENT_PERFORMANCE.filter(
    (s) => s.tenantId === perfClientId,
  );
  const perfSubs = activeSubscriptions.filter(
    (s) => s.tenantId === perfClientId,
  );

  const delivMonths = Array.from(
    new Set(DEMO_AGENT_DELIVERABLES.map((d) => d.month)),
  ).sort((a, b) => b.localeCompare(a));

  const filteredDeliverables = DEMO_AGENT_DELIVERABLES.filter(
    (d) => delivMonthFilter === "all" || d.month === delivMonthFilter,
  );

  const delivByTenant = tenants.reduce(
    (acc, t) => {
      const items = filteredDeliverables.filter((d) => d.tenantId === t.id);
      if (items.length) acc[t.id] = items;
      return acc;
    },
    {} as Record<string, typeof filteredDeliverables>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <Bot size={20} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Agent Services</h1>
          <p className="text-sm text-slate-400">
            Manage, sell, and fulfill AI agent services across all clients
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-slate-800 border border-slate-700 mb-6">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="admin.agents.overview.tab"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="catalog"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="admin.agents.catalog.tab"
          >
            Agent Catalog
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="admin.agents.subscriptions.tab"
          >
            Client Subscriptions
          </TabsTrigger>
          <TabsTrigger
            value="queue"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="admin.agents.queue.tab"
          >
            Fulfillment Queue
          </TabsTrigger>
          <TabsTrigger
            value="deliverables"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="admin.agents.deliverables.tab"
          >
            Deliverables
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="admin.agents.performance.tab"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="admin.agents.settings.tab"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* ======== OVERVIEW ======== */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="bg-gradient-to-br from-indigo-600 to-indigo-700 border-0 text-white"
              data-ocid="admin.agents.overview.card"
            >
              <CardContent className="pt-6 pb-4">
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
                  Active Subscriptions
                </p>
                <p className="text-4xl font-bold mt-1">
                  {activeSubscriptions.length}
                </p>
                <p className="text-indigo-200 text-xs mt-1">
                  {
                    agentSubscriptions.filter((s) => s.status === "pending")
                      .length
                  }{" "}
                  pending
                </p>
              </CardContent>
            </Card>
            <Card
              className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-0 text-white"
              data-ocid="admin.agents.overview.card"
            >
              <CardContent className="pt-6 pb-4">
                <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                  Monthly Recurring Revenue
                </p>
                <p className="text-4xl font-bold mt-1">
                  ${mrr.toLocaleString()}
                </p>
                <p className="text-emerald-200 text-xs mt-1">
                  from agent services
                </p>
              </CardContent>
            </Card>
            <Card
              className="bg-gradient-to-br from-amber-500 to-amber-600 border-0 text-white"
              data-ocid="admin.agents.overview.card"
            >
              <CardContent className="pt-6 pb-4">
                <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider">
                  Pending Tasks
                </p>
                <p className="text-4xl font-bold mt-1">{pendingTasks.length}</p>
                <p className="text-amber-100 text-xs mt-1">
                  {overdueTasks.length} overdue
                </p>
              </CardContent>
            </Card>
            <Card
              className="bg-gradient-to-br from-rose-600 to-rose-700 border-0 text-white"
              data-ocid="admin.agents.overview.card"
            >
              <CardContent className="pt-6 pb-4">
                <p className="text-rose-200 text-xs font-semibold uppercase tracking-wider">
                  Clients Without Agents
                </p>
                <p className="text-4xl font-bold mt-1">
                  {tenantsWithoutAgents.length}
                </p>
                <p className="text-rose-200 text-xs mt-1">
                  upsell opportunities
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold">
                  Subscriptions by Agent Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {AGENT_PRODUCTS.filter((p) => p.category !== "oversight").map(
                  (product) => {
                    const count = activeSubscriptions.filter(
                      (s) => s.productId === product.id,
                    ).length;
                    const accent = ACCENT_CLASSES[product.accentColor];
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className={accent.text}>
                            {getProductIcon(product.icon)}
                          </span>
                          <span className="text-slate-200 text-sm">
                            {product.name}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${accent.bg} ${accent.text}`}
                        >
                          {count}
                        </span>
                      </div>
                    );
                  },
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold">
                  Top Upsell Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tenantsWithoutAgents.length === 0 ? (
                  <p className="text-slate-400 text-sm">
                    All clients have active agent services.
                  </p>
                ) : (
                  <div
                    className="space-y-2"
                    data-ocid="admin.agents.upsell.list"
                  >
                    {tenantsWithoutAgents.map((t, i) => (
                      <div
                        key={t.id}
                        data-ocid={`admin.agents.upsell.item.${i + 1}`}
                        className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
                      >
                        <div>
                          <p className="text-slate-200 text-sm font-medium">
                            {t.name}
                          </p>
                          <p className="text-slate-400 text-xs">{t.type}</p>
                        </div>
                        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
                          Suggest SEO Agent
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {overdueTasks.length > 0 && (
            <Card className="bg-slate-800 border border-red-500/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400" />
                  <CardTitle className="text-white text-sm font-semibold">
                    Overdue Deliverables
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-400 text-xs">
                        Task
                      </TableHead>
                      <TableHead className="text-slate-400 text-xs">
                        Client
                      </TableHead>
                      <TableHead className="text-slate-400 text-xs">
                        Due
                      </TableHead>
                      <TableHead className="text-slate-400 text-xs">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueTasks.map((t, i) => (
                      <TableRow
                        key={t.id}
                        data-ocid={`admin.agents.overdue.item.${i + 1}`}
                        className="border-slate-700"
                      >
                        <TableCell className="text-slate-200 text-sm">
                          {t.title}
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">
                          {getTenantName(t.tenantId)}
                        </TableCell>
                        <TableCell className="text-red-400 text-xs">
                          {t.dueDate}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={t.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ======== CATALOG ======== */}
        <TabsContent value="catalog" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Agent Catalog</h2>
            <Button
              data-ocid="admin.agents.catalog.open_modal_button"
              size="sm"
              onClick={() => toast.info("Coming soon — catalog editor")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus size={14} className="mr-1" /> Add Agent
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {AGENT_PRODUCTS.map((product, i) => {
              const accent = ACCENT_CLASSES[product.accentColor];
              const effectivePrice = getEffectivePrice(product);
              const isEditing = editingPrice === product.id;
              return (
                <Card
                  key={product.id}
                  data-ocid={`admin.agents.catalog.item.${i + 1}`}
                  className={`bg-slate-800 border border-slate-700 border-l-4 ${accent.border}`}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`${accent.text}`}>
                          {getProductIcon(product.icon)}
                        </span>
                        <div>
                          <h3 className="text-white font-semibold text-sm">
                            {product.name}
                          </h3>
                          <span className={`text-xs ${accent.text} capitalize`}>
                            {product.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.allowsOversight && (
                          <Badge className="bg-slate-700 text-slate-300 border-slate-600 text-xs">
                            + Oversight
                          </Badge>
                        )}
                        {product.isBundle && (
                          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-xs">
                            Bundle
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            data-ocid="admin.agents.catalog.input"
                            type="number"
                            className="h-7 w-28 text-sm bg-slate-700 border-slate-600 text-white"
                            value={
                              priceInputs[product.id] ?? String(effectivePrice)
                            }
                            onChange={(e) =>
                              setPriceInputs((prev) => ({
                                ...prev,
                                [product.id]: e.target.value,
                              }))
                            }
                          />
                          <Button
                            size="sm"
                            className="h-7 px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleSavePrice(product.id)}
                            data-ocid="admin.agents.catalog.save_button"
                          >
                            <Check size={12} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-slate-400"
                            onClick={() => setEditingPrice(null)}
                            data-ocid="admin.agents.catalog.cancel_button"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg">
                            ${effectivePrice.toLocaleString()}
                            <span className="text-slate-400 text-xs font-normal">
                              /mo
                            </span>
                          </span>
                          {agentPricingOverrides[product.id] && (
                            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-xs">
                              Custom
                            </Badge>
                          )}
                          <button
                            type="button"
                            data-ocid="admin.agents.catalog.edit_button"
                            onClick={() => {
                              setEditingPrice(product.id);
                              setPriceInputs((prev) => ({
                                ...prev,
                                [product.id]: String(effectivePrice),
                              }));
                            }}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    <ul className="mt-3 space-y-1">
                      {product.features.slice(0, 4).map((f) => (
                        <li
                          key={f}
                          className="text-slate-400 text-xs flex items-center gap-1.5"
                        >
                          <Check
                            size={10}
                            className="text-emerald-500 shrink-0"
                          />{" "}
                          {f}
                        </li>
                      ))}
                      {product.features.length > 4 && (
                        <li className="text-slate-500 text-xs">
                          +{product.features.length - 4} more features
                        </li>
                      )}
                    </ul>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Switch
                            checked={product.visible}
                            onCheckedChange={() =>
                              toast.info("Visibility saved")
                            }
                            data-ocid="admin.agents.catalog.toggle"
                          />
                          <span className="text-slate-400 text-xs">
                            Visible
                          </span>
                        </div>
                        <Badge className="bg-slate-700 text-slate-300 border-slate-600 text-xs">
                          Priority {product.upsellPriority}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white h-7 text-xs"
                        onClick={() => toast.info("Full editor coming soon")}
                        data-ocid="admin.agents.catalog.secondary_button"
                      >
                        <Edit2 size={12} className="mr-1" /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ======== CLIENT SUBSCRIPTIONS ======== */}
        <TabsContent value="subscriptions" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Select
                value={subFilterClient}
                onValueChange={setSubFilterClient}
              >
                <SelectTrigger
                  className="w-40 h-8 text-xs bg-slate-800 border-slate-700 text-slate-200"
                  data-ocid="admin.agents.subscriptions.select"
                >
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-slate-200">
                    All clients
                  </SelectItem>
                  {tenants.map((t) => (
                    <SelectItem
                      key={t.id}
                      value={t.id}
                      className="text-slate-200"
                    >
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={subFilterAgent} onValueChange={setSubFilterAgent}>
                <SelectTrigger
                  className="w-44 h-8 text-xs bg-slate-800 border-slate-700 text-slate-200"
                  data-ocid="admin.agents.subscriptions.select"
                >
                  <SelectValue placeholder="All agents" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-slate-200">
                    All agents
                  </SelectItem>
                  {AGENT_PRODUCTS.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      className="text-slate-200"
                    >
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={subFilterStatus}
                onValueChange={setSubFilterStatus}
              >
                <SelectTrigger
                  className="w-36 h-8 text-xs bg-slate-800 border-slate-700 text-slate-200"
                  data-ocid="admin.agents.subscriptions.select"
                >
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-slate-200">
                    All statuses
                  </SelectItem>
                  <SelectItem value="active" className="text-slate-200">
                    Active
                  </SelectItem>
                  <SelectItem value="paused" className="text-slate-200">
                    Paused
                  </SelectItem>
                  <SelectItem value="cancelled" className="text-slate-200">
                    Cancelled
                  </SelectItem>
                  <SelectItem value="pending" className="text-slate-200">
                    Pending
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={addAgentTenantId}
                onValueChange={setAddAgentTenantId}
              >
                <SelectTrigger
                  className="w-40 h-8 text-xs bg-slate-800 border-slate-700 text-slate-200"
                  data-ocid="admin.agents.subscriptions.select"
                >
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {tenants
                    .filter((t) => t.id !== "tenant-demo")
                    .map((t) => (
                      <SelectItem
                        key={t.id}
                        value={t.id}
                        className="text-slate-200"
                      >
                        {t.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select
                value={addAgentProductId}
                onValueChange={setAddAgentProductId}
              >
                <SelectTrigger
                  className="w-44 h-8 text-xs bg-slate-800 border-slate-700 text-slate-200"
                  data-ocid="admin.agents.subscriptions.select"
                >
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {AGENT_PRODUCTS.filter((p) => p.category !== "oversight").map(
                    (p) => (
                      <SelectItem
                        key={p.id}
                        value={p.id}
                        className="text-slate-200"
                      >
                        {p.name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                onClick={handleAddAgent}
                data-ocid="admin.agents.subscriptions.primary_button"
              >
                <Plus size={12} className="mr-1" /> Add
              </Button>
            </div>
          </div>

          <Card className="bg-slate-800 border border-slate-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400 text-xs">
                      Client
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Agent
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Status
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Price
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Oversight
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Activated
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Notes
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubs.map((sub, i) => {
                    const product = AGENT_PRODUCTS.find(
                      (p) => p.id === sub.productId,
                    );
                    const price =
                      sub.pricingOverride ??
                      agentPricingOverrides[sub.productId] ??
                      product?.defaultPrice ??
                      0;
                    return (
                      <TableRow
                        key={sub.id}
                        data-ocid={`admin.agents.subscriptions.row.${i + 1}`}
                        className="border-slate-700"
                      >
                        <TableCell className="text-slate-200 text-sm font-medium">
                          {getTenantName(sub.tenantId)}
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm">
                          {getProductName(sub.productId)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={sub.status} />
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm">
                          ${price.toLocaleString()}/mo
                        </TableCell>
                        <TableCell>
                          {sub.hasOversight ? (
                            <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/20 text-xs">
                              Yes
                            </Badge>
                          ) : (
                            <span className="text-slate-500 text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">
                          {new Date(sub.activatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Input
                              className="h-6 w-28 text-xs bg-slate-700 border-slate-600 text-white"
                              placeholder="Add note"
                              value={noteInputs[sub.id] ?? sub.notes}
                              onChange={(e) =>
                                setNoteInputs((prev) => ({
                                  ...prev,
                                  [sub.id]: e.target.value,
                                }))
                              }
                              data-ocid="admin.agents.subscriptions.input"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveNote(sub.id)}
                              className="text-slate-400 hover:text-white"
                              data-ocid="admin.agents.subscriptions.save_button"
                            >
                              <Save size={12} />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 flex-wrap">
                            {sub.status === "active" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs text-amber-400 hover:text-amber-300 px-2"
                                onClick={() => {
                                  pauseAgent(sub.id);
                                  toast.success("Paused");
                                }}
                                data-ocid="admin.agents.subscriptions.toggle"
                              >
                                Pause
                              </Button>
                            )}
                            {sub.status === "paused" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs text-emerald-400 hover:text-emerald-300 px-2"
                                onClick={() => {
                                  resumeAgent(sub.id);
                                  toast.success("Resumed");
                                }}
                                data-ocid="admin.agents.subscriptions.toggle"
                              >
                                Resume
                              </Button>
                            )}
                            {sub.status !== "cancelled" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs text-red-400 hover:text-red-300 px-2"
                                onClick={() => {
                                  deactivateAgent(sub.id);
                                  toast.success("Cancelled");
                                }}
                                data-ocid="admin.agents.subscriptions.delete_button"
                              >
                                Cancel
                              </Button>
                            )}
                            {(sub.productId === "agent-seo" ||
                              sub.productId === "agent-bundle") && (
                              <Link to="/seo-geo-agent">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 text-xs text-emerald-400 hover:text-emerald-300 px-2"
                                  data-ocid="admin.agents.subscriptions.link"
                                >
                                  SEO Workspace
                                </Button>
                              </Link>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredSubs.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-slate-400 py-8"
                        data-ocid="admin.agents.subscriptions.empty_state"
                      >
                        No subscriptions match the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======== FULFILLMENT QUEUE ======== */}
        <TabsContent value="queue" className="space-y-4">
          {/* Task type quick-filter chips */}
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["all", "All Types"],
                ["seo-fix", "SEO Fix"],
                ["gbp-task", "GBP Task"],
                ["content-update", "Content Update"],
                ["landing-page", "Landing Page"],
                ["report", "Report"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setTaskFilterType(val)}
                data-ocid={`admin.agents.queue.type.${val}.toggle`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  taskFilterType === val
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={taskFilterAgent} onValueChange={setTaskFilterAgent}>
              <SelectTrigger
                className="w-44 h-8 text-xs bg-slate-800 border-slate-700 text-slate-200"
                data-ocid="admin.agents.queue.select"
              >
                <SelectValue placeholder="All agents" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200">
                  All agents
                </SelectItem>
                {AGENT_PRODUCTS.map((p) => (
                  <SelectItem
                    key={p.id}
                    value={p.id}
                    className="text-slate-200"
                  >
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={taskFilterClient}
              onValueChange={setTaskFilterClient}
            >
              <SelectTrigger
                className="w-40 h-8 text-xs bg-slate-800 border-slate-700 text-slate-200"
                data-ocid="admin.agents.queue.select"
              >
                <SelectValue placeholder="All clients" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200">
                  All clients
                </SelectItem>
                {tenants.map((t) => (
                  <SelectItem
                    key={t.id}
                    value={t.id}
                    className="text-slate-200"
                  >
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={taskFilterStatus}
              onValueChange={setTaskFilterStatus}
            >
              <SelectTrigger
                className="w-36 h-8 text-xs bg-slate-800 border-slate-700 text-slate-200"
                data-ocid="admin.agents.queue.select"
              >
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200">
                  All statuses
                </SelectItem>
                <SelectItem value="pending" className="text-slate-200">
                  Pending
                </SelectItem>
                <SelectItem value="in_progress" className="text-slate-200">
                  In Progress
                </SelectItem>
                <SelectItem value="waiting" className="text-slate-200">
                  Waiting
                </SelectItem>
                <SelectItem value="complete" className="text-slate-200">
                  Complete
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={taskFilterPriority}
              onValueChange={setTaskFilterPriority}
            >
              <SelectTrigger
                className="w-36 h-8 text-xs bg-slate-800 border-slate-700 text-slate-200"
                data-ocid="admin.agents.queue.select"
              >
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200">
                  All priorities
                </SelectItem>
                <SelectItem value="high" className="text-slate-200">
                  High
                </SelectItem>
                <SelectItem value="medium" className="text-slate-200">
                  Medium
                </SelectItem>
                <SelectItem value="low" className="text-slate-200">
                  Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-slate-800 border border-slate-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400 text-xs">
                      Task
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Client
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Agent
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Status
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Priority
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Assignee
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Due
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs">
                      Update
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task, i) => (
                    <>
                      <TableRow
                        key={task.id}
                        data-ocid={`admin.agents.queue.row.${i + 1}`}
                        className="border-slate-700 cursor-pointer hover:bg-slate-700/30"
                        onClick={() =>
                          setExpandedTask(
                            expandedTask === task.id ? null : task.id,
                          )
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {expandedTask === task.id ? (
                              <ChevronDown
                                size={12}
                                className="text-slate-400"
                              />
                            ) : (
                              <ChevronRight
                                size={12}
                                className="text-slate-400"
                              />
                            )}
                            <span className="text-slate-200 text-sm">
                              {task.title}
                            </span>
                            {task.isClientRequest && (
                              <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/20 text-[10px] ml-1">
                                Client
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">
                          {getTenantName(task.tenantId)}
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">
                          {getProductName(task.productId)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={task.status} />
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={task.priority} />
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">
                          {task.assignee}
                        </TableCell>
                        <TableCell
                          className={`text-xs ${task.dueDate < today && task.status !== "complete" ? "text-red-400" : "text-slate-400"}`}
                        >
                          {task.dueDate}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={task.status}
                            onValueChange={(val) => {
                              updateAgentTaskStatus(
                                task.id,
                                val as AgentTask["status"],
                              );
                              toast.success("Status updated");
                            }}
                          >
                            <SelectTrigger
                              className="w-32 h-6 text-xs bg-slate-700 border-slate-600 text-slate-200"
                              data-ocid="admin.agents.queue.select"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem
                                value="pending"
                                className="text-slate-200"
                              >
                                Pending
                              </SelectItem>
                              <SelectItem
                                value="in_progress"
                                className="text-slate-200"
                              >
                                In Progress
                              </SelectItem>
                              <SelectItem
                                value="waiting"
                                className="text-slate-200"
                              >
                                Waiting
                              </SelectItem>
                              <SelectItem
                                value="complete"
                                className="text-slate-200"
                              >
                                Complete
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                      {expandedTask === task.id && (
                        <TableRow
                          key={`${task.id}-expanded`}
                          className="border-slate-700 bg-slate-900/50"
                        >
                          <TableCell colSpan={8} className="py-3 px-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-slate-700/50 text-slate-300 border-slate-600">
                                  {TASK_TYPE_LABELS[task.type] ?? task.type}
                                </span>
                                {task.isClientRequest && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-indigo-500/15 text-indigo-400 border-indigo-500/20">
                                    Client Request
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-300 text-xs">
                                {task.description}
                              </p>
                              {task.notes && (
                                <p className="text-slate-400 text-xs">
                                  <span className="text-slate-500">Notes:</span>{" "}
                                  {task.notes}
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                  {filteredTasks.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-slate-400 py-8"
                        data-ocid="admin.agents.queue.empty_state"
                      >
                        No tasks match the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======== DELIVERABLES ======== */}
        <TabsContent value="deliverables" className="space-y-4">
          <div className="flex items-center gap-3">
            <Select
              value={delivMonthFilter}
              onValueChange={setDelivMonthFilter}
            >
              <SelectTrigger
                className="w-44 h-8 text-xs bg-slate-800 border-slate-700 text-slate-200"
                data-ocid="admin.agents.deliverables.select"
              >
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200">
                  All months
                </SelectItem>
                {delivMonths.map((m) => (
                  <SelectItem key={m} value={m} className="text-slate-200">
                    {new Date(`${m}-01`).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {Object.entries(delivByTenant).length === 0 ? (
              <p
                className="text-slate-400 text-sm"
                data-ocid="admin.agents.deliverables.empty_state"
              >
                No deliverables for the selected month.
              </p>
            ) : (
              Object.entries(delivByTenant).map(([tenantId, items]) => {
                const byProduct = AGENT_PRODUCTS.reduce(
                  (acc, p) => {
                    const pItems = items.filter((d) => d.productId === p.id);
                    if (pItems.length) acc[p.id] = pItems;
                    return acc;
                  },
                  {} as Record<string, typeof items>,
                );
                return (
                  <Card
                    key={tenantId}
                    className="bg-slate-800 border border-slate-700"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm font-semibold">
                        {getTenantName(tenantId)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(byProduct).map(([productId, delivs]) => {
                        const product = AGENT_PRODUCTS.find(
                          (p) => p.id === productId,
                        );
                        const accent =
                          ACCENT_CLASSES[product?.accentColor ?? "emerald"];
                        return (
                          <div key={productId}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={accent.text}>
                                {getProductIcon(product?.icon ?? "Bot")}
                              </span>
                              <span
                                className={`text-xs font-semibold ${accent.text}`}
                              >
                                {product?.name}
                              </span>
                            </div>
                            <div className="space-y-2 pl-4">
                              {delivs
                                .sort((a, b) => b.completedAt - a.completedAt)
                                .map((d, idx) => (
                                  <div
                                    key={d.id}
                                    data-ocid={`admin.agents.deliverables.item.${idx + 1}`}
                                    className="flex items-start gap-3 py-2 border-b border-slate-700 last:border-0"
                                  >
                                    <span className={`mt-0.5 ${accent.text}`}>
                                      {getDeliverableIcon(d.type)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-slate-200 text-sm font-medium">
                                        {d.title}
                                      </p>
                                      <p className="text-slate-400 text-xs mt-0.5">
                                        {d.description}
                                      </p>
                                      <p className="text-slate-500 text-xs mt-1">
                                        {new Date(
                                          d.completedAt,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <Badge
                                      className={`${accent.bg} ${accent.text} border-0 text-xs capitalize shrink-0`}
                                    >
                                      {d.type}
                                    </Badge>
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* ======== PERFORMANCE ======== */}
        <TabsContent value="performance" className="space-y-4">
          <div className="flex items-center gap-3">
            <Select value={perfClientId} onValueChange={setPerfClientId}>
              <SelectTrigger
                className="w-52 h-9 bg-slate-800 border-slate-700 text-slate-200"
                data-ocid="admin.agents.performance.select"
              >
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {tenants
                  .filter((t) =>
                    agentSubscriptions.some((s) => s.tenantId === t.id),
                  )
                  .map((t) => (
                    <SelectItem
                      key={t.id}
                      value={t.id}
                      className="text-slate-200"
                    >
                      {t.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {perfSubs.length === 0 ? (
            <p
              className="text-slate-400 text-sm"
              data-ocid="admin.agents.performance.empty_state"
            >
              No active agents for this client.
            </p>
          ) : (
            <div className="space-y-6">
              {perfSubs.map((sub) => {
                const product = AGENT_PRODUCTS.find(
                  (p) => p.id === sub.productId,
                );
                const accent =
                  ACCENT_CLASSES[product?.accentColor ?? "emerald"];
                const snapshots = perfSnapshots
                  .filter((s) => s.productId === sub.productId)
                  .sort((a, b) => b.month.localeCompare(a.month));
                return (
                  <Card
                    key={sub.id}
                    className={`bg-slate-800 border border-slate-700 border-l-4 ${accent.border}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <span className={accent.text}>
                          {getProductIcon(product?.icon ?? "Bot")}
                        </span>
                        <CardTitle className="text-white text-sm">
                          {product?.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {snapshots.length === 0 ? (
                        <p className="text-slate-400 text-sm">
                          No performance data available yet.
                        </p>
                      ) : (
                        snapshots.map((snap) => (
                          <div key={snap.month}>
                            <p className="text-xs font-semibold text-slate-400 mb-2">
                              {new Date(`${snap.month}-01`).toLocaleDateString(
                                "en-US",
                                { month: "long", year: "numeric" },
                              )}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                              {snap.seoScoreChange !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    SEO Score
                                  </p>
                                  <p
                                    className={`text-xl font-bold ${snap.seoScoreChange >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                  >
                                    {snap.seoScoreChange >= 0 ? "+" : ""}
                                    {snap.seoScoreChange}
                                  </p>
                                </div>
                              )}
                              {snap.leadChange !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    New Leads
                                  </p>
                                  <p
                                    className={`text-xl font-bold ${snap.leadChange >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                  >
                                    {snap.leadChange >= 0 ? "+" : ""}
                                    {snap.leadChange}
                                  </p>
                                </div>
                              )}
                              {snap.adsSpend !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    Ads Spend
                                  </p>
                                  <p className="text-xl font-bold text-purple-400">
                                    ${snap.adsSpend.toLocaleString()}
                                  </p>
                                </div>
                              )}
                              {snap.adsClicks !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    Clicks
                                  </p>
                                  <p className="text-xl font-bold text-blue-400">
                                    {snap.adsClicks.toLocaleString()}
                                  </p>
                                </div>
                              )}
                              {snap.websitePagesUpdated !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    Pages Updated
                                  </p>
                                  <p className="text-xl font-bold text-blue-400">
                                    {snap.websitePagesUpdated}
                                  </p>
                                </div>
                              )}
                            </div>
                            <p className="text-slate-300 text-sm">
                              {snap.summary}
                            </p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ======== SETTINGS ======== */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <DollarSign size={15} className="text-emerald-400" /> Agent
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {AGENT_PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <Label className="text-slate-300 text-sm flex-1">
                      {p.name}
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 text-sm">$</span>
                      <Input
                        type="number"
                        data-ocid="admin.agents.settings.input"
                        className="w-24 h-7 text-sm bg-slate-700 border-slate-600 text-white"
                        placeholder={String(
                          agentPricingOverrides[p.id] ?? p.defaultPrice,
                        )}
                        value={settingsPrices[p.id] ?? ""}
                        onChange={(e) =>
                          setSettingsPrices((prev) => ({
                            ...prev,
                            [p.id]: e.target.value,
                          }))
                        }
                      />
                      <span className="text-slate-400 text-xs">/mo</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Users size={15} className="text-rose-400" /> Human Oversight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-slate-300 text-sm">
                    Default Oversight Price
                  </Label>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-sm">$</span>
                    <Input
                      type="number"
                      data-ocid="admin.agents.settings.input"
                      className="w-24 h-7 text-sm bg-slate-700 border-slate-600 text-white"
                      value={oversightDefaultPrice}
                      onChange={(e) => setOversightDefaultPrice(e.target.value)}
                    />
                    <span className="text-slate-400 text-xs">/mo</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-sm">
                    Allow on new subscriptions
                  </Label>
                  <Switch
                    defaultChecked
                    data-ocid="admin.agents.settings.switch"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-sm">
                    Require strategist assignment
                  </Label>
                  <Switch
                    defaultChecked
                    data-ocid="admin.agents.settings.switch"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Layers size={15} className="text-indigo-400" /> Activation
                  Flow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-sm">
                    Require admin approval
                  </Label>
                  <Switch data-ocid="admin.agents.settings.switch" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-sm">
                    Auto-notify on activation
                  </Label>
                  <Switch
                    defaultChecked
                    data-ocid="admin.agents.settings.switch"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-sm">
                    Auto-create initial tasks
                  </Label>
                  <Switch
                    defaultChecked
                    data-ocid="admin.agents.settings.switch"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <TrendingUp size={15} className="text-amber-400" /> Visibility
                  Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {AGENT_PRODUCTS.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <Label className="text-slate-300 text-sm">{p.name}</Label>
                    <Switch
                      defaultChecked={p.visible}
                      data-ocid="admin.agents.settings.switch"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Button
            data-ocid="admin.agents.settings.save_button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleSaveSettings}
          >
            <Save size={14} className="mr-2" /> Save Settings
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Needed for the AgentTask type in updateAgentTaskStatus
import type { AgentTask } from "../data/agentData";
