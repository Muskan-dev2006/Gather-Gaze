import { useState } from "react";
import { Link } from "react-router-dom";
import buildImageUrl from "../../utils/buildImageUrl.js";
import formatCookTime from "../../utils/formatCookTime.js";

const RECIPE_IMAGE_WIDTH = 720;

export default function RecipeCard({ recipe }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = buildImageUrl(recipe.coverUrl, RECIPE_IMAGE_WIDTH);
  const hasImage = imageUrl && !imageFailed;
  const averageRating = recipe.ratingCount ? (recipe.ratingSum / recipe.ratingCount).toFixed(1) : null;

  return (
    <article className="recipe-card">
      <div className="recipe-card-photo">
        <Link to={`/recipes/${recipe.slug}`} className="recipe-photo-link" aria-label={`View ${recipe.title}`}>
          {hasImage && <img src={imageUrl} alt={recipe.title} loading="lazy" decoding="async" onError={() => setImageFailed(true)} />}
          {!hasImage && <FoodPhotoPlaceholder />}
        </Link>
        <button className="recipe-like-placeholder" type="button" aria-label={`Like ${recipe.title}`} title="Like controls are being added">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" /></svg>
        </button>
        <span className="recipe-time-pill"><ClockIcon />{formatCookTime(recipe.cookTime)}</span>
      </div>
      <Link to={`/recipes/${recipe.slug}`} className="recipe-card-copy" aria-label={`Open ${recipe.title}`}>
        <span className="recipe-diet-row"><DietMarker diet={recipe.diet} /><span className="recipe-diet-label">{dietLabel(recipe.diet)}</span></span>
        <h3>{recipe.title}</h3>
        <p className="recipe-meta">{recipe.cuisine}<span aria-hidden="true">·</span>{capitalize(recipe.difficulty)}</p>
        <div className="recipe-rating" aria-label={averageRating ? `${averageRating} stars from ${recipe.ratingCount} reviews` : "No reviews yet"}>
          {averageRating ? <><span className="rating-star" aria-hidden="true">★</span><span className="rating-value">{averageRating}</span><span className="review-count">({recipe.ratingCount} {recipe.ratingCount === 1 ? "review" : "reviews"})</span></> : <span className="new-rating">New</span>}
        </div>
      </Link>
    </article>
  );
}

function FoodPhotoPlaceholder() {
  return <span className="recipe-photo-placeholder" aria-hidden="true"><ForkKnifeIcon /></span>;
}

function DietMarker({ diet }) {
  if (diet === "keto") return <span className="keto-marker">K</span>;
  return <span className={`diet-dot ${diet === "non-veg" ? "is-non-veg" : "is-veg"}`} />;
}

function dietLabel(diet) {
  return diet === "non-veg" ? "Non-vegetarian" : diet === "keto" ? "Keto" : diet === "vegan" ? "Vegan" : "Vegetarian";
}

function capitalize(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ClockIcon() {
  return <svg className="clock-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.2" /><path d="M10 5.8v4.5l3 1.8" /></svg>;
}

function ForkKnifeIcon() {
  return <svg viewBox="0 0 32 32" fill="none"><path d="M9 4v8m4-8v8m-2-8v24M22 4c-3 4-4 8-4 12h5v12M23 4v24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
