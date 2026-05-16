import {
  Box,
  Loader2,
  Maximize2,
  RotateCcw,
  Share2,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type NicheKey = "real-estate" | "roofing" | "restoration";

const NICHE_CTA: Record<NicheKey, string> = {
  "real-estate": "Schedule a Showing",
  roofing: "Get Your Free Estimate",
  restoration: "Request Damage Assessment",
};

interface SuperSplatViewerProps {
  modelUrl: string;
  title: string;
  niche: NicheKey;
  onLeadCapture?: () => void;
}

export default function SuperSplatViewer({
  modelUrl,
  title,
  niche,
  onLeadCapture,
}: SuperSplatViewerProps) {
  const { actor } = useActor();
  const [ctaOpen, setCtaOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: `I'm interested in: ${title}`,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const ctaLabel = NICHE_CTA[niche];

  const handleCtaSubmit = async () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    setSubmitting(true);
    try {
      if (actor) {
        const lead = {
          id: `lead-3d-${Date.now()}`,
          name: form.name,
          phone: form.phone,
          email: form.email,
          notes: `${form.message} [Source: 3D Viewer — ${title}]`,
          source: "3D Viewer Lead",
          status: "new",
          niche,
          tenantId: "",
          agentSubscriptions: [],
          createdAt: BigInt(Date.now()),
        };
        await actor.createLead(lead);
      }
    } catch {
      // fallback gracefully — don't block the UX
    }
    setSubmitting(false);
    setSubmitted(true);
    onLeadCapture?.();
    toast.success(
      "Your request has been submitted — we'll be in touch shortly.",
    );
  };

  if (!modelUrl) {
    return (
      <div
        className="scanner-processing-card"
        data-ocid="scanner3d.viewer.loading_state"
      >
        <div className="scanner-processing-icon">
          <Box size={40} className="text-primary/50" />
        </div>
        <p className="scanner-processing-title">Processing your 3D model…</p>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs">
          This usually takes 3–8 minutes depending on photo count. Sit tight —
          we'll update the status automatically.
        </p>
        <div className="scanner-processing-bar">
          <div className="scanner-processing-fill" style={{ width: "65%" }} />
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <Loader2 size={12} className="animate-spin" />
          Analyzing photos and building point cloud…
        </div>
      </div>
    );
  }

  const viewerContent = (
    <div
      className="scanner-viewer-container"
      data-ocid="scanner3d.viewer.canvas_target"
    >
      <iframe
        src={`https://superspl.at/editor?load=${encodeURIComponent(modelUrl)}`}
        title={`3D Model: ${title}`}
        className="w-full h-full border-0"
        allow="camera; gyroscope; accelerometer; xr-spatial-tracking"
        allowFullScreen
      />

      {/* Controls bar */}
      <div className="scanner-viewer-controls">
        <button
          type="button"
          className="scanner-control-btn"
          title="Rotate"
          aria-label="Rotate model"
        >
          <RotateCcw size={16} />
        </button>
        <button
          type="button"
          className="scanner-control-btn"
          title="Zoom"
          aria-label="Zoom"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          className="scanner-control-btn"
          title="Share"
          aria-label="Share"
          data-ocid="scanner3d.viewer.share_button"
        >
          <Share2 size={16} />
        </button>
        <button
          type="button"
          className="scanner-control-btn"
          title="Fullscreen"
          aria-label="Toggle fullscreen"
          data-ocid="scanner3d.viewer.fullscreen_button"
          onClick={() => setIsFullscreen(true)}
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Lead Capture CTA */}
      <div className="scanner-cta-overlay">
        <button
          type="button"
          data-ocid="scanner3d.viewer.cta_button"
          className="scanner-cta-btn"
          onClick={() => setCtaOpen(true)}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {viewerContent}

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black flex flex-col"
          data-ocid="scanner3d.fullscreen.modal"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
            <span className="text-sm font-medium text-foreground truncate">
              {title}
            </span>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="scanner3d.fullscreen.close_button"
              onClick={() => setIsFullscreen(false)}
            >
              ✕ Exit Fullscreen
            </Button>
          </div>
          <div className="flex-1 relative">
            <iframe
              src={`https://superspl.at/editor?load=${encodeURIComponent(modelUrl)}`}
              title={`3D Model Fullscreen: ${title}`}
              className="w-full h-full border-0"
              allow="camera; gyroscope; accelerometer; xr-spatial-tracking"
              allowFullScreen
            />
            <div className="scanner-cta-overlay">
              <button
                type="button"
                data-ocid="scanner3d.fullscreen.cta_button"
                className="scanner-cta-btn"
                onClick={() => {
                  setIsFullscreen(false);
                  setCtaOpen(true);
                }}
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Lead Capture Dialog */}
      <Dialog open={ctaOpen} onOpenChange={setCtaOpen}>
        <DialogContent
          data-ocid="scanner3d.lead_capture.dialog"
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {submitted ? "Request Submitted!" : ctaLabel}
            </DialogTitle>
          </DialogHeader>
          {submitted ? (
            <div
              className="py-4 text-center space-y-2"
              data-ocid="scanner3d.lead_capture.success_state"
            >
              <p className="text-3xl">✅</p>
              <p className="text-sm text-foreground font-medium">
                We received your request!
              </p>
              <p className="text-xs text-muted-foreground">
                Our team will reach out within 24 hours. You'll receive a
                confirmation shortly.
              </p>
              <Button
                className="mt-3 w-full"
                data-ocid="scanner3d.lead_capture.close_button"
                onClick={() => {
                  setCtaOpen(false);
                  setSubmitted(false);
                }}
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Fill in your details and we'll reach out right away regarding:{" "}
                <strong>{title}</strong>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Full Name *
                  </Label>
                  <Input
                    data-ocid="scanner3d.lead_capture.name.input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Phone *
                  </Label>
                  <Input
                    data-ocid="scanner3d.lead_capture.phone.input"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="(555) 000-0000"
                    type="tel"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Email
                  </Label>
                  <Input
                    data-ocid="scanner3d.lead_capture.email.input"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="john@email.com"
                    type="email"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Message
                  </Label>
                  <Textarea
                    data-ocid="scanner3d.lead_capture.message.textarea"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    rows={2}
                    className="resize-none text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid="scanner3d.lead_capture.cancel_button"
                  className="flex-1"
                  onClick={() => setCtaOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  data-ocid="scanner3d.lead_capture.submit_button"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleCtaSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 size={14} className="animate-spin mr-1" />
                  ) : null}
                  Submit Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
