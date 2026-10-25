import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMySavedRecipes } from "../api/me.api.js";

export default function SavedRecipesPage({ RecipeCardGrid }) {
  const [recipes, setRecipes] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  async function loadRecipes(cursor, append) {
    setError("");
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);
    try {
      const data = await getMySavedRecipes({ cursor });
      setRecipes((current) => append ? [...current, ...data.recipes] : data.recipes);
      setNextCursor(data.nextCursor);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Couldn't load your saved recipes. Please try again.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  useEffect(() => {
    loadRecipes(null, false);
  }, []);

  return (
    <section className="mx-auto max-w-5xl text-[#302b24]">
      <header className="mb-8 border-b border-[#eee6da] pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b9382a]">Kept for later</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">Saved recipes</h1>
      </header>
      {error && <p role="alert" className="mb-5 rounded-md border border-[#d94a38]/30 bg-white px-4 py-3 text-sm text-[#b9382a]">{error}</p>}
      {isLoading ? <p role="status" className="py-12 text-center text-[#786f64]">Loading saved recipes...</p> : recipes.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="font-serif text-2xl font-bold">No saved recipes yet</h2>
          <p className="mt-2 text-[#786f64]">Save a recipe to find it here later.</p>
          <Link to="/" className="mt-5 inline-flex font-semibold text-[#b9382a] underline">Browse recipes</Link>
        </div>
      ) : (
        <>
          {RecipeCardGrid && <RecipeCardGrid
            recipes={recipes}
            isLoading={isLoadingMore}
            hasMore={Boolean(nextCursor)}
            onLoadMore={() => loadRecipes(nextCursor, true)}
            emptyMessage="You haven't saved a recipe yet."
          />}
        </>
      )}
    </section>
  );
}