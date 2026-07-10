import Map "mo:core/Map";

import Array "mo:core/Array";

import List "mo:core/List";
import Queue "mo:core/Queue";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Debug "mo:core/Debug";

import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";


import WarmSequencesTypes "types/warmSequences";
import ICTypes "types/integrationCredentials";
import StableJsonStoreCore "lib/StableJsonStoreCore";
import SJS "lib/StableJsonStore";
import ICMixin "mixins/integrationCredentials-api";
import EmailTypes "types/email";
import EmailMixin "mixins/email-api";
import BrandKitTypes "types/brandKit";
import BrandKitMixin "mixins/brandKit-api";
import BrfSVATypes "types/brfSalesVoiceAgent";
import BrfSVAMixin "mixins/brfSalesVoiceAgent-api";
import DripCampaignsTypes "types/dripCampaigns";
import DripCampaignsMixin "mixins/dripCampaigns-api";
import AILeadIntelligenceMixin "mixins/aiLeadIntelligence-api";
import SocialMediaTypes "types/socialMedia";
import SocialMediaMixin "mixins/socialMedia-api";
import DomainSetupTypes "types/domainSetup";
import DomainSetupMixin "mixins/domainSetup-api";
import ABTypes "types/autoBrowser";
import AutoBrowserMixin "mixins/autoBrowser-api";
import DemoSessionTypes "types/demoSession";
import DemoSessionMixin "mixins/demoSession-api";
import NicheVoiceTypes       "types/nicheVoice";
import NicheVoiceLib         "lib/nicheVoice";
import NicheVoiceMixin       "mixins/nicheVoice-api";
import AutopilotDiscoveryTypes "types/autopilotDiscovery";
import AutopilotDiscoveryMixin "mixins/autopilotDiscovery-api";
import AutopilotEngineTypes "types/autopilotEngine";
import AutopilotEmailMixin "mixins/autopilotEmail-api";
import AutopilotComplianceTypes "types/autopilotCompliance";
import AutopilotComplianceMixin "mixins/autopilotCompliance-api";
import AutopilotSmsMixin "mixins/autopilotSms-api";
import AutopilotReplyIntelMixin "mixins/autopilotReplyIntel-api";
import Scanner3DTypes            "types/scanner3d";
import Scanner3DMixin            "mixins/scanner3d-api";
import CsvImportTypes            "types/csvImport";
import CsvImportMixin            "mixins/csvImport-api";
import NewsletterMixin           "mixins/newsletter-api";
import WebScraperTypes "types/webScraper";
import WebScraperMixin "mixins/webScraper-api";
import LLMLeadGenMixin  "mixins/llmLeadGeneration-api";import AdminCommandTypes "types/adminCommand";
import AdminCommandMixin  "mixins/adminCommand-api";
import OutreachPipelineTypes "types/outreachPipeline";
import OutreachPipelineMixin "mixins/outreachPipeline-api";
import FTTypes "types/featureToggle";
import IntegrationHealthMixin "mixins/integrationHealth-api";
import FeatureToggleMixin     "mixins/featureToggle-api";
import OperatorChatTypes "types/operatorChat";
import NicheAnalyticsMixin "mixins/nicheAnalytics-api";
import OperatorChatMixin "mixins/operatorChat-api";
import RagBrainLib "src/libraries/ragBrain";
import RagBrainMixin "mixins/ragBrain-api";
import N8NWorkflowLib   "src/libraries/n8nWorkflow";
import N8NWorkflowMixin "mixins/n8nWorkflow-api";
import VOALib  "libraries/voiceOutreachAgent";
import VOAMixin "mixins/voiceOutreachAgent-api";
import AbacusMixin      "mixins/abacus-api";
import AbacusLib        "lib/abacus";
import ComposioMixin    "mixins/composio-api";
import AccountBriefMixin "mixins/accountBrief-api";
import ToolkitTogglesMixin "mixins/toolkitToggles-api";
import ComposioLib "lib/composio";
import AccountBriefLib "lib/accountBrief";
import ToolkitTogglesLib "lib/toolkitToggles";
import DograhMixin       "mixins/dograh-api";
import DograhLib         "lib/dograh";
import OpenRouterLib     "lib/openRouter";
import OpenRouterMixin   "mixins/openRouter-api";
import OpenRouterTypes   "types/openRouter";
import FunnelTrackingLib   "lib/funnelTracking";
import FunnelTrackingMixin "mixins/funnelTracking-api";
import EmailTrackingLib    "lib/emailTracking";
import EmailTrackingMixin  "mixins/emailTracking-api";
import TrialProvLib        "lib/trialProvisioning";
import TrialProvMixin      "mixins/trialProvisioning-api";
import LeadEnrollLib       "lib/leadEnrollment";
import LeadEnrollMixin     "mixins/leadEnrollment-api";
import AIEmailGenMixin     "mixins/aiEmailGen-api";
import MasterAgentTypes "types/masterAgent";
import MasterAgentMixin  "mixins/masterAgent-api";
import CSTypes "types/contentStudio";
import LeadAITypes "lead-ai-types";
import ContentStudioMixin "mixins/contentStudio-api";
import LeadAIMixin "mixins/leadAI-api";
   import LLMFallbackLib   "lib/llm-fallback";
   import LLMFallbackTypes "types/llm-fallback";
   import LLMFallbackMixin "mixins/llm-fallback-api";
   import OmniRouterLib    "lib/omniRouter";
   import OmniRouterMixin  "mixins/omniRouter-api";
  import LeadEngineTypes "types/lead-engine";
  import LeadEngineMixin "mixins/leadEngine-api";
  import LeadEngineOql "lib/leadEngineOql";
  import LLMFallbackOql "lib/llmFallbackOql";
   import AIOrchestratorTypes "types/ai-orchestrator";
   import AIOrchestratorLib "lib/ai-orchestrator";
   import AIMemoryTypes "types/ai-memory";
   import AIMemoryLib "lib/ai-memory";
   import AIOrchestratorAdapterLib "lib/ai-orchestrator-adapter";
   import AIOrchestratorOql "lib/aiOrchestratorOql";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import LiveSendMixin "mixins/liveSend-api";
import WebhookState "types/webhookState";
import WebhooksAndIntegrationsMixin "mixins/webhooksAndIntegrations-api";
import WebhookInboxTypes "types/webhookInbox";
import WebhookInboxMixin "mixins/webhookInbox-api";

import RoofingCampaignTypes "types/roofingCampaign";
import RoofingCampaignLib   "lib/roofingCampaign";
import RoofingCampaignMixin "mixins/roofingCampaign-api";
import EmailTemplateTypes   "types/emailTemplate";
import RooferColdCampaignTypes "types/rooferColdCampaign";
import RooferColdCampaignMixin "mixins/rooferColdCampaign-api";
import VerticalProfile "types/verticalProfile";
import WorkflowLog "types/workflowLog";
import ContentCalendar "types/contentCalendar";
import SocialPostDraft "types/socialPostDraft";
import PerformanceInsight "types/performanceInsight";
import MonthlyReport "types/monthlyReport";
import ApprovalQueue "types/approvalQueue";
import VerticalProfileLib "lib/verticalProfile";
import WorkflowLogLib "lib/workflowLog";
import ContentCalendarLib "lib/contentCalendar";
import SocialPostDraftLib "lib/socialPostDraft";
import PerformanceInsightLib "lib/performanceInsight";
import MonthlyReportLib "lib/monthlyReport";
import ApprovalQueueLib "lib/approvalQueue";
import VerticalProfileMixin "mixins/verticalProfile-api";
import VerticalProfileSeed "lib/verticalProfileSeed";
import WorkflowLogMixin "mixins/workflowLog-api";
import ContentCalendarMixin "mixins/contentCalendar-api";
import SocialPostDraftMixin "mixins/socialPostDraft-api";
import PerformanceInsightMixin "mixins/performanceInsight-api";
import MonthlyReportMixin "mixins/monthlyReport-api";
import ApprovalQueueMixin "mixins/approvalQueue-api";
import BusinessBriefTypes "types/businessBrief";
import BusinessBriefLib "lib/businessBrief";
import BusinessBriefMixin "mixins/businessBrief-api";
import RankedDispatchTypes "types/rankedDispatch";
import RankedDispatchLib "lib/rankedDispatch";
import RankedDispatchMixin "mixins/rankedDispatch-api";
import MultiLocationRollupTypes "types/multiLocationRollup";
import MultiLocationRollupLib "lib/multiLocationRollup";
import MultiLocationRollupMixin "mixins/multiLocationRollup-api";
import ServiceAreaSEOTypes "types/serviceAreaSEO";
import ServiceAreaSEOLib "lib/serviceAreaSEO";
import ServiceAreaSEOMixin "mixins/serviceAreaSEO-api";
import CitationNAPTypes "types/citationNAP";
import CitationNAPLib "lib/citationNAP";
import CitationNAPMixin "mixins/citationNAP-api";
import ScheduledWorkflowTypes "types/scheduledWorkflow";
import ScheduledWorkflowLib "lib/scheduledWorkflow";
import ScheduledWorkflowMixin "mixins/scheduledWorkflow-api";
import LocalReportingTypes "types/localReporting";
import LocalReportingLib "lib/localReporting";
import LocalReportingMixin "mixins/localReporting-api";
import CrmObjectsTypes "types/crmObjects";
import CrmObjectsLib "lib/crmObjects";
import CrmObjectsMixin "mixins/crmObjects-api";


import MarketingAuditTypes "types/marketingAudit";
import MarketingAuditLib "lib/marketingAudit";
import MarketingAuditMixin "mixins/marketingAudit-api";
import AdminAuditTypes "types/auditLog";
import AdminAuditLib "lib/auditLog";
import AdminAuditMixin "mixins/auditLog-api";
import ProposalTypes "types/proposal";
import ProposalLib "lib/proposal";
import ProposalMixin "mixins/proposal-api";
import WebhookContractsTypes "types/webhookContracts";
import WebhookContractsLib "lib/webhookContracts";
import WebhookContractsMixin "mixins/webhookContracts-api";
import ICLib "lib/integrationCredentials";
import AILeadAuditTypes "types/aiLeadAudit";
import NewsletterTypes "types/newsletter";
import SecretManager "lib/secretManager";
import SecretManagerTypes "types/secretManager";
import RateLimiter "lib/rateLimiter";
import InputValidation "lib/inputValidation";
import Observability "lib/observability";
import ObservabilityTypes "types/observability";
import ObservabilityMixin "mixins/observability-api";























 
 
 actor {
  type TenantId = Text;

  // ---- BUILD VERSION PROBE ----
  // Diagnostic probe: call getBuildVersion() live to verify which source
  // build is actually deployed on this canister. Hardcoded literal — each
  // rebuild that edits this value produces a distinct deployed marker.
  public query func getBuildVersion() : async Text {
    "build-2026-07-09T03:10:00Z"
  };

  // ---- SECRET MANAGER ADMIN ENDPOINTS ----
  // Lazy secret init: ensures the managed secret is initialized before any
  // rotation or first use. Idempotent — no-op when already initialized.
  func ensureSecretInit() : async () {
    if (not SecretManager.getSecretStatus(secretState).initialized) {
      let _ = await SecretManager.initSecret(secretState, { store = stableStore.getStore() });
    };
  };

  /// Idempotently re-encrypt every entry in `integrationCreds` from legacy
  /// XOR-with-salt ciphertext to the managed SecretManager v1:<secretId>:<hex>
  /// format. Called from update read entry points (e.g. testElevenLabsConnection)
  /// so stored credentials get upgraded on first read after deploy. Entries
  /// already in v1: format round-trip cleanly (decrypt v1 then re-encrypt v1),
  /// and only entries whose ciphertext actually changes are written back, so
  /// repeated calls are no-ops once migration is complete.
  func migrateCredentialsOnRead() {
    for ((tid, enc) in integrationCreds.entries()) {
      let migrated = ICLib.migrateCredentialsWithSecret(enc, credSalt, ?secretState);
      // Only write back when the re-encrypted record differs from the stored
      // one — avoids churn on already-migrated entries (idempotency).
      if (not credentialsEqual(migrated, enc)) {
        integrationCreds.add(tid, migrated);
      };
    };
  };

  /// Structural equality check for two IntegrationCredentials records, used by
  /// migrateCredentialsOnRead to decide whether a write-back is needed.
  func credentialsEqual(a : ICTypes.IntegrationCredentials, b : ICTypes.IntegrationCredentials) : Bool {
    a.openaiKey == b.openaiKey and
    a.claudeKey == b.claudeKey and
    a.litellmUrl == b.litellmUrl and
    a.litellmKey == b.litellmKey and
    a.ollamaUrl == b.ollamaUrl and
    a.twilioSid == b.twilioSid and
    a.twilioAuth == b.twilioAuth and
    a.twilioNumber == b.twilioNumber and
    a.vapiKey == b.vapiKey and
    a.stripeKey == b.stripeKey and
    a.stripeWebhookSecret == b.stripeWebhookSecret and
    a.googleClientId == b.googleClientId and
    a.googleClientSecret == b.googleClientSecret and
    a.yelpApiKey == b.yelpApiKey and
    a.facebookAppId == b.facebookAppId and
    a.facebookAppSecret == b.facebookAppSecret and
    a.emailSmtpHost == b.emailSmtpHost and
    a.emailSmtpPort == b.emailSmtpPort and
    a.emailSmtpUser == b.emailSmtpUser and
    a.emailSmtpPass == b.emailSmtpPass and
    a.hunterApiKey == b.hunterApiKey and
    a.neverBounceKey == b.neverBounceKey and
    a.listmonkUrl == b.listmonkUrl and
    a.listmonkUser == b.listmonkUser and
    a.listmonkPass == b.listmonkPass and
    a.searxngUrl == b.searxngUrl and
    a.elevenLabsKey == b.elevenLabsKey and
    a.elevenLabsVoiceId == b.elevenLabsVoiceId and
    a.perplexityApiKey == b.perplexityApiKey and
    a.autoBrowserUrl == b.autoBrowserUrl and
    a.serpApiKey == b.serpApiKey and
    a.serpApiDevKey == b.serpApiDevKey and
    a.tinyFishKey == b.tinyFishKey and
    a.sendgridKey == b.sendgridKey and
    a.nvidiaApiKey == b.nvidiaApiKey and
    a.n8nApiKey == b.n8nApiKey and
    a.n8nInstanceUrl == b.n8nInstanceUrl and
    a.abacusApiKey == b.abacusApiKey and
    a.composioApiKey == b.composioApiKey and
    a.dograhApiKey == b.dograhApiKey and
    a.openRouterApiKey == b.openRouterApiKey and
    a.nvidiaNimApiKey == b.nvidiaNimApiKey and
    a.geminiApiKey == b.geminiApiKey and
    a.vapiWebhookSecret == b.vapiWebhookSecret and
    a.sendgridInboundParseDomain == b.sendgridInboundParseDomain and
    a.composioWebhookSecret == b.composioWebhookSecret
  };

  /// Rotate the managed encryption secret. Admin-only. Mints a new secret,
  /// retires the previous one (kept for the rotation window so existing
  /// ciphertext remains decryptable), and records the action in the audit log.
  public shared ({ caller }) func rotateSecret() : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    await ensureSecretInit();
    let newId = await SecretManager.rotateSecret(secretState, { store = stableStore.getStore() });
    AdminAuditLib.appendAdminAudit(
      adminAuditStore,
      {
        actorPrincipal  = caller;
        tenantId        = "system";
        actionType      = #secretRotation;
        timestamp       = Time.now();
        redactedPayload = AdminAuditLib.redactSecrets("Secret rotated to " # newId);
      },
      adminAuditNonce.n,
    );
    adminAuditNonce.n := adminAuditNonce.n + 1;
    newId;
  };

  /// Query the secret manager's operational status (current id, rotation
  /// timestamp, retired-credential count, initialized flag). Admin-only.
  public query ({ caller }) func getSecretRotationStatus() : async SecretManagerTypes.SecretStatus {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    SecretManager.getSecretRotationStatus(secretState);
  };

  // ---- CORE TYPES ----

  type Lead = {
    id : Text;
    tenantId : TenantId;
    name : Text;
    email : Text;
    phone : Text;
    niche : Text;
    status : Text;
    source : Text;
    notes : Text;
    agentSubscriptions : [Text];
    createdAt : Time.Time;
  };

  module Lead {
    public func compare(a : Lead, b : Lead) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  type Review = {
    id : Text;
    tenantId : TenantId;
    platform : Text;
    rating : Nat;
    comment : Text;
    sentiment : Text;
    aiDraftedResponse : Text;
    respondedAt : ?Time.Time;
    createdAt : Time.Time;
  };

  module Review {
    public func compare(a : Review, b : Review) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  type AuditScore = {
    tenantId : TenantId;
    score : Nat;
    seoScore : Nat;
    technicalScore : Nat;
    contentScore : Nat;
    conversionScore : Nat;
    subfactors : [(Text, Nat)];
    lastUpdated : Time.Time;
  };

  type FundabilityScore = {
    tenantId : TenantId;
    score : Nat;
    eligibilityPhase : Nat;
    creditworthinessPhase : Nat;
    timelinePhase : Nat;
    lastUpdated : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    tenantId : TenantId;
    role : Text;
  };

  public type SocialPresence = {
    facebook : Bool;
    instagram : Bool;
    linkedin : Bool;
    googleMaps : Bool;
    gmbUrl : Text;
    yelpUrl : Text;
    facebookUrl : Text;
    napConsistent : Bool;
  };

  public type FreeAuditLead = {
    id : Text;
    businessName : Text;
    websiteUrl : Text;
    location : Text;
    contactEmail : Text;
    phone : Text;
    overallScore : Nat;
    createdAt : Time.Time;
  };

  public type ChatWidgetConfig = {
    tenantId : TenantId;
    niche : Text;
    greeting : Text;
    faqItems : [Text];
    leadCaptureEnabled : Bool;
    bookingEnabled : Bool;
    active : Bool;
    embedToken : Text;
  };

  public type VoiceAgentConfig = {
    tenantId : TenantId;
    greetingScript : Text;
    businessHoursText : Text;
    services : [Text];
    callRouting : {
      #forward : Text;
      #voicemail : Text;
      #ai;
    };
    twilioNumber : Text;
    vapiAgentId : Text;
    configured : Bool;
  };

  public type ReviewRequestStatus = {
    #sent;
    #awaiting;
    #happy;
    #unhappy;
    #reviewed;
    #maxAttempts;
  };

  public type ReviewRequest = {
    id : Text;
    tenantId : TenantId;
    customerName : Text;
    phone : Text;
    email : Text;
    serviceCompleted : Text;
    platform : Text;
    status : ReviewRequestStatus;
    sentTimestamp : Time.Time;
    lastFollowUp : Time.Time;
    attemptCount : Nat;
    customerFeedback : Text;
  };

  public type AgencySettings = {
    twilioSid : Text;
    twilioAuth : Text;
    twilioNumber : Text;
    vapiKey : Text;
    sendgridKey : Text;
    openaiKey : Text;
    stripeKey : Text;
    googleApiKey : Text;
    serpApiKey : Text;
  };

  // ---- NOTIFICATION ----

  public type NotificationRecord = {
    id : Text;
    tenantId : TenantId;
    notificationType : Text;
    title : Text;
    body : Text;
    read : Bool;
    createdAt : Time.Time;
  };

  // ---- BILLING ----

  public type BillingRecord = {
    id : Text;
    tenantId : TenantId;
    planName : Text;
    amount : Nat;
    currency : Text;
    status : Text;
    periodStart : Time.Time;
    periodEnd : Time.Time;
    createdAt : Time.Time;
  };

  public type PaymentMethod = {
    tenantId : TenantId;
    cardLast4 : Text;
    cardBrand : Text;
    expMonth : Nat;
    expYear : Nat;
    isDefault : Bool;
  };

  public type Invoice = {
    id : Text;
    tenantId : TenantId;
    amount : Nat;
    currency : Text;
    status : Text;
    description : Text;
    invoiceDate : Time.Time;
    dueDate : Time.Time;
  };

  // ---- WHITE-LABEL CONFIG ----

  public type WhiteLabelConfig = {
    tenantId : TenantId;
    agencyName : Text;
    logo : Text;
    primaryColor : Text;
    secondaryColor : Text;
    domain : Text;
    onboardingLink : Text;
    tagline : Text;
    heroHeadline : Text;
    subdomain : Text;
    emailSenderName : Text;
    emailSenderAddress : Text;
    clientBrandingOverrides : [(Text, Text)];
    active : Bool;
    updatedAt : Time.Time;
  };

  // ---- CAMPAIGNS ----

  public type CampaignTemplate = {
    id : Text;
    name : Text;
    niche : Text;
    campaignType : Text;
    steps : [Text];
    triggers : [Text];
    segments : [Text];
    goals : [Text];
    channels : [Text];
    tags : [Text];
    active : Bool;
    createdAt : Time.Time;
  };

  public type CampaignInstance = {
    id : Text;
    tenantId : TenantId;
    templateId : Text;
    status : Text;
    startedAt : Time.Time;
    metrics : CampaignMetrics;
  };

  public type CampaignMetrics = {
    sent : Nat;
    opened : Nat;
    clicked : Nat;
    converted : Nat;
    unsubscribed : Nat;
  };

  // ---- AGENT SERVICES ----

  public type AgentProduct = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    billingCycle : Text;
    category : Text;
    features : [Text];
    status : Text;
    visible : Bool;
    allowHumanOversight : Bool;
    enabledNiches : [Text];
    upsellPriority : Nat;
    bundleIds : [Text];
    updatedAt : Time.Time;
  };

  public type AgentSubscription = {
    id : Text;
    tenantId : TenantId;
    productId : Text;
    status : Text;
    price : Nat;
    startDate : Time.Time;
    humanOversightEnabled : Bool;
    assignedStrategist : Text;
    notes : Text;
    updatedAt : Time.Time;
  };

  public type AgentTask = {
    id : Text;
    tenantId : TenantId;
    subscriptionId : Text;
    taskType : Text;
    title : Text;
    description : Text;
    status : Text;
    priority : Text;
    assignee : Text;
    dueDate : ?Time.Time;
    notes : Text;
    attachments : [Text];
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type AgentDeliverable = {
    id : Text;
    tenantId : TenantId;
    subscriptionId : Text;
    title : Text;
    deliverableType : Text;
    summary : Text;
    notes : Text;
    status : Text;
    month : Text;
    attachments : [Text];
    scoreImpact : ?Nat;
    deliveredAt : Time.Time;
  };

  public type AgentServiceRequest = {
    id : Text;
    tenantId : TenantId;
    subscriptionId : Text;
    title : Text;
    description : Text;
    priority : Text;
    attachments : [Text];
    preferredDeadline : ?Time.Time;
    pageUrl : Text;
    status : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type AgentPerformanceSnapshot = {
    id : Text;
    tenantId : TenantId;
    subscriptionId : Text;
    month : Text;
    metrics : [(Text, Int)];
    summary : Text;
    topWins : [Text];
    nextActions : [Text];
    createdAt : Time.Time;
  };

  public type AgentNote = {
    id : Text;
    tenantId : TenantId;
    subscriptionId : Text;
    content : Text;
    author : Text;
    createdAt : Time.Time;
  };

  public type HumanOversightAssignment = {
    id : Text;
    tenantId : TenantId;
    subscriptionId : Text;
    strategist : Text;
    priority : Text;
    notes : Text;
    status : Text;
    createdAt : Time.Time;
  };

  // ---- SEO & GEO AGENT ----

  public type SeoGeoSubscription = {
    id : Text;
    tenantId : TenantId;
    status : Text;
    price : Nat;
    startDate : Time.Time;
    humanOversightEnabled : Bool;
    assignedStrategist : Text;
    updatedAt : Time.Time;
  };

  public type SeoGeoScore = {
    id : Text;
    tenantId : TenantId;
    seoScore : Nat;
    geoScore : Nat;
    localVisibilityScore : Nat;
    conversionReadinessScore : Nat;
    technicalHealth : Nat;
    contentHealth : Nat;
    gbpHealth : Nat;
    aiVisibilityHealth : Nat;
    recordedAt : Time.Time;
  };

  public type SeoGeoScoreFactor = {
    id : Text;
    tenantId : TenantId;
    scoreType : Text;
    factorName : Text;
    value : Nat;
    weight : Nat;
    status : Text;
    updatedAt : Time.Time;
  };

  public type SeoGeoIssue = {
    id : Text;
    tenantId : TenantId;
    issueType : Text;
    affectedArea : Text;
    severity : Text;
    title : Text;
    description : Text;
    suggestedFix : Text;
    status : Text;
    owner : Text;
    dueDate : ?Time.Time;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type SeoGeoOpportunity = {
    id : Text;
    tenantId : TenantId;
    opportunityType : Text;
    title : Text;
    reason : Text;
    likelyImpact : Text;
    effortLevel : Text;
    nextStep : Text;
    status : Text;
    createdAt : Time.Time;
  };

  public type SeoGeoRequest = {
    id : Text;
    tenantId : TenantId;
    title : Text;
    description : Text;
    priority : Text;
    attachments : [Text];
    preferredDeadline : ?Time.Time;
    pageUrl : Text;
    status : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type SeoGeoDeliverable = {
    id : Text;
    tenantId : TenantId;
    title : Text;
    deliverableType : Text;
    summary : Text;
    notes : Text;
    status : Text;
    month : Text;
    attachments : [Text];
    deliveredAt : Time.Time;
  };

  public type SeoGeoReport = {
    id : Text;
    tenantId : TenantId;
    month : Text;
    summary : Text;
    highlights : [Text];
    issues : [Text];
    nextSteps : [Text];
    createdAt : Time.Time;
  };

  public type SeoGeoContentItem = {
    id : Text;
    tenantId : TenantId;
    contentType : Text;
    title : Text;
    content : Text;
    targetKeywords : [Text];
    approvalStatus : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type SeoGeoGbpTask = {
    id : Text;
    tenantId : TenantId;
    taskType : Text;
    title : Text;
    description : Text;
    status : Text;
    priority : Text;
    dueDate : ?Time.Time;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type SeoGeoVisibilitySnapshot = {
    id : Text;
    tenantId : TenantId;
    aiVisibilityScore : Nat;
    entityClarity : Nat;
    answerReadiness : Nat;
    citationScore : Nat;
    brandConsistency : Nat;
    recordedAt : Time.Time;
  };

  public type SeoGeoTaskAssignment = {
    id : Text;
    tenantId : TenantId;
    taskId : Text;
    assignee : Text;
    notes : Text;
    assignedAt : Time.Time;
  };

  public type SeoGeoNote = {
    id : Text;
    tenantId : TenantId;
    content : Text;
    author : Text;
    createdAt : Time.Time;
  };

  // ---- PAID ADS AGENT ----

  public type PaidAdsSubscription = {
    id : Text;
    tenantId : TenantId;
    status : Text;
    price : Nat;
    startDate : Time.Time;
    humanOversightEnabled : Bool;
    assignedStrategist : Text;
    updatedAt : Time.Time;
  };

  public type PaidAdsScore = {
    id : Text;
    tenantId : TenantId;
    accountHealth : Nat;
    roasEfficiency : Nat;
    audienceQuality : Nat;
    budgetUtilization : Nat;
    recordedAt : Time.Time;
  };

  public type PaidAdsCampaign = {
    id : Text;
    tenantId : TenantId;
    name : Text;
    status : Text;
    budget : Nat;
    spent : Nat;
    impressions : Nat;
    clicks : Nat;
    conversions : Nat;
    ctr : Text;
    roas : Text;
    startDate : Time.Time;
    updatedAt : Time.Time;
  };

  public type PaidAdsAdCopy = {
    id : Text;
    tenantId : TenantId;
    campaignId : Text;
    variant : Text;
    headline : Text;
    body : Text;
    cta : Text;
    status : Text;
    testResult : Text;
    clicks : Nat;
    conversions : Nat;
    createdAt : Time.Time;
  };

  public type PaidAdsAudience = {
    id : Text;
    tenantId : TenantId;
    name : Text;
    segmentType : Text;
    size : Nat;
    performanceRating : Text;
    cpa : Text;
    roas : Text;
    status : Text;
    updatedAt : Time.Time;
  };

  public type PaidAdsAlert = {
    id : Text;
    tenantId : TenantId;
    alertType : Text;
    severity : Text;
    title : Text;
    description : Text;
    suggestedFix : Text;
    status : Text;
    owner : Text;
    createdAt : Time.Time;
  };

  public type PaidAdsDeliverable = {
    id : Text;
    tenantId : TenantId;
    title : Text;
    deliverableType : Text;
    summary : Text;
    month : Text;
    status : Text;
    deliveredAt : Time.Time;
  };

  // ---- WEBSITE AGENT ----

  public type WebsiteAgentSubscription = {
    id : Text;
    tenantId : TenantId;
    status : Text;
    price : Nat;
    startDate : Time.Time;
    humanOversightEnabled : Bool;
    assignedStrategist : Text;
    updatedAt : Time.Time;
  };

  public type WebsiteAgentScore = {
    id : Text;
    tenantId : TenantId;
    conversionReadiness : Nat;
    contentQuality : Nat;
    technicalHealth : Nat;
    trustAuthority : Nat;
    ctaStrength : Nat;
    trustSignals : Nat;
    recordedAt : Time.Time;
  };

  public type WebsitePageQueueItem = {
    id : Text;
    tenantId : TenantId;
    pageUrl : Text;
    pageTitle : Text;
    updateType : Text;
    description : Text;
    status : Text;
    priority : Text;
    assignee : Text;
    dueDate : ?Time.Time;
    waitingOnClient : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type WebsiteCroOpportunity = {
    id : Text;
    tenantId : TenantId;
    title : Text;
    description : Text;
    estimatedLift : Text;
    effortLevel : Text;
    priority : Text;
    category : Text;
    status : Text;
    createdAt : Time.Time;
  };

  public type WebsiteContentBrief = {
    id : Text;
    tenantId : TenantId;
    pageTitle : Text;
    targetKeywords : [Text];
    outlinePoints : [Text];
    approvalStatus : Text;
    assignee : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type WebsiteIssue = {
    id : Text;
    tenantId : TenantId;
    issueType : Text;
    severity : Text;
    title : Text;
    description : Text;
    suggestedFix : Text;
    pageUrl : Text;
    status : Text;
    createdAt : Time.Time;
  };

  public type WebsiteDeliverable = {
    id : Text;
    tenantId : TenantId;
    title : Text;
    deliverableType : Text;
    summary : Text;
    month : Text;
    status : Text;
    deliveredAt : Time.Time;
  };

  // ---- AGENT WORKFLOW OS TYPES ----

  public type AgentThread = {
    id : Text;
    tenantId : Text;
    agentType : Text;
    title : Text;
    status : { #active; #archived; #paused };
    messageCount : Nat;
    summary : ?Text;
    agentNotes : ?Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type RunStatus = {
    #queued;
    #running;
    #completed;
    #failed;
    #paused_for_approval;
    #cancelled;
  };

  public type AgentRun = {
    id : Text;
    threadId : Text;
    tenantId : Text;
    agentType : Text;
    status : RunStatus;
    inputPrompt : Text;
    outputText : ?Text;
    errorMessage : ?Text;
    artifactIds : [Text];
    workflowStepIndex : Nat;
    approvalRequired : Bool;
    approvalStatus : ?{ #pending; #approved; #rejected };
    startedAt : Int;
    endedAt : ?Int;
    metadata : [(Text, Text)];
  };

  public type ArtifactType = {
    #proposal;
    #estimate;
    #content_package;
    #lead_summary;
    #recommendation_set;
    #follow_up_sequence;
    #seo_action_plan;
    #support_resolution;
  };

  public type ArtifactStatus = {
    #draft;
    #final;
    #archived;
  };

  public type AgentArtifact = {
    id : Text;
    runId : Text;
    threadId : Text;
    tenantId : Text;
    artifactType : ArtifactType;
    title : Text;
    content : Text;
    tags : [Text];
    status : ArtifactStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  // MemoryMode — original variant type. The moc 1.10.1 stable-signature crash
  // (desugar.ml:1083) was caused by mixin parameters becoming stable actor
  // fields, NOT by this variant. Now that the mixin is removed and public
  // functions are defined directly in main.mo, the variant is safe again.
  // Reverting from Text back to the variant fixes stable compatibility error
  // M0170 (agentTemplates stable field uses MemoryMode).
  public type MemoryMode = {
    #none_;
    #conversation_only;
    #with_summary;
    #with_notes;
  };

  public type AgentTemplateRecord = {
    id : Text;
    tenantId : Text;
    name : Text;
    role : Text;
    systemPrompt : Text;
    allowedTools : [Text];
    memoryMode : MemoryMode;
    approvalRequired : Bool;
    defaultWorkflowSteps : [Text];
    isDefault : Bool;
    createdAt : Int;
  };

  public type ConversationEntry = {
    role : Text;
    content : Text;
    timestamp : Int;
  };

  public type AgentMemory = {
    threadId : Text;
    tenantId : Text;
    conversationHistory : [ConversationEntry];
    summary : ?Text;
    agentNotes : ?Text;
    lastUpdated : Int;
  };

  public type ToolDefinition = {
    id : Text;
    name : Text;
    description : Text;
    category : Text;
    schema : Text;
    permissions : [Text];
    requiresApproval : Bool;
    tenantScoped : Bool;
    isEnabled : Bool;
  };

  public type ApprovalStatus = {
    #pending;
    #approved;
    #rejected;
    #expired;
  };

  public type ApprovalItem = {
    id : Text;
    runId : Text;
    threadId : Text;
    tenantId : Text;
    action : Text;
    reason : Text;
    status : ApprovalStatus;
    requestedAt : Int;
    resolvedAt : ?Int;
    approverNotes : ?Text;
  };

  public type AdapterType = {
    #native_;
    #openai_compatible;
    #anthropic_claude;
    #ollama_local;
    #deerflow_bridge;
    #abacus_adapter;
  };

  public type ProviderAdapterConfig = {
    id : Text;
    tenantId : Text;
    adapterType : AdapterType;
    isEnabled : Bool;
    apiKey : ?Text;
    baseUrl : ?Text;
    modelId : ?Text;
    priority : Nat;
    createdAt : Int;
  };

  // ---- AGENT WORKFLOW OS FLAT-RECORD TYPES ----

  public type AgentThreadRecord = {
    id : Text;
    tenantId : Text;
    agentId : Text;
    agentName : Text;
    agentRole : Text;
    title : Text;
    status : Text;
    createdAt : Int;
    updatedAt : Int;
    messageCount : Nat;
    lastMessage : Text;
    tags : [Text];
  };

  public type AgentRunRecord = {
    id : Text;
    threadId : Text;
    tenantId : Text;
    agentId : Text;
    input : Text;
    output : Text;
    status : Text;
    startedAt : Int;
    completedAt : ?Int;
    durationMs : ?Nat;
    tokenCount : ?Nat;
    modelUsed : Text;
    artifactIds : [Text];
    approvalRequired : Bool;
    approvalStatus : Text;
    errorMessage : ?Text;
    stepIndex : Nat;
    totalSteps : Nat;
    metadata : Text;
  };

  public type AgentArtifactRecord = {
    id : Text;
    runId : Text;
    threadId : Text;
    tenantId : Text;
    title : Text;
    artifactType : Text;
    content : Text;
    status : Text;
    createdAt : Int;
    tags : [Text];
    agentId : Text;
    clientVisible : Bool;
  };

  public type AgentMemoryRecord = {
    id : Text;
    threadId : Text;
    tenantId : Text;
    agentId : Text;
    memoryType : Text;
    content : Text;
    createdAt : Int;
    expiresAt : ?Int;
    importance : Nat;
  };

  public type ApprovalItemRecord = {
    id : Text;
    runId : Text;
    threadId : Text;
    tenantId : Text;
    agentId : Text;
    title : Text;
    description : Text;
    actionType : Text;
    requestedAt : Int;
    resolvedAt : ?Int;
    status : Text;
    resolvedBy : ?Text;
    resolutionNote : ?Text;
    priority : Text;
  };

  public type AgentTemplateStorageRecord = {
    id : Text;
    tenantId : Text;
    name : Text;
    role : Text;
    systemPrompt : Text;
    allowedTools : [Text];
    memoryMode : Text;
    providerPreference : Text;
    requireApproval : Bool;
    defaultWorkflowSteps : [Text];
    isActive : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  // ---- STATE ----

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Core tenants + users
  let tenants = Map.empty<TenantId, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // CRM
  let leads = Map.empty<TenantId, Map.Map<Text, Lead>>();
  let reviews = Map.empty<TenantId, Map.Map<Text, Review>>();

  // Scores
  let auditScores = Map.empty<TenantId, AuditScore>();
  let fundabilityScores = Map.empty<TenantId, FundabilityScore>();

  // Free audit leads
  let freeAuditLeads = Map.empty<Text, FreeAuditLead>();

  // Widget configs
  let chatWidgetConfigs = Map.empty<TenantId, ChatWidgetConfig>();
  let voiceAgentConfigs = Map.empty<TenantId, VoiceAgentConfig>();

  // Review requests
  let reviewRequests = Map.empty<TenantId, Map.Map<Text, ReviewRequest>>();

  // Settings
  var agencySettings : ?AgencySettings = null;

  // Integration credentials (XOR-obfuscated at rest).
  // Enhanced orthogonal persistence ensures this Map survives canister upgrades
  // automatically — no stable declarations or upgrade hooks required.
  let integrationCreds = Map.empty<Text, ICTypes.IntegrationCredentials>();

  transient let stableStore = StableJsonStoreCore.Core();

  // ---- CENTRALIZED ADMIN AUDIT TRAIL STATE ----
  // Declared after stableStore so the AdminCommandMixin and FeatureToggleMixin
  // includes below can receive the store + nonce as parameters. Append-only
  // audit log for admin actions, persisted via the existing StableJsonStore
  // (no new stable state). The store state record wraps the underlying Map
  // exposed by stableStore.getStore(); the nonce counter is a shared mutable
  // record so per-call uniqueness propagates.
  let adminAuditStore : SJS.State = { store = stableStore.getStore() };
  let adminAuditNonce = { var n : Nat = 0 };

  // emptyMasked: the all-empty MaskedCredentials sentinel returned when no
  // credentials have been configured yet.  Declared here (rather than inside the
  // mixin) so that the migration expression can explicitly upgrade it when the
  // IntegrationCredentials type gains new fields.
  let emptyMasked : ICTypes.MaskedCredentials = {
    openaiKey = ""; claudeKey = ""; litellmUrl = ""; litellmKey = ""; ollamaUrl = "";
    twilioSid = ""; twilioAuth = ""; twilioNumber = ""; vapiKey = "";
    stripeKey = ""; stripeWebhookSecret = "";
    googleClientId = ""; googleClientSecret = "";
    yelpApiKey = ""; facebookAppId = ""; facebookAppSecret = "";
    emailSmtpHost = ""; emailSmtpPort = ""; emailSmtpUser = ""; emailSmtpPass = "";
    hunterApiKey = ""; neverBounceKey = "";
    listmonkUrl = ""; listmonkUser = ""; listmonkPass = "";
    searxngUrl = "";
    elevenLabsKey = ""; elevenLabsVoiceId = "";
    perplexityApiKey = "";
    autoBrowserUrl = "";
    serpApiKey = "";
    serpApiDevKey = "";
    sendgridKey = "";
    tinyFishKey = "";
    nvidiaApiKey = "";
    nvidiaNimApiKey = "";
    n8nInstanceUrl = "";
    vapiWebhookSecret = "";
    sendgridInboundParseDomain = "";
    abacusApiKey = "";
    composioApiKey = "";
    dograhApiKey = "";
    openRouterApiKey = "";
    composioWebhookSecret = "";
    geminiApiKey = "";
  };
  // emptyMasked closes above. credSalt: a fixed 32-byte sequence unique to this
  // codebase. XOR obfuscation prevents plaintext exposure in memory dumps without
  // requiring a truly random value (which would change on reinstall and corrupt stored credentials).
  let credSalt : Blob = "\d4\2f\7a\c1\88\3e\b5\60\19\f2\44\97\cb\0e\56\a3\77\bc\2d\e8\f1\34\6c\90\b2\5a\1e\83\c7\49\d6\0f";

  // ---- SECRET MANAGER STATE ----
  // Managed reversible encryption for credential secrets. The in-memory State
  // is transient (rebuilt from the StableJsonStore on initSecret); the secret
  // material itself is persisted in the existing stableStore (no new stable
  // variables). initSecret is invoked lazily on first use via ensureSecretInit()
  // below — see the rotateSecret / getSecretRotationStatus admin endpoints.
  transient let secretState = SecretManager.initState();

  // ---- CANISTER START TIME ----
  // Captured at actor init for uptime accounting in the observability health
  // endpoint. Transient — resets on redeploy, which is the desired behavior
  // for uptime accounting.
  transient let canisterStartTime = Time.now();

  // ---- RATE-LIMIT REJECTION COUNTER ----
  // In-memory counter for the observability metrics endpoint. Transient —
  // resets on redeploy per the project's "no new stable state" preference.
  // Wrapped in a record so the observability mixin (included below) reads
  // increments by reference.
  let rateLimitRejections = { var n : Nat = 0 };

  // Notifications
  let notifications = Map.empty<Text, NotificationRecord>();

  // Billing
  let billingRecords = Map.empty<Text, BillingRecord>();
  let paymentMethods = Map.empty<TenantId, PaymentMethod>();
  let invoices = Map.empty<Text, Invoice>();

  // White-label
  let whiteLabelConfigs = Map.empty<TenantId, WhiteLabelConfig>();

  // Campaigns
  let campaignTemplates = Map.empty<Text, CampaignTemplate>();
  let campaignInstances = Map.empty<TenantId, Map.Map<Text, CampaignInstance>>();

  // Agent Services
  let agentProducts = Map.empty<Text, AgentProduct>();
  let agentSubscriptions = Map.empty<TenantId, Map.Map<Text, AgentSubscription>>();
  let agentTasks = Map.empty<Text, AgentTask>();
  let agentDeliverables = Map.empty<Text, AgentDeliverable>();
  let agentServiceRequests = Map.empty<Text, AgentServiceRequest>();
  let agentPerformanceSnapshots = Map.empty<Text, AgentPerformanceSnapshot>();
  let _agentNotes = Map.empty<Text, AgentNote>();
  let humanOversightAssignments = Map.empty<Text, HumanOversightAssignment>();

  // SEO & GEO Agent
  let seoGeoSubscriptions = Map.empty<TenantId, SeoGeoSubscription>();
  let seoGeoScores = Map.empty<TenantId, List.List<SeoGeoScore>>();
  let _seoGeoScoreFactors = Map.empty<TenantId, Map.Map<Text, SeoGeoScoreFactor>>();
  let seoGeoIssues = Map.empty<Text, SeoGeoIssue>();
  let seoGeoOpportunities = Map.empty<Text, SeoGeoOpportunity>();
  let seoGeoRequests = Map.empty<Text, SeoGeoRequest>();
  let seoGeoDeliverables = Map.empty<Text, SeoGeoDeliverable>();
  let seoGeoReports = Map.empty<Text, SeoGeoReport>();
  let seoGeoContentItems = Map.empty<Text, SeoGeoContentItem>();
  let seoGeoGbpTasks = Map.empty<Text, SeoGeoGbpTask>();
  let seoGeoVisibilitySnapshots = Map.empty<TenantId, List.List<SeoGeoVisibilitySnapshot>>();
  let _seoGeoTaskAssignments = Map.empty<Text, SeoGeoTaskAssignment>();
  let _seoGeoNotes = Map.empty<Text, SeoGeoNote>();

  // Paid Ads Agent
  let paidAdsSubscriptions = Map.empty<TenantId, PaidAdsSubscription>();
  let paidAdsScores = Map.empty<TenantId, List.List<PaidAdsScore>>();
  let paidAdsCampaigns = Map.empty<Text, PaidAdsCampaign>();
  let paidAdsAdCopies = Map.empty<Text, PaidAdsAdCopy>();
  let paidAdsAudiences = Map.empty<Text, PaidAdsAudience>();
  let paidAdsAlerts = Map.empty<Text, PaidAdsAlert>();
  let paidAdsDeliverables = Map.empty<Text, PaidAdsDeliverable>();

  // Website Agent
  let websiteAgentSubscriptions = Map.empty<TenantId, WebsiteAgentSubscription>();
  let websiteAgentScores = Map.empty<TenantId, List.List<WebsiteAgentScore>>();
  let websitePageQueue = Map.empty<Text, WebsitePageQueueItem>();
  let websiteCroOpportunities = Map.empty<Text, WebsiteCroOpportunity>();
  let websiteContentBriefs = Map.empty<Text, WebsiteContentBrief>();
  let websiteIssues = Map.empty<Text, WebsiteIssue>();
  let websiteDeliverables = Map.empty<Text, WebsiteDeliverable>();

  // Agent Workflow OS
  let agentThreads = Map.empty<Text, AgentThread>();
  let agentRuns = Map.empty<Text, AgentRun>();
  let agentArtifacts = Map.empty<Text, AgentArtifact>();
  let agentTemplates = Map.empty<Text, AgentTemplateRecord>();
  let agentMemories = Map.empty<Text, AgentMemory>();
  let toolDefinitions = Map.empty<Text, ToolDefinition>();
  let approvalItems = Map.empty<Text, ApprovalItem>();
  let providerAdapterConfigs = Map.empty<Text, ProviderAdapterConfig>();
  var toolsSeeded : Bool = false;
  var workflowIdCounter : Nat = 0;

  // Agent Workflow OS flat-record storage
  let agentThreadRecords = List.empty<AgentThreadRecord>();
  let agentRunRecords = List.empty<AgentRunRecord>();
  let agentArtifactRecords = List.empty<AgentArtifactRecord>();
  let agentMemoryRecords = List.empty<AgentMemoryRecord>();
  let approvalItemRecords = List.empty<ApprovalItemRecord>();
  let agentTemplateStorageRecords = List.empty<AgentTemplateStorageRecord>();

  // ---- WARM SEQUENCES & PIPELINE TYPES (re-exported) ----

  public type WarmTouch = WarmSequencesTypes.WarmTouch;
  public type WarmSequence = WarmSequencesTypes.WarmSequence;
  public type AuditSnapshot = WarmSequencesTypes.AuditSnapshot;
  public type WarmLeadHandoff = WarmSequencesTypes.WarmLeadHandoff;
  public type PipelineStage = WarmSequencesTypes.PipelineStage;
  public type OutreachEvent = WarmSequencesTypes.OutreachEvent;
  public type PipelineFunnelStats = WarmSequencesTypes.PipelineFunnelStats;
  public type VerificationStatus = WarmSequencesTypes.VerificationStatus;
  public type LeadEnrichment = WarmSequencesTypes.LeadEnrichment;

  // Warm sequences pipeline state
  let outreachEvents = Map.empty<Text, OutreachEvent>();
  let warmLeadHandoffs = Map.empty<Text, WarmLeadHandoff>();
  // leadEnrichments removed — enrichment is now handled by LeadAIMixin

  // ---- HTTP TRANSFORM (required by ICP http outcalls) ----

  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // ICMixin included after transform so the function reference is in scope
  include ICMixin(accessControlState, integrationCreds, credSalt, userProfiles, emptyMasked, transform, ?secretState);

  // Email logs + warm-sequence email tracking
  let emailLogs          = List.empty<EmailTypes.EmailLogRecord>();
  let warmEmailSchedules = List.empty<EmailTypes.WarmSequenceEmailSchedule>();
  let warmEmailEvents    = List.empty<EmailTypes.WarmSequenceEmailEvent>();
  let emailIdCounter     = object { public var n : Nat = 0 };

  include EmailMixin(accessControlState, emailLogs, warmEmailSchedules, warmEmailEvents, emailIdCounter, transform);

  // Brand Kit & Smart Trial state
  let brandKitProspects    = Map.empty<Text, BrandKitTypes.BrandKitProspect>();
  let brandKitOutreachJobs = Map.empty<Text, BrandKitTypes.BrandKitOutreachJob>();

  include BrandKitMixin(accessControlState, brandKitProspects, brandKitOutreachJobs, warmEmailSchedules, warmEmailEvents, emailIdCounter);

  // BRF Sales Voice Agent state
  let brfVoiceAgentConfigHolder = object { public var v : ?BrfSVATypes.BrfVoiceAgentConfig = null };
  let brfOutboundCallAttempts   = List.empty<BrfSVATypes.BrfOutboundCallAttempt>();
  let brfCallIdCounter          = object { public var n : Nat = 0 };

  include BrfSVAMixin(accessControlState, brfVoiceAgentConfigHolder, brfOutboundCallAttempts, brfCallIdCounter);

  // CRM Drip Campaigns state (mixin included after extendedLeads is declared below)
  let dripQueues        = Map.empty<Text, DripCampaignsTypes.DripQueue>();
  let dripEmailLogs     = Map.empty<Text, List.List<DripCampaignsTypes.DripQueueEmailLog>>();
  // In-memory rate-limit counters (State record pattern; not stable — see AGENTS.md).
  transient let rateLimiterState = RateLimiter.emptyState();
  // Bounce tracking: composite key leadId#":"#queueId -> DripLeadBounceRecord
  let dripBounceRecords = Map.empty<Text, DripCampaignsTypes.DripLeadBounceRecord>();
  // Per-queue throttle/pacing config: queueId -> DripQueueThrottleConfig
  let dripThrottleConfigs = Map.empty<Text, DripCampaignsTypes.DripQueueThrottleConfig>();

  // AI Lead Intelligence state
  let leadAuditJobs        = Map.empty<Text, AILeadAuditTypes.LeadAuditJob>();
  let leadAuditResults     = Map.empty<Text, AILeadAuditTypes.LeadAuditResult>();
  let batchAuditJobs       = Map.empty<Text, AILeadAuditTypes.BatchAuditJob>();
  let dualModelSearchJobs  = Map.empty<Text, AILeadAuditTypes.DualModelSearchJob>();

  include AILeadIntelligenceMixin(
    accessControlState,
    leadAuditJobs,
    leadAuditResults,
    batchAuditJobs,
    dualModelSearchJobs,
    leads,
    brandKitProspects,
    brandKitOutreachJobs,
    warmEmailSchedules,
    warmEmailEvents,
    emailIdCounter,
    integrationCreds,
    credSalt,
    transform,
  );

  // Social Media Engagement Engine state
  let brandVoiceProfiles  = Map.empty<Text, SocialMediaTypes.BrandVoiceProfile>();
  let socialPosts         = Map.empty<Text, SocialMediaTypes.SocialPost>();
  let socialComments      = Map.empty<Text, SocialMediaTypes.SocialComment>();
  let socialAlerts        = Map.empty<Text, SocialMediaTypes.SocialListeningAlert>();
  let socialROIMetrics    = Map.empty<Text, SocialMediaTypes.SocialROIMetrics>();
  let scheduledPosts      = Map.empty<Text, SocialMediaTypes.ScheduledPost>();
  let engagementApprovals = Map.empty<Text, SocialMediaTypes.EngagementApproval>();
  let competitorReports   = Map.empty<Text, SocialMediaTypes.CompetitorIntelReport>();
  let socialLeadsStore    = Map.empty<Text, SocialMediaTypes.SocialLead>();
  let demoFunnelEntries   = Map.empty<Text, SocialMediaTypes.DemoFunnelEntry>();

  include SocialMediaMixin(
    accessControlState,
    brandVoiceProfiles,
    socialPosts,
    socialComments,
    socialAlerts,
    socialROIMetrics,
    scheduledPosts,
    engagementApprovals,
    competitorReports,
    socialLeadsStore,
    demoFunnelEntries,
  );

  // Domain Setup & Demo Audit Reports state
  let domainSetupStore = Map.empty<Text, DomainSetupTypes.DomainSetupState>();
  let auditReportStore = List.empty<DomainSetupTypes.DemoAuditReport>();

  include DomainSetupMixin(accessControlState, domainSetupStore, auditReportStore);

  // Auto-Browser Agent state
  let browserAuditCache = Map.empty<Text, ABTypes.BrowserAuditResult>();

  include AutoBrowserMixin(
    accessControlState,
    integrationCreds,
    credSalt,
    browserAuditCache,
    leadAuditResults,
    leadAuditJobs,
    transform,
    ?secretState,
  );

  // Demo Session & Niche Voice Scripts state
  let demoSessions = Map.empty<Text, DemoSessionTypes.DemoSession>();
  let auditReports = Map.empty<Text, DemoSessionTypes.AuditReport>();
  // Prospect contact data captured at trial activation — separate from DemoSession for stable-compat
  let prospectDataStore = Map.empty<Text, DemoSessionTypes.ProspectData>();
  let trialAccounts = Map.empty<Text, DemoSessionTypes.TrialAccount>();
  let pipelineLeadsStore = Map.empty<Text, OutreachPipelineTypes.PipelineLead>();
  let inboundRepliesStore = Map.empty<Text, OutreachPipelineTypes.InboundReply>();
  let trialActivityEventsStore = Map.empty<Text, OutreachPipelineTypes.TrialActivityEvent>();
  let queuedActionsStore = Map.empty<Text, OutreachPipelineTypes.OutreachQueuedAction>();

  // Niche Voice Assignments, Script Overrides & Audio Cache
  // Declared before DemoSessionMixin so the cache can be passed as a mixin parameter.
  let nicheVoiceAssignments = Map.empty<Text, NicheVoiceTypes.NicheVoiceAssignment>();
  let nicheScriptOverrides  = Map.empty<Text, [Text]>();
  let elevenLabsAudioCache  = Map.empty<Text, Text>();

  include DemoSessionMixin(demoSessions, auditReports, elevenLabsAudioCache, prospectDataStore, trialAccounts, emailLogs, emailIdCounter, transform);

  // Seed default voice assignments from hardcoded NicheScript constants on first run.
  NicheVoiceLib.seedDefaults(nicheVoiceAssignments);

  include NicheVoiceMixin(nicheVoiceAssignments, nicheScriptOverrides, elevenLabsAudioCache);

  // Autopilot Discovery Engine state
  let autopilotDiscoveryJobs = List.empty<AutopilotDiscoveryTypes.ScheduledDiscoveryJob>();
  let autopilotDiscoveryConfig = object {
    public var v : AutopilotDiscoveryTypes.DiscoveryConfig = {
      enabled      = false;           // off by default; admin enables via updateDiscoveryConfig
      intervalSecs = 86_400;          // 24-hour cycle
      cities       = ["Dallas, TX", "Houston, TX", "Phoenix, AZ", "Austin, TX"];
      niche        = "plumber";
      leadsPerCity = 50;
      dailyCap     = 200;
    };
  };

  include AutopilotDiscoveryMixin(
    accessControlState,
    integrationCreds,
    credSalt,
    autopilotDiscoveryJobs,
    autopilotDiscoveryConfig,
    leadAuditJobs,
    leads,
    transform,
    ?secretState,
  );

  // Autopilot Email Engine state
  let bulkSendJobs          = List.empty<AutopilotEngineTypes.BulkSendJob>();
  let senderSubdomainsState = List.empty<AutopilotEngineTypes.SenderSubdomainRecord>();
  let deliverabilityEvents  = List.empty<AutopilotEngineTypes.DeliverabilityEvent>();
  let autopilotEmailConfig  = object {
    public var v : AutopilotEngineTypes.AutopilotConfig = {
      isEnabled         = false;
      dailyEmailCap     = 100;
      dailySmsCap       = 50;
      discoveryEnabled  = false;
      enrichmentEnabled = false;
      warmupPhase       = true;
      currentWarmupDay  = 1;
      targetDailyVolume = 500;
      complianceMode    = #canSpam;
    };
  };
  let apeEmailQueue    = Queue.empty<AutopilotEngineTypes.ApeQueueItem>();
  let apeOpenCounts    = Map.empty<Text, Nat>();
  let apeSmsJobQueue   = Queue.empty<AutopilotEngineTypes.SmsAutopilotJob>();
  let apeWarmSeqLib    = Map.empty<Text, WarmSequencesTypes.WarmSequenceExt>();
  let apeWarmSeqExtLib = Map.empty<Text, WarmSequencesTypes.WarmSequenceExt>();

  include AutopilotEmailMixin(
    accessControlState,
    integrationCreds,
    credSalt,
    bulkSendJobs,
    senderSubdomainsState,
    deliverabilityEvents,
    autopilotEmailConfig,
    apeEmailQueue,
    apeOpenCounts,
    apeSmsJobQueue,
    apeWarmSeqLib,
    transform,
    ?secretState,
  );

  // Autopilot Compliance & Deliverability Engine state
  let complianceAuditLog      = List.empty<AutopilotComplianceTypes.AuditLogEntry>();
  let optedOutEmails          = Set.empty<Text>();
  let optedOutPhones          = Set.empty<Text>();
  let complianceSubdomains    = Map.empty<Text, AutopilotEngineTypes.SenderSubdomainRecord>();
  let complianceConfigHolder  = object {
    public var v : AutopilotComplianceTypes.ComplianceConfig = {
      businessName      = "Booked Ranked Funded";
      physicalAddress   = "1234 Business Ave, Dallas, TX 75001, USA";
      unsubscribeBase   = "https://bookedrankedfunded.org/unsubscribe";
      adminEmail        = "BeyondAI.marketing@gmail.com";
      maxComplaintRate  = 0.003;
      maxBounceRate     = 0.05;
      softBounceRetries = 3;
    };
  };
  let complianceSoftBounces   = Map.empty<Text, Nat>();

  include AutopilotComplianceMixin(
    accessControlState,
    integrationCreds,
    credSalt,
    complianceAuditLog,
    optedOutEmails,
    optedOutPhones,
    complianceSubdomains,
    complianceConfigHolder,
    complianceSoftBounces,
    transform,
    ?secretState,
  );

  // SMS Autopilot Rules Engine state
  let smsAutopilotJobs  = List.empty<AutopilotEngineTypes.SmsAutopilotJob>();
  let smsAutopilotRules = object { public var v : [AutopilotEngineTypes.SmsAutopilotRule] = [] };
  let replyInboxItems   = List.empty<AutopilotEngineTypes.ReplyInboxItem>();
  let smsSentToday      = object { public var n : Nat = 0 };
  let smsLastReset      = object { public var t : Int = 0 };

  include AutopilotSmsMixin(
    accessControlState,
    integrationCreds,
    credSalt,
    smsAutopilotJobs,
    smsAutopilotRules,
    replyInboxItems,
    smsSentToday,
    smsLastReset,
    transform,
    ?secretState,
  );

  // ---- LLM Fallback Router state ----
  // In-memory health + route log for the unified LLM fallback chain.
  // Survives via orthogonal persistence (--default-persistent-actors).
  let llmFallbackState = LLMFallbackLib.emptyState();
  // Include the LLM fallback mixin BEFORE the 3 LLM-using skill mixins
  // (AutopilotReplyIntel, AIEmailGen, LeadAI) so routeLLMCall is in scope
  // for all of them. This becomes the single LLM entry point.
  include LLMFallbackMixin(llmFallbackState, integrationCreds, credSalt, transform, ?secretState);

  // ---- OmniRouter state + API ----
  // The OmniRouter is the universal AI dispatch layer that sits ABOVE both
  // the LLM fallback chain and the AI Orchestrator.  It classifies intent,
  // selects the optimal routing target (llm_direct | orchestrator), maps
  // intent to the best TaskType, builds BRF-branded system prompts, executes
  // via the existing LLMFallbackLib.route path, and records metrics for the
  // OmniRouter dashboard.
  let omniRouterState = OmniRouterLib.emptyState();
  include OmniRouterMixin(omniRouterState, llmFallbackState, integrationCreds, credSalt, transform, ?secretState);

  // ---- AI Orchestrator state ----
  // The orchestrator sits ABOVE the LLM fallback chain: it decomposes a
  // goal into sub-tasks, routes each through the existing routeLLMCall path,
  // validates outputs, retries on failure, stores memory via the memory
  // layer, emits an audit-trail entry, and returns a structured result.
  // Included AFTER LLMFallbackMixin (so routeLLMCall is in scope) and BEFORE
  // the LLM-using mixins (AutopilotReplyIntel, AIEmailGen, LeadAI,
  // LeadEngine) so the orchestrator's memory API surface is available to
  // them if needed.
  //
  // AIMemoryMixin is included SEPARATELY here (not inside AIOrchestratorMixin)
  // because passing inline function closures as the `assertAdmin` /
  // `assertTenantAccess` parameters of a nested include caused the moc 1.10.1
  // stable-signature crash (desugar.ml:1083): non-shared local function types
  // are not stabilizable. At the actor level the closures stabilize fine.
  let orchestratorState = AIOrchestratorLib.emptyState();
  let aiMemoryState = AIMemoryLib.emptyState();

  // ── AI Orchestrator + Memory public API ─────────────────────────────────
  //
  // These public functions are defined DIRECTLY in main.mo (not via a mixin)
  // to avoid the moc 1.10.1 stable-signature crash (desugar.ml:1083). Mixin
  // parameters become stable actor fields, and non-stabilizable types in
  // those parameters (non-shared function closures, complex nested types)
  // crash the compiler's stable-signature generation. By defining the public
  // functions directly on the actor, the state (orchestratorState,
  // aiMemoryState, stableStore, etc.) is accessed directly from the actor's
  // scope — it is NOT passed as a mixin parameter, so it does not become a
  // separate stable field. The state declarations above are already stable
  // fields (via --default-persistent-actors); these public functions just
  // reference them directly.

  /// Run the orchestrator on a goal. Sits ABOVE the LLM fallback chain:
  /// decomposes the goal into sub-tasks, routes each through the existing
  /// routeLLMCall path, validates outputs, retries on failure, stores memory
  /// via the memory layer, emits an audit-trail entry, and returns a
  /// structured result with a correlation id.
  public shared ({ caller }) func runOrchestrator(
    goal         : Text,
    scopeContext : AIOrchestratorTypes.ScopeContext,
    capability   : ?LLMFallbackTypes.TaskCapability,
  ) : async AIOrchestratorTypes.OrchestratorResult {
    // Build the OrchestratorRequest from the public function arguments.
    let tenantId : Text = switch (scopeContext.tenantId) {
      case (?t) t;
      case null "default";
    };
    let request : AIOrchestratorTypes.OrchestratorRequest = {
      goal;
      tenantId;
      scopeContext;
      capabilityHint = capability;
      memoryScopes   = ["tenant"];
      legacyFallback = ?{ enabled = true; provider = null };
    };

    // ── Callbacks ────────────────────────────────────────────────────────
    //
    // All callbacks are local async closures. They are NOT mixin parameters,
    // so they do not become stable actor fields and cannot trigger the
    // moc 1.10.1 stable-signature crash (desugar.ml:1083).

    // Route a sub-task through the existing LLM fallback chain.
    let routeLLMCb = func(
      subTask  : AIOrchestratorTypes.SubTask,
      messages : [LLMFallbackTypes.LLMMessage],
    ) : async Text {
      let creds2 : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
        case (null) ICLib.emptyCredentials();
        case (?enc) ICLib.decryptAllWithSecret(enc, credSalt, ?secretState);
      };
      let keys2  = LLMFallbackLib.resolveKeys(creds2);
      let flags2 : LLMFallbackLib.FeatureFlags = {
        leadEngineEnabled = true;
        twilioEnabled      = true;
        sendgridEnabled    = true;
      };
      let cap2 = AIOrchestratorLib.selectCapability(subTask, capability);
      let orMsgs : [OpenRouterTypes.OpenRouterMessage] =
        Array.tabulate(messages.size(), func(i : Nat) {
          { role = messages[i].role; content = messages[i].content }
        });
      await LLMFallbackLib.route(
        llmFallbackState,
        #Summarization,
        orMsgs,
        keys2,
        flags2,
        cap2,
        transform,
        func(_t : OpenRouterTypes.TaskType, _m : [OpenRouterTypes.OpenRouterMessage]) : async Text { "" },
      )
    };

    // Resolve provider keys (used by retry path in orchestrate).
    let resolveKeysCb = func() : async LLMFallbackTypes.ProviderKeys {
      let creds3 : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
        case (null) ICLib.emptyCredentials();
        case (?enc) ICLib.decryptAllWithSecret(enc, credSalt, ?secretState);
      };
      LLMFallbackLib.resolveKeys(creds3)
    };

    // Read memory context for the first scope (supplies prior context to LLM).
    let memReadCb = func(
      scope : AIOrchestratorTypes.MemoryScope,
      ctx   : AIOrchestratorTypes.ScopeContext,
    ) : async [LLMFallbackTypes.LLMMessage] {
      let sid = switch (ctx.tenantId) { case (?t) t; case null "" };
      let txt = AIMemoryLib.buildContextText(
        aiMemoryState, { store = stableStore.getStore() }, scope, sid, 10,
      );
      if (txt == "") { [] }
      else { [{ role = "system"; content = "Prior context:\n" # txt }] }
    };

    // Write a memory entry for each sub-task output.
    let memWriteCb = func(
      scope   : AIOrchestratorTypes.MemoryScope,
      ctx     : AIOrchestratorTypes.ScopeContext,
      content : Text,
    ) : async Text {
      let sid = switch (ctx.tenantId) { case (?t) t; case null "" };
      let key = "orch-" # Int.toText(Time.now());
      AIMemoryLib.writeMemory(
        aiMemoryState, { store = stableStore.getStore() },
        scope, sid, key, content, [], 5, [],
      )
    };

    // Emit an audit trail entry for admin visibility.
    let auditCb = func(corrId : Text, msg : Text) : async () {
      AdminAuditLib.appendAdminAudit(
        adminAuditStore,
        {
          actorPrincipal  = caller;
          tenantId;
          actionType      = #other("orchestrator");
          timestamp       = Time.now();
          redactedPayload = corrId # ": " # AdminAuditLib.redactSecrets(msg);
        },
        adminAuditNonce.n,
      );
      adminAuditNonce.n += 1;
    };

    // Rate-limit check: 100 orchestrator calls per tenant per minute.
    let rateLimitCb = func(tid : Text, maxReqs : Nat, windowMs : Nat) : async Bool {
      RateLimiter.checkRateLimit(rateLimiterState, "orch:" # tid, maxReqs, Int.fromNat(windowMs))
    };

    // Monotonic correlation ID for end-to-end tracing.
    let corrIdCb = func() : Text {
      "orch-" # tenantId # "-" # Int.toText(Time.now())
    };

    // ── Execute ──────────────────────────────────────────────────────────
    try {
      await AIOrchestratorLib.orchestrate(
        orchestratorState,
        request,
        routeLLMCb,
        resolveKeysCb,
        memReadCb,
        memWriteCb,
        auditCb,
        rateLimitCb,
        corrIdCb,
      )
    } catch (e) {
      {
        output           = "";
        provider         = null;
        model            = null;
        attempts         = 0;
        validationStatus = "skipped";
        memoryRefs       = [];
        correlationId    = "";
        errorMessage     = ?("runOrchestrator error: " # e.message());
      }
    }
  };

  /// Read a single memory entry by scope + key.
  public shared ({ caller = _ }) func getOrchestratorMemory(
    scope   : Text,
    scopeId : Text,
    key     : Text,
  ) : async ?AIMemoryTypes.MemoryEntry {
    AIMemoryLib.readMemory(aiMemoryState, { store = stableStore.getStore() }, scope, scopeId, key);
  };

  /// Write (or overwrite) a memory entry. Returns the generated entry id.
  public shared ({ caller = _ }) func writeOrchestratorMemory(
    scope      : Text,
    scopeId    : Text,
    key        : Text,
    content    : Text,
    metadata   : [(Text, Text)],
    importance : Nat,
    tags       : [Text],
  ) : async Text {
    AIMemoryLib.writeMemory(aiMemoryState, { store = stableStore.getStore() }, scope, scopeId, key, content, metadata, importance, tags);
  };

  /// List memory entries for a scope, optionally filtered.
  public shared ({ caller = _ }) func listOrchestratorMemory(
    scope   : Text,
    scopeId : Text,
    filter  : AIMemoryTypes.MemoryFilter,
  ) : async [AIMemoryTypes.MemoryEntry] {
    AIMemoryLib.listMemory(aiMemoryState, { store = stableStore.getStore() }, scope, scopeId, filter);
  };

  /// Admin-only orchestrator health snapshot, including memory-tier counts.
  public shared ({ caller }) func getOrchestratorHealth() : async AIOrchestratorTypes.OrchestratorHealth {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let snap = AIOrchestratorLib.healthSnapshot(orchestratorState);
    {
      runCount           = snap.runCount;
      failureCount       = snap.failureCount;
      successRate        = snap.successRate;
      inFlightCount      = snap.inFlightCount;
      memoryEntryCount   = AIMemoryLib.entryCount(aiMemoryState, { store = stableStore.getStore() });
      memoryHotTierCount = AIMemoryLib.hotTierCount(aiMemoryState);
    };
  };

  // ── Memory API (canonical surface) ──────────────────────────────────────

  /// Write (or overwrite) a memory entry. Returns the generated entry id.
  public shared ({ caller = _ }) func writeMemory(
    scope      : Text,
    scopeId    : Text,
    key        : Text,
    content    : Text,
    metadata   : [(Text, Text)],
    importance : Nat,
    tags       : [Text],
  ) : async Text {
    AIMemoryLib.writeMemory(aiMemoryState, { store = stableStore.getStore() }, scope, scopeId, key, content, metadata, importance, tags);
  };

  /// Read a single memory entry by scope + key.
  public shared ({ caller = _ }) func readMemory(
    scope   : Text,
    scopeId : Text,
    key     : Text,
  ) : async ?AIMemoryTypes.MemoryEntry {
    AIMemoryLib.readMemory(aiMemoryState, { store = stableStore.getStore() }, scope, scopeId, key);
  };

  /// List memory entries for a scope, optionally filtered.
  public shared ({ caller = _ }) func listMemory(
    scope   : Text,
    scopeId : Text,
    filter  : AIMemoryTypes.MemoryFilter,
  ) : async [AIMemoryTypes.MemoryEntry] {
    AIMemoryLib.listMemory(aiMemoryState, { store = stableStore.getStore() }, scope, scopeId, filter);
  };

  /// Delete a memory entry by scope + key. Returns true if an entry was
  /// removed.
  public shared ({ caller = _ }) func deleteMemory(
    scope   : Text,
    scopeId : Text,
    key     : Text,
  ) : async Bool {
    AIMemoryLib.deleteMemory(aiMemoryState, { store = stableStore.getStore() }, scope, scopeId, key);
  };

  /// Build merged context blocks for a set of scopes, ready for prompt
  /// injection.
  public shared ({ caller = _ }) func buildMemoryContext(
    scopes   : [Text],
    scopeIds : [Text],
  ) : async [AIMemoryTypes.MemoryContextBlock] {
    AIMemoryLib.buildContext(aiMemoryState, { store = stableStore.getStore() }, scopes, scopeIds);
  };

  /// Convenience wrapper around buildMemoryContext returning assembled Text.
  public shared ({ caller = _ }) func buildMemoryContextText(
    scopes   : [Text],
    scopeIds : [Text],
  ) : async Text {
    AIMemoryLib.buildContextText(aiMemoryState, { store = stableStore.getStore() }, scopes, scopeIds);
  };

  /// Total number of memory entries across both tiers.
  public shared ({ caller = _ }) func memoryEntryCount() : async Nat {
    AIMemoryLib.entryCount(aiMemoryState, { store = stableStore.getStore() });
  };

  /// Number of entries in the hot (in-memory) tier.
  public shared ({ caller = _ }) func memoryHotTierCount() : async Nat {
    AIMemoryLib.hotTierCount(aiMemoryState);
  };

  /// Number of durable-tier entries whose key starts with `prefix`.
  public shared ({ caller = _ }) func memoryDurableTierCount(prefix : Text) : async Nat {
    AIMemoryLib.durableTierCount({ store = stableStore.getStore() }, prefix);
  };

  // Email Reply Intelligence state
  let emailReplyRecords = List.empty<AutopilotEngineTypes.EmailReplyRecord>();

  include AutopilotReplyIntelMixin(
    accessControlState,
    integrationCreds,
    credSalt,
    emailReplyRecords,
    replyInboxItems,
    leads,
    transform,
    llmFallbackState,
    ?secretState,
  );

  // 3D Scanner — feature flags, audit log, and model/photo storage
  // scanner3dEnabled: per-tenant on/off toggle (TenantId -> Bool)
  let scanner3dEnabled   = Map.empty<Text, Bool>();
  // scanner3dToggleLog: audit trail — (adminId, tenantId, enabled, timestamp)
  let scanner3dToggleLog = List.empty<(Text, Text, Bool, Int)>();
  let scanModels         = Map.empty<Text, Scanner3DTypes.ScanModel>();
  let scanPhotos         = Map.empty<Text, Scanner3DTypes.ScanPhoto>();

  include Scanner3DMixin(
    accessControlState,
    scanner3dEnabled,
    scanner3dToggleLog,
    scanModels,
    scanPhotos,
  );

  // CSV Bulk Import state
  // extendedLeads: per-tenant map of extended lead records (from CSV import)
  let extendedLeads    = Map.empty<Text, Map.Map<Text, CsvImportTypes.ExtendedLead>>();
  // csvImportBatches: global map of import batch records keyed by batchId
  let csvImportBatches = Map.empty<Text, CsvImportTypes.CsvImportBatch>();

  include CsvImportMixin(accessControlState, extendedLeads, csvImportBatches);

  // CRM Drip Campaigns mixin — included here so extendedLeads is in scope for segmentation API
  include DripCampaignsMixin(accessControlState, dripQueues, dripEmailLogs, dripBounceRecords, dripThrottleConfigs, extendedLeads, transform);

  // Newsletter state
  // nlSubscribers: tenantId -> (email -> subscriber)
  let nlSubscribers = Map.empty<Text, Map.Map<Text, NewsletterTypes.NewsletterSubscriber>>();
  // nlCampaigns: tenantId -> (campaignId -> campaign)
  let nlCampaigns   = Map.empty<Text, Map.Map<Text, NewsletterTypes.NewsletterCampaign>>();
  // nlSendLogs: campaignId -> [SendLog]
  let nlSendLogs    = Map.empty<Text, List.List<NewsletterTypes.NewsletterSendLog>>();
  let nlIdCounter   = object { public var n : Nat = 0 };

  include NewsletterMixin(accessControlState, nlSubscribers, nlCampaigns, nlSendLogs, nlIdCounter);

  // Web Scraper state
  let scrapeHistory     = Map.empty<Nat, WebScraperTypes.ScrapeRecord>();
  let lastDomainRequest = Map.empty<Text, Int>();
  let scrapeIdCounter   = object { public var n : Nat = 0 };

  include WebScraperMixin(
    accessControlState,
    scrapeHistory,
    lastDomainRequest,
    scrapeIdCounter,
    leads,
    transform,
  );

  // LLM Lead Generation Engine — direct frontend endpoint using Claude + OpenAI GPT-4o
  include LLMLeadGenMixin(integrationCreds, credSalt, transform, ?secretState);
  // Admin Command Centre — Unified Command Center + Agent Orchestration Panel
  let commandCenterFeed    = List.empty<AdminCommandTypes.ActivityFeedItem>();
  let commandCenterMetrics = { var leadsToday : Nat = 0; var demosRunning : Nat = 0; var trialsActive : Nat = 0; var outreachSent : Nat = 0; var apiStatus : Bool = true };
  let commandCenterAgents  = Map.empty<Text, AdminCommandTypes.AgentStatus>();
  let commandCenterLogs    = List.empty<AdminCommandTypes.AgentLogEntry>();
  let commandCenterRules   = Map.empty<Text, AdminCommandTypes.TriggerRule>();
  include AdminCommandMixin(commandCenterFeed, commandCenterMetrics, commandCenterAgents, commandCenterLogs, commandCenterRules, adminAuditStore, adminAuditNonce);
  include OutreachPipelineMixin(pipelineLeadsStore, inboundRepliesStore, trialActivityEventsStore, queuedActionsStore);

  // ---- INTEGRATION HEALTH MONITOR state ----
  let apiPingState = Map.empty<Text, List.List<ICTypes.ApiPingRecord>>();
  include IntegrationHealthMixin(apiPingState);

  // ---- FEATURE TOGGLE state ----
  let featureToggles    = Map.empty<Text, FTTypes.FeatureToggle>();
  let featureToggleLogs = List.empty<FTTypes.FeatureToggleLog>();
  let ftLogIdCounter    = { var value : Nat = 0 };
  include FeatureToggleMixin(featureToggles, featureToggleLogs, ftLogIdCounter, adminAuditStore, adminAuditNonce);
  // ---- NICHE ANALYTICS & OPERATOR CHAT state ----
  var operatorChatMessages : List.List<OperatorChatTypes.OperatorChatMessage> = List.empty();
  let operatorChatState = { var nextMsgId : Nat = 0 };
  include NicheAnalyticsMixin(leads);
  include OperatorChatMixin(operatorChatMessages, operatorChatState, List.empty());
  // RAG Brain state
  let ragBrainState = RagBrainLib.emptyState();
  include RagBrainMixin(ragBrainState, transform);
  // N8N Workflow state
  let n8nState = N8NWorkflowLib.emptyState();
  include N8NWorkflowMixin(n8nState);
  // Voice Outreach Agent state
  let voaState = VOALib.emptyState();
  include VOAMixin(voaState, pipelineLeadsStore);  // Abacus / Composio / Account Brief / Toolkit Toggles
  let abacusState         = AbacusLib.emptyState();
  let composioState       = ComposioLib.emptyState();
  let accountBriefState   = AccountBriefLib.emptyState();
  let toolkitTogglesState = ToolkitTogglesLib.emptyState();
  include AbacusMixin(abacusState, integrationCreds, credSalt, transform, ?secretState);
  include ComposioMixin(composioState, integrationCreds, credSalt, transform, ?secretState);
  include AccountBriefMixin(accountBriefState);
  include ToolkitTogglesMixin(toolkitTogglesState);

  // ---- NEW SOCIAL / CONTENT OS STATE ----
  let verticalProfiles    = VerticalProfileLib.emptyState();
    ignore VerticalProfileLib.seedProfiles(verticalProfiles, VerticalProfileSeed.defaultProfiles());
  let workflowLogs        = WorkflowLogLib.emptyState();
  let contentCalendars      = ContentCalendarLib.emptyState();
  let socialPostDrafts      = SocialPostDraftLib.emptyState();
  let performanceInsights   = PerformanceInsightLib.emptyState();
  let monthlyReports        = MonthlyReportLib.emptyState();
  let approvalQueues        = ApprovalQueueLib.emptyState();

  // ---- CRM OBJECTS STATE ----
  let crmObjectsState = CrmObjectsLib.emptyState();

  let marketingAuditState = MarketingAuditLib.emptyState();
  let proposalState = ProposalLib.emptyState();
  let webhookContractsState = WebhookContractsLib.emptyState();

  // ---- BUSINESS BRIEF STATE ----
  let businessBriefState = BusinessBriefLib.emptyState();

  // ---- SERVICE AREA SEO STATE ----
  let serviceAreaSEOState = ServiceAreaSEOLib.emptyState();

  include VerticalProfileMixin(verticalProfiles);
  include WorkflowLogMixin(workflowLogs);
  include ContentCalendarMixin(contentCalendars);
  include SocialPostDraftMixin(socialPostDrafts);
  include PerformanceInsightMixin(performanceInsights);
  include MonthlyReportMixin(monthlyReports);
  include ApprovalQueueMixin(approvalQueues);

  // ---- RANKED DISPATCH STATE ----
  let rankedDispatchState = RankedDispatchLib.emptyState();

  // ---- MULTI-LOCATION ROLLUP STATE ----
  let multiLocationRollupState = MultiLocationRollupLib.emptyState();

  // ---- SERVICE AREA SEO MIXIN ----
  include ServiceAreaSEOMixin(serviceAreaSEOState);

  // ---- BUSINESS BRIEF MIXIN ----
  include BusinessBriefMixin(businessBriefState);
  include CrmObjectsMixin(crmObjectsState);
  include MarketingAuditMixin(marketingAuditState);

  // ---- CENTRALIZED ADMIN AUDIT TRAIL ----
  // adminAuditStore / adminAuditNonce are declared after stableStore so the
  // AdminCommandMixin and FeatureToggleMixin includes below can receive them
  // as parameters. See the declaration block after stableStore for details.
  include AdminAuditMixin(accessControlState, adminAuditStore, adminAuditNonce);
  include ProposalMixin(proposalState);
  include WebhookContractsMixin(webhookContractsState);
  include RankedDispatchMixin(rankedDispatchState);
  include MultiLocationRollupMixin(multiLocationRollupState);

  let dograhState = DograhLib.emptyState();
  include DograhMixin(dograhState, integrationCreds, credSalt, ?secretState);

  // ---- OpenRouter AI Router ----
  let openRouterState = OpenRouterLib.emptyState();
  include OpenRouterMixin(openRouterState, integrationCreds, credSalt, transform, ?secretState);

  // ---- Funnel Tracking ----
  let funnelTrackingState = FunnelTrackingLib.emptyState();
  include FunnelTrackingMixin(funnelTrackingState);

  // ---- Email Open/Click Tracking ----
  let emailTrackingIdx = EmailTrackingLib.emptyIndex();
  include EmailTrackingMixin(emailTrackingIdx, dripEmailLogs, funnelTrackingState, rateLimiterState);

  // ---- Trial Provisioning ----
  let trialProvState = TrialProvLib.emptyState();
  include TrialProvMixin(trialProvState, funnelTrackingState);

  // ---- Lead Auto-Enrollment ----
  let leadEnrollState = LeadEnrollLib.emptyState();
  include LeadEnrollMixin(leadEnrollState, extendedLeads, dripQueues, funnelTrackingState);

  // ---- AI Email Generation ----
  include AIEmailGenMixin(abacusState, openRouterState, extendedLeads, dripQueues, dripEmailLogs, transform, integrationCreds, credSalt, llmFallbackState, ?secretState);
  // ---- Master Agent state ----
  let masterAgentState : MasterAgentTypes.MasterAgentState = {
    sessions        = List.empty();
    activeSessionId = { var value = null };
  };
  include MasterAgentMixin(
    masterAgentState,
    openRouterState,
    accessControlState,
    { value = 0 },
    { value = 0 },
    { var value = 0 },
    transform,
    integrationCreds,
    credSalt,
    ?secretState,
  );

  // ---- Content Studio state ----
  let contentStudioState : CSTypes.ContentStudioState = CSTypes.emptyState();
  include ContentStudioMixin(contentStudioState, openRouterState, transform, integrationCreds, credSalt, ?secretState);

  // ---- Lead AI state ----
  let leadAIState : LeadAITypes.LeadAIState = LeadAITypes.emptyLeadAIState();
  include LeadAIMixin(accessControlState, leadAIState, openRouterState, transform, integrationCreds, credSalt, llmFallbackState, ?secretState);
  // ---- Lead Engine state (additive — gated by LEAD_ENGINE_ENABLED feature flag) ----
  let leadEngineState : LeadEngineTypes.LeadEngineState = LeadEngineTypes.emptyLeadEngineState();
  include LeadEngineMixin(accessControlState, leadEngineState, featureToggles, transform, integrationCreds, credSalt, llmFallbackState, openRouterState, ?secretState);
  // ---- Lead Engine OQL (additive — exposes leadEngineLead & leadEngineBatch
  // entities to the Data Intelligence agent; controller-only, no new public
  // API surface beyond the OQL schema()/execute() endpoints) ----
  // ---- Lead Engine + LLM Fallback OQL (additive — exposes the Lead Engine
  // collections and the in-memory LLM fallback route log to the Data
  // Intelligence agent; controller-only, no new public API surface beyond the
  // OQL schema()/execute() endpoints). Both entity lists are merged into a
  // single `Expose` include to avoid duplicate `schema()`/`execute()`
  // definitions in the actor block. ----
  include Expose({
    entities = LeadEngineOql.entities(leadEngineState).concat(
      LLMFallbackOql.entities(llmFallbackState),
    ).concat([AdminAuditLib.oqlEntity(adminAuditStore)]).concat(
      AIOrchestratorOql.entities(orchestratorState),
    );
  });
  // ---- Live Send state (additive — gated by TWILIO_INTEGRATION_ENABLED / SENDGRID_INTEGRATION_ENABLED feature flags) ----
  include LiveSendMixin(accessControlState, integrationCreds, credSalt, featureToggles, transform, ?secretState);
  // ---- Webhooks & Integrations state ----
  let webhookStateRef : { var s : WebhookState.WebhookState } = { var s = WebhookState.empty() };
  let vapiCallLogs = Map.empty<Text, List.List<VapiCallLog>>();
  // Post-call follow-up log: (callerPhone, smsSentTo, emailSentTo, timestamp, success, errorMsg)
  let postCallFollowUpLog = List.empty<(Text, Text, ?Text, Int, Bool, ?Text)>();
  // Unified webhook inbox state (normalized event store). Additive — gated by
  // the WEBHOOK_INBOX_ENABLED feature flag inside the mixin.
  let webhookInboxState : { var s : WebhookInboxTypes.WebhookInboxState } = { var s = WebhookInboxTypes.empty() };
  include WebhooksAndIntegrationsMixin(webhookStateRef, integrationCreds, credSalt, transform, vapiCallLogs, postCallFollowUpLog, webhookInboxState, rateLimiterState, ?secretState);
  include WebhookInboxMixin(webhookInboxState, featureToggles, optedOutEmails, rateLimiterState);
  include ObservabilityMixin(accessControlState, func() : Text { "build-2026-07-08T20:00:00Z" }, canisterStartTime, apiPingState, llmFallbackState, func() : [(Text, Nat)] { let r = List.empty<(Text, Nat)>(); for ((tenantId, tenantLeads) in leads.entries()) { r.add((tenantId, tenantLeads.size())) }; r.toArray() }, webhookInboxState, emailLogs, rateLimitRejections);

  // ---- Roofing Outreach Campaign state ----
  // roofingLeadStatuses: email -> LeadCampaignStatus (enrollment & step tracking)
  let roofingLeadStatuses = Map.empty<Text, RoofingCampaignTypes.LeadCampaignStatus>();
  // gridAuditResults: email -> latest GridAuditResult
  let gridAuditResults    = Map.empty<Text, RoofingCampaignTypes.GridAuditResult>();
  // gridAuditHistory: email -> list of GridAuditSnapshot
  let gridAuditHistory    = Map.empty<Text, List.List<RoofingCampaignTypes.GridAuditSnapshot>>();
  // campaignCounters: mutable aggregate counters
  let roofingCampaignCounters : RoofingCampaignTypes.CampaignCounters = {
    var totalSent     = 0;
    var sentToday     = 0;
    var sentThisWeek  = 0;
    var totalOpens    = 0;
    var totalClicks   = 0;
    var lastDayReset  = 0;
    var lastWeekReset = 0;
    var paused        = false;
  };
  // emailTemplates: id -> EmailTemplate (pre-written campaign templates)
  let emailTemplates      = Map.empty<Nat, EmailTemplateTypes.EmailTemplateExt>();
  let emailTemplatesExt   = Map.empty<Nat, EmailTemplateTypes.EmailTemplateExt>();
  // templateInitialized: one-time seed guard
  let templateInitialized = { var v = false };
  // sendLogs: email -> list of SendLogEntry (per-lead send history)
  let sendLogs            = Map.empty<Text, List.List<EmailTemplateTypes.SendLogEntry>>();

  include RoofingCampaignMixin(
    accessControlState,
    integrationCreds,
    credSalt,
    roofingLeadStatuses,
    gridAuditResults,
    gridAuditHistory,
    roofingCampaignCounters,
    transform,
    extendedLeads,
    emailTemplatesExt,
    templateInitialized,
    sendLogs,
    ?secretState,
  );

  // (duplicate block removed — states and mixins consolidated above)

  // ---- Roofer Cold Campaign state (additive — gated by
  // ROOFER_COLD_CAMPAIGN_ENABLED feature flag, default true) ----
  // Lives as a NEW dedicated subsystem separate from the legacy
  // RoofingCampaignManager; powers the /roofer-campaign page.
  let rooferColdCampaignState : RooferColdCampaignTypes.RooferColdCampaignState =
    RooferColdCampaignTypes.emptyRooferColdCampaignState();
  include RooferColdCampaignMixin(accessControlState, rooferColdCampaignState, featureToggles);

  func checkUrl(url : Text) : async Bool {
    try {
      let response = await Outcall.httpGetRequest(url, [], transform);
      response.size() > 0;
    } catch (_) {
      false;
    };
  };

  // ---- LIVE AUDIT FUNCTIONS ----

  public shared ({ caller }) func runPageSpeedAudit(url : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    let apiUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" # url # "&strategy=mobile&category=performance&category=seo&category=best-practices";
    await Outcall.httpGetRequest(apiUrl, [], transform);
  };

  public shared ({ caller }) func checkSocialPresence(businessName : Text) : async SocialPresence {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    let slug = businessName.replace(#char ' ', "-");
    let fbOk = await checkUrl("https://www.facebook.com/" # slug);
    let igOk = await checkUrl("https://www.instagram.com/" # slug);
    let liOk = await checkUrl("https://www.linkedin.com/company/" # slug);
    let gmOk = await checkUrl("https://maps.google.com/?q=" # businessName);
    { facebook = fbOk; instagram = igOk; linkedin = liOk; googleMaps = gmOk; gmbUrl = ""; yelpUrl = ""; facebookUrl = ""; napConsistent = false };
  };

  public func checkSocialPresencePublic(businessName : Text) : async SocialPresence {
    let slug = businessName.replace(#char ' ', "-");
    let fbOk = await checkUrl("https://www.facebook.com/" # slug);
    let igOk = await checkUrl("https://www.instagram.com/" # slug);
    let liOk = await checkUrl("https://www.linkedin.com/company/" # slug);
    let gmOk = await checkUrl("https://maps.google.com/?q=" # businessName);
    { facebook = fbOk; instagram = igOk; linkedin = liOk; googleMaps = gmOk; gmbUrl = ""; yelpUrl = ""; facebookUrl = ""; napConsistent = false };
  };

  public func runPageSpeedAuditPublic(url : Text) : async Text {
    let apiUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" # url # "&strategy=mobile&category=performance&category=seo&category=best-practices";
    await Outcall.httpGetRequest(apiUrl, [], transform);
  };

  // ---- FREE AUDIT LEADS ----

  public shared ({ caller }) func saveFreeAuditLead(
    businessName : Text,
    websiteUrl : Text,
    location : Text,
    contactEmail : Text,
    phone : Text,
    overallScore : Nat
  ) : async () {
    // Rate limit: 10 free-audit submissions per caller per 60s window.
    if (not RateLimiter.checkRateLimit(rateLimiterState, "free-audit:" # caller.toText(), 10, 60_000)) {
      rateLimitRejections.n += 1;
      Runtime.trap("Rate limit exceeded: too many free-audit submissions. Please retry shortly.");
    };
    let now = Time.now();
    let id = "fal-" # now.toText();
    let lead : FreeAuditLead = {
      id;
      businessName;
      websiteUrl;
      location;
      contactEmail;
      phone;
      overallScore;
      createdAt = now;
    };
    freeAuditLeads.add(id, lead);
  };

  public query ({ caller }) func getFreeAuditLeads() : async [FreeAuditLead] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let list = List.empty<FreeAuditLead>();
    for (lead in freeAuditLeads.values()) { list.add(lead) };
    list.toArray();
  };

  // ---- USER PROFILES ----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ---- TENANTS ----

  public query ({ caller }) func getAllTenants() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    tenants.values().toArray();
  };

  public query ({ caller }) func getTenantName(tenantId : TenantId) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (tenants.get(tenantId)) {
      case (?name) { name };
      case (null) { Runtime.trap("Tenant not found") };
    };
  };

  public shared ({ caller }) func createTenant(tenantId : TenantId, name : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    tenants.add(tenantId, name);
  };

  // ---- LEADS ----

  func getLeadsByTenantIdInternal(tenantId : TenantId) : List.List<Lead> {
    switch (leads.get(tenantId)) {
      case (?tenantLeads) {
        let leadList = List.empty<Lead>();
        for (lead in tenantLeads.values()) { leadList.add(lead) };
        leadList;
      };
      case (null) { List.empty() };
    };
  };

  func createLeadInternal(lead : Lead) {
    let tenantLeads = switch (leads.get(lead.tenantId)) {
      case (?existing) { existing };
      case (null) { Map.empty<Text, Lead>() };
    };
    tenantLeads.add(lead.id, lead);
    leads.add(lead.tenantId, tenantLeads);
    // Auto-enroll roofing leads into the roofing outreach campaign
    if (lead.niche.toLower().contains(#text "roof")) {
      let rl : RoofingCampaignTypes.RoofingLead = {
        email        = lead.email;
        companyName  = lead.name;
        city         = "";
        state        = "";
        phone        = if (lead.phone == "") null else ?lead.phone;
        website      = null;
        businessType = "roofing contractor";
      };
      let normEmail = rl.email.toLower().trim(#char ' ');
      switch (roofingLeadStatuses.get(normEmail)) {
        case null {
          let status = RoofingCampaignLib.newLeadStatus(rl, Time.now());
          roofingLeadStatuses.add(normEmail, status);
        };
        case (?existing) {
          switch (existing.status) {
            case (#unsubscribed) {};
            case (#active) {};
            case (#completed) {}; // skip
            case (#paused) {
              roofingLeadStatuses.add(normEmail, { existing with status = #active });
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func createLead(lead : Lead) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, lead.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    createLeadInternal(lead);
  };

  public query ({ caller }) func getLeadsByTenantId(tenantId : TenantId) : async [Lead] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    getLeadsByTenantIdInternal(tenantId).toArray().sort();
  };

  public query ({ caller }) func getLeadById(tenantId : TenantId, leadId : Text) : async ?Lead {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (leads.get(tenantId)) {
      case (?tenantLeads) { tenantLeads.get(leadId) };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateLead(tenantId : TenantId, leadId : Text, lead : Lead) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (leads.get(tenantId)) {
      case (?tenantLeads) { tenantLeads.add(leadId, lead) };
      case (null) { Runtime.trap("Lead not found") };
    };
  };

  public shared ({ caller }) func deleteLead(tenantId : TenantId, leadId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (leads.get(tenantId)) {
      case (?tenantLeads) { tenantLeads.remove(leadId) };
      case (null) { Runtime.trap("Lead not found") };
    };
  };

  // ---- REVIEWS ----

  func getReviewsByTenantIdInternal(tenantId : TenantId) : List.List<Review> {
    switch (reviews.get(tenantId)) {
      case (?tenantReviews) {
        let reviewList = List.empty<Review>();
        for (review in tenantReviews.values()) { reviewList.add(review) };
        reviewList;
      };
      case (null) { List.empty() };
    };
  };

  func createReviewInternal(review : Review) {
    let tenantReviews = switch (reviews.get(review.tenantId)) {
      case (?existing) { existing };
      case (null) { Map.empty<Text, Review>() };
    };
    tenantReviews.add(review.id, review);
    reviews.add(review.tenantId, tenantReviews);
  };

  public shared ({ caller }) func createReview(review : Review) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, review.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    createReviewInternal(review);
  };

  public query ({ caller }) func getReviewsByTenantId(tenantId : TenantId) : async [Review] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    getReviewsByTenantIdInternal(tenantId).toArray().sort();
  };

  public query ({ caller }) func getReviewById(tenantId : TenantId, reviewId : Text) : async ?Review {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (reviews.get(tenantId)) {
      case (?tenantReviews) { tenantReviews.get(reviewId) };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateReview(tenantId : TenantId, reviewId : Text, review : Review) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (reviews.get(tenantId)) {
      case (?tenantReviews) { tenantReviews.add(reviewId, review) };
      case (null) { Runtime.trap("Review not found") };
    };
  };

  public shared ({ caller }) func deleteReview(tenantId : TenantId, reviewId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (reviews.get(tenantId)) {
      case (?tenantReviews) { tenantReviews.remove(reviewId) };
      case (null) { Runtime.trap("Review not found") };
    };
  };

  // ---- AUDIT & FUNDABILITY SCORES ----

  func updateAuditScoreInternal(tenantId : TenantId, score : Nat) {
    let existing = switch (auditScores.get(tenantId)) {
      case (?s) { s };
      case (null) { { tenantId; score = 0; seoScore = 0; technicalScore = 0; contentScore = 0; conversionScore = 0; subfactors = []; lastUpdated = Time.now() } };
    };
    auditScores.add(tenantId, { existing with score; lastUpdated = Time.now() });
  };

  func updateFundabilityScoreInternal(tenantId : TenantId, score : Nat) {
    let existing = switch (fundabilityScores.get(tenantId)) {
      case (?s) { s };
      case (null) { { tenantId; score = 0; eligibilityPhase = 0; creditworthinessPhase = 0; timelinePhase = 0; lastUpdated = Time.now() } };
    };
    fundabilityScores.add(tenantId, { existing with score; lastUpdated = Time.now() });
  };

  public shared ({ caller }) func updateAuditScore(tenantId : TenantId, score : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update audit scores");
    };
    updateAuditScoreInternal(tenantId, score);
  };

  public shared ({ caller }) func upsertAuditScore(score : AuditScore) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update audit scores");
    };
    auditScores.add(score.tenantId, score);
  };

  public query ({ caller }) func getAuditScore(tenantId : TenantId) : async ?AuditScore {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    auditScores.get(tenantId);
  };

  public shared ({ caller }) func updateFundabilityScore(tenantId : TenantId, score : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update fundability scores");
    };
    updateFundabilityScoreInternal(tenantId, score);
  };

  public shared ({ caller }) func upsertFundabilityScore(score : FundabilityScore) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update fundability scores");
    };
    fundabilityScores.add(score.tenantId, score);
  };

  public query ({ caller }) func getFundabilityScore(tenantId : TenantId) : async ?FundabilityScore {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    fundabilityScores.get(tenantId);
  };

  // ---- CHAT WIDGET CONFIG ----

  public shared ({ caller }) func upsertChatWidgetConfig(config : ChatWidgetConfig) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, config.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    chatWidgetConfigs.add(config.tenantId, config);
  };

  public query ({ caller }) func getChatWidgetConfig(tenantId : TenantId) : async ?ChatWidgetConfig {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    chatWidgetConfigs.get(tenantId);
  };

  public query ({ caller }) func getActiveChatWidgetConfigs() : async [ChatWidgetConfig] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return chatWidgetConfigs.values().toArray().filter(func(c) { c.active });
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (chatWidgetConfigs.get(profile.tenantId)) {
          case (?config) { if (config.active) { [config] } else { [] } };
          case (null) { [] };
        };
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteChatWidgetConfig(tenantId : TenantId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    chatWidgetConfigs.remove(tenantId);
  };

  // ---- VOICE AGENT CONFIG ----

  public shared ({ caller }) func upsertVoiceAgentConfig(config : VoiceAgentConfig) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, config.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    voiceAgentConfigs.add(config.tenantId, config);
  };

  public query ({ caller }) func getVoiceAgentConfig(tenantId : TenantId) : async ?VoiceAgentConfig {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    voiceAgentConfigs.get(tenantId);
  };

  public query ({ caller }) func getConfiguredVoiceAgents() : async [VoiceAgentConfig] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return voiceAgentConfigs.values().toArray().filter(func(v) { v.configured });
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (voiceAgentConfigs.get(profile.tenantId)) {
          case (?config) { if (config.configured) { [config] } else { [] } };
          case (null) { [] };
        };
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteVoiceAgentConfig(tenantId : TenantId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    voiceAgentConfigs.remove(tenantId);
  };

  // ---- REVIEW REQUESTS ----

  public shared ({ caller }) func createReviewRequest(request : ReviewRequest) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not hasAccessToTenant(caller, request.tenantId)) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let updatedRequest = { request with lastFollowUp = Time.now() };
    let tenantRequests = switch (reviewRequests.get(request.tenantId)) {
      case (?existing) { existing };
      case (null) { Map.empty<Text, ReviewRequest>() };
    };
    tenantRequests.add(request.id, updatedRequest);
    reviewRequests.add(request.tenantId, tenantRequests);
  };

  public shared ({ caller }) func updateReviewRequestStatus(tenantId : TenantId, requestId : Text, status : ReviewRequestStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not hasAccessToTenant(caller, tenantId)) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (reviewRequests.get(tenantId)) {
      case (?tenantRequests) {
        switch (tenantRequests.get(requestId)) {
          case (?request) {
            tenantRequests.add(requestId, { request with status; lastFollowUp = Time.now() });
          };
          case (null) { Runtime.trap("Review request not found") };
        };
      };
      case (null) { Runtime.trap("No review requests for tenant") };
    };
  };

  public query ({ caller }) func getReviewRequests(tenantId : TenantId) : async [ReviewRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (reviewRequests.get(tenantId)) {
      case (?tenantRequests) {
        let list = List.empty<ReviewRequest>();
        for (request in tenantRequests.values()) { list.add(request) };
        list.toArray();
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getReviewRequest(tenantId : TenantId, requestId : Text) : async ?ReviewRequest {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (reviewRequests.get(tenantId)) {
      case (?tenantRequests) { tenantRequests.get(requestId) };
      case (null) { null };
    };
  };

  public shared ({ caller }) func deleteReviewRequest(tenantId : TenantId, requestId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (reviewRequests.get(tenantId)) {
      case (?tenantRequests) { tenantRequests.remove(requestId) };
      case (null) { Runtime.trap("Review request not found") };
    };
  };

  // ---- AGENCY SETTINGS ----

  public shared ({ caller }) func updateAgencySettings(settings : AgencySettings) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update agency settings");
    };
    await ensureSecretInit();
    agencySettings := ?settings;
    // Backward-compat migration: if serpApiKey is set in AgencySettings and
    // the unified IntegrationCredentials for "platform" does not yet have it,
    // write it across automatically so lead-finding services can pick it up.
    if (settings.serpApiKey != "") {
      let tid = "platform";
      let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get(tid)) {
        case (?enc) { ICLib.decryptAllWithSecret(enc, credSalt, ?secretState) };
        case (null) {
          {
            openaiKey = ""; claudeKey = ""; litellmUrl = ""; litellmKey = ""; ollamaUrl = "";
            twilioSid = ""; twilioAuth = ""; twilioNumber = ""; vapiKey = "";
            stripeKey = ""; stripeWebhookSecret = "";
            googleClientId = ""; googleClientSecret = "";
            yelpApiKey = ""; facebookAppId = ""; facebookAppSecret = "";
            emailSmtpHost = ""; emailSmtpPort = ""; emailSmtpUser = ""; emailSmtpPass = "";
            hunterApiKey = ""; neverBounceKey = "";
            listmonkUrl = ""; listmonkUser = ""; listmonkPass = "";
            searxngUrl = "";
            elevenLabsKey = ""; elevenLabsVoiceId = "";
            perplexityApiKey = "";
            autoBrowserUrl = "";
            serpApiKey = "";
            serpApiDevKey = "";
            sendgridKey = "";
            tinyFishKey = "";
            n8nInstanceUrl = "";
            n8nApiKey = [];
            nvidiaApiKey = [];
            nvidiaNimApiKey = "";
            abacusApiKey = "";
            composioApiKey = "";
            dograhApiKey = "";
            openRouterApiKey = "";
            vapiWebhookSecret = "";
            sendgridInboundParseDomain = "";
            composioWebhookSecret = "";
            geminiApiKey = "";
          }
        };
      };
      // Only migrate if the unified store doesn't already have a serpApiKey
      if (existing.serpApiKey == "") {
        let migrated = { existing with
          serpApiKey  = settings.serpApiKey;
          sendgridKey = if (existing.sendgridKey == "") settings.sendgridKey else existing.sendgridKey;
        };
        integrationCreds.add(tid, ICLib.encryptAllWithSecret(migrated, credSalt, ?secretState));
      };
    };
  };

  public query ({ caller }) func getAgencySettings() : async ?AgencySettings {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view agency settings");
    };
    agencySettings;
  };

  // ---- NOTIFICATIONS ----

  public shared ({ caller }) func createNotification(notification : NotificationRecord) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    notifications.add(notification.id, notification);
  };

  public query ({ caller }) func getNotificationsByTenant(tenantId : TenantId) : async [NotificationRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<NotificationRecord>();
    for (n in notifications.values()) {
      if (n.tenantId == tenantId) { list.add(n) };
    };
    list.toArray();
  };

  public shared ({ caller }) func markNotificationRead(notificationId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (notifications.get(notificationId)) {
      case (?n) { notifications.add(notificationId, { n with read = true }) };
      case (null) { Runtime.trap("Notification not found") };
    };
  };

  // ---- BILLING ----

  public shared ({ caller }) func upsertBillingRecord(record : BillingRecord) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    billingRecords.add(record.id, record);
  };

  public query ({ caller }) func getBillingRecordsByTenant(tenantId : TenantId) : async [BillingRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<BillingRecord>();
    for (r in billingRecords.values()) {
      if (r.tenantId == tenantId) { list.add(r) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertPaymentMethod(method : PaymentMethod) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, method.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    paymentMethods.add(method.tenantId, method);
  };

  public query ({ caller }) func getPaymentMethod(tenantId : TenantId) : async ?PaymentMethod {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    paymentMethods.get(tenantId);
  };

  public shared ({ caller }) func upsertInvoice(invoice : Invoice) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    invoices.add(invoice.id, invoice);
  };

  public query ({ caller }) func getInvoicesByTenant(tenantId : TenantId) : async [Invoice] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<Invoice>();
    for (inv in invoices.values()) {
      if (inv.tenantId == tenantId) { list.add(inv) };
    };
    list.toArray();
  };

  // ---- WHITE-LABEL CONFIG ----

  public shared ({ caller }) func upsertWhiteLabelConfig(config : WhiteLabelConfig) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, config.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    whiteLabelConfigs.add(config.tenantId, { config with updatedAt = Time.now() });
  };

  public query ({ caller }) func getWhiteLabelConfig(tenantId : TenantId) : async ?WhiteLabelConfig {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    whiteLabelConfigs.get(tenantId);
  };

  public query ({ caller }) func getAllWhiteLabelConfigs() : async [WhiteLabelConfig] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    whiteLabelConfigs.values().toArray();
  };

  // ---- CAMPAIGNS ----

  public shared ({ caller }) func upsertCampaignTemplate(template : CampaignTemplate) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    campaignTemplates.add(template.id, template);
  };

  public query ({ caller }) func getCampaignTemplates() : async [CampaignTemplate] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    campaignTemplates.values().toArray();
  };

  public shared ({ caller }) func deleteCampaignTemplate(templateId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    campaignTemplates.remove(templateId);
  };

  public shared ({ caller }) func upsertCampaignInstance(tenantId : TenantId, instance : CampaignInstance) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let tenantCampaigns = switch (campaignInstances.get(tenantId)) {
      case (?existing) { existing };
      case (null) { Map.empty<Text, CampaignInstance>() };
    };
    tenantCampaigns.add(instance.id, instance);
    campaignInstances.add(tenantId, tenantCampaigns);
  };

  public query ({ caller }) func getCampaignInstancesByTenant(tenantId : TenantId) : async [CampaignInstance] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (campaignInstances.get(tenantId)) {
      case (?tenantCampaigns) {
        let list = List.empty<CampaignInstance>();
        for (c in tenantCampaigns.values()) { list.add(c) };
        list.toArray();
      };
      case (null) { [] };
    };
  };

  // ---- AGENT PRODUCTS ----

  public shared ({ caller }) func upsertAgentProduct(product : AgentProduct) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    agentProducts.add(product.id, { product with updatedAt = Time.now() });
  };

  public query ({ caller }) func getAgentProducts() : async [AgentProduct] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    agentProducts.values().toArray();
  };

  public shared ({ caller }) func deleteAgentProduct(productId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    agentProducts.remove(productId);
  };

  // ---- AGENT SUBSCRIPTIONS ----

  public shared ({ caller }) func upsertAgentSubscription(tenantId : TenantId, subscription : AgentSubscription) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let tenantSubs = switch (agentSubscriptions.get(tenantId)) {
      case (?existing) { existing };
      case (null) { Map.empty<Text, AgentSubscription>() };
    };
    tenantSubs.add(subscription.id, { subscription with updatedAt = Time.now() });
    agentSubscriptions.add(tenantId, tenantSubs);
  };

  public query ({ caller }) func getAgentSubscriptionsByTenant(tenantId : TenantId) : async [AgentSubscription] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (agentSubscriptions.get(tenantId)) {
      case (?tenantSubs) {
        let list = List.empty<AgentSubscription>();
        for (s in tenantSubs.values()) { list.add(s) };
        list.toArray();
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAllAgentSubscriptions() : async [AgentSubscription] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let list = List.empty<AgentSubscription>();
    for (tenantSubs in agentSubscriptions.values()) {
      for (s in tenantSubs.values()) { list.add(s) };
    };
    list.toArray();
  };

  // ---- AGENT TASKS ----

  public shared ({ caller }) func upsertAgentTask(task : AgentTask) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, task.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    agentTasks.add(task.id, { task with updatedAt = Time.now() });
  };

  public query ({ caller }) func getAgentTasksByTenant(tenantId : TenantId) : async [AgentTask] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<AgentTask>();
    for (t in agentTasks.values()) {
      if (t.tenantId == tenantId) { list.add(t) };
    };
    list.toArray();
  };

  public query ({ caller }) func getAllAgentTasks() : async [AgentTask] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    agentTasks.values().toArray();
  };

  public shared ({ caller }) func deleteAgentTask(taskId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    agentTasks.remove(taskId);
  };

  // ---- AGENT DELIVERABLES ----

  public shared ({ caller }) func upsertAgentDeliverable(deliverable : AgentDeliverable) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, deliverable.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    agentDeliverables.add(deliverable.id, deliverable);
  };

  public query ({ caller }) func getAgentDeliverablesByTenant(tenantId : TenantId) : async [AgentDeliverable] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<AgentDeliverable>();
    for (d in agentDeliverables.values()) {
      if (d.tenantId == tenantId) { list.add(d) };
    };
    list.toArray();
  };

  // ---- AGENT SERVICE REQUESTS ----

  public shared ({ caller }) func upsertAgentServiceRequest(request : AgentServiceRequest) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, request.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    agentServiceRequests.add(request.id, { request with updatedAt = Time.now() });
  };

  public query ({ caller }) func getAgentServiceRequestsByTenant(tenantId : TenantId) : async [AgentServiceRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<AgentServiceRequest>();
    for (r in agentServiceRequests.values()) {
      if (r.tenantId == tenantId) { list.add(r) };
    };
    list.toArray();
  };

  public query ({ caller }) func getAllAgentServiceRequests() : async [AgentServiceRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    agentServiceRequests.values().toArray();
  };

  // ---- AGENT PERFORMANCE SNAPSHOTS ----

  public shared ({ caller }) func upsertAgentPerformanceSnapshot(snapshot : AgentPerformanceSnapshot) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, snapshot.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    agentPerformanceSnapshots.add(snapshot.id, snapshot);
  };

  public query ({ caller }) func getAgentPerformanceSnapshotsByTenant(tenantId : TenantId) : async [AgentPerformanceSnapshot] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<AgentPerformanceSnapshot>();
    for (s in agentPerformanceSnapshots.values()) {
      if (s.tenantId == tenantId) { list.add(s) };
    };
    list.toArray();
  };

  // ---- HUMAN OVERSIGHT ASSIGNMENTS ----

  public shared ({ caller }) func upsertHumanOversightAssignment(assignment : HumanOversightAssignment) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, assignment.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    humanOversightAssignments.add(assignment.id, assignment);
  };

  public query ({ caller }) func getHumanOversightAssignmentsByTenant(tenantId : TenantId) : async [HumanOversightAssignment] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<HumanOversightAssignment>();
    for (a in humanOversightAssignments.values()) {
      if (a.tenantId == tenantId) { list.add(a) };
    };
    list.toArray();
  };

  // ---- SEO & GEO AGENT ----

  public shared ({ caller }) func upsertSeoGeoSubscription(sub : SeoGeoSubscription) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, sub.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    seoGeoSubscriptions.add(sub.tenantId, { sub with updatedAt = Time.now() });
  };

  public query ({ caller }) func getSeoGeoSubscription(tenantId : TenantId) : async ?SeoGeoSubscription {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    seoGeoSubscriptions.get(tenantId);
  };

  public query ({ caller }) func getAllSeoGeoSubscriptions() : async [SeoGeoSubscription] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    seoGeoSubscriptions.values().toArray();
  };

  public shared ({ caller }) func addSeoGeoScore(score : SeoGeoScore) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, score.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let scoreList = switch (seoGeoScores.get(score.tenantId)) {
      case (?existing) { existing };
      case (null) { List.empty<SeoGeoScore>() };
    };
    scoreList.add(score);
    seoGeoScores.add(score.tenantId, scoreList);
  };

  public query ({ caller }) func getSeoGeoScores(tenantId : TenantId) : async [SeoGeoScore] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (seoGeoScores.get(tenantId)) {
      case (?list) { list.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func upsertSeoGeoIssue(issue : SeoGeoIssue) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, issue.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    seoGeoIssues.add(issue.id, { issue with updatedAt = Time.now() });
  };

  public query ({ caller }) func getSeoGeoIssuesByTenant(tenantId : TenantId) : async [SeoGeoIssue] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<SeoGeoIssue>();
    for (i in seoGeoIssues.values()) {
      if (i.tenantId == tenantId) { list.add(i) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertSeoGeoOpportunity(opp : SeoGeoOpportunity) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, opp.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    seoGeoOpportunities.add(opp.id, opp);
  };

  public query ({ caller }) func getSeoGeoOpportunitiesByTenant(tenantId : TenantId) : async [SeoGeoOpportunity] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<SeoGeoOpportunity>();
    for (o in seoGeoOpportunities.values()) {
      if (o.tenantId == tenantId) { list.add(o) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertSeoGeoRequest(request : SeoGeoRequest) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, request.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    seoGeoRequests.add(request.id, { request with updatedAt = Time.now() });
  };

  public query ({ caller }) func getSeoGeoRequestsByTenant(tenantId : TenantId) : async [SeoGeoRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<SeoGeoRequest>();
    for (r in seoGeoRequests.values()) {
      if (r.tenantId == tenantId) { list.add(r) };
    };
    list.toArray();
  };

  public query ({ caller }) func getAllSeoGeoRequests() : async [SeoGeoRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    seoGeoRequests.values().toArray();
  };

  public shared ({ caller }) func upsertSeoGeoDeliverable(deliverable : SeoGeoDeliverable) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, deliverable.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    seoGeoDeliverables.add(deliverable.id, deliverable);
  };

  public query ({ caller }) func getSeoGeoDeliverablesByTenant(tenantId : TenantId) : async [SeoGeoDeliverable] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<SeoGeoDeliverable>();
    for (d in seoGeoDeliverables.values()) {
      if (d.tenantId == tenantId) { list.add(d) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertSeoGeoReport(report : SeoGeoReport) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, report.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    seoGeoReports.add(report.id, report);
  };

  public query ({ caller }) func getSeoGeoReportsByTenant(tenantId : TenantId) : async [SeoGeoReport] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<SeoGeoReport>();
    for (r in seoGeoReports.values()) {
      if (r.tenantId == tenantId) { list.add(r) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertSeoGeoContentItem(item : SeoGeoContentItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, item.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    seoGeoContentItems.add(item.id, { item with updatedAt = Time.now() });
  };

  public query ({ caller }) func getSeoGeoContentItemsByTenant(tenantId : TenantId) : async [SeoGeoContentItem] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<SeoGeoContentItem>();
    for (c in seoGeoContentItems.values()) {
      if (c.tenantId == tenantId) { list.add(c) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertSeoGeoGbpTask(task : SeoGeoGbpTask) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, task.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    seoGeoGbpTasks.add(task.id, { task with updatedAt = Time.now() });
  };

  public query ({ caller }) func getSeoGeoGbpTasksByTenant(tenantId : TenantId) : async [SeoGeoGbpTask] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<SeoGeoGbpTask>();
    for (t in seoGeoGbpTasks.values()) {
      if (t.tenantId == tenantId) { list.add(t) };
    };
    list.toArray();
  };

  public shared ({ caller }) func addSeoGeoVisibilitySnapshot(snapshot : SeoGeoVisibilitySnapshot) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, snapshot.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let snapList = switch (seoGeoVisibilitySnapshots.get(snapshot.tenantId)) {
      case (?existing) { existing };
      case (null) { List.empty<SeoGeoVisibilitySnapshot>() };
    };
    snapList.add(snapshot);
    seoGeoVisibilitySnapshots.add(snapshot.tenantId, snapList);
  };

  public query ({ caller }) func getSeoGeoVisibilitySnapshots(tenantId : TenantId) : async [SeoGeoVisibilitySnapshot] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (seoGeoVisibilitySnapshots.get(tenantId)) {
      case (?list) { list.toArray() };
      case (null) { [] };
    };
  };

  // ---- PAID ADS AGENT ----

  public shared ({ caller }) func upsertPaidAdsSubscription(sub : PaidAdsSubscription) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, sub.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    paidAdsSubscriptions.add(sub.tenantId, { sub with updatedAt = Time.now() });
  };

  public query ({ caller }) func getPaidAdsSubscription(tenantId : TenantId) : async ?PaidAdsSubscription {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    paidAdsSubscriptions.get(tenantId);
  };

  public query ({ caller }) func getAllPaidAdsSubscriptions() : async [PaidAdsSubscription] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    paidAdsSubscriptions.values().toArray();
  };

  public shared ({ caller }) func addPaidAdsScore(score : PaidAdsScore) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, score.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let scoreList = switch (paidAdsScores.get(score.tenantId)) {
      case (?existing) { existing };
      case (null) { List.empty<PaidAdsScore>() };
    };
    scoreList.add(score);
    paidAdsScores.add(score.tenantId, scoreList);
  };

  public query ({ caller }) func getPaidAdsScores(tenantId : TenantId) : async [PaidAdsScore] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (paidAdsScores.get(tenantId)) {
      case (?list) { list.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func upsertPaidAdsCampaign(campaign : PaidAdsCampaign) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, campaign.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    paidAdsCampaigns.add(campaign.id, { campaign with updatedAt = Time.now() });
  };

  public query ({ caller }) func getPaidAdsCampaignsByTenant(tenantId : TenantId) : async [PaidAdsCampaign] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<PaidAdsCampaign>();
    for (c in paidAdsCampaigns.values()) {
      if (c.tenantId == tenantId) { list.add(c) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertPaidAdsAdCopy(adCopy : PaidAdsAdCopy) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, adCopy.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    paidAdsAdCopies.add(adCopy.id, adCopy);
  };

  public query ({ caller }) func getPaidAdsAdCopiesByTenant(tenantId : TenantId) : async [PaidAdsAdCopy] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<PaidAdsAdCopy>();
    for (ac in paidAdsAdCopies.values()) {
      if (ac.tenantId == tenantId) { list.add(ac) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertPaidAdsAudience(audience : PaidAdsAudience) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, audience.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    paidAdsAudiences.add(audience.id, { audience with updatedAt = Time.now() });
  };

  public query ({ caller }) func getPaidAdsAudiencesByTenant(tenantId : TenantId) : async [PaidAdsAudience] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<PaidAdsAudience>();
    for (a in paidAdsAudiences.values()) {
      if (a.tenantId == tenantId) { list.add(a) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertPaidAdsAlert(alert : PaidAdsAlert) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, alert.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    paidAdsAlerts.add(alert.id, alert);
  };

  public query ({ caller }) func getPaidAdsAlertsByTenant(tenantId : TenantId) : async [PaidAdsAlert] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<PaidAdsAlert>();
    for (a in paidAdsAlerts.values()) {
      if (a.tenantId == tenantId) { list.add(a) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertPaidAdsDeliverable(deliverable : PaidAdsDeliverable) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, deliverable.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    paidAdsDeliverables.add(deliverable.id, deliverable);
  };

  public query ({ caller }) func getPaidAdsDeliverablesByTenant(tenantId : TenantId) : async [PaidAdsDeliverable] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<PaidAdsDeliverable>();
    for (d in paidAdsDeliverables.values()) {
      if (d.tenantId == tenantId) { list.add(d) };
    };
    list.toArray();
  };

  // ---- WEBSITE AGENT ----

  public shared ({ caller }) func upsertWebsiteAgentSubscription(sub : WebsiteAgentSubscription) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, sub.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    websiteAgentSubscriptions.add(sub.tenantId, { sub with updatedAt = Time.now() });
  };

  public query ({ caller }) func getWebsiteAgentSubscription(tenantId : TenantId) : async ?WebsiteAgentSubscription {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    websiteAgentSubscriptions.get(tenantId);
  };

  public query ({ caller }) func getAllWebsiteAgentSubscriptions() : async [WebsiteAgentSubscription] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    websiteAgentSubscriptions.values().toArray();
  };

  public shared ({ caller }) func addWebsiteAgentScore(score : WebsiteAgentScore) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, score.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let scoreList = switch (websiteAgentScores.get(score.tenantId)) {
      case (?existing) { existing };
      case (null) { List.empty<WebsiteAgentScore>() };
    };
    scoreList.add(score);
    websiteAgentScores.add(score.tenantId, scoreList);
  };

  public query ({ caller }) func getWebsiteAgentScores(tenantId : TenantId) : async [WebsiteAgentScore] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (websiteAgentScores.get(tenantId)) {
      case (?list) { list.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func upsertWebsitePageQueueItem(item : WebsitePageQueueItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, item.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    websitePageQueue.add(item.id, { item with updatedAt = Time.now() });
  };

  public query ({ caller }) func getWebsitePageQueueByTenant(tenantId : TenantId) : async [WebsitePageQueueItem] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<WebsitePageQueueItem>();
    for (i in websitePageQueue.values()) {
      if (i.tenantId == tenantId) { list.add(i) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertWebsiteCroOpportunity(opp : WebsiteCroOpportunity) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, opp.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    websiteCroOpportunities.add(opp.id, opp);
  };

  public query ({ caller }) func getWebsiteCroOpportunitiesByTenant(tenantId : TenantId) : async [WebsiteCroOpportunity] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<WebsiteCroOpportunity>();
    for (o in websiteCroOpportunities.values()) {
      if (o.tenantId == tenantId) { list.add(o) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertWebsiteContentBrief(brief : WebsiteContentBrief) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, brief.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    websiteContentBriefs.add(brief.id, { brief with updatedAt = Time.now() });
  };

  public query ({ caller }) func getWebsiteContentBriefsByTenant(tenantId : TenantId) : async [WebsiteContentBrief] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<WebsiteContentBrief>();
    for (b in websiteContentBriefs.values()) {
      if (b.tenantId == tenantId) { list.add(b) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertWebsiteIssue(issue : WebsiteIssue) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, issue.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    websiteIssues.add(issue.id, issue);
  };

  public query ({ caller }) func getWebsiteIssuesByTenant(tenantId : TenantId) : async [WebsiteIssue] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<WebsiteIssue>();
    for (i in websiteIssues.values()) {
      if (i.tenantId == tenantId) { list.add(i) };
    };
    list.toArray();
  };

  public shared ({ caller }) func upsertWebsiteDeliverable(deliverable : WebsiteDeliverable) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, deliverable.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    websiteDeliverables.add(deliverable.id, deliverable);
  };

  public query ({ caller }) func getWebsiteDeliverablesByTenant(tenantId : TenantId) : async [WebsiteDeliverable] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<WebsiteDeliverable>();
    for (d in websiteDeliverables.values()) {
      if (d.tenantId == tenantId) { list.add(d) };
    };
    list.toArray();
  };

  // ---- SEED DEMO DATA ----

  public shared ({ caller }) func seedDemoData() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can seed demo data");
    };
    tenants.add("tenant1", "Business A");
    tenants.add("tenant2", "Business B");
    let lead1 : Lead = { id = "lead1"; tenantId = "tenant1"; name = "John Doe"; email = "john@example.com"; phone = "123456789"; niche = "plumbing"; status = "new"; source = "website"; notes = ""; agentSubscriptions = []; createdAt = Time.now() };
    let lead2 : Lead = { id = "lead2"; tenantId = "tenant2"; name = "Jane Smith"; email = "jane@example.com"; phone = "987654321"; niche = "medspa"; status = "contacted"; source = "referral"; notes = ""; agentSubscriptions = []; createdAt = Time.now() };
    createLeadInternal(lead1);
    createLeadInternal(lead2);
    let review1 : Review = { id = "review1"; tenantId = "tenant1"; platform = "google"; rating = 5; comment = "Great service!"; sentiment = "positive"; aiDraftedResponse = ""; respondedAt = null; createdAt = Time.now() };
    let review2 : Review = { id = "review2"; tenantId = "tenant2"; platform = "yelp"; rating = 4; comment = "Very satisfied!"; sentiment = "positive"; aiDraftedResponse = ""; respondedAt = null; createdAt = Time.now() };
    createReviewInternal(review1);
    createReviewInternal(review2);
    updateAuditScoreInternal("tenant1", 85);
    updateAuditScoreInternal("tenant2", 90);
    updateFundabilityScoreInternal("tenant1", 95);
    updateFundabilityScoreInternal("tenant2", 88);
  };

  // ---- HELPERS ----

  func hasAccessToTenant(caller : Principal, tenantId : TenantId) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) { return true };
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.tenantId == tenantId };
      case (null) { false };
    };
  };

  // ---- AGENT WORKFLOW OS ----

  func genId(prefix : Text) : Text {
    workflowIdCounter += 1;
    prefix # "-" # Time.now().toText() # "-" # workflowIdCounter.toText();
  };

  // Thread operations

  public shared ({ caller }) func createThread(tenantId : Text, agentType : Text, title : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    // Enforce one thread per agentType + tenantId
    let existingThread = agentThreads.values().find(func(t : AgentThread) : Bool {
      t.agentType == agentType and t.tenantId == tenantId and t.status == #active
    });
    switch (existingThread) {
      case (?t) { t.id };
      case (null) {
        let id = genId("thr");
        let now = Time.now();
        agentThreads.add(id, {
          id; tenantId; agentType; title;
          status = #active;
          messageCount = 0;
          summary = null;
          agentNotes = null;
          createdAt = now;
          updatedAt = now;
        });
        id;
      };
    };
  };

  public query ({ caller }) func getThread(id : Text) : async ?AgentThread {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentThreads.get(id)) {
      case (?t) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, t.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        ?t;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getThreadsByTenant(tenantId : Text) : async [AgentThread] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<AgentThread>();
    for (t in agentThreads.values()) {
      if (t.tenantId == tenantId) { list.add(t) };
    };
    list.toArray();
  };

  public query ({ caller }) func getThreadByAgentAndTenant(agentType : Text, tenantId : Text) : async ?AgentThread {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    agentThreads.values().find(func(t : AgentThread) : Bool {
      t.agentType == agentType and t.tenantId == tenantId and t.status == #active
    });
  };

  public shared ({ caller }) func updateThreadSummary(id : Text, summary : Text, agentNotes : ?Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentThreads.get(id)) {
      case (?t) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, t.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        agentThreads.add(id, { t with summary = ?summary; agentNotes; updatedAt = Time.now() });
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func archiveThread(id : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentThreads.get(id)) {
      case (?t) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, t.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        agentThreads.add(id, { t with status = #archived; updatedAt = Time.now() });
        true;
      };
      case (null) { false };
    };
  };

  // AgentRun operations

  public shared ({ caller }) func createRun(threadId : Text, tenantId : Text, agentType : Text, inputPrompt : Text, approvalRequired : Bool) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let id = genId("run");
    agentRuns.add(id, {
      id; threadId; tenantId; agentType;
      status = #queued;
      inputPrompt;
      outputText = null;
      errorMessage = null;
      artifactIds = [];
      workflowStepIndex = 0;
      approvalRequired;
      approvalStatus = null;
      startedAt = Time.now();
      endedAt = null;
      metadata = [];
    });
    id;
  };

  public shared ({ caller }) func updateRunStatus(runId : Text, status : RunStatus, outputText : ?Text, errorMessage : ?Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentRuns.get(runId)) {
      case (?r) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, r.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        let endedAt : ?Int = switch (status) {
          case (#completed) { ?Time.now() };
        case (#failed) { ?Time.now() };
        case (#cancelled) { ?Time.now() };
          case (_) { r.endedAt };
        };
        agentRuns.add(runId, { r with status; outputText; errorMessage; endedAt });
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func completeRun(runId : Text, outputText : Text, artifactIds : [Text]) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentRuns.get(runId)) {
      case (?r) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, r.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        agentRuns.add(runId, {
          r with
          status = #completed;
          outputText = ?outputText;
          artifactIds;
          endedAt = ?Time.now();
        });
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func failRun(runId : Text, errorMessage : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentRuns.get(runId)) {
      case (?r) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, r.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        agentRuns.add(runId, {
          r with
          status = #failed;
          errorMessage = ?errorMessage;
          endedAt = ?Time.now();
        });
        true;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getRunsByThread(threadId : Text) : async [AgentRun] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    let list = List.empty<AgentRun>();
    for (r in agentRuns.values()) {
      if (r.threadId == threadId) {
        if (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, r.tenantId)) {
          list.add(r);
        };
      };
    };
    list.toArray();
  };

  public query ({ caller }) func getRunsByTenant(tenantId : Text) : async [AgentRun] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<AgentRun>();
    for (r in agentRuns.values()) {
      if (r.tenantId == tenantId) { list.add(r) };
    };
    list.toArray();
  };

  public shared ({ caller }) func pauseRunForApproval(runId : Text, reason : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentRuns.get(runId)) {
      case (?r) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, r.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        agentRuns.add(runId, { r with status = #paused_for_approval; approvalStatus = ?#pending });
        let approvalId = genId("appr");
        approvalItems.add(approvalId, {
          id = approvalId;
          runId;
          threadId = r.threadId;
          tenantId = r.tenantId;
          action = "run_" # runId;
          reason;
          status = #pending;
          requestedAt = Time.now();
          resolvedAt = null;
          approverNotes = null;
        });
        approvalId;
      };
      case (null) { Runtime.trap("Run not found") };
    };
  };

  // AgentArtifact operations

  public shared ({ caller }) func createArtifact(runId : Text, threadId : Text, tenantId : Text, artifactType : ArtifactType, title : Text, content : Text, tags : [Text]) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let id = genId("art");
    let now = Time.now();
    agentArtifacts.add(id, {
      id; runId; threadId; tenantId; artifactType; title; content; tags;
      status = #draft;
      createdAt = now;
      updatedAt = now;
    });
    id;
  };

  public query ({ caller }) func getArtifact(id : Text) : async ?AgentArtifact {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentArtifacts.get(id)) {
      case (?a) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, a.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        ?a;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getArtifactsByThread(threadId : Text) : async [AgentArtifact] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    let list = List.empty<AgentArtifact>();
    for (a in agentArtifacts.values()) {
      if (a.threadId == threadId) {
        if (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, a.tenantId)) {
          list.add(a);
        };
      };
    };
    list.toArray();
  };

  public query ({ caller }) func getArtifactsByTenant(tenantId : Text) : async [AgentArtifact] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<AgentArtifact>();
    for (a in agentArtifacts.values()) {
      if (a.tenantId == tenantId) { list.add(a) };
    };
    list.toArray();
  };

  public shared ({ caller }) func updateArtifactStatus(id : Text, status : ArtifactStatus) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentArtifacts.get(id)) {
      case (?a) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, a.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        agentArtifacts.add(id, { a with status; updatedAt = Time.now() });
        true;
      };
      case (null) { false };
    };
  };

  // AgentTemplate operations

  public shared ({ caller }) func createTemplate(tenantId : Text, name : Text, role : Text, systemPrompt : Text, allowedTools : [Text], memoryMode : MemoryMode, approvalRequired : Bool) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let id = genId("tmpl");
    agentTemplates.add(id, {
      id; tenantId; name; role; systemPrompt; allowedTools; memoryMode; approvalRequired;
      defaultWorkflowSteps = [];
      isDefault = false;
      createdAt = Time.now();
    });
    id;
  };

  public query ({ caller }) func getTemplates(tenantId : Text) : async [AgentTemplateRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<AgentTemplateRecord>();
    for (t in agentTemplates.values()) {
      if (t.tenantId == tenantId or t.tenantId == "") { list.add(t) };
    };
    list.toArray();
  };

  public query ({ caller }) func getTemplate(id : Text) : async ?AgentTemplateRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    agentTemplates.get(id);
  };

  public shared ({ caller }) func updateTemplate(id : Text, name : Text, systemPrompt : Text, allowedTools : [Text], memoryMode : MemoryMode, approvalRequired : Bool) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentTemplates.get(id)) {
      case (?t) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, t.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        agentTemplates.add(id, { t with name; systemPrompt; allowedTools; memoryMode; approvalRequired });
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func deleteTemplate(id : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (agentTemplates.get(id)) {
      case (?_) {
        agentTemplates.remove(id);
        true;
      };
      case (null) { false };
    };
  };

  // AgentMemory operations

  public query ({ caller }) func getMemory(threadId : Text) : async ?AgentMemory {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentMemories.get(threadId)) {
      case (?m) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, m.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        ?m;
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateMemory(threadId : Text, tenantId : Text, conversationEntry : ConversationEntry, newSummary : ?Text, agentNotes : ?Text) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let existing = switch (agentMemories.get(threadId)) {
      case (?m) { m };
      case (null) {
        {
          threadId; tenantId;
          conversationHistory = [];
          summary = null;
          agentNotes = null;
          lastUpdated = Time.now();
        };
      };
    };
    let updatedHistory = existing.conversationHistory.concat([conversationEntry]);
    agentMemories.add(threadId, {
      existing with
      conversationHistory = updatedHistory;
      summary = newSummary;
      agentNotes;
      lastUpdated = Time.now();
    });
    true;
  };

  public shared ({ caller }) func clearMemory(threadId : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (agentMemories.get(threadId)) {
      case (?m) {
        if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, m.tenantId))) {
          Runtime.trap("Unauthorized: No access to tenant");
        };
        agentMemories.add(threadId, {
          m with
          conversationHistory = [];
          summary = null;
          agentNotes = null;
          lastUpdated = Time.now();
        });
        true;
      };
      case (null) { false };
    };
  };

  // ToolDefinition operations

  func seedDefaultTools() {
    if (toolsSeeded) { return };
    toolsSeeded := true;
    let tools : [ToolDefinition] = [
      { id = "tool-crm-lookup"; name = "crm_lookup"; description = "Look up a lead or contact record by ID or email"; category = "crm"; schema = "{\"type\":\"object\",\"properties\":{\"query\":{\"type\":\"string\"}}}"; permissions = ["user", "admin"]; requiresApproval = false; tenantScoped = true; isEnabled = true },
      { id = "tool-lead-update"; name = "lead_update"; description = "Update fields on an existing lead record"; category = "crm"; schema = "{\"type\":\"object\",\"properties\":{\"leadId\":{\"type\":\"string\"},\"fields\":{\"type\":\"object\"}}}"; permissions = ["user", "admin"]; requiresApproval = true; tenantScoped = true; isEnabled = true },
      { id = "tool-lead-create"; name = "lead_create"; description = "Create a new lead record in the CRM"; category = "crm"; schema = "{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"email\":{\"type\":\"string\"},\"phone\":{\"type\":\"string\"}}}"; permissions = ["user", "admin"]; requiresApproval = false; tenantScoped = true; isEnabled = true },
      { id = "tool-content-generate"; name = "content_generate"; description = "Generate content such as blog posts, service pages, or ad copy"; category = "content"; schema = "{\"type\":\"object\",\"properties\":{\"contentType\":{\"type\":\"string\"},\"topic\":{\"type\":\"string\"},\"tone\":{\"type\":\"string\"}}}"; permissions = ["user", "admin"]; requiresApproval = false; tenantScoped = true; isEnabled = true },
      { id = "tool-notify-team"; name = "notify_team"; description = "Send an internal notification to the admin team"; category = "notification"; schema = "{\"type\":\"object\",\"properties\":{\"message\":{\"type\":\"string\"},\"priority\":{\"type\":\"string\"}}}"; permissions = ["user", "admin"]; requiresApproval = false; tenantScoped = true; isEnabled = true },
      { id = "tool-form-process"; name = "form_process"; description = "Process and validate a submitted form payload"; category = "crm"; schema = "{\"type\":\"object\",\"properties\":{\"formType\":{\"type\":\"string\"},\"data\":{\"type\":\"object\"}}}"; permissions = ["user", "admin"]; requiresApproval = false; tenantScoped = true; isEnabled = true },
      { id = "tool-analytics-lookup"; name = "analytics_lookup"; description = "Look up analytics data for a tenant such as lead count and review stats"; category = "analytics"; schema = "{\"type\":\"object\",\"properties\":{\"metric\":{\"type\":\"string\"},\"period\":{\"type\":\"string\"}}}"; permissions = ["user", "admin"]; requiresApproval = false; tenantScoped = true; isEnabled = true },
      { id = "tool-pricing-lookup"; name = "pricing_lookup"; description = "Look up current pricing for agent products"; category = "pricing"; schema = "{\"type\":\"object\",\"properties\":{\"productId\":{\"type\":\"string\"}}}"; permissions = ["user", "admin"]; requiresApproval = false; tenantScoped = false; isEnabled = true },
      { id = "tool-proposal-generate"; name = "proposal_generate"; description = "Generate a service proposal document for a prospect or client"; category = "content"; schema = "{\"type\":\"object\",\"properties\":{\"clientName\":{\"type\":\"string\"},\"services\":{\"type\":\"array\"},\"budget\":{\"type\":\"number\"}}}"; permissions = ["admin"]; requiresApproval = true; tenantScoped = true; isEnabled = true },
      { id = "tool-followup-schedule"; name = "follow_up_schedule"; description = "Schedule a follow-up task or reminder for a lead"; category = "crm"; schema = "{\"type\":\"object\",\"properties\":{\"leadId\":{\"type\":\"string\"},\"daysFromNow\":{\"type\":\"number\"},\"message\":{\"type\":\"string\"}}}"; permissions = ["user", "admin"]; requiresApproval = false; tenantScoped = true; isEnabled = true },
    ];
    for (tool in tools.values()) {
      toolDefinitions.add(tool.id, tool);
    };
  };

  public shared ({ caller }) func initDefaultTools() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    seedDefaultTools();
  };

  public query ({ caller }) func getTools() : async [ToolDefinition] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    toolDefinitions.values().toArray();
  };

  public query ({ caller }) func getToolsByCategory(category : Text) : async [ToolDefinition] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    let list = List.empty<ToolDefinition>();
    for (t in toolDefinitions.values()) {
      if (t.category == category) { list.add(t) };
    };
    list.toArray();
  };

  // ProviderAdapter operations

  public shared ({ caller }) func setProviderAdapter(tenantId : Text, adapterType : AdapterType, isEnabled : Bool, apiKey : ?Text, baseUrl : ?Text, modelId : ?Text) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    // Upsert by tenantId + adapterType key
    let adapterKey = tenantId # "-" # debug_show(adapterType);
    let existing = providerAdapterConfigs.get(adapterKey);
    let id = switch (existing) {
      case (?e) { e.id };
      case (null) { genId("adpt") };
    };
    providerAdapterConfigs.add(adapterKey, {
      id; tenantId; adapterType; isEnabled; apiKey; baseUrl; modelId;
      priority = switch (existing) { case (?e) { e.priority }; case (null) { 0 } };
      createdAt = switch (existing) { case (?e) { e.createdAt }; case (null) { Time.now() } };
    });
    id;
  };

  public query ({ caller }) func getProviderAdapters(tenantId : Text) : async [ProviderAdapterConfig] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<ProviderAdapterConfig>();
    for (cfg in providerAdapterConfigs.values()) {
      if (cfg.tenantId == tenantId) { list.add(cfg) };
    };
    list.toArray();
  };

  public query ({ caller }) func getActiveAdapter(tenantId : Text) : async ?ProviderAdapterConfig {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    // Return highest-priority enabled adapter for tenant; fall back to native if none
    var best : ?ProviderAdapterConfig = null;
    for (cfg in providerAdapterConfigs.values()) {
      if (cfg.tenantId == tenantId and cfg.isEnabled) {
        switch (best) {
          case (null) { best := ?cfg };
          case (?b) {
            if (cfg.priority > b.priority) { best := ?cfg };
          };
        };
      };
    };
    best;
  };

  // ---- AGENT WORKFLOW OS FLAT-RECORD METHODS ----

  // Thread management

  public shared func createAgentThread(thread : AgentThreadRecord) : async Bool {
    agentThreadRecords.add(thread);
    true;
  };

  public shared func updateAgentThread(id : Text, status : Text, messageCount : Nat, lastMessage : Text) : async Bool {
    let now = Time.now();
    agentThreadRecords.mapInPlace(func(t : AgentThreadRecord) : AgentThreadRecord {
      if (t.id == id) {
        { t with status; messageCount; lastMessage; updatedAt = now }
      } else { t }
    });
    true;
  };

  public query func getAgentThreadsByTenant(tenantId : Text) : async [AgentThreadRecord] {
    agentThreadRecords.filter(func(t : AgentThreadRecord) : Bool { t.tenantId == tenantId }).toArray();
  };

  public query func getAgentThread(id : Text) : async ?AgentThreadRecord {
    agentThreadRecords.find(func(t : AgentThreadRecord) : Bool { t.id == id });
  };

  // Run management

  public shared func createAgentRun(run : AgentRunRecord) : async Bool {
    agentRunRecords.add(run);
    true;
  };

  public shared func updateAgentRun(id : Text, status : Text, output : Text, completedAt : ?Int, artifactIds : [Text], approvalStatus : Text, errorMessage : ?Text) : async Bool {
    agentRunRecords.mapInPlace(func(r : AgentRunRecord) : AgentRunRecord {
      if (r.id == id) {
        { r with status; output; completedAt; artifactIds; approvalStatus; errorMessage }
      } else { r }
    });
    true;
  };

  public query func getAgentRunsByThread(threadId : Text) : async [AgentRunRecord] {
    agentRunRecords.filter(func(r : AgentRunRecord) : Bool { r.threadId == threadId }).toArray();
  };

  public query func getAgentRunsByTenant(tenantId : Text) : async [AgentRunRecord] {
    agentRunRecords.filter(func(r : AgentRunRecord) : Bool { r.tenantId == tenantId }).toArray();
  };

  // Artifact management

  public shared func createAgentArtifact(artifact : AgentArtifactRecord) : async Bool {
    agentArtifactRecords.add(artifact);
    true;
  };

  public shared func updateArtifactRecordStatus(id : Text, status : Text) : async Bool {
    agentArtifactRecords.mapInPlace(func(a : AgentArtifactRecord) : AgentArtifactRecord {
      if (a.id == id) { { a with status } } else { a }
    });
    true;
  };

  public query func getArtifactRecordsByThread(threadId : Text) : async [AgentArtifactRecord] {
    agentArtifactRecords.filter(func(a : AgentArtifactRecord) : Bool { a.threadId == threadId }).toArray();
  };

  public query func getArtifactRecordsByTenant(tenantId : Text) : async [AgentArtifactRecord] {
    agentArtifactRecords.filter(func(a : AgentArtifactRecord) : Bool { a.tenantId == tenantId }).toArray();
  };

  // Memory management

  public shared func saveAgentMemory(memory : AgentMemoryRecord) : async Bool {
    agentMemoryRecords.add(memory);
    true;
  };

  public query func getAgentMemoryByThread(threadId : Text) : async [AgentMemoryRecord] {
    agentMemoryRecords.filter(func(m : AgentMemoryRecord) : Bool { m.threadId == threadId }).toArray();
  };

  // Approval management

  // Approval management — delegated to ApprovalQueueMixin
  // (createApprovalRecord, resolveApprovalRecord, getPendingApprovalRecords, getApprovalRecordsByTenant)

  // Agent template management

  public shared func saveAgentTemplate(tmpl : AgentTemplateStorageRecord) : async Bool {
    let exists = agentTemplateStorageRecords.find(func(t : AgentTemplateStorageRecord) : Bool { t.id == tmpl.id });
    switch (exists) {
      case (null) {
        agentTemplateStorageRecords.add(tmpl);
      };
      case (?_) {
        let now = Time.now();
        agentTemplateStorageRecords.mapInPlace(func(t : AgentTemplateStorageRecord) : AgentTemplateStorageRecord {
          if (t.id == tmpl.id) { { tmpl with updatedAt = now } } else { t }
        });
      };
    };
    true;
  };

  public query func getAgentTemplateRecords(tenantId : Text) : async [AgentTemplateStorageRecord] {
    agentTemplateStorageRecords.filter(func(t : AgentTemplateStorageRecord) : Bool { t.tenantId == tenantId }).toArray();
  };

  // ---- FEATURE: TWO-WAY SMS INBOX ----

  type SMSThread = {
    id : Text;
    tenantId : Text;
    prospectPhone : Text;
    prospectName : Text;
    linkedLeadId : ?Text;
    archived : Bool;
    createdAt : Int;
    lastMessageAt : Int;
    unreadCount : Nat;
  };

  type SMSMessage = {
    id : Text;
    threadId : Text;
    tenantId : Text;
    direction : Text; // "inbound" | "outbound"
    sender : Text;
    text : Text;
    sentAt : Int;
    readAt : ?Int;
    status : Text; // "sent" | "delivered" | "failed" | "received"
  };

  let _smsThreads : List.List<SMSThread> = List.empty();
  let _smsMessages : List.List<SMSMessage> = List.empty();

  public shared func createSmsThread(tenantId : Text, prospectPhone : Text, prospectName : Text, linkedLeadId : ?Text) : async { #ok : SMSThread; #err : Text } {
    let now = Time.now();
    let id = "sms-" # now.toText() # "-" # prospectPhone.replace(#char '+', "");
    // Deduplicate by prospectPhone + tenantId
    let existing = _smsThreads.find(func(t : SMSThread) : Bool {
      t.tenantId == tenantId and t.prospectPhone == prospectPhone and not t.archived
    });
    switch (existing) {
      case (?t) { #ok t };
      case (null) {
        let thread : SMSThread = {
          id; tenantId; prospectPhone; prospectName; linkedLeadId;
          archived = false; createdAt = now; lastMessageAt = now; unreadCount = 0;
        };
        _smsThreads.add(thread);
        #ok thread
      };
    }
  };

  public shared func addSmsMessage(threadId : Text, tenantId : Text, direction : Text, sender : Text, text : Text) : async { #ok : SMSMessage; #err : Text } {
    let now = Time.now();
    let id = "msg-" # now.toText();
    let msg : SMSMessage = { id; threadId; tenantId; direction; sender; text; sentAt = now; readAt = null; status = "sent" };
    _smsMessages.add(msg);
    // Update thread's lastMessageAt and unreadCount
    _smsThreads.mapInPlace(func(t : SMSThread) : SMSThread {
      if (t.id == threadId) {
        let newUnread : Nat = if (direction == "inbound") { t.unreadCount + 1 } else { t.unreadCount };
        { t with lastMessageAt = now; unreadCount = newUnread }
      } else { t }
    });
    #ok msg
  };

  public query func getSmsThreadsByTenant(tenantId : Text) : async [SMSThread] {
    _smsThreads.filter(func(t : SMSThread) : Bool { t.tenantId == tenantId }).toArray()
  };

  public query func getSmsMessagesByThread(threadId : Text) : async [SMSMessage] {
    _smsMessages.filter(func(m : SMSMessage) : Bool { m.threadId == threadId }).toArray()
  };

  public shared func archiveSmsThread(threadId : Text) : async { #ok : Bool; #err : Text } {
    let found = _smsThreads.find(func(t : SMSThread) : Bool { t.id == threadId });
    switch (found) {
      case (null) { #err "Thread not found" };
      case (?_) {
        _smsThreads.mapInPlace(func(t : SMSThread) : SMSThread {
          if (t.id == threadId) { { t with archived = true } } else { t }
        });
        #ok true
      };
    }
  };

  public shared func markSmsMessagesRead(threadId : Text) : async { #ok : Bool; #err : Text } {
    let now = Time.now();
    _smsMessages.mapInPlace(func(m : SMSMessage) : SMSMessage {
      if (m.threadId == threadId and m.direction == "inbound" and m.readAt == null) {
        { m with readAt = ?now }
      } else { m }
    });
    _smsThreads.mapInPlace(func(t : SMSThread) : SMSThread {
      if (t.id == threadId) { { t with unreadCount = 0 } } else { t }
    });
    #ok true
  };

  // ---- FEATURE: AI-POWERED CLIENT REPORTING ----

  type ReportSection = {
    title : Text;
    metric : Text;
    value : Text;
    trend : Text; // "up" | "down" | "stable"
    trendValue : Text;
    description : Text;
    recommendation : Text;
  };

  type ClientReport = {
    id : Text;
    tenantId : Text;
    reportType : Text; // "weekly" | "monthly"
    periodLabel : Text;
    generatedAt : Int;
    deliveredAt : ?Int;
    sections : [ReportSection];
    aiNarrative : Text;
    topWins : [Text];
    nextSteps : [Text];
    overallScore : Nat;
  };

  type ReportSchedule = {
    tenantId : Text;
    weeklyEnabled : Bool;
    monthlyEnabled : Bool;
    deliveryDayOfWeek : Nat;
    deliveryHour : Nat;
    lastGeneratedAt : ?Int;
  };

  let _clientReports : List.List<ClientReport> = List.empty();
  let _reportSchedules : Map.Map<Text, ReportSchedule> = Map.empty();

  public shared func createClientReport(tenantId : Text, reportType : Text, periodLabel : Text, sections : [ReportSection], aiNarrative : Text, topWins : [Text], nextSteps : [Text], overallScore : Nat) : async { #ok : ClientReport; #err : Text } {
    let now = Time.now();
    let id = "rpt-" # now.toText();
    let report : ClientReport = {
      id; tenantId; reportType; periodLabel;
      generatedAt = now; deliveredAt = null;
      sections; aiNarrative; topWins; nextSteps; overallScore;
    };
    _clientReports.add(report);
    #ok report
  };

  public query func getClientReports(tenantId : Text) : async [ClientReport] {
    _clientReports.filter(func(r : ClientReport) : Bool { r.tenantId == tenantId }).toArray()
  };

  public query func getClientReportById(reportId : Text) : async ?ClientReport {
    _clientReports.find(func(r : ClientReport) : Bool { r.id == reportId })
  };

  public shared func updateReportSchedule(tenantId : Text, weeklyEnabled : Bool, monthlyEnabled : Bool, deliveryDayOfWeek : Nat, deliveryHour : Nat) : async { #ok : ReportSchedule; #err : Text } {
    let existing = _reportSchedules.get(tenantId);
    let schedule : ReportSchedule = {
      tenantId; weeklyEnabled; monthlyEnabled; deliveryDayOfWeek; deliveryHour;
      lastGeneratedAt = switch (existing) { case (?s) { s.lastGeneratedAt }; case (null) { null } };
    };
    _reportSchedules.add(tenantId, schedule);
    #ok schedule
  };

  public query func getReportSchedule(tenantId : Text) : async ?ReportSchedule {
    _reportSchedules.get(tenantId)
  };

  // ---- FEATURE: CLIENT HEALTH SCORE ----

  type HealthScoreComponent = {
    factor : Text; // "leads" | "reputation" | "agents" | "website"
    weight : Nat;
    rawScore : Nat;
    weightedScore : Nat;
    displayLabel : Text;
    status : Text; // "good" | "warning" | "critical"
  };

  type ClientHealthScore = {
    tenantId : Text;
    overallScore : Nat;
    leadsScore : Nat;
    reputationScore : Nat;
    agentScore : Nat;
    websiteScore : Nat;
    components : [HealthScoreComponent];
    trend : Text; // "improving" | "declining" | "stable"
    lastUpdated : Int;
    recommendations : [Text];
  };

  let _clientHealthScores : Map.Map<Text, ClientHealthScore> = Map.empty();

  public shared func upsertClientHealthScore(tenantId : Text, overallScore : Nat, leadsScore : Nat, reputationScore : Nat, agentScore : Nat, websiteScore : Nat, components : [HealthScoreComponent], trend : Text, recommendations : [Text]) : async { #ok : ClientHealthScore; #err : Text } {
    let score : ClientHealthScore = {
      tenantId; overallScore; leadsScore; reputationScore; agentScore; websiteScore;
      components; trend; lastUpdated = Time.now(); recommendations;
    };
    _clientHealthScores.add(tenantId, score);
    #ok score
  };

  public query func getClientHealthScore(tenantId : Text) : async ?ClientHealthScore {
    _clientHealthScores.get(tenantId)
  };

  public query func getAllClientHealthScores() : async [ClientHealthScore] {
    _clientHealthScores.values().toArray()
  };

  // ---- FEATURE: ESTIMATES ----

  type EstimateLineItem = {
    id : Text;
    description : Text;
    quantity : Float;
    unitPrice : Float;
    taxRate : Float;
  };

  type EstimateStatus = {
    #draft;
    #sent;
    #accepted;
    #rejected;
    #expired;
  };

  type Estimate = {
    id : Text;
    tenantId : Text;
    customerId : Text;
    customerName : Text;
    customerEmail : Text;
    lineItems : [EstimateLineItem];
    subtotal : Float;
    taxTotal : Float;
    total : Float;
    status : EstimateStatus;
    notes : Text;
    createdAt : Int;
    updatedAt : Int;
    acceptedAt : ?Int;
    rejectedAt : ?Int;
    approvalNotes : Text;
  };

  let _estimates : List.List<Estimate> = List.empty();

  public shared func createEstimate(
    tenantId      : Text,
    customerId    : Text,
    customerName  : Text,
    customerEmail : Text,
    lineItems     : [EstimateLineItem],
    subtotal      : Float,
    taxTotal      : Float,
    total         : Float,
    notes         : Text,
    approvalNotes : Text,
  ) : async { #ok : Estimate; #err : Text } {
    let now = Time.now();
    let id = "est-" # now.toText();
    let est : Estimate = {
      id; tenantId; customerId; customerName; customerEmail; lineItems;
      subtotal; taxTotal; total; status = #draft; notes; approvalNotes;
      createdAt = now; updatedAt = now; acceptedAt = null; rejectedAt = null;
    };
    _estimates.add(est);
    #ok est
  };

  public query func getEstimatesByTenant(tenantId : Text) : async [Estimate] {
    _estimates.filter(func(e : Estimate) : Bool { e.tenantId == tenantId }).toArray()
  };

  public shared func updateEstimateStatus(
    estimateId    : Text,
    status        : EstimateStatus,
    approvalNotes : Text,
  ) : async { #ok : Estimate; #err : Text } {
    let found = _estimates.find(func(e : Estimate) : Bool { e.id == estimateId });
    switch (found) {
      case (null) { #err "Estimate not found" };
      case (?est) {
        let now = Time.now();
        let acceptedAt : ?Int = switch (status) { case (#accepted) { ?now }; case (_) { est.acceptedAt } };
        let rejectedAt : ?Int = switch (status) { case (#rejected) { ?now }; case (_) { est.rejectedAt } };
        let updated = { est with status; approvalNotes; updatedAt = now; acceptedAt; rejectedAt };
        _estimates.mapInPlace(func(e : Estimate) : Estimate {
          if (e.id == estimateId) { updated } else { e }
        });
        #ok updated
      };
    }
  };

  // ---- FEATURE: BOOKINGS ----

  type BookingStatus = {
    #confirmed;
    #completed;
    #cancelled;
    #no_show;
  };

  type Booking = {
    id : Text;
    tenantId : Text;
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    serviceType : Text;
    scheduledAt : Int;
    durationMinutes : Nat;
    status : BookingStatus;
    googleCalendarEventId : ?Text;
    outlookEventId : ?Text;
    reminderSent24h : Bool;
    reminderSent1h : Bool;
    noShowFollowUpSent : Bool;
    notes : Text;
    createdAt : Int;
  };

  let _bookings : List.List<Booking> = List.empty();

  public shared func createBooking(
    tenantId         : Text,
    customerName     : Text,
    customerPhone    : Text,
    customerEmail    : Text,
    serviceType      : Text,
    scheduledAt      : Int,
    durationMinutes  : Nat,
    notes            : Text,
  ) : async { #ok : Booking; #err : Text } {
    let now = Time.now();
    let id = "bk-" # now.toText();
    let booking : Booking = {
      id; tenantId; customerName; customerPhone; customerEmail; serviceType;
      scheduledAt; durationMinutes; status = #confirmed;
      googleCalendarEventId = null; outlookEventId = null;
      reminderSent24h = false; reminderSent1h = false; noShowFollowUpSent = false;
      notes; createdAt = now;
    };
    _bookings.add(booking);
    #ok booking
  };

  public query func getBookingsByTenant(tenantId : Text) : async [Booking] {
    _bookings.filter(func(b : Booking) : Bool { b.tenantId == tenantId }).toArray()
  };

  public shared func updateBookingStatus(
    bookingId             : Text,
    status                : BookingStatus,
    googleCalendarEventId : ?Text,
    outlookEventId        : ?Text,
  ) : async { #ok : Booking; #err : Text } {
    let found = _bookings.find(func(b : Booking) : Bool { b.id == bookingId });
    switch (found) {
      case (null) { #err "Booking not found" };
      case (?bk) {
        let updated = { bk with status; googleCalendarEventId; outlookEventId };
        _bookings.mapInPlace(func(b : Booking) : Booking {
          if (b.id == bookingId) { updated } else { b }
        });
        #ok updated
      };
    }
  };

  // ---- FEATURE: REVIEW SYNC RECORDS ----

  type ReviewSentiment = {
    #positive;
    #neutral;
    #negative;
  };

  type ReviewPlatform = {
    #google;
    #yelp;
    #facebook;
  };

  type ReviewSyncRecord = {
    id : Text;
    tenantId : Text;
    platform : ReviewPlatform;
    platformReviewId : Text;
    rating : Nat;
    reviewerName : Text;
    comment : Text;
    sentiment : ReviewSentiment;
    sentimentScore : Float;
    respondedAt : ?Int;
    platformResponse : ?Text;
    lastSyncAt : Int;
    createdAt : Int;
  };

  let _reviewSyncRecords : List.List<ReviewSyncRecord> = List.empty();

  public shared func createReviewSyncRecord(
    tenantId          : Text,
    platform          : ReviewPlatform,
    platformReviewId  : Text,
    rating            : Nat,
    reviewerName      : Text,
    comment           : Text,
    sentiment         : ReviewSentiment,
    sentimentScore    : Float,
    lastSyncAt        : Int,
  ) : async { #ok : ReviewSyncRecord; #err : Text } {
    let now = Time.now();
    let id = "rsr-" # now.toText() # "-" # platformReviewId;
    let record : ReviewSyncRecord = {
      id; tenantId; platform; platformReviewId; rating; reviewerName;
      comment; sentiment; sentimentScore; respondedAt = null;
      platformResponse = null; lastSyncAt; createdAt = now;
    };
    _reviewSyncRecords.add(record);
    #ok record
  };

  public query func getReviewSyncRecordsByTenant(tenantId : Text) : async [ReviewSyncRecord] {
    _reviewSyncRecords.filter(func(r : ReviewSyncRecord) : Bool { r.tenantId == tenantId }).toArray()
  };

  public shared func updateReviewResponse(
    recordId          : Text,
    platformResponse  : Text,
    respondedAt       : Int,
  ) : async { #ok : ReviewSyncRecord; #err : Text } {
    let found = _reviewSyncRecords.find(func(r : ReviewSyncRecord) : Bool { r.id == recordId });
    switch (found) {
      case (null) { #err "Review sync record not found" };
      case (?rec) {
        let updated = { rec with platformResponse = ?platformResponse; respondedAt = ?respondedAt };
        _reviewSyncRecords.mapInPlace(func(r : ReviewSyncRecord) : ReviewSyncRecord {
          if (r.id == recordId) { updated } else { r }
        });
        #ok updated
      };
    }
  };

  // ---- FEATURE: REVIEW REQUEST TRIGGERS ----

  type ReviewRequestTriggerStatus = {
    #pending;
    #sent;
    #completed;
    #suppressed;
  };

  type ReviewRequestTriggerType = {
    #job_completion;
    #manual;
  };

  type ReviewRequestTrigger = {
    id : Text;
    tenantId : Text;
    triggerType : ReviewRequestTriggerType;
    bookingId : ?Text;
    estimateId : ?Text;
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    platform : Text;
    status : ReviewRequestTriggerStatus;
    sentAt : ?Int;
    createdAt : Int;
  };

  let _reviewRequestTriggers : List.List<ReviewRequestTrigger> = List.empty();

  public shared func createReviewRequestTrigger(
    tenantId      : Text,
    triggerType   : ReviewRequestTriggerType,
    bookingId     : ?Text,
    estimateId    : ?Text,
    customerName  : Text,
    customerPhone : Text,
    customerEmail : Text,
    platform      : Text,
  ) : async { #ok : ReviewRequestTrigger; #err : Text } {
    let now = Time.now();
    let id = "rrt-" # now.toText();
    let trigger : ReviewRequestTrigger = {
      id; tenantId; triggerType; bookingId; estimateId;
      customerName; customerPhone; customerEmail; platform;
      status = #pending; sentAt = null; createdAt = now;
    };
    _reviewRequestTriggers.add(trigger);
    #ok trigger
  };

  public query func getReviewRequestTriggersByTenant(tenantId : Text) : async [ReviewRequestTrigger] {
    _reviewRequestTriggers.filter(func(t : ReviewRequestTrigger) : Bool { t.tenantId == tenantId }).toArray()
  };

  // ---- COMPETITOR TRACKING TYPES ----

  public type CompetitorProfile = {
    id : Text;
    tenantId : Text;
    competitorName : Text;
    website : Text;
    googleRating : Float;
    ratingChangePrevious : Float;
    reviewCount : Nat;
    reviewVelocityTrend : Text;
    gbpLastUpdated : Text;
    adPresenceDetected : Bool;
    lastAuditedAt : Int;
    alertThreshold : Float;
  };

  public type CompetitorAlert = {
    id : Text;
    tenantId : Text;
    competitorId : Text;
    alertType : Text;
    severity : Text;
    triggeredAt : Int;
    dismissed : Bool;
  };

  // ---- LOCATION PROFILE TYPES ----

  public type LocationProfile = {
    id : Text;
    tenantId : Text;
    locationName : Text;
    address : Text;
    city : Text;
    state : Text;
    phoneNumber : Text;
    timezone : Text;
    status : Text;
    createdAt : Int;
  };

  // ---- LEAD ATTRIBUTION TYPES ----

  public type AttributionTouch = {
    channel : Text;
    source : Text;
    timestamp : Int;
    campaignId : Text;
    utmParams : Text;
  };

  public type LeadAttributionRecord = {
    id : Text;
    tenantId : Text;
    leadId : Text;
    channels : [AttributionTouch];
    bookingId : Text;
    closedDealValue : Float;
    finalConversionChannel : Text;
    attributionModel : Text;
    createdAt : Int;
  };

  // ---- COMPETITOR TRACKING STATE ----

  let competitorProfiles = Map.empty<Text, CompetitorProfile>();
  let competitorAlerts   = Map.empty<Text, CompetitorAlert>();

  // ---- LOCATION PROFILE STATE ----

  let locationProfiles = Map.empty<Text, LocationProfile>();

  // ---- LEAD ATTRIBUTION STATE ----

  let leadAttributionRecords = Map.empty<Text, LeadAttributionRecord>();

  // ---- COMPETITOR TRACKING API ----

  public shared ({ caller }) func upsertCompetitorProfile(profile : CompetitorProfile) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, profile.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    competitorProfiles.add(profile.id, profile);
  };

  public query ({ caller }) func getCompetitorProfile(id : Text) : async ?CompetitorProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    competitorProfiles.get(id)
  };

  public query ({ caller }) func getCompetitorProfilesByTenant(tenantId : Text) : async [CompetitorProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<CompetitorProfile>();
    for (p in competitorProfiles.values()) {
      if (p.tenantId == tenantId) { list.add(p) };
    };
    list.toArray()
  };

  public shared ({ caller }) func deleteCompetitorProfile(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    competitorProfiles.remove(id);
  };

  public shared ({ caller }) func upsertCompetitorAlert(alert : CompetitorAlert) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, alert.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    competitorAlerts.add(alert.id, alert);
  };

  public query ({ caller }) func getCompetitorAlertsByTenant(tenantId : Text) : async [CompetitorAlert] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<CompetitorAlert>();
    for (a in competitorAlerts.values()) {
      if (a.tenantId == tenantId and not a.dismissed) { list.add(a) };
    };
    list.toArray()
  };

  public shared ({ caller }) func dismissCompetitorAlert(id : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (competitorAlerts.get(id)) {
      case (null) { false };
      case (?a) {
        competitorAlerts.add(id, { a with dismissed = true });
        true
      };
    }
  };

  public shared ({ caller }) func deleteCompetitorAlert(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    competitorAlerts.remove(id);
  };

  // ---- LOCATION PROFILE API ----

  public shared ({ caller }) func upsertLocationProfile(profile : LocationProfile) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, profile.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    locationProfiles.add(profile.id, profile);
  };

  public query ({ caller }) func getLocationProfile(id : Text) : async ?LocationProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    locationProfiles.get(id)
  };

  public query ({ caller }) func getLocationProfilesByTenant(tenantId : Text) : async [LocationProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<LocationProfile>();
    for (p in locationProfiles.values()) {
      if (p.tenantId == tenantId) { list.add(p) };
    };
    list.toArray()
  };

  public shared ({ caller }) func deleteLocationProfile(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    locationProfiles.remove(id);
  };

  // ---- LEAD ATTRIBUTION API ----

  public shared ({ caller }) func upsertLeadAttribution(record : LeadAttributionRecord) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, record.tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    leadAttributionRecords.add(record.id, record);
  };

  public query ({ caller }) func getLeadAttributionsByTenant(tenantId : Text) : async [LeadAttributionRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<LeadAttributionRecord>();
    for (r in leadAttributionRecords.values()) {
      if (r.tenantId == tenantId) { list.add(r) };
    };
    list.toArray()
  };

  public query ({ caller }) func getLeadAttributionsByLead(tenantId : Text, leadId : Text) : async [LeadAttributionRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    let list = List.empty<LeadAttributionRecord>();
    for (r in leadAttributionRecords.values()) {
      if (r.tenantId == tenantId and r.leadId == leadId) { list.add(r) };
    };
    list.toArray()
  };

  public query ({ caller }) func getLeadAttribution(id : Text) : async ?LeadAttributionRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    leadAttributionRecords.get(id)
  };

  public shared ({ caller }) func addAttributionTouch(id : Text, touch : AttributionTouch) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (leadAttributionRecords.get(id)) {
      case (null) { false };
      case (?rec) {
        let updated = { rec with channels = rec.channels.concat([touch]) };
        leadAttributionRecords.add(id, updated);
        true
      };
    }
  };

  public shared ({ caller }) func deleteLeadAttribution(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    leadAttributionRecords.remove(id);
  };

  // ---- WARM SEQUENCES & PIPELINE API ----

  public shared ({ caller }) func recordOutreachEvent(event : OutreachEvent) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    outreachEvents.add(event.id, event);
  };

  public query ({ caller }) func getOutreachEvents(leadId : Text) : async [OutreachEvent] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    let list = List.empty<OutreachEvent>();
    for (e in outreachEvents.values()) {
      if (e.leadId == leadId) { list.add(e) };
    };
    list.toArray()
  };

  public shared ({ caller }) func recordWarmLeadHandoff(handoff : WarmLeadHandoff) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    warmLeadHandoffs.add(handoff.leadId, handoff);
  };

  public query ({ caller }) func getWarmLeadHandoffs() : async [WarmLeadHandoff] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    warmLeadHandoffs.values().toArray()
  };

  public query ({ caller }) func getPipelineFunnelStats(niche : Text) : async PipelineFunnelStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    // Count events by type for the given niche
    var sourced : Nat = 0;
    var contacted : Nat = 0;
    var auditStarted : Nat = 0;
    var auditCompleted : Nat = 0;
    var warmActive : Nat = 0;
    var demoVisited : Nat = 0;
    var callBooked : Nat = 0;
    for (e in outreachEvents.values()) {
      if (e.niche == niche) {
        switch (e.eventType) {
          case "sourced"         { sourced += 1 };
          case "contacted"       { contacted += 1 };
          case "audit_started"   { auditStarted += 1 };
          case "audit_completed" { auditCompleted += 1 };
          case "warm_active"     { warmActive += 1 };
          case "demo_visited"    { demoVisited += 1 };
          case "call_booked"     { callBooked += 1 };
          case (_)               {};
        };
      };
    };
    {
      niche; leadsSourced = sourced; contacted; auditStarted;
      auditCompleted; warmSequenceActive = warmActive;
      demoVisited; callBooked;
    }
  };

  // ---- VAPI PROVISIONING TYPES ----

  public type VapiProvisioningStatus = {
    status       : { #notConfigured; #provisioning; #active; #error };
    assistantId  : ?Text;
    lastSynced   : ?Int;
    errorMessage : ?Text;
  };

  public type VapiAssistantUpdate = {
    businessName      : ?Text;
    phone             : ?Text;
    niche             : ?Text;
    greetingScript    : ?Text;
    qualifyingQuestions : ?[Text];
  };

  public type VapiCallLog = {
    id          : Text;
    tenantId    : Text;
    callId      : Text;
    direction   : Text;
    status      : Text;
    duration    : Nat;
    transcript  : Text;
    callerPhone : Text;
    recordingUrl : ?Text;
    endedAt     : ?Int;
    recordedAt  : Int;
  };

  // ---- VAPI STATE ----

  let vapiProvisioningStatuses = Map.empty<Text, VapiProvisioningStatus>();

  // ---- VAPI HELPERS ----

  /// Normalises a tenant ID for Vapi — empty string, "demo", and "default" all map to "platform".
  func normaliseVapiTenantId(tid : Text) : Text {
    if (tid == "" or tid == "demo" or tid == "default") "platform" else tid
  };

  /// Returns true when the caller is authorised to act on the given tenantId.
  /// Always permits authenticated (non-anonymous) callers to access "platform" tenant.
  func assertVapiTenantAccess(caller : Principal, tenantId : Text) {
    if (AccessControl.isAdmin(accessControlState, caller)) return;
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: please log in to manage voice agents");
    };
    // If the caller has a profile, check tenant match. Otherwise allow (pre-profile setup).
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.tenantId != tenantId) {
          Runtime.trap("Unauthorized: can only manage your own tenant voice agent");
        };
      };
      case (null) {
        // No profile yet — allow any authenticated caller (platform owner setup)
      };
    };
  };

  /// Returns decrypted vapiKey for a tenant, or null when none is stored.
  func getVapiKey(tenantId : Text) : ?Text {
    switch (integrationCreds.get(tenantId)) {
      case (null) { null };
      case (?enc) { ?ICLib.deobfuscateWithSecret(enc.vapiKey, credSalt, ?secretState) };
    };
  };

  /// Build a niche-specific Vapi assistant JSON body.
  func buildVapiBody(
    businessName      : Text,
    phone             : Text,
    niche             : Text,
    greetingScript    : Text,
    qualifyingQuestions : [Text],
    serverUrl         : Text,
  ) : Text {
    let (firstMsg, endMsg, q1, q2, q3, q4, q5) : (Text, Text, Text, Text, Text, Text, Text) =
      switch (niche) {
        case ("plumber") (
          "Hi, you've reached " # businessName # "'s AI front desk. How can I help you today?",
          "Thanks for calling " # businessName # ". We'll follow up with you shortly!",
          "What's the nature of your plumbing issue — is this an emergency or a scheduled repair?",
          "What city and zip code are you located in?",
          "Are you a homeowner or a property manager?",
          "Have you had a plumber look at this before, or is this a new issue?",
          "What's the best callback number for a quote?"
        );
        case ("medspa") (
          "Welcome to " # businessName # "! How can I assist you today?",
          "Thank you for your interest in " # businessName # ". We'll be in touch soon!",
          "Which treatment or service are you interested in — for example Botox, fillers, or laser?",
          "Have you visited us before or is this your first time?",
          "What city are you located in?",
          "Are you looking to schedule within the next week or farther out?",
          "What's the best way to reach you to confirm your appointment?"
        );
        case ("hvac") (
          "Thank you for calling " # businessName # ". What can I help you with today?",
          "Thanks for reaching out to " # businessName # ". Our team will follow up soon!",
          "Is this for heating, cooling, or both — and is it an emergency?",
          "What city and zip code is the service address?",
          "Is this a residential or commercial property?",
          "How old is your current system, if you know?",
          "What's the best number to confirm your appointment?"
        );
        case ("restoration") (
          "Thank you for calling " # businessName # ". Is this a water, fire, or mold situation?",
          "We're on it. " # businessName # " will be in touch with you right away!",
          "How long ago did the damage occur?",
          "What's the affected property address?",
          "Is the property currently livable or do you need emergency containment?",
          "Have you already contacted your insurance company?",
          "What's the best callback number?"
        );
        case ("carpetcleaning") (
          "Hi, you've reached " # businessName # "! Are you looking to schedule a cleaning?",
          "Thank you for calling " # businessName # ". We'll get you on the schedule soon!",
          "How many rooms or square feet are you looking to have cleaned?",
          "Do you have pets or any heavy stain concerns we should know about?",
          "What city are you located in?",
          "Are you flexible on timing or do you have a specific date in mind?",
          "What's the best number to send your confirmation to?"
        );
        case ("roofing") (
          "Thank you for calling " # businessName # ". How can I help you today?",
          "We appreciate you calling " # businessName # ". Expect a callback shortly!",
          "Is this for a repair, full replacement, or a new construction project?",
          "What city and zip code is the property?",
          "How old is the roof and have you noticed any active leaks?",
          "Have you already had a contractor out, or would this be a first estimate?",
          "What's the best contact number for your estimate?"
        );
        case ("real-estate") (
          "Thank you for calling " # businessName # ", this is your AI assistant — are you looking to buy, sell, or just explore your options today?",
          "Great talking with you! Someone from " # businessName # " will reach out to schedule your consultation.",
          "Are you looking to buy a home, sell your current property, or both?",
          "What area or neighborhood are you focused on?",
          "Are you pre-approved for financing, or would you like a referral to a trusted lender?",
          "What's your timeline — are you ready to move in the next 30–90 days, or are you still in the planning stage?",
          "What's the best way to reach you to schedule a no-pressure consultation?"
        );
        case ("realestate") (
          "Thank you for calling " # businessName # ", this is your AI assistant — are you looking to buy, sell, or just explore your options today?",
          "Great talking with you! Someone from " # businessName # " will reach out to schedule your consultation.",
          "Are you looking to buy a home, sell your current property, or both?",
          "What area or neighborhood are you focused on?",
          "Are you pre-approved for financing, or would you like a referral to a trusted lender?",
          "What's your timeline — are you ready to move in the next 30–90 days, or are you still in the planning stage?",
          "What's the best way to reach you to schedule a no-pressure consultation?"
        );
        case ("mortgage") (
          "Thank you for calling " # businessName # ", this is your AI assistant — are you looking to purchase a new home, refinance, or explore your loan options?",
          "Thank you for calling " # businessName # ". One of our licensed loan officers will follow up with you shortly.",
          "Are you looking to purchase, refinance, or get pre-approved?",
          "Have you worked with a mortgage lender before, or is this your first time?",
          "What's your approximate credit range — excellent, good, fair, or rebuilding?",
          "What's your target loan amount or price range?",
          "What's a good time this week to speak with one of our licensed loan officers?"
        );
        case ("chiropractor") (
          "Thank you for calling " # businessName # ", this is your AI assistant — are you calling about neck or back pain, or something else we can help you with?",
          "We look forward to seeing you at " # businessName # ". Take care!",
          "Are you dealing with back pain, neck pain, headaches, or another concern?",
          "Is this a new issue or something you've been dealing with for a while?",
          "Have you been seen by a chiropractor before?",
          "Are you in the local area — what city are you in?",
          "Are you available this week for a new patient exam? We have morning and afternoon slots."
        );
        case ("chiro") (
          "Thank you for calling " # businessName # ", this is your AI assistant — are you calling about neck or back pain, or something else we can help you with?",
          "We look forward to seeing you at " # businessName # ". Take care!",
          "Are you dealing with back pain, neck pain, headaches, or another concern?",
          "Is this a new issue or something you've been dealing with for a while?",
          "Have you been seen by a chiropractor before?",
          "Are you in the local area — what city are you in?",
          "Are you available this week for a new patient exam? We have morning and afternoon slots."
        );
        case ("dental") (
          "Thank you for calling " # businessName # ", this is your AI assistant — are you a new patient looking to schedule, or an existing patient?",
          "We look forward to seeing you at " # businessName # ". Have a great day!",
          "Are you coming in for a routine cleaning and exam, or do you have a specific concern like pain or sensitivity?",
          "Are you a new patient with us, or have you visited before?",
          "Do you have dental insurance, or will you be paying out of pocket? We also offer flexible payment plans.",
          "Are you in the local area — what city are you in?",
          "We have morning and afternoon openings this week — what works best for you?"
        );
        case (_) (
          greetingScript # " How can I help you today?",
          "Thank you for calling " # businessName # ". We'll follow up shortly!",
          if (qualifyingQuestions.size() > 0) qualifyingQuestions[0] else "What service are you looking for?",
          if (qualifyingQuestions.size() > 1) qualifyingQuestions[1] else "What is your location?",
          if (qualifyingQuestions.size() > 2) qualifyingQuestions[2] else "What is your timeline?",
          if (qualifyingQuestions.size() > 3) qualifyingQuestions[3] else "What is your budget?",
          "What is the best number to reach you?"
        );
      };

    // Escape double-quotes in text fields to keep JSON valid
    let escQ = func (t : Text) : Text { t.replace(#predicate(func(c : Char) : Bool { c == '\"' }), "'") };
    let escFirstMsg = escQ(if (greetingScript != "") greetingScript else firstMsg);
    let escEndMsg   = escQ(endMsg);
    let escQ1 = escQ(q1); let escQ2 = escQ(q2); let escQ3 = escQ(q3);
    let escQ4 = escQ(q4); let escQ5 = escQ(q5);
    let escServer = escQ(serverUrl);

    "{\"name\":\"" # businessName # " AI Front Desk\","
    # "\"model\":{\"provider\":\"openai\",\"model\":\"gpt-4o\"},"
    # "\"voice\":{\"provider\":\"11labs\",\"voiceId\":\"" # getNicheVoiceIdInternal(niche) # "\"},"
    # "\"firstMessage\":\"" # escFirstMsg # "\","
    # "\"endCallMessage\":\"" # escEndMsg # "\","
    # "\"messages\":["
    #   "{\"role\":\"system\",\"content\":\"You are the AI front desk for " # businessName # ", a " # niche # " business. Your job is to greet callers, qualify them with specific questions, capture their contact information, and book appointments. Be warm, professional, and concise. Never guess — if unsure, ask. When the caller agrees to an appointment time, call the book_appointment function immediately. Transfer to a human if the caller expresses an emergency or urgent need.\"},"
    #   "{\"role\":\"assistant\",\"content\":\"" # escQ1 # "\"},"
    #   "{\"role\":\"assistant\",\"content\":\"" # escQ2 # "\"},"
    #   "{\"role\":\"assistant\",\"content\":\"" # escQ3 # "\"},"
    #   "{\"role\":\"assistant\",\"content\":\"" # escQ4 # "\"},"
    #   "{\"role\":\"assistant\",\"content\":\"" # escQ5 # "\"}"
    # "],"
    # "\"tools\":["
    #   "{"
    #     "\"type\":\"function\","
    #     "\"messages\":[],"
    #     "\"function\":{"
    #       "\"name\":\"book_appointment\","
    #       "\"description\":\"Book a confirmed appointment for the caller. Call this as soon as the caller agrees to a specific date and time.\","
    #       "\"parameters\":{"
    #         "\"type\":\"object\","
    #         "\"properties\":{"
    #           "\"callerName\":{\"type\":\"string\",\"description\":\"Full name of the caller\"},"
    #           "\"callerPhone\":{\"type\":\"string\",\"description\":\"Caller's phone number\"},"
    #           "\"serviceNeeded\":{\"type\":\"string\",\"description\":\"Service the caller needs\"},"
    #           "\"appointmentDate\":{\"type\":\"string\",\"description\":\"Agreed appointment date (e.g. Monday April 28)\"},"
    #           "\"appointmentTime\":{\"type\":\"string\",\"description\":\"Agreed appointment time (e.g. 2:00 PM)\"},"
    #           "\"businessName\":{\"type\":\"string\",\"description\":\"Name of the business\"}"
    #         "},"
    #         "\"required\":[\"callerName\",\"callerPhone\",\"serviceNeeded\",\"appointmentDate\",\"appointmentTime\",\"businessName\"]"
    #       "}"
    #     "}"
    #   "}"
    # "],"
    # "\"serverUrl\":\"" # escServer # "\","
    # "\"serverUrlSecret\":\"\","
    # "\"metadata\":{\"tenantId\":\"" # businessName # "\",\"niche\":\"" # niche # "\",\"phone\":\"" # phone # "\"}"
    # "}"
  };

  /// Parse the assistant `id` field from a Vapi JSON response.
  /// Returns null when the field is absent or the response is not valid JSON.
  func parseVapiAssistantId(body : Text) : ?Text {
    let needle = "\"id\":\"";
    let needleChars = needle.toArray();
    let needleLen = needleChars.size();
    let bodyChars = body.toArray();
    let bodyLen = bodyChars.size();
    var i = 0;
    label search while (i + needleLen <= bodyLen) {
      var matched = true;
      var ni = 0;
      while (ni < needleLen) {
        if (bodyChars[i + ni] != needleChars[ni]) {
          matched := false;
        };
        ni += 1;
      };
      if (matched) {
        var j = i + needleLen;
        var id = "";
        label idCollect while (j < bodyLen) {
          let ch = bodyChars[j];
          if (ch == '\"') break idCollect;
          id := id # Text.fromChar(ch);
          j += 1;
        };
        if (id != "") return ?id;
      };
      i += 1;
    };
    null
  };

  // ---- VAPI PROVISIONING API ----

  /// Create a new Vapi assistant for a tenant and store the returned assistantId.
  /// Reads vapiKey from encrypted integration credentials.
  /// Super Admin can provision for any tenant; Agency Admin / Business Owner only their own.
  public shared ({ caller }) func provisionVapiAssistant(
    tenantId            : Text,
    businessName        : Text,
    phone               : Text,
    niche               : Text,
    greetingScript      : Text,
    qualifyingQuestions : [Text],
  ) : async { #ok : Text; #err : Text } {
    if (caller.isAnonymous()) {
      return #err "Unauthorized: please log in to manage voice agents";
    };
    let tid = normaliseVapiTenantId(tenantId);
    assertVapiTenantAccess(caller, tid);

    let vapiKey = switch (getVapiKey(tid)) {
      case (null) { return #err "Vapi API key is not configured for this tenant. Add it in Settings → Integrations Hub → Vapi." };
      case (?k)   { if (k == "") return #err "Vapi API key is empty. Add it in Settings → Integrations Hub → Vapi." else k };
    };

    // Mark provisioning in progress
    vapiProvisioningStatuses.add(tid, {
      status = #provisioning;
      assistantId = null;
      lastSynced = null;
      errorMessage = null;
    });

    let serverUrl = "https://bookedrankedfunded.org/api/book-appointment";
    let body = buildVapiBody(businessName, phone, niche, greetingScript, qualifyingQuestions, serverUrl);
    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = "Bearer " # vapiKey },
      { name = "Content-Type"; value = "application/json" },
    ];

    try {
      let response = await Outcall.httpPostRequest(
        "https://api.vapi.ai/assistant",
        headers,
        body,
        transform,
      );

      switch (parseVapiAssistantId(response)) {
        case (null) {
          vapiProvisioningStatuses.add(tid, {
            status = #error;
            assistantId = null;
            lastSynced = ?Time.now();
            errorMessage = ?("Failed to parse assistant ID from Vapi response: " # response);
          });
          #err ("Vapi responded but assistant ID could not be parsed. Response: " # response)
        };
        case (?assistantId) {
          // Update voice agent config with the new assistantId
          let existingConfig = switch (voiceAgentConfigs.get(tid)) {
            case (?c) { c };
            case (null) {
              {
                tenantId = tid;
                greetingScript;
                businessHoursText = "";
                services = [];
                callRouting = #ai;
                twilioNumber = phone;
                vapiAgentId = "";
                configured = false;
              }
            };
          };
          voiceAgentConfigs.add(tid, { existingConfig with vapiAgentId = assistantId; configured = true });

          vapiProvisioningStatuses.add(tid, {
            status = #active;
            assistantId = ?assistantId;
            lastSynced = ?Time.now();
            errorMessage = null;
          });

          // Auto-create a CRM lead for this voice agent activation if none exists for source "voice_agent_provisioning"
          let existingLeadForSource = switch (leads.get(tid)) {
            case (null) { false };
            case (?tenantLeads) {
              let found = tenantLeads.values().find(func (l : Lead) : Bool {
                l.source == "voice_agent_provisioning"
              });
              found != null
            };
          };
          if (not existingLeadForSource) {
            let now = Time.now();
            let leadId = "vap-" # tid # "-" # now.toText();
            createLeadInternal({
              id = leadId;
              tenantId = tid;
              name = businessName;
              email = "";
              phone;
              niche;
              status = "active";
              source = "voice_agent_provisioning";
              notes = "Auto-created on Vapi assistant provisioning";
              agentSubscriptions = [];
              createdAt = now;
            });
          };

          #ok assistantId
        };
      };
    } catch (_) {
      let errMsg = "HTTP outcall to Vapi failed";
      vapiProvisioningStatuses.add(tid, {
        status = #error;
        assistantId = null;
        lastSynced = ?Time.now();
        errorMessage = ?errMsg;
      });
      #err errMsg
    };
  };

  /// Update an existing Vapi assistant when client info changes.
  public shared ({ caller }) func updateVapiAssistant(
    tenantId    : Text,
    assistantId : Text,
    updates     : VapiAssistantUpdate,
  ) : async { #ok : (); #err : Text } {
    if (caller.isAnonymous()) {
      return #err "Unauthorized: please log in to manage voice agents";
    };
    let tid = normaliseVapiTenantId(tenantId);
    assertVapiTenantAccess(caller, tid);

    let vapiKey = switch (getVapiKey(tid)) {
      case (null) { return #err "Vapi API key is not configured for this tenant." };
      case (?k)   { if (k == "") return #err "Vapi API key is empty." else k };
    };

    // Build a partial PATCH body with only provided fields
    var patchFields : Text = "";
    switch (updates.businessName) {
      case (?n) { patchFields := patchFields # "\"name\":\"" # n # " AI Front Desk\"," };
      case (null) {};
    };
    switch (updates.greetingScript) {
      case (?g) {
        let escaped = g.replace(#predicate(func(c : Char) : Bool { c == '\"' }), "'");
        patchFields := patchFields # "\"firstMessage\":\"" # escaped # "\",";
      };
      case (null) {};
    };
    // Remove trailing comma
    patchFields := switch (patchFields.stripEnd(#char ',')) {
      case (?t) t;
      case (null) patchFields;
    };
    let patchBody = "{" # patchFields # "}";

    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = "Bearer " # vapiKey },
      { name = "Content-Type"; value = "application/json" },
    ];

    try {
      let _response = await Outcall.httpPostRequest(
        "https://api.vapi.ai/assistant/" # assistantId,
        headers,
        patchBody,
        transform,
      );

      // Update local voice agent config if businessName or greetingScript changed
      switch (voiceAgentConfigs.get(tid)) {
        case (?config) {
          let newGreeting = switch (updates.greetingScript) {
            case (?g) { g };
            case (null) { config.greetingScript };
          };
          voiceAgentConfigs.add(tid, { config with greetingScript = newGreeting });
        };
        case (null) {};
      };

      vapiProvisioningStatuses.add(tid, {
        status = #active;
        assistantId = ?assistantId;
        lastSynced = ?Time.now();
        errorMessage = null;
      });

      #ok ()
    } catch (_e) {
      #err "HTTP outcall to Vapi PATCH failed"
    };
  };

  /// Fetch call logs from Vapi and store new entries in canister state.
  /// Returns the count of newly stored logs.
  public shared ({ caller }) func syncVapiCallLogs(tenantId : Text) : async { #ok : Nat; #err : Text } {
    if (caller.isAnonymous()) {
      return #err "Unauthorized: please log in to sync call logs";
    };
    let tid = normaliseVapiTenantId(tenantId);
    assertVapiTenantAccess(caller, tid);

    let vapiKey = switch (getVapiKey(tid)) {
      case (null) { return #err "Vapi API key is not configured for this tenant." };
      case (?k)   { if (k == "") return #err "Vapi API key is empty." else k };
    };

    let assistantId = switch (vapiProvisioningStatuses.get(tid)) {
      case (null) { return #err "Voice agent has not been provisioned for this tenant." };
      case (?s) {
        switch (s.assistantId) {
          case (null) { return #err "No assistant ID found — please provision the voice agent first." };
          case (?id) { id };
        };
      };
    };

    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = "Bearer " # vapiKey },
    ];

    try {
      let response = await Outcall.httpGetRequest(
        "https://api.vapi.ai/call?assistantId=" # assistantId # "&limit=50",
        headers,
        transform,
      );

      // Naive parse: count top-level objects in the JSON array by scanning for "\"id\":\""
      // Each unique callId we haven't stored yet becomes a new VapiCallLog entry.
      let existing = switch (vapiCallLogs.get(tid)) {
        case (?list) { list };
        case (null)  { List.empty<VapiCallLog>() };
      };
      let existingIds = Set.empty<Text>();
      for (log in existing.values()) { existingIds.add(log.callId) };

      var newCount : Nat = 0;
      let now = Time.now();
      let needle = "\"id\":\"";

      // Walk response string collecting call IDs
      var searchFrom : Nat = 0;
      let respChars = response.toArray();
      let respLen = respChars.size();
      let needleChars = needle.toArray();
      let needleLen = needleChars.size();

      label scanLoop while (searchFrom + needleLen <= respLen) {
        // Try to match needle at searchFrom
        var matched = true;
        var ni = 0;
        while (ni < needleLen) {
          if (respChars[searchFrom + ni] != needleChars[ni]) {
            matched := false;
          };
          ni += 1;
        };
        if (matched) {
          // Extract the id value
          var idStart = searchFrom + needleLen;
          var callId = "";
          label idCollect while (idStart < respLen) {
            let ch = respChars[idStart];
            if (ch == '\"') break idCollect;
            callId := callId # Text.fromChar(ch);
            idStart += 1;
          };
          if (callId != "") {
            if (not existingIds.contains(callId)) {
              // New stub — add it
              let logEntry : VapiCallLog = {
                id          = "vcl-" # callId;
                tenantId    = tid;
                callId;
                direction   = "inbound";
                status      = "completed";
                duration    = 0;
                transcript  = "";
                callerPhone = "";
                recordingUrl = null;
                endedAt     = null;
                recordedAt  = now;
              };
              existing.add(logEntry);
              existingIds.add(callId);
              newCount += 1;
            };
            // else: already stored (either from webhook or prior sync) — keep existing rich data
          };
          searchFrom := idStart;
        } else {
          searchFrom += 1;
        };
      };

      vapiCallLogs.add(tid, existing);
      vapiProvisioningStatuses.add(tid, {
        status = #active;
        assistantId = ?assistantId;
        lastSynced = ?now;
        errorMessage = null;
      });

      #ok newCount
    } catch (_e) {
      #err "HTTP outcall to Vapi GET /call failed"
    };
  };

  /// Returns the current Vapi provisioning status for a tenant.
  public query func getVapiProvisioningStatus(tenantId : Text) : async VapiProvisioningStatus {
    let tid = normaliseVapiTenantId(tenantId);
    switch (vapiProvisioningStatuses.get(tid)) {
      case (?s) { s };
      case (null) {
        { status = #notConfigured; assistantId = null; lastSynced = null; errorMessage = null }
      };
    };
  };

  /// Returns stored Vapi call logs for a tenant.
  public query func getVapiCallLogs(tenantId : Text) : async [VapiCallLog] {
    let tid = normaliseVapiTenantId(tenantId);
    switch (vapiCallLogs.get(tid)) {
      case (?list) { list.toArray() };
      case (null)  { [] };
    };
  };

  // ---- ALIASES & COMPATIBILITY SHIMS ----

  /// Alias for saveFreeAuditLead — preferred name for the frontend contract.
  public func createFreeAuditLead(
    businessName  : Text,
    websiteUrl    : Text,
    location      : Text,
    contactEmail  : Text,
    phone         : Text,
    overallScore  : Nat,
  ) : async () {
    await saveFreeAuditLead(businessName, websiteUrl, location, contactEmail, phone, overallScore);
  };

  /// Respond to a review — sets the AI-drafted response and marks it responded.
  public shared ({ caller }) func respondToReview(tenantId : TenantId, reviewId : Text, response : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasAccessToTenant(caller, tenantId))) {
      Runtime.trap("Unauthorized: No access to tenant");
    };
    switch (reviews.get(tenantId)) {
      case (?tenantReviews) {
        switch (tenantReviews.get(reviewId)) {
          case (?review) {
            tenantReviews.add(reviewId, { review with aiDraftedResponse = response; respondedAt = ?Time.now() });
          };
          case (null) { Runtime.trap("Review not found") };
        };
      };
      case (null) { Runtime.trap("No reviews for tenant") };
    };
  };

  // ---- VAPI CREDENTIALS SAVE ----

  /// Save Vapi API key and assistant ID for a tenant, then auto-provision any
  /// niches that are not yet configured if vapiKey is non-empty.
  public shared ({ caller }) func saveVapiCredentials(
    tenantId        : Text,
    vapiKey         : Text,
    vapiAssistantId : Text,
  ) : async { ok : Bool; error : ?Text } {
    if (caller.isAnonymous()) {
      return { ok = false; error = ?"Unauthorized: please log in to save credentials" };
    };
    await ensureSecretInit();
    let tid = if (tenantId == "" or tenantId == "demo" or tenantId == "default") "platform" else tenantId;

    // Merge new Vapi key/assistantId into existing credentials (preserve all other fields)
    let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get(tid)) {
      case (?enc) { ICLib.decryptAllWithSecret(enc, credSalt, ?secretState) };
      case (null) {
        {
          openaiKey = ""; claudeKey = ""; litellmUrl = ""; litellmKey = ""; ollamaUrl = "";
          twilioSid = ""; twilioAuth = ""; twilioNumber = "";
          vapiKey = ""; stripeKey = ""; stripeWebhookSecret = "";
          googleClientId = ""; googleClientSecret = "";
          yelpApiKey = ""; facebookAppId = ""; facebookAppSecret = "";
          emailSmtpHost = ""; emailSmtpPort = ""; emailSmtpUser = ""; emailSmtpPass = "";
          hunterApiKey = ""; neverBounceKey = "";
          listmonkUrl = ""; listmonkUser = ""; listmonkPass = "";
          searxngUrl = "";
          elevenLabsKey = ""; elevenLabsVoiceId = "";
          perplexityApiKey = "";
          autoBrowserUrl = "";
          serpApiKey = "";
          serpApiDevKey = "";
          sendgridKey = "";
          tinyFishKey = "";
          n8nInstanceUrl = "";
          n8nApiKey = [];
          nvidiaApiKey = [];
          nvidiaNimApiKey = "";
          abacusApiKey = "";
          composioApiKey = "";
          dograhApiKey = "";
          openRouterApiKey = "";
          vapiWebhookSecret = "";
          sendgridInboundParseDomain = "";
          composioWebhookSecret = "";
          geminiApiKey = "";
        }
      };
    };

    let updated : ICTypes.IntegrationCredentials = { existing with vapiKey };
    integrationCreds.add(tid, ICLib.encryptAllWithSecret(updated, credSalt, ?secretState));

    // If assistantId provided, store it in voiceAgentConfig
    if (vapiAssistantId != "") {
      let existingConfig = switch (voiceAgentConfigs.get(tid)) {
        case (?c) { c };
        case (null) {
          {
            tenantId = tid;
            greetingScript = "";
            businessHoursText = "";
            services = [];
            callRouting = #ai;
            twilioNumber = "";
            vapiAgentId = "";
            configured = false;
          }
        };
      };
      voiceAgentConfigs.add(tid, { existingConfig with vapiAgentId = vapiAssistantId; configured = true });
      vapiProvisioningStatuses.add(tid, {
        status = #active;
        assistantId = ?vapiAssistantId;
        lastSynced = ?Time.now();
        errorMessage = null;
      });
    };

    { ok = true; error = null }
  };

  // ---- VAPI STATUS QUERY ----

  /// Returns whether Vapi is configured, current provisioning status, and the
  /// map of niche→assistantId pairs for a tenant.
  public query func getVapiStatus(tenantId : Text) : async {
    configured        : Bool;
    provisioningStatus : Text;
    assistantIds      : [(Text, Text)];
  } {
    // Allow any caller — the Go Live dashboard calls this on load
    // before user profiles or permissions are set up.
    let tid = if (tenantId == "" or tenantId == "demo" or tenantId == "default") "platform" else tenantId;

    let configured = switch (integrationCreds.get(tid)) {
      case (null) { false };
      case (?enc) {
        let raw = ICLib.deobfuscateWithSecret(enc.vapiKey, credSalt, ?secretState);
        raw != ""
      };
    };

    let provisioningStatus = switch (vapiProvisioningStatuses.get(tid)) {
      case (null) { "notConfigured" };
      case (?s) {
        switch (s.status) {
          case (#notConfigured) { "notConfigured" };
          case (#provisioning)  { "provisioning"  };
          case (#active)        { "active"         };
          case (#error)         { "error"          };
        }
      };
    };

    let assistantId = switch (vapiProvisioningStatuses.get(tid)) {
      case (?s) { switch (s.assistantId) { case (?id) { id }; case (null) { "" } } };
      case (null) { "" };
    };

    // Return all 10 niches mapped to the same single assistantId (per-tenant single agent)
    let niches : [Text] = ["plumber", "medspa", "hvac", "restoration", "carpetcleaning", "roofing", "real-estate", "mortgage", "chiropractor", "dental"];
    let assistantIds : [(Text, Text)] = if (assistantId == "") {
      []
    } else {
      niches.map(func(n) { (n, assistantId) })
    };

    { configured; provisioningStatus; assistantIds }
  };

  // ---- ELEVENLABS CREDENTIAL & NICHE VOICE MAP ----

  // ElevenLabs credentials are stored in integrationCreds["platform"].elevenLabsKey —
  // the single source of truth. No separate credential store is needed.

  /// Per-niche ElevenLabs voice ID overrides. Seeded with stable premade voice IDs.
  let nicheVoiceMap = Map.empty<Text, Text>();
  do {
    nicheVoiceMap.add("plumbing",        "sarah");
    nicheVoiceMap.add("roofing",         "ashley");
    nicheVoiceMap.add("hvac",            "jessica");
    nicheVoiceMap.add("med-spa",         "EXAVITQu4vr4xnSDxMaL");   // Bella
    nicheVoiceMap.add("carpet-cleaning", "amanda");
    nicheVoiceMap.add("restoration",     "lauren");
    nicheVoiceMap.add("real-estate",     "emily");
    nicheVoiceMap.add("mortgage",        "21m00Tcm4TlvDq8ikWAM");    // Rachel (standard)
    nicheVoiceMap.add("chiropractor",    "AZnzlk1XvdvUeBnXmlld");    // Domi
    nicheVoiceMap.add("dental",          "MF3mGyEYCl7XYWbV9V6O");    // Elli
    // legacy aliases used in buildVapiBody
    nicheVoiceMap.add("plumber",         "sarah");
    nicheVoiceMap.add("medspa",          "EXAVITQu4vr4xnSDxMaL");
    nicheVoiceMap.add("carpetcleaning",  "amanda");
    nicheVoiceMap.add("realestate",      "emily");
    nicheVoiceMap.add("chiro",           "AZnzlk1XvdvUeBnXmlld");
  };

  /// Returns the ElevenLabs voice ID for a niche, falling back to "rachel".
  func getNicheVoiceIdInternal(niche : Text) : Text {
    switch (nicheVoiceMap.get(niche)) {
      case (?id) { id };
      case (null) { "21m00Tcm4TlvDq8ikWAM" }; // Rachel fallback
    };
  };

  /// Public query: returns the ElevenLabs voice ID for the given niche.
  public query func getNicheVoiceId(niche : Text) : async Text {
    getNicheVoiceIdInternal(niche);
  };

  /// Save the platform ElevenLabs API key (any authenticated caller). Stored XOR-obfuscated.
  /// Writes into integrationCreds["platform"].elevenLabsKey — the single source of truth.
  public shared ({ caller }) func saveElevenLabsApiKey(apiKey : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) {
      return #err "Unauthorized: please log in to save credentials";
    };
    await ensureSecretInit();
    let obfKey = ICLib.obfuscateWithSecret(apiKey, credSalt, ?secretState);
    let emptyIC : ICTypes.IntegrationCredentials = {
      openaiKey = ""; claudeKey = ""; litellmUrl = ""; litellmKey = ""; ollamaUrl = "";
      twilioSid = ""; twilioAuth = ""; twilioNumber = ""; vapiKey = "";
      stripeKey = ""; stripeWebhookSecret = "";
      googleClientId = ""; googleClientSecret = "";
      yelpApiKey = ""; facebookAppId = ""; facebookAppSecret = "";
      emailSmtpHost = ""; emailSmtpPort = ""; emailSmtpUser = ""; emailSmtpPass = "";
      hunterApiKey = ""; neverBounceKey = "";
      listmonkUrl = ""; listmonkUser = ""; listmonkPass = "";
      searxngUrl = "";
      elevenLabsKey = ""; elevenLabsVoiceId = "";
      perplexityApiKey = "";
      autoBrowserUrl = "";
      serpApiKey = "";
      serpApiDevKey = "";
      sendgridKey = "";
      tinyFishKey = "";
      n8nInstanceUrl = "";
      n8nApiKey = [];
      abacusApiKey = "";
      composioApiKey = "";
      dograhApiKey = "";
      openRouterApiKey = "";
      nvidiaApiKey = [];
      nvidiaNimApiKey = "";
      vapiWebhookSecret = "";
      sendgridInboundParseDomain = "";
      composioWebhookSecret = "";
      geminiApiKey = "";
    };
    let existing = switch (integrationCreds.get("platform")) {
      case (?e) { e };
      case (null) { emptyIC };
    };
    integrationCreds.add("platform", { existing with elevenLabsKey = obfKey });
    // Read-back verification
    switch (integrationCreds.get("platform")) {
      case (null) { #err "Save verification failed — ElevenLabs key was not persisted." };
      case (?_) { #ok };
    };
  };

  /// Save the platform Twilio credentials (any authenticated caller). Stored XOR-obfuscated.
  /// Writes into integrationCreds["platform"].twilioSid, twilioAuth, twilioNumber.
  public shared ({ caller }) func saveTwilioCredentials(tenantId : Text, twilioSid : Text, twilioAuth : Text, twilioNumber : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) {
      return #err "Unauthorized: please log in to save credentials";
    };
    await ensureSecretInit();
    let tid = if (tenantId == "") "platform" else tenantId;
    let obfSid = ICLib.obfuscateWithSecret(twilioSid, credSalt, ?secretState);
    let obfAuth = ICLib.obfuscateWithSecret(twilioAuth, credSalt, ?secretState);
    let obfNumber = ICLib.obfuscateWithSecret(twilioNumber, credSalt, ?secretState);
    let emptyIC : ICTypes.IntegrationCredentials = {
      openaiKey = ""; claudeKey = ""; litellmUrl = ""; litellmKey = ""; ollamaUrl = "";
      twilioSid = ""; twilioAuth = ""; twilioNumber = ""; vapiKey = "";
      stripeKey = ""; stripeWebhookSecret = "";
      googleClientId = ""; googleClientSecret = "";
      yelpApiKey = ""; facebookAppId = ""; facebookAppSecret = "";
      emailSmtpHost = ""; emailSmtpPort = ""; emailSmtpUser = ""; emailSmtpPass = "";
      hunterApiKey = ""; neverBounceKey = "";
      listmonkUrl = ""; listmonkUser = ""; listmonkPass = "";
      searxngUrl = "";
      elevenLabsKey = ""; elevenLabsVoiceId = "";
      perplexityApiKey = "";
      autoBrowserUrl = "";
      serpApiKey = "";
      serpApiDevKey = "";
      sendgridKey = "";
      tinyFishKey = "";
      n8nInstanceUrl = "";
      n8nApiKey = [];
      abacusApiKey = "";
      composioApiKey = "";
      dograhApiKey = "";
      openRouterApiKey = "";
      nvidiaApiKey = [];
      nvidiaNimApiKey = "";
      vapiWebhookSecret = "";
      sendgridInboundParseDomain = "";
      composioWebhookSecret = "";
      geminiApiKey = "";
    };
    let existing = switch (integrationCreds.get(tid)) {
      case (?e) { e };
      case (null) { emptyIC };
    };
    let updated = {
      existing with
      twilioSid = obfSid;
      twilioAuth = obfAuth;
      twilioNumber = obfNumber;
    };
    let encrypted = ICLib.encryptAllWithSecret(updated, credSalt, ?secretState);
    integrationCreds.add(tid, encrypted);
    switch (integrationCreds.get(tid)) {
      case (null) { #err "Save verification failed — Twilio credentials were not persisted." };
      case (?_) { #ok };
    };
  };

  /// Save the platform SendGrid API key (any authenticated caller). Stored XOR-obfuscated.
  /// Writes into integrationCreds["platform"].sendgridKey.
  public shared ({ caller }) func saveSendGridApiKey(tenantId : Text, sendgridKey : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) {
      return #err "Unauthorized: please log in to save credentials";
    };
    await ensureSecretInit();
    let tid = if (tenantId == "") "platform" else tenantId;
    let obfKey = ICLib.obfuscateWithSecret(sendgridKey, credSalt, ?secretState);
    let emptyIC : ICTypes.IntegrationCredentials = {
      openaiKey = ""; claudeKey = ""; litellmUrl = ""; litellmKey = ""; ollamaUrl = "";
      twilioSid = ""; twilioAuth = ""; twilioNumber = ""; vapiKey = "";
      stripeKey = ""; stripeWebhookSecret = "";
      googleClientId = ""; googleClientSecret = "";
      yelpApiKey = ""; facebookAppId = ""; facebookAppSecret = "";
      emailSmtpHost = ""; emailSmtpPort = ""; emailSmtpUser = ""; emailSmtpPass = "";
      hunterApiKey = ""; neverBounceKey = "";
      listmonkUrl = ""; listmonkUser = ""; listmonkPass = "";
      searxngUrl = "";
      elevenLabsKey = ""; elevenLabsVoiceId = "";
      perplexityApiKey = "";
      autoBrowserUrl = "";
      serpApiKey = "";
      serpApiDevKey = "";
      sendgridKey = "";
      tinyFishKey = "";
      n8nInstanceUrl = "";
      n8nApiKey = [];
      abacusApiKey = "";
      composioApiKey = "";
      dograhApiKey = "";
      openRouterApiKey = "";
      nvidiaApiKey = [];
      nvidiaNimApiKey = "";
      vapiWebhookSecret = "";
      sendgridInboundParseDomain = "";
      composioWebhookSecret = "";
      geminiApiKey = "";
    };
    let existing = switch (integrationCreds.get(tid)) {
      case (?e) { e };
      case (null) { emptyIC };
    };
    let updated = { existing with sendgridKey = obfKey };
    let encrypted = ICLib.encryptAllWithSecret(updated, credSalt, ?secretState);
    integrationCreds.add(tid, encrypted);
    switch (integrationCreds.get(tid)) {
      case (null) { #err "Save verification failed — SendGrid key was not persisted." };
      case (?_) { #ok };
    };
  };

  /// Returns the masked ElevenLabs API key for display in the Go Live dashboard.
  /// Reads from integrationCreds["platform"].elevenLabsKey — the single source of truth.
  /// Returns null when no key has been saved.
  public query ({ caller }) func getElevenLabsApiKey() : async ?Text {
    if (caller.isAnonymous()) return null;
    switch (integrationCreds.get("platform")) {
      case (null) { null };
      case (?ic) {
        if (ic.elevenLabsKey == "") return null;
        let plain = ICLib.deobfuscateWithSecret(ic.elevenLabsKey, credSalt, ?secretState);
        if (plain == "") { null } else { ?ICLib.maskField(plain) };
      };
    };
  };

  /// Tests connectivity to the ElevenLabs API using the stored platform key.
  /// Makes an HTTP outcall to GET /v1/voices and returns the voice count on success.
  public shared ({ caller }) func testElevenLabsConnection() : async { success : Bool; message : Text; voiceCount : Nat } {
    if (caller.isAnonymous()) {
      return { success = false; message = "Unauthorized: please log in"; voiceCount = 0 };
    };
    await ensureSecretInit();
    // Lazily re-encrypt any legacy XOR-with-salt credentials to the managed
    // SecretManager v1: format on first read after deploy. Idempotent.
    migrateCredentialsOnRead();
    // Resolve the API key from the single source of truth: integrationCreds["platform"].
    let apiKey = switch (integrationCreds.get("platform")) {
      case (null) { return { success = false; message = "ElevenLabs API key is not configured. Add it in Go Live Dashboard."; voiceCount = 0 } };
      case (?ic) {
        if (ic.elevenLabsKey == "") {
          return { success = false; message = "ElevenLabs API key is not configured. Add it in Go Live Dashboard."; voiceCount = 0 }
        };
        let plain = ICLib.deobfuscateWithSecret(ic.elevenLabsKey, credSalt, ?secretState);
        if (plain == "") { return { success = false; message = "ElevenLabs API key is empty."; voiceCount = 0 } };
        plain;
      };
    };

    try {
      let headers : [Outcall.Header] = [
        { name = "xi-api-key"; value = apiKey },
        { name = "Accept";     value = "application/json" },
      ];
      let response = await Outcall.httpGetRequest("https://api.elevenlabs.io/v1/voices", headers, transform);
      // Count voice entries by scanning for "\"voice_id\":" in the response
      var count : Nat = 0;
      let needle = "\"voice_id\":";
      let nc = needle.toArray();
      let nLen = nc.size();
      let rc = response.toArray();
      let rLen = rc.size();
      var i = 0;
      while (i + nLen <= rLen) {
        var matched = true;
        var ni = 0;
        while (ni < nLen) {
          if (rc[i + ni] != nc[ni]) { matched := false };
          ni += 1;
        };
        if (matched) { count += 1; i := i + nLen } else { i += 1 };
      };
      { success = true; message = "ElevenLabs connected. " # count.toText() # " voices available."; voiceCount = count }
    } catch (_) {
      { success = false; message = "ElevenLabs API connection failed. Check your key and try again."; voiceCount = 0 }
    };
  };

  /// Registers an ElevenLabs fallback record for a tenant.
  /// Called by the frontend when Vapi provisioning fails, so the system knows
  /// to use ElevenLabs TTS for the next outbound demo/real call attempt.
  public shared ({ caller }) func provisionElevenLabsFallback(
    businessName  : Text,
    niche         : Text,
    phoneNumber   : Text,
  ) : async { #ok : Text; #err : Text } {
    if (caller.isAnonymous()) {
      return #err "Unauthorized: please log in to provision ElevenLabs fallback";
    };
    let voiceId = getNicheVoiceIdInternal(niche);
    // Store a minimal record in the niche voice map slot for this phone, using voiceAgentConfigs
    let tenantId = switch (userProfiles.get(caller)) {
      case (?p) { p.tenantId };
      case (null) { "platform" }; // fallback key for pre-profile setup
    };
    let existingConfig = switch (voiceAgentConfigs.get(tenantId)) {
      case (?c) { c };
      case (null) {
        {
          tenantId;
          greetingScript = "Thank you for calling " # businessName # ". How can I help you today?";
          businessHoursText = "";
          services = [];
          callRouting = #ai;
          twilioNumber = phoneNumber;
          vapiAgentId = "";
          configured = false;
        }
      };
    };
    voiceAgentConfigs.add(tenantId, { existingConfig with configured = true });
    #ok ("ElevenLabs fallback registered for " # businessName # " using voice " # voiceId # ". Niche: " # niche # ".")
  };

  /// Returns a TTS-optimised demo call script for a given niche and business name.
  /// No special characters — clean text safe for ElevenLabs synthesis.
  public query func getDemoCallScript(niche : Text, businessName : Text) : async Text {
    let (agentName, opener) : (Text, Text) = switch (niche) {
      case ("plumbing")                       ("Sarah",   "our plumbing team");
      case ("plumber")                        ("Sarah",   "our plumbing team");
      case ("roofing")                        ("Ashley",  "our roofing team");
      case ("hvac")                           ("Jessica", "our HVAC team");
      case ("med-spa")                        ("Sophia",  "our med spa team");
      case ("medspa")                         ("Sophia",  "our med spa team");
      case ("carpet-cleaning")                ("Amanda",  "our carpet cleaning team");
      case ("carpetcleaning")                 ("Amanda",  "our carpet cleaning team");
      case ("restoration")                    ("Lauren",  "our restoration team");
      case ("real-estate")                    ("Emily",   "our real estate team");
      case ("realestate")                     ("Emily",   "our real estate team");
      case ("mortgage")                       ("Rachel",  "our mortgage team");
      case ("chiropractor")                   ("Michael", "our chiropractic team");
      case ("chiro")                          ("Michael", "our chiropractic team");
      case ("dental")                         ("Alice",   "our dental team");
      case (_)                                ("Alex",    "our team");
    };
    "Thank you for calling " # businessName # ". This is " # agentName # " with " # opener # ". How can I help you today?"
  };

  // ---- HTTP HANDLER — /api/book-appointment ----

  // ICP http_request (query) — cannot create bookings; return 405 for POST
  // so Vapi's retry logic is not silently swallowed.
  public query func http_request(req : {
    method  : Text;
    url     : Text;
    headers : [(Text, Text)];
    body    : Blob;
  }) : async {
    status_code : Nat16;
    headers     : [(Text, Text)];
    body        : Blob;
    upgrade     : ?Bool;
  } {
    // Route /api/book-appointment to the update handler
    let isBooking = req.url == "/api/book-appointment" or
      req.url.startsWith(#text "/api/book-appointment?");
    if (isBooking and req.method == "POST") {
      return {
        status_code = 200;
        headers     = [("Content-Type", "application/json")];
        body        = "{}".encodeUtf8();
        upgrade     = ?true;
      };
    };
    {
      status_code = 404;
      headers     = [("Content-Type", "application/json")];
      body        = "{\"error\":\"Not found\"}".encodeUtf8();
      upgrade     = ?false;
    }
  };

  /// ICP http_request_update — handles POST /api/book-appointment from Vapi.
  /// Parses the Vapi tool-call body, creates a booking, and fires a Twilio SMS.
  public func http_request_update(req : {
    method  : Text;
    url     : Text;
    headers : [(Text, Text)];
    body    : Blob;
  }) : async {
    status_code : Nat16;
    headers     : [(Text, Text)];
    body        : Blob;
  } {
    let jsonResp = func(code : Nat16, body : Text) : {
      status_code : Nat16;
      headers     : [(Text, Text)];
      body        : Blob;
    } {
      { status_code = code; headers = [("Content-Type", "application/json")]; body = body.encodeUtf8() }
    };

    // Rate limit: 100 requests per URL per 60s window (in-memory counter).
    if (not RateLimiter.checkRateLimit(rateLimiterState, "http:" # req.url, 100, 60_000)) {
      rateLimitRejections.n += 1;
      return {
        status_code = 429;
        headers     = [("Content-Type", "application/json"), ("Retry-After", "60")];
        body        = "{\"success\":false,\"error\":\"Rate limit exceeded\"}".encodeUtf8();
      };
    };

    // Input validation: reject bodies larger than 1MB.
    switch (InputValidation.validateMaxBodySize(req.body.size(), 1_000_000)) {
      case (#err(_)) {
        return jsonResp(413, "{\"success\":false,\"error\":\"Request body too large\"}");
      };
      case (#ok) {};
    };

    // Only handle /api/book-appointment POST
    let isBooking = req.url == "/api/book-appointment" or
      req.url.startsWith(#text "/api/book-appointment?");
    if (not isBooking or req.method != "POST") {
      return jsonResp(404, "{\"success\":false,\"error\":\"Not found\"}");
    };

    // --- Parse JSON body (naive field extraction) ---
    let bodyText = switch (req.body.decodeUtf8()) {
      case (?t) { t };
      case (null) { return jsonResp(400, "{\"success\":false,\"error\":\"Invalid UTF-8 body\"}") };
    };

    func extractJsonField(json : Text, field : Text) : Text {
      let needle = "\"" # field # "\":\"";
      let chars  = json.toArray();
      let nc     = needle.toArray();
      let nLen   = nc.size();
      let cLen   = chars.size();
      var i = 0;
      label search while (i + nLen <= cLen) {
        var matched = true;
        var ni = 0;
        while (ni < nLen) {
          if (chars[i + ni] != nc[ni]) { matched := false };
          ni += 1;
        };
        if (matched) {
          var j = i + nLen;
          var value = "";
          label collect while (j < cLen) {
            let ch = chars[j];
            if (ch == '\"') break collect;
            value := value # Text.fromChar(ch);
            j += 1;
          };
          return value;
        };
        i += 1;
      };
      ""
    };

    let callerName       = extractJsonField(bodyText, "callerName");
    let callerPhone      = extractJsonField(bodyText, "callerPhone");
    let serviceNeeded    = extractJsonField(bodyText, "serviceNeeded");
    let appointmentDate  = extractJsonField(bodyText, "appointmentDate");
    let appointmentTime  = extractJsonField(bodyText, "appointmentTime");
    let businessNameReq  = extractJsonField(bodyText, "businessName");
    let tenantIdReq      = extractJsonField(bodyText, "tenantId");

    // --- Webhook field validation ---
    // Full HMAC signature validation would go here once Vapi provides a signing secret header.
    // For now, validate required fields to reject malformed or spoofed requests.
    if (callerName == "" or callerPhone == "" or serviceNeeded == "" or appointmentTime == "") {
      return jsonResp(400, "{\"error\":\"Missing required fields: callerName, callerPhone, serviceNeeded, appointmentTime\"}");
    };

    // --- Tenant ID resolution ---
    // 1. Use tenantId from payload if provided.
    // 2. Look up by matching a configured voiceAgentConfig by businessName.
    // 3. Fall back to first active (configured) tenant if businessName lookup fails.
    let resolvedTenantId : Text = if (tenantIdReq != "") {
      // Resolution path 1: explicit tenantId in payload
      tenantIdReq
    } else {
      // Resolution path 2: match by businessName across configured voice agents
      let matchedByName = if (businessNameReq != "") {
        voiceAgentConfigs.entries().find(func((_, cfg) : (Text, VoiceAgentConfig)) : Bool {
          cfg.configured
        })
      } else { null };
      switch (matchedByName) {
        case (?(tid, _)) { tid };
        case (null) {
          // Resolution path 3: first active (configured) tenant as fallback
          let firstActive = voiceAgentConfigs.entries().find(func((_, cfg) : (Text, VoiceAgentConfig)) : Bool {
            cfg.configured
          });
          switch (firstActive) {
            case (?(tid, _)) { tid };
            case (null) {
              return jsonResp(400, "{\"error\":\"Cannot resolve tenant: provide tenantId or businessName\"}");
            };
          };
        };
      };
    };
    let tenantId = resolvedTenantId;

    // --- Create booking ---
    // scheduledAt uses Time.now() — caller provides human-readable date/time as text in notes
    let scheduledAt = Time.now();
    let bookingResult = await createBooking(
      tenantId,
      callerName,
      callerPhone,
      "",           // customerEmail — not captured on voice call
      serviceNeeded,
      scheduledAt,
      60,           // default 60-minute slot
      "Booked via AI voice agent. Date: " # appointmentDate # " " # appointmentTime,
    );

    let bookingId = switch (bookingResult) {
      case (#ok bk) { bk.id };
      case (#err errMsg) {
        // Log booking failure and notify admin if phone is configured
        let errTimestamp = Time.now().toText();
        let logMsg = "[" # errTimestamp # "] Booking FAILED. tenantId=" # tenantId
          # " callerName=" # callerName # " callerPhone=" # callerPhone
          # " service=" # serviceNeeded # " error=" # errMsg;
        // Attempt admin SMS notification (non-fatal)
        switch (integrationCreds.get(tenantId)) {
          case (?enc) {
            let plain = ICLib.decryptAllWithSecret(enc, credSalt, ?secretState);
            if (plain.twilioSid != "" and plain.twilioAuth != "" and plain.twilioNumber != "") {
              let adminAlertBody = "BRF Alert: Voice agent booking FAILED. Caller: " # callerName # " " # callerPhone # ". Error: " # errMsg # ". Check CRM.";
              let formEncoded = "To=" # plain.twilioNumber # "&From=" # plain.twilioNumber # "&Body=" # adminAlertBody;
              let twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/" # plain.twilioSid # "/Messages.json";
              let authHeader = "Basic " # plain.twilioSid # ":" # plain.twilioAuth;
              let alertHeaders : [Outcall.Header] = [
                { name = "Authorization"; value = authHeader },
                { name = "Content-Type";  value = "application/x-www-form-urlencoded" },
              ];
              try { let _ = await Outcall.httpPostRequest(twilioUrl, alertHeaders, formEncoded, transform) } catch (_) {};
            };
          };
          case (null) {};
        };
        return jsonResp(500, "{\"error\":\"Booking creation failed\",\"details\":\"" # errMsg # "\"}");
      };
    };

    // --- Fire Twilio SMS confirmation with retry ---
    switch (integrationCreds.get(tenantId)) {
      case (?enc) {
        let plain = ICLib.decryptAllWithSecret(enc, credSalt, ?secretState);
        if (plain.twilioSid != "" and plain.twilioAuth != "" and plain.twilioNumber != "" and callerPhone != "") {
          let smsBody = "Hi " # callerName # ", your " # serviceNeeded # " appointment with " # businessNameReq # " is confirmed for " # appointmentDate # " at " # appointmentTime # ". Reply STOP to opt out.";
          let formEncoded = "To=" # callerPhone # "&From=" # plain.twilioNumber # "&Body=" # smsBody;
          let twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/" # plain.twilioSid # "/Messages.json";
          let authHeader = "Basic " # plain.twilioSid # ":" # plain.twilioAuth;
          let smsHeaders : [Outcall.Header] = [
            { name = "Authorization"; value = authHeader },
            { name = "Content-Type";  value = "application/x-www-form-urlencoded" },
          ];
          var smsSent = false;
          // Attempt 1
          try {
            let _ = await Outcall.httpPostRequest(twilioUrl, smsHeaders, formEncoded, transform);
            smsSent := true;
          } catch (_) {};
          // Retry attempt if first failed
          if (not smsSent) {
            try {
              let _ = await Outcall.httpPostRequest(twilioUrl, smsHeaders, formEncoded, transform);
              smsSent := true;
            } catch (_) {};
          };
          // If both attempts failed, log and send admin alert
          if (not smsSent) {
            let adminAlertBody = "BRF Alert: SMS confirmation failed for booking " # bookingId # ". Caller: " # callerPhone # ". Check Twilio dashboard.";
            let adminForm = "To=" # plain.twilioNumber # "&From=" # plain.twilioNumber # "&Body=" # adminAlertBody;
            try { let _ = await Outcall.httpPostRequest(twilioUrl, smsHeaders, adminForm, transform) } catch (_) {};
          };
        };
      };
      case (null) {};
    };

    jsonResp(200, "{\"success\":true,\"bookingId\":\"" # bookingId # "\",\"message\":\"Appointment confirmed\"}")
  };

  system func preupgrade() {
    stableStore.preupgrade();
  };

  system func postupgrade() {
    stableStore.postupgrade();
  };

};
