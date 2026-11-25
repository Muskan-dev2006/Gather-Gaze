import { useNavigate } from "react-router-dom";
import { createRecipe } from "../api/recipes.api.js";
import RecipeEditorForm from "../components/recipe/RecipeEditorForm.jsx";

export default function CreateRecipePage() {
  const navigate = useNavigate();

  async function handleCreate(payload) {
    const recipe = await createRecipe(payload);
    navigate(`/recipes/${recipe.slug}`, { replace: true });
  }

  return <RecipeEditorForm onSubmit={handleCreate} submitLabel="Publish recipe" />;
}
