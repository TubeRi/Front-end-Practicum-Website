// Public test credentials for local development only. Never real authentication.
export const demoLoginEnabled = import.meta.env?.DEV === true;
export const demoAdmin = Object.freeze({ id: 'demo-admin', name: 'Demo Admin', email: 'admin@travelpoint.test', role: 'admin', demo: true });
export const demoAdminPassword = 'TravelPointDemo!28';
export const demoSessionKey = 'travelpoint-demo-session';

export function matchesDemoCredentials(mode, credentials) {
  return mode === 'login' && credentials.email?.trim().toLowerCase() === demoAdmin.email && credentials.password === demoAdminPassword;
}
