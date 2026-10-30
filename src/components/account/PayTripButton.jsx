import { useState } from "react";
import { startCheckout } from "../../services/checkout";

export default function PayTripButton({ bookingId }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function pay() {
    setError("");
    setPending(true);
    try {
      await startCheckout(bookingId);
    } catch (issue) {
      setError(issue.message);
      setPending(false);
    }
  }
  return (
    <div className="mt-4">
      <button
        type="button"
        disabled={pending}
        onClick={pay}
        className="bg-ink px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-moss disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Opening checkout…" : "Pay with Stripe (test)"}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
