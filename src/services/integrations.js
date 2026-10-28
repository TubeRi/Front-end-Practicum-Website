import { demoAdmin, demoLoginEnabled, matchesDemoCredentials } from './demoAuth';

// Frontend integration boundaries only. Replace these adapters when a backend exists.
// These route names describe proposed contracts; no network requests are made.
export const endpointContracts = Object.freeze({
  login: '/api/auth/login',
  signup: '/api/auth/signup',
  booking: '/api/bookings',
  tripRequest: '/api/trip-requests',
  testimonial: '/api/testimonials',
});

export async function authenticate(mode, credentials) {
  if (demoLoginEnabled && matchesDemoCredentials(mode, credentials)) {
    return { connected: false, demo: true, user: demoAdmin };
  }
  if (demoLoginEnabled && mode === 'login') {
    return { connected: false, message: 'Incorrect demo email or password.' };
  }
  // Deliberately do not persist, log, or transmit credentials in this preview.
  return { connected: false, message: 'Account services are not connected. No account was created and no details were sent.' };
}

export async function requestBooking(details, user) {
  if (!user?.id) throw new Error("AUTH_REQUIRED");
  // Frontend demo acknowledgment only; no reservation, payment, or transmission.
  return { connected: false, demo: true };
}

export async function requestTestimonial(details, user) {
  if (!user?.id) throw new Error('AUTH_REQUIRED');
  // Unconnected frontend boundary. No story is transmitted, published, or saved.
  return { connected: false, demo: true };
}
