import { useAccount } from "../context/AccountContext";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { requestTestimonial } from "../services/integrations";
import { createReview, formatReviewDate } from "../services/reviews";

const fieldClass =
  "mt-2 block w-full min-w-0 border border-line bg-white px-4 py-3 text-sm text-ink focus:border-moss focus:outline-2 focus:outline-moss";

export default function ReviewSection({ onReviewAdded }) {
  const { user } = useAuth();
  // Do not render a heading, form, or login prompt for guests.
  if (!user?.id) return null;
  return <ReviewForm key={user.id} user={user} onReviewAdded={onReviewAdded} />;
}

function ReviewForm({ user, onReviewAdded }) {
  const { profile, refreshAccount } = useAccount();
  const [name, setName] = useState(profile.name || user.name || "");
  const [rating, setRating] = useState("5");
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setStatus("");
    let entry;
    try {
      entry = createReview({ name, rating, review }, user);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    setPending(true);
    try {
      const result = await requestTestimonial(entry, user);
      onReviewAdded(result.review);
      refreshAccount().catch(() => {});
      setStatus("Your review has been added to Stories.");
      setReview("");
    } catch {
      setError("Unable to submit your review. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      id="write-review"
      aria-labelledby="write-review-title"
      className="scroll-mt-24 border-t border-line bg-sand/50 px-5 py-16 sm:px-6 sm:py-20 lg:px-10"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="write-review-title"
          className="font-display text-4xl leading-tight tracking-tight sm:text-5xl"
        >
          Share your experience.
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          Tell fellow travelers what made your journey memorable.
        </p>
        <p className="mt-3 text-sm text-muted">
          Your review is saved to Stories and your personal profile. Your name,
          rating, review, and posting date will be public.
        </p>

        <form
          onSubmit={submit}
          className="mt-8 space-y-6 border border-line bg-canvas p-5 sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-[1fr_10rem]">
            <label
              className="block min-w-0 text-sm font-bold"
              htmlFor="review-name"
            >
              Your name
              <input
                id="review-name"
                name="name"
                required
                maxLength={80}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClass}
              />
            </label>
            <label
              className="block min-w-0 text-sm font-bold"
              htmlFor="review-rating"
            >
              Rating out of 5
              <select
                id="review-rating"
                name="rating"
                required
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                className={fieldClass}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} / 5
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm font-bold" htmlFor="review-text">
            Your review
            <textarea
              id="review-text"
              name="review"
              required
              minLength={20}
              maxLength={1500}
              rows={6}
              value={review}
              onChange={(event) => setReview(event.target.value)}
              aria-describedby="review-length"
              className={`${fieldClass} resize-y`}
              placeholder="What would you like other travelers to know?"
            />
          </label>
          <p id="review-length" className="text-xs text-muted">
            {review.length} / 1,500 characters. Minimum 20 characters.
          </p>
          <p className="text-sm text-muted">
            Written on{" "}
            <time dateTime={new Date().toISOString()}>
              {formatReviewDate(new Date())}
            </time>
          </p>
          {error && (
            <p role="alert" className="text-sm text-red-800">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-ink px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-moss disabled:cursor-wait disabled:opacity-60 sm:w-auto"
          >
            {pending ? "Adding…" : "Add review"}
          </button>
          <p role="status" className="text-sm text-muted">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}
