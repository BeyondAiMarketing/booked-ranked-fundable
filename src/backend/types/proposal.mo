module {

  /// Status of a proposal.
  public type ProposalStatus = {
    #draft;
    #pending_review;
    #approved;
    #sent;
    #accepted;
    #rejected;
    #archived;
  };

  /// A single section within a proposal.
  public type ProposalSection = {
    title       : Text;
    body        : Text;
    order       : Nat;
  };

  /// An investment tier / package option.
  public type InvestmentTier = {
    name        : Text;
    description : Text;
    investment  : Text;
    deliverables: [Text];
    timeline    : Text;
  };

  /// A client-ready proposal generated from audit findings.
  public type Proposal = {
    id                : Text;
    clientBusinessId  : Text;
    verticalProfileId : Text;
    auditId           : ?Text;
    title             : Text;
    status            : ProposalStatus;
    executiveSummary  : Text;
    situationAnalysis : Text;
    strategyApproach  : Text;
    scopeOfWork       : Text;
    sections          : [ProposalSection];
    investmentTiers   : [InvestmentTier];
    timeline          : Text;
    assumptions       : Text;
    clientResponsibilities : Text;
    nextSteps         : Text;
    roiProjection     : ?Text;
    createdAt         : Int;
    updatedAt         : Int;
    sentAt            : ?Int;
  };

  /// Partial update for a proposal.
  public type ProposalUpdate = {
    title             : ?Text;
    status            : ?ProposalStatus;
    executiveSummary  : ?Text;
    situationAnalysis : ?Text;
    strategyApproach  : ?Text;
    scopeOfWork       : ?Text;
    sections          : ?[ProposalSection];
    investmentTiers   : ?[InvestmentTier];
    timeline          : ?Text;
    assumptions       : ?Text;
    clientResponsibilities : ?Text;
    nextSteps         : ?Text;
    roiProjection     : ?Text;
    sentAt            : ?Int;
  };

}
