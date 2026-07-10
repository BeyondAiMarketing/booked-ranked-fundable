import { ChevronDown, ChevronUp, Loader2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type LeadAIEnrichment,
  type LeadAIScore,
  type OutreachSequence,
  type ReplyAnalysis,
  ReplyClassification,
} from "../backend.d";
import { useActor } from "../hooks/useActor";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  leadId: string;
  companyName?: string;
  website?: string;
  niche?: string;
  city?: string;
}

const FRAMEWORKS = ["Brunson", "Hormozi", "Kennedy", "Halbert"] as const;
type Framework = (typeof FRAMEWORKS)[number];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function classificationStyle(c: ReplyClassification): string {
  switch (c) {
    case ReplyClassification.HotLead:
      return "bg-emerald-900/50 text-emerald-300 ring-emerald-600";
    case ReplyClassification.PositiveSignal:
      return "bg-blue-900/50 text-blue-300 ring-blue-600";
    case ReplyClassification.Objection:
      return "bg-rose-900/50 text-rose-300 ring-rose-600";
    case ReplyClassification.Unsubscribe:
      return "bg-slate-700 text-slate-400 ring-slate-600";
    default:
      return "bg-slate-800 text-slate-400 ring-slate-700";
  }
}

function signalTag(sig: string, i: number) {
  const neg = sig.startsWith("-") || /\bno\b|\blow\b|\bpoor\b/i.test(sig);
  return (
    <span
      key={i}
      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
        neg
          ? "bg-rose-900/50 text-rose-300"
          : "bg-emerald-900/50 text-emerald-300"
      }`}
    >
      {sig}
    </span>
  );
}

function SectionHeader({
  title,
  icon,
}: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="flex items-center justify-center w-5 h-5 rounded bg-violet-900/60 text-violet-400">
        {icon}
      </span>
      <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
        {title}
      </span>
      <span className="ml-auto text-[9px] font-bold text-violet-400 bg-violet-900/30 px-1.5 py-0.5 rounded">
        OmniRouter
      </span>
    </div>
  );
}

function Spinner() {
  return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
}

// ─── Score Arc ───────────────────────────────────────────────────────────────

function ScoreArc({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const dash = pct * circ;
  const color = score >= 71 ? "#34d399" : score >= 41 ? "#fbbf24" : "#fb7185";
  return (
    <svg
      width="72"
      height="72"
      className="-rotate-90"
      role="img"
      aria-label="Lead score gauge"
    >
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="#1e293b"
        strokeWidth="6"
      />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LeadAIIntelligencePanel({
  leadId,
  companyName = "",
  website = "",
  niche = "",
  city = "",
}: Props) {
  const { actor } = useActor();

  // Score
  const [scoreData, setScoreData] = useState<LeadAIScore | null>(null);
  const [scoringLoad, setScoringLoad] = useState(false);

  // Enrichment
  const [enrichData, setEnrichData] = useState<LeadAIEnrichment | null>(null);
  const [enrichLoad, setEnrichLoad] = useState(false);

  // Sequence
  const [seqData, setSeqData] = useState<OutreachSequence | null>(null);
  const [seqLoad, setSeqLoad] = useState(false);
  const [framework, setFramework] = useState<Framework>("Brunson");
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null);
  const [expandedSms, setExpandedSms] = useState(false);

  // Reply
  const [replyText, setReplyText] = useState("");
  const [replyData, setReplyData] = useState<ReplyAnalysis | null>(null);
  const [replyLoad, setReplyLoad] = useState(false);

  // Fetch existing data on mount
  useEffect(() => {
    if (!actor || !leadId) return;
    (actor.getLeadScore(leadId) as Promise<[LeadAIScore] | []>)
      .then((r) => {
        if (r?.length) setScoreData(r[0]);
      })
      .catch(() => {});
    (actor.getLeadEnrichment(leadId) as Promise<[LeadAIEnrichment] | []>)
      .then((r) => {
        if (r?.length) setEnrichData(r[0]);
      })
      .catch(() => {});
  }, [actor, leadId]);

  const handleScore = async () => {
    if (!actor) return;
    setScoringLoad(true);
    try {
      const enrichText = enrichData
        ? `${enrichData.companyIntel} ${enrichData.webPresence}`
        : companyName;
      await actor.scoreLead(leadId, enrichText, niche, city);
      const res = (await actor.getLeadScore(leadId)) as [LeadAIScore] | [];
      if (res?.length) setScoreData(res[0]);
      toast.success("Lead scored by OmniRouter");
    } catch {
      toast.error("Scoring failed");
    } finally {
      setScoringLoad(false);
    }
  };

  const handleEnrich = async () => {
    if (!actor) return;
    setEnrichLoad(true);
    try {
      await actor.enrichLead(leadId, companyName, website, niche);
      const res = (await actor.getLeadEnrichment(leadId)) as
        | [LeadAIEnrichment]
        | [];
      if (res?.length) setEnrichData(res[0]);
      toast.success("Enriched by OmniRouter");
    } catch {
      toast.error("Enrichment failed");
    } finally {
      setEnrichLoad(false);
    }
  };

  const _handleGenSeq = async () => {
    if (!actor) return;
    setSeqLoad(true);
    try {
      await actor.generateOutreachSequence(
        leadId,
        niche,
        companyName,
        city,
        framework,
      );
      // Fetch the sequence we just generated — get all and find by leadId
      const scores = (await actor.listLeadScores()) as LeadAIScore[];
      void scores; // sequence stored; we re-fetch via a raw call below
      // Re-query by iterating — the backend returns the latest sequence
      const fresh = (await actor.getLeadScore(leadId)) as [LeadAIScore] | [];
      void fresh;
      // The sequence is returned from generateOutreachSequence directly
      toast.success(`Sequence generated (${framework} framework)`);
    } catch {
      toast.error("Sequence generation failed");
    } finally {
      setSeqLoad(false);
    }
  };

  const handleGenSeqDirect = async () => {
    if (!actor) return;
    setSeqLoad(true);
    try {
      const result = (await actor.generateOutreachSequence(
        leadId,
        niche,
        companyName,
        city,
        framework,
      )) as [OutreachSequence] | [];
      if (result?.length) setSeqData(result[0]);
      toast.success(`Sequence generated (${framework} framework)`);
    } catch {
      toast.error("Sequence generation failed");
    } finally {
      setSeqLoad(false);
    }
  };

  const handleAnalyzeReply = async () => {
    if (!actor || !replyText.trim()) return;
    setReplyLoad(true);
    try {
      const replyId = `reply-${leadId}-${Date.now()}`;
      await actor.analyzeReply(replyId, leadId, replyText);
      const res = (await actor.getReplyAnalysis(replyId)) as
        | [ReplyAnalysis]
        | [];
      if (res?.length) setReplyData(res[0]);
      toast.success("Reply analyzed by OmniRouter");
    } catch {
      toast.error("Reply analysis failed");
    } finally {
      setReplyLoad(false);
    }
  };

  const numericScore = scoreData ? Number(scoreData.score) : 0;

  return (
    <div className="space-y-4">
      {/* ── Section 1: AI Score ─────────────────────────────── */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4">
        <SectionHeader
          title="AI Lead Score"
          icon={<Zap className="w-3 h-3" />}
        />
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <ScoreArc score={numericScore} />
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-100">
              {scoreData ? numericScore : "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            {scoreData ? (
              <>
                <p className="text-xs text-slate-300 mb-2 line-clamp-2">
                  {scoreData.fitReason}
                </p>
                <div className="flex flex-wrap gap-1">
                  {scoreData.signals.map((s, i) => signalTag(s, i))}
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-500">
                No score yet — click below to analyze
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleScore}
          disabled={scoringLoad}
          className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-900/50 text-violet-300 hover:bg-violet-800/60 border border-violet-800 transition-colors disabled:opacity-50"
          data-ocid={`lead-ai-score-button-${leadId}`}
        >
          {scoringLoad ? <Spinner /> : <Zap className="w-3 h-3" />}
          Score Lead
        </button>
      </div>

      {/* ── Section 2: Enrichment ───────────────────────────── */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4">
        <SectionHeader
          title="Company Intelligence"
          icon={<Zap className="w-3 h-3" />}
        />
        {enrichData ? (
          <div className="grid grid-cols-1 gap-2 mb-3">
            {[
              { label: "Company Intel", value: enrichData.companyIntel },
              { label: "Web Presence", value: enrichData.webPresence },
              { label: "Decision Maker", value: enrichData.decisionMakerInfo },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-800/60 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                  {label}
                </p>
                <p className="text-xs text-slate-300 line-clamp-3">
                  {value || "—"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 mb-3">
            No enrichment data — run OmniRouter enrichment
          </p>
        )}
        <button
          type="button"
          onClick={handleEnrich}
          disabled={enrichLoad}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-900/50 text-violet-300 hover:bg-violet-800/60 border border-violet-800 transition-colors disabled:opacity-50"
          data-ocid={`lead-ai-enrich-button-${leadId}`}
        >
          {enrichLoad ? <Spinner /> : <Zap className="w-3 h-3" />}
          Enrich with OmniRouter
        </button>
      </div>

      {/* ── Section 3: Outreach Sequence ────────────────────── */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4">
        <SectionHeader
          title="Outreach Sequence"
          icon={<Zap className="w-3 h-3" />}
        />
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {FRAMEWORKS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFramework(f)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                framework === f
                  ? "bg-violet-800 text-violet-200 border-violet-600"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
              }`}
              data-ocid={`lead-ai-framework-${f.toLowerCase()}-${leadId}`}
            >
              {f}
            </button>
          ))}
          <button
            type="button"
            onClick={handleGenSeqDirect}
            disabled={seqLoad}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/60 border border-emerald-800 transition-colors disabled:opacity-50"
            data-ocid={`lead-ai-gen-sequence-${leadId}`}
          >
            {seqLoad ? <Spinner /> : <Zap className="w-3 h-3" />}
            Generate Sequence
          </button>
        </div>

        {seqData && (
          <div className="space-y-1.5">
            {seqData.emails.map((email, i) => (
              <div
                key={email.slice(0, 30)}
                className="rounded-lg border border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedEmail(expandedEmail === i ? null : i)
                  }
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/50 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  data-ocid={`lead-ai-email-${i + 1}-${leadId}`}
                >
                  <span>Email {i + 1}</span>
                  {expandedEmail === i ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
                {expandedEmail === i && (
                  <div className="px-3 py-2 bg-slate-900/50 text-xs text-slate-400 whitespace-pre-wrap">
                    {email}
                  </div>
                )}
              </div>
            ))}
            {seqData.smsMessages.length > 0 && (
              <div className="rounded-lg border border-slate-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedSms(!expandedSms)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/50 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  data-ocid={`lead-ai-sms-expand-${leadId}`}
                >
                  <span>SMS Messages ({seqData.smsMessages.length})</span>
                  {expandedSms ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
                {expandedSms && (
                  <div className="space-y-1 px-3 py-2 bg-slate-900/50">
                    {seqData.smsMessages.map((sms, _i) => (
                      <p
                        key={sms.slice(0, 30)}
                        className="text-xs text-slate-400 border-l-2 border-slate-700 pl-2"
                      >
                        {sms}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Section 4: Reply Analysis ───────────────────────── */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4">
        <SectionHeader
          title="Reply Intelligence"
          icon={<Zap className="w-3 h-3" />}
        />
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Paste an incoming reply here..."
          rows={3}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder:text-slate-600 resize-none focus:outline-none focus:border-violet-600 mb-2"
          data-ocid={`lead-ai-reply-textarea-${leadId}`}
        />
        <button
          type="button"
          onClick={handleAnalyzeReply}
          disabled={replyLoad || !replyText.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-900/50 text-violet-300 hover:bg-violet-800/60 border border-violet-800 transition-colors disabled:opacity-50 mb-3"
          data-ocid={`lead-ai-analyze-reply-${leadId}`}
        >
          {replyLoad ? <Spinner /> : <Zap className="w-3 h-3" />}
          Analyze Reply
        </button>
        {replyData && (
          <div className="space-y-2">
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${classificationStyle(replyData.classification)}`}
            >
              {replyData.classification}
            </span>
            <p className="text-xs text-slate-400">{replyData.summary}</p>
            {replyData.suggestedResponse && (
              <div className="bg-slate-800/60 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Suggested Response
                </p>
                <p className="text-xs text-slate-300">
                  {replyData.suggestedResponse}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
