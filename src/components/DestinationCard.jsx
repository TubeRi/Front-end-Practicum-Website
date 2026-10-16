import { Link } from 'react-router';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export default function DestinationCard({ destination, compact = false }) {
  const Heading = compact ? 'h3' : 'h2';

  if (compact) {
    return (
      <article className="group min-w-0">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-forest/5">
          <img src={destination.image} alt={destination.imageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none" />
        </div>
        <div className="border-b border-forest/15 py-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.17em] text-[#44695b]">{destination.location}</p>
          <div className="flex items-start justify-between gap-5">
            <h3 className="mb-0 font-display text-3xl leading-tight">{destination.title}</h3>
            <span aria-hidden="true" className="mt-1 text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none">↗</span>
          </div>
          <div className="mt-5 flex items-center justify-between text-sm text-muted">
            <span>{destination.days} days</span>
            <span>From <strong className="font-bold text-forest">{priceFormatter.format(destination.price)}</strong></span>
          </div>
          <Link to={'/destinations?search=' + encodeURIComponent(destination.location.split(',')[0])} aria-label={'View ' + destination.title} className="mt-4 inline-flex border-b border-forest pb-1 text-sm font-bold hover:text-[#44695b]">View journey</Link>
        </div>
      </article>
    );
  }

  return (
    <article className={`group min-w-0 ${compact ? '' : 'flex flex-col'}`}>
      <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden rounded">
        <img
          src={destination.image}
          alt={destination.imageAlt}
          loading="lazy"
          className="absolute inset-0 block h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.04] motion-reduce:transition-none"
        />
      </div>
      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
        {destination.location}
        {!compact && (
          <span className="float-right rounded border border-forest/15 px-1.5 normal-case tracking-normal">
            {destination.regionLabel}
          </span>
        )}
      </p>
      <Heading className={compact ? '' : 'mb-3.5 text-3xl tracking-[-0.5px]'}>
        {compact ? (
          <Link to="/destinations" className="flex items-baseline justify-between gap-4 hover:underline hover:underline-offset-4">
            {destination.title}<span aria-hidden="true" className="font-sans text-xl">↗</span>
          </Link>
        ) : destination.title}
      </Heading>
      {!compact && <p className="mb-6 text-[15px] text-muted">{destination.description}</p>}
      <div className="mt-auto flex justify-between gap-3 pt-1 text-sm text-muted">
        <span>{destination.days} days</span>
        <span>From <strong className="font-bold text-forest">{priceFormatter.format(destination.price)}</strong></span>
      </div>
      {compact && <Link to="/destinations" className="mt-4 inline-block self-start border-b border-forest pb-1 text-sm font-bold">View journey</Link>}
    </article>
  );
}

