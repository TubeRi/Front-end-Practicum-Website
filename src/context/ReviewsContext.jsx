import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/integrations";
const ReviewsContext = createContext(null);
export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  async function reload() {
    setLoading(true);
    try {
      const result = await api("/reviews");
      setReviews(result.reviews);
      setError("");
    } catch (issue) {
      setError(issue.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    reload();
  }, []);
  function addReview(review) {
    setReviews((current) => [
      ...current.filter((item) => item.id === "editorial-0"),
      review,
      ...current.filter(
        (item) => item.id !== "editorial-0" && item.id !== review.id,
      ),
    ]);
  }
  function removeReview(id) {
    setReviews((current) => current.filter((review) => review.id !== id));
  }
  return (
    <ReviewsContext.Provider
      value={{ reviews, error, loading, reload, addReview, removeReview }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}
export const useReviews = () => useContext(ReviewsContext);
