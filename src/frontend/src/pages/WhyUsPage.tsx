import PublicFooter from "@/components/PublicFooter";
import PublicNav from "@/components/PublicNav";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Database,
  DollarSign,
  Globe,
  Lock,
  Shield,
  Target,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const BLOCKCHAIN_TILES = [
  {
    icon: Shield,
    title: "Certified Data",
    desc: "Every record is cryptographically signed. No one can fake your scores.",
  },
  {
    icon: Globe,
    title: "Decentralized Infrastructure",
    desc: "No single point of failure. Always online, always accessible.",
  },
  {
    icon: Code2,
    title: "Transparent Canister Logic",
    desc: "Our smart contracts are publicly auditable on the ICP network.",
  },
  {
    icon: Database,
    title: "True Data Ownership",
    desc: "Your business data belongs to you — secured on-chain, forever.",
  },
];

const COMPARISON = [
  {
    aspect: "Tool fragmentation",
    others: "5 separate subscriptions for CRM, SEO, reviews, booking, credit",
    brf: "All-in-one platform — one login, one dashboard, one price",
  },
  {
    aspect: "Data integrity",
    others: "Generic data on shared cloud servers — editable by anyone",
    brf: "Tamper-proof blockchain records — mathematically certified",
  },
  {
    aspect: "Onboarding",
    others: "DIY setup with no guidance or automation",
    brf: "Done-with-you onboarding + AI automation from day one",
  },
  {
    aspect: "Funding access",
    others: "Zero support for business credit or funding readiness",
    brf: "Full fundability roadmap with credit builder & loan-readiness",
  },
];

const PILLARS = [
  {
    icon: Target,
    gradient: "from-blue-500 to-indigo-600",
    title: "Booked",
    headline: "Your AI front desk never sleeps",
    desc: "Every lead captured, every appointment booked — automatically, 24/7. While your competitors miss calls, you're closing deals.",
  },
  {
    icon: TrendingUp,
    gradient: "from-emerald-500 to-teal-600",
    title: "Ranked",
    headline: "Own your local market",
    desc: "Reviews, SEO, citations — all managed in one place. Real audit data, real fixes, real rankings. Not guesswork.",
  },
  {
    icon: DollarSign,
    gradient: "from-purple-500 to-violet-600",
    title: "Fundable",
    headline: "Access capital when it counts",
    desc: "We're the only platform that builds your fundability score alongside your business. When growth requires capital, you're ready.",
  },
];

const TRUST_SIGNALS = [
  { icon: Users, text: "500+ Local Businesses" },
  { icon: Lock, text: "ICP Blockchain Secured" },
  { icon: Zap, text: "30-Day Average Results" },
  { icon: Check, text: "No Long-Term Contracts" },
];

export default function WhyUsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <PublicNav />

      {/* Page Hero */}
      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.2),transparent)]" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              The BRF Difference
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight max-w-3xl">
              The Platform Built Different —
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {" "}
                For Businesses That Refuse to Settle
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed mb-10">
              Three fundamental growth engines. One tamper-proof blockchain
              infrastructure. Zero compromises. This is why forward-thinking
              local businesses choose BRF over everything else.
            </p>
            <div className="flex gap-3 flex-wrap">
              {TRUST_SIGNALS.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-slate-300"
                >
                  <Icon size={14} className="text-indigo-400" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Three Pillars.
              <span className="text-indigo-400"> Zero Gaps.</span>
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">
              Most platforms pick one problem to solve. We solved all three —
              and built them to work together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map(
              ({ icon: Icon, gradient, title, headline, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-slate-800 rounded-2xl p-8 border border-white/5 hover:border-indigo-500/30 transition-colors"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow`}
                  >
                    <Icon size={26} className="text-white" />
                  </div>
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
                    {title}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {headline}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 rounded-3xl p-10 md:p-14 border border-indigo-500/20"
          >
            <div className="inline-block bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
              We Built BRF Because Local Businesses Deserve Better
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6 text-lg">
              Local service businesses — plumbers, cleaners, contractors — are
              the backbone of every community. Yet they're chronically
              underserved by technology. Overpriced tools, no integration, zero
              funding support.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              We built BRF on the Internet Computer Protocol specifically
              because transparency and data integrity aren't optional — they're
              the foundation. Your success metrics should be verifiable. Your
              data should be yours. And your path to funding should be built
              into the same platform that helps you get booked and ranked.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { stat: "3-in-1", label: "Growth platform" },
                { stat: "ICP", label: "Blockchain secured" },
                { stat: "#1", label: "In local biz growth" },
              ].map(({ stat, label }) => (
                <div key={stat} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat}</div>
                  <div className="text-sm text-slate-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blockchain Section */}
      <section className="py-20 px-6 bg-indigo-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                Why Blockchain Matters
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
                Your Data on Unbreakable
                <span className="text-indigo-400"> Infrastructure</span>
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  BRF runs on{" "}
                  <strong className="text-white">
                    Internet Computer Protocol (ICP)
                  </strong>
                  , the world's first truly decentralized cloud. Unlike AWS or
                  Google Cloud, where the company controls and can alter your
                  data, ICP uses cryptographic certification at every layer.
                </p>
                <p>
                  Every review score, audit result, and lead record is{" "}
                  <strong className="text-white">
                    mathematically certified
                  </strong>{" "}
                  — meaning it's impossible to fake, manipulate, or dispute.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                {[
                  "No data manipulation by any party — including us",
                  "Your scores are verifiable by anyone, anytime",
                  "Smart contract logic is publicly auditable",
                  "Data persists forever — no vendor lock-in",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-400 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-slate-300">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {BLOCKCHAIN_TILES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-indigo-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2 text-sm">
                    {title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-block bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              Side-by-Side
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              BRF vs. Everything Else
            </h2>
          </motion.div>

          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-800 border-b border-white/10">
              <div className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Category
              </div>
              <div className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-l border-white/10">
                Other Tools
              </div>
              <div className="px-6 py-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider border-l border-white/10">
                BRF Platform
              </div>
            </div>
            {COMPARISON.map(({ aspect, others, brf }, i) => (
              <div
                key={aspect}
                className={`grid grid-cols-3 border-b border-white/5 last:border-0 ${
                  i % 2 === 1 ? "bg-slate-800/50" : "bg-slate-800/20"
                }`}
              >
                <div className="px-6 py-5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                    {aspect}
                  </span>
                </div>
                <div className="px-6 py-5 border-l border-white/5 flex gap-2">
                  <XCircle
                    size={16}
                    className="text-red-400 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-slate-400">{others}</p>
                </div>
                <div className="px-6 py-5 border-l border-white/5 flex gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-400 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-white font-medium">{brf}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
              Ready to Join the Only Platform
              <br />
              <span className="text-indigo-400">Built for Your Growth?</span>
            </h2>
            <p className="text-slate-300 mb-10 text-lg max-w-xl mx-auto">
              Start with a free audit — see exactly where you stand today, and
              what it takes to dominate your local market tomorrow.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/login">
                <Button
                  data-ocid="why_us_page.start_trial.primary_button"
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/60 h-12 px-8 text-base"
                >
                  Start Free Trial <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/free-audit">
                <Button
                  data-ocid="why_us_page.free_audit.secondary_button"
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base"
                >
                  Get Free Audit
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
