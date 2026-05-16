import {
  CheckCircle,
  ExternalLink,
  Loader2,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { useApp } from "../context/AppContext";

interface PlatformStatus {
  status: "live" | "not_connected" | "unreachable";
  rating: number;
  reviewCount: number;
  lastChecked: string;
}

const PLATFORM_META = [
  {
    id: "google",
    label: "Google Business",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    initials: "G",
    urlKey: "googleUrl" as const,
    defaultRating: 4.7,
    defaultReviews: 94,
  },
  {
    id: "yelp",
    label: "Yelp",
    color: "bg-red-500",
    textColor: "text-red-600",
    initials: "Y",
    urlKey: "yelpUrl" as const,
    defaultRating: 4.4,
    defaultReviews: 31,
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "bg-indigo-600",
    textColor: "text-indigo-600",
    initials: "F",
    urlKey: "facebookUrl" as const,
    defaultRating: 4.6,
    defaultReviews: 18,
  },
  {
    id: "bing",
    label: "Bing Places",
    color: "bg-cyan-500",
    textColor: "text-cyan-600",
    initials: "B",
    urlKey: "bingUrl" as const,
    defaultRating: 4.2,
    defaultReviews: 7,
  },
];

export default function ListingsPage() {
  const { currentTenantId, listingConfigs, setListingConfig } = useApp();
  const config = listingConfigs[currentTenantId] ?? {
    googleUrl: "",
    yelpUrl: "",
    facebookUrl: "",
    bingUrl: "",
  };

  const [form, setForm] = useState(config);
  const [checking, setChecking] = useState<Record<string, boolean>>({});
  const [statuses, setStatuses] = useState<Record<string, PlatformStatus>>({});

  const connectedCount = PLATFORM_META.filter((p) =>
    config[p.urlKey]?.trim(),
  ).length;

  const napScore =
    connectedCount >= 4
      ? 96
      : connectedCount >= 3
        ? 82
        : connectedCount >= 2
          ? 71
          : connectedCount === 1
            ? 52
            : 38;

  const handleSave = () => {
    setListingConfig(currentTenantId, form);
    toast.success("Listing URLs saved");
  };

  const handleCheck = (platformId: string) => {
    setChecking((prev) => ({ ...prev, [platformId]: true }));
    setTimeout(() => {
      const meta = PLATFORM_META.find((p) => p.id === platformId);
      const hasUrl =
        config[meta?.urlKey ?? ("googleUrl" as const)]?.trim().length > 0;
      setStatuses((prev) => ({
        ...prev,
        [platformId]: {
          status: hasUrl ? "live" : "not_connected",
          rating: meta?.defaultRating ?? 4.5,
          reviewCount: meta?.defaultReviews ?? 10,
          lastChecked: new Date().toLocaleTimeString(),
        },
      }));
      setChecking((prev) => ({ ...prev, [platformId]: false }));
    }, 1500);
  };

  const handleCheckAll = () => {
    for (const p of PLATFORM_META) {
      handleCheck(p.id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Listings Monitor</h1>
        <p className="text-sm text-gray-200 mt-1">
          Track your business presence across all major platforms
        </p>
      </div>

      {/* URL Config */}
      <Card data-ocid="listings.config.card">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MapPin size={16} className="text-indigo-600" />
            Platform URLs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLATFORM_META.map((p) => (
              <div key={p.id}>
                <Label className="text-xs text-gray-600 mb-1 block">
                  {p.label} URL
                </Label>
                <Input
                  data-ocid={`listings.${p.id}.input`}
                  value={form[p.urlKey]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [p.urlKey]: e.target.value,
                    }))
                  }
                  placeholder={`https://${p.id === "google" ? "business.google.com" : p.id === "yelp" ? "yelp.com/biz/your-business" : p.id === "facebook" ? "facebook.com/your-page" : "bingplaces.com/business"}/...`}
                  className="text-xs"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              data-ocid="listings.save.button"
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              size="sm"
            >
              Save Listings
            </Button>
            <Button
              data-ocid="listings.check_all.button"
              onClick={handleCheckAll}
              variant="outline"
              size="sm"
            >
              <RefreshCw size={13} className="mr-1.5" />
              Check All Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Status Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        data-ocid="listings.platforms.card"
      >
        {PLATFORM_META.map((p, i) => {
          const status = statuses[p.id];
          const isChecking = checking[p.id];
          const hasUrl = config[p.urlKey]?.trim().length > 0;

          return (
            <Card
              key={p.id}
              data-ocid={`listings.platform.item.${i + 1}`}
              className="border border-gray-200"
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${p.color} flex items-center justify-center text-white text-sm font-bold`}
                    >
                      {p.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {p.label}
                      </p>
                      {status ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {status.status === "live" ? (
                            <CheckCircle
                              size={12}
                              className="text-emerald-500"
                            />
                          ) : (
                            <XCircle size={12} className="text-gray-200" />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              status.status === "live"
                                ? "text-emerald-600"
                                : "text-gray-200"
                            }`}
                          >
                            {status.status === "live"
                              ? "Live"
                              : status.status === "unreachable"
                                ? "Unreachable"
                                : "Not Connected"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-200">
                          {hasUrl ? "URL saved" : "Not configured"}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`listings.check.button.${i + 1}`}
                    onClick={() => handleCheck(p.id)}
                    disabled={isChecking}
                    className="text-xs h-7 px-2"
                  >
                    {isChecking ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      "Check Now"
                    )}
                  </Button>
                </div>

                {status?.status === "live" && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-base font-bold text-gray-800">
                          {status.rating}★
                        </p>
                        <p className="text-[10px] text-gray-200">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-base font-bold text-gray-800">
                          {status.reviewCount}
                        </p>
                        <p className="text-[10px] text-gray-200">Reviews</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-200">
                        Checked {status.lastChecked}
                      </p>
                      {config[p.urlKey] && (
                        <a
                          href={config[p.urlKey]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-[10px] ${p.textColor} flex items-center gap-0.5 justify-end mt-0.5`}
                        >
                          View listing
                          <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* NAP Score */}
      <Card data-ocid="listings.nap.card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            NAP Consistency Score
          </CardTitle>
          <p className="text-sm text-gray-200">
            Name, Address & Phone consistency across platforms
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900">{napScore}</span>
            <span className="text-sm text-gray-200">/100</span>
          </div>
          <Progress value={napScore} className="h-2" />
          <p className="text-xs text-gray-200">
            {connectedCount < 2
              ? "Connect more platforms to improve your NAP score and local SEO."
              : connectedCount < 4
                ? "Good start — connect all 4 platforms for maximum NAP consistency."
                : "Excellent — all 4 platforms connected. Run a check to verify consistency."}
          </p>
          {connectedCount >= 2 && (
            <div className="space-y-2 pt-1">
              <p className="text-xs font-medium text-gray-700">
                Consistency checks:
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Business hours may differ between Google and Yelp
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Phone number format inconsistency detected on Facebook
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Business name matches across all connected platforms
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card data-ocid="listings.insights.card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Listing Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Your Google listing has the most reviews — make sure your address matches Yelp exactly, including suite numbers.",
              "Responding to Google reviews within 24 hours improves your local pack ranking. You have 2 unanswered reviews.",
              "Bing Places is often overlooked — it powers Apple Maps and Amazon Alexa local results. Worth claiming.",
            ].map((insight, insightIdx) => (
              <li
                key={insight}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {insightIdx + 1}
                </span>
                {insight}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
