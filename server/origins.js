// Vite prints 127.0.0.1, while the setup guide uses localhost. Both names
// point to this computer, but browsers send different Origin headers for them.
export function trustedOrigins(
  origin,
  production = process.env.NODE_ENV === "production",
) {
  const url = new URL(origin);
  const origins = [url.origin];
  if (!production && ["localhost", "127.0.0.1"].includes(url.hostname)) {
    url.hostname = url.hostname === "localhost" ? "127.0.0.1" : "localhost";
    origins.push(url.origin);
  }
  return origins;
}
