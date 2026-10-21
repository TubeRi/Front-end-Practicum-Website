import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, Navigate } from 'react-router';

import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Stories from './pages/Stories';
import TripPlanner from './components/TripPlanner';
import Header from './components/Header';
import Footer from './components/Footer';

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
    <Header onPlan={onPlan} />
    <Routes>
      <Route path="/" element={<Home onPlan={onPlan} />} />
      <Route path="/about" element={<Home onPlan={onPlan} />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/stories" element={<Stories />} />
      {['index', 'about', 'destinations', 'stories'].map(page => <Route key={page} path={`/${page}.html`} element={<Navigate replace to={page === 'index' ? '/' : `/${page}`} />} />)}
      <Route path="*" element={<main className={`${container} py-24`}><h1>Page not found</h1><Link to="/" className="underline">Return to TravelPoint</Link></main>} />
    </Routes>
    <Footer />
    <TripPlanner open={plannerOpen} onClose={() => setPlannerOpen(false)} />
  </div>;
}
