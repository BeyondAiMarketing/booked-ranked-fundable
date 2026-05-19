/**
 * ArrowCallout — safe callout component.
 *
 * Desktop (≥768px): renders an inline label pill anchored below or above content
 *   when a targetRef is provided. No floating SVG arrow that can land on text.
 * Mobile (<768px): renders a pulsing ring on the targetRef element.
 * No targetRef provided: renders nothing — never floats to empty space.
 */

import { useEffect, useRef, useState } from "react";

interface ArrowCalloutProps {
  /** Visual label text describing the highlighted element */
  label: string;
  /** Where the indicator pill is placed relative to the target on desktop */
  placement?: "above" | "below" | "left" | "right";
  /**
   * Ref to the DOM element this callout annotates.
   * If omitted, nothing renders — never point to empty space.
   */
  targetRef?: React.RefObject<HTMLElement | null>;
  // Legacy position props — accepted but ignored; positioning
  // is now driven by targetRef or suppressed entirely.
  direction?: "up-left" | "up-right" | "down-left" | "down-right";
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
}

export default function ArrowCallout({
  label,
  placement = "below",
  targetRef,
}: ArrowCalloutProps) {
  const ringRef = useRef<(() => void) | null>(null);
  // Deferred visibility: targetRef.current is null on first render even when ref is attached.
  // We wait for the DOM to populate before deciding to render.
  const [targetVisible, setTargetVisible] = useState(false);

  useEffect(() => {
    if (targetRef?.current) {
      setTargetVisible(true);
    }
  }, [targetRef]);

  // Mobile: apply pulsing ring directly to the target element
  useEffect(() => {
    const el = targetRef?.current;
    if (!el) return;

    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    el.classList.add(
      "ring-2",
      "ring-purple-400",
      "animate-pulse",
      "rounded-lg",
    );
    ringRef.current = () => {
      el.classList.remove(
        "ring-2",
        "ring-purple-400",
        "animate-pulse",
        "rounded-lg",
      );
    };
    return () => ringRef.current?.();
  }, [targetRef]);

  // No targetRef or not yet in DOM → render nothing to avoid pointing at empty space
  if (!targetVisible) return null;

  // Mobile: ring is applied via useEffect, no JSX overlay needed
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (isMobile) return null;

  // Desktop: inline indicator pill (NOT absolutely positioned — sits in flow)
  const placementClass =
    placement === "above" ? "mb-1" : placement === "below" ? "mt-1" : "mx-1";

  return (
    <div
      className={`flex items-center justify-start pointer-events-none ${placementClass}`}
      aria-hidden="true"
    >
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold leading-tight"
        style={{
          background: "oklch(0.14 0.024 292 / 0.92)",
          border: "1px solid oklch(0.58 0.22 290 / 35%)",
          color: "oklch(0.82 0.14 290)",
        }}
      >
        <span style={{ color: "oklch(0.58 0.22 290)" }}>▲</span>
        {label}
      </span>
    </div>
  );
}
