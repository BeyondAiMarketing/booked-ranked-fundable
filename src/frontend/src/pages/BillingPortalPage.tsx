import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  Package,
  PauseCircle,
  PlayCircle,
  Shield,
  XCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useApp } from "../context/AppContext";
import { AGENT_PRODUCTS } from "../data/agentData";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents);
}

function getNextInvoiceDate(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function generateInvoices(monthlyTotal: number) {
  const invoices: {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: string;
  }[] = [];
  const baseInvoiceNum = 1042;
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i - 1);
    date.setDate(1);
    invoices.push({
      id: `#BRF-${baseInvoiceNum - i}`,
      date: date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      description: "Agent Services Subscription",
      amount: monthlyTotal > 0 ? monthlyTotal : 999,
      status: "Paid",
    });
  }
  return invoices;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  paused: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  pending: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
};

const CATEGORY_ICON_COLOR: Record<string, string> = {
  seo: "bg-emerald-500/15 text-emerald-400",
  ads: "bg-orange-500/15 text-orange-400",
  website: "bg-blue-500/15 text-blue-400",
  bundle: "bg-purple-500/15 text-purple-400",
  oversight: "bg-indigo-500/15 text-indigo-400",
};

export default function BillingPortalPage() {
  const {
    agentSubscriptions,
    agentPricingOverrides,
    currentTenantId,
    tenants,
    activateAgent,
    deactivateAgent,
    pauseAgent,
    resumeAgent,
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [cancelSubId, setCancelSubId] = useState<string | null>(null);
  const [switchSubId, setSwitchSubId] = useState<string | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const currentTenant = tenants.find((t) => t.id === currentTenantId);

  const tenantSubs = agentSubscriptions.filter(
    (s) => s.tenantId === currentTenantId && s.status !== "cancelled",
  );
  const activeSubs = tenantSubs.filter((s) => s.status === "active");

  const monthlyTotal = activeSubs.reduce((sum, sub) => {
    const product = AGENT_PRODUCTS.find((p) => p.id === sub.productId);
    if (!product) return sum;
    const price =
      sub.pricingOverride ??
      agentPricingOverrides[sub.productId] ??
      product.defaultPrice;
    return sum + price;
  }, 0);

  const invoices = generateInvoices(monthlyTotal);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  const cancelSub = agentSubscriptions.find((s) => s.id === cancelSubId);
  const cancelProduct = AGENT_PRODUCTS.find(
    (p) => p.id === cancelSub?.productId,
  );

  const switchSub = agentSubscriptions.find((s) => s.id === switchSubId);
  const switchProduct = AGENT_PRODUCTS.find(
    (p) => p.id === switchSub?.productId,
  );

  const displayProducts = AGENT_PRODUCTS.filter(
    (p) => p.category !== "oversight",
  );

  function handleConfirmCancel() {
    if (!cancelSubId) return;
    deactivateAgent(cancelSubId);
    toast.success(`${cancelProduct?.name ?? "Plan"} cancelled successfully.`);
    setCancelSubId(null);
  }

  function handlePlanSwitch(targetProductId: string) {
    if (!switchSubId || !switchSub) return;
    deactivateAgent(switchSubId);
    activateAgent(currentTenantId, targetProductId, switchSub.hasOversight);
    toast.success("Plan updated successfully.");
    setSwitchSubId(null);
  }

  function handleUpdateCard(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Payment method updated successfully.");
  }

  return (
    <div className="space-y-6" data-ocid="billing.page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <CreditCard size={20} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Billing &amp; Subscriptions
            </h1>
            <p className="text-sm text-slate-400">
              Manage your plans, payment method, and invoice history.
            </p>
          </div>
        </div>
        <Link to="/agent-services" data-ocid="billing.add_services.button">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Zap className="w-4 h-4 mr-1.5" />
            Add Services
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border border-slate-700 mb-6">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300"
            data-ocid="billing.overview.tab"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300"
            data-ocid="billing.subscriptions.tab"
          >
            Subscriptions
            {tenantSubs.length > 0 && (
              <span className="ml-1.5 w-4 h-4 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center inline-flex">
                {tenantSubs.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300"
            data-ocid="billing.payment.tab"
          >
            Payment Method
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300"
            data-ocid="billing.invoices.tab"
          >
            Invoice History
          </TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border border-slate-700">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Package size={16} className="text-emerald-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Active Plans</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {activeSubs.length}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border border-slate-700">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <CreditCard size={16} className="text-purple-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Monthly Total</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatPrice(monthlyTotal)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border border-slate-700">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
                    <FileText size={16} className="text-blue-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Next Invoice</span>
                </div>
                <p className="text-lg font-bold text-white leading-tight">
                  {getNextInvoiceDate()}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border border-slate-700">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                    <Shield size={16} className="text-indigo-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Billing Cycle</span>
                </div>
                <p className="text-3xl font-bold text-white">Monthly</p>
              </CardContent>
            </Card>
          </div>

          {/* Current Subscriptions Summary */}
          <Card className="bg-slate-800 border border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">
                Current Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tenantSubs.length === 0 ? (
                <div
                  className="text-center py-8"
                  data-ocid="billing.overview.empty_state"
                >
                  <Package size={32} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">
                    No active subscriptions yet.
                  </p>
                  <Link to="/agent-services">
                    <Button variant="link" className="text-purple-400 mt-2 p-0">
                      Browse Agent Services →
                    </Button>
                  </Link>
                </div>
              ) : (
                tenantSubs.map((sub) => {
                  const product = AGENT_PRODUCTS.find(
                    (p) => p.id === sub.productId,
                  );
                  if (!product) return null;
                  const price =
                    sub.pricingOverride ??
                    agentPricingOverrides[sub.productId] ??
                    product.defaultPrice;
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 border border-slate-600/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${CATEGORY_ICON_COLOR[product.category]}`}
                        >
                          {product.icon}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {product.name}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {formatPrice(price)}/mo
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-400 hover:text-white text-xs"
                        onClick={() => setActiveTab("subscriptions")}
                        data-ocid="billing.overview.manage.button"
                      >
                        Manage <ChevronRight size={12} className="ml-0.5" />
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/30">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">
                    Ready to add more services?
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Browse our managed AI agent catalog and unlock new growth
                    channels.
                  </p>
                </div>
                <Link to="/agent-services" data-ocid="billing.cta.button">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap">
                    <Zap className="w-4 h-4 mr-1.5" />
                    Explore Agent Services
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== SUBSCRIPTIONS TAB ===== */}
        <TabsContent value="subscriptions" className="space-y-4">
          {tenantSubs.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="billing.subscriptions.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <Package size={28} className="text-purple-400" />
              </div>
              <h3 className="text-white font-semibold text-lg">
                No active subscriptions
              </h3>
              <p className="text-slate-400 text-sm mt-2 max-w-sm">
                Activate your first agent service to start seeing results.
              </p>
              <Link to="/agent-services" className="mt-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Browse Agent Services →
                </Button>
              </Link>
            </div>
          ) : (
            tenantSubs.map((sub) => {
              const product = AGENT_PRODUCTS.find(
                (p) => p.id === sub.productId,
              );
              if (!product) return null;
              const price =
                sub.pricingOverride ??
                agentPricingOverrides[sub.productId] ??
                product.defaultPrice;

              return (
                <Card
                  key={sub.id}
                  className="bg-slate-800 border border-slate-700"
                  data-ocid="billing.subscriptions.item"
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Left — icon + info */}
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${CATEGORY_ICON_COLOR[product.category]}`}
                        >
                          {product.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-white font-bold">
                              {product.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[sub.status]}`}
                            >
                              {sub.status === "active" && (
                                <CheckCircle2 size={10} className="mr-1" />
                              )}
                              {sub.status === "paused" && (
                                <PauseCircle size={10} className="mr-1" />
                              )}
                              {sub.status === "pending" && (
                                <ArrowUpCircle size={10} className="mr-1" />
                              )}
                              {sub.status.charAt(0).toUpperCase() +
                                sub.status.slice(1)}
                            </span>
                            {sub.hasOversight && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                                <Shield size={10} /> Human Oversight: Enabled
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mb-2">
                            {product.tagline}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            <span className="text-purple-300 font-semibold text-sm">
                              {formatPrice(price)}
                              <span className="text-slate-400 font-normal">
                                /mo
                              </span>
                            </span>
                            <span>
                              Activated: {formatDate(sub.activatedAt)}
                            </span>
                          </div>
                          {sub.nextDeliverable && (
                            <p className="text-slate-300 text-xs mt-2">
                              <span className="text-slate-500">
                                Next deliverable:
                              </span>{" "}
                              {sub.nextDeliverable}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right — action buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {sub.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                            onClick={() => {
                              pauseAgent(sub.id);
                              toast.success(`${product.name} paused.`);
                            }}
                            data-ocid="billing.subscriptions.pause.button"
                          >
                            <PauseCircle className="w-3.5 h-3.5 mr-1" />
                            Pause
                          </Button>
                        )}
                        {sub.status === "paused" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                            onClick={() => {
                              resumeAgent(sub.id);
                              toast.success(`${product.name} resumed.`);
                            }}
                            data-ocid="billing.subscriptions.resume.button"
                          >
                            <PlayCircle className="w-3.5 h-3.5 mr-1" />
                            Resume
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                          onClick={() => setSwitchSubId(sub.id)}
                          data-ocid="billing.subscriptions.upgrade.button"
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5 mr-1" />
                          Change Plan
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          onClick={() => setCancelSubId(sub.id)}
                          data-ocid="billing.subscriptions.cancel.button"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* ===== PAYMENT METHOD TAB ===== */}
        <TabsContent value="payment" className="space-y-6">
          {/* Credit Card Mockup */}
          <div className="max-w-sm">
            <div
              className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl p-6 shadow-xl relative overflow-hidden"
              data-ocid="billing.payment.card"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-12 -translate-x-12" />
              {/* Card content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    <div className="w-7 h-5 rounded-sm bg-amber-400 opacity-90" />
                    <div className="w-7 h-5 rounded-sm bg-amber-300/60 -ml-3" />
                  </div>
                  <span className="text-white/80 text-sm font-semibold tracking-widest">
                    VISA
                  </span>
                </div>
                <div className="mb-4">
                  <div className="w-10 h-7 rounded bg-amber-300/30 mb-4 flex items-center justify-center">
                    <div className="w-6 h-4 rounded-sm bg-amber-200/40" />
                  </div>
                  <p className="text-white font-mono text-lg tracking-widest">
                    •••• •••• •••• 4242
                  </p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">
                      Card Holder
                    </p>
                    <p className="text-white font-medium text-sm">
                      {currentTenant?.name ?? "Business Owner"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">
                      Expires
                    </p>
                    <p className="text-white font-medium text-sm">09/27</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 px-1">
              <Shield size={14} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs">
                Secured by Stripe
              </span>
            </div>
          </div>

          {/* Update Form */}
          <Card className="bg-slate-800 border border-slate-700 max-w-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">
                Update Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateCard} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm">
                    Cardholder Name
                  </Label>
                  <Input
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    placeholder="Full name on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    data-ocid="billing.payment.name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm">Card Number</Label>
                  <Input
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    placeholder="•••• •••• •••• ••••"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    data-ocid="billing.payment.number.input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-slate-300 text-sm">Expiry</Label>
                    <Input
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      data-ocid="billing.payment.expiry.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-300 text-sm">CVC</Label>
                    <Input
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      placeholder="•••"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      data-ocid="billing.payment.cvc.input"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  data-ocid="billing.payment.submit.button"
                >
                  <CreditCard className="w-4 h-4 mr-1.5" />
                  Update Card
                </Button>
                <p className="text-slate-500 text-xs text-center">
                  Your payment details are encrypted and secured. Billing is
                  handled via Stripe.
                </p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== INVOICE HISTORY TAB ===== */}
        <TabsContent value="invoices" className="space-y-4">
          {/* Summary line */}
          <Card className="bg-slate-800 border border-slate-700">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">
                    Total paid in last 6 months
                  </p>
                  <p className="text-white font-bold text-2xl mt-0.5">
                    {formatPrice(totalPaid)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                  <FileText size={18} className="text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice list */}
          <Card className="bg-slate-800 border border-slate-700">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-700">
                {invoices.map((inv, i) => (
                  <div
                    key={inv.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
                    data-ocid={`billing.invoices.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
                        <FileText size={15} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {inv.id}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {inv.date} · {inv.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-12 sm:pl-0">
                      <span className="text-white font-semibold text-sm">
                        {formatPrice(inv.amount)}
                      </span>
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 border">
                        {inv.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white h-7 px-2"
                        onClick={() =>
                          toast.info(
                            "Invoice download is not available in the current plan.",
                          )
                        }
                        data-ocid="billing.invoices.download.button"
                      >
                        <Download size={13} className="mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== CANCEL CONFIRMATION DIALOG ===== */}
      <Dialog
        open={!!cancelSubId}
        onOpenChange={(open) => !open && setCancelSubId(null)}
      >
        <DialogContent
          className="bg-slate-900 border border-slate-700 text-white"
          data-ocid="billing.cancel.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle size={18} className="text-red-400" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to cancel{" "}
              <span className="text-white font-medium">
                {cancelProduct?.name ?? "this plan"}
              </span>
              ? This will stop all work immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-white"
              onClick={() => setCancelSubId(null)}
              data-ocid="billing.cancel.cancel.button"
            >
              Keep Plan
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirmCancel}
              data-ocid="billing.cancel.confirm.button"
            >
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== PLAN SWITCHER MODAL ===== */}
      <Dialog
        open={!!switchSubId}
        onOpenChange={(open) => !open && setSwitchSubId(null)}
      >
        <DialogContent
          className="bg-slate-900 border border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto"
          data-ocid="billing.plan_switcher.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white">Change Plan</DialogTitle>
            <DialogDescription className="text-slate-400">
              Select a new plan to switch to. Your current billing period will
              be adjusted automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {displayProducts.map((product) => {
              const isCurrent = product.id === switchProduct?.id;
              const price =
                agentPricingOverrides[product.id] ?? product.defaultPrice;

              return (
                <div
                  key={product.id}
                  className={`rounded-xl p-4 border transition-all ${
                    isCurrent
                      ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30"
                      : "border-slate-700 bg-slate-800 hover:border-slate-600"
                  }`}
                  data-ocid="billing.plan_switcher.plan.card"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg ${CATEGORY_ICON_COLOR[product.category]}`}
                      >
                        {product.icon}
                      </span>
                      <h4 className="text-white font-semibold text-sm">
                        {product.name}
                      </h4>
                    </div>
                    {isCurrent && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 border text-xs">
                        Current Plan
                      </Badge>
                    )}
                    {product.isBundle && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 border text-xs">
                        Save $400/mo
                      </Badge>
                    )}
                  </div>
                  <p className="text-purple-300 font-bold text-sm mb-2">
                    {formatPrice(price)}
                    <span className="text-slate-400 font-normal">/mo</span>
                  </p>
                  <ul className="space-y-1 mb-3">
                    {product.features.slice(0, 4).map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-1.5 text-slate-300 text-xs"
                      >
                        <CheckCircle2
                          size={11}
                          className="text-emerald-400 shrink-0"
                        />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && (
                    <Button
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs"
                      onClick={() => handlePlanSwitch(product.id)}
                      data-ocid="billing.plan_switcher.switch.button"
                    >
                      Switch to This Plan
                    </Button>
                  )}
                  {isCurrent && (
                    <p className="text-center text-slate-500 text-xs">
                      You are on this plan
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
