import { Brain, Loader2, Mic, Settings, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToolkitToggles } from "../hooks/useToolkitToggles";

interface TierState {
  tier: string;
  enabled: boolean;
  isSaving: boolean;
}

interface ToolkitConfig {
  name: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tiers: TierState[];
}

const INITIAL_TOOLKITS: ToolkitConfig[] = [
  {
    name: "dograh",
    icon: <Mic className="w-5 h-5 text-violet-400" />,
    title: "Dograh Voice Agent Builder",
    description:
      "Allow accounts to create and edit AI voice agents using natural language commands",
    tiers: [
      { tier: "basic", enabled: false, isSaving: false },
      { tier: "pro", enabled: true, isSaving: false },
      { tier: "agency", enabled: true, isSaving: false },
    ],
  },
  {
    name: "composio",
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    title: "Composio Connected Tools",
    description:
      "Gmail, Google Calendar, Stripe, CompanyCam OAuth tool connections",
    tiers: [
      { tier: "basic", enabled: false, isSaving: false },
      { tier: "pro", enabled: true, isSaving: false },
      { tier: "agency", enabled: true, isSaving: false },
    ],
  },
  {
    name: "abacus",
    icon: <Brain className="w-5 h-5 text-emerald-400" />,
    title: "Abacus.AI RouteLLM",
    description:
      "Intelligent model routing — automatically selects the best AI model per task",
    tiers: [
      { tier: "basic", enabled: false, isSaving: false },
      { tier: "pro", enabled: true, isSaving: false },
      { tier: "agency", enabled: true, isSaving: false },
    ],
  },
];

export default function AdminMCPToolkitPage() {
  const {
    getToolkitToggleState,
    saveToolkitToggle,
    bulkToggleToolkits,
    isLoading,
    isReady,
  } = useToolkitToggles();

  const [toolkits, setToolkits] = useState<ToolkitConfig[]>(INITIAL_TOOLKITS);
  const loadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isReady) return;

    const loadStates = async () => {
      const toolkitNames = ["dograh", "composio", "abacus"];
      for (const name of toolkitNames) {
        if (loadedRef.current.has(name)) continue;
        try {
          const states = await getToolkitToggleState(name);
          if (states && states.length > 0) {
            setToolkits((prev) =>
              prev.map((t) => {
                if (t.name === name) {
                  return {
                    ...t,
                    tiers: t.tiers.map((tier) => {
                      const state = states.find((s) => s.tierId === tier.tier);
                      return state ? { ...tier, enabled: state.enabled } : tier;
                    }),
                  };
                }
                return t;
              }),
            );
          }
          loadedRef.current.add(name);
        } catch (err) {
          console.error(`Failed to load ${name} states:`, err);
        }
      }
    };

    loadStates();
  }, [isReady, getToolkitToggleState]);

  const handleToggle = async (
    toolkitName: string,
    tier: string,
    enabled: boolean,
  ) => {
    setToolkits((prev) =>
      prev.map((t) => {
        if (t.name === toolkitName) {
          return {
            ...t,
            tiers: t.tiers.map((tierItem) =>
              tierItem.tier === tier
                ? { ...tierItem, isSaving: true }
                : tierItem,
            ),
          };
        }
        return t;
      }),
    );

    try {
      await saveToolkitToggle(toolkitName, tier, enabled);
      setToolkits((prev) =>
        prev.map((t) => {
          if (t.name === toolkitName) {
            return {
              ...t,
              tiers: t.tiers.map((tierItem) =>
                tierItem.tier === tier
                  ? { ...tierItem, enabled, isSaving: false }
                  : tierItem,
              ),
            };
          }
          return t;
        }),
      );
    } catch (err) {
      console.error("Toggle failed:", err);
      setToolkits((prev) =>
        prev.map((t) => {
          if (t.name === toolkitName) {
            return {
              ...t,
              tiers: t.tiers.map((tierItem) =>
                tierItem.tier === tier
                  ? { ...tierItem, isSaving: false }
                  : tierItem,
              ),
            };
          }
          return t;
        }),
      );
    }
  };

  const handleBulkToggle = async (toolkitName: string) => {
    setToolkits((prev) =>
      prev.map((t) => {
        if (t.name === toolkitName) {
          return {
            ...t,
            tiers: t.tiers.map((tierItem) => ({
              ...tierItem,
              isSaving: true,
            })),
          };
        }
        return t;
      }),
    );

    try {
      await bulkToggleToolkits([toolkitName], "all", true);
      setToolkits((prev) =>
        prev.map((t) => {
          if (t.name === toolkitName) {
            return {
              ...t,
              tiers: t.tiers.map((tierItem) => ({
                ...tierItem,
                enabled: true,
                isSaving: false,
              })),
            };
          }
          return t;
        }),
      );
    } catch (err) {
      console.error("Bulk toggle failed:", err);
      setToolkits((prev) =>
        prev.map((t) => {
          if (t.name === toolkitName) {
            return {
              ...t,
              tiers: t.tiers.map((tierItem) => ({
                ...tierItem,
                isSaving: false,
              })),
            };
          }
          return t;
        }),
      );
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto" data-ocid="mcp_toolkit_admin.page">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">
            MCP Toolkit Admin
          </h1>
          <p className="text-sm text-slate-400">
            Control which AI tools and integrations are available per account
            tier
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {toolkits.map((toolkit) => (
          <div
            key={toolkit.name}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-4"
            data-ocid={`${toolkit.name}.card`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                {toolkit.icon}
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">
                  {toolkit.title}
                </h2>
                <p className="text-sm text-slate-400">{toolkit.description}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {toolkit.tiers.map((tier) => (
                <div
                  key={tier.tier}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-sm text-slate-300 capitalize">
                    {tier.tier}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleToggle(toolkit.name, tier.tier, !tier.enabled)
                    }
                    disabled={tier.isSaving || isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      tier.enabled ? "bg-violet-600" : "bg-gray-700"
                    } ${
                      tier.isSaving || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    data-ocid={`${toolkit.name}.toggle.${tier.tier}`}
                  >
                    {tier.isSaving ? (
                      <Loader2 className="absolute left-1.5 w-3 h-3 text-white animate-spin" />
                    ) : (
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          tier.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleBulkToggle(toolkit.name)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                data-ocid={`${toolkit.name}.bulk_apply_button`}
              >
                Apply to All Tiers
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
