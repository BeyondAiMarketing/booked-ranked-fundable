import React, { useState } from "react";

import { usePerformanceReview } from "../hooks/usePerformanceReview";

import { useBusinessBrief } from "../hooks/useBusinessBrief";

import { type MonthlyReport, PerformanceInsight } from "../types/socialContent";

export default function PerformanceReviewPage() {
  const { insights, reports, createReport } = usePerformanceReview();
  usePerformanceReview();
  const { brief, updateBrief } = useBusinessBrief();
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState<Partial<MonthlyReport>>({
    period: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
    summary: "",
    insights: [],
    recommendations: [],
    bestPerformers: [],
    nextMonthStrategy: "",
  });

  const metrics = [
    {
      label: "Engagement Rate",
      value: "4.2%",
      benchmark: "3.5%",
      trend: "up" as const,
    },
    { label: "Reach", value: "12.5K", benchmark: "10K", trend: "up" as const },
    {
      label: "Impressions",
      value: "45K",
      benchmark: "40K",
      trend: "up" as const,
    },
    { label: "Clicks", value: "890", benchmark: "750", trend: "up" as const },
    {
      label: "Conversions",
      value: "34",
      benchmark: "30",
      trend: "stable" as const,
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      default:
        return "→";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400";
      case "down":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const handleUpdateBrief = async () => {
    if (insights?.length) {
      await updateBrief({
        performanceHistory: [
          ...(brief?.performanceHistory || []),
          `Updated: ${new Date().toISOString()}`,
        ],
        contentHistory: [
          ...(brief?.contentHistory || []),
          `Reviewed: ${insights.length} insights`,
        ],
      });
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(232_40%_22%)] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Performance Review Agent</h1>
        <p className="text-gray-400 mb-6">
          Review content/campaign performance, update best performers, change
          next month's strategy
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {metrics.map((metric, _idx) => (
            <div
              key={`metric-${metric.label}`}
              className="bg-gray-800 rounded-lg p-4"
            >
              <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">vs {metric.benchmark}</span>
                <span className={`${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Best Performers</h2>
            <div className="space-y-3">
              {reports?.[0]?.bestPerformers?.map((performer, _idx) => (
                <div
                  key={`performer-${performer.platform}-${performer.postType}`}
                  className="bg-gray-700 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{performer.platform}</span>
                    <span className="text-green-400">{performer.value}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {performer.postType} — {performer.reason}
                  </div>
                </div>
              )) || (
                <div className="text-gray-500 text-center py-4">
                  No best performers recorded yet
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Monthly Reports</h2>
              <button
                type="button"
                onClick={() => setShowReportForm(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              >
                Create Report
              </button>
            </div>
            {showReportForm && (
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <textarea
                  placeholder="Summary"
                  value={newReport.summary}
                  onChange={(e) =>
                    setNewReport((prev) => ({
                      ...prev,
                      summary: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 mb-2 h-20"
                />
                <textarea
                  placeholder="Next Month Strategy"
                  value={newReport.nextMonthStrategy}
                  onChange={(e) =>
                    setNewReport((prev) => ({
                      ...prev,
                      nextMonthStrategy: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 h-20"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => createReport(newReport as MonthlyReport)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {reports?.map((report, _idx) => (
                <div
                  key={`report-${report.period.month}-${report.period.year}-${report.createdAt}`}
                  className="bg-gray-700 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">
                      {report.period.month}/{report.period.year}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{report.summary}</p>
                </div>
              )) || (
                <div className="text-gray-500 text-center py-4">
                  No reports yet
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUpdateBrief}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          Update Business Brief with Insights
        </button>
      </div>
    </div>
  );
}
