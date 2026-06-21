import { createActor } from "@/backend";
import { TemplateCard } from "@/components/TemplateCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  type N8NTemplateMetadata,
  N8N_TEMPLATE_METADATA,
} from "@/data/n8nTemplateMetadata";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileJson,
  LayoutTemplate,
  Loader2,
  Upload,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = any;

interface ValidationResult {
  index: number;
  name: string;
  valid: boolean;
  error?: string;
}

interface BatchState {
  batchId: string;
  results: ValidationResult[];
  validCount: number;
  errorCount: number;
}

export default function AdminN8NMigrationPage() {
  const { actor: _actor, isFetching } = useActor(createActor);
  const actor = _actor as AnyActor;
  const isReady = !!actor && !isFetching;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [rawJsons, setRawJsons] = useState<string[]>([]);
  const [validating, setValidating] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [batch, setBatch] = useState<BatchState | null>(null);
  const [committed, setCommitted] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<N8NTemplateMetadata | null>(null);
  const [templateJson, setTemplateJson] = useState<string>("");
  const [fetchingTemplate, setFetchingTemplate] = useState(false);

  const reset = () => {
    setFiles([]);
    setRawJsons([]);
    setBatch(null);
    setCommitted(false);
    setTemplateJson("");
    setSelectedTemplate(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUseTemplate = async (templateId: string) => {
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
      toast.success(`Loaded "${template.name}" — customize before validating`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load template",
      );
    } finally {
      setFetchingTemplate(false);
    }
  };

  const readFiles = useCallback(async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    const jsonFiles = arr.filter(
      (f) => f.name.endsWith(".json") || f.type === "application/json",
    );
    if (jsonFiles.length === 0) {
      toast.error("Please upload .json files only");
      return;
    }
    const texts = await Promise.all(jsonFiles.map((f) => f.text()));
    setFiles(jsonFiles);
    setRawJsons(texts);
    setBatch(null);
    setCommitted(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) readFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) readFiles(e.dataTransfer.files);
  };

  const handleDryRun = async () => {
    if (!isReady || rawJsons.length === 0) return;
    setValidating(true);
    try {
      const result = await actor.importWorkflowBatch(rawJsons);
      // Backend returns { batchId: Text, results: [WorkflowImportValidation] }
      const batchId: string = result?.batchId ?? "";
      const rawResults: Array<{
        index: number;
        name: string;
        valid: boolean;
        error?: string[];
      }> = result?.results ?? [];
      const parsed: ValidationResult[] = rawResults.map((r) => ({
        index: r.index,
        name: r.name,
        valid: r.valid,
        error: r.error?.[0],
      }));
      setBatch({
        batchId,
        results: parsed,
        validCount: parsed.filter((r) => r.valid).length,
        errorCount: parsed.filter((r) => !r.valid).length,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Validation failed");
    } finally {
      setValidating(false);
    }
  };

  const handleCommit = async () => {
    if (!isReady || !batch?.batchId) return;
    setCommitting(true);
    try {
      const ok = await actor.commitWorkflowBatch(batch.batchId);
      if (ok) {
        setCommitted(true);
        toast.success(
          `${batch.validCount} workflow${batch.validCount !== 1 ? "s" : ""} imported successfully`,
        );
      } else {
        toast.error(
          "Commit failed — batch may have expired. Re-upload and dry-run again.",
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Commit failed");
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/workflow-library" data-ocid="n8n-migration.back_link">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Workflow Library
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.18 280 / 30%), oklch(0.62 0.2 200 / 20%))",
              boxShadow: "0 0 20px oklch(0.55 0.18 280 / 30%)",
            }}
          >
            <Upload className="h-5 w-5 text-[oklch(0.62_0.2_200)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Batch Workflow Import
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload multiple N8N workflow JSON files, validate, then commit to
              the platform
            </p>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-3">
        {[
          {
            label: "1. Upload Files",
            done: files.length > 0 || !!templateJson,
          },
          { label: "2. Dry-Run Validation", done: !!batch },
          { label: "3. Commit", done: committed },
        ].map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            {i > 0 && <div className="h-px w-6 bg-border/60" />}
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                step.done
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-muted/40 text-muted-foreground"
              }`}
            >
              {step.done && <CheckCircle2 className="h-3 w-3" />}
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* ─── Step 1: File Upload ─── */}
      <Card
        className="mb-6 border border-border/60 bg-card/80 p-6"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Step 1 — Upload Workflow JSON Files
        </h2>
        <button
          type="button"
          className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-border/60 hover:border-primary/40"
          }`}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload workflow JSON files"
          data-ocid="n8n-migration.dropzone"
        >
          <FileJson className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">
            Drop .json files here or click to browse
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            One or more N8N workflow export files
          </p>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          multiple
          className="hidden"
          onChange={handleFileChange}
          data-ocid="n8n-migration.upload_button"
        />

        {/* Use BRF Template button */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-border/40" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border/40" />
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full gap-2 border-gold-accent/30 bg-gold-accent/5 text-gold-accent hover:bg-gold-accent/10 hover:text-gold-accent"
          onClick={() => setShowTemplateModal(true)}
          data-ocid="n8n-migration.use_brf_template_button"
        >
          <LayoutTemplate className="h-4 w-4" />
          Use BRF Template
        </Button>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </p>
            {files.map((f, i) => (
              <div
                key={f.name}
                className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
                data-ocid={`n8n-migration.file.item.${i + 1}`}
              >
                <FileJson className="h-4 w-4 shrink-0 text-primary" />
                <span className="flex-1 truncate text-xs text-foreground">
                  {f.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {(f.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Template-loaded JSON editor */}
        {templateJson && selectedTemplate && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4 text-gold-accent" />
                <span className="text-sm font-semibold text-foreground">
                  {selectedTemplate.name}
                </span>
                <Badge
                  variant="outline"
                  className="border-gold-accent/30 text-gold-accent"
                >
                  {selectedTemplate.category}
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setTemplateJson("");
                  setSelectedTemplate(null);
                  setRawJsons([]);
                }}
                data-ocid="n8n-migration.clear_template_button"
              >
                Clear
              </Button>
            </div>

            {/* Webhook contract mapping */}
            <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
              <p className="text-xs text-muted-foreground">
                Maps to webhook contract:{" "}
                <code className="rounded bg-muted/60 px-1.5 py-0.5 text-xs text-primary">
                  {selectedTemplate.webhookId}
                </code>
              </p>
            </div>

            <Textarea
              value={templateJson}
              onChange={(e) => {
                setTemplateJson(e.target.value);
                setRawJsons([e.target.value]);
              }}
              className="min-h-[240px] font-mono text-xs"
              placeholder="Edit workflow JSON before validating..."
              data-ocid="n8n-migration.template_json_textarea"
            />
            <p className="text-xs text-muted-foreground">
              You can edit the JSON above before running validation. Make sure
              the workflow nodes match your n8n instance configuration.
            </p>
          </div>
        )}
      </Card>

      {/* ─── Step 2: Dry-Run ─── */}
      <Card className="mb-6 border border-border/60 bg-card/80 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Step 2 — Dry-Run Validation
          </h2>
          {files.length > 0 && !committed && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDryRun}
              disabled={validating || !isReady || files.length === 0}
              className="gap-1.5"
              data-ocid="n8n-migration.dry_run_button"
            >
              {validating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Run Validation
            </Button>
          )}
        </div>

        {!batch && !validating && (
          <p className="text-sm text-muted-foreground">
            Upload files above, then run validation to check for errors before
            committing.
          </p>
        )}
        {validating && (
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            data-ocid="n8n-migration.validation_loading_state"
          >
            <Loader2 className="h-4 w-4 animate-spin" /> Validating workflows…
          </div>
        )}

        {batch && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300">
                  {batch.validCount} valid
                </span>
              </div>
              {batch.errorCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2">
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <span className="text-sm font-semibold text-rose-300">
                    {batch.errorCount} error{batch.errorCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Result list */}
            <div
              className="space-y-2"
              data-ocid="n8n-migration.validation_results"
            >
              {batch.results.map((r, i) => (
                <div
                  key={r.index}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${
                    r.valid
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-rose-500/20 bg-rose-500/5"
                  }`}
                  data-ocid={`n8n-migration.result.item.${i + 1}`}
                >
                  {r.valid ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {r.name || `Workflow #${r.index + 1}`}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          r.valid
                            ? "border-emerald-500/30 text-emerald-400"
                            : "border-rose-500/30 text-rose-400"
                        }`}
                      >
                        {r.valid ? "Valid" : "Error"}
                      </Badge>
                    </div>
                    {r.error && (
                      <p className="mt-1 text-xs text-rose-300/80">{r.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ─── Template Selection Dialog ─── */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-3xl border border-border/60 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <LayoutTemplate className="h-5 w-5 text-gold-accent" />
              Choose a BRF Workflow Template
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select a pre-built template to import into your n8n instance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {N8N_TEMPLATE_METADATA.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUseTemplate={handleUseTemplate}
              />
            ))}
          </div>
          {fetchingTemplate && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading template JSON...
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Step 3: Commit ─── */}
      <Card className="border border-border/60 bg-card/80 p-6">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Step 3 — Commit to Platform
        </h2>

        {committed ? (
          <div
            className="flex flex-col items-center gap-3 py-8 text-center"
            data-ocid="n8n-migration.success_state"
          >
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            <p className="font-semibold text-foreground">
              {batch?.validCount ?? 0} workflow
              {(batch?.validCount ?? 0) !== 1 ? "s" : ""} imported successfully
            </p>
            <p className="text-sm text-muted-foreground">
              They are now available in the Workflow Library and can be pushed
              to any account.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={reset}
                data-ocid="n8n-migration.import_more_button"
              >
                Import More
              </Button>
              <Link to="/admin/workflow-library">
                <Button data-ocid="n8n-migration.go_to_library_button">
                  Go to Library
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {!batch ? (
              <p className="text-sm text-muted-foreground">
                Complete validation before committing.
              </p>
            ) : batch.validCount === 0 ? (
              <div
                className="flex items-center gap-2 text-sm text-rose-400"
                data-ocid="n8n-migration.no_valid_error_state"
              >
                <XCircle className="h-4 w-4" /> No valid workflows to commit.
                Fix errors and re-validate.
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {batch.validCount}
                  </span>{" "}
                  valid workflow{batch.validCount !== 1 ? "s" : ""} will be
                  added to the platform library.
                  {batch.errorCount > 0 && (
                    <span className="ml-1 text-amber-400">
                      {batch.errorCount} error
                      {batch.errorCount !== 1 ? "s" : ""} will be skipped.
                    </span>
                  )}
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={reset}
                    disabled={committing}
                    data-ocid="n8n-migration.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCommit}
                    disabled={committing || !isReady}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    data-ocid="n8n-migration.commit_button"
                  >
                    {committing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Commit {batch.validCount} Workflow
                    {batch.validCount !== 1 ? "s" : ""}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
