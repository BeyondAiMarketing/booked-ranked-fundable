/**
 * Twilio schemas — incoming SMS webhook and outbound SMS.
 *
 * Docs:
 * - https://www.twilio.com/docs/messaging/guides/webhook-request
 * - https://www.twilio.com/docs/messaging/api/message-resource
 * - https://www.twilio.com/docs/usage/security#validating-requests
 */

export interface TwilioIncomingSms {
  MessageSid?: string;
  SmsSid?: string;
  SmsMessageSid?: string;
  AccountSid?: string;
  MessagingServiceSid?: string;
  From: string;
  To: string;
  Body?: string;
  NumMedia?: string;
  MessageStatus?: string;
  NumSegments?: string;
  MediaUrl0?: string;
  MediaContentType0?: string;
  [key: string]: unknown;
}

export interface TwilioSendSmsInput {
  to: string;
  body: string;
  from?: string;
  messagingServiceSid?: string;
  statusCallback?: string;
}

export interface TwilioSendSmsResponse {
  sid: string;
  status: string;
  error_message?: string;
  [key: string]: unknown;
}
