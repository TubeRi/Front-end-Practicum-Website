import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const { pathname, search } = useLocation();

  if (loading)
    return <main className="px-6 py-24">Checking your session…</main>;
  if (!user) {
    const returnTo = encodeURIComponent(pathname + search);
    return <Navigate replace to={`/login?returnTo=${returnTo}`} />;
  }

  return children;
}
