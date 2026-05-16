import { CheckCircle2, ExternalLink, Rocket } from "lucide-react";
import type { DomainSetupState } from "../../types/domainSetup";
import { Button } from "../ui/button";

interface Props {
  state: DomainSetupState;
  onActivate: () => void;
  onReset: () => void;
}

export default function Step7Activation({ state, onActivate, onReset }: Props) {
  const { domain, registrar, dnsAdded, siteImportStatus, isActive } = state;

  const summaryItems = [
    { label: "Domain", value: domain, done: !!domain },
    {
      label: "Registrar",
      value: registrar
        ? registrar.charAt(0).toUpperCase() + registrar.slice(1)
        : "—",
      done: !!registrar,
    },
    {
      label: "DNS Records",
      value: dnsAdded ? "Added" : "Pending",
      done: dnsAdded,
    },
    {
      label: "Website Import",
      value:
        siteImportStatus === "done"
          ? "Complete"
          : siteImportStatus === "skipped"
            ? "Skipped"
            : "Pending",
      done: siteImportStatus === "done" || siteImportStatus === "skipped",
    },
  ];

  return (
    <div className="card-dark rounded-xl p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-lg">
            🎉
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step 7 of 7
            </p>
            <h2 className="text-xl font-bold text-foreground">
              {isActive ? `${domain} is Live!` : "Activate Your Domain"}
            </h2>
          </div>
        </div>
        {isActive ? (
          <p className="text-emerald-400 text-sm font-medium">
            Your domain is configured and active on BRF. 🚀
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Review your setup summary below, then activate to make{" "}
            <span className="font-mono text-primary">{domain}</span> live on
            BRF.
          </p>
        )}
      </div>

      {/* Summary card */}
      <div
        className="max-w-md p-5 rounded-xl border border-border bg-muted/20 space-y-3"
        data-ocid="domain.step7.summary"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Setup Summary
        </p>
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{item.label}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">{item.value}</span>
              {item.done ? (
                <CheckCircle2 size={14} className="text-emerald-400" />
              ) : (
                <span className="text-xs text-amber-400">Pending</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fallback note */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border max-w-md">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your original website continues to work as a fallback. You can switch
          between the original and BRF-hosted versions anytime from the Website
          Studio.
        </p>
      </div>

      {/* Actions */}
      {!isActive ? (
        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
          <Button
            data-ocid="domain.step7.primary_button"
            onClick={onActivate}
            className="h-12 px-6 gap-2 font-bold flex-1"
            size="lg"
          >
            <Rocket size={16} />
            Launch Live Site
          </Button>
          <Button
            data-ocid="domain.step7.secondary_button"
            variant="outline"
            onClick={() => window.open(`https://${domain}`, "_blank")}
            className="h-12 px-5 gap-2"
          >
            <ExternalLink size={14} />
            Preview First
          </Button>
        </div>
      ) : (
        <div className="space-y-4 max-w-md">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-600/15 border border-emerald-500/30">
            <CheckCircle2
              size={20}
              className="text-emerald-400 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-emerald-400">
                Domain activated successfully!
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  {domain}
                </a>{" "}
                is now serving from BRF.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              data-ocid="domain.step7.studio_button"
              onClick={() => window.open("/website-studio", "_blank")}
              className="h-10 px-5 gap-2"
            >
              <ExternalLink size={14} />
              Open Website Studio
            </Button>
            <Button
              data-ocid="domain.step7.reset_button"
              variant="ghost"
              onClick={onReset}
              className="h-10 px-4 text-muted-foreground text-sm"
            >
              Set Up Another Domain
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
