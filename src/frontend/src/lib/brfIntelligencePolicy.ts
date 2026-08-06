export const BRF_PROVIDER_ORDER = [
  "nemo-agent",
  "nvidia-nim",
  "nvidia-nim-fast",
  "openrouter",
  "openai",
  "anthropic",
] as const;

export type BrfProviderId = (typeof BRF_PROVIDER_ORDER)[number];

export function extractJsonValue(content: string): unknown {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const objectStart = cleaned.indexOf("{");
    const objectEnd = cleaned.lastIndexOf("}");
    const arrayStart = cleaned.indexOf("[");
    const arrayEnd = cleaned.lastIndexOf("]");

    if (
      arrayStart >= 0 &&
      arrayEnd > arrayStart &&
      (objectStart < 0 || arrayStart < objectStart)
    ) {
      return JSON.parse(cleaned.slice(arrayStart, arrayEnd + 1));
    }

    if (objectStart >= 0 && objectEnd > objectStart) {
      return JSON.parse(cleaned.slice(objectStart, objectEnd + 1));
    }

    throw new Error("Provider returned invalid JSON.");
  }
}
