import {
  CheckCircle,
  DollarSign,
  FileText,
  Layers,
  Lightbulb,
  Mail,
  Search,
  User,
} from "lucide-react";
import type { AgentArtifact } from "../types/agentWorkflow";

interface Props {
  artifactType: AgentArtifact["artifactType"];
  size?: number;
}

const CONFIG: Record<
  AgentArtifact["artifactType"],
  { Icon: React.ElementType; color: string; bg: string }
> = {
  proposal: {
    Icon: FileText,
    color: "text-purple-400",
    bg: "bg-purple-500/20",
  },
  estimate: {
    Icon: DollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
  },
  content_package: {
    Icon: Layers,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
  },
  lead_summary: {
    Icon: User,
    color: "text-orange-400",
    bg: "bg-orange-500/20",
  },
  recommendation_set: {
    Icon: Lightbulb,
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
  },
  follow_up_sequence: {
    Icon: Mail,
    color: "text-cyan-400",
    bg: "bg-cyan-500/20",
  },
  seo_action_plan: {
    Icon: Search,
    color: "text-green-400",
    bg: "bg-green-500/20",
  },
  support_resolution: {
    Icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-500/20",
  },
};

export default function ArtifactTypeIcon({ artifactType, size = 16 }: Props) {
  const cfg = CONFIG[artifactType];
  const { Icon } = cfg;
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${cfg.bg}`}
    >
      <Icon size={size} className={cfg.color} />
    </span>
  );
}
