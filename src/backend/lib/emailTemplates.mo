import T    "../types/emailTemplate";
import TRC  "../types/roofingCampaign";
import Map  "mo:core/Map";
import Time "mo:core/Time";
import Nat  "mo:core/Nat";
import Int  "mo:core/Int";

module {

  // ── Seed data ─────────────────────────────────────────────────────────────

  /// Returns the 7 pre-written roofing campaign templates.
  /// Bodies use {{merge_fields}} for personalisation.
  public func seedTemplates() : [T.EmailTemplateExt] {
    let now = Time.now();
    [
      // Day 1 — Audit Reveal Hook
      {
        id  = 1;
        campaignType = ?#leadNurture;
        verticalProfileId = ?"roofing";
        complianceNotes = ?"Roofing lead nurture sequence. No legal/medical claims.";
        consentRequired = ?true;
        unsubscribeFooter = ?true;
        day = 1;
        subject = "We ran your Google Maps ranking, {{company_name}} \u{2014} here is what we found";
        body =
          "Hi {{first_name}},\n\n" #
          "We ran a quick Google Maps ranking audit on {{company_name}} in {{city}}.\n\n" #
          "Here\u{2019}s what we found:\n\n" #
          "\u{2022} Your visibility score: {{ranking_score}} / 100\n" #
          "\u{2022} Dead zones (areas where you\u{2019}re invisible to searchers): {{dead_zones_count}} out of 9 grid points\n" #
          "\u{2022} Who\u{2019}s taking those calls right now: {{top_competitor}}\n\n" #
          "Here\u{2019}s the painful part: you may rank #1 when you Google yourself from your shop. " #
          "But a homeowner searching for a roofer two miles away? They\u{2019}re not seeing you at all.\n\n" #
          "The good news: this is fixable — and most roofers in {{city}} don\u{2019}t even know the problem exists yet.\n\n" #
          "See your full ranking map here:\n{{cta_link}}\n\n" #
          "Best,\nThe BRF Team\n\n" #
          "P.S. \u{2014} You\u{2019}re missing coverage in a {{service_area_miles}}-mile radius. That\u{2019}s where your next jobs are.";
        fallbackSubject = "We ran a free Google Maps audit for your roofing company \u{2014} here is what we found";
        fallbackBody =
          "Hi there,\n\n" #
          "We ran a free local ranking audit on your roofing business.\n\n" #
          "Most roofing companies rank #1 when they search for themselves \u{2014} but disappear completely when a homeowner " #
          "searches from just 2 miles away. It\u{2019}s the most common blind spot in local SEO.\n\n" #
          "We built a free tool that maps exactly where you\u{2019}re visible and where you\u{2019}re not, across a full 5\u{2013}10 mile radius.\n\n" #
          "See your ranking map:\n{{cta_link}}\n\n" #
          "Best,\nThe BRF Team";
        updatedAt = now;
      },
      // Day 2 — Educational Explanation
      {
        id  = 2;
        campaignType = ?#leadNurture;
        verticalProfileId = ?"roofing";
        complianceNotes = ?"Roofing lead nurture sequence. No legal/medical claims.";
        consentRequired = ?true;
        unsubscribeFooter = ?true;
        day = 2;
        subject = "Why {{company_name}} ranks #1 on your street \u{2014} and nowhere else";
        body =
          "Hi {{first_name}},\n\n" #
          "Quick follow-up on the audit we ran for {{company_name}}.\n\n" #
          "Here\u{2019}s the thing most SEO companies never explain to their roofing clients:\n\n" #
          "Google\u{2019}s local ranking is position-based. When you search for your own company, " #
          "Google shows you results based on where YOU are standing \u{2014} right at your business address. " #
          "Of course you\u{2019}re #1 there.\n\n" #
          "But a homeowner {{service_area_miles}} miles away searching \u{201C}roofing contractor {{city}}\u{201D}? " #
          "Different location, different results. And right now, that\u{2019}s where {{top_competitor}} is showing up instead of you.\n\n" #
          "This is called the Google Maps proximity gap \u{2014} and it\u{2019}s why companies pay $1,000/month for SEO " #
          "and still wonder why the phone isn\u{2019}t ringing from new neighborhoods.\n\n" #
          "Does this match what you\u{2019}ve been seeing?\n\n" #
          "\u{2014} The BRF Team";
        fallbackSubject = "The #1 local SEO blind spot for roofers in {{city}}";
        fallbackBody =
          "Hi there,\n\n" #
          "Quick note on something most roofing companies never find out about their own Google ranking.\n\n" #
          "Google shows you search results based on where you\u{2019}re physically standing when you search. " #
          "So when you look up your own business, you see yourself at #1 \u{2014} because you\u{2019}re right there.\n\n" #
          "But homeowners searching from across town? They\u{2019}re seeing your competitors, not you.\n\n" #
          "This is the proximity gap \u{2014} and it\u{2019}s costing roofing companies real jobs every week.\n\n" #
          "We can show you exactly where you\u{2019}re visible and where you\u{2019}re not:\n{{cta_link}}\n\n" #
          "\u{2014} The BRF Team";
        updatedAt = now;
      },
      // Day 3 — Agitation / Cost of Inaction
      {
        id  = 3;
        campaignType = ?#leadNurture;
        verticalProfileId = ?"roofing";
        complianceNotes = ?"Roofing lead nurture sequence. No legal/medical claims.";
        consentRequired = ?true;
        unsubscribeFooter = ?true;
        day = 3;
        subject = "Every week this goes unfixed, {{company_name}} loses jobs to competitors";
        body =
          "Hi {{first_name}},\n\n" #
          "Let\u{2019}s talk about what the ranking gap is actually costing {{company_name}}.\n\n" #
          "Average roofing job value: $8,000\u{2013}$15,000.\n" #
          "If you\u{2019}re invisible in {{dead_zones_count}} out of 9 search zones in {{city}}, " #
          "that\u{2019}s roughly {{dead_zones_count}} out of 9 neighborhoods sending calls to {{top_competitor}} instead of you.\n\n" #
          "Conservative estimate: 2\u{2013}4 missed jobs per month.\n" #
          "That\u{2019}s $16,000\u{2013}$60,000 a month in revenue going somewhere else.\n\n" #
          "Not because you\u{2019}re a bad roofer. Because your Google coverage stops at your block.\n\n" #
          "Want to see exactly which competitors are showing up where you aren\u{2019}t?\n{{cta_link}}\n\n" #
          "\u{2014} The BRF Team";
        fallbackSubject = "How much is the local ranking gap costing roofing companies?";
        fallbackBody =
          "Hi there,\n\n" #
          "Let\u{2019}s put a number on the local ranking gap problem.\n\n" #
          "Average roofing job: $8,000\u{2013}$15,000. " #
          "If a company is invisible in even half of the neighborhoods in their service area, " #
          "that could mean 2\u{2013}4 missed jobs per month \u{2014} $16,000 to $60,000 walking straight to a competitor.\n\n" #
          "Most roofers don\u{2019}t realize this is happening because they\u{2019}re still ranking #1 " #
          "when THEY search. The customers searching from other parts of town never see them.\n\n" #
          "We can show you where the gaps are:\n{{cta_link}}\n\n" #
          "\u{2014} The BRF Team";
        updatedAt = now;
      },
      // Day 4 — Solution Introduction
      {
        id  = 4;
        campaignType = ?#leadNurture;
        verticalProfileId = ?"roofing";
        complianceNotes = ?"Roofing lead nurture sequence. No legal/medical claims.";
        consentRequired = ?true;
        unsubscribeFooter = ?true;
        day = 4;
        subject = "What fixing {{company_name}}\u{2019}s local ranking actually looks like";
        body =
          "Hi {{first_name}},\n\n" #
          "We\u{2019}ve shown you the problem. Here\u{2019}s what fixing it looks like for a roofing company like {{company_name}}.\n\n" #
          "BRF (Booked Ranked Fundable) is an AI platform built specifically for contractors. " #
          "Here\u{2019}s what it does for your local ranking:\n\n" #
          "\u{2022} Extends your Google Maps visibility from 1 block to a full {{service_area_miles}}-mile radius\n" #
          "\u{2022} AI front desk answers every call \u{2014} no more missed leads\n" #
          "\u{2022} Automated review management feeds the Google algorithm with fresh 5-star reviews\n" #
          "\u{2022} Follow-up sequences turn missed calls into booked jobs\n\n" #
          "No lock-in. No credit card for the trial. Setup takes 20 minutes.\n\n" #
          "See a 5-minute demo:\n{{cta_link}}\n\n" #
          "\u{2014} The BRF Team";
        fallbackSubject = "What it actually takes to fix local ranking for roofing companies";
        fallbackBody =
          "Hi there,\n\n" #
          "BRF is an AI platform built for roofing contractors that fixes the local ranking gap problem directly.\n\n" #
          "Four things it does:\n\n" #
          "\u{2022} Extends your Google Maps visibility to a full service-area radius\n" #
          "\u{2022} AI front desk answers every call so no lead goes cold\n" #
          "\u{2022} Automated review management feeds the Google algorithm\n" #
          "\u{2022} Follow-up sequences turn missed calls into booked jobs\n\n" #
          "No lock-in. No credit card for the trial. Setup takes 20 minutes.\n\n" #
          "See a 5-minute demo:\n{{cta_link}}\n\n" #
          "\u{2014} The BRF Team";
        updatedAt = now;
      },
      // Day 5 — Social Proof / Case Study
      {
        id  = 5;
        campaignType = ?#leadNurture;
        verticalProfileId = ?"roofing";
        complianceNotes = ?"Roofing lead nurture sequence. No legal/medical claims.";
        consentRequired = ?true;
        unsubscribeFooter = ?true;
        day = 5;
        subject = "Before and after: a roofing company in {{city}} went from invisible to #1 in 6 weeks";
        body =
          "Hi {{first_name}},\n\n" #
          "A roofing company similar to {{company_name}} \u{2014} same city size, same services, same setup \u{2014} " #
          "had the exact same ranking problem you have now.\n\n" #
          "Before:\n" #
          "\u{2022} Ranking #1 on their own block, invisible everywhere else\n" #
          "\u{2022} 3\u{2013}4 inbound leads per month\n" #
          "\u{2022} Slow season felt like a crisis\n\n" #
          "What they discovered:\n" #
          "Competitors were taking every search from 3+ miles away. They had no idea.\n\n" #
          "After 6 weeks on BRF:\n" #
          "\u{2022} Ranking visible across a 7-mile radius\n" #
          "\u{2022} 14\u{2013}18 inbound calls per month from new neighborhoods\n" #
          "\u{2022} Hired an extra crew to handle the volume\n\n" #
          "I wonder if {{company_name}} is sitting on the same opportunity.\n\n" #
          "{{cta_link}}\n\n" #
          "\u{2014} The BRF Team";
        fallbackSubject = "Before and after: a roofing company went from invisible to #1 in 6 weeks";
        fallbackBody =
          "Hi there,\n\n" #
          "A roofing company we worked with had the exact same local ranking problem.\n\n" #
          "Before: ranking #1 on their block, invisible everywhere else, 3\u{2013}4 leads a month.\n\n" #
          "After 6 weeks on BRF: visible across a 7-mile radius, 14\u{2013}18 calls per month from " #
          "neighborhoods they\u{2019}d never gotten a call from before. Hired an extra crew.\n\n" #
          "Same fix is available for any roofing company with the same gap:\n{{cta_link}}\n\n" #
          "\u{2014} The BRF Team";
        updatedAt = now;
      },
      // Day 6 — Hard CTA / Offer
      {
        id  = 6;
        campaignType = ?#leadNurture;
        verticalProfileId = ?"roofing";
        complianceNotes = ?"Roofing lead nurture sequence. No legal/medical claims.";
        consentRequired = ?true;
        unsubscribeFooter = ?true;
        day = 6;
        subject = "{{company_name}}: 7-day trial, no credit card, no lock-in";
        body =
          "Hi {{first_name}},\n\n" #
          "Here\u{2019}s the offer for {{company_name}}:\n\n" #
          "7-day free trial of BRF. No credit card. No lock-in. Cancel any time. " #
          "Setup takes 20 minutes.\n\n" #
          "What you get in the trial:\n\n" #
          "\u{2022} AI front desk active on your number from day one\n" #
          "\u{2022} Full local ranking grid audit for {{city}} (including the {{dead_zones_count}} dead zones we found)\n" #
          "\u{2022} 3 automated follow-up sequences live and running\n" #
          "\u{2022} Weekly ranking report delivered to your inbox\n" #
          "\u{2022} Missing services addressed: {{missing_services}}\n\n" #
          "That\u{2019}s the whole platform, live, for your business, for free.\n\n" #
          "Start your free 7-day trial:\n{{cta_link}}\n\n" #
          "\u{2014} The BRF Team";
        fallbackSubject = "7-day free trial for roofing contractors \u{2014} no credit card, no lock-in";
        fallbackBody =
          "Hi there,\n\n" #
          "7-day free trial of BRF. No credit card. No lock-in. Cancel any time. Setup: 20 minutes.\n\n" #
          "What you get:\n\n" #
          "\u{2022} AI front desk active on your number\n" #
          "\u{2022} Full local ranking grid audit for your area\n" #
          "\u{2022} 3 automated follow-up sequences live\n" #
          "\u{2022} Weekly ranking report\n\n" #
          "Start your free trial:\n{{cta_link}}\n\n" #
          "\u{2014} The BRF Team";
        updatedAt = now;
      },
      // Day 7 — Last Call Plain-Text
      {
        id  = 7;
        campaignType = ?#leadNurture;
        verticalProfileId = ?"roofing";
        complianceNotes = ?"Roofing lead nurture sequence. No legal/medical claims.";
        consentRequired = ?true;
        unsubscribeFooter = ?true;
        day = 7;
        subject = "Last message for {{company_name}} \u{2014} wanted to make sure you saw this";
        body =
          "Hi {{first_name}},\n\n" #
          "This is the last email I\u{2019}ll send about this.\n\n" #
          "I get it \u{2014} you\u{2019}re busy running a roofing company in {{city}}. " #
          "If the timing isn\u{2019}t right, no hard feelings.\n\n" #
          "But if there\u{2019}s any chance you\u{2019}re still losing calls to {{top_competitor}} " #
          "because of the ranking gap we found, I\u{2019}d hate for you to not know about it.\n\n" #
          "One last easy door: a 15-minute call where I\u{2019}ll show you " #
          "your actual ranking data across {{city}} and what it would take to fix it.\n\n" #
          "Book a time:\n{{cta_link}}\n\n" #
          "Either way, good luck with the season.\n\n" #
          "\u{2014} The BRF Team";
        fallbackSubject = "Last note \u{2014} one quick thing about your Google ranking";
        fallbackBody =
          "Hi there,\n\n" #
          "This is the last email I\u{2019}ll send.\n\n" #
          "If there\u{2019}s any chance you\u{2019}re missing jobs because of a local ranking gap, " #
          "a quick 15-minute call would show you exactly what\u{2019}s happening and what to do about it.\n\n" #
          "Book a time:\n{{cta_link}}\n\n" #
          "Good luck with the season.\n\n" #
          "\u{2014} The BRF Team";
        updatedAt = now;
      },
    ];
  };

  // ── Initialise store (one-time guard) ─────────────────────────────────────

  /// Populate the template map on first deploy; noop if already populated.
  public func initTemplatesIfEmpty(
    store : Map.Map<Nat, T.EmailTemplateExt>,
    initialized : { var v : Bool },
  ) {
    if (initialized.v) return;
    for (t in seedTemplates().vals()) {
      store.add(t.id, t);
    };
    initialized.v := true;
  };

  // ── Merge-field fill ──────────────────────────────────────────────────────

  /// Supported merge field keys.
  let ctaDefault : Text = "https://bookedrankedfunded.org";

  /// Returns true if the body text still contains any unfilled {{field}} placeholder.
  public func hasMissingFields(body : Text) : Bool {
    body.contains(#text "{{");
  };

  /// Replace all {{field}} placeholders in `body` using lead + audit values.
  /// Returns (filledBody, usedFallback).
  /// If any merge field ends up empty/missing, we fall back to the fallback template.
  public func mergeFillTemplate(
    template    : T.EmailTemplateExt,
    lead        : TRC.LeadCampaignStatus,
    auditResult : ?TRC.GridAuditResult,
    ctaLink     : Text,
  ) : (subject : Text, body : Text, usedFallback : Bool) {

    // ── Derive merge values from lead & audit ──────────────────────────────
    let companyName = lead.companyName;
    let city        = lead.city;

    // Extract first name: take text before first space in companyName, else companyName
    let firstName : Text = do {
      let parts = companyName.split(#char ' ');
      switch (parts.next()) {
        case (?fn) fn;
        case null  companyName;
      };
    };

    // Audit-derived fields
    let (rankingScore, deadZoneCount, topCompetitor, missingServices, serviceAreaMiles) =
      switch (auditResult) {
        case null   { ("", "", "", "", "") };
        case (?r) {
          var visible : Nat = 0;
          var rank1   : Nat = 0;
          var topComp : Text = "";
          for (gp in r.gridPoints.vals()) {
            if (gp.rankPosition > 0)  { visible += 1 };
            if (gp.rankPosition == 1) { rank1   += 1 };
            if (topComp == "" and gp.rankPosition > 0 and gp.competitorAtTop != r.businessName) {
              topComp := gp.competitorAtTop;
            };
          };
          let deadZones  = if (visible > 9) 0 else Nat.sub(9, visible);
          let score      = (visible * 100) / 9;
          let missing    : Text = if (deadZones > 5) "extended service area coverage, review volume"
                                  else if (deadZones > 2) "broader local citations, review consistency"
                                  else "minor citation gaps";
          let areaRadius : Text = if (deadZones > 6) "5" else if (deadZones > 3) "7" else "10";
          (
            score.toText(),
            deadZones.toText(),
            if (topComp == "") "a local competitor" else topComp,
            missing,
            areaRadius,
          );
        };
      };

    // ── Check if audit fields are available ───────────────────────────────
    // If no audit result and the template body references audit fields, use fallback.
    let auditFieldsNeeded =
      template.body.contains(#text "{{ranking_score}}") or
      template.body.contains(#text "{{dead_zones_count}}") or
      template.body.contains(#text "{{top_competitor}}") or
      template.body.contains(#text "{{missing_services}}");

    let auditMissing = auditResult == null and auditFieldsNeeded;

    // ── Fill chosen template body ─────────────────────────────────────────
    func fill(subj : Text, bdy : Text) : (Text, Text) {
      let cta = if (ctaLink == "") ctaDefault else ctaLink;
      let s = subj
        .replace(#text "{{company_name}}",      companyName)
        .replace(#text "{{city}}",              city)
        .replace(#text "{{first_name}}",        firstName)
        .replace(#text "{{ranking_score}}",     rankingScore)
        .replace(#text "{{dead_zones_count}}",  deadZoneCount)
        .replace(#text "{{top_competitor}}",    topCompetitor)
        .replace(#text "{{missing_services}}",  missingServices)
        .replace(#text "{{service_area_miles}}", serviceAreaMiles)
        .replace(#text "{{cta_link}}",          cta);
      let b = bdy
        .replace(#text "{{company_name}}",      companyName)
        .replace(#text "{{city}}",              city)
        .replace(#text "{{first_name}}",        firstName)
        .replace(#text "{{ranking_score}}",     rankingScore)
        .replace(#text "{{dead_zones_count}}",  deadZoneCount)
        .replace(#text "{{top_competitor}}",    topCompetitor)
        .replace(#text "{{missing_services}}",  missingServices)
        .replace(#text "{{service_area_miles}}", serviceAreaMiles)
        .replace(#text "{{cta_link}}",          cta);
      (s, b);
    };

    if (auditMissing) {
      let (s, b) = fill(template.fallbackSubject, template.fallbackBody);
      (s, b, true);
    } else {
      let (s, b) = fill(template.subject, template.body);
      // Safety net: if any {{field}} still present, fall back
      if (hasMissingFields(b)) {
        let (sf, bf) = fill(template.fallbackSubject, template.fallbackBody);
        (sf, bf, true);
      } else {
        (s, b, false);
      };
    };
  };

};
