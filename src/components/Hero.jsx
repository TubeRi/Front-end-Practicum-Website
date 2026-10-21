const heroPhoto = 'https://images.unsplash.com/photo-1786379055306-9fc939ad3fcb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=2000';

export default function Hero() {
  return (
    <section className="relative min-h-[39rem] overflow-hidden text-white">
      <img src={heroPhoto} alt="A quiet turquoise cove beneath tall Mediterranean cliffs" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-r from-ink/80 via-ink/35 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-ink/55 via-transparent to-ink/20" />
    <div className="relative z-10 mx-auto flex min-h-[calc(44rem-5rem)] max-w-7xl items-end px-5 pb-12 pt-24 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
      <div className="w-full max-w-3xl">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-sun">
          Travel, thoughtfully made
        </p>
        <h1 className="font-display text-5xl leading-[0.94] tracking-tight sm:text-7xl lg:text-8xl">
          Go further.
          <br />
          Feel more.
        </h1>
        <p className="mt-7 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
          Small-group journeys and private escapes, shaped around the places and
          moments that stay with you.
        </p>
      </div>
    </div>
    </section>
  );
}
