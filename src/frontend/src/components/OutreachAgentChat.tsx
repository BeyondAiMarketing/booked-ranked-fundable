import { useState } from "react";
import { routeMasterAgentCall } from "../services/openSourceAdapters";

interface OutreachAgentChatProps {
  creds: any;
}

const COMMANDS = [
  "Find Roofing Leads",
  "Check Uploaded Leads",
  "Search CRM Leads",
  "Search Open Lead Lake",
  "Find Not Enrolled Leads",
  "Prepare Outreach List",
  "Push to Roofing Campaign",
  "Check Integration Status",
];

const SYSTEM_PROMPT =
  "You are the BRF Outreach Intelligence Agent. Help find and prepare roofing leads. Do not make guaranteed funding claims. If live search unavailable say: Live lead search is not connected yet.";

export default function OutreachAgentChat({ creds }: OutreachAgentChatProps) {
  const [messages, setMessages] = useState<
    { id: number; role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isConnected = !!(creds?.openRouterApiKey || creds?.openaiKey);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: text },
    ]);
    setInput("");
    setLoading(true);
    try {
      const response = await routeMasterAgentCall(
        `${SYSTEM_PROMPT}\n\nUser: ${text}`,
        {
          openRouterKey: creds?.openRouterApiKey || "",
          openAIKey: creds?.openaiKey || "",
          geminiApiKey: creds?.geminiApiKey || "",
          nvidiaNimKey: creds?.nvidiaApiKey || "",
        },
      );
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: String(response ?? "No response"),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content:
            "Outreach Agent Brain Not Connected. Please configure an LLM in Integration Health.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 border border-white/10 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Outreach Intelligence Agent
        </h2>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            isConnected
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-orange-500/20 text-orange-400 border-orange-500/30"
          }`}
        >
          {isConnected ? "Connected" : "Needs Setup"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => sendMessage(cmd)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700/60 text-slate-200 border border-white/5 hover:bg-slate-700 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg text-sm ${
              m.role === "user"
                ? "bg-blue-600/20 text-blue-100 border border-blue-500/20 ml-8"
                : "bg-slate-700/40 text-slate-200 border border-white/5 mr-8"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-lg text-sm bg-slate-700/40 text-slate-400 border border-white/5 mr-8">
            Outreach Agent is thinking…
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder="Ask the Outreach Agent to find roofing leads, qualify a market, or prepare a campaign…"
          className="flex-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
          rows={2}
        />
        <button
          type="button"
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Send to Outreach Agent
        </button>
      </div>
    </div>
  );
}
