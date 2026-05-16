import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCampaigns, useDeleteCampaign } from "@/hooks/useNewsletter";
import type { CampaignStatus, NewsletterCampaign } from "@/types/newsletter";
import {
  AlertTriangle,
  BarChart2,
  Clock,
  Copy,
  FileText,
  Loader2,
  Mail,
  MousePointerClick,
  Pencil,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import CampaignComposer from "./CampaignComposer";

interface Props {
  tenantId: string;
}

const STATUS_MAP: Record<
  CampaignStatus,
  { label: string; cls: string; icon: React.ReactNode }
> = {
  draft: {
    label: "Draft",
    cls: "bg-muted/60 text-muted-foreground border-border",
    icon: <FileText className="h-3 w-3" />,
  },
  scheduled: {
    label: "Scheduled",
    cls: "badge-amber",
    icon: <Clock className="h-3 w-3" />,
  },
  sending: {
    label: "Sending",
    cls: "badge-blue",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  sent: {
    label: "Sent",
    cls: "badge-emerald",
    icon: <Send className="h-3 w-3" />,
  },
  paused: {
    label: "Paused",
    cls: "badge-rose",
    icon: <AlertTriangle className="h-3 w-3" />,
  },
};

function openRate(c: NewsletterCampaign) {
  if (!c.stats.sentCount) return null;
  return ((c.stats.openCount / c.stats.sentCount) * 100).toFixed(1);
}

function clickRate(c: NewsletterCampaign) {
  if (!c.stats.sentCount) return null;
  return ((c.stats.clickCount / c.stats.sentCount) * 100).toFixed(1);
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CampaignsTab({ tenantId }: Props) {
  const { data: campaigns = [], isLoading } = useCampaigns(tenantId);
  const deleteCampaign = useDeleteCampaign();
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<NewsletterCampaign | null>(null);

  function handleEdit(c: NewsletterCampaign) {
    setEditingCampaign(c);
    setComposerOpen(true);
  }

  function handleDuplicate(c: NewsletterCampaign) {
    setEditingCampaign({
      ...c,
      id: `cmp-${Date.now()}`,
      name: `${c.name} (Copy)`,
      status: "draft",
      stats: {
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        bounceCount: 0,
        unsubscribeCount: 0,
        complaintCount: 0,
      },
    });
    setComposerOpen(true);
  }

  function handleDelete(c: NewsletterCampaign) {
    deleteCampaign.mutate({ id: c.id, tenantId });
  }

  function handleNewCampaign() {
    setEditingCampaign(null);
    setComposerOpen(true);
  }

  return (
    <div className="flex flex-col gap-4" data-ocid="campaigns.section">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
        </p>
        <Button
          data-ocid="campaigns.new_campaign.button"
          size="sm"
          className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
          onClick={handleNewCampaign}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          New Campaign
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading campaigns…
        </div>
      ) : campaigns.length === 0 ? (
        <div
          data-ocid="campaigns.empty_state"
          className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-lg"
        >
          <Send className="h-9 w-9 text-muted-foreground/40" />
          <p className="text-muted-foreground font-medium text-sm">
            No campaigns yet
          </p>
          <p className="text-muted-foreground/60 text-xs">
            Create your first campaign to start sending newsletters
          </p>
          <Button
            size="sm"
            className="mt-1 bg-primary text-primary-foreground"
            onClick={handleNewCampaign}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> New Campaign
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {campaigns.map((c, idx) => {
            const s = STATUS_MAP[c.status];
            const or = openRate(c);
            const cr = clickRate(c);
            return (
              <div
                key={c.id}
                data-ocid={`campaigns.item.${idx + 1}`}
                className="campaign-table-row rounded-lg border border-border bg-card hover:border-primary/30 transition-colors p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${s.cls}`}
                      >
                        {s.icon}
                        {s.label}
                      </span>
                      <span className="text-sm font-semibold text-foreground truncate">
                        {c.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {c.subject}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {c.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="badge-purple px-1.5 py-0.5 rounded text-[10px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-center flex-shrink-0">
                    {c.status === "sent" || c.status === "sending" ? (
                      <>
                        <div className="campaign-stat-card flex flex-col items-center min-w-[48px]">
                          <div className="flex items-center gap-0.5 text-muted-foreground mb-0.5">
                            <Mail className="h-3 w-3" />
                            <span className="text-[10px] uppercase font-semibold">
                              Sent
                            </span>
                          </div>
                          <span className="text-sm font-bold text-foreground">
                            {c.stats.sentCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="campaign-stat-card flex flex-col items-center min-w-[48px]">
                          <div className="flex items-center gap-0.5 text-emerald-400 mb-0.5">
                            <BarChart2 className="h-3 w-3" />
                            <span className="text-[10px] uppercase font-semibold">
                              Opens
                            </span>
                          </div>
                          <span className="text-sm font-bold text-foreground">
                            {or ? `${or}%` : "—"}
                          </span>
                        </div>
                        <div className="campaign-stat-card flex flex-col items-center min-w-[48px]">
                          <div className="flex items-center gap-0.5 text-primary mb-0.5">
                            <MousePointerClick className="h-3 w-3" />
                            <span className="text-[10px] uppercase font-semibold">
                              Clicks
                            </span>
                          </div>
                          <span className="text-sm font-bold text-foreground">
                            {cr ? `${cr}%` : "—"}
                          </span>
                        </div>
                        <div className="campaign-stat-card flex flex-col items-center min-w-[48px]">
                          <div className="flex items-center gap-0.5 text-rose-400 mb-0.5">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-[10px] uppercase font-semibold">
                              Bounces
                            </span>
                          </div>
                          <span className="text-sm font-bold text-foreground">
                            {c.stats.bounceCount}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground/60 italic">
                        {c.status === "scheduled"
                          ? `Scheduled: ${formatDate(c.scheduledAt)}`
                          : "Not yet sent"}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {c.status === "draft" && (
                      <Button
                        data-ocid={`campaigns.edit_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(c)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      data-ocid={`campaigns.duplicate_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      title="Duplicate"
                      onClick={() => handleDuplicate(c)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    {c.status === "draft" && (
                      <Button
                        data-ocid={`campaigns.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(c)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CampaignComposer
        open={composerOpen}
        onClose={() => {
          setComposerOpen(false);
          setEditingCampaign(null);
        }}
        editing={editingCampaign}
        tenantId={tenantId}
      />
    </div>
  );
}
