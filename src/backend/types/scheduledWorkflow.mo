import Time "mo:core/Time";

module {

  /// Task types mapped from Local SEO Skills scheduled workflow patterns.
  public type TaskType = {
    #gbp_post_drafts;
    #review_response_drafts;
    #citation_audit;
    #page_content_audit;
    #rankings_monitor;
    #review_velocity_monitor;
    #gbp_change_monitor;
    #ai_visibility_monitor;
    #prospect_audit;
    #competitor_monitor;
    #weekly_report;
    #monthly_client_report;
    #multi_location_rollup;
    #quarterly_business_review;
  };

  /// Approval tier from Local SEO Skills spec.
  public type Tier = {
    #tier_1_autonomous;   // internal audits, scans, scorecards, monitoring, draft reports
    #tier_2_queue;         // drafts for GBP posts, review replies, social posts, emails, SMS, reports, website content
    #tier_3_notify_confirm; // anything public, third-party, client-facing, email/SMS, GBP/social/website publishing, legal/medical/financial/funding claims
  };

  /// Status of a scheduled workflow.
  public type WorkflowStatus = {
    #active;
    #paused;
    #completed;
    #failed;
    #archived;
  };

  /// A single scheduled workflow record.
  public type ScheduledWorkflow = {
    id                : Text;
    clientBusinessId  : Text;
    verticalProfileId : Text;
    taskType          : TaskType;
    frequency         : Text;        // e.g. "daily", "weekly", "monthly", "quarterly", "on_demand"
    tier              : Tier;
    lastRun           : ?Int;
    nextRun           : ?Int;
    isActive          : Bool;
    n8nWebhookId      : Text;
    config            : [Text];       // key-value pairs as "key=value" strings
    status            : WorkflowStatus;
    createdAt         : Int;
  };

  /// Input for creating a new scheduled workflow.
  public type CreateInput = {
    clientBusinessId  : Text;
    verticalProfileId : Text;
    taskType          : TaskType;
    frequency         : Text;
    tier              : Tier;
    n8nWebhookId      : Text;
    config            : [Text];
  };

  /// Input for updating an existing scheduled workflow.
  public type UpdateInput = {
    id                : Text;
    frequency         : ?Text;
    tier              : ?Tier;
    n8nWebhookId      : ?Text;
    config            : ?[Text];
    status            : ?WorkflowStatus;
  };

  /// Frequency validation: supported values.
  public let validFrequencies : [Text] = [
    "daily", "weekly", "bi_weekly", "monthly", "quarterly", "on_demand"
  ];

  /// Tier-to-approval mapping helper.
  public func tierToApprovalTier(tier : Tier) : Text {
    switch (tier) {
      case (#tier_1_autonomous)   "autonomous";
      case (#tier_2_queue)        "queue";
      case (#tier_3_notify_confirm) "notify_confirm";
    };
  };

  /// Task type display name helper.
  public func taskTypeLabel(tt : TaskType) : Text {
    switch (tt) {
      case (#gbp_post_drafts)              "GBP Post Drafts";
      case (#review_response_drafts)       "Review Response Drafts";
      case (#citation_audit)               "Citation Audit";
      case (#page_content_audit)           "Page Content Audit";
      case (#rankings_monitor)             "Rankings Monitor";
      case (#review_velocity_monitor)      "Review Velocity Monitor";
      case (#gbp_change_monitor)           "GBP Change Monitor";
      case (#ai_visibility_monitor)        "AI Visibility Monitor";
      case (#prospect_audit)               "Prospect Audit";
      case (#competitor_monitor)           "Competitor Monitor";
      case (#weekly_report)                "Weekly Report";
      case (#monthly_client_report)        "Monthly Client Report";
      case (#multi_location_rollup)        "Multi-Location Rollup";
      case (#quarterly_business_review)    "Quarterly Business Review";
    };
  };

  /// Default tier for a given task type (from Local SEO Skills spec).
  public func defaultTierForTask(tt : TaskType) : Tier {
    switch (tt) {
      case (#gbp_post_drafts)           #tier_2_queue;
      case (#review_response_drafts)    #tier_2_queue;
      case (#citation_audit)            #tier_1_autonomous;
      case (#page_content_audit)        #tier_2_queue;
      case (#rankings_monitor)          #tier_1_autonomous;
      case (#review_velocity_monitor)   #tier_1_autonomous;
      case (#gbp_change_monitor)        #tier_1_autonomous;
      case (#ai_visibility_monitor)     #tier_1_autonomous;
      case (#prospect_audit)            #tier_1_autonomous;
      case (#competitor_monitor)        #tier_1_autonomous;
      case (#weekly_report)             #tier_1_autonomous;
      case (#monthly_client_report)     #tier_3_notify_confirm;
      case (#multi_location_rollup)     #tier_1_autonomous;
      case (#quarterly_business_review) #tier_2_queue;
    };
  };

  /// Default frequency for a given task type (from Local SEO Skills spec).
  public func defaultFrequencyForTask(tt : TaskType) : Text {
    switch (tt) {
      case (#gbp_post_drafts)           "monthly";
      case (#review_response_drafts)    "weekly";
      case (#citation_audit)            "quarterly";
      case (#page_content_audit)        "quarterly";
      case (#rankings_monitor)          "weekly";
      case (#review_velocity_monitor)   "weekly";
      case (#gbp_change_monitor)        "daily";
      case (#ai_visibility_monitor)     "monthly";
      case (#prospect_audit)            "on_demand";
      case (#competitor_monitor)        "monthly";
      case (#weekly_report)             "weekly";
      case (#monthly_client_report)     "monthly";
      case (#multi_location_rollup)     "monthly";
      case (#quarterly_business_review) "quarterly";
    };
  };

}
