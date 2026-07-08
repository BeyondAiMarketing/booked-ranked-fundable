import { ck as useParams, r as reactExports, j as jsxRuntimeExports, l as LoaderCircle, m as Mail, aA as CircleCheck, cl as User, bO as ArrowRight, bl as Calendar, i as Clock, b2 as ArrowLeft } from "./index-iniFfpN1.js";
import { k as useDemoBooking, l as useCreateDemoBooking } from "./useRooferCampaign-Cp8IHKU5.js";
const SLOT_HOURS = [9, 11, 13, 15];
function formatHour(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:00 ${period}`;
}
function formatDayHeader(date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `${weekday} ${month} ${day}`;
}
function buildAvailableSlots() {
  const days = [];
  const now = /* @__PURE__ */ new Date();
  const startDay = now.getHours() >= SLOT_HOURS[SLOT_HOURS.length - 1] ? 1 : 0;
  for (let offset = startDay; days.length < 14; offset++) {
    const day = new Date(now);
    day.setDate(now.getDate() + offset);
    day.setHours(0, 0, 0, 0);
    const dateKey = day.toISOString().slice(0, 10);
    const slots = SLOT_HOURS.map((hour) => {
      const slotDate = new Date(day);
      slotDate.setHours(hour, 0, 0, 0);
      return {
        iso: slotDate.toISOString(),
        label: formatHour(hour)
      };
    });
    days.push({
      header: formatDayHeader(day),
      dateKey,
      slots
    });
  }
  return days;
}
function googleCalendarLink(slotIso) {
  const start = new Date(slotIso);
  const end = new Date(start.getTime() + 30 * 60 * 1e3);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const text = "Booked Ranked Fundable Demo";
  const details = "Your demo of the Booked Ranked Fundable platform. We'll walk through booking, ranking, and funding for your roofing crew. A confirmation email and a reminder will arrive before the call.";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text,
    dates: `${fmt(start)}/${fmt(end)}`,
    details
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
const STEPS = ["Your details", "Pick a time", "You're booked"];
function StepIndicator({ current }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2 sm:gap-3", children: STEPS.map((label, i) => {
    const stepNum = i + 1;
    const isDone = stepNum < current;
    const isActive = stepNum === current;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: [
              "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-smooth",
              isDone ? "border-transparent bg-primary text-primary-foreground" : isActive ? "border-primary bg-primary/15 text-primary" : "border-border bg-muted text-muted-foreground"
            ].join(" "),
            "aria-current": isActive ? "step" : void 0,
            children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : stepNum
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: [
              "hidden text-sm font-medium sm:inline",
              isActive ? "text-foreground" : "text-muted-foreground"
            ].join(" "),
            children: label
          }
        )
      ] }),
      i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: [
            "h-px w-8 sm:w-12",
            isDone ? "bg-primary" : "bg-border"
          ].join(" ")
        }
      )
    ] }, label);
  }) });
}
function PageShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-1 w-full",
        style: {
          background: "linear-gradient(90deg, oklch(0.75 0.16 75) 0%, oklch(0.58 0.22 290) 100%)"
        },
        "aria-hidden": true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex flex-1 items-center justify-center px-4 py-10 sm:py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-[600px]", children }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "px-4 py-6 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Booked Ranked Fundable"
    ] })
  ] });
}
function BrandHeader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        "aria-hidden": true,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "h-1.5 w-1.5 rounded-full",
              style: { backgroundColor: "oklch(0.75 0.16 75)" }
            }
          ),
          "Booked · Ranked · Fundable"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl", children: "Book your demo" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground sm:text-base", children: "A 15-minute walkthrough of how we book, rank, and fund roofing crews." })
  ] });
}
function LoadingState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading your booking link…" })
    ] })
  ] });
}
function InvalidTokenState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-foreground", children: "This booking link is no longer valid." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Please contact us directly and we'll get you set up." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: "mailto:hello@bookedrankedfundable.com",
          className: "mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted",
          "data-ocid": "demo.contact_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
            "hello@bookedrankedfundable.com"
          ]
        }
      )
    ] })
  ] });
}
function Step1NameEmail({
  name,
  email,
  onNameChange,
  onEmailChange,
  onContinue
}) {
  const [touched, setTouched] = reactExports.useState({
    name: false,
    email: false
  });
  const nameError = touched.name && name.trim().length === 0 ? "Please enter your name." : "";
  const emailError = touched.email && email.trim().length === 0 ? "Please enter your email." : touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "Please enter a valid email." : "";
  const canContinue = name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in-up rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: "demo-name",
          className: "mb-1.5 block text-sm font-medium text-foreground",
          children: "Roofer name"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "demo-name",
            type: "text",
            value: name,
            onChange: (e) => onNameChange(e.target.value),
            onBlur: () => setTouched((t) => ({ ...t, name: true })),
            placeholder: "e.g. Mike Rodriguez",
            className: "w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
            "data-ocid": "demo.name_input",
            autoComplete: "name"
          }
        )
      ] }),
      nameError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "mt-1.5 text-xs text-destructive",
          "data-ocid": "demo.name.field_error",
          children: nameError
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: "demo-email",
          className: "mb-1.5 block text-sm font-medium text-foreground",
          children: "Roofer email"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "demo-email",
            type: "email",
            value: email,
            onChange: (e) => onEmailChange(e.target.value),
            onBlur: () => setTouched((t) => ({ ...t, email: true })),
            placeholder: "e.g. mike@apexroofing.com",
            className: "w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
            "data-ocid": "demo.email_input",
            autoComplete: "email"
          }
        )
      ] }),
      emailError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "mt-1.5 text-xs text-destructive",
          "data-ocid": "demo.email.field_error",
          children: emailError
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onContinue,
        disabled: !canContinue,
        className: "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50",
        "data-ocid": "demo.continue_button",
        children: [
          "Continue",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ]
      }
    )
  ] }) });
}
function Step2TimeSlots({
  days,
  selectedIso,
  onSelect,
  onConfirm,
  onBack,
  isSubmitting,
  submitError
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-1 text-lg font-semibold text-foreground", children: "Pick a time for your demo" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-5 text-sm text-muted-foreground", children: "All times are in your local timezone. The demo takes about 15 minutes." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[360px] space-y-4 overflow-y-auto pr-1", children: days.map((day) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
        day.header
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-4", children: day.slots.map((slot) => {
        const isSelected = selectedIso === slot.iso;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onSelect(slot.iso),
            "aria-pressed": isSelected,
            className: [
              "inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-smooth",
              isSelected ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted"
            ].join(" "),
            "data-ocid": `demo.slot.${day.dateKey}.${slot.label.replace(/\s/g, "").toLowerCase()}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
              slot.label
            ]
          },
          slot.iso
        );
      }) })
    ] }, day.dateKey)) }),
    submitError && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "mt-4 text-sm text-destructive",
        "data-ocid": "demo.confirm.error_state",
        children: submitError
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: onBack,
          disabled: isSubmitting,
          className: "inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-smooth hover:bg-muted disabled:opacity-50",
          "data-ocid": "demo.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            "Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onConfirm,
          disabled: !selectedIso || isSubmitting,
          className: "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50",
          "data-ocid": "demo.confirm_button",
          children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            "Booking…"
          ] }) : "Confirm booking"
        }
      )
    ] })
  ] });
}
function Step3Confirmation({ booking, campaignName }) {
  const slotDate = new Date(booking.slotIso);
  const dateLabel = slotDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  const timeLabel = slotDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
  const calLink = reactExports.useMemo(
    () => googleCalendarLink(booking.slotIso),
    [booking.slotIso]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground", children: "You're booked!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "We've reserved your demo slot." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3 rounded-lg border border-border bg-background p-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: booking.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-words text-sm font-medium text-foreground", children: booking.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: dateLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: timeLabel })
      ] }),
      campaignName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Campaign" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-words text-sm font-medium text-foreground", children: campaignName })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: calLink,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-smooth hover:bg-primary/20",
        "data-ocid": "demo.add_to_calendar_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
          "Add to Calendar"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-xs text-muted-foreground", children: "You'll get a confirmation email and a reminder before your demo." })
  ] });
}
function DemoBookingPage() {
  const { ctaToken } = useParams({ from: "/demo/$ctaToken" });
  const { data: lookup, isLoading } = useDemoBooking(ctaToken);
  const createBooking = useCreateDemoBooking(ctaToken);
  const [step, setStep] = reactExports.useState(1);
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [selectedIso, setSelectedIso] = reactExports.useState(null);
  const [submitError, setSubmitError] = reactExports.useState(null);
  const days = reactExports.useMemo(() => buildAvailableSlots(), []);
  reactExports.useEffect(() => {
    if (lookup) {
      if (lookup.name) setName(lookup.name);
      if (lookup.email) setEmail(lookup.email);
    }
  }, [lookup]);
  const tokenInvalid = !isLoading && lookup === null;
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, {});
  if (tokenInvalid) return /* @__PURE__ */ jsxRuntimeExports.jsx(InvalidTokenState, {});
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
        slotIso: selectedIso
      });
      setStep(3);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong creating your booking. Please try again."
      );
    }
  };
  const confirmedBooking = createBooking.data ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: step }) }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Step1NameEmail,
      {
        name,
        email,
        onNameChange: setName,
        onEmailChange: setEmail,
        onContinue: handleContinue
      }
    ),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Step2TimeSlots,
      {
        days,
        selectedIso,
        onSelect: setSelectedIso,
        onConfirm: handleConfirm,
        onBack: handleBack,
        isSubmitting: createBooking.isPending,
        submitError
      }
    ),
    step === 3 && confirmedBooking && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Step3Confirmation,
      {
        booking: confirmedBooking,
        campaignName: "Booked Ranked Fundable Demo"
      }
    ),
    step === 3 && !confirmedBooking && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Step3Confirmation,
      {
        booking: {
          id: `booking-${ctaToken}`,
          campaignId: (lookup == null ? void 0 : lookup.campaignId) ?? "",
          leadId: (lookup == null ? void 0 : lookup.leadId) ?? "",
          ctaToken,
          name: name.trim(),
          email: email.trim(),
          slotIso: selectedIso ?? "",
          confirmed: true,
          createdAt: BigInt(Date.now()),
          confirmedAt: BigInt(Date.now())
        }
      }
    )
  ] });
}
export {
  DemoBookingPage as default
};
