// Leads hook — React Query wrapper with demo-data fallback

import type { Lead } from "@/backend";
import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

const DEMO_LEADS: Lead[] = [
  {
    id: "l1",
    name: "Sarah Johnson",
    status: "appointment_scheduled",
    source: "Website",
    createdAt: BigInt(Date.now()),
    email: "sarah@example.com",
    tenantId: "demo",
    niche: "roofing",
    notes: "",
    phone: "+15551234567",
    agentSubscriptions: [],
  },
  {
    id: "l2",
    name: "Mike Chen",
    status: "proposal_sent",
    source: "Referral",
    createdAt: BigInt(Date.now()),
    email: "mike@example.com",
    tenantId: "demo",
    niche: "roofing",
    notes: "",
    phone: "+15552345678",
    agentSubscriptions: [],
  },
  {
    id: "l3",
    name: "David Park",
    status: "new_lead",
    source: "Google Ads",
    createdAt: BigInt(Date.now()),
    email: "david@example.com",
    tenantId: "demo",
    niche: "roofing",
    notes: "",
    phone: "+15553456789",
    agentSubscriptions: [],
  },
  {
    id: "l4",
    name: "Lisa Martinez",
    status: "follow_up_needed",
    source: "Facebook",
    createdAt: BigInt(Date.now()),
    email: "lisa@example.com",
    tenantId: "demo",
    niche: "roofing",
    notes: "",
    phone: "+15554567890",
    agentSubscriptions: [],
  },
  {
    id: "l5",
    name: "Tom Wilson",
    status: "won",
    source: "Cold Call",
    createdAt: BigInt(Date.now()),
    email: "tom@example.com",
    tenantId: "demo",
    niche: "roofing",
    notes: "",
    phone: "+15555678901",
    agentSubscriptions: [],
  },
];

export function useLeads(tenantId: string) {
  const { actor, isFetching: actorLoading } = useActor();

  return useQuery<Lead[]>({
    queryKey: ["leads", tenantId],
    queryFn: async () => {
      if (!actor) return DEMO_LEADS;
      try {
        const result = await actor.getLeadsByTenantId(tenantId);
        if (Array.isArray(result) && result.length > 0) {
          return result as Lead[];
        }
        return DEMO_LEADS;
      } catch {
        return DEMO_LEADS;
      }
    },
    enabled: !actorLoading,
    staleTime: 30_000,
  });
}
