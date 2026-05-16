import { useCallback, useEffect, useState } from "react";
import type {
  BrandKitFunnelStats,
  BrandKitIntakeForm,
  BrandKitNiche,
  BrandKitOutreachJob,
  BrandKitProspect,
  TrialStatus,
} from "../types/brandKit";
import { computeNicheAuditScore } from "../types/brandKit";
import { useActor } from "./useActor";

// ─── Exported Types ───────────────────────────────────────────────────────────

export interface WarmSequenceEmailSchedule {
  id: string;
  slug: string;
  subject: string;
  previewText: string;
  scheduledAt: number;
  sentAt?: number;
  openedAt?: number;
  status: "scheduled" | "sent" | "opened";
  day: 1 | 4 | 6;
}

export interface BrandKitOutreachStats {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  byNiche: Array<[string, number]>;
}

const STORAGE_KEY_PROSPECTS = "brf_brand_kit_prospects";
const STORAGE_KEY_OUTREACH = "brf_brand_kit_outreach";
const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function slugify(businessName: string, niche: string): string {
  const base = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
  return `${base}-${niche}-${Math.random().toString(36).slice(2, 6)}`;
}

function loadProspects(): BrandKitProspect[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROSPECTS);
    return raw ? (JSON.parse(raw) as BrandKitProspect[]) : [];
  } catch {
    return [];
  }
}

function saveProspects(prospects: BrandKitProspect[]): void {
  localStorage.setItem(STORAGE_KEY_PROSPECTS, JSON.stringify(prospects));
}

function loadOutreach(): BrandKitOutreachJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OUTREACH);
    return raw ? (JSON.parse(raw) as BrandKitOutreachJob[]) : [];
  } catch {
    return [];
  }
}

function saveOutreach(jobs: BrandKitOutreachJob[]): void {
  localStorage.setItem(STORAGE_KEY_OUTREACH, JSON.stringify(jobs));
}

function resolveTrialDay(prospect: BrandKitProspect): number {
  if (prospect.trialStatus === "NotStarted") return 0;
  if (
    prospect.trialStatus === "Converted" ||
    prospect.trialStatus === "Expired"
  )
    return 8;
  if (prospect.trialStartedAt === undefined) return 0;
  const elapsed = Date.now() - prospect.trialStartedAt;
  return Math.min(7, Math.max(1, Math.ceil(elapsed / (24 * 60 * 60 * 1000))));
}

function syncTrialStatuses(prospects: BrandKitProspect[]): BrandKitProspect[] {
  const now = Date.now();
  return prospects.map((p) => {
    if (
      p.trialStatus === "Active" &&
      p.trialExpiresAt !== undefined &&
      now > p.trialExpiresAt
    ) {
      return { ...p, trialStatus: "Expired" as TrialStatus, trialDay: 8 };
    }
    if (p.trialStatus === "Active") {
      return { ...p, trialDay: resolveTrialDay(p) };
    }
    return p;
  });
}

// ─── Nudge Schedule Builder ───────────────────────────────────────────────────

const NUDGE_EMAIL_TEMPLATES: Record<
  1 | 4 | 6,
  { subject: string; previewText: string }
> = {
  1: {
    subject: "Your brand kit is ready — here's how to get the most out of it",
    previewText:
      "Start with your AI voice agent — it takes 60 seconds to test and it's already saying your name.",
  },
  4: {
    subject: "You've explored features — here's what you haven't seen",
    previewText:
      "Your social calendar is pre-loaded with 30 days of niche posts. Connect your accounts in 2 minutes.",
  },
  6: {
    subject: "Final days of your trial — lock in everything you've built",
    previewText:
      "Your website, voice agent, and campaign calendar are ready to go live. Upgrade before midnight tomorrow.",
  },
};

function buildNudgeSchedule(
  prospect: BrandKitProspect,
): WarmSequenceEmailSchedule[] {
  if (
    prospect.trialStatus === "NotStarted" ||
    prospect.trialStartedAt === undefined
  ) {
    const base = Date.now();
    return ([1, 4, 6] as const).map((day) => ({
      id: `nudge-${prospect.kitPageSlug}-d${day}`,
      slug: prospect.kitPageSlug,
      ...NUDGE_EMAIL_TEMPLATES[day],
      scheduledAt: base + day * 24 * 60 * 60 * 1000,
      status: "scheduled" as const,
      day,
    }));
  }

  const base = prospect.trialStartedAt;
  const featureCount = prospect.featuresUsed.length;

  return ([1, 4, 6] as const).map((day) => {
    const scheduledAt = base + day * 24 * 60 * 60 * 1000;
    const isPast = Date.now() > scheduledAt;
    const isSent = prospect.trialDay >= day;
    const isOpened = isSent && featureCount > 0 && day < prospect.trialDay;
    const status: "scheduled" | "sent" | "opened" = isOpened
      ? "opened"
      : isSent && isPast
        ? "sent"
        : "scheduled";
    const sentAt = isSent && isPast ? scheduledAt + 120_000 : undefined;
    const openedAt = isOpened && sentAt ? sentAt + 30 * 60 * 1000 : undefined;

    return {
      id: `nudge-${prospect.kitPageSlug}-d${day}`,
      slug: prospect.kitPageSlug,
      subject: NUDGE_EMAIL_TEMPLATES[day].subject,
      previewText: NUDGE_EMAIL_TEMPLATES[day].previewText,
      scheduledAt,
      sentAt,
      openedAt,
      status,
      day,
    };
  });
}

/** Read UTM params from current URL */
function captureUtmData(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
} {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
  };
}

// ─── Demo Seed Data ───────────────────────────────────────────────────────────

const DEMO_SEED_NAMES: Array<{
  firstName: string;
  businessName: string;
  niche: BrandKitNiche;
  city: string;
  phone: string;
  daysAgo: number;
  status: TrialStatus;
}> = [
  {
    firstName: "Marcus",
    businessName: "Marcus Plumbing Co",
    niche: "plumber",
    city: "Dallas",
    phone: "214-555-0182",
    daysAgo: 5,
    status: "Active",
  },
  {
    firstName: "Sophia",
    businessName: "Glow Med Spa",
    niche: "med-spa",
    city: "Miami",
    phone: "305-555-0239",
    daysAgo: 8,
    status: "Expired",
  },
  {
    firstName: "Derek",
    businessName: "Arctic Air HVAC",
    niche: "hvac",
    city: "Phoenix",
    phone: "602-555-0374",
    daysAgo: 2,
    status: "Active",
  },
  {
    firstName: "Brenda",
    businessName: "BrightStone Restoration",
    niche: "restoration",
    city: "Chicago",
    phone: "312-555-0561",
    daysAgo: 14,
    status: "Converted",
  },
  {
    firstName: "Carlos",
    businessName: "CarpetPro Solutions",
    niche: "carpet-cleaning",
    city: "Houston",
    phone: "713-555-0448",
    daysAgo: 0,
    status: "NotStarted",
  },
  {
    firstName: "Heather",
    businessName: "Summit Roofing",
    niche: "roofing",
    city: "Denver",
    phone: "720-555-0662",
    daysAgo: 3,
    status: "Active",
  },
];

function buildDemoProspect(
  seed: (typeof DEMO_SEED_NAMES)[0],
): BrandKitProspect {
  const now = Date.now();
  const createdAt = now - seed.daysAgo * 24 * 60 * 60 * 1000;
  const auditScore = computeNicheAuditScore(seed.niche, seed.city).overall;
  const trialStartedAt =
    seed.status !== "NotStarted" ? createdAt + 60_000 : undefined;
  const trialExpiresAt =
    trialStartedAt !== undefined
      ? trialStartedAt + TRIAL_DURATION_MS
      : undefined;

  return {
    id: generateId(),
    businessName: seed.businessName,
    niche: seed.niche,
    city: seed.city,
    phone: seed.phone,
    firstName: seed.firstName,
    createdAt,
    kitPageSlug: slugify(seed.businessName, seed.niche),
    trialStatus: seed.status,
    trialStartedAt,
    trialDay:
      seed.status === "NotStarted"
        ? 0
        : seed.status === "Expired" || seed.status === "Converted"
          ? 8
          : seed.daysAgo,
    trialExpiresAt,
    activationAction: seed.status !== "NotStarted" ? "audit_run" : undefined,
    auditScore,
    outreachKitSentAt: createdAt - 30 * 60 * 1000,
    outreachKitOpenedAt: createdAt - 15 * 60 * 1000,
    convertedAt:
      seed.status === "Converted"
        ? createdAt + 3 * 24 * 60 * 60 * 1000
        : undefined,
    lastActivityAt: now - Math.floor(Math.random() * 3) * 60 * 60 * 1000,
    featuresUsed:
      seed.status !== "NotStarted"
        ? ["audit_run", "voice_agent_tested", "website_viewed"]
        : [],
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBrandKit() {
  const { actor, isFetching } = useActor();
  const [prospects, setProspects] = useState<BrandKitProspect[]>(() =>
    syncTrialStatuses(loadProspects()),
  );
  const [outreachJobs, setOutreachJobs] = useState<BrandKitOutreachJob[]>(() =>
    loadOutreach(),
  );

  // Sync trial statuses every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setProspects((prev) => {
        const updated = syncTrialStatuses(prev);
        saveProspects(updated);
        return updated;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const createProspect = useCallback(
    (form: BrandKitIntakeForm): BrandKitProspect => {
      if (!form.niche) throw new Error("Niche is required");
      const niche = form.niche as BrandKitNiche;
      const auditScore = computeNicheAuditScore(niche, form.city).overall;
      const utm = captureUtmData();
      const prospect: BrandKitProspect = {
        id: generateId(),
        businessName: form.businessName,
        niche,
        city: form.city,
        phone: form.phone,
        website: form.website || undefined,
        firstName: form.firstName,
        createdAt: Date.now(),
        kitPageSlug: slugify(form.businessName, niche),
        trialStatus: "NotStarted",
        trialDay: 0,
        auditScore,
        featuresUsed: [],
        utmSource: utm.utmSource,
        utmCampaign: utm.utmCampaign,
      };
      const updated = [...prospects, prospect];
      saveProspects(updated);
      setProspects(updated);
      return prospect;
    },
    [prospects],
  );

  /**
   * Calls backend triggerOutreachEmailSequence(slug) after prospect creation.
   * Fire-and-forget — errors are silently swallowed so the intake flow never breaks.
   */
  const triggerOutreachSequence = useCallback(
    (slug: string): void => {
      if (!actor || isFetching) return;
      actor.triggerOutreachEmailSequence(slug).catch(() => {
        // silently fail — outreach is best-effort
      });
    },
    [actor, isFetching],
  );

  const getProspectBySlug = useCallback(
    (slug: string): BrandKitProspect | undefined => {
      return prospects.find((p) => p.kitPageSlug === slug);
    },
    [prospects],
  );

  const activateTrial = useCallback(
    (slug: string, actionType: string): void => {
      setProspects((prev) => {
        const updated = prev.map((p) => {
          if (p.kitPageSlug !== slug || p.trialStatus !== "NotStarted")
            return p;
          const now = Date.now();
          return {
            ...p,
            trialStatus: "Active" as TrialStatus,
            trialStartedAt: now,
            trialExpiresAt: now + TRIAL_DURATION_MS,
            trialDay: 1,
            activationAction: actionType,
            lastActivityAt: now,
            featuresUsed: p.featuresUsed.includes(actionType)
              ? p.featuresUsed
              : [...p.featuresUsed, actionType],
          };
        });
        saveProspects(updated);
        return updated;
      });
    },
    [],
  );

  const recordActivity = useCallback((slug: string, feature: string): void => {
    const MEANINGFUL_ACTIONS = [
      "audit_run",
      "voice_agent_tested",
      "website_viewed",
      "sms_inbox_explored",
      "crm_record_opened",
    ];
    setProspects((prev) => {
      const updated = prev.map((p) => {
        if (p.kitPageSlug !== slug) return p;
        const alreadyTracked = p.featuresUsed.includes(feature);
        const now = Date.now();
        const shouldActivate =
          p.trialStatus === "NotStarted" &&
          MEANINGFUL_ACTIONS.includes(feature);
        if (shouldActivate) {
          return {
            ...p,
            trialStatus: "Active" as TrialStatus,
            trialStartedAt: now,
            trialExpiresAt: now + TRIAL_DURATION_MS,
            trialDay: 1,
            activationAction: feature,
            lastActivityAt: now,
            featuresUsed: alreadyTracked
              ? p.featuresUsed
              : [...p.featuresUsed, feature],
          };
        }
        return {
          ...p,
          lastActivityAt: now,
          featuresUsed: alreadyTracked
            ? p.featuresUsed
            : [...p.featuresUsed, feature],
        };
      });
      saveProspects(updated);
      return updated;
    });
  }, []);

  const markConverted = useCallback((slug: string): void => {
    setProspects((prev) => {
      const updated = prev.map((p) => {
        if (p.kitPageSlug !== slug) return p;
        return {
          ...p,
          trialStatus: "Converted" as TrialStatus,
          convertedAt: Date.now(),
          trialDay: 8,
        };
      });
      saveProspects(updated);
      return updated;
    });
  }, []);

  const createOutreachJob = useCallback(
    (
      niche: BrandKitNiche,
      targetBusinessName: string,
      targetEmail: string,
      targetCity: string,
    ): BrandKitOutreachJob => {
      const slug = slugify(targetBusinessName, niche);
      const utmParams = new URLSearchParams({
        utm_source: "brf-outreach",
        utm_medium: "email",
        utm_campaign: `brand-kit-${niche}`,
        utm_content: slug,
      }).toString();
      const job: BrandKitOutreachJob = {
        id: generateId(),
        niche,
        targetBusinessName,
        targetEmail,
        targetCity,
        kitSlug: slug,
        status: "pending",
        utmParams,
      };
      const updated = [...outreachJobs, job];
      saveOutreach(updated);
      setOutreachJobs(updated);
      return job;
    },
    [outreachJobs],
  );

  const computeFunnelStats = useCallback((): BrandKitFunnelStats => {
    const byNicheMap: Record<string, number> = {};
    let activated = 0;
    let expired = 0;
    let converted = 0;

    for (const p of prospects) {
      byNicheMap[p.niche] = (byNicheMap[p.niche] ?? 0) + 1;
      if (p.trialStatus === "Active") activated++;
      if (p.trialStatus === "Expired") expired++;
      if (p.trialStatus === "Converted") converted++;
    }

    return {
      totalProspects: prospects.length,
      activated,
      expired,
      converted,
      byNiche: Object.entries(byNicheMap),
    };
  }, [prospects]);

  /** Returns detailed pipeline stage counts for the admin funnel header */
  const getBrandKitFunnelStats = useCallback(() => {
    let sent = 0;
    let opened = 0;
    let activated = 0;
    let active = 0;
    let closing = 0;
    let converted = 0;
    let expired = 0;

    for (const p of prospects) {
      if (p.outreachKitSentAt) sent++;
      if (p.outreachKitOpenedAt) opened++;
      if (p.trialStatus !== "NotStarted") activated++;
      if (p.trialStatus === "Active") {
        if (p.trialDay >= 6) closing++;
        else active++;
      }
      if (p.trialStatus === "Converted") converted++;
      if (p.trialStatus === "Expired") expired++;
    }

    return {
      sent,
      opened,
      activated,
      active,
      closing,
      converted,
      expired,
      total: prospects.length,
    };
  }, [prospects]);

  /** Returns outreach campaign engagement stats */
  const getBrandKitOutreachStats = useCallback((): BrandKitOutreachStats => {
    const byNicheMap: Record<string, number> = {};
    let totalSent = 0;
    let totalOpened = 0;
    let totalClicked = 0;
    let totalConverted = 0;

    for (const job of outreachJobs) {
      byNicheMap[job.niche] = (byNicheMap[job.niche] ?? 0) + 1;
      if (job.status !== "pending") totalSent++;
      if (
        job.status === "opened" ||
        job.status === "clicked" ||
        job.status === "converted"
      )
        totalOpened++;
      if (job.status === "clicked" || job.status === "converted")
        totalClicked++;
      if (job.status === "converted") totalConverted++;
    }

    return {
      totalSent,
      totalOpened,
      totalClicked,
      totalConverted,
      byNiche: Object.entries(byNicheMap),
    };
  }, [outreachJobs]);

  /** Returns the 3-email nudge schedule for a given prospect slug */
  const getTrialNudgeSchedule = useCallback(
    (slug: string): WarmSequenceEmailSchedule[] => {
      const prospect = prospects.find((p) => p.kitPageSlug === slug);
      if (!prospect) return [];
      return buildNudgeSchedule(prospect);
    },
    [prospects],
  );

  const seedDemoProspects = useCallback((): void => {
    const existing = loadProspects();
    if (existing.length > 0) return; // already seeded
    const seeded = DEMO_SEED_NAMES.map(buildDemoProspect);
    saveProspects(seeded);
    setProspects(seeded);
  }, []);

  const funnelStats = computeFunnelStats();

  return {
    prospects,
    outreachJobs,
    funnelStats,
    createProspect,
    triggerOutreachSequence,
    getProspectBySlug,
    activateTrial,
    recordActivity,
    markConverted,
    createOutreachJob,
    computeFunnelStats,
    getBrandKitFunnelStats,
    getBrandKitOutreachStats,
    getTrialNudgeSchedule,
    seedDemoProspects,
  };
}
