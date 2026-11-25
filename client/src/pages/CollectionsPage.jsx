import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createCollection, deleteCollection, getCollections, removeRecipeFromCollection } from "../api/collections.api.js";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    try { setCollections(await getCollections()); }
    catch (requestError) { setError(requestError.response?.data?.message || "Couldn't load your cookbooks."); }
    finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function handleCreate(event) {
    event.preventDefault(); setError("");
    try {
      const collection = await createCollection(name.trim());
      setCollections((items) => [collection, ...items]); setName("");
    } catch (requestError) { setError(requestError.response?.data?.message || "Couldn't create that cookbook."); }
  }

  async function handleDelete(collection) {
    if (!window.confirm(`Delete cookbook "${collection.name}"?`)) return;
    try { await deleteCollection(collection._id); setCollections((items) => items.filter((item) => item._id !== collection._id)); }
    catch (requestError) { setError(requestError.response?.data?.message || "Couldn't delete that cookbook."); }
  }

  async function handleRemove(collectionId, recipeId) {
    try {
      await removeRecipeFromCollection(collectionId, recipeId);
      setCollections((items) => items.map((item) => item._id === collectionId ? { ...item, recipeIds: item.recipeIds.filter((recipe) => recipe._id !== recipeId) } : item));
    } catch (requestError) { setError(requestError.response?.data?.message || "Couldn't remove that recipe."); }
  }

  return <section className="mx-auto max-w-5xl text-[#302b24]">
    <header className="mb-7 border-b border-[#eee6da] pb-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b9382a]">Your cookbooks</p><h1 className="mt-2 font-serif text-4xl font-bold">Recipe collections</h1><p className="mt-2 text-sm text-[#786f64]">Group saved recipes into collections for any occasion.</p></header>
    <form onSubmit={handleCreate} className="mb-7 flex flex-wrap gap-2 rounded-2xl border border-[#eee6da] bg-white p-4">
      <label className="sr-only" htmlFor="collection-name">New cookbook name</label><input id="collection-name" value={name} maxLength={60} required onChange={(event) => setName(event.target.value)} placeholder="e.g. Weeknight dinners" className="min-w-0 flex-1 rounded-full border border-[#eee6da] px-4 py-3 text-sm" />
      <button className="rounded-full bg-[#d94a38] px-5 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={!name.trim()} type="submit">Create cookbook</button>
    </form>
    {error && <p role="alert" className="mb-4 rounded-xl bg-[#fff4f0] p-3 text-sm text-[#a53a2d]">{error}</p>}
    {loading ? <p role="status" className="py-10 text-center text-[#786f64]">Loading cookbooks...</p> : collections.length === 0 ? <p className="rounded-2xl border border-dashed border-[#e9dfd2] py-12 text-center text-[#786f64]">No cookbooks yet. Create one or add a recipe to a new collection.</p> : <div className="grid gap-5">{collections.map((collection) => <section key={collection._id} className="rounded-2xl border border-[#eee6da] bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl font-bold">{collection.name}</h2><p className="mt-1 text-sm text-[#786f64]">{collection.recipeIds.length} recipes</p></div><button type="button" onClick={() => handleDelete(collection)} className="rounded-full border border-[#eee6da] px-4 py-2 text-sm font-semibold text-[#a53a2d]">Delete cookbook</button></div>
      {collection.recipeIds.length ? <ul className="grid gap-3 sm:grid-cols-2">{collection.recipeIds.map((recipe) => <li key={recipe._id} className="flex items-center gap-3 rounded-xl border border-[#f1ece4] p-3"><img src={recipe.coverUrl} alt="" className="h-16 w-16 rounded-lg object-cover" loading="lazy"/><div className="min-w-0 flex-1"><Link className="font-semibold hover:text-[#b9382a]" to={`/recipe/${recipe.slug}`}>{recipe.title}</Link><p className="text-xs text-[#786f64]">{recipe.cuisine} · {recipe.cookTime} min</p></div><button type="button" aria-label={`Remove ${recipe.title}`} onClick={() => handleRemove(collection._id, recipe._id)} className="px-2 text-sm font-semibold text-[#a53a2d]">Remove</button></li>)}</ul> : <p className="text-sm text-[#786f64]">This cookbook is empty. Add recipes from their recipe pages.</p>}
    </section>)}</div>}
  </section>;
}
