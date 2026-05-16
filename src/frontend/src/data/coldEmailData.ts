// Cold Email Campaign System — Dedicated data file for cold email sequences
// Separate from campaignData.ts (client lifecycle campaigns)
// Used by the Cold Email Hub tabs in CampaignsPage

// ─── Types ───────────────────────────────────────────────────────────────────

export type SequenceStatus = "draft" | "active" | "paused" | "archived";
export type SequenceStopTrigger =
  | "reply"
  | "bounce"
  | "unsubscribe"
  | "complaint"
  | "audit_completed"
  | "manual";

export interface DemoLinkConfig {
  id: string;
  label: string;
  url: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  description: string;
}

export const DEFAULT_DEMO_LINKS: DemoLinkConfig[] = [
  {
    id: "ai-capabilities",
    label: "AI Capabilities Demo",
    url: "/demo?tab=voice",
    utmSource: "email",
    utmMedium: "cold-sequence",
    utmCampaign: "ai-demo",
    utmContent: "",
    description: "Voice agent, chat widget, inbound AI, website widget",
  },
  {
    id: "back-office",
    label: "Back Office Demo",
    url: "/demo?tab=dashboard",
    utmSource: "email",
    utmMedium: "cold-sequence",
    utmCampaign: "back-office-demo",
    utmContent: "",
    description: "CRM, campaigns, reputation, analytics dashboard",
  },
  {
    id: "unified",
    label: "See 2 Live Demos",
    url: "/unified-demo",
    utmSource: "email",
    utmMedium: "cold-sequence",
    utmCampaign: "unified-demo",
    utmContent: "",
    description:
      "Full guided journey: AI demo → Back Office demo → Book a call",
  },
  {
    id: "free-audit",
    label: "Free 3-Stage Audit",
    url: "/free-audit",
    utmSource: "email",
    utmMedium: "cold-sequence",
    utmCampaign: "free-audit",
    utmContent: "",
    description: "Free 3-stage website and online presence audit",
  },
];

export interface EmailVariant {
  id: string;
  label: string;
  subject: string;
  body: string;
  isActive: boolean;
}

export interface EmailTouch {
  id: string;
  touchNumber: number;
  dayOffset: number;
  framework: string;
  frameworkRationale: string;
  variants: EmailVariant[];
  primaryCtaLabel: string;
  primaryCtaType: "audit" | "ai-demo" | "back-office-demo" | "unified-demo";
  secondaryCtaLabel?: string;
  secondaryCtaType?: "audit" | "ai-demo" | "back-office-demo" | "unified-demo";
  personalizationTokens: string[];
}

export interface ColdEmailSequence {
  id: string;
  niche: string;
  name: string;
  description: string;
  pain: string;
  angle: string;
  touches: EmailTouch[];
  stopTriggers: SequenceStopTrigger[];
  throttlePerDay: number;
  status: SequenceStatus;
  /** Routing provider: cold sequences always use custom SMTP or Listmonk — NEVER Caffeine native */
  provider: "listmonk" | "custom_smtp";
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentEvent {
  id: string;
  type:
    | "enrolled"
    | "sent"
    | "opened"
    | "clicked"
    | "replied"
    | "bounced"
    | "unsubscribed"
    | "audit_completed"
    | "paused"
    | "stopped"
    | "resumed";
  touchNumber?: number;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface SequenceEnrollment {
  id: string;
  sequenceId: string;
  leadId: string;
  leadName: string;
  businessName: string;
  city: string;
  niche: string;
  email: string;
  status: "active" | "paused" | "stopped" | "completed" | "converted";
  stopReason?: SequenceStopTrigger;
  currentTouchIndex: number;
  enrolledAt: string;
  nextSendAt?: string;
  events: EnrollmentEvent[];
}

export interface TouchPerformance {
  touchId: string;
  touchNumber: number;
  framework: string;
  sent: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  isHighlighted: boolean;
}

export interface SequencePerformance {
  sequenceId: string;
  niche: string;
  totalEnrolled: number;
  totalSent: number;
  openRate: number;
  clickRate: number;
  auditCompletionRate: number;
  demoVisitRate: number;
  replyRate: number;
  conversionRate: number;
  touchPerformance: TouchPerformance[];
  bestPerformingTouchId: string;
}

export interface DemoLinkManagerConfig {
  sequenceId: string;
  touchId: string;
  demoLinkId: string;
  customUtmContent: string;
}

export interface AuditTripwireConfig {
  auditUrl: string;
  warmSequenceId: string;
  notifyAdmin: boolean;
  autoRemoveFromColdSequence: boolean;
}

// ─── Plumber Sequence ─────────────────────────────────────────────────────────

export const PLUMBER_COLD_SEQUENCE: ColdEmailSequence = {
  id: "plumbing-cold-sequence",
  niche: "plumbing",
  name: "Plumber Cold Outreach — 5-Touch Revenue Recovery",
  description:
    "Targets local plumbers losing booked jobs to missed calls and weak online presence. 5-touch sequence using 10 marketing master frameworks.",
  pain: "Missed calls = lost jobs to competitors",
  angle: "Revenue loss from missed calls with a free audit as the tripwire",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 50,
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-04-10T14:22:00Z",
  stopTriggers: [
    "reply",
    "bounce",
    "unsubscribe",
    "complaint",
    "audit_completed",
  ],
  touches: [
    {
      id: "plumb-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Ogilvy + Hopkins",
      frameworkRationale:
        "Ogilvy: one specific, researched observation shows you did your homework. Hopkins: name the exact problem before they ask — specificity builds instant credibility and differentiates from generic cold outreach.",
      primaryCtaLabel: "Get Your Free Plumbing Business Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_finding}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "plumb-t1-a",
          label: "Variant A",
          subject: "3 things costing {{business_name}} booked jobs in {{city}}",
          isActive: true,
          body: `Hi {{owner_name}},

I was looking at {{business_name}}'s online presence today and noticed three specific things that are likely costing you booked jobs in {{city}} every week:

1. {{audit_finding}} — this is the #1 conversion killer we see for plumbers in competitive markets
2. No visible 24/7 response path — when a pipe bursts at 11pm, the first plumber to respond wins the job
3. Your review velocity has slowed — competitors with 4.8+ ratings are ranking above you in local search

I've seen plumbers in markets like yours lose $2,000–$4,000/week in revenue to these exact issues while their competitors (who fixed them) are fully booked.

The good news: all three are fixable, and I can show you exactly what's wrong — for free.

We built a free 3-stage plumbing business scorecard that takes 60 seconds and shows you your SEO score, reputation score, and website conversion score with specific action items.

No sales call required. No credit card. Just an honest look at where your business stands.

→ {{audit_link}}

Worth 60 seconds?

Best,
David
Booked Ranked Fundable`,
        },
        {
          id: "plumb-t1-b",
          label: "Variant B",
          subject:
            "{{city}} plumbers are losing $2,400/week to this one problem",
          isActive: false,
          body: `Hi {{owner_name}},

Here's a stat that surprises most plumbers I talk to: the average missed call to a plumbing business represents $400–$600 in lost revenue. If you're missing 4–6 calls a week — which is common — that's $2,400+ gone every single week to whoever answers first.

Looking at {{business_name}}, I noticed {{audit_finding}}. That's a signal that potential customers are likely bouncing before they even try to call.

I'm not here to pitch you anything today. I want to show you exactly where your business stands with a free 3-stage scorecard — SEO, reputation, and website conversion. Takes 60 seconds. Gives you a specific action list.

→ {{audit_link}}

If the numbers look good, great — I'll leave you alone. If they don't, we can talk.

David
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "plumb-t2",
      touchNumber: 2,
      dayOffset: 3,
      framework: "Suby PASTOR",
      frameworkRationale:
        "Suby PASTOR: amplify the pain through a relatable story, then show the transformation. Story makes abstract benefits concrete. Works best as second touch when the prospect has seen the opener but hasn't acted.",
      primaryCtaLabel: "See Your AI Front Desk Handle a Real Call",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Or grab your free scorecard first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "plumb-t2-a",
          label: "Variant A",
          subject: "What happened when a {{city}} plumber got their free audit",
          isActive: true,
          body: `Hi {{owner_name}},

Let me tell you about a plumber in a market just like {{city}}.

He was good at his job. Fully licensed, solid reputation, 4.3 stars. But he kept losing jobs to a competitor who wasn't even better — just faster to respond.

The problem? While he was under a sink, his competitor had an AI front desk that answered every call in under 2 seconds, asked the right questions, booked the job, and sent a confirmation text — all automatically.

By the time he surfaced and called back, the customer had already booked with the other guy.

**P**roblem: Missed calls are silent revenue killers that never show up on your P&L.
**A**mplify: Every week you don't fix this, a competitor is getting richer from your lost leads.
**S**tory: That plumber is now using the same AI system. His close rate on new inquiries went from 34% to 71% in 60 days.
**T**ransformation: His phone rings, the AI answers, the job gets booked — even at 2am.
**O**ffer: I'd like to show you exactly how this works in a 2-minute live demo.
**R**esponse: → {{demo_link}}

No setup required on your end. Just watch it handle a real call.

If you haven't grabbed your free scorecard yet: → {{audit_link}}

David
Booked Ranked Fundable`,
        },
        {
          id: "plumb-t2-b",
          label: "Variant B",
          subject:
            "The #1 reason plumbers lose jobs to competitors (not what you think)",
          isActive: false,
          body: `Hi {{owner_name}},

Most plumbers think they lose jobs because of price. The data says otherwise.

The #1 reason a homeowner chooses a competitor? Speed of response. Not price. Not reviews. Speed.

The plumber who responds in under 3 minutes wins the job 78% of the time. The one who calls back in 2 hours? Almost never gets it.

For {{business_name}}, this is a solvable problem. An AI front desk answers every call, texts every missed call, and books jobs while you're working.

I built a 2-minute demo that shows exactly how this works for a plumbing business in {{city}}.

Watch it here: → {{demo_link}}

Or if you want to see your business's specific gaps first: → {{audit_link}}

David`,
        },
      ],
    },
    {
      id: "plumb-t3",
      touchNumber: 3,
      dayOffset: 7,
      framework: "Hormozi Value Stack",
      frameworkRationale:
        "Hormozi: grand slam offer with stacked value and eliminated risk. At this touch, prospects are solution-aware — show them exactly what they get and make the cost of inaction bigger than the cost of action.",
      primaryCtaLabel: "See Both Demos: AI Agent + Back Office Dashboard",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Still haven't grabbed your free scorecard?",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "plumb-t3-a",
          label: "Variant A",
          subject: "What {{business_name}} gets for $0 today",
          isActive: true,
          body: `Hi {{owner_name}},

Let me stack up what's inside our system for a plumbing business like {{business_name}}:

✓ AI front desk that answers every call in under 2 seconds ($297/mo value)
✓ Automatic missed-call SMS that converts voicemails into booked jobs ($97/mo value)
✓ CRM that logs every lead, call, and booking automatically ($149/mo value)
✓ Reputation system that requests reviews after every completed job ($79/mo value)
✓ SEO visibility tracker showing where you rank vs. competitors in {{city}} ($129/mo value)
✓ Weekly performance report emailed to you every Monday ($49/mo value)

Combined value: $800+/month.

The math on doing nothing: if you're missing 5 calls/week at $500/job average, that's $130,000/year walking out the door.

See both the AI front desk and back office together in 6 minutes:

→ /services-demo?niche=plumbing&businessName={{business_name}}&source=cold_email_touch_3

Still on the fence? The free scorecard shows your specific numbers: → {{audit_link}}

No obligation either way.

David`,
        },
        {
          id: "plumb-t3-b",
          label: "Variant B",
          subject: "The AI front desk stack: here's every piece (and the math)",
          isActive: false,
          body: `Hi {{owner_name}},

Quick math for {{business_name}}:

Average plumbing job value: $380–$620
Missed calls per week (industry avg for businesses without AI): 6–9
Weekly revenue lost: $2,280–$5,580
Annual revenue lost: $118,560–$290,160

That's the cost of not fixing this.

Here's what fixes it — and what each piece does:
• AI call answering → books jobs while you work
• Missed call SMS → captures callers who don't leave voicemails
• Automated review requests → builds your star rating
• Lead pipeline → you see every prospect and their status
• SEO tracking → you know where you rank in {{city}} vs. competitors

See both demos back to back — AI agent and the back office dashboard:

→ /services-demo?niche=plumbing&businessName={{business_name}}&source=cold_email_touch_3

Or start with your free scorecard: → {{audit_link}}

David`,
        },
      ],
    },
    {
      id: "plumb-t4",
      touchNumber: 4,
      dayOffset: 12,
      framework: "Halbert + Abraham",
      frameworkRationale:
        "Halbert: problem-agitate-solve with human conversational tone. Abraham: strategy of preeminence — position as the trusted advisor, not a vendor. At touch 4, social proof and positioning are more persuasive than features.",
      primaryCtaLabel: "See Both Demos Back to Back",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
      ],
      variants: [
        {
          id: "plumb-t4-a",
          label: "Variant A",
          subject: "How {{city}} plumbers are becoming the obvious choice",
          isActive: true,
          body: `Hi {{owner_name}},

There's a shift happening in local service markets, and {{city}} is no exception.

The plumbers who are winning right now aren't necessarily better at their craft. They're just more visible, more responsive, and more trusted online. When a homeowner searches "emergency plumber {{city}}" at 10pm, the business that shows up with 200+ reviews, a 4.9 rating, and a website that loads fast and shows a phone number immediately — that business gets the call.

The plumbers losing? Good at their work. Invisible online. No system to capture and follow up with leads.

I'm not here to sell you on a platform. I'm here because I think you could be the obvious choice in your market — and right now you might be leaving that position open for a competitor to take.

Here's the simplest way to see what I mean: watch both demos back to back. The first shows how your customers would experience your business with our system. The second shows what you'd see running it.

Takes 6 minutes. Completely free. No presentation, no sales call.

→ {{demo_link}}

David`,
        },
        {
          id: "plumb-t4-b",
          label: "Variant B",
          subject: "The trusted advisor approach (this changes the game)",
          isActive: false,
          body: `Hi {{owner_name}},

The most successful local service businesses I work with have one thing in common: they've positioned themselves as the trusted advisor in their market — not just another vendor.

That means when someone in {{city}} needs a plumber, {{business_name}} is the obvious, trusted answer. Not because of price. Because of presence, reputation, and responsiveness.

Three plumbing businesses I've worked with this quarter averaged 43 new Google reviews in 90 days, a 34% lift in inbound calls, and their first page Google ranking for their top service keywords.

I'd like to show you how. Both demos together take 6 minutes.

→ {{demo_link}}

David`,
        },
      ],
    },
    {
      id: "plumb-t5",
      touchNumber: 5,
      dayOffset: 18,
      framework: "Kennedy Break-up",
      frameworkRationale:
        "Kennedy: zero fluff, direct respect for their time. The break-up email often gets the highest reply rate — it triggers a decision. Clear, no-pressure final ask. Never beg or manipulate — just close the loop honestly.",
      primaryCtaLabel: "Last Chance: Get Your Free Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "plumb-t5-a",
          label: "Variant A",
          subject: "Closing the loop on {{business_name}}",
          isActive: true,
          body: `Hi {{owner_name}},

I've sent you four notes over the past few weeks. You haven't responded, which tells me one of three things:

1. You're too busy (that's most plumbers — no judgment)
2. This isn't a priority right now
3. You've already solved the missed-call and online presence problem

Any of those are valid. I'm not here to pressure you.

If you're still losing jobs to competitors in {{city}} because of missed calls or a weak online presence, the free scorecard is still open. It's 60 seconds and shows you exactly where you stand — no sales call attached.

→ {{audit_link}}

If not, I'll stop reaching out. Either way, I wish {{business_name}} the best.

David
Booked Ranked Fundable

P.S. The break-even math is simple: if the scorecard finds one thing that brings in one extra job per week, it's paid for itself many times over.`,
        },
        {
          id: "plumb-t5-b",
          label: "Variant B",
          subject: "Last note — then I'll get out of your inbox",
          isActive: false,
          body: `Hi {{owner_name}},

This is my last note.

I think {{business_name}} has a real opportunity to capture more market share in {{city}}. I've tried to show you what that looks like a few times now.

If the timing's wrong or you're not interested, that's completely fine — just reply and let me know and I'll remove you from my list immediately.

If you're still curious about where your business stands, the free 3-stage scorecard is still available: → {{audit_link}}

Either way, I appreciate your time.

David`,
        },
      ],
    },
  ],
};

// ─── Med Spa Sequence ─────────────────────────────────────────────────────────

export const MED_SPA_COLD_SEQUENCE: ColdEmailSequence = {
  id: "medspa-cold-sequence",
  niche: "medspa",
  name: "Med Spa Cold Outreach — 5-Touch Booking Growth",
  description:
    "Targets med spas with inconsistent bookings, weak online presence, and reputation gaps. Positions BRF as the system that makes them the obvious choice in their market.",
  pain: "Inconsistent bookings, weak online presence, reputation gaps",
  angle:
    "Competitors filling their books with AI while you're losing ground — free audit as tripwire",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 40,
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-04-10T14:22:00Z",
  stopTriggers: [
    "reply",
    "bounce",
    "unsubscribe",
    "complaint",
    "audit_completed",
  ],
  touches: [
    {
      id: "medspa-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Ogilvy + Abraham",
      frameworkRationale:
        "Ogilvy: research-first approach shows you did your homework — specific competitive observation instantly differentiates. Abraham: position them as the obvious authority in their market, not just another service competing on price.",
      primaryCtaLabel: "Get Your Free Med Spa Visibility Audit",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_finding}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "medspa-t1-a",
          label: "Variant A",
          subject:
            "{{city}} med spas competing for the same clients — here's the gap",
          isActive: true,
          body: `Hi {{owner_name}},

I was looking at the med spa landscape in {{city}} today, and I noticed something specific about {{business_name}}: {{audit_finding}}.

In a market where clients are choosing between 3–5 options before booking, that gap matters more than most owners realize. The med spas filling their books right now aren't necessarily offering better treatments — they're just more visible, more trusted online, and faster to respond to new inquiries.

I've built a free 3-stage visibility audit specifically for med spas that takes 60 seconds and shows you:
• Your local SEO score vs. top competitors in {{city}}
• Your reputation score and review velocity
• Your website's conversion score and specific weak points

No sales pitch attached. Just an honest picture of where {{business_name}} stands and exactly what to fix.

→ {{audit_link}}

Worth 60 seconds?

Best,
Sarah at Booked Ranked Fundable`,
        },
        {
          id: "medspa-t1-b",
          label: "Variant B",
          subject:
            "Your competitors in {{city}} are outranking you (60-second proof)",
          isActive: false,
          body: `Hi {{owner_name}},

Quick question: when a new client in {{city}} searches "best med spa near me" at 8pm on a Thursday, does {{business_name}} show up in the top 3?

If not, those clients are booking with someone else — often someone with more reviews, a faster-loading website, and a booking flow that works on mobile.

The free 3-stage audit shows you exactly where you stand and what to fix:

→ {{audit_link}}

60 seconds. No call required.

Sarah
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "medspa-t2",
      touchNumber: 2,
      dayOffset: 3,
      framework: "Suby PASTOR",
      frameworkRationale:
        "Suby PASTOR: the story of transformation is more persuasive than any feature list for premium service providers. Med spa owners are aspirational — they respond to stories of peers achieving the outcome they want.",
      primaryCtaLabel: "See Your AI Booking Agent Handle a Real Inquiry",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Or see your free visibility audit first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "medspa-t2-a",
          label: "Variant A",
          subject: "What a {{city}} med spa owner found in her free audit",
          isActive: true,
          body: `Hi {{owner_name}},

Let me tell you about a med spa owner in a market similar to {{city}}.

She had a beautiful space, talented staff, and genuinely happy clients — but her books had empty slots every week. She couldn't figure out why.

**P**roblem: Inquiries were coming in at 9pm, 11pm, 7am — outside business hours. No one was responding.

**A**mplify: While she slept, a competitor three blocks away had an AI booking agent that responded to every inquiry in under 60 seconds, answered common questions, and booked the appointment before the client even thought about looking elsewhere.

**S**tory: She ran our free audit. Her website conversion score was 31/100. Her response time score: 18/100. Her competitor's? 84 and 91.

**T**ransformation: She activated the AI booking agent. Response time dropped to under 90 seconds, 24/7. In 60 days, her average weekly bookings increased by 11.

**O**ffer: I'd like to show you exactly how this works — the AI booking agent handling a real med spa inquiry in real time.

**R**esponse: → {{demo_link}}

If you haven't grabbed your free audit yet: → {{audit_link}}

Sarah
Booked Ranked Fundable`,
        },
        {
          id: "medspa-t2-b",
          label: "Variant B",
          subject: "The booking gap: why some med spas are always full",
          isActive: false,
          body: `Hi {{owner_name}},

The med spas that stay fully booked have one thing in common: they respond to every inquiry within 3 minutes, 24 hours a day.

Most can't do that. Their staff has hours. Inquiries don't.

An AI booking agent changes this — it handles every inquiry immediately, answers FAQs, checks availability, and books the appointment while the owner is asleep or with a client.

I want to show you how it works for a med spa like {{business_name}}: → {{demo_link}}

Or see your audit first: → {{audit_link}}

Sarah`,
        },
      ],
    },
    {
      id: "medspa-t3",
      touchNumber: 3,
      dayOffset: 7,
      framework: "Hormozi + Schwartz",
      frameworkRationale:
        "Hormozi: stacked value makes the price feel trivial — list every component with its standalone cost. Schwartz: solution-aware prospects need mechanism proof, not problem education. By touch 3, show the system and the math.",
      primaryCtaLabel: "See Both Demos: AI Agent + Your Full Dashboard",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "See your free audit first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "medspa-t3-a",
          label: "Variant A",
          subject:
            "The med spa growth stack: what's included and what it costs elsewhere",
          isActive: true,
          body: `Hi {{owner_name}},

Here's everything inside our system for a med spa like {{business_name}} — and what you'd pay if you bought each piece separately:

✓ AI booking agent (24/7 inquiry response + appointment scheduling) — $397/mo value
✓ Reputation management (automated review requests, response drafting) — $197/mo value
✓ Local SEO visibility tracker (ranking vs. competitors in {{city}}) — $149/mo value
✓ Lead pipeline (every prospect, inquiry, and booking in one view) — $129/mo value
✓ Review velocity dashboard (how fast you're growing vs. competitors) — $89/mo value
✓ Weekly performance report (every Monday, AI-generated, your numbers) — $79/mo value
✓ Fundability score (keeps your business creditworthy for growth) — $97/mo value

Combined value: $1,137/month.

The math on 8 more bookings per month at $350 average service: $2,800/month in additional revenue.

I'd like to show you both the AI booking agent and the full back office dashboard together:

→ /services-demo?niche=medspa&businessName={{business_name}}&source=cold_email_touch_3

Or run the free audit first: → {{audit_link}}

Sarah`,
        },
        {
          id: "medspa-t3-b",
          label: "Variant B",
          subject:
            "{{business_name}}: here's the math on booking 8 more clients/month",
          isActive: false,
          body: `Hi {{owner_name}},

Quick math for {{business_name}}:

8 additional bookings/month × $350 average service = $2,800/month additional revenue
Annual: $33,600

That's what consistently converting online inquiries looks like for a mid-size med spa.

The system that makes it happen: AI booking agent + reputation management + local SEO visibility. All in one dashboard you can see at a glance.

See both demos back to back:
→ /services-demo?niche=medspa&businessName={{business_name}}&source=cold_email_touch_3

Or your free audit: → {{audit_link}}

Sarah`,
        },
      ],
    },
    {
      id: "medspa-t4",
      touchNumber: 4,
      dayOffset: 12,
      framework: "Halbert + Sugarman",
      frameworkRationale:
        "Halbert: make the hidden problem visible and painful. Sugarman: each line is a breadcrumb that makes it impossible not to read the next — slippery slope writing that builds curiosity and inevitability toward the CTA.",
      primaryCtaLabel: "Watch Both Demos",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
      ],
      variants: [
        {
          id: "medspa-t4-a",
          label: "Variant A",
          subject:
            "Why {{business_name}} clients choose one med spa over another",
          isActive: true,
          body: `Hi {{owner_name}},

There's an invisible factor that drives most med spa booking decisions, and most owners never see it.

It's not price. Research consistently shows that med spa clients are primarily shopping for trust.

They want to know that you've treated people like them before. That others have had a great experience. That you'll respond when they have a question. That booking is easy.

In {{city}}, the med spas that dominate search right now have one thing in common: they've stacked trust signals that make new clients feel safe before they've ever walked through the door.

More reviews than competitors. Faster response times. A website that feels premium and loads instantly on mobile.

These aren't technical challenges. They're systems problems.

I'd like to show you two things back to back:
1. How your future clients would experience {{business_name}} with these systems in place
2. The dashboard where you manage all of it in about 15 minutes a week

Both demos take 6 minutes total: → {{demo_link}}

Sarah`,
        },
        {
          id: "medspa-t4-b",
          label: "Variant B",
          subject: "The invisible factor driving med spa bookings in {{city}}",
          isActive: false,
          body: `Hi {{owner_name}},

Here's something most med spa owners never think about:

A new client is considering three options in {{city}}. They open all three on their phone. One has 287 reviews and a 4.9 rating. One has 43 reviews and a 4.6. One has 18 reviews and a 4.4.

Before they've even looked at services or prices, 80% of that decision is already made.

The good news? Review velocity is entirely a systems problem. With the right automation, {{business_name}} can build 40–60 new reviews in 90 days from your existing happy clients.

I'd like to show you both demos — what your clients see, and what you manage: → {{demo_link}}

Sarah`,
        },
      ],
    },
    {
      id: "medspa-t5",
      touchNumber: 5,
      dayOffset: 18,
      framework: "Kennedy + Ogilvy",
      frameworkRationale:
        "Kennedy: direct respect for their time — clear, honest close without pressure. Ogilvy: end with one specific, honest value point rather than a hard close. The free audit is the easiest possible yes — lead with it as the final ask.",
      primaryCtaLabel: "Your Free Audit Is Still Available",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "medspa-t5-a",
          label: "Variant A",
          subject: "Final note for {{business_name}}",
          isActive: true,
          body: `Hi {{owner_name}},

This is my last note.

I've reached out a few times over the past few weeks about how {{business_name}} could capture more of the {{city}} market. I don't want to keep cluttering your inbox if the timing isn't right.

One last thing worth knowing: the free 3-stage med spa visibility audit is still available, and it's genuinely useful regardless of whether you ever work with us. It shows exactly where your business stands on local SEO, reputation, and website conversion — with specific numbers, not vague suggestions.

→ {{audit_link}}

If you want to be left alone, just reply and I'll remove you immediately. No hard feelings.

If you're still thinking about the booking and visibility challenges we discussed, I'm here.

Sarah
Booked Ranked Fundable`,
        },
        {
          id: "medspa-t5-b",
          label: "Variant B",
          subject: "Leaving the door open (one last thing)",
          isActive: false,
          body: `Hi {{owner_name}},

Last email from me, I promise.

Before I close the loop, one honest observation: the free audit I've mentioned a few times isn't a lead magnet for a sales call. It's a real diagnostic that shows your actual numbers — how you rank in {{city}}, your reputation score, and your website conversion rate, benchmarked against your top 3 local competitors.

A lot of owners find it useful just to know where they stand, even if they don't take any next steps.

→ {{audit_link}}

Either way, I wish {{business_name}} continued success.

Sarah`,
        },
      ],
    },
  ],
};

// ─── HVAC Cold Sequence ───────────────────────────────────────────────────────

export const HVAC_COLD_SEQUENCE: ColdEmailSequence = {
  id: "hvac-cold-sequence",
  niche: "hvac",
  name: "HVAC Cold Outreach — 5-Touch Seasonal Revenue Recovery",
  description:
    "Targets local HVAC companies losing booked calls every week to faster-responding competitors. Seasonal urgency framing with free audit tripwire.",
  pain: "Missing seasonal surge calls — AC breakdowns and heating emergencies go to the first company that responds",
  angle:
    "Seasonal revenue loss from missed emergency calls, free audit as tripwire",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 50,
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-04-10T14:22:00Z",
  stopTriggers: [
    "reply",
    "bounce",
    "unsubscribe",
    "complaint",
    "audit_completed",
  ],
  touches: [
    {
      id: "hvac-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Ogilvy + Hopkins",
      frameworkRationale:
        "Ogilvy: one specific, researched observation demonstrates real homework — differentiates from generic cold email. Hopkins: naming the exact problem before they ask builds instant credibility and urgency.",
      primaryCtaLabel: "Get Your Free HVAC Business Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_finding}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "hvac-t1-a",
          label: "Variant A",
          subject:
            "{{business_name}} is losing HVAC calls every week — here's proof",
          isActive: true,
          body: `Hi {{owner_name}},

I was looking at {{business_name}}'s online presence today and found something specific that's likely costing you booked jobs in {{city}} every week:

{{audit_finding}}

In HVAC, the window to win a new customer is measured in minutes — not hours. When an AC dies at 2pm on a 98-degree day, the homeowner calls three companies and books whoever calls back first. If your systems aren't built to respond in under 3 minutes, you're handing those jobs to competitors who are.

Beyond response speed, I also noticed:
• Your Google rating and review count leave you below the top 3 local competitors
• Your website doesn't show a clear emergency booking path on mobile

I've built a free 3-stage HVAC business scorecard that takes 60 seconds — it shows your SEO score, reputation score, and website conversion score with specific action items. No sales call. No credit card.

→ {{audit_link}}

Worth 60 seconds?

Best,
Mark
Booked Ranked Fundable`,
        },
        {
          id: "hvac-t1-b",
          label: "Variant B",
          subject: "How many HVAC calls did {{business_name}} lose this week?",
          isActive: false,
          body: `Hi {{owner_name}},

Here's a number that surprises most HVAC owners I talk to: during peak season, the average HVAC company without an AI front desk misses 6–10 calls per week. At $350–$500 per service call, that's $2,100–$5,000 gone every single week to whoever picks up first.

Looking at {{business_name}}, I noticed {{audit_finding}}. That's a signal that potential customers may be bouncing before they even dial.

I'm not here to pitch anything today. The free 3-stage HVAC scorecard shows exactly where your business stands on SEO, reputation, and website conversion — 60 seconds, specific action items, no strings attached.

→ {{audit_link}}

Mark
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "hvac-t2",
      touchNumber: 2,
      dayOffset: 3,
      framework: "Suby PASTOR",
      frameworkRationale:
        "Suby PASTOR: the seasonal missed-call pain is visceral for HVAC owners — amplify through a relatable story and show the transformation. Works best as second touch when the opener didn't convert.",
      primaryCtaLabel: "See Your AI Front Desk Handle a Real HVAC Call",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Or grab your free scorecard first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "hvac-t2-a",
          label: "Variant A",
          subject: "What a {{city}} HVAC owner discovered about his lost calls",
          isActive: true,
          body: `Hi {{owner_name}},

Let me tell you about an HVAC owner in a market just like {{city}}.

Memorial Day weekend. His crew was slammed — three installs, four service calls. His phone rang 14 times between Friday and Sunday. He missed 9 of them.

Those 9 missed calls? Worth an estimated $4,300 in revenue. Eight of them had booked with a competitor by the time he called back.

**P**roblem: During peak season, every missed call is money your competitor pockets.
**A**mplify: The competitor who answered those calls didn't have better technicians — he had an AI front desk that responded in under 2 seconds and booked the job before you surfaced.
**S**tory: That HVAC owner now runs the same AI system. His response rate is 100%. His booking rate on new inquiries jumped from 38% to 74%.
**T**ransformation: The phone rings, the AI answers, the job gets scheduled — even on holidays when his crew is maxed out.
**O**ffer: I'd like to show you exactly how this works in a 2-minute live demo.
**R**esponse: → {{demo_link}}

If you haven't grabbed your free scorecard yet: → {{audit_link}}

Mark
Booked Ranked Fundable`,
        },
        {
          id: "hvac-t2-b",
          label: "Variant B",
          subject: "The #1 reason HVAC companies lose seasonal surge jobs",
          isActive: false,
          body: `Hi {{owner_name}},

During the two peak weeks of summer and winter, HVAC companies that respond to new inquiries in under 3 minutes win the job 81% of the time. The ones who call back in 2+ hours? Less than 12%.

The difference isn't the quality of your work. It's whether a system is in place to answer when you physically can't.

For {{business_name}} in {{city}}, an AI front desk solves this — it answers every call, texts every missed call, and books jobs while your technicians are on other calls.

I built a 2-minute demo showing exactly how this works for HVAC: → {{demo_link}}

Or see your specific gaps first with the free scorecard: → {{audit_link}}

Mark`,
        },
      ],
    },
    {
      id: "hvac-t3",
      touchNumber: 3,
      dayOffset: 7,
      framework: "Hormozi Value Stack",
      frameworkRationale:
        "Hormozi: grand slam offer with stacked value and eliminated risk. At touch 3, prospects are solution-aware — make the math undeniable and the cost of inaction bigger than the cost of action.",
      primaryCtaLabel: "See Both Demos: AI Agent + HVAC Back Office",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Still haven't grabbed your free scorecard?",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "hvac-t3-a",
          label: "Variant A",
          subject: "The HVAC growth stack: every piece and the math",
          isActive: true,
          body: `Hi {{owner_name}},

Here's what's inside our platform for an HVAC company like {{business_name}}:

✓ AI front desk that answers every call in under 2 seconds ($297/mo value)
✓ Automatic missed-call SMS that converts voicemails to booked jobs ($97/mo value)
✓ CRM that logs every lead, call, and booking automatically ($149/mo value)
✓ Reputation system that requests reviews after every completed service ($79/mo value)
✓ SEO visibility tracker showing your ranking vs. competitors in {{city}} ($129/mo value)
✓ Seasonal surge alerts — get notified when search volume spikes in your area ($69/mo value)
✓ Weekly performance report emailed every Monday ($49/mo value)

Combined value: $869+/month.

The math on missed calls during peak season: 6 missed calls/week × $420 average job × 12 peak weeks = $30,240 in revenue handed to competitors every year.

I'd like to show you the back office — where you see your entire operation in one dashboard in real time.

See both demos back to back — the AI front desk and the full back office:

→ /services-demo?niche=hvac&businessName={{business_name}}&source=cold_email_touch_3

Still on the fence? The free scorecard shows your specific numbers: → {{audit_link}}

Mark`,
        },
        {
          id: "hvac-t3-b",
          label: "Variant B",
          subject: "What {{business_name}} gets on day one (and the math)",
          isActive: false,
          body: `Hi {{owner_name}},

Quick math for {{business_name}} during peak season:

Missed calls per week without AI: 6–10
Average HVAC service call value: $350–$500
Weekly revenue lost to competitors: $2,100–$5,000
Peak season revenue lost (12 weeks): $25,200–$60,000

That's what not fixing this costs annually.

Here's what the platform does about each piece:
• AI call answering → zero missed calls during surge
• Missed call SMS → captures callers who don't leave messages
• Automated review requests → builds your rating while you work
• Lead pipeline → every prospect visible in one view
• SEO tracking → you know exactly where you rank vs. competitors in {{city}}

See both the AI front desk and back office dashboard together:

→ /services-demo?niche=hvac&businessName={{business_name}}&source=cold_email_touch_3

Or start with your free scorecard: → {{audit_link}}

Mark`,
        },
      ],
    },
    {
      id: "hvac-t4",
      touchNumber: 4,
      dayOffset: 12,
      framework: "Halbert + Abraham",
      frameworkRationale:
        "Halbert: problem-agitate-solve with conversational human tone. Abraham: strategy of preeminence — position as the trusted advisor who already knows their market, not a vendor pitching.",
      primaryCtaLabel: "See Both Demos Back to Back",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
      ],
      variants: [
        {
          id: "hvac-t4-a",
          label: "Variant A",
          subject:
            "How {{city}} HVAC companies are becoming the obvious choice",
          isActive: true,
          body: `Hi {{owner_name}},

There's a shift happening in local HVAC markets, and {{city}} is no different.

The HVAC companies winning right now aren't necessarily running better equipment or employing better technicians. They've simply made themselves impossible to overlook: they show up first in search, they have 200+ reviews at 4.9 stars, and when a homeowner calls at 9pm because their AC is down, someone — or something — answers immediately.

The companies losing? Solid work. Invisible online. No system for capturing leads when the crew is busy.

I'm not here to sell you software. I'm here because I think {{business_name}} could be the obvious choice in {{city}} — and right now you may be leaving that position open for a competitor to claim.

The simplest way to see what I mean: watch both demos back to back. The first shows how your customers would experience your business with these systems. The second shows what you'd see managing it.

6 minutes total. No presentation, no sales call.

→ {{demo_link}}

Mark`,
        },
        {
          id: "hvac-t4-b",
          label: "Variant B",
          subject:
            "The trusted HVAC company in {{city}} — why it's not always the best one",
          isActive: false,
          body: `Hi {{owner_name}},

The most successful HVAC companies I work with share one trait: they've become the trusted authority in their market. Not because they're the cheapest. Not because they're the most experienced. Because they're the most visible and responsive.

When someone in {{city}} needs HVAC service — emergency or scheduled — {{business_name}} should be the first name that comes up and the easiest one to book.

Three HVAC businesses I've worked with this quarter averaged 38 new Google reviews in 90 days, a 41% increase in inbound calls, and first-page Google rankings for their primary service terms.

Both demos together take 6 minutes:

→ {{demo_link}}

Mark`,
        },
      ],
    },
    {
      id: "hvac-t5",
      touchNumber: 5,
      dayOffset: 18,
      framework: "Kennedy Break-up",
      frameworkRationale:
        "Kennedy: zero fluff, direct respect for time. The break-up email consistently gets the highest reply rate — it forces a decision. Clear, no-pressure close that respects the prospect and leaves a good final impression.",
      primaryCtaLabel: "Last Chance: Get Your Free HVAC Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "hvac-t5-a",
          label: "Variant A",
          subject: "Closing the loop on {{business_name}}",
          isActive: true,
          body: `Hi {{owner_name}},

I've sent you four notes over the past few weeks. No response — which tells me one of three things:

1. Busy season has you maxed out (completely understandable for HVAC)
2. This isn't a priority right now
3. You've already solved the missed-call and online visibility problems

Any of those are valid. I'm not here to pressure anyone.

If {{business_name}} is still losing jobs in {{city}} to faster-responding competitors, the free scorecard is still open. 60 seconds, shows exactly where you stand, no sales call required.

→ {{audit_link}}

If not, I'll stop reaching out. Either way, I wish you a strong season.

Mark
Booked Ranked Fundable

P.S. The math is simple: if the scorecard finds one thing that brings in one extra service call per week during peak season, it's paid for itself many times over.`,
        },
        {
          id: "hvac-t5-b",
          label: "Variant B",
          subject: "Last note — then I'll get out of your inbox",
          isActive: false,
          body: `Hi {{owner_name}},

This is my last note.

I think {{business_name}} has a real opportunity to capture more of the {{city}} HVAC market — especially heading into peak season. I've tried to show you what that looks like a few times now.

If the timing's wrong or you're not interested, just reply and I'll remove you immediately.

If you're still curious about where your business stands, the free scorecard is still open: → {{audit_link}}

Either way, appreciate your time.

Mark`,
        },
      ],
    },
  ],
};

// ─── Restoration Cold Sequence ────────────────────────────────────────────────

export const RESTORATION_COLD_SEQUENCE: ColdEmailSequence = {
  id: "restoration-cold-sequence",
  niche: "restoration",
  name: "Restoration Cold Outreach — 5-Touch Emergency Lead Recovery",
  description:
    "Targets water damage, fire, and mold restoration companies missing high-value emergency calls. Insurance job angle with free audit as tripwire.",
  pain: "Emergency calls go to the first company that picks up — losing insurance jobs to competitors who respond faster",
  angle:
    "Emergency call response speed + insurance job capture with free audit tripwire",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 40,
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-04-10T14:22:00Z",
  stopTriggers: [
    "reply",
    "bounce",
    "unsubscribe",
    "complaint",
    "audit_completed",
  ],
  touches: [
    {
      id: "rest-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Hopkins + Ogilvy",
      frameworkRationale:
        "Hopkins: specificity and naming the exact problem — specificity in emergency services builds instant credibility. Ogilvy: research-first, one specific observation shows you understand their market.",
      primaryCtaLabel: "Get Your Free Restoration Business Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_finding}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "rest-t1-a",
          label: "Variant A",
          subject:
            "{{business_name}}: how many emergency calls went to a competitor this week?",
          isActive: true,
          body: `Hi {{owner_name}},

I was looking at {{business_name}}'s online presence today and noticed something that's likely costing you high-value jobs in {{city}}:

{{audit_finding}}

In restoration, emergency response time is everything. When water is actively damaging a home at 2am, the homeowner calls three companies and books the one that answers. Not the one with the best reviews — the one that picks up.

Beyond response speed, I noticed:
• Your Google presence doesn't prominently show 24/7 emergency availability
• Your website conversion path for emergency callers isn't optimized for mobile
• Your review velocity has slowed compared to top competitors in {{city}}

These are fixable problems. I've built a free 3-stage restoration business scorecard — 60 seconds, shows your SEO score, reputation score, and website conversion score with specific action items. No sales call. No credit card.

→ {{audit_link}}

Worth 60 seconds?

Best,
James
Booked Ranked Fundable`,
        },
        {
          id: "rest-t1-b",
          label: "Variant B",
          subject: "The emergency call window: are you winning it in {{city}}?",
          isActive: false,
          body: `Hi {{owner_name}},

A homeowner discovers water damage at 11pm. They call three restoration companies. They book the first one that answers — regardless of price, regardless of reviews.

The average emergency restoration job is worth $3,500–$12,000. If you're missing 2–3 of those calls per month to competitors who answer faster, that's $7,000–$36,000 in lost revenue monthly.

Looking at {{business_name}}, I noticed {{audit_finding}}. The free 3-stage scorecard shows exactly where you stand — 60 seconds, specific action items, no strings.

→ {{audit_link}}

James
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "rest-t2",
      touchNumber: 2,
      dayOffset: 3,
      framework: "Suby PASTOR",
      frameworkRationale:
        "Suby PASTOR: the 2am emergency pain is visceral — amplify through story and show the transformation. Restoration owners understand the emotional weight of emergency calls better than most.",
      primaryCtaLabel: "See Your AI Emergency Front Desk in Action",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Or grab your free scorecard first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "rest-t2-a",
          label: "Variant A",
          subject:
            "The 2am call that {{city}} restoration companies keep missing",
          isActive: true,
          body: `Hi {{owner_name}},

Here's a scenario every restoration owner knows:

It's 2am. A pipe burst. A family's basement is flooding. They pull out their phone and call three restoration companies. Whoever answers first gets the job — a $6,000–$14,000 insurance claim.

The first company they called answered in under 3 seconds. AI front desk. Greeted them by business name, asked the right emergency triage questions, confirmed the address, and dispatched a crew — all before the homeowner even hung up.

**P**roblem: Emergency calls don't wait for business hours. Neither do your competitors.
**A**mplify: Every missed emergency call is a $3,500–$14,000 insurance job someone else is cashing right now.
**S**tory: A restoration company in a market like {{city}} implemented the AI emergency front desk. In 90 days, their answered-call rate went from 61% to 100%. Revenue from insurance jobs increased by $34,000 in the first quarter.
**T**ransformation: The phone rings at 2am. The AI answers, triages, and dispatches — the owner wakes up to a job already booked.
**O**ffer: I'd like to show you exactly how this works in a live demo.
**R**esponse: → {{demo_link}}

If you haven't grabbed your free scorecard yet: → {{audit_link}}

James
Booked Ranked Fundable`,
        },
        {
          id: "rest-t2-b",
          label: "Variant B",
          subject:
            "The restoration companies winning insurance jobs in {{city}}",
          isActive: false,
          body: `Hi {{owner_name}},

The restoration companies consistently winning large insurance jobs in local markets share one trait: they respond to every emergency call in under 60 seconds, 24 hours a day.

Most can't do this — their on-call system is a cell phone and a tired technician. An AI emergency front desk changes the math entirely.

I want to show you how it works for a restoration business like {{business_name}}: → {{demo_link}}

Or see your specific gaps first: → {{audit_link}}

James`,
        },
      ],
    },
    {
      id: "rest-t3",
      touchNumber: 3,
      dayOffset: 7,
      framework: "Hormozi Value Stack",
      frameworkRationale:
        "Hormozi: stack every component with its standalone value and make the cost of inaction undeniable. Restoration has high job values — the math hits especially hard.",
      primaryCtaLabel: "See Both Demos: AI Emergency Front Desk + Back Office",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Still haven't grabbed your free scorecard?",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "rest-t3-a",
          label: "Variant A",
          subject: "The restoration growth stack: every piece and the math",
          isActive: true,
          body: `Hi {{owner_name}},

Here's what's inside our platform for a restoration company like {{business_name}}:

✓ AI emergency front desk — answers every call in under 3 seconds, 24/7 ($397/mo value)
✓ Emergency triage flow — asks the right questions and dispatches automatically ($197/mo value)
✓ Missed-call SMS — captures callers who don't leave voicemails ($97/mo value)
✓ CRM with insurance job tracking — every job, adjuster, and claim in one view ($179/mo value)
✓ Reputation management — automated review requests after every completed job ($79/mo value)
✓ SEO visibility tracker for {{city}} ($129/mo value)
✓ Weekly performance report ($49/mo value)

Combined value: $1,127+/month.

The math on missed emergency calls: 3 missed insurance jobs/month × $6,500 average = $19,500/month, $234,000/year going to competitors who answered faster.

I'd like to show you the back office — where you see your entire operation in one place.

See both demos — the AI emergency front desk and the full back office:

→ /services-demo?niche=restoration&businessName={{business_name}}&source=cold_email_touch_3

Free scorecard still available: → {{audit_link}}

James`,
        },
        {
          id: "rest-t3-b",
          label: "Variant B",
          subject: "The real cost of missed restoration calls in {{city}}",
          isActive: false,
          body: `Hi {{owner_name}},

Restoration math is brutal:

Missed emergency calls per month: 3–5 (industry average without AI)
Average insurance job value: $4,500–$12,000
Monthly revenue to competitors: $13,500–$60,000
Annual revenue to competitors: $162,000–$720,000

That's the number you're playing with every month you don't have an always-on response system.

The platform stack fixes all of it: AI emergency front desk, automatic dispatch, CRM with insurance job tracking, reputation management, and SEO visibility in {{city}}.

See both demos — the emergency front desk and the back office dashboard:
→ /services-demo?niche=restoration&businessName={{business_name}}&source=cold_email_touch_3

Or start with your free scorecard: → {{audit_link}}

James`,
        },
      ],
    },
    {
      id: "rest-t4",
      touchNumber: 4,
      dayOffset: 12,
      framework: "Halbert + Abraham",
      frameworkRationale:
        "Halbert: human conversational tone — by touch 4, social proof storytelling is more persuasive than features. Abraham: position as the trusted advisor, not another vendor pitching software.",
      primaryCtaLabel: "See Both Demos Back to Back",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
      ],
      variants: [
        {
          id: "rest-t4-a",
          label: "Variant A",
          subject:
            "How {{city}} restoration companies are winning emergency calls they used to miss",
          isActive: true,
          body: `Hi {{owner_name}},

There's a pattern I keep seeing in markets like {{city}}.

The restoration companies that are growing fastest aren't the most experienced or the best-equipped. They've simply built systems that make them impossible to miss in an emergency — they show up first in search, they answer every call instantly, and they follow up with an insurance-documentation-ready CRM that makes the claims process easy for adjusters.

The companies losing ground? Great work. Invisible online. No 24/7 response system. Emergency calls go to whoever answers first.

I'm not here to sell software. I'm here because I think {{business_name}} is the kind of operation that should be the obvious call in {{city}} when disaster strikes — and right now, that position may be open for a competitor to take.

Watch both demos back to back — 6 minutes, no sales call:

→ {{demo_link}}

James`,
        },
        {
          id: "rest-t4-b",
          label: "Variant B",
          subject:
            "The restoration companies capturing all the insurance jobs in {{city}}",
          isActive: false,
          body: `Hi {{owner_name}},

Three restoration companies I've worked with this quarter:
• Average 44 new Google reviews in 90 days
• 100% answered-call rate during peak emergency periods
• First-page Google ranking for their primary emergency service terms in their city

None of them changed their service quality. They changed their systems.

Both demos together take 6 minutes — I think you'll see exactly what I mean:

→ {{demo_link}}

James`,
        },
      ],
    },
    {
      id: "rest-t5",
      touchNumber: 5,
      dayOffset: 18,
      framework: "Kennedy Break-up",
      frameworkRationale:
        "Kennedy: zero fluff, direct respect for time. The break-up email generates the highest reply rate — it forces a final decision. Honest, pressure-free close that respects the prospect.",
      primaryCtaLabel: "Last Chance: Get Your Free Restoration Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "rest-t5-a",
          label: "Variant A",
          subject: "Closing the loop on {{business_name}}",
          isActive: true,
          body: `Hi {{owner_name}},

Four notes over the past few weeks. No response — which tells me one of three things:

1. Your schedule is completely maxed right now (the nature of restoration work)
2. This isn't a priority
3. You've already solved the emergency response and online visibility gaps

Any of those are fine. I'm not here to be a nuisance.

If {{business_name}} is still missing emergency calls in {{city}} and losing insurance jobs to faster-responding competitors, the free scorecard is still available. 60 seconds, shows exactly where you stand.

→ {{audit_link}}

If not, I'll stop reaching out. Either way, I wish you a strong season.

James
Booked Ranked Fundable

P.S. If the scorecard identifies one additional insurance job per month, it's paid for itself many times over.`,
        },
        {
          id: "rest-t5-b",
          label: "Variant B",
          subject: "Last note — then I'm out of your inbox",
          isActive: false,
          body: `Hi {{owner_name}},

This is my last email.

I believe {{business_name}} has the foundation to be the dominant restoration company in {{city}}. I've tried to show you what that looks like a few times.

If timing is off, just reply and I'll remove you immediately.

If you're still thinking about emergency response and insurance job capture, the free scorecard is still open: → {{audit_link}}

Either way — appreciate your time, James`,
        },
      ],
    },
  ],
};

// ─── Carpet Cleaning Cold Sequence ────────────────────────────────────────────

export const CARPET_CLEANING_COLD_SEQUENCE: ColdEmailSequence = {
  id: "carpet-cleaning-cold-sequence",
  niche: "carpet-cleaning",
  name: "Carpet Cleaning Cold Outreach — 5-Touch Revenue & Recurring Growth",
  description:
    "Targets local carpet cleaning companies leaving money on the table through weak online presence, no recurring client system, and slow response to new inquiries.",
  pain: "Homeowners book the first carpet cleaner they find online — without a strong presence you're invisible to the best recurring clients",
  angle:
    "Revenue left on the table from weak online presence and no recurring client automation — free audit as tripwire",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 50,
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-04-10T14:22:00Z",
  stopTriggers: [
    "reply",
    "bounce",
    "unsubscribe",
    "complaint",
    "audit_completed",
  ],
  touches: [
    {
      id: "carpet-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Hopkins + Ogilvy",
      frameworkRationale:
        "Hopkins: specificity — name the exact revenue gap before they ask. Ogilvy: one researched observation shows homework and differentiates from generic outreach.",
      primaryCtaLabel: "Get Your Free Carpet Cleaning Business Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_finding}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "carpet-t1-a",
          label: "Variant A",
          subject:
            "{{business_name}} is leaving recurring revenue on the table in {{city}}",
          isActive: true,
          body: `Hi {{owner_name}},

I was looking at {{business_name}}'s online presence in {{city}} today and noticed something specific that's likely costing you recurring clients every week:

{{audit_finding}}

In carpet cleaning, the difference between a busy schedule and a full one is almost never quality of work — it's whether homeowners can find you when they're ready to book. The companies dominating {{city}} right now are booked 3–4 weeks out, mostly because they've built systems to stay visible and automate follow-up with past clients.

Beyond your online visibility, I also noticed:
• Your review count puts you below the top 3 local competitors in search rankings
• Your website doesn't have a fast, mobile-optimized booking path
• There's no automated system visible for following up with past clients to drive recurring business

I've built a free 3-stage carpet cleaning business scorecard — 60 seconds, shows your SEO score, reputation score, and website conversion score. No sales call. No credit card.

→ {{audit_link}}

Worth 60 seconds?

Best,
Tom
Booked Ranked Fundable`,
        },
        {
          id: "carpet-t1-b",
          label: "Variant B",
          subject:
            "How much recurring carpet cleaning revenue is {{business_name}} missing?",
          isActive: false,
          body: `Hi {{owner_name}},

Here's a number worth thinking about: the average carpet cleaning client who books once will rebook every 6–12 months if someone asks them to. Without an automated follow-up system, most of those clients quietly drift to whoever ranks higher next time they search.

For a carpet cleaning business in {{city}} with 100+ past clients and no automated rebooking flow, that's a significant revenue stream sitting uncaptured.

Looking at {{business_name}}, I noticed {{audit_finding}}. The free 3-stage scorecard shows exactly where your business stands — 60 seconds, specific action items, no strings.

→ {{audit_link}}

Tom
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "carpet-t2",
      touchNumber: 2,
      dayOffset: 3,
      framework: "Suby PASTOR",
      frameworkRationale:
        "Suby PASTOR: the pain of homeowners booking 'the first result they see' resonates strongly — amplify through story and show the transformation with real booking metrics.",
      primaryCtaLabel: "See Your AI Booking Agent Handle a Real Inquiry",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Or grab your free scorecard first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "carpet-t2-a",
          label: "Variant A",
          subject:
            "Why homeowners in {{city}} book the first carpet cleaner they find",
          isActive: true,
          body: `Hi {{owner_name}},

Here's something most carpet cleaning owners don't think about:

When a homeowner decides it's time to clean their carpets, they search, look at 2–3 options, and book the first one that feels trustworthy. The whole decision takes about 4 minutes.

They're not comparing quality. They're comparing trust signals: number of reviews, star rating, how fast someone responds to their inquiry.

**P**roblem: If {{business_name}} isn't showing up in the top 3 results in {{city}} with a strong review profile, those bookings are going to a competitor — one that might be no better at the actual cleaning.
**A**mplify: Every week you're not the obvious choice, you're losing the highest-value clients — homeowners with larger homes, more frequent cleaning needs, and a willingness to pay for quality.
**S**tory: A carpet cleaner in a market like {{city}} implemented our AI booking agent and automated review system. In 90 days: 51 new Google reviews, a jump to top-3 local rankings, and a 28% increase in new bookings.
**T**ransformation: Every inquiry gets an instant response, every completed job triggers a review request, and his schedule stays full without him actively marketing.
**O**ffer: I'd like to show you exactly how this works in a live demo.
**R**esponse: → {{demo_link}}

Free scorecard if you want to start there: → {{audit_link}}

Tom
Booked Ranked Fundable`,
        },
        {
          id: "carpet-t2-b",
          label: "Variant B",
          subject:
            "The difference between fully booked and almost-booked carpet cleaners",
          isActive: false,
          body: `Hi {{owner_name}},

Carpet cleaning companies that stay fully booked have automated one thing that most haven't: the rebooking loop.

Every completed job triggers an automatic review request. Every review builds the ranking. Every rebook is automated with a follow-up 6 months later. The schedule fills itself.

For {{business_name}} in {{city}}, this is a systems problem — not a quality problem.

I want to show you how the AI booking agent and rebooking automation works: → {{demo_link}}

Or see your specific gaps first: → {{audit_link}}

Tom`,
        },
      ],
    },
    {
      id: "carpet-t3",
      touchNumber: 3,
      dayOffset: 7,
      framework: "Hormozi Value Stack",
      frameworkRationale:
        "Hormozi: stack every component, make the recurring revenue math undeniable. Carpet cleaning has natural recurring revenue — Hormozi's value stack makes the platform ROI obvious.",
      primaryCtaLabel: "See Both Demos: AI Agent + Your Back Office Dashboard",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Still haven't grabbed your free scorecard?",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "carpet-t3-a",
          label: "Variant A",
          subject:
            "The automated front desk stack for {{business_name}} (and the math)",
          isActive: true,
          body: `Hi {{owner_name}},

Here's what's inside our platform for a carpet cleaning business like {{business_name}}:

✓ AI booking agent — answers every inquiry instantly, books jobs while you work ($297/mo value)
✓ Automated rebooking flow — prompts past clients to rebook every 6 months ($147/mo value)
✓ Reputation system — review request after every completed job ($79/mo value)
✓ CRM with job history — every client, job, and rebooking in one view ($129/mo value)
✓ SEO visibility tracker — your ranking vs. competitors in {{city}} ($129/mo value)
✓ Referral automation — turns happy clients into referral sources ($89/mo value)
✓ Weekly performance report ($49/mo value)

Combined value: $919+/month.

The recurring revenue math: 100 past clients × 60% rebooking rate × $280 average job = $16,800 in recoverable revenue from your existing client list alone — if you have a system that asks.

See both the AI booking agent and back office dashboard together:

→ /services-demo?niche=carpet-cleaning&businessName={{business_name}}&source=cold_email_touch_3

Free scorecard still available: → {{audit_link}}

Tom`,
        },
        {
          id: "carpet-t3-b",
          label: "Variant B",
          subject:
            "The recurring revenue carpet cleaners are leaving uncaptured",
          isActive: false,
          body: `Hi {{owner_name}},

Quick recurring revenue math for {{business_name}}:

Past clients you've served: 100+ (most established carpet cleaners)
Clients who'd rebook if asked: 55–65%
Average job value: $250–$350
Annual recurring revenue if automated: $13,750–$22,750

That's the revenue sitting in your existing client list — if someone is systematically asking for the rebook.

The platform automates the entire cycle: booking, job completion, review request, and rebooking prompt at 6 months. You see it all in one dashboard.

See both demos back to back:
→ /services-demo?niche=carpet-cleaning&businessName={{business_name}}&source=cold_email_touch_3

Or start with your free scorecard: → {{audit_link}}

Tom`,
        },
      ],
    },
    {
      id: "carpet-t4",
      touchNumber: 4,
      dayOffset: 12,
      framework: "Abraham + Halbert",
      frameworkRationale:
        "Abraham: strategy of preeminence — position as the trusted advisor who sees the full picture. Halbert: conversational, human tone for social proof storytelling at touch 4.",
      primaryCtaLabel: "See Both Demos Back to Back",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
      ],
      variants: [
        {
          id: "carpet-t4-a",
          label: "Variant A",
          subject:
            "How {{city}} carpet cleaners are getting new clients without advertising",
          isActive: true,
          body: `Hi {{owner_name}},

The carpet cleaning companies growing fastest in markets like {{city}} have figured out something most haven't:

They don't need to advertise for new clients as long as they're systematically converting existing clients into reviewers and referrers. Their review count grows every month. Their ranking climbs. New clients find them organically because they look like the obvious, most-trusted choice.

The companies stuck at the same revenue level year after year? Great work. No system for turning completed jobs into reviews, referrals, and rebuys.

I'm not here to sell software. I'm here because I think {{business_name}} should be the name homeowners in {{city}} think of first — and right now, a competitor might be building that position.

Watch both demos back to back — 6 minutes, no sales call:

→ {{demo_link}}

Tom`,
        },
        {
          id: "carpet-t4-b",
          label: "Variant B",
          subject:
            "The carpet cleaning referral and review loop (why some are always booked)",
          isActive: false,
          body: `Hi {{owner_name}},

Three carpet cleaning businesses I've worked with this quarter:
• Averaged 47 new Google reviews in 90 days
• Increased rebooking rate from 31% to 64% with automated follow-up
• First-page rankings for their primary service terms in their market

None of them changed their cleaning quality. They changed their follow-up systems.

Both demos together take 6 minutes:

→ {{demo_link}}

Tom`,
        },
      ],
    },
    {
      id: "carpet-t5",
      touchNumber: 5,
      dayOffset: 18,
      framework: "Kennedy Break-up",
      frameworkRationale:
        "Kennedy: zero fluff, honest close. The break-up email generates the highest reply rate by forcing a decision. Clear, pressure-free, and respectful of their time.",
      primaryCtaLabel: "Last Chance: Get Your Free Carpet Cleaning Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "carpet-t5-a",
          label: "Variant A",
          subject: "Closing the loop on {{business_name}}",
          isActive: true,
          body: `Hi {{owner_name}},

Four notes over the past few weeks. No response — which usually means one of three things:

1. Schedule is maxed out (busy season for carpet cleaning — I get it)
2. Not a priority right now
3. You've already solved the visibility and rebooking problems

All valid. I'm not here to push.

If {{business_name}} is still losing potential clients in {{city}} to higher-ranking competitors, the free scorecard is still available. 60 seconds, shows exactly where you stand.

→ {{audit_link}}

If not, I'll stop reaching out. Best of luck this season.

Tom
Booked Ranked Fundable

P.S. The math: if the scorecard helps you capture just 2 additional rebuys per month from your existing client list, it's paid for itself many times over.`,
        },
        {
          id: "carpet-t5-b",
          label: "Variant B",
          subject: "Last note — then I'll leave you alone",
          isActive: false,
          body: `Hi {{owner_name}},

This is my last email.

I think {{business_name}} is leaving real recurring revenue on the table in {{city}}. I've tried to show you what fixing that looks like a few times now.

If timing's not right, just reply and I'll remove you immediately.

If you're still curious about your visibility and rebooking gaps: → {{audit_link}}

Tom`,
        },
      ],
    },
  ],
};

// ─── Roofing Cold Sequence ────────────────────────────────────────────────────

export const ROOFING_COLD_SEQUENCE: ColdEmailSequence = {
  id: "roofing-cold-sequence",
  niche: "roofing",
  name: "Roofing Cold Outreach — 5-Touch Storm Lead & Insurance Capture",
  description:
    "Targets local roofing companies losing storm leads and insurance jobs to faster-responding, better-ranked competitors. Storm urgency and insurance job angle with free audit tripwire.",
  pain: "Storm leads go to whoever shows up first online and responds fastest — losing high-value insurance jobs to better-positioned competitors",
  angle:
    "Storm lead and insurance job capture — speed, visibility, and reputation framing with free audit tripwire",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 45,
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-04-10T14:22:00Z",
  stopTriggers: [
    "reply",
    "bounce",
    "unsubscribe",
    "complaint",
    "audit_completed",
  ],
  touches: [
    {
      id: "roof-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Hopkins + Ogilvy",
      frameworkRationale:
        "Hopkins: specificity and naming the exact storm lead loss before they ask. Ogilvy: one specific, researched observation demonstrates homework and earns immediate credibility.",
      primaryCtaLabel: "Get Your Free Roofing Business Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_finding}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "roof-t1-a",
          label: "Variant A",
          subject:
            "{{business_name}}: storm leads are going to a competitor in {{city}}",
          isActive: true,
          body: `Hi {{owner_name}},

I was looking at {{business_name}}'s online presence today and noticed something that's likely costing you storm leads and insurance jobs in {{city}}:

{{audit_finding}}

In roofing, storm season is a sprint — the contractors who capture the most jobs aren't always the most experienced, they're the most visible and the fastest to respond when homeowners are looking for help. When a storm rolls through {{city}} and homeowners start searching, the first roofer with strong reviews, a fast website, and a system that responds to inquiries in minutes wins the bulk of those jobs.

I also noticed:
• Your review count and rating put you behind the top 3 local competitors
• Your website doesn't show clear insurance claim assistance messaging
• Your mobile booking path isn't optimized for urgent post-storm inquiries

I've built a free 3-stage roofing business scorecard — 60 seconds, shows your SEO score, reputation score, and website conversion score with specific action items. No sales call. No credit card.

→ {{audit_link}}

Worth 60 seconds?

Best,
Ryan
Booked Ranked Fundable`,
        },
        {
          id: "roof-t1-b",
          label: "Variant B",
          subject:
            "How many storm leads did {{business_name}} lose last season?",
          isActive: false,
          body: `Hi {{owner_name}},

Here's how storm season math works for roofing contractors: after a major weather event, the first 72 hours are worth more revenue than the next 3 weeks combined. The contractors who capture those jobs are the ones who show up first in search and respond to inquiries before the homeowner moves on.

The average storm repair and insurance claim job is worth $8,000–$25,000. Missing 2–3 of those per event to faster competitors adds up fast.

Looking at {{business_name}}, I noticed {{audit_finding}}. The free 3-stage scorecard shows exactly where you stand — 60 seconds, specific action items, no strings.

→ {{audit_link}}

Ryan
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "roof-t2",
      touchNumber: 2,
      dayOffset: 3,
      framework: "Suby PASTOR",
      frameworkRationale:
        "Suby PASTOR: the storm season urgency pain is visceral — amplify through a relatable scenario and show the transformation. Storm-chasing roofing dynamics make the before/after story especially compelling.",
      primaryCtaLabel: "See Your AI Front Desk Handle a Storm Inquiry",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Or grab your free scorecard first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "roof-t2-a",
          label: "Variant A",
          subject: "The storm season window most {{city}} roofers are missing",
          isActive: true,
          body: `Hi {{owner_name}},

Picture this: a hailstorm moves through {{city}} on a Tuesday afternoon.

By Tuesday evening, 400 homeowners are searching for roofing help. The top 3 results capture 80% of those inquiries. Whoever responds first gets the job.

A roofing company in a market similar to {{city}} had this exact experience. He had 63 reviews and a 4.6 rating — solid, but not dominant. When the storm hit, the top competitor (4.9 stars, 280 reviews) captured 3x more inbound leads in the first 48 hours.

**P**roblem: When storm season hits, visibility and response speed determine who captures the surge — not who does better work.
**A**mplify: Every storm you're not the top result, a competitor with an AI front desk and 300 reviews is capturing the $12,000–$25,000 insurance jobs you should be getting.
**S**tory: That roofer implemented the AI front desk and reputation system. In one season, he went from 63 to 204 reviews and captured 34 additional storm jobs that previously would have gone to the competitor above him.
**T**ransformation: The next storm rolls through. His phone rings. The AI answers. The job is booked before he's even off his current roof.
**O**ffer: I'd like to show you exactly how this works in a live demo.
**R**esponse: → {{demo_link}}

Free scorecard if you want to start there: → {{audit_link}}

Ryan
Booked Ranked Fundable`,
        },
        {
          id: "roof-t2-b",
          label: "Variant B",
          subject: "The roofers capturing all the storm jobs in {{city}}",
          isActive: false,
          body: `Hi {{owner_name}},

The roofing companies that win the bulk of storm jobs in a local market consistently have three things:

1. 200+ Google reviews at 4.8+
2. AI front desk that responds to inquiries in under 60 seconds
3. Website that clearly shows insurance claim assistance and fast response

When a storm hits, they capture 3–5x the leads of competitors who are equal in quality but not in visibility.

I want to show you how the AI front desk and reputation system work for a roofing company: → {{demo_link}}

Or see your specific gaps: → {{audit_link}}

Ryan`,
        },
      ],
    },
    {
      id: "roof-t3",
      touchNumber: 3,
      dayOffset: 7,
      framework: "Hormozi Value Stack",
      frameworkRationale:
        "Hormozi: grand slam offer — stack every component with standalone value and make the ROI undeniable. Roofing has the highest job values of any niche, so the math on missed jobs is especially powerful.",
      primaryCtaLabel: "See Both Demos: AI Storm Front Desk + Back Office",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Still haven't grabbed your free scorecard?",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "roof-t3-a",
          label: "Variant A",
          subject:
            "The roofing growth stack: storm leads, insurance jobs, reviews, fundability",
          isActive: true,
          body: `Hi {{owner_name}},

Here's what's inside our platform for a roofing company like {{business_name}}:

✓ AI front desk — answers every storm inquiry in under 60 seconds, 24/7 ($397/mo value)
✓ Insurance claim assistance flow — captures adjuster info, documents damage, tracks claims ($247/mo value)
✓ Reputation system — automated review requests after every completed job ($79/mo value)
✓ CRM with insurance job tracking — every lead, claim, and job in one view ($179/mo value)
✓ SEO visibility tracker — your ranking vs. competitors in {{city}} ($129/mo value)
✓ Storm surge alerts — notified the moment search volume spikes after weather events ($89/mo value)
✓ Fundability score — keeps your business creditworthy for equipment and growth financing ($97/mo value)
✓ Weekly performance report ($49/mo value)

Combined value: $1,266+/month.

The math on missed storm jobs: 3 missed insurance jobs per event × $14,000 average × 4 significant events/year = $168,000/year going to whoever shows up and responds faster.

See both demos — the AI storm front desk and the full back office:

→ /services-demo?niche=roofing&businessName={{business_name}}&source=cold_email_touch_3

Free scorecard still available: → {{audit_link}}

Ryan`,
        },
        {
          id: "roof-t3-b",
          label: "Variant B",
          subject:
            "The storm job math for {{business_name}} (it's bigger than you think)",
          isActive: false,
          body: `Hi {{owner_name}},

Roofing math during storm season:

Missed storm leads per event (without AI + strong reviews): 4–8
Average insurance replacement job: $12,000–$25,000
Revenue to competitors per storm event: $48,000–$200,000
Annual (4 significant events): $192,000–$800,000

That's the range of revenue you're competing for on positioning and response speed alone.

The platform stack covers all of it: AI front desk, insurance claim flow, reputation management, CRM, SEO tracking in {{city}}, and storm surge alerts.

See both demos — the AI storm front desk and back office dashboard:
→ /services-demo?niche=roofing&businessName={{business_name}}&source=cold_email_touch_3

Or start with your free scorecard: → {{audit_link}}

Ryan`,
        },
      ],
    },
    {
      id: "roof-t4",
      touchNumber: 4,
      dayOffset: 12,
      framework: "Kennedy + Halbert",
      frameworkRationale:
        "Kennedy: direct, zero-fluff credibility for roofers (who respect directness). Halbert: problem-agitate-solve with human conversational tone — social proof at touch 4 converts better than features.",
      primaryCtaLabel: "See Both Demos Back to Back",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
      ],
      variants: [
        {
          id: "roof-t4-a",
          label: "Variant A",
          subject: "How {{city}} roofing companies are dominating storm season",
          isActive: true,
          body: `Hi {{owner_name}},

There's a predictable pattern in roofing markets after a major weather event.

The contractors who capture 60–70% of post-storm inquiries in a market aren't necessarily the most experienced. They've built three things that make them impossible to overlook: dominant Google visibility with 200+ reviews, an AI system that responds to inquiries before the homeowner even considers their second option, and a clear insurance claim process on their website that makes them the obvious, easiest choice for adjusters and homeowners alike.

The contractors losing those jobs? Good roofers. Invisible in search. No system for surge response.

I'm not here to sell software. I think {{business_name}} should be the company that dominates {{city}} when the next storm rolls through — and right now that position may be open.

Watch both demos together — 6 minutes, no sales call:

→ {{demo_link}}

Ryan`,
        },
        {
          id: "roof-t4-b",
          label: "Variant B",
          subject: "Roofing companies that dominate storm season all do this",
          isActive: false,
          body: `Hi {{owner_name}},

Four roofing companies I've worked with this year:
• Averaged 52 new Google reviews in 90 days
• 100% inquiry response rate during the 72-hour post-storm surge window
• First-page rankings for their primary storm-related service terms
• Increased insurance job capture by 40%+ in their first full season

None of them changed their crew or their materials. They changed their response systems and online presence.

Both demos take 6 minutes:

→ {{demo_link}}

Ryan`,
        },
      ],
    },
    {
      id: "roof-t5",
      touchNumber: 5,
      dayOffset: 18,
      framework: "Kennedy Break-up",
      frameworkRationale:
        "Kennedy: direct, no-pressure break-up email. Consistently generates the highest reply rate in any sequence by forcing a clear decision. Honest close that respects the prospect's time.",
      primaryCtaLabel: "Last Chance: Get Your Free Roofing Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "roof-t5-a",
          label: "Variant A",
          subject: "Closing the loop on {{business_name}}",
          isActive: true,
          body: `Hi {{owner_name}},

Four notes. No response — which tells me one of three things:

1. Storm season has you completely slammed (totally understandable for roofing)
2. This isn't a priority right now
3. You've already solved the storm lead capture and online visibility problems

All valid. No pressure from me.

If {{business_name}} is still losing storm leads in {{city}} to faster-responding, better-ranked competitors, the free scorecard is still open. 60 seconds, shows exactly where you stand.

→ {{audit_link}}

If not, I'll stop reaching out. Best of luck this season — I hope it's a big one for you.

Ryan
Booked Ranked Fundable

P.S. If the scorecard helps you capture one additional insurance job this season, it's paid for itself many times over.`,
        },
        {
          id: "roof-t5-b",
          label: "Variant B",
          subject: "Final note — then I'm out of your inbox",
          isActive: false,
          body: `Hi {{owner_name}},

This is my last email.

I believe {{business_name}} has the work quality and reputation to be the dominant roofing company in {{city}}. I've tried to show you what the systems side of that looks like a few times.

If the timing isn't right, just reply and I'll remove you immediately.

If storm lead capture and insurance job visibility are still on your radar: → {{audit_link}}

Ryan`,
        },
      ],
    },
  ],
};

// ─── buildDemoLink Helper ─────────────────────────────────────────────────────

/**
 * Builds a fully encoded demo link URL with niche, businessName, and source attribution.
 * Use in email copy body wherever a demo link is needed.
 *
 * @param niche - Slugified niche string (e.g. "dental", "real-estate")
 * @param businessName - Business name personalization token or literal value
 * @param source - Source attribution string (e.g. "cold_email_touch_3")
 */
export function buildDemoLink(
  niche: string,
  businessName: string,
  source: string,
): string {
  const params = new URLSearchParams({
    niche: niche.toLowerCase().replace(/\s+/g, "-"),
    businessName,
    source,
  });
  return `/services-demo?${params.toString()}`;
}

// ─── Real Estate Cold Sequence ────────────────────────────────────────────────

export const REAL_ESTATE_COLD_SEQUENCE: ColdEmailSequence = {
  id: "real-estate-cold-outreach",
  niche: "real-estate",
  name: "Real Estate Agent/Broker Cold Outreach — 5-Touch Listing & Lead Recovery",
  description:
    "Targets real estate agents and brokers losing listings to faster-responding competitors, hemorrhaging buyer leads after hours, and drowning in manual follow-up that kills momentum. Positions BRF as the system that makes them the obvious agent in their market.",
  pain: "Listings go to the agent who responds first — losing buyers and sellers to faster, better-positioned competitors",
  angle:
    "Speed-to-response + market timing anxiety + automated follow-up as competitive edge — free audit as tripwire",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 45,
  createdAt: "2026-04-20T10:00:00Z",
  updatedAt: "2026-04-20T10:00:00Z",
  stopTriggers: [
    "reply",
    "bounce",
    "unsubscribe",
    "complaint",
    "audit_completed",
  ],
  touches: [
    {
      id: "re-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Ogilvy + Hopkins",
      frameworkRationale:
        "Ogilvy: one specific, researched observation about their market position shows real homework. Hopkins: name the exact pain — seller leads lost to faster agents — before they ask. Specificity earns instant credibility and separates this from every other agent outreach they receive.",
      primaryCtaLabel: "Get Your Free Real Estate Business Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_finding}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "re-t1-a",
          label: "Variant A",
          subject: "Listings {{business_name}} is losing in {{city}} right now",
          isActive: true,
          body: `Hi {{owner_name}},

I was looking at your online presence in {{city}} today and spotted something specific that's likely costing you listing appointments every week:

{{audit_finding}}

Here's the reality most agents never face directly: when a homeowner is ready to list, they reach out to 2–3 agents. They sign with whoever responds first and feels most credible online. Not the most experienced. Not the best negotiator. The fastest responder with the strongest digital presence.

I also noticed:
• Your review count puts you below the top 3 agents in your market for "real estate agent {{city}}" searches
• Your website doesn't clearly show recent sales or market expertise above the fold
• There's no visible 24/7 inquiry response path — seller leads at 9pm go unanswered

I've built a free 3-stage scorecard for real estate professionals that takes 60 seconds and shows your visibility score, reputation score, and website conversion score — with specific action items. No sales call. No credit card.

→ {{audit_link}}

Worth 60 seconds?

Best,
Alex
Booked Ranked Fundable`,
        },
        {
          id: "re-t1-b",
          label: "Variant B",
          subject: "The agent winning your listings in {{city}} (60-sec proof)",
          isActive: false,
          body: `Hi {{owner_name}},

A homeowner in {{city}} decides to list their home tonight. They search "real estate agent {{city}}" at 8pm. They message the top 3 results.

The agent who responds in under 5 minutes wins that listing appointment 74% of the time.

The one who responds at 9am the next morning? Almost never gets a second chance.

Looking at {{business_name}}, I noticed {{audit_finding}}. The free 3-stage scorecard shows exactly where you stand on visibility, reputation, and website conversion — 60 seconds, no strings attached.

→ {{audit_link}}

Alex
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "re-t2",
      touchNumber: 2,
      dayOffset: 3,
      framework: "Sugarman + PASTOR",
      frameworkRationale:
        "Sugarman: each line pulls the reader down the slope — market timing anxiety in real estate is a psychological trigger that compounds with each paragraph. PASTOR: the transformation story of an agent who stopped losing listings to faster competitors makes the abstract concrete for a skeptical audience.",
      primaryCtaLabel: "See Your AI Agent Handle a Real Buyer Inquiry",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Or grab your free scorecard first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "re-t2-a",
          label: "Variant A",
          subject: "The listing appointment a {{city}} agent stopped losing",
          isActive: true,
          body: `Hi {{owner_name}},

Let me tell you about a real estate agent in a market that looks a lot like {{city}}.

She was a top producer for years. Experienced, well-connected, great with clients. But over 18 months she watched a younger competitor steadily eat into her market share — not because he was better, but because he was faster.

**P**roblem: Seller and buyer leads were inquiring at 7pm, 10pm, Saturday morning. When she called back the next day, they'd already signed with someone else.

**A**mplify: Every missed after-hours lead represented $8,500–$18,000 in GCI. She was losing 2–3 of those per month without even knowing it.

**S**tory: She activated an AI front desk. It responded to every inquiry in under 60 seconds with personalized follow-up. It qualified leads, answered market questions, and booked showing appointments — while she slept.

**T**ransformation: In 90 days, her inquiry response rate went from 31% to 100%. Listing appointments increased by 7 per month. The competitor stopped taking her business.

**O**ffer: I'd like to show you exactly how this works in a live 2-minute demo.

**R**esponse: → {{demo_link}}

If you haven't grabbed your free scorecard yet: → {{audit_link}}

Alex
Booked Ranked Fundable`,
        },
        {
          id: "re-t2-b",
          label: "Variant B",
          subject: "Why the fastest agent in {{city}} keeps winning your leads",
          isActive: false,
          body: `Hi {{owner_name}},

The data on real estate lead response is unambiguous:

Respond in under 5 minutes → 74% chance of qualifying the lead.
Respond in 60 minutes → 9% chance.
Respond in 24 hours → 2% chance.

Most agents respond in 18+ hours because they're with clients, driving, or simply offline.

An AI front desk changes the math entirely — it responds in under 60 seconds, 24 hours a day, qualifies the lead, and books the appointment before your competition even sees the notification.

I built a 2-minute demo showing exactly how this works for a real estate professional in {{city}}: → {{demo_link}}

Or see your specific gaps first with the free scorecard: → {{audit_link}}

Alex`,
        },
      ],
    },
    {
      id: "re-t3",
      touchNumber: 3,
      dayOffset: 7,
      framework: "Kennedy + Schwartz",
      frameworkRationale:
        "Kennedy: no fluff — by touch 3 the prospect is solution-aware, so state the problem, prove the cost, show the solution. Schwartz: match awareness level — amplify desire with a unified demo that shows the full system before introducing pricing.",
      primaryCtaLabel: "See Both Demos: AI Agent + Your Full Back Office",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Still haven't grabbed your free scorecard?",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "re-t3-a",
          label: "Variant A",
          subject: "What {{business_name}} gets on day one (the full stack)",
          isActive: true,
          body: `Hi {{owner_name}},

Here's everything inside our system for a real estate agent or broker like {{business_name}}:

✓ AI front desk — responds to every inquiry in under 60 seconds, 24/7 ($297/mo value)
✓ Automated lead qualification — asks the right questions, books appointments ($197/mo value)
✓ CRM that logs every lead, inquiry, and follow-up in one pipeline ($149/mo value)
✓ Reputation management — automated review requests after every closed transaction ($97/mo value)
✓ SEO visibility tracker — your ranking vs. top agents in {{city}} ($129/mo value)
✓ Market authority dashboard — recent sales, active listings, market stats in one view ($149/mo value)
✓ Weekly performance report emailed every Monday ($49/mo value)

Combined value: $1,067+/month.

The math on missed leads: if you're missing 3 qualified buyer or seller inquiries per month at $12,000 average GCI, that's $36,000/year going to the agent who responded first.

See exactly how this looks — both demos back to back, 6 minutes total:

→ /services-demo?niche=real-estate&businessName={{business_name}}&source=cold_email_touch_3

Free scorecard: → {{audit_link}}

Alex`,
        },
        {
          id: "re-t3-b",
          label: "Variant B",
          subject: "The GCI math for {{business_name}} (3 missed leads/month)",
          isActive: false,
          body: `Hi {{owner_name}},

Real estate math for {{business_name}}:

Missed qualified leads per month (without AI front desk): 3–5
Average GCI per closed transaction: $10,000–$18,000
Monthly GCI lost to faster-responding agents: $30,000–$90,000
Annual GCI lost: $360,000–$1,080,000

That's the range you're competing for on response speed and online visibility alone.

The platform covers all of it: AI front desk, lead qualification, CRM, reputation management, SEO visibility in {{city}}, and a market authority dashboard.

See both demos back to back — the client experience and your back office:
→ /services-demo?niche=real-estate&businessName={{business_name}}&source=cold_email_touch_3

Or start with your free scorecard: → {{audit_link}}

Alex`,
        },
      ],
    },
    {
      id: "re-t4",
      touchNumber: 4,
      dayOffset: 14,
      framework: "Halbert + Abraham",
      frameworkRationale:
        "Halbert: problem-agitate-solve with a human, conversational tone — social proof at touch 4 is more persuasive than feature lists for agents who've seen hundreds of sales pitches. Abraham: strategy of preeminence — frame as a trusted market advisor, not a software vendor.",
      primaryCtaLabel: "See Both Demos Back to Back",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
      ],
      variants: [
        {
          id: "re-t4-a",
          label: "Variant A",
          subject: "How {{city}} agents are becoming the obvious choice",
          isActive: true,
          body: `Hi {{owner_name}},

There's a shift happening in real estate markets right now, and {{city}} is no exception.

The agents consistently winning listing appointments aren't necessarily the most experienced or best negotiators. They've built a presence that makes them impossible to overlook: they show up at the top of search when homeowners are ready to move, they have 150+ reviews at 4.9 stars, and when a seller reaches out at 9pm, someone — or something — responds within 60 seconds.

The agents losing? Strong producers. Deep local knowledge. Invisible in search. No system for after-hours leads. Still calling back the next morning.

I'm not here to sell software. I'm here because I think {{business_name}} should be the obvious agent in {{city}} — and right now, that position may be open for a competitor to claim.

Watch both demos together — 6 minutes, no sales pitch, no call required:

→ {{demo_link}}

Alex`,
        },
        {
          id: "re-t4-b",
          label: "Variant B",
          subject:
            "3 agents in {{city}} who stopped losing listings to competitors",
          isActive: false,
          body: `Hi {{owner_name}},

Three real estate agents I've worked with this quarter:

• Averaged 39 new Google reviews in 90 days — jumped to top-3 local search results
• 100% response rate on after-hours buyer and seller inquiries
• Listing appointments increased by 8–11 per month without adding to ad spend

None of them changed their expertise or market knowledge. They changed their response systems and online visibility.

Both demos together take 6 minutes — I think you'll see exactly what I mean:

→ {{demo_link}}

Alex`,
        },
      ],
    },
    {
      id: "re-t5",
      touchNumber: 5,
      dayOffset: 21,
      framework: "Kennedy Break-up",
      frameworkRationale:
        "Kennedy: zero fluff, direct respect for their time. The break-up email consistently generates the highest reply rates — it forces a final decision. Clean, pressure-free close that respects the prospect's expertise and leaves a strong final impression.",
      primaryCtaLabel: "Last Chance: Get Your Free Real Estate Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "re-t5-a",
          label: "Variant A",
          subject: "Closing the loop on {{business_name}}",
          isActive: true,
          body: `Hi {{owner_name}},

I've sent four notes over the past three weeks. No response — which tells me one of three things:

1. You're in the middle of a transaction cycle and simply don't have bandwidth (completely understand — deals take everything)
2. Growing your market presence isn't a priority right now
3. You've already solved the response speed and visibility problem

Any of those are valid. I'm not here to be a nuisance.

If {{business_name}} is still losing listing appointments or buyer leads in {{city}} to faster-responding, better-ranked agents, the free scorecard is still open. 60 seconds, shows exactly where you stand, no sales call required.

→ {{audit_link}}

If not, I'll stop reaching out. Either way, I wish you a strong quarter.

Alex
Booked Ranked Fundable

P.S. The break-even math is simple: if the scorecard helps you recover one listing appointment per month, it's paid for itself many times over.`,
        },
        {
          id: "re-t5-b",
          label: "Variant B",
          subject: "Last note — then I'll get out of your inbox",
          isActive: false,
          body: `Hi {{owner_name}},

This is my last note.

I believe {{business_name}} has the market knowledge and client relationships to be the dominant agent in {{city}}. I've tried to show you what the systems side of that looks like a few times now.

If timing's wrong or you're not interested, just reply and I'll remove you immediately.

If you're still thinking about the after-hours lead and visibility problems we've discussed, the free 3-stage scorecard is still open:

→ {{audit_link}}

Either way, I appreciate your time.

Alex`,
        },
      ],
    },
  ],
};

// ─── Mortgage Broker Cold Sequence ────────────────────────────────────────────

export const MORTGAGE_COLD_SEQUENCE: ColdEmailSequence = {
  id: "mortgage-cold-outreach",
  niche: "mortgage",
  name: "Mortgage Broker Cold Outreach — 5-Touch Borrower Capture & Retention",
  description:
    "Targets mortgage brokers losing borrowers to banks and online lenders because of slow response, weak online presence, and dependency on referral sources that can dry up overnight. Positions BRF as the system that makes them the obvious broker in their market.",
  pain: "Borrowers shop rates online and go with whoever responds first — losing pre-approvals to banks and rocket-style lenders who have automated follow-up",
  angle:
    "Rate anxiety + referral source dependency + speed-to-pre-approval as competitive edge — free audit as tripwire",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 40,
  createdAt: "2026-04-20T10:00:00Z",
  updatedAt: "2026-04-20T10:00:00Z",
  stopTriggers: [
    "reply",
    "bounce",
    "unsubscribe",
    "complaint",
    "audit_completed",
  ],
  touches: [
    {
      id: "mort-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Hopkins + Ogilvy",
      frameworkRationale:
        "Hopkins: specificity — name the exact problem (borrowers comparison-shopping and going with whoever responds first) before they articulate it. Ogilvy: one specific, researched finding shows you understand their competitive landscape, not just their industry.",
      primaryCtaLabel: "Get Your Free Mortgage Business Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_finding}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "mort-t1-a",
          label: "Variant A",
          subject: "Borrowers {{business_name}} is losing before they call you",
          isActive: true,
          body: `Hi {{owner_name}},

I was looking at your online presence in {{city}} today and noticed something specific that's likely costing you pre-approval applications every week:

{{audit_finding}}

Here's what the data shows about how borrowers choose a mortgage broker today: 71% of first-time buyers apply with the first lender who responds to their inquiry — not the one with the best rate. They're scared, they're on a deadline, and they book the broker who feels trustworthy and responds fastest.

If you're responding to new inquiries hours later, you've already lost most of them.

Beyond response speed, I also noticed:
• Your review profile puts you below the top 3 local brokers in visibility
• Your website doesn't have a clear, mobile-optimized pre-approval pathway
• There's no 24/7 response system visible for rate questions that come in after hours

I've built a free 3-stage scorecard for mortgage professionals — 60 seconds, shows your visibility score, reputation score, and website conversion score with specific action items. No sales call. No credit card.

→ {{audit_link}}

Worth 60 seconds?

Best,
Michelle
Booked Ranked Fundable`,
        },
        {
          id: "mort-t1-b",
          label: "Variant B",
          subject:
            "The borrower who chose your competitor (not because of rates)",
          isActive: false,
          body: `Hi {{owner_name}},

A borrower in {{city}} is pre-approved and ready to move. They submitted inquiries to 3 brokers Sunday night at 9pm. The first one who responded — within 4 minutes — got the application.

The rate wasn't the lowest. The response was the fastest.

This plays out dozens of times per week in every mortgage market. The brokers winning aren't always the sharpest — they have systems that respond before competitors even wake up.

Looking at {{business_name}}, I noticed {{audit_finding}}. The free 3-stage scorecard shows exactly where you stand — 60 seconds, no strings.

→ {{audit_link}}

Michelle
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "mort-t2",
      touchNumber: 2,
      dayOffset: 3,
      framework: "Sugarman + Kennedy",
      frameworkRationale:
        "Sugarman: borrower anxiety compounds — each paragraph increases urgency around referral source dependency. Kennedy: direct framing that respects the broker's intelligence — state the problem cleanly, show the cost, offer the proof.",
      primaryCtaLabel: "See Your AI Front Desk Handle a Rate Inquiry",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Or grab your free scorecard first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "mort-t2-a",
          label: "Variant A",
          subject: "The referral source problem no one talks about in {{city}}",
          isActive: true,
          body: `Hi {{owner_name}},

Most mortgage brokers I work with have the same vulnerability: 80% of their business comes from 3–5 referral sources.

When one Realtor retires, joins a mega-team, or gets poached by a competitor, that pipeline dries up — and they have nothing to replace it with because they built zero direct online presence.

The brokers who don't have this problem have done one thing differently: they built a system for generating and converting inbound leads directly — so no single referral source can threaten their pipeline.

**P**roblem: Referral dependency is a ticking clock. Every year without direct inbound is a year closer to your pipeline collapsing.

**A**mplify: Meanwhile, Rocket Mortgage spent $400 million building systems to take your borrowers at 2am. You can't out-spend them, but you can out-respond them in your local market.

**S**tory: A mortgage broker in a market like {{city}} built a direct inbound system using the AI front desk and local SEO tools. In 90 days, direct inbound applications went from 2/month to 14/month. He stopped fearing what would happen if his top Realtor retired.

**T**ransformation: Rate inquiries that come in at 10pm get an instant, professional response. Pre-approval applications arrive without a Realtor referral.

**O**ffer: I want to show you exactly how this works in a 2-minute live demo.

**R**esponse: → {{demo_link}}

Or the free scorecard first: → {{audit_link}}

Michelle
Booked Ranked Fundable`,
        },
        {
          id: "mort-t2-b",
          label: "Variant B",
          subject: "Why borrowers choose online lenders over local brokers",
          isActive: false,
          body: `Hi {{owner_name}},

The reason borrowers go to Rocket or Better.com isn't rates. Their data shows most borrowers will pay 0.125–0.25% more in rate to get a faster, easier application experience.

What they're paying for is speed and instant response.

Local mortgage brokers can match or beat that experience with the right system — and they add something the online lenders can never offer: a real person in the borrower's market who knows the agents, the appraisers, and the local quirks.

For {{business_name}} in {{city}}, an AI front desk bridges the gap — instant rate inquiry responses, 24/7, while you focus on the relationships only you can build.

I built a 2-minute demo showing exactly how this works: → {{demo_link}}

Or see your specific gaps first: → {{audit_link}}

Michelle`,
        },
      ],
    },
    {
      id: "mort-t3",
      touchNumber: 3,
      dayOffset: 7,
      framework: "Hormozi + Schwartz",
      frameworkRationale:
        "Hormozi: stacked value makes the ROI undeniable — show every component with its standalone cost. Schwartz: solution-aware prospects at touch 3 need mechanism proof, not problem education — the unified demo delivers exactly that.",
      primaryCtaLabel:
        "See Both Demos: AI Agent + Your Full Mortgage Dashboard",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Still haven't grabbed your free scorecard?",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "mort-t3-a",
          label: "Variant A",
          subject:
            "The mortgage broker stack for {{business_name}} (full breakdown)",
          isActive: true,
          body: `Hi {{owner_name}},

Here's everything inside our system for a mortgage professional like {{business_name}}:

✓ AI front desk — responds to every rate inquiry in under 60 seconds, 24/7 ($297/mo value)
✓ Automated pre-approval intake — captures borrower info and kicks off the application ($197/mo value)
✓ CRM with loan pipeline — every borrower, rate lock, and closing in one view ($149/mo value)
✓ Reputation management — automated review requests after every closed loan ($97/mo value)
✓ Local SEO visibility tracker — your ranking vs. top brokers in {{city}} ($129/mo value)
✓ Referral partner CRM — tracks Realtor relationships and referral volume by source ($129/mo value)
✓ Weekly performance report every Monday ($49/mo value)

Combined value: $1,047+/month.

The math on missed applications: 3 qualified borrowers per month at $4,500 average broker commission = $13,500/month, $162,000/year going to whoever responded first.

See the full system — both demos back to back, 6 minutes:

→ /services-demo?niche=mortgage&businessName={{business_name}}&source=cold_email_touch_3

Free scorecard: → {{audit_link}}

Michelle`,
        },
        {
          id: "mort-t3-b",
          label: "Variant B",
          subject:
            "The missed application math for {{business_name}} (it adds up)",
          isActive: false,
          body: `Hi {{owner_name}},

Mortgage math for {{business_name}}:

Missed qualified applications per month (without AI front desk): 3–6
Average broker commission per closed loan: $3,500–$6,500
Monthly revenue lost to faster-responding brokers and online lenders: $10,500–$39,000
Annual revenue lost: $126,000–$468,000

That's the window you're competing for on response speed and online visibility alone.

The full platform: AI front desk, automated pre-approval intake, loan pipeline CRM, reputation management, SEO visibility in {{city}}, and referral partner tracking.

See both demos back to back:
→ /services-demo?niche=mortgage&businessName={{business_name}}&source=cold_email_touch_3

Or your free scorecard first: → {{audit_link}}

Michelle`,
        },
      ],
    },
    {
      id: "mort-t4",
      touchNumber: 4,
      dayOffset: 14,
      framework: "Abraham + Halbert",
      frameworkRationale:
        "Abraham: strategy of preeminence — position as a trusted advisor who sees the full competitive picture, not another fintech vendor. Halbert: conversational social proof at touch 4 is more persuasive than any feature list for brokers who've been pitched by dozens of companies.",
      primaryCtaLabel: "See Both Demos Back to Back",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
      ],
      variants: [
        {
          id: "mort-t4-a",
          label: "Variant A",
          subject:
            "How {{city}} mortgage brokers are building rate-proof pipelines",
          isActive: true,
          body: `Hi {{owner_name}},

There's a pattern among the mortgage brokers growing fastest in markets like {{city}}.

They've solved two problems at once: they respond to every borrower inquiry instantly — so they never lose to a bank just because of speed — and they've built a direct inbound pipeline so no single Realtor relationship controls their livelihood.

The brokers I see struggling? Deep expertise, great rates, loyal partners. But 90% of their business comes from 4 referral sources, their online presence is an afterthought, and rate-comparison apps are slowly training their target borrowers to start the conversation elsewhere.

I'm not here to sell software. I'm here because I think {{business_name}} should be the broker borrowers in {{city}} find first and trust most — and right now that market position may be sitting unclaimed.

Watch both demos back to back — 6 minutes, no sales pitch:

→ {{demo_link}}

Michelle`,
        },
        {
          id: "mort-t4-b",
          label: "Variant B",
          subject:
            "3 mortgage brokers in {{city}} who stopped losing to online lenders",
          isActive: false,
          body: `Hi {{owner_name}},

Three mortgage brokers I've worked with this quarter:

• Built direct inbound applications from 2/month to 16/month without referral sources
• 100% response rate on rate and pre-approval inquiries including weekends and evenings
• Added 31 new Google reviews in 90 days, jumping to top-3 local search results

None of them changed their rate competitiveness. They changed their response systems and online visibility.

Both demos take 6 minutes — I think it'll be clear why this works:

→ {{demo_link}}

Michelle`,
        },
      ],
    },
    {
      id: "mort-t5",
      touchNumber: 5,
      dayOffset: 21,
      framework: "Kennedy Break-up",
      frameworkRationale:
        "Kennedy: zero fluff, direct respect for their time. The break-up email generates the highest reply rates by forcing a clear decision. Honest close that positions the free audit as a valuable standalone tool, not a sales hook.",
      primaryCtaLabel: "Last Chance: Get Your Free Mortgage Business Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "mort-t5-a",
          label: "Variant A",
          subject: "Closing the loop on {{business_name}}",
          isActive: true,
          body: `Hi {{owner_name}},

I've sent four notes over the past three weeks. No response — and that's fine.

One of three things is probably true:

1. Pipeline is strong right now and this isn't a priority
2. You've already solved the response speed and online visibility gaps
3. You're maxed on loans and genuinely don't have bandwidth

All valid. No pressure.

If {{business_name}} is still losing borrowers in {{city}} to banks, online lenders, or faster-responding local brokers, the free scorecard is still available. 60 seconds, shows exactly where you stand — no sales call attached.

→ {{audit_link}}

If not, I'll stop reaching out. I wish you a strong close volume this quarter.

Michelle
Booked Ranked Fundable

P.S. The math is simple: if the scorecard helps you recover one additional closed loan per month, it's paid for itself many times over.`,
        },
        {
          id: "mort-t5-b",
          label: "Variant B",
          subject: "Last note — then I'm out of your inbox",
          isActive: false,
          body: `Hi {{owner_name}},

This is my final email.

I believe {{business_name}} has the expertise and relationships to be the first call for borrowers in {{city}}. I've tried to show you what the systems side of that looks like a few times now.

If timing isn't right, just reply and I'll remove you immediately.

If you're still thinking about the referral dependency and borrower response gaps we've discussed:

→ {{audit_link}}

Either way — thank you for your time.

Michelle`,
        },
      ],
    },
  ],
};

// ─── Chiropractor Cold Sequence ────────────────────────────────────────────────

export const CHIROPRACTOR_COLD_SEQUENCE: ColdEmailSequence = {
  id: "chiropractor-cold-outreach",
  niche: "chiropractor",
  name: "Chiropractor Cold Outreach — 5-Touch New Patient & Retention Growth",
  description:
    "Targets chiropractic practices losing new patients to PTs and urgent care clinics, hemorrhaging no-shows from poor follow-up, and failing to retain long-term wellness patients. Positions BRF as the system that makes them the obvious choice in their market.",
  pain: "New patients go to whoever shows up online and responds first — losing to PTs, urgent care, and competitors with better visibility and no-show rates destroying revenue",
  angle:
    "No-show rate + patient retention + positioning against PTs as the visibility and follow-up gap — free audit as tripwire",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 40,
  createdAt: "2026-04-20T10:00:00Z",
  updatedAt: "2026-04-20T10:00:00Z",
  stopTriggers: [
    "reply",
    "bounce",
    "unsubscribe",
    "complaint",
    "audit_completed",
  ],
  touches: [
    {
      id: "chiro-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Ogilvy + Hopkins",
      frameworkRationale:
        "Ogilvy: one specific, researched observation about their online position demonstrates real homework. Hopkins: name the exact pain — no-shows and patients lost to faster-responding PTs — before they articulate it themselves. Specificity earns credibility in a crowded wellness market.",
      primaryCtaLabel: "Get Your Free Chiropractic Practice Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_finding}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "chiro-t1-a",
          label: "Variant A",
          subject: "3 gaps costing {{business_name}} new patients in {{city}}",
          isActive: true,
          body: `Hi {{owner_name}},

I was looking at {{business_name}}'s online presence today and noticed three specific things that are likely costing you new patients in {{city}} every week:

1. {{audit_finding}} — this is the #1 conversion killer for chiropractic practices in competitive markets
2. No visible response path for after-hours appointment requests — patients searching for back pain relief at 10pm book whoever responds first
3. Your review velocity has stalled — practices with 150+ reviews are outranking you for "chiropractor {{city}}" searches

Here's what that costs: the average no-show represents $85–$180 in lost revenue. But losing a new patient acquisition to a faster-responding PT practice? That's $1,200–$4,800 in lifetime patient value gone permanently.

The good news: all three are fixable systems problems, not quality-of-care problems.

I've built a free 3-stage practice scorecard that takes 60 seconds and shows your SEO score, reputation score, and website conversion score with specific action items. No sales call. No credit card.

→ {{audit_link}}

Worth 60 seconds?

Best,
Dr. Jake (BRF Practice Growth Team)
Booked Ranked Fundable`,
        },
        {
          id: "chiro-t1-b",
          label: "Variant B",
          subject:
            "Why patients in {{city}} are choosing PTs over chiropractors",
          isActive: false,
          body: `Hi {{owner_name}},

In {{city}}, a patient with lower back pain runs a quick Google search. They see PT practices, urgent care clinics, and chiropractic offices. The one with the most reviews, fastest website, and an online booking option gets the appointment.

The chiropractic practice with better outcomes but fewer reviews and a slower website? Loses the patient before they ever see the waiting room.

Looking at {{business_name}}, I noticed {{audit_finding}}. The free 3-stage practice scorecard shows exactly where you stand on visibility, reputation, and website conversion — 60 seconds, no strings.

→ {{audit_link}}

Dr. Jake
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "chiro-t2",
      touchNumber: 2,
      dayOffset: 3,
      framework: "PASTOR + Schwartz",
      frameworkRationale:
        "PASTOR: the no-show revenue loss is visceral for chiropractors — amplify through story and show the transformation. Schwartz: these owners are problem-aware by touch 2, so amplify desire for the solution rather than re-educating on the problem.",
      primaryCtaLabel: "See Your AI Front Desk Handle a New Patient Inquiry",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Or grab your free scorecard first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "chiro-t2-a",
          label: "Variant A",
          subject: "What a {{city}} chiropractor discovered about his no-shows",
          isActive: true,
          body: `Hi {{owner_name}},

Let me tell you about a chiropractor in a market that looks a lot like {{city}}.

He had a solid practice — great clinical outcomes, loyal long-term patients. But two problems kept eating his revenue: new patients going to the PT down the street, and a no-show rate hovering around 22%.

**P**roblem: Every new patient inquiry that came in after 5pm was going unanswered until the next morning. By then, half had booked elsewhere.

**A**mplify: His no-show rate of 22% meant he was losing 8–11 appointments per week. At $125 average, that's $1,000–$1,375 vanishing every week without any treatment ever being rendered.

**S**tory: He activated the AI front desk for after-hours inquiries and automated appointment reminders. New patient response time dropped to under 90 seconds. No-show rate fell from 22% to 7%.

**T**ransformation: New patient inquiries converted at 3x the previous rate. Revenue recovered $4,200/month from reduced no-shows alone — before a single new patient was added.

**O**ffer: I'd like to show you exactly how this works for a chiropractic practice in a live 2-minute demo.

**R**esponse: → {{demo_link}}

Free scorecard if you want to start there: → {{audit_link}}

Dr. Jake
Booked Ranked Fundable`,
        },
        {
          id: "chiro-t2-b",
          label: "Variant B",
          subject:
            "The no-show rate that's silently destroying chiropractic revenue",
          isActive: false,
          body: `Hi {{owner_name}},

The average chiropractic practice has a 15–25% no-show rate. At $125 per appointment, a 20% no-show rate on a full schedule of 80 appointments per week means $2,000 per week — $104,000 per year — in scheduled revenue that walks out the door untreated.

The practices that have dropped their no-show rate below 5% have one thing in common: automated appointment reminders that go out 48 hours before, 24 hours before, and 2 hours before. Not manual calls. Automated SMS and email.

For {{business_name}} in {{city}}, this is a systems problem — not a patient quality problem.

I want to show you how the AI front desk and reminder system works: → {{demo_link}}

Or see your specific gaps first: → {{audit_link}}

Dr. Jake`,
        },
      ],
    },
    {
      id: "chiro-t3",
      touchNumber: 3,
      dayOffset: 7,
      framework: "Hormozi + Kennedy",
      frameworkRationale:
        "Hormozi: stacked value makes the ROI undeniable for a practice owner — show every component with standalone costs. Kennedy: no fluff, state the cost of inaction clearly. At touch 3, the unified demo closes more prospects than a feature list.",
      primaryCtaLabel: "See Both Demos: AI Agent + Your Practice Dashboard",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Still haven't grabbed your free scorecard?",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "chiro-t3-a",
          label: "Variant A",
          subject:
            "The chiropractic practice growth stack (and the no-show math)",
          isActive: true,
          body: `Hi {{owner_name}},

Here's what's inside our platform for a chiropractic practice like {{business_name}}:

✓ AI front desk — responds to every new patient inquiry in under 60 seconds, 24/7 ($297/mo value)
✓ Automated appointment reminders — 48hr/24hr/2hr SMS and email reduces no-shows to under 7% ($197/mo value)
✓ New patient intake flow — captures insurance, chief complaint, and history before the appointment ($149/mo value)
✓ Reputation management — automated review requests after each visit ($97/mo value)
✓ SEO visibility tracker — your ranking vs. PTs and competitors in {{city}} ($129/mo value)
✓ Patient retention automation — reactivates dormant patients at 60 and 90 days ($147/mo value)
✓ Weekly performance report ($49/mo value)

Combined value: $1,065+/month.

The math on no-shows alone: dropping your no-show rate from 20% to 7% on 80 weekly appointments at $125 = $1,300/week — $67,600/year — in recovered revenue.

That's before a single new patient is added.

See the full system — both demos back to back, 6 minutes:

→ /services-demo?niche=chiropractor&businessName={{business_name}}&source=cold_email_touch_3

Free scorecard: → {{audit_link}}

Dr. Jake`,
        },
        {
          id: "chiro-t3-b",
          label: "Variant B",
          subject: "The no-show and new patient math for {{business_name}}",
          isActive: false,
          body: `Hi {{owner_name}},

Two numbers that matter for a chiropractic practice in {{city}}:

No-show recovery: 80 appointments/week × 15% no-show improvement × $125 = $1,500/week = $78,000/year recovered
New patient conversion: Responding in under 60 seconds instead of the next day = 3x conversion rate on after-hours inquiries

The platform covers both: AI front desk for after-hours new patient inquiries, automated reminders for no-show reduction, patient reactivation for dormant cases, and reputation management to keep you ranked above the PT down the street.

See both demos back to back:
→ /services-demo?niche=chiropractor&businessName={{business_name}}&source=cold_email_touch_3

Or your free scorecard: → {{audit_link}}

Dr. Jake`,
        },
      ],
    },
    {
      id: "chiro-t4",
      touchNumber: 4,
      dayOffset: 14,
      framework: "Abraham + Halbert",
      frameworkRationale:
        "Abraham: strategy of preeminence — position as a trusted advisor who sees the full competitive landscape, not another healthcare marketing vendor. Halbert: conversational social proof at touch 4 is more persuasive than feature lists for practice owners who've been pitched by dozens of companies.",
      primaryCtaLabel: "See Both Demos Back to Back",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
      ],
      variants: [
        {
          id: "chiro-t4-a",
          label: "Variant A",
          subject:
            "How {{city}} chiropractic practices are beating PTs for new patients",
          isActive: true,
          body: `Hi {{owner_name}},

There's a shift happening in healthcare search in markets like {{city}}.

The chiropractic practices winning new patients from Google aren't necessarily the ones with the deepest clinical expertise. They've built a digital presence that makes them impossible to overlook: they show up first in search, they have 200+ reviews at 4.9 stars, and when a patient submits a new patient inquiry at 9pm, someone — or something — responds within 60 seconds.

The practices losing? Outstanding clinical outcomes. Invisible online. After-hours inquiries going unanswered. New patients defaulting to PTs and urgent care because they were easier to book.

I'm not here to sell software. I think {{business_name}} should be the obvious choice when someone in {{city}} searches for relief — and right now, that position may be open for a competitor to claim.

Watch both demos together — 6 minutes, no sales pitch:

→ {{demo_link}}

Dr. Jake`,
        },
        {
          id: "chiro-t4-b",
          label: "Variant B",
          subject:
            "3 chiropractic practices that stopped losing to PTs (what they changed)",
          isActive: false,
          body: `Hi {{owner_name}},

Three chiropractic practices I've worked with this quarter:

• Averaged 44 new Google reviews in 90 days — jumped above local PT practices in search
• No-show rate dropped from 19% to 6% with automated reminders
• New patient inquiries responded to in under 90 seconds — conversion tripled

None of them changed their treatment protocols. They changed their front-office systems.

Both demos take 6 minutes:

→ {{demo_link}}

Dr. Jake`,
        },
      ],
    },
    {
      id: "chiro-t5",
      touchNumber: 5,
      dayOffset: 21,
      framework: "Kennedy Break-up",
      frameworkRationale:
        "Kennedy: zero fluff, direct respect for their time. The break-up email generates the highest reply rate by forcing a clear decision. Honest close that leaves a strong final impression with no pressure — practice owners respond to being treated like professionals.",
      primaryCtaLabel: "Last Chance: Get Your Free Practice Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "chiro-t5-a",
          label: "Variant A",
          subject: "Closing the loop on {{business_name}}",
          isActive: true,
          body: `Hi {{owner_name}},

I've sent four notes over the past three weeks. No response — which tells me one of three things:

1. You're fully booked and these problems aren't urgent right now (the best possible reason)
2. New patient acquisition and no-show rates aren't a priority at this stage
3. You've already solved the visibility and follow-up gaps

All valid. I'm not here to be persistent past the point of usefulness.

If {{business_name}} is still losing new patients in {{city}} to PTs and better-ranked competitors, or if your no-show rate is still eating revenue, the free practice scorecard is still available. 60 seconds, shows exactly where you stand, no sales call required.

→ {{audit_link}}

If not, I'll stop reaching out. I wish you a full schedule and a low no-show rate.

Dr. Jake
Booked Ranked Fundable

P.S. If the scorecard identifies one systems fix that recovers 3 no-shows per week, it's paid for itself many times over.`,
        },
        {
          id: "chiro-t5-b",
          label: "Variant B",
          subject: "Last note — then I'm out of your inbox",
          isActive: false,
          body: `Hi {{owner_name}},

This is my last email.

I believe {{business_name}} has the clinical outcomes and patient relationships to be the dominant chiropractic practice in {{city}}. I've tried to show you what the systems side of that looks like a few times now.

If timing isn't right, just reply and I'll remove you immediately.

If you're still thinking about new patient acquisition and no-show reduction:

→ {{audit_link}}

Either way — thank you for your time and your work.

Dr. Jake`,
        },
      ],
    },
  ],
};

// ─── Dental Practice Cold Sequence ────────────────────────────────────────────

export const DENTAL_COLD_SEQUENCE: ColdEmailSequence = {
  id: "dental-cold-outreach",
  niche: "dental",
  name: "Dental Practice Cold Outreach — 5-Touch New Patient & Cosmetic Revenue Growth",
  description:
    "Targets dental practices losing new patients to chain dentists and online schedulers, suffering from high no-show rates, and missing significant cosmetic revenue because patients aren't being systematically educated and followed up with. Positions BRF as the system that makes them the obvious dental choice in their market.",
  pain: "New patients book whoever they find online first — chain dental offices and online schedulers are capturing patients who don't know independent practices exist, and cosmetic revenue is being left on the table from poor follow-up",
  angle:
    "Patient fear reducing bookings + high no-show rate + cosmetic revenue opportunity + chain dental competition — free audit as tripwire",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 40,
  createdAt: "2026-04-20T10:00:00Z",
  updatedAt: "2026-04-20T10:00:00Z",
  stopTriggers: [
    "reply",
    "bounce",
    "unsubscribe",
    "complaint",
    "audit_completed",
  ],
  touches: [
    {
      id: "dent-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Ogilvy + Schwartz",
      frameworkRationale:
        "Ogilvy: one specific, researched observation shows real homework and differentiates from every other dental marketing pitch. Schwartz: match the awareness level — dental practice owners are acutely aware of the chain dentist problem, so start there and amplify existing anxiety before offering a solution.",
      primaryCtaLabel: "Get Your Free Dental Practice Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_finding}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "dent-t1-a",
          label: "Variant A",
          subject:
            "Aspen Dental opened in {{city}} — here's what that means for you",
          isActive: true,
          body: `Hi {{owner_name}},

I was looking at the dental landscape in {{city}} today and noticed something specific about {{business_name}}'s position:

{{audit_finding}}

Here's the reality independent dental practices rarely discuss openly: corporate chains like Aspen Dental and Bright Now! aren't winning on clinical quality. They're winning on visibility, convenience, and instant online booking. When a new patient in {{city}} Googles "dentist near me" at 7pm, they see whichever office comes up first and has online scheduling. They book it. They don't research the dentist's credentials.

The independent practices that consistently win new patients against the chains have one thing in common: they're just as visible, just as easy to book, and they show the trust signals that make the clinical quality obvious before the patient walks in.

I've built a free 3-stage practice scorecard that takes 60 seconds — shows your SEO score, reputation score, and website conversion score with specific action items. No sales call. No credit card.

→ {{audit_link}}

Worth 60 seconds?

Best,
Dr. Patel (BRF Practice Growth Team)
Booked Ranked Fundable`,
        },
        {
          id: "dent-t1-b",
          label: "Variant B",
          subject:
            "Why new patients in {{city}} are choosing chain dentists over you",
          isActive: false,
          body: `Hi {{owner_name}},

A new patient in {{city}} needs a dentist. They search "dentist near me." They see 7 options. They look at reviews, check if online booking is available, and click the first one that feels easy. The whole decision takes 3 minutes.

They're not evaluating clinical quality. They're evaluating friction.

Independent dental practices with better clinical outcomes lose new patients to chains every day because their online presence doesn't reflect their actual quality. The chain with 400 reviews and online booking wins — not the dentist with 40 reviews and a phone number to call during business hours.

Looking at {{business_name}}, I noticed {{audit_finding}}. The free 3-stage scorecard shows exactly where you stand — 60 seconds, no strings.

→ {{audit_link}}

Dr. Patel
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "dent-t2",
      touchNumber: 2,
      dayOffset: 3,
      framework: "PASTOR + Sugarman",
      frameworkRationale:
        "PASTOR: the no-show and patient anxiety pain is visceral for dental practice owners — amplify through story showing the full transformation. Sugarman: each paragraph builds desire for the solution — the cosmetic revenue angle is a curiosity hook that pulls the reader through to the demo CTA.",
      primaryCtaLabel: "See Your AI Front Desk Handle a New Patient Inquiry",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Or grab your free scorecard first",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "dent-t2-a",
          label: "Variant A",
          subject:
            "The dental practice that stopped losing to Aspen Dental in {{city}}",
          isActive: true,
          body: `Hi {{owner_name}},

Let me tell you about a dental practice in a market that looks a lot like {{city}}.

Independent, family-owned, 18 years of patients. But over three years, a corporate chain opened nearby and started pulling new patients away — not with better clinical care, but with 24/7 online booking, 500+ Google reviews, and a website that loaded instantly on mobile.

**P**roblem: Their new patient acquisition had dropped 31% over 36 months. Their no-show rate was sitting at 18%. Two hygienists were running 60% chairs.

**A**mplify: Every new patient lost to the chain represented $2,400–$6,800 in lifetime patient value. 12 patients lost per month = $28,800–$81,600 in LTV walking out the door annually.

**S**tory: They activated the AI front desk, online booking, and automated appointment reminders. New patient inquiries started converting at 3x the previous rate. No-show rate dropped from 18% to 5%.

**T**ransformation: Their hygienists went from 60% full to 94% full in 90 days. The practice stopped losing patients to the chain down the street — not because the clinical quality changed, but because the patient experience of finding them and booking became as easy as the chain.

**O**ffer: I'd like to show you exactly how this works for a dental practice in a live demo.

**R**esponse: → {{demo_link}}

Free scorecard: → {{audit_link}}

Dr. Patel
Booked Ranked Fundable`,
        },
        {
          id: "dent-t2-b",
          label: "Variant B",
          subject:
            "The cosmetic revenue your patients aren't telling you they want",
          isActive: false,
          body: `Hi {{owner_name}},

Here's a number that surprises most dental practice owners I talk to: 68% of patients who receive a whitening or cosmetic consultation during a regular visit will accept treatment — if they're asked.

Most practices never ask systematically. No follow-up, no educational sequence, no reminder that the consultation even happened.

For {{business_name}} in {{city}}, that's potentially $18,000–$45,000 per year in cosmetic revenue sitting uncaptured in your existing patient list — from people who are already in your chair twice a year.

An automated patient education and follow-up system captures all of it without adding a single staff hour.

I want to show you how this works in a live demo: → {{demo_link}}

Or see your specific gaps first: → {{audit_link}}

Dr. Patel`,
        },
      ],
    },
    {
      id: "dent-t3",
      touchNumber: 3,
      dayOffset: 7,
      framework: "Hormozi + Kennedy",
      frameworkRationale:
        "Hormozi: stacked value with the math makes the ROI undeniable for a practice owner. Kennedy: direct framing — state the cost of inaction with specificity. The unified demo at touch 3 shows the full system rather than individual features.",
      primaryCtaLabel: "See Both Demos: AI Agent + Your Practice Dashboard",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Still haven't grabbed your free scorecard?",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "dent-t3-a",
          label: "Variant A",
          subject:
            "The dental practice growth stack for {{business_name}} (and the math)",
          isActive: true,
          body: `Hi {{owner_name}},

Here's what's inside our platform for a dental practice like {{business_name}}:

✓ AI front desk — responds to every new patient inquiry in under 60 seconds, 24/7 ($297/mo value)
✓ Online booking integration — makes scheduling as easy as the chain dentists ($149/mo value)
✓ Automated appointment reminders — 48hr/24hr/2hr reduces no-shows below 6% ($197/mo value)
✓ Cosmetic follow-up sequences — recaptures revenue from whitening, veneers, and Invisalign consults ($147/mo value)
✓ Reputation management — automated review requests after every visit ($97/mo value)
✓ SEO visibility tracker — your ranking vs. chains and competitors in {{city}} ($129/mo value)
✓ Patient reactivation flow — reactivates patients 18+ months inactive ($127/mo value)
✓ Weekly performance report ($49/mo value)

Combined value: $1,192+/month.

Three numbers that matter for {{business_name}}:
• No-show recovery from 18% to 5% on 100 weekly appointments × $175 = $2,275/week recovered
• Cosmetic follow-up sequence on 20 monthly consults × 40% conversion × $1,800 avg = $14,400/month captured
• New patient conversion improvement from after-hours response: 3x current rate

See both demos back to back:

→ /services-demo?niche=dental&businessName={{business_name}}&source=cold_email_touch_3

Free scorecard: → {{audit_link}}

Dr. Patel`,
        },
        {
          id: "dent-t3-b",
          label: "Variant B",
          subject:
            "The 3 revenue gaps most dental practices never fix in {{city}}",
          isActive: false,
          body: `Hi {{owner_name}},

Three revenue gaps the average dental practice in {{city}} never systematically closes:

1. No-show revenue: 80 appointments/week × 15% no-show × $175 = $2,100/week lost
2. After-hours new patient inquiries: 40–60% of new patient inquiries come in outside business hours with no response system = 3x conversion loss
3. Cosmetic consult follow-up: 68% of consults would convert with a systematic follow-up sequence — most practices send no follow-up at all

The platform closes all three: automated reminders, 24/7 AI front desk, and a post-consult cosmetic education sequence.

See both demos back to back:
→ /services-demo?niche=dental&businessName={{business_name}}&source=cold_email_touch_3

Or your free scorecard first: → {{audit_link}}

Dr. Patel`,
        },
      ],
    },
    {
      id: "dent-t4",
      touchNumber: 4,
      dayOffset: 14,
      framework: "Abraham + Halbert",
      frameworkRationale:
        "Abraham: strategy of preeminence — frame as a trusted advisor who sees the full competitive picture of the dental market, not another marketing vendor pitching the same tired ideas. Halbert: social proof at touch 4 is more persuasive than any feature list for practice owners who've been sold to dozens of times.",
      primaryCtaLabel: "See Both Demos Back to Back",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{demo_link}}",
      ],
      variants: [
        {
          id: "dent-t4-a",
          label: "Variant A",
          subject:
            "How independent {{city}} dental practices are beating the chains",
          isActive: true,
          body: `Hi {{owner_name}},

There's a pattern among the independent dental practices that are growing in markets like {{city}}, even with corporate chains nearby.

They've stopped trying to compete on convenience and started making their actual advantages impossible to miss: 200+ five-star reviews that reflect real clinical outcomes, a website that loads instantly and books appointments in under 60 seconds, and an AI system that responds to new patient inquiries the moment they come in — so patients who find them first actually stay.

The practices losing ground? Clinically excellent. Invisible online. Phone-only booking. After-hours inquiries going unanswered. New patients defaulting to the chain because it was easier to find and book.

I'm not here to sell another marketing service. I think {{business_name}} should be the obvious choice for patients in {{city}} who want real dental care — and right now, the chains may be winning on systems, not on quality.

Watch both demos together — 6 minutes, no pitch:

→ {{demo_link}}

Dr. Patel`,
        },
        {
          id: "dent-t4-b",
          label: "Variant B",
          subject:
            "3 dental practices that stopped losing to chains (what they changed)",
          isActive: false,
          body: `Hi {{owner_name}},

Three independent dental practices I've worked with this quarter:

• Grew from 47 to 189 Google reviews in 90 days — outranking the Aspen Dental nearby
• No-show rate dropped from 22% to 4% with automated reminders
• Cosmetic follow-up sequences captured $24,000 in the first 60 days from existing patients who'd had consults but no follow-up

None of them changed their dentistry. They changed their front-office and digital systems.

Both demos take 6 minutes:

→ {{demo_link}}

Dr. Patel`,
        },
      ],
    },
    {
      id: "dent-t5",
      touchNumber: 5,
      dayOffset: 21,
      framework: "Kennedy Break-up",
      frameworkRationale:
        "Kennedy: zero fluff, direct respect for their time. The break-up email generates the highest reply rates by forcing a decision without pressure. Honest, professional close that positions the free audit as a standalone value tool — not a sales funnel entry point.",
      primaryCtaLabel: "Last Chance: Get Your Free Practice Scorecard",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{business_name}}",
        "{{city}}",
        "{{owner_name}}",
        "{{audit_link}}",
      ],
      variants: [
        {
          id: "dent-t5-a",
          label: "Variant A",
          subject: "Closing the loop on {{business_name}}",
          isActive: true,
          body: `Hi {{owner_name}},

I've sent four notes over the past three weeks. No response — and that tells me one of three things:

1. Your schedule is full and these aren't pressing problems right now (the ideal situation)
2. New patient growth and no-show reduction aren't priorities at this stage
3. You've already solved the visibility, booking, and follow-up gaps

All valid. I'm not here to pressure anyone.

If {{business_name}} is still losing new patients in {{city}} to chain dental practices, or if no-shows and uncaptured cosmetic revenue are still bleeding the practice, the free scorecard is still open. 60 seconds, shows exactly where you stand — no sales call required.

→ {{audit_link}}

If not, I'll stop reaching out. I wish you a full schedule and a thriving independent practice.

Dr. Patel
Booked Ranked Fundable

P.S. The math is simple: if the scorecard identifies one fix that recovers 3 no-shows per week at $175 each, it's paid for itself many times over — and that's before the cosmetic revenue.`,
        },
        {
          id: "dent-t5-b",
          label: "Variant B",
          subject: "Last note — then I'm out of your inbox",
          isActive: false,
          body: `Hi {{owner_name}},

This is my final note.

I believe {{business_name}} delivers the kind of dental care that patients in {{city}} should be choosing first. I've tried to show you what the systems side of making that obvious looks like a few times now.

If timing isn't right, just reply and I'll remove you immediately.

If you're still thinking about new patient acquisition, no-show rates, or uncaptured cosmetic revenue:

→ {{audit_link}}

Either way — I appreciate your time and the work you do.

Dr. Patel`,
        },
      ],
    },
  ],
};

// ─── Niche Average Call Values ────────────────────────────────────────────────

export const NICHE_AVERAGE_CALL_VALUES: Record<string, number> = {
  plumber: 450,
  med_spa: 800,
  hvac: 600,
  roofing: 2500,
  carpet_cleaning: 350,
  restoration: 3500,
  real_estate: 5000,
  mortgage: 3000,
  chiropractor: 250,
  dental: 500,
};

// ─── Premium Outreach Metadata ────────────────────────────────────────────────

export const PREMIUM_OUTREACH_METADATA = {
  name: "Premium Outreach — 9 Email",
  description:
    "9-email cross-niche outreach sequence combining Brunson, Deiss, and Hormozi frameworks. Pain-point driven, guides to live demo and 7-day free trial.",
  frameworks: ["Russell Brunson", "Ryan Deiss", "Alex Hormozi"] as string[],
  totalEmails: 9,
  totalDays: 18,
  replaces: "cold-outreach-5-touch",
};

// ─── Premium Outreach Sequence — 9 Emails ────────────────────────────────────

export const PREMIUM_OUTREACH_SEQUENCE: ColdEmailSequence = {
  id: "premium-outreach-9-email",
  niche: "all",
  name: "Premium Outreach — 9 Email",
  description:
    "Cross-niche 9-touch sequence combining Russell Brunson, Ryan Deiss, and Alex Hormozi frameworks. Pain → solution → proof → demo → trial.",
  pain: "Missed calls, poor web presence, no reputation system, invisible online",
  angle:
    "AI receptionist + niche website + reputation engine = revenue recovery — free 7-day trial as the offer",
  status: "active",
  provider: "listmonk",
  throttlePerDay: 50,
  createdAt: "2026-04-24T00:00:00Z",
  updatedAt: "2026-04-24T00:00:00Z",
  stopTriggers: ["reply", "unsubscribe", "audit_completed"],
  touches: [
    {
      id: "premium-t1",
      touchNumber: 1,
      dayOffset: 0,
      framework: "Hormozi + Deiss",
      frameworkRationale:
        "Hormozi pain brutality opens with brutal specificity on dollar cost. Deiss Before/After bridge sets up the transformation arc. Day 0 fires immediately — the audit reveal gets attention because it shows real homework was done.",
      primaryCtaLabel: "See Your Live Demo",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Set Up Your Free Demo",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{businessName}}",
        "{{ownerName}}",
        "{{niche}}",
        "{{city}}",
        "{{auditFinding1}}",
        "{{auditFinding2}}",
        "{{estimatedCallValue}}",
        "{{demoLink}}",
        "{{setupLink}}",
      ],
      variants: [
        {
          id: "premium-t1-a",
          label: "Variant A",
          subject:
            "I ran a free audit on {{businessName}}. Here's what I found.",
          isActive: true,
          body: `Hi {{ownerName}},

I spent some time looking at {{businessName}}'s online presence today and found three specific gaps that are likely costing you booked jobs every week.

Here's what I found:

1. {{auditFinding1}} — this is the #1 conversion killer we see for {{niche}} businesses in competitive markets
2. No visible 24/7 response path — when someone needs {{niche}} services at 11pm, the first business to respond wins the job
3. Your review velocity has slowed — competitors with stronger ratings are ranking above you in {{city}}

What that costs you in real money:
The average missed call to a {{niche}} business is worth {{estimatedCallValue}} in revenue. If you're missing 4–6 calls per week, that's {{estimatedCallValue}} x 5 = roughly {{estimatedCallValue}} per week walking out the door.

Here's what BRF fixes:
→ AI receptionist that answers every call in under 2 seconds, 24/7, in your business name
→ Done-for-you niche website, mobile-optimized and ranking-ready
→ Automated reputation engine that builds reviews post-job

Two ways to see it:

See your live demo (your business name already loaded): {{demoLink}}

Or set it up yourself in 60 seconds: {{setupLink}}

No sales call. No credit card.

Best,
David
Booked Ranked Fundable`,
        },
        {
          id: "premium-t1-b",
          label: "Variant B",
          subject:
            "{{ownerName}}, your {{niche}} business has 3 critical gaps (I checked)",
          isActive: false,
          body: `Hi {{ownerName}},

Quick question: when someone in {{city}} searches for a {{niche}} business at 9pm tonight, does {{businessName}} show up — and do they have an easy way to book immediately?

If not, those customers are going to whoever does.

I looked at {{businessName}} today. I found {{auditFinding1}} and {{auditFinding2}}. Both are costing you jobs to competitors who fixed these exact things.

The math is simple: at {{estimatedCallValue}} per job, losing 5 calls a week = {{estimatedCallValue}} x 5 per week in revenue to competitors.

BRF puts an AI receptionist on your phone line, builds your niche website, and runs your reputation system — all done for you.

See the live demo: {{demoLink}}
Set it up yourself in 60 seconds: {{setupLink}}

David
Booked Ranked Fundable`,
        },
      ],
    },
    {
      id: "premium-t2",
      touchNumber: 2,
      dayOffset: 2,
      framework: "Deiss Before/After/Bridge",
      frameworkRationale:
        "Deiss Before/After/Bridge: paint the painful before state with their own business name, bridge to the transformation. The personalized website reveal is the visual hook — the before/after screenshot in the demo drives opens.",
      primaryCtaLabel: "See the Before/After Demo",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Set Up Your Free Demo",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{businessName}}",
        "{{ownerName}}",
        "{{niche}}",
        "{{city}}",
        "{{demoLink}}",
        "{{setupLink}}",
      ],
      variants: [
        {
          id: "premium-t2-a",
          label: "Variant A",
          subject: "{{businessName}} — your new website is ready",
          isActive: true,
          body: `Hi {{ownerName}},

BEFORE: {{businessName}} — outdated web presence, hard to find on mobile, no visible booking path, invisible in local {{city}} search.

AFTER: {{businessName}} — mobile-optimized niche website, AI chat widget in the corner, booking flow that works at midnight, ranked for your top service terms in {{city}}.

The bridge between those two states is shorter than you think.

We built a live demo with a version of your business's website — the after state. You can see the before/after screenshot right in the demo, and you can interact with the AI chat widget to see exactly what your customers would experience.

It takes 3 minutes to watch. No setup required on your end.

See the before/after for {{businessName}}: {{demoLink}}

Or build your personalized trial in 60 seconds: {{setupLink}}

David
Booked Ranked Fundable`,
        },
        {
          id: "premium-t2-b",
          label: "Variant B",
          subject:
            "We rebuilt {{businessName}}'s online presence. Want to see it?",
          isActive: false,
          body: `Hi {{ownerName}},

We built a demo version of what {{businessName}} could look like online.

Mobile-optimized. AI chat in the corner. Booking flow that works 24/7. Local {{city}} SEO baked in.

The contrast with where most {{niche}} businesses are right now is stark. You can see both in the demo — what it is vs. what it could be.

See it here: {{demoLink}}

Or set up your own version in 60 seconds: {{setupLink}}

David`,
        },
      ],
    },
    {
      id: "premium-t3",
      touchNumber: 3,
      dayOffset: 4,
      framework: "Hormozi ROI Math",
      frameworkRationale:
        "Hormozi ROI math: the missed call math makes inaction undeniable. Specific numbers, a simple table, one clear CTA. By day 4 the prospect is solution-aware — show them exactly what it's costing them.",
      primaryCtaLabel: "Hear the AI Answer a Call",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Set Up Your Free Demo",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{businessName}}",
        "{{ownerName}}",
        "{{niche}}",
        "{{estimatedCallValue}}",
        "{{demoLink}}",
        "{{setupLink}}",
      ],
      variants: [
        {
          id: "premium-t3-a",
          label: "Variant A",
          subject:
            "Every missed call costs {{businessName}} {{estimatedCallValue}}. Here's proof.",
          isActive: true,
          body: `Hi {{ownerName}},

The math on missed calls for a {{niche}} business:

| | Without BRF | With BRF |
|---|---|---|
| Missed calls/week | 5–8 | 0 |
| Revenue lost/week | {{estimatedCallValue}} x 6 | $0 |
| Annual revenue leak | ~{{estimatedCallValue}} x 6 x 52 | $0 |
| Response time | Minutes to hours | Under 2 seconds |
| After-hours booking | Voicemail | AI books it |

The AI receptionist answers every call in your business name, books the appointment, and follows up on missed calls automatically.

You can hear it handle a real inbound call in the demo — right now, no setup needed.

Hear your AI receptionist: {{demoLink}}

Or build your version in 60 seconds: {{setupLink}}

David
Booked Ranked Fundable`,
        },
        {
          id: "premium-t3-b",
          label: "Variant B",
          subject:
            "{{ownerName}}, you're losing {{estimatedCallValue}} per missed call. This fixes it.",
          isActive: false,
          body: `Hi {{ownerName}},

In {{niche}}, the average job value is {{estimatedCallValue}}.

If you're missing 5 calls a week — which is the industry average for businesses without AI — that's {{estimatedCallValue}} x 5 per week, every week. {{estimatedCallValue}} x 5 x 52 = over {{estimatedCallValue}} in annual revenue going to whoever answered first.

The BRF AI receptionist answers every call in under 2 seconds, in your business name, 24/7. It books appointments, answers FAQs, and follows up on missed calls automatically.

Hear it handle a real call: {{demoLink}}

Set up your free version: {{setupLink}}

David`,
        },
      ],
    },
    {
      id: "premium-t4",
      touchNumber: 4,
      dayOffset: 6,
      framework: "Brunson Epiphany Bridge",
      frameworkRationale:
        "Brunson Epiphany Bridge / Hook-Story-Offer: a short story of a same-niche business owner who hit the turning point. The story creates identification and makes the solution feel discovered, not sold.",
      primaryCtaLabel: "Start Your Story Here",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Set Up Your Free Demo",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{businessName}}",
        "{{ownerName}}",
        "{{niche}}",
        "{{city}}",
        "{{demoLink}}",
        "{{setupLink}}",
      ],
      variants: [
        {
          id: "premium-t4-a",
          label: "Variant A",
          subject:
            "A {{niche}} owner was losing 12 leads a week. Then this happened.",
          isActive: true,
          body: `Hi {{ownerName}},

A {{niche}} owner in a market like {{city}} was doing everything right — good work, solid reputation, 4.3 stars.

But every week, 12 potential customers called his phone after hours, got voicemail, and booked with a competitor.

He thought it was a pricing problem. It wasn't.

It was a response problem. His phone went to voicemail. His competitor's didn't.

The moment he realized it wasn't about being better — it was about being first — everything changed.

He added the BRF AI receptionist. It answered every call in 2 seconds, in his business name. Booked appointments at 11pm. Followed up on missed calls with a text in 30 seconds.

Within 60 days, his inbound conversion rate went from 31% to 68%.

"Your story doesn't have to look like the before. It can look like the after."

Start your story here: {{demoLink}}

Or build your personalized free trial: {{setupLink}}

David
Booked Ranked Fundable`,
        },
        {
          id: "premium-t4-b",
          label: "Variant B",
          subject:
            "The moment {{niche}} businesses stop bleeding leads (real story)",
          isActive: false,
          body: `Hi {{ownerName}},

There's a specific moment when a {{niche}} business owner stops losing leads and starts winning them.

It's not when they get better at their craft. It's when they stop relying on a phone that rings to voicemail and start running a system that never sleeps.

I've watched this happen in dozens of local markets. The businesses that make the switch look back and can't believe what they were leaving on the table.

See what the switch looks like for a business like {{businessName}}: {{demoLink}}

Build your free version: {{setupLink}}

David`,
        },
      ],
    },
    {
      id: "premium-t5",
      touchNumber: 5,
      dayOffset: 8,
      framework: "Deiss + Brunson Demo Reveal",
      frameworkRationale:
        "Deiss transformation + Brunson demo reveal: the voice agent is the most visceral demo in the platform — actually hearing it say your business name in a live call creates instant belief. Direct reveal, no buildup needed.",
      primaryCtaLabel: "Hear Your AI Receptionist Now",
      primaryCtaType: "ai-demo",
      secondaryCtaLabel: "Set Up Your Free Demo",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{businessName}}",
        "{{ownerName}}",
        "{{niche}}",
        "{{demoLink}}",
        "{{setupLink}}",
      ],
      variants: [
        {
          id: "premium-t5-a",
          label: "Variant A",
          subject:
            "{{businessName}}, your AI receptionist is ready. Hear it now.",
          isActive: true,
          body: `Hi {{ownerName}},

We built an AI receptionist for {{businessName}}.

It answers in your business name. It handles FAQs specific to {{niche}}. It books appointments. It follows up on missed calls automatically — without you touching a thing.

You can hear it greet a caller as "{{businessName}}" right now, in the demo. No setup. Just click and listen.

What it says when a customer calls:

"Thank you for calling {{businessName}}. How can I help you today?"

Then it handles the rest.

Hear it: {{demoLink}}

Build your full personalized version: {{setupLink}}

David
Booked Ranked Fundable`,
        },
        {
          id: "premium-t5-b",
          label: "Variant B",
          subject:
            "We built an AI that answers your calls 24/7. It uses your business name.",
          isActive: false,
          body: `Hi {{ownerName}},

Your AI receptionist is configured. It answers as "{{businessName}}." It knows your niche. It books appointments, handles FAQs, and follows up on missed calls.

The only thing it needs is your approval.

Hear it right now — no login, no setup: {{demoLink}}

Or build your personalized free trial in 60 seconds: {{setupLink}}

David`,
        },
      ],
    },
    {
      id: "premium-t6",
      touchNumber: 6,
      dayOffset: 10,
      framework: "Hormozi Social Proof + Deiss Customer Value Journey",
      frameworkRationale:
        "Hormozi social proof + Deiss customer value journey: competitive specificity (your city, your niche, your competitors) creates urgency without pressure. By touch 6, prospects need external evidence, not more features.",
      primaryCtaLabel: "See Your Ranking Potential",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Set Up Your Free Demo",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{businessName}}",
        "{{ownerName}}",
        "{{niche}}",
        "{{city}}",
        "{{demoLink}}",
        "{{setupLink}}",
      ],
      variants: [
        {
          id: "premium-t6-a",
          label: "Variant A",
          subject:
            "{{city}} {{niche}} businesses are ranking. {{businessName}} isn't. Yet.",
          isActive: true,
          body: `Hi {{ownerName}},

A few things happening in {{city}} right now that affect {{businessName}}:

Your competitors are gaining ground:
→ The top-ranked {{niche}} businesses in {{city}} averaged 47 new Google reviews last month
→ They're using automated review request systems — every completed job triggers a review request automatically
→ Their review velocity compounds over time: more reviews → higher ranking → more calls → more reviews

Meanwhile, manual review requests get forgotten. Jobs finish. No follow-up. No review.

The BRF reputation engine automates the entire loop: job completed → review request fires → new reviews land → rankings improve.

Combined with the AI receptionist and niche website, this is how {{niche}} businesses in {{city}} become the obvious choice in search.

See your ranking potential: {{demoLink}}

Build your personalized free trial: {{setupLink}}

David
Booked Ranked Fundable`,
        },
        {
          id: "premium-t6-b",
          label: "Variant B",
          subject:
            "Your competitors got 47 new reviews last month. Here's how.",
          isActive: false,
          body: `Hi {{ownerName}},

In your market, the {{niche}} businesses collecting the most reviews aren't asking for them manually. They have a system.

Job completed → automatic text to the customer → one tap → Google review. Every time. Without anyone on your team doing a thing.

47 reviews in a month is achievable in 90 days with the right automation. We've seen it across every niche we work with.

The BRF reputation engine is built in to your free trial.

See how it works: {{demoLink}}
Start your free trial: {{setupLink}}

David`,
        },
      ],
    },
    {
      id: "premium-t7",
      touchNumber: 7,
      dayOffset: 12,
      framework: "Hormozi Irresistible Offer + Brunson Value Stack",
      frameworkRationale:
        "Hormozi irresistible offer + Brunson value stack: stack everything included in the trial and assign dollar values. Make the free trial feel like the obvious yes. Zero risk framing removes the last objection.",
      primaryCtaLabel: "Activate Your Free Trial Now",
      primaryCtaType: "unified-demo",
      secondaryCtaLabel: "Set Up in 60 Seconds",
      secondaryCtaType: "audit",
      personalizationTokens: [
        "{{businessName}}",
        "{{ownerName}}",
        "{{brandKitTrialLink}}",
        "{{setupLink}}",
      ],
      variants: [
        {
          id: "premium-t7-a",
          label: "Variant A",
          subject:
            "{{businessName}}'s brand kit is live. 7 days free. No card needed.",
          isActive: true,
          body: `Hi {{ownerName}},

Here's everything included in {{businessName}}'s 7-day free trial:

✓ AI receptionist configured with your business name ($297/mo value)
✓ Niche website — live, mobile-optimized, ranking-ready ($197/mo value)
✓ CRM with leads from your local market preloaded ($149/mo value)
✓ Reputation system — automated review requests after every job ($79/mo value)
✓ SEO and rankings audit with competitor benchmarks ($129/mo value)
✓ Business credit builder — 90-day fundability simulation ($97/mo value)
✓ Social media calendar, 30 days of niche posts ($69/mo value)

Total value: $1,017/month.
Cost for your 7-day trial: $0.
No credit card. No setup fees. No commitment.

The 7-day trial clock starts on your first real action — when you test the voice agent, view your website, or open the CRM. Not when you sign up.

Activate your free trial now: {{brandKitTrialLink}}

Or build it from scratch in 60 seconds: {{setupLink}}

David
Booked Ranked Fundable`,
        },
        {
          id: "premium-t7-b",
          label: "Variant B",
          subject:
            "{{ownerName}}, your personalized trial is waiting (expires in 7 days)",
          isActive: false,
          body: `Hi {{ownerName}},

Your 7-day free trial is ready. Everything is already configured for {{businessName}}:

AI receptionist → live
Niche website → built
CRM with leads → loaded
Reputation system → active
Rankings audit → ready

Nothing to set up. Nothing to install. Just click and it's there.

Zero risk. No card. 7 days to explore everything.

Activate here: {{brandKitTrialLink}}

Build your own version: {{setupLink}}

David`,
        },
      ],
    },
    {
      id: "premium-t8",
      touchNumber: 8,
      dayOffset: 15,
      framework: "Hormozi Direct + Brunson Curiosity Hook",
      frameworkRationale:
        "Hormozi direct + Brunson curiosity hook: short and human. 3–4 lines max. After 7 emails, a sudden simplicity break gets read. Pattern interrupt — the email that looks least like a marketing email gets the most replies.",
      primaryCtaLabel: "See What We Built for You",
      primaryCtaType: "unified-demo",
      personalizationTokens: [
        "{{ownerName}}",
        "{{businessName}}",
        "{{demoLink}}",
        "{{setupLink}}",
      ],
      variants: [
        {
          id: "premium-t8-a",
          label: "Variant A",
          subject: "Still losing calls to voicemail?",
          isActive: true,
          body: `Hi {{ownerName}},

I know you're busy. I know you've seen sales emails before.

But I also know that every time {{businessName}}'s phone goes to voicemail, someone else answers theirs.

One click to see what we built for you: {{demoLink}}

David`,
        },
        {
          id: "premium-t8-b",
          label: "Variant B",
          subject: "Quick question, {{ownerName}}",
          isActive: false,
          body: `{{ownerName}} —

Real question: is the missed call problem at {{businessName}} still happening?

If yes, this is a 60-second fix: {{setupLink}}

David`,
        },
      ],
    },
    {
      id: "premium-t9",
      touchNumber: 9,
      dayOffset: 18,
      framework: "Brunson Scarcity/Urgency + Hormozi What-You-Lose Framing",
      frameworkRationale:
        "Brunson scarcity/urgency + Hormozi what-you-lose framing: explicit yes/no contrast. Loss framing is more persuasive than gain framing at this stage. The break-up email forces a decision. Clear, honest, no pressure — just the choice laid bare.",
      primaryCtaLabel: "Set Up Your Free Trial Before It Closes",
      primaryCtaType: "audit",
      personalizationTokens: [
        "{{businessName}}",
        "{{ownerName}}",
        "{{closeDate}}",
        "{{setupLink}}",
        "{{demoLink}}",
      ],
      variants: [
        {
          id: "premium-t9-a",
          label: "Variant A",
          subject: "Last call, {{ownerName}}. This closes {{closeDate}}.",
          isActive: true,
          body: `Hi {{ownerName}},

If you say yes:
→ AI receptionist live for {{businessName}} by tomorrow
→ Niche website ranking within 30 days
→ CRM with leads from day 1
→ 7-day free trial, no card required

If you say no:
→ Your phone keeps going to voicemail
→ Your competitors keep collecting reviews
→ Your website sits invisible in {{city}} search
→ Customers who needed your service go somewhere else

This isn't a pressure tactic. It's a choice that's yours to make.

Your trial access closes {{closeDate}}.

Last chance to set it up: {{setupLink}}

Or watch the 3-minute demo one more time: {{demoLink}}

David
Booked Ranked Fundable

P.S. If the timing is genuinely wrong, just reply "not now" and I'll reach out in 90 days. No hard feelings.`,
        },
        {
          id: "premium-t9-b",
          label: "Variant B",
          subject:
            "{{businessName}} — final notice on your 7-day free trial access",
          isActive: false,
          body: `Hi {{ownerName}},

This is my last email.

Your 7-day free trial for {{businessName}} closes {{closeDate}}.

What you're leaving on the table if you don't activate:
• AI receptionist that answers every missed call
• Niche website live and ranking
• CRM with local leads preloaded
• Reputation system running automatically

All of it free for 7 days, no card, no commitment.

Final link: {{setupLink}}

David`,
        },
      ],
    },
  ],
};

// ─── All Cold Sequences — now contains only the Premium Outreach sequence ─────
// (Legacy 5-touch sequences are preserved above as named exports but replaced
// in COLD_EMAIL_SEQUENCES per product requirement)

export const COLD_EMAIL_SEQUENCES: ColdEmailSequence[] = [
  PREMIUM_OUTREACH_SEQUENCE,
];

// ─── Mock Enrollments ─────────────────────────────────────────────────────────

export const MOCK_ENROLLMENTS: SequenceEnrollment[] = [
  // Plumber enrollments
  {
    id: "enr-plumb-1",
    sequenceId: "plumbing-cold-sequence",
    leadId: "lead-p1",
    leadName: "Carlos Rivera",
    businessName: "Rivera Plumbing Co.",
    city: "San Diego, CA",
    niche: "plumbing",
    email: "carlos@riveraplumbing.com",
    status: "active",
    currentTouchIndex: 2,
    enrolledAt: "2026-04-01T09:00:00Z",
    nextSendAt: "2026-04-19T10:00:00Z",
    events: [
      { id: "ev1", type: "enrolled", timestamp: "2026-04-01T09:00:00Z" },
      {
        id: "ev2",
        type: "sent",
        touchNumber: 1,
        timestamp: "2026-04-01T10:00:00Z",
      },
      {
        id: "ev3",
        type: "opened",
        touchNumber: 1,
        timestamp: "2026-04-01T14:32:00Z",
      },
      {
        id: "ev4",
        type: "clicked",
        touchNumber: 1,
        timestamp: "2026-04-01T14:35:00Z",
        metadata: { link: "audit" },
      },
      {
        id: "ev5",
        type: "sent",
        touchNumber: 2,
        timestamp: "2026-04-04T10:00:00Z",
      },
      {
        id: "ev6",
        type: "opened",
        touchNumber: 2,
        timestamp: "2026-04-04T18:11:00Z",
      },
      {
        id: "ev7",
        type: "sent",
        touchNumber: 3,
        timestamp: "2026-04-08T10:00:00Z",
      },
    ],
  },
  {
    id: "enr-plumb-2",
    sequenceId: "plumbing-cold-sequence",
    leadId: "lead-p2",
    leadName: "Mike Thompson",
    businessName: "North County Pipes",
    city: "Oceanside, CA",
    niche: "plumbing",
    email: "mike@ncpipes.com",
    status: "converted",
    currentTouchIndex: 1,
    enrolledAt: "2026-03-15T09:00:00Z",
    events: [
      { id: "ev8", type: "enrolled", timestamp: "2026-03-15T09:00:00Z" },
      {
        id: "ev9",
        type: "sent",
        touchNumber: 1,
        timestamp: "2026-03-15T10:00:00Z",
      },
      {
        id: "ev10",
        type: "opened",
        touchNumber: 1,
        timestamp: "2026-03-15T11:45:00Z",
      },
      {
        id: "ev11",
        type: "audit_completed",
        timestamp: "2026-03-15T12:02:00Z",
        metadata: { auditScore: "62" },
      },
      {
        id: "ev12",
        type: "replied",
        touchNumber: 1,
        timestamp: "2026-03-15T13:30:00Z",
      },
      {
        id: "ev13",
        type: "stopped",
        timestamp: "2026-03-15T13:31:00Z",
        metadata: { reason: "converted" },
      },
    ],
  },
  {
    id: "enr-plumb-3",
    sequenceId: "plumbing-cold-sequence",
    leadId: "lead-p3",
    leadName: "David Chen",
    businessName: "Precision Plumbing",
    city: "Anaheim, CA",
    niche: "plumbing",
    email: "david@precisionplumb.com",
    status: "paused",
    currentTouchIndex: 3,
    enrolledAt: "2026-03-20T09:00:00Z",
    nextSendAt: "2026-04-25T10:00:00Z",
    events: [
      { id: "ev14", type: "enrolled", timestamp: "2026-03-20T09:00:00Z" },
      {
        id: "ev15",
        type: "sent",
        touchNumber: 1,
        timestamp: "2026-03-20T10:00:00Z",
      },
      {
        id: "ev16",
        type: "opened",
        touchNumber: 1,
        timestamp: "2026-03-21T09:12:00Z",
      },
      {
        id: "ev17",
        type: "sent",
        touchNumber: 2,
        timestamp: "2026-03-23T10:00:00Z",
      },
      {
        id: "ev18",
        type: "sent",
        touchNumber: 3,
        timestamp: "2026-03-27T10:00:00Z",
      },
      {
        id: "ev19",
        type: "paused",
        timestamp: "2026-04-02T10:00:00Z",
        metadata: { reason: "manual" },
      },
    ],
  },
  {
    id: "enr-plumb-4",
    sequenceId: "plumbing-cold-sequence",
    leadId: "lead-p4",
    leadName: "Jason Wells",
    businessName: "Wells & Sons Plumbing",
    city: "Long Beach, CA",
    niche: "plumbing",
    email: "jason@wellsplumbing.com",
    status: "stopped",
    stopReason: "unsubscribe",
    currentTouchIndex: 2,
    enrolledAt: "2026-03-10T09:00:00Z",
    events: [
      { id: "ev20", type: "enrolled", timestamp: "2026-03-10T09:00:00Z" },
      {
        id: "ev21",
        type: "sent",
        touchNumber: 1,
        timestamp: "2026-03-10T10:00:00Z",
      },
      {
        id: "ev22",
        type: "sent",
        touchNumber: 2,
        timestamp: "2026-03-13T10:00:00Z",
      },
      { id: "ev23", type: "unsubscribed", timestamp: "2026-03-14T08:44:00Z" },
      {
        id: "ev24",
        type: "stopped",
        timestamp: "2026-03-14T08:44:00Z",
        metadata: { reason: "unsubscribe" },
      },
    ],
  },
  // Med Spa enrollments
  {
    id: "enr-medspa-1",
    sequenceId: "medspa-cold-sequence",
    leadId: "lead-ms1",
    leadName: "Jennifer Tran",
    businessName: "Glow Med Spa",
    city: "La Jolla, CA",
    niche: "medspa",
    email: "jennifer@glowmedspa.com",
    status: "active",
    currentTouchIndex: 3,
    enrolledAt: "2026-03-28T09:00:00Z",
    nextSendAt: "2026-04-20T10:00:00Z",
    events: [
      { id: "ev25", type: "enrolled", timestamp: "2026-03-28T09:00:00Z" },
      {
        id: "ev26",
        type: "sent",
        touchNumber: 1,
        timestamp: "2026-03-28T10:00:00Z",
      },
      {
        id: "ev27",
        type: "opened",
        touchNumber: 1,
        timestamp: "2026-03-28T19:44:00Z",
      },
      {
        id: "ev28",
        type: "clicked",
        touchNumber: 1,
        timestamp: "2026-03-28T19:47:00Z",
        metadata: { link: "audit" },
      },
      {
        id: "ev29",
        type: "sent",
        touchNumber: 2,
        timestamp: "2026-03-31T10:00:00Z",
      },
      {
        id: "ev30",
        type: "opened",
        touchNumber: 2,
        timestamp: "2026-03-31T21:02:00Z",
      },
      {
        id: "ev31",
        type: "clicked",
        touchNumber: 2,
        timestamp: "2026-03-31T21:05:00Z",
        metadata: { link: "ai-demo" },
      },
      {
        id: "ev32",
        type: "sent",
        touchNumber: 3,
        timestamp: "2026-04-04T10:00:00Z",
      },
    ],
  },
  {
    id: "enr-medspa-2",
    sequenceId: "medspa-cold-sequence",
    leadId: "lead-ms2",
    leadName: "Ashley Moore",
    businessName: "Luxe Aesthetics Studio",
    city: "Beverly Hills, CA",
    niche: "medspa",
    email: "ashley@luxeaesthetics.com",
    status: "completed",
    currentTouchIndex: 5,
    enrolledAt: "2026-03-01T09:00:00Z",
    events: [
      { id: "ev33", type: "enrolled", timestamp: "2026-03-01T09:00:00Z" },
      {
        id: "ev34",
        type: "sent",
        touchNumber: 1,
        timestamp: "2026-03-01T10:00:00Z",
      },
      {
        id: "ev35",
        type: "opened",
        touchNumber: 1,
        timestamp: "2026-03-02T08:30:00Z",
      },
      {
        id: "ev36",
        type: "sent",
        touchNumber: 2,
        timestamp: "2026-03-04T10:00:00Z",
      },
      {
        id: "ev37",
        type: "sent",
        touchNumber: 3,
        timestamp: "2026-03-08T10:00:00Z",
      },
      {
        id: "ev38",
        type: "opened",
        touchNumber: 3,
        timestamp: "2026-03-09T11:22:00Z",
      },
      {
        id: "ev39",
        type: "sent",
        touchNumber: 4,
        timestamp: "2026-03-13T10:00:00Z",
      },
      {
        id: "ev40",
        type: "sent",
        touchNumber: 5,
        timestamp: "2026-03-19T10:00:00Z",
      },
      {
        id: "ev41",
        type: "opened",
        touchNumber: 5,
        timestamp: "2026-03-20T07:15:00Z",
      },
    ],
  },
  {
    id: "enr-medspa-3",
    sequenceId: "medspa-cold-sequence",
    leadId: "lead-ms3",
    leadName: "Rachel Kim",
    businessName: "Serenity Aesthetics & Wellness",
    city: "Scottsdale, AZ",
    niche: "medspa",
    email: "rachel@serenityaesthetics.com",
    status: "active",
    currentTouchIndex: 1,
    enrolledAt: "2026-04-10T09:00:00Z",
    nextSendAt: "2026-04-21T10:00:00Z",
    events: [
      { id: "ev42", type: "enrolled", timestamp: "2026-04-10T09:00:00Z" },
      {
        id: "ev43",
        type: "sent",
        touchNumber: 1,
        timestamp: "2026-04-10T10:00:00Z",
      },
      {
        id: "ev44",
        type: "opened",
        touchNumber: 1,
        timestamp: "2026-04-10T16:38:00Z",
      },
    ],
  },
  {
    id: "enr-medspa-4",
    sequenceId: "medspa-cold-sequence",
    leadId: "lead-ms4",
    leadName: "Nicole Torres",
    businessName: "Radiance Med Spa",
    city: "Boca Raton, FL",
    niche: "medspa",
    email: "nicole@radiancemedspa.com",
    status: "stopped",
    stopReason: "bounce",
    currentTouchIndex: 0,
    enrolledAt: "2026-04-05T09:00:00Z",
    events: [
      { id: "ev45", type: "enrolled", timestamp: "2026-04-05T09:00:00Z" },
      {
        id: "ev46",
        type: "sent",
        touchNumber: 1,
        timestamp: "2026-04-05T10:00:00Z",
      },
      {
        id: "ev47",
        type: "bounced",
        touchNumber: 1,
        timestamp: "2026-04-05T10:02:00Z",
      },
      {
        id: "ev48",
        type: "stopped",
        timestamp: "2026-04-05T10:02:00Z",
        metadata: { reason: "bounce" },
      },
    ],
  },
];

// ─── Sequence Performance Data ────────────────────────────────────────────────

export const SEQUENCE_PERFORMANCE: SequencePerformance[] = [
  {
    sequenceId: "plumbing-cold-sequence",
    niche: "plumbing",
    totalEnrolled: 148,
    totalSent: 612,
    openRate: 33,
    clickRate: 12,
    auditCompletionRate: 21,
    demoVisitRate: 16,
    replyRate: 7,
    conversionRate: 4,
    bestPerformingTouchId: "plumb-t5",
    touchPerformance: [
      {
        touchId: "plumb-t1",
        touchNumber: 1,
        framework: "Ogilvy + Hopkins",
        sent: 148,
        openRate: 38,
        clickRate: 14,
        replyRate: 3,
        isHighlighted: false,
      },
      {
        touchId: "plumb-t2",
        touchNumber: 2,
        framework: "Suby PASTOR",
        sent: 131,
        openRate: 33,
        clickRate: 13,
        replyRate: 4,
        isHighlighted: false,
      },
      {
        touchId: "plumb-t3",
        touchNumber: 3,
        framework: "Hormozi Value Stack",
        sent: 118,
        openRate: 29,
        clickRate: 11,
        replyRate: 3,
        isHighlighted: false,
      },
      {
        touchId: "plumb-t4",
        touchNumber: 4,
        framework: "Halbert + Abraham",
        sent: 104,
        openRate: 26,
        clickRate: 9,
        replyRate: 5,
        isHighlighted: false,
      },
      {
        touchId: "plumb-t5",
        touchNumber: 5,
        framework: "Kennedy Break-up",
        sent: 91,
        openRate: 31,
        clickRate: 10,
        replyRate: 14,
        isHighlighted: true,
      },
    ],
  },
  {
    sequenceId: "medspa-cold-sequence",
    niche: "medspa",
    totalEnrolled: 112,
    totalSent: 448,
    openRate: 31,
    clickRate: 11,
    auditCompletionRate: 19,
    demoVisitRate: 14,
    replyRate: 6,
    conversionRate: 3,
    bestPerformingTouchId: "medspa-t5",
    touchPerformance: [
      {
        touchId: "medspa-t1",
        touchNumber: 1,
        framework: "Ogilvy + Abraham",
        sent: 112,
        openRate: 36,
        clickRate: 13,
        replyRate: 2,
        isHighlighted: false,
      },
      {
        touchId: "medspa-t2",
        touchNumber: 2,
        framework: "Suby PASTOR",
        sent: 99,
        openRate: 31,
        clickRate: 12,
        replyRate: 3,
        isHighlighted: false,
      },
      {
        touchId: "medspa-t3",
        touchNumber: 3,
        framework: "Hormozi + Schwartz",
        sent: 87,
        openRate: 27,
        clickRate: 10,
        replyRate: 3,
        isHighlighted: false,
      },
      {
        touchId: "medspa-t4",
        touchNumber: 4,
        framework: "Halbert + Sugarman",
        sent: 76,
        openRate: 24,
        clickRate: 8,
        replyRate: 4,
        isHighlighted: false,
      },
      {
        touchId: "medspa-t5",
        touchNumber: 5,
        framework: "Kennedy + Ogilvy",
        sent: 61,
        openRate: 29,
        clickRate: 9,
        replyRate: 12,
        isHighlighted: true,
      },
    ],
  },
];

// ─── Warm Sequence Types ──────────────────────────────────────────────────────

export interface AuditSnapshot {
  seoScore: number;
  reputationScore: number;
  websiteScore: number;
  overallScore: number;
}

export interface WarmTouch {
  touchNumber: number;
  delayHours: number;
  framework: string;
  frameworkRationale: string;
  subject: string;
  bodyTemplate: string;
  ctaType: "booking" | "audit" | "ai-demo" | "back-office-demo";
  ctaLabel: string;
  bookingLinkIncluded: boolean;
}

export interface WarmSequence {
  id: string;
  niche: string;
  name: string;
  description: string;
  touches: WarmTouch[];
  triggerEvents: ("audit_completed" | "demo_visited")[];
  bookingUrl: string;
  /** Warm sequences always send via Caffeine native — recipients are opted-in (audit completers or demo visitors) */
  provider: "caffeine_native";
}

export interface WarmLeadHandoff {
  leadId: string;
  leadName: string;
  businessName: string;
  city: string;
  niche: string;
  coldSequenceId: string;
  warmSequenceId: string;
  handoffTrigger: "audit_completed" | "demo_visited";
  handoffTimestamp: string;
  auditScores: AuditSnapshot | null;
  demoVisited: boolean;
}

export interface WarmSequenceEnrollment {
  id: string;
  leadId: string;
  leadName: string;
  businessName: string;
  niche: string;
  warmSequenceId: string;
  currentTouchIndex: number;
  status: "active" | "paused" | "completed" | "converted" | "stopped";
  enrolledAt: string;
  nextSendAt?: string;
  handoffTrigger: "audit_completed" | "demo_visited";
  auditScores: AuditSnapshot | null;
}

// ─── Plumber Warm Sequence ────────────────────────────────────────────────────

export const PLUMBER_WARM_SEQUENCE: WarmSequence = {
  id: "plumbing-warm-sequence",
  niche: "plumbing",
  name: "Plumber Warm Follow-Up — 3-Touch Booking Conversion",
  description:
    "Post-audit / post-demo warm sequence for plumbers. Highly personalized to their audit scores. Each touch ends with a direct calendar booking link.",
  bookingUrl: "https://cal.com/brf/plumber-strategy",
  triggerEvents: ["audit_completed", "demo_visited"],
  provider: "caffeine_native",
  touches: [
    {
      touchNumber: 1,
      delayHours: 0,
      framework: "Hopkins + Hormozi",
      frameworkRationale:
        "Hopkins: specificity — reference their actual audit scores by name to show you reviewed their specific business, not a template. Hormozi: urgency math — tie each score directly to a dollar amount of lost revenue so the cost of inaction is concrete and immediate.",
      subject:
        "Your [City] Plumbing Business Audit: 3 Things Costing You Jobs Right Now",
      bodyTemplate: `Hi {{owner_name}},

Your free 3-stage audit is in.

Here's what we found for {{business_name}} in {{city}}:

• SEO Score: {{seo_score}}/100 — {{seo_finding}}
• Reputation Score: {{reputation_score}}/100 — {{reputation_finding}}
• Website Score: {{website_score}}/100 — {{website_finding}}

What that means in real numbers:

A plumbing business in a market like {{city}} with scores in this range is typically losing 4–7 booked jobs per week to competitors who've fixed these exact issues. At $400–$600 per job, that's $1,600–$4,200 every week walking out the door.

The fix isn't complicated — it's a systems problem, not a skills problem. Every plumber I work with who's addressed these three things has seen their booked job rate increase within 60 days.

I'd like to spend 15 minutes showing you exactly what that looks like for {{business_name}}.

→ Grab Your Free 15-Min Strategy Call: {{booking_link}}

No pitch. No pressure. Just a clear picture of what's fixable and how fast.

David
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free 15-Min Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 2,
      delayHours: 48,
      framework: "Kennedy Urgency",
      frameworkRationale:
        "Kennedy: zero fluff, direct respect for their time. By touch 2, soft prospects need a harder frame — show them the competitive gap is widening while they wait. Name the competitor dynamic explicitly.",
      subject: "The Fix for [City] Plumbers Losing Calls to Competitors",
      bodyTemplate: `Hi {{owner_name}},

I wanted to follow up on your audit results.

Here's what's happening in {{city}} right now: the plumbers who are winning — the ones filling their books every week — have three things the others don't:

1. An AI front desk that answers every call under 2 seconds, 24/7
2. A reputation system that builds reviews automatically after every job
3. An SEO footprint that puts them at the top when customers search at 11pm

Your audit showed {{audit_summary}}. That's a gap a competitor in your market can and will exploit if it stays open.

Here's the full platform stack — what you'd get on day one:

✓ AI front desk + missed call SMS ($297/mo value)
✓ Automated reputation management ($197/mo value)
✓ CRM + lead pipeline ($149/mo value)
✓ SEO visibility tracker ($129/mo value)
✓ Weekly performance report ($49/mo value)
✓ Inbound voice agent ($247/mo value)

Combined value: $1,068/month.

The math on closing even one additional job per week more than covers it.

I've got a 15-minute call open specifically to walk through what this looks like for {{business_name}} in {{city}}.

→ Grab a spot before it fills: {{booking_link}}

David
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 3,
      delayHours: 120,
      framework: "Halbert + Sugarman",
      frameworkRationale:
        "Halbert: conversational, human tone — this is the last touch, so it needs to feel like a real person, not a sequence. Sugarman: slippery slope close — each sentence makes the next click inevitable, ending with a simple, direct booking link that removes all friction.",
      subject: "Last thing I want to send you about this...",
      bodyTemplate: `Hi {{owner_name}},

This is my last email about this — I don't want to crowd your inbox.

I've sent you the audit results for {{business_name}}. I've shown you the math. I've laid out exactly what the platform does.

Here's the honest version: most plumbers I talk to are leaving real money on the table every week because of fixable problems. Some of them do something about it. Most don't.

I have no idea which one you are.

If you're genuinely too busy, I get it.

If the timing isn't right, I get that too.

But if any part of you is still thinking about those audit scores — the {{seo_score}} SEO, the {{reputation_score}} reputation, the {{website_score}} website — and wondering what fixing them would actually look like in practice, grab 15 minutes here:

→ Grab 15 Minutes Here: {{booking_link}}

That's all I've got.

David
Booked Ranked Fundable

P.S. If you want to be removed from my list, just reply and I'll do it immediately. No hard feelings.`,
      ctaType: "booking",
      ctaLabel: "Grab 15 Minutes Here",
      bookingLinkIncluded: true,
    },
  ],
};

// ─── Med Spa Warm Sequence ────────────────────────────────────────────────────

export const MED_SPA_WARM_SEQUENCE: WarmSequence = {
  id: "medspa-warm-sequence",
  niche: "medspa",
  name: "Med Spa Warm Follow-Up — 3-Touch Booking Conversion",
  description:
    "Post-audit / post-demo warm sequence for med spas. Uses luxury and prestige framing with audit scores to show the gap between current state and fully-booked competitors.",
  bookingUrl: "https://cal.com/brf/medspa-strategy",
  triggerEvents: ["audit_completed", "demo_visited"],
  provider: "caffeine_native",
  touches: [
    {
      touchNumber: 1,
      delayHours: 0,
      framework: "Ogilvy + Hopkins",
      frameworkRationale:
        "Ogilvy: prestige framing — position the platform as the system used by the top med spas in competitive markets, not a generic SaaS tool. Hopkins: specificity — their exact audit scores make the gap between them and competitors viscerally real.",
      subject:
        "Your [City] Med Spa Audit: Why Competitors Are Fully Booked (And You Are Not)",
      bodyTemplate: `Hi {{owner_name}},

Your med spa visibility audit is ready.

Here's what we found for {{business_name}} in {{city}}:

• SEO Score: {{seo_score}}/100
• Reputation Score: {{reputation_score}}/100
• Website Conversion Score: {{website_score}}/100

The med spas in {{city}} that are fully booked 3–4 weeks out? Their average across these three scores is 78, 84, and 81 respectively.

The gap isn't about the quality of your treatments. It's about visibility and trust signals — the things that tell a new client "this is the obvious choice" before they've ever walked through your door.

A med spa scoring in your current range typically converts 1 in 8 online visitors to a booking. Spas with optimized scores convert 1 in 3. At your current traffic, that difference is likely 6–12 additional bookings per month.

I'd like to walk through your specific numbers and show you exactly what the fix looks like for {{business_name}}.

→ Book Your Free 15-Min Strategy Call: {{booking_link}}

No sales pressure. Just your actual numbers and a clear picture of what's possible.

Sarah
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free 15-Min Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 2,
      delayHours: 48,
      framework: "Kennedy + Schwartz",
      frameworkRationale:
        "Kennedy: directness — by touch 2, they need a clear, urgent frame. Schwartz: awareness-level copy — they've seen the audit, so they're solution-aware. Speak to the mechanism (booking consistency, recurring revenue) rather than the problem.",
      subject:
        "The Booking Gap: What Consistently Full Med Spas Do Differently",
      bodyTemplate: `Hi {{owner_name}},

The med spas that stay consistently booked — 85–95% capacity every week — share one pattern:

They've systematized the three things that drive new client trust:

**Response speed.** Every inquiry gets a reply in under 60 seconds. Not within an hour. Under 60 seconds, 24 hours a day. The AI booking agent handles this automatically.

**Review velocity.** They're adding 8–15 new Google reviews every month, consistently. Not from asking clients to leave reviews — from an automated post-appointment flow that makes it effortless.

**Online authority.** They rank in the top 3 for the search terms that matter in their city. Not because they're doing SEO tricks — because their profile is complete, consistent, and active.

{{business_name}}'s audit showed room to improve on all three. That's actually good news — it means there's a clear runway.

Here's what the full platform gives you on day one:

✓ AI booking agent (24/7, under 60-second response) — $397/mo value
✓ Automated review request flows — $197/mo value
✓ Local SEO visibility tracker — $149/mo value
✓ CRM and lead pipeline — $129/mo value
✓ Weekly branded performance report — $79/mo value

The 8–12 additional bookings per month this typically produces at $350+ average service? That's $2,800–$4,200/month in additional revenue.

I'd like to walk through how this maps to {{business_name}} specifically.

→ Grab a 15-Min Call: {{booking_link}}

Sarah`,
      ctaType: "booking",
      ctaLabel: "Grab a 15-Min Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 3,
      delayHours: 120,
      framework: "Suby PASTOR",
      frameworkRationale:
        "Suby PASTOR: full framework for the final touch — Problem, Amplify, Story, Transformation, Offer, Response. The most complete persuasion arc for a last-touch email. Ends with a single, frictionless booking CTA.",
      subject: "Last thing before I close the loop on this...",
      bodyTemplate: `Hi {{owner_name}},

This is my last email on this — I mean that.

I want to leave you with one honest observation before I do.

**P — Problem:** {{business_name}}'s audit showed a combined score that puts you below most of your top competitors in {{city}} on visibility, reputation, and conversion.

**A — Amplify:** Every week that gap stays open, those competitors are capturing clients who would have chosen you if they'd found you first. High-end med spa clients don't shop on price — they shop on trust and visibility.

**S — Story:** I worked with a med spa in a market similar to yours. Her audit scores were nearly identical to {{business_name}}'s. In 90 days, she added 43 new Google reviews, jumped to position 2 for her top search term, and increased her average weekly bookings by 9.

**T — Transformation:** Her practice didn't change. Her systems did.

**O — Offer:** 15 minutes with me. Your actual audit numbers. A clear picture of what's fixable and how fast. No pitch, no obligation.

**R — Response:** → {{booking_link}}

That's all.

Sarah
Booked Ranked Fundable

P.S. Want off this list? Just reply and I'll remove you immediately.`,
      ctaType: "booking",
      ctaLabel: "Book 15 Minutes Here",
      bookingLinkIncluded: true,
    },
  ],
};

// ─── HVAC Warm Sequence ───────────────────────────────────────────────────────

export const HVAC_WARM_SEQUENCE: WarmSequence = {
  id: "hvac-warm-sequence",
  niche: "hvac",
  name: "HVAC Warm Follow-Up — 3-Touch Booking Conversion",
  description:
    "Post-audit / post-demo warm sequence for HVAC companies. Ties audit scores to seasonal revenue loss. Each touch ends with a direct calendar booking link.",
  bookingUrl: "https://cal.com/brf/hvac-strategy",
  triggerEvents: ["audit_completed", "demo_visited"],
  provider: "caffeine_native",
  touches: [
    {
      touchNumber: 1,
      delayHours: 0,
      framework: "Hopkins + Hormozi",
      frameworkRationale:
        "Hopkins: specificity — reference their actual audit scores by name to show you reviewed their specific business. Hormozi: urgency math — tie each score to seasonal revenue loss so the cost of inaction is concrete and immediate.",
      subject:
        "Your [City] HVAC Business Audit: 3 Gaps Costing You Seasonal Jobs Right Now",
      bodyTemplate: `Hi {{owner_name}},

Your free 3-stage audit is ready.

Here's what we found for {{business_name}} in {{city}}:

• SEO Score: {{seo_score}}/100 — {{seo_finding}}
• Reputation Score: {{reputation_score}}/100 — {{reputation_finding}}
• Website Score: {{website_score}}/100 — {{website_finding}}

What that means in real numbers for an HVAC company in a market like {{city}}:

During peak season, businesses with scores in this range typically miss 6–9 calls per week to faster-responding competitors. At $400–$500 per service call and 12 peak weeks, that's $28,800–$54,000 in seasonal revenue going to whoever picks up first.

These are fixable, systems-level problems — not quality problems. Every HVAC company I work with that addresses these scores sees their booked call rate increase within one peak cycle.

I'd like to spend 15 minutes walking through exactly what that fix looks like for {{business_name}}.

→ Book Your Free 15-Min Strategy Call: {{booking_link}}

No pitch. No pressure. Just your specific numbers and a clear picture of what's fixable and how fast.

Mark
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free 15-Min Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 2,
      delayHours: 48,
      framework: "Kennedy Urgency",
      frameworkRationale:
        "Kennedy: zero fluff, direct respect for their time. By touch 2, soft prospects need a harder frame — the competitive gap is widening during peak season while they wait.",
      subject:
        "The HVAC Response Gap in {{city}} (and the platform that closes it)",
      bodyTemplate: `Hi {{owner_name}},

Following up on your audit results for {{business_name}}.

Here's what's happening in {{city}} right now during peak season: the HVAC companies capturing the most jobs aren't necessarily the most experienced — they have three things their competitors don't:

1. An AI front desk that answers every call in under 2 seconds, 24/7
2. A reputation system that builds reviews automatically after every service
3. An SEO footprint that puts them at the top when customers search during a breakdown

Your audit showed {{audit_summary}}. That gap is active right now — every week it stays open, a competitor in your market is capturing jobs that should be yours.

Here's what the full platform gives {{business_name}} on day one:

✓ AI front desk + missed-call SMS ($297/mo value)
✓ Automated reputation management ($197/mo value)
✓ CRM + lead pipeline ($149/mo value)
✓ SEO visibility tracker ($129/mo value)
✓ Seasonal surge alerts ($69/mo value)
✓ Weekly performance report ($49/mo value)

Combined value: $890+/month. The math on capturing even 2 additional service calls per peak week covers it many times over.

I've got a 15-minute call open to walk through what this looks like for {{business_name}} in {{city}} specifically.

→ Grab a Spot Before It Fills: {{booking_link}}

Mark
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 3,
      delayHours: 120,
      framework: "Halbert + Sugarman",
      frameworkRationale:
        "Halbert: conversational, human tone — the final touch needs to feel like a real person closing the loop. Sugarman: slippery slope close — each sentence makes the next click inevitable, ending with a frictionless booking link.",
      subject: "Last thing I want to send you about this...",
      bodyTemplate: `Hi {{owner_name}},

This is my last email on this — I don't want to crowd your inbox.

I've sent you the audit results for {{business_name}}. I've shown you the math. I've laid out exactly what the platform does.

Here's the honest version: most HVAC companies I talk to are leaving real seasonal revenue on the table every year because of fixable systems gaps. Some do something about it. Most don't.

I have no idea which one you are.

If you're genuinely maxed out during peak season, I get it completely.

If the timing isn't right, I get that too.

But if any part of you is still thinking about those audit scores — the {{seo_score}} SEO, the {{reputation_score}} reputation, the {{website_score}} website — and wondering what fixing them before next season looks like in practice, grab 15 minutes here:

→ Grab 15 Minutes Here: {{booking_link}}

That's all I've got.

Mark
Booked Ranked Fundable

P.S. If you want off this list, just reply and I'll remove you immediately. No hard feelings.`,
      ctaType: "booking",
      ctaLabel: "Grab 15 Minutes Here",
      bookingLinkIncluded: true,
    },
  ],
};

// ─── Restoration Warm Sequence ────────────────────────────────────────────────

export const RESTORATION_WARM_SEQUENCE: WarmSequence = {
  id: "restoration-warm-sequence",
  niche: "restoration",
  name: "Restoration Warm Follow-Up — 3-Touch Booking Conversion",
  description:
    "Post-audit / post-demo warm sequence for restoration companies. Emergency/insurance angle — ties audit scores to missed high-value insurance jobs. Each touch ends with a direct booking link.",
  bookingUrl: "https://cal.com/brf/restoration-strategy",
  triggerEvents: ["audit_completed", "demo_visited"],
  provider: "caffeine_native",
  touches: [
    {
      touchNumber: 1,
      delayHours: 0,
      framework: "Hopkins + Hormozi",
      frameworkRationale:
        "Hopkins: specificity — reference actual audit scores with emergency/insurance job framing to make the revenue gap visceral. Hormozi: the math on missed restoration jobs is large — make the cost of inaction undeniable.",
      subject:
        "Your [City] Restoration Business Audit: Emergency Response Gaps Costing You Insurance Jobs",
      bodyTemplate: `Hi {{owner_name}},

Your free 3-stage audit is in.

Here's what we found for {{business_name}} in {{city}}:

• SEO Score: {{seo_score}}/100 — {{seo_finding}}
• Reputation Score: {{reputation_score}}/100 — {{reputation_finding}}
• Website Score: {{website_score}}/100 — {{website_finding}}

What that means in real terms for a restoration company in a market like {{city}}:

Businesses with scores in this range typically miss 2–4 high-value emergency calls per month to competitors who rank higher and respond faster. At $5,000–$14,000 per insurance job, that's $10,000–$56,000 per month going to whoever is more visible and answers first.

Emergency and insurance work doesn't give second chances — the homeowner books the first credible company that responds. These are fixable, systems-level gaps that have nothing to do with the quality of your restoration work.

I'd like to spend 15 minutes walking through exactly what the fix looks like for {{business_name}}.

→ Book Your Free 15-Min Strategy Call: {{booking_link}}

No pitch. No pressure. Just your specific numbers and a clear picture of what's fixable.

James
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free 15-Min Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 2,
      delayHours: 48,
      framework: "Kennedy Urgency",
      frameworkRationale:
        "Kennedy: zero fluff, direct frame. By touch 2, restoration owners need to feel the urgency of the competitive gap — emergency calls don't wait, and neither does the competitor who ranked above them.",
      subject:
        "The Emergency Response Gap Costing {{business_name}} Insurance Jobs",
      bodyTemplate: `Hi {{owner_name}},

Following up on your audit results.

Here's the competitive reality in {{city}}: the restoration companies capturing the most insurance jobs aren't always the most experienced — they've built three systems their competitors haven't:

1. A 24/7 AI emergency front desk that responds in under 3 seconds
2. A reputation system that builds reviews after every completed job
3. A website with clear, mobile-optimized emergency and insurance claim messaging

Your audit showed {{audit_summary}}. While that gap stays open, a competitor in {{city}} is capturing the $8,000–$25,000 insurance jobs you should be getting.

Here's the full platform for {{business_name}} on day one:

✓ AI emergency front desk + triage flow ($397/mo value)
✓ Missed-call SMS — captures callers who don't leave messages ($97/mo value)
✓ CRM with insurance job tracking ($179/mo value)
✓ Automated reputation management ($79/mo value)
✓ SEO visibility tracker for {{city}} ($129/mo value)
✓ Weekly performance report ($49/mo value)

The math on closing one additional insurance job per month more than covers the full platform.

I've got 15 minutes open to walk through what this looks like specifically for {{business_name}}.

→ Grab a Spot Here: {{booking_link}}

James
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 3,
      delayHours: 120,
      framework: "Halbert + Sugarman",
      frameworkRationale:
        "Halbert: human, conversational close — the final touch needs to feel like a real person. Sugarman: slippery slope close — each sentence builds toward the single, frictionless booking CTA.",
      subject: "Last thing before I close the loop on this...",
      bodyTemplate: `Hi {{owner_name}},

This is my last email — I mean it.

I've sent you the audit results for {{business_name}}. I've laid out the emergency response gap. I've shown you the insurance job math.

The honest version: most restoration companies I talk to know they're losing high-value jobs to faster-responding, better-ranked competitors. Some fix it. Most don't.

I don't know which category {{business_name}} falls into.

If the timing isn't right or you're genuinely slammed, I completely understand.

But if any part of you is still thinking about those audit scores — the {{seo_score}} SEO, the {{reputation_score}} reputation, the {{website_score}} website — and what fixing them before the next storm or flood season means for your insurance pipeline, grab 15 minutes here:

→ Grab 15 Minutes Here: {{booking_link}}

That's everything I've got.

James
Booked Ranked Fundable

P.S. Want off this list? Reply and I'll remove you immediately.`,
      ctaType: "booking",
      ctaLabel: "Grab 15 Minutes Here",
      bookingLinkIncluded: true,
    },
  ],
};

// ─── Carpet Cleaning Warm Sequence ────────────────────────────────────────────

export const CARPET_CLEANING_WARM_SEQUENCE: WarmSequence = {
  id: "carpet-cleaning-warm-sequence",
  niche: "carpet-cleaning",
  name: "Carpet Cleaning Warm Follow-Up — 3-Touch Booking Conversion",
  description:
    "Post-audit / post-demo warm sequence for carpet cleaning companies. Recurring revenue and referral angle — ties audit scores to uncaptured rebooking and referral revenue. Each touch ends with a direct booking link.",
  bookingUrl: "https://cal.com/brf/carpet-strategy",
  triggerEvents: ["audit_completed", "demo_visited"],
  provider: "caffeine_native",
  touches: [
    {
      touchNumber: 1,
      delayHours: 0,
      framework: "Hopkins + Hormozi",
      frameworkRationale:
        "Hopkins: specificity with recurring revenue framing — their actual scores make the uncaptured rebooking revenue feel real. Hormozi: the compounding math of recurring clients is especially powerful for carpet cleaning.",
      subject:
        "Your [City] Carpet Cleaning Audit: Recurring Revenue Sitting Uncaptured in Your Client List",
      bodyTemplate: `Hi {{owner_name}},

Your free 3-stage audit is ready.

Here's what we found for {{business_name}} in {{city}}:

• SEO Score: {{seo_score}}/100 — {{seo_finding}}
• Reputation Score: {{reputation_score}}/100 — {{reputation_finding}}
• Website Score: {{website_score}}/100 — {{website_finding}}

What that means in real revenue for a carpet cleaning business in a market like {{city}}:

Businesses with scores in this range typically convert new visitors to bookings at about 1 in 9. Businesses with optimized scores convert 1 in 4. At your current traffic, that difference is likely 8–15 additional bookings per month just from your online presence alone.

Add in the recurring rebooking gap: if you've served 100+ clients and don't have an automated follow-up system, 55–65% of those clients are quietly rebooking with whoever shows up first next time they search. That's $15,000–$22,000 in recoverable annual revenue from your existing client list.

I'd like to spend 15 minutes showing you exactly what closing both of those gaps looks like for {{business_name}}.

→ Book Your Free 15-Min Strategy Call: {{booking_link}}

No pitch. Just your specific numbers and a clear picture of what's fixable.

Tom
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free 15-Min Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 2,
      delayHours: 48,
      framework: "Kennedy Urgency",
      frameworkRationale:
        "Kennedy: direct, no-fluff frame. By touch 2, carpet cleaning owners need to feel the compounding cost of not having a recurring system — every month without automation is another month of lost rebuys.",
      subject: "The Rebooking Gap Costing {{business_name}} Recurring Revenue",
      bodyTemplate: `Hi {{owner_name}},

Following up on your audit results for {{business_name}}.

Here's what the carpet cleaning businesses growing fastest in markets like {{city}} have systematized:

1. Every completed job triggers an automatic review request — reviews build rankings, rankings bring new clients
2. Every client is followed up with a rebooking prompt at 6 months — the schedule fills itself
3. Every referral opportunity is captured with an automated follow-up sequence

Your audit showed {{audit_summary}}. Without these systems, every week that passes is another set of past clients quietly rebooking with whoever shows up first in their next search.

Here's the full platform for {{business_name}} on day one:

✓ AI booking agent + instant inquiry response ($297/mo value)
✓ Automated rebooking flow at 6 months ($147/mo value)
✓ Review request after every completed job ($79/mo value)
✓ CRM with full client and job history ($129/mo value)
✓ SEO visibility tracker for {{city}} ($129/mo value)
✓ Referral automation system ($89/mo value)
✓ Weekly performance report ($49/mo value)

The recurring revenue math from automated rebooking alone — 100 past clients × 60% rebooking × $280 average job — covers the full platform many times over.

I have 15 minutes open to walk through what this looks like for {{business_name}} specifically.

→ Grab a Spot Here: {{booking_link}}

Tom
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 3,
      delayHours: 120,
      framework: "Halbert + Sugarman",
      frameworkRationale:
        "Halbert: warm, conversational close — the final touch needs to feel personal. Sugarman: slippery slope — each sentence builds toward the single, frictionless booking link.",
      subject: "Last thing before I close the loop...",
      bodyTemplate: `Hi {{owner_name}},

This is my last email — I won't keep cluttering your inbox.

I've sent you the audit results for {{business_name}}. I've shown you the recurring revenue math. I've laid out exactly what the rebooking and referral automation looks like.

Here's the honest version: the carpet cleaning companies I see grow fastest aren't cleaning better carpets. They've just built a system that turns every completed job into a review, a rebook, and a referral. The ones not growing? Just as good at the work. No system for what comes after.

I don't know which one {{business_name}} is.

If you're genuinely too busy or the timing isn't right, I understand completely.

But if any part of you is still thinking about those audit scores — the {{seo_score}} SEO, the {{reputation_score}} reputation, the {{website_score}} website — and what capturing the recurring revenue in your existing client list would actually mean for your business, grab 15 minutes here:

→ Grab 15 Minutes Here: {{booking_link}}

That's everything I've got.

Tom
Booked Ranked Fundable

P.S. Want off this list? Reply and I'll remove you immediately.`,
      ctaType: "booking",
      ctaLabel: "Grab 15 Minutes Here",
      bookingLinkIncluded: true,
    },
  ],
};

// ─── Roofing Warm Sequence ────────────────────────────────────────────────────

export const ROOFING_WARM_SEQUENCE: WarmSequence = {
  id: "roofing-warm-sequence",
  niche: "roofing",
  name: "Roofing Warm Follow-Up — 3-Touch Booking Conversion",
  description:
    "Post-audit / post-demo warm sequence for roofing companies. Storm season and insurance job angle — ties audit scores to missed high-value storm and replacement jobs. Each touch ends with a direct booking link.",
  bookingUrl: "https://cal.com/brf/roofing-strategy",
  triggerEvents: ["audit_completed", "demo_visited"],
  provider: "caffeine_native",
  touches: [
    {
      touchNumber: 1,
      delayHours: 0,
      framework: "Hopkins + Hormozi",
      frameworkRationale:
        "Hopkins: specificity with storm/insurance framing — their actual audit scores map directly to missed storm job revenue. Hormozi: the math on missed roofing jobs is the largest of any niche — make it undeniable.",
      subject:
        "Your [City] Roofing Business Audit: Storm Lead Gaps Costing You Insurance Jobs Right Now",
      bodyTemplate: `Hi {{owner_name}},

Your free 3-stage audit is in.

Here's what we found for {{business_name}} in {{city}}:

• SEO Score: {{seo_score}}/100 — {{seo_finding}}
• Reputation Score: {{reputation_score}}/100 — {{reputation_finding}}
• Website Score: {{website_score}}/100 — {{website_finding}}

What that means in real terms for a roofing company in a market like {{city}}:

Businesses with scores in this range typically miss 3–6 insurance jobs per significant storm event to competitors who rank higher and respond faster. At $10,000–$25,000 per insurance replacement job and 4 significant weather events per year, that's $120,000–$600,000 annually going to whoever shows up first and answers fastest.

Storm season doesn't offer second chances. The homeowner calls three companies and books the first one that responds with credibility. These are systems-level gaps — not quality-of-work problems.

I'd like to spend 15 minutes walking through exactly what the fix looks like for {{business_name}} before the next storm season.

→ Book Your Free 15-Min Strategy Call: {{booking_link}}

No pitch. No pressure. Just your specific numbers and a clear picture of what's fixable and how fast.

Ryan
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free 15-Min Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 2,
      delayHours: 48,
      framework: "Kennedy Urgency",
      frameworkRationale:
        "Kennedy: direct, no-fluff urgency. By touch 2, roofers need to feel the competitive gap closing in real time — storm season prep is a now-or-never window.",
      subject: "The Storm Job Gap Costing {{business_name}} Insurance Revenue",
      bodyTemplate: `Hi {{owner_name}},

Following up on your audit results for {{business_name}}.

Here's the competitive reality in {{city}}: the roofing companies capturing the most insurance jobs after a storm event aren't always the most skilled — they've built three systems that make them unbeatable in the first 72 hours post-storm:

1. AI front desk that responds to every storm inquiry in under 60 seconds, 24/7
2. Reputation system that keeps them in the top 3 Google results with 200+ reviews
3. Insurance claim assistance flow that makes them the obvious, easiest choice for homeowners and adjusters

Your audit showed {{audit_summary}}. That gap is active right now — every storm that rolls through {{city}} while these gaps are open is another $40,000–$100,000 in insurance jobs going to whoever ranked above you and responded first.

Here's the full platform for {{business_name}} on day one:

✓ AI front desk + storm inquiry response ($397/mo value)
✓ Insurance claim assistance and documentation flow ($247/mo value)
✓ Missed-call SMS ($97/mo value)
✓ CRM with insurance job tracking ($179/mo value)
✓ Automated reputation management ($79/mo value)
✓ SEO visibility tracker + storm surge alerts ($218/mo value)
✓ Fundability score ($97/mo value)

One additional insurance job per month more than covers the entire platform.

I have 15 minutes open specifically to walk through what this looks like for {{business_name}} heading into storm season.

→ Grab a Spot Here: {{booking_link}}

Ryan
Booked Ranked Fundable`,
      ctaType: "booking",
      ctaLabel: "Book Your Free Strategy Call",
      bookingLinkIncluded: true,
    },
    {
      touchNumber: 3,
      delayHours: 120,
      framework: "Halbert + Sugarman",
      frameworkRationale:
        "Halbert: warm, conversational final close. Sugarman: slippery slope — each sentence makes the booking link feel like the inevitable, obvious next step.",
      subject: "Last thing before I close the loop on this...",
      bodyTemplate: `Hi {{owner_name}},

This is my last email — I'm not going to keep taking up space in your inbox.

I've sent you the audit results for {{business_name}}. I've shown you the storm job math. I've laid out the full platform.

Here's the honest version: the roofing companies dominating their markets aren't doing better work — they've built the systems that make them impossible to miss when a homeowner is in crisis. The ones losing ground? Just as skilled. No system for capturing the storm window and converting it.

I don't know which one {{business_name}} is.

If you're slammed right now or the timing's off, I completely understand — roofing seasons are unforgiving.

But if any part of you is still thinking about those audit scores — the {{seo_score}} SEO, the {{reputation_score}} reputation, the {{website_score}} website — and what closing those gaps before the next storm would mean for your insurance pipeline, grab 15 minutes here:

→ Grab 15 Minutes Here: {{booking_link}}

That's all I've got.

Ryan
Booked Ranked Fundable

P.S. Want off this list? Just reply and I'll remove you immediately.`,
      ctaType: "booking",
      ctaLabel: "Grab 15 Minutes Here",
      bookingLinkIncluded: true,
    },
  ],
};

// ─── All Warm Sequences ───────────────────────────────────────────────────────

export const WARM_SEQUENCES: WarmSequence[] = [
  PLUMBER_WARM_SEQUENCE,
  MED_SPA_WARM_SEQUENCE,
  HVAC_WARM_SEQUENCE,
  RESTORATION_WARM_SEQUENCE,
  CARPET_CLEANING_WARM_SEQUENCE,
  ROOFING_WARM_SEQUENCE,
];

// ─── Mock Warm Handoff Events ─────────────────────────────────────────────────

export const DEFAULT_PLUMBER_WARM_ENROLLMENTS: WarmSequenceEnrollment[] = [
  {
    id: "warm-plumb-1",
    leadId: "lead-p2",
    leadName: "Mike Thompson",
    businessName: "North County Pipes",
    niche: "plumbing",
    warmSequenceId: "plumbing-warm-sequence",
    currentTouchIndex: 3,
    status: "converted",
    enrolledAt: "2026-03-15T12:05:00Z",
    handoffTrigger: "audit_completed",
    auditScores: {
      seoScore: 41,
      reputationScore: 58,
      websiteScore: 35,
      overallScore: 45,
    },
  },
  {
    id: "warm-plumb-2",
    leadId: "lead-p5",
    leadName: "Daniel Ortiz",
    businessName: "Ortiz Plumbing & Drain",
    niche: "plumbing",
    warmSequenceId: "plumbing-warm-sequence",
    currentTouchIndex: 1,
    status: "active",
    enrolledAt: "2026-04-14T09:30:00Z",
    nextSendAt: "2026-04-16T10:00:00Z",
    handoffTrigger: "audit_completed",
    auditScores: {
      seoScore: 34,
      reputationScore: 62,
      websiteScore: 29,
      overallScore: 42,
    },
  },
  {
    id: "warm-plumb-3",
    leadId: "lead-p6",
    leadName: "Brett Hansen",
    businessName: "Hansen's Plumbing Solutions",
    niche: "plumbing",
    warmSequenceId: "plumbing-warm-sequence",
    currentTouchIndex: 2,
    status: "active",
    enrolledAt: "2026-04-10T14:00:00Z",
    nextSendAt: "2026-04-17T09:00:00Z",
    handoffTrigger: "demo_visited",
    auditScores: null,
  },
];

export const DEFAULT_MED_SPA_WARM_ENROLLMENTS: WarmSequenceEnrollment[] = [
  {
    id: "warm-ms-1",
    leadId: "lead-ms2",
    leadName: "Ashley Moore",
    businessName: "Luxe Aesthetics Studio",
    niche: "medspa",
    warmSequenceId: "medspa-warm-sequence",
    currentTouchIndex: 2,
    status: "active",
    enrolledAt: "2026-03-20T11:00:00Z",
    nextSendAt: "2026-04-18T10:00:00Z",
    handoffTrigger: "audit_completed",
    auditScores: {
      seoScore: 52,
      reputationScore: 44,
      websiteScore: 39,
      overallScore: 45,
    },
  },
  {
    id: "warm-ms-2",
    leadId: "lead-ms5",
    leadName: "Diana Vasquez",
    businessName: "Clarity Skin & Wellness",
    niche: "medspa",
    warmSequenceId: "medspa-warm-sequence",
    currentTouchIndex: 3,
    status: "completed",
    enrolledAt: "2026-03-28T09:00:00Z",
    handoffTrigger: "audit_completed",
    auditScores: {
      seoScore: 47,
      reputationScore: 61,
      websiteScore: 33,
      overallScore: 47,
    },
  },
  {
    id: "warm-ms-3",
    leadId: "lead-ms6",
    leadName: "Priya Nair",
    businessName: "Aura Medical Aesthetics",
    niche: "medspa",
    warmSequenceId: "medspa-warm-sequence",
    currentTouchIndex: 1,
    status: "active",
    enrolledAt: "2026-04-15T13:00:00Z",
    nextSendAt: "2026-04-17T10:00:00Z",
    handoffTrigger: "demo_visited",
    auditScores: null,
  },
];

export const ALL_WARM_ENROLLMENTS: WarmSequenceEnrollment[] = [
  ...DEFAULT_PLUMBER_WARM_ENROLLMENTS,
  ...DEFAULT_MED_SPA_WARM_ENROLLMENTS,
];

// ─── Mock Warm Handoff Events ─────────────────────────────────────────────────

export const WARM_HANDOFF_EVENTS: WarmLeadHandoff[] = [
  {
    leadId: "lead-p2",
    leadName: "Mike Thompson",
    businessName: "North County Pipes",
    city: "Oceanside, CA",
    niche: "plumbing",
    coldSequenceId: "plumbing-cold-sequence",
    warmSequenceId: "plumbing-warm-sequence",
    handoffTrigger: "audit_completed",
    handoffTimestamp: "2026-03-15T12:02:00Z",
    auditScores: {
      seoScore: 41,
      reputationScore: 58,
      websiteScore: 35,
      overallScore: 45,
    },
    demoVisited: false,
  },
  {
    leadId: "lead-ms2",
    leadName: "Ashley Moore",
    businessName: "Luxe Aesthetics Studio",
    city: "Beverly Hills, CA",
    niche: "medspa",
    coldSequenceId: "medspa-cold-sequence",
    warmSequenceId: "medspa-warm-sequence",
    handoffTrigger: "audit_completed",
    handoffTimestamp: "2026-03-20T10:58:00Z",
    auditScores: {
      seoScore: 52,
      reputationScore: 44,
      websiteScore: 39,
      overallScore: 45,
    },
    demoVisited: true,
  },
  {
    leadId: "lead-p5",
    leadName: "Daniel Ortiz",
    businessName: "Ortiz Plumbing & Drain",
    city: "Phoenix, AZ",
    niche: "plumbing",
    coldSequenceId: "plumbing-cold-sequence",
    warmSequenceId: "plumbing-warm-sequence",
    handoffTrigger: "audit_completed",
    handoffTimestamp: "2026-04-14T09:28:00Z",
    auditScores: {
      seoScore: 34,
      reputationScore: 62,
      websiteScore: 29,
      overallScore: 42,
    },
    demoVisited: false,
  },
  {
    leadId: "lead-p6",
    leadName: "Brett Hansen",
    businessName: "Hansen's Plumbing Solutions",
    city: "Denver, CO",
    niche: "plumbing",
    coldSequenceId: "plumbing-cold-sequence",
    warmSequenceId: "plumbing-warm-sequence",
    handoffTrigger: "demo_visited",
    handoffTimestamp: "2026-04-10T13:55:00Z",
    auditScores: null,
    demoVisited: true,
  },
  {
    leadId: "lead-ms5",
    leadName: "Diana Vasquez",
    businessName: "Clarity Skin & Wellness",
    city: "Miami, FL",
    niche: "medspa",
    coldSequenceId: "medspa-cold-sequence",
    warmSequenceId: "medspa-warm-sequence",
    handoffTrigger: "audit_completed",
    handoffTimestamp: "2026-03-28T08:45:00Z",
    auditScores: {
      seoScore: 47,
      reputationScore: 61,
      websiteScore: 33,
      overallScore: 47,
    },
    demoVisited: false,
  },
  {
    leadId: "lead-ms6",
    leadName: "Priya Nair",
    businessName: "Aura Medical Aesthetics",
    city: "Austin, TX",
    niche: "medspa",
    coldSequenceId: "medspa-cold-sequence",
    warmSequenceId: "medspa-warm-sequence",
    handoffTrigger: "demo_visited",
    handoffTimestamp: "2026-04-15T12:50:00Z",
    auditScores: null,
    demoVisited: true,
  },
];

// ─── Default Audit Tripwire Config ────────────────────────────────────────────

export const DEFAULT_AUDIT_TRIPWIRE: AuditTripwireConfig = {
  auditUrl: "/free-audit",
  warmSequenceId: "plumbing-warm-sequence",
  notifyAdmin: true,
  autoRemoveFromColdSequence: true,
};

export const MED_SPA_AUDIT_TRIPWIRE: AuditTripwireConfig = {
  auditUrl: "/free-audit",
  warmSequenceId: "medspa-warm-sequence",
  notifyAdmin: true,
  autoRemoveFromColdSequence: true,
};

// ─── UTM Attribution Mock Data ────────────────────────────────────────────────

export const UTM_ATTRIBUTION_DATA = [
  { touchLabel: "Touch 1 (Ogilvy+Hopkins)", auditStarts: 34, demoVisits: 18 },
  { touchLabel: "Touch 2 (PASTOR)", auditStarts: 22, demoVisits: 27 },
  { touchLabel: "Touch 3 (Hormozi)", auditStarts: 14, demoVisits: 31 },
  { touchLabel: "Touch 4 (Halbert+Abraham)", auditStarts: 11, demoVisits: 19 },
  { touchLabel: "Touch 5 (Kennedy)", auditStarts: 24, demoVisits: 8 },
];

// ─── Time-Series Weekly Data ──────────────────────────────────────────────────

export const WEEKLY_CHART_DATA = [
  { week: "Apr 1–7", enrolled: 38, sent: 142, opened: 47, clicked: 17 },
  { week: "Apr 8–14", enrolled: 29, sent: 118, opened: 41, clicked: 14 },
  { week: "Apr 15–21", enrolled: 44, sent: 163, opened: 58, clicked: 21 },
  { week: "Apr 22–28", enrolled: 33, sent: 127, opened: 45, clicked: 16 },
];
