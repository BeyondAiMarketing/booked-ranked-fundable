import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Crown,
  ExternalLink,
  Globe,
  Image,
  Link2,
  Mail,
  Medal,
  Monitor,
  Palette,
  PhoneCall,
  QrCode,
  Send,
  Server,
  Shield,
  Smartphone,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type {
  AgencyEmailSettings,
  WhiteLabelSettings,
} from "../context/AppContext";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ──────────────────────────────────────────────
// Brand Settings Tab
// ──────────────────────────────────────────────
function BrandTab({
  settings,
  onChange,
  onSave,
}: {
  settings: WhiteLabelSettings;
  onChange: (patch: Partial<WhiteLabelSettings>) => void;
  onSave: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        onChange({ logoDataUrl: ev.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const initials = settings.agencyName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Agency Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs">Agency Name</Label>
              <Input
                value={settings.agencyName}
                onChange={(e) => onChange({ agencyName: e.target.value })}
                placeholder="Your Agency Name"
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                data-ocid="whitelabel.agencyname.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs">Tagline</Label>
              <Input
                value={settings.tagline}
                onChange={(e) => onChange({ tagline: e.target.value })}
                placeholder="AI-Powered Growth for Local Businesses"
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                data-ocid="whitelabel.tagline.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-xs">Hero Headline</Label>
            <Input
              value={settings.heroHeadline}
              onChange={(e) => onChange({ heroHeadline: e.target.value })}
              placeholder="The Platform That Books, Ranks & Funds Your Clients"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              data-ocid="whitelabel.heroheadline.input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300 text-xs">Logo</Label>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl overflow-hidden border border-slate-600 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${settings.primaryColor}33` }}
              >
                {settings.logoDataUrl ? (
                  <img
                    src={settings.logoDataUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span
                    className="text-lg font-bold"
                    style={{ color: settings.primaryColor }}
                  >
                    {initials || "AG"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleLogoUpload}
                  className="hidden"
                  data-ocid="whitelabel.upload_button"
                />
                <Button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  variant="outline"
                  className="border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white gap-2"
                  data-ocid="whitelabel.logo.upload_button"
                >
                  <Image size={14} />
                  Upload Logo
                </Button>
                <p className="text-xs text-slate-500 mt-1.5">
                  PNG, JPG, SVG up to 2MB
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs">Primary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => onChange({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer bg-transparent"
                  data-ocid="whitelabel.primarycolor.input"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => onChange({ primaryColor: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs">Secondary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => onChange({ secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer bg-transparent"
                  data-ocid="whitelabel.secondarycolor.input"
                />
                <Input
                  value={settings.secondaryColor}
                  onChange={(e) => onChange({ secondaryColor: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={onSave}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
          data-ocid="whitelabel.save.primary_button"
        >
          <Check size={15} />
          Save Brand Settings
        </Button>
      </div>
      <div className="space-y-3">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Live Preview
        </p>
        <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
          <div
            className="h-1.5"
            style={{
              background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})`,
            }}
          />
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold overflow-hidden flex-shrink-0"
                style={{ backgroundColor: `${settings.primaryColor}22` }}
              >
                {settings.logoDataUrl ? (
                  <img
                    src={settings.logoDataUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span style={{ color: settings.primaryColor }}>
                    {initials || "AG"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">
                  {settings.agencyName || "Your Agency"}
                </p>
                <p className="text-slate-400 text-xs">
                  {settings.tagline || "Tagline goes here"}
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-white font-semibold text-xs leading-snug">
                {settings.heroHeadline || "Hero headline"}
              </p>
              <div className="h-px bg-slate-700" />
              <div className="flex gap-2">
                <div
                  className="h-6 rounded text-[10px] font-medium flex items-center px-2.5 text-white"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Get Started
                </div>
                <div
                  className="h-6 rounded text-[10px] font-medium flex items-center px-2.5 border"
                  style={{
                    borderColor: settings.primaryColor,
                    color: settings.primaryColor,
                  }}
                >
                  Learn More
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 text-center">
          Updates as you type
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Onboarding Link Tab
// ──────────────────────────────────────────────
function OnboardingLinkTab({
  settings,
  onChange,
  onSave,
}: {
  settings: WhiteLabelSettings;
  onChange: (patch: Partial<WhiteLabelSettings>) => void;
  onSave: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [testName, setTestName] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [testModalOpen, setTestModalOpen] = useState(false);
  const slug = slugify(settings.agencyName) || "your-agency";
  const shareableUrl = `https://bookedrankedfundable.com/agency-onboarding?agency=${slug}`;
  const agencyDisplayName =
    settings.agencyName && settings.agencyName !== "Your Agency Name"
      ? settings.agencyName
      : "Your Agency";
  const senderName = settings.emailSenderName || agencyDisplayName;
  const senderAddress = settings.emailSenderAddress || "noreply@youragency.com";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTest = () => {
    if (!testName.trim() || !testEmail.trim()) return;
    setTestModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setTestModalOpen(open);
    if (!open) toast.success("Test invite preview ready");
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Customize Client Welcome Screen
        </h2>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">Welcome Headline</Label>
          <Input
            value={settings.welcomeHeadline}
            onChange={(e) => onChange({ welcomeHeadline: e.target.value })}
            placeholder="Welcome to Your Growth Platform"
            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
            data-ocid="whitelabel.welcomeheadline.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">Welcome Message</Label>
          <Textarea
            value={settings.welcomeMessage}
            onChange={(e) => onChange({ welcomeMessage: e.target.value })}
            placeholder="Everything you need to book more jobs, rank higher, and build business credit — in one place."
            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none"
            rows={3}
            data-ocid="whitelabel.welcomemessage.textarea"
          />
        </div>
        <Button
          onClick={onSave}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
          data-ocid="whitelabel.savewelcome.primary_button"
        >
          <Check size={15} />
          Save Changes
        </Button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Your Shareable Onboarding Link
          </h2>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
            Active
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 font-mono text-sm text-purple-300 truncate">
            {shareableUrl}
          </div>
          <Button
            onClick={handleCopy}
            className="bg-slate-700 hover:bg-slate-600 text-white gap-2 flex-shrink-0"
            data-ocid="whitelabel.copylink.button"
          >
            {copied ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Link Clicks", value: "47", icon: Link2 },
            { label: "Signups", value: "12", icon: Users },
            { label: "Active Clients", value: "8", icon: Shield },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-slate-700/40 rounded-lg p-3 text-center border border-slate-600/50"
            >
              <Icon size={16} className="text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Send size={15} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Send a Test</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Enter a prospect's details to simulate sending them your branded
              onboarding link.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-xs">Prospect Name</Label>
            <Input
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g. Carlos Martinez"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              data-ocid="whitelabel.testname.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-xs">Prospect Email</Label>
            <Input
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="e.g. carlos@example.com"
              type="email"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              data-ocid="whitelabel.testemail.input"
            />
          </div>
        </div>
        <Dialog open={testModalOpen} onOpenChange={handleModalClose}>
          <Button
            onClick={handleSendTest}
            disabled={!testName.trim() || !testEmail.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2 disabled:opacity-40"
            data-ocid="whitelabel.sendtest.primary_button"
          >
            <Mail size={14} />
            Send Test
          </Button>
          <DialogContent
            className="bg-slate-900 border-slate-700 max-w-lg max-h-[90vh] overflow-y-auto"
            data-ocid="whitelabel.testinvite.dialog"
          >
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Mail size={16} className="text-purple-400" />
                Test Invite Sent
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-slate-800/60 rounded-lg border border-slate-700 p-4 space-y-2 text-xs">
                <div className="flex gap-2">
                  <span className="text-slate-500 w-14 flex-shrink-0">
                    From:
                  </span>
                  <span className="text-slate-300">
                    {senderName} &lt;{senderAddress}&gt;
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500 w-14 flex-shrink-0">To:</span>
                  <span className="text-slate-300">{testEmail}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500 w-14 flex-shrink-0">
                    Subject:
                  </span>
                  <span className="text-slate-300">
                    You've been invited to {agencyDisplayName}'s growth platform
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">
                <Check size={14} className="text-emerald-400 flex-shrink-0" />
                <p className="text-emerald-300 text-xs font-medium">
                  Simulated — no real email was sent
                </p>
              </div>
              <Button
                onClick={() => setTestModalOpen(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                data-ocid="whitelabel.testinvite.close_button"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <QrCode size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-300">
              QR Code
            </span>
          </div>
          <div className="w-32 h-32 bg-white rounded-lg p-2 relative overflow-hidden">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              role="img"
              aria-label="QR code for agency onboarding link"
            >
              <title>QR code for agency onboarding link</title>
              {Array.from({ length: 10 }, (_, row) =>
                Array.from({ length: 10 }, (_, col) => {
                  const isCorner =
                    (row < 3 && col < 3) ||
                    (row < 3 && col > 6) ||
                    (row > 6 && col < 3);
                  const randomFill = (row * 13 + col * 7) % 3 !== 0;
                  return (
                    <rect
                      key={`qr-${row * 10 + col}`}
                      x={col * 10 + 1}
                      y={row * 10 + 1}
                      width={8}
                      height={8}
                      fill={
                        isCorner
                          ? "#1e1b4b"
                          : randomFill
                            ? "#1e1b4b"
                            : "transparent"
                      }
                    />
                  );
                }),
              )}
            </svg>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Clients scan to access your branded onboarding
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Monitor size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-300">
              Preview
            </span>
          </div>
          <p className="text-xs text-slate-400 text-center">
            See exactly what your clients see when they land on your onboarding
            link.
          </p>
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white gap-2 w-full"
                data-ocid="whitelabel.previewwelcome.open_modal_button"
              >
                <ExternalLink size={14} />
                Preview Welcome Screen
              </Button>
            </DialogTrigger>
            <DialogContent
              className="bg-slate-900 border-slate-700 max-w-md"
              data-ocid="whitelabel.previewwelcome.dialog"
            >
              <DialogHeader>
                <DialogTitle className="text-white">
                  Client Welcome Screen Preview
                </DialogTitle>
              </DialogHeader>
              <WelcomeScreenPreview settings={settings} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreenPreview({ settings }: { settings: WhiteLabelSettings }) {
  const initials = settings.agencyName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className="rounded-xl overflow-hidden border border-slate-700"
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1040 100%)",
      }}
    >
      <div
        className="h-1"
        style={{
          background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})`,
        }}
      />
      <div className="p-6 flex flex-col items-center gap-5 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold overflow-hidden"
          style={{ backgroundColor: `${settings.primaryColor}33` }}
        >
          {settings.logoDataUrl ? (
            <img
              src={settings.logoDataUrl}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <span style={{ color: settings.primaryColor }}>
              {initials || "AG"}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-white font-bold text-xl leading-tight">
            {settings.welcomeHeadline || "Welcome to Your Growth Platform"}
          </h3>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            {settings.welcomeMessage ||
              "Everything you need to book more jobs, rank higher, and build business credit — in one place."}
          </p>
        </div>
        <div className="w-full space-y-2">
          <button
            type="button"
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: settings.primaryColor }}
          >
            Get Started
          </button>
          <button
            type="button"
            className="w-full rounded-lg py-2.5 text-sm font-medium bg-white/10 text-slate-200"
          >
            I already have an account
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Powered by {settings.agencyName || "Your Agency"}
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Portal Preview Tab
// ──────────────────────────────────────────────
function PortalPreviewTab({ settings }: { settings: WhiteLabelSettings }) {
  const initials = settings.agencyName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1">
        <Monitor size={15} className="text-purple-400" />
        <p className="text-slate-300 text-sm">
          This is exactly what your clients will see when they log in.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-center">
            Login Card
          </p>
          <div
            className="rounded-xl border border-slate-700 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0f0f1a 0%, #1a1040 100%)",
            }}
          >
            <div
              className="h-1"
              style={{
                background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})`,
              }}
            />
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: `${settings.primaryColor}33` }}
                >
                  {settings.logoDataUrl ? (
                    <img
                      src={settings.logoDataUrl}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span
                      style={{ color: settings.primaryColor }}
                      className="text-xs"
                    >
                      {initials || "AG"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">
                    {settings.agencyName || "Your Agency"}
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    {settings.tagline || "Tagline"}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="bg-slate-700/60 rounded-md px-2.5 py-1.5 text-xs text-slate-400">
                  email@example.com
                </div>
                <div className="bg-slate-700/60 rounded-md px-2.5 py-1.5 text-xs text-slate-400">
                  ••••••••
                </div>
              </div>
              <div
                className="w-full rounded-md py-1.5 text-[10px] font-semibold text-white text-center"
                style={{ backgroundColor: settings.primaryColor }}
              >
                Sign In
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-center">
            Dashboard Header
          </p>
          <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-900">
            <div
              className="h-0.5"
              style={{
                background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})`,
              }}
            />
            <div
              className="px-3 py-2.5 flex items-center justify-between"
              style={{ backgroundColor: `${settings.primaryColor}11` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold overflow-hidden"
                  style={{ backgroundColor: `${settings.primaryColor}44` }}
                >
                  {settings.logoDataUrl ? (
                    <img
                      src={settings.logoDataUrl}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span style={{ color: settings.primaryColor }}>
                      {initials?.[0] || "A"}
                    </span>
                  )}
                </div>
                <span className="text-white text-xs font-semibold">
                  {settings.agencyName || "Agency"}
                </span>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[9px] text-slate-300">
                JD
              </div>
            </div>
            <div className="p-3 space-y-1.5">
              {["Dashboard", "Leads", "Reviews", "SEO Audit"].map((item) => (
                <div
                  key={item}
                  className="text-[10px] px-2 py-1 rounded text-slate-400"
                  style={
                    item === "Dashboard"
                      ? {
                          backgroundColor: `${settings.primaryColor}22`,
                          color: settings.primaryColor,
                        }
                      : {}
                  }
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-center">
            Onboarding Welcome
          </p>
          <div
            className="rounded-xl border border-slate-700 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0f0f1a 0%, #1a1040 100%)",
            }}
          >
            <div
              className="h-1"
              style={{
                background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})`,
              }}
            />
            <div className="p-4 space-y-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold overflow-hidden"
                style={{ backgroundColor: `${settings.primaryColor}33` }}
              >
                {settings.logoDataUrl ? (
                  <img
                    src={settings.logoDataUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span style={{ color: settings.primaryColor }}>
                    {initials || "AG"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-white font-bold text-xs leading-snug">
                  {settings.welcomeHeadline ||
                    "Welcome to Your Growth Platform"}
                </p>
                <p className="text-slate-400 text-[10px] mt-1 leading-relaxed line-clamp-3">
                  {settings.welcomeMessage ||
                    "Everything you need to book more jobs, rank higher, and build business credit."}
                </p>
              </div>
              <div
                className="w-full rounded py-1 text-[10px] font-semibold text-white text-center"
                style={{ backgroundColor: settings.primaryColor }}
              >
                Get Started
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-slate-500 italic">
        ✦ This is exactly what your clients will see — fully branded to your
        agency.
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────
// Domain & Access Tab
// ──────────────────────────────────────────────
function DomainTab({
  settings,
  onChange,
  onSave,
}: {
  settings: WhiteLabelSettings;
  onChange: (patch: Partial<WhiteLabelSettings>) => void;
  onSave: () => void;
}) {
  const slug = slugify(settings.agencyName) || "your-agency";
  const subdomain = `${slug}.bookedrankedfundable.com`;
  const hasCustomDomain = settings.customDomain.length > 3;

  return (
    <div className="space-y-5">
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Domain Configuration
        </h2>
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs">
            Your Subdomain (Auto-Generated)
          </Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 font-mono text-sm text-purple-300">
              {subdomain}
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
              SSL Active
            </Badge>
          </div>
        </div>
        <div className="h-px bg-slate-700" />
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs">
            Custom Domain (Optional)
          </Label>
          <Input
            value={settings.customDomain}
            onChange={(e) => onChange({ customDomain: e.target.value })}
            placeholder="youragency.com"
            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
            data-ocid="whitelabel.customdomain.input"
          />
          {hasCustomDomain && (
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                Pending DNS
              </Badge>
              <p className="text-xs text-slate-400">
                SSL will activate within 24 hours of DNS propagation.
              </p>
            </div>
          )}
        </div>
        <div className="bg-slate-700/30 rounded-lg border border-slate-600/40 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-purple-400" />
            <span className="text-xs font-semibold text-slate-300">
              DNS Setup Instructions
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Point your domain's CNAME record to:{" "}
            <span className="font-mono text-purple-300">
              platform.bookedrankedfundable.com
            </span>
          </p>
        </div>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Email Sender Identity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-xs">Sender Name</Label>
            <Input
              value={settings.emailSenderName}
              onChange={(e) => onChange({ emailSenderName: e.target.value })}
              placeholder="Bold Growth Agency"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              data-ocid="whitelabel.emailsendername.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-xs">Sender Email</Label>
            <Input
              value={settings.emailSenderAddress}
              onChange={(e) => onChange({ emailSenderAddress: e.target.value })}
              placeholder="hello@youragency.com"
              type="email"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              data-ocid="whitelabel.emailsenderaddress.input"
            />
          </div>
        </div>
      </div>
      <Button
        onClick={onSave}
        className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
        data-ocid="whitelabel.savedomain.primary_button"
      >
        <Check size={15} />
        Save Domain Settings
      </Button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Client Branding Controls Tab
// ──────────────────────────────────────────────
interface ClientOverride {
  greetingOverride: string;
  helpText: string;
  hideDashboardLink: boolean;
}

function ClientBrandingTab() {
  const { tenants } = useApp();
  const displayTenants = tenants.filter((t) => t.id !== "tenant-demo");
  const [overrides, setOverrides] = useState<Record<string, ClientOverride>>(
    () =>
      Object.fromEntries(
        displayTenants.map((t) => [
          t.id,
          { greetingOverride: "", helpText: "", hideDashboardLink: false },
        ]),
      ),
  );
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const update = (tenantId: string, patch: Partial<ClientOverride>) => {
    setOverrides((prev) => ({
      ...prev,
      [tenantId]: { ...prev[tenantId], ...patch },
    }));
  };

  const handleApply = (tenantId: string) => {
    setSavedIds((prev) => new Set(prev).add(tenantId));
    toast.success("Overrides applied for this client");
    setTimeout(() => {
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(tenantId);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Smartphone size={15} className="text-purple-400" />
        <p className="text-slate-300 text-sm">
          These overrides apply only to clients under your agency.
        </p>
      </div>
      {displayTenants.length === 0 ? (
        <div
          className="bg-slate-800 rounded-xl border border-slate-700/50 p-12 text-center"
          data-ocid="whitelabel.clients.empty_state"
        >
          <Users size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No client tenants yet.</p>
          <p className="text-slate-500 text-xs mt-1">
            Add clients in the Admin Panel to configure their branding.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayTenants.map((tenant, idx) => {
            const o = overrides[tenant.id] ?? {
              greetingOverride: "",
              helpText: "",
              hideDashboardLink: false,
            };
            const isSaved = savedIds.has(tenant.id);
            return (
              <div
                key={tenant.id}
                className="bg-slate-800 rounded-xl border border-slate-700/50 p-5 space-y-4"
                data-ocid={`whitelabel.clients.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {tenant.name}
                    </p>
                    <p className="text-slate-400 text-xs capitalize">
                      {tenant.type}
                    </p>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                    {tenant.type || "Client"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-slate-300 text-xs">
                      Greeting Override
                    </Label>
                    <Input
                      value={o.greetingOverride}
                      onChange={(e) =>
                        update(tenant.id, { greetingOverride: e.target.value })
                      }
                      placeholder="Welcome back, {name}!"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 text-sm"
                      data-ocid="whitelabel.clients.greeting.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-300 text-xs">Help Text</Label>
                    <Input
                      value={o.helpText}
                      onChange={(e) =>
                        update(tenant.id, { helpText: e.target.value })
                      }
                      placeholder="Need help? Contact us at support@..."
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 text-sm"
                      data-ocid="whitelabel.clients.helptext.input"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={o.hideDashboardLink}
                      onCheckedChange={(v) =>
                        update(tenant.id, { hideDashboardLink: v })
                      }
                      data-ocid="whitelabel.clients.hidedashboard.switch"
                    />
                    <Label className="text-slate-300 text-sm cursor-pointer">
                      Hide Dashboard Link
                    </Label>
                  </div>
                  <Button
                    onClick={() => handleApply(tenant.id)}
                    className={`gap-2 text-sm ${isSaved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-purple-600 hover:bg-purple-700"} text-white`}
                    data-ocid="whitelabel.clients.apply.save_button"
                  >
                    {isSaved ? (
                      <>
                        <Check size={13} /> Applied!
                      </>
                    ) : (
                      "Apply Overrides"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Email & Sender Tab
// ──────────────────────────────────────────────
type EmailProvider = AgencyEmailSettings["provider"];
const PROVIDER_LABELS: Record<Exclude<EmailProvider, "">, string> = {
  sendgrid: "SendGrid",
  mailgun: "Mailgun",
  postmark: "Postmark",
  resend: "Resend",
  amazon_ses: "Amazon SES",
  smtp: "Custom SMTP",
};
const PROVIDER_FIELDS: Record<
  Exclude<EmailProvider, "">,
  { key: string; label: string; type?: string; options?: string[] }[]
> = {
  sendgrid: [{ key: "apiKey", label: "API Key", type: "password" }],
  mailgun: [
    { key: "apiKey", label: "API Key", type: "password" },
    { key: "domain", label: "Mailgun Domain" },
    { key: "region", label: "Region", options: ["US", "EU"] },
  ],
  postmark: [
    { key: "serverToken", label: "Server API Token", type: "password" },
  ],
  resend: [{ key: "apiKey", label: "API Key", type: "password" }],
  amazon_ses: [
    { key: "accessKeyId", label: "Access Key ID" },
    { key: "secretAccessKey", label: "Secret Access Key", type: "password" },
    {
      key: "region",
      label: "AWS Region",
      options: [
        "us-east-1",
        "us-west-2",
        "eu-west-1",
        "eu-central-1",
        "ap-southeast-1",
      ],
    },
  ],
  smtp: [
    { key: "host", label: "SMTP Host" },
    { key: "port", label: "Port" },
    { key: "username", label: "Username" },
    { key: "password", label: "Password", type: "password" },
    { key: "encryption", label: "Encryption", options: ["TLS", "SSL", "None"] },
  ],
};

function EmailSenderTab({
  settings,
  onChange,
  onSave,
}: {
  settings: WhiteLabelSettings;
  onChange: (patch: Partial<WhiteLabelSettings>) => void;
  onSave: () => void;
}) {
  const emailSettings = settings.agencyEmailSettings;
  const [testSent, setTestSent] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);

  const patchEmail = (patch: Partial<AgencyEmailSettings>) => {
    onChange({ agencyEmailSettings: { ...emailSettings, ...patch } });
  };
  const patchCredential = (key: string, value: string) => {
    patchEmail({ credentials: { ...emailSettings.credentials, [key]: value } });
  };
  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestSent(true);
      patchEmail({ isVerified: true, lastTested: new Date().toISOString() });
      onSave();
      toast.success("Test email sent. Check your inbox.");
      setTimeout(() => setTestSent(false), 3000);
    }, 1400);
  };

  const selectedProvider = emailSettings.provider as Exclude<EmailProvider, "">;
  const hasCustomProvider = emailSettings.useCustomProvider;
  const providerFields =
    selectedProvider && PROVIDER_FIELDS[selectedProvider]
      ? PROVIDER_FIELDS[selectedProvider]
      : [];
  const senderStatusLabel =
    hasCustomProvider && emailSettings.isVerified
      ? `${selectedProvider ? PROVIDER_LABELS[selectedProvider] : "Custom"} — Verified`
      : "Caffeine Native Email";
  const senderStatusColor =
    hasCustomProvider && emailSettings.isVerified
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : hasCustomProvider
        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
        : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  const dotColor =
    hasCustomProvider && emailSettings.isVerified
      ? "bg-emerald-400"
      : hasCustomProvider
        ? "bg-amber-400"
        : "bg-emerald-400";

  return (
    <div className="space-y-5">
      <div
        className="rounded-xl border border-purple-500/30 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.10) 100%)",
        }}
      >
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                <Mail size={17} className="text-purple-300" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Active Sender
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {senderStatusLabel}
                </p>
              </div>
            </div>
            <Badge className={`${senderStatusColor} text-xs flex-shrink-0`}>
              <div className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-1.5`} />
              {hasCustomProvider && emailSettings.isVerified
                ? "Connected"
                : hasCustomProvider
                  ? "Unverified"
                  : "Active"}
            </Badge>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Switch
              checked={hasCustomProvider}
              onCheckedChange={(v) => patchEmail({ useCustomProvider: v })}
              data-ocid="whitelabel.email.usecustom.switch"
            />
            <Label className="text-slate-200 text-sm cursor-pointer">
              Use Custom Email Provider
            </Label>
          </div>
        </div>
      </div>

      {hasCustomProvider && (
        <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Email Provider Credentials
          </h2>
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-xs">Email Provider</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProviderDropdownOpen((v) => !v)}
                className="w-full flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white hover:bg-slate-700 transition-colors"
                data-ocid="whitelabel.email.provider.select"
              >
                <span>
                  {selectedProvider
                    ? PROVIDER_LABELS[selectedProvider]
                    : "Select provider…"}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {providerDropdownOpen && (
                <div className="absolute z-20 w-full top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                  {Object.entries(PROVIDER_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        patchEmail({
                          provider: key as Exclude<EmailProvider, "">,
                        });
                        setProviderDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {providerFields.length > 0 && (
            <div className="space-y-4">
              {providerFields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-slate-300 text-xs">
                    {field.label}
                  </Label>
                  {field.options ? (
                    <select
                      value={emailSettings.credentials[field.key] || ""}
                      onChange={(e) =>
                        patchCredential(field.key, e.target.value)
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white"
                    >
                      <option value="">Select…</option>
                      {field.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={field.type || "text"}
                      value={emailSettings.credentials[field.key] || ""}
                      onChange={(e) =>
                        patchCredential(field.key, e.target.value)
                      }
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <Button
            onClick={handleTestConnection}
            disabled={isTesting || !selectedProvider}
            className={`gap-2 ${testSent ? "bg-emerald-600 hover:bg-emerald-700" : "bg-purple-600 hover:bg-purple-700"} text-white disabled:opacity-40`}
            data-ocid="whitelabel.email.testconnection.primary_button"
          >
            {isTesting ? (
              <>
                <Zap size={14} className="animate-spin" />
                Testing…
              </>
            ) : testSent ? (
              <>
                <Check size={14} />
                Connection Verified
              </>
            ) : (
              <>
                <Send size={14} />
                Test Connection
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Revenue Intelligence Tab (NEW)
// ──────────────────────────────────────────────
const MOCK_CLIENTS = [
  {
    name: "Martinez Plumbing",
    niche: "Plumbing",
    status: "active" as const,
    mrr: 297,
    lastActive: "Today",
    health: 82,
  },
  {
    name: "Glow Med Spa",
    niche: "Med Spa",
    status: "active" as const,
    mrr: 497,
    lastActive: "Yesterday",
    health: 91,
  },
  {
    name: "A-1 Roofing LLC",
    niche: "Roofing",
    status: "trial" as const,
    mrr: 0,
    lastActive: "3 days ago",
    health: 64,
  },
  {
    name: "City Dental Group",
    niche: "Dental",
    status: "at_risk" as const,
    mrr: 497,
    lastActive: "18 days ago",
    health: 32,
  },
  {
    name: "Peak HVAC Services",
    niche: "HVAC",
    status: "active" as const,
    mrr: 297,
    lastActive: "2 days ago",
    health: 78,
  },
  {
    name: "ProClean Carpet Co.",
    niche: "Carpet Cleaning",
    status: "churned" as const,
    mrr: 0,
    lastActive: "45 days ago",
    health: 15,
  },
];

const MRR_TREND = [8200, 9100, 10400, 11200, 12000, 12840];
const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function RevenueTab({ agencyName: _agencyName }: { agencyName: string }) {
  const activeMRR = MOCK_CLIENTS.filter((c) => c.status === "active").reduce(
    (s, c) => s + c.mrr,
    0,
  );
  const activeCount = MOCK_CLIENTS.filter((c) => c.status === "active").length;
  const trialCount = MOCK_CLIENTS.filter((c) => c.status === "trial").length;
  const atRiskClients = MOCK_CLIENTS.filter((c) => c.status === "at_risk");
  const churnCount = MOCK_CLIENTS.filter((c) => c.status === "churned").length;
  const avgMRR = activeCount > 0 ? Math.round(activeMRR / activeCount) : 297;
  const maxBar = Math.max(...MRR_TREND);

  const statusStyle: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    trial: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    at_risk: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    churned: "bg-slate-700/50 text-slate-500 border-slate-600/50",
  };
  const statusLabel: Record<string, string> = {
    active: "Active",
    trial: "Trial",
    at_risk: "At Risk",
    churned: "Churned",
  };

  return (
    <div className="space-y-6" data-ocid="revenue.section">
      {/* Hormozi value stack header */}
      <div
        className="rounded-xl border border-purple-500/30 p-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.08) 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={18} className="text-purple-400" />
          <h2 className="text-white font-bold text-lg">Revenue Intelligence</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          Every active BRF client generates{" "}
          <span className="text-white font-semibold">${avgMRR}/month</span>. At
          10 clients, that's{" "}
          <span className="text-emerald-400 font-bold">
            ${(avgMRR * 10).toLocaleString()}/mo
          </span>
          . At 50 clients, that's{" "}
          <span className="text-emerald-400 font-bold">
            ${(avgMRR * 50).toLocaleString()}/mo
          </span>
          . The only variable is how many you close.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        data-ocid="revenue.kpi.panel"
      >
        {[
          {
            label: "Active Clients",
            value: activeCount.toString(),
            sub: "+2 vs last month",
            icon: Users,
            color: "text-purple-400",
            trend: true,
          },
          {
            label: "MRR",
            value: `$${activeMRR.toLocaleString()}`,
            sub: "+$840 vs last month",
            icon: TrendingUp,
            color: "text-emerald-400",
            trend: true,
          },
          {
            label: "Trial Conversions",
            value: trialCount.toString(),
            sub: "67% rate this month",
            icon: Zap,
            color: "text-amber-400",
            trend: true,
          },
          {
            label: "Churn This Month",
            value: churnCount.toString(),
            sub: "-1 vs last month",
            icon: TrendingDown,
            color: "text-rose-400",
            trend: false,
          },
          {
            label: "Net MRR Change",
            value: "+$840",
            sub: "vs prior month",
            icon: BarChart3,
            color: "text-emerald-400",
            trend: true,
          },
        ].map(({ label, value, sub, icon: Icon, color, trend }, i) => (
          <div
            key={label}
            className="bg-slate-800 rounded-xl border border-slate-700/50 p-4"
            data-ocid={`revenue.kpi.item.${i + 1}`}
          >
            <Icon size={16} className={`${color} mb-2`} />
            <p className="text-white font-bold text-xl">{value}</p>
            <p className="text-slate-400 text-xs">{label}</p>
            <p
              className={`text-[11px] mt-1 font-medium ${trend ? "text-emerald-400" : "text-slate-500"}`}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* MRR Trend Chart */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-5">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
          6-Month MRR Growth
        </h3>
        <div className="flex items-end gap-2 h-32">
          {MRR_TREND.map((val, i) => (
            <div
              key={MONTHS[i]}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${(val / maxBar) * 100}%`,
                  background:
                    i === MRR_TREND.length - 1
                      ? "linear-gradient(180deg, #7c3aed, #6d28d9)"
                      : "rgba(124,58,237,0.35)",
                }}
              />
              <span className="text-[10px] text-slate-500">{MONTHS[i]}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700/50">
          <span className="text-xs text-slate-500">Current MRR</span>
          <span className="text-emerald-400 font-bold text-lg">
            ${MRR_TREND[MRR_TREND.length - 1].toLocaleString()}/mo
          </span>
        </div>
      </div>

      {/* Client Portfolio Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Client Portfolio
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {[
                  "Client",
                  "Niche",
                  "Status",
                  "MRR",
                  "Last Active",
                  "Health",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_CLIENTS.map((client, i) => (
                <tr
                  key={client.name}
                  className="border-t border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                  data-ocid={`revenue.client.item.${i + 1}`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-white">
                    {client.name}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {client.niche}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`${statusStyle[client.status]} text-xs`}>
                      {statusLabel[client.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-white">
                    {client.mrr > 0 ? `$${client.mrr}/mo` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {client.lastActive}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden max-w-[60px]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${client.health}%`,
                            background:
                              client.health >= 70
                                ? "#22c55e"
                                : client.health >= 40
                                  ? "#f59e0b"
                                  : "#ef4444",
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-semibold ${client.health >= 70 ? "text-emerald-400" : client.health >= 40 ? "text-amber-400" : "text-rose-400"}`}
                      >
                        {client.health}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-purple-500 text-xs h-7 px-2.5"
                      data-ocid={`revenue.client.edit_button.${i + 1}`}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Churn Prevention Panel */}
      {atRiskClients.length > 0 && (
        <div className="bg-slate-800 rounded-xl border border-rose-500/20 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-400" />
            <h3 className="text-sm font-semibold text-white">
              Churn Prevention
            </h3>
            <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs">
              {atRiskClients.length} At Risk
            </Badge>
          </div>
          <p className="text-xs text-slate-400 italic">
            Saving one client per month at $297/mo averages $3,564/year. Churn
            prevention pays. — Halbert
          </p>
          <div className="space-y-3">
            {atRiskClients.map((client, i) => (
              <div
                key={client.name}
                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/40"
                data-ocid={`revenue.atrisk.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {client.name}
                    </p>
                    <p className="text-rose-400 text-xs mt-0.5">
                      {client.health < 40
                        ? `Health score dropped to ${client.health} this week.`
                        : ""}
                      {client.lastActive.includes("18")
                        ? " No login in 18 days."
                        : ""}
                    </p>
                  </div>
                  <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs flex-shrink-0">
                    At Risk
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    "Send check-in email",
                    "Schedule a call",
                    "Extend trial",
                    "Offer discount",
                  ].map((action) => (
                    <Button
                      key={action}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.success(
                          `Action queued: ${action} for ${client.name}`,
                        )
                      }
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-purple-500 text-xs h-7"
                      data-ocid="revenue.atrisk.action.button"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Onboarding Wizard Panel (NEW)
// ──────────────────────────────────────────────
const ONBOARDING_STEPS = [
  {
    title: "Welcome to BRF Partner Network",
    aha: "You're joining 200+ agencies generating an avg $8,400/month with BRF. Here's your 5-step launch plan.",
    body: "This wizard walks you through the exact sequence that top-earning partners follow in their first week. Each step unlocks the next revenue lever.",
    cta: "Let's Go →",
  },
  {
    title: "Brand Setup",
    aha: "Your brand is your trust signal. Clients who see your logo and colors convert 3x higher than a generic dashboard.",
    body: "Upload your logo, set your agency colors, and configure your custom domain. This takes 5 minutes and makes every client touchpoint feel like YOUR platform.",
    cta: "Open Brand Settings",
  },
  {
    title: "Add Your First Client",
    aha: "The fastest way to earn is to have a real client in the system — even a beta client at no cost.",
    body: "Add your first client's business name and niche. BRF builds their platform in seconds. You'll see exactly what they see before you pitch a single prospect.",
    cta: "Add First Client",
  },
  {
    title: "Create Your Co-Branded Demo Link",
    aha: "Agencies that send personalized demo links close at 34% higher rates. This is how you pitch without a sales call.",
    body: "Generate a unique demo URL with your branding pre-applied. Send it to a prospect — they enter their business name and hear their AI agent speak their name.",
    cta: "Create Demo Link",
  },
  {
    title: "Connect 3 Core Integrations",
    aha: "An AI provider + Twilio + email = 80% of BRF's value activated. Everything else is bonus.",
    body: "Go to Go Live and connect: an AI provider (Claude or OpenAI), Twilio for voice + SMS, and your email service. These three unlock the full front desk experience for every client.",
    cta: "Open Go Live Dashboard",
  },
  {
    title: "You're Live — Week 1 Action Plan",
    aha: "The partners who close fastest send 5 personalized demo links in week 1. That's it. The demo does the selling.",
    body: "Your platform is configured, your demo is ready, and your first client is set up. Generate 5 co-branded demo links from the tab above and send them today. Check back for opens.",
    cta: "Generate Demo Links",
  },
];

function OnboardingWizardPanel() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const current = ONBOARDING_STEPS[step];
  const progress = (step / (ONBOARDING_STEPS.length - 1)) * 100;

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) setStep((s) => s + 1);
    else {
      setCompleted(true);
      toast.success(
        "Onboarding complete! You're ready to close your first client.",
      );
    }
  };

  if (completed) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Check size={20} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold">Onboarding Complete!</p>
          <p className="text-emerald-400 text-xs mt-0.5">
            You're set up and ready. Generate your first co-branded demo link
            above.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDismissed(true)}
          className="border-slate-600 text-slate-400 text-xs"
        >
          Dismiss
        </Button>
      </div>
    );
  }

  return (
    <div
      className="bg-slate-800 rounded-xl border border-purple-500/30 overflow-hidden"
      data-ocid="onboarding.wizard.panel"
    >
      <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-purple-400" />
          <h3 className="text-white font-semibold text-sm">
            Agency Launch Wizard
          </h3>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
            Step {step + 1} of {ONBOARDING_STEPS.length}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDismissed(true)}
          className="border-slate-600 text-slate-400 text-xs h-7"
          data-ocid="onboarding.wizard.close_button"
        >
          Skip
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-700">
        <div
          className="h-full bg-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-5 space-y-4">
        {/* Step indicators */}
        <div className="flex gap-1.5">
          {ONBOARDING_STEPS.map((stepItem, i) => (
            <button
              key={stepItem.title}
              type="button"
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "bg-purple-500 flex-1" : i < step ? "bg-emerald-500 w-6" : "bg-slate-700 w-6"}`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <div>
          <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">
            Step {step + 1}
          </p>
          <h4 className="text-white font-bold text-base">{current.title}</h4>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-3">
          <p className="text-purple-200 text-sm italic">"{current.aha}"</p>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">{current.body}</p>

        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="border-slate-600 text-slate-400 hover:text-white"
              data-ocid="onboarding.wizard.secondary_button"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
            data-ocid="onboarding.wizard.primary_button"
          >
            {step < ONBOARDING_STEPS.length - 1
              ? current.cta
              : "Complete Setup"}
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Co-Branded Demo Links Tab (NEW)
// ──────────────────────────────────────────────
interface DemoLink {
  id: string;
  prospect: string;
  niche: string;
  url: string;
  created: string;
  opens: number;
  status: "unopened" | "opened" | "trial";
}

const INITIAL_DEMO_LINKS: DemoLink[] = [
  {
    id: "1",
    prospect: "Martinez Plumbing",
    niche: "plumbing",
    url: "https://bookedrankedfunded.org/demo?agency=bold-growth&prospect=martinez-plumbing&niche=plumbing",
    created: "Dec 18, 2024",
    opens: 4,
    status: "trial",
  },
  {
    id: "2",
    prospect: "Glow Med Spa",
    niche: "med-spa",
    url: "https://bookedrankedfunded.org/demo?agency=bold-growth&prospect=glow-med-spa&niche=med-spa",
    created: "Dec 20, 2024",
    opens: 2,
    status: "opened",
  },
  {
    id: "3",
    prospect: "A-1 Roofing LLC",
    niche: "roofing",
    url: "https://bookedrankedfunded.org/demo?agency=bold-growth&prospect=a1-roofing&niche=roofing",
    created: "Dec 22, 2024",
    opens: 0,
    status: "unopened",
  },
];

const NICHES = [
  "plumbing",
  "med-spa",
  "hvac",
  "roofing",
  "carpet-cleaning",
  "restoration",
  "real-estate",
  "mortgage",
  "chiropractor",
  "dental",
];

function DemoLinksTab({ settings }: { settings: WhiteLabelSettings }) {
  const [links, setLinks] = useState<DemoLink[]>(INITIAL_DEMO_LINKS);
  const [prospectName, setProspectName] = useState("");
  const [niche, setNiche] = useState("plumbing");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bulkText, setBulkText] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const agencySlug = slugify(settings.agencyName) || "your-agency";

  const handleGenerate = () => {
    if (!prospectName.trim()) return;
    const prospectSlug = slugify(prospectName);
    const url = `https://bookedrankedfunded.org/demo?agency=${agencySlug}&prospect=${prospectSlug}&niche=${niche}`;
    const newLink: DemoLink = {
      id: Date.now().toString(),
      prospect: prospectName,
      niche,
      url,
      created: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      opens: 0,
      status: "unopened",
    };
    setLinks((prev) => [newLink, ...prev]);
    setProspectName("");
    toast.success(`Demo link created for ${prospectName}`);
  };

  const handleCopy = async (link: DemoLink) => {
    await navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    toast.success("Demo link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBulkGenerate = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.trim().split("\n").filter(Boolean);
    const newLinks = lines.map((line, i) => {
      const parts = line.split(",").map((s) => s.trim());
      const name = parts[0] || `Prospect ${i + 1}`;
      const bulkNiche = parts[1] || "plumbing";
      const prospectSlug = slugify(name);
      return {
        id: `bulk-${Date.now()}-${i}`,
        prospect: name,
        niche: bulkNiche,
        url: `https://bookedrankedfunded.org/demo?agency=${agencySlug}&prospect=${prospectSlug}&niche=${bulkNiche}`,
        created: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        opens: 0,
        status: "unopened" as const,
      };
    });
    setLinks((prev) => [...newLinks, ...prev]);
    setBulkText("");
    setShowBulk(false);
    toast.success(`${newLinks.length} demo links generated!`);
  };

  const statusStyle: Record<string, string> = {
    unopened: "bg-slate-700/50 text-slate-400 border-slate-600/50",
    opened: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    trial: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };

  return (
    <div className="space-y-6" data-ocid="demolinks.section">
      {/* Performance copy */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4">
        <p className="text-slate-300 text-sm italic">
          "Agencies that send personalized demo links convert at{" "}
          <span className="text-white font-bold">34% higher rates</span> than
          those who share a generic link." — Hopkins, Reason Why framework
        </p>
      </div>

      {/* Generator */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Generate Co-Branded Demo Link
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-slate-300 text-xs">
              Prospect Business Name
            </Label>
            <Input
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="e.g. Martinez Plumbing"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              data-ocid="demolinks.prospect.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-xs">Niche</Label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white"
              data-ocid="demolinks.niche.select"
            >
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {n
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {prospectName && (
          <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 font-mono text-xs text-purple-300 break-all">
            {`https://bookedrankedfunded.org/demo?agency=${agencySlug}&prospect=${slugify(prospectName)}&niche=${niche}`}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={!prospectName.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2 disabled:opacity-40"
            data-ocid="demolinks.generate.primary_button"
          >
            <Link2 size={14} />
            Generate Link
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowBulk(!showBulk)}
            className="border-slate-600 text-slate-300 hover:text-white gap-2"
            data-ocid="demolinks.bulk.toggle"
          >
            Bulk Generator
          </Button>
        </div>

        {showBulk && (
          <div className="space-y-3 pt-2 border-t border-slate-700/50">
            <p className="text-xs text-slate-400">
              One prospect per line:{" "}
              <span className="font-mono text-purple-300">
                Business Name, niche
              </span>
            </p>
            <Textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={
                "Martinez Plumbing, plumbing\nGlow Med Spa, med-spa\nA-1 Roofing, roofing"
              }
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 resize-none font-mono text-xs"
              rows={5}
              data-ocid="demolinks.bulk.textarea"
            />
            <Button
              onClick={handleBulkGenerate}
              disabled={!bulkText.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2 disabled:opacity-40"
              data-ocid="demolinks.bulk.submit_button"
            >
              <Zap size={14} />
              Generate All Links
            </Button>
          </div>
        )}
      </div>

      {/* Link history */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Demo Link History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {[
                  "Prospect",
                  "Niche",
                  "Created",
                  "Opens",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {links.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500 text-sm"
                    data-ocid="demolinks.history.empty_state"
                  >
                    No demo links yet. Generate your first one above.
                  </td>
                </tr>
              ) : (
                links.map((link, i) => (
                  <tr
                    key={link.id}
                    className="border-t border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                    data-ocid={`demolinks.history.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-white">
                      {link.prospect}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 capitalize">
                      {link.niche.replace(/-/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {link.created}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-semibold ${link.opens > 0 ? "text-amber-400" : "text-slate-500"}`}
                      >
                        {link.opens}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`${statusStyle[link.status]} text-xs`}>
                        {link.status === "trial"
                          ? "Trial Started"
                          : link.status === "opened"
                            ? "Opened"
                            : "Unopened"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(link)}
                        className="border-slate-600 text-slate-300 hover:text-white hover:border-purple-500 text-xs h-7 gap-1"
                        data-ocid={`demolinks.history.copy.button.${i + 1}`}
                      >
                        {copiedId === link.id ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                        {copiedId === link.id ? "Copied!" : "Copy"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// White-Label Email Templates Tab (NEW)
// ──────────────────────────────────────────────
const EMAIL_TEMPLATES = [
  {
    id: "welcome",
    name: "Welcome Email",
    description: "Sent to new clients when their account is created",
    subject: "Welcome to {agency_name} — Your Growth Platform is Ready",
    body: "Hi {client_name},\n\nWelcome to {agency_name}! Your {niche} business dashboard is live and ready.\n\nHere's what's waiting for you:\n• Your AI voice agent is set up and ready to answer calls 24/7\n• Your website is published at your custom URL\n• Your first review request campaign is loaded\n\nLog in now to see everything live.\n\nTo your growth,\n{agency_name}",
  },
  {
    id: "monthly_report",
    name: "Monthly Report Email",
    description: "Sent with their branded performance report",
    subject: "{business_name} — Your {metric} Growth Report for {month}",
    body: "Hi {client_name},\n\nHere's your {niche} performance report for this month.\n\nHighlights:\n• New leads: {metric}\n• Review requests sent: {metric}\n• Calls handled by AI: {metric}\n\nFull report attached. Your business is growing — let's talk about what's next.\n\n{agency_name}",
  },
  {
    id: "trial_expiry",
    name: "Trial Expiry Reminder",
    description: "Sent 3 days before trial ends",
    subject: "Your {agency_name} trial ends in 3 days — keep your results",
    body: "Hi {client_name},\n\nYour 7-day trial with {agency_name} ends in 3 days.\n\nIn the past week, your AI front desk handled calls, your reviews improved, and your website went live.\n\nDon't let that stop. Activate your plan today and lock in everything that's working.\n\n{agency_name}",
  },
  {
    id: "reengagement",
    name: "Re-Engagement Email",
    description: "Sent to clients who haven't logged in for 14 days",
    subject:
      "We noticed you've been busy — here's what's been running for {business_name}",
    body: "Hi {client_name},\n\nWe noticed you haven't logged in recently — but your platform has been working the whole time.\n\nWhat happened while you were away:\n• Your AI agent handled {metric} calls\n• {metric} new reviews came in\n• {metric} leads were captured\n\nLog in to see everything. Your dashboard has a full summary waiting.\n\n{agency_name}",
  },
  {
    id: "checkin",
    name: "Check-In Email",
    description: "Sent by agency to show value and stay top of mind",
    subject: "Quick check-in from {agency_name} — {business_name} update",
    body: "Hi {client_name},\n\nJust checking in on {business_name}. Wanted to make sure everything is working well for you.\n\nIf there's anything you'd like to improve — more review requests, a new campaign, or a website update — reply here and I'll handle it same day.\n\nYour success is our priority.\n\n{agency_name}",
  },
];

const TOKENS = [
  "{client_name}",
  "{business_name}",
  "{agency_name}",
  "{niche}",
  "{metric}",
  "{month}",
];

function EmailTemplatesTab({ settings }: { settings: WhiteLabelSettings }) {
  const [activeTemplate, setActiveTemplate] = useState(EMAIL_TEMPLATES[0].id);
  const [templates, setTemplates] = useState(EMAIL_TEMPLATES);
  const [previewMode, setPreviewMode] = useState(false);

  const active = templates.find((t) => t.id === activeTemplate) ?? templates[0];
  const agencyName = settings.agencyName || "Your Agency";

  const updateTemplate = (field: "subject" | "body", value: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === activeTemplate ? { ...t, [field]: value } : t)),
    );
  };

  const insertToken = (token: string) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === activeTemplate ? { ...t, body: `${t.body} ${token}` } : t,
      ),
    );
  };

  const previewBody = active.body
    .replace(/{agency_name}/g, agencyName)
    .replace(/{client_name}/g, "Carlos Martinez")
    .replace(/{business_name}/g, "Martinez Plumbing")
    .replace(/{niche}/g, "Plumbing")
    .replace(/{metric}/g, "12")
    .replace(/{month}/g, "December 2024");

  const previewSubject = active.subject
    .replace(/{agency_name}/g, agencyName)
    .replace(/{business_name}/g, "Martinez Plumbing")
    .replace(/{metric}/g, "12")
    .replace(/{month}/g, "December 2024");

  return (
    <div className="space-y-5" data-ocid="emailtemplates.section">
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4">
        <p className="text-slate-300 text-sm italic">
          "Every email your clients receive should reinforce{" "}
          <span className="text-white font-semibold">YOUR brand</span> — not
          ours. That's the power of white-label." — Kennedy direct response
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Template list */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Templates
          </p>
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTemplate(t.id)}
              className={`w-full text-left rounded-lg px-3 py-3 border transition-all text-sm ${activeTemplate === t.id ? "border-purple-500/50 bg-purple-500/10 text-white" : "border-slate-700/50 bg-slate-800 text-slate-400 hover:text-white hover:border-slate-600"}`}
              data-ocid={`emailtemplates.template.item.${t.id}`}
            >
              <p className="font-semibold text-xs leading-tight">{t.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {t.description}
              </p>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">{active.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                From: <span className="text-purple-300">{agencyName}</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="border-slate-600 text-slate-300 hover:text-white text-xs h-7"
                data-ocid="emailtemplates.preview.toggle"
              >
                {previewMode ? "Edit" : "Preview"}
              </Button>
            </div>
          </div>

          {previewMode ? (
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
              <div
                className="h-1.5"
                style={{
                  background: `linear-gradient(90deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                }}
              />
              <div className="p-6 space-y-4">
                <div className="text-sm text-slate-600 space-y-1">
                  <div>
                    <span className="font-semibold">From:</span> {agencyName}{" "}
                    &lt;hello@youragency.com&gt;
                  </div>
                  <div>
                    <span className="font-semibold">Subject:</span>{" "}
                    {previewSubject}
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {previewBody}
                </div>
                <div className="border-t border-slate-100 pt-4 text-xs text-slate-400 text-center">
                  Powered by {agencyName}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs">Subject Line</Label>
                <Input
                  value={active.subject}
                  onChange={(e) => updateTemplate("subject", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                  data-ocid="emailtemplates.subject.input"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-xs">Body</Label>
                  <div className="flex flex-wrap gap-1">
                    {TOKENS.map((token) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => insertToken(token)}
                        className="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/25 rounded px-1.5 py-0.5 hover:bg-purple-500/25 transition-colors font-mono"
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  value={active.body}
                  onChange={(e) => updateTemplate("body", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none font-mono text-xs"
                  rows={10}
                  data-ocid="emailtemplates.body.textarea"
                />
              </div>
              <Button
                onClick={() => toast.success(`${active.name} saved!`)}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                data-ocid="emailtemplates.save.save_button"
              >
                <Check size={14} />
                Save Template
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Partner Leaderboard Tab (NEW)
// ──────────────────────────────────────────────
const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: "You",
    masked: false,
    clients: 8,
    mrr: 12840,
    conversions: 3,
    trend: "+12%",
  },
  {
    rank: 2,
    name: "Agency #2",
    masked: true,
    clients: 24,
    mrr: 31200,
    conversions: 7,
    trend: "+8%",
  },
  {
    rank: 3,
    name: "Agency #3",
    masked: true,
    clients: 18,
    mrr: 22860,
    conversions: 5,
    trend: "+15%",
  },
  {
    rank: 4,
    name: "Agency #4",
    masked: true,
    clients: 12,
    mrr: 14760,
    conversions: 2,
    trend: "+3%",
  },
  {
    rank: 5,
    name: "Agency #5",
    masked: true,
    clients: 9,
    mrr: 11430,
    conversions: 1,
    trend: "+6%",
  },
];

const TIERS = [
  {
    name: "Starter",
    range: "1–5 clients",
    unlocks: "Core platform access",
    color: "text-slate-400",
    min: 0,
    max: 5,
  },
  {
    name: "Growth",
    range: "6–20 clients",
    unlocks: "Co-branded demo templates",
    color: "text-amber-400",
    min: 6,
    max: 20,
  },
  {
    name: "Pro",
    range: "21–50 clients",
    unlocks: "Custom pricing control",
    color: "text-purple-400",
    min: 21,
    max: 50,
  },
  {
    name: "Elite",
    range: "51+ clients",
    unlocks: "Dedicated success manager + co-marketing",
    color: "text-yellow-400",
    min: 51,
    max: 999,
  },
];

function LeaderboardTab() {
  const myClients = 8;
  const currentTierIdx = TIERS.findIndex(
    (t) => myClients >= t.min && myClients <= t.max,
  );
  const currentTier = TIERS[currentTierIdx];
  const nextTier = TIERS[currentTierIdx + 1];
  const toNextTier = nextTier ? nextTier.min - myClients : 0;
  const tierProgress = nextTier
    ? ((myClients - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={16} className="text-yellow-400" />;
    if (rank === 2) return <Medal size={16} className="text-slate-300" />;
    if (rank === 3) return <Medal size={16} className="text-amber-600" />;
    return (
      <span className="text-slate-500 text-sm font-bold w-4 text-center">
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-6" data-ocid="leaderboard.section">
      {/* Hormozi elite copy */}
      <div
        className="rounded-xl border border-yellow-500/20 p-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(234,179,8,0.08) 0%, rgba(124,58,237,0.08) 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Crown size={18} className="text-yellow-400" />
          <h3 className="text-white font-bold">Elite Partner Performance</h3>
        </div>
        <p className="text-slate-300 text-sm">
          Elite partners average{" "}
          <span className="text-yellow-400 font-bold">$24,500/month MRR</span>.
          This is what a real agency business looks like. The top 10 partners in
          this network all started exactly where you are now.
        </p>
      </div>

      {/* My tier progress */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Your Current Tier
            </p>
            <p className={`text-xl font-bold mt-0.5 ${currentTier.color}`}>
              {currentTier.name} Partner
            </p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            {myClients} Active Clients
          </Badge>
        </div>
        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">
                Progress to{" "}
                <span
                  className={
                    nextTier.color === "text-yellow-400"
                      ? "text-yellow-400"
                      : nextTier.color === "text-purple-400"
                        ? "text-purple-400"
                        : "text-amber-400"
                  }
                >
                  {nextTier.name}
                </span>
              </span>
              <span className="text-white font-medium">
                {myClients}/{nextTier.min} clients
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
            <p className="text-xs text-purple-300 font-medium">
              You need{" "}
              <span className="text-white font-bold">
                {toNextTier} more active client{toNextTier !== 1 ? "s" : ""}
              </span>{" "}
              to reach {nextTier.name} tier and unlock: {nextTier.unlocks}
            </p>
          </div>
        )}
      </div>

      {/* Monthly prize */}
      <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 flex items-center gap-4">
        <Trophy size={20} className="text-yellow-400 flex-shrink-0" />
        <div>
          <p className="text-white font-semibold text-sm">
            Monthly Race — Top Partner Prize
          </p>
          <p className="text-amber-300 text-xs mt-0.5">
            Top partner this month closes with a free upgrade to Elite tier.
            Race ends December 31st. You are currently ranked #1. Maintain your
            lead.
          </p>
        </div>
      </div>

      {/* Leaderboard table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Partner Rankings — This Month
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {[
                  "Rank",
                  "Agency",
                  "Active Clients",
                  "MRR",
                  "Conversions",
                  "Trend",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD_DATA.map((row, i) => {
                const isMe = !row.masked;
                return (
                  <tr
                    key={row.rank}
                    className={`border-t border-slate-700/50 transition-colors ${isMe ? "bg-purple-500/10 border-l-2 border-l-purple-500" : "hover:bg-slate-700/20"}`}
                    data-ocid={`leaderboard.row.item.${i + 1}`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {rankIcon(row.rank)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-sm font-semibold ${isMe ? "text-purple-300" : "text-slate-300"}`}
                      >
                        {isMe ? `${row.name} (You)` : row.name}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-white font-medium">
                      {row.clients}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-emerald-400">
                      ${row.mrr.toLocaleString()}/mo
                    </td>
                    <td className="px-4 py-3.5 text-sm text-white">
                      {row.conversions}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                        <TrendingUp size={12} />
                        {row.trend}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TIERS.map((tier, i) => {
          const isActive = i === currentTierIdx;
          return (
            <div
              key={tier.name}
              className={`rounded-xl p-4 border transition-all ${isActive ? "border-purple-500/50 bg-purple-500/10" : "border-slate-700/50 bg-slate-800"}`}
              data-ocid={`leaderboard.tier.item.${i + 1}`}
            >
              <p className={`text-sm font-bold ${tier.color}`}>{tier.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{tier.range}</p>
              <div className="mt-2 pt-2 border-t border-slate-700/40">
                <p className="text-[11px] text-slate-300 leading-snug">
                  {tier.unlocks}
                </p>
              </div>
              {isActive && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] mt-2">
                  Current Tier
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────
export default function WhiteLabelHubPage() {
  const { whiteLabelSettings, setWhiteLabelSettings } = useApp();
  const [draft, setDraft] = useState<WhiteLabelSettings>(whiteLabelSettings);

  const onChange = (patch: Partial<WhiteLabelSettings>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    setWhiteLabelSettings(draft);
    toast.success("White-label settings saved!");
  };

  const liveSettings = draft;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              Admin Only
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Palette size={24} className="text-purple-400" />
            White-Label Hub
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Revenue intelligence, co-branded demos, email templates, partner
            leaderboard, brand setup, and client management.
          </p>
        </div>
      </div>

      {/* Agency Launch Wizard — shown to new partners */}
      <OnboardingWizardPanel />

      {/* Quick-Start Banner — only shows if brand not configured yet */}
      {whiteLabelSettings.agencyName === "Your Agency Name" && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-amber-300 text-sm font-semibold">
              Complete your brand setup
            </p>
            <p className="text-amber-400/70 text-xs mt-0.5">
              Configure your agency name, logo, and colors to activate your
              shareable onboarding link.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const brandTab = document.querySelector(
                '[data-ocid="whitelabel.brand.tab"]',
              ) as HTMLButtonElement | null;
              brandTab?.click();
            }}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex-shrink-0"
            data-ocid="whitelabel.quickstart.primary_button"
          >
            Set Up Now <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-slate-800 border border-slate-700/50 p-1 h-auto flex-wrap gap-1">
          {(
            [
              { value: "revenue", label: "Revenue", icon: TrendingUp },
              { value: "demo-links", label: "Demo Links", icon: Link2 },
              {
                value: "email-templates",
                label: "Email Templates",
                icon: Mail,
              },
              { value: "leaderboard", label: "Leaderboard", icon: Trophy },
              { value: "brand", label: "Brand Settings", icon: Palette },
              { value: "link", label: "Onboarding Link", icon: ArrowUpRight },
              { value: "preview", label: "Portal Preview", icon: Monitor },
              { value: "domain", label: "Domain & Access", icon: Globe },
              { value: "clients", label: "Client Controls", icon: Users },
              { value: "email", label: "Email & Sender", icon: Send },
            ] as const
          ).map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400 hover:text-slate-200 gap-1.5 text-xs sm:text-sm px-3 py-2"
              data-ocid={`whitelabel.${value}.tab`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="revenue">
          <RevenueTab agencyName={liveSettings.agencyName} />
        </TabsContent>
        <TabsContent value="demo-links">
          <DemoLinksTab settings={liveSettings} />
        </TabsContent>
        <TabsContent value="email-templates">
          <EmailTemplatesTab settings={liveSettings} />
        </TabsContent>
        <TabsContent value="leaderboard">
          <LeaderboardTab />
        </TabsContent>
        <TabsContent value="brand">
          <BrandTab
            settings={liveSettings}
            onChange={onChange}
            onSave={handleSave}
          />
        </TabsContent>
        <TabsContent value="link">
          <OnboardingLinkTab
            settings={liveSettings}
            onChange={onChange}
            onSave={handleSave}
          />
        </TabsContent>
        <TabsContent value="preview">
          <PortalPreviewTab settings={liveSettings} />
        </TabsContent>
        <TabsContent value="domain">
          <DomainTab
            settings={liveSettings}
            onChange={onChange}
            onSave={handleSave}
          />
        </TabsContent>
        <TabsContent value="clients">
          <ClientBrandingTab />
        </TabsContent>
        <TabsContent value="email">
          <EmailSenderTab
            settings={liveSettings}
            onChange={onChange}
            onSave={handleSave}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
