import { useCallback, useEffect, useRef, useState } from "react";

const OBSERVER_ROOT_MARGIN = "320px";

export default function useInfiniteScroll({ hasMore, isLoading, onLoadMore }) {
  const [sentinel, setSentinel] = useState(null);
  const requestInFlight = useRef(false);
  const sentinelRef = useCallback((node) => setSentinel(node), []);

  useEffect(() => {
    if (!sentinel || !hasMore || isLoading || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || requestInFlight.current) return;
      requestInFlight.current = true;
      Promise.resolve(onLoadMore()).finally(() => {
        requestInFlight.current = false;
      });
    }, { rootMargin: OBSERVER_ROOT_MARGIN });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, sentinel]);

  return sentinelRef;
}
