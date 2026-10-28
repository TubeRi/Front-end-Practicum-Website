import { useNavigate } from "react-router";
import { useCatalog } from '../context/CatalogContext';
import { useEffect, useMemo, useRef, useState } from "react"

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const durationOptions = [
  "Any length",
  "2–5 nights",
  "6–8 nights",
  "9–12 nights",
  "13–16 nights",
  "17–21 nights",
  "21+ nights",
]

const startOfMonth = (date, offset = 0) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1),
  )

const monthDays = (month) => {
  const year = month.getUTCFullYear()
  const monthIndex = month.getUTCMonth()
  const leadingDays = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay()
  const numberOfDays = new Date(
    Date.UTC(year, monthIndex + 1, 0),
  ).getUTCDate()

  return [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from(
      { length: numberOfDays },
      (_, index) => Date.UTC(year, monthIndex, index + 1),
    ),
  ]
}

const inputDate = (timestamp) =>
  timestamp ? new Date(timestamp).toISOString().slice(0, 10) : ""

const displayDate = (timestamp) =>
  timestamp
    ? new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(new Date(timestamp))
    : ""

export default function DestinationPicker() {
  const { destinations, destinationCategories } = useCatalog();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [durationOpen, setDurationOpen] = useState(false)
  const [travelersOpen, setTravelersOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("Any length")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const todayParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vilnius', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = type => Number(todayParts.find(value => value.type === type).value);
  const todayTimestamp = Date.UTC(part('year'), part('month') - 1, part('day'));
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date(todayTimestamp)))
  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd, setRangeEnd] = useState(null)
  const [flexibility, setFlexibility] = useState("Exact dates")
  const pickerRef = useRef(null)
  const datePickerRef = useRef(null)
  const durationPickerRef = useRef(null)
  const travelersPickerRef = useRef(null)

  const countries = useMemo(() => {
    const grouped = new Map()

    destinations.forEach((destination) => {
      const current = grouped.get(destination.country) ?? {
        country: destination.country,
        region: destination.region,
        journeys: [],
      }
      current.journeys.push(destination.location)
      grouped.set(destination.country, current)
    })

    return Array.from(grouped.values())
  }, [destinations])

  const visibleCountries = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return countries

    return countries.filter(
      ({ country, journeys, region }) =>
        country.toLowerCase().includes(query) ||
        region.toLowerCase().includes(query) ||
        journeys.some((journey) => journey.toLowerCase().includes(query)),
    )
  }, [countries, search])

  useEffect(() => {
    if (!open && !dateOpen && !durationOpen && !travelersOpen) return

    const closeOnOutsideClick = (event) => {
      if (!pickerRef.current?.contains(event.target)) setOpen(false)
      if (!datePickerRef.current?.contains(event.target)) setDateOpen(false)
      if (!durationPickerRef.current?.contains(event.target))
        setDurationOpen(false)
      if (!travelersPickerRef.current?.contains(event.target))
        setTravelersOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false)
        setDateOpen(false)
        setDurationOpen(false)
        setTravelersOpen(false)
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [dateOpen, durationOpen, open, travelersOpen])

  const chooseDate = (timestamp) => {
    if (!rangeStart || rangeEnd || timestamp < rangeStart) {
      setRangeStart(timestamp)
      setRangeEnd(null)
      return
    }

    setRangeEnd(timestamp)
  }

  const dateLabel =
    rangeStart && rangeEnd
      ? `${displayDate(rangeStart)} – ${displayDate(rangeEnd)}`
      : rangeStart
        ? `${displayDate(rangeStart)} – choose return`
        : "Flexible dates"

  const renderMonth = (month, showPrevious, showNext) => {

    return (
      <div>
        <div className="flex items-center justify-between">
          {showPrevious ? (
            <button
              type="button"
              aria-label="Previous month"
              onClick={() =>
                setVisibleMonth((current) => startOfMonth(current, -1))
              }
              className="flex size-10 items-center justify-center rounded-full border border-line bg-canvas outline-none transition-colors hover:border-ink focus-visible:ring-2 focus-visible:ring-moss"
            >
              <span
                aria-hidden="true"
                className="size-2 rotate-135 border-b-2 border-r-2 border-ink"
              />
            </button>
          ) : (
            <span className="size-10" />
          )}
          <strong className="text-sm">
            {monthNames[month.getUTCMonth()]} {month.getUTCFullYear()}
          </strong>
          {showNext ? (
            <button
              type="button"
              aria-label={showPrevious ? "Next month" : "Next calendar month"}
              onClick={() =>
                setVisibleMonth((current) => startOfMonth(current, 1))
              }
              className="flex size-10 items-center justify-center rounded-full border border-line bg-canvas outline-none transition-colors hover:border-ink focus-visible:ring-2 focus-visible:ring-moss"
            >
              <span
                aria-hidden="true"
                className="size-2 -rotate-45 border-b-2 border-r-2 border-ink"
              />
            </button>
          ) : (
            <span className="size-10" />
          )}
        </div>

        <div className="mt-5 grid grid-cols-7 text-center">
          {weekdays.map((weekday) => (
            <span
              key={weekday}
              className="py-2 text-xs font-bold uppercase text-muted"
            >
              {weekday}
            </span>
          ))}
          {monthDays(month).map((timestamp, index) => {
            if (!timestamp)
              return <span key={`empty-${index}`} aria-hidden="true" />

            const disabled = timestamp < todayTimestamp
            const selected =
              timestamp === rangeStart || timestamp === rangeEnd
            const inRange =
              rangeStart &&
              rangeEnd &&
              timestamp > rangeStart &&
              timestamp < rangeEnd

            return (
              <button
                key={timestamp}
                type="button"
                disabled={disabled}
                aria-label={new Intl.DateTimeFormat("en", {
                  dateStyle: "long",
                  timeZone: "UTC",
                }).format(new Date(timestamp))}
                aria-pressed={selected}
                onClick={() => chooseDate(timestamp)}
                className={`aspect-square text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-moss ${
                  selected
                    ? "rounded-full bg-ink font-bold text-white"
                    : inRange
                      ? "bg-sand text-ink"
                      : "hover:bg-sand"
                } disabled:cursor-not-allowed disabled:text-line disabled:hover:bg-transparent`}
              >
                {new Date(timestamp).getUTCDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <section
      className="relative z-20 border-b border-line bg-sand px-5 py-12 sm:px-6 sm:py-16 lg:px-10"
      aria-labelledby="destination-picker-title"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <div>
            <h2
              id="destination-picker-title"
              className="font-display text-4xl leading-tight tracking-tight sm:text-5xl"
            >
              Where would you like to go?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-muted">
              Choose a destination, a date, and who is traveling. We’ll show you
              journeys that fit.
            </p>
          </div>
        </div>

        <form
          onSubmit={event => { event.preventDefault(); const query = new URLSearchParams(new FormData(event.currentTarget)); navigate("/destinations?" + query.toString()); }}
          className="relative z-10 grid bg-white shadow-[0_18px_50px_rgba(8,21,19,0.10)] lg:grid-cols-[1.15fr_0.85fr_0.7fr_0.65fr_auto]"
        >
          <div
            ref={pickerRef}
            className="relative border-b border-line px-5 py-5 lg:border-b-0 lg:border-r lg:px-6"
          >
            <span className="block text-[0.68rem] font-bold uppercase tracking-widest text-moss">
              Destination
            </span>
            <input
              type="hidden"
              name="search"
              value={selectedCountry}
            />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="destination-options"
              onClick={() => {
                setDateOpen(false)
                setDurationOpen(false)
                setTravelersOpen(false)
                setOpen((current) => !current)
              }}
              className="mt-2 flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent text-left text-base font-bold text-ink outline-none"
            >
              <span>
                {selectedCountry || "Anywhere that inspires you"}
              </span>
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 border-b-2 border-r-2 border-moss transition-transform ${
                  open ? "-rotate-135" : "rotate-45"
                }`}
              />
            </button>

            {open && (
              <div
                id="destination-options"
                className="absolute left-0 top-full z-30 mt-3 w-full min-w-0 bg-white p-4 shadow-[0_24px_60px_rgba(8,21,19,0.22)] sm:w-[28rem] sm:max-w-[calc(100vw-3rem)]"
              >
                <label className="block">
                  <span className="sr-only">
                    Search countries or destinations
                  </span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search countries or destinations"
                    autoFocus
                    className="h-12 w-full border border-ink bg-white px-4 text-sm text-ink outline-none placeholder:text-muted focus:ring-1 focus:ring-moss"
                  />
                </label>

                <div className="mt-5 flex items-center justify-between border-b border-line pb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-moss">
                    Featured countries
                  </p>
                  {selectedCountry && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCountry("")
                        setOpen(false)
                      }}
                      className="text-xs font-bold text-muted underline decoration-line underline-offset-4 hover:text-ink"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto pr-2">
                  {visibleCountries.map(({ country, journeys, region }) => {
                    const selected = selectedCountry === country

                    return (
                      <button
                        key={country}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country)
                          setOpen(false)
                        }}
                        className="group flex w-full items-center gap-3 border-b border-line/70 py-4 text-left outline-none hover:text-moss focus-visible:bg-sand/60"
                      >
                        <span
                          aria-hidden="true"
                          className={`flex size-6 shrink-0 items-center justify-center border ${
                            selected
                              ? "border-moss bg-moss"
                              : "border-muted bg-white"
                          }`}
                        >
                          {selected && (
                            <span className="size-2 bg-white" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block text-sm">{country}</strong>
                          <span className="mt-1 block truncate text-xs text-muted">
                            {journeys.join(" · ")}
                          </span>
                        </span>
                        <span className="text-right">
                          <span className="block text-xs font-bold">
                            {journeys.length}{" "}
                            {journeys.length === 1 ? "journey" : "journeys"}
                          </span>
                          <span className="mt-1 block text-xs text-muted">
                            {region}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="size-2 shrink-0 -rotate-45 border-b border-r border-ink transition-transform group-hover:translate-x-1"
                        />
                      </button>
                    )
                  })}

                  {visibleCountries.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted">
                      No matching countries found.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            ref={datePickerRef}
            className="relative border-b border-line px-5 py-5 lg:border-b-0 lg:border-r lg:px-6"
          >
            <span className="block text-[0.68rem] font-bold uppercase tracking-widest text-moss">
              Departure
            </span>
            <input
              type="hidden"
              name="departure"
              value={inputDate(rangeStart)}
            />
            <input
              type="hidden"
              name="return"
              value={inputDate(rangeEnd)}
            />
            <input type="hidden" name="flexibility" value={flexibility} />
            <button
              type="button"
              aria-expanded={dateOpen}
              aria-controls="travel-calendar"
              onClick={() => {
                setOpen(false)
                setDurationOpen(false)
                setTravelersOpen(false)
                setDateOpen((current) => !current)
              }}
              className="mt-2 flex w-full cursor-pointer items-center justify-between gap-3 bg-transparent text-left text-base font-bold text-ink outline-none"
            >
              <span className="truncate">{dateLabel}</span>
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 border-b-2 border-r-2 border-moss transition-transform ${
                  dateOpen ? "-rotate-135" : "rotate-45"
                }`}
              />
            </button>

            {dateOpen && (
              <div
                id="travel-calendar" role="group" aria-label="Travel date calendar"
                className="absolute left-1/2 top-full z-30 mt-3 lg:-left-40 max-h-[70dvh] overflow-y-auto overscroll-contain w-[min(48rem,calc(100vw-5rem))] lg:w-[min(48rem,65vw)] -translate-x-1/2 bg-white p-5 lg:translate-x-0 shadow-[0_24px_60px_rgba(8,21,19,0.22)] sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-moss">
                      Choose your travel window
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Select a departure date and a return date.
                    </p>
                  </div>
                  {(rangeStart || rangeEnd) && (
                    <button
                      type="button"
                      onClick={() => {
                        setRangeStart(null)
                        setRangeEnd(null)
                      }}
                      className="text-xs font-bold text-muted underline decoration-line underline-offset-4 hover:text-ink"
                    >
                      Clear dates
                    </button>
                  )}
                </div>

                <div className="mt-6 grid gap-8 sm:grid-cols-2">
                  {renderMonth(visibleMonth, true, true)}
                  <div className="hidden sm:block">
                    {renderMonth(startOfMonth(visibleMonth, 1), false, true)}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                  <div className="flex flex-wrap gap-2">
                    {["Exact dates", "± 3 days", "± 7 days"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={flexibility === option}
                        onClick={() => setFlexibility(option)}
                        className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                          flexibility === option
                            ? "border-ink bg-ink text-white"
                            : "border-line bg-white text-muted hover:border-ink hover:text-ink"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={!rangeStart || !rangeEnd}
                    onClick={() => setDateOpen(false)}
                    className="bg-sun px-6 py-3 text-xs font-bold uppercase tracking-widest text-night transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Apply dates
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            ref={durationPickerRef}
            className="relative border-b border-line px-5 py-5 lg:border-b-0 lg:border-r lg:px-6"
          >
            <span className="block text-[0.68rem] font-bold uppercase tracking-widest text-moss">
              Length of stay
            </span>
            <input type="hidden" name="duration" value={selectedDuration} />
            <button
              type="button"
              aria-expanded={durationOpen}
              aria-controls="duration-options"
              onClick={() => {
                setOpen(false)
                setDateOpen(false)
                setTravelersOpen(false)
                setDurationOpen((current) => !current)
              }}
              className="mt-2 flex w-full cursor-pointer items-center justify-between gap-3 bg-transparent text-left text-base font-bold text-ink outline-none"
            >
              <span className="truncate">{selectedDuration}</span>
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 border-b-2 border-r-2 border-moss transition-transform ${
                  durationOpen ? "-rotate-135" : "rotate-45"
                }`}
              />
            </button>

            {durationOpen && (
              <div
                id="duration-options"
                className="absolute left-0 top-full z-30 mt-3 w-full min-w-0 bg-white p-4 shadow-[0_24px_60px_rgba(8,21,19,0.22)]"
              >
                <p className="border-b border-line pb-3 text-xs font-bold uppercase tracking-widest text-moss">
                  Flexible stay
                </p>
                <div className="max-h-72 overflow-y-auto">
                  {durationOptions.map((option) => {
                    const selected = selectedDuration === option

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedDuration(option)
                          setDurationOpen(false)
                        }}
                        className="group flex w-full items-center gap-3 border-b border-line/70 py-4 text-left text-sm font-bold outline-none hover:text-moss focus-visible:bg-sand/60"
                      >
                        <span
                          aria-hidden="true"
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? "border-moss bg-moss"
                              : "border-muted bg-white"
                          }`}
                        >
                          {selected && (
                            <span className="size-2 rounded-full bg-white" />
                          )}
                        </span>
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div
            ref={travelersPickerRef}
            className="relative border-b border-line px-5 py-5 lg:border-b-0 lg:border-r lg:px-6"
          >
            <span className="block text-[0.68rem] font-bold uppercase tracking-widest text-moss">
              Travelers
            </span>
            <input type="hidden" name="adults" value={adults} />
            <input type="hidden" name="children" value={children} />
            <button
              type="button"
              aria-expanded={travelersOpen}
              aria-controls="traveler-options"
              onClick={() => {
                setOpen(false)
                setDateOpen(false)
                setDurationOpen(false)
                setTravelersOpen((current) => !current)
              }}
              className="mt-2 flex w-full cursor-pointer items-center justify-between gap-3 bg-transparent text-left text-base font-bold text-ink outline-none"
            >
              <span className="truncate">
                {adults} {adults === 1 ? "adult" : "adults"}
                {children > 0 &&
                  ` · ${children} ${children === 1 ? "child" : "children"}`}
              </span>
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 border-b-2 border-r-2 border-moss transition-transform ${
                  travelersOpen ? "-rotate-135" : "rotate-45"
                }`}
              />
            </button>

            {travelersOpen && (
              <div
                id="traveler-options"
                className="absolute right-0 top-full z-30 mt-3 w-full min-w-0 bg-white px-5 shadow-[0_24px_60px_rgba(8,21,19,0.22)]"
              >
                <div className="flex items-center justify-between gap-5 border-b border-line py-5">
                  <div>
                    <strong className="block text-sm">Adults</strong>
                    <span className="mt-1 block text-xs text-muted">
                      Ages 13 and over
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-3"
                    role="group"
                    aria-label="Number of adults"
                  >
                    <button
                      type="button"
                      aria-label="Decrease adults"
                      disabled={adults <= 1}
                      onClick={() =>
                        setAdults((current) => Math.max(1, current - 1))
                      }
                      className="flex size-10 items-center justify-center rounded-full border border-line text-xl font-medium outline-none transition-colors hover:border-ink hover:bg-sand focus-visible:ring-2 focus-visible:ring-moss disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      −
                    </button>
                    <output
                      className="min-w-5 text-center text-sm font-bold"
                      aria-live="polite"
                    >
                      {adults}
                    </output>
                    <button
                      type="button"
                      aria-label="Increase adults"
                      disabled={adults + children >= 10}
                      onClick={() =>
                        setAdults((current) => Math.min(10 - children, current + 1))
                      }
                      className="flex size-10 items-center justify-center rounded-full border border-line text-xl font-medium outline-none transition-colors hover:border-ink hover:bg-sand focus-visible:ring-2 focus-visible:ring-moss disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-5 py-5">
                  <div>
                    <strong className="block text-sm">Children</strong>
                    <span className="mt-1 block text-xs text-muted">
                      Ages 0–12
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-3"
                    role="group"
                    aria-label="Number of children"
                  >
                    <button
                      type="button"
                      aria-label="Decrease children"
                      disabled={children <= 0}
                      onClick={() =>
                        setChildren((current) => Math.max(0, current - 1))
                      }
                      className="flex size-10 items-center justify-center rounded-full border border-line text-xl font-medium outline-none transition-colors hover:border-ink hover:bg-sand focus-visible:ring-2 focus-visible:ring-moss disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      −
                    </button>
                    <output
                      className="min-w-5 text-center text-sm font-bold"
                      aria-live="polite"
                    >
                      {children}
                    </output>
                    <button
                      type="button"
                      aria-label="Increase children"
                      disabled={adults + children >= 10}
                      onClick={() =>
                        setChildren((current) => Math.min(10 - adults, current + 1))
                      }
                      className="flex size-10 items-center justify-center rounded-full border border-line text-xl font-medium outline-none transition-colors hover:border-ink hover:bg-sand focus-visible:ring-2 focus-visible:ring-moss disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-stretch bg-ink p-2">
            <button
              type="submit"
              className="group flex min-h-16 w-full items-center justify-center gap-3 bg-sun px-7 text-sm font-bold uppercase tracking-widest text-night outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset lg:min-h-full lg:w-auto"
            >
              Explore
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
