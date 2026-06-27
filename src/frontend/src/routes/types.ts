import type { ReactNode } from "react";

/** Signature of the ProtectedRoute component used to guard route modules. */
export type ProtectedRouteWrapper = (props: {
  children: ReactNode;
  adminOnly?: boolean;
}) => ReactNode;
