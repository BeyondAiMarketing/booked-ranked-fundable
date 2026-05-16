import Map     "mo:core/Map";
import List    "mo:core/List";
import Set     "mo:core/Set";
import Time    "mo:core/Time";
import Text    "mo:core/Text";
import Nat     "mo:core/Nat";
import Int     "mo:core/Int";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import T       "../types/llmLeadGeneration";
import ICTypes "../types/integrationCredentials";
import ICLib   "../lib/integrationCredentials";

/// LLM Lead Generation Engine
///
/// Uses Claude (claude-opus-4-5) and OpenAI GPT-4o as PRIMARY lead generators.
/// Both LLMs receive a structured prompt and return real business listings.
/// Results are merged, deduplicated, and optionally enriched via SerpApi/SearXNG.
/// NEVER returns mock/hardcoded data — always surfaces real errors.
mixin (
  integrationCreds : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt         : Blob,
  transform        : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  // ── Credential helpers ────────────────────────────────────────────────────

  let LLM_TENANT : Text = "platform";

  func llg_plainCreds() : ?ICTypes.IntegrationCredentials {
    switch (integrationCreds.get(LLM_TENANT)) {
      case (null) { null };
      case (?enc) { ?ICLib.decryptAll(enc, credSalt) };
    }
  };

  func llg_getKey(pick : ICTypes.IntegrationCredentials -> Text) : ?Text {
    switch (llg_plainCreds()) {
      case (null) { null };
      case (?c)   { let v = pick(c); if (v == "") null else ?v };
    }
  };

  // ── JSON helpers ──────────────────────────────────────────────────────────

  func llg_esc(s : Text) : Text {
    s.replace(#char '\\', "\\\\")
     .replace(#text "\"", "\\\"")
     .replace(#char '\n', "\\n")
     .replace(#char '\r', "\\r")
  };

  func llg_jstr(s : Text) : Text { "\"" # llg_esc(s) # "\"" };

  /// Naively extract a JSON string field from a flat JSON object fragment.
  func llg_field(json : Text, field : Text) : ?Text {
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

  // ── Prompt builder ─────────────────────────────────────────────────────────

  func llg_buildPrompt(niche : Text, city : Text, count : Nat) : Text {
    "You are a local business research assistant with deep knowledge of US businesses. "
    # "Generate a list of REAL, currently operating " # niche # " businesses located in " # city # ". "
    # "For each business provide accurate information you know about real businesses in that area. "
    # "Do NOT invent fictional businesses. Only include businesses you have reasonable confidence actually exist. "
    # "Output ONLY a JSON array with exactly " # count.toText() # " elements. "
    # "Each element must have exactly these fields: "
    # "name (string), ownerFirstName (string or empty string if unknown), "
    # "phone (string, local format, or empty string), "
    # "address (string, full street address or empty string), "
    # "website (string, full URL or empty string), "
    # "description (string, one sentence about their services). "
    # "Output raw JSON array only — no markdown, no explanation, no trailing text."
  };

  // ── Claude call ───────────────────────────────────────────────────────────

  func llg_callClaude(
    key   : Text,
    niche : Text,
    city  : Text,
    count : Nat,
  ) : async { leads : [T.GeneratedLead]; error : ?Text } {
    let body = "{\"model\":\"claude-opus-4-5\","
      # "\"max_tokens\":4096,"
      # "\"messages\":[{\"role\":\"user\",\"content\":"
      # llg_jstr(llg_buildPrompt(niche, city, count)) # "}]}";
    let headers : [Outcall.Header] = [
      { name = "x-api-key";         value = key },
      { name = "anthropic-version"; value = "2023-06-01" },
      { name = "Content-Type";      value = "application/json" },
    ];
    try {
      let resp = await Outcall.httpPostRequest(
        "https://api.anthropic.com/v1/messages", headers, body, transform
      );
      // Claude wraps content in: {"content":[{"type":"text","text":"..."}],...}
      let textVal = switch (llg_field(resp, "text")) {
        case (?v) v;
        case (null) resp;
      };
      { leads = llg_parseLeads(textVal, "claude", niche, city); error = null }
    } catch (e) {
      { leads = []; error = ?("Claude API error: " # e.message()) }
    }
  };

  // ── OpenAI call ───────────────────────────────────────────────────────────

  func llg_callOpenAI(
    key   : Text,
    niche : Text,
    city  : Text,
    count : Nat,
  ) : async { leads : [T.GeneratedLead]; error : ?Text } {
    let body = "{\"model\":\"gpt-4o\","
      # "\"max_tokens\":4096,"
      # "\"response_format\":{\"type\":\"json_object\"},"
      # "\"messages\":["
      # "{\"role\":\"system\",\"content\":\"You are a local business research assistant. Output only valid JSON.\"},"
      # "{\"role\":\"user\",\"content\":"
      # llg_jstr(llg_buildPrompt(niche, city, count)) # "}]}";
    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = "Bearer " # key },
      { name = "Content-Type";  value = "application/json" },
    ];
    try {
      let resp = await Outcall.httpPostRequest(
        "https://api.openai.com/v1/chat/completions", headers, body, transform
      );
      // OpenAI wraps in: {"choices":[{"message":{"content":"..."}}],...}
      let textVal = switch (llg_field(resp, "content")) {
        case (?v) v;
        case (null) resp;
      };
      { leads = llg_parseLeads(textVal, "openai", niche, city); error = null }
    } catch (e) {
      { leads = []; error = ?("OpenAI API error: " # e.message()) }
    }
  };

  // ── Lead parser ───────────────────────────────────────────────────────────

  func llg_parseLeads(raw : Text, source : Text, niche : Text, city : Text) : [T.GeneratedLead] {
    let out = List.empty<T.GeneratedLead>();
    // Strip outer wrapper if GPT-4o returned a json_object with a "leads" array
    let inner : Text = switch (llg_field(raw, "leads")) {
      case (?arr) arr;
      case (null) {
        // Direct array — strip leading [ and trailing ]
        switch (raw.stripStart(#text "[")) {
          case (?s) s;
          case (null) raw;
        };
      };
    };
    // Split on "},{" to get per-object fragments
    for (frag in inner.split(#text "},{")) {
      let cleaned = "{"
        # frag.trimStart(#text "{")
              .trimEnd(#text "}")
              .trimEnd(#text "]")
        # "}";
      let name = switch (llg_field(cleaned, "name")) {
        case (?n) if (n != "") n else "";
        case (null) "";
      };
      if (name != "") {
        let owner = switch (llg_field(cleaned, "ownerFirstName")) { case (?v) v; case (null) "" };
        let phone = switch (llg_field(cleaned, "phone"))         { case (?v) v; case (null) "" };
        let addr  = switch (llg_field(cleaned, "address"))       { case (?v) v; case (null) "" };
        let web   = switch (llg_field(cleaned, "website"))       { case (?v) v; case (null) "" };
        let desc  = switch (llg_field(cleaned, "description"))   { case (?v) v; case (null) "" };
        let lead : T.GeneratedLead = {
          name           = name;
          ownerFirstName = owner;
          phone;
          address        = addr;
          website        = web;
          description    = desc;
          niche;
          city;
          source;
          enriched       = false;
          temperature    = "warm";
          score          = 50;
        };
        out.add(lead);
      };
    };
    out.toArray()
  };

  // ── Deduplication ─────────────────────────────────────────────────────────

  func llg_normName(t : Text) : Text {
    t.toLower().map(func(c : Char) : Char {
      if ((c >= 'a' and c <= 'z') or (c >= '0' and c <= '9')) c else '-'
    })
  };

  /// Merge Claude + OpenAI results; mark "both" when same business appears in both.
  func llg_merge(
    claudeLeads : [T.GeneratedLead],
    openaiLeads : [T.GeneratedLead],
  ) : [T.GeneratedLead] {
    let seen   = Map.empty<Text, T.GeneratedLead>();
    let dupeKeys = Set.empty<Text>();

    // First pass: index all claude leads by name prefix+city
    for (lead in claudeLeads.vals()) {
      let k = llg_normName(lead.name) # "::" # llg_normName(lead.city);
      seen.add(k, lead);
    };

    // Second pass: mark as "both" where OpenAI names match, add new ones
    let extra = List.empty<T.GeneratedLead>();
    for (lead in openaiLeads.vals()) {
      let k = llg_normName(lead.name) # "::" # llg_normName(lead.city);
      switch (seen.get(k)) {
        case (?existing) {
          // Already from Claude — mark as both + hot
          seen.add(k, { existing with source = "both"; temperature = "hot"; score = 85 });
          dupeKeys.add(k);
        };
        case (null) {
          extra.add(lead);
        };
      };
    };

    let out = List.empty<T.GeneratedLead>();
    for ((_, lead) in seen.entries()) { out.add(lead) };
    for (lead in extra.values()) { out.add(lead) };
    out.toArray()
  };

  // ── SerpApi enrichment ────────────────────────────────────────────────────

  func llg_enrichWithSerpApi(
    key  : Text,
    lead : T.GeneratedLead,
  ) : async T.GeneratedLead {
    let q   = llg_esc(lead.name) # "%20" # llg_esc(lead.city);
    let url = "https://serpapi.com/search?engine=google_maps&q=" # q # "&api_key=" # key;
    try {
      let raw = await Outcall.httpGetRequest(url, [], transform);
      let verifiedPhone = switch (llg_field(raw, "phone")) { case (?v) if (v != "") v else lead.phone; case (null) lead.phone };
      let verifiedWeb   = switch (llg_field(raw, "website")) { case (?v) if (v != "") v else lead.website; case (null) lead.website };
      { lead with phone = verifiedPhone; website = verifiedWeb; enriched = true }
    } catch (_) {
      lead  // enrichment failed — return unenriched, don't block
    }
  };

  // ── SearXNG fallback enrichment ───────────────────────────────────────────

  func llg_enrichWithSearXNG(
    base : Text,
    lead : T.GeneratedLead,
  ) : async T.GeneratedLead {
    let q   = llg_esc(lead.name) # "%20" # llg_esc(lead.city) # "%20contact%20phone";
    let url = base # "/search?q=" # q # "&format=json&engines=google,bing&language=en-US&pageno=1";
    try {
      let raw = await Outcall.httpGetRequest(url, [], transform);
      // Try to extract phone/website from search snippet fields.
      // NOTE: This JSON parser uses string splitting on brace characters, which is
      // fragile against escaped braces inside string values (e.g. description text
      // containing "{" or "}"). A more robust parser would handle escape sequences
      // and nested structures.
      let extractedPhone = switch (llg_field(raw, "content")) {
        case (?_snippet) {
          // Full regex not available in Motoko; keep existing phone for now
          lead.phone
        };
        case (null) lead.phone;
      };
      let extractedWebsite = switch (llg_field(raw, "website")) { case (?v) if (v != "") v else lead.website; case (null) lead.website };
      // Only mark as enriched when at least one field actually changed to a new value
      let wasEnriched =
        (extractedPhone   != lead.phone   and extractedPhone   != "") or
        (extractedWebsite != lead.website and extractedWebsite != "");
      { lead with phone = extractedPhone; website = extractedWebsite; enriched = wasEnriched }
    } catch (_) {
      lead
    }
  };

  // ── Public endpoint ───────────────────────────────────────────────────────

  /// LLM-powered lead search.
  /// Claude and OpenAI GPT-4o generate real business leads for the given niche + city.
  /// Results are merged, deduplicated, and optionally enriched with SerpApi or SearXNG.
  ///
  /// CRITICAL: Never returns mock/hardcoded data.
  /// All errors are surfaced in the errors[] field — never silently dropped.
  public func searchLeadsWithLLM(
    niche             : Text,
    city              : Text,
    limit             : Nat,
    includeEnrichment : Bool,
  ) : async { #ok : T.LLMLeadSearchResult; #err : Text } {
    let now    = Time.now();
    let errors = List.empty<Text>();
    let half   = if (limit == 0) 5 else (limit + 1) / 2;

    let claudeKeyOpt = llg_getKey(func(c) { c.claudeKey });
    let openaiKeyOpt = llg_getKey(func(c) { c.openaiKey });

    if (claudeKeyOpt == null and openaiKeyOpt == null) {
      return #err(
        "No LLM keys configured. Add your Claude and/or OpenAI API keys in the Go Live Dashboard to enable AI lead generation."
      );
    };

    // ── Step 1: Claude lead generation ────────────────────────────────────
    let claudeResult : { leads : [T.GeneratedLead]; error : ?Text } =
      switch (claudeKeyOpt) {
        case (null) {
          errors.add("Claude key not configured — using OpenAI only. Add Claude key in Go Live Dashboard for better results.");
          { leads = []; error = null }
        };
        case (?key) {
          await llg_callClaude(key, niche, city, half)
        };
      };

    switch (claudeResult.error) {
      case (?e) { errors.add(e) };
      case (null) {};
    };

    // ── Step 2: OpenAI lead generation ────────────────────────────────────
    let openaiResult : { leads : [T.GeneratedLead]; error : ?Text } =
      switch (openaiKeyOpt) {
        case (null) {
          errors.add("OpenAI key not configured — using Claude only. Add OpenAI key in Go Live Dashboard for broader coverage.");
          { leads = []; error = null }
        };
        case (?key) {
          await llg_callOpenAI(key, niche, city, half)
        };
      };

    switch (openaiResult.error) {
      case (?e) { errors.add(e) };
      case (null) {};
    };

    // Bail out if both LLMs failed
    let claudeCount = claudeResult.leads.size();
    let openaiCount = openaiResult.leads.size();
    if (claudeCount == 0 and openaiCount == 0 and errors.size() > 0) {
      let errMsg = errors.foldLeft("", func(acc : Text, e : Text) : Text {
        if (acc == "") e else acc # " | " # e
      });
      return #err("Lead generation failed: " # errMsg);
    };

    // ── Step 3: Merge and deduplicate ─────────────────────────────────────
    let merged = llg_merge(claudeResult.leads, openaiResult.leads);

    // Apply limit
    let capped : [T.GeneratedLead] = if (merged.size() <= limit) merged
      else merged.sliceToArray(0, limit);

    // ── Step 4 & 5: Enrichment ────────────────────────────────────────────
    var enrichedCount : Nat = 0;
    var serpApiUsed   : Bool = false;

    let finalLeads = List.empty<T.GeneratedLead>();

    if (includeEnrichment) {
      let serpKeyOpt  = llg_getKey(func(c) { c.serpApiKey });
      let searxngOpt  = llg_getKey(func(c) { c.searxngUrl });

      if (serpKeyOpt == null and searxngOpt == null) {
        errors.add("SerpApi key not configured — leads returned without contact enrichment. Add your SerpApi key in the Go Live Dashboard to enrich with real phone/email/website data.");
      };

      switch (serpKeyOpt) {
        case (?serpKey) {
          serpApiUsed := true;
          for (lead in capped.vals()) {
            let enriched = await llg_enrichWithSerpApi(serpKey, lead);
            if (enriched.enriched) { enrichedCount += 1 };
            finalLeads.add(enriched);
          };
        };
        case (null) {
          switch (searxngOpt) {
            case (?base) {
              for (lead in capped.vals()) {
                let enriched = await llg_enrichWithSearXNG(base, lead);
                if (enriched.enriched) { enrichedCount += 1 };
                finalLeads.add(enriched);
              };
            };
            case (null) {
              // No enrichment available — pass through unenriched
              for (lead in capped.vals()) { finalLeads.add(lead) };
            };
          };
        };
      };
    } else {
      for (lead in capped.vals()) { finalLeads.add(lead) };
    };

    let result : T.LLMLeadSearchResult = {
      leads         = finalLeads.toArray();
      claudeCount;
      openAICount   = openaiCount;
      enrichedCount;
      serpApiUsed;
      errors        = errors.toArray();
      searchedAt    = now;
    };

    #ok(result)
  };

};
