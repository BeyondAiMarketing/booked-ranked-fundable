import type { ProviderConfig, ProviderType } from "@/types/ragBrain";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTimestamp(ts?: bigint | number): string {
  if (!ts) return "Never";
  const ms = typeof ts === "bigint" ? Number(ts) / 1_000_000 : ts;
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getProviderLabel(type: ProviderType): string {
  const labels: Record<ProviderType, string> = {
    NVIDIA: "NVIDIA NIM",
    OpenAI: "OpenAI",
    Claude: "Anthropic Claude",
    Cached: "Cached Results",
  };
  return labels[type];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: ProviderConfig["lastPingStatus"] }) {
  if (status === "ok") {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_oklch(0.74_0.18_152/0.6)] animate-pulse"
        aria-label="Connected"
      />
    );
  }
  if (status === "error") {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_2px_oklch(0.6_0.22_15/0.6)]"
        aria-label="Error"
      />
    );
  }
  return (
    <span
      className="inline-block w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_2px_oklch(0.85_0.17_85/0.5)]"
      aria-label="Untested"
    />
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface AIProviderStatusBadgeProps {
  provider: ProviderConfig;
  compact?: boolean;
  className?: string;
}

export function AIProviderStatusBadge({
  provider,
  compact = false,
  className = "",
}: AIProviderStatusBadgeProps) {
  const label = getProviderLabel(provider.providerType);
  const pingTime = formatTimestamp(provider.lastPingTimestamp);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
          bg-white/5 border border-white/10 backdrop-blur-sm ${className}`}
        data-ocid={`ai_provider.${provider.providerType.toLowerCase()}.badge`}
      >
        <StatusDot status={provider.lastPingStatus} />
        <span className="text-foreground/80">{label}</span>
      </span>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 p-3 rounded-xl
        bg-white/5 border border-white/10 backdrop-blur-sm
        hover:bg-white/8 transition-colors duration-200 ${className}`}
      data-ocid={`ai_provider.${provider.providerType.toLowerCase()}.card`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <StatusDot status={provider.lastPingStatus} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {label}
          </p>
          {provider.modelName && (
            <p className="text-xs text-foreground/50 truncate">
              {provider.modelName}
            </p>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-foreground/40">Last ping</p>
        <p className="text-xs text-foreground/70 font-mono">{pingTime}</p>
      </div>
    </div>
  );
}
