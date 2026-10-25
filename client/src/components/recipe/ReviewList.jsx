export default function ReviewList({ reviews }) {
  if (!reviews.length) return <section className="rounded-2xl border border-[#eee6da] bg-white p-5"><h3 className="font-serif text-xl font-bold">Community reviews</h3><p className="mt-2 text-sm text-[#786f64]">No reviews yet. Share the first one.</p></section>;

  return (
    <section aria-label="Community reviews">
      <h3 className="mb-4 font-serif text-xl font-bold">Community reviews</h3>
      <ul className="grid gap-3">
        {reviews.map((review) => {
          const reviewer = review.userId || {};
          const name = reviewer.name || "Gather & Gaze member";
          return <li key={review._id} className="rounded-2xl border border-[#eee6da] bg-white p-5">
            <div className="flex items-center gap-3">
              {reviewer.avatarUrl ? <img src={reviewer.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[#e3a32c]/25 text-sm font-bold text-[#70501b]">{name.charAt(0).toUpperCase()}</span>}
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{name}</p><time className="text-xs text-[#968a7d]" dateTime={review.createdAt}>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(review.createdAt))}</time></div>
              <span className="shrink-0 text-sm font-bold text-[#a66c0b]" aria-label={`${review.rating} out of 5 stars`}>{"?".repeat(review.rating)}{"?".repeat(5 - review.rating)}</span>
            </div>
            {review.comment && <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#51493f]">{review.comment}</p>}
          </li>;
        })}
      </ul>
    </section>
  );
}
