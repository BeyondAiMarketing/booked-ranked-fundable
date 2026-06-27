/**
 * Social media routes — all social marketing, scheduling, and engagement pages.
 * All routes in this module are protected (require authentication).
 */
import { createRoute } from "@tanstack/react-router";
import type { AnyRoute } from "@tanstack/react-router";
import { lazy } from "react";
import SocialMediaPage from "../pages/SocialMediaPage";
import SocialROIDashboardPage from "../pages/SocialROIDashboardPage";
import type { ProtectedRouteWrapper } from "./types";

const SocialContentGeneratorPage = lazy(
  () => import("../pages/SocialContentGeneratorPage"),
);
const SocialSchedulerPage = lazy(() => import("../pages/SocialSchedulerPage"));
const SocialEngagementAgentPage = lazy(
  () => import("../pages/SocialEngagementAgentPage"),
);
const SocialProofPipelinePage = lazy(
  () => import("../pages/SocialProofPipelinePage"),
);
const CompetitorIntelligencePage = lazy(
  () => import("../pages/CompetitorIntelligencePage"),
);
const SocialLeadCapturePage = lazy(
  () => import("../pages/SocialLeadCapturePage"),
);
const SocialDemoFunnelPage = lazy(
  () => import("../pages/SocialDemoFunnelPage"),
);

export function buildSocialRoutes(
  rootRoute: AnyRoute,
  Protected: ProtectedRouteWrapper,
) {
  return [
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/social-media",
      component: () => (
        <Protected>
          <SocialMediaPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/social-roi",
      component: () => (
        <Protected>
          <SocialROIDashboardPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/social-content-generator",
      component: () => (
        <Protected>
          <SocialContentGeneratorPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/social-scheduler",
      component: () => (
        <Protected>
          <SocialSchedulerPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/social-engagement-agent",
      component: () => (
        <Protected>
          <SocialEngagementAgentPage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/social-proof-pipeline",
      component: () => (
        <Protected>
          <SocialProofPipelinePage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/competitor-intelligence",
      component: () => (
        <Protected>
          <CompetitorIntelligencePage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/social-lead-capture",
      component: () => (
        <Protected>
          <SocialLeadCapturePage />
        </Protected>
      ),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/social-demo-funnel",
      component: () => (
        <Protected>
          <SocialDemoFunnelPage />
        </Protected>
      ),
    }),
  ];
}
