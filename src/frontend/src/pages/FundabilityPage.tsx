import {
  ArrowUpRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  ExternalLink,
  FileText,
  Printer,
  Share2,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useApp } from "../context/AppContext";
import { FUNDABILITY_SCORES } from "../data/demoData";
import {
  ACTION_PLAN_ITEMS,
  type ActionItem,
  NICHE_FUNDING_OPPORTUNITIES,
  NICHE_VENDOR_CREDITS,
  SCORE_TIER_CONFIG,
  type ScoreInputs,
  calculateFundabilityScore,
  getNicheKey,
  getScoreTier,
} from "../data/fundabilityData";

// ─── Circular Score Gauge ─────────────────────────────────────────────────────
function CircularGauge({
  score,
  animated = false,
}: { score: number; animated?: boolean }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const tier = getScoreTier(score);
  const cfg = SCORE_TIER_CONFIG[tier];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative w-36 h-36 rounded-full ring-4 ${animated ? cfg.ringColor : "ring-transparent"} transition-all duration-700`}
      >
        <svg
          width="144"
          height="144"
          viewBox="0 0 144 144"
          className="-rotate-90"
        >
          <title>Fundability score: {score}/100</title>
          <circle
            cx="72"
            cy="72"
            r={r}
            fill="none"
            stroke="oklch(0.2 0.015 280)"
            strokeWidth="10"
          />
          <motion.circle
            cx="72"
            cy="72"
            r={r}
            fill="none"
            stroke={cfg.color}
            strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={circ - (score / 100) * circ}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (score / 100) * circ }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-foreground tabular-nums"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span
        className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${cfg.badgeClass}`}
      >
        {cfg.label}
      </span>
    </div>
  );
}

// ─── Radio Option ─────────────────────────────────────────────────────────────
function RadioOption({
  id,
  name,
  value,
  current,
  label,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  current: string;
  label: string;
  onChange: (v: string) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
        current === value
          ? "border-primary/60 bg-primary/10 text-foreground"
          : "border-border bg-muted/20 text-muted-foreground hover:border-border/60"
      }`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={current === value}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <div
        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${current === value ? "border-primary" : "border-muted-foreground/40"}`}
      >
        {current === value && (
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        )}
      </div>
      {label}
    </label>
  );
}

// ─── Toggle Option ────────────────────────────────────────────────────────────
function ToggleRow({
  label,
  hint,
  checked,
  onToggle,
  ocid,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onToggle: () => void;
  ocid: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-border/30 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        data-ocid={ocid}
        onClick={onToggle}
        className={`relative flex-shrink-0 w-10 h-5.5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
          checked ? "bg-primary" : "bg-muted"
        }`}
        aria-checked={checked}
        role="switch"
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4.5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

// ─── Score Input Panel ────────────────────────────────────────────────────────
function ScoreInputPanel({
  inputs,
  onChange,
}: {
  inputs: ScoreInputs;
  onChange: (patch: Partial<ScoreInputs>) => void;
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Building2 size={15} className="text-primary" />
          Business Profile — Your Score Updates Live
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Answer honestly. This is your real fundability score — before BRF
          works its system.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Entity Type */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Business Entity Type
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["llc", "LLC"],
                ["scorp", "S-Corp"],
                ["ccorp", "C-Corp"],
                ["soleprop", "Sole Prop ⚠️"],
              ] as const
            ).map(([val, lbl]) => (
              <RadioOption
                key={val}
                id={`entity-${val}`}
                name="entityType"
                value={val}
                current={inputs.entityType}
                label={lbl}
                onChange={(v) =>
                  onChange({ entityType: v as ScoreInputs["entityType"] })
                }
              />
            ))}
          </div>
          {inputs.entityType === "soleprop" && (
            <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              ⚠️ Sole proprietorships are invisible to most lenders. Forming an
              LLC adds +10 points and unlocks every tier of business credit.
              Cost: $50–$150.
            </p>
          )}
        </div>

        {/* Years in Business */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Years in Business
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["lt1", "< 1 Year"],
                ["1to2", "1–2 Years"],
                ["gt2", "2+ Years"],
              ] as const
            ).map(([val, lbl]) => (
              <RadioOption
                key={val}
                id={`years-${val}`}
                name="yearsInBusiness"
                value={val}
                current={inputs.yearsInBusiness}
                label={lbl}
                onChange={(v) =>
                  onChange({
                    yearsInBusiness: v as ScoreInputs["yearsInBusiness"],
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* Business Credit Cards */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Business Credit Cards
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["0", "None"],
                ["1", "1 Card"],
                ["2plus", "2+ Cards"],
              ] as const
            ).map(([val, lbl]) => (
              <RadioOption
                key={val}
                id={`cards-${val}`}
                name="businessCreditCards"
                value={val}
                current={inputs.businessCreditCards}
                label={lbl}
                onChange={(v) =>
                  onChange({
                    businessCreditCards:
                      v as ScoreInputs["businessCreditCards"],
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* Toggle rows */}
        <div className="space-y-0">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Business Infrastructure
          </Label>
          <ToggleRow
            label="EIN / Tax ID obtained"
            hint="Free from IRS.gov — adds +10 pts"
            checked={inputs.hasEin}
            onToggle={() => onChange({ hasEin: !inputs.hasEin })}
            ocid="fundability.ein.toggle"
          />
          <ToggleRow
            label="Dedicated business bank account"
            hint="Separate from personal — adds +15 pts"
            checked={inputs.hasBankAccount}
            onToggle={() =>
              onChange({ hasBankAccount: !inputs.hasBankAccount })
            }
            ocid="fundability.bank.toggle"
          />
          <ToggleRow
            label="Commercial business address"
            hint="Not a home address — adds +10 pts"
            checked={inputs.hasCommercialAddress}
            onToggle={() =>
              onChange({ hasCommercialAddress: !inputs.hasCommercialAddress })
            }
            ocid="fundability.address.toggle"
          />
          <ToggleRow
            label="Dedicated business phone number"
            hint="Not your personal cell — adds +5 pts"
            checked={inputs.hasBusinessPhone}
            onToggle={() =>
              onChange({ hasBusinessPhone: !inputs.hasBusinessPhone })
            }
            ocid="fundability.phone.toggle"
          />
          <ToggleRow
            label="Google Business Profile verified"
            hint="Verified badge on Google Maps — adds +10 pts"
            checked={inputs.hasGbpVerified}
            onToggle={() =>
              onChange({ hasGbpVerified: !inputs.hasGbpVerified })
            }
            ocid="fundability.gbp.toggle"
          />
          <ToggleRow
            label="Active business website"
            hint="Live and professional — adds +5 pts"
            checked={inputs.hasActiveWebsite}
            onToggle={() =>
              onChange({ hasActiveWebsite: !inputs.hasActiveWebsite })
            }
            ocid="fundability.website.toggle"
          />
          <ToggleRow
            label="Existing business LOC or loan"
            hint="Already started — adds +5 pts"
            checked={inputs.hasExistingLoc}
            onToggle={() =>
              onChange({ hasExistingLoc: !inputs.hasExistingLoc })
            }
            ocid="fundability.loc.toggle"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Milestone Checkbox ───────────────────────────────────────────────────────
function MilestoneRow({
  item,
  checked,
  onToggle,
  index,
}: {
  item: ActionItem;
  checked: boolean;
  onToggle: () => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-xl border transition-colors duration-200 ${
        checked
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-border bg-card hover:border-border/80"
      }`}
    >
      <div className="flex items-start gap-3 p-3.5">
        <button
          type="button"
          data-ocid={`fundability.milestone.${index + 1}`}
          onClick={onToggle}
          className="flex-shrink-0 mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
          aria-label={checked ? "Mark incomplete" : "Mark complete"}
        >
          <AnimatePresence mode="wait">
            {checked ? (
              <motion.div
                key="checked"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 size={18} className="text-emerald-400" />
              </motion.div>
            ) : (
              <motion.div
                key="unchecked"
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
              >
                <Circle size={18} className="text-muted-foreground/50" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium leading-snug ${checked ? "line-through text-muted-foreground" : "text-foreground"}`}
          >
            {item.label}
          </p>
          {item.scoreBoost > 0 && !checked && (
            <span className="inline-flex items-center gap-1 text-[10px] text-primary/80 mt-0.5">
              <Zap size={9} /> +{item.scoreBoost} pts when completed
            </span>
          )}
          {checked && (
            <span className="text-[10px] text-emerald-400 mt-0.5 block">
              ✓ Completed
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {item.url && !checked && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/60 hover:text-primary transition-colors"
              aria-label={`Open ${item.label}`}
            >
              <ExternalLink size={13} />
            </a>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <ChevronDown
              size={13}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-muted-foreground px-3.5 pb-3.5 leading-relaxed border-t border-border/30 pt-2.5">
              {item.detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Action Plan Tab ──────────────────────────────────────────────────────────
function ActionPlanTab({
  inputs,
  completed,
  onToggle,
  score,
}: {
  inputs: ScoreInputs;
  completed: Set<string>;
  onToggle: (id: string, boost: number) => void;
  score: number;
}) {
  // Filter items to show relevant ones based on inputs
  const relevantItems = useMemo(() => {
    return ACTION_PLAN_ITEMS.filter((item) => {
      if (item.requiredWhen === "always") return true;
      if (!item.requiredWhen) return true;
      const fieldVal = inputs[item.requiredWhen as keyof ScoreInputs];
      if (item.invertRequired) {
        // Show when the field is false/empty/0
        return !fieldVal || fieldVal === "0" || fieldVal === "soleprop";
      }
      // Show when the field is truthy (needed to improve)
      return !fieldVal || fieldVal === "0";
    });
  }, [inputs]);

  const months = [1, 2, 3] as const;
  const monthLabels = [
    "Month 1 — Foundation",
    "Month 2 — Establishing Trade Lines",
    "Month 3 — Building History",
  ];
  const completedCount = completed.size;
  const totalCount = relevantItems.length;

  return (
    <div className="space-y-5">
      {/* Progress header */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground">
              Your 90-Day Plan Progress
            </p>
            <span className="text-sm font-bold text-primary">
              {completedCount} / {totalCount} milestones
            </span>
          </div>
          <Progress
            value={totalCount > 0 ? (completedCount / totalCount) * 100 : 0}
            className="h-2 bg-muted"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {completedCount >= Math.floor(totalCount * 0.7)
              ? `You're ahead of 73% of businesses at this stage. Keep going.`
              : `Complete ${Math.ceil(totalCount * 0.5) - completedCount} more milestones to be ahead of 73% of businesses.`}
          </p>
        </CardContent>
      </Card>

      {months.map((month, mi) => {
        const monthItems = relevantItems.filter((i) => i.month === month);
        if (monthItems.length === 0) return null;
        const monthDone = monthItems.filter((i) => completed.has(i.id)).length;

        return (
          <div key={month} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                {monthLabels[mi]}
              </h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${monthDone === monthItems.length ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-muted text-muted-foreground border-border"}`}
              >
                {monthDone}/{monthItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {monthItems.map((item, idx) => (
                <MilestoneRow
                  key={item.id}
                  item={item}
                  checked={completed.has(item.id)}
                  onToggle={() => onToggle(item.id, item.scoreBoost)}
                  index={idx}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Score note */}
      <div className="flex items-start gap-2 bg-primary/8 border border-primary/20 rounded-xl p-4 text-sm">
        <TrendingUp size={16} className="text-primary flex-shrink-0 mt-0.5" />
        <p className="text-muted-foreground leading-relaxed">
          <span className="text-foreground font-semibold">
            Current score: {score}/100.
          </span>{" "}
          Complete all milestones above to reach{" "}
          <span className="text-primary font-semibold">Fundable</span> status
          and unlock $500,000+ in commercial credit.
        </p>
      </div>
    </div>
  );
}

// ─── Vendor Credits Tab ───────────────────────────────────────────────────────
function VendorCreditsTab({ nicheKey }: { nicheKey: string }) {
  const vendors =
    NICHE_VENDOR_CREDITS[nicheKey as keyof typeof NICHE_VENDOR_CREDITS] ??
    NICHE_VENDOR_CREDITS.default;
  const universal = [
    {
      name: "Uline",
      type: "Office/Packaging Supplies",
      terms: "Net-30",
      limit: "Up to $10,000",
      url: "https://www.uline.com",
    },
    {
      name: "Quill",
      type: "Office Supplies",
      terms: "Net-30",
      limit: "Up to $5,000",
      url: "https://www.quill.com",
    },
    {
      name: "Amazon Business",
      type: "Business Supplies",
      terms: "Net-30",
      limit: "Up to $5,000",
      url: "https://business.amazon.com",
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1">
          Niche-Specific Trade Credit
        </h3>
        <p className="text-xs text-muted-foreground">
          These vendors serve your industry and offer net-30 trade lines that
          report to business credit bureaus.
        </p>
      </div>

      <div className="space-y-3">
        {vendors.map((v, i) => (
          <motion.div
            key={v.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
            data-ocid={`fundability.vendor.item.${i + 1}`}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Building2 size={14} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{v.name}</p>
              <p className="text-xs text-muted-foreground">
                {v.type} · {v.terms}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold text-primary">{v.limit}</p>
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors mt-0.5"
              >
                Apply <ExternalLink size={9} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-1">
          Universal Starter Trade Lines
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Every business should apply for these first — easy approval, reports
          to D&B.
        </p>
        <div className="space-y-2">
          {universal.map((v, i) => (
            <div
              key={v.name}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/30 border border-border"
              data-ocid={`fundability.universal_vendor.item.${i + 1}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{v.name}</p>
                <p className="text-xs text-muted-foreground">
                  {v.type} · {v.terms}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-primary/80">{v.limit}</p>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors mt-0.5"
                >
                  Apply <ExternalLink size={9} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Funding Report Tab ───────────────────────────────────────────────────────
function FundingReportTab({
  score,
  inputs,
  nicheKey,
  businessName,
  completedMilestones,
}: {
  score: number;
  inputs: ScoreInputs;
  nicheKey: string;
  businessName: string;
  completedMilestones: number;
}) {
  const tier = getScoreTier(score);
  const cfg = SCORE_TIER_CONFIG[tier];
  const opportunities =
    NICHE_FUNDING_OPPORTUNITIES[
      nicheKey as keyof typeof NICHE_FUNDING_OPPORTUNITIES
    ] ?? NICHE_FUNDING_OPPORTUNITIES.default;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const scoreBreakdown = [
    {
      label: "Entity Structure",
      pts: ["llc", "scorp", "ccorp"].includes(inputs.entityType) ? 10 : 0,
      max: 10,
    },
    { label: "EIN / Tax ID", pts: inputs.hasEin ? 10 : 0, max: 10 },
    {
      label: "Years in Business",
      pts:
        inputs.yearsInBusiness === "gt2"
          ? 10
          : inputs.yearsInBusiness === "1to2"
            ? 5
            : 0,
      max: 10,
    },
    {
      label: "Business Bank Account",
      pts: inputs.hasBankAccount ? 15 : 0,
      max: 15,
    },
    {
      label: "Commercial Address",
      pts: inputs.hasCommercialAddress ? 10 : 0,
      max: 10,
    },
    { label: "Business Phone", pts: inputs.hasBusinessPhone ? 5 : 0, max: 5 },
    {
      label: "Business Credit Cards",
      pts:
        inputs.businessCreditCards === "2plus"
          ? 15
          : inputs.businessCreditCards === "1"
            ? 10
            : 0,
      max: 15,
    },
    {
      label: "Google Business Profile",
      pts: inputs.hasGbpVerified ? 10 : 0,
      max: 10,
    },
    { label: "Active Website", pts: inputs.hasActiveWebsite ? 5 : 0, max: 5 },
    { label: "Existing LOC/Loan", pts: inputs.hasExistingLoc ? 5 : 0, max: 5 },
  ];

  const handleShare = useCallback(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Report link copied to clipboard!"));
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="space-y-5">
      {/* Hormozi value stack */}
      <div className="bg-primary/8 border border-primary/20 rounded-xl p-4">
        <p className="text-sm text-foreground font-semibold mb-1 flex items-center gap-2">
          <Trophy size={15} className="text-primary" /> Your Fundability Work
          Has Real Dollar Value
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          A business credit coach charges{" "}
          <span className="text-foreground font-semibold">$2,000–$5,000</span>{" "}
          to help you build to this level. You built it with BRF — and every
          milestone you complete is permanent progress on your business credit
          file, independent of any platform.
        </p>
      </div>

      {/* Report card — light-on-dark "premium document" look */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card print:bg-white">
        {/* Report header */}
        <div className="bg-primary px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-widest">
                Funding Readiness Report
              </p>
              <p className="text-primary-foreground text-xl font-bold mt-1 truncate">
                {businessName || "Your Business"}
              </p>
              <p className="text-primary-foreground/70 text-xs mt-0.5">
                Prepared by Booked Ranked & Fundable · {today}
              </p>
            </div>
            <div className="flex-shrink-0">
              <CircularGauge score={score} animated />
            </div>
          </div>
        </div>

        {/* Report body */}
        <div className="p-5 space-y-5">
          {/* Score tier + copy */}
          <div
            className={`rounded-xl p-4 border ${cfg.badgeClass.replace("text-", "border-").replace("bg-", "bg-")}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${cfg.badgeClass}`}
              >
                {cfg.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {cfg.fundingRange}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {cfg.copy}
            </p>
          </div>

          {/* Score breakdown */}
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
              Score Breakdown
            </h4>
            <div className="space-y-2">
              {scoreBreakdown.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs text-foreground">{row.label}</p>
                      <p
                        className={`text-xs font-bold ${row.pts === row.max ? "text-emerald-400" : row.pts > 0 ? "text-amber-400" : "text-muted-foreground"}`}
                      >
                        {row.pts}/{row.max}
                      </p>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(row.pts / row.max) * 100}%`,
                          background:
                            row.pts === row.max
                              ? "#10b981"
                              : row.pts > 0
                                ? "#f59e0b"
                                : undefined,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-sm text-foreground font-medium">
                Completed Milestones
              </span>
            </div>
            <span className="text-lg font-bold text-foreground">
              {completedMilestones}
            </span>
          </div>

          {/* Funding opportunities */}
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
              Funding Opportunities Unlocked
            </h4>
            <div className="space-y-2">
              {opportunities.map((op) => (
                <div
                  key={op.name}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border"
                >
                  <ArrowUpRight
                    size={14}
                    className="text-primary flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {op.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-primary">
                        {op.amount}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {op.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
              Recommended Next Steps
            </h4>
            <div className="space-y-2">
              {ACTION_PLAN_ITEMS.filter((i) => i.month === 1)
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/20 border border-border"
                  >
                    <ChevronRight
                      size={13}
                      className="text-primary flex-shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-foreground">{item.label}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Report footer */}
        <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            Prepared by Booked Ranked & Fundable · bookedrankedfunded.org ·{" "}
            {today}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              data-ocid="fundability.report.share_button"
              onClick={handleShare}
              className="h-7 text-xs gap-1.5"
            >
              <Share2 size={12} /> Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-ocid="fundability.report.print_button"
              onClick={handlePrint}
              className="h-7 text-xs gap-1.5"
            >
              <Printer size={12} /> Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FundabilityPage() {
  const {
    currentTenantId,
    demoInfo,
    tenants,
    setFundabilityOverride,
    fundabilityOverrides,
  } = useApp();

  // Detect niche from tenant or demo info
  const tenant = tenants.find((t) => t.id === currentTenantId);
  const rawNiche = demoInfo?.niche ?? tenant?.type ?? "default";
  const nicheKey = getNicheKey(rawNiche);
  const businessName =
    demoInfo?.businessName ?? tenant?.name ?? "Your Business";

  // Score inputs — initialized from existing fundability score as a baseline hint
  const baseScore =
    fundabilityOverrides[currentTenantId] ??
    FUNDABILITY_SCORES[currentTenantId] ??
    0;

  const [inputs, setInputs] = useState<ScoreInputs>(() => {
    // Pre-fill based on the demo/existing score as reasonable defaults
    const high = baseScore >= 70;
    const mid = baseScore >= 40;
    return {
      entityType: high ? "llc" : mid ? "llc" : "",
      hasEin: high || mid,
      yearsInBusiness: high ? "gt2" : mid ? "1to2" : "",
      hasBankAccount: high || mid,
      hasCommercialAddress: high,
      hasBusinessPhone: high,
      businessCreditCards: high ? "2plus" : mid ? "1" : "0",
      hasGbpVerified: high,
      hasActiveWebsite: high || mid,
      hasExistingLoc: high,
    };
  });

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("score");

  const liveScore = useMemo(() => calculateFundabilityScore(inputs), [inputs]);

  const handleInputChange = useCallback((patch: Partial<ScoreInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleMilestoneToggle = useCallback(
    (id: string, boost: number) => {
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          toast.info("Milestone unmarked");
        } else {
          next.add(id);
          toast.success(`+${boost} points! Milestone completed 🎉`, {
            duration: 3000,
          });
          // Update fundability override with boosted score
          setFundabilityOverride(
            currentTenantId,
            Math.min(liveScore + boost, 100),
          );
        }
        return next;
      });
    },
    [liveScore, currentTenantId, setFundabilityOverride],
  );

  // Total score including milestone bonuses (capped at 100)
  const milestoneBonus = useMemo(() => {
    return ACTION_PLAN_ITEMS.filter((i) => completedIds.has(i.id)).reduce(
      (sum, i) => sum + i.scoreBoost,
      0,
    );
  }, [completedIds]);

  const displayScore = Math.min(liveScore + milestoneBonus, 100);
  const displayTier = getScoreTier(displayScore);
  const displayCfg = SCORE_TIER_CONFIG[displayTier];

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-foreground leading-tight">
          The Single Most Valuable Thing a Local Business Owner Can Build
        </h1>
        <p className="text-sm text-muted-foreground">
          You've been running your business on personal credit. Every loan,
          every truck, every piece of equipment — all tied to <em>your</em>{" "}
          name. That ends here.
        </p>
      </div>

      {/* Score summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Gauge */}
        <Card className="bg-card border-border sm:col-span-1">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
            <CircularGauge score={displayScore} animated />
            <p className="text-[11px] text-muted-foreground text-center">
              This is your fundability score right now — before BRF works its
              system
            </p>
          </CardContent>
        </Card>

        {/* Summary stats */}
        <Card className="bg-card border-border sm:col-span-2">
          <CardContent className="p-5 space-y-4">
            {/* Tier copy */}
            <div className="rounded-xl p-3.5 border border-border/50 bg-primary/5">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${displayCfg.badgeClass}`}
                >
                  {displayCfg.label}
                </span>
                <Award size={13} className="text-primary/60" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {displayCfg.copy}
              </p>
            </div>

            {/* Funding range */}
            <div className="flex items-center gap-3 bg-primary/8 border border-primary/20 rounded-xl p-3.5">
              <TrendingUp size={18} className="text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Funding Potential Unlocked
                </p>
                <p className="text-base font-bold text-primary">
                  {displayCfg.fundingRange}
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted/30 rounded-xl p-3 border border-border text-center">
                <p className="text-lg font-bold text-foreground">
                  {displayScore}
                </p>
                <p className="text-[10px] text-muted-foreground">Score</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 border border-border text-center">
                <p className="text-lg font-bold text-foreground">
                  {completedIds.size}
                </p>
                <p className="text-[10px] text-muted-foreground">Milestones</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 border border-border text-center">
                <p className="text-lg font-bold text-emerald-400">
                  +{milestoneBonus}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Points Earned
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/40 border border-border h-auto p-1 flex flex-wrap gap-1">
          <TabsTrigger
            value="score"
            data-ocid="fundability.score.tab"
            className="text-xs h-8"
          >
            <Building2 size={12} className="mr-1.5" /> Score Builder
          </TabsTrigger>
          <TabsTrigger
            value="plan"
            data-ocid="fundability.plan.tab"
            className="text-xs h-8"
          >
            <CheckCircle2 size={12} className="mr-1.5" /> 90-Day Plan
            {completedIds.size > 0 && (
              <span className="ml-1.5 bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
                {completedIds.size}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="vendors"
            data-ocid="fundability.vendors.tab"
            className="text-xs h-8"
          >
            <Building2 size={12} className="mr-1.5" /> Vendor Credit
          </TabsTrigger>
          <TabsTrigger
            value="report"
            data-ocid="fundability.report.tab"
            className="text-xs h-8"
          >
            <FileText size={12} className="mr-1.5" /> Funding Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="score" className="mt-4 space-y-4">
          <ScoreInputPanel inputs={inputs} onChange={handleInputChange} />

          {/* Real-time score change indicator */}
          <AnimatePresence>
            {liveScore !== baseScore && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-primary/8 border border-primary/20"
              >
                <Zap size={14} className="text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Your score updated to{" "}
                  <span className="font-bold text-primary">{liveScore}</span>.{" "}
                  {liveScore > baseScore
                    ? `That's +${liveScore - baseScore} points from your profile changes.`
                    : "Keep filling in your profile to unlock more."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA to plan */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            data-ocid="fundability.view_plan.primary_button"
            onClick={() => setActiveTab("plan")}
          >
            <TrendingUp size={14} /> See Your Personalized 90-Day Plan
          </Button>
        </TabsContent>

        <TabsContent value="plan" className="mt-4">
          <ActionPlanTab
            inputs={inputs}
            completed={completedIds}
            onToggle={handleMilestoneToggle}
            score={displayScore}
          />
        </TabsContent>

        <TabsContent value="vendors" className="mt-4">
          <VendorCreditsTab nicheKey={nicheKey} />
        </TabsContent>

        <TabsContent value="report" className="mt-4">
          <FundingReportTab
            score={displayScore}
            inputs={inputs}
            nicheKey={nicheKey}
            businessName={businessName}
            completedMilestones={completedIds.size}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
