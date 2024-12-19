"use server";

import { type AspiranteFilters, getAspirantes } from "@/lib/data/aspirantes";

export async function fetchMoreAspirantes(
  params: AspiranteFilters & { limit: number; offset: number },
) {
  return getAspirantes(params);
}
