import T      "../types/roofingCampaign";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import Map    "mo:core/Map";
import List   "mo:core/List";
import Time   "mo:core/Time";
import Text   "mo:core/Text";
import Nat    "mo:core/Nat";
import Int    "mo:core/Int";
import Float  "mo:core/Float";
import ET "../types/emailTemplate";
import ETL "../lib/emailTemplates";

module {

  // ── Transform alias ───────────────────────────────────────────────────────

  public type Transform = shared query (Outcall.TransformationInput) -> async Outcall.TransformationOutput;

  // ── Email sequence definitions ─────────────────────────────────────────────

  /// A single step in the 7-email sequence.
  public type EmailStep = {
    stepNumber   : Nat;
    subject      : Text;
    framework    : Text;  // "audit_reveal", "explanation", "hormozi_cost", etc.
    promptTemplate : Text;
  };

  /// Returns the 7-step roofing outreach email sequence definitions.
  public func getEmailSequence() : [EmailStep] {
    [
      {
        stepNumber   = 1;
        subject      = "We ran your Google Maps ranking. Here's what we found.";
        framework    = "audit_reveal";
        promptTemplate =
          "You are an expert B2B copywriter using the Hook-Story-Offer framework by Russell Brunson. " #
          "Write a short, conversational cold outreach email to the owner of {companyName}, a roofing company in {city}, {state}. " #
          "The hook: we ran a Google Maps grid ranking audit on their business and found a problem — " #
          "they may rank #1 on their own street but they are invisible 2-3 miles away where most customers actually search. " #
          "Use this specific finding from their audit: {auditSummary}. " #
          "Open with the surprising audit finding. Keep it under 150 words. No salesy language. " #
          "End with a single soft CTA to see the full report. Include a PS that adds one more specific data point. " #
          "Subject line: We ran your Google Maps ranking. Here's what we found. Write only the email body.";
      },
      {
        stepNumber   = 2;
        subject      = "Why you're ranking #1 on your street — and nowhere else";
        framework    = "explanation";
        promptTemplate =
          "You are a plain-English explainer writing a follow-up email to a roofing business owner at {companyName} in {city}, {state}. " #
          "Explain in simple, non-technical language why a Google Business Profile can rank well in a tight radius " #
          "(1-2 blocks around the business address) but completely disappear when someone searches from 2+ miles away. " #
          "This is called the GBP proximity gap. The owner has likely noticed they get few leads outside their immediate neighborhood. " #
          "Reference their city specifically. Keep it under 180 words. " #
          "No pitch yet — just educate. End with a question: 'Does this match what you've been seeing?' " #
          "Write only the email body.";
      },
      {
        stepNumber   = 3;
        subject      = "Every week this goes unfixed = jobs going to your competitor";
        framework    = "hormozi_cost";
        promptTemplate =
          "You are writing a direct-response email using Alex Hormozi's value math framework for {companyName}, a roofing company in {city}, {state}. " #
          "Calculate the cost of invisibility: the average roofing job is $8,000-$15,000. " #
          "If a roofer is invisible in a 5-mile radius outside their block, they could be losing 2-4 jobs per month to competitors who ARE showing up. " #
          "That's $16,000 to $60,000 per month in revenue going to someone else. " #
          "Make the math feel real and specific to their city and market size. " #
          "Keep it under 160 words. No fluff. " #
          "End with a direct question: 'Want to see exactly which competitors are showing up where you aren't?' " #
          "Write only the email body.";
      },
      {
        stepNumber   = 4;
        subject      = "What fixing this actually looks like";
        framework    = "solution_intro";
        promptTemplate =
          "You are writing a solution-reveal email for {companyName}, a roofing business in {city}, {state}. " #
          "Introduce BRF (Booked Ranked Funded) as the platform that fixes the local ranking gap problem. " #
          "List 3-4 specific BRF capabilities in plain language: AI front desk that answers every call, " #
          "local SEO optimization that extends ranking radius to 5-10 miles, " #
          "automated follow-up sequences that turn missed calls into booked jobs, " #
          "and review management that feeds the Google algorithm. " #
          "Do NOT oversell. Keep it factual and outcome-focused. Under 180 words. " #
          "End with a soft CTA to see a 5-minute demo. " #
          "Write only the email body.";
      },
      {
        stepNumber   = 5;
        subject      = "Before and after: roofer went from invisible to #1 in 6 weeks";
        framework    = "brunson_story";
        promptTemplate =
          "You are writing a story-based email using Russell Brunson's Epiphany Bridge framework for {companyName} in {city}, {state}. " #
          "Tell a brief before/after story of a fictional roofing company similar to theirs. " #
          "Before: ranking only on their block, 3-4 leads/month, slow season felt devastating. " #
          "The discovery: they found out competitors were stealing their searches from 3 miles away. " #
          "After using BRF for 6 weeks: ranking in a 7-mile radius, 14-18 calls/month from new neighborhoods, " #
          "hired an extra crew. " #
          "Keep the story specific to roofing in a city similar to {city}. Under 200 words. " #
          "End with: 'I wonder if you're sitting on the same opportunity.' " #
          "Write only the email body.";
      },
      {
        stepNumber   = 6;
        subject      = "7-day trial — no credit card, no lock-in";
        framework    = "hard_cta";
        promptTemplate =
          "You are writing a direct CTA email for {companyName} in {city}, {state}. " #
          "Make a clear, low-friction offer: 7-day free trial of BRF, no credit card required, " #
          "cancel any time, set up takes 20 minutes. " #
          "Stack the value of what they get in the trial: AI front desk active on their number, " #
          "full local ranking grid audit, 3 automated follow-up sequences live, and a weekly ranking report. " #
          "Use Hormozi's Grand Slam Offer structure: huge value, low risk, clear next step. " #
          "Under 150 words. Big, clear CTA button text: 'Start My Free 7-Day Trial'. " #
          "Include the demo link: https://bookedrankedfunded.org " #
          "Write only the email body.";
      },
      {
        stepNumber   = 7;
        subject      = "Closing this out — wanted to make sure you saw this";
        framework    = "plain_reply";
        promptTemplate =
          "You are writing the final plain-text, reply-style email in a sequence to {companyName} in {city}, {state}. " #
          "This should look like a personal email from a person, not a marketing email — no images, no fancy HTML. " #
          "Mention this is the last email you'll send. " #
          "Acknowledge they may be busy or not interested — that's okay. " #
          "But if there's any chance they're still losing customers to competitors because of the ranking gap, " #
          "offer one last easy door: a 15-minute call to show them their actual ranking data. " #
          "Include a direct Calendly/demo link: https://bookedrankedfunded.org " #
          "Under 120 words. No CTA buttons. Just a plain human sign-off. " #
          "Write only the email body.";
      },
    ];
  };

  // ── AI email body generation ───────────────────────────────────────────────

  /// Build the prompt for a given step, filling in lead context.
  public func buildEmailPrompt(
    step         : EmailStep,
    companyName  : Text,
    city         : Text,
    state        : Text,
    auditSummary : Text,
  ) : Text {
    step.promptTemplate
      .replace(#text "{companyName}",  companyName)
      .replace(#text "{city}",         city)
      .replace(#text "{state}",        state)
      .replace(#text "{auditSummary}", auditSummary);
  };

  /// Generate email body via Owl Alpha (OpenRouter); falls back to a template.
  /// Fill template body using merge fields; returns the filled body and usedFallback flag.
  public func generateEmailBody(
    template    : ET.EmailTemplate,
    lead        : T.LeadCampaignStatus,
    auditResult : ?T.GridAuditResult,
    ctaLink     : Text,
  ) : (body : Text, usedFallback : Bool) {
    let (_subj, body, usedFallback) = ETL.mergeFillTemplate(template, lead, auditResult, ctaLink);
    (body, usedFallback);
  };

  // ── Enrollment helpers ─────────────────────────────────────────────────────

  /// Create a fresh enrollment record for a lead at step 1.
  public func newLeadStatus(lead : T.RoofingLead, now : Int) : T.LeadCampaignStatus {
    {
      leadEmail    = lead.email.toLower().trim(#char ' ');
      companyName  = lead.companyName;
      city         = lead.city;
      state        = lead.state;
      phone        = lead.phone;
      website      = lead.website;
      businessType = lead.businessType;
      currentStep  = 1;
      lastSentAt   = null;
      lastOpenedAt = null;
      enrolledAt   = now;
      status       = #active;
    };
  };

  /// Advance a lead to the next email step; mark #completed when done.
  public func advanceStep(s : T.LeadCampaignStatus, now : Int) : T.LeadCampaignStatus {
    let nextStep = s.currentStep + 1;
    let newStatus : T.CampaignLeadStatus = if (nextStep > 7) #completed else #active;
    { s with currentStep = nextStep; lastSentAt = ?now; status = newStatus };
  };

  /// Mark last-opened timestamp.
  public func markOpened(s : T.LeadCampaignStatus, now : Int) : T.LeadCampaignStatus {
    { s with lastOpenedAt = ?now };
  };

  // ── Pacing helper ─────────────────────────────────────────────────────────

  /// 55-second pacing in nanoseconds.
  public let pacingNs : Int = 55_000_000_000;

  /// Returns true if the lead is ready for its next send based on 55-second pacing.
  public func isReadyToSend(s : T.LeadCampaignStatus, now : Int) : Bool {
    switch (s.lastSentAt) {
      case null true;
      case (?t) { (now - t) >= pacingNs };
    };
  };

  // ── Stats helpers ─────────────────────────────────────────────────────────

  /// Compute campaign statistics from the enrolled leads map and counters.
  public func computeStats(
    statuses  : Map.Map<Text, T.LeadCampaignStatus>,
    counters  : T.CampaignCounters,
  ) : T.CampaignStats {
    let total = statuses.size();
    let denom : Float = if (counters.totalSent == 0) 1.0
                        else counters.totalSent.toFloat();
    {
      totalEnrolled     = total;
      emailsSentToday   = counters.sentToday;
      emailsSentWeek    = counters.sentThisWeek;
      emailsSentAllTime = counters.totalSent;
      openRate  = counters.totalOpens.toFloat()  / denom;
      clickRate = counters.totalClicks.toFloat() / denom;
    };
  };

  // ── Caffeine email send helper ────────────────────────────────────────────

  let caffEmailEndpoint : Text = "https://email.caffeine.ai/send";

  /// Send an email via Caffeine marketing email infrastructure.
  /// Returns true on success.
  public func sendMarketingEmail(
    toEmail     : Text,
    companyName : Text,
    subject     : Text,
    body        : Text,
    stepNum     : Nat,
    transform   : Transform,
  ) : async Bool {
    let escaped = escapeJson(body);
    let escapedSubj = escapeJson(subject);
    let escapedTo   = escapeJson(toEmail);
    let escapedName = escapeJson(companyName);
    let payload = "{\"type\":\"marketing\"," #
      "\"to\":\"" # escapedTo # "\"," #
      "\"recipientName\":\"" # escapedName # "\"," #
      "\"subject\":\"" # escapedSubj # "\"," #
      "\"body\":\"" # escaped # "\"," #
      "\"topic\":\"Roofing Outreach Campaign\"," #
      "\"stepNumber\":" # stepNum.toText() #
      "}";
    let headers : [Outcall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];
    try {
      let _r = await Outcall.httpPostRequest(caffEmailEndpoint, headers, payload, transform);
      true;
    } catch (_) { false };
  };

  // ── JSON escape ───────────────────────────────────────────────────────────

  public func escapeJson(s : Text) : Text {
    s.replace(#char '\\', "\\\\")
     .replace(#text "\"", "\\\"")
     .replace(#char '\n', "\\n")
     .replace(#char '\r', "\\r");
  };

};
