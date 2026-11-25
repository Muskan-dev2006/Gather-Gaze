import { useEffect, useState } from "react";
import { addRecipeToCollection, createCollection, getCollections } from "../../api/collections.api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AddToCollectionButton({ recipeId }) {
  const { user, requireAuth } = useAuth();
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) getCollections().then((items) => {
      setCollections(items);
      setSelectedId(items[0]?._id || "");
    }).catch(() => {});
  }, [user?._id, user?.id]);

  async function handleAdd() {
    if (!user) return requireAuth(() => {}, "Sign in to organize recipes into collections.");
    setError(""); setMessage(""); setBusy(true);
    try {
      let collectionId = selectedId;
      if (name.trim()) {
        const created = await createCollection(name.trim());
        setCollections((items) => [created, ...items]);
        collectionId = created._id;
        setSelectedId(collectionId);
        setName("");
      }
      if (!collectionId) throw new Error("Create or choose a collection first.");
      await addRecipeToCollection(collectionId, recipeId);
      setMessage("Added to collection.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Couldn't add this recipe.");
    } finally { setBusy(false); }
  }

  return <div className="mt-3 flex flex-wrap items-center gap-2">
    <select aria-label="Choose a cookbook" className="rounded-full border border-[#eee6da] bg-white px-3 py-2 text-sm" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} disabled={!user || busy}>
      <option value="">Choose collection</option>{collections.map((collection) => <option key={collection._id} value={collection._id}>{collection.name}</option>)}
    </select>
    <input aria-label="New collection name" className="w-40 rounded-full border border-[#eee6da] px-3 py-2 text-sm" maxLength={60} placeholder="Or create one" value={name} onChange={(event) => setName(event.target.value)} disabled={!user || busy} />
    <button type="button" onClick={handleAdd} disabled={busy || (Boolean(user) && !name.trim() && !selectedId)} className="rounded-full border border-[#eee6da] px-4 py-2 text-sm font-semibold text-[#786f64] hover:border-[#d94a38] hover:text-[#b9382a] disabled:opacity-50">{busy ? "Adding..." : "Add to cookbook"}</button>
    {error && <span role="alert" className="basis-full text-sm text-[#a53a2d]">{error}</span>}{message && <span role="status" className="basis-full text-sm text-[#397346]">{message}</span>}
  </div>;
}
