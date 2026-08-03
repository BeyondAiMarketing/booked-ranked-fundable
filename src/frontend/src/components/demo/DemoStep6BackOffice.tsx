import { getDemoContent } from "@/data/demoContentByNiche";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import { useEffect, useState } from "react";

const SECTIONS = [
  {
    id: 1,
    icon: "👥",
    title: "Leads & CRM",
    desc: "All your contacts and leads in one place",
    tip: "Your Leads Live Here — tap any name to see full history",
    color: "border-purple-700/40",
  },
  {
    id: 2,
    icon: "📅",
    title: "Social Calendar",
    desc: "Posts scheduled for the next 30 days",
    tip: "Schedule Posts Here — your AI already wrote next month's content",
    color: "border-blue-700/40",
  },
  {
    id: 3,
    icon: "⭐",
    title: "Reviews & Reputation",
    desc: "Incoming reviews across all platforms",
    tip: "Manage Reviews Here — auto-responses go out within 60 seconds",
    color: "border-amber-700/40",
  },
  {
    id: 4,
    icon: "📈",
    title: "Growth Analytics",
    desc: "Revenue, leads, and call trends",
    tip: "Track Your Growth Here — see what's working and what isn't",
    color: "border-green-700/40",
  },
];

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function DemoStep6BackOffice({ onNext }: Props) {
  const { sessionData } = useDemoFlow();
  const nicheContent = getDemoContent(sessionData.niche);
  const [activeTip, setActiveTip] = useState<number | null>(1);

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % SECTIONS.length;
      setActiveTip(SECTIONS[index].id);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  const businessName = sessionData.businessName || "Your Business";
  const crmLeads = nicheContent?.crmLeads?.slice(0, 3) ?? [];
  const reviews = nicheContent?.reviews?.slice(0, 2) ?? [];
  const backOfficeTip =
    nicheContent?.coachTips?.backOffice ??
    SECTIONS.find((section) => section.id === 1)?.tip ??
    "Your leads live here.";

  const nicheSections = SECTIONS.map((section) => {
    if (section.id === 1) {
      const leadNames = crmLeads.map((lead) => lead.name).join(", ");
      return {
        ...section,
        desc: crmLeads.length > 0 ? `${leadNames} + more` : section.desc,
      };
    }
    if (section.id === 3) {
      const reviewSnippet = reviews[0]?.text?.slice(0, 60) ?? section.desc;
      return {
        ...section,
        desc: reviews.length > 0 ? `"${reviewSnippet}…"` : section.desc,
      };
    }
    return section;
  });

  const activeMessage =
    activeTip === 1 || activeTip === 3
      ? backOfficeTip
      : nicheSections.find((section) => section.id === activeTip)?.tip;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-10">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-block rounded-full border border-indigo-700/40 bg-indigo-900/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300">
          Command Center
        </div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Everything in One Place — Easy as Your Phone
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          {businessName}'s dashboard — tap any section to explore.
        </p>
      </div>

      <div className="mb-4 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
        <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-800/80 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-amber-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>
          <span className="ml-2 truncate text-xs text-gray-400">
            bookedrankedfunded.org / dashboard
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          {nicheSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                activeTip === section.id
                  ? `${section.color} scale-[1.02] bg-gray-800/60`
                  : "border-gray-700/40 bg-gray-800/20"
              }`}
              onClick={() => setActiveTip(section.id)}
            >
              <div className="mb-2 text-2xl">{section.icon}</div>
              <p className="text-xs font-semibold text-white">
                {section.title}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                {section.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {activeMessage && (
        <div className="mb-5 rounded-2xl border border-purple-600/50 bg-purple-950/70 px-4 py-3 shadow-lg shadow-purple-950/30">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg text-purple-300">💡</span>
            <p className="text-sm font-medium leading-6 text-purple-100">
              {activeMessage}
            </p>
          </div>
        </div>
      )}

      <button
        data-ocid="demo.step6.next_button"
        type="button"
        onClick={onNext}
        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white transition-all duration-200 hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/25"
      >
        Next: Business Credit Builder →
      </button>
    </div>
  );
}
