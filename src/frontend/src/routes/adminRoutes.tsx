/**
 * Admin routes — pages that require adminOnly access.
 * All routes in this module use ProtectedRoute with adminOnly=true.
 */
import { createRoute } from "@tanstack/react-router";
import type { AnyRoute } from "@tanstack/react-router";
import { lazy } from "react";
import type { ProtectedRouteWrapper } from "./types";
import AdminAgentServicesPage from "../pages/AdminAgentServicesPage";
import AdminBrandKitTrialsPage from "../pages/AdminBrandKitTrialsPage";
import AdminBrfVoiceAgentPage from "../pages/AdminBrfVoiceAgentPage";
import AdminChatAgentPage from "../pages/AdminChatAgentPage";
import AdminPage from "../pages/AdminPage";
import AgentWorkflowOSPage from "../pages/AgentWorkflowOSPage";
import AILeadIntelligencePage from "../pages/AILeadIntelligencePage";
import AutopilotDashboardPage from "../pages/AutopilotDashboardPage";
import ClientHealthDashboardPage from "../pages/ClientHealthDashboardPage";
import CsvLeadImportPage from "../pages/CsvLeadImportPage";
import DomainSetupPage from "../pages/DomainSetupPage";
import DripCampaignsPage from "../pages/DripCampaignsPage";
import NicheWebsiteStudioPage from "../pages/NicheWebsiteStudioPage";
import OpenLeadLakePage from "../pages/OpenLeadLakePage";
import OutreachAgentPage from "../pages/OutreachAgentPage";
import ReplyIntelligenceInboxPage from "../pages/ReplyIntelligenceInboxPage";
import SmsAutopilotPage from "../pages/SmsAutopilotPage";
import VoiceAgentPreviewPage from "../pages/VoiceAgentPreviewPage";
import WebsiteAgentSettingsPage from "../pages/WebsiteAgentSettingsPage";
import WhiteLabelHubPage from "../pages/WhiteLabelHubPage";

const NewslettersPage = lazy(() => import("../pages/NewslettersPage"));
const OutreachAnalyticsPage = lazy(() => import("../pages/OutreachAnalyticsPage"));
const ScraperToolPage = lazy(() => import("../pages/ScraperToolPage"));

export function buildAdminRoutes(rootRoute: AnyRoute, Protected: ProtectedRouteWrapper) {
  return [
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/admin",
      component: () => <Protected adminOnly><AdminPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/admin-agents",
      component: () => <Protected adminOnly><AdminAgentServicesPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/admin/brand-kit-trials",
      component: () => <Protected adminOnly><AdminBrandKitTrialsPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/admin/brf-voice-agent",
      component: () => <Protected adminOnly><AdminBrfVoiceAgentPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/admin-chat-agent",
      component: () => <Protected adminOnly><AdminChatAgentPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/admin/voice-preview",
      component: () => <Protected adminOnly><VoiceAgentPreviewPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/agent-workflow-os",
      component: () => <Protected adminOnly><AgentWorkflowOSPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/ai-lead-intelligence",
      component: () => <Protected adminOnly><AILeadIntelligencePage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/autopilot-dashboard",
      component: () => <Protected adminOnly><AutopilotDashboardPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/health-dashboard",
      component: () => <Protected adminOnly><ClientHealthDashboardPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/csv-lead-import",
      component: () => <Protected adminOnly><CsvLeadImportPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/domain-setup",
      component: () => <Protected adminOnly><DomainSetupPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/drip-campaigns",
      component: () => <Protected adminOnly><DripCampaignsPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/website-studio",
      component: () => <Protected adminOnly><NicheWebsiteStudioPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/open-lead-lake",
      component: () => <Protected adminOnly><OpenLeadLakePage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/outreach-agent",
      component: () => <Protected adminOnly><OutreachAgentPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/reply-inbox",
      component: () => <Protected adminOnly><ReplyIntelligenceInboxPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/scraper-tool",
      component: () => <Protected adminOnly><ScraperToolPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/sms-autopilot",
      component: () => <Protected adminOnly><SmsAutopilotPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/website-agent-settings",
      component: () => <Protected adminOnly><WebsiteAgentSettingsPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/white-label-hub",
      component: () => <Protected adminOnly><WhiteLabelHubPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/newsletters",
      component: () => <Protected adminOnly><NewslettersPage /></Protected>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/outreach-analytics",
      component: () => <Protected adminOnly><OutreachAnalyticsPage /></Protected>,
    }),
  ];
}
