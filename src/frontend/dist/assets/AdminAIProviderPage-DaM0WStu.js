import { c as createLucideIcon, j as jsxRuntimeExports, as as Badge, aO as Brain, aA as CircleCheck, ak as CircleX, i as Clock, r as reactExports, l as LoaderCircle, at as Card, aq as ShieldCheck, I as Input, aP as EyeOff, E as Eye, B as Button, h as Save, af as Zap, al as RefreshCw, aQ as ue } from "./index-CSMRpKtY.js";
import { u as useRagBrain } from "./useRagBrain-C5N1Kkvl.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M17 12h-2l-2 5-2-10-2 5H7", key: "15hlnc" }]
];
const SquareActivity = createLucideIcon("square-activity", __iconNode);
function AIProviderStatusBadge({
  config,
  size = "md"
}) {
  const status = config.lastPingStatus;
  const icon = status === "ok" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }) : status === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" });
  const colorClass = status === "ok" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : status === "error" ? "border-rose-500/30 bg-rose-500/10 text-rose-400" : "border-amber-500/30 bg-amber-500/10 text-amber-400";
  const label = status === "ok" ? "Active" : status === "error" ? "Error" : "Untested";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: `flex items-center gap-1 font-mono ${size === "sm" ? "text-xs" : "text-sm"} ${colorClass}`,
      children: [
        !config.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-3 w-3 text-muted-foreground opacity-50" }),
        config.isActive && icon,
        label
      ]
    }
  );
}
const PROVIDER_META = {
  NVIDIA: {
    label: "NVIDIA NIM",
    description: "Primary AI provider. Powers RAG, embeddings, and reranking.",
    color: "text-emerald-400",
    icon: "🟢"
  },
  OpenAI: {
    label: "OpenAI",
    description: "Fallback provider for completions and embeddings.",
    color: "text-sky-400",
    icon: "🔵"
  },
  Claude: {
    label: "Anthropic Claude",
    description: "Secondary fallback for complex reasoning tasks.",
    color: "text-violet-400",
    icon: "🟣"
  },
  Cached: {
    label: "Cached Results",
    description: "Returns pre-cached responses when live providers are offline.",
    color: "text-amber-400",
    icon: "🟡"
  }
};
function AdminAIProviderPage() {
  const { getProviderConfigs, saveProviderConfig, pingProvider, isLoading } = useRagBrain();
  const [providers, setProviders] = reactExports.useState([]);
  const [apiKeys, setApiKeys] = reactExports.useState({});
  const [showKeys, setShowKeys] = reactExports.useState({});
  const [pinging, setPinging] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState({});
  const load = reactExports.useCallback(async () => {
    const configs = await getProviderConfigs();
    if (configs) setProviders(configs);
  }, [getProviderConfigs]);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const activeCount = providers.filter((p) => p.isActive).length;
  const readinessScore = providers.length > 0 ? Math.round(activeCount / providers.length * 100) : 0;
  const handleSave = async (p) => {
    setSaving((s) => ({ ...s, [p.providerType]: true }));
    const updated = {
      ...p,
      apiKeyObfuscated: apiKeys[p.providerType] ?? p.apiKeyObfuscated
    };
    await saveProviderConfig(updated);
    setSaving((s) => ({ ...s, [p.providerType]: false }));
    ue.success(`${PROVIDER_META[p.providerType].label} saved`);
    load();
  };
  const handlePing = async (type) => {
    setPinging((s) => ({ ...s, [type]: true }));
    const result = await pingProvider(type);
    setPinging((s) => ({ ...s, [type]: false }));
    if (result) {
      ue.success(`Ping OK — ${PROVIDER_META[type].label} is reachable`);
    } else {
      ue.error(`Ping failed — ${PROVIDER_META[type].label} unreachable`);
    }
    load();
  };
  const handleToggle = async (p) => {
    const updated = { ...p, isActive: !p.isActive };
    await saveProviderConfig(updated);
    ue.success(
      `${PROVIDER_META[p.providerType].label} ${updated.isActive ? "activated" : "deactivated"}`
    );
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex h-10 w-10 items-center justify-center rounded-xl",
            style: {
              background: "linear-gradient(135deg, oklch(0.48 0.2 260 / 30%), oklch(0.62 0.2 200 / 20%))",
              boxShadow: "0 0 20px oklch(0.62 0.2 200 / 40%)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5 text-[oklch(0.62_0.2_200)]" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "AI Provider Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configure NVIDIA NIM and fallback AI providers" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl border border-border/50 p-4 backdrop-blur-sm",
          style: {
            background: "linear-gradient(135deg, oklch(0.48 0.2 260 / 10%), oklch(0.16 0.014 280))"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquareActivity, { className: "h-4 w-4 text-[oklch(0.62_0.2_200)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "AI Readiness" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-bold tabular-nums text-foreground", children: readinessScore }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 text-lg text-muted-foreground", children: "%" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full bg-gradient-to-r from-[oklch(0.48_0.2_260)] to-[oklch(0.62_0.2_200)] transition-all duration-700",
                style: { width: `${readinessScore}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
              activeCount,
              " of ",
              providers.length,
              " providers active"
            ] })
          ]
        }
      )
    ] }) }),
    isLoading && providers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 md:grid-cols-2", children: providers.map((p) => {
      const meta = PROVIDER_META[p.providerType];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "relative overflow-hidden border border-border/60 bg-card/80 p-6 backdrop-blur-sm",
          "data-ocid": `ai-provider.${p.providerType.toLowerCase()}_card`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-x-0 top-0 h-px",
                style: {
                  background: "linear-gradient(90deg, transparent, oklch(0.62 0.2 200 / 60%), transparent)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: meta.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: meta.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: meta.description })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AIProviderStatusBadge, { config: p }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleToggle(p),
                    className: `relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${p.isActive ? "bg-primary" : "bg-muted"}`,
                    "aria-label": "Toggle provider",
                    "data-ocid": `ai-provider.${p.providerType.toLowerCase()}_toggle`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${p.isActive ? "translate-x-5" : "translate-x-0.5"}`
                      }
                    )
                  }
                )
              ] })
            ] }),
            p.modelName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: "Model:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-mono text-xs", children: p.modelName })
            ] }),
            p.providerType !== "Cached" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: `provider-api-key-${p.providerType}`,
                  className: "text-xs font-medium text-muted-foreground",
                  children: "API Key"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: `provider-api-key-${p.providerType}`,
                    type: showKeys[p.providerType] ? "text" : "password",
                    value: apiKeys[p.providerType] ?? p.apiKeyObfuscated,
                    onChange: (e) => setApiKeys((k) => ({
                      ...k,
                      [p.providerType]: e.target.value
                    })),
                    placeholder: "Enter API key...",
                    className: "pr-9 font-mono text-sm",
                    "data-ocid": `ai-provider.${p.providerType.toLowerCase()}_key_input`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowKeys((s) => ({
                      ...s,
                      [p.providerType]: !s[p.providerType]
                    })),
                    className: "absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground",
                    "aria-label": "Toggle key visibility",
                    children: showKeys[p.providerType] ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                  }
                )
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              p.providerType !== "Cached" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => handleSave(p),
                  disabled: saving[p.providerType],
                  className: "gap-1.5",
                  "data-ocid": `ai-provider.${p.providerType.toLowerCase()}_save_button`,
                  children: [
                    saving[p.providerType] ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
                    "Save"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => handlePing(p.providerType),
                  disabled: pinging[p.providerType] || !p.isActive,
                  className: "gap-1.5",
                  "data-ocid": `ai-provider.${p.providerType.toLowerCase()}_ping_button`,
                  children: [
                    pinging[p.providerType] ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
                    "Test Ping"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: load,
                  className: "ml-auto",
                  "aria-label": "Refresh",
                  "data-ocid": "ai-provider.refresh_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" })
                }
              )
            ] }),
            p.lastPingTimestamp && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-right text-xs text-muted-foreground", children: [
              "Last tested:",
              " ",
              new Date(
                Number(p.lastPingTimestamp) / 1e6
              ).toLocaleString()
            ] }),
            p.lastPingStatus === "ok" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1.5 text-xs text-emerald-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
              "Connection verified"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-md bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground", children: [
              p.providerType === "OpenAI" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Endpoint:" }),
                " ",
                "https://api.openai.com/v1/chat/completions",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Auth:" }),
                " ",
                "Authorization: Bearer YOUR_KEY"
              ] }),
              p.providerType === "Claude" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Endpoint:" }),
                " ",
                "https://api.anthropic.com/v1/messages",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Auth:" }),
                " ",
                "x-api-key: YOUR_KEY + anthropic-version: 2023-06-01"
              ] }),
              p.providerType === "NVIDIA" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Endpoint:" }),
                " ",
                "https://integrate.api.nvidia.com/v1/chat/completions",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Auth:" }),
                " ",
                "Authorization: Bearer YOUR_KEY"
              ] }),
              p.providerType === "Cached" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Mode:" }),
                " ",
                "Returns pre-cached responses when live providers are offline. No API key required."
              ] })
            ] })
          ]
        },
        p.providerType
      );
    }) })
  ] });
}
export {
  AdminAIProviderPage as default
};
