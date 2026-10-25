import axios from "axios";

const apiClient = axios.create({ baseURL: "/api", withCredentials: true });

export async function getRecipes({ filters = {}, cursor, limit } = {}) {
  const { data } = await apiClient.get("/recipes", {
    params: { ...cleanFilters(filters), cursor, limit },
  });
  return data;
}

export async function searchRecipes(query, filters = {}) {
  const { data } = await apiClient.get("/recipes/search", {
    params: { ...cleanFilters(filters), q: query },
  });
  return data;
}

function cleanFilters(filters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "" && value != null));
}
