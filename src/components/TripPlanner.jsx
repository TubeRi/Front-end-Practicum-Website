import { useEffect, useRef, useState } from 'react';

const fields = [
  ['destination', 'Where would you like to go?', ['Japan', 'Argentina', 'Morocco', 'Indonesia', 'Italy', 'Greece', 'Somewhere else', 'Surprise me']],
  ['duration', 'Trip duration', ['3–5 days', '6–8 days', '9–12 days', '13–16 days', 'More than 16 days', 'I’m flexible']],
  ['style', 'Trip type', ['Culture & local life', 'Adventure & outdoors', 'Beach & relaxation', 'Food & wine', 'Romance & honeymoon', 'Family getaway', 'A mix of everything']],
  ['travelers', 'Number of travelers', ['1 traveler', '2 travelers', '3–4 travelers', '5–6 travelers', '7 or more travelers'], '2 travelers'],
  ['pace', 'Travel pace', ['Slow & relaxed', 'Balanced', 'Full of experiences'], 'Balanced'],
  ['accommodation', 'Accommodation', ['Charming & local', 'Boutique comfort', 'Luxury stays', 'A thoughtful mix']],
  ['budget', 'Budget per traveler', ['Under €2,000', '€2,000–€3,500', '€3,500–€5,000', '€5,000–€8,000', '€8,000+', 'I’m not sure yet']],
];
const control = 'mt-2 block w-full min-w-0 border border-forest/25 bg-[#fffcf6] px-3 py-3 text-sm font-normal focus:outline-2 focus:outline-forest focus:outline-offset-2';
const button = 'inline-flex items-center justify-center gap-6 bg-forest px-7 py-4 text-sm font-bold text-white hover:bg-[#2b4b41]';

export default function TripPlanner({ open, onClose }) {
  const dialog = useRef(null);
  const heading = useRef(null);
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    setSummary(null);
    dialog.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.current?.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [open]);
  useEffect(() => { if (summary) heading.current?.focus(); }, [summary]);
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSummary(['destination', 'duration', 'travelers', 'style'].map(key => data.get(key)).join(' · '));
  }
  return <dialog ref={dialog} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) onClose();
  }} aria-labelledby={summary ? 'success-title' : 'trip-title'} className="fixed inset-0 m-auto max-h-[calc(100dvh-24px)] w-[min(760px,calc(100%-32px))] overflow-y-auto border border-forest/15 bg-cream px-5 py-7 text-forest shadow-2xl backdrop:bg-[#0b181bb3] backdrop:backdrop-blur-sm min-[601px]:max-h-[calc(100dvh-48px)] min-[601px]:p-9">
    <button type="button" onClick={onClose} aria-label="Close trip planner" className="absolute top-4 right-[18px] size-9 border border-forest/15 text-[26px] leading-none hover:bg-forest/5">×</button>
    {summary ? <section className="py-6">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[2.5px]">Your journey starts here</p>
      <h2 id="success-title" ref={heading} tabIndex={-1} className="pr-8 text-[32px] min-[601px]:text-[40px]">Your trip ideas are ready.</h2>
      <p className="text-sm text-muted">{summary}</p>
      <p className="text-sm text-muted">This is a course project demo. Your choices have not been sent or saved.</p>
      <button type="button" className={button} onClick={onClose}>Done</button>
    </section> : <>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[2.5px]">Your trip, your way</p>
      <h2 id="trip-title" className="mb-4 pr-8 text-[32px] min-[601px]:text-[40px]">Plan your trip</h2>
      <p className="text-sm text-muted">Tell us what your ideal journey looks like. You can keep things broad—we’ll help with the details.</p>
      <form onSubmit={submit} key={open ? 'open' : 'closed'}>
        <div className="my-6 grid gap-[18px] min-[601px]:grid-cols-2">
          {fields.map(([name, label, options, initial], index) => <div key={name} className={index === 0 ? 'contents' : ''}>
            <label className="block text-xs font-bold" htmlFor={name}>{label}
              <select id={name} name={name} required defaultValue={initial || ''} className={control}>
                {!initial && <option value="" disabled>Select an option</option>}
                {options.map(option => <option key={option}>{option}</option>)}
              </select>
            </label>
            {index === 0 && <label className="block text-xs font-bold" htmlFor="departure">Preferred departure (optional)<input id="departure" name="departure" type="month" className={control} /></label>}
          </div>)}
        </div>
        <label htmlFor="notes" className="block text-xs font-bold">Anything else we should know?<textarea id="notes" name="notes" rows={3} className={`€{control} resize-y`} placeholder="Celebrations, must-see places, accessibility needs, or anything that would make this trip special..." /></label>
        <div className="mt-6 flex flex-col gap-4 min-[601px]:flex-row min-[601px]:items-center min-[601px]:justify-between min-[601px]:gap-6">
          <p className="mb-0 max-w-[300px] text-[11px] text-muted">No commitment—this simply helps us understand your plans.</p>
          <button type="submit" className={`€{button} whitespace-nowrap`}>Create my trip <span aria-hidden="true">↗</span></button>
        </div>
      </form>
    </>}
  </dialog>;
}
