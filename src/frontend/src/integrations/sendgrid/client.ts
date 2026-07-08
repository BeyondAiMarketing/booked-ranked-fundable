/**
 * SendGrid client wrapper — prepares mail send and event parsing for the backend.
 * The backend performs the actual HTTP outcall to SendGrid's API.
 *
 * Feature flag: SENDGRID_INTEGRATION_ENABLED (always false by default)
 */

import type { LiveSendResult } from "@/backend";
import type { ActorCompat } from "../../hooks/useActor";
import { areIntegrationsEnabled } from "../_shared/env";
import { IntegrationError } from "../_shared/types";
import type {
  SendGridEvent,
  SendGridMailRequest,
  SendGridWebhook,
} from "./schemas";

const PLATFORM = "sendgrid" as const;

/**
 * Build a mail send request payload for the backend.
 * The backend will POST to https://api.sendgrid.com/v3/mail/send
 */
export function buildMailSendRequest(input: SendGridMailRequest): {
  action: "send_mail";
  payload: SendGridMailRequest;
} {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  if (!input.personalizations || input.personalizations.length === 0) {
    throw new IntegrationError("personalizations are required", PLATFORM);
  }

  if (!input.from || !input.from.email) {
    throw new IntegrationError("from.email is required", PLATFORM);
  }

  return {
    action: "send_mail",
    payload: input,
  };
}

/**
 * Parse a SendGrid Event Webhook payload.
 * SendGrid sends an array of event objects.
 */
export function parseEventWebhook(body: unknown): SendGridWebhook {
  if (!Array.isArray(body)) {
    throw new IntegrationError(
      "Invalid SendGrid webhook: expected array",
      PLATFORM,
    );
  }

  return body as SendGridWebhook;
}

/**
 * Extract the idempotency key from a SendGrid event.
 * Uses sg_event_id when available.
 */
export function getEventIdempotencyKey(
  event: SendGridEvent,
): string | undefined {
  return event.sg_event_id;
}

/**
 * Build a template mail request with dynamic data.
 */
export function buildTemplateMailRequest(
  to: string,
  templateId: string,
  dynamicData: Record<string, unknown>,
  fromEmail: string,
  fromName?: string,
): SendGridMailRequest {
  return {
    personalizations: [
      {
        to: [{ email: to }],
        dynamic_template_data: dynamicData,
      },
    ],
    from: {
      email: fromEmail,
      name: fromName,
    },
    template_id: templateId,
  };
}

/**
 * Send a live email via the backend actor.
 * The backend performs the actual HTTP outcall to SendGrid's API using stored
 * credentials (never exposed to the frontend).
 */
export async function sendLiveEmail(
  actor: ActorCompat,
  tenantId: string,
  to: string,
  from: string,
  subject: string,
  body: string,
): Promise<LiveSendResult> {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }
  if (!to || !from || !subject || !body) {
    throw new IntegrationError(
      "to, from, subject, and body are required",
      PLATFORM,
    );
  }
  return actor.sendLiveEmail(tenantId, to, from, subject, body);
}
