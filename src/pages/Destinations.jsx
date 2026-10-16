import { useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { destinations } from '../data/destinations';
import DestinationCard from '../components/DestinationCard';
export default function Destinations() {
 const [region,setRegion]=useState('all');
 const [searchParams] = useSearchParams();
 const search = (searchParams.get('search') || '').trim().toLowerCase();
 const regions={all:'All',africa:'Africa',asia:'Asia',europe:'Europe','south-america':'South America'};
 const filteredDestinations = destinations.filter(destination => (region === 'all' || destination.region === region) && (!search || destination.location.toLowerCase().includes(search) || destination.title.toLowerCase().includes(search)));
 const count = filteredDestinations.length;
 return <main><section className="pt-[55px] pb-[30px] min-[651px]:pt-[85px] min-[651px]:pb-[50px] [&_h1]:max-w-[950px] [&_h1]:text-[clamp(44px,6vw,76px)] [&_h1]:tracking-[-2px] [&>p:not(.eyebrow)]:max-w-[650px] [&>p:not(.eyebrow)]:text-lg [&>p:not(.eyebrow)]:text-muted mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Find your next journey</p>
    <h1>All destinations</h1>
    <p>From remote mountain paths to unhurried island days, explore every destination currently available with TravelPoint.</p>
</section>
 <section className="mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)] pb-[85px]" aria-label="Destination catalog">
 <p className="text-sm text-muted" aria-live="polite">{count} {count===1?'journey':'journeys'} available</p>
 {search && <p className="text-sm text-muted">Showing results for “{searchParams.get('search')}”. <Link to="/destinations" className="underline">View all destinations</Link></p>}
 <fieldset className="mb-[35px] flex flex-wrap gap-3"><legend className="mb-3 text-xs text-muted">Explore by region</legend>
 {Object.entries(regions).map(([value,label])=><label key={value} className="cursor-pointer"><input className="peer sr-only" type="radio" name="region" value={value} checked={region===value} onChange={()=>setRegion(value)}/><span className="block border border-forest/20 px-4 py-2 text-[11px] font-bold uppercase tracking-wider peer-checked:border-forest peer-checked:bg-forest peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-gold">{label}</span></label>)}
 </fieldset><div className="grid grid-cols-1 gap-x-7 gap-y-[45px] min-[601px]:grid-cols-2 min-[901px]:grid-cols-3">
 {filteredDestinations.map(destination => (
   <DestinationCard key={destination.id} destination={destination} />
 ))}
 </div></section></main>;
}


