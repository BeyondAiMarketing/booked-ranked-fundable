import { CollectionBadge } from "@/components/CollectionBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRagBrain } from "@/hooks/useRagBrain";
import {
  ALL_COLLECTIONS,
  type CollectionName,
  type KnowledgeDocument,
  type VectorIndexStatus,
} from "@/types/ragBrain";
import {
  Database,
  FileText,
  Layers,
  Link,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function AdminCollectionManagerPage() {
  const { getDocuments, uploadDocument, getVectorStatus, isLoading } =
    useRagBrain();

  const [status, setStatus] = useState<VectorIndexStatus | null>(null);
  const [docs, setDocs] = useState<Record<string, KnowledgeDocument[]>>({});
  const [uploadModal, setUploadModal] = useState<CollectionName | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadContent, setUploadContent] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadMode, setUploadMode] = useState<"text" | "url">("text");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadStatus = useCallback(async () => {
    const s = await getVectorStatus();
    if (s) setStatus(s);
  }, [getVectorStatus]);

  const loadDocs = useCallback(
    async (col: CollectionName) => {
      const d = await getDocuments(col);
      if (d) setDocs((prev) => ({ ...prev, [col]: d }));
    },
    [getDocuments],
  );

  useEffect(() => {
    loadStatus();
    for (const col of ALL_COLLECTIONS) loadDocs(col);
  }, [loadStatus, loadDocs]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (ev) =>
      setUploadContent((ev.target?.result as string) ?? "");
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!uploadModal) return;
    const content = uploadMode === "url" ? uploadUrl : uploadContent;
    if (!uploadTitle.trim() || !content.trim()) {
      toast.error("Title and content/URL are required");
      return;
    }
    setUploading(true);
    setUploadProgress(30);
    const sourceType = uploadMode === "url" ? "Url" : "Upload";
    const result = await uploadDocument(
      uploadModal,
      uploadTitle,
      content,
      sourceType,
    );
    setUploadProgress(100);
    if (result !== null) {
      toast.success("Document uploaded and indexed");
      setUploadModal(null);
      setUploadTitle("");
      setUploadContent("");
      setUploadUrl("");
      setUploadProgress(0);
      await loadDocs(uploadModal);
      await loadStatus();
    } else {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const COLLECTION_ICONS: Record<CollectionName, string> = {
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
    Custom: "✨",
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.48 0.2 260 / 30%), oklch(0.62 0.2 200 / 20%))",
              boxShadow: "0 0 20px oklch(0.62 0.2 200 / 30%)",
            }}
          >
            <Database className="h-5 w-5 text-[oklch(0.62_0.2_200)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Knowledge Collections
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload and manage AI knowledge documents
            </p>
          </div>
        </div>
      </div>

      {/* Vector Index Status Bar */}
      {status && (
        <div
          className="mb-6 grid grid-cols-3 gap-4 rounded-2xl border border-border/50 p-4 backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.48 0.2 260 / 8%), oklch(0.16 0.014 280))",
          }}
          data-ocid="collection.status_bar"
        >
          {[
            {
              label: "Total Chunks",
              value: status.totalChunks,
              icon: <Layers className="h-4 w-4 text-[oklch(0.62_0.2_200)]" />,
            },
            {
              label: "Documents",
              value: status.totalDocuments,
              icon: <FileText className="h-4 w-4 text-primary" />,
            },
            {
              label: "Active Collections",
              value: status.collectionsCount,
              icon: <Database className="h-4 w-4 text-emerald-400" />,
            },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center gap-3">
              {icon}
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold tabular-nums text-foreground">
                  {String(value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collection Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_COLLECTIONS.map((col) => {
          const colDocs = docs[col] ?? [];
          const chunkTotal = colDocs.reduce(
            (s, d) => s + (d.chunkCount ?? 0),
            0,
          );
          return (
            <Card
              key={col}
              className="group border border-border/60 bg-card/80 p-5 backdrop-blur-sm transition-all hover:border-primary/30"
              data-ocid={`collection.${col.toLowerCase()}_card`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{COLLECTION_ICONS[col]}</span>
                  <CollectionBadge name={col} />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setUploadModal(col)}
                  className="h-7 gap-1 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                  data-ocid={`collection.${col.toLowerCase()}_upload_button`}
                >
                  <Upload className="h-3 w-3" /> Upload
                </Button>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Documents</span>
                  <span className="font-mono font-medium text-foreground">
                    {colDocs.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Chunks</span>
                  <span className="font-mono font-medium text-foreground">
                    {chunkTotal}
                  </span>
                </div>
              </div>
              {colDocs.length > 0 && (
                <ScrollArea className="mt-3 h-24">
                  <div className="space-y-1">
                    {colDocs.map((doc, i) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded bg-muted/30 px-2 py-1"
                        data-ocid={`collection.doc.item.${i + 1}`}
                      >
                        <span className="truncate text-xs">{doc.title}</span>
                        <Badge
                          variant="outline"
                          className="ml-2 shrink-0 text-xs"
                        >
                          {String(doc.chunkCount)}c
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </Card>
          );
        })}
      </div>

      {/* Upload Modal */}
      <Dialog
        open={!!uploadModal}
        onOpenChange={(o) => {
          if (!o) setUploadModal(null);
        }}
      >
        <DialogContent className="max-w-lg border-border/60 bg-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Upload Document
              </h2>
              {uploadModal && (
                <CollectionBadge name={uploadModal} className="mt-1" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setUploadModal(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Mode toggle */}
          <div className="mb-4 flex gap-2">
            {(["text", "url"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setUploadMode(mode)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  uploadMode === mode
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-border/80"
                }`}
                data-ocid={`upload.${mode}_tab`}
              >
                {mode === "text" ? (
                  <FileText className="h-3.5 w-3.5" />
                ) : (
                  <Link className="h-3.5 w-3.5" />
                )}
                {mode === "text" ? "File / Text" : "URL"}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="upload-title"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Title
              </label>
              <Input
                id="upload-title"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Document title..."
                data-ocid="upload.title_input"
              />
            </div>

            {uploadMode === "text" ? (
              <div>
                <label
                  htmlFor="upload-content"
                  className="mb-1 block text-xs font-medium text-muted-foreground"
                >
                  Content
                </label>
                <div className="space-y-2">
                  <textarea
                    id="upload-content"
                    value={uploadContent}
                    onChange={(e) => setUploadContent(e.target.value)}
                    placeholder="Paste document text here..."
                    rows={6}
                    className="w-full rounded-lg border border-border bg-card/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    data-ocid="upload.content_textarea"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      or upload file
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.pdf,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 gap-1 text-xs"
                      data-ocid="upload.file_button"
                    >
                      <Upload className="h-3 w-3" /> Choose File
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="upload-url"
                  className="mb-1 block text-xs font-medium text-muted-foreground"
                >
                  URL
                </label>
                <Input
                  id="upload-url"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://..."
                  type="url"
                  data-ocid="upload.url_input"
                />
              </div>
            )}

            {uploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Indexing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setUploadModal(null)}
              disabled={uploading}
              data-ocid="upload.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              data-ocid="upload.submit_button"
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload & Index
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refresh */}
      <div className="mt-6 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            loadStatus();
            ALL_COLLECTIONS.forEach(loadDocs);
          }}
          disabled={isLoading}
          data-ocid="collection.refresh_button"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh All
        </Button>
      </div>
    </div>
  );
}
