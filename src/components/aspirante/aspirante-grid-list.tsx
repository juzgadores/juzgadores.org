"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { debounce } from "lodash-es";

import { useInView } from "react-intersection-observer";

import { debugLog } from "@/lib/utils";
import {
  type AspiranteQueryParams,
  type Aspirante,
} from "@/lib/data/aspirantes";

import { AspiranteGridCard } from "./aspirante-grid-card";

interface AspiranteGridListProps {
  initialAspirantes: Aspirante[];
  filters: Partial<AspiranteQueryParams>;
  fetchMoreAspirantes: (
    params: AspiranteQueryParams & { limit: number; offset: number },
  ) => Promise<Aspirante[]>;
}

const ITEMS_PER_PAGE = 24;

export function AspiranteGridList({
  initialAspirantes = [],
  filters,
  fetchMoreAspirantes,
}: Readonly<AspiranteGridListProps>) {
  const [aspirantes, setAspirantes] = useState<Aspirante[]>(initialAspirantes);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Keep track of the last reference to initialAspirantes
  const lastInitialAspirantesRef = useRef<Aspirante[]>(initialAspirantes);

  // Intersection Observer Hook
  const { ref, inView } = useInView({ threshold: 0 });

  // Fetch and append more aspirantes
  const loadMoreAspirantes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newAspirantes = await fetchMoreAspirantes({
        ...filters,
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
      });

      if (newAspirantes.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setAspirantes((prev) => {
        // Merge existing + new
        const merged = [...prev, ...newAspirantes];
        // Deduplicate using a Set
        const seen = new Set<string>();
        const unique: Aspirante[] = [];

        for (const aspirante of merged) {
          if (!seen.has(aspirante.slug)) {
            seen.add(aspirante.slug);
            unique.push(aspirante);
          }
        }

        debugLog("Updated aspirantes:", unique);

        return unique;
      });

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error loading more aspirantes:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, filters, fetchMoreAspirantes]);

  // Watch for changes in the `initialAspirantes` reference
  useEffect(() => {
    // If the parent provides a new array (new reference),
    // reset list, page, and hasMore states
    if (lastInitialAspirantesRef.current !== initialAspirantes) {
      debugLog("Initial aspirantes changed:", initialAspirantes);
      setAspirantes(initialAspirantes);
      setPage(2);
      setHasMore(true);
      lastInitialAspirantesRef.current = initialAspirantes;
    }
  }, [initialAspirantes]);

  // Debounce infinite scroll triggers
  useEffect(() => {
    const debouncedLoadMore = debounce(() => {
      if (inView) {
        void loadMoreAspirantes();
      }
    }, 200);

    debouncedLoadMore();
    return () => {
      debouncedLoadMore.cancel();
    };
  }, [inView, loadMoreAspirantes]);

  // Dev-only logs
  debugLog(
    "RENDERING with",
    aspirantes.length,
    "aspirantes | loading:",
    isLoading,
    "| hasMore:",
    hasMore,
    "| inView:",
    inView,
    "| page:",
    page,
    "| ITEMS_PER_PAGE:",
    ITEMS_PER_PAGE,
    "| filters:",
    filters,
  );

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {aspirantes.map((aspirante, index) => (
          <AspiranteGridCard
            key={`${aspirante.slug}-${index}`}
            aspirante={aspirante}
          />
        ))}
      </div>
      {/* The div below triggers the IntersectionObserver once it becomes visible */}
      <div className="h-10" ref={ref} />
      {isLoading && <div className="py-6 text-center">Cargando...</div>}
    </>
  );
}
