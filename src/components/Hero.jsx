export default function Hero() {
  return (
    <section className="bg-forest bg-cover bg-center text-white" style={{ backgroundImage: `linear-gradient(90deg, #18302a99, #18302a20), url(${new URL("../front-end/assets/Photos/greece.jpeg", import.meta.url).href})` }}>
            
            <div className="py-20 min-[601px]:pt-[110px] min-[601px]:pb-[100px] mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
                <h1>Go further<br />Feel more</h1>
                <p className="mb-8 max-w-[475px] text-[19px] text-white/90">Small-group journeys and private escapes, shaped around the places—and moments—that stay with you.</p>
            </div>
        </section>
  );
}
