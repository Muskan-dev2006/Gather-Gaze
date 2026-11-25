import axios from "axios";

export async function getCollections() {
  const { data } = await axios.get("/api/collections", { withCredentials: true });
  return data.collections;
}

export async function createCollection(name) {
  const { data } = await axios.post("/api/collections", { name }, { withCredentials: true });
  return data.collection;
}

export async function deleteCollection(id) {
  const { data } = await axios.delete(`/api/collections/${encodeURIComponent(id)}`, { withCredentials: true });
  return data;
}

export async function addRecipeToCollection(collectionId, recipeId) {
  const { data } = await axios.post(`/api/collections/${encodeURIComponent(collectionId)}/recipes`, { recipeId }, { withCredentials: true });
  return data;
}

export async function removeRecipeFromCollection(collectionId, recipeId) {
  const { data } = await axios.delete(`/api/collections/${encodeURIComponent(collectionId)}/recipes/${encodeURIComponent(recipeId)}`, { withCredentials: true });
  return data;
}
