import { useAuth } from "../Context/AuthContext";
import { AlertCircle } from "lucide-react";

/**
 * ProtectedComponent - Shows content only if user has required role(s)
 * @param {string | string[]} requiredRoles - Single role or array of roles
 * @param {ReactNode} children - Content to display if authorized
 * @param {ReactNode} fallback - Content to display if not authorized
 */
export function ProtectedComponent({ requiredRoles, children, fallback = null }) {
  const { hasRole } = useAuth();

  if (!hasRole(requiredRoles)) {
    return fallback || <AccessDenied />;
  }

  return children;
}

/**
 * AdminOnly - Shows content only for admin users
 */
export function AdminOnly({ children, fallback = null }) {
  return (
    <ProtectedComponent requiredRoles="admin" fallback={fallback}>
      {children}
    </ProtectedComponent>
  );
}

/**
 * Default Access Denied component
 */
function AccessDenied() {
  return (
    <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-600/50 rounded-lg">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <p className="text-red-400">You don't have permission to access this content.</p>
    </div>
  );
}
