import { useState } from "react"
import BookingModal from "./BookingModal"
import QuantityStepper from "./QuantityStepper"

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

function DestinationCard({ destination, initialTravelers = 1 }) {
  const [travelers, setTravelers] = useState(initialTravelers)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const totalPrice = destination.price * travelers

  return (
    <>
      <article className="group flex min-w-0 flex-col bg-white shadow-[0_12px_35px_rgba(8,21,19,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(8,21,19,0.12)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          <img
            src={destination.image}
            alt={destination.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 bg-canvas/95 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-ink backdrop-blur-sm">
            {destination.category}
          </span>
          <span className="absolute right-3 top-3 bg-night/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
            ★ {destination.rating}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-moss">
            {destination.location}, {destination.country}
          </p>
          <h2 className="mt-2 font-display text-3xl leading-tight">
            {destination.name}
          </h2>
          <p className="mt-3 line-clamp-3 leading-relaxed text-muted">
            {destination.description}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 border-y border-line py-4 text-sm">
            <span className="text-muted">{destination.duration} days</span>
            <span className="text-right">
              <strong className="block text-lg text-ink">
                {euro.format(destination.price)}
              </strong>
              <span className="text-xs text-muted">per person</span>
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">
                Travelers
              </span>
              <QuantityStepper
                value={travelers}
                onChange={setTravelers}
                min={1}
                max={10}
              />
            </div>
            <div className="text-right">
              <span className="block text-xs uppercase tracking-widest text-muted">
                Trip total
              </span>
              <strong className="font-display text-2xl">
                {euro.format(totalPrice)}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="group/button mt-6 flex w-full cursor-pointer items-center justify-between bg-ink px-5 py-4 font-bold text-white outline-none transition-colors hover:bg-moss focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            View details & book
            <span
              className="text-sun transition-transform group-hover/button:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>
      </article>

      {detailsOpen && (
        <BookingModal
          destination={destination}
          travelers={travelers}
          onTravelersChange={setTravelers}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </>
  )
}

export default DestinationCard
