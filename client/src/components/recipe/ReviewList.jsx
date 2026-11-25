import { useState } from "react";
import { toggleReviewHelpful } from "../../api/activity.api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import buildImageUrl from "../../utils/buildImageUrl.js";

export default function ReviewList({ reviews, onHelpfulChanged }) {
  const { user, requireAuth } = useAuth();
  const [pendingId, setPendingId] = useState("");
  const [error, setError] = useState("");
  if (!reviews.length) return <section className="rounded-2xl border border-[#eee6da] bg-white p-5"><h3 className="font-serif text-xl font-bold">Community reviews</h3><p className="mt-2 text-sm text-[#786f64]">No reviews yet. Share the first one.</p></section>;

  async function vote(review) {
    if (!user) return requireAuth(() => {}, "Sign in to mark reviews helpful.");
    setPendingId(review._id);
    setError("");
    try {
      onHelpfulChanged(review._id, await toggleReviewHelpful(review._id));
    } catch (voteError) {
      setError(voteError.response?.data?.message || "Couldn't update your helpful vote.");
    } finally {
      setPendingId("");
    }
  }

  return (
    <section aria-label="Community reviews">
      <h3 className="mb-4 font-serif text-xl font-bold">Community reviews</h3>
      {error && <p role="alert" className="mb-3 text-sm text-[#a53a2d]">{error}</p>}
      <ul className="grid gap-3">
        {reviews.map((review) => {
          const reviewer = review.userId || {};
          const name = reviewer.name || "Gather & Gaze member";
          return <li key={review._id} className="rounded-2xl border border-[#eee6da] bg-white p-5">
            <div className="flex items-center gap-3">
              {reviewer.avatarUrl ? <img src={reviewer.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[#e3a32c]/25 text-sm font-bold text-[#70501b]">{name.charAt(0).toUpperCase()}</span>}
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{name}</p><time className="text-xs text-[#968a7d]" dateTime={review.createdAt}>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(review.createdAt))}</time></div>
              <span className="shrink-0 text-sm font-bold text-[#a66c0b]" aria-label={`${review.rating} out of 5 stars`}>{String.fromCharCode(9733).repeat(review.rating)}{String.fromCharCode(9734).repeat(5 - review.rating)}</span>
            </div>
            {review.comment && <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#51493f]">{review.comment}</p>}
            {review.photos?.length > 0 && <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{review.photos.map((url, index) => <img key={url} className="aspect-square w-full rounded-lg object-cover" src={buildImageUrl(url, 320, { aspectRatio: "1:1" })} alt={`${name}'s review photo ${index + 1}`} loading="lazy" />)}</div>}
            <button type="button" disabled={pendingId === review._id || review.userId?._id === user?._id || review.userId?._id === user?.id} aria-pressed={Boolean(review.hasVotedHelpful)} onClick={() => vote(review)} className="mt-4 rounded-full border border-[#eee6da] px-3 py-2 text-xs font-semibold text-[#786f64] hover:border-[#d94a38] hover:text-[#b9382a] disabled:opacity-50">{review.hasVotedHelpful ? "Helpful ✓" : "Helpful"} · {review.helpfulCount || 0}</button>
          </li>;
        })}
      </ul>
    </section>
  );
}
