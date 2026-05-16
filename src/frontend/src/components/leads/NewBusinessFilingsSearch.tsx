import {
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export const NICHES = [
  "plumber",
  "hvac",
  "dental",
  "med spa",
  "roofing",
  "restoration",
  "real estate",
  "mortgage",
  "contractor",
  "general",
];

interface Props {
  onSearch: (niche: string, city: string, isFilings: boolean) => void;
  isLoading: boolean;
}

export default function NewBusinessFilingsSearch({
  onSearch,
  isLoading,
}: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);

  const toggleNiche = (n: string) => {
    setSelectedNiches((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    );
  };

  const handleSearch = () => {
    const niches = selectedNiches.length > 0 ? selectedNiches : ["general"];
    const city = [county, state].filter(Boolean).join(", ");
    for (const niche of niches) {
      onSearch(
        `${niche} newly registered business DBA fictitious business filing`,
        city || state || "nationwide",
        true,
      );
    }
  };

  return (
    <div
      className="rounded-xl border border-white/10 overflow-hidden"
      data-ocid="ai_leads.filings_section"
    >
      {/* Header / Toggle */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-white/5 transition-colors"
        onClick={() => setOpen((v) => !v)}
        data-ocid="ai_leads.filings_toggle"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <FileText size={16} className="text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">
              Find Newly Registered Businesses
            </p>
            <p className="text-xs text-gray-500">
              DBA filings, new LLCs, fictitious business names
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Zero Competition
          </span>
          {open ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="px-5 pb-5 pt-2 border-t border-white/8 space-y-4">
          {/* Info tooltip */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <HelpCircle
              size={14}
              className="text-emerald-400 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-emerald-300 leading-relaxed">
              These prompts ask Claude and OpenAI to identify businesses that
              recently registered — prime leads with zero competition. Most
              newly-filed businesses have never been contacted by a platform
              like BRF.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* State */}
            <div>
              <Label className="text-xs text-gray-400 mb-1.5 block">
                State
              </Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger
                  className="bg-gray-800 border-gray-700 text-gray-300"
                  data-ocid="ai_leads.filings.state_select"
                >
                  <SelectValue placeholder="Select state..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* County / City */}
            <div>
              <Label className="text-xs text-gray-400 mb-1.5 block">
                County / City <span className="text-gray-600">(optional)</span>
              </Label>
              <Input
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="e.g. Orange County"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                data-ocid="ai_leads.filings.county_input"
              />
            </div>
          </div>

          {/* Niche multi-select */}
          <div>
            <Label className="text-xs text-gray-400 mb-2 block">
              Niches{" "}
              <span className="text-gray-600">
                (select all that apply, or leave empty for general)
              </span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => toggleNiche(n)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                    selectedNiches.includes(n)
                      ? "bg-purple-500/30 text-purple-200 border-purple-500/50"
                      : "bg-card text-gray-400 border-white/10 hover:border-white/20"
                  }`}
                  data-ocid={`ai_leads.filings.niche.${n}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold"
            data-ocid="ai_leads.filings.search_button"
          >
            <Search size={15} className="mr-2" />
            {isLoading ? "Searching..." : "Search New Filings with AI"}
          </Button>
        </div>
      )}
    </div>
  );
}
