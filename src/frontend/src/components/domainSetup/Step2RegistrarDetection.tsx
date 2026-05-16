import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { REGISTRAR_OPTIONS, type Registrar } from "../../types/domainSetup";
import { Button } from "../ui/button";

interface Props {
  domain: string;
  selectedRegistrar: Registrar | null;
  onSelect: (r: Registrar) => void;
  onConfirm: (r: Registrar) => void;
  onBack: () => void;
}

// Simulate WHOIS detection based on domain TLD patterns
function detectRegistrar(domain: string): Registrar {
  const lower = domain.toLowerCase();
  if (
    lower.includes("godaddy") ||
    lower.endsWith(".co") ||
    lower.endsWith(".net")
  )
    return "godaddy";
  if (lower.endsWith(".io") || lower.endsWith(".app")) return "namecheap";
  if (lower.includes("cf-") || lower.endsWith(".dev")) return "cloudflare";
  return "godaddy"; // default — most common
}

export default function Step2RegistrarDetection({
  domain,
  selectedRegistrar,
  onSelect,
  onConfirm,
  onBack,
}: Props) {
  const [detecting, setDetecting] = useState(true);
  const [detectedSuggestion, setDetectedSuggestion] =
    useState<Registrar | null>(null);
  const [local, setLocal] = useState<Registrar | null>(selectedRegistrar);

  useEffect(() => {
    const timer = setTimeout(() => {
      const suggestion = detectRegistrar(domain);
      setDetectedSuggestion(suggestion);
      setLocal((prev) => prev ?? suggestion);
      setDetecting(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [domain]);

  const handleSelect = (r: Registrar) => {
    setLocal(r);
    onSelect(r);
  };

  const handleConfirm = () => {
    if (local) onConfirm(local);
  };

  const registrarColors: Record<Registrar, string> = {
    godaddy: "text-teal-400",
    namecheap: "text-orange-400",
    cloudflare: "text-amber-400",
    other: "text-primary",
  };

  return (
    <div className="card-dark rounded-xl p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-lg">
            🔍
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step 2 of 7
            </p>
            <h2 className="text-xl font-bold text-foreground">
              Choose Registrar
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Where was <span className="font-mono text-primary">{domain}</span>{" "}
          purchased? We'll generate registrar-specific setup instructions.
        </p>
      </div>

      {/* Detecting spinner */}
      {detecting && (
        <div
          data-ocid="domain.step2.loading_state"
          className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border"
        >
          <Loader2 size={18} className="animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Detecting your registrar based on domain patterns...
          </span>
        </div>
      )}

      {/* Registrar grid */}
      {!detecting && (
        <div
          className="grid grid-cols-2 gap-3 max-w-lg"
          data-ocid="domain.step2.registrar.list"
        >
          {REGISTRAR_OPTIONS.map((opt) => {
            const isSelected = local === opt.id;
            const isSuggested = detectedSuggestion === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                data-ocid={`domain.step2.registrar.${opt.id}`}
                onClick={() => handleSelect(opt.id)}
                className={`registrar-card relative p-4 rounded-xl border text-left transition-smooth
                  ${
                    isSelected
                      ? "bg-primary/15 border-primary/50 shadow-[0_0_16px_oklch(0.58_0.22_290/30%)]"
                      : "bg-card border-border hover:border-border/60"
                  }
                `}
                aria-pressed={isSelected}
              >
                {isSuggested && (
                  <span className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full">
                    Detected
                  </span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-lg font-bold ${registrarColors[opt.id]}`}
                  >
                    {opt.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 size={16} className="text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{opt.hint}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Actions */}
      {!detecting && (
        <div className="flex items-center gap-3">
          <Button
            data-ocid="domain.step2.primary_button"
            onClick={handleConfirm}
            disabled={!local}
            className="h-11 px-6 font-semibold"
          >
            Confirm &amp; Continue →
          </Button>
          <Button
            data-ocid="domain.step2.cancel_button"
            variant="ghost"
            onClick={onBack}
            className="h-11 px-4 text-muted-foreground"
          >
            ← Back
          </Button>
        </div>
      )}
    </div>
  );
}
