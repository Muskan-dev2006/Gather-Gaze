import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../../api/browse.api.js";
import { HERO_IMAGE_URL } from "../../config/homeImages.js";
import useAutoAdvance from "../../hooks/useAutoAdvance.js";
import buildImageUrl from "../../utils/buildImageUrl.js";
import formatCookTime from "../../utils/formatCookTime.js";

const HERO_RECIPE_LIMIT = 6;
const AUTOPLAY_DELAY_MS = 5000;
const CROSSFADE_DURATION_MS = 700;
const ACTIVE_IMAGE_SCALE = 1.025;
const HERO_IMAGE_WIDTH = 1280;
const SWIPE_THRESHOLD_PX = 44;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function readReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.(REDUCED_MOTION_QUERY).matches === true;
}

export default function HeroSlider() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(() => typeof document !== "undefined" && document.hidden);
  const [reducedMotion, setReducedMotion] = useState(readReducedMotion);
  const touchStartX = useRef(null);

  useEffect(() => {
    let isCurrent = true;
    getRecipes({ limit: HERO_RECIPE_LIMIT }).then((page) => {
      if (isCurrent) setRecipes(Array.isArray(page.items) ? page.items.slice(0, HERO_RECIPE_LIMIT) : []);
    }).catch(() => {
      if (isCurrent) setRecipes([]);
    }).finally(() => {
      if (isCurrent) setIsLoading(false);
    });
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    function updateTabVisibility() {
      setTabHidden(document.hidden);
    }
    document.addEventListener("visibilitychange", updateTabVisibility);
    return () => document.removeEventListener("visibilitychange", updateTabVisibility);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(REDUCED_MOTION_QUERY);
    if (!mediaQuery) return undefined;
    function updateMotionPreference(event) {
      setReducedMotion(event.matches);
    }
    setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  const slides = recipes.length >= 2 ? recipes : [recipes[0] || null];
  const isPaused = pointerPaused || focusPaused || tabHidden || reducedMotion;
  const [currentIndex, setCurrentIndex] = useAutoAdvance(slides.length, AUTOPLAY_DELAY_MS, isPaused);

  function moveSlide(direction) {
    setCurrentIndex((index) => (index + direction + slides.length) % slides.length);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveSlide(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveSlide(1);
    }
  }

  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
  }

  function handleTouchStart(event) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (distance > SWIPE_THRESHOLD_PX) moveSlide(-1);
    if (distance < -SWIPE_THRESHOLD_PX) moveSlide(1);
    touchStartX.current = null;
  }

  if (isLoading) return <div className="hero-slider-skeleton" role="status" aria-label="Loading featured recipes" />;

  return (
    <div
      className={`hero-slider${reducedMotion ? " is-reduced-motion" : ""}`}
      style={{ "--hero-crossfade-duration": `${CROSSFADE_DURATION_MS}ms`, "--hero-active-scale": ACTIVE_IMAGE_SCALE }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured recipes"
      tabIndex={0}
      onPointerEnter={() => setPointerPaused(true)}
      onPointerLeave={() => setPointerPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={handleBlur}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((recipe, index) => <RecipeSlide key={recipe?._id || "featured-fallback"} recipe={recipe} index={index} total={slides.length} active={index === currentIndex} />)}
      {slides.length > 1 && <SliderControls count={slides.length} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} onMove={moveSlide} />}
    </div>
  );
}

function RecipeSlide({ recipe, index, total, active }) {
  const sourceUrl = recipe?.coverUrl || HERO_IMAGE_URL;
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = sourceUrl && !imageFailed ? buildWideImageUrl(sourceUrl) : "";
  const slideContent = (
    <>
      {imageUrl && <img src={imageUrl} alt={recipe?.title || "Featured recipe"} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} onError={() => setImageFailed(true)} />}
      <span className="hero-slide-wash" aria-hidden="true" />
      {recipe && <RecipeSlideCard recipe={recipe} />}
    </>
  );

  return recipe ? (
    <Link className={`hero-slide${active ? " is-active" : ""}`} to={`/recipe/${recipe.slug}`} aria-roledescription="slide" aria-label={`${index + 1} of ${total}`} aria-hidden={!active} tabIndex={active ? 0 : -1}>
      {slideContent}
    </Link>
  ) : <div className="hero-slide is-active" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${total}`} aria-hidden="false">{slideContent}</div>;
}

function RecipeSlideCard({ recipe }) {
  const rating = recipe.ratingCount ? (recipe.ratingSum / recipe.ratingCount).toFixed(1) : "New";
  return (
    <span className="hero-recipe-card">
      <strong>{recipe.title}</strong>
      <span className="hero-recipe-meta">{recipe.cuisine}<span aria-hidden="true">·</span>{formatCookTime(recipe.cookTime)}</span>
      <span className="hero-recipe-rating">{recipe.ratingCount ? <span className="hero-rating-star" aria-hidden="true">★</span> : null}{rating}{recipe.ratingCount ? ` (${recipe.ratingCount})` : ""}</span>
      <span className="hero-view-recipe">View recipe <span aria-hidden="true">→</span></span>
    </span>
  );
}

function SliderControls({ count, currentIndex, setCurrentIndex, onMove }) {
  return (
    <div className="hero-slider-controls" aria-label="Carousel controls">
      <button className="hero-slider-arrow previous" type="button" aria-label="Previous recipe" onClick={() => onMove(-1)}><ArrowIcon direction="left" /></button>
      <button className="hero-slider-arrow next" type="button" aria-label="Next recipe" onClick={() => onMove(1)}><ArrowIcon direction="right" /></button>
      <div className="hero-slider-dots" aria-label="Choose featured recipe">
        {Array.from({ length: count }, (_, index) => <button key={index} type="button" aria-label={`Show recipe ${index + 1}`} aria-current={index === currentIndex ? "true" : undefined} onClick={() => setCurrentIndex(index)} />)}
      </div>
    </div>
  );
}

function ArrowIcon({ direction }) {
  const path = direction === "left" ? "m14.5 5-7 7 7 7" : "m9.5 5 7 7-7 7";
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={path} /></svg>;
}

function buildWideImageUrl(sourceUrl) {
  return buildImageUrl(sourceUrl, HERO_IMAGE_WIDTH).replace("ar_4:3", "ar_16:10");
}
