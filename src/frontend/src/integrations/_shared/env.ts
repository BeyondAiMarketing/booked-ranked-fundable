/**
 * Environment variable documentation and feature flag checks.
 * All integrations are disabled by default. No secrets are read here.
 */

export const INTEGRATION_ENV = {
  // Master toggle
  INTEGRATIONS_ENABLED: false,

  // Per-provider toggles
  OPENAI_INTEGRATION_ENABLED: false,
  TWILIO_INTEGRATION_ENABLED: true,
  SENDGRID_INTEGRATION_ENABLED: true,
  LEAD_ENGINE_ENABLED: false,
  WEBHOOK_INBOX_ENABLED: false,
  STRIPE_INTEGRATION_ENABLED: false,
  GOOGLE_BUSINESS_PROFILE_INTEGRATION_ENABLED: false,
  SERPAPI_INTEGRATION_ENABLED: false,
  VAPI_INTEGRATION_ENABLED: false,

  // n8n
  N8N_WEBHOOK_BASE_URL: "",
  N8N_API_KEY: "",

  // OpenAI
  OPENAI_API_KEY: "",
  OPENAI_ORG_ID: "",
  OPENAI_PROJECT_ID: "",

  // Twilio
  TWILIO_ACCOUNT_SID: "",
  TWILIO_AUTH_TOKEN: "",
  TWILIO_API_KEY_SID: "",
  TWILIO_API_KEY_SECRET: "",
  TWILIO_FROM_NUMBER: "",
  TWILIO_MESSAGING_SERVICE_SID: "",

  // SendGrid
  SENDGRID_API_KEY: "",
  SENDGRID_FROM_EMAIL: "",
  SENDGRID_EVENT_WEBHOOK_PUBLIC_KEY: "",

  // Stripe
  STRIPE_SECRET_KEY: "",
  STRIPE_PUBLISHABLE_KEY: "",
  STRIPE_WEBHOOK_SECRET: "",

  // Google Business Profile
  GOOGLE_CLIENT_ID: "",
  GOOGLE_CLIENT_SECRET: "",
  GOOGLE_REDIRECT_URI: "",
  GOOGLE_BUSINESS_PROFILE_REFRESH_TOKEN: "",
  GOOGLE_PUBSUB_VERIFICATION_TOKEN: "",

  // SerpApi
  SERPAPI_API_KEY: "",

  // Vapi
  VAPI_PRIVATE_KEY: "",
  VAPI_PUBLIC_KEY: "",
  VAPI_DEFAULT_ASSISTANT_ID: "",
  VAPI_WEBHOOK_SECRET: "",
};

export type IntegrationEnvKey = keyof typeof INTEGRATION_ENV;

/**
 * Check if a specific integration is enabled.
 * All integrations default to disabled for safety.
 */
export function isIntegrationEnabled(flag: IntegrationEnvKey): boolean {
  return INTEGRATION_ENV[flag] === true;
}

/**
 * Check if the master integration switch is on.
 */
export function areIntegrationsEnabled(): boolean {
  return INTEGRATION_ENV.INTEGRATIONS_ENABLED === true;
}

/**
 * Get an env value (always returns empty string for safety;
 * real values come from backend secure storage, never frontend env).
 */
export function getIntegrationEnv(_key: IntegrationEnvKey): string {
  return "";
}
