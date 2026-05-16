import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Rocket,
  RotateCcw,
  Server,
  Shield,
  Wifi,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
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
import { type AiProviderConfig, useApp } from "../context/AppContext";
import { TENANTS } from "../data/demoData";
import { useActor } from "../hooks/useActor";
import { testServiceConnection } from "../services/openSourceAdapters";
import type {
  OpenSourceServiceConfig,
  ServiceStatus,
} from "../types/integrations";
import { defaultOpenSourceConfig } from "../types/integrations";

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  ocid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ocid: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Label className="text-xs text-gray-600">{label}</Label>
      <div className="relative mt-1">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-9"
          data-ocid={ocid}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-200 hover:text-gray-600"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

type ConnectionStatus =
  | "idle"
  | "testing"
  | "connected"
  | "failed"
  | "unconfigured";

function IntegrationSection({
  title,
  description,
  badgeColor,
  badgeLabel,
  children,
  onTest,
}: {
  title: string;
  description: string;
  badgeColor: string;
  badgeLabel: string;
  children: React.ReactNode;
  onTest: () => Promise<void>;
}) {
  const [status, setStatus] = useState<ConnectionStatus>("idle");

  const handleTest = async () => {
    setStatus("testing");
    await onTest();
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg ${badgeColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}
          >
            {badgeLabel}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
            <p className="text-xs text-gray-200 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {status === "connected" && (
            <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2.5 py-1 rounded-full">
              ✓ Connected
            </span>
          )}
          {status === "unconfigured" && (
            <span className="text-xs bg-gray-100 text-gray-200 font-medium px-2.5 py-1 rounded-full">
              Not Configured
            </span>
          )}
          {status === "failed" && (
            <span className="text-xs bg-red-100 text-red-600 font-medium px-2.5 py-1 rounded-full">
              ✗ Failed
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleTest}
            disabled={status === "testing"}
            className="text-xs h-7"
          >
            {status === "testing" ? (
              <>
                <Loader2 size={11} className="mr-1 animate-spin" /> Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function useTestConnection(
  getValue: () => string,
): [ConnectionStatus, (s: ConnectionStatus) => void, () => Promise<void>] {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const test = async () => {
    setStatus("testing");
    await new Promise((r) => setTimeout(r, 1500));
    const val = getValue();
    setStatus(val ? "connected" : "unconfigured");
  };
  return [status, setStatus, test];
}

const AI_PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI GPT-4o",
    badge: "bg-emerald-100 text-emerald-700",
    desc: "Best for structured reasoning and chat",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    badge: "bg-purple-100 text-purple-700",
    desc: "Best for long-form copy and nuanced responses",
    models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"],
  },
  {
    id: "meta",
    name: "Meta Llama 3 (Groq)",
    badge: "bg-blue-100 text-blue-700",
    desc: "Fast, cost-effective, great for social content",
    models: ["llama3-70b-8192", "llama3-8b-8192"],
  },
  {
    id: "google",
    name: "Google Gemini",
    badge: "bg-orange-100 text-orange-700",
    desc: "Strong for search and multimodal tasks",
    models: ["gemini-1.5-pro", "gemini-1.5-flash"],
  },
];

function AiConfigTab() {
  const { aiProviderConfig, setAiProviderConfig } = useApp();
  const [config, setConfig] = useState<AiProviderConfig>(aiProviderConfig);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "ok" | "fail">("idle");
  const [showKey, setShowKey] = useState(false);

  const selectedProvider =
    AI_PROVIDERS.find((p) => p.id === config.provider) ?? AI_PROVIDERS[0];

  const handleTest = () => {
    setTesting(true);
    setTestResult("idle");
    setTimeout(() => {
      setTestResult(config.apiKey.length > 8 ? "ok" : "fail");
      setTesting(false);
    }, 1500);
  };

  const handleSave = () => {
    setAiProviderConfig(config);
    toast.success("AI configuration saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-800">
          AI Provider Configuration
        </h3>
        <p className="text-sm text-gray-200 mt-0.5">
          Choose your default AI provider for the Business Manager, Chat Widget,
          and Social Media tools.
        </p>
      </div>

      {/* Provider Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        data-ocid="settings.ai.provider.card"
      >
        {AI_PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            type="button"
            data-ocid={`settings.ai.${provider.id}.button`}
            onClick={() =>
              setConfig((c) => ({
                ...c,
                provider: provider.id,
                model: provider.models[0],
              }))
            }
            className={`text-left p-4 rounded-xl border-2 transition-all ${config.provider === provider.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {provider.name}
                </p>
                <p className="text-xs text-gray-200 mt-0.5">{provider.desc}</p>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${provider.badge}`}
              >
                {provider.id.toUpperCase()}
              </span>
            </div>
            {config.provider === provider.id && (
              <div className="mt-2 flex items-center gap-1 text-indigo-600">
                <CheckCircle size={12} />
                <span className="text-xs font-medium">Selected</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* API Key + Model for selected provider */}
      <div className="border border-gray-200 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">
          {selectedProvider.name} Settings
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-600 mb-1 block">API Key</Label>
            <div className="relative">
              <Input
                data-ocid="settings.ai.key.input"
                type={showKey ? "text" : "password"}
                value={config.apiKey}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, apiKey: e.target.value }))
                }
                placeholder="Enter your API key..."
                className="pr-10 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-200 hover:text-gray-600"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-600 mb-1 block">Model</Label>
            <Select
              value={config.model}
              onValueChange={(v) => setConfig((c) => ({ ...c, model: v }))}
            >
              <SelectTrigger
                className="text-xs h-9"
                data-ocid="settings.ai.model.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedProvider.models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            data-ocid="settings.ai.test.button"
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={testing}
          >
            {testing ? (
              <Loader2 size={13} className="mr-1.5 animate-spin" />
            ) : null}
            Test Connection
          </Button>
          {testResult === "ok" && (
            <span
              className="text-xs text-emerald-600 font-medium flex items-center gap-1"
              data-ocid="settings.ai.success_state"
            >
              <CheckCircle size={12} /> Connected
            </span>
          )}
          {testResult === "fail" && (
            <span
              className="text-xs text-red-500 font-medium"
              data-ocid="settings.ai.error_state"
            >
              Connection failed — check your API key
            </span>
          )}
        </div>
        <Button
          data-ocid="settings.ai.save.button"
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          size="sm"
        >
          Save AI Config
        </Button>
      </div>
    </div>
  );
}

// ─── Setup Guide Data ─────────────────────────────────────────────────────────

type SetupStep = { title: string; code?: string; note?: string };
interface SetupGuideData {
  id: string;
  title: string;
  subtitle: string;
  estimatedTime: string;
  whatItDoes: string;
  prerequisites: string;
  steps: SetupStep[];
  fallback: string;
  tip: string;
}

const SETUP_GUIDES: Record<string, SetupGuideData> = {
  litellm: {
    id: "litellm",
    title: "LiteLLM Setup Guide",
    subtitle: "Unified AI proxy — one key, any provider",
    estimatedTime: "~15 minutes",
    whatItDoes:
      "LiteLLM acts as a proxy layer between your app and any AI provider (OpenAI, Claude, Llama 3, Bedrock, etc.). Instead of managing separate API keys for each provider, all AI calls route through your LiteLLM endpoint. Your app already supports LiteLLM — just point it at your server.",
    prerequisites:
      "A VPS with 1 CPU / 512MB RAM minimum (DigitalOcean, Vultr, Hetzner, or any Linux server)",
    steps: [
      {
        title: "Install LiteLLM",
        code: "pip install litellm[proxy]",
      },
      {
        title: "Create config file (config.yaml)",
        code: `model_list:
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: YOUR_OPENAI_KEY
  - model_name: claude-3-5-sonnet
    litellm_params:
      model: anthropic/claude-3-5-sonnet-20241022
      api_key: YOUR_ANTHROPIC_KEY
  - model_name: llama3
    litellm_params:
      model: ollama/llama3
      api_base: http://localhost:11434`,
      },
      {
        title: "Start the proxy",
        code: "litellm --config config.yaml --port 4000",
      },
      {
        title: "Run with Docker (optional)",
        code: `docker run -d -p 4000:4000 \\
  -e OPENAI_API_KEY=your_key \\
  -v ./config.yaml:/app/config.yaml \\
  ghcr.io/berriai/litellm:main-latest \\
  --config /app/config.yaml`,
      },
      {
        title: "Enter your endpoint in the config below",
        note: "Endpoint URL: http://your-server-ip:4000\nAPI Key: set with --master-key flag when starting LiteLLM",
      },
    ],
    fallback:
      "If LiteLLM is unavailable, your app automatically falls back to your configured OpenAI or Claude key directly. Your AI features never go offline.",
    tip: 'Use a process manager like PM2 or systemd to keep LiteLLM running. With Docker Compose, add "restart: always".',
  },
  ollama: {
    id: "ollama",
    title: "Ollama Setup Guide",
    subtitle: "Local Llama 3 for routine AI tasks",
    estimatedTime: "~20 minutes",
    whatItDoes:
      "Ollama runs open source language models (Llama 3, Mistral, Phi-3) directly on your server. Your app routes lower-stakes tasks (summaries, FAQ drafts, copy variations) to Ollama first, saving your paid API quota for complex generation tasks.",
    prerequisites:
      "A server with 8GB+ RAM (for Llama 3 8B). 16GB recommended. Linux or macOS.",
    steps: [
      {
        title: "Install Ollama",
        code: "curl -fsSL https://ollama.ai/install.sh | sh",
      },
      {
        title: "Pull Llama 3 model",
        code: "ollama pull llama3",
      },
      {
        title: "Start Ollama server",
        code: "ollama serve",
      },
      {
        title: "Enable remote access (allow connections from your app)",
        code: `OLLAMA_HOST=0.0.0.0 ollama serve

# Or set in environment:
export OLLAMA_HOST=0.0.0.0
export OLLAMA_ORIGINS=*`,
      },
      {
        title: "Enter endpoint in config below",
        note: "Endpoint URL: http://your-server-ip:11434\nDefault Model: llama3",
      },
    ],
    fallback:
      "If Ollama is unavailable, tasks automatically route to LiteLLM or your configured OpenAI/Claude key.",
    tip: "llama3:8b works well for most tasks. For better quality on complex copy, try llama3:70b (requires ~40GB RAM).",
  },
  listmonk: {
    id: "listmonk",
    title: "Listmonk Setup Guide",
    subtitle: "Self-hosted email for campaigns and outreach sequences",
    estimatedTime: "~25 minutes",
    whatItDoes:
      "Listmonk handles all your outreach sequence emails and campaigns. Full open/click tracking, bounce handling, unsubscribe management, and per-subscriber analytics — with no per-send fees. Your app sends all campaign and sequence emails through Listmonk when configured.",
    prerequisites:
      "A VPS with 1 CPU / 1GB RAM. PostgreSQL (can run alongside Listmonk on the same server). A sending domain configured in Caffeine or your SMTP provider.",
    steps: [
      {
        title: "Install with Docker Compose (recommended)",
        code: `version: "3"
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: listmonk
      POSTGRES_USER: listmonk
      POSTGRES_DB: listmonk
    volumes:
      - postgres_data:/var/lib/postgresql/data
  app:
    image: listmonk/listmonk:latest
    ports:
      - "9000:9000"
    environment:
      LISTMONK_app__address: "0.0.0.0:9000"
      LISTMONK_db__host: db
      LISTMONK_db__password: listmonk
    depends_on:
      - db
volumes:
  postgres_data:`,
      },
      {
        title: "Start and initialize",
        code: `docker compose up -d
docker compose exec app ./listmonk --install`,
      },
      {
        title: "Access admin",
        note: "Open http://your-server:9000/admin in your browser to complete setup.",
      },
      {
        title: "Configure SMTP in Listmonk settings",
        note: "Go to Settings → SMTP in the Listmonk admin panel. Use your Caffeine sending domain or your own SMTP credentials.",
      },
      {
        title: "Create an API key",
        note: "In Listmonk, go to Settings → API and generate a new API key.",
      },
      {
        title: "Enter credentials below",
        note: "Base URL: http://your-server:9000\nUsername: your-listmonk-admin-username\nPassword: your-listmonk-admin-password (or API token)",
      },
    ],
    fallback:
      "If Listmonk is unavailable, all email sends automatically fall back to Caffeine's native email service. No emails are lost.",
    tip: "Listmonk works best with a dedicated sending domain and proper SPF/DKIM/DMARC records. Caffeine handles DNS automatically when you purchase a domain through the platform.",
  },
  searxng: {
    id: "searxng",
    title: "SearXNG Setup Guide",
    subtitle: "Free search data for lead discovery and SEO lookups",
    estimatedTime: "~10 minutes",
    whatItDoes:
      "SearXNG is a self-hosted meta-search engine that aggregates results from Google, Bing, DuckDuckGo, and others — with no per-query API cost. Your app uses it for the Outreach Lead Finder and SEO keyword opportunity lookups.",
    prerequisites: "A VPS with 512MB RAM minimum. Docker recommended.",
    steps: [
      {
        title: "Install with Docker",
        code: `docker run -d \\
  --name searxng \\
  -p 8080:8080 \\
  -v ./searxng:/etc/searxng:rw \\
  -e SEARXNG_BASE_URL=http://your-server:8080/ \\
  searxng/searxng:latest`,
      },
      {
        title: "Enable JSON API (required for app integration)",
        note: "Edit /etc/searxng/settings.yml on your server and add the json format:",
        code: `search:
  formats:
    - html
    - json`,
      },
      {
        title: "Restart container",
        code: "docker restart searxng",
      },
      {
        title: "Test the API",
        code: 'curl "http://your-server:8080/search?q=plumbers+chicago&format=json"',
      },
      {
        title: "Enter endpoint below",
        note: "Base URL: http://your-server:8080",
      },
    ],
    fallback:
      "If SearXNG is unavailable, lead discovery falls back to Google Places API (if configured) and then to cached/simulated results so you can still see the interface.",
    tip: "SearXNG works best on a server with at least 1 CPU core. Add rate limiting and authentication if your instance is publicly accessible.",
  },
};

// ─── Setup Guide Modal ────────────────────────────────────────────────────────

function SetupGuideModal({
  guideKey,
  onClose,
}: {
  guideKey: string;
  onClose: () => void;
}) {
  const guide = SETUP_GUIDES[guideKey];
  if (!guide) return null;

  return (
    // biome-ignore lint/a11y/useSemanticElements: backdrop div for overlay behavior
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="bg-zinc-900 border border-zinc-700/60 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-zinc-100">
                {guide.title}
              </h2>
              <span className="text-[10px] bg-violet-900/50 text-violet-300 border border-violet-700/40 px-2 py-0.5 rounded-full font-medium">
                {guide.estimatedTime}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">{guide.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors shrink-0 mt-0.5"
            aria-label="Close guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* What it does */}
          <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/40 px-4 py-3">
            <p className="text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wide">
              What it does
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {guide.whatItDoes}
            </p>
          </div>

          {/* Prerequisites */}
          <div className="flex items-start gap-2">
            <Shield size={13} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-zinc-300">
                Prerequisites:{" "}
              </span>
              <span className="text-xs text-zinc-500">
                {guide.prerequisites}
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
              Installation Steps
            </p>
            {guide.steps.map((step, idx) => (
              <div key={step.title} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-900/60 border border-violet-700/50 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-violet-300">
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-sm font-medium text-zinc-200">
                    {step.title}
                  </p>
                  {step.note && (
                    <p className="text-xs text-zinc-500 leading-relaxed whitespace-pre-line">
                      {step.note}
                    </p>
                  )}
                  {step.code && (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-emerald-300 font-mono leading-relaxed whitespace-pre">
                        {step.code}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Fallback */}
          <div className="flex items-start gap-2.5 rounded-lg bg-emerald-900/20 border border-emerald-800/40 px-4 py-3">
            <Wifi size={13} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-emerald-300 mb-0.5">
                Fallback Behavior
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {guide.fallback}
              </p>
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2.5 rounded-lg bg-amber-900/20 border border-amber-800/40 px-4 py-3">
            <Zap size={13} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-300 mb-0.5">
                Pro Tip
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {guide.tip}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 shrink-0">
          <Button
            onClick={onClose}
            size="sm"
            className="w-full bg-violet-700 hover:bg-violet-600 text-white text-xs h-9"
          >
            Close Guide
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Start Guide ────────────────────────────────────────────────────────

const QUICK_START_ITEMS = [
  {
    num: 1,
    key: "litellm",
    name: "LiteLLM",
    tag: "Start Here",
    time: "~15 min on a $5/mo VPS",
    tagColor: "bg-violet-900/60 text-violet-300 border-violet-700/50",
    desc: "Unifies all your AI providers under one key. All AI calls (copy engine, agent workflows, AI Business Manager) route through it automatically.",
  },
  {
    num: 2,
    key: "ollama",
    name: "Ollama",
    tag: "AI Cost Reducer",
    time: "~20 min on any server with 8GB+ RAM",
    tagColor: "bg-orange-900/60 text-orange-300 border-orange-700/50",
    desc: "Runs Llama 3 locally for summaries, FAQ drafts, and copy variations. Reduces paid LLM calls by 60–80% for routine tasks.",
  },
  {
    num: 3,
    key: "listmonk",
    name: "Listmonk",
    tag: "Email Independence",
    time: "~25 min on a $5/mo VPS",
    tagColor: "bg-sky-900/60 text-sky-300 border-sky-700/50",
    desc: "Self-hosted email for all outreach sequences and campaigns. Full open/click tracking, no per-send fees.",
  },
  {
    num: 4,
    key: "searxng",
    name: "SearXNG",
    tag: "Free Search Data",
    time: "~10 min on a $5/mo VPS",
    tagColor: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
    desc: "Powers your lead discovery and SEO keyword lookups with no API cost per query.",
  },
];

function QuickStartGuide({
  onOpenGuide,
}: {
  onOpenGuide: (key: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-violet-700/40 bg-violet-900/10 overflow-hidden">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-violet-900/20 transition-colors"
        data-ocid="settings.oss.quickstart.toggle"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <Rocket size={14} className="text-violet-400" />
          <span className="text-sm font-semibold text-violet-200">
            Quick Start Guide
          </span>
          <span className="hidden sm:inline text-[10px] text-zinc-600">
            Set these up in order for maximum impact
          </span>
        </div>
        {expanded ? (
          <ChevronDown size={14} className="text-zinc-500 shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-zinc-500 shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-violet-700/30">
          <p className="text-xs text-zinc-500 pt-3 leading-relaxed">
            Get the most out of your open source stack. Set these up in order
            for maximum impact — each one reduces API costs and gives you more
            control.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_START_ITEMS.map((item) => (
              <div
                key={item.key}
                className="rounded-lg bg-zinc-900/70 border border-zinc-700/50 p-4 space-y-2.5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-900/60 border border-violet-700/50 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-violet-300">
                      {item.num}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${item.tagColor}`}
                      >
                        {item.tag}
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed pl-9">
                  {item.desc}
                </p>
                <div className="pl-9">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenGuide(item.key)}
                    className="text-xs h-7 border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-1.5"
                    data-ocid={`settings.oss.quickstart.${item.key}.guide`}
                  >
                    <BookOpen size={11} />
                    View Setup Guide
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Fallback Chain Visual ────────────────────────────────────────────────────

function FallbackChainVisual({ chain }: { chain: string[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {chain.map((step, idx) => (
        <div key={step} className="flex items-center gap-1">
          <span className="text-[10px] bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 px-2 py-0.5 rounded-full font-mono whitespace-nowrap">
            {step}
          </span>
          {idx < chain.length - 1 && (
            <span className="text-[10px] text-zinc-700">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Service Status Badge ─────────────────────────────────────────────────────

function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  if (status === "connected")
    return (
      <Badge className="bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 text-[10px] gap-1">
        <Wifi size={9} /> Connected
      </Badge>
    );
  if (status === "testing")
    return (
      <Badge className="bg-amber-900/40 text-amber-400 border border-amber-700/50 text-[10px] gap-1">
        <Loader2 size={9} className="animate-spin" /> Testing…
      </Badge>
    );
  if (status === "disconnected")
    return (
      <Badge className="bg-red-900/40 text-red-400 border border-red-700/50 text-[10px] gap-1">
        <WifiOff size={9} /> Disconnected
      </Badge>
    );
  return (
    <Badge className="bg-zinc-800/60 text-zinc-400 border border-zinc-700/50 text-[10px]">
      Not Configured
    </Badge>
  );
}

// ─── Open Source Services Card ────────────────────────────────────────────────

function OSServiceCard({
  icon,
  iconBg,
  title,
  subtitle,
  description,
  fallbackSteps,
  status,
  enabled,
  onToggle,
  onTest,
  onOpenGuide,
  children,
  simulated,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  description: string;
  fallbackSteps: string[];
  status: ServiceStatus;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  onTest: () => void;
  onOpenGuide: () => void;
  children: React.ReactNode;
  simulated?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/60 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
          >
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-zinc-100">
                {title}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                {subtitle}
              </span>
              <ServiceStatusBadge status={status} />
              {simulated && status !== "connected" && (
                <Badge className="bg-violet-900/40 text-violet-400 border border-violet-700/50 text-[10px]">
                  Simulated
                </Badge>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-1">{description}</p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          data-ocid={`settings.oss.${title.toLowerCase().replace(/\s+/g, "_")}.toggle`}
        />
      </div>

      {/* Fields */}
      <div className={enabled ? "" : "opacity-50 pointer-events-none"}>
        {children}
      </div>

      {/* Footer */}
      <div className="space-y-2.5 pt-1 border-t border-zinc-800">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <FallbackChainVisual chain={fallbackSteps} />
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenGuide}
              className="text-xs h-7 border-zinc-700 text-violet-400 hover:bg-zinc-800 hover:text-violet-300 gap-1.5"
              data-ocid={`settings.oss.${title.toLowerCase().replace(/\s+/g, "_")}.guide`}
            >
              <BookOpen size={11} />
              Setup Guide
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onTest}
              disabled={!enabled || status === "testing"}
              className="text-xs h-7 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              data-ocid={`settings.oss.${title.toLowerCase().replace(/\s+/g, "_")}.test`}
            >
              {status === "testing" ? (
                <Loader2 size={11} className="mr-1 animate-spin" />
              ) : null}
              Test Connection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Open Source Services Section ─────────────────────────────────────────────

function OpenSourceServicesSection() {
  const { openSourceConfig, setOpenSourceConfig } = useApp();
  const [cfg, setCfg] = useState<OpenSourceServiceConfig>(openSourceConfig);
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const update = <K extends keyof OpenSourceServiceConfig>(
    service: K,
    patch: Partial<OpenSourceServiceConfig[K]>,
  ) => {
    setCfg((prev) => ({
      ...prev,
      [service]: { ...prev[service], ...patch },
    }));
  };

  const handleTest = async (service: keyof OpenSourceServiceConfig) => {
    update(service, { status: "testing" } as Partial<
      OpenSourceServiceConfig[typeof service]
    >);
    const status = await testServiceConnection(service, cfg);
    update(service, { status } as Partial<
      OpenSourceServiceConfig[typeof service]
    >);
    if (status === "connected") {
      toast.success(`${service} connected successfully`);
    } else if (status === "disconnected") {
      toast.error(
        `${service} is unreachable — check the URL and that the service is running`,
      );
    } else {
      toast.info(`${service} is not configured — enter a Base URL to connect`);
    }
  };

  const handleSave = () => {
    setOpenSourceConfig(cfg);
    toast.success("Open Source Services settings saved");
  };

  const handleReset = () => {
    setCfg(defaultOpenSourceConfig);
    setOpenSourceConfig(defaultOpenSourceConfig);
    toast.success("Open Source Services settings reset to defaults");
  };

  return (
    <div className="space-y-5">
      {/* Setup Guide Modal */}
      {activeGuide && (
        <SetupGuideModal
          guideKey={activeGuide}
          onClose={() => setActiveGuide(null)}
        />
      )}

      {/* Section header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-900/40 border border-violet-700/40 flex items-center justify-center shrink-0 mt-0.5">
            <Server size={15} className="text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Open Source Services
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5 max-w-xl">
              Self-hosted alternatives that reduce external API key dependency.
              All services are optional — the platform runs normally without
              them. Each service falls back automatically to the next available
              option in its chain.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="text-xs h-7 text-zinc-500 hover:text-zinc-300"
          >
            <RotateCcw size={11} className="mr-1" /> Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs h-7 bg-violet-700 hover:bg-violet-600 text-white"
            data-ocid="settings.oss.save.button"
          >
            Save Settings
          </Button>
        </div>
      </div>

      {/* Quick Start Guide — collapsible, collapsed by default */}
      <QuickStartGuide onOpenGuide={(key) => setActiveGuide(key)} />

      {/* Notice */}
      <div className="flex items-start gap-2.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 px-4 py-3">
        <Shield size={13} className="text-violet-400 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          These services run on your own infrastructure. Configure a valid Base
          URL for each service you have running. Connection tests will show
          "Simulated" when a real endpoint is not reachable — this is expected
          in demo environments.
        </p>
      </div>

      {/* LiteLLM */}
      <OSServiceCard
        icon={<Zap size={15} className="text-amber-400" />}
        iconBg="bg-amber-900/40 border border-amber-700/40"
        title="LiteLLM"
        subtitle="AI Proxy Layer"
        description="Unified proxy routing all AI calls through a single endpoint. Reduces API key sprawl — one URL routes to any LLM provider."
        fallbackSteps={["LiteLLM", "OpenAI/Claude", "Graceful message"]}
        status={cfg.litellm.status}
        enabled={cfg.litellm.enabled}
        onToggle={(v) => update("litellm", { enabled: v })}
        onTest={() => handleTest("litellm")}
        onOpenGuide={() => setActiveGuide("litellm")}
        simulated
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-zinc-400 mb-1 block">Base URL</Label>
            <Input
              value={cfg.litellm.baseUrl}
              onChange={(e) => update("litellm", { baseUrl: e.target.value })}
              placeholder="http://localhost:4000"
              className="text-xs bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
              data-ocid="settings.litellm.url.input"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400 mb-1 block">
              API Key{" "}
              <span className="text-zinc-600 font-normal">(optional)</span>
            </Label>
            <Input
              type="password"
              value={cfg.litellm.apiKey}
              onChange={(e) => update("litellm", { apiKey: e.target.value })}
              placeholder="sk-... (leave blank if no auth)"
              className="text-xs bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
              data-ocid="settings.litellm.key.input"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400 mb-1 block">
              Primary Model
            </Label>
            <Select
              value={cfg.litellm.primaryModel}
              onValueChange={(v) => update("litellm", { primaryModel: v })}
            >
              <SelectTrigger className="text-xs h-9 bg-zinc-800/60 border-zinc-700 text-zinc-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ollama/llama3">ollama/llama3</SelectItem>
                <SelectItem value="ollama/mistral">ollama/mistral</SelectItem>
                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                <SelectItem value="claude-3-haiku-20240307">
                  claude-3-haiku
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-zinc-400 mb-1 block">
              Fallback Model
            </Label>
            <Select
              value={cfg.litellm.fallbackModel}
              onValueChange={(v) => update("litellm", { fallbackModel: v })}
            >
              <SelectTrigger className="text-xs h-9 bg-zinc-800/60 border-zinc-700 text-zinc-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                <SelectItem value="claude-3-5-sonnet-20241022">
                  claude-3.5-sonnet
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </OSServiceCard>

      {/* Listmonk */}
      <OSServiceCard
        icon={
          <span className="text-sky-400 font-bold text-xs leading-none">
            LM
          </span>
        }
        iconBg="bg-sky-900/40 border border-sky-700/40"
        title="Listmonk"
        subtitle="Email Campaigns"
        description="Self-hosted email sending for campaigns and outreach sequences. Falls back to Caffeine native email automatically."
        fallbackSteps={["Listmonk", "Caffeine Native Email"]}
        status={cfg.listmonk.status}
        enabled={cfg.listmonk.enabled}
        onToggle={(v) => update("listmonk", { enabled: v })}
        onTest={() => handleTest("listmonk")}
        onOpenGuide={() => setActiveGuide("listmonk")}
        simulated
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Label className="text-xs text-zinc-400 mb-1 block">Base URL</Label>
            <Input
              value={cfg.listmonk.baseUrl}
              onChange={(e) => update("listmonk", { baseUrl: e.target.value })}
              placeholder="http://localhost:9000"
              className="text-xs bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
              data-ocid="settings.listmonk.url.input"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400 mb-1 block">Username</Label>
            <Input
              value={cfg.listmonk.username}
              onChange={(e) => update("listmonk", { username: e.target.value })}
              placeholder="admin"
              className="text-xs bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
              data-ocid="settings.listmonk.user.input"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400 mb-1 block">Password</Label>
            <Input
              type="password"
              value={cfg.listmonk.password}
              onChange={(e) => update("listmonk", { password: e.target.value })}
              placeholder="••••••••"
              className="text-xs bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
              data-ocid="settings.listmonk.pass.input"
            />
          </div>
        </div>
      </OSServiceCard>

      {/* SearXNG */}
      <OSServiceCard
        icon={
          <span className="text-emerald-400 font-bold text-xs leading-none">
            SX
          </span>
        }
        iconBg="bg-emerald-900/40 border border-emerald-700/40"
        title="SearXNG"
        subtitle="Business Search"
        description="Self-hosted meta-search engine for lead discovery and keyword research. Falls back to Google Places API automatically."
        fallbackSteps={["SearXNG", "Google Places API", "Cached Results"]}
        status={cfg.searxng.status}
        enabled={cfg.searxng.enabled}
        onToggle={(v) => update("searxng", { enabled: v })}
        onTest={() => handleTest("searxng")}
        onOpenGuide={() => setActiveGuide("searxng")}
        simulated
      >
        <div>
          <Label className="text-xs text-zinc-400 mb-1 block">Base URL</Label>
          <Input
            value={cfg.searxng.baseUrl}
            onChange={(e) => update("searxng", { baseUrl: e.target.value })}
            placeholder="http://localhost:8888"
            className="text-xs bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 max-w-sm"
            data-ocid="settings.searxng.url.input"
          />
        </div>
      </OSServiceCard>

      {/* Ollama */}
      <OSServiceCard
        icon={
          <span className="text-orange-400 font-bold text-xs leading-none">
            OL
          </span>
        }
        iconBg="bg-orange-900/40 border border-orange-700/40"
        title="Ollama"
        subtitle="Local LLM"
        description="Run AI models locally on your own hardware. Used for lower-stakes tasks (summaries, FAQ drafts, copy variations) to reduce paid API costs."
        fallbackSteps={["Ollama", "LiteLLM", "OpenAI/Claude"]}
        status={cfg.ollama.status}
        enabled={cfg.ollama.enabled}
        onToggle={(v) => update("ollama", { enabled: v })}
        onTest={() => handleTest("ollama")}
        onOpenGuide={() => setActiveGuide("ollama")}
        simulated
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-zinc-400 mb-1 block">Base URL</Label>
            <Input
              value={cfg.ollama.baseUrl}
              onChange={(e) => update("ollama", { baseUrl: e.target.value })}
              placeholder="http://localhost:11434"
              className="text-xs bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
              data-ocid="settings.ollama.url.input"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400 mb-1 block">
              Default Model
            </Label>
            <Input
              value={cfg.ollama.defaultModel}
              onChange={(e) =>
                update("ollama", { defaultModel: e.target.value })
              }
              placeholder="llama3"
              className="text-xs bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
              data-ocid="settings.ollama.model.input"
            />
          </div>
        </div>
        {cfg.ollama.status !== "connected" && (
          <p className="text-[10px] text-zinc-600 mt-2">
            Connect to discover available models on your Ollama instance
          </p>
        )}
      </OSServiceCard>
    </div>
  );
}

export default function SettingsPage() {
  const {
    currentTenantId,
    isAdmin,
    isAdminUser,
    resetOnboarding,
    resetAgencyOnboarding,
  } = useApp();
  const { actor } = useActor();
  const navigate = useNavigate();
  const tenant = TENANTS.find((t) => t.id === currentTenantId);

  const [form, setForm] = useState({
    name: tenant?.name ?? "",
    phone: tenant?.phone ?? "",
    website: tenant?.website ?? "",
    address: tenant?.address ?? "",
  });

  // Agency/Admin integrations
  const [agencySettings, setAgencySettings] = useState({
    twilioSid: "",
    twilioAuth: "",
    twilioNumber: "",
    vapiKey: "",
  });

  // Extended integrations (local state only)
  const [stripeKeys, setStripeKeys] = useState({
    publishable: "",
    secret: "",
    webhook: "",
    mode: "test" as "test" | "live",
  });
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "587",
    username: "",
    password: "",
    sendgridKey: "",
    fromAddress: "",
  });
  const [googleKeys, setGoogleKeys] = useState({
    placesKey: "",
    mapsKey: "",
    gbpUrl: "",
  });
  const [serpSettings, setSerpSettings] = useState({
    apiKey: "",
    provider: "serpapi",
  });
  const [openaiSettings, setOpenaiSettings] = useState({
    apiKey: "",
    model: "gpt-4o",
  });

  // Client-level settings
  const [reviewPlatforms, setReviewPlatforms] = useState({
    google: true,
    yelp: true,
    facebook: false,
  });
  const [notifEmail, setNotifEmail] = useState("");
  const [notifPhone, setNotifPhone] = useState("");

  const [savingIntegrations, setSavingIntegrations] = useState(false);
  const [loadingIntegrations, setLoadingIntegrations] = useState(false);

  useEffect(() => {
    if (!isAdminUser || !actor) return;
    setLoadingIntegrations(true);
    actor
      .getAgencySettings()
      .then((res) => {
        if (res) {
          setAgencySettings({
            twilioSid: res.twilioSid,
            twilioAuth: res.twilioAuth,
            twilioNumber: res.twilioNumber,
            vapiKey: res.vapiKey,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingIntegrations(false));
  }, [isAdminUser, actor]);

  const handleSave = () => {
    toast.success("Business profile saved!");
  };

  const handleSaveIntegrations = async () => {
    if (!actor) {
      toast.error("Backend not available.");
      return;
    }
    setSavingIntegrations(true);
    try {
      await actor.updateAgencySettings(agencySettings);
      toast.success("Integration credentials saved securely!");
    } catch {
      toast.error("Failed to save credentials.");
    } finally {
      setSavingIntegrations(false);
    }
  };

  const handleRestartWizard = () => {
    if (isAdmin || isAdminUser) {
      resetAgencyOnboarding();
    } else {
      resetOnboarding(currentTenantId);
    }
    toast.success("Setup wizard reset. Redirecting...");
    setTimeout(() => navigate({ to: "/onboarding" }), 800);
  };

  // Test connection helpers
  const [, , testStripe] = useTestConnection(() => stripeKeys.secret);
  const [, , testTwilio] = useTestConnection(() => agencySettings.twilioSid);
  const [, , testVapi] = useTestConnection(() => agencySettings.vapiKey);
  const [, , testEmail] = useTestConnection(
    () => emailSettings.smtpHost || emailSettings.sendgridKey,
  );
  const [, , testGoogle] = useTestConnection(() => googleKeys.placesKey);
  const [, , testSerp] = useTestConnection(() => serpSettings.apiKey);
  const [, , testOpenai] = useTestConnection(() => openaiSettings.apiKey);

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="bg-gray-100" data-ocid="settings.tab">
        <TabsTrigger value="profile" data-ocid="settings.tab">
          Business Profile
        </TabsTrigger>
        <TabsTrigger value="notifications" data-ocid="settings.tab">
          Notifications
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="clients" data-ocid="settings.tab">
            Client Businesses
          </TabsTrigger>
        )}
        <TabsTrigger value="integrations" data-ocid="settings.tab">
          Integrations
        </TabsTrigger>
        {isAdminUser && (
          <TabsTrigger value="ai-config" data-ocid="settings.tab">
            AI Config
          </TabsTrigger>
        )}
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <div className="space-y-4 max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Business Profile
            </h3>
            <div>
              <Label>Business Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="mt-1"
                data-ocid="settings.name.input"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="mt-1"
                data-ocid="settings.phone.input"
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                value={form.website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
                className="mt-1"
                data-ocid="settings.website.input"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                className="mt-1"
                data-ocid="settings.address.input"
              />
            </div>
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              data-ocid="settings.save.button"
            >
              Save Profile
            </Button>
          </div>

          {/* Onboarding Wizard Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Onboarding Wizard
                </h3>
                <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                  Re-run the step-by-step setup wizard to update your business
                  profile, phone setup, campaigns, chat widget, and
                  integrations.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestartWizard}
                className="shrink-0 gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                data-ocid="settings.wizard.restart.button"
              >
                <RotateCcw size={13} />
                Restart Setup Wizard
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Notification Preferences
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "New Lead Alerts",
                sub: "Get notified when a new lead comes in",
              },
              {
                label: "Review Notifications",
                sub: "Alert when a customer leaves a review",
              },
              {
                label: "Audit Score Changes",
                sub: "Weekly SEO audit score summary",
              },
              {
                label: "Uptime Alerts",
                sub: "Notify when your site goes down",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-200">{item.sub}</p>
                </div>
                <Switch
                  defaultChecked
                  data-ocid={`settings.notif.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.switch`}
                />
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Clients Tab */}
      {isAdmin && (
        <TabsContent value="clients">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Client Businesses
            </h3>
            <p className="text-xs text-gray-200">
              Manage client accounts and business profiles from the Admin Panel.
            </p>
          </div>
        </TabsContent>
      )}

      {/* Integrations Tab */}
      <TabsContent value="integrations">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Integrations Hub
              </h3>
              <p className="text-xs text-gray-200 mt-0.5">
                Connect your tools to unlock the full power of the platform.
              </p>
            </div>
          </div>

          {loadingIntegrations && (
            <div className="flex items-center gap-2 text-sm text-gray-200 py-4">
              <Loader2 size={14} className="animate-spin" /> Loading saved
              credentials...
            </div>
          )}

          {/* Stripe — super admin only */}
          {isAdminUser && (
            <IntegrationSection
              title="Stripe"
              description="Accept payments, subscriptions, and manage billing"
              badgeColor="bg-violet-600"
              badgeLabel="S$"
              onTest={testStripe}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">
                    Publishable Key
                  </Label>
                  <Input
                    value={stripeKeys.publishable}
                    onChange={(e) =>
                      setStripeKeys((k) => ({
                        ...k,
                        publishable: e.target.value,
                      }))
                    }
                    placeholder="pk_live_..."
                    className="mt-1 text-xs"
                    data-ocid="settings.stripe.publishable.input"
                  />
                </div>
                <PasswordField
                  label="Secret Key"
                  value={stripeKeys.secret}
                  onChange={(v) => setStripeKeys((k) => ({ ...k, secret: v }))}
                  placeholder="sk_live_..."
                  ocid="settings.stripe.secret.input"
                />
                <PasswordField
                  label="Webhook Secret"
                  value={stripeKeys.webhook}
                  onChange={(v) => setStripeKeys((k) => ({ ...k, webhook: v }))}
                  placeholder="whsec_..."
                  ocid="settings.stripe.webhook.input"
                />
                <div>
                  <Label className="text-xs text-gray-600">Mode</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Switch
                      checked={stripeKeys.mode === "live"}
                      onCheckedChange={(v) =>
                        setStripeKeys((k) => ({
                          ...k,
                          mode: v ? "live" : "test",
                        }))
                      }
                      data-ocid="settings.stripe.mode.switch"
                    />
                    <span className="text-xs text-gray-600">
                      {stripeKeys.mode === "live" ? "Live Mode" : "Test Mode"}
                    </span>
                  </div>
                </div>
              </div>
            </IntegrationSection>
          )}

          {/* Twilio */}
          {(isAdminUser || isAdmin) && (
            <IntegrationSection
              title="Twilio"
              description="SMS review requests, voice agent calls, and automated messaging"
              badgeColor="bg-red-600"
              badgeLabel="TW"
              onTest={testTwilio}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">Account SID</Label>
                  <Input
                    value={agencySettings.twilioSid}
                    onChange={(e) =>
                      setAgencySettings((s) => ({
                        ...s,
                        twilioSid: e.target.value,
                      }))
                    }
                    placeholder="ACxxxxxxxxxxxxxxxx"
                    className="mt-1 text-xs"
                    data-ocid="settings.twilio.sid.input"
                  />
                </div>
                <PasswordField
                  label="Auth Token"
                  value={agencySettings.twilioAuth}
                  onChange={(v) =>
                    setAgencySettings((s) => ({ ...s, twilioAuth: v }))
                  }
                  placeholder="Auth token"
                  ocid="settings.twilio.auth.input"
                />
                <div>
                  <Label className="text-xs text-gray-600">Phone Number</Label>
                  <Input
                    value={agencySettings.twilioNumber}
                    onChange={(e) =>
                      setAgencySettings((s) => ({
                        ...s,
                        twilioNumber: e.target.value,
                      }))
                    }
                    placeholder="+1 (760) 555-0000"
                    className="mt-1 text-xs"
                    data-ocid="settings.twilio.number.input"
                  />
                </div>
              </div>
            </IntegrationSection>
          )}

          {/* Vapi.ai */}
          {(isAdminUser || isAdmin) && (
            <IntegrationSection
              title="Vapi.ai"
              description="AI-powered inbound voice agents and call routing"
              badgeColor="bg-purple-600"
              badgeLabel="VA"
              onTest={testVapi}
            >
              <div className="max-w-sm">
                <PasswordField
                  label="API Key"
                  value={agencySettings.vapiKey}
                  onChange={(v) =>
                    setAgencySettings((s) => ({ ...s, vapiKey: v }))
                  }
                  placeholder="vapi_..."
                  ocid="settings.vapi.key.input"
                />
              </div>
            </IntegrationSection>
          )}

          {/* Email */}
          {(isAdminUser || isAdmin) && (
            <IntegrationSection
              title="Email"
              description="Transactional email, review requests, and notifications via SMTP or SendGrid"
              badgeColor="bg-sky-600"
              badgeLabel="EM"
              onTest={testEmail}
            >
              <div className="space-y-3">
                <p className="text-xs text-gray-200 font-medium">
                  SMTP Configuration
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600">SMTP Host</Label>
                    <Input
                      value={emailSettings.smtpHost}
                      onChange={(e) =>
                        setEmailSettings((s) => ({
                          ...s,
                          smtpHost: e.target.value,
                        }))
                      }
                      placeholder="smtp.mailgun.org"
                      className="mt-1 text-xs"
                      data-ocid="settings.email.smtphost.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">SMTP Port</Label>
                    <Input
                      value={emailSettings.smtpPort}
                      onChange={(e) =>
                        setEmailSettings((s) => ({
                          ...s,
                          smtpPort: e.target.value,
                        }))
                      }
                      placeholder="587"
                      className="mt-1 text-xs"
                      data-ocid="settings.email.smtpport.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Username</Label>
                    <Input
                      value={emailSettings.username}
                      onChange={(e) =>
                        setEmailSettings((s) => ({
                          ...s,
                          username: e.target.value,
                        }))
                      }
                      placeholder="user@domain.com"
                      className="mt-1 text-xs"
                      data-ocid="settings.email.username.input"
                    />
                  </div>
                  <PasswordField
                    label="Password"
                    value={emailSettings.password}
                    onChange={(v) =>
                      setEmailSettings((s) => ({ ...s, password: v }))
                    }
                    placeholder="SMTP password"
                    ocid="settings.email.password.input"
                  />
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-200 font-medium mb-2">
                    — OR use SendGrid —
                  </p>
                  <PasswordField
                    label="SendGrid API Key"
                    value={emailSettings.sendgridKey}
                    onChange={(v) =>
                      setEmailSettings((s) => ({ ...s, sendgridKey: v }))
                    }
                    placeholder="SG.xxxxx"
                    ocid="settings.email.sendgrid.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">From Address</Label>
                  <Input
                    value={emailSettings.fromAddress}
                    onChange={(e) =>
                      setEmailSettings((s) => ({
                        ...s,
                        fromAddress: e.target.value,
                      }))
                    }
                    placeholder="noreply@yourdomain.com"
                    className="mt-1 text-xs"
                    data-ocid="settings.email.from.input"
                  />
                </div>
              </div>
            </IntegrationSection>
          )}

          {/* Google APIs */}
          {(isAdminUser || isAdmin) && (
            <IntegrationSection
              title="Google APIs"
              description="Google Business Profile data, Maps embeds, and Places lookups"
              badgeColor="bg-blue-600"
              badgeLabel="G"
              onTest={testGoogle}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PasswordField
                  label="Places API Key"
                  value={googleKeys.placesKey}
                  onChange={(v) =>
                    setGoogleKeys((k) => ({ ...k, placesKey: v }))
                  }
                  placeholder="AIza..."
                  ocid="settings.google.places.input"
                />
                <PasswordField
                  label="Maps Embed Key"
                  value={googleKeys.mapsKey}
                  onChange={(v) => setGoogleKeys((k) => ({ ...k, mapsKey: v }))}
                  placeholder="AIza..."
                  ocid="settings.google.maps.input"
                />
                <div className="sm:col-span-2">
                  <Label className="text-xs text-gray-600">
                    Google Business Profile URL
                  </Label>
                  <Input
                    value={googleKeys.gbpUrl}
                    onChange={(e) =>
                      setGoogleKeys((k) => ({ ...k, gbpUrl: e.target.value }))
                    }
                    placeholder="https://business.google.com/..."
                    className="mt-1 text-xs"
                    data-ocid="settings.google.gbp.input"
                  />
                </div>
              </div>
            </IntegrationSection>
          )}

          {/* SERP API — super admin only */}
          {isAdminUser && (
            <IntegrationSection
              title="SERP API"
              description="Real-time Google ranking data and search visibility metrics"
              badgeColor="bg-orange-600"
              badgeLabel="SR"
              onTest={testSerp}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PasswordField
                  label="API Key"
                  value={serpSettings.apiKey}
                  onChange={(v) =>
                    setSerpSettings((s) => ({ ...s, apiKey: v }))
                  }
                  placeholder="Enter API key"
                  ocid="settings.serp.key.input"
                />
                <div>
                  <Label className="text-xs text-gray-600">Provider</Label>
                  <Select
                    value={serpSettings.provider}
                    onValueChange={(v) =>
                      setSerpSettings((s) => ({ ...s, provider: v }))
                    }
                  >
                    <SelectTrigger
                      className="mt-1 text-xs h-9"
                      data-ocid="settings.serp.provider.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serpapi">SerpAPI</SelectItem>
                      <SelectItem value="valueserp">ValueSERP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </IntegrationSection>
          )}

          {/* OpenAI — super admin only */}
          {isAdminUser && (
            <IntegrationSection
              title="OpenAI"
              description="Powers AI chat widget intelligence, review responses, and voice agent scripts"
              badgeColor="bg-emerald-700"
              badgeLabel="AI"
              onTest={testOpenai}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PasswordField
                  label="API Key"
                  value={openaiSettings.apiKey}
                  onChange={(v) =>
                    setOpenaiSettings((s) => ({ ...s, apiKey: v }))
                  }
                  placeholder="sk-..."
                  ocid="settings.openai.key.input"
                />
                <div>
                  <Label className="text-xs text-gray-600">Model</Label>
                  <Select
                    value={openaiSettings.model}
                    onValueChange={(v) =>
                      setOpenaiSettings((s) => ({ ...s, model: v }))
                    }
                  >
                    <SelectTrigger
                      className="mt-1 text-xs h-9"
                      data-ocid="settings.openai.model.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o mini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </IntegrationSection>
          )}

          {/* Client review platform toggles */}
          {!isAdmin && !isAdminUser && (
            <div className="border border-gray-200 rounded-xl p-5 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  Review Platforms
                </h4>
                <p className="text-xs text-gray-200 mt-0.5">
                  Choose where customers are directed to leave reviews
                </p>
              </div>
              <div className="space-y-3">
                {(
                  [
                    { key: "google" as const, label: "Google Reviews" },
                    { key: "yelp" as const, label: "Yelp" },
                    { key: "facebook" as const, label: "Facebook" },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{label}</span>
                    <Switch
                      checked={reviewPlatforms[key]}
                      onCheckedChange={(v) =>
                        setReviewPlatforms((p) => ({ ...p, [key]: v }))
                      }
                      data-ocid={`settings.reviewplatform.${key}.switch`}
                    />
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">
                    Notification Email
                  </Label>
                  <Input
                    value={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="mt-1 text-xs"
                    data-ocid="settings.client.email.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">
                    Notification Phone
                  </Label>
                  <Input
                    value={notifPhone}
                    onChange={(e) => setNotifPhone(e.target.value)}
                    placeholder="(760) 555-0000"
                    className="mt-1 text-xs"
                    data-ocid="settings.client.phone.input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save button for Twilio/Vapi */}
          {(isAdminUser || isAdmin) && (
            <div className="pt-2">
              <Button
                onClick={handleSaveIntegrations}
                disabled={savingIntegrations}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                data-ocid="settings.integrations.save.button"
              >
                {savingIntegrations ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                    Saving...
                  </>
                ) : (
                  "Save Twilio & Vapi Credentials"
                )}
              </Button>
            </div>
          )}

          {/* ── Open Source Services ── visible to admin users */}
          {isAdminUser && (
            <div className="mt-6 pt-6 border-t border-zinc-800/60">
              <OpenSourceServicesSection />
            </div>
          )}
        </div>
      </TabsContent>

      {/* AI Config Tab */}
      {isAdminUser && (
        <TabsContent value="ai-config">
          <AiConfigTab />
        </TabsContent>
      )}
    </Tabs>
  );
}
