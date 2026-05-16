import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useSearch,
} from "@tanstack/react-router";
import { lazy, useEffect } from "react";
import AppLayout from "./components/AppLayout";
import WeeklyReportPanel from "./components/WeeklyReportPanel";
import { Toaster } from "./components/ui/sonner";
import { AppProvider, useApp } from "./context/AppContext";
import { CredentialsProvider } from "./context/CredentialsContext";
import { useActor } from "./hooks/useActor";
import AILeadIntelligencePage from "./pages/AILeadIntelligencePage";
import AdminAgentServicesPage from "./pages/AdminAgentServicesPage";
import AdminBrandKitTrialsPage from "./pages/AdminBrandKitTrialsPage";
import AdminBrfVoiceAgentPage from "./pages/AdminBrfVoiceAgentPage";
import AdminChatAgentPage from "./pages/AdminChatAgentPage";
import AdminPage from "./pages/AdminPage";
import AgencyOnboardingPage from "./pages/AgencyOnboardingPage";
import AgencyPartnersPage from "./pages/AgencyPartnersPage";
import AgentServicesPage from "./pages/AgentServicesPage";
import AgentWorkflowOSPage from "./pages/AgentWorkflowOSPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AuditPage from "./pages/AuditPage";
import AutopilotDashboardPage from "./pages/AutopilotDashboardPage";
import BillingPortalPage from "./pages/BillingPortalPage";
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
import FreeAuditPage from "./pages/FreeAuditPage";
import FundabilityPage from "./pages/FundabilityPage";
import GbpManagementPage from "./pages/GbpManagementPage";
import GoLivePage from "./pages/GoLivePage";
import HVACPage from "./pages/HVACPage";
import HomePage from "./pages/HomePage";
import LandingPageBuilderPage from "./pages/LandingPageBuilderPage";
import LeadAttributionPage from "./pages/LeadAttributionPage";
import LeadsPage from "./pages/LeadsPage";
import ListingsPage from "./pages/ListingsPage";
import LoginPage from "./pages/LoginPage";
import MedSpaPage from "./pages/MedSpaPage";
import MortgagePage from "./pages/MortgagePage";
import MultiLocationPage from "./pages/MultiLocationPage";
import NicheWebsitePreviewPage from "./pages/NicheWebsitePreviewPage";
import NicheWebsiteStudioPage from "./pages/NicheWebsiteStudioPage";
import OnboardingWizardPage from "./pages/OnboardingWizardPage";
import OpenLeadLakePage from "./pages/OpenLeadLakePage";
import OutreachAgentPage from "./pages/OutreachAgentPage";
import PaidAdsAgentPage from "./pages/PaidAdsAgentPage";
import PlumbingPage from "./pages/PlumbingPage";
import PricingPage from "./pages/PricingPage";
import Public3DViewerPage from "./pages/Public3DViewerPage";
import RealEstatePage from "./pages/RealEstatePage";
import ReplyIntelligenceInboxPage from "./pages/ReplyIntelligenceInboxPage";
import ReportsPage from "./pages/ReportsPage";
import ReputationInboxPage from "./pages/ReputationInboxPage";
import RestorationPage from "./pages/RestorationPage";
import ReviewRequestsPage from "./pages/ReviewRequestsPage";
import ReviewsPage from "./pages/ReviewsPage";
import RoofingPage from "./pages/RoofingPage";
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
import WebsiteAgentPage from "./pages/WebsiteAgentPage";
import WebsiteAgentSettingsPage from "./pages/WebsiteAgentSettingsPage";
import WhiteLabelHubPage from "./pages/WhiteLabelHubPage";
import WhyUsPage from "./pages/WhyUsPage";
import { setBackendActor } from "./services/audioService";

// ─── Newsletter & Outreach Analytics (lazy loaded) ────────────────────────────
const NewslettersPage = lazy(() => import("./pages/NewslettersPage"));
const ScraperToolPage = lazy(() => import("./pages/ScraperToolPage"));
const OutreachAnalyticsPage = lazy(
  () => import("./pages/OutreachAnalyticsPage"),
);

// ─── New social pages (lazy loaded for code splitting) ────────────────────────
const SocialContentGeneratorPage = lazy(
  () => import("./pages/SocialContentGeneratorPage"),
);
const SocialSchedulerPage = lazy(() => import("./pages/SocialSchedulerPage"));
const SocialEngagementAgentPage = lazy(
  () => import("./pages/SocialEngagementAgentPage"),
);
const SocialProofPipelinePage = lazy(
  () => import("./pages/SocialProofPipelinePage"),
);
const CompetitorIntelligencePage = lazy(
  () => import("./pages/CompetitorIntelligencePage"),
);
const SocialLeadCapturePage = lazy(
  () => import("./pages/SocialLeadCapturePage"),
);
const SocialDemoFunnelPage = lazy(() => import("./pages/SocialDemoFunnelPage"));

// Redirect components for archived demo routes
function ServicesDemoRedirect() {
  const search = useSearch({ from: "/services-demo" }) as Record<
    string,
    string
  >;
  const niche = search.niche;
  const to = niche ? `/demo?niche=${niche}` : "/demo";
  return <Navigate to={to as any} replace />;
}

function UnifiedDemoRedirect() {
  return <Navigate to="/demo" replace />;
}

/**
 * ActorBridge — wires the backend actor into audioService once available.
 * Renders nothing; lives inside the root layout to get actor access.
 * Registered once at root so setBackendActor is called exactly once per session.
 */
function ActorBridge() {
  const { actor } = useActor();
  useEffect(() => {
    if (!actor) return;
    setBackendActor({
      getCachedAudio: (key: string) =>
        actor.getCachedAudio(key) as Promise<string | null>,
      setCachedAudio: (key: string, base64Audio: string) =>
        actor.setCachedAudio(key, base64Audio) as Promise<void>,
    });
  }, [actor]);
  return null;
}

function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { isLoggedIn, isAdminUser, isSuperAdmin } = useApp();
  if (!isLoggedIn) {
    window.location.replace("/login");
    return null;
  }
  // Super admin has access to everything — never redirect them
  if (adminOnly && !isAdminUser && !isSuperAdmin) {
    window.location.replace("/dashboard");
    return null;
  }
  return <AppLayout>{children}</AppLayout>;
}

const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <CredentialsProvider>
        <ActorBridge />
        <Outlet />
        <WeeklyReportPanel />
        <Toaster />
      </CredentialsProvider>
    </AppProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingWizardPage,
});
const demoLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/demo-login",
  component: DemoLoginPage,
});
const freeAuditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/free-audit",
  component: FreeAuditPage,
});
const demoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/demo",
  component: DemoPage,
});
const servicesDemoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services-demo",
  component: ServicesDemoRedirect,
});
const unifiedDemoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/unified-demo",
  component: UnifiedDemoRedirect,
});
const whyUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/why-us",
  component: WhyUsPage,
});
const plumbingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/plumbing",
  component: PlumbingPage,
});
const restorationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restoration",
  component: RestorationPage,
});
const hvacRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hvac",
  component: HVACPage,
});
const carpetCleaningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carpet-cleaning",
  component: CarpetCleaningPage,
});
const roofingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/roofing",
  component: RoofingPage,
});
const medSpaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/med-spa",
  component: MedSpaPage,
});
const realEstateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/real-estate",
  component: RealEstatePage,
});
const mortgageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mortgage",
  component: MortgagePage,
});
const chiropractorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chiropractor",
  component: ChiropractorPage,
});
const dentalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dental",
  component: DentalPage,
});
const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: PricingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});
const leadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leads",
  component: () => (
    <ProtectedRoute>
      <LeadsPage />
    </ProtectedRoute>
  ),
});
const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reviews",
  component: () => (
    <ProtectedRoute>
      <ReviewsPage />
    </ProtectedRoute>
  ),
});
const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/audit",
  component: () => (
    <ProtectedRoute>
      <AuditPage />
    </ProtectedRoute>
  ),
});
const fundabilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fundability",
  component: () => (
    <ProtectedRoute>
      <FundabilityPage />
    </ProtectedRoute>
  ),
});
const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: () => (
    <ProtectedRoute>
      <ReportsPage />
    </ProtectedRoute>
  ),
});
const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: () => (
    <ProtectedRoute>
      <AnalyticsPage />
    </ProtectedRoute>
  ),
});
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  ),
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <ProtectedRoute adminOnly>
      <AdminPage />
    </ProtectedRoute>
  ),
});
const adminAgentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-agents",
  component: () => (
    <ProtectedRoute adminOnly>
      <AdminAgentServicesPage />
    </ProtectedRoute>
  ),
});
const agentServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agent-services",
  component: () => (
    <ProtectedRoute>
      <AgentServicesPage />
    </ProtectedRoute>
  ),
});
const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/billing",
  component: () => (
    <ProtectedRoute>
      <BillingPortalPage />
    </ProtectedRoute>
  ),
});
const chatWidgetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat-widget",
  component: () => (
    <ProtectedRoute>
      <ChatWidgetPage />
    </ProtectedRoute>
  ),
});
const voiceAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/voice-agent",
  component: () => (
    <ProtectedRoute>
      <VoiceAgentPage />
    </ProtectedRoute>
  ),
});
const callLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/call-log",
  component: () => (
    <ProtectedRoute>
      <CallLogPage />
    </ProtectedRoute>
  ),
});

const smsInboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sms-inbox",
  component: () => (
    <ProtectedRoute>
      <SmsInboxPage />
    </ProtectedRoute>
  ),
});
const reviewRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/review-requests",
  component: () => (
    <ProtectedRoute>
      <ReviewRequestsPage />
    </ProtectedRoute>
  ),
});
const listingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/listings",
  component: () => (
    <ProtectedRoute>
      <ListingsPage />
    </ProtectedRoute>
  ),
});
const campaignsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/campaigns",
  component: () => (
    <ProtectedRoute>
      <CampaignsPage />
    </ProtectedRoute>
  ),
});

const dripCampaignsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/drip-campaigns",
  component: () => (
    <ProtectedRoute adminOnly>
      <DripCampaignsPage />
    </ProtectedRoute>
  ),
});

const socialMediaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-media",
  component: () => (
    <ProtectedRoute>
      <SocialMediaPage />
    </ProtectedRoute>
  ),
});

const socialROIRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-roi",
  component: () => (
    <ProtectedRoute>
      <SocialROIDashboardPage />
    </ProtectedRoute>
  ),
});

// ─── New social feature routes (additive — existing routes untouched) ──────────

const socialContentGeneratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-content-generator",
  component: () => (
    <ProtectedRoute>
      <SocialContentGeneratorPage />
    </ProtectedRoute>
  ),
});

const socialSchedulerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-scheduler",
  component: () => (
    <ProtectedRoute>
      <SocialSchedulerPage />
    </ProtectedRoute>
  ),
});

const socialEngagementAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-engagement-agent",
  component: () => (
    <ProtectedRoute>
      <SocialEngagementAgentPage />
    </ProtectedRoute>
  ),
});

const socialProofPipelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-proof-pipeline",
  component: () => (
    <ProtectedRoute>
      <SocialProofPipelinePage />
    </ProtectedRoute>
  ),
});

const competitorIntelligenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/competitor-intelligence",
  component: () => (
    <ProtectedRoute>
      <CompetitorIntelligencePage />
    </ProtectedRoute>
  ),
});

const socialLeadCaptureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-lead-capture",
  component: () => (
    <ProtectedRoute>
      <SocialLeadCapturePage />
    </ProtectedRoute>
  ),
});

const socialDemoFunnelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-demo-funnel",
  component: () => (
    <ProtectedRoute>
      <SocialDemoFunnelPage />
    </ProtectedRoute>
  ),
});

// ─── End new social routes ─────────────────────────────────────────────────────

const whiteLabelHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/white-label-hub",
  component: () => (
    <ProtectedRoute adminOnly>
      <WhiteLabelHubPage />
    </ProtectedRoute>
  ),
});

const seoGeoAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seo-geo-agent",
  component: () => (
    <ProtectedRoute>
      <SeoGeoAgentPage />
    </ProtectedRoute>
  ),
});

const paidAdsAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/paid-ads-agent",
  component: () => (
    <ProtectedRoute>
      <PaidAdsAgentPage />
    </ProtectedRoute>
  ),
});

const websiteAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/website-agent",
  component: () => (
    <ProtectedRoute>
      <WebsiteAgentPage />
    </ProtectedRoute>
  ),
});

const agencyOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agency-onboarding",
  component: AgencyOnboardingPage,
});

const agencyPartnersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agency-partners",
  component: AgencyPartnersPage,
});

const agentWorkflowOSRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agent-workflow-os",
  component: () => (
    <ProtectedRoute adminOnly>
      <AgentWorkflowOSPage />
    </ProtectedRoute>
  ),
});

const outreachAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/outreach-agent",
  component: () => (
    <ProtectedRoute adminOnly>
      <OutreachAgentPage />
    </ProtectedRoute>
  ),
});

const openLeadLakeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/open-lead-lake",
  component: () => (
    <ProtectedRoute adminOnly>
      <OpenLeadLakePage />
    </ProtectedRoute>
  ),
});

const scraperToolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scraper-tool",
  component: () => (
    <ProtectedRoute adminOnly>
      <ScraperToolPage />
    </ProtectedRoute>
  ),
});

const csvLeadImportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/csv-lead-import",
  component: () => (
    <ProtectedRoute adminOnly>
      <CsvLeadImportPage />
    </ProtectedRoute>
  ),
});

const gbpManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gbp-management",
  component: () => (
    <ProtectedRoute>
      <GbpManagementPage />
    </ProtectedRoute>
  ),
});

const landingPagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/landing-pages",
  component: () => (
    <ProtectedRoute>
      <LandingPageBuilderPage />
    </ProtectedRoute>
  ),
});

const nicheWebsiteStudioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/website-studio",
  component: () => (
    <ProtectedRoute adminOnly>
      <NicheWebsiteStudioPage />
    </ProtectedRoute>
  ),
});

const websiteAgentSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/website-agent-settings",
  component: () => (
    <ProtectedRoute adminOnly>
      <WebsiteAgentSettingsPage />
    </ProtectedRoute>
  ),
});

const nicheWebsitePreviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/preview/$previewId",
  component: NicheWebsitePreviewPage,
});

const clientMyWebsiteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-website",
  component: () => (
    <ProtectedRoute>
      <ClientMyWebsitePage />
    </ProtectedRoute>
  ),
});

const clientReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client-reports",
  component: () => (
    <ProtectedRoute>
      <ClientReportsPage />
    </ProtectedRoute>
  ),
});

const healthDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/health-dashboard",
  component: () => (
    <ProtectedRoute adminOnly>
      <ClientHealthDashboardPage />
    </ProtectedRoute>
  ),
});

const estimatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/estimates",
  component: () => (
    <ProtectedRoute>
      <EstimatesPage />
    </ProtectedRoute>
  ),
});

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/appointments",
  component: () => (
    <ProtectedRoute>
      <AppointmentsPage />
    </ProtectedRoute>
  ),
});

const reputationInboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reputation-inbox",
  component: () => (
    <ProtectedRoute>
      <ReputationInboxPage />
    </ProtectedRoute>
  ),
});

const competitiveIntelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/competitive-intel",
  component: () => (
    <ProtectedRoute>
      <CompetitiveIntelPage />
    </ProtectedRoute>
  ),
});

const multiLocationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/multi-location",
  component: () => (
    <ProtectedRoute>
      <MultiLocationPage />
    </ProtectedRoute>
  ),
});

const leadAttributionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lead-attribution",
  component: () => (
    <ProtectedRoute>
      <LeadAttributionPage />
    </ProtectedRoute>
  ),
});

const goLiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/go-live",
  component: () => (
    <ProtectedRoute>
      <GoLivePage />
    </ProtectedRoute>
  ),
});

const autopilotDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/autopilot-dashboard",
  component: () => (
    <ProtectedRoute adminOnly>
      <AutopilotDashboardPage />
    </ProtectedRoute>
  ),
});

const brandKitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/brand-kit",
  component: BrandKitIntakePage,
});

const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/setup",
  component: SetupPage,
});

const brandKitSlugRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/brand-kit/$slug",
  component: BrandKitLandingPage,
});

const brandKitTrialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/brand-kit/$slug/trial",
  component: BrandKitTrialDashboardPage,
});

const adminBrandKitTrialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/brand-kit-trials",
  component: () => (
    <ProtectedRoute adminOnly>
      <AdminBrandKitTrialsPage />
    </ProtectedRoute>
  ),
});

const adminBrfVoiceAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/brf-voice-agent",
  component: () => (
    <ProtectedRoute adminOnly>
      <AdminBrfVoiceAgentPage />
    </ProtectedRoute>
  ),
});

const aiLeadIntelligenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-lead-intelligence",
  component: () => (
    <ProtectedRoute adminOnly>
      <AILeadIntelligencePage />
    </ProtectedRoute>
  ),
});

const adminChatAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-chat-agent",
  component: () => (
    <ProtectedRoute adminOnly>
      <AdminChatAgentPage />
    </ProtectedRoute>
  ),
});

const adminVoicePreviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/voice-preview",
  component: () => (
    <ProtectedRoute adminOnly>
      <VoiceAgentPreviewPage />
    </ProtectedRoute>
  ),
});

const domainSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/domain-setup",
  component: () => (
    <ProtectedRoute adminOnly>
      <DomainSetupPage />
    </ProtectedRoute>
  ),
});

const crmPipelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/crm-pipeline",
  component: () => (
    <ProtectedRoute>
      <CrmPipelinePage />
    </ProtectedRoute>
  ),
});

const replyInboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reply-inbox",
  component: () => (
    <ProtectedRoute adminOnly>
      <ReplyIntelligenceInboxPage />
    </ProtectedRoute>
  ),
});

const smsAutopilotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sms-autopilot",
  component: () => (
    <ProtectedRoute adminOnly>
      <SmsAutopilotPage />
    </ProtectedRoute>
  ),
});

const scanner3dRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scanner-3d",
  component: () => (
    <ProtectedRoute>
      <Scanner3DPage />
    </ProtectedRoute>
  ),
});

const newslettersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/newsletters",
  component: () => (
    <ProtectedRoute adminOnly>
      <NewslettersPage />
    </ProtectedRoute>
  ),
});

const outreachAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/outreach-analytics",
  component: () => (
    <ProtectedRoute adminOnly>
      <OutreachAnalyticsPage />
    </ProtectedRoute>
  ),
});

const public3dViewerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/view-3d/$modelId",
  component: Public3DViewerPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  onboardingRoute,
  demoLoginRoute,
  freeAuditRoute,
  demoRoute,
  unifiedDemoRoute,
  servicesDemoRoute,
  whyUsRoute,
  plumbingRoute,
  restorationRoute,
  hvacRoute,
  carpetCleaningRoute,
  roofingRoute,
  medSpaRoute,
  realEstateRoute,
  mortgageRoute,
  chiropractorRoute,
  dentalRoute,
  pricingRoute,
  dashboardRoute,
  leadsRoute,
  reviewsRoute,
  auditRoute,
  fundabilityRoute,
  reportsRoute,
  analyticsRoute,
  settingsRoute,
  adminRoute,
  adminAgentsRoute,
  agentServicesRoute,
  billingRoute,
  chatWidgetRoute,
  voiceAgentRoute,
  callLogRoute,
  smsInboxRoute,
  reviewRequestsRoute,
  listingsRoute,
  socialMediaRoute,
  socialROIRoute,
  // New social feature routes (additive)
  socialContentGeneratorRoute,
  socialSchedulerRoute,
  socialEngagementAgentRoute,
  socialProofPipelineRoute,
  competitorIntelligenceRoute,
  socialLeadCaptureRoute,
  socialDemoFunnelRoute,
  campaignsRoute,
  dripCampaignsRoute,
  whiteLabelHubRoute,
  agencyOnboardingRoute,
  agentWorkflowOSRoute,
  seoGeoAgentRoute,
  paidAdsAgentRoute,
  websiteAgentRoute,
  outreachAgentRoute,
  openLeadLakeRoute,
  csvLeadImportRoute,
  gbpManagementRoute,
  landingPagesRoute,
  nicheWebsiteStudioRoute,
  clientMyWebsiteRoute,
  websiteAgentSettingsRoute,
  nicheWebsitePreviewRoute,
  clientReportsRoute,
  healthDashboardRoute,
  estimatesRoute,
  appointmentsRoute,
  reputationInboxRoute,
  competitiveIntelRoute,
  multiLocationRoute,
  leadAttributionRoute,
  autopilotDashboardRoute,
  goLiveRoute,
  brandKitRoute,
  setupRoute,
  brandKitSlugRoute,
  brandKitTrialRoute,
  adminBrandKitTrialsRoute,
  adminBrfVoiceAgentRoute,
  agencyPartnersRoute,
  aiLeadIntelligenceRoute,
  adminChatAgentRoute,
  adminVoicePreviewRoute,
  domainSetupRoute,
  crmPipelineRoute,
  replyInboxRoute,
  smsAutopilotRoute,
  scanner3dRoute,
  public3dViewerRoute,
  newslettersRoute,
  outreachAnalyticsRoute,
  scraperToolRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
