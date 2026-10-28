import { useState } from 'react';
import { useAccount } from '../../context/AccountContext';

const fieldClass = 'mt-2 block w-full min-w-0 border border-line bg-white px-4 py-3 text-sm text-ink focus:border-moss focus:outline-2 focus:outline-moss';
const fields = [
  ['name', 'Full name', 'name', 80], ['phone', 'Phone number', 'tel', 30],
  ['address', 'Street address', 'address-line1', 150], ['addressExtra', 'Apartment / additional address', 'address-line2', 150],
  ['city', 'City', 'address-level2', 80], ['postalCode', 'Postal code', 'postal-code', 20],
  ['country', 'Country', 'country-name', 80], ['hobbies', 'Hobbies and interests', 'off', 200],
];

export default function ProfileForm() {
  const { profile, saveProfile } = useAccount();
  const [values, setValues] = useState(profile);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const change = event => { setValues(current => ({ ...current, [event.target.name]: event.target.value })); setMessage(''); };

  function submit(event) {
    event.preventDefault();
    setError('');
    try { saveProfile(values); setMessage('Your profile has been updated for this session.'); }
    catch (issue) { setError(issue.message); }
  }

  return (
    <section id="personal-details" aria-labelledby="profile-title" className="scroll-mt-24 border border-line bg-white p-5 sm:p-8">
      <h2 id="profile-title" className="font-display text-3xl sm:text-4xl">Personal details</h2>
      <p className="mt-3 text-sm text-muted">A little about you, for journeys that feel more personal.</p>
      <form onSubmit={submit} className="mt-7 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(([name, label, autocomplete, max]) => (
            <label key={name} className="block min-w-0 text-sm font-bold" htmlFor={'profile-' + name}>{label}
              <input id={'profile-' + name} name={name} value={values[name]} onChange={change} required={name === 'name'} maxLength={max} autoComplete={autocomplete} type={name === 'phone' ? 'tel' : 'text'} className={fieldClass} />
            </label>
          ))}
        </div>
        <label className="block text-sm font-bold" htmlFor="profile-email">Account email
          <input id="profile-email" readOnly value={profile.email} type="email" className={`${fieldClass} bg-sand/30 text-muted`} />
        </label>
        <label className="block text-sm font-bold" htmlFor="profile-style">Preferred travel style
          <select id="profile-style" name="travelStyle" value={values.travelStyle} onChange={change} className={fieldClass}>
            {['A mix of everything', 'Culture & local life', 'Adventure & outdoors', 'Beach & relaxation', 'Food & wine', 'Family getaway'].map(style => <option key={style}>{style}</option>)}
          </select>
        </label>
        <label className="block text-sm font-bold" htmlFor="profile-bio">About you
          <textarea id="profile-bio" name="bio" rows={4} maxLength={600} value={values.bio} onChange={change} className={`${fieldClass} resize-y`} placeholder="Your favorite kinds of places, interests, and travel wishes…" />
        </label>
        {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
        <button className="bg-ink px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-moss" type="submit">Save personal details</button>
        <p role="status" className="text-sm text-moss">{message}</p>
      </form>
    </section>
  );
}
