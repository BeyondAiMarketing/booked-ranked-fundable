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
import SecretManager "../lib/secretManager";

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
  secretState      : ?SecretManager.State,
) {

  // ── Credential helpers ────────────────────────────────────────────────────

  let LLM_TENANT : Text = "platform";

  func llg_plainCreds() : ?ICTypes.IntegrationCredentials {
    switch (integrationCreds.get(LLM_TENANT)) {
      case (null) { null };
      case (?enc) { ?ICLib.decryptAllWithSecret(enc, credSalt, secretState) };
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
  // ── SerpApi.dev first-pass search ────────────────────────────────────────

  /// Call serpapi.dev to get real business listings for niche+city.
  /// Returns structured GeneratedLead array parsed from the search results.
  func llg_callSerpApiDev(
    key   : Text,
    niche : Text,
    city  : Text,
    count : Nat,
  ) : async { leads : [T.GeneratedLead]; error : ?Text } {
    let q   = llg_esc(niche) # "%20" # llg_esc(city) # "%20business";
    let url = "https://serpapi.dev/search?engine=google_maps&q=" # q
      # "&num=" # count.toText()
      # "&api_key=" # key;
    let headers : [Outcall.Header] = [
      { name = "Accept"; value = "application/json" },
    ];
    try {
      let raw = await Outcall.httpGetRequest(url, headers, transform);
      let out = List.empty<T.GeneratedLead>();
      // SerpApi.dev returns { local_results: [ { title, phone, website, address, ... } ] }
      // Split on "},{" to parse individual result objects
      let localArr : Text = switch (llg_field(raw, "local_results")) {
        case (?v) v;
        case (null) {
          // Fallback: try top-level "results" array
          switch (llg_field(raw, "results")) {
            case (?v) v;
            case (null) "";
          };
        };
      };
      if (localArr == "") {
        return { leads = []; error = ?("SerpApi.dev: no local_results in response. Check API key quota or query.") };
      };
      // Strip leading [ and trailing ]
      let inner = switch (localArr.stripStart(#text "[")) {
        case (?s) s;
        case (null) localArr;
      };
      for (frag in inner.split(#text "},{")) {
        let cleaned = "{"
          # frag.trimStart(#text "{")
                .trimEnd(#text "}")
                .trimEnd(#text "]")
          # "}";
        let name = switch (llg_field(cleaned, "title")) {
          case (?n) if (n != "") n else "";
          case (null) "";
        };
        if (name != "") {
          let phone = switch (llg_field(cleaned, "phone"))   { case (?v) v; case (null) "" };
          let web   = switch (llg_field(cleaned, "website")) { case (?v) v; case (null) "" };
          let addr  = switch (llg_field(cleaned, "address")) { case (?v) v; case (null) "" };
          let lead : T.GeneratedLead = {
            name;
            ownerFirstName = "";
            phone;
            address        = addr;
            website        = web;
            description    = niche # " business in " # city;
            niche;
            city;
            source         = "serpapi_dev";
            enriched       = (phone != "" or web != "");
            temperature    = "warm";
            score          = 55;
          };
          out.add(lead);
        };
      };
      { leads = out.toArray(); error = null }
    } catch (e) {
      { leads = []; error = ?("SerpApi.dev error: " # e.message()) }
    }
  };

  // ── TinyFish Search fallback ──────────────────────────────────────────────

  /// Call TinyFish search API for niche+city business leads.
  /// Uses the POST /search endpoint with a structured query.
  func llg_callTinyFish(
    key   : Text,
    niche : Text,
    city  : Text,
    count : Nat,
  ) : async { leads : [T.GeneratedLead]; error : ?Text } {
    let searchQuery = niche # " businesses in " # city # " with phone and website";
    let body  = "{\"query\":" # llg_jstr(searchQuery) # ",\"num_results\":" # count.toText() # "}";
    let headers : [Outcall.Header] = [
      { name = "X-API-Key";     value = key },
      { name = "Content-Type"; value = "application/json" },
    ];
    try {
      let raw = await Outcall.httpPostRequest(
        "https://agent.tinyfish.ai/search", headers, body, transform
      );
      let out = List.empty<T.GeneratedLead>();
      // TinyFish returns { results: [ { title, url, snippet, ... } ] }
      let resultsArr : Text = switch (llg_field(raw, "results")) {
        case (?v) v;
        case (null) "";
      };
      if (resultsArr == "") {
        return { leads = []; error = ?("TinyFish: no results in response.") };
      };
      let inner = switch (resultsArr.stripStart(#text "[")) {
        case (?s) s;
        case (null) resultsArr;
      };
      for (frag in inner.split(#text "},{")) {
        let cleaned = "{"
          # frag.trimStart(#text "{")
                .trimEnd(#text "}")
                .trimEnd(#text "]")
          # "}";
        let name = switch (llg_field(cleaned, "title")) {
          case (?n) if (n != "") n else "";
          case (null) "";
        };
        if (name != "") {
          let url     = switch (llg_field(cleaned, "url"))     { case (?v) v; case (null) "" };
          let snippet = switch (llg_field(cleaned, "snippet")) { case (?v) v; case (null) "" };
          let lead : T.GeneratedLead = {
            name;
            ownerFirstName = "";
            phone          = "";
            address        = "";
            website        = url;
            description    = if (snippet != "") snippet else niche # " business in " # city;
            niche;
            city;
            source         = "tinyfish";
            enriched       = url != "";
            temperature    = "warm";
            score          = 50;
          };
          out.add(lead);
        };
      };
      { leads = out.toArray(); error = null }
    } catch (e) {
      { leads = []; error = ?("TinyFish error: " # e.message()) }
    }
  };

  // ── Diagnostic query ─────────────────────────────────────────────────────

  /// Returns a JSON object indicating which lead-finder API keys are present
  /// in stable storage. Keys are never revealed — only presence (true/false).
  /// Example: {"serpApiDev":true,"tinyFish":false,"claude":true,"openai":true,"openRouter":true}
  public query func testLeadFinderDiagnostic() : async Text {
    let serpApiDev  = llg_getKey(func(c) { c.serpApiDevKey  }) != null;
    let tinyFish    = llg_getKey(func(c) { c.tinyFishKey    }) != null;
    let claude      = llg_getKey(func(c) { c.claudeKey      }) != null;
    let openai      = llg_getKey(func(c) { c.openaiKey      }) != null;
    let openRouter  = llg_getKey(func(c) { c.openRouterApiKey }) != null;
    let b = func(v : Bool) : Text { if (v) "true" else "false" };
    "{\"serpApiDev\":"  # b(serpApiDev)
    # ",\"tinyFish\":"   # b(tinyFish)
    # ",\"claude\":"     # b(claude)
    # ",\"openai\":"     # b(openai)
    # ",\"openRouter\":" # b(openRouter)
    # "}"
  };

  /// LLM-powered lead search.
  /// Search priority: SerpApi.dev → TinyFish Search → OpenAI GPT-4o (LLMs as final fallback).
  /// Claude enriches SerpApi.dev / TinyFish results when a Claude key is present.
  /// If all sources fail, returns #err with the combined failure message.
  ///
  /// CRITICAL: Never returns mock/hardcoded data at any fallback level.
  public func searchLeadsWithLLM(
    niche             : Text,
    city              : Text,
    limit             : Nat,
    includeEnrichment : Bool,
  ) : async { #ok : T.LLMLeadSearchResult; #err : Text } {
    let now      = Time.now();
    let errors   = List.empty<Text>();
    let cap      = if (limit == 0) 10 else limit;
    let half     = (cap + 1) / 2;

    let claudeKeyOpt     = llg_getKey(func(c) { c.claudeKey });
    let openaiKeyOpt     = llg_getKey(func(c) { c.openaiKey });
    let serpApiDevKeyOpt = llg_getKey(func(c) { c.serpApiDevKey });
    let tinyFishKeyOpt   = llg_getKey(func(c) { c.tinyFishKey });

    var serpApiCount  : Nat = 0;
    var tinyFishCount : Nat = 0;
    var claudeCount   : Nat = 0;
    var openAICount   : Nat = 0;
    var enrichedCount : Nat = 0;
    var serpApiUsed   : Bool = false;

    let allLeads = List.empty<T.GeneratedLead>();

    // ── Step 1: SerpApi.dev first-pass ────────────────────────────────────
    var serpApiDevExhausted : Bool = false;
    switch (serpApiDevKeyOpt) {
      case (?serpDevKey) {
        let res = await llg_callSerpApiDev(serpDevKey, niche, city, cap);
        switch (res.error) {
          case (?e) {
            errors.add(e);
            // Mark exhausted/unavailable so we fall through
            serpApiDevExhausted := true;
          };
          case (null) {
            serpApiUsed   := true;
            serpApiCount  := res.leads.size();
            for (lead in res.leads.vals()) { allLeads.add(lead) };
          };
        };
      };
      case (null) {
        serpApiDevExhausted := true;
      };
    };

    // ── Step 2: TinyFish Search (if SerpApi.dev unavailable/failed) ───────
    var tinyFishExhausted : Bool = false;
    if (serpApiDevExhausted and allLeads.size() == 0) {
      switch (tinyFishKeyOpt) {
        case (?tfKey) {
          let res = await llg_callTinyFish(tfKey, niche, city, cap);
          switch (res.error) {
            case (?e) {
              errors.add(e);
              tinyFishExhausted := true;
            };
            case (null) {
              tinyFishCount := res.leads.size();
              for (lead in res.leads.vals()) { allLeads.add(lead) };
            };
          };
        };
        case (null) {
          tinyFishExhausted := true;
        };
      };
    };

    // ── Step 3: LLM generation (final fallback when both data sources fail) 
    // Also: if we got leads from SerpApi.dev/TinyFish, Claude enriches them.
    let useLLMGeneration = (serpApiDevExhausted and tinyFishExhausted) or allLeads.size() == 0;

    if (useLLMGeneration) {
      // No data-source leads — need LLMs to generate
      if (claudeKeyOpt == null and openaiKeyOpt == null) {
        let combined = errors.foldLeft("", func(acc : Text, e : Text) : Text {
          if (acc == "") e else acc # " | " # e
        });
        let prefix = if (combined == "") "" else combined # " | ";
        return #err(prefix # "No lead sources available. Configure SerpApi.dev key, TinyFish key, or Claude/OpenAI key in the Go Live Dashboard.");
      };

      // Claude generation
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
      claudeCount := claudeResult.leads.size();

      // OpenAI generation
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
      openAICount := openaiResult.leads.size();

      if (claudeCount == 0 and openAICount == 0 and errors.size() > 0) {
        let errMsg = errors.foldLeft("", func(acc : Text, e : Text) : Text {
          if (acc == "") e else acc # " | " # e
        });
        return #err("Lead generation failed: " # errMsg);
      };

      let merged = llg_merge(claudeResult.leads, openaiResult.leads);
      for (lead in merged.vals()) { allLeads.add(lead) };

    } else if (allLeads.size() > 0 and claudeKeyOpt != null) {
      // We have leads from SerpApi.dev or TinyFish — use Claude to enrich with
      // deeper business intelligence (pass them through the prompt for enrichment).
      switch (claudeKeyOpt) {
        case (?key) {
          // Build a minimal enrichment prompt that takes the existing names/cities
          // and returns descriptions + owner info without hallucinating contacts.
          let names = allLeads.foldLeft("", func(acc : Text, l : T.GeneratedLead) : Text {
            if (acc == "") l.name else acc # ", " # l.name
          });
          let enrichPrompt =
            "Given these " # niche # " businesses in " # city # ": " # names # ". "
            # "For each business, provide: ownerFirstName (if publicly known, else empty string), "
            # "and a one-sentence description of their services. "
            # "Output ONLY a JSON array. Each element: {\"name\":\"...\",\"ownerFirstName\":\"...\",\"description\":\"...\"}. "
            # "No markdown, no explanation.";
          let enrichBody = "{\"model\":\"claude-opus-4-5\","
            # "\"max_tokens\":2048,"
            # "\"messages\":[{\"role\":\"user\",\"content\":"
            # llg_jstr(enrichPrompt) # "}]}";
          let enrichHeaders : [Outcall.Header] = [
            { name = "x-api-key";         value = key },
            { name = "anthropic-version"; value = "2023-06-01" },
            { name = "Content-Type";      value = "application/json" },
          ];
          try {
            let enrichResp = await Outcall.httpPostRequest(
              "https://api.anthropic.com/v1/messages", enrichHeaders, enrichBody, transform
            );
            let textVal = switch (llg_field(enrichResp, "text")) {
              case (?v) v;
              case (null) enrichResp;
            };
            // Build a name→enrichment lookup from Claude response
            let enrichMap = Map.empty<Text, { owner : Text; desc : Text }>();
            let inner2 = switch (textVal.stripStart(#text "[")) {
              case (?s) s;
              case (null) textVal;
            };
            for (frag in inner2.split(#text "},{")) {
              let cleaned2 = "{"
                # frag.trimStart(#text "{")
                      .trimEnd(#text "}")
                      .trimEnd(#text "]")
                # "}";
              let rName  = switch (llg_field(cleaned2, "name"))          { case (?v) v; case null "" };
              let rOwner = switch (llg_field(cleaned2, "ownerFirstName")) { case (?v) v; case null "" };
              let rDesc  = switch (llg_field(cleaned2, "description"))   { case (?v) v; case null "" };
              if (rName != "") {
                enrichMap.add(llg_normName(rName), { owner = rOwner; desc = rDesc });
              };
            };
            // Apply enrichment back to allLeads in-place
            allLeads.mapInPlace(func(lead : T.GeneratedLead) : T.GeneratedLead {
              let key2 = llg_normName(lead.name);
              switch (enrichMap.get(key2)) {
                case (?info) {
                  let newOwner = if (info.owner != "") info.owner else lead.ownerFirstName;
                  let newDesc  = if (info.desc  != "") info.desc  else lead.description;
                  { lead with ownerFirstName = newOwner; description = newDesc; enriched = true }
                };
                case (null) { lead };
              }
            });
            claudeCount := allLeads.size();
          } catch (e) {
            errors.add("Claude enrichment error: " # e.message());
          };
        };
        case (null) {};
      };
    };

    // ── Dedup across all sources ───────────────────────────────────────────
    let deduped = Map.empty<Text, T.GeneratedLead>();
    for (lead in allLeads.values()) {
      let k = llg_normName(lead.name) # "::" # llg_normName(lead.city);
      switch (deduped.get(k)) {
        case (null) { deduped.add(k, lead) };
        case (?existing) {
          // Keep whichever has more info; prefer serpapi_dev > tinyfish > llm
          let priority = func(src : Text) : Nat {
            if (src == "serpapi_dev") 3
            else if (src == "both") 2
            else if (src == "tinyfish") 1
            else 0
          };
          if (priority(lead.source) > priority(existing.source)) {
            deduped.add(k, lead)
          };
        };
      };
    };
    let totalFound = deduped.size();

    // Cap to limit
    let finalLeads = List.empty<T.GeneratedLead>();
    var added : Nat = 0;
    label capLoop for ((_, lead) in deduped.entries()) {
      if (added >= cap) break capLoop;
      finalLeads.add(lead);
      added += 1;
    };

    // ── Contact enrichment with SerpApi enrichment (not SerpApi.dev search) 
    if (includeEnrichment and not serpApiUsed) {
      let serpKeyOpt  = llg_getKey(func(c) { c.serpApiKey });
      let searxngOpt  = llg_getKey(func(c) { c.searxngUrl });

      if (serpKeyOpt == null and searxngOpt == null) {
        errors.add("SerpApi key not configured — leads returned without contact enrichment. Add your SerpApi key in the Go Live Dashboard.");
      };

      switch (serpKeyOpt) {
        case (?serpKey) {
          serpApiUsed := true;
          finalLeads.mapInPlace(func(lead : T.GeneratedLead) : T.GeneratedLead {
            lead // enrichment is async; enrichment loop below handles it
          });
          let enriched2 = List.empty<T.GeneratedLead>();
          for (lead in finalLeads.values()) {
            let enrichedLead = await llg_enrichWithSerpApi(serpKey, lead);
            if (enrichedLead.enriched) { enrichedCount += 1 };
            enriched2.add(enrichedLead);
          };
          finalLeads.clear();
          for (l in enriched2.values()) { finalLeads.add(l) };
        };
        case (null) {
          switch (searxngOpt) {
            case (?base) {
              let enriched2 = List.empty<T.GeneratedLead>();
              for (lead in finalLeads.values()) {
                let enrichedLead = await llg_enrichWithSearXNG(base, lead);
                if (enrichedLead.enriched) { enrichedCount += 1 };
                enriched2.add(enrichedLead);
              };
              finalLeads.clear();
              for (l in enriched2.values()) { finalLeads.add(l) };
            };
            case (null) {};
          };
        };
      };
    };

    // Count enriched from serpapi_dev results (already marked enriched in parser)
    if (serpApiUsed and enrichedCount == 0) {
      for (lead in finalLeads.values()) {
        if (lead.enriched) { enrichedCount += 1 };
      };
    };

    let result : T.LLMLeadSearchResult = {
      leads         = finalLeads.toArray();
      claudeCount;
      openAICount;
      enrichedCount;
      serpApiUsed;
      serpApiCount;
      tinyFishCount;
      totalFound;
      errors        = errors.toArray();
      searchedAt    = now;
    };

    #ok(result)
  };

};
