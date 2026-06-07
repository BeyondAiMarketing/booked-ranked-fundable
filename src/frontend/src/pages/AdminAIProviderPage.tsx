import { AIProviderStatusBadge } from "@/components/AIProviderStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRagBrain } from "@/hooks/useRagBrain";
import type { ProviderConfig, ProviderType } from "@/types/ragBrain";
import {
  ActivitySquare,
  Brain,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Save,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const PROVIDER_META: Record<
  ProviderType,
  { label: string; description: string; color: string; icon: string }
> = {
  NVIDIA: {
    label: "NVIDIA NIM",
    description: "Primary AI provider. Powers RAG, embeddings, and reranking.",
    color: "text-emerald-400",
    icon: "🟢",
  },
  OpenAI: {
    label: "OpenAI",
    description: "Fallback provider for completions and embeddings.",
    color: "text-sky-400",
    icon: "🔵",
  },
  Claude: {
    label: "Anthropic Claude",
    description: "Secondary fallback for complex reasoning tasks.",
    color: "text-violet-400",
    icon: "🟣",
  },
  Cached: {
    label: "Cached Results",
    description:
      "Returns pre-cached responses when live providers are offline.",
    color: "text-amber-400",
    icon: "🟡",
  },
};

export default function AdminAIProviderPage() {
  const { getProviderConfigs, saveProviderConfig, pingProvider, isLoading } =
    useRagBrain();
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [pinging, setPinging] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    const configs = await getProviderConfigs();
    if (configs) setProviders(configs);
  }, [getProviderConfigs]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCount = providers.filter((p) => p.isActive).length;
  const readinessScore =
    providers.length > 0
      ? Math.round((activeCount / providers.length) * 100)
      : 0;

  const handleSave = async (p: ProviderConfig) => {
    setSaving((s) => ({ ...s, [p.providerType]: true }));
    const updated: ProviderConfig = {
      ...p,
      apiKeyObfuscated: apiKeys[p.providerType] ?? p.apiKeyObfuscated,
    };
    await saveProviderConfig(updated);
    setSaving((s) => ({ ...s, [p.providerType]: false }));
    toast.success(`${PROVIDER_META[p.providerType].label} saved`);
    load();
  };

  const handlePing = async (type: ProviderType) => {
    setPinging((s) => ({ ...s, [type]: true }));
    const result = await pingProvider(type);
    setPinging((s) => ({ ...s, [type]: false }));
    if (result) {
      toast.success(`Ping OK — ${PROVIDER_META[type].label} is reachable`);
    } else {
      toast.error(`Ping failed — ${PROVIDER_META[type].label} unreachable`);
    }
    load();
  };

  const handleToggle = async (p: ProviderConfig) => {
    const updated = { ...p, isActive: !p.isActive };
    await saveProviderConfig(updated);
    toast.success(
      `${PROVIDER_META[p.providerType].label} ${updated.isActive ? "activated" : "deactivated"}`,
    );
    load();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.48 0.2 260 / 30%), oklch(0.62 0.2 200 / 20%))",
                  boxShadow: "0 0 20px oklch(0.62 0.2 200 / 40%)",
                }}
              >
                <Brain className="h-5 w-5 text-[oklch(0.62_0.2_200)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  AI Provider Settings
                </h1>
                <p className="text-sm text-muted-foreground">
                  Configure NVIDIA NIM and fallback AI providers
                </p>
              </div>
            </div>
          </div>

          {/* Readiness Score */}
          <div
            className="rounded-2xl border border-border/50 p-4 backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.48 0.2 260 / 10%), oklch(0.16 0.014 280))",
            }}
          >
            <div className="mb-1 flex items-center gap-2">
              <ActivitySquare className="h-4 w-4 text-[oklch(0.62_0.2_200)]" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                AI Readiness
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold tabular-nums text-foreground">
                {readinessScore}
              </span>
              <span className="mb-1 text-lg text-muted-foreground">%</span>
            </div>
            <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[oklch(0.48_0.2_260)] to-[oklch(0.62_0.2_200)] transition-all duration-700"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {activeCount} of {providers.length} providers active
            </p>
          </div>
        </div>
      </div>

      {/* Provider Cards */}
      {isLoading && providers.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {providers.map((p) => {
            const meta = PROVIDER_META[p.providerType];
            return (
              <Card
                key={p.providerType}
                className="relative overflow-hidden border border-border/60 bg-card/80 p-6 backdrop-blur-sm"
                data-ocid={`ai-provider.${p.providerType.toLowerCase()}_card`}
              >
                {/* Neural top accent */}
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.62 0.2 200 / 60%), transparent)",
                  }}
                />

                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                      <h2 className="font-semibold text-foreground">
                        {meta.label}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AIProviderStatusBadge config={p} />
                    {/* Toggle active */}
                    <button
                      type="button"
                      onClick={() => handleToggle(p)}
                      className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${
                        p.isActive ? "bg-primary" : "bg-muted"
                      }`}
                      aria-label="Toggle provider"
                      data-ocid={`ai-provider.${p.providerType.toLowerCase()}_toggle`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                          p.isActive ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Model display */}
                {p.modelName && (
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">
                      Model:
                    </span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {p.modelName}
                    </Badge>
                  </div>
                )}

                {/* API Key field */}
                {p.providerType !== "Cached" && (
                  <div className="mb-4 space-y-1.5">
                    <label
                      htmlFor={`provider-api-key-${p.providerType}`}
                      className="text-xs font-medium text-muted-foreground"
                    >
                      API Key
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id={`provider-api-key-${p.providerType}`}
                          type={showKeys[p.providerType] ? "text" : "password"}
                          value={apiKeys[p.providerType] ?? p.apiKeyObfuscated}
                          onChange={(e) =>
                            setApiKeys((k) => ({
                              ...k,
                              [p.providerType]: e.target.value,
                            }))
                          }
                          placeholder="Enter API key..."
                          className="pr-9 font-mono text-sm"
                          data-ocid={`ai-provider.${p.providerType.toLowerCase()}_key_input`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowKeys((s) => ({
                              ...s,
                              [p.providerType]: !s[p.providerType],
                            }))
                          }
                          className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                          aria-label="Toggle key visibility"
                        >
                          {showKeys[p.providerType] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {p.providerType !== "Cached" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave(p)}
                      disabled={saving[p.providerType]}
                      className="gap-1.5"
                      data-ocid={`ai-provider.${p.providerType.toLowerCase()}_save_button`}
                    >
                      {saving[p.providerType] ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      Save
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePing(p.providerType)}
                    disabled={pinging[p.providerType] || !p.isActive}
                    className="gap-1.5"
                    data-ocid={`ai-provider.${p.providerType.toLowerCase()}_ping_button`}
                  >
                    {pinging[p.providerType] ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Zap className="h-3.5 w-3.5" />
                    )}
                    Test Ping
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={load}
                    className="ml-auto"
                    aria-label="Refresh"
                    data-ocid="ai-provider.refresh_button"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Last ping */}
                {p.lastPingTimestamp && (
                  <p className="mt-3 text-right text-xs text-muted-foreground">
                    Last tested:{" "}
                    {new Date(
                      Number(p.lastPingTimestamp) / 1_000_000,
                    ).toLocaleString()}
                  </p>
                )}

                {p.lastPingStatus === "ok" && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Connection verified
                  </div>
                )}

                {/* Endpoint / Auth helper */}
                <div className="mt-3 rounded-md bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                  {p.providerType === "OpenAI" && (
                    <>
                      <span className="font-medium text-foreground">
                        Endpoint:
                      </span>{" "}
                      https://api.openai.com/v1/chat/completions
                      <br />
                      <span className="font-medium text-foreground">Auth:</span>{" "}
                      Authorization: Bearer YOUR_KEY
                    </>
                  )}
                  {p.providerType === "Claude" && (
                    <>
                      <span className="font-medium text-foreground">
                        Endpoint:
                      </span>{" "}
                      https://api.anthropic.com/v1/messages
                      <br />
                      <span className="font-medium text-foreground">Auth:</span>{" "}
                      x-api-key: YOUR_KEY + anthropic-version: 2023-06-01
                    </>
                  )}
                  {p.providerType === "NVIDIA" && (
                    <>
                      <span className="font-medium text-foreground">
                        Endpoint:
                      </span>{" "}
                      https://integrate.api.nvidia.com/v1/chat/completions
                      <br />
                      <span className="font-medium text-foreground">Auth:</span>{" "}
                      Authorization: Bearer YOUR_KEY
                    </>
                  )}
                  {p.providerType === "Cached" && (
                    <>
                      <span className="font-medium text-foreground">Mode:</span>{" "}
                      Returns pre-cached responses when live providers are
                      offline. No API key required.
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
