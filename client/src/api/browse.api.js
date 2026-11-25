import axios from "axios";

const apiClient = axios.create({ baseURL: "/api", withCredentials: true });

export async function getRecipes({ filters = {}, cursor, limit } = {}) {
  const { data } = await apiClient.get("/recipes", {
    params: { ...cleanFilters(filters), cursor, limit },
  });
  return data;
}

export async function searchRecipes({ q, cuisine, diet, maxTime, difficulty, signal }) {
  const { data } = await apiClient.get("/recipes/search", {
    params: { ...cleanFilters({ cuisine, diet, maxTime, difficulty }), q },
    signal,
  });
  return { items: data.items };
}

function cleanFilters(filters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "" && value != null));
}
