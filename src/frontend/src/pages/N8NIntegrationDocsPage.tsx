import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Code,
  Copy,
  FileText,
  GitBranch,
  Globe,
  Info,
  Mail,
  MessageSquare,
  Settings,
  Shield,
  Star,
  Terminal,
  TrendingUp,
  Users,
  Webhook,
  Wrench,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/* ─── Types ─── */
interface ContractDef {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
  icon: React.ElementType;
  category: string;
  requiredFields: { name: string; type: string; description: string }[];
  optionalFields: { name: string; type: string; description: string }[];
  responseShape: string;
  examplePayload: object;
}

/* ─── Contract Definitions ─── */
const CONTRACTS: ContractDef[] = [
  {
    id: "create-lead",
    name: "Create Lead",
    method: "POST",
    path: "/api/v1/webhooks/create-lead",
    description:
      "Ingest a new lead into the BRF CRM from any external source. Triggers lead enrichment, scoring, and pipeline placement.",
    icon: Users,
    category: "CRM",
    requiredFields: [
      { name: "firstName", type: "string", description: "Lead first name" },
      { name: "lastName", type: "string", description: "Lead last name" },
      { name: "email", type: "string", description: "Valid email address" },
      {
        name: "phone",
        type: "string",
        description: "Phone number with country code",
      },
      {
        name: "source",
        type: "string",
        description:
          "Lead source identifier (e.g., 'website', 'facebook', 'google-ads')",
      },
    ],
    optionalFields: [
      {
        name: "company",
        type: "string",
        description: "Business or company name",
      },
      { name: "address", type: "string", description: "Full street address" },
      { name: "city", type: "string", description: "City name" },
      { name: "state", type: "string", description: "State or province" },
      { name: "zip", type: "string", description: "Postal/ZIP code" },
      {
        name: "notes",
        type: "string",
        description: "Free-form notes or context",
      },
      {
        name: "vertical",
        type: "string",
        description: "Industry vertical (e.g., 'roofing', 'dental')",
      },
      { name: "tags", type: "string[]", description: "Array of tag strings" },
      {
        name: "utmCampaign",
        type: "string",
        description: "UTM campaign identifier",
      },
      {
        name: "estimatedValue",
        type: "number",
        description: "Estimated deal value in USD",
      },
    ],
    responseShape: `{
  "success": true,
  "leadId": "lead_abc123",
  "status": "enriched",
  "pipelineStage": "New Lead",
  "score": 78,
  "message": "Lead created and enriched successfully"
}`,
    examplePayload: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phone: "+1-555-123-4567",
      source: "facebook-ads",
      company: "Smith Roofing Co",
      city: "Austin",
      state: "TX",
      vertical: "roofing",
      estimatedValue: 15000,
    },
  },
  {
    id: "update-pipeline",
    name: "Update Pipeline Stage",
    method: "POST",
    path: "/api/v1/webhooks/update-pipeline",
    description:
      "Move a lead or opportunity to a new pipeline stage. Triggers stage-specific automations and notifications.",
    icon: GitBranch,
    category: "CRM",
    requiredFields: [
      {
        name: "leadId",
        type: "string",
        description: "Existing lead identifier",
      },
      {
        name: "stage",
        type: "string",
        description: "Target pipeline stage name",
      },
    ],
    optionalFields: [
      {
        name: "reason",
        type: "string",
        description: "Reason for stage change",
      },
      {
        name: "scheduledDate",
        type: "ISO-8601",
        description: "Appointment or follow-up date",
      },
      {
        name: "assignedTo",
        type: "string",
        description: "User ID to assign the lead to",
      },
      { name: "value", type: "number", description: "Updated deal value" },
    ],
    responseShape: `{
  "success": true,
  "leadId": "lead_abc123",
  "previousStage": "Contact Attempted",
  "currentStage": "Appointment Scheduled",
  "automationTriggered": ["sms_reminder", "calendar_invite"],
  "message": "Pipeline updated successfully"
}`,
    examplePayload: {
      leadId: "lead_abc123",
      stage: "Appointment Scheduled",
      reason: "Customer confirmed via phone",
      scheduledDate: "2025-07-15T14:00:00Z",
      assignedTo: "user_def456",
    },
  },
  {
    id: "create-gbp-post",
    name: "Create GBP Post",
    method: "POST",
    path: "/api/v1/webhooks/create-gbp-post",
    description:
      "Draft and queue a Google Business Profile post for approval. Supports offers, events, updates, and product posts.",
    icon: Globe,
    category: "Ranked",
    requiredFields: [
      {
        name: "businessId",
        type: "string",
        description: "GBP location identifier",
      },
      {
        name: "postType",
        type: "string",
        description: "One of: update, offer, event, product",
      },
      {
        name: "content",
        type: "string",
        description: "Post body text (max 1500 chars)",
      },
    ],
    optionalFields: [
      {
        name: "title",
        type: "string",
        description: "Post headline (max 58 chars)",
      },
      {
        name: "mediaUrls",
        type: "string[]",
        description: "Array of image URLs",
      },
      {
        name: "ctaType",
        type: "string",
        description:
          "Call-to-action type: BOOK, ORDER, SHOP, LEARN_MORE, SIGN_UP, CALL",
      },
      {
        name: "ctaUrl",
        type: "string",
        description: "Destination URL for CTA",
      },
      {
        name: "startDate",
        type: "ISO-8601",
        description: "Event/offer start date",
      },
      {
        name: "endDate",
        type: "ISO-8601",
        description: "Event/offer end date",
      },
      { name: "couponCode", type: "string", description: "Offer coupon code" },
    ],
    responseShape: `{
  "success": true,
  "postId": "gbp_post_xyz789",
  "status": "pending_approval",
  "approvalQueueId": "apr_queue_001",
  "message": "GBP post drafted and queued for approval"
}`,
    examplePayload: {
      businessId: "gbp_loc_123",
      postType: "offer",
      title: "Summer Roof Inspection Special",
      content:
        "Get a free roof inspection this summer. Book now and save 20% on repairs. Limited time offer for Austin homeowners!",
      ctaType: "BOOK",
      ctaUrl: "https://bookedrankedfunded.org/book",
      startDate: "2025-06-01T00:00:00Z",
      endDate: "2025-08-31T23:59:59Z",
      couponCode: "SUMMER20",
    },
  },
  {
    id: "reply-to-review",
    name: "Reply to Review",
    method: "POST",
    path: "/api/v1/webhooks/reply-to-review",
    description:
      "Submit an AI-drafted or manual review reply for approval before publishing to Google, Yelp, or Facebook.",
    icon: Star,
    category: "Ranked",
    requiredFields: [
      {
        name: "reviewId",
        type: "string",
        description: "Internal review identifier",
      },
      {
        name: "platform",
        type: "string",
        description: "Source platform: google, yelp, facebook",
      },
      {
        name: "replyText",
        type: "string",
        description: "Reply content (max 4000 chars)",
      },
    ],
    optionalFields: [
      {
        name: "tone",
        type: "string",
        description: "Reply tone: professional, friendly, apologetic, grateful",
      },
      {
        name: "includeOffer",
        type: "boolean",
        description: "Whether to include a service offer",
      },
      {
        name: "offerDetails",
        type: "object",
        description: "Offer object if includeOffer is true",
      },
    ],
    responseShape: `{
  "success": true,
  "replyId": "reply_abc456",
  "status": "pending_approval",
  "approvalQueueId": "apr_queue_002",
  "message": "Review reply queued for approval"
}`,
    examplePayload: {
      reviewId: "rev_google_789",
      platform: "google",
      replyText:
        "Thank you for your feedback, Sarah! We're glad our team could help with your roof repair. If you ever need anything else, we're here for you.",
      tone: "grateful",
      includeOffer: true,
      offerDetails: {
        description: "10% off next service",
        code: "RETURN10",
      },
    },
  },
  {
    id: "send-email-campaign",
    name: "Send Email Campaign",
    method: "POST",
    path: "/api/v1/webhooks/send-email-campaign",
    description:
      "Queue an email campaign for approval. Supports drip sequences, broadcasts, and cold outreach with compliance checks.",
    icon: Mail,
    category: "Booked",
    requiredFields: [
      {
        name: "campaignId",
        type: "string",
        description: "Campaign identifier",
      },
      {
        name: "recipientList",
        type: "string[]",
        description: "Array of lead IDs or email addresses",
      },
      {
        name: "templateId",
        type: "string",
        description: "Email template identifier",
      },
    ],
    optionalFields: [
      {
        name: "subject",
        type: "string",
        description: "Override template subject line",
      },
      { name: "fromName", type: "string", description: "Sender display name" },
      {
        name: "fromEmail",
        type: "string",
        description: "Sender email address",
      },
      { name: "replyTo", type: "string", description: "Reply-to address" },
      { name: "sendAt", type: "ISO-8601", description: "Scheduled send time" },
      {
        name: "trackOpens",
        type: "boolean",
        description: "Enable open tracking",
      },
      {
        name: "trackClicks",
        type: "boolean",
        description: "Enable click tracking",
      },
      {
        name: "unsubscribeGroup",
        type: "string",
        description: "Unsubscribe group ID",
      },
    ],
    responseShape: `{
  "success": true,
  "campaignId": "camp_123",
  "status": "pending_approval",
  "approvalQueueId": "apr_queue_003",
  "recipientCount": 250,
  "estimatedSendTime": "2025-06-20T09:00:00Z",
  "message": "Email campaign queued for approval"
}`,
    examplePayload: {
      campaignId: "camp_summer_2025",
      recipientList: ["lead_001", "lead_002", "lead_003"],
      templateId: "tmpl_roofing_offer",
      subject: "Summer Roof Inspection — 20% Off",
      fromName: "Apex Shield Roofing",
      fromEmail: "hello@apexshield.com",
      trackOpens: true,
      trackClicks: true,
    },
  },
  {
    id: "send-sms",
    name: "Send SMS",
    method: "POST",
    path: "/api/v1/webhooks/send-sms",
    description:
      "Queue an SMS message for approval. Supports bulk sends, two-way conversations, and automated follow-ups.",
    icon: MessageSquare,
    category: "Booked",
    requiredFields: [
      { name: "leadId", type: "string", description: "Lead identifier" },
      {
        name: "message",
        type: "string",
        description: "SMS body text (max 1600 chars)",
      },
    ],
    optionalFields: [
      {
        name: "fromNumber",
        type: "string",
        description: "Twilio sender number",
      },
      {
        name: "mediaUrls",
        type: "string[]",
        description: "Array of media URLs (MMS)",
      },
      {
        name: "scheduleAt",
        type: "ISO-8601",
        description: "Scheduled send time",
      },
      {
        name: "templateId",
        type: "string",
        description: "SMS template identifier",
      },
      {
        name: "twoWay",
        type: "boolean",
        description: "Enable two-way conversation threading",
      },
    ],
    responseShape: `{
  "success": true,
  "smsId": "sms_abc789",
  "status": "pending_approval",
  "approvalQueueId": "apr_queue_004",
  "message": "SMS queued for approval"
}`,
    examplePayload: {
      leadId: "lead_abc123",
      message:
        "Hi John! This is Apex Shield Roofing. Your roof inspection is scheduled for tomorrow at 2pm. Reply CONFIRM to confirm or RESCHEDULE to change.",
      fromNumber: "+1-555-987-6543",
      twoWay: true,
    },
  },
  {
    id: "generate-report",
    name: "Generate Report",
    method: "POST",
    path: "/api/v1/webhooks/generate-report",
    description:
      "Trigger an AI-powered report generation. Supports marketing audits, SEO audits, funding readiness, and monthly performance reports.",
    icon: FileText,
    category: "Insights",
    requiredFields: [
      {
        name: "reportType",
        type: "string",
        description:
          "One of: marketing-audit, seo-audit, funding-readiness, monthly-performance, competitor-analysis",
      },
      {
        name: "clientBusinessId",
        type: "string",
        description: "Client business identifier",
      },
    ],
    optionalFields: [
      {
        name: "dateRange",
        type: "object",
        description: "{ start: ISO-8601, end: ISO-8601 }",
      },
      {
        name: "includeRecommendations",
        type: "boolean",
        description: "Include AI-generated recommendations",
      },
      {
        name: "includeCompetitorData",
        type: "boolean",
        description: "Include competitor comparison",
      },
      {
        name: "verticalProfileId",
        type: "string",
        description: "Vertical profile for niche-specific insights",
      },
      {
        name: "format",
        type: "string",
        description: "Output format: pdf, html, json",
      },
    ],
    responseShape: `{
  "success": true,
  "reportId": "rpt_def456",
  "status": "generating",
  "estimatedCompletion": "2025-06-20T12:00:00Z",
  "message": "Report generation started"
}`,
    examplePayload: {
      reportType: "marketing-audit",
      clientBusinessId: "biz_apex_001",
      dateRange: { start: "2025-05-01T00:00:00Z", end: "2025-05-31T23:59:59Z" },
      includeRecommendations: true,
      includeCompetitorData: true,
      verticalProfileId: "vp_roofing",
      format: "pdf",
    },
  },
  {
    id: "funding-readiness",
    name: "Funding Readiness Check",
    method: "POST",
    path: "/api/v1/webhooks/funding-readiness",
    description:
      "Submit or update a funding readiness profile. Triggers AI analysis of credit, revenue, and documentation gaps.",
    icon: TrendingUp,
    category: "Funded",
    requiredFields: [
      {
        name: "clientBusinessId",
        type: "string",
        description: "Client business identifier",
      },
      {
        name: "legalBusinessName",
        type: "string",
        description: "Registered business name",
      },
      {
        name: "entityType",
        type: "string",
        description: "LLC, Corp, Sole Proprietorship, Partnership",
      },
    ],
    optionalFields: [
      {
        name: "ein",
        type: "string",
        description: "Employer Identification Number",
      },
      {
        name: "yearsInBusiness",
        type: "number",
        description: "Years in operation",
      },
      {
        name: "monthlyRevenue",
        type: "number",
        description: "Average monthly revenue",
      },
      {
        name: "creditScoreRange",
        type: "string",
        description: "Personal credit score range",
      },
      {
        name: "businessBankAccount",
        type: "boolean",
        description: "Has dedicated business bank account",
      },
      {
        name: "bankStatementsAvailable",
        type: "boolean",
        description: "Has 3+ months bank statements",
      },
      {
        name: "taxReturnsAvailable",
        type: "boolean",
        description: "Has 2+ years tax returns",
      },
      { name: "dunsStatus", type: "string", description: "DUNS number status" },
      {
        name: "existingDebt",
        type: "number",
        description: "Total existing business debt",
      },
      {
        name: "equipmentNeeds",
        type: "string",
        description: "Description of equipment financing needs",
      },
      {
        name: "marketingCapitalNeed",
        type: "number",
        description: "Requested marketing capital amount",
      },
    ],
    responseShape: `{
  "success": true,
  "profileId": "frp_ghi789",
  "readinessScore": 72,
  "status": "analysis_complete",
  "gaps": [
    "Missing 3-month bank statements",
    "DUNS number not established"
  ],
  "recommendations": [
    "Open business credit line with vendor X",
    "Apply for DUNS number"
  ],
  "message": "Funding readiness analysis complete"
}`,
    examplePayload: {
      clientBusinessId: "biz_apex_001",
      legalBusinessName: "Apex Shield Roofing LLC",
      entityType: "LLC",
      ein: "12-3456789",
      yearsInBusiness: 5,
      monthlyRevenue: 45000,
      creditScoreRange: "680-720",
      businessBankAccount: true,
      bankStatementsAvailable: true,
      taxReturnsAvailable: true,
      dunsStatus: "pending",
      existingDebt: 25000,
      equipmentNeeds: "Need new work truck and ladder equipment",
      marketingCapitalNeed: 15000,
    },
  },
];

/* ─── Sections for TOC ─── */
const SECTIONS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "contracts", label: "Webhook Contracts", icon: Webhook },
  { id: "setup", label: "Setup Guide", icon: Settings },
  { id: "payloads", label: "Payload Examples", icon: Code },
  { id: "troubleshooting", label: "Troubleshooting", icon: Wrench },
  { id: "compliance", label: "Compliance & Security", icon: Shield },
];

/* ─── Helper: Copy to clipboard ─── */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };
  return { copied, copy };
}

/* ─── Code Block Component ─── */
function CodeBlock({ code, label }: { code: string; label?: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="relative group">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-white/5 rounded-t-lg">
          <span className="text-xs font-medium text-slate-400">{label}</span>
          <button
            type="button"
            onClick={() => copy(code)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-400 transition-colors"
            data-ocid="docs.copy_button"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre
        className={`bg-slate-950/60 border border-white/5 overflow-x-auto text-xs leading-relaxed text-slate-300 ${label ? "rounded-b-lg" : "rounded-lg"} p-4 font-mono`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ─── Contract Card ─── */
function ContractCard({
  contract,
  index,
}: { contract: ContractDef; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = contract.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-card/40 backdrop-blur-md border border-white/8 rounded-xl overflow-hidden hover:border-amber-500/20 transition-colors"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left"
        data-ocid={`docs.contract.${contract.id}.toggle`}
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              {contract.name}
            </h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
              {contract.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {contract.description}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-amber-400 border border-white/5">
            {contract.method}
          </span>
          <ChevronRight
            size={16}
            className={`text-slate-500 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/5 space-y-4">
              {/* Path */}
              <div className="pt-3">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Endpoint
                </span>
                <CodeBlock
                  code={`${contract.method} https://bookedrankedfunded.org${contract.path}`}
                />
              </div>

              {/* Required Fields */}
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Required Fields
                </span>
                <div className="mt-2 space-y-1.5">
                  {contract.requiredFields.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-start gap-2 text-xs bg-slate-950/40 rounded-lg p-2.5 border border-white/5"
                    >
                      <span className="text-amber-400 font-mono shrink-0">
                        {f.name}
                      </span>
                      <span className="text-slate-500 shrink-0">{f.type}</span>
                      <span className="text-slate-400">— {f.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Fields */}
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Optional Fields
                </span>
                <div className="mt-2 space-y-1.5">
                  {contract.optionalFields.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-start gap-2 text-xs bg-slate-950/40 rounded-lg p-2.5 border border-white/5"
                    >
                      <span className="text-indigo-400 font-mono shrink-0">
                        {f.name}
                      </span>
                      <span className="text-slate-500 shrink-0">{f.type}</span>
                      <span className="text-slate-400">— {f.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Payload */}
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Example Payload
                </span>
                <div className="mt-2">
                  <CodeBlock
                    code={JSON.stringify(contract.examplePayload, null, 2)}
                    label="JSON"
                  />
                </div>
              </div>

              {/* Response */}
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Response Shape
                </span>
                <div className="mt-2">
                  <CodeBlock code={contract.responseShape} label="JSON" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function N8NIntegrationDocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      for (const section of SECTIONS) {
        const el = sectionRefs.current[section.id];
        if (
          el &&
          el.offsetTop <= scrollY &&
          el.offsetTop + el.offsetHeight > scrollY
        ) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/8 bg-card/30">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/10" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center">
              <Webhook size={20} className="text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Integration
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            N8N Webhook Integration
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Complete documentation for connecting BRF to n8n workflows. Build
            powerful automations across CRM, local SEO, reputation management,
            email campaigns, and funding readiness.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              "8 Webhook Contracts",
              "Approval Queue Integration",
              "Dry-Run Support",
              "JSON Payloads",
            ].map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex gap-8">
        {/* TOC Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              On this page
            </p>
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollTo(section.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                  data-ocid={`docs.toc.${section.id}.link`}
                >
                  <Icon
                    size={14}
                    className={isActive ? "text-indigo-400" : "text-slate-500"}
                  />
                  {section.label}
                </button>
              );
            })}

            <div className="mt-6 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">
                  Quick Start
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                New to n8n? Start with the Setup Guide section to configure your
                first BRF webhook workflow in under 5 minutes.
              </p>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-16">
          {/* ─── Overview ─── */}
          <section
            ref={(el) => {
              sectionRefs.current.overview = el;
            }}
            id="overview"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Overview</h2>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed space-y-4">
              <p>
                The BRF N8N integration enables you to connect your Booked
                Ranked Fundable platform to over 400+ external applications
                through n8n workflows. All webhook endpoints follow a consistent
                pattern with built-in approval queues, dry-run capabilities, and
                comprehensive logging.
              </p>
              <p>
                Every external action — whether creating a GBP post, sending an
                email campaign, or updating a pipeline stage — flows through the{" "}
                <strong className="text-amber-400">Approval Queue</strong>{" "}
                before execution. This ensures compliance, prevents errors, and
                gives you full control over automated workflows.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 not-prose mt-6">
                {[
                  {
                    icon: Shield,
                    title: "Approval-First Design",
                    desc: "No external action executes without human approval. Risk levels and compliance notes are attached to every request.",
                  },
                  {
                    icon: Terminal,
                    title: "Dry-Run Support",
                    desc: "Test any webhook with dryRun=true to preview the action without side effects. Perfect for development and QA.",
                  },
                  {
                    icon: Zap,
                    title: "Real-Time Execution",
                    desc: "Once approved, workflows execute immediately through n8n with full error handling and retry logic.",
                  },
                  {
                    icon: Globe,
                    title: "Universal Connectivity",
                    desc: "Connect to Google, Facebook, Twilio, SendGrid, Stripe, and 400+ other services through n8n nodes.",
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-card/30 border border-white/8 hover:border-indigo-500/20 transition-colors"
                  >
                    <feature.icon size={18} className="text-indigo-400 mb-2" />
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── Webhook Contracts ─── */}
          <section
            ref={(el) => {
              sectionRefs.current.contracts = el;
            }}
            id="contracts"
          >
            <div className="flex items-center gap-2 mb-4">
              <Webhook size={18} className="text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">
                Webhook Contracts
              </h2>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Click any contract to expand and view full endpoint details,
              required fields, and example payloads.
            </p>
            <div className="space-y-3">
              {CONTRACTS.map((contract, i) => (
                <ContractCard key={contract.id} contract={contract} index={i} />
              ))}
            </div>
          </section>

          {/* ─── Setup Guide ─── */}
          <section
            ref={(el) => {
              sectionRefs.current.setup = el;
            }}
            id="setup"
          >
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Setup Guide</h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Install n8n",
                  content:
                    "Self-host n8n or use n8n.cloud. For production workflows, we recommend self-hosting for full data control.",
                  code: `# Docker (recommended)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n:latest`,
                },
                {
                  step: 2,
                  title: "Create a Webhook Workflow",
                  content:
                    "In n8n, create a new workflow. Add a Webhook node as the trigger. Set the method to POST and copy the webhook URL.",
                  code: `// n8n Webhook Node Configuration
{
  "name": "BRF Webhook Trigger",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1,
  "position": [250, 300],
  "webhookId": "brf-create-lead",
  "path": "brf-create-lead",
  "responseMode": "responseNode",
  "method": "POST"
}`,
                },
                {
                  step: 3,
                  title: "Add BRF Authentication",
                  content:
                    "All BRF webhooks require API key authentication. Add your API key to the request headers.",
                  code: `// HTTP Request Header
{
  "Authorization": "Bearer YOUR_BRF_API_KEY",
  "Content-Type": "application/json",
  "X-BRF-Webhook-Secret": "your_webhook_secret"
}`,
                },
                {
                  step: 4,
                  title: "Map BRF Response to Actions",
                  content:
                    "Use the BRF response to trigger downstream n8n nodes. For example, create a Google Sheet row when a lead is created.",
                  code: `// Example: n8n IF Node checking BRF response
{
  "conditions": {
    "options": {
      "caseSensitive": true,
      "leftValue": "={{ $json.success }}",
      "operator": {
        "type": "boolean",
        "operation": "equals"
      },
      "rightValue": "true"
    }
  }
}`,
                },
                {
                  step: 5,
                  title: "Test with Dry-Run",
                  content:
                    "Before going live, always test with dryRun=true. This validates your payload without creating real records.",
                  code: `// Test payload with dryRun
{
  "dryRun": true,
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "phone": "+1-555-000-0000",
  "source": "n8n-test"
}`,
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                      {s.step}
                    </div>
                    {s.step < 5 && (
                      <div className="w-px h-full bg-white/5 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {s.content}
                    </p>
                    <CodeBlock
                      code={s.code}
                      label={s.step === 1 ? "bash" : "json"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Payload Examples ─── */}
          <section
            ref={(el) => {
              sectionRefs.current.payloads = el;
            }}
            id="payloads"
          >
            <div className="flex items-center gap-2 mb-4">
              <Code size={18} className="text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">
                Payload Examples
              </h2>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Common payload patterns for n8n workflows. Copy and adapt these
              for your specific use cases.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <ArrowRight size={14} className="text-amber-400" />
                  Lead Capture from Website Form
                </h3>
                <CodeBlock
                  code={`{
  "firstName": "{{ $json.first_name }}",
  "lastName": "{{ $json.last_name }}",
  "email": "{{ $json.email }}",
  "phone": "{{ $json.phone }}",
  "source": "website-form",
  "vertical": "{{ $json.service_type }}",
  "city": "{{ $json.city }}",
  "state": "{{ $json.state }}",
  "notes": "Submitted via {{ $json.page_url }}",
  "utmCampaign": "{{ $json.utm_campaign }}"
}`}
                  label="n8n Set Node → BRF Webhook"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <ArrowRight size={14} className="text-amber-400" />
                  Google Ads Lead to CRM Pipeline
                </h3>
                <CodeBlock
                  code={`{
  "firstName": "{{ $json.userColumnData[0].stringValue }}",
  "lastName": "{{ $json.userColumnData[1].stringValue }}",
  "email": "{{ $json.userColumnData[2].stringValue }}",
  "phone": "{{ $json.userColumnData[3].stringValue }}",
  "source": "google-ads",
  "vertical": "{{ $json.campaignName.split('_')[0] }}",
  "estimatedValue": 12000,
  "tags": ["paid-traffic", "google-ads", "hot-lead"]
}`}
                  label="Google Ads Trigger → BRF Webhook"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <ArrowRight size={14} className="text-amber-400" />
                  Scheduled GBP Post from Content Calendar
                </h3>
                <CodeBlock
                  code={`{
  "businessId": "{{ $json.business_id }}",
  "postType": "{{ $json.post_type }}",
  "title": "{{ $json.title }}",
  "content": "{{ $json.content }}",
  "ctaType": "{{ $json.cta_type }}",
  "ctaUrl": "{{ $json.cta_url }}",
  "mediaUrls": [
    "{{ $json.image_url_1 }}",
    "{{ $json.image_url_2 }}"
  ]
}`}
                  label="Schedule Trigger → BRF Webhook"
                />
              </div>
            </div>
          </section>

          {/* ─── Troubleshooting ─── */}
          <section
            ref={(el) => {
              sectionRefs.current.troubleshooting = el;
            }}
            id="troubleshooting"
          >
            <div className="flex items-center gap-2 mb-4">
              <Wrench size={18} className="text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">
                Troubleshooting
              </h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: XCircle,
                  iconColor: "text-red-400",
                  title: "401 Unauthorized",
                  desc: "Your API key is missing or invalid. Verify the Authorization header matches your Go Live Dashboard API key.",
                  fix: "Check /go-live page → API Keys → BRF Platform Key. Ensure the header is: Authorization: Bearer YOUR_KEY",
                },
                {
                  icon: XCircle,
                  iconColor: "text-red-400",
                  title: "422 Validation Error",
                  desc: "Required fields are missing or have invalid formats. Check the response body for specific field errors.",
                  fix: "Compare your payload against the Required Fields table for the webhook contract. Ensure email is valid and phone includes country code.",
                },
                {
                  icon: AlertCircle,
                  iconColor: "text-amber-400",
                  title: "Webhook Queued but Not Executing",
                  desc: "The approval queue is holding the action. This is expected behavior for all external actions.",
                  fix: "Navigate to /approval-queue and approve the pending request. The workflow will then execute through n8n.",
                },
                {
                  icon: AlertCircle,
                  iconColor: "text-amber-400",
                  title: "n8n Workflow Times Out",
                  desc: "BRF webhooks have a 30-second timeout. Complex workflows may exceed this.",
                  fix: "Use the 'responseNode' mode in n8n to return immediately, then process asynchronously. Or split the workflow into smaller chunks.",
                },
                {
                  icon: Info,
                  iconColor: "text-blue-400",
                  title: "Dry-Run Shows Success but Live Fails",
                  desc: "Dry-run validates payload structure but doesn't test external API connections.",
                  fix: "Check the Integration Health page (/admin/integration-health) to verify Twilio, SendGrid, or Google APIs are connected and have valid credentials.",
                },
                {
                  icon: CheckCircle2,
                  iconColor: "text-emerald-400",
                  title: "How to Check Workflow Logs",
                  desc: "Every webhook call is logged with full request/response details.",
                  fix: "Go to /workflow-logs and filter by the webhook contract ID. Click any log entry to see the full payload, headers, and execution trace.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-card/30 border border-white/8"
                >
                  <div className="flex items-start gap-3">
                    <item.icon
                      size={16}
                      className={`${item.iconColor} shrink-0 mt-0.5`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-950/40 border border-white/5">
                        <p className="text-[11px] text-emerald-400 font-medium">
                          Fix:
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {item.fix}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ─── Compliance & Security ─── */}
          <section
            ref={(el) => {
              sectionRefs.current.compliance = el;
            }}
            id="compliance"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">
                Compliance & Security
              </h2>
            </div>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                All BRF webhook integrations are designed with compliance-first
                principles. Every external action requires human approval, and
                all data is encrypted in transit and at rest.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "CAN-SPAM Compliance",
                    desc: "All email campaigns include unsubscribe links and physical addresses. Cold outreach requires explicit opt-in consent logging.",
                  },
                  {
                    title: "GDPR Data Handling",
                    desc: "Lead data can be exported or deleted on request. Consent logs are immutable and timestamped on the ICP blockchain.",
                  },
                  {
                    title: "TCPA SMS Rules",
                    desc: "SMS messages require documented consent. The ConsentLog object tracks every opt-in with timestamp, source, and IP address.",
                  },
                  {
                    title: "API Key Security",
                    desc: "Keys are stored in stable canister storage with XOR obfuscation. Never hardcode credentials in n8n workflows — use environment variables.",
                  },
                  {
                    title: "Webhook Signatures",
                    desc: "All webhooks include X-BRF-Signature header for HMAC verification. Verify signatures in n8n to prevent replay attacks.",
                  },
                  {
                    title: "Audit Trail",
                    desc: "Every webhook call creates a WorkflowLog entry with full request/response, user identity, and timestamp. Immutable on ICP.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="p-4 rounded-xl bg-card/30 border border-white/8"
                  >
                    <h3 className="text-xs font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={16}
                    className="text-amber-400 shrink-0 mt-0.5"
                  />
                  <div>
                    <h3 className="text-xs font-semibold text-amber-400 mb-1">
                      Important: No Guaranteed Claims
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      BRF never guarantees rankings, funding approval, or
                      specific business outcomes. All AI-generated content
                      includes disclaimers. Funding readiness reports are
                      educational only and do not constitute financial advice.
                      Always consult qualified professionals for legal, medical,
                      or financial decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <div className="pt-8 pb-16 border-t border-white/8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Ready to build?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Import pre-built BRF workflow templates from the Workflow
                  Library.
                </p>
              </div>
              <a
                href="#/admin/workflow-library"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                data-ocid="docs.workflow_library.link"
              >
                <Webhook size={14} />
                Browse Workflow Library
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
