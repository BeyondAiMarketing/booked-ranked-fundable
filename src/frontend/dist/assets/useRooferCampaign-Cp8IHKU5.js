import { ad as useActor, u as useQuery, a as useQueryClient, b as useMutation } from "./index-iniFfpN1.js";
async function rooferColdCampaign_create(actor, input) {
  const a = actor;
  return a.rooferColdCampaign_create(input);
}
async function rooferColdCampaign_list(actor, tenantId, offset, limit) {
  const a = actor;
  return a.rooferColdCampaign_list(tenantId, BigInt(offset), BigInt(limit));
}
async function rooferColdCampaign_get(actor, campaignId) {
  const a = actor;
  return a.rooferColdCampaign_get(campaignId);
}
async function rooferColdCampaign_updateSequence(actor, input) {
  const a = actor;
  return a.rooferColdCampaign_updateSequence(input);
}
async function rooferColdCampaign_enrollLeads(actor, input) {
  const a = actor;
  return a.rooferColdCampaign_enrollLeads(input);
}
async function rooferColdCampaign_getLeads(actor, campaignId) {
  const a = actor;
  return a.rooferColdCampaign_getLeads(campaignId);
}
async function rooferColdCampaign_startSending(actor, campaignId) {
  const a = actor;
  return a.rooferColdCampaign_startSending(campaignId);
}
async function rooferColdCampaign_pauseSending(actor, campaignId) {
  const a = actor;
  return a.rooferColdCampaign_pauseSending(campaignId);
}
async function rooferColdCampaign_getStats(actor, campaignId) {
  const a = actor;
  return a.rooferColdCampaign_getStats(campaignId);
}
async function rooferColdCampaign_getReplies(actor, campaignId) {
  const a = actor;
  return a.rooferColdCampaign_getReplies(campaignId);
}
async function demoBooking_getByCtaToken(actor, ctaToken) {
  const a = actor;
  return a.demoBooking_getByCtaToken(ctaToken);
}
async function demoBooking_create(actor, input) {
  const a = actor;
  return a.demoBooking_create(input);
}
var RooferCampaignStatus = /* @__PURE__ */ ((RooferCampaignStatus2) => {
  RooferCampaignStatus2["draft"] = "draft";
  RooferCampaignStatus2["sending"] = "sending";
  RooferCampaignStatus2["paused"] = "paused";
  RooferCampaignStatus2["completed"] = "completed";
  RooferCampaignStatus2["archived"] = "archived";
  return RooferCampaignStatus2;
})(RooferCampaignStatus || {});
var RooferCampaignLeadStatus = /* @__PURE__ */ ((RooferCampaignLeadStatus2) => {
  RooferCampaignLeadStatus2["new_"] = "new";
  RooferCampaignLeadStatus2["sent"] = "sent";
  RooferCampaignLeadStatus2["opened"] = "opened";
  RooferCampaignLeadStatus2["replied"] = "replied";
  RooferCampaignLeadStatus2["bounced"] = "bounced";
  RooferCampaignLeadStatus2["booked"] = "booked";
  RooferCampaignLeadStatus2["unsubscribed"] = "unsubscribed";
  return RooferCampaignLeadStatus2;
})(RooferCampaignLeadStatus || {});
const DEMO_SEQUENCE_STEPS = 7;
function demoSequence() {
  const subjects = [
    "Quick question about your roofing crew",
    "Storm hit your service area last week",
    "Are you taking new jobs in [city]?",
    "Missed calls = missed roofs",
    "Google Maps ranking for [city] roofers",
    "Reviews are leaking your leads",
    "One last idea for your roofing pipeline"
  ];
  const bodies = [
    "Hi [name], I noticed your roofing business on Google Maps and had a quick question — are you taking new jobs this month?",
    "Hi [name], a storm rolled through your service area last week. Are you staffed for the repair wave?",
    "Hi [name], homeowners in [city] are searching for roofers right now. Are you showing up where they look?",
    "Hi [name], every missed call is a missed roof. How are you handling after-hours calls today?",
    "Hi [name], your Google Maps ranking drives most of your inbound leads. Want a quick look at where you stand?",
    "Hi [name], your reviews are the #2 factor in whether a homeowner calls you. Want a quick review-pipeline teardown?",
    "Hi [name], last idea: a 15-min demo of how we book, rank, and fund roofing crews. Pick a time below."
  ];
  return Array.from({ length: DEMO_SEQUENCE_STEPS }, (_, i) => ({
    id: `step-${i + 1}`,
    stepNumber: BigInt(i + 1),
    subject: subjects[i],
    body: bodies[i],
    delayDays: BigInt(i === 0 ? 0 : i * 2),
    sendTime: "09:00",
    ctaToken: `cta-demo-${i + 1}`
  }));
}
const DEMO_CAMPAIGNS = [
  {
    id: "camp-1",
    name: "Austin Storm Season Outreach",
    status: RooferCampaignStatus.sending,
    leadCount: BigInt(48),
    sent: BigInt(31),
    replied: BigInt(7),
    booked: BigInt(3),
    createdAt: BigInt(Date.now() - 1e3 * 60 * 60 * 24 * 3),
    startedAt: BigInt(Date.now() - 1e3 * 60 * 60 * 24 * 2)
  },
  {
    id: "camp-2",
    name: "Dallas Missed-Call Recovery",
    status: RooferCampaignStatus.paused,
    leadCount: BigInt(22),
    sent: BigInt(22),
    replied: BigInt(5),
    booked: BigInt(1),
    createdAt: BigInt(Date.now() - 1e3 * 60 * 60 * 24 * 7),
    startedAt: BigInt(Date.now() - 1e3 * 60 * 60 * 24 * 6)
  },
  {
    id: "camp-3",
    name: "Houston Maps Ranking Pilot",
    status: RooferCampaignStatus.draft,
    leadCount: BigInt(0),
    sent: BigInt(0),
    replied: BigInt(0),
    booked: BigInt(0),
    createdAt: BigInt(Date.now() - 1e3 * 60 * 60 * 6)
  }
];
function demoCampaign(id) {
  var _a, _b, _c;
  return {
    id,
    name: ((_a = DEMO_CAMPAIGNS.find((c) => c.id === id)) == null ? void 0 : _a.name) ?? "Untitled Roofer Campaign",
    tenantId: "demo",
    status: ((_b = DEMO_CAMPAIGNS.find((c) => c.id === id)) == null ? void 0 : _b.status) ?? RooferCampaignStatus.draft,
    sequence: demoSequence(),
    createdAt: BigInt(Date.now() - 1e3 * 60 * 60 * 24),
    updatedAt: BigInt(Date.now() - 1e3 * 60 * 60),
    leadCount: ((_c = DEMO_CAMPAIGNS.find((c) => c.id === id)) == null ? void 0 : _c.leadCount) ?? BigInt(0)
  };
}
function demoLeads(campaignId) {
  const names = [
    "Apex Roofing Co",
    "Lone Star Roofers",
    "Hill Country Roofing",
    "Capital City Roofing",
    "Bluebonnet Roofing",
    "Texas Storm Restoration"
  ];
  const statuses = [
    RooferCampaignLeadStatus.sent,
    RooferCampaignLeadStatus.opened,
    RooferCampaignLeadStatus.replied,
    RooferCampaignLeadStatus.booked,
    RooferCampaignLeadStatus.bounced,
    RooferCampaignLeadStatus.new_
  ];
  return names.map((name, i) => ({
    id: `lead-${campaignId}-${i + 1}`,
    campaignId,
    leadId: `le-${i + 1}`,
    businessName: name,
    email: `owner${i + 1}@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    phone: `+1555001${String(1e3 + i).slice(-4)}`,
    niche: "roofing",
    status: statuses[i],
    currentStep: BigInt(i < 4 ? i + 1 : 0),
    enrolledAt: BigInt(Date.now() - 1e3 * 60 * 60 * 24 * (i + 1)),
    lastEventAt: BigInt(Date.now() - 1e3 * 60 * 60 * i),
    ctaToken: `cta-${campaignId}-${i + 1}`,
    replySnippet: statuses[i] === RooferCampaignLeadStatus.replied ? "Sure, send me a time that works." : void 0
  }));
}
function demoStats(campaignId) {
  const summary = DEMO_CAMPAIGNS.find((c) => c.id === campaignId);
  const total = (summary == null ? void 0 : summary.leadCount) ?? BigInt(0);
  const sent = (summary == null ? void 0 : summary.sent) ?? BigInt(0);
  const replied = (summary == null ? void 0 : summary.replied) ?? BigInt(0);
  const booked = (summary == null ? void 0 : summary.booked) ?? BigInt(0);
  return {
    campaignId,
    totalLeads: total,
    sent,
    opened: BigInt(Number(sent) - 2),
    replied,
    bounced: BigInt(1),
    booked,
    unsubscribed: BigInt(0),
    replyRate: total > 0 ? BigInt(Number(replied) * 100 / Number(total)) : BigInt(0),
    bookRate: total > 0 ? BigInt(Number(booked) * 100 / Number(total)) : BigInt(0)
  };
}
function demoReplies(campaignId) {
  return demoLeads(campaignId).filter(
    (l) => l.status === RooferCampaignLeadStatus.replied
  );
}
function demoBooking(ctaToken) {
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
    createdAt: BigInt(Date.now())
  };
}
const qk = {
  list: (tenantId) => ["roofer-campaigns", tenantId],
  detail: (id) => ["roofer-campaign", id],
  leads: (id) => ["roofer-campaign-leads", id],
  stats: (id) => ["roofer-campaign-stats", id],
  replies: (id) => ["roofer-campaign-replies", id],
  demo: (token) => ["demo-booking", token]
};
function useRooferCampaigns(tenantId) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery({
    queryKey: qk.list(tenantId),
    queryFn: async () => {
      if (!actor) return DEMO_CAMPAIGNS;
      try {
        const result = await rooferColdCampaign_list(actor, tenantId, 0, 50);
        if (result && Array.isArray(result.campaigns) && result.campaigns.length > 0) {
          return result.campaigns;
        }
        return DEMO_CAMPAIGNS;
      } catch {
        return DEMO_CAMPAIGNS;
      }
    },
    enabled: !actorLoading,
    staleTime: 3e4
  });
}
function useRooferCampaign(campaignId) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery({
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
    staleTime: 3e4
  });
}
function useRooferCampaignLeads(campaignId) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery({
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
    staleTime: 3e4
  });
}
function useRooferCampaignStats(campaignId) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery({
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
    staleTime: 3e4
  });
}
function useRooferCampaignReplies(campaignId) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery({
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
    staleTime: 3e4
  });
}
function useDemoBooking(ctaToken) {
  const { actor, isFetching: actorLoading } = useActor();
  return useQuery({
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
    staleTime: 3e4
  });
}
function useCreateRooferCampaign(tenantId) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) {
        return demoCampaign("camp-new");
      }
      return rooferColdCampaign_create(actor, input);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.list(tenantId) });
    }
  });
}
function useUpdateSequence(campaignId) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) return demoCampaign(campaignId);
      return rooferColdCampaign_updateSequence(actor, input);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.detail(campaignId) });
    }
  });
}
function useEnrollLeads(campaignId) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) return demoLeads(campaignId);
      return rooferColdCampaign_enrollLeads(actor, input);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.leads(campaignId) });
      void qc.invalidateQueries({ queryKey: qk.stats(campaignId) });
      void qc.invalidateQueries({ queryKey: qk.detail(campaignId) });
    }
  });
}
function useStartSending(campaignId, tenantId) {
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
    }
  });
}
function usePauseSending(campaignId, tenantId) {
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
    }
  });
}
function useCreateDemoBooking(ctaToken) {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) {
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
          confirmedAt: BigInt(Date.now())
        };
      }
      return demoBooking_create(actor, input);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.demo(ctaToken) });
    }
  });
}
export {
  RooferCampaignStatus as R,
  useStartSending as a,
  usePauseSending as b,
  useRooferCampaigns as c,
  useUpdateSequence as d,
  useRooferCampaignLeads as e,
  useRooferCampaignStats as f,
  RooferCampaignLeadStatus as g,
  useRooferCampaignReplies as h,
  useCreateRooferCampaign as i,
  useEnrollLeads as j,
  useDemoBooking as k,
  useCreateDemoBooking as l,
  useRooferCampaign as u
};
