import axios from "axios";

export async function getRecipeBySlug(slug) {
  const { data } = await axios.get(`/api/recipes/${encodeURIComponent(slug)}`, { withCredentials: true });
  return data.recipe;
}

export async function deleteRecipe(recipeId) {
  const { data } = await axios.delete(`/api/recipes/${recipeId}`, { withCredentials: true });
  return data;
}