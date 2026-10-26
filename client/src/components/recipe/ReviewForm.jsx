import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { submitReview } from "../../api/activity.api.js";

export default function ReviewForm({ recipeId, currentUserReview, onSubmitted }) {
  const { user, requireAuth } = useAuth();
  const [rating, setRating] = useState(currentUserReview?.rating || 5);
  const [comment, setComment] = useState(currentUserReview?.comment || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setRating(currentUserReview?.rating || 5);
    setComment(currentUserReview?.comment || "");
  }, [currentUserReview]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user) {
      requireAuth(() => {}, "Sign in to leave a review.");
      return;
    }
    setError("");
    setMessage("");
    setIsSaving(true);
    try {
      const review = await submitReview(recipeId, { rating, comment: comment.trim() });
      onSubmitted?.(review);
      setMessage("Your review has been saved.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Couldn't save your review. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) {
    return <section className="rounded-2xl border border-[#eee6da] bg-white p-5"><h3 className="font-serif text-xl font-bold">Leave a review</h3><p className="mt-2 text-sm text-[#786f64]">Sign in to rate and review this recipe.</p><button type="button" className="mt-4 rounded-full border border-[#eee6da] px-4 py-2 text-sm font-bold text-[#a53a2d] hover:bg-[#fff4f0]" onClick={() => requireAuth(() => {}, "Sign in to leave a review.")}>Sign in</button></section>;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#eee6da] bg-white p-5">
      <h3 className="font-serif text-xl font-bold">{currentUserReview ? "Update your review" : "Leave a review"}</h3>
      <label className="mt-4 block text-sm font-semibold text-[#494035]">Your rating
        <select className="mt-2 block w-full rounded-xl border border-[#e9dfd2] bg-white px-3 py-3 text-sm" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
          <option value={5}>5 &#9733; Loved it</option><option value={4}>4 &#9733; Really good</option><option value={3}>3 &#9733; It was good</option><option value={2}>2 &#9733; Not for me</option><option value={1}>1 &#9733; Disappointed</option>
        </select>
      </label>
      <label className="mt-4 block text-sm font-semibold text-[#494035]">Your note <span className="font-normal text-[#968a7d]">(optional)</span>
        <textarea className="mt-2 min-h-28 w-full resize-y rounded-xl border border-[#e9dfd2] px-3 py-3 text-sm outline-none focus:border-[#d94a38]" value={comment} maxLength={1000} onChange={(event) => setComment(event.target.value)} placeholder="How did it turn out?" />
      </label>
      <p className="mt-1 text-right text-xs text-[#968a7d]">{comment.length}/1000</p>
      {error && <p role="alert" className="mt-3 text-sm text-[#a53a2d]">{error}</p>}
      {message && <p role="status" className="mt-3 text-sm text-[#397346]">{message}</p>}
      <button className="mt-4 rounded-full bg-[#d94a38] px-5 py-3 text-sm font-bold text-white hover:bg-[#b9382a] disabled:opacity-60" type="submit" disabled={isSaving}>{isSaving ? "Savingâ€¦" : currentUserReview ? "Update review" : "Post review"}</button>
    </form>
  );
}
