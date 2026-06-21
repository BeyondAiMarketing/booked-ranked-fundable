import { ErrorBoundary } from "@/components/ErrorBoundary";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div data-testid="child">Child content</div>;
}

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Normal content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });

  it("catches errors and shows fallback UI", () => {
    // Suppress console.error for this test since ErrorBoundary logs errors
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We apologize for the inconvenience. Please try reloading the page.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Reload Page")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("displays error message in fallback UI", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test error")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("has reload button with correct data-ocid", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    const reloadButton = screen.getByText("Reload Page");
    expect(reloadButton).toHaveAttribute("data-ocid", "error.reload_button");

    consoleSpy.mockRestore();
  });
});
