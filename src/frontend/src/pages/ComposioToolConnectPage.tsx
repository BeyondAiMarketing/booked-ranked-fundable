import {
  AlertTriangle,
  BarChart3,
  Bookmark,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  Plug,
  RefreshCw,
  Shield,
  ShoppingCart,
  Truck,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useActor } from "../hooks/useActor";

interface ToolDef {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: typeof Mail;
  color: string;
  dotColor: string;
  connected: boolean;
  connectedAs?: string;
  lastSync?: string;
  scope: "personal" | "team" | "admin";
  actions: string[];
}

const TOOLS: ToolDef[] = [
  {
    id: "gmail",
    name: "Gmail",
    category: "Communication",
    description: "Read, draft, and send emails autonomously via your AI agent.",
    icon: Mail,
    color: "border-red-500/30 bg-red-500/10",
    dotColor: "bg-red-400",
    connected: false,
    scope: "personal",
    actions: ["Read inbox", "Draft replies", "Send emails", "Flag priority"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "Scheduling",
    description: "Book appointments, check availability, and send reminders.",
    icon: Calendar,
    color: "border-blue-500/30 bg-blue-500/10",
    dotColor: "bg-blue-400",
    connected: false,
    scope: "personal",
    actions: [
      "Book meetings",
      "Check availability",
      "Send reminders",
      "Block time",
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    description:
      "Send invoices, track payments, and trigger follow-ups on unpaid bills.",
    icon: CreditCard,
    color: "border-violet-500/30 bg-violet-500/10",
    dotColor: "bg-violet-400",
    connected: false,
    scope: "team",
    actions: [
      "Send invoices",
      "Track payments",
      "Trigger follow-ups",
      "Create subscriptions",
    ],
  },
  {
    id: "companycam",
    name: "CompanyCam",
    category: "Field Operations",
    description:
      "Pull job site photos into estimates and proposals automatically.",
    icon: Camera,
    color: "border-amber-500/30 bg-amber-500/10",
    dotColor: "bg-amber-400",
    connected: false,
    scope: "team",
    actions: [
      "Pull photos",
      "Auto-tag projects",
      "Link to estimates",
      "Share galleries",
    ],
  },
  {
    id: "twilio",
    name: "Twilio SMS",
    category: "Communication",
    description:
      "Send and receive SMS messages, auto-respond to inbound texts.",
    icon: MessageSquare,
    color: "border-emerald-500/30 bg-emerald-500/10",
    dotColor: "bg-emerald-400",
    connected: false,
    scope: "team",
    actions: ["Send SMS", "Auto-respond", "Two-way chat", "Schedule texts"],
  },
  {
    id: "vapi",
    name: "Vapi.ai",
    category: "Voice",
    description:
      "Deploy and manage AI voice agents for inbound and outbound calls.",
    icon: Phone,
    color: "border-sky-500/30 bg-sky-500/10",
    dotColor: "bg-sky-400",
    connected: false,
    scope: "team",
    actions: [
      "Deploy agents",
      "Manage calls",
      "Log transcripts",
      "Book appointments",
    ],
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "Accounting",
    description:
      "Sync invoices, track expenses, and flag outstanding balances.",
    icon: FileText,
    color: "border-green-500/30 bg-green-500/10",
    dotColor: "bg-green-400",
    connected: false,
    scope: "team",
    actions: [
      "Sync invoices",
      "Track expenses",
      "Flag balances",
      "Generate reports",
    ],
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "E-Commerce",
    description:
      "Track orders, manage inventory, and trigger fulfillment workflows.",
    icon: ShoppingCart,
    color: "border-teal-500/30 bg-teal-500/10",
    dotColor: "bg-teal-400",
    connected: false,
    scope: "team",
    actions: [
      "Track orders",
      "Manage inventory",
      "Trigger workflows",
      "Customer alerts",
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    description:
      "Two-way sync leads, opportunities, and account data with BRF.",
    icon: Users,
    color: "border-indigo-500/30 bg-indigo-500/10",
    dotColor: "bg-indigo-400",
    connected: false,
    scope: "team",
    actions: [
      "Sync leads",
      "Update opportunities",
      "Log activities",
      "Map fields",
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    description: "Push BRF leads into HubSpot sequences and track engagement.",
    icon: Globe,
    color: "border-orange-500/30 bg-orange-500/10",
    dotColor: "bg-orange-400",
    connected: false,
    scope: "team",
    actions: [
      "Push leads",
      "Track engagement",
      "Sync sequences",
      "Score leads",
    ],
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description:
      "Send alerts, daily digests, and priority notifications to your team.",
    icon: Zap,
    color: "border-purple-500/30 bg-purple-500/10",
    dotColor: "bg-purple-400",
    connected: false,
    scope: "team",
    actions: [
      "Send alerts",
      "Daily digests",
      "Priority pings",
      "Channel posts",
    ],
  },
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    description:
      "Log meeting notes, create project pages, and sync task lists.",
    icon: Bookmark,
    color: "border-gray-500/30 bg-gray-500/10",
    dotColor: "bg-gray-400",
    connected: false,
    scope: "personal",
    actions: ["Log notes", "Create pages", "Sync tasks", "Link databases"],
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    category: "Analytics",
    description:
      "Pull traffic data, conversion rates, and campaign performance.",
    icon: BarChart3,
    color: "border-yellow-500/30 bg-yellow-500/10",
    dotColor: "bg-yellow-400",
    connected: false,
    scope: "team",
    actions: [
      "Pull traffic",
      "Track conversions",
      "Campaign reports",
      "Audience insights",
    ],
  },
  {
    id: "shipstation",
    name: "ShipStation",
    category: "Logistics",
    description: "Sync shipping labels, track deliveries, and alert customers.",
    icon: Truck,
    color: "border-cyan-500/30 bg-cyan-500/10",
    dotColor: "bg-cyan-400",
    connected: false,
    scope: "team",
    actions: ["Sync labels", "Track deliveries", "Customer alerts", "Returns"],
  },
  {
    id: "buildium",
    name: "Buildium",
    category: "Property Management",
    description: "Sync tenant data, maintenance requests, and lease renewals.",
    icon: Building2,
    color: "border-rose-500/30 bg-rose-500/10",
    dotColor: "bg-rose-400",
    connected: false,
    scope: "team",
    actions: [
      "Sync tenants",
      "Maintenance requests",
      "Lease renewals",
      "Rent tracking",
    ],
  },
];

const CATEGORIES = Array.from(new Set(TOOLS.map((t) => t.category)));

export default function ComposioToolConnectPage() {
  useActor();
  const [tools, setTools] = useState<ToolDef[]>(TOOLS);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<
    "checking" | "healthy" | "error"
  >("checking");

  // Simulate a health check on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHealthStatus("healthy");
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredTools = tools.filter((t) => {
    const matchesFilter = filter === "All" || t.category === filter;
    const matchesSearch =
      search.trim() === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const connectedCount = tools.filter((t) => t.connected).length;

  const handleConnect = useCallback(async (toolId: string) => {
    setConnectingId(toolId);
    try {
      // Simulate OAuth connection flow
      await new Promise((res) => setTimeout(res, 1500));

      setTools((prev) =>
        prev.map((t) =>
          t.id === toolId
            ? {
                ...t,
                connected: true,
                connectedAs:
                  t.id === "gmail"
                    ? "admin@yourbusiness.com"
                    : t.id === "google-calendar"
                      ? "admin@yourbusiness.com"
                      : t.id === "stripe"
                        ? "acct_1ABC123"
                        : t.id === "twilio"
                          ? "+1-555-0199"
                          : `${t.name} Account`,
                lastSync: "Just now",
              }
            : t,
        ),
      );
      toast.success(
        `${TOOLS.find((t) => t.id === toolId)?.name} connected successfully`,
      );
    } catch {
      toast.error("Connection failed. Please try again.");
    } finally {
      setConnectingId(null);
    }
  }, []);

  const handleDisconnect = useCallback((toolId: string) => {
    setTools((prev) =>
      prev.map((t) =>
        t.id === toolId
          ? {
              ...t,
              connected: false,
              connectedAs: undefined,
              lastSync: undefined,
            }
          : t,
      ),
    );
    toast.success(`${TOOLS.find((t) => t.id === toolId)?.name} disconnected`);
  }, []);

  const handleSyncAll = useCallback(() => {
    const connected = tools.filter((t) => t.connected);
    if (connected.length === 0) {
      toast.info("No tools connected yet.");
      return;
    }
    setTools((prev) =>
      prev.map((t) => (t.connected ? { ...t, lastSync: "Just now" } : t)),
    );
    toast.success(
      `Synced ${connected.length} connected tool${connected.length > 1 ? "s" : ""}`,
    );
  }, [tools]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Plug className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">
              Connected Tools
            </h1>
            <p className="text-sm text-slate-400">
              Link external apps via Composio — your AI agent works inside the
              tools you already use.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/10">
            <Shield
              size={14}
              className={
                healthStatus === "healthy"
                  ? "text-emerald-400"
                  : healthStatus === "error"
                    ? "text-red-400"
                    : "text-amber-400"
              }
            />
            <span className="text-xs text-slate-300">
              {healthStatus === "checking"
                ? "Checking MCP health..."
                : healthStatus === "healthy"
                  ? "MCP Router Healthy"
                  : "MCP Router Error"}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-border text-muted-foreground gap-1.5"
            onClick={handleSyncAll}
            data-ocid="composio.sync_all_button"
          >
            <RefreshCw size={13} /> Sync All
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Tools", value: tools.length, icon: Plug },
          {
            label: "Connected",
            value: connectedCount,
            icon: CheckCircle2,
            color: "text-emerald-400",
          },
          { label: "Categories", value: CATEGORIES.length, icon: Zap },
          {
            label: "Pending",
            value: tools.length - connectedCount,
            icon: AlertTriangle,
            color: "text-amber-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900/60 border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <stat.icon size={14} className={stat.color ?? "text-slate-400"} />
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Primary MCP Layer Status */}
      <div className="mb-6 bg-slate-900/60 border border-white/10 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Plug className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Primary MCP Layer
            </h2>
            <p className="text-xs text-slate-400">
              Composio is the default routing layer for all AI agent tool calls.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
            Active
          </div>
          <span className="text-xs text-slate-500">
            Default toolkit: Gmail, Google Calendar, Stripe, CompanyCam
          </span>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-slate-900/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          data-ocid="composio.search_input"
        />
        <div className="flex gap-2 flex-wrap">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                filter === cat
                  ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                  : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              }`}
              data-ocid={`composio.filter.${cat.toLowerCase().replace(/\s+/g, "_")}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className={`border rounded-xl p-5 transition-all hover:shadow-lg ${
                tool.connected
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-slate-900/60 border-white/10 hover:border-white/20"
              }`}
              data-ocid={`composio.tool.${tool.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${tool.color}`}
                  >
                    <Icon
                      size={18}
                      className={
                        tool.connected ? "text-emerald-400" : "text-slate-300"
                      }
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {tool.name}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {tool.category}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${tool.connected ? "bg-emerald-400" : "bg-slate-600"}`}
                />
              </div>

              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                {tool.description}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tool.actions.map((action) => (
                  <Badge
                    key={action}
                    className="text-[9px] border border-white/10 bg-white/5 text-slate-300"
                  >
                    {action}
                  </Badge>
                ))}
              </div>

              {/* Connection status */}
              {tool.connected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                    <CheckCircle2 size={11} />
                    <span>Connected as {tool.connectedAs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      Synced {tool.lastSync}
                    </span>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-[10px] border-white/10 text-slate-300 hover:text-white"
                        onClick={() => {
                          setTools((prev) =>
                            prev.map((t) =>
                              t.id === tool.id
                                ? { ...t, lastSync: "Just now" }
                                : t,
                            ),
                          );
                          toast.success(`${tool.name} synced`);
                        }}
                        data-ocid={`composio.tool.${tool.id}.sync_button`}
                      >
                        <RefreshCw size={10} className="mr-1" /> Sync
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-[10px] border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDisconnect(tool.id)}
                        data-ocid={`composio.tool.${tool.id}.disconnect_button`}
                      >
                        <XCircle size={10} className="mr-1" /> Disconnect
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="w-full h-8 text-xs bg-indigo-500 hover:bg-indigo-600 text-white gap-1.5"
                  onClick={() => handleConnect(tool.id)}
                  disabled={connectingId === tool.id}
                  data-ocid={`composio.tool.${tool.id}.connect_button`}
                >
                  {connectingId === tool.id ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : (
                    <ExternalLink size={12} />
                  )}
                  {connectingId === tool.id ? "Connecting..." : "Connect"}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Plug size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tools match your search.</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
