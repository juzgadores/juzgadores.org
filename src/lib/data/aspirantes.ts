import { drop, take } from "lodash-es";

import { z } from "zod";
import v from "voca";

// Bring in the actual data objects and the key types
import {
  type CircuitoKey,
  type EntidadKey,
  type MateriaKey,
  type OrganoKey,
  type TituloKey,
  type SalaKey,
  circuitos,
  entidades,
  materias,
  organos,
  titulos,
} from "./judicatura";
import rawAspirantesJson from "./aspirantes.json" assert { type: "json" };
import {
  type ColorName,
  createTypedEnum,
  getColorName,
  colors,
} from "../utils";

// ---------- Types & Schemas ----------
export type PaginationParams = {
  offset?: number;
  limit?: number;
};

/**
 * We'll allow filtering by the "organo" keys that definitely exist in your JSON:
 * scjn, tdj, tepjf, etc.
 */
export const aspiranteFiltersSchema = z.object({
  nombre: z.string().optional(),
  titulo: createTypedEnum<TituloKey>(titulos).optional(),
  entidad: createTypedEnum<EntidadKey>(entidades).optional(),
  organo: createTypedEnum<OrganoKey>(organos).optional(),
  circuito: createTypedEnum<CircuitoKey>(circuitos).optional(),
  sala: createTypedEnum<SalaKey>(organos.tepjf.salas || {}).optional(),
});
export type AspiranteFilters = z.infer<typeof aspiranteFiltersSchema>;

/**
 * Minimal shape (raw) from aspirantes.json
 */
const aspiranteRawSchema = z.object({
  organo: createTypedEnum<OrganoKey>(organos),
  nombre: z.string(),
  genero: z.enum(["Masculino", "Femenino", "Indistinto"]),
  circuito: createTypedEnum<CircuitoKey>(circuitos).optional(),
  materia: createTypedEnum<MateriaKey>(materias).optional(),
  sala: createTypedEnum<SalaKey>(organos.tepjf.salas || {}).optional(),
  expediente: z.string(),
});
export type AspiranteRaw = z.infer<typeof aspiranteRawSchema>;

/**
 * We know each organo is typed. So let's define a small "organoSchema" from your "organos".
 * But we already typed it in "judicatura.ts" as "organoBaseSchema" with .passthrough().
 * Alternatively, you can just do a `z.any()` if you trust the data—but let's be more strict:
 */
const organoBaseSchema = z
  .object({
    nombre: z.string(),
    titulo: z.enum(["ministro", "magistrado", "juez"] as [
      TituloKey,
      ...TituloKey[],
    ]),
    conector: z.string().optional(),
    siglas: z.string().optional(),
    materias: z.array(z.string()).optional(),
    salas: z
      .record(
        z.string(),
        z.object({
          nombre: z.string(),
          descripcion: z.string().optional(),
          entidades: z.array(z.string()).nullable().optional(),
        }),
      )
      .optional(),
  })
  .passthrough();

// For "tepjf.salas[key]"
const salaSchema = z.object({
  nombre: z.string(),
  descripcion: z.string().optional(),
  entidades: z.array(z.string()).nullable().optional(),
});

/**
 * The final shape after we enrich an Aspirante with:
 *  - slug
 *  - cargo
 *  - entity references (organo, sala, materia, etc.)
 */
export const aspiranteSchema = aspiranteRawSchema.extend({
  slug: z.string(),
  cargo: z.string(),
  entidad: z.string().optional(),

  organoSlug: createTypedEnum<OrganoKey>(organos),
  organo: organoBaseSchema,

  salaSlug: createTypedEnum<SalaKey>(organos.tepjf.salas || {}).optional(),
  sala: salaSchema.optional(),

  materiaSlug: createTypedEnum<MateriaKey>(materias).optional(),
  materia: z.string().optional(),

  color: z.object({
    name: createTypedEnum<ColorName>(colors),
    bg: z.string(),
    text: z.string(),
  }),

  titulo: z.string().optional(),
});

export type Aspirante = z.infer<typeof aspiranteSchema>;

// ---------- Precompute Maps for Quick Lookups ----------
/** Map "Primero" -> "CMX", "Segundo" -> "MEX", etc. */
const circuitEntityMap: Record<string, string> = Object.entries(
  circuitos,
).reduce(
  (acc, [_, circ]) => {
    acc[circ.nombre] = circ.entidad;
    return acc;
  },
  {} as Record<string, string>,
);

/** Because `tepjf.salas` is a record of key -> Sala object, store each key’s `.entidades`. */
const salaEntitiesMap: Record<string, string[] | null | undefined> =
  Object.entries(organos.tepjf.salas || {}).reduce(
    (acc, [key, sala]) => {
      acc[key] = sala.entidades;
      return acc;
    },
    {} as Record<string, string[] | null | undefined>,
  );

// ---------- Parse & Enrich Aspirantes (single time) ----------
const rawAspirantesData = rawAspirantesJson.map((data) =>
  aspiranteRawSchema.parse(data),
);

const allAspirantes: Aspirante[] = rawAspirantesData.map(enrichAspirante);

// ---------- Build slug map for O(1) lookups ----------
const aspiranteSlugMap: Record<string, Aspirante> = allAspirantes.reduce(
  (acc, asp) => {
    acc[asp.slug] = asp;
    return acc;
  },
  {} as Record<string, Aspirante>,
);

// ---------- Caching of Filtered Results ----------
const cache = new Map<string, Aspirante[]>();

// ---------- Filter logic in functional style ----------
function applyFilters(params: AspiranteFilters) {
  return (asp: Aspirante): boolean => {
    const { nombre, titulo, organo, sala, circuito, entidad } = params;

    // organo
    if (organo && asp.organoSlug !== organo) return false;
    // titulo
    if (titulo && organos[asp.organoSlug].titulo !== titulo) return false;
    // sala
    if (sala && asp.salaSlug !== sala) return false;
    // circuito
    if (circuito && asp.circuito !== circuito) return false;
    // nombre
    if (nombre && !asp.nombre.toLowerCase().includes(nombre.toLowerCase())) {
      return false;
    }

    // entidad
    if (entidad !== undefined) {
      const circuitEnt = asp.circuito
        ? circuitEntityMap[asp.circuito]
        : undefined;
      const salaEnts = asp.salaSlug ? salaEntitiesMap[asp.salaSlug] : null;
      const coversSala = Array.isArray(salaEnts) && salaEnts.includes(entidad);

      if (!coversSala && circuitEnt !== entidad) return false;
    }

    return true;
  };
}

// ---------- Exported Functions ----------
export function getAspirantes(
  params: AspiranteFilters & PaginationParams = {},
): Aspirante[] {
  const cacheKey = JSON.stringify(params);
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  const { offset = 0, limit = 10000 } = params;
  const predicate = applyFilters(params);

  const filtered = allAspirantes.filter(predicate);
  const paginated = take(drop(filtered, offset), limit);

  cache.set(cacheKey, paginated);
  return paginated;
}

export function getAspiranteBySlug(slug: string): Aspirante | null {
  return aspiranteSlugMap[slug] ?? null;
}

/** Helper to unify how we create the final Aspirante object. */
function enrichAspirante(raw: AspiranteRaw): Aspirante {
  // 1) We can index organos by raw.organo, no error
  const organoObj = organos[raw.organo];
  // 2) Find final titulo
  const tituloData = titulos[organoObj.titulo];
  const genderKey = raw.genero === "Femenino" ? "F" : "M";
  const finalTitulo = tituloData
    ? tituloData.singular[genderKey]
    : organoObj.titulo;

  // 3) sala object
  const salaObj = raw.sala
    ? organos.tepjf.salas?.[raw.sala as SalaKey]
    : undefined;
  // 4) materia is just a string (like "Penal", "Amparo Penal", etc.)
  const materiaVal = raw.materia ? materias[raw.materia] : undefined;

  // 5) cargo
  const cargo = `${finalTitulo} ${organoObj.conector ?? "de"} ${organoObj.nombre}`;

  // 6) color
  const name = getColorName(raw.organo, organoObj.titulo, raw.sala as SalaKey);
  const [bg, text] = colors[name];

  // Build partial object, then parse
  const enriched: Partial<Aspirante> = {
    ...raw,
    cargo,
    slug: v.slugify(raw.nombre),
    organoSlug: raw.organo,
    organo: organoObj,
    salaSlug: raw.sala,
    sala: salaObj,
    materiaSlug: raw.materia,
    materia: materiaVal,
    titulo: finalTitulo,
    color: { name, bg, text },
  };

  return aspiranteSchema.parse(enriched);
}
