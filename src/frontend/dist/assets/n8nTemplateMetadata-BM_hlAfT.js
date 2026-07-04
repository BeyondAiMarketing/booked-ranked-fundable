import { c as createLucideIcon, b7 as MapPin, aq as ShieldCheck, C as ChartColumn, b8 as MessageSquare, m as Mail, b9 as GitBranch, ba as UserPlus, j as jsxRuntimeExports, at as Card, as as Badge, B as Button } from "./index-CSMRpKtY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  ["path", { d: "m10 7-3 3 3 3", key: "1eugdv" }],
  ["path", { d: "M17 13v-1a2 2 0 0 0-2-2H7", key: "ernfh3" }]
];
const MessageSquareReply = createLucideIcon("message-square-reply", __iconNode);
const ICON_MAP = {
  UserPlus,
  GitBranch,
  MessageSquareReply,
  Mail,
  MessageSquare,
  BarChart3: ChartColumn,
  ShieldCheck,
  MapPin
};
function TemplateCard({
  template,
  onUseTemplate,
  onPreview
}) {
  const Icon = ICON_MAP[template.icon] || UserPlus;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group relative overflow-hidden border border-border/60 bg-card/80 p-5 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_20px_oklch(0.62_0.2_200_/_15%)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[oklch(0.62_0.2_200)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${template.color}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate text-sm font-semibold text-foreground", children: template.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground", children: template.category })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 line-clamp-2 text-xs text-muted-foreground", children: template.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex flex-wrap gap-1", children: template.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: tag }, tag)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
        template.nodeCount,
        " nodes"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-gold-accent" }),
        template.estimatedSetupTime
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      onPreview && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => onPreview(template.id),
          className: "h-7 flex-1 text-xs hover:bg-muted",
          "data-ocid": `template.preview_button.${template.id}`,
          children: "Preview"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: () => onUseTemplate(template.id),
          className: "h-7 flex-1 gap-1.5 border-primary/30 bg-primary/5 text-xs hover:bg-primary/20",
          "data-ocid": `template.use_button.${template.id}`,
          children: "Use Template"
        }
      )
    ] })
  ] });
}
const N8N_TEMPLATE_METADATA = [
  {
    id: "brf-create-lead",
    fileName: "brf-create-lead.json",
    name: "BRF - Create Lead from Webhook",
    description: "Captures leads from external sources (forms, ads, landing pages) and creates them in the BRF CRM. Maps lead fields to BRF Contact/Lead objects and triggers follow-up sequences.",
    category: "CRM",
    tags: ["BRF", "CRM", "Lead Capture", "Webhook"],
    webhookId: "brf-create-lead",
    icon: "UserPlus",
    color: "text-emerald-400",
    nodeCount: 5,
    estimatedSetupTime: "2 min"
  },
  {
    id: "brf-update-pipeline",
    fileName: "brf-update-pipeline.json",
    name: "BRF - Update Pipeline Stage",
    description: "Updates a lead's pipeline stage in BRF CRM. Triggered by external events (appointment booked, proposal sent, deal closed) to keep the pipeline in sync.",
    category: "CRM",
    tags: ["BRF", "CRM", "Pipeline", "Automation"],
    webhookId: "brf-update-pipeline",
    icon: "GitBranch",
    color: "text-sky-400",
    nodeCount: 5,
    estimatedSetupTime: "2 min"
  },
  {
    id: "brf-reply-to-review",
    fileName: "brf-reply-to-review.json",
    name: "BRF - Reply to Review",
    description: "Posts AI-drafted review replies to Google Business Profile. Pulls approved reply drafts from the Approval Queue and publishes them via the Google API.",
    category: "Reviews",
    tags: ["BRF", "Reviews", "GBP", "Reputation"],
    webhookId: "brf-reply-to-review",
    icon: "MessageSquareReply",
    color: "text-amber-400",
    nodeCount: 5,
    estimatedSetupTime: "3 min"
  },
  {
    id: "brf-send-email-campaign",
    fileName: "brf-send-email-campaign.json",
    name: "BRF - Send Email Campaign",
    description: "Sends approved email campaigns via SendGrid or Caffeine native email. Pulls campaign data from BRF Campaign Builder and handles unsubscribe links and compliance.",
    category: "Outreach",
    tags: ["BRF", "Email", "Campaign", "Compliance"],
    webhookId: "brf-send-email-campaign",
    icon: "Mail",
    color: "text-violet-400",
    nodeCount: 5,
    estimatedSetupTime: "3 min"
  },
  {
    id: "brf-send-sms",
    fileName: "brf-send-sms.json",
    name: "BRF - Send SMS",
    description: "Sends SMS messages via Twilio. Pulls approved SMS drafts from BRF Campaign Builder and handles opt-out compliance and delivery tracking.",
    category: "Outreach",
    tags: ["BRF", "SMS", "Twilio", "Compliance"],
    webhookId: "brf-send-sms",
    icon: "MessageSquare",
    color: "text-cyan-400",
    nodeCount: 5,
    estimatedSetupTime: "2 min"
  },
  {
    id: "brf-generate-report",
    fileName: "brf-generate-report.json",
    name: "BRF - Generate Monthly Report",
    description: "Generates monthly performance reports for clients. Pulls data from BRF analytics, formats it into branded PDF/HTML, and delivers via email or client portal.",
    category: "Reports",
    tags: ["BRF", "Reports", "Analytics", "Automation"],
    webhookId: "brf-generate-report",
    icon: "BarChart3",
    color: "text-rose-400",
    nodeCount: 5,
    estimatedSetupTime: "3 min"
  },
  {
    id: "brf-funding-readiness",
    fileName: "brf-funding-readiness.json",
    name: "BRF - Funding Readiness Check",
    description: "Runs a funding readiness assessment for clients. Checks credit, revenue, documentation, and business credibility. Generates a readiness scorecard and action plan.",
    category: "Funding",
    tags: ["BRF", "Funding", "Credit", "Assessment"],
    webhookId: "brf-funding-readiness",
    icon: "ShieldCheck",
    color: "text-gold-accent",
    nodeCount: 5,
    estimatedSetupTime: "4 min"
  },
  {
    id: "brf-create-gbp-post",
    fileName: "brf-create-gbp-post.json",
    name: "BRF - Create GBP Post",
    description: "Creates Google Business Profile posts from BRF GBP Post Drafts. Pulls approved drafts from the Approval Queue and publishes them via the Google Business API.",
    category: "Local SEO",
    tags: ["BRF", "GBP", "Local SEO", "Posts"],
    webhookId: "brf-create-gbp-post",
    icon: "MapPin",
    color: "text-blue-accent",
    nodeCount: 5,
    estimatedSetupTime: "3 min"
  }
];
Array.from(
  new Set(N8N_TEMPLATE_METADATA.map((t) => t.category))
);
export {
  N8N_TEMPLATE_METADATA as N,
  TemplateCard as T
};
