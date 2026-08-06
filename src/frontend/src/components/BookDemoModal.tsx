import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActor } from "@/hooks/useActor";
import {
  bookStrategyCall,
  isBookingConflict,
  loadStrategyCallAvailability,
  type StrategyCallSlot,
} from "@/lib/publicConversionApi";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const NICHES = ["Roofing", "HVAC", "Plumbing"];

interface BookDemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultNiche?: string;
}

interface FormState {
  firstName: string;
  businessName: string;
  email: string;
  phone: string;
  niche: string;
}

function groupSlots(slots: StrategyCallSlot[]) {
  return slots.reduce<Record<string, StrategyCallSlot[]>>((groups, slot) => {
    (groups[slot.dateKey] ||= []).push(slot);
    return groups;
  }, {});
}

export function BookDemoModal({
  open,
  onOpenChange,
  defaultNiche,
}: BookDemoModalProps) {
  const { actor } = useActor();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    businessName: "",
    email: "",
    phone: "",
    niche: defaultNiche ?? "",
  });
  const [slots, setSlots] = useState<StrategyCallSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStartsAt, setSelectedStartsAt] = useState<string | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const groupedSlots = useMemo(() => groupSlots(slots), [slots]);
  const dateKeys = useMemo(() => Object.keys(groupedSlots), [groupedSlots]);
  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.startsAt === selectedStartsAt) ?? null,
    [selectedStartsAt, slots],
  );

  const refreshAvailability = useCallback(async () => {
    setAvailabilityLoading(true);
    setAvailabilityError(null);
    try {
      const available = await loadStrategyCallAvailability(14);
      setSlots(available);
      setSelectedDate((current) =>
        current && available.some((slot) => slot.dateKey === current)
          ? current
          : available[0]?.dateKey ?? null,
      );
      setSelectedStartsAt((current) =>
        current && available.some((slot) => slot.startsAt === current)
          ? current
          : null,
      );
    } catch (error) {
      setSlots([]);
      setSelectedDate(null);
      setSelectedStartsAt(null);
      setAvailabilityError(
        error instanceof Error
          ? error.message
          : "Available times could not be loaded.",
      );
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setForm((current) => ({
      ...current,
      niche: current.niche || defaultNiche || "",
    }));
    void refreshAvailability();
  }, [defaultNiche, open, refreshAvailability]);

  const reset = () => {
    setStep(1);
    setForm({
      firstName: "",
      businessName: "",
      email: "",
      phone: "",
      niche: defaultNiche ?? "",
    });
    setSlots([]);
    setSelectedDate(null);
    setSelectedStartsAt(null);
    setAvailabilityError(null);
    setBookingError(null);
    setBookingLoading(false);
  };

  const close = () => {
    onOpenChange(false);
    window.setTimeout(reset, 300);
  };

  const canChooseTime = Boolean(
    form.firstName.trim() &&
      form.businessName.trim() &&
      form.email.trim() &&
      form.niche,
  );

  const confirmBooking = async () => {
    if (!selectedSlot || bookingLoading) return;
    setBookingLoading(true);
    setBookingError(null);

    try {
      const result = await bookStrategyCall({
        contactName: form.firstName,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
        niche: form.niche,
        startsAt: selectedSlot.startsAt,
        source: "book_demo_modal",
        notes: { bookingType: "strategy_call" },
      });

      if (!result.ok) {
        if (isBookingConflict(result)) {
          setSelectedStartsAt(null);
          await refreshAvailability();
          setBookingError(
            result.error ||
              "That time was just booked. Choose another available slot.",
          );
          return;
        }
        throw new Error(result.error || "The booking could not be saved.");
      }

      setStep(3);

      if (actor) {
        try {
          await actor.createLead({
            id: "",
            tenantId: "strategy_call_booking",
            name: form.firstName,
            email: form.email,
            phone: form.phone || "",
            niche: form.niche.toLowerCase(),
            status: "appointment_scheduled",
            source: "book_demo_modal",
            notes: JSON.stringify({
              publicLeadId: result.leadId,
              bookingId: result.bookingId,
              businessName: form.businessName,
              startsAt: selectedSlot.startsAt,
              timezone: selectedSlot.timezone,
              bookingType: "strategy_call",
            }),
            agentSubscriptions: [],
            createdAt: BigInt(Date.now()) * BigInt(1_000_000),
          });
        } catch (syncError) {
          console.warn("Canonical booking saved; canister mirror failed", {
            bookingId: result.bookingId,
            syncError,
          });
        }
      }
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "We couldn't save your booking. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next: boolean) => !next && close()}>
      <DialogContent
        className="bg-gray-900 border border-gray-800 text-white max-w-lg w-full p-0 overflow-hidden"
        data-ocid="book_demo.dialog"
      >
        <div className="flex border-b border-gray-800">
          {["Your Info", "Pick a Time", "Confirmed"].map((label, index) => (
            <div
              key={label}
              className={`flex-1 py-3 text-center text-xs font-semibold ${
                step === index + 1
                  ? "bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-500"
                  : "text-gray-500"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="p-6">
          {step === 1 && (
            <div>
              <DialogHeader className="mb-5">
                <DialogTitle className="text-white text-xl font-bold">
                  Book a Strategy Call
                </DialogTitle>
                <p className="text-gray-400 text-sm mt-1">
                  Tell us about your business and we'll tailor the demo.
                </p>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name">
                    <Input
                      data-ocid="book_demo.first_name.input"
                      value={form.firstName}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setForm((current) => ({
                          ...current,
                          firstName: event.target.value,
                        }))
                      }
                      placeholder="Carlos"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </Field>
                  <Field label="Business Name">
                    <Input
                      data-ocid="book_demo.business_name.input"
                      value={form.businessName}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setForm((current) => ({
                          ...current,
                          businessName: event.target.value,
                        }))
                      }
                      placeholder="Martinez Plumbing"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </Field>
                </div>

                <Field label="Email Address">
                  <Input
                    data-ocid="book_demo.email.input"
                    type="email"
                    value={form.email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="carlos@example.com"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </Field>

                <Field label="Phone Number">
                  <Input
                    data-ocid="book_demo.phone.input"
                    type="tel"
                    value={form.phone}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="(760) 555-0100"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </Field>

                <Field label="Business Type">
                  <Select
                    value={form.niche}
                    onValueChange={(value: string) =>
                      setForm((current) => ({ ...current, niche: value }))
                    }
                  >
                    <SelectTrigger
                      data-ocid="book_demo.niche.select"
                      className="bg-gray-800 border-gray-700 text-white"
                    >
                      <SelectValue placeholder="Select your niche..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {NICHES.map((niche) => (
                        <SelectItem key={niche} value={niche} className="text-white">
                          {niche}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Button
                  data-ocid="book_demo.next.primary_button"
                  onClick={() => setStep(2)}
                  disabled={!canChooseTime}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Choose a Time <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <DialogHeader className="mb-5">
                <DialogTitle className="text-white text-xl font-bold">
                  Pick a Date & Time
                </DialogTitle>
                <p className="text-gray-400 text-sm mt-1">
                  Live availability in Pacific Time.
                </p>
              </DialogHeader>

              {availabilityLoading ? (
                <Status icon={<Loader2 className="h-4 w-4 animate-spin" />}>
                  Loading available times...
                </Status>
              ) : availabilityError ? (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                  <Status icon={<AlertCircle className="h-4 w-4" />}>
                    {availabilityError}
                  </Status>
                  <Button
                    variant="outline"
                    onClick={() => void refreshAvailability()}
                    className="mt-3 w-full border-gray-700 bg-transparent"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Retry
                  </Button>
                </div>
              ) : dateKeys.length === 0 ? (
                <Status icon={<Calendar className="h-4 w-4" />}>
                  No strategy-call slots are currently available.
                </Status>
              ) : (
                <>
                  <div className="grid grid-cols-7 gap-1.5 mb-5">
                    {dateKeys.map((dateKey) => {
                      const firstSlot = groupedSlots[dateKey][0];
                      return (
                        <button
                          key={dateKey}
                          type="button"
                          data-ocid="book_demo.date.button"
                          aria-label={firstSlot.dateLabel}
                          onClick={() => {
                            setSelectedDate(dateKey);
                            setSelectedStartsAt(null);
                            setBookingError(null);
                          }}
                          className={`rounded-lg py-2 text-xs ${
                            selectedDate === dateKey
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          <span className="block text-[9px] uppercase">
                            {firstSlot.dayShort}
                          </span>
                          <span className="font-semibold text-sm">
                            {firstSlot.dayOfMonth}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedDate && (
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-300 uppercase">
                        <Clock size={14} className="text-indigo-400" />
                        {groupedSlots[selectedDate][0].dateLabel}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {groupedSlots[selectedDate].map((slot) => (
                          <button
                            key={slot.startsAt}
                            type="button"
                            data-ocid="book_demo.time.button"
                            onClick={() => {
                              setSelectedStartsAt(slot.startsAt);
                              setBookingError(null);
                            }}
                            className={`rounded-lg px-4 py-2 text-xs ${
                              selectedStartsAt === slot.startsAt
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-800 text-gray-300 border border-gray-700"
                            }`}
                          >
                            {slot.timeLabel}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-transparent border-gray-700 text-gray-300"
                >
                  <ChevronLeft size={16} className="mr-1" /> Back
                </Button>
                <Button
                  data-ocid="book_demo.confirm.primary_button"
                  onClick={() => void confirmBooking()}
                  disabled={!selectedSlot || bookingLoading || availabilityLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {bookingLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Confirm <ChevronRight size={16} className="ml-1" /></>
                  )}
                </Button>
              </div>

              {bookingError && (
                <div className="mt-3 flex gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  {bookingError}
                </div>
              )}
            </div>
          )}

          {step === 3 && selectedSlot && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You're On the Calendar!</h2>
              <p className="text-gray-300 text-sm mb-6">
                Confirmed for <strong>{selectedSlot.dateLabel}</strong> at{" "}
                <strong>{selectedSlot.timeLabel}</strong>. We'll email {form.email}.
              </p>
              <Button
                data-ocid="book_demo.close.close_button"
                onClick={close}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700"
              >
                <X size={14} className="mr-2" /> Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-gray-300 text-xs mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function Status({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400">
      {icon}
      {children}
    </div>
  );
}

interface BookDemoTriggerProps {
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  defaultNiche?: string;
}

export function BookDemoTrigger({
  label = "Book a Demo",
  variant = "outline",
  size = "lg",
  className,
  defaultNiche,
}: BookDemoTriggerProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        data-ocid="book_demo.open_modal_button"
        className={className}
      >
        <Calendar size={15} className="mr-1.5" /> {label}
      </Button>
      <BookDemoModal
        open={open}
        onOpenChange={setOpen}
        defaultNiche={defaultNiche}
      />
    </>
  );
}
