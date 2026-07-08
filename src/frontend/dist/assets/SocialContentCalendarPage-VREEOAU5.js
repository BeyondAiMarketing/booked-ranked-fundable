import { ad as useActor, r as reactExports, j as jsxRuntimeExports } from "./index-iniFfpN1.js";
import { u as useBusinessBrief } from "./useBusinessBrief-DLfXvCxj.js";
import { u as useVerticalProfile } from "./useVerticalProfile-DxvPtn-w.js";
function useContentCalendar() {
  const { actor } = useActor();
  const [calendar, setCalendar] = reactExports.useState(null);
  const [calendars, setCalendars] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const listCalendars = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listContentCalendars();
      setCalendars(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    listCalendars();
  }, [listCalendars]);
  const createCalendar = reactExports.useCallback(
    async (data) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createContentCalendar(data);
        setCalendar(result);
        await listCalendars();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listCalendars]
  );
  const updateCalendar = reactExports.useCallback(
    async (id, updates) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateContentCalendar(id, updates);
        setCalendar(result);
        await listCalendars();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listCalendars]
  );
  const addEntry = reactExports.useCallback(
    async (calendarId, entry) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.addCalendarEntry(calendarId, entry);
        setCalendar(result);
        await listCalendars();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listCalendars]
  );
  const updateEntryStatus = reactExports.useCallback(
    async (calendarId, entryId, status) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateCalendarEntryStatus(
          calendarId,
          entryId,
          status
        );
        setCalendar(result);
        await listCalendars();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listCalendars]
  );
  return {
    calendar,
    calendars,
    loading,
    error,
    createCalendar,
    updateCalendar,
    addEntry,
    updateEntryStatus,
    listCalendars
  };
}
function SocialContentCalendarPage() {
  const { calendars, addEntry } = useContentCalendar();
  useContentCalendar();
  const { brief } = useBusinessBrief();
  const { profile } = useVerticalProfile();
  const [month, setMonth] = reactExports.useState((/* @__PURE__ */ new Date()).getMonth() + 1);
  const [year, setYear] = reactExports.useState((/* @__PURE__ */ new Date()).getFullYear());
  const [showForm, setShowForm] = reactExports.useState(false);
  const [newEntry, setNewEntry] = reactExports.useState({});
  const hasContext = (brief == null ? void 0 : brief.brandVoice) && profile;
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
  const handleAddEntry = async () => {
    if (newEntry.day && newEntry.platform) {
      await addEntry("current-calendar", newEntry);
      setShowForm(false);
      setNewEntry({});
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-[hsl(232_40%_22%)] text-white p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2", children: "Social Content Calendar Agent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-6", children: "Create 30-day calendar using VerticalProfile" }),
    !hasContext && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-orange-900/50 border border-orange-500 rounded-lg p-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-orange-200 font-semibold", children: "Missing Context" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-orange-300 text-sm", children: "Complete brand onboarding first before creating content calendars." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          value: month,
          onChange: (e) => setMonth(Number(e.target.value)),
          className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2",
          children: Array.from({ length: 12 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i + 1, children: new Date(2e3, i).toLocaleString("default", { month: "long" }) }, `month-${i}-${i + 1}`))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          value: year,
          onChange: (e) => setYear(Number(e.target.value)),
          className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2",
          children: [2024, 2025, 2026].map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, children: y }, y))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setShowForm(true),
          disabled: !hasContext,
          className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg",
          children: "Add Entry"
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4", children: "New Calendar Entry" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            placeholder: "Day",
            min: 1,
            max: 31,
            onChange: (e) => setNewEntry((prev) => ({
              ...prev,
              day: Number(e.target.value)
            })),
            className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            onChange: (e) => setNewEntry((prev) => ({
              ...prev,
              platform: e.target.value
            })),
            className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Platform" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "facebook", children: "Facebook" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "instagram", children: "Instagram" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "linkedin", children: "LinkedIn" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "x", children: "X" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "threads", children: "Threads" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "tiktok", children: "TikTok" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "googleBusinessProfile", children: "Google Business Profile" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Pillar",
            onChange: (e) => setNewEntry((prev) => ({ ...prev, pillar: e.target.value })),
            className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Format",
            onChange: (e) => setNewEntry((prev) => ({ ...prev, format: e.target.value })),
            className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Objective",
            onChange: (e) => setNewEntry((prev) => ({
              ...prev,
              objective: e.target.value
            })),
            className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Topic",
            onChange: (e) => setNewEntry((prev) => ({ ...prev, topic: e.target.value })),
            className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Angle",
            onChange: (e) => setNewEntry((prev) => ({ ...prev, angle: e.target.value })),
            className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Visual Direction",
            onChange: (e) => setNewEntry((prev) => ({
              ...prev,
              visualDirection: e.target.value
            })),
            className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "CTA",
            onChange: (e) => setNewEntry((prev) => ({ ...prev, cta: e.target.value })),
            className: "bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 col-span-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleAddEntry,
            className: "px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg",
            children: "Save Entry"
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-2", children: Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      const entries = (calendars == null ? void 0 : calendars.flatMap((c) => c.entries).filter((e) => e.day === day)) || [];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-gray-800 rounded-lg p-3 min-h-[120px]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-400 mb-2", children: day }),
            entries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-gray-700 rounded p-2 mb-1 text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: entry.platform }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `w-2 h-2 rounded-full ${getStatusColor(entry.approvalStatus)}`
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400", children: entry.topic })
                ]
              },
              `entry-${entry.day}-${entry.platform}-${idx}`
            ))
          ]
        },
        day
      );
    }) })
  ] }) });
}
export {
  SocialContentCalendarPage as default
};
