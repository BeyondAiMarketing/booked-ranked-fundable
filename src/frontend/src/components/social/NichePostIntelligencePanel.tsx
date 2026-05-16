import {
  BookOpen,
  CalendarCheck,
  Copy,
  Facebook,
  Instagram,
  Loader2,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import type {
  BrandVoiceProfile,
  FunnelStage,
  MarketingFramework,
  SocialPlatform,
} from "../../types/socialMedia";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// ── Marketing Framework definitions ──────────────────────────────────────────

interface FrameworkDef {
  id: MarketingFramework;
  name: string;
  master: string;
  description: string;
  structure: string[];
  bestFor: string;
}

const FRAMEWORKS: FrameworkDef[] = [
  {
    id: "ogilvy_storytelling",
    name: "Ogilvy Storytelling",
    master: "David Ogilvy",
    description:
      "Lead with a compelling story, then position your service as the resolution.",
    structure: [
      "Open with a real customer scenario",
      "Describe the problem in detail",
      "Reveal the outcome",
      "Soft CTA",
    ],
    bestFor: "MOFU trust-building, brand awareness",
  },
  {
    id: "hormozi_value_stack",
    name: "Hormozi Value Stack",
    master: "Alex Hormozi",
    description:
      "Stack multiple value elements to make the offer feel irresistible vs. the price.",
    structure: [
      "List everything included",
      "Add dollar values to each element",
      "Show the total vs. your price",
      "Scarcity or urgency CTA",
    ],
    bestFor: "BOFU offers, promotions",
  },
  {
    id: "kennedy_urgency",
    name: "Kennedy Urgency",
    master: "Dan Kennedy",
    description:
      "Create genuine urgency with deadlines, scarcity, and consequence framing.",
    structure: [
      "State the risk of inaction",
      "Show the cost of waiting",
      "Limited slots/time available",
      "Direct response CTA",
    ],
    bestFor: "BOFU conversions, seasonal offers",
  },
  {
    id: "halbert_specificity",
    name: "Halbert Specificity",
    master: "Gary Halbert",
    description:
      "Hyper-specific details (exact numbers, times, names) build instant credibility.",
    structure: [
      "Specific problem with exact detail",
      "Specific action taken",
      "Specific result with numbers",
      "CTA",
    ],
    bestFor: "Before/After, case studies, BOFU",
  },
  {
    id: "cialdini_social_proof",
    name: "Cialdini Social Proof",
    master: "Robert Cialdini",
    description:
      "Leverage the power of proof — testimonials, numbers, reviews, community.",
    structure: [
      "Social proof data point",
      "Why it matters",
      "What it means for the reader",
      "CTA",
    ],
    bestFor: "MOFU trust, review amplification",
  },
  {
    id: "dan_kennedy_direct",
    name: "Kennedy Direct Response",
    master: "Dan Kennedy",
    description:
      "Direct, no-fluff copy that leads with the benefit and demands action.",
    structure: [
      "Headline benefit statement",
      "3 supporting proof points",
      "Objection pre-handle",
      "Strong CTA",
    ],
    bestFor: "BOFU, paid ad copy, promotions",
  },
  {
    id: "gary_halbert_attention",
    name: "Halbert Attention Hook",
    master: "Gary Halbert",
    description:
      "Grab attention with a pattern interrupt, then earn it with substance.",
    structure: [
      "Provocative or unexpected opener",
      "Explain why it matters to them",
      "Your relevant expertise",
      "CTA",
    ],
    bestFor: "TOFU awareness, educational content",
  },
  {
    id: "claude_hopkins_reason_why",
    name: "Hopkins Reason Why",
    master: "Claude Hopkins",
    description:
      "Give a clear, logical reason why the offer exists and why they should act.",
    structure: [
      "The claim",
      "The reason behind the claim",
      "Proof or explanation",
      "Action invitation",
    ],
    bestFor: "TOFU education, skeptical audiences",
  },
  {
    id: "jay_abraham_strategy",
    name: "Abraham Strategy of Preeminence",
    master: "Jay Abraham",
    description:
      "Position your business as the only logical choice through strategic framing.",
    structure: [
      "Identify the reader's real problem",
      "Show how others miss it",
      "Present your unique approach",
      "Risk-reversal CTA",
    ],
    bestFor: "MOFU differentiation, competitive markets",
  },
  {
    id: "russell_brunson_hook_story",
    name: "Brunson Hook-Story-Offer",
    master: "Russell Brunson",
    description:
      "Hook attention → tell an authentic story → make an irresistible offer.",
    structure: [
      "The hook (curiosity or bold claim)",
      "The origin or transformation story",
      "The offer with a call to action",
    ],
    bestFor: "All stages, high engagement content",
  },
];

// ── Goal / Funnel Stage options ───────────────────────────────────────────────

const GOAL_OPTIONS = [
  { value: "awareness", label: "Awareness", color: "text-cyan-400" },
  { value: "trust", label: "Trust Building", color: "text-emerald-400" },
  { value: "conversion", label: "Conversion", color: "text-primary" },
  { value: "engagement", label: "Engagement", color: "text-amber-400" },
] as const;

type PostGoal = (typeof GOAL_OPTIONS)[number]["value"];

const FUNNEL_OPTIONS: {
  value: FunnelStage;
  label: string;
  description: string;
}[] = [
  {
    value: "tofu",
    label: "TOFU — Top of Funnel",
    description: "Strangers → Awareness",
  },
  {
    value: "mofu",
    label: "MOFU — Middle of Funnel",
    description: "Aware → Interested",
  },
  {
    value: "bofu",
    label: "BOFU — Bottom of Funnel",
    description: "Interested → Booking",
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

const PLATFORM_OPTIONS: {
  value: SocialPlatform;
  label: string;
  icon: typeof Facebook;
}[] = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "google_business", label: "Google Business", icon: MessageSquare },
];

// ── Post generation logic ─────────────────────────────────────────────────────

function applyVoiceToPost(
  post: string,
  profile: BrandVoiceProfile | undefined,
): string {
  if (!profile) return post;
  // Apply emoji adjustments based on voice profile
  if (profile.emojiUsage === "none") {
    return post
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
      .replace(/\s+\n/g, "\n")
      .trim();
  }
  return post;
}

function generatePost(
  framework: FrameworkDef,
  goal: PostGoal,
  funnelStage: FunnelStage,
  niche: string,
  profile: BrandVoiceProfile | undefined,
): string {
  const nicheLower = niche.toLowerCase();
  const tone = profile?.tone ?? "professional";
  const useEmoji = !profile || profile.emojiUsage !== "none";

  // Niche-specific terms
  const nicheServices: Record<
    string,
    { service: string; problem: string; result: string; stat: string }
  > = {
    plumber: {
      service: "plumbing",
      problem: "burst pipe or failing water heater",
      result: "no more leaks, restored water pressure, no flooding damage",
      stat: "72% of plumbing emergencies happen with zero warning",
    },
    hvac: {
      service: "HVAC",
      problem: "AC failure on the hottest day of the year",
      result: "comfortable home, lower energy bills, no expensive breakdowns",
      stat: "a $149 tune-up prevents an average $1,800 compressor replacement",
    },
    "med spa": {
      service: "aesthetic treatments",
      problem: "unwanted signs of aging or skin concerns",
      result: "visible, lasting results that look natural",
      stat: "92% of our clients report visible improvement in 3 weeks",
    },
    restoration: {
      service: "restoration",
      problem: "water, fire, or mold damage",
      result: "property fully restored to pre-loss condition",
      stat: "damage spreads 40% further for every 24 hours without intervention",
    },
    "carpet cleaning": {
      service: "carpet cleaning",
      problem: "stains, pet odors, and deep-set allergens",
      result: "carpets restored to like-new condition, allergen-free",
      stat: "1 deep clean extends carpet lifespan by 2–3 years",
    },
    roofing: {
      service: "roofing",
      problem: "leaks, storm damage, or worn shingles",
      result: "watertight, fully inspected, and warranted roof",
      stat: "small leaks cause an average $12,000 in interior damage if ignored",
    },
  };

  const nd = nicheServices[nicheLower] ?? nicheServices.plumber;
  const emoji = useEmoji;

  const frameworkTemplates: Record<MarketingFramework, string> = {
    ogilvy_storytelling: `A client called us ${funnelStage === "bofu" ? "yesterday" : "last week"} — ${nd.problem}.\n\nMost people would have panicked. We showed up in under an hour.\n\n90 minutes later, the problem was solved. ${nd.result}.\n\nThat's what ${nd.service} done right looks like.\n\n${emoji ? "📞 " : ""}Book your appointment today — same-day availability still open.`,
    hormozi_value_stack: `Here's everything you get when you book with us ${emoji ? "👇" : ""}:\n\n${emoji ? "✓ " : "• "}Full ${nd.service} assessment ($120 value)\n${emoji ? "✓ " : "• "}Same-day service availability ($200 value)\n${emoji ? "✓ " : "• "}Written upfront estimate — no surprises ($0 extra)\n${emoji ? "✓ " : "• "}2-year parts and labor warranty ($400 value)\n\nYou pay for the service. Everything else is included.\n\n${emoji ? "⬇️ " : ""}Book online in 60 seconds — slots filling fast.`,
    kennedy_urgency: `${emoji ? "⚠️ " : ""}${nd.stat}.\n\nIf you've been putting off your ${nd.service} service, this week is the window.\n\nDelaying costs more — not less. ${nd.result.split(",")[0]} starts with one call.\n\nWe have ${Math.floor(Math.random() * 4) + 3} slots left this week. They go fast.\n\n${emoji ? "📲 " : ""}Call or book online now — before you need it as an emergency.`,
    halbert_specificity: `${funnelStage === "tofu" ? "Did you know" : "Real job from this week"}:\n\n${nd.problem.charAt(0).toUpperCase() + nd.problem.slice(1)}. The homeowner had tried 2 DIY solutions. Neither worked.\n\nOur tech found the root cause in 22 minutes. Fixed in 90 minutes.\nTotal cost: $280. Potential damage avoided: $3,400+.\n\nSpecificity matters. This is the standard we hold every job to.\n\n${emoji ? "🔧 " : ""}DM us for a same-week appointment.`,
    cialdini_social_proof: `${Math.floor(Math.random() * 200) + 300}+ local homeowners have trusted us with their ${nd.service} this year alone.\n\n${emoji ? "⭐⭐⭐⭐⭐ " : "5-star — "}\"${tone === "friendly" ? "Honestly the best experience we've had — showed up on time, fixed it right, and even cleaned up after." : "Professional, efficient, and transparent pricing. Will absolutely call again."}\" — Verified Google Review\n\nYour neighbors made the right call. You can too.\n\n${emoji ? "📅 " : ""}Book your appointment below ${emoji ? "👇" : ""}.`,
    dan_kennedy_direct: `Stop overpaying for ${nd.service} that doesn't hold up.\n\n${emoji ? "✓ " : ""}We show up on time. Every time.\n${emoji ? "✓ " : ""}Upfront pricing — no surprise invoices.\n${emoji ? "✓ " : ""}Licensed, insured, warranted work.\n\nIf your last ${nd.service} provider was anything less — it's time to switch.\n\nCall us today. We'll beat their quote or match it.`,
    gary_halbert_attention: `This is what most ${nd.service} companies never tell you ${emoji ? "👇" : ""}:\n\n${nd.stat}.\n\nMost homeowners find out the hard way. The ones who call us first don't.\n\nWe give free assessments specifically so you know exactly where you stand — no commitment required.\n\n${emoji ? "📞 " : ""}Schedule yours this week. It takes 15 minutes and could save you thousands.`,
    claude_hopkins_reason_why: `Here's why we offer free ${nd.service} assessments (and why it makes business sense for us) ${emoji ? "👇" : ""}:\n\nWhen homeowners understand exactly what's wrong before they commit — they make better decisions. Better decisions lead to better outcomes. Better outcomes lead to referrals.\n\nSo we give you the full picture first. No pressure. No upsell.\n\nThat's the reason. That's our standard.\n\n${emoji ? "📅 " : ""}Book your free assessment this week.`,
    jay_abraham_strategy: `Other ${nd.service} companies solve the symptom. We find the cause.\n\nHere's what that means for you:\n\n→ We won't patch what needs replacing\n→ We won't replace what just needs adjusting\n→ We give you a written assessment with every option and its real cost\n\nThat's ${goal === "trust" ? "what real expertise looks like" : "how you stop paying for the same problem twice"}.\n\nThe right call is the one you make before it becomes an emergency.`,
    russell_brunson_hook_story: `"How is this possible?" — that's what our client asked after we finished ${emoji ? "👀" : ""}.\n\nThree months ago, they'd been quoted $4,200 by another company for the same job.\n\nWe did it for $890. Same quality. Backed by a 2-year warranty. Finished the same day.\n\nThe secret? We don't have the overhead, upsell quotas, or franchise fees most companies charge into your bill.\n\nJust ${nd.service} done right. ${emoji ? "🙌 " : ""}Book today — tell us what you need.`,
  };

  const rawPost =
    frameworkTemplates[framework.id] ?? frameworkTemplates.ogilvy_storytelling;
  return applyVoiceToPost(rawPost, profile);
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NichePostIntelligencePanel() {
  const { currentTenantId, getBrandVoiceProfile, createSocialPost } = useApp();
  const voiceProfile = getBrandVoiceProfile(currentTenantId);

  const [selectedFramework, setSelectedFramework] =
    useState<MarketingFramework>("ogilvy_storytelling");
  const [goal, setGoal] = useState<PostGoal>("awareness");
  const [funnelStage, setFunnelStage] = useState<FunnelStage>("tofu");
  const [niche, setNiche] = useState("Plumber");
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    "facebook",
    "instagram",
  ]);
  const [generating, setGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [usedFramework, setUsedFramework] = useState<FrameworkDef | null>(null);

  const framework =
    FRAMEWORKS.find((f) => f.id === selectedFramework) ?? FRAMEWORKS[0];

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.length > 1
          ? prev.filter((p) => p !== platform)
          : prev
        : [...prev, platform],
    );
  };

  const handleGenerate = () => {
    setGenerating(true);
    setGeneratedPost("");
    setTimeout(() => {
      const post = generatePost(
        framework,
        goal,
        funnelStage,
        niche,
        voiceProfile,
      );
      setGeneratedPost(post);
      setUsedFramework(framework);
      setGenerating(false);
    }, 1600);
  };

  const handleAddToCalendar = () => {
    if (!generatedPost) return;
    createSocialPost({
      tenantId: currentTenantId,
      content: generatedPost,
      platforms: selectedPlatforms,
      scheduledAt: Date.now() + 86400000 * 2,
      status: "draft",
      funnelStage,
      marketingFramework: selectedFramework,
      ctaType: "booking",
      ctaUrl: "",
      beforeAfterPhoto: null,
      niche: niche.toLowerCase(),
      tags: [goal, funnelStage, selectedFramework],
    });
    toast.success("Post added to your Social Posts as a draft");
  };

  const handleCopy = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost).then(() => {
      toast.success("Post copied to clipboard");
    });
  };

  return (
    <div className="space-y-5" data-ocid="post-intel.panel">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <Target size={14} className="text-primary" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-0.5">
            Niche Post Intelligence Engine
          </h3>
          <p className="text-xs text-muted-foreground">
            Every post is built on a proven marketing master framework — matched
            to your goal and funnel stage.
            {voiceProfile && (
              <span className="text-primary ml-1">
                Your Brand Voice DNA is active.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── Configuration ───────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-4">
          {/* Framework selector */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Marketing Framework
            </Label>
            <Select
              value={selectedFramework}
              onValueChange={(v) =>
                setSelectedFramework(v as MarketingFramework)
              }
            >
              <SelectTrigger
                className="text-xs"
                data-ocid="post-intel.framework.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[320px]">
                {FRAMEWORKS.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium">{f.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {f.master}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Framework info card */}
          <div className="bg-muted/30 border border-border rounded-xl p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {framework.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  by {framework.master}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-[9px] shrink-0 bg-primary/10 text-primary border-primary/20"
              >
                Best for: {framework.bestFor.split(",")[0]}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {framework.description}
            </p>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                Post structure:
              </p>
              <div className="space-y-0.5">
                {framework.structure.map((step, i) => (
                  <div key={step} className="flex items-start gap-1.5">
                    <span className="text-[9px] font-bold text-primary/60 mt-0.5 shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Goal */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Post Goal
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  data-ocid={`post-intel.goal.${g.value}`}
                  onClick={() => setGoal(g.value)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all ${
                    goal === g.value
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Funnel Stage */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Funnel Stage
            </Label>
            <Select
              value={funnelStage}
              onValueChange={(v) => setFunnelStage(v as FunnelStage)}
            >
              <SelectTrigger
                className="text-xs"
                data-ocid="post-intel.funnel.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FUNNEL_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium text-xs">{f.label}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {f.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Niche */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Niche
            </Label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger
                className="text-xs"
                data-ocid="post-intel.niche.select"
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

          {/* Platforms */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Publish To
            </Label>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  data-ocid={`post-intel.platform.${value}`}
                  onClick={() => togglePlatform(value)}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                    selectedPlatforms.includes(value)
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-border/80"
                  }`}
                >
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Generate button ──────────────────────────────────────────────── */}
      <Button
        data-ocid="post-intel.generate.button"
        onClick={handleGenerate}
        disabled={generating}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {generating ? (
          <>
            <Loader2 size={14} className="mr-2 animate-spin" />
            Applying {framework.master}'s framework...
          </>
        ) : (
          <>
            <Sparkles size={14} className="mr-2" />
            Generate Post
            {voiceProfile && (
              <span className="ml-1.5 text-primary-foreground/70 text-xs font-normal">
                · using your voice
              </span>
            )}
          </>
        )}
      </Button>

      {/* ── Generated post result ────────────────────────────────────────── */}
      {generatedPost && usedFramework && (
        <Card
          className="bg-muted/20 border-primary/20"
          data-ocid="post-intel.result.card"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BookOpen size={13} className="text-primary" />
                Generated Post
                <Badge
                  variant="secondary"
                  className="text-[9px] bg-primary/10 text-primary border-primary/20"
                >
                  {usedFramework.name}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-1.5">
                {selectedPlatforms.map((p) => {
                  const opt = PLATFORM_OPTIONS.find((o) => o.value === p);
                  if (!opt) return null;
                  const Icon = opt.icon;
                  return (
                    <Icon key={p} size={12} className="text-muted-foreground" />
                  );
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <p
                className="text-sm text-foreground leading-relaxed whitespace-pre-line"
                data-ocid="post-intel.result.text"
              >
                {generatedPost}
              </p>
            </div>

            {/* Framework attribution */}
            <div className="flex items-start gap-2 bg-muted/30 rounded-lg px-3 py-2 border border-border">
              <TrendingUp size={12} className="text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <span className="text-primary font-medium">
                  {usedFramework.master}'s framework
                </span>{" "}
                — {usedFramework.description}
              </p>
            </div>

            {/* Platform badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {selectedPlatforms.map((p) => {
                const opt = PLATFORM_OPTIONS.find((o) => o.value === p);
                if (!opt) return null;
                const Icon = opt.icon;
                return (
                  <Badge
                    key={p}
                    variant="secondary"
                    className="text-[10px] gap-1"
                  >
                    <Icon size={9} />
                    {opt.label}
                  </Badge>
                );
              })}

              <div className="ml-auto flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="post-intel.copy.button"
                  onClick={handleCopy}
                  className="text-xs h-7"
                >
                  <Copy size={11} className="mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  data-ocid="post-intel.add_to_calendar.button"
                  onClick={handleAddToCalendar}
                  className="text-xs h-7 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <CalendarCheck size={11} className="mr-1" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Framework quick reference ────────────────────────────────────── */}
      {!generatedPost && (
        <Card
          className="bg-card border-border"
          data-ocid="post-intel.framework_ref.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              All 10 Marketing Frameworks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {FRAMEWORKS.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  data-ocid={`post-intel.framework_ref.item.${i + 1}`}
                  onClick={() => setSelectedFramework(f.id)}
                  className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-left transition-all hover:border-primary/30 hover:bg-primary/5 ${
                    selectedFramework === f.id
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-muted/20"
                  }`}
                >
                  <span className="text-[10px] font-bold text-primary/50 mt-0.5 shrink-0 w-4">
                    {i + 1}.
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold ${selectedFramework === f.id ? "text-primary" : "text-foreground"}`}
                    >
                      {f.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {f.master} · {f.bestFor.split(",")[0]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
