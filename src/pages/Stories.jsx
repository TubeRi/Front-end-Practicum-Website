import Testimonial from '../components/Testimonial';
import { testimonials } from '../data/testimonials';

const featuredTestimonial = testimonials.find(testimonial => testimonial.featured);
const recentTestimonials = testimonials.filter(testimonial => !testimonial.featured);

export default function Stories() {
  return (
    <main>
      <section className="pt-[55px] pb-[30px] min-[651px]:pt-[85px] min-[651px]:pb-[50px] [&_h1]:max-w-[950px] [&_h1]:text-[clamp(44px,6vw,76px)] [&_h1]:tracking-[-2px] [&>p:not(.eyebrow)]:max-w-[650px] [&>p:not(.eyebrow)]:text-lg [&>p:not(.eyebrow)]:text-muted mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
        <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">Traveler stories</p>
        <h1>Told by the people who went.</h1>
        <p>Honest reflections from travelers who trusted us to turn an idea into an experience they’ll carry with them.</p>
        <dl className="mt-[30px] grid gap-2.5 min-[651px]:mt-[55px] min-[651px]:grid-cols-3 min-[651px]:gap-0 [&>div]:flex [&>div]:flex-col [&>div]:border-t [&>div]:border-forest/15 [&>div]:py-4 min-[651px]:[&>div]:border-t-0 min-[651px]:[&>div]:border-l min-[651px]:[&>div]:px-7 [&>div:first-child]:border-0 [&>div:first-child]:pl-0 [&_dt]:text-[13px] [&_dt]:text-muted [&_dd]:order-first [&_dd]:font-serif [&_dd]:text-[38px] [&_dd]:font-bold">
            <div>
              <dt>Average traveler rating</dt>
              <dd>4.9 / 5</dd>
            </div>
            <div>
              <dt>Would travel with us again</dt>
              <dd>96%</dd>
            </div>
            <div>
              <dt>Countries explored this year</dt>
              <dd>28</dd>
            </div>
        </dl>
      </section>
      <section className="bg-forest p-7 text-white min-[651px]:p-12 mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]" aria-label="Featured traveler story">
        <Testimonial testimonial={featuredTestimonial} featured />
      </section>
      <section className="pt-[75px] pb-[85px] mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]">
        <p className="eyebrow mb-[22px] text-[11px] font-bold uppercase tracking-[2.5px]">In their own words</p>
        <div className="mb-[42px] gap-10 min-[601px]:flex min-[601px]:items-end min-[601px]:justify-between [&_h2]:mb-0 [&_p]:mb-0 [&_p]:mt-5 [&_p]:max-w-[390px] [&_p]:text-muted">
          <h2>Recent experiences</h2>
          <p>Verified TravelPoint travelers</p>
        </div>
        <div className="grid gap-6 min-[651px]:grid-cols-2">
          {recentTestimonials.map(testimonial => (
            <Testimonial key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>
    </main>
  );
}
