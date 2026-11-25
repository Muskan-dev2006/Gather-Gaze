import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RecipeCardGrid from "../components/recipe/RecipeCardGrid.jsx";
import RecipeFilterBar from "../components/recipe/RecipeFilterBar.jsx";
import { searchRecipes } from "../api/browse.api.js";

const PAGE_SIZE = 12;
const FILTER_KEYS = ["cuisine", "diet", "maxTime", "difficulty"];
const EMPTY_FILTERS = { cuisine: "", diet: "", maxTime: "", difficulty: "" };
const SEARCH_ERROR = "We couldn't load these results. Please try again.";

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = (searchParams.get("q") || "").trim();
  const isQueryEmpty = query.length === 0;
  const cuisine = searchParams.get("cuisine") || "";
  const diet = searchParams.get("diet") || "";
  const maxTime = searchParams.get("maxTime") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const filters = { cuisine, diet, maxTime, difficulty };
  const [recipes, setRecipes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    document.title = query ? `Results for "${query}"` : "Search recipes";
    const controller = new AbortController();
    if (isQueryEmpty) {
      navigate("/", { replace: true });
      return () => controller.abort();
    }

    setRecipes([]);
    setVisibleCount(PAGE_SIZE);
    setError("");
    setIsLoading(true);
    searchRecipes({ q: query, cuisine, diet, maxTime, difficulty, signal: controller.signal })
      .then(({ items }) => {
        if (!controller.signal.aborted) setRecipes(items);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.response?.data?.message || SEARCH_ERROR);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [query, cuisine, diet, maxTime, difficulty, isQueryEmpty, navigate, retryCount]);

  function updateFilters(nextFilters) {
    const nextParams = new URLSearchParams(searchParams);
    for (const key of FILTER_KEYS) {
      if (nextFilters[key]) nextParams.set(key, nextFilters[key]);
      else nextParams.delete(key);
    }
    setSearchParams(nextParams);
  }

  function clearFilters() {
    updateFilters(EMPTY_FILTERS);
  }

  const hasFilters = FILTER_KEYS.some((key) => Boolean(filters[key]));
  const visibleRecipes = recipes.slice(0, visibleCount);
  const hasMore = visibleCount < recipes.length;

  if (isQueryEmpty) return null;

  return (
    <section className="grid gap-6" aria-labelledby="search-results-heading">
      <header className="grid gap-2">
        <h1 id="search-results-heading" className="font-serif text-3xl font-bold tracking-tight text-[#302820] sm:text-4xl">Results for “{query}”</h1>
        <p className="text-sm text-[#786f64]" aria-live="polite">{isLoading ? "Finding recipes…" : error ? "Search results are unavailable." : `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"} found`}</p>
      </header>
      <RecipeFilterBar filters={filters} onFiltersChange={updateFilters} />
      {error ? <div role="alert" className="recipe-error"><span>{error}</span><button type="button" onClick={() => setRetryCount((count) => count + 1)}>Retry</button></div> : (
        <RecipeCardGrid
          recipes={visibleRecipes}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={() => setVisibleCount((count) => count + PAGE_SIZE)}
          emptyMessage={`No recipes found for “${query}”. Check the spelling, try a simpler word such as an ingredient, or clear the filters.`}
          onClearFilters={clearFilters}
          showClearFilters={hasFilters}
          loadMoreMode="button"
          endMessage="That's all the results."
        />
      )}
    </section>
  );
}
