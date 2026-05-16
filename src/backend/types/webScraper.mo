import Time "mo:core/Time";

module {

  /// Selector type: CSS or XPath
  public type SelectorType = { #css; #xpath };

  /// Scrape mode: only static HTML is supported; dynamic content is flagged.
  public type ScrapeMode = { #static_ };

  /// Output format requested by caller
  public type OutputFormat = { #text_; #html; #both };

  /// Scrape error variants
  public type ScrapeError = {
    #timeout;
    #robotsBlocked;
    #invalidUrl;
    #invalidSelector;
    #networkError;
    #dynamicContent;
    #tooManyRequests;
  };

  /// Status of a scrape run
  public type ScrapeStatus = { #pending; #success; #failed };

  /// A single extracted item from the scraped page
  public type ScrapeItem = {
    text    : ?Text;
    html    : ?Text;
    href    : ?Text;
    src     : ?Text;
    attributes : [(Text, Text)];
  };

  /// A lead extracted from scraped page content
  public type ScrapedLead = {
    businessName : ?Text;
    email        : ?Text;
    phone        : ?Text;
    sourceUrl    : Text;
    extractedAt  : Time.Time;
  };

  /// Input request for a single scrape
  public type ScrapeRequest = {
    url           : Text;
    selector      : Text;
    selectorType  : SelectorType;
    outputFormat  : OutputFormat;
    limit         : Nat;              // max items (1–250)
    waitSelectorMs : Nat;             // unused for static but stored
  };

  /// Result of a scrape run
  public type ScrapeResult = {
    ok             : Bool;
    requestUrl     : Text;
    finalUrl       : Text;
    httpStatus     : ?Nat;
    items          : [ScrapeItem];
    leads          : [ScrapedLead];
    isDynamic      : Bool;            // true when dynamic-content heuristic fires
    error          : ?ScrapeError;
    errorMessage   : ?Text;
    durationMs     : Nat;
    scrapedAt      : Time.Time;
  };

  /// Persistent history entry (stored in scrapeHistory)
  public type ScrapeRecord = {
    id             : Nat;
    tenantId       : Text;
    request        : ScrapeRequest;
    result         : ScrapeResult;
    robotsChecked  : Bool;
    robotsAllowed  : Bool;
    createdAt      : Time.Time;
  };

  /// Batch scrape request (up to 10 URLs)
  public type BatchScrapeRequest = {
    urls         : [Text];
    selector     : Text;
    selectorType : SelectorType;
    outputFormat : OutputFormat;
    limitPerUrl  : Nat;
  };

  /// Per-URL result within a batch
  public type BatchScrapeUrlResult = {
    url    : Text;
    result : ScrapeResult;
  };

  /// Result of a batch scrape
  public type BatchScrapeResult = {
    ok      : Bool;
    count   : Nat;
    results : [BatchScrapeUrlResult];
  };

  /// robots.txt check result
  public type RobotsCheckResult = {
    url      : Text;
    allowed  : Bool;
    reason   : Text;
  };

  /// Lead extraction result from a scraped page
  public type LeadExtractionResult = {
    sourceUrl  : Text;
    leads      : [ScrapedLead];
    count      : Nat;
  };

};
