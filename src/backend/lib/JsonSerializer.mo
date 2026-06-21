import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Bool "mo:core/Bool";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

import VP "../types/verticalProfile";
import WS "../types/warmSequences";
import ET "../types/emailTemplate";
import CB "../types/campaignBuilder";
import BP "../types/bookedPipeline";
import CRM "../types/crmObjects";
import AQ "../types/approvalQueue";
import WL "../types/workflowLog";
import FR "../types/fundedReadiness";

module {

  // ── Char-array based helpers (mo:core 2.5.0 compatible) ─────────────────

  func textSize(t : Text) : Nat {
    t.toArray().size();
  };

  func sliceText(t : Text, start : Nat, len : Nat) : Text {
    let chars = t.toArray();
    if (start >= chars.size()) { return "" };
    let end = if (start + len > chars.size()) { chars.size() } else { start + len };
    var buf : [Char] = [];
    var i = start;
    while (i < end) {
      buf := Array.concat(buf, [chars[i]]);
      i += 1;
    };
    Text.fromIter(buf.vals());
  };

  func sliceFrom(t : Text, start : Nat) : Text {
    let chars = t.toArray();
    if (start >= chars.size()) { return "" };
    var buf : [Char] = [];
    var i = start;
    while (i < chars.size()) {
      buf := Array.concat(buf, [chars[i]]);
      i += 1;
    };
    Text.fromIter(buf.vals());
  };

  func indexOfPattern(pat : Text, haystack : Text) : ?Nat {
    let pChars = pat.toArray();
    let hChars = haystack.toArray();
    let pLen = pChars.size();
    let hLen = hChars.size();
    if (pLen == 0) { return ?0 };
    if (pLen > hLen) { return null };
    var i = 0;
    label outer while (i + pLen <= hLen) {
      var matched = true;
      var j = 0;
      label inner while (j < pLen) {
        if (hChars[i + j] != pChars[j]) {
          matched := false;
          break inner;
        };
        j += 1;
      };
      if (matched) { return ?i };
      i += 1;
    };
    null;
  };

  func startsWith(t : Text, prefix : Text) : Bool {
    let tChars = t.toArray();
    let pChars = prefix.toArray();
    let tLen = tChars.size();
    let pLen = pChars.size();
    if (pLen > tLen) { return false };
    var i = 0;
    while (i < pLen) {
      if (tChars[i] != pChars[i]) { return false };
      i += 1;
    };
    true;
  };

  // ── JSON Extraction Helpers ───────────────────────────────────────────────

  func jsonToTextArr(json : Text, fieldName : Text) : [Text] {
    let search = "\"" # fieldName # "\":";
    switch (indexOfPattern(search, json)) {
      case null { return [] };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        switch (indexOfPattern("[", after)) {
          case null { return [] };
          case (?openIdx) {
            let rest = sliceFrom(after, openIdx + 1);
            var items : [Text] = [];
            var pos : Nat = 0;
            let restChars = rest.toArray();
            while (pos < restChars.size()) {
              switch (indexOfPattern("\"", sliceFrom(rest, pos))) {
                case null { pos := restChars.size() };
                case (?qIdx) {
                  let start = pos + qIdx + 1;
                  var end : Nat = start;
                  label findEnd while (end < restChars.size()) {
                    if (restChars[end] == '\"') {
                      if (end > 0 and restChars[end - 1] == '\\') {
                        end += 1;
                        continue findEnd;
                      };
                      break findEnd;
                    };
                    end += 1;
                  };
                  if (end > start and end < restChars.size()) {
                    let item = sliceText(rest, start, end - start);
                    items := Array.concat(items, [item]);
                  };
                  pos := end + 1;
                };
              };
            };
            return items;
          };
        };
      };
    };
    [];
  };

  func extractTextField(json : Text, fieldName : Text) : Text {
    let search = "\"" # fieldName # "\":\"";
    switch (indexOfPattern(search, json)) {
      case null { return "" };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        let afterChars = after.toArray();
        var end : Nat = 0;
        label findEnd while (end < afterChars.size()) {
          if (afterChars[end] == '\"') {
            if (end > 0 and afterChars[end - 1] == '\\') {
              end += 1;
              continue findEnd;
            };
            break findEnd;
          };
          end += 1;
        };
        if (end > 0 and end < afterChars.size()) {
          sliceText(after, 0, end);
        } else {
          "";
        };
      };
    };
  };

  func extractNatField(json : Text, fieldName : Text) : Nat {
    let search = "\"" # fieldName # "\":";
    switch (indexOfPattern(search, json)) {
      case null { return 0 };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        let afterChars = after.toArray();
        var end : Nat = 0;
        while (end < afterChars.size() and afterChars[end] != ',' and afterChars[end] != '}') {
          end += 1;
        };
        let numStr = sliceText(after, 0, end);
        switch (Nat.fromText(numStr)) {
          case (?n) { n };
          case null { 0 };
        };
      };
    };
  };

  func extractIntField(json : Text, fieldName : Text) : Int {
    let search = "\"" # fieldName # "\":";
    switch (indexOfPattern(search, json)) {
      case null { return 0 };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        let afterChars = after.toArray();
        var end : Nat = 0;
        while (end < afterChars.size() and afterChars[end] != ',' and afterChars[end] != '}') {
          end += 1;
        };
        let numStr = sliceText(after, 0, end);
        switch (Int.fromText(numStr)) {
          case (?n) { n };
          case null { 0 };
        };
      };
    };
  };

  func extractBoolField(json : Text, fieldName : Text) : Bool {
    let search = "\"" # fieldName # "\":";
    switch (indexOfPattern(search, json)) {
      case null { return false };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        startsWith(after, "true");
      };
    };
  };

  // ── VerticalProfileExt ────────────────────────────────────────────────────

  public func encodeVerticalProfile(profile : VP.VerticalProfileExt) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(profile.id) # "\","
      # "\"tenantId\":\"" # escapeJson(profile.tenantId) # "\","
      # "\"niche\":\"" # escapeJson(profile.niche) # "\","
      # "\"category\":\"" # escapeJson(profile.category) # "\","
      # "\"commonServices\":" # textArrToJson(profile.commonServices) # ","
      # "\"subNiches\":" # textArrToJson(profile.subNiches) # ","
      # "\"services\":" # textArrToJson(profile.services) # ","
      # "\"commonLeadTypes\":" # textArrToJson(profile.commonLeadTypes) # ","
      # "\"targetAudience\":\"" # escapeJson(profile.targetAudience) # "\","
      # "\"positioning\":\"" # escapeJson(profile.positioning) # "\","
      # "\"differentiators\":" # textArrToJson(profile.differentiators) # ","
      # "\"brandVoice\":\"" # escapeJson(profile.brandVoice) # "\","
      # "\"doRules\":" # textArrToJson(profile.doRules) # ","
      # "\"doNotRules\":" # textArrToJson(profile.doNotRules) # ","
      # "\"competitors\":" # textArrToJson(profile.competitors) # ","
      # "\"serviceArea\":" # textArrToJson(profile.serviceArea) # ","
      # "\"keywords\":" # textArrToJson(profile.keywords) # ","
      # "\"contentPillars\":" # textArrToJson(profile.contentPillars) # ","
      # "\"localSEOKeywordPatterns\":" # textArrToJson(profile.localSEOKeywordPatterns) # ","
      # "\"commonGBPPostTypes\":" # textArrToJson(profile.commonGBPPostTypes) # ","
      # "\"commonReviewThemes\":" # textArrToJson(profile.commonReviewThemes) # ","
      # "\"complianceNotes\":\"" # escapeJson(profile.complianceNotes) # "\","
      # "\"defaultPipelineLabels\":" # textArrToJson(profile.defaultPipelineLabels) # ","
      # "\"commonOffers\":" # textArrToJson(profile.commonOffers) # ","
      # "\"commonCampaignTypes\":" # textArrToJson(profile.commonCampaignTypes) # ","
      # "\"fundingNeeds\":" # textArrToJson(profile.fundingNeeds) # ","
      # "\"emailTone\":\"" # escapeJson(profile.emailTone) # "\","
      # "\"smsTone\":\"" # escapeJson(profile.smsTone) # "\","
      # "\"prohibitedClaims\":" # textArrToJson(profile.prohibitedClaims) # ","
      # "\"recommendedDisclaimers\":" # textArrToJson(profile.recommendedDisclaimers) # ","
      # "\"exampleContentAngles\":" # textArrToJson(profile.exampleContentAngles) # ","
      # "\"exampleEmailTemplates\":" # textArrToJson(profile.exampleEmailTemplates) # ","
      # "\"exampleSMSFollowUps\":" # textArrToJson(profile.exampleSMSFollowUps) # ","
      # "\"proposalDeliverables\":" # textArrToJson(profile.proposalDeliverables) # ","
      # "\"leadFormFields\":" # textArrToJson(profile.leadFormFields) # ","
      # "\"createdAt\":" # Nat.toText(profile.createdAt) # ","
      # "\"updatedAt\":" # Nat.toText(profile.updatedAt)
      # "}";
  };

  public func decodeVerticalProfile(json : Text) : VP.VerticalProfileExt {
    {
      id = extractTextField(json, "id");
      tenantId = extractTextField(json, "tenantId");
      niche = extractTextField(json, "niche");
      category = extractTextField(json, "category");
      commonServices = jsonToTextArr(json, "commonServices");
      subNiches = jsonToTextArr(json, "subNiches");
      services = jsonToTextArr(json, "services");
      commonLeadTypes = jsonToTextArr(json, "commonLeadTypes");
      targetAudience = extractTextField(json, "targetAudience");
      positioning = extractTextField(json, "positioning");
      differentiators = jsonToTextArr(json, "differentiators");
      brandVoice = extractTextField(json, "brandVoice");
      doRules = jsonToTextArr(json, "doRules");
      doNotRules = jsonToTextArr(json, "doNotRules");
      competitors = jsonToTextArr(json, "competitors");
      serviceArea = jsonToTextArr(json, "serviceArea");
      keywords = jsonToTextArr(json, "keywords");
      contentPillars = jsonToTextArr(json, "contentPillars");
      localSEOKeywordPatterns = jsonToTextArr(json, "localSEOKeywordPatterns");
      commonGBPPostTypes = jsonToTextArr(json, "commonGBPPostTypes");
      commonReviewThemes = jsonToTextArr(json, "commonReviewThemes");
      complianceNotes = extractTextField(json, "complianceNotes");
      defaultPipelineLabels = jsonToTextArr(json, "defaultPipelineLabels");
      commonOffers = jsonToTextArr(json, "commonOffers");
      commonCampaignTypes = jsonToTextArr(json, "commonCampaignTypes");
      fundingNeeds = jsonToTextArr(json, "fundingNeeds");
      emailTone = extractTextField(json, "emailTone");
      smsTone = extractTextField(json, "smsTone");
      prohibitedClaims = jsonToTextArr(json, "prohibitedClaims");
      recommendedDisclaimers = jsonToTextArr(json, "recommendedDisclaimers");
      exampleContentAngles = jsonToTextArr(json, "exampleContentAngles");
      exampleEmailTemplates = jsonToTextArr(json, "exampleEmailTemplates");
      exampleSMSFollowUps = jsonToTextArr(json, "exampleSMSFollowUps");
      proposalDeliverables = jsonToTextArr(json, "proposalDeliverables");
      leadFormFields = jsonToTextArr(json, "leadFormFields");
      createdAt = extractNatField(json, "createdAt");
      updatedAt = extractNatField(json, "updatedAt");
    };
  };

  // ── WarmSequenceExt ───────────────────────────────────────────────────────

  func encodeWarmTouch(touch : WS.WarmTouch) : Text {
    "{"
      # "\"touchNumber\":" # Nat.toText(touch.touchNumber) # ","
      # "\"delayHours\":" # Nat.toText(touch.delayHours) # ","
      # "\"subject\":\"" # escapeJson(touch.subject) # "\","
      # "\"bodyTemplate\":\"" # escapeJson(touch.bodyTemplate) # "\","
      # "\"ctaType\":\"" # escapeJson(touch.ctaType) # "\","
      # "\"bookingLinkIncluded\":" # Bool.toText(touch.bookingLinkIncluded)
      # "}";
  };

  func decodeWarmTouch(json : Text) : WS.WarmTouch {
    {
      touchNumber = extractNatField(json, "touchNumber");
      delayHours = extractNatField(json, "delayHours");
      subject = extractTextField(json, "subject");
      bodyTemplate = extractTextField(json, "bodyTemplate");
      ctaType = extractTextField(json, "ctaType");
      bookingLinkIncluded = extractBoolField(json, "bookingLinkIncluded");
    };
  };

  func warmTouchesToJson(touches : [WS.WarmTouch]) : Text {
    var s = "[";
    for (i in touches.keys()) {
      if (i > 0) { s #= "," };
      s #= encodeWarmTouch(touches[i]);
    };
    s # "]";
  };

  func jsonToWarmTouches(json : Text, fieldName : Text) : [WS.WarmTouch] {
    let search = "\"" # fieldName # "\":";
    switch (indexOfPattern(search, json)) {
      case null { return [] };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        switch (indexOfPattern("[", after)) {
          case null { return [] };
          case (?openIdx) {
            let afterChars = after.toArray();
            var depth : Nat = 1;
            var pos : Nat = openIdx + 1;
            while (pos < afterChars.size() and depth > 0) {
              if (afterChars[pos] == '[') { depth += 1 };
              if (afterChars[pos] == ']') { depth -= 1 };
              pos += 1;
            };
            let arrContent = sliceText(after, openIdx + 1, pos - openIdx - 2);
            var items : [WS.WarmTouch] = [];
            var itemStart : Nat = 0;
            var braceDepth : Nat = 0;
            var idx : Nat = 0;
            let arrChars = arrContent.toArray();
            while (idx < arrChars.size()) {
              if (arrChars[idx] == '{') { braceDepth += 1 };
              if (arrChars[idx] == '}') {
                braceDepth -= 1;
                if (braceDepth == 0) {
                  let item = sliceText(arrContent, itemStart, idx - itemStart + 1);
                  items := Array.concat(items, [decodeWarmTouch(item)]);
                  itemStart := idx + 1;
                };
              };
              idx += 1;
            };
            return items;
          };
        };
      };
    };
    [];
  };

  func campaignTypeToJson(ct : ?WS.CampaignType) : Text {
    switch (ct) {
      case null { "null" };
      case (?#leadNurture) { "\"leadNurture\"" };
      case (?#coldEmail) { "\"coldEmail\"" };
      case (?#oldLeadReactivation) { "\"oldLeadReactivation\"" };
      case (?#proposalFollowUp) { "\"proposalFollowUp\"" };
      case (?#referralPartnerOutreach) { "\"referralPartnerOutreach\"" };
      case (?#reviewRequest) { "\"reviewRequest\"" };
      case (?#localBusinessOutreach) { "\"localBusinessOutreach\"" };
      case (?#seasonalPromo) { "\"seasonalPromo\"" };
      case (?#financingOffer) { "\"financingOffer\"" };
      case (?#eventWebinar) { "\"eventWebinar\"" };
      case (?#verticalSpecific) { "\"verticalSpecific\"" };
    };
  };

  func extractCampaignType(json : Text, fieldName : Text) : ?WS.CampaignType {
    let search = "\"" # fieldName # "\":";
    switch (indexOfPattern(search, json)) {
      case null { return null };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        if (startsWith(after, "null")) { return null };
        let val = extractTextField(json, fieldName);
        switch (val) {
          case "leadNurture" { ?#leadNurture };
          case "coldEmail" { ?#coldEmail };
          case "oldLeadReactivation" { ?#oldLeadReactivation };
          case "proposalFollowUp" { ?#proposalFollowUp };
          case "referralPartnerOutreach" { ?#referralPartnerOutreach };
          case "reviewRequest" { ?#reviewRequest };
          case "localBusinessOutreach" { ?#localBusinessOutreach };
          case "seasonalPromo" { ?#seasonalPromo };
          case "financingOffer" { ?#financingOffer };
          case "eventWebinar" { ?#eventWebinar };
          case "verticalSpecific" { ?#verticalSpecific };
          case _ { null };
        };
      };
    };
  };

  public func optTextToJson(ot : ?Text) : Text {
    switch (ot) {
      case null { "null" };
      case (?t) { "\"" # escapeJson(t) # "\"" };
    };
  };

  public func extractOptText(json : Text, fieldName : Text) : ?Text {
    let search = "\"" # fieldName # "\":";
    switch (indexOfPattern(search, json)) {
      case null { return null };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        if (startsWith(after, "null")) { return null };
        let val = extractTextField(json, fieldName);
        if (val == "") { null } else { ?val };
      };
    };
  };

  public func optNatToJson(on : ?Nat) : Text {
    switch (on) {
      case null { "null" };
      case (?n) { Nat.toText(n) };
    };
  };

  public func extractOptNat(json : Text, fieldName : Text) : ?Nat {
    let search = "\"" # fieldName # "\":";
    switch (indexOfPattern(search, json)) {
      case null { return null };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        if (startsWith(after, "null")) { return null };
        let n = extractNatField(json, fieldName);
        if (n == 0) {
          let valStr = extractTextField(json, fieldName);
          if (valStr == "") { null } else { ?n };
        } else { ?n };
      };
    };
  };

  public func optBoolToJson(ob : ?Bool) : Text {
    switch (ob) {
      case null { "null" };
      case (?b) { Bool.toText(b) };
    };
  };

  public func extractOptBool(json : Text, fieldName : Text) : ?Bool {
    let search = "\"" # fieldName # "\":";
    switch (indexOfPattern(search, json)) {
      case null { return null };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        if (startsWith(after, "null")) { return null };
        if (startsWith(after, "true")) { ?true } else { ?false };
      };
    };
  };

  public func optArrayToJson(arr : ?[Text]) : Text {
    switch (arr) {
      case null { "null" };
      case (?a) { textArrToJson(a) };
    };
  };

  public func extractOptArray(json : Text, fieldName : Text) : ?[Text] {
    let search = "\"" # fieldName # "\":";
    switch (indexOfPattern(search, json)) {
      case null { return null };
      case (?startIdx) {
        let after = sliceFrom(json, startIdx + textSize(search));
        if (startsWith(after, "null")) { return null };
        let arr = jsonToTextArr(json, fieldName);
        if (arr.size() == 0) {
          let fullSearch = "\"" # fieldName # "\":";
          switch (indexOfPattern(fullSearch, json)) {
            case null { null };
            case (_) { ?arr };
          };
        } else { ?arr };
      };
    };
  };

  public func encodeWarmSequence(seq : WS.WarmSequenceExt) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(seq.id) # "\","
      # "\"niche\":\"" # escapeJson(seq.niche) # "\","
      # "\"name\":\"" # escapeJson(seq.name) # "\","
      # "\"touches\":" # warmTouchesToJson(seq.touches) # ","
      # "\"triggerEvents\":" # textArrToJson(seq.triggerEvents) # ","
      # "\"campaignType\":" # campaignTypeToJson(seq.campaignType) # ","
      # "\"verticalProfileId\":" # optTextToJson(seq.verticalProfileId) # ","
      # "\"complianceNotes\":" # optTextToJson(seq.complianceNotes) # ","
      # "\"unsubscribeLink\":" # optTextToJson(seq.unsubscribeLink) # ","
      # "\"consentTracking\":" # optBoolToJson(seq.consentTracking) # ","
      # "\"replyTracking\":" # optBoolToJson(seq.replyTracking)
      # "}";
  };

  public func decodeWarmSequence(json : Text) : WS.WarmSequenceExt {
    {
      id = extractTextField(json, "id");
      niche = extractTextField(json, "niche");
      name = extractTextField(json, "name");
      touches = jsonToWarmTouches(json, "touches");
      triggerEvents = jsonToTextArr(json, "triggerEvents");
      campaignType = extractCampaignType(json, "campaignType");
      verticalProfileId = extractOptText(json, "verticalProfileId");
      complianceNotes = extractOptText(json, "complianceNotes");
      unsubscribeLink = extractOptText(json, "unsubscribeLink");
      consentTracking = extractOptBool(json, "consentTracking");
      replyTracking = extractOptBool(json, "replyTracking");
    };
  };

  // ── EmailTemplateExt ──────────────────────────────────────────────────────

  public func encodeEmailTemplate(tpl : ET.EmailTemplateExt) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":" # Nat.toText(tpl.id) # ","
      # "\"day\":" # Nat.toText(tpl.day) # ","
      # "\"subject\":\"" # escapeJson(tpl.subject) # "\","
      # "\"body\":\"" # escapeJson(tpl.body) # "\","
      # "\"fallbackSubject\":\"" # escapeJson(tpl.fallbackSubject) # "\","
      # "\"fallbackBody\":\"" # escapeJson(tpl.fallbackBody) # "\","
      # "\"updatedAt\":" # Int.toText(tpl.updatedAt) # ","
      # "\"campaignType\":" # campaignTypeToJson(tpl.campaignType) # ","
      # "\"verticalProfileId\":" # optTextToJson(tpl.verticalProfileId) # ","
      # "\"complianceNotes\":" # optTextToJson(tpl.complianceNotes) # ","
      # "\"consentRequired\":" # optBoolToJson(tpl.consentRequired) # ","
      # "\"unsubscribeFooter\":" # optBoolToJson(tpl.unsubscribeFooter)
      # "}";
  };

  public func decodeEmailTemplate(json : Text) : ET.EmailTemplateExt {
    {
      id = extractNatField(json, "id");
      day = extractNatField(json, "day");
      subject = extractTextField(json, "subject");
      body = extractTextField(json, "body");
      fallbackSubject = extractTextField(json, "fallbackSubject");
      fallbackBody = extractTextField(json, "fallbackBody");
      updatedAt = extractIntField(json, "updatedAt");
      campaignType = extractCampaignType(json, "campaignType");
      verticalProfileId = extractOptText(json, "verticalProfileId");
      complianceNotes = extractOptText(json, "complianceNotes");
      consentRequired = extractOptBool(json, "consentRequired");
      unsubscribeFooter = extractOptBool(json, "unsubscribeFooter");
    };
  };

  // ── CampaignBuilderState ──────────────────────────────────────────────────

  func campaignBuilderTypeToJson(ct : CB.CampaignType) : Text {
    switch (ct) {
      case (#lead_nurture) { "\"lead_nurture\"" };
      case (#cold_email) { "\"cold_email\"" };
      case (#old_lead_reactivation) { "\"old_lead_reactivation\"" };
      case (#proposal_follow_up) { "\"proposal_follow_up\"" };
      case (#referral_partner_outreach) { "\"referral_partner_outreach\"" };
      case (#review_request) { "\"review_request\"" };
      case (#local_business_outreach) { "\"local_business_outreach\"" };
      case (#seasonal_promo) { "\"seasonal_promo\"" };
      case (#financing_offer) { "\"financing_offer\"" };
      case (#event_webinar) { "\"event_webinar\"" };
      case (#vertical_specific) { "\"vertical_specific\"" };
    };
  };

  func extractCampaignBuilderType(json : Text, fieldName : Text) : CB.CampaignType {
    let val = extractTextField(json, fieldName);
    switch (val) {
      case "cold_email" { #cold_email };
      case "old_lead_reactivation" { #old_lead_reactivation };
      case "proposal_follow_up" { #proposal_follow_up };
      case "referral_partner_outreach" { #referral_partner_outreach };
      case "review_request" { #review_request };
      case "local_business_outreach" { #local_business_outreach };
      case "seasonal_promo" { #seasonal_promo };
      case "financing_offer" { #financing_offer };
      case "event_webinar" { #event_webinar };
      case "vertical_specific" { #vertical_specific };
      case _ { #lead_nurture };
    };
  };

  public func encodeCampaign(campaign : CB.CampaignBuilderState) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(campaign.id) # "\","
      # "\"clientBusinessId\":\"" # escapeJson(campaign.clientBusinessId) # "\","
      # "\"verticalProfileId\":\"" # escapeJson(campaign.verticalProfileId) # "\","
      # "\"campaignType\":" # campaignBuilderTypeToJson(campaign.campaignType) # ","
      # "\"campaignName\":\"" # escapeJson(campaign.campaignName) # "\","
      # "\"targetAudience\":\"" # escapeJson(campaign.targetAudience) # "\","
      # "\"messageDraft\":\"" # escapeJson(campaign.messageDraft) # "\","
      # "\"subjectLine\":\"" # escapeJson(campaign.subjectLine) # "\","
      # "\"ctaText\":\"" # escapeJson(campaign.ctaText) # "\","
      # "\"sequenceSteps\":" # textArrToJson(campaign.sequenceSteps) # ","
      # "\"approvalStatus\":\"" # escapeJson(campaign.approvalStatus) # "\","
      # "\"sendCount\":" # Nat.toText(campaign.sendCount) # ","
      # "\"openCount\":" # Nat.toText(campaign.openCount) # ","
      # "\"replyCount\":" # Nat.toText(campaign.replyCount) # ","
      # "\"unsubscribeCount\":" # Nat.toText(campaign.unsubscribeCount) # ","
      # "\"createdAt\":" # Int.toText(campaign.createdAt) # ","
      # "\"updatedAt\":" # Int.toText(campaign.updatedAt)
      # "}";
  };

  public func decodeCampaign(json : Text) : CB.CampaignBuilderState {
    {
      id = extractTextField(json, "id");
      clientBusinessId = extractTextField(json, "clientBusinessId");
      verticalProfileId = extractTextField(json, "verticalProfileId");
      campaignType = extractCampaignBuilderType(json, "campaignType");
      campaignName = extractTextField(json, "campaignName");
      targetAudience = extractTextField(json, "targetAudience");
      messageDraft = extractTextField(json, "messageDraft");
      subjectLine = extractTextField(json, "subjectLine");
      ctaText = extractTextField(json, "ctaText");
      sequenceSteps = jsonToTextArr(json, "sequenceSteps");
      approvalStatus = extractTextField(json, "approvalStatus");
      sendCount = extractNatField(json, "sendCount");
      openCount = extractNatField(json, "openCount");
      replyCount = extractNatField(json, "replyCount");
      unsubscribeCount = extractNatField(json, "unsubscribeCount");
      createdAt = extractIntField(json, "createdAt");
      updatedAt = extractIntField(json, "updatedAt");
    };
  };

  // ── BookedPipelineState (Lead) ────────────────────────────────────────────

  func pipelineStageToJson(stage : BP.PipelineStage) : Text {
    switch (stage) {
      case (#new_lead) { "\"new_lead\"" };
      case (#contact_attempted) { "\"contact_attempted\"" };
      case (#appointment_scheduled) { "\"appointment_scheduled\"" };
      case (#discovery_completed) { "\"discovery_completed\"" };
      case (#proposal_sent) { "\"proposal_sent\"" };
      case (#financing_pending) { "\"financing_pending\"" };
      case (#follow_up_needed) { "\"follow_up_needed\"" };
      case (#won) { "\"won\"" };
      case (#lost) { "\"lost\"" };
      case (#nurture) { "\"nurture\"" };
    };
  };

  func extractPipelineStage(json : Text, fieldName : Text) : BP.PipelineStage {
    let val = extractTextField(json, fieldName);
    switch (val) {
      case "contact_attempted" { #contact_attempted };
      case "appointment_scheduled" { #appointment_scheduled };
      case "discovery_completed" { #discovery_completed };
      case "proposal_sent" { #proposal_sent };
      case "financing_pending" { #financing_pending };
      case "follow_up_needed" { #follow_up_needed };
      case "won" { #won };
      case "lost" { #lost };
      case "nurture" { #nurture };
      case _ { #new_lead };
    };
  };

  func stageHistoryToJson(history : [(BP.PipelineStage, Int)]) : Text {
    var s = "[";
    for (i in history.keys()) {
      if (i > 0) { s #= "," };
      let (stage, time) = history[i];
      s #= "{\"stage\":" # pipelineStageToJson(stage) # ",\"time\":" # Int.toText(time) # "}";
    };
    s # "]";
  };

  func extractStageHistory(json : Text, fieldName : Text) : [(BP.PipelineStage, Int)] {
    // Simplified: return empty for now; full parse would need nested object extraction
    [];
  };

  public func encodeLead(lead : BP.BookedPipelineState) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(lead.id) # "\","
      # "\"clientBusinessId\":\"" # escapeJson(lead.clientBusinessId) # "\","
      # "\"verticalProfileId\":\"" # escapeJson(lead.verticalProfileId) # "\","
      # "\"leadId\":\"" # escapeJson(lead.leadId) # "\","
      # "\"currentStage\":" # pipelineStageToJson(lead.currentStage) # ","
      # "\"stageHistory\":" # stageHistoryToJson(lead.stageHistory) # ","
      # "\"nextAction\":\"" # escapeJson(lead.nextAction) # "\","
      # "\"nextActionDue\":" # optNatToJson(lead.nextActionDue) # ","
      # "\"assignedAgent\":\"" # escapeJson(lead.assignedAgent) # "\","
      # "\"followUpCount\":" # Nat.toText(lead.followUpCount) # ","
      # "\"lastContactAt\":" # optNatToJson(lead.lastContactAt) # ","
      # "\"notes\":" # textArrToJson(lead.notes) # ","
      # "\"createdAt\":" # Int.toText(lead.createdAt) # ","
      # "\"updatedAt\":" # Int.toText(lead.updatedAt)
      # "}";
  };

  public func decodeLead(json : Text) : BP.BookedPipelineState {
    {
      id = extractTextField(json, "id");
      clientBusinessId = extractTextField(json, "clientBusinessId");
      verticalProfileId = extractTextField(json, "verticalProfileId");
      leadId = extractTextField(json, "leadId");
      currentStage = extractPipelineStage(json, "currentStage");
      stageHistory = extractStageHistory(json, "stageHistory");
      nextAction = extractTextField(json, "nextAction");
      nextActionDue = extractOptNat(json, "nextActionDue");
      assignedAgent = extractTextField(json, "assignedAgent");
      followUpCount = extractNatField(json, "followUpCount");
      lastContactAt = extractOptNat(json, "lastContactAt");
      notes = jsonToTextArr(json, "notes");
      createdAt = extractIntField(json, "createdAt");
      updatedAt = extractIntField(json, "updatedAt");
    };
  };

  // ── CRM Contact ───────────────────────────────────────────────────────────

  public func encodeContact(contact : CRM.Contact) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(contact.id) # "\","
      # "\"clientBusinessId\":\"" # escapeJson(contact.clientBusinessId) # "\","
      # "\"firstName\":\"" # escapeJson(contact.firstName) # "\","
      # "\"lastName\":\"" # escapeJson(contact.lastName) # "\","
      # "\"email\":\"" # escapeJson(contact.email) # "\","
      # "\"phone\":\"" # escapeJson(contact.phone) # "\","
      # "\"title\":\"" # escapeJson(contact.title) # "\","
      # "\"leadSource\":\"" # escapeJson(contact.leadSource) # "\","
      # "\"industry\":\"" # escapeJson(contact.industry) # "\","
      # "\"nurtureStatus\":\"" # escapeJson(contact.nurtureStatus) # "\","
      # "\"notes\":\"" # escapeJson(contact.notes) # "\","
      # "\"createdAt\":" # Int.toText(contact.createdAt) # ","
      # "\"updatedAt\":" # Int.toText(contact.updatedAt)
      # "}";
  };

  public func decodeContact(json : Text) : CRM.Contact {
    {
      id = extractTextField(json, "id");
      clientBusinessId = extractTextField(json, "clientBusinessId");
      firstName = extractTextField(json, "firstName");
      lastName = extractTextField(json, "lastName");
      email = extractTextField(json, "email");
      phone = extractTextField(json, "phone");
      title = extractTextField(json, "title");
      leadSource = extractTextField(json, "leadSource");
      industry = extractTextField(json, "industry");
      nurtureStatus = extractTextField(json, "nurtureStatus");
      notes = extractTextField(json, "notes");
      createdAt = extractIntField(json, "createdAt");
      updatedAt = extractIntField(json, "updatedAt");
    };
  };

  // ── CRM Opportunity ───────────────────────────────────────────────────────

  func opportunityStageToJson(stage : CRM.OpportunityStage) : Text {
    switch (stage) {
      case (#New) { "\"New\"" };
      case (#Qualified) { "\"Qualified\"" };
      case (#Proposal) { "\"Proposal\"" };
      case (#Negotiation) { "\"Negotiation\"" };
      case (#ClosedWon) { "\"ClosedWon\"" };
      case (#ClosedLost) { "\"ClosedLost\"" };
    };
  };

  func extractOpportunityStage(json : Text, fieldName : Text) : CRM.OpportunityStage {
    let val = extractTextField(json, fieldName);
    switch (val) {
      case "Qualified" { #Qualified };
      case "Proposal" { #Proposal };
      case "Negotiation" { #Negotiation };
      case "ClosedWon" { #ClosedWon };
      case "ClosedLost" { #ClosedLost };
      case _ { #New };
    };
  };

  public func encodeOpportunity(opp : CRM.Opportunity) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(opp.id) # "\","
      # "\"clientBusinessId\":\"" # escapeJson(opp.clientBusinessId) # "\","
      # "\"contactId\":\"" # escapeJson(opp.contactId) # "\","
      # "\"companyId\":\"" # escapeJson(opp.companyId) # "\","
      # "\"title\":\"" # escapeJson(opp.title) # "\","
      # "\"value\":" # Nat.toText(opp.value) # ","
      # "\"stage\":" # opportunityStageToJson(opp.stage) # ","
      # "\"closeDate\":" # Int.toText(opp.closeDate) # ","
      # "\"probability\":" # Nat.toText(opp.probability) # ","
      # "\"notes\":\"" # escapeJson(opp.notes) # "\","
      # "\"createdAt\":" # Int.toText(opp.createdAt) # ","
      # "\"updatedAt\":" # Int.toText(opp.updatedAt)
      # "}";
  };

  public func decodeOpportunity(json : Text) : CRM.Opportunity {
    {
      id = extractTextField(json, "id");
      clientBusinessId = extractTextField(json, "clientBusinessId");
      contactId = extractTextField(json, "contactId");
      companyId = extractTextField(json, "companyId");
      title = extractTextField(json, "title");
      value = extractNatField(json, "value");
      stage = extractOpportunityStage(json, "stage");
      closeDate = extractIntField(json, "closeDate");
      probability = extractNatField(json, "probability");
      notes = extractTextField(json, "notes");
      createdAt = extractIntField(json, "createdAt");
      updatedAt = extractIntField(json, "updatedAt");
    };
  };

  // ── CRM Task ──────────────────────────────────────────────────────────────

  func taskPriorityToJson(p : CRM.TaskPriority) : Text {
    switch (p) {
      case (#Low) { "\"Low\"" };
      case (#Medium) { "\"Medium\"" };
      case (#High) { "\"High\"" };
      case (#Urgent) { "\"Urgent\"" };
    };
  };

  func extractTaskPriority(json : Text, fieldName : Text) : CRM.TaskPriority {
    let val = extractTextField(json, fieldName);
    switch (val) {
      case "Medium" { #Medium };
      case "High" { #High };
      case "Urgent" { #Urgent };
      case _ { #Low };
    };
  };

  func taskStatusToJson(s : CRM.TaskStatus) : Text {
    switch (s) {
      case (#NotStarted) { "\"NotStarted\"" };
      case (#InProgress) { "\"InProgress\"" };
      case (#Completed) { "\"Completed\"" };
      case (#Cancelled) { "\"Cancelled\"" };
    };
  };

  func extractTaskStatus(json : Text, fieldName : Text) : CRM.TaskStatus {
    let val = extractTextField(json, fieldName);
    switch (val) {
      case "InProgress" { #InProgress };
      case "Completed" { #Completed };
      case "Cancelled" { #Cancelled };
      case _ { #NotStarted };
    };
  };

  public func encodeTask(task : CRM.Task) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(task.id) # "\","
      # "\"clientBusinessId\":\"" # escapeJson(task.clientBusinessId) # "\","
      # "\"assignedTo\":\"" # escapeJson(task.assignedTo) # "\","
      # "\"title\":\"" # escapeJson(task.title) # "\","
      # "\"description\":\"" # escapeJson(task.description) # "\","
      # "\"priority\":" # taskPriorityToJson(task.priority) # ","
      # "\"status\":" # taskStatusToJson(task.status) # ","
      # "\"dueDate\":" # Int.toText(task.dueDate) # ","
      # "\"taskType\":\"" # escapeJson(task.taskType) # "\","
      # "\"relatedToId\":\"" # escapeJson(task.relatedToId) # "\","
      # "\"relatedToType\":\"" # escapeJson(task.relatedToType) # "\","
      # "\"createdAt\":" # Int.toText(task.createdAt) # ","
      # "\"updatedAt\":" # Int.toText(task.updatedAt)
      # "}";
  };

  public func decodeTask(json : Text) : CRM.Task {
    {
      id = extractTextField(json, "id");
      clientBusinessId = extractTextField(json, "clientBusinessId");
      assignedTo = extractTextField(json, "assignedTo");
      title = extractTextField(json, "title");
      description = extractTextField(json, "description");
      priority = extractTaskPriority(json, "priority");
      status = extractTaskStatus(json, "status");
      dueDate = extractIntField(json, "dueDate");
      taskType = extractTextField(json, "taskType");
      relatedToId = extractTextField(json, "relatedToId");
      relatedToType = extractTextField(json, "relatedToType");
      createdAt = extractIntField(json, "createdAt");
      updatedAt = extractIntField(json, "updatedAt");
    };
  };

  // ── CRM Note ──────────────────────────────────────────────────────────────

  func noteCategoryToJson(c : CRM.NoteCategory) : Text {
    switch (c) {
      case (#General) { "\"General\"" };
      case (#Call) { "\"Call\"" };
      case (#Meeting) { "\"Meeting\"" };
      case (#Email) { "\"Email\"" };
      case (#System) { "\"System\"" };
    };
  };

  func extractNoteCategory(json : Text, fieldName : Text) : CRM.NoteCategory {
    let val = extractTextField(json, fieldName);
    switch (val) {
      case "Call" { #Call };
      case "Meeting" { #Meeting };
      case "Email" { #Email };
      case "System" { #System };
      case _ { #General };
    };
  };

  public func encodeNote(note : CRM.Note) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(note.id) # "\","
      # "\"clientBusinessId\":\"" # escapeJson(note.clientBusinessId) # "\","
      # "\"authorId\":\"" # escapeJson(note.authorId) # "\","
      # "\"title\":\"" # escapeJson(note.title) # "\","
      # "\"body\":\"" # escapeJson(note.body) # "\","
      # "\"category\":" # noteCategoryToJson(note.category) # ","
      # "\"relatedToId\":\"" # escapeJson(note.relatedToId) # "\","
      # "\"relatedToType\":\"" # escapeJson(note.relatedToType) # "\","
      # "\"createdAt\":" # Int.toText(note.createdAt) # ","
      # "\"updatedAt\":" # Int.toText(note.updatedAt)
      # "}";
  };

  public func decodeNote(json : Text) : CRM.Note {
    {
      id = extractTextField(json, "id");
      clientBusinessId = extractTextField(json, "clientBusinessId");
      authorId = extractTextField(json, "authorId");
      title = extractTextField(json, "title");
      body = extractTextField(json, "body");
      category = extractNoteCategory(json, "category");
      relatedToId = extractTextField(json, "relatedToId");
      relatedToType = extractTextField(json, "relatedToType");
      createdAt = extractIntField(json, "createdAt");
      updatedAt = extractIntField(json, "updatedAt");
    };
  };

  // ── ApprovalItem ────────────────────────────────────────────────────────────

  func approvalStatusToJson(s : AQ.ApprovalStatus) : Text {
    switch (s) {
      case (#pending) { "\"pending\"" };
      case (#approved) { "\"approved\"" };
      case (#rejected) { "\"rejected\"" };
      case (#expired) { "\"expired\"" };
    };
  };

  func extractApprovalStatus(json : Text, fieldName : Text) : AQ.ApprovalStatus {
    let val = extractTextField(json, fieldName);
    switch (val) {
      case "approved" { #approved };
      case "rejected" { #rejected };
      case "expired" { #expired };
      case _ { #pending };
    };
  };

  func approvalTierToJson(t : AQ.ApprovalTier) : Text {
    switch (t) {
      case (#social_publish) { "\"social_publish\"" };
      case (#gbp_publish) { "\"gbp_publish\"" };
      case (#content_publish) { "\"content_publish\"" };
      case (#email_send) { "\"email_send\"" };
      case (#sms_send) { "\"sms_send\"" };
      case (#voice_call) { "\"voice_call\"" };
      case (#funding_claim) { "\"funding_claim\"" };
      case (#legal) { "\"legal\"" };
      case (#medical) { "\"medical\"" };
      case (#financial) { "\"financial\"" };
    };
  };

  func extractApprovalTier(json : Text, fieldName : Text) : AQ.ApprovalTier {
    let val = extractTextField(json, fieldName);
    switch (val) {
      case "gbp_publish" { #gbp_publish };
      case "content_publish" { #content_publish };
      case "email_send" { #email_send };
      case "sms_send" { #sms_send };
      case "voice_call" { #voice_call };
      case "funding_claim" { #funding_claim };
      case "legal" { #legal };
      case "medical" { #medical };
      case "financial" { #financial };
      case _ { #social_publish };
    };
  };

  public func encodeApprovalRequest(item : AQ.ApprovalItem) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(item.id) # "\","
      # "\"tenantId\":\"" # escapeJson(item.tenantId) # "\","
      # "\"runId\":\"" # escapeJson(item.runId) # "\","
      # "\"threadId\":\"" # escapeJson(item.threadId) # "\","
      # "\"action\":\"" # escapeJson(item.action) # "\","
      # "\"reason\":\"" # escapeJson(item.reason) # "\","
      # "\"tier\":" # approvalTierToJson(item.tier) # ","
      # "\"status\":" # approvalStatusToJson(item.status) # ","
      # "\"requestedAt\":" # Int.toText(item.requestedAt) # ","
      # "\"resolvedAt\":" # optNatToJson(item.resolvedAt) # ","
      # "\"approverNotes\":" # optTextToJson(item.approverNotes) # ","
      # "\"requestedBy\":\"" # escapeJson(item.requestedBy) # "\""
      # "}";
  };

  public func decodeApprovalRequest(json : Text) : AQ.ApprovalItem {
    {
      id = extractTextField(json, "id");
      tenantId = extractTextField(json, "tenantId");
      runId = extractTextField(json, "runId");
      threadId = extractTextField(json, "threadId");
      action = extractTextField(json, "action");
      reason = extractTextField(json, "reason");
      tier = extractApprovalTier(json, "tier");
      status = extractApprovalStatus(json, "status");
      requestedAt = extractIntField(json, "requestedAt");
      resolvedAt = extractOptNat(json, "resolvedAt");
      approverNotes = extractOptText(json, "approverNotes");
      requestedBy = extractTextField(json, "requestedBy");
    };
  };

  // ── WorkflowLogEntry ──────────────────────────────────────────────────────

  func workflowStatusToJson(s : WL.WorkflowStatus) : Text {
    switch (s) {
      case (#pending) { "\"pending\"" };
      case (#in_progress) { "\"in_progress\"" };
      case (#paused_for_approval) { "\"paused_for_approval\"" };
      case (#approved) { "\"approved\"" };
      case (#rejected) { "\"rejected\"" };
      case (#completed) { "\"completed\"" };
      case (#failed) { "\"failed\"" };
      case (#cancelled) { "\"cancelled\"" };
    };
  };

  func extractWorkflowStatus(json : Text, fieldName : Text) : WL.WorkflowStatus {
    let val = extractTextField(json, fieldName);
    switch (val) {
      case "in_progress" { #in_progress };
      case "paused_for_approval" { #paused_for_approval };
      case "approved" { #approved };
      case "rejected" { #rejected };
      case "completed" { #completed };
      case "failed" { #failed };
      case "cancelled" { #cancelled };
      case _ { #pending };
    };
  };

  public func encodeWorkflowLog(entry : WL.WorkflowLogEntry) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(entry.id) # "\","
      # "\"tenantId\":\"" # escapeJson(entry.tenantId) # "\","
      # "\"workflowId\":\"" # escapeJson(entry.workflowId) # "\","
      # "\"stepIndex\":" # Nat.toText(entry.stepIndex) # ","
      # "\"agentType\":\"" # escapeJson(entry.agentType) # "\","
      # "\"action\":\"" # escapeJson(entry.action) # "\","
      # "\"status\":" # workflowStatusToJson(entry.status) # ","
      # "\"inputRef\":" # optTextToJson(entry.inputRef) # ","
      # "\"outputRef\":" # optTextToJson(entry.outputRef) # ","
      # "\"notes\":\"" # escapeJson(entry.notes) # "\","
      # "\"createdAt\":" # Int.toText(entry.createdAt)
      # "}";
  };

  public func decodeWorkflowLog(json : Text) : WL.WorkflowLogEntry {
    {
      id = extractTextField(json, "id");
      tenantId = extractTextField(json, "tenantId");
      workflowId = extractTextField(json, "workflowId");
      stepIndex = extractNatField(json, "stepIndex");
      agentType = extractTextField(json, "agentType");
      action = extractTextField(json, "action");
      status = extractWorkflowStatus(json, "status");
      inputRef = extractOptText(json, "inputRef");
      outputRef = extractOptText(json, "outputRef");
      notes = extractTextField(json, "notes");
      createdAt = extractIntField(json, "createdAt");
    };
  };

  // ── FundedReadinessState ──────────────────────────────────────────────────

  public func encodeFundingReadiness(profile : FR.FundedReadinessState) : Text {
    "{"
      # "\"jsonSchemaVersion\":\"1.0\","
      # "\"id\":\"" # escapeJson(profile.id) # "\","
      # "\"clientBusinessId\":\"" # escapeJson(profile.clientBusinessId) # "\","
      # "\"verticalProfileId\":\"" # escapeJson(profile.verticalProfileId) # "\","
      # "\"legalBusinessName\":\"" # escapeJson(profile.legalBusinessName) # "\","
      # "\"ein\":\"" # escapeJson(profile.ein) # "\","
      # "\"entityType\":\"" # escapeJson(profile.entityType) # "\","
      # "\"yearsInBusiness\":" # Nat.toText(profile.yearsInBusiness) # ","
      # "\"monthlyRevenue\":" # Nat.toText(profile.monthlyRevenue) # ","
      # "\"bankStatementsAvailable\":" # Bool.toText(profile.bankStatementsAvailable) # ","
      # "\"creditScoreRange\":\"" # escapeJson(profile.creditScoreRange) # "\","
      # "\"businessBankAccount\":" # Bool.toText(profile.businessBankAccount) # ","
      # "\"businessAddress\":\"" # escapeJson(profile.businessAddress) # "\","
      # "\"website\":\"" # escapeJson(profile.website) # "\","
      # "\"emailDomain\":\"" # escapeJson(profile.emailDomain) # "\","
      # "\"dunsStatus\":\"" # escapeJson(profile.dunsStatus) # "\","
      # "\"experianBusinessStatus\":\"" # escapeJson(profile.experianBusinessStatus) # "\","
      # "\"equifaxBusinessStatus\":\"" # escapeJson(profile.equifaxBusinessStatus) # "\","
      # "\"tradeLines\":" # Nat.toText(profile.tradeLines) # ","
      # "\"existingDebt\":" # Nat.toText(profile.existingDebt) # ","
      # "\"equipmentNeeds\":" # textArrToJson(profile.equipmentNeeds) # ","
      # "\"marketingCapitalNeed\":" # Nat.toText(profile.marketingCapitalNeed) # ","
      # "\"taxReturnsAvailable\":" # Bool.toText(profile.taxReturnsAvailable) # ","
      # "\"documentsUploaded\":" # textArrToJson(profile.documentsUploaded) # ","
      # "\"industrySpecificFundingNeeds\":" # textArrToJson(profile.industrySpecificFundingNeeds) # ","
      # "\"overallReadinessScore\":" # Nat.toText(profile.overallReadinessScore) # ","
      # "\"credibilityScore\":" # Nat.toText(profile.credibilityScore) # ","
      # "\"revenueReadinessScore\":" # Nat.toText(profile.revenueReadinessScore) # ","
      # "\"documentScore\":" # Nat.toText(profile.documentScore) # ","
      # "\"actionPlan\":" # textArrToJson(profile.actionPlan) # ","
      # "\"approvalStatus\":\"" # escapeJson(profile.approvalStatus) # "\","
      # "\"createdAt\":" # Int.toText(profile.createdAt) # ","
      # "\"updatedAt\":" # Int.toText(profile.updatedAt)
      # "}";
  };

  public func decodeFundingReadiness(json : Text) : FR.FundedReadinessState {
    {
      id = extractTextField(json, "id");
      clientBusinessId = extractTextField(json, "clientBusinessId");
      verticalProfileId = extractTextField(json, "verticalProfileId");
      legalBusinessName = extractTextField(json, "legalBusinessName");
      ein = extractTextField(json, "ein");
      entityType = extractTextField(json, "entityType");
      yearsInBusiness = extractNatField(json, "yearsInBusiness");
      monthlyRevenue = extractNatField(json, "monthlyRevenue");
      bankStatementsAvailable = extractBoolField(json, "bankStatementsAvailable");
      creditScoreRange = extractTextField(json, "creditScoreRange");
      businessBankAccount = extractBoolField(json, "businessBankAccount");
      businessAddress = extractTextField(json, "businessAddress");
      website = extractTextField(json, "website");
      emailDomain = extractTextField(json, "emailDomain");
      dunsStatus = extractTextField(json, "dunsStatus");
      experianBusinessStatus = extractTextField(json, "experianBusinessStatus");
      equifaxBusinessStatus = extractTextField(json, "equifaxBusinessStatus");
      tradeLines = extractNatField(json, "tradeLines");
      existingDebt = extractNatField(json, "existingDebt");
      equipmentNeeds = jsonToTextArr(json, "equipmentNeeds");
      marketingCapitalNeed = extractNatField(json, "marketingCapitalNeed");
      taxReturnsAvailable = extractBoolField(json, "taxReturnsAvailable");
      documentsUploaded = jsonToTextArr(json, "documentsUploaded");
      industrySpecificFundingNeeds = jsonToTextArr(json, "industrySpecificFundingNeeds");
      overallReadinessScore = extractNatField(json, "overallReadinessScore");
      credibilityScore = extractNatField(json, "credibilityScore");
      revenueReadinessScore = extractNatField(json, "revenueReadinessScore");
      documentScore = extractNatField(json, "documentScore");
      actionPlan = jsonToTextArr(json, "actionPlan");
      approvalStatus = extractTextField(json, "approvalStatus");
      createdAt = extractIntField(json, "createdAt");
      updatedAt = extractIntField(json, "updatedAt");
    };
  };

}
