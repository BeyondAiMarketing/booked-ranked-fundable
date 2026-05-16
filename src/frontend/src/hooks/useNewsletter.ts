// Newsletter hooks — React Query wrappers with demo-data fallback

import { demoCampaigns, demoSubscribers } from "@/data/newsletterData";
import type {
  NewsletterAnalytics,
  NewsletterCampaign,
  NewsletterSubscriber,
  SubscriberImportResult,
} from "@/types/newsletter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Helper: try actor, fall back to demo data ─────────────────────────────────

function getActor() {
  // Actor is wired via useActor in components; hooks here use demo fallback
  return null;
}

// ── Subscribers ───────────────────────────────────────────────────────────────

export function useSubscribers(_tenantId: string) {
  return useQuery<NewsletterSubscriber[]>({
    queryKey: ["newsletter-subscribers", _tenantId],
    queryFn: async () => {
      const actor = getActor();
      if (!actor) return demoSubscribers;
      // When actor is present: return actor.getNewsletterSubscribers(_tenantId)
      return demoSubscribers;
    },
    staleTime: 30_000,
  });
}

export function useCreateSubscriber() {
  const qc = useQueryClient();
  return useMutation<
    NewsletterSubscriber,
    Error,
    Omit<NewsletterSubscriber, "id" | "subscribedAt">
  >({
    mutationFn: async (input) => {
      const actor = getActor();
      const newSub: NewsletterSubscriber = {
        ...input,
        id: `sub-${Date.now()}`,
        subscribedAt: new Date().toISOString(),
      };
      if (!actor) return newSub;
      // When actor: return actor.createNewsletterSubscriber(input)
      return newSub;
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-subscribers", vars.tenantId],
      });
    },
  });
}

export function useUpdateSubscriber() {
  const qc = useQueryClient();
  return useMutation<
    NewsletterSubscriber,
    Error,
    { id: string; tenantId: string; updates: Partial<NewsletterSubscriber> }
  >({
    mutationFn: async ({ id, updates }) => {
      const existing =
        demoSubscribers.find((s) => s.id === id) ?? demoSubscribers[0];
      return { ...existing, ...updates, id };
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-subscribers", vars.tenantId],
      });
    },
  });
}

export function useDeleteSubscriber() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string; tenantId: string }>({
    mutationFn: async (_vars) => {
      // actor?.deleteNewsletterSubscriber(id)
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-subscribers", vars.tenantId],
      });
    },
  });
}

export function useImportSubscribers() {
  const qc = useQueryClient();
  return useMutation<
    SubscriberImportResult,
    Error,
    { tenantId: string; csvText: string }
  >({
    mutationFn: async ({ csvText }) => {
      const lines = csvText.trim().split("\n").slice(1); // skip header
      return {
        imported: lines.length,
        skipped: 0,
        errors: [],
      };
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-subscribers", vars.tenantId],
      });
    },
  });
}

// ── Campaigns ─────────────────────────────────────────────────────────────────

export function useCampaigns(_tenantId: string) {
  return useQuery<NewsletterCampaign[]>({
    queryKey: ["newsletter-campaigns", _tenantId],
    queryFn: async () => {
      const actor = getActor();
      if (!actor) return demoCampaigns;
      // actor.getNewsletterCampaigns(_tenantId)
      return demoCampaigns;
    },
    staleTime: 30_000,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation<
    NewsletterCampaign,
    Error,
    Omit<NewsletterCampaign, "id" | "stats">
  >({
    mutationFn: async (input) => ({
      ...input,
      id: `cmp-${Date.now()}`,
      stats: {
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        bounceCount: 0,
        unsubscribeCount: 0,
        complaintCount: 0,
      },
    }),
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-campaigns", vars.tenantId],
      });
    },
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation<
    NewsletterCampaign,
    Error,
    { id: string; tenantId: string; updates: Partial<NewsletterCampaign> }
  >({
    mutationFn: async ({ id, updates }) => {
      const existing =
        demoCampaigns.find((c) => c.id === id) ?? demoCampaigns[0];
      return { ...existing, ...updates, id };
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-campaigns", vars.tenantId],
      });
    },
  });
}

export function useSendCampaign() {
  const qc = useQueryClient();
  return useMutation<void, Error, { campaignId: string; tenantId: string }>({
    mutationFn: async (_vars) => {
      // Simulate send latency
      await new Promise((r) => setTimeout(r, 800));
      // actor?.sendNewsletterCampaign(campaignId)
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-campaigns", vars.tenantId],
      });
    },
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string; tenantId: string }>({
    mutationFn: async (_vars) => {
      // actor?.deleteNewsletterCampaign(id)
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-campaigns", vars.tenantId],
      });
    },
  });
}

export function useScheduleCampaign() {
  const qc = useQueryClient();
  return useMutation<
    void,
    Error,
    { campaignId: string; tenantId: string; scheduledAt: string }
  >({
    mutationFn: async (_vars) => {
      await new Promise((r) => setTimeout(r, 400));
      // actor?.scheduleNewsletterCampaign(campaignId, scheduledAt)
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-campaigns", vars.tenantId],
      });
    },
  });
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export function useNewsletterAnalytics(_tenantId: string) {
  return useQuery<NewsletterAnalytics>({
    queryKey: ["newsletter-analytics", _tenantId],
    queryFn: async () => {
      const actor = getActor();
      if (!actor) {
        const active = demoSubscribers.filter((s) => s.status === "active");
        const sent = demoCampaigns.filter((c) => c.status === "sent");
        const totalSent = sent.reduce((a, c) => a + c.stats.sentCount, 0);
        const totalOpen = sent.reduce((a, c) => a + c.stats.openCount, 0);
        const totalClick = sent.reduce((a, c) => a + c.stats.clickCount, 0);
        const totalBounce = sent.reduce((a, c) => a + c.stats.bounceCount, 0);
        return {
          totalSubscribers: demoSubscribers.length,
          activeSubscribers: active.length,
          totalCampaigns: demoCampaigns.length,
          totalSent,
          avgOpenRate: totalSent > 0 ? (totalOpen / totalSent) * 100 : 0,
          avgClickRate: totalSent > 0 ? (totalClick / totalSent) * 100 : 0,
          avgBounceRate: totalSent > 0 ? (totalBounce / totalSent) * 100 : 0,
          recentCampaigns: demoCampaigns.slice(0, 3),
        };
      }
      // actor.getNewsletterAnalytics(_tenantId)
      return {} as NewsletterAnalytics;
    },
    staleTime: 60_000,
  });
}
