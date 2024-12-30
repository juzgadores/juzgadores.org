import { NextResponse } from "next/server";

import { BASE_URL } from "@/lib/constants";
import { generateSitemaps } from "@/app/sitemap";

export async function GET() {
  const sitemaps = await generateSitemaps();

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps
      .map(
        ({ id }) => `
      <sitemap>
        <loc>${BASE_URL}/sitemap/${id}.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
    `,
      )
      .join("")}
  </sitemapindex>`;

  return new NextResponse(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
