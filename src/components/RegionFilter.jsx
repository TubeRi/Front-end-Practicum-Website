const regions = [
  { value: 'all', label: 'All' },
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'south-america', label: 'South America' },
];

export default function RegionFilter({ value, onChange }) {
  return (
    <fieldset className="mb-[35px] flex flex-wrap gap-3">
      <legend className="mb-3 text-xs text-muted">Explore by region</legend>

      {regions.map(region => (
        <label key={region.value} className="cursor-pointer">
          <input
            className="peer sr-only"
            type="radio"
            name="region"
            value={region.value}
            checked={value === region.value}
            onChange={() => onChange(region.value)}
          />
          <span className="block border border-forest/20 px-4 py-2 text-[11px] font-bold uppercase tracking-wider peer-checked:border-forest peer-checked:bg-forest peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-gold">
            {region.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
