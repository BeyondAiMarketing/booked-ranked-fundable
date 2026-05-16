import Map          "mo:core/Map";
import List         "mo:core/List";
import Time         "mo:core/Time";
import Text         "mo:core/Text";
import Principal    "mo:core/Principal";
import Runtime      "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Scanner3DTypes "../types/scanner3d";

mixin (
  accessControlState : AccessControl.AccessControlState,
  /// Per-tenant 3D Scanner feature flag (TenantId -> Bool)
  scanner3dEnabled   : Map.Map<Text, Bool>,
  /// Audit log: (adminId, tenantId, enabled, timestamp)
  scanner3dToggleLog : List.List<(Text, Text, Bool, Int)>,
  /// All scan models, keyed by modelId
  scanModels         : Map.Map<Text, Scanner3DTypes.ScanModel>,
  /// All scan photos, keyed by photoId
  scanPhotos         : Map.Map<Text, Scanner3DTypes.ScanPhoto>,
) {

  // ---- Auth helpers --------------------------------------------------------

  func scanner3dIsSuperAdmin(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller)
  };

  // ---- ID helpers ----------------------------------------------------------

  var scanner3dIdCounter : Nat = 0;

  func nextId(prefix : Text) : Text {
    scanner3dIdCounter += 1;
    prefix # "-" # Time.now().toText() # "-" # scanner3dIdCounter.toText();
  };

  // ---- Feature Toggle (Super Admin only) -----------------------------------

  /// Returns whether the 3D Scanner feature is enabled for a given tenant.
  /// Defaults to `false` when no explicit setting has been saved.
  public query func getScanner3dEnabled(tenantId : Text) : async Bool {
    switch (scanner3dEnabled.get(tenantId)) {
      case (?v) v;
      case (null) false;
    };
  };

  /// Enable or disable the 3D Scanner for a specific tenant account.
  /// Only Super Admins may call this.  Every toggle is written to the audit log.
  public shared ({ caller }) func setScanner3dEnabled(tenantId : Text, enabled : Bool) : async () {
    if (not scanner3dIsSuperAdmin(caller)) {
      Runtime.trap("Unauthorized: Super Admin only");
    };
    scanner3dEnabled.add(tenantId, enabled);
    scanner3dToggleLog.add((caller.toText(), tenantId, enabled, Time.now()));
  };

  /// Bulk-toggle the 3D Scanner across multiple tenant accounts in one call.
  /// Only Super Admins may call this.  Each change is individually logged.
  public shared ({ caller }) func setScanner3dEnabledBatch(updates : [(Text, Bool)]) : async () {
    if (not scanner3dIsSuperAdmin(caller)) {
      Runtime.trap("Unauthorized: Super Admin only");
    };
    let now = Time.now();
    for ((tenantId, enabled) in updates.vals()) {
      scanner3dEnabled.add(tenantId, enabled);
      scanner3dToggleLog.add((caller.toText(), tenantId, enabled, now));
    };
  };

  /// Returns the full audit trail of every feature-toggle event.
  /// Only Super Admins may call this.
  public query ({ caller }) func getScanner3dToggleLog() : async [(Text, Text, Bool, Int)] {
    if (not scanner3dIsSuperAdmin(caller)) {
      Runtime.trap("Unauthorized: Super Admin only");
    };
    scanner3dToggleLog.toArray();
  };

  // ---- Scan Model CRUD ----------------------------------------------------

  /// Create a new ScanModel in "pending" status and return its generated ID.
  public shared ({ caller }) func createScanModel(
    tenantId : Text,
    title    : Text,
    niche    : Text,
  ) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (scanner3dEnabled.get(tenantId)) {
      case (?true) {};
      case (_) { Runtime.trap("3D Scanner is not enabled for this account") };
    };
    let id = nextId("scan");
    scanModels.add(id, {
      id;
      tenantId;
      title;
      description  = "";
      niche;
      photoCount   = 0;
      status       = "pending";
      modelUrl     = "";
      thumbnailUrl = "";
      uploadedAt   = Time.now();
      viewCount    = 0;
      crmLinked    = false;
    });
    id;
  };

  /// Add a photo to an existing ScanModel and increment its photo count.
  /// Returns the generated photoId.
  public shared ({ caller }) func addScanPhoto(
    modelId    : Text,
    tenantId   : Text,
    storageUrl : Text,
  ) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Users only");
    };
    let model = switch (scanModels.get(modelId)) {
      case (?m) m;
      case (null) { Runtime.trap("ScanModel not found") };
    };
    if (model.tenantId != tenantId and not scanner3dIsSuperAdmin(caller)) {
      Runtime.trap("Unauthorized: tenant mismatch");
    };
    let photoId = nextId("photo");
    scanPhotos.add(photoId, {
      id         = photoId;
      modelId;
      tenantId;
      storageUrl;
      uploadedAt = Time.now();
    });
    // Increment photo count on the parent model
    scanModels.add(modelId, { model with photoCount = model.photoCount + 1 });
    photoId;
  };

  /// Update a ScanModel's processing status, modelUrl, and thumbnailUrl.
  /// Called by the processing pipeline after a 3D model is ready (or has failed).
  public shared ({ caller }) func updateScanModelStatus(
    modelId      : Text,
    status       : Text,
    modelUrl     : Text,
    thumbnailUrl : Text,
  ) : async () {
    if (not scanner3dIsSuperAdmin(caller)) {
      Runtime.trap("Unauthorized: Super Admin only");
    };
    let model = switch (scanModels.get(modelId)) {
      case (?m) m;
      case (null) { Runtime.trap("ScanModel not found") };
    };
    scanModels.add(modelId, { model with status; modelUrl; thumbnailUrl });
  };

  /// Return all ScanModels belonging to a given tenant.
  public query ({ caller }) func getScanModels(tenantId : Text) : async [Scanner3DTypes.ScanModel] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Users only");
    };
    let list = List.empty<Scanner3DTypes.ScanModel>();
    for (m in scanModels.values()) {
      if (m.tenantId == tenantId) { list.add(m) };
    };
    list.toArray();
  };

  /// Return a single ScanModel by ID.
  public query func getScanModel(modelId : Text) : async ?Scanner3DTypes.ScanModel {
    scanModels.get(modelId);
  };

  /// Increment the view counter on a ScanModel (called when the public viewer loads).
  public shared func incrementScanModelViews(modelId : Text) : async () {
    switch (scanModels.get(modelId)) {
      case (?m) { scanModels.add(modelId, { m with viewCount = m.viewCount + 1 }) };
      case (null) {};
    };
  };

  /// Update a ScanModel's editable fields (title and description).
  public shared ({ caller }) func updateScanModel(
    modelId     : Text,
    title       : Text,
    description : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Users only");
    };
    let model = switch (scanModels.get(modelId)) {
      case (?m) m;
      case (null) { Runtime.trap("ScanModel not found") };
    };
    scanModels.add(modelId, { model with title; description });
  };

  /// Delete a ScanModel and all of its associated ScanPhotos.
  /// The caller must own the tenant or be a Super Admin.
  public shared ({ caller }) func deleteScanModel(modelId : Text, tenantId : Text) : async () {
    if (not (scanner3dIsSuperAdmin(caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Users only");
    };
    let model = switch (scanModels.get(modelId)) {
      case (?m) m;
      case (null) { Runtime.trap("ScanModel not found") };
    };
    if (model.tenantId != tenantId and not scanner3dIsSuperAdmin(caller)) {
      Runtime.trap("Unauthorized: tenant mismatch");
    };
    scanModels.remove(modelId);
    // Remove all photos belonging to this model
    let toDelete = List.empty<Text>();
    for ((photoId, photo) in scanPhotos.entries()) {
      if (photo.modelId == modelId) { toDelete.add(photoId) };
    };
    for (photoId in toDelete.values()) {
      scanPhotos.remove(photoId);
    };
  };

  /// Return every ScanModel across all tenants (Super Admin only).
  public query ({ caller }) func getAllScanModels() : async [Scanner3DTypes.ScanModel] {
    if (not scanner3dIsSuperAdmin(caller)) {
      Runtime.trap("Unauthorized: Super Admin only");
    };
    scanModels.values().toArray();
  };

};
