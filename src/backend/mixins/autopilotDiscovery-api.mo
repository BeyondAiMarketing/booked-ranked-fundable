import Map           "mo:core/Map";
import List          "mo:core/List";
import Set           "mo:core/Set";
import Time          "mo:core/Time";
import Timer         "mo:core/Timer";
import Text          "mo:core/Text";
import Nat           "mo:core/Nat";
import Int           "mo:core/Int";
import Runtime       "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall       "mo:caffeineai-http-outcalls/outcall";
import T             "../types/autopilotDiscovery";
import ICTypes       "../types/integrationCredentials";
import ICLib         "../lib/integrationCredentials";
import ALT           "../types/aiLeadAudit";
import SecretManager "../lib/secretManager";

/// Autopilot Daily Discovery Engine
///
/// Schedules a recurring timer (default every 86400 seconds) that fires a
/// multi-city, dual-model lead discovery run.  Claude searches cities[0] and
/// cities[1]; OpenAI searches cities[2] and cities[3].  Each model receives
/// REAL SearXNG listings as grounding data and returns structured JSON —
/// never invented business names.
///
/// After scoring, results are merged, deduplicated by phone or website domain,
/// and staged as LeadAuditJob records (via shared leadAuditJobs map).
/// Email enrichment is attempted via Hunter.io when a key is present;
/// otherwise leads are marked "enrichment-pending".
mixin (
  accessControlState  : AccessControl.AccessControlState,
  integrationCreds    : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt            : Blob,
  discoveryJobs       : List.List<T.ScheduledDiscoveryJob>,
  discoveryConfig     : { var v : T.DiscoveryConfig },
  leadAuditJobs       : Map.Map<Text, ALT.LeadAuditJob>,
  leads               : Map.Map<Text, Map.Map<Text, {
    id : Text; tenantId : Text; name : Text; email : Text;
    phone : Text; niche : Text; status : Text; source : Text;
    notes : Text; agentSubscriptions : [Text]; createdAt : Time.Time;
  }>>,
  transform           : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
  secretState         : ?SecretManager.State,
) {

  // ── Constants ─────────────────────────────────────────────────────────────────

  let APD_PLATFORM_TENANT : Text = "platform";

  /// Anti-hallucination system prompt — models score real data only.
  let SYSTEM_PROMPT : Text =
    "You are a B2B lead analyst for a local service business SaaS platform. " #
    "You will receive REAL business listings sourced from a live search engine. " #
    "Score ONLY the businesses listed — do NOT invent, assume, or fabricate any " #
    "business name, phone, website, or address. " #
    "If a field is missing from the input, return null for that field. " #
    "Return a JSON array where each element has exactly these fields: " #
    "businessName (string, from input only), " #
    "phone (string or null), " #
    "website (string or null), " #
    "email (string or null), " #
    "address (string or null), " #
    "score (integer 0-100: website=25pts, reviews=25pts, social=25pts, GBP=25pts), " #
    "tier (Hot if score>=70, Warm if score>=40, else Cold), " #
    "gapFlags (array of: no_website no_phone no_reviews no_social no_gbp). " #
    "Output raw JSON array only — no markdown, no explanation.";

  // ── Auth helpers ──────────────────────────────────────────────────────────────

  func apd_assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  func apd_assertUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
  };

  // ── Credential helpers ────────────────────────────────────────────────────────

  func apd_plainCreds() : ?ICTypes.IntegrationCredentials {
    switch (integrationCreds.get(APD_PLATFORM_TENANT)) {
      case (null) { null };
      case (?enc) { ?ICLib.decryptAllWithSecret(enc, credSalt, secretState) };
    }
  };

  func apd_getSearxng() : ?Text {
    switch (apd_plainCreds()) {
      case (null)   { null };
      case (?c)     { if (c.searxngUrl   == "") null else ?c.searxngUrl   };
    }
  };

  func apd_getClaude() : ?Text {
    switch (apd_plainCreds()) {
      case (null) { null };
      case (?c)   { if (c.claudeKey == "") null else ?c.claudeKey };
    }
  };

  func apd_getOpenAi() : ?Text {
    switch (apd_plainCreds()) {
      case (null) { null };
      case (?c)   { if (c.openaiKey == "") null else ?c.openaiKey };
    }
  };

  func apd_getHunter() : ?Text {
    switch (apd_plainCreds()) {
      case (null) { null };
      case (?c)   { if (c.hunterApiKey == "") null else ?c.hunterApiKey };
    }
  };

  // ── Text / JSON helpers ────────────────────────────────────────────────────────

  func apd_escape(s : Text) : Text {
    s.replace(#char '\\', "\\\\")
     .replace(#text "\"", "\\" # "\"")
     .replace(#char '\n', "\\n")
     .replace(#char '\r', "\\r")
  };

  func apd_jstr(s : Text) : Text { "\"" # apd_escape(s) # "\"" };

  /// Naively extract a JSON string field from a flat JSON object snippet.
  /// Splits on the key and reads the value token that follows.
  func apd_field(json : Text, field : Text) : ?Text {
    let needle = "\"" # field # "\"";
    let segs   = json.split(#text needle);
    var afterKey = false;
    var result : ?Text = null;
    for (seg in segs) {
      if (afterKey and result == null) {
        // seg starts with :  "value"  or  : null  or  : 42
        let rest = seg.trimStart(#text " ")
                      .trimStart(#text ":")
                      .trimStart(#text " ");
        if (rest.startsWith(#text "\"")) {
          // string value — read until closing quote
          let inner = switch (rest.stripStart(#text "\"")) {
            case (?s) s;
            case (null) rest;
          };
          switch (inner.split(#text "\"").next()) {
            case (?v) { result := ?v };
            case (null) {};
          };
        };
        // null / number → result stays null
      };
      afterKey := true;
    };
    result
  };

  /// Parse a score integer from a JSON snippet field.
  func apd_score(json : Text) : Nat {
    switch (apd_field(json, "score")) {
      case (null) { 0 };
      case (?s)   {
        switch (Nat.fromText(s.trim(#char ' '))) {
          case (?n) { if (n > 100) 100 else n };
          case (null) { 0 };
        }
      };
    }
  };

  func apd_tier(score : Nat) : Text {
    if (score >= 70) "Hot" else if (score >= 40) "Warm" else "Cold"
  };

  /// Naive parse of an AI model JSON array response.
  /// Splits on "},{" to get per-object fragments.
  func apd_parseResponse(raw : Text, model : Text, city : Text, niche : Text) : [T.DiscoveredLead] {
    let out = List.empty<T.DiscoveredLead>();
    // Strip leading [ and trailing ]
    let inner = switch (raw.stripStart(#text "[")) {
      case (?s) s;
      case (null) raw;
    };
    for (frag in inner.split(#text "},{")) {
      let cleaned = "{" # frag.trimStart(#text "{").trimEnd(#text "}").trimEnd(#text "]") # "}";
      let biz = switch (apd_field(cleaned, "businessName")) {
        case (?b) if (b != "") b else "";
        case (null) "";
      };
      if (biz != "") {
        let sc   = apd_score(cleaned);
        let tier = switch (apd_field(cleaned, "tier")) {
          case (?t) if (t == "Hot" or t == "Warm" or t == "Cold") t else apd_tier(sc);
          case (null) apd_tier(sc);
        };
        let lead : T.DiscoveredLead = {
          businessName     = biz;
          phone            = apd_field(cleaned, "phone");
          website          = apd_field(cleaned, "website");
          email            = apd_field(cleaned, "email");
          address          = apd_field(cleaned, "address");
          score            = sc;
          tier;
          gapFlags         = [];
          model;
          city;
          niche;
          enrichmentStatus = "enrichment-pending";
        };
        out.add(lead);
      };
    };
    out.toArray()
  };

  // ── Dedup helpers ─────────────────────────────────────────────────────────────

  func apd_normName(t : Text) : Text {
    t.toLower().map(func(c : Char) : Char {
      if ((c >= 'a' and c <= 'z') or (c >= '0' and c <= '9')) c else '-'
    })
  };

  func apd_apexDomain(url : Text) : Text {
    let noScheme = switch (url.stripStart(#text "https://")) {
      case (?s) s;
      case (null) {
        switch (url.stripStart(#text "http://")) {
          case (?s) s;
          case (null) url;
        }
      };
    };
    let noWww = switch (noScheme.stripStart(#text "www.")) {
      case (?s) s;
      case (null) noScheme;
    };
    switch (noWww.split(#char '/').next()) {
      case (?h) h;
      case (null) noWww;
    }
  };

  func apd_normPhone(p : Text) : Text {
    p.map(func(c : Char) : Char { if (c >= '0' and c <= '9') c else '-' })
     .replace(#text "-", "")
  };

  func apd_dedupKey(lead : T.DiscoveredLead) : Text {
    switch (lead.phone) {
      case (?p) {
        let np = apd_normPhone(p);
        if (np != "") return "ph:" # np;
      };
      case (null) {};
    };
    switch (lead.website) {
      case (?w) {
        let d = apd_apexDomain(w);
        if (d != "") return "dom:" # d;
      };
      case (null) {};
    };
    "name:" # apd_normName(lead.businessName) # ":" # apd_normName(lead.city)
  };

  func apd_dedup(
    claudeLeads : [T.DiscoveredLead],
    openaiLeads : [T.DiscoveredLead],
  ) : { leads : [T.DiscoveredLead]; duplicates : Nat } {
    let seen  = Set.empty<Text>();
    let out   = List.empty<T.DiscoveredLead>();
    var dupes : Nat = 0;
    for (lead in claudeLeads.concat(openaiLeads).vals()) {
      let k = apd_dedupKey(lead);
      if (seen.contains(k)) { dupes += 1 }
      else { seen.add(k); out.add(lead) };
    };
    { leads = out.toArray(); duplicates = dupes }
  };

  // ── SearXNG fetch ─────────────────────────────────────────────────────────────

  func apd_searxngUrl(base : Text, niche : Text, city : Text) : Text {
    // URL-encode spaces as %20 in query param
    let q = apd_escape(niche) # "%20" # apd_escape(city) # "%20local%20business";
    base # "/search?q=" # q # "&format=json&engines=google,bing&language=en-US&pageno=1"
  };

  func apd_fetchSearxng(base : Text, niche : Text, city : Text) : async Text {
    try { await Outcall.httpGetRequest(apd_searxngUrl(base, niche, city), [], transform) }
    catch (_) { "" }
  };

  // ── AI calls ──────────────────────────────────────────────────────────────────

  func apd_userMsg(raw : Text, city : Text, niche : Text, limit : Nat) : Text {
    "Here are up to " # limit.toText() # " REAL " # niche # " businesses in " # city
    # " from a live search engine. Score ONLY these — do NOT invent any business.\n\n"
    # "RAW SEARCH DATA:\n" # raw
  };

  func apd_callClaude(key : Text, raw : Text, city : Text, niche : Text, limit : Nat) : async [T.DiscoveredLead] {
    let body = "{\"model\":\"claude-3-5-haiku-20241022\","
      # "\"max_tokens\":4096,"
      # "\"system\":" # apd_jstr(SYSTEM_PROMPT) # ","
      # "\"messages\":[{\"role\":\"user\",\"content\":"
      # apd_jstr(apd_userMsg(raw, city, niche, limit)) # "}]}";
    let headers : [Outcall.Header] = [
      { name = "x-api-key";         value = key },
      { name = "anthropic-version"; value = "2023-06-01" },
      { name = "Content-Type";      value = "application/json" },
    ];
    try {
      let resp = await Outcall.httpPostRequest("https://api.anthropic.com/v1/messages", headers, body, transform);
      // Claude wraps output in: {"content":[{"type":"text","text":"..."}],...}
      let textVal = switch (apd_field(resp, "text")) { case (?v) v; case (null) resp };
      apd_parseResponse(textVal, "claude", city, niche)
    } catch (_) { [] }
  };

  func apd_callOpenAi(key : Text, raw : Text, city : Text, niche : Text, limit : Nat) : async [T.DiscoveredLead] {
    let body = "{\"model\":\"gpt-4o-mini\","
      # "\"max_tokens\":4096,"
      # "\"messages\":["
      # "{\"role\":\"system\",\"content\":" # apd_jstr(SYSTEM_PROMPT) # "},"
      # "{\"role\":\"user\",\"content\":"
      # apd_jstr(apd_userMsg(raw, city, niche, limit)) # "}]}";
    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = "Bearer " # key },
      { name = "Content-Type";  value = "application/json" },
    ];
    try {
      let resp = await Outcall.httpPostRequest("https://api.openai.com/v1/chat/completions", headers, body, transform);
      // OpenAI wraps output in: {"choices":[{"message":{"content":"..."}}],...}
      let textVal = switch (apd_field(resp, "content")) { case (?v) v; case (null) resp };
      apd_parseResponse(textVal, "openai", city, niche)
    } catch (_) { [] }
  };

  // ── Hunter.io enrichment ──────────────────────────────────────────────────────

  func apd_enrichEmail(hunterKey : Text, website : Text) : async ?Text {
    if (website == "") return null;
    let domain = apd_apexDomain(website);
    let url = "https://api.hunter.io/v2/domain-search?domain=" # domain
              # "&api_key=" # hunterKey # "&limit=1";
    try {
      let raw = await Outcall.httpGetRequest(url, [], transform);
      apd_field(raw, "value")   // Hunter: {"data":{"emails":[{"value":"..."}],...}}
    } catch (_) { null }
  };

  // ── Internal lead creation ────────────────────────────────────────────────────

  type ApdLead = {
    id : Text; tenantId : Text; name : Text; email : Text;
    phone : Text; niche : Text; status : Text; source : Text;
    notes : Text; agentSubscriptions : [Text]; createdAt : Time.Time;
  };

  func apd_createLead(lead : ApdLead) {
    let tenantLeads = switch (leads.get(lead.tenantId)) {
      case (?existing) { existing };
      case (null)      { Map.empty<Text, ApdLead>() };
    };
    tenantLeads.add(lead.id, lead);
    leads.add(lead.tenantId, tenantLeads);
  };

  // ── Core discovery tick ───────────────────────────────────────────────────────

  func apd_runDiscovery() : async () {
    let cfg = discoveryConfig.v;
    if (not cfg.enabled) return;

    let now   = Time.now();
    let jobId = "apd-" # now.toText();
    let limit = if (cfg.leadsPerCity > 50) 50 else cfg.leadsPerCity;
    let cap   = if (cfg.dailyCap == 0) 1000 else cfg.dailyCap;

    // Assign cities: Claude gets [0,1], OpenAI gets [2,3]
    let n = cfg.cities.size();
    let claudeCities : [Text] = switch (n) {
      case 0 { [] };
      case 1 { [cfg.cities[0], cfg.cities[0]] };
      case _ { [cfg.cities[0], if (n > 1) cfg.cities[1] else cfg.cities[0]] };
    };
    let openaiCities : [Text] = switch (n) {
      case 0 { [] };
      case 1 { [cfg.cities[0], cfg.cities[0]] };
      case 2 { [cfg.cities[0], cfg.cities[1]] };
      case 3 { [cfg.cities[2], cfg.cities[2]] };
      case _ { [cfg.cities[2], cfg.cities[3]] };
    };

    // Record running job
    let runningJob : T.ScheduledDiscoveryJob = {
      id = jobId; startedAt = now; completedAt = null;
      status = "running"; config = cfg;
      claudeLeads = 0; openaiLeads = 0;
      totalBeforeDedup = 0; duplicatesRemoved = 0;
      totalCreated = 0; enrichedCount = 0; enrichPending = 0;
      errorMessage = null;
    };
    discoveryJobs.add(runningJob);

    let searxngOpt   = apd_getSearxng();
    let claudeKeyOpt = apd_getClaude();
    let openAiKeyOpt = apd_getOpenAi();
    let hunterOpt    = apd_getHunter();

    // ── SearXNG: fetch raw listings for each city ─────────────────────────────

    let claudeRaws = List.empty<(Text, Text)>();  // (city, raw)
    let openaiRaws = List.empty<(Text, Text)>();

    switch (searxngOpt) {
      case (null) {};
      case (?base) {
        for (city in claudeCities.vals()) {
          let r = await apd_fetchSearxng(base, cfg.niche, city);
          claudeRaws.add((city, r));
        };
        for (city in openaiCities.vals()) {
          let r = await apd_fetchSearxng(base, cfg.niche, city);
          openaiRaws.add((city, r));
        };
      };
    };

    // ── AI scoring ────────────────────────────────────────────────────────────

    let claudeOut = List.empty<T.DiscoveredLead>();
    let openaiOut = List.empty<T.DiscoveredLead>();

    switch (claudeKeyOpt) {
      case (null) {};
      case (?key) {
        for ((city, raw) in claudeRaws.values()) {
          let scored = await apd_callClaude(key, raw, city, cfg.niche, limit);
          for (l in scored.vals()) { claudeOut.add(l) };
        };
      };
    };

    switch (openAiKeyOpt) {
      case (null) {};
      case (?key) {
        for ((city, raw) in openaiRaws.values()) {
          let scored = await apd_callOpenAi(key, raw, city, cfg.niche, limit);
          for (l in scored.vals()) { openaiOut.add(l) };
        };
      };
    };

    // ── Dedup ─────────────────────────────────────────────────────────────────

    let claudeArr = claudeOut.toArray();
    let openaiArr = openaiOut.toArray();
    let merged    = apd_dedup(claudeArr, openaiArr);

    // ── Enrichment + staging ──────────────────────────────────────────────────

    var created    : Nat = 0;
    var enriched   : Nat = 0;
    var enrichPend : Nat = 0;
    let now2 = Time.now();

    for (disc in merged.leads.vals()) {
      if (created < cap) {
        var finalEmail   : ?Text = disc.email;
        var enrichStatus : Text  = "enrichment-skipped";

        switch (hunterOpt) {
          case (null) {
            enrichStatus := "enrichment-pending";
            enrichPend   += 1;
          };
          case (?hKey) {
            switch (disc.website) {
              case (null) {
                enrichStatus := "enrichment-pending";
                enrichPend   += 1;
              };
              case (?url) {
                let found = await apd_enrichEmail(hKey, url);
                switch (found) {
                  case (?email) {
                    finalEmail   := ?email;
                    enrichStatus := "enriched";
                    enriched     += 1;
                  };
                  case (null) {
                    enrichStatus := "enrichment-pending";
                    enrichPend   += 1;
                  };
                };
              };
            };
          };
        };

        // Stage as LeadAuditJob
        let auditId = "apd-job-" # jobId # "-" # created.toText();
        let auditJob : ALT.LeadAuditJob = {
          id           = auditId;
          tenantId     = APD_PLATFORM_TENANT;
          businessName = disc.businessName;
          websiteUrl   = switch (disc.website) { case (?w) w; case null "" };
          niche        = disc.niche;
          city         = ?disc.city;
          phone        = disc.phone;
          email        = finalEmail;
          status       = "pending";
          stageProgress= "queued";
          createdAt    = now2;
          completedAt  = null;
          errorMessage = null;
        };
        leadAuditJobs.add(auditId, auditJob);

        // Write CRM lead
        let crmStatus = switch (disc.tier) {
          case "Hot"  "hot";
          case "Warm" "warm";
          case _      "cold";
        };
        let leadId = "lead-apd-" # jobId # "-" # created.toText();
        apd_createLead({
          id                 = leadId;
          tenantId           = APD_PLATFORM_TENANT;
          name               = disc.businessName;
          email              = switch (finalEmail) { case (?e) e; case null "" };
          phone              = switch (disc.phone) { case (?p) p; case null "" };
          niche              = disc.niche;
          status             = crmStatus;
          source             = "Autopilot Discovery (" # disc.model # ")";
              notes              = "Score: " # disc.score.toText()
                               # " | Tier: " # disc.tier
                               # " | City: " # disc.city
                               # " | Enrichment: " # enrichStatus;
          agentSubscriptions = [];
          createdAt          = now2;
        });

        created += 1;
      };
    };

    // ── Finalise job record ────────────────────────────────────────────────────

    let finalJob : T.ScheduledDiscoveryJob = {
      runningJob with
      completedAt      = ?Time.now();
      status           = "completed";
      claudeLeads      = claudeArr.size();
      openaiLeads      = openaiArr.size();
      totalBeforeDedup = claudeArr.size() + openaiArr.size();
      duplicatesRemoved= merged.duplicates;
      totalCreated     = created;
      enrichedCount    = enriched;
      enrichPending    = enrichPend;
    };
    discoveryJobs.mapInPlace(func(j : T.ScheduledDiscoveryJob) : T.ScheduledDiscoveryJob {
      if (j.id == jobId) finalJob else j
    });
  };

  // ── Timer management ─────────────────────────────────────────────────────────

  let apd_timerId : { var v : ?Nat } = object { public var v : ?Nat = null };

  func apd_startTimer<system>() {
    let dur : Time.Duration = #seconds (discoveryConfig.v.intervalSecs);
    let tid = Timer.recurringTimer<system>(dur, func() : async () {
      await apd_runDiscovery();
    });
    apd_timerId.v := ?tid;
  };

  func apd_stopTimer() {
    switch (apd_timerId.v) {
      case (?tid) { Timer.cancelTimer(tid); apd_timerId.v := null };
      case (null) {};
    };
  };

  // ── Public API ─────────────────────────────────────────────────────────────────

  /// Manually trigger one discovery run now (admin only, for testing).
  public shared ({ caller }) func triggerManualDiscovery() : async Text {
    apd_assertAdmin(caller);
    let id = "apd-manual-" # Time.now().toText();
    await apd_runDiscovery();
    id
  };

  /// List all historical discovery job records.
  public query ({ caller }) func getScheduledDiscoveryJobs() : async [T.ScheduledDiscoveryJob] {
    apd_assertAdmin(caller);
    discoveryJobs.toArray()
  };

  /// Return the most recently stored discovery job, or null if none.
  public query ({ caller }) func getLastDiscoveryJob() : async ?T.ScheduledDiscoveryJob {
    apd_assertAdmin(caller);
    let arr = discoveryJobs.toArray();
    if (arr.size() == 0) null else ?arr[arr.size() - 1]
  };

  /// Return the active discovery configuration.
  public query ({ caller }) func getDiscoveryConfig() : async T.DiscoveryConfig {
    apd_assertUser(caller);
    discoveryConfig.v
  };

  /// Update config (cities, niche, interval, enabled).
  /// Cancels the existing timer and starts a new one if enabled.
  public shared ({ caller }) func updateDiscoveryConfig(config : T.DiscoveryConfig) : async () {
    apd_assertAdmin(caller);
    apd_stopTimer();
    discoveryConfig.v := config;
    if (config.enabled) { apd_startTimer<system>() };
  };

  /// Re-register the recurring timer — call after a canister upgrade to restore
  /// scheduled execution (timers do not survive upgrades on ICP).
  public shared ({ caller }) func resetDiscoveryTimer() : async () {
    apd_assertAdmin(caller);
    apd_stopTimer();
    if (discoveryConfig.v.enabled) { apd_startTimer<system>() };
  };

  // Note: timer is NOT auto-started here because top-level mixin body lacks
  // <system> capability. Call resetDiscoveryTimer() after each canister upgrade
  // to re-register the recurring timer (timers don't survive upgrades on ICP).

};
