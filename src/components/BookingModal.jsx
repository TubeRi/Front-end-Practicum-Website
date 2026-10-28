import { Link } from "react-router";
import { useAccount } from "../context/AccountContext";
import { useEffect, useRef, useState } from "react";
import { requestBooking } from "../services/integrations";
import { useAuth } from "../context/AuthContext";
import QuantityStepper from "./QuantityStepper";

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const fieldClass =
  "mt-2 h-12 w-full border border-line bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-moss focus:ring-1 focus:ring-moss";

function BookingModal({ destination, travelers, onTravelersChange, onClose }) {
  const { user } = useAuth();
  const { profile, paymentMethods, defaultPaymentId, refreshAccount } =
    useAccount();
  const [paymentMethodId, setPaymentMethodId] = useState(defaultPaymentId);
  const requestId = useRef(crypto.randomUUID());
  const dialogRef = useRef(null);
  const [pending, setPending] = useState(false);
  const [travelDate, setTravelDate] = useState(destination.dates[0]);
  const [customerName, setCustomerName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const totalPrice = destination.price * travelers;

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    if (submitted) dialogRef.current?.querySelector("#booking-title")?.focus();
  }, [submitted]);

  const validate = () => {
    const nextErrors = {};

    if (!travelDate) nextErrors.travelDate = "Choose an available travel date.";
    if (!customerName.trim()) nextErrors.customerName = "Enter your full name.";
    if (!email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setErrors({ submission: "Please log in before booking this trip." });
      return;
    }
    if (!validate()) return;
    setPending(true);
    try {
      await requestBooking(
        {
          destinationId: destination.id,
          travelDate,
          travelers,
          customerName,
          email,
          paymentMethodId,
          requestId: requestId.current,
        },
        user,
      );
      refreshAccount().catch(() => {});
      setSubmitted(true);
    } catch (issue) {
      setErrors({ submission: issue.message });
    } finally {
      setPending(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby="booking-title"
      className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-screen max-w-none items-center justify-center border-0 bg-transparent p-3 text-ink backdrop:bg-night/80 backdrop:backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="max-h-full w-full max-w-4xl overflow-y-auto bg-canvas shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas px-5 py-4 sm:px-7">
          <p className="text-xs font-bold uppercase tracking-widest text-moss">
            Journey details
          </p>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border border-line px-4 py-2 text-sm font-bold outline-none transition-colors hover:border-ink hover:bg-ink hover:text-white focus-visible:ring-2 focus-visible:ring-ink"
          >
            Close
          </button>
        </div>

        {submitted ? (
          <div className="px-5 py-14 text-center sm:px-10 sm:py-20">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-sun font-display text-2xl">
              ✓
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-moss">
              Booking request saved
            </p>
            <h2
              id="booking-title"
              tabIndex={-1}
              className="mx-auto mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl"
            >
              Your {destination.name} booking request is saved.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
              Your unpaid booking request has been saved to your account. You
              can find it in My trips. No payment has been charged.
            </p>
            <div className="mx-auto mt-7 max-w-md border-y border-line py-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">Travelers</span>
                <strong>{travelers}</strong>
              </div>
              <div className="mt-3 flex justify-between gap-4">
                <span className="text-muted">Trip total</span>
                <strong>{euro.format(totalPrice)}</strong>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
              <Link
                to="/account#my-trips"
                className="cursor-pointer border-b border-ink px-3 py-2 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:border-moss hover:bg-moss/10 hover:text-moss focus-visible:bg-moss/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transform-none motion-reduce:transition-none"
              >
                View My trips
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full cursor-pointer bg-night px-7 py-4 font-bold text-white outline-none transition-all hover:-translate-y-0.5 hover:bg-moss focus-visible:ring-2 focus-visible:ring-night focus-visible:ring-offset-2 active:translate-y-0 sm:w-auto"
              >
                Continue exploring
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-ink text-white">
              <img
                src={destination.image}
                alt={destination.alt}
                className="aspect-[16/9] w-full object-cover lg:aspect-[4/3]"
              />
              <div className="p-5 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-sun">
                  {destination.location}, {destination.country}
                </p>
                <h2
                  id="booking-title"
                  tabIndex={-1}
                  className="mt-3 font-display text-4xl leading-tight"
                >
                  {destination.name}
                </h2>
                <p className="mt-4 leading-relaxed text-white/70">
                  {destination.description}
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-5 text-sm">
                  <div>
                    <span className="block text-white/50">Length</span>
                    <strong className="mt-1 block">
                      {destination.duration} days
                    </strong>
                  </div>
                  <div>
                    <span className="block text-white/50">Rating</span>
                    <strong className="mt-1 block">
                      {destination.rating} / 5
                    </strong>
                  </div>
                  <div>
                    <span className="block text-white/50">Style</span>
                    <strong className="mt-1 block">
                      {destination.category}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-7">
              <p className="mb-5 text-sm text-muted">
                Your request will be saved in My trips. Payment and final travel
                confirmation are handled later.
              </p>
              {errors.submission && <p role="alert">{errors.submission}</p>}
              <p className="text-xs font-bold uppercase tracking-widest text-moss">
                Booking request
              </p>
              <h3 className="mt-2 font-display text-3xl">Choose your place</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Submit a booking request. Your trip will be saved to your
                account as unpaid.
              </p>

              <label className="mt-6 block text-sm font-bold">
                Selected destination
                <input
                  value={`${destination.location}, ${destination.country}`}
                  readOnly
                  className={`${fieldClass} text-muted`}
                />
              </label>

              <label className="mt-5 block text-sm font-bold">
                Available departure
                <select
                  value={travelDate}
                  onChange={(event) => {
                    setTravelDate(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      travelDate: undefined,
                    }));
                  }}
                  className={fieldClass}
                  aria-invalid={Boolean(errors.travelDate)}
                >
                  {destination.dates.map((date) => (
                    <option key={date} value={date}>
                      {new Intl.DateTimeFormat("en-IE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(`${date}T12:00:00`))}
                    </option>
                  ))}
                </select>
                {errors.travelDate && (
                  <span className="mt-2 block text-xs font-medium text-red-700">
                    {errors.travelDate}
                  </span>
                )}
              </label>

              <div className="mt-5">
                <span className="block text-sm font-bold">Travelers</span>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <QuantityStepper
                    value={travelers}
                    onChange={onTravelersChange}
                  />
                  <span className="text-sm text-muted">
                    {euro.format(destination.price)} per person
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-bold">
                  Customer name
                  <input
                    value={customerName}
                    onChange={(event) => {
                      setCustomerName(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        customerName: undefined,
                      }));
                    }}
                    className={fieldClass}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.customerName)}
                  />
                  {errors.customerName && (
                    <span className="mt-2 block text-xs font-medium text-red-700">
                      {errors.customerName}
                    </span>
                  )}
                </label>
                <label className="block text-sm font-bold">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        email: undefined,
                      }));
                    }}
                    className={fieldClass}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <span className="mt-2 block text-xs font-medium text-red-700">
                      {errors.email}
                    </span>
                  )}
                </label>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="booking-payment"
                  className="block text-sm font-bold"
                >
                  Preferred payment method (for later)
                  <select
                    id="booking-payment"
                    value={paymentMethodId}
                    onChange={(event) => setPaymentMethodId(event.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Choose later</option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="mt-2 text-xs text-muted">
                  Preference only. This does not confirm payment.{" "}
                  <Link to="/account#payment-methods" className="underline">
                    Manage payment preferences
                  </Link>
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="block text-xs uppercase tracking-widest text-muted">
                    Total price
                  </span>
                  <strong className="font-display text-3xl">
                    {euro.format(totalPrice)}
                  </strong>
                </div>
                <button
                  type="submit"
                  disabled={pending || !destination.dates.length}
                  className="cursor-pointer bg-sun px-6 py-4 font-bold text-night outline-none transition-all hover:-translate-y-0.5 hover:bg-night hover:text-white focus-visible:ring-2 focus-visible:ring-night focus-visible:ring-offset-2 active:translate-y-0"
                >
                  {pending ? "Saving…" : "Save booking request"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </dialog>
  );
}

export default BookingModal;
