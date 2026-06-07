import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  MapPin,
  MoreHorizontal,
  Phone,
  Send,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface GeneratedLeadUI {
  id: string;
  name: string;
  ownerFirstName: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  niche: string;
  city: string;
  source: string;
  enriched: boolean;
  /** serpApiVerified=true → real-time verified lead */
  serpApiVerified?: boolean;
  temperature: string;
  score: number;
  isNewBusiness?: boolean;
  isNewFiling?: boolean;
  status?: string;
  outreachSubject?: string;
  outreachBody?: string;
}

interface LeadCardProps {
  lead: GeneratedLeadUI;
  selected: boolean;
  onToggle: (id: string) => void;
  index: number;
  onStatusChange?: (id: string, status: string) => void;
  onPushToOutreach?: (id: string) => void;
}

const TEMP_STYLES: Record<string, string> = {
  hot: "bg-red-500/20 text-red-300 border-red-500/30",
  warm: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  cold: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

const SOURCE_STYLES: Record<string, string> = {
  serpapi_dev: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  tinyfish: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  openai: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  both: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "new-filing": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "claude-enriched": "bg-green-500/20 text-green-300 border-green-500/30",
  claude: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const SOURCE_LABELS: Record<string, string> = {
  serpapi_dev: "SerpApi",
  tinyfish: "TinyFish",
  openai: "OpenAI",
  both: "Both AIs",
  "new-filing": "New Filing",
  "claude-enriched": "Claude Enriched",
  claude: "Claude",
};

const STATUS_OPTIONS = [
  "New Lead",
  "Contacted",
  "Demo Scheduled",
  "Demo Completed",
  "Trial Started",
  "Customer",
  "Not Interested",
];

const STATUS_COLORS: Record<string, string> = {
  "New Lead": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  Contacted: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Demo Scheduled": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Demo Completed": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Trial Started": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Customer: "bg-green-500/20 text-green-300 border-green-500/30",
  "Not Interested": "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function LeadCard({
  lead,
  selected,
  onToggle,
  index,
  onStatusChange,
  onPushToOutreach,
}: LeadCardProps) {
  const tempKey = lead.temperature.toLowerCase();
  const srcKey = lead.source.toLowerCase();
  const [showOutreach, setShowOutreach] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  };

  const currentStatus = lead.status ?? "New Lead";

  return (
    <div
      data-ocid={`ai_leads.card.${index}`}
      className={`relative w-full text-left rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
        selected
          ? "border-purple-500/60 bg-purple-500/10 shadow-lg shadow-purple-500/10"
          : "border-white/10 bg-card hover:border-white/20 hover:bg-white/5"
      }`}
    >
      {/* Selection indicator */}
      <button
        type="button"
        aria-pressed={selected}
        aria-label={`Select lead: ${lead.name}`}
        onClick={() => onToggle(lead.id)}
        className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          selected
            ? "border-purple-400 bg-purple-500"
            : "border-white/20 bg-transparent"
        }`}
      >
        {selected && <CheckCircle2 size={12} className="text-white" />}
      </button>

      {/* Header row */}
      <div className="flex items-start gap-2.5 pr-8 mb-3">
        <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Building2 size={16} className="text-purple-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {lead.name}
          </p>
          {lead.ownerFirstName && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <User size={10} />
              {lead.ownerFirstName}
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${
            TEMP_STYLES[tempKey] ??
            "bg-gray-500/20 text-gray-300 border-gray-500/30"
          }`}
        >
          {lead.temperature}
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            SOURCE_STYLES[srcKey] ??
            "bg-gray-500/20 text-gray-300 border-gray-500/30"
          }`}
        >
          {SOURCE_LABELS[srcKey] ?? lead.source}
        </span>
        {lead.niche && (
          <Badge className="badge-purple text-[10px] border capitalize">
            {lead.niche}
          </Badge>
        )}
        {/* Verified vs AI Generated badge */}
        {lead.serpApiVerified || lead.enriched ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            <CheckCircle2 size={8} /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-amber-500/20 text-amber-300 border-amber-500/30">
            AI Generated
          </span>
        )}
        {(lead.isNewBusiness || lead.isNewFiling) && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-blue-600/20 text-blue-300 border-blue-500/30">
            New Filing
          </span>
        )}
      </div>

      {/* Contact info */}
      <div className="space-y-1">
        {lead.phone && (
          <p className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
            <Phone size={10} className="flex-shrink-0" />
            {lead.phone}
          </p>
        )}
        {(lead.address || lead.city) && (
          <p className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
            <MapPin size={10} className="flex-shrink-0" />
            {[lead.address, lead.city].filter(Boolean).join(", ")}
          </p>
        )}
        {lead.website && (
          <a
            href={
              lead.website.startsWith("http")
                ? lead.website
                : `https://${lead.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 truncate transition-colors"
          >
            <ExternalLink size={10} className="flex-shrink-0" />
            {lead.website.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>

      {/* Score bar */}
      {lead.score > 0 && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500">AI Score</span>
            <span className="text-[10px] font-bold text-purple-400">
              {lead.score}/100
            </span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
              style={{ width: `${Math.min(lead.score, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Status dropdown */}
      <div
        className="mt-3"
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Select
          value={currentStatus}
          onValueChange={(val) => onStatusChange?.(lead.id, val)}
        >
          <SelectTrigger
            className={`h-7 text-[11px] border ${STATUS_COLORS[currentStatus] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}
            data-ocid={`ai_leads.status_select.${index}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className="text-xs text-gray-300"
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Outreach copy section */}
      {(lead.outreachSubject || lead.outreachBody) && (
        <div
          className="mt-3"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setShowOutreach((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            data-ocid={`ai_leads.outreach_toggle.${index}`}
          >
            <MoreHorizontal size={12} />
            {showOutreach ? "Hide outreach copy" : "Show outreach copy"}
            {showOutreach ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {showOutreach && (
            <div className="mt-2 space-y-2 p-3 rounded-lg bg-white/5 border border-white/10">
              {lead.outreachSubject && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Subject
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1.5 text-[10px] text-purple-400 hover:text-purple-300"
                      onClick={() =>
                        handleCopy(lead.outreachSubject!, "Subject")
                      }
                      data-ocid={`ai_leads.copy_subject.${index}`}
                    >
                      <Copy size={10} className="mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-gray-300">
                    {lead.outreachSubject}
                  </p>
                </div>
              )}
              {lead.outreachBody && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Body
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1.5 text-[10px] text-purple-400 hover:text-purple-300"
                      onClick={() => handleCopy(lead.outreachBody!, "Body")}
                      data-ocid={`ai_leads.copy_body.${index}`}
                    >
                      <Copy size={10} className="mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap">
                    {lead.outreachBody}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Push to Outreach button */}
      <div
        className="mt-3"
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 text-xs"
          onClick={() => {
            onPushToOutreach?.(lead.id);
            toast.success("Lead pushed to outreach queue");
          }}
          data-ocid={`ai_leads.push_outreach_button.${index}`}
        >
          <Send size={12} className="mr-1.5" />
          Push to Outreach
        </Button>
      </div>
    </div>
  );
}
