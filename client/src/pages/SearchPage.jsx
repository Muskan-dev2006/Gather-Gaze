import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchRecipes } from "../api/browse.api.js";
import RecipeCardGrid from "../components/recipe/RecipeCardGrid.jsx";
import RecipeFilterBar from "../components/recipe/RecipeFilterBar.jsx";

const EMPTY_FILTERS = { cuisine: "", diet: "", maxTime: "", difficulty: "" };

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    if (!query) {
      setRecipes([]);
      setIsLoading(false);
      setError("");
      return () => { active = false; };
    }

    setIsLoading(true);
    setError("");
    searchRecipes(query, filters)
      .then((result) => { if (active) setRecipes(result.items || []); })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "We couldn't search recipes. Please try again.");
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [query, filters, retryCount]);

  return (
    <section className="recipes-section" aria-labelledby="search-heading">
      <div className="section-heading recipes-heading">
        <div>
          <p className="eyebrow">Find something delicious</p>
          <h1 id="search-heading">{query ? `Search results for “${query}”` : "Search recipes"}</h1>
          <p>{query ? "Browse recipes that match your search." : "Use the search bar above to find recipes by name, ingredient, or tag."}</p>
        </div>
      </div>
      {query && <>
        <RecipeFilterBar filters={filters} onFiltersChange={setFilters} />
        {error && <div className="recipe-error" role="alert"><span>{error}</span><button type="button" onClick={() => setRetryCount((count) => count + 1)}>Retry</button></div>}
        {!error && <RecipeCardGrid recipes={recipes} isLoading={isLoading} hasMore={false} onLoadMore={() => {}} emptyMessage="No recipes matched that search. Try another dish, ingredient, or tag." />}
      </>}
    </section>
  );
}
