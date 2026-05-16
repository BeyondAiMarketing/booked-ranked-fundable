import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import AgencyOnboardingWizard from "../components/AgencyOnboardingWizard";
import ClientOnboardingWizard from "../components/ClientOnboardingWizard";
import { useApp } from "../context/AppContext";

export default function OnboardingWizardPage() {
  const {
    isLoggedIn,
    isSuperAdmin,
    isAdmin,
    isAdminUser,
    onboardingComplete,
    agencyOnboardingComplete,
    currentTenantId,
  } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, navigate]);

  // Super Admin never sees any onboarding wizard — they go straight to /admin
  useEffect(() => {
    if (isLoggedIn && isSuperAdmin) {
      navigate({ to: "/admin" });
    }
  }, [isLoggedIn, isSuperAdmin, navigate]);

  if (!isLoggedIn) return null;
  if (isSuperAdmin) return null;

  // White Label Agency Admin sees the agency wizard
  if (isAdmin || isAdminUser) {
    if (agencyOnboardingComplete) {
      navigate({ to: "/dashboard" });
      return null;
    }
    return <AgencyOnboardingWizard />;
  }

  // Business Client sees the client wizard
  if (onboardingComplete[currentTenantId]) {
    navigate({ to: "/dashboard" });
    return null;
  }
  return <ClientOnboardingWizard />;
}
