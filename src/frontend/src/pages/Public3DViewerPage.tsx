import { useParams } from "@tanstack/react-router";
import { Box } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SuperSplatViewer from "../components/Scanner3D/SuperSplatViewer";

interface PublicScanModel {
  id: string;
  title: string;
  niche: "real-estate" | "roofing" | "restoration";
  modelUrl: string;
  status: "ready" | "pending" | "processing" | "failed";
}

// In a real app, this would call getScanModel(modelId) from the backend
const DEMO_PUBLIC_MODELS: Record<string, PublicScanModel> = {
  "scan-001": {
    id: "scan-001",
    title: "123 Maple Street - Residential",
    niche: "real-estate",
    modelUrl: "",
    status: "ready",
  },
  "scan-002": {
    id: "scan-002",
    title: "Oakwood Construction Site",
    niche: "roofing",
    modelUrl: "",
    status: "ready",
  },
};

export default function Public3DViewerPage() {
  const { modelId } = useParams({ from: "/view-3d/$modelId" });
  const [model, setModel] = useState<PublicScanModel | null | undefined>(
    undefined,
  );

  useEffect(() => {
    // Simulate backend call: getScanModel(modelId)
    const found = DEMO_PUBLIC_MODELS[modelId] ?? null;
    setModel(found);
    if (found) {
      // incrementScanModelViews — would call backend in real app
      document.title = `${found.title} — 3D Tour | BRF`;
    }
  }, [modelId]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal BRF header */}
      <header className="h-12 bg-card border-b border-border flex items-center px-4 gap-3 shrink-0">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center font-bold text-[10px] text-white">
          BRF
        </div>
        <span className="text-xs text-muted-foreground">
          Powered by{" "}
          <span className="font-semibold text-foreground">
            Booked Ranked Fundable
          </span>
        </span>
      </header>

      <main className="flex-1 flex flex-col" data-ocid="public3d.page">
        {model === undefined ? (
          // Loading
          <div className="flex-1 flex items-center justify-center">
            <div
              className="scanner-processing-card"
              data-ocid="public3d.loading_state"
            >
              <Box size={36} className="text-primary/40 mb-2" />
              <p className="text-sm text-muted-foreground">Loading 3D tour…</p>
            </div>
          </div>
        ) : model === null ? (
          // Not found
          <div
            className="flex-1 flex items-center justify-center flex-col gap-4 text-center p-6"
            data-ocid="public3d.not_found.empty_state"
          >
            <Box size={48} className="text-muted-foreground/30" />
            <div>
              <h1 className="text-xl font-bold text-foreground mb-2">
                Tour Not Found
              </h1>
              <p className="text-sm text-muted-foreground max-w-sm">
                This 3D tour may have been removed or the link has expired.
                Contact the business directly for more information.
              </p>
            </div>
          </div>
        ) : (
          // Model found — full page viewer
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-border bg-card">
              <h1 className="text-sm font-semibold text-foreground">
                {model.title}
              </h1>
            </div>
            <div className="flex-1 p-3 sm:p-4">
              <SuperSplatViewer
                modelUrl={model.modelUrl}
                title={model.title}
                niche={model.niche}
                onLeadCapture={() => {
                  toast.success(
                    "Your request was submitted — the team will be in touch shortly.",
                  );
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
