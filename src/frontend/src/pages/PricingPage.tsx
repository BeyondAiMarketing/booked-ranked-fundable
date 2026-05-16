import { BookDemoTrigger } from "@/components/BookDemoModal";
import PublicFooter from "@/components/PublicFooter";
import PublicNav from "@/components/PublicNav";
import FAQSection from "@/components/marketing/FAQSection";
import FinalCTASection from "@/components/marketing/FinalCTASection";
import PricingSection from "@/components/marketing/PricingSection";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const PRICING_FAQS = [
  {
    question: "What's included in the onboarding fee?",
    answer:
      "The one-time onboarding fee covers full system setup, third-party integrations (Twilio, Google, CRM), initial configuration, and a done-with-you onboarding session to make sure everything is working from day one.",
  },
  {
    question: "Are there long-term contracts?",
    answer:
      "No long-term contracts. All plans are month-to-month. We'd rather earn your business every month than lock you in.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes. You can change plans at any time. Upgrades take effect immediately. Downgrades take effect at the start of your next billing cycle.",
  },
  {
    question: "What's the difference between plans?",
    answer:
      "The Booked plan focuses on lead capture and booking automation. Booked & Ranked adds full local SEO and reputation management. Booked, Ranked & Fundable adds the complete fundability system including business credit assessment and capital readiness guidance.",
  },
  {
    question: "Is there an agency or enterprise option?",
    answer:
      "Yes. If you manage multiple locations or want to white-label the platform for clients, contact us for custom agency pricing.",
  },
  {
    question: "Do I need to provide my own API keys for integrations?",
    answer:
      "Most integrations are handled through our agency-level accounts. For certain features like Google Analytics or SERP data, you may optionally connect your own accounts for richer reporting.",
  },
  {
    question: "How does the Agent Services pricing work?",
    answer:
      "Agent Services are premium managed add-ons that layer on top of your base plan. Each agent is priced as a separate monthly service. The SEO + Paid Ads Bundle saves $400/month vs. subscribing to each separately.",
  },
];

const AGENT_SERVICES = [
  {
    name: "SEO & GEO Agent",
    price: "$999",
    description:
      "Managed AI-powered SEO and local visibility. Technical SEO, GBP optimization, content recommendations, and AI search presence.",
    features: [
      "Technical SEO monitoring",
      "Google Business Profile optimization",
      "Content recommendations",
      "GEO / AI visibility support",
      "Monthly reporting",
    ],
    badge: null,
    highlight: false,
  },
  {
    name: "Paid Ads Agent",
    price: "$1,999",
    description:
      "Managed AI-powered ads service. Campaign strategy, ad copy, audience targeting, and optimization.",
    features: [
      "Campaign strategy and setup",
      "AI ad copy generation",
      "Audience targeting",
      "Budget optimization",
      "Performance reporting",
    ],
    badge: null,
    highlight: false,
  },
  {
    name: "Website Agent",
    price: "$399",
    description:
      "Managed AI-powered website growth. Content edits, CRO suggestions, landing pages, and ongoing improvements.",
    features: [
      "Homepage & service page updates",
      "CRO suggestions",
      "Landing page creation",
      "CTA improvements",
      "Copy refresh queue",
    ],
    badge: null,
    highlight: false,
  },
  {
    name: "SEO + Paid Ads Bundle",
    price: "$2,598",
    description:
      "Get both the SEO & GEO Agent and Paid Ads Agent together and save $400/month vs. subscribing separately.",
    features: [
      "Everything in SEO & GEO Agent",
      "Everything in Paid Ads Agent",
      "Cross-channel optimization",
      "Unified reporting dashboard",
      "Save $400/month",
    ],
    badge: "Best Value",
    highlight: true,
  },
];

export default function PricingPage() {
  useEffect(() => {
    document.title = "Pricing | Booked Ranked Fundable Growth Plans";
    return () => {
      document.title = "Booked Ranked Fundable";
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <PublicNav />
      <div className="pt-16">
        {/* Hero */}
        <div className="py-16 px-6 bg-gradient-to-b from-slate-950 to-slate-900 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              Simple, Transparent Pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
              Invest in Growth. Not Just Software.
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Every plan is a complete growth system — not a collection of
              features you have to figure out yourself.
            </p>
          </div>
        </div>

        <PricingSection />

        {/* Agent Services Add-ons */}
        <section className="py-20 px-6 bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-1.5 bg-purple-500/15 border border-purple-400/25 text-purple-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                <Sparkles size={11} /> Premium Managed Services
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Agent Services Add-ons
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Turn your platform into a fully managed growth operation. Each
                Agent Service adds a dedicated AI-powered team working on your
                behalf every month.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {AGENT_SERVICES.map((agent, i) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`relative rounded-2xl p-6 border flex flex-col ${
                    agent.highlight
                      ? "bg-gradient-to-b from-indigo-900/60 to-purple-900/40 border-indigo-500/40 ring-1 ring-indigo-500/20"
                      : "bg-slate-800 border-white/5"
                  }`}
                  data-ocid={`pricing.agent.item.${i + 1}`}
                >
                  {agent.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {agent.badge}
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="font-bold text-white text-base mb-1">
                      {agent.name}
                    </h3>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-3xl font-bold text-white">
                        {agent.price}
                      </span>
                      <span className="text-slate-400 pb-1 text-sm">/mo</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {agent.description}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {agent.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check
                          size={13}
                          className={`mt-0.5 flex-shrink-0 ${agent.highlight ? "text-indigo-400" : "text-emerald-400"}`}
                        />
                        <span className="text-xs text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/free-audit">
                    <Button
                      data-ocid={`pricing.agent.item.${i + 1}.primary_button`}
                      className={`w-full text-sm ${
                        agent.highlight
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-white"
                      }`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Human Oversight note */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 bg-slate-800/60 border border-white/5 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Zap size={18} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-sm mb-1">
                  Human Oversight Upgrade — Available on Any Agent
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Add a dedicated strategist for review, QA, and priority
                  support. Pricing set by admin. Available as an add-on to any
                  active Agent Service subscription.
                </p>
              </div>
              <BookDemoTrigger
                label="Ask About Pricing"
                variant="outline"
                size="sm"
                className="bg-transparent border-amber-500/40 text-amber-300 hover:bg-amber-500/10 whitespace-nowrap"
              />
            </motion.div>
          </div>
        </section>

        {/* Book Demo CTA */}
        <section className="py-16 px-6 bg-indigo-950/50 border-y border-indigo-800/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Not sure which plan is right for you?
            </h2>
            <p className="text-slate-400 mb-8">
              Book a free strategy call and we'll help you pick the right
              combination for your business and growth goals.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <BookDemoTrigger
                label="Book a Free Strategy Call"
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 px-8"
              />
              <Link to="/free-audit">
                <Button
                  data-ocid="pricing.free_audit.secondary_button"
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 h-12 px-8"
                >
                  Get Free Audit <ArrowRight size={15} className="ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <FAQSection faqs={PRICING_FAQS} headline="Pricing Questions" />
        <FinalCTASection
          headline="Ready to Start Growing?"
          subtext="Get your free audit first. We'll show you exactly what's possible for your business before you spend a dollar."
        />
      </div>
      <PublicFooter />
    </div>
  );
}
