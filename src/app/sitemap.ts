import type { MetadataRoute } from "next";

import { getAspirantesCount, getAspirantes } from "@/lib/data";
import { BASE_URL } from "@/lib/constants";

const SITEMAP_PAGE_SIZE = Number(
  process.env.NEXT_PUBLIC_SITEMAP_PAGE_SIZE ?? "600",
);

export default async function sitemap({
  id,
}: {
  id: "static" | number;
}): Promise<MetadataRoute.Sitemap> {
  if (id === "static") {
    // Static sitemaps
    return [
      {
        url: `${BASE_URL}/aspirantes?limit=Infinity`,
        lastModified: new Date().toISOString(),
        priority: 0.9,
        changeFrequency: "daily" as const,
      },
    ];
  }

  // Aspirantes sitemaps
  const limit = SITEMAP_PAGE_SIZE;
  const offset = id * limit;
  const aspirantes = await getAspirantes({ offset, limit });

  return aspirantes.map(({ slug, lastModified }) => ({
    url: `${BASE_URL}/aspirantes/${slug}`,
    lastModified,
    priority: 0.5,
    changeFrequency: "weekly" as const,
  }));
}

export async function generateSitemaps() {
  const total = await getAspirantesCount();
  const length = Math.ceil(total / SITEMAP_PAGE_SIZE);
  const aspirantesSitemaps = Array.from({ length }, (_, id) => ({ id }));

  return [{ id: "static" }, ...aspirantesSitemaps];
}
