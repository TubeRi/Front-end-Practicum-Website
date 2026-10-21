export default function Testimonial({ testimonial, featured = false }) {
  const attribution = (
    <figcaption className={featured ? 'mb-7 flex items-center gap-3.5 text-sm' : 'mt-auto flex items-center gap-3.5 text-sm'}>
      <span
        aria-hidden="true"
        className={'grid size-[42px] shrink-0 place-items-center rounded-full text-xs ' + (featured ? 'bg-white/10 text-gold' : 'bg-forest/5 text-forest')}
      >
        {testimonial.initials}
      </span>
      <span>
        {testimonial.name}
        {featured && <small className="block text-xs text-white/60">{testimonial.trip}</small>}
      </span>
    </figcaption>
  );

  if (featured) {
    return (
      <figure>
        {attribution}
        <blockquote className="max-w-[920px] font-serif text-[clamp(24px,3vw,36px)] leading-[1.45]">
          “{testimonial.quote}”
        </blockquote>
      </figure>
    );
  }

  return (
    <figure className="flex flex-col border border-forest/15 bg-[#fffcf6] p-6 min-[651px]:p-[30px]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <p className="mb-0 text-[10px] font-bold uppercase tracking-[1.5px]">{testimonial.trip}</p>
        <span className="whitespace-nowrap text-xs font-bold">{testimonial.rating.toFixed(1)} / 5</span>
      </div>
      <blockquote className="mb-[30px] font-serif text-xl">“{testimonial.quote}”</blockquote>
      {attribution}
    </figure>
  );
}
