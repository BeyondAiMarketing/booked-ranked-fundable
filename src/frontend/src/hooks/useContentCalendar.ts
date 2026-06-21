import { useCallback, useEffect, useState } from "react";
import type { CalendarEntry, ContentCalendar } from "../types/socialContent";
import { useActor } from "./useActor";

export function useContentCalendar() {
  const { actor } = useActor();
  const [calendar, setCalendar] = useState<ContentCalendar | null>(null);
  const [calendars, setCalendars] = useState<ContentCalendar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listCalendars = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listContentCalendars();
      setCalendars(result as ContentCalendar[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    listCalendars();
  }, [listCalendars]);

  const createCalendar = useCallback(
    async (data: Omit<ContentCalendar, "id" | "createdAt" | "updatedAt">) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createContentCalendar(data);
        setCalendar(result as ContentCalendar);
        await listCalendars();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listCalendars],
  );

  const updateCalendar = useCallback(
    async (id: string, updates: Partial<ContentCalendar>) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateContentCalendar(id, updates);
        setCalendar(result as ContentCalendar);
        await listCalendars();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listCalendars],
  );

  const addEntry = useCallback(
    async (calendarId: string, entry: Omit<CalendarEntry, "id">) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.addCalendarEntry(calendarId, entry);
        setCalendar(result as ContentCalendar);
        await listCalendars();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listCalendars],
  );

  const updateEntryStatus = useCallback(
    async (calendarId: string, entryId: string, status: string) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateCalendarEntryStatus(
          calendarId,
          entryId,
          status,
        );
        setCalendar(result as ContentCalendar);
        await listCalendars();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listCalendars],
  );

  return {
    calendar,
    calendars,
    loading,
    error,
    createCalendar,
    updateCalendar,
    addEntry,
    updateEntryStatus,
    listCalendars,
  };
}
