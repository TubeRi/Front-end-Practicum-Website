import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, Navigate } from 'react-router';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Stories from './pages/Stories';
import TripPlanner from './components/TripPlanner';
const container = 'mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]';
export default function App() {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = pathname.startsWith('/destinations') ? 'Destinations | TravelPoint' : pathname.startsWith('/stories') ? 'Stories | TravelPoint' : pathname.startsWith('/about') ? 'About | TravelPoint' : 'TravelPoint';
    window.scrollTo(0, 0);
    setPlannerOpen(false);
  }, [pathname]);
  const onPlan = () => setPlannerOpen(true);
  return <div className="pt-[122px] min-[651px]:pt-20">
    <header className="fixed inset-x-0 top-0 z-10 border-b border-white/10 bg-[#14211e] text-white">
      <div className={`${container} flex min-h-20 flex-wrap items-stretch gap-0 min-[651px]:flex-nowrap min-[651px]:gap-3 min-[901px]:gap-6`}>
        <Link to="/" aria-label="TravelPoint home" className="mr-auto flex h-[66px] items-center font-display text-2xl min-[651px]:h-auto min-[651px]:text-[26px]">TravelPoint</Link>
        <nav aria-label="Main navigation" className="order-3 flex min-h-14 w-full justify-between text-[10px] font-bold tracking-[1.5px] uppercase min-[651px]:order-none min-[651px]:w-auto min-[651px]:text-[11px]">
          {['About', 'Destinations', 'Stories'].map(label => <NavLink key={label} to={`/${label.toLowerCase()}`} className={({ isActive }) => `flex items-center border-b-2 px-2.5 py-4 min-[651px]:px-3.5 min-[901px]:px-6 hover:bg-white/5 hover:text-white ${isActive ? 'border-gold bg-[#31584c25] text-white' : 'border-transparent text-white/65'}`}>{label}</NavLink>)}
        </nav>
        <button type="button" onClick={onPlan} className="my-[15px] flex h-9 items-center gap-[18px] border border-gold/60 bg-gold px-3 text-[9px] font-bold tracking-[0.6px] text-[#14211e] uppercase transition hover:bg-[#f1ca70] min-[651px]:my-4 min-[651px]:h-auto min-[651px]:text-[11px] min-[901px]:px-5">Plan your trip <span aria-hidden="true">↗</span></button>
      </div>
    </header>
    <Routes>
      <Route path="/" element={<Home onPlan={onPlan} />} />
      <Route path="/about" element={<Home onPlan={onPlan} />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/stories" element={<Stories />} />
      {['index', 'about', 'destinations', 'stories'].map(page => <Route key={page} path={`/${page}.html`} element={<Navigate replace to={page === 'index' ? '/' : `/${page}`} />} />)}
      <Route path="*" element={<main className={`${container} py-24`}><h1>Page not found</h1><Link to="/" className="underline">Return to TravelPoint</Link></main>} />
    </Routes>
    <footer className={`${container} flex flex-col items-start justify-between gap-6 py-9 text-xs text-muted min-[601px]:flex-row min-[601px]:items-center`}>
      <div><Link to="/" className="font-display text-[26px] leading-tight text-forest">TravelPoint</Link><p className="mt-2 mb-0">Considered journeys, made personal.</p></div>
      <p className="mb-0">© 2026 TravelPoint. Course project.</p>
    </footer>
    <TripPlanner open={plannerOpen} onClose={() => setPlannerOpen(false)} />
  </div>;
}
