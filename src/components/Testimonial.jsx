import { formatReviewDate } from '../services/reviews';
export default function Testimonial({testimonial, featured=false}) { if(featured) return (<figure className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.45fr_1fr]">
            <figcaption className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sun font-bold text-ink">
                {testimonial.initials}
              </span>
              <span>
                <strong className="block">{testimonial.name}</strong>
                <span className="mt-1 block text-sm text-white/50">
                  {testimonial.createdAt ? <time dateTime={testimonial.createdAt}>{formatReviewDate(testimonial.createdAt)}</time> : testimonial.trip}
                </span>
              </span>
            </figcaption>
            <blockquote className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              “{testimonial.quote}”
            </blockquote>
          </figure>); return (<figure

                  className="flex min-h-80 flex-col justify-between bg-canvas p-8 lg:p-10"
                >
                  <div>
                    <div className="mb-7 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-moss">
                        {testimonial.createdAt ? <time dateTime={testimonial.createdAt}>{formatReviewDate(testimonial.createdAt)}</time> : testimonial.trip}
                      </span>
                      <span className="text-sm font-bold">
                        {testimonial.rating} / 5
                      </span>
                    </div>
                    <blockquote className="font-display text-3xl leading-snug">
                      “{testimonial.quote}”
                    </blockquote>
                  </div>
                  <figcaption className="mt-10 flex items-center gap-4">
                    <span className="flex size-11 items-center justify-center rounded-full bg-sand font-bold">
                      {testimonial.initials}
                    </span>
                    <strong>{testimonial.name}</strong>
                  </figcaption>
                </figure>); }
