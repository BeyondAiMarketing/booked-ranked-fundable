/**
 * App routes — authenticated user-facing feature pages.
 * These routes require login but are not admin-only.
 */
import { createRoute } from "@tanstack/react-router";
import type { AnyRoute } from "@tanstack/react-router";
import AgentServicesPage from "../pages/AgentServicesPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import AppointmentsPage from "../pages/AppointmentsPage";
import AuditPage from "../pages/AuditPage";
import BillingPortalPage from "../pages/BillingPortalPage";
import CallLogPage from "../pages/CallLogPage";
import CampaignsPage from "../pages/CampaignsPage";
import ChatWidgetPage from "../pages/ChatWidgetPage";
import ClientMyWebsitePage from "../pages/ClientMyWebsitePage";
import ClientReportsPage from "../pages/ClientReportsPage";
import CompetitiveIntelPage from "../pages/CompetitiveIntelPage";
import CrmPipelinePage from "../pages/CrmPipelinePage";
import DashboardPage from "../pages/DashboardPage";
import EstimatesPage from "../pages/EstimatesPage";
import FundabilityPage from "../pages/FundabilityPage";
import GbpManagementPage from "../pages/GbpManagementPage";
import GoLivePage from "../pages/GoLivePage";
import LandingPageBuilderPage from "../pages/LandingPageBuilderPage";
import LeadAttributionPage from "../pages/LeadAttributionPage";
import LeadsPage from "../pages/LeadsPage";
import ListingsPage from "../pages/ListingsPage";
import MultiLocationPage from "../pages/MultiLocationPage";
import PaidAdsAgentPage from "../pages/PaidAdsAgentPage";
import ReportsPage from "../pages/ReportsPage";
import ReputationInboxPage from "../pages/ReputationInboxPage";
import ReviewRequestsPage from "../pages/ReviewRequestsPage";
import ReviewsPage from "../pages/ReviewsPage";
import Scanner3DPage from "../pages/Scanner3DPage";
import SeoGeoAgentPage from "../pages/SeoGeoAgentPage";
import SettingsPage from "../pages/SettingsPage";
import SmsInboxPage from "../pages/SmsInboxPage";
import VoiceAgentPage from "../pages/VoiceAgentPage";
import WebsiteAgentPage from "../pages/WebsiteAgentPage";
import type { ProtectedRouteWrapper } from "./types";

export function buildAppRoutes(
  rootRoute: AnyRoute,
  Protected: ProtectedRouteWrapper,
) {
  return [
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/dashboard",
      component: () => (
        <Protected>
          <DashboardPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/leads",
      component: () => (
        <Protected>
          <LeadsPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/reviews",
      component: () => (
        <Protected>
          <ReviewsPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/audit",
      component: () => (
        <Protected>
          <AuditPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/fundability",
      component: () => (
        <Protected>
          <FundabilityPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/reports",
      component: () => (
        <Protected>
          <ReportsPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/analytics",
      component: () => (
        <Protected>
          <AnalyticsPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/settings",
      component: () => (
        <Protected>
          <SettingsPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/agent-services",
      component: () => (
        <Protected>
          <AgentServicesPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/billing",
      component: () => (
        <Protected>
          <BillingPortalPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/chat-widget",
      component: () => (
        <Protected>
          <ChatWidgetPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/voice-agent",
      component: () => (
        <Protected>
          <VoiceAgentPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/call-log",
      component: () => (
        <Protected>
          <CallLogPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/sms-inbox",
      component: () => (
        <Protected>
          <SmsInboxPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/review-requests",
      component: () => (
        <Protected>
          <ReviewRequestsPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/listings",
      component: () => (
        <Protected>
          <ListingsPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/campaigns",
      component: () => (
        <Protected>
          <CampaignsPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/gbp-management",
      component: () => (
        <Protected>
          <GbpManagementPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/landing-pages",
      component: () => (
        <Protected>
          <LandingPageBuilderPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/my-website",
      component: () => (
        <Protected>
          <ClientMyWebsitePage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/client-reports",
      component: () => (
        <Protected>
          <ClientReportsPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/estimates",
      component: () => (
        <Protected>
          <EstimatesPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/appointments",
      component: () => (
        <Protected>
          <AppointmentsPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/reputation-inbox",
      component: () => (
        <Protected>
          <ReputationInboxPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/competitive-intel",
      component: () => (
        <Protected>
          <CompetitiveIntelPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/multi-location",
      component: () => (
        <Protected>
          <MultiLocationPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/lead-attribution",
      component: () => (
        <Protected>
          <LeadAttributionPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/go-live",
      component: () => (
        <Protected>
          <GoLivePage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/crm-pipeline",
      component: () => (
        <Protected>
          <CrmPipelinePage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/scanner-3d",
      component: () => (
        <Protected>
          <Scanner3DPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/website-agent",
      component: () => (
        <Protected>
          <WebsiteAgentPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/paid-ads-agent",
      component: () => (
        <Protected>
          <PaidAdsAgentPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/seo-geo-agent",
      component: () => (
        <Protected>
          <SeoGeoAgentPage />
        </Protected>
      ),
    }),
  ];
}
