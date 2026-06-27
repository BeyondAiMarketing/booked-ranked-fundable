import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import AppLayout from "./components/AppLayout";
import WeeklyReportPanel from "./components/WeeklyReportPanel";
import { Toaster } from "./components/ui/sonner";
import { AppProvider, useApp } from "./context/AppContext";
import { CredentialsProvider } from "./context/CredentialsContext";
import { useActor } from "./hooks/useActor";
import { buildAdminRoutes } from "./routes/adminRoutes";
import { buildAppRoutes } from "./routes/appRoutes";
import { buildPublicRoutes } from "./routes/publicRoutes";
import { buildSocialRoutes } from "./routes/socialRoutes";
import { setBackendActor } from "./services/audioService";

/**
 * ActorBridge — wires the backend actor into audioService once available.
 * Renders nothing; lives inside the root layout to get actor access.
 * Registered once at root so setBackendActor is called exactly once per session.
 */
function ActorBridge() {
  const { actor } = useActor();
  useEffect(() => {
    if (!actor) return;
    setBackendActor({
      getCachedAudio: (key: string) =>
        actor.getCachedAudio(key) as Promise<string | null>,
      setCachedAudio: (key: string, base64Audio: string) =>
        actor.setCachedAudio(key, base64Audio) as Promise<void>,
    });
  }, [actor]);
  return null;
}

function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { isLoggedIn, isAdminUser, isSuperAdmin } = useApp();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  // Super admin has access to everything — never redirect them
  if (adminOnly && !isAdminUser && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <AppLayout>{children}</AppLayout>;
}


const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <CredentialsProvider>
        <ActorBridge />
        <Outlet />
        <WeeklyReportPanel />
        <Toaster />
      </CredentialsProvider>
    </AppProvider>
  ),
});

const routeTree = rootRoute.addChildren([
  ...buildPublicRoutes(rootRoute),
  ...buildSocialRoutes(rootRoute, ProtectedRoute),
  ...buildAdminRoutes(rootRoute, ProtectedRoute),
  ...buildAppRoutes(rootRoute, ProtectedRoute),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
