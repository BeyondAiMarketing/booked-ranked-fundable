/**
 * useIntegrationHealth — tracks per-integration test state, last-tested timestamps,
 * and persists a credential change log in localStorage.
 *
 * This hook is the single source of truth for:
 * - Per-integration health status ("connected" | "testing" | "error" | "not-configured" | "optional")
 * - Last-tested timestamp per integration
 * - Retesting a specific integration on demand
 * - A persistent credential change log (last 20 entries, stored in localStorage)
 */

import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type IntegrationHealthStatus =
  | "connected"
  | "testing"
  | "error"
  | "not-configured"
  | "optional";

export interface IntegrationHealthRecord {
  status: IntegrationHealthStatus;
  lastTested: Date | null;
  errorMessage?: string;
}

export interface CredentialChangeEntry {
  id: string;
  timestamp: string; // ISO string for localStorage serialization
  integration: string;
  action: "Added" | "Updated" | "Deleted";
  detail?: string;
}

// Integrations that are optional — never shown as "not-configured" (gray)
const OPTIONAL_INTEGRATIONS = new Set([
  "perplexity",
  "litellm",
  "ollama",
  "listmonk",
  "searxng",
  "hunter",
  "neverbounce",
]);

const CHANGE_LOG_KEY = "brf_credential_change_log";
const MAX_LOG_ENTRIES = 20;

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useIntegrationHealth() {
  const [healthMap, setHealthMap] = useState<
    Record<string, IntegrationHealthRecord>
  >({});

  // Persistent change log
  const [changeLog, setChangeLog] = useState<CredentialChangeEntry[]>(() => {
    try {
      const stored = localStorage.getItem(CHANGE_LOG_KEY);
      return stored ? (JSON.parse(stored) as CredentialChangeEntry[]) : [];
    } catch {
      return [];
    }
  });

  // Keep a ref for the test-in-progress tracking to avoid re-renders
  const testingRef = useRef<Set<string>>(new Set());

  /** Derive status for an integration given whether its credential is set */
  const deriveStatus = useCallback(
    (
      integrationId: string,
      hasCredential: boolean,
    ): IntegrationHealthStatus => {
      const existing = healthMap[integrationId];
      // If currently testing, preserve that
      if (existing?.status === "testing") return "testing";
      // If we have a known result from a real test, preserve it
      if (existing?.status === "connected" || existing?.status === "error") {
        return existing.status;
      }
      // Derive from credential presence
      if (!hasCredential) {
        return OPTIONAL_INTEGRATIONS.has(integrationId)
          ? "optional"
          : "not-configured";
      }
      return "connected";
    },
    [healthMap],
  );

  /** Update health record for a specific integration */
  const setHealth = useCallback(
    (integrationId: string, update: Partial<IntegrationHealthRecord>) => {
      setHealthMap((prev) => {
        const existing = prev[integrationId] ?? {
          status: "not-configured" as IntegrationHealthStatus,
          lastTested: null,
        };
        return {
          ...prev,
          [integrationId]: { ...existing, ...update },
        };
      });
    },
    [],
  );

  /** Mark integration as "testing" */
  const markTesting = useCallback(
    (integrationId: string) => {
      testingRef.current.add(integrationId);
      setHealth(integrationId, { status: "testing", errorMessage: undefined });
    },
    [setHealth],
  );

  /** Mark integration as "connected" */
  const markConnected = useCallback(
    (integrationId: string) => {
      testingRef.current.delete(integrationId);
      setHealth(integrationId, {
        status: "connected",
        lastTested: new Date(),
        errorMessage: undefined,
      });
    },
    [setHealth],
  );

  /** Mark integration as "error" */
  const markError = useCallback(
    (integrationId: string, message?: string) => {
      testingRef.current.delete(integrationId);
      setHealth(integrationId, {
        status: "error",
        lastTested: new Date(),
        errorMessage: message,
      });
    },
    [setHealth],
  );

  /** Mark integration as not configured (credential cleared) */
  const markNotConfigured = useCallback(
    (integrationId: string) => {
      testingRef.current.delete(integrationId);
      setHealth(integrationId, {
        status: OPTIONAL_INTEGRATIONS.has(integrationId)
          ? "optional"
          : "not-configured",
        lastTested: null,
        errorMessage: undefined,
      });
    },
    [setHealth],
  );

  /** Get health record for a given integration (with fallback) */
  const getHealth = useCallback(
    (integrationId: string): IntegrationHealthRecord => {
      return (
        healthMap[integrationId] ?? {
          status: "not-configured",
          lastTested: null,
        }
      );
    },
    [healthMap],
  );

  /** Log a credential change to localStorage */
  const logChange = useCallback(
    (
      integration: string,
      action: CredentialChangeEntry["action"],
      detail?: string,
    ) => {
      const entry: CredentialChangeEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        integration,
        action,
        detail,
      };
      setChangeLog((prev) => {
        const next = [entry, ...prev].slice(0, MAX_LOG_ENTRIES);
        try {
          localStorage.setItem(CHANGE_LOG_KEY, JSON.stringify(next));
        } catch {
          // localStorage may be unavailable
        }
        return next;
      });
    },
    [],
  );

  /** Clear all persisted log entries */
  const clearChangeLog = useCallback(() => {
    setChangeLog([]);
    try {
      localStorage.removeItem(CHANGE_LOG_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    healthMap,
    changeLog,
    deriveStatus,
    setHealth,
    markTesting,
    markConnected,
    markError,
    markNotConfigured,
    getHealth,
    logChange,
    clearChangeLog,
  };
}
