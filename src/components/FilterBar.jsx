function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
}) {
  return (
    <div className="border-b border-line pb-8">
      <div className="flex flex-wrap gap-2" aria-label="Filter destinations">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            aria-pressed={activeCategory === category}
            className={`cursor-pointer border px-4 py-2.5 text-xs font-bold uppercase tracking-widest outline-none transition-all focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 ${
              activeCategory === category
                ? "border-ink bg-ink text-white"
                : "border-line bg-canvas text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="min-w-0">
          <span className="sr-only">Search by destination or country</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by destination or country"
            className="h-12 w-full min-w-0 border border-line bg-white px-4 text-sm outline-none placeholder:text-muted focus:border-moss focus:ring-1 focus:ring-moss"
          />
        </label>
        <label className="flex min-w-0 items-center gap-3 border border-line bg-white px-4 text-sm">
          <span className="shrink-0 font-bold">Sort</span>
          <select
            value={sortOrder}
            onChange={(event) => onSortChange(event.target.value)}
            className="h-12 min-w-0 flex-1 bg-transparent text-muted outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </label>
      </div>
    </div>
  )
}

export default FilterBar
