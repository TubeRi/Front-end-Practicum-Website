import { Link } from 'react-router';
export default function Home({onPlan}) { return (<main>

        <section className="bg-forest bg-cover bg-center text-white" style={{ backgroundImage: `linear-gradient(90deg, #18302a99, #18302a20), url(${new URL("../front-end/assets/Photos/greece.jpeg", import.meta.url).href})` }}>
            
            <div className="py-20 min-[601px]:pt-[110px] min-[601px]:pb-[100px] mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
                <h1>Go further<br />Feel more</h1>
                <p className="mb-8 max-w-[475px] text-[19px] text-white/90">Small-group journeys and private escapes, shaped around the places—and moments—that stay with you.</p>
            </div>
        </section>

        <section id="about" className="grid gap-5 border-b border-forest/15 py-[60px] min-[601px]:grid-cols-[1.1fr_1fr] min-[601px]:gap-10 min-[601px]:py-[90px] min-[901px]:gap-[100px] [&_h2]:mb-0 [&_h2]:text-[clamp(32px,3vw,42px)] mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
            <div>
                <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">The TravelPoint difference</p>
                <h2>We believe the best journeys leave room for surprise.</h2>
            </div>
            <div className="text-muted min-[601px]:pt-[30px] [&_p:last-child]:mb-0">
                <p>Our travel designers pair local knowledge with thoughtful pacing, creating trips that feel effortless without ever feeling ordinary.</p>
                <p>Stay in places with soul, meet people with stories, and travel in a way that gives back to every destination.</p>
            </div>
        </section>

        <section id="journeys" className="py-[60px] min-[601px]:py-[90px] mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
            <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Curated journeys</p>
            <div className="mb-[42px] gap-10 min-[601px]:flex min-[601px]:items-end min-[601px]:justify-between [&_h2]:mb-0 [&_p]:mb-0 [&_p]:mt-5 [&_p]:max-w-[390px] [&_p]:text-muted">
                <h2>Where will you go?</h2>
                <p>A glimpse of what’s possible. Explore every journey on our complete destinations page.<br /><Link className="mt-[18px] inline-block border-b text-sm font-bold" to="/destinations">View all destinations &rarr;</Link></p>
            </div>
            <div className="grid grid-cols-1 gap-x-7 gap-y-[45px] min-[601px]:grid-cols-2 min-[901px]:grid-cols-3">
                <article className="group min-w-0 [&>.eyebrow]:mb-2.5 [&>.eyebrow]:text-[10px] [&>.eyebrow]:text-muted">
                    <div className="mb-6 aspect-[4/5] overflow-hidden rounded [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 [&_img]:group-hover:scale-[1.04] motion-reduce:[&_img]:transition-none"><img src={new URL("../front-end/assets/Photos/japan.jpeg", import.meta.url).href} alt="Kyoto city and mountains at sunset" loading="lazy" /></div>
                    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Kyoto, Japan</p>
                    <h3>Quiet Temples &amp; Tea</h3>
                    <div className="mt-auto flex justify-between gap-3 pt-1 text-sm text-muted [&_strong]:font-bold [&_strong]:text-forest"><span>8 days</span><span>From <strong>$2,480</strong></span></div>
                </article>
                <article className="group min-w-0 [&>.eyebrow]:mb-2.5 [&>.eyebrow]:text-[10px] [&>.eyebrow]:text-muted">
                    <div className="mb-6 aspect-[4/5] overflow-hidden rounded [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 [&_img]:group-hover:scale-[1.04] motion-reduce:[&_img]:transition-none"><img src={new URL("../front-end/assets/Photos/argentina.jpeg", import.meta.url).href} alt="Patagonia mountains reflected in a clear blue lake" loading="lazy" /></div>
                    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Patagonia, Argentina</p>
                    <h3>Edge of the Wild</h3>
                    <div className="mt-auto flex justify-between gap-3 pt-1 text-sm text-muted [&_strong]:font-bold [&_strong]:text-forest"><span>10 days</span><span>From <strong>$3,260</strong></span></div>
                </article>
                <article className="group min-w-0 [&>.eyebrow]:mb-2.5 [&>.eyebrow]:text-[10px] [&>.eyebrow]:text-muted">
                    <div className="mb-6 aspect-[4/5] overflow-hidden rounded [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-400 [&_img]:group-hover:scale-[1.04] motion-reduce:[&_img]:transition-none"><img src={new URL("../front-end/assets/Photos/moroco.jpeg", import.meta.url).href} alt="Canvas desert camp beneath the stars in Morocco" loading="lazy" /></div>
                    <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Sahara, Morocco</p>
                    <h3>Desert After Dark</h3>
                    <div className="mt-auto flex justify-between gap-3 pt-1 text-sm text-muted [&_strong]:font-bold [&_strong]:text-forest"><span>6 days</span><span>From <strong>$1,890</strong></span></div>
                </article>
                
                
                
            </div>
        </section>

        <section id="stories" className="bg-forest py-[60px] text-white min-[601px]:py-[85px] [&_.eyebrow]:text-gold">
            <div className="mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
                <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Notes from the road</p>
                <h2>Journeys worth<br />writing home about.</h2>
                <div className="mt-[45px] grid grid-cols-1 gap-6 min-[601px]:grid-cols-3 min-[901px]:gap-9 [&_figure]:flex [&_figure]:flex-col [&_figure]:border-t [&_figure]:border-white/20 [&_figure]:pt-[26px] [&_blockquote]:mb-[30px] [&_blockquote]:font-serif [&_blockquote]:text-xl [&_figcaption]:mt-auto [&_figcaption]:flex [&_figcaption]:items-center [&_figcaption]:gap-3.5 [&_figcaption]:text-sm [&_small]:block [&_small]:text-xs [&_small]:text-white/60">
                    <figure>
                        <blockquote>“Every detail felt considered, but never over-planned. We found the tiny places we would never have discovered on our own.”</blockquote>
                        <figcaption><span className="avatar grid size-[42px] shrink-0 place-items-center rounded-full bg-white/10 text-xs text-gold" aria-hidden="true">MT</span><div>Maya &amp; Tom<small>Japan, Spring 2024</small></div></figcaption>
                    </figure>
                    <figure>
                        <blockquote>“Our Patagonia trip struck the perfect balance between wild adventure and genuine comfort. We are still talking about it.”</blockquote>
                        <figcaption><span className="avatar grid size-[42px] shrink-0 place-items-center rounded-full bg-white/10 text-xs text-gold" aria-hidden="true">ER</span><div>Elena R.<small>Patagonia, Autumn 2024</small></div></figcaption>
                    </figure>
                    <figure>
                        <blockquote>“From the first conversation, we felt listened to. The result was less like a holiday and more like a story written for us.”</blockquote>
                        <figcaption><span className="avatar grid size-[42px] shrink-0 place-items-center rounded-full bg-white/10 text-xs text-gold" aria-hidden="true">NJ</span><div>Noah &amp; Jules<small>Morocco, Winter 2025</small></div></figcaption>
                    </figure>
                </div>
            </div>
        </section>

        <section id="plan" className="bg-gold py-[60px] text-center min-[601px]:py-[95px] [&_h2]:mx-auto [&_h2]:max-w-[700px] [&_h2]:text-[clamp(40px,5vw,64px)] [&_p:not(.eyebrow)]:mx-auto [&_p:not(.eyebrow)]:mb-8 [&_p:not(.eyebrow)]:max-w-[540px]">
            <div className="mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
                <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Your journey starts here</p>
                <h2>Let’s plan something remarkable.</h2>
                <p>Tell us where you’re dreaming of. One of our travel designers will be in touch within two working days.</p>
                <button type="button" className="inline-flex items-center justify-center gap-6 rounded-full px-7 py-4 text-sm font-bold transition hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none bg-forest text-white hover:bg-[#2b4b41]" onClick={onPlan}>Plan your trip <span aria-hidden="true">↗</span></button>
            </div>
        </section>
    
</main>); }


