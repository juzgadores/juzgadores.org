import { z } from "zod";
import v from "voca";

import { createTypedEnum } from "@/lib/utils";
import { ASPIRANTES_PER_PAGE } from "@/lib/constants";

import {
  judicatura as j,
  circuitoSchema,
  entidadSchema,
  materiaSchema,
  circuitoEnum,
  organoSchema,
  CircuitoKey,
  entidadEnum,
  materiaEnum,
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
  offset: z.number().min(0).default(0),
  limit: z.number().min(1).default(ASPIRANTES_PER_PAGE),

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
  morado: { bg: "#5b55a3", text: "#FFFFFF" },
  rosa: { bg: "#9e5d7b", text: "#FFFFFF" },
  verde: { bg: "#80bdb2", text: "#000000" },
  azul: { bg: "#2f647a", text: "#FFFFFF" },
  anaranjado: { bg: "#de8e66", text: "#000000" },
  amarillo: { bg: "#d9c85b", text: "#000000" },
};

/**
 * Enriched aspirante record with derived fields.
 */
export const aspiranteSchema = aspiranteRawSchema.extend({
  slug: z.string(),
  lastModified: z.date(),

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

  // Last modified date
  const lastModified = new Date("2024-12-15T06:00:00.000Z");

  const enriched: Partial<Aspirante> = {
    ...raw,
    slug: v.slugify(raw.nombre),
    lastModified,
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
  // Normalize the search term once, outside the filter function
  const textSearch = nombre && v.latinise(nombre.toLowerCase());

  return (asp: Aspirante): boolean => {
    // Organo
    if (organo && asp.organoSlug !== organo) return false;
    // Título
    if (titulo && j.organos[asp.organoSlug].titulo !== titulo) return false;
    // Sala
    if (sala && asp.salaSlug !== sala) return false;
    // Circuito
    if (circuito && asp.circuitoSlug !== circuito) return false;

    // Nombre with diacritic-insensitive comparison
    if (textSearch) {
      const normalizedName = v.latinise(asp.nombre.toLowerCase());
      if (!normalizedName.includes(textSearch.trim())) {
        return false;
      }
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

export async function getAspirantesCount(): Promise<number> {
  return rawAspirantesJson.length;
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

  const cacheKey = JSON.stringify(filters);
  const inCache = cache.has(cacheKey);

  const aspirantes = inCache
    ? cache.get(cacheKey)!
    : allAspirantes.filter(createAspiranteFilter(filters));

  if (!inCache) cache.set(cacheKey, aspirantes);

  return aspirantes.slice(offset, offset + limit);
}

/**
 * Retrieve a single aspirante by its slug, or null if not found.
 *
 * @param slug Unique slug for an aspirante
 * @returns The matching aspirante or null
 */
export async function getAspiranteBySlug(
  slug: string,
): Promise<Aspirante | null> {
  return aspiranteSlugMap[slug] ?? null;
}
