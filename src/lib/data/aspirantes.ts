import { drop, take } from "lodash-es";

import { z } from "zod";
import v from "voca";

import { judicatura as j, judicaturaData, Judicatura } from "./judicatura";

export type PaginationParams = {
  offset?: number;
  limit?: number;
};

type AspiranteRaw = z.infer<typeof aspiranteRawSchema>;

export type Aspirante = z.infer<typeof aspiranteSchema>;

export const aspiranteFiltersSchema = z.object({
  nombre: z.string().optional(),
  titulo: z.enum(Object.keys(j.titulos) as [string, ...string[]]).optional(),
  entidad: z.enum(Object.keys(j.entidades) as [string, ...string[]]).optional(),
  organo: z.enum(Object.keys(j.organos) as [string, ...string[]]).optional(),
  circuito: z
    .enum(Object.keys(j.circuitos) as [string, ...string[]])
    .optional(),
  sala: z
    .enum(
      Object.keys(judicaturaData.organos.tepjf.salas ?? {}) as [
        string,
        ...string[],
      ],
    )
    .optional(),
});

export type AspiranteFilters = z.infer<typeof aspiranteFiltersSchema>;

const aspiranteRawSchema = z.object({
  organo: z.enum(Object.keys(j.organos) as [string, ...string[]]),
  nombre: z.string(),
  genero: z.enum(["Masculino", "Femenino", "Indistinto"]),
  circuito: z
    .enum(Object.keys(j.circuitos) as [string, ...string[]])
    .optional(),
  materia: z.string().optional(),
  sala: z
    .enum(
      Object.keys(judicaturaData.organos.tepjf.salas ?? {}) as [
        string,
        ...string[],
      ],
    )
    .optional(),
  expediente: z.string(),
});

export const aspiranteSchema = aspiranteRawSchema.extend({
  slug: z.string(),
  cargo: z.string(),
  entidad: z.string().optional(),
  organoSlug: z.enum(Object.keys(j.organos) as [string, ...string[]]),
  organo: z.lazy(() =>
    z.custom<Judicatura["organos"][keyof Judicatura["organos"]]>(),
  ),
});

const cache = new Map<string, Aspirante[]>();

function getCircuitoEntidad(circuito: string | undefined): string | undefined {
  return Object.values(j.circuitos).find(({ nombre }) => {
    return nombre === circuito;
  })?.entidad;
}

function getSalaEntidad(entidad: string): boolean {
  return Object.values(judicaturaData.organos.tepjf.salas ?? {}).some(
    (sala) => sala.entidades?.includes(entidad) ?? false,
  );
}

export async function getAspirantes(
  params: AspiranteFilters & PaginationParams = {},
): Promise<Aspirante[]> {
  const cacheKey = JSON.stringify(params);
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  // Load aspirantes data
  const aspirantesData = (await import("./aspirantes.json")).default.map(
    (data) => aspiranteRawSchema.parse(data),
  );

  // Filter data
  const {
    entidad,
    titulo,
    sala,
    organo,
    circuito,
    offset = 0,
    limit = 10_000,
  } = params;
  const filtered = aspirantesData.filter((aspirante) => {
    // Filter by organo
    if (organo && aspirante.organo !== organo) {
      return false;
    }

    // Filter by titulo
    if (
      titulo &&
      j.organos[aspirante.organo as keyof typeof j.organos].titulo !== titulo
    ) {
      return false;
    }

    // Filter by sala
    if (sala && aspirante.sala !== sala) {
      return false;
    }

    // Filter by circuito
    if (circuito && aspirante.circuito !== circuito) {
      return false;
    }

    // Filter by entidad
    if (entidad !== undefined) {
      const circuitoEnt = getCircuitoEntidad(aspirante.circuito);
      const salaEnt = getSalaEntidad(entidad?.toString() ?? "");

      if (!salaEnt && circuitoEnt !== entidad) return false;
      if (!salaEnt && circuitoEnt !== entidad) return false;
      if (salaEnt && circuitoEnt !== entidad) return false;
    }

    return true;
  });

  const paginated = take(drop(filtered, offset), limit).map(enrichAspirante);

  cache.set(cacheKey, paginated);

  return paginated;
}

export async function getAspiranteBySlug(
  slug: string,
): Promise<Aspirante | null> {
  const rawData = (await import("./aspirantes.json")).default;
  const found = rawData.find((obj) => v.slugify(obj.nombre) === slug);

  return found ? enrichAspirante(aspiranteRawSchema.parse(found)) : null;
}

export function enrichAspirante(aspirante: AspiranteRaw): Aspirante {
  const organo = j.organos[aspirante.organo as keyof typeof j.organos];

  const titulo =
    j.titulos[organo.titulo as keyof typeof j.titulos].singular[
      aspirante.genero === "Femenino" ? "F" : "M"
    ];

  const cargo = `${titulo} ${organo.conector ?? "de"} ${organo.nombre}`;

  return aspiranteSchema.parse({
    ...aspirante,
    slug: v.slugify(aspirante.nombre),
    organoSlug: aspirante.organo,
    titulo,
    cargo,
    organo,
  });
}
