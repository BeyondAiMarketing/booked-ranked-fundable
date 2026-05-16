import { CalendarCheck, Camera, Loader2, Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// ── Types ────────────────────────────────────────────────────────────────────

interface ProofContentGeneratorProps {
  onAddToCalendar: (caption: string, niche: string) => void;
}

const NICHES = [
  "Plumber",
  "HVAC",
  "Med Spa",
  "Restoration",
  "Carpet Cleaning",
  "Roofing",
];

const PLATFORM_BADGES = [
  { key: "facebook", label: "Facebook", color: "text-blue-400" },
  { key: "instagram", label: "Instagram", color: "text-amber-400" },
  { key: "google_business", label: "Google", color: "text-rose-400" },
];

// Halbert specificity caption templates per niche
function generateHalbertCaption(
  niche: string,
  job: string,
  location: string,
  result: string,
): string {
  const nicheMap: Record<string, { problem: string; cta: string }> = {
    Plumber: {
      problem:
        "Another homeowner called us with a plumbing problem they couldn't solve",
      cta: "Book your free assessment today — same-day availability.",
    },
    HVAC: {
      problem: "A local homeowner's system was running all day and not cooling",
      cta: "Schedule your inspection now — limited slots this week.",
    },
    "Med Spa": {
      problem:
        "A client came in unhappy with results they couldn't get elsewhere",
      cta: "Book your complimentary consultation — we'll show you what's possible.",
    },
    Restoration: {
      problem: "A property owner called us after water damage spread overnight",
      cta: "24/7 emergency response — call us before the damage gets worse.",
    },
    "Carpet Cleaning": {
      problem:
        "A homeowner couldn't get a stubborn stain out after 3 DIY attempts",
      cta: "Book your deep clean today — we guarantee results or we come back free.",
    },
    Roofing: {
      problem: "A homeowner noticed their ceiling showing signs of a slow leak",
      cta: "Get your free roof inspection — before small issues become expensive ones.",
    },
  };

  const conf = nicheMap[niche] ?? nicheMap.Plumber;

  return `${conf.problem} — here's what happened:

📍 Location: ${location}
🔧 Job: ${job}
✅ Result: ${result}

This is exactly the kind of problem we solve every day. Our team brought the right tools, the right expertise, and the job was done right the first time.

${conf.cta}

#${niche.replace(/\s+/g, "")} #${location.replace(/\s+/g, "")} #LocalBusiness #BeforeAndAfter`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProofContentGenerator({
  onAddToCalendar,
}: ProofContentGeneratorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [niche, setNiche] = useState("Plumber");
  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [caption, setCaption] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleGenerate() {
    if (!job.trim() || !location.trim() || !result.trim()) {
      toast.error("Fill in all fields before generating");
      return;
    }
    setGenerating(true);
    setCaption("");
    setTimeout(() => {
      setCaption(generateHalbertCaption(niche, job, location, result));
      setGenerating(false);
    }, 1400);
  }

  function handleAddToCalendar() {
    if (!caption) return;
    onAddToCalendar(caption, niche);
    toast.success("Proof post added to content calendar as draft");
    setCaption("");
    setJob("");
    setLocation("");
    setResult("");
    setPhotoPreview(null);
  }

  return (
    <Card className="bg-card border-border" data-ocid="social.proof.section">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Camera size={14} className="text-primary" />
          Before/After & Proof Content Generator
          <Badge variant="secondary" className="text-[10px] ml-auto">
            Halbert Specificity
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left: form */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Niche
              </Label>
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger
                  className="text-xs"
                  data-ocid="social.proof.niche.select"
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
                Job Completed
              </Label>
              <Input
                data-ocid="social.proof.job.input"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="e.g. Kitchen drain hydro-jetting"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Location (City)
              </Label>
              <Input
                data-ocid="social.proof.location.input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dallas, TX"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Result
              </Label>
              <Input
                data-ocid="social.proof.result.input"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="e.g. Drain fully cleared, running like new"
                className="text-xs"
              />
            </div>
          </div>

          {/* Right: photo upload */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Job Photo
            </Label>
            <button
              type="button"
              data-ocid="social.proof.upload_button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-[140px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 overflow-hidden"
            >
              {photoPreview ? (
                <>
                  <img
                    src={photoPreview}
                    alt="Job preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white font-medium">
                      Change photo
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Camera size={22} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Click to upload job photo
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    JPG, PNG — before or after
                  </span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {photoPreview && (
              <button
                type="button"
                data-ocid="social.proof.remove_photo.button"
                onClick={() => {
                  setPhotoPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={10} /> Remove photo
              </button>
            )}
          </div>
        </div>

        <Button
          data-ocid="social.proof.generate.button"
          onClick={handleGenerate}
          disabled={generating}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          {generating ? (
            <>
              <Loader2 size={13} className="mr-1.5 animate-spin" /> Generating
              Caption...
            </>
          ) : (
            <>
              <Sparkles size={13} className="mr-1.5" /> Generate Caption
            </>
          )}
        </Button>

        {caption && (
          <div
            className="bg-muted/30 border border-border rounded-xl p-4 space-y-3 animate-fade-in"
            data-ocid="social.proof.caption.preview"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Generated Caption
              </span>
              <div className="flex gap-1.5 ml-auto">
                {PLATFORM_BADGES.map((p) => (
                  <span
                    key={p.key}
                    className={`text-[10px] font-medium ${p.color}`}
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
            <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
              {caption}
            </pre>
            {photoPreview && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={photoPreview}
                  alt="Job completion before and after"
                  className="w-full max-h-32 object-cover"
                />
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              data-ocid="social.proof.add_to_calendar.button"
              onClick={handleAddToCalendar}
              className="text-xs h-7"
            >
              <CalendarCheck size={11} className="mr-1.5" />
              Add to Calendar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
