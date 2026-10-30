import { api } from "./integrations";

export async function startCheckout(bookingId) {
  const result = await api("/checkout", {
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
  if (result.paid || result.pendingConfirmation) {
    window.location.assign(
      "/checkout/success?order=" + encodeURIComponent(result.orderId),
    );
    return;
  }
  // The backend supplies a Stripe URL; keep a second guard at the browser boundary.
  const target = new URL(result.url);
  if (target.origin !== "https://checkout.stripe.com")
    throw new Error("Unable to open Stripe checkout. Please try again.");
  window.location.assign(target.href);
}
