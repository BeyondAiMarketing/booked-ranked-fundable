import tripwireHtml from "../assets/roofing-ai-growth-playbook.html?raw";

export default function RoofingPlaybookTripwirePage() {
  return (
    <iframe
      title="Free Roofing AI Growth Playbook"
      srcDoc={tripwireHtml}
      style={{ width: "100%", height: "100vh", border: 0, display: "block" }}
    />
  );
}
