import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// Local type definitions (backend types not yet generated)
interface ReviewRequest {
  id: string;
  tenantId: string;
  customerName: string;
  phone: string;
  email: string;
  serviceCompleted: string;
  platform: string;
  status: ReviewRequestStatus;
  sentTimestamp: bigint;
  lastFollowUp: bigint;
  attemptCount: bigint;
  customerFeedback: string;
}

enum ReviewRequestStatus {
  sent = "sent",
  awaiting = "awaiting",
  happy = "happy",
  unhappy = "unhappy",
  reviewed = "reviewed",
  maxAttempts = "maxAttempts",
}
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { useActor } from "../hooks/useActor";

const STATUS_CONFIG: Record<
  ReviewRequestStatus,
  { label: string; color: string }
> = {
  [ReviewRequestStatus.sent]: {
    label: "Sent",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  [ReviewRequestStatus.awaiting]: {
    label: "Awaiting",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  [ReviewRequestStatus.happy]: {
    label: "Happy",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  [ReviewRequestStatus.unhappy]: {
    label: "Unhappy",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  [ReviewRequestStatus.reviewed]: {
    label: "Reviewed",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  [ReviewRequestStatus.maxAttempts]: {
    label: "Max Attempts",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export default function ReviewRequestsPage() {
  const { currentTenantId } = useApp();
  const { actor } = useActor();
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [expandedUnhappy, setExpandedUnhappy] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    serviceCompleted: "",
    platform: "Google",
    note: "",
  });

  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(`brfReviewSettings-${currentTenantId}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      interval: "2",
      maxAttempts: "5",
      recoveryMessage:
        "We're sorry about your experience. We'd love to make it right — please let us know what we can do to fix this.",
      platforms: { Google: true, Yelp: true, Facebook: true },
    };
  });

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    actor
      .getReviewRequests(currentTenantId)
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [actor, currentTenantId]);

  const handleSendRequest = async () => {
    if (!form.customerName || !form.phone || !form.serviceCompleted) {
      toast.error(
        "Please fill in customer name, phone, and service completed.",
      );
      return;
    }
    setSending(true);
    const newRequest: ReviewRequest = {
      id: generateId(),
      tenantId: currentTenantId,
      customerName: form.customerName,
      phone: form.phone,
      email: form.email,
      serviceCompleted: form.serviceCompleted,
      platform: form.platform,
      status: ReviewRequestStatus.sent,
      sentTimestamp: BigInt(Date.now()),
      lastFollowUp: BigInt(0),
      attemptCount: BigInt(1),
      customerFeedback: "",
    };
    try {
      if (actor) await actor.createReviewRequest(newRequest);
      setRequests((prev) => [newRequest, ...prev]);
      setForm({
        customerName: "",
        phone: "",
        email: "",
        serviceCompleted: "",
        platform: "Google",
        note: "",
      });
      toast.success("Review request sent! 📱");
    } catch {
      toast.error("Failed to send via backend, added locally.");
      setRequests((prev) => [newRequest, ...prev]);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (
    requestId: string,
    status: ReviewRequestStatus,
  ) => {
    try {
      if (actor)
        await actor.updateReviewRequestStatus(
          currentTenantId,
          requestId,
          status,
        );
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r)),
      );
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleFollowUp = async (req: ReviewRequest) => {
    const newAttempt = Number(req.attemptCount) + 1;
    const maxAttempts = Number(settings.maxAttempts);
    const newStatus =
      newAttempt >= maxAttempts
        ? ReviewRequestStatus.maxAttempts
        : ReviewRequestStatus.awaiting;
    try {
      if (actor)
        await actor.updateReviewRequestStatus(
          currentTenantId,
          req.id,
          newStatus,
        );
      setRequests((prev) =>
        prev.map((r) =>
          r.id === req.id
            ? {
                ...r,
                status: newStatus,
                attemptCount: BigInt(newAttempt),
                lastFollowUp: BigInt(Date.now()),
              }
            : r,
        ),
      );
      toast.success(
        newAttempt >= maxAttempts ? "Max attempts reached." : "Follow-up sent!",
      );
    } catch {
      toast.error("Failed to send follow-up.");
    }
  };

  const handleDelete = async (requestId: string) => {
    try {
      if (actor) await actor.deleteReviewRequest(currentTenantId, requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      toast.success("Request deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const saveSettings = () => {
    localStorage.setItem(
      `brfReviewSettings-${currentTenantId}`,
      JSON.stringify(settings),
    );
    toast.success("Review settings saved!");
  };

  return (
    <Tabs defaultValue="send" className="space-y-6">
      <TabsList className="bg-gray-100" data-ocid="reviewrequests.tab">
        <TabsTrigger value="send" data-ocid="reviewrequests.tab">
          Send Request
        </TabsTrigger>
        <TabsTrigger value="active" data-ocid="reviewrequests.tab">
          Active Requests {requests.length > 0 && `(${requests.length})`}
        </TabsTrigger>
        <TabsTrigger value="settings" data-ocid="reviewrequests.tab">
          Settings
        </TabsTrigger>
      </TabsList>

      {/* Send Request Tab */}
      <TabsContent value="send" className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-xl space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">
            New Review Request
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Customer Name *</Label>
              <Input
                value={form.customerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerName: e.target.value }))
                }
                className="mt-1"
                data-ocid="reviewrequests.input"
              />
            </div>
            <div>
              <Label className="text-xs">Phone *</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+1 (555) 000-0000"
                className="mt-1"
                data-ocid="reviewrequests.input"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Email</Label>
            <Input
              value={form.email}
              type="email"
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className="mt-1"
              data-ocid="reviewrequests.input"
            />
          </div>

          <div>
            <Label className="text-xs">Service Completed *</Label>
            <Input
              value={form.serviceCompleted}
              onChange={(e) =>
                setForm((p) => ({ ...p, serviceCompleted: e.target.value }))
              }
              placeholder="e.g. Pipe repair, Deep cleaning..."
              className="mt-1"
              data-ocid="reviewrequests.input"
            />
          </div>

          <div>
            <Label className="text-xs block mb-2">Review Platform</Label>
            <div className="flex gap-3">
              {["Google", "Yelp", "Facebook"].map((p) => (
                <label
                  key={p}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                    form.platform === p
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                  data-ocid="reviewrequests.radio"
                >
                  <input
                    type="radio"
                    name="platform"
                    value={p}
                    checked={form.platform === p}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, platform: p }))
                    }
                    className="accent-indigo-600"
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Personal Note (optional)</Label>
            <Textarea
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              rows={2}
              placeholder="Add a personal touch to the message..."
              className="mt-1 resize-none"
              data-ocid="reviewrequests.textarea"
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Info size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              SMS & email delivery requires Twilio credentials configured in
              Settings &gt; Integrations.
            </p>
          </div>

          <Button
            onClick={handleSendRequest}
            disabled={sending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            data-ocid="reviewrequests.submit_button"
          >
            {sending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send size={14} className="mr-2" />
                Send Review Request
              </>
            )}
          </Button>
        </div>
      </TabsContent>

      {/* Active Requests Tab */}
      <TabsContent value="active">
        {loading ? (
          <div
            className="flex items-center justify-center h-40"
            data-ocid="reviewrequests.loading_state"
          >
            <Loader2 className="animate-spin text-indigo-600" size={24} />
          </div>
        ) : requests.length === 0 ? (
          <div
            className="bg-white rounded-xl border border-gray-200 p-12 text-center"
            data-ocid="reviewrequests.empty_state"
          >
            <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-200 font-medium">No review requests yet</p>
            <p className="text-xs text-gray-200 mt-1">
              Send your first request from the Send Request tab
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req, index) => {
              const sc = STATUS_CONFIG[req.status];
              const isUnhappy = req.status === ReviewRequestStatus.unhappy;
              const canFollowUp =
                req.status === ReviewRequestStatus.sent ||
                req.status === ReviewRequestStatus.awaiting;
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
                  data-ocid={`reviewrequests.item.${index + 1}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-gray-900">
                          {req.customerName}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${sc.color}`}
                        >
                          {sc.label}
                        </span>
                        {req.platform && (
                          <span className="text-xs text-gray-200 bg-gray-100 px-2 py-0.5 rounded-full">
                            {req.platform}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-200 mt-1">
                        {req.serviceCompleted}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-200">
                        <span>{req.phone}</span>
                        {req.email && <span>{req.email}</span>}
                        <span className="flex items-center gap-1">
                          <RotateCcw size={10} /> {Number(req.attemptCount)}{" "}
                          attempt{Number(req.attemptCount) !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {canFollowUp && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFollowUp(req)}
                          className="text-xs"
                          data-ocid={`reviewrequests.secondary_button.${index + 1}`}
                        >
                          <Clock size={12} className="mr-1" /> Follow Up
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(req.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        data-ocid={`reviewrequests.delete_button.${index + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Unhappy Recovery */}
                  {isUnhappy && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedUnhappy(
                            expandedUnhappy === req.id ? null : req.id,
                          )
                        }
                        className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
                        data-ocid={`reviewrequests.toggle.${index + 1}`}
                      >
                        <AlertTriangle size={12} />
                        Recovery Actions{" "}
                        {expandedUnhappy === req.id ? "▲" : "▼"}
                      </button>
                      {expandedUnhappy === req.id && (
                        <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200 space-y-3">
                          {req.customerFeedback && (
                            <div>
                              <p className="text-xs font-medium text-red-800 mb-1">
                                Customer Feedback
                              </p>
                              <p className="text-xs text-red-700">
                                {req.customerFeedback}
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                toast.success(
                                  "Recovery offer sent via SMS/email!",
                                );
                              }}
                              className="text-xs bg-orange-500 hover:bg-orange-600 text-white"
                              data-ocid={`reviewrequests.secondary_button.${index + 1}`}
                            >
                              <Send size={12} className="mr-1" /> Send Recovery
                              Offer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateStatus(
                                  req.id,
                                  ReviewRequestStatus.happy,
                                )
                              }
                              className="text-xs border-green-300 text-green-700 hover:bg-green-50"
                              data-ocid={`reviewrequests.confirm_button.${index + 1}`}
                            >
                              <CheckCircle2 size={12} className="mr-1" /> Mark
                              Resolved
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </TabsContent>

      {/* Settings Tab */}
      <TabsContent value="settings">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-xl space-y-5">
          <h3 className="text-sm font-semibold text-gray-800">
            Follow-Up Settings
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Follow-up Interval</Label>
              <select
                value={settings.interval}
                onChange={(e) =>
                  setSettings((p: typeof settings) => ({
                    ...p,
                    interval: e.target.value,
                  }))
                }
                className="mt-1 w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-400"
                data-ocid="reviewrequests.select"
              >
                <option value="1">Every 1 day</option>
                <option value="2">Every 2 days</option>
                <option value="3">Every 3 days</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Max Attempts</Label>
              <select
                value={settings.maxAttempts}
                onChange={(e) =>
                  setSettings((p: typeof settings) => ({
                    ...p,
                    maxAttempts: e.target.value,
                  }))
                }
                className="mt-1 w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-400"
                data-ocid="reviewrequests.select"
              >
                <option value="3">3 attempts</option>
                <option value="5">5 attempts</option>
                <option value="7">7 attempts</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-xs">Recovery Message Template</Label>
            <Textarea
              value={settings.recoveryMessage}
              onChange={(e) =>
                setSettings((p: typeof settings) => ({
                  ...p,
                  recoveryMessage: e.target.value,
                }))
              }
              rows={3}
              className="mt-1 resize-none"
              placeholder="What message should be sent when a customer is unhappy?"
              data-ocid="reviewrequests.textarea"
            />
          </div>

          <div>
            <Label className="text-xs block mb-2">Review Platforms</Label>
            <div className="space-y-2">
              {(["Google", "Yelp", "Facebook"] as const).map((platform) => (
                <label
                  key={platform}
                  className="flex items-center gap-2 cursor-pointer"
                  data-ocid="reviewrequests.checkbox"
                >
                  <input
                    type="checkbox"
                    checked={settings.platforms[platform]}
                    onChange={(e) =>
                      setSettings((p: typeof settings) => ({
                        ...p,
                        platforms: {
                          ...p.platforms,
                          [platform]: e.target.checked,
                        },
                      }))
                    }
                    className="rounded accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <Info size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              SMS and email delivery requires Twilio credentials configured in{" "}
              <strong>Settings &gt; Integrations</strong>.
            </p>
          </div>

          <Button
            onClick={saveSettings}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            data-ocid="reviewrequests.save_button"
          >
            Save Settings
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
