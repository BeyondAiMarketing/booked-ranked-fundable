/**
 * Public routes — accessible without authentication.
 * Includes marketing pages, niche landing pages, demo flows, and brand-kit pages.
 */
import { Navigate, createRoute, useSearch } from "@tanstack/react-router";
import type { AnyRoute } from "@tanstack/react-router";
import AgencyOnboardingPage from "../pages/AgencyOnboardingPage";
import AgencyPartnersPage from "../pages/AgencyPartnersPage";
import BrandKitIntakePage from "../pages/BrandKitIntakePage";
import BrandKitLandingPage from "../pages/BrandKitLandingPage";
import BrandKitTrialDashboardPage from "../pages/BrandKitTrialDashboardPage";
import CarpetCleaningPage from "../pages/CarpetCleaningPage";
import ChiropractorPage from "../pages/ChiropractorPage";
import DemoLoginPage from "../pages/DemoLoginPage";
import DemoPage from "../pages/DemoPage";
import DentalPage from "../pages/DentalPage";
import FreeAuditPage from "../pages/FreeAuditPage";
import HVACPage from "../pages/HVACPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MedSpaPage from "../pages/MedSpaPage";
import MortgagePage from "../pages/MortgagePage";
import NicheWebsitePreviewPage from "../pages/NicheWebsitePreviewPage";
import OnboardingWizardPage from "../pages/OnboardingWizardPage";
import PlumbingPage from "../pages/PlumbingPage";
import PricingPage from "../pages/PricingPage";
import Public3DViewerPage from "../pages/Public3DViewerPage";
import RealEstatePage from "../pages/RealEstatePage";
import RestorationPage from "../pages/RestorationPage";
import RoofingPage from "../pages/RoofingPage";
import SetupPage from "../pages/SetupPage";
import WhyUsPage from "../pages/WhyUsPage";

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

export function buildPublicRoutes(rootRoute: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: HomePage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/login",
      component: LoginPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/onboarding",
      component: OnboardingWizardPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/demo-login",
      component: DemoLoginPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/free-audit",
      component: FreeAuditPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/demo",
      component: DemoPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/services-demo",
      component: ServicesDemoRedirect,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/unified-demo",
      component: UnifiedDemoRedirect,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/why-us",
      component: WhyUsPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/plumbing",
      component: PlumbingPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/restoration",
      component: RestorationPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/hvac",
      component: HVACPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/carpet-cleaning",
      component: CarpetCleaningPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/roofing",
      component: RoofingPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/med-spa",
      component: MedSpaPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/real-estate",
      component: RealEstatePage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/mortgage",
      component: MortgagePage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/chiropractor",
      component: ChiropractorPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/dental",
      component: DentalPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/pricing",
      component: PricingPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/agency-onboarding",
      component: AgencyOnboardingPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/agency-partners",
      component: AgencyPartnersPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/brand-kit",
      component: BrandKitIntakePage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/brand-kit/$slug",
      component: BrandKitLandingPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/brand-kit/$slug/trial",
      component: BrandKitTrialDashboardPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/setup",
      component: SetupPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/preview/$previewId",
      component: NicheWebsitePreviewPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/view-3d/$modelId",
      component: Public3DViewerPage,
    }),
  ];
}
