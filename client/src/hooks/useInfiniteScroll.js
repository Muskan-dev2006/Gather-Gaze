import { useEffect, useRef } from "react";

const OBSERVER_ROOT_MARGIN = "320px";

export default function useInfiniteScroll({ hasMore, isLoading, onLoadMore }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onLoadMore();
    }, { rootMargin: OBSERVER_ROOT_MARGIN });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return sentinelRef;
}
