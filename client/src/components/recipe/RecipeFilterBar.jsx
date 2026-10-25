const DIET_OPTIONS = [
  ["veg", "Vegetarian"],
  ["vegan", "Vegan"],
  ["keto", "Keto"],
  ["non-veg", "Non-vegetarian"],
];
const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];
const MAX_TIME_OPTIONS = [30, 45, 60, 90];

export default function RecipeFilterBar({ filters, onFiltersChange }) {
  function updateFilter(event) {
    onFiltersChange({ ...filters, [event.target.name]: event.target.value });
  }

  function clearFilters() {
    onFiltersChange({ cuisine: "", diet: "", maxTime: "", difficulty: "" });
  }

  return (
    <section aria-label="Filter recipes" className="flex flex-wrap items-end gap-3 rounded-2xl border border-[#eee6da] bg-white p-4">
      <FilterSelect label="Cuisine" name="cuisine" value={filters.cuisine} onChange={updateFilter}>
        <option value="">All cuisines</option>
        {["Italian", "Indian", "Japanese", "Mexican", "Mediterranean", "Thai", "French", "Korean"].map((cuisine) => <option key={cuisine}>{cuisine}</option>)}
      </FilterSelect>
      <FilterSelect label="Diet" name="diet" value={filters.diet} onChange={updateFilter}>
        <option value="">Any diet</option>
        {DIET_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </FilterSelect>
      <FilterSelect label="Max time" name="maxTime" value={filters.maxTime} onChange={updateFilter}>
        <option value="">Any cook time</option>
        {MAX_TIME_OPTIONS.map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes or less</option>)}
      </FilterSelect>
      <FilterSelect label="Difficulty" name="difficulty" value={filters.difficulty} onChange={updateFilter}>
        <option value="">Any level</option>
        {DIFFICULTY_OPTIONS.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
      </FilterSelect>
      <button type="button" onClick={clearFilters} className="rounded-full px-3 py-2 text-sm font-semibold text-[#b9382a] hover:bg-[#faece8]">Clear filters</button>
    </section>
  );
}

function FilterSelect({ label, name, children, ...props }) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-[#786f64]">
      {label}
      <select name={name} className="min-w-32 rounded-xl border border-[#e9e0d4] bg-[#fffaf2] px-3 py-2.5 text-sm text-[#302b24] outline-none focus:border-[#d94a38]" {...props}>
        {children}
      </select>
    </label>
  );
}
