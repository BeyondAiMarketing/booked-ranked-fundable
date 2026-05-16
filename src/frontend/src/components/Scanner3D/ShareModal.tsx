import { Check, Copy, Facebook, Mail, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ShareModalProps {
  modelId: string;
  title: string;
  onClose: () => void;
}

export default function ShareModal({
  modelId,
  title,
  onClose,
}: ShareModalProps) {
  const baseUrl = "https://bookedrankedfunded.org";
  const viewUrl = `${baseUrl}/view-3d/${modelId}`;
  const embedCode = `<iframe src="${viewUrl}" width="800" height="500" frameborder="0" allowfullscreen allow="camera; gyroscope; accelerometer; xr-spatial-tracking" title="${title}"></iframe>`;

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const copyToClipboard = async (text: string, type: "url" | "embed") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "url") {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } else {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
      }
      toast.success(type === "url" ? "Link copied!" : "Embed code copied!");
    } catch {
      toast.error("Copy failed — please copy manually");
    }
  };

  const shareViaWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Check out this 3D tour: ${title}\n${viewUrl}`)}`,
      "_blank",
    );
  };

  const shareViaFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(viewUrl)}`,
      "_blank",
    );
  };

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(`3D Tour: ${title}`)}&body=${encodeURIComponent(`Check out this interactive 3D tour:\n\n${title}\n${viewUrl}`)}`,
      "_blank",
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        data-ocid="scanner3d.share.dialog"
        className="scanner-share-modal max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="scanner-share-title flex items-center gap-2">
            <Share2 size={16} className="text-primary" />
            Share 3D Tour
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-1 mb-4 truncate">
          {title}
        </p>

        {/* Public URL */}
        <div className="space-y-1.5 mb-4">
          <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
            Public Link
          </p>
          <div className="flex items-center gap-2">
            <div className="scanner-share-url flex-1 min-w-0">
              <span className="truncate text-xs">{viewUrl}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              data-ocid="scanner3d.share.copy_url.button"
              className="shrink-0"
              onClick={() => copyToClipboard(viewUrl, "url")}
            >
              {copiedUrl ? (
                <Check size={13} className="text-emerald-400" />
              ) : (
                <Copy size={13} />
              )}
              {copiedUrl ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Embed Code */}
        <div className="space-y-1.5 mb-5">
          <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
            Embed Code
          </p>
          <div className="flex items-start gap-2">
            <code className="scanner-share-url flex-1 text-[10px] leading-relaxed font-mono break-all">
              {embedCode}
            </code>
            <Button
              variant="outline"
              size="sm"
              data-ocid="scanner3d.share.copy_embed.button"
              className="shrink-0"
              onClick={() => copyToClipboard(embedCode, "embed")}
            >
              {copiedEmbed ? (
                <Check size={13} className="text-emerald-400" />
              ) : (
                <Copy size={13} />
              )}
              {copiedEmbed ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Social Share */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
            Share Via
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              data-ocid="scanner3d.share.whatsapp.button"
              className="flex-1 gap-1.5 text-xs"
              onClick={shareViaWhatsApp}
            >
              <span className="text-base leading-none">📱</span> WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-ocid="scanner3d.share.facebook.button"
              className="flex-1 gap-1.5 text-xs"
              onClick={shareViaFacebook}
            >
              <Facebook size={13} className="text-blue-400" /> Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-ocid="scanner3d.share.email.button"
              className="flex-1 gap-1.5 text-xs"
              onClick={shareViaEmail}
            >
              <Mail size={13} className="text-muted-foreground" /> Email
            </Button>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant="ghost"
            size="sm"
            data-ocid="scanner3d.share.close_button"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
