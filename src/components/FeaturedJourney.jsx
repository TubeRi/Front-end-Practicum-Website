import { Link } from 'react-router';
export default function FeaturedJourney({destination}) { return (<article className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
                  <img
                    src={destination.image}
                    alt={destination.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="border-b border-line py-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.17em] text-moss">
                    {destination.location}, {destination.country}
                  </p>
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="font-display text-3xl leading-tight">
                      {destination.name}
                    </h3>
                    <span
                      className="mt-1 text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    >
                      <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm text-muted">
                    <span>{destination.duration} days</span>
                    <span>
                      From{" "}
                      <strong className="font-bold text-ink">
                        €{destination.price.toLocaleString("en-IE")}
                      </strong>
                    </span>
                  </div>
                  <Link
                    to={`/destinations?search=${encodeURIComponent(destination.location)}`}
                    className="mt-4 inline-flex border-b border-ink pb-1 text-sm font-bold outline-none hover:text-moss focus-visible:ring-2 focus-visible:ring-moss"
                    aria-label={`View ${destination.name}`}
                  >
                    View journey
                  </Link>
                </div>
              </article>); }
