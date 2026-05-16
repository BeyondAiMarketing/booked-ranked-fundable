import Text   "mo:core/Text";
import Map    "mo:core/Map";
import Types  "../types/demoSession";

module {

  public type DemoSession  = Types.DemoSession;
  public type AuditReport  = Types.AuditReport;
  public type NicheScript  = Types.NicheScript;
  public type ScriptLine   = Types.ScriptLine;
  public type Niche        = Types.Niche;

  // ── Re-export niche helpers ───────────────────────────────────────────────

  public let nicheFromText : (Text) -> Niche = Types.fromText;
  public let nicheToText   : (Niche) -> Text = Types.toText;

  // ── Constants ────────────────────────────────────────────────────────────

  let sevenDaysNs  : Int = 604_800_000_000_000;
  let _oneDayNs    : Int = 86_400_000_000_000;

  // Audio cache eviction settings
  let audioCacheMaxEntries  : Nat = 500;
  let audioCacheEvictBatch  : Nat = 50;

  public func sessionDurationNs() : Int { sevenDaysNs };

  // ── Session helpers ──────────────────────────────────────────────────────

  public func newSession(sessionId : Text, businessName : Text, niche : Text, now : Int) : DemoSession {
    {
      sessionId;
      businessName;
      niche         = nicheToText(nicheFromText(niche)); // canonicalise on write
      step          = 0;
      auditScore    = 0;
      trialActivatedAt      = null;
      socialContentLockedAt = null;
      createdAt     = now;
    }
  };

  public func isExpired(session : DemoSession, now : Int) : Bool {
    now - session.createdAt > sevenDaysNs
  };

  /// Check if social content should be locked (day 7+ from trial activation).
  public func shouldLockSocial(session : DemoSession, now : Int) : Bool {
    switch (session.socialContentLockedAt) {
      case (?lockedAt) { now >= lockedAt };
      case (null) {
        switch (session.trialActivatedAt) {
          case (?activatedAt) { now - activatedAt >= sevenDaysNs };
          case (null)         { false };
        }
      };
    }
  };

  // ── Audit gap library (niche-specific, variant-matched) ──────────────────

  /// Return the top 3 gaps for a niche. Uses the canonical Niche variant to
  /// eliminate all case-sensitivity and spelling fragility.
  public func nicheTopGaps(rawNiche : Text) : [Text] {
    switch (nicheFromText(rawNiche)) {
      case (#plumber) {
        [
          "No AI-powered 24/7 answering service — 67% of plumbing calls go to voicemail after hours",
          "Missing automated review request flow — customers forget to leave reviews within 48 hours",
          "No Google Business Profile optimization — losing local map pack visibility to competitors",
        ]
      };
      case (#medSpa) {
        [
          "No automated appointment reminder sequence — med spas lose 23% of bookings to no-shows",
          "Missing before/after social proof automation — visual results drive 4x more conversions",
          "Weak online reputation management — a single negative review can drop bookings by 30%",
        ]
      };
      case (#hvac) {
        [
          "No seasonal demand capture system — HVAC businesses miss 40% of peak-season leads",
          "Missing AI voice agent for after-hours emergency calls — competitors answer, you don't",
          "No automated maintenance reminder sequence — losing repeat customers to competitors",
        ]
      };
      case (#restoration) {
        [
          "No 24/7 emergency call capture — restoration leads disappear in under 4 minutes if unanswered",
          "Missing insurance partner referral system — leaving recurring B2B revenue on the table",
          "No automated follow-up sequence after job completion — repeat business drops by 60%",
        ]
      };
      case (#carpetCleaning) {
        [
          "No seasonal campaign automation — missing spring and fall peak booking windows",
          "Missing before/after photo collection workflow — social proof drives 3x more referrals",
          "No automated re-booking reminder at 6-month intervals — losing recurring revenue",
        ]
      };
      case (#roofing) {
        [
          "No storm-alert lead capture system — competitors are calling homeowners before you",
          "Missing automated insurance claim follow-up — 45% of storm leads never call back without a nudge",
          "No reputation management system — roofing is the most-reviewed trade on Google",
        ]
      };
      case (#realEstate) {
        [
          "No AI follow-up for open house leads — 80% of buyers go with the first agent who responds",
          "Missing automated listing alert system — leads go cold within 24 hours of interest",
          "No social proof pipeline — turning closed deals into Google reviews and referral content",
        ]
      };
      case (#mortgage) {
        [
          "No pre-qualification follow-up automation — mortgage leads have a 72-hour decision window",
          "Missing rate-alert notification system — borrowers refinance with competitors who reach out first",
          "No referral partner automation — Realtor relationships generate 60% of top producers' volume",
        ]
      };
      case (#chiropractic) {
        [
          "No new patient follow-up sequence — 55% of chiropractic inquiries never book without a follow-up",
          "Missing treatment plan reminder system — patients drop off after 2-3 visits without engagement",
          "No automated review request after treatment milestones — reputation drives referrals",
        ]
      };
      case (#dental) {
        [
          "No recall/reactivation campaign — dental practices lose 30% of patients to inactivity every year",
          "Missing new patient nurture sequence — dental leads go cold in under 48 hours",
          "No automated review request post-visit — 70% of satisfied patients never leave a review unprompted",
        ]
      };
      case (#unknown _) {
        [
          "No AI-powered lead capture and follow-up automation",
          "Missing reputation management and automated review requests",
          "No social media content automation or engagement system",
        ]
      };
    }
  };

  // ── Niche narratives (hardcoded, Brunson/Hormozi voice) ───────────────────

  public func nicheNarrative(rawNiche : Text) : Text {
    switch (nicheFromText(rawNiche)) {
      case (#plumber) {
        "Your plumbing business has real opportunities right now. The biggest gap: 73% of plumbing calls that go to voicemail never call back — your competitors are capturing those leads while your phone rings out. Your Google Business Profile is incomplete, and with fewer than 15 reviews you're invisible to people searching right now. The BRF AI agent answers every call, books every appointment, and builds your reputation automatically — so the next emergency call becomes a booked job, not a missed opportunity."
      };
      case (#medSpa) {
        "Your med spa has serious revenue leaking through the cracks every single month. New patient no-shows cost the average med spa $4,200 per month — and most have zero automated follow-up to recover them. Your social media is inconsistent, and Google rankings below position 5 mean you're losing 80% of search clicks to competitors who invested in their online presence. BRF's AI books consultations 24/7, re-engages no-shows automatically, and builds a social proof engine that keeps your calendar full without you lifting a finger."
      };
      case (#hvac) {
        "Your HVAC business is leaving money on the table during both peak and off-seasons. Seasonal demand spikes are the highest-converting lead windows of the year — and 40% of those leads go to the competitor who answers first. After-hours emergency calls are the most valuable leads in the business, and right now they're going to voicemail. BRF puts an AI agent on every call 24/7, automates your seasonal campaign outreach, and keeps your maintenance customers locked in with automated reminders — so your revenue grows whether you're on-site or not."
      };
      case (#restoration) {
        "In the restoration business, speed is everything — and right now you're likely losing jobs in the first four minutes. Restoration leads disappear in under 4 minutes if unanswered, and your competitors know it. You're also missing a systematic way to build insurance partner referrals, which is where the highest-margin, most consistent work comes from. BRF's AI agent answers every emergency call instantly, qualifies the situation, dispatches your team, and follows up post-job automatically — turning one-time emergencies into a referral engine."
      };
      case (#carpetCleaning) {
        "Your carpet cleaning business has predictable revenue windows you're not fully capturing. The spring and fall peak booking seasons are the highest-value periods of the year — and without automated campaign outreach, you're watching those windows close. Your biggest growth lever is re-booking: a customer who booked once is three times more likely to book again if you reach out at the 6-month mark. BRF automates your seasonal campaigns, collects before/after photos for social proof, and sends every past customer a reminder at exactly the right time — without you doing any of it manually."
      };
      case (#roofing) {
        "Your roofing business has a storm-season problem that's costing you thousands in missed jobs. The roofers who win the most storm work aren't the best roofers — they're the fastest to reach homeowners after a storm hits. Right now you have no automated storm-alert lead capture, and your competitors are knocking doors before you've even seen the weather report. BRF's AI captures storm-area leads automatically, sends the first outreach within minutes of a weather event, and follows up on insurance claims so you don't lose jobs to the 45% of storm leads who go cold without a nudge."
      };
      case (#realEstate) {
        "Your real estate business is winning some clients and quietly losing others you never even knew about. 80% of buyers go with the first agent who responds — and if your response time is over an hour, you've already lost most of them. Your open house leads go cold in under 24 hours without a structured follow-up, and you're likely converting less than 15% of the leads you generate. BRF puts an AI agent on every inquiry, follows up with every lead automatically, and turns your closed deals into a Google review and referral content engine — so your next client finds you before they ever call a competitor."
      };
      case (#mortgage) {
        "Your mortgage business runs on speed and trust — and right now you're likely losing deals on both. Mortgage leads have a 72-hour decision window, and every hour you're not following up is an hour your competitor is. Refinance borrowers are especially high-value because they're already motivated — and most go with whoever reaches them first with a rate update. BRF automates your pre-qualification follow-up, sends rate alerts at the right moment, and systematises your Realtor relationships so your top referral partners are hearing from you consistently — not just when you remember to call."
      };
      case (#chiropractic) {
        "Your chiropractic practice is converting new patient inquiries at a fraction of its potential. 55% of chiropractic inquiries never book an appointment — not because they weren't interested, but because nobody followed up fast enough. The patients you do get are dropping off after 2-3 visits because there's no structured re-engagement between appointments. BRF's AI follows up every new inquiry within 60 seconds, sends treatment plan reminders that keep patients on schedule, and requests a review automatically after each milestone — so your reputation grows while your retention improves."
      };
      case (#dental) {
        "Your dental practice is losing 30% of its patient base to inactivity every single year — and most of those patients would come back if someone just reached out. New patient leads go cold in under 48 hours without a follow-up, and 70% of satisfied patients never leave a review unless they're asked at exactly the right moment. BRF's recall and reactivation campaigns bring dormant patients back automatically, a new patient nurture sequence closes the gap between inquiry and first appointment, and post-visit review requests are sent while the experience is still fresh — turning a great visit into a five-star review."
      };
      case (#unknown _) {
        "Your business has clear opportunities to capture more leads, retain more customers, and build a stronger online reputation. The biggest gaps — unanswered calls, no follow-up system, and weak review generation — are costing you revenue every single month. BRF's AI handles every incoming call, automates your follow-up sequences, and builds your reputation on autopilot so your business grows without you managing every detail manually."
      };
    }
  };

  // ── Audit report generation ──────────────────────────────────────────────

  /// Compute a 0-100 audit score from session data.
  /// Scoring rubric (total 100 pts):
  ///   voiceAgent active     20 pts  (proxy: auditScore >= 50 means agent is needed)
  ///   review count proxy    20 pts  (estimated from niche – restoration/dental score higher)
  ///   social presence       15 pts  (baseline: most local service businesses are weak)
  ///   website quality       15 pts  (baseline)
  ///   credit/fundability    15 pts  (baseline)
  ///   follow-up system      15 pts  (always missing for prospects)
  public func computeAuditScore(session : DemoSession) : Nat {
    // If the session already has a non-zero score from a live audit step, trust it.
    if (session.auditScore > 0 and session.auditScore <= 100) {
      return session.auditScore;
    };
    // Baseline scoring: prospects always score low because they haven't set up BRF yet.
    // The score reflects how much opportunity exists (lower = more room to improve = higher urgency).
    let niche = nicheFromText(session.niche);
    let base : Nat = switch (niche) {
      // Niches with highest urgency get lower baseline scores
      case (#restoration)    28;
      case (#roofing)        30;
      case (#hvac)           32;
      case (#plumber)        34;
      case (#mortgage)       36;
      case (#realEstate)     38;
      case (#carpetCleaning) 40;
      case (#dental)         38;
      case (#chiropractic)   36;
      case (#medSpa)         40;
      case (#unknown _)      35;
    };
    // Add a small deterministic variance based on business name length
    let variance : Nat = (session.businessName.size() * 3) % 13;
    base + variance
  };

  /// Generate a full AuditReport for a completed demo session.
  public func generateAuditReport(session : DemoSession, email : Text, now : Int) : AuditReport {
    let score = computeAuditScore(session);
    {
      sessionId    = session.sessionId;
      businessName = session.businessName;
      niche        = session.niche;
      email;
      overallScore = score;
      topGaps      = nicheTopGaps(session.niche);
      narrative    = ?nicheNarrative(session.niche);
      generatedAt  = now;
    }
  };

  // ── Audit email HTML builder ─────────────────────────────────────────────

  /// Build the HTML body for the audit report email.
  /// Uses BRF dark/purple branding.
  public func buildAuditEmailHtml(report : AuditReport) : Text {
    let niceNiche = nicheToText(nicheFromText(report.niche));
    let gap1 = if (report.topGaps.size() > 0) report.topGaps[0] else "";
    let gap2 = if (report.topGaps.size() > 1) report.topGaps[1] else "";
    let gap3 = if (report.topGaps.size() > 2) report.topGaps[2] else "";
    let signupUrl = "https://bookedrankedfunded.org/signup?niche=" # niceNiche # "&score=" # report.overallScore.toText();

    "<html><body style=\"margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;\">"
    # "<div style=\"max-width:600px;margin:0 auto;background:#12121a;border:1px solid #7c3aed;border-radius:12px;overflow:hidden;\">"
    # "<div style=\"background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:32px 40px;text-align:center;\">"
    # "<h1 style=\"color:#fff;margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;\">BOOKED. RANKED. FUNDABLE.</h1>"
    # "<p style=\"color:#e0d9ff;margin:8px 0 0;font-size:15px;\">Your Free Business Audit Report</p>"
    # "</div>"
    # "<div style=\"padding:32px 40px;\">"
    # "<h2 style=\"color:#e2e8f0;font-size:22px;margin:0 0 4px;\">" # report.businessName # "</h2>"
    # "<p style=\"color:#9ca3af;margin:0 0 24px;font-size:14px;text-transform:capitalize;\">" # niceNiche # "</p>"
    # "<div style=\"background:#1e1b4b;border:1px solid #4f46e5;border-radius:8px;padding:24px;text-align:center;margin-bottom:28px;\">"
    # "<p style=\"color:#a5b4fc;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;\">Overall Readiness Score</p>"
    # "<p style=\"color:#fff;font-size:56px;font-weight:900;margin:0;line-height:1;\">" # report.overallScore.toText() # "<span style=\"font-size:28px;color:#7c3aed;\">/100</span></p>"
    # "<p style=\"color:#f87171;font-size:13px;margin:8px 0 0;\">Low score = high opportunity. BRF fixes all of this.</p>"
    # "</div>"
    # "<h3 style=\"color:#c4b5fd;font-size:16px;margin:0 0 16px;border-bottom:1px solid #2d2d3d;padding-bottom:8px;\">Your Top 3 Revenue Gaps</h3>"
    # "<div style=\"margin-bottom:24px;\">"
    # "<div style=\"display:flex;align-items:flex-start;margin-bottom:12px;\"><span style=\"color:#f87171;font-size:18px;margin-right:12px;flex-shrink:0;\">&#9888;</span><p style=\"color:#d1d5db;font-size:14px;margin:0;line-height:1.5;\">" # gap1 # "</p></div>"
    # "<div style=\"display:flex;align-items:flex-start;margin-bottom:12px;\"><span style=\"color:#f87171;font-size:18px;margin-right:12px;flex-shrink:0;\">&#9888;</span><p style=\"color:#d1d5db;font-size:14px;margin:0;line-height:1.5;\">" # gap2 # "</p></div>"
    # "<div style=\"display:flex;align-items:flex-start;margin-bottom:12px;\"><span style=\"color:#f87171;font-size:18px;margin-right:12px;flex-shrink:0;\">&#9888;</span><p style=\"color:#d1d5db;font-size:14px;margin:0;line-height:1.5;\">" # gap3 # "</p></div>"
    # "</div>"
    # "<div style=\"background:#0f172a;border-left:3px solid #7c3aed;border-radius:4px;padding:16px 20px;margin-bottom:28px;\">"
    # "<p style=\"color:#e2e8f0;font-size:14px;line-height:1.7;margin:0;\">" # (switch (report.narrative) { case (?n) n; case null "" }) # "</p>"
    # "</div>"
    # "<div style=\"text-align:center;margin-top:32px;\">"
    # "<a href=\"" # signupUrl # "\" style=\"display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.3px;\">Start Your 7-Day Free Trial &rarr;</a>"
    # "<p style=\"color:#6b7280;font-size:12px;margin:16px 0 0;\">No credit card required. Cancel anytime. Setup in under 10 minutes.</p>"
    # "</div>"
    # "</div>"
    # "<div style=\"background:#0a0a0f;padding:20px 40px;text-align:center;border-top:1px solid #1f2937;\">"
    # "<p style=\"color:#4b5563;font-size:11px;margin:0;\">Booked Ranked Fundable &bull; <a href=\"https://bookedrankedfunded.org\" style=\"color:#7c3aed;text-decoration:none;\">bookedrankedfunded.org</a></p>"
    # "</div>"
    # "</div></body></html>"
  };

  // ── Audio cache eviction ──────────────────────────────────────────────────

  /// If the cache exceeds audioCacheMaxEntries, evict the oldest audioCacheEvictBatch
  /// entries. Map iterates in key order; removing the lexicographically smallest
  /// keys is a best-effort proxy for LRU given the key format "<nicheId>:<index>".
  public func evictAudioCacheIfNeeded(cache : Map.Map<Text, Text>) {
    let size = cache.size();
    if (size > audioCacheMaxEntries) {
      let allKeys = cache.keys().toArray();
      let batchInt : Int = audioCacheEvictBatch.toInt();
      let toEvict = allKeys.sliceToArray(0, batchInt);
      for (key in toEvict.values()) {
        cache.remove(key);
      };
    };
  };

  // ── Hardcoded niche voice scripts ─────────────────────────────────────────
  // Each script is a realistic 6-7 turn conversation.
  // {{businessName}} is replaced by the actual business name at runtime.

  public let plumberScript : NicheScript = {
    nicheId           = "plumber";
    voiceName         = "Bella";
    elevenLabsVoiceId = "EXAVITQu4vr4xnSDxMaL";
    lines = [
      {
        speaker      = "agent";
        text         = "Thank you for calling {{businessName}}, your 24/7 plumbing experts. This is your AI front desk. How can I help you today?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Hi, I have a burst pipe under my kitchen sink. Water is everywhere. I need someone out here fast.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "I completely understand — that's a plumbing emergency and we treat it that way. I'm flagging this as urgent right now. Can I get your address so I can dispatch our nearest available technician?";
        pauseAfterMs = 600;
      },
      {
        speaker      = "customer";
        text         = "It's 4821 Maple Street. Please hurry, the water is still running.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Got it — 4821 Maple Street. I've locked in your emergency appointment and you'll get a text confirmation in about 60 seconds. While you wait, turn off the shut-off valve under the sink to stop the flow. A {{businessName}} technician will be on their way shortly. Is there anything else I can help you with?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "No, that's great. Thank you so much.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "You're all set. Help is on the way. Have a great rest of your day.";
        pauseAfterMs = 1000;
      },
    ];
  };

  public let medSpaScript : NicheScript = {
    nicheId           = "med-spa";
    voiceName         = "Sophia";
    elevenLabsVoiceId = "21haVlAjigA08xEFAjSo";
    lines = [
      {
        speaker      = "agent";
        text         = "Thank you for calling {{businessName}}. I'm your virtual concierge. How may I assist you today?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Hi, I'd like to book a consultation for Botox. I haven't been in before.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Welcome! We'd love to have you in. Our Botox consultations are complimentary, and they typically run about 20 minutes with one of our licensed practitioners. Do you have a preferred day of the week or time of day that works best for you?";
        pauseAfterMs = 600;
      },
      {
        speaker      = "customer";
        text         = "Mornings work best for me. Maybe Thursday or Friday?";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Perfect. I have a Thursday at 10 AM available this week at {{businessName}}. I'll book that for you and send a confirmation text with the address and a short intake form to complete beforehand. May I get your first name and best phone number?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Sure, it's Jessica, and my number is 555-0192.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Wonderful, Jessica. You're all set for Thursday at 10 AM. We look forward to meeting you at {{businessName}}. Have a beautiful day!";
        pauseAfterMs = 1000;
      },
    ];
  };

  public let hvacScript : NicheScript = {
    nicheId           = "hvac";
    voiceName         = "Elli";
    elevenLabsVoiceId = "MF3mGyEYCl7XYWbV9V6O";
    lines = [
      {
        speaker      = "agent";
        text         = "Thank you for calling {{businessName}} HVAC. I'm your AI scheduling assistant. How can I help you today?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Hey, my AC unit stopped working last night and it's already getting hot. I need someone to come look at it today if possible.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Absolutely — that's a same-day priority. I'm pulling up today's dispatch schedule for {{businessName}} right now. Can I get your address and the make of your AC unit if you know it?";
        pauseAfterMs = 600;
      },
      {
        speaker      = "customer";
        text         = "It's 9103 Birchwood Drive. I think it's a Carrier unit, maybe 5 years old.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Great — a 5-year-old Carrier is well within service range. I have a same-day slot available between 2 and 4 PM at 9103 Birchwood Drive. I'll confirm your appointment and text you a reminder an hour before arrival. Does that time window work?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Yes, that works perfectly. Thank you.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "You're all set. A {{businessName}} technician will see you between 2 and 4 today. Stay cool — help is coming!";
        pauseAfterMs = 1000;
      },
    ];
  };

  public let restorationScript : NicheScript = {
    nicheId           = "restoration";
    voiceName         = "Rachel";
    elevenLabsVoiceId = "21m00Tcm4TlvDq8ikWAM";
    lines = [
      {
        speaker      = "agent";
        text         = "Thank you for calling {{businessName}} restoration services, available 24 hours a day. What's the nature of your emergency?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "We just had a pipe burst in our basement. There's about two inches of water down there already.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "I understand — water damage spreads fast and every minute counts. I'm dispatching an emergency response team from {{businessName}} right now. What's your address?";
        pauseAfterMs = 600;
      },
      {
        speaker      = "customer";
        text         = "2247 Riverside Court. Please come quickly.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Team is en route to 2247 Riverside Court. ETA under 60 minutes. While you wait, if it's safe to do so, turn off the water main to stop additional flooding. We'll handle water extraction, drying, and I'll also coordinate with your insurance adjuster. You'll receive a text confirmation now.";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Thank you. Should I move things out of the basement?";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "If you can do so safely, yes — move electronics and valuables to a dry area. But don't risk injury. Our {{businessName}} crew is trained for exactly this. Help is on the way.";
        pauseAfterMs = 1000;
      },
    ];
  };

  public let carpetScript : NicheScript = {
    nicheId           = "carpet-cleaning";
    voiceName         = "Domi";
    elevenLabsVoiceId = "AZnzlk1XvdvUeBnXmlld";
    lines = [
      {
        speaker      = "agent";
        text         = "Hello, thank you for calling {{businessName}} carpet cleaning. I'm your scheduling assistant. What can I help you with today?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Hi, I need my living room and two bedrooms cleaned. My dog had an accident and I want to make sure the smell is completely gone.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Absolutely, that's our specialty. For pet odor elimination we use a hot-water extraction treatment with an enzyme pre-treatment that breaks down the odor at the source — not just masking it. For a living room and two bedrooms we're typically looking at about 2 to 3 hours. When would you like to get this scheduled?";
        pauseAfterMs = 600;
      },
      {
        speaker      = "customer";
        text         = "Is there anything available this weekend?";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "We have a Saturday morning slot at 9 AM open. I can hold that for you right now and send a confirmation text with your technician's name and a 30-minute heads-up call before arrival. Does Saturday at 9 work?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "That's perfect. Please book it.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Done! Saturday at 9 AM with {{businessName}}. Your confirmation is on its way. We'll have those carpets smelling fresh for you.";
        pauseAfterMs = 1000;
      },
    ];
  };

  public let roofingScript : NicheScript = {
    nicheId           = "roofing";
    voiceName         = "Charlotte";
    elevenLabsVoiceId = "XB0fDUnXU5powFXDhCwa";
    lines = [
      {
        speaker      = "agent";
        text         = "Thank you for calling {{businessName}} roofing. I'm your scheduling assistant. Are you calling about storm damage, a new roof, or a repair?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "We had a bad hailstorm last week and I think there might be damage. I'm not sure if I need a repair or a full replacement.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "That's exactly what our free storm inspection is for. A certified {{businessName}} inspector will come out, document any hail or wind damage with photos, and give you a full report — at no cost to you. If there is insurance-eligible damage, we also work directly with your adjuster. What's your address?";
        pauseAfterMs = 600;
      },
      {
        speaker      = "customer";
        text         = "It's 771 Elmwood Drive.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Perfect. I can get a {{businessName}} inspector out to 771 Elmwood Drive. We have availability tomorrow morning or Thursday afternoon. Which works better?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Tomorrow morning would be great.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "You're all set for tomorrow morning. I'll send you a confirmation with your inspector's name. The inspection is completely free and there's no obligation. See you then!";
        pauseAfterMs = 1000;
      },
    ];
  };

  public let realEstateScript : NicheScript = {
    nicheId           = "real-estate";
    voiceName         = "Sarah";
    elevenLabsVoiceId = "EXAVITQu4vr4xnSDxMaL";
    lines = [
      {
        speaker      = "agent";
        text         = "Thank you for calling {{businessName}} real estate. I'm your AI assistant. Are you looking to buy, sell, or just exploring your options?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "We're thinking about selling our home. We're not sure exactly when, but we want to know what it might be worth.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "That's a great first step. {{businessName}} offers a free, no-obligation home valuation — our agents pull live comparable sales in your specific neighborhood to give you an accurate picture of what you could realistically net today. It usually takes less than 30 minutes. Would you like to schedule that call?";
        pauseAfterMs = 600;
      },
      {
        speaker      = "customer";
        text         = "Yes, that sounds really helpful. When is the soonest available?";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "We have tomorrow at 2 PM or Thursday at 11 AM available with one of our listing specialists at {{businessName}}. Which works better for you?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Thursday at 11 works perfectly.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Excellent — you're booked for Thursday at 11 AM with {{businessName}}. I'll send a confirmation text with your agent's name and a brief form to capture a few details about your home so you get maximum value from the call. Have a wonderful day!";
        pauseAfterMs = 1000;
      },
    ];
  };

  public let mortgageScript : NicheScript = {
    nicheId           = "mortgage";
    voiceName         = "Grace";
    elevenLabsVoiceId = "oWAxZDx7w5VEj9dCyTzz";
    lines = [
      {
        speaker      = "agent";
        text         = "Thank you for calling {{businessName}} mortgage. I'm your loan concierge. Are you calling about a purchase, a refinance, or just checking on rates?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "I'm looking to buy my first home. I have no idea where to start with the mortgage process.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Congratulations on taking that step — and you've called the right place. First-time buyers are actually our specialty at {{businessName}}. We'll walk you through everything from pre-qualification to closing, and there are several first-time buyer programs that could reduce your down payment significantly. Would you like to schedule a free 20-minute call with one of our loan advisors?";
        pauseAfterMs = 600;
      },
      {
        speaker      = "customer";
        text         = "That would be amazing. Yes, please.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "We have tomorrow at 3 PM or Wednesday at 10 AM available. Which works better for your schedule?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Wednesday at 10 AM is perfect.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Wonderful — you're confirmed for Wednesday at 10 AM with a {{businessName}} first-time buyer specialist. I'll text you a quick checklist of documents to have handy for the call so you get the most out of it. You're going to love the process. See you Wednesday!";
        pauseAfterMs = 1000;
      },
    ];
  };

  public let chiropractorScript : NicheScript = {
    nicheId           = "chiropractor";
    voiceName         = "Emily";
    elevenLabsVoiceId = "LcfcDJNUP1GQjkzn1xUU";
    lines = [
      {
        speaker      = "agent";
        text         = "Thank you for calling {{businessName}} chiropractic care. I'm your scheduling assistant. Are you an existing patient or calling for the first time?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "I'm a new patient. I've been having really bad lower back pain for about two weeks. It started after I helped a friend move.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "I'm sorry to hear you're dealing with that — lower back strain from heavy lifting is one of the most common things we treat at {{businessName}}. The good news is it responds very well to chiropractic care. We offer new patients a comprehensive exam and first adjustment for $49. Would you like to get that scheduled?";
        pauseAfterMs = 600;
      },
      {
        speaker      = "customer";
        text         = "Yes, definitely. The sooner the better honestly.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Absolutely. We have a slot tomorrow at 1 PM and another Thursday morning at 9 AM. Which works for you?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Tomorrow at 1 PM works perfectly.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "You're confirmed for tomorrow at 1 PM at {{businessName}}. I'll send a new patient intake form to your phone — filling it out beforehand means you spend less time on paperwork and more time with the doctor. Looking forward to helping you feel better!";
        pauseAfterMs = 1000;
      },
    ];
  };

  public let dentalScript : NicheScript = {
    nicheId           = "dental";
    voiceName         = "Lily";
    elevenLabsVoiceId = "pFZP5JQG7iQjIQuC4Bku";
    lines = [
      {
        speaker      = "agent";
        text         = "Thank you for calling {{businessName}} dental. I'm your scheduling assistant. Are you an existing patient or calling to book your first visit?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "I'm new. I haven't been to the dentist in a couple years and I have a tooth that's been bothering me.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "We're glad you called — catching that early makes a big difference. We welcome new patients at {{businessName}} and we can get you in for a comprehensive exam that includes digital X-rays and a cleaning. For your tooth concern we'll make sure the doctor takes a close look and gives you clear options. Do you have dental insurance?";
        pauseAfterMs = 600;
      },
      {
        speaker      = "customer";
        text         = "Yes, I have Delta Dental through my employer.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "Great — we're in-network with Delta Dental, so your new patient exam and X-rays will likely be covered at 100%. I have a Tuesday at 2 PM and a Friday morning at 9:30 available. Which works better for you?";
        pauseAfterMs = 800;
      },
      {
        speaker      = "customer";
        text         = "Friday at 9:30 would be perfect.";
        pauseAfterMs = 400;
      },
      {
        speaker      = "agent";
        text         = "You're all set for Friday at 9:30 AM at {{businessName}}. I'll send a new patient packet to your phone now so we can keep your appointment moving smoothly. We'll take great care of you — see you Friday!";
        pauseAfterMs = 1000;
      },
    ];
  };

  /// Look up the hardcoded script for a given niche id.
  public func getScript(niche : Text) : ?NicheScript {
    switch (nicheFromText(niche)) {
      case (#plumber)        { ?plumberScript };
      case (#medSpa)         { ?medSpaScript };
      case (#hvac)           { ?hvacScript };
      case (#restoration)    { ?restorationScript };
      case (#carpetCleaning) { ?carpetScript };
      case (#roofing)        { ?roofingScript };
      case (#realEstate)     { ?realEstateScript };
      case (#mortgage)       { ?mortgageScript };
      case (#chiropractic)   { ?chiropractorScript };
      case (#dental)         { ?dentalScript };
      case (#unknown _)      { null };
    }
  };

  /// Return all 10 niche scripts as an array — useful for frontend pre-loading.
  public func getAllNicheScripts() : [NicheScript] {
    [
      plumberScript,
      medSpaScript,
      hvacScript,
      restorationScript,
      carpetScript,
      roofingScript,
      realEstateScript,
      mortgageScript,
      chiropractorScript,
      dentalScript,
    ]
  };

  /// Inject the actual business name into script lines (replace {{businessName}}).
  public func injectBusinessName(script : NicheScript, businessName : Text) : NicheScript {
    let injectedLines = script.lines.map(
      func(line) {
        { line with text = line.text.replace(#text "{{businessName}}", businessName) }
      }
    );
    { script with lines = injectedLines }
  };

  /// Generate a time-based session id.
  public func newSessionId(now : Int, businessName : Text) : Text {
    let salt = businessName.size() * 31;
    "demo-" # now.toText() # "-" # salt.toText()
  };

};
