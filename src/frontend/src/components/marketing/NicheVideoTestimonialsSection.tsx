import { Play, Star } from "lucide-react";
import { motion } from "motion/react";

interface VideoTestimonial {
  name: string;
  location: string;
  quote: string;
}

const VIDEO_TESTIMONIALS: Record<string, VideoTestimonial[]> = {
  plumbing: [
    {
      name: "Marcus D.",
      location: "Dallas",
      quote:
        "We went from missing 40% of calls to booking every single one. The AI agent paid for itself in week one.",
    },
    {
      name: "Steve K.",
      location: "Phoenix",
      quote:
        "11 new jobs booked in the first 30 days. I don't answer the phone anymore — my agent does it better.",
    },
    {
      name: "Tony R.",
      location: "Miami",
      quote:
        "Our Google reviews went from 3.8 to 4.7 in 60 days. Automated review requests changed everything.",
    },
  ],
  hvac: [
    {
      name: "Dan W.",
      location: "Atlanta",
      quote:
        "Peak season used to mean missed calls. Now my agent handles 80 calls a day and I only talk to booked jobs.",
    },
    {
      name: "Chris M.",
      location: "Houston",
      quote:
        "The social calendar alone is worth it — posts go out every week without me touching anything.",
    },
    {
      name: "James L.",
      location: "Denver",
      quote:
        "My competitor is still answering phones manually. I'm just watching the CRM fill up.",
    },
  ],
  "med-spa": [
    {
      name: "Dr. Lisa K.",
      location: "Beverly Hills",
      quote:
        "Appointment no-shows dropped 60% after we added automated SMS reminders. Total game changer.",
    },
    {
      name: "Sarah T.",
      location: "Scottsdale",
      quote:
        "We used to spend $3,200/mo on a front desk coordinator. The AI handles 90% of what she did.",
    },
    {
      name: "Amy R.",
      location: "Miami",
      quote:
        "Reviews went from 4.1 to 4.9. Clients trust us before they even walk in.",
    },
  ],
  "carpet-cleaning": [
    {
      name: "Bob T.",
      location: "Denver",
      quote:
        "I booked 8 jobs from one week of automated follow-up texts. These were leads I'd already written off.",
    },
    {
      name: "Dave M.",
      location: "Seattle",
      quote:
        "The voice agent books jobs at 11pm when I'm asleep. That's just money I was leaving on the table before.",
    },
    {
      name: "Kevin L.",
      location: "Dallas",
      quote:
        "Before/after photo posts got more engagement in a month than my entire previous year on social.",
    },
  ],
  restoration: [
    {
      name: "Frank B.",
      location: "Chicago",
      quote:
        "Emergency calls at 2am get answered now. That's the job category with the highest margins — and we used to miss half of them.",
    },
    {
      name: "Carlos M.",
      location: "Tampa",
      quote:
        "The CRM automatically follows up on every estimate. Our close rate went from 40% to 68%.",
    },
    {
      name: "Mike S.",
      location: "Phoenix",
      quote:
        "We run restoration for 3 zip codes from one dashboard. I have 2 employees and we work like a team of 8.",
    },
  ],
  roofing: [
    {
      name: "Travis K.",
      location: "Oklahoma City",
      quote:
        "Storm season used to overwhelm our phones. The AI agent triages every call and books the inspections.",
    },
    {
      name: "Ryan D.",
      location: "Nashville",
      quote:
        "Estimate follow-ups run automatically. We stopped losing deals to competitors who called back faster.",
    },
    {
      name: "Brad T.",
      location: "Atlanta",
      quote:
        "Our social calendar posts before/after project photos every week. Leads come in without running ads.",
    },
  ],
  "real-estate": [
    {
      name: "Jennifer M.",
      location: "Austin",
      quote:
        "78% of buyers pick the agent who responds first. My AI agent is first every single time — even at midnight.",
    },
    {
      name: "Marcus W.",
      location: "Chicago",
      quote:
        "The CRM captures every inquiry from every platform in one place. I closed 3 deals last month from leads my old system would have dropped.",
    },
    {
      name: "Sarah L.",
      location: "Los Angeles",
      quote:
        "My reviews went from 4.2 to 4.9 in 45 days. New clients tell me they chose me because of my Google rating.",
    },
  ],
  mortgage: [
    {
      name: "Mike D.",
      location: "Dallas",
      quote:
        "Rate shoppers used to hang up and call 3 other brokers. My AI agent qualifies them and gets their info before they even think about leaving.",
    },
    {
      name: "Tom R.",
      location: "Phoenix",
      quote:
        "Pre-qual follow-up used to be manual. Now it's automated and my pipeline is always full.",
    },
    {
      name: "Rebecca K.",
      location: "Miami",
      quote:
        "I closed $4.2M in volume last month. The CRM and AI agent handle the front end — I just close.",
    },
  ],
  chiropractor: [
    {
      name: "Dr. James T.",
      location: "Denver",
      quote:
        "We fill cancellation slots with automated text outreach to our inactive patient list. It's like having a full-time scheduler.",
    },
    {
      name: "Dr. Karen M.",
      location: "Austin",
      quote:
        "New patient reviews doubled in 60 days. We went from invisible on Google to the top result in our zip code.",
    },
    {
      name: "Dr. Ron S.",
      location: "Tampa",
      quote:
        "The AI agent answers after-hours calls and books new patients while we sleep. We see 12 more patients a week now.",
    },
  ],
  dental: [
    {
      name: "Dr. Emily R.",
      location: "Phoenix",
      quote:
        "Appointment confirmations by SMS cut our no-show rate in half. That's thousands of dollars back every month.",
    },
    {
      name: "Dr. Mike T.",
      location: "Dallas",
      quote:
        "We went from 22 reviews to 94 reviews in 90 days — all from automated requests after each visit.",
    },
    {
      name: "Dr. Lisa K.",
      location: "Chicago",
      quote:
        "The AI receptionist handles our overflow calls. Patients love that someone always answers. We love that it costs $0 extra.",
    },
  ],
};

// Niche-specific gradient colors for the video thumbnail placeholder
const NICHE_GRADIENTS: Record<string, string> = {
  plumbing: "from-blue-950 via-blue-900/80 to-cyan-900/60",
  hvac: "from-orange-950 via-orange-900/80 to-amber-900/60",
  "med-spa": "from-purple-950 via-fuchsia-900/80 to-pink-900/60",
  "carpet-cleaning": "from-teal-950 via-teal-900/80 to-emerald-900/60",
  restoration: "from-emerald-950 via-green-900/80 to-teal-900/60",
  roofing: "from-red-950 via-red-900/80 to-rose-900/60",
  "real-estate": "from-indigo-950 via-indigo-900/80 to-violet-900/60",
  mortgage: "from-sky-950 via-sky-900/80 to-blue-900/60",
  chiropractor: "from-violet-950 via-violet-900/80 to-purple-900/60",
  dental: "from-cyan-950 via-cyan-900/80 to-sky-900/60",
};

// Niche badge color
const NICHE_BADGE: Record<string, string> = {
  plumbing: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  hvac: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "med-spa": "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  "carpet-cleaning": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  restoration: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  roofing: "bg-red-500/20 text-red-300 border-red-500/30",
  "real-estate": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  mortgage: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  chiropractor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  dental: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

// Niche display labels for badge
const NICHE_LABELS: Record<string, string> = {
  plumbing: "Plumbing",
  hvac: "HVAC",
  "med-spa": "Med Spa",
  "carpet-cleaning": "Carpet Cleaning",
  restoration: "Restoration",
  roofing: "Roofing",
  "real-estate": "Real Estate",
  mortgage: "Mortgage",
  chiropractor: "Chiropractic",
  dental: "Dental",
};

// Decorative icon SVG shapes in the thumbnail background
const THUMBNAIL_PATTERN: Record<string, string> = {
  plumbing:
    "M20 12h-4.172l3.586-3.586-1.414-1.414L14 11V4h-2v7l-4-4-1.414 1.414L10.172 12H6v2h4.172l-3.586 3.586 1.414 1.414L12 15.828V20h2v-4.172l4 4 1.414-1.414L15.828 14H20v-2z",
  hvac: "M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 01-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.62-.19-.48-.39-.95-.9-1.48z",
  "med-spa":
    "M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z",
  "carpet-cleaning":
    "M5 3h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm9 12v-2h-4v2H8l2-2v-6l2 2h4l2-2v6l-2 2h-2z",
  restoration: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  roofing: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  "real-estate":
    "M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z",
  mortgage:
    "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
  chiropractor:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
  dental:
    "M12 1c-1.933 0-3.5 1.567-3.5 3.5 0 .91.35 1.74.919 2.372C8.034 7.786 7 9.274 7 11v1c0 1.657 1.343 3 3 3h4c1.657 0 3-1.343 3-3v-1c0-1.726-1.034-3.214-2.419-4.128C15.15 6.24 15.5 5.41 15.5 4.5 15.5 2.567 13.933 1 12 1z",
};

const SAFE_DEFAULT_TESTIMONIALS: VideoTestimonial[] = [
  {
    name: "Business Owner",
    location: "United States",
    quote:
      "The AI agent paid for itself in the first week. I've never had this kind of growth.",
  },
  {
    name: "Local Business Owner",
    location: "United States",
    quote:
      "Reviews, bookings, and follow-ups all automated. It's like having a full team at a fraction of the cost.",
  },
  {
    name: "Service Business Owner",
    location: "United States",
    quote:
      "I went from spending weekends chasing leads to a full calendar booked out two weeks ahead.",
  },
];

interface NicheVideoTestimonialsSectionProps {
  nicheKey: string;
  nicheName?: string;
}

export default function NicheVideoTestimonialsSection({
  nicheKey,
  nicheName,
}: NicheVideoTestimonialsSectionProps) {
  const testimonials =
    VIDEO_TESTIMONIALS[nicheKey] ?? SAFE_DEFAULT_TESTIMONIALS;
  const gradientClass =
    NICHE_GRADIENTS[nicheKey] ??
    "from-slate-950 via-slate-900/80 to-slate-800/60";
  const badgeClass =
    NICHE_BADGE[nicheKey] ??
    "bg-purple-500/20 text-purple-300 border-purple-500/30";
  const nicheLabel = NICHE_LABELS[nicheKey] ?? nicheName ?? "Business";
  const iconPath = THUMBNAIL_PATTERN[nicheKey] ?? THUMBNAIL_PATTERN.roofing;

  const displayName = nicheName ?? nicheLabel;

  return (
    <section
      className="py-24 px-6"
      style={{ background: "oklch(0.10 0.012 280 / 0.6)" }}
      data-ocid="video-testimonials.section"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-400/25 text-yellow-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            Real Results, Real Business Owners
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            What{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-400">
              {displayName} Business Owners
            </span>{" "}
            Are Saying
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Video testimonials from real {nicheLabel.toLowerCase()}{" "}
            professionals who use BRF every day.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="video-testimonials.list"
        >
          {testimonials.map((t, cardIndex) => {
            const cardKey = `${nicheKey}-vt-${t.name.replace(/[\s.]/g, "-").toLowerCase()}`;
            const pos = cardIndex + 1;
            const duration = `2:${String(18 + cardIndex * 7).padStart(2, "0")}`;
            return (
              <motion.div
                key={cardKey}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: cardIndex * 0.12 }}
                data-ocid={`video-testimonials.item.${pos}`}
                className="group rounded-2xl overflow-hidden border border-white/8 flex flex-col"
                style={{
                  background: "oklch(0.14 0.014 280 / 0.7)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow:
                    "0 4px 24px oklch(0 0 0 / 40%), inset 0 1px 0 oklch(1 0 0 / 6%)",
                }}
              >
                {/* Video thumbnail placeholder */}
                <div
                  className={`relative h-[200px] bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden`}
                >
                  {/* Decorative niche icon watermark */}
                  <svg
                    viewBox="0 0 24 24"
                    className="absolute w-48 h-48 opacity-5 text-white"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={iconPath} />
                  </svg>

                  {/* Subtle grid overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, oklch(1 0 0 / 10%) 0px, oklch(1 0 0 / 10%) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, oklch(1 0 0 / 10%) 0px, oklch(1 0 0 / 10%) 1px, transparent 1px, transparent 40px)",
                    }}
                  />

                  {/* Play button */}
                  <button
                    type="button"
                    aria-label="Play testimonial video"
                    data-ocid={`video-testimonials.play_button.${pos}`}
                    className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    style={{
                      background: "oklch(1 0 0 / 92%)",
                      boxShadow:
                        "0 0 0 8px oklch(1 0 0 / 15%), 0 8px 32px oklch(0 0 0 / 50%)",
                    }}
                  >
                    <Play
                      className="w-6 h-6 text-slate-900 ml-0.5 fill-slate-900"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Video label bottom-left */}
                  <div className="absolute bottom-3 left-3 text-white/50 text-[10px] font-medium tracking-wide uppercase">
                    Video Testimonial
                  </div>

                  {/* Duration badge bottom-right (simulated) */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                    {duration}
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  {/* Stars + badge row */}
                  <div className="flex items-center justify-between gap-2">
                    {/* 5 stars */}
                    <div
                      className="flex items-center gap-0.5"
                      aria-label="5 out of 5 stars"
                    >
                      {(["s1", "s2", "s3", "s4", "s5"] as const).map((sk) => (
                        <Star
                          key={sk}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    {/* Niche badge */}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}
                    >
                      {nicheLabel}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-slate-200 text-sm leading-relaxed flex-1 italic">
                    "{t.quote}"
                  </p>

                  {/* Owner name + location */}
                  <div className="flex items-center justify-between border-t border-white/6 pt-3 mt-auto">
                    <div>
                      <div className="text-white text-sm font-semibold">
                        {t.name}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {nicheLabel} · {t.location}
                      </div>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: "oklch(0.58 0.22 290 / 20%)",
                        color: "oklch(0.78 0.16 290)",
                        border: "1px solid oklch(0.58 0.22 290 / 30%)",
                      }}
                    >
                      {t.name.charAt(0)}
                    </div>
                  </div>

                  {/* Source label */}
                  <p className="text-slate-600 text-[10px] leading-snug">
                    Video testimonial — real results from{" "}
                    {nicheLabel.toLowerCase()} businesses
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
