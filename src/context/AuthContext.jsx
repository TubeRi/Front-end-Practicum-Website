import { createContext, useContext, useEffect, useState } from "react";
import { api, authenticate } from "../services/integrations";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api("/auth/get-session")
      .then((session) => {
        if (active) setUser(session?.user || null);
      })
      .catch((issue) => {
        if (active) setError(issue.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function signIn(mode, credentials) {
    const result = await authenticate(mode, credentials);
    setUser(result.user);
    setError("");
    return { ...result, authenticated: Boolean(result.user?.id) };
  }
  async function signOut() {
    try {
      await api("/auth/sign-out", { method: "POST", body: "{}" });
      setUser(null);
      setError("");
    } catch (issue) {
      setError("Sign out failed. Please try again.");
    }
  }
  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut }}>
      {error && (
        <p
          role="alert"
          className="fixed bottom-3 left-3 z-[100] max-w-sm border border-line bg-white p-4 text-sm text-red-800"
        >
          {error}
        </p>
      )}
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
