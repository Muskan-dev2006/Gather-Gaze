import { useState } from "react";
import { Link } from "react-router-dom";
import CoverImageUploader from "./CoverImageUploader.jsx";

const EMPTY_INGREDIENT = { name: "", qty: "", unit: "" };
const FIELD = "mt-2 w-full rounded-xl border border-[#e9dfd2] bg-white px-4 py-3 text-sm text-[#302b24] outline-none transition placeholder:text-[#a39789] focus:border-[#d94a38] focus:ring-4 focus:ring-[#d94a38]/10";
const LABEL = "block text-sm font-bold text-[#494035]";

function toFormValues(recipe) {
  return {
    title: recipe?.title || "",
    description: recipe?.description || "",
    cuisine: recipe?.cuisine || "",
    diet: recipe?.diet || "veg",
    difficulty: recipe?.difficulty || "easy",
    cookTime: String(recipe?.cookTime ?? 30),
    servings: String(recipe?.servings ?? 2),
    tags: (recipe?.tags || []).join(", "),
  };
}

export default function RecipeEditorForm({ recipe, onSubmit, submitLabel }) {
  const [form, setForm] = useState(() => toFormValues(recipe));
  const [coverUrl, setCoverUrl] = useState(recipe?.coverUrl || "");
  const [ingredients, setIngredients] = useState(() => recipe?.ingredients?.map(({ name, qty, unit = "" }) => ({ name, qty: String(qty), unit })) || [{ ...EMPTY_INGREDIENT }]);
  const [steps, setSteps] = useState(() => recipe?.steps?.slice().sort((a, b) => a.order - b.order).map(({ text }) => text) || [""]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const cleanIngredients = ingredients.map((item) => ({
      name: item.name.trim(),
      qty: Number(item.qty),
      ...(item.unit.trim() ? { unit: item.unit.trim() } : {}),
    }));
    const cleanSteps = steps.map((text) => text.trim());
    const cookTime = Number(form.cookTime);
    const servings = Number(form.servings);
    const tags = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

    if (!form.title.trim() || !form.cuisine.trim()) return setError("Add a recipe name and cuisine.");
    if (form.cuisine.trim().length > 80) return setError("Keep the cuisine name under 80 characters.");
    if (form.title.trim().length > 120 || form.description.trim().length > 500) return setError("Keep the recipe name under 120 characters and description under 500.");
    if (!coverUrl) return setError("Add a cover photo before saving.");
    if (!Number.isInteger(cookTime) || cookTime < 1 || !Number.isInteger(servings) || servings < 1) return setError("Cook time and servings must be positive whole numbers.");
    if (tags.length > 20 || tags.some((tag) => tag.length > 40)) return setError("Add up to 20 tags, with no more than 40 characters each.");
    if (!cleanIngredients.length || ingredients.length > 100 || ingredients.some(({ name, qty }) => name.trim() && qty.trim() === "") || cleanIngredients.some(({ name, qty }) => !name || name.length > 120 || !Number.isFinite(qty) || qty < 0)) return setError("Add 1 to 100 ingredients, each with a valid name and quantity.");
    if (cleanIngredients.some(({ unit }) => unit && unit.length > 40)) return setError("Keep ingredient units under 40 characters.");
    if (!cleanSteps.length || cleanSteps.length > 100 || cleanSteps.some((text) => !text || text.length > 2000)) return setError("Add 1 to 100 preparation steps, up to 2,000 characters each.");

    setIsSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        coverUrl,
        cuisine: form.cuisine.trim(),
        diet: form.diet,
        difficulty: form.difficulty,
        cookTime,
        servings,
        tags,
        ingredients: cleanIngredients,
        steps: cleanSteps.map((text, index) => ({ order: index + 1, text })),
      });
    } catch (saveError) {
      setError(saveError.response?.data?.message || saveError.message || "Couldn't save your recipe. Please try again.");
      setIsSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl text-[#302b24]">
      <header className="mb-8 border-b border-[#eee6da] pb-6">
        <Link to="/my/recipes" className="text-sm font-semibold text-[#786f64] hover:text-[#b9382a]">? My recipes</Link>
        <p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-[#b9382a]">From your kitchen</p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight">{recipe ? "Edit recipe" : "Add a recipe"}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#786f64]">Share a favorite dish with your community.</p>
      </header>

      {error && <p className="mb-6 rounded-xl border border-[#d94a38]/25 bg-[#fff4f0] px-4 py-3 text-sm text-[#a53a2d]" role="alert">{error}</p>}
      <form className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]" onSubmit={handleSubmit}>
        <div className="grid content-start gap-6">
          <section className="rounded-2xl border border-[#eee6da] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="font-serif text-2xl font-bold">The basics</h2>
            <div className="mt-5 grid gap-5">
              <label className={LABEL}>Recipe name *<input className={FIELD} name="title" required maxLength={120} value={form.title} onChange={updateField} placeholder="e.g. Sunday tomato pasta" /></label>
              <label className={LABEL}>Description<textarea className={`${FIELD} min-h-24 resize-y`} name="description" maxLength={500} value={form.description} onChange={updateField} placeholder="What makes this dish special?" /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={LABEL}>Cuisine *<input className={FIELD} name="cuisine" required maxLength={80} value={form.cuisine} onChange={updateField} placeholder="e.g. Italian" /></label>
                <label className={LABEL}>Diet<select className={FIELD} name="diet" value={form.diet} onChange={updateField}><option value="veg">Vegetarian</option><option value="vegan">Vegan</option><option value="non-veg">Non-vegetarian</option><option value="keto">Keto</option></select></label>
                <label className={LABEL}>Difficulty<select className={FIELD} name="difficulty" value={form.difficulty} onChange={updateField}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></label>
                <label className={LABEL}>Cook time (minutes)<input className={FIELD} name="cookTime" type="number" min="1" step="1" required value={form.cookTime} onChange={updateField} /></label>
                <label className={LABEL}>Servings<input className={FIELD} name="servings" type="number" min="1" step="1" required value={form.servings} onChange={updateField} /></label>
                <label className={LABEL}>Tags <span className="font-normal text-[#968a7d]">(comma separated)</span><input className={FIELD} name="tags" value={form.tags} onChange={updateField} placeholder="comfort food, weeknight" /></label>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#eee6da] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><h2 className="font-serif text-2xl font-bold">Ingredients</h2><p className="mt-1 text-sm text-[#786f64]">Add each ingredient and its amount.</p></div><button className="shrink-0 rounded-full border border-[#eee6da] px-4 py-2 text-xs font-bold text-[#a53a2d] hover:bg-[#fff4f0]" type="button" onClick={() => setIngredients((rows) => [...rows, { ...EMPTY_INGREDIENT }])}>+ Add ingredient</button></div>
            <div className="mt-5 grid gap-3">{ingredients.map((item, index) => <div className="grid grid-cols-[minmax(0,1fr)_82px_minmax(0,110px)_36px] items-end gap-2" key={index}>
              <label className="min-w-0 text-xs font-bold text-[#786f64]">Ingredient<input className={FIELD} value={item.name} onChange={(event) => setIngredients((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, name: event.target.value } : row))} placeholder="Tomatoes" /></label>
              <label className="text-xs font-bold text-[#786f64]">Amount<input className={FIELD} type="number" min="0" step="any" value={item.qty} onChange={(event) => setIngredients((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, qty: event.target.value } : row))} placeholder="2" /></label>
              <label className="text-xs font-bold text-[#786f64]">Unit<input className={FIELD} value={item.unit} onChange={(event) => setIngredients((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, unit: event.target.value } : row))} placeholder="cups" /></label>
              <button aria-label={`Remove ingredient ${index + 1}`} className="mb-1 grid h-10 w-9 place-items-center rounded-lg text-lg text-[#a53a2d] hover:bg-[#fff4f0] disabled:opacity-30" disabled={ingredients.length === 1} type="button" onClick={() => setIngredients((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>×</button>
            </div>)}</div>
          </section>

          <section className="rounded-2xl border border-[#eee6da] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><h2 className="font-serif text-2xl font-bold">Method</h2><p className="mt-1 text-sm text-[#786f64]">Steps are saved in the order shown.</p></div><button className="shrink-0 rounded-full border border-[#eee6da] px-4 py-2 text-xs font-bold text-[#a53a2d] hover:bg-[#fff4f0]" type="button" onClick={() => setSteps((rows) => [...rows, ""])}>+ Add step</button></div>
            <div className="mt-5 grid gap-4">{steps.map((step, index) => <div className="flex items-start gap-3" key={index}><span className="mt-3 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#fff0eb] text-sm font-bold text-[#b9382a]">{index + 1}</span><textarea className={`${FIELD} min-h-20 resize-y`} aria-label={`Step ${index + 1}`} value={step} onChange={(event) => setSteps((rows) => rows.map((text, rowIndex) => rowIndex === index ? event.target.value : text))} placeholder="Describe what to do..." /><button aria-label={`Remove step ${index + 1}`} className="mt-3 text-lg text-[#a53a2d] hover:text-[#7f261d] disabled:opacity-30" disabled={steps.length === 1} type="button" onClick={() => setSteps((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>×</button></div>)}</div>
          </section>
        </div>

        <aside className="grid content-start gap-5">
          <section className="rounded-2xl border border-[#eee6da] bg-white p-5 shadow-sm"><CoverImageUploader imageUrl={coverUrl} onChange={setCoverUrl} disabled={isSaving} onUploadingChange={setIsUploading} /></section>
          <div className="rounded-2xl border border-[#eee6da] bg-white p-5 shadow-sm">
            <p className="text-sm leading-6 text-[#786f64]">{recipe ? "Save your changes when you’re ready." : "Your recipe will be shared with the community when you publish it."}</p>
            <button className="mt-4 w-full rounded-full bg-[#d94a38] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#b9382a] disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isSaving || isUploading}>{isSaving ? "Saving recipe…" : isUploading ? "Uploading photo…" : submitLabel}</button>
            <Link className="mt-3 block text-center text-sm font-semibold text-[#786f64] hover:text-[#b9382a]" to={recipe ? `/recipes/${recipe.slug}` : "/my/recipes"}>Cancel</Link>
          </div>
        </aside>
      </form>
    </section>
  );
}




