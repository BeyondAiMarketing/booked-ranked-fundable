import T     "../lead-ai-types";
import Array "mo:core/Array";

module {

  // ── Enrichment ─────────────────────────────────────────────────────────────

  /// Save a new enrichment record. Replaces existing entry for the same leadId.
  public func addEnrichment(
    enrichments : [T.LeadAIEnrichment],
    entry       : T.LeadAIEnrichment,
  ) : [T.LeadAIEnrichment] {
    let filtered = enrichments.filter(func(e : T.LeadAIEnrichment) : Bool { e.leadId != entry.leadId });
    filtered.concat([entry]);
  };

  /// Retrieve an enrichment by lead id.
  public func getEnrichment(
    enrichments : [T.LeadAIEnrichment],
    leadId      : Text,
  ) : ?T.LeadAIEnrichment {
    enrichments.find(func(e : T.LeadAIEnrichment) : Bool { e.leadId == leadId })
  };

  // ── Scoring ────────────────────────────────────────────────────────────────

  /// Save a new score record. Replaces existing entry for the same leadId.
  public func addScore(
    scores : [T.LeadAIScore],
    entry  : T.LeadAIScore,
  ) : [T.LeadAIScore] {
    let filtered = scores.filter(func(s : T.LeadAIScore) : Bool { s.leadId != entry.leadId });
    filtered.concat([entry]);
  };

  /// Retrieve a score by lead id.
  public func getScore(
    scores : [T.LeadAIScore],
    leadId : Text,
  ) : ?T.LeadAIScore {
    scores.find(func(s : T.LeadAIScore) : Bool { s.leadId == leadId })
  };

  // ── Outreach Sequences ────────────────────────────────────────────────────

  /// Save a new outreach sequence. Appends (sequences can be versioned per lead).
  public func addSequence(
    sequences : [T.OutreachSequence],
    entry     : T.OutreachSequence,
  ) : [T.OutreachSequence] {
    sequences.concat([entry]);
  };

  /// Retrieve all sequences for a given lead id.
  public func getSequencesForLead(
    sequences : [T.OutreachSequence],
    leadId    : Text,
  ) : [T.OutreachSequence] {
    sequences.filter(func(s : T.OutreachSequence) : Bool { s.leadId == leadId })
  };

  // ── Reply Analysis ────────────────────────────────────────────────────────

  /// Save a new reply analysis record. Replaces existing entry for the same replyId.
  public func addReplyAnalysis(
    replyAnalyses : [T.ReplyAnalysis],
    entry         : T.ReplyAnalysis,
  ) : [T.ReplyAnalysis] {
    let filtered = replyAnalyses.filter(func(r : T.ReplyAnalysis) : Bool { r.replyId != entry.replyId });
    filtered.concat([entry]);
  };

  /// Retrieve a reply analysis by replyId.
  public func getReplyAnalysis(
    replyAnalyses : [T.ReplyAnalysis],
    replyId       : Text,
  ) : ?T.ReplyAnalysis {
    replyAnalyses.find(func(r : T.ReplyAnalysis) : Bool { r.replyId == replyId })
  };

  // ── Owl Alpha prompt builders ─────────────────────────────────────────────

  /// Build an Owl Alpha prompt for lead enrichment.
  public func buildEnrichmentPrompt(
    companyName : Text,
    niche       : Text,
    city        : Text,
  ) : Text {
    "{\"model\":\"openrouter/owl-alpha\",\"messages\":[" #
    "{\"role\":\"system\",\"content\":\"You are a B2B lead intelligence specialist for the BRF platform. " #
    "Research local businesses and provide structured company intelligence in JSON format.\"}," #
    "{\"role\":\"user\",\"content\":\"Research this " # niche # " business: " # companyName # " located in " # city # ". " #
    "Provide: 1) Company web presence and online reputation summary, " #
    "2) Decision maker title and likely name if findable, " #
    "3) Key business intelligence relevant to selling AI front desk and automation services. " #
    "Be concise and factual. Format as plain text paragraphs.\"}" #
    "],\"stream\":false}";
  };

  /// Build an Owl Alpha prompt for lead scoring.
  public func buildScoringPrompt(
    companyName : Text,
    niche       : Text,
    companyIntel: Text,
  ) : Text {
    "{\"model\":\"openrouter/owl-alpha\",\"messages\":[" #
    "{\"role\":\"system\",\"content\":\"You are a lead scoring specialist for BRF, an AI-powered platform for local service businesses. " #
    "Score leads from 0-100 based on fit and buying signals. Respond with only a JSON object: {\\\"score\\\": <0-100>, \\\"fitReason\\\": \\\"...\\\", \\\"signals\\\": [\\\"...\\\"]}\"}," #
    "{\"role\":\"user\",\"content\":\"Score this lead for BRF. Company: " # companyName # ". Niche: " # niche # ". Intelligence: " # companyIntel # ". " #
    "Score based on: likelihood to need AI automation, size of business, digital presence gaps, and revenue potential.\"}" #
    "],\"stream\":false}";
  };

  /// Build an Owl Alpha prompt for outreach sequence generation.
  public func buildSequencePrompt(
    companyName : Text,
    niche       : Text,
    city        : Text,
    framework   : Text,
  ) : Text {
    let frameworkInstructions = if (framework == "hormozi") {
      "Use Alex Hormozi's Grand Slam Offer framework: lead with a massive value proposition, stack the value, and make it irresistible."
    } else if (framework == "brunson") {
      "Use Russell Brunson's Hook-Story-Offer framework: open with a pattern interrupt hook, tell a relatable story, then present the offer."
    } else if (framework == "kennedy") {
      "Use Dan Kennedy's Direct Response framework: be direct, specific, deadline-driven, and always include a clear call to action."
    } else {
      "Use proven direct response copywriting principles: be specific, outcome-focused, and end with a clear CTA."
    };
    "{\"model\":\"openrouter/owl-alpha\",\"messages\":[" #
    "{\"role\":\"system\",\"content\":\"You are an expert outreach copywriter for BRF, an AI platform for local service businesses. " #
    frameworkInstructions #
    " Write highly personalised, conversion-focused outreach. Respond with only a JSON object: {\\\"emails\\\": [\\\"email1\\\", \\\"email2\\\", \\\"email3\\\", \\\"email4\\\", \\\"email5\\\"], \\\"smsMessages\\\": [\\\"sms1\\\", \\\"sms2\\\"]}\"}," #
    "{\"role\":\"user\",\"content\":\"Write a 5-email + 2-SMS outreach sequence targeting " # companyName # ", a " # niche # " business in " # city # ". " #
    "The goal is to book a demo of our AI-powered front desk, lead generation, and automation platform. " #
    "Each email must drive to a live demo. Personalize each email with their niche pain points.\"}" #
    "],\"stream\":false}";
  };

  /// Build an Owl Alpha prompt for reply analysis.
  public func buildReplyAnalysisPrompt(
    replyText : Text,
    niche     : Text,
  ) : Text {
    "{\"model\":\"openrouter/owl-alpha\",\"messages\":[" #
    "{\"role\":\"system\",\"content\":\"You are a reply intelligence specialist for BRF outreach campaigns. " #
    "Classify inbound replies and suggest the best response. " #
    "Respond with only a JSON object: {\\\"classification\\\": \\\"HotLead|Objection|PositiveSignal|Unsubscribe|Neutral\\\", " #
    "\\\"summary\\\": \\\"...\\\", \\\"suggestedResponse\\\": \\\"...\\\"}\"}," #
    "{\"role\":\"user\",\"content\":\"Analyse this reply from a " # niche # " business owner: \\\"" # replyText # "\\\". " #
    "Classify it and draft the ideal response to move this prospect forward.\"}" #
    "],\"stream\":false}";
  };

};
