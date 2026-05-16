import { useState } from "react";
import type {
  ClientWebsiteConfig,
  NicheWebsite,
  NicheWebsitePage,
  NicheWebsiteSection,
} from "../data/nicheWebsiteData";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface NicheWebsiteRendererProps {
  website: NicheWebsite;
  config?: ClientWebsiteConfig;
  tenantData?: { name?: string; phone?: string; address?: string };
  isEditable?: boolean;
  onSectionUpdate?: (
    sectionId: string,
    content: Record<string, string>,
  ) => void;
  /** Intentionally unused by the renderer itself — external callback for parent UI to handle visibility toggles */
  onVisibilityToggle?: (sectionId: string, visible: boolean) => void;
  previewMode?: "desktop" | "mobile" | "thumbnail";
  /** Multi-page: which page to render (default: 'home') */
  currentPage?: string;
  /** Multi-page: callback when user clicks a page nav tab */
  onPageChange?: (pageId: string) => void;
  /** Whether to show the page navigation bar (default: true in edit/preview, false in thumbnail) */
  showPageNav?: boolean;
}

// ── Inline Edit Wrapper ────────────────────────────────────────────────────────

function EditableText({
  value,
  onSave,
  multiline = false,
  className = "",
}: {
  value: string;
  onSave: (v: string) => void;
  multiline?: boolean;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <button
        type="button"
        className={`group/edit relative cursor-pointer outline-none bg-transparent border-0 p-0 text-inherit ${className}`}
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        aria-label={`Edit: ${value}`}
      >
        {value}
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 opacity-0 group-hover/edit:opacity-100 transition-opacity bg-blue-500 rounded-full p-0.5"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            role="presentation"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </span>
      </button>
    );
  }

  return multiline ? (
    <textarea
      className="w-full bg-white/20 border border-blue-400 rounded px-2 py-1 text-inherit text-sm resize-none outline-none ring-2 ring-blue-400"
      rows={3}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        onSave(draft);
        setEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      }}
    />
  ) : (
    <input
      type="text"
      className="w-full bg-white/20 border border-blue-400 rounded px-2 py-1 text-inherit outline-none ring-2 ring-blue-400"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        onSave(draft);
        setEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSave(draft);
          setEditing(false);
        }
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      }}
    />
  );
}

// ── Page Navigation Bar ────────────────────────────────────────────────────────

function PageNav({
  pages,
  currentPage,
  onPageChange,
  theme,
}: {
  pages: NicheWebsitePage[];
  currentPage: string;
  onPageChange: (pageId: string) => void;
  theme: NicheWebsite["theme"];
}) {
  const isDark = theme.style === "emergency" || theme.style === "luxury";
  const navBg = isDark ? `${theme.bgColor}f0` : "#ffffff";
  const navBorder = isDark
    ? `${theme.primaryColor}30`
    : `${theme.primaryColor}20`;

  return (
    <nav
      className="sticky top-0 z-40 flex items-center gap-1 px-4 py-2 shadow-sm"
      style={{
        background: navBg,
        borderBottom: `1px solid ${navBorder}`,
        backdropFilter: "blur(8px)" as React.CSSProperties["backdropFilter"],
      }}
      aria-label="Site navigation"
      data-ocid="niche_website.page_nav"
    >
      <div className="flex items-center gap-1">
        {pages.map((page) => {
          const isActive = page.id === currentPage;
          return (
            <button
              key={page.id}
              type="button"
              onClick={() => onPageChange(page.id)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: isActive ? theme.primaryColor : "transparent",
                color: isActive
                  ? "#ffffff"
                  : isDark
                    ? `${theme.textColor}90`
                    : `${theme.primaryColor}cc`,
                border: isActive
                  ? `1px solid ${theme.primaryColor}`
                  : "1px solid transparent",
              }}
              aria-current={isActive ? "page" : undefined}
              data-ocid={`niche_website.page_tab.${page.id}`}
            >
              {page.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ── Text Contrast Scrim Utility ────────────────────────────────────────────────
// Adaptive scrim opacity based on niche theme style.
// Light/professional niches get a stronger scrim (text over light bg images).
// Dark/emergency niches get a lighter scrim (already dark bg, still guaranteed readable).
// Progressive: every niche gets SOME scrim — no niche is exempt.

function getScrimOpacity(style: NicheWebsite["theme"]["style"]): number {
  switch (style) {
    case "professional":
    case "clinical":
      // Light palette niches: real-estate, mortgage, dental, chiro — strongest scrim
      return 0.68;
    case "warm":
      // Warm/neutral palette — medium-strong
      return 0.62;
    case "luxury":
      // Dark palette but rich imagery: med-spa — medium
      return 0.58;
    case "emergency":
      // Already very dark: plumbing, restoration, roofing, hvac — lighter touch, still guaranteed
      return 0.5;
    default:
      // Fallback — safe mid-range
      return 0.58;
  }
}

// ── Section Components ─────────────────────────────────────────────────────────

function HeroSection({
  section,
  theme,
  isEditable,
  onUpdate,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
  isEditable?: boolean;
  onUpdate?: (key: string, val: string) => void;
}) {
  const c = section.content as Record<string, string>;
  const isDark = theme.style === "emergency" || theme.style === "luxury";
  const bg = isDark ? theme.bgColor : theme.primaryColor;
  const textCol = isDark ? theme.textColor : "#ffffff";
  const scrimOpacity = getScrimOpacity(theme.style);

  const wrap = (key: string, el: React.ReactNode, multi = false) =>
    isEditable && onUpdate ? (
      <EditableText
        value={c[key] ?? ""}
        onSave={(v) => onUpdate(key, v)}
        multiline={multi}
        className="inline"
      />
    ) : (
      el
    );

  const badges = [c.badge1, c.badge2, c.badge3].filter(Boolean);

  return (
    <section
      style={{ background: bg, color: textCol }}
      className="relative py-20 px-6 md:px-16 text-center overflow-hidden"
    >
      {/* Decorative radial accent — subtle, does NOT provide contrast */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at 70% 50%, ${theme.accentColor}, transparent 60%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/*
          Text scrim container — localized dark gradient ONLY behind badges, headline,
          and subheadline. NOT behind CTA buttons. The scrim is a positioned absolute
          div with negative inset, soft gradient, and rounded corners so the hero image
          stays visible everywhere except directly behind the words.
          pointer-events: none ensures it never blocks EditableText or any click target.
        */}
        <div className="relative inline-block w-full">
          {/* Scrim backdrop — positioned absolute, behind text (z-0), never covers buttons */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-12px -20px",
              borderRadius: "16px",
              background: `linear-gradient(
                to bottom,
                rgba(0,0,0,${scrimOpacity}) 0%,
                rgba(0,0,0,${scrimOpacity * 0.92}) 60%,
                rgba(0,0,0,${scrimOpacity * 0.72}) 100%
              )`,
              pointerEvents: "none",
              zIndex: 0,
              // Soft edge blur to blend naturally with the image behind
              backdropFilter: "blur(0.5px)",
            }}
          />

          {/* Text content — on top of scrim (z-10) */}
          <div className="relative z-10">
            {badges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {badges.map((b) => (
                  <span
                    key={b}
                    className="text-xs font-semibold px-3 py-1 rounded-full border"
                    style={{
                      borderColor: `${theme.accentColor}80`,
                      backgroundColor: `${theme.accentColor}25`,
                      color: theme.accentColor,
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
            <h1
              className={`font-black mb-4 leading-tight ${
                theme.headingFont === "dramatic"
                  ? "text-4xl md:text-6xl uppercase tracking-tight"
                  : theme.headingFont === "elegant"
                    ? "text-4xl md:text-5xl font-light tracking-wide"
                    : "text-3xl md:text-5xl font-bold"
              }`}
              style={{
                color: "#ffffff",
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }}
            >
              {wrap("headline", c.headline)}
            </h1>
            <p
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
              style={{
                color: "rgba(255,255,255,0.93)",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {wrap("subheadline", c.subheadline, true)}
            </p>
          </div>
        </div>

        {/* CTA buttons — outside the scrim wrapper, always fully visible and clickable */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
          <a
            href={`tel:${c.phone}`}
            style={{
              background:
                theme.primaryColor === bg
                  ? theme.accentColor
                  : theme.primaryColor,
              color: "#fff",
            }}
            className="px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-xl"
          >
            {wrap("cta1", c.cta1)}
          </a>
          <a
            href="#contact"
            style={{ borderColor: `${textCol}60`, color: "#ffffff" }}
            className="px-8 py-4 rounded-lg font-semibold text-lg border-2 hover:bg-white/10 transition-colors"
          >
            {wrap("cta2", c.cta2)}
          </a>
        </div>
        {c.phone && (
          <p
            className="mt-6 text-2xl font-black tracking-wide"
            style={{
              color: theme.accentColor,
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {c.phone}
          </p>
        )}
      </div>
    </section>
  );
}

function StatsSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  type StatItem = { value: string; label: string };
  let stats: StatItem[] = [];
  try {
    stats = JSON.parse(section.content.stats as string) as StatItem[];
  } catch {
    /* empty */
  }

  return (
    <section
      style={{ background: theme.primaryColor, color: "#fff" }}
      className="py-8 px-6"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-3xl md:text-4xl font-black">{s.value}</div>
            <div className="text-sm mt-1 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  type SvcItem = { icon: string; title: string; desc: string };
  let svcs: SvcItem[] = [];
  try {
    svcs = JSON.parse(section.content.services as string) as SvcItem[];
  } catch {
    /* empty */
  }

  const isDark = theme.style === "emergency" || theme.style === "luxury";
  const bg = isDark ? `${theme.bgColor}dd` : "#f8fafc";
  const cardBg = isDark ? `${theme.secondaryColor}cc` : "#ffffff";
  const textCol = isDark ? theme.textColor : "#1e293b";

  return (
    <section style={{ background: bg, color: textCol }} className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {section.content.heading as string}
          </h2>
          <p style={{ opacity: 0.7 }}>{section.content.subheading as string}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {svcs.map((s) => (
            <div
              key={s.title}
              style={{
                background: cardBg,
                borderColor: `${theme.primaryColor}20`,
              }}
              className="rounded-xl p-5 border hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3
                className="font-bold text-base mb-1"
                style={{ color: theme.primaryColor }}
              >
                {s.title}
              </h3>
              <p className="text-sm" style={{ opacity: 0.75 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  type TestimonialItem = {
    text: string;
    name: string;
    city: string;
    stars: string;
  };
  let items: TestimonialItem[] = [];
  try {
    items = JSON.parse(
      section.content.testimonials as string,
    ) as TestimonialItem[];
  } catch {
    /* empty */
  }

  const isDark = theme.style === "emergency" || theme.style === "luxury";
  const bg = isDark ? theme.secondaryColor : theme.primaryColor;

  return (
    <section style={{ background: bg, color: "#fff" }} className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          {section.content.heading as string}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div
              key={t.name}
              className="rounded-xl p-6"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div className="flex mb-3">
                {Array.from({ length: Number(t.stars) }).map((_, si) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: star rating array
                  <span key={si} style={{ color: theme.accentColor }}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4 opacity-90">
                "{t.text}"
              </p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs opacity-60">{t.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  let badges: string[] = [];
  try {
    badges = JSON.parse(section.content.badges as string) as string[];
  } catch {
    /* empty */
  }

  const isDark = theme.style === "emergency" || theme.style === "luxury";
  const bg = isDark ? `${theme.bgColor}ee` : "#f1f5f9";
  const textCol = isDark ? theme.textColor : "#1e293b";

  return (
    <section style={{ background: bg, color: textCol }} className="py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-8">
          {section.content.heading as string}
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {badges.map((b) => (
            <span
              key={b}
              className="px-4 py-2 rounded-full text-sm font-semibold border"
              style={{
                borderColor: `${theme.primaryColor}40`,
                backgroundColor: `${theme.primaryColor}12`,
                color: theme.primaryColor,
              }}
            >
              ✓ {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  const c = section.content as Record<string, string>;
  const isDark = theme.style === "luxury";
  const bg = isDark ? theme.secondaryColor : "#ffffff";
  const textCol = isDark ? theme.textColor : "#1e293b";

  return (
    <section style={{ background: bg, color: textCol }} className="py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{c.heading}</h2>
        <p className="text-base leading-relaxed mb-4" style={{ opacity: 0.8 }}>
          {c.body}
        </p>
        {c.founderName && (
          <p
            className="font-semibold mt-4"
            style={{ color: theme.primaryColor }}
          >
            — {c.founderName}
          </p>
        )}
      </div>
    </section>
  );
}

function ProcessSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  type StepItem = { num: string; title: string; desc: string };
  let steps: StepItem[] = [];
  try {
    steps = JSON.parse(section.content.steps as string) as StepItem[];
  } catch {
    /* empty */
  }

  const isDark = theme.style === "emergency" || theme.style === "luxury";
  const bg = isDark ? `${theme.bgColor}cc` : "#f8fafc";
  const textCol = isDark ? theme.textColor : "#1e293b";

  return (
    <section style={{ background: bg, color: textCol }} className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          {section.content.heading as string}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl mx-auto mb-3"
                style={{ background: theme.primaryColor }}
              >
                {s.num}
              </div>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm" style={{ opacity: 0.7 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  type FAQItem = { q: string; a: string };
  let faqs: FAQItem[] = [];
  try {
    faqs = JSON.parse(section.content.faqs as string) as FAQItem[];
  } catch {
    /* empty */
  }

  const [open, setOpen] = useState<number | null>(null);
  const isDark = theme.style === "luxury" || theme.style === "emergency";
  const bg = isDark ? theme.secondaryColor : "#ffffff";
  const textCol = isDark ? theme.textColor : "#1e293b";

  return (
    <section style={{ background: bg, color: textCol }} className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          {section.content.heading as string}
        </h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: `${theme.primaryColor}25` }}
            >
              <button
                type="button"
                className="w-full text-left px-5 py-4 font-semibold flex items-center justify-between"
                style={{
                  background:
                    open === i ? `${theme.primaryColor}10` : "transparent",
                }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{f.q}</span>
                <span
                  className="ml-4 transition-transform"
                  style={{
                    color: theme.primaryColor,
                    transform: open === i ? "rotate(180deg)" : "none",
                  }}
                >
                  ▼
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm" style={{ opacity: 0.8 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  const c = section.content as Record<string, string>;
  const isDark = theme.style === "emergency" || theme.style === "luxury";
  const bg = isDark ? theme.bgColor : "#f8fafc";
  const textCol = isDark ? theme.textColor : "#1e293b";

  return (
    <section
      id="contact"
      style={{ background: bg, color: textCol }}
      className="py-16 px-6"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">{c.heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: "📞",
              label: "Phone",
              val: c.phone,
              href: `tel:${c.phone}`,
            },
            { icon: "📍", label: "Address", val: c.address },
            { icon: "🕐", label: "Hours", val: c.hours },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-5"
              style={{
                background: `${theme.primaryColor}12`,
                border: `1px solid ${theme.primaryColor}25`,
              }}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs uppercase tracking-widest mb-1 opacity-60">
                {item.label}
              </div>
              {item.href ? (
                <a
                  href={item.href}
                  className="font-bold text-lg hover:underline"
                  style={{ color: theme.primaryColor }}
                >
                  {item.val}
                </a>
              ) : (
                <div className="font-semibold text-sm">{item.val}</div>
              )}
            </div>
          ))}
        </div>
        <a
          href={`tel:${c.phone}`}
          style={{ background: theme.primaryColor, color: "#fff" }}
          className="inline-block px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          Call Now — {c.phone}
        </a>
      </div>
    </section>
  );
}

function CTABannerSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  const c = section.content as Record<string, string>;
  return (
    <section
      style={{ background: theme.primaryColor, color: "#fff" }}
      className="py-14 px-6 text-center"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black mb-3">{c.heading}</h2>
        <p className="mb-6 text-base opacity-85">{c.subheading}</p>
        <a
          href="#contact"
          style={{ background: theme.accentColor, color: "#0f172a" }}
          className="inline-block px-10 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-opacity shadow-xl"
        >
          {c.cta}
        </a>
      </div>
    </section>
  );
}

function BeforeAfterSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  type TreatItem = { label: string };
  let treatments: TreatItem[] = [];
  try {
    treatments = JSON.parse(
      section.content.treatments as string,
    ) as TreatItem[];
  } catch {
    /* empty */
  }

  const isDark = theme.style === "emergency" || theme.style === "luxury";
  const bg = isDark ? theme.secondaryColor : "#f1f5f9";
  const textCol = isDark ? theme.textColor : "#1e293b";

  return (
    <section style={{ background: bg, color: textCol }} className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {section.content.heading as string}
          </h2>
          <p style={{ opacity: 0.7 }}>{section.content.subheading as string}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {treatments.map((t) => (
            <div
              key={t.label}
              className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${theme.primaryColor}25` }}
            >
              <div className="grid grid-cols-2 h-32">
                <div
                  className="flex items-center justify-center text-xs font-bold uppercase tracking-widest opacity-50"
                  style={{ background: isDark ? "#ffffff08" : "#e2e8f0" }}
                >
                  Before
                </div>
                <div
                  className="flex items-center justify-center text-xs font-bold uppercase tracking-widest"
                  style={{
                    background: `${theme.primaryColor}25`,
                    color: theme.primaryColor,
                  }}
                >
                  After
                </div>
              </div>
              <div className="p-3 text-sm font-semibold text-center">
                {t.label}
              </div>
            </div>
          ))}
        </div>
        {section.content.disclaimer && (
          <p className="text-center text-xs mt-6" style={{ opacity: 0.5 }}>
            {section.content.disclaimer as string}
          </p>
        )}
      </div>
    </section>
  );
}

function CertificationsSection({
  section,
  theme,
}: {
  section: NicheWebsiteSection;
  theme: NicheWebsite["theme"];
}) {
  let certs: string[] = [];
  try {
    certs = JSON.parse(section.content.certs as string) as string[];
  } catch {
    /* empty */
  }

  const isDark = theme.style === "luxury" || theme.style === "emergency";
  const bg = isDark ? `${theme.bgColor}dd` : "#f8fafc";
  const textCol = isDark ? theme.textColor : "#1e293b";

  return (
    <section style={{ background: bg, color: textCol }} className="py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-8">
          {section.content.heading as string}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {certs.map((c) => (
            <div
              key={c}
              className="rounded-lg py-3 px-4 text-sm font-semibold flex items-center gap-2"
              style={{
                background: `${theme.primaryColor}10`,
                border: `1px solid ${theme.primaryColor}25`,
                color: theme.primaryColor,
              }}
            >
              <span>🏅</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NicheWebsiteFooter({
  theme,
  businessName,
}: {
  theme: NicheWebsite["theme"];
  businessName: string;
}) {
  const isDark = theme.style === "emergency" || theme.style === "luxury";
  const bg = isDark ? "#000000" : "#1e293b";
  return (
    <footer
      style={{ background: bg, color: "rgba(255,255,255,0.6)" }}
      className="py-8 px-6 text-center text-sm"
    >
      <p className="font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>
        © {new Date().getFullYear()} {businessName}. All rights reserved.
      </p>
      <p className="mt-1 text-xs">
        Licensed &amp; Insured. Serving your community with pride.
      </p>
    </footer>
  );
}

// ── Section Renderer ───────────────────────────────────────────────────────────

function renderSection(
  section: NicheWebsiteSection,
  theme: NicheWebsite["theme"],
  isEditable?: boolean,
  onSectionUpdate?: (
    sectionId: string,
    content: Record<string, string>,
  ) => void,
) {
  const handleUpdate = onSectionUpdate
    ? (key: string, val: string) => onSectionUpdate(section.id, { [key]: val })
    : undefined;

  switch (section.type) {
    case "hero":
      return (
        <HeroSection
          key={section.id}
          section={section}
          theme={theme}
          isEditable={isEditable}
          onUpdate={handleUpdate}
        />
      );
    case "stats":
      return <StatsSection key={section.id} section={section} theme={theme} />;
    case "services":
      return (
        <ServicesSection key={section.id} section={section} theme={theme} />
      );
    case "testimonials":
      return (
        <TestimonialsSection key={section.id} section={section} theme={theme} />
      );
    case "trust":
      return <TrustSection key={section.id} section={section} theme={theme} />;
    case "about":
      return <AboutSection key={section.id} section={section} theme={theme} />;
    case "process":
      return (
        <ProcessSection key={section.id} section={section} theme={theme} />
      );
    case "faq":
      return <FAQSection key={section.id} section={section} theme={theme} />;
    case "contact":
      return (
        <ContactSection key={section.id} section={section} theme={theme} />
      );
    case "cta_banner":
      return (
        <CTABannerSection key={section.id} section={section} theme={theme} />
      );
    case "before_after":
      return (
        <BeforeAfterSection key={section.id} section={section} theme={theme} />
      );
    case "certifications":
      return (
        <CertificationsSection
          key={section.id}
          section={section}
          theme={theme}
        />
      );
    default:
      return null;
  }
}

// ── Main Renderer ──────────────────────────────────────────────────────────────

export default function NicheWebsiteRenderer({
  website,
  config,
  tenantData,
  isEditable = false,
  onSectionUpdate,
  previewMode = "desktop",
  currentPage = "home",
  onPageChange,
  showPageNav,
}: NicheWebsiteRendererProps) {
  const theme: NicheWebsite["theme"] = config
    ? {
        ...website.theme,
        primaryColor:
          config.customizations.primaryColor ?? website.theme.primaryColor,
        secondaryColor:
          config.customizations.secondaryColor ?? website.theme.secondaryColor,
        accentColor:
          config.customizations.accentColor ?? website.theme.accentColor,
      }
    : website.theme;

  const businessName =
    config?.customizations.businessName ??
    tenantData?.name ??
    "[Business Name]";
  const phone = config?.customizations.phone ?? tenantData?.phone ?? "[Phone]";
  const address =
    config?.customizations.address ?? tenantData?.address ?? "[Address]";

  const rawAddress =
    config?.customizations.address ?? tenantData?.address ?? "";
  const addressParts = rawAddress.split(",");
  const city =
    addressParts.length >= 2
      ? addressParts[1].trim()
      : rawAddress.trim() || "[City]";

  const replaceTokens = (str: string) =>
    str
      .replace(/\[Business Name\]/g, businessName)
      .replace(/\[Phone\]/g, phone)
      .replace(/\[Address\]/g, address)
      .replace(/\[City\]/g, city);

  const getContent = (section: NicheWebsiteSection): NicheWebsiteSection => {
    const override = config?.customizations.sectionOverrides[section.id] ?? {};
    const merged: Record<string, string | string[] | Record<string, string>[]> =
      {};
    for (const [k, v] of Object.entries(section.content)) {
      if (typeof v === "string") {
        const raw = replaceTokens((override[k] as string | undefined) ?? v);
        if (raw.trimStart().startsWith("[")) {
          try {
            const parsed = JSON.parse(raw) as unknown[];
            const replaced = parsed.map((item) => {
              if (typeof item === "string") return replaceTokens(item);
              if (typeof item === "object" && item !== null) {
                const obj = item as Record<string, unknown>;
                const replacedObj: Record<string, unknown> = {};
                for (const [ik, iv] of Object.entries(obj)) {
                  replacedObj[ik] =
                    typeof iv === "string" ? replaceTokens(iv) : iv;
                }
                return replacedObj;
              }
              return item;
            });
            merged[k] = JSON.stringify(replaced);
          } catch {
            merged[k] = raw;
          }
        } else {
          merged[k] = raw;
        }
      } else {
        merged[k] = v;
      }
    }
    return { ...section, content: merged };
  };

  const filterSections = (sections: NicheWebsiteSection[]) =>
    sections.filter((s) => {
      if (!(s.visible ?? true)) return false;
      if (config?.customizations.hiddenSections.includes(s.id)) return false;
      return true;
    });

  // Determine which sections to render
  const isMultiPage = !!(website.pages && website.pages.length > 0);
  const shouldShowPageNav =
    showPageNav !== undefined
      ? showPageNav
      : previewMode !== "thumbnail" && isMultiPage;

  const sectionsToRender: NicheWebsiteSection[] = isMultiPage
    ? filterSections(
        website.pages?.find((p) => p.id === currentPage)?.sections ??
          website.pages?.[0]?.sections ??
          [],
      )
    : filterSections(website.sections);

  const wrapperClass = previewMode === "mobile" ? "max-w-sm mx-auto" : "w-full";

  return (
    <div
      className={`${wrapperClass} font-sans`}
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Multi-page nav */}
      {shouldShowPageNav && website.pages && website.pages.length > 0 && (
        <PageNav
          pages={website.pages}
          currentPage={currentPage}
          onPageChange={onPageChange ?? (() => {})}
          theme={theme}
        />
      )}

      {sectionsToRender.map((rawSection) => {
        const section = getContent(rawSection);
        return renderSection(section, theme, isEditable, onSectionUpdate);
      })}

      <NicheWebsiteFooter theme={theme} businessName={businessName} />

      {/* Mobile sticky CTA */}
      {previewMode !== "thumbnail" && (
        <div
          className="fixed bottom-0 left-0 right-0 flex md:hidden items-center justify-between px-4 py-3 z-50 shadow-2xl"
          style={{ background: theme.primaryColor }}
        >
          <span className="text-white font-bold text-sm">{phone}</span>
          <a
            href={`tel:${phone}`}
            style={{ background: theme.accentColor, color: "#0f172a" }}
            className="px-5 py-2 rounded-lg font-black text-sm"
          >
            Call Now
          </a>
        </div>
      )}
    </div>
  );
}
