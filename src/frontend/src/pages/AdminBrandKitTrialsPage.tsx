import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Archive,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCopy,
  Download,
  ExternalLink,
  Filter,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Send,
  TrendingUp,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  type WarmSequenceEmailSchedule,
  useBrandKit,
} from "../hooks/useBrandKit";
import type {
  BrandKitNiche,
  BrandKitOutreachJob,
  BrandKitProspect,
} from "../types/brandKit";
import { NICHE_COLORS, NICHE_LABELS } from "../types/brandKit";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusFilter =
  | "all"
  | "waiting"
  | "opened"
  | "active"
  | "closing"
  | "follow-up"
  | "expired"
  | "converted";

type SequenceTemplate = "standard" | "high-urgency" | "soft-intro";

interface CsvRow {
  business_name: string;
  city: string;
  phone?: string;
  website?: string;
}

// ─── CSV Helpers ──────────────────────────────────────────────────────────────

function parseCsv(text: string): { rows: CsvRow[]; error: string | null } {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2)
    return {
      rows: [],
      error: "CSV must have a header row and at least one data row.",
    };
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const hasBusinessName = headers.includes("business_name");
  const hasCity = headers.includes("city");
  if (!hasBusinessName || !hasCity)
    return { rows: [], error: "CSV must include columns: business_name, city" };

  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = vals[idx] ?? "";
    });
    if (!row.business_name || !row.city) continue;
    rows.push({
      business_name: row.business_name,
      city: row.city,
      phone: row.phone || undefined,
      website: row.website || undefined,
    });
  }
  if (rows.length === 0)
    return { rows: [], error: "No valid rows found in CSV." };
  return { rows, error: null };
}

function downloadSampleCsv(niche: BrandKitNiche) {
  const label = NICHE_LABELS[niche];
  const examples: Record<BrandKitNiche, CsvRow[]> = {
    plumber: [
      {
        business_name: "Dallas Plumbing Co",
        city: "Dallas",
        phone: "214-555-0100",
        website: "dallasplumbing.com",
      },
      {
        business_name: "Rapid Pipe Repair",
        city: "Fort Worth",
        phone: "817-555-0200",
      },
      {
        business_name: "Master Plumbers TX",
        city: "Austin",
        phone: "512-555-0300",
      },
    ],
    "med-spa": [
      { business_name: "Glow Med Spa", city: "Miami", phone: "305-555-0111" },
      {
        business_name: "Radiance Aesthetics",
        city: "Boca Raton",
        phone: "561-555-0222",
      },
      {
        business_name: "Luxe Skin Studio",
        city: "Orlando",
        phone: "407-555-0333",
      },
    ],
    hvac: [
      {
        business_name: "Arctic Air HVAC",
        city: "Phoenix",
        phone: "602-555-0150",
      },
      {
        business_name: "Cool Breeze Systems",
        city: "Scottsdale",
        phone: "480-555-0250",
      },
      {
        business_name: "Desert Comfort HVAC",
        city: "Tempe",
        phone: "480-555-0350",
      },
    ],
    restoration: [
      {
        business_name: "Rapid Restore",
        city: "Chicago",
        phone: "312-555-0175",
      },
      {
        business_name: "BrightStone Restoration",
        city: "Naperville",
        phone: "630-555-0275",
      },
      {
        business_name: "ProDry Services",
        city: "Evanston",
        phone: "847-555-0375",
      },
    ],
    "carpet-cleaning": [
      {
        business_name: "CarpetPro Solutions",
        city: "Houston",
        phone: "713-555-0190",
      },
      {
        business_name: "FreshStep Cleaning",
        city: "Sugar Land",
        phone: "281-555-0290",
      },
      {
        business_name: "Diamond Clean Carpets",
        city: "Katy",
        phone: "281-555-0390",
      },
    ],
    roofing: [
      {
        business_name: "Summit Roofing",
        city: "Denver",
        phone: "720-555-0160",
      },
      {
        business_name: "Peak Shield Roofing",
        city: "Aurora",
        phone: "303-555-0260",
      },
      {
        business_name: "Rocky Mountain Roofs",
        city: "Lakewood",
        phone: "303-555-0360",
      },
    ],
    "real-estate": [
      {
        business_name: "Premier Realty Group",
        city: "Los Angeles",
        phone: "310-555-0170",
      },
      {
        business_name: "Skyline Properties",
        city: "Beverly Hills",
        phone: "310-555-0270",
      },
      {
        business_name: "Golden State Homes",
        city: "Santa Monica",
        phone: "310-555-0370",
      },
    ],
    mortgage: [
      {
        business_name: "HomeFirst Lending",
        city: "Atlanta",
        phone: "404-555-0180",
      },
      {
        business_name: "Peach State Mortgage",
        city: "Marietta",
        phone: "770-555-0280",
      },
      {
        business_name: "Gateway Home Loans",
        city: "Alpharetta",
        phone: "678-555-0380",
      },
    ],
    chiropractor: [
      {
        business_name: "SpineAlign Chiropractic",
        city: "Seattle",
        phone: "206-555-0195",
      },
      {
        business_name: "Pacific Wellness Center",
        city: "Bellevue",
        phone: "425-555-0295",
      },
      {
        business_name: "Sound Health Chiro",
        city: "Kirkland",
        phone: "425-555-0395",
      },
    ],
    dental: [
      {
        business_name: "BrightSmile Dental",
        city: "New York",
        phone: "212-555-0155",
      },
      {
        business_name: "Manhattan Family Dentistry",
        city: "Brooklyn",
        phone: "718-555-0255",
      },
      {
        business_name: "Queens Dental Arts",
        city: "Queens",
        phone: "718-555-0355",
      },
    ],
  };
  const rows = examples[niche] ?? examples.plumber;
  const header = "business_name,city,phone,website";
  const lines = rows.map(
    (r) => `${r.business_name},${r.city},${r.phone ?? ""},${r.website ?? ""}`,
  );
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sample-${niche}-prospects.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Sample CSV downloaded for ${label}`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getEnhancedStatusBadge(prospect: BrandKitProspect) {
  const { trialStatus, trialDay, lastOpenedAt } = prospect;

  if (trialStatus === "Converted") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <Check className="w-3 h-3" /> Converted
      </span>
    );
  }
  if (trialStatus === "Expired") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive/15 text-red-400 border border-destructive/30">
        Expired
      </span>
    );
  }
  if (trialStatus === "Active") {
    if (trialDay >= 6) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">
          <Zap className="w-3 h-3" /> Day {trialDay} of 7
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
        Day {trialDay} of 7
      </span>
    );
  }
  if (trialStatus === "NotStarted") {
    // Check if "follow-up needed" — sent but not opened after 48h
    const sentAt = prospect.outreachKitSentAt;
    const now = Date.now();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    if (sentAt && !lastOpenedAt && now - sentAt > fortyEightHours) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
          <AlertCircle className="w-3 h-3" /> Follow-up Needed
        </span>
      );
    }
    if (lastOpenedAt) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
          Opened
        </span>
      );
    }
    if (sentAt) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
          Kit Sent
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
        Waiting
      </span>
    );
  }
  return null;
}

function getProspectFilterStatus(p: BrandKitProspect): StatusFilter {
  if (p.trialStatus === "Converted") return "converted";
  if (p.trialStatus === "Expired") return "expired";
  if (p.trialStatus === "Active") {
    if (p.trialDay >= 6) return "closing";
    return "active";
  }
  // NotStarted
  const sentAt = p.outreachKitSentAt;
  const fortyEightHours = 48 * 60 * 60 * 1000;
  if (sentAt && !p.lastOpenedAt && Date.now() - sentAt > fortyEightHours)
    return "follow-up";
  if (p.lastOpenedAt) return "opened";
  return "waiting";
}

function getOutreachStatusBadge(status: BrandKitOutreachJob["status"]) {
  const map: Record<
    BrandKitOutreachJob["status"],
    { label: string; cls: string }
  > = {
    pending: {
      label: "Pending",
      cls: "bg-muted text-muted-foreground border-border",
    },
    sent: {
      label: "Sent",
      cls: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    opened: {
      label: "Opened",
      cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    },
    clicked: {
      label: "Clicked",
      cls: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    },
    converted: {
      label: "Converted",
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
  };
  const { label, cls } = map[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}
    >
      {label}
    </span>
  );
}

function NicheBadge({ niche }: { niche: BrandKitNiche }) {
  const colors = NICHE_COLORS[niche];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border"
      style={{
        backgroundColor: `${colors.primary}22`,
        color: colors.primary,
        borderColor: `${colors.primary}44`,
      }}
    >
      {NICHE_LABELS[niche]}
    </span>
  );
}

function timeAgo(ts: number | undefined): string {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const FOLLOW_UP_TEMPLATES: Record<
  StatusFilter,
  { subject: string; sms: string; email: string }
> = {
  waiting: {
    subject: "Your Brand Kit is ready — here's a quick look",
    sms: "Hey {name}! Your personalized brand kit for {business} is ready. We built your website, set up your AI voice agent, and loaded your content calendar. Take a look: {link}",
    email:
      "Hi {name},\n\nYour personalized brand kit is ready — we built everything for {business} in advance so you can see exactly what your business would look like on BRF.\n\n• Your niche website (pre-loaded with {city} content)\n• Your AI voice agent (try it at {link})\n• Your social media calendar\n\nActivate your free 7-day trial (clock only starts when you use it): {link}\n\nBest,\nThe BRF Team",
  },
  opened: {
    subject: "You've seen your Brand Kit — ready to take the next step?",
    sms: "Hey {name}! You checked out your brand kit for {business}. Want to activate your free 7-day trial? The clock only starts when you use it. {link}",
    email:
      "Hi {name},\n\nWe noticed you took a look at your brand kit for {business} — great first step!\n\nActivate your free 7-day trial to unlock:\n• Your live AI voice agent\n• Your social media calendar\n• Your fully built website\n\nTrial clock only starts when you use it: {link}\n\nBest,\nThe BRF Team",
  },
  "follow-up": {
    subject: "Following up — your Brand Kit is still waiting for you",
    sms: "Hey {name}, just checking in on your brand kit for {business}. It's still ready whenever you are — no pressure. {link}",
    email:
      "Hi {name},\n\nI wanted to follow up on the brand kit we built for {business}. Life gets busy — totally understand.\n\nYour kit is still waiting:\n• Website pre-built for {city}\n• AI voice agent ready to test\n• Free business audit included\n\nTake a look whenever you're ready: {link}\n\nBest,\nThe BRF Team",
  },
  active: {
    subject: "You're on Day {day} — here's what to try next",
    sms: "Hey {name}, you're on Day {day} of your BRF trial! Try the social media scheduler today — it takes 5 minutes and schedules a week of posts. {link}",
    email:
      "Hi {name},\n\nYou're making progress on your BRF trial! Here's what you haven't explored yet:\n\n• Social media scheduler (5 min setup)\n• Review request automation\n• Your AI voice agent walkthrough\n\nLog back in: {link}\n\nLet us know if you have questions — reply to this email.\n\nBest,\nThe BRF Team",
  },
  closing: {
    subject: "Final days of your trial — let's lock it in",
    sms: "Hey {name}, your BRF trial is almost up! You've built a solid foundation — let's make it permanent. Reply YES to get a personal demo call. {link}",
    email:
      "Hi {name},\n\nYour 7-day trial for {business} is winding down and you've already built something impressive:\n\n✓ Website live with {city} content\n✓ Voice agent ready to take calls\n✓ Review automation configured\n\nLock in your results before the trial ends.\n\nUpgrade now: {link}\n\nBest,\nThe BRF Team",
  },
  expired: {
    subject: "Your BRF trial expired — here's how to get back in",
    sms: "Hey {name}, your BRF trial for {business} just expired but your work is saved. Want to pick up where you left off? Reply RESTART and we'll extend your trial 3 days free.",
    email:
      "Hi {name},\n\nYour trial for {business} has expired, but everything you set up is saved.\n\nWe'd love to extend your trial for 3 more days. Just reply to this email or click below.\n\nRestart your trial: {link}\n\nBest,\nThe BRF Team",
  },
  converted: {
    subject: "Welcome to BRF — here's your onboarding checklist",
    sms: "Welcome to BRF, {name}! Your account for {business} is live. Here's your onboarding checklist: {link}",
    email:
      "Hi {name},\n\nWelcome aboard! {business} is now officially a BRF client.\n\nOnboarding checklist:\n1. Connect your Twilio number\n2. Connect your LLM\n3. Set up your review request flow\n4. Schedule your first social posts\n\nGuide: {link}\n\nThe BRF Team",
  },
  all: {
    subject: "Checking in on your BRF trial",
    sms: "Hey {name}! Just checking in on your BRF trial for {business}. Anything I can help with? {link}",
    email:
      "Hi {name},\n\nJust checking in — how's everything going with your BRF trial for {business}?\n\nIf you have questions or want a walkthrough, reply to this email.\n\n{link}\n\nBest,\nThe BRF Team",
  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  total,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  total: number;
  icon: React.ElementType;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <Card className="bg-card border-border p-4 flex flex-col gap-2 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${color}, transparent 70%)`,
        }}
      />
      <div className="flex items-start justify-between">
        <span className="text-muted-foreground text-xs font-medium">
          {label}
        </span>
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}22` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {value}
        </span>
        <span className="text-xs text-muted-foreground mb-0.5">{pct}%</span>
      </div>
    </Card>
  );
}

// ─── Follow-Up Modal ──────────────────────────────────────────────────────────

function FollowUpModal({
  prospect,
  onClose,
}: {
  prospect: BrandKitProspect;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"sms" | "email">("sms");
  const statusKey = getProspectFilterStatus(prospect);
  const tpl = FOLLOW_UP_TEMPLATES[statusKey];

  const fill = (s: string) =>
    s
      .replace(/{name}/g, prospect.firstName)
      .replace(/{business}/g, prospect.businessName)
      .replace(/{city}/g, prospect.city)
      .replace(/{day}/g, String(prospect.trialDay))
      .replace(
        /{link}/g,
        `${window.location.origin}/brand-kit/${prospect.kitPageSlug}`,
      );

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className="bg-card border border-border rounded-xl w-full max-w-lg shadow-2xl mx-4"
        data-ocid="followup.dialog"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <p className="font-semibold text-foreground">Follow Up</p>
            <p className="text-sm text-muted-foreground">
              {prospect.businessName} · {prospect.city}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="followup.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex gap-2">
            {(["sms", "email"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                data-ocid="followup.tab"
              >
                {t === "sms" ? (
                  <MessageSquare className="w-3.5 h-3.5" />
                ) : (
                  <Mail className="w-3.5 h-3.5" />
                )}
                {t === "sms" ? "SMS" : "Email"}
              </button>
            ))}
          </div>
          {tab === "email" && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Subject
              </p>
              <div className="bg-muted/40 rounded-lg p-3 text-sm text-foreground font-medium">
                {fill(tpl.subject)}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {tab === "sms" ? "SMS Copy" : "Email Body"}
            </p>
            <div className="bg-muted/40 rounded-lg p-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto">
              {fill(tab === "sms" ? tpl.sms : tpl.email)}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="followup.cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                copy(fill(tab === "sms" ? tpl.sms : tpl.email));
                onClose();
              }}
              data-ocid="followup.confirm_button"
            >
              <ClipboardCopy className="w-3.5 h-3.5 mr-1.5" /> Copy{" "}
              {tab === "sms" ? "SMS" : "Email"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Follow-Up Modal ─────────────────────────────────────────────────────

function BulkFollowUpModal({
  count,
  onConfirm,
  onClose,
}: {
  count: number;
  onConfirm: (template: SequenceTemplate) => void;
  onClose: () => void;
}) {
  const [template, setTemplate] = useState<SequenceTemplate>("standard");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className="bg-card border border-border rounded-xl w-full max-w-md shadow-2xl mx-4"
        data-ocid="bulk-followup.dialog"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <p className="font-semibold text-foreground">
            Bulk Follow-Up — {count} selected
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-ocid="bulk-followup.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Follow-up template
            </Label>
            {(
              ["standard", "high-urgency", "soft-intro"] as SequenceTemplate[]
            ).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTemplate(t)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all text-left ${template === t ? "border-primary bg-primary/10 text-foreground" : "border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:border-border/60"}`}
                data-ocid="bulk-followup.radio"
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${template === t ? "border-primary bg-primary" : "border-muted-foreground"}`}
                >
                  {template === t && (
                    <span className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </span>
                <div>
                  <p className="font-medium capitalize">
                    {t.replace("-", " ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t === "standard"
                      ? "Audit tripwire + value stack"
                      : t === "high-urgency"
                        ? "48-hour expiry angle"
                        : "Educational, no hard CTA"}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="bulk-followup.cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onConfirm(template);
                onClose();
              }}
              data-ocid="bulk-followup.confirm_button"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" /> Send to {count}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Launch Confirm Modal ────────────────────────────────────────────────

function BulkLaunchModal({
  count,
  niche,
  onConfirm,
  onClose,
}: {
  count: number;
  niche: BrandKitNiche;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className="bg-card border border-border rounded-xl w-full max-w-md shadow-2xl mx-4"
        data-ocid="bulk-launch.dialog"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <p className="font-semibold text-foreground">
            Confirm Bulk Generation
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-ocid="bulk-launch.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex flex-col gap-2">
            <p className="text-sm font-semibold text-foreground">
              You're about to generate{" "}
              <span className="text-primary">{count} kits</span> for{" "}
              <span className="text-primary">{NICHE_LABELS[niche]}</span>{" "}
              businesses.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 mt-1">
              <li>• Each prospect gets a unique personalized URL</li>
              <li>• Outreach sequences will queue automatically</li>
              <li>• Trial clocks only start on first real action</li>
            </ul>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="bulk-launch.cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="bg-primary hover:bg-primary/90"
              data-ocid="bulk-launch.confirm_button"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5" /> Generate {count} Kits
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Outreach Section ────────────────────────────────────────────────────

function BulkOutreachSection({
  onBulkGenerated,
}: {
  onBulkGenerated: (
    rows: CsvRow[],
    niche: BrandKitNiche,
    opts: {
      sendEmail: boolean;
      sendCall: boolean;
      template: SequenceTemplate;
      fromName: string;
      customIntro: string;
    },
  ) => void;
}) {
  const [selectedNiche, setSelectedNiche] = useState<BrandKitNiche>("plumber");
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendCall, setSendCall] = useState(true);
  const [template, setTemplate] = useState<SequenceTemplate>("standard");
  const [fromName, setFromName] = useState("BRF Team");
  const [customIntro, setCustomIntro] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const niches = Object.keys(NICHE_LABELS) as BrandKitNiche[];

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { rows, error } = parseCsv(text);
      if (error) {
        setCsvError(error);
        setCsvRows([]);
      } else {
        setCsvError(null);
        setCsvRows(rows);
        toast.success(`${rows.length} prospects loaded from CSV`);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleLaunch = async () => {
    setShowConfirm(false);
    setGenerating(true);
    setGenProgress(0);
    // Simulate generation progress
    for (let i = 1; i <= csvRows.length; i++) {
      await new Promise((r) => setTimeout(r, 120));
      setGenProgress(i);
    }
    setGenerating(false);
    onBulkGenerated(csvRows, selectedNiche, {
      sendEmail,
      sendCall,
      template,
      fromName,
      customIntro,
    });
    setCsvRows([]);
    setCsvError(null);
    toast.success(
      `${csvRows.length} personalized kits generated and outreach queued!`,
    );
  };

  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden"
      data-ocid="bulk-outreach.panel"
    >
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">
            Bulk Outreach — Generate Kits at Scale
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload a prospect list and generate personalized kits for every
            business in seconds
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* Step 1 — Niche Selector */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
              1
            </span>
            <p className="text-sm font-semibold text-foreground">
              Select Niche
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {niches.map((n) => {
              const colors = NICHE_COLORS[n];
              const selected = selectedNiche === n;
              return (
                <button
                  type="button"
                  key={n}
                  onClick={() => setSelectedNiche(n)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
                  style={
                    selected
                      ? {
                          backgroundColor: `${colors.primary}18`,
                          borderColor: colors.primary,
                          color: colors.primary,
                        }
                      : {
                          borderColor: "hsl(var(--border))",
                          color: "hsl(var(--muted-foreground))",
                        }
                  }
                  data-ocid="bulk-outreach.tab"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors.primary }}
                  />
                  {NICHE_LABELS[n]}
                  {selected && <Check className="w-3 h-3 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 — CSV Upload */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
              2
            </span>
            <p className="text-sm font-semibold text-foreground">
              Upload Prospect List
            </p>
          </div>

          <button
            type="button"
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer w-full ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-border/60 bg-muted/20"}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload CSV file"
            data-ocid="bulk-outreach.dropzone"
          >
            <Upload
              className={`w-8 h-8 mx-auto mb-2 transition-colors ${isDragOver ? "text-primary" : "text-muted-foreground"}`}
            />
            <p className="text-sm font-medium text-foreground">
              Drag & drop your CSV here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Format:{" "}
              <span className="font-mono text-primary/80">
                business_name, city, phone
              </span>{" "}
              (optional: website)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => downloadSampleCsv(selectedNiche)}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              data-ocid="bulk-outreach.link"
            >
              <Download className="w-3.5 h-3.5" /> Download Sample CSV for{" "}
              {NICHE_LABELS[selectedNiche]}
            </button>
            {csvRows.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCsvRows([]);
                  setCsvError(null);
                }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {csvError && (
            <div
              className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2.5 text-xs text-red-400"
              data-ocid="bulk-outreach.error_state"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {csvError}
            </div>
          )}

          {csvRows.length > 0 && (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="px-3 py-2 bg-muted/30 border-b border-border flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Preview — first {Math.min(5, csvRows.length)} of{" "}
                  {csvRows.length} rows
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/40">
                      {["Business Name", "City", "Phone"].map((h) => (
                        <th
                          key={h}
                          className="text-left text-muted-foreground px-3 py-2 font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvRows.slice(0, 5).map((row, i) => (
                      <tr
                        key={`${row.business_name}-${i}`}
                        className="border-b border-border/30 last:border-0"
                      >
                        <td className="px-3 py-2 font-medium text-foreground truncate max-w-[180px]">
                          {row.business_name}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {row.city}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {row.phone ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Step 3 — Configure Outreach */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
              3
            </span>
            <p className="text-sm font-semibold text-foreground">
              Configure Outreach
            </p>
          </div>
          <div className="bg-muted/20 rounded-xl border border-border p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="bulk-send-email"
                  checked={sendEmail}
                  onCheckedChange={(v) => setSendEmail(Boolean(v))}
                  className="mt-0.5"
                  data-ocid="bulk-outreach.checkbox"
                />
                <label htmlFor="bulk-send-email" className="cursor-pointer">
                  <p className="text-sm font-medium text-foreground">
                    Send personalized email sequence
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Day 1, Day 3, Day 5 touch sequence
                  </p>
                </label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="bulk-send-call"
                  checked={sendCall}
                  onCheckedChange={(v) => setSendCall(Boolean(v))}
                  className="mt-0.5"
                  data-ocid="bulk-outreach.checkbox"
                />
                <label htmlFor="bulk-send-call" className="cursor-pointer">
                  <p className="text-sm font-medium text-foreground">
                    Enable 60-second outbound call
                  </p>
                  <p className="text-xs text-muted-foreground">
                    AI calls prospect after kit generation
                  </p>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Sequence template
                </Label>
                <div className="relative">
                  <select
                    value={template}
                    onChange={(e) =>
                      setTemplate(e.target.value as SequenceTemplate)
                    }
                    className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    data-ocid="bulk-outreach.select"
                  >
                    <option value="standard">Standard (audit tripwire)</option>
                    <option value="high-urgency">
                      High-urgency (48hr expiry)
                    </option>
                    <option value="soft-intro">Soft intro (educational)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  From name
                </Label>
                <Input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="bg-muted/40 border-border text-sm"
                  data-ocid="bulk-outreach.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Custom intro line{" "}
                  <span className="text-muted-foreground/60">(optional)</span>
                </Label>
                <Input
                  value={customIntro}
                  onChange={(e) => setCustomIntro(e.target.value)}
                  placeholder="Override the first email's opening…"
                  className="bg-muted/40 border-border text-sm"
                  data-ocid="bulk-outreach.input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 — Launch */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
              4
            </span>
            <p className="text-sm font-semibold text-foreground">Launch</p>
          </div>

          {generating ? (
            <div
              className="bg-primary/10 border border-primary/20 rounded-xl p-5 flex flex-col gap-3"
              data-ocid="bulk-outreach.loading_state"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  Generating kit {genProgress} of {csvRows.length}…
                </span>
                <span className="text-primary font-semibold">
                  {Math.round((genProgress / csvRows.length) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-200"
                  style={{ width: `${(genProgress / csvRows.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <Button
              className="h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 disabled:opacity-40"
              disabled={csvRows.length === 0}
              onClick={() => setShowConfirm(true)}
              data-ocid="bulk-outreach.primary_button"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate {csvRows.length > 0 ? csvRows.length : "N"} Personalized
              Kits & Queue Outreach
            </Button>
          )}
        </div>
      </div>

      {showConfirm && (
        <BulkLaunchModal
          count={csvRows.length}
          niche={selectedNiche}
          onConfirm={() => void handleLaunch()}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

// ─── Pipeline Header ──────────────────────────────────────────────────────────

interface FunnelPipelineStats {
  sent: number;
  opened: number;
  activated: number;
  active: number;
  closing: number;
  converted: number;
  expired: number;
  total: number;
}

function PipelineHeader({ stats }: { stats: FunnelPipelineStats }) {
  const stages = [
    { label: "Sent", count: stats.sent, color: "#6366f1" },
    { label: "Opened", count: stats.opened, color: "#f59e0b" },
    { label: "Activated", count: stats.activated, color: "#06b6d4" },
    { label: "Active", count: stats.active, color: "#3b82f6" },
    { label: "Closing", count: stats.closing, color: "#f97316" },
    { label: "Converted", count: stats.converted, color: "#10b981" },
    { label: "Expired", count: stats.expired, color: "#ef4444" },
  ];
  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden"
      data-ocid="brand-kit-trials.pipeline.panel"
    >
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-sm text-foreground">
          Prospect Pipeline
        </h2>
        <span className="ml-auto text-xs text-muted-foreground">
          {stats.total} total prospects
        </span>
      </div>
      <div className="flex overflow-x-auto">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center px-5 py-4 gap-1.5 min-w-[90px]">
              <span
                className="text-2xl font-bold tabular-nums"
                style={{ color: stage.color }}
              >
                {stage.count}
              </span>
              <span className="text-xs text-muted-foreground">
                {stage.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Outreach Stats Card ──────────────────────────────────────────────────────

interface OutreachStats {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  byNiche: Array<[string, number]>;
}

function OutreachStatsCard({ stats }: { stats: OutreachStats }) {
  const openRate =
    stats.totalSent > 0
      ? Math.round((stats.totalOpened / stats.totalSent) * 100)
      : 0;
  const clickRate =
    stats.totalOpened > 0
      ? Math.round((stats.totalClicked / stats.totalOpened) * 100)
      : 0;
  const convRate =
    stats.totalClicked > 0
      ? Math.round((stats.totalConverted / stats.totalClicked) * 100)
      : 0;
  const topNicheEntry = [...stats.byNiche].sort((a, b) => b[1] - a[1])[0];
  const topNiche = topNicheEntry
    ? (NICHE_LABELS[topNicheEntry[0] as BrandKitNiche] ?? topNicheEntry[0])
    : "—";

  const metrics = [
    {
      label: "Kits Sent",
      value: String(stats.totalSent),
      color: "oklch(0.6 0.18 240)",
    },
    { label: "Open Rate", value: `${openRate}%`, color: "oklch(0.72 0.18 75)" },
    {
      label: "Click Rate",
      value: `${clickRate}%`,
      color: "oklch(0.58 0.22 290)",
    },
    {
      label: "Conv. Rate",
      value: `${convRate}%`,
      color: "oklch(0.62 0.18 155)",
    },
    { label: "Top Niche", value: topNiche, color: "oklch(0.78 0.1 280)" },
  ];

  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden"
      data-ocid="brand-kit-trials.outreach_stats.panel"
    >
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <Send className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-sm text-foreground">
          Outreach Stats
        </h2>
      </div>
      <div className="flex overflow-x-auto">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex flex-col items-center px-5 py-4 gap-1 min-w-[100px] flex-shrink-0 border-r border-border/50 last:border-0"
          >
            <span className="text-lg font-bold" style={{ color: m.color }}>
              {m.value}
            </span>
            <span className="text-xs text-muted-foreground">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Nudge Schedule Expanded Row ──────────────────────────────────────────────

function NudgeScheduleRow({
  schedule,
}: { schedule: WarmSequenceEmailSchedule[] }) {
  const statusStyles: Record<WarmSequenceEmailSchedule["status"], string> = {
    scheduled: "text-muted-foreground",
    sent: "text-blue-400",
    opened: "text-emerald-400",
  };
  const statusLabels: Record<WarmSequenceEmailSchedule["status"], string> = {
    scheduled: "Scheduled",
    sent: "Sent",
    opened: "Opened",
  };

  return (
    <td
      colSpan={9}
      className="px-4 pb-3 pt-1 bg-muted/20 border-t border-border/40"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Nudge Email Schedule
      </p>
      <div className="flex flex-col gap-1.5">
        {schedule.map((email) => (
          <div
            key={email.id}
            className="flex items-start gap-3 bg-card/60 rounded-lg px-3 py-2"
          >
            <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">
              Day {email.day}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {email.subject}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {email.previewText}
              </p>
            </div>
            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
              <span
                className={`text-xs font-medium ${statusStyles[email.status]}`}
              >
                {statusLabels[email.status]}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(email.scheduledAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </td>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBrandKitTrialsPage() {
  const navigate = useNavigate();
  const {
    prospects,
    outreachJobs,
    funnelStats,
    getBrandKitFunnelStats,
    getBrandKitOutreachStats,
    getTrialNudgeSchedule,
    seedDemoProspects,
    markConverted,
    createOutreachJob,
    createProspect,
  } = useBrandKit();

  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState<BrandKitNiche | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [followUpProspect, setFollowUpProspect] =
    useState<BrandKitProspect | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [expandedNudgeSlug, setExpandedNudgeSlug] = useState<string | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkFollowUp, setShowBulkFollowUp] = useState(false);
  const pipelineSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prospects.length === 0) seedDemoProspects();
  }, [prospects.length, seedDemoProspects]);

  const pipelineStats = getBrandKitFunnelStats();
  const outreachStats = getBrandKitOutreachStats();

  const toggleNudgeRow = (slug: string) => {
    setExpandedNudgeSlug((prev) => (prev === slug ? null : slug));
  };

  const filteredProspects = useMemo(() => {
    return prospects
      .filter((p) => !p.isArchived)
      .filter((p) => {
        const matchNiche = nicheFilter === "all" || p.niche === nicheFilter;
        const matchStatus =
          statusFilter === "all" || getProspectFilterStatus(p) === statusFilter;
        const matchSearch =
          !search ||
          p.businessName.toLowerCase().includes(search.toLowerCase());
        return matchNiche && matchStatus && matchSearch;
      });
  }, [prospects, nicheFilter, statusFilter, search]);

  // Pipeline stats for the new 5 stat cards
  const pipelineStatCards = useMemo(() => {
    const opened = filteredProspects.filter(
      (p) => p.lastOpenedAt || p.outreachKitOpenedAt,
    ).length;
    const trialActive = filteredProspects.filter(
      (p) => p.trialStatus === "Active",
    ).length;
    const converted = filteredProspects.filter(
      (p) => p.trialStatus === "Converted",
    ).length;
    const followUpNeeded = filteredProspects.filter((p) => {
      const sentAt = p.outreachKitSentAt;
      return (
        sentAt &&
        !p.lastOpenedAt &&
        Date.now() - sentAt > 48 * 60 * 60 * 1000 &&
        p.trialStatus === "NotStarted"
      );
    }).length;
    return {
      total: filteredProspects.length,
      opened,
      trialActive,
      converted,
      followUpNeeded,
    };
  }, [filteredProspects]);

  const nichePerformance = useMemo(() => {
    const niches = Object.keys(NICHE_LABELS) as BrandKitNiche[];
    return niches.map((niche) => {
      const nicheProspects = prospects.filter((p) => p.niche === niche);
      const converted = nicheProspects.filter(
        (p) => p.trialStatus === "Converted",
      ).length;
      const rate =
        nicheProspects.length > 0
          ? Math.round((converted / nicheProspects.length) * 100)
          : 0;
      return { niche, total: nicheProspects.length, converted, rate };
    });
  }, [prospects]);

  const handleCopyKitLink = (slug: string) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/brand-kit/${slug}`,
    );
    setCopiedSlug(slug);
    toast.success("Kit link copied");
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Selection helpers
  const allVisibleIds = useMemo(
    () => filteredProspects.map((p) => p.id),
    [filteredProspects],
  );
  const allSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedIds.has(id));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(allVisibleIds));
  };

  const handleBulkMarkConverted = () => {
    const slugs = filteredProspects
      .filter((p) => selectedIds.has(p.id))
      .map((p) => p.kitPageSlug);
    for (const slug of slugs) markConverted(slug);
    setSelectedIds(new Set());
    toast.success(`${slugs.length} prospects marked as converted`);
  };

  const handleBulkGenerated = useCallback(
    (
      rows: CsvRow[],
      niche: BrandKitNiche,
      opts: {
        sendEmail: boolean;
        sendCall: boolean;
        template: SequenceTemplate;
        fromName: string;
        customIntro: string;
      },
    ) => {
      const batchId = `batch-${Date.now()}`;
      for (const row of rows) {
        createOutreachJob(
          niche,
          row.business_name,
          `${row.business_name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          row.city,
        );
        // Also create a prospect record for each row
        try {
          createProspect({
            firstName: row.business_name.split(" ")[0],
            businessName: row.business_name,
            niche,
            city: row.city,
            phone: row.phone ?? "",
            website: row.website ?? "",
          });
        } catch {
          // silently continue
        }
      }
      // Scroll to pipeline section
      setTimeout(() => {
        pipelineSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      void opts; // suppress unused warning — opts drives server-side outreach when connected
      void batchId;
    },
    [createOutreachJob, createProspect],
  );

  const allNiches = Object.keys(NICHE_LABELS) as BrandKitNiche[];

  return (
    <div
      className="flex flex-col min-h-full bg-background"
      data-ocid="brand-kit-trials.page"
    >
      {/* Page Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-screen-xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Brand Kit Command Center
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all active demo kits, trial activations, and bulk outreach
              campaigns
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-6 py-6 flex flex-col gap-8">
        {/* SECTION 1 — Bulk Outreach Tool */}
        <BulkOutreachSection onBulkGenerated={handleBulkGenerated} />

        {/* SECTION 2 — Pipeline + Outreach Stats */}
        <div ref={pipelineSectionRef} className="flex flex-col gap-4">
          <PipelineHeader stats={pipelineStats} />
          <OutreachStatsCard stats={outreachStats} />
        </div>

        {/* SECTION 3 — Overall Funnel Stats */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="brand-kit-trials.section"
        >
          <StatCard
            label="Total Kits Generated"
            value={funnelStats.totalProspects}
            total={funnelStats.totalProspects}
            icon={Users}
            color="oklch(0.58 0.22 290)"
          />
          <StatCard
            label="Trial Activated"
            value={funnelStats.activated}
            total={funnelStats.totalProspects}
            icon={Zap}
            color="oklch(0.6 0.18 240)"
          />
          <StatCard
            label="In Trial"
            value={prospects.filter((p) => p.trialStatus === "Active").length}
            total={funnelStats.totalProspects}
            icon={TrendingUp}
            color="oklch(0.72 0.18 75)"
          />
          <StatCard
            label="Converted"
            value={funnelStats.converted}
            total={funnelStats.totalProspects}
            icon={Check}
            color="oklch(0.62 0.18 155)"
          />
        </div>

        {/* SECTION 4 — Pipeline Stat Cards (5 cards) */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          data-ocid="brand-kit-trials.section"
        >
          <StatCard
            label="Total Kits"
            value={pipelineStatCards.total}
            total={pipelineStatCards.total || 1}
            icon={Users}
            color="#6b7280"
          />
          <StatCard
            label="Opened"
            value={pipelineStatCards.opened}
            total={pipelineStatCards.total}
            icon={Mail}
            color="#f59e0b"
          />
          <StatCard
            label="Trial Active"
            value={pipelineStatCards.trialActive}
            total={pipelineStatCards.total}
            icon={Zap}
            color="#a855f7"
          />
          <StatCard
            label="Converted"
            value={pipelineStatCards.converted}
            total={pipelineStatCards.total}
            icon={Check}
            color="#10b981"
          />
          <StatCard
            label="Follow-up Needed"
            value={pipelineStatCards.followUpNeeded}
            total={pipelineStatCards.total}
            icon={AlertCircle}
            color="#ef4444"
          />
        </div>

        {/* SECTION 5 — All Demo Kits Table */}
        <div className="flex flex-col gap-4" data-ocid="brand-kit-trials.table">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-lg font-semibold text-foreground">
              All Demo Kits
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search businesses…"
                  className="pl-9 pr-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-48"
                  data-ocid="brand-kit-trials.search_input"
                />
              </div>
              <div className="relative">
                <select
                  value={nicheFilter}
                  onChange={(e) =>
                    setNicheFilter(e.target.value as BrandKitNiche | "all")
                  }
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  data-ocid="brand-kit-trials.select"
                >
                  <option value="all">All Niches</option>
                  {allNiches.map((n) => (
                    <option key={n} value={n}>
                      {NICHE_LABELS[n]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  data-ocid="brand-kit-trials.select"
                >
                  <option value="all">All Statuses</option>
                  <option value="waiting">Waiting</option>
                  <option value="opened">Opened</option>
                  <option value="follow-up">Follow-up Needed</option>
                  <option value="active">Active</option>
                  <option value="closing">Closing</option>
                  <option value="expired">Expired</option>
                  <option value="converted">Converted</option>
                </select>
                <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    {/* Select All */}
                    <th className="px-3 py-3 w-10">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                        data-ocid="brand-kit-trials.checkbox"
                      />
                    </th>
                    {[
                      "Business Name",
                      "Niche",
                      "City",
                      "Status",
                      "Progress",
                      "Last Activity",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProspects.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-12 text-muted-foreground"
                        data-ocid="brand-kit-trials.empty_state"
                      >
                        <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">
                          No prospects match your filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredProspects.map((prospect, idx) => {
                      const progress =
                        prospect.trialStatus === "Active" &&
                        prospect.trialDay > 0
                          ? Math.round((prospect.trialDay / 7) * 100)
                          : 0;
                      const daysLeft =
                        prospect.trialStatus === "Active"
                          ? Math.max(0, 7 - prospect.trialDay)
                          : 0;
                      const nudgeOpen =
                        expandedNudgeSlug === prospect.kitPageSlug;
                      const isSelected = selectedIds.has(prospect.id);
                      return (
                        <>
                          <tr
                            key={prospect.id}
                            className={`border-b border-border/60 hover:bg-muted/20 transition-colors ${isSelected ? "bg-primary/5" : ""}`}
                            data-ocid={`brand-kit-trials.item.${idx + 1}`}
                          >
                            {/* Row checkbox */}
                            <td className="px-3 py-3.5 w-10">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  toggleSelect(prospect.id)
                                }
                                aria-label={`Select ${prospect.businessName}`}
                                data-ocid={`brand-kit-trials.checkbox.${idx + 1}`}
                              />
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleNudgeRow(prospect.kitPageSlug)
                                  }
                                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                                  aria-label="Toggle nudge schedule"
                                >
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 transition-transform ${nudgeOpen ? "rotate-90" : ""}`}
                                  />
                                </button>
                                <span className="font-medium text-foreground truncate max-w-[160px] block">
                                  {prospect.businessName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <NicheBadge niche={prospect.niche} />
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground">
                              {prospect.city}
                            </td>
                            <td className="px-4 py-3.5">
                              {getEnhancedStatusBadge(prospect)}
                            </td>
                            <td className="px-4 py-3.5 min-w-[140px]">
                              {prospect.trialStatus === "Active" ? (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">
                                      Day {prospect.trialDay}/7
                                    </span>
                                    <span className="font-medium text-foreground">
                                      {daysLeft}d left
                                    </span>
                                  </div>
                                  <div className="h-1.5 rounded-full overflow-hidden bg-muted/60">
                                    <div
                                      className="h-full rounded-full transition-all"
                                      style={{
                                        width: `${progress}%`,
                                        backgroundColor:
                                          prospect.trialDay >= 6
                                            ? "oklch(0.72 0.18 75)"
                                            : "oklch(0.58 0.22 290)",
                                      }}
                                    />
                                  </div>
                                </div>
                              ) : prospect.trialStatus === "NotStarted" ? (
                                <span className="text-xs text-muted-foreground">
                                  Not started
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {prospect.trialDay === 8 ? "Complete" : "—"}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                              {timeAgo(prospect.lastActivityAt)}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1">
                                {/* Follow-up icon button */}
                                <button
                                  type="button"
                                  title="Send Follow-up"
                                  onClick={() => {
                                    setFollowUpProspect(prospect);
                                    toast.info(
                                      "Follow-up queued — copy template below",
                                    );
                                  }}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                  data-ocid={`brand-kit-trials.secondary_button.${idx + 1}`}
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                                {/* View Kit icon button */}
                                <button
                                  type="button"
                                  title="View Kit"
                                  onClick={() =>
                                    void navigate({
                                      to: `/brand-kit/${prospect.kitPageSlug}`,
                                    })
                                  }
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                  data-ocid={`brand-kit-trials.link.${idx + 1}`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                                {/* Copy link */}
                                <button
                                  type="button"
                                  title="Copy Kit Link"
                                  onClick={() =>
                                    handleCopyKitLink(prospect.kitPageSlug)
                                  }
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                  data-ocid={`brand-kit-trials.button.${idx + 1}`}
                                >
                                  {copiedSlug === prospect.kitPageSlug ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <ClipboardCopy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                {/* Mark Converted icon button */}
                                {prospect.trialStatus !== "Converted" && (
                                  <button
                                    type="button"
                                    title="Mark Converted"
                                    onClick={() => {
                                      markConverted(prospect.kitPageSlug);
                                      toast.success(
                                        `${prospect.businessName} marked as converted`,
                                      );
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                    data-ocid={`brand-kit-trials.confirm_button.${idx + 1}`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                          {nudgeOpen && (
                            <tr
                              key={`nudge-${prospect.id}`}
                              className="bg-muted/10"
                            >
                              <td />
                              <NudgeScheduleRow
                                schedule={getTrialNudgeSchedule(
                                  prospect.kitPageSlug,
                                )}
                              />
                            </tr>
                          )}
                        </>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 6 — Outreach Jobs Table */}
        <div
          className="flex flex-col gap-4"
          data-ocid="brand-kit-trials.section"
        >
          <h2 className="text-lg font-semibold text-foreground">
            Outreach Campaigns
          </h2>
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    {[
                      "Business",
                      "Niche",
                      "City",
                      "Status",
                      "Sent",
                      "Opened",
                      "Clicked",
                      "Converted",
                      "Kit Link",
                    ].map((col) => (
                      <th
                        key={col}
                        className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {outreachJobs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-10 text-muted-foreground"
                        data-ocid="outreach-jobs.empty_state"
                      >
                        <Send className="w-7 h-7 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">
                          No outreach campaigns yet. Use the Bulk Outreach tool
                          above.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    outreachJobs.map((job, idx) => (
                      <tr
                        key={job.id}
                        className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                        data-ocid={`outreach-jobs.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3.5 font-medium text-foreground">
                          {job.targetBusinessName}
                        </td>
                        <td className="px-4 py-3.5">
                          <NicheBadge niche={job.niche} />
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {job.targetCity}
                        </td>
                        <td className="px-4 py-3.5">
                          {getOutreachStatusBadge(job.status)}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground text-xs">
                          {job.sentAt ? timeAgo(job.sentAt) : "—"}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground text-xs">
                          {job.openedAt ? timeAgo(job.openedAt) : "—"}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground text-xs">
                          {job.clickedAt ? "Yes" : "—"}
                        </td>
                        <td className="px-4 py-3.5 text-xs">
                          {job.status === "converted" ? (
                            <span className="text-emerald-400 font-semibold">
                              ✓
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleCopyKitLink(job.kitSlug)}
                            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                            data-ocid={`outreach-jobs.button.${idx + 1}`}
                          >
                            {copiedSlug === job.kitSlug ? (
                              <>
                                <Check className="w-3 h-3" /> Copied
                              </>
                            ) : (
                              <>
                                <ClipboardCopy className="w-3 h-3" /> Copy Link
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 7 — Niche Performance */}
        <div
          className="flex flex-col gap-4"
          data-ocid="brand-kit-trials.section"
        >
          <h2 className="text-lg font-semibold text-foreground">
            Niche Performance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {nichePerformance.map(({ niche, total, rate }) => {
              const colors = NICHE_COLORS[niche];
              return (
                <div
                  key={niche}
                  className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-border/60 transition-colors"
                >
                  <NicheBadge niche={niche} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xl font-bold text-foreground tabular-nums">
                      {total}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      kits generated
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Conv. rate</span>
                      <span
                        className="font-semibold"
                        style={{ color: rate > 0 ? colors.primary : undefined }}
                      >
                        {rate}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${rate}%`,
                          backgroundColor: colors.primary,
                        }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNicheFilter(niche);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium mt-auto"
                    data-ocid="niche-perf.link"
                  >
                    View All <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {someSelected && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-card border border-border shadow-2xl shadow-black/30 rounded-2xl px-5 py-3"
          data-ocid="bulk-actions.panel"
        >
          <span className="text-sm font-semibold text-foreground">
            {selectedIds.size} selected
          </span>
          <div className="w-px h-5 bg-border" />
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowBulkFollowUp(true)}
            className="gap-1.5"
            data-ocid="bulk-actions.secondary_button"
          >
            <Send className="w-3.5 h-3.5" /> Send Follow-up
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
            onClick={handleBulkMarkConverted}
            data-ocid="bulk-actions.confirm_button"
          >
            <Check className="w-3.5 h-3.5" /> Mark Converted
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => {
              toast.info(`${selectedIds.size} prospects archived`);
              setSelectedIds(new Set());
            }}
            data-ocid="bulk-actions.delete_button"
          >
            <Archive className="w-3.5 h-3.5" /> Archive
          </Button>
          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            className="text-muted-foreground hover:text-foreground transition-colors ml-1"
            data-ocid="bulk-actions.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      {followUpProspect && (
        <FollowUpModal
          prospect={followUpProspect}
          onClose={() => setFollowUpProspect(null)}
        />
      )}
      {showBulkFollowUp && (
        <BulkFollowUpModal
          count={selectedIds.size}
          onConfirm={(tmpl) => {
            toast.success(
              `Follow-up queued for ${selectedIds.size} prospects using "${tmpl}" template`,
            );
            setSelectedIds(new Set());
          }}
          onClose={() => setShowBulkFollowUp(false)}
        />
      )}
    </div>
  );
}
