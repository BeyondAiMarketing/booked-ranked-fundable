import { Bot, Filter, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AILeadSearchPanel from "../components/leads/AILeadSearchPanel";
import type { GeneratedLeadUI } from "../components/leads/LeadCard";
import { EmptyState } from "../components/shared";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { AGENT_PRODUCTS } from "../data/agentData";
import type { Lead } from "../data/demoData";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  contacted: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  qualified: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  proposal: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  won: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  lost: "bg-red-500/20 text-red-300 border-red-500/30",
  closed: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const SOURCES = [
  "Website",
  "Google",
  "Referral",
  "Facebook",
  "Yelp",
  "Free Audit",
  "Demo",
  "Other",
];
const STATUSES: Lead["status"][] = ["new", "contacted", "qualified", "closed"];

type TabId = "lake" | "ai-search";

export default function LeadsPage() {
  const { currentTenantId, agentSubscriptions } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>("lake");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "Website",
    status: "new" as Lead["status"],
    niche: "",
    address: "",
  });

  const handlePushFromAI = (aiLeads: GeneratedLeadUI[]) => {
    const newLeads: Lead[] = aiLeads.map((l) => ({
      id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tenantId: currentTenantId,
      name: [l.name, l.ownerFirstName].filter(Boolean).join(" — "),
      phone: l.phone,
      email: "",
      source: `AI (${l.source})`,
      status: "new",
      createdAt: Date.now(),
    }));
    setLeads((prev) => [...newLeads, ...prev]);
    setActiveTab("lake");
  };

  const counts = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
  };

  const filtered = leads.filter((l) => {
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    const matchSource = filterSource === "all" || l.source === filterSource;
    const matchSearch =
      !searchQuery ||
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone?.includes(searchQuery);
    return matchStatus && matchSource && matchSearch;
  });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      tenantId: currentTenantId,
      name: form.name,
      phone: form.phone,
      email: form.email,
      source: form.source,
      status: form.status,
      createdAt: Date.now(),
    };
    setLeads((prev) => [newLead, ...prev]);
    setForm({
      name: "",
      phone: "",
      email: "",
      source: "Website",
      status: "new",
      niche: "",
      address: "",
    });
    setOpen(false);
    toast.success("Lead added successfully");
  };

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast.success("Lead removed");
  };

  const handleStatusChange = (id: string, status: Lead["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    toast.success("Status updated");
  };

  const getLeadAgents = (_leadId: string) =>
    agentSubscriptions
      .filter((s) => s.tenantId === currentTenantId && s.status === "active")
      .slice(0, 2);

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Leads & CRM</h2>
          <p className="text-gray-400 text-sm">
            Manage leads or find new ones with AI-powered search.
          </p>
        </div>
        {activeTab === "lake" && (
          <Button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            data-ocid="leads.add.button"
          >
            <Plus size={14} className="mr-1.5" /> Add Lead
          </Button>
        )}
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 p-1 rounded-xl bg-card border border-white/10 w-fit"
        data-ocid="leads.tabs"
      >
        <button
          type="button"
          onClick={() => setActiveTab("lake")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "lake"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
          data-ocid="leads.lake_tab"
        >
          <Users size={14} />
          Lead Lake
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ai-search")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "ai-search"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
          data-ocid="leads.ai_search_tab"
        >
          <Bot size={14} />
          AI Lead Search
        </button>
      </div>

      {/* AI Search tab */}
      {activeTab === "ai-search" && (
        <AILeadSearchPanel onPushToLake={handlePushFromAI} />
      )}

      {/* Lead Lake tab */}
      {activeTab === "lake" && (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", value: counts.total, color: "text-white" },
              { label: "New", value: counts.new, color: "text-blue-400" },
              {
                label: "Contacted",
                value: counts.contacted,
                color: "text-amber-400",
              },
              {
                label: "Qualified",
                value: counts.qualified,
                color: "text-emerald-400",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-card border border-gray-800 rounded-xl p-4 text-center"
              >
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div
            className="flex gap-3 flex-wrap items-center"
            data-ocid="leads.filters"
          >
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                data-ocid="leads.search.input"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger
                className="w-36 bg-gray-800 border-gray-700 text-gray-300"
                data-ocid="leads.filter_status.select"
              >
                <Filter size={13} className="mr-1.5 text-gray-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger
                className="w-36 bg-gray-800 border-gray-700 text-gray-300"
                data-ocid="leads.filter_source.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Sources</SelectItem>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Leads Table */}
          <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState
                icon={Users}
                title={searchQuery || filterStatus !== "all" ? "No leads match your filters" : "No leads yet"}
                description={
                  searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Add your first lead manually or use AI Lead Search to discover prospects."
                }
                actionLabel={!searchQuery && filterStatus === "all" ? "Add Lead" : undefined}
                onAction={!searchQuery && filterStatus === "all" ? () => setOpen(true) : undefined}
                data-ocid="leads.empty_state"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                        Contact
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Source
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                        Agents
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Added
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filtered.map((lead) => {
                      const leadAgents = getLeadAgents(lead.id);
                      return (
                        <tr
                          key={lead.id}
                          data-ocid={`leads.row.${lead.id}`}
                          className="hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">
                                {lead.name[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {lead.name}
                                </p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setNotesOpen(
                                      notesOpen === lead.id ? null : lead.id,
                                    )
                                  }
                                  className="text-xs text-gray-500 hover:text-indigo-400 transition-colors"
                                >
                                  {notes[lead.id] ? "View note" : "Add note"}
                                </button>
                              </div>
                            </div>
                            {notesOpen === lead.id && (
                              <div className="mt-2 ml-10">
                                <Textarea
                                  placeholder="Add a note..."
                                  value={notes[lead.id] ?? ""}
                                  onChange={(e) =>
                                    setNotes((prev) => ({
                                      ...prev,
                                      [lead.id]: e.target.value,
                                    }))
                                  }
                                  className="text-xs bg-gray-800 border-gray-700 text-gray-300 min-h-[60px]"
                                  data-ocid={`leads.note.${lead.id}`}
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <p className="text-xs text-gray-300 truncate">
                              {lead.email}
                            </p>
                            <p className="text-xs text-gray-500">
                              {lead.phone}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <Select
                              value={lead.status}
                              onValueChange={(v) =>
                                handleStatusChange(lead.id, v as Lead["status"])
                              }
                            >
                              <SelectTrigger
                                className={`h-7 text-xs border px-2 w-28 ${STATUS_COLORS[lead.status] ?? ""}`}
                                data-ocid={`leads.status.${lead.id}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                {STATUSES.map((s) => (
                                  <SelectItem
                                    key={s}
                                    value={s}
                                    className="capitalize text-xs"
                                  >
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-xs text-gray-400">
                              {lead.source}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            {leadAgents.length > 0 ? (
                              <div className="flex gap-1 flex-wrap">
                                {leadAgents.map((s) => {
                                  const p = AGENT_PRODUCTS.find(
                                    (pr) => pr.id === s.productId,
                                  );
                                  return (
                                    <Badge
                                      key={s.id}
                                      className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] border"
                                    >
                                      {p?.name?.split(" ")[0] ?? "Agent"}
                                    </Badge>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-600">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">
                            {formatDate(lead.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleDelete(lead.id)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                              aria-label="Delete lead"
                              data-ocid={`leads.delete.${lead.id}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Lead Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs text-gray-400">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Jane Smith"
                  className="mt-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  data-ocid="leads.form.name"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="(555) 555-0000"
                  className="mt-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  data-ocid="leads.form.phone"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="jane@email.com"
                  className="mt-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  data-ocid="leads.form.email"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Source</Label>
                <Select
                  value={form.source}
                  onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}
                >
                  <SelectTrigger
                    className="mt-1 bg-gray-800 border-gray-700 text-gray-300"
                    data-ocid="leads.form.source"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {SOURCES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-400">Initial Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as Lead["status"] }))
                  }
                >
                  <SelectTrigger
                    className="mt-1 bg-gray-800 border-gray-700 text-gray-300"
                    data-ocid="leads.form.status"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.name.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              data-ocid="leads.form.submit"
            >
              Add Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
