// ============================================================
// demoContentByNiche.ts
// Centralized niche-specific demo content for ALL 10 niches.
// Every field is strictly niche-accurate — zero crossover.
// ============================================================

export interface VoiceScriptLine {
  speaker: string;
  text: string;
}

export interface SocialPost {
  content: string;
  likes: number;
  comments: number;
  platform: string;
  hashtags: string[];
}

export interface AppointmentSlot {
  name: string;
  duration: string;
  leadName: string;
  service: string;
  time: string;
}

export interface CrmLead {
  name: string;
  service: string;
  status: string;
  value: string;
  phone: string;
}

export interface ReviewItem {
  author: string;
  rating: number;
  text: string;
  platform: string;
}

export interface CreditContext {
  businessType: string;
  avgRevenue: string;
  fundabilityScore: number;
  vendorRecommendations: string[];
}

export interface CoachTips {
  beforeAfter: string;
  voice: string;
  social: string;
  calendar: string;
  oneApp: string;
  backOffice: string;
  credit: string;
}

export interface RevenueStats {
  monthlyRevenue: number;
  avgJobValue: number;
  leadsPerMonth: number;
  description: string;
}

export interface NicheDemoContent {
  voiceScript: VoiceScriptLine[];
  socialPosts: SocialPost[];
  appointmentTypes: AppointmentSlot[];
  beforePainPoints: string[];
  afterPromises: string[];
  crmLeads: CrmLead[];
  reviews: ReviewItem[];
  creditContext: CreditContext;
  coachTips: CoachTips;
  revenueStats: RevenueStats;
}

// ============================================================
// NICHE CONTENT MAP
// ============================================================

export const NICHE_DEMO_CONTENT: Record<string, NicheDemoContent> = {
  // ----------------------------------------------------------
  // PLUMBING
  // ----------------------------------------------------------
  Plumbing: {
    voiceScript: [
      {
        speaker: "Caller",
        text: "Hi, I have a major leak under my kitchen sink. Water is everywhere — I need someone out today!",
      },
      {
        speaker: "AI Receptionist",
        text: "I completely understand, that sounds urgent. I can get a licensed plumber to you within 2 hours. Can I get your name and address to book this right now?",
      },
      { speaker: "Caller", text: "Yes, it's Mike Torres, 4812 Elmwood Drive." },
      {
        speaker: "AI Receptionist",
        text: "Perfect, Mike. I've got you booked for an emergency leak repair at 4812 Elmwood Drive between 1 and 3 PM today. You'll get a text confirmation in just a moment. Is there anything else going on — any other fixtures acting up?",
      },
      { speaker: "Caller", text: "No, that's it. Thank you so much!" },
      {
        speaker: "AI Receptionist",
        text: "Of course! Our tech will call 30 minutes before arrival. See you soon!",
      },
    ],
    socialPosts: [
      {
        content:
          "🚿 Slow drains driving you crazy? Our hydro-jet drain cleaning blasts through years of buildup in under an hour. No chemicals. No mess. Just flow. Book online today!",
        likes: 94,
        comments: 18,
        platform: "Facebook",
        hashtags: [
          "#PlumbingTips",
          "#DrainCleaning",
          "#LocalPlumber",
          "#HydroJet",
        ],
      },
      {
        content:
          "💧 Your water heater is working overtime this winter. Annual flush + inspection = longer life, lower bills. We're booking this week — spots are limited!",
        likes: 67,
        comments: 11,
        platform: "Instagram",
        hashtags: [
          "#WaterHeater",
          "#PlumbingMaintenance",
          "#HomeOwnerTips",
          "#Plumbing",
        ],
      },
      {
        content:
          "🔧 Burst pipe at 2am? We answer every call 24/7. Emergency plumbing with no after-hours upcharge. Your home deserves better than voicemail.",
        likes: 143,
        comments: 29,
        platform: "Facebook",
        hashtags: [
          "#EmergencyPlumbing",
          "#BurstPipe",
          "#24HourPlumber",
          "#PlumbingHelp",
        ],
      },
    ],
    appointmentTypes: [
      {
        name: "Emergency Leak Repair",
        duration: "1–2 hrs",
        leadName: "Mike Torres",
        service: "Kitchen Pipe Leak",
        time: "1:00 PM",
      },
      {
        name: "Water Heater Install",
        duration: "3–4 hrs",
        leadName: "Sandra Reyes",
        service: "40-Gal Tank Replacement",
        time: "9:00 AM",
      },
      {
        name: "Drain Cleaning",
        duration: "45 min",
        leadName: "Derek Walsh",
        service: "Main Line Hydro-Jet",
        time: "11:30 AM",
      },
      {
        name: "Pipe Inspection",
        duration: "1 hr",
        leadName: "Carla Nguyen",
        service: "Camera Inspection",
        time: "3:00 PM",
      },
    ],
    beforePainPoints: [
      "Calls going to voicemail after hours — leads book competitors",
      "No-shows from leads who never confirmed",
      "Dispatching manually by text — jobs fall through the cracks",
      "No review system — happy customers forget to post",
    ],
    afterPromises: [
      "AI answers every call 24/7 and books jobs on the spot",
      "Auto-confirm texts reduce no-shows by 40%",
      "Smart dispatch assigns closest available tech automatically",
      "Automated review requests sent after every completed job",
    ],
    crmLeads: [
      {
        name: "Mike Torres",
        service: "Emergency Leak Repair",
        status: "Booked",
        value: "$385",
        phone: "(555) 214-8823",
      },
      {
        name: "Sandra Reyes",
        service: "Water Heater Install",
        status: "Estimate Sent",
        value: "$1,240",
        phone: "(555) 307-9941",
      },
      {
        name: "Derek Walsh",
        service: "Main Line Hydro-Jet",
        status: "Completed",
        value: "$475",
        phone: "(555) 489-1107",
      },
      {
        name: "Carla Nguyen",
        service: "Camera Inspection",
        status: "Follow-Up",
        value: "$195",
        phone: "(555) 621-5530",
      },
      {
        name: "Paul Jennings",
        service: "Toilet Replacement",
        status: "New Lead",
        value: "$580",
        phone: "(555) 733-2298",
      },
    ],
    reviews: [
      {
        author: "Mike T.",
        rating: 5,
        text: "Called at midnight with a burst pipe. They answered immediately and had a tech at my house by 1am. Saved my floors. Incredible service!",
        platform: "Google",
      },
      {
        author: "Lisa C.",
        rating: 5,
        text: "Water heater died on a Sunday. They came out same day, installed a new one, and even cleaned up after. Highly recommend!",
        platform: "Yelp",
      },
      {
        author: "James R.",
        rating: 5,
        text: "Best plumbers in town. Fixed my slow drains in under an hour and the price was totally fair. Will use again for sure.",
        platform: "Google",
      },
    ],
    creditContext: {
      businessType: "Plumbing Contractor",
      avgRevenue: "$32,000/mo",
      fundabilityScore: 42,
      vendorRecommendations: [
        "Grainger Trade Credit",
        "Ferguson Waterworks Net-30",
        "Uline Business Account",
        "Home Depot Pro Xtra Credit",
      ],
    },
    coachTips: {
      beforeAfter:
        "This is the gap between where you are and where BRF takes you — every missed call = lost revenue.",
      voice:
        "Your AI receptionist answers every plumbing call 24/7 — no voicemail, no missed jobs, no competitor bookings.",
      social:
        "These posts go out automatically — drain cleaning tips, emergency alerts, water heater reminders — all scheduled and published for you.",
      calendar:
        "Every booked job lands here automatically. Techs get notified, routes get optimized, reminders go out — zero manual scheduling.",
      oneApp:
        "Replace your scheduling app, your review tool, your CRM, and your answering service — one platform handles it all.",
      backOffice:
        "This is where your plumbing leads land — estimates, bookings, and follow-ups are all managed right here automatically.",
      credit:
        "Fundability turns your plumbing business into a credit-worthy entity — vendor lines, business credit cards, and equipment financing all become accessible.",
    },
    revenueStats: {
      monthlyRevenue: 32000,
      avgJobValue: 650,
      leadsPerMonth: 48,
      description: "Average plumbing business in this market",
    },
  },

  // ----------------------------------------------------------
  // HVAC
  // ----------------------------------------------------------
  HVAC: {
    voiceScript: [
      {
        speaker: "Caller",
        text: "Hey, my AC stopped working this morning and it's already 95 degrees in here. I have elderly parents at home — I need help today.",
      },
      {
        speaker: "AI Receptionist",
        text: "Absolutely, that's a priority situation. We have emergency AC service available today. Let me get you booked right now — can I get your name and address?",
      },
      { speaker: "Caller", text: "David Kim, 7200 Sunridge Blvd." },
      {
        speaker: "AI Receptionist",
        text: "Got it, David. I've scheduled an emergency AC diagnostic at 7200 Sunridge Blvd for this afternoon between 2 and 4 PM. You'll receive a text with tech info shortly. Stay cool — we're on our way.",
      },
      { speaker: "Caller", text: "Thank you! That's a huge relief." },
      {
        speaker: "AI Receptionist",
        text: "Absolutely. We'll make sure your family is comfortable. See you soon!",
      },
    ],
    socialPosts: [
      {
        content:
          "☀️ Summer is here and your AC is working harder than ever. Schedule your seasonal tune-up now before the heat wave hits — and avoid a $3,000 emergency breakdown!",
        likes: 118,
        comments: 24,
        platform: "Facebook",
        hashtags: [
          "#HVACTuneUp",
          "#ACSeason",
          "#SummerComfort",
          "#HVACService",
        ],
      },
      {
        content:
          "🔄 Did you know a dirty air filter can spike your energy bill by 15%? We're running a free filter check with any service call this month. Book today!",
        likes: 82,
        comments: 17,
        platform: "Instagram",
        hashtags: [
          "#AirFilter",
          "#HVACTips",
          "#EnergyEfficiency",
          "#IndoorAirQuality",
        ],
      },
      {
        content:
          "❄️ AC down? We're dispatching emergency crews 24/7 — same-day response guaranteed. Don't sweat it. Call or book online and we'll be there fast.",
        likes: 201,
        comments: 43,
        platform: "Facebook",
        hashtags: ["#EmergencyAC", "#ACRepair", "#24HourHVAC", "#ACService"],
      },
    ],
    appointmentTypes: [
      {
        name: "Emergency AC Repair",
        duration: "2–3 hrs",
        leadName: "David Kim",
        service: "Compressor Diagnostic",
        time: "2:00 PM",
      },
      {
        name: "HVAC Seasonal Tune-Up",
        duration: "1.5 hrs",
        leadName: "Patricia Moore",
        service: "AC + Furnace Inspection",
        time: "10:00 AM",
      },
      {
        name: "Furnace Installation",
        duration: "4–6 hrs",
        leadName: "Robert Castillo",
        service: "96% AFUE Gas Furnace",
        time: "8:00 AM",
      },
      {
        name: "Duct Cleaning",
        duration: "2–3 hrs",
        leadName: "Amy Thornton",
        service: "Whole-Home Duct Cleaning",
        time: "1:00 PM",
      },
    ],
    beforePainPoints: [
      "Peak-season calls overwhelm staff — leads go unanswered",
      "Manual scheduling creates double-bookings and missed slots",
      "No seasonal marketing — customers forget to book before the rush",
      "Reviews go unmanaged — one bad review tanks trust",
    ],
    afterPromises: [
      "AI handles all inbound calls — even during heat waves when volume spikes 3x",
      "Smart booking prevents double-booking and optimizes tech routes",
      "Automated seasonal campaign emails and texts go out every spring and fall",
      "Review requests sent after every tune-up and repair automatically",
    ],
    crmLeads: [
      {
        name: "David Kim",
        service: "Emergency AC Repair",
        status: "Booked",
        value: "$840",
        phone: "(555) 318-4421",
      },
      {
        name: "Patricia Moore",
        service: "HVAC Tune-Up",
        status: "Completed",
        value: "$189",
        phone: "(555) 402-7723",
      },
      {
        name: "Robert Castillo",
        service: "Furnace Install",
        status: "Estimate Sent",
        value: "$4,200",
        phone: "(555) 594-0018",
      },
      {
        name: "Amy Thornton",
        service: "Duct Cleaning",
        status: "New Lead",
        value: "$650",
        phone: "(555) 671-3309",
      },
      {
        name: "Charles Webb",
        service: "Mini-Split Install",
        status: "Follow-Up",
        value: "$3,800",
        phone: "(555) 748-5512",
      },
    ],
    reviews: [
      {
        author: "David K.",
        rating: 5,
        text: "AC went out in the middle of a brutal heat wave. They came out same day and had us running within two hours. Professional, fast, and fair priced.",
        platform: "Google",
      },
      {
        author: "Margaret S.",
        rating: 5,
        text: "Our HVAC tune-up was thorough and the tech explained everything. Signed up for their maintenance plan right on the spot!",
        platform: "Yelp",
      },
      {
        author: "Tom B.",
        rating: 5,
        text: "New furnace install was flawless. Crew was clean, on time, and the price matched the quote exactly. Very happy.",
        platform: "Google",
      },
    ],
    creditContext: {
      businessType: "HVAC Contractor",
      avgRevenue: "$55,000/mo",
      fundabilityScore: 51,
      vendorRecommendations: [
        "Carrier Credit Line",
        "Lennox Parts Net-30",
        "Grainger Trade Credit",
        "Johnstone Supply Account",
      ],
    },
    coachTips: {
      beforeAfter:
        "Peak season is where HVAC businesses win or lose. This gap shows how many jobs you're leaving on the table right now.",
      voice:
        "Your AI receptionist handles every inbound AC emergency call — even when your team is fully dispatched in a heat wave.",
      social:
        "Seasonal tune-up campaigns go out automatically every spring and fall — no ad budget needed, just consistent bookings.",
      calendar:
        "Tech schedules update in real time. As soon as a call is booked, it lands on the right tech's calendar with route optimization.",
      oneApp:
        "CRM, scheduling, marketing, reviews, and the AI front desk — all in one dashboard instead of six disconnected tools.",
      backOffice:
        "This is where your HVAC jobs are managed — estimates, installs, follow-ups, and maintenance renewals all in one place.",
      credit:
        "Equipment financing and fleet vehicle loans are easier when your business credit is strong. The Fundability Builder gets you there.",
    },
    revenueStats: {
      monthlyRevenue: 55000,
      avgJobValue: 2800,
      leadsPerMonth: 35,
      description: "Average HVAC contractor in this market",
    },
  },

  // ----------------------------------------------------------
  // ROOFING
  // ----------------------------------------------------------
  Roofing: {
    voiceScript: [
      {
        speaker: "Caller",
        text: "Hi, we just had a bad storm last night and I can see some missing shingles from the driveway. Can someone come out for an inspection?",
      },
      {
        speaker: "AI Receptionist",
        text: "Absolutely — storm damage assessments are our specialty. We do free roof inspections and can help with your insurance claim process too. Let me book you right now. What's your name and address?",
      },
      { speaker: "Caller", text: "Jennifer Lopez, 3311 Oakwood Lane." },
      {
        speaker: "AI Receptionist",
        text: "Perfect, Jennifer. I've got you scheduled for a free storm damage inspection at 3311 Oakwood Lane tomorrow morning at 9 AM. Our inspector will photograph everything and provide a full report for your insurer. Does that work for you?",
      },
      {
        speaker: "Caller",
        text: "Yes, that's great! Do I need to do anything to prepare?",
      },
      {
        speaker: "AI Receptionist",
        text: "Not at all — just be home and we'll handle the rest. You'll get a reminder text tonight. See you tomorrow!",
      },
    ],
    socialPosts: [
      {
        content:
          "⛈️ Did last night's storm hit your roof? Don't wait for the next rain. Our FREE storm damage inspection includes a full photo report and insurance guidance. Book yours today — limited slots this week!",
        likes: 187,
        comments: 52,
        platform: "Facebook",
        hashtags: [
          "#StormDamage",
          "#FreeRoofInspection",
          "#InsuranceClaim",
          "#RoofRepair",
        ],
      },
      {
        content:
          "🏠 Your roof is the #1 thing protecting your family. Don't guess its condition — our certified inspectors give you the real picture in writing, with photos. Zero pressure, zero cost.",
        likes: 134,
        comments: 31,
        platform: "Instagram",
        hashtags: [
          "#RoofInspection",
          "#HomeProtection",
          "#CertifiedRoofer",
          "#RoofingLife",
        ],
      },
      {
        content:
          "✅ Just completed a full roof replacement for a hail-damaged home — zero out of pocket for the homeowner. We worked directly with their insurance company. Ask us how.",
        likes: 223,
        comments: 67,
        platform: "Facebook",
        hashtags: [
          "#InsuranceRoof",
          "#HailDamage",
          "#RoofReplacement",
          "#RoofingContractor",
        ],
      },
    ],
    appointmentTypes: [
      {
        name: "Free Storm Damage Inspection",
        duration: "1 hr",
        leadName: "Jennifer Lopez",
        service: "Post-Storm Photo Assessment",
        time: "9:00 AM",
      },
      {
        name: "Full Roof Replacement",
        duration: "1 day",
        leadName: "Brian Foster",
        service: "Asphalt Shingle Tear-Off & Replace",
        time: "7:00 AM",
      },
      {
        name: "Insurance Claim Assessment",
        duration: "1.5 hrs",
        leadName: "Donna Simmons",
        service: "Hail Damage Documentation",
        time: "11:00 AM",
      },
      {
        name: "Roof Repair",
        duration: "2–3 hrs",
        leadName: "George Patel",
        service: "Flashing & Leak Repair",
        time: "2:00 PM",
      },
    ],
    beforePainPoints: [
      "After major storms, call volume spikes and leads can't get through",
      "Insurance paperwork handled manually — mistakes cost jobs",
      "No follow-up system — inspections don't convert to contracts",
      "Online reputation thin — no process to collect reviews post-job",
    ],
    afterPromises: [
      "AI handles storm surge calls — every lead captured and booked instantly",
      "Insurance claim documentation automated from inspection photos",
      "Automated follow-up sequence converts free inspections to signed contracts",
      "Post-job review requests send automatically — 5-stars fill in fast",
    ],
    crmLeads: [
      {
        name: "Jennifer Lopez",
        service: "Storm Inspection",
        status: "Booked",
        value: "$14,500",
        phone: "(555) 227-6634",
      },
      {
        name: "Brian Foster",
        service: "Full Roof Replacement",
        status: "Contract Signed",
        value: "$18,200",
        phone: "(555) 381-9920",
      },
      {
        name: "Donna Simmons",
        service: "Hail Damage Assessment",
        status: "Insurance Filed",
        value: "$11,800",
        phone: "(555) 443-7715",
      },
      {
        name: "George Patel",
        service: "Flashing Repair",
        status: "Completed",
        value: "$950",
        phone: "(555) 519-0038",
      },
      {
        name: "Karen Mills",
        service: "New Construction Roof",
        status: "Estimate Sent",
        value: "$22,000",
        phone: "(555) 662-4481",
      },
    ],
    reviews: [
      {
        author: "Jennifer L.",
        rating: 5,
        text: "After the hail storm, I was lost with the insurance process. This team handled everything — photos, claim filing, the whole thing. New roof paid almost entirely by insurance!",
        platform: "Google",
      },
      {
        author: "Brian F.",
        rating: 5,
        text: "Full replacement completed in one day. Crew was professional, cleaned everything up, and the quality is outstanding. Couldn't be happier.",
        platform: "Yelp",
      },
      {
        author: "Donna S.",
        rating: 5,
        text: "Fast response after the storm. They documented the damage thoroughly and helped us get our claim approved quickly. Great experience all around.",
        platform: "Google",
      },
    ],
    creditContext: {
      businessType: "Roofing Contractor",
      avgRevenue: "$85,000/mo",
      fundabilityScore: 58,
      vendorRecommendations: [
        "ABC Supply Net-30",
        "Beacon Roofing Credit Line",
        "Lowes Pro Business Account",
        "Uline Supply Account",
      ],
    },
    coachTips: {
      beforeAfter:
        "Storm season makes or breaks roofing businesses. Every unanswered call after a storm is a $12k+ job going to a competitor.",
      voice:
        "Your AI receptionist captures every storm call — even when you're on a roof or your office is slammed with volume spikes.",
      social:
        "Post-storm social posts go out within hours — free inspection offers that capture leads before competitors even respond.",
      calendar:
        "Inspection slots fill automatically after each storm event. Your team shows up prepared — photos, insurance forms, everything pre-loaded.",
      oneApp:
        "Replace your estimating tool, scheduling app, insurance tracker, and CRM — one dashboard manages your entire roofing operation.",
      backOffice:
        "This is where your storm leads land — inspections are booked here automatically and progress through the insurance claim pipeline.",
      credit:
        "Large roofing projects require material deposits. Business credit lines and trade accounts keep your cash flow healthy between insurance payouts.",
    },
    revenueStats: {
      monthlyRevenue: 85000,
      avgJobValue: 12000,
      leadsPerMonth: 22,
      description: "Average roofing contractor in this market",
    },
  },

  // ----------------------------------------------------------
  // RESTORATION
  // ----------------------------------------------------------
  Restoration: {
    voiceScript: [
      {
        speaker: "Caller",
        text: "I woke up at 2am and my basement is completely flooded. Water is still rising. I don't know what to do!",
      },
      {
        speaker: "AI Receptionist",
        text: "Stay calm — you called the right place. We have emergency crews on standby 24/7. I'm dispatching a team to you right now. What's your address?",
      },
      { speaker: "Caller", text: "1422 Birchwood Drive. Please hurry!" },
      {
        speaker: "AI Receptionist",
        text: "Our crew is already on their way to 1422 Birchwood Drive — ETA is about 35 minutes. Turn off your main water supply if you can do it safely. I'm staying on the line — don't worry, we've got you covered.",
      },
      { speaker: "Caller", text: "Thank God. Thank you so much." },
      {
        speaker: "AI Receptionist",
        text: "Absolutely. We handle the insurance documentation too, so don't throw anything away. Our team will walk you through everything when they arrive.",
      },
    ],
    socialPosts: [
      {
        content:
          "💧 Water doesn't wait for business hours. Neither do we. Our emergency water extraction crews respond 24/7 — often on-site within the hour. One call and we handle everything including your insurance claim.",
        likes: 209,
        comments: 58,
        platform: "Facebook",
        hashtags: [
          "#WaterDamage",
          "#EmergencyRestoration",
          "#FloodCleanup",
          "#24HourService",
        ],
      },
      {
        content:
          "🦠 Mold found in your home? Don't wait. Our certified mold remediation team safely removes contamination and prevents regrowth — with a written clearance report. Free inspection this week!",
        likes: 156,
        comments: 37,
        platform: "Instagram",
        hashtags: [
          "#MoldRemediation",
          "#MoldRemoval",
          "#IndoorAirQuality",
          "#HomeRestoration",
        ],
      },
      {
        content:
          "🔥 Fire damage is more than smoke and char — it's hidden soot, structural damage, and toxic residue. Our fire restoration team handles the full scope from emergency board-up to rebuild. We work directly with your insurance.",
        likes: 174,
        comments: 46,
        platform: "Facebook",
        hashtags: [
          "#FireDamage",
          "#FireRestoration",
          "#SmokeRemoval",
          "#RestorePro",
        ],
      },
    ],
    appointmentTypes: [
      {
        name: "Emergency Water Extraction",
        duration: "4–8 hrs",
        leadName: "Mark Henderson",
        service: "Basement Flood Remediation",
        time: "2:45 AM",
      },
      {
        name: "Mold Inspection & Testing",
        duration: "2 hrs",
        leadName: "Lisa Park",
        service: "Air Quality + Surface Testing",
        time: "10:00 AM",
      },
      {
        name: "Fire Damage Assessment",
        duration: "2 hrs",
        leadName: "Raymond Cole",
        service: "Structural + Smoke Assessment",
        time: "9:00 AM",
      },
      {
        name: "Full Water Damage Restore",
        duration: "5–10 days",
        leadName: "Paula Grant",
        service: "Drying, Drywall, Rebuild",
        time: "8:00 AM",
      },
    ],
    beforePainPoints: [
      "Middle-of-the-night emergencies go unanswered — customers call another company",
      "Insurance documentation done manually — errors delay claims",
      "No automated follow-up — mitigation jobs don't convert to full rebuilds",
      "Crew dispatch is manual — slow response costs the job",
    ],
    afterPromises: [
      "AI answers emergency calls 24/7 and dispatches crews instantly — zero delay",
      "Insurance claim packets generated automatically from job photos and notes",
      "Automated follow-up converts mitigation customers to full reconstruction",
      "Smart dispatch gets the nearest crew moving before you even wake up",
    ],
    crmLeads: [
      {
        name: "Mark Henderson",
        service: "Emergency Water Extract",
        status: "In Progress",
        value: "$22,500",
        phone: "(555) 291-4430",
      },
      {
        name: "Lisa Park",
        service: "Mold Remediation",
        status: "Estimate Sent",
        value: "$8,400",
        phone: "(555) 374-6619",
      },
      {
        name: "Raymond Cole",
        service: "Fire Damage Restore",
        status: "Insurance Filed",
        value: "$31,000",
        phone: "(555) 456-2287",
      },
      {
        name: "Paula Grant",
        service: "Full Water Restore",
        status: "Contract Signed",
        value: "$27,800",
        phone: "(555) 538-9943",
      },
      {
        name: "Tony Russo",
        service: "Storm Damage Cleanup",
        status: "New Lead",
        value: "$14,200",
        phone: "(555) 621-7765",
      },
    ],
    reviews: [
      {
        author: "Mark H.",
        rating: 5,
        text: "2am, basement flooding, complete panic. They answered immediately and had a crew at my house in 40 minutes. Saved my home. Cannot thank them enough.",
        platform: "Google",
      },
      {
        author: "Lisa P.",
        rating: 5,
        text: "Found mold in our crawl space. They tested, gave us a detailed report, and handled the remediation professionally. Air quality is perfect now.",
        platform: "Yelp",
      },
      {
        author: "Raymond C.",
        rating: 5,
        text: "After the fire, they worked directly with our insurance adjuster and rebuilt everything. Stress-free process in the most stressful time of our lives.",
        platform: "Google",
      },
    ],
    creditContext: {
      businessType: "Restoration Contractor",
      avgRevenue: "$95,000/mo",
      fundabilityScore: 62,
      vendorRecommendations: [
        "ServiceMaster Supplier Net-30",
        "Belfor Vendor Account",
        "Home Depot Pro Credit",
        "Uline Industrial Account",
      ],
    },
    coachTips: {
      beforeAfter:
        "Emergency calls are the highest-value leads in restoration. Missing one 2am call can mean missing a $25k job.",
      voice:
        "Your AI receptionist dispatches emergency crews around the clock — the moment a homeowner calls, the response clock starts.",
      social:
        "Educational posts about water, mold, and fire damage build trust before the disaster happens — so they call you first.",
      calendar:
        "Emergency dispatch is tracked here in real time. Every job's status, crew assignment, and insurance timeline visible at a glance.",
      oneApp:
        "Replace your dispatch software, insurance tracker, CRM, and marketing tools — one platform runs your entire restoration operation.",
      backOffice:
        "Every emergency job, insurance file, and rebuild project is tracked here — nothing falls through the cracks in the chaos of a disaster.",
      credit:
        "Large restoration projects often require bridging cash before insurance pays out. Business credit lines smooth out those gaps.",
    },
    revenueStats: {
      monthlyRevenue: 95000,
      avgJobValue: 18000,
      leadsPerMonth: 18,
      description: "Average restoration contractor in this market",
    },
  },

  // ----------------------------------------------------------
  // MED SPA
  // ----------------------------------------------------------
  "Med Spa": {
    voiceScript: [
      {
        speaker: "Caller",
        text: "Hi, I'm interested in Botox. I've never done it before and I'm a little nervous. Can I talk to someone about what to expect?",
      },
      {
        speaker: "AI Receptionist",
        text: "Of course! First-time consultations are absolutely complimentary. Our aesthetic nurse will walk you through everything — the process, what areas we'd recommend, and realistic results. Would you like to book a consultation this week?",
      },
      { speaker: "Caller", text: "Yes, I think so. What days are available?" },
      {
        speaker: "AI Receptionist",
        text: "We have openings Tuesday at 11am and Thursday at 2pm. Both are with our senior aesthetic nurse. Which works better for you?",
      },
      { speaker: "Caller", text: "Thursday at 2 sounds perfect." },
      {
        speaker: "AI Receptionist",
        text: "Wonderful! You're all set for a complimentary Botox consultation Thursday at 2 PM. You'll get a reminder text the day before. We're so excited to meet you!",
      },
    ],
    socialPosts: [
      {
        content:
          "✨ Summer Glow Special: HydraFacial + Vitamin C Infusion — $199 (reg. $275) this month only. Your skin will thank you. Book online or call us!",
        likes: 312,
        comments: 74,
        platform: "Instagram",
        hashtags: [
          "#HydraFacial",
          "#SummerGlow",
          "#MedSpaSpecial",
          "#SkincareTreatment",
        ],
      },
      {
        content:
          "💉 First time considering Botox? We get it — it can feel scary. That's why we offer free consultations with zero pressure. Come in, ask questions, and decide when YOU'RE ready. Link in bio!",
        likes: 289,
        comments: 91,
        platform: "Facebook",
        hashtags: [
          "#BotoxConsult",
          "#AestheticNurse",
          "#NaturalResults",
          "#MedSpa",
        ],
      },
      {
        content:
          "🌸 Laser Hair Removal Package — 6 sessions for the price of 4, this month only. Say goodbye to razors and hello to silky smooth skin year-round. Limited spots available!",
        likes: 198,
        comments: 55,
        platform: "Instagram",
        hashtags: ["#LaserHairRemoval", "#LHR", "#SilkySmooth", "#MedSpaDeals"],
      },
    ],
    appointmentTypes: [
      {
        name: "Botox Consultation",
        duration: "45 min",
        leadName: "Ashley Turner",
        service: "Complimentary New Patient Consult",
        time: "2:00 PM",
      },
      {
        name: "HydraFacial Treatment",
        duration: "60 min",
        leadName: "Nicole Rivera",
        service: "Signature HydraFacial + Infusion",
        time: "11:00 AM",
      },
      {
        name: "Laser Hair Removal",
        duration: "30–45 min",
        leadName: "Brianna Hughes",
        service: "Underarm + Bikini Session 1",
        time: "3:30 PM",
      },
      {
        name: "Chemical Peel",
        duration: "45 min",
        leadName: "Samantha Price",
        service: "Medium Depth VI Peel",
        time: "10:00 AM",
      },
    ],
    beforePainPoints: [
      "Consultations not being booked from Instagram DMs and website inquiries",
      "No follow-up after first consult — patients go to competing spas",
      "Seasonal promotions not communicated — revenue dips in off months",
      "No automated review requests — great results go unshared",
    ],
    afterPromises: [
      "AI books consultations from every channel — phone, DM, website chat, all at once",
      "Automated follow-up sequence nurtures every consult into a booked treatment",
      "Monthly promo campaigns run on autopilot — HydraFacials, Botox specials, seasonal packages",
      "Post-treatment review requests fire automatically — testimonials build social proof constantly",
    ],
    crmLeads: [
      {
        name: "Ashley Turner",
        service: "Botox Consult",
        status: "Booked",
        value: "$650",
        phone: "(555) 231-8847",
      },
      {
        name: "Nicole Rivera",
        service: "HydraFacial Series (3)",
        status: "Package Purchased",
        value: "$975",
        phone: "(555) 344-5521",
      },
      {
        name: "Brianna Hughes",
        service: "LHR 6-Pack",
        status: "Estimate Sent",
        value: "$1,200",
        phone: "(555) 427-3309",
      },
      {
        name: "Samantha Price",
        service: "Chemical Peel + Botox",
        status: "Completed",
        value: "$820",
        phone: "(555) 519-7734",
      },
      {
        name: "Gabrielle Ford",
        service: "Filler Consultation",
        status: "New Lead",
        value: "$890",
        phone: "(555) 638-2298",
      },
    ],
    reviews: [
      {
        author: "Ashley T.",
        rating: 5,
        text: "I was so nervous for my first Botox — the nurse made me completely at ease. Natural results, zero bruising, and I look refreshed not frozen. Absolutely love it!",
        platform: "Google",
      },
      {
        author: "Nicole R.",
        rating: 5,
        text: "HydraFacial is the best thing I've ever done for my skin. The glow lasts for weeks. The staff is warm, professional, and the spa is gorgeous.",
        platform: "Yelp",
      },
      {
        author: "Samantha P.",
        rating: 5,
        text: "VI Peel completely transformed my texture and dark spots. I've tried other spas but this is the one I trust with my face. Won't go anywhere else.",
        platform: "Google",
      },
    ],
    creditContext: {
      businessType: "Medical Spa / Aesthetic Practice",
      avgRevenue: "$28,000/mo",
      fundabilityScore: 47,
      vendorRecommendations: [
        "CareCredit Partner Program",
        "Allergan Credit Account",
        "Galderma Partner Net-30",
        "Merz Aesthetics Credit Line",
      ],
    },
    coachTips: {
      beforeAfter:
        "Aesthetic clients shop around. This gap shows how many consult requests aren't being captured or followed up — those clients are booking somewhere else.",
      voice:
        "Your AI receptionist books free consultations from every channel — phone, Instagram, your website — so you never miss a client who's ready to start.",
      social:
        "Monthly treatment specials, before/after content, and skincare tips post automatically — keeping your audience warm between visits.",
      calendar:
        "Every new consult, follow-up appointment, and package session is managed here — no double-booking, no missed confirmations.",
      oneApp:
        "Replace your booking system, email tool, review manager, and social scheduler — one platform runs your entire med spa marketing and operations.",
      backOffice:
        "Every new consult request shows up here — your front desk confirms and coordinates treatments without chasing down clients manually.",
      credit:
        "Equipment leasing for lasers and devices is easier when your business credit is established. The Fundability Builder builds that foundation.",
    },
    revenueStats: {
      monthlyRevenue: 28000,
      avgJobValue: 340,
      leadsPerMonth: 65,
      description: "Average med spa in this market",
    },
  },

  // ----------------------------------------------------------
  // DENTAL
  // ----------------------------------------------------------
  Dental: {
    voiceScript: [
      {
        speaker: "Caller",
        text: "Hi, I've been thinking about whitening my teeth for a while and I also wanted to ask about Invisalign. Do you offer free consultations for that?",
      },
      {
        speaker: "AI Receptionist",
        text: "Yes, absolutely! We offer complimentary smile consultations for both teeth whitening and Invisalign. You'll get a full exam and treatment plan — no obligation. Can I get you on the schedule this week?",
      },
      {
        speaker: "Caller",
        text: "Sure, I'm flexible. Any day after 3pm works.",
      },
      {
        speaker: "AI Receptionist",
        text: "Perfect — we have Wednesday at 3:30 PM available. I'll book you in for a new patient smile consultation. You'll receive a text with intake forms and directions. Looking forward to meeting you!",
      },
      { speaker: "Caller", text: "Great, thank you!" },
      {
        speaker: "AI Receptionist",
        text: "Of course! And if you have any questions before your visit, just reply to that text and we'll get back to you right away.",
      },
    ],
    socialPosts: [
      {
        content:
          "😁 New Patient Special: Comprehensive Exam + X-Rays + Professional Cleaning for just $99 (regularly $250). Most insurances accepted. Book your first visit today — your smile deserves it!",
        likes: 247,
        comments: 63,
        platform: "Facebook",
        hashtags: [
          "#NewPatientSpecial",
          "#DentalExam",
          "#FamilyDentist",
          "#AffordableDental",
        ],
      },
      {
        content:
          "✨ Professional teeth whitening in just one visit — up to 8 shades brighter. Our in-office Zoom Whitening is on special this month. Real results you'll see the same day!",
        likes: 318,
        comments: 84,
        platform: "Instagram",
        hashtags: [
          "#TeethWhitening",
          "#ZoomWhitening",
          "#SmileTransformation",
          "#DentalSpecial",
        ],
      },
      {
        content:
          "🦷 Considering Invisalign? Most patients see results in 6–18 months and never have to wear metal braces. Free consultation includes digital smile preview so you see your result BEFORE you start!",
        likes: 276,
        comments: 71,
        platform: "Instagram",
        hashtags: [
          "#Invisalign",
          "#ClearAligners",
          "#SmileGoals",
          "#InvisalignProvider",
        ],
      },
    ],
    appointmentTypes: [
      {
        name: "New Patient Exam",
        duration: "60 min",
        leadName: "Rachel Thompson",
        service: "Exam + X-Rays + Cleaning",
        time: "3:30 PM",
      },
      {
        name: "Teeth Whitening",
        duration: "90 min",
        leadName: "Jordan Ellis",
        service: "Zoom In-Office Whitening",
        time: "10:00 AM",
      },
      {
        name: "Invisalign Consultation",
        duration: "45 min",
        leadName: "Maria Santos",
        service: "Digital Scan + Treatment Plan",
        time: "2:00 PM",
      },
      {
        name: "Emergency Tooth Pain",
        duration: "30–60 min",
        leadName: "Kevin Andrews",
        service: "Same-Day Emergency Exam",
        time: "8:30 AM",
      },
    ],
    beforePainPoints: [
      "Phone calls during procedures go unanswered — new patients book elsewhere",
      "Recall system is manual — patients miss their 6-month cleanings",
      "No treatment plan follow-up — accepted estimates don't convert to scheduled appointments",
      "Review collection is hit-or-miss — reputation lags behind service quality",
    ],
    afterPromises: [
      "AI answers calls during procedures and books new patients instantly",
      "Automated recall texts and emails bring patients back for cleanings on time",
      "Treatment plan follow-up sequences convert unscheduled cases to booked appointments",
      "Post-appointment review requests generate steady Google and Yelp reviews automatically",
    ],
    crmLeads: [
      {
        name: "Rachel Thompson",
        service: "New Patient Exam",
        status: "Booked",
        value: "$99",
        phone: "(555) 243-1187",
      },
      {
        name: "Jordan Ellis",
        service: "Teeth Whitening",
        status: "Completed",
        value: "$495",
        phone: "(555) 367-5523",
      },
      {
        name: "Maria Santos",
        service: "Invisalign Full Course",
        status: "Estimate Sent",
        value: "$4,800",
        phone: "(555) 481-9904",
      },
      {
        name: "Kevin Andrews",
        service: "Emergency Extraction",
        status: "Completed",
        value: "$325",
        phone: "(555) 554-3311",
      },
      {
        name: "Thomas Wright",
        service: "Crown + Whitening",
        status: "Treatment Plan",
        value: "$2,200",
        phone: "(555) 637-7726",
      },
    ],
    reviews: [
      {
        author: "Rachel T.",
        rating: 5,
        text: "I have major dental anxiety and put off going for years. This office made me feel completely at ease — gentle, kind, and explained everything. My best dental experience ever.",
        platform: "Google",
      },
      {
        author: "Jordan E.",
        rating: 5,
        text: "Zoom whitening in one lunch break. I'm 7 shades brighter and couldn't be happier with the results. Worth every penny!",
        platform: "Yelp",
      },
      {
        author: "Maria S.",
        rating: 5,
        text: "Halfway through Invisalign and already seeing a huge difference. The digital preview at my consult matched exactly what's happening. Dr. Chen is amazing!",
        platform: "Google",
      },
    ],
    creditContext: {
      businessType: "Dental Practice",
      avgRevenue: "$42,000/mo",
      fundabilityScore: 54,
      vendorRecommendations: [
        "Henry Schein Credit Account",
        "Patterson Dental Net-30",
        "Benco Dental Trade Credit",
        "CareCredit Provider Program",
      ],
    },
    coachTips: {
      beforeAfter:
        "The gap between your current new patient volume and your capacity is real money left on the table every single month.",
      voice:
        "Your AI receptionist handles new patient calls so your team can focus on chair-side care — no more missed calls during procedures.",
      social:
        "New patient specials, whitening promotions, and Invisalign content go out on a consistent schedule — filling your chairs without spending on ads.",
      calendar:
        "Recalls, new patients, treatment appointments, and emergency slots are all managed here — your schedule always optimized.",
      oneApp:
        "Booking system, recall reminders, review requests, and patient communication — all in one place instead of four disconnected tools.",
      backOffice:
        "Every new patient, treatment plan, and follow-up is tracked here — your front desk always knows what needs attention next.",
      credit:
        "Equipment upgrades, CBCT scanners, and practice expansion financing all become accessible when your practice fundability is strong.",
    },
    revenueStats: {
      monthlyRevenue: 42000,
      avgJobValue: 850,
      leadsPerMonth: 55,
      description: "Average dental practice in this market",
    },
  },

  // ----------------------------------------------------------
  // REAL ESTATE
  // ----------------------------------------------------------
  "Real Estate": {
    voiceScript: [
      {
        speaker: "Caller",
        text: "Hi, I'm looking to buy my first home. My budget is around $450,000 and I'd love something with 3 bedrooms. I'm not sure where to start with the whole process.",
      },
      {
        speaker: "AI Receptionist",
        text: "Congratulations on starting this journey! First-time buying can feel overwhelming but we make it easy. Our buyer consultations are completely free and we'll walk you through everything step by step. Can I book you with one of our buyer specialists this week?",
      },
      {
        speaker: "Caller",
        text: "Yes, I'd love that. I'm available evenings.",
      },
      {
        speaker: "AI Receptionist",
        text: "Perfect — I have Tuesday at 6 PM available for a free buyer consultation. We'll cover pre-approval, your wish list, and show you current listings in your range. Does that work?",
      },
      { speaker: "Caller", text: "Tuesday at 6 is great!" },
      {
        speaker: "AI Receptionist",
        text: "Wonderful! I'll send you a confirmation text with everything you need to know before the meeting. We're so excited to help you find your dream home!",
      },
    ],
    socialPosts: [
      {
        content:
          "🏡 Just listed: Stunning 4BD/3BA craftsman in Riverside Heights at $489,000. Open house Saturday 12–3PM. This one won't last — DM us for a private showing today!",
        likes: 342,
        comments: 87,
        platform: "Instagram",
        hashtags: ["#JustListed", "#OpenHouse", "#RealEstate", "#HomesForSale"],
      },
      {
        content:
          "📊 MARKET UPDATE: Inventory is up 12% this quarter but well-priced homes are still moving in under 10 days. Thinking about selling? Now is still a strong time. Free home valuation — link in bio!",
        likes: 228,
        comments: 64,
        platform: "Facebook",
        hashtags: [
          "#MarketUpdate",
          "#RealEstateMarket",
          "#HomeValues",
          "#SellYourHome",
        ],
      },
      {
        content:
          "🔑 Closed another one! Our buyers got $18,500 below asking on this beautiful 3BR in Oakwood Heights. Strategy + negotiation = results. Ask us how we do it!",
        likes: 415,
        comments: 102,
        platform: "Facebook",
        hashtags: [
          "#JustClosed",
          "#NegotiationWin",
          "#BuyersAgent",
          "#RealEstateSuccess",
        ],
      },
    ],
    appointmentTypes: [
      {
        name: "Free Buyer Consultation",
        duration: "60 min",
        leadName: "Alex Carter",
        service: "First-Time Buyer Strategy Session",
        time: "6:00 PM",
      },
      {
        name: "Property Showing",
        duration: "45 min",
        leadName: "Melissa Grant",
        service: "3 Properties — Oakwood Heights",
        time: "10:00 AM",
      },
      {
        name: "Listing Presentation",
        duration: "90 min",
        leadName: "Steven Black",
        service: "Seller CMA + Marketing Plan",
        time: "2:00 PM",
      },
      {
        name: "Market Analysis Meeting",
        duration: "45 min",
        leadName: "Donna Park",
        service: "Comparative Market Analysis",
        time: "11:30 AM",
      },
    ],
    beforePainPoints: [
      "Leads from Zillow and Realtor.com go cold within hours if not called back",
      "No structured follow-up — buyers disengage and go with whoever responds first",
      "Sellers don't hear from their agent enough — listings expire or go to competitors",
      "No review collection process — past clients are a silent referral source",
    ],
    afterPromises: [
      "AI responds to every portal lead within 60 seconds — before the competition even sees the notification",
      "12-touch buyer nurture sequence keeps you top-of-mind from first inquiry to close",
      "Automated seller communication updates clients weekly — no more 'where's my agent' calls",
      "Post-closing review requests and referral asks go out automatically at 30 and 90 days",
    ],
    crmLeads: [
      {
        name: "Alex Carter",
        service: "First-Time Buyer",
        status: "Consultation Booked",
        value: "$13,500 est.",
        phone: "(555) 261-4433",
      },
      {
        name: "Melissa Grant",
        service: "Buyer — $400–500k Range",
        status: "Showing Scheduled",
        value: "$14,800 est.",
        phone: "(555) 382-7721",
      },
      {
        name: "Steven Black",
        service: "Listing — 4BR Parkview",
        status: "Contract Active",
        value: "$18,200 est.",
        phone: "(555) 445-9908",
      },
      {
        name: "Donna Park",
        service: "Buyer — Relocation",
        status: "Pre-Approved",
        value: "$16,500 est.",
        phone: "(555) 519-3347",
      },
      {
        name: "Chris Nguyen",
        service: "Investment Property",
        status: "New Lead",
        value: "$11,000 est.",
        phone: "(555) 623-5512",
      },
    ],
    reviews: [
      {
        author: "Alex C.",
        rating: 5,
        text: "As a first-time buyer I was completely lost. My agent made the entire process feel manageable, negotiated $15k off asking price, and was available every step of the way. Incredible experience!",
        platform: "Google",
      },
      {
        author: "Melissa G.",
        rating: 5,
        text: "Found my dream home in 3 weekends. My agent knew exactly what I wanted and showed me properties I wouldn't have found on my own. Professional and genuinely caring.",
        platform: "Zillow",
      },
      {
        author: "Steven B.",
        rating: 5,
        text: "Listed on a Thursday, had multiple offers by Sunday, sold over asking. The marketing strategy was aggressive and brilliant. My go-to realtor forever.",
        platform: "Google",
      },
    ],
    creditContext: {
      businessType: "Real Estate Agency / Brokerage",
      avgRevenue: "$120,000/mo",
      fundabilityScore: 63,
      vendorRecommendations: [
        "Chase Business Credit Line",
        "Amex Business Gold",
        "NAR Vendor Finance Program",
        "CoStar Group Credit Account",
      ],
    },
    coachTips: {
      beforeAfter:
        "Speed is everything in real estate. Every minute a lead waits for a callback, they're texting another agent. This gap shows what's being lost right now.",
      voice:
        "Your AI responds to every Zillow, Realtor, and website lead instantly — often booking a consultation before a competitor even reads the notification.",
      social:
        "New listings, just-closeds, market updates, and open house announcements post automatically — keeping your sphere engaged and your pipeline warm.",
      calendar:
        "Showings, consultations, listing appointments, and follow-ups are all managed here — your schedule organized and your clients never neglected.",
      oneApp:
        "CRM, drip campaigns, review management, social media, and your front desk AI — replacing five tools with one that actually works together.",
      backOffice:
        "Every buyer and seller lead is tracked here — where they are in the pipeline, what follow-ups are pending, and what's closing next.",
      credit:
        "Business credit lines allow you to invest in marketing, staging, and advertising at the start of each listing — paid back at closing.",
    },
    revenueStats: {
      monthlyRevenue: 120000,
      avgJobValue: 14000,
      leadsPerMonth: 30,
      description: "Average real estate agency in this market",
    },
  },

  // ----------------------------------------------------------
  // MORTGAGE
  // ----------------------------------------------------------
  Mortgage: {
    voiceScript: [
      {
        speaker: "Caller",
        text: "Hi, my wife and I are looking to buy our first home and we need to get pre-approved. We're not sure how much we can afford or what the process looks like.",
      },
      {
        speaker: "AI Receptionist",
        text: "Congratulations on taking this step! Pre-approval is the first move and it's easier than most people think. Our loan officers make it simple. Can I book you for a free pre-approval consultation — takes about 30 minutes?",
      },
      {
        speaker: "Caller",
        text: "Yes, that would be great. What do we need to bring?",
      },
      {
        speaker: "AI Receptionist",
        text: "Just your last 2 pay stubs and last 2 years of W-2s — we'll do the rest. I have a spot open Thursday at 5:30 PM. Should I book both you and your wife?",
      },
      { speaker: "Caller", text: "Yes, please!" },
      {
        speaker: "AI Receptionist",
        text: "Perfect — you're both booked for a joint pre-approval session Thursday at 5:30 PM. I'll send you both a confirmation text with the document checklist. Looking forward to helping you get into your new home!",
      },
    ],
    socialPosts: [
      {
        content:
          "🏠 Rates just dropped to their lowest point in 8 months. If you've been waiting to buy or refinance, THIS is the window. Free rate check takes 5 minutes — no credit pull. What are you waiting for?",
        likes: 274,
        comments: 68,
        platform: "Facebook",
        hashtags: ["#MortgageRates", "#BuyNow", "#RateAlert", "#HomeLoans"],
      },
      {
        content:
          "📋 First-time buyer? Here's what you actually need to get pre-approved: 2 pay stubs, 2 years of W-2s, and your ID. That's it. We handle the rest. Free consultation this week!",
        likes: 198,
        comments: 54,
        platform: "Instagram",
        hashtags: [
          "#FirstTimeBuyer",
          "#PreApproval",
          "#MortgageTips",
          "#HomeOwnership",
        ],
      },
      {
        content:
          "💰 Refinancing could save you $400–$800 per month. With today's rates, it's worth a 10-minute call to see if it makes sense. We'll run the numbers — no obligation, no credit pull.",
        likes: 231,
        comments: 59,
        platform: "Facebook",
        hashtags: [
          "#Refinancing",
          "#MortgageSavings",
          "#RateDrop",
          "#CashOutRefi",
        ],
      },
    ],
    appointmentTypes: [
      {
        name: "Pre-Approval Meeting",
        duration: "30–45 min",
        leadName: "James & Amy Holloway",
        service: "FHA / Conv. Pre-Approval",
        time: "5:30 PM",
      },
      {
        name: "Refinance Consultation",
        duration: "30 min",
        leadName: "Richard Clarke",
        service: "Rate & Term Refinance Analysis",
        time: "10:00 AM",
      },
      {
        name: "First-Time Buyer Session",
        duration: "60 min",
        leadName: "Keisha Washington",
        service: "Down Payment Programs Review",
        time: "2:00 PM",
      },
      {
        name: "Jumbo Loan Consultation",
        duration: "45 min",
        leadName: "Thomas Brennan",
        service: "Jumbo Purchase Pre-Qual",
        time: "11:30 AM",
      },
    ],
    beforePainPoints: [
      "Pre-approval leads go cold fast — agents refer elsewhere if you don't respond in an hour",
      "No rate alert system — past clients refinance with competitors when rates drop",
      "Manual pipeline tracking — loans fall behind without a clear system",
      "No review collection — satisfied borrowers forget to leave feedback at closing",
    ],
    afterPromises: [
      "AI responds to every pre-approval inquiry within minutes — before competitor LOs even call back",
      "Automated rate watch alerts notify your database the moment rates hit a target threshold",
      "Visual pipeline keeps every loan on track from application to clear-to-close",
      "Post-closing review requests at day 30 and referral asks at day 90 build your reputation and pipeline",
    ],
    crmLeads: [
      {
        name: "James & Amy Holloway",
        service: "FHA Pre-Approval",
        status: "Consultation Booked",
        value: "$4,800 est.",
        phone: "(555) 281-3344",
      },
      {
        name: "Richard Clarke",
        service: "Rate/Term Refi",
        status: "Application In",
        value: "$3,900 est.",
        phone: "(555) 364-7721",
      },
      {
        name: "Keisha Washington",
        service: "Down Payment Program",
        status: "Pre-Approved",
        value: "$4,200 est.",
        phone: "(555) 447-9908",
      },
      {
        name: "Thomas Brennan",
        service: "Jumbo Purchase",
        status: "Docs Requested",
        value: "$7,500 est.",
        phone: "(555) 531-5523",
      },
      {
        name: "Maria Delgado",
        service: "FHA → Conv. Refinance",
        status: "New Lead",
        value: "$3,600 est.",
        phone: "(555) 618-2211",
      },
    ],
    reviews: [
      {
        author: "James H.",
        rating: 5,
        text: "Easiest mortgage experience of my life. Our loan officer was responsive, explained every step, and we closed 3 days early. I'll never use anyone else.",
        platform: "Google",
      },
      {
        author: "Keisha W.",
        rating: 5,
        text: "I had no idea I qualified for down payment assistance. My loan officer found a program that saved me $12,000 at closing. Life-changing!",
        platform: "Zillow",
      },
      {
        author: "Thomas B.",
        rating: 5,
        text: "Complex jumbo purchase, tight timeline, out-of-state. They handled everything seamlessly and got us a rate I didn't think was possible. Exceptional team.",
        platform: "Google",
      },
    ],
    creditContext: {
      businessType: "Mortgage Lending / Brokerage",
      avgRevenue: "$75,000/mo",
      fundabilityScore: 58,
      vendorRecommendations: [
        "Amex Business Platinum",
        "Chase Ink Business Card",
        "CoStar Lead Source Account",
        "Optimal Blue Pricing Credit",
      ],
    },
    coachTips: {
      beforeAfter:
        "Agent referrals go to whoever picks up first. This gap shows how many pre-approval leads are slipping to faster-responding competitors.",
      voice:
        "Your AI responds to every inquiry in under 60 seconds — day or night — so you're always the first lender a buyer hears from.",
      social:
        "Rate alerts, first-time buyer tips, and refinance opportunities post automatically — keeping your past clients and referral partners engaged.",
      calendar:
        "Pre-approval sessions, document collection calls, and closing day milestones are all tracked and scheduled automatically.",
      oneApp:
        "Replace your LOS communication tool, email marketing, CRM, and scheduling — one dashboard runs your entire origination operation.",
      backOffice:
        "Every loan application, pipeline stage, and document status is visible here — your processor and LO always on the same page.",
      credit:
        "Business credit lines allow you to invest in marketing and technology between commission months without disrupting cash flow.",
    },
    revenueStats: {
      monthlyRevenue: 75000,
      avgJobValue: 4200,
      leadsPerMonth: 28,
      description: "Average mortgage lender / broker in this market",
    },
  },

  // ----------------------------------------------------------
  // LANDSCAPING
  // ----------------------------------------------------------
  Landscaping: {
    voiceScript: [
      {
        speaker: "Caller",
        text: "Hi, my backyard is completely overgrown and I've been putting it off forever. I'm looking for someone who can do a full cleanup and maybe design something nicer going forward.",
      },
      {
        speaker: "AI Receptionist",
        text: "We'd love to help transform your yard! We do full lawn makeovers — cleanup, design, and ongoing maintenance if you want it. A free lawn assessment takes about 20 minutes and we can have an estimate ready same day. When would you like us to come out?",
      },
      { speaker: "Caller", text: "Would Saturday morning work?" },
      {
        speaker: "AI Receptionist",
        text: "Absolutely — I have Saturday at 9 AM available. Our landscape designer will walk your property, take measurements, and put together a design + estimate for you on the spot. What's your address?",
      },
      { speaker: "Caller", text: "1807 Clover Hill Road." },
      {
        speaker: "AI Receptionist",
        text: "You're all set! Free lawn assessment at 1807 Clover Hill Road, Saturday at 9 AM. We'll see you then — get ready for a backyard you actually want to spend time in!",
      },
    ],
    socialPosts: [
      {
        content:
          "🌿 Before + After: This backyard went from overgrown jungle to outdoor living dream in one weekend. Full cleanup, new planting beds, and custom stone pathway. Want yours next? Free assessment this week!",
        likes: 389,
        comments: 94,
        platform: "Instagram",
        hashtags: [
          "#LandscapeTransformation",
          "#BackyardGoals",
          "#LawnCare",
          "#OutdoorLiving",
        ],
      },
      {
        content:
          "🍂 Fall cleanup season is here! Leaf removal, bed cleanup, last mow, and winterization — all in one visit. Limited spots available this month. Book now before the frost hits!",
        likes: 214,
        comments: 48,
        platform: "Facebook",
        hashtags: [
          "#FallCleanup",
          "#LeafRemoval",
          "#LawnMaintenance",
          "#SeasonalLandscaping",
        ],
      },
      {
        content:
          "💧 Tired of dragging hoses around? Our smart irrigation systems save up to 40% on your water bill and keep your lawn green automatically. Free irrigation quote with any service this month!",
        likes: 176,
        comments: 41,
        platform: "Facebook",
        hashtags: [
          "#SmartIrrigation",
          "#WaterSmart",
          "#IrrigationSystem",
          "#LawnCare",
        ],
      },
    ],
    appointmentTypes: [
      {
        name: "Free Lawn Assessment",
        duration: "30 min",
        leadName: "Greg Mitchell",
        service: "Full Yard Design + Estimate",
        time: "9:00 AM",
      },
      {
        name: "Weekly Maintenance",
        duration: "45–60 min",
        leadName: "Patrice Johnson",
        service: "Mow, Edge, Blow, Trim",
        time: "8:00 AM",
      },
      {
        name: "Irrigation System Install",
        duration: "Full Day",
        leadName: "Howard Bell",
        service: "6-Zone Smart Drip System",
        time: "7:30 AM",
      },
      {
        name: "Hardscape Design Quote",
        duration: "60 min",
        leadName: "Laura Evans",
        service: "Patio + Walkway Design",
        time: "2:00 PM",
      },
    ],
    beforePainPoints: [
      "One-time cleanup calls rarely convert to recurring maintenance contracts",
      "Seasonal demand spikes overwhelm scheduling — phone rings unanswered",
      "No follow-up after estimates — leads go cold or book the next company that calls",
      "No review process — beautiful transformations go unseen online",
    ],
    afterPromises: [
      "AI converts one-time cleanup calls into recurring maintenance agreements with an automated follow-up sequence",
      "Spring and fall campaign texts and emails go out automatically — filling the schedule before the season starts",
      "2-day estimate follow-up sequence re-engages leads who haven't responded",
      "Post-job review requests with before/after photo prompts generate visual social proof constantly",
    ],
    crmLeads: [
      {
        name: "Greg Mitchell",
        service: "Full Yard Makeover",
        status: "Assessment Booked",
        value: "$3,200",
        phone: "(555) 249-4431",
      },
      {
        name: "Patrice Johnson",
        service: "Weekly Maintenance",
        status: "Active Contract",
        value: "$180/mo",
        phone: "(555) 362-7723",
      },
      {
        name: "Howard Bell",
        service: "Irrigation Install",
        status: "Estimate Sent",
        value: "$4,800",
        phone: "(555) 447-9921",
      },
      {
        name: "Laura Evans",
        service: "Patio + Walkway",
        status: "Design Scheduled",
        value: "$8,500",
        phone: "(555) 531-5534",
      },
      {
        name: "Carlos Vega",
        service: "Seasonal Cleanup",
        status: "Completed",
        value: "$650",
        phone: "(555) 618-2247",
      },
    ],
    reviews: [
      {
        author: "Greg M.",
        rating: 5,
        text: "Complete backyard transformation in 3 days. I couldn't believe it was the same yard. Professional crew, beautiful design, and they cleaned up everything. Worth every penny!",
        platform: "Google",
      },
      {
        author: "Patrice J.",
        rating: 5,
        text: "My lawn has never looked better. They show up every week like clockwork, always thorough, and my yard is the envy of the neighborhood now. Love this crew!",
        platform: "Yelp",
      },
      {
        author: "Howard B.",
        rating: 5,
        text: "Smart irrigation system installed in one day. My water bill dropped $90 the first month and the lawn is perfectly watered without me thinking about it. Brilliant!",
        platform: "Google",
      },
    ],
    creditContext: {
      businessType: "Landscaping / Lawn Care Business",
      avgRevenue: "$18,000/mo",
      fundabilityScore: 38,
      vendorRecommendations: [
        "SiteOne Landscape Supply Net-30",
        "John Deere Financial",
        "Sunbelt Rentals Credit Account",
        "Home Depot Pro Business Credit",
      ],
    },
    coachTips: {
      beforeAfter:
        "Every one-time cleanup that doesn't convert to a maintenance contract is recurring revenue you're leaving behind. This gap adds up fast.",
      voice:
        "Your AI books lawn assessments from every missed call and online inquiry — even while your crew is out in the field.",
      social:
        "Before/after transformation photos, seasonal specials, and irrigation tips post automatically — building your visual portfolio and driving steady leads.",
      calendar:
        "Crew schedules, maintenance routes, estimate appointments, and project milestones are all managed here — no more scheduling chaos.",
      oneApp:
        "Replace your estimate tool, scheduling app, review manager, and marketing platform — one dashboard runs your entire landscaping operation.",
      backOffice:
        "Every lead, estimate, maintenance contract, and project is tracked here — your business organized from first call to final invoice.",
      credit:
        "Equipment financing for mowers, trucks, and trailers is more accessible when your business credit is established through the Fundability Builder.",
    },
    revenueStats: {
      monthlyRevenue: 18000,
      avgJobValue: 380,
      leadsPerMonth: 42,
      description: "Average landscaping business in this market",
    },
  },

  // ----------------------------------------------------------
  // GENERAL (fallback — neutral language, covers all bases)
  // ----------------------------------------------------------
  General: {
    voiceScript: [
      {
        speaker: "Caller",
        text: "Hi, I found you online and I'm interested in your services. Can someone help me figure out if you're the right fit?",
      },
      {
        speaker: "AI Receptionist",
        text: "Absolutely! We'd love to learn about your needs. I can connect you with one of our team members for a free consultation — usually just 20–30 minutes. When works best for you?",
      },
      { speaker: "Caller", text: "Maybe tomorrow afternoon?" },
      {
        speaker: "AI Receptionist",
        text: "Perfect — I have tomorrow at 2 PM and 4 PM available. Which do you prefer?",
      },
      { speaker: "Caller", text: "2 PM works great." },
      {
        speaker: "AI Receptionist",
        text: "You're all set for a free consultation tomorrow at 2 PM. I'll send you a confirmation text shortly. Looking forward to connecting with you!",
      },
    ],
    socialPosts: [
      {
        content:
          "🚀 Running a service business is hard work. Managing all the moving pieces — leads, follow-ups, reviews, scheduling — shouldn't be. One platform handles it all on autopilot. Ask us how!",
        likes: 145,
        comments: 32,
        platform: "Facebook",
        hashtags: [
          "#BusinessGrowth",
          "#SmallBusiness",
          "#Automation",
          "#LocalBusiness",
        ],
      },
      {
        content:
          "⭐ Your best marketing is a 5-star review — and we make sure you get them. Automated review requests after every job mean your reputation grows while you focus on your work.",
        likes: 118,
        comments: 27,
        platform: "Instagram",
        hashtags: [
          "#ReputationManagement",
          "#CustomerReviews",
          "#5StarService",
          "#BusinessTips",
        ],
      },
      {
        content:
          "📱 While you sleep, your AI front desk is answering calls, booking appointments, and following up with leads. Wake up to a full calendar. That's the BRF difference.",
        likes: 197,
        comments: 51,
        platform: "Facebook",
        hashtags: [
          "#AIBusiness",
          "#AutoPilot",
          "#ServiceBusiness",
          "#LeadGeneration",
        ],
      },
    ],
    appointmentTypes: [
      {
        name: "Free Consultation",
        duration: "30 min",
        leadName: "Michael Davis",
        service: "Initial Assessment",
        time: "2:00 PM",
      },
      {
        name: "Service Appointment",
        duration: "1–2 hrs",
        leadName: "Sandra Williams",
        service: "Primary Service",
        time: "10:00 AM",
      },
      {
        name: "Follow-Up Review",
        duration: "30 min",
        leadName: "James Anderson",
        service: "Quality Check",
        time: "3:00 PM",
      },
      {
        name: "New Client Onboarding",
        duration: "45 min",
        leadName: "Patricia Lee",
        service: "Onboarding Session",
        time: "11:00 AM",
      },
    ],
    beforePainPoints: [
      "Calls going unanswered — leads booking competitors",
      "No structured follow-up — interested prospects go cold",
      "Manual scheduling creates double-bookings and missed appointments",
      "Reviews going uncollected — online reputation stagnant",
    ],
    afterPromises: [
      "AI answers every call 24/7 and books appointments on the spot",
      "Automated follow-up sequences keep every lead warm until they convert",
      "Smart scheduling prevents conflicts and sends automatic reminders",
      "Post-service review requests build 5-star reputation automatically",
    ],
    crmLeads: [
      {
        name: "Michael Davis",
        service: "Initial Consultation",
        status: "Booked",
        value: "$800",
        phone: "(555) 234-5678",
      },
      {
        name: "Sandra Williams",
        service: "Primary Service",
        status: "Completed",
        value: "$1,200",
        phone: "(555) 345-6789",
      },
      {
        name: "James Anderson",
        service: "Follow-Up Service",
        status: "Estimate Sent",
        value: "$950",
        phone: "(555) 456-7890",
      },
      {
        name: "Patricia Lee",
        service: "Onboarding",
        status: "New Lead",
        value: "$1,500",
        phone: "(555) 567-8901",
      },
      {
        name: "Robert Johnson",
        service: "Recurring Service",
        status: "Active",
        value: "$600/mo",
        phone: "(555) 678-9012",
      },
    ],
    reviews: [
      {
        author: "Michael D.",
        rating: 5,
        text: "Excellent service from start to finish. Professional, on time, and the results exceeded my expectations. Highly recommend to anyone looking for quality!",
        platform: "Google",
      },
      {
        author: "Sandra W.",
        rating: 5,
        text: "Outstanding team. They communicated throughout the entire process and delivered exactly what was promised. Will definitely use again!",
        platform: "Yelp",
      },
      {
        author: "James A.",
        rating: 5,
        text: "Best service experience I've had. Responsive, fair priced, and genuinely cares about getting the job done right. Five stars without hesitation.",
        platform: "Google",
      },
    ],
    creditContext: {
      businessType: "Local Service Business",
      avgRevenue: "$25,000/mo",
      fundabilityScore: 40,
      vendorRecommendations: [
        "Amex Business Credit Card",
        "Chase Ink Business Card",
        "Uline Business Account",
        "Staples Business Credit",
      ],
    },
    coachTips: {
      beforeAfter:
        "Every missed call and unanswered lead represents real revenue going to a competitor. This shows the full financial gap you're closing with BRF.",
      voice:
        "Your AI receptionist answers every call 24/7 — booking appointments, answering questions, and capturing leads without you lifting a finger.",
      social:
        "Industry tips, special offers, and customer spotlights go out on a consistent schedule — keeping your audience engaged and your brand top of mind.",
      calendar:
        "Every appointment, follow-up, and client interaction is managed here — organized, automated, and always on track.",
      oneApp:
        "Booking, CRM, reviews, marketing, and your AI front desk — all in one dashboard replacing five disconnected tools.",
      backOffice:
        "Every lead, appointment, and client relationship is managed here — your business operations organized and running on autopilot.",
      credit:
        "Strong business credit opens doors to financing, equipment leases, and vendor terms that keep your cash flow healthy and your growth funded.",
    },
    revenueStats: {
      monthlyRevenue: 25000,
      avgJobValue: 750,
      leadsPerMonth: 38,
      description: "Average local service business in this market",
    },
  },
};

// ============================================================
// GETTER — returns exact niche data or falls back to General
// ============================================================

export function getDemoContent(niche: string): NicheDemoContent {
  return NICHE_DEMO_CONTENT[niche] ?? NICHE_DEMO_CONTENT.General;
}
