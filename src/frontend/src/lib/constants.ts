// ── App-wide constants ─────────────────────────────────────────────────────────
// Single source of truth for domain and shared config.
// Use APP_DOMAIN everywhere instead of hardcoded URL strings.

export const APP_DOMAIN = "https://bookedrankedfunded.org";

export const BOOKING_ENDPOINT = `${APP_DOMAIN}/api/book-appointment`;
export const SETUP_URL = `${APP_DOMAIN}/setup`;

/** Generate a personalized demo URL for a prospect */
export function demoDomainUrl(businessSlug: string): string {
  return `${APP_DOMAIN}/demo/${encodeURIComponent(businessSlug)}`;
}

/** Generate a brand kit URL for a prospect */
export function brandKitUrl(slug: string): string {
  return `${APP_DOMAIN}/brand-kit/${encodeURIComponent(slug)}`;
}

/** Shared tenant ID — backend normalizes all saves to "platform" */
export const PLATFORM_TENANT_ID = "platform";
