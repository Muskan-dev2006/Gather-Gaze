import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getRecipeBySlug } from "../api/recipes.api.js";

function LikeButtonPlaceholder({ isLiked }) {
  return <button type="button" disabled className="rounded-full border border-[#eee6da] px-4 py-2 text-sm font-semibold text-[#786f64]" aria-label="Like button coming soon">{isLiked ? "Liked" : "Like"}</button>;
}

function SaveButtonPlaceholder({ isSaved }) {
  return <button type="button" disabled className="rounded-full border border-[#eee6da] px-4 py-2 text-sm font-semibold text-[#786f64]" aria-label="Save button coming soon">{isSaved ? "Saved" : "Save"}</button>;
}

function ReviewListPlaceholder() {
  return <p className="mt-3 text-sm text-[#786f64]">Reviews will appear here.</p>;
}

function ReviewFormPlaceholder() {
  return <p className="mt-3 text-sm text-[#786f64]">Review submission will be available soon.</p>;
}

function RecipeLoading() {
  return (
    <section role="status" aria-label="Loading recipe" className="animate-pulse space-y-5">
      <div className="h-72 rounded-lg bg-[#eee6da] md:h-[420px]" />
      <div className="h-9 w-2/3 rounded bg-[#eee6da]" />
      <div className="h-5 w-1/3 rounded bg-[#eee6da]" />
      <div className="grid gap-8 md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.5fr)]">
        <div className="h-64 rounded-lg bg-[#eee6da]" />
        <div className="h-64 rounded-lg bg-[#eee6da]" />
      </div>
    </section>
  );
}

function RecipeMessage({ title, message, children }) {
  return (
    <section className="mx-auto flex min-h-72 max-w-2xl flex-col items-center justify-center text-center">
      <h1 className="font-serif text-3xl font-bold text-[#302b24]">{title}</h1>
      <p className="mt-3 text-[#786f64]">{message}</p>
      {children}
    </section>
  );
}

function formatQuantity(quantity) {
  return Number.isInteger(quantity) ? String(quantity) : String(Number(quantity.toFixed(2)));
}

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isActive = true;
    setStatus("loading");
    getRecipeBySlug(slug)
      .then((data) => {
        if (isActive) {
          setRecipe(data);
          setStatus("ready");
        }
      })
      .catch((error) => {
        if (!isActive) return;
        if (error.response?.status === 404) {
          setStatus("not-found");
          return;
        }
        setErrorMessage(error.response?.data?.message || "We couldn't load this recipe. Check your connection and try again.");
        setStatus("error");
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  async function handleDelete() {
    if (!window.confirm(`Delete “${recipe.title}”? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await deleteRecipe(recipe._id);
      navigate("/my/recipes", { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "We couldn't delete this recipe. Please try again.");
      setStatus("error");
      setIsDeleting(false);
    }
  }

  if (status === "loading") return <RecipeLoading />;
  if (status === "not-found") {
    return <RecipeMessage title="Recipe not found" message="This recipe may have been removed or the link may be incorrect."><Link to="/" className="mt-6 font-semibold text-[#b9382a] underline">Back to home</Link></RecipeMessage>;
  }
  if (status === "error") {
    return <RecipeMessage title="We couldn't load this recipe" message={errorMessage}><button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-full bg-[#d94a38] px-5 py-3 font-semibold text-white">Try again</button></RecipeMessage>;
  }

  const author = recipe.authorId || {};
  const authorName = author.name || "Gather & Gaze member";

  return (
    <article className="mx-auto max-w-5xl text-[#302b24]">
      {errorMessage && <p role="alert" className="mb-5 rounded-md border border-[#d94a38]/30 bg-white px-4 py-3 text-sm text-[#b9382a]">{errorMessage}</p>}
      <div className="relative overflow-hidden rounded-lg bg-[#eee6da]">
        <img src={recipe.coverUrl} alt={recipe.title} loading="eager" fetchPriority="high" className="h-64 w-full object-cover sm:h-80 md:h-[430px]" />
      </div>

      <header className="border-b border-[#eee6da] py-7 md:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b9382a]">{recipe.cuisine} cuisine</p>
            <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">{recipe.title}</h1>
            <div className="mt-4 flex items-center gap-3">
              {author.avatarUrl ? (
                <img src={author.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-[#e3a32c]/25 font-bold text-[#70501b]">{authorName.charAt(0).toUpperCase()}</span>
              )}
              <span className="text-sm text-[#786f64]">By <strong className="text-[#302b24]">{authorName}</strong></span>
            </div>
          </div>
          {recipe.isAuthor && (
            <div className="flex shrink-0 gap-2">
              <Link to={`/recipes/${recipe._id}/edit`} className="rounded-full border border-[#eee6da] px-4 py-2 text-sm font-semibold hover:border-[#d94a38] hover:text-[#b9382a]">Edit</Link>
              <button type="button" disabled={isDeleting} onClick={handleDelete} className="rounded-full border border-[#eee6da] px-4 py-2 text-sm font-semibold text-[#b9382a] hover:border-[#b9382a] disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete"}</button>
            </div>
          )}
        </div>

        {recipe.description && <p className="mt-5 max-w-3xl leading-7 text-[#786f64]">{recipe.description}</p>}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f5efe4] px-3 py-2 text-sm"><strong>{recipe.cookTime}</strong> min</span>
          <span className="rounded-full bg-[#f5efe4] px-3 py-2 text-sm"><strong>{recipe.servings}</strong> servings</span>
          <span className="rounded-full bg-[#f5efe4] px-3 py-2 text-sm capitalize"><strong>{recipe.difficulty}</strong> difficulty</span>
          <span className="rounded-full bg-[#f5efe4] px-3 py-2 text-sm capitalize">{recipe.diet}</span>
        </div>
        <div className="mt-5 flex gap-2">
          <LikeButtonPlaceholder recipeId={recipe._id} isLiked={recipe.isLiked} likeCount={recipe.likeCount} />
          <SaveButtonPlaceholder recipeId={recipe._id} isSaved={recipe.isSaved} />
        </div>
      </header>

      <div className="grid gap-10 py-8 md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.5fr)] md:gap-14 md:py-10">
        <section aria-labelledby="ingredients-heading">
          <h2 id="ingredients-heading" className="font-serif text-2xl font-bold">Ingredients</h2>
          <ul className="mt-5 divide-y divide-[#eee6da]">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`} className="py-3 leading-6">
                <span className="font-semibold">{formatQuantity(ingredient.qty)}{ingredient.unit ? ` ${ingredient.unit}` : ""}</span> {ingredient.name}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="font-serif text-2xl font-bold">Method</h2>
          <ol className="mt-5 space-y-6">
            {[...recipe.steps].sort((first, second) => first.order - second.order).map((step, index) => (
              <li key={`${step.order}-${index}`} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#d94a38] text-sm font-bold text-white">{step.order}</span>
                <p className="pt-1 leading-7 text-[#51493f]">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section aria-labelledby="reviews-heading" className="border-t border-[#eee6da] py-8">
        <h2 id="reviews-heading" className="font-serif text-2xl font-bold">Reviews</h2>
        <ReviewFormPlaceholder recipeId={recipe._id} />
        <ReviewListPlaceholder recipeId={recipe._id} />
      </section>
    </article>
  );
}