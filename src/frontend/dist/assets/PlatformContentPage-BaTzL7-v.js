import { af as useActor, r as reactExports, j as jsxRuntimeExports } from "./index-CHgLG-xR.js";
function useSocialPostDraft() {
  const { actor } = useActor();
  const [drafts, setDrafts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const listDrafts = reactExports.useCallback(
    async (platform) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.listSocialPostDrafts();
        const all = result;
        setDrafts(platform ? all.filter((d) => d.platform === platform) : all);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  reactExports.useEffect(() => {
    listDrafts();
  }, [listDrafts]);
  const createDraft = reactExports.useCallback(
    async (data) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createSocialPostDraft(data);
        setDrafts((prev) => [result, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const updateDraft = reactExports.useCallback(
    async (id, updates) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateSocialPostDraft(id, updates);
        setDrafts(
          (prev) => prev.map((d) => d.id === id ? result : d)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const deleteDraft = reactExports.useCallback(
    async (id) => {
      if (!actor) return;
      setLoading(true);
      try {
        await actor.deleteSocialPostDraft(id);
        setDrafts((prev) => prev.filter((d) => d.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const submitForApproval = reactExports.useCallback(
    async (id) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.submitDraftForApproval(id);
        setDrafts(
          (prev) => prev.map((d) => d.id === id ? result : d)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const updateApprovalStatus = reactExports.useCallback(
    async (id, status) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateDraftApprovalStatus(id, status);
        setDrafts(
          (prev) => prev.map((d) => d.id === id ? result : d)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  return {
    drafts,
    loading,
    error,
    createDraft,
    updateDraft,
    deleteDraft,
    submitForApproval,
    updateApprovalStatus,
    listDrafts
  };
}
const PLATFORMS = [
  {
    key: "facebook",
    label: "Facebook",
    hint: "Community-focused, medium length"
  },
  {
    key: "instagram",
    label: "Instagram",
    hint: "Visual-first, 20-30 hashtags"
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    hint: "Professional tone, longer form"
  },
  { key: "x", label: "X", hint: "Concise, under 280 chars" },
  { key: "threads", label: "Threads", hint: "Conversational, thread-friendly" },
  { key: "tiktok", label: "TikTok", hint: "Trendy, hook in first 3 seconds" },
  {
    key: "googleBusinessProfile",
    label: "Google Business",
    hint: "Local SEO, include keywords"
  }
];
function PlatformContentPage() {
  var _a, _b, _c;
  const {
    drafts,
    createDraft,
    submitForApproval
    // updateApprovalStatus is available for future use
    // loading is available for future use
  } = useSocialPostDraft();
  const [activePlatform, setActivePlatform] = reactExports.useState("linkedin");
  const [showForm, setShowForm] = reactExports.useState(false);
  const [newDraft, setNewDraft] = reactExports.useState({
    hook: "",
    body: "",
    cta: "",
    hashtags: "",
    postType: "update"
  });
  const platformDrafts = (drafts == null ? void 0 : drafts.filter((d) => d.platform === activePlatform)) || [];
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending_review":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      case "needs_revision":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };
  const handleCreateDraft = async () => {
    await createDraft({
      platform: activePlatform,
      postType: newDraft.postType,
      title: newDraft.hook,
      hook: newDraft.hook,
      body: newDraft.body,
      cta: newDraft.cta,
      approvalStatus: "draft",
      clientBusinessId: "",
      verticalProfileId: ""
    });
    setShowForm(false);
    setNewDraft({
      hook: "",
      body: "",
      cta: "",
      hashtags: "",
      postType: "update"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-[hsl(232_40%_22%)] text-white p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2", children: "Platform Content Agent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-6", children: "Adapt posts for Facebook, Instagram, LinkedIn, X, Threads, TikTok, GBP" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-6 overflow-x-auto", children: PLATFORMS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setActivePlatform(p.key),
        className: `px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activePlatform === p.key ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`,
        children: p.label
      },
      p.key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-blue-200 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
        "Tip for ",
        (_a = PLATFORMS.find((p) => p.key === activePlatform)) == null ? void 0 : _a.label,
        ":"
      ] }),
      " ",
      (_b = PLATFORMS.find((p) => p.key === activePlatform)) == null ? void 0 : _b.hint
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setShowForm(true),
        className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg mb-6",
        children: "Create Draft"
      }
    ),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold mb-4", children: [
        "New ",
        (_c = PLATFORMS.find((p) => p.key === activePlatform)) == null ? void 0 : _c.label,
        " Draft"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: newDraft.postType,
            onChange: (e) => setNewDraft((prev) => ({
              ...prev,
              postType: e.target.value
            })),
            className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "update", children: "Update" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "offer", children: "Offer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "event", children: "Event" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "serviceHighlight", children: "Service Highlight" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "seasonal", children: "Seasonal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "customerStory", children: "Customer Story" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "educational", children: "Educational" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "community", children: "Community" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "faq", children: "FAQ" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "reviewHighlight", children: "Review Highlight" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Hook",
            value: newDraft.hook,
            onChange: (e) => setNewDraft((prev) => ({ ...prev, hook: e.target.value })),
            className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            placeholder: "Body",
            value: newDraft.body,
            onChange: (e) => setNewDraft((prev) => ({ ...prev, body: e.target.value })),
            className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-24"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "CTA",
            value: newDraft.cta,
            onChange: (e) => setNewDraft((prev) => ({ ...prev, cta: e.target.value })),
            className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Hashtags (comma-separated)",
            value: newDraft.hashtags,
            onChange: (e) => setNewDraft((prev) => ({ ...prev, hashtags: e.target.value })),
            className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleCreateDraft,
            className: "px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg",
            children: "Save Draft"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowForm(false),
            className: "px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg",
            children: "Cancel"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [
      platformDrafts.map((draft, idx) => {
        var _a2;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-gray-800 rounded-lg p-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-400 capitalize", children: draft.postType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `px-2 py-1 rounded text-xs ${getStatusColor(draft.approvalStatus)} bg-opacity-20`,
                    children: draft.approvalStatus
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-2", children: draft.hook }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm mb-3", children: draft.body }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-blue-400 mb-3", children: draft.cta }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mb-3", children: (_a2 = draft.hashtags) == null ? void 0 : _a2.map((tag, _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500", children: [
                "#",
                tag
              ] }, `tag-${tag}`)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: draft.approvalStatus === "draft" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => submitForApproval(draft.id),
                  className: "px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm",
                  children: "Submit for Approval"
                }
              ) })
            ]
          },
          `draft-${draft.id || idx}`
        );
      }),
      platformDrafts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full text-center text-gray-500 py-8", children: "No drafts for this platform yet" })
    ] })
  ] }) });
}
export {
  PlatformContentPage as default
};
