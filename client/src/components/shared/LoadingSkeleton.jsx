const DEFAULT_SKELETON_COUNT = 6;

export default function LoadingSkeleton({ count = DEFAULT_SKELETON_COUNT }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Loading recipes">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-[#eee6da] bg-white p-3 shadow-sm">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-[#f1e9dd]" />
          <div className="space-y-3 p-3 pt-5">
            <div className="h-5 w-4/5 animate-pulse rounded-full bg-[#f1e9dd]" />
            <div className="h-4 w-2/5 animate-pulse rounded-full bg-[#f7f1e9]" />
          </div>
        </div>
      ))}
    </div>
  );
}
