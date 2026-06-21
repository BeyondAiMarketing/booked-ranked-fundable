import { describe, expect, it } from "vitest";

describe("Example test suite", () => {
  it("should pass a basic assertion", () => {
    expect(2 + 2).toBe(4);
  });

  it("should handle async operations", async () => {
    const result = await Promise.resolve("hello");
    expect(result).toBe("hello");
  });

  it("should work with objects", () => {
    const user = { name: "Test User", role: "admin" };
    expect(user).toHaveProperty("name");
    expect(user.role).toBe("admin");
  });
});
