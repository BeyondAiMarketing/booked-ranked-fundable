import { r as reactExports, j as jsxRuntimeExports, aP as Switch, aR as ue, i as Clock, B as Button, aX as Calendar, bm as Star, au as Badge, an as RefreshCw, av as Card, aA as CardHeader, aw as CardContent, aS as Check, bi as Pen, g as Textarea, q as Trash2, bn as Image, ak as Sparkles, P as Plus, ac as ExternalLink, aB as CardTitle, bo as Instagram, bg as MessageSquare, bp as Linkedin, T as TrendingUp, aF as ChevronRight, ah as Zap } from "./index-DAQiRbqG.js";
import { u as useSocialMedia } from "./useSocialMedia-YqFsAq39.js";
import { f as formatForPlatform } from "./socialContentService-DxBFOoj9.js";
const NICHE_BEFORE_AFTER = {
  plumbing: {
    before: "Sump pump failure at 2am. Basement taking on water.",
    after: "[Business Name] arrived in 45 minutes, installed new pump, no flooding.",
    hook: "Before: crisis at 2am. After: crisis averted by sunrise."
  },
  hvac: {
    before: "$340/month energy bills. AC struggling to keep up.",
    after: "[Business Name] installed new system. Bills dropped to $180.",
    hook: "Before: $340/month. After: $180/month. Same house. New system."
  },
  med_spa: {
    before: "Stubborn [treatment area] for 3 years. Every product failed.",
    after: "One session with [Business Name]. Results after 4 weeks.",
    hook: "3 years of frustration. 1 session. You'd be surprised."
  },
  restoration: {
    before: "Category 3 water damage. 40% of home affected.",
    after: "[Business Name] restored everything in 6 days. Insurance covered 100%.",
    hook: "Before: 40% of the home underwater. After: fully restored, fully covered."
  },
  carpet_cleaning: {
    before: "6-year-old carpet, pet stains throughout. Thought it was ruined.",
    after: "[Business Name] restored it to like-new condition in 2 hours.",
    hook: "She was ready to replace the whole carpet. Glad she called us first."
  },
  roofing: {
    before: "Hail damage. 3 estimates, all $15k+. Feeling overwhelmed.",
    after: "[Business Name] worked with insurance. $2,100 out-of-pocket.",
    hook: "3 bids at $15k. We got it done for $2,100. Here's how."
  },
  real_estate: {
    before: "Listed for 47 days with no offers. Frustrated seller, quiet open houses.",
    after: "[Business Name] repriced and staged — sold in 9 days at full ask.",
    hook: "47 days. No offers. 9 days with us. Full asking price."
  },
  mortgage: {
    before: "Denied by 2 banks. Credit too thin, down payment too small.",
    after: "[Business Name] found a lender. 3.2% rate, closed in 28 days.",
    hook: "Denied twice. Then they found the right lender. Keys in 28 days."
  },
  chiropractic: {
    before: "Sciatic pain for 2 years. Couldn't sit at a desk. Missed work.",
    after: "8 sessions with [Business Name]. Pain-free. Back at full productivity.",
    hook: "2 years of sciatic pain. Gone in 8 sessions."
  },
  dental: {
    before: "Avoided smiling in photos for 4 years. Self-conscious at every event.",
    after: "[Business Name] fixed that in one appointment.",
    hook: "4 years of hiding your smile. One appointment to get it back."
  }
};
function generateNicheBeforeAfterCaption(niche, businessName, platform) {
  const template = NICHE_BEFORE_AFTER[niche.toLowerCase().replace(/\s+/g, "_")] ?? NICHE_BEFORE_AFTER.plumbing;
  const before = template.before.replace("[Business Name]", businessName);
  const after = template.after.replace("[Business Name]", businessName);
  const hook = template.hook.replace("[Business Name]", businessName);
  if (platform === "instagram") {
    return formatForPlatform(
      `${hook} ✅

Before: ${before}
After: ${after}

This is what we do every day. Book your appointment → link in bio ⬆️

#beforeandafter #${niche.toLowerCase().replace(/\s+/g, "")} #results #${businessName.toLowerCase().replace(/\s+/g, "")}`,
      "instagram"
    );
  }
  if (platform === "linkedin") {
    return formatForPlatform(
      `In this industry, the result is the message.

${before}

→ ${after}

That's not luck. That's process, speed, and the right team. What does your service promise look like in practice?`,
      "linkedin"
    );
  }
  return formatForPlatform(
    `${hook}

Before: ${before}
After: ${after}

This is a real client story. If this sounds like your situation, comment HELP or click the link — we'll take it from here.`,
    "facebook"
  );
}
const INITIAL_REVIEWS = [
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
          "instagram"
        ),
        qualityScore: 91
      },
      {
        platform: "facebook",
        content: formatForPlatform(
          '"They arrived within 90 minutes of my call, fixed our burst pipe before it did any more damage, and cleaned up after themselves." — Jennifer M. ⭐⭐⭐⭐⭐\n\nWhen a pipe bursts, every minute counts. Our certified plumbers are on call 24/7 so you never face a crisis alone. Comment PIPE or click the link to book your free inspection.',
          "facebook"
        ),
        qualityScore: 88
      },
      {
        platform: "linkedin",
        content: formatForPlatform(
          "In the service industry, response time is a brand promise.\n\nWhen Jennifer called us with a burst pipe at 8 PM, our team arrived in 90 minutes. The pipe was fixed. The mess was cleaned. The crisis was over before it became a disaster.\n\nThat's not luck — it's operational discipline and the right team.",
          "linkedin"
        ),
        qualityScore: 84
      }
    ],
    status: "pending",
    editing: null
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
          "instagram"
        ),
        qualityScore: 93
      },
      {
        platform: "facebook",
        content: formatForPlatform(
          `Heat wave. AC out. Marcus needed help — fast.

Same-day tech. 20-minute diagnosis. Parts on the truck. Running again in under 2 hours. ⭐⭐⭐⭐⭐

"Truly outstanding" — Marcus D.

Don't sweat it out alone. Comment HVAC or click the link to book your same-day assessment.`,
          "facebook"
        ),
        qualityScore: 90
      },
      {
        platform: "linkedin",
        content: formatForPlatform(
          "Same-day service isn't a marketing tagline. It's a commitment that requires fully stocked service vehicles, trained technicians on standby, and dispatch systems that route efficiently.\n\nMarcus's AC failed during a heat wave. 2 hours later, his home was cool. That's the standard we hold every day.",
          "linkedin"
        ),
        qualityScore: 86
      }
    ],
    status: "pending",
    editing: null
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
          "instagram"
        ),
        qualityScore: 95
      },
      {
        platform: "facebook",
        content: formatForPlatform(
          `"The results were natural-looking and exactly what I wanted. I've already referred 3 friends." — Sophia R. ⭐⭐⭐⭐⭐

Natural, beautiful results — that's our standard. Not frozen. Not overdone. Just you, refreshed. Thinking about Botox for the first time? Comment CONSULT and we'll send you our complimentary first-visit guide.`,
          "facebook"
        ),
        qualityScore: 89
      },
      {
        platform: "linkedin",
        content: formatForPlatform(
          "The most powerful marketing in aesthetic medicine is word-of-mouth.\n\nSophia booked a Botox consultation, loved her results, and referred 3 friends within the same week. No ad campaign generates that kind of ROI.\n\nInvesting in patient experience and clinical excellence isn't just good medicine — it's good business.",
          "linkedin"
        ),
        qualityScore: 82
      }
    ],
    status: "pending",
    editing: null
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
          "instagram"
        ),
        qualityScore: 92
      },
      {
        platform: "facebook",
        content: formatForPlatform(
          `A broken dishwasher line flooded David's kitchen. 2 hours later:

✅ Water extracted
✅ Industrial drying equipment running
✅ Insurance claim handled

"Could not ask for better." — David K. ⭐⭐⭐⭐⭐

Water damage gets worse by the hour. Comment HELP or call us now — we respond 24/7.`,
          "facebook"
        ),
        qualityScore: 94
      },
      {
        platform: "linkedin",
        content: formatForPlatform(
          "Speed matters in water damage restoration. Mold can start growing within 24–48 hours. Structure damage compounds every hour moisture sits.\n\nWhen David called us at 7 PM with a flooded kitchen, we were there in 2 hours. Water extracted. Equipment running. Insurance documentation handled.\n\nThe difference between a $3,000 job and a $30,000 job is often response time.",
          "linkedin"
        ),
        qualityScore: 87
      }
    ],
    status: "pending",
    editing: null
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
          "instagram"
        ),
        qualityScore: 90
      },
      {
        platform: "facebook",
        content: formatForPlatform(
          `Lisa had a family gathering coming up and carpets she thought were ruined — pet stains, years of foot traffic. After our truck-mounted deep clean?

"Rooms I thought were beyond hope." "The whole house smells amazing."

⭐⭐⭐⭐⭐ — Lisa T.

Got a big event coming up? Comment CLEAN and we'll get you scheduled.`,
          "facebook"
        ),
        qualityScore: 91
      },
      {
        platform: "linkedin",
        content: formatForPlatform(
          'Customer expectation management is everything in service businesses.\n\nLisa expected improvement. She got transformation — rooms she described as "beyond hope" were restored before her family gathering. Pet stains. High-traffic damage. All gone.\n\nWhen you consistently exceed expectations, reviews write themselves and referrals follow.',
          "linkedin"
        ),
        qualityScore: 83
      }
    ],
    status: "pending",
    editing: null
  }
];
const MOCK_BEFORE_AFTER = [
  {
    id: "ba-1",
    title: "Emergency Pipe Replacement",
    niche: "Plumbing",
    nicheKey: "plumbing",
    location: "San Diego, CA",
    instagramCaption: generateNicheBeforeAfterCaption(
      "plumbing",
      "FastFix Plumbing",
      "instagram"
    ),
    facebookCaption: generateNicheBeforeAfterCaption(
      "plumbing",
      "FastFix Plumbing",
      "facebook"
    ),
    linkedinCaption: generateNicheBeforeAfterCaption(
      "plumbing",
      "FastFix Plumbing",
      "linkedin"
    ),
    qualityScore: 93,
    status: "pending",
    leadsGenerated: 0
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
      "instagram"
    ),
    facebookCaption: generateNicheBeforeAfterCaption(
      "hvac",
      "Cool Air Pros",
      "facebook"
    ),
    linkedinCaption: generateNicheBeforeAfterCaption(
      "hvac",
      "Cool Air Pros",
      "linkedin"
    ),
    qualityScore: 91,
    status: "pending",
    leadsGenerated: 0
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
      "instagram"
    ),
    facebookCaption: generateNicheBeforeAfterCaption(
      "roofing",
      "Storm Guard Roofing",
      "facebook"
    ),
    linkedinCaption: generateNicheBeforeAfterCaption(
      "roofing",
      "Storm Guard Roofing",
      "linkedin"
    ),
    qualityScore: 89,
    status: "pending",
    leadsGenerated: 0
  }
];
const MOCK_TESTIMONIALS = [
  {
    id: "t-1",
    clientName: "Carlos Mendez",
    businessType: "Plumbing Business Owner",
    originalText: "Since using the AI receptionist, I have not missed a single after-hours call. My booking rate went up 40% in the first month and I did not have to hire anyone new. This system pays for itself every week.",
    instagramVersion: '40% more bookings. Zero missed calls. No new hires. 📈\n\n"This system pays for itself every week." — Carlos M., Plumbing Business Owner\n\nYour AI receptionist is waiting. Link in bio ⬆️\n\n#businessgrowth #plumbing #ai #automation #leadgeneration',
    facebookVersion: `"Since using the AI receptionist, I have not missed a single after-hours call. My booking rate went up 40% in the first month and I did not have to hire anyone new. This system pays for itself every week." — Carlos M., Plumbing Business Owner

What would 40% more bookings mean for your business? Comment DEMO and we'll show you exactly how it works for your niche.`,
    linkedinVersion: "Carlos Mendez runs a plumbing business in San Diego.\n\nBefore: missed after-hours calls, lost jobs to competitors who answered.\nAfter: AI receptionist handling every call, 40% booking rate increase, same team size.\n\nThe ROI question in service businesses isn't whether AI works. It's how fast it pays for itself. For Carlos: Week 1.",
    status: "pending",
    leadsGenerated: 0
  },
  {
    id: "t-2",
    clientName: "Dr. Amanda Pierce",
    businessType: "Med Spa Owner",
    originalText: "The automated review requests alone have tripled our Google rating volume. We went from 47 reviews to 183 in 8 weeks. Our consultation bookings are up 60% because people trust us more when they search for us.",
    instagramVersion: `47 reviews → 183 reviews in 8 weeks. Consultation bookings up 60%. 🚀

"People trust us more when they search for us." — Dr. Amanda P., Med Spa Owner

Your reputation is your most valuable marketing channel. Let's build it. Link in bio ⬆️

#medspa #googlereviews #reputation #businessgrowth #aesthetics`,
    facebookVersion: `Dr. Amanda's med spa had 47 Google reviews. In 8 weeks with automated review requests, that jumped to 183.

Consultation bookings: up 60%.

"People trust us more when they search for us."

More reviews = more trust = more bookings. It's that simple. Want to see how it works for your practice? Comment REVIEWS.`,
    linkedinVersion: "For Dr. Amanda Pierce, 8 weeks of automated review requests produced:\n\n→ 47 reviews → 183 reviews\n→ 60% increase in consultation bookings\n→ Dominant Google presence in her market\n\nIn aesthetic medicine, search trust drives consultation volume. The math is simple: more authentic reviews, more conversions.",
    status: "pending",
    leadsGenerated: 0
  }
];
function QualityBadge({ score }) {
  if (score >= 88) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold badge-emerald", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
      "High"
    ] });
  }
  if (score >= 75) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold badge-amber", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
      "Medium"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold badge-rose", children: "Low" });
}
function PlatformIcon({ platform }) {
  switch (platform) {
    case "instagram":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-3.5 w-3.5" });
    case "linkedin":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-3.5 w-3.5" });
    case "facebook":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" });
  }
}
function SocialProofPipelinePage() {
  const { createScheduledPost } = useSocialMedia();
  const [reviews, setReviews] = reactExports.useState(INITIAL_REVIEWS);
  const [beforeAfterPairs, setBeforeAfterPairs] = reactExports.useState(MOCK_BEFORE_AFTER);
  const [testimonials, setTestimonials] = reactExports.useState(MOCK_TESTIMONIALS);
  const [autoSchedule, setAutoSchedule] = reactExports.useState(true);
  const [editingContent, setEditingContent] = reactExports.useState(
    {}
  );
  const [readyQueue, setReadyQueue] = reactExports.useState([]);
  const [trackingLeads, setTrackingLeads] = reactExports.useState(
    {}
  );
  const convertedToday = reviews.filter((r) => r.status === "approved").length;
  const totalApproved = reviews.filter((r) => r.status === "approved").length + beforeAfterPairs.filter((b) => b.status === "approved").length + testimonials.filter((t) => t.status === "approved").length;
  const totalLeadsGenerated = Object.values(trackingLeads).reduce(
    (s, v) => s + v,
    0
  );
  const startEditing = (reviewId, platform, currentContent) => {
    setEditingContent((prev) => ({
      ...prev,
      [`${reviewId}-${platform}`]: currentContent
    }));
    setReviews(
      (prev) => prev.map((r) => r.id === reviewId ? { ...r, editing: platform } : r)
    );
  };
  const saveEdit = (reviewId, platform) => {
    const key = `${reviewId}-${platform}`;
    const newContent = editingContent[key];
    if (!newContent) return;
    setReviews(
      (prev) => prev.map(
        (r) => r.id === reviewId ? {
          ...r,
          editing: null,
          variants: r.variants.map(
            (v) => v.platform === platform ? { ...v, content: newContent } : v
          )
        } : r
      )
    );
    ue.success("Post updated");
  };
  const approveReview = async (review) => {
    if (autoSchedule) {
      for (const variant of review.variants) {
        await createScheduledPost({
          tenantId: "tenant-1",
          content: variant.content,
          platforms: [variant.platform],
          scheduledAt: Date.now() + 36e5,
          status: "scheduled",
          niche: "plumbing",
          funnelStage: "mofu",
          marketingFramework: "cialdini_social_proof",
          ctaType: "booking",
          ctaUrl: "https://bookedrankedfunded.org/setup",
          contentCadence: 7,
          platformVariants: {},
          beforeAfterPhoto: null,
          tags: ["review", "social-proof"]
        });
      }
      ue.success("All 3 variants added to scheduler ✓");
    } else {
      setReadyQueue((prev) => [...prev, review.id]);
      ue.success("Moved to Ready Queue for manual scheduling");
    }
    setReviews(
      (prev) => prev.map((r) => r.id === review.id ? { ...r, status: "approved" } : r)
    );
  };
  const discardReview = (reviewId) => {
    setReviews(
      (prev) => prev.map((r) => r.id === reviewId ? { ...r, status: "discarded" } : r)
    );
    ue("Review discarded", { description: "Removed from queue" });
  };
  const approveBeforeAfter = async (pair) => {
    await createScheduledPost({
      tenantId: "tenant-1",
      content: pair.facebookCaption,
      platforms: ["facebook", "instagram", "linkedin"],
      scheduledAt: Date.now() + 72e5,
      status: "scheduled",
      niche: pair.nicheKey,
      funnelStage: "mofu",
      marketingFramework: "halbert_specificity",
      ctaType: "booking",
      ctaUrl: "https://bookedrankedfunded.org/setup",
      contentCadence: 7,
      platformVariants: {
        instagram: pair.instagramCaption,
        linkedin: pair.linkedinCaption
      },
      beforeAfterPhoto: null,
      tags: ["before-after", "results"]
    });
    setBeforeAfterPairs(
      (prev) => prev.map((b) => b.id === pair.id ? { ...b, status: "approved" } : b)
    );
    ue.success("Before/After posts scheduled across all 3 platforms ✓");
  };
  const approveTestimonial = async (t) => {
    await createScheduledPost({
      tenantId: "tenant-1",
      content: t.facebookVersion,
      platforms: ["facebook", "instagram", "linkedin"],
      scheduledAt: Date.now() + 108e5,
      status: "scheduled",
      niche: "plumbing",
      funnelStage: "bofu",
      marketingFramework: "cialdini_social_proof",
      ctaType: "booking",
      ctaUrl: "https://bookedrankedfunded.org/setup",
      contentCadence: 7,
      platformVariants: {
        instagram: t.instagramVersion,
        linkedin: t.linkedinVersion
      },
      beforeAfterPhoto: null,
      tags: ["testimonial", "social-proof"]
    });
    setTestimonials(
      (prev) => prev.map(
        (item) => item.id === t.id ? { ...item, status: "approved" } : item
      )
    );
    ue.success("Testimonial scheduled across all platforms ✓");
  };
  const simulateLead = (id, source) => {
    setTrackingLeads((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    ue.success(`Lead attributed to ${source} proof content`, {
      description: "Added to CRM → Social Media source"
    });
  };
  const pendingReviews = reviews.filter((r) => r.status === "pending");
  const pendingBA = beforeAfterPairs.filter((b) => b.status === "pending");
  const pendingTestimonials = testimonials.filter(
    (t) => t.status === "pending"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "social_proof_pipeline.page",
      className: "space-y-6 p-4 md:p-6 max-w-5xl mx-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "proof-pipeline-panel rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Social Proof Pipeline" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Turn 5-star reviews, before/afters, and testimonials into high-converting content — automatically. The Hormozi rule: proof converts better than any ad." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Auto-Schedule" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  "data-ocid": "social_proof_pipeline.auto_schedule.toggle",
                  checked: autoSchedule,
                  onCheckedChange: (val) => {
                    setAutoSchedule(val);
                    ue(
                      val ? "Auto-schedule enabled — approved content goes straight to the queue" : "Auto-schedule disabled — approved content waits for manual scheduling"
                    );
                  }
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5", children: [
            {
              label: "Reviews converted today",
              value: convertedToday,
              color: "text-emerald-400",
              ocid: "social_proof_pipeline.stat_reviews"
            },
            {
              label: "Posts in queue",
              value: totalApproved * 3,
              color: "text-purple-400",
              ocid: "social_proof_pipeline.stat_queue"
            },
            {
              label: "Leads from proof content",
              value: totalLeadsGenerated,
              color: "text-amber-400",
              ocid: "social_proof_pipeline.stat_leads"
            },
            {
              label: autoSchedule ? "Auto-schedule ON" : "Ready to schedule",
              value: autoSchedule ? "✓" : readyQueue.length,
              color: autoSchedule ? "text-emerald-400" : "text-amber-400",
              ocid: "social_proof_pipeline.stat_auto"
            }
          ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": stat.ocid,
              className: "bg-background/50 rounded-lg p-3 text-center border border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `text-2xl font-bold ${stat.color} leading-none mb-1`,
                    children: stat.value
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: stat.label })
              ]
            },
            stat.label
          )) }),
          !autoSchedule && readyQueue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "social_proof_pipeline.ready_queue",
              className: "mt-4 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-amber-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-300 font-medium", children: [
                    readyQueue.length,
                    " items waiting for manual scheduling"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs",
                    "data-ocid": "social_proof_pipeline.schedule_all_button",
                    onClick: () => {
                      setReadyQueue([]);
                      ue.success("All items scheduled");
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 mr-1.5" }),
                      "Schedule All"
                    ]
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "social_proof_pipeline.review_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-amber-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Review → Social Post" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                pendingReviews.length,
                " pending"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "text-muted-foreground text-xs gap-1.5",
                "data-ocid": "social_proof_pipeline.refresh_reviews_button",
                onClick: () => ue("Scanning for new 5-star reviews..."),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                  "Refresh"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: pendingReviews.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "social_proof_pipeline.reviews_empty_state",
              className: "text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "All reviews processed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "New 5-star reviews will appear here automatically" })
              ]
            }
          ) : pendingReviews.map((review, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              "data-ocid": `social_proof_pipeline.review_card.${idx + 1}`,
              className: "bg-card border-border review-to-post-card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: Array.from({ length: review.stars }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Star,
                      {
                        className: "h-4 w-4 fill-amber-400 text-amber-400"
                      },
                      `${review.id}-star-${i}`
                    )) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `social-platform-badge review-source-${review.source.toLowerCase()} text-xs`,
                        children: review.source
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: review.niche }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-auto", children: review.date })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground leading-relaxed", children: [
                    '"',
                    review.text,
                    '"'
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                    "— ",
                    review.reviewerName
                  ] })
                ] }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Generated Post Variants" }),
                  review.variants.map((variant, vIdx) => {
                    const editKey = `${review.id}-${variant.platform}`;
                    const isEditing = review.editing === variant.platform;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `social_proof_pipeline.variant.${idx + 1}.${vIdx + 1}`,
                        className: "bg-muted/20 rounded-lg border border-border p-3 space-y-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "span",
                                {
                                  className: `social-platform-badge platform-${variant.platform} flex items-center gap-1 text-xs`,
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformIcon, { platform: variant.platform }),
                                    variant.platform.charAt(0).toUpperCase() + variant.platform.slice(1)
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(QualityBadge, { score: variant.qualityScore })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Button,
                              {
                                size: "sm",
                                variant: "ghost",
                                className: "h-7 w-7 p-0 text-muted-foreground hover:text-foreground",
                                "data-ocid": `social_proof_pipeline.edit_variant.${idx + 1}.${vIdx + 1}`,
                                onClick: () => {
                                  if (isEditing)
                                    saveEdit(review.id, variant.platform);
                                  else
                                    startEditing(
                                      review.id,
                                      variant.platform,
                                      variant.content
                                    );
                                },
                                children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
                              }
                            )
                          ] }),
                          isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Textarea,
                            {
                              "data-ocid": `social_proof_pipeline.variant_textarea.${idx + 1}.${vIdx + 1}`,
                              value: editingContent[editKey] ?? variant.content,
                              onChange: (e) => setEditingContent((prev) => ({
                                ...prev,
                                [editKey]: e.target.value
                              })),
                              className: "text-xs leading-relaxed min-h-[100px] bg-background border-border resize-none"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed whitespace-pre-line", children: variant.content })
                        ]
                      },
                      variant.platform
                    );
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        className: "flex-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs h-9",
                        variant: "outline",
                        "data-ocid": `social_proof_pipeline.approve_review.${idx + 1}`,
                        onClick: () => approveReview(review),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 mr-1.5" }),
                          autoSchedule ? "Approve & Schedule All 3" : "Approve for Queue"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        className: "border-rose-500/30 text-rose-400 hover:bg-rose-500/15 text-xs h-9 px-3",
                        "data-ocid": `social_proof_pipeline.discard_review.${idx + 1}`,
                        onClick: () => discardReview(review.id),
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] })
                ] })
              ]
            },
            review.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "social_proof_pipeline.before_after_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5 text-blue-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Before/After Automation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
              pendingBA.length,
              " ready"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-xl p-4 mb-4 border",
              style: {
                background: "oklch(0.58 0.22 290 / 6%)",
                borderColor: "oklch(0.58 0.22 290 / 20%)"
              },
              "data-ocid": "social_proof_pipeline.ba_niche_explainer",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Niche-specific before/after frameworks built in" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: "BRF has pre-built before/after story frameworks for all 10 niches — Plumbing, HVAC, Med Spa, Restoration, Carpet Cleaning, Roofing, Real Estate, Mortgage, Chiropractic, and Dental. Each template uses Halbert's specificity framework: real numbers, real timelines, real outcomes. Proof that converts." })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "social_proof_pipeline.photo_upload",
              className: "photo-upload-area rounded-xl flex flex-col items-center justify-center py-8 px-4 mb-4 w-full text-center",
              onClick: () => ue("Photo upload", {
                description: "Connect the object-storage extension to enable real photo uploads."
              }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-8 w-8 mb-2 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground", children: "Upload Before/After Photos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 text-center max-w-xs", children: "Connect the photo storage module to enable uploads. AI will auto-generate Halbert-framework captions with location tag and CTA." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "mt-3 text-xs gap-1.5",
                    "data-ocid": "social_proof_pipeline.connect_photos_button",
                    onClick: (e) => {
                      e.stopPropagation();
                      ue(
                        "Object-storage extension required for real photo uploads."
                      );
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }),
                      "Connect Photos"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: pendingBA.map((pair, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              "data-ocid": `social_proof_pipeline.before_after_card.${idx + 1}`,
              className: "bg-card border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: pair.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: pair.niche }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(QualityBadge, { score: pair.qualityScore })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "📍 ",
                    pair.location
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
                  [
                    {
                      platform: "instagram",
                      content: pair.instagramCaption,
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-3.5 w-3.5 text-amber-400" }),
                      label: "Instagram"
                    },
                    {
                      platform: "facebook",
                      content: pair.facebookCaption,
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5 text-blue-400" }),
                      label: "Facebook"
                    },
                    {
                      platform: "linkedin",
                      content: pair.linkedinCaption,
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-3.5 w-3.5 text-sky-400" }),
                      label: "LinkedIn"
                    }
                  ].map(({ icon, label, content }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "bg-muted/20 rounded-lg border border-border p-3",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                          icon,
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: label })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed whitespace-pre-line line-clamp-4", children: content })
                      ]
                    },
                    label
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        className: "flex-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs h-9",
                        variant: "outline",
                        "data-ocid": `social_proof_pipeline.approve_before_after.${idx + 1}`,
                        onClick: () => approveBeforeAfter(pair),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 mr-1.5" }),
                          "Approve & Schedule (All 3 Platforms)"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        className: "text-xs text-amber-400 hover:bg-amber-500/10 h-9 px-3",
                        "data-ocid": `social_proof_pipeline.track_lead.${idx + 1}`,
                        onClick: () => simulateLead(pair.id, pair.niche),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 mr-1" }),
                          "+Lead (",
                          trackingLeads[pair.id] ?? 0,
                          ")"
                        ]
                      }
                    )
                  ] })
                ] })
              ]
            },
            pair.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "social_proof_pipeline.testimonials_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5 text-purple-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Testimonial Auto-Formatter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
              pendingTestimonials.length,
              " ready"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            pendingTestimonials.map((testimonial, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                "data-ocid": `social_proof_pipeline.testimonial_card.${idx + 1}`,
                className: "bg-card border-border",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: testimonial.clientName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: testimonial.businessType })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "badge-purple text-xs", children: "CRM Client" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/20 rounded-lg p-3 mt-2 border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground italic leading-relaxed", children: [
                      '"',
                      testimonial.originalText,
                      '"'
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Platform-Optimized Versions" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `social_proof_pipeline.testimonial_instagram.${idx + 1}`,
                        className: "bg-muted/20 rounded-lg border border-border p-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "social-platform-badge platform-instagram flex items-center gap-1 text-xs", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-3 w-3" }),
                              "Instagram"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-auto", children: "max 300 chars • 15 hashtags" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed whitespace-pre-line", children: testimonial.instagramVersion })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `social_proof_pipeline.testimonial_facebook.${idx + 1}`,
                        className: "bg-muted/20 rounded-lg border border-border p-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "social-platform-badge platform-facebook flex items-center gap-1 text-xs", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3 w-3" }),
                              "Facebook"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-auto", children: "story hook • CTA question" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed whitespace-pre-line", children: testimonial.facebookVersion })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `social_proof_pipeline.testimonial_linkedin.${idx + 1}`,
                        className: "bg-muted/20 rounded-lg border border-border p-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-blue flex items-center gap-1 rounded text-xs px-2 py-0.5 font-semibold", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-3 w-3" }),
                              "LinkedIn"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-auto", children: "thought leadership • minimal emoji" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed whitespace-pre-line", children: testimonial.linkedinVersion })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          className: "flex-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs h-9",
                          variant: "outline",
                          "data-ocid": `social_proof_pipeline.approve_testimonial.${idx + 1}`,
                          onClick: () => approveTestimonial(testimonial),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 mr-1.5" }),
                            "Approve for Instagram + Facebook + LinkedIn"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "sm",
                          variant: "ghost",
                          className: "text-xs text-amber-400 hover:bg-amber-500/10 h-9 px-3",
                          "data-ocid": `social_proof_pipeline.track_testimonial_lead.${idx + 1}`,
                          onClick: () => simulateLead(testimonial.id, testimonial.businessType),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 mr-1" }),
                            "+Lead (",
                            trackingLeads[testimonial.id] ?? 0,
                            ")"
                          ]
                        }
                      )
                    ] })
                  ] })
                ]
              },
              testimonial.id
            )),
            pendingTestimonials.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "social_proof_pipeline.testimonials_empty_state",
                className: "text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "All testimonials processed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "New CRM testimonials will appear here automatically" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": "social_proof_pipeline.schedule_info",
            className: "bg-card border-border",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary/15 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: autoSchedule ? "Auto-Schedule: Enabled" : "Manual Schedule Mode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: autoSchedule ? "All approved proof content is automatically added to your scheduler queue. Posts are distributed across your content calendar at optimal times." : "Approved content waits in the Ready Queue for manual scheduling. Toggle Auto-Schedule to send content directly to the calendar." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  className: "text-xs text-muted-foreground gap-1 shrink-0",
                  "data-ocid": "social_proof_pipeline.view_scheduler_button",
                  onClick: () => ue("Opening Multi-Platform Scheduler..."),
                  children: [
                    "View Scheduler",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" })
                  ]
                }
              )
            ] }) })
          }
        )
      ]
    }
  );
}
export {
  SocialProofPipelinePage as default
};
