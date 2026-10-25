import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteMyRecipe, getMyRecipes } from "../api/me.api.js";

export default function MyRecipesPage({ RecipeCardGrid }) {
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
      const data = await getMyRecipes({ cursor });
      setRecipes((current) => append ? [...current, ...data.recipes] : data.recipes);
      setNextCursor(data.nextCursor);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Couldn't load your recipes. Please try again.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  useEffect(() => {
    loadRecipes(null, false);
  }, []);

  async function handleDelete(recipe) {
    if (!window.confirm(`Delete “${recipe.title}”? This cannot be undone.`)) return;
    try {
      await deleteMyRecipe(recipe._id);
      setRecipes((current) => current.filter((item) => item._id !== recipe._id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Couldn't delete this recipe. Please try again.");
    }
  }

  return (
    <section className="mx-auto max-w-5xl text-[#302b24]">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#eee6da] pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b9382a]">Your kitchen</p>
          <h1 className="mt-2 font-serif text-4xl font-bold">My recipes</h1>
        </div>
        <Link to="/recipes/new" className="rounded-full bg-[#d94a38] px-5 py-3 text-sm font-bold text-white hover:bg-[#b9382a]">Create recipe</Link>
      </header>

      {error && <p role="alert" className="mb-5 rounded-md border border-[#d94a38]/30 bg-white px-4 py-3 text-sm text-[#b9382a]">{error}</p>}
      {isLoading ? <p role="status" className="py-12 text-center text-[#786f64]">Loading your recipes...</p> : recipes.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="font-serif text-2xl font-bold">Your recipe collection starts here</h2>
          <p className="mt-2 text-[#786f64]">Share the first recipe from your kitchen.</p>
          <Link to="/recipes/new" className="mt-5 inline-flex rounded-full bg-[#d94a38] px-5 py-3 text-sm font-bold text-white">Create a recipe</Link>
        </div>
      ) : (
        <>
          {RecipeCardGrid && <RecipeCardGrid
            recipes={recipes}
            isLoading={isLoadingMore}
            hasMore={Boolean(nextCursor)}
            onLoadMore={() => loadRecipes(nextCursor, true)}
            emptyMessage="You haven't published a recipe yet."
          />}
          <ul className="mt-5 divide-y divide-[#eee6da] border-y border-[#eee6da]">
            {recipes.map((recipe) => (
              <li key={recipe._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <Link to={`/recipes/${recipe.slug}`} className="font-semibold hover:text-[#b9382a]">{recipe.title}</Link>
                <span className="flex gap-4 text-sm">
                  <Link className="font-semibold text-[#786f64] hover:text-[#b9382a]" to={`/recipes/${recipe._id}/edit`}>Edit</Link>
                  <button className="font-semibold text-[#b9382a]" type="button" onClick={() => handleDelete(recipe)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}