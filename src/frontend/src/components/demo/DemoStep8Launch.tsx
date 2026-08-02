import { useApp } from "@/context/AppContext";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function DemoStep8Launch() {
  const navigate = useNavigate();
  const { sessionData } = useDemoFlow();
  const { loginDemo } = useApp();
  const [isOpening, setIsOpening] = useState(false);

  const demoInfo = {
    firstName: sessionData.firstName || "there",
    businessName: sessionData.businessName || "Your Business",
    niche: sessionData.niche || "Local Business",
    city: sessionData.city || "Your Market",
  };

  useEffect(() => {
    sessionStorage.setItem("brfDemo", JSON.stringify(demoInfo));
    loginDemo(demoInfo);
  }, [demoInfo.businessName, demoInfo.city, demoInfo.firstName, demoInfo.niche, loginDemo]);

  const enterBackOffice = () => {
    setIsOpening(true);
    sessionStorage.setItem("brfDemo", JSON.stringify(demoInfo));
    loginDemo(demoInfo);
    window.setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 150);
  };

  return (
    <div className="flex min-h-[calc(100vh-4.75rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
            Demo complete
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {demoInfo.businessName}'s back office is ready
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-400 sm:text-base">
            Your personalized demo workspace has been loaded with leads, reviews,
            social content, analytics, and funding-readiness tools.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Lead and CRM pipeline",
              "AI front desk activity",
              "Social content calendar",
              "Reviews and reputation",
              "Growth analytics",
              "Business credit tools",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={enterBackOffice}
          disabled={isOpening}
          data-ocid="demo.enter_back_office.button"
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-wait disabled:opacity-70"
        >
          <LayoutDashboard className="h-5 w-5" />
          {isOpening ? "Opening your back office..." : "Enter My Back Office"}
          {!isOpening && <ArrowRight className="h-5 w-5" />}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Demo access is ready now — no additional setup screen
        </div>
      </div>
    </div>
  );
}
