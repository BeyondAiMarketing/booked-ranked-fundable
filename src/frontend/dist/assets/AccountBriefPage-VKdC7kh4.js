import { ad as useActor, r as reactExports, j as jsxRuntimeExports, l as LoaderCircle, c2 as ClipboardList, b4 as CircleAlert, ah as CircleCheckBig, h as Save, X } from "./index-CSMRpKtY.js";
const PREDEFINED_CATEGORIES = [
  "Leads",
  "Clients",
  "Team Members",
  "Contractors",
  "Vendors"
];
const TONE_OPTIONS = [
  "Professional",
  "Friendly",
  "Direct",
  "Conversational"
];
function AccountBriefPage() {
  const { actor } = useActor();
  const [responseCategories, setResponseCategories] = reactExports.useState([]);
  const [ignoreList, setIgnoreList] = reactExports.useState([]);
  const [priorityContacts, setPriorityContacts] = reactExports.useState([]);
  const [tone, setTone] = reactExports.useState("Professional");
  const [offerSummary, setOfferSummary] = reactExports.useState("");
  const [flagKeywords, setFlagKeywords] = reactExports.useState([]);
  const [tagInputs, setTagInputs] = reactExports.useState({
    ignoreList: "",
    priorityContacts: "",
    flagKeywords: ""
  });
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(false);
  const fetchBrief = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError(null);
    try {
      const result = await actor.getAccountBrief("default");
      if ("ok" in result && result.ok) {
        const brief = result.ok;
        setResponseCategories(brief.respondTo ?? []);
        setIgnoreList(brief.ignoreList ?? []);
        setPriorityContacts(brief.priorityContacts ?? []);
        setTone(brief.tone ?? "Professional");
        setOfferSummary(brief.offerSummary ?? "");
        setFlagKeywords(brief.flagKeywords ?? []);
      } else if ("err" in result) {
        setError(result.err);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load account brief");
    } finally {
      setLoading(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    fetchBrief();
  }, [fetchBrief]);
  const handleCategoryToggle = (category) => {
    setResponseCategories(
      (prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };
  const addTag = (field, setter) => {
    const value = tagInputs[field].trim();
    if (!value) return;
    setter((prev) => prev.includes(value) ? prev : [...prev, value]);
    setTagInputs((prev) => ({ ...prev, [field]: "" }));
  };
  const removeTag = (value, setter) => {
    setter((prev) => prev.filter((t) => t !== value));
  };
  const handleTagKeyDown = (e, field, setter) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(field, setter);
    }
  };
  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        respondTo: responseCategories,
        accountId: "default",
        ignoreList,
        tone,
        offerSummary,
        doNotRespondList: [],
        updatedAt: BigInt(Date.now()),
        updatedBy: "",
        priorityContacts,
        flagKeywords,
        performanceHistory: [],
        doRules: [],
        sessionLog: [],
        differentiators: [],
        targetAudience: [],
        contentHistory: [],
        brandVoice: "",
        services: [],
        dontRules: [],
        positioning: ""
      };
      const result = await actor.saveAccountBrief(payload);
      if ("ok" in result && result.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4e3);
      } else if ("err" in result) {
        setError(result.err);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save account brief");
    } finally {
      setSaving(false);
    }
  };
  const TagChip = ({
    value,
    onRemove
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-blue-900/40 text-blue-200 px-2 py-1 rounded-lg text-sm", children: [
    value,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: onRemove,
        className: "hover:text-white transition-colors",
        "aria-label": `Remove ${value}`,
        "data-ocid": "account_brief.remove_tag_button",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
      }
    )
  ] });
  const TagInput = ({
    label,
    field,
    tags,
    setter,
    placeholder
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        htmlFor: `tag-input-${field}`,
        className: "block text-sm font-medium text-slate-300 mb-2",
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TagChip,
      {
        value: tag,
        onRemove: () => removeTag(tag, setter)
      },
      tag
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        value: tagInputs[field],
        onChange: (e) => setTagInputs((prev) => ({ ...prev, [field]: e.target.value })),
        onKeyDown: (e) => handleTagKeyDown(e, field, setter),
        placeholder,
        className: "w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
        id: `tag-input-${field}`,
        "data-ocid": `account_brief.${field}_input`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Press Enter to add" })
  ] });
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto p-6 flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 text-blue-400 animate-spin" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-5 h-5 text-indigo-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-white", children: "Account Brief" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Set AI behavior rules, priority contacts, and response preferences per account." })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/30 flex items-center gap-3 text-red-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: error })
    ] }),
    success && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/30 flex items-center gap-3 text-emerald-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Account brief saved successfully." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Response Categories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: PREDEFINED_CATEGORIES.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          className: "inline-flex items-center gap-2 cursor-pointer",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: responseCategories.includes(category),
                onChange: () => handleCategoryToggle(category),
                className: "w-4 h-4 rounded border-white/20 bg-slate-800/60 text-blue-500 focus:ring-blue-500/50",
                "data-ocid": `account_brief.category_checkbox.${category.toLowerCase().replace(/\s+/g, "_")}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-300", children: category })
          ]
        },
        category
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Ignore List" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TagInput,
        {
          label: "Domains or keywords to ignore",
          field: "ignoreList",
          tags: ignoreList,
          setter: setIgnoreList,
          placeholder: "e.g. spamdomain.com or newsletter"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Priority Contacts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TagInput,
        {
          label: "Important senders to flag",
          field: "priorityContacts",
          tags: priorityContacts,
          setter: setPriorityContacts,
          placeholder: "e.g. john@example.com or VIP Client"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Tone" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          value: tone,
          onChange: (e) => setTone(e.target.value),
          className: "w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50",
          "data-ocid": "account_brief.tone_select",
          children: TONE_OPTIONS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Offer Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: offerSummary,
          onChange: (e) => setOfferSummary(e.target.value),
          placeholder: "Describe your core offer so the AI knows what to pitch...",
          rows: 4,
          className: "w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none",
          "data-ocid": "account_brief.offer_summary_textarea"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Flag Keywords" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TagInput,
        {
          label: "Words that trigger priority alerts",
          field: "flagKeywords",
          tags: flagKeywords,
          setter: setFlagKeywords,
          placeholder: "e.g. urgent, contract, complaint"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleSave,
        disabled: saving || !actor,
        className: "inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed",
        "data-ocid": "account_brief.save_button",
        children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          "Saving..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
          "Save Changes"
        ] })
      }
    ) })
  ] });
}
export {
  AccountBriefPage as default
};
