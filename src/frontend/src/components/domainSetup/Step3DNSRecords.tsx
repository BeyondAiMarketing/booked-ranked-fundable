import { CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DNS_RECORDS } from "../../types/domainSetup";
import { Button } from "../ui/button";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

interface DnsRecord {
  label: string;
  type: string;
  name: string;
  value: string;
  ttl: string;
  ocid: string;
}

const RECORDS: DnsRecord[] = [
  {
    label: "A Record",
    type: DNS_RECORDS.a.type,
    name: DNS_RECORDS.a.name,
    value: DNS_RECORDS.a.value,
    ttl: DNS_RECORDS.a.ttl,
    ocid: "domain.step3.dns_a",
  },
  {
    label: "CNAME Record",
    type: DNS_RECORDS.cname.type,
    name: DNS_RECORDS.cname.name,
    value: DNS_RECORDS.cname.value,
    ttl: DNS_RECORDS.cname.ttl,
    ocid: "domain.step3.dns_cname",
  },
];

function CopyBox({
  label,
  value,
  ocid,
}: { label: string; value: string; ocid: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dns-record-box flex items-center gap-2 p-3 rounded-lg bg-background border border-border">
      <code className="flex-1 font-mono text-sm text-foreground truncate min-w-0">
        {value}
      </code>
      <button
        type="button"
        data-ocid={`${ocid}.copy`}
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/15 text-primary border border-primary/30 text-xs font-semibold transition-smooth hover:bg-primary/25"
      >
        {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default function Step3DNSRecords({ onNext, onBack }: Props) {
  return (
    <div className="card-dark rounded-xl p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-lg">
            📋
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step 3 of 7
            </p>
            <h2 className="text-xl font-bold text-foreground">DNS Records</h2>
          </div>
        </div>
        <p className="text-muted-foreground text-sm max-w-lg">
          These two records are{" "}
          <strong className="text-foreground">all you need</strong>. Copy each
          value using the button on the right, then add them in your registrar's
          DNS panel.
        </p>
      </div>

      {/* DNS Record Cards */}
      <div className="space-y-5 max-w-lg">
        {RECORDS.map((rec) => (
          <div
            key={rec.type}
            data-ocid={rec.ocid}
            className="rounded-xl border border-border bg-muted/20 p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="badge-purple text-xs font-bold px-2.5 py-1 rounded-md">
                {rec.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <CopyBox
                  label="Type"
                  value={rec.type}
                  ocid={`${rec.ocid}.type`}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Name / Host
                </p>
                <CopyBox
                  label="Name"
                  value={rec.name}
                  ocid={`${rec.ocid}.name`}
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Value / Points To
              </p>
              <CopyBox
                label={`${rec.label} Value`}
                value={rec.value}
                ocid={`${rec.ocid}.value`}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">TTL</p>
              <div className="font-mono text-sm text-muted-foreground bg-background px-3 py-2 rounded-lg border border-border">
                {rec.ttl}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info callout */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 max-w-lg">
        <span className="text-amber-400 text-base mt-0.5">⏱</span>
        <p className="text-xs text-amber-200/80 leading-relaxed">
          DNS changes typically take <strong>15–30 minutes</strong>, but can
          take up to 48 hours to fully propagate worldwide. We'll monitor it for
          you after you add the records.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          data-ocid="domain.step3.primary_button"
          onClick={onNext}
          className="h-11 px-6 font-semibold"
        >
          I've Added These Records →
        </Button>
        <Button
          data-ocid="domain.step3.cancel_button"
          variant="ghost"
          onClick={onBack}
          className="h-11 px-4 text-muted-foreground"
        >
          ← Back
        </Button>
      </div>
    </div>
  );
}
