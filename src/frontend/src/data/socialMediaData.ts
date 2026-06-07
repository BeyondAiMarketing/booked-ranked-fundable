import type {
  BrandVoiceProfile,
  SocialComment,
  SocialListeningAlert,
  SocialPost,
  SocialROIMetrics,
} from "../types/socialMedia";

// ─── Brand Voice Profiles ──────────────────────────────────────────────────────

export const DEMO_BRAND_VOICE_PROFILES: BrandVoiceProfile[] = [];

// ─── Social Posts ──────────────────────────────────────────────────────────────

const _now = Date.now();
const _day = 86400000;

export const DEMO_SOCIAL_POSTS: SocialPost[] = [];

// ─── Social Comments ───────────────────────────────────────────────────────────

export const DEMO_SOCIAL_COMMENTS: SocialComment[] = [];
export const DEMO_SOCIAL_LISTENING_ALERTS: SocialListeningAlert[] = [];
export const DEMO_SOCIAL_ROI_METRICS: SocialROIMetrics[] = [];
