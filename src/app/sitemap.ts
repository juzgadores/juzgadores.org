import type { MetadataRoute } from "next";

import { getAspirantesCount, getAspirantes } from "@/lib/data";
import { BASE_URL } from "@/lib/constants";

const SITEMAP_PAGE_SIZE = Number(
  process.env.NEXT_PUBLIC_SITEMAP_AGE_SIZE ?? "100",
);

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const limit = SITEMAP_PAGE_SIZE;
  const offset = id * limit;
  const aspirantes = await getAspirantes({ offset, limit });

  return aspirantes.map(({ slug, lastModified }) => ({
    url: `${BASE_URL}/aspirantes/${slug}`,
    lastModified,
  }));
}

export async function generateSitemaps() {
  const total = await getAspirantesCount();
  const length = Math.ceil(total / SITEMAP_PAGE_SIZE);
  return Array.from({ length }, (_, id) => ({ id }));
}
