import axios from "axios";

export async function getNotifications() {
  const { data } = await axios.get("/api/notifications", { withCredentials: true });
  return data;
}

export async function markNotificationsRead(id) {
  const path = id ? `/api/notifications/${encodeURIComponent(id)}/read` : "/api/notifications/read";
  const { data } = await axios.patch(path, {}, { withCredentials: true });
  return data;
}

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
