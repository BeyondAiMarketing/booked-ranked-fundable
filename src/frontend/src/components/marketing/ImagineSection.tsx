import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface ImagineLine {
  text: string;
  image?: string;
  alt?: string;
  demoCta?: string;
}

const DEFAULT_LINES: ImagineLine[] = [
  {
    text: "every inbound call, text, and inquiry automatically booked on your calendar \u2014 without you lifting a finger.",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    alt: "Google Calendar scheduling and appointment booking",
    demoCta: "See how the AI answers it — Watch Live Demo",
  },
  {
    text: "every satisfied customer automatically receiving a review request the moment the job is done.",
    image:
      "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=800&q=80",
    alt: "Customer giving a 5-star review on their smartphone",
    demoCta: "Watch it send automatically — See the Demo",
  },
  {
    text: "your Google rankings always protected, monitored, and climbing \u2014 on autopilot.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    alt: "Analytics and SEO rankings chart trending upward",
    demoCta: "See your audit score live",
  },
  {
    text: "having the business credit and fundability that 97% of businesses never build \u2014 and the financing options that come with it.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    alt: "Business finance and credit building dashboard",
    demoCta: "Watch 90 days of credit building in 3 minutes",
  },
];

interface ImagineSectionProps {
  lines?: (string | ImagineLine)[];
}

function normalizeLine(line: string | ImagineLine): ImagineLine {
  if (typeof line === "string") {
    return { text: line };
  }
  return line;
}

export default function ImagineSection({
  lines = DEFAULT_LINES,
}: ImagineSectionProps) {
  const normalized = lines.map(normalizeLine);

  return (
    <section className="py-20 px-6 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Picture This
          </div>
        </motion.div>

        <div className="space-y-20">
          {normalized.map((line, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={line.text}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-12 items-center`}
              >
                {/* Text side */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl md:text-3xl font-bold text-indigo-400 leading-tight shrink-0">
                      Imagine
                    </span>
                    <span className="text-2xl md:text-3xl font-semibold text-white leading-tight">
                      {line.text}
                    </span>
                  </div>
                  {/* Contextual demo nudge */}
                  {line.demoCta && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 + 0.25 }}
                      className="mt-5"
                    >
                      <Link
                        to="/demo"
                        data-ocid={`imagine.demo_nudge.${i + 1}`}
                        className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors duration-200 group"
                      >
                        {line.demoCta}
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-0.5 transition-transform duration-200"
                        />
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Image side */}
                {line.image && (
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 24 : -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 + 0.15 }}
                    className="w-full md:w-[45%] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-950/50"
                  >
                    <img
                      src={line.image}
                      alt={line.alt ?? ""}
                      loading="lazy"
                      className="w-full object-cover h-56 md:h-64"
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: normalized.length * 0.12 + 0.2,
          }}
          className="mt-14 pt-10 border-t border-white/10 text-center"
        >
          <p className="text-xl md:text-2xl font-bold text-white">
            That&apos;s not a vision.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              That&apos;s what Booked, Ranked &amp; Fundable turns on for your
              business.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
