from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def regex_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one regex match, found {count}")
    return updated


def patch_layout() -> None:
    path = ROOT / "src/frontend/src/components/AppLayout.tsx"
    text = path.read_text()

    overview = '''  {
    label: "OVERVIEW",
    items: [{ label: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
  },
'''
    roofing_group = overview + '''  {
    label: "ROOFING GROWTH",
    items: [
      { label: "Roofing Landing Page", path: "/roofing", icon: Hammer },
      {
        label: "Free Roofer AI Playbook",
        path: "/roofing-ai-growth-playbook",
        icon: BookOpen,
      },
    ],
  },
'''
    text = replace_once(text, overview, roofing_group, "sidebar roofing group")

    title_anchor = '''  "/dashboard": "Dashboard",
'''
    title_replacement = title_anchor + '''  "/roofing": "Roofing Growth System",
  "/roofing-ai-growth-playbook": "Free Roofer AI Playbook",
'''
    text = replace_once(text, title_anchor, title_replacement, "roofing page titles")
    path.write_text(text)


def patch_roofing_page() -> None:
    path = ROOT / "src/frontend/src/pages/RoofingPage.tsx"
    text = path.read_text()

    text = replace_once(
        text,
        "BRF Command Center",
        "Illustrative BRF Command Center",
        "dashboard preview label",
    )

    demo_form = r'''function DemoForm({ onDemoStart }: { onDemoStart: (data: FormState) => void }) {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    website: "",
    city: "",
    state: "",
    monthlyRevenue: "",
    biggestProblem: "",
    crewCount: "",
  });
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");
  const set = (field: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const isValid =
    form.firstName.trim() !== "" &&
    form.businessName.trim() !== "" &&
    form.email.includes("@") &&
    form.website.trim() !== "";

  const inputCls =
    "w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 transition-all duration-150 " +
    "bg-[oklch(1_0_0_/_5%)] border border-[oklch(1_0_0_/_12%)] focus:ring-[oklch(0.75_0.16_75_/_50%)] focus:border-[oklch(0.75_0.16_75_/_50%)]";

  const handleSubmit = () => {
    if (!isValid) {
      setError("Enter your first name, roofing company, work email, and website.");
      return;
    }
    setError("");
    onDemoStart({
      ...form,
      monthlyRevenue: form.monthlyRevenue || "Not provided",
      biggestProblem: form.biggestProblem || "Not provided",
      crewCount: form.crewCount || "Not provided",
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-sky-400/20 bg-sky-400/5 p-4 text-sm leading-6 text-foreground/70">
        Start with four details. Additional qualification is optional and only helps personalize the demo.
      </div>
      {error && (
        <p data-ocid="roofing.form.error_state" className="text-red-400 text-sm text-center">
          {error}
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="roofing-firstName" className="block text-xs text-foreground/50 mb-1 font-medium">
            First Name *
          </label>
          <input
            id="roofing-firstName"
            data-ocid="roofing.form.first_name.input"
            type="text"
            placeholder="Jordan"
            value={form.firstName}
            onChange={(event) => set("firstName", event.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="roofing-businessName" className="block text-xs text-foreground/50 mb-1 font-medium">
            Roofing Company *
          </label>
          <input
            id="roofing-businessName"
            data-ocid="roofing.form.business_name.input"
            type="text"
            placeholder="Summit Roofing"
            value={form.businessName}
            onChange={(event) => set("businessName", event.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label htmlFor="roofing-email" className="block text-xs text-foreground/50 mb-1 font-medium">
          Work Email *
        </label>
        <input
          id="roofing-email"
          data-ocid="roofing.form.email.input"
          type="email"
          placeholder="jordan@summitroofing.com"
          value={form.email}
          onChange={(event) => set("email", event.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="roofing-website" className="block text-xs text-foreground/50 mb-1 font-medium">
          Website *
        </label>
        <input
          id="roofing-website"
          data-ocid="roofing.form.website.input"
          type="text"
          placeholder="summitroofing.com"
          value={form.website}
          onChange={(event) => set("website", event.target.value)}
          className={inputCls}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowDetails((open) => !open)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-foreground/70 transition hover:border-white/20 hover:text-foreground"
      >
        {showDetails ? "Hide optional personalization" : "Add optional personalization"}
      </button>

      {showDetails && (
        <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="roofing-phone" className="block text-xs text-foreground/50 mb-1 font-medium">
                Phone
              </label>
              <input
                id="roofing-phone"
                data-ocid="roofing.form.phone.input"
                type="tel"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(event) => set("phone", event.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="roofing-city" className="block text-xs text-foreground/50 mb-1 font-medium">
                Primary City
              </label>
              <input
                id="roofing-city"
                data-ocid="roofing.form.city.input"
                type="text"
                placeholder="Dallas"
                value={form.city}
                onChange={(event) => set("city", event.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="roofing-state" className="block text-xs text-foreground/50 mb-1 font-medium">
                State
              </label>
              <select
                id="roofing-state"
                data-ocid="roofing.form.state.select"
                value={form.state}
                onChange={(event) => set("state", event.target.value)}
                className={inputCls}
              >
                <option value="">Select state...</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="roofing-problem" className="block text-xs text-foreground/50 mb-1 font-medium">
                Biggest Challenge
              </label>
              <select
                id="roofing-problem"
                value={form.biggestProblem}
                onChange={(event) => set("biggestProblem", event.target.value)}
                className={inputCls}
              >
                <option value="">Select challenge...</option>
                <option>Missed Calls</option>
                <option>Estimate Follow-up</option>
                <option>Google Maps Visibility</option>
                <option>Review Growth</option>
                <option>Disconnected Tools</option>
                <option>Growth Funding Readiness</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <GoldButton
        onClick={handleSubmit}
        className={`w-full text-center ${!isValid ? "opacity-60" : ""}`}
        data-ocid="roofing.form.submit_button"
      >
        See It Work for My Roofing Company
      </GoldButton>
      <p className="text-xs text-center text-foreground/35">
        No credit card. The preview is illustrative and does not guarantee leads, rankings, funding, or revenue.
      </p>
    </div>
  );
}

export default function RoofingPage'''

    text = regex_once(
        text,
        r'function DemoForm\(\{ onDemoStart \}: \{ onDemoStart: \(data: FormState\) => void \} \) \{.*?\n\}\n\nexport default function RoofingPage',
        demo_form,
        "lower-friction roofing form",
    )

    text = replace_once(
        text,
        '''              Your Roofing Company Does Not Need More Tools.{" "}
              <span className="roofing-highlight-gold">
                It Needs One System To Get Booked, Ranked, And Fundable.
              </span>''',
        '''              Turn Missed Calls and Unsold Estimates Into{" "}
              <span className="roofing-highlight-gold">
                Booked Roof Inspections.
              </span>''',
        "hero headline",
    )
    text = replace_once(
        text,
        '''              We stop missed calls, capture roof leads 24/7, follow up
              automatically, grow your Google Maps presence, and turn reviews
              into booked inspections — one AI-powered operating system that
              compounds every dollar of your marketing into booked, ranked, and
              fundable growth.''',
        '''              BRF helps roofing companies respond faster, organize every opportunity,
              follow up on estimates, request reviews, and understand where booked
              inspections are coming from — in one connected operating system.''',
        "hero supporting copy",
    )
    text = replace_once(text, "Watch My Live Roofing Demo", "See It Work for My Roofing Company", "hero CTA")
    text = replace_once(text, "See How BRF Works", "Personalize My Demo", "hero secondary CTA")
    text = replace_once(
        text,
        '''              The complete growth engine for roofing companies who refuse to
              lose another lead to voicemail, weak follow-up, or a competitor
              ranking above them.''',
        '''              Built for roofing owners who want a clearer path from the first
              homeowner inquiry to the booked inspection and completed follow-up.''',
        "hero qualifier",
    )

    text = replace_once(text, "Why Most Roofing Marketing Fails", "Where Roofing Revenue Leaks After the Lead Arrives", "demo section title")
    text = replace_once(text, "Most roofers do not have a lead problem. They have a system problem.", "See the path from homeowner inquiry to booked inspection, estimate follow-up, review request, and measurable pipeline activity.", "demo section lead")
    text = replace_once(text, "Your Marketing Sucks Because Your System Is Weak", "Launch the Interactive Roofing Workflow", "demo card title")
    text = replace_once(text, "Build My Live Roofing Demo", "Launch the Interactive Roofing Demo", "demo section CTA")
    text = replace_once(
        text,
        '''              Your Marketing Sucks Because{" "}
              <span className="roofing-highlight-gold">
                The System Behind It Is Weak.
              </span>''',
        '''              Your Marketing May Be Working.{" "}
              <span className="roofing-highlight-gold">
                The Follow-Up System Is Where Revenue Leaks.
              </span>''',
        "pain section headline",
    )

    proof_section = '''      {/* PROOF WITHOUT UNSUPPORTED CLAIMS */}
      <section
        data-ocid="roofing.proof.section"
        className="py-20 px-4"
        style={{ background: "#0a0f1e" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.18em] font-black text-blue-300">
              What the system demonstrates
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black font-display text-foreground">
              Follow one roofing opportunity from first contact to measurable follow-up.
            </h2>
            <p className="mt-4 text-foreground/60 text-lg leading-relaxed">
              Instead of relying on unverified result claims, the demo shows the operating workflow and the data BRF is designed to track.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-4 gap-5">
            {[
              ["01", "Lead captured", "A homeowner inquiry is answered and organized with source and contact context."],
              ["02", "Inspection booked", "The opportunity moves into a clear appointment and CRM workflow."],
              ["03", "Estimate followed up", "The system keeps the next action visible and supports consistent follow-up."],
              ["04", "Outcome measured", "The team can see activity across calls, inspections, reviews, and pipeline stages."],
            ].map(([number, title, body]) => (
              <div key={number} className="roofing-glass-card rounded-2xl p-6">
                <div className="text-xs font-black tracking-[0.16em] text-yellow-300">{number}</div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/55">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-foreground/35">
            Illustrative product workflow. Actual outcomes vary by market, offer, execution, and operating conditions.
          </p>
        </div>
      </section>

      {/* DEMO FORM */}'''
    text = regex_once(
        text,
        r'      /\* TESTIMONIALS \*/.*?      /\* DEMO FORM \*/',
        proof_section,
        "replace unsupported testimonials",
    )

    text = replace_once(
        text,
        '''              No niche selection needed. This demo is already built for roofers.
              Enter your business details and BRF will start creating your
              roofing-specific demo.''',
        '''              Start with your company website and contact details. Optional context can make the roofing workflow more relevant without blocking the preview.''',
        "demo form intro",
    )

    text = text.replace('form.city,\n          );', 'form.city || "Your market",\n          );')
    path.write_text(text)


def remove_one_time_files() -> None:
    for relative in [
        ".github/scripts/apply_roofing_funnel_conversion.py",
        ".github/workflows/apply-roofing-funnel-conversion.yml",
    ]:
        target = ROOT / relative
        if target.exists():
            target.unlink()


if __name__ == "__main__":
    patch_layout()
    patch_roofing_page()
    remove_one_time_files()
