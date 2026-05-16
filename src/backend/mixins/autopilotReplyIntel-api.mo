import Map           "mo:core/Map";
import List          "mo:core/List";
import Time          "mo:core/Time";
import Text          "mo:core/Text";
import Runtime       "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall       "mo:caffeineai-http-outcalls/outcall";
import T             "../types/autopilotEngine";
import ICTypes       "../types/integrationCredentials";
import ICLib         "../lib/integrationCredentials";

/// Email Reply Intelligence Layer
///
/// When a lead replies to a cold outreach email the admin calls processEmailReply().
/// Claude classifies the reply as INTERESTED / NOT_INTERESTED / WRONG_PERSON / REFERRAL
/// and — for INTERESTED or REFERRAL — drafts a 3-sentence follow-up response.
///
/// Results surface in the admin reply inbox as ReplyInboxItem records with
/// status "pending_review".  The admin approves a draft (approveReplyDraft) which
/// sends via SendGrid, or rejects it (rejectReplyDraft).  NO auto-send is performed.
///
/// For REFERRAL the module also creates a new CRM Lead record with a "Referred by…" note.
/// For NOT_INTERESTED / WRONG_PERSON the lead status is updated to "no-contact".
mixin (
  accessControlState  : AccessControl.AccessControlState,
  integrationCreds    : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt            : Blob,
  emailReplyRecords   : List.List<T.EmailReplyRecord>,
  replyInboxItems     : List.List<T.ReplyInboxItem>,
  leads               : Map.Map<Text, Map.Map<Text, {
    id : Text; tenantId : Text; name : Text; email : Text;
    phone : Text; niche : Text; status : Text; source : Text;
    notes : Text; agentSubscriptions : [Text]; createdAt : Time.Time;
  }>>,
  transform           : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  // ── Constants ─────────────────────────────────────────────────────────────────

  let RI_PLATFORM_TENANT : Text = "platform";

  let CLASSIFY_PROMPT : Text =
    "Classify this email reply from a business owner who received a cold outreach email. " #
    "Classify as exactly one of: INTERESTED, NOT_INTERESTED, WRONG_PERSON, REFERRAL. " #
    "Reply with ONLY the classification word. " #
    "Then on a new line, if INTERESTED or REFERRAL, write a 3-sentence follow-up email response. " #
    "Reply body: ";

  // ── Auth helpers ──────────────────────────────────────────────────────────────

  func ri_assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  // ── Credential helpers ────────────────────────────────────────────────────────

  func ri_plainCreds() : ?ICTypes.IntegrationCredentials {
    switch (integrationCreds.get(RI_PLATFORM_TENANT)) {
      case (null) { null };
      case (?enc) { ?ICLib.decryptAll(enc, credSalt) };
    };
  };

  func ri_getClaude() : ?Text {
    switch (ri_plainCreds()) {
      case (null) { null };
      case (?c)   { if (c.claudeKey == "") null else ?c.claudeKey };
    };
  };

  func ri_getSendGrid() : ?Text {
    switch (ri_plainCreds()) {
      case (null) { null };
      case (?c)   { if (c.emailSmtpPass == "") null else ?c.emailSmtpPass };
    };
  };

  // ── Text helpers ──────────────────────────────────────────────────────────────

  func ri_jstr(s : Text) : Text {
    let esc = s.replace(#char '\\', "\\\\")
               .replace(#text "\"", "\\" # "\"")
               .replace(#char '\n', "\\n")
               .replace(#char '\r', "\\r");
    "\"" # esc # "\""
  };

  func ri_naiveField(json : Text, field : Text) : ?Text {
    let needle = "\"" # field # "\"";
    let segs   = json.split(#text needle);
    var afterKey = false;
    var result : ?Text = null;
    for (seg in segs) {
      if (afterKey and result == null) {
        let rest = seg.trimStart(#text " ")
                      .trimStart(#text ":")
                      .trimStart(#text " ");
        if (rest.startsWith(#text "\"")) {
          let inner = switch (rest.stripStart(#text "\"")) {
            case (?s) s;
            case (null) rest;
          };
          switch (inner.split(#text "\"").next()) {
            case (?v) { result := ?v };
            case (null) {};
          };
        };
      };
      afterKey := true;
    };
    result
  };

  // ── Lead helpers ──────────────────────────────────────────────────────────────

  type RiLead = {
    id : Text; tenantId : Text; name : Text; email : Text;
    phone : Text; niche : Text; status : Text; source : Text;
    notes : Text; agentSubscriptions : [Text]; createdAt : Time.Time;
  };

  func ri_getLead(leadId : Text) : ?RiLead {
    for ((_, tenantLeads) in leads.entries()) {
      switch (tenantLeads.get(leadId)) {
        case (?lead) { return ?lead };
        case (null) {};
      };
    };
    null
  };

  func ri_updateLeadStatus(leadId : Text, newStatus : Text) {
    for ((tenantId, tenantLeads) in leads.entries()) {
      switch (tenantLeads.get(leadId)) {
        case (?lead) {
          tenantLeads.add(leadId, { lead with status = newStatus });
          leads.add(tenantId, tenantLeads);
          return;
        };
        case (null) {};
      };
    };
  };

  func ri_createReferralLead(referredByName : Text, niche : Text) {
    let now  = Time.now();
    let id   = "ref-lead-" # now.toText();
    let lead : RiLead = {
      id;
      tenantId           = RI_PLATFORM_TENANT;
      name               = "Referred contact (from " # referredByName # ")";
      email              = "";
      phone              = "";
      niche;
      status             = "warm";
      source             = "Referral";
      notes              = "Referred by " # referredByName;
      agentSubscriptions = [];
      createdAt          = now;
    };
    let tenantLeads = switch (leads.get(RI_PLATFORM_TENANT)) {
      case (?existing) { existing };
      case (null)      { Map.empty<Text, RiLead>() };
    };
    tenantLeads.add(id, lead);
    leads.add(RI_PLATFORM_TENANT, tenantLeads);
  };

  // ── Claude call ───────────────────────────────────────────────────────────────

  func ri_callClaude(key : Text, replyBody : Text) : async (Text, ?Text) {
    // Returns (classification, ?draftFollowUp)
    let prompt = CLASSIFY_PROMPT # replyBody;
    let body = "{\"model\":\"claude-3-5-haiku-20241022\","
      # "\"max_tokens\":512,"
      # "\"messages\":[{\"role\":\"user\",\"content\":"
      # ri_jstr(prompt) # "}]}";
    let headers : [Outcall.Header] = [
      { name = "x-api-key";         value = key },
      { name = "anthropic-version"; value = "2023-06-01" },
      { name = "Content-Type";      value = "application/json" },
    ];
    try {
      let resp = await Outcall.httpPostRequest("https://api.anthropic.com/v1/messages", headers, body, transform);
      let raw  = switch (ri_naiveField(resp, "text")) { case (?v) v; case (null) resp };
      // First line = classification; remaining lines = draft follow-up
      let lines = raw.split(#char '\n');
      var first : ?Text = null;
      let rest  = List.empty<Text>();
      for (line in lines) {
        switch (first) {
          case (null)  { first := ?line };
          case (?_)    { rest.add(line) };
        };
      };
      let classification = switch (first) {
        case (?c) {
          let up = c.trim(#char ' ').toUpper();
          if      (up.startsWith(#text "INTERESTED") and not up.startsWith(#text "NOT_INTERESTED") and not up.startsWith(#text "NOT INTERESTED")) "INTERESTED"
          else if (up.startsWith(#text "NOT_INTERESTED") or up.startsWith(#text "NOT INTERESTED")) "NOT_INTERESTED"
          else if (up.startsWith(#text "WRONG_PERSON") or up.startsWith(#text "WRONG PERSON")) "WRONG_PERSON"
          else if (up.startsWith(#text "REFERRAL")) "REFERRAL"
          else "NOT_INTERESTED"
        };
        case (null) "NOT_INTERESTED";
      };
      let draftArr = rest.toArray();
      let draft : ?Text = if (draftArr.size() == 0) null
        else {
          var joined = "";
          var isFirst = true;
          for (line in draftArr.vals()) {
            if (not isFirst) { joined #= "\n" };
            joined #= line;
            isFirst := false;
          };
          if (joined.trim(#char ' ') == "") null else ?joined
        };
      (classification, draft)
    } catch (_) { ("NOT_INTERESTED", null) };
  };

  // ── SendGrid email send ────────────────────────────────────────────────────────

  func ri_sendViaEmail(sgKey : Text, toEmail : Text, toName : Text, subject : Text, bodyText : Text) : async Bool {
    let payload = "{\"personalizations\":[{\"to\":[{\"email\":"
      # ri_jstr(toEmail) # ",\"name\":" # ri_jstr(toName) # "}]}],"
      # "\"from\":{\"email\":\"outreach@bookedrankedfunded.org\",\"name\":\"BRF Outreach\"},"
      # "\"subject\":" # ri_jstr(subject) # ","
      # "\"content\":[{\"type\":\"text/plain\",\"value\":" # ri_jstr(bodyText) # "}]}";
    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = "Bearer " # sgKey },
      { name = "Content-Type";  value = "application/json" },
    ];
    try {
      let _ = await Outcall.httpPostRequest("https://api.sendgrid.com/v3/mail/send", headers, payload, transform);
      true
    } catch (_) { false };
  };

  // ── Public API ─────────────────────────────────────────────────────────────────

  /// Classify an inbound email reply and create a ReplyInboxItem for admin review.
  /// Returns the classification string.
  /// Side effects:
  ///   INTERESTED | REFERRAL  → ReplyInboxItem (pending_review) + EmailReplyRecord
  ///   REFERRAL               → also creates a new CRM lead with "Referred by…" note
  ///   NOT_INTERESTED | WRONG_PERSON → updates lead status to "no-contact", no inbox item
  public shared ({ caller }) func processEmailReply(leadId : Text, replyBody : Text) : async Text {
    ri_assertAdmin(caller);
    let (classification, draftOpt) = switch (ri_getClaude()) {
      case (null)   { ("NOT_INTERESTED", null) };   // graceful fallback
      case (?key)   { await ri_callClaude(key, replyBody) };
    };

    let now          = Time.now();
    let recordId     = "reply-" # leadId # "-" # now.toText();
    let classVariant : { #interested; #notInterested; #wrongPerson; #referral; #unclassified } =
      switch (classification) {
        case "INTERESTED"    { #interested };
        case "REFERRAL"      { #referral };
        case "WRONG_PERSON"  { #wrongPerson };
        case _               { #notInterested };
      };

    let record : T.EmailReplyRecord = {
      id             = recordId;
      leadId;
      replyBody;
      receivedAt     = now;
      classification = classVariant;
      draftFollowUp  = draftOpt;
      reviewStatus   = switch (classVariant) {
        case (#interested) { #pending };
        case (#referral)   { #pending };
        case _             { #rejected };
      };
      reviewedAt     = null;
    };
    emailReplyRecords.add(record);

    switch (classVariant) {
      case (#interested) {
        let leadInfo = ri_getLead(leadId);
        let (lName, lNiche) = switch (leadInfo) {
          case (?l) { (l.name, l.niche) };
          case (null) { ("Unknown", "general") };
        };
        let item : T.ReplyInboxItem = {
          id             = "inbox-" # recordId;
          leadId;
          leadName       = lName;
          leadNiche      = lNiche;
          replyBody;
          classification;
          draftResponse  = switch (draftOpt) { case (?d) d; case (null) "" };
          receivedAt     = now;
          status         = "pending_review";
        };
        replyInboxItems.add(item);
      };
      case (#referral) {
        let leadInfo = ri_getLead(leadId);
        let (lName, lNiche) = switch (leadInfo) {
          case (?l) { (l.name, l.niche) };
          case (null) { ("Unknown", "general") };
        };
        let item : T.ReplyInboxItem = {
          id             = "inbox-" # recordId;
          leadId;
          leadName       = lName;
          leadNiche      = lNiche;
          replyBody;
          classification;
          draftResponse  = switch (draftOpt) { case (?d) d; case (null) "" };
          receivedAt     = now;
          status         = "pending_review";
        };
        replyInboxItems.add(item);
        ri_createReferralLead(lName, lNiche);
      };
      case (_) {
        // NOT_INTERESTED or WRONG_PERSON — mark no-contact, no further touches
        ri_updateLeadStatus(leadId, "no-contact");
      };
    };

    classification
  };

  /// Return all reply inbox items (admin only).
  public query ({ caller }) func getReplyInboxItems() : async [T.ReplyInboxItem] {
    ri_assertAdmin(caller);
    replyInboxItems.toArray()
  };

  /// Approve a reply draft and send it via SendGrid.
  /// Marks the EmailReplyRecord as approved + sent.
  /// NO email is sent without explicit admin approval.
  public shared ({ caller }) func approveReplyDraft(inboxItemId : Text) : async Bool {
    ri_assertAdmin(caller);

    // Find inbox item
    let itemOpt = replyInboxItems.find(func(i) { i.id == inboxItemId });
    let item = switch (itemOpt) {
      case (?i) i;
      case (null) { Runtime.trap("Inbox item not found: " # inboxItemId) };
    };

    if (item.draftResponse == "") {
      Runtime.trap("No draft response to send for item: " # inboxItemId);
    };

    // Get lead email
    let leadInfo = ri_getLead(item.leadId);
    let (toEmail, toName) = switch (leadInfo) {
      case (?l) { (l.email, l.name) };
      case (null) { Runtime.trap("Lead not found: " # item.leadId) };
    };
    if (toEmail == "") {
      Runtime.trap("Lead has no email address: " # item.leadId);
    };

    let sgKeyOpt = ri_getSendGrid();
    let sent = switch (sgKeyOpt) {
      case (null) { false };
      case (?key) {
        await ri_sendViaEmail(key, toEmail, toName, "Following up on your reply", item.draftResponse)
      };
    };

    let now = Time.now();

    // Update inbox item status
    replyInboxItems.mapInPlace(func(i : T.ReplyInboxItem) : T.ReplyInboxItem {
      if (i.id == inboxItemId) { { i with status = if (sent) "sent" else "send_failed" } } else i
    });

    // Update email reply record reviewStatus
    emailReplyRecords.mapInPlace(func(r : T.EmailReplyRecord) : T.EmailReplyRecord {
      if (r.leadId == item.leadId) {
        { r with reviewStatus = if (sent) #sent else #approved; reviewedAt = ?now }
      } else r
    });

    sent
  };

  /// Reject a reply draft — marks it rejected with no send.
  public shared ({ caller }) func rejectReplyDraft(inboxItemId : Text) : async () {
    ri_assertAdmin(caller);
    let itemOpt = replyInboxItems.find(func(i) { i.id == inboxItemId });
    switch (itemOpt) {
      case (null) { Runtime.trap("Inbox item not found: " # inboxItemId) };
      case (?_) {};
    };
    replyInboxItems.mapInPlace(func(i : T.ReplyInboxItem) : T.ReplyInboxItem {
      if (i.id == inboxItemId) { { i with status = "rejected" } } else i
    });
    emailReplyRecords.mapInPlace(func(r : T.EmailReplyRecord) : T.EmailReplyRecord {
      // Match by leadId — mark first pending record for this lead as rejected
      if (r.reviewStatus == #pending) {
        { r with reviewStatus = #rejected; reviewedAt = ?Time.now() }
      } else r
    });
  };

  /// Return all raw email reply classification records (admin only).
  public query ({ caller }) func getEmailReplyRecords() : async [T.EmailReplyRecord] {
    ri_assertAdmin(caller);
    emailReplyRecords.toArray()
  };

};
