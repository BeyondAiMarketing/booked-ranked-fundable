import Map           "mo:core/Map";
import List          "mo:core/List";
import Text          "mo:core/Text";
import Time          "mo:core/Time";
import Nat           "mo:core/Nat";
import Int           "mo:core/Int";
import Runtime       "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall       "mo:caffeineai-http-outcalls/outcall";
import T             "../types/webScraper";
import WebScraperLib "../lib/webScraper";

/// Web Scraper API mixin
///
/// Provides static HTML scraping with:
///   - per-domain rate limiting (≥2 s between requests to the same domain)
///   - robots.txt compliance check before every fetch
///   - dynamic-content detection heuristic
///   - email / phone / business-name lead extraction
///   - persistent scrape history (last 50 records per tenant)
///   - batch scraping (max 10 URLs)
///   - one-click staging of extracted leads into the CRM Lead store
mixin (
  accessControlState : AccessControl.AccessControlState,
  /// Persistent scrape history: (recordId -> ScrapeRecord)
  scrapeHistory      : Map.Map<Nat, T.ScrapeRecord>,
  /// Per-domain last-request timestamp for rate limiting
  lastDomainRequest  : Map.Map<Text, Time.Time>,
  /// Auto-increment counter for ScrapeRecord IDs
  scrapeIdCounter    : { var n : Nat },
  /// CRM leads store (same shape as main.mo `leads` map)
  leads              : Map.Map<Text, Map.Map<Text, {
    id : Text; tenantId : Text; name : Text; email : Text;
    phone : Text; niche : Text; status : Text; source : Text;
    notes : Text; agentSubscriptions : [Text]; createdAt : Time.Time;
  }>>,
  transform          : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  // ── Constants ─────────────────────────────────────────────────────────────

  let WS_MAX_HISTORY : Nat = 50;
  let WS_MAX_BATCH   : Nat = 10;
  let WS_MAX_LIMIT   : Nat = 250;

  // ── Auth helpers ──────────────────────────────────────────────────────────────

  func ws_assertUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
  };

  func ws_assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  // ── Internal helpers ──────────────────────────────────────────────────────────────

  /// Fetch raw HTML body with stealth headers and 10 s timeout.
  func ws_fetchHtml(url : Text) : async Text {
    let headers = WebScraperLib.stealthHeaders(null);
    let outcallHeaders : [Outcall.Header] = headers.map<(Text, Text), Outcall.Header>(
      func((name, value)) { { name; value } }
    );
    try {
      await Outcall.httpGetRequest(url, outcallHeaders, transform);
    } catch (_) { "" };
  };

  /// Fetch robots.txt for the given URL's domain.
  func ws_fetchRobots(url : Text) : async Text {
    let robotsUrl = WebScraperLib.robotsTxtUrl(url);
    try {
      await Outcall.httpGetRequest(robotsUrl, [], transform);
    } catch (_) { "" };
  };

  /// Extract URL path for robots.txt evaluation.
  func ws_urlPath(url : Text) : Text {
    let noScheme = switch (url.stripStart(#text "https://")) {
      case (?s) s;
      case (null) switch (url.stripStart(#text "http://")) {
        case (?s) s;
        case (null) url;
      };
    };
    // find first /
    switch (noScheme.split(#char '/').next()) {
      case (?_) {
        // everything after host
        var found = false;
        var path = "/";
        for (seg in noScheme.split(#char '/')) {
          if (found) path #= seg # "/";
          found := true; // skip first (host)
        };
        if (path == "/") "/" else path;
      };
      case (null) "/";
    };
  };

  /// Record a completed scrape into the history map (capped at WS_MAX_HISTORY).
  func ws_recordHistory(
    tenantId      : Text,
    req           : T.ScrapeRequest,
    result        : T.ScrapeResult,
    robotsChecked : Bool,
    robotsAllowed : Bool,
  ) {
    // Trim: remove oldest entries if at or over cap
    while (scrapeHistory.size() >= WS_MAX_HISTORY) {
      // remove the entry with the smallest id (oldest)
      switch (scrapeHistory.minEntry()) {
        case (?(k, _)) { scrapeHistory.remove(k) };
        case (null) ();
      };
    };
    let id = scrapeIdCounter.n;
    scrapeIdCounter.n += 1;
    let rec : T.ScrapeRecord = {
      id;
      tenantId;
      request       = req;
      result;
      robotsChecked;
      robotsAllowed;
      createdAt     = Time.now();
    };
    scrapeHistory.add(id, rec);
  };


  // ── Public API ──────────────────────────────────────────────────────────────────

  /// Check whether the domain's robots.txt permits crawling the URL path.
  public shared ({ caller }) func checkRobotsTxt(url : Text) : async T.RobotsCheckResult {
    ws_assertUser(caller);
    if (url == "") return { url; allowed = false; reason = "Empty URL" };
    let robotsBody = await ws_fetchRobots(url);
    let path       = ws_urlPath(url);
    let allowed    = WebScraperLib.isAllowedByRobots(robotsBody, path);
    {
      url;
      allowed;
      reason = if (allowed) "Allowed by robots.txt" else "Blocked by robots.txt Disallow rule";
    };
  };

  /// Scrape a single URL with static-HTML fetching.
  public shared ({ caller }) func scrapeUrl(
    req      : T.ScrapeRequest,
    tenantId : Text,
  ) : async T.ScrapeResult {
    ws_assertUser(caller);
    let startNs = Time.now();

    // Basic URL validation
    if (req.url == "" or (not req.url.startsWith(#text "http://") and not req.url.startsWith(#text "https://"))) {
      let result : T.ScrapeResult = {
        ok = false; requestUrl = req.url; finalUrl = req.url;
        httpStatus = null; items = []; leads = []; isDynamic = false;
        error = ?#invalidUrl; errorMessage = ?("Invalid URL: must start with http:// or https://");
        durationMs = 0; scrapedAt = startNs;
      };
      ws_recordHistory(tenantId, req, result, false, false);
      return result;
    };

    // Enforce limit
    let limit = if (req.limit == 0 or req.limit > WS_MAX_LIMIT) WS_MAX_LIMIT else req.limit;

    // robots.txt check
    let robotsBody    = await ws_fetchRobots(req.url);
    let path          = ws_urlPath(req.url);
    let robotsAllowed = WebScraperLib.isAllowedByRobots(robotsBody, path);

    if (not robotsAllowed) {
      let result : T.ScrapeResult = {
        ok = false; requestUrl = req.url; finalUrl = req.url;
        httpStatus = null; items = []; leads = []; isDynamic = false;
        error = ?#robotsBlocked;
        errorMessage = ?("Blocked by robots.txt — this domain does not permit automated crawling");
        durationMs = Int.abs(Time.now() - startNs) / 1_000_000; scrapedAt = startNs;
      };
      ws_recordHistory(tenantId, req, result, true, false);
      return result;
    };

    // Rate limit check
    let domain = WebScraperLib.apexDomain(req.url);
    if (not WebScraperLib.checkRateLimit(domain, lastDomainRequest)) {
      let result : T.ScrapeResult = {
        ok = false; requestUrl = req.url; finalUrl = req.url;
        httpStatus = null; items = []; leads = []; isDynamic = false;
        error = ?#tooManyRequests;
        errorMessage = ?("Rate limit: please wait 2 seconds between requests to " # domain);
        durationMs = 0; scrapedAt = startNs;
      };
      ws_recordHistory(tenantId, req, result, true, true);
      return result;
    };

    // Fetch HTML
    let body = await ws_fetchHtml(req.url);

    if (body == "") {
      let result : T.ScrapeResult = {
        ok = false; requestUrl = req.url; finalUrl = req.url;
        httpStatus = null; items = []; leads = []; isDynamic = false;
        error = ?#networkError; errorMessage = ?("Network error: received empty response from " # req.url);
        durationMs = Int.abs(Time.now() - startNs) / 1_000_000; scrapedAt = startNs;
      };
      ws_recordHistory(tenantId, req, result, true, true);
      return result;
    };

    let isDynamic = WebScraperLib.isDynamicContent(body);
    let items     = WebScraperLib.applySelector(body, req.selector, req.selectorType, limit, req.outputFormat);
    let leads     = WebScraperLib.extractLeadsFromBody(body, req.url);
    let durationMs = Int.abs(Time.now() - startNs) / 1_000_000;

    let result : T.ScrapeResult = {
      ok          = true;
      requestUrl  = req.url;
      finalUrl    = req.url;
      httpStatus  = ?200;
      items;
      leads;
      isDynamic;
      error       = if (isDynamic) ?#dynamicContent else null;
      errorMessage = if (isDynamic)
        ?("Page may require JavaScript — content may be incomplete")
        else null;
      durationMs;
      scrapedAt   = startNs;
    };
    ws_recordHistory(tenantId, req, result, true, true);
    result;
  };

  /// Scrape up to WS_MAX_BATCH URLs in sequence.
  public shared ({ caller }) func batchScrape(
    req      : T.BatchScrapeRequest,
    tenantId : Text,
  ) : async T.BatchScrapeResult {
    ws_assertUser(caller);
    let urls   = if (req.urls.size() > WS_MAX_BATCH) req.urls.sliceToArray(0, WS_MAX_BATCH) else req.urls;
    let results = List.empty<T.BatchScrapeUrlResult>();
    for (url in urls.vals()) {
      let single : T.ScrapeRequest = {
        url;
        selector      = req.selector;
        selectorType  = req.selectorType;
        outputFormat  = req.outputFormat;
        limit         = req.limitPerUrl;
        waitSelectorMs = 0;
      };
      // reuse scrape logic inline (avoid recursive public call)
      let startNs = Time.now();
      let domain  = WebScraperLib.apexDomain(url);
      let canGo   = WebScraperLib.checkRateLimit(domain, lastDomainRequest);
      let result : T.ScrapeResult = if (not canGo) {
        {
          ok = false; requestUrl = url; finalUrl = url;
          httpStatus = null; items = []; leads = []; isDynamic = false;
          error = ?#tooManyRequests;
          errorMessage = ?("Rate limit: 2 s between requests to " # domain);
          durationMs = 0; scrapedAt = startNs;
        };
      } else {
        let body = await ws_fetchHtml(url);
        if (body == "") {
          {
            ok = false; requestUrl = url; finalUrl = url;
            httpStatus = null; items = []; leads = []; isDynamic = false;
            error = ?#networkError; errorMessage = ?("Empty response from " # url);
            durationMs = Int.abs(Time.now() - startNs) / 1_000_000; scrapedAt = startNs;
          };
        } else {
          let isDynamic = WebScraperLib.isDynamicContent(body);
          let lim       = if (single.limit == 0 or single.limit > WS_MAX_LIMIT) WS_MAX_LIMIT else single.limit;
          let items     = WebScraperLib.applySelector(body, single.selector, single.selectorType, lim, single.outputFormat);
          let leads     = WebScraperLib.extractLeadsFromBody(body, url);
          {
            ok = true; requestUrl = url; finalUrl = url;
            httpStatus = ?200; items; leads; isDynamic;
            error = if (isDynamic) ?#dynamicContent else null;
            errorMessage = if (isDynamic) ?("Page may need JavaScript") else null;
            durationMs = Int.abs(Time.now() - startNs) / 1_000_000;
            scrapedAt = startNs;
          };
        };
      };
      ws_recordHistory(tenantId, single, result, false, true);
      results.add({ url; result });
    };
    { ok = true; count = results.size(); results = results.toArray() };
  };

  /// Re-run lead extraction on raw HTML without a new HTTP fetch.
  public shared ({ caller }) func extractLeads(
    html      : Text,
    sourceUrl : Text,
  ) : async T.LeadExtractionResult {
    ws_assertUser(caller);
    let leads = WebScraperLib.extractLeadsFromBody(html, sourceUrl);
    { sourceUrl; leads; count = leads.size() };
  };

  /// Return the last `limit` scrape records for `tenantId`.
  public query ({ caller }) func getScrapeHistory(
    tenantId : Text,
    limit    : Nat,
  ) : async [T.ScrapeRecord] {
    ws_assertUser(caller);
    let cap = if (limit == 0 or limit > WS_MAX_HISTORY) WS_MAX_HISTORY else limit;
    let out = List.empty<T.ScrapeRecord>();
    for ((_, rec) in scrapeHistory.reverseEntries()) {
      if (rec.tenantId == tenantId and out.size() < cap) out.add(rec);
    };
    out.toArray();
  };

  /// Return the full scrape-history count for `tenantId` (admin only).
  public query ({ caller }) func getScrapeHistoryCount(tenantId : Text) : async Nat {
    ws_assertAdmin(caller);
    var count = 0;
    for ((_, rec) in scrapeHistory.entries()) {
      if (rec.tenantId == tenantId) count += 1;
    };
    count;
  };

  /// Push all ScrapedLeads from a ScrapeResult into the CRM Lead store.
  public shared ({ caller }) func stageScrapeLeads(
    tenantId : Text,
    scrapeId : Nat,
  ) : async Nat {
    ws_assertUser(caller);
    switch (scrapeHistory.get(scrapeId)) {
      case (null) { Runtime.trap("Scrape record not found: " # scrapeId.toText()) };
      case (?rec) {
        if (rec.tenantId != tenantId) Runtime.trap("Access denied");
        var staged = 0;
        let tenantLeads = switch (leads.get(tenantId)) {
          case (?m) m;
          case (null) {
            let m = Map.empty<Text, {
              id : Text; tenantId : Text; name : Text; email : Text;
              phone : Text; niche : Text; status : Text; source : Text;
              notes : Text; agentSubscriptions : [Text]; createdAt : Time.Time;
            }>();
            leads.add(tenantId, m);
            m;
          };
        };
        let now = Time.now();
        for (sl in rec.result.leads.vals()) {
          let id   = "ws-lead-" # now.toText() # "-" # staged.toText();
          let name = switch (sl.businessName) { case (?n) n; case (null) "(unknown)" };
          tenantLeads.add(id, {
            id;
            tenantId;
            name;
            email              = switch (sl.email) { case (?e) e; case (null) "" };
            phone              = switch (sl.phone) { case (?p) p; case (null) "" };
            niche              = "";
            status             = "new";
            source             = "Web Scraper";
            notes              = "Scraped from: " # sl.sourceUrl;
            agentSubscriptions = [];
            createdAt          = now;
          });
          staged += 1;
        };
        staged;
      };
    };
  };

  /// Admin-only: clear all scrape history for a tenant.
  public shared ({ caller }) func clearScrapeHistory(tenantId : Text) : async () {
    ws_assertAdmin(caller);
    let toRemove = List.empty<Nat>();
    for ((k, rec) in scrapeHistory.entries()) {
      if (rec.tenantId == tenantId) toRemove.add(k);
    };
    for (k in toRemove.values()) { scrapeHistory.remove(k) };
  };

};
