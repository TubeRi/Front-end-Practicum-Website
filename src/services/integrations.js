export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch("/api" + path, {
      credentials: "include",
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }
  if (!response.headers.get("content-type")?.includes("application/json"))
    throw new Error(
      "The API is unavailable. Check that the backend server is running.",
    );
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "The request could not be completed.");
  return result;
}
export async function authenticate(mode, credentials) {
  const result = await api(
    "/auth/" + (mode === "signup" ? "sign-up/email" : "sign-in/email"),
    { method: "POST", body: JSON.stringify(credentials) },
  );
  return { ...result, connected: true };
}
export const requestBooking = (details) =>
  api("/bookings", { method: "POST", body: JSON.stringify(details) });
export const requestTestimonial = (details) =>
  api("/reviews", {
    method: "POST",
    body: JSON.stringify({
      name: details.name,
      rating: Number(details.rating),
      quote: details.quote,
    }),
  });
