import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, Navigate } from 'react-router';

import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Stories from './pages/Stories';
import Login from './pages/Login';
import Account from './pages/Account';
import Booking from './pages/Booking';
import RequireAuth from './components/RequireAuth';
import TripPlanner from './components/TripPlanner';
import Header from './components/Header';
import Footer from './components/Footer';

const container = 'mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]';

export default function App() {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = pathname.startsWith('/account') ? 'My profile | TravelPoint' : pathname.startsWith('/login') ? 'Log in | TravelPoint' : pathname.startsWith('/destinations') ? 'Destinations | TravelPoint' : pathname.startsWith('/stories') ? 'Stories | TravelPoint' : pathname.startsWith('/about') ? 'About | TravelPoint' : 'TravelPoint';
    setPlannerOpen(false);
    if (hash) {
      const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  const onPlan = () => setPlannerOpen(true);
  return <div className="min-h-screen bg-canvas text-ink">
    <Header />
    <Routes>
      <Route path="/" element={<Home onPlan={onPlan} />} />
      <Route path="/about" element={<Home onPlan={onPlan} />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/stories/write" element={<Navigate replace to="/stories#write-review" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/book/:destinationId" element={<RequireAuth><Booking /></RequireAuth>} />
      <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
      {['index', 'about', 'destinations', 'stories'].map(page => <Route key={page} path={`/${page}.html`} element={<Navigate replace to={page === 'index' ? '/' : `/${page}`} />} />)}
      <Route path="*" element={<main className={`${container} py-24`}><h1>Page not found</h1><Link to="/" className="underline">Return to TravelPoint</Link></main>} />
    </Routes>
    <Footer />
    <TripPlanner open={plannerOpen} onClose={() => setPlannerOpen(false)} />
  </div>;
}
