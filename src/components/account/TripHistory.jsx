import { useState } from 'react';
import { Link } from 'react-router';
import { useAccount } from '../../context/AccountContext';
import { formatTripDate, groupTrips } from '../../services/account';

const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export default function TripHistory() {
  const { trips } = useAccount();
  const [tab, setTab] = useState('upcoming');
  const grouped = groupTrips(trips);

  return (
    <section id="my-trips" aria-labelledby="trips-title" className="scroll-mt-24 border border-line bg-white p-5 sm:p-8">
      <h2 id="trips-title" className="font-display text-3xl sm:text-4xl">Your journeys</h2>
      <p className="mt-3 text-sm text-muted">Demo trip requests made in this session appear here. No reservation or payment is confirmed.</p>
      <div className="mt-6 flex flex-wrap gap-2" aria-label="Trip history filter">
        {['upcoming', 'past'].map(value => <button key={value} type="button" aria-pressed={tab === value} onClick={() => setTab(value)} className={`border px-4 py-3 text-sm font-bold capitalize transition-colors ${tab === value ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'}`}>{value} trips ({grouped[value].length})</button>)}
      </div>
      <div className="mt-6 space-y-4" aria-live="polite">
        {grouped[tab].length === 0 ? (
          <div className="border border-dashed border-line bg-canvas p-6">
            <h3 className="font-display text-2xl">{tab === 'upcoming' ? 'Your next chapter is waiting.' : 'Your travel memories will live here.'}</h3>
            <p className="mt-3 text-sm text-muted">{tab === 'upcoming' ? 'You have no upcoming trip requests yet.' : 'No past trips have been added to this session.'}</p>
            <Link to="/destinations" className="mt-5 inline-block border-b border-ink text-sm font-bold hover:text-moss">Explore journeys ↗</Link>
          </div>
        ) : grouped[tab].map(trip => (
          <article key={trip.id} className="grid min-w-0 overflow-hidden border border-line sm:grid-cols-[8rem_1fr]">
            <img src={trip.image} alt={trip.location} className="aspect-video h-full w-full object-cover sm:aspect-auto" />
            <div className="min-w-0 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-moss">{trip.location}</p>
              <h3 className="mt-2 font-display text-2xl">{trip.name}</h3>
              <p className="mt-3 text-sm text-muted"><time dateTime={trip.departure}>{formatTripDate(trip.departure)}</time> – <time dateTime={trip.endDate}>{formatTripDate(trip.endDate)}</time></p>
              <div className="mt-3 flex flex-wrap justify-between gap-3 text-sm"><span>{trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}</span><strong>{euro.format(trip.total)}</strong></div>
              <p className="mt-3 text-xs text-muted">Payment preference: {trip.paymentPreference}</p>
              <p className="mt-3 inline-block bg-sun/25 px-3 py-2 text-xs font-bold">{trip.status}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
