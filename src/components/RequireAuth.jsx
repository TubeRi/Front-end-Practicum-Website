import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children }) {
  const { user } = useAuth();
  const { pathname, search } = useLocation();

  if (!user) {
    const returnTo = encodeURIComponent(pathname + search);
    return <Navigate replace to={`/login?returnTo=${returnTo}`} />;
  }

  return children;
}
