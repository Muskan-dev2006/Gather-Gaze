import axios from "axios";

export async function createRecipe(recipe) {
  const { data } = await axios.post("/api/recipes", recipe, { withCredentials: true });
  return data.recipe;
}

export async function getRecipeBySlug(slug) {
  const { data } = await axios.get(`/api/recipes/${encodeURIComponent(slug)}`, { withCredentials: true });
  return data.recipe;
}

export async function updateRecipe(recipeId, recipe) {
  const { data } = await axios.put(`/api/recipes/${encodeURIComponent(recipeId)}`, recipe, { withCredentials: true });
  return data.recipe;
}

export async function deleteRecipe(recipeId) {
  const { data } = await axios.delete(`/api/recipes/${encodeURIComponent(recipeId)}`, { withCredentials: true });
  return data;
}
