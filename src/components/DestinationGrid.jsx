import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router"
import { useCatalog } from '../context/CatalogContext';
import DestinationCard from "./DestinationCard"
import FilterBar from "./FilterBar"

function DestinationGrid() {
  const { destinations, destinationCategories } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState("All Destinations")
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") ?? "",
  )
  const [sortOrder, setSortOrder] = useState("featured")
  const urlSearch = searchParams.get('search') || '';
  const duration = searchParams.get('duration') || 'Any length';
  const adults = Math.min(10, Math.max(1, Math.floor(Number(searchParams.get('adults'))) || 1));
  const children = Math.min(10 - adults, Math.max(0, Math.floor(Number(searchParams.get('children'))) || 0));
  const initialTravelers = Math.min(10, adults + children);
  const departure = searchParams.get('departure') || '';
  const returnDate = searchParams.get('return') || '';
  const flexibility = searchParams.get('flexibility') || 'Exact dates';
  useEffect(() => { setSearchTerm(urlSearch); }, [urlSearch]);

  const visibleDestinations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const filtered = destinations.filter((destination) => {
      const matchesCategory =
        activeCategory === "All Destinations" ||
        destination.category === activeCategory
      const searchableText =
        `${destination.name} ${destination.location} ${destination.country}`.toLowerCase()
      const nights = destination.duration - 1;
      const limits = duration.match(/\d+/g)?.map(Number) || [];
      const matchesDuration = !limits.length || (nights >= limits[0] && (limits.length === 1 || nights <= limits[1]));
      return matchesCategory && matchesDuration && searchableText.includes(normalizedSearch)
    })

    return [...filtered].sort((first, second) => {
      if (sortOrder === "price-asc") return first.price - second.price
      if (sortOrder === "price-desc") return second.price - first.price
      if (sortOrder === "rating") return second.rating - first.rating
      return 0
    })
  }, [destinations, activeCategory, searchTerm, sortOrder, duration])

  const resetFilters = () => {
    setActiveCategory("All Destinations")
    setSearchTerm("")
    setSortOrder("featured")
    setSearchParams({});
  }

  return (
    <section
      id="destination-list"
      className="scroll-mt-24 px-5 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {(departure || duration !== 'Any length' || searchParams.has('adults')) && (
          <div className="mb-7 border border-line bg-sand/50 p-4 text-sm" aria-label="Your travel preferences">
            <p className="font-bold">Your travel preferences</p>
            <p className="mt-2">{adults} adults · {children} {children === 1 ? "child" : "children"}{duration !== 'Any length' ? ' · ' + duration : ''}{departure ? ' · ' + departure + (returnDate ? ' to ' + returnDate : '') + ' · ' + flexibility : ''}</p>
            <p className="mt-2 text-muted">Search dates are preferences. Choose an available departure when booking. Prices use the standard per-person rate for every traveler.</p>
          </div>
        )}
        <FilterBar
          categories={destinationCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        <div className="mb-8 mt-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-moss">
              Curated for thoughtful travelers
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              {visibleDestinations.length}{" "}
              {visibleDestinations.length === 1 ? "journey" : "journeys"}
            </h2>
          </div>
          {(activeCategory !== "All Destinations" || searchTerm || duration !== "Any length" || sortOrder !== "featured") && (
            <button
              type="button"
              onClick={resetFilters}
              className="cursor-pointer border-b border-ink pb-1 text-sm font-bold outline-none hover:text-moss focus-visible:ring-2 focus-visible:ring-moss"
            >
              Clear all filters
            </button>
          )}
        </div>

        {visibleDestinations.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {visibleDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} initialTravelers={initialTravelers} />
            ))}
          </div>
        ) : (
          <div className="border border-line bg-white px-5 py-16 text-center sm:px-10">
            <p className="text-xs font-bold uppercase tracking-widest text-moss">
              No journeys found
            </p>
            <h2 className="mt-3 font-display text-4xl">
              Let’s try a different route.
            </h2>
            <p className="mx-auto mt-3 max-w-lg leading-relaxed text-muted">
              No destinations match those filters yet. Clear your search or
              choose another travel style to see more journeys.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-7 cursor-pointer bg-ink px-6 py-4 font-bold text-white outline-none transition-colors hover:bg-moss focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              Show all destinations
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default DestinationGrid
