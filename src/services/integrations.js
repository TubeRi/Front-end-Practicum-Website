// Frontend integration boundaries only. Replace these adapters when a backend exists.
// These route names describe proposed contracts; no network requests are made.
export const endpointContracts = Object.freeze({
  login: '/api/auth/login',
  signup: '/api/auth/signup',
  booking: '/api/bookings',
  tripRequest: '/api/trip-requests',
});

export async function authenticate(mode, credentials) {
  // Deliberately do not persist, log, or transmit credentials in this preview.
  return { connected: false, message: 'Account services are not connected. No account was created and no details were sent.' };
}

export async function requestBooking(details) {
  // Frontend demo acknowledgment only; no reservation, payment, or transmission.
  return { connected: false, demo: true };
}
