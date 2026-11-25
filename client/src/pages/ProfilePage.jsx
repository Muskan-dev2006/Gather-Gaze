import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProfile, getMyRecipes } from "../api/me.api.js";

export default function ProfilePage({ RecipeCardGrid }) {
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [recipesError, setRecipesError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isActive = true;
    setProfileError("");
    setRecipesError("");
    setIsLoadingRecipes(true);
    Promise.all([getMyProfile(), getMyRecipes()])
      .then(([nextProfile, recipePage]) => {
        if (!isActive) return;
        setProfile(nextProfile);
        setRecipes(recipePage.recipes);
        setNextCursor(recipePage.nextCursor);
      })
      .catch((requestError) => {
        if (!isActive) return;
        const message = requestError.response?.data?.message || "Couldn't load your profile. Please try again.";
        setProfileError(message);
        setRecipesError(message);
      })
      .finally(() => {
        if (isActive) setIsLoadingRecipes(false);
      });
    return () => { isActive = false; };
  }, [retryKey]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    setRecipesError("");
    try {
      const page = await getMyRecipes({ cursor: nextCursor });
      setRecipes((current) => [...current, ...page.recipes]);
      setNextCursor(page.nextCursor);
    } catch (requestError) {
      setRecipesError(requestError.response?.data?.message || "Couldn't load more of your recipes.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, nextCursor]);

  if (!profile && isLoadingRecipes) return <p role="status" className="py-12 text-center text-[#786f64]">Loading your profile…</p>;
  if (!profile && profileError) return <section className="mx-auto max-w-3xl rounded-2xl border border-[#f1d2c8] bg-white p-6 text-center"><p role="alert" className="text-sm text-[#a53a2d]">{profileError}</p><button type="button" onClick={() => setRetryKey((key) => key + 1)} className="mt-4 rounded-full bg-[#d94a38] px-5 py-2.5 text-sm font-bold text-white">Try again</button></section>;
  if (!profile) return null;

  const { user, counts } = profile;
  const metrics = [
    ["Published recipes", counts.publishedRecipes],
    ["Likes received", counts.likesReceived],
    ["Saved recipes", counts.savedRecipes],
  ];

  return (
    <section className="mx-auto max-w-5xl text-[#302b24]">
      <header className="flex flex-wrap items-center gap-5 border-b border-[#eee6da] pb-8">
        {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" /> : <span aria-hidden="true" className="grid h-20 w-20 place-items-center rounded-full bg-[#e3a32c]/25 font-serif text-3xl font-bold text-[#70501b]">{user.name.charAt(0).toUpperCase()}</span>}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b9382a]">Your profile</p>
          <h1 className="mt-1 font-serif text-4xl font-bold">{user.name}</h1>
          <p className="mt-2 text-sm text-[#786f64]">{user.email}</p>
        </div>
      </header>

      <dl className="grid gap-6 border-b border-[#eee6da] py-8 sm:grid-cols-3">
        {metrics.map(([label, value]) => <div key={label} className="border-l-2 border-[#e3a32c] pl-4"><dt className="text-sm font-semibold text-[#786f64]">{label}</dt><dd className="mt-2 font-serif text-4xl font-bold">{value.toLocaleString()}</dd></div>)}
      </dl>

      <section className="pt-8" aria-labelledby="profile-recipes-heading">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b9382a]">From your kitchen</p><h2 id="profile-recipes-heading" className="mt-1 font-serif text-3xl font-bold">Your recipes</h2></div><Link className="rounded-full bg-[#d94a38] px-5 py-3 text-sm font-bold text-white hover:bg-[#b9382a]" to="/create">Add a recipe</Link></header>
        {recipesError && <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f1d2c8] bg-[#fff4f0] px-4 py-3 text-sm text-[#a53a2d]" role="alert"><span>{recipesError}</span><button type="button" className="font-bold underline" onClick={() => setRetryKey((key) => key + 1)}>Retry</button></div>}
        <RecipeCardGrid recipes={recipes} isLoading={isLoadingRecipes || isLoadingMore} hasMore={Boolean(nextCursor)} onLoadMore={loadMore} emptyMessage="You haven't published a recipe yet." />
      </section>
    </section>
  );
}
