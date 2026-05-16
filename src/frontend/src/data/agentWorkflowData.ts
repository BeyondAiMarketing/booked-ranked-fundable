import type {
  AgentArtifact,
  AgentMemory,
  AgentRun,
  AgentTemplateRecord,
  AgentThread,
  ApprovalItem,
  ProviderAdapterConfig,
  ToolDefinition,
} from "../types/agentWorkflow";

// ─── Threads ─────────────────────────────────────────────────────────────────

export const DEMO_THREADS: AgentThread[] = [
  // North County Plumbing Pros
  {
    id: "thread-plumbing-seo",
    tenantId: "tenant-plumbing",
    agentType: "SEO & GEO Agent",
    title: "Local SEO & GEO Visibility — North County Plumbing",
    status: "active",
    messageCount: 18,
    summary:
      "SEO score improved from 62 to 71 over 6 weeks. GBP categories updated, 8 citations built, technical crawl errors resolved. Priority: FAQ content and GEO content briefs.",
    agentNotes:
      "Client prefers weekly updates. Focus on emergency plumbing keywords for peak season.",
    createdAt: Date.now() - 45 * 86400000,
    updatedAt: Date.now() - 2 * 3600000,
  },
  {
    id: "thread-plumbing-sales",
    tenantId: "tenant-plumbing",
    agentType: "Sales Agent",
    title: "Lead Qualification & Follow-Up — Plumbing",
    status: "active",
    messageCount: 34,
    summary:
      "12 leads qualified this month, 8 converted to estimates. Follow-up sequence running for 4 cold leads. Average response time: 4 minutes.",
    agentNotes:
      "Emergency plumbing leads convert at 2x rate when called within 5 min.",
    createdAt: Date.now() - 30 * 86400000,
    updatedAt: Date.now() - 1 * 3600000,
  },
  {
    id: "thread-plumbing-ops",
    tenantId: "tenant-plumbing",
    agentType: "Ops Agent",
    title: "Operations & Review Management",
    status: "active",
    messageCount: 11,
    summary:
      "Automated review request flow active. 5 review requests sent post-job, 3 reviews collected this week. Uptime monitoring all green.",
    agentNotes: "Review request timing: 2 hrs after job completion works best.",
    createdAt: Date.now() - 20 * 86400000,
    updatedAt: Date.now() - 6 * 3600000,
  },
  // Oceanside Clean & Restore
  {
    id: "thread-restoration-seo",
    tenantId: "tenant-oceanside",
    agentType: "SEO & GEO Agent",
    title: "Restoration SEO — Oceanside Clean & Restore",
    status: "active",
    messageCount: 22,
    summary:
      "Website audit complete. Page speed improved from 42 to 67. 3 service area pages created. Water damage keywords ranking on page 2.",
    agentNotes:
      "Focus on storm season content for Q4. Insurance keywords are high-value.",
    createdAt: Date.now() - 60 * 86400000,
    updatedAt: Date.now() - 4 * 3600000,
  },
  {
    id: "thread-restoration-content",
    tenantId: "tenant-oceanside",
    agentType: "Content Agent",
    title: "Content Strategy & Page Updates",
    status: "paused",
    messageCount: 9,
    summary:
      "Homepage copy refreshed. Service page intros rewritten for 4 pages. Content calendar through Q1 drafted.",
    agentNotes: "Waiting on client photos before publishing service pages.",
    createdAt: Date.now() - 25 * 86400000,
    updatedAt: Date.now() - 48 * 3600000,
  },
  // Med Spa Demo
  {
    id: "thread-medspa-sales",
    tenantId: "tenant-medspa",
    agentType: "Sales Agent",
    title: "Consultation Booking Nurture — Med Spa",
    status: "active",
    messageCount: 27,
    summary:
      "Consultation booking rate improved 23% this month. No-show recovery sequence re-engaging 4 past inquiries. Membership upsell triggered for 2 clients.",
    agentNotes:
      "Botox and Hydrafacial inquiries convert highest. Prioritize these.",
    createdAt: Date.now() - 35 * 86400000,
    updatedAt: Date.now() - 30 * 60000,
  },
  {
    id: "thread-medspa-seo",
    tenantId: "tenant-medspa",
    agentType: "SEO & GEO Agent",
    title: "Med Spa Local SEO & Reputation",
    status: "active",
    messageCount: 15,
    summary:
      "GBP fully optimized. 4.9★ average with 38 reviews. Local ranking position 1 for 'med spa near me'. AI search visibility score: 74.",
    agentNotes:
      "Keep review velocity above 4/month. GEO content for 'best injectables' queries.",
    createdAt: Date.now() - 40 * 86400000,
    updatedAt: Date.now() - 8 * 3600000,
  },
];

// ─── Runs ─────────────────────────────────────────────────────────────────────

export const DEMO_RUNS: AgentRun[] = [
  {
    id: "run-001",
    threadId: "thread-plumbing-seo",
    tenantId: "tenant-plumbing",
    agentType: "SEO & GEO Agent",
    status: "completed",
    inputPrompt:
      "Analyze the current GBP profile and identify the top 5 missing optimizations.",
    outputText:
      "GBP Analysis complete for North County Plumbing Pros. Found 5 critical gaps: (1) Missing service descriptions for 4 core services — add 150-300 word descriptions for drain cleaning, water heater repair, leak detection, and sewer repair. (2) Only 3 photos uploaded — target 15+ for top-tier visibility. (3) Q&A section empty — seed with 6 FAQs. (4) No posts in 45 days — set weekly posting schedule. (5) Service area not fully defined — add 8 surrounding cities.",
    errorMessage: "",
    artifactIds: ["artifact-001"],
    workflowStepIndex: 3,
    approvalRequired: false,
    approvalStatus: null,
    startedAt: Date.now() - 3 * 86400000,
    endedAt: Date.now() - 3 * 86400000 + 45000,
    metadata: { model: "native", tokens: "412" },
  },
  {
    id: "run-002",
    threadId: "thread-plumbing-seo",
    tenantId: "tenant-plumbing",
    agentType: "SEO & GEO Agent",
    status: "completed",
    inputPrompt:
      "Generate FAQ content block for the homepage targeting GEO search visibility.",
    outputText:
      "FAQ content block generated. 8 questions optimized for answer-engine discovery: 'How quickly can a plumber come to my house?', 'What causes low water pressure?', 'How do I know if I have a slab leak?', 'What's the average cost to replace a water heater?', 'Can a plumber fix a toilet the same day?', 'What should I do if a pipe bursts?', 'How often should drains be cleaned?', 'Is it safe to use drain cleaner?'. Each answer is 60-100 words, structured for featured snippets.",
    errorMessage: "",
    artifactIds: ["artifact-004"],
    workflowStepIndex: 2,
    approvalRequired: false,
    approvalStatus: null,
    startedAt: Date.now() - 1 * 86400000,
    endedAt: Date.now() - 1 * 86400000 + 38000,
    metadata: { model: "native", tokens: "548" },
  },
  {
    id: "run-003",
    threadId: "thread-restoration-seo",
    tenantId: "tenant-oceanside",
    agentType: "SEO & GEO Agent",
    status: "paused_for_approval",
    inputPrompt:
      "Publish 3 new service area landing pages to the website CMS — Carlsbad, Vista, and Escondido.",
    outputText:
      "3 service area page drafts completed. Each page includes: localized H1, service overview, local landmarks/addresses, FAQ block, emergency CTA, and schema markup. Ready to publish. Awaiting admin approval before pushing live.",
    errorMessage: "",
    artifactIds: ["artifact-002"],
    workflowStepIndex: 2,
    approvalRequired: true,
    approvalStatus: "pending",
    startedAt: Date.now() - 2 * 3600000,
    endedAt: null,
    metadata: { model: "native", pagesReady: "3" },
  },
  {
    id: "run-004",
    threadId: "thread-medspa-sales",
    tenantId: "tenant-medspa",
    agentType: "Sales Agent",
    status: "completed",
    inputPrompt:
      "Generate a 5-step follow-up sequence for consultation no-shows from the past 30 days.",
    outputText:
      "5-email follow-up sequence generated for 4 no-show contacts. Sequence: Day 1 — gentle check-in ('We missed you'), Day 3 — social proof email (patient transformation stories), Day 7 — limited-time offer (10% off first treatment), Day 14 — 'Last chance' urgency email, Day 30 — long-term nurture (seasonal promotion). All emails personalized with first name and treatment interest.",
    errorMessage: "",
    artifactIds: ["artifact-003"],
    workflowStepIndex: 5,
    approvalRequired: false,
    approvalStatus: null,
    startedAt: Date.now() - 6 * 3600000,
    endedAt: Date.now() - 6 * 3600000 + 29000,
    metadata: { model: "native", contacts: "4" },
  },
  {
    id: "run-005",
    threadId: "thread-plumbing-sales",
    tenantId: "tenant-plumbing",
    agentType: "Sales Agent",
    status: "failed",
    inputPrompt:
      "Pull last 30 days of lead records and generate a conversion rate report.",
    outputText: "",
    errorMessage:
      "CRM lookup tool returned empty dataset. Possible cause: tenant data not yet seeded for reporting period. Retry after 24 hours or manually trigger data sync.",
    artifactIds: [],
    workflowStepIndex: 1,
    approvalRequired: false,
    approvalStatus: null,
    startedAt: Date.now() - 12 * 3600000,
    endedAt: Date.now() - 12 * 3600000 + 3000,
    metadata: { model: "native", error_code: "CRM_EMPTY" },
  },
  {
    id: "run-006",
    threadId: "thread-plumbing-ops",
    tenantId: "tenant-plumbing",
    agentType: "Ops Agent",
    status: "running",
    inputPrompt:
      "Send review request SMS to the 3 jobs completed today and log responses.",
    outputText: "",
    errorMessage: "",
    artifactIds: [],
    workflowStepIndex: 1,
    approvalRequired: false,
    approvalStatus: null,
    startedAt: Date.now() - 5 * 60000,
    endedAt: null,
    metadata: { model: "native", contacts_queued: "3" },
  },
  {
    id: "run-007",
    threadId: "thread-medspa-seo",
    tenantId: "tenant-medspa",
    agentType: "SEO & GEO Agent",
    status: "paused_for_approval",
    inputPrompt:
      "Draft and queue 4 Google Business Profile posts for the next 30 days.",
    outputText:
      "4 GBP post drafts ready for review: (1) Spring Glow promotion — Hydrafacial + LED combo, (2) Mother's Day gift guide with booking CTA, (3) Before/After patient results (Botox), (4) Educational post on Lip Filler safety. All posts include keyword-rich copy and CTA links. Awaiting approval before scheduling.",
    errorMessage: "",
    artifactIds: [],
    workflowStepIndex: 2,
    approvalRequired: true,
    approvalStatus: "pending",
    startedAt: Date.now() - 1 * 3600000,
    endedAt: null,
    metadata: { model: "native", posts_ready: "4" },
  },
];

// ─── Artifacts ────────────────────────────────────────────────────────────────

export const DEMO_ARTIFACTS: AgentArtifact[] = [
  {
    id: "artifact-001",
    runId: "run-001",
    threadId: "thread-plumbing-seo",
    tenantId: "tenant-plumbing",
    artifactType: "seo_action_plan",
    title: "GBP Optimization Plan — North County Plumbing",
    content: `# GBP Optimization Action Plan
## North County Plumbing Pros — Q2 Priority Actions

### Top 5 GBP Improvements (Ranked by Impact)

**1. Service Descriptions** (Est. +8 ranking points)
- Drain Cleaning: Add 200-word description covering root removal, hydro-jetting, preventive maintenance
- Water Heater Repair: Emphasize same-day service, all brands serviced, warranty info
- Leak Detection: Highlight non-invasive technology, insurance documentation support
- Sewer Repair: Focus on trenchless options, video inspection included

**2. Photo Gallery** (Est. +5 ranking points)
- Upload: team photo, 3 job site before/afters, truck wrap, office/contact info card
- Target: 15+ total photos within 30 days

**3. Q&A Seed Content** (GEO visibility boost)
- Pre-seed 6 FAQs with keyword-rich answers
- Example: "How fast can you respond to an emergency?" → "We offer 24/7 emergency service with typical response times of 45-90 minutes in San Diego County."

**4. Weekly GBP Posts**
- Schedule: Every Tuesday at 10am
- Content mix: tips (40%), offers (30%), news (30%)

**5. Service Area Expansion**
- Add: Carlsbad, Vista, Escondido, San Marcos, Oceanside, Poway
- Removes 6 missed ranking opportunities in surrounding areas`,
    tags: ["gbp", "local-seo", "plumbing"],
    status: "final",
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now() - 3 * 86400000,
  },
  {
    id: "artifact-002",
    runId: "run-003",
    threadId: "thread-restoration-seo",
    tenantId: "tenant-oceanside",
    artifactType: "proposal",
    title: "Service Area Expansion — 12-Week SEO Roadmap",
    content: `# 12-Week SEO & GEO Improvement Roadmap
## Oceanside Clean & Restore

### Executive Summary
This roadmap outlines a 12-week phased SEO and GEO improvement plan to expand local search visibility across North San Diego County, with a focus on water damage restoration and emergency response keywords.

### Phase 1 — Foundation (Weeks 1–4)
- [ ] Technical audit and fix: page speed, mobile usability, crawl errors
- [ ] GBP complete optimization: all categories, services, Q&A, photos
- [ ] NAP consistency audit: align across 15 major directories
- [ ] Schema markup: LocalBusiness, Service, FAQ schema on all key pages

### Phase 2 — Content & Local Pages (Weeks 5–8)
- [ ] 3 service area landing pages: Carlsbad, Vista, Escondido
- [ ] Homepage content refresh: GEO-optimized FAQ section
- [ ] Blog content: "What to Do After Water Damage" (1,200-word guide)
- [ ] GBP posts: 4 posts/month scheduled through Q3

### Phase 3 — Authority & Visibility (Weeks 9–12)
- [ ] Citation building: 20 high-DA local directories
- [ ] Review velocity: re-activate review request automation
- [ ] GEO content: answer-engine FAQ blocks on 3 service pages
- [ ] Performance report: full scorecard comparison with baseline

### Expected Outcomes
- SEO Score: 62 → 78+ (within 90 days)
- Local ranking: page 2 → page 1 for 'water damage restoration San Diego'
- GEO visibility: 45 → 65+ AI search readiness score`,
    tags: ["seo-roadmap", "restoration", "content"],
    status: "draft",
    createdAt: Date.now() - 2 * 3600000,
    updatedAt: Date.now() - 2 * 3600000,
  },
  {
    id: "artifact-003",
    runId: "run-004",
    threadId: "thread-medspa-sales",
    tenantId: "tenant-medspa",
    artifactType: "follow_up_sequence",
    title: "No-Show Recovery — 5-Email Sequence",
    content: `# No-Show Recovery Email Sequence
## Med Spa Consultation — 5-Step Follow-Up

---

### Email 1 — Day 1: Gentle Check-In
**Subject:** We missed you today, {{first_name}}
**Body:** Hi {{first_name}}, we noticed you weren't able to make it to your consultation today. Life happens — we'd love to reschedule at a time that works better for you. Our calendar is open: [BOOKING LINK]

---

### Email 2 — Day 3: Social Proof
**Subject:** What our clients say about their first visit...
**Body:** Hi {{first_name}}, before you decide if {{treatment_interest}} is right for you, here's what clients say after their first treatment... [2-3 short testimonials] Ready to experience it? [BOOK NOW]

---

### Email 3 — Day 7: Limited Offer
**Subject:** 10% off your first treatment — this week only
**Body:** Hi {{first_name}}, we're extending a one-time welcome offer: 10% off your first {{treatment_interest}} session. Use code WELCOME10 at booking. Offer expires [DATE+7]. [CLAIM OFFER]

---

### Email 4 — Day 14: Last Chance
**Subject:** {{first_name}}, your offer expires tomorrow
**Body:** Hi {{first_name}}, just a quick reminder that your 10% welcome offer expires tomorrow. We have a few openings this week — want to grab one? [VIEW AVAILABILITY]

---

### Email 5 — Day 30: Long-Term Nurture
**Subject:** Spring is the perfect time for a refresh, {{first_name}}
**Body:** Hi {{first_name}}, with spring here, we're seeing a lot of clients starting their transformation journeys. Whether it's Botox, Hydrafacial, or a full consultation, we're here when you're ready. [LEARN MORE]`,
    tags: ["email-sequence", "medspa", "follow-up"],
    status: "final",
    createdAt: Date.now() - 6 * 3600000,
    updatedAt: Date.now() - 6 * 3600000,
  },
  {
    id: "artifact-004",
    runId: "run-002",
    threadId: "thread-plumbing-seo",
    tenantId: "tenant-plumbing",
    artifactType: "content_package",
    title: "GEO FAQ Content Block — Plumbing Homepage",
    content: `# GEO-Optimized FAQ Content Block
## North County Plumbing Pros — Homepage FAQ

**Designed for:** Answer-engine discovery, Google's "People Also Ask", voice search

---

**Q: How quickly can a plumber come to my house?**
A: For emergency plumbing in San Diego County, North County Plumbing Pros typically arrives within 45–90 minutes, 24 hours a day, 7 days a week — including holidays.

**Q: What causes low water pressure in my home?**
A: Low water pressure is usually caused by a partially closed shutoff valve, mineral buildup in pipes, a faulty pressure regulator, or a hidden leak. A licensed plumber can diagnose the cause in one visit.

**Q: How do I know if I have a slab leak?**
A: Warning signs include unexpectedly high water bills, warm spots on your floor, the sound of running water when no fixtures are on, or cracks in flooring. If you notice any of these, call immediately — slab leaks worsen quickly.

**Q: What's the average cost to replace a water heater?**
A: Water heater replacement in San Diego typically costs $900–$1,800 for a standard tank unit, or $1,500–$3,000 for tankless. The final price depends on the unit size, fuel type, and any required code upgrades.

**Q: Can a plumber fix a toilet the same day?**
A: Yes. Most toilet repairs — running, clogged, rocking, or leaking — can be completed in a single same-day visit. We carry standard replacement parts on every service truck.

**Q: What should I do if a pipe bursts?**
A: Shut off your main water supply immediately (usually near the water meter or where the main line enters the house), then call an emergency plumber. Don't use electrical appliances near standing water.

**Q: How often should drains be professionally cleaned?**
A: For most homes, professional drain cleaning every 1–2 years prevents buildup and reduces emergency calls. Homes with older pipes, large trees nearby, or frequent clogs benefit from annual service.

**Q: Is it safe to use store-bought drain cleaner?**
A: Chemical drain cleaners can damage pipes — especially older PVC or copper lines — and are only a temporary fix. For recurring clogs, professional hydro-jetting is safer and more effective long-term.`,
    tags: ["faq", "geo", "homepage", "plumbing"],
    status: "final",
    createdAt: Date.now() - 1 * 86400000,
    updatedAt: Date.now() - 1 * 86400000,
  },
  {
    id: "artifact-005",
    runId: "run-001",
    threadId: "thread-plumbing-sales",
    tenantId: "tenant-plumbing",
    artifactType: "lead_summary",
    title: "Lead Summary — John Smith, Emergency Repair",
    content: `# Lead Summary
## Contact: John Smith
**Date Qualified:** March 15, 2026 — 8:04 AM
**Source:** Chat Widget — Website

### Contact Information
- **Name:** John Smith
- **Phone:** (760) 555-0192
- **Email:** jsmith@email.com
- **Address:** 1842 Magnolia Ave, Vista, CA 92083

### Service Request Details
- **Issue Type:** Emergency — Burst pipe under kitchen sink
- **Urgency:** Immediate (active water leak)
- **Location in Home:** Kitchen, under sink
- **Has Water Shutoff Access:** Yes (confirmed)
- **Last Known Issue:** First time

### Appointment Preference
- **Preferred Date:** Same day — March 15
- **Preferred Time:** Morning (8am–12pm)
- **Confirmed Appointment:** 9:30 AM

### Qualification Score: HIGH PRIORITY
- Emergency situation: ✅
- Willing to pay: confirmed interest in "getting it fixed today"
- Has homeowner authority: ✅
- Service area: ✅ (Vista, CA)

### Recommended Next Action
Call within 5 minutes. Lead confirmed emergency availability. Truck #3 is closest (Oceanside, 12 min away).`,
    tags: ["lead", "emergency", "plumbing", "high-priority"],
    status: "final",
    createdAt: Date.now() - 5 * 86400000,
    updatedAt: Date.now() - 5 * 86400000,
  },
  {
    id: "artifact-006",
    runId: "run-004",
    threadId: "thread-restoration-seo",
    tenantId: "tenant-oceanside",
    artifactType: "recommendation_set",
    title: "Technical SEO Recommendations — Oceanside Restore",
    content: `# Technical SEO Recommendations
## Oceanside Clean & Restore — Audit Date: April 2026

### Priority 1 — Critical (Fix Within 7 Days)
1. **Page Speed** — Mobile load time is 6.2 seconds (target: <3s). Compress 4 large hero images, enable lazy loading, and remove render-blocking JavaScript.
2. **Missing Meta Descriptions** — 8 service pages have no meta description. These control what shows in search results and directly impact CTR.
3. **Broken Internal Links** — 3 links pointing to 404 pages. Fix or redirect immediately.

### Priority 2 — High Impact (Fix Within 30 Days)
4. **Thin Content** — 4 service pages under 300 words. Expand to 600+ with local detail, FAQs, and service specifics.
5. **No Schema Markup** — Add LocalBusiness, Service, and FAQ schema to all key pages.
6. **GBP Not Linked** — Website URL on GBP doesn't match canonical URL. Fix consistency.

### Priority 3 — Growth Opportunities (Next 60 Days)
7. **No FAQ Section on Homepage** — Add 6 FAQs targeting 'water damage restoration near me' and related queries.
8. **Image Alt Tags** — 23 images missing alt text. Add descriptive, keyword-relevant alt text.
9. **Internal Linking** — Service pages don't link to each other. Build a logical internal linking structure.

### Projected Impact
- Technical score: 48 → 72 within 45 days
- Expected ranking improvement: 1–3 positions for primary keywords
- Estimated additional monthly traffic: 80–140 visits`,
    tags: ["technical-seo", "restoration", "audit"],
    status: "final",
    createdAt: Date.now() - 4 * 86400000,
    updatedAt: Date.now() - 4 * 86400000,
  },
];

// ─── Templates ────────────────────────────────────────────────────────────────

export const DEMO_TEMPLATES: AgentTemplateRecord[] = [
  {
    id: "tmpl-sales",
    tenantId: "system",
    name: "Sales Agent",
    role: "sales",
    systemPrompt:
      "You are an expert sales agent for local service businesses. Your role is to qualify leads, generate follow-up sequences, score lead quality, and help convert inquiries into booked appointments. Always prioritize speed-to-lead — response time is the #1 factor in conversion. Use a warm, professional tone that builds trust without pressure.",
    allowedTools: [
      "crm_lookup",
      "lead_update",
      "lead_create",
      "follow_up_schedule",
      "notify_team",
    ],
    memoryMode: "with_summary",
    approvalRequired: false,
    defaultWorkflowSteps: [
      "Lead intake",
      "Qualification scoring",
      "CRM update",
      "Follow-up schedule",
    ],
    isDefault: true,
    createdAt: Date.now() - 90 * 86400000,
  },
  {
    id: "tmpl-support",
    tenantId: "system",
    name: "Support Agent",
    role: "support",
    systemPrompt:
      "You are a professional customer support agent for local service businesses. Handle customer inquiries, resolve complaints, manage scheduling issues, and escalate when needed. Always de-escalate first. Provide clear, actionable next steps in every response. Log all resolutions as structured artifacts.",
    allowedTools: [
      "crm_lookup",
      "notify_team",
      "form_process",
      "analytics_lookup",
    ],
    memoryMode: "conversation_only",
    approvalRequired: false,
    defaultWorkflowSteps: [
      "Issue intake",
      "Context lookup",
      "Resolution draft",
      "Confirmation",
    ],
    isDefault: true,
    createdAt: Date.now() - 90 * 86400000,
  },
  {
    id: "tmpl-seo",
    tenantId: "system",
    name: "SEO & GEO Agent",
    role: "seo",
    systemPrompt:
      "You are an expert SEO and Generative Engine Optimization (GEO) agent for local service businesses. Analyze technical health, local signals, GBP completeness, content quality, and AI search readiness. Generate actionable recommendations, content briefs, and structured improvement plans. Always tie recommendations to ranking impact and lead generation outcomes.",
    allowedTools: [
      "analytics_lookup",
      "content_generate",
      "notify_team",
      "form_process",
    ],
    memoryMode: "with_notes",
    approvalRequired: true,
    defaultWorkflowSteps: [
      "Audit analysis",
      "Issue detection",
      "Opportunity identification",
      "Content generation",
      "Admin approval",
      "Delivery",
    ],
    isDefault: true,
    createdAt: Date.now() - 90 * 86400000,
  },
  {
    id: "tmpl-content",
    tenantId: "system",
    name: "Content Agent",
    role: "content",
    systemPrompt:
      "You are a professional content strategist and writer for local service businesses. Create SEO-optimized, GEO-ready content including homepage copy, service pages, blog posts, FAQ blocks, email sequences, and ad copy. Always write in the voice of the business — authoritative, helpful, and locally relevant. Avoid generic language.",
    allowedTools: ["content_generate", "analytics_lookup", "notify_team"],
    memoryMode: "with_summary",
    approvalRequired: true,
    defaultWorkflowSteps: [
      "Brief intake",
      "Research",
      "Draft generation",
      "Review",
      "Approval",
      "Delivery",
    ],
    isDefault: true,
    createdAt: Date.now() - 90 * 86400000,
  },
  {
    id: "tmpl-ops",
    tenantId: "system",
    name: "Ops Agent",
    role: "ops",
    systemPrompt:
      "You are an operations agent for local service businesses. Monitor uptime, track review velocity, trigger automations (review requests, follow-ups, notifications), and surface operational alerts. Prioritize actions that prevent revenue leakage — missed reviews, unanswered leads, and service gaps.",
    allowedTools: [
      "crm_lookup",
      "notify_team",
      "analytics_lookup",
      "follow_up_schedule",
    ],
    memoryMode: "conversation_only",
    approvalRequired: false,
    defaultWorkflowSteps: ["Monitor", "Alert", "Automate", "Report"],
    isDefault: true,
    createdAt: Date.now() - 90 * 86400000,
  },
  {
    id: "tmpl-followup",
    tenantId: "system",
    name: "Follow-Up Agent",
    role: "follow_up",
    systemPrompt:
      "You are a follow-up specialist agent for local service businesses. Your job is to design, sequence, and activate re-engagement campaigns for cold leads, past customers, no-shows, and incomplete bookings. Use behavioral triggers to determine timing. All sequences must feel personal — never templated or robotic.",
    allowedTools: [
      "crm_lookup",
      "follow_up_schedule",
      "content_generate",
      "notify_team",
    ],
    memoryMode: "with_summary",
    approvalRequired: false,
    defaultWorkflowSteps: [
      "Segment selection",
      "Sequence design",
      "Personalization",
      "Activation",
      "Tracking",
    ],
    isDefault: true,
    createdAt: Date.now() - 90 * 86400000,
  },
];

// ─── Tools ────────────────────────────────────────────────────────────────────

export const DEMO_TOOLS: ToolDefinition[] = [
  {
    id: "tool-crm-lookup",
    name: "crm_lookup",
    description: "Look up contact, lead, or customer records from the CRM.",
    category: "crm",
    schema: { contactId: "string", query: "string", limit: "number" },
    permissions: ["read_leads", "read_contacts"],
    requiresApproval: false,
    tenantScoped: true,
    isEnabled: true,
  },
  {
    id: "tool-lead-update",
    name: "lead_update",
    description: "Update a lead record status, stage, or notes in the CRM.",
    category: "crm",
    schema: { leadId: "string", status: "string", notes: "string" },
    permissions: ["write_leads"],
    requiresApproval: false,
    tenantScoped: true,
    isEnabled: true,
  },
  {
    id: "tool-lead-create",
    name: "lead_create",
    description: "Create a new lead record from qualified contact information.",
    category: "crm",
    schema: {
      name: "string",
      phone: "string",
      email: "string",
      serviceType: "string",
      urgency: "string",
    },
    permissions: ["write_leads"],
    requiresApproval: false,
    tenantScoped: true,
    isEnabled: true,
  },
  {
    id: "tool-content-generate",
    name: "content_generate",
    description:
      "Generate structured content: FAQ blocks, service descriptions, email copy, ad copy, page outlines.",
    category: "content",
    schema: {
      contentType: "string",
      niche: "string",
      topic: "string",
      tone: "string",
      wordCount: "number",
    },
    permissions: ["generate_content"],
    requiresApproval: true,
    tenantScoped: true,
    isEnabled: true,
  },
  {
    id: "tool-notify-team",
    name: "notify_team",
    description:
      "Send a notification to the admin team via the notification center.",
    category: "notification",
    schema: {
      title: "string",
      message: "string",
      priority: "string",
      assignee: "string",
    },
    permissions: ["send_notifications"],
    requiresApproval: false,
    tenantScoped: true,
    isEnabled: true,
  },
  {
    id: "tool-form-process",
    name: "form_process",
    description:
      "Process and validate form submissions from chat widget, free audit, or contact forms.",
    category: "crm",
    schema: { formId: "string", fields: "object", source: "string" },
    permissions: ["read_forms", "write_leads"],
    requiresApproval: false,
    tenantScoped: true,
    isEnabled: true,
  },
  {
    id: "tool-analytics-lookup",
    name: "analytics_lookup",
    description:
      "Retrieve analytics data: audit scores, traffic trends, lead sources, review velocity.",
    category: "analytics",
    schema: { metric: "string", period: "string", tenantId: "string" },
    permissions: ["read_analytics"],
    requiresApproval: false,
    tenantScoped: true,
    isEnabled: true,
  },
  {
    id: "tool-pricing-lookup",
    name: "pricing_lookup",
    description:
      "Look up service pricing, agent product prices, and available packages.",
    category: "pricing",
    schema: { productId: "string", tenantId: "string" },
    permissions: ["read_pricing"],
    requiresApproval: false,
    tenantScoped: false,
    isEnabled: true,
  },
  {
    id: "tool-proposal-generate",
    name: "proposal_generate",
    description:
      "Generate a structured service proposal or engagement plan for a prospect or client.",
    category: "content",
    schema: {
      clientName: "string",
      services: "array",
      timeline: "string",
      goals: "string",
    },
    permissions: ["generate_content"],
    requiresApproval: true,
    tenantScoped: true,
    isEnabled: true,
  },
  {
    id: "tool-followup-schedule",
    name: "follow_up_schedule",
    description:
      "Schedule automated follow-up sequences for leads, past customers, or no-shows.",
    category: "crm",
    schema: {
      contactId: "string",
      sequenceType: "string",
      startDate: "string",
      steps: "array",
    },
    permissions: ["write_campaigns", "write_leads"],
    requiresApproval: false,
    tenantScoped: true,
    isEnabled: true,
  },
];

// ─── Approval Items ───────────────────────────────────────────────────────────

export const DEMO_APPROVAL_ITEMS: ApprovalItem[] = [
  {
    id: "approval-001",
    runId: "run-003",
    threadId: "thread-restoration-seo",
    tenantId: "tenant-oceanside",
    action:
      "Publish 3 service area landing pages (Carlsbad, Vista, Escondido) to live website",
    reason:
      "Page publication requires human review to ensure brand consistency and content accuracy before going live.",
    status: "pending",
    requestedAt: Date.now() - 2 * 3600000,
    resolvedAt: null,
    approverNotes: "",
  },
  {
    id: "approval-002",
    runId: "run-007",
    threadId: "thread-medspa-seo",
    tenantId: "tenant-medspa",
    action: "Schedule 4 GBP posts for the next 30 days",
    reason:
      "GBP post scheduling requires admin review to confirm promotions, offers, and patient content comply with client guidelines.",
    status: "pending",
    requestedAt: Date.now() - 1 * 3600000,
    resolvedAt: null,
    approverNotes: "",
  },
  {
    id: "approval-003",
    runId: "run-001",
    threadId: "thread-plumbing-seo",
    tenantId: "tenant-plumbing",
    action: "Update GBP service descriptions for 4 core services",
    reason:
      "Content changes to GBP require admin sign-off per agency protocol.",
    status: "approved",
    requestedAt: Date.now() - 4 * 86400000,
    resolvedAt: Date.now() - 3 * 86400000,
    approverNotes:
      "Approved. Content looks great — make sure to use the exact business name as it appears on the GBP listing.",
  },
];

// ─── Provider Adapters ────────────────────────────────────────────────────────

export const DEMO_PROVIDER_ADAPTERS: ProviderAdapterConfig[] = [
  {
    id: "adapter-native",
    tenantId: "system",
    adapterType: "native",
    isEnabled: true,
    apiKey: "",
    baseUrl: "",
    modelId: "brf-native-v1",
    priority: 1,
    createdAt: Date.now() - 90 * 86400000,
  },
  {
    id: "adapter-openai",
    tenantId: "system",
    adapterType: "openai_compatible",
    isEnabled: false,
    apiKey: "",
    baseUrl: "https://api.openai.com/v1",
    modelId: "gpt-4o",
    priority: 2,
    createdAt: Date.now() - 30 * 86400000,
  },
  {
    id: "adapter-claude",
    tenantId: "system",
    adapterType: "anthropic_claude",
    isEnabled: false,
    apiKey: "",
    baseUrl: "https://api.anthropic.com/v1",
    modelId: "claude-3-5-sonnet-20241022",
    priority: 3,
    createdAt: Date.now() - 30 * 86400000,
  },
  {
    id: "adapter-ollama",
    tenantId: "system",
    adapterType: "ollama_local",
    isEnabled: false,
    apiKey: "",
    baseUrl: "http://localhost:11434",
    modelId: "llama3.2",
    priority: 4,
    createdAt: Date.now() - 14 * 86400000,
  },
];

// ─── Memories ─────────────────────────────────────────────────────────────────

export const DEMO_MEMORIES: AgentMemory[] = [
  {
    threadId: "thread-plumbing-seo",
    tenantId: "tenant-plumbing",
    conversationHistory: [
      {
        role: "user",
        content: "What are the top priorities for our GBP this month?",
        timestamp: Date.now() - 3 * 86400000,
      },
      {
        role: "assistant",
        content:
          "Top 5 GBP priorities for North County Plumbing: service descriptions, photo gallery, Q&A seeding, weekly posts, and service area expansion to 6 cities.",
        timestamp: Date.now() - 3 * 86400000 + 1500,
      },
      {
        role: "user",
        content: "Generate the FAQ content block for GEO optimization.",
        timestamp: Date.now() - 1 * 86400000,
      },
      {
        role: "assistant",
        content:
          "8-question FAQ block generated and saved as artifact. Optimized for answer-engine discovery and featured snippets.",
        timestamp: Date.now() - 1 * 86400000 + 2200,
      },
    ],
    summary:
      "Focused on GBP optimization and GEO content for North County Plumbing. GBP action plan completed. FAQ content block generated and ready for deployment. Next: homepage schema markup and service area page creation.",
    agentNotes:
      "Client is seasonal — peak emergency call volume is June–August. Prioritize local ranking for 'emergency plumber near me' before summer.",
    lastUpdated: Date.now() - 1 * 86400000,
  },
  {
    threadId: "thread-medspa-sales",
    tenantId: "tenant-medspa",
    conversationHistory: [
      {
        role: "user",
        content: "How many no-shows do we have in the last 30 days?",
        timestamp: Date.now() - 7 * 86400000,
      },
      {
        role: "assistant",
        content:
          "Found 4 no-show contacts from the past 30 days. Generating recovery sequence now.",
        timestamp: Date.now() - 7 * 86400000 + 1800,
      },
      {
        role: "user",
        content: "Create a 5-step email sequence for them.",
        timestamp: Date.now() - 6 * 3600000,
      },
      {
        role: "assistant",
        content:
          "5-email no-show recovery sequence created and saved as artifact. Sequence spans 30 days with escalating urgency and a 10% welcome offer at day 7.",
        timestamp: Date.now() - 6 * 3600000 + 3100,
      },
    ],
    summary:
      "Managing consultation no-show recovery for med spa. 4 no-show contacts identified. 5-email sequence created spanning 30 days. Membership upsell triggered for 2 converted contacts.",
    agentNotes:
      "Spring is peak season for Botox and Hydrafacial. Membership upsell converts best when introduced at the 3rd visit.",
    lastUpdated: Date.now() - 6 * 3600000,
  },
];
