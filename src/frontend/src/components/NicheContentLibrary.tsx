// ── NicheContentLibrary ───────────────────────────────────────────────────────
// Slide-in drawer with niche-specific content in 4 tabs:
// Images · Headlines · Testimonials · Trust Badges
// Clicking any item inserts it directly into the active section.

import {
  Award,
  ImageIcon,
  MessageSquare,
  Search,
  Shield,
  Star,
  Type,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type {
  NicheHeadline,
  NicheImage,
  NicheTestimonial,
  NicheTrustBadge,
} from "../data/nicheContentLibrary";
import { getNicheLibrary as getContentLibraryByNiche } from "../data/nicheContentLibrary";
import { Button } from "./ui/button";

type TabKey = "images" | "headlines" | "testimonials" | "trust_badges";

const TABS: { key: TabKey; label: string; Icon: React.ElementType }[] = [
  { key: "images", label: "Images", Icon: ImageIcon },
  { key: "headlines", label: "Headlines", Icon: Type },
  { key: "testimonials", label: "Reviews", Icon: MessageSquare },
  { key: "trust_badges", label: "Badges", Icon: Shield },
];

const FW_COLORS: Record<string, string> = {
  Hormozi: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Kennedy: "bg-red-500/20 text-red-300 border-red-500/30",
  Ogilvy: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Halbert: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Schwartz: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Abraham: "bg-green-500/20 text-green-300 border-green-500/30",
  Sugarman: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Hopkins: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Deiss: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Suby: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const CAT_COLORS: Record<string, string> = {
  license: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  certification: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  guarantee: "bg-green-500/20 text-green-300 border-green-500/30",
  insurance: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  award: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

// ── Image Card ────────────────────────────────────────────────────────────────

function ImageCard({
  item,
  onInsert,
}: { item: NicheImage; onInsert: () => void }) {
  return (
    <button
      type="button"
      className="group text-left rounded-xl border border-white/10 overflow-hidden hover:border-violet-500/40 transition-all w-full"
      onClick={onInsert}
      data-ocid="content_library.image_item"
    >
      <div
        className="h-20 w-full flex items-center justify-center relative"
        style={{ background: item.gradient }}
      >
        <ImageIcon size={20} className="text-white/30" />
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <span className="text-[10px] font-bold text-white bg-violet-600/80 px-2 py-0.5 rounded-full">
            Insert
          </span>
        </span>
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-foreground/90 truncate">
          {item.label}
        </p>
        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight mt-0.5">
          {item.description}
        </p>
      </div>
    </button>
  );
}

// ── Headline Card ─────────────────────────────────────────────────────────────

function HeadlineCard({
  item,
  inserted,
  onInsert,
}: {
  item: NicheHeadline;
  inserted: boolean;
  onInsert: () => void;
}) {
  const fwColor = FW_COLORS[item.framework] ?? FW_COLORS.Hormozi;
  return (
    <button
      type="button"
      className="group text-left w-full rounded-xl border border-white/10 bg-white/3 p-3 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all relative"
      onClick={onInsert}
      data-ocid="content_library.headline_item"
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${fwColor}`}
        >
          {item.framework}
        </span>
        <span className="text-[9px] text-violet-400 capitalize">
          {item.targetSection.replace(/_/g, " ")}
        </span>
      </div>
      <p className="text-xs font-semibold text-foreground leading-snug mb-1">
        {item.headline}
      </p>
      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
        {item.frameworkLabel}
      </p>
      {inserted && (
        <span className="absolute top-2 right-2 text-[9px] bg-green-500/20 text-green-300 border border-green-500/30 px-1.5 py-0.5 rounded-full font-semibold">
          Inserted
        </span>
      )}
    </button>
  );
}

// ── Testimonial Card ──────────────────────────────────────────────────────────

function TestimonialCard({
  item,
  inserted,
  onInsert,
}: {
  item: NicheTestimonial;
  inserted: boolean;
  onInsert: () => void;
}) {
  return (
    <button
      type="button"
      className="group text-left w-full rounded-xl border border-white/10 bg-white/3 p-3 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all relative"
      onClick={onInsert}
      data-ocid="content_library.testimonial_item"
    >
      <div className="flex items-center gap-0.5 mb-1.5">
        {Array.from({ length: item.stars }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static star list
          <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
        ))}
        {item.highlight && (
          <span className="ml-2 text-[9px] text-muted-foreground truncate">
            {item.highlight}
          </span>
        )}
      </div>
      <p className="text-[11px] text-foreground/80 line-clamp-3 leading-relaxed italic mb-1.5">
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-foreground/70">
            {item.name}
          </p>
          <p className="text-[9px] text-muted-foreground">
            {item.role} · {item.city}
          </p>
        </div>
        <span className="opacity-0 group-hover:opacity-100 text-[9px] text-violet-400 font-semibold transition-opacity">
          Insert
        </span>
      </div>
      {inserted && (
        <span className="absolute top-2 right-2 text-[9px] bg-green-500/20 text-green-300 border border-green-500/30 px-1.5 py-0.5 rounded-full font-semibold">
          Inserted
        </span>
      )}
    </button>
  );
}

// ── Trust Badge Card ──────────────────────────────────────────────────────────

function TrustBadgeCard({
  item,
  inserted,
  onInsert,
}: {
  item: NicheTrustBadge;
  inserted: boolean;
  onInsert: () => void;
}) {
  const catColor = CAT_COLORS[item.category] ?? CAT_COLORS.certification;
  return (
    <button
      type="button"
      className="group text-left w-full flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-3 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all relative"
      onClick={onInsert}
      data-ocid="content_library.trust_badge_item"
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/8 flex-shrink-0 text-base">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground/90 truncate">
          {item.label}
        </p>
        <span
          className={`mt-0.5 inline-block text-[9px] px-1.5 py-0.5 rounded-full border capitalize ${catColor}`}
        >
          {item.category.replace(/_/g, " ")}
        </span>
      </div>
      <span className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-[9px] text-violet-400 font-semibold transition-opacity">
        +
      </span>
      {inserted && (
        <span className="absolute top-1 right-1 text-[8px] bg-green-500/20 text-green-300 border border-green-500/30 px-1 py-0.5 rounded-full font-semibold">
          ✓
        </span>
      )}
    </button>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface NicheContentLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  niche: string;
  onInsertContent: (sectionId: string, content: Record<string, string>) => void;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function NicheContentLibrary({
  isOpen,
  onClose,
  niche,
  onInsertContent,
}: NicheContentLibraryProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("headlines");
  const [search, setSearch] = useState("");
  const [insertedIds, setInsertedIds] = useState<Set<string>>(new Set());

  const library = getContentLibraryByNiche(niche);

  const markInserted = (id: string) => {
    setInsertedIds((prev) => new Set([...prev, id]));
  };

  const handleInsertImage = (item: NicheImage) => {
    onInsertContent("hero", {
      imageUrl: item.description,
      imageLabel: item.label,
    });
    markInserted(item.id);
  };

  const handleInsertHeadline = (item: NicheHeadline) => {
    onInsertContent(item.targetSection, {
      headline: item.headline,
      heading: item.headline,
    });
    markInserted(item.id);
  };

  const handleInsertTestimonial = (item: NicheTestimonial) => {
    onInsertContent("testimonials", {
      testimonial_name: item.name,
      testimonial_quote: item.quote,
      testimonial_role: item.role ?? "",
      testimonial_city: item.city,
      testimonial_stars: String(item.stars),
    });
    markInserted(item.id);
  };

  const handleInsertTrustBadge = (item: NicheTrustBadge) => {
    onInsertContent("trust", {
      badge_label: item.label,
      badge_icon: item.icon,
      badge_category: item.category,
    });
    markInserted(item.id);
  };

  const q = search.toLowerCase();
  const images =
    library?.images?.filter(
      (i) =>
        !q ||
        i.label.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q),
    ) ?? [];
  const headlines =
    library?.headlines?.filter(
      (i) =>
        !q ||
        i.headline.toLowerCase().includes(q) ||
        i.targetSection.includes(q),
    ) ?? [];
  const testimonials =
    library?.testimonials.filter(
      (i) =>
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.quote.toLowerCase().includes(q),
    ) ?? [];
  const badges =
    library?.trustBadges.filter(
      (i) => !q || i.label.toLowerCase().includes(q) || i.category.includes(q),
    ) ?? [];

  const nicheLabel = niche.replace(/[-_]/g, " ");

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="presentation"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full z-40 w-80 xl:w-96 flex flex-col border-l border-white/8 bg-card shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-ocid="content_library.sheet"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
              <Award size={13} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Content Library
              </h3>
              <p className="text-[10px] text-muted-foreground capitalize">
                {nicheLabel}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-muted-foreground"
            onClick={onClose}
            data-ocid="content_library.close_button"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5">
            <Search size={12} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-xs bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none"
              data-ocid="content_library.search_input"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/8 flex-shrink-0">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[9px] font-semibold uppercase tracking-widest transition-colors ${
                activeTab === key
                  ? "text-violet-300 border-b-2 border-violet-400"
                  : "text-muted-foreground hover:text-foreground/70"
              }`}
              onClick={() => setActiveTab(key)}
              data-ocid={`content_library.tab.${key}`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {activeTab === "images" && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Zap size={11} className="text-violet-400" />
                <p className="text-[10px] text-muted-foreground">
                  Click to insert image guidance.
                </p>
              </div>
              {images.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground text-xs"
                  data-ocid="content_library.empty_state"
                >
                  No images match your search.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((item) => (
                    <ImageCard
                      key={item.id}
                      item={item}
                      onInsert={() => handleInsertImage(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "headlines" && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Star size={11} className="text-amber-400" />
                <p className="text-[10px] text-muted-foreground">
                  Click a headline to insert it.
                </p>
              </div>
              {headlines.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground text-xs"
                  data-ocid="content_library.empty_state"
                >
                  No headlines match your search.
                </div>
              ) : (
                <div className="space-y-2">
                  {headlines.map((item) => (
                    <HeadlineCard
                      key={item.id}
                      item={item}
                      inserted={insertedIds.has(item.id)}
                      onInsert={() => handleInsertHeadline(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "testimonials" && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare size={11} className="text-indigo-400" />
                <p className="text-[10px] text-muted-foreground">
                  Click to insert into testimonials.
                </p>
              </div>
              {testimonials.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground text-xs"
                  data-ocid="content_library.empty_state"
                >
                  No testimonials match your search.
                </div>
              ) : (
                <div className="space-y-2">
                  {testimonials.map((item) => (
                    <TestimonialCard
                      key={item.id}
                      item={item}
                      inserted={insertedIds.has(item.id)}
                      onInsert={() => handleInsertTestimonial(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "trust_badges" && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Shield size={11} className="text-blue-400" />
                <p className="text-[10px] text-muted-foreground">
                  Click to add a trust badge.
                </p>
              </div>
              {badges.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground text-xs"
                  data-ocid="content_library.empty_state"
                >
                  No badges match your search.
                </div>
              ) : (
                <div className="space-y-2">
                  {badges.map((item) => (
                    <TrustBadgeCard
                      key={item.id}
                      item={item}
                      inserted={insertedIds.has(item.id)}
                      onInsert={() => handleInsertTrustBadge(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/8 flex-shrink-0">
          <p className="text-[9px] text-muted-foreground text-center">
            Niche-optimized for {nicheLabel} businesses.
          </p>
        </div>
      </div>
    </>
  );
}
