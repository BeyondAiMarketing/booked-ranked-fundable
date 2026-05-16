import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Dna,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import type { BrandVoiceProfile } from "../../types/socialMedia";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// ── Client-side calibration logic ─────────────────────────────────────────────

function detectTone(posts: string[]): BrandVoiceProfile["tone"] {
  const joined = posts.join(" ").toLowerCase();
  const urgentWords = [
    "urgent",
    "asap",
    "now",
    "immediately",
    "emergency",
    "hurry",
    "limited",
    "fast",
    "quick",
    "don't wait",
    "call now",
    "today only",
  ];
  const authWords = [
    "certified",
    "licensed",
    "board-certified",
    "professional",
    "expert",
    "industry",
    "clinical",
    "proven",
    "guaranteed",
    "results",
  ];
  const friendlyWords = [
    "hey",
    "hi",
    "love",
    "happy",
    "excited",
    "amazing",
    "awesome",
    "neighbors",
    "family",
    "community",
    "we're here",
  ];
  const casualWords = [
    "gonna",
    "wanna",
    "stuff",
    "thing",
    "cool",
    "great",
    "awesome",
    "yeah",
    "nah",
    "super",
  ];

  const counts = {
    urgent: urgentWords.filter((w) => joined.includes(w)).length,
    authoritative: authWords.filter((w) => joined.includes(w)).length,
    friendly: friendlyWords.filter((w) => joined.includes(w)).length,
    casual: casualWords.filter((w) => joined.includes(w)).length,
  };

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (top[1] === 0) return "professional";
  return top[0] as BrandVoiceProfile["tone"];
}

function detectEmojiUsage(posts: string[]): BrandVoiceProfile["emojiUsage"] {
  const emojiRegex = /\p{Emoji}/gu;
  const totalEmojis = posts.reduce(
    (sum, p) => sum + (p.match(emojiRegex)?.length ?? 0),
    0,
  );
  const avgPerPost = totalEmojis / posts.length;
  if (avgPerPost >= 3) return "heavy";
  if (avgPerPost >= 1.5) return "moderate";
  if (avgPerPost >= 0.5) return "minimal";
  return "none";
}

function detectSentenceStyle(
  posts: string[],
): BrandVoiceProfile["sentenceStyle"] {
  const avgLength =
    posts.reduce((sum, p) => sum + p.split(/\s+/).length, 0) / posts.length;
  const hasNewlines = posts.some((p) => p.includes("\n"));
  if (avgLength < 18 && !hasNewlines) return "short_punchy";
  if (hasNewlines && avgLength > 30) return "narrative";
  const conversationalMarkers = ["we", "you", "your", "us", "our", "hey", "!"];
  const hasCasual = conversationalMarkers.some((m) =>
    posts.join(" ").toLowerCase().includes(m),
  );
  return hasCasual ? "conversational" : "formal";
}

function detectFormality(posts: string[]): BrandVoiceProfile["formality"] {
  const joined = posts.join(" ").toLowerCase();
  const informalCount = [
    "gonna",
    "wanna",
    "hey",
    "cool",
    "awesome",
    "totally",
    "just",
    "literally",
  ].filter((w) => joined.includes(w)).length;
  const formalCount = [
    "therefore",
    "furthermore",
    "regarding",
    "our team provides",
    "we specialize",
    "our services include",
    "certified",
  ].filter((w) => joined.includes(w)).length;
  if (formalCount >= 3) return "high";
  if (informalCount >= 3) return "low";
  return "medium";
}

function extractVocabulary(posts: string[]): string[] {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "it",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "this",
    "that",
    "we",
    "you",
    "they",
    "i",
    "our",
    "your",
    "their",
    "us",
    "from",
    "not",
    "no",
    "so",
    "if",
    "as",
    "by",
    "he",
    "she",
    "all",
    "up",
    "about",
    "what",
    "when",
    "where",
    "who",
    "how",
    "just",
    "more",
    "get",
    "out",
    "any",
    "my",
    "its",
    "than",
    "then",
    "them",
    "also",
  ]);
  const freq: Record<string, number> = {};
  for (const w of posts
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)) {
    if (w.length > 4 && !stopWords.has(w)) freq[w] = (freq[w] ?? 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

function extractNicheTerminology(posts: string[]): string[] {
  // Niche-specific technical term patterns
  const nicheTerms =
    /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?|[A-Z]{2,}|hydro-jetting|sump pump|slab leak|botox|filler|prp|hvac|ac tune|microneedling|duct cleaning|heat pump|water heater|pipe burst|drain cleaning|carpet cleaning|odor removal|hot water|[a-z]+-[a-z]+ing)\b/g;
  const allText = posts.join(" ");
  const matches = [...new Set(allText.match(nicheTerms) ?? [])];
  return matches.filter((t) => t.length > 4).slice(0, 6);
}

function buildSamplePost(
  profile: Omit<BrandVoiceProfile, "lastCalibrated">,
): string {
  const hasEmoji =
    profile.emojiUsage === "heavy" || profile.emojiUsage === "moderate";
  const emojiMap: Record<string, string> = {
    urgent: "⚠️",
    professional: "✓",
    authoritative: "★",
    friendly: "👋",
    casual: "🙌",
  };
  const emoji = hasEmoji ? (emojiMap[profile.tone] ?? "✓") : "";

  const topTerms = profile.vocabulary.slice(0, 3).join(", ");
  const niche = profile.nicheTerminology.slice(0, 1)[0] ?? "your service needs";

  if (profile.tone === "urgent") {
    return `${emoji} Don't wait — ${niche} issues get worse fast.\n\nWe've helped hundreds of clients with ${topTerms}. Same-day availability this week.\n\nCall us now before slots fill up.`;
  }
  if (profile.tone === "authoritative") {
    return `${emoji} When it comes to ${niche}, there's no substitute for expertise.\n\nOur team brings ${topTerms} to every job — so you get results that last.\n\nBook a consultation today.`;
  }
  if (profile.tone === "friendly") {
    return `${emoji} Hey neighbors! Did you know ${niche} can be easier to fix than you think?\n\nWe're your local team — known for ${topTerms}. Let's take care of it together.\n\nDM us anytime!`;
  }
  return `We specialize in ${niche} — and we bring ${topTerms} to every project.\n\nOur clients trust us because we show up, do the work right, and stand behind it.\n\nReady to get started? Book online today.`;
}

// ── Stat display helper ───────────────────────────────────────────────────────

const TONE_LABELS: Record<
  BrandVoiceProfile["tone"],
  { label: string; cls: string }
> = {
  professional: {
    label: "Professional",
    cls: "bg-primary/15 text-primary border-primary/30",
  },
  casual: {
    label: "Casual",
    cls: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  authoritative: {
    label: "Authoritative",
    cls: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  },
  friendly: {
    label: "Friendly",
    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  urgent: {
    label: "Urgent",
    cls: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  },
};

const EMOJI_LABELS: Record<BrandVoiceProfile["emojiUsage"], string> = {
  heavy: "Heavy (3+ per post)",
  moderate: "Moderate (1–2 per post)",
  minimal: "Minimal (<1 per post)",
  none: "None",
};

const STYLE_LABELS: Record<BrandVoiceProfile["sentenceStyle"], string> = {
  short_punchy: "Short & Punchy",
  narrative: "Narrative / Storytelling",
  conversational: "Conversational",
  formal: "Formal",
};

const FORMALITY_LABELS: Record<BrandVoiceProfile["formality"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function BrandVoiceDNAPanel() {
  const { currentTenantId, getBrandVoiceProfile, upsertBrandVoiceProfile } =
    useApp();
  const existingProfile = getBrandVoiceProfile(currentTenantId);

  const [inputText, setInputText] = useState("");
  const [calibrating, setCalibrating] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<Omit<
    BrandVoiceProfile,
    "lastCalibrated"
  > | null>(null);
  const [samplePost, setSamplePost] = useState("");
  const [step, setStep] = useState<"input" | "result">(
    existingProfile ? "result" : "input",
  );

  const handleCalibrate = () => {
    const rawLines = inputText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 10);
    if (rawLines.length < 3) {
      toast.error("Please paste at least 3 posts or reviews (one per line)");
      return;
    }
    if (rawLines.length > 10) {
      toast.error("Maximum 10 posts. Please trim your list.");
      return;
    }

    setCalibrating(true);
    // Simulate brief analysis delay for UX
    setTimeout(() => {
      const tone = detectTone(rawLines);
      const emojiUsage = detectEmojiUsage(rawLines);
      const sentenceStyle = detectSentenceStyle(rawLines);
      const formality = detectFormality(rawLines);
      const vocabulary = extractVocabulary(rawLines);
      const nicheTerminology = extractNicheTerminology(rawLines);

      const profile: Omit<BrandVoiceProfile, "lastCalibrated"> = {
        tenantId: currentTenantId,
        tone,
        emojiUsage,
        sentenceStyle,
        formality,
        vocabulary,
        nicheTerminology,
        calibrationPosts: rawLines,
      };

      const sample = buildSamplePost(profile);
      setPreviewProfile(profile);
      setSamplePost(sample);
      setCalibrating(false);
      setStep("result");
    }, 1800);
  };

  const handleSaveProfile = () => {
    if (!previewProfile) return;
    upsertBrandVoiceProfile(previewProfile);
    toast.success(
      "Brand Voice DNA saved — all generated posts will now use your voice",
    );
  };

  const handleRecalibrate = () => {
    setStep("input");
    setInputText("");
    setPreviewProfile(null);
    setSamplePost("");
  };

  const displayProfile =
    previewProfile ??
    (existingProfile
      ? {
          ...existingProfile,
        }
      : null);

  const displaySamplePost =
    samplePost || (existingProfile ? buildSamplePost(existingProfile) : "");

  const hasUnsavedChanges =
    !!previewProfile &&
    (!existingProfile ||
      existingProfile.tone !== previewProfile.tone ||
      existingProfile.emojiUsage !== previewProfile.emojiUsage);

  return (
    <div className="space-y-5" data-ocid="voice.panel">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Dna size={14} className="text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Brand Voice DNA Engine
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste your past posts or reviews and we'll detect your tone, style,
            emoji habits, and vocabulary — so every AI-generated post sounds
            like <em>you</em>.
          </p>
        </div>
        {existingProfile && (
          <div
            className="shrink-0 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1.5"
            data-ocid="voice.active.badge"
          >
            <CheckCircle2 size={12} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">
              Voice Active
            </span>
          </div>
        )}
      </div>

      {step === "input" && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                1
              </span>
              Paste Your Posts or Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                3–10 samples (one per line) — past social posts, captions,
                emails, or customer reviews written by you
              </Label>
              <Textarea
                data-ocid="voice.samples.textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  "Burst pipe at 2am? We pick up. Every time.\nNo hidden fees. No surprises. Just honest plumbing.\nFixed a 40-year-old galvanized pipe today — owner couldn't believe we found the source."
                }
                className="min-h-[160px] font-mono text-xs leading-relaxed"
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[10px] text-muted-foreground">
                  {
                    inputText.split("\n").filter((l) => l.trim().length > 10)
                      .length
                  }{" "}
                  / 10 samples detected
                </p>
                {inputText.split("\n").filter((l) => l.trim().length > 10)
                  .length < 3 &&
                  inputText.length > 0 && (
                    <p className="text-[10px] text-amber-400 flex items-center gap-1">
                      <AlertTriangle size={9} /> Need at least 3 samples
                    </p>
                  )}
              </div>
            </div>
            <Button
              data-ocid="voice.calibrate.button"
              onClick={handleCalibrate}
              disabled={calibrating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {calibrating ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Analyzing your voice...
                </>
              ) : (
                <>
                  <Dna size={14} className="mr-2" />
                  Calibrate Voice
                  <ChevronRight size={14} className="ml-1" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "result" && displayProfile && (
        <div className="space-y-4">
          {/* Profile Stats Card */}
          <Card
            className="bg-card border-border"
            data-ocid="voice.profile.card"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                    2
                  </span>
                  Your Voice Profile
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="voice.recalibrate.button"
                  onClick={handleRecalibrate}
                  className="text-xs h-7"
                >
                  <RefreshCw size={11} className="mr-1" />
                  Recalibrate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  {
                    label: "Tone",
                    value: TONE_LABELS[displayProfile.tone].label,
                    cls: TONE_LABELS[displayProfile.tone].cls,
                    ocid: "voice.stat.tone",
                  },
                  {
                    label: "Emoji Usage",
                    value: EMOJI_LABELS[displayProfile.emojiUsage],
                    cls: "bg-muted/60 text-foreground border-border",
                    ocid: "voice.stat.emoji",
                  },
                  {
                    label: "Sentence Style",
                    value: STYLE_LABELS[displayProfile.sentenceStyle],
                    cls: "bg-muted/60 text-foreground border-border",
                    ocid: "voice.stat.style",
                  },
                  {
                    label: "Formality",
                    value: FORMALITY_LABELS[displayProfile.formality],
                    cls: "bg-muted/60 text-foreground border-border",
                    ocid: "voice.stat.formality",
                  },
                ].map(({ label, value, cls, ocid }) => (
                  <div
                    key={label}
                    className={`rounded-lg border px-3 py-2.5 ${cls}`}
                    data-ocid={ocid}
                  >
                    <p className="text-[10px] font-medium text-muted-foreground mb-0.5">
                      {label}
                    </p>
                    <p className="text-xs font-semibold leading-tight">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Vocabulary chips */}
              {displayProfile.vocabulary.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Top Vocabulary
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {displayProfile.vocabulary.map((term) => (
                      <Badge
                        key={term}
                        variant="secondary"
                        className="text-[10px] bg-primary/10 text-primary border-primary/20"
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Niche terms */}
              {displayProfile.nicheTerminology.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Niche Terminology Detected
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {displayProfile.nicheTerminology.map((term) => (
                      <Badge
                        key={term}
                        variant="secondary"
                        className="text-[10px] bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Post Preview */}
          {displaySamplePost && (
            <Card
              className="bg-card border-border"
              data-ocid="voice.sample.card"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles size={13} className="text-primary" />
                  Sample Post in Your Voice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                  <p
                    className="text-sm text-foreground leading-relaxed whitespace-pre-line"
                    data-ocid="voice.sample.preview"
                  >
                    {displaySamplePost}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  This is how AI-generated posts will sound once your voice
                  profile is saved.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Save action */}
          {previewProfile && (
            <div className="flex items-center gap-3">
              <Button
                data-ocid="voice.save.button"
                onClick={handleSaveProfile}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <CheckCircle2 size={14} className="mr-2" />
                {existingProfile
                  ? "Update Voice Profile"
                  : "Save Voice Profile"}
              </Button>
              {hasUnsavedChanges && (
                <p className="text-xs text-amber-400 flex items-center gap-1">
                  <AlertTriangle size={11} />
                  Unsaved changes
                </p>
              )}
            </div>
          )}

          {existingProfile && !previewProfile && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Profile saved · Last calibrated{" "}
              {new Date(existingProfile.lastCalibrated).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                },
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
