const CUISINES = ["Italian", "Indian", "Japanese", "Mexican", "Mediterranean", "Thai", "French", "Korean"];
const DIET_OPTIONS = [["veg", "Vegetarian"], ["vegan", "Vegan"], ["keto", "Keto"], ["non-veg", "Non-vegetarian"]];
const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];
const MAX_TIME_OPTIONS = [30, 45, 60, 90];
const EMPTY_FILTERS = { cuisine: "", diet: "", maxTime: "", difficulty: "" };

export default function RecipeFilterBar({ filters, onFiltersChange }) {
  function updateFilter(event) {
    onFiltersChange({ ...filters, [event.target.name]: event.target.value });
  }

  function clearFilters() {
    onFiltersChange(EMPTY_FILTERS);
  }

  return (
    <section aria-label="Filter recipes" className="recipe-filter-bar">
      <FilterSelect label="Cuisine" name="cuisine" value={filters.cuisine} onChange={updateFilter}>
        <option value="">All cuisines</option>
        {CUISINES.map((cuisine) => <option key={cuisine} value={cuisine}>{cuisine}</option>)}
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
        {DIFFICULTY_OPTIONS.map((difficulty) => <option key={difficulty} value={difficulty}>{capitalize(difficulty)}</option>)}
      </FilterSelect>
      <button className="clear-filter-button" type="button" onClick={clearFilters}>Clear filters</button>
    </section>
  );
}

function FilterSelect({ label, name, children, ...props }) {
  return <label className="recipe-filter-select">{label}<select name={name} {...props}>{children}</select></label>;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
