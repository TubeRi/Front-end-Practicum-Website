import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { api } from "../services/integrations";
import { useAccount } from "../context/AccountContext";
import PayTripButton from "../components/account/PayTripButton";

const money = (amount, currency) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

export default function CheckoutResult({ cancelled = false }) {
  const [params] = useSearchParams();
  const id = params.get("order") || "";
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [finishedWaiting, setFinishedWaiting] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { refreshAccount } = useAccount();

  useEffect(() => {
    let active = true;
    let timer;
    let checks = 0;
    setOrder(null);
    setError("");
    setFinishedWaiting(false);
    async function check() {
      try {
        const result = await api("/orders/" + encodeURIComponent(id));
        if (!active) return;
        setOrder(result.order);
        if (result.order.status === "paid") {
          refreshAccount().catch(() => {});
          return;
        }
        checks += 1;
        if (result.order.status === "pending" && !cancelled && checks < 12)
          timer = setTimeout(check, 2000);
        else setFinishedWaiting(true);
      } catch (issue) {
        if (active) {
          setError(issue.message);
          setFinishedWaiting(true);
        }
      }
    }
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      )
    )
      setError("This order link is invalid.");
    else check();
    return () => {
      active = false;
      clearTimeout(timer);
    };
    // An order is read only here. The Stripe webhook is responsible for payment status.
  }, [id, cancelled, attempt]);

  const paid = order?.status === "paid";
  const title = paid
    ? "Your test payment is confirmed."
    : error
      ? "Unable to load your order."
      : cancelled
        ? "You left checkout."
        : order?.status === "expired"
          ? "This checkout has expired."
          : order?.status === "failed"
            ? "Payment was not completed."
            : finishedWaiting
              ? "Payment confirmation is still pending."
              : "Confirming your payment…";
  return (
    <main className="min-h-[70vh] bg-canvas px-5 py-16 sm:px-6 sm:py-24">
      <section
        className="mx-auto max-w-3xl border border-line bg-white p-6 sm:p-10"
        aria-labelledby="order-heading"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-moss">
          Stripe test checkout · No real money
        </p>
        <h1
          id="order-heading"
          className="mt-4 font-display text-4xl leading-tight sm:text-5xl"
          aria-live="polite"
        >
          {title}
        </h1>
        {paid ? (
          <p className="mt-5 text-muted">
            Stripe confirmed your test payment. Your paid trip is saved in My
            trips. This is a course demonstration, not a supplier-confirmed
            travel reservation.
          </p>
        ) : (
          <p className="mt-5 text-muted">
            {cancelled
              ? "Your trip request is saved. Leaving checkout does not mark it as paid."
              : "We show Paid only after Stripe sends a verified payment confirmation. You can return to your profile and check again later."}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-5 text-red-800">
            {error}
          </p>
        )}
        {order && (
          <div className="mt-7 border-y border-line py-6">
            <p className="break-all text-xs text-muted">
              Order reference: {order.id}
            </p>
            <p className="mt-3 text-sm">
              Status: <strong className="capitalize">{order.status}</strong>
            </p>
            <ul className="mt-5 space-y-4">
              {order.items.map((item) => (
                <li
                  key={item.destinationId}
                  className="flex flex-wrap justify-between gap-3"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <strong>
                    {money(item.unitPriceCents * item.quantity, order.currency)}
                  </strong>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex justify-between gap-4 text-lg">
              <span>Total</span>
              <strong>{money(order.totalCents, order.currency)}</strong>
            </p>
          </div>
        )}
        {!paid && (finishedWaiting || error) && (
          <button
            onClick={() => setAttempt((value) => value + 1)}
            className="mt-6 border border-ink px-5 py-3 text-sm font-bold transition-colors hover:bg-sand"
          >
            Check status again
          </button>
        )}
        {cancelled && order?.status === "pending" && (
          <PayTripButton bookingId={order.bookingId} />
        )}
        <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold">
          <Link
            to="/account#my-trips"
            className="border-b border-ink py-2 hover:text-moss"
          >
            View My trips
          </Link>
          <Link
            to="/destinations"
            className="border-b border-ink py-2 hover:text-moss"
          >
            Continue exploring
          </Link>
        </div>
      </section>
    </main>
  );
}
