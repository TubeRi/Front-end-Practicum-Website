import DestinationGrid from '../components/DestinationGrid';
export default function Destinations() {return <main>        <section className="border-b border-line bg-ink px-5 py-16 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-sun">
              Find your next journey
            </p>
            <div className="grid min-w-0 items-end gap-10 lg:grid-cols-[1.4fr_0.6fr]">
              <h1 className="min-w-0 font-display text-5xl leading-none tracking-tight sm:text-7xl lg:text-8xl">
                All destinations
              </h1>
              <p className="min-w-0 max-w-md text-lg leading-relaxed text-white/65">
                From remote mountain paths to unhurried island days, explore
                every destination available with TravelPoint, then shape the
                details around the way you like to travel.
              </p>
            </div>
          </div>
        </section>

<DestinationGrid /></main>;}
