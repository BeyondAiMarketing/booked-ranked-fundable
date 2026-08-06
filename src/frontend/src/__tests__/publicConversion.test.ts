import { describe, expect, it } from "vitest";
import { isBookingConflict } from "../lib/publicConversionApi";
import {
  formatAvailabilitySlot,
  normalizeEmail,
  normalizePhone,
  normalizeWebsite,
} from "../../netlify/functions/_shared/public-conversion.mts";

describe("public conversion normalization", () => {
  it("normalizes email addresses", () => {
    expect(normalizeEmail("  OWNER@Example.COM ")).toBe("owner@example.com");
  });

  it("normalizes US phone numbers with country code 1", () => {
    expect(normalizePhone("(760) 555-0100")).toBe("17605550100");
  });

  it("normalizes websites to canonical hostnames", () => {
    expect(normalizeWebsite("https://www.Example.com/services/?utm=1")).toBe(
      "example.com",
    );
  });

  it("formats slots in Pacific time instead of the browser timezone", () => {
    const slot = formatAvailabilitySlot(
      "2026-08-10T16:00:00.000Z",
      "America/Los_Angeles",
    );
    expect(slot.dateKey).toBe("2026-08-10");
    expect(slot.timeLabel).toBe("9:00 AM");
  });
});

describe("booking conflict handling", () => {
  it("identifies a backend slot conflict for UI recovery", () => {
    expect(
      isBookingConflict({
        ok: false,
        outcome: "slot_conflict",
        error: "That time was just booked.",
      }),
    ).toBe(true);
  });
});
