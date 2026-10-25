import axios from "axios";

export async function getMyRecipes({ cursor, limit } = {}) {
  const { data } = await axios.get("/api/me/recipes", {
    params: { cursor, limit },
    withCredentials: true,
  });
  return data;
}

export async function getMySavedRecipes({ cursor, limit } = {}) {
  const { data } = await axios.get("/api/me/saved", {
    params: { cursor, limit },
    withCredentials: true,
  });
  return data;
}

export async function getMyProfile() {
  const { data } = await axios.get("/api/me/profile", { withCredentials: true });
  return data.profile;
}

export async function deleteMyRecipe(recipeId) {
  const { data } = await axios.delete(`/api/recipes/${recipeId}`, { withCredentials: true });
  return data;
}