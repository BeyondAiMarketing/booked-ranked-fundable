import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from "@tanstack/react-router";

import {
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Home,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  brokerage: string;
  city: string;
  state: string;
  role: string;
  mainGoal: string[];
  hasGBP: boolean | null;
  usesCRM: boolean | null;
  wantsFunding: boolean | null;
}

interface Scores {
  booking: number;
  ranking: number;
  reviewTrust: number;
  followUp: number;
  websiteConversion: number;
  fundingReadiness: number;
}

const AUDIENCE_CARDS = [
  {
    role: "Solo Agent",
    promise:
      "Look more professional, follow up faster, and turn more traffic into booked conversations.",
    cta: "Run Agent Demo",
  },
  {
    role: "Broker",
    promise:
      "Give your agents stronger systems, better follow-up, and a cleaner growth dashboard.",
    cta: "Run Broker Demo",
  },
  {
    role: "Real Estate Team",
    promise:
      "Centralize leads, follow-up, reviews, content, and appointment tracking.",
    cta: "Run Team Demo",
  },
  {
    role: "Luxury Agent",
    promise:
      "Create a premium online presence that matches the market you serve.",
    cta: "Run Luxury Demo",
  },
  {
    role: "Listing Agent",
    promise: "Build seller trust before the listing appointment.",
    cta: "Run Listing Demo",
  },
  {
    role: "Buyer Agent",
    promise: "Educate and convert buyers before the first showing.",
    cta: "Run Buyer Demo",
  },
  {
    role: "Investor-Friendly Agent",
    promise:
      "Create a funnel for investors, cash buyers, landlords, and repeat clients.",
    cta: "Run Investor Demo",
  },
  {
    role: "Commercial Agent",
    promise:
      "Build authority, organize deal flow, and create a more professional prospecting system.",
    cta: "Run Commercial Demo",
  },
  {
    role: "New Agent",
    promise:
      "Build credibility faster with a system that makes you look organized from day one.",
    cta: "Run New Agent Demo",
  },
];

const OFFER_STACK_ITEMS = [
  "Real Estate Website Conversion Audit",
  "Google Business Profile Ranking Review",
  "AI Lead Follow-Up System",
  "Buyer/Seller Funnel Strategy",
  "Review Generation System",
  "CRM Pipeline Setup",
  "Social Content Repurposing Plan",
  "Local SEO Page Strategy",
  "Listing Consultation Funnel",
  "Buyer Consultation Funnel",
  "Missed Call Text-Back Setup",
  "Funding Readiness Checklist",
  "Business Growth Roadmap",
  "Live Demo Buildout",
];

const FAQ_ITEMS = [
  {
    q: "I already have a website.",
    a: "Great. The question is whether it converts visitors into booked appointments and builds enough trust before the prospect contacts another agent.",
  },
  {
    q: "I already use a CRM.",
    a: "Most CRMs store leads. BRF helps activate the lead with AI follow-up, appointment workflows, ranking strategy, and better offers.",
  },
  {
    q: "I get referrals.",
    a: "Referrals still check your Google profile, your reviews, your website, and your social proof before they fully trust you.",
  },
  {
    q: "I am already with a brokerage.",
    a: "BRF can strengthen your personal brand inside your brokerage while helping you organize your own follow-up and client pipeline.",
  },
  {
    q: "I do not understand AI.",
    a: "You do not need to. The system is built to show you what to fix, what to automate, and what to improve.",
  },
  {
    q: "Can this help brokers?",
    a: "Yes. Brokers can use BRF to improve agent follow-up, recruiting, visibility, reviews, and office-wide growth systems.",
  },
  {
    q: "Does this guarantee rankings or closings?",
    a: "No. BRF does not promise guaranteed rankings, closings, or funding. It is designed to improve your systems, visibility, follow-up, and growth readiness.",
  },
];

const SCORE_COLORS: Record<string, string> = {
  booking: "#3b82f6",
  ranking: "#10b981",
  reviewTrust: "#f59e0b",
  followUp: "#8b5cf6",
  websiteConversion: "#06b6d4",
  fundingReadiness: "#f97316",
};

const AI_EXPLANATIONS: Record<string, Record<string, string>> = {
  booking: {
    default:
      "Your booking score reflects how well your current systems are designed to capture and convert leads into appointments. BRF is built to help close the gap between lead arrival and booked conversation.",
    noCRM:
      "Without a CRM, follow-up typically falls through the cracks. BRF can help you build a structured pipeline that responds to leads automatically.",
    withCRM:
      "Your CRM is a strong foundation. BRF is designed to help activate those stored leads with AI-powered follow-up and appointment workflows.",
  },
  ranking: {
    default:
      "Your local ranking score shows how visible your real estate brand is where buyers and sellers are searching. BRF is built to help improve your Google presence and local trust signals.",
    noGBP:
      "Your Google Business Profile may not be working as hard as it could. BRF is designed to help improve review velocity, local visibility, and profile completeness.",
    withGBP:
      "Having a Google Business Profile is a strong start. BRF is built to help optimize it further with more reviews, better categories, and stronger local signals.",
  },
  reviewTrust: {
    default:
      "Your review trust score reflects how much social proof is backing your real estate brand online. BRF is designed to help turn satisfied clients into visible endorsements.",
    noGBP:
      "Without an active Google profile, reviews have less impact on local trust. BRF is built to help create a review engine that works across channels.",
  },
  followUp: {
    default:
      "Follow-up speed is one of the biggest differentiators in real estate. BRF is built to help you respond faster and more consistently than the competition.",
    noCRM:
      "Without a CRM managing your pipeline, follow-up is likely manual and inconsistent. BRF is designed to automate the first several touchpoints so no lead goes cold.",
  },
  websiteConversion: {
    default:
      "Your website conversion score reflects how well your site is designed to guide visitors toward a booked conversation. BRF is built to help improve that path.",
    noWebsite:
      "Without a website, you may be missing the first place buyers and sellers look to evaluate trust. BRF is designed to help you build a high-converting online presence.",
  },
  fundingReadiness: {
    default:
      "Your funding readiness score reflects how organized and documented your real estate business looks from a growth perspective. BRF is designed to help strengthen that foundation.",
    noFunding:
      "Business fundability is a longer-term growth lever. When you are ready, BRF is built to help you organize your documentation, visibility, and credit profile.",
  },
};

function calculateScores(data: FormData): Scores {
  let booking = 60;
  let ranking = 60;
  let reviewTrust = 60;
  let followUp = 60;
  let websiteConversion = 60;
  let fundingReadiness = 60;

  if (!data.usesCRM) {
    followUp -= 18;
    booking -= 10;
  }
  if (!data.hasGBP) {
    ranking -= 18;
    reviewTrust -= 15;
  }
  if (!data.website) {
    websiteConversion -= 15;
  }
  if (!data.wantsFunding) {
    fundingReadiness -= 12;
  }

  if (data.mainGoal.includes("local ranking")) ranking += 10;
  if (data.mainGoal.includes("reviews")) reviewTrust += 10;
  if (
    data.mainGoal.includes("buyers") ||
    data.mainGoal.includes("sellers") ||
    data.mainGoal.includes("listings")
  )
    booking += 10;
  if (data.mainGoal.includes("funding")) fundingReadiness += 10;
  if (data.mainGoal.includes("recruiting")) followUp += 5;

  const cap = (n: number) => Math.min(95, Math.max(20, n));
  return {
    booking: cap(booking),
    ranking: cap(ranking),
    reviewTrust: cap(reviewTrust),
    followUp: cap(followUp),
    websiteConversion: cap(websiteConversion),
    fundingReadiness: cap(fundingReadiness),
  };
}

function getExplanation(key: string, data: FormData): string {
  const map = AI_EXPLANATIONS[key] ?? {};
  if (key === "booking")
    return !data.usesCRM
      ? (map.noCRM ?? map.default ?? "")
      : (map.withCRM ?? map.default ?? "");
  if (key === "ranking")
    return !data.hasGBP
      ? (map.noGBP ?? map.default ?? "")
      : (map.withGBP ?? map.default ?? "");
  if (key === "reviewTrust" && !data.hasGBP)
    return map.noGBP ?? map.default ?? "";
  if (key === "followUp" && !data.usesCRM)
    return map.noCRM ?? map.default ?? "";
  if (key === "websiteConversion" && !data.website)
    return map.noWebsite ?? map.default ?? "";
  if (key === "fundingReadiness" && !data.wantsFunding)
    return map.noFunding ?? map.default ?? "";
  return map.default ?? "";
}

function ScoreBar({
  label,
  score,
  color,
  explanation,
  showExplanation,
}: {
  label: string;
  score: number;
  color: string;
  explanation: string;
  showExplanation: boolean;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      {showExplanation && explanation ? (
        <p className="mt-1 text-xs text-white/50 italic leading-relaxed">
          {explanation}
        </p>
      ) : (
        <p className="mt-1 text-xs text-white/30 italic">Analyzing...</p>
      )}
    </div>
  );
}

export default function RealEstatePage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    website: "",
    brokerage: "",
    city: "",
    state: "",
    role: "",
    mainGoal: [],
    hasGBP: null,
    usesCRM: null,
    wantsFunding: null,
  });
  const [scores, setScores] = useState<Scores | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    document.title =
      "AI Growth System for Real Estate Agents & Brokers | Booked Ranked & Fundable";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Booked Ranked & Fundable helps real estate agents and brokers improve appointment booking, local visibility, reviews, AI follow-up, and business growth readiness. Run your live real estate demo.",
      );
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    const demoEl = demoRef.current;
    if (!heroEl || !demoEl) return;
    const heroObs = new IntersectionObserver(
      ([e]) => setShowStickyBar(!e.isIntersecting),
      { threshold: 0.1 },
    );
    const demoObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setShowStickyBar(false);
      },
      { threshold: 0.2 },
    );
    heroObs.observe(heroEl);
    demoObs.observe(demoEl);
    return () => {
      heroObs.disconnect();
      demoObs.disconnect();
    };
  }, []);

  const handleGoalToggle = (goal: string) =>
    setFormData((prev) => ({
      ...prev,
      mainGoal: prev.mainGoal.includes(goal)
        ? prev.mainGoal.filter((g) => g !== goal)
        : [...prev.mainGoal, goal],
    }));

  const handleSubmitForm = () => {
    setScores(calculateScores(formData));
    setShowExplanations(false);
    setTimeout(() => setShowExplanations(true), 1600);
  };

  const navigateToDemo = (role?: string) => {
    const r = role || selectedRole || formData.role || "";
    void navigate({
      to: "/demo" as never,
      search: {
        niche: "real-estate",
        source: "real_estate_landing_page",
      } as never,
      state: { role: r, mainGoal: formData.mainGoal } as never,
    });
  };

  const _scrollToDemo = (role?: string) => {
    if (role) {
      setFormData((prev) => ({ ...prev, role }));
      setSelectedRole(role);
    }
    demoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.008_280)] text-white font-sans overflow-x-hidden">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 pb-16 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.08_0.008_280)] via-[oklch(0.10_0.015_260)] to-[oklch(0.08_0.02_240)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
              <Home size={14} className="text-blue-400" />
              <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">
                Real Estate Growth System
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Real Estate Agents Don&apos;t Need More Random Leads. They Need a
              System That{" "}
              <span className="re-highlight-blue">
                Books, Ranks, Follows Up, and Builds Trust
              </span>{" "}
              Automatically.
            </h1>
            <p className="text-lg text-white/70 mb-4 leading-relaxed">
              Booked Ranked &amp; Fundable helps agents and brokers turn their
              website, Google profile, reviews, CRM, and follow-up into a real
              appointment-generating system.
            </p>
            <p className="text-base text-white/50 mb-8">
              See how your real estate business could look inside a system built
              to help you get booked, get ranked, and become more growth-ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button
                type="button"
                onClick={() => navigateToDemo()}
                className="re-cta-primary px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
              >
                Run My Live Real Estate Demo <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border border-white/20 hover:border-white/40 px-8 py-4 rounded-xl font-semibold text-white/80 hover:text-white transition-all"
              >
                See How It Works
              </button>
            </div>
            <p className="text-sm text-white/40">
              No obligation. See the system before you talk to anyone.
            </p>
          </div>
          <div className="re-glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-mono">
                  BRF
                </p>
                <h3
                  className="font-bold text-white"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Real Estate Growth Dashboard
                </h3>
              </div>
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 font-medium">
                ● Live
              </span>
            </div>
            {[
              { label: "Booking Score", value: 72, color: "#3b82f6" },
              { label: "Google Ranking Score", value: 58, color: "#10b981" },
              { label: "Review Trust Score", value: 65, color: "#f59e0b" },
              { label: "Follow-Up Score", value: 45, color: "#8b5cf6" },
              {
                label: "Website Conversion Score",
                value: 68,
                color: "#06b6d4",
              },
              { label: "Funding Readiness Score", value: 38, color: "#f97316" },
            ].map(({ label, value, color }) => (
              <div key={label} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-white/60">{label}</span>
                  <span className="text-xs font-bold" style={{ color }}>
                    {value}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${value}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/40">Demo Ready</span>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                Run Your Demo →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section className="py-20 px-4 bg-[oklch(0.10_0.008_280)]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            What Most Real Estate Agents Are Fighting Right Now
          </h2>
          <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto">
            If any of these feel familiar, you are not alone — and there is a
            better way to run your real estate business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                Icon: Home,
                title: "You Look Like Every Other Agent Online",
                body: "Most agent websites say the same thing: buy, sell, search homes, contact me. That does not separate you from the competition.",
              },
              {
                Icon: Target,
                title: "Your Website Is Not Converting",
                body: "Your site should pre-sell your value, capture buyer and seller intent, and guide visitors toward a booked conversation.",
              },
              {
                Icon: MapPin,
                title: "Your Google Profile Is Not Working Hard Enough",
                body: "Your reviews, map visibility, local pages, and reputation should work together as a trust engine.",
              },
              {
                Icon: Zap,
                title: "Your Leads Go Cold",
                body: "If your follow-up is slow, manual, or inconsistent, another agent can win the conversation before you respond.",
              },
              {
                Icon: Award,
                title: "You Need to Prove Your Value Earlier",
                body: "Buyers and sellers want to know why they should trust you before they sign, tour, list, or book a consultation.",
              },
              {
                Icon: BarChart3,
                title:
                  "Your Business Needs to Look Systemized and Growth-Ready",
                body: "Most marketing only chases leads. BRF helps you build a more organized, visible, and fundable real estate brand.",
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="re-glass-card rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 mb-4">
                  <Icon size={20} />
                </div>
                <h3
                  className="font-bold text-white mb-2"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRAMEWORK */}
      <section className="py-20 px-4 bg-[oklch(0.08_0.008_280)]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            The Booked, Ranked &amp; Fundable Real Estate Growth System
          </h2>
          <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto">
            Three connected pillars designed to help your real estate business
            generate appointments, build trust, and look growth-ready.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="re-glass-card rounded-2xl p-6 border-t-4 border-blue-500">
              <div
                className="text-blue-400 font-extrabold text-2xl mb-2"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Booked
              </div>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                Turn website visitors, open house contacts, referral traffic,
                and cold leads into real appointments.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "AI follow-up",
                  "Missed-call text-back",
                  "Buyer/seller intake",
                  "Calendar booking",
                  "CRM pipeline",
                  "Open house follow-up",
                  "Listing consultation funnel",
                  "Buyer consultation funnel",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <CheckCircle size={14} className="text-blue-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="bg-white/5 rounded-lg p-3 text-xs text-white/50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  Lead arrives
                </div>
                <div className="ml-1 border-l border-white/10 pl-3 py-1">
                  AI responds in 60s
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={10} className="text-blue-300" />
                  Appointment booked
                </div>
              </div>
            </div>
            <div className="re-glass-card rounded-2xl p-6 border-t-4 border-emerald-500">
              <div
                className="text-emerald-400 font-extrabold text-2xl mb-2"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Ranked
              </div>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                Help your real estate brand show up where buyers and sellers are
                already searching.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Google Business Profile optimization",
                  "Local SEO",
                  "Neighborhood landing pages",
                  "Review generation",
                  "Reputation management",
                  "Listing content",
                  "Map visibility strategy",
                  "Local trust-building",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <CheckCircle
                      size={14}
                      className="text-emerald-400 shrink-0"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="bg-white/5 rounded-lg p-3 text-xs text-white/50">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin size={10} className="text-emerald-400" />
                  Local Pack Position
                </div>
                <div className="flex gap-1 mt-1">
                  {["#1", "#2", "#3"].map((n) => (
                    <span
                      key={n}
                      className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded"
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span>4.9 · 84 reviews</span>
                </div>
              </div>
            </div>
            <div className="re-glass-card rounded-2xl p-6 border-t-4 border-yellow-500">
              <div
                className="text-yellow-400 font-extrabold text-2xl mb-2"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Fundable
              </div>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                Build the business structure, documentation, and growth story
                that makes your real estate business look more organized and
                expansion-ready.
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Funding readiness checklist",
                  "Business credit checklist",
                  "Revenue documentation",
                  "Business profile improvement",
                  "CRM reporting",
                  "Growth roadmap",
                  "Offer positioning",
                  "Systems-based operations",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <CheckCircle
                      size={14}
                      className="text-yellow-400 shrink-0"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="bg-white/5 rounded-lg p-3 text-xs text-white/50 mb-3">
                {[
                  { label: "Business Docs", pct: 70 },
                  { label: "Credit Profile", pct: 45 },
                  { label: "Revenue Records", pct: 60 },
                ].map(({ label, pct }) => (
                  <div key={label} className="mb-1.5">
                    <div className="flex justify-between mb-0.5">
                      <span>{label}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-yellow-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/30 leading-relaxed">
                Funding is not guaranteed. Approval depends on lender
                requirements, revenue, credit profile, documentation, and
                business history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section
        ref={demoRef}
        id="live-demo"
        className="py-20 px-4 bg-[oklch(0.10_0.008_280)]"
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            See What Your Real Estate Business Looks Like Inside BRF
          </h2>
          <p className="text-center text-white/50 mb-10">
            Enter your business information and watch the live demo show how
            your brand could be turned into a booked, ranked, and fundable real
            estate growth system.
          </p>
          {!scores ? (
            <div className="re-glass-card rounded-2xl p-8">
              {formStep === 1 && (
                <div>
                  <p className="text-sm text-white/50 mb-6 font-medium uppercase tracking-wider font-mono">
                    Step 1 of 2 — Your Business Info
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      {
                        label: "Your Name",
                        field: "name",
                        placeholder: "Jane Smith",
                        type: "text",
                      },
                      {
                        label: "Email Address",
                        field: "email",
                        placeholder: "jane@yoursite.com",
                        type: "email",
                      },
                      {
                        label: "Phone Number",
                        field: "phone",
                        placeholder: "(555) 123-4567",
                        type: "tel",
                      },
                      {
                        label: "Business Name",
                        field: "businessName",
                        placeholder: "Jane Smith Real Estate",
                        type: "text",
                      },
                      {
                        label: "Website URL",
                        field: "website",
                        placeholder: "https://yoursite.com",
                        type: "url",
                      },
                      {
                        label: "Brokerage",
                        field: "brokerage",
                        placeholder: "Keller Williams, Redfin, etc.",
                        type: "text",
                      },
                      {
                        label: "City",
                        field: "city",
                        placeholder: "Los Angeles",
                        type: "text",
                      },
                      {
                        label: "State",
                        field: "state",
                        placeholder: "CA",
                        type: "text",
                      },
                    ].map(({ label, field, placeholder, type }) => (
                      <div key={field}>
                        <label
                          htmlFor={field}
                          className="block text-xs text-white/50 mb-1"
                        >
                          {label}
                        </label>
                        <input
                          id={field}
                          type={type}
                          placeholder={placeholder}
                          value={formData[field as keyof FormData] as string}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [field]: e.target.value,
                            }))
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.name && formData.email) setFormStep(2);
                    }}
                    className="re-cta-primary w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                  >
                    Next: Personalize Your Scorecard <ArrowRight size={18} />
                  </button>
                </div>
              )}
              {formStep === 2 && (
                <div>
                  <p className="text-sm text-white/50 mb-6 font-medium uppercase tracking-wider font-mono">
                    Step 2 of 2 — Your Goals &amp; Setup
                  </p>
                  <div className="mb-5">
                    <label
                      htmlFor="role"
                      className="block text-sm text-white/70 mb-2 font-medium"
                    >
                      Your Role
                    </label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="">Select your role...</option>
                      {AUDIENCE_CARDS.map((c) => (
                        <option key={c.role} value={c.role}>
                          {c.role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-5">
                    <p className="block text-sm text-white/70 mb-2 font-medium">
                      Main Goals (select all that apply)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "buyers",
                        "sellers",
                        "listings",
                        "recruiting",
                        "investors",
                        "luxury",
                        "local ranking",
                        "reviews",
                        "funding",
                      ].map((goal) => (
                        <button
                          type="button"
                          key={goal}
                          onClick={() => handleGoalToggle(goal)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${formData.mainGoal.includes(goal) ? "bg-blue-500/20 border-blue-500/50 text-blue-300" : "border-white/10 text-white/50 hover:border-white/25"}`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {(
                      [
                        {
                          label: "Do you have a Google Business Profile?",
                          key: "hasGBP" as const,
                        },
                        {
                          label: "Do you currently use a CRM?",
                          key: "usesCRM" as const,
                        },
                        {
                          label: "Interested in business growth/fundability?",
                          key: "wantsFunding" as const,
                        },
                      ] as Array<{
                        label: string;
                        key: "hasGBP" | "usesCRM" | "wantsFunding";
                      }>
                    ).map(({ label, key }) => (
                      <div
                        key={key}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <p className="text-xs text-white/60 mb-3 leading-snug">
                          {label}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, [key]: true }))
                            }
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${formData[key] === true ? "bg-green-500/30 text-green-300 border border-green-500/50" : "bg-white/5 text-white/40 border border-white/10"}`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, [key]: false }))
                            }
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${formData[key] === false ? "bg-red-500/20 text-red-300 border border-red-500/40" : "bg-white/5 text-white/40 border border-white/10"}`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="border border-white/15 px-6 py-4 rounded-xl text-white/60 hover:text-white text-sm transition-all"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitForm}
                      className="re-cta-primary flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                    >
                      Get My Scorecard <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="re-glass-card rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className="font-extrabold text-xl"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Your BRF Real Estate Scorecard
                  </h3>
                  {formData.businessName && (
                    <p className="text-white/50 text-sm">
                      {formData.businessName} ·{" "}
                      {formData.role || "Real Estate Professional"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setScores(null);
                    setFormStep(1);
                  }}
                  className="text-white/30 hover:text-white/60 text-xs border border-white/10 px-3 py-1.5 rounded-lg transition-all"
                >
                  Retake
                </button>
              </div>
              {(
                [
                  { key: "booking" as const, label: "Booking Score" },
                  { key: "ranking" as const, label: "Google Ranking Score" },
                  { key: "reviewTrust" as const, label: "Review Trust Score" },
                  { key: "followUp" as const, label: "Follow-Up Score" },
                  {
                    key: "websiteConversion" as const,
                    label: "Website Conversion Score",
                  },
                  {
                    key: "fundingReadiness" as const,
                    label: "Funding Readiness Score",
                  },
                ] as Array<{ key: keyof Scores; label: string }>
              ).map(({ key, label }) => (
                <ScoreBar
                  key={key}
                  label={label}
                  score={scores[key]}
                  color={SCORE_COLORS[key] ?? "#3b82f6"}
                  explanation={getExplanation(key, formData)}
                  showExplanation={showExplanations}
                />
              ))}
              <div className="mt-8 border-t border-white/10 pt-6">
                <h4
                  className="font-bold mb-4 text-white/90"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Here is what BRF is designed to build for you
                </h4>
                <ul className="space-y-2 mb-6">
                  {[
                    `${formData.role === "Luxury Agent" ? "Premium authority" : formData.role === "Broker" ? "Office-wide" : "Personal"} landing page improvements designed to pre-sell your value`,
                    "AI follow-up workflow built to respond to leads before the competition does",
                    "Google ranking strategy designed to help improve local visibility and map pack placement",
                    "Review generation plan built to help turn satisfied clients into visible social proof",
                    `${formData.mainGoal.includes("sellers") || formData.role === "Listing Agent" ? "Seller" : "Buyer"} funnel designed to guide prospects toward a booked consultation`,
                    "Funding readiness next steps to help your business look more organized and growth-ready",
                  ].map((rec) => (
                    <li
                      key={rec}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <CheckCircle
                        size={14}
                        className="text-blue-400 shrink-0 mt-0.5"
                      />
                      {rec}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => navigateToDemo(formData.role)}
                  className="re-cta-primary w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  Run My Full Real Estate Demo <ArrowRight size={18} />
                </button>
                <p className="text-xs text-center text-white/30 mt-3">
                  See the system before you make a decision.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="py-20 px-4 bg-[oklch(0.08_0.008_280)]">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-12"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            From Generic Agent Website to Real Estate Growth System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/80 border border-gray-700/60 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-gray-600" />
                <span className="text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  Before BRF
                </span>
              </div>
              <ul className="space-y-3">
                {[
                  "Generic agent website",
                  "Weak CTA",
                  "No clear offer",
                  "No instant follow-up",
                  "Weak Google profile",
                  "No review engine",
                  "No buyer/seller funnel",
                  "No funding growth plan",
                  "No strong differentiation",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-gray-500"
                  >
                    <X size={14} className="text-gray-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="re-glass-card border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="re-highlight-blue font-semibold text-sm uppercase tracking-wider">
                  With BRF
                </span>
              </div>
              <ul className="space-y-3">
                {[
                  "Authority-based agent page",
                  "Buyer/seller conversion funnels",
                  "AI appointment follow-up",
                  "Google ranking strategy",
                  "Review request system",
                  "CRM pipeline",
                  "Local SEO pages",
                  "Funding readiness dashboard",
                  "Clear appointment path",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/80"
                  >
                    <CheckCircle
                      size={14}
                      className="text-yellow-400 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => navigateToDemo()}
              className="re-cta-primary px-8 py-4 rounded-xl font-bold text-base inline-flex items-center gap-2"
            >
              See Your Demo <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* AUDIENCE SELECTOR */}
      <section className="py-20 px-4 bg-[oklch(0.10_0.008_280)]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Choose Your Real Estate Growth Path
          </h2>
          <p className="text-center text-white/50 mb-12">
            Every role in real estate has different goals. Select yours to get a
            demo built specifically for your situation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AUDIENCE_CARDS.map(({ role, promise, cta }) => (
              <div
                key={role}
                className={`re-glass-card rounded-xl p-5 transition-all ${selectedRole === role ? "border border-blue-500/60 ring-1 ring-blue-500/30" : ""}`}
              >
                <h3
                  className="font-bold text-white mb-2"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {role}
                </h3>
                <p className="text-sm text-white/60 mb-4 leading-relaxed">
                  {promise}
                </p>
                <button
                  type="button"
                  onClick={() => navigateToDemo(role)}
                  className="re-cta-primary w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
                >
                  {cta} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BROKER SECTION */}
      <section className="py-20 px-4 bg-[oklch(0.08_0.008_280)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-4">
              <Building2 size={14} className="text-yellow-400" />
              <span className="text-xs text-yellow-300 uppercase tracking-wider font-medium">
                For Brokers
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-4"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Turn Your Office Into a Smarter Growth Machine
            </h2>
            <p className="text-white/60 mb-4 leading-relaxed">
              Your agents do not just need more leads. They need better systems,
              faster follow-up, stronger positioning, and a clearer path to
              convert opportunities.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-5">
              <p className="text-yellow-300 text-sm font-medium">
                BRF helps brokers create a smarter growth system for their
                office without rebuilding the whole brokerage.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-2 mb-6">
              {[
                "Agent lead activity dashboard",
                "Follow-up automation",
                "Review tracking",
                "Google profile strategy",
                "Recruiting funnel",
                "Agent landing pages",
                "CRM pipeline visibility",
                "Office-wide AI assistant",
                "Local ranking improvement plan",
                "Funding and growth readiness view",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-1.5 text-xs text-white/65"
                >
                  <CheckCircle size={12} className="text-yellow-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => navigateToDemo("Broker")}
              className="re-cta-gold px-8 py-4 rounded-xl font-bold text-base inline-flex items-center gap-2"
            >
              Run Broker Demo <ArrowRight size={16} />
            </button>
          </div>
          <div className="re-glass-card rounded-2xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3 font-mono">
              Broker Command Center
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-400">12</p>
                <p className="text-xs text-white/40 mt-1">Active Agents</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-emerald-400">24</p>
                <p className="text-xs text-white/40 mt-1">Pipeline Leads</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-400">#3</p>
                <p className="text-xs text-white/40 mt-1">Local Rank</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: "Agent — Rodriguez",
                  status: "Active",
                  color: "text-green-400",
                },
                {
                  name: "Agent — Thompson",
                  status: "Follow-up pending",
                  color: "text-yellow-400",
                },
                {
                  name: "Agent — Kim",
                  status: "New lead",
                  color: "text-blue-400",
                },
              ].map(({ name, status, color }) => (
                <div
                  key={name}
                  className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                >
                  <span className="text-xs text-white/70">{name}</span>
                  <span className={`text-xs ${color}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AGENT SECTION */}
      <section className="py-20 px-4 bg-[oklch(0.10_0.008_280)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="re-glass-card rounded-2xl p-5 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                JS
              </div>
              <div>
                <p className="font-semibold text-sm text-white">
                  Jane Smith Real Estate
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={10}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                  <span className="text-xs text-white/50 ml-1">
                    4.9 · 127 reviews
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-3">
              <p className="text-xs text-white/50 mb-1">AI Text Follow-Up</p>
              <p className="text-sm text-white/80">
                &quot;Hi Michael, your AI front desk just booked a consultation
                for Tuesday at 2pm. Looking forward to it!&quot;
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
              <Calendar size={18} className="text-blue-400" />
              <div>
                <p className="text-xs text-white/40">Booked Appointment</p>
                <p className="text-sm font-semibold text-white">
                  Buyer Consultation · Tue 2:00 PM
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-4">
              <Users size={14} className="text-blue-400" />
              <span className="text-xs text-blue-300 uppercase tracking-wider font-medium">
                For Agents
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-4"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Stop Looking Like Everyone Else Online
            </h2>
            <p className="text-white/60 mb-5 leading-relaxed">
              We help you look like the obvious trusted choice before a buyer or
              seller ever speaks to you.
            </p>
            <ul className="grid grid-cols-2 gap-2 mb-6">
              {[
                "Personal brand landing page",
                "Listing consultation funnel",
                "Buyer education funnel",
                "AI text follow-up",
                "Missed-call response",
                "Google profile upgrade",
                "Review request automation",
                "Social proof layout",
                "CRM follow-up",
                "Appointment booking flow",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-1.5 text-xs text-white/65"
                >
                  <CheckCircle size={12} className="text-blue-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => navigateToDemo("Solo Agent")}
              className="re-cta-primary px-8 py-4 rounded-xl font-bold text-base inline-flex items-center gap-2"
            >
              Run Agent Demo <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* OFFER STACK */}
      <section className="py-20 px-4 bg-[oklch(0.08_0.008_280)]">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            What Your Real Estate Growth System Includes
          </h2>
          <p className="text-center text-white/50 mb-10">
            Everything is connected. Every piece is designed to work together.
          </p>
          <div className="space-y-3 mb-8">
            {OFFER_STACK_ITEMS.map((item, i) => (
              <div
                key={item}
                className="re-glass-card rounded-xl px-5 py-4 flex items-center gap-4"
              >
                <div className="w-7 h-7 rounded-full bg-yellow-500/15 flex items-center justify-center text-yellow-400 font-bold text-xs shrink-0">
                  {i + 1}
                </div>
                <span className="text-white/85 font-medium text-sm">
                  {item}
                </span>
                <CheckCircle
                  size={16}
                  className="text-yellow-400 ml-auto shrink-0"
                />
              </div>
            ))}
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 text-center mb-8">
            <p className="text-white/70 leading-relaxed">
              Most agencies only talk about leads. BRF helps you build the
              system behind the lead: booking, ranking, follow-up, trust, and
              growth readiness.
            </p>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigateToDemo()}
              className="re-cta-primary px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2"
            >
              See My Demo <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="py-20 px-4 bg-[oklch(0.10_0.008_280)]"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-12"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            How BRF Works for Real Estate Professionals
          </h2>
          <div className="relative">
            <div className="hidden lg:block absolute left-7 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500/40 via-blue-500/20 to-transparent" />
            <div className="space-y-8">
              {[
                {
                  n: 1,
                  title: "Run the Live Demo",
                  body: "Enter your business name, website, or brokerage and see your real estate growth gaps.",
                },
                {
                  n: 2,
                  title: "See Your BRF Scorecard",
                  body: "Review your booking, ranking, trust, follow-up, and funding readiness scores.",
                },
                {
                  n: 3,
                  title: "Preview the System",
                  body: "See how your landing page, AI follow-up, review flow, and local ranking plan could work.",
                },
                {
                  n: 4,
                  title: "Book Your Strategy Call",
                  body: "Talk through the best path for your real estate business.",
                },
                {
                  n: 5,
                  title: "Launch Your Growth System",
                  body: "Build the assets, automations, and workflows that help you move faster.",
                },
              ].map(({ n, title, body }) => (
                <div key={n} className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-extrabold text-xl shrink-0 relative z-10">
                    {n}
                  </div>
                  <div className="pt-3">
                    <h3
                      className="font-bold text-white mb-1"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-20 px-4 bg-[oklch(0.08_0.008_280)]">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-10"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Built for the Way Real Estate Actually Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              {
                Icon: Shield,
                text: "Built for agents and brokers, not generic businesses",
              },
              {
                Icon: Calendar,
                text: "Designed around appointment booking, reviews, local ranking, and follow-up",
              },
              {
                Icon: Users,
                text: "Supports buyer, seller, listing, and brokerage workflows",
              },
              {
                Icon: MessageSquare,
                text: "Uses AI to support the process, not replace the agent",
              },
              {
                Icon: BarChart3,
                text: "Helps organize the business so it looks more professional and growth-ready",
              },
              {
                Icon: Star,
                text: "Designed to improve trust before the first conversation",
              },
            ].map(({ Icon, text }) => (
              <div
                key={text}
                className="re-glass-card rounded-xl p-4 flex items-start gap-3"
              >
                <div className="text-blue-400 shrink-0 mt-0.5">
                  <Icon size={18} />
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "AI Follow-Up",
              "Local SEO",
              "Review Engine",
              "CRM Pipeline",
              "Funding Readiness",
              "Live Demo",
            ].map((badge) => (
              <span
                key={badge}
                className="bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-medium px-4 py-2 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-[oklch(0.10_0.008_280)]">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-10"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Common Questions From Agents and Brokers
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <div key={q} className="re-glass-card rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-white text-sm pr-4">
                    {q}
                  </span>
                  {openFAQ === i ? (
                    <ChevronUp size={16} className="text-blue-400 shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-white/40 shrink-0" />
                  )}
                </button>
                {openFAQ === i && (
                  <div className="px-6 pb-5 border-t border-white/5">
                    <p className="text-sm text-white/60 leading-relaxed pt-4">
                      {a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-[oklch(0.08_0.008_280)] to-[oklch(0.10_0.015_250)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-5xl font-extrabold mb-5 leading-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Real Estate Has Changed.
            <br />
            <span className="re-highlight-blue">
              Your Marketing System Should Too.
            </span>
          </h2>
          <p className="text-lg text-white/60 mb-8 leading-relaxed">
            See how Booked Ranked &amp; Fundable can help your real estate
            business get more booked, more visible, and more growth-ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              type="button"
              onClick={() => navigateToDemo()}
              className="re-cta-primary px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              Run My Live Real Estate Demo <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={() =>
                void navigate({
                  to: "/demo" as never,
                  search: {
                    niche: "real-estate",
                    source: "real_estate_strategy_call",
                  } as never,
                })
              }
              className="border border-white/20 hover:border-white/40 px-10 py-4 rounded-xl font-semibold text-white/80 hover:text-white transition-all"
            >
              Book a Strategy Call
            </button>
          </div>
          <p className="text-sm text-white/35">
            Built for agents and brokers who want more than a website — they
            want a real growth system.
          </p>
        </div>
      </section>

      {/* STICKY BAR */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="bg-[oklch(0.10_0.012_270)]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white">
              Real Estate Growth System
            </p>
            <p className="text-xs text-white/40">
              See what BRF can build for your business
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigateToDemo()}
              className="re-cta-primary flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              Run My Real Estate Demo <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => setShowStickyBar(false)}
              className="text-white/40 hover:text-white transition-all px-2"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
