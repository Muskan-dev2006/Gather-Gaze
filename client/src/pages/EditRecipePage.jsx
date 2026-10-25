import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRecipeBySlug, updateRecipe } from "../api/recipes.api.js";
import RecipeEditorForm from "../components/recipe/RecipeEditorForm.jsx";

export default function EditRecipePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    setStatus("loading");
    getRecipeBySlug(slug)
      .then((loadedRecipe) => {
        if (!isCurrent) return;
        if (!loadedRecipe.isAuthor) {
          setStatus("forbidden");
          return;
        }
        setRecipe(loadedRecipe);
        setStatus("ready");
      })
      .catch((loadError) => {
        if (!isCurrent) return;
        setError(loadError.response?.data?.message || "Couldn't load this recipe.");
        setStatus(loadError.response?.status === 404 ? "not-found" : "error");
      });
    return () => { isCurrent = false; };
  }, [slug]);

  async function handleUpdate(payload) {
    const updatedRecipe = await updateRecipe(recipe._id, payload);
    navigate(`/recipes/${updatedRecipe.slug}`, { replace: true });
  }

  if (status === "loading") return <p role="status" className="py-16 text-center text-[#786f64]">Loading recipe…</p>;
  if (status === "forbidden") return <section className="mx-auto max-w-2xl py-16 text-center"><h1 className="font-serif text-3xl font-bold">This recipe isn’t yours to edit</h1><p className="mt-3 text-[#786f64]">Only the recipe author can make changes.</p><Link className="mt-6 inline-block font-semibold text-[#b9382a]" to={`/recipes/${slug}`}>Back to recipe</Link></section>;
  if (status !== "ready") return <section className="mx-auto max-w-2xl py-16 text-center"><h1 className="font-serif text-3xl font-bold">{status === "not-found" ? "Recipe not found" : "Couldn’t load recipe"}</h1><p role="alert" className="mt-3 text-[#786f64]">{error}</p><Link className="mt-6 inline-block font-semibold text-[#b9382a]" to="/my/recipes">Back to my recipes</Link></section>;

  return <RecipeEditorForm key={recipe._id} recipe={recipe} onSubmit={handleUpdate} submitLabel="Save changes" />;
}
