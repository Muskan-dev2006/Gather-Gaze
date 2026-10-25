import EmptyStateMessage from "../shared/EmptyStateMessage.jsx";
import LoadingSkeleton from "../shared/LoadingSkeleton.jsx";
import RecipeCard from "./RecipeCard.jsx";
import useInfiniteScroll from "../../hooks/useInfiniteScroll.js";

const INITIAL_SKELETON_COUNT = 8;
const MORE_SKELETON_COUNT = 3;

export default function RecipeCardGrid({ recipes, isLoading, hasMore, onLoadMore, emptyMessage }) {
  const sentinelRef = useInfiniteScroll({ hasMore, isLoading, onLoadMore });

  if (isLoading && recipes.length === 0) return <LoadingSkeleton count={INITIAL_SKELETON_COUNT} />;
  if (!isLoading && recipes.length === 0) return <EmptyStateMessage message={emptyMessage} />;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}
      </div>
      {isLoading && <LoadingSkeleton count={MORE_SKELETON_COUNT} />}
      {hasMore && <div ref={sentinelRef} className="flex min-h-16 items-center justify-center">
        <button type="button" disabled={isLoading} onClick={onLoadMore} className="rounded-full border border-[#e9e0d4] bg-white px-5 py-2.5 text-sm font-semibold text-[#6d5840] disabled:opacity-50">
          {isLoading ? "Loading more recipes…" : "Load more recipes"}
        </button>
      </div>}
    </>
  );
}
