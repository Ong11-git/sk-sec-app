import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />; // not logged in → go to login
  }

  return <Outlet />; // logged in → render child routes
}
