import { type MetadataRoute } from "next";

import { getAspirantes } from "@/lib/data";

const baseUrl = "https://juzgadores.org";
const lastModified = new Date("2024-12-15");
const changeFrequency = "weekly" as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const aspirantes = await getAspirantes({ limit: Infinity });
  const aspirantesRoutes = aspirantes.map(({ slug }) => ({
    url: `${baseUrl}/aspirantes/${slug}`,
    priority: 0.7,
    lastModified,
    changeFrequency,
  }));

  const staticRoutes = [
    {
      url: baseUrl,
      priority: 1,
      lastModified,
      changeFrequency,
    },
    {
      url: `${baseUrl}/aspirantes`,
      priority: 0.9,
      lastModified,
      changeFrequency,
    },
  ];

  return [...staticRoutes, ...aspirantesRoutes];
}
