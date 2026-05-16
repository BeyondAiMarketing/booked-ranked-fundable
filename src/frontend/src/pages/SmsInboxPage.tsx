import { useNavigate } from "@tanstack/react-router";
import {
  Archive,
  ChevronLeft,
  ExternalLink,
  MessageSquare,
  Search,
  Send,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import type { SMSMessage, SMSThread } from "../types/sms";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelative(ts: number): string {
  const diffMs = Date.now() - ts;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return new Date(ts).toLocaleDateString("en-US", { weekday: "short" });
  }
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatMsgTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Thread Card ──────────────────────────────────────────────────────────────

function ThreadCard({
  thread,
  lastMessage,
  isSelected,
  onClick,
}: {
  thread: SMSThread;
  lastMessage: SMSMessage | undefined;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid="sms_inbox.thread.item"
      className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors flex items-start gap-3 ${
        isSelected ? "bg-indigo-600/15 border-l-2 border-l-indigo-500" : ""
      }`}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 text-xs font-bold text-white">
        {getInitials(thread.prospectName)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-sm font-semibold text-white truncate">
            {thread.prospectName}
          </span>
          <span className="text-[10px] text-gray-500 shrink-0">
            {formatRelative(thread.lastMessageAt)}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {thread.prospectPhone}
        </p>
        {lastMessage && (
          <p className="text-xs text-gray-400 truncate mt-0.5 leading-relaxed">
            {lastMessage.direction === "outbound" ? "You: " : ""}
            {lastMessage.text}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {thread.linkedLeadId && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              CRM Lead
            </span>
          )}
          {thread.unreadCount > 0 && (
            <span
              data-ocid="sms_inbox.unread_badge"
              className="text-[10px] font-bold w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center"
            >
              {thread.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: SMSMessage }) {
  const isOut = msg.direction === "outbound";
  const statusColor =
    msg.status === "delivered"
      ? "bg-emerald-400"
      : msg.status === "failed"
        ? "bg-red-500"
        : "bg-gray-400";

  return (
    <div className={`flex ${isOut ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[72%] ${isOut ? "items-end" : "items-start"} flex flex-col gap-1`}
      >
        <div
          className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
            isOut
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-white/8 border border-white/10 text-gray-200 rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
        <div
          className={`flex items-center gap-1.5 ${isOut ? "justify-end" : "justify-start"}`}
        >
          <span className="text-[10px] text-gray-500">
            {formatMsgTime(msg.sentAt)}
          </span>
          {isOut && (
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusColor}`}
              title={msg.status}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Conversation View ────────────────────────────────────────────────────────

function ConversationView({
  thread,
  messages,
  onArchive,
  onBack,
}: {
  thread: SMSThread;
  messages: SMSMessage[];
  onArchive: () => void;
  onBack: () => void;
}) {
  const { addSmsMessage } = useApp();
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 160;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = replyText.trim();
    if (!trimmed || trimmed.length > MAX_CHARS) return;
    addSmsMessage(thread.id, thread.tenantId, "outbound", trimmed);
    setReplyText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-gray-900/80 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="md:hidden p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Back to threads"
          data-ocid="sms_inbox.back_button"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {getInitials(thread.prospectName)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {thread.prospectName}
          </p>
          <p className="text-xs text-gray-500">{thread.prospectPhone}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {thread.linkedLeadId && (
            <button
              type="button"
              onClick={() => navigate({ to: "/leads" })}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/10 transition-colors border border-indigo-500/20"
              data-ocid="sms_inbox.view_crm_lead.button"
            >
              <ExternalLink size={12} />
              CRM Lead
            </button>
          )}
          <button
            type="button"
            onClick={onArchive}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Archive conversation"
            data-ocid="sms_inbox.archive.button"
          >
            <Archive size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare size={32} className="text-gray-600 mb-3" />
            <p className="text-sm text-gray-500">No messages yet.</p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply Box */}
      <div className="px-4 py-3 border-t border-white/10 bg-gray-900/60 shrink-0">
        <div className="relative">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            maxLength={MAX_CHARS}
            placeholder="Type a reply... (Enter to send)"
            className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 pr-20"
            data-ocid="sms_inbox.reply.textarea"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <span
              className={`text-[10px] ${
                replyText.length > MAX_CHARS * 0.9
                  ? "text-amber-400"
                  : "text-gray-600"
              }`}
            >
              {replyText.length}/{MAX_CHARS}
            </span>
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSend}
            disabled={!replyText.trim() || replyText.length > MAX_CHARS}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            data-ocid="sms_inbox.send_reply.button"
          >
            <Send size={14} />
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "unread" | "archived";

export default function SmsInboxPage() {
  const {
    currentTenantId,
    getSmsMessagesByThread,
    getUnreadCountByTenant,
    markThreadRead,
    archiveThread,
    smsThreads,
  } = useApp();

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "conversation">("list");

  // All threads for current tenant including archived (for archived tab)
  const allTenantThreads = useMemo(() => {
    const base = smsThreads.filter((t) => t.tenantId === currentTenantId);
    return base.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  }, [smsThreads, currentTenantId]);

  const displayedThreads = useMemo(() => {
    let list = allTenantThreads;
    if (filter === "unread")
      list = list.filter((t) => t.unreadCount > 0 && !t.archived);
    else if (filter === "archived") list = list.filter((t) => t.archived);
    else list = list.filter((t) => !t.archived);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.prospectName.toLowerCase().includes(q) ||
          t.prospectPhone.includes(q),
      );
    }
    return list;
  }, [allTenantThreads, filter, search]);

  const selectedThread =
    allTenantThreads.find((t) => t.id === selectedThreadId) ?? null;
  const selectedMessages = selectedThreadId
    ? getSmsMessagesByThread(selectedThreadId)
    : [];
  const totalUnread = getUnreadCountByTenant(currentTenantId);

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    markThreadRead(threadId);
    setMobileView("conversation");
  };

  const handleArchive = () => {
    if (!selectedThreadId) return;
    archiveThread(selectedThreadId);
    setSelectedThreadId(null);
    setMobileView("list");
  };

  const getLastMessage = (threadId: string) => {
    const msgs = getSmsMessagesByThread(threadId);
    return msgs[msgs.length - 1];
  };

  return (
    <div
      className="flex h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-white/10 bg-gray-900"
      data-ocid="sms_inbox.page"
    >
      {/* Left Panel — Thread List */}
      <div
        className={`w-full md:w-[380px] md:flex flex-col flex-shrink-0 border-r border-white/10 ${
          mobileView === "conversation" ? "hidden" : "flex"
        }`}
      >
        {/* Panel Header */}
        <div className="px-4 pt-4 pb-3 border-b border-white/10 bg-gray-900/80">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-bold text-white flex-1">SMS Inbox</h2>
            {totalUnread > 0 && (
              <span
                data-ocid="sms_inbox.total_unread.badge"
                className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-bold"
              >
                {totalUnread}
              </span>
            )}
          </div>
          {/* Search */}
          <div className="relative mb-3">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or phone..."
              className="w-full bg-gray-800 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              data-ocid="sms_inbox.search_input"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
          {/* Filter Tabs */}
          <div className="flex gap-1" data-ocid="sms_inbox.filter.tab">
            {(["all", "unread", "archived"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  filter === tab
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                data-ocid={`sms_inbox.filter_${tab}.tab`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          {displayedThreads.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
              data-ocid="sms_inbox.empty_state"
            >
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                <MessageSquare size={22} className="text-gray-600" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                No conversations yet
              </p>
              <p className="text-xs text-gray-500">
                SMS threads from missed calls will appear here.
              </p>
            </div>
          ) : (
            displayedThreads.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                lastMessage={getLastMessage(thread.id)}
                isSelected={selectedThreadId === thread.id}
                onClick={() => handleSelectThread(thread.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Panel — Conversation */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${
          mobileView === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedThread ? (
          <ConversationView
            thread={selectedThread}
            messages={selectedMessages}
            onArchive={handleArchive}
            onBack={() => setMobileView("list")}
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center flex-1 text-center px-8"
            data-ocid="sms_inbox.no_selection.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-gray-800/80 flex items-center justify-center mb-4">
              <MessageSquare size={28} className="text-gray-600" />
            </div>
            <p className="text-base font-semibold text-white mb-2">
              Select a conversation
            </p>
            <p className="text-sm text-gray-500 max-w-xs">
              Choose a thread from the left panel to view and reply to messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
