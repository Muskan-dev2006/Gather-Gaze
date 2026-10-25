import axios from "axios";

export async function addRecipeLike(recipeId) {
  const { data } = await axios.post(`/api/recipes/${encodeURIComponent(recipeId)}/like`, {}, { withCredentials: true });
  return data;
}

export async function removeRecipeLike(recipeId) {
  const { data } = await axios.delete(`/api/recipes/${encodeURIComponent(recipeId)}/like`, { withCredentials: true });
  return data;
}

export async function saveRecipe(recipeId) {
  const { data } = await axios.post(`/api/recipes/${encodeURIComponent(recipeId)}/save`, {}, { withCredentials: true });
  return data;
}

export async function unsaveRecipe(recipeId) {
  const { data } = await axios.delete(`/api/recipes/${encodeURIComponent(recipeId)}/save`, { withCredentials: true });
  return data;
}

export async function getReviews(recipeId) {
  const { data } = await axios.get(`/api/recipes/${encodeURIComponent(recipeId)}/reviews`, { withCredentials: true });
  return data;
}

export async function submitReview(recipeId, review) {
  const { data } = await axios.post(`/api/recipes/${encodeURIComponent(recipeId)}/reviews`, review, { withCredentials: true });
  return data.review;
}
