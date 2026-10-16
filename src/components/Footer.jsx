import { Link } from 'react-router';

const container = 'mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]';

export default function Footer() {
  return (
    <footer className={`${container} flex flex-col items-start justify-between gap-6 py-9 text-xs text-muted min-[601px]:flex-row min-[601px]:items-center`}>
      <div><Link to="/" className="font-display text-[26px] leading-tight text-forest">TravelPoint</Link><p className="mt-2 mb-0">Considered journeys, made personal.</p></div>
      <p className="mb-0">© 2026 TravelPoint. Course project.</p>
    </footer>
  );
}
