import axios from "axios";

const authClient = axios.create({ baseURL: "/api/auth", withCredentials: true });

export async function getCurrentUser() {
  const { data } = await authClient.get("/me");
  return data && Object.hasOwn(data, "user") ? data.user : data;
}

export async function signInWithGoogle(credential) {
  const { data } = await authClient.post("/google", { idToken: credential });
  return data && Object.hasOwn(data, "user") ? data.user : data;
}

export async function signOut() {
  await authClient.post("/logout");
}
