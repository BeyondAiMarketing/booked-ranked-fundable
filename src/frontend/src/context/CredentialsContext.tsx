// CredentialsContext — Backend-sourced credential store (single source of truth)
// Fetches decrypted credentials from the Motoko backend canister on mount.
// NO localStorage reads or writes for credentials.
// All components that need runtime API keys (ElevenLabs, LiteLLM, Vapi) read from here.

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useActor } from "../hooks/useActor";
import { PLATFORM_TENANT_ID } from "../lib/constants";

const TENANT_ID = PLATFORM_TENANT_ID; // "platform" — backend normalizes all saves here

export interface LiveCredentials {
  // LLM
  openaiKey: string;
  claudeKey: string;
  litellmUrl: string;
  litellmKey: string;
  ollamaUrl: string;
  // Voice
  vapiKey: string;
  vapiAssistantId: string;
  elevenLabsKey: string;
  vapiIsActive: boolean;
  // AI services
  searxngUrl: string;
  // Research / enrichment
  perplexityApiKey: string;
  // Lead discovery
  serpApiKey: string;
  serpApiDevKey: string;
  // MCP integrations
  composioConfigured: boolean;
  composioWebhookSecretConfigured: boolean;
  abacusConfigured: boolean;
  // AI provider keys (for fallback chain)
  openRouterApiKey: string;
  nvidiaApiKey: string;
  geminiApiKey: string;
}

interface CredentialsContextValue {
  creds: LiveCredentials | null;
  isLoading: boolean;
  backendError: string | null;
  /** Call to force a re-fetch after saving new credentials */
  refresh: () => void;
}

const DEFAULT_CREDS: LiveCredentials = {
  openaiKey: "",
  claudeKey: "",
  litellmUrl: "",
  litellmKey: "",
  ollamaUrl: "",
  vapiKey: "",
  vapiAssistantId: "",
  elevenLabsKey: "",
  vapiIsActive: false,
  searxngUrl: "",
  perplexityApiKey: "",
  serpApiKey: "",
  serpApiDevKey: "",
  composioConfigured: false,
  composioWebhookSecretConfigured: false,
  abacusConfigured: false,
  openRouterApiKey: "",
  nvidiaApiKey: "",
  geminiApiKey: "",
};

const CredentialsContext = createContext<CredentialsContextValue>({
  creds: null,
  isLoading: true,
  backendError: null,
  refresh: () => {},
});

// Maximum number of retry attempts before giving up and showing a hard error.
const MAX_RETRIES = 3;
// Exponential backoff delays in ms: attempt 1→3s, 2→6s, 3→12s
const RETRY_DELAYS = [3000, 6000, 12000] as const;

export function CredentialsProvider({ children }: { children: ReactNode }) {
  const { actor, isFetching, authStalled } = useActor();
  const [creds, setCreds] = useState<LiveCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Use a ref to hold the retry timer so we can cancel it on unmount
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const retryTimerRef = useRef<any>(null);

  // Increment token forces a re-fetch when `refresh()` is called
  const [refreshToken, setRefreshToken] = useState(0);

  const refresh = useCallback(() => setRefreshToken((t) => t + 1), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Clear any in-flight retry timer when actor/token changes
    // retryTimerRef is a ref — intentionally excluded from dep array per React docs
    if (retryTimerRef.current !== null) {
      clearTimeout(retryTimerRef.current as ReturnType<typeof setTimeout>);
      retryTimerRef.current = null;
    }

    // If auth has stalled, stop immediately — never leave isLoading=true indefinitely
    if (authStalled) {
      setBackendError(
        "Authentication stalled — please refresh the page to reconnect.",
      );
      setIsLoading(false);
      return;
    }

    // Wait until actor is ready
    if (isFetching || !actor) return;

    // refreshToken is read here to satisfy the exhaustive-deps rule —
    // its value is intentionally ignored; changing it re-runs this effect.
    void refreshToken;

    setIsLoading(true);
    setBackendError(null);

    let retryAttempt = 0;
    let cancelled = false;

    async function run() {
      while (retryAttempt <= MAX_RETRIES) {
        if (cancelled) return;

        const [
          elevenLabsResult,
          vapiStatusResult,
          integrationCredsResult,
          agencySettingsResult,
          composioStatusResult,
          abacusStatusResult,
          composioWebhookSecretResult,
        ] = await Promise.allSettled([
          actor!.getElevenLabsApiKey(),
          actor!.getVapiStatus(TENANT_ID),
          actor!.getIntegrationCredentials(TENANT_ID),
          actor!.getAgencySettings(),
          actor!.getComposioApiKeyStatus(TENANT_ID),
          actor!.getAbacusApiKeyStatus(TENANT_ID),
          (
            actor as unknown as Record<
              string,
              (...args: unknown[]) => Promise<unknown>
            >
          )?.getComposioWebhookSecretStatus?.(),
        ]);

        if (cancelled) return;

        if (elevenLabsResult.status === "rejected") {
          console.warn(
            "[CredentialsContext] getElevenLabsApiKey failed:",
            elevenLabsResult.reason,
          );
        }
        if (vapiStatusResult.status === "rejected") {
          console.warn(
            "[CredentialsContext] getVapiStatus failed:",
            vapiStatusResult.reason,
          );
        }

        if (integrationCredsResult.status === "rejected") {
          retryAttempt += 1;
          if (retryAttempt <= MAX_RETRIES) {
            const delay = RETRY_DELAYS[retryAttempt - 1] ?? 12000;
            setBackendError(
              `Retrying connection… (attempt ${retryAttempt} of ${MAX_RETRIES})`,
            );
            // Wait for backoff delay
            await new Promise<void>((resolve) => {
              retryTimerRef.current = setTimeout(() => {
                retryTimerRef.current = null;
                resolve();
              }, delay);
            });
            continue;
          }
          // Max retries exhausted — surface a clear, actionable error and stop
          console.error(
            "[CredentialsContext] getIntegrationCredentials failed after max retries:",
            integrationCredsResult.reason,
          );
          if (!cancelled) {
            setBackendError(
              "Unable to connect to credential storage. Please refresh the page.",
            );
            setCreds(DEFAULT_CREDS);
            setIsLoading(false);
          }
          return;
        }

        // Success path
        const elevenLabsKey =
          elevenLabsResult.status === "fulfilled"
            ? (elevenLabsResult.value as string | null)
            : null;

        const vapiStatus =
          vapiStatusResult.status === "fulfilled"
            ? vapiStatusResult.value
            : null;

        const integrationCreds =
          integrationCredsResult.status === "fulfilled"
            ? integrationCredsResult.value
            : null;

        const vapiActive =
          vapiStatus !== null &&
          typeof vapiStatus === "object" &&
          "configured" in vapiStatus &&
          (vapiStatus as { configured: boolean }).configured;

        const masked = integrationCreds as Record<string, string> | null;

        const agencySettings =
          agencySettingsResult.status === "fulfilled"
            ? (agencySettingsResult.value as { serpApiKey?: string } | null)
            : null;

        const composioStatus =
          composioStatusResult.status === "fulfilled"
            ? (composioStatusResult.value as {
                configured: boolean;
                maskedKey: string;
              })
            : { configured: false, maskedKey: "" };

        const abacusStatus =
          abacusStatusResult.status === "fulfilled"
            ? (abacusStatusResult.value as {
                configured: boolean;
                maskedKey: string;
              })
            : { configured: false, maskedKey: "" };

        const composioWebhookSecretStatus =
          composioWebhookSecretResult?.status === "fulfilled"
            ? (composioWebhookSecretResult.value as {
                configured: boolean;
              } | null)
            : null;

        if (!cancelled) {
          setCreds({
            openaiKey: masked?.openaiKey ?? "",
            claudeKey: masked?.claudeKey ?? "",
            litellmUrl: masked?.litellmUrl ?? "",
            litellmKey: masked?.litellmKey ?? "",
            ollamaUrl: masked?.ollamaUrl ?? "",
            vapiKey: masked?.vapiKey ?? "",
            vapiAssistantId: masked?.vapiAssistantId ?? "",
            elevenLabsKey: elevenLabsKey ?? masked?.elevenLabsKey ?? "",
            vapiIsActive: !!vapiActive,
            searxngUrl: masked?.searxngUrl ?? "",
            perplexityApiKey: masked?.perplexityApiKey ?? "",
            // serpApiKey: prefer agencySettings, fall back to integrationCreds
            serpApiKey: agencySettings?.serpApiKey ?? masked?.serpApiKey ?? "",
            serpApiDevKey: masked?.serpApiDevKey ?? "",
            composioConfigured: composioStatus.configured,
            composioWebhookSecretConfigured:
              composioWebhookSecretStatus?.configured ?? false,
            abacusConfigured: abacusStatus.configured,
            openRouterApiKey: masked?.openRouterApiKey ?? "",
            nvidiaApiKey: masked?.nvidiaApiKey ?? "",
            geminiApiKey: masked?.geminiApiKey ?? "",
          });
          setBackendError(null);
          setIsLoading(false);
        }
        return;
      }
    }

    void run();

    return () => {
      cancelled = true;
      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [actor, isFetching, authStalled, refreshToken]);

  return (
    <CredentialsContext.Provider
      value={{ creds, isLoading, backendError, refresh }}
    >
      {children}
    </CredentialsContext.Provider>
  );
}

export function useCredentials() {
  return useContext(CredentialsContext);
}

/** Convenience — returns true when an ElevenLabs key is available from the backend */
export function useIsElevenLabsReady(): boolean {
  const { creds } = useCredentials();
  return !!creds?.elevenLabsKey?.trim();
}

export { TENANT_ID };
