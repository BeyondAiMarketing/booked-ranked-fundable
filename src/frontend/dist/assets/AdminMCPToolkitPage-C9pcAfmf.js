import { b1 as useActor, r as reactExports, b6 as createActor, j as jsxRuntimeExports, a_ as Settings, l as LoaderCircle, bc as Mic, af as Zap, aO as Brain } from "./index-CSMRpKtY.js";
function useToolkitToggles() {
  const { actor: _actor, isFetching } = useActor(createActor);
  const actor = _actor;
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const withLoading = reactExports.useCallback(
    async (fn) => {
      setIsLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Operation failed";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  const getToolkitToggleState = reactExports.useCallback(
    async (tierId) => {
      if (!actor) return [];
      const result = await withLoading(async () => {
        const res = await actor.getToolkitToggles(tierId);
        if (res && Array.isArray(res.ok)) {
          return res.ok.map((t) => ({
            toolkitName: t.toolkitName,
            tierId: t.tierId,
            enabled: t.enabled
          }));
        }
        return [];
      });
      return result ?? [];
    },
    [actor, withLoading]
  );
  const saveToolkitToggle = reactExports.useCallback(
    async (toolkitName, tierId, enabled) => {
      if (!actor) return null;
      return withLoading(async () => {
        const toggle = {
          toolkitName,
          tierId,
          enabled,
          appliedAt: BigInt(Date.now()) * BigInt(1e6)
        };
        const res = await actor.setToolkitToggle(toggle);
        return res;
      });
    },
    [actor, withLoading]
  );
  const bulkToggleToolkits = reactExports.useCallback(
    async (toolkitNames, tierId, enabled) => {
      if (!actor) return null;
      return withLoading(async () => {
        const req = {
          toolkitNames,
          tierId,
          enabled
        };
        const res = await actor.bulkApplyToggleToTier(req);
        return res;
      });
    },
    [actor, withLoading]
  );
  return {
    isLoading,
    error,
    isReady: !!actor && !isFetching,
    getToolkitToggleState,
    saveToolkitToggle,
    bulkToggleToolkits
  };
}
const INITIAL_TOOLKITS = [
  {
    name: "dograh",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "w-5 h-5 text-violet-400" }),
    title: "Dograh Voice Agent Builder",
    description: "Allow accounts to create and edit AI voice agents using natural language commands",
    tiers: [
      { tier: "basic", enabled: false, isSaving: false },
      { tier: "pro", enabled: true, isSaving: false },
      { tier: "agency", enabled: true, isSaving: false }
    ]
  },
  {
    name: "composio",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-amber-400" }),
    title: "Composio Connected Tools",
    description: "Gmail, Google Calendar, Stripe, CompanyCam OAuth tool connections",
    tiers: [
      { tier: "basic", enabled: false, isSaving: false },
      { tier: "pro", enabled: true, isSaving: false },
      { tier: "agency", enabled: true, isSaving: false }
    ]
  },
  {
    name: "abacus",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-5 h-5 text-emerald-400" }),
    title: "Abacus.AI RouteLLM",
    description: "Intelligent model routing — automatically selects the best AI model per task",
    tiers: [
      { tier: "basic", enabled: false, isSaving: false },
      { tier: "pro", enabled: true, isSaving: false },
      { tier: "agency", enabled: true, isSaving: false }
    ]
  }
];
function AdminMCPToolkitPage() {
  const {
    getToolkitToggleState,
    saveToolkitToggle,
    bulkToggleToolkits,
    isLoading,
    isReady
  } = useToolkitToggles();
  const [toolkits, setToolkits] = reactExports.useState(INITIAL_TOOLKITS);
  const loadedRef = reactExports.useRef(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    if (!isReady) return;
    const loadStates = async () => {
      const toolkitNames = ["dograh", "composio", "abacus"];
      for (const name of toolkitNames) {
        if (loadedRef.current.has(name)) continue;
        try {
          const states = await getToolkitToggleState(name);
          if (states && states.length > 0) {
            setToolkits(
              (prev) => prev.map((t) => {
                if (t.name === name) {
                  return {
                    ...t,
                    tiers: t.tiers.map((tier) => {
                      const state = states.find((s) => s.tierId === tier.tier);
                      return state ? { ...tier, enabled: state.enabled } : tier;
                    })
                  };
                }
                return t;
              })
            );
          }
          loadedRef.current.add(name);
        } catch {
        }
      }
    };
    loadStates();
  }, [isReady, getToolkitToggleState]);
  const handleToggle = async (toolkitName, tier, enabled) => {
    setToolkits(
      (prev) => prev.map((t) => {
        if (t.name === toolkitName) {
          return {
            ...t,
            tiers: t.tiers.map(
              (tierItem) => tierItem.tier === tier ? { ...tierItem, isSaving: true } : tierItem
            )
          };
        }
        return t;
      })
    );
    try {
      await saveToolkitToggle(toolkitName, tier, enabled);
      setToolkits(
        (prev) => prev.map((t) => {
          if (t.name === toolkitName) {
            return {
              ...t,
              tiers: t.tiers.map(
                (tierItem) => tierItem.tier === tier ? { ...tierItem, enabled, isSaving: false } : tierItem
              )
            };
          }
          return t;
        })
      );
    } catch {
      setToolkits(
        (prev) => prev.map((t) => {
          if (t.name === toolkitName) {
            return {
              ...t,
              tiers: t.tiers.map(
                (tierItem) => tierItem.tier === tier ? { ...tierItem, isSaving: false } : tierItem
              )
            };
          }
          return t;
        })
      );
    }
  };
  const handleBulkToggle = async (toolkitName) => {
    setToolkits(
      (prev) => prev.map((t) => {
        if (t.name === toolkitName) {
          return {
            ...t,
            tiers: t.tiers.map((tierItem) => ({
              ...tierItem,
              isSaving: true
            }))
          };
        }
        return t;
      })
    );
    try {
      await bulkToggleToolkits([toolkitName], "all", true);
      setToolkits(
        (prev) => prev.map((t) => {
          if (t.name === toolkitName) {
            return {
              ...t,
              tiers: t.tiers.map((tierItem) => ({
                ...tierItem,
                enabled: true,
                isSaving: false
              }))
            };
          }
          return t;
        })
      );
    } catch {
      setToolkits(
        (prev) => prev.map((t) => {
          if (t.name === toolkitName) {
            return {
              ...t,
              tiers: t.tiers.map((tierItem) => ({
                ...tierItem,
                isSaving: false
              }))
            };
          }
          return t;
        })
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-5xl mx-auto", "data-ocid": "mcp_toolkit_admin.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5 text-violet-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-white", children: "MCP Toolkit Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Control which AI tools and integrations are available per account tier" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: toolkits.map((toolkit) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-4",
        "data-ocid": `${toolkit.name}.card`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center", children: toolkit.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-white", children: toolkit.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: toolkit.description })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-2", children: toolkit.tiers.map((tier) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between py-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-300 capitalize", children: tier.tier }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleToggle(toolkit.name, tier.tier, !tier.enabled),
                    disabled: tier.isSaving || isLoading,
                    className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${tier.enabled ? "bg-violet-600" : "bg-gray-700"} ${tier.isSaving || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`,
                    "data-ocid": `${toolkit.name}.toggle.${tier.tier}`,
                    children: tier.isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "absolute left-1.5 w-3 h-3 text-white animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${tier.enabled ? "translate-x-6" : "translate-x-1"}`
                      }
                    )
                  }
                )
              ]
            },
            tier.tier
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleBulkToggle(toolkit.name),
              disabled: isLoading,
              className: "px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
              "data-ocid": `${toolkit.name}.bulk_apply_button`,
              children: "Apply to All Tiers"
            }
          ) })
        ]
      },
      toolkit.name
    )) })
  ] });
}
export {
  AdminMCPToolkitPage as default
};
