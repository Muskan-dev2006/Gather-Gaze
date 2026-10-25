import { Link } from "react-router-dom";
import buildImageUrl from "../../utils/buildImageUrl.js";
import formatCookTime from "../../utils/formatCookTime.js";

const RECIPE_IMAGE_WIDTH = 720;

export default function RecipeCard({ recipe }) {
  const imageUrl = buildImageUrl(recipe.coverUrl, RECIPE_IMAGE_WIDTH);

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#eee6da] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/recipes/${recipe.slug}`} className="block" aria-label={`View ${recipe.title}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f1e9dd]">
          <img
            src={imageUrl}
            alt={recipe.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-[#574d40] shadow-sm">
            {recipe.cuisine}
          </span>
        </div>
        <div className="p-5">
          <h2 className="line-clamp-2 min-h-14 font-serif text-xl font-bold leading-snug text-[#302b24]">{recipe.title}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#fff5e5] px-3 py-1.5 text-xs font-semibold text-[#806124]">{formatCookTime(recipe.cookTime)}</span>
            <span className="rounded-full bg-[#faece8] px-3 py-1.5 text-xs font-semibold capitalize text-[#a53a2d]">{recipe.difficulty}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#f1ece4] pt-4 text-sm text-[#786f64]">
            <span>{recipe.ratingCount ? `★ ${(recipe.ratingSum / recipe.ratingCount).toFixed(1)} (${recipe.ratingCount})` : "New recipe"}</span>
            <span aria-label={`${recipe.likeCount} likes`}>♥ {recipe.likeCount}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
