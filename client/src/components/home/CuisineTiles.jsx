import { useEffect, useMemo, useState } from "react";
import { getRecipes } from "../../api/browse.api.js";
import { CUISINE_IMAGES } from "../../config/homeImages.js";
import buildImageUrl from "../../utils/buildImageUrl.js";

const CUISINE_RECIPE_LIMIT = 50;
const CUISINE_TILE_SIZE = 72;
const CUISINE_IMAGE_WIDTH = CUISINE_TILE_SIZE * 2;
const COLLAGE_COUNT = 4;
const SQUARE_ASPECT_RATIO = "1:1";
const CUISINES = Object.keys(CUISINE_IMAGES);
let cuisineRecipesRequest;

export default function CuisineTiles({ selectedCuisine, onCuisineChange }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const cuisineCovers = useMemo(() => buildCuisineCoverMap(recipes), [recipes]);
  const allRecipeCovers = useMemo(() => buildAllRecipeCovers(recipes), [recipes]);

  useEffect(() => {
    let isCurrent = true;
    loadCuisineRecipes()
      .then(({ items }) => {
        if (isCurrent) setRecipes(items);
      })
      .catch(() => {
        if (isCurrent) setRecipes([]);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <div className="cuisine-scroller" aria-label="Choose a cuisine" style={{ "--cuisine-tile-size": `${CUISINE_TILE_SIZE}px` }}>
      <CuisineTile
        name="All"
        selected={!selectedCuisine}
        isLoading={isLoading}
        collageUrls={allRecipeCovers}
        onClick={() => onCuisineChange("")}
      />
      {CUISINES.map((cuisine) => (
        <CuisineTile
          key={cuisine}
          name={cuisine}
          selected={selectedCuisine === cuisine}
          isLoading={isLoading}
          imageUrl={CUISINE_IMAGES[cuisine] || cuisineCovers.get(cuisine) || ""}
          onClick={() => onCuisineChange(cuisine)}
        />
      ))}
    </div>
  );
}

function loadCuisineRecipes() {
  if (!cuisineRecipesRequest) cuisineRecipesRequest = getRecipes({ limit: CUISINE_RECIPE_LIMIT });
  return cuisineRecipesRequest;
}

function CuisineTile({ name, selected, isLoading, imageUrl = "", collageUrls = [], onClick }) {
  const hasCollage = name === "All" && collageUrls.length === COLLAGE_COUNT;
  const tileClass = `cuisine-tile${selected ? " is-selected" : ""}${isLoading ? " is-loading" : ""}`;

  return (
    <button className={tileClass} type="button" aria-label={name === "All" ? "Show all recipes" : `Show ${name} recipes`} aria-pressed={selected} onClick={onClick}>
      <span className="cuisine-image-wrap">
        {isLoading ? <span className="cuisine-image-skeleton" aria-hidden="true" /> : hasCollage ? (
          <span className="cuisine-collage" aria-hidden="true">
            {collageUrls.map((coverUrl) => <CuisinePhoto key={coverUrl} coverUrl={coverUrl} />)}
          </span>
        ) : <CuisinePhoto coverUrl={name === "All" ? collageUrls[0] || "" : imageUrl} />}
      </span>
      <span className="cuisine-name">{name}</span>
    </button>
  );
}

function CuisinePhoto({ coverUrl }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = coverUrl && !imageFailed
    ? buildImageUrl(coverUrl, CUISINE_IMAGE_WIDTH, { aspectRatio: SQUARE_ASPECT_RATIO })
    : "";

  return imageUrl ? (
    <img className="cuisine-cover-photo" src={imageUrl} alt="" loading="lazy" onError={() => setImageFailed(true)} />
  ) : <span className="cuisine-photo-tint" aria-hidden="true" />;
}

function buildCuisineCoverMap(recipes) {
  const coversByCuisine = new Map();
  for (const recipe of recipes) {
    if (recipe.cuisine && recipe.coverUrl && !coversByCuisine.has(recipe.cuisine)) {
      coversByCuisine.set(recipe.cuisine, recipe.coverUrl);
    }
  }
  return coversByCuisine;
}

function buildAllRecipeCovers(recipes) {
  const covers = [];
  const seenCovers = new Set();
  for (const recipe of recipes) {
    if (recipe.coverUrl && !seenCovers.has(recipe.coverUrl)) {
      covers.push(recipe.coverUrl);
      seenCovers.add(recipe.coverUrl);
    }
    if (covers.length === COLLAGE_COUNT) break;
  }
  return covers;
}
