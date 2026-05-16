import { Maximize2, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ── Types ──────────────────────────────────────────────────────────────────────

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface DeviceConfig {
  type: DeviceType;
  label: string;
  width: number;
  resolution: string;
  icon: typeof Smartphone;
}

export const DEVICE_CONFIGS: DeviceConfig[] = [
  {
    type: "mobile",
    label: "Mobile",
    width: 375,
    resolution: "375px",
    icon: Smartphone,
  },
  {
    type: "tablet",
    label: "Tablet",
    width: 768,
    resolution: "768px",
    icon: Tablet,
  },
  {
    type: "desktop",
    label: "Desktop",
    width: 1280,
    resolution: "1280px",
    icon: Monitor,
  },
];

// ── Device Toggle Bar ──────────────────────────────────────────────────────────

export function DeviceToggleBar({
  active,
  onChange,
  onFullScreen,
}: {
  active: DeviceType;
  onChange: (d: DeviceType) => void;
  onFullScreen: () => void;
}) {
  const activeConfig = DEVICE_CONFIGS.find((d) => d.type === active)!;

  return (
    <div
      className="flex items-center gap-3"
      data-ocid="device_frame.toggle_bar"
    >
      {/* 3-way icon toggle */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-muted/60 border border-border">
        {DEVICE_CONFIGS.map((d) => {
          const Icon = d.icon;
          const isActive = d.type === active;
          return (
            <button
              key={d.type}
              type="button"
              title={`${d.label} (${d.resolution})`}
              aria-label={`Switch to ${d.label} preview`}
              aria-pressed={isActive}
              onClick={() => onChange(d.type)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              data-ocid={`device_frame.${d.type}_button`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{d.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active device label + resolution */}
      <span className="text-xs text-muted-foreground hidden md:block">
        <span className="text-foreground font-medium">
          {activeConfig.label}
        </span>{" "}
        · <span className="font-mono">{activeConfig.resolution}</span>
      </span>

      {/* Full screen button */}
      <button
        type="button"
        title="Full Screen Preview"
        aria-label="Open full screen preview"
        onClick={onFullScreen}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-all border border-transparent hover:border-border"
        data-ocid="device_frame.fullscreen_button"
      >
        <Maximize2 size={13} />
        <span className="hidden sm:inline">Full Screen</span>
      </button>
    </div>
  );
}

// ── Full Screen Overlay ────────────────────────────────────────────────────────

function FullScreenOverlay({
  device,
  onClose,
  children,
}: {
  device: DeviceType;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const config = DEVICE_CONFIGS.find((d) => d.type === device)!;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-background/95 backdrop-blur-md"
      data-ocid="device_frame.fullscreen_overlay"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/80 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-foreground">
            Full Screen Preview
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">
            {config.label} · {config.resolution}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all border border-transparent hover:border-border"
          aria-label="Close full screen preview"
          data-ocid="device_frame.fullscreen_close_button"
        >
          <X size={14} />
          <span>Close</span>
        </button>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-8 bg-[#0a0a12]">
        <DeviceFrameInner device={device} fullScreen>
          {children}
        </DeviceFrameInner>
      </div>
    </div>,
    document.body,
  );
}

// ── Device Frame Inner ─────────────────────────────────────────────────────────

function DeviceFrameInner({
  device,
  children,
  fullScreen = false,
}: {
  device: DeviceType;
  children: React.ReactNode;
  fullScreen?: boolean;
}) {
  if (device === "mobile") {
    return (
      <div
        className="relative shrink-0"
        style={{ width: fullScreen ? 393 : 375 }}
        data-ocid="device_frame.mobile_frame"
      >
        {/* Phone shell */}
        <div
          className="relative rounded-[44px] border-[6px] border-[#2a2a3a] shadow-[0_0_0_2px_#1a1a2a,0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden"
          style={{ background: "#1a1a2a" }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a2a] rounded-b-2xl z-20 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2a2a3a]" />
            <div className="w-10 h-1.5 rounded-full bg-[#2a2a3a]" />
          </div>
          {/* Side buttons */}
          <div className="absolute -left-2 top-24 w-1.5 h-10 bg-[#1e1e2e] rounded-l-full" />
          <div className="absolute -left-2 top-40 w-1.5 h-10 bg-[#1e1e2e] rounded-l-full" />
          <div className="absolute -right-2 top-32 w-1.5 h-14 bg-[#1e1e2e] rounded-r-full" />
          {/* Screen content */}
          <div
            className="overflow-y-auto overflow-x-hidden"
            style={{ maxHeight: fullScreen ? "72vh" : "60vh", marginTop: 0 }}
          >
            {children}
          </div>
          {/* Home indicator */}
          <div className="flex justify-center py-2 bg-inherit">
            <div className="w-24 h-1 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  if (device === "tablet") {
    return (
      <div
        className="relative shrink-0"
        style={{ width: fullScreen ? 820 : "min(768px, calc(100vw - 80px))" }}
        data-ocid="device_frame.tablet_frame"
      >
        {/* Tablet shell */}
        <div
          className="relative rounded-[24px] border-[8px] border-[#252535] shadow-[0_0_0_2px_#1a1a2a,0_24px_72px_rgba(0,0,0,0.6)] overflow-hidden"
          style={{ background: "#1a1a2a" }}
        >
          {/* Camera dot */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#2a2a3a] z-20" />
          {/* Side button */}
          <div className="absolute -right-3 top-28 w-2 h-12 bg-[#1e1e2e] rounded-r-full" />
          {/* Screen */}
          <div
            className="overflow-y-auto overflow-x-hidden pt-2"
            style={{ maxHeight: fullScreen ? "76vh" : "62vh" }}
          >
            {children}
          </div>
          {/* Bottom bar */}
          <div className="flex justify-center py-2">
            <div className="w-16 h-1 rounded-full bg-white/15" />
          </div>
        </div>
      </div>
    );
  }

  // Desktop
  return (
    <div
      className="relative shrink-0 w-full"
      style={{
        maxWidth: fullScreen ? 1280 : "100%",
        minWidth: fullScreen ? 900 : undefined,
      }}
      data-ocid="device_frame.desktop_frame"
    >
      {/* Browser chrome */}
      <div
        className="rounded-t-xl border border-b-0 border-[#252535] overflow-hidden"
        style={{ background: "#1c1c2c" }}
      >
        {/* Browser toolbar */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#2a2a3a]">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c941]" />
          </div>
          {/* Address bar */}
          <div className="flex-1 mx-2 flex items-center gap-2 bg-[#252535] rounded-md px-3 py-1">
            <div className="w-3 h-3 rounded-full bg-[#3a3a4a] shrink-0" />
            <div className="text-[10px] font-mono text-[#6a6a8a] truncate flex-1">
              bookedrankedfunded.com
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="w-6 h-4 rounded bg-[#252535]" />
            <div className="w-6 h-4 rounded bg-[#252535]" />
          </div>
        </div>
      </div>
      {/* Screen */}
      <div
        className="border border-t-0 border-[#252535] rounded-b-xl overflow-hidden"
        style={{ background: "#ffffff" }}
      >
        <div
          className="overflow-y-auto overflow-x-hidden"
          style={{ maxHeight: fullScreen ? "76vh" : "62vh" }}
        >
          {children}
        </div>
      </div>
      {/* Stand */}
      <div className="flex justify-center mt-0">
        <div className="w-24 h-3 bg-[#1c1c2c] rounded-b-lg" />
      </div>
      <div className="flex justify-center">
        <div className="w-48 h-1.5 bg-[#252535] rounded-full" />
      </div>
    </div>
  );
}

// ── DeviceFrame (main export) ──────────────────────────────────────────────────

export interface DeviceFrameProps {
  device: DeviceType;
  children: React.ReactNode;
  /** Whether to show the full screen overlay when triggered */
  showFullScreen?: boolean;
  onFullScreenClose?: () => void;
}

export default function DeviceFrame({
  device,
  children,
  showFullScreen = false,
  onFullScreenClose,
}: DeviceFrameProps) {
  return (
    <>
      <div
        className="transition-all duration-300 ease-in-out flex justify-center"
        data-ocid="device_frame.canvas_target"
      >
        <DeviceFrameInner device={device}>{children}</DeviceFrameInner>
      </div>

      {showFullScreen && (
        <FullScreenOverlay
          device={device}
          onClose={onFullScreenClose ?? (() => {})}
        >
          {children}
        </FullScreenOverlay>
      )}
    </>
  );
}

export { DeviceFrameInner };
