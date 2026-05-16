import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  List,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Settings,
  Smartphone,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import type {
  Booking,
  BookingStatus,
  CalendarSyncConfig,
} from "../types/appointments";

// ── Service options by niche ────────────────────────────────────────────────
const NICHE_SERVICES: Record<string, string[]> = {
  plumber: [
    "Emergency Pipe Repair",
    "Water Heater Installation",
    "Drain Cleaning",
    "Toilet & Faucet Replacement",
    "Annual Plumbing Inspection",
    "Sewer Line Repair",
    "Water Softener Installation",
  ],
  hvac: [
    "AC Tune-Up",
    "Heating System Repair",
    "New System Installation",
    "Duct Cleaning",
    "Emergency HVAC Repair",
    "Seasonal Maintenance",
  ],
  "med-spa": [
    "Botox Treatment",
    "Hydrafacial",
    "Dermal Filler Consultation",
    "Laser Hair Removal",
    "Chemical Peel",
    "Microneedling",
    "PRP Treatment",
  ],
  restoration: [
    "Water Damage Assessment",
    "Mold Inspection",
    "Fire Damage Restoration",
    "Emergency Board-Up",
    "Structural Drying",
  ],
  "carpet-cleaning": [
    "Residential Carpet Clean",
    "Commercial Carpet Clean",
    "Upholstery Cleaning",
    "Tile & Grout Cleaning",
    "Pet Stain Removal",
  ],
  roofing: [
    "Roof Inspection",
    "Emergency Roof Repair",
    "Full Roof Replacement",
    "Storm Damage Assessment",
    "Gutter Installation",
  ],
};
const DEFAULT_SERVICES = [
  "Consultation",
  "Service Call",
  "Follow-up Visit",
  "Emergency Service",
  "Maintenance",
];

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; pill: string; dot: string }
> = {
  confirmed: {
    label: "Confirmed",
    pill: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    dot: "bg-blue-400",
  },
  completed: {
    label: "Completed",
    pill: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    pill: "bg-muted/60 text-muted-foreground border border-border",
    dot: "bg-muted-foreground",
  },
  no_show: {
    label: "No Show",
    pill: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
    dot: "bg-rose-400",
  },
  pending: {
    label: "Pending",
    pill: "status-pending",
    dot: "bg-amber-400",
  },
};

// ── Calendar pill colors by status ──────────────────────────────────────────
const CAL_PILL: Record<BookingStatus, string> = {
  confirmed: "bg-blue-500/80 text-white",
  completed: "bg-emerald-500/80 text-white",
  cancelled: "bg-muted-foreground/40 text-foreground/60",
  no_show: "bg-rose-500/80 text-white",
  pending: "bg-amber-500/80 text-white",
};

// ── Time slots (30-min) ──────────────────────────────────────────────────────
const TIME_SLOTS = Array.from({ length: 28 }, (_, i) => {
  const totalMins = 7 * 60 + i * 30;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
});

// ── Duration options ─────────────────────────────────────────────────────────
const DURATIONS = [30, 45, 60, 90, 120, 150, 180];

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(ts: number, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(ts).toLocaleString("en-US", opts);
}
function shortDate(ts: number) {
  return formatDate(ts, { month: "short", day: "numeric" });
}
function shortDateTime(ts: number) {
  return formatDate(ts, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${cfg.pill}`}
    >
      {cfg.label}
    </span>
  );
}

function CalendarSyncBadge({ synced }: { synced: boolean }) {
  return synced ? (
    <span className="sync-status-badge text-[10px]">Synced</span>
  ) : (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border">
      Unsynced
    </span>
  );
}

// ── New Booking Modal ────────────────────────────────────────────────────────
interface NewBookingModalProps {
  onClose: () => void;
  onSave: (booking: Omit<Booking, "id" | "createdAt">) => void;
  tenantId: string;
  niche?: string;
}

function NewBookingModal({
  onClose,
  onSave,
  tenantId,
  niche,
}: NewBookingModalProps) {
  const nicheKey = (niche ?? "").toLowerCase().replace(/\s+/g, "-");
  const services = NICHE_SERVICES[nicheKey] ?? DEFAULT_SERVICES;

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    serviceType: services[0],
    date: new Date().toISOString().split("T")[0],
    time: "9:00 AM",
    durationMinutes: 60,
    notes: "",
    location: "",
  });
  const [saved, setSaved] = useState(false);

  function handleSubmit() {
    if (!form.customerName || !form.date) return;
    // Parse date + time into a timestamp
    const [y, m, d] = form.date.split("-").map(Number);
    const [timePart, ampm] = form.time.split(" ");
    const [hStr, minStr] = timePart.split(":");
    let h = Number.parseInt(hStr, 10);
    const min = Number.parseInt(minStr, 10);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    const scheduledAt = new Date(y, m - 1, d, h, min).getTime();

    onSave({
      tenantId,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail,
      serviceType: form.serviceType,
      scheduledAt,
      durationMinutes: form.durationMinutes,
      status: "confirmed",
      location: form.location || undefined,
      notes: form.notes || undefined,
      calendarSyncStatus: "pending",
      reminderSent24h: false,
      reminderSent1h: false,
      noShowFollowUpSent: false,
    });
    setSaved(true);
    setTimeout(onClose, 1200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      data-ocid="new_booking.dialog"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={onClose}
      />
      <div className="relative card-dark rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-base font-bold text-foreground">
            New Appointment
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-ocid="new_booking.close_button"
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {saved ? (
          <div className="p-10 text-center">
            <CheckCircle size={40} className="mx-auto text-emerald-400 mb-3" />
            <p className="text-sm font-semibold text-foreground">
              Booking Confirmed!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              SMS & email confirmation sent to customer.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Customer info */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Customer Info
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Customer Name *"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customerName: e.target.value }))
                  }
                  data-ocid="new_booking.name_input"
                  className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={form.customerPhone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, customerPhone: e.target.value }))
                    }
                    data-ocid="new_booking.phone_input"
                    className="px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.customerEmail}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, customerEmail: e.target.value }))
                    }
                    data-ocid="new_booking.email_input"
                    className="px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Service */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Service
              </p>
              <select
                value={form.serviceType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, serviceType: e.target.value }))
                }
                data-ocid="new_booking.service_select"
                className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Date + Time */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Date & Time
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  data-ocid="new_booking.date_input"
                  className="px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <select
                  value={form.time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, time: e.target.value }))
                  }
                  data-ocid="new_booking.time_select"
                  className="px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    durationMinutes: Number(e.target.value),
                  }))
                }
                data-ocid="new_booking.duration_select"
                className="mt-2 w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} minutes
                  </option>
                ))}
              </select>
            </div>

            {/* Location + Notes */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Details
              </p>
              <input
                type="text"
                placeholder="Location / Address (optional)"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
                data-ocid="new_booking.location_input"
                className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-2"
              />
              <textarea
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                rows={2}
                data-ocid="new_booking.notes_textarea"
                className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                data-ocid="new_booking.cancel_button"
                className="flex-1 px-4 py-2 rounded-lg bg-muted/40 text-sm text-muted-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!form.customerName}
                data-ocid="new_booking.submit_button"
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Booking Detail Panel ─────────────────────────────────────────────────────
interface BookingDetailPanelProps {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (id: string, status: BookingStatus) => void;
  syncConfig: CalendarSyncConfig | null;
}

function BookingDetailPanel({
  booking,
  onClose,
  onStatusChange,
  syncConfig,
}: BookingDetailPanelProps) {
  const [rescheduling, setRescheduling] = useState(false);

  const isUpcoming = booking.scheduledAt > Date.now();
  const isPast = !isUpcoming;

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      data-ocid="booking_detail.sheet"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={onClose}
      />
      <div
        className="relative card-dark w-full max-w-md h-full overflow-y-auto animate-slide-in-left flex flex-col"
        style={{ animation: "slideInFromRight 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} />
            {booking.calendarSyncStatus === "synced" && (
              <CalendarSyncBadge synced />
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="booking_detail.close_button"
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-5">
          {/* Customer */}
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">
              {booking.customerName}
            </h3>
            <p className="text-sm text-primary font-medium mb-3">
              {booking.serviceType}
            </p>
            <div className="space-y-1.5">
              {booking.customerPhone && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone size={12} />
                  <span>{booking.customerPhone}</span>
                </div>
              )}
              {booking.customerEmail && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail size={12} />
                  <span>{booking.customerEmail}</span>
                </div>
              )}
              {booking.location && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  <span>{booking.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="card-elevated rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-primary" />
              <span className="text-xs font-medium text-foreground">
                {formatDate(booking.scheduledAt, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {formatDate(booking.scheduledAt, {
                  hour: "numeric",
                  minute: "2-digit",
                })}{" "}
                — {booking.durationMinutes} min
              </span>
            </div>
            {booking.notes && (
              <div className="pt-1 border-t border-border">
                <p className="text-xs text-muted-foreground italic">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          {/* Calendar Sync */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Calendar Sync
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 card-elevated rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-rose-500/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-rose-300">
                      G
                    </span>
                  </div>
                  <span className="text-xs text-foreground">
                    Google Calendar
                  </span>
                </div>
                {syncConfig?.isConnected && booking.googleCalendarEventId ? (
                  <span className="sync-status-badge text-[10px]">Synced</span>
                ) : (
                  <button
                    type="button"
                    data-ocid="booking_detail.google_cal_button"
                    className="text-[10px] px-2 py-1 rounded-lg bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink size={10} />
                    {syncConfig?.isConnected ? "Add Event" : "Connect"}
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between p-3 card-elevated rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-blue-300">
                      O
                    </span>
                  </div>
                  <span className="text-xs text-foreground">
                    Outlook Calendar
                  </span>
                </div>
                {booking.outlookEventId ? (
                  <span className="sync-status-badge text-[10px]">Synced</span>
                ) : (
                  <button
                    type="button"
                    data-ocid="booking_detail.outlook_cal_button"
                    className="text-[10px] px-2 py-1 rounded-lg bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink size={10} />
                    {syncConfig?.isConnected ? "Add Event" : "Connect"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Reminders */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Reminders
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Bell size={11} />
                  24h reminder
                </span>
                {booking.reminderSent24h ? (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={10} />
                    Sent
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    {isUpcoming ? "Scheduled" : "Not sent"}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Bell size={11} />
                  1h reminder
                </span>
                {booking.reminderSent1h ? (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={10} />
                    Sent
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    {isUpcoming ? "Scheduled" : "Not sent"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {!rescheduling && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                {booking.status !== "completed" && isPast && (
                  <button
                    type="button"
                    data-ocid="booking_detail.complete_button"
                    onClick={() => onStatusChange(booking.id, "completed")}
                    className="px-3 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-500/25 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={12} /> Mark Complete
                  </button>
                )}
                {booking.status !== "no_show" &&
                  isPast &&
                  booking.status !== "completed" && (
                    <button
                      type="button"
                      data-ocid="booking_detail.no_show_button"
                      onClick={() => onStatusChange(booking.id, "no_show")}
                      className="px-3 py-2 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-medium hover:bg-rose-500/25 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={12} /> No Show
                    </button>
                  )}
                {booking.status !== "cancelled" && (
                  <button
                    type="button"
                    data-ocid="booking_detail.cancel_button"
                    onClick={() => onStatusChange(booking.id, "cancelled")}
                    className="px-3 py-2 rounded-lg bg-muted/40 text-muted-foreground border border-border text-xs font-medium hover:bg-accent transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X size={12} /> Cancel
                  </button>
                )}
                {(booking.status === "confirmed" ||
                  booking.status === "pending") && (
                  <button
                    type="button"
                    data-ocid="booking_detail.reschedule_button"
                    onClick={() => setRescheduling(true)}
                    className="px-3 py-2 rounded-lg payment-action-btn text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={12} /> Reschedule
                  </button>
                )}
              </div>
            </div>
          )}

          {rescheduling && (
            <div className="card-elevated rounded-xl p-4">
              <p className="text-xs font-semibold text-foreground mb-2">
                Reschedule Appointment
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Customer will receive an updated confirmation via SMS & email.
              </p>
              <div className="space-y-2 mb-3">
                <input
                  type="date"
                  defaultValue={
                    new Date(booking.scheduledAt).toISOString().split("T")[0]
                  }
                  data-ocid="booking_detail.reschedule_date_input"
                  className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <select
                  data-ocid="booking_detail.reschedule_time_select"
                  className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduling(false)}
                  data-ocid="booking_detail.reschedule_cancel_button"
                  className="flex-1 px-3 py-2 rounded-lg bg-muted/40 text-xs text-muted-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduling(false)}
                  data-ocid="booking_detail.reschedule_confirm_button"
                  className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── No-Show Follow-Up Modal ──────────────────────────────────────────────────
interface NoShowModalProps {
  booking: Booking;
  onClose: () => void;
  onSend: (bookingId: string) => void;
}

function NoShowFollowUpModal({ booking, onClose, onSend }: NoShowModalProps) {
  const [sent, setSent] = useState(false);
  const smsText = `Hi ${booking.customerName.split(" ")[0]}, we noticed you couldn't make your ${booking.serviceType} appointment on ${shortDate(booking.scheduledAt)}. We'd love to reschedule — reply here or call us and we'll find a time that works!`;
  const emailSubject = `We missed you — reschedule your ${booking.serviceType}`;

  function handleSend() {
    setSent(true);
    setTimeout(() => {
      onSend(booking.id);
      onClose();
    }, 1400);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      data-ocid="noshow_followup.dialog"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={onClose}
      />
      <div className="relative card-dark rounded-2xl w-full max-w-md animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="text-sm font-bold text-foreground">
              No-Show Follow-Up
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="noshow_followup.close_button"
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>

        {sent ? (
          <div className="p-10 text-center">
            <CheckCircle size={40} className="mx-auto text-emerald-400 mb-3" />
            <p className="text-sm font-semibold text-foreground">
              Follow-Up Sent!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              SMS & email delivered to {booking.customerName}.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                <Smartphone size={11} />
                Draft SMS
              </p>
              <div className="p-3 card-elevated rounded-xl">
                <p className="text-xs text-foreground leading-relaxed">
                  {smsText}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                <Mail size={11} />
                Draft Email
              </p>
              <div className="p-3 card-elevated rounded-xl">
                <p className="text-xs font-medium text-foreground mb-1">
                  Subject: {emailSubject}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Hi {booking.customerName.split(" ")[0]},<br />
                  <br />
                  We missed you at your {booking.serviceType} appointment on{" "}
                  {shortDate(booking.scheduledAt)}. Life happens — we'd love to
                  get you rescheduled at a time that works for you.
                  <br />
                  <br />
                  Just reply to this email or give us a call and we'll take care
                  of it right away.
                </p>
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="Add reschedule link (optional)"
                data-ocid="noshow_followup.link_input"
                className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                data-ocid="noshow_followup.cancel_button"
                className="flex-1 px-4 py-2 rounded-lg bg-muted/40 text-sm text-muted-foreground hover:bg-accent transition-colors"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleSend}
                data-ocid="noshow_followup.send_button"
                className="flex-1 px-4 py-2 rounded-lg bg-amber-500/80 text-white text-sm font-medium hover:bg-amber-500 transition-colors"
              >
                Send Follow-Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Settings Drawer ──────────────────────────────────────────────────────────
interface SettingsDrawerProps {
  syncConfig: CalendarSyncConfig | null;
  onClose: () => void;
}

function SettingsDrawer({ syncConfig, onClose }: SettingsDrawerProps) {
  const [sms24h, setSms24h] = useState(
    "Hi {name}, just a reminder about your {service} tomorrow at {time}. Reply STOP to cancel reminders.",
  );
  const [smsEmail1h, setSmsEmail1h] = useState(
    "Hi {name}, your {service} appointment is in 1 hour. We look forward to seeing you!",
  );
  const [reminder24, setReminder24] = useState(true);
  const [reminder1h, setReminder1h] = useState(true);
  const [gcConnected, setGcConnected] = useState(
    syncConfig?.isConnected ?? false,
  );

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      data-ocid="settings.sheet"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={onClose}
      />
      <div className="relative card-dark w-full max-w-sm h-full overflow-y-auto flex flex-col border-l border-border">
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Settings size={14} />
            Appointment Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-ocid="settings.close_button"
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-6">
          {/* Calendar Sync */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Calendar Sync
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 card-elevated rounded-xl">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Google Calendar
                  </p>
                  {gcConnected && (
                    <p className="text-[10px] text-muted-foreground">
                      {syncConfig?.accountEmail ?? "Connected"}
                    </p>
                  )}
                </div>
                {gcConnected ? (
                  <div className="flex items-center gap-2">
                    <span className="sync-status-badge text-[10px]">
                      Connected
                    </span>
                    <button
                      type="button"
                      onClick={() => setGcConnected(false)}
                      data-ocid="settings.google_disconnect_button"
                      className="text-[10px] text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setGcConnected(true)}
                    data-ocid="settings.google_connect_button"
                    className="text-xs px-3 py-1.5 rounded-lg bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink size={11} /> Connect
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between p-3 card-elevated rounded-xl">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Outlook Calendar
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Microsoft 365 / Outlook
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="settings.outlook_connect_button"
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-colors flex items-center gap-1"
                >
                  <ExternalLink size={11} /> Connect
                </button>
              </div>
              {gcConnected && (
                <div className="p-3 card-elevated rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">Last sync</p>
                    <p className="text-xs text-foreground">
                      {syncConfig?.lastSyncAt
                        ? shortDateTime(syncConfig.lastSyncAt)
                        : "Never"}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid="settings.resync_button"
                    className="w-full px-3 py-2 rounded-lg bg-muted/40 text-xs text-muted-foreground hover:bg-accent transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={11} /> Manual Re-sync
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reminder Config */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Automated Reminders
            </p>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 p-3 card-elevated rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell size={12} className="text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      24h Reminder
                    </span>
                  </div>
                  <textarea
                    value={sms24h}
                    onChange={(e) => setSms24h(e.target.value)}
                    rows={3}
                    data-ocid="settings.reminder_24h_textarea"
                    className="w-full text-xs px-2 py-1.5 rounded-lg bg-muted/40 border border-border text-foreground resize-none focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={reminder24}
                    onChange={() => setReminder24(!reminder24)}
                    data-ocid="settings.reminder_24h_toggle"
                    className="sr-only"
                  />
                  <div
                    className={`w-8 h-4 rounded-full transition-colors ${reminder24 ? "bg-primary" : "bg-muted"}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white shadow transition-transform mt-0.5 ml-0.5 ${reminder24 ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </label>
              </div>
              <div className="flex items-start justify-between gap-2 p-3 card-elevated rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell size={12} className="text-amber-400" />
                    <span className="text-xs font-medium text-foreground">
                      1h Reminder
                    </span>
                  </div>
                  <textarea
                    value={smsEmail1h}
                    onChange={(e) => setSmsEmail1h(e.target.value)}
                    rows={2}
                    data-ocid="settings.reminder_1h_textarea"
                    className="w-full text-xs px-2 py-1.5 rounded-lg bg-muted/40 border border-border text-foreground resize-none focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={reminder1h}
                    onChange={() => setReminder1h(!reminder1h)}
                    data-ocid="settings.reminder_1h_toggle"
                    className="sr-only"
                  />
                  <div
                    className={`w-8 h-4 rounded-full transition-colors ${reminder1h ? "bg-primary" : "bg-muted"}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white shadow transition-transform mt-0.5 ml-0.5 ${reminder1h ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Calendar View ────────────────────────────────────────────────────────────
interface CalendarViewProps {
  bookings: Booking[];
  onDayClick: (date: Date) => void;
  selectedDate: Date | null;
}

function CalendarView({
  bookings,
  onDayClick,
  selectedDate,
}: CalendarViewProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const bookingsByDay = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of bookings) {
      const d = new Date(b.scheduledAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate().toString();
        if (!map[key]) map[key] = [];
        map[key].push(b);
      }
    }
    return map;
  }, [bookings, year, month]);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  return (
    <div data-ocid="calendar.panel">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{monthLabel}</h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={prevMonth}
            data-ocid="calendar.pagination_prev"
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronLeft size={14} className="text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            data-ocid="calendar.pagination_next"
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronRight size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`pad-${idx.toString()}`} />;
          const cellDate = new Date(year, month, day);
          const isToday = isSameDay(cellDate, today);
          const isSel = selectedDate && isSameDay(cellDate, selectedDate);
          const dayBookings = bookingsByDay[day.toString()] ?? [];
          const hasBookings = dayBookings.length > 0;

          return (
            <button
              key={day}
              type="button"
              data-ocid={`calendar.day.${day}`}
              onClick={() => onDayClick(cellDate)}
              className={`relative flex flex-col items-center p-1 min-h-[56px] rounded-lg transition-colors text-left ${
                isSel
                  ? "bg-primary/20 border border-primary/50"
                  : isToday
                    ? "bg-accent border border-primary/30"
                    : hasBookings
                      ? "calendar-day-booked hover:bg-accent"
                      : "hover:bg-accent border border-transparent"
              }`}
            >
              <span
                className={`text-xs font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}
              >
                {day}
              </span>
              {dayBookings.slice(0, 2).map((b) => (
                <div
                  key={b.id}
                  className={`text-[9px] px-1 py-0.5 rounded-sm w-full truncate mb-0.5 ${CAL_PILL[b.status]}`}
                >
                  {formatDate(b.scheduledAt, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              ))}
              {dayBookings.length > 2 && (
                <span className="text-[9px] text-muted-foreground">
                  +{dayBookings.length - 2}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const {
    currentTenantId,
    bookings: allBookings,
    addBooking,
    updateBookingStatus,
    demoInfo,
  } = useApp();

  const [view, setView] = useState<"calendar" | "list">("list");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all",
  );
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [noShowBooking, setNoShowBooking] = useState<Booking | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCalDate, setSelectedCalDate] = useState<Date | null>(null);
  const noShowTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bookings = allBookings.filter((b) => b.tenantId === currentTenantId);

  // No-show detection: check every 30s for confirmed bookings past their time
  useEffect(() => {
    function check() {
      const now = Date.now();
      for (const b of bookings) {
        if (
          b.status === "confirmed" &&
          b.scheduledAt + b.durationMinutes * 60000 < now
        ) {
          setNoShowBooking(b);
          break;
        }
      }
    }
    check();
    noShowTimerRef.current = setInterval(check, 30000);
    return () => {
      if (noShowTimerRef.current) clearInterval(noShowTimerRef.current);
    };
  }, [bookings]);

  const filtered = useMemo(() => {
    const base =
      statusFilter === "all"
        ? bookings
        : bookings.filter((b) => b.status === statusFilter);
    return [...base].sort((a, b) => b.scheduledAt - a.scheduledAt);
  }, [bookings, statusFilter]);

  const potentialNoShows = useMemo(() => {
    const now = Date.now();
    return bookings.filter(
      (b) =>
        b.status === "confirmed" &&
        b.scheduledAt + b.durationMinutes * 60000 < now,
    );
  }, [bookings]);

  const calDayBookings = useMemo(() => {
    if (!selectedCalDate) return [];
    return bookings.filter((b) =>
      isSameDay(new Date(b.scheduledAt), selectedCalDate),
    );
  }, [bookings, selectedCalDate]);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    noShow: bookings.filter((b) => b.status === "no_show").length,
  };

  // Stub calendar sync config
  const syncConfig: CalendarSyncConfig = {
    tenantId: currentTenantId,
    provider: "google",
    isConnected: false,
    syncEnabled: true,
    lastSyncAt: Date.now() - 3600000,
  };

  function handleStatusChange(bookingId: string, status: BookingStatus) {
    updateBookingStatus(bookingId, status);
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking((prev) => (prev ? { ...prev, status } : null));
    }
  }

  function handleFollowUpSent(bookingId: string) {
    // Mark follow-up as sent (no-show status already set)
    updateBookingStatus(bookingId, "no_show");
  }

  const niche = demoInfo?.niche ?? "";

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Appointments</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage bookings, reminders, and calendar sync
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            data-ocid="appointments.settings_button"
            className="p-2 rounded-lg bg-muted/40 border border-border hover:bg-accent transition-colors"
            aria-label="Settings"
          >
            <Settings size={15} className="text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            data-ocid="appointments.add_button"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={14} />
            New Booking
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: Calendar,
            color: "text-primary",
          },
          {
            label: "Confirmed",
            value: stats.confirmed,
            icon: Clock,
            color: "text-blue-400",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "text-emerald-400",
          },
          {
            label: "No Shows",
            value: stats.noShow,
            icon: AlertTriangle,
            color: "text-rose-400",
          },
        ].map((s) => (
          <div key={s.label} className="card-dark rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={14} className={s.color} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Potential No-Show alert */}
      {potentialNoShows.length > 0 && (
        <div
          className="card-dark rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-3"
          data-ocid="appointments.noshow_alert"
        >
          <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-amber-300">
              Potential No-Show Detected
            </p>
            <div className="mt-1 space-y-1">
              {potentialNoShows.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-xs text-amber-200/80">
                    {b.customerName} — {b.serviceType} (
                    {shortDateTime(b.scheduledAt)})
                  </span>
                  <button
                    type="button"
                    data-ocid="appointments.noshow_mark_button"
                    onClick={() => {
                      handleStatusChange(b.id, "no_show");
                      setNoShowBooking(b);
                    }}
                    className="text-[11px] px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors shrink-0"
                  >
                    Mark No-Show
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View toggle + filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setView("list")}
            data-ocid="appointments.list_tab"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List size={12} /> List
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            data-ocid="appointments.calendar_tab"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === "calendar" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Calendar size={12} /> Calendar
          </button>
        </div>

        {view === "list" && (
          <div className="flex gap-1.5 flex-wrap">
            {(
              [
                "all",
                "confirmed",
                "pending",
                "completed",
                "no_show",
                "cancelled",
              ] as const
            ).map((f) => (
              <button
                key={f}
                type="button"
                data-ocid={`appointments.filter.${f}`}
                onClick={() => setStatusFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  statusFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-accent border border-border"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f === "no_show"
                    ? "No Show"
                    : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Calendar View */}
      {view === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card-dark rounded-2xl p-5">
            <CalendarView
              bookings={bookings}
              onDayClick={(date) => setSelectedCalDate(date)}
              selectedDate={selectedCalDate}
            />
          </div>
          <div className="card-dark rounded-2xl p-5">
            {selectedCalDate ? (
              <>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {selectedCalDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                {calDayBookings.length === 0 ? (
                  <div
                    className="text-center py-8"
                    data-ocid="calendar.empty_state"
                  >
                    <Calendar
                      size={28}
                      className="mx-auto text-muted-foreground/40 mb-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      No bookings this day
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowNewModal(true)}
                      data-ocid="calendar.add_button"
                      className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-colors"
                    >
                      + Add Booking
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {calDayBookings.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        data-ocid="calendar.booking_item"
                        onClick={() => setSelectedBooking(b)}
                        className="w-full text-left p-3 card-elevated rounded-xl hover:bg-accent transition-colors appointment-slot"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground truncate">
                            {b.customerName}
                          </span>
                          <StatusBadge status={b.status} />
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {b.serviceType}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {formatDate(b.scheduledAt, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}{" "}
                          · {b.durationMinutes}min
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Calendar
                  size={28}
                  className="mx-auto text-muted-foreground/40 mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Select a day to see bookings
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="space-y-2" data-ocid="appointments.list">
          {filtered.length === 0 ? (
            <div
              className="card-dark rounded-2xl p-14 text-center"
              data-ocid="appointments.empty_state"
            >
              <Calendar
                size={36}
                className="mx-auto text-muted-foreground/40 mb-3"
              />
              <p className="text-sm font-medium text-foreground">
                No bookings found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {statusFilter === "all"
                  ? "Create your first booking to get started."
                  : `No ${statusFilter.replace("_", " ")} bookings.`}
              </p>
              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                data-ocid="appointments.empty_add_button"
                className="mt-4 text-xs px-4 py-2 rounded-lg bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-colors"
              >
                + New Booking
              </button>
            </div>
          ) : (
            filtered.map((booking, idx) => {
              const isPast = booking.scheduledAt < Date.now();
              return (
                <div
                  key={booking.id}
                  data-ocid={`appointments.item.${idx + 1}`}
                  className={`card-dark w-full text-left rounded-xl p-4 hover:bg-card/80 transition-colors cursor-pointer ${
                    booking.status === "confirmed"
                      ? "appointment-confirmed"
                      : ""
                  } ${booking.status === "pending" ? "appointment-pending" : ""} ${
                    booking.status === "completed"
                      ? "appointment-available"
                      : ""
                  }`}
                  onClick={() => setSelectedBooking(booking)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedBooking(booking);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${STATUS_CONFIG[booking.status].dot}`}
                        />
                        <p className="text-sm font-semibold text-foreground truncate">
                          {booking.customerName}
                        </p>
                        <StatusBadge status={booking.status} />
                        {booking.calendarSyncStatus === "synced" && (
                          <CalendarSyncBadge synced />
                        )}
                      </div>
                      <p className="text-xs text-primary">
                        {booking.serviceType}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar size={11} />
                          {shortDateTime(booking.scheduledAt)}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={11} />
                          {booking.durationMinutes} min
                        </span>
                        {booking.customerPhone && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone size={11} />
                            {booking.customerPhone}
                          </span>
                        )}
                      </div>
                      {booking.location && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 truncate">
                          <MapPin size={10} />
                          {booking.location}
                        </p>
                      )}
                      {booking.notes && (
                        <p className="text-xs text-muted-foreground mt-1 italic truncate">
                          {booking.notes}
                        </p>
                      )}
                    </div>
                    <div
                      className="flex flex-col items-end gap-1.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      {booking.status !== "completed" &&
                        booking.status !== "cancelled" && (
                          <div className="flex gap-1">
                            {isPast && booking.status !== "no_show" && (
                              <button
                                type="button"
                                data-ocid={`appointments.complete_button.${idx + 1}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(booking.id, "completed");
                                }}
                                className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                                aria-label="Mark complete"
                              >
                                <CheckCircle size={12} />
                              </button>
                            )}
                            {isPast && booking.status !== "no_show" && (
                              <button
                                type="button"
                                data-ocid={`appointments.noshow_button.${idx + 1}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(booking.id, "no_show");
                                  setNoShowBooking(booking);
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-colors"
                                aria-label="Mark no-show"
                              >
                                <XCircle size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      {booking.status === "no_show" &&
                        !booking.noShowFollowUpSent && (
                          <button
                            type="button"
                            data-ocid={`appointments.followup_button.${idx + 1}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setNoShowBooking(booking);
                            }}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-colors flex items-center gap-1"
                          >
                            <MessageSquare size={10} />
                            Follow-up
                          </button>
                        )}
                      {booking.noShowFollowUpSent && (
                        <span className="text-[10px] text-muted-foreground">
                          Follow-up sent
                        </span>
                      )}
                      <button
                        type="button"
                        data-ocid={`appointments.edit_button.${idx + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg payment-action-btn"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modals & Panels */}
      {showNewModal && (
        <NewBookingModal
          onClose={() => setShowNewModal(false)}
          onSave={(b) => {
            addBooking(b);
          }}
          tenantId={currentTenantId}
          niche={niche}
        />
      )}

      {selectedBooking && (
        <BookingDetailPanel
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          syncConfig={syncConfig}
        />
      )}

      {noShowBooking &&
        noShowBooking.status === "no_show" &&
        !noShowBooking.noShowFollowUpSent && (
          <NoShowFollowUpModal
            booking={noShowBooking}
            onClose={() => setNoShowBooking(null)}
            onSend={handleFollowUpSent}
          />
        )}

      {showSettings && (
        <SettingsDrawer
          syncConfig={syncConfig}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
