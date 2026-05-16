import { motion } from "motion/react";

interface IncludedCard {
  icon: string;
  title: string;
  desc: string;
}

const CARDS: Record<string, IncludedCard[]> = {
  plumbing: [
    {
      icon: "📱",
      title: "Your Plumbing Business App",
      desc: "Booking, CRM, and job management, all in one place.",
    },
    {
      icon: "🎙️",
      title: "AI Phone Agent",
      desc: "Answers every call with your name — never miss a job lead.",
    },
    {
      icon: "📊",
      title: "Free Plumbing Business Audit",
      desc: "See what's costing you jobs and how to fix it.",
    },
    {
      icon: "📅",
      title: "30 Days of Plumbing Social Posts",
      desc: "Pre-written posts for Facebook, Google, and Instagram.",
    },
    {
      icon: "🏆",
      title: "Business Scorecard",
      desc: "Know your ranking, reputation score, and what to improve first.",
    },
    {
      icon: "🌐",
      title: "Your Website, Ready to Go",
      desc: "Use yours or claim the plumbing site we already built.",
    },
  ],
  "med-spa": [
    {
      icon: "📱",
      title: "Your Med Spa Business App",
      desc: "Appointments, client records, and retail — all in one place.",
    },
    {
      icon: "🎙️",
      title: "AI Receptionist",
      desc: "Books appointments and answers questions in your spa's voice.",
    },
    {
      icon: "📊",
      title: "Free Med Spa Audit",
      desc: "Find out what's stopping new clients from booking.",
    },
    {
      icon: "📅",
      title: "30 Days of Spa Social Content",
      desc: "Before/after showcases, treatment spotlights, promos — done.",
    },
    {
      icon: "🏆",
      title: "Spa Business Scorecard",
      desc: "See your Google ranking, review velocity, and conversion gaps.",
    },
    {
      icon: "🌐",
      title: "Your Website, Ready to Go",
      desc: "Use yours or claim the luxury spa site we already built.",
    },
  ],
  hvac: [
    {
      icon: "📱",
      title: "Your HVAC Business App",
      desc: "Dispatch, service calls, and customer follow-ups in one place.",
    },
    {
      icon: "🎙️",
      title: "AI Dispatch Agent",
      desc: "Handles after-hours calls and captures every service request.",
    },
    {
      icon: "📊",
      title: "Free HVAC Business Audit",
      desc: "See what your competitors are doing that you're missing.",
    },
    {
      icon: "📅",
      title: "30 Days of HVAC Social Posts",
      desc: "Seasonal tips, maintenance reminders, and trust builders.",
    },
    {
      icon: "🏆",
      title: "HVAC Business Scorecard",
      desc: "Rank your visibility, reviews, and funnel conversion rate.",
    },
    {
      icon: "🌐",
      title: "Your Website, Ready to Go",
      desc: "Use yours or claim the HVAC site we already built for you.",
    },
  ],
  restoration: [
    {
      icon: "📱",
      title: "Your Restoration Business App",
      desc: "Leads, jobs, insurance docs, and follow-ups in one place.",
    },
    {
      icon: "🎙️",
      title: "AI Emergency Response Agent",
      desc: "Answers urgent calls 24/7 before competitors do.",
    },
    {
      icon: "📊",
      title: "Free Restoration Business Audit",
      desc: "Discover why jobs are going to your competitors.",
    },
    {
      icon: "📅",
      title: "30 Days of Restoration Social Posts",
      desc: "Before/after proof, storm alerts, and trust content.",
    },
    {
      icon: "🏆",
      title: "Business Scorecard",
      desc: "Know your response speed score and where you're losing leads.",
    },
    {
      icon: "🌐",
      title: "Your Website, Ready to Go",
      desc: "Use yours or claim the restoration site we already built.",
    },
  ],
  "carpet-cleaning": [
    {
      icon: "📱",
      title: "Your Carpet Cleaning Business App",
      desc: "Bookings, job tracking, and customer history — done.",
    },
    {
      icon: "🎙️",
      title: "AI Booking Agent",
      desc: "Schedules jobs and answers questions in your business name.",
    },
    {
      icon: "📊",
      title: "Free Carpet Cleaning Audit",
      desc: "Find out who's taking your local leads and why.",
    },
    {
      icon: "📅",
      title: "30 Days of Cleaning Social Posts",
      desc: "Before/after photos, seasonal offers, and local tips.",
    },
    {
      icon: "🏆",
      title: "Business Scorecard",
      desc: "Track your reviews, ranking, and booking conversion rate.",
    },
    {
      icon: "🌐",
      title: "Your Website, Ready to Go",
      desc: "Use yours or claim the carpet cleaning site we already built.",
    },
  ],
  roofing: [
    {
      icon: "📱",
      title: "Your Roofing Business App",
      desc: "Estimates, project management, and follow-ups in one place.",
    },
    {
      icon: "🎙️",
      title: "AI Estimate Agent",
      desc: "Qualifies storm leads and captures contact info 24/7.",
    },
    {
      icon: "📊",
      title: "Free Roofing Business Audit",
      desc: "See how many leads your competitors are getting and why.",
    },
    {
      icon: "📅",
      title: "30 Days of Roofing Social Posts",
      desc: "Storm damage proof, before/after photos, local trust content.",
    },
    {
      icon: "🏆",
      title: "Business Scorecard",
      desc: "Know your Google ranking, review speed, and estimate close rate.",
    },
    {
      icon: "🌐",
      title: "Your Website, Ready to Go",
      desc: "Use yours or claim the roofing site we already built.",
    },
  ],
  "real-estate": [
    {
      icon: "🏠",
      title: "Your Real Estate Business App",
      desc: "Everything your agency needs in one place — leads, listings, follow-ups, and closings managed automatically.",
    },
    {
      icon: "🎙️",
      title: "AI Listing & Lead Agent",
      desc: "Never miss a buyer or seller inquiry. Your AI agent answers every call 24/7, qualifies leads, and books showings automatically.",
    },
    {
      icon: "📊",
      title: "Free Real Estate Business Audit",
      desc: "See exactly how your online presence compares to top agents in your market — with a scored report and action plan.",
    },
    {
      icon: "📅",
      title: "Automated Showing Scheduler",
      desc: "Prospects book showings directly from your app, website, or social posts — your calendar fills itself.",
    },
    {
      icon: "⭐",
      title: "Reputation & Review Automation",
      desc: "Automatically request reviews from every closed client. Build the 5-star reputation that wins listings before competitors even call back.",
    },
    {
      icon: "📈",
      title: "30-Day Social Content Calendar",
      desc: "Done-for-you social posts built on top marketing frameworks — positioning you as the go-to agent in your market every single week.",
    },
  ],
  mortgage: [
    {
      icon: "💵",
      title: "Your Mortgage Broker Business App",
      desc: "Full pipeline management from first inquiry to closed loan — leads, follow-ups, and referral partner workflows in one place.",
    },
    {
      icon: "🎙️",
      title: "AI Loan Inquiry Agent",
      desc: "Your AI agent answers every call 24/7, pre-qualifies borrowers, and books consultations automatically before a competitor picks up.",
    },
    {
      icon: "📊",
      title: "Free Mortgage Business Audit",
      desc: "Get a scored analysis of your online visibility, review presence, and lead response speed compared to top brokers in your market.",
    },
    {
      icon: "🤝",
      title: "Referral Partner CRM",
      desc: "Track and nurture every real estate agent, financial planner, and referral partner relationship automatically — keeping your pipeline full.",
    },
    {
      icon: "⭐",
      title: "Reputation & Review Automation",
      desc: "Request reviews from every closed borrower automatically. A strong review profile is the #1 factor in referral partner trust and repeat business.",
    },
    {
      icon: "📈",
      title: "30-Day Social Content Calendar",
      desc: "Niche-specific financial content built on proven frameworks — establishing your authority and generating inbound inquiries every week.",
    },
  ],
  chiropractor: [
    {
      icon: "🩺",
      title: "Your Chiropractic Business App",
      desc: "New patient booking, follow-up care reminders, and reputation management — all automated so you can focus on adjustments, not admin.",
    },
    {
      icon: "🎙️",
      title: "AI Patient Intake Agent",
      desc: "Your AI receptionist answers every call after hours and on weekends, books new patients, and handles basic intake — 24/7, never on hold.",
    },
    {
      icon: "📊",
      title: "Free Chiropractic Business Audit",
      desc: "See how your practice ranks against other chiropractors in your area — scored across reviews, website, local SEO, and lead capture.",
    },
    {
      icon: "📅",
      title: "Automated Appointment Scheduling",
      desc: "New and returning patients book, reschedule, and confirm appointments online — reducing no-shows with automated SMS reminders.",
    },
    {
      icon: "⭐",
      title: "Review Request Automation",
      desc: "After every visit, your system automatically asks satisfied patients for a Google review — building your 5-star profile on autopilot.",
    },
    {
      icon: "📈",
      title: "30-Day Patient Education Calendar",
      desc: "Weekly social content educating your community on spinal health, posture, and wellness — positioning you as the trusted local expert.",
    },
  ],
  dental: [
    {
      icon: "😁",
      title: "Your Dental Practice Business App",
      desc: "Patient scheduling, follow-up care, recall campaigns, and reputation management — running automatically while you focus on clinical care.",
    },
    {
      icon: "🎙️",
      title: "AI Patient Scheduling Agent",
      desc: "Never miss a new patient call. Your AI agent books appointments 24/7, handles basic questions, and sends automated confirmation texts.",
    },
    {
      icon: "📊",
      title: "Free Dental Practice Audit",
      desc: "Discover exactly how your practice shows up online versus competing dentists nearby — with a full score and priority improvement plan.",
    },
    {
      icon: "📅",
      title: "Automated Recall & Reactivation",
      desc: "Patients who haven't visited in 6+ months get automated personalized outreach — bringing back lapsed patients without any manual effort.",
    },
    {
      icon: "⭐",
      title: "Review Request Automation",
      desc: "Every patient leaving a completed visit gets a review request automatically — the fastest way to build a dominant 5-star presence.",
    },
    {
      icon: "📈",
      title: "30-Day Patient Education Calendar",
      desc: "Done-for-you dental health content for social media — building trust, educating patients, and keeping your practice top-of-mind locally.",
    },
  ],
};

const ACCENT_COLORS: Record<string, string> = {
  plumbing:
    "from-blue-600/20 to-sky-500/10 border-blue-500/30 shadow-blue-900/20",
  "med-spa":
    "from-purple-600/20 to-pink-500/10 border-purple-500/30 shadow-purple-900/20",
  hvac: "from-orange-600/20 to-amber-500/10 border-orange-500/30 shadow-orange-900/20",
  restoration:
    "from-emerald-600/20 to-cyan-500/10 border-emerald-500/30 shadow-emerald-900/20",
  "carpet-cleaning":
    "from-teal-600/20 to-indigo-500/10 border-teal-500/30 shadow-teal-900/20",
  roofing:
    "from-red-600/20 to-orange-500/10 border-red-500/30 shadow-red-900/20",
  "real-estate":
    "from-cyan-600/20 to-emerald-500/10 border-cyan-500/30 shadow-cyan-900/20",
  mortgage:
    "from-indigo-600/20 to-blue-500/10 border-indigo-500/30 shadow-indigo-900/20",
  chiropractor:
    "from-emerald-600/20 to-teal-500/10 border-emerald-500/30 shadow-emerald-900/20",
  dental:
    "from-blue-600/20 to-cyan-500/10 border-blue-500/30 shadow-blue-900/20",
};

const ICON_COLORS: Record<string, string> = {
  plumbing: "bg-blue-500/20 ring-1 ring-blue-500/40",
  "med-spa": "bg-purple-500/20 ring-1 ring-purple-500/40",
  hvac: "bg-orange-500/20 ring-1 ring-orange-500/40",
  restoration: "bg-emerald-500/20 ring-1 ring-emerald-500/40",
  "carpet-cleaning": "bg-teal-500/20 ring-1 ring-teal-500/40",
  roofing: "bg-red-500/20 ring-1 ring-red-500/40",
  "real-estate": "bg-cyan-500/20 ring-1 ring-cyan-500/40",
  mortgage: "bg-indigo-500/20 ring-1 ring-indigo-500/40",
  chiropractor: "bg-emerald-500/20 ring-1 ring-emerald-500/40",
  dental: "bg-blue-500/20 ring-1 ring-blue-500/40",
};

interface NicheWhatsIncludedSectionProps {
  nicheKey: string;
  nicheName: string;
}

export default function NicheWhatsIncludedSection({
  nicheKey,
  nicheName,
}: NicheWhatsIncludedSectionProps) {
  const cards = CARDS[nicheKey] ?? CARDS.plumbing;
  const accentClass = ACCENT_COLORS[nicheKey] ?? ACCENT_COLORS.plumbing;
  const iconClass = ICON_COLORS[nicheKey] ?? ICON_COLORS.plumbing;

  return (
    <section className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            Everything Included — Free to Start
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Here's what comes with your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              {nicheName} business app
            </span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Everything you need to book more jobs, rank higher, and grow —
            already built for your industry. Use your existing website or the
            one we built for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`bg-gradient-to-br ${accentClass} bg-slate-900 border rounded-2xl p-6 shadow-lg`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${iconClass} flex items-center justify-center text-2xl mb-4`}
              >
                {card.icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2 leading-snug">
                {card.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
