import axios from "axios";

export async function getFollowStatus(userId) {
  const { data } = await axios.get(`/api/users/${encodeURIComponent(userId)}/follow`, { withCredentials: true });
  return data.isFollowing;
}

export async function followUser(userId) {
  const { data } = await axios.post(`/api/users/${encodeURIComponent(userId)}/follow`, {}, { withCredentials: true });
  return data.isFollowing;
}

export async function unfollowUser(userId) {
  const { data } = await axios.delete(`/api/users/${encodeURIComponent(userId)}/follow`, { withCredentials: true });
  return data.isFollowing;
}
