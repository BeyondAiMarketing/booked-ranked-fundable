import { GenerationStatus } from "@/backend";
import {
  BookOpen,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  Film,
  Image,
  Loader2,
  Megaphone,
  Trash2,
  Wand2,
} from "lucide-react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ContentGenerationResult } from "../backend";
import { createActor } from "../backend";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { useActor } from "../hooks/useActor";

// ─── Streaming text hook ──────────────────────────────────────────────────────
function useStreamText(target: string, enabled: boolean) {
  const [displayed, setDisplayed] = useState("");
  const idxRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || !target) return;
    idxRef.current = 0;
    setDisplayed("");
    intervalRef.current = setInterval(() => {
      idxRef.current++;
      setDisplayed(target.slice(0, idxRef.current));
      if (idxRef.current >= target.length && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 30);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [target, enabled]);

  return displayed;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleString();
}

function HistoryItem({
  item,
  onDelete,
}: {
  item: ContentGenerationResult;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
      data-ocid="content_history.item"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-white/20 text-xs text-white/60"
          >
            {item.niche || "general"}
          </Badge>
          <span className="text-xs text-white/40">
            {formatTimestamp(item.generatedAt)}
          </span>
          {item.status === GenerationStatus.Complete ? (
            <CheckCircle className="h-3 w-3 text-emerald-400" />
          ) : item.status === GenerationStatus.Failed ? (
            <span className="text-xs text-rose-400">Error</span>
          ) : null}
        </div>
        <p className="truncate text-sm text-white/70">{item.prompt}</p>
        {item.output && item.output.length > 0 && (
          <p className="mt-1 line-clamp-2 text-xs text-white/50">
            {item.output[0]}
          </p>
        )}
        {item.mediaUrl && item.mediaUrl.length > 0 && (
          <a
            href={item.mediaUrl[0]}
            target="_blank"
            rel="noreferrer"
            className="mt-1 flex items-center gap-1 text-xs text-cyan-400 hover:underline"
          >
            <ExternalLink className="h-3 w-3" /> View Media
          </a>
        )}
      </div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-7 w-7 shrink-0 text-white/40 hover:text-rose-400"
        onClick={() => onDelete(item.id)}
        data-ocid="content_history.delete_button"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

// ─── Video Tab ────────────────────────────────────────────────────────────────
function VideoTab() {
  const { actor } = useActor();
  const [prompt, setPrompt] = useState("");
  const [niche, setNiche] = useState("roofing");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentGenerationResult | null>(null);
  const [history, setHistory] = useState<ContentGenerationResult[]>([]);

  useEffect(() => {
    if (!actor) return;
    actor
      .getGeneratedContent({ Video: null })
      .then((r) => setHistory(r as ContentGenerationResult[]))
      .catch(() => {});
  }, [actor]);

  const generate = async () => {
    if (!actor || !prompt.trim()) return;
    setLoading(true);
    try {
      const r = await actor.generateContent({
        accountId: "current",
        contentType: { Video: null },
        prompt: prompt.trim(),
        niche,
        additionalContext: [],
      });
      setResult(r as ContentGenerationResult);
      const updated = await actor.getGeneratedContent({ Video: null });
      setHistory(updated as ContentGenerationResult[]);
    } catch (_e) {
      toast.error(
        "Video generation failed. Check your OpenRouter key in Go Live.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    await actor.deleteGeneratedContent(id).catch(() => {});
    setHistory((h) => h.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-cyan-300">
          <Film className="h-5 w-5" /> AI Video Creator
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="mb-1.5 block text-white/70">
              Script / Prompt
            </Label>
            <Textarea
              placeholder="Describe the video you want: story, message, style..."
              className="min-h-[100px] border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-cyan-500/50"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              data-ocid="content_video.textarea"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-white/70">Niche</Label>
            <Input
              placeholder="e.g. roofing, HVAC, landscaping"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-cyan-500/50"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              data-ocid="content_video.niche_input"
            />
          </div>
          <Button
            type="button"
            disabled={loading || !prompt.trim()}
            onClick={generate}
            className="bg-cyan-600 text-white hover:bg-cyan-500"
            data-ocid="content_video.generate_button"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                video...
              </>
            ) : (
              <>
                <Film className="mr-2 h-4 w-4" /> Generate Video
              </>
            )}
          </Button>
        </div>
      </div>

      {loading && (
        <div
          className="flex items-center gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4"
          data-ocid="content_video.loading_state"
        >
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
          <span className="text-sm text-cyan-300">
            Generating video via OmniRouter…
          </span>
        </div>
      )}

      {result && !loading && (
        <div
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4"
          data-ocid="content_video.success_state"
        >
          <p className="mb-2 text-sm font-medium text-cyan-300">Result</p>
          {result.mediaUrl && result.mediaUrl.length > 0 ? (
            <a
              href={result.mediaUrl[0]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Open Video
            </a>
          ) : result.output && result.output.length > 0 ? (
            <p className="whitespace-pre-wrap text-sm text-white/80">
              {result.output[0]}
            </p>
          ) : (
            <p className="text-sm text-white/50">
              Processing — check back shortly.
            </p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-white/60">History</p>
          <div className="space-y-2" data-ocid="content_video.list">
            {history.map((item) => (
              <HistoryItem key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Images Tab ───────────────────────────────────────────────────────────────
function ImagesTab() {
  const { actor } = useActor();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentGenerationResult | null>(null);
  const [history, setHistory] = useState<ContentGenerationResult[]>([]);

  useEffect(() => {
    if (!actor) return;
    actor
      .getGeneratedContent({ Image: null })
      .then((r) => setHistory(r as ContentGenerationResult[]))
      .catch(() => {});
  }, [actor]);

  const generate = async () => {
    if (!actor || !prompt.trim()) return;
    setLoading(true);
    try {
      const r = await actor.generateContent({
        accountId: "current",
        contentType: { Image: null },
        prompt: prompt.trim(),
        niche: "general",
        additionalContext: [],
      });
      setResult(r as ContentGenerationResult);
      const updated = await actor.getGeneratedContent({ Image: null });
      setHistory(updated as ContentGenerationResult[]);
    } catch {
      toast.error(
        "Image generation failed. Check your OpenRouter key in Go Live.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    await actor.deleteGeneratedContent(id).catch(() => {});
    setHistory((h) => h.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-amber-300">
          <Image className="h-5 w-5" /> AI Image Generator
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="mb-1.5 block text-white/70">Prompt</Label>
            <Textarea
              placeholder="Describe the image: style, subject, mood, brand colors..."
              className="min-h-[90px] border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-amber-500/50"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              data-ocid="content_image.textarea"
            />
          </div>
          <Button
            type="button"
            disabled={loading || !prompt.trim()}
            onClick={generate}
            className="bg-amber-600 text-white hover:bg-amber-500"
            data-ocid="content_image.generate_button"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                image...
              </>
            ) : (
              <>
                <Image className="mr-2 h-4 w-4" /> Generate Image
              </>
            )}
          </Button>
        </div>
      </div>

      {loading && (
        <div
          className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4"
          data-ocid="content_image.loading_state"
        >
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400" />
          <span className="text-sm text-amber-300">
            Generating image via Flux 2 Pro / Gemini Image…
          </span>
        </div>
      )}

      {result && !loading && (
        <div
          className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
          data-ocid="content_image.success_state"
        >
          <p className="mb-2 text-sm font-medium text-amber-300">Result</p>
          {result.mediaUrl && result.mediaUrl.length > 0 ? (
            <img
              src={result.mediaUrl[0]}
              alt="Generated"
              className="max-h-64 w-full rounded-lg object-contain"
            />
          ) : result.output && result.output.length > 0 ? (
            <p className="text-sm text-white/80">{result.output[0]}</p>
          ) : (
            <p className="text-sm text-white/50">
              Processing — check back shortly.
            </p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-white/60">History</p>
          <div
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
            data-ocid="content_image.list"
          >
            {history.map((item) => (
              <HistoryItem key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Ad Copy Tab ──────────────────────────────────────────────────────────────
const AD_FRAMEWORKS = [
  { value: "Brunson", label: "Russell Brunson — Hook/Story/Offer" },
  { value: "Hormozi", label: "Alex Hormozi — Grand Slam Offer" },
  { value: "Kennedy", label: "Dan Kennedy — Direct Response" },
  { value: "Halbert", label: "Gary Halbert — Power Copy" },
] as const;

const AD_TYPES = [
  "Facebook Ad",
  "Google Search Ad",
  "Instagram Ad",
  "YouTube Pre-roll",
  "Email Subject Line",
  "SMS Blast",
  "Landing Page Headline",
] as const;

function AdCopyTab() {
  const { actor } = useActor();
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("Brunson");
  const [adType, setAdType] = useState("Facebook Ad");
  const [loading, setLoading] = useState(false);
  const [rawOutput, setRawOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [history, setHistory] = useState<ContentGenerationResult[]>([]);
  const streamText = useStreamText(rawOutput, streaming);

  useEffect(() => {
    if (!actor) return;
    actor
      .getGeneratedContent({ AdCopy: null })
      .then((r) => setHistory(r as ContentGenerationResult[]))
      .catch(() => {});
  }, [actor]);

  const generate = async () => {
    if (!actor || !prompt.trim()) return;
    setLoading(true);
    setRawOutput("");
    setStreaming(false);
    try {
      const r = await actor.generateContent({
        accountId: "current",
        contentType: { AdCopy: null },
        prompt: `[Framework: ${framework}] [Type: ${adType}] ${prompt.trim()}`,
        niche: "roofing",
        additionalContext: [],
      });
      const res = r as ContentGenerationResult;
      const text = res.output?.[0] ?? "";
      setRawOutput(text);
      setStreaming(true);
      const updated = await actor.getGeneratedContent({ AdCopy: null });
      setHistory(updated as ContentGenerationResult[]);
    } catch {
      toast.error(
        "Ad copy generation failed. Check your OpenRouter key in Go Live.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(rawOutput);
    toast.success("Copied to clipboard!");
  }, [rawOutput]);

  const handleDelete = async (id: string) => {
    if (!actor) return;
    await actor.deleteGeneratedContent(id).catch(() => {});
    setHistory((h) => h.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-purple-300">
          <Megaphone className="h-5 w-5" /> AI Ad Copy Engine
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="mb-1.5 block text-white/70">
              Product / Offer Description
            </Label>
            <Textarea
              placeholder="Describe your product, offer, or service..."
              className="min-h-[90px] border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-purple-500/50"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              data-ocid="content_adcopy.textarea"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-white/70">Framework</Label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger
                  className="border-white/10 bg-white/5 text-white"
                  data-ocid="content_adcopy.framework_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-900 text-white">
                  {AD_FRAMEWORKS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-white/70">Ad Type</Label>
              <Select value={adType} onValueChange={setAdType}>
                <SelectTrigger
                  className="border-white/10 bg-white/5 text-white"
                  data-ocid="content_adcopy.type_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-900 text-white">
                  {AD_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="button"
            disabled={loading || !prompt.trim()}
            onClick={generate}
            className="bg-purple-600 text-white hover:bg-purple-500"
            data-ocid="content_adcopy.generate_button"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Megaphone className="mr-2 h-4 w-4" /> Generate Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {loading && (
        <div
          className="flex items-center gap-3 rounded-lg border border-purple-500/20 bg-purple-500/5 p-4"
          data-ocid="content_adcopy.loading_state"
        >
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-purple-400" />
          <span className="text-sm text-purple-300">
            Writing copy with OmniRouter…
          </span>
        </div>
      )}

      {streamText && (
        <div
          className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4"
          data-ocid="content_adcopy.success_state"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-purple-300">
              Generated Copy
            </p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 text-xs text-white/60 hover:text-white"
              onClick={copyToClipboard}
              data-ocid="content_adcopy.copy_button"
            >
              <Copy className="h-3 w-3" /> Copy
            </Button>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/85">
            {streamText}
          </pre>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-white/60">History</p>
          <div className="space-y-2" data-ocid="content_adcopy.list">
            {history.map((item) => (
              <HistoryItem key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Blog Tab ─────────────────────────────────────────────────────────────────
const BLOG_TONES = [
  "Professional",
  "Conversational",
  "Authoritative",
  "Educational",
  "Persuasive",
  "Storytelling",
] as const;

function BlogTab() {
  const { actor } = useActor();
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [rawOutput, setRawOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [history, setHistory] = useState<ContentGenerationResult[]>([]);
  const streamText = useStreamText(rawOutput, streaming);

  useEffect(() => {
    if (!actor) return;
    actor
      .getGeneratedContent({ Blog: null })
      .then((r) => setHistory(r as ContentGenerationResult[]))
      .catch(() => {});
  }, [actor]);

  const generate = async () => {
    if (!actor || !topic.trim()) return;
    setLoading(true);
    setRawOutput("");
    setStreaming(false);
    try {
      const r = await actor.generateContent({
        accountId: "current",
        contentType: { Blog: null },
        prompt: `[Tone: ${tone}] Write a compelling blog post about: ${topic.trim()}`,
        niche: "roofing",
        additionalContext: [],
      });
      const res = r as ContentGenerationResult;
      const text = res.output?.[0] ?? "";
      setRawOutput(text);
      setStreaming(true);
      const updated = await actor.getGeneratedContent({ Blog: null });
      setHistory(updated as ContentGenerationResult[]);
    } catch {
      toast.error(
        "Blog generation failed. Check your OpenRouter key in Go Live.",
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadMarkdown = useCallback(() => {
    const blob = new Blob([rawOutput], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rawOutput]);

  const handleDelete = async (id: string) => {
    if (!actor) return;
    await actor.deleteGeneratedContent(id).catch(() => {});
    setHistory((h) => h.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-emerald-300">
          <BookOpen className="h-5 w-5" /> AI Blog & Long-Form Writer
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="mb-1.5 block text-white/70">Topic / Title</Label>
            <Input
              placeholder="e.g. How to know if your roof needs replacing in 2026"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-emerald-500/50"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              data-ocid="content_blog.topic_input"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-white/70">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger
                className="border-white/10 bg-white/5 text-white"
                data-ocid="content_blog.tone_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-slate-900 text-white">
                {BLOG_TONES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            disabled={loading || !topic.trim()}
            onClick={generate}
            className="bg-emerald-600 text-white hover:bg-emerald-500"
            data-ocid="content_blog.generate_button"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                blog post...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" /> Generate Blog Post
              </>
            )}
          </Button>
        </div>
      </div>

      {loading && (
        <div
          className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4"
          data-ocid="content_blog.loading_state"
        >
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-sm text-emerald-300">
            Writing with OmniRouter…
          </span>
        </div>
      )}

      {streamText && (
        <div
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4"
          data-ocid="content_blog.success_state"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-emerald-300">
              Generated Post
            </p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 text-xs text-white/60 hover:text-white"
              onClick={downloadMarkdown}
              disabled={!rawOutput}
              data-ocid="content_blog.download_button"
            >
              <Download className="h-3 w-3" /> Download .md
            </Button>
          </div>
          <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/85">
            {streamText}
          </pre>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-white/60">History</p>
          <div className="space-y-2" data-ocid="content_blog.list">
            {history.map((item) => (
              <HistoryItem key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContentCreationStudioPage() {
  const { actor } = useActor();
  const { isSuperAdmin } = useApp();
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!actor) return;
    const tier = isSuperAdmin ? "admin" : "pro";
    actor
      .isContentEnabledForTier(tier)
      .then((r) => setEnabled(r as boolean))
      .catch(() => setEnabled(true));
  }, [actor, isSuperAdmin]);

  if (enabled === null) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!enabled) return null;

  return (
    <div
      className="mx-auto max-w-4xl space-y-6 p-6"
      data-ocid="content_studio.page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
          <Wand2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            Content Creation Studio
          </h1>
          <p className="text-sm text-white/50">
            Powered by OmniRouter
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="video" className="w-full">
        <TabsList className="mb-5 grid w-full grid-cols-4 border border-white/10 bg-white/5">
          <TabsTrigger
            value="video"
            className="gap-1.5 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            data-ocid="content_studio.video_tab"
          >
            <Film className="h-4 w-4" />
            <span className="hidden sm:inline">Video</span>
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="gap-1.5 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            data-ocid="content_studio.images_tab"
          >
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Images</span>
          </TabsTrigger>
          <TabsTrigger
            value="adcopy"
            className="gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            data-ocid="content_studio.adcopy_tab"
          >
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">Ad Copy</span>
          </TabsTrigger>
          <TabsTrigger
            value="blog"
            className="gap-1.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            data-ocid="content_studio.blog_tab"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </TabsTrigger>
        </TabsList>

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <TabsContent value="video">
            <VideoTab />
          </TabsContent>
          <TabsContent value="images">
            <ImagesTab />
          </TabsContent>
          <TabsContent value="adcopy">
            <AdCopyTab />
          </TabsContent>
          <TabsContent value="blog">
            <BlogTab />
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
}
