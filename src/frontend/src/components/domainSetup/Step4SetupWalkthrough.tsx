import { CheckSquare, Square } from "lucide-react";
import { useState } from "react";
import type { Registrar } from "../../types/domainSetup";
import { Button } from "../ui/button";

interface InstructionStep {
  text: string;
}

interface RegistrarInstructions {
  label: string;
  steps: InstructionStep[];
}

const INSTRUCTIONS: Record<Registrar, RegistrarInstructions> = {
  godaddy: {
    label: "GoDaddy",
    steps: [
      { text: "Log into godaddy.com with your account credentials." },
      { text: 'Click "DNS" next to your domain in My Products.' },
      { text: 'Under "Records", scroll down and click "ADD".' },
      {
        text: 'Select Type "A" → Name: @ → Value: 76.76.21.21 → TTL: 1 Hour → click Save.',
      },
      {
        text: 'Click "ADD" again → Type: CNAME → Name: www → Value: bookedrankedfunded.org → TTL: 1 Hour → click Save.',
      },
    ],
  },
  namecheap: {
    label: "Namecheap",
    steps: [
      {
        text: 'Log into namecheap.com and click "Domain List" in the left sidebar.',
      },
      { text: 'Click "MANAGE" next to your domain.' },
      { text: 'Click the "Advanced DNS" tab at the top.' },
      { text: 'Under "HOST RECORDS", click "ADD NEW RECORD".' },
      {
        text: "A Record: Host @, Value 76.76.21.21, TTL Automatic → click the checkmark to save.",
      },
      {
        text: "CNAME Record: Host www, Value bookedrankedfunded.org, TTL Automatic → save.",
      },
    ],
  },
  cloudflare: {
    label: "Cloudflare",
    steps: [
      {
        text: "Log into cloudflare.com and select your domain from the dashboard.",
      },
      { text: 'Click "DNS" in the left sidebar.' },
      {
        text: 'Click "Add record" → Type A → Name @ → IPv4: 76.76.21.21 → Save.',
      },
      {
        text: 'Click "Add record" → Type CNAME → Name www → Target bookedrankedfunded.org → Save.',
      },
      {
        text: 'IMPORTANT: Set Proxy Status to "DNS only" (gray cloud icon) for both records.',
      },
    ],
  },
  other: {
    label: "Your Registrar",
    steps: [
      { text: "Log into your domain registrar's control panel." },
      {
        text: 'Find the "DNS Management" or "DNS Zone" section for your domain.',
      },
      {
        text: 'Add an A Record: Host/Name "@", Value/IP "76.76.21.21", TTL 1 Hour.',
      },
      {
        text: 'Add a CNAME Record: Host/Name "www", Value/Target "bookedrankedfunded.org", TTL 1 Hour.',
      },
      {
        text: "Save both records. Allow 15–30 minutes for changes to propagate.",
      },
    ],
  },
};

interface Props {
  registrar: Registrar;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4SetupWalkthrough({
  registrar,
  onNext,
  onBack,
}: Props) {
  const instructions = INSTRUCTIONS[registrar];
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const allChecked = checkedSteps.size >= instructions.steps.length;

  return (
    <div className="card-dark rounded-xl p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-lg">
            📖
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step 4 of 7
            </p>
            <h2 className="text-xl font-bold text-foreground">
              {instructions.label} Setup Guide
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Follow these exact steps in your {instructions.label} account. Check
          each step as you complete it.
        </p>
      </div>

      {/* Step checklist */}
      <div className="space-y-3 max-w-lg" data-ocid="domain.step4.checklist">
        {instructions.steps.map((step, idx) => {
          const isChecked = checkedSteps.has(idx);
          return (
            <button
              key={step.text}
              type="button"
              data-ocid={`domain.step4.checklist.item.${idx + 1}`}
              onClick={() => toggleStep(idx)}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-smooth
                ${
                  isChecked
                    ? "bg-emerald-600/12 border-emerald-500/30"
                    : "bg-muted/20 border-border hover:border-border/80"
                }
              `}
              aria-pressed={isChecked}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isChecked ? (
                  <CheckSquare size={18} className="text-emerald-400" />
                ) : (
                  <Square size={18} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-muted-foreground mr-2">
                  Step {idx + 1}
                </span>
                <span
                  className={`text-sm leading-relaxed ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}
                >
                  {step.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress note */}
      {!allChecked && (
        <p className="text-xs text-muted-foreground">
          {checkedSteps.size} of {instructions.steps.length} steps completed —
          you can still continue without checking all steps.
        </p>
      )}
      {allChecked && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
          <span>✓</span> All steps completed — ready to check propagation!
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          data-ocid="domain.step4.primary_button"
          onClick={onNext}
          className="h-11 px-6 font-semibold"
        >
          I've Added the Records — Check Propagation →
        </Button>
        <Button
          data-ocid="domain.step4.cancel_button"
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
