/**
 * SetupWizardModal — step-by-step setup guide for the 5 most critical integrations.
 * Opens in a Dialog (shadcn). Each integration has 3–5 steps with clear actions.
 *
 * Supported integrations: openai | elevenlabs | twilio | vapi | stripe
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, ExternalLink, X } from "lucide-react";
import { useState } from "react";

// ── Step definitions ──────────────────────────────────────────────────────────

interface WizardStep {
  title: string;
  description: string;
  action?: string; // CTA text for the step (optional)
  link?: { label: string; href: string };
  tip?: string;
}

interface WizardConfig {
  name: string;
  icon: string;
  tagline: string;
  steps: WizardStep[];
}

const WIZARD_CONFIGS: Record<string, WizardConfig> = {
  openai: {
    name: "OpenAI",
    icon: "🤖",
    tagline: "Your AI brain for copy, scoring, and agent responses.",
    steps: [
      {
        title: "Create an OpenAI account",
        description:
          "Go to platform.openai.com and sign in or create a free account. You'll need to add a payment method to generate API keys.",
        link: {
          label: "platform.openai.com",
          href: "https://platform.openai.com/api-keys",
        },
      },
      {
        title: "Generate your API key",
        description:
          'Click API Keys in the left sidebar → Create new secret key. Name it "BRF Platform". Copy the key immediately — OpenAI only shows it once.',
        tip: "Your key starts with sk-proj-... or sk-... Copy it before closing the modal.",
      },
      {
        title: "Paste the key in BRF",
        description:
          "Go to the OpenAI card above, click Configure, paste your key in the API Key field.",
      },
      {
        title: "Test & Save",
        description:
          "Click Test Connection to confirm it works, then hit Save. You'll see a green Connected badge appear.",
        tip: "Recommended model: GPT-4o for quality. Your LiteLLM config handles model routing.",
      },
    ],
  },
  elevenlabs: {
    name: "ElevenLabs Voice AI",
    icon: "🎙️",
    tagline: "The voice your prospects hear. Premium = trust.",
    steps: [
      {
        title: "Create an ElevenLabs account",
        description:
          "Go to elevenlabs.io and sign up for free. The free tier gives you 10,000 characters/month — enough to test every niche demo.",
        link: {
          label: "elevenlabs.io/sign-up",
          href: "https://elevenlabs.io/sign-up",
        },
      },
      {
        title: "Copy your API key",
        description:
          "Click your profile avatar in the bottom-left → Profile & API key. Your API key is listed there. It starts with sk_...",
        tip: "If you don't see an API key option, make sure you're on the Creator tier or above.",
      },
      {
        title: "Paste the key in BRF",
        description:
          "Find the ElevenLabs Voice AI card above, expand it, paste your API key in the API Key field.",
      },
      {
        title: "Test Connection",
        description:
          "Click Test Connection — BRF will verify your key and show how many voices are available in your account. All 10 niche demo voices are auto-assigned.",
        tip: "Once connected, ElevenLabs voices are preloaded before each demo call so they play instantly with zero delay.",
      },
    ],
  },
  twilio: {
    name: "Twilio (Calls + SMS)",
    icon: "📞",
    tagline: "Every missed call is a job for your competitor. Stop the bleed.",
    steps: [
      {
        title: "Create a Twilio account",
        description:
          "Go to console.twilio.com and sign up. You get a free trial number with $15 credit to start.",
        link: {
          label: "console.twilio.com",
          href: "https://console.twilio.com",
        },
      },
      {
        title: "Copy your Account SID and Auth Token",
        description:
          "From the Twilio Console home page, your Account SID and Auth Token are shown in the Account Info section. Copy both.",
        tip: "The Auth Token is hidden by default — click the eye icon to reveal it.",
      },
      {
        title: "Buy a phone number",
        description:
          "Go to Phone Numbers → Manage → Buy a Number. Search for a local number in your client's area code. Each number costs $1/month.",
      },
      {
        title: "Configure the webhook",
        description:
          "Click on your new number → Voice & Messaging. Set both the voice webhook and messaging webhook to your BRF endpoint (shown in the Twilio card above).",
        tip: "For SMS campaigns at volume, register for A2P 10DLC in Messaging → Regulatory Compliance. Prevents carrier filtering.",
      },
      {
        title: "Paste all three values in BRF",
        description:
          "Enter your Account SID, Auth Token, and the phone number (in E.164 format: +15551234567) in the Twilio card above and click Save.",
      },
    ],
  },
  vapi: {
    name: "Vapi.ai Voice Agent",
    icon: "🤝",
    tagline: "The AI that answers every call and closes the lead.",
    steps: [
      {
        title: "Create a Vapi account",
        description:
          "Go to vapi.ai and create a free account. Vapi handles real-time AI voice calls — this is what answers your client's phone.",
        link: { label: "vapi.ai", href: "https://vapi.ai" },
      },
      {
        title: "Create an assistant",
        description:
          "In your Vapi dashboard, go to Assistants → Create Assistant. Configure the greeting and system prompt for your niche (e.g. 'You are a receptionist for a plumbing company...').",
        tip: "BRF can provision niche-specific assistants automatically once your key is saved — use the Provision Voice Agents button.",
      },
      {
        title: "Copy your API key and Assistant ID",
        description:
          "Go to API Keys → Create Key and copy it. Then open your assistant and copy the Assistant ID from the details page.",
      },
      {
        title: "Connect Vapi to your Twilio number",
        description:
          "In Vapi, go to Phone Numbers → Link your Twilio number. This routes inbound calls to your AI assistant.",
        tip: "Your Vapi booking endpoint is shown in the Vapi card above — paste this into your Vapi Tool Configuration so appointments are written to BRF's CRM.",
      },
      {
        title: "Paste keys in BRF and provision",
        description:
          "Enter your Vapi API Key and Assistant ID above, click Save, then hit Provision Voice Agents for All Niches to spin up all 10 niche-specific agents.",
      },
    ],
  },
  stripe: {
    name: "Stripe",
    icon: "💳",
    tagline: "Get paid. On the spot. No chasing invoices.",
    steps: [
      {
        title: "Create a Stripe account",
        description:
          "Go to dashboard.stripe.com and create or log into your Stripe account. Activate your account for live payments when ready.",
        link: {
          label: "dashboard.stripe.com",
          href: "https://dashboard.stripe.com/apikeys",
        },
      },
      {
        title: "Copy your API keys",
        description:
          "Go to Developers → API Keys. Copy the Publishable Key (pk_live_...) and Secret Key (sk_live_...). Use test keys first to verify everything works.",
        tip: "Never expose your Secret Key in client-side code. BRF stores it encrypted in the backend canister.",
      },
      {
        title: "Paste both keys in BRF",
        description:
          "Find the Stripe card above, expand it, paste your Publishable Key and Secret Key in the respective fields.",
      },
      {
        title: "Set up a webhook",
        description:
          "In Stripe → Developers → Webhooks → Add endpoint. Paste your BRF webhook URL (shown in the Stripe card). Select: payment_intent.succeeded, invoice.paid, customer.subscription.updated.",
        tip: "Copy the Webhook Signing Secret that Stripe generates and keep it safe — you'll need it for the server.",
      },
      {
        title: "Test and go live",
        description:
          "Use test mode (pk_test_ / sk_test_) to run a test payment first. When everything works, swap in your live keys.",
      },
    ],
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

interface SetupWizardModalProps {
  integrationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SetupWizardModal({
  integrationId,
  isOpen,
  onClose,
}: SetupWizardModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const config = WIZARD_CONFIGS[integrationId];

  if (!config) return null;

  const step = config.steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === config.steps.length - 1;

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-lg bg-card border-white/10"
        data-ocid="golive.setup_wizard.dialog"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <span className="text-xl">{config.icon}</span>
              <span>Set Up {config.name}</span>
            </DialogTitle>
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-500 hover:text-foreground transition-colors"
              aria-label="Close"
              data-ocid="golive.setup_wizard.close_button"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-1">{config.tagline}</p>
        </DialogHeader>

        {/* Step progress */}
        <div className="flex items-center gap-1 mt-2">
          {config.steps.map((s, i) => (
            <div
              key={s.title}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? "bg-purple-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Step {currentStep + 1} of {config.steps.length}
        </p>

        {/* Current step content */}
        <div className="space-y-4 mt-2">
          <div className="flex items-start gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                isLast
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                  : "bg-purple-500/20 border border-purple-500/40 text-purple-400"
              }`}
            >
              {isLast ? <CheckCircle2 size={13} /> : currentStep + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.description}
              </p>
              {step.link && (
                <a
                  href={step.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                  data-ocid="golive.setup_wizard.external_link"
                >
                  <ExternalLink size={10} />
                  {step.link.label}
                </a>
              )}
              {step.tip && (
                <div className="mt-3 flex items-start gap-2 bg-purple-500/8 border border-purple-500/20 rounded-lg p-2.5">
                  <span className="text-purple-400 shrink-0 mt-0.5">💡</span>
                  <p className="text-xs text-purple-300/80 leading-relaxed">
                    {step.tip}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step list (completed steps shown as done) */}
          {config.steps.length > 1 && (
            <div className="space-y-1 pl-10">
              {config.steps.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setCurrentStep(i)}
                  className={`w-full text-left text-xs px-2 py-1 rounded transition-colors ${
                    i === currentStep
                      ? "text-purple-300 font-medium"
                      : i < currentStep
                        ? "text-emerald-400/70 line-through"
                        : "text-slate-600 hover:text-slate-400"
                  }`}
                  data-ocid={`golive.setup_wizard.step_${i + 1}.button`}
                >
                  {i < currentStep && "✓ "}
                  {s.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={isFirst}
            data-ocid="golive.setup_wizard.prev_button"
            className="text-slate-400"
          >
            ← Back
          </Button>
          {isLast ? (
            <Button
              size="sm"
              onClick={handleClose}
              data-ocid="golive.setup_wizard.done_button"
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <CheckCircle2 size={13} className="mr-1.5" />
              Done — Go Set It Up
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() =>
                setCurrentStep((s) => Math.min(config.steps.length - 1, s + 1))
              }
              data-ocid="golive.setup_wizard.next_button"
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              Next Step →
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Supported integration IDs ─────────────────────────────────────────────────
export const WIZARD_SUPPORTED_IDS = Object.keys(WIZARD_CONFIGS);
