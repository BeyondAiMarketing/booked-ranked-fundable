/**
 * Twilio SMS client wrapper — prepares requests for the backend.
 * The backend performs the actual HTTP outcall to Twilio's API.
 *
 * Feature flag: TWILIO_INTEGRATION_ENABLED (always false by default)
 */

import { areIntegrationsEnabled } from "../_shared/env";
import { IntegrationError } from "../_shared/types";
import type { TwilioIncomingSms, TwilioSendSmsInput } from "./schemas";

const PLATFORM = "twilio" as const;

/**
 * Parse an incoming SMS webhook payload from Twilio.
 * Twilio sends application/x-www-form-urlencoded data.
 */
export function parseIncomingSms(
  formData: Record<string, string>,
): TwilioIncomingSms {
  if (!formData.From || !formData.To) {
    throw new IntegrationError(
      "Invalid Twilio webhook: missing From or To",
      PLATFORM,
    );
  }

  return {
    MessageSid: formData.MessageSid,
    SmsSid: formData.SmsSid,
    SmsMessageSid: formData.SmsMessageSid,
    AccountSid: formData.AccountSid,
    MessagingServiceSid: formData.MessagingServiceSid,
    From: formData.From,
    To: formData.To,
    Body: formData.Body,
    NumMedia: formData.NumMedia,
    MessageStatus: formData.MessageStatus,
    NumSegments: formData.NumSegments,
    MediaUrl0: formData.MediaUrl0,
    MediaContentType0: formData.MediaContentType0,
    ...formData, // passthrough: allow unknown fields
  };
}

/**
 * Build an outbound SMS request payload for the backend.
 * The backend will POST to:
 * https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json
 */
export function buildSendSmsRequest(input: TwilioSendSmsInput): {
  action: "send_sms";
  payload: TwilioSendSmsInput;
} {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  if (!input.to || !input.body) {
    throw new IntegrationError("to and body are required", PLATFORM);
  }

  return {
    action: "send_sms",
    payload: input,
  };
}

/**
 * Extract the idempotency key from an incoming SMS.
 * Uses MessageSid or SmsMessageSid when available.
 */
export function getSmsIdempotencyKey(
  sms: TwilioIncomingSms,
): string | undefined {
  return sms.MessageSid ?? sms.SmsMessageSid ?? sms.SmsSid;
}
