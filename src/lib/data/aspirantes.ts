/**
 * Aspirantes data module
 *
 * This module serves as a shared library for both Server (SSR/ISR/RSC) and Client
 * components in Next.js 15 (App Router). It provides:
 *
 *  1. Data schemas (Zod) and TypeScript types for `Aspirante`.
 *  2. An enriched in-memory store of aspirantes, with convenience functions for filtering, pagination, and direct lookups.
 */

import { drop, take } from "lodash-es";

import { z } from "zod";
import v from "voca";

import { createTypedEnum } from "@/lib/utils";

import {
  judicatura as j,
  circuitoSchema,
  entidadSchema,
  materiaSchema,
  circuitoEnum,
  organoSchema,
  entidadEnum,
  materiaEnum,
  CircuitoKey,
  genderEnum,
  organoEnum,
  salaSchema,
  tituloEnum,
  salaEnum,
} from "./judicatura";
import rawAspirantesJson from "./aspirantes.json" assert { type: "json" };

/**
 * Query filters for listing aspirantes.
 */
export const aspiranteQueryParamsSchema = z.object({
  // Pagination
  offset: z.number().min(0).default(0).optional(),
  limit: z.number().min(1).default(12).optional(),
  // Filters
  nombre: z.string().optional(),
  titulo: tituloEnum.optional(),
  entidad: entidadEnum.optional(),
  organo: organoEnum.optional(),
  circuito: circuitoEnum.optional(),
  sala: salaEnum.optional(),
  materia: materiaEnum.optional(),
  genero: genderEnum.optional(),
});

export type AspiranteQueryParams = z.infer<typeof aspiranteQueryParamsSchema>;

/**
 * Raw aspirante record from JSON.
 */
const aspiranteRawSchema = z.object({
  nombre: z.string(),
  organo: organoEnum,
  genero: genderEnum,
  circuito: circuitoEnum.optional(),
  materia: materiaEnum.optional(),
  sala: salaEnum.optional(),
  expediente: z.string(),
  numero: z.number().optional(),
});
export type AspiranteRaw = z.infer<typeof aspiranteRawSchema>;

type ColorName =
  | "morado"
  | "rosa"
  | "verde"
  | "azul"
  | "anaranjado"
  | "amarillo";

const colors: Record<ColorName, { bg: string; text: string }> = {
  morado: { bg: "#8882D3", text: "#FFFFFF" },
  rosa: { bg: "#C18CA4", text: "#FFFFFF" },
  verde: { bg: "#83C8BC", text: "#000000" },
  azul: { bg: "#3D7D98", text: "#FFFFFF" },
  anaranjado: { bg: "#F5C5B8", text: "#000000" },
  amarillo: { bg: "#F1DB4B", text: "#000000" },
};

/**
 * Enriched aspirante record with derived fields.
 */
export const aspiranteSchema = aspiranteRawSchema.extend({
  slug: z.string(),

  tituloSlug: tituloEnum,
  titulo: z.string(),

  organoSlug: organoEnum,
  organo: organoSchema,

  entidadSlug: entidadEnum.optional(),
  entidad: entidadSchema.optional(),

  salaSlug: salaEnum.optional(),
  sala: salaSchema.optional(),

  materiaSlug: materiaEnum.optional(),
  materia: materiaSchema.optional(),

  circuitoSlug: circuitoEnum.optional(),
  circuito: circuitoSchema.optional(),

  color: z.object({
    name: createTypedEnum<ColorName>(colors),
    bg: z.string(),
    text: z.string(),
  }),

  cargo: z.string(),
});
export type Aspirante = z.infer<typeof aspiranteSchema>;

/**
 * Enrich a raw aspirante record:
 *  - Build a consistent `slug` from the name
 *  - Fill in the organo object
 *  - Determine final "titulo" (ministro vs ministra, etc.)
 *  - Provide a user-facing "cargo" string
 *  - Provide final `.materia`
 *  - Provide final `.circuito` & `.entidad` from references
 *  - Provide color info
 */
function enrichAspirante(raw: AspiranteRaw): Aspirante {
  // Órgano
  const organoSlug = raw.organo;
  const organo = j.organos[organoSlug];

  // Título & Cargo
  const titulo = j.titulos[organo.titulo].singular[raw.genero];
  const cargo = `${titulo} ${organo.conector} ${organo.nombre}`;

  // Derive color name
  const colorName = getColorName(raw);

  const enriched: Partial<Aspirante> = {
    ...raw,
    slug: v.slugify(raw.nombre),
    organoSlug,
    organo,
    tituloSlug: organo.titulo,
    titulo,
    cargo,
    salaSlug: raw.sala,
    sala: raw.sala ? organo.salas?.[raw.sala] : undefined,
    materiaSlug: raw.materia,
    materia: raw.materia ? j.materias[raw.materia] : undefined,
    circuitoSlug: raw.circuito,
    circuito: raw.circuito ? j.circuitos[raw.circuito] : undefined,
    entidadSlug: raw.circuito ? j.circuitos[raw.circuito]?.entidad : undefined,
    entidad: raw.circuito
      ? j.entidades[j.circuitos[raw.circuito]?.entidad]
      : undefined,
    color: {
      name: colorName,
      ...colors[colorName],
    },
  };

  return aspiranteSchema.parse(enriched);
}

/**
 * Determine which color applies to an aspirante, based on organo & sala.
 */
function getColorName({ organo, sala }: AspiranteRaw): ColorName {
  const { titulo } = j.organos[organo];

  // Ministros SCJN
  if (titulo === "ministro") return "morado";

  // Jueces de Distrito
  if (titulo === "juez") return "amarillo";

  // Magistrados del Tribunal de Disciplina Judicial
  if (organo === "tdj") return "verde";

  // Magistrados Electorales (TEPJF)
  if (organo === "tepjf") {
    return sala === "superior" ? "rosa" : "anaranjado";
  }

  // Magistrados de Circuito
  return "azul";
}

/* ------------------------------------------------------------------
 * 3. BUILD IN-MEMORY STORE
 * ------------------------------------------------------------------ */

/**
 * Parse and enrich raw aspirantes from JSON data.
 */
const allAspirantes: Aspirante[] = rawAspirantesJson.map((obj) =>
  enrichAspirante(aspiranteRawSchema.parse(obj)),
);

/**
 * A precomputed slug -> Aspirante map for O(1) lookups.
 */
const aspiranteSlugMap: Record<string, Aspirante> = allAspirantes.reduce(
  (acc, asp) => {
    acc[asp.slug] = asp;
    return acc;
  },
  {} as Record<string, Aspirante>,
);

/**
 * Optional: an in-memory cache of filtered results. Clears whenever the server restarts.
 */
const cache = new Map<string, Aspirante[]>();

/**
 * A quick map of CircuitoKey -> EntidadKey for cross-checking.
 */
const circuitEntityMap: Record<CircuitoKey, string> = Object.entries(
  j.circuitos,
).reduce(
  (acc, [key, value]) => {
    acc[key as CircuitoKey] = value.entidad;
    return acc;
  },
  {} as Record<CircuitoKey, string>,
);

/**
 * Returns a filter function that tests if an aspirante satisfies
 * the provided filters.
 */
function createAspiranteFilter({
  nombre,
  titulo,
  organo,
  sala,
  circuito,
  entidad,
}: Omit<AspiranteQueryParams, "limit" | "offset">) {
  return (asp: Aspirante): boolean => {
    // Organo
    if (organo && asp.organoSlug !== organo) return false;
    // Título
    if (titulo && j.organos[asp.organoSlug].titulo !== titulo) return false;
    // Sala
    if (sala && asp.salaSlug !== sala) return false;
    // Circuito
    if (circuito && asp.circuitoSlug !== circuito) return false;

    // Nombre (stub: if you want fuzzy search, add it here)
    if (nombre && !asp.nombre.toLowerCase().includes(nombre.toLowerCase())) {
      return false;
    }

    // Entidad (if the aspirante is from a certain circuit, compare)
    if (entidad) {
      const circuitEnt =
        asp.circuito && asp.circuitoSlug
          ? circuitEntityMap[asp.circuitoSlug]
          : undefined;
      if (circuitEnt !== entidad) return false;
    }

    return true;
  };
}

/**
 * Retrieve a paginated list of aspirantes, optionally filtered.
 *
 * @param params Query filters and pagination details
 * @returns A Promise with a list of matching aspirantes
 */
export async function getAspirantes(
  params: AspiranteQueryParams,
): Promise<Aspirante[]> {
  const { offset, limit, ...filters } = params;

  // Check cache first
  const cacheKey = JSON.stringify(filters);
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    return take(drop(cached, offset), limit);
  }

  // Filter in-memory, then paginate
  const filtered = allAspirantes.filter(createAspiranteFilter(filters));
  const paginated = take(drop(filtered, offset), limit);

  // Store paginated results in cache
  cache.set(cacheKey, filtered);

  return paginated;
}

/**
 * Retrieve a single aspirante by its slug, or null if not found.
 *
 * @param slug Unique slug for an aspirante
 * @returns The matching aspirante or null
 */
export function getAspiranteBySlug(slug: string): Aspirante | null {
  return aspiranteSlugMap[slug] ?? null;
}
