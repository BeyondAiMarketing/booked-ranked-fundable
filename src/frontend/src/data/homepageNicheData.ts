/**
 * homepageNicheData.ts
 * Data powering all 10-niche homepage live demo sections.
 * Used by Stage1DashboardSection, Stage2CreditSection, Stage3SocialSection, etc.
 */

import type { DemoNicheId } from "@/types/demo";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardSample {
  callerName: string;
  callerInitials: string;
  serviceType: string;
  appointmentTime: string;
  phoneDisplay: string;
}

export interface ReputationTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface SocialProofEntry {
  businessName: string;
  achievement: string;
}

export interface HomepageNicheData {
  id: DemoNicheId;
  label: string;
  /** Short pain point stat — used in Stage 1 headline area */
  painPointStat: string;
  /** Full stat label — used below the big number */
  painPointLabel: string;
  /** Emoji icon for quick niche identification */
  icon: string;
  /** Alias for icon — used by HomepageNicheSelector and ticker */
  emoji: string;
  /** Short niche category string for copy generation */
  niche: string;
  /** Short-form label for titles and testimonials */
  nicheLabel: string;
  /** Sample data powering the animated dashboard loop */
  dashboardSample: DashboardSample;
  /** Glassmorphism testimonial at the bottom of Stage 1 */
  testimonialQuote: string;
  testimonialOwner: string;
  testimonialBusiness: string;
  testimonialResult: string;
  /** CSS accent color for niche-tinted elements */
  accentHue: number;

  // ── Stage 3: Reputation & Social fields ──────────────────────────
  reviewerName: string;
  reviewText: string;
  primaryService: string;
  aiReviewResponse: string;
  socialPostExamples: [string, string, string];
  leadName: string;
  leadPhone: string;
  reputationTestimonial: {
    quote: string;
    author: string;
    role: string;
  };
  sampleClientName: string;
  sampleBusinessName: string;

  // ── Social proof ticker ───────────────────────────────────────────
  socialProofEntry: { businessName: string; achievement: string };

  // ── Hero section fields ───────────────────────────────────────────
  painPointNumber: string;
  revenueLoss: number;
  voiceGreeting: string;
  beforeStats: [string, string, string];
  afterStats: [string, string, string];
  accentColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const HOMEPAGE_NICHE_DATA: HomepageNicheData[] = [
  {
    id: "plumber",
    label: "Plumber",
    icon: "🔧",
    emoji: "🔧",
    niche: "plumbing",
    nicheLabel: "Plumbing",
    painPointStat: "67%",
    painPointLabel:
      "of plumbing calls go to voicemail — those jobs go to whoever answers first",
    dashboardSample: {
      callerName: "Mike Johnson",
      callerInitials: "MJ",
      serviceType: "Emergency Plumbing",
      appointmentTime: "Today, 2–4 PM",
      phoneDisplay: "(555) 284-7731",
    },
    testimonialQuote:
      "I was losing 5–6 jobs a week to voicemail. Now my AI answers every call and I wake up to booked appointments.",
    testimonialOwner: "Carlos R.",
    testimonialBusiness: "AquaFlow Plumbing",
    testimonialResult: "+$18,400/mo in recaptured revenue",
    accentHue: 200,
    primaryService: "emergency pipe repair",
    reviewerName: "Jennifer M.",
    reviewText:
      "Fixed our burst pipe in 30 minutes flat. Showed up on time, professional crew, fair price. Won't call anyone else.",
    aiReviewResponse:
      "Thank you Jennifer! We're so glad we could get there quickly during a stressful situation. We truly appreciate you trusting AquaFlow Plumbing — see you next time!",
    socialPostExamples: [
      "Burst pipe at 11pm? We answered, showed up, and fixed it in 30 minutes. That's the AquaFlow promise. ⭐⭐⭐⭐⭐",
      "5 signs your water heater is about to fail (and what to do tonight before it costs you $4,000+)",
      "Behind every emergency call is a family counting on us. Here's how our team prepares for every job.",
    ],
    leadName: "Marcus T.",
    leadPhone: "(555) 247-8831",
    reputationTestimonial: {
      quote:
        "BRF auto-responds to every review and turns our 5-star stories into social posts. Inbound calls are up 38% since we started.",
      author: "Carlos R.",
      role: "Owner, AquaFlow Plumbing",
    },
    sampleClientName: "Carlos R.",
    sampleBusinessName: "AquaFlow Plumbing",
    painPointNumber: "$2,450/day",
    socialProofEntry: {
      businessName: "Martinez Plumbing",
      achievement: "14 new leads this week",
    },
    revenueLoss: 14800,
    voiceGreeting:
      "Thank you for calling [BusinessName], this is your AI front desk. Are you experiencing a plumbing emergency?",
    beforeStats: [
      "Answering 3 of 10 calls",
      "14 Google reviews (3.8★)",
      "No online booking",
    ],
    afterStats: [
      "Every call answered 24/7",
      "87 Google reviews (4.9★)",
      "Booked 3 weeks out",
    ],
    accentColor: "border-blue-400",
  },
  {
    id: "med-spa",
    label: "Med Spa",
    icon: "✨",
    emoji: "✨",
    niche: "med spa",
    nicheLabel: "Med Spa",
    painPointStat: "48%",
    painPointLabel:
      "of new med spa inquiries come after hours — and never hear back",
    dashboardSample: {
      callerName: "Sarah Chen",
      callerInitials: "SC",
      serviceType: "Botox Consultation",
      appointmentTime: "Thursday, 2:00 PM",
      phoneDisplay: "(555) 391-8820",
    },
    testimonialQuote:
      "Our new patient inquiries doubled in 60 days. The AI handles after-hours bookings better than our front desk did.",
    testimonialOwner: "Jessica M.",
    testimonialBusiness: "Luxe Aesthetics",
    testimonialResult: "2x new patient inquiries in 60 days",
    accentHue: 340,
    primaryService: "Botox treatment",
    reviewerName: "Alyssa K.",
    reviewText:
      "Best experience I've had at any med spa. The team was professional, attentive, and my results were incredible. Already booked my follow-up!",
    aiReviewResponse:
      "Thank you so much Alyssa! It means the world to us that you had such a wonderful experience. We can't wait to see you again at Luxe Aesthetics!",
    socialPostExamples: [
      "Before & after Botox — see why 94% of our clients rebook within 90 days. Real results, real confidence. ✨",
      "What no one tells you before your first filler appointment (and why knowing this changes everything).",
      "Our lead aesthetician breaks down the 3 questions every new client should ask before any injectable treatment.",
    ],
    leadName: "Rachel S.",
    leadPhone: "(555) 391-6620",
    reputationTestimonial: {
      quote:
        "Every 5-star review automatically becomes a social post. Our Instagram engagement tripled and we're getting 12+ new consultation requests a week from it.",
      author: "Jessica M.",
      role: "Owner, Luxe Aesthetics",
    },
    sampleClientName: "Jessica M.",
    sampleBusinessName: "Luxe Aesthetics",
    painPointNumber: "67% lost",
    socialProofEntry: {
      businessName: "Glow Med Spa",
      achievement: "3 new 5-star reviews today",
    },
    revenueLoss: 18200,
    voiceGreeting:
      "Thank you for calling [BusinessName]. I'd love to help you schedule your next treatment — what are you interested in?",
    beforeStats: [
      "48% after-hours calls missed",
      "No automated follow-up",
      "8% no-show rate",
    ],
    afterStats: [
      "Every inquiry captured 24/7",
      "Day-7 re-engagement firing",
      "No-shows down 65%",
    ],
    accentColor: "border-pink-400",
  },
  {
    id: "hvac",
    label: "HVAC",
    icon: "❄️",
    emoji: "❄️",
    niche: "HVAC",
    nicheLabel: "HVAC",
    painPointStat: "3.2x",
    painPointLabel:
      "more revenue for HVAC companies that answer after-hours calls vs. those that don't",
    dashboardSample: {
      callerName: "David Torres",
      callerInitials: "DT",
      serviceType: "AC Emergency Repair",
      appointmentTime: "Today, 1–3 PM",
      phoneDisplay: "(555) 447-6612",
    },
    testimonialQuote:
      "My AI answers every emergency call at 2am. Captured $6,200 in jobs last week that I would have missed.",
    testimonialOwner: "Brian K.",
    testimonialBusiness: "Arctic Air HVAC",
    testimonialResult: "$6,200 in after-hours jobs recovered",
    accentHue: 210,
    primaryService: "AC emergency repair",
    reviewerName: "David T.",
    reviewText:
      "Called at 2am with no AC in 95-degree heat. They answered immediately, had a tech out in an hour. Absolute lifesavers.",
    aiReviewResponse:
      "David, thank you so much! Middle-of-the-night calls are exactly why we stay available 24/7 — your comfort can't wait. We're glad Arctic Air got you cooled down fast!",
    socialPostExamples: [
      "2am AC failure during a heat wave — our team answered, arrived in 58 minutes, and had it running before sunrise. ❄️⭐⭐⭐⭐⭐",
      "5 HVAC maintenance tasks that cost $0 now vs. $3,000+ in emergency repairs later (a tech's honest guide).",
      "Why 68% of AC failures happen in the first 3 days of a heat wave — and what you can do this week to prevent yours.",
    ],
    leadName: "Karen L.",
    leadPhone: "(555) 447-9901",
    reputationTestimonial: {
      quote:
        "Reputation management used to be something I ignored. BRF handles all our review responses and the social content practically writes itself. Reviews are up 40%.",
      author: "Brian K.",
      role: "Owner, Arctic Air HVAC",
    },
    sampleClientName: "Brian K.",
    sampleBusinessName: "Arctic Air HVAC",
    painPointNumber: "40% revenue lost",
    socialProofEntry: {
      businessName: "Summit HVAC",
      achievement: "22 jobs booked this month",
    },
    revenueLoss: 16400,
    voiceGreeting:
      "Thank you for calling [BusinessName]. AC emergency or time for a tune-up — we handle both. How can I help?",
    beforeStats: [
      "Revenue drops 60% off-season",
      "After-hours calls missed",
      "No seasonal campaigns",
    ],
    afterStats: [
      "Year-round revenue pipeline",
      "24/7 emergency dispatch",
      "Pre-season waitlist 6 wks out",
    ],
    accentColor: "border-cyan-400",
  },
  {
    id: "restoration",
    label: "Restoration",
    icon: "🏠",
    emoji: "🏠",
    niche: "restoration",
    nicheLabel: "Restoration",
    painPointStat: "8 min",
    painPointLabel:
      "is how long a homeowner waits before calling your competitor after a disaster",
    dashboardSample: {
      callerName: "Jennifer Park",
      callerInitials: "JP",
      serviceType: "Water Damage Emergency",
      appointmentTime: "Today, 45–60 min ETA",
      phoneDisplay: "(555) 563-9944",
    },
    testimonialQuote:
      "First call after a major storm, every time. We get there before the adjuster.",
    testimonialOwner: "Marcus T.",
    testimonialBusiness: "Rapid Restore",
    testimonialResult: "#1 call in 3 service areas after storms",
    accentHue: 30,
    primaryService: "water damage restoration",
    reviewerName: "Robert G.",
    reviewText:
      "Had a pipe burst at midnight and within 20 minutes Rapid Restore had a crew en route. Saved our floors and walls. Unbelievable response time.",
    aiReviewResponse:
      "Robert, thank you for trusting us during such a stressful emergency! Your quick call and our rapid response made all the difference. We're grateful to have protected your home.",
    socialPostExamples: [
      "Midnight pipe burst — crew on-site in 19 minutes, damage contained before it spread to the foundation. This is why response time matters. 🏠⭐⭐⭐⭐⭐",
      "Insurance adjuster checklist: 7 things a professional restoration company should document before they touch anything.",
      "What happens in the first 4 hours after water damage determines 80% of the final repair cost. Here's what we do.",
    ],
    leadName: "Jennifer P.",
    leadPhone: "(555) 563-4422",
    reputationTestimonial: {
      quote:
        "After every job we get a review, BRF responds, and it becomes a social post. We're now the top-reviewed restoration company in our market.",
      author: "Marcus T.",
      role: "Owner, Rapid Restore",
    },
    sampleClientName: "Marcus T.",
    sampleBusinessName: "Rapid Restore",
    painPointNumber: "33% lost after 9pm",
    socialProofEntry: {
      businessName: "Rapid Restore",
      achievement: "First call after every storm",
    },
    revenueLoss: 21000,
    voiceGreeting:
      "Thank you for calling [BusinessName] Emergency Services. We respond 24/7 — is this a water, fire, or mold emergency?",
    beforeStats: [
      "33% after-hours calls missed",
      "Manual dispatch — slow",
      "No insurance workflow",
    ],
    afterStats: [
      "Every emergency call answered",
      "8-min average dispatch time",
      "Insurance workflow automated",
    ],
    accentColor: "border-amber-400",
  },
  {
    id: "carpet-cleaning",
    label: "Carpet Cleaning",
    icon: "🧹",
    emoji: "🧹",
    niche: "carpet cleaning",
    nicheLabel: "Carpet Cleaning",
    painPointStat: "74%",
    painPointLabel:
      "of carpet cleaning customers rebook with the first company that follows up",
    dashboardSample: {
      callerName: "Amy Wilson",
      callerInitials: "AW",
      serviceType: "Deep Carpet Cleaning",
      appointmentTime: "Friday, 9:00 AM",
      phoneDisplay: "(555) 228-5503",
    },
    testimonialQuote:
      "Rebooking sequences brought back 47 customers in 30 days that we hadn't heard from in over a year.",
    testimonialOwner: "Tony B.",
    testimonialBusiness: "Emerald Clean",
    testimonialResult: "47 reactivated customers in 30 days",
    accentHue: 155,
    primaryService: "deep carpet cleaning",
    reviewerName: "Amy W.",
    reviewText:
      "Tony and his team are incredible. Got out stains I thought were permanent and the carpets look brand new. Booked them for quarterly maintenance already!",
    aiReviewResponse:
      "Amy, thank you so much — this made our whole team's day! Quarterly maintenance is the smartest move and we can't wait to keep your carpets looking perfect all year.",
    socialPostExamples: [
      "Pet stains, wine spills, 3-year-old mystery spots — gone in one session. See the before and after that has clients messaging us daily. 🧹⭐⭐⭐⭐⭐",
      "The #1 carpet mistake homeowners make that permanently damages fibers (it's probably happening in your home right now).",
      "Why professional cleaning every 6 months extends carpet life by 8–12 years — the math that pays for itself.",
    ],
    leadName: "Linda C.",
    leadPhone: "(555) 228-7703",
    reputationTestimonial: {
      quote:
        "We turned 12 five-star reviews into 12 social posts that each brought in 2–3 inquiries. BRF basically runs our marketing now.",
      author: "Tony B.",
      role: "Owner, Emerald Clean",
    },
    sampleClientName: "Tony B.",
    sampleBusinessName: "Emerald Clean",
    painPointNumber: "50% rebooking gap",
    socialProofEntry: {
      businessName: "Emerald Clean",
      achievement: "47 reactivated customers this month",
    },
    revenueLoss: 8400,
    voiceGreeting:
      "Thank you for calling [BusinessName]! Ready to make your carpets look brand new? I can get you scheduled in 2 minutes.",
    beforeStats: [
      "1 rebook per customer per year",
      "No follow-up system",
      "No before/after content",
    ],
    afterStats: [
      "2.4x rebook rate automated",
      "6-month re-engagement firing",
      "Before/after posts daily",
    ],
    accentColor: "border-green-400",
  },
  {
    id: "roofing",
    label: "Roofing",
    icon: "🏗️",
    emoji: "🏗️",
    niche: "roofing",
    nicheLabel: "Roofing",
    painPointStat: "4 bids",
    painPointLabel:
      "is the average number of quotes a homeowner gets — without a strong reputation you lose on price every time",
    dashboardSample: {
      callerName: "Robert Martinez",
      callerInitials: "RM",
      serviceType: "Free Storm Inspection",
      appointmentTime: "Tomorrow, 10:00 AM",
      phoneDisplay: "(555) 774-3381",
    },
    testimonialQuote:
      "Storm alert campaign fired after a hail event. Had 31 inspection requests in 48 hours. Closed $190K in jobs.",
    testimonialOwner: "Derek H.",
    testimonialBusiness: "Summit Roofing",
    testimonialResult: "$190K in storm jobs from one campaign",
    accentHue: 75,
    primaryService: "full roof replacement",
    reviewerName: "Sandra R.",
    reviewText:
      "Summit Roofing replaced our entire roof after the hail storm. Professional crew, clean job site, done in one day. Our neighbors all asked who we used.",
    aiReviewResponse:
      "Sandra, thank you so much! Efficiency and a clean site are points of pride for our crew — we're thrilled your neighbors noticed too. Really appreciate you choosing Summit Roofing!",
    socialPostExamples: [
      "Replaced 11 roofs on one street after last week's hail storm. Neighbors referred neighbors — this is what trust looks like. 🏗️⭐⭐⭐⭐⭐",
      "Hail damage hidden from street level: 4 signs your roof was hit and your insurance company won't point them out.",
      "Why your neighbor's new roof cost $12,000 less than the quote you got — the truth about storm insurance supplements.",
    ],
    leadName: "Tom H.",
    leadPhone: "(555) 774-5592",
    reputationTestimonial: {
      quote:
        "After every project we have a new 5-star review on Google. BRF responds and reposts it. We're at 4.9 stars across 140 reviews — impossible to compete with.",
      author: "Derek H.",
      role: "Owner, Summit Roofing",
    },
    sampleClientName: "Derek H.",
    sampleBusinessName: "Summit Roofing",
    painPointNumber: "3x storm leads",
    socialProofEntry: {
      businessName: "A-1 Roofing",
      achievement: "$85K funded — new crew",
    },
    revenueLoss: 19600,
    voiceGreeting:
      "Thank you for calling [BusinessName]. Roof inspection, repair, or full replacement — I can book your free assessment right now.",
    beforeStats: [
      "Competing on price, losing",
      "22 reviews (4.1★)",
      "No storm alert system",
    ],
    afterStats: [
      "Win on reputation, not price",
      "105 reviews (4.9★)",
      "Storm campaign fires in 2 hrs",
    ],
    accentColor: "border-orange-400",
  },
  {
    id: "real-estate",
    label: "Real Estate",
    icon: "🏡",
    emoji: "🏡",
    niche: "real estate",
    nicheLabel: "Real Estate",
    painPointStat: "78%",
    painPointLabel:
      "of buyers choose the first agent to respond — being second means losing the deal",
    dashboardSample: {
      callerName: "Lisa Thompson",
      callerInitials: "LT",
      serviceType: "Private Property Showing",
      appointmentTime: "Tomorrow, 11:00 AM",
      phoneDisplay: "(555) 619-0072",
    },
    testimonialQuote:
      "I respond to every inquiry in seconds now — even at midnight. Closed 3 deals this month that went to voicemail before.",
    testimonialOwner: "Priya S.",
    testimonialBusiness: "Meridian Realty",
    testimonialResult: "3 extra closings in first month",
    accentHue: 270,
    primaryService: "home buying consultation",
    reviewerName: "Lisa T.",
    reviewText:
      "Priya responded to my inquiry within 60 seconds at 10pm and had a showing scheduled for the next morning. Found our dream home in 3 weeks. Absolutely exceptional agent.",
    aiReviewResponse:
      "Lisa, congratulations on your new home! It was a joy working with you and your family. Your trust and kind words mean everything — please send your friends and family my way!",
    socialPostExamples: [
      "Client messaged at 10pm, showing scheduled by 10:05pm, keys in hand 3 weeks later. This is what 24/7 AI responsiveness does for buyers. 🏡⭐⭐⭐⭐⭐",
      "The 3-offer market secret that buyers agents won't tell you: how to win without always bidding highest.",
      "Why 78% of buyers choose the first agent who responds — and how I make sure that's always me, even at midnight.",
    ],
    leadName: "Michael B.",
    leadPhone: "(555) 619-3344",
    reputationTestimonial: {
      quote:
        "My Google reviews went from 14 to 61 in 4 months. BRF auto-requests, auto-responds, and turns every review into content. My referrals doubled.",
      author: "Priya S.",
      role: "Agent, Meridian Realty",
    },
    sampleClientName: "Priya S.",
    sampleBusinessName: "Meridian Realty",
    painPointNumber: "83% first-wins",
    socialProofEntry: {
      businessName: "Meridian Realty",
      achievement: "3 extra closings this month",
    },
    revenueLoss: 24000,
    voiceGreeting:
      "Thank you for calling [BusinessName]. Looking to buy, sell, or just explore? I can schedule you with an agent right now.",
    beforeStats: [
      "Responding in hours, not seconds",
      "Cold leads going dark",
      "Manual showing scheduling",
    ],
    afterStats: [
      "Every inquiry answered instantly",
      "Past clients sending referrals",
      "Showings book themselves",
    ],
    accentColor: "border-indigo-400",
  },
  {
    id: "mortgage",
    label: "Mortgage",
    icon: "📊",
    emoji: "📊",
    niche: "mortgage",
    nicheLabel: "Mortgage",
    painPointStat: "67%",
    painPointLabel:
      "of mortgage inquiries come after 5pm — most brokers miss two-thirds of their pipeline",
    dashboardSample: {
      callerName: "Tom Bradley",
      callerInitials: "TB",
      serviceType: "Free Rate Analysis",
      appointmentTime: "Wednesday, 3:00 PM",
      phoneDisplay: "(555) 882-4417",
    },
    testimonialQuote:
      "My Realtor partners say I'm the most responsive broker they know. I close 22 days faster than the market.",
    testimonialOwner: "James W.",
    testimonialBusiness: "Summit Mortgage",
    testimonialResult: "22 days faster to close vs. market avg",
    accentHue: 240,
    primaryService: "mortgage pre-approval",
    reviewerName: "Tom B.",
    reviewText:
      "James walked us through every step and had our pre-approval ready in 24 hours. We closed 18 days faster than any other offer on the house. Best mortgage experience we've had.",
    aiReviewResponse:
      "Tom, congratulations on your new home! Speed and clarity are what every buyer deserves — we're so glad we could be the team that made it happen. Thank you for trusting Summit Mortgage!",
    socialPostExamples: [
      "Pre-approved in 24 hours, closed 18 days faster than competing offers. This is what being the most responsive broker in your market looks like. 📊⭐⭐⭐⭐⭐",
      "The rate lock timing strategy that saved my clients $14,000 in interest last quarter (most brokers never mention this).",
      "Why your Realtor partner sends you every client: 3 things the fastest-closing brokers do differently.",
    ],
    leadName: "Sarah K.",
    leadPhone: "(555) 882-7755",
    reputationTestimonial: {
      quote:
        "Realtor partners comment on my reviews constantly. BRF keeps them fresh, responds professionally, and my referral pipeline has never been stronger.",
      author: "James W.",
      role: "Broker, Summit Mortgage",
    },
    sampleClientName: "James W.",
    sampleBusinessName: "Summit Mortgage",
    painPointNumber: "7x follow-up wins",
    socialProofEntry: {
      businessName: "Apex Lending",
      achievement: "67% more pipeline captured",
    },
    revenueLoss: 22000,
    voiceGreeting:
      "Thank you for calling [BusinessName]. Ready to explore your mortgage options? I can connect you with a loan advisor in minutes.",
    beforeStats: [
      "67% after-hours leads lost",
      "1 follow-up, then dropped",
      "Realtor referrals fading",
    ],
    afterStats: [
      "All pipeline captured 24/7",
      "7-touch automated sequence",
      "Top broker for 3 realtors",
    ],
    accentColor: "border-violet-400",
  },
  {
    id: "chiropractor",
    label: "Chiropractic",
    icon: "💆",
    emoji: "💆",
    niche: "chiropractic",
    nicheLabel: "Chiropractic",
    painPointStat: "40%",
    painPointLabel:
      "of new chiropractic patients don't rebook because no one followed up within 48 hours",
    dashboardSample: {
      callerName: "Karen Davis",
      callerInitials: "KD",
      serviceType: "New Patient Evaluation",
      appointmentTime: "Tomorrow, 9:30 AM",
      phoneDisplay: "(555) 336-7790",
    },
    testimonialQuote:
      "No-shows were costing me $3,200/month. SMS reminders dropped that to almost nothing in 45 days.",
    testimonialOwner: "Dr. Lisa P.",
    testimonialBusiness: "Peak Chiropractic",
    testimonialResult: "72% fewer no-shows in 45 days",
    accentHue: 180,
    primaryService: "chiropractic adjustment",
    reviewerName: "Karen D.",
    reviewText:
      "Dr. Lisa completely resolved 3 years of lower back pain in 8 sessions. The automated reminders kept me accountable and the online booking is so easy. Life-changing practice.",
    aiReviewResponse:
      "Karen, hearing that your back pain is gone after 3 years means everything to us — this is exactly why we do what we do! Thank you for trusting Peak Chiropractic with your health.",
    socialPostExamples: [
      "3 years of chronic lower back pain — gone after 8 sessions. Here's the adjustment protocol that changed everything for this patient. 💆⭐⭐⭐⭐⭐",
      "The desk posture habit that causes 73% of office workers to need chiropractic care within 5 years (and the 2-minute fix).",
      "Why regular adjustments reduce sick days, improve sleep quality, and boost energy — the research most people never see.",
    ],
    leadName: "David P.",
    leadPhone: "(555) 336-5511",
    reputationTestimonial: {
      quote:
        "We went from 22 Google reviews to 89 in 6 months. Every response is thoughtful and timely. Patients mention our reviews before their first visit.",
      author: "Dr. Lisa P.",
      role: "Owner, Peak Chiropractic",
    },
    sampleClientName: "Dr. Lisa P.",
    sampleBusinessName: "Peak Chiropractic",
    painPointNumber: "200+ lost patients",
    socialProofEntry: {
      businessName: "Peak Chiropractic",
      achievement: "38 reactivated patients free",
    },
    revenueLoss: 12800,
    voiceGreeting:
      "Thank you for calling [BusinessName]. Whether you're in pain or ready for a tune-up, we're here to help. Are you a new patient?",
    beforeStats: [
      "200+ dormant patients",
      "No SMS reminder system",
      "New calls missed during adjustments",
    ],
    afterStats: [
      "Reactivation running monthly",
      "No-shows down 72%",
      "AI covers every call",
    ],
    accentColor: "border-teal-400",
  },
  {
    id: "dental",
    label: "Dental",
    icon: "🦷",
    emoji: "🦷",
    niche: "dental",
    nicheLabel: "Dental",
    painPointStat: "$2,400",
    painPointLabel:
      "is the average lifetime value a dental practice loses every time a new patient call goes unanswered",
    dashboardSample: {
      callerName: "Brian Foster",
      callerInitials: "BF",
      serviceType: "New Patient Cleaning & Exam",
      appointmentTime: "Tuesday, 2:00 PM",
      phoneDisplay: "(555) 115-6638",
    },
    testimonialQuote:
      "New patient calls used to go unanswered during adjustments. My AI captures every one now. Revenue is up 34%.",
    testimonialOwner: "Dr. James O.",
    testimonialBusiness: "Bright Smiles Family Dental",
    testimonialResult: "34% revenue increase in 90 days",
    accentHue: 160,
    primaryService: "new patient exam",
    reviewerName: "Brian F.",
    reviewText:
      "Best dental experience of my life. Dr. James and the whole team are incredible — gentle, thorough, and they actually call you back. Switched my whole family over.",
    aiReviewResponse:
      "Brian, thank you so much for trusting us with your whole family — that means more than any award! We're committed to making every visit as comfortable and positive as possible.",
    socialPostExamples: [
      "Switched their whole family to our practice after one visit. Here's the patient experience philosophy that makes that happen. 🦷⭐⭐⭐⭐⭐",
      "The 3-minute brushing technique most dentists never teach patients (and why it could save you $3,000 in future work).",
      "Why 1 in 4 adults avoid the dentist — and how we've redesigned every touchpoint to change that for our patients.",
    ],
    leadName: "Anna M.",
    leadPhone: "(555) 115-8840",
    reputationTestimonial: {
      quote:
        "New patients mention our Google reviews constantly. BRF requests them, responds to every one, and turns them into social content. Revenue is up 34% in 90 days.",
      author: "Dr. James O.",
      role: "Owner, Bright Smiles Family Dental",
    },
    sampleClientName: "Dr. James O.",
    sampleBusinessName: "Bright Smiles Family Dental",
    painPointNumber: "$800/no-show",
    socialProofEntry: {
      businessName: "Bright Smiles Dental",
      achievement: "34% revenue increase in 90 days",
    },
    revenueLoss: 13600,
    voiceGreeting:
      "Thank you for calling [BusinessName]. Whether it's an emergency or a routine cleaning, I can get you scheduled right now.",
    beforeStats: [
      "3–5 no-shows per week",
      "New calls missed at chairside",
      "Lapsed patients not contacted",
    ],
    afterStats: [
      "No-shows down 65%",
      "Every new call captured",
      "200 lapsed patients recalled",
    ],
    accentColor: "border-rose-400",
  },
];

export const HOMEPAGE_NICHE_LIST = HOMEPAGE_NICHE_DATA;

/**
 * Convenience getter — returns the niche data for a given id.
 * Returns undefined when id is null/undefined/empty or not found.
 * Callers must handle the null case — no implicit plumber fallback.
 */
export function getNicheData(
  id: DemoNicheId | string | null | undefined,
): HomepageNicheData | undefined {
  if (!id) return undefined;
  return HOMEPAGE_NICHE_DATA.find((n) => n.id === id);
}
