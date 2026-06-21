import React, { useState, useEffect } from "react";

import { useBusinessBrief } from "../hooks/useBusinessBrief";

import { useVerticalProfile } from "../hooks/useVerticalProfile";

import { useWorkflowLog } from "../hooks/useWorkflowLog";

import { useApprovalRequest } from "../hooks/useApprovalRequest";

import type { WorkflowLog } from "../types/socialContent";

export default function ContentOrchestratorPage() {
  const { brief, loading: _briefLoading } = useBusinessBrief();
  const { profile, loading: _profileLoading } = useVerticalProfile();
  const { logs, loading: _logsLoading } = useWorkflowLog();
  const { pending: _pending, createRequest } = useApprovalRequest();
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [handoffVerified, setHandoffVerified] = useState<
    Record<string, boolean>
  >({});

  const workflows = [
    {
      id: "brand-onboarding",
      name: "Brand Onboarding",
      status: brief?.brandVoice ? "completed" : "pending",
      requires: [] as string[],
      produces: ["brandVoice", "targetAudience", "services"],
    },
    {
      id: "content-calendar",
      name: "Content Calendar",
      status: brief?.brandVoice && profile ? "pending" : "blocked",
      requires: ["brand-onboarding"],
      produces: ["calendarEntries"],
    },
    {
      id: "platform-content",
      name: "Platform Content",
      status: brief?.brandVoice && profile ? "pending" : "blocked",
      requires: ["brand-onboarding", "content-calendar"],
      produces: ["postDrafts"],
    },
    {
      id: "performance-review",
      name: "Performance Review",
      status: brief?.brandVoice ? "pending" : "blocked",
      requires: ["platform-content"],
      produces: ["insights", "nextMonthStrategy"],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500";
      case "running":
        return "bg-blue-500";
      case "failed":
        return "bg-rose-500";
      case "paused":
        return "bg-gray-500";
      case "blocked":
        return "bg-amber-500";
      default:
        return "bg-yellow-500";
    }
  };

  const isWorkflowAvailable = (wf: (typeof workflows)[0]) => {
    if (wf.requires.length === 0) return true;
    return wf.requires.every((reqId) => {
      const reqWf = workflows.find((w) => w.id === reqId);
      return reqWf?.status === "completed" || handoffVerified[reqId];
    });
  };

  const handleVerifyHandoff = (workflowId: string) => {
    setHandoffVerified((prev) => ({ ...prev, [workflowId]: true }));
  };

  const handlePushToApproval = async () => {
    if (selectedWorkflow) {
      await createRequest({
        workflowId: selectedWorkflow,
        agentId: "content-orchestrator",
        itemType: "workflow",
        itemId: selectedWorkflow,
        status: "pending",
        requestedBy: "admin",
      });
    }
  };

  const hasContext = brief?.brandVoice && profile;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-3xl font-bold mb-2"
          data-ocid="content_orchestrator.page"
        >
          Content Orchestrator Agent
        </h1>
        <p className="text-muted-foreground mb-8">
          Check context, route workflow, prevent out-of-order work, resume
          mid-workflow, push drafts to approval
        </p>

        {!hasContext && (
          <div
            className="bg-amber-950/30 border border-amber-500/40 rounded-lg p-4 mb-6"
            data-ocid="content_orchestrator.missing_context"
          >
            <p className="text-amber-200 font-semibold">Missing Context</p>
            <p className="text-amber-300/80 text-sm">
              Complete brand onboarding first before creating content calendars.
              Do not create calendar without brand context.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Context Check</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand Voice</span>
                <span
                  className={
                    brief?.brandVoice ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {brief?.brandVoice ? "Configured" : "Missing"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Audience</span>
                <span
                  className={
                    brief?.targetAudience?.length
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                >
                  {brief?.targetAudience?.length
                    ? `${brief.targetAudience.length} segments`
                    : "Missing"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Niche</span>
                <span
                  className={
                    profile?.niche ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {profile?.niche || "Missing"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vertical Profile</span>
                <span
                  className={
                    profile?.name ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {profile?.name || "Missing"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Workflow Status</h2>
            <div className="space-y-3">
              {workflows.map((wf) => {
                const available = isWorkflowAvailable(wf);
                return (
                  <button
                    key={wf.id}
                    type="button"
                    disabled={!available}
                    className={`flex items-center justify-between p-3 bg-muted/40 rounded-lg w-full text-left ${selectedWorkflow === wf.id ? "ring-1 ring-primary" : ""} ${!available ? "opacity-60" : ""}`}
                    onClick={() => setSelectedWorkflow(wf.id)}
                    data-ocid={`content_orchestrator.workflow.${wf.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full ${getStatusColor(wf.status)}`}
                      />
                      <span
                        className={!available ? "text-muted-foreground" : ""}
                      >
                        {wf.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {!available && (
                        <span className="text-xs text-amber-400">Blocked</span>
                      )}
                      {wf.status === "completed" && !handoffVerified[wf.id] && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerifyHandoff(wf.id);
                          }}
                          className="text-xs px-2 py-1 bg-primary/20 text-primary rounded"
                          data-ocid={`content_orchestrator.verify_handoff.${wf.id}`}
                        >
                          Verify Handoff
                        </button>
                      )}
                      <span className="text-sm text-muted-foreground capitalize">
                        {wf.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Workflow Log</h2>
            <button
              type="button"
              onClick={handlePushToApproval}
              disabled={!selectedWorkflow}
              className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted rounded-lg transition-colors"
              data-ocid="content_orchestrator.push_approval_button"
            >
              Push to Approval
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Step</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs?.slice(0, 10).map((log: WorkflowLog) => (
                  <tr key={log.id} className="border-b border-border/50">
                    <td className="py-3">{log.agentName}</td>
                    <td className="py-3">{log.stepName}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusColor(log.status)} bg-opacity-20`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {(!logs || logs.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-muted-foreground text-center"
                    >
                      No workflow logs yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
