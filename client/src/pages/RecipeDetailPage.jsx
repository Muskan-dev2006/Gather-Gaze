import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getRecipeBySlug } from "../api/recipes.api.js";
import LikeButton from "../components/recipe/LikeButton.jsx";
import SaveButton from "../components/recipe/SaveButton.jsx";
import AddToCollectionButton from "../components/recipe/AddToCollectionButton.jsx";
import FollowAuthorButton from "../components/recipe/FollowAuthorButton.jsx";
import buildImageUrl from "../utils/buildImageUrl.js";
import RecipeReviews from "../components/recipe/RecipeReviews.jsx";
import { useAuth } from "../context/AuthContext.jsx";

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

async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Try the browser's selection-based copy path below.
  }

  try {
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    return copied;
  } catch {
    return false;
  }
}

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const [showManualShareLink, setShowManualShareLink] = useState(false);

  useEffect(() => {
    let isActive = true;
    setStatus("loading");
    setErrorMessage("");
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
  }, [slug, retryCount, user?._id, user?.id]);

  async function handleDelete() {
    if (!window.confirm(`Delete "${recipe.title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await deleteRecipe(recipe._id);
      navigate("/my/recipes", { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "We couldn't delete this recipe. Please try again.");
      setIsDeleting(false);
    }
  }

  async function shareRecipe() {
    const shareData = { title: recipe.title, text: `Try this recipe: ${recipe.title}`, url: window.location.href };
    setShareMessage("");
    setShowManualShareLink(false);
    try {
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          setShareMessage("Recipe shared.");
          return;
        } catch (error) {
          if (error.name === "AbortError") return;
        }
      }
      if (await copyTextToClipboard(shareData.url)) setShareMessage("Recipe link copied.");
      else {
        setShareMessage("Copy this recipe link:");
        setShowManualShareLink(true);
      }
    } catch (error) {
      setShareMessage("Copy this recipe link:");
      setShowManualShareLink(true);
    }
  }

  if (status === "loading") return <RecipeLoading />;
  if (status === "not-found") {
    return <RecipeMessage title="Recipe not found" message="This recipe may have been removed or the link may be incorrect."><Link to="/" className="mt-6 font-semibold text-[#b9382a] underline">Back to home</Link></RecipeMessage>;
  }
  if (status === "error") {
    return <RecipeMessage title="We couldn't load this recipe" message={errorMessage}><button type="button" onClick={() => setRetryCount((count) => count + 1)} className="mt-6 rounded-full bg-[#d94a38] px-5 py-3 font-semibold text-white">Try again</button></RecipeMessage>;
  }

  const author = recipe.authorId || {};
  const authorName = author.name || "Gather & Gaze member";
  const recipeUrl = window.location.href;
  const shareText = `Try this recipe: ${recipe.title}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${recipeUrl}`)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(recipeUrl)}&text=${encodeURIComponent(shareText)}`;

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
              <FollowAuthorButton authorId={author._id} />
            </div>
          </div>
          {recipe.isAuthor && (
            <div className="flex shrink-0 gap-2">
              <Link to={`/recipes/${recipe.slug}/edit`} className="rounded-full border border-[#eee6da] px-4 py-2 text-sm font-semibold hover:border-[#d94a38] hover:text-[#b9382a]">Edit</Link>
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
          <LikeButton recipeId={recipe._id} isLiked={recipe.isLiked} likeCount={recipe.likeCount} onChange={(result) => setRecipe((current) => ({ ...current, ...result }))} />
          <SaveButton recipeId={recipe._id} isSaved={recipe.isSaved} onChange={(result) => setRecipe((current) => ({ ...current, ...result }))} />
          <button type="button" onClick={shareRecipe} className="rounded-full border border-[#eee6da] px-4 py-2 text-sm font-semibold text-[#786f64] hover:border-[#d94a38] hover:text-[#b9382a]">Share</button>
          <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" aria-label={`Share ${recipe.title} on WhatsApp`} title="Share on WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-[#eee6da] text-[#128C7E] hover:border-[#25D366] hover:bg-[#25D366]/10">
            <svg aria-hidden="true" viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor"><path d="M16.04 3C8.87 3 3.04 8.78 3.04 15.9c0 2.27.6 4.49 1.74 6.45L3 29l6.84-1.78a13.1 13.1 0 0 0 6.2 1.57h.01c7.16 0 13-5.79 13-12.9A12.8 12.8 0 0 0 25.2 6.7 13.02 13.02 0 0 0 16.04 3Zm0 23.6h-.01c-1.9 0-3.76-.5-5.38-1.45l-.39-.23-4.06 1.06 1.08-3.93-.25-.4a10.6 10.6 0 0 1-1.64-5.7c0-5.87 4.78-10.64 10.66-10.64 2.85 0 5.53 1.11 7.55 3.13a10.55 10.55 0 0 1 3.12 7.53c0 5.87-4.78 10.63-10.68 10.63Zm5.85-7.96c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.5-.16-.72.16-.21.32-.82 1.05-1 1.27-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.57-.95-.84-1.6-1.88-1.79-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.72-.99-2.36-.26-.61-.52-.52-.72-.53h-.61c-.22 0-.56.08-.85.4-.3.32-1.11 1.08-1.11 2.63 0 1.56 1.14 3.06 1.3 3.27.16.21 2.24 3.4 5.43 4.78.76.33 1.35.53 1.81.68.76.24 1.45.21 2 .13.61-.1 1.9-.77 2.16-1.51.27-.74.27-1.37.19-1.5-.08-.14-.29-.22-.61-.38Z"/></svg>
            <span className="sr-only">WhatsApp</span>
          </a>
          <a href={telegramShareUrl} target="_blank" rel="noopener noreferrer" aria-label={`Share ${recipe.title} on Telegram`} title="Share on Telegram" className="grid h-10 w-10 place-items-center rounded-full border border-[#eee6da] text-[#168AC4] hover:border-[#229ED9] hover:bg-[#229ED9]/10">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M21.94 4.66 18.8 19.47c-.24 1.05-.86 1.3-1.74.8l-4.82-3.55-2.33 2.24c-.26.26-.48.48-.98.48l.35-4.9 8.92-8.06c.39-.35-.08-.55-.6-.2L6.58 13.3l-4.7-1.47c-1.02-.32-1.04-1.02.22-1.52L20.5 3.15c.86-.32 1.61.21 1.44 1.51Z"/></svg>
            <span className="sr-only">Telegram</span>
          </a>
        </div>
        {shareMessage && <p role="status" className="mt-2 text-sm text-[#397346]">{shareMessage}</p>}
        {showManualShareLink && <label className="mt-2 block text-sm font-semibold text-[#786f64]">Recipe link
          <input className="mt-1 w-full rounded-xl border border-[#e9dfd2] bg-white px-3 py-2 text-sm font-normal" readOnly value={window.location.href} onFocus={(event) => event.target.select()} />
        </label>}
        <AddToCollectionButton recipeId={recipe._id} />
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
              <li key={`${step.order}-${index}`} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 gap-y-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#d94a38] text-sm font-bold text-white">{step.order}</span>
                <div><p className="pt-1 leading-7 text-[#51493f]">{step.text}</p>
                  {step.imageUrl && <img src={buildImageUrl(step.imageUrl, 960)} alt={`Photo for step ${step.order}`} loading="lazy" className="mt-3 max-h-96 w-full rounded-xl object-cover" />}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section aria-labelledby="reviews-heading" className="border-t border-[#eee6da] py-8">
        <h2 id="reviews-heading" className="font-serif text-2xl font-bold">Reviews</h2>
        <RecipeReviews recipeId={recipe._id} />
      </section>
    </article>
  );
}
