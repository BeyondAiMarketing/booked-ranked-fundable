import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart2,
  BookOpen,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Copy,
  Edit2,
  Eye,
  Flame,
  GitMerge,
  Library,
  Mail,
  Megaphone,
  MessageSquare,
  MoreVertical,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Send,
  Settings2,
  Shield,
  Smartphone,
  SplitSquareHorizontal,
  Square,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Upload,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import {
  ADMIN_OUTREACH_SEQUENCES,
  ALL_CLIENT_CAMPAIGNS,
  type CampaignStep,
  type ClientCampaign,
  MED_SPA_CAMPAIGNS,
  type OutreachSequence,
  PERSONALIZATION_TOKENS,
  PLUMBING_CAMPAIGNS,
} from "../data/campaignData";
import {
  ALL_WARM_ENROLLMENTS,
  type AuditTripwireConfig,
  COLD_EMAIL_SEQUENCES,
  type ColdEmailSequence,
  DEFAULT_AUDIT_TRIPWIRE,
  DEFAULT_DEMO_LINKS,
  type DemoLinkConfig,
  type EmailTouch,
  MOCK_ENROLLMENTS,
  PREMIUM_OUTREACH_METADATA,
  PREMIUM_OUTREACH_SEQUENCE,
  SEQUENCE_PERFORMANCE,
  type SequenceEnrollment,
  UTM_ATTRIBUTION_DATA,
  WARM_HANDOFF_EVENTS,
  WARM_SEQUENCES,
  WEEKLY_CHART_DATA,
  type WarmLeadHandoff,
  type WarmSequence,
  type WarmSequenceEnrollment,
  buildDemoLink,
} from "../data/coldEmailData";

// ─── Existing types & helpers ──────────────────────────────────────────────────

interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  niche: string;
  city: string;
  status: "Not Started" | "Active" | "Replied" | "Converted";
  currentStep: number;
  sequenceId: string;
}

const MOCK_PROSPECTS: Prospect[] = [
  {
    id: "p1",
    firstName: "Carlos",
    lastName: "Rivera",
    businessName: "Rivera Plumbing Co.",
    email: "carlos@riveraplumbing.com",
    phone: "619-555-0101",
    niche: "Plumbing",
    city: "San Diego, CA",
    status: "Active",
    currentStep: 3,
    sequenceId: "plumbing-outreach",
  },
  {
    id: "p2",
    firstName: "Mike",
    lastName: "Thompson",
    businessName: "North County Pipes",
    email: "mike@ncpipes.com",
    phone: "760-555-0202",
    niche: "Plumbing",
    city: "Oceanside, CA",
    status: "Replied",
    currentStep: 2,
    sequenceId: "plumbing-outreach",
  },
  {
    id: "p3",
    firstName: "Jennifer",
    lastName: "Tran",
    businessName: "Glow Med Spa",
    email: "jennifer@glowmedspa.com",
    phone: "858-555-0303",
    niche: "Med Spa",
    city: "La Jolla, CA",
    status: "Active",
    currentStep: 4,
    sequenceId: "medspa-outreach",
  },
  {
    id: "p4",
    firstName: "David",
    lastName: "Chen",
    businessName: "Precision Plumbing",
    email: "david@precisionplumb.com",
    phone: "714-555-0404",
    niche: "Plumbing",
    city: "Anaheim, CA",
    status: "Converted",
    currentStep: 6,
    sequenceId: "plumbing-outreach",
  },
  {
    id: "p5",
    firstName: "Ashley",
    lastName: "Moore",
    businessName: "Luxe Aesthetics Studio",
    email: "ashley@luxeaesthetics.com",
    phone: "310-555-0505",
    niche: "Med Spa",
    city: "Beverly Hills, CA",
    status: "Not Started",
    currentStep: 0,
    sequenceId: "medspa-outreach",
  },
];

function channelColor(channel: string) {
  if (channel === "email") return "bg-blue-500/10 text-blue-400";
  if (channel === "sms") return "bg-emerald-500/10 text-emerald-400";
  if (channel === "task") return "bg-amber-500/10 text-amber-400";
  return "bg-purple-500/10 text-purple-400";
}

function ChannelIcon({ channel }: { channel: string }) {
  if (channel === "email") return <Mail className="h-4 w-4" />;
  if (channel === "sms") return <MessageSquare className="h-4 w-4" />;
  if (channel === "task") return <ClipboardList className="h-4 w-4" />;
  return <Zap className="h-4 w-4" />;
}

function ctaDot(type: string) {
  const map: Record<string, string> = {
    audit: "bg-emerald-400",
    "free-audit": "bg-emerald-400",
    "ai-demo": "bg-blue-400",
    "ai-capabilities": "bg-blue-400",
    "back-office-demo": "bg-purple-400",
    "back-office": "bg-purple-400",
    "unified-demo": "bg-amber-400",
    unified: "bg-amber-400",
  };
  return map[type] ?? "bg-slate-400";
}

function enrollmentStatusBadge(status: string) {
  const map: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    stopped: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    converted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return map[status] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

function eventIcon(type: string) {
  const map: Record<string, string> = {
    enrolled: "🎯",
    sent: "📤",
    opened: "👁️",
    clicked: "🖱️",
    replied: "💬",
    bounced: "⚠️",
    unsubscribed: "🚫",
    audit_completed: "✅",
    paused: "⏸️",
    stopped: "⛔",
    resumed: "▶️",
  };
  return map[type] ?? "•";
}

function metricCell(value: number, good: number, bad: number) {
  if (value >= good) return "text-emerald-400";
  if (value <= bad) return "text-rose-400";
  return "text-amber-400";
}

// ─── Email Provider Badge ─────────────────────────────────────────────────────

function EmailProviderBadge({ type }: { type: "cold" | "warm" }) {
  if (type === "cold") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Send className="h-3 w-3" />
        Sends via: Custom SMTP / Listmonk
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <Shield className="h-3 w-3" />
      Sends via: Caffeine Native Email
    </div>
  );
}

// ─── EXISTING: StepCard ───────────────────────────────────────────────────────

function StepCard({
  step,
  onEdit,
}: { step: CampaignStep; onEdit?: (s: CampaignStep) => void }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${channelColor(step.channel)}`}
          >
            <ChannelIcon channel={step.channel} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground">
                Step {step.stepNumber}
              </span>
              <Badge variant="outline" className="text-xs py-0">
                {step.delayLabel}
              </Badge>
              <Badge
                className={`text-xs py-0 capitalize ${channelColor(step.channel)}`}
              >
                {step.channel}
              </Badge>
              {step.isInternal && (
                <Badge className="text-xs py-0 bg-muted text-muted-foreground">
                  Internal
                </Badge>
              )}
            </div>
            {step.subject && (
              <p className="font-medium text-sm text-foreground mb-1 truncate">
                {step.subject}
              </p>
            )}
            {step.previewText && (
              <p className="text-xs text-muted-foreground mb-1">
                {step.previewText}
              </p>
            )}
            <p className="text-xs text-muted-foreground line-clamp-2">
              {step.body}
            </p>
          </div>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(step)}
            className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── EXISTING: JourneyModal ───────────────────────────────────────────────────

function JourneyModal({
  campaign,
  open,
  onClose,
}: { campaign: ClientCampaign; open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
        data-ocid="campaigns.journey.modal"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            {campaign.name} — Journey
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="bg-primary/10 rounded-lg p-3 text-sm text-primary">
            <span className="font-medium">Trigger: </span>
            {campaign.trigger}
          </div>
          {campaign.steps.map((step, idx) => (
            <div key={step.id}>
              <StepCard step={step} />
              {idx < campaign.steps.length - 1 && (
                <div className="flex justify-center my-1">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          <div className="border border-dashed border-rose-500/30 rounded-lg p-3">
            <p className="text-xs font-medium text-rose-400 mb-1">Exit Rules</p>
            <ul className="space-y-1">
              {campaign.exitRules.map((rule) => (
                <li
                  key={rule}
                  className="text-xs text-muted-foreground flex items-center gap-2"
                >
                  <Check className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Campaign editor coming soon")}
              data-ocid="campaigns.journey.edit_button"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Campaign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── EXISTING: StepEditorModal ────────────────────────────────────────────────

function StepEditorModal({
  step,
  open,
  onClose,
  onSave,
}: {
  step: CampaignStep | null;
  open: boolean;
  onClose: () => void;
  onSave: (s: CampaignStep) => void;
}) {
  const [subject, setSubject] = useState(step?.subject ?? "");
  const [previewText, setPreviewText] = useState(step?.previewText ?? "");
  const [body, setBody] = useState(step?.body ?? "");
  if (!step) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
        data-ocid="campaigns.step_editor.modal"
      >
        <DialogHeader>
          <DialogTitle>
            Edit Step {step.stepNumber} —{" "}
            <span className="capitalize">{step.channel}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {step.channel === "email" && (
            <>
              <div>
                <Label>Subject Line</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                  data-ocid="campaigns.step_editor.input"
                />
              </div>
              <div>
                <Label>Preview Text</Label>
                <Input
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="mt-1"
                />
              </div>
            </>
          )}
          <div>
            <Label>Message Body</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="mt-1 font-mono text-xs"
              data-ocid="campaigns.step_editor.textarea"
            />
          </div>
          <div>
            <Label className="mb-2 block">Personalization Tokens</Label>
            <div className="flex flex-wrap gap-2">
              {PERSONALIZATION_TOKENS.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => setBody((p) => `${p} ${token}`)}
                  className="text-xs bg-primary/10 text-primary border border-primary/20 rounded px-2 py-1 hover:bg-primary/20 transition-colors font-mono"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="campaigns.step_editor.cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onSave({ ...step, subject, previewText, body });
                toast.success("Step updated");
                onClose();
              }}
              data-ocid="campaigns.step_editor.save_button"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SequenceViewer({ sequence }: { sequence: OutreachSequence }) {
  const [steps, setSteps] = useState(sequence.steps);
  const [editingStep, setEditingStep] = useState<CampaignStep | null>(null);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Enrolled", value: sequence.performance.enrolled },
          { label: "Open Rate", value: `${sequence.performance.openRate}%` },
          { label: "Click Rate", value: `${sequence.performance.clickRate}%` },
          { label: "Conversions", value: sequence.performance.conversions },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-muted/40 rounded-lg p-3 text-center border border-border"
          >
            <p className="text-lg font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
      {steps.map((step, idx) => (
        <div key={step.id}>
          <StepCard step={step} onEdit={(s) => setEditingStep(s)} />
          {idx < steps.length - 1 && (
            <div className="flex justify-center my-1">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      ))}
      <StepEditorModal
        step={editingStep}
        open={!!editingStep}
        onClose={() => setEditingStep(null)}
        onSave={(updated) => {
          setSteps((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s)),
          );
          setEditingStep(null);
        }}
      />
    </div>
  );
}

// ─── EXISTING: ProspectOutreachTab (preserved as-is, restyled) ────────────────

function AddProspectModal({
  open,
  onClose,
  onAdd,
}: { open: boolean; onClose: () => void; onAdd: (p: Prospect) => void }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    niche: "",
    city: "",
  });
  const handleSubmit = () => {
    if (!form.firstName || !form.email || !form.businessName || !form.niche) {
      toast.error("Please fill in all required fields");
      return;
    }
    onAdd({
      id: `p${Date.now()}`,
      ...form,
      status: "Not Started",
      currentStep: 0,
      sequenceId:
        form.niche === "Plumbing" ? "plumbing-outreach" : "medspa-outreach",
    });
    setForm({
      firstName: "",
      lastName: "",
      businessName: "",
      email: "",
      phone: "",
      niche: "",
      city: "",
    });
    toast.success("Prospect added");
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-ocid="campaigns.add_prospect.modal">
        <DialogHeader>
          <DialogTitle>Add Prospect</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label>First Name *</Label>
            <Input
              value={form.firstName}
              onChange={(e) =>
                setForm((p) => ({ ...p, firstName: e.target.value }))
              }
              className="mt-1"
              data-ocid="campaigns.prospect.input"
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              value={form.lastName}
              onChange={(e) =>
                setForm((p) => ({ ...p, lastName: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>Business Name *</Label>
            <Input
              value={form.businessName}
              onChange={(e) =>
                setForm((p) => ({ ...p, businessName: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Niche *</Label>
            <Select
              value={form.niche}
              onValueChange={(v) => setForm((p) => ({ ...p, niche: v }))}
            >
              <SelectTrigger
                className="mt-1"
                data-ocid="campaigns.prospect.select"
              >
                <SelectValue placeholder="Select niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Med Spa">Med Spa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>City</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="campaigns.add_prospect.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            data-ocid="campaigns.add_prospect.submit_button"
          >
            Add Prospect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CsvImportModal({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (prospects: Prospect[]) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const FIELDS = [
    "firstName",
    "lastName",
    "businessName",
    "email",
    "phone",
    "niche",
    "city",
  ];
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text
        .split("\n")
        .filter(Boolean)
        .map((l) => l.split(",").map((c) => c.trim()));
      if (lines.length > 0) {
        setHeaders(lines[0]);
        setPreview(lines.slice(1, 6));
        const autoMap: Record<string, string> = {};
        for (const h of lines[0]) {
          const lower = h.toLowerCase();
          if (lower.includes("first")) autoMap[h] = "firstName";
          else if (lower.includes("last")) autoMap[h] = "lastName";
          else if (lower.includes("business") || lower.includes("company"))
            autoMap[h] = "businessName";
          else if (lower.includes("email")) autoMap[h] = "email";
          else if (lower.includes("phone")) autoMap[h] = "phone";
          else if (lower.includes("niche") || lower.includes("type"))
            autoMap[h] = "niche";
          else if (lower.includes("city") || lower.includes("location"))
            autoMap[h] = "city";
        }
        setMapping(autoMap);
      }
    };
    reader.readAsText(file);
  };
  const handleConfirm = () => {
    const imported: Prospect[] = preview.map((row, i) => {
      const obj: Record<string, string> = {};
      for (const [header, field] of Object.entries(mapping)) {
        const colIdx = headers.indexOf(header);
        if (colIdx >= 0) obj[field] = row[colIdx] ?? "";
      }
      const niche = obj.niche || "Plumbing";
      return {
        id: `csv-${Date.now()}-${i}`,
        firstName: obj.firstName || "",
        lastName: obj.lastName || "",
        businessName: obj.businessName || "",
        email: obj.email || "",
        phone: obj.phone || "",
        niche,
        city: obj.city || "",
        status: "Not Started" as const,
        currentStep: 0,
        sequenceId:
          niche === "Med Spa" ? "medspa-outreach" : "plumbing-outreach",
      };
    });
    onImport(imported);
    toast.success(`${imported.length} prospects imported`);
    setPreview([]);
    setHeaders([]);
    setMapping({});
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl"
        data-ocid="campaigns.csv_import.modal"
      >
        <DialogHeader>
          <DialogTitle>Import Prospects from CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {headers.length === 0 ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
              }}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border bg-muted/20"}`}
              data-ocid="campaigns.csv_import.dropzone"
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                Drag and drop a CSV file here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or{" "}
                <label className="text-primary cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </label>
              </p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Map columns
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {headers.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground truncate w-28">
                        {h}
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <Select
                        value={mapping[h] || ""}
                        onValueChange={(v) =>
                          setMapping((p) => ({ ...p, [h]: v }))
                        }
                      >
                        <SelectTrigger className="h-7 text-xs flex-1">
                          <SelectValue placeholder="Skip" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Skip</SelectItem>
                          {FIELDS.map((f) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Preview (first {preview.length} rows)
                </p>
                <div className="overflow-x-auto rounded border border-border text-xs">
                  <table className="min-w-full">
                    <thead className="bg-muted/40">
                      <tr>
                        {headers.map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-left font-medium text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row) => (
                        <tr
                          key={row.join("|")}
                          className="border-t border-border"
                        >
                          {row.map((cell) => (
                            <td
                              key={cell}
                              className="px-3 py-2 text-foreground"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setHeaders([]);
                    setPreview([]);
                  }}
                  data-ocid="campaigns.csv_import.cancel_button"
                >
                  Re-upload
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirm}
                  data-ocid="campaigns.csv_import.confirm_button"
                >
                  Import {preview.length} Prospects
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProspectOutreachTab() {
  const [prospects, setProspects] = useState<Prospect[]>(MOCK_PROSPECTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(
    null,
  );
  const [reEngageProspect, setReEngageProspect] = useState<Prospect | null>(
    null,
  );
  const [viewingSequence, setViewingSequence] =
    useState<OutreachSequence | null>(null);
  const [filterNiche, setFilterNiche] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [senderName, setSenderName] = useState(
    "David at Booked Ranked Fundable",
  );
  const [senderEmail, setSenderEmail] = useState(
    "david@bookedrankedfundable.com",
  );
  const [replyTo, setReplyTo] = useState("BeyondAI.marketing@gmail.com");

  const filtered = prospects.filter((p) => {
    if (filterNiche && p.niche !== filterNiche) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });
  const stats = {
    total: prospects.length,
    active: prospects.filter((p) => p.status === "Active").length,
    replied: prospects.filter((p) => p.status === "Replied").length,
    converted: prospects.filter((p) => p.status === "Converted").length,
  };
  const handleConvert = (p: Prospect) => {
    setProspects((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, status: "Converted" } : x)),
    );
    setSelectedProspect(null);
    toast.success(`${p.businessName} converted to client!`);
  };
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Active: "bg-blue-500/10 text-blue-400",
      Replied: "bg-emerald-500/10 text-emerald-400",
      Converted: "bg-purple-500/10 text-purple-400",
      "Not Started": "bg-muted text-muted-foreground",
    };
    return map[status] ?? "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Prospects",
            value: stats.total,
            icon: Users,
            color: "text-foreground",
          },
          {
            label: "Active in Sequence",
            value: stats.active,
            icon: Zap,
            color: "text-blue-400",
          },
          {
            label: "Replied",
            value: stats.replied,
            icon: MessageSquare,
            color: "text-emerald-400",
          },
          {
            label: "Converted",
            value: stats.converted,
            icon: TrendingUp,
            color: "text-purple-400",
          },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="text-base">Prospect List</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCsvModal(true)}
                    data-ocid="campaigns.csv_import.open_modal_button"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Import CSV
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowAddModal(true)}
                    data-ocid="campaigns.add_prospect.open_modal_button"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Prospect
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Select value={filterNiche} onValueChange={setFilterNiche}>
                  <SelectTrigger
                    className="h-8 text-xs w-36"
                    data-ocid="campaigns.filter.select"
                  >
                    <SelectValue placeholder="All Niches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Niches</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Med Spa">Med Spa</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-8 text-xs w-36">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Replied">Replied</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-y border-border">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">
                        Name / Business
                      </th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">
                        Niche
                      </th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">
                        Step
                      </th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((p, i) => (
                      <tr
                        key={p.id}
                        className="hover:bg-muted/20 transition-colors"
                        data-ocid={`campaigns.prospect.item.${i + 1}`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">
                            {p.firstName} {p.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.businessName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.city}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="text-xs whitespace-nowrap"
                          >
                            {p.niche}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {p.currentStep === 0 ? "—" : `Step ${p.currentStep}`}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={`text-xs border ${statusBadge(p.status)}`}
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setSelectedProspect(p)}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleConvert(p)}
                              >
                                Convert to Client
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-rose-400"
                                onClick={() =>
                                  setProspects((prev) =>
                                    prev.filter((x) => x.id !== p.id),
                                  )
                                }
                              >
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-muted-foreground text-sm"
                          data-ocid="campaigns.prospect.empty_state"
                        >
                          No prospects found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Outreach Sequences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ADMIN_OUTREACH_SEQUENCES.map((seq) => (
                <div
                  key={seq.id}
                  className="border border-border rounded-lg p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {seq.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {seq.steps.length} steps
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Badge className="text-xs bg-blue-500/10 text-blue-400">
                        Email
                      </Badge>
                      <Badge className="text-xs bg-emerald-500/10 text-emerald-400">
                        SMS
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="bg-muted/40 rounded p-2 text-center">
                      <p className="font-bold text-foreground">
                        {seq.performance.openRate}%
                      </p>
                      <p className="text-muted-foreground">Open Rate</p>
                    </div>
                    <div className="bg-muted/40 rounded p-2 text-center">
                      <p className="font-bold text-foreground">
                        {seq.performance.conversions}
                      </p>
                      <p className="text-muted-foreground">Conversions</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                    onClick={() => setViewingSequence(seq)}
                    data-ocid={`campaigns.sequence.${seq.id}.button`}
                  >
                    View Sequence
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Sender Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Sender Name
                </Label>
                <Input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="mt-1 h-8 text-sm"
                  data-ocid="campaigns.sender.input"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  From Email
                </Label>
                <Input
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Reply-To
                </Label>
                <Input
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Sends via Caffeine native email with Listmonk fallback.
              </p>
              <Button
                size="sm"
                className="w-full"
                onClick={() => toast.success("Sender identity saved")}
                data-ocid="campaigns.sender.save_button"
              >
                Save Identity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {viewingSequence && (
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {viewingSequence.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewingSequence(null)}
                data-ocid="campaigns.sequence.close_button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SequenceViewer sequence={viewingSequence} />
          </CardContent>
        </Card>
      )}

      {selectedProspect && (
        <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              {selectedProspect.businessName}
            </h3>
            <button type="button" onClick={() => setSelectedProspect(null)}>
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-2">
              {[
                [
                  "Name",
                  `${selectedProspect.firstName} ${selectedProspect.lastName}`,
                ],
                ["Email", selectedProspect.email],
                ["Phone", selectedProspect.phone],
                ["Niche", selectedProspect.niche],
                ["City", selectedProspect.city],
              ].map(([label, val]) => (
                <p key={label} className="text-sm">
                  <span className="text-muted-foreground">{label}: </span>
                  <span className="text-foreground">{val}</span>
                </p>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="outline"
              className="w-full text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
              onClick={() => setReEngageProspect(selectedProspect)}
              data-ocid="campaigns.prospect.reengage_button"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-Engage Cold Lead
            </Button>
            <Button
              className="w-full"
              onClick={() => handleConvert(selectedProspect)}
              data-ocid="campaigns.prospect.convert_button"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Convert to Client
            </Button>
          </div>
        </div>
      )}

      <AddProspectModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(p) => setProspects((prev) => [...prev, p])}
      />
      <CsvImportModal
        open={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        onImport={(imported) => setProspects((prev) => [...prev, ...imported])}
      />
      <ReEngageModal
        prospect={
          reEngageProspect
            ? {
                name: reEngageProspect.businessName,
                niche: reEngageProspect.niche,
                currentStep: reEngageProspect.currentStep,
              }
            : null
        }
        open={!!reEngageProspect}
        onClose={() => setReEngageProspect(null)}
      />
    </div>
  );
}

// ─── EXISTING: ClientCampaignCard & MyCampaignsTab ────────────────────────────

function ClientCampaignCard({
  campaign,
  tenantId,
}: { campaign: ClientCampaign; tenantId: string }) {
  const { campaignToggles, setCampaignToggle } = useApp();
  const [showJourney, setShowJourney] = useState(false);
  const enabled = campaignToggles[tenantId]?.[campaign.id] !== false;
  const channelSet = [
    ...new Set(
      campaign.steps.filter((s) => !s.isInternal).map((s) => s.channel),
    ),
  ];
  return (
    <>
      <Card className="bg-card border-border hover:border-primary/40 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {campaign.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {campaign.trigger}
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={(v) => {
                setCampaignToggle(tenantId, campaign.id, v);
                toast.success(
                  v
                    ? `"${campaign.name}" activated`
                    : `"${campaign.name}" paused`,
                );
              }}
              data-ocid={`campaigns.${campaign.id}.toggle`}
            />
          </div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge
              className={`text-xs border ${enabled ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}
            >
              {enabled ? "Active" : "Paused"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {campaign.steps.length} steps
            </span>
            {channelSet.map((ch) => (
              <Badge key={ch} className={`text-xs ${channelColor(ch)}`}>
                <ChannelIcon channel={ch} />
                <span className="ml-1 capitalize">{ch}</span>
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              ["In Sequence", campaign.mockMetrics.contactsInSequence],
              ["Open Rate", `${campaign.mockMetrics.openRate}%`],
              ["Conversion", `${campaign.mockMetrics.conversionRate}%`],
            ].map(([label, val]) => (
              <div
                key={String(label)}
                className="bg-muted/40 rounded-lg p-2 text-center border border-border"
              >
                <p className="text-base font-bold text-foreground">{val}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={() => setShowJourney(true)}
            data-ocid={`campaigns.${campaign.id}.button`}
          >
            View Journey
          </Button>
        </CardContent>
      </Card>
      <JourneyModal
        campaign={campaign}
        open={showJourney}
        onClose={() => setShowJourney(false)}
      />
    </>
  );
}

function MyCampaignsTab() {
  const { currentTenantId, tenants, campaignToggles } = useApp();
  const currentTenant = tenants.find((t) => t.id === currentTenantId);
  const niche = (currentTenant?.type ?? "").toLowerCase();
  let campaigns: ClientCampaign[];
  if (niche.includes("plumb")) campaigns = PLUMBING_CAMPAIGNS;
  else if (niche.includes("spa") || niche.includes("med"))
    campaigns = MED_SPA_CAMPAIGNS;
  else campaigns = ALL_CLIENT_CAMPAIGNS;
  const tenantToggles = campaignToggles[currentTenantId] ?? {};
  const activeCampaigns = campaigns.filter(
    (c) => tenantToggles[c.id] !== false,
  ).length;
  const totalContacts = campaigns.reduce(
    (sum, c) => sum + c.mockMetrics.contactsInSequence,
    0,
  );
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Active Campaigns",
            value: activeCampaigns,
            icon: Megaphone,
            color: "text-primary",
          },
          {
            label: "Contacts in Sequence",
            value: totalContacts,
            icon: Users,
            color: "text-blue-400",
          },
          {
            label: "Msgs Sent This Month",
            value: 247,
            icon: Send,
            color: "text-emerald-400",
          },
          {
            label: "Conversions",
            value: 18,
            icon: TrendingUp,
            color: "text-purple-400",
          },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
            <ClientCampaignCard
              key={campaign.id}
              campaign={campaign}
              tenantId={currentTenantId}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="campaigns.my_campaigns.empty_state"
        >
          <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-80" />
          <p className="text-sm">
            No campaigns available for your account type.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── NEW: Email Preview Modal ─────────────────────────────────────────────────

const SAMPLE_VALUES: Record<string, string> = {
  "{{business_name}}": "Smith Plumbing",
  "{{owner_name}}": "John Smith",
  "{{city}}": "Austin",
  "{{audit_finding}}": "No contact form above the fold",
  "{{demo_link}}":
    "https://bookedrankedfunded.org/unified-demo?utm_source=email",
  "{{audit_link}}":
    "https://bookedrankedfunded.org/free-audit?utm_source=email",
  "{{niche}}": "plumbing",
  "{{first_name}}": "John",
  "{{booking_link}}": "https://cal.com/brf/demo",
};

function fillTokens(text: string): string {
  let result = text;
  for (const [token, value] of Object.entries(SAMPLE_VALUES)) {
    result = result.replaceAll(token, value);
  }
  return result;
}

function EmailPreviewModal({
  touch,
  open,
  onClose,
}: { touch: EmailTouch | null; open: boolean; onClose: () => void }) {
  if (!touch) return null;
  const activeVariant =
    touch.variants.find((v) => v.isActive) ?? touch.variants[0];
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
        data-ocid="campaigns.email_preview.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Email Preview — Touch {touch.touchNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-primary/15 text-primary border-primary/20 text-xs">
              {touch.framework}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Day {touch.dayOffset}
            </span>
            <span className="text-xs text-muted-foreground">
              · Active: {activeVariant.label}
            </span>
          </div>
          <div className="bg-muted/40 border border-border rounded-lg p-4 space-y-3">
            <div className="border-b border-border pb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Subject
              </p>
              <p className="text-sm font-medium text-foreground">
                {fillTokens(activeVariant.subject)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Body
              </p>
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {fillTokens(activeVariant.body)}
              </pre>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div
              className={`w-2 h-2 rounded-full ${ctaDot(touch.primaryCtaType)}`}
            />
            <span className="text-xs font-medium text-foreground">
              {touch.primaryCtaLabel}
            </span>
            {touch.secondaryCtaLabel && (
              <>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-xs text-muted-foreground">
                  {touch.secondaryCtaLabel}
                </span>
              </>
            )}
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
            <p className="text-xs font-semibold text-amber-400 mb-1">
              Framework Rationale
            </p>
            <p className="text-xs text-muted-foreground">
              {touch.frameworkRationale}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── NEW: CampaignBuilderTab ──────────────────────────────────────────────────

function TouchCard({
  touch,
  onEdit,
  onPreview,
}: {
  touch: EmailTouch;
  onEdit: (t: EmailTouch) => void;
  onPreview: (t: EmailTouch) => void;
}) {
  const activeVariant =
    touch.variants.find((v) => v.isActive) ?? touch.variants[0];
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">
              {touch.touchNumber}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs text-muted-foreground">
                Day {touch.dayOffset}
              </span>
              <Badge className="text-xs bg-primary/15 text-primary border-primary/20 py-0">
                {touch.framework}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div
                  className={`w-2 h-2 rounded-full ${ctaDot(touch.primaryCtaType)}`}
                />
                <span>{touch.primaryCtaLabel}</span>
              </div>
              {touch.secondaryCtaLabel && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div
                    className={`w-2 h-2 rounded-full ${ctaDot(touch.secondaryCtaType ?? "audit")}`}
                  />
                  <span>{touch.secondaryCtaLabel}</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              {fillTokens(activeVariant.subject)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {fillTokens(activeVariant.body).substring(0, 150)}…
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPreview(touch)}
              title="Preview email"
              data-ocid={`campaigns.touch.${touch.touchNumber}.preview_button`}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(touch)}
              title="Edit touch"
              data-ocid={`campaigns.touch.${touch.touchNumber}.edit_button`}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TouchEditorPanel({
  touch,
  onClose,
  onSave,
}: {
  touch: EmailTouch;
  onClose: () => void;
  onSave: (t: EmailTouch) => void;
}) {
  const [localTouch, setLocalTouch] = useState<EmailTouch>(touch);
  const tokens = [
    "{{business_name}}",
    "{{owner_name}}",
    "{{city}}",
    "{{audit_finding}}",
    "{{demo_link}}",
    "{{audit_link}}",
    "{{niche}}",
  ];
  const insertToken = (token: string, variantIdx: number) => {
    setLocalTouch((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === variantIdx ? { ...v, body: `${v.body} ${token}` } : v,
      ),
    }));
  };
  return (
    <Card className="bg-card border-primary/30 border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            Edit Touch {touch.touchNumber} — {touch.framework}
          </CardTitle>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {localTouch.variants.map((variant, vi) => (
          <div
            key={variant.id}
            className={`rounded-lg border p-3 space-y-3 ${variant.isActive ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                {variant.label}
              </span>
              <Button
                size="sm"
                variant={variant.isActive ? "default" : "outline"}
                className="h-6 text-xs px-2"
                onClick={() =>
                  setLocalTouch((prev) => ({
                    ...prev,
                    variants: prev.variants.map((v, i) => ({
                      ...v,
                      isActive: i === vi,
                    })),
                  }))
                }
                data-ocid={`campaigns.variant.${vi + 1}.toggle`}
              >
                {variant.isActive ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </>
                ) : (
                  "Set Active"
                )}
              </Button>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <Input
                value={variant.subject}
                onChange={(e) =>
                  setLocalTouch((prev) => ({
                    ...prev,
                    variants: prev.variants.map((v, i) =>
                      i === vi ? { ...v, subject: e.target.value } : v,
                    ),
                  }))
                }
                className="mt-1 h-8 text-xs"
                data-ocid={`campaigns.variant.${vi + 1}.input`}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Body</Label>
              <Textarea
                value={variant.body}
                onChange={(e) =>
                  setLocalTouch((prev) => ({
                    ...prev,
                    variants: prev.variants.map((v, i) =>
                      i === vi ? { ...v, body: e.target.value } : v,
                    ),
                  }))
                }
                rows={8}
                className="mt-1 text-xs font-mono"
                data-ocid={`campaigns.variant.${vi + 1}.textarea`}
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {tokens.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => insertToken(t, vi)}
                    className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 hover:bg-primary/20 font-mono transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">
              Primary CTA Type
            </Label>
            <Select
              value={localTouch.primaryCtaType}
              onValueChange={(v) =>
                setLocalTouch((prev) => ({
                  ...prev,
                  primaryCtaType: v as EmailTouch["primaryCtaType"],
                }))
              }
            >
              <SelectTrigger
                className="mt-1 h-8 text-xs"
                data-ocid="campaigns.touch.cta.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="audit">Free Audit</SelectItem>
                <SelectItem value="ai-demo">AI Capabilities Demo</SelectItem>
                <SelectItem value="back-office-demo">
                  Back Office Demo
                </SelectItem>
                <SelectItem value="unified-demo">Unified Demo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              Secondary CTA Type
            </Label>
            <Select
              value={localTouch.secondaryCtaType ?? ""}
              onValueChange={(v) =>
                setLocalTouch((prev) => ({
                  ...prev,
                  secondaryCtaType: v
                    ? (v as EmailTouch["secondaryCtaType"])
                    : undefined,
                }))
              }
            >
              <SelectTrigger className="mt-1 h-8 text-xs">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="audit">Free Audit</SelectItem>
                <SelectItem value="ai-demo">AI Demo</SelectItem>
                <SelectItem value="back-office-demo">
                  Back Office Demo
                </SelectItem>
                <SelectItem value="unified-demo">Unified Demo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <p className="text-xs font-semibold text-amber-400 mb-1">
            Framework Rationale (read-only)
          </p>
          <p className="text-xs text-muted-foreground">
            {touch.frameworkRationale}
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid="campaigns.touch_editor.cancel_button"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onSave(localTouch);
              toast.success(`Touch ${touch.touchNumber} saved`);
              onClose();
            }}
            data-ocid="campaigns.touch_editor.save_button"
          >
            Save Touch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignBuilderTab() {
  const [sequences, setSequences] =
    useState<ColdEmailSequence[]>(COLD_EMAIL_SEQUENCES);
  const [editingTouch, setEditingTouch] = useState<EmailTouch | null>(null);
  const [previewTouch, setPreviewTouch] = useState<EmailTouch | null>(null);
  const [sendLimit, setSendLimit] = useState("50");
  const [sendTime, setSendTime] = useState("09:00");
  const [sendTz, setSendTz] = useState("America/New_York");

  // Premium sequence is the only sequence now
  const activeSeq =
    sequences.find((s) => s.id === PREMIUM_OUTREACH_SEQUENCE.id) ??
    sequences[0];

  const handleSaveTouch = (updated: EmailTouch) => {
    setSequences((prev) =>
      prev.map((s) =>
        s.id === activeSeq?.id
          ? {
              ...s,
              touches: s.touches.map((t) =>
                t.id === updated.id ? updated : t,
              ),
            }
          : s,
      ),
    );
  };

  const handleActivate = () => {
    setSequences((prev) =>
      prev.map((s) =>
        s.id === activeSeq?.id ? { ...s, status: "active" } : s,
      ),
    );
    toast.success(`${activeSeq?.name} is now active!`);
  };

  return (
    <div className="space-y-6" data-ocid="campaigns.builder.section">
      {/* Premium Outreach banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-purple-500/30 bg-purple-900/10">
        <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">
              {PREMIUM_OUTREACH_METADATA.name}
            </h3>
            <Badge className="text-[10px] py-0 bg-purple-500/15 text-purple-300 border-purple-500/30">
              Active
            </Badge>
            <Badge className="text-[10px] py-0 bg-amber-500/10 text-amber-400 border-amber-500/20">
              Replaces cold outreach
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {PREMIUM_OUTREACH_METADATA.totalEmails} emails ·{" "}
            {PREMIUM_OUTREACH_METADATA.totalDays} days · Cross-niche · Pain →
            Demo → 7-day trial
          </p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {PREMIUM_OUTREACH_METADATA.frameworks.map((fw) => (
              <span
                key={fw}
                className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full px-2 py-0.5"
              >
                {fw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {activeSeq && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  {activeSeq.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeSeq.pain}
                </p>
              </div>
              <Badge
                className={`text-xs border ${activeSeq.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}
              >
                {activeSeq.status}
              </Badge>
            </div>

            {/* Email Provider Indicator — cold sequences always route via Listmonk/Custom SMTP */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
              <EmailProviderBadge type="cold" />
              <p className="text-xs text-muted-foreground">
                Cold sequences are sent through your own SMTP or Listmonk —
                never Caffeine native email. Configure your sending domain in
                the Go Live dashboard.
              </p>
            </div>

            <div className="space-y-2">
              {activeSeq.touches.map((touch, idx) => (
                <div key={touch.id}>
                  {editingTouch?.id === touch.id ? (
                    <TouchEditorPanel
                      touch={editingTouch}
                      onClose={() => setEditingTouch(null)}
                      onSave={handleSaveTouch}
                    />
                  ) : (
                    <TouchCard
                      touch={touch}
                      onEdit={(t) => setEditingTouch(t)}
                      onPreview={(t) => setPreviewTouch(t)}
                    />
                  )}
                  {idx < activeSeq.touches.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 opacity-40" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-muted-foreground">
                Stop triggers: {activeSeq.stopTriggers.join(", ")}
              </p>
              <Button
                onClick={handleActivate}
                disabled={activeSeq.status === "active"}
                data-ocid="campaigns.builder.activate_button"
              >
                <Play className="h-4 w-4 mr-2" />
                {activeSeq.status === "active"
                  ? "Sequence Active"
                  : "Activate Sequence"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Send Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Daily Send Limit
                  </Label>
                  <Input
                    value={sendLimit}
                    onChange={(e) => setSendLimit(e.target.value)}
                    type="number"
                    className="mt-1 h-8 text-sm"
                    data-ocid="campaigns.schedule.limit_input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Send Time (HH:MM)
                  </Label>
                  <Input
                    value={sendTime}
                    onChange={(e) => setSendTime(e.target.value)}
                    type="time"
                    className="mt-1 h-8 text-sm"
                    data-ocid="campaigns.schedule.time_input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Timezone
                  </Label>
                  <Select value={sendTz} onValueChange={setSendTz}>
                    <SelectTrigger
                      className="mt-1 h-8 text-xs"
                      data-ocid="campaigns.schedule.tz_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central (CT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain (MT)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific (PT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => toast.success("Schedule saved")}
                  data-ocid="campaigns.schedule.save_button"
                >
                  Save Schedule
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">CTA Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  ["audit", "Free 3-Stage Audit"],
                  ["ai-demo", "AI Capabilities Demo"],
                  ["back-office-demo", "Back Office Demo"],
                  ["unified-demo", "See 2 Live Demos"],
                ].map(([id, label]) => {
                  const colorMap: Record<string, string> = {
                    audit: "bg-emerald-400",
                    "ai-demo": "bg-blue-400",
                    "back-office-demo": "bg-purple-400",
                    "unified-demo": "bg-amber-400",
                  };
                  return (
                    <div key={id} className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-2 h-2 rounded-full ${colorMap[id] ?? "bg-slate-400"}`}
                      />
                      <span className="text-muted-foreground">{label}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <EmailPreviewModal
        touch={previewTouch}
        open={!!previewTouch}
        onClose={() => setPreviewTouch(null)}
      />
    </div>
  );
}

// ─── NEW: DemoLinkManagerTab ──────────────────────────────────────────────────

function DemoLinkManagerTab() {
  const [links, setLinks] = useState<DemoLinkConfig[]>(DEFAULT_DEMO_LINKS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<DemoLinkConfig | null>(null);

  const startEdit = (link: DemoLinkConfig) => {
    setEditingId(link.id);
    setEditForm({ ...link });
  };
  const saveEdit = () => {
    if (!editForm) return;
    setLinks((prev) => prev.map((l) => (l.id === editForm.id ? editForm : l)));
    setEditingId(null);
    setEditForm(null);
    toast.success("Demo link updated");
  };
  const copyUrl = (link: DemoLinkConfig) => {
    const params = new URLSearchParams({
      utm_source: link.utmSource,
      utm_medium: link.utmMedium,
      utm_campaign: link.utmCampaign,
      ...(link.utmContent ? { utm_content: link.utmContent } : {}),
    });
    const full = `${link.url}?${params.toString()}`;
    navigator.clipboard
      .writeText(full)
      .then(() => toast.success("URL copied to clipboard"));
  };

  // Touch assignment matrix
  const TOUCH_ASSIGNMENT: Record<string, string[]> = {
    "plumbing-cold-sequence": [
      "free-audit",
      "ai-capabilities",
      "back-office",
      "unified",
      "free-audit",
    ],
    "medspa-cold-sequence": [
      "free-audit",
      "ai-capabilities",
      "back-office",
      "unified",
      "free-audit",
    ],
  };
  const [touchAssignment, setTouchAssignment] = useState(TOUCH_ASSIGNMENT);

  return (
    <div className="space-y-6" data-ocid="campaigns.demo_links.section">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">
            Demo Link Configuration
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure URLs and UTM parameters for each demo type
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast.success("All active sequences updated with new links");
          }}
          data-ocid="campaigns.demo_links.apply_all_button"
        >
          <Activity className="h-4 w-4 mr-2" />
          Apply to All Active Sequences
        </Button>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  URL
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  UTM Campaign
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">
                  UTM Content
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.map((link) => (
                <tr
                  key={link.id}
                  data-ocid={`campaigns.demo_link.${link.id}.row`}
                >
                  {editingId === link.id && editForm ? (
                    <td colSpan={5} className="px-4 py-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label className="text-xs">URL</Label>
                          <Input
                            value={editForm.url}
                            onChange={(e) =>
                              setEditForm((p) =>
                                p ? { ...p, url: e.target.value } : p,
                              )
                            }
                            className="mt-1 h-8 text-xs"
                            data-ocid={`campaigns.demo_link.${link.id}.input`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">UTM Source</Label>
                          <Input
                            value={editForm.utmSource}
                            onChange={(e) =>
                              setEditForm((p) =>
                                p ? { ...p, utmSource: e.target.value } : p,
                              )
                            }
                            className="mt-1 h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">UTM Medium</Label>
                          <Input
                            value={editForm.utmMedium}
                            onChange={(e) =>
                              setEditForm((p) =>
                                p ? { ...p, utmMedium: e.target.value } : p,
                              )
                            }
                            className="mt-1 h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">UTM Campaign</Label>
                          <Input
                            value={editForm.utmCampaign}
                            onChange={(e) =>
                              setEditForm((p) =>
                                p ? { ...p, utmCampaign: e.target.value } : p,
                              )
                            }
                            className="mt-1 h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">UTM Content</Label>
                          <Input
                            value={editForm.utmContent}
                            onChange={(e) =>
                              setEditForm((p) =>
                                p ? { ...p, utmContent: e.target.value } : p,
                              )
                            }
                            className="mt-1 h-8 text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={saveEdit}
                          data-ocid={`campaigns.demo_link.${link.id}.save_button`}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(null);
                            setEditForm(null);
                          }}
                          data-ocid={`campaigns.demo_link.${link.id}.cancel_button`}
                        >
                          Cancel
                        </Button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground text-xs">
                          {link.label}
                        </p>
                        <p className="text-muted-foreground text-[11px] mt-0.5">
                          {link.description}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                        {link.url}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                        {link.utmCampaign}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden xl:table-cell">
                        {link.utmContent || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => startEdit(link)}
                            data-ocid={`campaigns.demo_link.${link.id}.edit_button`}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyUrl(link)}
                            data-ocid={`campaigns.demo_link.${link.id}.copy_button`}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div>
        <h3 className="font-semibold text-foreground mb-3">
          Per-Sequence Touch Assignment
        </h3>
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Sequence
                  </th>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <th
                      key={n}
                      className="px-4 py-3 font-medium text-muted-foreground text-center"
                    >
                      Touch {n}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Object.entries(touchAssignment).map(([seqId, touches]) => (
                  <tr key={seqId}>
                    <td className="px-4 py-3 text-xs font-medium text-foreground whitespace-nowrap">
                      {seqId === "plumbing-cold-sequence"
                        ? "Plumber Sequence"
                        : "Med Spa Sequence"}
                    </td>
                    {touches.map((demoLinkId, tIdx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: touch position index (1–5) is the stable key
                      <td key={tIdx} className="px-2 py-2 text-center">
                        <Select
                          value={demoLinkId}
                          onValueChange={(v) =>
                            setTouchAssignment((prev) => ({
                              ...prev,
                              [seqId]: prev[seqId].map((d, i) =>
                                i === tIdx ? v : d,
                              ),
                            }))
                          }
                        >
                          <SelectTrigger
                            className="h-7 text-[10px] w-32"
                            data-ocid={`campaigns.touch_assignment.${seqId}.${tIdx + 1}.select`}
                          >
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${ctaDot(demoLinkId)}`}
                              />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {links.map((l) => (
                              <SelectItem key={l.id} value={l.id}>
                                {l.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── NEW: CopyVariantLibraryTab ───────────────────────────────────────────────

function CopyVariantLibraryTab() {
  const [sequences, setSequences] =
    useState<ColdEmailSequence[]>(COLD_EMAIL_SEQUENCES);
  const [selectedNiche, setSelectedNiche] = useState("plumbing");

  const seq = sequences.find((s) => s.niche === selectedNiche);

  const setActive = (niche: string, touchId: string, variantId: string) => {
    setSequences((prev) =>
      prev.map((s) =>
        s.niche !== niche
          ? s
          : {
              ...s,
              touches: s.touches.map((t) =>
                t.id !== touchId
                  ? t
                  : {
                      ...t,
                      variants: t.variants.map((v) => ({
                        ...v,
                        isActive: v.id === variantId,
                      })),
                    },
              ),
            },
      ),
    );
    toast.success("Variant set as active");
  };

  const addVariant = (niche: string, touchId: string) => {
    setSequences((prev) =>
      prev.map((s) =>
        s.niche !== niche
          ? s
          : {
              ...s,
              touches: s.touches.map((t) =>
                t.id !== touchId
                  ? t
                  : {
                      ...t,
                      variants: [
                        ...t.variants,
                        {
                          id: `${touchId}-c-${Date.now()}`,
                          label: "Variant C",
                          subject: "",
                          body: "",
                          isActive: false,
                        },
                      ],
                    },
              ),
            },
      ),
    );
    toast.success("Variant C added");
  };

  return (
    <div className="space-y-6" data-ocid="campaigns.copy_variants.section">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSelectedNiche("plumbing")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedNiche === "plumbing" ? "bg-primary/15 border-primary/40 text-primary" : "border-border text-foreground hover:bg-muted/40"}`}
          data-ocid="campaigns.copy_variants.plumbing.tab"
        >
          Plumbing
        </button>
        <button
          type="button"
          onClick={() => setSelectedNiche("medspa")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedNiche === "medspa" ? "bg-primary/15 border-primary/40 text-primary" : "border-border text-foreground hover:bg-muted/40"}`}
          data-ocid="campaigns.copy_variants.medspa.tab"
        >
          Med Spa
        </button>
      </div>

      {seq?.touches.map((touch) => (
        <div key={touch.id} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">
                {touch.touchNumber}
              </span>
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">
                Touch {touch.touchNumber} — Day {touch.dayOffset}
              </span>
              <Badge className="ml-2 text-xs bg-primary/15 text-primary border-primary/20 py-0">
                {touch.framework}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
            {touch.variants.map((variant) => (
              <Card
                key={variant.id}
                className={`border ${variant.isActive ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}
                data-ocid={`campaigns.variant.${touch.touchNumber}.${variant.label.toLowerCase().replace(" ", "_")}.card`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${variant.isActive ? "text-primary" : "text-foreground"}`}
                    >
                      {variant.label}
                      {variant.isActive && (
                        <span className="ml-2 text-[10px] bg-primary/15 text-primary rounded-full px-2 py-0.5">
                          Active
                        </span>
                      )}
                    </span>
                    <div className="flex gap-1">
                      {!variant.isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs px-2"
                          onClick={() =>
                            setActive(seq.niche, touch.id, variant.id)
                          }
                          data-ocid={`campaigns.variant.${touch.touchNumber}.${variant.id}.set_active_button`}
                        >
                          Set Active
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Subject
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      {variant.subject || (
                        <span className="italic text-muted-foreground">
                          No subject
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Body preview
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {variant.body.substring(0, 180)}…
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card
              className="border border-dashed border-border bg-transparent cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => addVariant(seq.niche, touch.id)}
              data-ocid={`campaigns.add_variant.${touch.touchNumber}.button`}
            >
              <CardContent className="p-4 flex items-center justify-center h-full min-h-[120px]">
                <div className="text-center">
                  <Plus className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Add Variant</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── NEW: SequenceManagerTab (Cold Email) ─────────────────────────────────────

function AuditTripwirePanel() {
  const [config, setConfig] = useState<AuditTripwireConfig>(
    DEFAULT_AUDIT_TRIPWIRE,
  );
  const [expanded, setExpanded] = useState(false);
  return (
    <Card
      className="bg-card border-border"
      data-ocid="campaigns.tripwire.panel"
    >
      <CardHeader className="pb-0">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full"
        >
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-amber-400" />
            Audit Tripwire Settings
          </CardTitle>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Audit URL</Label>
            <Input
              value={config.auditUrl}
              onChange={(e) =>
                setConfig((p) => ({ ...p, auditUrl: e.target.value }))
              }
              className="mt-1 h-8 text-xs"
              data-ocid="campaigns.tripwire.url_input"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              When prospect completes audit
            </Label>
            <Select
              value={config.warmSequenceId || "remove-only"}
              onValueChange={(v) =>
                setConfig((p) => ({
                  ...p,
                  warmSequenceId: v === "remove-only" ? "" : v,
                }))
              }
            >
              <SelectTrigger
                className="mt-1 h-8 text-xs"
                data-ocid="campaigns.tripwire.action_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remove-enroll">
                  Remove from cold + Enroll in warm follow-up
                </SelectItem>
                <SelectItem value="remove-only">
                  Remove from cold sequence only
                </SelectItem>
                <SelectItem value="keep-converted">
                  Keep in sequence (mark as converted)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-foreground">
              Notify admin on audit completion
            </Label>
            <Switch
              checked={config.notifyAdmin}
              onCheckedChange={(v) =>
                setConfig((p) => ({ ...p, notifyAdmin: v }))
              }
              data-ocid="campaigns.tripwire.notify_toggle"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-foreground">
              Auto-create/update CRM lead with audit scores
            </Label>
            <Switch
              checked={config.autoRemoveFromColdSequence}
              onCheckedChange={(v) =>
                setConfig((p) => ({ ...p, autoRemoveFromColdSequence: v }))
              }
              data-ocid="campaigns.tripwire.auto_toggle"
            />
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => toast.success("Tripwire settings saved")}
            data-ocid="campaigns.tripwire.save_button"
          >
            Save Settings
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

// ─── A/B TESTING DATA ─────────────────────────────────────────────────────────

const AB_VARIANTS: Record<string, { a: string; b: string }> = {
  Plumbing: {
    a: "Is Your Plumbing Business Getting Buried on Google?",
    b: "Every Missed Call Costs You $280. Here's the Fix.",
  },
  "Med Spa": {
    a: "Your Clients Are Ghosting You. Here's Why.",
    b: "The #1 Reason Med Spas Leave $8k/Month Unrebooked",
  },
  HVAC: {
    a: "HVAC Owners: Stop Slow Season Before It Starts",
    b: "73% of HVAC Calls Go to Whoever Answers First. Are You That Company?",
  },
  Restoration: {
    a: "After-Hours Emergencies Are Your Biggest Opportunity",
    b: "Why Restoration Companies Lose 60% of Insurance Jobs",
  },
  "Carpet Cleaning": {
    a: "Your One-Time Customers Are Shopping Your Competitors Right Now",
    b: "Triple Your Rebooking Rate Without Hiring Anyone",
  },
  Roofing: {
    a: "Storm Season Doesn't Wait. Does Your Follow-Up System?",
    b: "Your Competitors Are Running Ads on Your Name Right Now",
  },
  "Real Estate": {
    a: "Every Open House You Run Without a Follow-Up System Costs You a Deal",
    b: "Your Next 3 Listings Are Already in Your Database",
  },
  Mortgage: {
    a: "Rate Shoppers Aren't Loyal — Until You Run This System",
    b: "Your Referral Partners Are Sending Leads to Someone Else",
  },
  Chiropractic: {
    a: "47% of Your Former Patients Haven't Been Back in 90 Days",
    b: "The Reactivation Script That Brings 2-3 Patients Back Per Week",
  },
  Dental: {
    a: "Every No-Show Costs Your Practice $320. Here's the Fix.",
    b: "Your Recall System Is Leaking Patients Every Day",
  },
};

const NICHE_BENCHMARKS: Record<
  string,
  { open: number; click: number; reply: number; proof: string }
> = {
  Plumbing: {
    open: 22,
    click: 3.1,
    reply: 0.8,
    proof:
      "Plumbing businesses running BRF outreach average 31% open rates — 41% above industry.",
  },
  "Med Spa": {
    open: 28,
    click: 4.2,
    reply: 1.1,
    proof:
      "Med spas using BRF sequences average 36% open rates and 3.2 new bookings per 50 sends.",
  },
  HVAC: {
    open: 20,
    click: 2.8,
    reply: 0.7,
    proof:
      "HVAC companies on BRF stay booked through slow season — avg 2.4 new jobs per sequence.",
  },
  Restoration: {
    open: 18,
    click: 2.3,
    reply: 0.5,
    proof:
      "Restoration companies running BRF cold outreach close their first insurance job in an average of 18 days.",
  },
  "Carpet Cleaning": {
    open: 24,
    click: 3.4,
    reply: 0.9,
    proof:
      "Carpet cleaning businesses using BRF recall sequences see 3x rebooking rates within 30 days.",
  },
  Roofing: {
    open: 19,
    click: 2.6,
    reply: 0.6,
    proof:
      "Roofing contractors using BRF storm-season sequences average 6 new bids per campaign.",
  },
  "Real Estate": {
    open: 26,
    click: 3.8,
    reply: 1.0,
    proof:
      "Real estate agents on BRF close 2.1x more deals from their existing database in 90 days.",
  },
  Mortgage: {
    open: 23,
    click: 3.2,
    reply: 0.8,
    proof:
      "Mortgage brokers using BRF sequences see 38% more referral partner activations.",
  },
  Chiropractic: {
    open: 27,
    click: 4.0,
    reply: 1.1,
    proof:
      "Dental practices using BRF recall sequences recover 2.3 lapsed patients per week on average.",
  },
  Dental: {
    open: 25,
    click: 3.7,
    reply: 1.0,
    proof:
      "Dental practices using BRF recall sequences recover 2.3 lapsed patients per week on average.",
  },
};

// Mock current BRF rates (above benchmarks to show value)
const BRF_RATES: Record<
  string,
  { open: number; click: number; reply: number }
> = {
  Plumbing: { open: 31, click: 5.2, reply: 1.4 },
  "Med Spa": { open: 36, click: 6.8, reply: 1.9 },
  HVAC: { open: 28, click: 4.3, reply: 1.2 },
  Restoration: { open: 26, click: 3.8, reply: 0.9 },
  "Carpet Cleaning": { open: 33, click: 5.1, reply: 1.6 },
  Roofing: { open: 27, click: 4.0, reply: 1.1 },
  "Real Estate": { open: 38, click: 6.2, reply: 1.8 },
  Mortgage: { open: 34, click: 5.4, reply: 1.5 },
  Chiropractic: { open: 40, click: 6.6, reply: 1.9 },
  Dental: { open: 37, click: 6.0, reply: 1.7 },
};

interface ABTest {
  id: string;
  niche: string;
  touchNumber: number;
  subjectA: string;
  subjectB: string;
  splitPct: number;
  duration: "24h" | "48h" | "72h";
  winnerMetric: "open_rate" | "click_rate" | "reply_rate";
  status: "running" | "winner_declared" | "tie";
  winner?: "A" | "B";
  openRateA?: number;
  openRateB?: number;
  framework: string;
}

const INITIAL_AB_TESTS: ABTest[] = [
  {
    id: "ab1",
    niche: "Plumbing",
    touchNumber: 1,
    subjectA: AB_VARIANTS.Plumbing.a,
    subjectB: AB_VARIANTS.Plumbing.b,
    splitPct: 50,
    duration: "48h",
    winnerMetric: "open_rate",
    status: "winner_declared",
    winner: "B",
    openRateA: 24.1,
    openRateB: 28.5,
    framework: "Kennedy",
  },
  {
    id: "ab2",
    niche: "Med Spa",
    touchNumber: 1,
    subjectA: AB_VARIANTS["Med Spa"].a,
    subjectB: AB_VARIANTS["Med Spa"].b,
    splitPct: 50,
    duration: "48h",
    winnerMetric: "open_rate",
    status: "running",
    openRateA: 31.2,
    openRateB: 35.8,
    framework: "Hormozi",
  },
  {
    id: "ab3",
    niche: "Roofing",
    touchNumber: 1,
    subjectA: AB_VARIANTS.Roofing.a,
    subjectB: AB_VARIANTS.Roofing.b,
    splitPct: 60,
    duration: "72h",
    winnerMetric: "click_rate",
    status: "running",
    openRateA: 22.4,
    openRateB: 19.7,
    framework: "Deiss",
  },
];

// ─── ABTestingTab ──────────────────────────────────────────────────────────────

function ABTestingTab() {
  const [tests, setTests] = useState<ABTest[]>(INITIAL_AB_TESTS);
  const [showNew, setShowNew] = useState(false);
  const [newTest, setNewTest] = useState<Partial<ABTest>>({
    niche: "Plumbing",
    touchNumber: 1,
    splitPct: 50,
    duration: "48h",
    winnerMetric: "open_rate",
    framework: "Kennedy",
  });

  const handleGenerate = (niche: string) => {
    const variant = AB_VARIANTS[niche];
    if (!variant) return;
    setNewTest((p) => ({
      ...p,
      niche,
      subjectA: variant.a,
      subjectB: variant.b,
    }));
    toast.success("Pre-built variants loaded from BRF framework library");
  };

  const handleDeclareWinner = (testId: string, winner: "A" | "B") => {
    setTests((prev) =>
      prev.map((t) =>
        t.id === testId ? { ...t, status: "winner_declared", winner } : t,
      ),
    );
    toast.success(
      `Version ${winner} declared winner — all remaining sends switched to Version ${winner}`,
    );
  };

  const handleCreate = () => {
    if (!newTest.subjectA || !newTest.subjectB || !newTest.niche) {
      toast.error("Please fill in both subject lines and niche");
      return;
    }
    const test: ABTest = {
      id: `ab-${Date.now()}`,
      niche: newTest.niche ?? "Plumbing",
      touchNumber: newTest.touchNumber ?? 1,
      subjectA: newTest.subjectA ?? "",
      subjectB: newTest.subjectB ?? "",
      splitPct: newTest.splitPct ?? 50,
      duration: newTest.duration as ABTest["duration"],
      winnerMetric: newTest.winnerMetric as ABTest["winnerMetric"],
      status: "running",
      openRateA: Math.round(18 + Math.random() * 12 * 10) / 10,
      openRateB: Math.round(18 + Math.random() * 16 * 10) / 10,
      framework: newTest.framework ?? "Kennedy",
    };
    setTests((p) => [test, ...p]);
    setShowNew(false);
    toast.success("A/B test launched — tracking starts immediately");
  };

  const NICHES = Object.keys(AB_VARIANTS);

  return (
    <div className="space-y-6" data-ocid="campaigns.ab_testing.section">
      {/* Kennedy quote banner */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
          <Trophy className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-300">
            Kennedy's #1 Rule: "The headline does 80% of the work."
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test your subject lines relentlessly. Every percentage point in open
            rate is money on the table.
          </p>
        </div>
        <Badge className="text-[10px] ml-auto shrink-0 bg-amber-500/10 text-amber-400 border-amber-500/20">
          Kennedy Framework
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">
            A/B Subject Line Tests
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {tests.filter((t) => t.status === "running").length} running ·{" "}
            {tests.filter((t) => t.status === "winner_declared").length} winners
            declared
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowNew(true)}
          data-ocid="campaigns.ab_testing.new_test_button"
        >
          <SplitSquareHorizontal className="h-4 w-4 mr-2" />
          New A/B Test
        </Button>
      </div>

      {/* New test form */}
      {showNew && (
        <Card
          className="bg-card border-primary/30 border"
          data-ocid="campaigns.ab_testing.new_form"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <SplitSquareHorizontal className="h-4 w-4 text-primary" />
                New A/B Test
              </CardTitle>
              <button type="button" onClick={() => setShowNew(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Niche</Label>
                <Select
                  value={newTest.niche}
                  onValueChange={(v) => setNewTest((p) => ({ ...p, niche: v }))}
                >
                  <SelectTrigger
                    className="mt-1 h-8 text-xs"
                    data-ocid="campaigns.ab_testing.niche_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NICHES.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Touch #</Label>
                <Select
                  value={String(newTest.touchNumber)}
                  onValueChange={(v) =>
                    setNewTest((p) => ({ ...p, touchNumber: Number(v) }))
                  }
                >
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        Touch {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGenerate(newTest.niche ?? "Plumbing")}
                data-ocid="campaigns.ab_testing.generate_b_button"
                className="text-xs"
              >
                <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
                Load Pre-Built Variants for {newTest.niche}
              </Button>
            </div>

            {/* Side-by-side split card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300">
                    A
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    Version A
                  </span>
                  <Badge className="text-[10px] ml-auto bg-blue-500/10 text-blue-400 border-blue-500/20">
                    Control
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Subject Line
                  </Label>
                  <Input
                    value={newTest.subjectA ?? ""}
                    onChange={(e) =>
                      setNewTest((p) => ({ ...p, subjectA: e.target.value }))
                    }
                    className="mt-1 h-8 text-xs"
                    placeholder="Version A subject..."
                    data-ocid="campaigns.ab_testing.subject_a_input"
                  />
                </div>
                <div className="bg-muted/30 rounded-lg p-2 text-xs text-muted-foreground italic">
                  📧 Preview:{" "}
                  <span className="text-foreground not-italic">
                    {newTest.subjectA || "Enter subject..."}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300">
                    B
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    Version B
                  </span>
                  <Badge className="text-[10px] ml-auto bg-purple-500/10 text-purple-400 border-purple-500/20">
                    Challenger
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Subject Line
                  </Label>
                  <Input
                    value={newTest.subjectB ?? ""}
                    onChange={(e) =>
                      setNewTest((p) => ({ ...p, subjectB: e.target.value }))
                    }
                    className="mt-1 h-8 text-xs"
                    placeholder="Version B subject..."
                    data-ocid="campaigns.ab_testing.subject_b_input"
                  />
                </div>
                <div className="bg-muted/30 rounded-lg p-2 text-xs text-muted-foreground italic">
                  📧 Preview:{" "}
                  <span className="text-foreground not-italic">
                    {newTest.subjectB || "Enter subject..."}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Split %</Label>
                <Input
                  type="number"
                  min={10}
                  max={90}
                  value={newTest.splitPct}
                  onChange={(e) =>
                    setNewTest((p) => ({
                      ...p,
                      splitPct: Number(e.target.value),
                    }))
                  }
                  className="mt-1 h-8 text-xs"
                  data-ocid="campaigns.ab_testing.split_input"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {newTest.splitPct}% A / {100 - (newTest.splitPct ?? 50)}% B
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Declare winner after
                </Label>
                <Select
                  value={newTest.duration}
                  onValueChange={(v) =>
                    setNewTest((p) => ({
                      ...p,
                      duration: v as ABTest["duration"],
                    }))
                  }
                >
                  <SelectTrigger
                    className="mt-1 h-8 text-xs"
                    data-ocid="campaigns.ab_testing.duration_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="48h">48 hours</SelectItem>
                    <SelectItem value="72h">72 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Winner metric
                </Label>
                <Select
                  value={newTest.winnerMetric}
                  onValueChange={(v) =>
                    setNewTest((p) => ({
                      ...p,
                      winnerMetric: v as ABTest["winnerMetric"],
                    }))
                  }
                >
                  <SelectTrigger
                    className="mt-1 h-8 text-xs"
                    data-ocid="campaigns.ab_testing.metric_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open_rate">Open Rate</SelectItem>
                    <SelectItem value="click_rate">Click Rate</SelectItem>
                    <SelectItem value="reply_rate">Reply Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNew(false)}
                data-ocid="campaigns.ab_testing.cancel_button"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                data-ocid="campaigns.ab_testing.launch_button"
              >
                <SplitSquareHorizontal className="h-3.5 w-3.5 mr-1.5" />
                Launch A/B Test
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test cards */}
      <div className="space-y-4">
        {tests.map((test, i) => (
          <Card
            key={test.id}
            className="bg-card border-border overflow-hidden"
            data-ocid={`campaigns.ab_test.item.${i + 1}`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {test.niche}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Touch {test.touchNumber}
                  </span>
                  <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                    {test.framework} Framework
                  </Badge>
                  {test.status === "running" && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Running
                    </span>
                  )}
                  {test.status === "winner_declared" && (
                    <span className="flex items-center gap-1 text-xs text-amber-400">
                      <Trophy className="h-3 w-3" />
                      Winner Declared
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {test.splitPct}/{100 - test.splitPct} split · {test.duration}{" "}
                  · {test.winnerMetric.replace("_", " ")}
                </div>
              </div>

              {/* Side-by-side results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div
                  className={`rounded-xl p-4 border ${test.winner === "A" ? "border-emerald-500/40 bg-emerald-500/5" : test.winner === "B" ? "border-border bg-muted/20" : "border-blue-500/30 bg-blue-500/5"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300">
                      A
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      Version A
                    </span>
                    {test.winner === "A" && (
                      <Badge className="text-[10px] ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        🏆 Winner
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    "{test.subjectA}"
                  </p>
                  {test.openRateA !== undefined && (
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">Open Rate:</span>
                      <span
                        className={`font-bold ${test.winner === "B" ? "text-rose-400" : "text-emerald-400"}`}
                      >
                        {test.openRateA}%
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={`rounded-xl p-4 border ${test.winner === "B" ? "border-emerald-500/40 bg-emerald-500/5" : test.winner === "A" ? "border-border bg-muted/20" : "border-purple-500/30 bg-purple-500/5"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300">
                      B
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      Version B
                    </span>
                    {test.winner === "B" && (
                      <Badge className="text-[10px] ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        🏆 Winner
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    "{test.subjectB}"
                  </p>
                  {test.openRateB !== undefined && (
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">Open Rate:</span>
                      <span
                        className={`font-bold ${test.winner === "A" ? "text-rose-400" : "text-emerald-400"}`}
                      >
                        {test.openRateB}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {test.status === "winner_declared" &&
                test.winner &&
                test.openRateA &&
                test.openRateB && (
                  <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                    <p className="text-xs text-emerald-300 font-medium">
                      Winner declared by open rate: Version {test.winner}{" "}
                      outperformed by +
                      {Math.abs(test.openRateA - test.openRateB).toFixed(1)}% —
                      all remaining sends switched to Version {test.winner}
                    </p>
                  </div>
                )}

              {test.status === "running" && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                    onClick={() =>
                      handleDeclareWinner(
                        test.id,
                        test.openRateA! >= test.openRateB! ? "A" : "B",
                      )
                    }
                    data-ocid={`campaigns.ab_test.${i + 1}.declare_winner_button`}
                  >
                    <Trophy className="h-3.5 w-3.5 mr-1.5" />
                    Declare Winner Now
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => toast.info("Detailed results coming soon")}
                  >
                    <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
                    View Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {tests.length === 0 && (
        <div
          className="text-center py-16"
          data-ocid="campaigns.ab_testing.empty_state"
        >
          <SplitSquareHorizontal className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground">No A/B tests yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            "The average {"{niche}"} business running BRF outreach books 4 new
            clients in the first 30 days. Yours starts here."
          </p>
        </div>
      )}
    </div>
  );
}

// ─── CampaignIntelligenceTab ───────────────────────────────────────────────────

const CAMPAIGN_INTELLIGENCE_DATA = [
  {
    id: "ci1",
    name: "Plumbing 9-Touch Cold",
    niche: "Plumbing",
    status: "running",
    sent: 284,
    openRate: 31.2,
    clickRate: 5.1,
    replyRate: 1.4,
    demoClicks: 38,
    conversions: 12,
  },
  {
    id: "ci2",
    name: "Med Spa Reactivation",
    niche: "Med Spa",
    status: "running",
    sent: 142,
    openRate: 36.8,
    clickRate: 6.8,
    replyRate: 1.9,
    demoClicks: 29,
    conversions: 8,
  },
  {
    id: "ci3",
    name: "Roofing Storm Push",
    niche: "Roofing",
    status: "paused",
    sent: 96,
    openRate: 22.4,
    clickRate: 3.2,
    replyRate: 0.7,
    demoClicks: 11,
    conversions: 3,
  },
  {
    id: "ci4",
    name: "HVAC Summer Fill",
    niche: "HVAC",
    status: "completed",
    sent: 220,
    openRate: 28.5,
    clickRate: 4.3,
    replyRate: 1.2,
    demoClicks: 22,
    conversions: 9,
  },
  {
    id: "ci5",
    name: "Dental Recall",
    niche: "Dental",
    status: "running",
    sent: 180,
    openRate: 37.1,
    clickRate: 6.0,
    replyRate: 1.7,
    demoClicks: 32,
    conversions: 11,
  },
];

function MetricDelta({
  value,
  benchmark,
}: { value: number; benchmark: number }) {
  const delta = ((value - benchmark) / benchmark) * 100;
  const positive = delta >= 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}
    >
      {positive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {positive ? "+" : ""}
      {delta.toFixed(0)}%
    </span>
  );
}

function FunnelMini({
  sent,
  openRate,
  clickRate,
  replyRate,
}: { sent: number; openRate: number; clickRate: number; replyRate: number }) {
  const opened = Math.round((sent * openRate) / 100);
  const clicked = Math.round((sent * clickRate) / 100);
  const replied = Math.round((sent * replyRate) / 100);
  return (
    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
      <span className="bg-muted/40 px-1.5 py-0.5 rounded">{sent}</span>
      <ArrowRight className="h-2.5 w-2.5 opacity-40" />
      <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">
        {opened}
      </span>
      <ArrowRight className="h-2.5 w-2.5 opacity-40" />
      <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
        {clicked}
      </span>
      <ArrowRight className="h-2.5 w-2.5 opacity-40" />
      <span className="bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">
        {replied}
      </span>
    </div>
  );
}

function CampaignIntelligenceTab() {
  return (
    <div className="space-y-6" data-ocid="campaigns.intelligence.section">
      {/* Halbert header */}
      <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-4 flex items-start gap-3">
        <Target className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Your Sequences Are Outperforming the Market
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            BRF sequences average{" "}
            <span className="text-emerald-400 font-semibold">
              2.4x above industry benchmarks
            </span>{" "}
            across all 10 niches. The frameworks below show you exactly where
            your edge comes from.
          </p>
        </div>
      </div>

      {/* Benchmarks reference bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {["Plumbing", "Med Spa", "HVAC", "Roofing", "Dental"].map((niche) => {
          const b = NICHE_BENCHMARKS[niche];
          const r = BRF_RATES[niche];
          if (!b || !r) return null;
          return (
            <Card key={niche} className="bg-card border-border">
              <CardContent className="p-3 text-center">
                <p className="text-xs font-semibold text-foreground mb-2">
                  {niche}
                </p>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ind. avg</span>
                    <span className="text-muted-foreground">{b.open}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-400 font-semibold">
                      BRF avg
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      {r.open}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Campaign intelligence table */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Campaign Performance vs. Industry Benchmarks
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Hopkins "reason why" — real numbers, real proof, real difference
          </p>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Campaign
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Open Rate
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  Click Rate
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  Reply Rate
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">
                  Funnel
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Conversions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CAMPAIGN_INTELLIGENCE_DATA.map((c, i) => {
                const bench = NICHE_BENCHMARKS[c.niche];
                const statusMap: Record<string, string> = {
                  running:
                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                };
                const aboveBenchmark = bench && c.openRate > bench.open;
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`campaigns.intelligence.item.${i + 1}`}
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground text-xs">
                        {c.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">
                          {c.niche}
                        </Badge>
                        {aboveBenchmark && (
                          <Badge className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            🏆 Beats avg
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <Badge
                        className={`text-[10px] border ${statusMap[c.status] ?? "bg-muted"}`}
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span
                          className={`text-sm font-bold ${aboveBenchmark ? "text-emerald-400" : "text-rose-400"}`}
                        >
                          {c.openRate}%
                        </span>
                        {bench && (
                          <MetricDelta
                            value={c.openRate}
                            benchmark={bench.open}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right hidden lg:table-cell">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-bold text-foreground">
                          {c.clickRate}%
                        </span>
                        {bench && (
                          <MetricDelta
                            value={c.clickRate}
                            benchmark={bench.click}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right hidden lg:table-cell">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-bold text-foreground">
                          {c.replyRate}%
                        </span>
                        {bench && (
                          <MetricDelta
                            value={c.replyRate}
                            benchmark={bench.reply}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <FunnelMini
                        sent={c.sent}
                        openRate={c.openRate}
                        clickRate={c.clickRate}
                        replyRate={c.replyRate}
                      />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-bold text-purple-400">
                        {c.conversions}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Niche proof stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(NICHE_BENCHMARKS)
          .slice(0, 4)
          .map(([niche, data]) => (
            <Card key={niche} className="bg-muted/30 border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <BarChart2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {niche}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {data.proof}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

// ─── Re-engage Modal ──────────────────────────────────────────────────────────

const COLD_RESTART_SCRIPTS: Record<
  string,
  { subject: string; preview: string; framework: string }
> = {
  Plumbing: {
    subject: "Still looking for a plumbing solution, {{first_name}}?",
    preview:
      "One question — and an honest answer that might save you $1,200 this month.",
    framework: "Sugarman slippery slope",
  },
  "Med Spa": {
    subject: "We saved a spot for you — expires Friday",
    preview:
      "The results you wanted are still available. But Friday is the cutoff.",
    framework: "Kennedy urgency + scarcity",
  },
  HVAC: {
    subject:
      "Honest question, {{first_name}} — still struggling with slow season?",
    preview:
      "I wasn't going to reach out again. But I just saw something that made me think of you.",
    framework: "Brunson empathy bridge",
  },
  Restoration: {
    subject: "The insurance job you could've had — it went to someone else",
    preview: "That's not a criticism. It's a statistic. Here's how to flip it.",
    framework: "Hopkins reason why",
  },
  "Carpet Cleaning": {
    subject: "{{first_name}}, your Q4 rebooking window closes in 3 weeks",
    preview:
      "The clients who don't hear from you are booking your competitors. Right now.",
    framework: "Halbert specificity",
  },
  Roofing: {
    subject: "Storm season just moved up. Are you ready, {{first_name}}?",
    preview:
      "This isn't a sales pitch. It's a heads-up from someone watching the radar.",
    framework: "Deiss before/after bridge",
  },
  "Real Estate": {
    subject: "{{first_name}}, the listings are already in your database",
    preview:
      "You don't need new leads. You need a system to close the ones you have.",
    framework: "Hormozi value stack",
  },
  Mortgage: {
    subject:
      "{{first_name}}, your referral partners sent 3 deals somewhere else last week",
    preview:
      "That's not a guess. That's what happens without a consistent follow-up system.",
    framework: "Kennedy direct response",
  },
  Chiropractic: {
    subject: "Still thinking it over, {{first_name}}?",
    preview:
      "47% of former patients who don't hear from you go to a competitor within 90 days.",
    framework: "Schwartz awareness level",
  },
  Dental: {
    subject: "{{first_name}}, every no-show costs your practice $320",
    preview:
      "You've already absorbed the cost. Here's how to stop it going forward.",
    framework: "Hopkins reason why",
  },
};

export function ReEngageModal({
  prospect,
  open,
  onClose,
}: {
  prospect: { name: string; niche: string; currentStep: number } | null;
  open: boolean;
  onClose: () => void;
}) {
  const [restartFrom, setRestartFrom] = useState<
    "email1" | "cold-restart" | "custom"
  >("cold-restart");
  if (!prospect) return null;
  const script =
    COLD_RESTART_SCRIPTS[prospect.niche] ?? COLD_RESTART_SCRIPTS.Plumbing;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" data-ocid="campaigns.reengage.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Re-Engage: {prospect.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg p-3 text-xs text-muted-foreground">
            This lead went cold after email {prospect.currentStep}. Select where
            to restart their sequence.
          </div>

          <div className="space-y-2">
            {[
              {
                value: "email1",
                label: "Restart from Email 1",
                desc: "Full 9-touch sequence from the beginning",
              },
              {
                value: "cold-restart",
                label: "Cold Restart Sequence",
                desc: `Pre-written re-engagement script for ${prospect.niche}`,
              },
              {
                value: "custom",
                label: "Custom re-engagement sequence",
                desc: "Write your own restart message",
              },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRestartFrom(opt.value as typeof restartFrom)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${restartFrom === opt.value ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:border-primary/20"}`}
                data-ocid={`campaigns.reengage.${opt.value}.radio`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${restartFrom === opt.value ? "border-primary" : "border-muted-foreground"}`}
                  >
                    {restartFrom === opt.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {opt.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-5.5">
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>

          {restartFrom === "cold-restart" && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/20">
                  {script.framework}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Pre-built for {prospect.niche}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground">
                Subject: {script.subject}
              </p>
              <p className="text-xs text-muted-foreground italic">
                "{script.preview}"
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="campaigns.reengage.cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                toast.success(
                  `Sequence restarted — ${prospect.name} will receive ${restartFrom === "email1" ? "Email 1" : "cold restart"} at next send time`,
                );
                onClose();
              }}
              data-ocid="campaigns.reengage.confirm_button"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Restart Sequence
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ColdSequenceManagerTab() {
  const [enrollments, setEnrollments] =
    useState<SequenceEnrollment[]>(MOCK_ENROLLMENTS);
  const [filterNiche, setFilterNiche] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTouch, setFilterTouch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showBulkEnroll, setShowBulkEnroll] = useState(false);
  const [confirmStop, setConfirmStop] = useState<string | null>(null);

  const filtered = enrollments.filter((e) => {
    if (filterNiche && e.niche !== filterNiche) return false;
    if (filterStatus && e.status !== filterStatus) return false;
    if (filterTouch && String(e.currentTouchIndex) !== filterTouch)
      return false;
    return true;
  });

  const updateStatus = (
    id: string,
    newStatus: SequenceEnrollment["status"],
    stopReason?: SequenceEnrollment["stopReason"],
  ) => {
    setEnrollments((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: newStatus, stopReason } : e,
      ),
    );
  };

  return (
    <div className="space-y-6" data-ocid="campaigns.seq_manager.section">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          <Select value={filterNiche} onValueChange={setFilterNiche}>
            <SelectTrigger
              className="h-8 text-xs w-36"
              data-ocid="campaigns.seq_manager.niche_filter"
            >
              <SelectValue placeholder="All Niches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Niches</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="medspa">Med Spa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger
              className="h-8 text-xs w-36"
              data-ocid="campaigns.seq_manager.status_filter"
            >
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTouch} onValueChange={setFilterTouch}>
            <SelectTrigger className="h-8 text-xs w-28">
              <SelectValue placeholder="Any Touch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Touch</SelectItem>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  Touch {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          size="sm"
          onClick={() => setShowBulkEnroll(true)}
          data-ocid="campaigns.seq_manager.bulk_enroll_button"
        >
          <Users className="h-4 w-4 mr-2" />
          Bulk Enroll
        </Button>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Lead / Business
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Niche
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  Sequence
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Touch
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">
                  Next Send
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((enr, i) => (
                <>
                  <tr
                    key={enr.id}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`campaigns.enrollment.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expandedId === enr.id ? null : enr.id)
                        }
                        className="text-left"
                      >
                        <p className="font-medium text-foreground text-xs">
                          {enr.leadName}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          {enr.businessName}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          {enr.city}
                        </p>
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="outline" className="text-xs capitalize">
                        {enr.niche}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                      {enr.sequenceId === "plumbing-cold-sequence"
                        ? "Plumber"
                        : "Med Spa"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`text-xs border ${enrollmentStatusBadge(enr.status)}`}
                      >
                        {enr.status}
                      </Badge>
                      {enr.stopReason && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {enr.stopReason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      T{enr.currentTouchIndex}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden xl:table-cell">
                      {enr.nextSendAt
                        ? new Date(enr.nextSendAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {enr.status === "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-amber-400 hover:text-amber-300"
                            onClick={() => updateStatus(enr.id, "paused")}
                            title="Pause"
                            data-ocid={`campaigns.enrollment.${i + 1}.pause_button`}
                          >
                            <Pause className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {enr.status === "paused" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-emerald-400 hover:text-emerald-300"
                            onClick={() => updateStatus(enr.id, "active")}
                            title="Resume"
                            data-ocid={`campaigns.enrollment.${i + 1}.resume_button`}
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {(enr.status === "active" ||
                          enr.status === "paused") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-rose-400 hover:text-rose-300"
                            onClick={() => setConfirmStop(enr.id)}
                            title="Stop"
                            data-ocid={`campaigns.enrollment.${i + 1}.stop_button`}
                          >
                            <Square className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            setExpandedId(expandedId === enr.id ? null : enr.id)
                          }
                          title="Events"
                          data-ocid={`campaigns.enrollment.${i + 1}.events_button`}
                        >
                          <Activity className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === enr.id && (
                    <tr key={`${enr.id}-events`} className="bg-muted/10">
                      <td colSpan={7} className="px-6 py-3">
                        <p className="text-xs font-semibold text-foreground mb-2">
                          Event Timeline — {enr.events.length} events
                        </p>
                        <div className="space-y-1">
                          {enr.events.map((ev) => (
                            <div
                              key={ev.id}
                              className="flex items-center gap-3 text-xs"
                            >
                              <span>{eventIcon(ev.type)}</span>
                              <span className="text-foreground font-medium capitalize">
                                {ev.type.replace("_", " ")}
                              </span>
                              {ev.touchNumber && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] py-0"
                                >
                                  Touch {ev.touchNumber}
                                </Badge>
                              )}
                              <span className="text-muted-foreground">
                                {new Date(ev.timestamp).toLocaleString()}
                              </span>
                              {ev.metadata &&
                                Object.entries(ev.metadata).map(([k, v]) => (
                                  <span
                                    key={k}
                                    className="text-muted-foreground"
                                  >
                                    {k}: {v}
                                  </span>
                                ))}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                    data-ocid="campaigns.enrollment.empty_state"
                  >
                    No enrollments match filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AuditTripwirePanel />

      {/* Confirm stop dialog */}
      <Dialog open={!!confirmStop} onOpenChange={() => setConfirmStop(null)}>
        <DialogContent data-ocid="campaigns.stop_confirm.dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
              Stop Sequence?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently stop the enrollment. The prospect will no
            longer receive any emails from this sequence.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmStop(null)}
              data-ocid="campaigns.stop_confirm.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmStop) {
                  updateStatus(confirmStop, "stopped", "manual");
                  setConfirmStop(null);
                  toast.success("Sequence stopped");
                }
              }}
              data-ocid="campaigns.stop_confirm.confirm_button"
            >
              Stop Sequence
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Enroll Modal */}
      <Dialog open={showBulkEnroll} onOpenChange={setShowBulkEnroll}>
        <DialogContent data-ocid="campaigns.bulk_enroll.dialog">
          <DialogHeader>
            <DialogTitle>Bulk Enroll Leads</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Select Niche</Label>
              <Select>
                <SelectTrigger
                  className="mt-1"
                  data-ocid="campaigns.bulk_enroll.niche_select"
                >
                  <SelectValue placeholder="Choose niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="medspa">Med Spa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select Sequence</Label>
              <Select>
                <SelectTrigger
                  className="mt-1"
                  data-ocid="campaigns.bulk_enroll.sequence_select"
                >
                  <SelectValue placeholder="Choose sequence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing-cold-sequence">
                    Plumber 5-Touch
                  </SelectItem>
                  <SelectItem value="medspa-cold-sequence">
                    Med Spa 5-Touch
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Leads already enrolled or suppressed will be automatically
              excluded.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBulkEnroll(false)}
              data-ocid="campaigns.bulk_enroll.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success(
                  "Bulk enrollment started — 0 new leads added (connect CRM to enroll real leads)",
                );
                setShowBulkEnroll(false);
              }}
              data-ocid="campaigns.bulk_enroll.confirm_button"
            >
              Start Enrollment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── NEW: PerformanceDashboardTab ─────────────────────────────────────────────

function BarChartRow({
  label,
  value,
  max,
  color,
}: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-20 flex-shrink-0 text-right">
        {label}
      </span>
      <div className="flex-1 bg-muted/40 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-foreground w-8 text-right">
        {value}
      </span>
    </div>
  );
}

function PerformanceDashboardTab() {
  const allPerf = SEQUENCE_PERFORMANCE;
  const combined = {
    totalEnrolled: allPerf.reduce((s, p) => s + p.totalEnrolled, 0),
    totalSent: allPerf.reduce((s, p) => s + p.totalSent, 0),
    avgOpenRate: Math.round(
      allPerf.reduce((s, p) => s + p.openRate, 0) / allPerf.length,
    ),
    avgClickRate: Math.round(
      allPerf.reduce((s, p) => s + p.clickRate, 0) / allPerf.length,
    ),
    avgAuditRate: Math.round(
      allPerf.reduce((s, p) => s + p.auditCompletionRate, 0) / allPerf.length,
    ),
    avgDemoRate: Math.round(
      allPerf.reduce((s, p) => s + p.demoVisitRate, 0) / allPerf.length,
    ),
    avgReplyRate: Math.round(
      allPerf.reduce((s, p) => s + p.replyRate, 0) / allPerf.length,
    ),
  };

  const maxWeekly = Math.max(...WEEKLY_CHART_DATA.map((w) => w.enrolled));

  return (
    <div className="space-y-6" data-ocid="campaigns.performance.section">
      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          ["Total Enrolled", combined.totalEnrolled, "text-foreground"],
          ["Total Sent", combined.totalSent, "text-foreground"],
          ["Avg Open Rate", `${combined.avgOpenRate}%`, "text-blue-400"],
          ["Avg Click Rate", `${combined.avgClickRate}%`, "text-emerald-400"],
          ["Audit Completion", `${combined.avgAuditRate}%`, "text-amber-400"],
          ["Demo Visit Rate", `${combined.avgDemoRate}%`, "text-purple-400"],
          ["Avg Reply Rate", `${combined.avgReplyRate}%`, "text-rose-400"],
        ].map(([label, value, color]) => (
          <Card key={String(label)} className="bg-card border-border">
            <CardContent className="p-3 text-center">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                {label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per-niche comparison */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Per-Niche Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left pb-2 font-medium text-muted-foreground">
                      Niche
                    </th>
                    <th className="px-2 pb-2 font-medium text-muted-foreground">
                      Open
                    </th>
                    <th className="px-2 pb-2 font-medium text-muted-foreground">
                      Click
                    </th>
                    <th className="px-2 pb-2 font-medium text-muted-foreground">
                      Audit
                    </th>
                    <th className="px-2 pb-2 font-medium text-muted-foreground">
                      Demo
                    </th>
                    <th className="px-2 pb-2 font-medium text-muted-foreground">
                      Reply
                    </th>
                    <th className="px-2 pb-2 font-medium text-muted-foreground">
                      Conv.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allPerf.map((p) => (
                    <tr key={p.sequenceId}>
                      <td className="py-2 font-medium text-foreground capitalize">
                        {p.niche === "medspa" ? "Med Spa" : p.niche}
                      </td>
                      <td
                        className={`px-2 py-2 text-center font-medium ${metricCell(p.openRate, 30, 20)}`}
                      >
                        {p.openRate}%
                      </td>
                      <td
                        className={`px-2 py-2 text-center font-medium ${metricCell(p.clickRate, 12, 8)}`}
                      >
                        {p.clickRate}%
                      </td>
                      <td
                        className={`px-2 py-2 text-center font-medium ${metricCell(p.auditCompletionRate, 20, 12)}`}
                      >
                        {p.auditCompletionRate}%
                      </td>
                      <td
                        className={`px-2 py-2 text-center font-medium ${metricCell(p.demoVisitRate, 15, 8)}`}
                      >
                        {p.demoVisitRate}%
                      </td>
                      <td
                        className={`px-2 py-2 text-center font-medium ${metricCell(p.replyRate, 6, 3)}`}
                      >
                        {p.replyRate}%
                      </td>
                      <td
                        className={`px-2 py-2 text-center font-medium ${metricCell(p.conversionRate, 4, 2)}`}
                      >
                        {p.conversionRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-muted-foreground mt-2">
                🟢 Good &nbsp;🟡 Average &nbsp;🔴 Below Average
              </p>
            </div>
          </CardContent>
        </Card>

        {/* UTM Attribution */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">UTM Attribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">
                Audit Starts by Touch
              </p>
              <div className="space-y-2">
                {UTM_ATTRIBUTION_DATA.map((row) => (
                  <BarChartRow
                    key={row.touchLabel}
                    label={row.touchLabel.substring(0, 18)}
                    value={row.auditStarts}
                    max={Math.max(
                      ...UTM_ATTRIBUTION_DATA.map((r) => r.auditStarts),
                    )}
                    color="bg-emerald-500/70"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">
                Demo Visits by Touch
              </p>
              <div className="space-y-2">
                {UTM_ATTRIBUTION_DATA.map((row) => (
                  <BarChartRow
                    key={row.touchLabel}
                    label={row.touchLabel.substring(0, 18)}
                    value={row.demoVisits}
                    max={Math.max(
                      ...UTM_ATTRIBUTION_DATA.map((r) => r.demoVisits),
                    )}
                    color="bg-purple-500/70"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-touch table — Plumbing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allPerf.map((perf) => (
          <Card key={perf.sequenceId} className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm capitalize">
                {perf.niche === "medspa" ? "Med Spa" : perf.niche} — Touch
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left pb-2 font-medium text-muted-foreground">
                        Touch
                      </th>
                      <th className="text-left pb-2 font-medium text-muted-foreground">
                        Framework
                      </th>
                      <th className="px-2 pb-2 font-medium text-muted-foreground">
                        Sent
                      </th>
                      <th className="px-2 pb-2 font-medium text-muted-foreground">
                        Open
                      </th>
                      <th className="px-2 pb-2 font-medium text-muted-foreground">
                        Click
                      </th>
                      <th className="px-2 pb-2 font-medium text-muted-foreground">
                        Reply
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {perf.touchPerformance.map((tp) => (
                      <tr
                        key={tp.touchId}
                        className={tp.isHighlighted ? "bg-amber-500/5" : ""}
                      >
                        <td className="py-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-bold text-primary">
                                {tp.touchNumber}
                              </span>
                            </div>
                            {tp.isHighlighted && (
                              <span className="text-[10px] text-amber-400">
                                ⭐ Best
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {tp.framework}
                        </td>
                        <td className="px-2 py-2 text-center text-foreground">
                          {tp.sent}
                        </td>
                        <td
                          className={`px-2 py-2 text-center font-medium ${metricCell(tp.openRate, 30, 20)}`}
                        >
                          {tp.openRate}%
                        </td>
                        <td
                          className={`px-2 py-2 text-center font-medium ${metricCell(tp.clickRate, 12, 8)}`}
                        >
                          {tp.clickRate}%
                        </td>
                        <td
                          className={`px-2 py-2 text-center font-medium ${tp.isHighlighted ? "text-amber-400 font-bold" : metricCell(tp.replyRate, 6, 3)}`}
                        >
                          {tp.replyRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-muted-foreground mt-2">
                  ⭐ Kennedy break-up email consistently drives the highest
                  reply rate
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly time-series chart */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            Weekly Volume (4 Weeks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {WEEKLY_CHART_DATA.map((week) => (
              <div key={week.week}>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {week.week}
                </p>
                <div className="space-y-1.5">
                  <BarChartRow
                    label="Enrolled"
                    value={week.enrolled}
                    max={maxWeekly}
                    color="bg-primary/60"
                  />
                  <BarChartRow
                    label="Sent"
                    value={week.sent}
                    max={200}
                    color="bg-blue-500/60"
                  />
                  <BarChartRow
                    label="Opened"
                    value={week.opened}
                    max={70}
                    color="bg-emerald-500/60"
                  />
                  <BarChartRow
                    label="Clicked"
                    value={week.clicked}
                    max={30}
                    color="bg-amber-500/60"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 flex-wrap">
            {[
              ["Enrolled", "bg-primary/60"],
              ["Sent", "bg-blue-500/60"],
              ["Opened", "bg-emerald-500/60"],
              ["Clicked", "bg-amber-500/60"],
            ].map(([label, color]) => (
              <div
                key={String(label)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                {label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── NEW: WarmSequencesTab ────────────────────────────────────────────────────

// ─── Warm Email Settings Panel ────────────────────────────────────────────────

function WarmEmailSettingsPanel() {
  const [warmEmailEnabled, setWarmEmailEnabled] = useState(true);

  return (
    <Card
      className="bg-card border-border"
      data-ocid="campaigns.warm.email_settings.panel"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" />
          Warm Email Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider row */}
        <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
          <div className="flex items-start gap-3">
            <EmailProviderBadge type="warm" />
            <div>
              <p className="text-xs font-medium text-foreground">
                Caffeine Native Email — active
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Warm sequences send through Caffeine's managed email
                infrastructure. All recipients have opted in via audit
                completion or demo visit.
              </p>
            </div>
          </div>
          <Switch
            checked={warmEmailEnabled}
            onCheckedChange={(v) => {
              setWarmEmailEnabled(v);
              toast.success(
                v
                  ? "Warm email sequences enabled"
                  : "Warm email sequences paused",
              );
            }}
            data-ocid="campaigns.warm.email_settings.enabled_toggle"
          />
        </div>

        {/* Allowed recipients */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">
            Allowed Recipients
          </p>
          {[
            {
              label: "Audit completers",
              desc: "Prospects who completed the free 3-stage audit",
              color: "text-emerald-400",
            },
            {
              label: "Demo visitors",
              desc: "Prospects who visited the AI Capabilities or Back Office demo",
              color: "text-blue-400",
            },
            {
              label: "Existing clients",
              desc: "Clients already onboarded to BRF (for reports, alerts, notifications)",
              color: "text-purple-400",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-2 p-2 rounded bg-muted/30"
            >
              <Check
                className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${item.color}`}
              />
              <div>
                <p className="text-xs font-medium text-foreground">
                  {item.label}
                </p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fallback */}
        <div className="p-3 rounded-lg bg-muted/20 border border-border">
          <p className="text-xs font-semibold text-foreground mb-1">
            Fallback Provider
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Listmonk (if configured)
            </Badge>
            <p className="text-[11px] text-muted-foreground">
              If Caffeine native is unavailable, warm sends fall back to your
              Listmonk instance.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          className="w-full"
          onClick={() => toast.success("Warm email settings saved")}
          data-ocid="campaigns.warm.email_settings.save_button"
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}

interface WarmTriggerConfig {
  niche: string;
  autoEnrollOnAudit: boolean;
  autoEnrollOnDemo: boolean;
  bookingUrl: string;
}

function WarmTouchTimeline({ sequence }: { sequence: WarmSequence }) {
  const delayLabels = ["Immediate", "48 hrs", "5 days"];
  const frameworkColors = [
    "border-blue-500/40 bg-blue-500/5 text-blue-400",
    "border-amber-500/40 bg-amber-500/5 text-amber-400",
    "border-purple-500/40 bg-purple-500/5 text-purple-400",
  ];
  return (
    <div className="space-y-2">
      {sequence.touches.map((touch, idx) => (
        <div key={touch.touchNumber} className="flex items-start gap-3">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">
                {touch.touchNumber}
              </span>
            </div>
            {idx < sequence.touches.length - 1 && (
              <div className="w-px h-6 bg-border mt-1" />
            )}
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs text-muted-foreground">
                {delayLabels[idx]}
              </span>
              <Badge
                className={`text-[10px] py-0 border ${frameworkColors[idx]}`}
              >
                {touch.framework}
              </Badge>
              {touch.bookingLinkIncluded && (
                <Badge className="text-[10px] py-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  <CalendarCheck className="h-2.5 w-2.5 mr-1" />
                  Booking Link
                </Badge>
              )}
            </div>
            <p className="text-xs font-medium text-foreground truncate">
              {touch.subject}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
              {touch.bodyTemplate.substring(0, 120)}…
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function WarmSequenceCard({
  sequence,
  enrollments,
}: {
  sequence: WarmSequence;
  enrollments: WarmSequenceEnrollment[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const seqEnrollments = enrollments.filter(
    (e) => e.warmSequenceId === sequence.id,
  );
  const active = seqEnrollments.filter((e) => e.status === "active").length;
  const converted = seqEnrollments.filter(
    (e) => e.status === "converted",
  ).length;
  const conversionRate =
    seqEnrollments.length > 0
      ? Math.round((converted / seqEnrollments.length) * 100)
      : 0;

  const nicheLabel = sequence.niche === "medspa" ? "Med Spa" : "Plumbing";
  const nicheColor =
    sequence.niche === "medspa"
      ? "bg-pink-500/10 text-pink-400 border-pink-500/20"
      : "bg-blue-500/10 text-blue-400 border-blue-500/20";

  return (
    <Card
      className="bg-card border-border"
      data-ocid={`campaigns.warm.${sequence.niche}.card`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge className={`text-xs border ${nicheColor}`}>
                {nicheLabel}
              </Badge>
              <Badge className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                3-Touch Warm
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground text-sm">
              {sequence.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {sequence.description}
            </p>
          </div>
          <Flame className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            {
              label: "Enrolled",
              value: seqEnrollments.length,
              color: "text-foreground",
            },
            { label: "Active", value: active, color: "text-blue-400" },
            {
              label: "Conv. Rate",
              value: `${conversionRate}%`,
              color: "text-emerald-400",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-muted/40 rounded-lg p-2.5 text-center border border-border"
            >
              <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <GitMerge className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Triggers</span>
          </div>
          <div className="flex gap-2">
            {sequence.triggerEvents.map((trigger) => (
              <Badge
                key={trigger}
                variant="outline"
                className="text-[10px] capitalize"
              >
                {trigger === "audit_completed"
                  ? "Audit Completed"
                  : "Demo Visited"}
              </Badge>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          data-ocid={`campaigns.warm.${sequence.niche}.toggle`}
        >
          <span>Touch Timeline Preview</span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-border">
            <WarmTouchTimeline sequence={sequence} />
            <div className="mt-3 pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground mb-1">
                Booking URL
              </p>
              <p className="text-[11px] font-mono text-foreground bg-muted/40 rounded px-2 py-1 truncate">
                {sequence.bookingUrl}
              </p>
            </div>
          </div>
        )}

        {/* Send Sequence button — fires via Caffeine native email */}
        <div className="flex items-center gap-2 pt-4 mt-2 border-t border-border">
          <EmailProviderBadge type="warm" />
          <Button
            size="sm"
            variant="outline"
            className="ml-auto"
            onClick={() => setShowSendModal(true)}
            data-ocid={`campaigns.warm.${sequence.niche}.send_sequence_button`}
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Send Sequence
          </Button>
        </div>
      </CardContent>

      {/* Warm Email Preview Modal */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent
          className="max-w-xl max-h-[85vh] overflow-y-auto"
          data-ocid={`campaigns.warm.${sequence.niche}.send_modal`}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-emerald-400" />
              Send Warm Sequence — {sequence.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
              <EmailProviderBadge type="warm" />
              <p className="text-xs text-muted-foreground">
                This sequence is sent via Caffeine native email. All recipients
                are opted-in contacts.
              </p>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-medium">To:</span>
                  <span className="text-foreground">
                    Opted-in prospects (
                    {seqEnrollments.filter((e) => e.status === "active").length}{" "}
                    active)
                  </span>
                </div>
                <div className="border-t border-border pt-2 space-y-2">
                  {sequence.touches.map((touch) => (
                    <div
                      key={touch.touchNumber}
                      className="flex items-start gap-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold text-primary">
                          {touch.touchNumber}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {fillTokens(touch.subject)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Delay:{" "}
                          {touch.delayHours === 0
                            ? "Immediate"
                            : `${touch.delayHours}h`}
                          {touch.bookingLinkIncluded &&
                            " · Includes booking link"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSendModal(false)}
                data-ocid={`campaigns.warm.${sequence.niche}.send_modal.cancel_button`}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setShowSendModal(false);
                  toast.success(
                    `Warm sequence queued via Caffeine native email for ${sequence.name}`,
                  );
                }}
                data-ocid={`campaigns.warm.${sequence.niche}.send_modal.confirm_button`}
              >
                <Send className="h-3.5 w-3.5 mr-2" />
                Send via Caffeine Native
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function WarmSequencesTab() {
  const [enrollments, setEnrollments] =
    useState<WarmSequenceEnrollment[]>(ALL_WARM_ENROLLMENTS);
  const [handoffEvents] = useState<WarmLeadHandoff[]>(WARM_HANDOFF_EVENTS);
  const [triggerConfigs, setTriggerConfigs] = useState<WarmTriggerConfig[]>([
    {
      niche: "plumbing",
      autoEnrollOnAudit: true,
      autoEnrollOnDemo: true,
      bookingUrl: "https://cal.com/brf/plumber-strategy",
    },
    {
      niche: "medspa",
      autoEnrollOnAudit: true,
      autoEnrollOnDemo: false,
      bookingUrl: "https://cal.com/brf/medspa-strategy",
    },
  ]);
  const [filterNiche, setFilterNiche] = useState("");

  const filteredEvents = handoffEvents.filter(
    (e) => !filterNiche || e.niche === filterNiche,
  );

  const updateTrigger = (
    niche: string,
    field: keyof WarmTriggerConfig,
    value: boolean | string,
  ) => {
    setTriggerConfigs((prev) =>
      prev.map((c) => (c.niche === niche ? { ...c, [field]: value } : c)),
    );
  };

  const triggerLabel = (trigger: string) =>
    trigger === "audit_completed" ? "Audit Completed" : "Demo Visited";

  const triggerColor = (trigger: string) =>
    trigger === "audit_completed"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-blue-500/10 text-blue-400 border-blue-500/20";

  const enrollStatusColor = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      converted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      stopped: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };
    return map[status] ?? "bg-muted/40 text-muted-foreground";
  };

  return (
    <div className="space-y-8" data-ocid="campaigns.warm_sequences.section">
      {/* Warm Sequence Cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-4 w-4 text-amber-400" />
          <h3 className="font-semibold text-foreground">
            Active Warm Sequences
          </h3>
          <Badge className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/20">
            {WARM_SEQUENCES.length} Niches
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WARM_SEQUENCES.map((seq) => (
            <WarmSequenceCard
              key={seq.id}
              sequence={seq}
              enrollments={enrollments}
            />
          ))}
        </div>
      </div>

      {/* Handoff Trigger Config */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <GitMerge className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">
            Handoff Trigger Configuration
          </h3>
          <p className="text-xs text-muted-foreground">
            — auto-enroll leads from cold → warm per niche
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {triggerConfigs.map((config) => (
            <Card
              key={config.niche}
              className="bg-card border-border"
              data-ocid={`campaigns.warm.triggers.${config.niche}.card`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="capitalize">
                    {config.niche === "medspa" ? "Med Spa" : config.niche}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    — Trigger Settings
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs text-foreground">
                      Auto-enroll on Audit Completion
                    </Label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      When a prospect completes the free audit, remove from cold
                      sequence and start warm
                    </p>
                  </div>
                  <Switch
                    checked={config.autoEnrollOnAudit}
                    onCheckedChange={(v) => {
                      updateTrigger(config.niche, "autoEnrollOnAudit", v);
                      toast.success(
                        v ? "Audit trigger enabled" : "Audit trigger disabled",
                      );
                    }}
                    data-ocid={`campaigns.warm.triggers.${config.niche}.audit_toggle`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs text-foreground">
                      Auto-enroll on Demo Visit
                    </Label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      When a prospect visits any demo page, remove from cold and
                      start warm sequence
                    </p>
                  </div>
                  <Switch
                    checked={config.autoEnrollOnDemo}
                    onCheckedChange={(v) => {
                      updateTrigger(config.niche, "autoEnrollOnDemo", v);
                      toast.success(
                        v ? "Demo trigger enabled" : "Demo trigger disabled",
                      );
                    }}
                    data-ocid={`campaigns.warm.triggers.${config.niche}.demo_toggle`}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Booking URL (embedded in all 3 touches)
                  </Label>
                  <Input
                    value={config.bookingUrl}
                    onChange={(e) =>
                      updateTrigger(config.niche, "bookingUrl", e.target.value)
                    }
                    className="mt-1 h-8 text-xs font-mono"
                    data-ocid={`campaigns.warm.triggers.${config.niche}.booking_url_input`}
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    toast.success(
                      `${config.niche === "medspa" ? "Med Spa" : "Plumber"} trigger config saved`,
                    )
                  }
                  data-ocid={`campaigns.warm.triggers.${config.niche}.save_button`}
                >
                  Save Config
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ─── Warm Email Settings Panel ─────────────────────────────── */}
      <WarmEmailSettingsPanel />

      {/* Warm Enrollment Events Table */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">
              Warm Enrollment Events
            </h3>
            <Badge variant="outline" className="text-xs">
              {handoffEvents.length} Handoffs
            </Badge>
          </div>
          <Select value={filterNiche} onValueChange={setFilterNiche}>
            <SelectTrigger
              className="h-8 text-xs w-36"
              data-ocid="campaigns.warm.events.niche_filter"
            >
              <SelectValue placeholder="All Niches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Niches</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="medspa">Med Spa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Lead / Business
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                    Niche
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Trigger
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                    Audit Scores
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">
                    Timestamp
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEvents.map((ev, i) => {
                  const warmEnrollment = enrollments.find(
                    (e) => e.leadId === ev.leadId,
                  );
                  return (
                    <tr
                      key={`${ev.leadId}-${ev.handoffTimestamp}`}
                      className="hover:bg-muted/20 transition-colors"
                      data-ocid={`campaigns.warm.event.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground text-xs">
                          {ev.leadName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {ev.businessName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {ev.city}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant="outline" className="text-xs capitalize">
                          {ev.niche === "medspa" ? "Med Spa" : ev.niche}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs border ${triggerColor(ev.handoffTrigger)}`}
                        >
                          {triggerLabel(ev.handoffTrigger)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {ev.auditScores ? (
                          <div className="flex gap-2 text-[11px]">
                            <span className="text-blue-400">
                              SEO {ev.auditScores.seoScore}
                            </span>
                            <span className="text-purple-400">
                              Rep {ev.auditScores.reputationScore}
                            </span>
                            <span className="text-amber-400">
                              Web {ev.auditScores.websiteScore}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            Demo only
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted-foreground hidden xl:table-cell">
                        {new Date(ev.handoffTimestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {warmEnrollment ? (
                          <Badge
                            className={`text-xs border ${enrollStatusColor(warmEnrollment.status)}`}
                          >
                            T{warmEnrollment.currentTouchIndex} ·{" "}
                            {warmEnrollment.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground text-sm"
                      data-ocid="campaigns.warm.events.empty_state"
                    >
                      No handoff events match filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Active Warm Enrollments Table */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">
            Active Warm Enrollments
          </h3>
          <Badge variant="outline" className="text-xs">
            {enrollments.filter((e) => e.status === "active").length} Active
          </Badge>
        </div>
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Lead
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                    Niche
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Touch
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                    Next Send
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enrollments.map((enr, i) => (
                  <tr
                    key={enr.id}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`campaigns.warm.enrollment.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground text-xs">
                        {enr.leadName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {enr.businessName}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="outline" className="text-xs capitalize">
                        {enr.niche === "medspa" ? "Med Spa" : enr.niche}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">
                          {enr.currentTouchIndex}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`text-xs border ${enrollStatusColor(enr.status)}`}
                      >
                        {enr.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-muted-foreground hidden lg:table-cell">
                      {enr.nextSendAt
                        ? new Date(enr.nextSendAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {enr.status === "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-amber-400 hover:text-amber-300"
                            onClick={() => {
                              setEnrollments((prev) =>
                                prev.map((e) =>
                                  e.id === enr.id
                                    ? { ...e, status: "paused" }
                                    : e,
                                ),
                              );
                              toast.success("Warm sequence paused");
                            }}
                            title="Pause"
                            data-ocid={`campaigns.warm.enrollment.${i + 1}.pause_button`}
                          >
                            <Pause className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {enr.status === "paused" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-emerald-400 hover:text-emerald-300"
                            onClick={() => {
                              setEnrollments((prev) =>
                                prev.map((e) =>
                                  e.id === enr.id
                                    ? { ...e, status: "active" }
                                    : e,
                                ),
                              );
                              toast.success("Warm sequence resumed");
                            }}
                            title="Resume"
                            data-ocid={`campaigns.warm.enrollment.${i + 1}.resume_button`}
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-purple-400 hover:text-purple-300"
                          onClick={() => {
                            setEnrollments((prev) =>
                              prev.map((e) =>
                                e.id === enr.id
                                  ? { ...e, status: "converted" }
                                  : e,
                              ),
                            );
                            toast.success(
                              `${enr.leadName} marked as converted`,
                            );
                          }}
                          title="Mark Converted"
                          data-ocid={`campaigns.warm.enrollment.${i + 1}.convert_button`}
                        >
                          <TrendingUp className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground text-sm"
                      data-ocid="campaigns.warm.enrollment.empty_state"
                    >
                      No warm enrollments yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── NEW: Preloaded Library Tab ───────────────────────────────────────────────

const NICHE_META: Record<string, { label: string; color: string }> = {
  plumbing: {
    label: "Plumbing",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  medspa: {
    label: "Med Spa",
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  hvac: {
    label: "HVAC",
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  restoration: {
    label: "Restoration",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  "carpet-cleaning": {
    label: "Carpet Cleaning",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  roofing: {
    label: "Roofing",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  "real-estate": {
    label: "Real Estate",
    color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  mortgage: {
    label: "Mortgage",
    color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  chiropractor: {
    label: "Chiropractor",
    color: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
  dental: {
    label: "Dental",
    color: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  Plumbing: {
    label: "Plumbing",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "Med Spa": {
    label: "Med Spa",
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  HVAC: {
    label: "HVAC",
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  Restoration: {
    label: "Restoration",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  "Carpet Cleaning": {
    label: "Carpet Cleaning",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  Roofing: {
    label: "Roofing",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  "Real Estate": {
    label: "Real Estate",
    color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  Mortgage: {
    label: "Mortgage",
    color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  Chiropractor: {
    label: "Chiropractor",
    color: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
  Dental: {
    label: "Dental",
    color: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
};

function nicheMeta(niche: string) {
  return (
    NICHE_META[niche] ?? {
      label: niche,
      color: "bg-muted text-muted-foreground border-border",
    }
  );
}

const CAMPAIGN_TYPE_META: Record<string, { label: string; color: string }> = {
  onboarding: {
    label: "Onboarding",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  "mid-journey": {
    label: "Mid-Journey",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "re-engagement": {
    label: "Re-engagement",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  "cold-email": {
    label: "Cold Email",
    color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
};

function campaignTypeMeta(name: string) {
  if (
    name.toLowerCase().includes("onboard") ||
    name.toLowerCase().includes("new client")
  )
    return CAMPAIGN_TYPE_META.onboarding;
  if (
    name.toLowerCase().includes("re-engage") ||
    name.toLowerCase().includes("re-activation") ||
    name.toLowerCase().includes("win-back")
  )
    return CAMPAIGN_TYPE_META["re-engagement"];
  return CAMPAIGN_TYPE_META["mid-journey"];
}

interface CustomCampaignEntry {
  id: string;
  sourceName: string;
  niche: string;
  type: "cold-email" | "onboarding" | "mid-journey" | "re-engagement";
  emailCount: number;
  createdAt: string;
  touches: EmailTouch[];
  steps: CampaignStep[];
}

interface CloneModalState {
  open: boolean;
  name: string;
  niche: string;
  emailCount: number;
  previewSubject: string;
  touches: EmailTouch[];
  steps: CampaignStep[];
  type: CustomCampaignEntry["type"];
}

function CloneModal({
  state,
  onClose,
  onClone,
}: {
  state: CloneModalState;
  onClose: () => void;
  onClone: (entry: CustomCampaignEntry) => void;
}) {
  const handleClone = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const meta = nicheMeta(state.niche);
    const typeMeta =
      CAMPAIGN_TYPE_META[state.type] ?? CAMPAIGN_TYPE_META["mid-journey"];
    onClone({
      id: `custom-${Date.now()}`,
      sourceName: `${meta.label} — ${typeMeta.label} — Custom ${dateStr}`,
      niche: state.niche,
      type: state.type,
      emailCount: state.emailCount,
      createdAt: now.toISOString(),
      touches: state.touches,
      steps: state.steps,
    });
    toast.success("Campaign cloned! Find it in My Custom Campaigns.");
    onClose();
  };

  return (
    <Dialog open={state.open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="campaigns.clone.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-primary" />
            Clone This Campaign
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                className={`text-xs border ${nicheMeta(state.niche).color}`}
              >
                {nicheMeta(state.niche).label}
              </Badge>
              <Badge
                className={`text-xs border ${(CAMPAIGN_TYPE_META[state.type] ?? CAMPAIGN_TYPE_META["mid-journey"]).color}`}
              >
                {
                  (
                    CAMPAIGN_TYPE_META[state.type] ??
                    CAMPAIGN_TYPE_META["mid-journey"]
                  ).label
                }
              </Badge>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {state.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {state.emailCount} email{state.emailCount !== 1 ? "s" : ""} in
              this sequence
            </p>
            {state.previewSubject && (
              <div className="bg-background rounded border border-border p-2 mt-2">
                <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">
                  First Email Subject
                </p>
                <p className="text-xs text-foreground italic">
                  "{state.previewSubject}"
                </p>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="font-medium text-foreground mb-1">
              What happens next?
            </p>
            <p>
              A fully editable copy is created in{" "}
              <strong className="text-primary">My Custom Campaigns</strong>. The
              original master template stays untouched.
            </p>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="campaigns.clone.cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleClone}
              data-ocid="campaigns.clone.confirm_button"
            >
              <Copy className="h-4 w-4 mr-2" />
              Clone & Customize
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PreloadedLibraryTab({
  onClone,
}: {
  onClone: (entry: CustomCampaignEntry) => void;
}) {
  const { isAdmin, isAdminUser, demoInfo, currentTenantId, tenants } = useApp();
  const showAdmin = isAdmin || isAdminUser;
  const isDemoUser = !isAdmin && !isAdminUser && demoInfo !== null;

  // Determine user's assigned niche for filtering
  const currentTenant = tenants.find((t) => t.id === currentTenantId);
  const userNicheRaw = demoInfo?.niche ?? currentTenant?.type ?? "";
  const userNicheLower = userNicheRaw.toLowerCase().replace(/\s+/g, "-");

  // Map common tenant type strings to niche keys
  const nicheKeyMap: Record<string, string> = {
    plumbing: "plumbing",
    "plumbing company": "plumbing",
    "med spa": "medspa",
    medspa: "medspa",
    hvac: "hvac",
    roofing: "roofing",
    restoration: "restoration",
    "carpet cleaning": "carpet-cleaning",
    "real estate": "real-estate",
    "real estate agents": "real-estate",
    "real estate agent": "real-estate",
    mortgage: "mortgage",
    chiropractor: "chiropractor",
    chiropractic: "chiropractor",
    dental: "dental",
    "dental practice": "dental",
  };
  const resolvedNicheKey = nicheKeyMap[userNicheLower] ?? userNicheLower;

  // Filter sequences based on role
  const visibleColdSequences = showAdmin
    ? COLD_EMAIL_SEQUENCES
    : COLD_EMAIL_SEQUENCES.filter((s) => {
        const sk = s.niche.toLowerCase().replace(/\s+/g, "-");
        return sk === resolvedNicheKey;
      });

  const visibleClientCampaigns = showAdmin
    ? ALL_CLIENT_CAMPAIGNS
    : ALL_CLIENT_CAMPAIGNS.filter((c) => {
        const ck = c.niche.toLowerCase().replace(/\s+/g, "-");
        return ck === resolvedNicheKey;
      });

  const [cloneModal, setCloneModal] = useState<CloneModalState>({
    open: false,
    name: "",
    niche: "",
    emailCount: 0,
    previewSubject: "",
    touches: [],
    steps: [],
    type: "cold-email",
  });

  const openColdClone = (seq: ColdEmailSequence) => {
    const firstSubject =
      seq.touches[0]?.variants.find((v) => v.isActive)?.subject ??
      seq.touches[0]?.variants[0]?.subject ??
      "";
    setCloneModal({
      open: true,
      name: seq.name,
      niche: seq.niche,
      emailCount: seq.touches.length,
      previewSubject: firstSubject,
      touches: seq.touches,
      steps: [],
      type: "cold-email",
    });
  };

  const openClientClone = (camp: ClientCampaign) => {
    const typeMeta = campaignTypeMeta(camp.name);
    const typeKey =
      typeMeta === CAMPAIGN_TYPE_META.onboarding
        ? "onboarding"
        : typeMeta === CAMPAIGN_TYPE_META["re-engagement"]
          ? "re-engagement"
          : "mid-journey";
    const firstSubject =
      camp.steps.find((s) => s.channel === "email")?.subject ?? "";
    setCloneModal({
      open: true,
      name: camp.name,
      niche: camp.niche,
      emailCount: camp.steps.filter((s) => s.channel === "email").length,
      previewSubject: firstSubject,
      touches: [],
      steps: camp.steps,
      type: typeKey,
    });
  };

  // Group cold sequences by niche
  const coldByNiche = visibleColdSequences.reduce<
    Record<string, ColdEmailSequence[]>
  >((acc, s) => {
    const key = s.niche;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  // Group client campaigns by niche
  const clientByNiche = visibleClientCampaigns.reduce<
    Record<string, ClientCampaign[]>
  >((acc, c) => {
    const key = c.niche;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-8" data-ocid="campaigns.preloaded_library.section">
      {/* Role-scoped header */}
      {!showAdmin && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
          <Library className="h-4 w-4 text-primary flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-primary">
              Showing campaigns for your niche:{" "}
              <span className="text-foreground">
                {nicheMeta(resolvedNicheKey).label || userNicheRaw || "All"}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {isDemoUser
                ? "Read-only preview mode — clone disabled."
                : "Clone any campaign to create an editable copy."}
            </p>
          </div>
        </div>
      )}

      {/* ── Cold Email Sequences Section ─────────── */}
      {visibleColdSequences.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-4 w-4 text-rose-400" />
            <h3 className="font-semibold text-foreground">
              Cold Email Sequences
            </h3>
            <Badge className="text-xs bg-rose-500/10 text-rose-400 border-rose-500/20">
              {visibleColdSequences.length} Sequences
            </Badge>
            <EmailProviderBadge type="cold" />
          </div>

          <div className="space-y-6">
            {Object.entries(coldByNiche).map(([niche, seqs]) => {
              const nm = nicheMeta(niche);
              return (
                <div key={niche}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`text-xs border ${nm.color}`}>
                      {nm.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {seqs.length} sequence{seqs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {seqs.map((seq, idx) => {
                      const firstVariant =
                        seq.touches[0]?.variants.find((v) => v.isActive) ??
                        seq.touches[0]?.variants[0];
                      return (
                        <Card
                          key={seq.id}
                          className="bg-card border-border hover:border-rose-500/30 transition-colors"
                          data-ocid={`campaigns.library.cold.${idx + 1}.card`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <Badge
                                    className={`text-xs border ${nm.color}`}
                                  >
                                    {nm.label}
                                  </Badge>
                                  <Badge className="text-xs border bg-rose-500/10 text-rose-400 border-rose-500/20">
                                    Cold Email
                                  </Badge>
                                  <Badge
                                    className={`text-xs border ${seq.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`}
                                  >
                                    {seq.status}
                                  </Badge>
                                </div>
                                <p className="text-sm font-semibold text-foreground line-clamp-2">
                                  {seq.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                  {seq.pain}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-muted/40 rounded-lg p-2 text-center border border-border">
                                <p className="text-base font-bold text-foreground">
                                  {seq.touches.length}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  Email Touches
                                </p>
                              </div>
                              <div className="bg-muted/40 rounded-lg p-2 text-center border border-border">
                                <p className="text-base font-bold text-foreground">
                                  {seq.throttlePerDay}/day
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  Send Limit
                                </p>
                              </div>
                            </div>

                            {firstVariant?.subject && (
                              <div className="bg-background border border-border rounded p-2 mb-3">
                                <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">
                                  Touch 1 Subject
                                </p>
                                <p className="text-xs text-foreground italic truncate">
                                  "{firstVariant.subject}"
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {seq.touches.slice(0, 5).map((t) => (
                                <div
                                  key={t.id}
                                  className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/30 border border-border rounded-full px-2 py-0.5"
                                >
                                  <Mail className="h-2.5 w-2.5" />
                                  <span>D{t.dayOffset}</span>
                                </div>
                              ))}
                            </div>

                            {/* Demo link */}
                            <div className="text-[10px] text-muted-foreground bg-muted/20 rounded border border-border px-2 py-1 mb-3 font-mono truncate">
                              {buildDemoLink(
                                niche,
                                "{{business_name}}",
                                "cold-email-library",
                              )}
                            </div>

                            {isDemoUser ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs"
                                onClick={() =>
                                  toast.info(
                                    "Demo users can preview but not clone campaigns.",
                                  )
                                }
                                data-ocid={`campaigns.library.cold.${idx + 1}.preview_button`}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1.5" />
                                Preview Only
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="w-full text-xs"
                                onClick={() => openColdClone(seq)}
                                data-ocid={`campaigns.library.cold.${idx + 1}.button`}
                              >
                                <Copy className="h-3.5 w-3.5 mr-1.5" />
                                Use This Campaign
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Client Lifecycle Campaigns Section ─────────── */}
      {visibleClientCampaigns.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">
              Client Lifecycle Campaigns
            </h3>
            <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
              {visibleClientCampaigns.length} Campaigns
            </Badge>
            <EmailProviderBadge type="warm" />
          </div>

          <div className="space-y-6">
            {Object.entries(clientByNiche).map(([niche, camps]) => {
              const nm = nicheMeta(niche);
              return (
                <div key={niche}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`text-xs border ${nm.color}`}>
                      {nm.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {camps.length} campaign{camps.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {camps.map((camp, idx) => {
                      const tm = campaignTypeMeta(camp.name);
                      const typeKey =
                        tm === CAMPAIGN_TYPE_META.onboarding
                          ? "onboarding"
                          : tm === CAMPAIGN_TYPE_META["re-engagement"]
                            ? "re-engagement"
                            : "mid-journey";
                      const emailCount = camp.steps.filter(
                        (s) => s.channel === "email",
                      ).length;
                      const channelSet = [
                        ...new Set(
                          camp.steps
                            .filter((s) => !s.isInternal)
                            .map((s) => s.channel),
                        ),
                      ];
                      return (
                        <Card
                          key={camp.id}
                          className="bg-card border-border hover:border-primary/30 transition-colors"
                          data-ocid={`campaigns.library.lifecycle.${idx + 1}.card`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-2 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <Badge
                                    className={`text-xs border ${nm.color}`}
                                  >
                                    {nm.label}
                                  </Badge>
                                  <Badge
                                    className={`text-xs border ${(CAMPAIGN_TYPE_META[typeKey] ?? CAMPAIGN_TYPE_META["mid-journey"]).color}`}
                                  >
                                    {
                                      (
                                        CAMPAIGN_TYPE_META[typeKey] ??
                                        CAMPAIGN_TYPE_META["mid-journey"]
                                      ).label
                                    }
                                  </Badge>
                                </div>
                                <p className="text-sm font-semibold text-foreground line-clamp-2">
                                  {camp.name}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                                  {camp.trigger}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="bg-muted/40 rounded p-2 text-center border border-border">
                                <p className="text-sm font-bold text-foreground">
                                  {camp.steps.length}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  Steps
                                </p>
                              </div>
                              <div className="bg-muted/40 rounded p-2 text-center border border-border">
                                <p className="text-sm font-bold text-foreground">
                                  {emailCount}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  Emails
                                </p>
                              </div>
                              <div className="bg-muted/40 rounded p-2 text-center border border-border">
                                <p className="text-sm font-bold text-emerald-400">
                                  {camp.mockMetrics.openRate}%
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  Open Rate
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-1 mb-3 flex-wrap">
                              {channelSet.map((ch) => (
                                <Badge
                                  key={ch}
                                  className={`text-xs ${channelColor(ch)}`}
                                >
                                  <ChannelIcon channel={ch} />
                                  <span className="ml-1 capitalize">{ch}</span>
                                </Badge>
                              ))}
                            </div>

                            {isDemoUser ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs"
                                onClick={() =>
                                  toast.info(
                                    "Demo users can preview but not clone campaigns.",
                                  )
                                }
                                data-ocid={`campaigns.library.lifecycle.${idx + 1}.preview_button`}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1.5" />
                                Preview Only
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs"
                                onClick={() => openClientClone(camp)}
                                data-ocid={`campaigns.library.lifecycle.${idx + 1}.button`}
                              >
                                <Copy className="h-3.5 w-3.5 mr-1.5" />
                                Use This Campaign
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {visibleColdSequences.length === 0 &&
        visibleClientCampaigns.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="campaigns.preloaded_library.empty_state"
          >
            <Library className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-foreground">
              No campaigns match your niche
            </p>
            <p className="text-xs mt-1">
              Contact your agency admin to add campaigns for your industry.
            </p>
          </div>
        )}

      <CloneModal
        state={cloneModal}
        onClose={() => setCloneModal((p) => ({ ...p, open: false }))}
        onClone={onClone}
      />
    </div>
  );
}

// ─── NEW: Custom Campaign Inline Editor ───────────────────────────────────────

function CustomCampaignEditor({
  campaign,
  onClose,
  onSave,
}: {
  campaign: CustomCampaignEntry;
  onClose: () => void;
  onSave: (updated: CustomCampaignEntry) => void;
}) {
  const [localTouches, setLocalTouches] = useState<EmailTouch[]>(
    campaign.touches,
  );
  const [localSteps, setLocalSteps] = useState<CampaignStep[]>(campaign.steps);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const isCold = campaign.type === "cold-email";
  const items = isCold
    ? localTouches.map((t, i) => ({
        label: `Touch ${t.touchNumber} — Day ${t.dayOffset}`,
        idx: i,
      }))
    : localSteps.map((s, i) => ({
        label: `Step ${s.stepNumber} — ${s.channel}`,
        idx: i,
      }));

  const tokens = [
    "{{business_name}}",
    "{{owner_name}}",
    "{{city}}",
    "{{first_name}}",
    "{{booking_link}}",
  ];

  return (
    <Card
      className="bg-card border-primary/30 border mt-4"
      data-ocid="campaigns.custom_editor.panel"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Edit2 className="h-4 w-4 text-primary" />
            Editing: {campaign.sourceName}
          </CardTitle>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-ocid="campaigns.custom_editor.close_button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Item list */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {isCold ? "Email Touches" : "Campaign Steps"}
            </p>
            {items.map((item) => (
              <button
                key={item.idx}
                type="button"
                onClick={() => setSelectedIdx(item.idx)}
                className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${selectedIdx === item.idx ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground"}`}
                data-ocid={`campaigns.custom_editor.item.${item.idx + 1}`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-border">
              <Button
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  onSave({
                    ...campaign,
                    touches: localTouches,
                    steps: localSteps,
                  });
                  toast.success("Custom campaign saved!");
                  onClose();
                }}
                data-ocid="campaigns.custom_editor.save_button"
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Right: Editor */}
          <div className="lg:col-span-2">
            {isCold && localTouches[selectedIdx]
              ? (() => {
                  const touch = localTouches[selectedIdx];
                  const activeVariant =
                    touch.variants.find((v) => v.isActive) ?? touch.variants[0];
                  if (!activeVariant) return null;
                  const vIdx = touch.variants.indexOf(activeVariant);
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="text-xs bg-primary/15 text-primary border-primary/20">
                          {touch.framework}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Day {touch.dayOffset}
                        </span>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Subject
                        </Label>
                        <Input
                          value={activeVariant.subject}
                          onChange={(e) =>
                            setLocalTouches((prev) =>
                              prev.map((t, i) =>
                                i === selectedIdx
                                  ? {
                                      ...t,
                                      variants: t.variants.map((v, vi) =>
                                        vi === vIdx
                                          ? { ...v, subject: e.target.value }
                                          : v,
                                      ),
                                    }
                                  : t,
                              ),
                            )
                          }
                          className="mt-1 h-8 text-sm"
                          data-ocid="campaigns.custom_editor.subject_input"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Body
                        </Label>
                        <Textarea
                          value={activeVariant.body}
                          onChange={(e) =>
                            setLocalTouches((prev) =>
                              prev.map((t, i) =>
                                i === selectedIdx
                                  ? {
                                      ...t,
                                      variants: t.variants.map((v, vi) =>
                                        vi === vIdx
                                          ? { ...v, body: e.target.value }
                                          : v,
                                      ),
                                    }
                                  : t,
                              ),
                            )
                          }
                          rows={10}
                          className="mt-1 text-xs font-mono"
                          data-ocid="campaigns.custom_editor.body_textarea"
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tokens.map((tk) => (
                            <button
                              key={tk}
                              type="button"
                              onClick={() =>
                                setLocalTouches((prev) =>
                                  prev.map((t, i) =>
                                    i === selectedIdx
                                      ? {
                                          ...t,
                                          variants: t.variants.map((v, vi) =>
                                            vi === vIdx
                                              ? {
                                                  ...v,
                                                  body: `${v.body} ${tk}`,
                                                }
                                              : v,
                                          ),
                                        }
                                      : t,
                                  ),
                                )
                              }
                              className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 hover:bg-primary/20 font-mono transition-colors"
                            >
                              {tk}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()
              : null}

            {!isCold && localSteps[selectedIdx]
              ? (() => {
                  const step = localSteps[selectedIdx];
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-xs ${channelColor(step.channel)}`}
                        >
                          <ChannelIcon channel={step.channel} />
                          <span className="ml-1 capitalize">
                            {step.channel}
                          </span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {step.delayLabel}
                        </span>
                      </div>
                      {step.subject !== undefined && (
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Subject
                          </Label>
                          <Input
                            value={step.subject}
                            onChange={(e) =>
                              setLocalSteps((prev) =>
                                prev.map((s, i) =>
                                  i === selectedIdx
                                    ? { ...s, subject: e.target.value }
                                    : s,
                                ),
                              )
                            }
                            className="mt-1 h-8 text-sm"
                            data-ocid="campaigns.custom_editor.step_subject_input"
                          />
                        </div>
                      )}
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Body
                        </Label>
                        <Textarea
                          value={step.body}
                          onChange={(e) =>
                            setLocalSteps((prev) =>
                              prev.map((s, i) =>
                                i === selectedIdx
                                  ? { ...s, body: e.target.value }
                                  : s,
                              ),
                            )
                          }
                          rows={10}
                          className="mt-1 text-xs font-mono"
                          data-ocid="campaigns.custom_editor.step_body_textarea"
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tokens.map((tk) => (
                            <button
                              key={tk}
                              type="button"
                              onClick={() =>
                                setLocalSteps((prev) =>
                                  prev.map((s, i) =>
                                    i === selectedIdx
                                      ? { ...s, body: `${s.body} ${tk}` }
                                      : s,
                                  ),
                                )
                              }
                              className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 hover:bg-primary/20 font-mono transition-colors"
                            >
                              {tk}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()
              : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── NEW: My Custom Campaigns Tab ─────────────────────────────────────────────

function CustomCampaignsTab({
  campaigns,
  onDelete,
  onUpdate,
}: {
  campaigns: CustomCampaignEntry[];
  onDelete: (id: string) => void;
  onUpdate: (updated: CustomCampaignEntry) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="space-y-6" data-ocid="campaigns.custom_campaigns.section">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-foreground">My Custom Campaigns</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cloned and customized copies of master templates — only you can see
            and edit these.
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {campaigns.length === 0 ? (
        <div
          className="text-center py-16 border border-dashed border-border rounded-xl bg-muted/10"
          data-ocid="campaigns.custom_campaigns.empty_state"
        >
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm font-medium text-foreground">
            No custom campaigns yet
          </p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Clone a preloaded campaign to get started.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast.info("Go to the Preloaded Library tab to clone a campaign.")
            }
          >
            <Library className="h-4 w-4 mr-2" />
            Browse Preloaded Library
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((camp, idx) => {
            const nm = nicheMeta(camp.niche);
            const tm =
              CAMPAIGN_TYPE_META[camp.type] ??
              CAMPAIGN_TYPE_META["mid-journey"];
            const isEditing = editingId === camp.id;
            return (
              <div
                key={camp.id}
                data-ocid={`campaigns.custom_campaigns.item.${idx + 1}`}
              >
                <Card
                  className={`bg-card border-border transition-colors ${isEditing ? "border-primary/40" : "hover:border-primary/20"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <Badge className={`text-xs border ${nm.color}`}>
                            {nm.label}
                          </Badge>
                          <Badge className={`text-xs border ${tm.color}`}>
                            {tm.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {camp.emailCount} email
                            {camp.emailCount !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {camp.sourceName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Created{" "}
                          {new Date(camp.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant={isEditing ? "default" : "outline"}
                          className="text-xs h-8"
                          onClick={() =>
                            setEditingId(isEditing ? null : camp.id)
                          }
                          data-ocid={`campaigns.custom_campaigns.${idx + 1}.edit_button`}
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          {isEditing ? "Close Editor" : "Edit"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          onClick={() => setConfirmDelete(camp.id)}
                          data-ocid={`campaigns.custom_campaigns.${idx + 1}.delete_button`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {isEditing && (
                  <CustomCampaignEditor
                    campaign={camp}
                    onClose={() => setEditingId(null)}
                    onSave={(updated) => {
                      onUpdate(updated);
                      setEditingId(null);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation */}
      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent data-ocid="campaigns.custom_delete.dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
              Delete Custom Campaign?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete your custom campaign copy. The original
            master template in the Preloaded Library is not affected.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(null)}
              data-ocid="campaigns.custom_delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDelete) {
                  onDelete(confirmDelete);
                  setConfirmDelete(null);
                  toast.success("Custom campaign deleted");
                }
              }}
              data-ocid="campaigns.custom_delete.confirm_button"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Campaign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const { isAdminUser, isAdmin } = useApp();
  const showAdmin = isAdminUser || isAdmin;

  // Custom campaigns state — local copies created by Clone & Edit workflow
  const [customCampaigns, setCustomCampaigns] = useState<CustomCampaignEntry[]>(
    [],
  );

  const handleClone = (entry: CustomCampaignEntry) => {
    setCustomCampaigns((prev) => [entry, ...prev]);
  };
  const handleDelete = (id: string) => {
    setCustomCampaigns((prev) => prev.filter((c) => c.id !== id));
  };
  const handleUpdate = (updated: CustomCampaignEntry) => {
    setCustomCampaigns((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" />
          Campaigns
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {showAdmin
            ? "Prospect outreach sequences, cold email campaigns, and client lifecycle automation"
            : "Automated lifecycle campaigns for your business"}
        </p>
      </div>

      <Tabs
        defaultValue={showAdmin ? "cold-email" : "preloaded"}
        className="space-y-6"
      >
        <TabsList
          className="bg-muted/40 flex-wrap h-auto gap-1 p-1"
          data-ocid="campaigns.tabs"
        >
          {/* Preloaded Library — visible to all roles */}
          <TabsTrigger
            value="preloaded"
            className="text-xs"
            data-ocid="campaigns.preloaded_library.tab"
          >
            <Library className="h-3.5 w-3.5 mr-1.5" />
            Preloaded Library
          </TabsTrigger>
          {/* My Custom Campaigns — visible to all roles */}
          <TabsTrigger
            value="custom-campaigns"
            className="text-xs"
            data-ocid="campaigns.custom_campaigns.tab"
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            My Campaigns
            {customCampaigns.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                {customCampaigns.length}
              </span>
            )}
          </TabsTrigger>

          {showAdmin && (
            <>
              <TabsTrigger
                value="cold-email"
                className="text-xs"
                data-ocid="campaigns.cold_email.tab"
              >
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                Cold Email Builder
              </TabsTrigger>
              <TabsTrigger
                value="demo-links"
                className="text-xs"
                data-ocid="campaigns.demo_links.tab"
              >
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Demo Links
              </TabsTrigger>
              <TabsTrigger
                value="copy-variants"
                className="text-xs"
                data-ocid="campaigns.copy_variants.tab"
              >
                <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                Copy Variants
              </TabsTrigger>
              <TabsTrigger
                value="seq-manager"
                className="text-xs"
                data-ocid="campaigns.seq_manager.tab"
              >
                <Users className="h-3.5 w-3.5 mr-1.5" />
                Sequence Manager
              </TabsTrigger>
              <TabsTrigger
                value="warm-sequences"
                className="text-xs"
                data-ocid="campaigns.warm_sequences.tab"
              >
                <Flame className="h-3.5 w-3.5 mr-1.5" />
                Warm Sequences
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="text-xs"
                data-ocid="campaigns.performance.tab"
              >
                <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="ab-testing"
                className="text-xs"
                data-ocid="campaigns.ab_testing.tab"
              >
                <SplitSquareHorizontal className="h-3.5 w-3.5 mr-1.5" />
                A/B Testing
              </TabsTrigger>
              <TabsTrigger
                value="intelligence"
                className="text-xs"
                data-ocid="campaigns.intelligence.tab"
              >
                <Target className="h-3.5 w-3.5 mr-1.5" />
                Intelligence
              </TabsTrigger>
              <TabsTrigger
                value="outreach"
                className="text-xs"
                data-ocid="campaigns.outreach.tab"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Prospect Outreach
              </TabsTrigger>
            </>
          )}
          <TabsTrigger
            value="my-campaigns"
            className="text-xs"
            data-ocid="campaigns.my_campaigns.tab"
          >
            <Megaphone className="h-3.5 w-3.5 mr-1.5" />
            My Campaigns (Legacy)
          </TabsTrigger>
        </TabsList>

        {/* New Preloaded Library tab */}
        <TabsContent value="preloaded">
          <PreloadedLibraryTab onClone={handleClone} />
        </TabsContent>

        {/* New My Custom Campaigns tab */}
        <TabsContent value="custom-campaigns">
          <CustomCampaignsTab
            campaigns={customCampaigns}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </TabsContent>

        {showAdmin && (
          <>
            <TabsContent value="cold-email">
              <CampaignBuilderTab />
            </TabsContent>
            <TabsContent value="demo-links">
              <DemoLinkManagerTab />
            </TabsContent>
            <TabsContent value="copy-variants">
              <CopyVariantLibraryTab />
            </TabsContent>
            <TabsContent value="seq-manager">
              <ColdSequenceManagerTab />
            </TabsContent>
            <TabsContent value="warm-sequences">
              <WarmSequencesTab />
            </TabsContent>
            <TabsContent value="performance">
              <PerformanceDashboardTab />
            </TabsContent>
            <TabsContent value="ab-testing">
              <ABTestingTab />
            </TabsContent>
            <TabsContent value="intelligence">
              <CampaignIntelligenceTab />
            </TabsContent>
            <TabsContent value="outreach">
              <ProspectOutreachTab />
            </TabsContent>
          </>
        )}
        <TabsContent value="my-campaigns">
          <MyCampaignsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
