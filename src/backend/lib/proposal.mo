import Map   "mo:core/Map";
import List  "mo:core/List";
import Time  "mo:core/Time";
import Text  "mo:core/Text";
import Nat   "mo:core/Nat";
import Array "mo:core/Array";
import T     "../types/proposal";

module {

  public type State = {
    proposals : Map.Map<Text, T.Proposal>;
  };

  public func emptyState() : State = {
    proposals = Map.empty();
  };

  /// Persist a proposal.
  public func save(state : State, proposal : T.Proposal) : () {
    state.proposals.add(proposal.id, proposal);
  };

  /// Retrieve a proposal by id.
  public func get(state : State, id : Text) : ?T.Proposal {
    state.proposals.get(id);
  };

  /// Get all proposals for a client business.
  public func listByClient(state : State, clientBusinessId : Text) : [T.Proposal] {
    let result = List.empty<T.Proposal>();
    for (p in state.proposals.values()) {
      if (p.clientBusinessId == clientBusinessId) { result.add(p) };
    };
    result.toArray();
  };

  /// Get proposals by status for a client.
  public func listByStatus(state : State, clientBusinessId : Text, status : T.ProposalStatus) : [T.Proposal] {
    let result = List.empty<T.Proposal>();
    for (p in state.proposals.values()) {
      if (p.clientBusinessId == clientBusinessId and p.status == status) { result.add(p) };
    };
    result.toArray();
  };

  /// Merge a partial update into an existing proposal.
  public func update(state : State, id : Text, upd : T.ProposalUpdate) : Bool {
    switch (state.proposals.get(id)) {
      case (?existing) {
        let updated : T.Proposal = {
          existing with
          title             = switch (upd.title)             { case (?v) v; case null existing.title             };
          status            = switch (upd.status)            { case (?v) v; case null existing.status            };
          executiveSummary  = switch (upd.executiveSummary)  { case (?v) v; case null existing.executiveSummary  };
          situationAnalysis = switch (upd.situationAnalysis) { case (?v) v; case null existing.situationAnalysis };
          strategyApproach  = switch (upd.strategyApproach)  { case (?v) v; case null existing.strategyApproach  };
          scopeOfWork       = switch (upd.scopeOfWork)       { case (?v) v; case null existing.scopeOfWork       };
          sections          = switch (upd.sections)          { case (?v) v; case null existing.sections          };
          investmentTiers   = switch (upd.investmentTiers)   { case (?v) v; case null existing.investmentTiers   };
          timeline          = switch (upd.timeline)          { case (?v) v; case null existing.timeline          };
          assumptions       = switch (upd.assumptions)       { case (?v) v; case null existing.assumptions       };
          clientResponsibilities = switch (upd.clientResponsibilities) { case (?v) v; case null existing.clientResponsibilities };
          nextSteps         = switch (upd.nextSteps)         { case (?v) v; case null existing.nextSteps         };
          roiProjection     = switch (upd.roiProjection)     { case (?v) ?v; case null existing.roiProjection     };
          sentAt            = switch (upd.sentAt)            { case (?v) ?v; case null existing.sentAt            };
          updatedAt         = Time.now();
        };
        state.proposals.add(id, updated);
        true;
      };
      case null false;
    };
  };

  /// Remove a proposal.
  public func delete(state : State, id : Text) : Bool {
    switch (state.proposals.get(id)) {
      case (?_) { state.proposals.remove(id); true };
      case null false;
    };
  };

  /// Generate a draft proposal from an audit reference.
  /// Creates a pre-populated proposal with templated content.
  public func generateFromAudit(
    state : State,
    clientBusinessId : Text,
    verticalProfileId : Text,
    auditId : Text,
    auditScore : Nat,
    auditFindings : [Text],
    auditRecommendations : [Text],
  ) : T.Proposal {
    let now = Time.now();
    let id = "prop-" # now.toText() # "-" # clientBusinessId;

    let execSummary = "Based on our comprehensive marketing audit, your business scored " # auditScore.toText() # "/100. We identified key opportunities to improve your Booked, Ranked, and Funded performance.";

    let situationText = "Current findings: " # auditFindings.foldLeft("", func(acc, finding) { if (acc == "") { finding } else { acc # ", " # finding } }) # ".";

    let strategyText = "Our strategy focuses on: " # auditRecommendations.foldLeft("", func(acc, rec) { if (acc == "") { rec } else { acc # ", " # rec } }) # ".";

    let sections : [T.ProposalSection] = [
      { title = "Executive Summary"; body = execSummary; order = 1 },
      { title = "Situation Analysis"; body = situationText; order = 2 },
      { title = "Strategy & Approach"; body = strategyText; order = 3 },
      { title = "Scope of Work"; body = "Detailed scope to be customized based on selected tier."; order = 4 },
      { title = "Investment & Timeline"; body = "See investment tiers below."; order = 5 },
      { title = "Next Steps"; body = "Review this proposal, select your preferred tier, and schedule a kickoff call."; order = 6 },
    ];

    let tiers : [T.InvestmentTier] = [
      {
        name = "Essential";
        description = "Core Booked + Ranked + Funded foundation";
        investment = "$1,500/month";
        deliverables = ["Lead capture system", "GBP optimization", "Review management", "Monthly reporting"];
        timeline = "30-day setup, ongoing monthly";
      },
      {
        name = "Growth";
        description = "Accelerated growth with content and campaigns";
        investment = "$3,500/month";
        deliverables = ["Everything in Essential", "Content calendar", "Email/SMS sequences", "Social content", "Bi-weekly strategy calls"];
        timeline = "30-day setup, ongoing monthly";
      },
      {
        name = "Scale";
        description = "Full AI-powered operating system";
        investment = "$7,500/month";
        deliverables = ["Everything in Growth", "AI voice agent", "Advanced analytics", "Priority support", "Custom integrations"];
        timeline = "45-day setup, ongoing monthly";
      },
    ];

    let proposal : T.Proposal = {
      id;
      clientBusinessId;
      verticalProfileId;
      auditId = ?auditId;
      title = "BRF Growth Proposal — " # clientBusinessId;
      status = #draft;
      executiveSummary = execSummary;
      situationAnalysis = situationText;
      strategyApproach = strategyText;
      scopeOfWork = "Full scope customized per selected tier.";
      sections;
      investmentTiers = tiers;
      timeline = "Setup within 30-45 days, then ongoing monthly management.";
      assumptions = "Client provides access to existing accounts (GBP, website, social). Pricing assumes no major technical debt.";
      clientResponsibilities = "Provide brand assets, approve content drafts, respond to review alerts within 24 hours.";
      nextSteps = "1. Review proposal 2. Select tier 3. Schedule kickoff 4. Begin onboarding.";
      roiProjection = null;
      createdAt = now;
      updatedAt = now;
      sentAt = null;
    };

    state.proposals.add(id, proposal);
    proposal;
  };

}
