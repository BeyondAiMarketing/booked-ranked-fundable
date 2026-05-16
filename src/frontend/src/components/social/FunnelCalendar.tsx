import {
  Edit2,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageSquare,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import type { ReactElement } from "react";
import type {
  FunnelStage,
  SocialPlatform,
  SocialPost,
} from "../../types/socialMedia";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FunnelCalendarProps {
  posts: SocialPost[];
  tenantNiche: string;
  onSlotClick: (
    day: string,
    slotIndex: number,
    funnelStage: FunnelStage,
  ) => void;
  onDeletePost: (postId: string) => void;
  onEditPost: (post: SocialPost) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOT_LABELS = ["Morning", "Afternoon", "Evening"];
const SLOT_TIMES = ["9:00 AM", "1:00 PM", "6:00 PM"];

// Recommended funnel stage per slot: morning=TOFU, afternoon=MOFU, evening=BOFU
const SLOT_STAGE: FunnelStage[] = ["tofu", "mofu", "bofu"];

const STAGE_CONFIG: Record<
  FunnelStage,
  {
    label: string;
    shortLabel: string;
    description: string;
    badgeCls: string;
    slotCls: string;
    textColor: string;
    borderColor: string;
  }
> = {
  tofu: {
    label: "Top of Funnel",
    shortLabel: "TOFU",
    description: "Awareness",
    badgeCls: "bg-primary/15 text-primary border-primary/30",
    slotCls: "calendar-slot-tofu",
    textColor: "text-primary",
    borderColor: "border-primary/30",
  },
  mofu: {
    label: "Middle of Funnel",
    shortLabel: "MOFU",
    description: "Trust Building",
    badgeCls: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    slotCls: "calendar-slot-mofu",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-400/30",
  },
  bofu: {
    label: "Bottom of Funnel",
    shortLabel: "BOFU",
    description: "Conversion",
    badgeCls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    slotCls: "calendar-slot-bofu",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-400/30",
  },
};

const FRAMEWORK_LABELS: Record<string, string> = {
  ogilvy_storytelling: "Ogilvy Story",
  hormozi_value_stack: "Hormozi Value",
  kennedy_urgency: "Kennedy Urgency",
  halbert_specificity: "Halbert Specific",
  cialdini_social_proof: "Cialdini Proof",
  dan_kennedy_direct: "Direct Response",
  gary_halbert_attention: "Halbert Attention",
  claude_hopkins_reason_why: "Hopkins Reason",
  jay_abraham_strategy: "Abraham Strategy",
  russell_brunson_hook_story: "Brunson Hook",
};

// Stage legend dot colors
const STAGE_DOT_COLOR: Record<FunnelStage, string> = {
  tofu: "oklch(0.58 0.22 290 / 25%)",
  mofu: "oklch(0.62 0.18 180 / 25%)",
  bofu: "oklch(0.62 0.18 155 / 25%)",
};

// Seasonal tips per niche per month (0-indexed)
const SEASONAL_TIPS: Record<string, Record<number, string>> = {
  hvac: {
    4: "HVAC season tip: Spring AC check content drives 2x bookings in May.",
    5: "HVAC season tip: Urgent service content performs 3x better in June. Ramp up BOFU.",
    6: "HVAC season tip: Urgent service content performs 3x better in July/August.",
    7: "HVAC season tip: Summer peak — emergency response content is your highest converter.",
    8: "HVAC season tip: Transition to furnace prep content as temps drop.",
    9: "HVAC season tip: Furnace tune-up urgency posts convert 2.5x this month.",
    10: "HVAC season tip: Cold snap preparedness content drives high-intent calls.",
  },
  plumber: {
    11: "Plumber tip: Pipe freezing content performs strongly in December/January.",
    0: "Plumber tip: Frozen pipe emergencies peak this month — BOFU urgency posts work best.",
    1: "Plumber tip: Valentine's Day 'gift' bathroom upgrade campaigns convert well.",
    2: "Plumber tip: Spring maintenance posts drive pre-season bookings.",
    3: "Plumber tip: Sump pump content gets high engagement heading into spring storms.",
  },
  "med-spa": {
    8: "Med Spa tip: Holiday prep bookings start in September — 6-8 week lead time messaging.",
    9: "Med Spa tip: Holiday season urgency posts convert 2.3x baseline this month.",
    10: "Med Spa tip: Holiday booking urgency is highest in November — ramp BOFU now.",
    1: "Med Spa tip: Valentine's Day gift certificates and couples packages drive strong ROI.",
    4: "Med Spa tip: Summer event prep treatments — weddings, graduations — peak in May.",
  },
  roofing: {
    2: "Roofing tip: Storm season prep content drives strong lead volume in March/April.",
    3: "Roofing tip: Post-storm inspection campaigns are your highest-ROI BOFU content.",
    4: "Roofing tip: Late spring is peak booking — seasonal offers convert well.",
    9: "Roofing tip: Pre-winter inspection urgency posts convert 2x this month.",
    10: "Roofing tip: November is your last high-conversion window before winter.",
  },
  restoration: {
    5: "Restoration tip: Summer storm season — flood and water damage content performs.",
    6: "Restoration tip: Hurricane season awareness posts drive insurance claim prep leads.",
    7: "Restoration tip: Heavy rain season — water damage emergency posts convert.",
    11: "Restoration tip: Holiday freeze/burst pipe content starts performing this month.",
    0: "Restoration tip: January freeze events drive emergency response lead volume.",
  },
  "carpet-cleaning": {
    8: "Carpet tip: Back-to-school deep clean campaigns work well in September.",
    10: "Carpet tip: Pre-holiday cleaning urgency posts convert strongly in November.",
    11: "Carpet tip: New Year fresh start content drives January booking volume.",
    2: "Carpet tip: Spring cleaning season — now is your highest-intent window.",
    3: "Carpet tip: Spring cleaning campaigns drive 2x normal booking volume.",
  },
};

// ── Helper components ─────────────────────────────────────────────────────────

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  const map: Record<SocialPlatform, ReactElement> = {
    facebook: <Facebook size={10} className="text-blue-400" />,
    instagram: <Instagram size={10} className="text-amber-400" />,
    google_business: <Globe size={10} className="text-rose-400" />,
    tiktok: <MessageSquare size={10} className="text-cyan-400" />,
    linkedin: <Linkedin size={10} className="text-sky-400" />,
  };
  return map[platform] ?? <Globe size={10} className="text-muted-foreground" />;
}

function StageBadge({ stage }: { stage: FunnelStage }) {
  const cfg = STAGE_CONFIG[stage];
  return (
    <span
      className={`text-[8px] font-bold px-1 py-0.5 rounded border uppercase tracking-wide leading-none ${cfg.badgeCls}`}
    >
      {cfg.shortLabel}
    </span>
  );
}

function FilledSlotCard({
  post,
  onEdit,
  onDelete,
  dayIndex,
  slotIndex,
}: {
  post: SocialPost;
  onEdit: (post: SocialPost) => void;
  onDelete: (id: string) => void;
  dayIndex: number;
  slotIndex: number;
}) {
  const cfg = STAGE_CONFIG[post.funnelStage];
  const statusColors: Record<string, string> = {
    published: "text-emerald-400",
    scheduled: "text-primary",
    draft: "text-muted-foreground",
    failed: "text-destructive",
    paused: "text-amber-400",
  };

  return (
    <div
      className={`h-full rounded-lg p-1.5 border calendar-slot-filled space-y-1 ${cfg.slotCls}`}
      data-ocid={`social.calendar.post.item.${dayIndex + 1}.${slotIndex + 1}`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-0.5">
        <StageBadge stage={post.funnelStage} />
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Edit post"
            data-ocid={`social.calendar.post.edit_button.${dayIndex + 1}.${slotIndex + 1}`}
            onClick={() => onEdit(post)}
            className="p-0.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 size={9} />
          </button>
          <button
            type="button"
            aria-label="Delete post"
            data-ocid={`social.calendar.post.delete_button.${dayIndex + 1}.${slotIndex + 1}`}
            onClick={() => onDelete(post.id)}
            className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 size={9} />
          </button>
        </div>
      </div>

      {/* Platform icons */}
      <div className="flex items-center gap-0.5 flex-wrap">
        {post.platforms.slice(0, 3).map((p) => (
          <PlatformIcon key={p} platform={p} />
        ))}
      </div>

      {/* Content preview */}
      <p className="text-[9px] text-foreground/80 line-clamp-2 leading-tight min-h-[22px]">
        {post.content}
      </p>

      {/* Framework + status */}
      <div className="flex items-center gap-1 flex-wrap">
        {post.marketingFramework && (
          <span className="text-[8px] text-muted-foreground truncate max-w-[70px]">
            {FRAMEWORK_LABELS[post.marketingFramework] ??
              post.marketingFramework}
          </span>
        )}
        {post.status === "published" &&
          post.engagementMetrics.likes + post.engagementMetrics.comments >
            0 && (
            <span className="text-[8px] font-semibold text-emerald-400 flex items-center gap-0.5 ml-auto">
              <TrendingUp size={7} />
              {post.engagementMetrics.likes + post.engagementMetrics.comments}
            </span>
          )}
        <span
          className={`text-[8px] font-semibold ml-auto ${statusColors[post.status] ?? "text-muted-foreground"}`}
        >
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
      </div>
    </div>
  );
}

function EmptySlotButton({
  day,
  slotIndex,
  onClick,
  dayIndex,
}: {
  day: string;
  slotIndex: number;
  onClick: (day: string, slotIndex: number, stage: FunnelStage) => void;
  dayIndex: number;
}) {
  const stage = SLOT_STAGE[slotIndex];
  const cfg = STAGE_CONFIG[stage];
  return (
    <button
      type="button"
      aria-label={`Add ${cfg.shortLabel} post for ${day} ${SLOT_LABELS[slotIndex]}`}
      data-ocid={`social.calendar.slot.button.${dayIndex + 1}.${slotIndex + 1}`}
      onClick={() => onClick(day, slotIndex, stage)}
      className={`h-full w-full rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all group ${cfg.slotCls} hover:opacity-80`}
    >
      <Plus
        size={12}
        className={`${cfg.textColor} opacity-50 group-hover:opacity-100 transition-opacity`}
      />
      <span
        className={`text-[8px] font-semibold uppercase tracking-wide ${cfg.textColor} opacity-50 group-hover:opacity-100 transition-opacity`}
      >
        {cfg.shortLabel}
      </span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function FunnelCalendar({
  posts,
  tenantNiche,
  onSlotClick,
  onDeletePost,
  onEditPost,
}: FunnelCalendarProps) {
  const currentMonth = new Date().getMonth();

  // Build slot matrix: assign posts to day×slot based on scheduledAt
  // We use current week dates
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  // Build a map: "Mon"|"Tue"... → [post|null, post|null, post|null]
  const slotMatrix: Record<string, (SocialPost | null)[]> = {};
  for (const day of DAYS) {
    slotMatrix[day] = [null, null, null];
  }

  // Assign posts to the grid by matching scheduledAt to week day + time slot
  for (const post of posts) {
    const ts = post.scheduledAt ?? post.createdAt;
    const d = new Date(ts);
    const offset = Math.floor((d.getTime() - monday.getTime()) / 86400000);
    if (offset < 0 || offset >= 7) continue;
    const day = DAYS[offset];
    const hour = d.getHours();
    const slotIdx = hour < 11 ? 0 : hour < 16 ? 1 : 2;
    if (!slotMatrix[day][slotIdx]) {
      slotMatrix[day][slotIdx] = post;
    }
  }

  // For demo, if we have posts without scheduledAt dates in this week, fill first available slot by funnelStage
  const unplacedPosts = posts.filter((p) => {
    const ts = p.scheduledAt ?? p.createdAt;
    const d = new Date(ts);
    const offset = Math.floor((d.getTime() - monday.getTime()) / 86400000);
    return offset < 0 || offset >= 7;
  });

  // Fill unplaced posts into available slots matching their funnel stage
  for (const post of unplacedPosts) {
    const preferredSlotIdx = SLOT_STAGE.indexOf(post.funnelStage);
    let placed = false;
    for (const day of DAYS) {
      if (!slotMatrix[day][preferredSlotIdx] && !placed) {
        slotMatrix[day][preferredSlotIdx] = post;
        placed = true;
      }
    }
    if (!placed) {
      // Try any available slot
      for (const day of DAYS) {
        for (let s = 0; s < 3; s++) {
          if (!slotMatrix[day][s] && !placed) {
            slotMatrix[day][s] = post;
            placed = true;
          }
        }
      }
    }
  }

  // Seasonal tip lookup
  const nicheKey = tenantNiche.toLowerCase().replace(/\s+/g, "-");
  const nicheTips = SEASONAL_TIPS[nicheKey] ?? {};
  const seasonalTip = nicheTips[currentMonth];

  // Get day date labels
  const getDayDate = (dayIndex: number): string => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + dayIndex);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-3" data-ocid="social.calendar.funnel.section">
      {/* Seasonal banner */}
      {seasonalTip && (
        <div
          className="flex items-start gap-2 px-4 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/25"
          data-ocid="social.calendar.seasonal.banner"
        >
          <span className="text-sm mt-0.5">🌡️</span>
          <p className="text-xs text-amber-300">{seasonalTip}</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {(["tofu", "mofu", "bofu"] as FunnelStage[]).map((stage) => {
          const cfg = STAGE_CONFIG[stage];
          return (
            <div
              key={stage}
              className="flex items-center gap-1.5"
              data-ocid={`social.calendar.legend.${stage}`}
            >
              <div
                className={`w-2 h-2 rounded-sm border ${cfg.borderColor}`}
                style={{ backgroundColor: STAGE_DOT_COLOR[stage] }}
              />
              <span className={`text-[10px] font-semibold ${cfg.textColor}`}>
                {cfg.shortLabel}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {cfg.description}
              </span>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">
            Morning = TOFU · Afternoon = MOFU · Evening = BOFU
          </span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1.5 mb-1.5">
            <div className="text-[10px] text-muted-foreground px-1">Slot</div>
            {DAYS.map((day, di) => (
              <div key={day} className="text-center">
                <p className="text-xs font-semibold text-foreground">{day}</p>
                <p className="text-[9px] text-muted-foreground">
                  {getDayDate(di)}
                </p>
              </div>
            ))}
          </div>

          {/* Slot rows */}
          {SLOT_LABELS.map((slotLabel, slotIndex) => {
            const stage = SLOT_STAGE[slotIndex];
            const cfg = STAGE_CONFIG[stage];
            return (
              <div
                key={slotLabel}
                className="grid grid-cols-8 gap-1.5 mb-1.5"
                data-ocid={`social.calendar.slot_row.${slotIndex + 1}`}
              >
                {/* Row label */}
                <div className="flex flex-col justify-center px-1">
                  <span className="text-[10px] text-muted-foreground">
                    {slotLabel}
                  </span>
                  <span className="text-[8px] text-muted-foreground/60">
                    {SLOT_TIMES[slotIndex]}
                  </span>
                  <Badge
                    className={`mt-0.5 text-[7px] px-1 py-0 h-auto border ${cfg.badgeCls} w-fit`}
                  >
                    {cfg.shortLabel}
                  </Badge>
                </div>

                {/* Day cells */}
                {DAYS.map((day, dayIndex) => {
                  const post = slotMatrix[day][slotIndex];
                  return (
                    <div key={`${day}-${slotLabel}`} className="min-h-[90px]">
                      {post ? (
                        <FilledSlotCard
                          post={post}
                          onEdit={onEditPost}
                          onDelete={onDeletePost}
                          dayIndex={dayIndex}
                          slotIndex={slotIndex}
                        />
                      ) : (
                        <EmptySlotButton
                          day={day}
                          slotIndex={slotIndex}
                          onClick={onSlotClick}
                          dayIndex={dayIndex}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
