import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";

type Plan = {
  name: string;
  price: string;
  setup: string;
  description: string;
  features: string[];
  featured: boolean;
  cta: string;
};

const PLANS: Plan[] = [
  {
    name: "Booked AI Starter",
    price: "$697/mo",
    setup: "$2,497 setup",
    description: "Entry-level stop-missing-calls package.",
    features: [
      "AI front desk",
      "Missed-call text-back",
      "Lead CRM",
      "Inquiry follow-up",
      "Review request system",
      "Email/SMS notifications",
      "Basic local SEO audit",
      "Standard onboarding",
    ],
    featured: false,
    cta: "Get Free Audit",
  },
  {
    name: "Booked & Ranked Growth",
    price: "$1,797/mo",
    setup: "$4,997 setup",
    description: "Main package — most popular.",
    features: [
      "Everything in Booked AI Starter, plus:",
      "Google Business Profile optimization",
      "Review automation",
      "Reputation dashboard",
      "Citation tracking",
      "Google Maps improvement plan",
      "Local SEO cleanup",
      "Monthly ranking/reporting",
      "Priority onboarding",
    ],
    featured: true,
    cta: "Get Free Audit",
  },
  {
    name: "Booked, Ranked & Fundable Pro",
    price: "$3,497/mo",
    setup: "$7,997 setup",
    description: "Full system.",
    features: [
      "Everything in Booked & Ranked Growth, plus:",
      "Fundability score",
      "Business credit assessment",
      "Loan-readiness evaluation",
      "Capital access roadmap",
      "Dedicated strategist",
      "Custom reporting",
      "Advanced analytics",
      "White-glove onboarding",
      "Quarterly growth planning",
    ],
    featured: false,
    cta: "Get Free Audit",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-6 bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-block bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            Growth Plans
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your Growth Level
          </h2>
          <p className="text-slate-200 max-w-xl mx-auto">
            Every plan includes setup, integrations, and configuration — plus
            ongoing support to make sure it works.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-center"
          data-ocid="pricing.founders_banner"
        >
          <div className="w-full max-w-3xl rounded-xl border border-indigo-400/25 bg-indigo-500/10 backdrop-blur-md px-5 py-3.5 flex items-center gap-3">
            <Sparkles
              size={18}
              className="text-indigo-300 flex-shrink-0"
              aria-hidden
            />
            <p className="text-sm md:text-base text-indigo-100 font-medium text-center flex-1">
              Founders pricing available for the first 5 businesses while we
              build case studies.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative bg-slate-800 rounded-2xl p-7 border flex flex-col ${
                plan.featured
                  ? "border-indigo-500/50 ring-2 ring-indigo-500/20"
                  : "border-white/5"
              }`}
              data-ocid={`pricing.item.${i + 1}`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-white text-lg mb-1">
                  {plan.name}
                </h3>
                <p className="text-slate-200 text-sm mb-5">
                  {plan.description}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  + {plan.setup} one-time
                </p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => {
                  const isHeader = feature.endsWith(":");
                  return (
                    <li
                      key={feature}
                      className={`flex items-start gap-2.5 ${
                        isHeader ? "pt-1" : ""
                      }`}
                    >
                      <Check
                        size={15}
                        className={`mt-0.5 flex-shrink-0 ${
                          isHeader ? "text-indigo-300" : "text-indigo-400"
                        }`}
                        aria-hidden
                      />
                      <span
                        className={`text-sm ${
                          isHeader
                            ? "text-white font-semibold"
                            : "text-slate-200"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Link to="/free-audit">
                <Button
                  data-ocid={`pricing.item.${i + 1}.primary_button`}
                  className={`w-full ${
                    plan.featured
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-slate-300 text-sm md:text-base mt-8 max-w-2xl mx-auto"
          data-ocid="pricing.enterprise_callout"
        >
          Need storm-season growth, outbound campaigns, or multi-location
          domination? Ask about{" "}
          <span className="text-white font-semibold">Enterprise Growth OS</span>{" "}
          starting at{" "}
          <span className="text-indigo-300 font-semibold">$5,997/month</span>.
        </motion.p>
      </div>
    </section>
  );
}
