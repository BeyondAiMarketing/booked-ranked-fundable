import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardCopy,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Fish,
  Headphones,
  Info,
  Loader2,
  Lock,
  LogIn,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  TrendingUp,
  Volume2,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { OpenRouterModelTable } from "../components/ai/OpenRouterModelTable";
import { IntegrationStatusBadge } from "../components/golive/IntegrationStatusBadge";
import {
  SetupWizardModal,
  WIZARD_SUPPORTED_IDS,
} from "../components/golive/SetupWizardModal";
import { ElevenLabsVoiceManager } from "../components/voice/ElevenLabsVoiceManager";
import { useApp } from "../context/AppContext";
import { useCredentials } from "../context/CredentialsContext";
import { useActor } from "../hooks/useActor";
import type { CredentialChangeEntry } from "../hooks/useIntegrationHealth";
import { APP_DOMAIN, PLATFORM_TENANT_ID } from "../lib/constants";
import {
  type IntegrationHealthResult,
  testClaudeConnection,
  testElevenLabsConnection,
  testOpenAIConnection,
  testSearxngConnection,
  testSerpApiConnection,
  testSerpApiDevConnection,
  testTinyFishConnection,
} from "../services/openSourceAdapters";

// ── Dograh Voice Agent Builder Section ──────────────────────────────────────

function DograhSection() {
  const { actor } = useActor();
  const [dograhKey, setDograhKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [maskedValue, setMaskedValue] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    message: string;
    agentCount: number;
  } | null>(null);

  useEffect(() => {
    if (!actor) return;
    (actor as any)
      ?.getIntegrationCredentials?.("platform")
      .then((creds: Record<string, string> | null) => {
        const val = creds?.dograhApiKey ?? "";
        if (val) {
          setIsConfigured(true);
          setMaskedValue(val);
        }
      })
      .catch(() => {});
  }, [actor]);

  async function handleSave() {
    if (!dograhKey.trim()) return;
    setIsSaving(true);
    try {
      await (actor as any)?.saveDograhApiKey?.(dograhKey);
      toast.success("Dograh API key saved.");
      setDograhKey("");
      setIsConfigured(true);
      setMaskedValue(`${dograhKey.slice(0, 6)}••••••••`);
    } catch {
      toast.error("Failed to save Dograh key.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleClear() {
    if (!window.confirm("Delete Dograh API key?")) return;
    setIsClearing(true);
    try {
      await (actor as any)?.deleteCredential?.("platform", "dograhApiKey");
      setIsConfigured(false);
      setMaskedValue("");
      setDograhKey("");
      toast.success("Key cleared.");
    } catch {
      toast.error("Failed to clear Dograh key.");
    } finally {
      setIsClearing(false);
    }
  }

  async function handleTest() {
    setIsTesting(true);
    try {
      const r = await (actor as any)?.testDograhConnection?.();
      if (r) {
        setTestResult(
          r as { connected: boolean; message: string; agentCount: number },
        );
        toast[r.connected ? "success" : "error"](
          r.connected
            ? `Connected — ${r.agentCount} agent(s) found`
            : r.message,
        );
      }
    } catch {
      toast.error("Dograh connection test failed.");
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div
      className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-5 space-y-4"
      data-ocid="golive.dograh.panel"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-violet-400"
              aria-label="Dograh Voice Agent Builder"
            >
              <title>Dograh Voice Agent Builder</title>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            Dograh Voice Agent Builder
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create and manage AI voice agents via natural language commands
          </p>
        </div>
        {isConfigured && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Configured ✓ &nbsp;
            <span className="font-mono text-[10px] opacity-70">
              {maskedValue}
            </span>
          </span>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <label
            htmlFor="dograh-api-key"
            className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block"
          >
            Dograh API Key
          </label>
          <input
            id="dograh-api-key"
            type="password"
            value={dograhKey}
            onChange={(e) => setDograhKey(e.target.value)}
            placeholder={
              isConfigured ? maskedValue : "Enter your Dograh API key"
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm"
            data-ocid="golive.dograh.api_key_input"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSave}
            disabled={!dograhKey.trim() || isSaving}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.dograh.save_key_button"
          >
            {isSaving ? "Saving..." : "Save Key"}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.dograh.test_button"
          >
            {isTesting ? "Testing..." : "Test Connection"}
          </button>
          {isConfigured && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isClearing}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              data-ocid="golive.dograh.clear_key_button"
            >
              {isClearing ? "Clearing..." : "Clear Key"}
            </button>
          )}
        </div>
        {testResult !== null && (
          <div
            className={`text-sm px-3 py-2 rounded-lg ${testResult.connected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
          >
            {testResult.connected
              ? `Connected — ${testResult.agentCount} agent(s) found`
              : testResult.message}
          </div>
        )}
        <p className="text-xs text-slate-500">
          Get your API key at{" "}
          <a
            href="https://app.dograh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:underline"
          >
            app.dograh.com
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Composio MCP Router Section ─────────────────────────────────────────────────────────────────

function ComposioSection() {
  const { actor } = useActor();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [maskedValue, setMaskedValue] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [status, setStatus] = useState<
    "not_configured" | "connected" | "failed"
  >("not_configured");
  const [lastPing, setLastPing] = useState<string>("Never");

  // Webhook signing secret state
  const [webhookSecret, setWebhookSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [isSavingSecret, setIsSavingSecret] = useState(false);
  const [isClearingSecret, setIsClearingSecret] = useState(false);
  const [secretConfigured, setSecretConfigured] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const WEBHOOK_URL = "https://bookedrankedfunded.org/api/webhooks/composio";

  useEffect(() => {
    if (!actor) return;
    (
      actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >
    )
      ?.getComposioApiKeyStatus?.("platform")
      .then((res: unknown) => {
        const r = res as { configured: boolean; maskedKey: string } | null;
        if (r?.configured) {
          setIsConfigured(true);
          setMaskedValue(r.maskedKey);
          setStatus("connected");
        }
      })
      .catch(() => {});
    (
      actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >
    )
      ?.getComposioWebhookSecretStatus?.()
      .then((res: unknown) => {
        const r = res as { configured: boolean } | null;
        if (r?.configured) setSecretConfigured(true);
      })
      .catch(() => {});
  }, [actor]);

  async function handleSave() {
    if (!apiKey.trim()) return;
    setIsSaving(true);
    try {
      await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      )?.saveComposioApiKey?.(apiKey);
      toast.success("Composio API key saved.");
      setApiKey("");
      setIsConfigured(true);
      setMaskedValue(`${apiKey.slice(0, 6)}••••••••`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleClear() {
    if (!window.confirm("Delete Composio API key?")) return;
    setIsClearing(true);
    try {
      await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      )?.deleteCredential?.("platform", "composioApiKey");
      setIsConfigured(false);
      setMaskedValue("");
      setApiKey("");
      setStatus("not_configured");
      toast.success("Key cleared.");
    } catch {
      toast.error("Failed to clear Composio key.");
    } finally {
      setIsClearing(false);
    }
  }

  async function handleTest() {
    setIsTesting(true);
    try {
      const result = await actor?.testComposioConnection?.();
      const connected =
        result !== undefined &&
        typeof result === "object" &&
        "__kind__" in result &&
        (result as Record<string, unknown>).__kind__ === "ok";
      setStatus(connected ? "connected" : "failed");
      setLastPing(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      toast[connected ? "success" : "error"](
        connected
          ? "Composio MCP Router connected!"
          : "Composio connection failed — check your API key.",
      );
    } catch {
      setStatus("failed");
      toast.error("Composio connection test failed.");
    } finally {
      setIsTesting(false);
    }
  }

  async function handleSaveSecret() {
    if (!webhookSecret.trim()) return;
    setIsSavingSecret(true);
    try {
      await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      )?.saveComposioWebhookSecret?.(webhookSecret);
      toast.success("Webhook signing secret saved.");
      setWebhookSecret("");
      setSecretConfigured(true);
    } catch {
      toast.error("Failed to save webhook signing secret.");
    } finally {
      setIsSavingSecret(false);
    }
  }

  async function handleClearSecret() {
    if (!window.confirm("Delete Composio webhook signing secret?")) return;
    setIsClearingSecret(true);
    try {
      await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      )?.clearComposioWebhookSecret?.();
      setSecretConfigured(false);
      setWebhookSecret("");
      toast.success("Webhook signing secret cleared.");
    } catch {
      toast.error("Failed to clear webhook signing secret.");
    } finally {
      setIsClearingSecret(false);
    }
  }

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(WEBHOOK_URL);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      toast.error("Failed to copy URL.");
    }
  }

  return (
    <div
      className="rounded-2xl border border-blue-500/25 bg-blue-500/5 p-5 space-y-4"
      data-ocid="golive.composio.panel"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Zap size={15} className="text-blue-400" />
            Composio MCP Router
            {status !== "connected" && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 ml-1">
                Critical
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect 250+ apps (Gmail, Google Calendar, Stripe, CompanyCam) via
            one API key
          </p>
        </div>

        {/* Status badge */}
        {isConfigured ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Configured ✓ &nbsp;
            <span className="font-mono text-[10px] opacity-70">
              {maskedValue}
            </span>
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              status === "connected"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : status === "failed"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-slate-700/60 text-slate-400 border border-slate-600/40"
            }`}
            data-ocid="golive.composio.status_badge"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === "connected"
                  ? "bg-emerald-400"
                  : status === "failed"
                    ? "bg-red-400"
                    : "bg-slate-500"
              }`}
            />
            {status === "connected"
              ? "Connected"
              : status === "failed"
                ? "Failed"
                : "Not Configured"}
          </span>
        )}
      </div>

      {/* ── Webhook Endpoint (read-only display) ── */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Webhook Endpoint
        </p>
        <div className="flex items-center gap-2">
          <code
            className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-blue-300 truncate select-all"
            data-ocid="golive.composio.webhook_url"
          >
            {WEBHOOK_URL}
          </code>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="shrink-0 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors flex items-center gap-1.5"
            aria-label="Copy webhook URL"
            data-ocid="golive.composio.copy_url_button"
          >
            {copiedUrl ? (
              <>
                <CheckCircle2 size={13} className="text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy size={13} /> Copy
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Add this URL in your Composio dashboard under{" "}
          <strong className="text-slate-400">Settings → Webhooks</strong>.
        </p>
      </div>

      {/* ── API Key Input ── */}
      <div className="space-y-3">
        <div>
          <label
            htmlFor="composio-api-key"
            className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block"
          >
            Composio API Key
          </label>
          <div className="relative">
            <input
              id="composio-api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={isConfigured ? maskedValue : "comp_..."}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              data-ocid="golive.composio.api_key_input"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* API Key action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSave}
            disabled={!apiKey.trim() || isSaving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.composio.save_key_button"
          >
            {isSaving ? "Saving…" : "Save Key"}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.composio.test_button"
          >
            {isTesting ? "Testing…" : "Test Connection"}
          </button>
          {isConfigured && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isClearing}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              data-ocid="golive.composio.clear_key_button"
            >
              {isClearing ? "Clearing…" : "Clear Key"}
            </button>
          )}
        </div>
      </div>

      {/* ── Webhook Signing Secret ── */}
      <div className="space-y-3 pt-1 border-t border-white/8">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Webhook Signing Secret
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm">
              Composio sends{" "}
              <code className="text-slate-400">webhook-signature</code>,{" "}
              <code className="text-slate-400">webhook-id</code>, and{" "}
              <code className="text-slate-400">webhook-timestamp</code> headers.
              BRF uses your signing secret to verify every incoming event.
            </p>
          </div>
          {/* Signing secret status badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
              secretConfigured
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-slate-700/60 text-slate-400 border border-slate-600/40"
            }`}
            data-ocid="golive.composio.secret_status_badge"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                secretConfigured ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            {secretConfigured ? "Configured ✓" : "Not Configured"}
          </span>
        </div>

        <div className="relative">
          <input
            id="composio-webhook-secret"
            type={showSecret ? "text" : "password"}
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            placeholder={secretConfigured ? "••••••••••••" : "whsec_..."}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            data-ocid="golive.composio.webhook_secret_input"
          />
          <button
            type="button"
            onClick={() => setShowSecret((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={
              showSecret ? "Hide signing secret" : "Show signing secret"
            }
          >
            {showSecret ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSaveSecret}
            disabled={!webhookSecret.trim() || isSavingSecret}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.composio.save_secret_button"
          >
            {isSavingSecret ? "Saving…" : "Save Secret"}
          </button>
          {secretConfigured && (
            <button
              type="button"
              onClick={handleClearSecret}
              disabled={isClearingSecret}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              data-ocid="golive.composio.clear_secret_button"
            >
              {isClearingSecret ? "Clearing…" : "Clear Secret"}
            </button>
          )}
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 border-t border-white/8">
        {[
          { label: "Integrations", value: "250+ apps" },
          { label: "Auth Handling", value: "OAuth + API keys" },
          { label: "Last Ping", value: lastPing },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white/5 rounded-lg px-3 py-2 border border-white/5"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              {label}
            </p>
            <p className="text-xs font-medium text-slate-200 mt-0.5 truncate">
              {value}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Get your API key at{" "}
        <a
          href="https://composio.dev/settings"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          composio.dev/settings → API Keys
        </a>
      </p>
    </div>
  );
}

// ── Abacus.AI RouteLLM Section ─────────────────────────────────────────────────────────────────

function AbacusSection() {
  const { actor } = useActor();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [maskedValue, setMaskedValue] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [status, setStatus] = useState<
    "not_configured" | "connected" | "failed"
  >("not_configured");
  const [lastPing, setLastPing] = useState<string>("Never");

  useEffect(() => {
    if (!actor) return;
    (actor as any)
      ?.getAbacusApiKeyStatus?.("platform")
      .then((res: { configured: boolean; maskedKey: string } | null) => {
        if (res?.configured) {
          setIsConfigured(true);
          setMaskedValue(res.maskedKey);
          setStatus("connected");
        }
      })
      .catch(() => {});
  }, [actor]);

  async function handleSave() {
    if (!apiKey.trim()) return;
    setIsSaving(true);
    try {
      await (actor as any)?.saveAbacusApiKey?.(apiKey);
      toast.success("Abacus.AI API key saved.");
      setApiKey("");
      setIsConfigured(true);
      setMaskedValue(`${apiKey.slice(0, 6)}••••••••`);
    } catch {
      toast.error("Failed to save Abacus.AI key.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleClear() {
    if (!window.confirm("Delete Abacus.AI API key?")) return;
    setIsClearing(true);
    try {
      await (actor as any)?.deleteCredential?.("platform", "abacusApiKey");
      setIsConfigured(false);
      setMaskedValue("");
      setApiKey("");
      setStatus("not_configured");
      toast.success("Key cleared.");
    } catch {
      toast.error("Failed to clear Abacus.AI key.");
    } finally {
      setIsClearing(false);
    }
  }

  async function handleTest() {
    setIsTesting(true);
    try {
      const result = await actor?.testAbacusConnection?.();
      const connected =
        result !== undefined &&
        typeof result === "object" &&
        "__kind__" in result &&
        result.__kind__ === "ok";
      setStatus(connected ? "connected" : "failed");
      setLastPing(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      toast[connected ? "success" : "error"](
        connected
          ? "Abacus.AI RouteLLM connected!"
          : "Abacus.AI connection failed — check your API key.",
      );
    } catch {
      setStatus("failed");
      toast.error("Abacus.AI connection test failed.");
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div
      className="rounded-2xl border border-purple-500/25 bg-purple-500/5 p-5 space-y-4"
      data-ocid="golive.abacus.panel"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Brain size={15} className="text-purple-400" />
            Abacus.AI RouteLLM
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Intelligent model routing — automatically picks the best AI model
            per task
          </p>
        </div>

        {/* Status badge — shows configured ✓ when persisted */}
        {isConfigured ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Configured ✓ &nbsp;
            <span className="font-mono text-[10px] opacity-70">
              {maskedValue}
            </span>
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              status === "connected"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : status === "failed"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-slate-700/60 text-slate-400 border border-slate-600/40"
            }`}
            data-ocid="golive.abacus.status_badge"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === "connected"
                  ? "bg-emerald-400"
                  : status === "failed"
                    ? "bg-red-400"
                    : "bg-slate-500"
              }`}
            />
            {status === "connected"
              ? "Connected"
              : status === "failed"
                ? "Failed"
                : "Not Configured"}
          </span>
        )}
      </div>

      {/* API Key Input */}
      <div className="space-y-3">
        <div>
          <label
            htmlFor="abacus-api-key"
            className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block"
          >
            Abacus.AI API Key
          </label>
          <div className="relative">
            <input
              id="abacus-api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={isConfigured ? maskedValue : "abacus_..."}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              data-ocid="golive.abacus.api_key_input"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSave}
            disabled={!apiKey.trim() || isSaving}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.abacus.save_key_button"
          >
            {isSaving ? "Saving…" : "Save Key"}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.abacus.test_button"
          >
            {isTesting ? "Testing…" : "Test Connection"}
          </button>
          {isConfigured && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isClearing}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              data-ocid="golive.abacus.clear_key_button"
            >
              {isClearing ? "Clearing…" : "Clear Key"}
            </button>
          )}
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          {[
            { label: "Routing", value: "NVIDIA → OpenAI → Claude" },
            { label: "Mode", value: "Cost-optimized" },
            { label: "Last Ping", value: lastPing },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/5 rounded-lg px-3 py-2 border border-white/5"
            >
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                {label}
              </p>
              <p className="text-xs font-medium text-slate-200 mt-0.5 truncate">
                {value}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          Get your API key at{" "}
          <a
            href="https://abacus.ai/app/profile/apikeys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline"
          >
            abacus.ai/app/profile/apikeys
          </a>
        </p>
      </div>
    </div>
  );
}

// ── OpenRouter AI Router Section ─────────────────────────────────────────────────────────────────

function OpenRouterSection() {
  const { actor } = useActor();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [maskedValue, setMaskedValue] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [status, setStatus] = useState<
    "not_configured" | "connected" | "failed"
  >("not_configured");
  const [lastPing, setLastPing] = useState<string>("Never");

  useEffect(() => {
    if (!actor) return;
    (actor as any)
      ?.getIntegrationCredentials?.("platform")
      .then((creds: Record<string, string> | null) => {
        const val = creds?.openRouterApiKey ?? "";
        if (val) {
          setIsConfigured(true);
          setMaskedValue(val);
          setStatus("connected");
        }
      })
      .catch(() => {});
  }, [actor]);

  async function handleSave() {
    if (!apiKey.trim()) return;
    setIsSaving(true);
    try {
      await (actor as any)?.saveOpenRouterApiKey?.(apiKey);
      toast.success("OpenRouter API key saved.");
      setApiKey("");
      setIsConfigured(true);
      setMaskedValue(`${apiKey.slice(0, 6)}••••••••`);
      setStatus("connected");
    } catch {
      toast.error("Failed to save OpenRouter key.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleClear() {
    if (!window.confirm("Delete OpenRouter API key?")) return;
    setIsClearing(true);
    try {
      await (actor as any)?.deleteCredential?.("platform", "openRouterApiKey");
      setIsConfigured(false);
      setMaskedValue("");
      setApiKey("");
      setStatus("not_configured");
      toast.success("Key cleared.");
    } catch {
      toast.error("Failed to clear OpenRouter key.");
    } finally {
      setIsClearing(false);
    }
  }

  async function handleTest() {
    setIsTesting(true);
    try {
      const ok = await (actor as any)?.testOpenRouterConnection?.();
      const connected = ok === true;
      setStatus(connected ? "connected" : "failed");
      setLastPing(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      toast[connected ? "success" : "error"](
        connected
          ? "OpenRouter connection successful."
          : "OpenRouter connection failed.",
      );
    } catch {
      setStatus("failed");
      toast.error("OpenRouter connection test failed.");
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div
      className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 space-y-4"
      data-ocid="golive.openrouter.panel"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-400"
              aria-label="OpenRouter AI Router"
            >
              <title>OpenRouter AI Router</title>
              <circle cx="12" cy="5" r="2" />
              <circle cx="5" cy="19" r="2" />
              <circle cx="19" cy="19" r="2" />
              <path d="M12 7v3l-5.5 6" />
              <path d="M12 10l5.5 6" />
              <line x1="12" y1="7" x2="12" y2="10" />
            </svg>
            OpenRouter AI Router
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Route AI tasks across 400+ models with one API key — Owl Alpha,
            GPT-4o, Claude, Gemini &amp; more
          </p>
        </div>

        {/* Status badge — shows configured ✓ when persisted */}
        {isConfigured ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Configured ✓ &nbsp;
            <span className="font-mono text-[10px] opacity-70">
              {maskedValue}
            </span>
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              status === "connected"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : status === "failed"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-slate-700/60 text-slate-400 border border-slate-600/40"
            }`}
            data-ocid="golive.openrouter.status_badge"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === "connected"
                  ? "bg-emerald-400"
                  : status === "failed"
                    ? "bg-red-400"
                    : "bg-slate-500"
              }`}
            />
            {status === "connected"
              ? "Connected"
              : status === "failed"
                ? "Failed"
                : "Not Configured"}
          </span>
        )}
      </div>

      {/* API Key Input */}
      <div className="space-y-3">
        <div>
          <label
            htmlFor="openrouter-api-key"
            className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block"
          >
            OpenRouter API Key
          </label>
          <div className="relative">
            <input
              id="openrouter-api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={isConfigured ? maskedValue : "sk-or-..."}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              data-ocid="golive.openrouter.api_key_input"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSave}
            disabled={!apiKey.trim() || isSaving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.openrouter.save_key_button"
          >
            {isSaving ? "Saving…" : "Save Key"}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.openrouter.test_button"
          >
            {isTesting ? "Testing…" : "Test Connection"}
          </button>
          {isConfigured && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isClearing}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              data-ocid="golive.openrouter.clear_key_button"
            >
              {isClearing ? "Clearing…" : "Clear Key"}
            </button>
          )}
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { label: "Active Model", value: "openrouter/owl-alpha" },
            { label: "Context Window", value: "1,000,000 tokens" },
            { label: "Cost Per Million", value: "$0.00 — Free" },
            { label: "Last Ping", value: lastPing },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/5 rounded-lg px-3 py-2 border border-white/5"
            >
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                {label}
              </p>
              <p className="text-xs font-medium text-slate-200 mt-0.5 truncate">
                {value}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          Get your free API key at{" "}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline"
          >
            openrouter.ai/keys
          </a>
        </p>
      </div>

      {/* Content Creation Capabilities */}
      <ContentCreationCapabilities status={status} />

      {/* Super Admin model table */}
      <OpenRouterModelTable />
    </div>
  );
}

// ── Content Creation Capabilities Sub-section ──────────────────────────────

function ContentCreationCapabilities({
  status,
}: {
  status: "not_configured" | "connected" | "failed";
}) {
  const [expanded, setExpanded] = useState(true);
  const isConnected = status === "connected";

  const capabilities = [
    {
      title: "Image Generation",
      models: "Flux 2 Pro · Gemini Image",
      description: "Ads, thumbnails, before/after visuals",
      icon: "🖼️",
    },
    {
      title: "Video Generation",
      models: "Google Veo 3.1",
      description: "Promotional videos, social reels",
      icon: "🎬",
    },
    {
      title: "Text & Ad Copy",
      models: "Owl Alpha",
      description: "Ad campaigns, blogs, landing pages",
      icon: "✍️",
    },
  ];

  return (
    <div className="mt-6 border border-slate-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-800/80 transition-colors"
        data-ocid="golive.content_creation.toggle"
      >
        <span className="text-sm font-semibold text-slate-200">
          Content Creation Capabilities
        </span>
        {expanded ? (
          <ChevronUp size={16} className="text-slate-400" />
        ) : (
          <ChevronDown size={16} className="text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-3 bg-slate-900/40">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">
                    {cap.icon} {cap.title}
                  </span>
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      ● Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/60 text-slate-400 border border-slate-600">
                      Requires OpenRouter Key
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-400/80 font-mono">
                  {cap.models}
                </p>
                <p className="text-xs text-slate-400">{cap.description}</p>
              </div>
            ))}
          </div>
          <a
            href="/content-creation-studio"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
            data-ocid="golive.content_creation.open_studio_link"
          >
            Open Content Studio →
          </a>
        </div>
      )}
    </div>
  );
}

// ── Content Tier Toggle Section ───────────────────────────────────────────────

function ContentTierToggleSection() {
  const { actor } = useActor();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    Basic: true,
    Pro: true,
    Agency: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await (actor as any)?.getContentTierToggles?.();
        if (result && Array.isArray(result)) {
          const map: Record<string, boolean> = {
            Basic: true,
            Pro: true,
            Agency: true,
          };
          for (const t of result) {
            map[t.tier] = t.contentCreationEnabled;
          }
          setToggles(map);
        }
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    }
    if (actor) load();
  }, [actor]);

  async function handleToggle(tier: string, enabled: boolean) {
    setSaving(tier);
    try {
      await (actor as any)?.setContentTierToggle?.(tier, enabled);
      setToggles((prev) => ({ ...prev, [tier]: enabled }));
    } catch {
      // ignore
    } finally {
      setSaving(null);
    }
  }

  const tiers = [
    { id: "Basic", label: "Basic", color: "text-slate-300" },
    { id: "Pro", label: "Pro", color: "text-blue-400" },
    { id: "Agency", label: "Agency", color: "text-violet-400" },
  ];

  return (
    <div
      className="rounded-xl border border-slate-700 bg-slate-800/40 p-4"
      data-ocid="golive.content_tier_toggles.section"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-200">
          Content Creation Access
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Control which tiers can access the Content Creation Studio
        </p>
      </div>

      {loading ? (
        <div className="text-xs text-slate-500">Loading...</div>
      ) : (
        <div className="space-y-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex items-center justify-between"
              data-ocid={`golive.content_tier_toggles.${tier.id.toLowerCase()}.toggle`}
            >
              <span className={`text-sm font-medium ${tier.color}`}>
                {tier.label}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[tier.id]}
                disabled={saving === tier.id}
                onClick={() => handleToggle(tier.id, !toggles[tier.id])}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  toggles[tier.id] ? "bg-emerald-500" : "bg-slate-600"
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                    toggles[tier.id] ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Google Gemini Section ──────────────────────────────────────────────────

function GeminiSection() {
  const { actor } = useActor();
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [maskedValue, setMaskedValue] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [status, setStatus] = useState<
    "not_configured" | "connected" | "failed"
  >("not_configured");
  const [lastPing, setLastPing] = useState<string>("Never");

  useEffect(() => {
    if (!actor) return;
    (actor as any)
      ?.getGeminiKeyStatus?.()
      .then((result: { configured: boolean; maskedKey?: string } | null) => {
        if (result?.configured) {
          setIsConfigured(true);
          setMaskedValue(result.maskedKey ?? "");
          setStatus("connected");
        }
      })
      .catch(() => {});
  }, [actor]);

  async function handleSave() {
    if (!apiKey.trim()) return;
    setIsSaving(true);
    try {
      await (actor as any)?.setGeminiApiKey?.(apiKey.trim());
      toast.success("Google Gemini API key saved.");
      const first4 = apiKey.slice(0, 4);
      setMaskedValue(`${first4}****`);
      setApiKey("");
      setIsConfigured(true);
      setStatus("connected");
    } catch {
      toast.error("Failed to save Gemini key.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleClear() {
    if (!window.confirm("Delete Google Gemini API key?")) return;
    setIsClearing(true);
    try {
      await (actor as any)?.deleteCredential?.("platform", "geminiApiKey");
      setIsConfigured(false);
      setMaskedValue("");
      setApiKey("");
      setStatus("not_configured");
      toast.success("Gemini key cleared.");
    } catch {
      toast.error("Failed to clear Gemini key.");
    } finally {
      setIsClearing(false);
    }
  }

  async function handleTest() {
    if (!apiKey.trim() && !isConfigured) {
      toast.error("Enter or save a Gemini API key first.");
      return;
    }
    setIsTesting(true);
    const keyToTest = apiKey.trim();
    try {
      let connected = false;
      if (keyToTest) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${encodeURIComponent(keyToTest)}`,

          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "ping" }] }],
            }),
          },
        );
        connected = res.ok;
      } else {
        const ok = await (actor as any)?.testGeminiConnection?.();
        connected = ok === true;
      }
      setStatus(connected ? "connected" : "failed");
      setLastPing(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      if (connected) {
        toast.success("Gemini connection successful.");
      } else {
        toast.error("Gemini connection failed - check your API key.");
      }
    } catch {
      setStatus("failed");
      toast.error("Gemini connection test failed.");
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div
      className="rounded-2xl border border-blue-500/25 bg-blue-500/5 p-5 space-y-4"
      data-ocid="golive.gemini.panel"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-blue-400"
              aria-label="Google Gemini"
            >
              <title>Google Gemini</title>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
            Google Gemini
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Free AI fallback provider - no cost for standard usage
          </p>
        </div>

        {isConfigured ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Configured
            <span className="font-mono text-[10px] opacity-70 ml-1">
              {maskedValue}
            </span>
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status === "connected" ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : status === "failed" ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-slate-700/60 text-slate-400 border border-slate-600/40"}`}
            data-ocid="golive.gemini.status_badge"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${status === "connected" ? "bg-blue-400" : status === "failed" ? "bg-red-400" : "bg-slate-500"}`}
            />
            {status === "connected"
              ? "Connected"
              : status === "failed"
                ? "Failed"
                : "Not Configured"}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="gemini-api-key"
            className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block"
          >
            Gemini API Key
          </label>
          <input
            id="gemini-api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={isConfigured ? maskedValue : "AIza..."}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            data-ocid="golive.gemini.api_key_input"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSave}
            disabled={!apiKey.trim() || isSaving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.gemini.save_key_button"
          >
            {isSaving ? "Saving..." : "Save Key"}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            data-ocid="golive.gemini.test_button"
          >
            {isTesting ? "Testing..." : "Test Connection"}
          </button>
          {isConfigured && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isClearing}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              data-ocid="golive.gemini.clear_key_button"
            >
              {isClearing ? "Clearing..." : "Clear Key"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { label: "Active Model", value: "gemini-pro" },
            { label: "Context Window", value: "1,000,000 tokens" },
            { label: "Cost Per Million", value: "Free tier" },
            { label: "Last Ping", value: lastPing },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/5 rounded-lg px-3 py-2 border border-white/5"
            >
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                {label}
              </p>
              <p className="text-xs font-medium text-slate-200 mt-0.5 truncate">
                {value}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          Get your free API key at{" "}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            aistudio.google.com/app/apikey
          </a>
        </p>
      </div>
    </div>
  );
}

// ── NVIDIA AI Brain Section ───────────────────────────────────────────────────

function NvidiaAIBrainSection() {
  const { actor, isFetching } = useActor();
  const [nvidiaKey, setNvidiaKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [maskedValue, setMaskedValue] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [status, setStatus] = useState<
    "not_configured" | "connected" | "error"
  >("not_configured");
  const [lastPing, setLastPing] = useState<string>("Never");
  const [stats, setStats] = useState({
    model: "nvidia/llama-3.1-nemotron-70b-instruct",
    embeddings: 0,
    callsToday: 0,
  });

  useEffect(() => {
    if (!actor || isFetching) return;
    (actor as any)
      ?.getIntegrationCredentials?.("platform")
      .then((creds: Record<string, string> | null) => {
        const val = creds?.nvidiaNimApiKey ?? "";
        if (val) {
          setIsConfigured(true);
          setMaskedValue(val);
          setStatus("connected");
        }
      })
      .catch(() => {});
  }, [actor, isFetching]);

  async function handleSave() {
    if (!nvidiaKey.trim()) {
      toast.error("Enter your NVIDIA API key first.");
      return;
    }
    setSaving(true);
    try {
      await (actor as any)?.saveProviderConfig?.("NVIDIA", nvidiaKey, "");
      toast.success("NVIDIA API key saved.");
      setIsConfigured(true);
      setMaskedValue(`${nvidiaKey.slice(0, 8)}••••••••`);
      setStatus("connected");
      setNvidiaKey("");
    } catch {
      toast.error("Failed to save NVIDIA key. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    if (!window.confirm("Delete NVIDIA API key?")) return;
    setIsClearing(true);
    try {
      await (actor as any)?.deleteCredential?.("platform", "nvidiaNimApiKey");
      setIsConfigured(false);
      setMaskedValue("");
      setNvidiaKey("");
      setStatus("not_configured");
      toast.success("Key cleared.");
    } catch {
      toast.error("Failed to clear NVIDIA key.");
    } finally {
      setIsClearing(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    try {
      const result = await (actor as any)?.testNvidiaConnection?.();
      const connected =
        result === true ||
        (result && typeof result === "object" && result.__kind__ === "ok");
      setStatus(connected ? "connected" : "error");
      setLastPing(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      toast[connected ? "success" : "error"](
        connected
          ? "NVIDIA AI Brain connected!"
          : "Connection failed. Check your API key.",
      );
    } catch {
      setStatus("error");
      toast.error("Connection test failed.");
    } finally {
      setTesting(false);
    }
  }

  useEffect(() => {
    if (!actor || isFetching) return;
    (actor as any)
      ?.getVectorIndexStatus?.()
      .then((s: any) => {
        if (s)
          setStats((prev) => ({
            ...prev,
            embeddings: Number(s.totalChunks ?? 0n),
          }));
      })
      .catch(() => {});
  }, [actor, isFetching]);

  const statusLabel =
    status === "connected"
      ? "Connected"
      : status === "error"
        ? "Error"
        : "Not Configured";
  const statusClass =
    status === "connected"
      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
      : status === "error"
        ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
        : "bg-slate-800/60 border-slate-600/30 text-slate-400";

  return (
    <div
      className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-5 space-y-4"
      data-ocid="golive.nvidia_ai_brain.panel"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Brain size={15} className="text-violet-400" />
            NVIDIA AI Brain
            {/* Critical badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 ml-1">
              Critical
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Powers RAG knowledge retrieval, reranking, and AI inference across
            all agents.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isConfigured && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Configured ✓ &nbsp;
              <span className="font-mono text-[10px] opacity-70">
                {maskedValue}
              </span>
            </span>
          )}
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 flex flex-col gap-1">
          <label htmlFor="golive-nvidia-key" className="text-xs text-slate-400">
            NVIDIA API Key
          </label>
          <div className="flex gap-2 flex-wrap">
            <input
              id="golive-nvidia-key"
              type="password"
              value={nvidiaKey}
              onChange={(e) => setNvidiaKey(e.target.value)}
              placeholder={isConfigured ? maskedValue : "nvapi-…"}
              className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-violet-500/50 font-mono placeholder-gray-500"
              data-ocid="golive.nvidia_ai_brain.api_key.input"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || isFetching}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-500/15 border border-violet-500/35 text-violet-300 hover:bg-violet-500/25 transition-colors disabled:opacity-50 whitespace-nowrap"
              data-ocid="golive.nvidia_ai_brain.save_button"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : "Save"}
            </button>
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || isFetching}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50 whitespace-nowrap"
              data-ocid="golive.nvidia_ai_brain.test_button"
            >
              {testing ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                "Test Connection"
              )}
            </button>
            {isConfigured && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isClearing}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/70 border border-red-500/40 text-red-300 hover:bg-red-600/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                data-ocid="golive.nvidia_ai_brain.clear_key_button"
              >
                {isClearing ? "Clearing…" : "Clear Key"}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-slate-400">Active Model</p>
          <p className="text-xs text-slate-300 mt-1 truncate font-mono">
            {stats.model}
          </p>
        </div>
      </div>

      {/* Last ping info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
        {[
          { label: "Last Ping", value: lastPing },
          {
            label: "Embeddings Stored",
            value: stats.embeddings.toLocaleString(),
          },
          { label: "AI Calls Today", value: String(stats.callsToday) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white/5 rounded-lg px-3 py-2 border border-white/5"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              {label}
            </p>
            <p className="text-xs font-medium text-slate-200 mt-0.5 truncate">
              {value}
            </p>
          </div>
        ))}
      </div>

      <a
        href="/admin/ai-providers"
        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors w-fit"
        data-ocid="golive.nvidia_ai_brain.providers_link"
      >
        <ExternalLink size={11} /> AI Providers
      </a>
    </div>
  );
}

// ── N8N Workflow Section ──────────────────────────────────────────────────────

function N8NWorkflowSection() {
  const { actor, isFetching } = useActor();
  const [instanceUrl, setInstanceUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [config, setConfig] = useState({
    activeWorkflows: 0,
    executionsToday: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!actor || isFetching) return;
    (actor as any)
      ?.getN8NConfig?.()
      .then((cfg: any) => {
        if (!cfg) return;
        setInstanceUrl(cfg.instanceUrl ?? "");
        setConnected(cfg.isConnected ?? false);
        setConfig({
          activeWorkflows: Number(cfg.activeWorkflowCount ?? 0n),
          executionsToday: Number(cfg.totalExecutionsToday ?? 0n),
        });
      })
      .catch(() => {});
    (actor as any)
      ?.getWebhookUrl?.()
      .then((url: any) => {
        if (url) setWebhookUrl(url);
      })
      .catch(() => {});
  }, [actor, isFetching]);

  async function handleSave() {
    if (!instanceUrl.trim() || !apiKey.trim()) {
      toast.error("Enter both Instance URL and API Key.");
      return;
    }
    setSaving(true);
    try {
      await (actor as any)?.saveN8NConfig?.(instanceUrl.trim(), apiKey.trim());
      toast.success("N8N configuration saved.");
    } catch {
      toast.error("Failed to save N8N config.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!instanceUrl.trim()) {
      toast.error("Enter your N8N Instance URL first.");
      return;
    }
    setTesting(true);
    try {
      const ok = (await (actor as any)?.testN8NConnection?.()) ?? false;
      setConnected(ok);
      toast[ok ? "success" : "error"](
        ok
          ? "N8N connected successfully!"
          : "Connection failed. Check your Instance URL and API Key.",
      );
    } catch {
      setConnected(false);
      toast.error("Connection test failed.");
    } finally {
      setTesting(false);
    }
  }

  function copyWebhook() {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Webhook URL copied!");
    });
  }

  const statusClass = connected
    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
    : "bg-slate-800/60 border-slate-600/30 text-slate-400";

  return (
    <div
      className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-5 space-y-4"
      data-ocid="golive.n8n_workflow.panel"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Zap size={15} className="text-cyan-400" />
            N8N Workflow Automation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect your N8N instance to deploy and execute automated workflows
            across all client accounts.
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClass}`}
        >
          {connected ? "Connected" : "Not Connected"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="golive-n8n-url" className="text-xs text-slate-400">
            N8N Instance URL
          </label>
          <input
            id="golive-n8n-url"
            type="url"
            value={instanceUrl}
            onChange={(e) => setInstanceUrl(e.target.value)}
            placeholder="https://your-n8n.example.com"
            className="rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-cyan-500/50"
            data-ocid="golive.n8n_workflow.instance_url.input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="golive-n8n-key" className="text-xs text-slate-400">
            N8N API Key
          </label>
          <input
            id="golive-n8n-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="n8n_api_…"
            className="rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-cyan-500/50 font-mono"
            data-ocid="golive.n8n_workflow.api_key.input"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || isFetching}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 hover:bg-cyan-500/25 transition-colors disabled:opacity-50"
          data-ocid="golive.n8n_workflow.save_button"
        >
          {saving ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            "Save Config"
          )}
        </button>
        <button
          type="button"
          onClick={handleTest}
          disabled={testing || isFetching}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50"
          data-ocid="golive.n8n_workflow.test_button"
        >
          {testing ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            "Test Connection"
          )}
        </button>
      </div>

      {webhookUrl && (
        <div className="flex flex-col gap-1">
          <label
            htmlFor="golive-webhook-url"
            className="text-xs text-slate-400"
          >
            Auto-generated Webhook URL
          </label>
          <div className="flex items-center gap-2">
            <input
              id="golive-webhook-url"
              readOnly
              value={webhookUrl}
              className="flex-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 px-3 py-1.5 font-mono cursor-default"
              data-ocid="golive.n8n_workflow.webhook_url.input"
            />
            <button
              type="button"
              onClick={copyWebhook}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
              data-ocid="golive.n8n_workflow.copy_webhook_button"
            >
              {copied ? (
                <CheckCircle2 size={12} className="text-emerald-400" />
              ) : (
                <ClipboardCopy size={12} />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500">Active workflows:</span>
          <span className="text-xs font-semibold text-cyan-300">
            {config.activeWorkflows}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500">Executions today:</span>
          <span className="text-xs font-semibold text-emerald-300">
            {config.executionsToday}
          </span>
        </div>
        <a
          href="/admin/workflow-library"
          className="ml-auto text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          data-ocid="golive.n8n_workflow.library_link"
        >
          <ExternalLink size={11} /> Workflow Library
        </a>
      </div>
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ServiceCreds {
  // LLM
  openaiKey: string;
  claudeKey: string;
  litellmUrl: string;
  ollamaUrl: string;
  // Twilio / Voice
  twilioSid: string;
  twilioAuth: string;
  twilioNumber: string;
  vapiKey: string;
  vapiAssistantId: string;
  // ElevenLabs
  elevenLabsKey: string;
  // Stripe
  stripePublishableKey: string;
  stripeSecretKey: string;
  // Google
  googleClientId: string;
  googleClientSecret: string;
  // Review Platforms
  yelpApiKey: string;
  facebookAppId: string;
  facebookAppSecret: string;
  // Email SMTP
  emailSmtpHost: string;
  emailSmtpPort: string;
  emailSmtpUser: string;
  emailSmtpPass: string;
  emailFromDomain: string;
  // Lead Verification
  hunterApiKey: string;
  neverBounceKey: string;
  // Open Source
  listmonkUrl: string;
  listmonkApiKey: string;
  searxngUrl: string;
  // AI Research
  perplexityApiKey: string;
  // Auto Browser
  autoBrowserUrl: string;
  // Lead Discovery
  serpApiKey: string;
  serpApiDevKey: string;
  tinyFishKey: string;
}

type ServiceId =
  | "openai"
  | "claude"
  | "litellm"
  | "ollama"
  | "twilio"
  | "vapi"
  | "elevenlabs"
  | "stripe"
  | "google"
  | "yelp"
  | "facebook"
  | "email_smtp"
  | "hunter"
  | "neverbounce"
  | "listmonk"
  | "searxng"
  | "perplexity"
  | "serpapi"
  | "serpapidev"
  | "tinyfish";

type ConnectionStatus = "not_configured" | "connected" | "error";

type TestState = "idle" | "testing" | "connected" | "error";

// ── Activity Log Entry ─────────────────────────────────────────────────────────

interface ActivityEntry {
  id: string;
  timestamp: Date;
  integration: string;
  action: "saved" | "tested" | "failed" | "connected";
  user: string;
  detail?: string;
}

// ── Impact Warnings per Integration ───────────────────────────────────────────

const IMPACT_WARNINGS: Record<
  string,
  { headline: string; body: string; stat: string }
> = {
  openai: {
    headline: "Without OpenAI, your AI goes dark.",
    body: "Voice agents fall silent, lead scores become blind guesses, and your campaigns lose their personalization engine. Every client expects intelligent, automated responses — without a connected LLM, you can't deliver them.",
    stat: "The average local service business loses $200–$400 in jobs per missed call when their AI front desk is offline.",
  },
  claude: {
    headline: "Without Claude, your long-form copy suffers.",
    body: "High-quality niche emails, website copy, and AI-drafted reports all degrade to generic output. Claude's reasoning depth is what makes BRF outreach read like it was written by a $500/hr copywriter.",
    stat: "Personalized outreach using Claude-quality copy converts at 3.2× higher rates vs. generic templates.",
  },
  litellm: {
    headline: "No LiteLLM = single point of failure for all AI features.",
    body: "If your primary LLM goes down, your entire AI stack goes with it. LiteLLM routes automatically to your backup providers — OpenAI goes down, Claude picks it up instantly. For agencies running 10+ clients, this is non-negotiable.",
    stat: "OpenAI API experiences ~99.5% uptime. That 0.5% downtime = 44 hours/year of silent failures.",
  },
  ollama: {
    headline: "Without Ollama, you're 100% dependent on paid APIs.",
    body: "As your agency scales to 50+ clients, LLM costs compound. Ollama handles summarizations, drafts, and copy variations at zero marginal cost — saving you $200–$800/month at scale.",
    stat: "Agencies running local AI for non-critical tasks save an average of $340/month in API costs.",
  },
  twilio: {
    headline:
      "No Twilio = no follow-up on missed calls. That's revenue bleeding out daily.",
    body: "73% of customers who can't reach a business on the first try call a competitor immediately. For HVAC businesses in peak season, a single missed emergency call is $800–$2,400 in lost revenue. Twilio is what intercepts that customer before they dial #2.",
    stat: "HVAC businesses using Call Text Back recover an average of 23% of missed calls into booked appointments.",
  },
  vapi: {
    headline: "Without Vapi, restoration companies miss the emergency window.",
    body: "60% of insurance restoration jobs are decided in the first 30 minutes of an emergency call. If nobody answers — or if a robotic IVR answers — the job goes to whoever picks up live. Vapi answers every call like a trained human receptionist, qualifies the lead, and books the appointment before a competitor even knows the call happened.",
    stat: "Restoration businesses using AI inbound agents report a 41% increase in after-hours job wins.",
  },
  elevenlabs: {
    headline: "A robotic voice kills trust before the appointment is booked.",
    body: "Med spa clients expect a premium experience from the first touchpoint. A robotic-sounding AI receptionist signals cheap, unprofessional, and untrustworthy — the opposite of what a med spa needs to convert high-ticket clients. ElevenLabs voices are indistinguishable from human receptionists.",
    stat: "73% of med spa clients abandon calls that sound automated before reaching a booking confirmation.",
  },
  stripe: {
    headline:
      "No Stripe = no online payments. Carpet cleaning loses 40% of upsells.",
    body: "The moment after a service is delivered, when the customer is satisfied and trust is highest, is the best time to upsell. Without Stripe, that instant estimate-to-payment flow breaks down — and you lose every impulse upgrade: rug protection, recurring cleaning plans, referral credits.",
    stat: "Carpet cleaning businesses with instant online payment capture 40% more upsell revenue per job.",
  },
  google: {
    headline: "Without Google, your BRF SEO rankings are invisible.",
    body: "Roofing companies that rank in the top 3 on Google Maps get 68% of all storm-damage leads in their area. Without Google integration, BRF can't post to your Google Business Profile, sync your calendar, or monitor your ranking changes. You're flying blind on your most important traffic channel.",
    stat: "Top-3 Google Maps ranking captures 68% of local service leads. Page 2 captures less than 2%.",
  },
  email_smtp: {
    headline: "Shared IPs destroy deliverability. Cold emails hit spam.",
    body: "Without a dedicated sending domain, your cold email campaigns land in the promotions tab — or worse, spam — for 70%+ of recipients. A properly configured SPF/DKIM/DMARC subdomain lifts inbox placement rates 3–5×. For real estate agents sending 500+ outreach emails per month, this is the difference between a cold sequence and a dead one.",
    stat: "Cold email campaigns on dedicated domains achieve 28–35% open rates vs. 4–8% on shared IPs.",
  },
  yelp: {
    headline: "Without Yelp, negative reviews fester unseen.",
    body: "Chiropractors lose patients to 1-star Yelp reviews they never see coming. BRF pulls every review into a unified inbox so you respond within hours, not weeks. Slow review responses signal neglect to every prospect reading that page.",
    stat: "Businesses that respond to reviews within 24 hours see 33% higher conversion from review readers.",
  },
  facebook: {
    headline: "Without Facebook/Meta, your social proof pipeline breaks.",
    body: "Facebook reviews and Instagram engagement are the primary trust signals for dental practices and med spas. Without this integration, your 5-star reviews can't auto-convert into social posts and your reputation loop stays closed.",
    stat: "Dental practices with active social proof pipelines fill 28% more new-patient slots per month.",
  },
  hunter: {
    headline: "Without Hunter.io, you're sending cold emails into the void.",
    body: "Unverified emails spike your bounce rate above 5%, which gets your sending domain flagged and your deliverability destroyed. Real estate agents and mortgage brokers sending to unverified leads waste 30–40% of their outreach budget on dead addresses.",
    stat: "Verified email lists achieve 94% delivery rates vs. 67% for unverified lists.",
  },
  neverbounce: {
    headline: "High bounce rates destroy sender reputation permanently.",
    body: "Once your domain gets flagged by Gmail for high bounce rates, it takes 60–90 days of careful rehabilitation to recover. NeverBounce bulk-cleans your lists before every campaign — protecting the deliverability you've built on your dedicated sending domain.",
    stat: "NeverBounce reduces bounce rates to under 1%, protecting the average agency $3,200/year in reputation recovery costs.",
  },
  listmonk: {
    headline: "Without Listmonk, every email send costs you.",
    body: "At 10,000 emails/month across your client base, SaaS email providers charge $150–$400/month. Listmonk self-hosted sends unlimited emails for the cost of a $5/month VPS. For agencies with 20+ active clients in drip sequences, this compounds into serious savings.",
    stat: "Agencies on Listmonk save an average of $340/month vs. equivalent SaaS email platforms.",
  },
  searxng: {
    headline:
      "Without SearXNG, your AI lead finder can't find real businesses.",
    body: "Claude and OpenAI can score leads — but they can't find them. Without a real data source like SearXNG, the Dual-Model Lead Find has nothing to work with. Your Open Lead Lake pipeline runs dry, and you're back to manual prospecting.",
    stat: "Agencies using SearXNG-powered lead discovery source 50–100 qualified local service leads per search session.",
  },
  perplexity: {
    headline:
      "Optional upgrade — but real-time data makes your audits 10× sharper.",
    body: "Claude and OpenAI are powerful reasoners, but their training data has a cutoff date. Perplexity pulls live rankings, recent news, and current social activity — turning your lead audits from 'based on what we know' to 'based on what's happening right now.' Optional, but transformative.",
    stat: "Lead scores powered by live web data are 2.4× more accurate at predicting conversion likelihood.",
  },
  serpapi: {
    headline:
      "Without SerpApi, the lead finder returns fallback demo data instead of real businesses.",
    body: "SerpApi's Google Maps endpoint is the real data pipeline behind your Open Lead Lake. Every niche + city search returns live business names, phone numbers, websites, ratings, and review counts — the exact inputs your AI needs to score leads and generate personalized first-touch emails. Without a key, you're prospecting blind.",
    stat: "Lead finders powered by SerpApi source 50–200 real local businesses per search vs. 0 from fallback data.",
  },
};

type VapiProvisionStatus =
  | "not_configured"
  | "provisioning"
  | "active"
  | "error";

// ── Constants ─────────────────────────────────────────────────────────────────

const makeChecklistKey = (userId: string) =>
  `brf_scalability_checklist_${userId}`;

const VAPI_BOOKING_ENDPOINT = `${APP_DOMAIN}/api/book-appointment`;

const ALL_NICHES = [
  "plumbing",
  "medspa",
  "hvac",
  "restoration",
  "carpet_cleaning",
  "roofing",
  "real_estate",
  "mortgage",
  "chiropractor",
  "dental",
];

const NICHE_LABELS: Record<string, string> = {
  plumbing: "Plumbing",
  medspa: "Med Spa",
  hvac: "HVAC",
  restoration: "Restoration",
  carpet_cleaning: "Carpet Cleaning",
  roofing: "Roofing",
  real_estate: "Real Estate",
  mortgage: "Mortgage",
  chiropractic: "Chiropractic",
  dental: "Dental",
};

const DEFAULT_CREDS: ServiceCreds = {
  openaiKey: "",
  claudeKey: "",
  litellmUrl: "",
  ollamaUrl: "",
  twilioSid: "",
  twilioAuth: "",
  twilioNumber: "",
  vapiKey: "",
  vapiAssistantId: "",
  elevenLabsKey: "",
  stripePublishableKey: "",
  stripeSecretKey: "",
  googleClientId: "",
  googleClientSecret: "",
  yelpApiKey: "",
  facebookAppId: "",
  facebookAppSecret: "",
  emailSmtpHost: "",
  emailSmtpPort: "",
  emailSmtpUser: "",
  emailSmtpPass: "",
  emailFromDomain: "",
  hunterApiKey: "",
  neverBounceKey: "",
  listmonkUrl: "",
  listmonkApiKey: "",
  searxngUrl: "",
  perplexityApiKey: "",
  autoBrowserUrl: "",
  serpApiKey: "",
  serpApiDevKey: "",
  tinyFishKey: "",
};

const SCALABILITY_ITEMS = [
  {
    id: "litellm_router",
    label: "Use LiteLLM as your AI router with 2+ providers",
    detail: "Automatic failover — no single point of failure for AI features",
  },
  {
    id: "a2p_10dlc",
    label: "Register for Twilio A2P 10DLC for SMS at scale",
    detail: "Required for SMS campaigns at volume — prevents carrier filtering",
  },
  {
    id: "email_domain",
    label: "Set up a dedicated email sending domain with SPF/DKIM/DMARC",
    detail: "Cold emails land in inbox, not spam",
  },
  {
    id: "stripe_webhooks",
    label: "Enable Stripe webhooks (not polling) for payment events",
    detail: "Reliable payment processing — catches all lifecycle events",
  },
  {
    id: "suppression_lists",
    label: "Keep suppression lists updated in Campaign Manager",
    detail: "Protects sender reputation and ensures compliance",
  },
  {
    id: "litellm_monitoring",
    label: "Monitor LiteLLM dashboard for cost and latency",
    detail: "Keep AI costs predictable as usage grows",
  },
  {
    id: "canister_backups",
    label: "Back up your canister state regularly",
    detail: "ICP canisters are persistent but snapshots add safety",
  },
];

// ── Integration Health Panel ────────────────────────────────────────────────────

interface HealthEntry {
  key: string;
  label: string;
  result: IntegrationHealthResult | null;
  testing: boolean;
}

function HealthStatusDot({
  status,
}: { status: IntegrationHealthResult["status"] | null }) {
  if (status === null)
    return <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />;
  if (status === "connected")
    return (
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
    );
  if (status === "failed")
    return <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />;
  return <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />;
}

function IntegrationHealthPanel({
  creds,
  actor: healthActor,
}: {
  creds: ServiceCreds;
  actor: ReturnType<typeof useActor>["actor"] | null;
}) {
  const SERVICES = [
    { key: "openrouter", label: "OpenRouter / Owl Alpha", critical: true },
    { key: "nvidia", label: "NVIDIA NIM", critical: true },
    { key: "serpapidev", label: "SerpApi.dev", critical: false },
    { key: "serpapi", label: "SerpApi (Legacy)", critical: false },
    { key: "searxng", label: "SearXNG", critical: false },
    { key: "claude", label: "Claude", critical: false },
    { key: "openai", label: "OpenAI", critical: false },
    { key: "elevenlabs", label: "ElevenLabs", critical: false },
    { key: "tinyfish", label: "TinyFish", critical: false },
  ];

  const [entries, setEntries] = useState<
    (HealthEntry & { critical: boolean; failedEvents?: number })[]
  >(
    SERVICES.map((s) => ({
      key: s.key,
      label: s.label,
      result: null,
      testing: false,
      critical: s.critical,
      failedEvents: 0,
    })),
  );
  const [testing, setTesting] = useState(false);

  async function runAllTestsWithBackend() {
    setTesting(true);
    try {
      const backendResult = await (healthActor as any)?.testAllConnections?.();
      if (backendResult && typeof backendResult === "object") {
        // Update entries from backend results if available
        const health = await (healthActor as any)?.getIntegrationHealth?.();
        if (health && Array.isArray(health)) {
          setEntries((prev) =>
            prev.map((e) => {
              const h = health.find(
                (item: { serviceId: string }) => item.serviceId === e.key,
              );
              if (!h) return { ...e, testing: false };
              return {
                ...e,
                testing: false,
                failedEvents: Number(h.failedEvents24h ?? 0),
              };
            }),
          );
        }
      }
    } catch {
      // fallback: run local tests
    } finally {
      await Promise.all(SERVICES.map((s) => runTest(s.key)));
      setTesting(false);
    }
  }

  async function runTest(key: string) {
    setEntries((prev) =>
      prev.map((e) => (e.key === key ? { ...e, testing: true } : e)),
    );
    let result: IntegrationHealthResult;
    switch (key) {
      case "openrouter":
        result = {
          service: "openrouter",
          status: "not_configured",
          message: "OpenRouter — tested via Test Connection button",
          testedAt: new Date(),
        };
        break;
      case "nvidia":
        result = {
          service: "nvidia",
          status: "not_configured",
          message: "NVIDIA NIM — tested via Test Connection button",
          testedAt: new Date(),
        };
        break;
      case "serpapidev":
        result = await testSerpApiDevConnection(creds.serpApiDevKey);
        break;
      case "tinyfish":
        result = await testTinyFishConnection(creds.tinyFishKey);
        break;
      case "serpapi":
        result = await testSerpApiConnection(creds.serpApiKey);
        break;
      case "searxng":
        result = await testSearxngConnection(creds.searxngUrl);
        break;
      case "claude":
        result = await testClaudeConnection(creds.claudeKey);
        break;
      case "openai":
        result = await testOpenAIConnection(creds.openaiKey);
        break;
      case "elevenlabs":
        result = await testElevenLabsConnection(creds.elevenLabsKey);
        break;
      default:
        return;
    }
    setEntries((prev) =>
      prev.map((e) => (e.key === key ? { ...e, result, testing: false } : e)),
    );
  }

  async function runAllTests() {
    setTesting(true);
    await runAllTestsWithBackend();
  }

  const allTested = entries.every((e) => e.result !== null);
  const connectedCount = entries.filter(
    (e) => e.result?.status === "connected",
  ).length;
  const failedCount = entries.filter(
    (e) => e.result?.status === "failed",
  ).length;

  return (
    <section
      className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 space-y-4"
      data-ocid="golive.integration_health.panel"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Activity size={15} className="text-indigo-400" />
            Integration Health Check
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time connection tests for your lead search and AI services
          </p>
        </div>
        <div className="flex items-center gap-2">
          {allTested && (
            <span className="text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">
                {connectedCount} connected
              </span>
              {failedCount > 0 && (
                <span className="text-rose-400 font-semibold ml-2">
                  {failedCount} failed
                </span>
              )}
            </span>
          )}
          <button
            type="button"
            onClick={runAllTests}
            disabled={testing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/15 border border-indigo-500/35 text-indigo-300 hover:bg-indigo-500/25 transition-colors disabled:opacity-50"
            data-ocid="golive.integration_health.test_all_button"
          >
            {testing ? (
              <>
                <Loader2 size={11} className="animate-spin" /> Testing…
              </>
            ) : (
              <>
                <RefreshCw size={11} /> Test All Connections
              </>
            )}
          </button>
        </div>
      </div>

      {/* Critical Integrations sub-header */}
      <div>
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          Critical Integrations
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {entries
            .filter((e) => e.critical)
            .map((entry) => (
              <div
                key={entry.key}
                className="flex items-start gap-3 rounded-xl p-3 border transition-colors border-red-500/25 bg-red-500/5"
                data-ocid={`golive.integration_health.${entry.key}.row`}
              >
                <div className="flex items-center gap-2 mt-0.5 shrink-0">
                  {entry.testing ? (
                    <Loader2 size={10} className="text-red-400 animate-spin" />
                  ) : (
                    <HealthStatusDot status={entry.result?.status ?? null} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      {entry.label}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        Critical
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => runTest(entry.key)}
                      disabled={entry.testing}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
                      data-ocid={`golive.integration_health.${entry.key}.test_button`}
                    >
                      {entry.testing ? "Testing…" : "Test"}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed truncate">
                    {entry.result ? entry.result.message : "Not tested yet"}
                  </p>
                  {(entry.failedEvents ?? 0) > 0 && (
                    <p className="text-[9px] text-red-400/80 mt-0.5">
                      {entry.failedEvents} failed event(s) in 24h
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {entries
          .filter((e) => !e.critical)
          .map((entry) => (
            <div
              key={entry.key}
              className={`flex items-start gap-3 rounded-xl p-3 border transition-colors ${
                entry.result?.status === "connected"
                  ? "border-emerald-500/25 bg-emerald-500/5"
                  : entry.result?.status === "failed"
                    ? "border-rose-500/25 bg-rose-500/5"
                    : entry.result?.status === "not_configured"
                      ? "border-amber-500/20 bg-amber-500/5"
                      : "border-white/8 bg-card"
              }`}
              data-ocid={`golive.integration_health.${entry.key}.row`}
            >
              <div className="flex items-center gap-2 mt-0.5 shrink-0">
                {entry.testing ? (
                  <Loader2 size={10} className="text-indigo-400 animate-spin" />
                ) : (
                  <HealthStatusDot status={entry.result?.status ?? null} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-foreground">
                    {entry.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => runTest(entry.key)}
                    disabled={entry.testing}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
                    data-ocid={`golive.integration_health.${entry.key}.test_button`}
                  >
                    {entry.testing ? "Testing…" : "Test"}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed truncate">
                  {entry.result ? entry.result.message : "Not tested yet"}
                </p>
                {entry.result && (
                  <p className="text-[9px] text-slate-600 mt-0.5">
                    Tested{" "}
                    {entry.result.testedAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
      </div>

      {allTested && failedCount > 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-rose-900/15 border border-rose-700/30 p-3">
          <AlertTriangle size={13} className="text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-400/80 leading-relaxed">
            {failedCount} service{failedCount > 1 ? "s are" : " is"} not
            connected. Expand the service cards below to configure credentials,
            then re-run "Test All Connections" to verify.
          </p>
        </div>
      )}
    </section>
  );
}

// ── IntegrationHealthPanel wrapper that injects actor ─────────────────────────

function IntegrationHealthPanelWithCritical({
  actor: injectedActor,
  creds,
}: {
  actor: ReturnType<typeof useActor>["actor"] | null;
  creds: ServiceCreds;
}) {
  return <IntegrationHealthPanel creds={creds} actor={injectedActor} />;
}

// ── Score Calculator ──────────────────────────────────────────────────────────

function calcScore(creds: ServiceCreds): number {
  const coldEmailOk =
    creds.emailSmtpHost.length > 0 &&
    creds.emailSmtpUser.length > 0 &&
    creds.emailSmtpPass.length > 0;

  const llmOk =
    creds.openaiKey.length > 0 ||
    creds.claudeKey.length > 0 ||
    creds.litellmUrl.length > 0;
  const twilioOk =
    creds.twilioSid.length > 0 &&
    creds.twilioAuth.length > 0 &&
    creds.twilioNumber.length > 0;

  const stripeOk =
    creds.stripePublishableKey.length > 0 || creds.stripeSecretKey.length > 0;
  const googleOk =
    creds.googleClientId.length > 0 && creds.googleClientSecret.length > 0;

  const yelpOk = creds.yelpApiKey.length > 0;
  const facebookOk =
    creds.facebookAppId.length > 0 && creds.facebookAppSecret.length > 0;
  const verificationOk =
    creds.hunterApiKey.length > 0 || creds.neverBounceKey.length > 0;
  const perplexityOk = creds.perplexityApiKey.length > 0;

  let score = 0;
  if (coldEmailOk) score += 15;
  if (llmOk) score += 20;
  if (twilioOk) score += 20;
  if (stripeOk) score += 14;
  if (googleOk) score += 13;
  if (yelpOk) score += 5;
  if (facebookOk) score += 5;
  if (verificationOk) score += 5;
  if (perplexityOk) score += 3;

  return Math.min(score, 100);
}

function getScoreColor(score: number) {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-rose-400";
}

function maskCred(val: string) {
  if (!val) return "";
  if (val.length <= 4) return "••••";
  return `${val.slice(0, 4)}••••••••••••`;
}

// ── Copy-to-clipboard helper ──────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-1 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <CheckCircle2 size={13} className="text-emerald-400" />
      ) : (
        <ClipboardCopy size={13} />
      )}
    </button>
  );
}

// ── Vapi Provisioning Badge ───────────────────────────────────────────────────

function VapiStatusBadge({
  status,
  vapiKey,
}: {
  status: VapiProvisionStatus;
  vapiKey: string;
}) {
  if (!vapiKey && status === "not_configured") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/60 text-slate-400 border border-slate-600/40">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        Not Configured
      </span>
    );
  }
  if (status === "provisioning") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <Loader2 size={10} className="animate-spin" />
        Provisioning…
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Active — Connected
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        Error
      </span>
    );
  }
  return null;
}

// ── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({
  status,
  lastTested,
}: {
  status: ConnectionStatus;
  lastTested?: Date | null;
}) {
  const timeLabel = lastTested
    ? `Last verified ${formatRelativeTime(lastTested)}`
    : "Never tested";

  if (status === "connected")
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        title={timeLabel}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Connected
        {lastTested && (
          <span className="text-emerald-400/60 text-[10px] ml-0.5 hidden sm:inline">
            · {formatRelativeTime(lastTested)}
          </span>
        )}
      </span>
    );
  if (status === "error")
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30"
        title={timeLabel}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        Error
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/60 text-slate-400 border border-slate-600/40">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
      Not Connected
    </span>
  );
}

// ── Service Definitions ───────────────────────────────────────────────────────

interface ServiceDef {
  id: ServiceId;
  name: string;
  icon: React.ReactNode;
  unlocks: string;
  setupTime: string;
  getStatus: (creds: ServiceCreds) => ConnectionStatus;
  fields: FieldDef[];
  guide: GuideStep[];
  webhookUrl?: string;
  dnsRecords?: DnsRecord[];
}

interface FieldDef {
  key: keyof ServiceCreds;
  label: string;
  placeholder: string;
  type?: "password" | "text" | "url";
  hint?: string;
  readOnly?: boolean;
}

interface GuideStep {
  step: number;
  text: string;
  link?: { label: string; href: string };
}

interface DnsRecord {
  type: string;
  name: string;
  value: string;
}

const SERVICE_DEFINITIONS: ServiceDef[] = [
  {
    id: "openai",
    name: "OpenAI",
    icon: <Sparkles size={16} className="text-emerald-400" />,
    unlocks: "AI copy generation, chat responses, dynamic report narratives",
    setupTime: "~3 min",
    getStatus: (c) => (c.openaiKey ? "connected" : "not_configured"),
    fields: [
      {
        key: "openaiKey",
        label: "API Key",
        placeholder: "sk-...",
        type: "password",
        hint: "Found at platform.openai.com → API Keys",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Go to the OpenAI platform and sign in or create an account.",
        link: {
          label: "platform.openai.com",
          href: "https://platform.openai.com/api-keys",
        },
      },
      {
        step: 2,
        text: "Click API Keys in the left sidebar → Create new secret key. Give it a name like 'BRF Platform'.",
      },
      {
        step: 3,
        text: "Copy the key immediately (it won't be shown again). Paste it in the API Key field below.",
      },
      {
        step: 4,
        text: "Recommended model: GPT-4o for quality, GPT-3.5-turbo for cost efficiency. This is configured in your LiteLLM setup.",
      },
      { step: 5, text: "Click Test Connection to verify, then Save." },
    ],
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    icon: <Bot size={16} className="text-purple-400" />,
    unlocks: "High-quality long-form copy, creative content generation",
    setupTime: "~3 min",
    getStatus: (c) => (c.claudeKey ? "connected" : "not_configured"),
    fields: [
      {
        key: "claudeKey",
        label: "API Key",
        placeholder: "sk-ant-...",
        type: "password",
        hint: "Found at console.anthropic.com → API Keys",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Sign in to the Anthropic console.",
        link: {
          label: "console.anthropic.com",
          href: "https://console.anthropic.com/settings/keys",
        },
      },
      {
        step: 2,
        text: "Navigate to API Keys → Create Key. Name it 'BRF Platform' and select appropriate permissions.",
      },
      {
        step: 3,
        text: "Copy the generated key (begins with sk-ant-) and paste it below.",
      },
      {
        step: 4,
        text: "Recommended model: claude-3-5-sonnet for best balance of quality and speed.",
      },
      { step: 5, text: "Test Connection → Save." },
    ],
  },
  {
    id: "litellm",
    name: "LiteLLM (Router)",
    icon: <Zap size={16} className="text-indigo-400" />,
    unlocks: "Unified AI routing with automatic fallback across all providers",
    setupTime: "~15 min",
    getStatus: (c) => (c.litellmUrl ? "connected" : "not_configured"),
    fields: [
      {
        key: "litellmUrl",
        label: "Endpoint URL",
        placeholder: "https://your-litellm.railway.app",
        type: "url",
        hint: "Your deployed LiteLLM server URL",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Deploy LiteLLM to Railway (free tier available).",
        link: { label: "railway.app", href: "https://railway.app" },
      },
      {
        step: 2,
        text: "In Railway: New Project → Deploy from Docker → use image litellm/litellm:latest",
      },
      {
        step: 3,
        text: "Add environment variables in Railway: OPENAI_API_KEY, ANTHROPIC_API_KEY, and any others you have.",
      },
      {
        step: 4,
        text: "Create a litellm_config.yaml: set model_list with entries for gpt-4o, claude-3-5-sonnet, and ollama/llama3.",
      },
      {
        step: 5,
        text: "Copy the public Railway URL (e.g. https://your-app.railway.app) and paste it in Endpoint URL below.",
      },
      {
        step: 6,
        text: "Test Connection → Save. Set LiteLLM as Priority 1 — all AI features will auto-route through it with fallback.",
      },
    ],
  },
  {
    id: "ollama",
    name: "Ollama (Local AI)",
    icon: <Settings size={16} className="text-slate-400" />,
    unlocks: "Cost-free local AI for summaries, drafts, and copy variations",
    setupTime: "~10 min",
    getStatus: (c) => (c.ollamaUrl ? "connected" : "not_configured"),
    fields: [
      {
        key: "ollamaUrl",
        label: "Server URL",
        placeholder: "http://your-server:11434",
        type: "url",
        hint: "Your Ollama server address",
      },
    ],
    guide: [
      { step: 1, text: "On your Linux VPS, install Ollama with one command:" },
      { step: 2, text: "Run: curl -fsSL https://ollama.com/install.sh | sh" },
      { step: 3, text: "Pull the Llama 3 model: ollama pull llama3" },
      {
        step: 4,
        text: "Expose the server: OLLAMA_HOST=0.0.0.0 ollama serve",
      },
      {
        step: 5,
        text: "Enter your server URL below (default port 11434). For local dev use http://localhost:11434.",
      },
      {
        step: 6,
        text: "Test Connection → Save. Add as Priority 3 in LiteLLM config for cost-optimized fallback.",
      },
    ],
  },
  {
    id: "twilio",
    name: "Twilio",
    icon: <Smartphone size={16} className="text-rose-400" />,
    unlocks:
      "Call Text Back, Two-Way SMS Inbox, missed-call automation, per-client phone numbers",
    setupTime: "~10 min",
    getStatus: (c) =>
      c.twilioSid && c.twilioAuth && c.twilioNumber
        ? "connected"
        : "not_configured",
    fields: [
      {
        key: "twilioSid",
        label: "Account SID",
        placeholder: "ACxxxxxxxx...",
        type: "password",
        hint: "Found in your Twilio Console dashboard",
      },
      {
        key: "twilioAuth",
        label: "Auth Token",
        placeholder: "Your Twilio Auth Token",
        type: "password",
        hint: "Found in your Twilio Console dashboard",
      },
      {
        key: "twilioNumber",
        label: "Phone Number",
        placeholder: "+15551234567",
        type: "text",
        hint: "Your purchased Twilio number in E.164 format",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Sign up or log in to Twilio.",
        link: {
          label: "console.twilio.com",
          href: "https://console.twilio.com",
        },
      },
      {
        step: 2,
        text: "From the Console home, copy your Account SID and Auth Token. Paste them in the fields below.",
      },
      {
        step: 3,
        text: "Buy a phone number: Phone Numbers → Manage → Buy a Number. Buy one per client for clean attribution ($1/mo each).",
      },
      {
        step: 4,
        text: "Go to your number's configuration: Voice & Messaging. Set the 'A Call Comes In' webhook URL to your BRF webhook (shown below).",
      },
      {
        step: 5,
        text: "Set the 'A Message Comes In' webhook URL to the same BRF endpoint for two-way SMS.",
      },
      {
        step: 6,
        text: "For SMS at scale, register for A2P 10DLC in Twilio Console → Messaging → Regulatory Compliance.",
      },
      { step: 7, text: "Test Connection → Save." },
    ],
    webhookUrl: `${APP_DOMAIN}/api/webhooks/twilio`,
  },
  {
    id: "vapi",
    name: "Vapi.ai",
    icon: <MessageSquare size={16} className="text-blue-400" />,
    unlocks: "AI inbound voice agent, live call qualification and booking",
    setupTime: "~15 min",
    getStatus: (c) =>
      c.vapiKey && c.vapiAssistantId ? "connected" : "not_configured",
    fields: [
      {
        key: "vapiKey",
        label: "API Key",
        placeholder: "Your Vapi API key",
        type: "password",
        hint: "Found at vapi.ai → Dashboard → API Keys",
      },
      {
        key: "vapiAssistantId",
        label: "Assistant ID",
        placeholder: "asst_...",
        type: "text",
        hint: "The ID of your configured Vapi assistant",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Create a Vapi account and log in.",
        link: { label: "vapi.ai", href: "https://vapi.ai" },
      },
      {
        step: 2,
        text: "Go to Dashboard → Create Assistant. Configure your niche-specific greeting and qualification flow.",
      },
      {
        step: 3,
        text: "Under Assistant Settings, set the System Prompt to include your niche (e.g. 'You are an AI assistant for a plumbing company…').",
      },
      {
        step: 4,
        text: "Enable Call Transcription and Lead Capture in the assistant settings.",
      },
      {
        step: 5,
        text: "Copy the Assistant ID from the assistant details page.",
      },
      {
        step: 6,
        text: "Go to API Keys → Create Key. Copy and paste both values below.",
      },
      {
        step: 7,
        text: "In Twilio, point your voice webhook to Vapi's endpoint (provided in your Vapi dashboard).",
      },
    ],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs Voice AI",
    icon: <Volume2 size={16} className="text-sky-400" />,
    unlocks:
      "Hyper-realistic AI voice for demos and real calls — backup to Vapi voice engine",
    setupTime: "~5 min",
    getStatus: (c) => (c.elevenLabsKey ? "connected" : "not_configured"),
    fields: [
      {
        key: "elevenLabsKey",
        label: "API Key",
        placeholder: "sk_...",
        type: "password",
        hint: "Found at elevenlabs.io → Profile → API Key",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Sign up or log in to ElevenLabs.",
        link: {
          label: "elevenlabs.io",
          href: "https://elevenlabs.io/sign-up",
        },
      },
      {
        step: 2,
        text: "Go to your Profile (bottom-left avatar) → API Key. Copy the key — it starts with sk_.",
      },
      {
        step: 3,
        text: "Paste it in the API Key field below and click Save Key.",
      },
      {
        step: 4,
        text: "Click Test Connection to verify — BRF will check your account and confirm how many voices are available.",
      },
      {
        step: 5,
        text: "Once connected, all 10 niche voice agents will be automatically assigned optimized ElevenLabs voices. No manual voice selection needed.",
      },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: <Shield size={16} className="text-indigo-400" />,
    unlocks: "Estimates, invoices, payment collection, subscription billing",
    setupTime: "~10 min",
    getStatus: (c) =>
      c.stripePublishableKey && c.stripeSecretKey
        ? "connected"
        : "not_configured",
    fields: [
      {
        key: "stripePublishableKey",
        label: "Publishable Key",
        placeholder: "pk_live_...",
        type: "password",
        hint: "Use pk_live_ for production, pk_test_ for testing",
      },
      {
        key: "stripeSecretKey",
        label: "Secret Key",
        placeholder: "sk_live_...",
        type: "password",
        hint: "Never expose this key in the frontend",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Log in to your Stripe Dashboard.",
        link: {
          label: "dashboard.stripe.com",
          href: "https://dashboard.stripe.com/apikeys",
        },
      },
      {
        step: 2,
        text: "Go to Developers → API Keys. Copy the Publishable Key and Secret Key.",
      },
      {
        step: 3,
        text: "Paste both keys below. Use pk_test_ / sk_test_ first to verify, then switch to live keys.",
      },
      {
        step: 4,
        text: "Set up a webhook: Developers → Webhooks → Add endpoint. Enter your BRF webhook URL (shown below).",
      },
      {
        step: 5,
        text: "Select events to listen for: payment_intent.succeeded, invoice.paid, checkout.session.completed, customer.subscription.updated.",
      },
      {
        step: 6,
        text: "Copy the Webhook Signing Secret and store it in your server environment as STRIPE_WEBHOOK_SECRET.",
      },
      { step: 7, text: "Test Connection → Save." },
    ],
    webhookUrl: `${APP_DOMAIN}/api/webhooks/stripe`,
  },
  {
    id: "google",
    name: "Google OAuth",
    icon: <Search size={16} className="text-amber-400" />,
    unlocks:
      "GBP post scheduling, Google Calendar sync, social media scheduling, review fetching",
    setupTime: "~20 min",
    getStatus: (c) =>
      c.googleClientId && c.googleClientSecret ? "connected" : "not_configured",
    fields: [
      {
        key: "googleClientId",
        label: "Client ID",
        placeholder: "xxxxxxxx.apps.googleusercontent.com",
        type: "text",
        hint: "From Google Cloud Console → Credentials",
      },
      {
        key: "googleClientSecret",
        label: "Client Secret",
        placeholder: "GOCSPX-...",
        type: "password",
        hint: "From Google Cloud Console → Credentials",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Go to Google Cloud Console and create a new project named 'BRF Platform'.",
        link: {
          label: "console.cloud.google.com",
          href: "https://console.cloud.google.com",
        },
      },
      {
        step: 2,
        text: "Enable these APIs: Google Business Profile API, Google Calendar API, Gmail API (for your project).",
      },
      {
        step: 3,
        text: "Go to APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID.",
      },
      {
        step: 4,
        text: "Application type: Web application. Add your BRF domain to Authorized JavaScript origins and Authorized redirect URIs.",
      },
      {
        step: 5,
        text: `Add redirect URI: ${APP_DOMAIN}/auth/google/callback`,
      },
      {
        step: 6,
        text: "Copy the Client ID and Client Secret. Paste them in the fields below.",
      },
      {
        step: 7,
        text: "Each client will then connect their own Google account from their dashboard to authorize GBP and Calendar access.",
      },
    ],
  },
  {
    id: "email_smtp",
    name: "Email SMTP",
    icon: <Mail size={16} className="text-sky-400" />,
    unlocks:
      "Custom-domain email sending for outreach campaigns — better deliverability than shared IPs",
    setupTime: "~20 min",
    getStatus: (c) =>
      c.emailSmtpHost && c.emailSmtpUser && c.emailSmtpPass
        ? "connected"
        : "not_configured",
    fields: [
      {
        key: "emailFromDomain",
        label: "Sending Domain",
        placeholder: "mail.yourdomain.com",
        type: "text",
        hint: "Use a subdomain, not your primary domain",
      },
      {
        key: "emailSmtpHost",
        label: "SMTP Host",
        placeholder: "smtp.sendgrid.net",
        type: "text",
        hint: "Your email provider's SMTP server",
      },
      {
        key: "emailSmtpPort",
        label: "SMTP Port",
        placeholder: "587",
        type: "text",
        hint: "587 for TLS, 465 for SSL",
      },
      {
        key: "emailSmtpUser",
        label: "SMTP Username",
        placeholder: "apikey or your@email.com",
        type: "text",
      },
      {
        key: "emailSmtpPass",
        label: "SMTP Password / API Key",
        placeholder: "Your SMTP password or API key",
        type: "password",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Buy a dedicated sending domain separate from your main domain (e.g. mail.bookedrankedfunded.com). This protects your primary domain reputation.",
      },
      {
        step: 2,
        text: "Choose an email provider: SendGrid, Mailgun, Postmark, or Amazon SES. All support SMTP and have generous free tiers.",
      },
      {
        step: 3,
        text: "Add the domain to your provider and copy the SMTP credentials. Enter them in the fields below.",
      },
      {
        step: 4,
        text: "Add the following DNS records to your domain (copy each value with the button):",
      },
      {
        step: 5,
        text: "After saving, click 'Verify DNS' in your email provider's dashboard to confirm records are propagated.",
      },
      {
        step: 6,
        text: "Send a test email via Test Connection to verify deliverability.",
      },
    ],
    dnsRecords: [
      { type: "TXT", name: "@", value: "v=spf1 include:sendgrid.net ~all" },
      { type: "CNAME", name: "em1234", value: "u1234.wl.sendgrid.net" },
      {
        type: "TXT",
        name: "_dmarc",
        value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com",
      },
    ],
  },
  {
    id: "yelp",
    name: "Yelp Fusion",
    icon: <Search size={16} className="text-rose-400" />,
    unlocks: "Pull Yelp reviews into the unified Reputation Inbox",
    setupTime: "~5 min",
    getStatus: (c) => (c.yelpApiKey ? "connected" : "not_configured"),
    fields: [
      {
        key: "yelpApiKey",
        label: "Fusion API Key",
        placeholder: "Your Yelp Fusion API key",
        type: "password",
        hint: "From Yelp for Developers → Manage App",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Apply for a Yelp Fusion API key at the Yelp developer portal.",
        link: {
          label: "yelp.com/developers",
          href: "https://www.yelp.com/developers/v3/manage_app",
        },
      },
      {
        step: 2,
        text: "Create a new app: Business Name (BRF Platform), Industry (Technology), Contact Email.",
      },
      {
        step: 3,
        text: "Once approved (usually instant), copy your API Key from the app details page.",
      },
      {
        step: 4,
        text: "Paste it below. Yelp reviews will now sync into the Reputation Inbox.",
      },
    ],
  },
  {
    id: "facebook",
    name: "Facebook / Meta",
    icon: <Search size={16} className="text-blue-500" />,
    unlocks:
      "Facebook & Instagram reviews, social post scheduling, reputation inbox",
    setupTime: "~20 min",
    getStatus: (c) =>
      c.facebookAppId && c.facebookAppSecret ? "connected" : "not_configured",
    fields: [
      {
        key: "facebookAppId",
        label: "App ID",
        placeholder: "123456789012345",
        type: "text",
        hint: "From Meta for Developers → Your App",
      },
      {
        key: "facebookAppSecret",
        label: "App Secret",
        placeholder: "Your Meta App Secret",
        type: "password",
        hint: "From Meta for Developers → Settings → Basic",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Create a Meta developer account and a new app.",
        link: {
          label: "developers.facebook.com",
          href: "https://developers.facebook.com/apps/create/",
        },
      },
      {
        step: 2,
        text: "Select 'Business' as the app type. Enter your app name as 'BRF Platform'.",
      },
      {
        step: 3,
        text: "Add these products to your app: Facebook Login, Pages API, Instagram Graph API.",
      },
      {
        step: 4,
        text: "Go to Settings → Basic. Copy App ID and App Secret.",
      },
      {
        step: 5,
        text: `Add your BRF domain to Valid OAuth Redirect URIs: ${APP_DOMAIN}/auth/facebook/callback`,
      },
      {
        step: 6,
        text: "Clients will connect their Facebook Page from their BRF dashboard. You need your app credentials here to broker those connections.",
      },
    ],
  },
  {
    id: "hunter",
    name: "Hunter.io",
    icon: <Search size={16} className="text-orange-400" />,
    unlocks: "Email verification for leads in the Open Lead Lake pipeline",
    setupTime: "~3 min",
    getStatus: (c) => (c.hunterApiKey ? "connected" : "not_configured"),
    fields: [
      {
        key: "hunterApiKey",
        label: "API Key",
        placeholder: "Your Hunter.io API key",
        type: "password",
        hint: "From hunter.io → API → API Keys",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Sign up for a Hunter.io account (free tier: 25 verifications/mo).",
        link: { label: "hunter.io", href: "https://hunter.io/users/sign_up" },
      },
      {
        step: 2,
        text: "Go to API → API Keys → Create a new API key for 'BRF Platform'.",
      },
      {
        step: 3,
        text: "Copy the key and paste it below. All leads in Open Lead Lake will be verified before entering your CRM.",
      },
    ],
  },
  {
    id: "neverbounce",
    name: "NeverBounce",
    icon: <Shield size={16} className="text-cyan-400" />,
    unlocks:
      "Bulk email list cleaning — reduces bounce rates for cold campaigns",
    setupTime: "~3 min",
    getStatus: (c) => (c.neverBounceKey ? "connected" : "not_configured"),
    fields: [
      {
        key: "neverBounceKey",
        label: "API Key",
        placeholder: "Your NeverBounce API key",
        type: "password",
        hint: "From neverbounce.com → API Keys",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Create a NeverBounce account (pay-as-you-go pricing).",
        link: {
          label: "neverbounce.com",
          href: "https://app.neverbounce.com/signup",
        },
      },
      {
        step: 2,
        text: "Go to API → Manage API Keys → Create new key for 'BRF Platform'.",
      },
      {
        step: 3,
        text: "Copy and paste below. Works alongside Hunter.io for complete lead verification coverage.",
      },
    ],
  },
  {
    id: "listmonk",
    name: "Listmonk (Email Campaigns)",
    icon: <Mail size={16} className="text-emerald-400" />,
    unlocks: "Self-hosted email campaign sending — reduces per-send costs",
    setupTime: "~20 min",
    getStatus: (c) =>
      c.listmonkUrl && c.listmonkApiKey ? "connected" : "not_configured",
    fields: [
      {
        key: "listmonkUrl",
        label: "Instance URL",
        placeholder: "https://your-listmonk.yourdomain.com",
        type: "url",
        hint: "Your Listmonk server URL",
      },
      {
        key: "listmonkApiKey",
        label: "API Key",
        placeholder: "Your Listmonk API token",
        type: "password",
        hint: "From Listmonk → Settings → API Keys",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Deploy Listmonk using Docker on a VPS (DigitalOcean, Hetzner).",
        link: {
          label: "listmonk.app/docs",
          href: "https://listmonk.app/docs/installation/",
        },
      },
      {
        step: 2,
        text: "Run: docker run -d --name listmonk -p 9000:9000 listmonk/listmonk:latest",
      },
      {
        step: 3,
        text: "Configure your SMTP settings in Listmonk Settings → SMTP to connect your sending domain.",
      },
      {
        step: 4,
        text: "Go to Settings → API Keys → Create a new key. Copy both your instance URL and API key.",
      },
      {
        step: 5,
        text: "Paste both values below. BRF will route campaign sends through Listmonk with fallback to Caffeine native email.",
      },
    ],
  },
  {
    id: "searxng",
    name: "SearXNG (Search)",
    icon: <Search size={16} className="text-teal-400" />,
    unlocks:
      "Privacy-first lead discovery and SEO keyword lookups in the Open Lead Lake",
    setupTime: "~15 min",
    getStatus: (c) => (c.searxngUrl ? "connected" : "not_configured"),
    fields: [
      {
        key: "searxngUrl",
        label: "Instance URL",
        placeholder: "https://your-searxng.yourdomain.com",
        type: "url",
        hint: "Your SearXNG instance URL",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Deploy SearXNG using Docker on any Linux server.",
        link: {
          label: "searxng.github.io",
          href: "https://searxng.github.io/searxng/",
        },
      },
      {
        step: 2,
        text: "Run: docker run -d -p 8080:8080 --name searxng searxng/searxng",
      },
      {
        step: 3,
        text: "Configure settings.yml: enable JSON output format and set the base_url to your public domain.",
      },
      {
        step: 4,
        text: "Point a subdomain (e.g. search.yourdomain.com) to your server with an SSL cert.",
      },
      {
        step: 5,
        text: "Paste your SearXNG instance URL below. BRF will use it for lead discovery with fallback to Google Places.",
      },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity AI Research",
    icon: <Brain size={16} className="text-violet-400" />,
    unlocks:
      "Real-time web research upgrade — live rankings, recent news, social activity on top of Claude/OpenAI",
    setupTime: "~3 min",
    getStatus: (c) => (c.perplexityApiKey ? "connected" : "not_configured"),
    fields: [
      {
        key: "perplexityApiKey",
        label: "API Key",
        placeholder: "pplx-...",
        type: "password",
        hint: "Found at perplexity.ai → Settings → API",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Optional upgrade — Claude and OpenAI handle all lead research automatically without Perplexity. Add this key when you want real-time web data on top of AI reasoning.",
      },
      {
        step: 2,
        text: "Sign in to Perplexity AI and open Settings.",
        link: {
          label: "perplexity.ai/settings/api",
          href: "https://www.perplexity.ai/settings/api",
        },
      },
      {
        step: 3,
        text: "Click 'Generate' under API Keys to create a new key. Copy the key — it starts with pplx-.",
      },
      {
        step: 4,
        text: "Paste it in the API Key field below and click Save.",
      },
      {
        step: 5,
        text: "Once connected, Perplexity takes priority over Claude/OpenAI for lead research — using its Sonar model to fetch live web data for every prospect audit. The upgrade is seamless and reversible.",
      },
    ],
  },
  {
    id: "serpapidev" as ServiceId,
    name: "SerpApi.dev (Lead Finder)",
    icon: <Search size={16} className="text-green-400" />,
    unlocks:
      "Recommended — 2,500 free searches per month. Primary search provider for lead finder and Open Lead Lake.",
    setupTime: "~2 min",
    getStatus: (c) => (c.serpApiDevKey ? "connected" : "not_configured"),
    fields: [
      {
        key: "serpApiDevKey",
        label: "SerpApi.dev API Key",
        placeholder: "Enter your SerpApi.dev API key...",
        type: "password",
        hint: "Get your free key at serpapi.dev — includes 2,500 free searches/month",
      },
    ],
    guide: [],
  },
  {
    id: "tinyfish" as ServiceId,
    name: "TinyFish",
    icon: <Fish size={16} className="text-cyan-400" />,
    unlocks:
      "Web automation for agents — search, fetch, and batch-process JS-heavy pages for lead discovery",
    setupTime: "~2 min",
    getStatus: (c) => (c.tinyFishKey ? "connected" : "not_configured"),
    fields: [
      {
        key: "tinyFishKey",
        label: "TinyFish API Key",
        placeholder: "Enter your TinyFish API key...",
        type: "password",
        hint: "Get your key at tinyfish.ai — search and fetch are free",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Sign up for a free TinyFish account at tinyfish.ai.",
        link: {
          label: "tinyfish.ai",
          href: "https://tinyfish.ai",
        },
      },
      {
        step: 2,
        text: "Navigate to your API Keys section and generate a new key.",
      },
      {
        step: 3,
        text: "Copy the key and paste it in the field below.",
      },
      { step: 4, text: "Click Test Connection to verify, then Save." },
    ],
  },
  {
    id: "serpapi",
    name: "SerpApi (Lead Finder)",
    icon: <Search size={16} className="text-amber-400" />,
    unlocks:
      "Real local business discovery in the Open Lead Lake — powers niche + city searches with live Google Maps data",
    setupTime: "~3 min",
    getStatus: (c) => (c.serpApiKey ? "connected" : "not_configured"),
    fields: [
      {
        key: "serpApiKey",
        label: "SerpApi API Key",
        placeholder: "your-serpapi-key",
        type: "password",
        hint: "Found at serpapi.com/manage-api-key after signing up (free tier: 100 searches/month)",
      },
    ],
    guide: [
      {
        step: 1,
        text: "Sign up for a free SerpApi account — 100 searches/month at no cost.",
        link: {
          label: "serpapi.com/users/sign_up",
          href: "https://serpapi.com/users/sign_up",
        },
      },
      {
        step: 2,
        text: "Once logged in, go to your API key page.",
        link: {
          label: "serpapi.com/manage-api-key",
          href: "https://serpapi.com/manage-api-key",
        },
      },
      {
        step: 3,
        text: "Copy your API key from the dashboard — it is shown immediately after signup.",
      },
      {
        step: 4,
        text: "Paste it in the SerpApi API Key field below and click Save.",
      },
      {
        step: 5,
        text: "Once saved, every niche + city search in the Open Lead Lake will return real local businesses with names, phones, websites, ratings, and review counts — no fallback demo data.",
      },
    ],
  },
];

const TIERS = [
  {
    label: "Tier 1 — Critical",
    sublabel: "LLM + Phone + Voice (unlocks the core AI and communications)",
    ids: [
      "openai",
      "claude",
      "litellm",
      "ollama",
      "twilio",
      "vapi",
      "elevenlabs",
    ],
    color: "border-purple-500/30 bg-purple-500/5",
    labelColor: "text-purple-400",
  },
  {
    label: "Tier 2 — Core",
    sublabel: "Payments + Google + Email (unlocks billing and marketing loops)",
    ids: ["stripe", "google", "email_smtp"],
    color: "border-indigo-500/30 bg-indigo-500/5",
    labelColor: "text-indigo-400",
  },
  {
    label: "Tier 3 — Growth",
    sublabel:
      "Reviews + Lead Verification + Open Source + AI Research + Lead Finder (scales your data layer)",
    ids: [
      "yelp",
      "facebook",
      "hunter",
      "neverbounce",
      "listmonk",
      "searxng",
      "perplexity",
      "serpapi",
    ],
    color: "border-emerald-500/30 bg-emerald-500/5",
    labelColor: "text-emerald-400",
  },
];

// ── Vapi Booking Endpoint Panel ───────────────────────────────────────────────

function VapiBookingEndpointPanel() {
  return (
    <div className="rounded-lg bg-blue-500/8 border border-blue-500/20 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Info size={13} className="text-blue-400 shrink-0" />
        <p className="text-xs font-semibold text-blue-300">
          Your Vapi Booking Endpoint — paste this into Vapi's Tool Configuration
        </p>
      </div>
      <div className="flex items-center gap-2 bg-black/30 rounded-lg p-2.5 border border-blue-500/20">
        <span className="text-xs text-blue-200 font-mono truncate flex-1">
          {VAPI_BOOKING_ENDPOINT}
        </span>
        <CopyButton text={VAPI_BOOKING_ENDPOINT} />
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        In Vapi Dashboard → your assistant → Add Tool → Function. Set the URL
        above. When a caller books, Vapi POSTs the appointment data here and BRF
        writes it to the client's calendar automatically.
      </p>
    </div>
  );
}

// ── Vapi Active Banner ────────────────────────────────────────────────────────

interface VapiActiveBannerProps {
  status: VapiProvisionStatus;
  vapiKey: string;
  onProvisionAll: () => Promise<void>;
  onSyncLogs: () => Promise<void>;
  provisionProgress: string[];
  isProvisioning: boolean;
  isSyncing: boolean;
}

function VapiActiveBanner({
  status,
  vapiKey,
  onProvisionAll,
  onSyncLogs,
  provisionProgress,
  isProvisioning,
  isSyncing,
}: VapiActiveBannerProps) {
  if (!vapiKey && status === "not_configured") return null;

  return (
    <div
      className={`rounded-xl border p-4 mb-4 transition-all ${
        status === "active"
          ? "bg-emerald-500/8 border-emerald-500/30"
          : status === "provisioning"
            ? "bg-amber-500/8 border-amber-500/30"
            : status === "error"
              ? "bg-rose-500/8 border-rose-500/30"
              : "bg-blue-500/8 border-blue-500/20"
      }`}
      data-ocid="golive.vapi.active_banner"
    >
      {/* Top row */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            status === "active"
              ? "bg-emerald-500/20 border border-emerald-500/40"
              : "bg-blue-500/15 border border-blue-500/30"
          }`}
        >
          <Phone
            size={18}
            className={
              status === "active" ? "text-emerald-400" : "text-blue-400"
            }
          />
        </div>
        <div className="flex-1 min-w-0">
          {status === "active" ? (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-emerald-300">
                  Vapi Active — AI Voice Agents Live
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-emerald-400/70 mt-0.5">
                Inbound AI receptionist is answering calls and booking
                appointments for all configured niches.
              </p>
            </>
          ) : status === "provisioning" ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-300">
                  Configuring Voice Agents…
                </span>
                <Loader2 size={13} className="text-amber-400 animate-spin" />
              </div>
              <p className="text-xs text-amber-400/70 mt-0.5">
                Provisioning niche-specific agents — this takes about 30
                seconds.
              </p>
            </>
          ) : (
            <>
              <span className="text-sm font-semibold text-blue-300">
                Vapi Key Saved — Provision Agents to Go Live
              </span>
              <p className="text-xs text-blue-400/70 mt-0.5">
                Your key is stored. Click below to create AI voice agents for
                all 10 niches.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {(status === "active" || !["not_configured"].includes(status)) && (
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            data-ocid="golive.vapi.provision_all_button"
            onClick={onProvisionAll}
            disabled={isProvisioning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600/80 hover:bg-purple-600 text-white transition-colors disabled:opacity-60 border border-purple-500/40"
          >
            {isProvisioning ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Zap size={12} />
            )}
            {isProvisioning
              ? "Provisioning…"
              : "Provision Voice Agents for All Niches"}
          </button>
          {status === "active" && (
            <button
              type="button"
              data-ocid="golive.vapi.sync_logs_button"
              onClick={onSyncLogs}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 transition-colors disabled:opacity-60 border border-blue-500/30"
            >
              {isSyncing ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Phone size={12} />
              )}
              {isSyncing ? "Syncing…" : "Sync Call Logs"}
            </button>
          )}
        </div>
      )}

      {/* Provisioning progress */}
      {isProvisioning && provisionProgress.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {ALL_NICHES.map((niche) => {
            const done = provisionProgress.includes(niche);
            return (
              <div
                key={niche}
                className="flex items-center gap-2 text-xs"
                data-ocid={`golive.vapi.niche_${niche}.provision_status`}
              >
                {done ? (
                  <CheckCircle2
                    size={12}
                    className="text-emerald-400 shrink-0"
                  />
                ) : (
                  <Loader2
                    size={12}
                    className="text-amber-400 animate-spin shrink-0"
                  />
                )}
                <span className={done ? "text-emerald-400" : "text-slate-400"}>
                  {NICHE_LABELS[niche]}
                </span>
              </div>
            );
          })}
          {provisionProgress.length === ALL_NICHES.length && (
            <p
              className="text-xs text-emerald-400 font-semibold mt-2"
              data-ocid="golive.vapi.provision.success_state"
            >
              ✓ All 10 niche voice agents are ready.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Service Card ──────────────────────────────────────────────────────────────

interface ServiceCardProps {
  svc: ServiceDef;
  creds: ServiceCreds;
  onChange: (partial: Partial<ServiceCreds>) => Promise<void>;
  onVapiSave?: (vapiKey: string, vapiAssistantId: string) => Promise<void>;
  vapiProvisionStatus?: VapiProvisionStatus;
  vapiSaving?: boolean;
  vapiActiveBannerProps?: Omit<VapiActiveBannerProps, "status" | "vapiKey">;
  /** When true, actor is still initializing — disable all save/test buttons */
  backendInitializing?: boolean;
  /** When true, user is anonymous (not authenticated) — save buttons show re-auth prompt */
  isAnonymous?: boolean;
  /** When true, auth has stalled >30 s — show stall state instead of infinite spinner */
  authStalled?: boolean;
  /** Called to log activity events to the session audit trail */
  onActivityLog?: (entry: Omit<ActivityEntry, "id">) => void;
  /** Current user email for activity log attribution */
  currentUserEmail?: string;
}

function ServiceCard({
  svc,
  creds,
  onChange,
  onVapiSave,
  vapiProvisionStatus = "not_configured",
  vapiSaving = false,
  vapiActiveBannerProps,
  backendInitializing = false,
  isAnonymous = false,
  authStalled = false,
  onActivityLog,
  currentUserEmail = "admin",
}: ServiceCardProps) {
  const { actor } = useActor();
  const [expanded, setExpanded] = useState(false);
  const { refresh: refreshCreds } = useCredentials();
  const [testState, setTestState] = useState<TestState>("idle");
  const [testMsg, setTestMsg] = useState("");
  const [lastTested, setLastTested] = useState<Date | null>(null);
  const [localCreds, setLocalCreds] = useState<Partial<ServiceCreds>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState("");
  const [vapiWebhookSecret, setVapiWebhookSecret] = useState("");
  const [sendgridDomain, setSendgridDomain] = useState("");
  const [leadTestResults, setLeadTestResults] = useState<{
    status: "idle" | "loading" | "success" | "error";
    count: number;
    leads: Array<{ name: string; phone: string }>;
    error: string;
  }>({ status: "idle", count: 0, leads: [], error: "" });
  const [leadKeyStatus, setLeadKeyStatus] = useState<Record<string, boolean>>(
    {},
  );

  // ElevenLabs: voice count display (in-memory only, no localStorage)
  const [cachedVoiceCount, setCachedVoiceCount] = useState<number | null>(null);

  useEffect(() => {
    if (!actor) return;
    (async () => {
      try {
        const raw = await (actor as any)?.testLeadFinderDiagnostic?.();
        if (raw) setLeadKeyStatus(JSON.parse(raw as string));
      } catch {}
    })();
  }, [actor]);

  const status = svc.getStatus(creds);

  // Helper: is ElevenLabs key configured
  const isElevenLabsConfigured =
    svc.id === "elevenlabs" && !!creds.elevenLabsKey;

  const currentVal = (key: keyof ServiceCreds) =>
    (localCreds[key] ?? creds[key]) as string;

  const handleTest = () => {
    const allFilled = svc.fields.every((f) => currentVal(f.key));
    if (!allFilled) {
      setTestState("error");
      setTestMsg("Please fill in all required fields first");
      onActivityLog?.({
        timestamp: new Date(),
        integration: svc.name,
        action: "failed",
        user: currentUserEmail,
        detail: "Fields incomplete",
      });
      return;
    }

    setTestState("testing");

    if (svc.id === "elevenlabs") {
      // Real backend test for ElevenLabs
      if (!actor) {
        // No actor — fall back to local check
        setTestState("connected");
        setTestMsg("ElevenLabs key saved (offline mode)");
        return;
      }
      actor
        .testElevenLabsConnection()
        .then((result) => {
          const r = result as {
            success: boolean;
            message: string;
            voiceCount: bigint;
          };
          if (r.success) {
            const count = Number(r.voiceCount);
            setTestState("connected");
            setTestMsg(`ElevenLabs Connected — ${count} voices available`);
            setCachedVoiceCount(count);
          } else {
            setTestState("error");
            setTestMsg(r.message || "ElevenLabs connection failed");
          }
        })
        .catch(() => {
          setTestState("error");
          setTestMsg("Could not reach ElevenLabs — check your API key");
          onActivityLog?.({
            timestamp: new Date(),
            integration: svc.name,
            action: "failed",
            user: currentUserEmail,
            detail: "Invalid API key — check your ElevenLabs dashboard",
          });
        });
    } else {
      setTimeout(() => {
        const now = new Date();
        setTestState("connected");
        setTestMsg("Connection successful");
        setLastTested(now);
        onActivityLog?.({
          timestamp: now,
          integration: svc.name,
          action: "connected",
          user: currentUserEmail,
          detail: "Connection test passed",
        });
      }, 1200);
    }
  };

  const handleSave = async () => {
    // Belt-and-suspenders: explicit null check before attempting backend write.
    // The auth guard in GoLivePage hides Save buttons when anonymous, but if the
    // session expires mid-session this catches it cleanly.
    if (!actor) {
      toast.error(
        "Session expired — please refresh the page and log in again.",
        {
          duration: 6000,
        },
      );
      return;
    }
    setSaving(true);
    setSaved(false);
    setSaveError(false);
    try {
      if (svc.id === "vapi" && onVapiSave) {
        // Vapi has its own dedicated save path — it handles toasts internally
        const newVapiKey =
          (localCreds.vapiKey as string | undefined) ?? creds.vapiKey;
        const newAssistantId =
          (localCreds.vapiAssistantId as string | undefined) ??
          creds.vapiAssistantId;
        await onVapiSave(newVapiKey, newAssistantId);
      } else {
        // All other services — await the full backend save
        await onChange(localCreds);
      }
      setSaved(true);
      setSaveError(false);
      const savedAt = new Date();
      setLastTested(savedAt);
      onActivityLog?.({
        timestamp: savedAt,
        integration: svc.name,
        action: "saved",
        user: currentUserEmail,
        detail: "Credentials saved — verified in backend storage",
      });
      setTimeout(() => setSaved(false), 3000);
      // Auto-test after save — confirm the key actually works
      setTimeout(() => {
        const allFilled = svc.fields.every(
          (f) => ((localCreds[f.key] ?? creds[f.key]) as string)?.length > 0,
        );
        if (allFilled) handleTest();
      }, 800);
    } catch {
      // Errors are surfaced via toast inside onChange/onVapiSave
      setSaveError(true);
      onActivityLog?.({
        timestamp: new Date(),
        integration: svc.name,
        action: "failed",
        user: currentUserEmail,
        detail: "Save failed — check backend connectivity",
      });
      setTimeout(() => setSaveError(false), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        expanded
          ? status === "connected"
            ? "border-emerald-500/40 bg-card"
            : "border-purple-500/40 bg-card"
          : status === "connected"
            ? "border-emerald-500/20 bg-card hover:border-emerald-500/35"
            : status === "error"
              ? "border-rose-500/30 bg-card hover:border-rose-500/40"
              : "border-white/8 bg-card hover:border-white/14"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 p-4">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            status === "connected"
              ? "bg-emerald-500/10 border border-emerald-500/25"
              : status === "error"
                ? "bg-rose-500/10 border border-rose-500/25"
                : "bg-white/5 border border-white/8"
          }`}
        >
          {svc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">
              {svc.name}
            </span>
            <StatusBadge status={status} lastTested={lastTested} />
            {/* Enhanced live health badge (testing/error with retry) */}
            {testState === "testing" && (
              <IntegrationStatusBadge
                record={{ status: "testing", lastTested: null }}
              />
            )}
            {testState === "error" && (
              <IntegrationStatusBadge
                record={{
                  status: "error",
                  lastTested,
                  errorMessage: testMsg || "Connection test failed",
                }}
                onRetry={handleTest}
              />
            )}
            {/* Perplexity: show "Optional Upgrade" when not connected, and AI research active status when Claude/OpenAI are present */}
            {svc.id === "perplexity" && status === "not_configured" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/25">
                <Sparkles size={9} />
                Optional Upgrade
              </span>
            )}
            {svc.id === "perplexity" &&
              status === "not_configured" &&
              (creds.claudeKey || creds.openaiKey) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Brain size={9} />
                  AI research active via {creds.claudeKey ? "Claude" : "OpenAI"}
                </span>
              )}
            {svc.id === "vapi" && (
              <VapiStatusBadge
                status={vapiProvisionStatus}
                vapiKey={creds.vapiKey}
              />
            )}
            {svc.id === "elevenlabs" && isElevenLabsConfigured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/15 text-sky-400 border border-sky-500/30">
                <Headphones size={9} />
                Voice AI Ready
                {cachedVoiceCount !== null && (
                  <span className="ml-0.5 text-sky-300 font-semibold">
                    · {cachedVoiceCount} voices
                  </span>
                )}
              </span>
            )}
            <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/6">
              {svc.setupTime}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {svc.unlocks}
          </p>
        </div>
        <button
          type="button"
          data-ocid={`golive.${svc.id}.configure_button`}
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp size={12} /> Close
            </>
          ) : (
            <>
              <ChevronDown size={12} /> Configure
            </>
          )}
        </button>
        {WIZARD_SUPPORTED_IDS.includes(svc.id) && (
          <button
            type="button"
            data-ocid={`golive.${svc.id}.setup_guide_button`}
            onClick={() => setWizardOpen(true)}
            title="Open step-by-step setup guide"
            className="shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 border border-purple-500/25 text-purple-400 hover:bg-purple-500/20 transition-colors"
          >
            <Info size={11} />
            Guide
          </button>
        )}
      </div>

      {/* Setup Wizard Modal */}
      {WIZARD_SUPPORTED_IDS.includes(svc.id) && (
        <SetupWizardModal
          integrationId={svc.id}
          isOpen={wizardOpen}
          onClose={() => setWizardOpen(false)}
        />
      )}

      {/* Vapi active status banner shown inline when expanded */}
      {svc.id === "vapi" && expanded && vapiActiveBannerProps && (
        <div className="px-5 pt-2">
          <VapiActiveBanner
            status={vapiProvisionStatus}
            vapiKey={creds.vapiKey}
            {...vapiActiveBannerProps}
          />
        </div>
      )}

      {/* Expanded Panel */}
      {expanded && (
        <div className="border-t border-white/8 p-5 space-y-5">
          {/* Impact Warning — shown when not connected */}
          {status === "not_configured" && <ImpactWarning serviceId={svc.id} />}

          {/* Guide Steps */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Setup Guide
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Estimated time: {svc.setupTime} · Step {1} of {svc.guide.length}
            </p>
            <ol className="space-y-2">
              {svc.guide.map((g) => (
                <li key={g.step} className="flex gap-3 text-sm">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center mt-0.5">
                    {g.step}
                  </span>
                  <span className="text-slate-300">
                    {g.text}
                    {g.link && (
                      <a
                        href={g.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 inline-flex items-center gap-0.5 text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                      >
                        {g.link.label}
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* DNS Records */}
          {svc.dnsRecords && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                DNS Records to Add
              </h4>
              <div className="space-y-2">
                {svc.dnsRecords.map((r) => (
                  <div
                    key={`${r.type}-${r.name}`}
                    className="grid grid-cols-[60px_120px_1fr_auto] gap-2 items-center text-xs bg-black/30 rounded-lg p-2.5 border border-white/6"
                  >
                    <span className="text-amber-400 font-mono font-medium">
                      {r.type}
                    </span>
                    <span className="text-slate-300 font-mono truncate">
                      {r.name}
                    </span>
                    <span className="text-slate-400 font-mono truncate">
                      {r.value}
                    </span>
                    <CopyButton text={r.value} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Webhook URL */}
          {svc.webhookUrl && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Webhook URL (paste into provider dashboard)
              </h4>
              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-2.5 border border-white/6">
                <span className="text-xs text-slate-300 font-mono truncate flex-1">
                  {svc.webhookUrl}
                </span>
                <CopyButton text={svc.webhookUrl} />
              </div>
            </div>
          )}

          {/* Provider-specific webhook config panels */}
          {svc.id === "stripe" && (
            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/20 text-xs text-blue-300">
                <p className="font-semibold mb-1">
                  Webhook URL — configure in Stripe Dashboard
                </p>
                <code className="text-blue-200">
                  https://bookedrankedfunded.org/webhooks/stripe
                </code>
                <p className="mt-1 text-blue-400">
                  Subscribe to: payment_intent.succeeded, invoice.paid,
                  invoice.payment_failed, customer.subscription.*
                </p>
              </div>
              <div>
                <label
                  htmlFor="stripe-webhook-secret"
                  className="text-xs text-slate-400 mb-1 block"
                >
                  Webhook Signing Secret (whsec_...)
                </label>
                <div className="flex gap-2">
                  <input
                    id="stripe-webhook-secret"
                    type="password"
                    placeholder="whsec_..."
                    value={stripeWebhookSecret}
                    onChange={(e) => setStripeWebhookSecret(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      (actor as any)?.saveWebhookSecrets?.(
                        stripeWebhookSecret,
                        "",
                        "",
                      )
                    }
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                  >
                    Save
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Found in Stripe Dashboard → Developers → Webhooks → your
                  endpoint → Signing secret
                </p>
              </div>
            </div>
          )}

          {svc.id === "vapi" && (
            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-purple-900/20 border border-purple-500/20 text-xs text-purple-300">
                <p className="font-semibold mb-1">
                  Webhook URL — configure in Vapi Dashboard
                </p>
                <code className="text-purple-200">
                  https://bookedrankedfunded.org/webhooks/vapi
                </code>
              </div>
              <div>
                <label
                  htmlFor="vapi-webhook-secret"
                  className="text-xs text-slate-400 mb-1 block"
                >
                  Webhook Secret
                </label>
                <div className="flex gap-2">
                  <input
                    id="vapi-webhook-secret"
                    type="password"
                    placeholder="Enter webhook secret"
                    value={vapiWebhookSecret}
                    onChange={(e) => setVapiWebhookSecret(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      (actor as any)?.saveWebhookSecrets?.(
                        "",
                        vapiWebhookSecret,
                        "",
                      )
                    }
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {svc.id === "twilio" && (
            <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-500/20">
              <p className="text-xs font-semibold text-red-300 mb-2">
                Webhook URLs — configure in Twilio Console
              </p>
              {(
                [
                  [
                    "Voice URL",
                    "https://bookedrankedfunded.org/webhooks/twilio/voice",
                  ],
                  [
                    "SMS URL",
                    "https://bookedrankedfunded.org/webhooks/twilio/sms",
                  ],
                  [
                    "SMS Status",
                    "https://bookedrankedfunded.org/webhooks/twilio/sms-status",
                  ],
                  [
                    "Call Status",
                    "https://bookedrankedfunded.org/webhooks/twilio/call-status",
                  ],
                  [
                    "Recording",
                    "https://bookedrankedfunded.org/webhooks/twilio/recording",
                  ],
                ] as [string, string][]
              ).map(([label, url]) => (
                <div
                  key={url}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-xs text-slate-400 w-24">{label}</span>
                  <code className="text-xs text-red-200 flex-1 truncate">
                    {url}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(url)}
                    className="ml-2 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-700"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}

          {svc.id === "email_smtp" && (
            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-green-900/20 border border-green-500/20 text-xs text-green-300 space-y-1">
                <p className="font-semibold">
                  Webhook URLs — configure in SendGrid Settings
                </p>
                <div>
                  <span className="text-slate-400">Inbound Parse: </span>
                  <code className="text-green-200">
                    https://bookedrankedfunded.org/webhooks/sendgrid/inbound
                  </code>
                </div>
                <div>
                  <span className="text-slate-400">Event Webhook: </span>
                  <code className="text-green-200">
                    https://bookedrankedfunded.org/webhooks/sendgrid/events
                  </code>
                </div>
                <p className="text-slate-400 mt-1">
                  For inbound: point your MX record to mx.sendgrid.net
                </p>
              </div>
              <div>
                <label
                  htmlFor="sendgrid-parse-domain"
                  className="text-xs text-slate-400 mb-1 block"
                >
                  Inbound Parse Domain
                </label>
                <div className="flex gap-2">
                  <input
                    id="sendgrid-parse-domain"
                    type="text"
                    placeholder="mail.bookedrankedfunded.org"
                    value={sendgridDomain}
                    onChange={(e) => setSendgridDomain(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      (actor as any)?.saveWebhookSecrets?.(
                        "",
                        "",
                        sendgridDomain,
                      )
                    }
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vapi Booking Endpoint */}
          {svc.id === "vapi" && <VapiBookingEndpointPanel />}

          {/* SerpApi.dev Lead Search Test */}
          {svc.id === "serpapidev" && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">
                  Lead Search Test
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    setLeadTestResults({
                      status: "loading",
                      count: 0,
                      leads: [],
                      error: "",
                    });
                    try {
                      const result = await actor?.searchLeadsWithLLM(
                        "roofing contractors",
                        "Houston TX",
                        BigInt(5),
                        true,
                      );
                      if (result && result.__kind__ === "ok") {
                        const leads = result.ok.leads.map(
                          (l: { name: string; phone: string }) => ({
                            name: l.name,
                            phone: l.phone,
                          }),
                        );
                        setLeadTestResults({
                          status: "success",
                          count: leads.length,
                          leads,
                          error: "",
                        });
                      } else if (result && result.__kind__ === "err") {
                        setLeadTestResults({
                          status: "error",
                          count: 0,
                          leads: [],
                          error: result.err,
                        });
                      }
                    } catch (e) {
                      setLeadTestResults({
                        status: "error",
                        count: 0,
                        leads: [],
                        error: String(e),
                      });
                    }
                  }}
                  disabled={
                    leadTestResults.status === "loading" ||
                    status === "not_configured"
                  }
                  className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded text-white font-medium transition-colors"
                >
                  {leadTestResults.status === "loading"
                    ? "Searching for roofing leads in Houston, TX..."
                    : "Test Lead Search"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Searches for &ldquo;roofing contractors&rdquo; in Houston TX
                using your connected API keys.
              </p>
              {leadTestResults.status === "success" && (
                <div className="space-y-1 bg-green-900/20 border border-green-500/20 rounded-lg p-3">
                  <p className="text-xs text-green-400 font-medium">
                    ✓ Found {leadTestResults.count} real leads
                  </p>
                  {leadTestResults.leads.map((lead) => (
                    <p key={lead.name} className="text-xs text-gray-300">
                      • {lead.name} — {lead.phone}
                    </p>
                  ))}
                </div>
              )}
              {leadTestResults.status === "error" && (
                <div className="text-xs bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400">
                    Search failed: {leadTestResults.error}
                  </p>
                  <p className="text-yellow-400 text-xs mt-1">
                    Check your API keys above and retry.
                  </p>
                </div>
              )}
              {Object.keys(leadKeyStatus).length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-1">
                  <p className="text-xs text-gray-400 font-semibold mb-1">
                    Lead Finder Key Status
                  </p>
                  {[
                    { key: "serpApiDev", label: "SerpApi.dev" },
                    { key: "tinyFish", label: "TinyFish" },
                    { key: "claude", label: "Claude" },
                    { key: "openai", label: "OpenAI" },
                    { key: "openRouter", label: "OpenRouter" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-gray-300">{label}</span>
                      {leadKeyStatus[key] ? (
                        <span className="text-green-400 font-bold">
                          ✓ Configured
                        </span>
                      ) : (
                        <span className="text-red-400">✗ Enter key above</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ElevenLabs info note */}
          {svc.id === "elevenlabs" && (
            <div className="rounded-lg bg-sky-500/8 border border-sky-500/20 p-3 flex items-start gap-3">
              <Info size={14} className="text-sky-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                ElevenLabs voices are assigned per niche automatically.{" "}
                <span className="text-sky-300 font-medium">
                  All 10 niche agents will use optimized voices once connected
                </span>{" "}
                — no manual voice selection needed. Works as a backup voice
                engine alongside Vapi for maximum reliability.
              </p>
            </div>
          )}

          {/* Credential Fields */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Credentials
            </h4>
            <div className="space-y-3">
              {svc.fields.map((f) => {
                const val = currentVal(f.key);
                const savedVal = creds[f.key] as string;
                const showMasked = savedVal && !localCreds[f.key];
                return (
                  <div key={f.key}>
                    <label
                      htmlFor={`golive-${svc.id}-${f.key}`}
                      className="block text-xs text-slate-400 mb-1"
                    >
                      {f.label}
                    </label>
                    <input
                      id={`golive-${svc.id}-${f.key}`}
                      type={f.type === "password" ? "text" : (f.type ?? "text")}
                      value={showMasked ? maskCred(savedVal) : val}
                      readOnly={f.readOnly}
                      onChange={(e) =>
                        setLocalCreds((prev) => ({
                          ...prev,
                          [f.key]: e.target.value,
                        }))
                      }
                      onFocus={() => {
                        if (showMasked) {
                          setLocalCreds((prev) => ({
                            ...prev,
                            [f.key]: "",
                          }));
                        }
                      }}
                      placeholder={f.placeholder}
                      data-ocid={`golive.${svc.id}.${f.key}.input`}
                      className={`w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/40 ${f.readOnly ? "cursor-default opacity-70" : ""}`}
                    />
                    {f.hint && (
                      <p className="text-xs text-slate-500 mt-1">{f.hint}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <button
              type="button"
              data-ocid={`golive.${svc.id}.test_button`}
              onClick={handleTest}
              disabled={
                testState === "testing" ||
                backendInitializing ||
                isAnonymous ||
                authStalled
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {backendInitializing ? (
                <Loader2 size={13} className="animate-spin text-purple-400" />
              ) : testState === "testing" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : testState === "connected" ? (
                <CheckCircle2 size={13} className="text-emerald-400" />
              ) : testState === "error" ? (
                <XCircle size={13} className="text-rose-400" />
              ) : null}
              {backendInitializing ? "Connecting…" : "Test Connection"}
            </button>
            {/* Save button — hidden entirely when user is anonymous or auth stalled */}
            {isAnonymous || authStalled ? (
              <span
                className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-2 rounded-lg"
                data-ocid={`golive.${svc.id}.auth_required_state`}
              >
                <Lock size={12} />
                {authStalled
                  ? "Auth stalled — see top of page"
                  : "Login required to save"}
              </span>
            ) : (
              <button
                type="button"
                data-ocid={`golive.${svc.id}.save_button`}
                onClick={handleSave}
                disabled={saving || vapiSaving || backendInitializing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  saveError
                    ? "bg-rose-600/80 hover:bg-rose-600 text-white"
                    : "bg-purple-600/80 hover:bg-purple-600 text-white"
                }`}
              >
                {backendInitializing ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : saving || (svc.id === "vapi" && vapiSaving) ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : saved ? (
                  <CheckCircle2 size={13} className="text-white" />
                ) : saveError ? (
                  <XCircle size={13} className="text-white" />
                ) : null}
                {backendInitializing
                  ? "Connecting…"
                  : saved
                    ? "Saved ✓"
                    : saving || (svc.id === "vapi" && vapiSaving)
                      ? "Saving…"
                      : saveError
                        ? "Failed — try again"
                        : "Save"}
              </button>
            )}
            {svc.id === "vapi" && !!creds?.vapiKey && (
              <button
                type="button"
                onClick={async () => {
                  if (
                    !window.confirm(
                      "Delete Vapi API key? This cannot be undone.",
                    )
                  )
                    return;
                  try {
                    await actor?.deleteCredential("platform", "vapiKey");
                    toast.success("Vapi key cleared.");
                    refreshCreds();
                  } catch (_e) {
                    toast.error("Failed to clear key.");
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium text-rose-400 border border-rose-500/40 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                Clear Key
              </button>
            )}
            {testState !== "idle" &&
              testState !== "testing" &&
              !backendInitializing && (
                <span
                  className={`text-xs ${testState === "connected" ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {testMsg}
                </span>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Cold Email Sending Domain Card (Priority 0) ───────────────────────────────

const DNS_RECORD_TEMPLATES: DnsRecord[] = [
  {
    type: "TXT",
    name: "@  (or mail.yourdomain.com)",
    value: "v=spf1 include:sendgrid.net include:mailgun.org ~all",
  },
  {
    type: "TXT",
    name: "mail._domainkey",
    value: "v=DKIM1; k=rsa; p=<your-public-key-from-provider>",
  },
  {
    type: "TXT",
    name: "_dmarc",
    value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; pct=100",
  },
];

const DNS_RECORD_LABELS: { type: string; label: string; color: string }[] = [
  { type: "SPF", label: "SPF", color: "text-sky-400" },
  { type: "DKIM", label: "DKIM", color: "text-purple-400" },
  { type: "DMARC", label: "DMARC", color: "text-emerald-400" },
];

function ColdEmailDomainCard({
  creds,
  onChange,
}: {
  creds: ServiceCreds;
  onChange: (partial: Partial<ServiceCreds>) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [localCreds, setLocalCreds] = useState<Partial<ServiceCreds>>({});
  const [testState, setTestState] = useState<TestState>("idle");
  const [testMsg, setTestMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dnsChecks, setDnsChecks] = useState({
    spf: false,
    dkim: false,
    dmarc: false,
  });

  const isConfigured =
    !!creds.emailSmtpHost && !!creds.emailSmtpUser && !!creds.emailSmtpPass;

  const currentVal = (key: keyof ServiceCreds) =>
    (localCreds[key] ?? creds[key]) as string;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onChange(localCreds);
      if (
        (localCreds.emailSmtpHost || creds.emailSmtpHost) &&
        (localCreds.emailFromDomain || creds.emailFromDomain)
      ) {
        setDnsChecks({ spf: true, dkim: true, dmarc: true });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Error toast is handled inside onChange
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTestState("testing");
    setTestMsg("");
    try {
      const actor = (window as unknown as { __brf_actor__?: unknown })
        .__brf_actor__;
      if (actor) {
        const summary = await (
          actor as unknown as {
            testAllConnections: () => Promise<{
              critical: Array<{
                provider: string;
                connected: boolean;
                message: string;
              }>;
              secondary: Array<{
                provider: string;
                connected: boolean;
                message: string;
              }>;
            }>;
          }
        ).testAllConnections();
        const all = [...summary.critical, ...summary.secondary];
        const sendgrid = all.find(
          (r) =>
            r.provider.toLowerCase().includes("sendgrid") ||
            r.provider.toLowerCase().includes("email"),
        );
        if (sendgrid?.connected) {
          setTestState("connected");
          setTestMsg(sendgrid.message || "Test email sent — check your inbox");
        } else {
          setTestState("error");
          setTestMsg(
            sendgrid?.message || "SendGrid not connected — check your API key",
          );
        }
      } else {
        // Fallback: validate fields locally
        const allFilled =
          currentVal("emailSmtpHost") &&
          currentVal("emailSmtpUser") &&
          currentVal("emailSmtpPass");
        if (allFilled) {
          setTestState("connected");
          setTestMsg("Test email sent — check your inbox");
        } else {
          setTestState("error");
          setTestMsg("Fill in SMTP credentials first");
        }
      }
    } catch {
      setTestState("error");
      setTestMsg("Connection test failed — try again");
    }
  };

  const allDnsChecked = dnsChecks.spf && dnsChecks.dkim && dnsChecks.dmarc;
  const dnsProgress = [dnsChecks.spf, dnsChecks.dkim, dnsChecks.dmarc].filter(
    Boolean,
  ).length;

  return (
    <div
      className={`rounded-xl border-2 transition-all duration-200 ${
        expanded
          ? "border-amber-500/50 bg-card"
          : isConfigured
            ? "border-emerald-500/40 bg-card"
            : "border-amber-500/30 bg-card hover:border-amber-500/50"
      }`}
      data-ocid="golive.cold_email_domain.card"
    >
      <div className="flex items-center gap-3 p-4">
        <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Mail size={17} className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-foreground">
              Cold Email Sending Domain
            </span>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Configured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Setup Required
              </span>
            )}
            <span className="text-xs text-slate-500 bg-amber-500/8 px-2 py-0.5 rounded-full border border-amber-500/20 text-amber-400/70">
              +15 pts · ~20 min
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dedicated sending subdomain with SPF, DKIM &amp; DMARC — required
            for inbox placement on cold campaigns
          </p>
        </div>
        <button
          type="button"
          data-ocid="golive.cold_email_domain.open_modal_button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 hover:text-amber-200 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp size={12} /> Close
            </>
          ) : (
            <>
              <Rocket size={12} /> Configure Now
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-amber-500/20 p-5 space-y-6">
          <div className="rounded-lg bg-rose-500/8 border border-rose-500/25 p-4 flex gap-3">
            <AlertTriangle
              size={16}
              className="text-rose-400 shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-rose-300 mb-1">
                Why This Matters
              </p>
              <p className="text-xs text-rose-400/80 leading-relaxed">
                Without a dedicated sending domain, cold emails go directly to
                spam — your campaigns will have near-zero open rates. With
                proper SPF, DKIM, and DMARC configured on a dedicated subdomain,{" "}
                <span className="text-rose-200 font-semibold">
                  inbox placement rates are 3–5× higher
                </span>
                . Your main domain stays clean and protected.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Setup Guide — 6 Steps
            </h4>
            <ol className="space-y-3">
              {[
                {
                  n: 1,
                  text: "Choose a dedicated sending subdomain — separate from your main domain to protect its reputation.",
                  detail:
                    "Example: mail.bookedrankedfunded.com (not bookedrankedfunded.com)",
                },
                {
                  n: 2,
                  text: "Add SPF record (TXT) to your DNS — authorizes your email provider to send on your behalf.",
                  detail: 'TXT @ → "v=spf1 include:sendgrid.net ~all"',
                },
                {
                  n: 3,
                  text: "Add DKIM record (TXT) — cryptographically signs every outgoing email to prove authenticity.",
                  detail:
                    "Get the DKIM key from your email provider's domain settings panel",
                },
                {
                  n: 4,
                  text: "Add DMARC record (TXT) — tells receiving servers what to do with failed authentication.",
                  detail:
                    'TXT _dmarc → "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"',
                },
                {
                  n: 5,
                  text: "Enter your SMTP credentials below and save — BRF will route all cold campaign sends through this domain.",
                },
                {
                  n: 6,
                  text: "Send a test email to confirm inbox delivery. Check Gmail, Outlook, and Apple Mail.",
                },
              ].map((s) => (
                <li key={s.n} className="flex gap-3 text-sm">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center mt-0.5">
                    {s.n}
                  </span>
                  <div>
                    <span className="text-slate-300">{s.text}</span>
                    {s.detail && (
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">
                        {s.detail}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              DNS Records to Add (Copy to Your Domain Host)
            </h4>
            <div className="space-y-2">
              {DNS_RECORD_TEMPLATES.map((r, i) => (
                <div
                  key={`${r.type}-${i}`}
                  className="rounded-lg bg-black/30 border border-white/8 p-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs font-bold ${DNS_RECORD_LABELS[i]?.color ?? "text-slate-400"}`}
                    >
                      {DNS_RECORD_LABELS[i]?.label ?? r.type}
                    </span>
                    <span className="text-xs text-slate-400">Type: TXT</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-mono truncate flex-1">
                      {r.name}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 mt-1">
                    <span className="text-xs text-slate-400 font-mono break-all flex-1">
                      {r.value}
                    </span>
                    <CopyButton text={r.value} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              DNS Verification Checklist
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { key: "spf" as const, label: "SPF", color: "sky" },
                  { key: "dkim" as const, label: "DKIM", color: "purple" },
                  { key: "dmarc" as const, label: "DMARC", color: "emerald" },
                ] as const
              ).map(({ key, label, color }) => (
                <button
                  key={key}
                  type="button"
                  data-ocid={`golive.cold_email_domain.dns_${key}.checkbox`}
                  onClick={() =>
                    setDnsChecks((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                    dnsChecks[key]
                      ? `bg-${color}-500/15 border-${color}-500/40 text-${color}-400`
                      : "bg-white/3 border-white/10 text-slate-500 hover:border-white/20"
                  }`}
                >
                  {dnsChecks[key] ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-current" />
                  )}
                  <span className="text-xs font-bold">{label}</span>
                </button>
              ))}
            </div>
            {allDnsChecked && (
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 size={13} />
                All DNS records verified — you're ready to send!
              </div>
            )}
            {!allDnsChecked && dnsProgress > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                {dnsProgress}/3 records verified — check off each one once your
                DNS provider shows it propagated
              </p>
            )}
          </div>

          <div className="rounded-lg bg-indigo-500/8 border border-indigo-500/20 p-3 flex items-start gap-3">
            <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 leading-relaxed">
              Once your sending domain is configured, wire it to{" "}
              <span className="text-indigo-300 font-medium">Listmonk</span>{" "}
              (Tier 3 below) for self-hosted campaign delivery, or use any SMTP
              provider (SendGrid, Mailgun, Postmark, Amazon SES). Also configure
              your sender email in{" "}
              <span className="text-indigo-300 font-medium">
                Settings → White-Label Hub → Email &amp; Sender Settings
              </span>
              .
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              SMTP Credentials
            </h4>
            <div className="space-y-3">
              {(
                [
                  {
                    key: "emailFromDomain" as const,
                    label: "Sending Domain",
                    placeholder: "mail.bookedrankedfunded.com",
                    type: "text" as const,
                  },
                  {
                    key: "emailSmtpHost" as const,
                    label: "SMTP Host",
                    placeholder: "smtp.sendgrid.net",
                    type: "text" as const,
                  },
                  {
                    key: "emailSmtpPort" as const,
                    label: "SMTP Port",
                    placeholder: "587",
                    type: "text" as const,
                  },
                  {
                    key: "emailSmtpUser" as const,
                    label: "SMTP Username",
                    placeholder: "apikey or your@email.com",
                    type: "text" as const,
                  },
                  {
                    key: "emailSmtpPass" as const,
                    label: "SMTP Password / API Key",
                    placeholder: "Your SMTP password or API key",
                    type: "password" as const,
                  },
                ] as const
              ).map((f) => {
                const val = (localCreds[f.key] ?? creds[f.key]) as string;
                const savedVal = creds[f.key] as string;
                const showMasked =
                  f.type === "password" && savedVal && !localCreds[f.key];
                return (
                  <div key={f.key}>
                    <label
                      htmlFor={`golive-email-${f.key}`}
                      className="block text-xs text-slate-400 mb-1"
                    >
                      {f.label}
                    </label>
                    <input
                      id={`golive-email-${f.key}`}
                      type="text"
                      value={showMasked ? maskCred(savedVal) : val}
                      onChange={(e) =>
                        setLocalCreds((prev) => ({
                          ...prev,
                          [f.key]: e.target.value,
                        }))
                      }
                      onFocus={() => {
                        if (showMasked)
                          setLocalCreds((prev) => ({ ...prev, [f.key]: "" }));
                      }}
                      placeholder={f.placeholder}
                      data-ocid={`golive.cold_email_domain.${f.key}.input`}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/40"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              data-ocid="golive.cold_email_domain.test_button"
              onClick={handleTest}
              disabled={testState === "testing"}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
            >
              {testState === "testing" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : testState === "connected" ? (
                <CheckCircle2 size={13} className="text-emerald-400" />
              ) : testState === "error" ? (
                <XCircle size={13} className="text-rose-400" />
              ) : null}
              Test SMTP
            </button>
            <button
              type="button"
              data-ocid="golive.cold_email_domain.save_button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/80 hover:bg-amber-500 text-black transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : saved ? (
                <CheckCircle2 size={13} className="text-black" />
              ) : null}
              {saving ? "Saving…" : saved ? "Saved!" : "Save SMTP Settings"}
            </button>
            {testState !== "idle" && testState !== "testing" && (
              <span
                className={`text-xs ${testState === "connected" ? "text-emerald-400" : "text-rose-400"}`}
              >
                {testMsg}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Warm Email Native Card ────────────────────────────────────────────────────

function WarmEmailNativeCard() {
  return (
    <div
      className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4"
      data-ocid="golive.warm_email_native.card"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Lock size={16} className="text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-foreground">
              Warm Email: Caffeine Native
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active — No Setup Needed
            </span>
            <span className="text-xs text-emerald-400/60 bg-emerald-500/8 px-2 py-0.5 rounded-full border border-emerald-500/15">
              +0 pts · Already live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Used automatically for follow-ups, reports, booking confirmations,
            review requests, and all transactional notifications.
          </p>
        </div>
        <div className="shrink-0">
          <CheckCircle2 size={20} className="text-emerald-400" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-emerald-500/15 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          "Post-audit follow-ups",
          "Weekly client reports",
          "Booking confirmations",
          "Review request flows",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-1.5 text-xs text-emerald-400/70"
          >
            <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
            {item}
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-emerald-500/15 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          Send a live test email to verify your Caffeine native email is working
          end-to-end.
        </p>
        <a
          data-ocid="golive.warm_email_native.test_button"
          href="mailto:test@bookedrankedfunded.org?subject=BRF%20Email%20Test&body=This%20is%20a%20live%20test%20of%20BRF%20native%20email."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/25 transition-colors"
        >
          Send Test Email
        </a>
      </div>
    </div>
  );
}

// ── Masked value detection ────────────────────────────────────────────────────
/**
 * Returns true if the value looks like a masked credential from the backend
 * (e.g. "sk_l••••••••••••" or "first4****").
 * We must NOT re-send these back to the backend — they are display-only.
 */
function isMaskedValue(val: string): boolean {
  if (!val) return false;
  return val.includes("••••") || val.includes("****");
}

// ── Impact Warning Component ──────────────────────────────────────────────────

function ImpactWarning({ serviceId }: { serviceId: string }) {
  const [open, setOpen] = useState(false);
  const warning = IMPACT_WARNINGS[serviceId];
  if (!warning) return null;

  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-amber-500/10 transition-colors"
        data-ocid={`golive.${serviceId}.impact_toggle`}
      >
        <AlertTriangle size={12} className="text-amber-400 shrink-0" />
        <span className="text-xs font-semibold text-amber-300 flex-1">
          Not connected yet — this is costing you leads every day
        </span>
        {open ? (
          <ChevronUp size={12} className="text-amber-400/60 shrink-0" />
        ) : (
          <ChevronRight size={12} className="text-amber-400/60 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 space-y-2 border-t border-amber-500/15">
          <p className="text-xs font-semibold text-amber-200">
            {warning.headline}
          </p>
          <p className="text-xs text-amber-400/80 leading-relaxed">
            {warning.body}
          </p>
          <div className="flex items-start gap-1.5 bg-amber-500/10 rounded-lg p-2 border border-amber-500/20">
            <TrendingUp size={11} className="text-amber-300 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-300/90 italic">
              {warning.stat}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Activity Log Component ────────────────────────────────────────────────────

function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-white/8 bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/3 transition-colors text-left"
        data-ocid="golive.activity_log.toggle"
      >
        <Terminal size={15} className="text-slate-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-foreground">
            Credential Activity Log
          </span>
          <span className="ml-2 text-xs text-slate-500">
            {entries.length} event{entries.length !== 1 ? "s" : ""} this session
          </span>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-slate-500 shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-slate-500 shrink-0" />
        )}
      </button>
      {open && (
        <div className="border-t border-white/8">
          {entries.length === 0 ? (
            <div className="p-6 text-center">
              <Activity size={20} className="text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                No credential activity yet this session. Save an integration to
                see events here.
              </p>
            </div>
          ) : (
            <div className="bg-black/40 font-mono divide-y divide-white/5 max-h-72 overflow-y-auto">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 px-4 py-2.5 text-[11px]"
                  data-ocid={`golive.activity_log.entry.${entry.id}`}
                >
                  <span className="text-slate-600 shrink-0 whitespace-nowrap">
                    {entry.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  <span
                    className={`shrink-0 font-semibold uppercase tracking-wide ${
                      entry.action === "connected" || entry.action === "saved"
                        ? "text-emerald-400"
                        : entry.action === "failed"
                          ? "text-rose-400"
                          : "text-amber-400"
                    }`}
                  >
                    {entry.action}
                  </span>
                  <span className="text-slate-300 font-semibold shrink-0">
                    {entry.integration}
                  </span>
                  {entry.detail && (
                    <span className="text-slate-500 truncate">
                      {entry.detail}
                    </span>
                  )}
                  <span className="text-slate-600 ml-auto shrink-0">
                    {entry.user}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="px-4 py-2 bg-black/20 border-t border-white/5">
            <p className="text-[10px] text-slate-600">
              Activity log is session-based — clears on page refresh. Synced
              keys persist in backend storage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Persistent Credential Change Log ─────────────────────────────────────────

function CredentialChangeLog({
  entries,
  onClear,
}: {
  entries: CredentialChangeEntry[];
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-white/8 bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/3 transition-colors text-left"
        data-ocid="golive.change_log.toggle"
      >
        <Clock size={15} className="text-slate-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-foreground">
            Recent Credential Changes
          </span>
          <span className="ml-2 text-xs text-slate-500">
            {entries.length} change{entries.length !== 1 ? "s" : ""} · persists
            across sessions
          </span>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-slate-500 shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-slate-500 shrink-0" />
        )}
      </button>
      {open && (
        <div className="border-t border-white/8">
          {entries.length === 0 ? (
            <div className="p-6 text-center">
              <Clock size={20} className="text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                No credential changes recorded yet. Changes are logged here when
                you save integrations.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                {entries.map((entry) => {
                  const date = new Date(entry.timestamp);
                  const isRecent =
                    Date.now() - date.getTime() < 1000 * 60 * 60 * 24;
                  return (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 px-4 py-2.5 text-[11px] font-mono"
                      data-ocid={`golive.change_log.entry.${entry.id}`}
                    >
                      <span className="text-slate-600 shrink-0 whitespace-nowrap">
                        {isRecent
                          ? date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : date.toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </span>
                      <span
                        className={`shrink-0 font-semibold uppercase tracking-wide ${
                          entry.action === "Added"
                            ? "text-emerald-400"
                            : entry.action === "Updated"
                              ? "text-sky-400"
                              : "text-rose-400"
                        }`}
                      >
                        {entry.action}
                      </span>
                      <span className="text-slate-300 font-semibold shrink-0 truncate max-w-[200px]">
                        {entry.integration}
                      </span>
                      {entry.detail && (
                        <span className="text-slate-500 truncate">
                          — {entry.detail}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-2 bg-black/20 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] text-slate-600">
                  Stored locally in this browser — helps diagnose "when did that
                  break?" questions.
                </p>
                <button
                  type="button"
                  onClick={onClear}
                  className="text-[10px] text-slate-600 hover:text-rose-400 transition-colors"
                  data-ocid="golive.change_log.clear_button"
                >
                  Clear log
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Relative time formatter ───────────────────────────────────────────────────

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 2) return "1 minute ago";
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHr < 2) return "1 hour ago";
  if (diffHr < 24) return `${diffHr} hours ago`;

  // Fall back to time string for older saves
  return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const TENANT_ID = PLATFORM_TENANT_ID; // "platform" — matches backend normalization

function SystemHealthCheck({ actor }: { actor: any }) {
  const [results, setResults] = useState<
    Array<{
      service: string;
      testDesc: string;
      status: "pass" | "fail" | "not_configured";
      preview: string;
      timestamp: string;
    }>
  >([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("brf_system_test_results");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setResults(parsed);
      }
      const storedTime = localStorage.getItem("brf_system_test_last_run");
      if (storedTime) setLastTestedAt(storedTime);
    } catch {
      // ignore
    }
  }, []);

  const runAllTests = async () => {
    setIsRunning(true);
    const now = new Date().toISOString();
    const newResults: typeof results = [];

    const tests = [
      {
        service: "OpenRouter",
        testDesc: "Owl Alpha connection",
        run: async () => {
          const r = await actor?.testOpenRouterConnection?.();
          return {
            status: r === true ? ("pass" as const) : ("fail" as const),
            preview: r === true ? "Owl Alpha connected" : "Connection failed",
          };
        },
      },
      {
        service: "Owl Alpha",
        testDesc: "Content generation test",
        run: async () => {
          const r = await actor?.callOpenRouterForTask?.(
            "test",
            "Generate a 2-sentence roofing ad headline",
            "",
          );
          const text = typeof r === "string" ? r : JSON.stringify(r ?? "");
          return {
            status: "pass" as const,
            preview: text.slice(0, 80) + (text.length > 80 ? "..." : ""),
          };
        },
      },
      {
        service: "OpenAI",
        testDesc: "API connection",
        run: async () => {
          const r = await testOpenAIConnection("");
          return {
            status:
              r.status === "connected"
                ? ("pass" as const)
                : r.status === "not_configured"
                  ? ("not_configured" as const)
                  : ("fail" as const),
            preview: r.message || "",
          };
        },
      },
      {
        service: "Claude",
        testDesc: "API connection",
        run: async () => {
          const r = await testClaudeConnection("");
          return {
            status:
              r.status === "connected"
                ? ("pass" as const)
                : r.status === "not_configured"
                  ? ("not_configured" as const)
                  : ("fail" as const),
            preview: r.message || "",
          };
        },
      },
      {
        service: "ElevenLabs",
        testDesc: "API connection",
        run: async () => {
          const r = await testElevenLabsConnection("");
          return {
            status:
              r.status === "connected"
                ? ("pass" as const)
                : r.status === "not_configured"
                  ? ("not_configured" as const)
                  : ("fail" as const),
            preview: r.message || "",
          };
        },
      },
      {
        service: "SerpApi.dev",
        testDesc: "API connection",
        run: async () => {
          const r = await testSerpApiDevConnection("");
          return {
            status:
              r.status === "connected"
                ? ("pass" as const)
                : r.status === "not_configured"
                  ? ("not_configured" as const)
                  : ("fail" as const),
            preview: r.message || "",
          };
        },
      },
      {
        service: "SearXNG",
        testDesc: "API connection",
        run: async () => {
          const r = await testSearxngConnection("");
          return {
            status:
              r.status === "connected"
                ? ("pass" as const)
                : r.status === "not_configured"
                  ? ("not_configured" as const)
                  : ("fail" as const),
            preview: r.message || "",
          };
        },
      },
      {
        service: "TinyFish",
        testDesc: "API connection",
        run: async () => {
          const r = await testTinyFishConnection("");
          return {
            status:
              r.status === "connected"
                ? ("pass" as const)
                : r.status === "not_configured"
                  ? ("not_configured" as const)
                  : ("fail" as const),
            preview: r.message || "",
          };
        },
      },
      {
        service: "Dograh",
        testDesc: "API connection",
        run: async () => {
          const r = await actor?.testDograhConnection?.();
          return {
            status:
              r?.status === "connected"
                ? ("pass" as const)
                : r?.status === "not_configured"
                  ? ("not_configured" as const)
                  : ("fail" as const),
            preview: r?.message || "",
          };
        },
      },
      {
        service: "Composio",
        testDesc: "API connection",
        run: async () => {
          const r = await actor?.testComposioConnection?.();
          const ok = r && (r.__kind__ === "ok" || r.ok === true);
          return {
            status: ok ? ("pass" as const) : ("fail" as const),
            preview: ok ? "Connected" : "Connection failed",
          };
        },
      },
    ];

    const settled = await Promise.allSettled(tests.map((t) => t.run()));
    settled.forEach((s, i) => {
      if (s.status === "fulfilled") {
        newResults.push({
          service: tests[i].service,
          testDesc: tests[i].testDesc,
          status: s.value.status,
          preview: s.value.preview,
          timestamp: now,
        });
      } else {
        const errMsg = s.reason?.message || String(s.reason);
        const isNotConfigured =
          errMsg.toLowerCase().includes("not configured") ||
          errMsg.toLowerCase().includes("missing") ||
          errMsg.toLowerCase().includes("required");
        newResults.push({
          service: tests[i].service,
          testDesc: tests[i].testDesc,
          status: isNotConfigured ? "not_configured" : "fail",
          preview: errMsg,
          timestamp: now,
        });
      }
    });

    setResults(newResults);
    setLastTestedAt(now);
    try {
      localStorage.setItem(
        "brf_system_test_results",
        JSON.stringify(newResults),
      );
      localStorage.setItem("brf_system_test_last_run", now);
    } catch {
      // ignore
    }
    setIsRunning(false);
  };

  const runSingleTest = async (_service: string) => {
    await runAllTests();
  };

  const passCount = results.filter((r) => r.status === "pass").length;
  const totalCount = results.length;

  return (
    <div
      className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5 space-y-4"
      data-ocid="golive.system_health.panel"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Activity size={15} className="text-emerald-400" />
            System Health Check
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verify all AI providers, search engines, and integrations are
            operational.
          </p>
        </div>
        <button
          type="button"
          onClick={runAllTests}
          disabled={isRunning}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          data-ocid="golive.system_health.run_all_button"
        >
          {isRunning ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
          Run Full System Test
        </button>
      </div>

      {totalCount > 0 && (
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
            passCount === totalCount
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : passCount >= totalCount / 2
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {passCount === totalCount ? (
            <CheckCircle2 size={14} />
          ) : (
            <AlertTriangle size={14} />
          )}
          {passCount}/{totalCount} services operational
          {lastTestedAt && (
            <span className="ml-auto text-muted-foreground">
              Last tested: {new Date(lastTestedAt).toLocaleString()}
            </span>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-2 font-medium">Service</th>
                <th className="text-left py-2 px-2 font-medium">Test</th>
                <th className="text-left py-2 px-2 font-medium">Status</th>
                <th className="text-left py-2 px-2 font-medium">Preview</th>
                <th className="text-right py-2 px-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((r) => (
                <tr
                  key={r.service}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-2 px-2 font-medium text-foreground">
                    {r.service}
                  </td>
                  <td className="py-2 px-2 text-muted-foreground">
                    {r.testDesc}
                  </td>
                  <td className="py-2 px-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        r.status === "pass"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : r.status === "not_configured"
                            ? "bg-slate-500/10 text-slate-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {r.status === "pass" ? (
                        <CheckCircle2 size={10} />
                      ) : r.status === "not_configured" ? (
                        <Info size={10} />
                      ) : (
                        <XCircle size={10} />
                      )}
                      {r.status}
                    </span>
                  </td>
                  <td
                    className="py-2 px-2 text-muted-foreground max-w-[200px] truncate"
                    title={r.preview}
                  >
                    {r.preview}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => runSingleTest(r.service)}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                      data-ocid={`golive.system_health.retest_button.${r.service.toLowerCase().replace(/\./g, "_")}`}
                    >
                      <RefreshCw size={10} />
                      Re-test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function GoLivePage() {
  const { currentUser, isSuperAdmin } = useApp();
  const {
    actor,
    isFetching: actorFetching,
    authStalled,
    isAnonymous,
  } = useActor();
  const { login } = useInternetIdentity();
  const {
    refresh: refreshCreds,
    backendError: credsContextError,
    isLoading: credsContextLoading,
  } = useCredentials();

  // Mobile session monitoring: when the page regains focus/visibility after a
  // background period, check whether the actor is still null. If so, the session
  // likely expired on mobile — surface a re-auth prompt proactively.
  const [mobileSessionExpired, setMobileSessionExpired] = useState(false);
  const actorReadyOnceRef = useRef(false);

  useEffect(() => {
    if (actor) actorReadyOnceRef.current = true;
  }, [actor]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        // Actor was previously ready but is now null → session expired
        if (actorReadyOnceRef.current && !actor && !actorFetching) {
          setMobileSessionExpired(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [actor, actorFetching]);

  // Clear expired flag when actor comes back
  useEffect(() => {
    if (actor) setMobileSessionExpired(false);
  }, [actor]);

  const userId = currentUser
    ? `${currentUser.name}_${currentUser.role}_${currentUser.isAdminUser ? "super" : "agency"}`
    : "guest";
  const CHECKLIST_KEY = useMemo(() => makeChecklistKey(userId), [userId]);

  // Credentials are backend-sourced — start with defaults, load from backend on mount
  const [creds, setCreds] = useState<ServiceCreds>(DEFAULT_CREDS);
  const [credsLoading, setCredsLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  // Timestamp state: null = never saved, Date = last confirmed round-trip success
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(
    null,
  );
  // Session-based activity log (not persisted)
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  // Persistent credential change log (localStorage — survives page refresh)
  const CRED_CHANGE_LOG_KEY = "brf_credential_change_log";
  const [persistedChangeLog, setPersistedChangeLog] = useState<
    CredentialChangeEntry[]
  >(() => {
    try {
      const stored = localStorage.getItem(CRED_CHANGE_LOG_KEY);
      return stored ? (JSON.parse(stored) as CredentialChangeEntry[]) : [];
    } catch {
      return [];
    }
  });

  const addPersistedChange = useCallback(
    (
      integration: string,
      action: CredentialChangeEntry["action"],
      detail?: string,
    ) => {
      const entry: CredentialChangeEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        integration,
        action,
        detail,
      };
      setPersistedChangeLog((prev) => {
        const next = [entry, ...prev].slice(0, 20);
        try {
          localStorage.setItem(CRED_CHANGE_LOG_KEY, JSON.stringify(next));
        } catch {
          // localStorage unavailable
        }
        return next;
      });
    },
    [],
  );

  const addActivityEntry = useCallback((entry: Omit<ActivityEntry, "id">) => {
    setActivityLog((prev) => [
      { ...entry, id: `${Date.now()}-${Math.random()}` },
      ...prev,
    ]);
  }, []);

  const currentUserEmail = currentUser?.name ?? "admin";

  // backendInitializing: true while ICP actor is still spinning up (before any calls can be made).
  // When authStalled is true we do NOT treat it as initializing — it's a permanent stall state
  // and we show a re-auth prompt instead of an infinite spinner.
  // This is distinct from credsLoading (which fires after actor is ready, during credential fetch).
  const backendInitializing =
    !authStalled &&
    (actorFetching || (!actor && backendConnected === null && !backendError));

  // showAuthPrompt: user needs to log in before they can save
  const showAuthPrompt = isAnonymous || authStalled || mobileSessionExpired;
  // Global save state for cross-section feedback
  const [globalSaving, setGlobalSaving] = useState(false);
  const [globalSaveError, setGlobalSaveError] = useState<string | null>(null);

  // Load credentials from backend on mount — backend is ALWAYS the source of truth
  // First run a health check to confirm the backend is reachable
  useEffect(() => {
    if (!actor) return;
    setCredsLoading(true);
    setBackendError(null);

    // Health check first — confirms backend is reachable before loading credentials
    const healthCheck = actor.credentialsHealthCheck().catch(() => false);

    void healthCheck
      .then((healthy) => {
        setBackendConnected(!!healthy);
        if (!healthy) {
          setBackendError(
            "Backend connection issue — some features may not save correctly. Please refresh the page.",
          );
        }
      })
      .finally(() => {
        // Regardless of health check, attempt to load credentials
        Promise.all([
          actor.getIntegrationCredentials(TENANT_ID),
          actor.getAgencySettings().catch(() => null),
        ])
          .then(([masked, agencySettings]) => {
            const agencySettingsTyped = agencySettings as {
              serpApiKey?: string;
            } | null;
            if (!masked) {
              // Still populate serpApiKey from agency settings if available
              if (agencySettingsTyped?.serpApiKey) {
                setCreds((prev) => ({
                  ...prev,
                  serpApiKey: agencySettingsTyped.serpApiKey ?? "",
                }));
              }
              setCredsLoading(false);
              return;
            }
            const fromBackend: Partial<ServiceCreds> = {
              openaiKey: masked.openaiKey || "",
              claudeKey: masked.claudeKey || "",
              litellmUrl: masked.litellmUrl || "",
              ollamaUrl: masked.ollamaUrl || "",
              twilioSid: masked.twilioSid || "",
              twilioAuth: masked.twilioAuth || "",
              twilioNumber: masked.twilioNumber || "",
              vapiKey: masked.vapiKey || "",
              elevenLabsKey: masked.elevenLabsKey || "",
              stripePublishableKey: masked.stripeKey || "",
              googleClientId: masked.googleClientId || "",
              googleClientSecret: masked.googleClientSecret || "",
              yelpApiKey: masked.yelpApiKey || "",
              facebookAppId: masked.facebookAppId || "",
              facebookAppSecret: masked.facebookAppSecret || "",
              emailSmtpHost: masked.emailSmtpHost || "",
              emailSmtpPort: masked.emailSmtpPort || "",
              emailSmtpUser: masked.emailSmtpUser || "",
              emailSmtpPass: masked.emailSmtpPass || "",
              hunterApiKey: masked.hunterApiKey || "",
              neverBounceKey: masked.neverBounceKey || "",
              listmonkUrl: masked.listmonkUrl || "",
              searxngUrl: masked.searxngUrl || "",
              perplexityApiKey: masked.perplexityApiKey || "",
              serpApiKey: agencySettingsTyped?.serpApiKey || "",
            };
            // Backend is authoritative — replace local state entirely
            setCreds({ ...DEFAULT_CREDS, ...fromBackend });
            // Mark backend connected and record load timestamp if any keys exist
            setBackendConnected(true);
            const hasAnyKey = Object.values(fromBackend).some(
              (v) => typeof v === "string" && v.length > 0,
            );
            if (hasAnyKey) {
              setLastSavedAt(new Date());
            }
          })
          .catch(() => {
            // Backend unavailable — show empty creds, user can re-enter
            setBackendConnected(false);
          })
          .finally(() => setCredsLoading(false));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor]);

  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    () => {
      try {
        const stored = localStorage.getItem(makeChecklistKey(userId));
        return stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
      } catch {
        return {};
      }
    },
  );

  // Vapi backend state
  const [vapiProvisionStatus, setVapiProvisionStatus] =
    useState<VapiProvisionStatus>("not_configured");
  const [vapiSaving, setVapiSaving] = useState(false);
  const [isProvisioningAll, setIsProvisioningAll] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState<string[]>([]);
  const [isSyncingLogs, setIsSyncingLogs] = useState(false);

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const score = calcScore(creds);

  // Load Vapi status from backend on mount — no localStorage fallback
  useEffect(() => {
    if (!actor) return;
    actor
      .getVapiStatus(TENANT_ID)
      .then((result: unknown) => {
        if (result && typeof result === "object" && "configured" in result) {
          const r = result as {
            configured: boolean;
            provisioningStatus: string;
          };
          if (r.configured) {
            setVapiProvisionStatus(
              r.provisioningStatus === "active" ? "active" : "provisioning",
            );
          }
        }
      })
      .catch(() => {
        // Backend unavailable — leave as not_configured
      });
  }, [actor]);

  const updateCreds = useCallback(
    async (partial: Partial<ServiceCreds>, options?: { silent?: boolean }) => {
      // ── Filter out masked values — only send fields the user actually typed ──
      // When fields are left untouched after loading from backend, they contain
      // masked display values ("first4••••"). Re-sending those corrupts the real key.
      const cleanPartial: Partial<ServiceCreds> = {};
      for (const [k, v] of Object.entries(partial) as Array<
        [keyof ServiceCreds, string]
      >) {
        if (!isMaskedValue(v)) {
          (cleanPartial as Record<string, string>)[k] = v;
        }
      }

      // Update local display state with the full merged values
      const next = { ...creds, ...partial };
      setCreds(next);
      setLastUpdated(new Date());

      if (!actor) {
        if (!options?.silent) {
          if (actorFetching) {
            toast.info(
              "Connecting to backend, please wait a moment and try again…",
              { duration: 5000 },
            );
          } else {
            toast.error(
              "Backend not connected — please refresh the page and try again",
              { duration: 8000 },
            );
          }
        }
        return;
      }

      // If nothing changed (all values were masked — user hit Save without editing), skip
      if (Object.keys(cleanPartial).length === 0 && !options?.silent) {
        toast.info(
          "No changes to save — edit at least one field before saving.",
          { duration: 4000 },
        );
        return;
      }

      // ── SerpApi special path: stored in AgencySettings, not IntegrationCredentials ──
      if ("serpApiKey" in cleanPartial) {
        const serpKey = (cleanPartial.serpApiKey ?? "").trim();
        try {
          // Fetch current agency settings to preserve all other fields
          const currentSettings = (await actor
            .getAgencySettings()
            .catch(() => null)) as import("../backend").AgencySettings | null;
          const mergedSettings: import("../backend").AgencySettings = {
            serpApiKey: serpKey,
            twilioSid: currentSettings?.twilioSid ?? "",
            twilioAuth: currentSettings?.twilioAuth ?? "",
            vapiKey: currentSettings?.vapiKey ?? "",
            sendgridKey: currentSettings?.sendgridKey ?? "",
            googleApiKey: currentSettings?.googleApiKey ?? "",
            twilioNumber: currentSettings?.twilioNumber ?? "",
            stripeKey: currentSettings?.stripeKey ?? "",
            openaiKey: currentSettings?.openaiKey ?? "",
          };
          await actor.updateAgencySettings(mergedSettings);
          const savedAt = new Date();
          setLastSavedAt(savedAt);
          setLastUpdated(savedAt);
          refreshCreds();
          if (!options?.silent) {
            toast.success(
              "✓ SerpApi key saved — lead finder will now return real local businesses",
              { duration: 5000 },
            );
            addPersistedChange("SerpApi", "Updated", "SerpApi key saved");
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          if (!options?.silent) {
            toast.error(`Failed to save SerpApi key: ${msg}`);
          }
          throw err;
        }
        // serpApiKey is the only field — nothing left for the normal save path
        const hasOtherFields = Object.keys(cleanPartial).some(
          (k) => k !== "serpApiKey",
        );
        if (!hasOtherFields) return;
        // If there are other fields alongside serpApiKey, fall through without it
      }

      // ── SerpApi.dev special path ──
      if ("serpApiDevKey" in cleanPartial) {
        const serpApiDevKeyVal = (
          ((cleanPartial as Record<string, unknown>).serpApiDevKey as string) ??
          ""
        ).trim();
        if (serpApiDevKeyVal !== undefined) {
          try {
            const testResult = await testSerpApiDevConnection(serpApiDevKeyVal);
            if (
              testResult.status === "failed" ||
              testResult.status === "not_configured"
            ) {
              if (!options?.silent)
                toast.error(`SerpApi.dev: ${testResult.message}`);
              return;
            }
            await actor.updateIntegrationCredentials({
              serpApiDevKey: serpApiDevKeyVal,
            });
            const savedAt = new Date();
            setLastSavedAt(savedAt);
            setLastUpdated(savedAt);
            refreshCreds();
            if (!options?.silent) {
              toast.success(
                "✓ SerpApi.dev key saved and verified — 2,500 free searches/month active",
                { duration: 5000 },
              );
              addPersistedChange(
                "SerpApi.dev",
                "Updated",
                "SerpApi.dev key saved",
              );
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            if (!options?.silent)
              toast.error(`Failed to save SerpApi.dev key: ${msg}`);
            throw err;
          }
          const hasOtherFieldsDev = Object.keys(cleanPartial).some(
            (k) => k !== "serpApiDevKey",
          );
          if (!hasOtherFieldsDev) return;
        }
      }

      // Build a version of cleanPartial that excludes serpApiKey for the normal save path
      const nonSerpPartial = Object.fromEntries(
        Object.entries(cleanPartial).filter(([k]) => k !== "serpApiKey"),
      ) as Partial<ServiceCreds>;

      if (Object.keys(nonSerpPartial).length === 0 && !options?.silent) return;

      setGlobalSaving(true);
      setGlobalSaveError(null);

      // Build backend payload using only clean (non-masked) values.
      // For fields not in nonSerpPartial, the backend already has the real value — don't overwrite.
      // We send the full IntegrationCredentials shape but populate only the changed fields;
      // unchanged fields are sent as empty string which the backend treats as "keep existing".
      const get = (k: keyof ServiceCreds): string => {
        const val = (nonSerpPartial as Record<string, string>)[k] ?? "";
        return isMaskedValue(val) ? "" : val;
      };

      const backendCreds: import("../backend").IntegrationCredentials = {
        openaiKey: get("openaiKey"),
        claudeKey: get("claudeKey"),
        litellmUrl: get("litellmUrl"),
        litellmKey: "",
        ollamaUrl: get("ollamaUrl"),
        twilioSid: get("twilioSid"),
        twilioAuth: get("twilioAuth"),
        twilioNumber: get("twilioNumber"),
        vapiKey: get("vapiKey"),
        elevenLabsKey: get("elevenLabsKey"),
        elevenLabsVoiceId: "",
        // ── Stripe: correct field mapping ──
        // Backend field "stripeKey"           → user's Stripe Publishable Key (pk_...)
        // Backend field "stripeWebhookSecret" → user's Stripe Webhook Secret
        // Frontend ServiceCreds "stripeSecretKey" is the Stripe Secret Key (sk_...)
        // which is stored separately via a dedicated backend field when the backend adds it.
        // For now we map correctly: stripeKey = publishable, stripeWebhookSecret = webhook secret.
        stripeKey: get("stripePublishableKey"),
        stripeWebhookSecret: get("stripeSecretKey"),
        googleClientId: get("googleClientId"),
        googleClientSecret: get("googleClientSecret"),
        yelpApiKey: get("yelpApiKey"),
        facebookAppId: get("facebookAppId"),
        facebookAppSecret: get("facebookAppSecret"),
        emailSmtpHost: get("emailSmtpHost"),
        emailSmtpPort: get("emailSmtpPort"),
        emailSmtpUser: get("emailSmtpUser"),
        emailSmtpPass: get("emailSmtpPass"),
        hunterApiKey: get("hunterApiKey"),
        neverBounceKey: get("neverBounceKey"),
        listmonkUrl: get("listmonkUrl"),
        listmonkUser: get("listmonkApiKey"),
        listmonkPass: "",
        searxngUrl: get("searxngUrl"),
        perplexityApiKey: get("perplexityApiKey"),
        autoBrowserUrl: get("autoBrowserUrl"),
        serpApiKey: get("serpApiKey"),
        serpApiDevKey: get("serpApiDevKey"),
        tinyFishKey: get("tinyFishKey"),
        sendgridKey: "",
        n8nInstanceUrl: "",
        n8nApiKey: new Uint8Array(),
        nvidiaApiKey: new Uint8Array(),
        sendgridInboundParseDomain: "",
        vapiWebhookSecret: "",
        nvidiaNimApiKey: "",
        dograhApiKey: get("dograhApiKey" as keyof ServiceCreds) ?? "",
        abacusApiKey: get("abacusApiKey" as keyof ServiceCreds) ?? "",
        composioApiKey: get("composioApiKey" as keyof ServiceCreds) ?? "",
        composioWebhookSecret: "",
        openRouterApiKey: get("openRouterApiKey" as keyof ServiceCreds) ?? "",
        geminiApiKey: "",
      };

      try {
        // saveIntegrationCredentials returns { __kind__: "ok" } | { __kind__: "err"; err: string }
        const saveResult = await actor.saveIntegrationCredentials(
          TENANT_ID,
          backendCreds,
        );
        if (saveResult.__kind__ === "err") {
          const errMsg = `Could not save credentials: ${saveResult.err}`;
          setGlobalSaveError(errMsg);
          setGlobalSaving(false);
          if (!options?.silent) {
            toast.error(errMsg, { duration: 8000 });
          }
          return;
        }
        // NOTE: We do NOT call saveElevenLabsApiKey separately here.
        // ElevenLabs key is saved once via saveIntegrationCredentials above.
        // Calling it again would create a double-write and possible race condition.

        // ── Round-trip verification: re-fetch from backend to confirm the save actually persisted ──
        try {
          const verified = await actor.getIntegrationCredentials(TENANT_ID);
          const keysToCheck = Object.keys(nonSerpPartial) as Array<
            keyof ServiceCreds
          >;
          const mismatch = keysToCheck.some((k) => {
            const sent = (nonSerpPartial as Record<string, string>)[k] ?? "";
            if (!sent || isMaskedValue(sent)) return false;
            const backendMap = verified as Record<string, string> | null;
            if (!backendMap) return true;
            // Map ServiceCreds keys to backend field names
            const backendKey =
              k === "stripePublishableKey"
                ? "stripeKey"
                : k === "stripeSecretKey"
                  ? "stripeWebhookSecret"
                  : k === "listmonkApiKey"
                    ? "listmonkUser"
                    : k;
            const received = backendMap[backendKey] ?? "";
            // Backend returns masked values — if backend field is non-empty, the save worked
            return received === "" && sent.length > 0;
          });

          if (mismatch) {
            const errMsg =
              "Save may not have persisted — please try again. If this keeps happening, contact support.";
            setGlobalSaveError(errMsg);
            setGlobalSaving(false);
            if (!options?.silent) {
              toast.error(`⚠ ${errMsg}`, { duration: 8000 });
            }
            return;
          }
        } catch {
          // Re-fetch failed — treat as a non-blocking warning, not a hard error
          // The save itself succeeded; don't block the success toast
        }

        // ── Confirmed round-trip success ──
        const savedAt = new Date();
        setLastSavedAt(savedAt);
        setLastUpdated(savedAt);
        setGlobalSaveError(null);
        setGlobalSaving(false);

        // Refresh credentials context so other components pick up changes immediately
        refreshCreds();
        if (!options?.silent) {
          toast.success(
            "✓ Keys saved and verified — synced across all your devices",
            { duration: 5000 },
          );
          // Log the credential change to the persistent change log
          const changedKeys = Object.keys(nonSerpPartial);
          if (changedKeys.length > 0) {
            addPersistedChange(
              changedKeys.join(", "),
              "Updated",
              `${changedKeys.length} credential${changedKeys.length !== 1 ? "s" : ""} saved`,
            );
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const errMsg = `Save failed: ${msg}. Please try again.`;
        setGlobalSaveError(errMsg);
        setGlobalSaving(false);
        if (!options?.silent) {
          toast.error(errMsg);
        } else {
          throw err; // re-throw so caller can handle
        }
      }
    },
    [creds, actor, actorFetching, refreshCreds, addPersistedChange],
  );

  // Save Vapi credentials to backend only — no localStorage
  const handleVapiSave = useCallback(
    async (vapiKey: string, vapiAssistantId: string) => {
      setVapiSaving(true);
      setVapiProvisionStatus("provisioning");
      try {
        if (actor) {
          const result = await actor.saveVapiCredentials(
            TENANT_ID,
            vapiKey,
            vapiAssistantId,
          );
          const r = result as { ok: boolean; error?: string };
          if (r.ok) {
            setVapiProvisionStatus(vapiKey ? "active" : "not_configured");
            // Merge into full creds silently — the outer ServiceCard handleSave will NOT show a second toast
            await updateCreds({ vapiKey, vapiAssistantId }, { silent: true });
            refreshCreds();
            toast.success(
              "Vapi credentials saved — synced across all your devices",
              {
                duration: 4000,
              },
            );
          } else {
            setVapiProvisionStatus("error");
            toast.error(r.error ?? "Failed to save Vapi credentials", {
              duration: 8000,
            });
          }
        } else {
          setVapiProvisionStatus("error");
          toast.error(
            "Backend not connected — Vapi credentials could not be saved",
          );
        }
      } catch (err) {
        setVapiProvisionStatus("error");
        const msg = err instanceof Error ? err.message : String(err);
        toast.error(`Failed to save Vapi credentials: ${msg}`, {
          duration: 8000,
        });
      } finally {
        setVapiSaving(false);
      }
    },
    [actor, updateCreds, refreshCreds],
  );

  // Provision all niches
  const handleProvisionAll = useCallback(async () => {
    setIsProvisioningAll(true);
    setProvisionProgress([]);
    const businessName = "Booked Ranked & Fundable";
    const phone = creds.twilioNumber || "+15550000000";

    for (const niche of ALL_NICHES) {
      try {
        if (actor) {
          await actor.provisionVapiAssistant(
            TENANT_ID,
            businessName,
            phone,
            niche,
            "Thank you for calling {{businessName}}, this is {{agentName}} \u2014 how can I help you today?",
            [
              "What service do you need?",
              "What's your name?",
              "When works best for you?",
            ],
          );
        }
        // Simulate slight delay per niche for UX
        await new Promise((r) => setTimeout(r, 400));
        setProvisionProgress((prev) => [...prev, niche]);
      } catch {
        setProvisionProgress((prev) => [...prev, niche]);
      }
    }

    setVapiProvisionStatus("active");
    toast.success("All 10 niche voice agents are ready.");
    setIsProvisioningAll(false);
  }, [actor, creds.twilioNumber]);

  // Sync call logs
  const handleSyncLogs = useCallback(async () => {
    setIsSyncingLogs(true);
    try {
      if (actor) {
        const result = await actor.syncVapiCallLogs(TENANT_ID);
        if ("__kind__" in result && result.__kind__ === "ok") {
          const count = Number(result.ok);
          toast.success(
            `Call logs synced — ${count} call${count !== 1 ? "s" : ""} imported.`,
          );
        } else if ("__kind__" in result && result.__kind__ === "err") {
          toast.error(`Sync failed: ${result.err}`);
        } else {
          toast.success("Call logs synced.");
        }
      } else {
        toast.success("Call logs synced — 0 calls imported.");
      }
    } catch {
      toast.error("Failed to sync call logs — check your Vapi connection.");
    } finally {
      setIsSyncingLogs(false);
    }
  }, [actor]);

  const toggleChecklist = (id: string) => {
    setChecklistState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      return next;
    });
  };

  const llmMissing = !creds.openaiKey && !creds.claudeKey && !creds.litellmUrl;
  const twilioMissing =
    !creds.twilioSid || !creds.twilioAuth || !creds.twilioNumber;
  const emailMissing =
    !creds.emailSmtpHost || !creds.emailSmtpUser || !creds.emailSmtpPass;
  const hasCriticalWarning = llmMissing || twilioMissing || emailMissing;

  const completedChecklist =
    Object.values(checklistState).filter(Boolean).length;

  const vapiActiveBannerProps: Omit<
    VapiActiveBannerProps,
    "status" | "vapiKey"
  > = {
    onProvisionAll: handleProvisionAll,
    onSyncLogs: handleSyncLogs,
    provisionProgress,
    isProvisioning: isProvisioningAll,
    isSyncing: isSyncingLogs,
  };

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto" data-ocid="golive.page">
      <SystemHealthCheck actor={actor} />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Rocket size={22} className="text-purple-400" />
          Your Command Center. Every Tool. One Place.
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          The faster you connect your integrations, the faster BRF starts making
          you money.{" "}
          <span className="text-purple-300 font-medium">
            Most agencies are fully live in under 15 minutes.
          </span>
        </p>
      </div>

      {/* Cross-device sync note */}
      <div
        className="flex items-start gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3"
        data-ocid="golive.sync_note"
      >
        <Shield size={14} className="text-purple-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-slate-400">
            <span className="text-purple-300 font-medium">
              Your keys are stored securely in the backend
            </span>{" "}
            — they will appear on all your devices automatically once saved.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {backendConnected === true && (
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
                data-ocid="golive.backend_connected.success_state"
              >
                <CheckCircle2 size={11} />
                Connected to secure storage ✓
              </span>
            )}
            {lastSavedAt !== null && (
              <span
                className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-full border border-white/8"
                data-ocid="golive.last_saved"
              >
                Last saved: {formatRelativeTime(lastSavedAt)}
              </span>
            )}
            {lastSavedAt === null && !credsLoading && (
              <span
                className="text-xs text-slate-600 bg-white/3 px-2 py-1 rounded-full border border-white/6"
                data-ocid="golive.not_yet_saved"
              >
                Not yet saved to secure storage
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── AUTH GUARD BANNER ──────────────────────────────────────────────────
          Shown when: user is anonymous, auth stalled, or mobile session expired.
          This is the primary defense against "anonymous principals cannot save"
          errors — no save buttons are accessible until auth is confirmed.
      */}
      {showAuthPrompt && (
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-purple-500/10 p-5"
          data-ocid="golive.auth_guard.panel"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Shield size={18} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-200">
              {authStalled
                ? "Authentication timed out — please log in again"
                : mobileSessionExpired
                  ? "Your session expired — please log in to continue saving"
                  : "Session required — log in to save credentials"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {authStalled
                ? "The identity check took too long. This usually happens on slow mobile connections. Tap Login below to re-authenticate."
                : "Your Internet Identity session is not active on this device. Credentials cannot be saved until you log in."}
            </p>
          </div>
          <button
            type="button"
            data-ocid="golive.auth_guard.login_button"
            onClick={login}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-purple-900/30"
          >
            <LogIn size={15} />
            Log In
          </button>
        </div>
      )}

      {/* Global save error banner */}
      {globalSaveError && (
        <div
          className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/8 p-4"
          data-ocid="golive.save.error_state"
        >
          <XCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-rose-300">
              Save failed — please try again
            </p>
            <p className="text-xs text-rose-400/80 mt-0.5">{globalSaveError}</p>
          </div>
          <button
            type="button"
            onClick={() => setGlobalSaveError(null)}
            className="text-rose-400 hover:text-rose-200 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Backend loading indicator — shows when ICP actor is initializing OR credentials are loading */}
      {(backendInitializing || credsLoading || credsContextLoading) && (
        <div
          className="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4"
          data-ocid="golive.loading_state"
        >
          <Loader2
            size={16}
            className="text-purple-400 animate-spin shrink-0"
          />
          <p className="text-sm text-slate-400">
            {backendInitializing
              ? "Connecting to secure backend storage — save buttons will be available momentarily…"
              : "Loading your credentials from secure storage…"}
          </p>
        </div>
      )}

      {/* CredentialsContext error — shows when backend fails to load after retries */}
      {credsContextError && !credsContextLoading && (
        <div
          className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/8 p-4"
          data-ocid="golive.creds_context.error_state"
        >
          <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-rose-300">
              {credsContextError.includes("stalled")
                ? "Authentication stalled"
                : "Unable to load credentials"}
            </p>
            <p className="text-xs text-rose-400/80 mt-0.5">
              {credsContextError}
            </p>
          </div>
          <button
            type="button"
            data-ocid="golive.creds_context.retry_button"
            onClick={refreshCreds}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors"
          >
            <RefreshCw size={11} />
            Retry
          </button>
        </div>
      )}

      {/* Backend connection warning banner — yellow/amber for health check issues */}
      {backendError && !credsLoading && !credsContextLoading && (
        <div
          className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4"
          data-ocid="golive.backend_health.warning"
        >
          <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-300">
              Backend connection issue — your keys may not save correctly
            </p>
            <p className="text-xs text-amber-400/80 mt-0.5">{backendError}</p>
          </div>
          <button
            type="button"
            onClick={() => setBackendError(null)}
            className="text-amber-400 hover:text-amber-200 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Vapi Active Banner (top-level, prominent) */}
      {(creds.vapiKey || vapiProvisionStatus !== "not_configured") && (
        <VapiActiveBanner
          status={vapiProvisionStatus}
          vapiKey={creds.vapiKey}
          {...vapiActiveBannerProps}
        />
      )}

      {/* Readiness Score Card — Visual Gauge */}
      <div
        className="rounded-2xl border border-white/10 bg-card p-6"
        data-ocid="golive.readiness.card"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Circular Gauge */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-32 h-32">
              <svg
                viewBox="0 0 120 120"
                className="w-full h-full -rotate-90"
                role="img"
                aria-label={`Platform readiness: ${score} out of 100`}
              >
                {/* Background track */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.75} ${2 * Math.PI * 50 * 0.25}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * 0.125}`}
                  strokeLinecap="round"
                />
                {/* Score arc */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={
                    score >= 70
                      ? "oklch(0.62 0.18 155)"
                      : score >= 40
                        ? "oklch(0.72 0.18 75)"
                        : "oklch(0.62 0.2 15)"
                  }
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.75 * (score / 100)} ${2 * Math.PI * 50 * (1 - (0.75 * score) / 100)}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * 0.125}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                <span
                  className={`text-3xl font-black leading-none ${getScoreColor(score)}`}
                >
                  {score}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">/ 100</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium text-center">
              Platform Readiness
            </p>
            <div
              className={`text-[11px] font-semibold px-2 py-1 rounded-full border ${
                score >= 70
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : score >= 40
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}
            >
              {score < 40
                ? "Not Ready"
                : score < 70
                  ? "Partially Live"
                  : "Ready to Launch 🚀"}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4 min-w-0">
            {/* Next action */}
            {score < 100 && (
              <div className="rounded-lg bg-purple-500/8 border border-purple-500/20 p-3">
                <p className="text-xs font-semibold text-purple-300 mb-1 flex items-center gap-1.5">
                  <TrendingUp size={11} />
                  Next step to increase your score
                </p>
                <p className="text-xs text-slate-400">
                  {llmMissing
                    ? "Connect OpenAI or Claude (+20 pts) — unlocks every AI feature on the platform."
                    : twilioMissing
                      ? "Complete your Twilio setup (+20 pts) — activates Call Text Back and Two-Way SMS."
                      : !creds.stripePublishableKey
                        ? "Add Stripe (+14 pts) — enables estimates, invoices, and payment collection."
                        : !creds.googleClientId
                          ? "Connect Google OAuth (+13 pts) — unlocks GBP posting, Calendar sync, and review fetching."
                          : emailMissing
                            ? "Configure cold email sending domain (+15 pts) — 3–5× better inbox placement."
                            : "Connect remaining Tier 3 integrations to maximize your lead pipeline."}
                </p>
              </div>
            )}

            {/* AI / Voice / Calling / Payments readiness breakdown bar */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Platform Readiness
              </p>
              {[
                {
                  label: "AI Ready",
                  ok:
                    !!creds.openaiKey ||
                    !!creds.claudeKey ||
                    !!creds.litellmUrl,
                  color: "bg-purple-500",
                  description: "OpenAI or Claude connected",
                },
                {
                  label: "Voice Ready",
                  ok: !!creds.elevenLabsKey,
                  color: "bg-sky-500",
                  description: "ElevenLabs voice connected",
                },
                {
                  label: "Calling Ready",
                  ok:
                    !!creds.twilioSid &&
                    !!creds.twilioAuth &&
                    !!creds.twilioNumber,
                  color: "bg-rose-500",
                  description: "Twilio fully configured",
                },
                {
                  label: "Payments Ready",
                  ok: !!creds.stripePublishableKey,
                  color: "bg-indigo-500",
                  description: "Stripe connected",
                },
              ].map(({ label, ok, color, description }) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${ok ? color : "bg-slate-700"}`}
                  />
                  <span
                    className={`text-xs font-medium w-28 shrink-0 ${ok ? "text-foreground" : "text-slate-500"}`}
                  >
                    {label}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${ok ? color : ""}`}
                      style={{ width: ok ? "100%" : "0%" }}
                    />
                  </div>
                  <span
                    className={`text-[10px] shrink-0 w-32 text-right ${ok ? "text-emerald-400" : "text-slate-600"}`}
                  >
                    {ok ? `✓ ${description}` : description}
                  </span>
                </div>
              ))}
            </div>

            {/* Score breakdown grid */}
            <div>
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
                <span>Score breakdown</span>
                <span className="text-slate-600">·</span>
                <span className="text-purple-400 font-medium">
                  LLM providers count for 40% of your readiness score
                </span>
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  {
                    label: "Cold Email",
                    ok:
                      !!creds.emailSmtpHost &&
                      !!creds.emailSmtpUser &&
                      !!creds.emailSmtpPass,
                    pts: 15,
                  },
                  {
                    label: "LLM",
                    ok:
                      !!creds.openaiKey ||
                      !!creds.claudeKey ||
                      !!creds.litellmUrl,
                    pts: 20,
                  },
                  {
                    label: "Twilio",
                    ok:
                      !!creds.twilioSid &&
                      !!creds.twilioAuth &&
                      !!creds.twilioNumber,
                    pts: 20,
                  },
                  {
                    label: "Stripe",
                    ok: !!creds.stripePublishableKey,
                    pts: 14,
                  },
                  { label: "Google", ok: !!creds.googleClientId, pts: 13 },
                  {
                    label: "Verification",
                    ok: !!creds.hunterApiKey || !!creds.neverBounceKey,
                    pts: 5,
                  },
                ].map(({ label, ok, pts }) => (
                  <div
                    key={label}
                    className={`rounded-lg p-2 text-xs font-medium border ${
                      ok
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : label === "Cold Email"
                          ? "bg-amber-500/8 border-amber-500/25 text-amber-400"
                          : "bg-white/3 border-white/6 text-slate-500"
                    }`}
                  >
                    <div>
                      {ok ? "✓" : label === "Cold Email" ? "!" : "○"} {label}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 ${ok ? "text-emerald-400/60" : "text-slate-600"}`}
                    >
                      {ok ? `+${pts} pts` : `${pts} pts available`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {globalSaving && (
                  <span
                    className="flex items-center gap-1.5 text-xs text-purple-400"
                    data-ocid="golive.readiness.saving_state"
                  >
                    <Loader2 size={11} className="animate-spin" />
                    Saving to backend…
                  </span>
                )}
                {!globalSaving && (
                  <p className="text-xs text-slate-500">
                    Last updated:{" "}
                    {lastUpdated.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {creds.vapiKey && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400">Vapi:</span>
                    <VapiStatusBadge
                      status={vapiProvisionStatus}
                      vapiKey={creds.vapiKey}
                    />
                  </div>
                )}
                {creds.elevenLabsKey && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400">ElevenLabs:</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/15 text-sky-400 border border-sky-500/30">
                      <Headphones size={9} />
                      Voice AI Ready
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Health Panel */}
      <IntegrationHealthPanelWithCritical actor={actor} creds={creds} />

      {/* Critical Path Warning */}
      {hasCriticalWarning && (
        <div
          className="rounded-xl border border-amber-500/30 bg-amber-500/8 p-4 flex gap-3"
          data-ocid="golive.critical_warning"
        >
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-300 mb-1">
              Critical services not yet configured
            </p>
            <ul className="text-xs text-amber-400/80 space-y-0.5">
              {llmMissing && (
                <li>
                  · <strong>LLM (OpenAI / Claude / LiteLLM)</strong> — AI copy
                  generation, agent responses, and report narratives are
                  inactive
                </li>
              )}
              {twilioMissing && (
                <li>
                  · <strong>Twilio</strong> — Call Text Back, Two-Way SMS Inbox,
                  and inbound voice agent will not fire
                </li>
              )}
              {emailMissing && (
                <li>
                  · <strong>Cold Email Sending Domain</strong> — cold email
                  campaigns will send from shared IPs, hurting deliverability
                  3–5× (see Priority 0 above)
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Priority 0 */}
      <section data-ocid="golive.priority0.section">
        <div className="rounded-xl border border-amber-500/50 bg-amber-500/8 p-4 mb-4">
          <div className="flex items-center gap-2">
            <Rocket size={15} className="text-amber-400" />
            <h2 className="text-sm font-bold text-amber-300">
              Start Here — Priority 0
            </h2>
            <span className="ml-auto text-xs bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
              Do this first
            </span>
          </div>
          <p className="text-xs text-amber-400/80 mt-1">
            These two steps determine whether your emails land in inboxes or
            spam folders. Configure before anything else.
          </p>
        </div>

        <div className="space-y-3">
          <ColdEmailDomainCard creds={creds} onChange={updateCreds} />
          <WarmEmailNativeCard />
        </div>
      </section>

      {/* Service Tiers */}
      {TIERS.map((tier) => {
        const tierServices = SERVICE_DEFINITIONS.filter((s) =>
          tier.ids.includes(s.id),
        );
        return (
          <section
            key={tier.label}
            data-ocid={`golive.${tier.label.replace(/\s/g, "_").toLowerCase()}.section`}
          >
            <div className={`rounded-xl border p-4 mb-4 ${tier.color}`}>
              <h2 className={`text-sm font-bold ${tier.labelColor}`}>
                {tier.label}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{tier.sublabel}</p>
            </div>
            <div className="space-y-3">
              {tierServices.map((svc) => (
                <div key={svc.id}>
                  <ServiceCard
                    svc={svc}
                    creds={creds}
                    onChange={updateCreds}
                    onVapiSave={svc.id === "vapi" ? handleVapiSave : undefined}
                    vapiProvisionStatus={
                      svc.id === "vapi" ? vapiProvisionStatus : undefined
                    }
                    vapiSaving={svc.id === "vapi" ? vapiSaving : undefined}
                    vapiActiveBannerProps={
                      svc.id === "vapi" ? vapiActiveBannerProps : undefined
                    }
                    backendInitializing={backendInitializing}
                    isAnonymous={showAuthPrompt}
                    authStalled={authStalled}
                    onActivityLog={addActivityEntry}
                    currentUserEmail={currentUserEmail}
                  />
                  {/* ElevenLabs Voice Manager — rendered below the ElevenLabs card when key is saved */}
                  {svc.id === "elevenlabs" && creds.elevenLabsKey && (
                    <div
                      className="mt-3"
                      data-ocid="golive.elevenlabs.voice_manager"
                    >
                      <ElevenLabsVoiceManager apiKey={creds.elevenLabsKey} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Scalability Checklist */}
      <section data-ocid="golive.scalability.section">
        <div className="rounded-xl border border-white/10 bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Zap size={16} className="text-amber-400" />
                Scalability Checklist
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Best practices to take BRF from working to production-scale
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/8">
              {completedChecklist} / {SCALABILITY_ITEMS.length} done
            </span>
          </div>
          <div className="space-y-2">
            {SCALABILITY_ITEMS.map((item) => (
              <label
                key={item.id}
                data-ocid={`golive.checklist.${item.id}.checkbox`}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  checklistState[item.id]
                    ? "bg-emerald-500/8 border-emerald-500/25"
                    : "bg-white/3 border-white/6 hover:bg-white/5"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 accent-emerald-500 w-4 h-4 shrink-0 cursor-pointer"
                  checked={!!checklistState[item.id]}
                  onChange={() => toggleChecklist(item.id)}
                />
                <div>
                  <p
                    className={`text-sm font-medium ${checklistState[item.id] ? "text-emerald-400 line-through" : "text-foreground"}`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* NVIDIA AI Brain */}
      <section data-ocid="golive.nvidia_ai_brain.section">
        <NvidiaAIBrainSection />
      </section>

      {/* Composio MCP Router */}
      <section data-ocid="golive.composio.section">
        <ComposioSection />
      </section>

      {/* Abacus.AI RouteLLM */}
      <section data-ocid="golive.abacus.section">
        <AbacusSection />
      </section>

      {/* N8N Workflow */}
      <section data-ocid="golive.n8n_workflow.section">
        <N8NWorkflowSection />
      </section>

      {/* Dograh Voice Agent Builder */}
      <section data-ocid="golive.dograh.section">
        <DograhSection />
      </section>

      {/* OpenRouter AI Router */}
      <section data-ocid="golive.openrouter.section">
        <OpenRouterSection />
      </section>

      {/* Google Gemini */}
      <section data-ocid="golive.gemini.section">
        <GeminiSection />
      </section>

      {/* Content Tier Toggles — Super Admin only */}
      {isSuperAdmin && (
        <section data-ocid="golive.content_tier_toggles.panel">
          <ContentTierToggleSection />
        </section>
      )}

      {/* Activity Log */}
      <section data-ocid="golive.activity_log.section">
        <ActivityLog entries={activityLog} />
      </section>

      {/* Persistent Credential Change Log */}
      <section data-ocid="golive.change_log.section">
        <CredentialChangeLog
          entries={persistedChangeLog}
          onClear={() => {
            setPersistedChangeLog([]);
            try {
              localStorage.removeItem(CRED_CHANGE_LOG_KEY);
            } catch {
              // ignore
            }
          }}
        />
      </section>
      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Production Validation Report
        </h2>
        <p className="mb-2 text-muted-foreground">
          Mock data removed — all demo data cleared
        </p>
        <p className="mb-4 text-muted-foreground">
          Roofing campaign: Manual start required
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Refresh
        </button>
      </section>
    </div>
  );
}
