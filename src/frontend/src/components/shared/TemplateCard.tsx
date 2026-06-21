import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Eye, FileText } from "lucide-react";

interface TemplateCardProps {
  name: string;
  category: string;
  vertical?: string;
  description?: string;
  onPreview?: () => void;
  className?: string;
}

export function TemplateCard({
  name,
  category,
  vertical,
  description,
  onPreview,
  className,
}: TemplateCardProps) {
  return (
    <Card
      className={cn(
        "bg-card border-border overflow-hidden transition-smooth hover:border-primary/30 hover:shadow-subtle group",
        className,
      )}
      data-ocid="template.card"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground leading-tight">
              {name}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground text-xs"
            data-ocid="template.category"
          >
            {category}
          </Badge>
          {vertical && (
            <Badge
              variant="outline"
              className="border-primary/30 text-primary text-xs"
              data-ocid="template.vertical"
            >
              {vertical}
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </CardContent>

      {onPreview && (
        <CardFooter className="px-5 py-3 border-t border-border bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-primary hover:bg-primary/10 hover:text-primary"
            onClick={onPreview}
            data-ocid="template.preview_button"
          >
            <Eye className="h-4 w-4" />
            Preview Template
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
