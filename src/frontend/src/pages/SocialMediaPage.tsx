import {
  BarChart2,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Copy,
  Dna,
  Facebook,
  Globe,
  Instagram,
  Link,
  Linkedin,
  Loader2,
  Lock,
  MessageCircle,
  MessageSquare,
  Plus,
  Radio,
  RefreshCw,
  Settings,
  Share2,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserPlus,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BrandVoiceDNAPanel } from "../components/social/BrandVoiceDNAPanel";
import { CommentAgentPanel } from "../components/social/CommentAgentPanel";
import { FunnelCalendar } from "../components/social/FunnelCalendar";
import { NichePostIntelligencePanel } from "../components/social/NichePostIntelligencePanel";
import PlatformFormatOptimizer from "../components/social/PlatformFormatOptimizer";
import ProofContentGenerator from "../components/social/ProofContentGenerator";
import { SocialListeningPanel } from "../components/social/SocialListeningPanel";
import { WeeklyMixSummary } from "../components/social/WeeklyMixSummary";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { useBrandKit } from "../hooks/useBrandKit";
import { getTrialDaysRemaining } from "../types/brandKit";
import type { FunnelStage, SocialPost } from "../types/socialMedia";

// ── Types ────────────────────────────────────────────────────────────────────

type PostStatus = "draft" | "scheduled" | "published" | "failed";
type PlatformConnectionStatus = "connected" | "disconnected" | "syncing";

interface PlatformConnection {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  status: PlatformConnectionStatus;
  pages?: number;
  lastSync?: string;
  description: string;
  nicheImpact: string;
}

interface Post {
  id: string;
  day: string;
  slot: number;
  platform: string;
  text: string;
  time: string;
  status?: PostStatus;
  engagement?: number;
  scheduledPlatforms?: string[];
  scheduledDate?: string;
  ctaClicks?: number;
}

// ── Constants ────────────────────────────────────────────────────────────────

const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    day: "Mon",
    slot: 0,
    platform: "fb",
    text: "Start the week right! Emergency service available 24/7. Call us now.",
    time: "9:00 AM",
    status: "published",
    engagement: 142,
    scheduledPlatforms: ["fb"],
    ctaClicks: 63,
  },
  {
    id: "p2",
    day: "Wed",
    slot: 1,
    platform: "ig",
    text: "Summer HVAC Special — Book Now and Save 15%. Limited spots available this month.",
    time: "12:00 PM",
    status: "scheduled",
    engagement: 0,
    scheduledPlatforms: ["ig", "fb"],
    ctaClicks: 0,
  },
  {
    id: "p3",
    day: "Fri",
    slot: 0,
    platform: "google",
    text: "Thank you to all our 5-star reviewers this week! We love serving our community.",
    time: "10:00 AM",
    status: "published",
    engagement: 89,
    scheduledPlatforms: ["google"],
    ctaClicks: 24,
  },
  {
    id: "p4",
    day: "Sat",
    slot: 2,
    platform: "fb",
    text: "Weekend availability — same great service. Book online or call us directly.",
    time: "8:00 AM",
    status: "failed",
    engagement: 0,
    scheduledPlatforms: ["fb", "ig"],
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Morning", "Midday", "Evening"];

const MOCK_REVIEWS = [
  {
    id: "r1",
    author: "Marcus T.",
    rating: 5,
    text: "Absolutely fantastic service! They showed up within the hour and fixed everything perfectly. Will definitely use again.",
    platform: "Google",
  },
  {
    id: "r2",
    author: "Sandra K.",
    rating: 4,
    text: "Good work overall, a little late but communicated well. Price was fair and quality was excellent.",
    platform: "Yelp",
  },
  {
    id: "r3",
    author: "David R.",
    rating: 3,
    text: "Did the job but the crew left a bit of a mess. Would probably try someone else next time.",
    platform: "Facebook",
  },
];

const NICHES = [
  "Plumber",
  "HVAC",
  "Med Spa",
  "Restoration",
  "Carpet Cleaning",
  "Roofing",
];

const POST_TYPES = [
  "Educational Tip",
  "Before & After",
  "Offer / Promotion",
  "Seasonal",
  "Review Highlight",
  "Behind the Scenes",
];

const PLATFORM_CHAR_LIMITS: Record<string, number> = {
  Facebook: 63206,
  Instagram: 2200,
  Google: 1500,
};

const AI_POST_RESULTS: Record<string, Record<string, string>> = {
  Plumber: {
    Professional:
      "Our licensed plumbers are ready to tackle any issue — from emergency leaks to full repiping. Certified technicians, upfront pricing, and a 100% satisfaction guarantee on every job.",
    Friendly:
      "Hey neighbors! 👋 Dripping faucet? Burst pipe? No worries — we're your local plumbing pros and we love helping our community. Call us anytime, we're always here!",
    Urgent:
      "⚠️ Plumbing emergency? Don't wait — water damage gets worse by the minute. Our 24/7 emergency team is standing by. Call now and we'll be there in 60 minutes or less.",
  },
  HVAC: {
    Professional:
      "Keep your home comfortable year-round with our certified HVAC maintenance and installation services. Energy-efficient solutions, licensed technicians, and manufacturer warranties on every system.",
    Friendly:
      "Summer heat hitting hard? 😅 Our HVAC crew is booking fast — grab your spot before the rush! We've kept thousands of local families cool and comfortable for over 15 years.",
    Urgent:
      "⚠️ AC out in this heat? Limited emergency slots available TODAY. Don't suffer — call us now and we'll have you cool again before bedtime. Same-day service guaranteed.",
  },
  "Med Spa": {
    Professional:
      "Experience results-driven aesthetics in a clinical, luxurious environment. Our board-certified practitioners deliver the latest treatments — Botox, fillers, laser, and beyond — with precision and care.",
    Friendly:
      "Treat yourself to the glow-up you deserve! ✨ Our med spa team creates personalized treatment plans so every visit leaves you feeling confident and refreshed. Book your free consultation today!",
    Urgent:
      "⏰ Only 3 consultation slots left this week! Our most popular treatments are booking out fast. Secure your spot now and start your transformation journey — you've earned it.",
  },
  Restoration: {
    Professional:
      "When disaster strikes, our IICRC-certified restoration team is available 24/7. Water, fire, or mold damage — we restore your property to pre-loss condition, fast and with full insurance coordination.",
    Friendly:
      "We know dealing with damage is stressful — that's why we handle everything from assessment to full restoration. 🏠 Let us take the worry off your plate. We're here day and night.",
    Urgent:
      "🚨 Water damage spreading? Every hour counts. Call our emergency restoration hotline NOW — we mobilize immediately, work directly with your insurance, and stop the damage before it gets worse.",
  },
  "Carpet Cleaning": {
    Professional:
      "Restore your carpets to showroom condition with our hot-water extraction deep-clean process. Pet odors, deep stains, and allergens removed — 100% satisfaction guaranteed on every job.",
    Friendly:
      "Life's messy — that's what we're here for! 🐾 From pet accidents to red wine spills, our carpet cleaning team brings everything back to fresh and clean. Book in 60 seconds!",
    Urgent:
      "🕐 Weekend booking slots almost gone! Don't let another week go by with stained carpets. Book today and get fresh, clean floors by this weekend. Limited availability remaining.",
  },
  Roofing: {
    Professional:
      "Protect your biggest investment with a roof built to last. Our certified roofing contractors use premium materials, provide lifetime workmanship warranties, and handle all permit coordination.",
    Friendly:
      "Your roof is your home's first defense! ☔ Whether it's a small repair or full replacement, our local roofing team has you covered — literally. Free inspections, honest assessments, no pressure.",
    Urgent:
      "⛈️ Storm season is here — is your roof ready? Free post-storm inspections available this week only. Small issues become big (expensive) problems fast. Book your spot before they're gone.",
  },
};

const AD_COPY_RESULTS: Record<
  string,
  { headline: string; primary: string; cta: string }
> = {
  "More Calls": {
    headline: "More Calls. Less Missed Jobs.",
    primary:
      "Stop losing leads to competitors. Our AI front desk answers every call, books appointments automatically, and follows up — so you never miss a job again.",
    cta: "Call Now",
  },
  "More Website Visits": {
    headline: "Rank Higher. Get Found First.",
    primary:
      "Local homeowners search Google every day for exactly what you offer. Make sure they find you — not your competition. See how we improve your local rankings.",
    cta: "Learn More",
  },
  "Promote a Service": {
    headline: "Fast, Reliable Service in Your Area",
    primary:
      "Certified technicians. Same-day availability. 5-star reviewed by your neighbors. Book your appointment online in under 2 minutes.",
    cta: "Book Now",
  },
  "Seasonal Offer": {
    headline: "Limited-Time Offer — Book Before It's Gone",
    primary:
      "Seasonal demand is surging. Lock in your spot now and save on our most popular service packages. Offer expires at end of month.",
    cta: "Claim Offer",
  },
};

const REVIEW_RESPONSES: Record<number, string> = {
  5: "Thank you so much for the kind words! It was a pleasure serving you, and we're thrilled everything went smoothly. We look forward to helping you again in the future! 🙌",
  4: "Thank you for your feedback! We're glad you had a great experience overall, and we appreciate you noting the communication. We're always working to improve our scheduling — we hope to exceed your expectations next time!",
  3: "Thank you for taking the time to share your experience. We're sorry the cleanup wasn't up to our usual standard — that's not the experience we aim to deliver. We'd love to make it right. Please reach out to us directly so we can address this properly.",
};

// ── Niche-specific impact copy for disconnected platforms ─────────────────
const NICHE_IMPACT: Record<string, Record<string, string>> = {
  facebook: {
    plumbing:
      "The average plumber who posts 3x/week on Facebook gets 40% more inbound calls. Your competitors are already there.",
    hvac: "HVAC companies with active Facebook pages book 2x more seasonal tune-ups. Every month you're dark is revenue left behind.",
    med_spa:
      "Med spas on Facebook generate 35% of their consultation requests from social. You're invisible to that audience right now.",
    restoration:
      "Restoration companies that stay active on Facebook during storm season see 3x more emergency calls than those that don't.",
    roofing:
      "Roofing companies that post storm alerts and before/afters on Facebook get first-call advantage in their market.",
    default:
      "Businesses that post 3x/week on Facebook get 40% more inbound inquiries than those that don't. Connect to start winning.",
  },
  instagram: {
    plumbing:
      "Before/after photos drive massive engagement for plumbers. Instagram is your best visual proof platform — and you're not on it.",
    hvac: "HVAC companies that run active Instagram profiles rebook 2.3x more clients. Without Instagram, you're leaving $4,000/month on the table.",
    med_spa:
      "Med spas that post transformation content on Instagram fill their books 60% faster. Results speak louder than any ad.",
    restoration:
      "Water damage before/afters on Instagram drive emergency referrals. Your best portfolio is sitting unpublished.",
    roofing:
      "Roofing contractors with active Instagram pages win 45% more residential bids — homeowners research you there first.",
    default:
      "Instagram is where your best proof lives. Before/afters, reviews, results — all waiting to become your next booking.",
  },
  linkedin: {
    plumbing:
      "Commercial plumbing contracts are won on LinkedIn. Property managers, HOAs, and facility teams are there right now.",
    hvac: "HVAC companies that stay visible on LinkedIn during shoulder season get 60% more commercial contracts.",
    med_spa:
      "High-value aesthetic clients — executives, professionals — research providers on LinkedIn before booking.",
    restoration:
      "Insurance adjusters, property managers, and commercial clients live on LinkedIn. Not being there costs you contracts.",
    roofing:
      "Commercial roofing contracts are closed on LinkedIn. General contractors and property managers need to see you there.",
    default:
      "LinkedIn is where high-ticket B2B relationships are built. Your commercial clients are already there waiting for you.",
  },
  google_business: {
    default:
      "Google Business Profile posts appear directly in search results. Businesses that post weekly see 5x more profile views.",
  },
};

// ── Analytics mock data ───────────────────────────────────────────────────────

const ANALYTICS_METRICS = {
  totalPosts: 48,
  totalEngagements: 3847,
  avgEngagementRate: "7.2%",
  bestPlatform: "Instagram",
};

const PLATFORM_BREAKDOWN = [
  {
    platform: "Facebook",
    color: "oklch(0.6 0.18 240)",
    posts: 22,
    likes: 614,
    comments: 87,
    shares: 43,
  },
  {
    platform: "Instagram",
    color: "oklch(0.72 0.18 75)",
    posts: 18,
    likes: 1820,
    comments: 312,
    shares: 198,
  },
  {
    platform: "Google",
    color: "oklch(0.68 0.22 25)",
    posts: 8,
    likes: 432,
    comments: 56,
    shares: 0,
  },
];

const TOP_POSTS = [
  {
    id: "tp1",
    platform: "ig",
    excerpt:
      "Before & After: Bathroom remodel complete — from leaky pipes to...",
    date: "Apr 12",
    engagements: 892,
    rate: "12.4%",
  },
  {
    id: "tp2",
    platform: "fb",
    excerpt:
      "⭐⭐⭐⭐⭐ Huge thank you to the Johnson family for the kind review!",
    date: "Apr 8",
    engagements: 647,
    rate: "9.1%",
  },
  {
    id: "tp3",
    platform: "ig",
    excerpt:
      "Spring special: 20% off all HVAC tune-ups booked before May 31st.",
    date: "Apr 3",
    engagements: 541,
    rate: "8.7%",
  },
];

const HEATMAP_DATA = [
  [42, 18, 67],
  [28, 35, 51],
  [55, 72, 88],
  [31, 44, 39],
  [76, 91, 64],
  [83, 48, 29],
  [19, 62, 45],
];

// ── Helper components ─────────────────────────────────────────────────────────

function PlatformIcon({
  platform,
  size = 12,
}: { platform: string; size?: number }) {
  if (platform === "fb")
    return <Facebook size={size} className="text-blue-400" />;
  if (platform === "ig")
    return <Instagram size={size} className="text-amber-400" />;
  return <MessageSquare size={size} className="text-rose-400" />;
}

function StatusBadge({ status }: { status: PostStatus }) {
  const map: Record<PostStatus, { label: string; cls: string }> = {
    draft: {
      label: "Draft",
      cls: "bg-muted text-muted-foreground border-border",
    },
    scheduled: {
      label: "Scheduled",
      cls: "bg-primary/15 text-primary border-primary/30",
    },
    published: {
      label: "Published",
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    failed: {
      label: "Failed",
      cls: "bg-destructive/15 text-destructive border-destructive/30",
    },
  };
  const { label, cls } = map[status];
  return (
    <span
      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${cls}`}
    >
      {label}
    </span>
  );
}

function HeatCell({ value }: { value: number }) {
  const opacity = Math.max(0.06, value / 100);
  return (
    <div
      className="rounded flex items-center justify-center text-[9px] font-semibold text-primary h-8"
      style={{ backgroundColor: `oklch(0.58 0.22 290 / ${opacity})` }}
    >
      {value}
    </div>
  );
}

// ── Platform Connection Card ───────────────────────────────────────────────

function PlatformConnectionCard({
  connection,
  niche,
  onConnect,
  onDisconnect,
}: {
  connection: PlatformConnection;
  niche: string;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}) {
  const Icon = connection.icon;
  const isConnected = connection.status === "connected";
  const isSyncing = connection.status === "syncing";

  const nicheKey = niche.toLowerCase().replace(/\s+/g, "_").replace(/&/g, "");
  const impactMap = NICHE_IMPACT[connection.id] ?? NICHE_IMPACT.facebook;
  const impactCopy = impactMap[nicheKey] ?? impactMap.default;

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isConnected
          ? "bg-emerald-500/5 border-emerald-500/20"
          : "bg-card border-border hover:border-primary/30"
      }`}
      data-ocid={`social.platform_connection.${connection.id}.card`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${connection.color}20`,
              border: `1px solid ${connection.color}40`,
            }}
          >
            <Icon size={20} style={{ color: connection.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {connection.name}
              </span>
              {isConnected && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                  <Wifi size={8} />
                  Connected
                </span>
              )}
              {isSyncing && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                  <RefreshCw size={8} className="animate-spin" />
                  Syncing
                </span>
              )}
              {!isConnected && !isSyncing && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted/40 border border-border px-1.5 py-0.5 rounded-full">
                  <WifiOff size={8} />
                  Not Connected
                </span>
              )}
            </div>
            {isConnected && connection.pages !== undefined && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {connection.pages} page{connection.pages !== 1 ? "s" : ""}{" "}
                connected
                {connection.lastSync && ` · Synced ${connection.lastSync}`}
              </p>
            )}
            {!isConnected && (
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px] leading-snug">
                {impactCopy}
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant={isConnected ? "outline" : "default"}
          onClick={() =>
            isConnected ? onDisconnect(connection.id) : onConnect(connection.id)
          }
          data-ocid={`social.platform_connection.${connection.id}.${isConnected ? "disconnect" : "connect"}_button`}
          className={`text-xs shrink-0 ${isConnected ? "border-border text-muted-foreground hover:text-destructive hover:border-destructive/40" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
        >
          {isSyncing ? (
            <>
              <RefreshCw size={11} className="mr-1 animate-spin" />
              Syncing
            </>
          ) : isConnected ? (
            "Disconnect"
          ) : (
            <>
              <Plus size={11} className="mr-1" />
              Connect
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Platform OAuth Modal ───────────────────────────────────────────────────

function PlatformConnectModal({
  platform,
  onClose,
  onSave,
}: {
  platform: PlatformConnection | null;
  onClose: () => void;
  onSave: (id: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  if (!platform) return null;

  const Icon = platform.icon;

  const steps: Record<string, { title: string; body: string }[]> = {
    facebook: [
      {
        title: "Business Manager Account",
        body: "You need a Facebook Business Manager account at business.facebook.com. If you haven't created one yet, set it up there first — it takes about 2 minutes.",
      },
      {
        title: "App Credentials in Go Live",
        body: "Go to your Go Live Dashboard and enter your Facebook App ID and App Secret under Social Media Integrations. These come from your Facebook Developer App settings.",
      },
      {
        title: "Authorize Pages",
        body: "Click 'Save & Connect' below. BRF will connect to your Facebook Business Manager and show all pages you manage. Select the pages to post to.",
      },
    ],
    instagram: [
      {
        title: "Facebook Business Account",
        body: "Instagram Business accounts must be linked to a Facebook Business Manager. Make sure your Instagram Business profile is connected to your Facebook Page.",
      },
      {
        title: "App Credentials in Go Live",
        body: "Instagram uses the same Facebook App credentials. Your Facebook App ID and Secret in Go Live Dashboard covers both platforms automatically.",
      },
      {
        title: "Authorize Instagram",
        body: "Click 'Save & Connect' below. BRF will access your Instagram Business accounts through the Facebook Graph API — no separate Instagram login required.",
      },
    ],
    linkedin: [
      {
        title: "LinkedIn Company Page",
        body: "You need to be a Page Admin on your LinkedIn Company Page. Personal profiles cannot be connected — only Company Pages are supported for business publishing.",
      },
      {
        title: "OAuth Credentials in Go Live",
        body: "Go to your Go Live Dashboard and enter your LinkedIn Client ID and Client Secret under Social Media Integrations. These come from your LinkedIn Developer App.",
      },
      {
        title: "Authorize Company Page",
        body: "Click 'Save & Connect' below. You'll authorize BRF to publish on behalf of your company page. Only posts you approve will ever be published.",
      },
    ],
    google_business: [
      {
        title: "Google Business Profile",
        body: "Your Google API key in Go Live Dashboard already covers Google Business Profile. Make sure your business is verified at business.google.com.",
      },
      {
        title: "Enable Business API",
        body: "In your Google Cloud Console, enable the 'My Business Account Management API' and 'My Business Posts API' for the project tied to your API key.",
      },
      {
        title: "Connect Profile",
        body: "Click 'Save & Connect' below. BRF will use your existing Google API key to connect your Google Business Profile and enable post publishing directly from your scheduler.",
      },
    ],
  };

  const platformSteps = steps[platform.id] ?? steps.facebook;
  const currentStep = platformSteps[step - 1];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    onSave(platform.id);
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid={`social.platform_connect.${platform.id}.dialog`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-foreground">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${platform.color}20`,
                border: `1px solid ${platform.color}40`,
              }}
            >
              <Icon size={16} style={{ color: platform.color }} />
            </div>
            Connect {platform.name}
          </DialogTitle>
        </DialogHeader>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-1">
          {platformSteps.map((s) => (
            <div
              key={s.title}
              className={`h-1 flex-1 rounded-full transition-all ${platformSteps.indexOf(s) < step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">
          Step {step} of {platformSteps.length}
        </p>

        {/* Step content */}
        <div className="space-y-3">
          <div
            className="rounded-xl p-4 space-y-2"
            style={{
              background: "oklch(0.18 0.015 280)",
              border: "1px solid oklch(1 0 0 / 10%)",
            }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {currentStep.title}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentStep.body}
            </p>
          </div>

          <div className="flex gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                className="text-xs border-border"
              >
                Back
              </Button>
            )}
            {step < platformSteps.length ? (
              <Button
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                data-ocid={`social.platform_connect.${platform.id}.next_button`}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
              >
                Next Step
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                data-ocid={`social.platform_connect.${platform.id}.save_button`}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
              >
                {saving ? (
                  <>
                    <RefreshCw size={12} className="mr-1.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Save & Connect"
                )}
              </Button>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            Credentials are stored securely in your Go Live Dashboard.{" "}
            <a href="/go-live" className="text-primary hover:underline">
              Set up credentials →
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SocialMediaPage() {
  const {
    currentTenantId,
    socialMediaEnabled,
    socialComments,
    socialListeningAlerts,
    respondToSocialComment,
    dismissSocialAlert,
    getPendingSocialCommentsByTenant,
    getActiveSocialAlertsByTenant,
    getSocialPostsByTenant,
    deleteSocialPost,
    tenants,
  } = useApp();
  const isEnabled = socialMediaEnabled[currentTenantId] ?? false;

  const { prospects } = useBrandKit();
  const activeProspect = prospects.find(
    (p) => p.trialStatus === "Active" || p.trialStatus === "Expired",
  );
  const trialDaysRemaining = activeProspect
    ? getTrialDaysRemaining(activeProspect)
    : null;
  const trialExpired =
    activeProspect?.trialStatus === "Expired" || trialDaysRemaining === 0;
  const trialActive =
    activeProspect?.trialStatus === "Active" &&
    trialDaysRemaining !== null &&
    trialDaysRemaining > 0;

  const currentTenant = tenants.find((t) => t.id === currentTenantId);
  const tenantNiche = currentTenant?.type ?? "general";

  const calendarPosts: SocialPost[] = getSocialPostsByTenant(currentTenantId);
  const [calendarTab, setCalendarTab] = useState<string>("connections");

  // Platform connections state
  const [connections, setConnections] = useState<PlatformConnection[]>([
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "#1877F2",
      status: "disconnected",
      description: "Pages, groups, and ad accounts",
      nicheImpact: "",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "#E1306C",
      status: "disconnected",
      description: "Business profile and stories",
      nicheImpact: "",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "#0077B5",
      status: "disconnected",
      description: "Company page publishing",
      nicheImpact: "",
    },
    {
      id: "google_business",
      name: "Google Business Profile",
      icon: Globe,
      color: "#4285F4",
      status: "connected",
      pages: 1,
      lastSync: "2 min ago",
      description: "Posts appear in Google Search",
      nicheImpact: "",
    },
  ]);

  const [connectingPlatform, setConnectingPlatform] =
    useState<PlatformConnection | null>(null);

  const handleConnectPlatform = (id: string) => {
    const platform = connections.find((c) => c.id === id);
    if (platform) setConnectingPlatform(platform);
  };

  const handleDisconnectPlatform = (id: string) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "disconnected",
              pages: undefined,
              lastSync: undefined,
            }
          : c,
      ),
    );
    toast.success("Platform disconnected");
  };

  const handleSaveConnection = (id: string) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "connected", pages: 1, lastSync: "just now" }
          : c,
      ),
    );
    toast.success(
      `${connections.find((c) => c.id === id)?.name} connected successfully!`,
    );
  };

  const connectedCount = connections.filter(
    (c) => c.status === "connected",
  ).length;

  const handleFunnelCalendarSlotClick = (
    _day: string,
    _slotIndex: number,
    stage: FunnelStage,
  ) => {
    setCalendarTab("post-intelligence");
    toast.info(
      `Pre-filled for ${stage.toUpperCase()} post — use Post Intelligence to generate content.`,
    );
  };

  const handleQuickAddBofu = () => {
    setCalendarTab("post-intelligence");
    toast.info(
      "BOFU conversion post — generating content in Post Intelligence.",
    );
  };

  const handleDeleteCalendarPost = (postId: string) => {
    deleteSocialPost(postId);
    toast.success("Post removed from calendar");
  };

  const handleEditCalendarPost = (_post: SocialPost) => {
    toast.info("Edit post — use Post Intelligence to update content.");
  };

  const pendingCommentCount =
    getPendingSocialCommentsByTenant(currentTenantId).length;
  const activeAlertCount =
    getActiveSocialAlertsByTenant(currentTenantId).length;

  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const [postDesc, setPostDesc] = useState("");
  const [postTone, setPostTone] = useState("Professional");
  const [postNiche, setPostNiche] = useState("Plumber");
  const [postType, setPostType] = useState("Educational Tip");
  const [platformsFb, setPlatformsFb] = useState(true);
  const [platformsIg, setPlatformsIg] = useState(true);
  const [platformsGoogle, setPlatformsGoogle] = useState(false);
  const [generatingPost, setGeneratingPost] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");

  const [adObjective, setAdObjective] = useState("More Calls");
  const [adDesc, setAdDesc] = useState("");
  const [generatingAd, setGeneratingAd] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<{
    headline: string;
    primary: string;
    cta: string;
  } | null>(null);

  const [generatingReply, setGeneratingReply] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [leadCreatedComments, setLeadCreatedComments] = useState<Set<string>>(
    new Set(),
  );

  function handleCreateLeadFromComment(commentId: string, authorName: string) {
    setLeadCreatedComments((prev) => new Set(prev).add(commentId));
    toast.success(`Lead created for ${authorName}`, {
      description: "Added to CRM with source: Social Media",
    });
  }

  function handleProofAddToCalendar(caption: string, _niche: string) {
    for (const day of DAYS) {
      for (let slot = 0; slot < SLOTS.length; slot++) {
        const occupied = posts.some((p) => p.day === day && p.slot === slot);
        if (!occupied) {
          setPosts((prev) => [
            ...prev,
            {
              id: `p${Date.now()}`,
              day,
              slot,
              platform: "fb",
              text: caption,
              time:
                slot === 0 ? "9:00 AM" : slot === 1 ? "12:00 PM" : "6:00 PM",
              status: "scheduled",
              engagement: 0,
              scheduledPlatforms: ["fb", "ig"],
            },
          ]);
          return;
        }
      }
    }
    toast.error("No available calendar slots this week");
  }

  const handleGeneratePost = () => {
    setGeneratingPost(true);
    setGeneratedPost("");
    setTimeout(() => {
      const nicheResults =
        AI_POST_RESULTS[postNiche] ?? AI_POST_RESULTS.Plumber;
      setGeneratedPost(nicheResults[postTone] ?? nicheResults.Professional);
      setGeneratingPost(false);
    }, 1500);
  };

  const handleCopyToCalendar = () => {
    if (!generatedPost) return;
    for (const day of DAYS) {
      for (let slot = 0; slot < SLOTS.length; slot++) {
        const occupied = posts.some((p) => p.day === day && p.slot === slot);
        if (!occupied) {
          setPosts((prev) => [
            ...prev,
            {
              id: `p${Date.now()}`,
              day,
              slot,
              platform: platformsFb ? "fb" : platformsIg ? "ig" : "google",
              text: generatedPost,
              time:
                slot === 0 ? "9:00 AM" : slot === 1 ? "12:00 PM" : "6:00 PM",
              status: "scheduled",
              engagement: 0,
              scheduledPlatforms: [
                ...(platformsFb ? ["fb"] : []),
                ...(platformsIg ? ["ig"] : []),
                ...(platformsGoogle ? ["google"] : []),
              ],
            },
          ]);
          toast.success(`Post added to ${day} ${SLOTS[slot]} slot`);
          return;
        }
      }
    }
    toast.error("No available calendar slots this week");
  };

  const handleGenerateAd = () => {
    setGeneratingAd(true);
    setGeneratedAd(null);
    setTimeout(() => {
      setGeneratedAd(
        AD_COPY_RESULTS[adObjective] ?? AD_COPY_RESULTS["More Calls"],
      );
      setGeneratingAd(false);
    }, 1500);
  };

  const handleDraftReply = (reviewId: string, rating: number) => {
    setGeneratingReply(reviewId);
    setTimeout(() => {
      setReplies((prev) => ({
        ...prev,
        [reviewId]: REVIEW_RESPONSES[rating] ?? REVIEW_RESPONSES[5],
      }));
      setGeneratingReply(null);
    }, 1500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  };

  // ── Locked state ──────────────────────────────────────────────────────────

  if (!isEnabled) {
    return (
      <div className="max-w-2xl mx-auto pt-8" data-ocid="social.locked.panel">
        <div className="relative rounded-2xl border border-border overflow-hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Lock size={28} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Social Media Management
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Automate your content, ads, and review responses — all from one
              place. Ask your agency to unlock this module.
            </p>
            <ul className="space-y-2 mb-6 text-left">
              {[
                {
                  icon: Settings,
                  label:
                    "Platform Connections — Facebook, Instagram, LinkedIn, Google Business",
                },
                {
                  icon: Calendar,
                  label:
                    "Content Calendar — schedule posts across all connected platforms",
                },
                {
                  icon: Sparkles,
                  label:
                    "AI Post Generator — write niche-specific posts in seconds",
                },
                {
                  icon: Zap,
                  label:
                    "Facebook Ad Copy — generate high-converting ad copy by objective",
                },
                {
                  icon: MessageSquare,
                  label:
                    "Review Response Drafts — AI-drafted responses for every review",
                },
                {
                  icon: BarChart2,
                  label:
                    "Analytics — post performance, platform breakdown, heatmap",
                },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Icon size={15} className="text-primary mt-0.5 shrink-0" />
                  {label}
                </li>
              ))}
            </ul>
            <Button
              data-ocid="social.upgrade.button"
              onClick={() =>
                toast.info("Your account manager has been notified")
              }
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Contact Your Agency to Upgrade
            </Button>
          </div>
          <div className="p-6 opacity-30 pointer-events-none select-none">
            <div className="h-8 w-48 bg-muted rounded mb-4" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 21 }, (_, i) => String(i + 1)).map((k) => (
                <div key={k} className="h-16 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Social Media</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform connections, content calendar, AI generator, and engagement
            tools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Wifi size={11} />
            {connectedCount} platform{connectedCount !== 1 ? "s" : ""} connected
          </div>
        </div>
      </div>

      {/* ── Trial Status Banner ─────────────────────────────────────────── */}
      {trialExpired && (
        <div
          className="rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            backgroundColor: "oklch(0.62 0.2 25 / 12%)",
            border: "1px solid oklch(0.62 0.2 25 / 30%)",
          }}
          data-ocid="social.trial_banner.expired"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🔒</span>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "oklch(0.82 0.14 25)" }}
              >
                Trial Ended — Content creation locked
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your published content stays live — upgrade to keep creating
              </p>
            </div>
          </div>
          <a
            href="https://bookedrankedfunded.org/setup"
            data-ocid="social.trial_banner.upgrade_button"
          >
            <button
              type="button"
              className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-lg transition-all hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.18 290))",
                color: "oklch(0.98 0.005 280)",
              }}
            >
              Upgrade Now →
            </button>
          </a>
        </div>
      )}
      {trialActive && trialDaysRemaining === 1 && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{
            backgroundColor: "oklch(0.72 0.18 75 / 12%)",
            border: "1px solid oklch(0.72 0.18 75 / 30%)",
          }}
          data-ocid="social.trial_banner.last_day"
        >
          <span className="text-lg">⚠️</span>
          <p
            className="text-sm font-semibold"
            style={{ color: "oklch(0.87 0.14 75)" }}
          >
            Last Day of Trial — content creation locks at midnight
          </p>
        </div>
      )}
      {trialActive && trialDaysRemaining !== null && trialDaysRemaining > 1 && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-2.5"
          style={{
            backgroundColor: "oklch(0.62 0.18 155 / 10%)",
            border: "1px solid oklch(0.62 0.18 155 / 25%)",
          }}
          data-ocid="social.trial_banner.active"
        >
          <span className="text-lg">🟢</span>
          <p className="text-sm" style={{ color: "oklch(0.78 0.14 155)" }}>
            <span className="font-semibold">Trial Mode</span>
            {" — "}
            <span>{trialDaysRemaining} days remaining</span>
            {" — Content creation available"}
          </p>
        </div>
      )}

      {/* ── Top-level tabs ─────────────────────────────────────────────── */}
      <Tabs defaultValue="posts" data-ocid="social.top.tab">
        <TabsList className="bg-muted/60 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="connections" data-ocid="social.connections.tab">
            <Settings size={13} className="mr-1.5" />
            Connections
            {connectedCount < 4 && (
              <span className="ml-1.5 bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {4 - connectedCount} pending
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="posts" data-ocid="social.posts.tab">
            <Calendar size={13} className="mr-1.5" />
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="comment-agent"
            data-ocid="social.comment_agent.tab"
          >
            <MessageCircle size={13} className="mr-1.5" />
            Comment Agent
            {pendingCommentCount > 0 && (
              <span className="ml-1.5 bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingCommentCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="listening" data-ocid="social.listening.tab">
            <Radio size={13} className="mr-1.5" />
            Listening
            {activeAlertCount > 0 && (
              <span className="ml-1.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {activeAlertCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Platform Connections tab ──────────────────────────────────── */}
        <TabsContent value="connections" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Platform Connections
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect your social accounts to enable real publishing,
                  engagement monitoring, and performance tracking. Credentials
                  are stored securely in your Go Live Dashboard.
                </p>
              </div>
              <a
                href="/go-live"
                className="text-xs text-primary hover:underline flex items-center gap-1"
                data-ocid="social.connections.go_live_link"
              >
                <Settings size={11} />
                Go Live Settings
              </a>
            </div>

            {/* Connection status bar */}
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
              style={{
                background:
                  connectedCount === 4
                    ? "oklch(0.62 0.18 155 / 8%)"
                    : "oklch(0.58 0.22 290 / 8%)",
                border: `1px solid ${connectedCount === 4 ? "oklch(0.62 0.18 155 / 25%)" : "oklch(0.58 0.22 290 / 25%)"}`,
              }}
              data-ocid="social.connections.status_bar"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2 h-2 rounded-full ${connectedCount === 4 ? "bg-emerald-400" : "bg-primary animate-pulse"}`}
                />
                <p className="text-sm font-medium text-foreground">
                  {connectedCount === 4
                    ? "All platforms connected — you're publishing everywhere your clients are"
                    : `${connectedCount} of 4 platforms connected — connect remaining platforms to maximize reach`}
                </p>
              </div>
              {connectedCount < 4 && (
                <Badge className="bg-primary/15 text-primary border-primary/30 text-xs shrink-0">
                  {4 - connectedCount} to go
                </Badge>
              )}
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              data-ocid="social.connections.list"
            >
              {connections.map((conn) => (
                <PlatformConnectionCard
                  key={conn.id}
                  connection={conn}
                  niche={tenantNiche}
                  onConnect={handleConnectPlatform}
                  onDisconnect={handleDisconnectPlatform}
                />
              ))}
            </div>

            {/* Integration note */}
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Share2 size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      How connections work
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      BRF runs on the Internet Computer (ICP). OAuth credentials
                      you configure in Go Live are used server-side to publish
                      posts and pull engagement data.
                      <strong className="text-foreground">
                        {" "}
                        Nothing is auto-posted
                      </strong>{" "}
                      — every piece of content requires your approval before it
                      reaches any platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Posts tab ───────────────────────────────────────────────────── */}
        <TabsContent value="posts" className="mt-4">
          <Tabs
            value={calendarTab}
            onValueChange={setCalendarTab}
            data-ocid="social.posts.inner.tab"
          >
            <TabsList className="bg-muted/40 flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="calendar" data-ocid="social.calendar.tab">
                <Calendar size={13} className="mr-1.5" />
                Content Calendar
              </TabsTrigger>
              <TabsTrigger value="generator" data-ocid="social.generator.tab">
                <Sparkles size={13} className="mr-1.5" />
                AI Post Generator
              </TabsTrigger>
              <TabsTrigger value="ads" data-ocid="social.ads.tab">
                <Zap size={13} className="mr-1.5" />
                Ad Copy
              </TabsTrigger>
              <TabsTrigger value="reviews" data-ocid="social.reviews.tab">
                <MessageSquare size={13} className="mr-1.5" />
                Review Responses
              </TabsTrigger>
              <TabsTrigger value="analytics" data-ocid="social.analytics.tab">
                <BarChart2 size={13} className="mr-1.5" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="brand-voice"
                data-ocid="social.brand_voice.tab"
              >
                <Dna size={13} className="mr-1.5" />
                Brand Voice DNA
              </TabsTrigger>
              <TabsTrigger
                value="post-intelligence"
                data-ocid="social.post_intelligence.tab"
              >
                <Target size={13} className="mr-1.5" />
                Post Intelligence
              </TabsTrigger>
            </TabsList>

            {/* ── Content Calendar ─────────────────────────────────────── */}
            <TabsContent value="calendar">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      This Week — Funnel-Stage Calendar
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Morning = TOFU (Awareness) · Afternoon = MOFU (Trust) ·
                      Evening = BOFU (Conversion)
                    </p>
                  </div>
                  <Button
                    size="sm"
                    data-ocid="social.post.open_modal_button"
                    onClick={() => setCalendarTab("post-intelligence")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus size={14} className="mr-1" /> Add Post
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <WeeklyMixSummary
                    posts={calendarPosts}
                    onQuickAddBofu={handleQuickAddBofu}
                  />
                  <FunnelCalendar
                    posts={calendarPosts}
                    tenantNiche={tenantNiche}
                    onSlotClick={handleFunnelCalendarSlotClick}
                    onDeletePost={handleDeleteCalendarPost}
                    onEditPost={handleEditCalendarPost}
                  />
                </CardContent>
              </Card>

              <div
                className="mt-4 space-y-3"
                data-ocid="social.cta_performance.section"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    CTA Performance
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    Click-to-lead conversion per post
                  </span>
                </div>
                {posts
                  .filter(
                    (p) => p.status === "published" || p.status === "scheduled",
                  )
                  .map((post, idx) => {
                    const postComments = socialComments.filter(
                      (c) =>
                        c.tenantId === currentTenantId && c.postId === post.id,
                    );
                    const purchaseIntentComments = postComments.filter(
                      (c) => c.intent === "purchase_intent",
                    );
                    const leadsCreated = purchaseIntentComments.filter(
                      (c) => c.leadCreated || leadCreatedComments.has(c.id),
                    ).length;
                    const clicks = post.ctaClicks ?? 0;
                    const convRate =
                      clicks > 0
                        ? Math.round((leadsCreated / clicks) * 100)
                        : 0;
                    return (
                      <div
                        key={post.id}
                        data-ocid={`social.cta_performance.item.${idx + 1}`}
                        className="bg-card border border-border rounded-xl p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <PlatformIcon platform={post.platform} size={11} />
                          <span className="text-[11px] text-foreground font-medium line-clamp-1 flex-1">
                            {post.text.slice(0, 60)}…
                          </span>
                          <StatusBadge status={post.status ?? "draft"} />
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1">
                            <MessageCircle
                              size={10}
                              className="text-cyan-400"
                            />
                            <span className="text-[10px] font-semibold text-foreground">
                              {clicks}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              clicks
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UserPlus size={10} className="text-emerald-400" />
                            <span className="text-[10px] font-semibold text-foreground">
                              {leadsCreated}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              leads
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap size={10} className="text-amber-400" />
                            <span className="text-[10px] font-semibold text-foreground">
                              {purchaseIntentComments.length}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              intent
                            </span>
                          </div>
                          {clicks > 0 && (
                            <span
                              data-ocid={`social.cta_performance.rate.${idx + 1}`}
                              className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                convRate >= 10
                                  ? "bg-emerald-500/15 text-emerald-400"
                                  : convRate >= 5
                                    ? "bg-amber-500/15 text-amber-400"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {convRate}% CVR
                            </span>
                          )}
                        </div>
                        {purchaseIntentComments
                          .filter(
                            (c) =>
                              !c.leadCreated && !leadCreatedComments.has(c.id),
                          )
                          .map((c) => (
                            <div
                              key={c.id}
                              className="flex items-center gap-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-2.5 py-1.5"
                            >
                              <span className="text-[10px] text-amber-300 font-medium flex-1 min-w-0 truncate">
                                {c.authorName}: "{c.commentText.slice(0, 45)}…"
                              </span>
                              <button
                                type="button"
                                data-ocid="social.cta_performance.add_to_crm.button"
                                onClick={() =>
                                  handleCreateLeadFromComment(
                                    c.id,
                                    c.authorName,
                                  )
                                }
                                className="shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                              >
                                <UserPlus size={9} />
                                Add to CRM
                              </button>
                            </div>
                          ))}
                      </div>
                    );
                  })}
                {posts.filter(
                  (p) => p.status === "published" || p.status === "scheduled",
                ).length === 0 && (
                  <div
                    className="text-center py-6 text-xs text-muted-foreground"
                    data-ocid="social.cta_performance.empty_state"
                  >
                    No published or scheduled posts yet.
                  </div>
                )}
              </div>

              <div className="mt-4">
                <ProofContentGenerator
                  onAddToCalendar={handleProofAddToCalendar}
                />
              </div>
            </TabsContent>

            {/* ── AI Post Generator ──────────────────────────────────────── */}
            <TabsContent value="generator">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-foreground">
                    AI Post Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Niche
                      </Label>
                      <Select value={postNiche} onValueChange={setPostNiche}>
                        <SelectTrigger
                          className="text-xs"
                          data-ocid="social.niche.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {NICHES.map((n) => (
                            <SelectItem key={n} value={n}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Post Type
                      </Label>
                      <Select value={postType} onValueChange={setPostType}>
                        <SelectTrigger
                          className="text-xs"
                          data-ocid="social.posttype.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POST_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Describe your service, promotion, or update
                    </Label>
                    <Textarea
                      data-ocid="social.post.textarea"
                      value={postDesc}
                      onChange={(e) => setPostDesc(e.target.value)}
                      placeholder="e.g. We're offering 15% off HVAC tune-ups this summer, limited spots..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">
                        Platforms
                      </Label>
                      <div className="flex flex-wrap gap-4">
                        {[
                          {
                            id: "fb",
                            label: "Facebook",
                            checked: platformsFb,
                            set: setPlatformsFb,
                            limit: PLATFORM_CHAR_LIMITS.Facebook,
                          },
                          {
                            id: "ig",
                            label: "Instagram",
                            checked: platformsIg,
                            set: setPlatformsIg,
                            limit: PLATFORM_CHAR_LIMITS.Instagram,
                          },
                          {
                            id: "google",
                            label: "Google",
                            checked: platformsGoogle,
                            set: setPlatformsGoogle,
                            limit: PLATFORM_CHAR_LIMITS.Google,
                          },
                        ].map(({ id, label, checked, set, limit }) => (
                          <div key={id} className="flex items-center gap-2">
                            <Checkbox
                              id={`platform-${id}`}
                              checked={checked}
                              onCheckedChange={(v) => set(Boolean(v))}
                              data-ocid={`social.platform.${id}.checkbox`}
                            />
                            <div>
                              <Label
                                htmlFor={`platform-${id}`}
                                className="text-sm cursor-pointer"
                              >
                                {label}
                              </Label>
                              <p className="text-[10px] text-muted-foreground">
                                {limit.toLocaleString()} chars
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Tone
                      </Label>
                      <Select value={postTone} onValueChange={setPostTone}>
                        <SelectTrigger
                          className="w-36 h-8 text-xs"
                          data-ocid="social.tone.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="Friendly">Friendly</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {trialExpired ? (
                    <div
                      className="flex items-center gap-3"
                      data-ocid="social.generate.locked_state"
                    >
                      <button
                        type="button"
                        disabled
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
                        style={{
                          backgroundColor: "oklch(0.2 0.01 280)",
                          color: "oklch(0.5 0.01 280)",
                          border: "1px solid oklch(0.25 0.01 280)",
                        }}
                        data-ocid="social.generate.button"
                      >
                        <Lock size={14} />
                        Generate Post
                      </button>
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
                        style={{
                          backgroundColor: "oklch(0.62 0.2 25 / 15%)",
                          color: "oklch(0.82 0.14 25)",
                          border: "1px solid oklch(0.62 0.2 25 / 30%)",
                        }}
                      >
                        🔒 Upgrade Required
                      </span>
                    </div>
                  ) : (
                    <Button
                      data-ocid="social.generate.button"
                      onClick={handleGeneratePost}
                      disabled={generatingPost}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {generatingPost ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} className="mr-2" /> Generate Post
                        </>
                      )}
                    </Button>
                  )}

                  {generatedPost && (
                    <div
                      className="space-y-3 pt-2 border-t border-border"
                      data-ocid="social.generated_post.panel"
                    >
                      <Label className="text-xs text-muted-foreground">
                        Generated Post
                      </Label>
                      <div className="relative bg-muted/30 rounded-lg p-3 border border-border">
                        <p className="text-sm text-foreground leading-relaxed pr-8">
                          {generatedPost}
                        </p>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedPost, "Post")}
                          className="absolute top-2 right-2 p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                          data-ocid="social.generated_post.copy_button"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyToCalendar}
                        data-ocid="social.generated_post.add_to_calendar_button"
                        className="border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <CalendarCheck size={13} className="mr-1.5" />
                        Add to Calendar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Ad Copy ──────────────────────────────────────────────── */}
            <TabsContent value="ads">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-foreground">
                    Facebook Ad Copy Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Campaign Objective
                      </Label>
                      <Select
                        value={adObjective}
                        onValueChange={setAdObjective}
                      >
                        <SelectTrigger
                          className="text-xs"
                          data-ocid="social.ad_objective.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(AD_COPY_RESULTS).map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Additional context (optional)
                    </Label>
                    <Textarea
                      data-ocid="social.ad.textarea"
                      value={adDesc}
                      onChange={(e) => setAdDesc(e.target.value)}
                      placeholder="e.g. Targeting homeowners in Phoenix who recently searched for AC repair..."
                      className="min-h-[60px]"
                    />
                  </div>
                  <Button
                    data-ocid="social.generate_ad.button"
                    onClick={handleGenerateAd}
                    disabled={generatingAd}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {generatingAd ? (
                      <>
                        <Loader2 size={14} className="mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap size={14} className="mr-2" />
                        Generate Ad Copy
                      </>
                    )}
                  </Button>

                  {generatedAd && (
                    <div
                      className="space-y-3 pt-2 border-t border-border"
                      data-ocid="social.generated_ad.panel"
                    >
                      {[
                        { label: "Headline", value: generatedAd.headline },
                        { label: "Primary Text", value: generatedAd.primary },
                        { label: "CTA Button", value: generatedAd.cta },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="relative bg-muted/30 rounded-lg p-3 border border-border"
                        >
                          <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
                            {label}
                          </p>
                          <p className="text-sm text-foreground leading-relaxed pr-8">
                            {value}
                          </p>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(value, label)}
                            className="absolute top-2 right-2 p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Review Responses ────────────────────────────────────────── */}
            <TabsContent value="reviews">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-amber-400" />
                  <h2 className="text-base font-semibold text-foreground">
                    Review Response Drafts
                  </h2>
                </div>
                {MOCK_REVIEWS.map((review, idx) => (
                  <Card
                    key={review.id}
                    className="bg-card border-border"
                    data-ocid={`social.review_card.${idx + 1}`}
                  >
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex shrink-0">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={`star-${review.id}-${i}`}
                              size={12}
                              className={
                                i < review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted-foreground"
                              }
                            />
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-relaxed">
                            "{review.text}"
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            — {review.author} · {review.platform}
                          </p>
                        </div>
                      </div>
                      {replies[review.id] ? (
                        <div className="relative bg-muted/30 rounded-lg p-3 border border-border">
                          <p className="text-xs text-foreground leading-relaxed pr-8">
                            {replies[review.id]}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(replies[review.id], "Response")
                            }
                            className="absolute top-2 right-2 p-1.5 rounded text-muted-foreground hover:text-foreground"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDraftReply(review.id, review.rating)
                          }
                          disabled={generatingReply === review.id}
                          data-ocid={`social.draft_reply.${idx + 1}.button`}
                          className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                        >
                          {generatingReply === review.id ? (
                            <>
                              <Loader2
                                size={12}
                                className="mr-1.5 animate-spin"
                              />
                              Drafting...
                            </>
                          ) : (
                            <>
                              <Sparkles size={12} className="mr-1.5" />
                              Draft AI Reply
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ── Analytics ───────────────────────────────────────────────── */}
            <TabsContent value="analytics">
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Posts Published",
                      value: ANALYTICS_METRICS.totalPosts,
                      icon: Calendar,
                      color: "text-primary",
                    },
                    {
                      label: "Total Engagements",
                      value:
                        ANALYTICS_METRICS.totalEngagements.toLocaleString(),
                      icon: Zap,
                      color: "text-amber-400",
                    },
                    {
                      label: "Avg Engagement Rate",
                      value: ANALYTICS_METRICS.avgEngagementRate,
                      icon: TrendingUp,
                      color: "text-emerald-400",
                    },
                    {
                      label: "Best Platform",
                      value: ANALYTICS_METRICS.bestPlatform,
                      icon: Star,
                      color: "text-rose-400",
                    },
                  ].map(({ label, value, icon: Icon, color }, i) => (
                    <Card
                      key={label}
                      className="bg-card border-border"
                      data-ocid={`social.analytics.stat.${i + 1}`}
                    >
                      <CardContent className="pt-4 pb-4">
                        <Icon size={16} className={`${color} mb-2`} />
                        <p className="text-lg font-bold text-foreground">
                          {value}
                        </p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">
                      Platform Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {PLATFORM_BREAKDOWN.map((p, i) => (
                      <div
                        key={p.platform}
                        data-ocid={`social.analytics.platform.${i + 1}`}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-foreground font-medium">
                            {p.platform}
                          </span>
                          <span className="text-muted-foreground">
                            {p.posts} posts ·{" "}
                            {(p.likes + p.comments + p.shares).toLocaleString()}{" "}
                            engagements
                          </span>
                        </div>
                        <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.round(((p.likes + p.comments + p.shares) / 2500) * 100)}%`,
                              backgroundColor: p.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">
                      Best Times to Post — Engagement Heatmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div />
                      {SLOTS.map((s) => (
                        <div
                          key={s}
                          className="text-[10px] text-muted-foreground font-medium"
                        >
                          {s}
                        </div>
                      ))}
                      {DAYS.map((day, di) => (
                        <>
                          <div
                            key={day}
                            className="text-[10px] text-muted-foreground font-medium flex items-center justify-end pr-2"
                          >
                            {day}
                          </div>
                          {HEATMAP_DATA[di].map((val, si) => (
                            <HeatCell key={`${day}-${SLOTS[si]}`} value={val} />
                          ))}
                        </>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">
                      Top Performing Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {TOP_POSTS.map((post, i) => (
                      <div
                        key={post.id}
                        data-ocid={`social.analytics.top_post.${i + 1}`}
                        className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0"
                      >
                        <PlatformIcon platform={post.platform} size={14} />
                        <p className="text-xs text-foreground flex-1 truncate">
                          {post.excerpt}
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {post.date}
                        </span>
                        <span className="text-xs font-bold text-primary shrink-0">
                          {post.rate}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── Brand Voice DNA ──────────────────────────────────────────── */}
            <TabsContent value="brand-voice">
              <BrandVoiceDNAPanel />
            </TabsContent>

            {/* ── Post Intelligence ─────────────────────────────────────── */}
            <TabsContent value="post-intelligence">
              <NichePostIntelligencePanel />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ── Comment Agent tab ──────────────────────────────────────────── */}
        <TabsContent value="comment-agent" className="mt-4">
          <CommentAgentPanel
            tenantId={currentTenantId}
            allComments={socialComments}
            onRespond={respondToSocialComment}
          />
        </TabsContent>

        {/* ── Listening tab ─────────────────────────────────────────────── */}
        <TabsContent value="listening" className="mt-4">
          <SocialListeningPanel
            tenantId={currentTenantId}
            allAlerts={socialListeningAlerts}
            onDismiss={dismissSocialAlert}
          />
        </TabsContent>
      </Tabs>

      {/* Platform Connect Modal */}
      <PlatformConnectModal
        platform={connectingPlatform}
        onClose={() => setConnectingPlatform(null)}
        onSave={handleSaveConnection}
      />
    </div>
  );
}
