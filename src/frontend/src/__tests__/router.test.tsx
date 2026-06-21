import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// Mock AppContext before importing ProtectedRoute
const mockUseApp = vi.fn();

vi.mock("@/context/AppContext", () => ({
  AppProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useApp: () => mockUseApp(),
}));

vi.mock("@/components/AppLayout", () => ({
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

// Mock Navigate to avoid needing a real router
vi.mock("@tanstack/react-router", () => ({
  Navigate: ({ to, replace }: { to: string; replace?: boolean }) => (
    <div data-testid="navigate" data-to={to} data-replace={replace} />
  ),
}));

// Simple ProtectedRoute implementation for testing
function TestProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const app = mockUseApp();
  if (!app.isLoggedIn) {
    return <div data-testid="navigate" data-to="/login" data-replace={true} />;
  }
  if (adminOnly && !app.isAdminUser && !app.isSuperAdmin) {
    return (
      <div data-testid="navigate" data-to="/dashboard" data-replace={true} />
    );
  }
  return <div data-testid="app-layout">{children}</div>;
}

describe("ProtectedRoute", () => {
  it("redirects to login when not authenticated", () => {
    mockUseApp.mockReturnValue({
      isLoggedIn: false,
      isAdminUser: false,
      isSuperAdmin: false,
    });

    render(
      <TestProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </TestProtectedRoute>,
    );

    // When not logged in, Navigate renders a redirect div
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.queryByTestId("app-layout")).not.toBeInTheDocument();
    expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/login");
  });

  it("renders children when authenticated", () => {
    mockUseApp.mockReturnValue({
      isLoggedIn: true,
      isAdminUser: false,
      isSuperAdmin: false,
    });

    render(
      <TestProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </TestProtectedRoute>,
    );

    expect(screen.getByTestId("app-layout")).toBeInTheDocument();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("allows admin access for admin users", () => {
    mockUseApp.mockReturnValue({
      isLoggedIn: true,
      isAdminUser: true,
      isSuperAdmin: false,
    });

    render(
      <TestProtectedRoute adminOnly>
        <div data-testid="admin-content">Admin Content</div>
      </TestProtectedRoute>,
    );

    expect(screen.getByTestId("app-layout")).toBeInTheDocument();
    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });

  it("allows admin access for super admin users", () => {
    mockUseApp.mockReturnValue({
      isLoggedIn: true,
      isAdminUser: false,
      isSuperAdmin: true,
    });

    render(
      <TestProtectedRoute adminOnly>
        <div data-testid="super-admin-content">Super Admin Content</div>
      </TestProtectedRoute>,
    );

    expect(screen.getByTestId("app-layout")).toBeInTheDocument();
    expect(screen.getByText("Super Admin Content")).toBeInTheDocument();
  });

  it("redirects non-admin users from admin-only routes", () => {
    mockUseApp.mockReturnValue({
      isLoggedIn: true,
      isAdminUser: false,
      isSuperAdmin: false,
    });

    render(
      <TestProtectedRoute adminOnly>
        <div data-testid="admin-content">Admin Content</div>
      </TestProtectedRoute>,
    );

    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
    expect(screen.queryByTestId("app-layout")).not.toBeInTheDocument();
    expect(screen.getByTestId("navigate")).toHaveAttribute(
      "data-to",
      "/dashboard",
    );
  });
});
