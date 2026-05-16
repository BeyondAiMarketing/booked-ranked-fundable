import {
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Edit2,
  ExternalLink,
  Image,
  Instagram,
  Linkedin,
  MessageSquare,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import { useSocialMedia } from "../hooks/useSocialMedia";
import { formatForPlatform } from "../services/socialContentService";
import type { NicheType, SocialPlatform } from "../types/socialMedia";

// ─── Before/After niche templates ─────────────────────────────────────────────

const NICHE_BEFORE_AFTER: Record<
  string,
  { before: string; after: string; hook: string }
> = {
  plumbing: {
    before: "Sump pump failure at 2am. Basement taking on water.",
    after:
      "[Business Name] arrived in 45 minutes, installed new pump, no flooding.",
    hook: "Before: crisis at 2am. After: crisis averted by sunrise.",
  },
  hvac: {
    before: "$340/month energy bills. AC struggling to keep up.",
    after: "[Business Name] installed new system. Bills dropped to $180.",
    hook: "Before: $340/month. After: $180/month. Same house. New system.",
  },
  med_spa: {
    before: "Stubborn [treatment area] for 3 years. Every product failed.",
    after: "One session with [Business Name]. Results after 4 weeks.",
    hook: "3 years of frustration. 1 session. You'd be surprised.",
  },
  restoration: {
    before: "Category 3 water damage. 40% of home affected.",
    after:
      "[Business Name] restored everything in 6 days. Insurance covered 100%.",
    hook: "Before: 40% of the home underwater. After: fully restored, fully covered.",
  },
  carpet_cleaning: {
    before: "6-year-old carpet, pet stains throughout. Thought it was ruined.",
    after: "[Business Name] restored it to like-new condition in 2 hours.",
    hook: "She was ready to replace the whole carpet. Glad she called us first.",
  },
  roofing: {
    before: "Hail damage. 3 estimates, all $15k+. Feeling overwhelmed.",
    after: "[Business Name] worked with insurance. $2,100 out-of-pocket.",
    hook: "3 bids at $15k. We got it done for $2,100. Here's how.",
  },
  real_estate: {
    before:
      "Listed for 47 days with no offers. Frustrated seller, quiet open houses.",
    after: "[Business Name] repriced and staged — sold in 9 days at full ask.",
    hook: "47 days. No offers. 9 days with us. Full asking price.",
  },
  mortgage: {
    before: "Denied by 2 banks. Credit too thin, down payment too small.",
    after: "[Business Name] found a lender. 3.2% rate, closed in 28 days.",
    hook: "Denied twice. Then they found the right lender. Keys in 28 days.",
  },
  chiropractic: {
    before: "Sciatic pain for 2 years. Couldn't sit at a desk. Missed work.",
    after:
      "8 sessions with [Business Name]. Pain-free. Back at full productivity.",
    hook: "2 years of sciatic pain. Gone in 8 sessions.",
  },
  dental: {
    before:
      "Avoided smiling in photos for 4 years. Self-conscious at every event.",
    after: "[Business Name] fixed that in one appointment.",
    hook: "4 years of hiding your smile. One appointment to get it back.",
  },
};

function generateNicheBeforeAfterCaption(
  niche: string,
  businessName: string,
  platform: SocialPlatform,
): string {
  const template =
    NICHE_BEFORE_AFTER[niche.toLowerCase().replace(/\s+/g, "_")] ??
    NICHE_BEFORE_AFTER.plumbing;
  const before = template.before.replace("[Business Name]", businessName);
  const after = template.after.replace("[Business Name]", businessName);
  const hook = template.hook.replace("[Business Name]", businessName);

  if (platform === "instagram") {
    return formatForPlatform(
      `${hook} ✅\n\nBefore: ${before}\nAfter: ${after}\n\nThis is what we do every day. Book your appointment → link in bio ⬆️\n\n#beforeandafter #${niche.toLowerCase().replace(/\s+/g, "")} #results #${businessName.toLowerCase().replace(/\s+/g, "")}`,
      "instagram",
    );
  }
  if (platform === "linkedin") {
    return formatForPlatform(
      `In this industry, the result is the message.\n\n${before}\n\n→ ${after}\n\nThat's not luck. That's process, speed, and the right team. What does your service promise look like in practice?`,
      "linkedin",
    );
  }
  return formatForPlatform(
    `${hook}\n\nBefore: ${before}\nAfter: ${after}\n\nThis is a real client story. If this sounds like your situation, comment HELP or click the link — we'll take it from here.`,
    "facebook",
  );
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

interface MockReview {
  id: string;
  stars: number;
  text: string;
  reviewerName: string;
  source: "Google" | "Yelp" | "Facebook";
  niche: string;
  date: string;
  variants: {
    platform: SocialPlatform;
    content: string;
    qualityScore: number;
  }[];
  status: "pending" | "approved" | "discarded";
  editing: SocialPlatform | null;
}

const INITIAL_REVIEWS: MockReview[] = [
  {
    id: "r-1",
    stars: 5,
    text: "Absolutely incredible service. They arrived within 90 minutes of my call, fixed our burst pipe before it did any more damage, and cleaned up after themselves. Will use them again!",
    reviewerName: "Jennifer M.",
    source: "Google",
    niche: "Plumbing",
    date: "Today",
    variants: [
      {
        platform: "instagram",
        content: formatForPlatform(
          "⭐⭐⭐⭐⭐ Jennifer was in a crisis — burst pipe, water everywhere. We arrived in 90 minutes flat and had it fixed before any real damage was done. This is what we do every single day. Got a plumbing emergency? We've got you. 🚿\n\n#plumbing #emergencyplumber #5stars #burstpipe #plumbingservice",
          "instagram",
        ),
        qualityScore: 91,
      },
      {
        platform: "facebook",
        content: formatForPlatform(
          '"They arrived within 90 minutes of my call, fixed our burst pipe before it did any more damage, and cleaned up after themselves." — Jennifer M. ⭐⭐⭐⭐⭐\n\nWhen a pipe bursts, every minute counts. Our certified plumbers are on call 24/7 so you never face a crisis alone. Comment PIPE or click the link to book your free inspection.',
          "facebook",
        ),
        qualityScore: 88,
      },
      {
        platform: "linkedin",
        content: formatForPlatform(
          "In the service industry, response time is a brand promise.\n\nWhen Jennifer called us with a burst pipe at 8 PM, our team arrived in 90 minutes. The pipe was fixed. The mess was cleaned. The crisis was over before it became a disaster.\n\nThat's not luck — it's operational discipline and the right team.",
          "linkedin",
        ),
        qualityScore: 84,
      },
    ],
    status: "pending",
    editing: null,
  },
  {
    id: "r-2",
    stars: 5,
    text: "My AC went out during a heat wave and they had a tech at my house same day. Diagnosed the issue in 20 minutes and had parts on the truck. Back up and running in under 2 hours. Truly outstanding.",
    reviewerName: "Marcus D.",
    source: "Yelp",
    niche: "HVAC",
    date: "Yesterday",
    variants: [
      {
        platform: "instagram",
        content: formatForPlatform(
          "AC down during a heat wave? Marcus called us at 9 AM — tech was there same day, problem diagnosed in 20 minutes, parts on the truck, running again in 2 hours. 🌡️❄️ No upselling. No waiting. Just results. Ready to book your AC check? Link in bio ⬆️\n\n#hvac #airconditioner #heatwave #acrepair #hvactech",
          "instagram",
        ),
        qualityScore: 93,
      },
      {
        platform: "facebook",
        content: formatForPlatform(
          'Heat wave. AC out. Marcus needed help — fast.\n\nSame-day tech. 20-minute diagnosis. Parts on the truck. Running again in under 2 hours. ⭐⭐⭐⭐⭐\n\n"Truly outstanding" — Marcus D.\n\nDon\'t sweat it out alone. Comment HVAC or click the link to book your same-day assessment.',
          "facebook",
        ),
        qualityScore: 90,
      },
      {
        platform: "linkedin",
        content: formatForPlatform(
          "Same-day service isn't a marketing tagline. It's a commitment that requires fully stocked service vehicles, trained technicians on standby, and dispatch systems that route efficiently.\n\nMarcus's AC failed during a heat wave. 2 hours later, his home was cool. That's the standard we hold every day.",
          "linkedin",
        ),
        qualityScore: 86,
      },
    ],
    status: "pending",
    editing: null,
  },
  {
    id: "r-3",
    stars: 5,
    text: "Booked a Botox consultation and was immediately impressed by how knowledgeable and professional the team is. The results were natural-looking and exactly what I wanted. I've already referred 3 friends.",
    reviewerName: "Sophia R.",
    source: "Google",
    niche: "Med Spa",
    date: "2 days ago",
    variants: [
      {
        platform: "instagram",
        content: formatForPlatform(
          "Natural. Refreshed. Confident. ✨ That's exactly what Sophia asked for — and exactly what she got. She's already referred 3 friends because real results speak louder than any ad. Ready for yours? Book your consultation → link in bio ⬆️\n\n#medspa #botox #naturallook #skincare #antiaging #aesthetics",
          "instagram",
        ),
        qualityScore: 95,
      },
      {
        platform: "facebook",
        content: formatForPlatform(
          "\"The results were natural-looking and exactly what I wanted. I've already referred 3 friends.\" — Sophia R. ⭐⭐⭐⭐⭐\n\nNatural, beautiful results — that's our standard. Not frozen. Not overdone. Just you, refreshed. Thinking about Botox for the first time? Comment CONSULT and we'll send you our complimentary first-visit guide.",
          "facebook",
        ),
        qualityScore: 89,
      },
      {
        platform: "linkedin",
        content: formatForPlatform(
          "The most powerful marketing in aesthetic medicine is word-of-mouth.\n\nSophia booked a Botox consultation, loved her results, and referred 3 friends within the same week. No ad campaign generates that kind of ROI.\n\nInvesting in patient experience and clinical excellence isn't just good medicine — it's good business.",
          "linkedin",
        ),
        qualityScore: 82,
      },
    ],
    status: "pending",
    editing: null,
  },
  {
    id: "r-4",
    stars: 5,
    text: "Water damage from a broken dishwasher line. They were there within 2 hours, extracted all the water, set up drying equipment, and handled everything with our insurance. Could not ask for better.",
    reviewerName: "David K.",
    source: "Facebook",
    niche: "Restoration",
    date: "3 days ago",
    variants: [
      {
        platform: "instagram",
        content: formatForPlatform(
          "Dishwasher line failed at 7 PM. By 9 PM, water was extracted, drying equipment was running, and the insurance claim was underway. David said it best: 'Could not ask for better.' 💧➡️✅\n\n#waterDamage #restoration #emergencyservice #insurance #floodrestoration",
          "instagram",
        ),
        qualityScore: 92,
      },
      {
        platform: "facebook",
        content: formatForPlatform(
          'A broken dishwasher line flooded David\'s kitchen. 2 hours later:\n\n✅ Water extracted\n✅ Industrial drying equipment running\n✅ Insurance claim handled\n\n"Could not ask for better." — David K. ⭐⭐⭐⭐⭐\n\nWater damage gets worse by the hour. Comment HELP or call us now — we respond 24/7.',
          "facebook",
        ),
        qualityScore: 94,
      },
      {
        platform: "linkedin",
        content: formatForPlatform(
          "Speed matters in water damage restoration. Mold can start growing within 24–48 hours. Structure damage compounds every hour moisture sits.\n\nWhen David called us at 7 PM with a flooded kitchen, we were there in 2 hours. Water extracted. Equipment running. Insurance documentation handled.\n\nThe difference between a $3,000 job and a $30,000 job is often response time.",
          "linkedin",
        ),
        qualityScore: 87,
      },
    ],
    status: "pending",
    editing: null,
  },
  {
    id: "r-5",
    stars: 5,
    text: "Had my carpets cleaned before a big family gathering. They transformed rooms that I thought were beyond hope. Pet stains, high-traffic areas — all gone. The whole house smells amazing now.",
    reviewerName: "Lisa T.",
    source: "Google",
    niche: "Carpet Cleaning",
    date: "4 days ago",
    variants: [
      {
        platform: "instagram",
        content: formatForPlatform(
          '"Rooms I thought were beyond hope." Pet stains, high-traffic areas — gone. House smelling incredible. 🏠✨ Lisa had family coming over and we delivered. Before your next gathering, let us show you what deep clean really means. Book now → link in bio ⬆️\n\n#carpetcleaning #petodor #deepclean #freshcarpet #homerefresh',
          "instagram",
        ),
        qualityScore: 90,
      },
      {
        platform: "facebook",
        content: formatForPlatform(
          'Lisa had a family gathering coming up and carpets she thought were ruined — pet stains, years of foot traffic. After our truck-mounted deep clean?\n\n"Rooms I thought were beyond hope." "The whole house smells amazing."\n\n⭐⭐⭐⭐⭐ — Lisa T.\n\nGot a big event coming up? Comment CLEAN and we\'ll get you scheduled.',
          "facebook",
        ),
        qualityScore: 91,
      },
      {
        platform: "linkedin",
        content: formatForPlatform(
          'Customer expectation management is everything in service businesses.\n\nLisa expected improvement. She got transformation — rooms she described as "beyond hope" were restored before her family gathering. Pet stains. High-traffic damage. All gone.\n\nWhen you consistently exceed expectations, reviews write themselves and referrals follow.',
          "linkedin",
        ),
        qualityScore: 83,
      },
    ],
    status: "pending",
    editing: null,
  },
];

interface BeforeAfterPair {
  id: string;
  title: string;
  niche: string;
  nicheKey: NicheType;
  location: string;
  instagramCaption: string;
  facebookCaption: string;
  linkedinCaption: string;
  qualityScore: number;
  status: "pending" | "approved";
  leadsGenerated?: number;
}

const MOCK_BEFORE_AFTER: BeforeAfterPair[] = [
  {
    id: "ba-1",
    title: "Emergency Pipe Replacement",
    niche: "Plumbing",
    nicheKey: "plumbing",
    location: "San Diego, CA",
    instagramCaption: generateNicheBeforeAfterCaption(
      "plumbing",
      "FastFix Plumbing",
      "instagram",
    ),
    facebookCaption: generateNicheBeforeAfterCaption(
      "plumbing",
      "FastFix Plumbing",
      "facebook",
    ),
    linkedinCaption: generateNicheBeforeAfterCaption(
      "plumbing",
      "FastFix Plumbing",
      "linkedin",
    ),
    qualityScore: 93,
    status: "pending",
    leadsGenerated: 0,
  },
  {
    id: "ba-2",
    title: "AC Emergency During Heat Wave",
    niche: "HVAC",
    nicheKey: "hvac",
    location: "Phoenix, AZ",
    instagramCaption: generateNicheBeforeAfterCaption(
      "hvac",
      "Cool Air Pros",
      "instagram",
    ),
    facebookCaption: generateNicheBeforeAfterCaption(
      "hvac",
      "Cool Air Pros",
      "facebook",
    ),
    linkedinCaption: generateNicheBeforeAfterCaption(
      "hvac",
      "Cool Air Pros",
      "linkedin",
    ),
    qualityScore: 91,
    status: "pending",
    leadsGenerated: 0,
  },
  {
    id: "ba-3",
    title: "Roofing Insurance Claim",
    niche: "Roofing",
    nicheKey: "roofing",
    location: "Dallas, TX",
    instagramCaption: generateNicheBeforeAfterCaption(
      "roofing",
      "Storm Guard Roofing",
      "instagram",
    ),
    facebookCaption: generateNicheBeforeAfterCaption(
      "roofing",
      "Storm Guard Roofing",
      "facebook",
    ),
    linkedinCaption: generateNicheBeforeAfterCaption(
      "roofing",
      "Storm Guard Roofing",
      "linkedin",
    ),
    qualityScore: 89,
    status: "pending",
    leadsGenerated: 0,
  },
];

interface TestimonialEntry {
  id: string;
  clientName: string;
  businessType: string;
  originalText: string;
  instagramVersion: string;
  facebookVersion: string;
  linkedinVersion: string;
  status: "pending" | "approved";
  leadsGenerated?: number;
}

const MOCK_TESTIMONIALS: TestimonialEntry[] = [
  {
    id: "t-1",
    clientName: "Carlos Mendez",
    businessType: "Plumbing Business Owner",
    originalText:
      "Since using the AI receptionist, I have not missed a single after-hours call. My booking rate went up 40% in the first month and I did not have to hire anyone new. This system pays for itself every week.",
    instagramVersion:
      '40% more bookings. Zero missed calls. No new hires. 📈\n\n"This system pays for itself every week." — Carlos M., Plumbing Business Owner\n\nYour AI receptionist is waiting. Link in bio ⬆️\n\n#businessgrowth #plumbing #ai #automation #leadgeneration',
    facebookVersion:
      '"Since using the AI receptionist, I have not missed a single after-hours call. My booking rate went up 40% in the first month and I did not have to hire anyone new. This system pays for itself every week." — Carlos M., Plumbing Business Owner\n\nWhat would 40% more bookings mean for your business? Comment DEMO and we\'ll show you exactly how it works for your niche.',
    linkedinVersion:
      "Carlos Mendez runs a plumbing business in San Diego.\n\nBefore: missed after-hours calls, lost jobs to competitors who answered.\nAfter: AI receptionist handling every call, 40% booking rate increase, same team size.\n\nThe ROI question in service businesses isn't whether AI works. It's how fast it pays for itself. For Carlos: Week 1.",
    status: "pending",
    leadsGenerated: 0,
  },
  {
    id: "t-2",
    clientName: "Dr. Amanda Pierce",
    businessType: "Med Spa Owner",
    originalText:
      "The automated review requests alone have tripled our Google rating volume. We went from 47 reviews to 183 in 8 weeks. Our consultation bookings are up 60% because people trust us more when they search for us.",
    instagramVersion:
      '47 reviews → 183 reviews in 8 weeks. Consultation bookings up 60%. 🚀\n\n"People trust us more when they search for us." — Dr. Amanda P., Med Spa Owner\n\nYour reputation is your most valuable marketing channel. Let\'s build it. Link in bio ⬆️\n\n#medspa #googlereviews #reputation #businessgrowth #aesthetics',
    facebookVersion:
      "Dr. Amanda's med spa had 47 Google reviews. In 8 weeks with automated review requests, that jumped to 183.\n\nConsultation bookings: up 60%.\n\n\"People trust us more when they search for us.\"\n\nMore reviews = more trust = more bookings. It's that simple. Want to see how it works for your practice? Comment REVIEWS.",
    linkedinVersion:
      "For Dr. Amanda Pierce, 8 weeks of automated review requests produced:\n\n→ 47 reviews → 183 reviews\n→ 60% increase in consultation bookings\n→ Dominant Google presence in her market\n\nIn aesthetic medicine, search trust drives consultation volume. The math is simple: more authentic reviews, more conversions.",
    status: "pending",
    leadsGenerated: 0,
  },
];

// ─── Quality Badge ─────────────────────────────────────────────────────────────

function QualityBadge({ score }: { score: number }) {
  if (score >= 88) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold badge-emerald">
        <TrendingUp className="h-3 w-3" />
        High
      </span>
    );
  }
  if (score >= 75) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold badge-amber">
        <Zap className="h-3 w-3" />
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold badge-rose">
      Low
    </span>
  );
}

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  switch (platform) {
    case "instagram":
      return <Instagram className="h-3.5 w-3.5" />;
    case "linkedin":
      return <Linkedin className="h-3.5 w-3.5" />;
    case "facebook":
      return <MessageSquare className="h-3.5 w-3.5" />;
    default:
      return <ExternalLink className="h-3.5 w-3.5" />;
  }
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function SocialProofPipelinePage() {
  const { createScheduledPost } = useSocialMedia();

  const [reviews, setReviews] = useState<MockReview[]>(INITIAL_REVIEWS);
  const [beforeAfterPairs, setBeforeAfterPairs] =
    useState<BeforeAfterPair[]>(MOCK_BEFORE_AFTER);
  const [testimonials, setTestimonials] =
    useState<TestimonialEntry[]>(MOCK_TESTIMONIALS);
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [editingContent, setEditingContent] = useState<Record<string, string>>(
    {},
  );
  const [readyQueue, setReadyQueue] = useState<string[]>([]);
  const [trackingLeads, setTrackingLeads] = useState<Record<string, number>>(
    {},
  );

  const convertedToday = reviews.filter((r) => r.status === "approved").length;
  const totalApproved =
    reviews.filter((r) => r.status === "approved").length +
    beforeAfterPairs.filter((b) => b.status === "approved").length +
    testimonials.filter((t) => t.status === "approved").length;

  const totalLeadsGenerated = Object.values(trackingLeads).reduce(
    (s, v) => s + v,
    0,
  );

  // ─── Review handlers ─────────────────────────────────────────────────────────

  const startEditing = (
    reviewId: string,
    platform: SocialPlatform,
    currentContent: string,
  ) => {
    setEditingContent((prev) => ({
      ...prev,
      [`${reviewId}-${platform}`]: currentContent,
    }));
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, editing: platform } : r)),
    );
  };

  const saveEdit = (reviewId: string, platform: SocialPlatform) => {
    const key = `${reviewId}-${platform}`;
    const newContent = editingContent[key];
    if (!newContent) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              editing: null,
              variants: r.variants.map((v) =>
                v.platform === platform ? { ...v, content: newContent } : v,
              ),
            }
          : r,
      ),
    );
    toast.success("Post updated");
  };

  const approveReview = async (review: MockReview) => {
    if (autoSchedule) {
      for (const variant of review.variants) {
        await createScheduledPost({
          tenantId: "tenant-1",
          content: variant.content,
          platforms: [variant.platform],
          scheduledAt: Date.now() + 3600000,
          status: "scheduled",
          niche: "plumbing",
          funnelStage: "mofu",
          marketingFramework: "cialdini_social_proof",
          ctaType: "booking",
          ctaUrl: "https://bookedrankedfunded.org/setup",
          contentCadence: 7,
          platformVariants: {},
          beforeAfterPhoto: null,
          tags: ["review", "social-proof"],
        });
      }
      toast.success("All 3 variants added to scheduler ✓");
    } else {
      setReadyQueue((prev) => [...prev, review.id]);
      toast.success("Moved to Ready Queue for manual scheduling");
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, status: "approved" } : r)),
    );
  };

  const discardReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: "discarded" } : r)),
    );
    toast("Review discarded", { description: "Removed from queue" });
  };

  const approveBeforeAfter = async (pair: BeforeAfterPair) => {
    await createScheduledPost({
      tenantId: "tenant-1",
      content: pair.facebookCaption,
      platforms: ["facebook", "instagram", "linkedin"],
      scheduledAt: Date.now() + 7200000,
      status: "scheduled",
      niche: pair.nicheKey,
      funnelStage: "mofu",
      marketingFramework: "halbert_specificity",
      ctaType: "booking",
      ctaUrl: "https://bookedrankedfunded.org/setup",
      contentCadence: 7,
      platformVariants: {
        instagram: pair.instagramCaption,
        linkedin: pair.linkedinCaption,
      },
      beforeAfterPhoto: null,
      tags: ["before-after", "results"],
    });
    setBeforeAfterPairs((prev) =>
      prev.map((b) => (b.id === pair.id ? { ...b, status: "approved" } : b)),
    );
    toast.success("Before/After posts scheduled across all 3 platforms ✓");
  };

  const approveTestimonial = async (t: TestimonialEntry) => {
    await createScheduledPost({
      tenantId: "tenant-1",
      content: t.facebookVersion,
      platforms: ["facebook", "instagram", "linkedin"],
      scheduledAt: Date.now() + 10800000,
      status: "scheduled",
      niche: "plumbing",
      funnelStage: "bofu",
      marketingFramework: "cialdini_social_proof",
      ctaType: "booking",
      ctaUrl: "https://bookedrankedfunded.org/setup",
      contentCadence: 7,
      platformVariants: {
        instagram: t.instagramVersion,
        linkedin: t.linkedinVersion,
      },
      beforeAfterPhoto: null,
      tags: ["testimonial", "social-proof"],
    });
    setTestimonials((prev) =>
      prev.map((item) =>
        item.id === t.id ? { ...item, status: "approved" } : item,
      ),
    );
    toast.success("Testimonial scheduled across all platforms ✓");
  };

  const simulateLead = (id: string, source: string) => {
    setTrackingLeads((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    toast.success(`Lead attributed to ${source} proof content`, {
      description: "Added to CRM → Social Media source",
    });
  };

  const pendingReviews = reviews.filter((r) => r.status === "pending");
  const pendingBA = beforeAfterPairs.filter((b) => b.status === "pending");
  const pendingTestimonials = testimonials.filter(
    (t) => t.status === "pending",
  );

  return (
    <div
      data-ocid="social_proof_pipeline.page"
      className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="proof-pipeline-panel rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Social Proof Pipeline
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Turn 5-star reviews, before/afters, and testimonials into
              high-converting content — automatically. The Hormozi rule: proof
              converts better than any ad.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Auto-Schedule</span>
            <Switch
              data-ocid="social_proof_pipeline.auto_schedule.toggle"
              checked={autoSchedule}
              onCheckedChange={(val) => {
                setAutoSchedule(val);
                toast(
                  val
                    ? "Auto-schedule enabled — approved content goes straight to the queue"
                    : "Auto-schedule disabled — approved content waits for manual scheduling",
                );
              }}
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            {
              label: "Reviews converted today",
              value: convertedToday,
              color: "text-emerald-400",
              ocid: "social_proof_pipeline.stat_reviews",
            },
            {
              label: "Posts in queue",
              value: totalApproved * 3,
              color: "text-purple-400",
              ocid: "social_proof_pipeline.stat_queue",
            },
            {
              label: "Leads from proof content",
              value: totalLeadsGenerated,
              color: "text-amber-400",
              ocid: "social_proof_pipeline.stat_leads",
            },
            {
              label: autoSchedule ? "Auto-schedule ON" : "Ready to schedule",
              value: autoSchedule ? "✓" : readyQueue.length,
              color: autoSchedule ? "text-emerald-400" : "text-amber-400",
              ocid: "social_proof_pipeline.stat_auto",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              data-ocid={stat.ocid}
              className="bg-background/50 rounded-lg p-3 text-center border border-border"
            >
              <div
                className={`text-2xl font-bold ${stat.color} leading-none mb-1`}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {!autoSchedule && readyQueue.length > 0 && (
          <div
            data-ocid="social_proof_pipeline.ready_queue"
            className="mt-4 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3"
          >
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-amber-300 font-medium">
                {readyQueue.length} items waiting for manual scheduling
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs"
              data-ocid="social_proof_pipeline.schedule_all_button"
              onClick={() => {
                setReadyQueue([]);
                toast.success("All items scheduled");
              }}
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              Schedule All
            </Button>
          </div>
        )}
      </div>

      {/* ── Review → Post Section ───────────────────────────────────────────── */}
      <section data-ocid="social_proof_pipeline.review_section">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-foreground">
              Review → Social Post
            </h2>
            <Badge variant="secondary" className="text-xs">
              {pendingReviews.length} pending
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground text-xs gap-1.5"
            data-ocid="social_proof_pipeline.refresh_reviews_button"
            onClick={() => toast("Scanning for new 5-star reviews...")}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {pendingReviews.length === 0 ? (
            <div
              data-ocid="social_proof_pipeline.reviews_empty_state"
              className="text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground"
            >
              <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">All reviews processed</p>
              <p className="text-sm mt-1">
                New 5-star reviews will appear here automatically
              </p>
            </div>
          ) : (
            pendingReviews.map((review, idx) => (
              <Card
                key={review.id}
                data-ocid={`social_proof_pipeline.review_card.${idx + 1}`}
                className="bg-card border-border review-to-post-card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: review.stars }, (_, i) => (
                            <Star
                              key={`${review.id}-star-${i}`}
                              className="h-4 w-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                        <span
                          className={`social-platform-badge review-source-${review.source.toLowerCase()} text-xs`}
                        >
                          {review.source}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {review.niche}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        "{review.text}"
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        — {review.reviewerName}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Generated Post Variants
                  </p>

                  {review.variants.map((variant, vIdx) => {
                    const editKey = `${review.id}-${variant.platform}`;
                    const isEditing = review.editing === variant.platform;
                    return (
                      <div
                        key={variant.platform}
                        data-ocid={`social_proof_pipeline.variant.${idx + 1}.${vIdx + 1}`}
                        className="bg-muted/20 rounded-lg border border-border p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`social-platform-badge platform-${variant.platform} flex items-center gap-1 text-xs`}
                            >
                              <PlatformIcon platform={variant.platform} />
                              {variant.platform.charAt(0).toUpperCase() +
                                variant.platform.slice(1)}
                            </span>
                            <QualityBadge score={variant.qualityScore} />
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            data-ocid={`social_proof_pipeline.edit_variant.${idx + 1}.${vIdx + 1}`}
                            onClick={() => {
                              if (isEditing)
                                saveEdit(review.id, variant.platform);
                              else
                                startEditing(
                                  review.id,
                                  variant.platform,
                                  variant.content,
                                );
                            }}
                          >
                            {isEditing ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Edit2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>

                        {isEditing ? (
                          <Textarea
                            data-ocid={`social_proof_pipeline.variant_textarea.${idx + 1}.${vIdx + 1}`}
                            value={editingContent[editKey] ?? variant.content}
                            onChange={(e) =>
                              setEditingContent((prev) => ({
                                ...prev,
                                [editKey]: e.target.value,
                              }))
                            }
                            className="text-xs leading-relaxed min-h-[100px] bg-background border-border resize-none"
                          />
                        ) : (
                          <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                            {variant.content}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex gap-2 pt-1">
                    <Button
                      className="flex-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs h-9"
                      variant="outline"
                      data-ocid={`social_proof_pipeline.approve_review.${idx + 1}`}
                      onClick={() => approveReview(review)}
                    >
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      {autoSchedule
                        ? "Approve & Schedule All 3"
                        : "Approve for Queue"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-rose-500/30 text-rose-400 hover:bg-rose-500/15 text-xs h-9 px-3"
                      data-ocid={`social_proof_pipeline.discard_review.${idx + 1}`}
                      onClick={() => discardReview(review.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* ── Before/After Section ────────────────────────────────────────────── */}
      <section data-ocid="social_proof_pipeline.before_after_section">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-foreground">
              Before/After Automation
            </h2>
            <Badge variant="secondary" className="text-xs">
              {pendingBA.length} ready
            </Badge>
          </div>
        </div>

        {/* Niche-specific before/after generator */}
        <div
          className="rounded-xl p-4 mb-4 border"
          style={{
            background: "oklch(0.58 0.22 290 / 6%)",
            borderColor: "oklch(0.58 0.22 290 / 20%)",
          }}
          data-ocid="social_proof_pipeline.ba_niche_explainer"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Niche-specific before/after frameworks built in
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                BRF has pre-built before/after story frameworks for all 10
                niches — Plumbing, HVAC, Med Spa, Restoration, Carpet Cleaning,
                Roofing, Real Estate, Mortgage, Chiropractic, and Dental. Each
                template uses Halbert's specificity framework: real numbers,
                real timelines, real outcomes. Proof that converts.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          data-ocid="social_proof_pipeline.photo_upload"
          className="photo-upload-area rounded-xl flex flex-col items-center justify-center py-8 px-4 mb-4 w-full text-center"
          onClick={() =>
            toast("Photo upload", {
              description:
                "Connect the object-storage extension to enable real photo uploads.",
            })
          }
        >
          <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="font-medium text-sm text-foreground">
            Upload Before/After Photos
          </p>
          <p className="text-xs text-muted-foreground mt-1 text-center max-w-xs">
            Connect the photo storage module to enable uploads. AI will
            auto-generate Halbert-framework captions with location tag and CTA.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 text-xs gap-1.5"
            data-ocid="social_proof_pipeline.connect_photos_button"
            onClick={(e) => {
              e.stopPropagation();
              toast(
                "Object-storage extension required for real photo uploads.",
              );
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Connect Photos
          </Button>
        </button>

        <div className="space-y-4">
          {pendingBA.map((pair, idx) => (
            <Card
              key={pair.id}
              data-ocid={`social_proof_pipeline.before_after_card.${idx + 1}`}
              className="bg-card border-border"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{pair.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {pair.niche}
                    </Badge>
                    <QualityBadge score={pair.qualityScore} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  📍 {pair.location}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* 3-platform previews */}
                {[
                  {
                    platform: "instagram" as SocialPlatform,
                    content: pair.instagramCaption,
                    icon: <Instagram className="h-3.5 w-3.5 text-amber-400" />,
                    label: "Instagram",
                  },
                  {
                    platform: "facebook" as SocialPlatform,
                    content: pair.facebookCaption,
                    icon: (
                      <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                    ),
                    label: "Facebook",
                  },
                  {
                    platform: "linkedin" as SocialPlatform,
                    content: pair.linkedinCaption,
                    icon: <Linkedin className="h-3.5 w-3.5 text-sky-400" />,
                    label: "LinkedIn",
                  },
                ].map(({ icon, label, content }) => (
                  <div
                    key={label}
                    className="bg-muted/20 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      {icon}
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-line line-clamp-4">
                      {content}
                    </p>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs h-9"
                    variant="outline"
                    data-ocid={`social_proof_pipeline.approve_before_after.${idx + 1}`}
                    onClick={() => approveBeforeAfter(pair)}
                  >
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Approve & Schedule (All 3 Platforms)
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-amber-400 hover:bg-amber-500/10 h-9 px-3"
                    data-ocid={`social_proof_pipeline.track_lead.${idx + 1}`}
                    onClick={() => simulateLead(pair.id, pair.niche)}
                  >
                    <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    +Lead ({trackingLeads[pair.id] ?? 0})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Testimonial Section ─────────────────────────────────────────────── */}
      <section data-ocid="social_proof_pipeline.testimonials_section">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-foreground">
            Testimonial Auto-Formatter
          </h2>
          <Badge variant="secondary" className="text-xs">
            {pendingTestimonials.length} ready
          </Badge>
        </div>

        <div className="space-y-4">
          {pendingTestimonials.map((testimonial, idx) => (
            <Card
              key={testimonial.id}
              data-ocid={`social_proof_pipeline.testimonial_card.${idx + 1}`}
              className="bg-card border-border"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">
                      {testimonial.clientName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {testimonial.businessType}
                    </p>
                  </div>
                  <Badge className="badge-purple text-xs">CRM Client</Badge>
                </div>
                <div className="bg-muted/20 rounded-lg p-3 mt-2 border border-border">
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    "{testimonial.originalText}"
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Platform-Optimized Versions
                </p>

                <div
                  data-ocid={`social_proof_pipeline.testimonial_instagram.${idx + 1}`}
                  className="bg-muted/20 rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="social-platform-badge platform-instagram flex items-center gap-1 text-xs">
                      <Instagram className="h-3 w-3" />
                      Instagram
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      max 300 chars • 15 hashtags
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                    {testimonial.instagramVersion}
                  </p>
                </div>

                <div
                  data-ocid={`social_proof_pipeline.testimonial_facebook.${idx + 1}`}
                  className="bg-muted/20 rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="social-platform-badge platform-facebook flex items-center gap-1 text-xs">
                      <MessageSquare className="h-3 w-3" />
                      Facebook
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      story hook • CTA question
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                    {testimonial.facebookVersion}
                  </p>
                </div>

                <div
                  data-ocid={`social_proof_pipeline.testimonial_linkedin.${idx + 1}`}
                  className="bg-muted/20 rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="badge-blue flex items-center gap-1 rounded text-xs px-2 py-0.5 font-semibold">
                      <Linkedin className="h-3 w-3" />
                      LinkedIn
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      thought leadership • minimal emoji
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                    {testimonial.linkedinVersion}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs h-9"
                    variant="outline"
                    data-ocid={`social_proof_pipeline.approve_testimonial.${idx + 1}`}
                    onClick={() => approveTestimonial(testimonial)}
                  >
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Approve for Instagram + Facebook + LinkedIn
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-amber-400 hover:bg-amber-500/10 h-9 px-3"
                    data-ocid={`social_proof_pipeline.track_testimonial_lead.${idx + 1}`}
                    onClick={() =>
                      simulateLead(testimonial.id, testimonial.businessType)
                    }
                  >
                    <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    +Lead ({trackingLeads[testimonial.id] ?? 0})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {pendingTestimonials.length === 0 && (
            <div
              data-ocid="social_proof_pipeline.testimonials_empty_state"
              className="text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground"
            >
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">All testimonials processed</p>
              <p className="text-sm mt-1">
                New CRM testimonials will appear here automatically
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Auto-schedule info ──────────────────────────────────────────────── */}
      <Card
        data-ocid="social_proof_pipeline.schedule_info"
        className="bg-card border-border"
      >
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/15 shrink-0 mt-0.5">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {autoSchedule
                  ? "Auto-Schedule: Enabled"
                  : "Manual Schedule Mode"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {autoSchedule
                  ? "All approved proof content is automatically added to your scheduler queue. Posts are distributed across your content calendar at optimal times."
                  : "Approved content waits in the Ready Queue for manual scheduling. Toggle Auto-Schedule to send content directly to the calendar."}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground gap-1 shrink-0"
              data-ocid="social_proof_pipeline.view_scheduler_button"
              onClick={() => toast("Opening Multi-Platform Scheduler...")}
            >
              View Scheduler
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
