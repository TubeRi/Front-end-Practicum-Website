import { useEffect, useRef, useState } from "react"
import { requestBooking } from "../services/integrations"
import QuantityStepper from "./QuantityStepper"

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

const fieldClass =
  "mt-2 h-12 w-full border border-line bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-moss focus:ring-1 focus:ring-moss"

function BookingModal({ destination, travelers, onTravelersChange, onClose }) {
  const dialogRef = useRef(null);
  const [pending, setPending] = useState(false);
  const [travelDate, setTravelDate] = useState(destination.dates[0])
  const [customerName, setCustomerName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const totalPrice = destination.price * travelers

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    if (submitted) dialogRef.current?.querySelector('#booking-title')?.focus();
  }, [submitted]);

  const validate = () => {
    const nextErrors = {}

    if (!travelDate) nextErrors.travelDate = "Choose an available travel date."
    if (!customerName.trim()) nextErrors.customerName = "Enter your full name."
    if (!email.trim()) {
      nextErrors.email = "Enter your email address."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setPending(true);
    try {
      await requestBooking({destinationId: destination.id, travelDate, travelers, customerName, email});
      setSubmitted(true);
    } catch { setErrors({submission: 'Unable to prepare the demo summary. Please try again.'}); }
    finally { setPending(false); }
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={event => { event.preventDefault(); onClose(); }}
      aria-labelledby="booking-title"
      className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-screen max-w-none items-center justify-center border-0 bg-transparent p-3 text-ink backdrop:bg-night/80 backdrop:backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="max-h-full w-full max-w-4xl overflow-y-auto bg-canvas shadow-2xl"

      >
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
              Demo summary ready
            </p>
            <h2
              id="booking-title" tabIndex={-1}
              className="mx-auto mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl"
            >
              Your {destination.name} trip summary is ready.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
              No reservation or email has been sent. No payment was taken and no personal information has been stored.
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
            <button
              type="button"
              onClick={onClose}
              className="mt-8 cursor-pointer bg-night px-7 py-4 font-bold text-white outline-none transition-all hover:-translate-y-0.5 hover:bg-moss focus-visible:ring-2 focus-visible:ring-night focus-visible:ring-offset-2 active:translate-y-0"
            >
              Continue exploring
            </button>
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
                  id="booking-title" tabIndex={-1}
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
              <p className="mb-5 text-sm text-muted">Frontend demonstration. Submit to preview a summary; no booking is created.</p>
              {errors.submission && <p role="alert">{errors.submission}</p>}
              <p className="text-xs font-bold uppercase tracking-widest text-moss">
                Booking request
              </p>
              <h3 className="mt-2 font-display text-3xl">Choose your place</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Submit a no-obligation request. This frontend demonstration does
                not process payments or save bookings.
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
                Sample travel date
                <select
                  value={travelDate}
                  onChange={(event) => {
                    setTravelDate(event.target.value)
                    setErrors((current) => ({
                      ...current,
                      travelDate: undefined,
                    }))
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
                      setCustomerName(event.target.value)
                      setErrors((current) => ({
                        ...current,
                        customerName: undefined,
                      }))
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
                      setEmail(event.target.value)
                      setErrors((current) => ({
                        ...current,
                        email: undefined,
                      }))
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
                  type="submit" disabled={pending}
                  className="cursor-pointer bg-sun px-6 py-4 font-bold text-night outline-none transition-all hover:-translate-y-0.5 hover:bg-night hover:text-white focus-visible:ring-2 focus-visible:ring-night focus-visible:ring-offset-2 active:translate-y-0"
                >
                  Preview booking request
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </dialog>
  )
}

export default BookingModal
