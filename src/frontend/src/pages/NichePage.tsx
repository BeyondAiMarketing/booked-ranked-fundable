import { BookDemoModal, BookDemoTrigger } from "@/components/BookDemoModal";
import PublicFooter from "@/components/PublicFooter";
import PublicNav from "@/components/PublicNav";
import AuditFormSection from "@/components/marketing/AuditFormSection";
import CostSavingsSection from "@/components/marketing/CostSavingsSection";
import FAQSection from "@/components/marketing/FAQSection";
import FinalCTASection from "@/components/marketing/FinalCTASection";
import HeroSection from "@/components/marketing/HeroSection";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import ImagineSection from "@/components/marketing/ImagineSection";
import NicheAppPreviewSection from "@/components/marketing/NicheAppPreviewSection";
import NichePainSection from "@/components/marketing/NichePainSection";
import NicheTestimonialsSection from "@/components/marketing/NicheTestimonialsSection";
import NicheVideoTestimonialsSection from "@/components/marketing/NicheVideoTestimonialsSection";
import NicheWhatsIncludedSection from "@/components/marketing/NicheWhatsIncludedSection";
import NoOneElseSection from "@/components/marketing/NoOneElseSection";
import PricingSection from "@/components/marketing/PricingSection";
import StatCallout from "@/components/marketing/StatCallout";
import ThreeEnginesSection from "@/components/marketing/ThreeEnginesSection";
import TrustInfrastructureSection from "@/components/marketing/TrustInfrastructureSection";
import { getNicheBackground } from "@/data/nicheBackgrounds";
import { getNiche } from "@/data/nicheData";
import { useEffect, useState } from "react";

// Maps nicheKey (from nicheData) → BrandKitNiche value
const NICHE_TO_BRAND_KIT: Record<string, string> = {
  plumbing: "plumber",
  "med-spa": "med-spa",
  hvac: "hvac",
  restoration: "restoration",
  "carpet-cleaning": "carpet-cleaning",
  roofing: "roofing",
  "real-estate": "real-estate",
  mortgage: "mortgage",
  chiropractor: "chiropractor",
  dental: "dental",
};

interface NichePageProps {
  nicheKey: string;
}

export default function NichePage({ nicheKey }: NichePageProps) {
  const niche = getNiche(nicheKey);
  const nicheBg = getNicheBackground(nicheKey);
  const [bookDemoOpen, setBookDemoOpen] = useState(false);

  useEffect(() => {
    if (niche?.seo.title) {
      document.title = niche.seo.title;
    }
    return () => {
      document.title = "Booked Ranked Fundable";
    };
  }, [niche]);

  if (!niche) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p>Page not found.</p>
      </div>
    );
  }

  const brandKitNiche = NICHE_TO_BRAND_KIT[nicheKey] ?? nicheKey;
  const brandKitLink = `/brand-kit?niche=${encodeURIComponent(brandKitNiche)}`;

  // New app-first headline format
  const appHeadline = `Get Your Own ${niche.name} Business App — Use Your Existing Website or the One We Built for You`;

  // Updated audit headline
  const auditHeadline = `See Exactly What's Costing Your ${niche.name} Business Leads Right Now — Free`;

  // Section background image helpers
  const painBg = nicheBg?.sectionImages.find((s) => s.sectionName === "pain");
  const appPreviewBg = nicheBg?.sectionImages.find(
    (s) => s.sectionName === "app-preview",
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <PublicNav />

      {/* 1. Hero — with niche background image */}
      <HeroSection
        headline={appHeadline}
        subheadline={niche.heroSubheadline}
        bullets={niche.heroBullets}
        nicheKey={niche.key}
        nicheName={niche.name}
        primaryCtaLabel={`See Your ${niche.name} App — It's Free`}
        primaryCtaHref={brandKitLink}
        backgroundImageUrl={nicheBg?.heroImage}
        backgroundImageMobileFocus={nicheBg?.heroImageMobileFocus}
      />

      {/* Book a Strategy Call / Demo strip */}
      <div className="bg-indigo-950/60 border-y border-indigo-800/40 py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/80 text-sm text-center sm:text-left">
            Want to see exactly how this works for{" "}
            <span className="text-white font-medium">{niche.name}</span>{" "}
            businesses?
          </p>
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <a
              href={`/demo?niche=${encodeURIComponent(nicheKey)}`}
              data-ocid="niche.demo.button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600/30 border border-purple-500/50 text-purple-200 text-sm font-semibold hover:bg-purple-600/50 transition-colors whitespace-nowrap"
            >
              See Your {niche.name} Demo →
            </a>
            <BookDemoTrigger
              label="Book a Strategy Call"
              variant="outline"
              size="sm"
              defaultNiche={niche.name}
              className="bg-transparent border-white/30 text-white hover:bg-white/10 whitespace-nowrap"
            />
          </div>
        </div>
      </div>

      {/* 2. NEW — What's Included */}
      <NicheWhatsIncludedSection nicheKey={niche.key} nicheName={niche.name} />

      {/* 3. NEW — App Preview — with subtle section background */}
      <div className="relative">
        {appPreviewBg && (
          <>
            <img
              src={appPreviewBg.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              loading="lazy"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `rgba(2,6,23,${appPreviewBg.overlayOpacity})`,
              }}
            />
          </>
        )}
        <div className="relative">
          <NicheAppPreviewSection nicheKey={niche.key} nicheName={niche.name} />
        </div>
      </div>

      {/* 4. NEW — Testimonials */}
      <NicheTestimonialsSection nicheKey={niche.key} />

      {/* 4b. NEW — Video Testimonials */}
      <NicheVideoTestimonialsSection
        nicheKey={niche.key}
        nicheName={niche.name}
      />

      {/* 5. Imagine (existing — unchanged) */}
      <ImagineSection lines={niche.imagineLines} />

      {/* 6. Pain Section — with subtle section background */}
      <div className="relative">
        {painBg && (
          <>
            <img
              src={painBg.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              loading="lazy"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `rgba(2,6,23,${painBg.overlayOpacity})` }}
            />
          </>
        )}
        <div className="relative">
          <NichePainSection
            nicheName={niche.name}
            painPoints={niche.painPoints}
          />
        </div>
      </div>

      {/* 7. Three Engines (existing — unchanged) */}
      <ThreeEnginesSection engines={niche.engines} />

      <NoOneElseSection />

      {/* 8. Audit Form — updated headline copy */}
      <AuditFormSection
        headline={auditHeadline}
        subcopy={niche.auditSubcopy}
        nicheKey={niche.key}
        nicheName={niche.name}
      />

      {/* 9–11. Existing sections unchanged */}
      <HowItWorksSection steps={niche.howItWorks} />
      <TrustInfrastructureSection />
      <StatCallout />
      <CostSavingsSection niche={nicheKey} />
      <PricingSection />
      <FAQSection faqs={niche.faqs} />

      {/* 12. Final CTA — routes to brand-kit via FinalCTASection's internal mapping */}
      <FinalCTASection
        headline={niche.finalCTAHeadline}
        subtext={niche.finalCTASubtext}
        nicheKey={niche.key}
      />

      {/* Book Demo Modal */}
      <BookDemoModal
        open={bookDemoOpen}
        onOpenChange={setBookDemoOpen}
        defaultNiche={niche.name}
      />

      <PublicFooter />
    </div>
  );
}
