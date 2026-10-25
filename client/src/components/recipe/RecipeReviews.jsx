import { useEffect, useState } from "react";
import { getReviews } from "../../api/activity.api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import ReviewForm from "./ReviewForm.jsx";
import ReviewList from "./ReviewList.jsx";

export default function RecipeReviews({ recipeId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [currentUserReview, setCurrentUserReview] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;
    setStatus("loading");
    setError("");
    getReviews(recipeId)
      .then((data) => {
        if (!isActive) return;
        setReviews(data.reviews);
        setCurrentUserReview(data.currentUserReview);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (!isActive) return;
        setError(requestError.response?.data?.message || "Couldn't load reviews. Please try again.");
        setStatus("error");
      });
    return () => { isActive = false; };
  }, [recipeId, reloadKey, user?._id, user?.id]);

  function handleReviewSaved(review) {
    setCurrentUserReview(review);
    setReviews((current) => {
      const exists = current.some(({ _id }) => _id === review._id);
      return exists ? current.map((item) => item._id === review._id ? review : item) : [review, ...current];
    });
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
      <ReviewForm recipeId={recipeId} currentUserReview={currentUserReview} onSubmitted={handleReviewSaved} />
      <div>
        {status === "loading" && <p role="status" className="text-sm text-[#786f64]">Loading reviews…</p>}
        {status === "error" && <div className="rounded-xl border border-[#f1d2c8] bg-[#fff4f0] p-4 text-sm text-[#a53a2d]" role="alert">{error}<button className="ml-2 font-bold underline" type="button" onClick={() => setReloadKey((key) => key + 1)}>Retry</button></div>}
        {status === "ready" && <ReviewList reviews={reviews} />}
      </div>
    </div>
  );
}



