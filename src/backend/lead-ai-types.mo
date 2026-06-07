import Time "mo:core/Time";

module {

  // ── Lead AI Enrichment ─────────────────────────────────────────────────────

  /// Owl Alpha–generated company intelligence for a single lead.
  public type LeadAIEnrichment = {
    leadId           : Text;
    companyIntel     : Text;
    webPresence      : Text;
    decisionMakerInfo: Text;
    enrichedAt       : Int;
    model            : Text;
  };

  // ── Lead AI Score ──────────────────────────────────────────────────────────

  /// Fit score and reasoning signals produced by Owl Alpha.
  public type LeadAIScore = {
    leadId    : Text;
    score     : Nat;
    fitReason : Text;
    signals   : [Text];
    scoredAt  : Int;
  };

  // ── Outreach Sequence ─────────────────────────────────────────────────────

  /// AI-generated multi-channel outreach sequence for a lead.
  public type OutreachSequence = {
    id          : Text;
    leadId      : Text;
    niche       : Text;
    emails      : [Text];
    smsMessages : [Text];
    framework   : Text;
    generatedAt : Int;
  };

  // ── Reply Analysis ────────────────────────────────────────────────────────

  /// Classification and suggested response for an inbound reply.
  public type ReplyClassification = {
    #HotLead;
    #Objection;
    #PositiveSignal;
    #Unsubscribe;
    #Neutral;
  };

  public type ReplyAnalysis = {
    replyId          : Text;
    leadId           : Text;
    classification   : ReplyClassification;
    summary          : Text;
    suggestedResponse: Text;
    analyzedAt       : Int;
  };

  // ── Lead AI State ─────────────────────────────────────────────────────────

  /// Stable state bucket for all Lead AI intelligence.
  public type LeadAIState = {
    enrichments   : [LeadAIEnrichment];
    scores        : [LeadAIScore];
    sequences     : [OutreachSequence];
    replyAnalyses : [ReplyAnalysis];
  };

  // ── Empty State constructor ───────────────────────────────────────────────

  public func emptyLeadAIState() : LeadAIState = {
    enrichments   = [];
    scores        = [];
    sequences     = [];
    replyAnalyses = [];
  };

};
