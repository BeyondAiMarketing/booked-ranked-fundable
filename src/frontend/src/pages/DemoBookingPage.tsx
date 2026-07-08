/**
 * DemoBookingPage — public demo booking page matched to a lead by the unique
 * CTA token embedded in a roofer campaign step's CTA link.
 *
 * Route: /demo/$ctaToken (public, no auth, no AppLayout).
 *
 * 3-step flow:
 *   1. Name + email (pre-filled if the CTA token matched a lead)
 *   2. Pick a time slot (next 14 days, 4 slots/day)
 *   3. Confirmation with booking details + Add to Calendar link
 *
 * The page reads the ctaToken from the route params, looks up the lead via
 * useDemoBooking(ctaToken), and creates the booking via useCreateDemoBooking.
 */

import {
  useCreateDemoBooking,
  useDemoBooking,
} from "@/hooks/useRooferCampaign";
import type { DemoBooking } from "@/integrations/roofer-campaign/types";
import { useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ─── Slot generation ────────────────────────────────────────────────────────

interface TimeSlot {
  /** ISO 8601 string for the slot start */
  iso: string;
  /** Display label, e.g. "9:00 AM" */
  label: string;
}

interface DaySlots {
  /** Display header, e.g. "Mon Jul 7" */
  header: string;
  /** ISO date (YYYY-MM-DD) used as a stable key */
  dateKey: string;
  slots: TimeSlot[];
}

const SLOT_HOURS = [9, 11, 13, 15]; // 9 AM, 11 AM, 1 PM, 3 PM

function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:00 ${period}`;
}

function formatDayHeader(date: Date): string {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `${weekday} ${month} ${day}`;
}

/**
 * Build the next 14 days of selectable slots, skipping today if it is already
 * past the last slot hour (so roofers landing in the evening see tomorrow+).
 */
function buildAvailableSlots(): DaySlots[] {
  const days: DaySlots[] = [];
  const now = new Date();
  const startDay = now.getHours() >= SLOT_HOURS[SLOT_HOURS.length - 1] ? 1 : 0;

  for (let offset = startDay; days.length < 14; offset++) {
    const day = new Date(now);
    day.setDate(now.getDate() + offset);
    day.setHours(0, 0, 0, 0);

    const dateKey = day.toISOString().slice(0, 10);
    const slots: TimeSlot[] = SLOT_HOURS.map((hour) => {
      const slotDate = new Date(day);
      slotDate.setHours(hour, 0, 0, 0);
      return {
        iso: slotDate.toISOString(),
        label: formatHour(hour),
      };
    });

    days.push({
      header: formatDayHeader(day),
      dateKey,
      slots,
    });
  }
  return days;
}

// ─── Google Calendar link ───────────────────────────────────────────────────

function googleCalendarLink(slotIso: string): string {
  const start = new Date(slotIso);
  const end = new Date(start.getTime() + 30 * 60 * 1000); // 30-min demo

  // Google Calendar expects UTC times formatted as YYYYMMDDTHHmmssZ
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

  const text = "Booked Ranked Fundable Demo";
  const details =
    "Your demo of the Booked Ranked Fundable platform. We'll walk through booking, ranking, and funding for your roofing crew. A confirmation email and a reminder will arrive before the call.";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text,
    dates: `${fmt(start)}/${fmt(end)}`,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ─── Step indicator ─────────────────────────────────────────────────────────

const STEPS = ["Your details", "Pick a time", "You're booked"] as const;

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-smooth",
                  isDone
                    ? "border-transparent bg-primary text-primary-foreground"
                    : isActive
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-muted text-muted-foreground",
                ].join(" ")}
                aria-current={isActive ? "step" : undefined}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={[
                  "hidden text-sm font-medium sm:inline",
                  isActive ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "h-px w-8 sm:w-12",
                  isDone ? "bg-primary" : "bg-border",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page shell ─────────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Subtle top accent — warm gold gradient matching the campaign accent */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.75 0.16 75) 0%, oklch(0.58 0.22 290) 100%)",
        }}
        aria-hidden
      />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-[600px]">{children}</div>
      </main>
      <footer className="px-4 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Booked Ranked Fundable
      </footer>
    </div>
  );
}

// ─── Brand header ───────────────────────────────────────────────────────────

function BrandHeader() {
  return (
    <div className="mb-8 text-center">
      <div
        className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        aria-hidden
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "oklch(0.75 0.16 75)" }}
        />
        Booked · Ranked · Fundable
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Book your demo
      </h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        A 15-minute walkthrough of how we book, rank, and fund roofing crews.
      </p>
    </div>
  );
}

// ─── Loading state ───────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <PageShell>
      <BrandHeader />
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your booking link…
        </p>
      </div>
    </PageShell>
  );
}

// ─── Invalid token state ────────────────────────────────────────────────────

function InvalidTokenState() {
  return (
    <PageShell>
      <BrandHeader />
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-base font-medium text-foreground">
          This booking link is no longer valid.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please contact us directly and we'll get you set up.
        </p>
        <a
          href="mailto:hello@bookedrankedfundable.com"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
          data-ocid="demo.contact_link"
        >
          <Mail className="h-4 w-4" />
          hello@bookedrankedfundable.com
        </a>
      </div>
    </PageShell>
  );
}

// ─── Step 1: Name + Email ───────────────────────────────────────────────────

interface Step1Props {
  name: string;
  email: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onContinue: () => void;
}

function Step1NameEmail({
  name,
  email,
  onNameChange,
  onEmailChange,
  onContinue,
}: Step1Props) {
  const [touched, setTouched] = useState<{ name: boolean; email: boolean }>({
    name: false,
    email: false,
  });

  const nameError =
    touched.name && name.trim().length === 0 ? "Please enter your name." : "";
  const emailError =
    touched.email && email.trim().length === 0
      ? "Please enter your email."
      : touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? "Please enter a valid email."
        : "";

  const canContinue =
    name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-5">
        <div>
          <label
            htmlFor="demo-name"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Roofer name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="demo-name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              placeholder="e.g. Mike Rodriguez"
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-ocid="demo.name_input"
              autoComplete="name"
            />
          </div>
          {nameError && (
            <p
              className="mt-1.5 text-xs text-destructive"
              data-ocid="demo.name.field_error"
            >
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="demo-email"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Roofer email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="demo-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="e.g. mike@apexroofing.com"
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-ocid="demo.email_input"
              autoComplete="email"
            />
          </div>
          {emailError && (
            <p
              className="mt-1.5 text-xs text-destructive"
              data-ocid="demo.email.field_error"
            >
              {emailError}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          data-ocid="demo.continue_button"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Time slots ──────────────────────────────────────────────────────

interface Step2Props {
  days: DaySlots[];
  selectedIso: string | null;
  onSelect: (iso: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

function Step2TimeSlots({
  days,
  selectedIso,
  onSelect,
  onConfirm,
  onBack,
  isSubmitting,
  submitError,
}: Step2Props) {
  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="mb-1 text-lg font-semibold text-foreground">
        Pick a time for your demo
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        All times are in your local timezone. The demo takes about 15 minutes.
      </p>

      <div className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
        {days.map((day) => (
          <div key={day.dateKey}>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {day.header}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {day.slots.map((slot) => {
                const isSelected = selectedIso === slot.iso;
                return (
                  <button
                    key={slot.iso}
                    type="button"
                    onClick={() => onSelect(slot.iso)}
                    aria-pressed={isSelected}
                    className={[
                      "inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-smooth",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted",
                    ].join(" ")}
                    data-ocid={`demo.slot.${day.dateKey}.${slot.label.replace(/\s/g, "").toLowerCase()}`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {submitError && (
        <p
          className="mt-4 text-sm text-destructive"
          data-ocid="demo.confirm.error_state"
        >
          {submitError}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-smooth hover:bg-muted disabled:opacity-50"
          data-ocid="demo.back_button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!selectedIso || isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          data-ocid="demo.confirm_button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Booking…
            </>
          ) : (
            "Confirm booking"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Confirmation ───────────────────────────────────────────────────

interface Step3Props {
  booking: DemoBooking;
  campaignName?: string;
}

function Step3Confirmation({ booking, campaignName }: Step3Props) {
  const slotDate = new Date(booking.slotIso);
  const dateLabel = slotDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeLabel = slotDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const calLink = useMemo(
    () => googleCalendarLink(booking.slotIso),
    [booking.slotIso],
  );

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">You're booked!</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        We've reserved your demo slot.
      </p>

      <div className="mt-6 space-y-3 rounded-lg border border-border bg-background p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Name
          </span>
          <span className="text-sm font-medium text-foreground">
            {booking.name}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Email
          </span>
          <span className="break-words text-sm font-medium text-foreground">
            {booking.email}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Date
          </span>
          <span className="text-sm font-medium text-foreground">
            {dateLabel}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Time
          </span>
          <span className="text-sm font-medium text-foreground">
            {timeLabel}
          </span>
        </div>
        {campaignName && (
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Campaign
            </span>
            <span className="break-words text-sm font-medium text-foreground">
              {campaignName}
            </span>
          </div>
        )}
      </div>

      <a
        href={calLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-smooth hover:bg-primary/20"
        data-ocid="demo.add_to_calendar_button"
      >
        <Calendar className="h-4 w-4" />
        Add to Calendar
      </a>

      <p className="mt-5 text-xs text-muted-foreground">
        You'll get a confirmation email and a reminder before your demo.
      </p>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function DemoBookingPage() {
  const { ctaToken } = useParams({ from: "/demo/$ctaToken" });
  const { data: lookup, isLoading } = useDemoBooking(ctaToken);
  const createBooking = useCreateDemoBooking(ctaToken);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const days = useMemo(() => buildAvailableSlots(), []);

  // Pre-fill name + email when the CTA token matches a lead. The lookup hook
  // returns a DemoBooking (which may have empty name/email if the lead hasn't
  // booked yet) — we pre-fill from whatever is present.
  useEffect(() => {
    if (lookup) {
      if (lookup.name) setName(lookup.name);
      if (lookup.email) setEmail(lookup.email);
    }
  }, [lookup]);

  // Invalid token: the demo fallback returns null only for unknown/empty
  // tokens; a real backend null means the token didn't match a lead.
  const tokenInvalid = !isLoading && lookup === null;

  if (isLoading) return <LoadingState />;
  if (tokenInvalid) return <InvalidTokenState />;

  const handleContinue = () => setStep(2);

  const handleBack = () => setStep(1);

  const handleConfirm = async () => {
    if (!selectedIso) return;
    setSubmitError(null);
    try {
      await createBooking.mutateAsync({
        ctaToken,
        name: name.trim(),
        email: email.trim(),
        slotIso: selectedIso,
      });
      setStep(3);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong creating your booking. Please try again.",
      );
    }
  };

  // After a successful booking, the mutation's data holds the confirmed booking.
  const confirmedBooking = createBooking.data ?? null;

  return (
    <PageShell>
      <BrandHeader />
      <div className="mb-6">
        <StepIndicator current={step} />
      </div>

      {step === 1 && (
        <Step1NameEmail
          name={name}
          email={email}
          onNameChange={setName}
          onEmailChange={setEmail}
          onContinue={handleContinue}
        />
      )}

      {step === 2 && (
        <Step2TimeSlots
          days={days}
          selectedIso={selectedIso}
          onSelect={setSelectedIso}
          onConfirm={handleConfirm}
          onBack={handleBack}
          isSubmitting={createBooking.isPending}
          submitError={submitError}
        />
      )}

      {step === 3 && confirmedBooking && (
        <Step3Confirmation
          booking={confirmedBooking}
          campaignName="Booked Ranked Fundable Demo"
        />
      )}

      {step === 3 && !confirmedBooking && (
        <Step3Confirmation
          booking={{
            id: `booking-${ctaToken}`,
            campaignId: lookup?.campaignId ?? "",
            leadId: lookup?.leadId ?? "",
            ctaToken,
            name: name.trim(),
            email: email.trim(),
            slotIso: selectedIso ?? "",
            confirmed: true,
            createdAt: BigInt(Date.now()),
            confirmedAt: BigInt(Date.now()),
          }}
        />
      )}
    </PageShell>
  );
}
