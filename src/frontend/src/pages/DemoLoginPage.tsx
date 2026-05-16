import { useNavigate } from "@tanstack/react-router";
import {
  Bath,
  Building2,
  Droplets,
  Leaf,
  Thermometer,
  Wind,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useApp } from "../context/AppContext";

const NICHES = [
  {
    value: "Plumbing",
    label: "Plumbing",
    nicheId: "plumbing" as const,
    icon: Wrench,
    color: "text-blue-400",
  },
  {
    value: "Med Spa",
    label: "Med Spa",
    nicheId: "med-spa" as const,
    icon: Bath,
    color: "text-pink-400",
  },
  {
    value: "HVAC",
    label: "HVAC",
    nicheId: "hvac" as const,
    icon: Thermometer,
    color: "text-orange-400",
  },
  {
    value: "Restoration",
    label: "Restoration",
    nicheId: "restoration" as const,
    icon: Droplets,
    color: "text-cyan-400",
  },
  {
    value: "Carpet Cleaning",
    label: "Carpet Cleaning",
    nicheId: "carpet-cleaning" as const,
    icon: Leaf,
    color: "text-emerald-400",
  },
  {
    value: "Roofing",
    label: "Roofing",
    nicheId: "roofing" as const,
    icon: Wind,
    color: "text-slate-200",
  },
];

export default function DemoLoginPage() {
  const [firstName, setFirstName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { loginDemo } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "Required";
    if (!businessName.trim()) errs.businessName = "Required";
    if (!niche) errs.niche = "Please select your business type";
    if (!city.trim()) errs.city = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLaunch = () => {
    if (!validate()) return;
    const selectedNicheEntry = NICHES.find((n) => n.value === niche);
    loginDemo({
      firstName,
      businessName,
      niche: selectedNicheEntry?.nicheId ?? niche,
      city,
    });
    navigate({ to: "/dashboard" });
  };

  const selectedNiche = NICHES.find((n) => n.value === niche);
  const NicheIcon = selectedNiche?.icon ?? Building2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Full demo hint */}
        <div className="text-center mb-6">
          <p className="text-slate-400 text-xs">
            Looking for the full demo experience?{" "}
            <a
              href="/demo"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              See 2 Live Demos →
            </a>
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <NicheIcon
              size={24}
              className={selectedNiche?.color ?? "text-white"}
            />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Let's personalize your demo
          </h1>
          <p className="text-slate-200 text-sm mt-2">
            We'll build a live simulation of the platform using your business
            details.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-slate-200 mb-1.5 block">
                First Name
              </Label>
              <Input
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrors((p) => ({ ...p, firstName: "" }));
                }}
                placeholder="Your first name"
                className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-200 focus:border-purple-500 h-9 text-sm"
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-200 mb-1.5 block">
                City / Area
              </Label>
              <Input
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setErrors((p) => ({ ...p, city: "" }));
                }}
                placeholder="e.g. San Diego"
                className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-200 focus:border-purple-500 h-9 text-sm"
              />
              {errors.city && (
                <p className="text-red-400 text-xs mt-1">{errors.city}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-200 mb-1.5 block">
              Business Name
            </Label>
            <Input
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                setErrors((p) => ({ ...p, businessName: "" }));
              }}
              placeholder="e.g. Pacific Coast Plumbing"
              className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-200 focus:border-purple-500 h-9 text-sm"
            />
            {errors.businessName && (
              <p className="text-red-400 text-xs mt-1">{errors.businessName}</p>
            )}
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-200 mb-2 block">
              Business Type
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {NICHES.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setNiche(value);
                    setErrors((p) => ({ ...p, niche: "" }));
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm border transition-colors ${
                    niche === value
                      ? "bg-purple-600/30 border-purple-500 text-white font-medium"
                      : "bg-slate-700/40 border-slate-600 text-slate-200 hover:border-purple-400"
                  }`}
                >
                  <Icon
                    size={14}
                    className={niche === value ? "text-purple-300" : color}
                  />
                  {label}
                </button>
              ))}
            </div>
            {errors.niche && (
              <p className="text-red-400 text-xs mt-1">{errors.niche}</p>
            )}
          </div>

          <Button
            onClick={handleLaunch}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-2.5 shadow-lg shadow-purple-700/20"
          >
            Launch My Demo →
          </Button>

          <p className="text-center text-xs text-slate-200">
            This is a simulated environment. No real data will be sent.
          </p>
        </div>

        <div className="text-center mt-6">
          <a
            href="/login"
            className="text-slate-200 text-xs hover:text-slate-200"
          >
            ← Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
