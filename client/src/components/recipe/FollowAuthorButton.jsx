import { useEffect, useState } from "react";
import { followUser, getFollowStatus, unfollowUser } from "../../api/follows.api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function FollowAuthorButton({ authorId }) {
  const { user, requireAuth } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const currentUserId = user?._id || user?.id;
  const isAuthor = currentUserId && String(currentUserId) === String(authorId);

  useEffect(() => {
    let active = true;
    if (!user || isAuthor) {
      setIsFollowing(false);
      return () => { active = false; };
    }
    getFollowStatus(authorId).then((following) => { if (active) setIsFollowing(following); }).catch(() => {});
    return () => { active = false; };
  }, [authorId, user?._id, user?.id, isAuthor]);

  if (isAuthor) return null;

  async function toggleFollow() {
    if (!user) return requireAuth(() => {}, "Sign in to follow this cook.");
    setBusy(true); setError("");
    try {
      setIsFollowing(isFollowing ? await unfollowUser(authorId) : await followUser(authorId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Couldn't update your follow.");
    } finally { setBusy(false); }
  }

  return <span className="inline-flex flex-col items-start gap-1">
    <button type="button" onClick={toggleFollow} disabled={busy} aria-pressed={isFollowing} className="rounded-full border border-[#eee6da] px-3 py-1.5 text-xs font-bold text-[#a53a2d] hover:border-[#d94a38] disabled:opacity-50">{busy ? "Saving..." : isFollowing ? "Following" : "Follow cook"}</button>
    {error && <span role="alert" className="text-xs text-[#a53a2d]">{error}</span>}
  </span>;
}
