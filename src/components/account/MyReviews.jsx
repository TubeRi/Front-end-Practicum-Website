import { useAccount } from "../../context/AccountContext";
import Testimonial from "../Testimonial";
export default function MyReviews() {
  const { reviews } = useAccount();
  return (
    <section
      id="my-reviews"
      className="scroll-mt-24 border border-line bg-white p-5 sm:p-8"
    >
      <h2 className="font-display text-3xl sm:text-4xl">My reviews</h2>
      <p className="mt-3 text-sm text-muted">
        The reviews you have shared on Stories.
      </p>
      <div className="mt-6 space-y-4">
        {reviews.length ? (
          reviews.map((review) => (
            <Testimonial key={review.id} testimonial={review} />
          ))
        ) : (
          <p className="text-sm text-muted">
            You have not written a review yet.
          </p>
        )}
      </div>
    </section>
  );
}
