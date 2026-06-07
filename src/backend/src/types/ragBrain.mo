import Debug "mo:core/Debug";

module {

  public type ProviderType = {
    #NVIDIA;
    #OpenAI;
    #Claude;
    #Cached;
  };

  public type TaskCategory = {
    #TextGeneration;
    #Summarization;
    #Embedding;
    #Reranking;
    #DocumentExtraction;
    #Classification;
    #CodeGeneration;
  };

  public type ProviderConfig = {
    id : Text;
    providerType : ProviderType;
    apiEndpoint : Text;
    modelName : Text;
    isActive : Bool;
    lastPingStatus : ?Text;
    lastPingTimestamp : ?Int;
    tasksHandled : [TaskCategory];
  };

  public type CollectionName = {
    #SalesScripts;
    #FundingPlaybooks;
    #NicheTemplates;
    #ClientContracts;
    #CallTranscripts;
    #ReviewResponses;
    #OnboardingGuides;
    #CompetitorIntel;
    #PricingGuides;
    #ObjectionHandlers;
    #CaseStudies;
    #EmailSequences;
    #SocialContent;
    #SopLibrary;
    #Custom;
  };

  public type DocumentSourceType = {
    #PDF;
    #TXT;
    #DOCX;
    #URL;
  };

  public type DocumentChunk = {
    id : Text;
    collectionName : CollectionName;
    sourceDocumentId : Text;
    content : Text;
    chunkIndex : Nat;
    embedding : [Float];
    tenantId : Text;
    createdAt : Int;
  };

  public type KnowledgeDocument = {
    id : Text;
    collectionName : CollectionName;
    title : Text;
    sourceType : DocumentSourceType;
    contentPreview : Text;
    chunkCount : Nat;
    tenantId : Text;
    uploadedAt : Int;
    uploadedBy : Text;
  };

  public type RAGQueryResult = {
    chunks : [DocumentChunk];
    citations : [Text];
    isInsufficient : Bool;
    insufficiencyMessage : ?Text;
  };

  public type AgentNodeType = {
    #LeadEnrichment;
    #ProposalGenerator;
    #FollowUpWriter;
    #ReviewResponder;
    #SocialPostCreator;
    #CallSummarizer;
    #ObjectionHandler;
    #ReportNarrator;
  };

  public type AgentNodeRun = {
    id : Text;
    nodeType : AgentNodeType;
    inputData : Text;
    outputData : Text;
    ragContextUsed : Bool;
    tenantId : Text;
    runAt : Int;
    providerUsed : ProviderType;
  };

  public type AutomationTrigger = {
    #DocumentUploaded;
    #TrialActivated;
    #CallLogCreated;
  };

  public type AutomationConfig = {
    trigger : AutomationTrigger;
    isEnabled : Bool;
    requiresApproval : Bool;
    tenantId : Text;
  };

  public type AutomationRunStatus = {
    #Pending;
    #Approved;
    #Executed;
    #Failed;
  };

  public type AutomationRun = {
    id : Text;
    trigger : AutomationTrigger;
    inputRef : Text;
    outputData : Text;
    status : AutomationRunStatus;
    tenantId : Text;
    createdAt : Int;
  };

  public type AIUsageLog = {
    id : Text;
    taskCategory : TaskCategory;
    provider : ProviderType;
    inputTokens : Nat;
    outputTokens : Nat;
    tenantId : Text;
    loggedAt : Int;
    success : Bool;
    errorMessage : ?Text;
  };

  public type MessageRole = {
    #User;
    #Assistant;
  };

  public type ConversationMessage = {
    id : Text;
    role : MessageRole;
    content : Text;
    citations : [Text];
    tenantId : Text;
    sessionId : Text;
    timestamp : Int;
  };

};
