import { c as createLucideIcon, b1 as useActor, r as reactExports, aQ as ue, j as jsxRuntimeExports, aZ as Link, B as Button, b2 as ArrowLeft, aR as Upload, aA as CircleCheck, at as Card, b3 as LayoutTemplate, as as Badge, g as Textarea, l as LoaderCircle, ak as CircleX, b4 as CircleAlert, aJ as Dialog, aK as DialogContent, aL as DialogHeader, aM as DialogTitle, b5 as DialogDescription, b6 as createActor } from "./index-CSMRpKtY.js";
import { N as N8N_TEMPLATE_METADATA, T as TemplateCard } from "./n8nTemplateMetadata-BM_hlAfT.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1", key: "1oajmo" }
  ],
  [
    "path",
    { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1", key: "mpwhp6" }
  ]
];
const FileJson = createLucideIcon("file-json", __iconNode);
function AdminN8NMigrationPage() {
  const { actor: _actor, isFetching } = useActor(createActor);
  const actor = _actor;
  const isReady = !!actor && !isFetching;
  const fileInputRef = reactExports.useRef(null);
  const [dragging, setDragging] = reactExports.useState(false);
  const [files, setFiles] = reactExports.useState([]);
  const [rawJsons, setRawJsons] = reactExports.useState([]);
  const [validating, setValidating] = reactExports.useState(false);
  const [committing, setCommitting] = reactExports.useState(false);
  const [batch, setBatch] = reactExports.useState(null);
  const [committed, setCommitted] = reactExports.useState(false);
  const [showTemplateModal, setShowTemplateModal] = reactExports.useState(false);
  const [selectedTemplate, setSelectedTemplate] = reactExports.useState(null);
  const [templateJson, setTemplateJson] = reactExports.useState("");
  const [fetchingTemplate, setFetchingTemplate] = reactExports.useState(false);
  const reset = () => {
    setFiles([]);
    setRawJsons([]);
    setBatch(null);
    setCommitted(false);
    setTemplateJson("");
    setSelectedTemplate(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleUseTemplate = async (templateId) => {
    const template = N8N_TEMPLATE_METADATA.find((t) => t.id === templateId);
    if (!template) return;
    setSelectedTemplate(template);
    setFetchingTemplate(true);
    try {
      const res = await fetch(`/n8n-templates/${template.fileName}`);
      if (!res.ok) throw new Error("Failed to fetch template");
      const json = await res.json();
      const pretty = JSON.stringify(json, null, 2);
      setTemplateJson(pretty);
      setRawJsons([pretty]);
      setFiles([]);
      setBatch(null);
      setCommitted(false);
      setShowTemplateModal(false);
      ue.success(`Loaded "${template.name}" — customize before validating`);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to load template"
      );
    } finally {
      setFetchingTemplate(false);
    }
  };
  const readFiles = reactExports.useCallback(async (fileList) => {
    const arr = Array.from(fileList);
    const jsonFiles = arr.filter(
      (f) => f.name.endsWith(".json") || f.type === "application/json"
    );
    if (jsonFiles.length === 0) {
      ue.error("Please upload .json files only");
      return;
    }
    const texts = await Promise.all(jsonFiles.map((f) => f.text()));
    setFiles(jsonFiles);
    setRawJsons(texts);
    setBatch(null);
    setCommitted(false);
  }, []);
  const handleFileChange = (e) => {
    if (e.target.files) readFiles(e.target.files);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) readFiles(e.dataTransfer.files);
  };
  const handleDryRun = async () => {
    if (!isReady || rawJsons.length === 0) return;
    setValidating(true);
    try {
      const result = await actor.importWorkflowBatch(rawJsons);
      const batchId = (result == null ? void 0 : result.batchId) ?? "";
      const rawResults = (result == null ? void 0 : result.results) ?? [];
      const parsed = rawResults.map((r) => {
        var _a;
        return {
          index: r.index,
          name: r.name,
          valid: r.valid,
          error: (_a = r.error) == null ? void 0 : _a[0]
        };
      });
      setBatch({
        batchId,
        results: parsed,
        validCount: parsed.filter((r) => r.valid).length,
        errorCount: parsed.filter((r) => !r.valid).length
      });
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Validation failed");
    } finally {
      setValidating(false);
    }
  };
  const handleCommit = async () => {
    if (!isReady || !(batch == null ? void 0 : batch.batchId)) return;
    setCommitting(true);
    try {
      const ok = await actor.commitWorkflowBatch(batch.batchId);
      if (ok) {
        setCommitted(true);
        ue.success(
          `${batch.validCount} workflow${batch.validCount !== 1 ? "s" : ""} imported successfully`
        );
      } else {
        ue.error(
          "Commit failed — batch may have expired. Re-upload and dry-run again."
        );
      }
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Commit failed");
    } finally {
      setCommitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/workflow-library", "data-ocid": "n8n-migration.back_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Workflow Library"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex h-10 w-10 items-center justify-center rounded-xl",
            style: {
              background: "linear-gradient(135deg, oklch(0.55 0.18 280 / 30%), oklch(0.62 0.2 200 / 20%))",
              boxShadow: "0 0 20px oklch(0.55 0.18 280 / 30%)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5 text-[oklch(0.62_0.2_200)]" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Batch Workflow Import" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Upload multiple N8N workflow JSON files, validate, then commit to the platform" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 flex items-center gap-3", children: [
      {
        label: "1. Upload Files",
        done: files.length > 0 || !!templateJson
      },
      { label: "2. Dry-Run Validation", done: !!batch },
      { label: "3. Commit", done: committed }
    ].map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-6 bg-border/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: `flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${step.done ? "bg-emerald-500/15 text-emerald-300" : "bg-muted/40 text-muted-foreground"}`,
          children: [
            step.done && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
            step.label
          ]
        }
      )
    ] }, step.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "mb-6 border border-border/60 bg-card/80 p-6",
        onDragOver: (e) => {
          e.preventDefault();
          setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop: handleDrop,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-sm font-semibold text-foreground", children: "Step 1 — Upload Workflow JSON Files" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: `flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/40"}`,
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              "aria-label": "Upload workflow JSON files",
              "data-ocid": "n8n-migration.dropzone",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileJson, { className: "mb-3 h-10 w-10 text-muted-foreground/40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-muted-foreground", children: "Drop .json files here or click to browse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground/60", children: "One or more N8N workflow export files" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: ".json,application/json",
              multiple: true,
              className: "hidden",
              onChange: handleFileChange,
              "data-ocid": "n8n-migration.upload_button"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "or" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border/40" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "mt-4 w-full gap-2 border-gold-accent/30 bg-gold-accent/5 text-gold-accent hover:bg-gold-accent/10 hover:text-gold-accent",
              onClick: () => setShowTemplateModal(true),
              "data-ocid": "n8n-migration.use_brf_template_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutTemplate, { className: "h-4 w-4" }),
                "Use BRF Template"
              ]
            }
          ),
          files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground", children: [
              files.length,
              " file",
              files.length !== 1 ? "s" : "",
              " selected"
            ] }),
            files.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2",
                "data-ocid": `n8n-migration.file.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileJson, { className: "h-4 w-4 shrink-0 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-xs text-foreground", children: f.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 text-xs text-muted-foreground", children: [
                    (f.size / 1024).toFixed(1),
                    " KB"
                  ] })
                ]
              },
              f.name
            ))
          ] }),
          templateJson && selectedTemplate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutTemplate, { className: "h-4 w-4 text-gold-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: selectedTemplate.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "border-gold-accent/30 text-gold-accent",
                    children: selectedTemplate.category
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "h-7 text-xs text-muted-foreground hover:text-foreground",
                  onClick: () => {
                    setTemplateJson("");
                    setSelectedTemplate(null);
                    setRawJsons([]);
                  },
                  "data-ocid": "n8n-migration.clear_template_button",
                  children: "Clear"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border/50 bg-muted/20 px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Maps to webhook contract:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-muted/60 px-1.5 py-0.5 text-xs text-primary", children: selectedTemplate.webhookId })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: templateJson,
                onChange: (e) => {
                  setTemplateJson(e.target.value);
                  setRawJsons([e.target.value]);
                },
                className: "min-h-[240px] font-mono text-xs",
                placeholder: "Edit workflow JSON before validating...",
                "data-ocid": "n8n-migration.template_json_textarea"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "You can edit the JSON above before running validation. Make sure the workflow nodes match your n8n instance configuration." })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6 border border-border/60 bg-card/80 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Step 2 — Dry-Run Validation" }),
        files.length > 0 && !committed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: handleDryRun,
            disabled: validating || !isReady || files.length === 0,
            className: "gap-1.5",
            "data-ocid": "n8n-migration.dry_run_button",
            children: [
              validating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
              "Run Validation"
            ]
          }
        )
      ] }),
      !batch && !validating && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Upload files above, then run validation to check for errors before committing." }),
      validating && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 text-sm text-muted-foreground",
          "data-ocid": "n8n-migration.validation_loading_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            " Validating workflows…"
          ]
        }
      ),
      batch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-emerald-300", children: [
              batch.validCount,
              " valid"
            ] })
          ] }),
          batch.errorCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-rose-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-rose-300", children: [
              batch.errorCount,
              " error",
              batch.errorCount !== 1 ? "s" : ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "space-y-2",
            "data-ocid": "n8n-migration.validation_results",
            children: batch.results.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex items-start gap-3 rounded-lg border p-3 ${r.valid ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5"}`,
                "data-ocid": `n8n-migration.result.item.${i + 1}`,
                children: [
                  r.valid ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-rose-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: r.name || `Workflow #${r.index + 1}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: `text-xs ${r.valid ? "border-emerald-500/30 text-emerald-400" : "border-rose-500/30 text-rose-400"}`,
                          children: r.valid ? "Valid" : "Error"
                        }
                      )
                    ] }),
                    r.error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-rose-300/80", children: r.error })
                  ] })
                ]
              },
              r.index
            ))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showTemplateModal, onOpenChange: setShowTemplateModal, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl border border-border/60 bg-card/95 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutTemplate, { className: "h-5 w-5 text-gold-accent" }),
          "Choose a BRF Workflow Template"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-muted-foreground", children: "Select a pre-built template to import into your n8n instance." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: N8N_TEMPLATE_METADATA.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TemplateCard,
        {
          template,
          onUseTemplate: handleUseTemplate
        },
        template.id
      )) }),
      fetchingTemplate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        "Loading template JSON..."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border/60 bg-card/80 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-sm font-semibold text-foreground", children: "Step 3 — Commit to Platform" }),
      committed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-3 py-8 text-center",
          "data-ocid": "n8n-migration.success_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-12 w-12 text-emerald-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground", children: [
              (batch == null ? void 0 : batch.validCount) ?? 0,
              " workflow",
              ((batch == null ? void 0 : batch.validCount) ?? 0) !== 1 ? "s" : "",
              " imported successfully"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "They are now available in the Workflow Library and can be pushed to any account." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: reset,
                  "data-ocid": "n8n-migration.import_more_button",
                  children: "Import More"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/workflow-library", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { "data-ocid": "n8n-migration.go_to_library_button", children: "Go to Library" }) })
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: !batch ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Complete validation before committing." }) : batch.validCount === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 text-sm text-rose-400",
          "data-ocid": "n8n-migration.no_valid_error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
            " No valid workflows to commit. Fix errors and re-validate."
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: batch.validCount }),
          " ",
          "valid workflow",
          batch.validCount !== 1 ? "s" : "",
          " will be added to the platform library.",
          batch.errorCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-amber-400", children: [
            batch.errorCount,
            " error",
            batch.errorCount !== 1 ? "s" : "",
            " will be skipped."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: reset,
              disabled: committing,
              "data-ocid": "n8n-migration.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleCommit,
              disabled: committing || !isReady,
              className: "gap-2 bg-emerald-600 hover:bg-emerald-700",
              "data-ocid": "n8n-migration.commit_button",
              children: [
                committing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
                "Commit ",
                batch.validCount,
                " Workflow",
                batch.validCount !== 1 ? "s" : ""
              ]
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
export {
  AdminN8NMigrationPage as default
};
