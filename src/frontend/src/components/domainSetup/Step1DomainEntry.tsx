import { ArrowRight, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  domain: string;
  onDomainChange: (d: string) => void;
  onNext: () => void;
}

export default function Step1DomainEntry({
  domain,
  onDomainChange,
  onNext,
}: Props) {
  const [raw, setRaw] = useState(domain);
  const [error, setError] = useState("");

  const handleChange = (val: string) => {
    setRaw(val);
    setError("");
    // Auto-strip protocol/www live as user types
    const cleaned = val.replace(/^https?:\/\//, "").replace(/^www\./, "");
    onDomainChange(cleaned);
  };

  const handleNext = () => {
    if (!raw.trim()) {
      setError("Please enter a domain name to continue.");
      return;
    }
    const cleaned = raw
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .trim();
    if (!cleaned.includes(".")) {
      setError('That doesn\'t look like a valid domain. Try "mybusiness.com"');
      return;
    }
    onDomainChange(cleaned);
    onNext();
  };

  return (
    <div className="card-dark rounded-xl p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Globe size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step 1 of 7
            </p>
            <h2 className="text-xl font-bold text-foreground">
              Enter Client Domain
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
          Enter the domain name your client wants to connect to BRF. We'll
          generate the exact DNS records they need — just two entries and
          they're live.
        </p>
      </div>

      {/* Domain Input */}
      <div className="space-y-3 max-w-md">
        <Label
          htmlFor="domain-input"
          className="text-sm font-medium text-foreground"
        >
          Domain Name
        </Label>
        <div className="relative">
          <Input
            id="domain-input"
            data-ocid="domain.step1.input"
            type="text"
            value={raw}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNext()}
            placeholder="mybusiness.com"
            className="pr-4 font-mono text-sm bg-background border-input h-12"
            aria-describedby={error ? "domain-error" : undefined}
            aria-invalid={!!error}
          />
        </div>
        {error && (
          <p
            id="domain-error"
            data-ocid="domain.step1.field_error"
            className="text-xs text-destructive"
          >
            {error}
          </p>
        )}
        {raw && !error && (
          <p className="text-xs text-muted-foreground">
            Will connect:{" "}
            <span className="font-mono text-primary">
              {raw
                .replace(/^https?:\/\//, "")
                .replace(/^www\./, "")
                .trim()}
            </span>
          </p>
        )}
      </div>

      {/* Security note */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/40 border border-border max-w-md">
        <Lock
          size={16}
          className="text-muted-foreground mt-0.5 flex-shrink-0"
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          We never store registrar passwords. Login credentials are used once to
          generate DNS records and are never saved or transmitted to any server.
        </p>
      </div>

      {/* CTA */}
      <div>
        <Button
          data-ocid="domain.step1.primary_button"
          onClick={handleNext}
          className="h-12 px-8 gap-2 font-semibold"
          size="lg"
        >
          Detect My Registrar
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
