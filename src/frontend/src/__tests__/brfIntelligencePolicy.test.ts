import { describe, expect, it } from "vitest";
import {
  BRF_PROVIDER_ORDER,
  extractJsonValue,
} from "../lib/brfIntelligencePolicy";

describe("BRF intelligence policy", () => {
  it("keeps NeMo and Nemotron ahead of fallback providers", () => {
    expect(BRF_PROVIDER_ORDER).toEqual([
      "nemo-agent",
      "nvidia-nim",
      "openrouter",
      "openai",
      "anthropic",
    ]);
  });

  it("extracts strict JSON, fenced JSON, and embedded JSON", () => {
    expect(extractJsonValue('{"ok":true}')).toEqual({ ok: true });
    expect(extractJsonValue('```json\n{"ok":true}\n```')).toEqual({
      ok: true,
    });
    expect(extractJsonValue('Result: [{"id":1}]')).toEqual([{ id: 1 }]);
  });

  it("rejects responses that contain no valid JSON", () => {
    expect(() => extractJsonValue("not json")).toThrow(
      "Provider returned invalid JSON.",
    );
  });
});
