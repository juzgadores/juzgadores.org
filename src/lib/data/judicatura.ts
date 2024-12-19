import { z } from "zod";

import judicaturaData from "./judicatura.json";

export type Judicatura = typeof judicaturaData;

export type OrganoKey = keyof typeof judicaturaData.organos;
export type Organo = (typeof judicaturaData.organos)[OrganoKey];

export type TituloKey = keyof typeof judicaturaData.titulos;
export type Titulo = (typeof judicaturaData.titulos)[TituloKey];

export type EntidadKey = keyof typeof judicaturaData.entidades;
export type Entidad = (typeof judicaturaData.entidades)[EntidadKey];

export type MateriaKey = keyof typeof judicaturaData.materias;
export type Materia = (typeof judicaturaData.materias)[MateriaKey];

export type CircuitoKey = keyof typeof judicaturaData.circuitos;
export type Circuito = (typeof judicaturaData.circuitos)[CircuitoKey];

export type SalaKey = keyof typeof judicaturaData.organos.tepjf.salas;
export type Sala = (typeof judicaturaData.organos.tepjf.salas)[SalaKey];

// export type Sala = (typeof judicaturaData.salas)[SalaKey];

export type JudicaturaData = {
  organos: Record<OrganoKey, Organo>;
  titulos: Record<TituloKey, Titulo>;
  materias: Record<MateriaKey, Materia>;
  entidades: Record<EntidadKey, Entidad>;
  circuitos: Record<CircuitoKey, Circuito>;
};

export { judicaturaData };

export const judicatura = judicaturaData as unknown as JudicaturaData;

export const endidadesNombres = Object.values(
  judicatura.entidades,
) as Entidad[];
export const endidadesCodigos = Object.keys(
  judicatura.entidades,
) as EntidadKey[];

const salaSchema = z.object({
  slug: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),
  entidades: z.array(z.string()).optional(),
});

const organoBaseSchema = z
  .object({
    nombre: z.string(),
    titulo: z.string(),
    materias: z.array(z.string()).optional(),
    siglas: z.string().optional(),
    salas: z.array(salaSchema).optional(),
  })
  .describe("Órgano base schema");

const organosSchema = z
  .object({
    "juzgados-distrito": organoBaseSchema.extend({
      materias: z.array(z.string()),
    }),
    "tribunales-colegiados-circuito": organoBaseSchema.extend({
      materias: z.array(z.string()),
    }),
    "centros-justicia-penal-federal": organoBaseSchema.extend({
      // puesto in original is "juez-" but we'll treat as string
      materias: z.array(z.string()),
    }),
    "tribunales-federales-laborales": organoBaseSchema.extend({
      materias: z.array(z.string()),
    }),
    "tribunales-unitarios-circuito": organoBaseSchema.extend({
      materias: z.array(z.string()),
    }),
    "tribunales-colegiados-apelacion": organoBaseSchema.extend({
      materias: z.array(z.string()),
    }),
    scjn: organoBaseSchema.extend({
      siglas: z.string(),
    }),
    tjd: organoBaseSchema.extend({
      siglas: z.string(),
    }),
    tepjf: organoBaseSchema.extend({
      siglas: z.string(),
      materias: z.array(z.string()),
      salas: z.array(salaSchema),
    }),
  })
  .describe("Órganos schema");

const circuitoOrganoSchema = z
  .object({
    tipo: z.string(),
    materias: z.array(z.string()),
  })
  .describe("Circuito organo schema");

const circuitoSchema = z
  .object({
    nombre: z.string(),
    entidad: z.string(),
    organos: z.array(circuitoOrganoSchema),
  })
  .describe("Circuito schema");

const materiasSchema = z
  .record(z.string(), z.string())
  .describe("Materias schema");

const puestoSchema = z
  .object({
    singularMasculino: z.string(),
    singularFemenino: z.string(),
    pluralMasculino: z.string(),
    pluralFemenino: z.string(),
  })
  .describe("Puesto schema");

const puestosSchema = z
  .record(z.string(), puestoSchema)
  .describe("Puestos schema");

// The full root schema
const rootSchema = z
  .object({
    organos: organosSchema,
    circuitos: z.array(circuitoSchema),
    materias: materiasSchema,
    puestos: puestosSchema,
  })
  .describe("Root schema");

export type RootType = z.infer<typeof rootSchema>;
