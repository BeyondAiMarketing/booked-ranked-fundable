// ── N8N Template Metadata ─────────────────────────────────────────────────────
// Static metadata for built-in BRF n8n workflow templates shipped with the app.
// Templates live in /public/n8n-templates/ and are loaded dynamically.

export interface N8NTemplateMetadata {
  id: string;
  fileName: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  webhookId: string;
  icon: string; // lucide icon name
  color: string; // tailwind text color class
  nodeCount: number;
  estimatedSetupTime: string;
}

export const N8N_TEMPLATE_METADATA: N8NTemplateMetadata[] = [
  {
    id: "brf-create-lead",
    fileName: "brf-create-lead.json",
    name: "BRF - Create Lead from Webhook",
    description:
      "Captures leads from external sources (forms, ads, landing pages) and creates them in the BRF CRM. Maps lead fields to BRF Contact/Lead objects and triggers follow-up sequences.",
    category: "CRM",
    tags: ["BRF", "CRM", "Lead Capture", "Webhook"],
    webhookId: "brf-create-lead",
    icon: "UserPlus",
    color: "text-emerald-400",
    nodeCount: 5,
    estimatedSetupTime: "2 min",
  },
  {
    id: "brf-update-pipeline",
    fileName: "brf-update-pipeline.json",
    name: "BRF - Update Pipeline Stage",
    description:
      "Updates a lead's pipeline stage in BRF CRM. Triggered by external events (appointment booked, proposal sent, deal closed) to keep the pipeline in sync.",
    category: "CRM",
    tags: ["BRF", "CRM", "Pipeline", "Automation"],
    webhookId: "brf-update-pipeline",
    icon: "GitBranch",
    color: "text-sky-400",
    nodeCount: 5,
    estimatedSetupTime: "2 min",
  },
  {
    id: "brf-reply-to-review",
    fileName: "brf-reply-to-review.json",
    name: "BRF - Reply to Review",
    description:
      "Posts AI-drafted review replies to Google Business Profile. Pulls approved reply drafts from the Approval Queue and publishes them via the Google API.",
    category: "Reviews",
    tags: ["BRF", "Reviews", "GBP", "Reputation"],
    webhookId: "brf-reply-to-review",
    icon: "MessageSquareReply",
    color: "text-amber-400",
    nodeCount: 5,
    estimatedSetupTime: "3 min",
  },
  {
    id: "brf-send-email-campaign",
    fileName: "brf-send-email-campaign.json",
    name: "BRF - Send Email Campaign",
    description:
      "Sends approved email campaigns via SendGrid or Caffeine native email. Pulls campaign data from BRF Campaign Builder and handles unsubscribe links and compliance.",
    category: "Outreach",
    tags: ["BRF", "Email", "Campaign", "Compliance"],
    webhookId: "brf-send-email-campaign",
    icon: "Mail",
    color: "text-violet-400",
    nodeCount: 5,
    estimatedSetupTime: "3 min",
  },
  {
    id: "brf-send-sms",
    fileName: "brf-send-sms.json",
    name: "BRF - Send SMS",
    description:
      "Sends SMS messages via Twilio. Pulls approved SMS drafts from BRF Campaign Builder and handles opt-out compliance and delivery tracking.",
    category: "Outreach",
    tags: ["BRF", "SMS", "Twilio", "Compliance"],
    webhookId: "brf-send-sms",
    icon: "MessageSquare",
    color: "text-cyan-400",
    nodeCount: 5,
    estimatedSetupTime: "2 min",
  },
  {
    id: "brf-generate-report",
    fileName: "brf-generate-report.json",
    name: "BRF - Generate Monthly Report",
    description:
      "Generates monthly performance reports for clients. Pulls data from BRF analytics, formats it into branded PDF/HTML, and delivers via email or client portal.",
    category: "Reports",
    tags: ["BRF", "Reports", "Analytics", "Automation"],
    webhookId: "brf-generate-report",
    icon: "BarChart3",
    color: "text-rose-400",
    nodeCount: 5,
    estimatedSetupTime: "3 min",
  },
  {
    id: "brf-funding-readiness",
    fileName: "brf-funding-readiness.json",
    name: "BRF - Funding Readiness Check",
    description:
      "Runs a funding readiness assessment for clients. Checks credit, revenue, documentation, and business credibility. Generates a readiness scorecard and action plan.",
    category: "Funding",
    tags: ["BRF", "Funding", "Credit", "Assessment"],
    webhookId: "brf-funding-readiness",
    icon: "ShieldCheck",
    color: "text-gold-accent",
    nodeCount: 5,
    estimatedSetupTime: "4 min",
  },
  {
    id: "brf-create-gbp-post",
    fileName: "brf-create-gbp-post.json",
    name: "BRF - Create GBP Post",
    description:
      "Creates Google Business Profile posts from BRF GBP Post Drafts. Pulls approved drafts from the Approval Queue and publishes them via the Google Business API.",
    category: "Local SEO",
    tags: ["BRF", "GBP", "Local SEO", "Posts"],
    webhookId: "brf-create-gbp-post",
    icon: "MapPin",
    color: "text-blue-accent",
    nodeCount: 5,
    estimatedSetupTime: "3 min",
  },
];

export const N8N_TEMPLATE_CATEGORIES = Array.from(
  new Set(N8N_TEMPLATE_METADATA.map((t) => t.category)),
);

export function getTemplateById(id: string): N8NTemplateMetadata | undefined {
  return N8N_TEMPLATE_METADATA.find((t) => t.id === id);
}

export function getTemplatesByCategory(
  category: string,
): N8NTemplateMetadata[] {
  return N8N_TEMPLATE_METADATA.filter((t) => t.category === category);
}
