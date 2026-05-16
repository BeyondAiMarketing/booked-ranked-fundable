import {
  CheckCircle2,
  Code,
  Copy,
  Eye,
  MessageSquare,
  Palette,
  Plus,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";

const NICHE_DEFAULTS: Record<string, { greeting: string; faq: string[] }> = {
  plumbing: {
    greeting: "Hi! Need fast, reliable plumbing help?",
    faq: [
      "Do you offer emergency services?",
      "What areas do you serve?",
      "How do I get a quote?",
    ],
  },
  restoration: {
    greeting: "Hi! Got water, fire, or mold damage? We can help.",
    faq: [
      "Do you work with insurance?",
      "How fast can you respond?",
      "What areas do you cover?",
    ],
  },
  "med spa": {
    greeting: "Welcome! Looking to book a treatment or consultation?",
    faq: [
      "What services do you offer?",
      "How do I book an appointment?",
      "Do you offer memberships?",
    ],
  },
  hvac: {
    greeting: "Hi! Need heating or cooling help today?",
    faq: [
      "Do you offer emergency AC repair?",
      "What brands do you service?",
      "Do you offer maintenance plans?",
    ],
  },
  default: {
    greeting: "Hi! How can we help you today?",
    faq: [
      "What services do you offer?",
      "How do I get a quote?",
      "What areas do you serve?",
    ],
  },
};

export default function ChatWidgetPage() {
  const { currentTenantId, tenants } = useApp();
  const tenant = tenants.find((t) => t.id === currentTenantId);
  const niche = (tenant?.type ?? "default").toLowerCase();
  const defaults = NICHE_DEFAULTS[niche] ?? NICHE_DEFAULTS.default;

  const [greeting, setGreeting] = useState(defaults.greeting);
  const [faqItems, setFaqItems] = useState<string[]>(defaults.faq);
  const [newFaq, setNewFaq] = useState("");
  const [leadCapture, setLeadCapture] = useState(true);
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [_previewOpen, _setPreviewOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const embedCode = `<script
  src="https://widget.bookedrankedfundable.com/chat.js"
  data-tenant="${currentTenantId}"
  data-niche="${niche}"
  async
></script>`;

  const addFaq = () => {
    if (!newFaq.trim()) return;
    setFaqItems((prev) => [...prev, newFaq.trim()]);
    setNewFaq("");
  };

  const removeFaq = (item: string) => {
    setFaqItems((prev) => prev.filter((f) => f !== item));
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("Chat widget configuration saved");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Chat Widget</h2>
        <p className="text-gray-400 text-sm">
          Configure your AI chat widget — customize, preview, and get the embed
          code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-5">
          {/* Greeting */}
          <Card className="bg-card border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <MessageSquare size={15} className="text-indigo-400" /> Widget
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-gray-400">
                  Greeting Message
                </Label>
                <Textarea
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-gray-200"
                  rows={2}
                  data-ocid="chat.greeting.input"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Lead Capture</p>
                  <p className="text-xs text-gray-500">
                    Collect name, email, phone from visitors
                  </p>
                </div>
                <Switch
                  checked={leadCapture}
                  onCheckedChange={setLeadCapture}
                  data-ocid="chat.lead_capture.toggle"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Appointment Booking</p>
                  <p className="text-xs text-gray-500">
                    Let visitors book directly from chat
                  </p>
                </div>
                <Switch
                  checked={bookingEnabled}
                  onCheckedChange={setBookingEnabled}
                  data-ocid="chat.booking.toggle"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ Items */}
          <Card className="bg-card border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles size={15} className="text-purple-400" /> Quick Reply
                FAQs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {faqItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2"
                  >
                    <span className="flex-1 text-sm text-gray-300 min-w-0 truncate">
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFaq(item)}
                      className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                      aria-label="Remove FAQ"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newFaq}
                  onChange={(e) => setNewFaq(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addFaq();
                  }}
                  placeholder="Add a FAQ question..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  data-ocid="chat.add_faq.input"
                />
                <Button
                  onClick={addFaq}
                  variant="outline"
                  className="border-gray-700 text-gray-400 hover:text-white"
                >
                  <Plus size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-card border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Palette size={15} className="text-amber-400" /> Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-gray-400">Primary Color</Label>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {[
                    "#6366f1",
                    "#7c3aed",
                    "#0ea5e9",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPrimaryColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${primaryColor === color ? "border-white scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            data-ocid="chat.save.button"
          >
            {saved ? (
              <>
                <CheckCircle2 size={14} className="mr-1.5" /> Saved
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </div>

        {/* Preview + Embed */}
        <div className="space-y-5">
          {/* Widget Preview */}
          <Card className="bg-card border-gray-800">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Eye size={15} className="text-emerald-400" /> Widget Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-2xl overflow-hidden border border-gray-700 shadow-xl"
                style={{ maxWidth: 300 }}
              >
                {/* Widget Header */}
                <div
                  className="px-4 py-3 flex items-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageSquare size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {tenant?.name ?? "Your Business"}
                    </p>
                    <p className="text-[10px] text-white/70">
                      Typically replies in seconds
                    </p>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                {/* Chat Body */}
                <div className="bg-white p-3 space-y-2.5 min-h-[160px]">
                  <div className="flex gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Sparkles size={11} className="text-white" />
                    </div>
                    <div
                      className="px-3 py-2 rounded-xl rounded-tl-sm text-xs text-gray-900 max-w-[80%]"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      {greeting}
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {faqItems.slice(0, 2).map((faq) => (
                      <span
                        key={faq}
                        className="text-[10px] px-2 py-1 rounded-full border text-xs text-gray-700 border-gray-300 bg-gray-50"
                      >
                        {faq}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Input */}
                <div className="bg-white border-t border-gray-100 px-3 py-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 text-xs bg-gray-50 rounded-full px-3 py-1.5 outline-none text-gray-700 border border-gray-200"
                    readOnly
                  />
                  <button
                    type="button"
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                    aria-label="Send"
                  >
                    <span className="text-white text-xs">→</span>
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Preview updates as you configure settings.
              </p>
            </CardContent>
          </Card>

          {/* Embed Code */}
          <Card className="bg-card border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Code size={15} className="text-indigo-400" /> Embed Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-400">
                Paste this snippet just before the closing{" "}
                <code className="text-indigo-400">&lt;/body&gt;</code> tag on
                your website.
              </p>
              <div className="bg-gray-900 rounded-xl p-3 border border-gray-700 relative">
                <code className="text-xs text-emerald-400 font-mono whitespace-pre-wrap break-all">
                  {embedCode}
                </code>
              </div>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-400 hover:text-white"
                onClick={() => {
                  navigator.clipboard.writeText(embedCode);
                  toast.success("Embed code copied!");
                }}
                data-ocid="chat.copy_embed.button"
              >
                <Copy size={13} className="mr-1.5" /> Copy Embed Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
