import type {
  CallLog,
  CallStats,
  InboundVoiceAgentConfig,
  MissedCallSmsConfig,
} from "../types/telephony";

export const DEMO_CALL_LOGS: CallLog[] = [];

export const NICHE_SMS_TEMPLATES: Record<string, string> = {
  plumbing:
    "Hey! Sorry we missed your call at {businessName}. We'd love to help with your plumbing — reply here or call us back anytime.",
  medspa:
    "Hi! We missed your call at {businessName}. Ready to help you look and feel your best — reply to schedule your consult.",
  hvac: "Hey! Sorry we missed you at {businessName}. Whether it's cooling, heating, or a quick tune-up — we're here. Reply anytime.",
  restoration:
    "Hi! We missed your call at {businessName}. If you're dealing with water or fire damage, reply now — we're available 24/7.",
  carpet_cleaning:
    "Hey! Sorry we missed your call at {businessName}. We'd love to freshen up your floors — reply to grab a quick quote.",
  roofing:
    "Hi! We missed your call at {businessName}. Whether it's a repair or full replacement, we're here to help. Reply anytime.",
};

export const DEFAULT_MISSED_CALL_SMS_CONFIG: MissedCallSmsConfig = {
  enabled: true,
  messageTemplate:
    "Hey! Sorry we missed your call at {businessName}. We'd love to help — reply here or call us back anytime.",
  niches: NICHE_SMS_TEMPLATES,
  autoCreateLead: true,
  leadSource: "Missed Call",
};

export const DEFAULT_VOICE_AGENT_CONFIG: InboundVoiceAgentConfig = {
  enabled: true,
  vapiAssistantId: "",
  greetingScript:
    "Thank you for calling {businessName}, this is Aria. How can I help you today?",
  businessHoursOnly: false,
  businessHoursText: "Monday–Friday 8am–6pm, Saturday 9am–2pm",
  services: [
    "Emergency plumbing",
    "Drain cleaning",
    "Water heater installation & repair",
    "Leak detection & repair",
    "Fixture installation",
    "Annual maintenance",
    "Water filtration systems",
    "Sewer line inspection",
  ],
  qualifyingQuestions: [
    "What type of plumbing issue are you experiencing?",
    "Can I get your name and service address?",
    "Is this an emergency or can it be scheduled?",
    "What's the best phone number to reach you?",
    "Do you have a preferred date or time window?",
  ],
  bookingEnabled: true,
  bookingLink: "",
  postCallWebhookUrl: "",
  routingMode: "ai",
  forwardNumber: "",
  voicemailMessage:
    "You've reached {businessName}. We're currently with another customer. Please leave your name, number, and a brief description of your plumbing issue and we'll call you right back.",
};

export const DEMO_CALL_STATS: CallStats = {
  totalCalls: 0,
  answeredCalls: 0,
  missedCalls: 0,
  leadsCreated: 0,
  avgDurationSeconds: 0,
  answerRate: 0,
  leadConversionRate: 0,
};
