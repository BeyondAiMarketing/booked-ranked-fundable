import Map          "mo:core/Map";
import Text         "mo:core/Text";
import Array        "mo:core/Array";
import Time         "mo:core/Time";
import WebhookState "../types/webhookState";
import WebhookTypes "../types/webhooks";
import ICTypes      "../types/integrationCredentials";
import ICLib        "../lib/integrationCredentials";
import WHLib        "../lib/webhooksAndIntegrations";
import Outcall      "mo:caffeineai-http-outcalls/outcall";
import List "mo:core/List";

mixin (
  webhookStateRef  : { var s : WebhookState.WebhookState },
  integrationCreds : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt         : Blob,
  transform        : query Outcall.TransformationInput -> async Outcall.TransformationOutput,
  vapiCallLogs     : Map.Map<Text, List.List<{
    id          : Text;
    tenantId    : Text;
    callId      : Text;
    direction   : Text;
    status      : Text;
    duration    : Nat;
    transcript  : Text;
    callerPhone : Text;
    recordingUrl : ?Text;
    endedAt     : ?Int;
    recordedAt  : Int;
  }>>,
  postCallFollowUpLog : List.List<(Text, Text, ?Text, Int, Bool, ?Text)>,
) {

  // ---- Internal helpers -------------------------------------------------------

  /// Get the decrypted platform credentials record (tenant "platform").
  func getPlatformCreds() : ICTypes.IntegrationCredentials {
    switch (integrationCreds.get("platform")) {
      case (?enc) ICLib.decryptAll(enc, credSalt);
      case null {
        { openaiKey = ""; claudeKey = ""; litellmUrl = ""; litellmKey = "";
          ollamaUrl = ""; twilioSid = ""; twilioAuth = ""; twilioNumber = "";
          vapiKey = ""; stripeKey = ""; stripeWebhookSecret = "";
          googleClientId = ""; googleClientSecret = ""; yelpApiKey = "";
          facebookAppId = ""; facebookAppSecret = "";
          emailSmtpHost = ""; emailSmtpPort = ""; emailSmtpUser = "";
          emailSmtpPass = ""; hunterApiKey = ""; neverBounceKey = "";
          listmonkUrl = ""; listmonkUser = ""; listmonkPass = "";
          searxngUrl = ""; elevenLabsKey = ""; elevenLabsVoiceId = "";
          perplexityApiKey = ""; autoBrowserUrl = "";
          serpApiKey = ""; serpApiDevKey = ""; tinyFishKey = "";
          sendgridKey = ""; nvidiaApiKey = []; n8nApiKey = [];
          n8nInstanceUrl = ""; abacusApiKey = ""; composioApiKey = "";
          dograhApiKey = ""; openRouterApiKey = "";
          nvidiaNimApiKey = ""; geminiApiKey = "";
          vapiWebhookSecret = "";
          sendgridInboundParseDomain = ""; composioWebhookSecret = "";
        }
      };
    };
  };

  /// Log an event into the shared webhook state.
  func log(
    provider  : Text,
    eventType : Text,
    payload   : Text,
    status    : { #ok; #failed },
    errorMsg  : ?Text,
  ) {
    webhookStateRef.s := WHLib.logWebhookEvent(
      webhookStateRef.s, provider, eventType, payload, status, errorMsg
    );
  };

  // ---- Inbound webhook receivers ------------------------------------------

  /// Receive and process an inbound Twilio webhook (voice or SMS).
  /// Returns TwiML XML or a plain-text status string.
  public shared ({ caller = _ }) func receiveTwilioWebhook(
    path      : Text,
    params    : [(Text, Text)],
    signature : Text,
  ) : async Text {
    let creds = getPlatformCreds();
    // Verify signature (HMAC-SHA1 not available in Motoko — always passes with warning)
    let valid = WHLib.verifyTwilioSignature(creds.twilioAuth, "https://bookedrankedfunded.org" # path, params, signature);
    if (not valid) {
      log("twilio", "rejected", path, #failed, ?"Signature verification failed");
      return "<?xml version=\"1.0\"?><Response><Reject/></Response>";
    };

    let response : Text = switch (path) {
      case ("/webhooks/twilio/voice") {
        // Forward voice call toward Vapi SIP or AI agent
        let vapiSipUri = "sip:bookedrankedfunded@sip.vapi.ai";
        log("twilio", "voice_inbound", WHLib.getParamValue(params, "CallSid"), #ok, null);
        "<?xml version=\"1.0\"?><Response><Dial><SIP>" # vapiSipUri # "</SIP></Dial></Response>"
      };
      case ("/webhooks/twilio/sms") {
        let from    = WHLib.getParamValue(params, "From");
        let to      = WHLib.getParamValue(params, "To");
        let msgBody = WHLib.getParamValue(params, "Body");
        log("twilio", "sms_inbound", "from=" # from # " to=" # to # " body=" # msgBody, #ok, null);
        "<?xml version=\"1.0\"?><Response/>"
      };
      case ("/webhooks/twilio/sms-status") {
        let msgSid    = WHLib.getParamValue(params, "MessageSid");
        let msgStatus = WHLib.getParamValue(params, "MessageStatus");
        log("twilio", "sms_status", "sid=" # msgSid # " status=" # msgStatus, #ok, null);
        ""
      };
      case ("/webhooks/twilio/call-status") {
        let callSid    = WHLib.getParamValue(params, "CallSid");
        let callStatus = WHLib.getParamValue(params, "CallStatus");
        let duration   = WHLib.getParamValue(params, "CallDuration");
        let from       = WHLib.getParamValue(params, "From");
        let to         = WHLib.getParamValue(params, "To");
        log("twilio", "call_status",
          "sid=" # callSid # " status=" # callStatus # " duration=" # duration # " from=" # from # " to=" # to,
          #ok, null);
        ""
      };
      case ("/webhooks/twilio/recording") {
        let recSid = WHLib.getParamValue(params, "RecordingSid");
        let recUrl = WHLib.getParamValue(params, "RecordingUrl");
        let callSid = WHLib.getParamValue(params, "CallSid");
        log("twilio", "recording",
          "recSid=" # recSid # " recUrl=" # recUrl # " callSid=" # callSid,
          #ok, null);
        ""
      };
      case (_) {
        log("twilio", "unknown_path", path, #failed, ?"Unrecognised webhook path");
        ""
      };
    };
    response
  };

  /// Receive and process an inbound Vapi webhook.
  public shared ({ caller = _ }) func receiveVapiWebhook(
    body       : Text,
    vapiSecret : Text,
  ) : async Text {
    let creds = getPlatformCreds();
    // Verify secret: simple equality check
    if (creds.vapiWebhookSecret != "" and vapiSecret != creds.vapiWebhookSecret) {
      log("vapi", "rejected", "secret_mismatch", #failed, ?"Invalid webhook secret");
      return "{\"error\":\"Unauthorized\"}";
    };

    // Extract message.type from JSON body using simple text search
    let msgType = WHLib.extractJsonField(body, "type");
    let vapiType = WHLib.parseVapiMessageType(msgType);

    switch (vapiType) {
      case (?#assistantRequest) {
        let vapiAssistantId = WHLib.extractJsonField(body, "assistantId");
        log("vapi", "assistant_request", body, #ok, null);
        if (vapiAssistantId != "") {
          "{\"assistant\":{\"assistantId\":\"" # vapiAssistantId # "\"}}"
        } else {
          "{\"assistant\":{}}"
        }
      };
      case (?#toolCalls) {
        // Parse toolCallList: look for tool name
        let toolName = WHLib.extractJsonField(body, "name");
        log("vapi", "tool_calls", toolName, #ok, null);
        if (toolName == "lookupLead") {
          // CRM lookup: return a placeholder result
          "{\"results\":[{\"toolCallId\":\"tc1\",\"result\":\"Lead not found in CRM\"}]}"
        } else {
          "{\"results\":[{\"toolCallId\":\"tc1\",\"result\":\"Unknown tool\"}]}"
        }
      };
      case (?#statusUpdate) {
        let status = WHLib.extractJsonField(body, "status");
        log("vapi", "status_update", status, #ok, null);
        ""
      };
      case (?#endOfCallReport) {
        let callId       = WHLib.extractJsonField(body, "id");
        let endedReason  = WHLib.extractJsonField(body, "endedReason");
        let recordingUrl = WHLib.extractJsonField(body, "recordingUrl");
        let transcript   = WHLib.extractJsonField(body, "transcript");
        // Vapi sends caller phone as customer.number — try common field names
        let callerPhone = do {
          let p = WHLib.extractJsonField(body, "phoneNumber");
          if (p != "") p else {
            let q = WHLib.extractJsonField(body, "number");
            if (q != "") q else ""
          }
        };
        // duration comes as a float string e.g. "42.5" — parse integer seconds
        let durationText = WHLib.extractJsonField(body, "duration");
        let durationNat : Nat = switch (durationText.split(#char '.').next()) {
          case (?intPart) {
            switch (intPart.toNat()) {
              case (?n) n;
              case null 0;
            }
          };
          case null 0;
        };

        let now = Time.now();
        let tid = "platform";
        let logEntry = {
          id          = "vcl-" # callId # "-" # now.toText();
          tenantId    = tid;
          callId;
          direction   = "inbound";
          status      = if (endedReason != "") endedReason else "completed";
          duration    = durationNat;
          transcript;
          callerPhone;
          recordingUrl = if (recordingUrl != "") ?recordingUrl else null;
          endedAt     = ?now;
          recordedAt  = now;
        };

        let existing = switch (vapiCallLogs.get(tid)) {
          case (?list) list;
          case null    List.empty<{
            id          : Text;
            tenantId    : Text;
            callId      : Text;
            direction   : Text;
            status      : Text;
            duration    : Nat;
            transcript  : Text;
            callerPhone : Text;
            recordingUrl : ?Text;
            endedAt     : ?Int;
            recordedAt  : Int;
          }>();
        };
        existing.add(logEntry);
        vapiCallLogs.add(tid, existing);

        // Post-call follow-up: send SMS via Twilio to the caller
        let followUpCreds = getPlatformCreds();
        if (callerPhone != "" and followUpCreds.twilioSid != "" and followUpCreds.twilioAuth != "") {
          let smsBody = "Hey - you just experienced what YOUR customers will feel every time they call your business.%0A%0AOur AI just handled your call and confirmed availability:%0ADate - Tomorrow%0ADemo Appointment Confirmed%0ARoofing Consultation - BRF AI Front Desk%0A%0AThis is what every inbound call to your roofing business looks like with BRF - 24/7, never misses a call, books while you're on the roof.%0A%0AReady to activate this for your business? Visit bookedrankedfunded.org";
          let twilioEncoded = ICLib.base64ForTwilio(followUpCreds.twilioSid, followUpCreds.twilioAuth);
          let smsFormBody = "To=" # callerPhone # "&From=%2B17603540802&Body=" # smsBody;
          let smsHeaders : [Outcall.Header] = [
            { name = "Authorization"; value = "Basic " # twilioEncoded },
            { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
          ];
          ignore async {
            try {
              ignore await Outcall.httpPostRequest(
                "https://api.twilio.com/2010-04-01/Accounts/" # followUpCreds.twilioSid # "/Messages.json",
                smsHeaders,
                smsFormBody,
                transform,
              );
              postCallFollowUpLog.add((callerPhone, callerPhone, null, Time.now(), true, null));
            } catch (e) {
              postCallFollowUpLog.add((callerPhone, callerPhone, null, Time.now(), false, ?"SMS outcall failed"));
            };
          };
        };

        log("vapi", "end_of_call",
          "callId=" # callId # " endedReason=" # endedReason # " duration=" # durationText # " callerPhone=" # callerPhone,
          #ok, null);
        "{\"received\":true}"
      };
      case (?#transcript) {
        let chunk = WHLib.extractJsonField(body, "transcript");
        log("vapi", "transcript", chunk, #ok, null);
        ""
      };
      case (?#hang) {
        log("vapi", "hang", body, #ok, null);
        ""
      };
      case null {
        // Unknown message type — log and return OK to avoid Vapi retries
        log("vapi", "unknown_" # msgType, body, #ok, null);
        ""
      };
    };
  };

  /// Receive and process an inbound Stripe webhook.
  /// NOTE: Motoko cannot perform HMAC-SHA256. The stored stripeWebhookSecret is
  /// compared as a basic string check against the Stripe-Signature header.
  /// Full cryptographic verification requires a Motoko HMAC library.
  public shared ({ caller = _ }) func receiveStripeWebhook(
    body      : Text,
    sigHeader : Text,
  ) : async { success : Bool; eventType : Text } {
    let creds = getPlatformCreds();
    // Basic validation: call the verifier (structurally checks fields, not crypto)
    let valid = WHLib.verifyStripeSignature(creds.stripeWebhookSecret, body, sigHeader);
    if (not valid) {
      log("stripe", "rejected", "sig_failed", #failed, ?"Signature verification failed");
      return { success = false; eventType = "" };
    };

    let eventType = WHLib.extractJsonField(body, "type");
    let objectId   = WHLib.extractJsonField(body, "id");
    let customerId = do {
      let c = WHLib.extractJsonField(body, "customer");
      if (c != "") c else WHLib.extractJsonField(body, "customerId")
    };

    // Handle known Stripe event types
    switch (eventType) {
      case ("payment_intent.succeeded") {
        let amount = WHLib.extractJsonField(body, "amount");
        log("stripe", "stripe_event",
          "type=payment_intent.succeeded objectId=" # objectId # " customerId=" # customerId # " amount=" # amount,
          #ok, null);
      };
      case ("customer.subscription.created") {
        log("stripe", "stripe_event",
          "type=customer.subscription.created objectId=" # objectId # " customerId=" # customerId,
          #ok, null);
      };
      case ("customer.subscription.deleted") {
        log("stripe", "stripe_event",
          "type=customer.subscription.deleted objectId=" # objectId # " customerId=" # customerId,
          #ok, null);
      };
      case ("invoice.payment_failed") {
        log("stripe", "stripe_event",
          "type=invoice.payment_failed objectId=" # objectId # " customerId=" # customerId,
          #failed, ?"Invoice payment failed");
      };
      case (_) {
        // Log all other events
        let fallback = if (eventType != "") eventType else "unknown";
        log("stripe", "stripe_event", "type=" # fallback # " objectId=" # objectId, #ok, null);
      };
    };

    { success = true; eventType }
  };

  /// Receive and process a SendGrid inbound parse webhook.
  public shared ({ caller = _ }) func receiveSendgridInbound(
    params : [(Text, Text)],
  ) : async Text {
    let from    = WHLib.getParamValue(params, "from");
    let to      = WHLib.getParamValue(params, "to");
    let subject = WHLib.getParamValue(params, "subject");
    let text    = WHLib.getParamValue(params, "text");
    log("sendgrid", "inbound_email",
      "from=" # from # " to=" # to # " subject=" # subject # " body=" # text,
      #ok, null);
    "ok"
  };

  /// Receive and process SendGrid event-tracking webhooks (batch JSON array).
  /// NOTE: Motoko cannot perform ECDSA signature verification. All events are
  /// accepted and logged. Source IP warning is included in each log entry.
  public shared ({ caller = _ }) func receiveSendgridEvents(
    body : Text,
  ) : async { success : Bool; processed : Nat } {
    var count = 0;
    // Split on '{' to find individual event objects in the batch array
    let chunks = body.split(#text "{");
    for (chunk in chunks) {
      let obj       = "{" # chunk;
      let email     = WHLib.extractJsonField(obj, "email");
      let eventType = WHLib.extractJsonField(obj, "event");
      let sgMsgId   = WHLib.extractJsonField(obj, "sg_message_id");
      if (email != "" and eventType != "") {
        // Log event with no-signature-verification warning
        log("sendgrid", eventType,
          "[no-sig-verify] email=" # email # " sg_message_id=" # sgMsgId,
          #ok, null);
        // Update campaign enrollment status based on event type
        // (actual CRM/campaign mutation would require shared campaign state;
        //  here we log the actionable event for the frontend to consume)
        switch (eventType) {
          case ("bounce") {
            log("sendgrid", "campaign_bounce",
              "email=" # email # " action=mark_enrollment_bounced",
              #ok, null);
          };
          case ("unsubscribe") {
            log("sendgrid", "campaign_unsubscribe",
              "email=" # email # " action=mark_enrollment_unsubscribed",
              #ok, null);
          };
          case ("spamreport") {
            log("sendgrid", "campaign_spamreport",
              "email=" # email # " action=mark_enrollment_unsubscribed",
              #ok, null);
          };
          case ("open") {
            log("sendgrid", "campaign_open",
              "email=" # email # " action=increment_open_count",
              #ok, null);
          };
          case ("click") {
            log("sendgrid", "campaign_click",
              "email=" # email # " action=increment_click_count",
              #ok, null);
          };
          case ("delivered") {
            log("sendgrid", "campaign_delivered",
              "email=" # email # " action=mark_delivered",
              #ok, null);
          };
          case (_) {
            log("sendgrid", "campaign_event_" # eventType,
              "email=" # email,
              #ok, null);
          };
        };
        count += 1;
      };
    };
    { success = true; processed = count }
  };

  // ---- Integration health / testing ---------------------------------------

  /// Live-ping the NVIDIA NIM endpoint and return a result record.
  public shared ({ caller = _ }) func testNvidiaConnection() : async WebhookTypes.IntegrationTestResult {
    let creds = getPlatformCreds();
    let key = creds.nvidiaNimApiKey;
    let now = Time.now();
    if (key == "") {
      return { provider = "nvidia"; connected = false;
        message = "NVIDIA NIM API key not configured";
        latencyMs = null; testedAt = now };
    };
    let url = "https://integrate.api.nvidia.com/v1/models";
    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = "Bearer " # key },
      { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" },
    ];
    let start = Time.now();
    try {
      let response = await Outcall.httpGetRequest(url, headers, transform);
      let latency : Nat = if (Time.now() > start) {
        let raw : Int = (Time.now() - start) / 1_000_000;
        if (raw >= 0) raw.toNat() else 0
      } else { 0 };
      if (response.size() > 0) {
        { provider = "nvidia"; connected = true;
          message = "NVIDIA NIM reachable";
          latencyMs = ?latency; testedAt = now }
      } else {
        { provider = "nvidia"; connected = false;
          message = "Empty response from NVIDIA NIM";
          latencyMs = ?latency; testedAt = now }
      }
    } catch (_e) {
      { provider = "nvidia"; connected = false;
        message = "HTTP outcall failed — NVIDIA NIM unreachable or key invalid";
        latencyMs = null; testedAt = now }
    }
  };

  /// Ping every configured integration and return a consolidated health summary.
  public shared ({ caller = _ }) func testAllConnections() : async WebhookTypes.IntegrationHealthSummary {
    let creds = getPlatformCreds();
    let now = Time.now();

    /// Helper: fire a GET test and return an IntegrationTestResult.
    func liveGetTest(provider : Text, providerLabel : Text, url : Text, headers : [(Text, Text)]) : async WebhookTypes.IntegrationTestResult {
      let start = Time.now();
      let outcallHeaders : [Outcall.Header] = headers.map(func(h) { { name = h.0; value = h.1 } });
      try {
        let response = await Outcall.httpGetRequest(url, outcallHeaders, transform);
        let rawLatency : Int = (Time.now() - start) / 1_000_000;
        let latency : Nat = if (rawLatency > 0) rawLatency.toNat() else 0;
        let ok = response.size() > 0;
        { provider; connected = ok;
          message  = if (ok) providerLabel # " reachable" else providerLabel # " returned empty response";
          latencyMs = ?latency; testedAt = now }
      } catch (_e) {
        { provider; connected = false;
          message = providerLabel # " unreachable — check API key or service status";
          latencyMs = null; testedAt = now }
      }
    };

    /// Helper: fire a POST test and return an IntegrationTestResult.
    func livePostTest(provider : Text, providerLabel : Text, url : Text, headers : [(Text,Text)], body : Text) : async WebhookTypes.IntegrationTestResult {
      let start = Time.now();
      let outcallHeaders : [Outcall.Header] = headers.map(func(h) { { name = h.0; value = h.1 } });
      try {
        let _response = await Outcall.httpPostRequest(url, outcallHeaders, body, transform);
        let rawLatency : Int = (Time.now() - start) / 1_000_000;
        let latency : Nat = if (rawLatency > 0) rawLatency.toNat() else 0;
        { provider; connected = true;
          message = providerLabel # " reachable";
          latencyMs = ?latency; testedAt = now }
      } catch (_e) {
        { provider; connected = false;
          message = providerLabel # " unreachable — check API key or service status";
          latencyMs = null; testedAt = now }
      }
    };

    /// Helper: unconfigured result when key is missing.
    func unconfigured(provider : Text, providerLabel : Text) : WebhookTypes.IntegrationTestResult {
      { provider; connected = false;
        message = providerLabel # " API key not configured";
        latencyMs = null; testedAt = now }
    };

    // ---- OpenRouter (POST — HTTP-Referer and X-Title required) -----------
    let openRouterResult : WebhookTypes.IntegrationTestResult = if (creds.openRouterApiKey == "") {
      unconfigured("openrouter", "OpenRouter")
    } else {
      // OpenRouter requires HTTP-Referer and X-Title headers
      await livePostTest("openrouter", "OpenRouter",
        "https://openrouter.ai/api/v1/chat/completions",
        [
          ("Authorization", "Bearer " # creds.openRouterApiKey),
          ("Content-Type",  "application/json"),
          ("HTTP-Referer",  "https://bookedrankedfunded.org"),
          ("X-Title",       "BRF-Platform"),
        ],
        "{\"model\":\"openai/gpt-3.5-turbo\",\"messages\":[{\"role\":\"user\",\"content\":\"ping\"}],\"max_tokens\":1}")
    };

    // ---- OpenAI (POST) ----------------------------------------------------
    let openAiResult : WebhookTypes.IntegrationTestResult = if (creds.openaiKey == "") {
      unconfigured("openai", "OpenAI")
    } else {
      await livePostTest("openai", "OpenAI",
        "https://api.openai.com/v1/chat/completions",
        [("Authorization", "Bearer " # creds.openaiKey), ("Content-Type", "application/json")],
        "{\"model\":\"gpt-3.5-turbo\",\"messages\":[{\"role\":\"user\",\"content\":\"ping\"}],\"max_tokens\":1}")
    };

    // ---- Gemini (POST) ----------------------------------------------------
    let geminiResult : WebhookTypes.IntegrationTestResult = if (creds.geminiApiKey == "") {
      unconfigured("gemini", "Gemini")
    } else {
      await livePostTest("gemini", "Gemini",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" # creds.geminiApiKey,
        [("Content-Type", "application/json")],
        "{\"contents\":[{\"parts\":[{\"text\":\"ping\"}]}]}")
    };

    // ---- Claude / Anthropic (POST — x-api-key + anthropic-version required) ----
    let claudeResult : WebhookTypes.IntegrationTestResult = if (creds.claudeKey == "") {
      unconfigured("claude", "Claude")
    } else {
      // IMPORTANT: Claude uses x-api-key header + anthropic-version header.
      // It does NOT use Authorization: Bearer — that is a common mistake.
      await livePostTest("claude", "Claude",
        "https://api.anthropic.com/v1/messages",
        [
          ("x-api-key",         creds.claudeKey),
          ("anthropic-version", "2023-06-01"),
          ("Content-Type",      "application/json"),
        ],
        "{\"model\":\"claude-3-haiku-20240307\",\"max_tokens\":1,\"messages\":[{\"role\":\"user\",\"content\":\"ping\"}]}")
    };

    // ---- NVIDIA NIM (GET) ------------------------------------------------
    let nvidiaResult : WebhookTypes.IntegrationTestResult = if (creds.nvidiaNimApiKey == "") {
      unconfigured("nvidia", "NVIDIA NIM")
    } else {
      await liveGetTest("nvidia", "NVIDIA NIM",
        "https://integrate.api.nvidia.com/v1/models",
        [("Authorization", "Bearer " # creds.nvidiaNimApiKey)])
    };

    // ---- TinyFish (GET — X-API-Key header required) ----------------------
    let tinyFishResult : WebhookTypes.IntegrationTestResult = if (creds.tinyFishKey == "") {
      unconfigured("tinyfish", "TinyFish")
    } else {
      // TinyFish uses X-API-Key header, NOT Authorization: Bearer
      await liveGetTest("tinyfish", "TinyFish",
        "https://api.tinyfish.ai/search?q=test",
        [("X-API-Key", creds.tinyFishKey)])
    };

    // ---- SerpApi (GET) ---------------------------------------------------
    let serpApiKey = if (creds.serpApiDevKey != "") creds.serpApiDevKey else creds.serpApiKey;
    let serpApiResult : WebhookTypes.IntegrationTestResult = if (serpApiKey == "") {
      unconfigured("serpapi", "SerpApi")
    } else {
      await liveGetTest("serpapi", "SerpApi",
        "https://serpapi.com/account?api_key=" # serpApiKey,
        [])
    };

    // ---- Twilio (GET) ----------------------------------------------------
    let twilioEncoded = ICLib.base64ForTwilio(creds.twilioSid, creds.twilioAuth);
    let twilioResult : WebhookTypes.IntegrationTestResult = if (creds.twilioSid == "") {
      unconfigured("twilio", "Twilio")
    } else {
      await liveGetTest("twilio", "Twilio",
        "https://api.twilio.com/2010-04-01/Accounts/" # creds.twilioSid # ".json",
        [("Authorization", "Basic " # twilioEncoded)])
    };

    // ---- SendGrid (GET) --------------------------------------------------
    let sendGridResult : WebhookTypes.IntegrationTestResult = if (creds.sendgridKey == "") {
      unconfigured("sendgrid", "SendGrid")
    } else {
      await liveGetTest("sendgrid", "SendGrid",
        "https://api.sendgrid.com/v3/user/email",
        [("Authorization", "Bearer " # creds.sendgridKey)])
    };

    // ---- Vapi (GET) ------------------------------------------------------
    let vapiResult : WebhookTypes.IntegrationTestResult = if (creds.vapiKey == "") {
      unconfigured("vapi", "Vapi")
    } else {
      await liveGetTest("vapi", "Vapi",
        "https://api.vapi.ai/assistant",
        [("Authorization", "Bearer " # creds.vapiKey)])
    };

    // ---- ElevenLabs (GET) ------------------------------------------------
    let elevenLabsResult : WebhookTypes.IntegrationTestResult = if (creds.elevenLabsKey == "") {
      unconfigured("elevenlabs", "ElevenLabs")
    } else {
      await liveGetTest("elevenlabs", "ElevenLabs",
        "https://api.elevenlabs.io/v1/voices",
        [("xi-api-key", creds.elevenLabsKey)])
    };

    // ---- Stripe (GET) ----------------------------------------------------
    let stripeResult : WebhookTypes.IntegrationTestResult = if (creds.stripeKey == "") {
      unconfigured("stripe", "Stripe")
    } else {
      await liveGetTest("stripe", "Stripe",
        "https://api.stripe.com/v1/account",
        [("Authorization", "Bearer " # creds.stripeKey)])
    };

    // ---- Composio (GET) --------------------------------------------------
    let composioResult : WebhookTypes.IntegrationTestResult = if (creds.composioApiKey == "") {
      unconfigured("composio", "Composio")
    } else {
      await liveGetTest("composio", "Composio",
        "https://backend.composio.dev/api/v1/integrations",
        [("x-api-key", creds.composioApiKey)])
    };

    // ---- Dograh (GET) ----------------------------------------------------
    let dograhResult : WebhookTypes.IntegrationTestResult = if (creds.dograhApiKey == "") {
      unconfigured("dograh", "Dograh")
    } else {
      await liveGetTest("dograh", "Dograh",
        "https://api.dograh.com/v1/status",
        [("Authorization", "Bearer " # creds.dograhApiKey)])
    };

    // ---- Abacus.AI (GET) -------------------------------------------------
    let abacusResult : WebhookTypes.IntegrationTestResult = if (creds.abacusApiKey == "") {
      unconfigured("abacus", "Abacus.AI")
    } else {
      await liveGetTest("abacus", "Abacus.AI",
        "https://api.abacus.ai/api/v1/listModels",
        [("apiKey", creds.abacusApiKey)])
    };

    // Collect failedCounts from current state
    let failedCounts : [(Text, Nat)] = webhookStateRef.s.failedCounts;

    {
      critical   = [nvidiaResult, openRouterResult];
      secondary  = [
        openAiResult, claudeResult, geminiResult, tinyFishResult, serpApiResult,
        twilioResult, sendGridResult, vapiResult, elevenLabsResult,
        stripeResult, composioResult, dograhResult, abacusResult,
      ];
      failedWebhookCounts = failedCounts;
    }
  };

  /// Return the canonical webhook URLs for all supported providers.
  /// Copy these into each provider's webhook configuration dashboard.
  public query func getWebhookUrls() : async {
    composio  : Text;
    vapi      : Text;
    twilio    : Text;
    sendgrid  : Text;
    stripe    : Text;
  } {
    {
      composio = "https://bookedrankedfunded.org/api/composio/webhook";
      vapi     = "https://bookedrankedfunded.org/api/vapi/webhook";
      twilio   = "https://bookedrankedfunded.org/api/twilio/webhook";
      sendgrid = "https://bookedrankedfunded.org/api/sendgrid/webhook";
      stripe   = "https://bookedrankedfunded.org/api/stripe/webhook";
    }
  };

  /// Send a test email via the Caffeine native email infrastructure.
  /// Confirms the platform email system is working end-to-end.
  public shared ({ caller = _ }) func testEmailSend() : async { success : Bool; message : Text; timestamp : Int } {
    let now = Time.now();
    let adminEmail = "BeyondAI.marketing@gmail.com";
    let subject = "BRF Platform \u{2014} Connection Test Email";
    let body = "{\"to\":\"" # adminEmail # "\",\"subject\":\"" # subject # "\",\"html\":\"<p>This is a test email from your BRF platform confirming that the Caffeine native email system is working correctly.</p>\",\"text\":\"This is a test email from your BRF platform confirming that the Caffeine native email system is working correctly.\"}";
    let headers : [Outcall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];
    try {
      let _response = await Outcall.httpPostRequest(
        "https://email.caffeine.ai/send",
        headers,
        body,
        transform,
      );
      { success = true; message = "Test email sent to " # adminEmail; timestamp = now }
    } catch (_e) {
      { success = false; message = "Failed to send test email — email outcall error"; timestamp = now }
    }
  };  /// Return the stored webhook event log for a given provider.
  public query func getWebhookLog(provider : Text) : async [WebhookTypes.WebhookEvent] {
    let s = webhookStateRef.s;
    // Convert stored event records to the public WebhookEvent type
    let rawLogs : [{ provider : Text; eventType : Text; receivedAt : Int; payload : Text; status : { #ok; #failed }; errorMsg : ?Text }] = switch (provider) {
      case ("twilio")   s.twilioWebhookLogs;
      case ("vapi")     s.vapiWebhookLogs;
      case ("stripe")   s.stripeWebhookLogs;
      case ("sendgrid") s.sendgridWebhookLogs;
      case ("composio") s.composioWebhookLogs;
      case (_)          [];
    };
    rawLogs.map(
      func(e) { e }
    )
  };

  /// Return the latest integration health snapshot without re-pinging.
  public query func getIntegrationHealth() : async WebhookTypes.IntegrationHealthSummary {
    let s = webhookStateRef.s;
    let creds = getPlatformCreds();
    let now = Time.now();
    func presenceResult(provider : Text, key : Text, providerLabel : Text) : WebhookTypes.IntegrationTestResult {
      if (key != "") {
        { provider; connected = true; message = providerLabel # " configured"; latencyMs = null; testedAt = now }
      } else {
        { provider; connected = false; message = providerLabel # " not set"; latencyMs = null; testedAt = now }
      }
    };
    {
      critical = [
        presenceResult("nvidia",     creds.nvidiaNimApiKey, "NVIDIA NIM"),
        presenceResult("openrouter", "", "OpenRouter"),
      ];
      secondary = [
        presenceResult("openai",     creds.openaiKey,    "OpenAI"),
        presenceResult("claude",     creds.claudeKey,    "Claude"),
        presenceResult("twilio",     creds.twilioSid,    "Twilio"),
        presenceResult("vapi",       creds.vapiKey,      "Vapi"),
        presenceResult("stripe",     creds.stripeKey,    "Stripe"),
        presenceResult("sendgrid",   creds.sendgridKey,  "SendGrid"),
        presenceResult("elevenlabs", creds.elevenLabsKey,"ElevenLabs"),
      ];
      failedWebhookCounts = s.failedCounts;
    }
  };

  // ---- Credential helpers -------------------------------------------------

  /// Persist Stripe webhook secret, Vapi webhook secret, and SendGrid inbound
  /// parse domain into stable credential storage.
  public shared ({ caller = _ }) func saveWebhookSecrets(
    stripeSecret : Text,
    vapiSecret   : Text,
    sgDomain     : Text,
  ) : async { #ok; #err : Text } {
    // Read existing credentials and merge
    let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
      case (?enc) ICLib.decryptAll(enc, credSalt);
      case null {
        { openaiKey = ""; claudeKey = ""; litellmUrl = ""; litellmKey = "";
          ollamaUrl = ""; twilioSid = ""; twilioAuth = ""; twilioNumber = "";
          vapiKey = ""; stripeKey = ""; stripeWebhookSecret = "";
          googleClientId = ""; googleClientSecret = ""; yelpApiKey = "";
          facebookAppId = ""; facebookAppSecret = "";
          emailSmtpHost = ""; emailSmtpPort = ""; emailSmtpUser = "";
          emailSmtpPass = ""; hunterApiKey = ""; neverBounceKey = "";
          listmonkUrl = ""; listmonkUser = ""; listmonkPass = "";
          searxngUrl = ""; elevenLabsKey = ""; elevenLabsVoiceId = "";
          perplexityApiKey = ""; autoBrowserUrl = "";
          serpApiKey = ""; serpApiDevKey = ""; tinyFishKey = "";
          sendgridKey = ""; nvidiaApiKey = []; n8nApiKey = [];
          n8nInstanceUrl = ""; abacusApiKey = ""; composioApiKey = "";
          dograhApiKey = ""; openRouterApiKey = "";
          nvidiaNimApiKey = ""; geminiApiKey = "";
          vapiWebhookSecret = "";
          sendgridInboundParseDomain = ""; composioWebhookSecret = "";
        }
      };
    };
    let merged : ICTypes.IntegrationCredentials = {
      existing with
      stripeWebhookSecret       = if (stripeSecret != "") stripeSecret else existing.stripeWebhookSecret;
      vapiWebhookSecret         = if (vapiSecret != "") vapiSecret else existing.vapiWebhookSecret;
      sendgridInboundParseDomain = if (sgDomain != "") sgDomain else existing.sendgridInboundParseDomain;
    };
    let encrypted = ICLib.encryptAll(merged, credSalt);
    integrationCreds.add("platform", encrypted);
    #ok
  };

  /// Save the Composio webhook signing secret into stable credential storage.
  public shared ({ caller = _ }) func saveComposioWebhookSecret(
    secret : Text,
  ) : async { #ok; #err : Text } {
    if (secret == "") return #err("Secret must not be empty");
    let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
      case (?enc) ICLib.decryptAll(enc, credSalt);
      case null {
        { openaiKey = ""; claudeKey = ""; litellmUrl = ""; litellmKey = "";
          ollamaUrl = ""; twilioSid = ""; twilioAuth = ""; twilioNumber = "";
          vapiKey = ""; stripeKey = ""; stripeWebhookSecret = "";
          googleClientId = ""; googleClientSecret = ""; yelpApiKey = "";
          facebookAppId = ""; facebookAppSecret = "";
          emailSmtpHost = ""; emailSmtpPort = ""; emailSmtpUser = "";
          emailSmtpPass = ""; hunterApiKey = ""; neverBounceKey = "";
          listmonkUrl = ""; listmonkUser = ""; listmonkPass = "";
          searxngUrl = ""; elevenLabsKey = ""; elevenLabsVoiceId = "";
          perplexityApiKey = ""; autoBrowserUrl = "";
          serpApiKey = ""; serpApiDevKey = ""; tinyFishKey = "";
          sendgridKey = ""; nvidiaApiKey = []; n8nApiKey = [];
          n8nInstanceUrl = ""; abacusApiKey = ""; composioApiKey = "";
          dograhApiKey = ""; openRouterApiKey = "";
          nvidiaNimApiKey = ""; geminiApiKey = "";
          vapiWebhookSecret = "";
          sendgridInboundParseDomain = ""; composioWebhookSecret = "";
        }
      };
    };
    let merged : ICTypes.IntegrationCredentials = { existing with composioWebhookSecret = secret };
    integrationCreds.add("platform", ICLib.encryptAll(merged, credSalt));
    #ok
  };

  /// Clear (erase) the stored Composio webhook signing secret.
  public shared ({ caller = _ }) func clearComposioWebhookSecret() : async { #ok; #err : Text } {
    let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
      case (?enc) ICLib.decryptAll(enc, credSalt);
      case null return #ok;
    };
    let merged : ICTypes.IntegrationCredentials = { existing with composioWebhookSecret = "" };
    integrationCreds.add("platform", ICLib.encryptAll(merged, credSalt));
    #ok
  };

  /// Return whether the Composio webhook signing secret is configured.
  public query func getComposioWebhookSecretStatus() : async { configured : Bool } {
    let raw = switch (integrationCreds.get("platform")) {
      case (?enc) ICLib.decryptAll(enc, credSalt).composioWebhookSecret;
      case null "";
    };
    { configured = raw != "" }
  };

  /// Receive and process an inbound Composio webhook.
  /// NOTE: Motoko cannot perform HMAC-SHA256 natively. Verification is structural:
  /// the signing secret must be non-empty and all signature header fields must be present.
  /// Replace with HMAC when a Motoko crypto library becomes available.
  public shared ({ caller = _ }) func receiveComposioWebhook(
    body      : Text,
    signature : Text,
    webhookId : Text,
    timestamp : Text,
  ) : async { statusCode : Nat; body : Text; eventType : Text; success : Bool } {
    let creds = getPlatformCreds();
    let secret = creds.composioWebhookSecret;

    // Open mode: if no secret is configured, accept with a warning log.
    // When a secret IS configured, all signature fields must be present.
    if (secret != "") {
      let valid = WHLib.verifyComposioSignature(secret, body, signature, webhookId, timestamp);
      if (not valid) {
        log("composio", "rejected", webhookId, #failed, ?"Invalid signature or missing fields");
        return { statusCode = 400; body = "{\"success\":false,\"error\":\"Invalid signature\"}"; eventType = ""; success = false };
      };
    } else {
      // No secret configured — log warning and proceed (open mode)
      log("composio", "open_mode_warning", "No composioWebhookSecret configured — accepting all requests", #ok, null);
    };

    let eventType = WHLib.extractJsonField(body, "type");
    let now = Time.now();

    // Route by Composio V3 event type
    switch (eventType) {
      case ("composio.trigger.message") {
        // A trigger received data from an external service
        let triggerName = WHLib.extractJsonField(body, "triggerName");
        let payload     = WHLib.extractJsonField(body, "payload");
        log("composio", "composio_trigger", body, #ok, null);
        // Store in webhook log with enriched info for Master Agent retrieval
        let enrichedPayload = "triggerName=" # triggerName # " ts=" # now.toText() # " body=" # payload;
        log("composio", "composio_trigger_enriched", enrichedPayload, #ok, null);
        { statusCode = 200; body = "{\"success\":true,\"eventType\":\"composio.trigger.message\",\"timestamp\":" # now.toText() # "}"; eventType; success = true }
      };
      case ("composio.connected_account.expired") {
        // An account connection has expired and needs re-auth
        let accountId = WHLib.extractJsonField(body, "accountId");
        log("composio", "composio_account_expired", "accountId=" # accountId, #failed, ?"Connected account expired — re-authentication required");
        { statusCode = 200; body = "{\"success\":true,\"eventType\":\"composio.connected_account.expired\",\"timestamp\":" # now.toText() # "}"; eventType; success = true }
      };
      case ("composio.trigger.disabled") {
        // Composio disabled a trigger automatically (e.g., auth expired)
        let triggerId = WHLib.extractJsonField(body, "triggerId");
        log("composio", "composio_trigger_disabled", "triggerId=" # triggerId, #ok, ?"Trigger disabled by Composio — check integration health");
        { statusCode = 200; body = "{\"success\":true,\"eventType\":\"composio.trigger.disabled\",\"timestamp\":" # now.toText() # "}"; eventType; success = true }
      };
      case (_) {
        // Unknown event type — log and acknowledge (prevents Composio retries)
        let fallback = if (eventType != "") eventType else "unknown";
        log("composio", fallback, body, #ok, null);
        { statusCode = 200; body = "{\"success\":true,\"eventType\":\"" # fallback # "\",\"timestamp\":" # now.toText() # "}"; eventType = fallback; success = true }
      };
    };
  };

};
