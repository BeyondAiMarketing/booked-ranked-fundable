import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateCampaign,
  useScheduleCampaign,
  useSendCampaign,
  useUpdateCampaign,
} from "@/hooks/useNewsletter";
import type { NewsletterCampaign } from "@/types/newsletter";
import {
  Clock,
  Eye,
  Hash,
  Monitor,
  Save,
  Send,
  Smartphone,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  editing: NewsletterCampaign | null;
  tenantId: string;
}

const MERGE_TAGS = [
  { label: "{{email}}", description: "Subscriber email" },
  { label: "{{businessName}}", description: "Business name" },
  { label: "{{phone}}", description: "Phone number" },
  { label: "{{firstName}}", description: "First name" },
  { label: "{{city}}", description: "City" },
];

type PreviewMode = "desktop" | "mobile";
type ShowPlain = boolean;

export default function CampaignComposer({
  open,
  onClose,
  editing,
  tenantId,
}: Props) {
  const create = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const send = useSendCampaign();
  const schedule = useScheduleCampaign();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [fromName, setFromName] = useState("Alex at BRF");
  const [fromEmail, setFromEmail] = useState("alex@bookedrankedfunded.org");
  const [htmlBody, setHtmlBody] = useState("");
  const [plainText, setPlainText] = useState("");
  const [tags, setTagsRaw] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [showPlain, setShowPlain] = useState<ShowPlain>(false);
  const [showPreview, setShowPreview] = useState(true);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const plainRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setSubject(editing.subject);
      setFromName(editing.fromName ?? "Alex at BRF");
      setFromEmail(editing.fromEmail ?? "alex@bookedrankedfunded.org");
      setHtmlBody(editing.htmlBody);
      setPlainText(editing.plainTextBody ?? "");
      setTagsRaw(editing.tags.join(", "));
      setScheduledAt(editing.scheduledAt ?? "");
    } else {
      setName("");
      setSubject("");
      setHtmlBody("");
      setPlainText("");
      setTagsRaw("");
      setScheduledAt("");
      setFromName("Alex at BRF");
      setFromEmail("alex@bookedrankedfunded.org");
    }
  }, [editing]);

  function insertMergeTag(tag: string) {
    const ref = showPlain ? plainRef : bodyRef;
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const newVal = el.value.slice(0, start) + tag + el.value.slice(end);
    if (showPlain) {
      setPlainText(newVal);
    } else {
      setHtmlBody(newVal);
    }
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  }

  function buildPayload() {
    return {
      tenantId,
      name,
      subject,
      fromName,
      fromEmail,
      htmlBody,
      plainTextBody: plainText || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: "draft" as const,
      scheduledAt: scheduledAt || undefined,
      sentAt: undefined,
    };
  }

  async function handleSaveDraft() {
    if (editing) {
      await updateCampaign.mutateAsync({
        id: editing.id,
        tenantId,
        updates: buildPayload(),
      });
    } else {
      await create.mutateAsync(buildPayload());
    }
    onClose();
  }

  async function handleSend() {
    let campaignId = editing?.id;
    if (!campaignId) {
      const created = await create.mutateAsync(buildPayload());
      campaignId = created.id;
    }
    await send.mutateAsync({ campaignId, tenantId });
    onClose();
  }

  async function handleSchedule() {
    if (!scheduledAt) return;
    let campaignId = editing?.id;
    if (!campaignId) {
      const created = await create.mutateAsync(buildPayload());
      campaignId = created.id;
    }
    await schedule.mutateAsync({ campaignId, tenantId, scheduledAt });
    onClose();
  }

  const isPending =
    create.isPending ||
    updateCampaign.isPending ||
    send.isPending ||
    schedule.isPending;

  if (!open) return null;

  return (
    <div
      data-ocid="campaigns.composer.dialog"
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-foreground">
            {editing ? "Edit Campaign" : "New Campaign"}
          </h2>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
            {subject.length} / 200 chars
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            data-ocid="campaigns.composer.preview.toggle"
            variant="outline"
            size="sm"
            className="h-7 text-xs border-border"
            onClick={() => setShowPreview((v) => !v)}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button
            data-ocid="campaigns.composer.close_button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left pane — form */}
        <div className="w-full max-w-[600px] flex flex-col gap-4 overflow-y-auto p-5 border-r border-border">
          {/* Meta fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Campaign Name
              </Label>
              <Input
                data-ocid="campaigns.composer.name.input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="November Spotlight — All Niches"
                className="bg-muted/40 border-border text-sm"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Subject Line{" "}
                <span className="text-muted-foreground/50 font-normal">
                  (merge tags supported)
                </span>
              </Label>
              <Input
                data-ocid="campaigns.composer.subject.input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="{{businessName}}, here's your growth plan 🚀"
                className="bg-muted/40 border-border text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                From Name
              </Label>
              <Input
                data-ocid="campaigns.composer.from_name.input"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="bg-muted/40 border-border text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                From Email
              </Label>
              <Input
                data-ocid="campaigns.composer.from_email.input"
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="bg-muted/40 border-border text-sm"
              />
            </div>
          </div>

          {/* Merge tag toolbar */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Hash className="h-3 w-3" />
              Insert Merge Tag
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {MERGE_TAGS.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  data-ocid={`campaigns.merge_tag.${m.label.replace(/[{}]/g, "")}`}
                  onClick={() => insertMergeTag(m.label)}
                  className="merge-tag-pill badge-purple px-2 py-1 rounded text-xs font-mono hover:bg-primary/30 transition-colors cursor-pointer"
                  title={m.description}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="campaigns.composer.html.tab"
              onClick={() => setShowPlain(false)}
              className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                !showPlain
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              HTML Body
            </button>
            <button
              type="button"
              data-ocid="campaigns.composer.plaintext.tab"
              onClick={() => setShowPlain(true)}
              className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                showPlain
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Plain Text Fallback
            </button>
          </div>

          {!showPlain ? (
            <Textarea
              ref={bodyRef}
              data-ocid="campaigns.composer.html.textarea"
              value={htmlBody}
              onChange={(e) => setHtmlBody(e.target.value)}
              placeholder="<p>Hi {{firstName}},</p><p>Your competitors are leaving money on the table...</p>"
              className="font-mono text-xs bg-muted/40 border-border min-h-[220px] resize-y"
            />
          ) : (
            <Textarea
              ref={plainRef}
              data-ocid="campaigns.composer.plaintext.textarea"
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder="Hi {{firstName}}, your competitors are leaving money on the table..."
              className="font-mono text-xs bg-muted/40 border-border min-h-[120px] resize-y"
            />
          )}

          {/* Tags + Schedule */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Target Tags
              </Label>
              <Input
                data-ocid="campaigns.composer.tags.input"
                value={tags}
                onChange={(e) => setTagsRaw(e.target.value)}
                placeholder="all-niches, plumbing, hvac…"
                className="bg-muted/40 border-border text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Schedule (optional)
              </Label>
              <Input
                data-ocid="campaigns.composer.schedule.input"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="bg-muted/40 border-border text-sm"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2 border-t border-border mt-1">
            <Button
              data-ocid="campaigns.composer.save_draft.button"
              variant="outline"
              size="sm"
              className="flex-1 border-border text-xs"
              disabled={isPending}
              onClick={handleSaveDraft}
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              Save Draft
            </Button>
            {scheduledAt && (
              <Button
                data-ocid="campaigns.composer.schedule.button"
                variant="outline"
                size="sm"
                className="flex-1 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs"
                disabled={isPending}
                onClick={handleSchedule}
              >
                <Clock className="h-3.5 w-3.5 mr-1" />
                Schedule
              </Button>
            )}
            <Button
              data-ocid="campaigns.composer.send.button"
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
              disabled={isPending}
              onClick={handleSend}
            >
              <Send className="h-3.5 w-3.5 mr-1" />
              {isPending ? "Sending…" : "Send Now"}
            </Button>
          </div>
        </div>

        {/* Right pane — preview */}
        {showPreview && (
          <div className="flex-1 flex flex-col min-h-0 bg-muted/20">
            <div className="flex items-center gap-2 px-5 py-2.5 border-b border-border bg-card flex-shrink-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-2">
                Preview
              </span>
              <button
                type="button"
                data-ocid="campaigns.composer.preview.desktop"
                onClick={() => setPreviewMode("desktop")}
                className={`p-1 rounded transition-colors ${previewMode === "desktop" ? "text-primary bg-primary/15" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                type="button"
                data-ocid="campaigns.composer.preview.mobile"
                onClick={() => setPreviewMode("mobile")}
                className={`p-1 rounded transition-colors ${previewMode === "mobile" ? "text-primary bg-primary/15" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto flex items-start justify-center p-6">
              <div
                className={`bg-card border border-border rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
                  previewMode === "mobile"
                    ? "w-[375px]"
                    : "w-full max-w-[640px]"
                }`}
              >
                {/* Email header simulation */}
                <div className="bg-muted/60 px-4 py-3 border-b border-border">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {fromName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          {fromName || "Sender"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Now
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {fromEmail || "sender@example.com"}
                      </p>
                      <p className="text-xs font-medium text-foreground mt-0.5 truncate">
                        {subject || "No subject"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Body render — sanitized iframe preview */}
                <div className="p-5">
                  {htmlBody ? (
                    <iframe
                      title="Email preview"
                      srcDoc={`<!DOCTYPE html><html><body style="font-family:system-ui;font-size:14px;color:#e2e8f0;background:#1a1a2e;margin:0;padding:16px">${htmlBody}</body></html>`}
                      className="w-full border-0 min-h-[200px]"
                      style={{ height: "auto", minHeight: "200px" }}
                      sandbox="allow-same-origin"
                    />
                  ) : (
                    <p className="text-muted-foreground/50 text-sm italic">
                      Start typing HTML to see a preview…
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
