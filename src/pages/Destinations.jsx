import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import DestinationCard from '../components/DestinationCard';
import RegionFilter from '../components/RegionFilter';
import { destinations } from '../data/destinations';

const containerClasses =
  'mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]';

export default function Destinations() {
  const [region, setRegion] = useState('all');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredDestinations = destinations.filter(destination => {
    const matchesRegion = region === 'all' || destination.region === region;
    const matchesSearch =
      !normalizedSearch ||
      destination.location.toLowerCase().includes(normalizedSearch) ||
      destination.title.toLowerCase().includes(normalizedSearch);

    return matchesRegion && matchesSearch;
  });

  const count = filteredDestinations.length;

  return (
    <main>
      <section
        className={`${containerClasses} pt-[55px] pb-[30px] min-[651px]:pt-[85px] min-[651px]:pb-[50px]`}
      >
        <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">
          Find your next journey
        </p>
        <h1 className="max-w-[950px] text-[clamp(44px,6vw,76px)] tracking-[-2px]">
          All destinations
        </h1>
        <p className="max-w-[650px] text-lg text-muted">
          From remote mountain paths to unhurried island days, explore every
          destination currently available with TravelPoint.
        </p>
      </section>

      <section
        className={`${containerClasses} pb-[85px]`}
        aria-label="Destination catalog"
      >
        <p className="text-sm text-muted" aria-live="polite">
          {count} {count === 1 ? 'journey' : 'journeys'} available
        </p>

        {normalizedSearch && (
          <p className="text-sm text-muted">
            Showing results for “{searchQuery}”.{' '}
            <Link to="/destinations" className="underline">
              View all destinations
            </Link>
          </p>
        )}

        <RegionFilter value={region} onChange={setRegion} />

        <div className="grid grid-cols-1 gap-x-7 gap-y-[45px] min-[601px]:grid-cols-2 min-[901px]:grid-cols-3">
          {filteredDestinations.map(destination => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>
    </main>
  );
}
