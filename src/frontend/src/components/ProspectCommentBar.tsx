import { CheckCircle2, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProspectComment {
  id: string;
  text: string;
  timestamp: string;
  approved: boolean;
}

export interface ProspectCommentBarProps {
  linkId: string;
  /** Callback when a comment is submitted */
  onComment: (linkId: string, comment: ProspectComment) => void;
  /** Callback when the prospect approves the design */
  onApprove: (linkId: string) => void;
  /** Whether this prospect already approved */
  isApproved?: boolean;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProspectCommentBar({
  linkId,
  onComment,
  onApprove,
  isApproved = false,
}: ProspectCommentBarProps) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [approved, setApproved] = useState(isApproved);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const comment: ProspectComment = {
      id: `comment-${Date.now()}`,
      text: trimmed,
      timestamp: new Date().toISOString(),
      approved: false,
    };
    onComment(linkId, comment);
    setText("");
    setSubmitted(true);
    toast.success("Comment sent to your account manager");
  }

  function handleApprove() {
    setApproved(true);
    onApprove(linkId);
    toast.success("Design approved! Your account manager has been notified.", {
      duration: 5000,
    });
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      data-ocid="prospect_comment_bar"
      style={{
        background:
          "linear-gradient(0deg, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.92) 100%)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Label */}
        <div className="flex items-center gap-1.5 shrink-0">
          <MessageSquare size={14} className="text-indigo-400" />
          <span className="text-xs font-semibold text-white hidden sm:block">
            Leave feedback
          </span>
        </div>

        {/* Input */}
        {!submitted ? (
          <input
            className="flex-1 text-sm bg-white/6 border border-white/12 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
            placeholder="What do you think? Add a comment for your account manager…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            maxLength={500}
            data-ocid="prospect_comment_bar.input"
          />
        ) : (
          <div className="flex-1 text-xs text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            Comment sent! Your account manager will follow up.
            <button
              type="button"
              className="text-slate-400 hover:text-white ml-2 underline"
              onClick={() => setSubmitted(false)}
            >
              Add another
            </button>
          </div>
        )}

        {/* Send button */}
        {!submitted && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 border-white/10 text-slate-300 hover:text-white hover:bg-white/8 shrink-0"
            onClick={handleSubmit}
            disabled={!text.trim()}
            data-ocid="prospect_comment_bar.submit_button"
          >
            <Send size={12} className="mr-1" />
            Send
          </Button>
        )}

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 shrink-0" />

        {/* Approve button */}
        {!approved ? (
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold h-8 px-4 shrink-0"
            onClick={handleApprove}
            data-ocid="prospect_comment_bar.approve_button"
          >
            <CheckCircle2 size={13} className="mr-1.5" />
            <span className="hidden sm:inline">Approve Design</span>
            <span className="sm:hidden">Approve</span>
          </Button>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold shrink-0">
            <CheckCircle2 size={15} />
            <span className="hidden sm:inline">Design Approved</span>
          </div>
        )}
      </div>
    </div>
  );
}
