"use server";

import {
  type AspiranteQueryParams,
  type Aspirante,
  getAspirantes,
} from "@/lib/data/aspirantes";

export async function fetchMoreAspirantes(
  params: AspiranteQueryParams & { limit?: number; offset?: number },
): Promise<Aspirante[]> {
  const aspirantes = await getAspirantes(params);
  return aspirantes;
}
