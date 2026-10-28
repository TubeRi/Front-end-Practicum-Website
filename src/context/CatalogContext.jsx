import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/integrations";
const CatalogContext = createContext(null);
export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(null),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setError("");
    api("/destinations")
      .then((result) => {
        if (active) setCatalog(result);
      })
      .catch((issue) => {
        if (active) setError(issue.message);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  if (!catalog)
    return (
      <main className="min-h-screen bg-canvas px-6 py-24 text-ink">
        <h1 className="font-display text-3xl">
          {error ? "Unable to load journeys" : "Loading journeys…"}
        </h1>
        {error && (
          <>
            <p role="alert" className="my-5">
              {error}
            </p>
            <button
              onClick={() => setAttempt((n) => n + 1)}
              className="bg-ink px-5 py-3 text-white"
            >
              Try again
            </button>
          </>
        )}
      </main>
    );
  return (
    <CatalogContext.Provider
      value={{
        destinations: catalog.destinations,
        destinationCategories: catalog.categories,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}
export const useCatalog = () => useContext(CatalogContext);
