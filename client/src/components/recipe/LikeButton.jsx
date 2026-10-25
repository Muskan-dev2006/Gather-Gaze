import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { addRecipeLike, removeRecipeLike } from "../../api/activity.api.js";

export default function LikeButton({ recipeId, isLiked, likeCount = 0, onChange }) {
  const { user, requireAuth } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function toggleLike() {
    setError("");
    setIsPending(true);
    try {
      const result = isLiked ? await removeRecipeLike(recipeId) : await addRecipeLike(recipeId);
      onChange?.(result);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Couldn't update your like. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  function handleClick() {
    if (!user) {
      requireAuth(() => { void toggleLike(); }, "Sign in to like this recipe.");
      return;
    }
    void toggleLike();
  }

  return (
    <span className="inline-flex flex-col items-start">
      <button type="button" disabled={isPending} aria-pressed={Boolean(isLiked)} onClick={handleClick} className={`rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${isLiked ? "border-[#d94a38] bg-[#fff0eb] text-[#b9382a]" : "border-[#eee6da] text-[#786f64] hover:border-[#d94a38] hover:text-[#b9382a]"}`}>
        {isPending ? "Saving…" : `${isLiked ? "Liked" : "Like"} · ${likeCount}`}
      </button>
      {error && <span role="alert" className="mt-1 max-w-48 text-xs text-[#a53a2d]">{error}</span>}
    </span>
  );
}
