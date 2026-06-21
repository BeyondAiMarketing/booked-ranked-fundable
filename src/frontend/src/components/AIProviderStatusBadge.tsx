import type { ProviderConfig } from "@/types/ragBrain";
import { AIProviderStatusBadge as UnifiedAIProviderStatusBadge } from "./ai/AIProviderStatusBadge";

interface AIProviderStatusBadgeProps {
  config: ProviderConfig;
  size?: "sm" | "md";
}

export function AIProviderStatusBadge({
  config,
  size = "md",
}: AIProviderStatusBadgeProps) {
  return <UnifiedAIProviderStatusBadge provider={config} compact={size === "sm"} />;
}
