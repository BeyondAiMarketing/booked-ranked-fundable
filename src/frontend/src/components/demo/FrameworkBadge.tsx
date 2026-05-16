import type { FrameworkBadge as FrameworkBadgeType } from "@/types/demo";

interface FrameworkBadgeProps {
  badge: FrameworkBadgeType;
  size?: "sm" | "md";
}

const BADGE_STYLES: Record<
  string,
  { icon: string; bgStyle: string; textStyle: string; borderStyle: string }
> = {
  brunson: {
    icon: "🔥",
    bgStyle: "oklch(0.65 0.2 40 / 15%)",
    textStyle: "oklch(0.82 0.16 40)",
    borderStyle: "oklch(0.65 0.2 40 / 30%)",
  },
  deiss: {
    icon: "🎯",
    bgStyle: "oklch(0.6 0.18 240 / 15%)",
    textStyle: "oklch(0.76 0.14 240)",
    borderStyle: "oklch(0.6 0.18 240 / 30%)",
  },
  hormozi: {
    icon: "💪",
    bgStyle: "oklch(0.6 0.22 25 / 15%)",
    textStyle: "oklch(0.78 0.18 25)",
    borderStyle: "oklch(0.6 0.22 25 / 30%)",
  },
  ogilvy: {
    icon: "✍️",
    bgStyle: "oklch(0.5 0.02 280 / 20%)",
    textStyle: "oklch(0.72 0.02 280)",
    borderStyle: "oklch(0.5 0.02 280 / 30%)",
  },
  halbert: {
    icon: "📝",
    bgStyle: "oklch(0.5 0.02 280 / 20%)",
    textStyle: "oklch(0.72 0.02 280)",
    borderStyle: "oklch(0.5 0.02 280 / 30%)",
  },
  kennedy: {
    icon: "💼",
    bgStyle: "oklch(0.5 0.02 280 / 20%)",
    textStyle: "oklch(0.72 0.02 280)",
    borderStyle: "oklch(0.5 0.02 280 / 30%)",
  },
};

export default function FrameworkBadge({
  badge,
  size = "sm",
}: FrameworkBadgeProps) {
  const style = BADGE_STYLES[badge.name] ?? BADGE_STYLES.ogilvy;
  const isSmall = size === "sm";

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border font-semibold"
      style={{
        background: style.bgStyle,
        color: style.textStyle,
        borderColor: style.borderStyle,
        padding: isSmall ? "0.2rem 0.65rem" : "0.35rem 0.85rem",
        fontSize: isSmall ? "0.65rem" : "0.75rem",
        letterSpacing: "0.02em",
      }}
      data-ocid={`demo.framework_badge.${badge.name}`}
      title={badge.label}
    >
      <span
        aria-hidden="true"
        style={{ fontSize: isSmall ? "0.7em" : "0.85em" }}
      >
        {style.icon}
      </span>
      {badge.label}
    </span>
  );
}
