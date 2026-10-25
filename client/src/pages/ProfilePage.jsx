import { useEffect, useState } from "react";
import { getMyProfile } from "../api/me.api.js";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch((requestError) => setError(requestError.response?.data?.message || "Couldn't load your profile. Please try again."));
  }, []);

  if (error) return <p role="alert" className="mx-auto max-w-3xl rounded-md border border-[#d94a38]/30 bg-white px-4 py-3 text-sm text-[#b9382a]">{error}</p>;
  if (!profile) return <p role="status" className="py-12 text-center text-[#786f64]">Loading your profile...</p>;

  const { user, counts } = profile;
  const metrics = [
    ["Published recipes", counts.publishedRecipes],
    ["Likes received", counts.likesReceived],
    ["Saved recipes", counts.savedRecipes],
  ];

  return (
    <section className="mx-auto max-w-4xl text-[#302b24]">
      <header className="flex flex-wrap items-center gap-5 border-b border-[#eee6da] pb-8">
        {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" /> : <span aria-hidden="true" className="grid h-20 w-20 place-items-center rounded-full bg-[#e3a32c]/25 font-serif text-3xl font-bold text-[#70501b]">{user.name.charAt(0).toUpperCase()}</span>}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b9382a]">Your profile</p>
          <h1 className="mt-1 font-serif text-4xl font-bold">{user.name}</h1>
          <p className="mt-2 text-sm text-[#786f64]">{user.email}</p>
        </div>
      </header>
      <dl className="grid gap-6 py-8 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div key={label} className="border-l-2 border-[#e3a32c] pl-4">
            <dt className="text-sm font-semibold text-[#786f64]">{label}</dt>
            <dd className="mt-2 font-serif text-4xl font-bold">{value.toLocaleString()}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}