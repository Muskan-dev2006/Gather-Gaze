import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { saveRecipe, unsaveRecipe } from "../../api/activity.api.js";

export default function SaveButton({ recipeId, isSaved, onChange }) {
  const { user, requireAuth } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function toggleSave() {
    setError("");
    setIsPending(true);
    try {
      const result = isSaved ? await unsaveRecipe(recipeId) : await saveRecipe(recipeId);
      onChange?.(result);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Couldn't update your saved recipes. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  function handleClick() {
    if (!user) {
      requireAuth(() => { void toggleSave(); }, "Sign in to save this recipe.");
      return;
    }
    void toggleSave();
  }

  return (
    <span className="inline-flex flex-col items-start">
      <button type="button" disabled={isPending} aria-pressed={Boolean(isSaved)} onClick={handleClick} className={`rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${isSaved ? "border-[#e3a32c] bg-[#fff7e7] text-[#70501b]" : "border-[#eee6da] text-[#786f64] hover:border-[#e3a32c] hover:text-[#70501b]"}`}>
        {isPending ? "Saving…" : isSaved ? "Saved" : "Save"}
      </button>
      {error && <span role="alert" className="mt-1 max-w-48 text-xs text-[#a53a2d]">{error}</span>}
    </span>
  );
}
