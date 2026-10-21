function QuantityStepper({ value, onChange, min = 1, max = 10 }) {
  return (
    <div
      className="inline-flex items-center border border-line bg-white"
      role="group"
      aria-label="Number of travelers"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className="flex size-10 cursor-pointer items-center justify-center text-lg font-bold outline-none transition-colors hover:bg-sand focus-visible:bg-sand disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Decrease travelers"
      >
        −
      </button>
      <output
        className="flex min-w-10 items-center justify-center border-x border-line text-sm font-bold"
        aria-live="polite"
      >
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="flex size-10 cursor-pointer items-center justify-center text-lg font-bold outline-none transition-colors hover:bg-sand focus-visible:bg-sand disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Increase travelers"
      >
        +
      </button>
    </div>
  )
}

export default QuantityStepper
