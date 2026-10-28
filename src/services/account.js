export const paymentTypes = [
  { value: 'card', label: 'Debit / credit card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'apple-pay', label: 'Apple Pay' },
  { value: 'google-pay', label: 'Google Pay' },
  { value: 'bank-transfer', label: 'Bank transfer' },
];

export function todayInVilnius(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vilnius', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function tripEndDate(departure, days) {
  const date = new Date(departure + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + days - 1);
  return date.toISOString().slice(0, 10);
}

export function groupTrips(trips, today = todayInVilnius()) {
  return {
    upcoming: trips.filter(trip => trip.endDate >= today).sort((a, b) => a.departure.localeCompare(b.departure)),
    past: trips.filter(trip => trip.endDate < today).sort((a, b) => b.departure.localeCompare(a.departure)),
  };
}

export function formatTripDate(date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
}
