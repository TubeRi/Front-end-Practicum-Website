import { useState } from "react";
import { useAccount } from "../../context/AccountContext";
import { useReviews } from "../../context/ReviewsContext";

export default function DeleteReviewButton({ reviewId, onDeleted }) {
  const { deleteReview } = useAccount();
  const { removeReview } = useReviews();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function confirmDelete() {
    setPending(true);
    setError("");
    try {
      await deleteReview(reviewId);
      removeReview(reviewId);
      onDeleted();
    } catch (issue) {
      setError(issue.message);
      setPending(false);
    }
  }

  const buttonClass =
    "px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60";
  return (
    <div className="border-t border-line px-5 py-4 sm:px-8">
      {confirming ? (
        <div role="group" aria-label="Confirm review deletion">
          <p className="text-sm text-muted">
            Delete this review permanently from Stories and your profile?
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={confirmDelete}
              className={`${buttonClass} bg-red-800 text-white hover:bg-red-900`}
            >
              {pending ? "Deleting…" : "Yes, delete review"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setConfirming(false);
                setError("");
              }}
              className={`${buttonClass} border border-line hover:bg-sand`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className={`${buttonClass} border border-red-800/30 text-red-800 hover:bg-red-800 hover:text-white`}
        >
          Delete review
        </button>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
