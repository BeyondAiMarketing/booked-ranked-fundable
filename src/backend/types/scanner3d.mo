module {

  /// A 3D Gaussian Splat model built from uploaded job-site or property photos.
  /// `status` lifecycle: "pending" → "processing" → "ready" | "failed"
  public type ScanModel = {
    id           : Text;
    tenantId     : Text;
    title        : Text;
    description  : Text;
    /// Niche slug — e.g. "real_estate", "roofing", "restoration"
    niche        : Text;
    photoCount   : Nat;
    status       : Text;   // "pending" | "processing" | "ready" | "failed"
    modelUrl     : Text;
    thumbnailUrl : Text;
    uploadedAt   : Int;
    viewCount    : Nat;
    /// Whether a CRM lead has been linked to this model's viewer page
    crmLinked    : Bool;
  };

  /// An individual photo that was uploaded as part of a ScanModel capture set.
  public type ScanPhoto = {
    id         : Text;
    modelId    : Text;
    tenantId   : Text;
    storageUrl : Text;
    uploadedAt : Int;
  };

};
