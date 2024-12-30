"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { debounce } from "lodash-es";

import { useInView } from "react-intersection-observer";

import { Spinner } from "@/components/ui/spinner";

import type { AspiranteQueryParams, Aspirante } from "@/lib/data";
import { ASPIRANTES_PER_PAGE } from "@/lib/constants";

import { AspiranteGridCard } from "./aspirante-grid-card";

interface AspiranteGridListProps {
  initialAspirantes: Aspirante[];
  filters: Partial<Omit<AspiranteQueryParams, "limit" | "offset">>;
  fetchMoreAspirantes: (params: AspiranteQueryParams) => Promise<Aspirante[]>;
}

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
  const { ref, inView } = useInView({ threshold: 0.9 });

  // Fetch and append more aspirantes
  const loadMoreAspirantes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const limit = ASPIRANTES_PER_PAGE;
      const offset = (page - 1) * limit;
      const newAspirantes = await fetchMoreAspirantes({
        ...filters,
        limit,
        offset,
      });

      if (newAspirantes.length < limit) {
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

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {aspirantes.map((aspirante) => (
          <AspiranteGridCard key={aspirante.slug} aspirante={aspirante} />
        ))}
      </div>

      {/* The div below triggers the IntersectionObserver once it becomes visible */}
      <div className="h-10" ref={ref} />
      {isLoading && (
        <div className="flex justify-center py-3">
          <div className="flex animate-bounce items-center gap-3">
            <Spinner className="text-primary">
              <span className="text-primary">Cargando datos...</span>
            </Spinner>
          </div>
        </div>
      )}
    </>
  );
}
