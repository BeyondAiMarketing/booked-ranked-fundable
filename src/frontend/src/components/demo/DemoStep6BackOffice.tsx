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
  const [activeTip, setActiveTip] = useState<number | null>(null);

  useEffect(() => {
    let i = 0;
    const cycle = () => {
      setActiveTip(SECTIONS[i].id);
      i = (i + 1) % SECTIONS.length;
    };
    cycle();
    const timer = setInterval(cycle, 1500);
    return () => clearInterval(timer);
  }, []);

  const businessName = sessionData.businessName || "Your Business";

  // Build niche-specific section data
  const crmLeads = nicheContent?.crmLeads?.slice(0, 3) ?? [];
  const reviews = nicheContent?.reviews?.slice(0, 2) ?? [];
  const backOfficeTip =
    nicheContent?.coachTips?.backOffice ??
    SECTIONS.find((s) => s.id === 1)?.tip ??
    "Your leads live here.";

  // Build sections with niche content injected
  const nicheSections = SECTIONS.map((section) => {
    if (section.id === 1) {
      const leadNames = crmLeads.map((l) => l.name).join(", ");
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-700/40 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-4">
          Command Center
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Everything in One Place — Easy as Your Phone
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          {businessName}'s dashboard — tap any section to explore.
        </p>
      </div>

      {/* Dashboard mock */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4">
        {/* Topbar */}
        <div className="bg-gray-800/80 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-gray-400 text-xs ml-2">
            bookedrankedfunded.org / dashboard
          </span>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
          {nicheSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 text-left w-full ${
                activeTip === section.id
                  ? `${section.color} bg-gray-800/60 scale-[1.02]`
                  : "border-gray-700/40 bg-gray-800/20"
              }`}
              onClick={() => setActiveTip(section.id)}
            >
              <div className="text-2xl mb-2">{section.icon}</div>
              <p className="text-white text-xs font-semibold">
                {section.title}
              </p>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                {section.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Sliding tip banner — always uses niche-specific backOffice tip */}
      {activeTip && (
        <div className="fixed bottom-24 left-0 right-0 px-4 z-40 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <div className="bg-purple-900 border border-purple-600/60 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg shadow-purple-900/40">
              <span className="text-purple-300 text-lg">💡</span>
              <p className="text-purple-100 text-sm font-medium">
                {activeTip === 1 || activeTip === 3
                  ? backOfficeTip
                  : nicheSections.find((s) => s.id === activeTip)?.tip}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          data-ocid="demo.step6.next_button"
          type="button"
          onClick={onNext}
          className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
        >
          Next: Business Credit Builder →
        </button>
      </div>
    </div>
  );
}
