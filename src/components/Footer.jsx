import { Link } from "react-router"

function Footer() {
  return (
    <footer className="border-t border-line bg-canvas px-5 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 text-sm text-muted sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link
            to="/"
            className="font-display text-2xl text-ink outline-none focus-visible:ring-2 focus-visible:ring-moss"
          >
            TravelPoint
          </Link>
          <p className="mt-3 max-w-xs leading-relaxed">
            Considered journeys, made personal by people who know the places.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-moss">
            Explore
          </p>
          <div className="flex flex-col items-start gap-2">
            <Link
              className="hover:text-ink focus-visible:text-ink"
              to="/#about"
            >
              About
            </Link>
            <Link
              className="hover:text-ink focus-visible:text-ink"
              to="/destinations"
            >
              Countries
            </Link>
            <Link
              className="hover:text-ink focus-visible:text-ink"
              to="/stories"
            >
              Traveler stories
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-moss">
            Talk to us
          </p>
          <div className="flex flex-col items-start gap-2">
            <a
              className="hover:text-ink focus-visible:text-ink"
              href="mailto:hello@travelpoint.travel"
            >
              hello@travelpoint.travel
            </a>
            <a
              className="hover:text-ink focus-visible:text-ink"
              href="tel:+351210000000"
            >
              +351 210 000 000
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-line pt-5 text-xs text-muted">
        © 2026 TravelPoint. Course project. Booking requests are saved; payments are not processed.
      </div>
    </footer>
  )
}

export default Footer
