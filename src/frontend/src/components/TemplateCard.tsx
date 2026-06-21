import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { N8NTemplateMetadata } from "@/data/n8nTemplateMetadata";
import {
  BarChart3,
  GitBranch,
  type LucideIcon,
  Mail,
  MapPin,
  MessageSquare,
  MessageSquareReply,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  UserPlus,
  GitBranch,
  MessageSquareReply,
  Mail,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  MapPin,
};

interface TemplateCardProps {
  template: N8NTemplateMetadata;
  onUseTemplate: (templateId: string) => void;
  onPreview?: (templateId: string) => void;
}

export function TemplateCard({
  template,
  onUseTemplate,
  onPreview,
}: TemplateCardProps) {
  const Icon = ICON_MAP[template.icon] || UserPlus;

  return (
    <Card className="group relative overflow-hidden border border-border/60 bg-card/80 p-5 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_20px_oklch(0.62_0.2_200_/_15%)]">
      {/* Neural accent top bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[oklch(0.62_0.2_200)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className={`h-4 w-4 ${template.color}`} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {template.name}
            </h3>
            <span className="mt-0.5 inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
              {template.category}
            </span>
          </div>
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
        {template.description}
      </p>

      <div className="mb-3 flex flex-wrap gap-1">
        {template.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {template.nodeCount} nodes
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-accent" />
          {template.estimatedSetupTime}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onPreview && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPreview(template.id)}
            className="h-7 flex-1 text-xs hover:bg-muted"
            data-ocid={`template.preview_button.${template.id}`}
          >
            Preview
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUseTemplate(template.id)}
          className="h-7 flex-1 gap-1.5 border-primary/30 bg-primary/5 text-xs hover:bg-primary/20"
          data-ocid={`template.use_button.${template.id}`}
        >
          Use Template
        </Button>
      </div>
    </Card>
  );
}
