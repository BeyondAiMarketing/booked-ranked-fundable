import CSTypes      "../types/contentStudio";
import CSLib        "../lib/contentStudio";
import ORLib        "../lib/openRouter";
import ORTypes      "../types/openRouter";
import Outcall      "mo:caffeineai-http-outcalls/outcall";
import List         "mo:core/List";
import Text         "mo:core/Text";
import Array        "mo:core/Array";
import ICTypes "../types/integrationCredentials";
import ICLib "../lib/integrationCredentials";
import Map "mo:core/Map";

mixin (
  contentStudioState : CSTypes.ContentStudioState,
  openRouterState    : ORLib.State,
  transform          : ORLib.Transform,
  integrationCreds   : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt           : Blob,
) {

  // ── Mutable working collections ───────────────────────────────────────────

  let _csResults  = CSLib.resultList(contentStudioState);
  let _csToggles  = CSLib.toggleList(contentStudioState);

  // ── Internal HTTP-outcall helpers ─────────────────────────────────────────

  /// Build a niche-aware system prompt for text content (AdCopy / Blog).
  private func buildTextSystemPrompt(contentType : CSTypes.ContentType, niche : Text) : Text {
    let typeLabel = switch contentType {
      case (#AdCopy) "ad copy";
      case (#Blog)   "a long-form blog post";
      case _         "content";
    };
    "You are a master direct-response copywriter trained in the Brunson, Hormozi, Kennedy, and Halbert frameworks. " #
    "Write " # typeLabel # " for a " # niche # " business. " #
    "For ad copy: strong hook, value stack, irresistible CTA. " #
    "For blog: SEO-optimised, authoritative, niche-specific, actionable. " #
    "Output only the finished copy, no commentary.";
  };

  /// Build a niche-aware storyboard prompt for video generation.
  private func buildStoryboardPrompt(niche : Text, userPrompt : Text) : Text {
    "You are a video producer for a " # niche # " business. " #
    "Write a concise, visual storyboard description (3-5 scenes) for the following brief: " # userPrompt # ". " #
    "Output a single paragraph suitable as a video generation prompt. No scene labels, no commentary.";
  };

  /// Escape a text value so it is safe inside a JSON string.
  private func escJson(s : Text) : Text {
    var out = "";
    for (c in s.chars()) {
      if (c == '\u{22}')      { out #= "\\\"" }
      else if (c == '\\')     { out #= "\\\\" }
      else if (c == '\n')     { out #= "\\n"  }
      else if (c == '\r')     { out #= "\\r"  }
      else if (c == '\t')     { out #= "\\t"  }
      else                    { out #= Text.fromChar(c) };
    };
    out;
  };

  /// Extract the first `url` string value from an OpenRouter image/video response.
  private func extractUrl(raw : Text) : Text {
    let marker     = "\"url\":\"";
    let markerChars = marker.toArray();
    let rawChars    = raw.toArray();
    let mLen        = markerChars.size();
    let rLen        = rawChars.size();
    var startIdx : ?Nat = null;
    var i = 0;
    label findMarker while (i + mLen <= rLen) {
      var matched = true;
      var j = 0;
      label matchLoop while (j < mLen) {
        if (rawChars[i + j] != markerChars[j]) {
          matched := false;
          break matchLoop;
        };
        j += 1;
      };
      if (matched) {
        startIdx := ?(i + mLen);
        break findMarker;
      };
      i += 1;
    };
    switch startIdx {
      case null "";
      case (?afterMarker) {
        var end     = afterMarker;
        var escaped = false;
        label scan while (end < rLen) {
          let c = rawChars[end];
          if (escaped)          { escaped := false }
          else if (c == '\\')   { escaped := true  }
          else if (c == '\u{22}') { break scan };
          end += 1;
        };
        let len : Nat = end - afterMarker;
        Text.fromIter(Array.tabulate<Char>(len, func(k) { rawChars[afterMarker + k] }).vals());
      };
    };
  };

  /// Get configured OpenRouter API key or empty string.
  private func apiKey() : Text {
    ORLib.getConfig(openRouterState).apiKey;
  };

  /// Standard auth headers for OpenRouter HTTP calls.
  private func authHeaders() : [(Text, Text)] {
    let key = apiKey();
    [
      ("Authorization", "Bearer " # key),
      ("Content-Type",  "application/json"),
      ("HTTP-Referer",  "https://bookedrankedfunded.org"),
      ("X-Title",       "BRF"),
    ];
  };

  /// Convert (Text, Text) pairs to Outcall.Header array.
  private func toHeaders(pairs : [(Text, Text)]) : [Outcall.Header] {
    Array.tabulate<Outcall.Header>(
      pairs.size(),
      func(i) { { name = pairs[i].0; value = pairs[i].1 } },
    );
  };

  // ── Core generate helpers ─────────────────────────────────────────────────

  /// Call Owl Alpha for text content (AdCopy or Blog).
  private func generateTextContent(
    contentType : CSTypes.ContentType,
    niche       : Text,
    userPrompt  : Text,
  ) : async Text {
    let messages : [ORTypes.OpenRouterMessage] = [
      { role = "system"; content = buildTextSystemPrompt(contentType, niche) },
      { role = "user";   content = userPrompt },
    ];
    let geminiKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAll(enc, credSalt).geminiApiKey;
    };
    let openaiKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAll(enc, credSalt).openaiKey;
    };
    await ORLib.callWithFallback(openRouterState, #OutreachCopy, messages, transform, openaiKey, geminiKey);
  };

  /// Call Flux Pro 2 via OpenRouter images endpoint.
  private func generateImage(
    niche      : Text,
    userPrompt : Text,
  ) : async Text {
    let key = apiKey();
    if (key == "") return "";
    let body = "{\"model\":\"" # escJson(CSTypes.imageModel) # "\"," #
               "\"prompt\":\"" # escJson(niche # " " # userPrompt) # "\"," #
               "\"n\":1,\"size\":\"1024x1024\"}";
    try {
      let resp = await Outcall.httpPostRequest(
        "https://openrouter.ai/api/v1/images/generations",
        toHeaders(authHeaders()),
        body,
        transform,
      );
      extractUrl(resp);
    } catch (_) { "" };
  };

  /// Generate a video via OpenRouter: first build storyboard with Owl Alpha,
  /// then request the video model.
  private func generateVideo(
    niche      : Text,
    userPrompt : Text,
  ) : async Text {
    let key = apiKey();
    if (key == "") return "";

    // Step 1: storyboard via Owl Alpha
    let sbMessages : [ORTypes.OpenRouterMessage] = [
      { role = "user"; content = buildStoryboardPrompt(niche, userPrompt) },
    ];
    let geminiKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAll(enc, credSalt).geminiApiKey;
    };
    let openaiKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAll(enc, credSalt).openaiKey;
    };
    let storyboard = await ORLib.callWithFallback(
      openRouterState, #OutreachCopy, sbMessages, transform, openaiKey, geminiKey,
    );
    let videoPrompt = if (storyboard == "") { niche # " " # userPrompt } else storyboard;

    // Step 2: video generation request
    let body = "{\"model\":\"" # escJson(CSTypes.videoModel) # "\"," #
               "\"messages\":[{\"role\":\"user\",\"content\":\"" # escJson(videoPrompt) # "\"}]," #
               "\"stream\":false}";
    try {
      let resp = await Outcall.httpPostRequest(
        "https://openrouter.ai/api/v1/chat/completions",
        toHeaders(authHeaders()),
        body,
        transform,
      );
      // Veo 3.1 returns the video URL in the content field or a data field
      let url = extractUrl(resp);
      if (url == "") {
        // fall back: treat the content as a URL-like text
        ORLib.extractContent(resp);
      } else url;
    } catch (_) { "" };
  };

  // ── Read endpoints ────────────────────────────────────────────────────────

  /// Return all generated content items for an account.
  public query func getGeneratedContent(
    accountId : Text,
  ) : async [CSTypes.ContentGenerationResult] {
    CSLib.getResultsByAccount(_csResults, accountId)
  };

  /// Return a single generation result by id.
  public query func getGeneratedContentById(
    id : Text,
  ) : async ?CSTypes.ContentGenerationResult {
    CSLib.getResultById(_csResults, id)
  };

  /// Return all generated content items (admin).
  public query func getAllGeneratedContent() : async [CSTypes.ContentGenerationResult] {
    _csResults.toArray()
  };

  // ── Write endpoints ───────────────────────────────────────────────────────

  /// Submit a content generation request. Creates a Pending record, fires
  /// the appropriate OpenRouter HTTP outcall (Owl Alpha for text, Flux for
  /// images, Veo for video), and updates the record with the result.
  public shared func generateContent(
    req : CSTypes.ContentGenerationRequest,
  ) : async Text {
    let id     = CSLib.newId(req.contentType, req.accountId);
    let result = CSLib.pendingResult(req, id);
    CSLib.upsertResult(_csResults, result);

    // Mark as Generating
    CSLib.updateResultStatus(_csResults, id, #Generating, "", null, null);

    // Dispatch to the correct model
    let (output, mediaUrl, status, errMsg) : (Text, ?Text, CSTypes.GenerationStatus, ?Text) =
      switch (req.contentType) {
        case (#AdCopy) {
          let text = await generateTextContent(#AdCopy, req.niche, req.prompt);
          if (text == "") ("", null, #Failed, ?("OpenRouter returned empty response"))
          else            (text, null, #Complete, null);
        };
        case (#Blog) {
          let text = await generateTextContent(#Blog, req.niche, req.prompt);
          if (text == "") ("", null, #Failed, ?("OpenRouter returned empty response"))
          else            (text, null, #Complete, null);
        };
        case (#Image) {
          let url = await generateImage(req.niche, req.prompt);
          if (url == "") ("", null, #Failed, ?("Image generation returned empty URL"))
          else           ("Image generated via Flux Pro 2", ?url, #Complete, null);
        };
        case (#Video) {
          let url = await generateVideo(req.niche, req.prompt);
          if (url == "") ("", null, #Failed, ?("Video generation returned empty URL"))
          else           ("Video generated via Veo 3.1", ?url, #Complete, null);
        };
      };

    CSLib.updateResultStatus(_csResults, id, status, output, mediaUrl, errMsg);
    id;
  };

  /// Manually update a content result (admin override / frontend polling fallback).
  public shared func updateContentResult(
    id       : Text,
    status   : CSTypes.GenerationStatus,
    output   : Text,
    mediaUrl : ?Text,
    errorMsg : ?Text,
  ) : async () {
    CSLib.updateResultStatus(_csResults, id, status, output, mediaUrl, errorMsg);
  };

  /// Delete a generated content item.
  public shared func deleteGeneratedContent(id : Text) : async () {
    CSLib.deleteResult(_csResults, id);
  };

  // ── Tier toggle endpoints ─────────────────────────────────────────────────

  /// Enable or disable content creation for a tier (Super Admin only).
  public shared func setContentTierToggle(
    tier    : Text,
    enabled : Bool,
  ) : async () {
    CSLib.setTierToggle(_csToggles, tier, enabled);
  };

  /// Return all tier toggles.
  public query func getContentTierToggles() : async [CSTypes.ContentTierToggle] {
    CSLib.getAllTierToggles(_csToggles)
  };

  /// Return whether content creation is enabled for a specific tier.
  public query func isContentEnabledForTier(tier : Text) : async Bool {
    CSLib.isTierEnabled(_csToggles, tier)
  };

};
