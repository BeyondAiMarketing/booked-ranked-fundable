/**
 * useNicheLeadSubmit — shared hook for creating a lead and an optional demo
 * session for any home-service niche (roofing, HVAC, plumbing).
 *
 * Extracted from RoofingPage.tsx so the same submission pipeline can be
 * reused by HVAC and Plumbing pages without duplicating backend calls.
 */

import { useActor } from "@/hooks/useActor";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

export interface NicheLeadFormData {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  monthlyRevenue: string;
  biggestProblem: string;
  teamSize: string;
  /** Niche-specific extra fields serialised as JSON in lead notes */
  nicheFields?: Record<string, string>;
}

export interface UseNicheLeadSubmitOptions {
  nicheKey: string;
  nicheName: string;
  source: string;
  /** Items to animate through during the loading sequence */
  loadingItems?: string[];
  /** Called when the loading counter advances */
  onLoadingStep?: (count: number) => void;
  /** Navigation target after successful submission */
  redirectTo?: string;
}

export interface UseNicheLeadSubmitResult {
  loading: boolean;
  submit: (form: NicheLeadFormData) => Promise<void>;
}

const DEFAULT_LOADING_ITEMS = [
  "Niche Workflow",
  "AI Front Desk",
  "Review Engine",
  "Ranking Dashboard",
  "Funding-readiness Roadmap",
];

export function useNicheLeadSubmit({
  nicheKey,
  nicheName,
  source,
  loadingItems = DEFAULT_LOADING_ITEMS,
  onLoadingStep,
  redirectTo = "/demo",
}: UseNicheLeadSubmitOptions): UseNicheLeadSubmitResult {
  const { actor } = useActor();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (form: NicheLeadFormData) => {
      setLoading(true);
      if (onLoadingStep) onLoadingStep(0);

      // Animate loading steps
      for (let i = 0; i < loadingItems.length; i++) {
        await new Promise<void>((r) => setTimeout(r, 400));
        if (onLoadingStep) onLoadingStep(i + 1);
      }

      let sessionId: string | null = null;

      // 1. Create a demo session (best-effort)
      try {
        if (actor) {
          sessionId = await actor.createDemoSessionWithCity(
            form.businessName,
            nicheName,
            form.city,
          );
        }
      } catch {
        // Demo session creation is non-blocking
      }

      // 2. Activate trial (best-effort)
      try {
        if (actor && sessionId) {
          await actor.activateTrial(
            sessionId,
            form.firstName,
            form.businessName,
            form.city,
            nicheKey,
            form.phone,
            form.email,
            form.website ?? "",
          );
        }
      } catch {
        // activateTrial is non-blocking
      }

      // 3. Persist the lead (best-effort)
      try {
        if (actor) {
          await actor.createLead({
            id: "",
            tenantId: `${nicheKey}_landing`,
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            phone: form.phone,
            niche: nicheKey,
            status: "new_lead",
            source,
            notes: JSON.stringify({
              lastName: form.lastName,
              website: form.website,
              state: form.state,
              monthlyRevenue: form.monthlyRevenue,
              biggestProblem: form.biggestProblem,
              teamSize: form.teamSize,
              demoType: `${nicheKey}_live_demo`,
              ...(form.nicheFields ?? {}),
            }),
            agentSubscriptions: [],
            createdAt: BigInt(Date.now()) * BigInt(1_000_000),
          });
        }
      } catch {
        // createLead is best-effort — we still redirect
      }

      await new Promise<void>((r) => setTimeout(r, 500));
      setLoading(false);

      navigate({
        to: redirectTo as never,
        search: { niche: nicheKey, source } as never,
        state: {
          niche: nicheKey,
          industry: `${nicheName.toLowerCase()} company`,
          demoType: `${nicheKey}_live_demo`,
          source,
          skipNichePicker: true,
          sessionId,
          firstName: form.firstName,
          lastName: form.lastName,
          businessName: form.businessName,
          city: form.city,
          phone: form.phone,
          email: form.email,
          website: form.website,
        } as never,
      });
    },
    [
      actor,
      navigate,
      nicheKey,
      nicheName,
      source,
      loadingItems,
      onLoadingStep,
      redirectTo,
    ],
  );

  return { loading, submit };
}
