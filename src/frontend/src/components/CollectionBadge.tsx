import type { CollectionName } from "@/types/ragBrain";
import { CollectionBadge as UnifiedCollectionBadge } from "./ai/CollectionBadge";

interface CollectionBadgeProps {
  name: CollectionName;
  className?: string;
}

export function CollectionBadge({
  name,
  className = "",
}: CollectionBadgeProps) {
  return <UnifiedCollectionBadge collection={name} className={className} showDot={false} />;
}
