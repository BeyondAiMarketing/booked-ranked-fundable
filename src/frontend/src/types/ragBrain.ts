// ── RAG Brain Types ──────────────────────────────────────────────────────────

export type ProviderType = "NVIDIA" | "OpenAI" | "Claude" | "Cached";

export type TaskCategory =
  | "embedding"
  | "completion"
  | "reranking"
  | "document_extraction"
  | "summarization"
  | "classification";

export type CollectionName =
  | "SalesScripts"
  | "FundingPlaybooks"
  | "NicheTemplates"
  | "ClientContracts"
  | "CallTranscripts"
  | "ReviewResponses"
  | "OnboardingGuides"
  | "CompetitorIntel"
  | "PricingGuides"
  | "ObjectionHandlers"
  | "CaseStudies"
  | "EmailSequences"
  | "SocialContent"
  | "SopLibrary"
  | "Custom";

export const ALL_COLLECTIONS: CollectionName[] = [
  "SalesScripts",
  "FundingPlaybooks",
  "NicheTemplates",
  "ClientContracts",
  "CallTranscripts",
  "ReviewResponses",
  "OnboardingGuides",
  "CompetitorIntel",
  "PricingGuides",
  "ObjectionHandlers",
  "CaseStudies",
  "EmailSequences",
  "SocialContent",
  "SopLibrary",
  "Custom",
];

export interface DocumentChunk {
  id: string;
  collectionName: CollectionName;
  sourceDocumentId: string;
  content: string;
  chunkIndex: number;
  embedding: number[];
  tenantId: string;
  createdAt: bigint;
}

export interface KnowledgeDocument {
  id: string;
  collectionName: CollectionName;
  title: string;
  sourceType: "Manual" | "Upload" | "Url" | "Generated";
  contentPreview: string;
  chunkCount: number;
  tenantId: string;
  uploadedAt: bigint;
  uploadedBy: string;
}

export interface RAGQueryResult {
  chunks: DocumentChunk[];
  citations: string[];
  isInsufficient: boolean;
  insufficiencyMessage: string;
  answer: string;
}

export type AgentNodeType =
  | "LeadEnrichment"
  | "ProposalGenerator"
  | "FollowUpWriter"
  | "ReviewResponder"
  | "SocialPostCreator"
  | "CallSummarizer"
  | "ObjectionHandler"
  | "ReportNarrator";

export interface AgentNodeRun {
  id: string;
  nodeType: AgentNodeType;
  inputData: string;
  outputData: string;
  provider: ProviderType;
  tenantId: string;
  startedAt: bigint;
  completedAt?: bigint;
  success: boolean;
  errorMessage?: string;
}

export type AutomationTrigger =
  | "DocumentUploaded"
  | "TrialActivated"
  | "CallLogCreated";

export interface AutomationConfig {
  trigger: AutomationTrigger;
  isEnabled: boolean;
  requiresApproval: boolean;
  tenantId: string;
}

export interface AutomationRun {
  id: string;
  trigger: AutomationTrigger;
  status: "Running" | "Success" | "Failed" | "PendingApproval";
  tenantId: string;
  startedAt: bigint;
  completedAt?: bigint;
  outputSummary?: string;
  errorMessage?: string;
}

export interface AIUsageLog {
  id: string;
  taskCategory: TaskCategory;
  provider: ProviderType;
  inputTokens: number;
  outputTokens: number;
  tenantId: string;
  loggedAt: bigint;
  success: boolean;
  errorMessage?: string;
}

export interface ConversationMessage {
  id: string;
  role: "User" | "Assistant";
  content: string;
  citations: string[];
  tenantId: string;
  sessionId: string;
  timestamp: bigint;
}

export interface ProviderConfig {
  providerType: ProviderType;
  apiKeyObfuscated: string;
  baseUrl?: string;
  modelName?: string;
  isActive: boolean;
  lastPingStatus: "ok" | "error" | "untested";
  lastPingTimestamp?: bigint;
}

export interface VectorIndexStatus {
  totalChunks: number;
  totalDocuments: number;
  collectionsCount: number;
  lastUpdated?: number;
}
