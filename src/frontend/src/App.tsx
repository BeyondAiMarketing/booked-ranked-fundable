import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  useSearch,
} from "@tanstack/react-router";
import { lazy, useEffect } from "react";
import AppLayout from "./components/AppLayout";
import WeeklyReportPanel from "./components/WeeklyReportPanel";
import { Toaster } from "./components/ui/sonner";
import { AppProvider, useApp } from "./context/AppContext";
import { CredentialsProvider } from "./context/CredentialsContext";
import { useActor } from "./hooks/useActor";
import AIAuditCenterPage from "./pages/AIAuditCenterPage";
import AILeadIntelligencePage from "./pages/AILeadIntelligencePage";
import AdminAIChatPage from "./pages/AdminAIChatPage";
import AdminAgentServicesPage from "./pages/AdminAgentServicesPage";
import AdminBrandKitTrialsPage from "./pages/AdminBrandKitTrialsPage";
import AdminBrfVoiceAgentPage from "./pages/AdminBrfVoiceAgentPage";
import AdminChatAgentPage from "./pages/AdminChatAgentPage";
import AdminCommandCenterPage from "./pages/AdminCommandCenterPage";
import AdminPage from "./pages/AdminPage";
import AdminTrialsPage from "./pages/AdminTrialsPage";
import AdminVoiceManagerPage from "./pages/AdminVoiceManagerPage";
import AgencyOnboardingPage from "./pages/AgencyOnboardingPage";
import AgencyPartnersPage from "./pages/AgencyPartnersPage";
import AgentOrchestrationPage from "./pages/AgentOrchestrationPage";
import AgentServicesPage from "./pages/AgentServicesPage";
import AgentWorkflowOSPage from "./pages/AgentWorkflowOSPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ApprovalQueuePage from "./pages/ApprovalQueuePage";
import AuditPage from "./pages/AuditPage";
import AutopilotDashboardPage from "./pages/AutopilotDashboardPage";
import BillingPortalPage from "./pages/BillingPortalPage";
import BookedCenterPage from "./pages/BookedCenterPage";
import BrandKitIntakePage from "./pages/BrandKitIntakePage";
import BrandKitLandingPage from "./pages/BrandKitLandingPage";
import BrandKitTrialDashboardPage from "./pages/BrandKitTrialDashboardPage";
import CallLogPage from "./pages/CallLogPage";
import CampaignsPage from "./pages/CampaignsPage";
import CarpetCleaningPage from "./pages/CarpetCleaningPage";
import ChatWidgetPage from "./pages/ChatWidgetPage";
import ChiropractorPage from "./pages/ChiropractorPage";
import ClientHealthDashboardPage from "./pages/ClientHealthDashboardPage";
import ClientMyWebsitePage from "./pages/ClientMyWebsitePage";
import ClientReportsPage from "./pages/ClientReportsPage";
import CompetitiveIntelPage from "./pages/CompetitiveIntelPage";
import CrmPipelinePage from "./pages/CrmPipelinePage";
import CsvLeadImportPage from "./pages/CsvLeadImportPage";
import DashboardPage from "./pages/DashboardPage";
import DemoLoginPage from "./pages/DemoLoginPage";
import DemoPage from "./pages/DemoPage";
import DentalPage from "./pages/DentalPage";
import DomainSetupPage from "./pages/DomainSetupPage";
import DripCampaignsPage from "./pages/DripCampaignsPage";
import EstimatesPage from "./pages/EstimatesPage";
import FeatureTogglePage from "./pages/FeatureTogglePage";
import FreeAuditPage from "./pages/FreeAuditPage";
import FundabilityPage from "./pages/FundabilityPage";
import FundedCenterPage from "./pages/FundedCenterPage";
import GbpManagementPage from "./pages/GbpManagementPage";
import GoLivePage from "./pages/GoLivePage";
import HVACPage from "./pages/HVACPage";
import HomePage from "./pages/HomePage";
import IntegrationHealthPage from "./pages/IntegrationHealthPage";
import LandingPageBuilderPage from "./pages/LandingPageBuilderPage";
import LeadAttributionPage from "./pages/LeadAttributionPage";
import LeadEnginePage from "./pages/LeadEnginePage";
import LeadsPage from "./pages/LeadsPage";
import ListingsPage from "./pages/ListingsPage";
import LoginPage from "./pages/LoginPage";
import MedSpaPage from "./pages/MedSpaPage";
import MortgagePage from "./pages/MortgagePage";
import MultiLocationPage from "./pages/MultiLocationPage";
import N8NIntegrationDocsPage from "./pages/N8NIntegrationDocsPage";
import NicheAnalyticsPage from "./pages/NicheAnalyticsPage";
import NicheWebsitePreviewPage from "./pages/NicheWebsitePreviewPage";
import NicheWebsiteStudioPage from "./pages/NicheWebsiteStudioPage";
import OnboardingWizardPage from "./pages/OnboardingWizardPage";
import OpenLeadLakePage from "./pages/OpenLeadLakePage";
import OutreachAgentPage from "./pages/OutreachAgentPage";
import OutreachPipelinePage from "./pages/OutreachPipelinePage";
import PaidAdsAgentPage from "./pages/PaidAdsAgentPage";
import PlumbingPage from "./pages/PlumbingPage";
import PricingPage from "./pages/PricingPage";
import Public3DViewerPage from "./pages/Public3DViewerPage";
import RankedCenterPage from "./pages/RankedCenterPage";
import RealEstatePage from "./pages/RealEstatePage";
import ReplyIntelligenceInboxPage from "./pages/ReplyIntelligenceInboxPage";
import ReportsPage from "./pages/ReportsPage";
import ReputationInboxPage from "./pages/ReputationInboxPage";
import RestorationPage from "./pages/RestorationPage";
import ReviewRequestsPage from "./pages/ReviewRequestsPage";
import ReviewsPage from "./pages/ReviewsPage";
import RoofingCampaignCommandCenterPage from "./pages/RoofingCampaignCommandCenterPage";
import RoofingPage from "./pages/RoofingPage";
import RoofingPlaybookTripwirePage from "./pages/RoofingPlaybookTripwirePage";
import Scanner3DPage from "./pages/Scanner3DPage";
import SeoGeoAgentPage from "./pages/SeoGeoAgentPage";
import ServicesDemoPage from "./pages/ServicesDemoPage";
import SettingsPage from "./pages/SettingsPage";
import SetupPage from "./pages/SetupPage";
import SmsAutopilotPage from "./pages/SmsAutopilotPage";
import SmsInboxPage from "./pages/SmsInboxPage";
import SocialMediaPage from "./pages/SocialMediaPage";
import SocialROIDashboardPage from "./pages/SocialROIDashboardPage";
import UnifiedDemoPage from "./pages/UnifiedDemoPage";
import VoiceAgentPage from "./pages/VoiceAgentPage";
import VoiceAgentPreviewPage from "./pages/VoiceAgentPreviewPage";
import VoiceAgentStudioPage from "./pages/VoiceAgentStudioPage";
import WebhookInboxPage from "./pages/WebhookInboxPage";
import WebsiteAgentPage from "./pages/WebsiteAgentPage";
import WebsiteAgentSettingsPage from "./pages/WebsiteAgentSettingsPage";
import WhiteLabelHubPage from "./pages/WhiteLabelHubPage";
import WhyUsPage from "./pages/WhyUsPage";
import WorkflowLogsPage from "./pages/WorkflowLogsPage";
import { setBackendActor } from "./services/audioService";

const NewslettersPage = lazy(() => import("./pages/NewslettersPage"));
const ScraperToolPage = lazy(() => import("./pages/ScraperToolPage"));
const OutreachAnalyticsPage = lazy(() => import("./pages/OutreachAnalyticsPage"));
const AdminAIProviderPage = lazy(() => import("./pages/AdminAIProviderPage"));
const AdminCollectionManagerPage = lazy(() => import("./pages/AdminCollectionManagerPage"));
const AdminRAGChatTesterPage = lazy(() => import("./pages/AdminRAGChatTesterPage"));
const AdminAgentWorkflowRunnerPage = lazy(() => import("./pages/AdminAgentWorkflowRunnerPage"));
const AdminWorkflowLibraryPage = lazy(() => import("./pages/AdminWorkflowLibraryPage"));
const AdminN8NMigrationPage = lazy(() => import("./pages/AdminN8NMigrationPage"));
const AdminAIUsageLogsPage = lazy(() => import("./pages/AdminAIUsageLogsPage"));
const AdminVectorIndexPage = lazy(() => import("./pages/AdminVectorIndexPage"));
const AdminClientAIManagerPage = lazy(() => import("./pages/AdminClientAIManagerPage"));
const ClientAskAIPage = lazy(() => import("./pages/ClientAskAIPage"));
const ClientAskAboutBusinessPage = lazy(() => import("./pages/ClientAskAboutBusinessPage"));
const ClientAIReportsPage = lazy(() => import("./pages/ClientAIReportsPage"));
const ClientAIRecommendationsPage = lazy(() => import("./pages/ClientAIRecommendationsPage"));
const ClientUploadedDocsPage = lazy(() => import("./pages/ClientUploadedDocsPage"));
const ClientWorkflowAgentPage = lazy(() => import("./pages/ClientWorkflowAgentPage"));
const SocialContentGeneratorPage = lazy(() => import("./pages/SocialContentGeneratorPage"));
const SocialSchedulerPage = lazy(() => import("./pages/SocialSchedulerPage"));
const SocialEngagementAgentPage = lazy(() => import("./pages/SocialEngagementAgentPage"));
const SocialProofPipelinePage = lazy(() => import("./pages/SocialProofPipelinePage"));
const CompetitorIntelligencePage = lazy(() => import("./pages/CompetitorIntelligencePage"));
const SocialLeadCapturePage = lazy(() => import("./pages/SocialLeadCapturePage"));
const SocialDemoFunnelPage = lazy(() => import("./pages/SocialDemoFunnelPage"));
const ContentCreationStudioPage = lazy(() => import("./pages/ContentCreationStudioPage"));
const AdminMCPToolkitPage = lazy(() => import("./pages/AdminMCPToolkitPage"));
const AccountBriefPage = lazy(() => import("./pages/AccountBriefPage"));
const ComposioToolConnectPage = lazy(() => import("./pages/ComposioToolConnectPage"));
const RoofingAutomationsPage = lazy(() => import("./pages/RoofingAutomationsPage"));
const MasterAgentPage = lazy(() => import("./pages/MasterAgentPage"));
const LocalRankingIntelligence = lazy(() => import("./pages/LocalRankingIntelligence"));
const RoofingCampaignManager = lazy(() => import("./pages/RoofingCampaignManager"));
const RooferCampaignPage = lazy(() => import("./pages/RooferCampaignPage"));
const DemoBookingPage = lazy(() => import("./pages/DemoBookingPage"));
const ContentOrchestratorPage = lazyRouteComponent(() => import("./pages/ContentOrchestratorPage"));
const BrandOnboardingPage = lazyRouteComponent(() => import("./pages/BrandOnboardingPage"));
const SocialContentCalendarPage = lazyRouteComponent(() => import("./pages/SocialContentCalendarPage"));
const PlatformContentPage = lazyRouteComponent(() => import("./pages/PlatformContentPage"));
const PerformanceReviewPage = lazyRouteComponent(() => import("./pages/PerformanceReviewPage"));
const RankedDispatchPage = lazyRouteComponent(() => import("./pages/RankedDispatchPage"));
const LocalSEOAuditPage = lazyRouteComponent(() => import("./pages/LocalSEOAuditPage"));
const ReviewManagementPage = lazyRouteComponent(() => import("./pages/ReviewManagementPage"));
const GBPPostDraftPage = lazyRouteComponent(() => import("./pages/GBPPostDraftPage"));

function ServicesDemoRedirect() {
  const search = useSearch({ from: "/services-demo" }) as Record<string, string>;
  const niche = search.niche;
  const to = niche ? `/demo?niche=${niche}` : "/demo";
  return <Navigate to={to as any} replace />;
}

function UnifiedDemoRedirect() {
  return <Navigate to="/demo" replace />;
}

function ActorBridge() {
  const { actor } = useActor();
  useEffect(() => {
    if (!actor) return;
    setBackendActor({
      getCachedAudio: (key: string) => actor.getCachedAudio(key) as Promise<string | null>,
      setCachedAudio: (key: string, base64Audio: string) => actor.setCachedAudio(key, base64Audio) as Promise<void>,
    });
  }, [actor]);
  return null;
}

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isLoggedIn, isAdminUser, isSuperAdmin } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdminUser && !isSuperAdmin) return <Navigate to="/dashboard" replace />;
  return <AppLayout>{children}</AppLayout>;
}

const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <CredentialsProvider>
        <ActorBridge />
        <ErrorBoundary><Outlet /></ErrorBoundary>
        <WeeklyReportPanel />
        <Toaster />
      </CredentialsProvider>
    </AppProvider>
  ),
});

const simple = <TPath extends string>(path: TPath, Component: React.ComponentType) => createRoute({
  getParentRoute: () => rootRoute,
  path,
  component: () => <Component />,
});
const protectedPage = <TPath extends string>(path: TPath, Component: React.ComponentType, adminOnly = false) => createRoute({
  getParentRoute: () => rootRoute,
  path,
  component: () => <ProtectedRoute adminOnly={adminOnly}><Component /></ProtectedRoute>,
});

const indexRoute = simple("/", HomePage);
const loginRoute = simple("/login", LoginPage);
const onboardingRoute = simple("/onboarding", OnboardingWizardPage);
const demoLoginRoute = simple("/demo-login", DemoLoginPage);
const freeAuditRoute = simple("/free-audit", FreeAuditPage);
const demoRoute = simple("/demo", DemoPage);
const servicesDemoRoute = simple("/services-demo", ServicesDemoRedirect);
const unifiedDemoRoute = simple("/unified-demo", UnifiedDemoRedirect);
const whyUsRoute = simple("/why-us", WhyUsPage);
const plumbingRoute = simple("/plumbing", PlumbingPage);
const restorationRoute = simple("/restoration", RestorationPage);
const hvacRoute = simple("/hvac", HVACPage);
const carpetCleaningRoute = simple("/carpet-cleaning", CarpetCleaningPage);
const roofingRoute = simple("/roofing", RoofingPage);
const roofingPlaybookTripwireRoute = simple("/roofing-ai-growth-playbook", RoofingPlaybookTripwirePage);
const medSpaRoute = simple("/med-spa", MedSpaPage);
const realEstateRoute = simple("/real-estate", RealEstatePage);
const mortgageRoute = simple("/mortgage", MortgagePage);
const chiropractorRoute = simple("/chiropractor", ChiropractorPage);
const dentalRoute = simple("/dental", DentalPage);
const pricingRoute = simple("/pricing", PricingPage);

const dashboardRoute = protectedPage("/dashboard", DashboardPage);
const leadsRoute = protectedPage("/leads", LeadsPage);
const reviewsRoute = protectedPage("/reviews", ReviewsPage);
const auditRoute = protectedPage("/audit", AuditPage);
const fundabilityRoute = protectedPage("/fundability", FundabilityPage);
const reportsRoute = protectedPage("/reports", ReportsPage);
const analyticsRoute = protectedPage("/analytics", AnalyticsPage);
const settingsRoute = protectedPage("/settings", SettingsPage);
const adminRoute = protectedPage("/admin", AdminPage, true);
const adminAgentsRoute = protectedPage("/admin-agents", AdminAgentServicesPage, true);
const agentServicesRoute = protectedPage("/agent-services", AgentServicesPage);
const billingRoute = protectedPage("/billing", BillingPortalPage);
const chatWidgetRoute = protectedPage("/chat-widget", ChatWidgetPage);
const voiceAgentRoute = protectedPage("/voice-agent", VoiceAgentPage);
const callLogRoute = protectedPage("/call-log", CallLogPage);
const smsInboxRoute = protectedPage("/sms-inbox", SmsInboxPage);
const reviewRequestsRoute = protectedPage("/review-requests", ReviewRequestsPage);
const listingsRoute = protectedPage("/listings", ListingsPage);
const campaignsRoute = protectedPage("/campaigns", CampaignsPage);
const dripCampaignsRoute = protectedPage("/drip-campaigns", DripCampaignsPage, true);
const socialMediaRoute = protectedPage("/social-media", SocialMediaPage);
const socialROIRoute = protectedPage("/social-roi", SocialROIDashboardPage);
const socialContentGeneratorRoute = protectedPage("/social-content-generator", SocialContentGeneratorPage);
const socialSchedulerRoute = protectedPage("/social-scheduler", SocialSchedulerPage);
const socialEngagementAgentRoute = protectedPage("/social-engagement-agent", SocialEngagementAgentPage);
const socialProofPipelineRoute = protectedPage("/social-proof-pipeline", SocialProofPipelinePage);
const competitorIntelligenceRoute = protectedPage("/competitor-intelligence", CompetitorIntelligencePage);
const socialLeadCaptureRoute = protectedPage("/social-lead-capture", SocialLeadCapturePage);
const socialDemoFunnelRoute = protectedPage("/social-demo-funnel", SocialDemoFunnelPage);
const whiteLabelHubRoute = protectedPage("/white-label-hub", WhiteLabelHubPage, true);
const seoGeoAgentRoute = protectedPage("/seo-geo-agent", SeoGeoAgentPage);
const paidAdsAgentRoute = protectedPage("/paid-ads-agent", PaidAdsAgentPage);
const websiteAgentRoute = protectedPage("/website-agent", WebsiteAgentPage);
const agencyOnboardingRoute = simple("/agency-onboarding", AgencyOnboardingPage);
const agencyPartnersRoute = simple("/agency-partners", AgencyPartnersPage);
const agentWorkflowOSRoute = protectedPage("/agent-workflow-os", AgentWorkflowOSPage, true);
const outreachAgentRoute = protectedPage("/outreach-agent", OutreachAgentPage, true);
const openLeadLakeRoute = protectedPage("/open-lead-lake", OpenLeadLakePage, true);
const scraperToolRoute = protectedPage("/scraper-tool", ScraperToolPage, true);
const csvLeadImportRoute = protectedPage("/csv-lead-import", CsvLeadImportPage, true);
const gbpManagementRoute = protectedPage("/gbp-management", GbpManagementPage);
const landingPagesRoute = protectedPage("/landing-pages", LandingPageBuilderPage);
const nicheWebsiteStudioRoute = protectedPage("/website-studio", NicheWebsiteStudioPage, true);
const websiteAgentSettingsRoute = protectedPage("/website-agent-settings", WebsiteAgentSettingsPage, true);
const nicheWebsitePreviewRoute = simple("/preview/$previewId", NicheWebsitePreviewPage);
const clientMyWebsiteRoute = protectedPage("/my-website", ClientMyWebsitePage);
const clientReportsRoute = protectedPage("/client-reports", ClientReportsPage);
const healthDashboardRoute = protectedPage("/health-dashboard", ClientHealthDashboardPage, true);
const estimatesRoute = protectedPage("/estimates", EstimatesPage);
const appointmentsRoute = protectedPage("/appointments", AppointmentsPage);
const reputationInboxRoute = protectedPage("/reputation-inbox", ReputationInboxPage);
const competitiveIntelRoute = protectedPage("/competitive-intel", CompetitiveIntelPage);
const multiLocationRoute = protectedPage("/multi-location", MultiLocationPage);
const leadAttributionRoute = protectedPage("/lead-attribution", LeadAttributionPage);
const goLiveRoute = protectedPage("/go-live", GoLivePage);
const leadEngineRoute = protectedPage("/lead-engine", LeadEnginePage);
const webhookInboxRoute = protectedPage("/webhook-inbox", WebhookInboxPage);
const autopilotDashboardRoute = protectedPage("/autopilot-dashboard", AutopilotDashboardPage, true);
const brandKitRoute = simple("/brand-kit", BrandKitIntakePage);
const setupRoute = simple("/setup", SetupPage);
const brandKitSlugRoute = simple("/brand-kit/$slug", BrandKitLandingPage);
const brandKitTrialRoute = simple("/brand-kit/$slug/trial", BrandKitTrialDashboardPage);
const adminBrandKitTrialsRoute = protectedPage("/admin/brand-kit-trials", AdminBrandKitTrialsPage, true);
const adminBrfVoiceAgentRoute = protectedPage("/admin/brf-voice-agent", AdminBrfVoiceAgentPage, true);
const adminTrialsRoute = protectedPage("/admin/trials", AdminTrialsPage, true);
const aiLeadIntelligenceRoute = protectedPage("/ai-lead-intelligence", AILeadIntelligencePage, true);
const agentOrchestrationRoute = protectedPage("/agent-orchestration", AgentOrchestrationPage, true);
const adminChatAgentRoute = protectedPage("/admin-chat-agent", AdminChatAgentPage, true);
const adminVoicePreviewRoute = protectedPage("/admin/voice-preview", VoiceAgentPreviewPage, true);
const domainSetupRoute = protectedPage("/domain-setup", DomainSetupPage, true);
const bookedCenterRoute = simple("/booked-center", BookedCenterPage);
const rankedCenterRoute = simple("/ranked-center", RankedCenterPage);
const fundedCenterRoute = simple("/funded-center", FundedCenterPage);
const approvalQueueRoute = simple("/approval-queue", ApprovalQueuePage);
const workflowLogsRoute = simple("/workflow-logs", WorkflowLogsPage);
const crmPipelineRoute = protectedPage("/crm-pipeline", CrmPipelinePage);
const replyInboxRoute = protectedPage("/reply-inbox", ReplyIntelligenceInboxPage, true);
const smsAutopilotRoute = protectedPage("/sms-autopilot", SmsAutopilotPage, true);
const scanner3dRoute = protectedPage("/scanner-3d", Scanner3DPage);
const newslettersRoute = protectedPage("/newsletters", NewslettersPage, true);
const outreachAnalyticsRoute = protectedPage("/outreach-analytics", OutreachAnalyticsPage, true);
const public3dViewerRoute = simple("/view-3d/$modelId", Public3DViewerPage);
const adminVoiceManagerRoute = protectedPage("/admin-voice-manager", AdminVoiceManagerPage, true);
const adminCommandCenterRoute = protectedPage("/admin-command-center", AdminCommandCenterPage, true);
const outreachPipelineRoute = protectedPage("/outreach-pipeline", OutreachPipelinePage, true);
const adminAIChatRoute = protectedPage("/admin-ai-chat", AdminAIChatPage, true);
const featureToggleRoute = protectedPage("/admin/feature-toggles", FeatureTogglePage, true);
const integrationHealthRoute = protectedPage("/admin/integration-health", IntegrationHealthPage, true);
const nicheAnalyticsRoute = protectedPage("/admin/niche-analytics", NicheAnalyticsPage, true);
const adminAIProviderRoute = protectedPage("/admin/ai-providers", AdminAIProviderPage, true);
const adminCollectionManagerRoute = protectedPage("/admin/knowledge-collections", AdminCollectionManagerPage, true);
const adminRAGChatTesterRoute = protectedPage("/admin/rag-tester", AdminRAGChatTesterPage, true);
const adminAgentWorkflowRunnerRoute = protectedPage("/admin/agent-workflows", AdminAgentWorkflowRunnerPage, true);
const adminWorkflowLibraryRoute = protectedPage("/admin/workflow-library", AdminWorkflowLibraryPage, true);
const adminN8NMigrationRoute = protectedPage("/admin/n8n-migration", AdminN8NMigrationPage, true);
const adminN8NIntegrationDocsRoute = protectedPage("/admin/n8n-integration-docs", N8NIntegrationDocsPage, true);
const adminAIUsageLogsRoute = protectedPage("/admin/ai-usage-logs", AdminAIUsageLogsPage, true);
const adminVectorIndexRoute = protectedPage("/admin/vector-index", AdminVectorIndexPage, true);
const adminClientAIManagerRoute = protectedPage("/admin/client-ai-manager", AdminClientAIManagerPage, true);
const clientAskAIRoute = protectedPage("/ask-ai", ClientAskAIPage);
const clientAskAboutBusinessRoute = protectedPage("/ask-about-business", ClientAskAboutBusinessPage);
const clientAIReportsRoute = protectedPage("/ai-reports", ClientAIReportsPage);
const clientAIRecommendationsRoute = protectedPage("/ai-recommendations", ClientAIRecommendationsPage);
const clientUploadedDocsRoute = protectedPage("/my-documents", ClientUploadedDocsPage);
const clientWorkflowAgentRoute = protectedPage("/workflow-agent", ClientWorkflowAgentPage);
const adminMCPToolkitRoute = protectedPage("/admin/mcp-toolkit", AdminMCPToolkitPage, true);
const accountBriefRoute = protectedPage("/admin/account-brief", AccountBriefPage);
const composioToolConnectRoute = protectedPage("/tools/connect", ComposioToolConnectPage);
const roofingAutomationsRoute = protectedPage("/admin/roofing-automations", RoofingAutomationsPage, true);
const voiceAgentStudioRoute = protectedPage("/voice-agent-studio", VoiceAgentStudioPage);
const contentCreationStudioRoute = protectedPage("/content-creation-studio", ContentCreationStudioPage);
const localRankingIntelligenceRoute = protectedPage("/local-ranking-intelligence", LocalRankingIntelligence);
const roofingCampaignRoute = protectedPage("/admin/roofing-campaign", RoofingCampaignManager, true);
const roofingCampaignCommandCenterRoute = protectedPage("/admin/roofing-command-center", RoofingCampaignCommandCenterPage, true);
const rooferCampaignRoute = protectedPage("/roofer-campaign", RooferCampaignPage, true);
const demoBookingRoute = simple("/demo/$ctaToken", DemoBookingPage);
const masterAgentRoute = protectedPage("/admin/master-agent", MasterAgentPage, true);
const contentOrchestratorRoute = protectedPage("/content-orchestrator", ContentOrchestratorPage);
const brandOnboardingRoute = protectedPage("/brand-onboarding", BrandOnboardingPage);
const socialContentCalendarRoute = protectedPage("/social-content-calendar", SocialContentCalendarPage);
const platformContentRoute = protectedPage("/platform-content", PlatformContentPage);
const performanceReviewRoute = protectedPage("/performance-review", PerformanceReviewPage);
const rankedDispatchRoute = protectedPage("/ranked-dispatch", RankedDispatchPage);
const localSEOAuditRoute = protectedPage("/local-seo-audit", LocalSEOAuditPage);
const reviewManagementRoute = protectedPage("/review-management", ReviewManagementPage);
const gbpPostDraftRoute = protectedPage("/gbp-post-drafts", GBPPostDraftPage);
const aiAuditCenterRoute = protectedPage("/ai-audit-center", AIAuditCenterPage);

const routeTree = rootRoute.addChildren([
  indexRoute, loginRoute, onboardingRoute, demoLoginRoute, freeAuditRoute, demoRoute,
  unifiedDemoRoute, servicesDemoRoute, whyUsRoute, plumbingRoute, restorationRoute,
  hvacRoute, carpetCleaningRoute, roofingRoute, roofingPlaybookTripwireRoute, medSpaRoute, realEstateRoute,
  mortgageRoute, chiropractorRoute, dentalRoute, pricingRoute, dashboardRoute,
  leadsRoute, reviewsRoute, auditRoute, fundabilityRoute, reportsRoute, analyticsRoute,
  settingsRoute, adminRoute, adminAgentsRoute, agentServicesRoute, billingRoute,
  chatWidgetRoute, voiceAgentRoute, callLogRoute, smsInboxRoute, reviewRequestsRoute,
  listingsRoute, socialMediaRoute, socialROIRoute, socialContentGeneratorRoute,
  socialSchedulerRoute, socialEngagementAgentRoute, socialProofPipelineRoute,
  competitorIntelligenceRoute, socialLeadCaptureRoute, socialDemoFunnelRoute,
  campaignsRoute, dripCampaignsRoute, whiteLabelHubRoute, agencyOnboardingRoute,
  agentWorkflowOSRoute, seoGeoAgentRoute, paidAdsAgentRoute, websiteAgentRoute,
  outreachAgentRoute, openLeadLakeRoute, csvLeadImportRoute, gbpManagementRoute,
  landingPagesRoute, nicheWebsiteStudioRoute, clientMyWebsiteRoute,
  websiteAgentSettingsRoute, nicheWebsitePreviewRoute, clientReportsRoute,
  healthDashboardRoute, estimatesRoute, appointmentsRoute, reputationInboxRoute,
  competitiveIntelRoute, multiLocationRoute, leadAttributionRoute,
  autopilotDashboardRoute, goLiveRoute, leadEngineRoute, webhookInboxRoute,
  brandKitRoute, setupRoute, brandKitSlugRoute, brandKitTrialRoute,
  adminBrandKitTrialsRoute, adminBrfVoiceAgentRoute, adminTrialsRoute,
  agencyPartnersRoute, aiLeadIntelligenceRoute, agentOrchestrationRoute,
  adminChatAgentRoute, adminVoicePreviewRoute, domainSetupRoute, bookedCenterRoute,
  rankedCenterRoute, fundedCenterRoute, approvalQueueRoute, workflowLogsRoute,
  crmPipelineRoute, replyInboxRoute, smsAutopilotRoute, scanner3dRoute,
  public3dViewerRoute, newslettersRoute, outreachAnalyticsRoute, scraperToolRoute,
  adminVoiceManagerRoute, adminCommandCenterRoute, outreachPipelineRoute,
  adminAIChatRoute, featureToggleRoute, integrationHealthRoute, nicheAnalyticsRoute,
  adminAIProviderRoute, adminCollectionManagerRoute, adminRAGChatTesterRoute,
  adminAgentWorkflowRunnerRoute, adminWorkflowLibraryRoute, adminN8NMigrationRoute,
  adminN8NIntegrationDocsRoute, adminAIUsageLogsRoute, adminVectorIndexRoute,
  adminClientAIManagerRoute, clientAskAIRoute, clientAskAboutBusinessRoute,
  clientAIReportsRoute, clientAIRecommendationsRoute, clientUploadedDocsRoute,
  clientWorkflowAgentRoute, adminMCPToolkitRoute, accountBriefRoute,
  composioToolConnectRoute, roofingAutomationsRoute, masterAgentRoute,
  voiceAgentStudioRoute, contentCreationStudioRoute, localRankingIntelligenceRoute,
  roofingCampaignRoute, roofingCampaignCommandCenterRoute, rooferCampaignRoute,
  demoBookingRoute, contentOrchestratorRoute, brandOnboardingRoute,
  socialContentCalendarRoute, platformContentRoute, performanceReviewRoute,
  rankedDispatchRoute, localSEOAuditRoute, reviewManagementRoute,
  gbpPostDraftRoute, aiAuditCenterRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router; }
}

export default function App() {
  return <RouterProvider router={router} />;
}
