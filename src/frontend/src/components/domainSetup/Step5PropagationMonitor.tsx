import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface Props {
  domain: string;
  propagationPercentage: number;
  propagationComplete: boolean;
  onCheckAgain: () => void;
  onContinueAnyway: () => void;
  onNext: () => void;
}

const DNS_SERVERS = [
  "Google (8.8.8.8)",
  "Cloudflare (1.1.1.1)",
  "OpenDNS (208.67.222.222)",
  "Quad9 (9.9.9.9)",
  "Comcast (75.75.75.75)",
  "AT&T (68.94.156.1)",
  "Level3 (4.2.2.1)",
  "Verisign (64.6.64.6)",
];

export default function Step5PropagationMonitor({
  domain,
  propagationPercentage,
  propagationComplete,
  onCheckAgain,
  onContinueAnyway,
  onNext,
}: Props) {
  const [checking, setChecking] = useState(false);
  const [serverIndex, setServerIndex] = useState(0);

  useEffect(() => {
    if (checking) {
      const interval = setInterval(() => {
        setServerIndex((prev) => (prev + 1) % DNS_SERVERS.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [checking]);

  const handleCheck = () => {
    setChecking(true);
    setTimeout(() => setChecking(false), 4000);
    onCheckAgain();
  };

  const barColor =
    propagationPercentage >= 80
      ? "from-emerald-500 to-emerald-400"
      : propagationPercentage >= 40
        ? "from-amber-500 to-amber-400"
        : "from-primary to-primary/70";

  return (
    <div className="card-dark rounded-xl p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-lg">
            🌐
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step 5 of 7
            </p>
            <h2 className="text-xl font-bold text-foreground">
              {propagationComplete
                ? "✅ Domain is Live!"
                : "Checking Propagation..."}
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          {propagationComplete
            ? `${domain} is pointing to BRF worldwide!`
            : `Checking if ${domain} is live across DNS servers worldwide...`}
        </p>
      </div>

      {/* Propagation bar */}
      <div
        className="propagation-progress-section space-y-3 max-w-lg"
        data-ocid="domain.step5.propagation"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-medium">
            Propagation Progress
          </span>
          <span
            className={`font-bold ${propagationPercentage >= 80 ? "text-emerald-400" : "text-primary"}`}
          >
            {propagationPercentage}%
          </span>
        </div>
        <div className="h-4 rounded-full bg-muted overflow-hidden border border-border">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`}
            style={{ width: `${propagationPercentage}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {checking ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>
                Querying:{" "}
                <span className="text-foreground font-mono">
                  {DNS_SERVERS[serverIndex]}
                </span>
              </span>
            </>
          ) : (
            <span>Checking 8 DNS servers worldwide</span>
          )}
        </div>
      </div>

      {/* Server status grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg">
        {DNS_SERVERS.map((server, i) => {
          const resolved = i < Math.floor(propagationPercentage / 12.5);
          return (
            <div
              key={server}
              className={`p-2 rounded-lg border text-center text-xs transition-smooth
                ${
                  resolved
                    ? "bg-emerald-600/15 border-emerald-500/30 text-emerald-400"
                    : "bg-muted/20 border-border text-muted-foreground"
                }
              `}
            >
              {resolved ? "✓ " : "○ "}
              {server.split(" ")[0]}
            </div>
          );
        })}
      </div>

      {/* Zero % message */}
      {propagationPercentage === 0 && !checking && (
        <div
          data-ocid="domain.step5.error_state"
          className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 max-w-lg"
        >
          <p className="text-sm text-amber-200/80 leading-relaxed">
            <strong>0% propagated</strong> — DNS changes can take up to 48 hours
            to fully propagate. You can continue setting up your site and come
            back to verify later.
          </p>
        </div>
      )}

      {/* Pro tip */}
      {!propagationComplete && (
        <p className="text-xs text-muted-foreground max-w-lg">
          💡 <strong>Pro tip:</strong> Try opening{" "}
          <span className="font-mono text-primary">{domain}</span> in an
          incognito tab in a few minutes. If you see the BRF page, it's live!
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {propagationComplete ? (
          <Button
            data-ocid="domain.step5.primary_button"
            onClick={onNext}
            className="h-11 px-6 font-semibold"
          >
            Continue to Website Import →
          </Button>
        ) : (
          <>
            <Button
              data-ocid="domain.step5.secondary_button"
              variant="outline"
              onClick={handleCheck}
              disabled={checking}
              className="h-11 px-5 gap-2"
            >
              <RefreshCw size={14} className={checking ? "animate-spin" : ""} />
              Check Again
            </Button>
            <Button
              data-ocid="domain.step5.primary_button"
              onClick={onContinueAnyway}
              className="h-11 px-6 font-semibold"
            >
              Continue Anyway →
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
