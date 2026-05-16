/**
 * Stage1AnimationCards.tsx
 * Sub-components for the Stage1DashboardSection cinematic loop.
 * Exported individually for import into the main section component.
 */

import { AnimatePresence, motion } from "motion/react";

// ─── Shared prop types ────────────────────────────────────────────────────────

export interface AccentProps {
  accentHue: number;
}

// ─── Phone Ringing Widget ─────────────────────────────────────────────────────

export function PhoneRingingWidget({
  callerName,
  callerInitials,
  phone,
  accentHue,
}: {
  callerName: string;
  callerInitials: string;
  phone: string;
  accentHue: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 flex items-center gap-4 w-full"
      style={{
        background: "oklch(0.14 0.016 280 / 0.95)",
        border: "1px solid oklch(1 0 0 / 10%)",
        boxShadow: "0 4px 24px oklch(0 0 0 / 0.4)",
      }}
    >
      <div className="relative shrink-0">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `oklch(0.58 0.22 ${accentHue} / 30%)` }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black relative z-10"
          style={{
            background: `oklch(0.42 0.16 ${accentHue} / 60%)`,
            color: `oklch(0.95 0.04 ${accentHue})`,
          }}
        >
          {callerInitials}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">
          {callerName}
        </p>
        <p className="text-xs text-muted-foreground">{phone}</p>
      </div>
      <motion.div
        className="shrink-0 text-xl"
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
        aria-hidden="true"
      >
        📞
      </motion.div>
    </motion.div>
  );
}

// ─── AI Answer Bubble ─────────────────────────────────────────────────────────

export function AiAnswerBubble({
  businessName,
  accentHue,
}: { businessName: string; accentHue: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 300 }}
      className="rounded-2xl p-4 w-full"
      style={{
        background: `oklch(0.22 0.06 ${accentHue} / 0.5)`,
        border: `1px solid oklch(0.58 0.22 ${accentHue} / 30%)`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">🤖</span>
        <span
          className="text-xs font-bold"
          style={{ color: `oklch(0.72 0.18 ${accentHue})` }}
        >
          AI Receptionist
        </span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{
            background: "oklch(0.38 0.16 155 / 30%)",
            color: "oklch(0.72 0.18 155)",
          }}
        >
          Connected
        </span>
      </div>
      <p className="text-sm text-foreground leading-relaxed">
        "Thank you for calling{" "}
        <span
          className="font-bold"
          style={{ color: `oklch(0.72 0.18 ${accentHue})` }}
        >
          {businessName}
        </span>
        , this is your AI front desk. How can I help you today?"
      </p>
      <div className="flex items-end gap-0.5 mt-3 h-5" aria-hidden="true">
        {[3, 5, 8, 6, 9, 4, 7, 5, 8, 3, 6, 9, 4, 7].map((h, i) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative bars
            key={i}
            className="w-1 rounded-full"
            style={{ background: `oklch(0.58 0.22 ${accentHue} / 70%)` }}
            animate={{ height: [`${h * 2}px`, `${h * 2 + 6}px`, `${h * 2}px`] }}
            transition={{
              duration: 0.5 + i * 0.04,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── CRM Lead Card ────────────────────────────────────────────────────────────

export function CrmLeadCard({
  callerName,
  serviceType,
  accentHue,
}: { callerName: string; serviceType: string; accentHue: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", damping: 24, stiffness: 280 }}
      className="rounded-2xl p-4 w-full"
      style={{
        background: "oklch(0.14 0.016 280 / 0.95)",
        border: "1px solid oklch(1 0 0 / 10%)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">👤</span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          CRM Lead Created
        </span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold"
          style={{
            background: "oklch(0.38 0.16 155 / 25%)",
            color: "oklch(0.72 0.18 155)",
          }}
        >
          New
        </motion.span>
      </div>
      <p className="text-sm font-black text-foreground">{callerName}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{serviceType}</p>
      <div className="flex gap-3 mt-3">
        {["Call", "SMS", "Email"].map((action, i) => (
          <motion.span
            key={action}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="text-xs px-2 py-1 rounded-lg font-semibold"
            style={{
              background: `oklch(0.22 0.04 ${accentHue} / 0.6)`,
              color: `oklch(0.72 0.16 ${accentHue})`,
            }}
          >
            {action}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Appointment Card ─────────────────────────────────────────────────────────

export function AppointmentCard({
  callerName,
  serviceType,
  appointmentTime,
  accentHue,
}: {
  callerName: string;
  serviceType: string;
  appointmentTime: string;
  accentHue: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
      className="rounded-2xl p-4 w-full"
      style={{
        background: `oklch(0.18 0.04 ${accentHue} / 0.7)`,
        border: `1px solid oklch(0.58 0.22 ${accentHue} / 25%)`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">📅</span>
        <span
          className="text-xs font-bold"
          style={{ color: `oklch(0.72 0.18 ${accentHue})` }}
        >
          Appointment Confirmed
        </span>
      </div>
      <p className="text-sm font-black text-foreground">{callerName}</p>
      <p className="text-xs text-muted-foreground">{serviceType}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm" aria-hidden="true">
          🕑
        </span>
        <span className="text-xs font-semibold text-foreground">
          {appointmentTime}
        </span>
      </div>
    </motion.div>
  );
}

// ─── SMS Bubble ───────────────────────────────────────────────────────────────

export function SmsBubble({
  businessName,
  callerName,
  appointmentTime,
}: { businessName: string; callerName: string; appointmentTime: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 320 }}
      className="rounded-2xl p-4 w-full"
      style={{
        background: "oklch(0.18 0.015 280 / 0.95)",
        border: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">📱</span>
        <span className="text-xs font-bold text-muted-foreground">
          SMS Confirmation Sent
        </span>
      </div>
      <div
        className="rounded-xl px-3 py-2.5 text-sm leading-relaxed"
        style={{
          background: "oklch(0.32 0.16 155 / 25%)",
          color: "oklch(0.88 0.04 155)",
        }}
      >
        Hi {callerName.split(" ")[0]}! Your appointment at{" "}
        <span className="font-bold">{businessName}</span> is confirmed for{" "}
        {appointmentTime}. Reply STOP to opt out.
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "oklch(0.62 0.18 155)" }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 0.8, repeat: 2 }}
        />
        <span className="text-xs" style={{ color: "oklch(0.62 0.18 155)" }}>
          Delivered via Twilio
        </span>
      </div>
    </motion.div>
  );
}

// ─── All Done Step ────────────────────────────────────────────────────────────

export function AllDoneStep() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 18, stiffness: 360 }}
        className="rounded-2xl p-6 w-full flex flex-col items-center gap-2"
        style={{
          background: "oklch(0.28 0.12 155 / 0.4)",
          border: "1px solid oklch(0.62 0.18 155 / 40%)",
        }}
      >
        <motion.div
          className="text-4xl"
          animate={{ rotate: [0, 10, -6, 0] }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
        >
          ✅
        </motion.div>
        <p
          className="text-base font-black"
          style={{ color: "oklch(0.82 0.12 155)" }}
        >
          All Done — Automatically
        </p>
        <p className="text-xs text-center text-muted-foreground">
          Call answered · CRM updated · Appointment booked · SMS sent
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
