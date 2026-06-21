import React, { useState, useEffect } from "react";

import { useBusinessBrief } from "../hooks/useBusinessBrief";

export default function BrandOnboardingPage() {
  const { brief, updateBrief } = useBusinessBrief();
  const [formData, setFormData] = useState({
    businessName: "",
    targetAudience: "",
    services: [] as string[],
    positioning: "",
    differentiators: [] as string[],
    brandVoice: "",
    doRules: [] as string[],
    dontRules: [] as string[],
  });
  const [newTag, setNewTag] = useState({ field: "", value: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (brief) {
      setFormData({
        businessName: brief.businessName || "",
        targetAudience: brief.targetAudience || "",
        services: brief.services || [],
        positioning: brief.positioning || "",
        differentiators: brief.differentiators || [],
        brandVoice: brief.brandVoice || "",
        doRules: brief.doRules || [],
        dontRules: brief.dontRules || [],
      });
    }
  }, [brief]);

  const calculateProgress = () => {
    const required = ["businessName", "services", "targetAudience"];
    let filled = 0;
    if (formData.businessName) filled++;
    if (formData.services.length > 0) filled++;
    if (formData.targetAudience) filled++;
    return Math.round((filled / required.length) * 100);
  };

  const handleAddTag = (field: string) => {
    if (newTag.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [
          ...(prev[field as keyof typeof prev] as string[]),
          newTag.value.trim(),
        ],
      }));
      setNewTag({ field: "", value: "" });
    }
  };

  const handleRemoveTag = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleSave = async () => {
    await updateBrief(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const missingFields: string[] = [];
  if (!formData.businessName) missingFields.push("Business Name");
  if (formData.services.length === 0) missingFields.push("Services");
  if (!formData.targetAudience) missingFields.push("Target Audience");
  if (!formData.positioning) missingFields.push("Positioning");
  if (!formData.brandVoice) missingFields.push("Brand Voice");

  return (
    <div className="min-h-screen bg-[hsl(232_40%_22%)] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Brand Onboarding Agent</h1>
        <p className="text-gray-400 mb-6">
          Create BrandVoice and BusinessBrief
        </p>

        {saved && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 mb-6">
            <p className="text-green-200">Brand brief saved successfully!</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Progress</h2>
            <span className="text-2xl font-bold text-blue-400">
              {calculateProgress()}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Brand Information</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm text-gray-400 mb-2"
              >
                Business Name *
              </label>
              <input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    businessName: e.target.value,
                  }))
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                placeholder="Your business name"
              />
            </div>

            {[
              "targetAudience",
              "services",
              "differentiators",
              "doRules",
              "dontRules",
            ].map((field) => (
              <div key={field}>
                <label
                  htmlFor={`field-${field}`}
                  className="block text-sm text-gray-400 mb-2 capitalize"
                >
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(formData[field as keyof typeof formData] as string[]).map(
                    (tag, _idx) => (
                      <span
                        key={`tag-${tag}`}
                        className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(field, _idx)}
                          className="text-blue-400 hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    ),
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    id={`field-${field}`}
                    type="text"
                    value={newTag.field === field ? newTag.value : ""}
                    onChange={(e) =>
                      setNewTag({ field, value: e.target.value })
                    }
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag(field)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    placeholder={`Add ${field
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .toLowerCase()}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(field)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}

            {["positioning", "brandVoice"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={`textarea-${field}`}
                  className="block text-sm text-gray-400 mb-2 capitalize"
                >
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <textarea
                  id={`textarea-${field}`}
                  value={formData[field as keyof typeof formData] as string}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-24"
                  placeholder={`Enter your ${field
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>

        {missingFields.length > 0 && (
          <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 mb-6">
            <p className="text-yellow-200 font-semibold mb-2">
              Missing Information
            </p>
            <ul className="text-yellow-300 text-sm list-disc list-inside">
              {missingFields.map((field, _idx) => (
                <li key={`missing-${field}`}>{field}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={
            !formData.businessName ||
            formData.services.length === 0 ||
            !formData.targetAudience
          }
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
        >
          Save Brand Brief
        </button>
      </div>
    </div>
  );
}
