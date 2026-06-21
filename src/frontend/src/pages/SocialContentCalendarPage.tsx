import React, { useState } from "react";

import { useContentCalendar } from "../hooks/useContentCalendar";

import { useBusinessBrief } from "../hooks/useBusinessBrief";

import { useVerticalProfile } from "../hooks/useVerticalProfile";

import type {
  ApprovalStatus,
  CalendarEntry,
  Platform,
} from "../types/socialContent";

export default function SocialContentCalendarPage() {
  const { calendars, addEntry } = useContentCalendar();
  useContentCalendar();
  const { brief } = useBusinessBrief();
  const { profile } = useVerticalProfile();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<CalendarEntry>>({});

  const hasContext = brief?.brandVoice && profile;

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending_review":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      case "needs_revision":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAddEntry = async () => {
    if (newEntry.day && newEntry.platform) {
      await addEntry("current-calendar", newEntry as CalendarEntry);
      setShowForm(false);
      setNewEntry({});
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(232_40%_22%)] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Social Content Calendar Agent
        </h1>
        <p className="text-gray-400 mb-6">
          Create 30-day calendar using VerticalProfile
        </p>

        {!hasContext && (
          <div className="bg-orange-900/50 border border-orange-500 rounded-lg p-4 mb-6">
            <p className="text-orange-200 font-semibold">Missing Context</p>
            <p className="text-orange-300 text-sm">
              Complete brand onboarding first before creating content calendars.
            </p>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={`month-${i}-${i + 1}`} value={i + 1}>
                {new Date(2000, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={!hasContext}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg"
          >
            Add Entry
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">New Calendar Entry</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Day"
                min={1}
                max={31}
                onChange={(e) =>
                  setNewEntry((prev) => ({
                    ...prev,
                    day: Number(e.target.value),
                  }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
              <select
                onChange={(e) =>
                  setNewEntry((prev) => ({
                    ...prev,
                    platform: e.target.value as Platform,
                  }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              >
                <option value="">Select Platform</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="x">X</option>
                <option value="threads">Threads</option>
                <option value="tiktok">TikTok</option>
                <option value="googleBusinessProfile">
                  Google Business Profile
                </option>
              </select>
              <input
                type="text"
                placeholder="Pillar"
                onChange={(e) =>
                  setNewEntry((prev) => ({ ...prev, pillar: e.target.value }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Format"
                onChange={(e) =>
                  setNewEntry((prev) => ({ ...prev, format: e.target.value }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Objective"
                onChange={(e) =>
                  setNewEntry((prev) => ({
                    ...prev,
                    objective: e.target.value,
                  }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Topic"
                onChange={(e) =>
                  setNewEntry((prev) => ({ ...prev, topic: e.target.value }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Angle"
                onChange={(e) =>
                  setNewEntry((prev) => ({ ...prev, angle: e.target.value }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Visual Direction"
                onChange={(e) =>
                  setNewEntry((prev) => ({
                    ...prev,
                    visualDirection: e.target.value,
                  }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="CTA"
                onChange={(e) =>
                  setNewEntry((prev) => ({ ...prev, cta: e.target.value }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 col-span-2"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleAddEntry}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const entries =
              calendars
                ?.flatMap((c) => c.entries)
                .filter((e) => e.day === day) || [];
            return (
              <div
                key={day}
                className="bg-gray-800 rounded-lg p-3 min-h-[120px]"
              >
                <div className="text-sm text-gray-400 mb-2">{day}</div>
                {entries.map((entry, idx) => (
                  <div
                    key={`entry-${entry.day}-${entry.platform}-${idx}`}
                    className="bg-gray-700 rounded p-2 mb-1 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{entry.platform}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusColor(entry.approvalStatus)}`}
                      />
                    </div>
                    <div className="text-gray-400">{entry.topic}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
