import { Link } from "@tanstack/react-router";
import {
  Box,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  ImagePlus,
  Loader2,
  MoreVertical,
  Plus,
  Share2,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ShareModal from "../components/Scanner3D/ShareModal";
import SuperSplatViewer from "../components/Scanner3D/SuperSplatViewer";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useApp } from "../context/AppContext";

const SCANNER_NICHES = [
  "Real Estate",
  "Roofing",
  "Restoration",
  "real-estate",
  "roofing",
  "restoration",
];

const NICHE_COPY: Record<
  string,
  { title: string; subtitle: string; cta: string; badge: string }
> = {
  "Real Estate": {
    title: "3D Property Tours",
    subtitle:
      "Let buyers walk through every listing from their phone — before they ever schedule a showing.",
    cta: "Schedule a Showing",
    badge: "Real Estate",
  },
  "real-estate": {
    title: "3D Property Tours",
    subtitle:
      "Let buyers walk through every listing from their phone — before they ever schedule a showing.",
    cta: "Schedule a Showing",
    badge: "Real Estate",
  },
  Roofing: {
    title: "3D Roof Scanner",
    subtitle:
      "Document job sites and roof damage in photorealistic 3D. Close estimates without the debate.",
    cta: "Get Your Free Estimate",
    badge: "Roofing",
  },
  roofing: {
    title: "3D Roof Scanner",
    subtitle:
      "Document job sites and roof damage in photorealistic 3D. Close estimates without the debate.",
    cta: "Get Your Free Estimate",
    badge: "Roofing",
  },
  Restoration: {
    title: "3D Damage Documentation",
    subtitle:
      "Capture water and fire damage in immersive 3D. Bulletproof your insurance claims.",
    cta: "Request Damage Assessment",
    badge: "Restoration",
  },
  restoration: {
    title: "3D Damage Documentation",
    subtitle:
      "Capture water and fire damage in immersive 3D. Bulletproof your insurance claims.",
    cta: "Request Damage Assessment",
    badge: "Restoration",
  },
};

type ScanStatus = "pending" | "processing" | "ready" | "failed";

interface ScanModel {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  niche: string;
  status: ScanStatus;
  photoCount: number;
  modelUrl?: string;
  thumbnailUrl?: string;
  views: number;
  createdAt: number;
}

const STATUS_CONFIG: Record<
  ScanStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: <Clock size={11} />,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    icon: <Loader2 size={11} className="animate-spin" />,
  },
  ready: {
    label: "Ready",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: <CheckCircle2 size={11} />,
  },
  failed: {
    label: "Failed",
    color: "bg-red-500/20 text-red-300 border-red-500/30",
    icon: <XCircle size={11} />,
  },
};

const DEMO_MODELS: ScanModel[] = [
  {
    id: "scan-001",
    tenantId: "tenant-demo",
    title: "123 Maple Street - Residential",
    description: "4-bedroom colonial, full interior walk-through",
    niche: "Real Estate",
    status: "ready",
    photoCount: 52,
    modelUrl: "",
    thumbnailUrl: "",
    views: 142,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "scan-002",
    tenantId: "tenant-demo",
    title: "Oakwood Construction Site",
    description: "Active roofing project documentation",
    niche: "Roofing",
    status: "ready",
    photoCount: 38,
    modelUrl: "",
    thumbnailUrl: "",
    views: 87,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: "scan-003",
    tenantId: "tenant-demo",
    title: "Harbor View Condo - Unit 4B",
    description: "Water damage assessment, main floor",
    niche: "Restoration",
    status: "processing",
    photoCount: 44,
    views: 0,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Scanner3DPage() {
  const { currentTenantId, getTenantById, isScanner3dEnabled } = useApp();
  const tenant = getTenantById(currentTenantId);
  const niche = tenant?.type ?? "";
  const isEnabled = isScanner3dEnabled(currentTenantId);
  const isSupported = SCANNER_NICHES.includes(niche);
  const nicheCopy = NICHE_COPY[niche] ?? NICHE_COPY["Real Estate"];

  const [activeTab, setActiveTab] = useState("models");
  const [models, setModels] = useState<ScanModel[]>(DEMO_MODELS);
  const [viewingModel, setViewingModel] = useState<ScanModel | null>(null);
  const [shareModel, setShareModel] = useState<ScanModel | null>(null);
  const [editingModel, setEditingModel] = useState<ScanModel | null>(null);

  // Upload state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll processing models
  useEffect(() => {
    const processingModels = models.filter(
      (m) => m.status === "pending" || m.status === "processing",
    );
    if (processingModels.length === 0) return;
    const interval = setInterval(() => {
      setModels((prev) =>
        prev.map((m) => {
          if (m.status !== "pending" && m.status !== "processing") return m;
          // Simulate progression after a delay
          const age = Date.now() - m.createdAt;
          if (m.status === "pending" && age > 5000)
            return { ...m, status: "processing" };
          if (m.status === "processing" && age > 30000)
            return { ...m, status: "ready" };
          return m;
        }),
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [models]);

  if (!isEnabled || !isSupported) {
    return (
      <div
        data-ocid="scanner3d.not_activated.empty_state"
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Box size={36} className="text-primary/60" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            3D Scanner Not Activated
          </h2>
          <p className="text-muted-foreground max-w-sm">
            The 3D Scanner module is available for Real Estate, Roofing, and
            Restoration accounts. Contact your platform administrator to enable
            it for your account.
          </p>
        </div>
        <Link to="/settings">
          <Button variant="outline" data-ocid="scanner3d.contact_support.link">
            Contact Support
          </Button>
        </Link>
      </div>
    );
  }

  const MAX_PHOTOS = 60;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const incoming = Array.from(e.dataTransfer.files).filter((f) =>
      ["image/jpeg", "image/png", "image/heic", "image/jpg"].includes(f.type),
    );
    setSelectedFiles((prev) => {
      const merged = [...prev, ...incoming];
      if (merged.length > MAX_PHOTOS) {
        toast.error(
          `Maximum ${MAX_PHOTOS} photos allowed. ${merged.length - MAX_PHOTOS} photo(s) were not added.`,
        );
        return merged.slice(0, MAX_PHOTOS);
      }
      return merged;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    setSelectedFiles((prev) => {
      const merged = [...prev, ...incoming];
      if (merged.length > MAX_PHOTOS) {
        toast.error(
          `Maximum ${MAX_PHOTOS} photos allowed. ${merged.length - MAX_PHOTOS} photo(s) were not added.`,
        );
        return merged.slice(0, MAX_PHOTOS);
      }
      return merged;
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!uploadTitle.trim()) {
      toast.error("Property or site name is required");
      return;
    }
    if (selectedFiles.length < 8) {
      toast.error("Minimum 8 photos required for 3D model generation");
      return;
    }
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const newModel: ScanModel = {
      id: `scan-${Date.now()}`,
      tenantId: currentTenantId,
      title: uploadTitle,
      description: uploadDesc,
      niche,
      status: "pending",
      photoCount: selectedFiles.length,
      views: 0,
      createdAt: Date.now(),
    };
    setModels((prev) => [newModel, ...prev]);
    setUploadTitle("");
    setUploadDesc("");
    setSelectedFiles([]);
    setIsUploading(false);
    setActiveTab("models");
    toast.success("3D model generation started! Check back in a few minutes.");
  };

  const handleDelete = (id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
    toast.success("Model deleted");
  };

  const handleSaveEdit = () => {
    if (!editingModel) return;
    setModels((prev) =>
      prev.map((m) => (m.id === editingModel.id ? editingModel : m)),
    );
    setEditingModel(null);
    toast.success("Model updated");
  };

  if (viewingModel) {
    return (
      <div className="space-y-4" data-ocid="scanner3d.viewer.panel">
        <button
          type="button"
          onClick={() => setViewingModel(null)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="scanner3d.back_to_gallery.link"
        >
          ← Back to Gallery
        </button>
        <SuperSplatViewer
          modelUrl={viewingModel.modelUrl ?? ""}
          title={viewingModel.title}
          niche={
            viewingModel.niche.toLowerCase().replace(" ", "-") as
              | "real-estate"
              | "roofing"
              | "restoration"
          }
          onLeadCapture={() => {
            toast.success("Lead captured — check your CRM");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="scanner3d.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Box size={20} className="text-primary" />
            <h1 className="text-xl font-bold text-foreground">
              {nicheCopy.title}
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] border-primary/40 text-primary"
            >
              {nicheCopy.badge}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{nicheCopy.subtitle}</p>
        </div>
        <Button
          data-ocid="scanner3d.new_scan.primary_button"
          onClick={() => setActiveTab("upload")}
          className="bg-primary hover:bg-primary/90 shrink-0"
        >
          <Plus size={15} className="mr-1.5" />
          New Scan
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-ocid="scanner3d.tabs" className="mb-4">
          <TabsTrigger value="models" data-ocid="scanner3d.models.tab">
            My Models
          </TabsTrigger>
          <TabsTrigger value="upload" data-ocid="scanner3d.upload.tab">
            <ImagePlus size={13} className="mr-1" />
            New Upload
          </TabsTrigger>
        </TabsList>

        {/* ── My Models Tab ──────────────────────────────────────────────── */}
        <TabsContent value="models">
          {models.length === 0 ? (
            <div
              data-ocid="scanner3d.models.empty_state"
              className="scanner-empty-state"
            >
              <Box size={40} className="text-primary/40 mb-3" />
              <p className="text-base font-semibold text-foreground mb-1">
                No 3D models yet
              </p>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs text-center">
                Upload photos of a property or job site to generate your first
                interactive 3D model.
              </p>
              <Button
                data-ocid="scanner3d.first_scan.primary_button"
                onClick={() => setActiveTab("upload")}
              >
                <Plus size={14} className="mr-1.5" />
                Create First Scan
              </Button>
            </div>
          ) : (
            <div className="scanner-model-gallery">
              {models.map((model, i) => {
                const sc = STATUS_CONFIG[model.status];
                return (
                  <div
                    key={model.id}
                    data-ocid={`scanner3d.model.item.${i + 1}`}
                    className="scanner-model-card"
                  >
                    {/* Thumbnail */}
                    <div className="scanner-model-thumbnail">
                      {model.thumbnailUrl ? (
                        <img src={model.thumbnailUrl} alt={model.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Box size={32} className="text-primary/30" />
                        </div>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border absolute top-2 right-2 ${sc.color}`}
                      >
                        {sc.icon}
                        {sc.label}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="scanner-model-info">
                      <p className="scanner-model-name" title={model.title}>
                        {model.title}
                      </p>
                      <div className="scanner-model-meta">
                        <span className="scanner-model-badge">
                          {model.niche}
                        </span>
                        <span className="scanner-model-views">
                          {model.views}
                        </span>
                        <span className="scanner-model-date">
                          {formatDate(model.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="scanner-model-actions">
                      <button
                        type="button"
                        data-ocid={`scanner3d.view.button.${i + 1}`}
                        className="scanner-model-btn"
                        disabled={model.status !== "ready"}
                        onClick={() => setViewingModel(model)}
                        title="View 3D Model"
                      >
                        <Eye size={13} />
                        View
                      </button>
                      <button
                        type="button"
                        data-ocid={`scanner3d.share.button.${i + 1}`}
                        className="scanner-model-btn"
                        disabled={model.status !== "ready"}
                        onClick={() => setShareModel(model)}
                        title="Share"
                      >
                        <Share2 size={13} />
                        Share
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            data-ocid={`scanner3d.more.button.${i + 1}`}
                            className="scanner-model-btn"
                            title="More actions"
                          >
                            <MoreVertical size={13} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            data-ocid={`scanner3d.edit.button.${i + 1}`}
                            onClick={() => setEditingModel({ ...model })}
                          >
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            data-ocid={`scanner3d.delete.button.${i + 1}`}
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(model.id)}
                          >
                            <Trash2 size={13} className="mr-1.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ── New Upload Tab ─────────────────────────────────────────────── */}
        <TabsContent value="upload">
          <div className="max-w-2xl space-y-6">
            <Card data-ocid="scanner3d.upload.card">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Upload Photos to Generate 3D Model
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Upload 8–60 photos taken from different angles. More photos =
                  better 3D quality.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Property / Site Name *
                  </Label>
                  <Input
                    data-ocid="scanner3d.title.input"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. 123 Maple Street - Main Floor"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Description (optional)
                  </Label>
                  <Input
                    data-ocid="scanner3d.desc.input"
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    placeholder="e.g. 4-bedroom colonial, full interior walk-through"
                  />
                </div>

                {/* Drop Zone */}
                <button
                  type="button"
                  data-ocid="scanner3d.upload.dropzone"
                  className={`scanner-upload-zone w-full text-left ${dragActive ? "active" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.heic"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="scanner-upload-icon">
                    <Upload size={28} />
                  </div>
                  <p className="scanner-upload-title">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} photos selected`
                      : "Drag & drop photos here"}
                  </p>
                  <p className="scanner-upload-desc">
                    or click to browse your device
                  </p>
                  <p className="scanner-upload-limit">
                    JPG, JPEG, PNG, HEIC · 8–60 photos · Max 10 MB each
                  </p>
                </button>

                {/* Validation hint */}
                {selectedFiles.length > 0 && selectedFiles.length < 8 && (
                  <p className="text-xs text-amber-400">
                    ⚠ Need at least 8 photos — {8 - selectedFiles.length} more
                    required
                  </p>
                )}
                {selectedFiles.length > MAX_PHOTOS && (
                  <p className="text-xs text-red-400">
                    ⚠ Too many photos — maximum {MAX_PHOTOS} allowed
                  </p>
                )}

                {/* Photo Preview Grid */}
                {selectedFiles.length > 0 && (
                  <div
                    className="scanner-photo-grid"
                    data-ocid="scanner3d.photo.grid"
                  >
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        data-ocid={`scanner3d.photo.item.${idx + 1}`}
                        className="scanner-photo-thumbnail"
                      >
                        <img src={URL.createObjectURL(file)} alt={file.name} />
                        <button
                          type="button"
                          className="scanner-photo-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          aria-label="Remove photo"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  data-ocid="scanner3d.generate.submit_button"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={
                    selectedFiles.length < 8 ||
                    selectedFiles.length > MAX_PHOTOS ||
                    !uploadTitle.trim() ||
                    isUploading
                  }
                  onClick={handleSubmit}
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={15} className="mr-2 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Box size={15} className="mr-2" />
                      Generate 3D Model
                      {selectedFiles.length >= 8 && (
                        <span className="ml-2 text-xs opacity-70">
                          ({selectedFiles.length} photos)
                        </span>
                      )}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Share Modal */}
      {shareModel && (
        <ShareModal
          modelId={shareModel.id}
          title={shareModel.title}
          onClose={() => setShareModel(null)}
        />
      )}

      {/* Edit Modal */}
      {editingModel && (
        <div
          data-ocid="scanner3d.edit.dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Edit Model Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Name
                </Label>
                <Input
                  value={editingModel.title}
                  onChange={(e) =>
                    setEditingModel({ ...editingModel, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Description
                </Label>
                <Input
                  value={editingModel.description ?? ""}
                  onChange={(e) =>
                    setEditingModel({
                      ...editingModel,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid="scanner3d.edit.cancel_button"
                  onClick={() => setEditingModel(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  data-ocid="scanner3d.edit.save_button"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
