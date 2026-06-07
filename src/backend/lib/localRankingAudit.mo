import T      "../types/roofingCampaign";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import Map    "mo:core/Map";
import List   "mo:core/List";
import Time   "mo:core/Time";
import Text   "mo:core/Text";
import Nat    "mo:core/Nat";
import Float  "mo:core/Float";

module {

  public type Transform = shared query (Outcall.TransformationInput) -> async Outcall.TransformationOutput;

  // ── Grid coordinate helpers ───────────────────────────────────────────────

  /// Approximate offset in degrees latitude/longitude for ~2 miles.
  private let degOffset : Float = 0.029; // ~2 miles

  /// Build the 9 grid points for a given center lat/lng.
  public func buildGridPoints(centerLat : Float, centerLng : Float) : [(Text, Float, Float)] {
    [
      ("Center", centerLat,               centerLng),
      ("N",      centerLat + degOffset,   centerLng),
      ("NE",     centerLat + degOffset,   centerLng + degOffset),
      ("E",      centerLat,               centerLng + degOffset),
      ("SE",     centerLat - degOffset,   centerLng + degOffset),
      ("S",      centerLat - degOffset,   centerLng),
      ("SW",     centerLat - degOffset,   centerLng - degOffset),
      ("W",      centerLat,               centerLng - degOffset),
      ("NW",     centerLat + degOffset,   centerLng - degOffset),
    ];
  };

  // ── SerpApi search ─────────────────────────────────────────────────────────

  /// Geocode city to lat/lng via a simple heuristic (SerpApi doesn't geocode natively;
  /// we embed lat,lng as location parameter for Google Maps search).
  /// Returns a default US city center if no key is available.
  private func cityToLatLng(city : Text, state : Text) : (Float, Float) {
    // Common US city approximations for demo accuracy.
    // In production these would be looked up from a geocoding API.
    let key = (city.toLower() # "," # state.toLower());
    if (key.contains(#text "houston"))     { (29.7604, -95.3698) }
    else if (key.contains(#text "dallas"))  { (32.7767, -96.7970) }
    else if (key.contains(#text "austin"))  { (30.2672, -97.7431) }
    else if (key.contains(#text "atlanta")) { (33.7490, -84.3880) }
    else if (key.contains(#text "chicago")) { (41.8781, -87.6298) }
    else if (key.contains(#text "phoenix")) { (33.4484, -112.0740) }
    else if (key.contains(#text "miami"))   { (25.7617, -80.1918) }
    else if (key.contains(#text "denver"))  { (39.7392, -104.9903) }
    else if (key.contains(#text "seattle")) { (47.6062, -122.3321) }
    else if (key.contains(#text "portland")) { (45.5051, -122.6750) }
    else { (39.5, -98.35) }; // US geographic center as fallback
  };

  /// Call SerpApi.dev to search for a business at a specific lat/lng location.
  /// Returns the rank position (1-20) or 0 if not found.
  public func searchAtLocation(
    serpApiKey   : Text,
    businessName : Text,
    businessType : Text,
    city         : Text,
    lat          : Float,
    lng          : Float,
    transform    : Transform,
  ) : async { rank : Nat; topBusiness : Text } {
    let searchQuery = businessType # " " # city;
    let latStr = debug_show lat;
    let lngStr = debug_show lng;
    let url = "https://serpapi.dev/search.json?engine=google_maps&q="
      # encodeUri(searchQuery)
      # "&ll=@" # latStr # "," # lngStr # ",15z"
      # "&key=" # serpApiKey;
    let headers : [Outcall.Header] = [
      { name = "Accept"; value = "application/json" },
    ];
    try {
      let resp = await Outcall.httpGetRequest(url, headers, transform);
      parseRankFromResponse(resp, businessName);
    } catch (_) {
      { rank = 0; topBusiness = "" };
    };
  };

  /// Parse rank position and top business from SerpApi Google Maps response.
  private func parseRankFromResponse(raw : Text, businessName : Text) : { rank : Nat; topBusiness : Text } {
    let normalName = businessName.toLower();
    var rank : Nat = 0;
    var topBiz : Text = "";
    var pos : Nat = 1;

    let titleMarker = "\"title\":\"";
    let segments = raw.split(#text titleMarker);
    var isFirst = true;
    label outerLoop for (seg in segments) {
      if (isFirst) { isFirst := false }
      else {
        var title = "";
        label innerChars for (ch in seg.chars()) {
          if (ch == '\"') break innerChars;
          title := title # Text.fromChar(ch);
        };
        if (topBiz == "" and title != "") { topBiz := title };
        if (rank == 0 and title.toLower().contains(#text normalName)) {
          rank := pos;
        };
        pos += 1;
        if (pos > 20) break outerLoop;
      };
    };

    { rank; topBusiness = topBiz };
  };

  /// URL-encode a query string (spaces → %20, basic chars).
  private func encodeUri(s : Text) : Text {
    s.replace(#char ' ', "%20")
     .replace(#char '&', "%26")
     .replace(#char '#', "%23")
     .replace(#char '+', "%2B");
  };

  // ── Grid audit orchestration ───────────────────────────────────────────────

  /// Run a full 9-point grid audit for a roofing business.
  public func runGridAudit(
    serpApiKey   : Text,
    leadEmail    : Text,
    businessName : Text,
    city         : Text,
    state        : Text,
    businessType : Text,
    transform    : Transform,
  ) : async T.GridAuditResult {
    let (centerLat, centerLng) = cityToLatLng(city, state);
    let gridDefs = buildGridPoints(centerLat, centerLng);
    let results = List.empty<T.GridPoint>();
    var rank1Count : Nat = 0;
    var foundCount : Nat = 0;

    for ((dir, lat, lng) in gridDefs.vals()) {
      let res = await searchAtLocation(
        serpApiKey, businessName, businessType, city, lat, lng, transform
      );
      let gp : T.GridPoint = {
        direction = dir;
        lat;
        lng;
        rankPosition    = res.rank;
        competitorAtTop = res.topBusiness;
        searched        = true;
      };
      results.add(gp);
      if (res.rank == 1) { rank1Count += 1 };
      if (res.rank > 0)  { foundCount  += 1 };
    };

    let summary = buildCoverageSummary(businessName, foundCount, rank1Count);
    {
      leadEmail;
      businessName;
      city;
      state;
      gridPoints          = results.toArray();
      scannedAt           = Time.now();
      coverageZoneSummary = summary;
    };
  };

  /// Build a human-readable summary of grid coverage.
  public func buildCoverageSummary(
    businessName : Text,
    foundCount   : Nat,
    rank1Count   : Nat,
  ) : Text {
    let total = 9;
    let pct   = (foundCount * 100) / total;
    if (foundCount == 0) {
      businessName # " does not appear in any of the 9 grid search points. " #
      "The business is effectively invisible to customers searching from outside their immediate block.";
    } else if (rank1Count >= 7) {
      businessName # " ranks in the top results at " # foundCount.toText() # " of 9 grid points (" # pct.toText() # "%). Strong local coverage.";
    } else if (rank1Count >= 4) {
      businessName # " shows up at " # foundCount.toText() # " of 9 grid points (" # pct.toText() # "%). " #
      "Ranking is concentrated near the business address. Customers searching 2+ miles away may not see them.";
    } else {
      businessName # " only appears at " # foundCount.toText() # " of 9 grid points (" # pct.toText() # "%). " #
      "Critical gap: competitors are capturing the majority of local search traffic outside the business's block.";
    };
  };

  /// Build audit summary text for use in email prompts.
  public func buildAuditSummaryForEmail(
    result : T.GridAuditResult,
  ) : Text {
    var visibleCount : Nat = 0;
    var top1Count    : Nat = 0;
    for (gp in result.gridPoints.vals()) {
      if (gp.rankPosition > 0)  { visibleCount += 1 };
      if (gp.rankPosition == 1) { top1Count    += 1 };
    };
    result.businessName # " appears in " # visibleCount.toText() # " of 9 search zones around " # result.city #
    ". Ranking #1 in " # top1Count.toText() # " zones. " # result.coverageZoneSummary;
  };

};
