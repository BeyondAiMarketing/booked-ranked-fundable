import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

// Maps niche page route keys to BrandKitNiche enum values
const NICHE_KEY_TO_BRAND_KIT: Record<string, string> = {
  plumbing: "plumber",
  "med-spa": "med-spa",
  hvac: "hvac",
  restoration: "restoration",
  "carpet-cleaning": "carpet-cleaning",
  roofing: "roofing",
};

interface FinalCTASectionProps {
  headline: string;
  subtext: string;
  nicheKey?: string;
}

export default function FinalCTASection({
  headline,
  subtext,
  nicheKey,
}: FinalCTASectionProps) {
  const brandKitNiche = nicheKey
    ? (NICHE_KEY_TO_BRAND_KIT[nicheKey] ?? nicheKey)
    : null;
  const brandKitHref = brandKitNiche
    ? `/brand-kit?niche=${encodeURIComponent(brandKitNiche)}`
    : "/brand-kit";

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-300">
              {headline}
            </span>
          </h2>
          <p className="text-slate-200 mb-10 max-w-xl mx-auto">{subtext}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to={brandKitHref as any}>
              <Button
                data-ocid="final_cta.primary_button"
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/60 h-12 px-8 font-semibold"
              >
                Get Free Audit <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link to={brandKitHref as any}>
              <Button
                data-ocid="final_cta.secondary_button"
                size="lg"
                variant="outline"
                className="bg-transparent border-white/25 text-white hover:bg-white/10 h-12 px-8"
              >
                Book Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
