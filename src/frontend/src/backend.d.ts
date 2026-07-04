import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NewsletterCampaign {
    id: string;
    htmlBody: string;
    status: CampaignStatus;
    fromEmail?: string;
    subject: string;
    name: string;
    tags: Array<string>;
    sentAt?: bigint;
    tenantId: string;
    stats: NewsletterCampaignStats;
    fromName?: string;
    plainTextBody?: string;
    scheduledAt?: bigint;
}
export interface ReplyAnalysis {
    suggestedResponse: string;
    summary: string;
    leadId: string;
    analyzedAt: bigint;
    replyId: string;
    classification: ReplyClassification;
}
export interface OutreachEvent {
    id: string;
    touchNumber: bigint;
    utmMedium: string;
    metadata: Array<[string, string]>;
    utmSource: string;
    leadId: string;
    niche: string;
    timestamp: bigint;
    sequenceId: string;
    utmCampaign: string;
    eventType: string;
}
export interface SocialPresence {
    linkedin: boolean;
    gmbUrl: string;
    instagram: boolean;
    yelpUrl: string;
    facebook: boolean;
    napConsistent: boolean;
    facebookUrl: string;
    googleMaps: boolean;
}
export interface OperatorChatMessage {
    id: string;
    content: string;
    createdAt: Time;
    role: string;
    commandType?: string;
}
export interface CampaignMetrics {
    opened: bigint;
    unsubscribed: bigint;
    sent: bigint;
    converted: bigint;
    clicked: bigint;
}
export interface AgentMemory {
    conversationHistory: Array<ConversationEntry>;
    lastUpdated: bigint;
    tenantId: string;
    summary?: string;
    agentNotes?: string;
    threadId: string;
}
export interface AbacusRouteResponse {
    selectedModel: string;
    tokensUsed: bigint;
    routingReason: string;
    response: string;
}
export interface WhiteLabelConfig {
    emailSenderName: string;
    active: boolean;
    onboardingLink: string;
    domain: string;
    tagline: string;
    primaryColor: string;
    logo: string;
    tenantId: TenantId;
    updatedAt: Time;
    clientBrandingOverrides: Array<[string, string]>;
    agencyName: string;
    secondaryColor: string;
    heroHeadline: string;
    emailSenderAddress: string;
    subdomain: string;
}
export interface Lead {
    id: string;
    status: string;
    source: string;
    name: string;
    createdAt: Time;
    email: string;
    tenantId: TenantId;
    niche: string;
    notes: string;
    phone: string;
    agentSubscriptions: Array<string>;
}
export interface SocialPostDraft {
    id: string;
    cta: string;
    status: DraftStatus;
    content: string;
    hashtags: Array<string>;
    n8nStatus?: string;
    approvedAt?: bigint;
    approvedBy?: string;
    createdAt: bigint;
    publishedUrl?: string;
    platform: DraftPlatform;
    tenantId: string;
    entryId?: string;
    updatedAt: bigint;
    ctaUrl: string;
    calendarId?: string;
    mediaUrls: Array<string>;
    scheduledAt?: bigint;
}
export interface CustomFieldValue {
    id: string;
    clientBusinessId: string;
    value: string;
    createdAt: bigint;
    updatedAt: bigint;
    entityId: string;
    customFieldId: string;
    entityType: string;
}
export interface NicheScript {
    voiceName: string;
    nicheId: string;
    lines: Array<ScriptLine>;
    elevenLabsVoiceId: string;
}
export interface CampaignTemplate {
    id: string;
    active: boolean;
    name: string;
    createdAt: Time;
    tags: Array<string>;
    segments: Array<string>;
    channels: Array<string>;
    steps: Array<string>;
    goals: Array<string>;
    niche: string;
    campaignType: string;
    triggers: Array<string>;
}
export interface PaidAdsDeliverable {
    id: string;
    status: string;
    month: string;
    title: string;
    deliveredAt: Time;
    tenantId: TenantId;
    summary: string;
    deliverableType: string;
}
export interface MarketingAuditUpdate {
    serviceArea?: string;
    status?: MarketingAuditStatus;
    leadValue?: bigint;
    recommendedPackage?: string;
    overallScore?: bigint;
    offer?: string;
    estimatedRevenueImpact?: string;
    brfScore?: BRFScore;
    targetCustomer?: string;
    proposalReadySummary?: string;
    website?: string;
    updatedAt?: bigint;
    goals?: Array<string>;
    grade?: string;
    executiveSummary?: string;
    conversionGoal?: string;
    quickWins?: Array<string>;
    categoryScores?: Array<MarketingAuditScore>;
    knownCompetitors?: Array<string>;
    strategicRecommendations?: Array<string>;
    longTermInitiatives?: Array<string>;
    industry?: string;
}
export interface SubscriberImportResult {
    imported: bigint;
    skipped: bigint;
    errors: Array<string>;
}
export interface SeoGeoReport {
    id: string;
    month: string;
    nextSteps: Array<string>;
    createdAt: Time;
    tenantId: TenantId;
    highlights: Array<string>;
    issues: Array<string>;
    summary: string;
}
export interface WarmSequenceEmailSchedule {
    id: string;
    status: string;
    enrollmentId: string;
    subject: string;
    body: string;
    recipient: string;
    delayHours: bigint;
    touchIndex: bigint;
    sendAfter: bigint;
    scheduledAt: bigint;
}
export interface LocationSummary {
    city: string;
    score: bigint;
    rankingPosition: bigint;
    locationId: string;
    reviewCount: bigint;
    locationName: string;
    avgRating: number;
}
export type TenantId = string;
export interface SocialComment {
    id: string;
    responded: boolean;
    authorId: string;
    createdAt: bigint;
    authorName: string;
    leadCreated: boolean;
    platform: SocialPlatform;
    tenantId: string;
    aiDraftResponse: string;
    intent: CommentIntent;
    commentText: string;
    respondedAt?: bigint;
    postId: string;
}
export interface RobotsCheckResult {
    url: string;
    allowed: boolean;
    reason: string;
}
export interface ReplyInboxItem {
    id: string;
    status: string;
    draftResponse: string;
    leadName: string;
    leadNiche: string;
    receivedAt: bigint;
    leadId: string;
    replyBody: string;
    classification: string;
}
export interface EnrollmentResult {
    errors: Array<string>;
    skippedCount: bigint;
    enrolledCount: bigint;
}
export interface SenderSubdomainRecord {
    status: Variant_warming_active_flagged_paused;
    bounceRate: number;
    maxDailyVolume: bigint;
    complaintRate: number;
    sentToday: bigint;
    warmupDay: bigint;
    subdomain: string;
}
export interface ContractField {
    name: string;
    description: string;
    required: boolean;
    fieldType: string;
}
export interface ContentGenerationRequest {
    accountId: string;
    contentType: ContentType;
    additionalContext?: string;
    niche: string;
    prompt: string;
}
export interface WarmSequenceEmailEvent {
    id: string;
    enrollmentId: string;
    occurredAt: bigint;
    touchIndex: bigint;
    eventType: string;
}
export interface ComplianceConfig {
    maxBounceRate: number;
    businessName: string;
    unsubscribeBase: string;
    physicalAddress: string;
    adminEmail: string;
    softBounceRetries: bigint;
    maxComplaintRate: number;
}
export interface LLMLeadSearchResult {
    totalFound: bigint;
    enrichedCount: bigint;
    tinyFishCount: bigint;
    errors: Array<string>;
    openAICount: bigint;
    leads: Array<GeneratedLead>;
    claudeCount: bigint;
    searchedAt: bigint;
    serpApiUsed: boolean;
    serpApiCount: bigint;
}
export interface BatchAuditJob {
    id: string;
    status: string;
    completedAt?: bigint;
    failedLeads: bigint;
    createdAt: bigint;
    processedLeads: bigint;
    tenantId: string;
    totalLeads: bigint;
    completedLeads: bigint;
}
export interface AuditSnapshot {
    reputationScore: bigint;
    overallScore: bigint;
    websiteScore: bigint;
    seoScore: bigint;
}
export interface SeoGeoIssue {
    id: string;
    status: string;
    issueType: string;
    title: string;
    affectedArea: string;
    owner: string;
    createdAt: Time;
    dueDate?: Time;
    description: string;
    tenantId: TenantId;
    updatedAt: Time;
    suggestedFix: string;
    severity: string;
}
export interface Opportunity {
    id: string;
    probability: bigint;
    closeDate: bigint;
    clientBusinessId: string;
    title: string;
    value: bigint;
    createdAt: bigint;
    updatedAt: bigint;
    stage: OpportunityStage;
    notes: string;
    contactId: string;
    companyId: string;
}
export interface PlatformFormatting {
    hashtags: Array<string>;
    mediaUrl?: string;
    firstComment?: string;
    altText?: string;
}
export interface ReportSchedule {
    monthlyEnabled: boolean;
    deliveryHour: bigint;
    tenantId: string;
    deliveryDayOfWeek: bigint;
    weeklyEnabled: boolean;
    lastGeneratedAt?: bigint;
}
export type ContentHistoryEntry = string;
export interface AgentThread {
    id: string;
    status: Variant_active_archived_paused;
    title: string;
    createdAt: bigint;
    agentType: string;
    tenantId: string;
    summary?: string;
    updatedAt: bigint;
    messageCount: bigint;
    agentNotes?: string;
}
export interface WebsitePageQueueItem {
    id: string;
    updateType: string;
    status: string;
    assignee: string;
    createdAt: Time;
    dueDate?: Time;
    description: string;
    tenantId: TenantId;
    updatedAt: Time;
    waitingOnClient: boolean;
    pageUrl: string;
    pageTitle: string;
    priority: string;
}
export interface OperatorReportData {
    generated_at: Time;
    report_type: string;
    sections: Array<[string, string]>;
}
export interface Estimate {
    id: string;
    customerName: string;
    status: EstimateStatus;
    lineItems: Array<EstimateLineItem>;
    total: number;
    approvalNotes: string;
    createdAt: bigint;
    taxTotal: number;
    tenantId: string;
    updatedAt: bigint;
    rejectedAt?: bigint;
    notes: string;
    customerId: string;
    acceptedAt?: bigint;
    customerEmail: string;
    subtotal: number;
}
export interface OperatorCommandResult {
    requires_confirmation: boolean;
    intent: string;
    affected_count: bigint;
    recommended_actions: Array<string>;
    affected_niche: string;
}
export interface ScanModel {
    id: string;
    status: string;
    title: string;
    thumbnailUrl: string;
    description: string;
    tenantId: string;
    viewCount: bigint;
    niche: string;
    photoCount: bigint;
    modelUrl: string;
    crmLinked: boolean;
    uploadedAt: bigint;
}
export interface EmailTemplateExt {
    id: bigint;
    day: bigint;
    unsubscribeFooter?: boolean;
    consentRequired?: boolean;
    fallbackBody: string;
    subject: string;
    body: string;
    verticalProfileId?: string;
    updatedAt: bigint;
    campaignType?: CampaignType;
    complianceNotes?: string;
    fallbackSubject: string;
}
export interface BrfOutboundCallAttempt {
    id: string;
    convertedToTrial: boolean;
    callStatus: BrfCallStatus;
    prospectSlug: string;
    vapiCallId?: string;
    triggeredAt: bigint;
    smsFallbackSentAt?: bigint;
    attemptNumber: bigint;
}
export interface ApprovalItem {
    id: string;
    status: ApprovalStatus;
    action: string;
    approverNotes?: string;
    tier: ApprovalTier;
    tenantId: string;
    threadId: string;
    runId: string;
    requestedAt: bigint;
    requestedBy: string;
    resolvedAt?: bigint;
    reason: string;
}
export interface ApiPingRecord {
    status: string;
    errorMessage?: string;
    latencyMs: bigint;
    serviceId: string;
    lastPingTime: bigint;
}
export interface AccountBrief {
    performanceHistory: Array<string>;
    doRules: Array<string>;
    sessionLog: Array<string>;
    respondTo: Array<string>;
    accountId: string;
    ignoreList: Array<string>;
    differentiators: Array<string>;
    tone: string;
    targetAudience: Array<string>;
    offerSummary: string;
    doNotRespondList: Array<string>;
    updatedAt: bigint;
    updatedBy: string;
    priorityContacts: Array<string>;
    flagKeywords: Array<string>;
    contentHistory: Array<string>;
    brandVoice: string;
    services: Array<string>;
    dontRules: Array<string>;
    positioning: string;
}
export interface GridAuditResult {
    gridPoints: Array<GridPoint>;
    coverageZoneSummary: string;
    scannedAt: bigint;
    city: string;
    leadEmail: string;
    businessName: string;
    state: string;
}
export interface PaymentMethod {
    cardBrand: string;
    expYear: bigint;
    tenantId: TenantId;
    expMonth: bigint;
    isDefault: boolean;
    cardLast4: string;
}
export interface LeadAuditJob {
    id: string;
    status: string;
    completedAt?: bigint;
    websiteUrl: string;
    city?: string;
    createdAt: bigint;
    errorMessage?: string;
    businessName: string;
    email?: string;
    tenantId: string;
    niche: string;
    phone?: string;
    stageProgress: string;
}
export interface ContactUpdate {
    nurtureStatus?: string;
    title?: string;
    email?: string;
    notes?: string;
    leadSource?: string;
    phone?: string;
    lastName?: string;
    industry?: string;
    firstName?: string;
}
export interface BulkToggleRequest {
    tierId: string;
    enabled: boolean;
    toolkitNames: Array<string>;
}
export interface FeatureFlags {
    crm: boolean;
    social: boolean;
    analytics: boolean;
    reputation: boolean;
    voiceAgent: boolean;
    creditBuilder: boolean;
}
export interface ProposalSection {
    title: string;
    order: bigint;
    body: string;
}
export interface ScrapeResult {
    ok: boolean;
    requestUrl: string;
    httpStatus?: bigint;
    isDynamic: boolean;
    errorMessage?: string;
    leads: Array<ScrapedLead>;
    error?: ScrapeError;
    items: Array<ScrapeItem>;
    durationMs: bigint;
    scrapedAt: Time;
    finalUrl: string;
}
export interface WebsiteDeliverable {
    id: string;
    status: string;
    month: string;
    title: string;
    deliveredAt: Time;
    tenantId: TenantId;
    summary: string;
    deliverableType: string;
}
export interface ScheduledPost {
    id: string;
    status: ScheduledPostStatus;
    content: string;
    createdAt: bigint;
    platformFormatting: PlatformFormatting;
    platform: SocialPlatform;
    tenantId: string;
    updatedAt: bigint;
    scheduledAt: bigint;
}
export interface AgentSessionState {
    startedAt: bigint;
    lastSeenAt: bigint;
    userId: string;
    isActive: boolean;
    sessionId: string;
}
export interface ApprovalResolution {
    status: ApprovalStatus;
    notes?: string;
}
export interface VapiProvisioningStatus {
    status: Variant_provisioning_active_notConfigured_error;
    errorMessage?: string;
    assistantId?: string;
    lastSynced?: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface VapiCallLog {
    id: string;
    status: string;
    direction: string;
    duration: bigint;
    callerPhone: string;
    endedAt?: bigint;
    recordingUrl?: string;
    recordedAt: bigint;
    tenantId: string;
    callId: string;
    transcript: string;
}
export interface AttributionTouch {
    utmParams: string;
    source: string;
    campaignId: string;
    timestamp: bigint;
    channel: string;
}
export interface DualModelSearchJobUpdate {
    status?: Variant_pending_completed_failed_running;
    completedAt?: bigint;
    duplicatesRemoved?: bigint;
    errorMessage?: string;
    totalLeadsStaged?: bigint;
    claudeLeadsFound?: bigint;
    openaiLeadsFound?: bigint;
}
export interface AbacusConfig {
    fallbackModels: Array<string>;
    routingEnabled: boolean;
    totalRoutedCalls: bigint;
    apiKey: string;
    callsToday: bigint;
    lastPingStatus: string;
    lastTestedAt?: bigint;
    preferredModel: string;
}
export interface Review {
    id: string;
    createdAt: Time;
    sentiment: string;
    aiDraftedResponse: string;
    platform: string;
    tenantId: TenantId;
    comment: string;
    rating: bigint;
    respondedAt?: Time;
}
export interface WebhookContract {
    id: string;
    method: HttpMethod;
    clientBusinessIdField?: string;
    approvalRequestIdField?: string;
    verticalProfileIdField?: string;
    endpoint: string;
    createdAt: bigint;
    requiredFields: Array<ContractField>;
    updatedAt: bigint;
    optionalFields: Array<ContractField>;
    supportsDryRun: boolean;
    category: WebhookCategory;
    requiresApproval: boolean;
    successResponse: string;
    workflowLogUpdateType?: string;
    retryStrategy?: string;
    purpose: string;
    recordIdField?: string;
    errorResponse: string;
}
export interface ApprovalItemRecord {
    id: string;
    status: string;
    resolutionNote?: string;
    title: string;
    tier: string;
    actionType: string;
    description: string;
    agentId: string;
    tenantId: string;
    priority: string;
    threadId: string;
    runId: string;
    requestedAt: bigint;
    resolvedAt?: bigint;
    resolvedBy?: string;
}
export interface SeoGeoVisibilitySnapshot {
    id: string;
    answerReadiness: bigint;
    citationScore: bigint;
    recordedAt: Time;
    aiVisibilityScore: bigint;
    tenantId: TenantId;
    brandConsistency: bigint;
    entityClarity: bigint;
}
export interface IntegrationTestResult {
    provider: string;
    testedAt: bigint;
    latencyMs?: bigint;
    message: string;
    connected: boolean;
}
export interface LeadAIEnrichment {
    model: string;
    leadId: string;
    companyIntel: string;
    decisionMakerInfo: string;
    enrichedAt: bigint;
    webPresence: string;
}
export interface TrialProvisionRequest {
    city: string;
    businessName: string;
    email: string;
    website?: string;
    leadId: string;
    niche: string;
    phone?: string;
}
export interface DograhCreateAgentRequest {
    nlCommand: string;
    name: string;
    description: string;
    niche: string;
}
export interface IntegrationCredentials {
    serpApiKey: string;
    geminiApiKey: string;
    serpApiDevKey: string;
    claudeKey: string;
    twilioSid: string;
    sendgridInboundParseDomain: string;
    dograhApiKey: string;
    yelpApiKey: string;
    vapiWebhookSecret: string;
    googleClientId: string;
    n8nInstanceUrl: string;
    abacusApiKey: string;
    twilioAuth: string;
    composioApiKey: string;
    searxngUrl: string;
    neverBounceKey: string;
    autoBrowserUrl: string;
    elevenLabsKey: string;
    facebookAppId: string;
    emailSmtpHost: string;
    emailSmtpPass: string;
    emailSmtpPort: string;
    emailSmtpUser: string;
    openRouterApiKey: string;
    elevenLabsVoiceId: string;
    listmonkUrl: string;
    litellmKey: string;
    litellmUrl: string;
    hunterApiKey: string;
    perplexityApiKey: string;
    vapiKey: string;
    listmonkPass: string;
    listmonkUser: string;
    sendgridKey: string;
    n8nApiKey: Uint8Array;
    tinyFishKey: string;
    googleClientSecret: string;
    twilioNumber: string;
    nvidiaApiKey: Uint8Array;
    facebookAppSecret: string;
    composioWebhookSecret: string;
    stripeKey: string;
    ollamaUrl: string;
    stripeWebhookSecret: string;
    nvidiaNimApiKey: string;
    openaiKey: string;
}
export interface NoteUpdate {
    title?: string;
    authorId?: string;
    body?: string;
    relatedToType?: string;
    category?: NoteCategory;
    relatedToId?: string;
}
export interface ReadinessScore {
    breakdown: Array<ReadinessBreakdownItem>;
    score: bigint;
    autoBrowserConfigured: boolean;
}
export interface PaidAdsAudience {
    id: string;
    cpa: string;
    status: string;
    performanceRating: string;
    name: string;
    roas: string;
    size: bigint;
    segmentType: string;
    tenantId: TenantId;
    updatedAt: Time;
}
export interface BrandKitProspect {
    id: string;
    auditScore?: bigint;
    outreachKitSentAt?: bigint;
    convertedAt?: bigint;
    city: string;
    createdAt: bigint;
    businessName: string;
    utmSource?: string;
    vapiAssistantId?: string;
    website?: string;
    kitPageSlug: string;
    trialDay: bigint;
    niche: string;
    activationAction?: string;
    phone: string;
    lastActivityAt?: bigint;
    utmCampaign?: string;
    trialStartedAt?: bigint;
    outreachKitOpenedAt?: bigint;
    trialExpiresAt?: bigint;
    featuresUsed: Array<string>;
    trialStatus: TrialStatus__1;
    firstName: string;
}
export interface RankedDispatchRoute {
    id: string;
    status: RankedDispatchStatus;
    clientBusinessId: string;
    createdAt: bigint;
    verticalProfileId: string;
    updatedAt: bigint;
    notes: Array<string>;
    matchedAgent: string;
    requestText: string;
}
export interface ToolkitToggle {
    appliedAt: bigint;
    tierId: string;
    enabled: boolean;
    toolkitName: string;
}
export interface FunnelEvent {
    metadata?: string;
    step: FunnelStepType;
    leadId: string;
    timestamp: bigint;
}
export interface ReviewSyncRecord {
    id: string;
    sentimentScore: number;
    createdAt: bigint;
    sentiment: ReviewSentiment;
    platformResponse?: string;
    reviewerName: string;
    platform: ReviewPlatform;
    tenantId: string;
    comment: string;
    platformReviewId: string;
    lastSyncAt: bigint;
    rating: bigint;
    respondedAt?: bigint;
}
export interface AgentTemplateRecord {
    id: string;
    approvalRequired: boolean;
    name: string;
    createdAt: bigint;
    role: string;
    tenantId: string;
    allowedTools: Array<string>;
    systemPrompt: string;
    isDefault: boolean;
    defaultWorkflowSteps: Array<string>;
    memoryMode: MemoryMode;
}
export interface CustomFieldValueUpdate {
    value?: string;
}
export interface AgentSubscription {
    id: string;
    status: string;
    humanOversightEnabled: boolean;
    productId: string;
    tenantId: TenantId;
    updatedAt: Time;
    notes: string;
    price: bigint;
    assignedStrategist: string;
    startDate: Time;
}
export interface GeneratedLead {
    ownerFirstName: string;
    source: string;
    temperature: string;
    city: string;
    name: string;
    description: string;
    website: string;
    score: bigint;
    niche: string;
    address: string;
    enriched: boolean;
    phone: string;
}
export interface NewsletterCampaignStats {
    bounceCount: bigint;
    unsubscribeCount: bigint;
    sentCount: bigint;
    complaintCount: bigint;
    clickCount: bigint;
    openCount: bigint;
}
export interface WorkflowLogEntry {
    id: string;
    status: WorkflowStatus;
    action: string;
    stepIndex: bigint;
    createdAt: bigint;
    agentType: string;
    tenantId: string;
    notes: string;
    inputRef?: string;
    outputRef?: string;
    workflowId: string;
}
export interface WebhookExecution {
    id: string;
    status: Variant_cancelled_pending_success_failed;
    completedAt?: bigint;
    result?: string;
    clientBusinessId: string;
    approvedAt?: bigint;
    approvedBy?: string;
    isDryRun: boolean;
    createdAt: bigint;
    verticalProfileId?: string;
    recordId?: string;
    callbackUrl?: string;
    approvalRequestId?: string;
    errorMsg?: string;
    payload: Array<[string, string]>;
    contractId: string;
}
export interface PaidAdsScore {
    id: string;
    accountHealth: bigint;
    audienceQuality: bigint;
    recordedAt: Time;
    tenantId: TenantId;
    budgetUtilization: bigint;
    roasEfficiency: bigint;
}
export interface MultiLocationReport {
    id: string;
    clientBusinessId: string;
    rankingTrend: TrendDirection;
    overallScore: bigint;
    createdAt: bigint;
    locationCount: bigint;
    reviewTrend: TrendDirection;
    locations: Array<LocationSummary>;
    brandName: string;
    citationTrend: TrendDirection;
}
export interface DograhCommandResult {
    nodesCreated: bigint;
    agentId?: string;
    message: string;
    success: boolean;
}
export interface ContentGenerationResult {
    id: string;
    status: GenerationStatus;
    output: string;
    accountId: string;
    contentType: ContentType;
    generatedAt: bigint;
    mediaUrl?: string;
    niche: string;
    prompt: string;
    errorMsg?: string;
}
export interface ContentCalendarEntry {
    id: string;
    cta: string;
    day: bigint;
    topic: string;
    angle: string;
    objective: ContentObjective;
    createdAt: bigint;
    platform: string;
    tenantId: string;
    approvalStatus: CalendarApprovalStatus;
    updatedAt: bigint;
    pillar: ContentPillar;
    visualDirection: string;
    calendarId: string;
    format: PostFormat;
}
export interface IntegrationHealthSummary {
    failedWebhookCounts: Array<[string, bigint]>;
    secondary: Array<IntegrationTestResult>;
    critical: Array<IntegrationTestResult>;
}
export interface BatchScrapeUrlResult {
    url: string;
    result: ScrapeResult;
}
export interface AgentDeliverable {
    id: string;
    status: string;
    month: string;
    title: string;
    deliveredAt: Time;
    tenantId: TenantId;
    subscriptionId: string;
    summary: string;
    notes: string;
    deliverableType: string;
    scoreImpact?: bigint;
    attachments: Array<string>;
}
export interface SeoGeoOpportunity {
    id: string;
    status: string;
    title: string;
    likelyImpact: string;
    effortLevel: string;
    createdAt: Time;
    tenantId: TenantId;
    opportunityType: string;
    nextStep: string;
    reason: string;
}
export interface SocialLead {
    id: string;
    contactInfo: string;
    createdAt: bigint;
    engagementType: SocialEngagementType;
    platform: SocialPlatform;
    tenantId: string;
    crmLeadId?: string;
    sourcePostId: string;
}
export interface MultiLocationReportUpdate {
    rankingTrend?: TrendDirection;
    overallScore?: bigint;
    locationCount?: bigint;
    reviewTrend?: TrendDirection;
    locations?: Array<LocationSummary>;
    brandName?: string;
    citationTrend?: TrendDirection;
}
export type EmailSendResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface PipelineFunnelStats {
    leadsSourced: bigint;
    warmSequenceActive: bigint;
    auditCompleted: bigint;
    demoVisited: bigint;
    auditStarted: bigint;
    callBooked: bigint;
    niche: string;
    contacted: bigint;
}
export interface AgentArtifact {
    id: string;
    status: ArtifactStatus;
    title: string;
    artifactType: ArtifactType;
    content: string;
    createdAt: bigint;
    tags: Array<string>;
    tenantId: string;
    updatedAt: bigint;
    threadId: string;
    runId: string;
}
export interface PerformanceInsight {
    id: string;
    metricValue: string;
    period: string;
    createdAt: bigint;
    platform: string;
    tenantId: string;
    isBestPerformer: boolean;
    insight: string;
    metricName: string;
    recommendation: string;
    reportId: string;
}
export interface FundabilityScore {
    lastUpdated: Time;
    timelinePhase: bigint;
    tenantId: TenantId;
    score: bigint;
    eligibilityPhase: bigint;
    creditworthinessPhase: bigint;
}
export interface SocialPost {
    id: string;
    status: PostStatus;
    beforeAfterPhoto?: string;
    content: string;
    funnelStage: FunnelStage;
    engagementMetrics: PostEngagementMetrics;
    createdAt: bigint;
    tags: Array<string>;
    publishedAt?: bigint;
    tenantId: string;
    marketingFramework: MarketingFramework;
    ctaType: string;
    platforms: Array<SocialPlatform>;
    niche: string;
    ctaUrl: string;
    scheduledAt?: bigint;
}
export interface TriggerRuleUpdate {
    action?: string;
    name?: string;
    actionType?: string;
    conditionType?: string;
    isEnabled?: boolean;
    condition?: string;
}
export interface OpportunityUpdate {
    probability?: bigint;
    closeDate?: bigint;
    title?: string;
    value?: bigint;
    stage?: OpportunityStage;
    notes?: string;
    contactId?: string;
    companyId?: string;
}
export interface WebsiteAgentScore {
    id: string;
    technicalHealth: bigint;
    ctaStrength: bigint;
    recordedAt: Time;
    tenantId: TenantId;
    contentQuality: bigint;
    trustAuthority: bigint;
    trustSignals: bigint;
    conversionReadiness: bigint;
}
export interface SocialROIMetrics {
    leadsFromSocial: bigint;
    commentsMissed: bigint;
    topPerformingPost: string;
    period: string;
    generatedAt: bigint;
    tenantId: string;
    postsPublished: bigint;
    totalEngagement: bigint;
    commentsResponded: bigint;
    estimatedRevenue: bigint;
    aiNarrative: string;
    bookingsFromSocial: bigint;
}
export interface TriggerRuleInput {
    action: string;
    ruleId: string;
    name: string;
    createdAt: bigint;
    actionType: string;
    conditionType: string;
    isEnabled: boolean;
    condition: string;
}
export interface Note {
    id: string;
    clientBusinessId: string;
    title: string;
    authorId: string;
    body: string;
    createdAt: bigint;
    relatedToType: string;
    updatedAt: bigint;
    category: NoteCategory;
    relatedToId: string;
}
export type ReviewHistoryEntry = string;
export interface RoofingLead {
    city: string;
    businessType: string;
    email: string;
    website?: string;
    state: string;
    companyName: string;
    phone?: string;
}
export interface MarketingAuditScore {
    weight: bigint;
    score: bigint;
    category: AuditCategory;
    findings: Array<string>;
}
export interface RankedDispatchRouteUpdate {
    status: RankedDispatchStatus;
    notes: Array<string>;
    matchedAgent: string;
    requestText: string;
}
export interface MarketingAuditInput {
    serviceArea: string;
    clientBusinessId: string;
    leadValue: bigint;
    offer: string;
    targetCustomer: string;
    verticalProfileId: string;
    website: string;
    goals: Array<string>;
    conversionGoal: string;
    knownCompetitors: Array<string>;
    industry: string;
}
export interface OAuthInitRequest {
    accountId: string;
    redirectUri: string;
    toolId: string;
}
export interface CsvImportBatch {
    id: string;
    status: string;
    imported: bigint;
    skipped: bigint;
    createdAt: bigint;
    fileName: string;
    tenantId: string;
    totalLeads: bigint;
    flaggedNoEmail: bigint;
    nicheBreakdown: Array<[string, bigint]>;
}
export interface BusinessBrief {
    id: string;
    criticalFindings: Array<string>;
    monitorFindings: Array<string>;
    serviceArea: string;
    performanceHistory: Array<PerformanceHistoryEntry>;
    clientBusinessId: string;
    targetLocations: Array<string>;
    sessionLog: Array<string>;
    approvalConfig: string;
    reviewHistory: Array<ReviewHistoryEntry>;
    lastUpdated: bigint;
    businessName: string;
    verticalProfileId: string;
    website: string;
    primaryKeyword: string;
    currentFindings: Array<string>;
    importantFindings: Array<string>;
    localSEOHistory: Array<LocalSEOHistoryEntry>;
    deliverables: Array<string>;
    fundingHistory: Array<FundingHistoryEntry>;
    contentHistory: Array<ContentHistoryEntry>;
    nextAction: string;
    locationName: string;
    toolsRun: Array<string>;
    services: Array<string>;
}
export interface BatchScrapeResult {
    ok: boolean;
    count: bigint;
    results: Array<BatchScrapeUrlResult>;
}
export interface NicheVoiceAssignment {
    voiceName: string;
    nicheId: string;
    assignedAt: bigint;
    voiceId: string;
}
export interface AgentThreadRecord {
    id: string;
    status: string;
    title: string;
    createdAt: bigint;
    tags: Array<string>;
    lastMessage: string;
    agentName: string;
    agentRole: string;
    agentId: string;
    tenantId: string;
    updatedAt: bigint;
    messageCount: bigint;
}
export interface AgentStatus {
    status: string;
    nextScheduledAt?: bigint;
    lastRunAt?: bigint;
    agentName: string;
    agentId: string;
    isEnabled: boolean;
    lastError?: string;
    config: string;
}
export interface VapiAssistantUpdate {
    businessName?: string;
    niche?: string;
    greetingScript?: string;
    phone?: string;
    qualifyingQuestions?: Array<string>;
}
export interface LeadCampaignDetails {
    auditScore?: bigint;
    lastSentAt?: bigint;
    usedFallback?: boolean;
    missingServices?: string;
    topCompetitor?: string;
    templateVersionUsed?: bigint;
    currentEmailDay: bigint;
    deadZones?: bigint;
}
export interface SocialListeningAlert {
    id: string;
    alertType: AlertType;
    source: string;
    mentionText: string;
    createdAt: bigint;
    suggestedAction: string;
    platform: SocialPlatform;
    tenantId: string;
    keyword: string;
    dismissed: boolean;
}
export interface CampaignStats {
    emailsSentAllTime: bigint;
    emailsSentWeek: bigint;
    clickRate: number;
    totalEnrolled: bigint;
    emailsSentToday: bigint;
    openRate: number;
}
export interface CustomField {
    id: string;
    clientBusinessId: string;
    isRequired: boolean;
    name: string;
    createdAt: bigint;
    updatedAt: bigint;
    targetEntity: string;
    options: Array<string>;
    fieldType: string;
}
export interface SocialPostDraftUpdate {
    cta?: string;
    status?: DraftStatus;
    content?: string;
    hashtags?: Array<string>;
    n8nStatus?: string;
    approvedAt?: bigint;
    approvedBy?: string;
    publishedUrl?: string;
    ctaUrl?: string;
    mediaUrls?: Array<string>;
    scheduledAt?: bigint;
}
export interface MasterAgentContextSnapshot {
    recentActivity: Array<string>;
    totalLeads: bigint;
    timestamp: bigint;
    activeTrials: bigint;
    totalCampaigns: bigint;
    totalAccounts: bigint;
}
export interface ContentCalendar {
    id: string;
    status: CalendarApprovalStatus;
    month: string;
    createdAt: bigint;
    year: bigint;
    tenantId: string;
    entries: Array<string>;
    updatedAt: bigint;
    niche: string;
}
export interface UserProfile {
    name: string;
    role: string;
    tenantId: TenantId;
}
export interface WebhookEvent {
    status: Variant_ok_failed;
    provider: string;
    receivedAt: bigint;
    errorMsg?: string;
    payload: string;
    eventType: string;
}
export interface CompetitorIntelReport {
    id: string;
    weeklyDigest: string;
    generatedAt: bigint;
    opportunities: Array<string>;
    tenantId: string;
    competitors: Array<CompetitorEntry>;
    niche: string;
}
export interface ReviewRequest {
    id: string;
    customerName: string;
    status: ReviewRequestStatus;
    sentTimestamp: Time;
    platform: string;
    email: string;
    tenantId: TenantId;
    attemptCount: bigint;
    customerFeedback: string;
    serviceCompleted: string;
    phone: string;
    lastFollowUp: Time;
}
export interface ConversationEntry {
    content: string;
    role: string;
    timestamp: bigint;
}
export interface AgentMemoryRecord {
    id: string;
    content: string;
    expiresAt?: bigint;
    createdAt: bigint;
    importance: bigint;
    agentId: string;
    tenantId: string;
    threadId: string;
    memoryType: string;
}
export interface ActivityFeedItemInput {
    id: string;
    title: string;
    description: string;
    entityId?: string;
    timestamp: bigint;
    entityType?: string;
    eventType: string;
}
export interface SeoGeoScore {
    id: string;
    gbpHealth: bigint;
    aiVisibilityHealth: bigint;
    technicalHealth: bigint;
    localVisibilityScore: bigint;
    conversionReadinessScore: bigint;
    recordedAt: Time;
    tenantId: TenantId;
    seoScore: bigint;
    contentHealth: bigint;
    geoScore: bigint;
}
export interface OutreachSequence {
    id: string;
    generatedAt: bigint;
    framework: string;
    emails: Array<string>;
    smsMessages: Array<string>;
    leadId: string;
    niche: string;
}
export interface ToolActionResponse {
    result: string;
    errorMessage?: string;
    success: boolean;
}
export interface CompetitorProfile {
    id: string;
    gbpLastUpdated: string;
    googleRating: number;
    adPresenceDetected: boolean;
    ratingChangePrevious: number;
    lastAuditedAt: bigint;
    website: string;
    tenantId: string;
    alertThreshold: number;
    reviewCount: bigint;
    reviewVelocityTrend: string;
    competitorName: string;
}
export interface NicheConversionData {
    paid_customers: bigint;
    niche: string;
    demos_started: bigint;
    trials_activated: bigint;
}
export interface AgentTemplateStorageRecord {
    id: string;
    requireApproval: boolean;
    providerPreference: string;
    name: string;
    createdAt: bigint;
    role: string;
    isActive: boolean;
    tenantId: string;
    allowedTools: Array<string>;
    updatedAt: bigint;
    systemPrompt: string;
    defaultWorkflowSteps: Array<string>;
    memoryMode: string;
}
export interface WorkflowStatusSnapshot {
    status: WorkflowStatus;
    lastAgentType: string;
    tenantId: string;
    lastUpdatedAt: bigint;
    currentStep: bigint;
    totalSteps: bigint;
    lastAction: string;
    workflowId: string;
}
export interface MarketingAudit {
    id: string;
    serviceArea: string;
    status: MarketingAuditStatus;
    clientBusinessId: string;
    leadValue: bigint;
    recommendedPackage: string;
    overallScore: bigint;
    offer: string;
    estimatedRevenueImpact?: string;
    brfScore: BRFScore;
    targetCustomer: string;
    createdAt: bigint;
    proposalReadySummary: string;
    verticalProfileId: string;
    website: string;
    updatedAt: bigint;
    goals: Array<string>;
    grade: string;
    executiveSummary: string;
    conversionGoal: string;
    quickWins: Array<string>;
    categoryScores: Array<MarketingAuditScore>;
    knownCompetitors: Array<string>;
    strategicRecommendations: Array<string>;
    longTermInitiatives: Array<string>;
    industry: string;
}
export interface DripLeadBounceRecord {
    bounceType: Variant_hard_soft;
    leadId: string;
    queueId: string;
    requeued: boolean;
    bouncedAt: bigint;
    reason?: string;
}
export interface BulkSendJob {
    id: string;
    bounceCount: bigint;
    status: Variant_completed_queued_failed_running_paused;
    totalEmails: bigint;
    sentCount: bigint;
    senderSubdomain: string;
    clickCount: bigint;
    dailyCap: bigint;
    openCount: bigint;
    deliveredCount: bigint;
    scheduledAt: bigint;
}
export interface AuditTrailEntry {
    action: string;
    actorId: string;
    notes: string;
    timestamp: bigint;
}
export interface BillingRecord {
    id: string;
    status: string;
    createdAt: Time;
    tenantId: TenantId;
    periodEnd: Time;
    currency: string;
    periodStart: Time;
    amount: bigint;
    planName: string;
}
export interface AgentCommandResult {
    requiresConfirmation: boolean;
    preview: string;
    error?: string;
    actionId: string;
}
export interface AbacusRouteRequest {
    temperature?: number;
    taskType: string;
    prompt: string;
    maxTokens?: bigint;
}
export interface HealthMetrics {
    trialsActive: bigint;
    apiStatus: boolean;
    demosRunning: bigint;
    outreachSent: bigint;
    leadsToday: bigint;
}
export interface PaidAdsSubscription {
    id: string;
    status: string;
    humanOversightEnabled: boolean;
    tenantId: TenantId;
    updatedAt: Time;
    price: bigint;
    assignedStrategist: string;
    startDate: Time;
}
export interface BulkImportResult {
    imported: bigint;
    skipped: bigint;
    batchId: string;
    flagged: bigint;
}
export interface SMSThread {
    id: string;
    lastMessageAt: bigint;
    createdAt: bigint;
    prospectName: string;
    tenantId: string;
    unreadCount: bigint;
    prospectPhone: string;
    archived: boolean;
    linkedLeadId?: string;
}
export interface EmailLogRecord {
    id: string;
    status: string;
    subject: string;
    recipient: string;
    sentAt: bigint;
    tenantId: string;
    emailType: string;
    errorMsg: string;
}
export interface AgentPerformanceSnapshot {
    id: string;
    month: string;
    metrics: Array<[string, bigint]>;
    nextActions: Array<string>;
    createdAt: Time;
    tenantId: TenantId;
    subscriptionId: string;
    summary: string;
    topWins: Array<string>;
}
export interface TaskUpdate {
    status?: TaskStatus;
    title?: string;
    assignedTo?: string;
    relatedToType?: string;
    dueDate?: bigint;
    description?: string;
    taskType?: string;
    priority?: TaskPriority;
    relatedToId?: string;
}
export interface ServiceAreaOutline {
    serviceArea: string;
    metaDescription: string;
    targetLocations: Array<string>;
    schemaType: string;
    pageTitle: string;
    services: Array<string>;
    targetKeyword: string;
    suggestedHeadings: Array<string>;
}
export interface AccountBriefUpdate {
    performanceHistory?: Array<string>;
    doRules?: Array<string>;
    sessionLog?: Array<string>;
    respondTo?: Array<string>;
    ignoreList?: Array<string>;
    differentiators?: Array<string>;
    tone?: string;
    targetAudience?: Array<string>;
    offerSummary?: string;
    doNotRespondList?: Array<string>;
    priorityContacts?: Array<string>;
    flagKeywords?: Array<string>;
    contentHistory?: Array<string>;
    brandVoice?: string;
    services?: Array<string>;
    dontRules?: Array<string>;
    positioning?: string;
}
export interface AgentLogEntry {
    result: string;
    action: string;
    actionType: string;
    agentId: string;
    logId: string;
    timestamp: bigint;
    isSuccess: boolean;
}
export interface NewsletterSendLog {
    id: string;
    status: SendLogStatus;
    subscriberId: string;
    errorMessage?: string;
    campaignId: string;
    sentAt?: bigint;
    email: string;
    openedAt?: bigint;
}
export interface BrfCallConversionStats {
    totalConnected: bigint;
    totalAttempts: bigint;
    conversionRate: number;
    totalConverted: bigint;
    smsFallbackCount: bigint;
}
export interface BrandKitOutreachJob {
    id: string;
    targetEmail: string;
    status: string;
    targetBusinessName: string;
    utmParams: string;
    clickedAt?: bigint;
    kitSlug: string;
    sentAt?: bigint;
    niche: string;
    targetCity: string;
    openedAt?: bigint;
}
export interface ContentTierToggle {
    tier: string;
    contentCreationEnabled: boolean;
}
export interface ExtendedLeadInput {
    googleRanking?: string;
    threePackRanking?: string;
    claimStatus?: string;
    optimizationScore?: string;
    businessName: string;
    email?: string;
    website?: string;
    gbpLink?: string;
    niche?: string;
    address?: string;
    aiSuggestedServices?: string;
    paidAds?: string;
    rating?: string;
    phone?: string;
    totalReviews?: string;
    localAds?: string;
}
export interface OutreachQueuedAction {
    id: string;
    status: string;
    emailSubject?: string;
    actionType: string;
    leadId: string;
    emailBody?: string;
    autoFireAt: bigint;
    scheduledAt: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ServiceAreaPage {
    id: string;
    serviceArea: string;
    metaDescription: string;
    status: ServiceAreaPageStatus;
    clientBusinessId: string;
    externalLinks: Array<string>;
    targetLocations: Array<string>;
    createdAt: Time;
    publishedUrl?: string;
    targetUrl: string;
    photoAssets: Array<string>;
    verticalProfileId: string;
    tenantId: string;
    updatedAt: Time;
    seoScore?: bigint;
    pageContent: string;
    internalLinks: Array<string>;
    pageTitle: string;
    schemaMarkup?: string;
    approvalRequestId?: string;
    services: Array<string>;
    targetKeyword: string;
}
export interface SeoGeoDeliverable {
    id: string;
    status: string;
    month: string;
    title: string;
    deliveredAt: Time;
    tenantId: TenantId;
    summary: string;
    notes: string;
    deliverableType: string;
    attachments: Array<string>;
}
export interface DualModelSearchJob {
    id: string;
    status: Variant_pending_completed_failed_running;
    completedAt?: bigint;
    duplicatesRemoved: bigint;
    cityA: string;
    cityB: string;
    createdAt: bigint;
    errorMessage?: string;
    tenantId: string;
    totalLeadsStaged: bigint;
    niche: string;
    claudeLeadsFound: bigint;
    openaiLeadsFound: bigint;
}
export interface ExtendedLead {
    id: string;
    status: string;
    googleRanking?: string;
    emailVerified: boolean;
    source: string;
    threePackRanking?: string;
    claimStatus?: string;
    name: string;
    createdAt: bigint;
    optimizationScore?: string;
    email: string;
    website?: string;
    tenantId: string;
    gbpLink?: string;
    niche: string;
    address?: string;
    notes: string;
    aiSuggestedServices?: string;
    paidAds?: string;
    rating?: string;
    phone: string;
    importBatchId?: string;
    totalReviews?: string;
    agentSubscriptions: Array<string>;
    localAds?: string;
}
export interface SeoGeoGbpTask {
    id: string;
    status: string;
    title: string;
    createdAt: Time;
    dueDate?: Time;
    description: string;
    tenantId: TenantId;
    taskType: string;
    updatedAt: Time;
    priority: string;
}
export interface BrowserAuditResult {
    websiteScreenshotUrl: string;
    websiteStatus: string;
    socialGaps: Array<string>;
    gbpStatus: string;
    gaps: Array<GapItem>;
    approvedAt?: bigint;
    approvedBy?: string;
    socialScore: bigint;
    jobId: string;
    auditedAt: bigint;
    businessName: string;
    tenantId: string;
    websiteScore: bigint;
    gbpGaps: Array<string>;
    auditTrail: Array<AuditTrailEntry>;
    socialScreenshotUrl: string;
    socialStatus: string;
    gbpScore: bigint;
    totalBrowserScore: bigint;
    gbpScreenshotUrl: string;
    adminApproved: boolean;
    websiteGaps: Array<string>;
}
export interface AgentRun {
    id: string;
    status: RunStatus;
    startedAt: bigint;
    artifactIds: Array<string>;
    approvalRequired: boolean;
    endedAt?: bigint;
    metadata: Array<[string, string]>;
    errorMessage?: string;
    agentType: string;
    tenantId: string;
    approvalStatus?: EngagementApprovalStatus;
    workflowStepIndex: bigint;
    inputPrompt: string;
    outputText?: string;
    threadId: string;
}
export interface AgencySettings {
    serpApiKey: string;
    twilioSid: string;
    twilioAuth: string;
    vapiKey: string;
    sendgridKey: string;
    googleApiKey: string;
    twilioNumber: string;
    stripeKey: string;
    openaiKey: string;
}
export interface NotificationRecord {
    id: string;
    title: string;
    body: string;
    notificationType: string;
    createdAt: Time;
    read: boolean;
    tenantId: TenantId;
}
export interface ActivityFeedItem {
    id: string;
    title: string;
    description: string;
    entityId?: string;
    timestamp: bigint;
    entityType?: string;
    eventType: string;
}
export interface WebsiteIssue {
    id: string;
    status: string;
    issueType: string;
    title: string;
    createdAt: Time;
    description: string;
    tenantId: TenantId;
    pageUrl: string;
    suggestedFix: string;
    severity: string;
}
export interface DripQueueThrottleConfig {
    staggerEnabled: boolean;
    backoffMultiplier: number;
    intervalSeconds: bigint;
    dailyCap: bigint;
}
export interface AgentServiceRequest {
    id: string;
    status: string;
    preferredDeadline?: Time;
    title: string;
    createdAt: Time;
    description: string;
    tenantId: TenantId;
    subscriptionId: string;
    updatedAt: Time;
    pageUrl: string;
    priority: string;
    attachments: Array<string>;
}
export interface ReportSection {
    metric: string;
    title: string;
    trend: string;
    value: string;
    trendValue: string;
    description: string;
    recommendation: string;
}
export interface AuditScore {
    conversionScore: bigint;
    lastUpdated: Time;
    subfactors: Array<[string, bigint]>;
    contentScore: bigint;
    tenantId: TenantId;
    score: bigint;
    seoScore: bigint;
    technicalScore: bigint;
}
export interface InvestmentTier {
    name: string;
    investment: string;
    description: string;
    deliverables: Array<string>;
    timeline: string;
}
export interface EmailReplyRecord {
    id: string;
    reviewStatus: Variant_pending_sent_approved_rejected;
    reviewedAt?: bigint;
    receivedAt: bigint;
    leadId: string;
    replyBody: string;
    draftFollowUp?: string;
    classification: Variant_referral_notInterested_wrongPerson_unclassified_interested;
}
export interface LeadCampaignStatus {
    status: CampaignLeadStatus;
    lastSentAt?: bigint;
    city: string;
    leadEmail: string;
    lastOpenedAt?: bigint;
    businessType: string;
    website?: string;
    state: string;
    currentStep: bigint;
    enrolledAt: bigint;
    companyName: string;
    phone?: string;
}
export interface FeatureToggleLog {
    id: string;
    modifiedAt: bigint;
    modifiedBy: string;
    tier: string;
    newValue: boolean;
    previousValue: boolean;
    featureName: string;
}
export interface MonthlyReportUpdate {
    status?: ReportStatus;
    recommendations?: Array<string>;
    sentAt?: bigint;
    summary?: string;
    nextMonthStrategy?: string;
    keyFindings?: Array<string>;
}
export interface ExecutionResponse {
    status: Variant_cancelled_pending_success_failed;
    result?: string;
    isDryRun: boolean;
    executionId: string;
    errorMsg?: string;
}
export interface CompetitorAlert {
    id: string;
    alertType: string;
    tenantId: string;
    triggeredAt: bigint;
    severity: string;
    dismissed: boolean;
    competitorId: string;
}
export interface AgentLogEntryInput {
    result: string;
    action: string;
    actionType: string;
    agentId: string;
    logId: string;
    timestamp: bigint;
    isSuccess: boolean;
}
export interface SeoGeoRequest {
    id: string;
    status: string;
    preferredDeadline?: Time;
    title: string;
    createdAt: Time;
    description: string;
    tenantId: TenantId;
    updatedAt: Time;
    pageUrl: string;
    priority: string;
    attachments: Array<string>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Proposal {
    id: string;
    status: ProposalStatus;
    clientBusinessId: string;
    title: string;
    investmentTiers: Array<InvestmentTier>;
    roiProjection?: string;
    nextSteps: string;
    strategyApproach: string;
    createdAt: bigint;
    auditId?: string;
    sentAt?: bigint;
    verticalProfileId: string;
    updatedAt: bigint;
    executiveSummary: string;
    assumptions: string;
    scopeOfWork: string;
    sections: Array<ProposalSection>;
    situationAnalysis: string;
    clientResponsibilities: string;
    timeline: string;
}
export interface GridAuditSnapshot {
    result: GridAuditResult;
    snapshotAt: bigint;
}
export interface ClientHealthScore {
    reputationScore: bigint;
    trend: string;
    overallScore: bigint;
    recommendations: Array<string>;
    leadsScore: bigint;
    lastUpdated: bigint;
    components: Array<HealthScoreComponent>;
    tenantId: string;
    websiteScore: bigint;
    agentScore: bigint;
}
export interface MasterAgentSession {
    startedAt: bigint;
    messages: Array<MasterAgentMessage>;
    lastActiveAt: bigint;
    platformContext?: string;
    sessionId: string;
}
export interface ChatWidgetConfig {
    faqItems: Array<string>;
    active: boolean;
    leadCaptureEnabled: boolean;
    greeting: string;
    tenantId: TenantId;
    niche: string;
    embedToken: string;
    bookingEnabled: boolean;
}
export interface LeadAttributionRecord {
    id: string;
    bookingId: string;
    attributionModel: string;
    createdAt: bigint;
    channels: Array<AttributionTouch>;
    tenantId: string;
    leadId: string;
    closedDealValue: number;
    finalConversionChannel: string;
}
export interface GapItem {
    area: string;
    description: string;
    severity: string;
}
export interface ServiceAreaPageUpdate {
    serviceArea?: string;
    metaDescription?: string;
    status?: ServiceAreaPageStatus;
    externalLinks?: Array<string>;
    targetLocations?: Array<string>;
    publishedUrl?: string;
    targetUrl?: string;
    photoAssets?: Array<string>;
    seoScore?: bigint;
    pageContent?: string;
    internalLinks?: Array<string>;
    pageTitle?: string;
    schemaMarkup?: string;
    approvalRequestId?: string;
    services?: Array<string>;
    targetKeyword?: string;
}
export interface SmsAutopilotRule {
    id: string;
    messageTemplate: string;
    isActive: boolean;
    sentCount: bigint;
    triggerType: Variant_twoOpens_manualTrigger_noOpenFortyEightHours;
    delayMinutes: bigint;
}
export interface LeadExtractionResult {
    count: bigint;
    sourceUrl: string;
    leads: Array<ScrapedLead>;
}
export interface EngagementApproval {
    id: string;
    draftResponse: string;
    commentId: string;
    flagReason?: string;
    createdAt: bigint;
    tenantId: string;
    approvalStatus: EngagementApprovalStatus;
    flagged: boolean;
    resolvedAt?: bigint;
}
export interface TriggerRule {
    action: string;
    ruleId: string;
    name: string;
    createdAt: bigint;
    actionType: string;
    conditionType: string;
    isEnabled: boolean;
    condition: string;
}
export interface SmsAutopilotJob {
    id: string;
    status: Variant_cancelled_sent_queued_failed;
    ruleId: string;
    twilioMessageSid?: string;
    messageText: string;
    leadId: string;
    scheduledAt: bigint;
}
export interface ScrapeRequest {
    url: string;
    outputFormat: OutputFormat;
    waitSelectorMs: bigint;
    limit: bigint;
    selector: string;
    selectorType: SelectorType;
}
export type Time = bigint;
export interface CampaignInstance {
    id: string;
    status: string;
    startedAt: Time;
    metrics: CampaignMetrics;
    templateId: string;
    tenantId: TenantId;
}
export interface AuditReport {
    overallScore: bigint;
    generatedAt: bigint;
    businessName: string;
    email: string;
    narrative?: string;
    niche: string;
    sessionId: string;
    topGaps: Array<string>;
}
export interface Task {
    id: string;
    status: TaskStatus;
    clientBusinessId: string;
    title: string;
    assignedTo: string;
    createdAt: bigint;
    relatedToType: string;
    dueDate: bigint;
    description: string;
    taskType: string;
    updatedAt: bigint;
    priority: TaskPriority;
    relatedToId: string;
}
export interface ScrapedLead {
    businessName?: string;
    sourceUrl: string;
    extractedAt: Time;
    email?: string;
    phone?: string;
}
export interface BRFScore {
    rankedFindings: Array<string>;
    overallScore: bigint;
    rankedScore: bigint;
    bookedScore: bigint;
    fundedScore: bigint;
    fundedFindings: Array<string>;
    bookedFindings: Array<string>;
}
export interface ReadinessBreakdownItem {
    weight: bigint;
    service: string;
    status: boolean;
}
export interface OAuthInitResponse {
    state: string;
    authUrl: string;
}
export interface MasterAgentMessage {
    content: string;
    role: MessageRole;
    timestamp: bigint;
}
export interface CompetitorEntry {
    name: string;
    platform: SocialPlatform;
    avgEngagement?: bigint;
    followersEst?: bigint;
    profileUrl: string;
}
export interface SeoGeoSubscription {
    id: string;
    status: string;
    humanOversightEnabled: boolean;
    tenantId: TenantId;
    updatedAt: Time;
    price: bigint;
    assignedStrategist: string;
    startDate: Time;
}
export interface ProposalUpdate {
    status?: ProposalStatus;
    title?: string;
    investmentTiers?: Array<InvestmentTier>;
    roiProjection?: string;
    nextSteps?: string;
    strategyApproach?: string;
    sentAt?: bigint;
    executiveSummary?: string;
    assumptions?: string;
    scopeOfWork?: string;
    sections?: Array<ProposalSection>;
    situationAnalysis?: string;
    clientResponsibilities?: string;
    timeline?: string;
}
export interface LeadAuditResult {
    growthScore: bigint;
    interactionType?: string;
    socialInstagram?: string;
    outreachPriority: string;
    overallScore: bigint;
    pushedAt?: bigint;
    socialFacebook?: string;
    websiteUrl: string;
    aiInsights: string;
    assignedCampaignId?: string;
    firstTouchEmailBody: string;
    socialScore: bigint;
    pushedToCrm: boolean;
    jobId: string;
    businessName: string;
    seoMetrics: string;
    tenantId: string;
    totalScore: bigint;
    kitPageSlug?: string;
    websiteScore: bigint;
    foundingYear?: string;
    seoScore: bigint;
    socialMetrics: string;
    niche: string;
    companySnapshot: string;
    category: string;
    socialLinkedin?: string;
    trialActivatedAt?: bigint;
    engagementScore: bigint;
    firstTouchEmailSubject: string;
    painPointAngles: Array<string>;
}
export interface Booking {
    id: string;
    customerName: string;
    outlookEventId?: string;
    status: BookingStatus;
    serviceType: string;
    customerPhone: string;
    createdAt: bigint;
    noShowFollowUpSent: boolean;
    tenantId: string;
    reminderSent24h: boolean;
    durationMinutes: bigint;
    notes: string;
    googleCalendarEventId?: string;
    reminderSent1h: boolean;
    customerEmail: string;
    scheduledAt: bigint;
}
export interface ExecutionRequest {
    clientBusinessId: string;
    isDryRun: boolean;
    verticalProfileId?: string;
    recordId?: string;
    callbackUrl?: string;
    approvalRequestId?: string;
    payload: Array<[string, string]>;
    contractId: string;
}
export interface PostEngagementMetrics {
    clicks: bigint;
    shares: bigint;
    likes: bigint;
    comments: bigint;
    reach: bigint;
}
export interface FunnelRecord {
    demoCompletedAt?: bigint;
    demoStartedAt?: bigint;
    clickedAt?: bigint;
    funnelStep: string;
    emailSentAt?: bigint;
    campaignId: string;
    leadId: string;
    niche: string;
    enrolledAt: bigint;
    trialProvisionedAt?: bigint;
    openedAt?: bigint;
}
export interface ScriptLine {
    pauseAfterMs: bigint;
    text: string;
    speaker: string;
}
export interface EstimateLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
}
export interface WebsiteCroOpportunity {
    id: string;
    status: string;
    title: string;
    effortLevel: string;
    createdAt: Time;
    description: string;
    tenantId: TenantId;
    category: string;
    priority: string;
    estimatedLift: string;
}
export interface Invoice {
    id: string;
    status: string;
    dueDate: Time;
    description: string;
    tenantId: TenantId;
    invoiceDate: Time;
    currency: string;
    amount: bigint;
}
export interface VoiceAgentConfig {
    callRouting: {
        __kind__: "ai";
        ai: null;
    } | {
        __kind__: "voicemail";
        voicemail: string;
    } | {
        __kind__: "forward";
        forward: string;
    };
    vapiAgentId: string;
    businessHoursText: string;
    tenantId: TenantId;
    configured: boolean;
    greetingScript: string;
    twilioNumber: string;
    services: Array<string>;
}
export interface DomainSetupState {
    propagationStatus: PropagationStatus;
    siteImportStatus: string;
    clientId: string;
    domain: string;
    cname: string;
    createdAt: bigint;
    importedPageCount: bigint;
    updatedAt: bigint;
    currentStep: bigint;
    registrar?: string;
    aRecord: string;
}
export interface VerticalProfileExt {
    id: string;
    serviceArea: Array<string>;
    prohibitedClaims: Array<string>;
    contentPillars: Array<string>;
    doRules: Array<string>;
    commonServices: Array<string>;
    commonReviewThemes: Array<string>;
    proposalDeliverables: Array<string>;
    exampleEmailTemplates: Array<string>;
    commonOffers: Array<string>;
    differentiators: Array<string>;
    recommendedDisclaimers: Array<string>;
    createdAt: bigint;
    defaultPipelineLabels: Array<string>;
    tenantId: string;
    targetAudience: string;
    keywords: Array<string>;
    updatedAt: bigint;
    localSEOKeywordPatterns: Array<string>;
    commonGBPPostTypes: Array<string>;
    competitors: Array<string>;
    niche: string;
    category: string;
    commonCampaignTypes: Array<string>;
    smsTone: string;
    emailTone: string;
    exampleSMSFollowUps: Array<string>;
    subNiches: Array<string>;
    exampleContentAngles: Array<string>;
    fundingNeeds: Array<string>;
    leadFormFields: Array<string>;
    commonLeadTypes: Array<string>;
    brandVoice: string;
    complianceNotes: string;
    services: Array<string>;
    doNotRules: Array<string>;
    positioning: string;
}
export interface CompanyUpdate {
    name?: string;
    size?: string;
    vertical?: string;
    email?: string;
    website?: string;
    address?: string;
    notes?: string;
    phone?: string;
}
export interface NewsletterSubscriber {
    id: string;
    status: SubscriberStatus;
    unsubscribedAt?: bigint;
    subscribedAt: bigint;
    tags: Array<string>;
    businessName?: string;
    email: string;
    tenantId: string;
    customFields: Array<[string, string]>;
    phone?: string;
}
export interface DemoSession {
    auditScore: bigint;
    createdAt: bigint;
    step: bigint;
    businessName: string;
    socialContentLockedAt?: bigint;
    niche: string;
    sessionId: string;
    trialActivatedAt?: bigint;
}
export interface AudioCacheStats {
    entryCount: bigint;
    estimatedSizeKB: bigint;
}
export interface DripQueue {
    id: string;
    currentIndex: bigint;
    status: string;
    completedAt?: bigint;
    pausedAt?: bigint;
    failedCount: bigint;
    campaignTemplateId: string;
    name: string;
    createdAt: bigint;
    sentCount: bigint;
    tenantId: string;
    contactEmails: Array<string>;
    cancelledAt?: bigint;
    updatedAt: bigint;
    sendIntervalSeconds: bigint;
    dailyResetAt: bigint;
    niche: string;
    campaignTemplateName: string;
    dailySentCount: bigint;
    contactNames: Array<string>;
    dailySendCap: bigint;
}
export interface TrialAccount {
    id: string;
    status: TrialStatus;
    expiresAt: bigint;
    city: string;
    businessName: string;
    email: string;
    website?: string;
    provisionedAt: bigint;
    leadId: string;
    niche: string;
    phone?: string;
}
export interface WebsiteAgentSubscription {
    id: string;
    status: string;
    humanOversightEnabled: boolean;
    tenantId: TenantId;
    updatedAt: Time;
    price: bigint;
    assignedStrategist: string;
    startDate: Time;
}
export interface BrfVoiceAgentConfig {
    inboundEnabled: boolean;
    inboundVapiAssistantId: string;
    outboundEnabled: boolean;
    brfBrandName: string;
    maxOutboundAttempts: bigint;
    retryDelayMinutes: bigint;
    objectionHandlingEnabled: boolean;
    inboundPhoneNumber: string;
    outboundVapiAssistantId: string;
}
export interface ContentCalendarEntryUpdate {
    cta?: string;
    topic?: string;
    angle?: string;
    objective?: ContentObjective;
    platform?: string;
    approvalStatus?: CalendarApprovalStatus;
    pillar?: ContentPillar;
    visualDirection?: string;
    format?: PostFormat;
}
export interface WebsiteContentBrief {
    id: string;
    assignee: string;
    createdAt: Time;
    tenantId: TenantId;
    outlinePoints: Array<string>;
    approvalStatus: string;
    updatedAt: Time;
    targetKeywords: Array<string>;
    pageTitle: string;
}
export interface DripQueueEmailLog {
    id: string;
    status: string;
    clickedAt?: bigint;
    errorMessage?: string;
    trackingToken: string;
    sentAt?: bigint;
    tenantId: string;
    retryCount: bigint;
    clickCount: bigint;
    queueId: string;
    openCount: bigint;
    recipientName: string;
    recipientEmail: string;
    openedAt?: bigint;
}
export interface CustomFieldUpdate {
    isRequired?: boolean;
    name?: string;
    targetEntity?: string;
    options?: Array<string>;
    fieldType?: string;
}
export interface ScrapeItem {
    src?: string;
    href?: string;
    html?: string;
    text?: string;
    attributes: Array<[string, string]>;
}
export interface SeoGeoContentItem {
    id: string;
    title: string;
    content: string;
    contentType: string;
    createdAt: Time;
    tenantId: TenantId;
    approvalStatus: string;
    updatedAt: Time;
    targetKeywords: Array<string>;
}
export interface HumanOversightAssignment {
    id: string;
    status: string;
    createdAt: Time;
    tenantId: TenantId;
    subscriptionId: string;
    notes: string;
    priority: string;
    strategist: string;
}
export interface PipelineActivityEntry {
    action: string;
    timestamp: bigint;
    details: string;
}
export interface ComposioTool {
    id: string;
    accountId: string;
    name: string;
    description: string;
    connected: boolean;
    category: string;
}
export interface ProviderAdapterConfig {
    id: string;
    baseUrl?: string;
    createdAt: bigint;
    tenantId: string;
    isEnabled: boolean;
    apiKey?: string;
    priority: bigint;
    modelId?: string;
    adapterType: AdapterType;
}
export interface PaidAdsAlert {
    id: string;
    status: string;
    alertType: string;
    title: string;
    owner: string;
    createdAt: Time;
    description: string;
    tenantId: TenantId;
    suggestedFix: string;
    severity: string;
}
export interface ToolActionRequest {
    action: string;
    accountId: string;
    toolId: string;
    params: Array<[string, string]>;
}
export interface ScrapeRecord {
    id: bigint;
    result: ScrapeResult;
    request: ScrapeRequest;
    createdAt: Time;
    robotsChecked: boolean;
    tenantId: string;
    robotsAllowed: boolean;
}
export type PerformanceHistoryEntry = string;
export interface DemoFunnelEntry {
    id: string;
    createdAt: bigint;
    tenantId: string;
    engagementCount: bigint;
    prospectId: string;
    trialActivatedAt?: bigint;
    emailSequenceStatus: EmailSequenceStatus;
    lastEngagedAt: bigint;
    trialActivated: boolean;
}
export interface AutopilotConfig {
    complianceMode: Variant_both_gdpr_canSpam;
    warmupPhase: boolean;
    discoveryEnabled: boolean;
    currentWarmupDay: bigint;
    dailyEmailCap: bigint;
    isEnabled: boolean;
    enrichmentEnabled: boolean;
    dailySmsCap: bigint;
    targetDailyVolume: bigint;
}
export interface AuditLogEntry {
    id: string;
    senderSubdomain: string;
    messageType: Variant_sms_email;
    leadId: string;
    timestamp: bigint;
    subjectOrSnippet: string;
    optOutLinkPresent: boolean;
}
export interface PropagationStatus {
    isLive: boolean;
    checkedAt: bigint;
    percentage: bigint;
}
export interface DnsCheckResult {
    rawRecords: Array<string>;
    domain: string;
    spfPresent: boolean;
    dmarcPresent: boolean;
    dkimPresent: boolean;
    checkedAt: bigint;
}
export interface DeliverabilityEvent {
    id: string;
    email: string;
    senderSubdomain: string;
    occurredAt: bigint;
    leadId: string;
    eventType: Variant_click_open_complaint_bounce_unsubscribe;
}
export interface SMSMessage {
    id: string;
    status: string;
    direction: string;
    text: string;
    sender: string;
    sentAt: bigint;
    tenantId: string;
    threadId: string;
    readAt?: bigint;
}
export interface DograhTestResult {
    agentCount: bigint;
    message: string;
    connected: boolean;
}
export interface WarmLeadHandoff {
    handoffTimestamp: bigint;
    demoVisited: boolean;
    handoffTrigger: string;
    coldSequenceId: string;
    leadId: string;
    niche: string;
    warmSequenceId: string;
    auditScores?: AuditSnapshot;
}
export interface PaidAdsAdCopy {
    id: string;
    cta: string;
    status: string;
    clicks: bigint;
    testResult: string;
    body: string;
    headline: string;
    createdAt: Time;
    campaignId: string;
    tenantId: TenantId;
    conversions: bigint;
    variant: string;
}
export interface DiscoveryConfig {
    cities: Array<string>;
    enabled: boolean;
    intervalSecs: bigint;
    dailyCap: bigint;
    niche: string;
    leadsPerCity: bigint;
}
export interface PipelineLead {
    id: string;
    ownerEmail: string;
    autoTriggerScheduledAt?: bigint;
    source: string;
    laneStatus: string;
    businessName: string;
    tenantId: string;
    activityLog: Array<PipelineActivityEntry>;
    autoTriggerCancelled: boolean;
    laneMoveTimestamp: bigint;
    leadId: string;
    niche: string;
    autoTriggerFiredAt?: bigint;
}
export interface MaskedCredentials {
    serpApiKey: string;
    geminiApiKey: string;
    serpApiDevKey: string;
    claudeKey: string;
    twilioSid: string;
    sendgridInboundParseDomain: string;
    dograhApiKey: string;
    yelpApiKey: string;
    vapiWebhookSecret: string;
    googleClientId: string;
    n8nInstanceUrl: string;
    abacusApiKey: string;
    twilioAuth: string;
    composioApiKey: string;
    searxngUrl: string;
    neverBounceKey: string;
    autoBrowserUrl: string;
    elevenLabsKey: string;
    facebookAppId: string;
    emailSmtpHost: string;
    emailSmtpPass: string;
    emailSmtpPort: string;
    emailSmtpUser: string;
    openRouterApiKey: string;
    elevenLabsVoiceId: string;
    listmonkUrl: string;
    litellmKey: string;
    litellmUrl: string;
    hunterApiKey: string;
    perplexityApiKey: string;
    vapiKey: string;
    listmonkPass: string;
    listmonkUser: string;
    sendgridKey: string;
    tinyFishKey: string;
    googleClientSecret: string;
    twilioNumber: string;
    nvidiaApiKey: string;
    facebookAppSecret: string;
    composioWebhookSecret: string;
    stripeKey: string;
    ollamaUrl: string;
    stripeWebhookSecret: string;
    nvidiaNimApiKey: string;
    openaiKey: string;
}
export interface PaidAdsCampaign {
    id: string;
    ctr: string;
    status: string;
    clicks: bigint;
    name: string;
    roas: string;
    impressions: bigint;
    tenantId: TenantId;
    spent: bigint;
    updatedAt: Time;
    conversions: bigint;
    budget: bigint;
    startDate: Time;
}
export interface MonthlyReport {
    id: string;
    status: ReportStatus;
    month: string;
    period: string;
    recommendations: Array<string>;
    createdAt: bigint;
    year: bigint;
    sentAt?: bigint;
    tenantId: string;
    summary: string;
    updatedAt: bigint;
    insightIds: Array<string>;
    nextMonthStrategy: string;
    keyFindings: Array<string>;
}
export interface CommandLogEntry {
    id: string;
    agentAction: AgentActionKind;
    executedAt?: bigint;
    userId: string;
    confirmationPreview: string;
    executionResult?: string;
    timestamp: bigint;
    sessionId: string;
    commandText: string;
}
export interface BrandVoiceProfile {
    lastCalibrated: bigint;
    calibrationPosts: Array<string>;
    formality: string;
    sentenceStyle: string;
    tone: BrandVoiceTone;
    tenantId: string;
    vocabulary: Array<string>;
    emojiUsage: EmojiUsage;
    nicheTerminology: Array<string>;
}
export interface AgentTask {
    id: string;
    status: string;
    assignee: string;
    title: string;
    createdAt: Time;
    dueDate?: Time;
    description: string;
    tenantId: TenantId;
    subscriptionId: string;
    taskType: string;
    updatedAt: Time;
    notes: string;
    priority: string;
    attachments: Array<string>;
}
export interface LocationProfile {
    id: string;
    status: string;
    timezone: string;
    city: string;
    createdAt: bigint;
    tenantId: string;
    state: string;
    address: string;
    phoneNumber: string;
    locationName: string;
}
export interface ToolDefinition {
    id: string;
    permissions: Array<string>;
    tenantScoped: boolean;
    schema: string;
    name: string;
    description: string;
    isEnabled: boolean;
    category: string;
    requiresApproval: boolean;
}
export interface BatchScrapeRequest {
    outputFormat: OutputFormat;
    urls: Array<string>;
    selector: string;
    limitPerUrl: bigint;
    selectorType: SelectorType;
}
export type FundingHistoryEntry = string;
export interface ContractSummary {
    id: string;
    method: string;
    endpoint: string;
    supportsDryRun: boolean;
    category: string;
    requiresApproval: boolean;
    purpose: string;
}
export interface ConnectionTestResult {
    lastTestError?: string;
    message: string;
    connected: boolean;
    statusCode: bigint;
    quotaInfo?: string;
    lastTestedAt?: bigint;
}
export interface AgentArtifactRecord {
    id: string;
    status: string;
    title: string;
    artifactType: string;
    content: string;
    createdAt: bigint;
    tags: Array<string>;
    agentId: string;
    clientVisible: boolean;
    tenantId: string;
    threadId: string;
    runId: string;
}
export interface ClientReport {
    id: string;
    deliveredAt?: bigint;
    overallScore: bigint;
    nextSteps: Array<string>;
    generatedAt: bigint;
    tenantId: string;
    reportType: string;
    periodLabel: string;
    sections: Array<ReportSection>;
    aiNarrative: string;
    topWins: Array<string>;
}
export interface OperatorStats {
    leads_today: bigint;
    api_health_summary: string;
    trials_this_week: bigint;
    outreach_sent_today: bigint;
}
export interface DemoAuditReport {
    gaps: Array<string>;
    recommendations: Array<string>;
    createdAt: bigint;
    businessName: string;
    prospectEmail: string;
    score: bigint;
    niche: string;
}
export interface AgentRunRecord {
    id: string;
    status: string;
    completedAt?: bigint;
    output: string;
    startedAt: bigint;
    artifactIds: Array<string>;
    stepIndex: bigint;
    approvalRequired: boolean;
    metadata: string;
    errorMessage?: string;
    agentId: string;
    tenantId: string;
    approvalStatus: string;
    totalSteps: bigint;
    modelUsed: string;
    input: string;
    tokenCount?: bigint;
    threadId: string;
    durationMs?: bigint;
}
export interface DograhAgent {
    id: string;
    status: string;
    name: string;
    description: string;
    lastModified: bigint;
    nodeCount: bigint;
}
export interface FunnelTimeline {
    events: Array<FunnelEvent>;
    leadId: string;
}
export interface DograhConfig {
    baseUrl: string;
    isEnabled: boolean;
    apiKey: string;
}
export interface HealthScoreComponent {
    weight: bigint;
    status: string;
    displayLabel: string;
    weightedScore: bigint;
    rawScore: bigint;
    factor: string;
}
export interface FreeAuditLead {
    id: string;
    overallScore: bigint;
    websiteUrl: string;
    createdAt: Time;
    businessName: string;
    contactEmail: string;
    phone: string;
    location: string;
}
export interface Contact {
    id: string;
    nurtureStatus: string;
    clientBusinessId: string;
    title: string;
    createdAt: bigint;
    email: string;
    updatedAt: bigint;
    notes: string;
    leadSource: string;
    phone: string;
    lastName: string;
    industry: string;
    firstName: string;
}
export interface BulkLeadInput {
    websiteUrl?: string;
    city: string;
    businessName: string;
    email?: string;
    state?: string;
    niche: string;
    phone?: string;
    reviewCount?: bigint;
    researchSource: string;
    avgRating?: number;
}
export interface ReviewRequestTrigger {
    id: string;
    customerName: string;
    status: ReviewRequestTriggerStatus;
    bookingId?: string;
    customerPhone: string;
    createdAt: bigint;
    estimateId?: string;
    platform: string;
    sentAt?: bigint;
    tenantId: string;
    triggerType: ReviewRequestTriggerType;
    customerEmail: string;
}
export interface LeadAIScore {
    scoredAt: bigint;
    signals: Array<string>;
    score: bigint;
    fitReason: string;
    leadId: string;
}
export interface BestPerformerMemory {
    topPlatforms: Array<string>;
    topPillars: Array<string>;
    topPosts: Array<string>;
    avgClicks: bigint;
    topFormats: Array<string>;
    avgEngagement: bigint;
    tenantId: string;
    avgReach: bigint;
    lastUpdatedAt: bigint;
    topCtAs: Array<string>;
}
export interface ScheduledDiscoveryJob {
    id: string;
    status: string;
    completedAt?: bigint;
    startedAt: bigint;
    enrichedCount: bigint;
    duplicatesRemoved: bigint;
    errorMessage?: string;
    totalBeforeDedup: bigint;
    openaiLeads: bigint;
    claudeLeads: bigint;
    totalCreated: bigint;
    config: DiscoveryConfig;
    enrichPending: bigint;
}
export interface Company {
    id: string;
    clientBusinessId: string;
    name: string;
    createdAt: bigint;
    size: string;
    vertical: string;
    email: string;
    website: string;
    updatedAt: bigint;
    address: string;
    notes: string;
    phone: string;
}
export type LocalSEOHistoryEntry = string;
export interface FeatureToggle {
    proEnabled: boolean;
    agencyEnabled: boolean;
    basicEnabled: boolean;
    lastModifiedBy: string;
    lastModifiedTime: bigint;
    featureName: string;
}
export interface SourceQualityData {
    paid_converted: bigint;
    source: string;
    trials_converted: bigint;
    avg_quality_score: number;
    total_leads: bigint;
}
export interface VerticalProfileUpdate {
    serviceArea?: Array<string>;
    prohibitedClaims?: Array<string>;
    contentPillars?: Array<string>;
    doRules?: Array<string>;
    commonReviewThemes?: Array<string>;
    proposalDeliverables?: Array<string>;
    exampleEmailTemplates?: Array<string>;
    commonOffers?: Array<string>;
    differentiators?: Array<string>;
    recommendedDisclaimers?: Array<string>;
    defaultPipelineLabels?: Array<string>;
    targetAudience?: string;
    keywords?: Array<string>;
    localSEOKeywordPatterns?: Array<string>;
    commonGBPPostTypes?: Array<string>;
    competitors?: Array<string>;
    niche?: string;
    category?: string;
    commonCampaignTypes?: Array<string>;
    smsTone?: string;
    emailTone?: string;
    exampleSMSFollowUps?: Array<string>;
    subNiches?: Array<string>;
    exampleContentAngles?: Array<string>;
    fundingNeeds?: Array<string>;
    leadFormFields?: Array<string>;
    commonLeadTypes?: Array<string>;
    brandVoice?: string;
    complianceNotes?: string;
    services?: Array<string>;
    doNotRules?: Array<string>;
    positioning?: string;
}
export interface GridPoint {
    lat: number;
    lng: number;
    direction: string;
    competitorAtTop: string;
    rankPosition: bigint;
    searched: boolean;
}
export interface BusinessBriefUpdate {
    criticalFindings: Array<string>;
    monitorFindings: Array<string>;
    serviceArea: string;
    performanceHistory: Array<PerformanceHistoryEntry>;
    clientBusinessId: string;
    targetLocations: Array<string>;
    sessionLog: Array<string>;
    approvalConfig: string;
    reviewHistory: Array<ReviewHistoryEntry>;
    businessName: string;
    verticalProfileId: string;
    website: string;
    primaryKeyword: string;
    currentFindings: Array<string>;
    importantFindings: Array<string>;
    localSEOHistory: Array<LocalSEOHistoryEntry>;
    deliverables: Array<string>;
    fundingHistory: Array<FundingHistoryEntry>;
    contentHistory: Array<ContentHistoryEntry>;
    nextAction: string;
    locationName: string;
    toolsRun: Array<string>;
    services: Array<string>;
}
export interface InboundReply {
    id: string;
    claudeSuggestedAction: string;
    subjectLine: string;
    actionStatus: string;
    claudeSentiment: string;
    prospectEmail: string;
    receivedAt: bigint;
    claudePainPoints: string;
    leadId: string;
    bodyText: string;
}
export interface AgentProduct {
    id: string;
    status: string;
    features: Array<string>;
    bundleIds: Array<string>;
    name: string;
    description: string;
    updatedAt: Time;
    billingCycle: string;
    allowHumanOversight: boolean;
    upsellPriority: bigint;
    visible: boolean;
    category: string;
    price: bigint;
    enabledNiches: Array<string>;
}
export enum AdapterType {
    native_ = "native",
    anthropic_claude = "anthropic_claude",
    ollama_local = "ollama_local",
    openai_compatible = "openai_compatible",
    deerflow_bridge = "deerflow_bridge",
    abacus_adapter = "abacus_adapter"
}
export enum AgentActionKind {
    EditSequence = "EditSequence",
    ModifyStep = "ModifyStep",
    FireBulkSend = "FireBulkSend",
    Unknown = "Unknown",
    QueryLeads = "QueryLeads"
}
export enum AlertType {
    buying_signal = "buying_signal",
    competitor_move = "competitor_move",
    negative_mention = "negative_mention",
    local_trend = "local_trend"
}
export enum ApprovalStatus {
    expired = "expired",
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum ApprovalTier {
    sms_send = "sms_send",
    funding_claim = "funding_claim",
    legal = "legal",
    email_send = "email_send",
    gbp_publish = "gbp_publish",
    social_publish = "social_publish",
    content_publish = "content_publish",
    financial = "financial",
    medical = "medical",
    voice_call = "voice_call"
}
export enum ArtifactStatus {
    final_ = "final",
    draft = "draft",
    archived = "archived"
}
export enum ArtifactType {
    content_package = "content_package",
    recommendation_set = "recommendation_set",
    estimate = "estimate",
    follow_up_sequence = "follow_up_sequence",
    lead_summary = "lead_summary",
    seo_action_plan = "seo_action_plan",
    proposal = "proposal",
    support_resolution = "support_resolution"
}
export enum AuditCategory {
    ContentMessaging = "ContentMessaging",
    GrowthStrategy = "GrowthStrategy",
    BrandTrust = "BrandTrust",
    SEODiscoverability = "SEODiscoverability",
    CompetitivePositioning = "CompetitivePositioning",
    ConversionOptimization = "ConversionOptimization"
}
export enum BookingStatus {
    cancelled = "cancelled",
    no_show = "no_show",
    completed = "completed",
    confirmed = "confirmed"
}
export enum BounceType {
    hard = "hard",
    soft = "soft",
    complaint = "complaint"
}
export enum BrandVoiceTone {
    authoritative = "authoritative",
    professional = "professional",
    friendly = "friendly",
    casual = "casual"
}
export enum BrfCallStatus {
    NoAnswer = "NoAnswer",
    Failed = "Failed",
    Calling = "Calling",
    Connected = "Connected",
    SmsFallbackSent = "SmsFallbackSent",
    Pending = "Pending"
}
export enum CalendarApprovalStatus {
    pending_review = "pending_review",
    approved = "approved",
    rejected = "rejected",
    draft = "draft",
    needs_revision = "needs_revision"
}
export enum CampaignLeadStatus {
    active = "active",
    unsubscribed = "unsubscribed",
    completed = "completed",
    paused = "paused"
}
export enum CampaignStatus {
    scheduled = "scheduled",
    sent = "sent",
    sending = "sending",
    draft = "draft",
    paused = "paused"
}
export enum CampaignType {
    reviewRequest = "reviewRequest",
    localBusinessOutreach = "localBusinessOutreach",
    referralPartnerOutreach = "referralPartnerOutreach",
    oldLeadReactivation = "oldLeadReactivation",
    financingOffer = "financingOffer",
    seasonalPromo = "seasonalPromo",
    leadNurture = "leadNurture",
    coldEmail = "coldEmail",
    verticalSpecific = "verticalSpecific",
    eventWebinar = "eventWebinar",
    proposalFollowUp = "proposalFollowUp"
}
export enum CommentIntent {
    question = "question",
    purchase_intent = "purchase_intent",
    spam = "spam",
    complaint = "complaint",
    community_love = "community_love",
    competitor_mention = "competitor_mention"
}
export enum ContentObjective {
    awareness = "awareness",
    retention = "retention",
    authority = "authority",
    conversion = "conversion",
    engagement = "engagement"
}
export enum ContentPillar {
    entertainment = "entertainment",
    education = "education",
    community = "community",
    promotion = "promotion",
    authority = "authority"
}
export enum ContentType {
    Blog = "Blog",
    Image = "Image",
    AdCopy = "AdCopy",
    Video = "Video"
}
export enum DraftPlatform {
    x = "x",
    linkedin = "linkedin",
    tiktok = "tiktok",
    google_business = "google_business",
    instagram = "instagram",
    threads = "threads",
    facebook = "facebook"
}
export enum DraftStatus {
    scheduled = "scheduled",
    published = "published",
    pending_approval = "pending_approval",
    approved = "approved",
    rejected = "rejected",
    draft = "draft",
    failed = "failed"
}
export enum EmailSequenceStatus {
    active = "active",
    completed = "completed",
    not_started = "not_started",
    paused = "paused"
}
export enum EmojiUsage {
    low = "low",
    high = "high",
    none = "none",
    moderate = "moderate"
}
export enum EngagementApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum EstimateStatus {
    expired = "expired",
    sent = "sent",
    rejected = "rejected",
    accepted = "accepted",
    draft = "draft"
}
export enum FunnelStage {
    bofu = "bofu",
    mofu = "mofu",
    tofu = "tofu"
}
export enum FunnelStepType {
    EmailSent = "EmailSent",
    TrialActivated = "TrialActivated",
    DemoCompleted = "DemoCompleted",
    DemoStarted = "DemoStarted",
    DemoStep1 = "DemoStep1",
    DemoStep2 = "DemoStep2",
    DemoStep3 = "DemoStep3",
    DemoStep4 = "DemoStep4",
    EmailOpened = "EmailOpened",
    EmailClicked = "EmailClicked"
}
export enum GenerationStatus {
    Failed = "Failed",
    Generating = "Generating",
    Complete = "Complete",
    Pending = "Pending"
}
export enum HttpMethod {
    get = "get",
    put = "put",
    post = "post",
    delete_ = "delete",
    patch = "patch"
}
export enum MarketingAuditStatus {
    pending = "pending",
    in_progress = "in_progress",
    completed = "completed",
    failed = "failed"
}
export enum MarketingFramework {
    bly = "bly",
    sugarman = "sugarman",
    halbert = "halbert",
    schwartz = "schwartz",
    hormozi = "hormozi",
    kennedy = "kennedy",
    cialdini = "cialdini",
    caples = "caples",
    carlton = "carlton",
    ogilvy = "ogilvy"
}
export enum MemoryMode {
    none = "none",
    with_notes = "with_notes",
    conversation_only = "conversation_only",
    with_summary = "with_summary"
}
export enum MessageRole {
    System = "System",
    User = "User",
    Assistant = "Assistant"
}
export enum NoteCategory {
    Email = "Email",
    System = "System",
    Call = "Call",
    Meeting = "Meeting",
    General = "General"
}
export enum OpportunityStage {
    New = "New",
    Qualified = "Qualified",
    Proposal = "Proposal",
    ClosedWon = "ClosedWon",
    Negotiation = "Negotiation",
    ClosedLost = "ClosedLost"
}
export enum OutputFormat {
    both = "both",
    html = "html",
    text = "text"
}
export enum PostFormat {
    text_only = "text_only",
    single_image = "single_image",
    video = "video",
    live = "live",
    poll = "poll",
    reel = "reel",
    story = "story",
    carousel = "carousel"
}
export enum PostStatus {
    scheduled = "scheduled",
    published = "published",
    draft = "draft",
    failed = "failed"
}
export enum ProposalStatus {
    pending_review = "pending_review",
    sent = "sent",
    approved = "approved",
    rejected = "rejected",
    accepted = "accepted",
    draft = "draft",
    archived = "archived"
}
export enum RankedDispatchStatus {
    pending = "pending",
    completed = "completed",
    routed = "routed",
    failed = "failed"
}
export enum ReplyClassification {
    HotLead = "HotLead",
    Unsubscribe = "Unsubscribe",
    Neutral = "Neutral",
    PositiveSignal = "PositiveSignal",
    Objection = "Objection"
}
export enum ReportStatus {
    pending_review = "pending_review",
    sent = "sent",
    approved = "approved",
    draft = "draft",
    archived = "archived"
}
export enum ReviewPlatform {
    yelp = "yelp",
    google = "google",
    facebook = "facebook"
}
export enum ReviewRequestStatus {
    unhappy = "unhappy",
    happy = "happy",
    sent = "sent",
    awaiting = "awaiting",
    reviewed = "reviewed",
    maxAttempts = "maxAttempts"
}
export enum ReviewRequestTriggerStatus {
    suppressed = "suppressed",
    pending = "pending",
    sent = "sent",
    completed = "completed"
}
export enum ReviewRequestTriggerType {
    manual = "manual",
    job_completion = "job_completion"
}
export enum ReviewSentiment {
    negative = "negative",
    positive = "positive",
    neutral = "neutral"
}
export enum RunStatus {
    cancelled = "cancelled",
    completed = "completed",
    paused_for_approval = "paused_for_approval",
    queued = "queued",
    failed = "failed",
    running = "running"
}
export enum ScheduledPostStatus {
    cancelled = "cancelled",
    pending = "pending",
    published = "published",
    failed = "failed"
}
export enum ScrapeError {
    networkError = "networkError",
    dynamicContent = "dynamicContent",
    invalidUrl = "invalidUrl",
    robotsBlocked = "robotsBlocked",
    tooManyRequests = "tooManyRequests",
    timeout = "timeout",
    invalidSelector = "invalidSelector"
}
export enum SelectorType {
    css = "css",
    xpath = "xpath"
}
export enum SendLogStatus {
    opened = "opened",
    unsubscribed = "unsubscribed",
    sent = "sent",
    delivered = "delivered",
    queued = "queued",
    failed = "failed",
    bounced = "bounced",
    clicked = "clicked"
}
export enum ServiceAreaPageStatus {
    published = "published",
    pending_approval = "pending_approval",
    planned = "planned",
    approved = "approved",
    draft = "draft",
    archived = "archived"
}
export enum SocialEngagementType {
    dm = "dm",
    comment = "comment",
    mention = "mention",
    form_fill = "form_fill",
    reaction = "reaction"
}
export enum SocialPlatform {
    linkedin = "linkedin",
    tiktok = "tiktok",
    google_business = "google_business",
    instagram = "instagram",
    facebook = "facebook"
}
export enum SubscriberStatus {
    active = "active",
    unsubscribed = "unsubscribed",
    complained = "complained",
    bounced = "bounced"
}
export enum TaskPriority {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    Urgent = "Urgent"
}
export enum TaskStatus {
    Cancelled = "Cancelled",
    InProgress = "InProgress",
    Completed = "Completed",
    NotStarted = "NotStarted"
}
export enum TrendDirection {
    up = "up",
    down = "down",
    flat = "flat"
}
export enum TrialStatus {
    Active = "Active",
    Converted = "Converted",
    Expired = "Expired"
}
export enum TrialStatus__1 {
    Active = "Active",
    Converted = "Converted",
    Expired = "Expired",
    NotStarted = "NotStarted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_NoAnswer_Failed_Connected {
    NoAnswer = "NoAnswer",
    Failed = "Failed",
    Connected = "Connected"
}
export enum Variant_active_archived_paused {
    active = "active",
    archived = "archived",
    paused = "paused"
}
export enum Variant_both_gdpr_canSpam {
    both = "both",
    gdpr = "gdpr",
    canSpam = "canSpam"
}
export enum Variant_cancelled_pending_success_failed {
    cancelled = "cancelled",
    pending = "pending",
    success = "success",
    failed = "failed"
}
export enum Variant_cancelled_sent_queued_failed {
    cancelled = "cancelled",
    sent = "sent",
    queued = "queued",
    failed = "failed"
}
export enum Variant_click_open_complaint_bounce_unsubscribe {
    click = "click",
    open = "open",
    complaint = "complaint",
    bounce = "bounce",
    unsubscribe = "unsubscribe"
}
export enum Variant_completed_queued_failed_running_paused {
    completed = "completed",
    queued = "queued",
    failed = "failed",
    running = "running",
    paused = "paused"
}
export enum Variant_hard_soft {
    hard = "hard",
    soft = "soft"
}
export enum Variant_ok {
    ok = "ok"
}
export enum Variant_ok_failed {
    ok = "ok",
    failed = "failed"
}
export enum Variant_pending_completed_failed_running {
    pending = "pending",
    completed = "completed",
    failed = "failed",
    running = "running"
}
export enum Variant_pending_sent_approved_rejected {
    pending = "pending",
    sent = "sent",
    approved = "approved",
    rejected = "rejected"
}
export enum Variant_provisioning_active_notConfigured_error {
    provisioning = "provisioning",
    active = "active",
    notConfigured = "notConfigured",
    error = "error"
}
export enum Variant_referral_notInterested_wrongPerson_unclassified_interested {
    referral = "referral",
    notInterested = "notInterested",
    wrongPerson = "wrongPerson",
    unclassified = "unclassified",
    interested = "interested"
}
export enum Variant_sms_email {
    sms = "sms",
    email = "email"
}
export enum Variant_twoOpens_manualTrigger_noOpenFortyEightHours {
    twoOpens = "twoOpens",
    manualTrigger = "manualTrigger",
    noOpenFortyEightHours = "noOpenFortyEightHours"
}
export enum Variant_warming_active_flagged_paused {
    warming = "warming",
    active = "active",
    flagged = "flagged",
    paused = "paused"
}
export enum WebhookCategory {
    crm = "crm",
    gbp = "gbp",
    social = "social",
    voice = "voice",
    reports = "reports",
    general = "general",
    email_sms = "email_sms",
    funding = "funding"
}
export enum WorkflowStatus {
    cancelled = "cancelled",
    pending = "pending",
    in_progress = "in_progress",
    completed = "completed",
    approved = "approved",
    rejected = "rejected",
    paused_for_approval = "paused_for_approval",
    failed = "failed"
}
export interface backendInterface {
    activateBrandKitTrial(slug: string, actionType: string): Promise<{
        __kind__: "ok";
        ok: BrandKitProspect;
    } | {
        __kind__: "err";
        err: string;
    }>;
    activateTrial(sessionId: string, firstName: string, businessName: string, city: string, niche: string, phone: string, email: string, website: string): Promise<{
        __kind__: "ok";
        ok: {
            loginUrl: string;
            emailWarning?: string;
            trialAccountId: string;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    activateTrialForDemo(sessionId: string, email: string): Promise<{
        __kind__: "ok";
        ok: {
            trialEndsAt: bigint;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    addActivityFeedItem(item: ActivityFeedItemInput): Promise<void>;
    addAgentLog(entry: AgentLogEntryInput): Promise<void>;
    addApprovalRecord(record: ApprovalItemRecord): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addAttributionTouch(id: string, touch: AttributionTouch): Promise<boolean>;
    addConversationMessage(tenantId: string, sessionId: string, role: string, content: string): Promise<void>;
    addDemoFunnelEntry(entry: DemoFunnelEntry): Promise<void>;
    addInboundReply(reply: InboundReply): Promise<void>;
    addLeadFromSocialComment(tenantId: string, commentId: string, _leadData: string): Promise<void>;
    addPaidAdsScore(score: PaidAdsScore): Promise<void>;
    addPipelineLead(lead: PipelineLead): Promise<void>;
    addScanPhoto(modelId: string, tenantId: string, storageUrl: string): Promise<string>;
    addSeoGeoScore(score: SeoGeoScore): Promise<void>;
    addSeoGeoVisibilitySnapshot(snapshot: SeoGeoVisibilitySnapshot): Promise<void>;
    addSmsMessage(threadId: string, tenantId: string, direction: string, sender: string, text: string): Promise<{
        __kind__: "ok";
        ok: SMSMessage;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addTriggerRule(rule: TriggerRuleInput): Promise<TriggerRule>;
    addWebsiteAgentScore(score: WebsiteAgentScore): Promise<void>;
    advanceWarmupDay(): Promise<void>;
    analyzeReply(replyId: string, leadId: string, replyText: string, niche: string): Promise<ReplyAnalysis>;
    appendAuditLog(entry: AuditLogEntry): Promise<void>;
    approveAndPushToCrm(jobId: string, tenantId: string): Promise<boolean>;
    approveBrowserAudit(jobId: string, tenantId: string, actorName: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    approveEngagement(tenantId: string, approvalId: string): Promise<void>;
    approveQueuedAction(actionId: string): Promise<void>;
    approveReplyDraft(inboxItemId: string): Promise<boolean>;
    archiveSmsThread(threadId: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    archiveThread(id: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignSegmentToQueue(queueId: string, leadEmails: Array<string>): Promise<boolean>;
    autoAuditLeads(tenantId: string, leads_in: Array<GeneratedLead>): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    autoEnrollOnInit(): Promise<void>;
    batchScrape(req: BatchScrapeRequest, tenantId: string): Promise<BatchScrapeResult>;
    buildComplianceFooter(leadId: string): Promise<string>;
    bulkApplyToggleToTier(req: BulkToggleRequest): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    bulkEnrollRoofingLeads(): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    bulkImportLeads(tenantId: string, leads: Array<ExtendedLeadInput>): Promise<BulkImportResult>;
    bulkSetFeatureToggles(tier: string, updates: Array<[string, boolean]>, modifiedBy: string): Promise<boolean>;
    calculateMarketingAuditScore(input: MarketingAuditInput): Promise<{
        __kind__: "ok";
        ok: {
            overallScore: bigint;
            brfScore: BRFScore;
            grade: string;
            categoryScores: Array<MarketingAuditScore>;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    callOpenRouterForTask(task: string, prompt: string, context: string): Promise<string>;
    cancelAutoTrigger(leadId: string): Promise<void>;
    cancelQueuedAction(actionId: string): Promise<void>;
    checkDnsRecords(domain: string): Promise<DnsCheckResult>;
    checkRobotsTxt(url: string): Promise<RobotsCheckResult>;
    checkSocialPresence(businessName: string): Promise<SocialPresence>;
    checkSocialPresencePublic(businessName: string): Promise<SocialPresence>;
    clearComposioWebhookSecret(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    clearMemory(threadId: string): Promise<boolean>;
    clearNicheAudioCache(nicheId: string): Promise<void>;
    clearScrapeHistory(tenantId: string): Promise<void>;
    commitWorkflowBatch(batchId: string): Promise<boolean>;
    completeDemo(sessionId: string, prospectEmail: string): Promise<{
        __kind__: "ok";
        ok: AuditReport;
    } | {
        __kind__: "err";
        err: string;
    }>;
    completeDemoAndProvisionTrial(leadId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    completeRun(runId: string, outputText: string, artifactIds: Array<string>): Promise<boolean>;
    createAgentArtifact(artifact: AgentArtifactRecord): Promise<boolean>;
    createAgentFromCommand(req: DograhCreateAgentRequest): Promise<DograhCommandResult>;
    createAgentRun(run: AgentRunRecord): Promise<boolean>;
    createAgentThread(thread: AgentThreadRecord): Promise<boolean>;
    createApprovalItem(item: ApprovalItem): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createArtifact(runId: string, threadId: string, tenantId: string, artifactType: ArtifactType, title: string, content: string, tags: Array<string>): Promise<string>;
    createBatchAuditJob(job: BatchAuditJob): Promise<string>;
    createBooking(tenantId: string, customerName: string, customerPhone: string, customerEmail: string, serviceType: string, scheduledAt: bigint, durationMinutes: bigint, notes: string): Promise<{
        __kind__: "ok";
        ok: Booking;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createBrandKitOutreachJob(niche: string, targetBusinessName: string, targetEmail: string, targetCity: string): Promise<BrandKitOutreachJob>;
    createBrandKitProspect(firstName: string, businessName: string, niche: string, city: string, phone: string, website: string | null): Promise<{
        __kind__: "ok";
        ok: BrandKitProspect;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createBusinessBrief(clientBusinessId: string, verticalProfileId: string, businessName: string, locationName: string, website: string, primaryKeyword: string, serviceArea: string, targetLocations: Array<string>, services: Array<string>, currentFindings: Array<string>, criticalFindings: Array<string>, importantFindings: Array<string>, monitorFindings: Array<string>, toolsRun: Array<string>, deliverables: Array<string>, nextAction: string, sessionLog: Array<string>, approvalConfig: string, performanceHistory: Array<PerformanceHistoryEntry>, localSEOHistory: Array<LocalSEOHistoryEntry>, reviewHistory: Array<ReviewHistoryEntry>, contentHistory: Array<ContentHistoryEntry>, fundingHistory: Array<FundingHistoryEntry>): Promise<{
        __kind__: "ok";
        ok: BusinessBrief;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createClientReport(tenantId: string, reportType: string, periodLabel: string, sections: Array<ReportSection>, aiNarrative: string, topWins: Array<string>, nextSteps: Array<string>, overallScore: bigint): Promise<{
        __kind__: "ok";
        ok: ClientReport;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCompany(clientBusinessId: string, name: string, size: string, vertical: string, website: string, address: string, phone: string, email: string, notes: string): Promise<{
        __kind__: "ok";
        ok: Company;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createContact(clientBusinessId: string, firstName: string, lastName: string, email: string, phone: string, title: string, leadSource: string, industry: string, nurtureStatus: string, notes: string): Promise<{
        __kind__: "ok";
        ok: Contact;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCustomField(clientBusinessId: string, name: string, fieldType: string, targetEntity: string, options: Array<string>, isRequired: boolean): Promise<{
        __kind__: "ok";
        ok: CustomField;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCustomFieldValue(clientBusinessId: string, customFieldId: string, entityId: string, entityType: string, value: string): Promise<{
        __kind__: "ok";
        ok: CustomFieldValue;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createDemoSession(businessName: string, niche: string): Promise<string>;
    createDemoSessionWithCity(businessName: string, niche: string, _city: string | null): Promise<string>;
    createDripQueue(queue: DripQueue): Promise<string>;
    createDualModelSearchJob(tenantId: string, niche: string, cityA: string, cityB: string): Promise<string>;
    createEstimate(tenantId: string, customerId: string, customerName: string, customerEmail: string, lineItems: Array<EstimateLineItem>, subtotal: number, taxTotal: number, total: number, notes: string, approvalNotes: string): Promise<{
        __kind__: "ok";
        ok: Estimate;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Alias for saveFreeAuditLead — preferred name for the frontend contract.
     */
    createFreeAuditLead(businessName: string, websiteUrl: string, location: string, contactEmail: string, phone: string, overallScore: bigint): Promise<void>;
    createLead(lead: Lead): Promise<void>;
    createLeadAuditJob(job: LeadAuditJob): Promise<string>;
    createMarketingAudit(input: MarketingAuditInput): Promise<{
        __kind__: "ok";
        ok: MarketingAudit;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createMultiLocationReport(report: MultiLocationReport): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createNewsletterCampaign(tenantId: string, name: string, subject: string, htmlBody: string, plainTextBody: string | null, fromName: string | null, fromEmail: string | null, tags: Array<string>): Promise<string>;
    createNote(clientBusinessId: string, authorId: string, title: string, body: string, category: NoteCategory, relatedToId: string, relatedToType: string): Promise<{
        __kind__: "ok";
        ok: Note;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createNotification(notification: NotificationRecord): Promise<void>;
    createOpportunity(clientBusinessId: string, contactId: string, companyId: string, title: string, value: bigint, stage: OpportunityStage, closeDate: bigint, probability: bigint, notes: string): Promise<{
        __kind__: "ok";
        ok: Opportunity;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createProposal(clientBusinessId: string, verticalProfileId: string, title: string, executiveSummary: string, situationAnalysis: string, strategyApproach: string, scopeOfWork: string, timeline: string, assumptions: string, clientResponsibilities: string, nextSteps: string): Promise<{
        __kind__: "ok";
        ok: Proposal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createRankedDispatchRoute(clientBusinessId: string, verticalProfileId: string, requestText: string): Promise<{
        __kind__: "ok";
        ok: RankedDispatchRoute;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createReview(review: Review): Promise<void>;
    createReviewRequest(request: ReviewRequest): Promise<void>;
    createReviewRequestTrigger(tenantId: string, triggerType: ReviewRequestTriggerType, bookingId: string | null, estimateId: string | null, customerName: string, customerPhone: string, customerEmail: string, platform: string): Promise<{
        __kind__: "ok";
        ok: ReviewRequestTrigger;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createReviewSyncRecord(tenantId: string, platform: ReviewPlatform, platformReviewId: string, rating: bigint, reviewerName: string, comment: string, sentiment: ReviewSentiment, sentimentScore: number, lastSyncAt: bigint): Promise<{
        __kind__: "ok";
        ok: ReviewSyncRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createRun(threadId: string, tenantId: string, agentType: string, inputPrompt: string, approvalRequired: boolean): Promise<string>;
    createScanModel(tenantId: string, title: string, niche: string): Promise<string>;
    createScheduledPost(post: ScheduledPost): Promise<void>;
    createSmsThread(tenantId: string, prospectPhone: string, prospectName: string, linkedLeadId: string | null): Promise<{
        __kind__: "ok";
        ok: SMSThread;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createSocialLead(lead: SocialLead): Promise<void>;
    createSocialPost(post: SocialPost): Promise<void>;
    createTask(clientBusinessId: string, assignedTo: string, title: string, description: string, priority: TaskPriority, status: TaskStatus, dueDate: bigint, taskType: string, relatedToId: string, relatedToType: string): Promise<{
        __kind__: "ok";
        ok: Task;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createTemplate(tenantId: string, name: string, role: string, systemPrompt: string, allowedTools: Array<string>, memoryMode: MemoryMode, approvalRequired: boolean): Promise<string>;
    createTenant(tenantId: TenantId, name: string): Promise<void>;
    createThread(tenantId: string, agentType: string, title: string): Promise<string>;
    credentialsHealthCheck(): Promise<boolean>;
    deleteAgentProduct(productId: string): Promise<void>;
    deleteAgentTask(taskId: string): Promise<void>;
    deleteCampaignTemplate(templateId: string): Promise<void>;
    deleteChatWidgetConfig(tenantId: TenantId): Promise<void>;
    deleteCompany(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteCompetitorAlert(id: string): Promise<void>;
    deleteCompetitorProfile(id: string): Promise<void>;
    deleteContact(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteCredential(tenantId: string, fieldName: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    deleteCustomField(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteCustomFieldValue(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteGeneratedContent(id: string): Promise<void>;
    deleteLead(tenantId: TenantId, leadId: string): Promise<void>;
    deleteLeadAttribution(id: string): Promise<void>;
    deleteLocationProfile(id: string): Promise<void>;
    deleteMarketingAudit(id: string): Promise<boolean>;
    deleteNewsletterCampaign(tenantId: string, campaignId: string): Promise<boolean>;
    deleteNewsletterSubscriber(tenantId: string, email: string): Promise<boolean>;
    deleteNote(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteOpportunity(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteProposal(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteRankedDispatchRoute(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteReview(tenantId: TenantId, reviewId: string): Promise<void>;
    deleteReviewRequest(tenantId: TenantId, requestId: string): Promise<void>;
    deleteScanModel(modelId: string, tenantId: string): Promise<void>;
    deleteSocialPost(tenantId: string, postId: string): Promise<void>;
    deleteTask(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteTemplate(id: string): Promise<boolean>;
    deleteTriggerRule(ruleId: string): Promise<void>;
    deleteVoiceAgentConfig(tenantId: TenantId): Promise<void>;
    deleteWebhookContract(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteWorkflowDef(workflowId: string): Promise<boolean>;
    deployAgent(agentId: string): Promise<{
        message: string;
        success: boolean;
    }>;
    dismissCompetitorAlert(id: string): Promise<boolean>;
    dismissSocialListeningAlert(tenantId: string, alertId: string): Promise<void>;
    dograhTransform(input: TransformationInput): Promise<TransformationOutput>;
    editAgentFromCommand(agentId: string, nlCommand: string): Promise<DograhCommandResult>;
    enqueueLeadSequence(leadId: string, email: string, name: string, niche: string, tier: string): Promise<bigint>;
    enqueueNewsletterSends(tenantId: string, campaignId: string, emails: Array<string>): Promise<bigint>;
    enrichLead(leadId: string, companyName: string, niche: string, city: string): Promise<LeadAIEnrichment>;
    enrollAllRoofingLeads(campaignId: string, dailyLimit: bigint): Promise<{
        __kind__: "ok";
        ok: EnrollmentResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    enrollLeadInFunnel(leadId: string, campaignId: string, niche: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    enrollRoofingLead(lead: RoofingLead): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    enrollRoofingLeadsIntoCampaign(): Promise<{
        enrolled: bigint;
        skipped: bigint;
    }>;
    executeAgentAction(actionId: string): Promise<{
        ok: boolean;
        error?: string;
        logId: string;
    }>;
    executeOperatorCommand(command: string): Promise<OperatorCommandResult>;
    executeToolAction(req: ToolActionRequest): Promise<{
        __kind__: "ok";
        ok: ToolActionResponse;
    } | {
        __kind__: "err";
        err: string;
    }>;
    executeWebhookContract(request: ExecutionRequest): Promise<{
        __kind__: "ok";
        ok: ExecutionResponse;
    } | {
        __kind__: "err";
        err: string;
    }>;
    extractLeads(html: string, sourceUrl: string): Promise<LeadExtractionResult>;
    failRun(runId: string, errorMessage: string): Promise<boolean>;
    flagEngagement(tenantId: string, approvalId: string, reason: string): Promise<void>;
    flushSmsQueue(): Promise<bigint>;
    generateContent(req: ContentGenerationRequest): Promise<string>;
    generateOutreachSequence(leadId: string, companyName: string, niche: string, city: string, framework: string): Promise<OutreachSequence>;
    generateProposalFromAudit(clientBusinessId: string, verticalProfileId: string, auditId: string, auditScore: bigint, auditFindings: Array<string>, auditRecommendations: Array<string>): Promise<{
        __kind__: "ok";
        ok: Proposal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    generateServiceAreaOutline(businessName: string, serviceArea: string, targetLocations: Array<string>, services: Array<string>, primaryKeyword: string): Promise<{
        __kind__: "ok";
        ok: ServiceAreaOutline;
    } | {
        __kind__: "err";
        err: string;
    }>;
    generateTailoredEmailCopy(businessName: string, city: string, niche: string, emailIndex: bigint, framework: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    generateTailoredEmailForLead(leadId: string, templateBody: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    generateUnsubscribeToken(leadId: string): Promise<string>;
    getAIUsageLogs(tenantId: string): Promise<Array<{
        id: string;
        provider: string;
        inputTokens: bigint;
        success: boolean;
        loggedAt: bigint;
    }>>;
    getAbacusApiKeyStatus(tenantId: string): Promise<{
        maskedKey: string;
        configured: boolean;
    }>;
    getAbacusStats(): Promise<{
        __kind__: "ok";
        ok: AbacusConfig;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAccountBrief(accountId: string): Promise<{
        __kind__: "ok";
        ok: AccountBrief;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAccountToolkit(accountId: string): Promise<{
        __kind__: "ok";
        ok: Array<string>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getActiveAdapter(tenantId: string): Promise<ProviderAdapterConfig | null>;
    getActiveChatWidgetConfigs(): Promise<Array<ChatWidgetConfig>>;
    getActiveNewsletterSubscribers(tenantId: string): Promise<Array<NewsletterSubscriber>>;
    getAgencySettings(): Promise<AgencySettings | null>;
    getAgentDeliverablesByTenant(tenantId: TenantId): Promise<Array<AgentDeliverable>>;
    getAgentLogs(agentId: string, limit: bigint): Promise<Array<AgentLogEntry>>;
    getAgentMemoryByThread(threadId: string): Promise<Array<AgentMemoryRecord>>;
    getAgentPerformanceSnapshotsByTenant(tenantId: TenantId): Promise<Array<AgentPerformanceSnapshot>>;
    getAgentProducts(): Promise<Array<AgentProduct>>;
    getAgentQuota(): Promise<{
        dailyCount: bigint;
        dailyLimit: bigint;
        remaining: bigint;
    }>;
    getAgentRunsByTenant(tenantId: string): Promise<Array<AgentRunRecord>>;
    getAgentRunsByThread(threadId: string): Promise<Array<AgentRunRecord>>;
    getAgentServiceRequestsByTenant(tenantId: TenantId): Promise<Array<AgentServiceRequest>>;
    getAgentSession(): Promise<AgentSessionState | null>;
    getAgentStatuses(): Promise<Array<AgentStatus>>;
    getAgentSubscriptionsByTenant(tenantId: TenantId): Promise<Array<AgentSubscription>>;
    getAgentTasksByTenant(tenantId: TenantId): Promise<Array<AgentTask>>;
    getAgentTemplateRecords(tenantId: string): Promise<Array<AgentTemplateStorageRecord>>;
    getAgentThread(id: string): Promise<AgentThreadRecord | null>;
    getAgentThreadsByTenant(tenantId: string): Promise<Array<AgentThreadRecord>>;
    getAllAgentLogs(limit: bigint): Promise<Array<AgentLogEntry>>;
    getAllAgentServiceRequests(): Promise<Array<AgentServiceRequest>>;
    getAllAgentSubscriptions(): Promise<Array<AgentSubscription>>;
    getAllAgentTasks(): Promise<Array<AgentTask>>;
    getAllBrandKitProspects(): Promise<Array<BrandKitProspect>>;
    getAllClientHealthScores(): Promise<Array<ClientHealthScore>>;
    getAllComposioTools(): Promise<{
        __kind__: "ok";
        ok: Array<ComposioTool>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAllEnrolledLeads(): Promise<Array<LeadCampaignStatus>>;
    getAllFunnelEvents(): Promise<{
        __kind__: "ok";
        ok: Array<[string, FunnelTimeline]>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAllGeneratedContent(): Promise<Array<ContentGenerationResult>>;
    getAllLeadCampaignDetails(): Promise<Array<LeadCampaignDetails>>;
    getAllNewsletterSubscribers(tenantId: string): Promise<Array<NewsletterSubscriber>>;
    getAllNicheScripts(): Promise<Array<NicheScript>>;
    getAllPaidAdsSubscriptions(): Promise<Array<PaidAdsSubscription>>;
    getAllScanModels(): Promise<Array<ScanModel>>;
    getAllSeoGeoRequests(): Promise<Array<SeoGeoRequest>>;
    getAllSeoGeoSubscriptions(): Promise<Array<SeoGeoSubscription>>;
    getAllTenants(): Promise<Array<string>>;
    getAllToolkitToggles(): Promise<{
        __kind__: "ok";
        ok: Array<ToolkitToggle>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAllTrialAccounts(): Promise<{
        __kind__: "ok";
        ok: Array<TrialAccount>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAllWebhookContracts(): Promise<{
        __kind__: "ok";
        ok: Array<WebhookContract>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAllWebhookExecutions(): Promise<{
        __kind__: "ok";
        ok: Array<WebhookExecution>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAllWebsiteAgentSubscriptions(): Promise<Array<WebsiteAgentSubscription>>;
    getAllWhiteLabelConfigs(): Promise<Array<WhiteLabelConfig>>;
    getApprovalItem(id: string): Promise<{
        __kind__: "ok";
        ok: ApprovalItem;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getApprovalRecordsByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<ApprovalItemRecord>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getApprovalsByRun(runId: string): Promise<{
        __kind__: "ok";
        ok: Array<ApprovalItem>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getApprovalsByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<ApprovalItem>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getArtifact(id: string): Promise<AgentArtifact | null>;
    getArtifactRecordsByTenant(tenantId: string): Promise<Array<AgentArtifactRecord>>;
    getArtifactRecordsByThread(threadId: string): Promise<Array<AgentArtifactRecord>>;
    getArtifactsByTenant(tenantId: string): Promise<Array<AgentArtifact>>;
    getArtifactsByThread(threadId: string): Promise<Array<AgentArtifact>>;
    getAudioCacheKeys(): Promise<Array<string>>;
    getAuditLog(): Promise<Array<AuditLogEntry>>;
    getAuditScore(tenantId: TenantId): Promise<AuditScore | null>;
    getAutomationConfigs(tenantId: string): Promise<Array<{
        trigger: string;
        isEnabled: boolean;
        requiresApproval: boolean;
    }>>;
    getAutopilotEmailConfig(): Promise<AutopilotConfig>;
    getBatchAuditJobs(tenantId: string): Promise<Array<BatchAuditJob>>;
    getBestPerformerMemory(tenantId: string): Promise<{
        __kind__: "ok";
        ok: BestPerformerMemory;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getBestPerformers(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<PerformanceInsight>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getBillingRecordsByTenant(tenantId: TenantId): Promise<Array<BillingRecord>>;
    getBookingsByTenant(tenantId: string): Promise<Array<Booking>>;
    getBouncesByQueue(queueId: string): Promise<Array<DripLeadBounceRecord>>;
    getBrandKitFunnelStats(): Promise<{
        activated: bigint;
        expired: bigint;
        totalProspects: bigint;
        byNiche: Array<[string, bigint]>;
        converted: bigint;
    }>;
    getBrandKitOutreachJobs(): Promise<Array<BrandKitOutreachJob>>;
    getBrandKitOutreachStats(): Promise<{
        totalSent: bigint;
        byNiche: Array<[string, bigint]>;
        totalClicked: bigint;
        totalConverted: bigint;
        totalOpened: bigint;
    }>;
    getBrandKitProspect(slug: string): Promise<BrandKitProspect | null>;
    getBrandVoiceProfile(tenantId: string): Promise<BrandVoiceProfile | null>;
    getBrfCallAttemptsByProspect(prospectSlug: string): Promise<Array<BrfOutboundCallAttempt>>;
    getBrfCallConversionStats(): Promise<BrfCallConversionStats>;
    getBrfOutboundCallAttempts(limit: bigint): Promise<Array<BrfOutboundCallAttempt>>;
    getBrfVoiceAgentConfig(): Promise<BrfVoiceAgentConfig | null>;
    getBrowserAuditResult(jobId: string): Promise<BrowserAuditResult | null>;
    getBrowserAuditResultsByTenant(tenantId: string): Promise<Array<BrowserAuditResult>>;
    getBrowserAuditStatus(remoteJobId: string, tenantId: string): Promise<{
        __kind__: "ok";
        ok: BrowserAuditResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getBulkSendJobs(): Promise<Array<BulkSendJob>>;
    getBusinessBrief(id: string): Promise<{
        __kind__: "ok";
        ok: BusinessBrief;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCacheStats(): Promise<AudioCacheStats>;
    getCachedAudio(key: string): Promise<string | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCampaignInstancesByTenant(tenantId: TenantId): Promise<Array<CampaignInstance>>;
    getCampaignStats(): Promise<CampaignStats>;
    getCampaignTemplates(): Promise<Array<CampaignTemplate>>;
    getChatWidgetConfig(tenantId: TenantId): Promise<ChatWidgetConfig | null>;
    getClientHealthScore(tenantId: string): Promise<ClientHealthScore | null>;
    getClientReportById(reportId: string): Promise<ClientReport | null>;
    getClientReports(tenantId: string): Promise<Array<ClientReport>>;
    getCommandHistory(offset: bigint, limit: bigint): Promise<Array<CommandLogEntry>>;
    getCompany(id: string): Promise<{
        __kind__: "ok";
        ok: Company;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCompetitorAlertsByTenant(tenantId: string): Promise<Array<CompetitorAlert>>;
    getCompetitorIntelReport(tenantId: string): Promise<CompetitorIntelReport | null>;
    getCompetitorProfile(id: string): Promise<CompetitorProfile | null>;
    getCompetitorProfilesByTenant(tenantId: string): Promise<Array<CompetitorProfile>>;
    getComplianceConfig(): Promise<ComplianceConfig>;
    getComposioApiKeyStatus(tenantId: string): Promise<{
        maskedKey: string;
        configured: boolean;
    }>;
    getComposioToolkitStatus(accountId: string): Promise<{
        tools: Array<string>;
        accountId: string;
        usingDefault: boolean;
    }>;
    getComposioWebhookSecretStatus(): Promise<{
        configured: boolean;
    }>;
    getConfiguredVoiceAgents(): Promise<Array<VoiceAgentConfig>>;
    getConnectedTools(accountId: string): Promise<{
        __kind__: "ok";
        ok: Array<ComposioTool>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getContact(id: string): Promise<{
        __kind__: "ok";
        ok: Contact;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getContentCalendar(id: string): Promise<{
        __kind__: "ok";
        ok: ContentCalendar;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getContentCalendarEntriesByCalendar(calendarId: string): Promise<{
        __kind__: "ok";
        ok: Array<ContentCalendarEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getContentCalendarEntriesByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<ContentCalendarEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getContentCalendarEntry(id: string): Promise<{
        __kind__: "ok";
        ok: ContentCalendarEntry;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getContentCalendarsByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<ContentCalendar>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getContentTierToggles(): Promise<Array<ContentTierToggle>>;
    getConversationHistory(tenantId: string, sessionId: string): Promise<Array<{
        id: string;
        content: string;
        role: string;
        timestamp: bigint;
        citations: Array<string>;
    }>>;
    getCsvImportBatches(tenantId: string): Promise<Array<CsvImportBatch>>;
    getCustomField(id: string): Promise<{
        __kind__: "ok";
        ok: CustomField;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCustomFieldValue(id: string): Promise<{
        __kind__: "ok";
        ok: CustomFieldValue;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getDecryptedCredential(tenantId: string, field: string): Promise<string | null>;
    getDeliverabilityEvents(): Promise<Array<DeliverabilityEvent>>;
    getDemoAudio(key: string): Promise<string | null>;
    getDemoAuditReport(sessionId: string): Promise<{
        __kind__: "ok";
        ok: AuditReport;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getDemoAuditReports(): Promise<{
        __kind__: "ok";
        ok: Array<DemoAuditReport>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Returns a TTS-optimised demo call script for a given niche and business name.
     * / No special characters — clean text safe for ElevenLabs synthesis.
     */
    getDemoCallScript(niche: string, businessName: string): Promise<string>;
    getDemoFunnelEntries(tenantId: string): Promise<Array<DemoFunnelEntry>>;
    getDemoSession(sessionId: string): Promise<DemoSession | null>;
    getDiscoveryConfig(): Promise<DiscoveryConfig>;
    getDograhAgents(): Promise<Array<DograhAgent>>;
    getDograhConfig(): Promise<DograhConfig | null>;
    getDomainSetupState(clientId: string): Promise<{
        __kind__: "ok";
        ok: DomainSetupState | null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getDripQueue(queueId: string): Promise<DripQueue | null>;
    getDripQueueLogs(queueId: string): Promise<Array<DripQueueEmailLog>>;
    getDripQueues(tenantId: string): Promise<Array<DripQueue>>;
    getDualModelSearchJob(jobId: string): Promise<DualModelSearchJob | null>;
    getDualModelSearchJobs(tenantId: string): Promise<Array<DualModelSearchJob>>;
    /**
     * / Returns the masked ElevenLabs API key for display in the Go Live dashboard.
     * / Reads from integrationCreds["platform"].elevenLabsKey — the single source of truth.
     * / Returns null when no key has been saved.
     */
    getElevenLabsApiKey(): Promise<string | null>;
    getEmailLogsByTenant(tenantId: string): Promise<Array<EmailLogRecord>>;
    getEmailQueueStatus(): Promise<{
        total: bigint;
        subdomains: Array<SenderSubdomainRecord>;
        config: AutopilotConfig;
    }>;
    getEmailReplyRecords(): Promise<Array<EmailReplyRecord>>;
    getEmailStats(leadId: string): Promise<{
        __kind__: "ok";
        ok: {
            opened: bigint;
            sent: bigint;
            clicked: bigint;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    getEmailTemplates(): Promise<Array<EmailTemplateExt>>;
    getEngagementApprovals(tenantId: string): Promise<Array<EngagementApproval>>;
    getEstimatesByTenant(tenantId: string): Promise<Array<Estimate>>;
    getExecutionLog(tenantId: string | null): Promise<Array<{
        id: string;
        status: string;
        completedAt?: bigint;
        startedAt: bigint;
        errorMessage?: string;
        tenantId: string;
        outputData: string;
        workflowId: string;
    }>>;
    getExtendedLeadsByTenant(tenantId: string): Promise<Array<ExtendedLead>>;
    getFeatureToggleLogs(): Promise<Array<FeatureToggleLog>>;
    getFeatureToggles(): Promise<Array<FeatureToggle>>;
    getFreeAuditLeads(): Promise<Array<FreeAuditLead>>;
    getFundabilityScore(tenantId: TenantId): Promise<FundabilityScore | null>;
    getFunnelRecord(leadId: string): Promise<{
        __kind__: "ok";
        ok: FunnelRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getFunnelTimeline(leadId: string): Promise<{
        __kind__: "ok";
        ok: FunnelTimeline;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getGeminiKeyStatus(): Promise<{
        configured: boolean;
    }>;
    getGeneratedContent(accountId: string): Promise<Array<ContentGenerationResult>>;
    getGeneratedContentById(id: string): Promise<ContentGenerationResult | null>;
    getGridAudit(email: string): Promise<GridAuditResult | null>;
    getGridHistory(email: string): Promise<Array<GridAuditSnapshot>>;
    getHealthMetrics(): Promise<HealthMetrics>;
    getHumanOversightAssignmentsByTenant(tenantId: TenantId): Promise<Array<HumanOversightAssignment>>;
    getInboundReplies(leadId: string | null): Promise<Array<InboundReply>>;
    getIntegrationCredentials(tenantId: string): Promise<MaskedCredentials>;
    getIntegrationHealth(): Promise<IntegrationHealthSummary>;
    getInvoicesByTenant(tenantId: TenantId): Promise<Array<Invoice>>;
    getKnowledgeDocuments(collectionName: string, tenantId: string): Promise<Array<{
        id: string;
        title: string;
        chunkCount: bigint;
        uploadedAt: bigint;
    }>>;
    getLastDiscoveryJob(): Promise<ScheduledDiscoveryJob | null>;
    getLatestMarketingAudit(clientBusinessId: string): Promise<MarketingAudit | null>;
    getLatestMultiLocationReport(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: MultiLocationReport | null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getLeadAttribution(id: string): Promise<LeadAttributionRecord | null>;
    getLeadAttributionsByLead(tenantId: string, leadId: string): Promise<Array<LeadAttributionRecord>>;
    getLeadAttributionsByTenant(tenantId: string): Promise<Array<LeadAttributionRecord>>;
    getLeadAuditJob(jobId: string): Promise<LeadAuditJob | null>;
    getLeadAuditJobs(tenantId: string): Promise<Array<LeadAuditJob>>;
    getLeadAuditResult(jobId: string): Promise<LeadAuditResult | null>;
    getLeadAuditResults(tenantId: string): Promise<Array<LeadAuditResult>>;
    getLeadById(tenantId: TenantId, leadId: string): Promise<Lead | null>;
    getLeadCampaignDetails(email: string): Promise<LeadCampaignDetails | null>;
    getLeadEnrichment(leadId: string): Promise<LeadAIEnrichment | null>;
    getLeadEnrollmentStatus(campaignId: string): Promise<{
        __kind__: "ok";
        ok: {
            total: bigint;
            pending: bigint;
            enrolled: bigint;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    getLeadQualityBySource(): Promise<Array<SourceQualityData>>;
    getLeadScore(leadId: string): Promise<LeadAIScore | null>;
    getLeadsByBatch(batchId: string): Promise<Array<ExtendedLead>>;
    getLeadsByNiche(niche: string): Promise<Array<ExtendedLead>>;
    getLeadsBySegment(tenantId: string, niche: string | null, tags: Array<string>, customFieldFilters: Array<[string, string]>): Promise<Array<ExtendedLead>>;
    getLeadsByTenantId(tenantId: TenantId): Promise<Array<Lead>>;
    getLocationProfile(id: string): Promise<LocationProfile | null>;
    getLocationProfilesByTenant(tenantId: string): Promise<Array<LocationProfile>>;
    getMarketingAudit(id: string): Promise<MarketingAudit | null>;
    getMemory(threadId: string): Promise<AgentMemory | null>;
    getMonthlyReport(id: string): Promise<{
        __kind__: "ok";
        ok: MonthlyReport;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMonthlyReportsByStatus(tenantId: string, status: ReportStatus): Promise<{
        __kind__: "ok";
        ok: Array<MonthlyReport>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMonthlyReportsByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<MonthlyReport>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMultiLocationReport(id: string): Promise<{
        __kind__: "ok";
        ok: MultiLocationReport;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMultiLocationReportsByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<MultiLocationReport>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getN8NConfig(): Promise<{
        instanceUrl: string;
        activeWorkflowCount: bigint;
        isConnected: boolean;
        lastTestedAt?: bigint;
        totalExecutionsToday: bigint;
    }>;
    getNewsletterAnalytics(tenantId: string): Promise<NewsletterCampaignStats>;
    getNewsletterCampaignById(tenantId: string, campaignId: string): Promise<NewsletterCampaign | null>;
    getNewsletterCampaignStats(tenantId: string, campaignId: string): Promise<NewsletterCampaignStats | null>;
    getNewsletterCampaigns(tenantId: string): Promise<Array<NewsletterCampaign>>;
    getNewsletterSendLogs(tenantId: string, campaignId: string): Promise<Array<NewsletterSendLog>>;
    getNewsletterSubscriber(tenantId: string, email: string): Promise<NewsletterSubscriber | null>;
    getNicheConversionFunnels(): Promise<Array<NicheConversionData>>;
    getNicheScript(niche: string): Promise<NicheScript | null>;
    getNicheScriptForSession(sessionId: string): Promise<NicheScript | null>;
    getNicheScriptLines(nicheId: string): Promise<Array<string> | null>;
    getNicheVoiceAssignments(): Promise<Array<NicheVoiceAssignment>>;
    /**
     * / Public query: returns the ElevenLabs voice ID for the given niche.
     */
    getNicheVoiceId(niche: string): Promise<string>;
    getNote(id: string): Promise<{
        __kind__: "ok";
        ok: Note;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getNotificationsByTenant(tenantId: TenantId): Promise<Array<NotificationRecord>>;
    getOpenRouterStatus(): Promise<{
        costPerMillion: string;
        contextWindow: bigint;
        isConnected: boolean;
        defaultModel: string;
        lastPingTime?: bigint;
    }>;
    getOpenRouterTaskOverrides(): Promise<Array<[string, string]>>;
    getOperatorChatHistory(): Promise<Array<OperatorChatMessage>>;
    getOperatorReportData(reportType: string): Promise<OperatorReportData>;
    getOperatorStats(): Promise<OperatorStats>;
    getOpportunity(id: string): Promise<{
        __kind__: "ok";
        ok: Opportunity;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getOptedOutEmails(): Promise<Array<string>>;
    getOptedOutPhones(): Promise<Array<string>>;
    getOutreachEvents(leadId: string): Promise<Array<OutreachEvent>>;
    getOutreachOverview(tenantId: string): Promise<{
        totalSentThisMonth: bigint;
        activeQueues: bigint;
        totalLeads: bigint;
        pendingBounces: bigint;
        avgResponseRate: number;
    }>;
    getOutreachSequencesForLead(leadId: string): Promise<Array<OutreachSequence>>;
    getPaidAdsAdCopiesByTenant(tenantId: TenantId): Promise<Array<PaidAdsAdCopy>>;
    getPaidAdsAlertsByTenant(tenantId: TenantId): Promise<Array<PaidAdsAlert>>;
    getPaidAdsAudiencesByTenant(tenantId: TenantId): Promise<Array<PaidAdsAudience>>;
    getPaidAdsCampaignsByTenant(tenantId: TenantId): Promise<Array<PaidAdsCampaign>>;
    getPaidAdsDeliverablesByTenant(tenantId: TenantId): Promise<Array<PaidAdsDeliverable>>;
    getPaidAdsScores(tenantId: TenantId): Promise<Array<PaidAdsScore>>;
    getPaidAdsSubscription(tenantId: TenantId): Promise<PaidAdsSubscription | null>;
    getPaymentMethod(tenantId: TenantId): Promise<PaymentMethod | null>;
    getPendingApprovalRecords(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<ApprovalItemRecord>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getPendingApprovalsByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<ApprovalItem>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getPendingQueuedActions(): Promise<Array<OutreachQueuedAction>>;
    getPerformanceInsight(id: string): Promise<{
        __kind__: "ok";
        ok: PerformanceInsight;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getPerformanceInsightsByReport(reportId: string): Promise<{
        __kind__: "ok";
        ok: Array<PerformanceInsight>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getPerformanceInsightsByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<PerformanceInsight>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getPingHistory(serviceId: string): Promise<Array<ApiPingRecord>>;
    getPingStatus(): Promise<Array<ApiPingRecord>>;
    getPipelineFunnelStats(niche: string): Promise<PipelineFunnelStats>;
    getPipelineLeads(): Promise<Array<PipelineLead>>;
    getProposal(id: string): Promise<{
        __kind__: "ok";
        ok: Proposal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getProviderAdapters(tenantId: string): Promise<Array<ProviderAdapterConfig>>;
    getProviderConfigs(): Promise<Array<{
        id: string;
        isActive: boolean;
        modelName: string;
        lastPingStatus?: string;
        providerType: string;
    }>>;
    getQueuePerformanceStats(tenantId: string): Promise<Array<{
        responded: bigint;
        name: string;
        sent: bigint;
        totalLeads: bigint;
        queueId: string;
        niche: string;
        engagementPct: number;
        bounced: bigint;
    }>>;
    getQueueThrottleConfig(queueId: string): Promise<DripQueueThrottleConfig | null>;
    getRankedDispatchRoute(id: string): Promise<{
        __kind__: "ok";
        ok: RankedDispatchRoute;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getReadinessScore(tenantId: string): Promise<ReadinessScore>;
    getRecentActivity(limit: bigint): Promise<Array<ActivityFeedItem>>;
    getReplyAnalysis(replyId: string): Promise<ReplyAnalysis | null>;
    getReplyInboxItems(): Promise<Array<ReplyInboxItem>>;
    getReportSchedule(tenantId: string): Promise<ReportSchedule | null>;
    getReviewById(tenantId: TenantId, reviewId: string): Promise<Review | null>;
    getReviewRequest(tenantId: TenantId, requestId: string): Promise<ReviewRequest | null>;
    getReviewRequestTriggersByTenant(tenantId: string): Promise<Array<ReviewRequestTrigger>>;
    getReviewRequests(tenantId: TenantId): Promise<Array<ReviewRequest>>;
    getReviewSyncRecordsByTenant(tenantId: string): Promise<Array<ReviewSyncRecord>>;
    getReviewsByTenantId(tenantId: TenantId): Promise<Array<Review>>;
    getRoofingCampaignStatus(email: string): Promise<LeadCampaignStatus | null>;
    getRunsByTenant(tenantId: string): Promise<Array<AgentRun>>;
    getRunsByThread(threadId: string): Promise<Array<AgentRun>>;
    getScanModel(modelId: string): Promise<ScanModel | null>;
    getScanModels(tenantId: string): Promise<Array<ScanModel>>;
    getScanner3dEnabled(tenantId: string): Promise<boolean>;
    getScanner3dToggleLog(): Promise<Array<[string, string, boolean, bigint]>>;
    getScheduledDiscoveryJobs(): Promise<Array<ScheduledDiscoveryJob>>;
    getScheduledPosts(tenantId: string): Promise<Array<ScheduledPost>>;
    getScrapeHistory(tenantId: string, limit: bigint): Promise<Array<ScrapeRecord>>;
    getScrapeHistoryCount(tenantId: string): Promise<bigint>;
    getSenderSubdomainStats(): Promise<Array<SenderSubdomainRecord>>;
    getSeoGeoContentItemsByTenant(tenantId: TenantId): Promise<Array<SeoGeoContentItem>>;
    getSeoGeoDeliverablesByTenant(tenantId: TenantId): Promise<Array<SeoGeoDeliverable>>;
    getSeoGeoGbpTasksByTenant(tenantId: TenantId): Promise<Array<SeoGeoGbpTask>>;
    getSeoGeoIssuesByTenant(tenantId: TenantId): Promise<Array<SeoGeoIssue>>;
    getSeoGeoOpportunitiesByTenant(tenantId: TenantId): Promise<Array<SeoGeoOpportunity>>;
    getSeoGeoReportsByTenant(tenantId: TenantId): Promise<Array<SeoGeoReport>>;
    getSeoGeoRequestsByTenant(tenantId: TenantId): Promise<Array<SeoGeoRequest>>;
    getSeoGeoScores(tenantId: TenantId): Promise<Array<SeoGeoScore>>;
    getSeoGeoSubscription(tenantId: TenantId): Promise<SeoGeoSubscription | null>;
    getSeoGeoVisibilitySnapshots(tenantId: TenantId): Promise<Array<SeoGeoVisibilitySnapshot>>;
    getServiceAreaPage(id: string): Promise<{
        __kind__: "ok";
        ok: ServiceAreaPage;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getServiceAreaPagesByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<ServiceAreaPage>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getServiceAreaPagesByStatus(tenantId: string, status: ServiceAreaPageStatus): Promise<{
        __kind__: "ok";
        ok: Array<ServiceAreaPage>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getServiceAreaPagesByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<ServiceAreaPage>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getSmsAutopilotJobs(): Promise<Array<SmsAutopilotJob>>;
    getSmsAutopilotRules(): Promise<Array<SmsAutopilotRule>>;
    getSmsMessagesByThread(threadId: string): Promise<Array<SMSMessage>>;
    getSmsThreadsByTenant(tenantId: string): Promise<Array<SMSThread>>;
    getSocialCommentsByTenant(tenantId: string, postId: string | null): Promise<Array<SocialComment>>;
    getSocialLeads(tenantId: string): Promise<Array<SocialLead>>;
    getSocialListeningAlerts(tenantId: string): Promise<Array<SocialListeningAlert>>;
    getSocialPostDraft(id: string): Promise<{
        __kind__: "ok";
        ok: SocialPostDraft;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getSocialPostDraftsByEntry(entryId: string): Promise<{
        __kind__: "ok";
        ok: Array<SocialPostDraft>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getSocialPostDraftsByStatus(tenantId: string, status: DraftStatus): Promise<{
        __kind__: "ok";
        ok: Array<SocialPostDraft>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getSocialPostDraftsByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<SocialPostDraft>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getSocialPostsByTenant(tenantId: string, startDate: bigint | null, endDate: bigint | null): Promise<Array<SocialPost>>;
    getSocialROIMetrics(tenantId: string, period: string): Promise<SocialROIMetrics | null>;
    getSubdomainRecords(): Promise<Array<SenderSubdomainRecord>>;
    getTask(id: string): Promise<{
        __kind__: "ok";
        ok: Task;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getTemplate(id: string): Promise<AgentTemplateRecord | null>;
    getTemplates(tenantId: string): Promise<Array<AgentTemplateRecord>>;
    getTenantName(tenantId: TenantId): Promise<string>;
    getThread(id: string): Promise<AgentThread | null>;
    getThreadByAgentAndTenant(agentType: string, tenantId: string): Promise<AgentThread | null>;
    getThreadsByTenant(tenantId: string): Promise<Array<AgentThread>>;
    getToolkitToggles(tierId: string): Promise<{
        __kind__: "ok";
        ok: Array<ToolkitToggle>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getTools(): Promise<Array<ToolDefinition>>;
    getToolsByCategory(category: string): Promise<Array<ToolDefinition>>;
    getTopPerformingNiche(): Promise<NicheConversionData | null>;
    getTrialAccount(id: string): Promise<{
        __kind__: "ok";
        ok: TrialAccount;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getTrialActivityScore(trialId: string): Promise<bigint>;
    getTrialByLeadId(leadId: string): Promise<{
        __kind__: "ok";
        ok: TrialAccount;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getTrialFeatureFlags(trialAccountId: string): Promise<FeatureFlags | null>;
    getTrialNudgeSchedule(slug: string): Promise<Array<WarmSequenceEmailSchedule>>;
    getTriggerRules(): Promise<Array<TriggerRule>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    /**
     * / Returns stored Vapi call logs for a tenant.
     */
    getVapiCallLogs(tenantId: string): Promise<Array<VapiCallLog>>;
    getVapiNicheVoiceId(nicheId: string): Promise<string | null>;
    /**
     * / Returns the current Vapi provisioning status for a tenant.
     */
    getVapiProvisioningStatus(tenantId: string): Promise<VapiProvisioningStatus>;
    /**
     * / Returns whether Vapi is configured, current provisioning status, and the
     * / map of niche→assistantId pairs for a tenant.
     */
    getVapiStatus(tenantId: string): Promise<{
        provisioningStatus: string;
        configured: boolean;
        assistantIds: Array<[string, string]>;
    }>;
    getVectorIndexStatus(): Promise<{
        collectionsCount: bigint;
        totalChunks: bigint;
        totalDocuments: bigint;
    }>;
    getVerticalProfile(id: string): Promise<{
        __kind__: "ok";
        ok: VerticalProfileExt;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getVerticalProfileByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: VerticalProfileExt;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getVoiceAgentConfig(tenantId: TenantId): Promise<VoiceAgentConfig | null>;
    getWarmLeadHandoffs(): Promise<Array<WarmLeadHandoff>>;
    getWarmSequenceEvents(enrollmentId: string): Promise<Array<WarmSequenceEmailEvent>>;
    getWarmSequenceSchedules(enrollmentId: string): Promise<Array<WarmSequenceEmailSchedule>>;
    getWebhookContract(id: string): Promise<{
        __kind__: "ok";
        ok: WebhookContract;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWebhookContractSummaries(): Promise<{
        __kind__: "ok";
        ok: Array<ContractSummary>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWebhookContractsByCategory(category: WebhookCategory): Promise<{
        __kind__: "ok";
        ok: Array<WebhookContract>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWebhookExecution(id: string): Promise<{
        __kind__: "ok";
        ok: WebhookExecution;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWebhookExecutionsByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<WebhookExecution>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWebhookExecutionsByContract(contractId: string): Promise<{
        __kind__: "ok";
        ok: Array<WebhookExecution>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWebhookLog(provider: string): Promise<Array<WebhookEvent>>;
    getWebhookUrl(): Promise<string>;
    getWebhookUrls(): Promise<{
        stripe: string;
        twilio: string;
        vapi: string;
        composio: string;
        sendgrid: string;
    }>;
    getWebsiteAgentScores(tenantId: TenantId): Promise<Array<WebsiteAgentScore>>;
    getWebsiteAgentSubscription(tenantId: TenantId): Promise<WebsiteAgentSubscription | null>;
    getWebsiteContentBriefsByTenant(tenantId: TenantId): Promise<Array<WebsiteContentBrief>>;
    getWebsiteCroOpportunitiesByTenant(tenantId: TenantId): Promise<Array<WebsiteCroOpportunity>>;
    getWebsiteDeliverablesByTenant(tenantId: TenantId): Promise<Array<WebsiteDeliverable>>;
    getWebsiteIssuesByTenant(tenantId: TenantId): Promise<Array<WebsiteIssue>>;
    getWebsitePageQueueByTenant(tenantId: TenantId): Promise<Array<WebsitePageQueueItem>>;
    getWhiteLabelConfig(tenantId: TenantId): Promise<WhiteLabelConfig | null>;
    getWorkflowDefs(): Promise<Array<{
        id: string;
        pushedToAccounts: Array<string>;
        name: string;
        createdAt: bigint;
        tags: Array<string>;
        description: string;
        isActive: boolean;
        scope: string;
    }>>;
    getWorkflowLogsByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<WorkflowLogEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWorkflowLogsByWorkflow(workflowId: string): Promise<{
        __kind__: "ok";
        ok: Array<WorkflowLogEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWorkflowSnapshot(workflowId: string): Promise<{
        __kind__: "ok";
        ok: WorkflowStatusSnapshot;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getWorkflowSnapshotsByTenant(tenantId: string): Promise<{
        __kind__: "ok";
        ok: Array<WorkflowStatusSnapshot>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    handleNewsletterBounce(tenantId: string, email: string, bounceType: BounceType, reason: string): Promise<boolean>;
    handleNewsletterUnsubscribe(tenantId: string, email: string, campaignId: string): Promise<boolean>;
    http_request(req: {
        url: string;
        method: string;
        body: Uint8Array;
        headers: Array<[string, string]>;
    }): Promise<{
        body: Uint8Array;
        headers: Array<[string, string]>;
        upgrade?: boolean;
        status_code: number;
    }>;
    /**
     * / ICP http_request_update — handles POST /api/book-appointment from Vapi.
     * / Parses the Vapi tool-call body, creates a booking, and fires a Twilio SMS.
     */
    http_request_update(req: {
        url: string;
        method: string;
        body: Uint8Array;
        headers: Array<[string, string]>;
    }): Promise<{
        body: Uint8Array;
        headers: Array<[string, string]>;
        status_code: number;
    }>;
    importNewsletterSubscribers(tenantId: string, emails: Array<string>): Promise<SubscriberImportResult>;
    importWorkflowBatch(defsJson: Array<{
        id: string;
        name: string;
        tags: Array<string>;
        description: string;
        scope: string;
        workflowJson: string;
    }>): Promise<{
        results: Array<{
            id: string;
            valid: boolean;
            name: string;
            errors: Array<string>;
            index: bigint;
        }>;
        batchId: string;
    }>;
    incrementScanModelViews(modelId: string): Promise<void>;
    initDefaultTools(): Promise<void>;
    initiateOAuthFlow(req: OAuthInitRequest): Promise<{
        __kind__: "ok";
        ok: OAuthInitResponse;
    } | {
        __kind__: "err";
        err: string;
    }>;
    isCallerAdmin(): Promise<boolean>;
    isComposioRoutingEnabled(): Promise<boolean>;
    isContentEnabledForTier(tier: string): Promise<boolean>;
    isDemoSessionExpired(sessionId: string): Promise<boolean>;
    linkSocialLeadToCRM(tenantId: string, socialLeadId: string, crmLeadId: string): Promise<void>;
    listAllRankedDispatchRoutes(): Promise<{
        __kind__: "ok";
        ok: Array<RankedDispatchRoute>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listAllVerticalProfiles(): Promise<Array<VerticalProfileExt>>;
    listBusinessBriefsByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<BusinessBrief>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listCompaniesByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<Company>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listContactsByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<Contact>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listCustomFieldValuesByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<CustomFieldValue>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listCustomFieldValuesByEntity(entityId: string, entityType: string): Promise<{
        __kind__: "ok";
        ok: Array<CustomFieldValue>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listCustomFieldsByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<CustomField>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listLeadEnrichments(): Promise<Array<LeadAIEnrichment>>;
    listLeadScores(): Promise<Array<LeadAIScore>>;
    listMarketingAuditsByClient(clientBusinessId: string): Promise<Array<MarketingAudit>>;
    listNotesByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<Note>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listOpportunitiesByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<Opportunity>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listOutreachSequences(): Promise<Array<OutreachSequence>>;
    listProposalsByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<Proposal>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listProposalsByStatus(clientBusinessId: string, status: ProposalStatus): Promise<{
        __kind__: "ok";
        ok: Array<Proposal>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listRankedDispatchRoutesByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<RankedDispatchRoute>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listRankedDispatchRoutesByStatus(status: RankedDispatchStatus): Promise<{
        __kind__: "ok";
        ok: Array<RankedDispatchRoute>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listReplyAnalyses(): Promise<Array<ReplyAnalysis>>;
    listTasksByClient(clientBusinessId: string): Promise<{
        __kind__: "ok";
        ok: Array<Task>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listVerticalProfilesByCategory(category: string): Promise<Array<VerticalProfileExt>>;
    lockSocialContent(sessionId: string): Promise<boolean>;
    logDripEmailSent(log: DripQueueEmailLog): Promise<void>;
    logFunnelStep(leadId: string, step: string, metadata: string | null): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    logTrialInteraction(kitPageSlug: string, interactionType: string): Promise<void>;
    logWorkflowEntry(entry: WorkflowLogEntry): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markBrandKitConverted(slug: string): Promise<{
        __kind__: "ok";
        ok: BrandKitProspect;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markBrfCallConverted(id: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markNotificationRead(notificationId: string): Promise<void>;
    markReplyActionComplete(replyId: string): Promise<void>;
    markRoofingEmailOpened(email: string): Promise<void>;
    markSmsMessagesRead(threadId: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markSocialCommentResponded(tenantId: string, commentId: string): Promise<void>;
    masterAgentAppendMessage(sessionId: string, role: MessageRole, content: string): Promise<string>;
    masterAgentDeleteSession(sessionId: string): Promise<boolean>;
    masterAgentEndSession(sessionId: string): Promise<boolean>;
    masterAgentGetActiveSession(): Promise<string | null>;
    masterAgentGetContextSnapshot(): Promise<MasterAgentContextSnapshot>;
    masterAgentGetMessages(sessionId: string): Promise<Array<MasterAgentMessage>>;
    masterAgentListSessions(): Promise<Array<MasterAgentSession>>;
    masterAgentStartSession(platformContext: string | null): Promise<string>;
    matchRankedAgent(requestText: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    mergeBrowserScoresIntoAuditResult(jobId: string, tenantId: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    movePipelineLead(leadId: string, newLane: string): Promise<void>;
    n8nTransform(input: TransformationInput): Promise<TransformationOutput>;
    pauseAutopilotEmail(): Promise<void>;
    pauseNewsletterCampaign(tenantId: string, campaignId: string): Promise<boolean>;
    pauseRoofingCampaign(): Promise<Variant_ok>;
    pauseRunForApproval(runId: string, reason: string): Promise<string>;
    pauseSubdomain(subdomain: string): Promise<void>;
    processBounceEvent(email: string, bounceType: Variant_hard_soft, leadId: string, subdomain: string): Promise<void>;
    processComplaintEvent(email: string, subdomain: string, leadId: string): Promise<void>;
    processDeliverabilityWebhook(eventsJson: string): Promise<bigint>;
    processDripQueueStep(queueId: string): Promise<boolean>;
    processEmailReply(leadId: string, replyBody: string): Promise<string>;
    processNewsletterMergeTags(tenantId: string, email: string, htmlBody: string): Promise<string>;
    processNextRoofingCampaignSend(): Promise<void>;
    processSmsReply(leadId: string, leadName: string, leadNiche: string, messageBody: string): Promise<string>;
    processSmsStop(phoneNumber: string): Promise<void>;
    processUnsubscribeRequest(leadId: string, token: string, email: string): Promise<boolean>;
    /**
     * / Registers an ElevenLabs fallback record for a tenant.
     * / Called by the frontend when Vapi provisioning fails, so the system knows
     * / to use ElevenLabs TTS for the next outbound demo/real call attempt.
     */
    provisionElevenLabsFallback(businessName: string, niche: string, phoneNumber: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    provisionTrialAccount(req: TrialProvisionRequest): Promise<{
        __kind__: "ok";
        ok: TrialAccount;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Create a new Vapi assistant for a tenant and store the returned assistantId.
     * / Reads vapiKey from encrypted integration credentials.
     * / Super Admin can provision for any tenant; Agency Admin / Business Owner only their own.
     */
    provisionVapiAssistant(tenantId: string, businessName: string, phone: string, niche: string, greetingScript: string, qualifyingQuestions: Array<string>): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    pushRoofingTemplate(targetScope: string): Promise<{
        accountsUpdated: bigint;
        message: string;
        success: boolean;
    }>;
    pushWorkflowPlatformWide(workflowId: string): Promise<void>;
    pushWorkflowToAccounts(workflowId: string, accountIds: Array<string>): Promise<void>;
    pushWorkflowToScope(workflowId: string, scopeText: string): Promise<void>;
    queryRAG(question: string, collectionName: string, tenantId: string): Promise<{
        insufficiencyMessage?: string;
        isInsufficient: boolean;
        citations: Array<string>;
        chunks: Array<{
            id: string;
            content: string;
            chunkIndex: bigint;
        }>;
    }>;
    queueSmsForRule(leadId: string, ruleId: string, ownerName: string, niche: string, phone: string, demoLink: string): Promise<string>;
    reEnrollLead(email: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    receiveComposioWebhook(body: string, signature: string, webhookId: string, timestamp: string): Promise<{
        body: string;
        statusCode: bigint;
        success: boolean;
        eventType: string;
    }>;
    receiveN8NWebhook(payload: string, executionId: string): Promise<void>;
    receiveSendgridEvents(body: string): Promise<{
        success: boolean;
        processed: bigint;
    }>;
    receiveSendgridInbound(params: Array<[string, string]>): Promise<string>;
    receiveStripeWebhook(body: string, sigHeader: string): Promise<{
        success: boolean;
        eventType: string;
    }>;
    receiveTwilioWebhook(path: string, params: Array<[string, string]>, signature: string): Promise<string>;
    receiveVapiWebhook(body: string, vapiSecret: string): Promise<string>;
    recordBrandKitActivity(slug: string, featureUsed: string): Promise<void>;
    recordBrfCallAttemptResult(id: string, status: Variant_NoAnswer_Failed_Connected, vapiCallId: string | null): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    recordLeadBounce(leadId: string, queueId: string, bounceType: Variant_hard_soft, reason: string | null): Promise<void>;
    recordNewsletterBounce(tenantId: string, email: string, bounceType: BounceType): Promise<boolean>;
    recordOutreachEvent(event: OutreachEvent): Promise<void>;
    recordPingResult(serviceId: string, status: string, latencyMs: bigint, errorMessage: string | null): Promise<void>;
    recordTrialActivity(trialId: string, eventType: string): Promise<bigint>;
    recordWarmLeadHandoff(handoff: WarmLeadHandoff): Promise<void>;
    refreshCompetitorIntel(report: CompetitorIntelReport): Promise<void>;
    registerSubdomain(subdomain: string): Promise<void>;
    rejectBrowserAudit(jobId: string, tenantId: string, actorName: string, reason: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    rejectEngagement(tenantId: string, approvalId: string): Promise<void>;
    rejectReplyDraft(inboxItemId: string): Promise<void>;
    removeContentCalendarEntry(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeMonthlyReport(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeMultiLocationReport(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeServiceAreaPage(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeSocialPostDraft(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeVerticalProfile(id: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    requestReBrowserAudit(jobId: string, tenantId: string, actorName: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    requeueBouncedLead(leadId: string, queueId: string): Promise<boolean>;
    resetDailySubdomainCounters(): Promise<void>;
    resetDiscoveryTimer(): Promise<void>;
    resetDripDailyCap(queueId: string): Promise<void>;
    resetEmailSchedulerTimer(): Promise<void>;
    resetNicheScript(nicheId: string): Promise<void>;
    resetSmsSchedulerTimer(): Promise<void>;
    resetToDefaults(): Promise<boolean>;
    resolveApprovalItem(id: string, resolution: ApprovalResolution, resolvedBy: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resolveApprovalRecord(id: string, status: string, resolvedBy: string, note: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Respond to a review — sets the AI-drafted response and marks it responded.
     */
    respondToReview(tenantId: TenantId, reviewId: string, response: string): Promise<void>;
    resumeAutopilotEmail(): Promise<void>;
    resumeRoofingCampaign(): Promise<Variant_ok>;
    routeModelRequest(req: AbacusRouteRequest): Promise<{
        __kind__: "ok";
        ok: AbacusRouteResponse;
    } | {
        __kind__: "err";
        err: string;
    }>;
    routeThroughComposio(action: string, params: Array<[string, string]>, accountId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    runAgentNode(nodeType: string, inputData: string, tenantId: string): Promise<{
        id: string;
        outputData: string;
        runAt: bigint;
        nodeType: string;
    }>;
    runPageSpeedAudit(url: string): Promise<string>;
    runPageSpeedAuditPublic(url: string): Promise<string>;
    saveAbacusApiKey(apiKey: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveAccountBrief(brief: AccountBrief): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveAgentMemory(memory: AgentMemoryRecord): Promise<boolean>;
    saveAgentTemplate(tmpl: AgentTemplateStorageRecord): Promise<boolean>;
    saveAutomationConfig(_trigger: string, _isEnabled: boolean, _requiresApproval: boolean, _tenantId: string): Promise<void>;
    saveBestPerformerMemory(mem: BestPerformerMemory): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveBrowserAuditResult(result: BrowserAuditResult): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveComposioApiKey(apiKey: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveComposioWebhookSecret(secret: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveContentCalendar(calendar: ContentCalendar): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveContentCalendarEntry(entry: ContentCalendarEntry): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveDemoAudio(key: string, base64Audio: string): Promise<void>;
    saveDemoAuditReport(report: DemoAuditReport): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveDemoAuditScore(sessionId: string, score: bigint): Promise<boolean>;
    saveDograhApiKey(apiKey: string): Promise<{
        message: string;
        success: boolean;
    }>;
    saveDomainSetupState(clientId: string, state: DomainSetupState): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Save the platform ElevenLabs API key (any authenticated caller). Stored XOR-obfuscated.
     * / Writes into integrationCreds["platform"].elevenLabsKey — the single source of truth.
     */
    saveElevenLabsApiKey(apiKey: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveFreeAuditLead(businessName: string, websiteUrl: string, location: string, contactEmail: string, phone: string, overallScore: bigint): Promise<void>;
    saveIntegrationCredentials(tenantId: string, creds: IntegrationCredentials): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveLeadAuditResult(result: LeadAuditResult): Promise<void>;
    saveMonthlyReport(report: MonthlyReport): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveN8NConfig(instanceUrl: string, apiKey: string): Promise<void>;
    saveOpenRouterApiKey(key: string): Promise<void>;
    saveOperatorChatMessage(role: string, content: string, commandType: string | null): Promise<string>;
    savePerformanceInsight(insight: PerformanceInsight): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Save the platform SendGrid API key (any authenticated caller). Stored XOR-obfuscated.
     * / Writes into integrationCreds["platform"].sendgridKey.
     */
    saveSendGridApiKey(tenantId: string, sendgridKey: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveServiceAreaPage(page: ServiceAreaPage): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveSocialPostDraft(draft: SocialPostDraft): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Save the platform Twilio credentials (any authenticated caller). Stored XOR-obfuscated.
     * / Writes into integrationCreds["platform"].twilioSid, twilioAuth, twilioNumber.
     */
    saveTwilioCredentials(tenantId: string, twilioSid: string, twilioAuth: string, twilioNumber: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Save Vapi API key and assistant ID for a tenant, then auto-provision any
     * / niches that are not yet configured if vapiKey is non-empty.
     */
    saveVapiCredentials(tenantId: string, vapiKey: string, vapiAssistantId: string): Promise<{
        ok: boolean;
        error?: string;
    }>;
    saveVerticalProfile(profile: VerticalProfileExt): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveWebhookSecrets(stripeSecret: string, vapiSecret: string, sgDomain: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveWorkflowDef(id: string, name: string, description: string, tags: Array<string>, scope: string, workflowJson: string): Promise<void>;
    saveWorkflowSnapshot(snapshot: WorkflowStatusSnapshot): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    scheduleBrfOutboundCall(prospectSlug: string): Promise<{
        __kind__: "ok";
        ok: BrfOutboundCallAttempt;
    } | {
        __kind__: "err";
        err: string;
    }>;
    scheduleCampaign(tenantId: string, campaignId: string, sendAt: bigint | null): Promise<boolean>;
    scheduleTrialNudgeEmails(slug: string): Promise<void>;
    scheduleWarmSequenceEmail(enrollmentId: string, touchIndex: bigint, delayHours: bigint, recipient: string, subject: string, body: string): Promise<string>;
    scoreLead(leadId: string, companyName: string, niche: string): Promise<LeadAIScore>;
    scrapeUrl(req: ScrapeRequest, tenantId: string): Promise<ScrapeResult>;
    searchLeadsWithLLM(niche: string, city: string, limit: bigint, includeEnrichment: boolean): Promise<{
        __kind__: "ok";
        ok: LLMLeadSearchResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    searchNewsletterSubscribers(tenantId: string, searchQuery: string, statusFilter: SubscriberStatus | null, tagFilter: string | null): Promise<Array<NewsletterSubscriber>>;
    seedDefaultWebhookContracts(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    seedDemoData(): Promise<void>;
    seedVerticalProfiles(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendBookingConfirmationEmail(appointmentId: string, customerEmail: string, customerName: string, businessName: string, appointmentDateTime: string, address: string, tenantId: string): Promise<EmailSendResult>;
    sendClientReportEmail(clientId: string, clientEmail: string, clientName: string, reportPeriod: string, reportSummaryHtml: string, tenantId: string): Promise<EmailSendResult>;
    sendHealthScoreAlertEmail(clientId: string, adminEmail: string, clientName: string, healthScore: bigint, previousScore: bigint, topIssue: string, tenantId: string): Promise<EmailSendResult>;
    sendNewsletterCampaign(tenantId: string, campaignId: string): Promise<bigint>;
    sendOnboardingEmail(userId: string, userEmail: string, userName: string, userRole: string, onboardingStep: string, tenantId: string): Promise<EmailSendResult>;
    sendReviewRequestEmail(leadId: string, clientName: string, businessName: string, reviewPlatformUrl: string, recipient: string, tenantId: string): Promise<EmailSendResult>;
    sendWarmSequenceEmail(enrollmentId: string, touchIndex: bigint, delayHours: bigint, recipient: string, subject: string, body: string): Promise<EmailSendResult>;
    setAccountToolkit(accountId: string, tools: Array<string>): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setAgentEnabled(agentId: string, enabled: boolean): Promise<void>;
    setBrandVoiceProfile(tenantId: string, profile: BrandVoiceProfile): Promise<void>;
    setCachedAudio(key: string, base64Audio: string): Promise<void>;
    setComposioAsPrimaryMCP(enabled: boolean): Promise<{
        __kind__: "ok";
        ok: string;
    }>;
    setContentTierToggle(tier: string, enabled: boolean): Promise<void>;
    setFeatureToggle(featureName: string, tier: string, isEnabled: boolean, modifiedBy: string): Promise<boolean>;
    setGeminiApiKey(key: string): Promise<void>;
    setNewsletterCampaignStatus(tenantId: string, campaignId: string, status: CampaignStatus): Promise<boolean>;
    setNicheScriptLines(nicheId: string, lines: Array<string>): Promise<void>;
    setNicheVoiceAssignment(nicheId: string, voiceId: string, voiceName: string): Promise<void>;
    setOpenRouterTaskModel(task: string, model: string): Promise<void>;
    setProviderAdapter(tenantId: string, adapterType: AdapterType, isEnabled: boolean, apiKey: string | null, baseUrl: string | null, modelId: string | null): Promise<string>;
    setQueueThrottleConfig(queueId: string, config: DripQueueThrottleConfig): Promise<void>;
    setScanner3dEnabled(tenantId: string, enabled: boolean): Promise<void>;
    setScanner3dEnabledBatch(updates: Array<[string, boolean]>): Promise<void>;
    setSocialCommentResponse(tenantId: string, commentId: string, response: string): Promise<void>;
    setToolkitToggle(toggle: ToolkitToggle): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    shouldLockSocialContent(sessionId: string): Promise<boolean>;
    stageBulkLeadsFromSearch(tenantId: string, jobId: string, leads_in: Array<BulkLeadInput>): Promise<bigint>;
    stageScrapeLeads(tenantId: string, scrapeId: bigint): Promise<bigint>;
    storeDeliverabilityEvent(evt: DeliverabilityEvent): Promise<void>;
    submitAgentCommand(commandText: string, sessionId: string): Promise<AgentCommandResult>;
    /**
     * / Fetch call logs from Vapi and store new entries in canister state.
     * / Returns the count of newly stored logs.
     */
    syncVapiCallLogs(tenantId: string): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    testAbacusConnection(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    testAllConnections(): Promise<IntegrationHealthSummary>;
    testComposioConnection(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    testDograhConnection(): Promise<DograhTestResult>;
    /**
     * / Tests connectivity to the ElevenLabs API using the stored platform key.
     * / Makes an HTTP outcall to GET /v1/voices and returns the voice count on success.
     */
    testElevenLabsConnection(): Promise<{
        message: string;
        success: boolean;
        voiceCount: bigint;
    }>;
    testEmailSend(): Promise<{
        message: string;
        timestamp: bigint;
        success: boolean;
    }>;
    testIntegration(tenantId: string, service: string): Promise<ConnectionTestResult>;
    testLeadFinderDiagnostic(): Promise<string>;
    testN8NConnection(): Promise<boolean>;
    testNvidiaConnection(): Promise<IntegrationTestResult>;
    testOpenRouterConnection(): Promise<boolean>;
    testServiceConnection(tenantId: string, service: string): Promise<ConnectionTestResult>;
    toggleTriggerRule(ruleId: string, enabled: boolean): Promise<void>;
    trackComplaintRate(): Promise<Array<[string, number]>>;
    trackEmailClick(token: string): Promise<void>;
    trackEmailOpen(token: string): Promise<void>;
    trackWarmSequenceEvent(enrollmentId: string, touchIndex: bigint, eventType: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    triggerBrowserAudit(jobId: string, tenantId: string, businessName: string, websiteUrl: string, niche: string, city: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    triggerGridAudit(email: string): Promise<{
        __kind__: "ok";
        ok: GridAuditResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    triggerManualDiscovery(): Promise<string>;
    triggerOutreachEmailSequence(slug: string): Promise<void>;
    triggerWorkflow(workflowId: string, tenantId: string, triggeredBy: string, customVars: Array<[string, string]>): Promise<{
        id: string;
        status: string;
        startedAt: bigint;
        errorMessage?: string;
        outputData: string;
        workflowId: string;
    }>;
    unsubscribeFromCampaign(email: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    unsubscribeNewsletterEmail(tenantId: string, email: string): Promise<boolean>;
    updateAccountBrief(accountId: string, update: AccountBriefUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateAgencySettings(settings: AgencySettings): Promise<void>;
    updateAgentConfig(agentId: string, config: string): Promise<void>;
    updateAgentRun(id: string, status: string, output: string, completedAt: bigint | null, artifactIds: Array<string>, approvalStatus: string, errorMessage: string | null): Promise<boolean>;
    updateAgentStatus(agentId: string, status: string, error: string | null): Promise<void>;
    updateAgentThread(id: string, status: string, messageCount: bigint, lastMessage: string): Promise<boolean>;
    updateArtifactRecordStatus(id: string, status: string): Promise<boolean>;
    updateArtifactStatus(id: string, status: ArtifactStatus): Promise<boolean>;
    updateAuditScore(tenantId: TenantId, score: bigint): Promise<void>;
    updateAutopilotEmailConfig(config: AutopilotConfig): Promise<void>;
    updateBatchAuditProgress(batchId: string, processed: bigint, completed: bigint, failed: bigint): Promise<void>;
    updateBookingStatus(bookingId: string, status: BookingStatus, googleCalendarEventId: string | null, outlookEventId: string | null): Promise<{
        __kind__: "ok";
        ok: Booking;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateBusinessBrief(id: string, update: BusinessBriefUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateCompany(id: string, update: CompanyUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateComplianceConfig(config: ComplianceConfig): Promise<void>;
    updateContact(id: string, update: ContactUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateContentCalendarEntry(id: string, update: ContentCalendarEntryUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateContentCalendarStatus(id: string, status: CalendarApprovalStatus): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateContentResult(id: string, status: GenerationStatus, output: string, mediaUrl: string | null, errorMsg: string | null): Promise<void>;
    updateCustomField(id: string, update: CustomFieldUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateCustomFieldValue(id: string, update: CustomFieldValueUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateDemoFunnelEntry(tenantId: string, entryId: string, entry: DemoFunnelEntry): Promise<void>;
    updateDemoStep(sessionId: string, step: bigint): Promise<{
        __kind__: "ok";
        ok: DemoSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateDiscoveryConfig(config: DiscoveryConfig): Promise<void>;
    updateDripQueueStatus(queueId: string, status: string): Promise<boolean>;
    updateDualModelSearchJob(jobId: string, update: DualModelSearchJobUpdate): Promise<boolean>;
    updateEmailTemplate(id: bigint, subject: string, body: string, fallbackSubject: string, fallbackBody: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateEstimateStatus(estimateId: string, status: EstimateStatus, approvalNotes: string): Promise<{
        __kind__: "ok";
        ok: Estimate;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateFundabilityScore(tenantId: TenantId, score: bigint): Promise<void>;
    updateFunnelStep(leadId: string, step: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateHealthMetric(metric: string, value: bigint): Promise<void>;
    updateLead(tenantId: TenantId, leadId: string, lead: Lead): Promise<void>;
    updateLeadAuditJobStatus(jobId: string, status: string, stage: string): Promise<boolean>;
    updateMarketingAudit(id: string, update: MarketingAuditUpdate): Promise<MarketingAudit | null>;
    updateMemory(threadId: string, tenantId: string, conversationEntry: ConversationEntry, newSummary: string | null, agentNotes: string | null): Promise<boolean>;
    updateMonthlyReport(id: string, update: MonthlyReportUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateMultiLocationReport(id: string, update: MultiLocationReportUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateNewsletterCampaign(tenantId: string, campaign: NewsletterCampaign): Promise<boolean>;
    updateNewsletterSendStatus(campaignId: string, sendLogId: string, status: SendLogStatus, errorMessage: string | null): Promise<boolean>;
    updateNote(id: string, update: NoteUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateOpportunity(id: string, update: OpportunityUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateOutreachJobStatus(id: string, status: string): Promise<void>;
    updateProposal(id: string, update: ProposalUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateRankedDispatchRoute(id: string, upd: RankedDispatchRouteUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateReportSchedule(tenantId: string, weeklyEnabled: boolean, monthlyEnabled: boolean, deliveryDayOfWeek: bigint, deliveryHour: bigint): Promise<{
        __kind__: "ok";
        ok: ReportSchedule;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateReview(tenantId: TenantId, reviewId: string, review: Review): Promise<void>;
    updateReviewRequestStatus(tenantId: TenantId, requestId: string, status: ReviewRequestStatus): Promise<void>;
    updateReviewResponse(recordId: string, platformResponse: string, respondedAt: bigint): Promise<{
        __kind__: "ok";
        ok: ReviewSyncRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateRunStatus(runId: string, status: RunStatus, outputText: string | null, errorMessage: string | null): Promise<boolean>;
    updateScanModel(modelId: string, title: string, description: string): Promise<void>;
    updateScanModelStatus(modelId: string, status: string, modelUrl: string, thumbnailUrl: string): Promise<void>;
    updateScheduledPost(tenantId: string, postId: string, post: ScheduledPost): Promise<void>;
    updateServiceAreaPage(id: string, update: ServiceAreaPageUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateSmsAutopilotRules(rules: Array<SmsAutopilotRule>): Promise<void>;
    updateSocialPost(tenantId: string, postId: string, post: SocialPost): Promise<void>;
    updateSocialPostDraft(id: string, update: SocialPostDraftUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTask(id: string, update: TaskUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTemplate(id: string, name: string, systemPrompt: string, allowedTools: Array<string>, memoryMode: MemoryMode, approvalRequired: boolean): Promise<boolean>;
    updateThreadSummary(id: string, summary: string, agentNotes: string | null): Promise<boolean>;
    updateTrialFeatureFlags(trialAccountId: string, features: FeatureFlags): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTriggerRule(ruleId: string, updates: TriggerRuleUpdate): Promise<void>;
    /**
     * / Update an existing Vapi assistant when client info changes.
     */
    updateVapiAssistant(tenantId: string, assistantId: string, updates: VapiAssistantUpdate): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateVerticalProfile(id: string, update: VerticalProfileUpdate): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateWebhookExecutionStatus(id: string, status: Variant_cancelled_pending_success_failed, result: string | null, errorMsg: string | null): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    uploadDocument(collectionName: string, title: string, content: string, sourceType: string, tenantId: string): Promise<string>;
    upsertAgentDeliverable(deliverable: AgentDeliverable): Promise<void>;
    upsertAgentPerformanceSnapshot(snapshot: AgentPerformanceSnapshot): Promise<void>;
    upsertAgentProduct(product: AgentProduct): Promise<void>;
    upsertAgentServiceRequest(request: AgentServiceRequest): Promise<void>;
    upsertAgentSubscription(tenantId: TenantId, subscription: AgentSubscription): Promise<void>;
    upsertAgentTask(task: AgentTask): Promise<void>;
    upsertAuditScore(score: AuditScore): Promise<void>;
    upsertBillingRecord(record: BillingRecord): Promise<void>;
    upsertBrfVoiceAgentConfig(config: BrfVoiceAgentConfig): Promise<{
        __kind__: "ok";
        ok: BrfVoiceAgentConfig;
    } | {
        __kind__: "err";
        err: string;
    }>;
    upsertCampaignInstance(tenantId: TenantId, instance: CampaignInstance): Promise<void>;
    upsertCampaignTemplate(template: CampaignTemplate): Promise<void>;
    upsertChatWidgetConfig(config: ChatWidgetConfig): Promise<void>;
    upsertClientHealthScore(tenantId: string, overallScore: bigint, leadsScore: bigint, reputationScore: bigint, agentScore: bigint, websiteScore: bigint, components: Array<HealthScoreComponent>, trend: string, recommendations: Array<string>): Promise<{
        __kind__: "ok";
        ok: ClientHealthScore;
    } | {
        __kind__: "err";
        err: string;
    }>;
    upsertCompetitorAlert(alert: CompetitorAlert): Promise<void>;
    upsertCompetitorProfile(profile: CompetitorProfile): Promise<void>;
    upsertCsvImportBatch(batch: CsvImportBatch): Promise<void>;
    upsertFundabilityScore(score: FundabilityScore): Promise<void>;
    upsertHumanOversightAssignment(assignment: HumanOversightAssignment): Promise<void>;
    upsertInvoice(invoice: Invoice): Promise<void>;
    upsertLeadAttribution(record: LeadAttributionRecord): Promise<void>;
    upsertLocationProfile(profile: LocationProfile): Promise<void>;
    upsertNewsletterSubscriber(tenantId: string, email: string, phone: string | null, businessName: string | null, tags: Array<string>, customFields: Array<[string, string]>): Promise<string>;
    upsertPaidAdsAdCopy(adCopy: PaidAdsAdCopy): Promise<void>;
    upsertPaidAdsAlert(alert: PaidAdsAlert): Promise<void>;
    upsertPaidAdsAudience(audience: PaidAdsAudience): Promise<void>;
    upsertPaidAdsCampaign(campaign: PaidAdsCampaign): Promise<void>;
    upsertPaidAdsDeliverable(deliverable: PaidAdsDeliverable): Promise<void>;
    upsertPaidAdsSubscription(sub: PaidAdsSubscription): Promise<void>;
    upsertPaymentMethod(method: PaymentMethod): Promise<void>;
    upsertSeoGeoContentItem(item: SeoGeoContentItem): Promise<void>;
    upsertSeoGeoDeliverable(deliverable: SeoGeoDeliverable): Promise<void>;
    upsertSeoGeoGbpTask(task: SeoGeoGbpTask): Promise<void>;
    upsertSeoGeoIssue(issue: SeoGeoIssue): Promise<void>;
    upsertSeoGeoOpportunity(opp: SeoGeoOpportunity): Promise<void>;
    upsertSeoGeoReport(report: SeoGeoReport): Promise<void>;
    upsertSeoGeoRequest(request: SeoGeoRequest): Promise<void>;
    upsertSeoGeoSubscription(sub: SeoGeoSubscription): Promise<void>;
    upsertSocialROIMetrics(metrics: SocialROIMetrics): Promise<void>;
    upsertVoiceAgentConfig(config: VoiceAgentConfig): Promise<void>;
    upsertWebhookContract(contract: WebhookContract): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    upsertWebsiteAgentSubscription(sub: WebsiteAgentSubscription): Promise<void>;
    upsertWebsiteContentBrief(brief: WebsiteContentBrief): Promise<void>;
    upsertWebsiteCroOpportunity(opp: WebsiteCroOpportunity): Promise<void>;
    upsertWebsiteDeliverable(deliverable: WebsiteDeliverable): Promise<void>;
    upsertWebsiteIssue(issue: WebsiteIssue): Promise<void>;
    upsertWebsitePageQueueItem(item: WebsitePageQueueItem): Promise<void>;
    upsertWhiteLabelConfig(config: WhiteLabelConfig): Promise<void>;
}
