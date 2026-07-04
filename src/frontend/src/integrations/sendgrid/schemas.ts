/**
 * SendGrid schemas — mail send and event webhook.
 *
 * Docs:
 * - https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send
 * - https://www.twilio.com/docs/sendgrid/for-developers/tracking-events/event
 * - https://www.twilio.com/docs/sendgrid/for-developers/tracking-events/getting-started-event-webhook-security-features
 */

export interface SendGridEmailAddress {
  email: string;
  name?: string;
}

export interface SendGridPersonalization {
  to: SendGridEmailAddress[];
  dynamic_template_data?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface SendGridMailRequest {
  personalizations: SendGridPersonalization[];
  from: SendGridEmailAddress;
  template_id?: string;
  subject?: string;
  content?: { type: string; value: string }[];
  [key: string]: unknown;
}

export interface SendGridEvent {
  email?: string;
  timestamp?: number;
  event: string;
  sg_event_id?: string;
  sg_message_id?: string;
  category?: string | string[];
  reason?: string;
  status?: string;
  type?: string;
  response?: string;
  sg_machine_open?: boolean;
  [key: string]: unknown;
}

export type SendGridWebhook = SendGridEvent[];
