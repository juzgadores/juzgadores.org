"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { debounce } from "lodash-es";

import { useInView } from "react-intersection-observer";

import { Spinner } from "@/components/ui/spinner";

import type { AspiranteQueryParams, Aspirante } from "@/lib/data";

import { AspiranteGridCard } from "./aspirante-grid-card";

interface AspiranteGridListProps {
  initialAspirantes: Aspirante[];
  params: AspiranteQueryParams;
  fetchMoreAspirantes: (params: AspiranteQueryParams) => Promise<Aspirante[]>;
}

export function AspiranteGridList({
  initialAspirantes = [],
  params,
  fetchMoreAspirantes,
}: Readonly<AspiranteGridListProps>) {
  const [aspirantes, setAspirantes] = useState<Aspirante[]>(initialAspirantes);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(initialAspirantes.length);
  const [hasMore, setHasMore] = useState(
    params.limit == initialAspirantes.length,
  );

  // Keep track of the last reference to initialAspirantes
  const lastInitialAspirantesRef = useRef<Aspirante[]>(initialAspirantes);

  // Intersection Observer Hook
  const { ref, inView } = useInView({ threshold: 0.9 });

  // Fetch and append more aspirantes
  const loadMoreAspirantes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newAspirantes = await fetchMoreAspirantes({ ...params, offset });

      setAspirantes((prev) => [...prev, ...newAspirantes]);
      setOffset((prevOffset) => prevOffset + params.limit);
      setHasMore(params.limit === newAspirantes.length);
    } catch (error) {
      console.error("Error loading more aspirantes", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, fetchMoreAspirantes, params, offset]);

  // Watch for changes in the `initialAspirantes` reference
  useEffect(() => {
    if (lastInitialAspirantesRef.current !== initialAspirantes) {
      setAspirantes(initialAspirantes);
      setOffset(initialAspirantes.length);
      setHasMore(
        initialAspirantes.length <= params.limit && params.limit !== Infinity,
      );
      lastInitialAspirantesRef.current = initialAspirantes;
    }
  }, [initialAspirantes, params.limit]);

  useEffect(() => {
    const debouncedLoadMore = debounce(() => {
      if (inView) void loadMoreAspirantes();
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

      {hasMore && (
        <>
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
      )}
    </>
  );
}
