// ─── Niche Types ─────────────────────────────────────────────────────────────

export type BrandKitNiche =
  | "plumber"
  | "med-spa"
  | "hvac"
  | "restoration"
  | "carpet-cleaning"
  | "roofing"
  | "real-estate"
  | "mortgage"
  | "chiropractor"
  | "dental";

export const NICHE_LABELS: Record<BrandKitNiche, string> = {
  plumber: "Plumber",
  "med-spa": "Med Spa",
  hvac: "HVAC",
  restoration: "Restoration",
  "carpet-cleaning": "Carpet Cleaning",
  roofing: "Roofing",
  "real-estate": "Real Estate Agents/Brokers",
  mortgage: "Mortgage Broker",
  chiropractor: "Chiropractor",
  dental: "Dental Practice",
};

export const NICHE_COLORS: Record<
  BrandKitNiche,
  { primary: string; accent: string }
> = {
  plumber: { primary: "#2563eb", accent: "#0ea5e9" },
  "med-spa": { primary: "#a855f7", accent: "#ec4899" },
  hvac: { primary: "#f97316", accent: "#fbbf24" },
  restoration: { primary: "#10b981", accent: "#06b6d4" },
  "carpet-cleaning": { primary: "#14b8a6", accent: "#6366f1" },
  roofing: { primary: "#dc2626", accent: "#f97316" },
  "real-estate": { primary: "#f59e0b", accent: "#fbbf24" },
  mortgage: { primary: "#10b981", accent: "#34d399" },
  chiropractor: { primary: "#06b6d4", accent: "#22d3ee" },
  dental: { primary: "#6366f1", accent: "#818cf8" },
};

// ─── Trial Types ─────────────────────────────────────────────────────────────

export type TrialStatus = "NotStarted" | "Active" | "Expired" | "Converted";

// ─── Core Prospect ────────────────────────────────────────────────────────────

export interface BrandKitProspect {
  id: string;
  businessName: string;
  niche: BrandKitNiche;
  city: string;
  phone: string;
  website?: string;
  firstName: string;
  createdAt: number;
  kitPageSlug: string;
  trialStatus: TrialStatus;
  trialStartedAt?: number;
  trialDay: number; // 0 = not started, 1–7 = active, 8 = expired
  trialExpiresAt?: number;
  activationAction?: string;
  vapiAssistantId?: string;
  auditScore?: number;
  outreachKitSentAt?: number;
  outreachKitOpenedAt?: number;
  utmSource?: string;
  utmCampaign?: string;
  convertedAt?: number;
  lastActivityAt?: number;
  featuresUsed: string[];
  // Bulk outreach & tracking fields
  lastOpenedAt?: string; // ISO string — set when brand kit landing page loads
  outreachJobId?: string; // Links to a BrandKitOutreachJob.id
  bulkImportBatch?: string; // Batch ID from a CSV bulk import
  isArchived?: boolean; // Soft-archived prospects
}

// ─── Outreach Job ─────────────────────────────────────────────────────────────

export interface BrandKitOutreachJob {
  id: string;
  niche: BrandKitNiche;
  targetBusinessName: string;
  targetEmail: string;
  targetCity: string;
  kitSlug: string;
  status: "pending" | "sent" | "opened" | "clicked" | "converted";
  sentAt?: number;
  openedAt?: number;
  clickedAt?: number;
  utmParams: string;
}

// ─── Funnel Stats ─────────────────────────────────────────────────────────────

export interface BrandKitFunnelStats {
  totalProspects: number;
  activated: number;
  expired: number;
  converted: number;
  byNiche: Array<[string, number]>;
}

// ─── Intake Form ──────────────────────────────────────────────────────────────

export interface BrandKitIntakeForm {
  firstName: string;
  businessName: string;
  niche: BrandKitNiche | "";
  city: string;
  phone: string;
  website: string;
}

// ─── Audit Score ──────────────────────────────────────────────────────────────

export interface NicheAuditScore {
  overall: number;
  seo: number;
  conversion: number;
  reputation: number;
  content: number;
}

/** Deterministic mock scores seeded from niche + city string */
export function computeNicheAuditScore(
  niche: BrandKitNiche,
  city: string,
): NicheAuditScore {
  const seed = (city.length * 7 + niche.length * 13) % 30; // 0–29 offset
  const base: Record<BrandKitNiche, NicheAuditScore> = {
    plumber: {
      overall: 61,
      seo: 55,
      conversion: 48,
      reputation: 72,
      content: 50,
    },
    "med-spa": {
      overall: 58,
      seo: 62,
      conversion: 44,
      reputation: 65,
      content: 55,
    },
    hvac: { overall: 54, seo: 50, conversion: 46, reputation: 68, content: 45 },
    restoration: {
      overall: 49,
      seo: 45,
      conversion: 40,
      reputation: 60,
      content: 42,
    },
    "carpet-cleaning": {
      overall: 52,
      seo: 48,
      conversion: 43,
      reputation: 62,
      content: 47,
    },
    roofing: {
      overall: 57,
      seo: 53,
      conversion: 51,
      reputation: 66,
      content: 48,
    },
    "real-estate": {
      overall: 60,
      seo: 56,
      conversion: 49,
      reputation: 70,
      content: 52,
    },
    mortgage: {
      overall: 55,
      seo: 52,
      conversion: 47,
      reputation: 64,
      content: 49,
    },
    chiropractor: {
      overall: 59,
      seo: 57,
      conversion: 50,
      reputation: 69,
      content: 53,
    },
    dental: {
      overall: 63,
      seo: 60,
      conversion: 54,
      reputation: 73,
      content: 56,
    },
  };
  const b = base[niche];
  const clamp = (v: number) => Math.min(99, Math.max(10, v + seed - 10));
  return {
    overall: clamp(b.overall),
    seo: clamp(b.seo),
    conversion: clamp(b.conversion),
    reputation: clamp(b.reputation),
    content: clamp(b.content),
  };
}

// ─── Niche Content ────────────────────────────────────────────────────────────

export const NICHE_TAGLINES: Record<BrandKitNiche, string> = {
  plumber: "More Calls. More Jobs. Less Stress.",
  "med-spa": "Fill Your Calendar with Dream Clients.",
  hvac: "Stay Busy All Year — Not Just Peak Season.",
  restoration: "Be the First Call When Disaster Strikes.",
  "carpet-cleaning": "Turn Clean Carpets Into 5-Star Reviews.",
  roofing: "Close More Roofs. Spend Less on Ads.",
  "real-estate": "Stop Losing Deals to the Agent Who Responds Faster.",
  mortgage: "Never Lose a Loan to the Broker Who Answered First.",
  chiropractor: "Fill Your Schedule. Keep Your Patients. Grow Your Practice.",
  dental: "More Appointments. Fewer No-Shows. Happier Patients.",
};

export const NICHE_SAMPLE_POSTS: Record<BrandKitNiche, string[]> = {
  plumber: [
    "🚿 Dripping faucet keeping you up at night? Our team fixed 14 of them this week — each one in under an hour. Call us and we'll have yours done today. [Book Now]",
    "❓ Did you know a running toilet can waste 200 gallons of water per day? We've stopped over $3,000 in water bills for homeowners this month alone. DM us for a free check.",
    "⭐ 'Showed up same day, fixed the leak, and left my house cleaner than they found it.' — Sarah M., Dallas. This is what we do every single call. [See Our Reviews]",
  ],
  "med-spa": [
    "✨ 3 clients walked in stressed, walked out glowing — all before noon today. Your skin deserves that same reset. Book your consultation this week.",
    "💉 Botox results that last 3–4 months, starting at $12/unit. We've helped 200+ clients look refreshed without looking 'done.' DM us to see our before/afters.",
    "🌿 The #1 reason clients choose us over the competition? They say we actually listen. Your goals drive your treatment plan — not a menu. [Book a Free Consult]",
  ],
  hvac: [
    "🥵 It's 98° outside and your AC just quit. We have same-day emergency slots open RIGHT NOW. Don't sweat it out — call us before they fill up.",
    "❄️ Pre-season tune-up special: $79 full system check before it gets hot. We've prevented 47 breakdowns this spring alone. Book yours this week.",
    "⭐ 'Fixed in 2 hours, fair price, didn't try to upsell me on stuff I didn't need.' — Mike T., Phoenix. That's the only way we operate. [Read More Reviews]",
  ],
  restoration: [
    "💧 Water damage at 2am? We answer 24/7 and have crews on-site within the hour. Don't wait — every hour costs more in damage. Call us NOW.",
    "🔥 Fire damage is devastating. Mold damage is preventable. We've restored 300+ homes this year — and we treat every one like it's our own. [Free Assessment]",
    "⭐ 'They were here in 45 minutes and made a nightmare situation feel manageable.' — Jennifer L. When it matters most, we show up. [Our Story]",
  ],
  "carpet-cleaning": [
    "🧹 Before: mystery stains, pet odors, high-traffic grey zones. After: looks brand new. We just finished a 3-bedroom in Scottsdale in under 2 hours. [Book Today]",
    "🐾 Pet owners — our enzyme treatment eliminates odors at the source, not just on the surface. 97% of clients say their carpets have never smelled better. DM us.",
    "⭐ 'I was embarrassed to have guests over. Now I show off my floors.' — Amanda K. This is why we do what we do. [See Transformations]",
  ],
  roofing: [
    "🏠 Storm season is here. We've done 23 free inspections this week — 9 of them had damage the homeowner didn't know about. Book yours before your insurance window closes.",
    "💰 The average homeowner overpays $4,200 on a roof replacement because they didn't compare bids. We give you an honest quote and explain every line item. [Get Quote]",
    "⭐ 'On time, clean, done in one day, and my neighbors asked for their card.' — Robert H., Austin. This is our standard, not our exception. [Reviews]",
  ],
  "real-estate": [
    "🏡 3 buyers toured homes yesterday. 2 made offers. The one who didn't? They couldn't reach their agent in time. We respond within seconds — so our clients never miss their window. [Start Here]",
    "📞 78% of buyers choose the first agent to call back. We have systems that respond to every inquiry in seconds — day or night, weekends included. Ask me how. [Let's Talk]",
    "⭐ 'Closed in 28 days. Every call answered. Every question addressed. I felt like I was the only client.' — Marcus T. This is what you deserve from your agent. [Our Reviews]",
  ],
  mortgage: [
    "🏦 Got a rate question at 10pm? Our system captures every inquiry instantly — so you're pre-qualified before most brokers even open their email in the morning. [Apply Now]",
    "💡 67% of mortgage inquiries come after 5pm. Most brokers miss them. We don't. If you're serious about buying, reach out — we answer immediately. [Get Pre-Qualified]",
    "⭐ 'Closed my loan in 21 days. They answered every call, explained every step, and found me a rate I didn't think was possible.' — Denise R. This is how it should work. [Reviews]",
  ],
  chiropractor: [
    "⚕️ 3 new patients this morning — all from calls that came in after 6pm last week. We answer every inquiry 24/7 so you never miss a patient who's finally ready to get help. [Book Now]",
    "📱 Our SMS reminder system dropped our no-show rate by 37% in the first 60 days. Your chair should never be empty when there are patients who need care. [Learn More]",
    "⭐ 'I hadn't been in 8 months — they sent a message that felt personal, not automated. I came back and felt better after one visit.' — Kristin M. [Read More Reviews]",
  ],
  dental: [
    "🦷 Missed your cleaning? You're not alone — but letting it slide costs more than you think. We're booking new patients this week. Takes 60 seconds to schedule. [Book Now]",
    "📅 Our automated reminder system helped 200+ patients not miss their appointments this quarter. Because healthy teeth shouldn't slip through the cracks. [Learn How]",
    "⭐ 'I avoided the dentist for 3 years. They were kind, efficient, and not once did I feel judged. Going back next month.' — Tanya W. [See Our Reviews]",
  ],
};

export const NICHE_PAIN_POINTS: Record<BrandKitNiche, string[]> = {
  plumber: [
    "Phone rings but 40% of calls go to voicemail — jobs lost forever",
    "No system to follow up with leads who didn't book immediately",
    "Relying on word-of-mouth while competitors dominate Google Maps",
  ],
  "med-spa": [
    "Consultation no-shows and last-minute cancellations drain revenue",
    "Competing against MedSpas with bigger ad budgets on Instagram",
    "No automated system to turn first-time clients into repeat bookings",
  ],
  hvac: [
    "Revenue spikes in summer and winter, nothing in between",
    "Hard to stand out when every HVAC company claims 'same-day service'",
    "Technicians stay busy but the pipeline dries up after peak season",
  ],
  restoration: [
    "Missing emergency calls at 2am when the jobs are highest-value",
    "Insurance adjusters need documentation fast — no system to deliver it",
    "Competitors with strong Google presence win the first call every time",
  ],
  "carpet-cleaning": [
    "Low perceived value — customers always try to negotiate the price",
    "No repeat booking system — customers forget you exist until next year",
    "Reviews are sporadic — no consistent flow of new 5-star social proof",
  ],
  roofing: [
    "Storm season is feast, the rest of the year is famine",
    "Homeowners get 4 quotes — without a strong reputation, you lose on price",
    "Leads from paid ads are expensive and often low-quality",
  ],
  "real-estate": [
    "78% of buyers choose the first agent to respond — being second means losing the deal",
    "Leads go cold in minutes — no system for instant response costs deals every week",
    "No consistent follow-up means past clients and referrals are left on the table",
  ],
  mortgage: [
    "Every missed call costs $100–$1,200 in lost commission before you even know it happened",
    "67% of inquiries come after 5pm — most brokers miss two-thirds of their pipeline",
    "No referral nurture system means Realtor partners fade and stop sending leads",
  ],
  chiropractor: [
    "Calls missed during patient adjustments lose new patients to competitors who answer",
    "No-shows and last-minute cancellations leave costly gaps in the treatment schedule",
    "Dormant patients never come back without a proactive reactivation outreach system",
  ],
  dental: [
    "Missed calls during busy front desk hours send new patients to the next practice on the list",
    "No-shows and cancellations leave expensive empty chair time every single week",
    "Lapsed recall patients find a new dentist when no one reaches out to bring them back",
  ],
};

export const NICHE_SOLUTIONS: Record<BrandKitNiche, string[]> = {
  plumber: [
    "AI voice agent answers every call 24/7, qualifies leads, and books jobs",
    "Automated follow-up sequences convert missed calls into booked appointments",
    "Reputation engine drives consistent 5-star Google reviews to dominate Maps",
  ],
  "med-spa": [
    "Smart booking system with SMS reminders that cuts no-shows by 60%",
    "AI-generated Instagram & Facebook content on autopilot — daily niche posts",
    "Automated review requests after every visit build an unstoppable reputation",
  ],
  hvac: [
    "Year-round lead engine with seasonal campaigns that fill the off-season pipeline",
    "Missed call text-back captures every lead even when your team is on a job",
    "Pre-season tune-up campaigns automatically sent to your entire customer list",
  ],
  restoration: [
    "24/7 AI inbound agent answers emergency calls and dispatches instantly",
    "Automated documentation system captures job details for insurance claims",
    "Local SEO engine puts you #1 on Google when people search after a disaster",
  ],
  "carpet-cleaning": [
    "Automated rebooking sequences bring customers back every 6–12 months",
    "Before/after social content automation turns every job into a marketing asset",
    "Review request flows after every job build social proof on autopilot",
  ],
  roofing: [
    "Storm alert campaigns automatically target your service area after weather events",
    "Free audit tripwire converts homeowners to consultations before they get 4 bids",
    "Automated referral sequences turn satisfied customers into your best salespeople",
  ],
  "real-estate": [
    "AI receptionist responds to every buyer and seller inquiry within seconds, 24/7",
    "Automated showing scheduler pre-qualifies leads and books appointments while you're with clients",
    "Post-closing review and referral sequences keep your pipeline full year-round on autopilot",
  ],
  mortgage: [
    "AI captures and pre-qualifies every loan inquiry instantly — including after 5pm and weekends",
    "Automated referral nurture sequences keep Realtor partners sending leads consistently",
    "Review automation after every closing builds the social proof that attracts new borrowers",
  ],
  chiropractor: [
    "AI receptionist books every appointment 24/7 — including while you're in adjustments",
    "Automated SMS reminders sent 48 and 24 hours before appointments cut no-shows by 30–40%",
    "Patient reactivation sequences automatically reach dormant patients and bring them back",
  ],
  dental: [
    "AI receptionist books appointments and handles overflow calls 24/7 without missing a patient",
    "Automated recall sequences remind lapsed patients to book before they find another dentist",
    "Review request flows after every visit build a steady stream of 5-star Google reviews on autopilot",
  ],
};

// ─── Trial Utilities ──────────────────────────────────────────────────────────

const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export function getTrialDaysRemaining(prospect: BrandKitProspect): number {
  if (
    prospect.trialStatus !== "Active" ||
    prospect.trialExpiresAt === undefined
  ) {
    return 0;
  }
  const remaining = prospect.trialExpiresAt - Date.now();
  return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
}

export function getTrialProgress(prospect: BrandKitProspect): number {
  if (
    prospect.trialStatus !== "Active" ||
    prospect.trialStartedAt === undefined
  ) {
    return 0;
  }
  const elapsed = Date.now() - prospect.trialStartedAt;
  return Math.min(100, Math.round((elapsed / TRIAL_DURATION_MS) * 100));
}
