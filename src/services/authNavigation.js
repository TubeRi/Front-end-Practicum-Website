// Only supported internal destinations may be used after login.
export function getAuthReturnPath(value) {
  if (
    value &&
    /^\/checkout\/(success|cancel)\?order=[0-9a-f-]{36}$/i.test(value)
  )
    return value;
  if (value === "/account") return "/account";
  if (value === "/stories/write" || value === "/stories#write-review")
    return "/stories#write-review";
  if (!value || !/^\/(?:book\/[^/?#]+(?:\?[^#]*)?|stories\/write)$/.test(value))
    return "/destinations";
  try {
    const target = new URL(value, "https://travelpoint.invalid");
    const allowed =
      target.pathname === "/stories/write" ||
      /^\/book\/[^/]+$/.test(target.pathname);
    if (target.origin !== "https://travelpoint.invalid" || !allowed)
      return "/destinations";
    return target.pathname + target.search;
  } catch {
    return "/destinations";
  }
}
