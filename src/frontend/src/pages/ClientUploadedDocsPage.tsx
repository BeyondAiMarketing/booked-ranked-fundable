import { FileText, Plus, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { useRagBrain } from "../hooks/useRagBrain";
import type { CollectionName, KnowledgeDocument } from "../types/ragBrain";
import { ALL_COLLECTIONS } from "../types/ragBrain";

const COL_LABELS: Record<CollectionName, string> = {
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
  Custom: "Custom",
};

const COL_BADGE: Partial<Record<CollectionName, string>> = {
  SalesScripts:
    "bg-[oklch(0.58_0.22_290/0.12)] text-[oklch(0.72_0.18_290)] border-[oklch(0.58_0.22_290/0.25)]",
  FundingPlaybooks:
    "bg-[oklch(0.72_0.18_75/0.12)] text-[oklch(0.82_0.16_75)] border-[oklch(0.72_0.18_75/0.25)]",
  CallTranscripts:
    "bg-[oklch(0.62_0.2_200/0.12)] text-[oklch(0.72_0.2_200)] border-[oklch(0.62_0.2_200/0.25)]",
  ReviewResponses:
    "bg-[oklch(0.62_0.18_155/0.12)] text-[oklch(0.72_0.18_155)] border-[oklch(0.62_0.18_155/0.25)]",
};
const DEFAULT_BADGE = "bg-muted text-muted-foreground border-border";

function fmtDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SEED_DOCS: KnowledgeDocument[] = [
  {
    id: "d1",
    collectionName: "SalesScripts",
    title: "Roofing Discovery Call Script",
    sourceType: "Manual",
    contentPreview: "Hi [Name], this is…",
    chunkCount: 8,
    tenantId: "client",
    uploadedAt: BigInt(Date.now() - 7 * 86400000),
    uploadedBy: "You",
  },
  {
    id: "d2",
    collectionName: "FundingPlaybooks",
    title: "Net-30 Vendor Application Guide",
    sourceType: "Upload",
    contentPreview: "Step 1: Open your EIN…",
    chunkCount: 14,
    tenantId: "client",
    uploadedAt: BigInt(Date.now() - 3 * 86400000),
    uploadedBy: "You",
  },
  {
    id: "d3",
    collectionName: "ReviewResponses",
    title: "5-Star Response Templates",
    sourceType: "Manual",
    contentPreview: "Thank you so much for…",
    chunkCount: 5,
    tenantId: "client",
    uploadedAt: BigInt(Date.now() - 86400000),
    uploadedBy: "You",
  },
];

export default function ClientUploadedDocsPage() {
  const { getDocuments, uploadDocument, isLoading } = useRagBrain();
  const [docs, setDocs] = useState<KnowledgeDocument[]>(SEED_DOCS);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCollection, setUploadCollection] =
    useState<CollectionName>("Custom");
  const [uploadContent, setUploadContent] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional load-on-mount
  useEffect(() => {
    getDocuments("Custom").then((fetched) => {
      if (fetched && fetched.length > 0) setDocs(fetched);
      setLoadingDocs(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = useCallback(async () => {
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
      "Manual",
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
          uploadedBy: "You",
        },
      ]);
      setShowUpload(false);
      setUploadTitle("");
      setUploadContent("");
    }
  }, [uploadDocument, uploadTitle, uploadCollection, uploadContent]);

  const handleDelete = useCallback((id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <div data-ocid="my-documents.page" className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-4 py-5 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[oklch(0.55_0.2_270/0.15)] border border-[oklch(0.55_0.2_270/0.3)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[oklch(0.7_0.18_270)]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                My Documents
              </h1>
              <p className="text-xs text-muted-foreground">
                {docs.length} document{docs.length !== 1 ? "s" : ""} in your
                knowledge base
              </p>
            </div>
          </div>
          <Button
            data-ocid="my-documents.upload_button"
            type="button"
            size="sm"
            className="gap-1.5 bg-primary hover:bg-primary/90"
            onClick={() => setShowUpload(true)}
          >
            <Plus className="w-4 h-4" />
            Add Document
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {loadingDocs ? (
            <div data-ocid="my-documents.loading_state" className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : docs.length === 0 ? (
            <div
              data-ocid="my-documents.empty_state"
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/40 border border-border flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                No documents yet
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Upload scripts, guides, and playbooks to power your AI
                assistant.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => setShowUpload(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Upload First Document
              </Button>
            </div>
          ) : (
            <Card className="bg-card border-border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                        Title
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">
                        Collection
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                        Chunks
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                        Uploaded
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((doc, idx) => (
                      <tr
                        key={doc.id}
                        data-ocid={`my-documents.item.${idx + 1}`}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-muted/50 border border-border flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-medium text-foreground truncate">
                              {doc.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${COL_BADGE[doc.collectionName] ?? DEFAULT_BADGE}`}
                          >
                            {COL_LABELS[doc.collectionName]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-muted-foreground hidden sm:table-cell">
                          {doc.chunkCount}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                          {fmtDate(doc.uploadedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            data-ocid={`my-documents.delete_button.${idx + 1}`}
                            aria-label="Delete document"
                            onClick={() => handleDelete(doc.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Dialog
        open={showUpload}
        onOpenChange={(open) => {
          if (!open) {
            setShowUpload(false);
            setUploadError(null);
          }
        }}
      >
        <DialogContent
          data-ocid="my-documents.dialog"
          className="bg-card border-border max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Upload className="w-4 h-4 text-primary" />
              Add New Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="doc-title"
                className="text-sm font-medium text-foreground"
              >
                Document Title
              </Label>
              <Input
                id="doc-title"
                data-ocid="my-documents.title.input"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Roofing Discovery Call Script"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Collection
              </Label>
              <select
                data-ocid="my-documents.collection.select"
                value={uploadCollection}
                onChange={(e) =>
                  setUploadCollection(e.target.value as CollectionName)
                }
                className="w-full rounded-md bg-background border border-border text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {ALL_COLLECTIONS.map((col) => (
                  <option key={col} value={col}>
                    {COL_LABELS[col]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="doc-content"
                className="text-sm font-medium text-foreground"
              >
                Content
              </Label>
              <textarea
                id="doc-content"
                data-ocid="my-documents.content.textarea"
                value={uploadContent}
                onChange={(e) => setUploadContent(e.target.value)}
                placeholder="Paste your document content here…"
                rows={6}
                className="w-full rounded-md bg-background border border-border text-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {uploadError && (
              <p
                data-ocid="my-documents.error_state"
                className="text-xs text-destructive"
              >
                {uploadError}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button
                data-ocid="my-documents.cancel_button"
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </Button>
              <Button
                data-ocid="my-documents.submit_button"
                type="button"
                size="sm"
                disabled={isLoading}
                onClick={handleUpload}
                className="bg-primary hover:bg-primary/90"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
