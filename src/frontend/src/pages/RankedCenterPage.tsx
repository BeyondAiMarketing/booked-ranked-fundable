import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { getHomeServiceNicheConfig } from "@/data/homeServiceNicheConfig";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  MapPin,
  MessageSquare,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

const REVIEWS = [
  {
    id: "r1",
    author: "James T.",
    rating: 5,
    text: "Great service, very professional.",
    replied: false,
  },
  {
    id: "r2",
    author: "Angela M.",
    rating: 3,
    text: "Took longer than expected.",
    replied: true,
  },
];

export default function RankedCenterPage() {
  const navigate = useNavigate();
  const { demoInfo } = useApp();
  const [tab, setTab] = useState<"overview" | "posts" | "reviews" | "actions">(
    "overview",
  );

  const nicheKey = demoInfo?.niche ?? "roofing";
  const nicheConfig = getHomeServiceNicheConfig(nicheKey);
  const nicheName = nicheConfig?.name ?? "Business";

  // Generate niche-weighted estimated scores
  const scorecards = useMemo(() => {
    const weights = nicheConfig?.rankedScoringWeights ?? {
      gbpHealth: 0.25,
      reviewVelocity: 0.25,
      localCitations: 0.15,
      seoScore: 0.15,
      contentFreshness: 0.1,
      competitorGap: 0.1,
    };
    // Base scores — vary by niche to reflect different market dynamics
    const bases =
      nicheKey === "hvac"
        ? {
            gbpHealth: 70,
            reviewVelocity: 50,
            localCitations: 65,
            seoScore: 78,
            contentFreshness: 45,
            competitorGap: 55,
          }
        : nicheKey === "plumbing"
          ? {
              gbpHealth: 68,
              reviewVelocity: 55,
              localCitations: 62,
              seoScore: 75,
              contentFreshness: 50,
              competitorGap: 58,
            }
          : {
              gbpHealth: 72,
              reviewVelocity: 45,
              localCitations: 68,
              seoScore: 81,
              contentFreshness: 55,
              competitorGap: 60,
            };

    return [
      {
        label: "GBP Health",
        score: bases.gbpHealth,
        icon: Building2,
        color: "text-[#FFD700]",
        weight: weights.gbpHealth,
      },
      {
        label: "Review Velocity",
        score: bases.reviewVelocity,
        icon: Star,
        color: "text-rose-400",
        weight: weights.reviewVelocity,
      },
      {
        label: "Local Citations",
        score: bases.localCitations,
        icon: MapPin,
        color: "text-[#00BFFF]",
        weight: weights.localCitations,
      },
      {
        label: "SEO Score",
        score: bases.seoScore,
        icon: Search,
        color: "text-emerald-400",
        weight: weights.seoScore,
      },
      {
        label: "Content Freshness",
        score: bases.contentFreshness,
        icon: FileText,
        color: "text-[#00BFFF]",
        weight: weights.contentFreshness,
      },
      {
        label: "Competitor Gap",
        score: bases.competitorGap,
        icon: TrendingUp,
        color: "text-[#FFD700]",
        weight: weights.competitorGap,
      },
    ];
  }, [nicheKey, nicheConfig]);

  // Niche-aware GBP post samples
  const gbpPosts = useMemo(() => {
    if (nicheKey === "hvac")
      return [
        {
          id: "gp1",
          title: "Spring AC Tune-Up — Limited Spots Available",
          type: "offer",
          status: "draft",
        },
        {
          id: "gp2",
          title: "Emergency HVAC Response — We're Available 24/7",
          type: "update",
          status: "approved",
        },
        {
          id: "gp3",
          title: "Customer Story: Garcia Family Replacement",
          type: "story",
          status: "pending_approval",
        },
      ];
    if (nicheKey === "plumbing")
      return [
        {
          id: "gp1",
          title: "Winter Pipe Freeze Prevention — Free Inspection",
          type: "offer",
          status: "draft",
        },
        {
          id: "gp2",
          title: "Emergency Plumbing — We Answer 24/7",
          type: "update",
          status: "approved",
        },
        {
          id: "gp3",
          title: "Customer Story: Martinez Sewer Line Repair",
          type: "story",
          status: "pending_approval",
        },
      ];
    return [
      {
        id: "gp1",
        title: "Spring Roof Inspection Special",
        type: "offer",
        status: "draft",
      },
      {
        id: "gp2",
        title: "Customer Story: The Martinez Family",
        type: "story",
        status: "pending_approval",
      },
      {
        id: "gp3",
        title: "Hail Damage? We Can Help",
        type: "update",
        status: "approved",
      },
    ];
  }, [nicheKey]);

  const overallScore = Math.round(
    scorecards.reduce((a, s) => a + s.score * s.weight, 0) /
      scorecards.reduce((a, s) => a + s.weight, 0),
  );

  const topActions = nicheConfig?.topRecommendedActions ?? [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ranked Center</h1>
          <p className="text-sm text-white/70">
            {nicheName} — Local SEO, GBP, reviews, and citations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/local-seo-audit" })}
            data-ocid="ranked.audit.button"
            className="rounded-xl border-[#00BFFF]/30 text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:scale-105 transition-all duration-200"
          >
            <Search size={14} className="mr-1.5" />
            Run Audit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/gbp-post-drafts" })}
            data-ocid="ranked.gbp_posts.button"
            className="rounded-xl border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 hover:scale-105 transition-all duration-200"
          >
            <FileText size={14} className="mr-1.5" />
            GBP Posts
          </Button>
        </div>
      </div>

      {/* Estimated score notice */}
      <div className="flex items-center gap-2 text-xs text-white/40 bg-white/3 border border-white/8 rounded-xl px-4 py-2">
        <TrendingUp size={12} className="flex-shrink-0" />
        <span>
          Estimated scores based on typical {nicheName} businesses in your area.
          Connect live Google data to see your actual numbers.
        </span>
      </div>

      {/* Overall Score */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-lg shadow-black/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#00BFFF]/40 flex items-center justify-center bg-[#00BFFF]/10">
              <span className="text-2xl font-bold text-white">
                {overallScore}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white/90">
                Local Visibility Score
              </h3>
              <p className="text-sm text-white/70">
                {overallScore >= 70
                  ? "Strong local presence. Maintain momentum."
                  : overallScore >= 50
                    ? "Moderate presence. Focus on review velocity and citations."
                    : "Needs attention. GBP optimization and review generation recommended."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {(["overview", "posts", "reviews", "actions"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            data-ocid={`ranked.tab.${t}.button`}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
              tab === t
                ? "bg-[#00BFFF]/15 text-[#00BFFF] border border-[#00BFFF]/30 shadow-lg shadow-[#00BFFF]/10"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scorecards.map((s) => (
            <Card
              key={s.label}
              className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 rounded-2xl transition-all duration-200"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <s.icon size={16} className={s.color} />
                  <span className="text-sm font-medium text-white/90">
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={s.score} className="flex-1 h-2" />
                  <span className="text-sm font-bold text-white w-8 text-right">
                    {s.score}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "posts" && (
        <div className="space-y-3">
          {gbpPosts.map((post) => (
            <Card
              key={post.id}
              className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 rounded-2xl transition-all duration-200"
              data-ocid={`ranked.gbp_post.${post.id}.card`}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">
                    {post.title}
                  </p>
                  <p className="text-xs text-white/50 capitalize">
                    {post.type.replace("_", " ")}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    post.status === "approved"
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      : post.status === "pending_approval"
                        ? "bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/30"
                        : "bg-white/5 text-white/50 border-white/10"
                  }`}
                >
                  {post.status.replace("_", " ")}
                </Badge>
              </CardContent>
            </Card>
          ))}
          {gbpPosts.length === 0 && (
            <div
              className="text-center py-8"
              data-ocid="ranked.posts.empty_state"
            >
              <FileText size={28} className="mx-auto text-white/20 mb-2" />
              <p className="text-white/50 text-sm">No GBP post drafts yet.</p>
            </div>
          )}
        </div>
      )}

      {tab === "reviews" && (
        <div className="space-y-3">
          {REVIEWS.map((review) => (
            <Card
              key={review.id}
              className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 rounded-2xl transition-all duration-200"
              data-ocid={`ranked.review.${review.id}.card`}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-[#FFD700]" />
                    <span className="text-sm font-medium text-white/90">
                      {review.author}
                    </span>
                    <span className="text-xs text-white/50">
                      {review.rating}/5
                    </span>
                  </div>
                  {!review.replied && (
                    <Badge
                      variant="outline"
                      className="bg-rose-500/15 text-rose-300 border-rose-500/30 text-[10px] rounded-full px-3 py-1 font-medium"
                    >
                      Needs Reply
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/70">{review.text}</p>
                {!review.replied && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs rounded-xl border-[#00BFFF]/30 text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:scale-105 transition-all duration-200"
                    data-ocid={`ranked.review.${review.id}.reply.button`}
                  >
                    <MessageSquare size={12} className="mr-1" />
                    Draft Reply
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {REVIEWS.length === 0 && (
            <div
              className="text-center py-8"
              data-ocid="ranked.reviews.empty_state"
            >
              <MessageSquare size={28} className="mx-auto text-white/20 mb-2" />
              <p className="text-white/50 text-sm">No reviews to display.</p>
            </div>
          )}
        </div>
      )}

      {tab === "actions" && (
        <div className="space-y-3" data-ocid="ranked.actions.list">
          <p className="text-xs text-white/50 mb-4">
            Top 5 recommended actions for {nicheName} businesses to improve
            local visibility.
          </p>
          {topActions.map((action, i) => (
            <Card
              key={action.title}
              className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 rounded-2xl transition-all duration-200"
              data-ocid={`ranked.action.${i + 1}.card`}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-[#00BFFF]/15 border border-[#00BFFF]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-[#00BFFF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90 mb-1">
                    {i + 1}. {action.title}
                  </p>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
