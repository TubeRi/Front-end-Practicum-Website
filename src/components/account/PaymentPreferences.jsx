import { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import { paymentTypes } from '../../services/account';

export default function PaymentPreferences() {
  const { paymentMethods, defaultPaymentId, addPaymentMethod, removePaymentMethod, setPreferredPayment } = useAccount();
  const [type, setType] = useState('card');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function submit(event) {
    event.preventDefault(); setError(''); setStatus('');
    try { addPaymentMethod(type, nickname); setNickname(''); setStatus('Payment preference added. No payment account has been connected.'); }
    catch (issue) { setError(issue.message); }
  }

  return (
    <section id="payment-methods" aria-labelledby="payments-title" className="scroll-mt-24 border border-line bg-white p-5 sm:p-8">
      <h2 id="payments-title" className="font-display text-3xl sm:text-4xl">Payment preferences</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">Choose how you would like to pay later. These are preferences only: card and wallet connections will be handled securely at checkout when payments are available.</p>
      <div className="mt-6 space-y-3">
        {paymentMethods.length === 0 && <p className="border border-dashed border-line p-5 text-sm text-muted">No payment preferences added yet.</p>}
        {paymentMethods.map(method => (
          <div key={method.id} className="flex min-w-0 flex-wrap items-center justify-between gap-4 border border-line bg-canvas p-4">
            <div className="min-w-0"><p className="break-words font-bold">{method.label}</p><p className="mt-1 text-xs text-muted">{paymentTypes.find(option => option.value === method.type)?.label} · Not connected</p></div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              {method.id === defaultPaymentId ? <span className="bg-sun/30 px-3 py-2">Preferred</span> : <button type="button" onClick={() => { setPreferredPayment(method.id); setStatus('Preferred payment method updated.'); }} className="border-b border-ink hover:text-moss" aria-label={'Make ' + method.label + ' preferred'}>Make preferred</button>}
              <button type="button" onClick={() => { removePaymentMethod(method.id); setStatus('Payment preference removed.'); }} className="text-muted hover:text-red-800" aria-label={'Remove ' + method.label}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="mt-7 space-y-5 border-t border-line pt-6">
        <label className="block text-sm font-bold" htmlFor="payment-type">Payment method
          <select id="payment-type" value={type} onChange={event => setType(event.target.value)} className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm">
            {paymentTypes.map(method => <option key={method.value} value={method.value}>{method.label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-bold" htmlFor="payment-nickname">Nickname (optional)
          <input id="payment-nickname" value={nickname} onChange={event => setNickname(event.target.value)} maxLength={40} className="mt-2 w-full min-w-0 border border-line px-4 py-3 text-sm" placeholder="For example: Travel wallet" />
        </label>
        <p className="text-xs text-muted">Do not enter card numbers, security codes, bank details, or wallet passwords.</p>
        {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
        <button type="submit" className="bg-ink px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-moss">Add payment preference</button>
        <p role="status" className="text-sm text-moss">{status}</p>
      </form>
    </section>
  );
}
