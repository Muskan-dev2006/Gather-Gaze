import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCardGrid from "../components/recipe/RecipeCardGrid.jsx";
import RecipeFilterBar from "../components/recipe/RecipeFilterBar.jsx";
import HeroSlider from "../components/home/HeroSlider.jsx";
import CuisineTiles from "../components/home/CuisineTiles.jsx";
import PageFooter from "../components/layout/PageFooter.jsx";
import { getRecipes } from "../api/browse.api.js";
import { useAuth } from "../context/AuthContext.jsx";

const PAGE_SIZE = 12;
const DEFAULT_FILTERS = { cuisine: "", diet: "", maxTime: "", difficulty: "" };
const RECIPES_SECTION_ID = "recipes-grid";
const BROWSE_BUTTON_LABEL = "Browse recipes";
const SHARE_BUTTON_LABEL = "Share your recipe";
const SHARE_RECIPE_MESSAGE = "Sign in to share your recipe";

export default function HomePage() {
  const { requireAuth } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [recipes, setRecipes] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const requestGeneration = useRef(0);

  useEffect(() => {
    const generation = ++requestGeneration.current;
    setRecipes([]);
    setNextCursor(null);
    setError("");
    setIsLoading(true);
    const request = getRecipes({ filters, limit: PAGE_SIZE });
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
  }, [filters, retryCount]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoading) return;
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
  }, [filters, isLoading, nextCursor]);

  function updateCuisine(cuisine) {
    setFilters((currentFilters) => ({ ...currentFilters, cuisine }));
  }

  function retry() {
    if (recipes.length > 0) loadMore();
    else setRetryCount((count) => count + 1);
  }

  function browseRecipes() {
    document.getElementById(RECIPES_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function shareRecipe() {
    requireAuth(() => navigate("/create"), SHARE_RECIPE_MESSAGE);
  }

  return (
    <>
      <div className="home-content">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero-layout">
            <HeroSlider />
            <div className="home-hero-copy">
              <p className="eyebrow">Gather around something good</p>
              <h1 id="home-title">Find your next <span>favorite</span> recipe.</h1>
              <p className="home-hero-subtitle">Fresh ideas, family favorites, and dishes worth sharing.</p>
              <div className="home-hero-actions">
                <button className="hero-button-primary" type="button" onClick={browseRecipes}>{BROWSE_BUTTON_LABEL}</button>
                <button className="hero-button-secondary" type="button" onClick={shareRecipe}>{SHARE_BUTTON_LABEL}</button>
              </div>
            </div>
          </div>
        </section>

        <section className="cuisine-section" aria-labelledby="cuisines-heading">
          <div className="section-heading">
            <div><h2 id="cuisines-heading">Browse by cuisine</h2><p>A little inspiration from around the table.</p></div>
          </div>
          <CuisineTiles selectedCuisine={filters.cuisine} onCuisineChange={updateCuisine} />
        </section>

        <section id={RECIPES_SECTION_ID} className="recipes-section" aria-labelledby="recipes-heading">
          <div className="section-heading recipes-heading">
            <div><h2 id="recipes-heading">Recipes to try</h2><p>Find something delicious for today.</p></div>
          </div>
          <RecipeFilterBar filters={filters} onFiltersChange={setFilters} />
          {error && <div role="alert" className="recipe-error"><span>{error}</span><button type="button" onClick={retry}>Retry</button></div>}
          <RecipeCardGrid recipes={recipes} isLoading={isLoading} hasMore={Boolean(nextCursor) && !error} onLoadMore={loadMore} emptyMessage="No recipes match these filters yet. Try a different combination." onClearFilters={() => setFilters(DEFAULT_FILTERS)} />
        </section>
      </div>
      <PageFooter />
    </>
  );
}

function readableError(error) {
  return error.response?.data?.message || "We couldn't load recipes. Please try again.";
}
