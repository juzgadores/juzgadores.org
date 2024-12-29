"use server";

import { debugLog } from "@/lib/utils";
import {
  type AspiranteQueryParams,
  type Aspirante,
  getAspirantes,
} from "@/lib/data/aspirantes";

export async function fetchMoreAspirantes(
  params: AspiranteQueryParams & { limit?: number; offset?: number },
): Promise<Aspirante[]> {
  debugLog("Params passed to getAspirantes:", params);

  const aspirantes = await getAspirantes(params);
  debugLog("Fetched more aspirantes:", aspirantes);

  return aspirantes;
}
