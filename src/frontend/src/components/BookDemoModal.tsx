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
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const NICHES = [
  "Plumbing",
  "Med Spa",
  "HVAC",
  "Restoration",
  "Roofing",
  "Carpet Cleaning",
];

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let d = new Date(today);
  d.setDate(d.getDate() + 1);
  while (dates.length < 14) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      dates.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

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

export function BookDemoModal({
  open,
  onOpenChange,
  defaultNiche,
}: BookDemoModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    businessName: "",
    email: "",
    phone: "",
    niche: defaultNiche ?? "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const availableDates = getAvailableDates();

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setForm({
        firstName: "",
        businessName: "",
        email: "",
        phone: "",
        niche: defaultNiche ?? "",
      });
      setSelectedDate(null);
      setSelectedTime(null);
    }, 300);
  };

  const canProceedStep1 =
    form.firstName.trim() &&
    form.businessName.trim() &&
    form.email.trim() &&
    form.niche;

  const canProceedStep2 = selectedDate !== null && selectedTime !== null;

  const formatConfirmDate = () => {
    if (!selectedDate) return "";
    const dayName = DAYS_SHORT[selectedDate.getDay()];
    const month = MONTHS[selectedDate.getMonth()];
    const day = selectedDate.getDate();
    return `${dayName}, ${month} ${day}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-gray-900 border border-gray-800 text-white max-w-lg w-full p-0 overflow-hidden"
        data-ocid="book_demo.dialog"
      >
        {/* Step indicator */}
        <div className="flex items-center gap-0 border-b border-gray-800">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 py-3 text-center text-xs font-semibold transition-colors ${
                s === step
                  ? "bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-500"
                  : s < step
                    ? "text-gray-400 bg-gray-800/30"
                    : "text-gray-600 bg-transparent"
              }`}
            >
              {s < step ? "✓ " : ""}
              {s === 1 ? "Your Info" : s === 2 ? "Pick a Time" : "Confirmed"}
            </div>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader className="mb-5">
                  <DialogTitle className="text-white text-xl font-bold">
                    Book a Strategy Call
                  </DialogTitle>
                  <p className="text-gray-400 text-sm mt-1">
                    Tell us about your business and we'll tailor the demo to
                    your specific goals.
                  </p>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 text-xs mb-1.5 block">
                        First Name
                      </Label>
                      <Input
                        data-ocid="book_demo.first_name.input"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, firstName: e.target.value }))
                        }
                        placeholder="Carlos"
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs mb-1.5 block">
                        Business Name
                      </Label>
                      <Input
                        data-ocid="book_demo.business_name.input"
                        value={form.businessName}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            businessName: e.target.value,
                          }))
                        }
                        placeholder="Martinez Plumbing"
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300 text-xs mb-1.5 block">
                      Email Address
                    </Label>
                    <Input
                      data-ocid="book_demo.email.input"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="carlos@martinezplumbing.com"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-xs mb-1.5 block">
                      Phone Number
                    </Label>
                    <Input
                      data-ocid="book_demo.phone.input"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="(760) 555-0100"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-xs mb-1.5 block">
                      Business Type
                    </Label>
                    <Select
                      value={form.niche}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, niche: v }))
                      }
                    >
                      <SelectTrigger
                        data-ocid="book_demo.niche.select"
                        className="bg-gray-800 border-gray-700 text-white focus:ring-indigo-500"
                      >
                        <SelectValue placeholder="Select your niche..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {NICHES.map((n) => (
                          <SelectItem
                            key={n}
                            value={n}
                            className="text-white focus:bg-indigo-600/30"
                          >
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    data-ocid="book_demo.next.primary_button"
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 mt-2 font-semibold"
                  >
                    Choose a Time <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader className="mb-5">
                  <DialogTitle className="text-white text-xl font-bold">
                    Pick a Date & Time
                  </DialogTitle>
                  <p className="text-gray-400 text-sm mt-1">
                    All times are in Pacific Time.
                  </p>
                </DialogHeader>

                {/* Date grid */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={14} className="text-indigo-400" />
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Available Dates
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {availableDates.slice(0, 14).map((date) => {
                      const isSelected =
                        selectedDate?.toDateString() === date.toDateString();
                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          data-ocid="book_demo.date.button"
                          className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-all ${
                            isSelected
                              ? "bg-indigo-600 text-white font-bold"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                          }`}
                        >
                          <span className="text-[9px] uppercase tracking-wider opacity-70">
                            {DAYS_SHORT[date.getDay()]}
                          </span>
                          <span className="font-semibold text-sm">
                            {date.getDate()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-indigo-400" />
                      <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Available Times
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          data-ocid="book_demo.time.button"
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedTime === slot
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button
                    data-ocid="book_demo.back.secondary_button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Back
                  </Button>
                  <Button
                    data-ocid="book_demo.confirm.primary_button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    Confirm Booking <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  You're On the Calendar!
                </h2>
                <p className="text-gray-300 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                  Your strategy call is confirmed for{" "}
                  <span className="text-white font-semibold">
                    {formatConfirmDate()} at {selectedTime}
                  </span>
                  . We'll send a confirmation to{" "}
                  <span className="text-indigo-300">{form.email}</span>.
                </p>

                <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-4 text-left mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                    What to expect
                  </p>
                  <ul className="space-y-2">
                    {[
                      "30-minute personalized walkthrough",
                      `Tailored to ${form.niche || "your niche"} businesses`,
                      "Live demo of your most relevant features",
                      "Q&A with no hard sell — just answers",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  data-ocid="book_demo.close.close_button"
                  onClick={handleClose}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                >
                  <X size={14} className="mr-2" /> Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
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
        <Calendar size={15} className="mr-1.5" />
        {label}
      </Button>
      <BookDemoModal
        open={open}
        onOpenChange={setOpen}
        defaultNiche={defaultNiche}
      />
    </>
  );
}
