import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Hash,
  MapPin,
  MessageSquare,
  Mic,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneMissed,
  Plus,
  Radio,
  RotateCcw,
  Settings,
  Shield,
  Star,
  TrendingUp,
  Users,
  Voicemail,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useApp } from "../context/AppContext";
import { DEMO_LOCATION_STATS } from "../data/locationData";
import type { LocationProfile, LocationStatus } from "../types/location";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  LocationStatus,
  { label: string; classes: string; dot: string }
> = {
  active: {
    label: "Active",
    classes: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  pending: {
    label: "Pending",
    classes: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dot: "bg-amber-400 animate-pulse",
  },
  inactive: {
    label: "Inactive",
    classes: "bg-muted/60 text-muted-foreground border-border",
    dot: "bg-muted-foreground/40",
  },
  suspended: {
    label: "Suspended",
    classes: "bg-red-500/15 text-red-300 border-red-500/30",
    dot: "bg-red-400",
  },
};

const TIMEZONES = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Anchorage",
  "Pacific/Honolulu",
];

const ROUTING_MODES = [
  {
    id: "ai",
    label: "AI Voice Agent",
    icon: <Mic size={14} />,
    desc: "AI handles and qualifies callers",
  },
  {
    id: "forward",
    label: "Forward to Staff",
    icon: <PhoneForwarded size={14} />,
    desc: "Ring your team directly",
  },
  {
    id: "voicemail",
    label: "Voicemail",
    icon: <Voicemail size={14} />,
    desc: "Record and transcribe messages",
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEMO_REVIEWS: Record<
  string,
  {
    platform: string;
    stars: number;
    text: string;
    author: string;
    ago: string;
  }[]
> = {
  "loc-1": [
    {
      platform: "Google",
      stars: 5,
      text: "Carlos and his team fixed our burst pipe in under an hour. Incredible response time — will call again.",
      author: "Sandra M.",
      ago: "2 days ago",
    },
    {
      platform: "Yelp",
      stars: 5,
      text: "Best plumbing service in San Diego. Transparent pricing, no surprises on the bill.",
      author: "Derek W.",
      ago: "1 week ago",
    },
    {
      platform: "Google",
      stars: 4,
      text: "Professional and on-time. Small scheduling mix-up but they made it right immediately.",
      author: "Tanya L.",
      ago: "2 weeks ago",
    },
  ],
  "loc-2": [
    {
      platform: "Google",
      stars: 5,
      text: "Priya's team is phenomenal. AC unit died in July heat and they had us back up within 3 hours.",
      author: "Marcus J.",
      ago: "3 days ago",
    },
    {
      platform: "Google",
      stars: 4,
      text: "Good service, competitive pricing. Came out same day for our HVAC maintenance.",
      author: "Olivia P.",
      ago: "1 week ago",
    },
    {
      platform: "Facebook",
      stars: 5,
      text: "Highly recommend. Used them twice now and both times were excellent.",
      author: "Ray T.",
      ago: "3 weeks ago",
    },
  ],
  "loc-3": [],
};

const PLATFORM_BADGE: Record<string, string> = {
  Google: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Yelp: "bg-red-500/20 text-red-300 border-red-500/30",
  Facebook: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: LocationStatus }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${STATUS_CONFIG[status].dot}`}
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => e.key === "Enter" && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-1"
        }`}
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}

function LocationTab({
  location,
  isSelected,
  onClick,
}: {
  location: LocationProfile;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`multi_location.tab.${location.id}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
        isSelected
          ? "bg-primary/20 border-primary/60 text-primary shadow-md"
          : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      <StatusDot status={location.status} />
      <span className="truncate max-w-[120px]">{location.locationName}</span>
      {location.isPrimary && (
        <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full border border-primary/30">
          Primary
        </span>
      )}
    </button>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ?? "bg-muted"}`}
          >
            {icon}
          </div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ─── Add Location Modal ───────────────────────────────────────────────────────

function AddLocationModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (loc: LocationProfile) => void;
}) {
  const [form, setForm] = useState({
    locationName: "",
    address: "",
    city: "",
    state: "",
    timezone: "America/Los_Angeles",
    getDedicatedNumber: true,
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.locationName || !form.city) return;
    const now = Date.now();
    const newLoc: LocationProfile = {
      id: `loc-${now}`,
      tenantId: "tenant-oceanside",
      locationName: form.locationName,
      address: form.address || "Address TBD",
      city: form.city,
      state: form.state || "CA",
      zip: "",
      phoneNumber: form.getDedicatedNumber ? "Provisioning…" : "",
      timezone: form.timezone,
      status: "pending",
      isPrimary: false,
      phoneConfig: {
        twilioNumber: form.getDedicatedNumber ? "Provisioning…" : "",
        twilioSid: "",
        missedCallSmsEnabled: false,
        voiceAgentEnabled: false,
        routingPriority: 99,
      },
      createdAt: now,
    };
    onAdd(newLoc);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      data-ocid="multi_location.add_location.dialog"
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Add New Location</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Each location gets its own dedicated Twilio number
            </p>
          </div>
          <button
            type="button"
            data-ocid="multi_location.add_location.close_button"
            onClick={onClose}
            onKeyDown={(e) => e.key === "Enter" && onClose()}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label
              htmlFor="loc-name"
              className="text-xs font-medium text-muted-foreground block mb-1.5"
            >
              Location Name *
            </label>
            <input
              id="loc-name"
              data-ocid="multi_location.add_location.name_input"
              className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. North County Branch"
              value={form.locationName}
              onChange={(e) => set("locationName", e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="loc-address"
              className="text-xs font-medium text-muted-foreground block mb-1.5"
            >
              Street Address
            </label>
            <input
              id="loc-address"
              data-ocid="multi_location.add_location.address_input"
              className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="123 Main St, Suite 100"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="loc-city"
                className="text-xs font-medium text-muted-foreground block mb-1.5"
              >
                City *
              </label>
              <input
                id="loc-city"
                data-ocid="multi_location.add_location.city_input"
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="San Diego"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="loc-state"
                className="text-xs font-medium text-muted-foreground block mb-1.5"
              >
                State
              </label>
              <input
                id="loc-state"
                data-ocid="multi_location.add_location.state_input"
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="CA"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="loc-timezone"
              className="text-xs font-medium text-muted-foreground block mb-1.5"
            >
              Timezone
            </label>
            <select
              id="loc-timezone"
              data-ocid="multi_location.add_location.timezone_select"
              className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              value={form.timezone}
              onChange={(e) => set("timezone", e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace("America/", "").replace("Pacific/", "Pacific — ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-cyan-500/5 border border-cyan-500/20 p-3">
            <div className="flex items-start gap-2.5">
              <Phone size={14} className="text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  Get dedicated phone number
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Provision a unique Twilio number for this location
                </p>
              </div>
            </div>
            <Toggle
              checked={form.getDedicatedNumber}
              onChange={(v) => set("getDedicatedNumber", v)}
              label="Get dedicated number"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-5 border-t border-border">
          <Button
            data-ocid="multi_location.add_location.cancel_button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            data-ocid="multi_location.add_location.submit_button"
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleAdd}
            disabled={!form.locationName || !form.city}
          >
            <Plus size={14} className="mr-1.5" />
            Add Location
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MultiLocationPage() {
  const { locationProfiles, isAdminUser, tenants } = useApp();

  const [locations, setLocations] =
    useState<LocationProfile[]>(locationProfiles);
  const [selectedId, setSelectedId] = useState<string>(locations[0]?.id ?? "");
  const [showAddModal, setShowAddModal] = useState(false);
  const [routingMode, setRoutingMode] = useState<Record<string, string>>({});
  const [smsToggle, setSmsToggle] = useState<Record<string, boolean>>({});
  const [voiceToggle, setVoiceToggle] = useState<Record<string, boolean>>({});
  const [hoursEnabled, setHoursEnabled] = useState<Record<string, boolean>>(
    () => Object.fromEntries(DAYS.map((d) => [d, !["Sat", "Sun"].includes(d)])),
  );

  const selected = locations.find((l) => l.id === selectedId) ?? locations[0];
  const selectedStats = DEMO_LOCATION_STATS.find(
    (s) => s.locationId === selectedId,
  );
  const reviews = DEMO_REVIEWS[selectedId] ?? [];

  const getRouting = (id: string) =>
    routingMode[id] ?? (id === "loc-1" || id === "loc-2" ? "ai" : "voicemail");
  const getSms = (id: string) =>
    smsToggle[id] ?? (id === "loc-1" || id === "loc-2");
  const getVoice = (id: string) =>
    voiceToggle[id] ?? (id === "loc-1" || id === "loc-2");

  const totalCalls = DEMO_LOCATION_STATS.reduce((s, l) => s + l.callVolume, 0);
  const totalLeads = DEMO_LOCATION_STATS.reduce((s, l) => s + l.leadCount, 0);
  const totalRevenue = DEMO_LOCATION_STATS.reduce(
    (s, l) => s + l.monthlyRevenue,
    0,
  );

  const handleAddLocation = (loc: LocationProfile) => {
    setLocations((prev) => [...prev, loc]);
    setSelectedId(loc.id);
  };

  return (
    <div className="space-y-6" data-ocid="multi_location.page">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Multi-Location Manager
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Each location has its own dedicated phone number, call routing, and
            performance tracking
          </p>
        </div>
        <Button
          size="sm"
          data-ocid="multi_location.add_location.open_modal_button"
          className="gap-2 bg-primary hover:bg-primary/90 shadow-md"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={14} />
          Add Location
        </Button>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={<Building2 size={16} className="text-primary" />}
          label="Total Locations"
          value={locations.length}
          sub={`${locations.filter((l) => l.status === "active").length} active`}
          accent="bg-primary/10"
        />
        <MetricCard
          icon={<TrendingUp size={16} className="text-emerald-400" />}
          label="Monthly Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}k`}
          sub="across all locations"
          accent="bg-emerald-500/10"
        />
        <MetricCard
          icon={<Users size={16} className="text-purple-400" />}
          label="Total Leads"
          value={totalLeads}
          sub="this month"
          accent="bg-purple-500/10"
        />
        <MetricCard
          icon={<PhoneCall size={16} className="text-cyan-400" />}
          label="Call Volume"
          value={totalCalls}
          sub="all locations"
          accent="bg-cyan-500/10"
        />
      </div>

      {/* ─── SECTION 1: Location Selector Tab Strip ─────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {locations.map((loc) => (
            <LocationTab
              key={loc.id}
              location={loc}
              isSelected={selectedId === loc.id}
              onClick={() => setSelectedId(loc.id)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* ─── Left Column ───────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* ─── SECTION 2: Location Overview Card ─────────────────────── */}
            <Card
              className="bg-card border-border"
              data-ocid="multi_location.overview.card"
            >
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        selected.isPrimary
                          ? "bg-primary/15 border border-primary/30"
                          : "bg-muted"
                      }`}
                    >
                      <Building2
                        size={18}
                        className={
                          selected.isPrimary
                            ? "text-primary"
                            : "text-muted-foreground"
                        }
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-base">
                          {selected.locationName}
                        </CardTitle>
                        {selected.isPrimary && (
                          <Badge className="text-[9px] bg-primary/15 text-primary border-primary/30 px-1.5">
                            Primary
                          </Badge>
                        )}
                        <Badge
                          className={`text-[10px] border px-2 ${STATUS_CONFIG[selected.status].classes}`}
                        >
                          <StatusDot status={selected.status} />
                          <span className="ml-1.5">
                            {STATUS_CONFIG[selected.status].label}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selected.address}, {selected.city}, {selected.state}{" "}
                        {selected.zip}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    data-ocid="multi_location.edit_location.button"
                    className="gap-1.5 h-7 text-xs shrink-0"
                  >
                    <Settings size={11} />
                    Settings
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={13}
                      className="text-muted-foreground mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Timezone
                      </p>
                      <p className="text-xs text-foreground">
                        {selected.timezone
                          .replace("America/", "")
                          .replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  {selected.managerName && (
                    <div className="flex items-start gap-2">
                      <Users
                        size={13}
                        className="text-muted-foreground mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Location Manager
                        </p>
                        <p className="text-xs text-foreground">
                          {selected.managerName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dedicated Phone Number Section */}
                <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-cyan-400" />
                      <p className="text-xs font-semibold text-foreground">
                        Dedicated Phone Number
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          selected.phoneConfig.twilioNumber &&
                          selected.phoneConfig.twilioNumber !== "Provisioning…"
                            ? "bg-emerald-400"
                            : "bg-amber-400 animate-pulse"
                        }`}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {selected.phoneConfig.twilioNumber &&
                        selected.phoneConfig.twilioNumber !== "Provisioning…"
                          ? "Active"
                          : "Setup Required"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground">
                        Twilio Number
                      </p>
                      <p className="text-sm font-mono font-semibold text-cyan-300 mt-0.5">
                        {selected.phoneConfig.twilioNumber || "—"}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground">SID</p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5 truncate">
                        {selected.phoneConfig.twilioSid || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid="multi_location.port_number.button"
                      className="h-7 text-xs gap-1.5 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <RotateCcw size={10} />
                      Port Number
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid="multi_location.get_new_number.button"
                      className="h-7 text-xs gap-1.5 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <Zap size={10} />
                      Get New Number
                    </Button>
                  </div>
                </div>

                {/* Pending state */}
                {selected.status === "pending" && (
                  <div
                    data-ocid="multi_location.setup_pending.empty_state"
                    className="rounded-xl bg-amber-500/8 border border-amber-500/25 p-4 flex items-start gap-3"
                  >
                    <AlertCircle
                      size={16}
                      className="text-amber-400 shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-semibold text-amber-300">
                        Location Setup In Progress
                      </p>
                      <p className="text-xs text-amber-300/70 mt-0.5">
                        Phone number is being provisioned. Usually takes 1–2
                        business days. You'll be notified when it's ready.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-7 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                      >
                        Complete Setup
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ─── SECTION 3: Metrics Grid ────────────────────────────────── */}
            {selectedStats && selected.status === "active" && (
              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
                data-ocid="multi_location.metrics.section"
              >
                {[
                  {
                    icon: <PhoneCall size={15} className="text-blue-400" />,
                    label: "Total Calls",
                    value: selectedStats.callVolume,
                    sub: `${selectedStats.missedCalls} missed`,
                    accent: "bg-blue-500/10",
                    ocid: "multi_location.metric.calls",
                  },
                  {
                    icon: <Users size={15} className="text-emerald-400" />,
                    label: "New Leads",
                    value: selectedStats.leadCount,
                    sub: "this month",
                    accent: "bg-emerald-500/10",
                    ocid: "multi_location.metric.leads",
                  },
                  {
                    icon: <Star size={15} className="text-amber-400" />,
                    label: "Review Rating",
                    value: selectedStats.avgRating.toFixed(1),
                    sub: `${selectedStats.reviewCount} reviews`,
                    accent: "bg-amber-500/10",
                    ocid: "multi_location.metric.rating",
                  },
                  {
                    icon: <Radio size={15} className="text-purple-400" />,
                    label: "Active Campaigns",
                    value: 3,
                    sub: "running now",
                    accent: "bg-purple-500/10",
                    ocid: "multi_location.metric.campaigns",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    data-ocid={m.ocid}
                    className="rounded-xl bg-card border border-border p-4"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${m.accent}`}
                    >
                      {m.icon}
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {m.value}
                    </p>
                    <p className="text-xs font-medium text-foreground mt-0.5">
                      {m.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {m.sub}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ─── SECTION 4: Call Routing Panel ──────────────────────────── */}
            <Card
              className="bg-card border-border"
              data-ocid="multi_location.call_routing.panel"
            >
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PhoneCall size={14} className="text-primary" />
                  Call Routing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                {/* Routing Mode Selector */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">
                    Inbound Call Routing
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {ROUTING_MODES.map((mode) => {
                      const active = getRouting(selectedId) === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          data-ocid={`multi_location.routing.${mode.id}.toggle`}
                          onClick={() =>
                            setRoutingMode((p) => ({
                              ...p,
                              [selectedId]: mode.id,
                            }))
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            setRoutingMode((p) => ({
                              ...p,
                              [selectedId]: mode.id,
                            }))
                          }
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                            active
                              ? "bg-primary/15 border-primary/50 text-primary shadow-sm"
                              : "bg-muted/30 border-border text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              active ? "bg-primary/20" : "bg-muted"
                            }`}
                          >
                            {mode.icon}
                          </div>
                          <span className="text-[10px] font-semibold leading-tight">
                            {mode.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Business Hours */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">
                    Business Hours
                  </p>
                  <div className="space-y-1.5">
                    {DAYS.map((day) => (
                      <div
                        key={day}
                        className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <Toggle
                          checked={hoursEnabled[day] ?? false}
                          onChange={(v) =>
                            setHoursEnabled((p) => ({ ...p, [day]: v }))
                          }
                          label={`${day} enabled`}
                        />
                        <span className="text-xs font-medium text-foreground w-7">
                          {day}
                        </span>
                        {hoursEnabled[day] ? (
                          <div className="flex items-center gap-2 ml-auto">
                            <select
                              className="bg-muted/60 border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none"
                              defaultValue="09:00"
                            >
                              {["08:00", "09:00", "10:00"].map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <span className="text-muted-foreground text-xs">
                              —
                            </span>
                            <select
                              className="bg-muted/60 border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none"
                              defaultValue="17:00"
                            >
                              {["17:00", "18:00", "19:00", "20:00"].map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span className="ml-auto text-[10px] text-muted-foreground/60">
                            Closed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* After-Hours Routing */}
                <div className="rounded-xl bg-muted/20 border border-border p-3 flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <Clock size={13} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        After-Hours Routing
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Outside business hours
                      </p>
                    </div>
                  </div>
                  <select
                    data-ocid="multi_location.after_hours.select"
                    className="bg-muted/60 border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none"
                    defaultValue="ai"
                  >
                    <option value="ai">AI Agent</option>
                    <option value="voicemail">Voicemail</option>
                  </select>
                </div>

                {/* Missed Call SMS Toggle */}
                <div className="rounded-xl bg-muted/20 border border-border p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <MessageSquare
                        size={13}
                        className="text-emerald-400 mt-0.5"
                      />
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Missed Call SMS
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Auto-text callers when call is missed
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={getSms(selectedId)}
                      onChange={(v) =>
                        setSmsToggle((p) => ({ ...p, [selectedId]: v }))
                      }
                      label="Missed call SMS"
                    />
                  </div>
                  {getSms(selectedId) && (
                    <div className="rounded-lg bg-muted/40 border border-border/60 px-3 py-2.5">
                      <p className="text-[10px] text-muted-foreground mb-1">
                        SMS Preview
                      </p>
                      <p className="text-xs text-foreground italic">
                        "Hey! Sorry we missed your call. We'd love to help —
                        reply here or call us back anytime."
                      </p>
                    </div>
                  )}
                </div>

                {/* Voice Agent Toggle */}
                <div className="flex items-center justify-between rounded-xl bg-muted/20 border border-border p-3">
                  <div className="flex items-start gap-2">
                    <Mic size={13} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        AI Voice Agent
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Vapi.ai handles live inbound calls
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={getVoice(selectedId)}
                    onChange={(v) =>
                      setVoiceToggle((p) => ({ ...p, [selectedId]: v }))
                    }
                    label="Voice agent"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── Right Column ───────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Quick Phone Status */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Phone Status
                </p>
                <div className="space-y-2">
                  {[
                    {
                      label: "Missed Call SMS",
                      active: getSms(selectedId),
                      icon: <MessageSquare size={12} />,
                    },
                    {
                      label: "Voice Agent",
                      active: getVoice(selectedId),
                      icon: <Mic size={12} />,
                    },
                    {
                      label: "Call Routing",
                      active: selected.status === "active",
                      icon: <PhoneForwarded size={12} />,
                    },
                    {
                      label: "CRM Integration",
                      active: true,
                      icon: <Shield size={12} />,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-1.5"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {item.icon}
                        {item.label}
                      </div>
                      {item.active ? (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                          <CheckCircle2 size={10} />
                          Active
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                          <AlertCircle size={10} />
                          Off
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Missed Call Stats */}
            {selectedStats && selected.status === "active" && (
              <Card className="bg-card border-border">
                <CardContent className="p-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Call Activity
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <PhoneCall size={11} className="text-blue-400" />
                        Total Calls
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {selectedStats.callVolume}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <PhoneMissed size={11} className="text-amber-400" />
                        Missed
                      </span>
                      <span className="text-sm font-semibold text-amber-400">
                        {selectedStats.missedCalls}
                      </span>
                    </div>
                    {selectedStats.callVolume > 0 && (
                      <>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="bg-amber-400 h-1.5 rounded-full"
                            style={{
                              width: `${(selectedStats.missedCalls / selectedStats.callVolume) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {Math.round(
                            (selectedStats.missedCalls /
                              selectedStats.callVolume) *
                              100,
                          )}
                          % missed rate
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ─── SECTION 5: Reviews Panel ────────────────────────────── */}
            <Card
              className="bg-card border-border"
              data-ocid="multi_location.reviews.panel"
            >
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star size={13} className="text-amber-400" />
                    Recent Reviews
                  </CardTitle>
                  {selectedStats && (
                    <span className="text-xs text-amber-300 font-semibold">
                      ★ {selectedStats.avgRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                {reviews.length === 0 ? (
                  <div
                    data-ocid="multi_location.reviews.empty_state"
                    className="text-center py-6"
                  >
                    <Star
                      size={24}
                      className="text-muted-foreground/30 mx-auto mb-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      No reviews yet for this location
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 h-7 text-xs"
                    >
                      Request Reviews
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.slice(0, 3).map((r, i) => (
                      <div
                        key={`${r.author}-${i}`}
                        data-ocid={`multi_location.review.item.${i + 1}`}
                        className="pb-3 border-b border-border/40 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge
                            className={`text-[9px] border px-1.5 py-0.5 ${PLATFORM_BADGE[r.platform] ?? "bg-muted text-muted-foreground border-border"}`}
                          >
                            {r.platform}
                          </Badge>
                          <div className="flex">
                            {([1, 2, 3, 4, 5] as const).map((si) => (
                              <Star
                                key={`star-${si}`}
                                size={9}
                                className={
                                  si <= r.stars
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-muted-foreground/30"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {r.ago}
                          </span>
                        </div>
                        <p className="text-xs text-foreground line-clamp-2">
                          "{r.text}"
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          — {r.author}
                        </p>
                      </div>
                    ))}
                    <button
                      type="button"
                      data-ocid="multi_location.view_all_reviews.link"
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors mt-1"
                    >
                      View all reviews
                      <ChevronRight size={11} />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ─── SECTION 7: Admin Panel ─────────────────────────────────────────── */}
      {isAdminUser && (
        <Card
          className="bg-card border-border"
          data-ocid="multi_location.admin_panel.section"
        >
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-primary" />
              <CardTitle className="text-sm">
                Admin — All Location Inventory
              </CardTitle>
              <Badge className="text-[9px] bg-primary/15 text-primary border-primary/30 ml-auto">
                Super Admin
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20">
                    {[
                      "Tenant",
                      "Location",
                      "Phone Number",
                      "Status",
                      "Calls/mo",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {locations.map((loc, i) => {
                    const stats = DEMO_LOCATION_STATS.find(
                      (s) => s.locationId === loc.id,
                    );
                    const tenant = tenants.find((t) => t.id === loc.tenantId);
                    const needsNumber =
                      !loc.phoneConfig.twilioNumber ||
                      loc.phoneConfig.twilioNumber === "Provisioning…";
                    return (
                      <tr
                        key={loc.id}
                        data-ocid={`multi_location.admin.row.${i + 1}`}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {tenant?.name ?? loc.tenantId}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building2
                              size={11}
                              className="text-muted-foreground shrink-0"
                            />
                            <span className="text-foreground font-medium">
                              {loc.locationName}
                            </span>
                            {loc.isPrimary && (
                              <Badge className="text-[8px] bg-primary/15 text-primary border-primary/30 px-1">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 pl-[19px]">
                            {loc.city}, {loc.state}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-cyan-300">
                            {needsNumber ? (
                              <span className="text-amber-400 italic">
                                Not provisioned
                              </span>
                            ) : (
                              loc.phoneConfig.twilioNumber
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={`text-[9px] border ${STATUS_CONFIG[loc.status].classes}`}
                          >
                            <StatusDot status={loc.status} />
                            <span className="ml-1">
                              {STATUS_CONFIG[loc.status].label}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-foreground">
                          {stats?.callVolume ?? 0}
                        </td>
                        <td className="px-4 py-3">
                          {needsNumber ? (
                            <Button
                              size="sm"
                              variant="outline"
                              data-ocid={`multi_location.admin.provision.${i + 1}`}
                              className="h-6 text-[10px] gap-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                            >
                              <Hash size={9} />
                              Provision Number
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              data-ocid={`multi_location.admin.manage.${i + 1}`}
                              className="h-6 text-[10px] gap-1 text-muted-foreground"
                            >
                              <Globe size={9} />
                              Manage
                              <ExternalLink size={8} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Location Modal */}
      {showAddModal && (
        <AddLocationModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLocation}
        />
      )}
    </div>
  );
}
