import {useState} from 'react';
export default function Destinations() {
 const [region,setRegion]=useState('all');
 const regions={all:'All',africa:'Africa',asia:'Asia',europe:'Europe','south-america':'South America'};
 const count=["asia","south-america","africa","asia","europe","europe"].filter(value=>region==='all'||value===region).length;
 return <main><section className="pt-[55px] pb-[30px] min-[651px]:pt-[85px] min-[651px]:pb-[50px] [&_h1]:max-w-[950px] [&_h1]:text-[clamp(44px,6vw,76px)] [&_h1]:tracking-[-2px] [&>p:not(.eyebrow)]:max-w-[650px] [&>p:not(.eyebrow)]:text-lg [&>p:not(.eyebrow)]:text-muted mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Find your next journey</p>
    <h1>All destinations</h1>
    <p>From remote mountain paths to unhurried island days, explore every destination currently available with TravelPoint.</p>
</section>
 <section className="mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)] pb-[85px]" aria-label="Destination catalog">
 <p className="text-sm text-muted" aria-live="polite">{count} {count===1?'journey':'journeys'} available</p>
 <fieldset className="mb-[35px] flex flex-wrap gap-3"><legend className="mb-3 text-xs text-muted">Explore by region</legend>
 {Object.entries(regions).map(([value,label])=><label key={value} className="cursor-pointer"><input className="peer sr-only" type="radio" name="region" value={value} checked={region===value} onChange={()=>setRegion(value)}/><span className="block border border-forest/20 px-4 py-2 text-[11px] font-bold uppercase tracking-wider peer-checked:border-forest peer-checked:bg-forest peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-gold">{label}</span></label>)}
 </fieldset><div className="grid grid-cols-1 gap-x-7 gap-y-[45px] min-[601px]:grid-cols-2 min-[901px]:grid-cols-3">
 {(region==='all'||region==='asia')&&<article className="group min-w-0 [&>.eyebrow]:mb-2.5 [&>.eyebrow]:text-[10px] [&>.eyebrow]:text-muted flex flex-col [&_h2]:mb-3.5 [&_h2]:text-3xl [&_h2]:tracking-[-0.5px] [&_.destination-description]:mb-6 [&_.destination-description]:text-[15px] [&_.destination-description]:text-muted [&_.region-tag]:float-right [&_.region-tag]:rounded [&_.region-tag]:border [&_.region-tag]:border-forest/15 [&_.region-tag]:px-1.5 [&_.region-tag]:normal-case [&_.region-tag]:tracking-normal">
                    <div className="mb-6 aspect-[4/5] overflow-hidden rounded [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 [&_img]:group-hover:scale-[1.04] motion-reduce:[&_img]:transition-none"><img src={new URL("../front-end/assets/Photos/japan.jpeg", import.meta.url).href} alt="Kyoto city and mountains at sunset" loading="lazy" /></div>
                    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Kyoto, Japan <span className="region-tag">Asia</span></p>
                    <h2>Quiet Temples &amp; Tea</h2>
<p className="destination-description">Ancient temples, private tea rituals, and slow mornings in the old capital.</p>
                    <div className="mt-auto flex justify-between gap-3 pt-1 text-sm text-muted [&_strong]:font-bold [&_strong]:text-forest"><span>8 days</span><span>From <strong>$2,480</strong></span></div>
                </article>}
{(region==='all'||region==='south-america')&&<article className="group min-w-0 [&>.eyebrow]:mb-2.5 [&>.eyebrow]:text-[10px] [&>.eyebrow]:text-muted flex flex-col [&_h2]:mb-3.5 [&_h2]:text-3xl [&_h2]:tracking-[-0.5px] [&_.destination-description]:mb-6 [&_.destination-description]:text-[15px] [&_.destination-description]:text-muted [&_.region-tag]:float-right [&_.region-tag]:rounded [&_.region-tag]:border [&_.region-tag]:border-forest/15 [&_.region-tag]:px-1.5 [&_.region-tag]:normal-case [&_.region-tag]:tracking-normal">
                    <div className="mb-6 aspect-[4/5] overflow-hidden rounded [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 [&_img]:group-hover:scale-[1.04] motion-reduce:[&_img]:transition-none"><img src={new URL("../front-end/assets/Photos/argentina.jpeg", import.meta.url).href} alt="Patagonia mountains reflected in a clear blue lake" loading="lazy" /></div>
                    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Patagonia, Argentina <span className="region-tag">South America</span></p>
                    <h2>Edge of the Wild</h2>
<p className="destination-description">Glacial lakes, granite peaks, and trails through the world’s wild southern edge.</p>
                    <div className="mt-auto flex justify-between gap-3 pt-1 text-sm text-muted [&_strong]:font-bold [&_strong]:text-forest"><span>10 days</span><span>From <strong>$3,260</strong></span></div>
                </article>}
{(region==='all'||region==='africa')&&<article className="group min-w-0 [&>.eyebrow]:mb-2.5 [&>.eyebrow]:text-[10px] [&>.eyebrow]:text-muted flex flex-col [&_h2]:mb-3.5 [&_h2]:text-3xl [&_h2]:tracking-[-0.5px] [&_.destination-description]:mb-6 [&_.destination-description]:text-[15px] [&_.destination-description]:text-muted [&_.region-tag]:float-right [&_.region-tag]:rounded [&_.region-tag]:border [&_.region-tag]:border-forest/15 [&_.region-tag]:px-1.5 [&_.region-tag]:normal-case [&_.region-tag]:tracking-normal">
                    <div className="mb-6 aspect-[4/5] overflow-hidden rounded [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 [&_img]:group-hover:scale-[1.04] motion-reduce:[&_img]:transition-none"><img src={new URL("../front-end/assets/Photos/moroco.jpeg", import.meta.url).href} alt="Canvas desert camp beneath the stars in Morocco" loading="lazy" /></div>
                    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Sahara, Morocco <span className="region-tag">Africa</span></p>
                    <h2>Desert After Dark</h2>
<p className="destination-description">Kasbah roads, golden dunes, and nights beneath an uninterrupted desert sky.</p>
                    <div className="mt-auto flex justify-between gap-3 pt-1 text-sm text-muted [&_strong]:font-bold [&_strong]:text-forest"><span>6 days</span><span>From <strong>$1,890</strong></span></div>
                </article>}
{(region==='all'||region==='asia')&&<article className="group min-w-0 [&>.eyebrow]:mb-2.5 [&>.eyebrow]:text-[10px] [&>.eyebrow]:text-muted flex flex-col [&_h2]:mb-3.5 [&_h2]:text-3xl [&_h2]:tracking-[-0.5px] [&_.destination-description]:mb-6 [&_.destination-description]:text-[15px] [&_.destination-description]:text-muted [&_.region-tag]:float-right [&_.region-tag]:rounded [&_.region-tag]:border [&_.region-tag]:border-forest/15 [&_.region-tag]:px-1.5 [&_.region-tag]:normal-case [&_.region-tag]:tracking-normal">
                    <div className="mb-6 aspect-[4/5] overflow-hidden rounded [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 [&_img]:group-hover:scale-[1.04] motion-reduce:[&_img]:transition-none"><img src={new URL("../front-end/assets/Photos/bali.jpeg", import.meta.url).href} alt="Green rice terraces and palms in Ubud, Bali" loading="lazy" /></div>
                    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Ubud, Bali <span className="region-tag">Asia</span></p>
                    <h2>Among the Rice Fields</h2>
<p className="destination-description">A restorative week of village walks, green terraces, and island cooking.</p>
                    <div className="mt-auto flex justify-between gap-3 pt-1 text-sm text-muted [&_strong]:font-bold [&_strong]:text-forest"><span>7 days</span><span>From <strong>$2,120</strong></span></div>
                </article>}
{(region==='all'||region==='europe')&&<article className="group min-w-0 [&>.eyebrow]:mb-2.5 [&>.eyebrow]:text-[10px] [&>.eyebrow]:text-muted flex flex-col [&_h2]:mb-3.5 [&_h2]:text-3xl [&_h2]:tracking-[-0.5px] [&_.destination-description]:mb-6 [&_.destination-description]:text-[15px] [&_.destination-description]:text-muted [&_.region-tag]:float-right [&_.region-tag]:rounded [&_.region-tag]:border [&_.region-tag]:border-forest/15 [&_.region-tag]:px-1.5 [&_.region-tag]:normal-case [&_.region-tag]:tracking-normal">
                    <div className="mb-6 aspect-[4/5] overflow-hidden rounded [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 [&_img]:group-hover:scale-[1.04] motion-reduce:[&_img]:transition-none"><img src={new URL("../front-end/assets/Photos/italy.jpeg", import.meta.url).href} alt="A mountain church beneath the Italian Dolomites" loading="lazy" /></div>
                    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">The Dolomites, Italy <span className="region-tag">Europe</span></p>
                    <h2>Alpine Slow Days</h2>
<p className="destination-description">Meadow paths, dramatic limestone peaks, and considered mountain hospitality.</p>
                    <div className="mt-auto flex justify-between gap-3 pt-1 text-sm text-muted [&_strong]:font-bold [&_strong]:text-forest"><span>7 days</span><span>From <strong>$2,740</strong></span></div>
                </article>}
{(region==='all'||region==='europe')&&<article className="group min-w-0 [&>.eyebrow]:mb-2.5 [&>.eyebrow]:text-[10px] [&>.eyebrow]:text-muted flex flex-col [&_h2]:mb-3.5 [&_h2]:text-3xl [&_h2]:tracking-[-0.5px] [&_.destination-description]:mb-6 [&_.destination-description]:text-[15px] [&_.destination-description]:text-muted [&_.region-tag]:float-right [&_.region-tag]:rounded [&_.region-tag]:border [&_.region-tag]:border-forest/15 [&_.region-tag]:px-1.5 [&_.region-tag]:normal-case [&_.region-tag]:tracking-normal">
                    <div className="mb-6 aspect-[4/5] overflow-hidden rounded [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 [&_img]:group-hover:scale-[1.04] motion-reduce:[&_img]:transition-none"><img src={new URL("../front-end/assets/Photos/greece.jpeg", import.meta.url).href} alt="Rocky Mediterranean coast meeting vivid blue water" loading="lazy" /></div>
                    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">The Aegean, Greece <span className="region-tag">Europe</span></p>
                    <h2>Islands in Blue</h2>
<p className="destination-description">Quiet coves, family tavernas, and a leisurely passage between lesser-known islands.</p>
                    <div className="mt-auto flex justify-between gap-3 pt-1 text-sm text-muted [&_strong]:font-bold [&_strong]:text-forest"><span>9 days</span><span>From <strong>$2,960</strong></span></div>
                </article>}
 </div></section></main>;
}


