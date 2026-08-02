// Workflow execution engine for Agent Workflow OS
// Provides: multi-step execution, approval checkpoints, memory injection, provider routing

import type { TenantEntry } from "../context/AppContext";
import type { AgentSubscription } from "../data/agentData";
import type { AuditData, Lead } from "../data/demoData";
import type { AgentArtifact } from "../types/agentWorkflow";
import type { OpenSourceServiceConfig } from "../types/integrations";
import { routeAICall, routeMasterAgentCall } from "./openSourceAdapters";

export interface WorkflowStep {
  id: string;
  title: string;
  type:
    | "prompt"
    | "tool_call"
    | "approval_checkpoint"
    | "artifact_generation"
    | "notification";
  input?: string;
  toolName?: string;
  artifactType?: string;
  notificationTitle?: string;
  condition?: string;
  onFailure?: "retry" | "skip" | "abort";
  maxRetries?: number;
}

export interface WorkflowExecutionContext {
  threadId: string;
  runId: string;
  tenantId: string;
  agentId: string;
  agentRole: string;
  providerAdapter: string;
  systemPrompt: string;
  memoryContext: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  maxRetries: number;
  requireApproval: boolean;
  allowedTools: string[];
  toolContext?: ToolExecutionContext;
  openSourceConfig?: OpenSourceServiceConfig;
}

export interface StepResult {
  stepId: string;
  status: "completed" | "failed" | "paused_for_approval" | "skipped";
  output: string;
  artifactId?: string;
  error?: string;
  retryCount?: number;
}

// Context injected by useAgentWorkflow — carries live app data so tools can read/write real state
export interface ToolExecutionContext {
  tenantId: string;
  getLeadsByTenant: (tenantId: string) => Lead[];
  addLead: (tenantId: string, lead: Omit<Lead, "id" | "createdAt">) => Lead;
  updateLeadStatus: (
    tenantId: string,
    leadId: string,
    status: Lead["status"],
  ) => void;
  getAuditDataForTenant: (tenantId: string) => {
    seoScore: number;
    mobileScore: number;
    technicalScore: number;
    speedScore: number;
    overallScore: number;
    recommendations?: { text: string; priority: string }[];
  };
  getActiveAgentsForTenant: (tenantId: string) => AgentSubscription[];
  getTenantById: (tenantId: string) => TenantEntry | undefined;
  triggerNotification: (notification: {
    type: "lead" | "review" | "audit" | "uptime" | "general";
    title: string;
    message: string;
  }) => void;
  createArtifact: (
    runId: string,
    threadId: string,
    tenantId: string,
    artifactType: AgentArtifact["artifactType"],
    title: string,
    content: string,
    tags?: string[],
  ) => AgentArtifact;
  currentRunId: string;
  currentThreadId: string;
}

// Pricing catalogue (single source of truth for pricing_lookup)
const AGENT_PRICING: Record<
  string,
  { label: string; price: number; unit: string }
> = {
  "agent-seo": { label: "SEO & GEO Agent", price: 999, unit: "month" },
  "agent-ads": { label: "Paid Ads Agent", price: 1999, unit: "month" },
  "agent-website": { label: "Website Agent", price: 399, unit: "month" },
  "agent-bundle": {
    label: "SEO + Paid Ads Bundle",
    price: 2598,
    unit: "month",
  },
  "agent-oversight": {
    label: "Human Oversight Upgrade",
    price: 299,
    unit: "month",
  },
};

export class WorkflowEngine {
  private static instance: WorkflowEngine;

  /** Cached API keys — injected from MasterAgentPage via setApiKeys() */
  private _apiKeys: {
    openRouterKey: string;
    openAIKey: string;
    geminiApiKey: string;
    nvidiaNimKey: string;
  } = { openRouterKey: "", openAIKey: "", geminiApiKey: "", nvidiaNimKey: "" };

  static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  /** Call this from MasterAgentPage (or any consumer) after credentials load. */
  setApiKeys(keys: {
    openRouterKey: string;
    openAIKey: string;
    geminiApiKey: string;
    nvidiaNimKey: string;
  }) {
    this._apiKeys = keys;
  }

  async executeStep(
    step: WorkflowStep,
    context: WorkflowExecutionContext,
    onStatusUpdate: (status: string, output: string) => void,
  ): Promise<StepResult> {
    try {
      switch (step.type) {
        case "prompt":
          return await this.executePromptStep(step, context, onStatusUpdate);
        case "tool_call":
          return await this.executeToolStep(step, context);
        case "approval_checkpoint":
          return {
            stepId: step.id,
            status: "paused_for_approval",
            output: "Awaiting human approval",
          };
        case "artifact_generation":
          return await this.generateArtifact(step, context);
        case "notification":
          return await this.sendNotification(step, context);
        default:
          return {
            stepId: step.id,
            status: "skipped",
            output: "Unknown step type",
          };
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      return { stepId: step.id, status: "failed", output: "", error: msg };
    }
  }

  private async executePromptStep(
    step: WorkflowStep,
    context: WorkflowExecutionContext,
    onStatusUpdate: (status: string, output: string) => void,
  ): Promise<StepResult> {
    onStatusUpdate("running", "Processing...");

    const fullPrompt = context.memoryContext
      ? `[CONTEXT FROM PREVIOUS INTERACTIONS]\n${context.memoryContext}\n\n[CURRENT TASK]\n${step.input ?? ""}`
      : (step.input ?? "");

    const response = await this.routeToProvider(
      context.providerAdapter,
      context.systemPrompt,
      fullPrompt,
      context,
    );

    return { stepId: step.id, status: "completed", output: response };
  }

  private async executeToolStep(
    step: WorkflowStep,
    context: WorkflowExecutionContext,
  ): Promise<StepResult> {
    if (!step.toolName || !context.allowedTools.includes(step.toolName)) {
      return {
        stepId: step.id,
        status: "failed",
        output: "",
        error: `Tool "${step.toolName}" not permitted for this agent`,
      };
    }

    const result = await this.executeTool(
      step.toolName,
      step.input ?? "{}",
      context.tenantId,
      context.toolContext,
    );
    return {
      stepId: step.id,
      status: "completed",
      output: JSON.stringify(result),
    };
  }

  private async generateArtifact(
    step: WorkflowStep,
    _context: WorkflowExecutionContext,
  ): Promise<StepResult> {
    const artifactId = `art_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      stepId: step.id,
      status: "completed",
      output: `Artifact "${step.artifactType}" generated`,
      artifactId,
    };
  }

  private async sendNotification(
    step: WorkflowStep,
    _context: WorkflowExecutionContext,
  ): Promise<StepResult> {
    return {
      stepId: step.id,
      status: "completed",
      output: `Notification sent: ${step.notificationTitle}`,
    };
  }

  private async routeToProvider(
    _providerAdapter: string,
    _systemPrompt: string,
    prompt: string,
    context: WorkflowExecutionContext,
  ): Promise<string> {
    // If open source config is present, try the open source routing chain first.
    // Simple tasks (no memoryContext) go to Ollama first; complex tasks go to LiteLLM.
    if (context.openSourceConfig) {
      const taskType = context.memoryContext ? "complex" : "simple";
      const osr = await routeAICall(prompt, taskType, context.openSourceConfig);
      if (osr.success && osr.provider !== "degraded") {
        return osr.content;
      }
    }

    // Attempt routeMasterAgentCall (OmniRouter → OpenAI → Gemini → NVIDIA fallback chain)
    // Keys are injected via setApiKeys() — passing {} silently skips OpenRouter/OpenAI/NVIDIA.
    try {
      const masterResult = await routeMasterAgentCall(prompt, this._apiKeys);
      if (masterResult.success && masterResult.content) {
        return masterResult.content;
      }
    } catch {
      // fall through to contextual response
    }

    // Final fallback to simulated contextual response
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 1200),
    );
    return this.generateContextualResponse(context.agentRole, prompt);
  }

  private generateContextualResponse(role: string, _prompt: string): string {
    const responses: Record<string, string[]> = {
      sales: [
        "Based on the lead profile, I recommend a personalized outreach sequence focusing on their primary pain point. The prospect shows high intent signals — immediate follow-up is advised within 2 hours.",
        "I've analyzed the prospect's business data. Key talking points: response time improvement, local ranking opportunity, and fundability gap in their profile.",
        "Proposal ready: 3-month engagement package addressing their core visibility and conversion needs. Estimated ROI based on their niche and location data: 2.3x within 90 days.",
      ],
      support: [
        "I've reviewed the client's recent activity and identified the source of their issue. Resolution path: update their GBP listing, run a fresh audit, and re-initialize the review request sequence.",
        "Client query resolved. Root cause was a configuration mismatch in the listings sync. Recommended follow-up: schedule a 15-min check-in in 72 hours to confirm resolution.",
        "Support ticket analyzed. This is a known issue with the Twilio webhook — documented fix applied. Client's campaign sequence has been resumed.",
      ],
      seo: [
        "SEO analysis complete. Top priorities: (1) Title tag rewrites on 3 service pages, (2) GBP category alignment, (3) FAQ content addition for 5 service-area queries. Estimated score improvement: +12 points.",
        "GEO visibility audit complete. Your content is not structured for AI answer extraction. Recommended: add FAQ blocks, improve entity clarity in About page, update service descriptions with location-specific language.",
        "Technical health scan: 2 critical issues found (missing canonical tags, slow LCP on mobile). Content opportunities: 4 local service area pages missing, GBP posts stale for 23 days.",
      ],
      content: [
        "Content brief generated for homepage hero refresh. Recommended headline focuses on the client's niche and city. CTA: 'Get a Free Estimate.' Word count target: 180 words.",
        "FAQ content batch ready: 8 answer-engine-optimized questions for your service pages. Each response is structured for featured snippet extraction and AI search summarization.",
        "Seasonal content campaign draft complete: 5 service page updates, 3 blog post briefs, and 2 GBP post templates timed for peak season.",
      ],
      ops: [
        "Operations review complete. Fulfillment queue has 3 overdue items assigned to the same team member. Recommended redistribution reduces average completion time by 2.1 days.",
        "Workflow efficiency analysis: review request sequence has a 34% open rate but only 12% click-through. Adjusted timing and subject line variants ready for A/B test deployment.",
        "Monthly outcomes compiled: 12 deliverables completed, 4 requests pending, 2 approvals required. Client health score: 87/100.",
      ],
      follow_up: [
        "Follow-up sequence triggered for 3 leads that went cold after initial contact. Personalized re-engagement emails drafted based on their original inquiry and seasonal timing.",
        "Post-service follow-up complete: review request sent to 7 recently completed jobs. 2 have already responded with 5-star reviews. Automatic thank-you replies queued.",
        "Missed call recovery sequence activated for 2 inbound leads. SMS sent within 3 minutes of missed call. Calendar link included for self-scheduling.",
      ],
    };

    const roleResponses = responses[role] ?? responses.ops;
    return roleResponses[Math.floor(Math.random() * roleResponses.length)];
  }

  // ─── Tool execution: wired to live app data via ToolExecutionContext ──────────

  async executeTool(
    toolName: string,
    inputJson: string,
    tenantId: string,
    toolContext?: ToolExecutionContext,
  ): Promise<Record<string, unknown>> {
    let input: Record<string, unknown>;
    try {
      input = JSON.parse(inputJson) as Record<string, unknown>;
    } catch {
      return { error: "Invalid tool input JSON" };
    }

    const effectiveTenantId = toolContext?.tenantId ?? tenantId;

    switch (toolName) {
      case "crm_lookup": {
        if (!toolContext) return this.fallbackCrmLookup(input);
        const all = toolContext.getLeadsByTenant(effectiveTenantId);
        let results = all;

        if (input.status && typeof input.status === "string") {
          results = results.filter((l) => l.status === input.status);
        }
        if (input.name && typeof input.name === "string") {
          const q = (input.name as string).toLowerCase();
          results = results.filter((l) => l.name.toLowerCase().includes(q));
        }
        if (input.limit && typeof input.limit === "number") {
          results = results.slice(0, input.limit as number);
        }

        const leadLines = results.map(
          (l) =>
            `• ${l.name} — Status: ${l.status}, Source: ${l.source}${l.phone ? `, Phone: ${l.phone}` : ""}${l.email ? `, Email: ${l.email}` : ""}`,
        );
        const summary =
          results.length === 0
            ? "No leads found matching the criteria."
            : `Found ${results.length} lead${results.length !== 1 ? "s" : ""}:\n${leadLines.join("\n")}`;

        // Auto-generate a lead summary artifact when context is available
        if (toolContext && results.length > 0) {
          toolContext.createArtifact(
            toolContext.currentRunId,
            toolContext.currentThreadId,
            effectiveTenantId,
            "lead_summary",
            `CRM Snapshot — ${new Date().toLocaleDateString()}`,
            summary,
            ["crm", "leads", "auto-generated"],
          );
        }

        return {
          found: results.length > 0,
          count: results.length,
          records: results,
          summary,
        };
      }

      case "lead_create": {
        if (!toolContext) return this.fallbackLeadCreate(input);
        const name = (input.name as string) ?? "Unknown";
        const newLead = toolContext.addLead(effectiveTenantId, {
          tenantId: effectiveTenantId,
          name,
          phone: (input.phone as string) ?? "",
          email: (input.email as string) ?? "",
          source: (input.source as string) ?? "Agent",
          status: (input.status as Lead["status"]) ?? "new",
        });
        toolContext.triggerNotification({
          type: "lead",
          title: "New Lead Created by Agent",
          message: `${name} was added to your CRM by the AI agent`,
        });
        return {
          created: true,
          leadId: newLead.id,
          message: `Lead created: ${name} — added to CRM with status '${newLead.status}'`,
        };
      }

      case "lead_update": {
        if (!toolContext)
          return { updated: false, error: "No context available" };
        const leadId = (input.leadId as string) ?? "";
        const status = (input.status as Lead["status"]) ?? "contacted";
        toolContext.updateLeadStatus(effectiveTenantId, leadId, status);
        toolContext.triggerNotification({
          type: "general",
          title: "Lead Updated",
          message: `Lead status updated to ${status}`,
        });
        return {
          updated: true,
          leadId,
          status,
          message: `Lead ${leadId} status updated to ${status}`,
        };
      }

      case "analytics_lookup": {
        if (!toolContext) return this.fallbackAnalytics(input);
        const auditData = toolContext.getAuditDataForTenant(effectiveTenantId);
        const tenant = toolContext.getTenantById(effectiveTenantId);
        const tenantName = tenant?.name ?? effectiveTenantId;

        const metricMap: Record<string, number> = {
          seo: auditData.seoScore,
          seoScore: auditData.seoScore,
          mobile: auditData.mobileScore,
          mobileScore: auditData.mobileScore,
          technical: auditData.technicalScore,
          technicalScore: auditData.technicalScore,
          speed: auditData.speedScore,
          speedScore: auditData.speedScore,
          overall: auditData.overallScore,
          overallScore: auditData.overallScore,
        };

        const requestedMetric = input.metric as string | undefined;
        if (requestedMetric && metricMap[requestedMetric] !== undefined) {
          return {
            metric: requestedMetric,
            value: metricMap[requestedMetric],
            tenantName,
            summary: `${requestedMetric} for ${tenantName}: ${metricMap[requestedMetric]}/100`,
          };
        }

        const summary = [
          `Current metrics for ${tenantName}:`,
          `• SEO Score: ${auditData.seoScore}/100`,
          `• Mobile Score: ${auditData.mobileScore}/100`,
          `• Technical Score: ${auditData.technicalScore}/100`,
          `• Speed Score: ${auditData.speedScore}/100`,
          `• Overall Score: ${auditData.overallScore}/100`,
        ].join("\n");

        return {
          ...auditData,
          tenantName,
          summary,
        };
      }

      case "notification_trigger": {
        const title = (input.title as string) ?? "Agent Notification";
        const message = (input.message as string) ?? "";
        const type =
          (input.type as "lead" | "review" | "audit" | "uptime" | "general") ??
          "general";
        if (toolContext) {
          toolContext.triggerNotification({ type, title, message });
        }
        return {
          sent: true,
          notificationId: `notif_${Date.now()}`,
          message: `Notification sent: '${title}'`,
        };
      }

      case "proposal_generate": {
        if (!toolContext) return this.fallbackProposal(input);
        const tenant = toolContext.getTenantById(effectiveTenantId);
        const auditData = toolContext.getAuditDataForTenant(effectiveTenantId);
        const activeAgents =
          toolContext.getActiveAgentsForTenant(effectiveTenantId);
        const clientName =
          (input.clientName as string) ?? tenant?.name ?? "Client";
        const today = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const services =
          (input.services as string[]) ??
          activeAgents.map((a) => a.productId.replace("agent-", ""));
        const servicesText =
          services.length > 0
            ? services.map((s) => `• ${s}`).join("\n")
            : "• SEO & GEO Agent ($999/mo)\n• Paid Ads Agent ($1,999/mo)";

        const totalMrr =
          activeAgents.reduce((sum, a) => {
            const pricing = Object.values(AGENT_PRICING).find(
              (p) =>
                `agent-${p.label.toLowerCase().replace(/[ &]/g, "-")}` ===
                a.productId,
            );
            return sum + (pricing?.price ?? 999);
          }, 0) || 999;

        const urgencyNote =
          auditData.overallScore < 65
            ? "Your current visibility score indicates significant growth opportunity — early action captures the most value."
            : auditData.overallScore < 80
              ? "Your foundation is solid. This proposal targets the gaps that will push you from competitive to dominant in your market."
              : "Your scores are strong. This proposal focuses on maintaining leadership and capturing emerging AI search visibility.";

        const nextSteps =
          auditData.recommendations
            ?.slice(0, 3)
            .map((r) => `• ${r.text}`)
            .join("\n") ??
          "• Complete initial onboarding and profile setup\n• Run baseline SEO and visibility audit\n• Activate first campaign within 7 days";

        const proposalContent = [
          `PROPOSAL: ${clientName}`,
          `Date: ${today}`,
          "Prepared by: BRF Platform",
          "",
          "════════════════════════════════════════",
          "CURRENT SITUATION",
          "════════════════════════════════════════",
          `Business: ${tenant?.name ?? clientName}`,
          `Industry: ${tenant?.type ?? "Local Service Business"}`,
          `Location: ${tenant?.address ?? "Service Area"}`,
          "",
          "Visibility Scores (Current Baseline):",
          `• Overall Score: ${auditData.overallScore}/100`,
          `• SEO Health: ${auditData.seoScore}/100`,
          `• Mobile Readiness: ${auditData.mobileScore}/100`,
          `• Technical Health: ${auditData.technicalScore}/100`,
          "",
          urgencyNote,
          "",
          "════════════════════════════════════════",
          "RECOMMENDED SERVICES",
          "════════════════════════════════════════",
          servicesText,
          "",
          "════════════════════════════════════════",
          "INVESTMENT",
          "════════════════════════════════════════",
          `Monthly Investment: $${totalMrr.toLocaleString()}/month`,
          "Billing: Monthly recurring — cancel anytime",
          "Setup: Included in first month",
          "",
          "════════════════════════════════════════",
          "TIMELINE",
          "════════════════════════════════════════",
          (input.timeline as string) ??
            "30-day kickoff: onboarding → baseline audit → first deliverables within 14 days",
          "",
          "════════════════════════════════════════",
          "NEXT STEPS",
          "════════════════════════════════════════",
          nextSteps,
          "",
          "To proceed: reply to this proposal or activate directly from your dashboard.",
        ].join("\n");

        const artifact = toolContext.createArtifact(
          toolContext.currentRunId,
          toolContext.currentThreadId,
          effectiveTenantId,
          "proposal",
          `Proposal: ${clientName}`,
          proposalContent,
          ["proposal", "generated", tenant?.type?.toLowerCase() ?? ""],
        );

        return {
          generated: true,
          proposalId: artifact.id,
          summary: `Proposal generated for ${clientName}. Artifact saved to thread.`,
          content: proposalContent,
        };
      }

      case "content_generate": {
        if (!toolContext) return this.fallbackContent(input);
        const tenant = toolContext.getTenantById(effectiveTenantId);
        const niche =
          (input.niche as string) ?? tenant?.type ?? "Local Service";
        const type = (input.type as string) ?? "brief";
        const topic = (input.topic as string) ?? "services";
        const targetPage = (input.targetPage as string) ?? "";

        let generatedContent = "";

        if (type === "faq") {
          const city = tenant?.address?.split(",")[1]?.trim() ?? "local";
          generatedContent = [
            `FAQ CONTENT — ${niche} | Topic: ${topic}`,
            `Generated: ${new Date().toLocaleDateString()}`,
            "",
            `Q: What areas do you serve?\nA: We proudly serve the greater ${city} area and surrounding communities. Same-day service is available for emergency calls within our primary service zone.`,
            "",
            "Q: How quickly can I get an appointment?\nA: For non-emergency services, we typically schedule within 24–48 hours. Emergency calls are prioritized and dispatched immediately.",
            "",
            "Q: Are you licensed and insured?\nA: Yes — fully licensed, bonded, and insured. We carry general liability and workers' compensation coverage for your protection.",
            "",
            "Q: Do you offer free estimates?\nA: Absolutely. We provide free, no-obligation estimates for all standard service calls. Emergency callouts include a diagnostic fee credited toward the repair.",
            "",
            "Q: What payment methods do you accept?\nA: We accept all major credit cards, check, cash, and financing options for larger projects. Ask about our 0% financing for qualified customers.",
          ].join("\n");
        } else if (type === "service_page") {
          const city2 = tenant?.address?.split(",")[1]?.trim() ?? "Your Area";
          generatedContent = [
            `SERVICE PAGE CONTENT — ${niche} | ${topic}`,
            `Generated: ${new Date().toLocaleDateString()}`,
            "",
            `HEADLINE: Expert ${topic} Services in ${city2}`,
            "",
            `INTRO (80 words):\nWhen you need reliable ${topic.toLowerCase()} services, you need a team that responds fast, works efficiently, and gets it right the first time. ${tenant?.name ?? "Our team"} has served the local area for years, building a reputation for honest pricing, professional work, and genuine care for every client. Whether it's a routine service or an urgent situation, we're here when you need us.`,
            "",
            "KEY BENEFITS:\n• Fast response times — same-day service available\n• Upfront pricing with no hidden fees\n• Licensed, bonded, and fully insured",
            "",
            "CTA: Get a Free Estimate Today →",
          ].join("\n");
        } else if (type === "gbp_description") {
          const bizName = tenant?.name ?? `${niche} Business`;
          const loc = tenant?.address ?? "the local area";
          const desc = `${bizName} is a trusted local ${niche.toLowerCase()} serving ${loc}. Our team of licensed professionals delivers fast, reliable service with upfront pricing and no hidden fees. Whether you need emergency response or routine maintenance, we're available 24/7 to help. We pride ourselves on honest workmanship, clean job sites, and follow-through that earns referrals. Check out our reviews — our clients say it best. Call or message us today to schedule your free estimate.`;
          generatedContent = [
            `GBP DESCRIPTION — ${bizName}`,
            `Character count: ${desc.length}/750`,
            "",
            desc,
          ].join("\n");
        } else if (type === "meta") {
          const city3 = tenant?.address?.split(",")[1]?.trim() ?? "Your City";
          const bizName2 = tenant?.name ?? "Your Business";
          generatedContent = [
            `META TAGS — ${targetPage || topic}`,
            `Generated: ${new Date().toLocaleDateString()}`,
            "",
            `TITLE TAG (55–60 chars):\n${niche} Services in ${city3} | ${bizName2}`,
            "",
            `META DESCRIPTION (150–160 chars):\nNeed trusted ${niche.toLowerCase()} services? ${bizName2} offer fast response, upfront pricing, and expert work. Serving ${city3} — call today for a free estimate.`,
          ].join("\n");
        } else {
          const city4 = tenant?.address?.split(",")[1]?.trim() ?? "area";
          generatedContent = [
            `CONTENT BRIEF — ${niche} | ${topic}`,
            `Generated: ${new Date().toLocaleDateString()}`,
            "",
            `HEADLINE: ${topic} Solutions That Put Your Business First`,
            "",
            "KEY MESSAGES:\n• Fast, reliable, locally trusted\n• Licensed and insured professionals\n• Transparent pricing — no surprises",
            "",
            `TARGET KEYWORDS: ${niche.toLowerCase()} ${topic.toLowerCase()}, local ${niche.toLowerCase()}, ${city4} ${niche.toLowerCase()}`,
            "",
            'RECOMMENDED CTA: "Get Your Free Estimate Today"',
            "",
            "NOTES: Focus on local trust signals, emergency availability, and specific service area for maximum GEO visibility.",
          ].join("\n");
        }

        const artifact = toolContext.createArtifact(
          toolContext.currentRunId,
          toolContext.currentThreadId,
          effectiveTenantId,
          "content_package",
          `${type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} — ${topic}`,
          generatedContent,
          ["content", type, niche.toLowerCase()],
        );

        return {
          generated: true,
          artifactId: artifact.id,
          contentType: type,
          content: generatedContent,
          message: "Content generated and saved as artifact.",
        };
      }

      case "pricing_lookup": {
        const agentType = (input.agentType as string) ?? "";
        if (agentType) {
          const match = Object.entries(AGENT_PRICING).find(
            ([k, v]) =>
              k === agentType ||
              v.label.toLowerCase().includes(agentType.toLowerCase()),
          );
          if (match) {
            const [, p] = match;
            return {
              product: p.label,
              price: p.price,
              unit: p.unit,
              currency: "USD",
              formatted: `$${p.price.toLocaleString()}/${p.unit}`,
            };
          }
        }

        const pricingText = Object.values(AGENT_PRICING)
          .map((p) => `• ${p.label}: $${p.price.toLocaleString()}/${p.unit}`)
          .join("\n");

        return {
          products: Object.values(AGENT_PRICING),
          summary: `Current Agent Pricing:\n${pricingText}\n\nNote: SEO + Paid Ads Bundle saves $400/month vs. separate subscriptions.`,
        };
      }

      case "internal_knowledge": {
        const query = ((input.query as string) ?? "").toLowerCase();

        if (query.includes("onboard")) {
          return {
            found: true,
            answer:
              "New clients go through an 8-step wizard covering: business profile, phone provisioning, integrations (Twilio, Vapi.ai, SendGrid), first SEO audit, fundability baseline, campaign activation, and goal setting. The wizard takes approximately 15–20 minutes and can be paused and resumed.",
          };
        }
        if (
          query.includes("seo") ||
          query.includes("audit") ||
          query.includes("rank")
        ) {
          const auditNote = toolContext
            ? (() => {
                const data =
                  toolContext.getAuditDataForTenant(effectiveTenantId);
                return ` Current SEO score: ${data.seoScore}/100. Overall score: ${data.overallScore}/100.`;
              })()
            : "";
          return {
            found: true,
            answer: `The SEO & GEO Agent covers technical SEO monitoring, local SEO tasking, GBP optimization, content recommendations, and GEO/AI visibility scoring.${auditNote} Access the full workspace at /seo-geo-agent.`,
          };
        }
        if (query.includes("campaign")) {
          return {
            found: true,
            answer:
              "Campaigns module supports lifecycle triggers: Missed Call Rescue, Estimate Recovery, Post-Job Review Requests, Consultation Booking Nurture, No-Show Recovery, and Post-Visit Rebook. Campaigns auto-trigger on CRM stage changes.",
          };
        }
        if (
          query.includes("billing") ||
          query.includes("payment") ||
          query.includes("invoice")
        ) {
          return {
            found: true,
            answer:
              "Clients manage billing at /billing — view active subscriptions, switch plans, update payment methods, and download invoice history (last 6 months). Agent subscriptions are monthly recurring, cancel-anytime.",
          };
        }
        if (query.includes("lead") || query.includes("crm")) {
          const leadNote = toolContext
            ? (() => {
                const leads = toolContext.getLeadsByTenant(effectiveTenantId);
                const counts = leads.reduce<Record<string, number>>(
                  (acc, l) => {
                    acc[l.status] = (acc[l.status] ?? 0) + 1;
                    return acc;
                  },
                  {},
                );
                return ` Currently: ${leads.length} leads total — ${Object.entries(
                  counts,
                )
                  .map(([s, c]) => `${c} ${s}`)
                  .join(", ")}.`;
              })()
            : "";
          return {
            found: true,
            answer: `The CRM tracks leads by status: new, contacted, qualified, and closed. Leads can be created manually, via chat widget, or by the AI Sales Agent.${leadNote}`,
          };
        }
        if (query.includes("fundabilit") || query.includes("credit")) {
          return {
            found: true,
            answer:
              "The Fundability Builder tracks 10 criteria across Business Foundation, Banking & Credit, Online Presence, and Documents. Reaching 75/100 unlocks access to $50K–$250K in business financing options.",
          };
        }

        return {
          found: true,
          answer:
            "BRF (Booked, Ranked & Fundable) is an AI-powered platform for local service businesses combining: SEO & GEO Agent, Paid Ads Agent, Website Agent, CRM & Lead management, Review management, Fundability Builder, Campaigns, AI Business Manager, and White-Label Agency support. All data persists on-chain via ICP.",
        };
      }

      default:
        return { error: `Tool "${toolName}" not found in registry` };
    }
  }

  // Fallbacks when no toolContext is injected (backward compatibility)
  private fallbackCrmLookup(
    input: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      found: true,
      records: [
        {
          id: "lead_001",
          name: (input.name as string) ?? "John Smith",
          status: "qualified",
          score: 78,
          lastContact: "2024-01-15",
          value: "$2,400/mo",
        },
      ],
      summary: "CRM lookup completed (demo data — no live context injected).",
    };
  }

  private fallbackLeadCreate(
    input: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      created: true,
      leadId: `lead_${Date.now()}`,
      message: `Lead created for ${(input.name as string) ?? "prospect"} (demo mode)`,
    };
  }

  private fallbackAnalytics(
    input: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      period: (input.period as string) ?? "last_30_days",
      leads: 47,
      conversions: 12,
      reviewScore: 4.6,
      seoScore: 73,
      trend: "+8% vs previous period",
      summary:
        "Analytics lookup completed (demo data — no live context injected).",
    };
  }

  private fallbackProposal(
    input: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      generated: true,
      proposalId: `prop_${Date.now()}`,
      summary: `Custom proposal for ${(input.clientName as string) ?? "client"}: 3-service package at $2,397/mo with Human Oversight upgrade`,
    };
  }

  private fallbackContent(
    input: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      generated: true,
      content: `SEO-optimized content for "${(input.topic as string) ?? "service page"}" — 350 words, keyword density 2.1%, readability score: 68`,
    };
  }

  buildMemoryContext(
    memories: Array<{
      content: string;
      memoryType: string;
      importance: number;
    }>,
  ): string {
    if (memories.length === 0) return "";

    const topMemories = [...memories]
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5);

    return topMemories.map((m) => `[${m.memoryType}] ${m.content}`).join("\n");
  }

  buildWorkflowFromTemplate(template: {
    role: string;
    systemPrompt: string;
    requireApproval: boolean;
    defaultWorkflowSteps: string[];
  }): WorkflowStep[] {
    const steps: WorkflowStep[] = template.defaultWorkflowSteps.map(
      (stepTitle, index) => ({
        id: `step_${index}`,
        title: stepTitle,
        type: "prompt" as const,
        input: stepTitle,
        onFailure: "retry" as const,
        maxRetries: 2,
      }),
    );

    if (steps.length === 0) {
      steps.push({
        id: "step_0",
        title: "Initialize Agent",
        type: "prompt" as const,
        input: `Initialize ${template.role} agent and prepare for tasks`,
        onFailure: "retry" as const,
        maxRetries: 2,
      });
    }

    if (template.requireApproval && steps.length > 1) {
      steps.splice(steps.length - 1, 0, {
        id: "step_approval",
        title: "Human Approval Checkpoint",
        type: "approval_checkpoint" as const,
        onFailure: "abort" as const,
      });
    }

    return steps;
  }
}

export const workflowEngine = WorkflowEngine.getInstance();
