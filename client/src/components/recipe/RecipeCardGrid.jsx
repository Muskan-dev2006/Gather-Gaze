import EmptyStateMessage from "../shared/EmptyStateMessage.jsx";
import LoadingSkeleton from "../shared/LoadingSkeleton.jsx";
import RecipeCard from "./RecipeCard.jsx";
import useInfiniteScroll from "../../hooks/useInfiniteScroll.js";

const INITIAL_SKELETON_COUNT = 8;
const MORE_SKELETON_COUNT = 4;

export default function RecipeCardGrid({ recipes, isLoading, hasMore, onLoadMore, emptyMessage, onClearFilters, renderActions }) {
  const sentinelRef = useInfiniteScroll({ hasMore, isLoading, onLoadMore });

  if (isLoading && recipes.length === 0) return <LoadingSkeleton count={INITIAL_SKELETON_COUNT} />;
  if (!isLoading && recipes.length === 0) {
    return <div className="recipe-empty-state"><EmptyStateMessage message={emptyMessage} />{onClearFilters && <button type="button" onClick={onClearFilters}>Clear filters</button>}</div>;
  }

  return (
    <>
      <div className="recipe-grid">
        {recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} actions={renderActions?.(recipe)} />)}
      </div>
      {isLoading && <LoadingSkeleton count={MORE_SKELETON_COUNT} />}
      {hasMore && <div ref={sentinelRef} className="recipe-load-more"><button type="button" disabled={isLoading} onClick={onLoadMore}>{isLoading ? "Loading more recipes…" : "Load more recipes"}</button></div>}
      {!hasMore && !isLoading && recipes.length > 0 && <p className="recipe-end-message">You have seen it all. Happy cooking!</p>}
    </>
  );
}
