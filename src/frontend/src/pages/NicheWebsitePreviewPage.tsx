import { useParams } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useState } from "react";
import NicheWebsiteRenderer from "../components/NicheWebsiteRenderer";
import { getPreviewLink, getWebsiteById } from "../data/nicheWebsiteData";

export default function NicheWebsitePreviewPage() {
  const { previewId } = useParams({ strict: false }) as { previewId?: string };
  const [currentPage, setCurrentPage] = useState("home");

  const link = previewId ? getPreviewLink(previewId) : undefined;
  const website = link ? getWebsiteById(link.nicheWebsiteId) : undefined;

  // Not found or revoked
  if (!previewId || !link || !link.isActive || !website) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: "#0c0a09" }}
        data-ocid="preview.not_found_state"
      >
        <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5 mb-2">
          <ExternalLink size={28} className="text-white/30" />
        </div>
        <h1 className="text-2xl font-black text-white">
          Preview Not Available
        </h1>
        <p className="text-white/50 max-w-sm text-sm leading-relaxed">
          This preview link is no longer active or has been revoked. Please
          contact your account manager for an updated link.
        </p>
        <a
          href="/demo"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white"
          style={{ background: "#6d28d9" }}
        >
          <ArrowLeft size={14} /> Go to Demo
        </a>
      </div>
    );
  }

  const nicheLabel = website.nicheId.replace("-", " ");

  return (
    <div
      className="min-h-screen flex flex-col"
      data-ocid="preview.page"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Sticky prospect banner */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-2.5 shadow-lg"
        style={{ background: "#1e1b4b", borderBottom: "1px solid #3730a380" }}
        data-ocid="preview.prospect_banner"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0 animate-pulse" />
          <p className="text-sm font-semibold text-white truncate">
            Preview — {website.name}{" "}
            <span className="capitalize text-violet-300 font-normal">
              {nicheLabel}
            </span>{" "}
            {link.label ? `· ${link.label}` : ""}
          </p>
        </div>
        <a
          href="/demo"
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "#7c3aed" }}
          data-ocid="preview.get_website_button"
        >
          Get This Website <ExternalLink size={11} />
        </a>
      </div>

      {/* Website render */}
      <div className="flex-1" data-ocid="preview.canvas_target">
        <NicheWebsiteRenderer
          website={website}
          previewMode="desktop"
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          showPageNav
        />
      </div>
    </div>
  );
}
