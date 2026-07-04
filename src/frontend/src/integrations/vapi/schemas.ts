/**
 * Vapi schemas — Server URL events and assistant configuration.
 *
 * Docs:
 * - https://docs.vapi.ai/api-reference/assistants/create
 * - https://docs.vapi.ai/server-url
 * - https://docs.vapi.ai/server-url/events
 * - https://docs.vapi.ai/server-url/setting-server-urls
 * - https://docs.vapi.ai/outbound-campaigns/overview
 */

export interface VapiCallInfo {
  id?: string;
  status?: string;
  [key: string]: unknown;
}

export interface VapiToolCall {
  id: string;
  name: string;
  parameters: Record<string, unknown>;
  [key: string]: unknown;
}

export interface VapiServerEvent {
  message: {
    type: string;
    call?: VapiCallInfo;
    timestamp?: string;
    role?: string;
    transcriptType?: string;
    transcript?: string;
    toolCallList?: VapiToolCall[];
    endedReason?: string;
    artifact?: {
      recordingUrl?: string;
      transcript?: string;
      messages?: unknown[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface VapiAssistantRequest {
  assistantId?: string;
  assistant?: {
    firstMessage?: string;
    model?: {
      provider?: string;
      model?: string;
      messages?: { role: string; content: string }[];
      [key: string]: unknown;
    };
    voice?: {
      provider?: string;
      voiceId?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

export interface VapiToolCallResult {
  name: string;
  toolCallId: string;
  result: string;
}

export interface VapiToolCallsResponse {
  results: VapiToolCallResult[];
}
