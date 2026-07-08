import { r as reactExports, j as jsxRuntimeExports, F as FileText, B as Button, P as Plus, aw as Skeleton, at as Card, q as Trash2, aJ as Dialog, aK as DialogContent, aL as DialogHeader, aM as DialogTitle, aR as Upload, L as Label, I as Input } from "./index-iniFfpN1.js";
import { u as useRagBrain } from "./useRagBrain-BhqiHqwE.js";
import { A as ALL_COLLECTIONS } from "./ragBrain-DAXH8__s.js";
const COL_LABELS = {
  SalesScripts: "Sales Scripts",
  FundingPlaybooks: "Funding Playbooks",
  NicheTemplates: "Niche Templates",
  ClientContracts: "Client Contracts",
  CallTranscripts: "Call Transcripts",
  ReviewResponses: "Review Responses",
  OnboardingGuides: "Onboarding Guides",
  CompetitorIntel: "Competitor Intel",
  PricingGuides: "Pricing Guides",
  ObjectionHandlers: "Objection Handlers",
  CaseStudies: "Case Studies",
  EmailSequences: "Email Sequences",
  SocialContent: "Social Content",
  SopLibrary: "SOP Library",
  Custom: "Custom"
};
const COL_BADGE = {
  SalesScripts: "bg-[oklch(0.58_0.22_290/0.12)] text-[oklch(0.72_0.18_290)] border-[oklch(0.58_0.22_290/0.25)]",
  FundingPlaybooks: "bg-[oklch(0.72_0.18_75/0.12)] text-[oklch(0.82_0.16_75)] border-[oklch(0.72_0.18_75/0.25)]",
  CallTranscripts: "bg-[oklch(0.62_0.2_200/0.12)] text-[oklch(0.72_0.2_200)] border-[oklch(0.62_0.2_200/0.25)]",
  ReviewResponses: "bg-[oklch(0.62_0.18_155/0.12)] text-[oklch(0.72_0.18_155)] border-[oklch(0.62_0.18_155/0.25)]"
};
const DEFAULT_BADGE = "bg-muted text-muted-foreground border-border";
function fmtDate(ts) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
const SEED_DOCS = [
  {
    id: "d1",
    collectionName: "SalesScripts",
    title: "Roofing Discovery Call Script",
    sourceType: "Manual",
    contentPreview: "Hi [Name], this is…",
    chunkCount: 8,
    tenantId: "client",
    uploadedAt: BigInt(Date.now() - 7 * 864e5),
    uploadedBy: "You"
  },
  {
    id: "d2",
    collectionName: "FundingPlaybooks",
    title: "Net-30 Vendor Application Guide",
    sourceType: "Upload",
    contentPreview: "Step 1: Open your EIN…",
    chunkCount: 14,
    tenantId: "client",
    uploadedAt: BigInt(Date.now() - 3 * 864e5),
    uploadedBy: "You"
  },
  {
    id: "d3",
    collectionName: "ReviewResponses",
    title: "5-Star Response Templates",
    sourceType: "Manual",
    contentPreview: "Thank you so much for…",
    chunkCount: 5,
    tenantId: "client",
    uploadedAt: BigInt(Date.now() - 864e5),
    uploadedBy: "You"
  }
];
function ClientUploadedDocsPage() {
  const { getDocuments, uploadDocument, isLoading } = useRagBrain();
  const [docs, setDocs] = reactExports.useState(SEED_DOCS);
  const [loadingDocs, setLoadingDocs] = reactExports.useState(true);
  const [showUpload, setShowUpload] = reactExports.useState(false);
  const [uploadTitle, setUploadTitle] = reactExports.useState("");
  const [uploadCollection, setUploadCollection] = reactExports.useState("Custom");
  const [uploadContent, setUploadContent] = reactExports.useState("");
  const [uploadError, setUploadError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    getDocuments("Custom").then((fetched) => {
      if (fetched && fetched.length > 0) setDocs(fetched);
      setLoadingDocs(false);
    });
  }, []);
  const handleUpload = reactExports.useCallback(async () => {
    if (!uploadTitle.trim()) {
      setUploadError("Title is required.");
      return;
    }
    if (!uploadContent.trim()) {
      setUploadError("Content is required.");
      return;
    }
    setUploadError(null);
    const result = await uploadDocument(
      uploadCollection,
      uploadTitle,
      uploadContent,
      "Manual"
    );
    if (result !== null) {
      setDocs((prev) => [
        ...prev,
        {
          id: `d-new-${Date.now()}`,
          collectionName: uploadCollection,
          title: uploadTitle,
          sourceType: "Manual",
          contentPreview: uploadContent.slice(0, 60),
          chunkCount: Math.ceil(uploadContent.length / 500),
          tenantId: "client",
          uploadedAt: BigInt(Date.now()),
          uploadedBy: "You"
        }
      ]);
      setShowUpload(false);
      setUploadTitle("");
      setUploadContent("");
    }
  }, [uploadDocument, uploadTitle, uploadCollection, uploadContent]);
  const handleDelete = reactExports.useCallback((id) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "my-documents.page", className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 py-5 md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-[oklch(0.55_0.2_270/0.15)] border border-[oklch(0.55_0.2_270/0.3)] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-[oklch(0.7_0.18_270)]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-foreground", children: "My Documents" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            docs.length,
            " document",
            docs.length !== 1 ? "s" : "",
            " in your knowledge base"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "my-documents.upload_button",
          type: "button",
          size: "sm",
          className: "gap-1.5 bg-primary hover:bg-primary/90",
          onClick: () => setShowUpload(true),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Add Document"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-6 md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto", children: loadingDocs ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "my-documents.loading_state", className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }, i)) }) : docs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "my-documents.empty_state",
        className: "text-center py-16",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/40 border border-border flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground mb-2", children: "No documents yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Upload scripts, guides, and playbooks to power your AI assistant." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: () => setShowUpload(true),
              className: "bg-primary hover:bg-primary/90",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
                "Upload First Document"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-4 py-3", children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell", children: "Collection" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell", children: "Chunks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right text-xs font-medium text-muted-foreground px-4 py-3", children: "Uploaded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: docs.map((doc, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `my-documents.item.${idx + 1}`,
          className: "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-muted/50 border border-border flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate", children: doc.title })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${COL_BADGE[doc.collectionName] ?? DEFAULT_BADGE}`,
                children: COL_LABELS[doc.collectionName]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-sm text-muted-foreground hidden sm:table-cell", children: doc.chunkCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-xs text-muted-foreground", children: fmtDate(doc.uploadedAt) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `my-documents.delete_button.${idx + 1}`,
                "aria-label": "Delete document",
                onClick: () => handleDelete(doc.id),
                className: "w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
              }
            ) })
          ]
        },
        doc.id
      )) })
    ] }) }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: showUpload,
        onOpenChange: (open) => {
          if (!open) {
            setShowUpload(false);
            setUploadError(null);
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            "data-ocid": "my-documents.dialog",
            className: "bg-card border-border max-w-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 text-primary" }),
                "Add New Document"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "doc-title",
                      className: "text-sm font-medium text-foreground",
                      children: "Document Title"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "doc-title",
                      "data-ocid": "my-documents.title.input",
                      value: uploadTitle,
                      onChange: (e) => setUploadTitle(e.target.value),
                      placeholder: "e.g. Roofing Discovery Call Script",
                      className: "bg-background border-border"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Collection" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      "data-ocid": "my-documents.collection.select",
                      value: uploadCollection,
                      onChange: (e) => setUploadCollection(e.target.value),
                      className: "w-full rounded-md bg-background border border-border text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring",
                      children: ALL_COLLECTIONS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: col, children: COL_LABELS[col] }, col))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "doc-content",
                      className: "text-sm font-medium text-foreground",
                      children: "Content"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      id: "doc-content",
                      "data-ocid": "my-documents.content.textarea",
                      value: uploadContent,
                      onChange: (e) => setUploadContent(e.target.value),
                      placeholder: "Paste your document content here…",
                      rows: 6,
                      className: "w-full rounded-md bg-background border border-border text-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    }
                  )
                ] }),
                uploadError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    "data-ocid": "my-documents.error_state",
                    className: "text-xs text-destructive",
                    children: uploadError
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": "my-documents.cancel_button",
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => setShowUpload(false),
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      "data-ocid": "my-documents.submit_button",
                      type: "button",
                      size: "sm",
                      disabled: isLoading,
                      onClick: handleUpload,
                      className: "bg-primary hover:bg-primary/90",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5 mr-1.5" }),
                        "Upload Document"
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  ClientUploadedDocsPage as default
};
