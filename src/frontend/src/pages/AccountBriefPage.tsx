import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { AccountBrief } from "../backend";
import { useActor } from "../hooks/useActor";

const PREDEFINED_CATEGORIES = [
  "Leads",
  "Clients",
  "Team Members",
  "Contractors",
  "Vendors",
] as const;

const TONE_OPTIONS = [
  "Professional",
  "Friendly",
  "Direct",
  "Conversational",
] as const;

interface TagInputState {
  ignoreList: string;
  priorityContacts: string;
  flagKeywords: string;
}

export default function AccountBriefPage() {
  const { actor } = useActor();

  const [responseCategories, setResponseCategories] = useState<string[]>([]);
  const [ignoreList, setIgnoreList] = useState<string[]>([]);
  const [priorityContacts, setPriorityContacts] = useState<string[]>([]);
  const [tone, setTone] = useState<string>("Professional");
  const [offerSummary, setOfferSummary] = useState<string>("");
  const [flagKeywords, setFlagKeywords] = useState<string[]>([]);

  const [tagInputs, setTagInputs] = useState<TagInputState>({
    ignoreList: "",
    priorityContacts: "",
    flagKeywords: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchBrief = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError(null);
    try {
      const result = (await actor.getAccountBrief("default")) as
        | { ok: AccountBrief }
        | { err: string };
      if ("ok" in result && result.ok) {
        const brief = result.ok;
        setResponseCategories(brief.respondTo ?? []);
        setIgnoreList(brief.ignoreList ?? []);
        setPriorityContacts(brief.priorityContacts ?? []);
        setTone(brief.tone ?? "Professional");
        setOfferSummary(brief.offerSummary ?? "");
        setFlagKeywords(brief.flagKeywords ?? []);
      } else if ("err" in result) {
        setError(result.err);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load account brief");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchBrief();
  }, [fetchBrief]);

  const handleCategoryToggle = (category: string) => {
    setResponseCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const addTag = (
    field: keyof TagInputState,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const value = tagInputs[field].trim();
    if (!value) return;
    setter((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setTagInputs((prev) => ({ ...prev, [field]: "" }));
  };

  const removeTag = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) => prev.filter((t) => t !== value));
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof TagInputState,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(field, setter);
    }
  };

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const payload: AccountBrief = {
        respondTo: responseCategories,
        accountId: "default",
        ignoreList,
        tone,
        offerSummary,
        doNotRespondList: [],
        updatedAt: BigInt(Date.now()),
        updatedBy: "",
        priorityContacts,
        flagKeywords,
        performanceHistory: [],
        doRules: [],
        sessionLog: [],
        differentiators: [],
        targetAudience: [],
        contentHistory: [],
        brandVoice: "",
        services: [],
        dontRules: [],
        positioning: "",
      };
      const result = (await actor.saveAccountBrief(payload)) as
        | { ok: AccountBrief }
        | { err: string };
      if ("ok" in result && result.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else if ("err" in result) {
        setError(result.err);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save account brief");
    } finally {
      setSaving(false);
    }
  };

  const TagChip = ({
    value,
    onRemove,
  }: {
    value: string;
    onRemove: () => void;
  }) => (
    <span className="inline-flex items-center gap-1 bg-blue-900/40 text-blue-200 px-2 py-1 rounded-lg text-sm">
      {value}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-white transition-colors"
        aria-label={`Remove ${value}`}
        data-ocid="account_brief.remove_tag_button"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );

  const TagInput = ({
    label,
    field,
    tags,
    setter,
    placeholder,
  }: {
    label: string;
    field: keyof TagInputState;
    tags: string[];
    setter: React.Dispatch<React.SetStateAction<string[]>>;
    placeholder: string;
  }) => (
    <div>
      <label
        htmlFor={`tag-input-${field}`}
        className="block text-sm font-medium text-slate-300 mb-2"
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <TagChip
            key={tag}
            value={tag}
            onRemove={() => removeTag(tag, setter)}
          />
        ))}
      </div>
      <input
        type="text"
        value={tagInputs[field]}
        onChange={(e) =>
          setTagInputs((prev) => ({ ...prev, [field]: e.target.value }))
        }
        onKeyDown={(e) => handleTagKeyDown(e, field, setter)}
        placeholder={placeholder}
        className="w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        id={`tag-input-${field}`}
        data-ocid={`account_brief.${field}_input`}
      />
      <p className="text-xs text-slate-500 mt-1">Press Enter to add</p>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">Account Brief</h1>
          <p className="text-sm text-slate-400">
            Set AI behavior rules, priority contacts, and response preferences
            per account.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/30 flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/30 flex items-center gap-3 text-emerald-200">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Account brief saved successfully.</p>
        </div>
      )}

      {/* Response Categories */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Response Categories
        </h2>
        <div className="flex flex-wrap gap-3">
          {PREDEFINED_CATEGORIES.map((category) => (
            <label
              key={category}
              className="inline-flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={responseCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 rounded border-white/20 bg-slate-800/60 text-blue-500 focus:ring-blue-500/50"
                data-ocid={`account_brief.category_checkbox.${category.toLowerCase().replace(/\s+/g, "_")}`}
              />
              <span className="text-sm text-slate-300">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ignore List */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Ignore List</h2>
        <TagInput
          label="Domains or keywords to ignore"
          field="ignoreList"
          tags={ignoreList}
          setter={setIgnoreList}
          placeholder="e.g. spamdomain.com or newsletter"
        />
      </div>

      {/* Priority Contacts */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Priority Contacts
        </h2>
        <TagInput
          label="Important senders to flag"
          field="priorityContacts"
          tags={priorityContacts}
          setter={setPriorityContacts}
          placeholder="e.g. john@example.com or VIP Client"
        />
      </div>

      {/* Tone */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Tone</h2>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          data-ocid="account_brief.tone_select"
        >
          {TONE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Offer Summary */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Offer Summary</h2>
        <textarea
          value={offerSummary}
          onChange={(e) => setOfferSummary(e.target.value)}
          placeholder="Describe your core offer so the AI knows what to pitch..."
          rows={4}
          className="w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
          data-ocid="account_brief.offer_summary_textarea"
        />
      </div>

      {/* Flag Keywords */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Flag Keywords</h2>
        <TagInput
          label="Words that trigger priority alerts"
          field="flagKeywords"
          tags={flagKeywords}
          setter={setFlagKeywords}
          placeholder="e.g. urgent, contract, complaint"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !actor}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          data-ocid="account_brief.save_button"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
