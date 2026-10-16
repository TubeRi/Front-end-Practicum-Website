import { Link } from 'react-router';
import { destinations } from '../data/destinations';
import DestinationCard from './DestinationCard';

export default function MainContent({ onPlan }) {
  return (
    <>
      <section id="about" className="grid gap-5 border-b border-forest/15 py-[60px] min-[601px]:grid-cols-[1.1fr_1fr] min-[601px]:gap-10 min-[601px]:py-[90px] min-[901px]:gap-[100px] [&_h2]:mb-0 [&_h2]:text-[clamp(32px,3vw,42px)] mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
            <div>
                <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">The TravelPoint difference</p>
                <h2>We believe the best journeys leave room for surprise.</h2>
            </div>
            <div className="text-muted min-[601px]:pt-[30px] [&_p:last-child]:mb-0">
                <p>Our travel designers pair local knowledge with thoughtful pacing, creating trips that feel effortless without ever feeling ordinary.</p>
                <p>Stay in places with soul, meet people with stories, and travel in a way that gives back to every destination.</p>
            </div>
        </section>

        <section id="journeys" className="bg-cream px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#44695b]">Curated journeys</p>
                <h2 className="mb-0 font-display text-5xl tracking-tight sm:text-6xl">Where will you go?</h2>
              </div>
              <div className="max-w-sm">
                <p className="mb-0 leading-relaxed text-muted">A glimpse of what’s possible. Explore every journey on our complete destinations page.</p>
                <Link className="mt-5 inline-flex items-center gap-3 border-b border-forest pb-1 text-sm font-bold" to="/destinations">View all destinations <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {destinations.filter(destination => destination.featured).map(destination => (
                <DestinationCard key={destination.id} destination={destination} compact />
              ))}
            </div>
          </div>
        </section>

        <section id="stories" className="bg-forest py-[60px] text-white min-[601px]:py-[85px] [&_.eyebrow]:text-gold">
            <div className="mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
                <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Notes from the road</p>
                <h2>Journeys worth<br />writing home about.</h2>
                <div className="mt-[45px] grid grid-cols-1 gap-6 min-[601px]:grid-cols-3 min-[901px]:gap-9 [&_figure]:flex [&_figure]:flex-col [&_figure]:border-t [&_figure]:border-white/20 [&_figure]:pt-[26px] [&_blockquote]:mb-[30px] [&_blockquote]:font-serif [&_blockquote]:text-xl [&_figcaption]:mt-auto [&_figcaption]:flex [&_figcaption]:items-center [&_figcaption]:gap-3.5 [&_figcaption]:text-sm [&_small]:block [&_small]:text-xs [&_small]:text-white/60">
                    <figure>
                        <blockquote>“Every detail felt considered, but never over-planned. We found the tiny places we would never have discovered on our own.”</blockquote>
                        <figcaption><span className="avatar grid size-[42px] shrink-0 place-items-center rounded-full bg-white/10 text-xs text-gold" aria-hidden="true">MT</span><div>Maya &amp; Tom<small>Japan, Spring 2024</small></div></figcaption>
                    </figure>
                    <figure>
                        <blockquote>“Our Patagonia trip struck the perfect balance between wild adventure and genuine comfort. We are still talking about it.”</blockquote>
                        <figcaption><span className="avatar grid size-[42px] shrink-0 place-items-center rounded-full bg-white/10 text-xs text-gold" aria-hidden="true">ER</span><div>Elena R.<small>Patagonia, Autumn 2024</small></div></figcaption>
                    </figure>
                    <figure>
                        <blockquote>“From the first conversation, we felt listened to. The result was less like a holiday and more like a story written for us.”</blockquote>
                        <figcaption><span className="avatar grid size-[42px] shrink-0 place-items-center rounded-full bg-white/10 text-xs text-gold" aria-hidden="true">NJ</span><div>Noah &amp; Jules<small>Morocco, Winter 2025</small></div></figcaption>
                    </figure>
                </div>
            </div>
        </section>

        <section id="plan" className="bg-gold py-[60px] text-center min-[601px]:py-[95px] [&_h2]:mx-auto [&_h2]:max-w-[700px] [&_h2]:text-[clamp(40px,5vw,64px)] [&_p:not(.eyebrow)]:mx-auto [&_p:not(.eyebrow)]:mb-8 [&_p:not(.eyebrow)]:max-w-[540px]">
            <div className="mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
                <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Your journey starts here</p>
                <h2>Let’s plan something remarkable.</h2>
                <p>Tell us where you’re dreaming of. One of our travel designers will be in touch within two working days.</p>
                <button type="button" className="inline-flex items-center justify-center gap-6 rounded-full px-7 py-4 text-sm font-bold transition hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none bg-forest text-white hover:bg-[#2b4b41]" onClick={onPlan}>Plan your trip <span aria-hidden="true">↗</span></button>
            </div>
        </section>
    </>
  );
}
