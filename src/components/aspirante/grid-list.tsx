"use client";

import { useCallback, useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";

import { type AspiranteFilters, type Aspirante } from "@/lib/data/aspirantes";

import { AspiranteGridCard } from "./grid-card";

interface AspiranteGridListProps {
  initialAspirantes: Aspirante[];
  filters: Partial<AspiranteFilters>;
  fetchMoreAspirantes: (
    params: AspiranteFilters & { limit: number; offset: number },
  ) => Promise<Aspirante[]>;
}

const ITEMS_PER_PAGE = Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) ?? 12;

export function AspiranteGridList({
  initialAspirantes = [],
  filters,
  fetchMoreAspirantes,
}: Readonly<AspiranteGridListProps>) {
  const [aspirantes, setAspirantes] = useState<Aspirante[]>(initialAspirantes);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({ threshold: 0 });

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
      setAspirantes((prev) => [...prev, ...newAspirantes]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading more aspirantes:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, filters, fetchMoreAspirantes]);

  // Reset state when filters change
  useEffect(() => {
    setAspirantes(initialAspirantes);
    setPage(2);
    setHasMore(true);
  }, [initialAspirantes]);

  useEffect(() => {
    if (inView) {
      void loadMoreAspirantes();
    }
  }, [inView, loadMoreAspirantes]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aspirantes.map((aspirante) => (
          <AspiranteGridCard key={aspirante.slug} aspirante={aspirante} />
        ))}
      </div>
      <div className="h-10" ref={ref} />
      {isLoading && (
        <div className="py-4 text-center">Cargando más aspirantes...</div>
      )}
    </>
  );
}
