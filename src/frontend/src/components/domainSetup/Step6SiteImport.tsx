import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  ImportedContent,
  SiteImportStatus,
} from "../../types/domainSetup";
import { Button } from "../ui/button";

interface Props {
  domain: string;
  importStatus: SiteImportStatus;
  importedContent: ImportedContent | null;
  onStartImport: () => void;
  onSkip: () => void;
  onNext: () => void;
}

const SCAN_MESSAGES = [
  "Connecting to your website...",
  "Reading your homepage...",
  "Finding your services...",
  "Extracting contact information...",
  "Detecting color scheme...",
  "Analyzing page structure...",
  "Almost done...",
];

export default function Step6SiteImport({
  domain,
  importStatus,
  importedContent,
  onStartImport,
  onSkip,
  onNext,
}: Props) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (importStatus !== "scanning") return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => Math.min(prev + 1, SCAN_MESSAGES.length - 1));
    }, 500);
    return () => clearInterval(interval);
  }, [importStatus]);

  return (
    <div className="card-dark rounded-xl p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-lg">
            🏗️
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step 6 of 7
            </p>
            <h2 className="text-xl font-bold text-foreground">
              Import Existing Website
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          We'll scan your client's current website and import their content,
          services, and branding into the BRF Website Studio.
        </p>
      </div>

      {/* Current site card */}
      {importStatus === "pending" && (
        <div className="max-w-md">
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Current Website
                </p>
                <p className="font-mono text-sm text-foreground font-semibold">
                  {domain}
                </p>
              </div>
              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-smooth"
                aria-label="Open current website"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              data-ocid="domain.step6.scan_button"
              onClick={onStartImport}
              className="h-11 px-6 font-semibold"
            >
              Scan Website
            </Button>
            <Button
              data-ocid="domain.step6.skip_button"
              variant="ghost"
              onClick={onSkip}
              className="h-11 px-4 text-muted-foreground"
            >
              Skip — I'll Build Fresh in BRF
            </Button>
          </div>
        </div>
      )}

      {/* Scanning state */}
      {importStatus === "scanning" && (
        <div
          data-ocid="domain.step6.loading_state"
          className="max-w-md space-y-4"
        >
          <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/10">
            <Loader2
              size={20}
              className="animate-spin text-primary flex-shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Scanning website...
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {SCAN_MESSAGES[msgIndex]}
              </p>
            </div>
          </div>
          {/* Skeleton lines */}
          <div className="space-y-2">
            {[90, 70, 55, 80].map((w) => (
              <div
                key={w}
                className="h-3 rounded-full bg-muted animate-pulse"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Done state */}
      {importStatus === "done" && importedContent && (
        <div
          data-ocid="domain.step6.success_state"
          className="max-w-md space-y-5"
        >
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-600/10 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 size={18} />
              <span className="font-semibold text-sm">
                Import complete! We found:
              </span>
            </div>
            <ul className="space-y-2">
              {[
                { label: "Business name", value: importedContent.businessName },
                {
                  label: "Services",
                  value: importedContent.services.join(", "),
                },
                { label: "Contact info", value: importedContent.contactInfo },
                {
                  label: "Color scheme detected",
                  value: importedContent.colorScheme,
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>
                    <span className="text-muted-foreground">
                      {item.label}:{" "}
                    </span>
                    <span className="text-foreground font-medium">
                      {item.value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              data-ocid="domain.step6.primary_button"
              onClick={onNext}
              className="h-11 px-6 font-semibold"
            >
              Continue to Activation →
            </Button>
            <Button
              data-ocid="domain.step6.studio_button"
              variant="outline"
              onClick={() => window.open("/website-studio", "_blank")}
              className="h-11 px-5 gap-2"
            >
              <ExternalLink size={14} />
              Preview in BRF Studio
            </Button>
          </div>
        </div>
      )}

      {/* Skipped state */}
      {importStatus === "skipped" && (
        <div
          data-ocid="domain.step6.success_state"
          className="flex items-center gap-2 text-muted-foreground text-sm"
        >
          <CheckCircle2 size={16} className="text-primary" />
          <span>
            Skipped — you'll build from scratch in the BRF Website Studio.
          </span>
        </div>
      )}
    </div>
  );
}
