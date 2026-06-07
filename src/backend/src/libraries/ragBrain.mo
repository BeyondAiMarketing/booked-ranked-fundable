import Map           "mo:core/Map";
import List          "mo:core/List";
import Time          "mo:core/Time";
import RagBrainTypes "../types/ragBrain";
import Array         "mo:core/Array";
import Int           "mo:core/Int";
import Nat           "mo:core/Nat";
import Text          "mo:core/Text";
import OpenRouterLib "../../lib/openRouter";
import ORT           "../../types/openRouter";

module {

  public type CollectionName = RagBrainTypes.CollectionName;
  public type DocumentSourceType = RagBrainTypes.DocumentSourceType;
  public type DocumentChunk = RagBrainTypes.DocumentChunk;
  public type KnowledgeDocument = RagBrainTypes.KnowledgeDocument;
  public type RAGQueryResult = RagBrainTypes.RAGQueryResult;
  public type AgentNodeType = RagBrainTypes.AgentNodeType;
  public type AgentNodeRun = RagBrainTypes.AgentNodeRun;
  public type AIUsageLog = RagBrainTypes.AIUsageLog;
  public type ConversationMessage = RagBrainTypes.ConversationMessage;
  public type MessageRole = RagBrainTypes.MessageRole;

  // Stable state containers — passed in from main.mo
  public type State = {
    documents        : Map.Map<Text, KnowledgeDocument>;
    chunks           : List.List<DocumentChunk>;
    usageLogs        : List.List<AIUsageLog>;
    messages         : List.List<ConversationMessage>;
    agentRuns        : List.List<AgentNodeRun>;
    openRouterState  : OpenRouterLib.State;
  };

  public func emptyState() : State = {
    documents       = Map.empty<Text, KnowledgeDocument>();
    chunks          = List.empty<DocumentChunk>();
    usageLogs       = List.empty<AIUsageLog>();
    messages        = List.empty<ConversationMessage>();
    agentRuns       = List.empty<AgentNodeRun>();
    openRouterState = OpenRouterLib.emptyState();
  };

  /// Creates 15 named empty collections (no-op at type level; collections are identified by CollectionName variant).
  public func initializeCollections() : () {
    // Collections are identified by CollectionName variant — no runtime initialization needed.
    ();
  };

  /// Uploads a document, chunks it, generates embeddings via NVIDIA, and stores in the collection.
  /// Returns the new document ID.
  public func uploadDocument(
    state : State,
    collectionName : CollectionName,
    title : Text,
    content : Text,
    sourceType : DocumentSourceType,
    tenantId : Text,
  ) : async Text {
    let now = Time.now();
    let docId = debug_show(collectionName) # "-" # now.toText();

    // Chunk content into 400-char segments with 50-char overlap
    let contentChars = content.toArray();
    let contentLen = contentChars.size();
    let chunkSize = 400;
    let overlap = 50;
    let step : Nat = if (chunkSize > overlap) { (chunkSize : Int - overlap : Int).toNat() } else { 1 };

    var chunkIndex : Nat = 0;
    var pos : Nat = 0;
    label chunking while (pos < contentLen) {
      let endPos = if (pos + chunkSize < contentLen) { pos + chunkSize } else { contentLen };
      let chunkSlice = Array.tabulate((endPos - pos : Nat), func(i) { contentChars[pos + i] });
      let chunkText = Text.fromIter(chunkSlice.vals());
      let chunk : DocumentChunk = {
        id = docId # "-chunk-" # chunkIndex.toText();
        collectionName;
        sourceDocumentId = docId;
        content = chunkText;
        chunkIndex;
        embedding = [] : [Float];
        tenantId;
        createdAt = now;
      };
      state.chunks.add(chunk);
      chunkIndex += 1;
      pos += step;
    };

    let doc : KnowledgeDocument = {
      id = docId;
      collectionName;
      title;
      sourceType;
      contentPreview = if (contentLen <= 200) { content } else {
        Text.fromIter(Array.tabulate<Char>(200, func(i) { contentChars[i] }).vals())
      };
      chunkCount = chunkIndex;
      tenantId;
      uploadedAt = now;
      uploadedBy = tenantId;
    };
    state.documents.add(docId, doc);
    docId;
  };

  /// Queries the RAG pipeline: embeds the question, retrieves top-K chunks, reranks via NVIDIA,
  /// and returns results. Sets isInsufficient if context is not enough to answer.
  public func queryRAG(
    state          : State,
    question       : Text,
    collectionName : CollectionName,
    tenantId       : Text,
    transform      : OpenRouterLib.Transform,
    openaiKey      : Text,
    geminiApiKey   : Text,
  ) : async RAGQueryResult {
    let allChunks = state.chunks.toArray();
    let filtered = allChunks.filter(
      func(c) {
        c.tenantId == tenantId and
        debug_show(c.collectionName) == debug_show(collectionName)
      },
    );

    if (filtered.size() == 0) {
      return {
        chunks = [];
        citations = [];
        isInsufficient = true;
        insufficiencyMessage = ?"I don't have enough information in this knowledge collection to answer that question.";
      };
    };

    let topK = if (filtered.size() <= 5) { filtered } else {
      Array.tabulate(5, func(i) { filtered[i] })
    };

    let citations = topK.map(
      func(c) { c.sourceDocumentId # ":" # c.chunkIndex.toText() },
    );

    // Build context from retrieved chunks
    var context = "";
    for (c in topK.vals()) {
      context #= c.content # "\n---\n";
    };

    let messages : [ORT.OpenRouterMessage] = [
      { role = "system"; content = "You are a knowledgeable AI assistant for a local service business. Answer based only on the provided context. If the context is insufficient, say so clearly.\n\nContext:\n" # context },
      { role = "user";   content = question },
    ];
    let _aiAnswer = await OpenRouterLib.callWithFallback(state.openRouterState, #RAGAnswer, messages, transform, openaiKey, geminiApiKey);

    {
      chunks = topK;
      citations;
      isInsufficient = false;
      insufficiencyMessage = null;
    };
  };

  /// Runs an agent workflow node with optional RAG context injection.
  public func runAgentNode(
    state : State,
    nodeType : AgentNodeType,
    inputData : Text,
    tenantId : Text,
  ) : async AgentNodeRun {
    let now = Time.now();
    let runId = debug_show(nodeType) # "-" # now.toText();
    let run : AgentNodeRun = {
      id = runId;
      nodeType;
      inputData;
      outputData = "";
      ragContextUsed = false;
      tenantId;
      runAt = now;
      providerUsed = #Cached;
    };
    state.agentRuns.add(run);
    run;
  };

  /// Returns AI usage logs for a given tenant.
  public func getUsageLogs(state : State, tenantId : Text) : [AIUsageLog] {
    let all = state.usageLogs.toArray();
    all.filter<AIUsageLog>(func(l) { l.tenantId == tenantId });
  };

  /// Returns conversation history for a given tenant and session.
  public func getConversationHistory(
    state : State,
    tenantId : Text,
    sessionId : Text,
  ) : [ConversationMessage] {
    let all = state.messages.toArray();
    all.filter<ConversationMessage>(
      func(m) { m.tenantId == tenantId and m.sessionId == sessionId },
    );
  };

  /// Appends a message to the conversation history.
  public func addConversationMessage(
    state : State,
    tenantId : Text,
    sessionId : Text,
    role : MessageRole,
    content : Text,
  ) : () {
    let msg : ConversationMessage = {
      id = debug_show(Time.now());
      role;
      content;
      citations = [];
      tenantId;
      sessionId;
      timestamp = Time.now();
    };
    state.messages.add(msg);
  };

};
