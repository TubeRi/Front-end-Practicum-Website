import { createContext, useContext, useState } from 'react';
import { authenticate } from '../services/integrations';
import { demoAdmin, demoLoginEnabled, demoSessionKey } from '../services/demoAuth';

const AuthContext = createContext(null);

function restoreDemoSession() {
  if (!demoLoginEnabled || typeof window === 'undefined') return null;
  try { return sessionStorage.getItem(demoSessionKey) === 'admin' ? demoAdmin : null; }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreDemoSession);

  async function signIn(mode, credentials) {
    const result = await authenticate(mode, credentials);
    const authenticated = Boolean(result.user?.id && (result.connected === true || (demoLoginEnabled && result.demo === true)));
    if (authenticated) {
      setUser(result.user);
      if (result.demo) {
        try { sessionStorage.setItem(demoSessionKey, 'admin'); } catch { /* In-memory login still works. */ }
      }
    }
    return { ...result, authenticated };
  }

  function signOut() {
    setUser(null);
    try { sessionStorage.removeItem(demoSessionKey); } catch { /* No stored session to clear. */ }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
