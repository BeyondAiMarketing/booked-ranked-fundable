import { BarChart2, Bot, ExternalLink, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { AGENT_PRODUCTS } from "../data/agentData";
import {
  DEMO_SEO_GEO_ISSUES,
  DEMO_SEO_GEO_SCORECARDS,
} from "../data/seoGeoData";
import { useAgentWorkflow } from "../hooks/useAgentWorkflow";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent } from "./ui/sheet";
import { Textarea } from "./ui/textarea";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  ts: number;
  runLogged?: boolean;
}

const ADMIN_RESPONSES: Record<string, string[]> = {
  default: [
    "Based on your agency data, 2 clients have declining review velocity this week. North County Plumbing hasn't received a new review in 14 days — I recommend triggering a review request campaign for them.",
    "Overall portfolio health is strong: 4 of 6 clients have SEO scores above 70. The outlier is Oceanside Clean & Restore at 62 — their mobile performance is dragging the score down.",
    "Your highest-value growth opportunity right now is fundability: 3 clients are below 60/100. Getting them to 75+ opens access to $50K–$250K in business credit.",
  ],
  seo: [
    "Across your client portfolio, the most common SEO gaps are: missing Google Business Profile optimization (4 clients), thin page content (3 clients), and slow mobile load times (2 clients). North County Plumbing ranks highest at 78/100.",
    "The top SEO priority for your clients this week: claim and complete Google Business Profiles for any client missing one. It's the single highest-impact, lowest-effort action for local search rankings.",
  ],
  focus: [
    "This week I'd prioritize: (1) Trigger review requests for North County Plumbing — 14 days with no new reviews is too long. (2) Run a fresh audit for Oceanside Clean & Restore. (3) Check that all clients have their Yelp listings verified.",
    "Top 3 actions for maximum agency impact this week: restart the review cadence for inactive clients, update business hours on all Google listings before the weekend, and review the fundability scores for clients approaching loan readiness.",
  ],
  fundability: [
    "Agency-wide fundability snapshot: 2 clients are 'Growth Ready' (75+), 3 are 'In Progress' (50–74), and 1 is 'Foundation Stage' (below 50). The fastest path to improvement for the bottom client is opening a dedicated business checking account and securing a DUNS number.",
    "Fundability is your strongest upsell path. Clients who hit 75+ become eligible for $50K–$250K in business credit — and they attribute that milestone directly to your platform. Push the 3 'In Progress' clients with a targeted outreach this week.",
  ],
  reviews: [
    "Review velocity across your portfolio: Oceanside Clean & Restore averages 4.2 new reviews/month (strong). North County Plumbing averages 0.8/month (needs attention). Recommend doubling their review request frequency to daily for the next 30 days.",
    "Your review health summary: 5 of 6 clients have 4.0+ star averages. The weakest is at 3.7 — that client needs to activate the self-correcting review flow to intercept unhappy customers before they post publicly.",
  ],
};

const CLIENT_RESPONSES: Record<string, string[]> = {
  default: [
    "Your fundability score is 68/100. You're in the 'In Progress' range — solid foundation, but missing a dedicated business credit profile. Adding a Net-30 vendor account this month could push you to 75+ within 60 days.",
    "Good news: your Google reviews are trending up this week with 3 new 5-star reviews. Your review velocity is 4.1/month — above average for your niche. Keep the momentum going with your automated request cadence.",
    "Your SEO audit score improved 6 points since last month. The biggest remaining gap is mobile page speed — your site loads in 4.2 seconds on mobile. Getting that under 2.5 seconds could boost your local ranking noticeably.",
  ],
  agents: [
    "Your SEO Agent completed 3 tasks this week — GBP categories updated, 5 new citations built, and technical crawl errors resolved. I'd recommend approving the GBP photo refresh queued for next steps.",
    "Your Paid Ads Agent has 2 ad variants in A/B testing right now. Early data shows Variant B is outperforming by 18% CTR — expect a recommendation to pause Variant A within 48 hours.",
    "Based on your active agents, here's your growth summary: SEO score +4 this month, 3 new leads from organic search, and your GBP visibility is up 28%. Your next highest-impact move is approving the landing page request in your queue.",
  ],
  seo: [
    "Your current SEO score is 72/100. The three things holding you back: (1) Your Google Business Profile is missing service descriptions — add detailed descriptions for your top 5 services. (2) Your website has no schema markup. (3) You have 14 missing alt tags on images.",
    "To improve your local ranking this week: respond to your 2 unanswered Google reviews, add a FAQ section to your homepage, and make sure your business hours are consistent across Google, Yelp, and Facebook.",
  ],
  focus: [
    "Your top 3 priorities this week: (1) Respond to the 2-star review from last Tuesday — I've drafted a response you can review. (2) Your review request batch for last week's customers hasn't been sent yet. (3) Update your Yelp listing — it's showing your old phone number.",
    "Focus area this week: fundability. You're 7 points away from the 75/100 threshold that unlocks business credit access. The fastest path: open a business credit card and use it for one recurring expense. That single action typically adds 8–12 points.",
  ],
  fundability: [
    "Your fundability score is 68/100. Here's your gap analysis: Business Credit Profile (missing — add 12 points by registering with Dun & Bradstreet), Banking History (partial — add 8 points by maintaining 90 days of positive cash flow), Legal & Compliance (strong at 85/100).",
    "You're 7 points from 'Growth Ready' status (75/100), which opens access to $50K–$250K in business financing. The two fastest actions: get your DUNS number (free, 2 business days) and open a Net-30 vendor account with Uline or Grainger.",
  ],
  reviews: [
    "Your review velocity is 4.1 new reviews per month — solid. Your average rating is 4.7★ across all platforms. One thing to watch: you have 3 reviews with no response on Google. Responding to all reviews (good and bad) improves your local ranking signal.",
    "Review request performance this month: 12 requests sent, 5 reviews posted (42% conversion). That's above average. Tip: requests sent within 2 hours of job completion convert at 2x the rate of next-day sends.",
  ],
};

const QUICK_PROMPTS = [
  { label: "Check my leads", key: "check_leads" },
  { label: "Check my SEO score", key: "seo" },
  { label: "What should I focus on?", key: "focus" },
  { label: "Generate a proposal", key: "generate_proposal" },
  { label: "View Weekly Report", key: "weekly_report" },
];

function getAiResponse(
  key: string,
  isAdminUser: boolean,
  usedIndex: Record<string, number>,
  hasActiveAgents = false,
): string {
  const map = isAdminUser ? ADMIN_RESPONSES : CLIENT_RESPONSES;
  if (
    !isAdminUser &&
    key === "default" &&
    hasActiveAgents &&
    (usedIndex.default ?? 0) < CLIENT_RESPONSES.agents.length
  ) {
    const idx = (usedIndex[key] ?? 0) % CLIENT_RESPONSES.agents.length;
    return CLIENT_RESPONSES.agents[idx];
  }
  const pool = map[key] ?? map.default;
  const idx = (usedIndex[key] ?? 0) % pool.length;
  return pool[idx];
}

export default function AiBusinessManagerPanel() {
  const {
    aiPanelOpen,
    setAiPanelOpen,
    setWeeklyReportOpen,
    isAdminUser,
    agentSubscriptions,
    currentTenantId,
    auditOverrides,
    getThreadForAgent,
    getLeadsByTenant,
    getAuditDataForTenant,
    getActiveAgentsForTenant,
    createThread,
  } = useApp();

  const { executeQuickRun, executeToolRun, getActiveProvider } =
    useAgentWorkflow();
  const activeAgentSubs = agentSubscriptions.filter(
    (s) => s.tenantId === currentTenantId && s.status === "active",
  );

  // Live data for dynamic responses
  const seoScorecard = DEMO_SEO_GEO_SCORECARDS.find(
    (s) => s.tenantId === currentTenantId,
  );
  const openIssueCount = DEMO_SEO_GEO_ISSUES.filter(
    (i) => i.tenantId === currentTenantId && i.status === "open",
  ).length;
  const liveAudit = getAuditDataForTenant(currentTenantId);
  const liveAuditScore =
    auditOverrides[currentTenantId] ?? liveAudit.overallScore;
  const liveSeoScore = seoScorecard?.seoScore ?? liveAuditScore;
  const liveGeoScore = seoScorecard?.geoScore ?? 45;
  const hasSeoAgent = activeAgentSubs.some(
    (s) => s.productId === "agent-seo" || s.productId === "agent-bundle",
  );
  const liveLeads = getLeadsByTenant(currentTenantId);
  const activeAgents = getActiveAgentsForTenant(currentTenantId);

  function getDynamicSeoResponse(): string {
    if (hasSeoAgent) {
      return `Your SEO Agent is active. Current scores: SEO ${liveSeoScore}/100 · GEO ${liveGeoScore}/100. You have ${openIssueCount} open issue${openIssueCount !== 1 ? "s" : ""} in your workspace. ${liveSeoScore < 70 ? "Priority focus: technical SEO and FAQ content for GEO visibility." : "Strong foundation — focus on GEO content opportunities this month."}`;
    }
    return `Your current SEO score is ${liveSeoScore}/100 and GEO score is ${liveGeoScore}/100. You have ${openIssueCount} open issue${openIssueCount !== 1 ? "s" : ""} flagged. ${liveSeoScore < 70 ? "The three main gaps are: GBP optimization, page content depth, and missing schema markup." : "Your SEO foundation is solid. The biggest remaining opportunity is GEO visibility — adding FAQ content to your service pages."}`;
  }

  function getDynamicLeadsResponse(): string {
    if (liveLeads.length === 0) {
      return "No leads found in your CRM yet. Once you start capturing leads via the chat widget, free audit, or manual entry, they'll appear here.";
    }
    const counts = liveLeads.reduce<Record<string, number>>((acc, l) => {
      acc[l.status] = (acc[l.status] ?? 0) + 1;
      return acc;
    }, {});
    const statusBreakdown = Object.entries(counts)
      .map(([s, c]) => `${c} ${s}`)
      .join(", ");
    const newest = liveLeads[0];
    return `Your CRM has ${liveLeads.length} lead${liveLeads.length !== 1 ? "s" : ""}: ${statusBreakdown}. Most recent: ${newest.name} (${newest.source}, ${newest.status}). ${counts.new ? `${counts.new} new lead${counts.new !== 1 ? "s" : ""} need follow-up.` : "All leads have been contacted."}`;
  }

  const getInitialGreeting = () => {
    if (isAdminUser) {
      return "Hello Admin. I'm monitoring your full client portfolio. Ask me anything about your clients' growth metrics, or use a quick prompt below.";
    }
    let greeting =
      "Hi there! I'm your AI Business Manager. I'm tracking your SEO, reviews, fundability, and leads in real time. What would you like to focus on today?";
    if (activeAgentSubs.length > 0) {
      const agentNames = activeAgentSubs.map((s) => {
        const p = AGENT_PRODUCTS.find((prod) => prod.id === s.productId);
        return p?.name ?? s.productId;
      });
      greeting += ` Your ${agentNames.join(" and ")} ${activeAgentSubs.length === 1 ? "is" : "are"} active — I have updates for you.`;
    }
    return greeting;
  };

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "init",
      role: "ai",
      text: getInitialGreeting(),
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [usedIndex, setUsedIndex] = useState<Record<string, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/typing change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Helper: get or create the AI Business Manager thread
  const getOrCreateAiThread = () => {
    const existing = getThreadForAgent(currentTenantId, "AI Business Manager");
    if (existing) return existing;
    return createThread(
      currentTenantId,
      "AI Business Manager",
      "AI Business Manager",
    );
  };

  const sendMessage = (text: string, promptKey = "default") => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const systemPrompt = isAdminUser
      ? "You are an AI Business Manager for a local service agency. Provide concise, actionable growth recommendations based on portfolio data."
      : "You are an AI Business Manager for a local service business. Provide clear, outcome-focused recommendations about SEO, reviews, fundability, and leads.";

    setTimeout(() => {
      const key = promptKey;
      let response: string;
      if (!isAdminUser && key === "seo") {
        response = getDynamicSeoResponse();
      } else if (!isAdminUser && key === "check_leads") {
        response = getDynamicLeadsResponse();
      } else {
        response = getAiResponse(
          key,
          isAdminUser,
          usedIndex,
          activeAgentSubs.length > 0,
        );
      }
      setUsedIndex((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));

      // Route through workflow engine (thread logging)
      const aiThread = getOrCreateAiThread();
      executeQuickRun(
        aiThread.id,
        "AI Business Manager",
        isAdminUser ? "ops" : "support",
        text,
        systemPrompt,
      );

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: response,
        ts: Date.now(),
        runLogged: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1200);
  };

  const handleToolPrompt = (
    toolName: string,
    toolInput: Record<string, unknown>,
    displayResponse: string,
  ) => {
    setTyping(true);
    const aiThread = getOrCreateAiThread();

    setTimeout(() => {
      // Fire the real tool run
      executeToolRun(aiThread.id, toolName, toolInput);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: displayResponse,
        ts: Date.now(),
        runLogged: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1400);
  };

  const handlePrompt = (prompt: { label: string; key: string }) => {
    if (prompt.key === "weekly_report") {
      setAiPanelOpen(false);
      setTimeout(() => setWeeklyReportOpen(true), 200);
      return;
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: prompt.label,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    if (prompt.key === "check_leads") {
      const displayResponse = getDynamicLeadsResponse();
      handleToolPrompt("crm_lookup", {}, displayResponse);
      return;
    }

    if (prompt.key === "generate_proposal") {
      const agentNames = activeAgents.map((a) => a.productId).join(", ");
      const displayResponse = `Generating your proposal now using live SEO data (score: ${liveAuditScore}/100)${activeAgents.length > 0 ? ` and your active agents (${agentNames})` : ""}. The proposal artifact will be saved to your thread history and available for download in the Agent Workflow OS.`;
      handleToolPrompt(
        "proposal_generate",
        {
          services: activeAgents.map((a) => a.productId.replace("agent-", "")),
        },
        displayResponse,
      );
      return;
    }

    sendMessage(prompt.label, prompt.key);
  };

  const handleSend = () => {
    const lower = input.toLowerCase();
    let key = "default";
    if (
      lower.includes("lead") ||
      lower.includes("crm") ||
      lower.includes("contact")
    )
      key = "check_leads";
    else if (
      lower.includes("seo") ||
      lower.includes("rank") ||
      lower.includes("audit")
    )
      key = "seo";
    else if (
      lower.includes("focus") ||
      lower.includes("priorit") ||
      lower.includes("week")
    )
      key = "focus";
    else if (
      lower.includes("fund") ||
      lower.includes("credit") ||
      lower.includes("loan")
    )
      key = "fundability";
    else if (
      lower.includes("review") ||
      lower.includes("rating") ||
      lower.includes("star")
    )
      key = "reviews";
    sendMessage(input, key);
  };

  return (
    <Sheet open={aiPanelOpen} onOpenChange={setAiPanelOpen}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] p-0 bg-gray-900 border-l border-gray-800 flex flex-col"
        data-ocid="ai.panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                AI Business Manager
              </h2>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                Your intelligent growth advisor
                <span className="text-[9px] bg-slate-700/80 text-slate-400 px-1.5 py-0.5 rounded ml-1">
                  {getActiveProvider()}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAiPanelOpen(false)}
            data-ocid="ai.panel.close_button"
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                    <Bot size={13} className="text-white" />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-gray-800 text-gray-100 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "ai" && msg.runLogged && (
                    <div className="flex items-center gap-1.5 mt-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-slate-500">
                        Run logged
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  <Bot size={13} className="text-white" />
                </div>
                <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        <div className="px-4 pb-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
            Quick prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => handlePrompt(p)}
                data-ocid={`ai.panel.${p.key}.button`}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors border ${
                  p.key === "weekly_report"
                    ? "bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-indigo-200 border-indigo-500/40 hover:border-indigo-400 flex items-center gap-1.5"
                    : p.key === "generate_proposal"
                      ? "bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-purple-200 border-purple-500/40 hover:border-purple-400"
                      : "bg-gray-800 hover:bg-indigo-700 text-gray-300 hover:text-white border-gray-700 hover:border-indigo-500"
                }`}
              >
                {p.key === "weekly_report" && <BarChart2 size={10} />}
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-800">
          <div className="flex justify-end mb-2">
            <a
              href="/agent-workflow-os"
              className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-indigo-400 transition-colors"
              data-ocid="ai.panel.view_thread_history"
            >
              <ExternalLink size={10} /> View thread history
            </a>
          </div>
          <div className="flex gap-2">
            <Textarea
              data-ocid="ai.panel.input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything about your business..."
              className="flex-1 min-h-[44px] max-h-[120px] bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 resize-none text-sm focus-visible:ring-indigo-500"
              rows={1}
            />
            <Button
              data-ocid="ai.panel.submit_button"
              onClick={handleSend}
              disabled={!input.trim() || typing}
              size="icon"
              className="bg-indigo-600 hover:bg-indigo-700 shrink-0 h-[44px] w-[44px]"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
