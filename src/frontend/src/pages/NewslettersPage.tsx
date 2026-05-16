import AnalyticsTab from "@/components/newsletter/AnalyticsTab";
import CampaignsTab from "@/components/newsletter/CampaignsTab";
import DeleteConfirmModal from "@/components/newsletter/DeleteConfirmModal";
import SubscriberDrawer from "@/components/newsletter/SubscriberDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteSubscriber, useSubscribers } from "@/hooks/useNewsletter";
import type {
  NewsletterSubscriber,
  SubscriberStatus,
} from "@/types/newsletter";
import {
  BarChart3,
  Mail,
  Pencil,
  Plus,
  Search,
  Send,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

const TENANT_ID = "tenant-brf";

type Tab = "subscribers" | "campaigns" | "analytics";

const STATUS_BADGE: Record<SubscriberStatus, string> = {
  active: "badge-emerald",
  unsubscribed: "bg-muted text-muted-foreground border border-border",
  bounced: "badge-rose",
  complained: "badge-amber",
};

const STATUS_LABEL: Record<SubscriberStatus, string> = {
  active: "Active",
  unsubscribed: "Unsubscribed",
  bounced: "Bounced",
  complained: "Complained",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Subscribers Tab ────────────────────────────────────────────────────────────

function SubscribersTab() {
  const { data: subscribers = [], isLoading } = useSubscribers(TENANT_ID);
  const deleteSubscriber = useDeleteSubscriber();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubscriberStatus | "all">(
    "all",
  );
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<NewsletterSubscriber | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(
    null,
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const s of subscribers) {
      for (const t of s.tags) set.add(t);
    }
    return Array.from(set).sort();
  }, [subscribers]);

  const filtered = useMemo(() => {
    return subscribers.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.email.toLowerCase().includes(q) ||
        (s.businessName ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchTag = tagFilter === "all" || s.tags.includes(tagFilter);
      return matchSearch && matchStatus && matchTag;
    });
  }, [subscribers, search, statusFilter, tagFilter]);

  function handleEdit(sub: NewsletterSubscriber) {
    setEditing(sub);
    setDrawerOpen(true);
  }

  function handleDelete(sub: NewsletterSubscriber) {
    setDeleteTarget(sub);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteSubscriber.mutate({ id: deleteTarget.id, tenantId: TENANT_ID });
    setDeleteTarget(null);
  }

  return (
    <div className="flex flex-col gap-4" data-ocid="subscribers.section">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            data-ocid="subscribers.search_input"
            placeholder="Search by email or business…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 bg-muted/40 border-border text-sm"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as SubscriberStatus | "all")}
        >
          <SelectTrigger
            data-ocid="subscribers.status.select"
            className="h-8 w-36 bg-muted/40 border-border text-xs"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
            <SelectItem value="bounced">Bounced</SelectItem>
            <SelectItem value="complained">Complained</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger
            data-ocid="subscribers.tag.select"
            className="h-8 w-36 bg-muted/40 border-border text-xs"
          >
            <SelectValue placeholder="All tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            {allTags.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          data-ocid="subscribers.add_button"
          size="sm"
          className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs ml-auto"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Subscriber
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-border">
              <TableHead className="text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5">
                Email
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5">
                Business
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5 hidden md:table-cell">
                Tags
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5">
                Status
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5 hidden lg:table-cell">
                Subscribed
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground text-sm"
                >
                  Loading subscribers…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  data-ocid="subscribers.empty_state"
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm font-medium">
                      No subscribers found
                    </p>
                    <p className="text-muted-foreground/60 text-xs">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((sub, idx) => (
                <TableRow
                  key={sub.id}
                  data-ocid={`subscribers.item.${idx + 1}`}
                  className="border-border hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="py-2.5 text-sm font-medium text-foreground min-w-0">
                    <span className="truncate block max-w-[200px]">
                      {sub.email}
                    </span>
                    {sub.phone && (
                      <span className="text-xs text-muted-foreground">
                        {sub.phone}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 text-sm text-muted-foreground min-w-0">
                    <span className="truncate block max-w-[160px]">
                      {sub.businessName ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {sub.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="merge-tag-pill inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium badge-purple"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                      {sub.tags.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{sub.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${STATUS_BADGE[sub.status]}`}
                    >
                      {STATUS_LABEL[sub.status]}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5 text-xs text-muted-foreground hidden lg:table-cell">
                    {formatDate(sub.subscribedAt)}
                  </TableCell>
                  <TableCell className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        data-ocid={`subscribers.edit_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(sub)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        data-ocid={`subscribers.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(sub)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SubscriberDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        editing={editing}
        tenantId={TENANT_ID}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        label={deleteTarget?.email ?? ""}
        isLoading={deleteSubscriber.isPending}
      />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function NewslettersPage() {
  const { data: subscribers = [] } = useSubscribers(TENANT_ID);

  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = (searchParams.get("tab") as Tab) || "subscribers";
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: "subscribers",
      label: "Subscribers",
      icon: <Users className="h-4 w-4" />,
      badge: subscribers.length,
    },
    {
      id: "campaigns",
      label: "Campaigns",
      icon: <Send className="h-4 w-4" />,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ];

  return (
    <div
      className="flex flex-col h-full min-h-0 p-6 gap-5"
      data-ocid="newsletters.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              Newsletter Manager
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage subscribers, campaigns, and outreach analytics
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 border-b border-border"
        data-ocid="newsletters.tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-ocid={`newsletters.${tab.id}.tab`}
            type="button"
            onClick={() => switchTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === "subscribers" && <SubscribersTab />}
        {activeTab === "campaigns" && <CampaignsTab tenantId={TENANT_ID} />}
        {activeTab === "analytics" && <AnalyticsTab tenantId={TENANT_ID} />}
      </div>
    </div>
  );
}
