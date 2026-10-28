import { useState } from 'react';
import ReviewSection from '../components/ReviewSection';
import { testimonials } from '../data/testimonials';
import Testimonial from '../components/Testimonial';
function StoriesPage() {
  const featured = testimonials[0];
  const [addedReviews, setAddedReviews] = useState([]);
  const recentReviews = [...addedReviews, ...testimonials.slice(1)];

  function addReview(review) {
    setAddedReviews(current => [review, ...current]);
    requestAnimationFrame(() => document.getElementById('recent-reviews')?.scrollIntoView({ block: 'start' }));
  }

  return (
    <>
      <main className="min-h-screen bg-canvas text-ink">


        <section className="border-b border-line px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-moss">
              Traveler stories
            </p>
            <div className="grid items-end gap-10 lg:grid-cols-[1.35fr_0.65fr]">
              <h1 className="max-w-4xl font-display text-6xl leading-none tracking-tight sm:text-7xl lg:text-8xl">
                Told by the people who went.
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-muted">
                Honest reflections from travelers who trusted us to turn an idea
                into an experience they’ll carry with them.
              </p>
            </div>


            <div className="mt-16 grid gap-px bg-line sm:grid-cols-3">
              <div className="bg-canvas py-6 sm:px-6 sm:first:pl-0">
                <strong className="block font-display text-4xl">4.9 / 5</strong>
                <span className="mt-1 block text-sm text-muted">
                  Average traveler rating
                </span>
              </div>
              <div className="bg-canvas py-6 sm:px-6">
                <strong className="block font-display text-4xl">96%</strong>
                <span className="mt-1 block text-sm text-muted">
                  Would travel with us again
                </span>
              </div>
              <div className="bg-canvas py-6 sm:px-6">
                <strong className="block font-display text-4xl">28</strong>
                <span className="mt-1 block text-sm text-muted">
                  Countries explored this year
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-ink px-5 py-16 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <Testimonial testimonial={featured} featured />
        </section>

        <section id="recent-reviews" className="scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between border-b border-line pb-6">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-moss">
                  In their own words
                </p>
                <h2 className="font-display text-5xl">Recent experiences</h2>
              </div>
              <p className="hidden text-sm text-muted sm:block">
                TravelPoint traveler reviews
              </p>
            </div>

            <div className="grid gap-px bg-line md:grid-cols-2">
              {recentReviews.map((testimonial) => (
                <Testimonial key={testimonial.id || testimonial.name} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>


        <ReviewSection onReviewAdded={addReview} />
      </main>
    </>
  )
}

export default StoriesPage
