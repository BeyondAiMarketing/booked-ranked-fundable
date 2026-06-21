import { af as useActor, r as reactExports } from "./index-CHgLG-xR.js";
function useVerticalProfile() {
  const { actor } = useActor();
  const [profile, setProfile] = reactExports.useState(null);
  const [profiles, setProfiles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const listProfiles = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listVerticalProfiles();
      setProfiles(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    listProfiles();
  }, [listProfiles]);
  const createProfile = reactExports.useCallback(
    async (data) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createVerticalProfile(data);
        setProfile(result);
        await listProfiles();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listProfiles]
  );
  const updateProfile = reactExports.useCallback(
    async (id, updates) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateVerticalProfile(id, updates);
        setProfile(result);
        await listProfiles();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listProfiles]
  );
  const deleteProfile = reactExports.useCallback(
    async (id) => {
      if (!actor) return;
      setLoading(true);
      try {
        await actor.deleteVerticalProfile(id);
        setProfile(null);
        await listProfiles();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listProfiles]
  );
  return {
    profile,
    profiles,
    loading,
    error,
    createProfile,
    updateProfile,
    deleteProfile,
    listProfiles
  };
}
export {
  useVerticalProfile as u
};
