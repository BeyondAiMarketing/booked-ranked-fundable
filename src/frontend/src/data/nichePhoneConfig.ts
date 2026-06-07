/**
 * Per-niche phone number configuration.
 * This is the single source of truth for all niche-specific inbound demo numbers.
 *
 * To add a number for a new niche, set its value to { e164, display }.
 * Niches without a number yet are set to null — the demo will show a
 * "Coming Soon" placeholder instead of a Call Now button.
 */

export interface NichePhoneConfig {
  /** E.164 format used for tel: links and Twilio, e.g. "+17603540802" */
  e164: string;
  /** Human-readable display number, e.g. "760-354-0802" */
  display: string;
}

/**
 * Map of niche name (matching NICHE_DEMO_CONTENT keys) to phone config.
 * Keys are lowercase for case-insensitive lookup via getNichePhone().
 */
const NICHE_PHONE_CONFIG: Record<string, NichePhoneConfig | null> = {
  roofing: { e164: "+17603540802", display: "760-354-0802" },
  plumbing: null,
  hvac: null,
  restoration: null,
  "carpet cleaning": null,
  "real estate": null,
  mortgage: null,
  chiropractor: null,
  dental: null,
  "med spa": null,
  general: null,
};

/**
 * Returns the phone config for a given niche, or null if not yet configured.
 * Lookup is case-insensitive.
 *
 * @example
 * getNichePhone("Roofing")  // → { e164: "+17603540802", display: "760-354-0802" }
 * getNichePhone("Plumbing") // → null
 */
export function getNichePhone(niche: string): NichePhoneConfig | null {
  return NICHE_PHONE_CONFIG[niche.toLowerCase()] ?? null;
}
