import { c as createLucideIcon, af as useActor, bC as useApp, r as reactExports, j as jsxRuntimeExports, ay as Skeleton, c3 as WandSparkles, bj as Tabs, bk as TabsList, bl as TabsTrigger, bK as Image, c4 as Megaphone, aW as BookOpen, bm as TabsContent, L as Label, g as Textarea, I as Input, B as Button, l as LoaderCircle, ac as ExternalLink, aS as ue, _ as Select, $ as SelectTrigger, a0 as SelectValue, a1 as SelectContent, a2 as SelectItem, p as Copy, al as Download, au as Badge, c5 as GenerationStatus, aj as CircleCheckBig, q as Trash2 } from "./index-CHgLG-xR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
];
const Film = createLucideIcon("film", __iconNode);
function useStreamText(target, enabled) {
  const [displayed, setDisplayed] = reactExports.useState("");
  const idxRef = reactExports.useRef(0);
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!enabled || !target) return;
    idxRef.current = 0;
    setDisplayed("");
    intervalRef.current = setInterval(() => {
      idxRef.current++;
      setDisplayed(target.slice(0, idxRef.current));
      if (idxRef.current >= target.length && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 30);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [target, enabled]);
  return displayed;
}
function formatTimestamp(ns) {
  const ms = Number(ns / 1000000n);
  return new Date(ms).toLocaleString();
}
function HistoryItem({
  item,
  onDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-3",
      "data-ocid": "content_history.item",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "border-white/20 text-xs text-white/60",
                children: item.niche || "general"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/40", children: formatTimestamp(item.generatedAt) }),
            item.status === GenerationStatus.Complete ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 text-emerald-400" }) : item.status === GenerationStatus.Failed ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-rose-400", children: "Error" }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm text-white/70", children: item.prompt }),
          item.output && item.output.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-xs text-white/50", children: item.output[0] }),
          item.mediaUrl && item.mediaUrl.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: item.mediaUrl[0],
              target: "_blank",
              rel: "noreferrer",
              className: "mt-1 flex items-center gap-1 text-xs text-cyan-400 hover:underline",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" }),
                " View Media"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "icon",
            variant: "ghost",
            className: "h-7 w-7 shrink-0 text-white/40 hover:text-rose-400",
            onClick: () => onDelete(item.id),
            "data-ocid": "content_history.delete_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
          }
        )
      ]
    }
  );
}
function VideoTab() {
  const { actor } = useActor();
  const [prompt, setPrompt] = reactExports.useState("");
  const [niche, setNiche] = reactExports.useState("roofing");
  const [loading, setLoading] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!actor) return;
    actor.getGeneratedContent({ Video: null }).then((r) => setHistory(r)).catch(() => {
    });
  }, [actor]);
  const generate = async () => {
    if (!actor || !prompt.trim()) return;
    setLoading(true);
    try {
      const r = await actor.generateContent({
        accountId: "current",
        contentType: { Video: null },
        prompt: prompt.trim(),
        niche,
        additionalContext: []
      });
      setResult(r);
      const updated = await actor.getGeneratedContent({ Video: null });
      setHistory(updated);
    } catch (_e) {
      ue.error(
        "Video generation failed. Check your OpenRouter key in Go Live."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!actor) return;
    await actor.deleteGeneratedContent(id).catch(() => {
    });
    setHistory((h) => h.filter((x) => x.id !== id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-4 flex items-center gap-2 font-semibold text-cyan-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-5 w-5" }),
        " AI Video Creator"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1.5 block text-white/70", children: "Script / Prompt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              placeholder: "Describe the video you want: story, message, style...",
              className: "min-h-[100px] border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-cyan-500/50",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              "data-ocid": "content_video.textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1.5 block text-white/70", children: "Niche" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "e.g. roofing, HVAC, landscaping",
              className: "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-cyan-500/50",
              value: niche,
              onChange: (e) => setNiche(e.target.value),
              "data-ocid": "content_video.niche_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            disabled: loading || !prompt.trim(),
            onClick: generate,
            className: "bg-cyan-600 text-white hover:bg-cyan-500",
            "data-ocid": "content_video.generate_button",
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Generating video..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "mr-2 h-4 w-4" }),
              " Generate Video"
            ] })
          }
        )
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4",
        "data-ocid": "content_video.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-cyan-300", children: "Generating video via Owl Alpha…" })
        ]
      }
    ),
    result && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4",
        "data-ocid": "content_video.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-sm font-medium text-cyan-300", children: "Result" }),
          result.mediaUrl && result.mediaUrl.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: result.mediaUrl[0],
              target: "_blank",
              rel: "noreferrer",
              className: "inline-flex items-center gap-1 text-sm text-cyan-400 hover:underline",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" }),
                " Open Video"
              ]
            }
          ) : result.output && result.output.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-sm text-white/80", children: result.output[0] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/50", children: "Processing — check back shortly." })
        ]
      }
    ),
    history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-sm font-medium text-white/60", children: "History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "content_video.list", children: history.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryItem, { item, onDelete: handleDelete }, item.id)) })
    ] })
  ] });
}
function ImagesTab() {
  const { actor } = useActor();
  const [prompt, setPrompt] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!actor) return;
    actor.getGeneratedContent({ Image: null }).then((r) => setHistory(r)).catch(() => {
    });
  }, [actor]);
  const generate = async () => {
    if (!actor || !prompt.trim()) return;
    setLoading(true);
    try {
      const r = await actor.generateContent({
        accountId: "current",
        contentType: { Image: null },
        prompt: prompt.trim(),
        niche: "general",
        additionalContext: []
      });
      setResult(r);
      const updated = await actor.getGeneratedContent({ Image: null });
      setHistory(updated);
    } catch {
      ue.error(
        "Image generation failed. Check your OpenRouter key in Go Live."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!actor) return;
    await actor.deleteGeneratedContent(id).catch(() => {
    });
    setHistory((h) => h.filter((x) => x.id !== id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-500/20 bg-amber-500/5 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-4 flex items-center gap-2 font-semibold text-amber-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5" }),
        " AI Image Generator"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1.5 block text-white/70", children: "Prompt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              placeholder: "Describe the image: style, subject, mood, brand colors...",
              className: "min-h-[90px] border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-amber-500/50",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              "data-ocid": "content_image.textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            disabled: loading || !prompt.trim(),
            onClick: generate,
            className: "bg-amber-600 text-white hover:bg-amber-500",
            "data-ocid": "content_image.generate_button",
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Generating image..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "mr-2 h-4 w-4" }),
              " Generate Image"
            ] })
          }
        )
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4",
        "data-ocid": "content_image.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-amber-300", children: "Generating image via Flux 2 Pro / Gemini Image…" })
        ]
      }
    ),
    result && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-amber-500/30 bg-amber-500/5 p-4",
        "data-ocid": "content_image.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-sm font-medium text-amber-300", children: "Result" }),
          result.mediaUrl && result.mediaUrl.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: result.mediaUrl[0],
              alt: "Generated",
              className: "max-h-64 w-full rounded-lg object-contain"
            }
          ) : result.output && result.output.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/80", children: result.output[0] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/50", children: "Processing — check back shortly." })
        ]
      }
    ),
    history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-sm font-medium text-white/60", children: "History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
          "data-ocid": "content_image.list",
          children: history.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryItem, { item, onDelete: handleDelete }, item.id))
        }
      )
    ] })
  ] });
}
const AD_FRAMEWORKS = [
  { value: "Brunson", label: "Russell Brunson — Hook/Story/Offer" },
  { value: "Hormozi", label: "Alex Hormozi — Grand Slam Offer" },
  { value: "Kennedy", label: "Dan Kennedy — Direct Response" },
  { value: "Halbert", label: "Gary Halbert — Power Copy" }
];
const AD_TYPES = [
  "Facebook Ad",
  "Google Search Ad",
  "Instagram Ad",
  "YouTube Pre-roll",
  "Email Subject Line",
  "SMS Blast",
  "Landing Page Headline"
];
function AdCopyTab() {
  const { actor } = useActor();
  const [prompt, setPrompt] = reactExports.useState("");
  const [framework, setFramework] = reactExports.useState("Brunson");
  const [adType, setAdType] = reactExports.useState("Facebook Ad");
  const [loading, setLoading] = reactExports.useState(false);
  const [rawOutput, setRawOutput] = reactExports.useState("");
  const [streaming, setStreaming] = reactExports.useState(false);
  const [history, setHistory] = reactExports.useState([]);
  const streamText = useStreamText(rawOutput, streaming);
  reactExports.useEffect(() => {
    if (!actor) return;
    actor.getGeneratedContent({ AdCopy: null }).then((r) => setHistory(r)).catch(() => {
    });
  }, [actor]);
  const generate = async () => {
    var _a;
    if (!actor || !prompt.trim()) return;
    setLoading(true);
    setRawOutput("");
    setStreaming(false);
    try {
      const r = await actor.generateContent({
        accountId: "current",
        contentType: { AdCopy: null },
        prompt: `[Framework: ${framework}] [Type: ${adType}] ${prompt.trim()}`,
        niche: "roofing",
        additionalContext: []
      });
      const res = r;
      const text = ((_a = res.output) == null ? void 0 : _a[0]) ?? "";
      setRawOutput(text);
      setStreaming(true);
      const updated = await actor.getGeneratedContent({ AdCopy: null });
      setHistory(updated);
    } catch {
      ue.error(
        "Ad copy generation failed. Check your OpenRouter key in Go Live."
      );
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = reactExports.useCallback(() => {
    navigator.clipboard.writeText(rawOutput);
    ue.success("Copied to clipboard!");
  }, [rawOutput]);
  const handleDelete = async (id) => {
    if (!actor) return;
    await actor.deleteGeneratedContent(id).catch(() => {
    });
    setHistory((h) => h.filter((x) => x.id !== id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-purple-500/20 bg-purple-500/5 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-4 flex items-center gap-2 font-semibold text-purple-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-5 w-5" }),
        " AI Ad Copy Engine"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1.5 block text-white/70", children: "Product / Offer Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              placeholder: "Describe your product, offer, or service...",
              className: "min-h-[90px] border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-purple-500/50",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              "data-ocid": "content_adcopy.textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1.5 block text-white/70", children: "Framework" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: framework, onValueChange: setFramework, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "border-white/10 bg-white/5 text-white",
                  "data-ocid": "content_adcopy.framework_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "border-white/10 bg-slate-900 text-white", children: AD_FRAMEWORKS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f.value, children: f.label }, f.value)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1.5 block text-white/70", children: "Ad Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: adType, onValueChange: setAdType, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "border-white/10 bg-white/5 text-white",
                  "data-ocid": "content_adcopy.type_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "border-white/10 bg-slate-900 text-white", children: AD_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            disabled: loading || !prompt.trim(),
            onClick: generate,
            className: "bg-purple-600 text-white hover:bg-purple-500",
            "data-ocid": "content_adcopy.generate_button",
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Generating..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "mr-2 h-4 w-4" }),
              " Generate Copy"
            ] })
          }
        )
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 rounded-lg border border-purple-500/20 bg-purple-500/5 p-4",
        "data-ocid": "content_adcopy.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-purple-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-purple-300", children: "Writing copy with Owl Alpha…" })
        ]
      }
    ),
    streamText && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-purple-500/30 bg-purple-500/5 p-4",
        "data-ocid": "content_adcopy.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-purple-300", children: "Generated Copy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                className: "h-7 gap-1.5 text-xs text-white/60 hover:text-white",
                onClick: copyToClipboard,
                "data-ocid": "content_adcopy.copy_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }),
                  " Copy"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/85", children: streamText })
        ]
      }
    ),
    history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-sm font-medium text-white/60", children: "History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "content_adcopy.list", children: history.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryItem, { item, onDelete: handleDelete }, item.id)) })
    ] })
  ] });
}
const BLOG_TONES = [
  "Professional",
  "Conversational",
  "Authoritative",
  "Educational",
  "Persuasive",
  "Storytelling"
];
function BlogTab() {
  const { actor } = useActor();
  const [topic, setTopic] = reactExports.useState("");
  const [tone, setTone] = reactExports.useState("Professional");
  const [loading, setLoading] = reactExports.useState(false);
  const [rawOutput, setRawOutput] = reactExports.useState("");
  const [streaming, setStreaming] = reactExports.useState(false);
  const [history, setHistory] = reactExports.useState([]);
  const streamText = useStreamText(rawOutput, streaming);
  reactExports.useEffect(() => {
    if (!actor) return;
    actor.getGeneratedContent({ Blog: null }).then((r) => setHistory(r)).catch(() => {
    });
  }, [actor]);
  const generate = async () => {
    var _a;
    if (!actor || !topic.trim()) return;
    setLoading(true);
    setRawOutput("");
    setStreaming(false);
    try {
      const r = await actor.generateContent({
        accountId: "current",
        contentType: { Blog: null },
        prompt: `[Tone: ${tone}] Write a compelling blog post about: ${topic.trim()}`,
        niche: "roofing",
        additionalContext: []
      });
      const res = r;
      const text = ((_a = res.output) == null ? void 0 : _a[0]) ?? "";
      setRawOutput(text);
      setStreaming(true);
      const updated = await actor.getGeneratedContent({ Blog: null });
      setHistory(updated);
    } catch {
      ue.error(
        "Blog generation failed. Check your OpenRouter key in Go Live."
      );
    } finally {
      setLoading(false);
    }
  };
  const downloadMarkdown = reactExports.useCallback(() => {
    const blob = new Blob([rawOutput], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rawOutput]);
  const handleDelete = async (id) => {
    if (!actor) return;
    await actor.deleteGeneratedContent(id).catch(() => {
    });
    setHistory((h) => h.filter((x) => x.id !== id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-4 flex items-center gap-2 font-semibold text-emerald-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5" }),
        " AI Blog & Long-Form Writer"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1.5 block text-white/70", children: "Topic / Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "e.g. How to know if your roof needs replacing in 2026",
              className: "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-emerald-500/50",
              value: topic,
              onChange: (e) => setTopic(e.target.value),
              "data-ocid": "content_blog.topic_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1.5 block text-white/70", children: "Tone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: tone, onValueChange: setTone, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "border-white/10 bg-white/5 text-white",
                "data-ocid": "content_blog.tone_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "border-white/10 bg-slate-900 text-white", children: BLOG_TONES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            disabled: loading || !topic.trim(),
            onClick: generate,
            className: "bg-emerald-600 text-white hover:bg-emerald-500",
            "data-ocid": "content_blog.generate_button",
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Generating blog post..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "mr-2 h-4 w-4" }),
              " Generate Blog Post"
            ] })
          }
        )
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4",
        "data-ocid": "content_blog.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-emerald-300", children: "Writing with Owl Alpha…" })
        ]
      }
    ),
    streamText && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4",
        "data-ocid": "content_blog.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-emerald-300", children: "Generated Post" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                className: "h-7 gap-1.5 text-xs text-white/60 hover:text-white",
                onClick: downloadMarkdown,
                disabled: !rawOutput,
                "data-ocid": "content_blog.download_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3" }),
                  " Download .md"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "max-h-96 overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/85", children: streamText })
        ]
      }
    ),
    history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-sm font-medium text-white/60", children: "History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "content_blog.list", children: history.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryItem, { item, onDelete: handleDelete }, item.id)) })
    ] })
  ] });
}
function ContentCreationStudioPage() {
  const { actor } = useActor();
  const { isSuperAdmin } = useApp();
  const [enabled, setEnabled] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!actor) return;
    const tier = isSuperAdmin ? "admin" : "pro";
    actor.isContentEnabledForTier(tier).then((r) => setEnabled(r)).catch(() => setEnabled(true));
  }, [actor, isSuperAdmin]);
  if (enabled === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" })
    ] });
  }
  if (!enabled) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mx-auto max-w-4xl space-y-6 p-6",
      "data-ocid": "content_studio.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-white", children: "Content Creation Studio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/50", children: "Powered by Owl Alpha via OpenRouter" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "video", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-5 grid w-full grid-cols-4 border border-white/10 bg-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "video",
                className: "gap-1.5 data-[state=active]:bg-cyan-600 data-[state=active]:text-white",
                "data-ocid": "content_studio.video_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Video" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "images",
                className: "gap-1.5 data-[state=active]:bg-amber-600 data-[state=active]:text-white",
                "data-ocid": "content_studio.images_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Images" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "adcopy",
                className: "gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white",
                "data-ocid": "content_studio.adcopy_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Ad Copy" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "blog",
                className: "gap-1.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white",
                "data-ocid": "content_studio.blog_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Blog" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "video", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "images", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagesTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "adcopy", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdCopyTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "blog", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlogTab, {}) })
          ] })
        ] })
      ]
    }
  );
}
export {
  ContentCreationStudioPage as default
};
