import { useAccount } from "../../context/AccountContext";
import Testimonial from "../Testimonial";
import { useState } from "react";
import DeleteReviewButton from "./DeleteReviewButton";
export default function MyReviews() {
  const { reviews } = useAccount();
  const [status, setStatus] = useState("");
  return (
    <section
      id="my-reviews"
      className="scroll-mt-24 border border-line bg-white p-5 sm:p-8"
    >
      <h2 className="font-display text-3xl sm:text-4xl">My reviews</h2>
      <p className="mt-3 text-sm text-muted">
        The reviews you have shared on Stories. You can delete your own reviews
        here.
      </p>
      <p role="status" className="mt-3 text-sm text-moss">
        {status}
      </p>
      <div className="mt-6 space-y-4">
        {reviews.length ? (
          reviews.map((review) => (
            <div key={review.id} className="overflow-hidden border border-line">
              <Testimonial testimonial={review} />
              <DeleteReviewButton
                reviewId={review.id}
                onDeleted={() =>
                  setStatus(
                    "Your review was deleted from Stories and your profile.",
                  )
                }
              />
            </div>
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
