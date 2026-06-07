module {

  // ── Content type variant ─────────────────────────────────────────────────

  public type ContentType = {
    #Video;
    #Image;
    #AdCopy;
    #Blog;
  };

  // ── Generation status variant ─────────────────────────────────────────────

  public type GenerationStatus = {
    #Pending;
    #Generating;
    #Complete;
    #Failed;
  };

  // ── Request and result types ──────────────────────────────────────────────

  public type ContentGenerationRequest = {
    contentType       : ContentType;
    prompt            : Text;
    niche             : Text;
    accountId         : Text;
    additionalContext : ?Text;
  };

  public type ContentGenerationResult = {
    id          : Text;
    contentType : ContentType;
    prompt      : Text;
    niche       : Text;
    output      : Text;
    mediaUrl    : ?Text;
    generatedAt : Int;
    accountId   : Text;
    status      : GenerationStatus;
    errorMsg    : ?Text;
  };

  // ── Tier toggle ───────────────────────────────────────────────────────────

  public type ContentTierToggle = {
    tier                   : Text;
    contentCreationEnabled : Bool;
  };

  // ── OpenRouter model constants for content generation ─────────────────────
  //   These are module-level constants; consuming lib modules import this type
  //   file and reference these constants for model selection.

  public let imageModel : Text = "black-forest-labs/flux-pro-2";
  public let videoModel : Text = "google/veo-3.1";
  public let textModel  : Text = "openrouter/owl-alpha";

  // ── Stable state record ───────────────────────────────────────────────────

  public type ContentStudioState = {
    generatedContent : [ContentGenerationResult];
    tierToggles      : [ContentTierToggle];
  };

  public func emptyState() : ContentStudioState {
    { generatedContent = []; tierToggles = [] };
  };

};
