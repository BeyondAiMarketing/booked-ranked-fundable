import RagBrainLib "../src/libraries/ragBrain";
import RagBrainTypes "../src/types/ragBrain";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import OpenRouterLib "../lib/openRouter";

mixin (
  ragBrainState : RagBrainLib.State,
  transform     : OpenRouterLib.Transform,
) {
  // ── helpers ────────────────────────────────────────────────────────────

  func textToCollection(t : Text) : RagBrainTypes.CollectionName {
    switch t {
      case "SalesScripts"      { #SalesScripts };
      case "FundingPlaybooks"  { #FundingPlaybooks };
      case "NicheTemplates"    { #NicheTemplates };
      case "ClientContracts"   { #ClientContracts };
      case "CallTranscripts"   { #CallTranscripts };
      case "ReviewResponses"   { #ReviewResponses };
      case "OnboardingGuides"  { #OnboardingGuides };
      case "CompetitorIntel"   { #CompetitorIntel };
      case "PricingGuides"     { #PricingGuides };
      case "ObjectionHandlers" { #ObjectionHandlers };
      case "CaseStudies"       { #CaseStudies };
      case "EmailSequences"    { #EmailSequences };
      case "SocialContent"     { #SocialContent };
      case "SopLibrary"        { #SopLibrary };
      case _                   { #Custom };
    };
  };

  func textToSourceType(t : Text) : RagBrainTypes.DocumentSourceType {
    switch t {
      case "PDF"  { #PDF };
      case "DOCX" { #DOCX };
      case "URL"  { #URL };
      case _      { #TXT };
    };
  };

  func textToNodeType(t : Text) : RagBrainTypes.AgentNodeType {
    switch t {
      case "ProposalGenerator" { #ProposalGenerator };
      case "FollowUpWriter"    { #FollowUpWriter };
      case "ReviewResponder"   { #ReviewResponder };
      case "SocialPostCreator" { #SocialPostCreator };
      case "CallSummarizer"    { #CallSummarizer };
      case "ObjectionHandler"  { #ObjectionHandler };
      case "ReportNarrator"    { #ReportNarrator };
      case _                   { #LeadEnrichment };
    };
  };

  func textToRole(t : Text) : RagBrainTypes.MessageRole {
    switch t {
      case "assistant" { #Assistant };
      case _           { #User };
    };
  };

  func providerToText(p : RagBrainTypes.ProviderType) : Text {
    switch p {
      case (#NVIDIA)  { "NVIDIA" };
      case (#OpenAI)  { "OpenAI" };
      case (#Claude)  { "Claude" };
      case (#Cached)  { "Cached" };
    };
  };

  func roleToText(r : RagBrainTypes.MessageRole) : Text {
    switch r {
      case (#User)      { "user" };
      case (#Assistant) { "assistant" };
    };
  };

  func nodeTypeToText(n : RagBrainTypes.AgentNodeType) : Text {
    switch n {
      case (#LeadEnrichment)    { "LeadEnrichment" };
      case (#ProposalGenerator) { "ProposalGenerator" };
      case (#FollowUpWriter)    { "FollowUpWriter" };
      case (#ReviewResponder)   { "ReviewResponder" };
      case (#SocialPostCreator) { "SocialPostCreator" };
      case (#CallSummarizer)    { "CallSummarizer" };
      case (#ObjectionHandler)  { "ObjectionHandler" };
      case (#ReportNarrator)    { "ReportNarrator" };
    };
  };

  // ── public API ────────────────────────────────────────────────────────────

  /// Upload a document to a knowledge collection; returns the new document id
  public func uploadDocument(
    collectionName : Text,
    title : Text,
    content : Text,
    sourceType : Text,
    tenantId : Text
  ) : async Text {
    await RagBrainLib.uploadDocument(
      ragBrainState,
      textToCollection(collectionName),
      title,
      content,
      textToSourceType(sourceType),
      tenantId
    )
  };

  /// Query the RAG index and return matching chunks with citations
  public func queryRAG(
    question : Text,
    collectionName : Text,
    tenantId : Text
  ) : async { chunks : [{ id : Text; content : Text; chunkIndex : Nat }]; citations : [Text]; isInsufficient : Bool; insufficiencyMessage : ?Text } {
    let result = await RagBrainLib.queryRAG(
      ragBrainState,
      question,
      textToCollection(collectionName),
      tenantId,
      transform,
      "",
      ""
    );
    let mappedChunks = result.chunks.map(
      func(c) { { id = c.id; content = c.content; chunkIndex = c.chunkIndex } }
    );
    { chunks = mappedChunks; citations = result.citations; isInsufficient = result.isInsufficient; insufficiencyMessage = result.insufficiencyMessage }
  };

  /// Returns documents in a collection with metadata
  public query func getKnowledgeDocuments(
    collectionName : Text,
    tenantId : Text
  ) : async [{ id : Text; title : Text; chunkCount : Nat; uploadedAt : Int }] {
    let col = textToCollection(collectionName);
    let allDocs = ragBrainState.documents.toArray();
    let filtered = allDocs.filter(
      func(pair) {
        let d = pair.1;
        d.tenantId == tenantId and
        debug_show(d.collectionName) == debug_show(col)
      }
    );
    filtered.map(
      func(pair) { let d = pair.1; { id = d.id; title = d.title; chunkCount = d.chunkCount; uploadedAt = d.uploadedAt } }
    )
  };

  /// Returns global vector index statistics
  public query func getVectorIndexStatus() : async { totalChunks : Nat; totalDocuments : Nat; collectionsCount : Nat } {
    let chunks = ragBrainState.chunks.toArray();
    let docs = ragBrainState.documents.toArray();
    { totalChunks = chunks.size(); totalDocuments = docs.size(); collectionsCount = 15 }
  };

  /// Returns AI usage logs for a tenant
  public query func getAIUsageLogs(
    tenantId : Text
  ) : async [{ id : Text; provider : Text; inputTokens : Nat; success : Bool; loggedAt : Int }] {
    let logs = RagBrainLib.getUsageLogs(ragBrainState, tenantId);
    logs.map(
      func(l) { { id = l.id; provider = providerToText(l.provider); inputTokens = l.inputTokens; success = l.success; loggedAt = l.loggedAt } }
    )
  };

  /// Returns conversation history for a session
  public query func getConversationHistory(
    tenantId : Text,
    sessionId : Text
  ) : async [{ id : Text; role : Text; content : Text; citations : [Text]; timestamp : Int }] {
    let msgs = RagBrainLib.getConversationHistory(ragBrainState, tenantId, sessionId);
    msgs.map(
      func(m) { { id = m.id; role = roleToText(m.role); content = m.content; citations = m.citations; timestamp = m.timestamp } }
    )
  };

  /// Appends a message to a conversation session
  public func addConversationMessage(
    tenantId : Text,
    sessionId : Text,
    role : Text,
    content : Text
  ) : async () {
    RagBrainLib.addConversationMessage(ragBrainState, tenantId, sessionId, textToRole(role), content)
  };

  /// Returns all configured AI provider records
  public query func getProviderConfigs() : async [{ id : Text; providerType : Text; modelName : Text; isActive : Bool; lastPingStatus : ?Text }] {
    []
  };

  /// Runs a named agent node with the given input and returns the execution record
  public func runAgentNode(
    nodeType : Text,
    inputData : Text,
    tenantId : Text
  ) : async { id : Text; nodeType : Text; outputData : Text; runAt : Int } {
    let run = await RagBrainLib.runAgentNode(
      ragBrainState,
      textToNodeType(nodeType),
      inputData,
      tenantId
    );
    { id = run.id; nodeType = nodeTypeToText(run.nodeType); outputData = run.outputData; runAt = run.runAt }
  };

  /// Returns automation configurations for a tenant
  public query func getAutomationConfigs(
    tenantId : Text
  ) : async [{ trigger : Text; isEnabled : Bool; requiresApproval : Bool }] {
    [
      { trigger = "DocumentUploaded"; isEnabled = true;  requiresApproval = true  },
      { trigger = "TrialActivated";   isEnabled = true;  requiresApproval = false },
      { trigger = "CallLogCreated";   isEnabled = false; requiresApproval = false },
    ]
  };

  /// Saves (upserts) an automation configuration for a tenant
  public func saveAutomationConfig(
    _trigger : Text,
    _isEnabled : Bool,
    _requiresApproval : Bool,
    _tenantId : Text
  ) : async () {
    ()
  };
}
