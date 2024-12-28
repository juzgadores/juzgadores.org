// src/lib/data/judicatura.ts
import { z } from "zod";

import rawJudicaturaData from "./judicatura.json" assert { type: "json" };

// -------------------------------------------
// 1) Type definitions based on JSON data
// -------------------------------------------
type Gender = "M" | "F";

type TituloData = {
  singular: Record<Gender, string>;
  plural: Record<Gender, string>;
};

type SalaData = {
  nombre: string;
  descripcion?: string;
  entidades: string[] | null;
};

type CircuitoOrganoData = {
  tipo: keyof typeof rawJudicaturaData.organos;
  materias: Array<keyof typeof rawJudicaturaData.materias>;
};

type CircuitoData = {
  nombre: string;
  entidad: keyof typeof rawJudicaturaData.entidades;
  organos: CircuitoOrganoData[];
};

type OrganoData = {
  nombre: string;
  titulo: keyof typeof rawJudicaturaData.titulos;
  conector?: string;
  siglas?: string;
  materias?: Array<keyof typeof rawJudicaturaData.materias>;
  salas?: Record<string, SalaData>;
};

// -------------------------------------------
// 2) Zod Root Schema (tailored to your JSON)
// -------------------------------------------
const salaSchema = z.object({
  nombre: z.string(),
  descripcion: z.string().optional(),
  entidades: z.array(z.string()).nullable().optional(),
});

const organoBaseSchema = z
  .object({
    nombre: z.string(),
    titulo: z.enum(["ministro", "magistrado", "juez"]),
    conector: z.string().optional(),
    siglas: z.string().optional(),
    materias: z.array(z.string()).optional(),
    salas: z.record(z.string(), salaSchema).optional(),
  })
  .passthrough();

const organosSchema = z.record(organoBaseSchema);

const circuitoOrganoSchema = z.object({
  tipo: z.string(),
  materias: z.array(z.string()),
});

const circuitoSchema = z.object({
  nombre: z.string(),
  entidad: z.string(),
  organos: z.array(circuitoOrganoSchema),
});

const rootSchema = z.object({
  organos: organosSchema,
  circuitos: z.record(circuitoSchema),
  materias: z.record(z.string(), z.string()),
  titulos: z.record(
    z.string(),
    z.object({
      singular: z.record(z.union([z.literal("M"), z.literal("F")]), z.string()),
      plural: z.record(z.union([z.literal("M"), z.literal("F")]), z.string()),
    }),
  ),
  entidades: z.record(z.string(), z.string()),
});

// -------------------------------------------
// 3) Parse the JSON exactly once
// -------------------------------------------
export const judicaturaData = rootSchema.parse(rawJudicaturaData);

// -------------------------------------------
// 4) Re-export each top-level object
// -------------------------------------------
export const organos = judicaturaData.organos;
export const circuitos = judicaturaData.circuitos;
export const materias = judicaturaData.materias;
export const titulos = judicaturaData.titulos;
export const entidades = judicaturaData.entidades;

// -------------------------------------------
// 5) Type aliases derived from JSON data
// -------------------------------------------
export type OrganoKey = keyof typeof organos;
export type CircuitoKey = keyof typeof circuitos;
export type MateriaKey = keyof typeof materias;
export type TituloKey = keyof typeof titulos;
export type EntidadKey = keyof typeof entidades;
export type SalaKey = keyof (typeof organos)["tepjf"]["salas"];

// Export type definitions for use in other files
export type {
  CircuitoOrganoData,
  CircuitoData,
  TituloData,
  OrganoData,
  SalaData,
  Gender,
};
