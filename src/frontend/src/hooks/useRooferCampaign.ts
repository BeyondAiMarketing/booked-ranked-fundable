/**
 * React Query hooks for the Roofer Cold Outreach Campaign and public Demo
 * Booking flows.
 *
 * Follows the `useLeads.ts` pattern: each query hook calls the typed facade
 * in `@/integrations/roofer-campaign/client` via `useActor()`, and falls back
 * to built-in demo data when the actor is unavailable or the backend call
 * fails — so the UI renders even before the backend is wired.
 *
 * Mutation hooks invalidate the relevant query keys on success so list/detail
 * views refetch automatically.
 */

import {
  demoBooking_create,
  demoBooking_getByCtaToken,
  rooferColdCampaign_create,
  rooferColdCampaign_enrollLeads,
  rooferColdCampaign_get,
  rooferColdCampaign_getLeads,
  rooferColdCampaign_getReplies,
  rooferColdCampaign_getStats,
  rooferColdCampaign_list,
  rooferColdCampaign_pauseSending,
  rooferColdCampaign_processDueSends,
  rooferColdCampaign_startSending,
  rooferColdCampaign_updateSequence,
} from "@/integrations/roofer-campaign/client";
import type {
  CreateDemoBookingInput,
  CreateRooferCampaignInput,
  DemoBooking,
  EnrollLeadsInput,
  RooferCampaignLead,
  RooferCampaignListResult,
  RooferCampaignStats,
  RooferCampaignStatus,
  RooferCampaignSummary,
  RooferColdCampaign,
  UpdateSequenceInput,
} from "@/integrations/roofer-campaign/types";
import {
  RooferCampaignStatus as CampaignStatus,
  RooferCampaignLeadStatus,
} from "@/integrations/roofer-campaign/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// ---------------------------------------------------------------------------
// Demo data fallbacks — realistic roofer-focused content so the UI renders
// even before the backend is wired. Mirrors the useLeads.ts fallback pattern.
// ---------------------------------------------------------------------------

const DEMO_SEQUENCE_STEPS = 7;

function demoSequence(): RooferColdCampaign["sequence"] {
  const subjects = [
    "Quick question about your roofing crew",
    "Storm hit your service area last week",
    "Are you taking new jobs in [city]?",
    "Missed calls = missed roofs",
    "Google Maps ranking for [city] roofers",
    "Reviews are leaking your leads",
    "One last idea for your roofing pipeline",
  ];
  const bodies = [
    "Hi [name], I noticed your roofing business on Google Maps and had a quick question — are you taking new jobs this month?",
    "Hi [name], a storm rolled through your service area last week. Are you staffed for the repair wave?",
    "Hi [name], homeowners in [city] are searching for roofers right now. Are you showing up where they look?",
    "Hi [name], every missed call is a missed roof. How are you handling after-hours calls today?",
    "Hi [name], your Google Maps ranking drives most of your inbound leads. Want a quick look at where you stand?",
    "Hi [name], your reviews are the #2 factor in whether a homeowner calls you. Want a quick review-pipeline teardown?",
    "Hi [name], last idea: a 15-min demo of how we book, rank, and fund roofing crews. Pick a time below.",
  ];
  return Array.from({ length: DEMO_SEQUENCE_STEPS }, (_, i) => ({
    id: `step-${i + 1}`,
    stepNumber: BigInt(i + 1),
    subject: subjects[i],
    body: bodies[i],
    delayDays: BigInt(i === 0 ? 0 : i * 2),
    sendTime: "09:00",
    ctaToken: `cta-demo-${i + 1}`,
  }));
}

const DEMO_CAMPAIGNS: RooferCampaignSummary[] = [
  {
    id: "camp-1",
    name: "Austin Storm Season Outreach",
    status: CampaignStatus.sending,
    leadCount: BigInt(48),
    sent: BigInt(31),
    replied: BigInt(7),
    booked: BigInt(3),
    createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 3),
    startedAt: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "camp-2",
    name: "Dallas Missed-Call Recovery",
    status: CampaignStatus.paused,
    leadCount: BigInt(22),
    sent: BigInt(22),
    replied: BigInt(5),
    booked: BigInt(1),
    createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 7),
    startedAt: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 6),
  },
  {
    id: "camp-3",
    name: "Houston Maps Ranking Pilot",
    status: CampaignStatus.draft,
    leadCount: BigInt(0),
    sent: BigInt(0),
    replied: BigInt(0),
    booked: BigInt(0),
    createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 6),
  },
];

function demoCampaign(id: string): RooferColdCampaign {
  return {
    id,
    name:
      DEMO_CAMPAIGNS.find((c) => c.id === id)?.name ??
      "Untitled Roofer Campaign",
    tenantId: "demo",
    status:
      DEMO_CAMPAIGNS.find((c) => c.id === id)?.status ?? CampaignStatus.draft,
    sequence: demoSequence(),
    createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: BigInt(Date.now() - 1000 * 60 * 60),
    leadCount: DEMO_CAMPAIGNS.find((c) => c.id === id)?.leadCount ?? BigInt(0),
  };
}

function demoLeads(campaignId: string): RooferCampaignLead[] {
  const names = [
    "Apex Roofing Co",
    "Lone Star Roofers",
    "Hill Country Roofing",
    "Capital City Roofing",
    "Bluebonnet Roofing",
    "Texas Storm Restoration",
  ];
  const statuses = [
    RooferCampaignLeadStatus.sent,
    RooferCampaignLeadStatus.opened,
    RooferCampaignLeadStatus.replied,
    RooferCampaignLeadStatus.booked,
    RooferCampaignLeadStatus.bounced,
    RooferCampaignLeadStatus.new_,
  ];
  return names.map((name, i) => ({
    id: `lead-${campaignId}-${i + 1}`,
    campaignId,
    leadId: `le-${i + 1}`,
    businessName: name,
    email: `owner${i + 1}@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    phone: `+1555001${String(1000 + i).slice(-4)}`,
    niche: "roofing",
    status: statuses[i],
    currentStep: BigInt(i < 4 ? i + 1 : 0),
    enrolledAt: BigInt(Date.now() - 1000 * 60 * 60 * 24 * (i + 1)),
    lastEventAt: BigInt(Date.now() - 1000 * 60 * 60 * i),
    ctaToken: `cta-${campaignId}-${i + 1}`,
    replySnippet:
      statuses[i] === RooferCampaignLeadStatus.replied
        ? "Sure, send me a time that works."
        : undefined,
  }));
}

function demoStats(campaignId: string): RooferCampaignStats {
  const summary = DEMO_CAMPAIGNS.find((c) => c.id === campaignId);
  const total = summary?.leadCount ?? BigInt(0);
  const sent = summary?.sent ?? BigInt(0);
  const replied = summary?.replied ?? BigInt(0);
  const booked = summary?.booked ?? BigInt(0);
  return {
    campaignId,
    totalLeads: total,
    sent,
    opened: BigInt(Number(sent) - 2),
    replied,
    bounced: BigInt(1),
    booked,
    unsubscribed: BigInt(0),
    replyRate:
      total > 0 ? BigInt((Number(replied) * 100) / Number(total)) : BigInt(0),
    bookRate:
      total > 0 ? BigInt((Number(booked) * 100) / Number(total)) : BigInt(0),
  };
}

function demoReplies(campaignId: string): RooferCampaignLead[] {
  return demoLeads(campaignId).filter(
    (l) => l.status === RooferCampaignLeadStatus.replied,
  );
}

function demoBooking(ctaToken: string): DemoBooking | null {
  if (!ctaToken || ctaToken.startsWith("unknown")) return null;
  return {
    id: `booking-${ctaToken}`,
    campaignId: "camp-1",
    leadId: `le-${ctaToken.slice(-1) || "1"}`,
    ctaToken,
    name: "",
    email: "",
    slotIso: "",
    confirmed: false,
    createdAt: BigInt(Date.now()),
  };
}

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

const qk = {
  list: (tenantId: string) => ["roofer-campaigns", tenantId] as const,
  detail: (id: string) => ["roofer-campaign", id] as const,
  leads: (id: string) => ["roofer-campaign-leads", id] as const,
  stats: (id: string) => ["roofer-campaign-stats", id] as const,
  replies: (id: string) => ["roofer-campaign-replies", id] as const,
  demo: (token: string) => ["demo-booking", token] as const,
};

// ---------------------------------------------------------------------------
// Query hooks
// ---------------------------------------------------------------------------

/**
 * List roofer cold campaigns for a tenant. Falls back to demo data when the
 * actor is unavailable or the backend call fails.
 */
export function useRooferCampaigns(tenantId: string) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery<RooferCampaignSummary[]>({
    queryKey: qk.list(tenantId),
    queryFn: async () => {
      if (!actor) return DEMO_CAMPAIGNS;
      try {
        const result = await rooferColdCampaign_list(actor, tenantId, 0, 50);
        if (
          result &&
          Array.isArray(result.campaigns) &&
          result.campaigns.length > 0
        ) {
          return result.campaigns;
        }
        return DEMO_CAMPAIGNS;
      } catch {
        return DEMO_CAMPAIGNS;
      }
    },
    enabled: !actorLoading,
    staleTime: 30_000,
  });
}

/**
 * Fetch a single roofer cold campaign by id, including the editable sequence.
 */
export function useRooferCampaign(campaignId: string) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery<RooferColdCampaign | null>({
    queryKey: qk.detail(campaignId),
    queryFn: async () => {
      if (!actor) return demoCampaign(campaignId);
      try {
        return await rooferColdCampaign_get(actor, campaignId);
      } catch {
        return demoCampaign(campaignId);
      }
    },
    enabled: !actorLoading && !!campaignId,
    staleTime: 30_000,
  });
}

/**
 * Get all leads enrolled in a campaign, with per-lead status shown inline.
 */
export function useRooferCampaignLeads(campaignId: string) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery<RooferCampaignLead[]>({
    queryKey: qk.leads(campaignId),
    queryFn: async () => {
      if (!actor) return demoLeads(campaignId);
      try {
        const result = await rooferColdCampaign_getLeads(actor, campaignId);
        if (Array.isArray(result) && result.length > 0) return result;
        return demoLeads(campaignId);
      } catch {
        return demoLeads(campaignId);
      }
    },
    enabled: !actorLoading && !!campaignId,
    staleTime: 30_000,
  });
}

/**
 * Get aggregate stats for a campaign.
 */
export function useRooferCampaignStats(campaignId: string) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery<RooferCampaignStats | null>({
    queryKey: qk.stats(campaignId),
    queryFn: async () => {
      if (!actor) return demoStats(campaignId);
      try {
        return await rooferColdCampaign_getStats(actor, campaignId);
      } catch {
        return demoStats(campaignId);
      }
    },
    enabled: !actorLoading && !!campaignId,
    staleTime: 30_000,
  });
}

/**
 * Get replies received for a campaign.
 */
export function useRooferCampaignReplies(campaignId: string) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery<RooferCampaignLead[]>({
    queryKey: qk.replies(campaignId),
    queryFn: async () => {
      if (!actor) return demoReplies(campaignId);
      try {
        const result = await rooferColdCampaign_getReplies(actor, campaignId);
        if (Array.isArray(result) && result.length > 0) return result;
        return demoReplies(campaignId);
      } catch {
        return demoReplies(campaignId);
      }
    },
    enabled: !actorLoading && !!campaignId,
    staleTime: 30_000,
  });
}

/**
 * Look up a demo booking context by the CTA token from the public
 * /demo/:ctaToken page. No auth required.
 */
export function useDemoBooking(ctaToken: string) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery<DemoBooking | null>({
    queryKey: qk.demo(ctaToken),
    queryFn: async () => {
      if (!actor) return demoBooking(ctaToken);
      try {
        return await demoBooking_getByCtaToken(actor, ctaToken);
      } catch {
        return demoBooking(ctaToken);
      }
    },
    enabled: !actorLoading && !!ctaToken,
    staleTime: 30_000,
  });
}

// ---------------------------------------------------------------------------
// Mutation hooks
//
// Each mutation hook calls `useActor()` at the top of the hook body (which is
// a valid hook context) and captures the actor in the `mutationFn` closure.
// `mutationFn` itself is NOT a hook context, so it must not call `useActor()`
// directly — the closure capture is the correct React pattern.
// ---------------------------------------------------------------------------

/**
 * Create a new roofer cold campaign. Invalidates the campaign list on success.
 */
export function useCreateRooferCampaign(tenantId: string) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: CreateRooferCampaignInput) => {
      if (!actor) {
        // Demo fallback: return a synthetic campaign so the UI can navigate.
        return demoCampaign("camp-new");
      }
      return rooferColdCampaign_create(actor, input);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.list(tenantId) });
    },
  });
}

/**
 * Update a campaign's editable 7-step sequence. Invalidates the campaign
 * detail on success.
 */
export function useUpdateSequence(campaignId: string) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: UpdateSequenceInput) => {
      if (!actor) return demoCampaign(campaignId);
      return rooferColdCampaign_updateSequence(actor, input);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.detail(campaignId) });
    },
  });
}

/**
 * Enroll leads into a campaign. Invalidates the campaign's leads + stats on
 * success.
 */
export function useEnrollLeads(campaignId: string) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: EnrollLeadsInput) => {
      if (!actor) return demoLeads(campaignId);
      return rooferColdCampaign_enrollLeads(actor, input);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.leads(campaignId) });
      void qc.invalidateQueries({ queryKey: qk.stats(campaignId) });
      void qc.invalidateQueries({ queryKey: qk.detail(campaignId) });
    },
  });
}

/**
 * Start sending a campaign (manual trigger). Invalidates the campaign detail
 * + list on success.
 */
export function useStartSending(campaignId: string, tenantId: string) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return demoCampaign(campaignId);
      return rooferColdCampaign_startSending(actor, campaignId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.detail(campaignId) });
      void qc.invalidateQueries({ queryKey: qk.list(tenantId) });
    },
  });
}

/**
 * Pause sending for a campaign. Invalidates the campaign detail + list on
 * success.
 */
export function usePauseSending(campaignId: string, tenantId: string) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return demoCampaign(campaignId);
      return rooferColdCampaign_pauseSending(actor, campaignId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.detail(campaignId) });
      void qc.invalidateQueries({ queryKey: qk.list(tenantId) });
    },
  });
}

/**
 * Process due sends for a campaign (admin "process now"). Invalidates the
 * campaign's leads + stats on success.
 */
export function useProcessDueSends(campaignId: string) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return BigInt(0);
      return rooferColdCampaign_processDueSends(actor, campaignId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.leads(campaignId) });
      void qc.invalidateQueries({ queryKey: qk.stats(campaignId) });
    },
  });
}

/**
 * Create a public demo booking from the /demo/:ctaToken page. Invalidates the
 * demo booking lookup so the confirmation view reflects the new booking.
 */
export function useCreateDemoBooking(ctaToken: string) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: CreateDemoBookingInput) => {
      if (!actor) {
        // Demo fallback: return a synthetic confirmed booking.
        return {
          id: `booking-${ctaToken}`,
          campaignId: "camp-1",
          leadId: `le-${ctaToken.slice(-1) || "1"}`,
          ctaToken,
          name: input.name,
          email: input.email,
          slotIso: input.slotIso,
          confirmed: true,
          createdAt: BigInt(Date.now()),
          confirmedAt: BigInt(Date.now()),
        } satisfies DemoBooking;
      }
      return demoBooking_create(actor, input);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.demo(ctaToken) });
    },
  });
}

// Re-export the status enums so pages can import them from the hooks module.
export {
  CampaignStatus as RooferCampaignStatusValue,
  RooferCampaignLeadStatus,
};
export type { RooferCampaignStatus };
