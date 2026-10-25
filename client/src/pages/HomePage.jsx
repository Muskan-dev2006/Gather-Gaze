import { useCallback, useEffect, useRef, useState } from "react";
import RecipeCardGrid from "../components/recipe/RecipeCardGrid.jsx";
import RecipeFilterBar from "../components/recipe/RecipeFilterBar.jsx";
import { getRecipes, searchRecipes } from "../api/browse.api.js";
import useDebounce from "../hooks/useDebounce.js";

const PAGE_SIZE = 12;
const CUISINES = ["Italian", "Indian", "Japanese", "Mexican", "Mediterranean", "Thai", "French", "Korean"];
const DEFAULT_FILTERS = { cuisine: "", diet: "", maxTime: "", difficulty: "" };

export default function HomePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebounce(searchInput.trim());
  const [recipes, setRecipes] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const requestGeneration = useRef(0);

  useEffect(() => {
    const generation = requestGeneration.current + 1;
    requestGeneration.current = generation;
    setRecipes([]);
    setNextCursor(null);
    setError("");
    setIsLoading(true);

    const request = searchQuery
      ? searchRecipes(searchQuery, filters)
      : getRecipes({ filters, limit: PAGE_SIZE });
    request.then((page) => {
      if (requestGeneration.current !== generation) return;
      setRecipes(page.items);
      setNextCursor(page.nextCursor);
    }).catch((requestError) => {
      if (requestGeneration.current === generation) setError(readableError(requestError));
    }).finally(() => {
      if (requestGeneration.current === generation) setIsLoading(false);
    });

    return () => { requestGeneration.current += 1; };
  }, [filters, searchQuery, retryCount]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoading || searchQuery) return;
    const generation = requestGeneration.current;
    setIsLoading(true);
    setError("");
    try {
      const page = await getRecipes({ filters, cursor: nextCursor, limit: PAGE_SIZE });
      if (requestGeneration.current !== generation) return;
      setRecipes((currentRecipes) => [...currentRecipes, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (requestError) {
      if (requestGeneration.current === generation) setError(readableError(requestError));
    } finally {
      if (requestGeneration.current === generation) setIsLoading(false);
    }
  }, [filters, isLoading, nextCursor, searchQuery]);

  function updateCuisine(cuisine) {
    setFilters((currentFilters) => ({ ...currentFilters, cuisine }));
  }

  function retry() {
    if (recipes.length > 0) loadMore();
    else setRetryCount((count) => count + 1);
  }

  return (
    <div className="space-y-9">
      <section className="overflow-hidden rounded-[2rem] bg-[#f6ead7] px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a65b38]">Gather around something good</p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight text-[#302b24] sm:text-5xl lg:text-6xl">
          Find your next <span className="text-[#d94a38]">favorite</span> recipe.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#786f64]">Fresh ideas, family favorites, and dishes worth sharing.</p>
        <form className="mt-8 flex max-w-2xl gap-2 rounded-2xl bg-white p-2 shadow-sm" onSubmit={(event) => { event.preventDefault(); setSearchInput((value) => value.trim()); }}>
          <label className="sr-only" htmlFor="recipe-search">Search recipes</label>
          <input id="recipe-search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search dishes, ingredients, or cuisines" className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm text-[#302b24] outline-none placeholder:text-[#a59a8d]" />
          <button className="rounded-xl bg-[#d94a38] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b9382a]" type="submit">Search</button>
        </form>
      </section>

      <section aria-labelledby="cuisines-heading" className="space-y-4">
        <div>
          <h2 id="cuisines-heading" className="font-serif text-2xl font-bold text-[#302b24]">Browse by cuisine</h2>
          <p className="mt-1 text-sm text-[#786f64]">A little inspiration from around the table.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", ...CUISINES].map((cuisine) => {
            const value = cuisine === "All" ? "" : cuisine;
            const selected = filters.cuisine === value;
            return <button key={cuisine} type="button" aria-pressed={selected} onClick={() => updateCuisine(value)} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${selected ? "bg-[#d94a38] text-white" : "border border-[#eee6da] bg-white text-[#6d5840] hover:border-[#d94a38] hover:text-[#b9382a]"}`}>{cuisine}</button>;
          })}
        </div>
      </section>

      <section aria-labelledby="recipes-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="recipes-heading" className="font-serif text-2xl font-bold text-[#302b24]">Recipes to try</h2>
            <p className="mt-1 text-sm text-[#786f64]">Find something delicious for today.</p>
          </div>
        </div>
        <RecipeFilterBar filters={filters} onFiltersChange={setFilters} />
        {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f1d2c8] bg-[#fff4f0] p-4 text-sm text-[#a53a2d]"><span>{error}</span><button type="button" onClick={retry} className="font-bold underline underline-offset-4">Try again</button></div>}
        <RecipeCardGrid
          recipes={recipes}
          isLoading={isLoading}
          hasMore={Boolean(nextCursor) && !error}
          onLoadMore={loadMore}
          emptyMessage={searchQuery ? "No recipes match that search. Try another dish or adjust the filters." : "No recipes match these filters yet. Try a different cuisine or clear a filter."}
        />
      </section>
    </div>
  );
}

function readableError(error) {
  return error.response?.data?.message || "We couldn't load recipes. Please try again.";
}
