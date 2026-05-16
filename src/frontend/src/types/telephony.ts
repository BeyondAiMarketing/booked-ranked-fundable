export type CallOutcome =
  | "completed"
  | "missed"
  | "voicemail"
  | "no_answer"
  | "busy";

export type CallDirection = "inbound" | "outbound";

export interface CallTranscriptTurn {
  speaker: "agent" | "caller";
  text: string;
  timestamp?: string;
}

export interface CallLog {
  id: string;
  tenantId: string;
  callerPhone: string;
  callerName?: string;
  direction: CallDirection;
  outcome: CallOutcome;
  durationSeconds: number;
  startedAt: string;
  endedAt?: string;
  transcript: CallTranscriptTurn[];
  leadId?: string;
  leadCreated: boolean;
  vapiCallId?: string;
  twilioCallSid?: string;
  missedSmsSet: boolean;
}

export interface MissedCallSmsConfig {
  enabled: boolean;
  messageTemplate: string;
  niches: Record<string, string>;
  autoCreateLead: boolean;
  leadSource: string;
}

export interface InboundVoiceAgentConfig {
  enabled: boolean;
  vapiAssistantId: string;
  greetingScript: string;
  businessHoursOnly: boolean;
  businessHoursText: string;
  services: string[];
  qualifyingQuestions: string[];
  bookingEnabled: boolean;
  bookingLink: string;
  postCallWebhookUrl: string;
  routingMode: "ai" | "forward" | "voicemail";
  forwardNumber: string;
  voicemailMessage: string;
}

export interface CallStats {
  totalCalls: number;
  answeredCalls: number;
  missedCalls: number;
  leadsCreated: number;
  avgDurationSeconds: number;
  answerRate: number;
  leadConversionRate: number;
}

export interface VapiProvisioningStatus {
  status: "notConfigured" | "provisioning" | "active" | "error";
  assistantId?: string;
  lastSynced?: number;
  errorMessage?: string;
}
