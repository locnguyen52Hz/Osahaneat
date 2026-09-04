import { Navigate } from "react-router-dom";

import { useAuthStore } from "../stores/Auth/useAuthStore";

function PrivateRouter({ children, allowedRoles }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.role);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

export default PrivateRouter;
