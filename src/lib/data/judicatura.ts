// src/lib/data/judicatura.ts
import { z } from "zod";

import { createTypedEnum } from "@/lib/utils";

import j from "./judicatura.json" assert { type: "json" };

export const genderEnum = z.enum(["Masculino", "Femenino", "Indistinto"]);

export type Gender = z.infer<typeof genderEnum>;

export const entidadEnum = createTypedEnum<EntidadKey>(j.entidades);
export const materiaEnum = createTypedEnum<MateriaKey>(j.materias);
export const salaEnum = createTypedEnum<SalaKey>(j.organos.tepjf.salas);
export const tituloEnum = createTypedEnum<TituloKey>(j.titulos);
export const circuitoEnum = createTypedEnum<CircuitoKey>(j.circuitos);
export const organoEnum = createTypedEnum<OrganoKey>(j.organos);

export const salaSchema = z.object({
  nombre: z.string(),
  descripcion: z.string().optional(),
  entidades: z.array(entidadEnum),
});

export const organoSchema = z.object({
  nombre: z.string(),
  siglas: z.string().toUpperCase().optional(),
  salas: z.record(salaSchema).optional(),
  materias: z.array(materiaEnum).optional(),
  conector: z.string().optional(),
  titulo: tituloEnum,
});

export const entidadSchema = z.object({
  nombre: z.string(),
});

export const materiaSchema = z.object({
  nombre: z.string(),
  materias: z.array(materiaEnum).default([]).optional(),
});

export const tituloSchema = z.object({
  singular: z.record(genderEnum, z.string()),
  plural: z.record(genderEnum, z.string()),
});

export const circuitoSchema = z.object({
  numero: z.number().int().min(1).max(32),
  nombre: z.string(),
  entidad: entidadEnum,
  organos: z.array(
    z
      .object({
        tipo: z.string(),
        materias: z.array(materiaEnum),
      })
      .optional(),
  ),
});

export const judicaturaSchema = z.object({
  organos: z.record(organoSchema),
  titulos: z.record(tituloSchema),
  materias: z.record(materiaSchema),
  circuitos: z.record(circuitoSchema),
  entidades: z.record(entidadSchema),
});

export type OrganoKey = keyof typeof j.organos;
export type CircuitoKey = keyof typeof j.circuitos;
export type MateriaKey = keyof typeof j.materias;
export type TituloKey = keyof typeof j.titulos;
export type EntidadKey = keyof typeof j.entidades;
export type SalaKey = keyof (typeof j.organos)["tepjf"]["salas"];

export type Organo = z.infer<typeof organoSchema>;
export type Circuito = z.infer<typeof circuitoSchema>;
export type Materia = z.infer<typeof materiaSchema>;
export type Titulo = z.infer<typeof tituloSchema>;
export type Entidad = z.infer<typeof entidadSchema>;
export type Sala = z.infer<typeof salaSchema>;

export const judicatura = judicaturaSchema.parse(j);
