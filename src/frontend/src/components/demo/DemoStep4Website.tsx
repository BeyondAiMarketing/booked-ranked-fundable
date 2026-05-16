// DemoStep4Website — Before/After website reveal with 3D card flip animation
// Framework: Deiss (before/after/bridge — transformation contrast)

import { NICHE_TESTIMONIALS, NICHE_WEBSITE_DATA } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function DemoStep4Website() {
  const { businessName, niche, completeStep } = useDemoFlow();
  const biz = businessName || "Your Business";
  const nicheKey = (niche || "plumber") as keyof typeof NICHE_WEBSITE_DATA;
  const data = NICHE_WEBSITE_DATA[nicheKey] ?? NICHE_WEBSITE_DATA.plumber;
  const testimonials =
    NICHE_TESTIMONIALS[nicheKey] ?? NICHE_TESTIMONIALS.plumber;
  const testimonial = testimonials[0];

  const [flipped, setFlipped] = useState(false);
  const [showTestimonial, setShowTestimonial] = useState(false);

  const handleReveal = () => {
    setFlipped(true);
    setTimeout(() => {
      setShowTestimonial(true);
      completeStep();
    }, 900);
  };

  return (
    <div
      className="flex flex-col items-center gap-8"
      data-ocid="demo.step4.section"
    >
      {/* Header */}
      <div className="text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "oklch(0.58 0.22 290)" }}
        >
          Before &amp; After BRF
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Your Website — Already Built
        </h2>
        <p className="mt-2 text-sm" style={{ color: "oklch(0.65 0.02 280)" }}>
          Click to reveal your BRF-built website. Zero setup required.
        </p>
      </div>

      {/* Card flip container */}
      <div
        className="w-full max-w-2xl"
        style={{ perspective: "1200px" }}
        data-ocid="demo.step4.website_reveal"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          {/* BEFORE card */}
          <motion.div
            animate={{ opacity: flipped ? 0.5 : 1, scale: flipped ? 0.97 : 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: "oklch(0.12 0.014 280)",
              border: "1px solid oklch(1 0 0 / 8%)",
            }}
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "oklch(0.09 0.01 280)",
                border: "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              <div
                className="flex items-center gap-1.5 px-3 py-2 border-b"
                style={{ borderColor: "oklch(1 0 0 / 6%)" }}
              >
                {[
                  "oklch(0.72 0.18 25)",
                  "oklch(0.72 0.18 75)",
                  "oklch(0.62 0.18 155)",
                ].map((c) => (
                  <div
                    key={c}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: c, opacity: 0.5 }}
                  />
                ))}
                <div
                  className="ml-2 flex-1 rounded px-2 py-0.5 text-[10px]"
                  style={{
                    background: "oklch(0.15 0.012 280)",
                    color: "oklch(0.4 0.02 280)",
                  }}
                >
                  {biz.toLowerCase().replace(/\s+/g, "")}.com
                </div>
              </div>
              <div className="p-3 space-y-2">
                <div
                  className="h-12 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "oklch(0.18 0.01 280)",
                    color: "oklch(0.45 0.02 280)",
                  }}
                >
                  {biz.toUpperCase().substring(0, 20)}
                </div>
                <div
                  className="h-4 rounded"
                  style={{ background: "oklch(0.16 0.01 280)", width: "70%" }}
                />
                <div
                  className="h-3 rounded"
                  style={{ background: "oklch(0.14 0.01 280)", width: "55%" }}
                />
                <div
                  className="h-8 rounded mt-2"
                  style={{ background: "oklch(0.16 0.01 280)" }}
                />
              </div>
            </div>
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  background: "oklch(0.6 0.22 25 / 15%)",
                  color: "oklch(0.78 0.18 25)",
                }}
              >
                Before BRF
              </span>
              <p className="mt-2 text-xs font-semibold text-white/50">
                {data.before.title}
              </p>
              <ul className="mt-2 space-y-1.5">
                {data.before.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "oklch(0.5 0.02 280)" }}
                  >
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* AFTER card — flips in */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ minHeight: 300 }}
          >
            <AnimatePresence>
              {!flipped && (
                <motion.div
                  key="locked"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-20 cursor-pointer"
                  style={{
                    background: "oklch(0.14 0.016 285 / 92%)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid oklch(0.58 0.22 290 / 35%)",
                  }}
                  onClick={handleReveal}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.52 0.24 295))",
                      boxShadow: "0 0 32px oklch(0.58 0.22 290 / 40%)",
                    }}
                  >
                    <span className="text-2xl">✨</span>
                  </div>
                  <button
                    type="button"
                    data-ocid="demo.step4.reveal_button"
                    className="px-6 py-3 rounded-xl font-bold text-sm text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.52 0.24 295))",
                      boxShadow: "0 8px 20px oklch(0.58 0.22 290 / 40%)",
                    }}
                  >
                    See Your New Website
                  </button>
                  <p
                    className="mt-2 text-xs"
                    style={{ color: "oklch(0.55 0.02 280)" }}
                  >
                    Built for {biz}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={{
                opacity: flipped ? 1 : 0.3,
                scale: flipped ? 1 : 0.96,
              }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-2xl p-5 space-y-4"
              style={{
                background: "oklch(0.14 0.016 285)",
                border: `1px solid ${flipped ? "oklch(0.58 0.22 290 / 50%)" : "oklch(0.58 0.22 290 / 15%)"}`,
                boxShadow: flipped
                  ? "0 0 32px oklch(0.58 0.22 290 / 20%)"
                  : "none",
              }}
            >
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "oklch(0.09 0.01 280)",
                  border: "1px solid oklch(0.58 0.22 290 / 25%)",
                }}
              >
                <div
                  className="flex items-center gap-1.5 px-3 py-2 border-b"
                  style={{ borderColor: "oklch(0.58 0.22 290 / 20%)" }}
                >
                  {[
                    "oklch(0.72 0.18 25)",
                    "oklch(0.72 0.18 75)",
                    "oklch(0.62 0.18 155)",
                  ].map((c) => (
                    <div
                      key={c}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: c }}
                    />
                  ))}
                  <div
                    className="ml-2 flex-1 rounded px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: "oklch(0.58 0.22 290 / 15%)",
                      color: "oklch(0.75 0.14 290)",
                    }}
                  >
                    bookedrankedfunded.org/{nicheKey}
                  </div>
                </div>
                <div
                  className="p-3 space-y-2"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.12 0.016 285), oklch(0.1 0.012 280))",
                  }}
                >
                  <div
                    className="py-2 px-3 rounded-lg flex items-center gap-2"
                    style={{ background: "oklch(0.58 0.22 290 / 15%)" }}
                  >
                    <span className="text-xs font-black text-white truncate">
                      {biz}
                    </span>
                    <span className="ml-auto text-[10px] text-amber-400">
                      ★★★★★
                    </span>
                  </div>
                  <div
                    className="h-3 rounded"
                    style={{
                      background: "oklch(0.58 0.22 290 / 20%)",
                      width: "80%",
                    }}
                  />
                  <div
                    className="h-3 rounded"
                    style={{
                      background: "oklch(0.58 0.22 290 / 12%)",
                      width: "60%",
                    }}
                  />
                  <div
                    className="h-7 rounded-lg mt-1 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "oklch(0.58 0.22 290)" }}
                  >
                    Book Now — AI Agent Active
                  </div>
                </div>
              </div>
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{
                    background: "oklch(0.62 0.18 155 / 15%)",
                    color: "oklch(0.78 0.14 155)",
                  }}
                >
                  After BRF
                </span>
                <p className="mt-2 text-xs font-semibold text-white">
                  {data.after.title.replace("[businessName]", biz)}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {data.after.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 text-xs text-white/70"
                    >
                      <span
                        style={{ color: "oklch(0.62 0.18 155)" }}
                        className="flex-shrink-0"
                      >
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonial slides in after flip */}
      <AnimatePresence>
        {showTestimonial && testimonial && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg rounded-2xl p-5 space-y-3"
            style={{
              background: "oklch(0.12 0.014 280)",
              border: "1px solid oklch(0.58 0.22 290 / 20%)",
            }}
            data-ocid="demo.step4.testimonial"
          >
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-amber-400 text-sm">
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-white/80 leading-relaxed italic">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">
                  {testimonial.business}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.02 280)" }}
                >
                  {testimonial.location}
                </p>
              </div>
              <div
                className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{
                  background: "oklch(0.62 0.18 155 / 12%)",
                  color: "oklch(0.78 0.14 155)",
                  border: "1px solid oklch(0.62 0.18 155 / 25%)",
                }}
              >
                {testimonial.result}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
