import { r as reactExports, j as jsxRuntimeExports } from "./index-Dwzp0QDY.js";
import { u as useBusinessBrief } from "./useBusinessBrief-DB4dL_cV.js";
function BrandOnboardingPage() {
  const { brief, updateBrief } = useBusinessBrief();
  const [formData, setFormData] = reactExports.useState({
    businessName: "",
    targetAudience: "",
    services: [],
    positioning: "",
    differentiators: [],
    brandVoice: "",
    doRules: [],
    dontRules: []
  });
  const [newTag, setNewTag] = reactExports.useState({ field: "", value: "" });
  const [saved, setSaved] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (brief) {
      setFormData({
        businessName: brief.businessName || "",
        targetAudience: brief.targetAudience || "",
        services: brief.services || [],
        positioning: brief.positioning || "",
        differentiators: brief.differentiators || [],
        brandVoice: brief.brandVoice || "",
        doRules: brief.doRules || [],
        dontRules: brief.dontRules || []
      });
    }
  }, [brief]);
  const calculateProgress = () => {
    const required = ["businessName", "services", "targetAudience"];
    let filled = 0;
    if (formData.businessName) filled++;
    if (formData.services.length > 0) filled++;
    if (formData.targetAudience) filled++;
    return Math.round(filled / required.length * 100);
  };
  const handleAddTag = (field) => {
    if (newTag.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [
          ...prev[field],
          newTag.value.trim()
        ]
      }));
      setNewTag({ field: "", value: "" });
    }
  };
  const handleRemoveTag = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter(
        (_, i) => i !== index
      )
    }));
  };
  const handleSave = async () => {
    await updateBrief(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3e3);
  };
  const missingFields = [];
  if (!formData.businessName) missingFields.push("Business Name");
  if (formData.services.length === 0) missingFields.push("Services");
  if (!formData.targetAudience) missingFields.push("Target Audience");
  if (!formData.positioning) missingFields.push("Positioning");
  if (!formData.brandVoice) missingFields.push("Brand Voice");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-[hsl(232_40%_22%)] text-white p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2", children: "Brand Onboarding Agent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-6", children: "Create BrandVoice and BusinessBrief" }),
    saved && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-900/50 border border-green-500 rounded-lg p-4 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-200", children: "Brand brief saved successfully!" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold text-blue-400", children: [
          calculateProgress(),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-700 rounded-full h-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-blue-500 h-3 rounded-full transition-all",
          style: { width: `${calculateProgress()}%` }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Brand Information" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "businessName",
              className: "block text-sm text-gray-400 mb-2",
              children: "Business Name *"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "businessName",
              type: "text",
              value: formData.businessName,
              onChange: (e) => setFormData((prev) => ({
                ...prev,
                businessName: e.target.value
              })),
              className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white",
              placeholder: "Your business name"
            }
          )
        ] }),
        [
          "targetAudience",
          "services",
          "differentiators",
          "doRules",
          "dontRules"
        ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: `field-${field}`,
              className: "block text-sm text-gray-400 mb-2 capitalize",
              children: field.replace(/([A-Z])/g, " $1").trim()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: formData[field].map(
            (tag, _idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2",
                children: [
                  tag,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleRemoveTag(field, _idx),
                      className: "text-blue-400 hover:text-blue-200",
                      children: "×"
                    }
                  )
                ]
              },
              `tag-${tag}`
            )
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: `field-${field}`,
                type: "text",
                value: newTag.field === field ? newTag.value : "",
                onChange: (e) => setNewTag({ field, value: e.target.value }),
                onKeyPress: (e) => e.key === "Enter" && handleAddTag(field),
                className: "flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white",
                placeholder: `Add ${field.replace(/([A-Z])/g, " $1").trim().toLowerCase()}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleAddTag(field),
                className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg",
                children: "Add"
              }
            )
          ] })
        ] }, field)),
        ["positioning", "brandVoice"].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: `textarea-${field}`,
              className: "block text-sm text-gray-400 mb-2 capitalize",
              children: field.replace(/([A-Z])/g, " $1").trim()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: `textarea-${field}`,
              value: formData[field],
              onChange: (e) => setFormData((prev) => ({
                ...prev,
                [field]: e.target.value
              })),
              className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-24",
              placeholder: `Enter your ${field.replace(/([A-Z])/g, " $1").trim().toLowerCase()}`
            }
          )
        ] }, field))
      ] })
    ] }),
    missingFields.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-yellow-200 font-semibold mb-2", children: "Missing Information" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-yellow-300 text-sm list-disc list-inside", children: missingFields.map((field, _idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: field }, `missing-${field}`)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleSave,
        disabled: !formData.businessName || formData.services.length === 0 || !formData.targetAudience,
        className: "w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors",
        children: "Save Brand Brief"
      }
    )
  ] }) });
}
export {
  BrandOnboardingPage as default
};
