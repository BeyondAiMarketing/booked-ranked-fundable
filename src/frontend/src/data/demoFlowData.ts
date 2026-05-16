import type {
  DemoNicheId,
  DemoStep,
  FrameworkBadge,
  PainPointStat,
  RevenueLossItem,
  SocialProofTestimonial,
  VoiceAgentScript,
  WebsiteData,
} from "@/types/demo";

// ─── Framework Badge Definitions ─────────────────────────────────────────────

export const FRAMEWORK_BADGES: Record<string, FrameworkBadge> = {
  brunson: {
    name: "brunson",
    label: "Russell Brunson Framework",
    color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
  deiss: {
    name: "deiss",
    label: "Ryan Deiss Framework",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  hormozi: {
    name: "hormozi",
    label: "Alex Hormozi Framework",
    color: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  ogilvy: {
    name: "ogilvy",
    label: "David Ogilvy Framework",
    color: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
  halbert: {
    name: "halbert",
    label: "Gary Halbert Framework",
    color: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
  kennedy: {
    name: "kennedy",
    label: "Dan Kennedy Framework",
    color: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
};

// ─── 9 Demo Steps Definition (step 0 = intake, steps 1–9 = demo) ─────────────

export const DEMO_STEPS: DemoStep[] = [
  {
    id: "intake",
    stepNumber: 1,
    title: "Your Personalized Demo",
    shortTitle: "Setup",
    coachTip:
      "Enter your real business info — we'll customize every step of this demo just for you.",
    isTransitionStep: true,
  },
  {
    id: "pain-point",
    stepNumber: 2,
    title: "The Hidden Revenue Leak",
    shortTitle: "The Problem",
    coachTip:
      "This stat is from your specific industry. Read it — it probably hurts a little.",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
    painPointStat: {
      stat: "67%",
      statLabel: "of local service calls go unanswered — every single day",
      frameworkBadge: FRAMEWORK_BADGES.brunson,
    },
  },
  {
    id: "voice-agent",
    stepNumber: 3,
    title: "Your AI Receptionist — Live",
    shortTitle: "Voice Agent",
    coachTip:
      "Press the big button below and hear your AI answer a call — using your actual business name.",
    frameworkBadge: FRAMEWORK_BADGES.deiss,
    isVoiceStep: true,
  },
  {
    id: "website-reveal",
    stepNumber: 4,
    title: "Your Website — Already Built",
    shortTitle: "Website",
    coachTip:
      "Scroll through your pre-built website. Notice how it speaks directly to your customers.",
    frameworkBadge: FRAMEWORK_BADGES.deiss,
  },
  {
    id: "crm-leads",
    stepNumber: 5,
    title: "Your Leads & CRM — Live View",
    shortTitle: "CRM",
    coachTip: "Watch new leads come in as you look at this screen.",
    frameworkBadge: FRAMEWORK_BADGES.hormozi,
  },
  {
    id: "reviews",
    stepNumber: 6,
    title: "Reviews on Auto-Pilot",
    shortTitle: "Reviews",
    coachTip:
      "Click the button to see a real review request fire automatically after a completed job.",
    frameworkBadge: FRAMEWORK_BADGES.deiss,
  },
  {
    id: "social-proof",
    stepNumber: 7,
    title: "What Other Businesses Are Saying",
    shortTitle: "Social Proof",
    coachTip: "These are businesses in your exact niche — just like yours.",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
    isTransitionStep: true,
  },
  {
    id: "credit-builder",
    stepNumber: 8,
    title: "Business Credit Builder",
    shortTitle: "Credit",
    coachTip:
      "This is the feature no competitor offers. Watch the 90-day simulation — this is real.",
    frameworkBadge: FRAMEWORK_BADGES.hormozi,
  },
  {
    id: "revenue-calc",
    stepNumber: 9,
    title: "What You're Losing Every Month",
    shortTitle: "Savings",
    coachTip:
      "Real numbers from businesses your size. Add them up — the total will surprise you.",
    frameworkBadge: FRAMEWORK_BADGES.hormozi,
  },
  {
    id: "trial-cta",
    stepNumber: 10,
    title: "Your 7-Day Free Trial Is Ready",
    shortTitle: "Start Trial",
    coachTip:
      "No credit card. 7 days to explore every feature — starting from your first real action.",
    frameworkBadge: FRAMEWORK_BADGES.deiss,
    isTransitionStep: true,
  },
];

// ─── Pain Point Stats per Niche ───────────────────────────────────────────────

export const NICHE_PAIN_POINT_STATS: Record<DemoNicheId, PainPointStat> = {
  plumber: {
    stat: "67%",
    statLabel:
      "of plumbing calls go to voicemail — those jobs go to whoever answers",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
  },
  "med-spa": {
    stat: "48%",
    statLabel:
      "of new med spa inquiries come after hours — and never hear back",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
  },
  hvac: {
    stat: "3.2x",
    statLabel:
      "more revenue for HVAC companies that answer after-hours calls vs. those that don't",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
  },
  restoration: {
    stat: "8 min",
    statLabel:
      "is how long a homeowner waits before calling your competitor after a disaster",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
  },
  "carpet-cleaning": {
    stat: "74%",
    statLabel:
      "of carpet cleaning customers rebook with the first company that follows up",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
  },
  roofing: {
    stat: "4 bids",
    statLabel:
      "is the average number of quotes a homeowner gets — without a strong reputation you lose on price every time",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
  },
  "real-estate": {
    stat: "78%",
    statLabel:
      "of buyers choose the first agent to respond — being second means losing the deal",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
  },
  mortgage: {
    stat: "67%",
    statLabel:
      "of mortgage inquiries come after 5pm — most brokers miss two-thirds of their pipeline",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
  },
  chiropractor: {
    stat: "40%",
    statLabel:
      "of new chiropractic patients don't rebook because no one followed up within 48 hours",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
  },
  dental: {
    stat: "$2,400",
    statLabel:
      "is the average lifetime value a dental practice loses every time a new patient call goes unanswered",
    frameworkBadge: FRAMEWORK_BADGES.brunson,
  },
};

// ─── Plain string map (convenience alias for PainPointStat.statLabel) ─────────

export const PAIN_POINT_STATS: Record<DemoNicheId, string> = Object.fromEntries(
  Object.entries(NICHE_PAIN_POINT_STATS).map(([k, v]) => [k, v.statLabel]),
) as Record<DemoNicheId, string>;

// ─── Revenue Loss Items per Niche ─────────────────────────────────────────────

export const NICHE_REVENUE_LOSS: Record<DemoNicheId, RevenueLossItem[]> = {
  plumber: [
    { label: "AI Receptionist / Voice Agent", monthlyLoss: "$2,800–$3,500" },
    { label: "Social Media Manager", monthlyLoss: "$1,500–$3,000" },
    { label: "Website Manager", monthlyLoss: "$500–$1,500" },
    { label: "Reputation Company", monthlyLoss: "$300–$800" },
    { label: "CRM Software", monthlyLoss: "$100–$300" },
    { label: "SEO Company", monthlyLoss: "$500–$2,000" },
  ],
  "med-spa": [
    { label: "Front Desk / Booking Staff", monthlyLoss: "$3,200–$4,500" },
    { label: "Social Media + Content", monthlyLoss: "$1,500–$3,500" },
    { label: "Email & SMS Marketing", monthlyLoss: "$300–$800" },
    { label: "Reputation Management", monthlyLoss: "$400–$1,000" },
    { label: "Website & SEO", monthlyLoss: "$600–$2,000" },
    { label: "CRM Software", monthlyLoss: "$150–$400" },
  ],
  hvac: [
    { label: "AI Receptionist / Voice Agent", monthlyLoss: "$2,800–$3,500" },
    { label: "Seasonal Campaign Management", monthlyLoss: "$800–$2,500" },
    { label: "Social Media Manager", monthlyLoss: "$1,000–$2,500" },
    { label: "Reputation Company", monthlyLoss: "$300–$800" },
    { label: "CRM Software", monthlyLoss: "$100–$300" },
    { label: "SEO Company", monthlyLoss: "$500–$2,000" },
  ],
  restoration: [
    { label: "24/7 Emergency Dispatch", monthlyLoss: "$3,500–$5,000" },
    { label: "Documentation System", monthlyLoss: "$500–$1,500" },
    { label: "Social Media Manager", monthlyLoss: "$1,000–$2,500" },
    { label: "Reputation Company", monthlyLoss: "$300–$800" },
    { label: "Local SEO Company", monthlyLoss: "$500–$2,000" },
    { label: "CRM Software", monthlyLoss: "$100–$300" },
  ],
  "carpet-cleaning": [
    { label: "Rebooking & Follow-up System", monthlyLoss: "$800–$2,000" },
    { label: "Social Media + Content", monthlyLoss: "$800–$2,000" },
    { label: "Review Management", monthlyLoss: "$200–$600" },
    { label: "Email Marketing", monthlyLoss: "$100–$400" },
    { label: "CRM Software", monthlyLoss: "$100–$300" },
    { label: "Website Manager", monthlyLoss: "$300–$800" },
  ],
  roofing: [
    { label: "AI Receptionist / Voice Agent", monthlyLoss: "$2,800–$3,500" },
    { label: "Storm Alert Campaigns", monthlyLoss: "$500–$1,500" },
    { label: "Social Media Manager", monthlyLoss: "$1,000–$2,500" },
    { label: "Reputation Company", monthlyLoss: "$300–$800" },
    { label: "CRM Software", monthlyLoss: "$100–$300" },
    { label: "SEO Company", monthlyLoss: "$500–$2,000" },
  ],
  "real-estate": [
    { label: "AI Receptionist / VA", monthlyLoss: "$3,000–$5,000" },
    { label: "Social Media Manager", monthlyLoss: "$1,500–$3,500" },
    { label: "CRM & Pipeline Software", monthlyLoss: "$200–$600" },
    { label: "Email Drip Campaigns", monthlyLoss: "$200–$600" },
    { label: "Reputation Company", monthlyLoss: "$300–$800" },
    { label: "Website & SEO", monthlyLoss: "$500–$1,500" },
  ],
  mortgage: [
    { label: "Lead Response System", monthlyLoss: "$2,500–$4,000" },
    { label: "Realtor Referral Nurture", monthlyLoss: "$500–$1,500" },
    { label: "Social Media + Content", monthlyLoss: "$1,000–$2,500" },
    { label: "Review Management", monthlyLoss: "$200–$600" },
    { label: "CRM Software", monthlyLoss: "$150–$400" },
    { label: "SEO Company", monthlyLoss: "$400–$1,500" },
  ],
  chiropractor: [
    { label: "Front Desk / Booking Staff", monthlyLoss: "$2,800–$4,000" },
    { label: "SMS Reminder System", monthlyLoss: "$200–$600" },
    { label: "Patient Reactivation", monthlyLoss: "$300–$1,000" },
    { label: "Review Management", monthlyLoss: "$200–$600" },
    { label: "Social Media Manager", monthlyLoss: "$800–$2,000" },
    { label: "CRM Software", monthlyLoss: "$100–$300" },
  ],
  dental: [
    { label: "Front Desk Overflow Coverage", monthlyLoss: "$2,500–$4,500" },
    { label: "Recall & Reactivation System", monthlyLoss: "$400–$1,200" },
    { label: "Review Management", monthlyLoss: "$300–$800" },
    { label: "Social Media + Content", monthlyLoss: "$800–$2,000" },
    { label: "CRM Software", monthlyLoss: "$150–$400" },
    { label: "Website & SEO", monthlyLoss: "$400–$1,500" },
  ],
};

// ─── Monthly revenue leak numbers (numeric, for counter animation) ─────────────

export const NICHE_REVENUE_LEAK: Record<
  DemoNicheId,
  { missedCalls: number; noReviews: number; noRankings: number }
> = {
  plumber: { missedCalls: 3200, noReviews: 900, noRankings: 1200 },
  "med-spa": { missedCalls: 4100, noReviews: 800, noRankings: 1500 },
  hvac: { missedCalls: 3500, noReviews: 750, noRankings: 1300 },
  restoration: { missedCalls: 4800, noReviews: 600, noRankings: 1100 },
  "carpet-cleaning": { missedCalls: 1500, noReviews: 400, noRankings: 700 },
  roofing: { missedCalls: 3800, noReviews: 1100, noRankings: 1400 },
  "real-estate": { missedCalls: 5200, noReviews: 900, noRankings: 1600 },
  mortgage: { missedCalls: 4200, noReviews: 700, noRankings: 1200 },
  chiropractor: { missedCalls: 3200, noReviews: 600, noRankings: 1000 },
  dental: { missedCalls: 3800, noReviews: 800, noRankings: 1100 },
};

// ─── Social Proof Testimonials per Niche ──────────────────────────────────────

export const NICHE_TESTIMONIALS: Record<DemoNicheId, SocialProofTestimonial[]> =
  {
    plumber: [
      {
        quote:
          "I was losing 5–6 jobs a week to voicemail. Now my AI answers every call and I wake up to booked appointments.",
        business: "AquaFlow Plumbing",
        location: "Houston, TX",
        result: "+$18,400/mo in recaptured revenue",
      },
      {
        quote:
          "Set it up Friday, had 4 new bookings by Sunday morning. I haven't answered a phone in 3 weeks.",
        business: "Precision Plumbing",
        location: "Phoenix, AZ",
        result: "42 new leads in first 30 days",
      },
      {
        quote:
          "The reputation system got us from 14 reviews to 87 in 90 days. We're ranked #1 in our area now.",
        business: "FlowMaster Plumbing",
        location: "Denver, CO",
        result: "#1 Google Maps ranking in 90 days",
      },
    ],
    "med-spa": [
      {
        quote:
          "Our new patient inquiries doubled in 60 days. The AI handles after-hours bookings better than our front desk did.",
        business: "Luxe Aesthetics",
        location: "Scottsdale, AZ",
        result: "2x new patient inquiries in 60 days",
      },
      {
        quote:
          "We used to lose $8K/month in no-shows. SMS reminders cut that by 65% in the first month.",
        business: "Glow Med Spa",
        location: "Miami, FL",
        result: "65% fewer no-shows",
      },
      {
        quote:
          "Social content posts went from once a week to every day. Bookings from Instagram are up 3x.",
        business: "Radiance Skin Studio",
        location: "Beverly Hills, CA",
        result: "3x Instagram bookings",
      },
    ],
    hvac: [
      {
        quote:
          "Off-season used to kill us. Our winter pipeline is now 40% of our summer revenue thanks to automated campaigns.",
        business: "Comfort Masters HVAC",
        location: "Dallas, TX",
        result: "40% of summer revenue in off-season",
      },
      {
        quote:
          "My AI answers every emergency call at 2am. Captured $6,200 in jobs last week that I would have missed.",
        business: "Arctic Air HVAC",
        location: "Las Vegas, NV",
        result: "$6,200 in after-hours jobs recovered",
      },
      {
        quote:
          "Pre-season tune-up campaign filled my schedule 6 weeks out. Best April we've ever had.",
        business: "PrimeCool Air Services",
        location: "Phoenix, AZ",
        result: "6 weeks booked ahead — record April",
      },
    ],
    restoration: [
      {
        quote:
          "First call after a major storm, every time. We get there before the adjuster. That's what this system does.",
        business: "Rapid Restore",
        location: "Tampa, FL",
        result: "#1 call in 3 service areas after storms",
      },
      {
        quote:
          "24/7 emergency line used to cost $4K/month in staffing. Now it costs nothing and responds in seconds.",
        business: "ProRestore Services",
        location: "Orlando, FL",
        result: "$4,000/mo savings on after-hours staffing",
      },
    ],
    "carpet-cleaning": [
      {
        quote:
          "Rebooking sequences brought back 47 customers in 30 days that we hadn't heard from in over a year.",
        business: "Emerald Clean",
        location: "Denver, CO",
        result: "47 reactivated customers in 30 days",
      },
      {
        quote:
          "Before/after posts on Instagram tripled our DMs. The AI responds to every single one instantly.",
        business: "Fresh Start Carpets",
        location: "Sacramento, CA",
        result: "3x Instagram DMs, all captured as leads",
      },
    ],
    roofing: [
      {
        quote:
          "Storm alert campaign fired after a hail event. Had 31 inspection requests in 48 hours. Closed $190K in jobs.",
        business: "Summit Roofing",
        location: "Oklahoma City, OK",
        result: "$190K in storm jobs from one campaign",
      },
      {
        quote:
          "Used to compete on price and lose. Now our reviews make us the obvious choice — we charge 15% more.",
        business: "Ironclad Roofing",
        location: "Kansas City, MO",
        result: "15% higher close rate at premium prices",
      },
    ],
    "real-estate": [
      {
        quote:
          "I respond to every inquiry in seconds now — even at midnight. Closed 3 deals this month that went to voicemail before.",
        business: "Meridian Realty",
        location: "Atlanta, GA",
        result: "3 extra closings in first month",
      },
      {
        quote:
          "My past clients actually refer me now. The automated follow-up makes them feel like I never forgot them.",
        business: "Horizon Real Estate",
        location: "Charlotte, NC",
        result: "2.8x referral rate increase",
      },
    ],
    mortgage: [
      {
        quote:
          "67% of my inquiries came after 5pm. I was missing two-thirds of my pipeline. Now I capture everything.",
        business: "Apex Lending",
        location: "Nashville, TN",
        result: "67% more pipeline captured",
      },
      {
        quote:
          "My Realtor partners say I'm the most responsive broker they know. I close 22 days faster than the market.",
        business: "Summit Mortgage",
        location: "Denver, CO",
        result: "22 days faster to close vs. market avg",
      },
    ],
    chiropractor: [
      {
        quote:
          "No-shows were costing me $3,200/month. SMS reminders dropped that to almost nothing in 45 days.",
        business: "Peak Chiropractic",
        location: "Minneapolis, MN",
        result: "72% fewer no-shows in 45 days",
      },
      {
        quote:
          "Reactivation campaigns brought back 38 dormant patients in 30 days. Pure profit — no ad spend.",
        business: "Align Wellness",
        location: "Columbus, OH",
        result: "38 dormant patients reactivated for free",
      },
    ],
    dental: [
      {
        quote:
          "New patient calls used to go unanswered during adjustments. My AI captures every one now. Revenue is up 34%.",
        business: "Bright Smiles Family Dental",
        location: "Tampa, FL",
        result: "34% revenue increase in 90 days",
      },
      {
        quote:
          "We reactivated 200 lapsed patients with one campaign. That's 6 months of recall appointments filled instantly.",
        business: "Premier Dental Group",
        location: "Austin, TX",
        result: "200 lapsed patients reactivated in 30 days",
      },
    ],
  };

// ─── Voice Agent Scripts per Niche (Full Inbound Call Simulation) ─────────────

export const NICHE_VOICE_SCRIPTS: Record<DemoNicheId, VoiceAgentScript> = {
  plumber: {
    greeting:
      "Thank you for calling [BusinessName], this is your AI front desk. How can I help you today?",
    callerQuestion:
      "Hi, I have a burst pipe in my kitchen — water is everywhere. Can someone come out today?",
    agentResponse:
      "Oh no, that sounds like an emergency — we can absolutely help! I'm checking our schedule right now. We have a licensed plumber available within the next two hours. Can I get your address and confirm the best number to reach you?",
    bookingConfirmation:
      "Perfect, I've got you booked! A plumber from [BusinessName] will arrive between 2:00 and 4:00 PM today. You'll receive a text confirmation right now, and the tech will call 30 minutes before arrival.",
    smsText:
      "Hi! Your emergency plumbing appointment with [BusinessName] is confirmed for today 2:00–4:00 PM. Reply STOP to opt out.",
    callSummary: {
      duration: "1:42",
      request: "Burst pipe emergency",
      actionTaken: "Same-day appointment booked, SMS confirmation sent",
    },
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    voiceName: "Bella",
    callerName: "Mike Johnson",
    appointmentTime: "Today, 2–4 PM",
    serviceName: "Emergency Plumbing",
  },
  "med-spa": {
    greeting:
      "Thank you for calling [BusinessName], this is your AI front desk. How can I help you today?",
    callerQuestion:
      "Hi, I'm interested in booking a Botox treatment. Do you have anything available this week?",
    agentResponse:
      "Absolutely! We'd love to see you. We have a few openings this week — Thursday at 2 PM and Friday at 10 AM. Both are with our lead aesthetician. The consultation is complimentary, and it typically takes about 45 minutes. Which works better for you?",
    bookingConfirmation:
      "Wonderful! I've got you booked for Thursday at 2 PM at [BusinessName]. You'll get a confirmation text right now, plus a reminder the morning of your appointment.",
    smsText:
      "Hi! Your Botox consultation at [BusinessName] is confirmed for Thursday at 2:00 PM. Reply STOP to opt out.",
    callSummary: {
      duration: "1:28",
      request: "Botox treatment booking",
      actionTaken: "Appointment scheduled Thursday 2 PM, SMS sent",
    },
    voiceId: "cjVigY5qzO86Huf0OWal",
    voiceName: "Sophia",
    callerName: "Sarah Chen",
    appointmentTime: "Thursday, 2:00 PM",
    serviceName: "Botox Consultation",
  },
  hvac: {
    greeting:
      "Thank you for calling [BusinessName], this is your AI front desk. How can I help you today?",
    callerQuestion:
      "Hey, my AC stopped working last night and it's 95 degrees outside. Can someone come out today?",
    agentResponse:
      "That's definitely urgent — we'll get someone out to you. I'm pulling up our emergency schedule now. We have a certified HVAC technician available this afternoon. Let me grab your address and we'll get you back in cool air as quickly as possible.",
    bookingConfirmation:
      "All set! A technician from [BusinessName] will be at your door between 1:00 and 3:00 PM today. You'll get a text right now, and the tech will send you a real-time location when they're 30 minutes out.",
    smsText:
      "Hi! Your HVAC emergency appointment with [BusinessName] is confirmed for today 1:00–3:00 PM. Reply STOP to opt out.",
    callSummary: {
      duration: "1:35",
      request: "AC unit not working — emergency",
      actionTaken: "Same-day repair scheduled, SMS confirmation sent",
    },
    voiceId: "MF3mGyEYCl7XYWbV9V6O",
    voiceName: "Elli",
    callerName: "David Torres",
    appointmentTime: "Today, 1–3 PM",
    serviceName: "AC Emergency Repair",
  },
  restoration: {
    greeting:
      "Thank you for calling [BusinessName], this is your AI front desk. How can I help you today?",
    callerQuestion:
      "I just came home to find my basement completely flooded. I don't know what to do — can you help?",
    agentResponse:
      "I'm so sorry — that's incredibly stressful. You've called the right place. We handle water damage emergencies 24/7. I'm dispatching our emergency response team to your address right now. They'll be there within 60 minutes with all the equipment to start extraction immediately.",
    bookingConfirmation:
      "Our emergency crew from [BusinessName] is on their way. You'll receive a text in the next few minutes with the team lead's name and estimated arrival time. Don't move any electronics — they'll handle everything when they arrive.",
    smsText:
      "[BusinessName] emergency team is on the way. ETA: 45–60 min. Stay safe — don't touch electrical items in flooded areas. Reply STOP to opt out.",
    callSummary: {
      duration: "1:52",
      request: "Basement flooding — water damage emergency",
      actionTaken: "Emergency crew dispatched, ETA 45–60 min",
    },
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    voiceName: "Rachel",
    callerName: "Jennifer Park",
    appointmentTime: "Today, 45–60 min ETA",
    serviceName: "Water Damage Emergency",
  },
  "carpet-cleaning": {
    greeting:
      "Thank you for calling [BusinessName], this is your AI front desk. How can I help you today?",
    callerQuestion:
      "Hi, I have guests coming this weekend and my carpets are in pretty bad shape. Is there any availability before Saturday?",
    agentResponse:
      "Great timing — we actually have openings Thursday and Friday this week. For a standard home, our deep clean usually takes about 2 to 3 hours, and your carpets will be dry and ready by evening. Would Thursday or Friday work better for you?",
    bookingConfirmation:
      "Perfect! You're all booked with [BusinessName] for Friday morning at 9 AM. We'll text you a confirmation now and a reminder the night before. Your carpets will be spotless before your guests arrive!",
    smsText:
      "Hi! Your carpet cleaning with [BusinessName] is confirmed for Friday at 9:00 AM. We'll remind you the night before. Reply STOP to opt out.",
    callSummary: {
      duration: "1:22",
      request: "Pre-event deep carpet cleaning",
      actionTaken: "Friday 9 AM appointment booked, SMS sent",
    },
    voiceId: "AZnzlk1XvdvUeBnXmlld",
    voiceName: "Domi",
    callerName: "Amy Wilson",
    appointmentTime: "Friday, 9:00 AM",
    serviceName: "Deep Carpet Cleaning",
  },
  roofing: {
    greeting:
      "Thank you for calling [BusinessName], this is your AI front desk. How can I help you today?",
    callerQuestion:
      "We had a bad storm last night and I think I might have some roof damage. Can someone come take a look?",
    agentResponse:
      "Absolutely — storm inspections are our specialty and we do them at no charge. I can get an inspector out to your property as early as tomorrow morning. The inspection takes about 30 minutes and we'll give you a full written assessment with photos. What's a good time for you?",
    bookingConfirmation:
      "Great — you're scheduled with [BusinessName] for tomorrow at 10 AM for your free storm damage inspection. You'll get a text confirmation now and we'll call if anything changes.",
    smsText:
      "Hi! Your FREE roof inspection with [BusinessName] is confirmed for tomorrow at 10:00 AM. We'll assess any storm damage and provide a written report. Reply STOP to opt out.",
    callSummary: {
      duration: "1:38",
      request: "Post-storm roof inspection",
      actionTaken: "Free inspection booked tomorrow 10 AM, SMS sent",
    },
    voiceId: "XB0fDUnXU5powFXDhCwa",
    voiceName: "Charlotte",
    callerName: "Robert Martinez",
    appointmentTime: "Tomorrow, 10:00 AM",
    serviceName: "Free Storm Inspection",
  },
  "real-estate": {
    greeting:
      "Thank you for calling [BusinessName], this is your AI front desk. How can I help you today?",
    callerQuestion:
      "Hi, I saw your listing on Zillow for the property on Maple Street — is it still available? I'd love to schedule a showing.",
    agentResponse:
      "Great news — that property is still available and I'd love to get you in to see it! I can schedule a showing as early as tomorrow. The home has 3 bedrooms, 2 baths, and the sellers are very motivated. Would morning or afternoon work better for you?",
    bookingConfirmation:
      "Wonderful! You're scheduled for a private showing tomorrow at 11 AM with [BusinessName]. We'll send you the full property details and directions in a text right now. Looking forward to showing you the home!",
    smsText:
      "Hi! Your property showing with [BusinessName] is confirmed for tomorrow at 11:00 AM. Full details and directions attached. Reply STOP to opt out.",
    callSummary: {
      duration: "1:45",
      request: "Property showing — Maple Street listing",
      actionTaken: "Private showing scheduled tomorrow 11 AM",
    },
    voiceId: "pNInz6obpgDQGcFmaJgB",
    voiceName: "Adam",
    callerName: "Lisa Thompson",
    appointmentTime: "Tomorrow, 11:00 AM",
    serviceName: "Private Property Showing",
  },
  mortgage: {
    greeting:
      "Thank you for calling [BusinessName], this is your AI front desk. How can I help you today?",
    callerQuestion:
      "Hi, I'm looking to refinance my home and I was wondering what your current rates are looking like.",
    agentResponse:
      "Great question — rates are actually at a really interesting point right now. One of our licensed mortgage advisors can run a full rate analysis for your specific situation at no charge. It takes about 20 minutes and we can do it over the phone or in person. Would you like to schedule that?",
    bookingConfirmation:
      "Excellent! You're set for a complimentary rate analysis with [BusinessName] on Wednesday at 3 PM. A licensed advisor will call you at this number. We'll send you a confirmation text now and a brief checklist of what to have handy.",
    smsText:
      "Hi! Your free mortgage rate analysis with [BusinessName] is confirmed for Wednesday at 3:00 PM. No obligation — just answers. Reply STOP to opt out.",
    callSummary: {
      duration: "1:33",
      request: "Refinance rate inquiry",
      actionTaken: "Free rate analysis scheduled Wednesday 3 PM",
    },
    voiceId: "oWAxZDx7w5VEj9dCyTzz",
    voiceName: "Grace",
    callerName: "Tom Bradley",
    appointmentTime: "Wednesday, 3:00 PM",
    serviceName: "Free Rate Analysis",
  },
  chiropractor: {
    greeting:
      "Thank you for calling [BusinessName], this is your AI front desk. How can I help you today?",
    callerQuestion:
      "Hi, I've been having really bad lower back pain for about a week. Do you take new patients?",
    agentResponse:
      "Yes, absolutely — we're always welcoming new patients! Chronic lower back pain is one of our most common cases and we have excellent results. Our first appointment includes a full evaluation and your first adjustment. We have an opening as early as tomorrow. Would that work for you?",
    bookingConfirmation:
      "You're all set! Your new patient appointment at [BusinessName] is booked for tomorrow at 9:30 AM. Plan for about an hour. We'll send you the intake forms by text so you can fill them out ahead of time.",
    smsText:
      "Hi! Your new patient appointment at [BusinessName] is confirmed for tomorrow at 9:30 AM. Please complete the intake form: [link]. Reply STOP to opt out.",
    callSummary: {
      duration: "1:40",
      request: "New patient — chronic lower back pain",
      actionTaken: "New patient appointment tomorrow 9:30 AM, intake form sent",
    },
    voiceId: "LcfcDJNUP1GQjkzn1xUU",
    voiceName: "Emily",
    callerName: "Karen Davis",
    appointmentTime: "Tomorrow, 9:30 AM",
    serviceName: "New Patient Evaluation",
  },
  dental: {
    greeting:
      "Thank you for calling [BusinessName], this is your AI front desk. How can I help you today?",
    callerQuestion:
      "Hi, I'm a new patient looking to schedule a cleaning and checkup. Are you accepting new patients?",
    agentResponse:
      "Yes, we're happy to welcome new patients! We make new patient visits really easy — your first appointment includes a full exam, X-rays if needed, and a thorough cleaning. We have openings this week. Would Tuesday or Thursday work for you?",
    bookingConfirmation:
      "Perfect — you're scheduled for your new patient visit at [BusinessName] on Tuesday at 2 PM. We'll send you everything you need by text, including directions and your new patient paperwork. We look forward to seeing you!",
    smsText:
      "Hi! Your new patient appointment at [BusinessName] is confirmed for Tuesday at 2:00 PM. New patient forms: [link]. Reply STOP to opt out.",
    callSummary: {
      duration: "1:28",
      request: "New patient cleaning and checkup",
      actionTaken: "New patient appointment Tuesday 2 PM, forms sent",
    },
    voiceId: "pFZP5JQG7iQjIQuC4Bku",
    voiceName: "Lily",
    callerName: "Brian Foster",
    appointmentTime: "Tuesday, 2:00 PM",
    serviceName: "New Patient Cleaning & Exam",
  },
};

// ─── Website Data per Niche ───────────────────────────────────────────────────

export const NICHE_WEBSITE_DATA: Record<DemoNicheId, WebsiteData> = {
  plumber: {
    before: {
      title: "Generic plumbing website",
      bullets: [
        "No online booking",
        "No AI agent",
        "No reviews widget",
        "Not mobile-optimized",
      ],
    },
    after: {
      title: "[businessName] — AI-Powered",
      bullets: [
        "Live AI booking 24/7",
        "5-star reviews featured",
        "Instant quote form",
        "Emergency call CTA",
      ],
    },
  },
  "med-spa": {
    before: {
      title: "Basic template med spa site",
      bullets: [
        "No booking system",
        "No treatment showcases",
        "No before/after gallery",
        "No chat widget",
      ],
    },
    after: {
      title: "[businessName] — Premium Med Spa",
      bullets: [
        "Live booking calendar",
        "AI consultation chat",
        "Before/after gallery",
        "SMS follow-up on submit",
      ],
    },
  },
  hvac: {
    before: {
      title: "Outdated HVAC company site",
      bullets: [
        "Phone number only",
        "No service area map",
        "No seasonal offers",
        "Not mobile-friendly",
      ],
    },
    after: {
      title: "[businessName] — Emergency HVAC",
      bullets: [
        "Same-day booking button",
        "Service area maps",
        "Seasonal promotions",
        "Emergency call widget",
      ],
    },
  },
  restoration: {
    before: {
      title: "Basic restoration company page",
      bullets: [
        "No emergency CTA",
        "No social proof",
        "No 24/7 indicator",
        "No contact form",
      ],
    },
    after: {
      title: "[businessName] — 24/7 Emergency",
      bullets: [
        "Emergency dispatch button",
        "Instant response indicator",
        "Insurance partner logos",
        "24/7 live chat AI",
      ],
    },
  },
  "carpet-cleaning": {
    before: {
      title: "Simple carpet cleaning site",
      bullets: [
        "No before/after photos",
        "No booking flow",
        "No reviews",
        "No pricing transparency",
      ],
    },
    after: {
      title: "[businessName] — Deep Clean Pros",
      bullets: [
        "Instant online booking",
        "Before/after gallery",
        "Transparent pricing",
        "Review automation active",
      ],
    },
  },
  roofing: {
    before: {
      title: "Basic roofing company website",
      bullets: [
        "No free inspection CTA",
        "No warranty info",
        "No insurance workflow",
        "No financing options",
      ],
    },
    after: {
      title: "[businessName] — Trusted Roofing",
      bullets: [
        "Free inspection booking",
        "Insurance claim support",
        "Warranty guarantee badge",
        "Financing info section",
      ],
    },
  },
  "real-estate": {
    before: {
      title: "Generic real estate agent page",
      bullets: [
        "No property search",
        "No instant response",
        "No market data",
        "No past sales showcase",
      ],
    },
    after: {
      title: "[businessName] — Your Agent",
      bullets: [
        "AI instant response",
        "Featured listings",
        "Market report offer",
        "Testimonials from closings",
      ],
    },
  },
  mortgage: {
    before: {
      title: "Standard mortgage broker page",
      bullets: [
        "No rate quotes",
        "No pre-qual form",
        "No after-hours capture",
        "No Realtor resources",
      ],
    },
    after: {
      title: "[businessName] — Fast Pre-Approval",
      bullets: [
        "10-min pre-qual form",
        "Live rate comparison",
        "After-hours AI capture",
        "Realtor partner portal",
      ],
    },
  },
  chiropractor: {
    before: {
      title: "Basic chiro practice website",
      bullets: [
        "Call to book only",
        "No new patient form",
        "No conditions info",
        "No insurance guide",
      ],
    },
    after: {
      title: "[businessName] — Feel Better Now",
      bullets: [
        "Online new patient form",
        "Treatment library",
        "Insurance guide",
        "AI appointment booking",
      ],
    },
  },
  dental: {
    before: {
      title: "Simple dental practice site",
      bullets: [
        "No online scheduling",
        "No new patient guide",
        "No payment options info",
        "No reviews section",
      ],
    },
    after: {
      title: "[businessName] — Gentle Dental Care",
      bullets: [
        "Online scheduling live",
        "New patient welcome guide",
        "Financing options",
        "Google reviews feed",
      ],
    },
  },
};

// ─── Audit Gaps per Niche ─────────────────────────────────────────────────────

export const NICHE_AUDIT_GAPS: Record<DemoNicheId, string[]> = {
  plumber: [
    "No AI receptionist — 40–67% of calls go to voicemail and are never recovered",
    "No automated follow-up — leads who don't book immediately are permanently lost",
    "Inconsistent Google reviews — you're invisible to customers searching right now",
  ],
  "med-spa": [
    "No after-hours booking — 48% of inquiries come outside business hours and get no response",
    "No automated no-show prevention — SMS reminders could eliminate $3K+/month in lost revenue",
    "No social content automation — competitors posting daily are winning the feed",
  ],
  hvac: [
    "No off-season pipeline — revenue drops 60%+ in shoulder months with no automated campaigns",
    "Missed emergency calls — every after-hours call that goes unanswered goes to a competitor",
    "No pre-season tune-up outreach — your existing customer list is sitting idle",
  ],
  restoration: [
    "No 24/7 emergency dispatch AI — disaster calls at 2am go unanswered while competitors arrive first",
    "No documentation workflow — insurance claims take longer without a digital paper trail",
    "Weak local search presence — customers search 'water damage near me' and you don't appear",
  ],
  "carpet-cleaning": [
    "No rebooking automation — customers forget you exist until their carpets look bad again",
    "No before/after content pipeline — visual proof drives bookings but you're not capturing it",
    "No consistent review generation — sporadic reviews mean inconsistent Google Maps ranking",
  ],
  roofing: [
    "No storm alert campaigns — you're not the first call after a weather event in your area",
    "No reputation differentiation — without 50+ reviews you compete on price and often lose",
    "No automated referral sequences — satisfied customers aren't sending you new business",
  ],
  "real-estate": [
    "No instant inquiry response — 78% of buyers choose the first agent to respond and you're losing by seconds",
    "No past client nurture — closed deals become cold contacts instead of your best referral source",
    "No automated showing scheduler — manual coordination loses motivated buyers to faster agents",
  ],
  mortgage: [
    "No after-hours capture — 67% of inquiries come after 5pm and you're missing most of your pipeline",
    "No Realtor referral nurture — your partner relationships fade without consistent automated touchpoints",
    "No pre-qualification funnel — borrowers who start the process with a competitor rarely switch",
  ],
  chiropractor: [
    "No AI call coverage during adjustments — new patient calls go unanswered and never call back",
    "No SMS reminder system — no-shows are costing $2,400–$4,000/month in empty appointment slots",
    "No patient reactivation — dormant patients haven't been contacted and are seeing a competitor",
  ],
  dental: [
    "No overflow AI answering — busy front desk hours mean missed new patient calls every single week",
    "No automated recall system — lapsed patients aren't being contacted before they find another dentist",
    "No review generation engine — without consistent new Google reviews your ranking slowly drops",
  ],
};
