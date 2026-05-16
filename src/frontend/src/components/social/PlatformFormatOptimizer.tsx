import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

// ── Types ────────────────────────────────────────────────────────────────────

interface PlatformVariant {
  key: string;
  label: string;
  tone: string;
  hashtagCount: string;
  charLimit: number;
  colorClass: string;
  format: (content: string) => string;
}

interface PlatformFormatOptimizerProps {
  content: string;
  enabledPlatforms: Set<string>;
  onTogglePlatform: (platform: string) => void;
}

// ── Platform variant generators ───────────────────────────────────────────────

const PLATFORM_VARIANTS: PlatformVariant[] = [
  {
    key: "facebook",
    label: "Facebook",
    tone: "Community & trust",
    hashtagCount: "2–3 hashtags",
    charLimit: 63206,
    colorClass: "text-blue-400",
    format: (content) => {
      const lines = content.split("\n").filter(Boolean).slice(0, 6);
      const body = lines.join("\n\n");
      return `${body}\n\n💬 Drop a comment or DM us — we'd love to help.\n\n#LocalService #TrustedPros #Community`;
    },
  },
  {
    key: "instagram",
    label: "Instagram",
    tone: "Visual-first, punchy",
    hashtagCount: "5–10 hashtags",
    charLimit: 2200,
    colorClass: "text-amber-400",
    format: (content) => {
      const hook = content.split(".")[0] ?? content.slice(0, 80);
      const rest = content.split("\n").slice(0, 3).join("\n");
      return `✨ ${hook.trim()}\n\n${rest.trim()}\n\n⬇️ Book in our bio link\n\n#LocalBusiness #BeforeAndAfter #SmallBiz #ServiceBusiness #LocalServices #Community #Transformation #RealResults`;
    },
  },
  {
    key: "google_business",
    label: "Google Business",
    tone: "SEO-focused, local",
    hashtagCount: "No hashtags",
    charLimit: 1500,
    format: (content) => {
      const trimmed = content.replace(/#\w+/g, "").trim();
      const sentences = `${trimmed
        .split(/[.!?]\s+/)
        .slice(0, 4)
        .join(". ")}.`;
      return `${sentences}\n\nServing local residents with expert service — same-day availability. Call us or book online today.`;
    },
    colorClass: "text-rose-400",
  },
  {
    key: "tiktok",
    label: "TikTok",
    tone: "Short, punchy, trending",
    hashtagCount: "3–5 trending tags",
    charLimit: 2200,
    format: (content) => {
      const hook = content.split("\n")[0] ?? content.slice(0, 60);
      return `POV: ${hook.trim()} 🤯\n\nWould you have done this yourself? 👇\n\n🎵 Trending audio: "satisfying work"\n\n#Satisfying #WorkLife #LocalBusiness #Viral #BeforeAfter`;
    },
    colorClass: "text-cyan-400",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    tone: "Professional, insight-driven",
    hashtagCount: "3 professional tags",
    charLimit: 3000,
    format: (content) => {
      const stripped = content.replace(/#\w+/g, "").trim();
      return `Insight from the field:\n\n${stripped}\n\nThis is the standard we hold ourselves to on every job. The details matter — and clients notice.\n\nWhat does your team's "non-negotiable" look like?\n\n#SmallBusiness #ServiceIndustry #Entrepreneurship`;
    },
    colorClass: "text-sky-400",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function PlatformFormatOptimizer({
  content,
  enabledPlatforms,
  onTogglePlatform,
}: PlatformFormatOptimizerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  function copyVariant(key: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      toast.success(`${key} variant copied`);
      setTimeout(() => setCopiedKey(null), 1800);
    });
  }

  if (!content) {
    return (
      <div
        className="rounded-xl border border-dashed border-border p-6 text-center"
        data-ocid="social.platform_optimizer.empty_state"
      >
        <p className="text-xs text-muted-foreground">
          Generate a post above to see platform-specific variants
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-ocid="social.platform_optimizer.panel">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">
          Platform-Native Variants
        </p>
        <p className="text-[10px] text-muted-foreground">
          Toggle platforms to include in scheduled post
        </p>
      </div>

      {PLATFORM_VARIANTS.map((pv) => {
        const variant = pv.format(content);
        const charCount = variant.length;
        const isOver = charCount > pv.charLimit;
        const pct = Math.min(100, (charCount / pv.charLimit) * 100);
        const isEnabled = enabledPlatforms.has(pv.key);
        const isCopied = copiedKey === pv.key;

        return (
          <div
            key={pv.key}
            data-ocid={`social.platform_optimizer.${pv.key}`}
            className={`rounded-xl border transition-all ${
              isEnabled
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-4 py-2.5 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {/* Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isEnabled}
                  data-ocid={`social.platform_optimizer.${pv.key}.toggle`}
                  onClick={() => onTogglePlatform(pv.key)}
                  className={`w-8 h-4 rounded-full transition-all relative shrink-0 ${
                    isEnabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                      isEnabled ? "left-4" : "left-0.5"
                    }`}
                  />
                </button>
                <span className={`text-xs font-semibold ${pv.colorClass}`}>
                  {pv.label}
                </span>
                <Badge
                  variant="secondary"
                  className="text-[9px] hidden sm:inline-flex"
                >
                  {pv.tone}
                </Badge>
                <span className="text-[9px] text-muted-foreground hidden md:block">
                  {pv.hashtagCount}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] tabular-nums ${
                    isOver ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {charCount.toLocaleString()}/{pv.charLimit.toLocaleString()}
                </span>
                <button
                  type="button"
                  data-ocid={`social.platform_optimizer.${pv.key}.copy.button`}
                  onClick={() => copyVariant(pv.key, variant)}
                  className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  {isCopied ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
            </div>

            {/* Char progress bar */}
            <div className="h-0.5 mx-4 mb-2 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isOver ? "bg-destructive" : "bg-primary/50"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Content preview */}
            <div className="px-4 pb-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-wrap">
                {variant}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
