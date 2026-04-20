import { useEffect, useRef } from 'react';

interface InfiniteScrollOptions {
  enabled: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export function useInfiniteScroll({ enabled, onLoadMore, rootMargin = '360px' }: InfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || isLoadingRef.current) {
          return;
        }

        isLoadingRef.current = true;
        onLoadMoreRef.current();
        window.setTimeout(() => {
          isLoadingRef.current = false;
        }, 220);
      },
      {
        root: null,
        rootMargin,
        threshold: 0.05,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [enabled, rootMargin]);

  return { sentinelRef };
}
