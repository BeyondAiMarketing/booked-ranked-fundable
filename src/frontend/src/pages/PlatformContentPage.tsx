import React, { useState } from "react";

import { useSocialPostDraft } from "../hooks/useSocialPostDraft";

import type {
  ApprovalStatus,
  Platform,
  PostType,
} from "../types/socialContent";

const PLATFORMS: { key: Platform; label: string; hint: string }[] = [
  {
    key: "facebook",
    label: "Facebook",
    hint: "Community-focused, medium length",
  },
  {
    key: "instagram",
    label: "Instagram",
    hint: "Visual-first, 20-30 hashtags",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    hint: "Professional tone, longer form",
  },
  { key: "x", label: "X", hint: "Concise, under 280 chars" },
  { key: "threads", label: "Threads", hint: "Conversational, thread-friendly" },
  { key: "tiktok", label: "TikTok", hint: "Trendy, hook in first 3 seconds" },
  {
    key: "googleBusinessProfile",
    label: "Google Business",
    hint: "Local SEO, include keywords",
  },
];

export default function PlatformContentPage() {
  const {
    drafts,
    createDraft,
    submitForApproval,
    // updateApprovalStatus is available for future use
    // loading is available for future use
  } = useSocialPostDraft();
  const [activePlatform, setActivePlatform] = useState<Platform>("linkedin");
  const [showForm, setShowForm] = useState(false);
  const [newDraft, setNewDraft] = useState({
    hook: "",
    body: "",
    cta: "",
    hashtags: "",
    postType: "update" as PostType,
  });

  const platformDrafts =
    drafts?.filter((d) => d.platform === activePlatform) || [];

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending_review":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      case "needs_revision":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleCreateDraft = async () => {
    await createDraft({
      platform: activePlatform,
      postType: newDraft.postType,
      title: newDraft.hook,
      hook: newDraft.hook,
      body: newDraft.body,
      cta: newDraft.cta,
      approvalStatus: "draft",
      clientBusinessId: "",
      verticalProfileId: "",
    });
    setShowForm(false);
    setNewDraft({
      hook: "",
      body: "",
      cta: "",
      hashtags: "",
      postType: "update",
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(232_40%_22%)] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Platform Content Agent</h1>
        <p className="text-gray-400 mb-6">
          Adapt posts for Facebook, Instagram, LinkedIn, X, Threads, TikTok, GBP
        </p>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {PLATFORMS.map((p) => (
            <button
              type="button"
              key={p.key}
              onClick={() => setActivePlatform(p.key)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activePlatform === p.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-blue-200 text-sm">
            <span className="font-semibold">
              Tip for {PLATFORMS.find((p) => p.key === activePlatform)?.label}:
            </span>{" "}
            {PLATFORMS.find((p) => p.key === activePlatform)?.hint}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg mb-6"
        >
          Create Draft
        </button>

        {showForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              New {PLATFORMS.find((p) => p.key === activePlatform)?.label} Draft
            </h3>
            <div className="space-y-4">
              <select
                value={newDraft.postType}
                onChange={(e) =>
                  setNewDraft((prev) => ({
                    ...prev,
                    postType: e.target.value as PostType,
                  }))
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              >
                <option value="update">Update</option>
                <option value="offer">Offer</option>
                <option value="event">Event</option>
                <option value="serviceHighlight">Service Highlight</option>
                <option value="seasonal">Seasonal</option>
                <option value="customerStory">Customer Story</option>
                <option value="educational">Educational</option>
                <option value="community">Community</option>
                <option value="faq">FAQ</option>
                <option value="reviewHighlight">Review Highlight</option>
              </select>
              <input
                type="text"
                placeholder="Hook"
                value={newDraft.hook}
                onChange={(e) =>
                  setNewDraft((prev) => ({ ...prev, hook: e.target.value }))
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
              <textarea
                placeholder="Body"
                value={newDraft.body}
                onChange={(e) =>
                  setNewDraft((prev) => ({ ...prev, body: e.target.value }))
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-24"
              />
              <input
                type="text"
                placeholder="CTA"
                value={newDraft.cta}
                onChange={(e) =>
                  setNewDraft((prev) => ({ ...prev, cta: e.target.value }))
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Hashtags (comma-separated)"
                value={newDraft.hashtags}
                onChange={(e) =>
                  setNewDraft((prev) => ({ ...prev, hashtags: e.target.value }))
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleCreateDraft}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformDrafts.map((draft, idx) => (
            <div
              key={`draft-${draft.id || idx}`}
              className="bg-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-gray-400 capitalize">
                  {draft.postType}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusColor(draft.approvalStatus)} bg-opacity-20`}
                >
                  {draft.approvalStatus}
                </span>
              </div>
              <h4 className="font-semibold mb-2">{draft.hook}</h4>
              <p className="text-gray-300 text-sm mb-3">{draft.body}</p>
              <div className="text-sm text-blue-400 mb-3">{draft.cta}</div>
              <div className="flex flex-wrap gap-1 mb-3">
                {draft.hashtags?.map((tag, _i) => (
                  <span key={`tag-${tag}`} className="text-xs text-gray-500">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {draft.approvalStatus === "draft" && (
                  <button
                    type="button"
                    onClick={() => submitForApproval(draft.id)}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                  >
                    Submit for Approval
                  </button>
                )}
              </div>
            </div>
          ))}
          {platformDrafts.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No drafts for this platform yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
