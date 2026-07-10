# Specialized Agents Scaling Research

## Overview

This document covers the architecture and implementation roadmap for scaling BRF to a
full multi-agent system with 15 specialized agents, tenant isolation, and capability-based
dispatch — designed to operate across thousands of tenants on the Internet Computer.

---

## 15 Specialized Agent Definitions

### 1. Sales Agent
Manages the full inbound-to-booked pipeline. Answers calls, qualifies leads, books
appointments, sends confirmation sequences, and hands off warm leads to the human team
with context attached.

**Capabilities:** Voice call handling, lead qualification scoring, calendar integration,
SMS/email confirmation, warm handoff notification.

### 2. Marketing Agent
Generates and schedules multi-channel content (social posts, email newsletters, ad copy).
Runs A/B variant generation, tracks engagement signals, and surfaces highest-performing
content formats per niche.

**Capabilities:** Content generation (LLM), niche voice library, calendar management,
performance feedback loop.

### 3. SEO Agent
Audits Google Business Profile health, tracks local ranking positions, generates service-area
pages, and manages citation consistency across directories.

**Capabilities:** GBP audit, keyword rank tracking, NAP consistency check, service-area
page builder, competitor gap analysis.

### 4. Reputation Agent
Monitors review platforms (Google, Yelp, Facebook), generates AI-drafted replies,
flags negative reviews for escalation, and converts positive reviews into social proof content.

**Capabilities:** Review monitoring, AI reply generation, sentiment scoring, social proof
pipeline, escalation routing.

### 5. Website Agent
Manages the client's AI-built website: updates service pages, adds blog content, monitors
uptime and Core Web Vitals, and surfaces conversion rate issues.

**Capabilities:** Page generation, content update dispatch, uptime monitoring, CRO scoring.

### 6. Automation Agent
Manages workflow triggers, drip campaign execution, and integration health. Monitors
n8n/webhook pipelines and re-triggers failed workflows automatically.

**Capabilities:** Workflow trigger management, drip campaign scheduling, integration health
monitoring, failure recovery.

### 7. CRM Agent
Manages lead records, contact enrichment, pipeline stage updates, and follow-up task
creation. Syncs with external CRM systems when configured.

**Capabilities:** Lead CRUD, pipeline management, enrichment scoring, task creation, CRM sync.

### 8. Video Agent
Generates short-form video scripts, coordinates with ElevenLabs for voiceover, and queues
content for the social content calendar.

**Capabilities:** Script generation, voiceover synthesis, video queue management, social
calendar integration.

### 9. Funding Agent
Tracks business fundability score, surfaces readiness gaps, generates funding profile
documents, and notifies the client of relevant funding opportunities.

**Capabilities:** Fundability scoring, gap analysis, document generation, opportunity matching.

### 10. Customer Success Agent
Manages onboarding checklists, tracks feature adoption, sends health-check nudges, and
escalates at-risk accounts to the human CSM team.

**Capabilities:** Onboarding task tracking, adoption scoring, health check generation,
escalation routing.

### 11. Analytics Agent
Aggregates performance data across all channels (GBP, social, email, voice), generates
monthly performance reports, and surfaces anomalies for human review.

**Capabilities:** Multi-channel data aggregation, report generation, anomaly detection,
trend summarization.

### 12. Content Agent
Manages the 30-day social content calendar, generates niche-specific posts, schedules
publication, and tracks engagement outcomes.

**Capabilities:** Calendar management, niche content library, post scheduling, engagement
tracking.

### 13. Voice Agent
Handles inbound and outbound voice interactions using the configured voice model. Transcribes
calls, extracts action items, and syncs outcomes to the CRM.

**Capabilities:** Voice call handling, transcription, action item extraction, CRM sync.

### 14. Support Agent
Handles tier-1 support inquiries via chat widget and email. Escalates to human agents when
confidence is below threshold, with full conversation context attached.

**Capabilities:** Intent classification, FAQ resolution, escalation with context, ticket creation.

### 15. Operations Agent
Monitors canister health, billing status, feature flag state, and integration connectivity.
Surfaces operational alerts to the admin and auto-resolves known failure patterns.

**Capabilities:** Health monitoring, billing alerts, feature flag management, integration
connectivity checks, auto-remediation.

---

## Architecture Patterns

### Tenant Isolation

Each tenant's agent state is stored under a per-tenant key in stable memory. No cross-tenant
data access is possible at the data layer. Agent runs are tagged with `tenantId` and all
queries are scoped accordingly.

```
tenantId → AgentState {
  agentType: AgentType,
  lastRunAt: Time,
  memoryRefs: [MemoryEntry],
  taskQueue: [AgentTask],
  healthStatus: AgentStatus,
}
```

### Agent Registration

Agents are registered per tenant via `registerAgent(tenantId, agentType, config)`. The
registry stores capability metadata and the preferred model family for each agent type.
Agents can be enabled/disabled per tenant without affecting other tenants.

### Capability-Based Dispatch

The AI Orchestrator dispatches sub-tasks to agents based on `TaskCapability` matching:
- `maxTokens`: upper bound for the sub-task
- `temperature`: creativity vs. precision dial
- `modelFamily`: preferred provider (null = cost-optimize)

The LLM fallback chain (`Nemotron → OpenRouter → OpenAI → Anthropic`) resolves the actual
model at dispatch time, applying health checks and cost routing.

### Shared Memory

Agents share a tiered memory system:
- **Tenant-scoped memory**: facts about the business, niche, and preferences
- **Workflow-scoped memory**: state carried across a multi-step workflow run
- **Global memory**: shared knowledge (niche templates, platform guidelines)

Memory is read at the start of each orchestrator run and written at completion. The
`ai-memory.mo` library manages read/write/eviction.

### Task Contracts

Each agent exposes a typed `AgentTask` contract:
```
AgentTask {
  taskType: TaskType,
  tenantId: TenantId,
  priority: TaskPriority,
  input: Text,           // JSON-encoded task payload
  capability: ?TaskCapability,
  correlationId: Text,
}
```

Outputs are typed `AgentTaskResult` with `output`, `memoryRefs`, `validationStatus`, and
`correlationId` for end-to-end tracing.

---

## Mapping to the Existing BRF Codebase

| Specialized Agent | Existing BRF Module(s) |
|---|---|
| Sales | `brfSalesVoiceAgent.mo`, `bookedPipeline.mo`, `outreach.mo` |
| Marketing | `contentStudio.mo`, `campaignBuilder.mo`, `socialMedia.mo` |
| SEO | `localSEOAudit.mo`, `gbpOptimization.mo`, `serviceAreaSEO.mo` |
| Reputation | `reviewManagementAgent.mo`, `reputationSnapshot.mo` |
| Website | `lib/websiteAgentEngine.ts`, `domainSetup.mo` |
| Automation | `scheduledWorkflow.mo`, `workflowRecovery.mo`, `composio.mo` |
| CRM | `crmObjects.mo`, `leadEngine.mo`, `outreachPipeline` |
| Video | `contentCalendar.mo`, `socialPostDraft.mo` |
| Funding | `fundingProfile.mo`, `fundedReadiness.mo` |
| Customer Success | `trialProvisioning.mo`, `clientBrandOnboarding.mo` |
| Analytics | `performanceInsight.mo`, `monthlyReport.mo`, `analytics.mo` |
| Content | `contentCalendar.mo`, `socialContentCalendarAgent.mo` |
| Voice | `brfSalesVoiceAgent.mo`, `voiceOutreachAgent` |
| Support | `operatorChat.mo`, `masterAgent` |
| Operations | `observability.mo`, `integrationCredentials.mo`, `llm-fallback.mo` |

The AI Orchestrator (`ai-orchestrator.mo`) and LLM Fallback Router (`llm-fallback.mo`) are the
shared infrastructure through which all agents route LLM calls.

---

## 5-Phase Implementation Roadmap

### Phase 1 — Agent Registry & Task Contracts (Foundation)
- Define `AgentType` variant and `AgentTask` / `AgentTaskResult` types in a new
  `types/agent-registry.mo`
- Implement `lib/agent-registry.mo` with per-tenant register/enable/disable/list
- Add `registerAgent`, `listAgents`, `getAgentStatus` to the actor surface via a new
  `mixins/agent-registry-api.mo`
- Wire `AgentStatus` into the existing Master Agent panel (frontend already renders status dots)

**Outcome:** Tenants have a registry of agents with live status. No execution yet.

### Phase 2 — Dispatch Layer & Memory Integration
- Implement `lib/agent-dispatcher.mo`: receives `AgentTask`, looks up agent capability from
  registry, calls `AIOrchestratorLib.orchestrate` with the correct `TaskCapability`
- Wire dispatcher to the existing `ai-memory.mo` read/write callbacks
- Add `dispatchAgentTask` to the actor surface
- Frontend: add a "Run Agent" button on the Master Agent panel that dispatches a test task

**Outcome:** Tasks can be dispatched to any registered agent and routed through the orchestrator.

### Phase 3 — Per-Agent Implementations (Batched)
Implement each of the 15 agents as thin wrappers over existing BRF modules:
- Each agent's `execute` function assembles the prompt from existing module data, calls
  `dispatchAgentTask`, and writes the result to the appropriate module store
- Batch order: Sales, Marketing, SEO (highest business impact first), then remaining 12

**Outcome:** All 15 agents are executable end-to-end.

### Phase 4 — Scheduled Execution & Background Jobs
- Extend `scheduledWorkflow.mo` to support agent-type triggers (daily, weekly, on-event)
- Add per-tenant agent schedules: e.g., "run SEO Agent every Monday at 8 AM"
- Implement heartbeat monitoring: agents that haven't run within their schedule window surface
  a health alert in the Operations Agent

**Outcome:** Agents run autonomously on schedule without manual dispatch.

### Phase 5 — Multi-Tenant Scale Hardening
- Rate limiting per tenant per agent type (extend existing `rateLimiter.mo`)
- Audit trail for every agent run (extend `auditLog.mo` with `agentType` dimension)
- Cost attribution per tenant per agent (extend route log with cost estimates)
- Admin god-view dashboard: aggregate agent health across all tenants (Super Admin only)
- Load testing: simulate 1,000 concurrent tenants with 15 agents each to validate stable
  memory layout and cycle budget

**Outcome:** System is production-ready at thousands of tenants with full observability and cost
controls.

---

## Key Constraints

- All agent state must live in **stable memory** (survives canister upgrades)
- Agent runs are **async** — the actor dispatches and returns a `correlationId`; results are
  fetched via a separate `getAgentRunResult(correlationId)` call
- No cross-tenant memory reads — the registry enforces tenant isolation at every layer
- The LLM fallback chain is the **single LLM entry point** — no agent calls a provider directly
- Rate limits apply per tenant per agent type, not globally, to prevent one tenant from
  saturating the LLM budget
