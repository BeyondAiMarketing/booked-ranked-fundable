import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Check,
  CheckCircle,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Layout,
  Megaphone,
  Package,
  Pencil,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
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
  DEMO_AGENT_DELIVERABLES,
  DEMO_AGENT_PERFORMANCE,
} from "../data/agentData";

const ACCENT_CLASSES: Record<
  string,
  {
    border: string;
    text: string;
    bg: string;
    button: string;
    glow: string;
  }
> = {
  emerald: {
    border: "border-l-emerald-500",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    glow: "shadow-emerald-500/10",
  },
  purple: {
    border: "border-l-purple-500",
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    button: "bg-purple-600 hover:bg-purple-700 text-white",
    glow: "shadow-purple-500/10",
  },
  blue: {
    border: "border-l-blue-500",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
    glow: "shadow-blue-500/10",
  },
  amber: {
    border: "border-l-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    button: "bg-amber-600 hover:bg-amber-700 text-white",
    glow: "shadow-amber-500/10",
  },
  rose: {
    border: "border-l-rose-500",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    button: "bg-rose-600 hover:bg-rose-700 text-white",
    glow: "shadow-rose-500/10",
  },
  indigo: {
    border: "border-l-indigo-500",
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
    button: "bg-indigo-600 hover:bg-indigo-700 text-white",
    glow: "shadow-indigo-500/10",
  },
};

function getProductIcon(iconName: string, size = 20) {
  const icons: Record<string, React.ReactNode> = {
    Search: <Search size={size} />,
    Megaphone: <Megaphone size={size} />,
    Globe: <Globe size={size} />,
    Package: <Package size={size} />,
    Users: <Users size={size} />,
    Bot: <Bot size={size} />,
  };
  return icons[iconName] ?? <Activity size={size} />;
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

function RequestStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    submitted: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    in_review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    in_progress: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
    complete: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  const labels: Record<string, string> = {
    submitted: "Submitted",
    in_review: "In Review",
    in_progress: "In Progress",
    complete: "Complete",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variants[status] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
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
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${variants[priority] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
    >
      {priority}
    </span>
  );
}

export default function AgentServicesPage() {
  const {
    currentTenantId,
    tenants,
    agentSubscriptions,
    agentRequests,
    agentTasks,
    agentPricingOverrides,
    activateAgent,
    deactivateAgent,
    pauseAgent,
    resumeAgent,
    submitAgentRequest,
    addOversight,
  } = useApp();

  const [requestForm, setRequestForm] = useState({
    productId: "",
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
    dueDatePreference: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const currentTenant = tenants.find((t) => t.id === currentTenantId);
  const mySubscriptions = agentSubscriptions.filter(
    (s) => s.tenantId === currentTenantId,
  );
  const activeSubscriptions = mySubscriptions.filter(
    (s) => s.status === "active",
  );
  const myRequests = agentRequests.filter(
    (r) => r.tenantId === currentTenantId,
  );
  const myTasks = agentTasks.filter(
    (t) => t.tenantId === currentTenantId && t.status === "complete",
  );
  const myDeliverables = DEMO_AGENT_DELIVERABLES.filter(
    (d) => d.tenantId === currentTenantId,
  );
  const myPerformance = DEMO_AGENT_PERFORMANCE.filter(
    (p) => p.tenantId === currentTenantId,
  );

  const getEffectivePrice = (productId: string, defaultPrice: number) =>
    agentPricingOverrides[productId] ?? defaultPrice;

  const getSubForProduct = (productId: string) =>
    mySubscriptions.find(
      (s) => s.productId === productId && s.status !== "cancelled",
    );

  const activeProductIds = new Set(activeSubscriptions.map((s) => s.productId));

  const handleSubmitRequest = () => {
    if (
      !requestForm.productId ||
      !requestForm.title.trim() ||
      !requestForm.description.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    submitAgentRequest({
      tenantId: currentTenantId,
      productId: requestForm.productId,
      title: requestForm.title,
      description: requestForm.description,
      priority: requestForm.priority,
      dueDatePreference: requestForm.dueDatePreference,
    });
    setRequestForm({
      productId: "",
      title: "",
      description: "",
      priority: "medium",
      dueDatePreference: "",
    });
    setSubmitting(false);
    toast.success("Request submitted. Our team will be in touch shortly.");
  };

  const displayProducts = AGENT_PRODUCTS.filter(
    (p) => p.category !== "oversight",
  );
  const oversightProduct = AGENT_PRODUCTS.find(
    (p) => p.category === "oversight",
  );

  const delivByProduct = AGENT_PRODUCTS.reduce(
    (acc, p) => {
      const items = myDeliverables.filter((d) => d.productId === p.id);
      if (items.length) acc[p.id] = items;
      return acc;
    },
    {} as Record<string, typeof myDeliverables>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Bot size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Agent Services</h1>
            <p className="text-sm text-slate-400">
              Managed AI services for {currentTenant?.name ?? "your business"}
            </p>
          </div>
        </div>
        {activeSubscriptions.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              {activeSubscriptions.length} active
            </span>
          </div>
        )}
      </div>

      <Tabs defaultValue="store">
        <TabsList className="bg-slate-800 border border-slate-700 mb-6">
          <TabsTrigger
            value="store"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="agents.store.tab"
          >
            Agent Store
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="agents.active.tab"
          >
            Active Agents
            {activeSubscriptions.length > 0 && (
              <span className="ml-1.5 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center inline-flex">
                {activeSubscriptions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="agents.requests.tab"
          >
            Request Queue
          </TabsTrigger>
          <TabsTrigger
            value="deliverables"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="agents.deliverables.tab"
          >
            Deliverables
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
            data-ocid="agents.performance.tab"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        {/* ======== AGENT STORE ======== */}
        <TabsContent value="store" className="space-y-4">
          <div className="mb-6">
            <h2 className="text-white font-semibold text-lg">
              AI Agent Services
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Managed services that work alongside your platform. Activate,
              track, and see results.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {displayProducts.map((product, i) => {
              const accent = ACCENT_CLASSES[product.accentColor];
              const sub = getSubForProduct(product.id);
              const isActive = sub?.status === "active";
              const isPaused = sub?.status === "paused";
              const price = getEffectivePrice(product.id, product.defaultPrice);
              const savings = product.isBundle ? 999 + 1999 - 2598 : 0;

              return (
                <div key={product.id} data-ocid={`agents.store.item.${i + 1}`}>
                  <Card
                    className={`bg-slate-800 border border-slate-700 border-l-4 ${accent.border} shadow-lg ${accent.glow} relative overflow-hidden`}
                  >
                    {isActive && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                          <CheckCircle size={10} /> Active
                        </span>
                      </div>
                    )}
                    {isPaused && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-medium border border-amber-500/20">
                          Paused
                        </span>
                      </div>
                    )}

                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className={`w-10 h-10 rounded-xl ${accent.bg} border border-white/5 flex items-center justify-center ${accent.text} shrink-0`}
                        >
                          {getProductIcon(product.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold text-base">
                              {product.name}
                            </h3>
                            {product.isBundle && (
                              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-xs">
                                Bundle
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mt-0.5">
                            {product.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-3xl font-bold text-white">
                          ${price.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-sm mb-1">/mo</span>
                        {savings > 0 && (
                          <span className="mb-1 inline-flex items-center px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
                            Save ${savings}/mo
                          </span>
                        )}
                      </div>
                      {product.isBundle && (
                        <p className="text-slate-500 text-xs mb-4">
                          vs. $2,998/mo purchased separately
                        </p>
                      )}

                      <ul className="mt-4 space-y-1.5 mb-5">
                        {product.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 text-slate-300 text-sm"
                          >
                            <Check
                              size={12}
                              className="text-emerald-500 shrink-0"
                            />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-700">
                        {isActive ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              onClick={() =>
                                toast.info("Manage agent settings")
                              }
                              data-ocid={`agents.store.secondary_button.${i + 1}`}
                            >
                              Manage
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                              onClick={() => {
                                if (sub) pauseAgent(sub.id);
                                toast.success("Agent paused");
                              }}
                              data-ocid={`agents.store.toggle.${i + 1}`}
                            >
                              Pause
                            </Button>
                          </>
                        ) : isPaused ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => {
                                if (sub) resumeAgent(sub.id);
                                toast.success("Agent resumed");
                              }}
                              data-ocid={`agents.store.toggle.${i + 1}`}
                            >
                              Resume
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => {
                                if (sub) deactivateAgent(sub.id);
                                toast.success("Agent cancelled");
                              }}
                              data-ocid={`agents.store.delete_button.${i + 1}`}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              onClick={() => {
                                activateAgent(currentTenantId, product.id);
                                toast.success(
                                  `${product.name} activated! Your team has been notified.`,
                                );
                              }}
                              data-ocid={`agents.store.primary_button.${i + 1}`}
                            >
                              Activate Service
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                              onClick={() =>
                                toast.info(
                                  "A consultant will reach out within 1 business day.",
                                )
                              }
                              data-ocid={`agents.store.secondary_button.${i + 1}`}
                            >
                              Request Consultation
                            </Button>
                          </>
                        )}
                      </div>

                      {isActive &&
                        product.allowsOversight &&
                        !sub?.hasOversight &&
                        oversightProduct && (
                          <div className="mt-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-rose-400 text-xs font-semibold">
                                  + Human Oversight Upgrade
                                </p>
                                <p className="text-slate-400 text-xs mt-0.5">
                                  $
                                  {getEffectivePrice(
                                    "agent-oversight",
                                    oversightProduct.defaultPrice,
                                  )}
                                  /mo — strategist review + priority support
                                </p>
                              </div>
                              <Button
                                size="sm"
                                className="bg-rose-600/80 hover:bg-rose-600 text-white text-xs shrink-0"
                                onClick={() => {
                                  if (sub) {
                                    addOversight(sub.id);
                                    toast.success(
                                      "Human Oversight activated! Your strategist will reach out within 1 business day.",
                                    );
                                  }
                                }}
                                data-ocid={`agents.store.secondary_button.${i + 1}`}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Bundle upgrade nudge when both SEO and Ads are individually active */}
          {activeProductIds.has("agent-seo") &&
            activeProductIds.has("agent-ads") &&
            !activeProductIds.has("agent-bundle") && (
              <div
                className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
                data-ocid="agents.store.card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package size={16} className="text-amber-400" />
                      <p className="text-amber-400 font-semibold text-sm">
                        Bundle Upgrade Available
                      </p>
                    </div>
                    <p className="text-slate-300 text-sm">
                      You're paying $2,998/mo for SEO & Ads separately. Switch
                      to the SEO + Paid Ads Bundle and save{" "}
                      <span className="text-amber-400 font-bold">$400/mo</span>.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                    onClick={() => {
                      activateAgent(currentTenantId, "agent-bundle");
                      toast.success(
                        "Upgraded to SEO + Paid Ads Bundle! Individual subscriptions cancelled. Saving $400/mo.",
                      );
                    }}
                    data-ocid="agents.store.primary_button"
                  >
                    Upgrade to Bundle
                  </Button>
                </div>
              </div>
            )}

          {oversightProduct && (
            <Card
              className="bg-slate-800 border border-rose-500/30 border-l-4 border-l-rose-500 mt-6"
              data-ocid="agents.store.card"
            >
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">
                        {oversightProduct.name}
                      </h3>
                      <p className="text-slate-400 text-sm mt-0.5">
                        {oversightProduct.tagline}
                      </p>
                      <div className="flex items-end gap-2 mt-2">
                        <span className="text-2xl font-bold text-white">
                          $
                          {getEffectivePrice(
                            "agent-oversight",
                            oversightProduct.defaultPrice,
                          )}
                        </span>
                        <span className="text-slate-400 text-sm mb-0.5">
                          /mo add-on
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1">
                        {oversightProduct.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 text-slate-300 text-sm"
                          >
                            <Check
                              size={12}
                              className="text-rose-400 shrink-0"
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white shrink-0 mt-1"
                    onClick={() =>
                      toast.info(
                        "Contact your account manager to add Human Oversight to an active agent.",
                      )
                    }
                    data-ocid="agents.store.secondary_button"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ======== ACTIVE AGENTS ======== */}
        <TabsContent value="active" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">
              Your currently active managed AI services.
            </p>
            <Link to="/billing">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-500/30 text-purple-300 hover:text-white"
                data-ocid="agents.manage_billing.button"
              >
                <CreditCard className="w-4 h-4 mr-1" /> Manage Billing
              </Button>
            </Link>
          </div>
          {activeSubscriptions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="agents.active.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Bot size={28} className="text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold text-lg">
                No active agent services
              </h3>
              <p className="text-slate-400 text-sm mt-2 max-w-sm">
                Visit the Agent Store to activate your first managed AI service
                and start seeing results.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {activeSubscriptions.map((sub) => {
                const product = AGENT_PRODUCTS.find(
                  (p) => p.id === sub.productId,
                );
                if (!product) return null;
                const accent = ACCENT_CLASSES[product.accentColor];
                const recentTasks = myTasks
                  .filter((t) => t.productId === sub.productId)
                  .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
                  .slice(0, 3);
                const perfSnap = myPerformance
                  .filter((p) => p.productId === sub.productId)
                  .sort((a, b) => b.month.localeCompare(a.month))[0];

                return (
                  <Card
                    key={sub.id}
                    className={`bg-slate-800 border border-slate-700 border-l-4 ${accent.border}`}
                    data-ocid="agents.active.card"
                  >
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className={`w-10 h-10 rounded-xl ${accent.bg} flex items-center justify-center ${accent.text} shrink-0`}
                        >
                          {getProductIcon(product.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold">
                              {product.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                              <CheckCircle size={10} /> Active
                            </span>
                            {sub.hasOversight && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-xs font-medium border border-rose-500/20">
                                <Users size={10} /> Oversight
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs mt-0.5">
                            Active since{" "}
                            {new Date(sub.activatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {(sub.productId === "agent-seo" ||
                          sub.productId === "agent-bundle") && (
                          <Link to="/seo-geo-agent">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                              data-ocid="agents.active.open_workspace_button"
                            >
                              Open SEO &amp; GEO Workspace
                            </Button>
                          </Link>
                        )}
                        {(sub.productId === "agent-ads" ||
                          sub.productId === "agent-bundle") && (
                          <Link to="/paid-ads-agent">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                            >
                              Open Paid Ads Workspace
                            </Button>
                          </Link>
                        )}
                        {sub.productId === "agent-website" && (
                          <Link to="/website-agent">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                            >
                              Open Website Workspace
                            </Button>
                          </Link>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-900 rounded-lg p-3">
                          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                            Currently Working On
                          </p>
                          <p className="text-slate-200 text-sm">
                            {sub.currentWork}
                          </p>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-3">
                          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                            Next Deliverable
                          </p>
                          <p className="text-slate-200 text-sm">
                            {sub.nextDeliverable}
                          </p>
                        </div>
                      </div>

                      {recentTasks.length > 0 && (
                        <div className="mb-4">
                          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                            Recently Completed
                          </p>
                          <div className="space-y-1">
                            {recentTasks.map((t) => (
                              <div
                                key={t.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <Check
                                  size={12}
                                  className="text-emerald-500 shrink-0"
                                />
                                <span className="text-slate-300">
                                  {t.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {perfSnap && (
                        <div className="bg-slate-900 rounded-lg p-3">
                          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                            Latest Performance
                          </p>
                          <div className="flex flex-wrap gap-4 mb-2">
                            {perfSnap.seoScoreChange !== undefined && (
                              <div>
                                <p className="text-slate-400 text-xs">
                                  SEO Score
                                </p>
                                <p
                                  className={`text-lg font-bold ${perfSnap.seoScoreChange >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                >
                                  {perfSnap.seoScoreChange >= 0 ? "+" : ""}
                                  {perfSnap.seoScoreChange}
                                </p>
                              </div>
                            )}
                            {perfSnap.leadChange !== undefined && (
                              <div>
                                <p className="text-slate-400 text-xs">
                                  New Leads
                                </p>
                                <p
                                  className={`text-lg font-bold ${perfSnap.leadChange >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                >
                                  {perfSnap.leadChange >= 0 ? "+" : ""}
                                  {perfSnap.leadChange}
                                </p>
                              </div>
                            )}
                            {perfSnap.adsClicks !== undefined && (
                              <div>
                                <p className="text-slate-400 text-xs">
                                  Ad Clicks
                                </p>
                                <p className="text-lg font-bold text-purple-400">
                                  {perfSnap.adsClicks.toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs">
                            {perfSnap.summary}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ======== REQUEST QUEUE ======== */}
        <TabsContent value="requests" className="space-y-6">
          {activeSubscriptions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="agents.requests.empty_state"
            >
              <p className="text-slate-400 text-sm">
                Activate an agent service first to submit requests.
              </p>
            </div>
          ) : (
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Pencil size={14} className="text-indigo-400" /> Submit a
                  Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300 text-sm mb-1 block">
                    Agent Service
                  </Label>
                  <Select
                    value={requestForm.productId}
                    onValueChange={(v) =>
                      setRequestForm((p) => ({ ...p, productId: v }))
                    }
                  >
                    <SelectTrigger
                      className="bg-slate-700 border-slate-600 text-slate-200"
                      data-ocid="agents.requests.select"
                    >
                      <SelectValue placeholder="Select active agent..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {activeSubscriptions.map((sub) => {
                        const p = AGENT_PRODUCTS.find(
                          (prod) => prod.id === sub.productId,
                        );
                        return (
                          <SelectItem
                            key={sub.id}
                            value={sub.productId}
                            className="text-slate-200"
                          >
                            {p?.name ?? sub.productId}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-1 block">
                    Request Title
                  </Label>
                  <Input
                    data-ocid="agents.requests.input"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    placeholder="e.g., Build landing page for spring promotion"
                    value={requestForm.title}
                    onChange={(e) =>
                      setRequestForm((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-1 block">
                    Description
                  </Label>
                  <Textarea
                    data-ocid="agents.requests.textarea"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 min-h-[90px]"
                    placeholder="Describe what you need and any relevant context..."
                    value={requestForm.description}
                    onChange={(e) =>
                      setRequestForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 text-sm mb-1 block">
                      Priority
                    </Label>
                    <Select
                      value={requestForm.priority}
                      onValueChange={(v) =>
                        setRequestForm((p) => ({
                          ...p,
                          priority: v as "high" | "medium" | "low",
                        }))
                      }
                    >
                      <SelectTrigger
                        className="bg-slate-700 border-slate-600 text-slate-200"
                        data-ocid="agents.requests.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
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
                  <div>
                    <Label className="text-slate-300 text-sm mb-1 block">
                      Preferred Due Date
                    </Label>
                    <Input
                      data-ocid="agents.requests.input"
                      type="date"
                      className="bg-slate-700 border-slate-600 text-white"
                      value={requestForm.dueDatePreference}
                      onChange={(e) =>
                        setRequestForm((p) => ({
                          ...p,
                          dueDatePreference: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Button
                  data-ocid="agents.requests.submit_button"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                >
                  Submit Request
                </Button>
              </CardContent>
            </Card>
          )}

          {myRequests.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">My Requests</h3>
              <div className="space-y-3" data-ocid="agents.requests.list">
                {myRequests.map((req, i) => {
                  const product = AGENT_PRODUCTS.find(
                    (p) => p.id === req.productId,
                  );
                  return (
                    <Card
                      key={req.id}
                      data-ocid={`agents.requests.item.${i + 1}`}
                      className="bg-slate-800 border border-slate-700"
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-slate-200 text-sm font-medium">
                                {req.title}
                              </p>
                              <RequestStatusBadge status={req.status} />
                              <PriorityBadge priority={req.priority} />
                            </div>
                            <p className="text-slate-400 text-xs mt-1">
                              {product?.name}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              Submitted{" "}
                              {new Date(req.submittedAt).toLocaleDateString()}
                              {req.dueDatePreference &&
                                ` • Requested by ${req.dueDatePreference}`}
                            </p>
                            {req.description && (
                              <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                                {req.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {myRequests.length === 0 && activeSubscriptions.length > 0 && (
            <div
              className="text-center py-8"
              data-ocid="agents.requests.empty_state"
            >
              <p className="text-slate-400 text-sm">
                No requests submitted yet. Use the form above to request work
                from your agent team.
              </p>
            </div>
          )}
        </TabsContent>

        {/* ======== DELIVERABLES ======== */}
        <TabsContent value="deliverables" className="space-y-4">
          {Object.keys(delivByProduct).length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="agents.deliverables.empty_state"
            >
              <p className="text-slate-400 text-sm">
                No deliverables completed yet. Check back after your first month
                of service.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(delivByProduct).map(([productId, items]) => {
                const product = AGENT_PRODUCTS.find((p) => p.id === productId);
                const accent =
                  ACCENT_CLASSES[product?.accentColor ?? "emerald"];
                const byMonth = items.reduce(
                  (acc, d) => {
                    if (!acc[d.month]) acc[d.month] = [];
                    acc[d.month].push(d);
                    return acc;
                  },
                  {} as Record<string, typeof items>,
                );
                const sortedMonths = Object.keys(byMonth).sort((a, b) =>
                  b.localeCompare(a),
                );

                return (
                  <div key={productId}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={accent.text}>
                        {getProductIcon(product?.icon ?? "Bot")}
                      </span>
                      <h3 className={`font-semibold ${accent.text}`}>
                        {product?.name}
                      </h3>
                    </div>
                    {sortedMonths.map((month) => (
                      <div key={month} className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-slate-400 text-xs font-semibold">
                            {new Date(`${month}-01`).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric" },
                            )}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${accent.bg} ${accent.text} font-medium`}
                          >
                            {byMonth[month].length} deliverable
                            {byMonth[month].length !== 1 ? "s" : ""} completed
                          </span>
                        </div>
                        <Card className="bg-slate-800 border border-slate-700">
                          <CardContent className="p-0">
                            {byMonth[month]
                              .sort((a, b) => b.completedAt - a.completedAt)
                              .map((d, idx) => (
                                <div
                                  key={d.id}
                                  data-ocid={`agents.deliverables.item.${idx + 1}`}
                                  className="flex items-start gap-3 p-4 border-b border-slate-700 last:border-0"
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
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Badge
                                      className={`${accent.bg} ${accent.text} border-0 text-xs capitalize`}
                                    >
                                      {d.type}
                                    </Badge>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 text-xs text-slate-400 hover:text-white"
                                      onClick={() =>
                                        toast.info("Opening report...")
                                      }
                                      data-ocid="agents.deliverables.secondary_button"
                                    >
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ======== PERFORMANCE ======== */}
        <TabsContent value="performance" className="space-y-6">
          <div>
            <h2 className="text-white font-semibold text-lg">Your Results</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              A summary of impact from your active agent services.
            </p>
          </div>

          {myPerformance.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="agents.performance.empty_state"
            >
              <p className="text-slate-400 text-sm">
                Performance data will appear here after your first month of
                service.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeSubscriptions.map((sub) => {
                const product = AGENT_PRODUCTS.find(
                  (p) => p.id === sub.productId,
                );
                const accent =
                  ACCENT_CLASSES[product?.accentColor ?? "emerald"];
                const snaps = myPerformance
                  .filter((p) => p.productId === sub.productId)
                  .sort((a, b) => b.month.localeCompare(a.month));

                if (!snaps.length) return null;
                const latest = snaps[0];

                return (
                  <Card
                    key={sub.id}
                    className={`bg-slate-800 border border-slate-700 border-l-4 ${accent.border}`}
                    data-ocid="agents.performance.card"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <span className={accent.text}>
                          {getProductIcon(product?.icon ?? "Bot")}
                        </span>
                        <CardTitle className="text-white text-sm">
                          {product?.name}
                        </CardTitle>
                        <span className="text-slate-500 text-xs">
                          • Latest:{" "}
                          {new Date(`${latest.month}-01`).toLocaleDateString(
                            "en-US",
                            { month: "long", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(() => {
                          const previous = snaps[1];
                          const seoDelta =
                            previous?.seoScoreChange !== undefined &&
                            latest.seoScoreChange !== undefined
                              ? latest.seoScoreChange - previous.seoScoreChange
                              : null;
                          const leadDelta =
                            previous?.leadChange !== undefined &&
                            latest.leadChange !== undefined
                              ? latest.leadChange - previous.leadChange
                              : null;
                          const clicksDelta =
                            previous?.adsClicks !== undefined &&
                            latest.adsClicks !== undefined
                              ? latest.adsClicks - previous.adsClicks
                              : null;
                          const impressionsDelta =
                            previous?.adsImpressions !== undefined &&
                            latest.adsImpressions !== undefined
                              ? latest.adsImpressions - previous.adsImpressions
                              : null;
                          const pagesDelta =
                            previous?.websitePagesUpdated !== undefined &&
                            latest.websitePagesUpdated !== undefined
                              ? latest.websitePagesUpdated -
                                previous.websitePagesUpdated
                              : null;
                          return (
                            <>
                              {latest.seoScoreChange !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    SEO Score
                                  </p>
                                  <p
                                    className={`text-2xl font-bold ${latest.seoScoreChange >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                  >
                                    {latest.seoScoreChange >= 0 ? "+" : ""}
                                    {latest.seoScoreChange}
                                  </p>
                                  {seoDelta !== null && (
                                    <div
                                      className={`flex items-center gap-1 text-xs mt-1 ${seoDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                    >
                                      {seoDelta >= 0 ? (
                                        <TrendingUp size={11} />
                                      ) : (
                                        <TrendingDown size={11} />
                                      )}
                                      <span>
                                        {seoDelta >= 0 ? "+" : ""}
                                        {seoDelta} vs last mo
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {latest.leadChange !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    New Leads
                                  </p>
                                  <p
                                    className={`text-2xl font-bold ${latest.leadChange >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                  >
                                    {latest.leadChange >= 0 ? "+" : ""}
                                    {latest.leadChange}
                                  </p>
                                  {leadDelta !== null && (
                                    <div
                                      className={`flex items-center gap-1 text-xs mt-1 ${leadDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                    >
                                      {leadDelta >= 0 ? (
                                        <TrendingUp size={11} />
                                      ) : (
                                        <TrendingDown size={11} />
                                      )}
                                      <span>
                                        {leadDelta >= 0 ? "+" : ""}
                                        {leadDelta} vs last mo
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {latest.adsSpend !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    Ads Spend
                                  </p>
                                  <p className="text-2xl font-bold text-purple-400">
                                    ${latest.adsSpend.toLocaleString()}
                                  </p>
                                </div>
                              )}
                              {latest.adsClicks !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    Clicks
                                  </p>
                                  <p className="text-2xl font-bold text-blue-400">
                                    {latest.adsClicks.toLocaleString()}
                                  </p>
                                  {clicksDelta !== null && (
                                    <div
                                      className={`flex items-center gap-1 text-xs mt-1 ${clicksDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                    >
                                      {clicksDelta >= 0 ? (
                                        <TrendingUp size={11} />
                                      ) : (
                                        <TrendingDown size={11} />
                                      )}
                                      <span>
                                        {clicksDelta >= 0 ? "+" : ""}
                                        {clicksDelta.toLocaleString()} vs last
                                        mo
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {latest.adsImpressions !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    Impressions
                                  </p>
                                  <p className="text-2xl font-bold text-slate-200">
                                    {latest.adsImpressions.toLocaleString()}
                                  </p>
                                  {impressionsDelta !== null && (
                                    <div
                                      className={`flex items-center gap-1 text-xs mt-1 ${impressionsDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                    >
                                      {impressionsDelta >= 0 ? (
                                        <TrendingUp size={11} />
                                      ) : (
                                        <TrendingDown size={11} />
                                      )}
                                      <span>
                                        {impressionsDelta >= 0 ? "+" : ""}
                                        {impressionsDelta.toLocaleString()} vs
                                        last mo
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {latest.websitePagesUpdated !== undefined && (
                                <div className="bg-slate-900 rounded-lg p-3">
                                  <p className="text-slate-400 text-xs">
                                    Pages Updated
                                  </p>
                                  <p className="text-2xl font-bold text-blue-400">
                                    {latest.websitePagesUpdated}
                                  </p>
                                  {pagesDelta !== null && (
                                    <div
                                      className={`flex items-center gap-1 text-xs mt-1 ${pagesDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                    >
                                      {pagesDelta >= 0 ? (
                                        <TrendingUp size={11} />
                                      ) : (
                                        <TrendingDown size={11} />
                                      )}
                                      <span>
                                        {pagesDelta >= 0 ? "+" : ""}
                                        {pagesDelta} vs last mo
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                      <p className="text-slate-300 text-sm">{latest.summary}</p>
                    </CardContent>
                  </Card>
                );
              })}

              {/* AI Recommendations */}
              <Card className="bg-slate-800 border border-indigo-500/30 border-l-4 border-l-indigo-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-indigo-400" />
                    <CardTitle className="text-white text-sm">
                      AI Business Manager Recommendations
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeProductIds.has("agent-seo") ||
                  activeProductIds.has("agent-bundle") ? (
                    <div className="flex items-start gap-2">
                      <ChevronRight
                        size={14}
                        className="text-emerald-400 mt-0.5 shrink-0"
                      />
                      <p className="text-slate-300 text-sm">
                        Your SEO momentum is building. Request a dedicated
                        landing page for your top service area to accelerate
                        ranking gains.
                      </p>
                    </div>
                  ) : null}
                  {activeProductIds.has("agent-ads") ||
                  activeProductIds.has("agent-bundle") ? (
                    <div className="flex items-start gap-2">
                      <ChevronRight
                        size={14}
                        className="text-purple-400 mt-0.5 shrink-0"
                      />
                      <p className="text-slate-300 text-sm">
                        Your ads are live. Consider adding retargeting audiences
                        to recapture visitors who didn't convert on the first
                        visit.
                      </p>
                    </div>
                  ) : null}
                  {activeProductIds.has("agent-website") ? (
                    <div className="flex items-start gap-2">
                      <ChevronRight
                        size={14}
                        className="text-blue-400 mt-0.5 shrink-0"
                      />
                      <p className="text-slate-300 text-sm">
                        CTA improvements are showing results. Submit a request
                        for a homepage refresh to align with your updated
                        messaging.
                      </p>
                    </div>
                  ) : null}
                  <div className="flex items-start gap-2">
                    <ChevronRight
                      size={14}
                      className="text-amber-400 mt-0.5 shrink-0"
                    />
                    <p className="text-slate-300 text-sm">
                      Your Google Business Profile has room for improvement. Ask
                      your agent to add recent photos and respond to open
                      reviews.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Next Best Actions */}
              {(() => {
                const nextBestActions: string[] = [];
                for (const sub of activeSubscriptions) {
                  const product = AGENT_PRODUCTS.find(
                    (p) => p.id === sub.productId,
                  );
                  if (
                    sub.productId === "agent-seo" ||
                    sub.productId === "agent-bundle"
                  ) {
                    nextBestActions.push(
                      "Review the latest GBP optimization tasks from your SEO Agent — approving them this week keeps your ranking momentum.",
                    );
                  }
                  if (
                    sub.productId === "agent-ads" ||
                    sub.productId === "agent-bundle"
                  ) {
                    nextBestActions.push(
                      "Your Paid Ads Agent has an A/B test running — check back in 3 days for results to approve the winning variant.",
                    );
                  }
                  if (sub.productId === "agent-website") {
                    nextBestActions.push(
                      "Three service page CTAs are queued for your review in the Website Agent. Approving them takes 2 minutes and directly impacts conversion.",
                    );
                  }
                  if (product?.allowsOversight && !sub.hasOversight) {
                    nextBestActions.push(
                      `Add Human Oversight to ${product.name} for dedicated strategist review and monthly check-ins — $299/mo add-on.`,
                    );
                  }
                }
                if (nextBestActions.length === 0) {
                  nextBestActions.push(
                    "Your agents are running smoothly. Check back next week for updated performance data.",
                  );
                }
                return (
                  <Card
                    className="bg-slate-800 border border-indigo-500/30 border-l-4 border-l-indigo-500 mt-2"
                    data-ocid="agents.performance.card"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <Sparkles size={14} className="text-indigo-400" />
                        Next Best Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {nextBestActions.map((action) => (
                          <div
                            key={action.slice(0, 40)}
                            className="flex items-start gap-2"
                          >
                            <ChevronRight
                              size={14}
                              className="text-indigo-400 mt-0.5 shrink-0"
                            />
                            <p className="text-slate-300 text-sm">{action}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
