import {
  CheckCircle2,
  Copy,
  MessageSquare,
  RotateCcw,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { REVIEWS } from "../data/demoData";

const PLATFORMS = ["All", "Google", "Yelp", "Facebook"] as const;
type Platform = (typeof PLATFORMS)[number];

const PLATFORM_BADGE: Record<string, string> = {
  Google: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Yelp: "bg-red-500/20 text-red-300 border-red-500/30",
  Facebook: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

function generateResponse({
  author,
  rating,
  platform,
  niche,
  businessName,
  variant,
}: {
  author: string;
  rating: number;
  platform: string;
  niche: string;
  businessName: string;
  variant: number;
}): string {
  const firstName = author.split(" ")[0]?.replace(/\.$/, "") ?? "there";
  const isPlumbing =
    niche.toLowerCase().includes("plumb") ||
    businessName.toLowerCase().includes("plumb");
  const isMedSpa =
    niche.toLowerCase().includes("spa") || niche.toLowerCase().includes("med");

  if (rating >= 5) {
    const t = [
      `Thank you so much, ${firstName}! We're thrilled to hear about your positive experience with ${businessName}. Reviews like yours mean the world to our team${isPlumbing ? " — we know how stressful plumbing emergencies can be, and we're glad we could help" : isMedSpa ? " — your confidence in us is what drives us every day" : ""}. We hope to serve you again soon!`,
      `${firstName}, you just made our day! ★★★★★ Thank you for taking the time to share this on ${platform}. At ${businessName}, we work hard to deliver exactly this kind of experience. We look forward to seeing you again!`,
      `We can't thank you enough for this wonderful review, ${firstName}! Your feedback truly motivates our entire team at ${businessName} to keep delivering our best work. Please don't hesitate to call us any time — we're always here for you.`,
    ];
    return t[variant % t.length];
  }
  if (rating >= 3) {
    const t = [
      `Thank you for taking the time to review us, ${firstName}. We're glad your overall experience was positive, and we truly appreciate your honest feedback. At ${businessName}, we're always working to improve — if there's anything specific we could have done better, we'd love to hear from you directly.`,
      `${firstName}, thank you for your feedback — we take every review seriously. We'd love a chance to make it right and earn that 5th star. Please reach out to ${businessName} directly and we'll take great care of you.`,
      `We really appreciate your honest review, ${firstName}. Your feedback helps us improve every day. We'd welcome the opportunity to exceed your expectations next time — please feel free to contact our team at ${businessName}.`,
    ];
    return t[variant % t.length];
  }
  const t = [
    `${firstName}, thank you for sharing your experience with us. We're genuinely sorry it didn't meet your expectations — this is not the standard we hold ourselves to at ${businessName}. We'd like to personally make this right. Please contact us directly and we'll prioritize resolving this for you immediately.`,
    `We're truly sorry to hear about your experience, ${firstName}. At ${businessName}, every customer deserves exceptional service and we clearly fell short. Please reach out to us directly — we want to understand exactly what happened and make it right.`,
    `${firstName}, I sincerely apologize for your experience. Your feedback is important to us and we take it seriously at ${businessName}. Please contact our team directly so we can resolve this situation properly — this is not who we are.`,
  ];
  return t[variant % t.length];
}

interface DraftState {
  open: boolean;
  variant: number;
  editedText: string;
  responded: boolean;
}

export default function ReviewsPage() {
  const { currentTenantId, tenants } = useApp();
  const reviews = REVIEWS[currentTenantId] ?? [];
  const tenant = tenants.find((t) => t.id === currentTenantId);
  const [activePlatform, setActivePlatform] = useState<Platform>("All");
  const [draftStates, setDraftStates] = useState<Record<string, DraftState>>(
    {},
  );

  const filtered = reviews.filter(
    (r) => activePlatform === "All" || r.platform === activePlatform,
  );

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  const fiveStar = reviews.filter((r) => r.rating === 5).length;
  const pending = reviews.filter((r) => r.rating <= 3).length;

  const openDraft = (
    reviewId: string,
    author: string,
    rating: number,
    platform: string,
  ) => {
    const niche = tenant?.type ?? "";
    const businessName = tenant?.name ?? "Our Business";
    const text = generateResponse({
      author,
      rating,
      platform,
      niche,
      businessName,
      variant: 0,
    });
    setDraftStates((prev) => ({
      ...prev,
      [reviewId]: {
        open: true,
        variant: 0,
        editedText: text,
        responded: false,
      },
    }));
  };

  const closeDraft = (id: string) => {
    setDraftStates((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {
          open: false,
          variant: 0,
          editedText: "",
          responded: false,
        }),
        open: false,
      },
    }));
  };

  const cycleVariant = (
    reviewId: string,
    author: string,
    rating: number,
    platform: string,
  ) => {
    const current = draftStates[reviewId];
    const nextVariant = (current?.variant ?? 0) + 1;
    const niche = tenant?.type ?? "";
    const businessName = tenant?.name ?? "Our Business";
    const text = generateResponse({
      author,
      rating,
      platform,
      niche,
      businessName,
      variant: nextVariant,
    });
    setDraftStates((prev) => ({
      ...prev,
      [reviewId]: {
        ...(prev[reviewId] ?? {}),
        variant: nextVariant,
        editedText: text,
        open: true,
        responded: prev[reviewId]?.responded ?? false,
      },
    }));
  };

  const markResponded = (id: string) => {
    setDraftStates((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {
          open: false,
          variant: 0,
          editedText: "",
          responded: false,
        }),
        responded: true,
        open: false,
      },
    }));
    toast.success("Marked as responded");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Reviews & Reputation</h2>
        <p className="text-gray-400 text-sm">
          Monitor, respond, and manage your online reputation.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Reviews",
            value: reviews.length,
            color: "text-white",
          },
          {
            label: "Avg Rating",
            value: `${avgRating}★`,
            color: "text-amber-400",
          },
          {
            label: "5-Star Reviews",
            value: fiveStar,
            color: "text-emerald-400",
          },
          { label: "Need Response", value: pending, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="bg-card border-gray-800">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Velocity Trend */}
      <Card className="bg-card border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp size={15} className="text-emerald-400" /> Review
            Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1.5 h-16">
            {[
              { month: "Jan", val: 3 },
              { month: "Feb", val: 2 },
              { month: "Mar", val: 5 },
              { month: "Apr", val: 4 },
              { month: "May", val: 6 },
              { month: "Jun", val: 3 },
              { month: "Jul", val: 7 },
              { month: "Aug", val: 5 },
              { month: "Sep", val: 4 },
              { month: "Oct", val: 8 },
              { month: "Nov", val: 6 },
              { month: "Dec", val: 5 },
            ].map(({ month, val }) => (
              <div
                key={month}
                className="flex-1 bg-indigo-500/40 rounded-t hover:bg-indigo-500/60 transition-colors"
                style={{ height: `${(val / 8) * 100}%` }}
                title={`${val} reviews`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Now</span>
          </div>
        </CardContent>
      </Card>

      {/* Platform Filter */}
      <div className="flex gap-2 flex-wrap" data-ocid="reviews.platform.filter">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setActivePlatform(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activePlatform === p
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div
            className="py-16 text-center bg-card border border-gray-800 rounded-xl"
            data-ocid="reviews.empty_state"
          >
            <Star size={36} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No reviews on {activePlatform}</p>
          </div>
        ) : (
          filtered.map((review) => {
            const key = `${review.author}-${review.platform}`;
            const draft = draftStates[key];
            return (
              <Card
                key={key}
                data-ocid={`reviews.card.${key}`}
                className={`bg-card border transition-colors ${
                  draft?.responded ? "border-emerald-500/30" : "border-gray-800"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600/20 flex items-center justify-center text-sm font-bold text-indigo-300 flex-shrink-0">
                        {review.author[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">
                            {review.author}
                          </span>
                          <Badge
                            className={`text-[10px] border ${PLATFORM_BADGE[review.platform] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}
                          >
                            {review.platform}
                          </Badge>
                          {draft?.responded && (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] border">
                              Responded
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              className={
                                star <= review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-600"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {!draft?.responded && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          draft?.open
                            ? closeDraft(key)
                            : openDraft(
                                key,
                                review.author,
                                review.rating,
                                review.platform,
                              )
                        }
                        className="border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/20 hover:text-indigo-200"
                        data-ocid={`reviews.draft.${key}`}
                      >
                        <MessageSquare size={13} className="mr-1.5" />
                        {draft?.open ? "Close Draft" : "Draft Response"}
                      </Button>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed mt-3">
                    {review.comment}
                  </p>

                  {/* Draft Panel */}
                  {draft?.open && !draft.responded && (
                    <div className="mt-4 border-t border-gray-800 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          AI-Drafted Response
                        </p>
                        <button
                          type="button"
                          onClick={() => closeDraft(key)}
                          className="text-gray-500 hover:text-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <Textarea
                        value={draft.editedText}
                        onChange={(e) =>
                          setDraftStates((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], editedText: e.target.value },
                          }))
                        }
                        className="bg-gray-800 border-gray-700 text-gray-200 min-h-[100px] text-sm"
                        data-ocid={`reviews.draft_text.${key}`}
                      />
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            cycleVariant(
                              key,
                              review.author,
                              review.rating,
                              review.platform,
                            )
                          }
                          className="border-gray-700 text-gray-400 hover:text-white"
                          data-ocid={`reviews.cycle_variant.${key}`}
                        >
                          <RotateCcw size={12} className="mr-1.5" /> Try Another
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(draft.editedText);
                            toast.success("Response copied to clipboard");
                          }}
                          className="border-gray-700 text-gray-400 hover:text-white"
                          data-ocid={`reviews.copy.${key}`}
                        >
                          <Copy size={12} className="mr-1.5" /> Copy
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => markResponded(key)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white ml-auto"
                          data-ocid={`reviews.mark_responded.${key}`}
                        >
                          <CheckCircle2 size={12} className="mr-1.5" /> Mark as
                          Responded
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
