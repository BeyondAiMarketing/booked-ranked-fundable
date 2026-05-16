/**
 * BookingConfirmationBubble — iPhone SMS-style incoming message bubble.
 * Looks exactly like an iMessage from the AI Receptionist.
 * Slides up from bottom-left. Auto-dismisses after 12s or on tap.
 */

import { AnimatePresence, motion } from "motion/react";

export interface BookingConfirmationBubbleProps {
  businessName: string;
  callerName: string;
  appointmentTime: string; // e.g. "Today, 1–3 PM"
  serviceName: string; // e.g. "Plumbing Emergency"
  visible: boolean;
  onDismiss: () => void;
}

const SMS_BUBBLE_CSS = `
.brf-sms-bubble {
  position: relative;
}
.brf-sms-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 18px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 4px solid transparent;
  border-top: 10px solid #1a8cff;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
`;

export default function BookingConfirmationBubble({
  businessName,
  callerName,
  appointmentTime,
  serviceName,
  visible,
  onDismiss,
}: BookingConfirmationBubbleProps) {
  // No auto-dismiss — bubble stays visible until parent calls onDismiss (e.g. user taps Next)

  const smsMessage = `Your appointment is set for ${appointmentTime}! I’ve added it to your calendar and sent you a confirmation. Can’t wait to see you at ${businessName}! 📅`;

  return (
    <>
      <style>{SMS_BUBBLE_CSS}</style>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 340 }}
            className="fixed z-50 bottom-4 left-4"
            style={{ maxWidth: 280 }}
            data-ocid="demo.booking_confirmation.toast"
          >
            {/* Sender label */}
            <div className="mb-1.5 flex items-center gap-1.5 pl-1">
              <span
                className="text-xs font-bold"
                style={{ color: "oklch(0.62 0.02 280)" }}
              >
                AI Receptionist ✓
              </span>
            </div>

            {/* SMS bubble */}
            <button
              type="button"
              onClick={onDismiss}
              className="brf-sms-bubble block w-full text-left px-4 pt-3 pb-3.5 rounded-[18px] rounded-bl-[4px] active:opacity-80 transition-opacity"
              style={{
                background: "#1a8cff",
                boxShadow:
                  "0 4px 20px rgba(26, 140, 255, 0.4), 0 2px 8px rgba(0,0,0,0.3)",
              }}
              aria-label="Dismiss booking confirmation"
              data-ocid="demo.booking_confirmation.close_button"
            >
              <p className="text-sm font-semibold leading-relaxed text-white">
                {smsMessage}
              </p>
              {/* Tiny meta info */}
              <p
                className="mt-2 text-[10px] font-medium"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {callerName} · {serviceName}
              </p>
            </button>

            {/* "Tap to dismiss" hint */}
            <p
              className="mt-2 text-center text-[10px] pl-1"
              style={{ color: "oklch(0.45 0.02 280)" }}
            >
              Tap to dismiss
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
