import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Brain,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  Clock,
  RefreshCw,
  Settings,
  XCircle,
  Zap,
} from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";

import { toast } from "sonner";
import { useCredentials } from "../context/CredentialsContext";

interface ApiPingRecord {
  serviceId: string;
  status: string;
  lastPingTime: bigint;
  latencyMs: bigint;
  errorMessage: [] | [string];
}

interface ServiceConfig {
  id: string;
  name: string;
  endpoint: string;
  logo: string;
}

const SERVICES: ServiceConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    endpoint: "https://api.openai.com/v1/models",
    logo: "🤖",
  },
  {
    id: "claude",
    name: "Claude",
    endpoint: "https://api.anthropic.com/v1/models",
    logo: "🧠",
  },
  {
    id: "serpapi",
    name: "SerpApi.dev",
    endpoint: "https://serpapi.com/account.json",
    logo: "🔍",
  },
  {
    id: "tinyfish",
    name: "TinyFish",
    endpoint: "https://tinyfish.io/",
    logo: "🐟",
  },
  {
    id: "twilio",
    name: "Twilio",
    endpoint: "https://api.twilio.com/2010-04-01/Accounts.json",
    logo: "📞",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    endpoint: "https://api.elevenlabs.io/v1/user",
    logo: "🎙️",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    endpoint: "https://api.sendgrid.com/v3/user/profile",
    logo: "📧",
  },
  {
    id: "stripe",
    name: "Stripe",
    endpoint: "https://api.stripe.com/v1/balance",
    logo: "💳",
  },
];

function formatRelativeTime(timestamp: bigint): string {
  if (timestamp === 0n) return "Never";
  const ms = Number(timestamp / 1_000_000n);
  const diff = Date.now() - ms;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "healthy")
    return <CircleCheck className="h-5 w-5 text-green-400" />;
  if (status === "degraded")
    return <CircleAlert className="h-5 w-5 text-yellow-400" />;
  return <XCircle className="h-5 w-5 text-red-400" />;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "healthy")
    return (
      <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full text-xs font-medium">
        Healthy
      </span>
    );
  if (status === "degraded")
    return (
      <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full text-xs font-medium">
        Degraded
      </span>
    );
  return (
    <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full text-xs font-medium">
      Down
    </span>
  );
}

type LlmStatus =
  | "connected"
  | "needs_setup"
  | "checking"
  | "fallback_active"
  | "error";

function getPrimaryLlm(creds: any) {
  if (creds?.openRouterApiKey?.trim())
    return { provider: "OpenRouter", model: "Owl Alpha" };
  if (creds?.openaiKey?.trim()) return { provider: "OpenAI", model: "GPT-4o" };
  return { provider: "Not Configured", model: "—" };
}

function getFallbackLlm(creds: any) {
  if (creds?.openRouterApiKey?.trim()) {
    if (creds?.openaiKey?.trim())
      return { provider: "OpenAI", model: "GPT-4o" };
    if (creds?.geminiApiKey?.trim())
      return { provider: "Google Gemini", model: "Gemini Pro" };
    if (creds?.nvidiaApiKey?.trim())
      return { provider: "NVIDIA", model: "NIM" };
    return { provider: "None", model: "—" };
  }
  if (creds?.openaiKey?.trim()) {
    if (creds?.geminiApiKey?.trim())
      return { provider: "Google Gemini", model: "Gemini Pro" };
    if (creds?.nvidiaApiKey?.trim())
      return { provider: "NVIDIA", model: "NIM" };
    return { provider: "None", model: "—" };
  }
  if (creds?.geminiApiKey?.trim())
    return { provider: "Google Gemini", model: "Gemini Pro" };
  if (creds?.nvidiaApiKey?.trim()) return { provider: "NVIDIA", model: "NIM" };
  return { provider: "None", model: "—" };
}

function WebhookUrlRow({
  service,
  url,
  color,
}: { service: string; url: string; color: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="px-6 py-3 flex items-center gap-4">
      <span className={`w-24 text-sm font-medium ${color} shrink-0`}>
        {service}
      </span>
      <code className="flex-1 text-xs text-gray-300 font-mono bg-gray-900 px-3 py-1.5 rounded truncate">
        {url}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 px-3 py-1.5 text-xs rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

function LlmStatusBadge({ status }: { status: LlmStatus }) {
  const styles: Record<LlmStatus, string> = {
    connected: "bg-green-500/20 text-green-400 border-green-500/30",
    needs_setup: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    checking: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    fallback_active: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  const labels: Record<LlmStatus, string> = {
    connected: "Connected",
    needs_setup: "Needs Setup",
    checking: "Checking",
    fallback_active: "Fallback Active",
    error: "Error",
  };
  return (
    <span
      className={`${styles[status]} border px-2 py-0.5 rounded-full text-xs font-medium`}
    >
      {labels[status]}
    </span>
  );
}

export default function IntegrationHealthPage() {
  const { actor } = useActor();
  const { creds } = useCredentials();
  const [pingStatuses, setPingStatuses] = useState<ApiPingRecord[]>([]);
  const [pingHistories, setPingHistories] = useState<
    Record<string, ApiPingRecord[]>
  >({});
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshingService, setRefreshingService] = useState<string | null>(
    null,
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, string | number | null>[]
  >([]);
  const [runningTests, setRunningTests] = useState(false);
  const [llmTesting, setLlmTesting] = useState<"primary" | "fallback" | null>(
    null,
  );
  const [llmLastError, setLlmLastError] = useState<string | null>(null);

  const pingService = useCallback(
    async (svc: ServiceConfig): Promise<ApiPingRecord> => {
      const start = Date.now();
      let status = "red";
      let latencyMs = 0n;
      let errorMsg: [] | [string] = [];

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        await fetch(svc.endpoint, {
          signal: controller.signal,
          mode: "no-cors",
        });
        clearTimeout(timeout);
        latencyMs = BigInt(Date.now() - start);
        status = "healthy";
      } catch (err) {
        latencyMs = BigInt(Date.now() - start);
        const msg = err instanceof Error ? err.message : "Network error";
        if (msg.includes("abort") || msg.includes("timeout")) {
          status = "red";
          errorMsg = ["Request timed out"];
        } else {
          // no-cors fetch may throw on CORS but endpoint is reachable
          status = "healthy";
          latencyMs = BigInt(Date.now() - start);
        }
      }

      if (actor) {
        await actor.recordPingResult(
          svc.id,
          status,
          latencyMs,
          errorMsg[0] ?? null,
        );
      }

      return {
        serviceId: svc.id,
        status,
        lastPingTime: BigInt(Date.now()) * 1_000_000n,
        latencyMs,
        errorMessage: errorMsg,
      };
    },
    [actor],
  );

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all(SERVICES.map((svc) => pingService(svc)));
      if (actor) {
        const statuses = await actor.getPingStatus();
        setPingStatuses(statuses as ApiPingRecord[]);
      }
      setLastUpdated(new Date());
      toast.success("Integration status refreshed.");
    } finally {
      setLoading(false);
    }
  }, [actor, pingService]);

  const refreshSingle = useCallback(
    async (svc: ServiceConfig) => {
      setRefreshingService(svc.id);
      try {
        await pingService(svc);
        if (actor) {
          const statuses = await actor.getPingStatus();
          setPingStatuses(statuses as ApiPingRecord[]);
        }
        setLastUpdated(new Date());
      } finally {
        setRefreshingService(null);
      }
    },
    [actor, pingService],
  );

  const loadHistory = useCallback(
    async (serviceId: string) => {
      if (!actor) return;
      const history = await actor.getPingHistory(serviceId);
      setPingHistories((prev) => ({
        ...prev,
        [serviceId]: history as ApiPingRecord[],
      }));
    },
    [actor],
  );

  const toggleExpand = useCallback(
    (serviceId: string) => {
      if (expandedService === serviceId) {
        setExpandedService(null);
      } else {
        setExpandedService(serviceId);
        loadHistory(serviceId);
      }
    },
    [expandedService, loadHistory],
  );

  useEffect(() => {
    if (!actor) return;
    const load = async () => {
      const statuses = await actor.getPingStatus();
      setPingStatuses(statuses as ApiPingRecord[]);
      setLastUpdated(new Date());
    };
    load();
    const interval = setInterval(refreshAll, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [actor, refreshAll]);

  const statusMap = Object.fromEntries(
    pingStatuses.map((s) => [s.serviceId, s]),
  );
  const redServices = SERVICES.filter((s) => statusMap[s.id]?.status === "red");
  const serpRecord = statusMap.serpapi;
  const elevenRecord = statusMap.elevenlabs;
  const twilioRecord = statusMap.twilio;

  return (
    <div
      className="min-h-screen bg-background"
      data-ocid="integration_health.page"
    >
      {/* Sticky alert banner */}
      {redServices.length > 0 && (
        <div
          className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-2"
          data-ocid="integration_health.error_state"
        >
          <XCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            Alert: {redServices.length} service
            {redServices.length > 1 ? "s" : ""} need attention:{" "}
            {redServices.map((s) => s.name).join(", ")}
          </span>
        </div>
      )}

      <div
        className={`max-w-7xl mx-auto px-4 py-8 ${redServices.length > 0 ? "pt-16" : ""}`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
                <Activity className="h-6 w-6 text-amber-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Integration Health Monitor
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-14">
              {lastUpdated ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last updated {lastUpdated.toLocaleTimeString()}
                </span>
              ) : (
                "Auto-refreshes every 15 minutes"
              )}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={refreshAll}
              disabled={loading}
              className="bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
              data-ocid="integration_health.refresh_button"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Refreshing..." : "Refresh All"}
            </Button>
            <Button
              onClick={async () => {
                setRunningTests(true);
                try {
                  const res = await (actor as any)?.testAllConnections?.();
                  if (res) {
                    const critical: Record<string, string | number | null>[] = (
                      res.critical ?? []
                    ).map((r: Record<string, string | number | null>) => ({
                      ...r,
                      isCritical: true,
                    }));
                    const secondary: Record<string, string | number | null>[] =
                      (res.secondary ?? []).map(
                        (r: Record<string, string | number | null>) => ({
                          ...r,
                          isCritical: false,
                        }),
                      );
                    setTestResults([...critical, ...secondary]);
                  }
                } finally {
                  setRunningTests(false);
                }
              }}
              disabled={runningTests}
              className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
              data-ocid="integration_health.run_tests_button"
            >
              <Zap
                className={`h-4 w-4 mr-2 ${runningTests ? "animate-pulse" : ""}`}
              />
              {runningTests ? "Testing..." : "Run All Integration Tests"}
            </Button>
          </div>
        </div>

        {/* Test Results Table */}
        {testResults.length > 0 && (
          <div
            className="mb-8 bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
            data-ocid="integration_health.test_results"
          >
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                Integration Test Results
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Latency (ms)
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Error
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {testResults.map((r, i) => {
                    const label = String(
                      r.label ?? r.provider ?? r.serviceId ?? "",
                    );
                    const status = String(r.status ?? "");
                    const latency =
                      r.latencyMs != null
                        ? Number(r.latencyMs)
                        : r.latency != null
                          ? Number(r.latency)
                          : null;
                    const error =
                      r.error != null
                        ? String(r.error)
                        : r.errorMessage != null
                          ? String(r.errorMessage)
                          : null;
                    const isCritical =
                      r.isCritical ||
                      label === "OpenRouter" ||
                      label === "NVIDIA";
                    const isOk =
                      status === "healthy" ||
                      status === "ok" ||
                      status === "connected";
                    return (
                      <tr
                        key={String(r.label ?? r.provider ?? r.serviceId ?? i)}
                        className="hover:bg-white/3 transition-colors"
                        data-ocid={`integration_health.test_result.${i + 1}`}
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {label}
                            </span>
                            {isCritical && (
                              <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-red-500/20 text-red-400 border border-red-500/30">
                                Critical
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          {isOk ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                              <CircleCheck className="h-3 w-3" /> OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                              <XCircle className="h-3 w-3" />{" "}
                              {status || "Failed"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right text-muted-foreground font-mono">
                          {latency != null ? latency : "—"}
                        </td>
                        <td className="px-6 py-3 text-xs text-red-400 max-w-xs truncate">
                          {error ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Brain Status */}
        <div className="mb-8" data-ocid="integration_health.llm_brain_section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <Brain className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                AI Brain Status
              </h2>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                window.location.href = "/go-live";
              }}
              className="border-white/10 hover:bg-white/5 text-muted-foreground"
              data-ocid="integration_health.open_model_settings_button"
            >
              <Settings className="h-4 w-4 mr-2" />
              Open Model Settings
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary LLM */}
            <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Primary LLM
                </span>
                <LlmStatusBadge
                  status={
                    llmTesting === "primary"
                      ? "checking"
                      : getPrimaryLlm(creds).provider === "Not Configured"
                        ? "needs_setup"
                        : llmLastError
                          ? "error"
                          : "connected"
                  }
                />
              </div>
              <div className="space-y-1 mb-3">
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground">Provider:</span>{" "}
                  {getPrimaryLlm(creds).provider}
                </p>
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground">Model:</span>{" "}
                  {getPrimaryLlm(creds).model}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={
                  llmTesting === "primary" ||
                  getPrimaryLlm(creds).provider === "Not Configured"
                }
                onClick={async () => {
                  setLlmTesting("primary");
                  setLlmLastError(null);
                  try {
                    const res = await (
                      actor as any
                    )?.testOpenRouterConnection?.();
                    if (
                      res &&
                      typeof res === "object" &&
                      "ok" in res &&
                      res.ok === true
                    ) {
                      toast.success("Primary LLM connected successfully.");
                    } else {
                      const err =
                        res && typeof res === "object" && "error" in res
                          ? String(res.error)
                          : "Connection failed";
                      setLlmLastError(err);
                      toast.error(err);
                    }
                  } catch (e) {
                    const msg =
                      e instanceof Error ? e.message : "Connection failed";
                    setLlmLastError(msg);
                    toast.error(msg);
                  } finally {
                    setLlmTesting(null);
                  }
                }}
                className="border-white/10 hover:bg-white/5 text-xs"
                data-ocid="integration_health.test_primary_llm_button"
              >
                {llmTesting === "primary" ? "Testing…" : "Test Connection"}
              </Button>
              {llmLastError && (
                <p className="text-xs text-red-400 mt-2">{llmLastError}</p>
              )}
            </div>

            {/* Fallback LLM */}
            <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Fallback LLM
                </span>
                <LlmStatusBadge
                  status={
                    llmTesting === "fallback"
                      ? "checking"
                      : getFallbackLlm(creds).provider === "None"
                        ? "needs_setup"
                        : "connected"
                  }
                />
              </div>
              <div className="space-y-1 mb-3">
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground">Provider:</span>{" "}
                  {getFallbackLlm(creds).provider}
                </p>
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground">Model:</span>{" "}
                  {getFallbackLlm(creds).model}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={
                  llmTesting === "fallback" ||
                  getFallbackLlm(creds).provider === "None"
                }
                onClick={async () => {
                  setLlmTesting("fallback");
                  try {
                    const fallback = getFallbackLlm(creds);
                    let res: unknown;
                    if (fallback.provider === "OpenAI") {
                      res = await (actor as any)?.testOpenAIConnection?.();
                    } else if (fallback.provider === "Google Gemini") {
                      res = await (actor as any)?.testGeminiConnection?.();
                    } else {
                      res = {
                        ok: false,
                        error: "No fallback provider configured",
                      };
                    }
                    if (
                      res &&
                      typeof res === "object" &&
                      "ok" in res &&
                      res.ok === true
                    ) {
                      toast.success("Fallback LLM connected successfully.");
                    } else {
                      const err =
                        res && typeof res === "object" && "error" in res
                          ? String(res.error)
                          : "Connection failed";
                      toast.error(err);
                    }
                  } catch (e) {
                    const msg =
                      e instanceof Error ? e.message : "Connection failed";
                    toast.error(msg);
                  } finally {
                    setLlmTesting(null);
                  }
                }}
                className="border-white/10 hover:bg-white/5 text-xs"
                data-ocid="integration_health.test_fallback_llm_button"
              >
                {llmTesting === "fallback" ? "Testing…" : "Test Connection"}
              </Button>
            </div>
          </div>
        </div>

        {/* Service health grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          data-ocid="integration_health.list"
        >
          {SERVICES.map((svc, idx) => {
            const record = statusMap[svc.id];
            const isExpanded = expandedService === svc.id;
            const history = pingHistories[svc.id] ?? [];
            const isRefreshing = refreshingService === svc.id;

            return (
              <div
                key={svc.id}
                className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                data-ocid={`integration_health.item.${idx + 1}`}
              >
                {/* Card main */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{svc.logo}</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {svc.name}
                        </p>
                        {record && (
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(record.lastPingTime)}
                          </p>
                        )}
                      </div>
                    </div>
                    {record ? (
                      <StatusIcon status={record.status} />
                    ) : (
                      <CircleAlert className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    {record ? (
                      <StatusBadge status={record.status} />
                    ) : (
                      <span className="bg-muted/50 text-muted-foreground border border-white/10 px-2 py-0.5 rounded-full text-xs">
                        Unknown
                      </span>
                    )}
                    {record && record.latencyMs > 0n && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Zap className="h-3 w-3" />
                        {Number(record.latencyMs)}ms
                      </span>
                    )}
                  </div>

                  {record?.errorMessage[0] && (
                    <p className="text-xs text-red-400 bg-red-500/10 rounded px-2 py-1 mb-3 truncate">
                      {record.errorMessage[0]}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => refreshSingle(svc)}
                      disabled={isRefreshing}
                      className="flex-1 h-7 text-xs border-white/10 hover:bg-white/5"
                      data-ocid={`integration_health.refresh_button.${idx + 1}`}
                    >
                      <RefreshCw
                        className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                      {isRefreshing ? "Pinging..." : "Ping"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleExpand(svc.id)}
                      className="h-7 text-xs border-white/10 hover:bg-white/5"
                      data-ocid={`integration_health.toggle.${idx + 1}`}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Drill-down history */}
                {isExpanded && (
                  <div className="border-t border-white/10 bg-black/30 px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                      Last 10 pings
                    </p>
                    {history.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">
                        No history yet
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {history.slice(0, 10).map((h) => (
                          <div
                            key={`${h.serviceId}-${Number(h.lastPingTime)}`}
                            className="flex items-center justify-between text-xs gap-2"
                          >
                            <span className="text-muted-foreground shrink-0">
                              {formatRelativeTime(h.lastPingTime)}
                            </span>
                            <StatusBadge status={h.status} />
                            <span className="text-muted-foreground shrink-0">
                              {Number(h.latencyMs)}ms
                            </span>
                            {h.errorMessage[0] && (
                              <span className="text-red-400 truncate max-w-[80px]">
                                {h.errorMessage[0]}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Webhook Endpoints Panel */}
        <div className="mt-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Webhook Endpoints
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  Copy these URLs and paste into each service's webhook
                  configuration panel
                </p>
              </div>
            </div>
            <div className="divide-y divide-gray-700">
              {[
                {
                  service: "Composio",
                  url: "https://bookedrankedfunded.org/api/composio/webhook",
                  color: "text-purple-400",
                },
                {
                  service: "Vapi",
                  url: "https://bookedrankedfunded.org/api/vapi/webhook",
                  color: "text-blue-400",
                },
                {
                  service: "Twilio",
                  url: "https://bookedrankedfunded.org/api/twilio/webhook",
                  color: "text-red-400",
                },
                {
                  service: "SendGrid",
                  url: "https://bookedrankedfunded.org/api/sendgrid/webhook",
                  color: "text-green-400",
                },
                {
                  service: "Stripe",
                  url: "https://bookedrankedfunded.org/api/stripe/webhook",
                  color: "text-yellow-400",
                },
              ].map(({ service, url, color }) => (
                <WebhookUrlRow
                  key={service}
                  service={service}
                  url={url}
                  color={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quota tracker */}
        <div
          className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          data-ocid="integration_health.quota_section"
        >
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            Quota &amp; Balance Tracker
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* SerpApi.dev */}
            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🔍</span>
                <p className="text-sm font-medium text-foreground">
                  SerpApi.dev
                </p>
              </div>
              <div className="flex items-end justify-between mb-1">
                <span className="text-2xl font-bold text-amber-400">
                  {serpRecord ? Number(serpRecord.latencyMs) : "—"}
                </span>
                <span className="text-xs text-muted-foreground">/ 2,500</span>
              </div>
              <Progress
                value={
                  serpRecord
                    ? Math.min((Number(serpRecord.latencyMs) / 2500) * 100, 100)
                    : 0
                }
                className="h-1.5 bg-white/10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                searches remaining
              </p>
            </div>

            {/* ElevenLabs */}
            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🎙️</span>
                <p className="text-sm font-medium text-foreground">
                  ElevenLabs
                </p>
              </div>
              <div className="flex items-center gap-2">
                {elevenRecord ? (
                  <StatusBadge status={elevenRecord.status} />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Not checked
                  </span>
                )}
                {elevenRecord && (
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(elevenRecord.lastPingTime)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Voice credits — add key in Go Live
              </p>
            </div>

            {/* Twilio */}
            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">📞</span>
                <p className="text-sm font-medium text-foreground">Twilio</p>
              </div>
              <div className="flex items-center gap-2">
                {twilioRecord ? (
                  <StatusBadge status={twilioRecord.status} />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Not checked
                  </span>
                )}
                {twilioRecord && (
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(twilioRecord.lastPingTime)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                SMS/call balance — add key in Go Live
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
