import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { paymentTypes, tripEndDate } from '../services/account';

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const { user } = useAuth();
  // Changing accounts or logging out discards the previous account's local data.
  return <AccountState key={user?.id || 'guest'} user={user}>{children}</AccountState>;
}

function AccountState({ user, children }) {
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone: '', address: '', addressExtra: '', city: '', postalCode: '', country: '', hobbies: '', bio: '', travelStyle: 'A mix of everything' });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [defaultPaymentId, setDefaultPaymentId] = useState('');
  const [trips, setTrips] = useState([]);

  function requireUser() {
    if (!user?.id) throw new Error('Please log in to manage your account.');
  }

  function saveProfile(values) {
    requireUser();
    const next = Object.fromEntries(Object.keys(profile).map(key => [key, String(values[key] ?? '').trim()]));
    if (!next.name || next.name.length > 80) throw new Error('Enter a name of up to 80 characters.');
    // Account email is owned by authentication, not by the editable profile form.
    next.email = user.email || '';
    setProfile(next);
  }

  function addPaymentMethod(type, nickname) {
    requireUser();
    if (!paymentTypes.some(method => method.value === type)) throw new Error('Choose a payment method.');
    const label = nickname.trim() || paymentTypes.find(method => method.value === type).label;
    if (label.length > 40 || /(?:\d[ -]*){8,}/.test(label)) throw new Error('Use a short nickname without card or account numbers.');
    const method = { id: crypto.randomUUID(), type, label };
    setPaymentMethods(current => [...current, method]);
    if (!defaultPaymentId) setDefaultPaymentId(method.id);
  }

  function removePaymentMethod(id) {
    requireUser();
    setPaymentMethods(current => current.filter(method => method.id !== id));
    if (defaultPaymentId === id) setDefaultPaymentId(paymentMethods.find(method => method.id !== id)?.id || '');
  }

  function setPreferredPayment(id) {
    requireUser();
    if (paymentMethods.some(method => method.id === id)) setDefaultPaymentId(id);
  }

  function addTrip(destination, departure, travelers, paymentMethodId) {
    requireUser();
    const payment = paymentMethods.find(method => method.id === paymentMethodId);
    setTrips(current => [{
      id: crypto.randomUUID(), destinationId: destination.id, name: destination.name,
      location: destination.location + ', ' + destination.country, image: destination.image,
      departure, endDate: tripEndDate(departure, destination.duration), travelers,
      total: destination.price * travelers, paymentPreference: payment?.label || 'Choose later',
      status: 'Demo request · unpaid',
    }, ...current]);
  }

  return <AccountContext.Provider value={{ profile, saveProfile, paymentMethods, defaultPaymentId, addPaymentMethod, removePaymentMethod, setPreferredPayment, trips, addTrip }}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error('useAccount must be used within AccountProvider');
  return context;
}
