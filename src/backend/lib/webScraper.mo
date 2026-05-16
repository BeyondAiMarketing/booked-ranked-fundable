import Map  "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat  "mo:core/Nat";
import Int  "mo:core/Int";
import T    "../types/webScraper";

module {

  // ── Rate-limit helpers ────────────────────────────────────────────────────

  /// Extract the apex domain from a URL for rate-limit keying.
  public func apexDomain(url : Text) : Text {
    let noScheme = switch (url.stripStart(#text "https://")) {
      case (?s) s;
      case (null) switch (url.stripStart(#text "http://")) {
        case (?s) s;
        case (null) url;
      };
    };
    let noWww = switch (noScheme.stripStart(#text "www.")) {
      case (?s) s;
      case (null) noScheme;
    };
    switch (noWww.split(#char '/').next()) {
      case (?h) h;
      case (null) noWww;
    };
  };

  /// Returns true when at least 2 seconds have elapsed since the last request
  /// to the same domain. Updates lastDomainRequest on success.
  public func checkRateLimit(
    domain            : Text,
    lastDomainRequest : Map.Map<Text, Time.Time>,
  ) : Bool {
    let now : Int = Time.now();
    let rateLimitNs : Int = 2_000_000_000;
    switch (lastDomainRequest.get(domain)) {
      case (?last) {
        if (now - last < rateLimitNs) return false;
      };
      case (null) {};
    };
    lastDomainRequest.add(domain, now);
    true;
  };

  // ── Dynamic-content heuristic ─────────────────────────────────────────────

  /// Returns true when the response body looks like a JavaScript-gated page.
  /// Heuristic: body < 500 chars OR contains "enable javascript" (case-insensitive).
  public func isDynamicContent(body : Text) : Bool {
    if (body.size() < 500) return true;
    body.toLower().contains(#text "enable javascript");
  };

  // ── robots.txt parsing ────────────────────────────────────────────────────

  /// Parse a robots.txt body and decide whether `path` is allowed for *.
  public func isAllowedByRobots(robotsBody : Text, path : Text) : Bool {
    let disallowed = List.empty<Text>();
    var inStarBlock = false;
    for (rawLine in robotsBody.split(#char '\n')) {
      let line = rawLine.trim(#char ' ').trim(#char '\r').trim(#char '\t');
      let lower = line.toLower();
      if (lower.startsWith(#text "user-agent:")) {
        let val = switch (lower.stripStart(#text "user-agent:")) {
          case (?s) s.trim(#char ' ');
          case (null) "";
        };
        inStarBlock := (val == "*");
      } else if (inStarBlock and lower.startsWith(#text "disallow:")) {
        let val = switch (lower.stripStart(#text "disallow:")) {
          case (?s) s.trim(#char ' ');
          case (null) "";
        };
        if (val != "") disallowed.add(val);
      };
    };
    for (dpath in disallowed.values()) {
      if (path.startsWith(#text dpath)) return false;
    };
    true;
  };

  /// Build the robots.txt URL for a given target URL.
  public func robotsTxtUrl(targetUrl : Text) : Text {
    // extract scheme + host
    let (scheme, rest) =
      switch (targetUrl.stripStart(#text "https://")) {
        case (?r) ("https", r);
        case (null) switch (targetUrl.stripStart(#text "http://")) {
          case (?r) ("http", r);
          case (null) ("https", targetUrl);
        };
      };
    let host = switch (rest.split(#char '/').next()) {
      case (?h) h;
      case (null) rest;
    };
    scheme # "://" # host # "/robots.txt";
  };

  // ── Internal HTML helpers ────────────────────────────────────────────────────

  /// Find the first occurrence of `needle` in `haystack`; returns char offset.
  func findSubstring(haystack : Text, needle : Text) : ?Nat {
    if (needle.size() == 0) return ?0;
    let hArr = haystack.toArray();
    let nArr = needle.toArray();
    let hn   = hArr.size();
    let nn   = nArr.size();
    if (nn > hn) return null;
    var i = 0;
    while (i + nn <= hn) {
      var match = true;
      var k = 0;
      while (k < nn) {
        if (hArr[i + k] != nArr[k]) { match := false };
        k += 1;
      };
      if (match) return ?i;
      i += 1;
    };
    null;
  };

  func stripTags(html : Text) : Text {
    var result = "";
    var inTag  = false;
    for (c in html.toIter()) {
      if      (c == '<')  { inTag := true }
      else if (c == '>')  { inTag := false }
      else if (not inTag) { result #= Text.fromChar(c) };
    };
    result;
  };

  func extractAttrValue(snippet : Text, attr : Text) : ?Text {
    let needle = attr # "=\"";
    switch (findSubstring(snippet.toLower(), needle.toLower())) {
      case (null) null;
      case (?pos) {
        let arr   = snippet.toArray();
        let after = Text.fromArray(arr.sliceToArray(pos + needle.size(), arr.size()));
        switch (after.split(#text "\"").next()) {
          case (?v) {
            let t = v.trim(#char ' ');
            if (t == "") null else ?t;
          };
          case (null) null;
        };
      };
    };
  };

  func extractTagText(html : Text, tag : Text) : ?Text {
    let openNeedle = "<" # tag.toLower();
    switch (findSubstring(html.toLower(), openNeedle)) {
      case (null) null;
      case (?pos) {
        let arr   = html.toArray();
        let after = Text.fromArray(arr.sliceToArray(pos, arr.size()));
        switch (findSubstring(after, ">")) {
          case (null) null;
          case (?close) {
            let limit  = Nat.min(close + 201, after.size());
            let aArr   = after.toArray();
            let content = Text.fromArray(aArr.sliceToArray(close + 1, limit));
            let t = stripTags(content).trim(#char ' ');
            if (t == "") null else ?t;
          };
        };
      };
    };
  };

  func extractJsonField(html : Text, field : Text) : ?Text {
    let needle = "\"" # field # "\":";
    switch (findSubstring(html, needle)) {
      case (null) null;
      case (?pos) {
        let arr   = html.toArray();
        let after = Text.fromArray(arr.sliceToArray(pos + needle.size(), arr.size()));
        let trimmed = after.trimStart(#char ' ');
        if (trimmed.startsWith(#text "\"")) {
          let inner = switch (trimmed.stripStart(#text "\"")) {
            case (?s) s;
            case (null) trimmed;
          };
          switch (inner.split(#text "\"").next()) {
            case (?v) ?v;
            case (null) null;
          };
        } else null;
      };
    };
  };

  func extractMetaContent(html : Text, propOrName : Text) : ?Text {
    let lower  = html.toLower();
    let needle1 = "property=\"" # propOrName.toLower() # "\"";
    let needle2 = "name=\""     # propOrName.toLower() # "\"";
    let searchNeedle =
      if   (lower.contains(#text needle1)) needle1
      else if (lower.contains(#text needle2)) needle2
      else return null;
    switch (findSubstring(lower, searchNeedle)) {
      case (null) null;
      case (?pos) {
        let arr    = html.toArray();
        let winEnd = Nat.min(pos + 500, arr.size());
        let window = Text.fromArray(arr.sliceToArray(pos, winEnd));
        extractAttrValue(window, "content");
      };
    };
  };

  // ── Lead extraction ───────────────────────────────────────────────────────

  func isEmailLocalChar(c : Char) : Bool {
    (c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z') or
    (c >= '0' and c <= '9') or c == '.' or c == '_' or
    c == '%' or c == '+' or c == '-';
  };

  func isEmailDomainChar(c : Char) : Bool {
    (c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z') or
    (c >= '0' and c <= '9') or c == '.' or c == '-';
  };

  /// Extract emails using char-by-char @-scan.
  public func extractEmails(body : Text) : [Text] {
    let chars   = body.toArray();
    let n       = chars.size();
    let results = List.empty<Text>();
    let seen    = List.empty<Text>();
    var i = 0;
    while (i < n) {
      if (chars[i] == '@' and i > 0 and i + 1 < n) {
        // scan backward for local part
        var j = i - 1;
        while (j > 0 and isEmailLocalChar(chars[j])) { j -= 1 };
        if (not isEmailLocalChar(chars[j])) j += 1;
        if (j < i) {
          let localPart = Text.fromArray(chars.sliceToArray(j, i));
          // scan forward for domain
          var k = i + 1;
          while (k < n and isEmailDomainChar(chars[k])) { k += 1 };
          let domainPart = Text.fromArray(chars.sliceToArray(i + 1, k));
          if (domainPart.contains(#char '.') and domainPart.size() >= 4) {
            let email = localPart # "@" # domainPart;
            if (seen.find(func(e : Text) : Bool { e == email }) == null) {
              results.add(email);
              seen.add(email);
            };
          };
        };
      };
      i += 1;
    };
    results.toArray();
  };

  func isDigit(c : Char) : Bool { c >= '0' and c <= '9' };

  /// Extract 10-digit North-American phone numbers.
  public func extractPhones(body : Text) : [Text] {
    let chars   = body.toArray();
    let n       = chars.size();
    let results = List.empty<Text>();
    let seen    = List.empty<Text>();
    var i = 0;
    while (i < n) {
      if (isDigit(chars[i]) or chars[i] == '(') {
        let start = i;
        var digitCount = 0;
        var j = i;
        // collect up to 20 chars to look for 10 digits
        while (j < n and j < i + 20 and digitCount <= 10) {
          let c = chars[j];
          if (isDigit(c)) digitCount += 1;
          j += 1;
        };
        if (digitCount == 10) {
          let raw = Text.fromArray(chars.sliceToArray(start, j)).trim(#char ' ');
          if (seen.find(func(p : Text) : Bool { p == raw }) == null) {
            results.add(raw);
            seen.add(raw);
          };
          i := j;
        } else {
          i += 1;
        };
      } else {
        i += 1;
      };
    };
    results.toArray();
  };

  /// Extract business name (og:site_name → application-name → JSON-LD name → h1 → h2).
  public func extractBusinessName(html : Text) : ?Text {
    switch (extractMetaContent(html, "og:site_name")) {
      case (?v) if (v != "") return ?v;
      case (_) {};
    };
    switch (extractMetaContent(html, "application-name")) {
      case (?v) if (v != "") return ?v;
      case (_) {};
    };
    if (html.toLower().contains(#text "\"name\":")) {
      switch (extractJsonField(html, "name")) {
        case (?v) if (v != "") return ?v;
        case (_) {};
      };
    };
    switch (extractTagText(html, "h1")) {
      case (?v) if (v != "") return ?v;
      case (_) {};
    };
    switch (extractTagText(html, "h2")) {
      case (?v) if (v != "") return ?v;
      case (_) {};
    };
    null;
  };

  /// Combine extractions into ScrapedLead records.
  public func extractLeadsFromBody(html : Text, sourceUrl : Text) : [T.ScrapedLead] {
    let now    = Time.now();
    let emails = extractEmails(html);
    let phones = extractPhones(html);
    let biz    = extractBusinessName(html);
    let results = List.empty<T.ScrapedLead>();
    if (emails.size() > 0) {
      var pi = 0;
      for (email in emails.vals()) {
        let phone : ?Text = if (pi < phones.size()) ?phones[pi] else null;
        results.add({ businessName = biz; email = ?email; phone; sourceUrl; extractedAt = now });
        pi += 1;
      };
    } else if (phones.size() > 0) {
      for (phone in phones.vals()) {
        results.add({ businessName = biz; email = null; phone = ?phone; sourceUrl; extractedAt = now });
      };
    } else if (biz != null) {
      results.add({ businessName = biz; email = null; phone = null; sourceUrl; extractedAt = now });
    };
    results.toArray();
  };

  // ── CSS / XPath selector matching ─────────────────────────────────────────

  type CssParsed = { tag : Text; class_ : ?Text; id : ?Text; attr : ?Text };

  func parseCssSelector(sel : Text) : CssParsed {
    var work   = sel;
    var class_ : ?Text = null;
    var id     : ?Text = null;
    var attr   : ?Text = null;
    // strip [attr] suffix
    if (work.contains(#char '[')) {
      let parts = work.split(#char '[');
      var tag2 = "";
      var idx  = 0;
      for (p in parts) {
        if (idx == 0) { tag2 := p }
        else {
          attr := switch (p.stripEnd(#text "]")) {
            case (?s) ?s;
            case (null) ?p;
          };
        };
        idx += 1;
      };
      work := tag2;
    };
    // strip .class
    if (work.contains(#char '.')) {
      let parts = work.split(#char '.');
      var tag2 = "";
      var idx  = 0;
      for (p in parts) {
        if (idx == 0) tag2 := p else class_ := ?p;
        idx += 1;
      };
      work := tag2;
    };
    // strip #id
    if (work.contains(#char '#')) {
      let parts = work.split(#char '#');
      var tag2 = "";
      var idx  = 0;
      for (p in parts) {
        if (idx == 0) tag2 := p else id := ?p;
        idx += 1;
      };
      work := tag2;
    };
    let tag = if (work == "") "div" else work;
    { tag; class_; id; attr };
  };

  func findNextOpenTag(html : Text, tag : Text, from : Nat) : ?(Nat, Nat) {
    let lower  = html.toLower();
    let hArr   = lower.toArray();
    let hn     = hArr.size();
    let needle = "<" # tag.toLower();
    let nArr   = needle.toArray();
    let nn     = nArr.size();
    var i = from;
    while (i + nn <= hn) {
      var match = true;
      var k = 0;
      while (k < nn) {
        if (hArr[i + k] != nArr[k]) { match := false };
        k += 1;
      };
      if (match and i + nn < hn) {
        let next = hArr[i + nn];
        if (next == ' ' or next == '>' or next == '/' or next == '\t' or next == '\n') {
          // find close >
          var j = i + nn;
          var inStr  = false;
          var strCh  : Char = ' ';
          while (j < hn) {
            let c = hArr[j];
            if (inStr) {
              if (c == strCh) inStr := false;
            } else {
              if   (c == '\u{22}' or c == '\u{27}') { inStr := true; strCh := c }
              else if (c == '>')            { return ?(i, j) };
            };
            j += 1;
          };
          return ?(i, hn - 1);
        };
      };
      i += 1;
    };
    null;
  };

  func matchesCssFilter(tagSnippet : Text, parsed : CssParsed) : Bool {
    let lower = tagSnippet.toLower();
    switch (parsed.class_) {
      case (?cls) {
        switch (extractAttrValue(lower, "class")) {
          case (?classes) {
            // class must contain the token as a space-separated word
            if (classes.split(#char ' ').find(func(c : Text) : Bool { c == cls.toLower() }) == null)
              return false;
          };
          case (null) return false;
        };
      };
      case (null) {};
    };
    switch (parsed.id) {
      case (?idVal) {
        switch (extractAttrValue(lower, "id")) {
          case (?v) if (v != idVal.toLower()) return false;
          case (null) return false;
        };
      };
      case (null) {};
    };
    switch (parsed.attr) {
      case (?attrName) {
        if (not lower.contains(#text (attrName.toLower() # "="))) return false;
      };
      case (null) {};
    };
    true;
  };

  func applyCSS(
    html   : Text,
    sel    : Text,
    limit  : Nat,
    outFmt : T.OutputFormat,
  ) : [T.ScrapeItem] {
    // Parse pseudo-elements ::text and ::attr(name)
    var baseSel    = sel;
    var pseudoText = false;
    var pseudoAttr : ?Text = null;
    if (sel.contains(#text "::")) {
      let parts = sel.split(#text "::");
      var idx = 0;
      for (part in parts) {
        if (idx == 0) { baseSel := part }
        else if (part == "text") { pseudoText := true }
        else if (part.startsWith(#text "attr(")) {
          let inner = switch (part.stripStart(#text "attr(")) {
            case (?s) s;
            case (null) part;
          };
          pseudoAttr := switch (inner.stripEnd(#text ")")) {
            case (?s) ?s;
            case (null) ?inner;
          };
        };
        idx += 1;
      };
    };
    let parsed  = parseCssSelector(baseSel);
    let results = List.empty<T.ScrapeItem>();
    let hArr    = html.toArray();
    var count   = 0;
    var pos     = 0;
    while (pos < html.size() and count < limit) {
      switch (findNextOpenTag(html, parsed.tag, pos)) {
        case (null) { pos := html.size() };
        case (?(tagStart, tagEnd)) {
          let tagSnippet = Text.fromArray(hArr.sliceToArray(tagStart, tagEnd + 1));
          if (matchesCssFilter(tagSnippet, parsed)) {
            let closeTag  = "</" # parsed.tag # ">";
            let afterOpen = Text.fromArray(hArr.sliceToArray(tagEnd + 1, html.size()));
            let innerHtml = switch (findSubstring(afterOpen.toLower(), closeTag.toLower())) {
              case (?cl) Text.fromArray(afterOpen.toArray().sliceToArray(0, cl));
              case (null) Text.fromArray(afterOpen.toArray().sliceToArray(0, Nat.min(500, afterOpen.size())));
            };
            let textContent = stripTags(innerHtml).trim(#char ' ');
            let fullHtml    = tagSnippet # innerHtml # closeTag;
            let hrefVal     = extractAttrValue(tagSnippet, "href");
            let srcVal      = extractAttrValue(tagSnippet, "src");
            let finalItem : T.ScrapeItem = switch (pseudoAttr) {
              case (?attrName) {
                {
                  text = extractAttrValue(tagSnippet, attrName);
                  html = null;
                  href = hrefVal;
                  src  = srcVal;
                  attributes = [];
                };
              };
              case (null) {
                {
                  text = switch (outFmt) {
                    case (#html) null;
                    case (_) if (pseudoText and textContent != "") ?textContent
                              else if (textContent != "") ?textContent
                              else null;
                  };
                  html = switch (outFmt) {
                    case (#text_) null;
                    case (_) if (pseudoText) null else ?fullHtml;
                  };
                  href = hrefVal;
                  src  = srcVal;
                  attributes = [];
                };
              };
            };
            results.add(finalItem);
            count += 1;
          };
          pos := tagEnd + 1;
        };
      };
    };
    results.toArray();
  };

  func applyXPath(
    html   : Text,
    sel    : Text,
    limit  : Nat,
    outFmt : T.OutputFormat,
  ) : [T.ScrapeItem] {
    // Support //tag/text() and //tag/@attr and //tag
    let stripped = switch (sel.stripStart(#text "//")) {
      case (?s) s;
      case (null) sel;
    };
    // detect /text()
    if (stripped.contains(#text "/text()")) {
      let tag = switch (stripped.split(#text "/text()").next()) {
        case (?t) t;
        case (null) stripped;
      };
      let items = applyCSS(html, tag, limit, outFmt);
      items.map<T.ScrapeItem, T.ScrapeItem>(func(item) { { item with html = null } });
    } else if (stripped.contains(#text "/@")) {
      var tag      = stripped;
      var attrName = "";
      let parts    = stripped.split(#text "/@");
      var idx      = 0;
      for (p in parts) {
        if (idx == 0) tag := p else attrName := p;
        idx += 1;
      };
      let items = applyCSS(html, tag, limit, outFmt);
      items.map<T.ScrapeItem, T.ScrapeItem>(func(item) {
        { item with text = extractAttrValue(switch (item.html) { case (?h) h; case (null) "" }, attrName); html = null };
      });
    } else {
      applyCSS(html, stripped, limit, outFmt);
    };
  };

  /// Apply selector (CSS or XPath) to HTML.
  public func applySelector(
    html         : Text,
    selector     : Text,
    selectorType : T.SelectorType,
    limit        : Nat,
    outputFormat : T.OutputFormat,
  ) : [T.ScrapeItem] {
    switch (selectorType) {
      case (#css)   applyCSS(html, selector, limit, outputFormat);
      case (#xpath) applyXPath(html, selector, limit, outputFormat);
    };
  };

  // ── Stealth request headers ───────────────────────────────────────────────

  /// Return browser-like headers for static fetches.
  public func stealthHeaders(userAgent : ?Text) : [(Text, Text)] {
    let ua = switch (userAgent) {
      case (?u) u;
      case (null) "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    };
    [
      ("User-Agent",      ua),
      ("Accept",          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"),
      ("Accept-Language", "en-US,en;q=0.9"),
      ("Accept-Encoding", "gzip, deflate, br"),
      ("Cache-Control",   "no-cache"),
      ("Connection",      "keep-alive"),
    ];
  };

};
