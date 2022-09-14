import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export const RequireAuth = () => {
  const authStore = useAuth();
  const location = useLocation();

  if (!authStore?.user) {
    return <Navigate to={{ pathname: "/" }} state={{ location }} replace />;
  }

  return <Outlet />;
};
