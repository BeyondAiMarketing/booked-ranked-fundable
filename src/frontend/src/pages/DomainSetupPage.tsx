import { Globe, Loader2 } from "lucide-react";
import DomainWizardShell from "../components/domainSetup/DomainWizardShell";
import Step1DomainEntry from "../components/domainSetup/Step1DomainEntry";
import Step2RegistrarDetection from "../components/domainSetup/Step2RegistrarDetection";
import Step3DNSRecords from "../components/domainSetup/Step3DNSRecords";
import Step4SetupWalkthrough from "../components/domainSetup/Step4SetupWalkthrough";
import Step5PropagationMonitor from "../components/domainSetup/Step5PropagationMonitor";
import Step6SiteImport from "../components/domainSetup/Step6SiteImport";
import Step7Activation from "../components/domainSetup/Step7Activation";
import { useDomainSetup } from "../hooks/useDomainSetup";

export default function DomainSetupPage() {
  const {
    state,
    isSaving,
    isLoading,
    setDomain,
    confirmRegistrar,
    advanceToStep,
    markDnsAdded,
    checkPropagationOnce,
    continueAnyway,
    startSiteImport,
    skipSiteImport,
    activateDomain,
    reset,
    update,
  } = useDomainSetup();

  const {
    currentStep,
    domain,
    registrar,
    propagationPercentage,
    propagationComplete,
    siteImportStatus,
    importedContent,
  } = state;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1DomainEntry
            domain={domain}
            onDomainChange={setDomain}
            onNext={() => advanceToStep(2)}
          />
        );
      case 2:
        return (
          <Step2RegistrarDetection
            domain={domain}
            selectedRegistrar={registrar}
            onSelect={(r) => update({ registrar: r })}
            onConfirm={confirmRegistrar}
            onBack={() => advanceToStep(1)}
          />
        );
      case 3:
        return (
          <Step3DNSRecords
            onNext={() => advanceToStep(4)}
            onBack={() => advanceToStep(2)}
          />
        );
      case 4:
        return registrar ? (
          <Step4SetupWalkthrough
            registrar={registrar}
            onNext={markDnsAdded}
            onBack={() => advanceToStep(3)}
          />
        ) : null;
      case 5:
        return (
          <Step5PropagationMonitor
            domain={domain}
            propagationPercentage={propagationPercentage}
            propagationComplete={propagationComplete}
            onCheckAgain={checkPropagationOnce}
            onContinueAnyway={continueAnyway}
            onNext={() => advanceToStep(6)}
          />
        );
      case 6:
        return (
          <Step6SiteImport
            domain={domain}
            importStatus={siteImportStatus}
            importedContent={importedContent}
            onStartImport={startSiteImport}
            onSkip={skipSiteImport}
            onNext={() => advanceToStep(7)}
          />
        );
      case 7:
        return (
          <Step7Activation
            state={state}
            onActivate={activateDomain}
            onReset={reset}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="domain.loading_state"
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 size={28} className="animate-spin text-primary" />
          <p className="text-sm">Loading domain setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-ocid="domain.page" className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
              <Globe size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Domain Configuration Agent
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Connect any client's custom domain to BRF in 7 guided steps — no
                guesswork.
              </p>
            </div>
          </div>
        </div>
        {domain && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border text-sm">
            <Globe size={14} className="text-muted-foreground" />
            <span className="font-mono text-foreground">{domain}</span>
          </div>
        )}
      </div>

      {/* Wizard shell */}
      <DomainWizardShell
        currentStep={currentStep}
        onStepClick={advanceToStep}
        isSaving={isSaving}
      >
        <div data-ocid="domain.wizard.panel">{renderStep()}</div>
      </DomainWizardShell>
    </div>
  );
}
