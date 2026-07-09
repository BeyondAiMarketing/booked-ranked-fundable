import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall       "mo:caffeineai-http-outcalls/outcall";
import ORLib         "../lib/openRouter";
import ORTypes       "../types/openRouter";
import LeadAILib     "../lib/leadAI";
import T             "../lead-ai-types";
import LLMFT         "../types/llm-fallback";
import LLMFallbackLib "../lib/llm-fallback";
import Time          "mo:core/Time";
import Runtime       "mo:core/Runtime";
import Char "mo:core/Char";
import Nat32 "mo:core/Nat32";
import Text "mo:core/Text";
import ICTypes "../types/integrationCredentials";
import ICLib "../lib/integrationCredentials";
import SecretManager "../lib/secretManager";
import Map "mo:core/Map";

mixin (
  accessControlState : AccessControl.AccessControlState,
  leadAIState        : T.LeadAIState,
  openRouterState    : ORLib.State,
  transform          : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
  integrationCreds   : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt           : Blob,
  llmFallbackState   : LLMFallbackLib.State,
  secretState        : ?SecretManager.State,
) {

  // Mutable state arrays — mutated in place and read back as arrays
  var _enrichments   : [T.LeadAIEnrichment]  = leadAIState.enrichments;
  var _scores        : [T.LeadAIScore]        = leadAIState.scores;
  var _sequences     : [T.OutreachSequence]   = leadAIState.sequences;
  var _replyAnalyses : [T.ReplyAnalysis]      = leadAIState.replyAnalyses;

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Parse a text value from a JSON response by field name.
  private func parseJsonField(json : Text, field : Text) : Text {
    let needle = "\"" # field # "\":\"";
    let nChars = needle.toArray();
    let jChars = json.toArray();
    let nLen = nChars.size();
    let jLen = jChars.size();
    var i = 0;
    label scan while (i + nLen <= jLen) {
      var matched = true;
      var k = 0;
      while (k < nLen) {
        if (jChars[i + k] != nChars[k]) { matched := false };
        k += 1;
      };
      if (matched) {
        var j = i + nLen;
        var val = "";
        label collect while (j < jLen) {
          let c = jChars[j];
          if (c == '\"') break collect;
          val #= (func() : Text { let s = "\u{0}"; ignore s; var t = ""; t #= Text.fromChar(c); t })();
          j += 1;
        };
        return val;
      };
      i += 1;
    };
    "";
  };

  /// Make an OpenRouter call and extract response content.
  private func callOwlAlpha(prompt : Text) : async Text {
    let cfg = ORLib.getConfig(openRouterState);
    if (cfg.apiKey == "") return "";
    let messages : [ORTypes.OpenRouterMessage] = [
      { role = "user"; content = prompt }
    ];
    let geminiKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAllWithSecret(enc, credSalt, secretState).geminiApiKey;
    };
    let openaiKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAllWithSecret(enc, credSalt, secretState).openaiKey;
    };
    await ORLib.callWithFallback(openRouterState, #OutreachCopy, messages, transform, openaiKey, geminiKey)
  };

  /// Default capability for LLM-routed lead-AI tasks: any model family,
  /// 2000 max tokens, temperature 0.7.
  let defaultCapability : LLMFT.TaskCapability = {
    maxTokens   = 2000;
    temperature = 0.7;
    modelFamily = null;
  };

  /// Route an LLM call through the unified fallback chain.
  /// Calls LLMFallbackLib.route directly (the same lib function the
  /// LLMFallbackMixin wraps) to avoid the cross-mixin method-call issue
  /// where sibling mixins cannot invoke routeLLMCall as an unbound variable.
  /// The legacy fallback closure delegates to OpenRouterLib.callWithFallback
  /// for backward compatibility as the Generic tier.
  private func routeLLM(
    task     : ORTypes.TaskType,
    prompt   : Text,
  ) : async Text {
    let messages : [ORTypes.OpenRouterMessage] = [
      { role = "user"; content = prompt }
    ];
    let creds : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
      case (null) ICLib.emptyCredentials();
      case (?enc) ICLib.decryptAllWithSecret(enc, credSalt, secretState);
    };
    let keys = LLMFallbackLib.resolveKeys(creds);
    let flags : LLMFallbackLib.FeatureFlags = {
      leadEngineEnabled = true;
      twilioEnabled      = true;
      sendgridEnabled    = true;
    };
    await LLMFallbackLib.route(
      llmFallbackState,
      task,
      messages,
      keys,
      flags,
      defaultCapability,
      transform,
      func(_t : ORTypes.TaskType, msgs : [ORTypes.OpenRouterMessage]) : async Text {
        await ORLib.callWithFallback(
          openRouterState,
          task,
          msgs,
          transform,
          keys.openaiKey,
          keys.geminiKey,
        )
      },
    )
  };

  // ── Enrichment API ─────────────────────────────────────────────────────────

  /// Enrich a lead with Owl Alpha–generated company intelligence.
  public shared ({ caller }) func enrichLead(
    leadId      : Text,
    companyName : Text,
    niche       : Text,
    city        : Text,
  ) : async T.LeadAIEnrichment {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    let promptBody = LeadAILib.buildEnrichmentPrompt(companyName, niche, city);
    let raw = await callOwlAlpha(promptBody);
    let entry : T.LeadAIEnrichment = {
      leadId;
      companyIntel      = if (raw == "") "Unable to enrich — OpenRouter key not configured." else raw;
      webPresence       = "";
      decisionMakerInfo = "";
      enrichedAt        = Time.now();
      model             = "openrouter/owl-alpha";
    };
    _enrichments := LeadAILib.addEnrichment(_enrichments, entry);
    entry;
  };

  /// Return the stored enrichment for a lead, if any.
  public query ({ caller }) func getLeadEnrichment(leadId : Text) : async ?T.LeadAIEnrichment {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    LeadAILib.getEnrichment(_enrichments, leadId)
  };

  /// List all enrichments (admin only).
  public query ({ caller }) func listLeadEnrichments() : async [T.LeadAIEnrichment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    _enrichments;
  };

  // ── Scoring API ────────────────────────────────────────────────────────────

  /// Score a lead with Owl Alpha and persist the result.
  public shared ({ caller }) func scoreLead(
    leadId      : Text,
    companyName : Text,
    niche       : Text,
  ) : async T.LeadAIScore {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    // Use existing enrichment intel if available
    let intel = switch (LeadAILib.getEnrichment(_enrichments, leadId)) {
      case (?e) { e.companyIntel };
      case null { companyName # " operating in " # niche };
    };
    let promptBody = LeadAILib.buildScoringPrompt(companyName, niche, intel);
    let raw = await routeLLM(#OutreachCopy, promptBody);
    // Parse score from JSON response — default to 50 if parsing fails
    let scoreText = parseJsonField(raw, "score");
    let score : Nat = if (scoreText == "") 50 else {
      var n : Nat = 0;
      var valid = true;
      for (ch in scoreText.chars()) {
        if (ch >= '0' and ch <= '9') {
          n := n * 10 + (ch.toNat32().toNat() - 48);
        } else {
          valid := false;
        };
      };
      if (valid and scoreText.size() > 0) n else 50
    };
    let fitReason  = parseJsonField(raw, "fitReason");
    let entry : T.LeadAIScore = {
      leadId;
      score   = if (score > 100) 100 else score;
      fitReason = if (fitReason == "") "Score generated by Owl Alpha." else fitReason;
      signals = [];
      scoredAt = Time.now();
    };
    _scores := LeadAILib.addScore(_scores, entry);
    entry;
  };

  /// Return the stored score for a lead, if any.
  public query ({ caller }) func getLeadScore(leadId : Text) : async ?T.LeadAIScore {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    LeadAILib.getScore(_scores, leadId)
  };

  /// List all scores (admin only).
  public query ({ caller }) func listLeadScores() : async [T.LeadAIScore] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    _scores;
  };

  // ── Outreach Sequence API ─────────────────────────────────────────────────

  /// Generate a multi-channel outreach sequence for a lead via Owl Alpha.
  public shared ({ caller }) func generateOutreachSequence(
    leadId      : Text,
    companyName : Text,
    niche       : Text,
    city        : Text,
    framework   : Text,
  ) : async T.OutreachSequence {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    let promptBody = LeadAILib.buildSequencePrompt(companyName, niche, city, framework);
    let raw = await callOwlAlpha(promptBody);
    let now = Time.now();
    // Build a minimal sequence; raw content goes into email[0] for frontend parsing
    let emails    : [Text] = if (raw == "") [
      "OpenRouter API key not configured. Enter your key in the Go Live Dashboard to activate AI outreach generation."
    ] else [raw];
    let smsMessages : [Text] = [];
    let seqId = "seq-" # leadId # "-" # debug_show(now);
    let entry : T.OutreachSequence = {
      id          = seqId;
      leadId;
      niche;
      emails;
      smsMessages;
      framework;
      generatedAt = now;
    };
    _sequences := LeadAILib.addSequence(_sequences, entry);
    entry;
  };

  /// Return all sequences generated for a lead.
  public query ({ caller }) func getOutreachSequencesForLead(leadId : Text) : async [T.OutreachSequence] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    LeadAILib.getSequencesForLead(_sequences, leadId)
  };

  /// List all outreach sequences (admin only).
  public query ({ caller }) func listOutreachSequences() : async [T.OutreachSequence] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    _sequences;
  };

  // ── Reply Analysis API ────────────────────────────────────────────────────

  /// Analyse an inbound reply with Owl Alpha and persist the result.
  public shared ({ caller }) func analyzeReply(
    replyId   : Text,
    leadId    : Text,
    replyText : Text,
    niche     : Text,
  ) : async T.ReplyAnalysis {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    let promptBody = LeadAILib.buildReplyAnalysisPrompt(replyText, niche);
    let raw = await routeLLM(#ReviewResponse, promptBody);
    let classText = parseJsonField(raw, "classification");
    let classification : T.ReplyClassification = if      (classText == "HotLead")       #HotLead
      else if (classText == "Objection")       #Objection
      else if (classText == "PositiveSignal")  #PositiveSignal
      else if (classText == "Unsubscribe")     #Unsubscribe
      else                                     #Neutral;
    let summary           = parseJsonField(raw, "summary");
    let suggestedResponse = parseJsonField(raw, "suggestedResponse");
    let entry : T.ReplyAnalysis = {
      replyId;
      leadId;
      classification;
      summary           = if (summary == "") "Reply analysed." else summary;
      suggestedResponse = if (suggestedResponse == "") "Thank you for your reply. We will follow up shortly." else suggestedResponse;
      analyzedAt        = Time.now();
    };
    _replyAnalyses := LeadAILib.addReplyAnalysis(_replyAnalyses, entry);
    entry;
  };

  /// Return the stored analysis for a reply, if any.
  public query ({ caller }) func getReplyAnalysis(replyId : Text) : async ?T.ReplyAnalysis {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    LeadAILib.getReplyAnalysis(_replyAnalyses, replyId)
  };

  /// List all reply analyses (admin only).
  public query ({ caller }) func listReplyAnalyses() : async [T.ReplyAnalysis] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    _replyAnalyses;
  };

};
