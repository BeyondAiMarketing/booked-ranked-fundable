import { j as jsxRuntimeExports, r as reactExports, ai as Database, ae as Layers, F as FileText, av as Card, B as Button, aT as Upload, aU as ScrollArea, au as Badge, aL as Dialog, aM as DialogContent, X, I as Input, aV as Progress, l as LoaderCircle, an as RefreshCw, aS as ue } from "./index-CHgLG-xR.js";
import { u as useRagBrain } from "./useRagBrain-Db_hFlSl.js";
import { A as ALL_COLLECTIONS } from "./ragBrain-DAXH8__s.js";
import { L as Link } from "./link-DmV3EyNo.js";
const COLLECTION_COLORS = {
  SalesScripts: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  FundingPlaybooks: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  NicheTemplates: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  ClientContracts: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  CallTranscripts: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  ReviewResponses: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  OnboardingGuides: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  CompetitorIntel: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  PricingGuides: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  ObjectionHandlers: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  CaseStudies: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  EmailSequences: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  SocialContent: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  SopLibrary: "bg-lime-500/20 text-lime-300 border-lime-500/30",
  Custom: "bg-muted text-muted-foreground border-border"
};
function CollectionBadge({
  name,
  className = ""
}) {
  const colors = COLLECTION_COLORS[name];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors} ${className}`,
      children: name.replace(/([A-Z])/g, " $1").trim()
    }
  );
}
function AdminCollectionManagerPage() {
  const { getDocuments, uploadDocument, getVectorStatus, isLoading } = useRagBrain();
  const [status, setStatus] = reactExports.useState(null);
  const [docs, setDocs] = reactExports.useState({});
  const [uploadModal, setUploadModal] = reactExports.useState(null);
  const [uploadTitle, setUploadTitle] = reactExports.useState("");
  const [uploadContent, setUploadContent] = reactExports.useState("");
  const [uploadUrl, setUploadUrl] = reactExports.useState("");
  const [uploadMode, setUploadMode] = reactExports.useState("text");
  const [uploading, setUploading] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const fileInputRef = reactExports.useRef(null);
  const loadStatus = reactExports.useCallback(async () => {
    const s = await getVectorStatus();
    if (s) setStatus(s);
  }, [getVectorStatus]);
  const loadDocs = reactExports.useCallback(
    async (col) => {
      const d = await getDocuments(col);
      if (d) setDocs((prev) => ({ ...prev, [col]: d }));
    },
    [getDocuments]
  );
  reactExports.useEffect(() => {
    loadStatus();
    for (const col of ALL_COLLECTIONS) loadDocs(col);
  }, [loadStatus, loadDocs]);
  const handleFileSelect = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      return setUploadContent(((_a2 = ev.target) == null ? void 0 : _a2.result) ?? "");
    };
    reader.readAsText(file);
  };
  const handleUpload = async () => {
    if (!uploadModal) return;
    const content = uploadMode === "url" ? uploadUrl : uploadContent;
    if (!uploadTitle.trim() || !content.trim()) {
      ue.error("Title and content/URL are required");
      return;
    }
    setUploading(true);
    setUploadProgress(30);
    const sourceType = uploadMode === "url" ? "Url" : "Upload";
    const result = await uploadDocument(
      uploadModal,
      uploadTitle,
      content,
      sourceType
    );
    setUploadProgress(100);
    if (result !== null) {
      ue.success("Document uploaded and indexed");
      setUploadModal(null);
      setUploadTitle("");
      setUploadContent("");
      setUploadUrl("");
      setUploadProgress(0);
      await loadDocs(uploadModal);
      await loadStatus();
    } else {
      ue.error("Upload failed");
    }
    setUploading(false);
  };
  const COLLECTION_ICONS = {
    SalesScripts: "📜",
    FundingPlaybooks: "💰",
    NicheTemplates: "🏗️",
    ClientContracts: "📑",
    CallTranscripts: "📞",
    ReviewResponses: "⭐",
    OnboardingGuides: "🧭",
    CompetitorIntel: "🔍",
    PricingGuides: "💲",
    ObjectionHandlers: "🛡️",
    CaseStudies: "📊",
    EmailSequences: "📧",
    SocialContent: "📱",
    SopLibrary: "📚",
    Custom: "✨"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex h-10 w-10 items-center justify-center rounded-xl",
          style: {
            background: "linear-gradient(135deg, oklch(0.48 0.2 260 / 30%), oklch(0.62 0.2 200 / 20%))",
            boxShadow: "0 0 20px oklch(0.62 0.2 200 / 30%)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-5 w-5 text-[oklch(0.62_0.2_200)]" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Knowledge Collections" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Upload and manage AI knowledge documents" })
      ] })
    ] }) }),
    status && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "mb-6 grid grid-cols-3 gap-4 rounded-2xl border border-border/50 p-4 backdrop-blur-sm",
        style: {
          background: "linear-gradient(135deg, oklch(0.48 0.2 260 / 8%), oklch(0.16 0.014 280))"
        },
        "data-ocid": "collection.status_bar",
        children: [
          {
            label: "Total Chunks",
            value: status.totalChunks,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-[oklch(0.62_0.2_200)]" })
          },
          {
            label: "Documents",
            value: status.totalDocuments,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" })
          },
          {
            label: "Active Collections",
            value: status.collectionsCount,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-4 w-4 text-emerald-400" })
          }
        ].map(({ label, value, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          icon,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold tabular-nums text-foreground", children: String(value) })
          ] })
        ] }, label))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: ALL_COLLECTIONS.map((col) => {
      const colDocs = docs[col] ?? [];
      const chunkTotal = colDocs.reduce(
        (s, d) => s + (d.chunkCount ?? 0),
        0
      );
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "group border border-border/60 bg-card/80 p-5 backdrop-blur-sm transition-all hover:border-primary/30",
          "data-ocid": `collection.${col.toLowerCase()}_card`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: COLLECTION_ICONS[col] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionBadge, { name: col })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => setUploadModal(col),
                  className: "h-7 gap-1 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100",
                  "data-ocid": `collection.${col.toLowerCase()}_upload_button`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3 w-3" }),
                    " Upload"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Documents" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-foreground", children: colDocs.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Chunks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-foreground", children: chunkTotal })
              ] })
            ] }),
            colDocs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "mt-3 h-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: colDocs.map((doc, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between rounded bg-muted/30 px-2 py-1",
                "data-ocid": `collection.doc.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs", children: doc.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: "ml-2 shrink-0 text-xs",
                      children: [
                        String(doc.chunkCount),
                        "c"
                      ]
                    }
                  )
                ]
              },
              doc.id
            )) }) })
          ]
        },
        col
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!uploadModal,
        onOpenChange: (o) => {
          if (!o) setUploadModal(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg border-border/60 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Upload Document" }),
              uploadModal && /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionBadge, { name: uploadModal, className: "mt-1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setUploadModal(null),
                className: "text-muted-foreground hover:text-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex gap-2", children: ["text", "url"].map((mode) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setUploadMode(mode),
              className: `flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${uploadMode === mode ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`,
              "data-ocid": `upload.${mode}_tab`,
              children: [
                mode === "text" ? /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-3.5 w-3.5" }),
                mode === "text" ? "File / Text" : "URL"
              ]
            },
            mode
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "upload-title",
                  className: "mb-1 block text-xs font-medium text-muted-foreground",
                  children: "Title"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "upload-title",
                  value: uploadTitle,
                  onChange: (e) => setUploadTitle(e.target.value),
                  placeholder: "Document title...",
                  "data-ocid": "upload.title_input"
                }
              )
            ] }),
            uploadMode === "text" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "upload-content",
                  className: "mb-1 block text-xs font-medium text-muted-foreground",
                  children: "Content"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "upload-content",
                    value: uploadContent,
                    onChange: (e) => setUploadContent(e.target.value),
                    placeholder: "Paste document text here...",
                    rows: 6,
                    className: "w-full rounded-lg border border-border bg-card/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                    "data-ocid": "upload.content_textarea"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "or upload file" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: fileInputRef,
                      type: "file",
                      accept: ".txt,.pdf,.docx",
                      onChange: handleFileSelect,
                      className: "hidden"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      onClick: () => {
                        var _a;
                        return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                      },
                      className: "h-7 gap-1 text-xs",
                      "data-ocid": "upload.file_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3 w-3" }),
                        " Choose File"
                      ]
                    }
                  )
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "upload-url",
                  className: "mb-1 block text-xs font-medium text-muted-foreground",
                  children: "URL"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "upload-url",
                  value: uploadUrl,
                  onChange: (e) => setUploadUrl(e.target.value),
                  placeholder: "https://...",
                  type: "url",
                  "data-ocid": "upload.url_input"
                }
              )
            ] }),
            uploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Indexing..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  uploadProgress,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: uploadProgress, className: "h-1.5" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-end gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: () => setUploadModal(null),
                disabled: uploading,
                "data-ocid": "upload.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleUpload,
                disabled: uploading,
                "data-ocid": "upload.submit_button",
                children: [
                  uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
                  "Upload & Index"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => {
          loadStatus();
          ALL_COLLECTIONS.forEach(loadDocs);
        },
        disabled: isLoading,
        "data-ocid": "collection.refresh_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
          " Refresh All"
        ]
      }
    ) })
  ] });
}
export {
  AdminCollectionManagerPage as default
};
