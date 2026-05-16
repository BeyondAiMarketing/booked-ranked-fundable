import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { motion } from "motion/react";

const PLANS = [
  {
    name: "Booked",
    price: "$497",
    onboarding: "$1,588",
    description: "Capture more leads and never miss a booking.",
    features: [
      "AI-powered front desk (24/7)",
      "Lead CRM and pipeline management",
      "Automated inquiry follow-up",
      "Review request system",
      "Basic local SEO audit",
      "Email and SMS notifications",
      "Standard onboarding support",
    ],
    featured: false,
    cta: "Get Free Audit",
  },
  {
    name: "Booked & Ranked",
    price: "$997",
    onboarding: "$2,588",
    description: "Capture more leads and dominate your local search results.",
    features: [
      "Everything in Booked",
      "Full local SEO audit and optimization",
      "Google Maps ranking improvements",
      "Review monitoring and automation",
      "Reputation management dashboard",
      "Citation consistency tracking",
      "Monthly performance reports",
      "Priority onboarding and support",
    ],
    featured: true,
    cta: "Get Free Audit",
  },
  {
    name: "Booked, Ranked & Fundable",
    price: "$1,997",
    onboarding: "$3,588",
    description:
      "The complete growth system — leads, rankings, and funding readiness.",
    features: [
      "Everything in Booked & Ranked",
      "Fundability score and roadmap",
      "Business credit assessment",
      "Loan-readiness evaluation",
      "Capital access guidance",
      "Dedicated growth strategist",
      "Custom reporting and analytics",
      "White-glove onboarding",
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
          className="text-center mb-14"
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
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-200 pb-1">/month</span>
                </div>
                <p className="text-xs text-slate-200">
                  + {plan.onboarding} one-time setup, integrations &amp;
                  configuration
                </p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      className="text-indigo-400 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-slate-200">{feature}</span>
                  </li>
                ))}
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

        <p className="text-center text-slate-200 text-sm mt-8">
          Need a custom solution for your agency or enterprise?{" "}
          <button
            type="button"
            className="text-indigo-400 hover:text-indigo-300 transition-colors underline"
            onClick={() => {
              const el = document.getElementById("audit-form");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Contact us
          </button>{" "}
          for tailored pricing.
        </p>
      </div>
    </section>
  );
}
