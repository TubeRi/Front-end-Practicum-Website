import { Link } from 'react-router';
import { destinations } from '../data/destinations';
import { testimonials } from '../data/testimonials';
import FeaturedJourney from './FeaturedJourney';
export default function MainContent({onPlan}) { return <>      <section
        id="about"
        className="scroll-mt-20 border-b border-line bg-canvas"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-moss">
            The TravelPoint difference
          </p>
          <div>
            <h2 className="max-w-4xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              We believe the best journeys leave room for surprise.
            </h2>
            <div className="mt-10 grid gap-8 text-base leading-relaxed text-muted sm:grid-cols-2">
              <p>
                Our travel designers pair local knowledge with thoughtful
                pacing, creating trips that feel effortless without ever feeling
                ordinary.
              </p>
              <p>
                Stay in places with soul, meet people with stories, and travel
                in a way that gives back to every destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="journeys"
        className="bg-canvas px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-moss">
                Curated journeys
              </p>
              <h2 className="font-display text-5xl tracking-tight sm:text-6xl">
                Where will you go?
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="leading-relaxed text-muted">
                A glimpse of what’s possible. Explore every journey on our
                complete destinations page.
              </p>
              <Link
                to="/destinations"
                className="mt-5 inline-flex items-center gap-3 border-b border-ink pb-1 text-sm font-bold"
              >
                View all destinations <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {destinations.slice(0, 3).map((destination) => (
              <FeaturedJourney key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="stories"
        className="bg-ink px-5 py-16 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 lg:grid-cols-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun">
              Notes from the road
            </p>
            <h2 className="font-display text-5xl leading-tight tracking-tight sm:text-6xl">
              Journeys worth
              <br /> writing home about.
            </h2>
          </div>
          <div className="grid border-t border-white/20 md:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <figure
                key={testimonial.name}
                className={`flex min-h-96 flex-col justify-between py-9 md:px-8 ${
                  index === 0 ? "md:pl-0" : "md:border-l md:border-white/20"
                }`}
              >
                <blockquote className="font-display text-2xl leading-snug text-white/95">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span className="flex size-11 items-center justify-center rounded-full bg-sun font-bold text-ink">
                    {testimonial.initials}
                  </span>
                  <span>
                    <strong className="block text-sm font-bold">
                      {testimonial.name}
                    </strong>
                    <span className="text-sm text-white/55">
                      {testimonial.trip}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section
        id="plan"
        className="relative overflow-hidden bg-sun px-5 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-32"
      >
        <div className="absolute -right-24 -top-40 size-96 rounded-full border border-ink/15" />
        <div className="absolute -right-6 -top-24 size-72 rounded-full border border-ink/15" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-moss">
              Your journey starts here
            </p>
            <h2 className="max-w-4xl font-display text-6xl leading-none tracking-tight sm:text-7xl lg:text-8xl">
              Let’s plan something remarkable.
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="mb-7 max-w-md text-lg leading-relaxed text-ink/75">
              Tell us where you’re dreaming of. One of our travel designers will
              be in touch within two working days.
            </p>
            <button
              type="button"
              onClick={onPlan}
              className="group inline-flex cursor-pointer items-center gap-4 rounded-full bg-ink px-7 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-moss hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink active:translate-y-0 active:scale-95"
            >
              Plan your trip
              <span className="text-sun transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <span aria-hidden="true">↗</span>
              </span>
            </button>
          </div>
        </div>
      </section>

</>; }
